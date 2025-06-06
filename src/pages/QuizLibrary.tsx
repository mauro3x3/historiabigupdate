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

  // Helper for pastel backgrounds
  function pastelBg(idx) {
    const bgs = [
      'bg-yellow-50',
      'bg-blue-50',
      'bg-pink-50',
      'bg-green-50',
      'bg-purple-50',
      'bg-orange-50',
      'bg-teal-50',
      'bg-red-50',
    ];
    return bgs[idx % bgs.length];
  }

  if (loading) return <div className="text-center py-10">Loading quizzes...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-gray-50 to-blue-50">
      <style>{`body { font-family: 'Inter', 'Space Grotesk', sans-serif; }`}</style>
      {/* Header */}
      <div className="w-full px-4 md:px-12 pt-10 pb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-timelingo-navy mb-2">Quiz Your Friends</h2>
        <p className="text-gray-500 text-lg mb-4">Create a custom quiz and share it with friends! Get creative, compete, and go viral.</p>
      </div>
      {/* Filters Bar */}
      <div className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 py-4 px-2 flex flex-wrap gap-3 items-center justify-center">
        <input
          type="text"
          placeholder="Search by name, theme, or creator..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-full px-5 py-2 text-base border border-gray-200 bg-white focus:ring-2 focus:ring-timelingo-gold flex-1 min-w-[120px] transition"
        />
        <select value={theme} onChange={e => setTheme(e.target.value)} className="rounded-full px-4 py-2 text-base border border-gray-200 bg-white focus:ring-2 focus:ring-timelingo-gold">
          <option value="">All Themes</option>
          {allThemes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter by creator..."
          value={creator}
          onChange={e => setCreator(e.target.value)}
          className="rounded-full px-5 py-2 text-base border border-gray-200 bg-white focus:ring-2 focus:ring-timelingo-gold flex-1 min-w-[100px] transition"
        />
        <select value={showOfficial} onChange={e => setShowOfficial(e.target.value as any)} className="rounded-full px-4 py-2 text-base border border-gray-200 bg-white focus:ring-2 focus:ring-timelingo-gold">
          <option value="all">All</option>
          <option value="official">Official</option>
          <option value="user">User</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as any)} className="rounded-full px-4 py-2 text-base border border-gray-200 bg-white focus:ring-2 focus:ring-timelingo-gold">
          <option value="newest">Newest</option>
          <option value="mostPlayed">Most Played</option>
        </select>
      </div>
      {/* Quiz List (blended, no cards, no grid) */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-2 md:px-0 pb-32 mt-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-7xl mb-4">🫥</span>
            <div className="text-3xl font-bold text-gray-400 mb-2">No quizzes found</div>
            <div className="text-lg text-gray-500 mb-6">Try changing your filters or create a new quiz!</div>
            <button className="bg-timelingo-gold hover:bg-yellow-400 text-white font-bold rounded-full px-8 py-3 shadow transition text-lg" onClick={() => navigate('/quiz-builder')}>+ Create Quiz</button>
          </div>
        ) : (
          filtered.map((quiz, idx) => (
            <div
              key={quiz.id}
              className={`relative ${pastelBg(idx)} border border-gray-100 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center transition-colors duration-200 hover:bg-opacity-90 hover:border-timelingo-gold w-full`}
            >
              {/* Edit icon */}
              <button
                className="absolute top-4 right-4 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-timelingo-gold hover:text-white transition"
                title="Edit Quiz"
                onClick={e => { e.stopPropagation(); navigate(`/quiz-edit/${quiz.id}`); }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l12-12a2 2 0 0 0-2.828-2.828L3 17z" /></svg>
              </button>
              {/* Icon/avatar left */}
              <div className="flex-shrink-0 flex items-center justify-center mr-0 sm:mr-6 mb-4 sm:mb-0">
                <span className="text-3xl bg-white rounded-full p-2 border border-gray-200"><span role="img" aria-label="Quiz">📚</span></span>
              </div>
              {/* Main content */}
              <div className="flex-1 w-full flex flex-col items-center sm:items-start">
                {/* Title */}
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1 text-center sm:text-left leading-tight">{quiz.name || 'Untitled Quiz'}</div>
                {/* Theme */}
                <div className="text-sm text-timelingo-gold font-semibold text-center sm:text-left mb-1">{quiz.theme}</div>
                {/* Author */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-timelingo-purple font-bold text-base border border-gray-300">
                    {quiz.signature && quiz.signature.trim() ? quiz.signature[0].toUpperCase() : '👤'}
                  </span>
                  <span className="text-gray-500 text-xs">by {quiz.signature && quiz.signature.trim() ? quiz.signature : 'Unknown'}</span>
                </div>
              </div>
              {/* Play button right */}
              <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-0">
                <button
                  className="w-full sm:w-32 bg-timelingo-gold hover:bg-yellow-400 text-white font-bold rounded-full py-2 shadow-sm transition text-base"
                  onClick={e => { e.stopPropagation(); navigate(`/quiz/${quiz.id}`); }}
                >
                  <span className="inline-flex items-center gap-2 justify-center"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" fill="currentColor" /></svg> Play</span>
                </button>
              </div>
              {/* Official badge */}
              {quiz.is_official && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-timelingo-gold to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Official</span>
              )}
            </div>
          ))
        )}
      </div>
      {/* Floating Create Quiz Button */}
      <button className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-timelingo-gold to-purple-400 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition" title="Create Quiz" onClick={() => navigate('/quiz-builder')}>
        +
      </button>
    </div>
  );
};

export default QuizLibrary; 