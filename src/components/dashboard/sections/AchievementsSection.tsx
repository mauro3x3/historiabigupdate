import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or image path
}

interface UserAchievement {
  achievement_id: string;
  date_earned: string;
}

const sampleAchievements: (Achievement & { unlocked?: boolean; rarity?: string })[] = [
  {
    id: 'first_lesson',
    name: 'First Lesson Completed',
    description: 'Congrats on completing your first lesson!',
    icon: '🥇',
    unlocked: true,
    rarity: 'Unlocked by 12% of users',
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Perfect score on a quiz!',
    icon: '🧠',
    unlocked: false,
    rarity: 'Unlocked by 3% of users',
  },
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: '3-day learning streak!',
    icon: '🔥',
    unlocked: true,
    rarity: 'Unlocked by 8% of users',
  },
  {
    id: 'history_buff',
    name: 'History Buff',
    description: 'Mastered an era!',
    icon: '📜',
    unlocked: false,
    rarity: 'Unlocked by 2% of users',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Tried lessons from 3 different eras!',
    icon: '🌍',
    unlocked: false,
    rarity: 'Unlocked by 5% of users',
  },
  {
    id: 'daily_challenger',
    name: 'Daily Challenger',
    description: 'Completed a daily challenge!',
    icon: '📅',
    unlocked: true,
    rarity: 'Unlocked by 7% of users',
  },
];

const AchievementsSection: React.FC = () => {
  const [achievements, setAchievements] = useState<(Achievement & { unlocked: boolean })[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: all, error: allError } = await supabase
          .from('achievements')
          .select('*');
        const { data: user, error: userError } = await supabase
          .from('user_achievements')
          .select('achievement_id, date_earned');
        if (allError || userError) throw new Error('Fetch failed');
        setUserAchievements(user || []);
        const unlockedIds = new Set((user || []).map(a => a.achievement_id));
        setAchievements(
          (all || []).map(a => ({ ...a, unlocked: unlockedIds.has(a.id) }))
        );
      } catch (e) {
        setError(true);
        setAchievements(sampleAchievements as any);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter(
    (ach) =>
      ach.name.toLowerCase().includes(search.toLowerCase()) ||
      ach.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        <div className="text-gray-500">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Achievements</h2>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search achievements..."
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-timelingo-purple"
        />
      </div>
      {error && (
        <div className="text-red-500 text-center mb-4">Could not load achievements. Showing sample data.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {filteredAchievements.map((ach) => {
          const userAch = userAchievements.find(a => a.achievement_id === ach.id);
          return (
            <div
              key={ach.id}
              className={`rounded-xl shadow-lg p-7 flex flex-col items-center transition-all duration-200 border-2 relative group
                ${ach.unlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-green-50 border-green-300 hover:scale-105 animate-achievement-pop'
                  : 'bg-gray-100 border-gray-200 opacity-60 hover:scale-100'}
              `}
              style={{ minHeight: 240 }}
            >
              <span className={`text-5xl mb-3 transition-transform duration-300 ${ach.unlocked ? 'group-hover:scale-125' : ''}`}>{ach.icon}</span>
              <h3 className="text-lg font-semibold mb-1 text-center">{ach.name}</h3>
              <p className="text-gray-600 text-sm text-center mb-2">{ach.description}</p>
              <span className="mt-2 text-xs text-blue-400 font-semibold">{(ach as any).rarity || 'Unlocked by 5% of users'}</span>
              {ach.unlocked && userAch?.date_earned && (
                <span className="mt-1 text-xs text-green-700">Unlocked on {format(new Date(userAch.date_earned), 'MMM d, yyyy')}</span>
              )}
              {!ach.unlocked && (
                <span className="mt-1 text-xs text-gray-400">Locked</span>
              )}
              {ach.unlocked && (
                <span className="absolute top-3 right-3 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded shadow animate-pulse">Unlocked</span>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes achievement-pop {
          0% { transform: scale(0.95); }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .animate-achievement-pop {
          animation: achievement-pop 0.7s;
        }
      `}</style>
    </div>
  );
};

export default AchievementsSection; 