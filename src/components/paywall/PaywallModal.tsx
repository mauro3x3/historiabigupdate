import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

const proFeatures = [
  'Custom background wallpapers on your profile',
  'Offline mode',
  'Skip modules (10 skips/month)',
  'Unlimited Voice Mode',
  'Special badge for early supporters',
];

const PaywallModal: React.FC<PaywallModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email;
    const user_id = user?.id;
    if (!email || !user_id) {
      setLoading(false);
      alert('You must be logged in to upgrade.');
      return;
    }
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, email }),
      });
      const data = await res.json();
      // Log the response for debugging
      console.log('Stripe checkout response:', data);
      // Show an alert if there's an error or no URL
      if (!data.url) {
        alert('Stripe error: ' + (data.error || 'No URL returned'));
        setLoading(false);
        return;
      }
      window.location.href = data.url;
      setLoading(false);
    } catch (err) {
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-extrabold text-timelingo-purple mb-4 text-center">Upgrade to Pro</h2>
        <ul className="mb-6 space-y-3">
          {proFeatures.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-lg">
              <span className="text-yellow-500">★</span> {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={handleUpgrade}
          className="w-full py-3 rounded-full bg-gradient-to-r from-timelingo-gold to-yellow-400 text-timelingo-navy font-bold text-lg shadow-lg hover:from-yellow-400 hover:to-timelingo-gold transition-all disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Redirecting...' : 'Upgrade to Pro'}
        </button>
        <div className="text-center text-gray-400 text-xs mt-4">Cancel anytime. Early supporters get a special badge!</div>
      </div>
    </div>
  );
};

export default PaywallModal; 