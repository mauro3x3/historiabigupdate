import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    let priceId = process.env.STRIPE_PRICE_ID;
    // Support both JSON and form POSTs
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      if (req.body && req.body.price_id) priceId = req.body.price_id;
    } else if (req.body && (req.body.lookup_key || req.body.price_id)) {
      priceId = req.body.lookup_key || req.body.price_id;
    }
    if (!priceId) {
      return res.status(400).json({ error: 'No price ID provided' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'https://www.heyhistoria.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://www.heyhistoria.com'}/cancel`,
    });
    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 