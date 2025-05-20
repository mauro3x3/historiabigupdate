import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface Wish {
  id: string;
  text: string;
  votes: number;
  created_at: string;
}

const DISCORD_URL = 'https://discord.gg/9M7pEHEU';
const TWITTER_URL = 'https://twitter.com/heyhistoria';

const UpvotingBoard = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch wishes from Supabase
  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('votes', { ascending: false })
        .order('created_at', { ascending: true });
      if (!error && data) setWishes(data);
      setLoading(false);
    };
    fetchWishes();
  }, []);

  // Add a new wish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length === 0) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('wishes')
      .insert([{ text: input.trim() }])
      .select();
    if (!error && data && data[0]) {
      setWishes(prev => [data[0], ...prev]);
      setInput('');
    }
    setSubmitting(false);
  };

  // Upvote a wish
  const handleUpvote = async (id: string) => {
    const wish = wishes.find(w => w.id === id);
    if (!wish) return;
    const { data, error } = await supabase
      .from('wishes')
      .update({ votes: wish.votes + 1 })
      .eq('id', id)
      .select();
    if (!error && data && data[0]) {
      setWishes(wishes =>
        wishes.map(w =>
          w.id === id ? { ...w, votes: data[0].votes } : w
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 relative">
      {/* Social icons top right */}
      <div className="absolute top-6 right-8 flex gap-4 z-10">
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Join our Discord"
          className="rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white p-2 shadow transition-colors duration-150 flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {/* @ts-expect-error react-icons JSX type issue */}
          <FaDiscord size={22} />
        </a>
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Follow us on X (Twitter)"
          className="rounded-full bg-black hover:bg-gray-800 text-white p-2 shadow transition-colors duration-150 flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {/* @ts-expect-error react-icons JSX type issue */}
          <FaXTwitter size={22} />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-4 mt-12">Upvoting Board</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Suggest new features, report bugs, or upvote what you want to see next!
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 w-full max-w-xl">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-timelingo-purple"
          type="text"
          placeholder="Your wish or bug (e.g. 'Add dark mode', 'Fix login bug')"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          className="bg-timelingo-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-timelingo-gold transition"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <div className="w-full max-w-xl space-y-4">
        {loading ? (
          <div className="text-gray-400 text-center">Loading...</div>
        ) : wishes.length === 0 ? (
          <div className="text-gray-400 text-center">No wishes yet. Be the first!</div>
        ) : (
          wishes
            .sort((a, b) => b.votes - a.votes)
            .map(wish => (
              <div key={wish.id} className="flex items-center justify-between bg-white rounded-lg shadow p-4">
                <div className="text-lg text-gray-800">{wish.text}</div>
                <button
                  onClick={() => handleUpvote(wish.id)}
                  className="flex items-center gap-2 bg-timelingo-gold/80 hover:bg-timelingo-gold text-white px-3 py-1 rounded-lg font-bold transition"
                  aria-label="Upvote"
                >
                  ⬆️ {wish.votes}
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default UpvotingBoard; 