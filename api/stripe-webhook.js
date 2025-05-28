import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;
  let rawBody = '';
  await new Promise((resolve) => {
    req.on('data', (chunk) => { rawBody += chunk; });
    req.on('end', resolve);
  });

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle subscription creation
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { customer, subscription, metadata } = session;
    const user_id = metadata?.user_id; // We'll add this in the next step

    if (user_id) {
      const stripeSub = await stripe.subscriptions.retrieve(subscription);
      await supabase
        .from('subscriptions')
        .upsert({
          user_id,
          stripe_customer_id: customer,
          stripe_subscription_id: subscription,
          status: stripeSub.status,
          current_period_end: new Date(stripeSub.current_period_end * 1000)
        }, { onConflict: ['user_id'] });
    }
  }

  // Handle subscription cancellation
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);
  }

  res.json({ received: true });
} 