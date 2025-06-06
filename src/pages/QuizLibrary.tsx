import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Trophy, User as UserIcon, PlayCircle, Calendar, ListChecks } from 'lucide-react';

const QuizLibrary: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('');
  const [creator, setCreator] = useState('');
  const [showOfficial, setShowOfficial] = useState<'all' | 'official' | 'user'>('all');
  const [sort, setSort] = useState<'newest' | 'mostPlayed'>('newest');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError('Failed to load quizzes.');
        setQuizzes([]);
      } else {
        setQuizzes(data || []);
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let q = quizzes;
    if (search) {
      q = q.filter((quiz) =>
        (quiz.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (quiz.theme || '').toLowerCase().includes(search.toLowerCase()) ||
        (quiz.signature || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (theme) {
      q = q.filter((quiz) => (quiz.theme || '').toLowerCase() === theme.toLowerCase());
    }
    if (creator) {
      q = q.filter((quiz) => (quiz.signature || '').toLowerCase().includes(creator.toLowerCase()));
    }
    if (showOfficial === 'official') {
      q = q.filter((quiz) => quiz.is_official);
    } else if (showOfficial === 'user') {
      q = q.filter((quiz) => !quiz.is_official);
    }
    if (sort === 'mostPlayed') {
      q = [...q].sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else {
      q = [...q].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    setFiltered(q);
  }, [quizzes, search, theme, creator, showOfficial, sort]);

  useEffect(() => {
    const fetchGlobalLeaderboard = async () => {
      // Group by user_id or nickname, sum scores, count quizzes played
      const { data, error } = await supabase.rpc('global_leaderboard');
      if (!error && data) setGlobalLeaderboard(data);
    };
    fetchGlobalLeaderboard();
  }, []);

  const allThemes = Array.from(new Set(quizzes.map(q => q.theme).filter(Boolean)));

  if (loading) return <div className="text-center py-10">Loading quizzes...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4 text-timelingo-navy">Quiz Your Friends</h2>
      {/* Global Leaderboard */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 mb-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-timelingo-gold">Global Leaderboard</h3>
          </div>
          {globalLeaderboard.length === 0 ? (
            <div className="text-gray-400 text-sm">No results yet. Play some quizzes!</div>
          ) : (
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-timelingo-gold/20">
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-2">Player</th>
                  <th className="py-2 px-2">Total Score</th>
                  <th className="py-2 px-2">Quizzes Played</th>
                </tr>
              </thead>
              <tbody>
                {globalLeaderboard.map((entry, idx) => {
                  const colors = [
                    'bg-yellow-100 text-yellow-700',
                    'bg-gray-200 text-gray-700',
                    'bg-orange-200 text-orange-700',
                    ''
                  ];
                  return (
                    <tr key={idx} className={idx < 3 ? colors[idx] : ''}>
                      <td className="py-1 px-2 text-center font-bold">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                      <td className="py-1 px-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-timelingo-purple/10 text-timelingo-navy font-bold">
                          {entry.nickname?.[0]?.toUpperCase() || <UserIcon className="h-5 w-5" />}
                        </span>
                        <span>{entry.nickname || 'Anonymous'}</span>
                      </td>
                      <td className="py-1 px-2 text-center font-semibold">{entry.total_score}</td>
                      <td className="py-1 px-2 text-center">{entry.quizzes_played}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Filters/Search */}
      <div className="flex flex-wrap gap-2 mb-6 items-center justify-center w-full max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search by name, theme, or creator..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
        <select value={theme} onChange={e => setTheme(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="">All Themes</option>
          {allThemes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter by creator..."
          value={creator}
          onChange={e => setCreator(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[120px]"
        />
        <select value={showOfficial} onChange={e => setShowOfficial(e.target.value as any)} className="border rounded px-2 py-2 text-sm">
          <option value="all">All</option>
          <option value="official">Official</option>
          <option value="user">User</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as any)} className="border rounded px-2 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="mostPlayed">Most Played</option>
        </select>
      </div>
      {/* Quiz Cards */}
      {filtered.length === 0 ? (
        <div className="text-gray-500 text-center">No quizzes found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {filtered.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition cursor-pointer relative"
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            >
              {quiz.is_official && (
                <span className="absolute top-2 right-2 bg-timelingo-gold text-white text-xs font-bold px-2 py-1 rounded shadow">Official</span>
              )}
              <div className="flex items-center gap-2 mb-1">
                <ListChecks className="h-5 w-5 text-timelingo-purple" />
                <span className="font-semibold text-lg text-timelingo-navy">{quiz.name || 'Untitled Quiz'}</span>
              </div>
              <div className="text-gray-500 text-sm mb-1">Theme: {quiz.theme}</div>
              <div className="text-gray-700 text-base font-semibold mb-1 flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                {quiz.signature && quiz.signature.trim() ? quiz.signature : 'Unknown'}
              </div>
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-sm shadow flex items-center gap-2 self-end"
                onClick={e => { e.stopPropagation(); navigate(`/quiz-edit/${quiz.id}`); }}
              >
                Edit
              </button>
              <button
                className="mt-2 bg-timelingo-gold hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-xl text-sm shadow flex items-center gap-2 self-end"
                onClick={e => { e.stopPropagation(); navigate(`/quiz/${quiz.id}`); }}
              >
                <PlayCircle className="h-4 w-4" /> Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizLibrary; 