import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Confetti from 'react-confetti';
import { useToast } from '@/components/ui/use-toast';
import { preloadSounds, playCorrectSound, playWrongSound, playSelectSound } from '@/utils/audioUtils';
import { ListChecks, PlayCircle, Calendar } from 'lucide-react';
import { unlockAchievement } from '@/integrations/supabase/achievements';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '@/types';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  era: string;
  theme: string;
  creator: string;
  created_at: string;
  plays?: number;
  module_id?: number;
  name?: string;
}

const QuizPlayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, setCurrentEra } = useTheme();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [moduleEra, setModuleEra] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast: useToastToast } = useToast();
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);
  const [plays, setPlays] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [nickname, setNickname] = useState('');
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [savingResult, setSavingResult] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizAndModule = async () => {
      setLoading(true);
      setError(null);
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();
      if (quizError || !quizData) {
        setError('Quiz not found.');
        setQuiz(null);
        setLoading(false);
        return;
      }
      // Normalize questions to always have correctAnswer
      if (quizData.questions && Array.isArray(quizData.questions)) {
        quizData.questions = quizData.questions.map(q => ({
          ...q,
          correctAnswer: q.correctAnswer ?? q.answer ?? 0,
        }));
      }
      console.log('Loaded quiz:', quizData);
      console.log('Loaded questions:', quizData.questions);
      setQuiz(quizData);
      setAnswers(Array(quizData.questions?.length || 0).fill(-1));
      setPlays(quizData.plays || 0);
      // Fetch module for era
      if (quizData.module_id) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('era')
          .eq('id', quizData.module_id)
          .single();
        if (!moduleError && moduleData && moduleData.era) {
          setCurrentEra(moduleData.era as import('@/types').HistoryEra);
          setModuleEra(moduleData.era);
        }
      }
      setLoading(false);
    };
    fetchQuizAndModule();
    return () => {
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
    };
  }, [id, setCurrentEra]);

  useEffect(() => {
    preloadSounds();
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else if (!started || submitted) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted]);

  // Increment play count when quiz is started
  useEffect(() => {
    if (started && quiz) {
      const incrementPlays = async () => {
        const { data, error } = await supabase
          .from('quizzes')
          .update({ plays: (quiz.plays || 0) + 1 })
          .eq('id', quiz.id)
          .select('plays')
          .single();
        if (!error && data) setPlays(data.plays);
      };
      incrementPlays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // Fetch Wikipedia image if theme is a Wikipedia URL
    if (quiz && quiz.theme && /wikipedia\.org\/wiki\//.test(quiz.theme)) {
      const match = quiz.theme.match(/wikipedia\.org\/wiki\/([^#?]+)/);
      if (match) {
        const article = match[1];
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${article}`)
          .then(res => res.json())
          .then(data => {
            if (data.thumbnail && data.thumbnail.source) {
              setWikiImage(data.thumbnail.source);
            } else {
              setWikiImage(null);
            }
          })
          .catch(() => setWikiImage(null));
      }
    } else if (quiz && quiz.theme) {
      // Try Unsplash for non-Wikipedia topics
      const query = encodeURIComponent(quiz.theme);
      fetch(`https://source.unsplash.com/320x320/?${query}`)
        .then(res => {
          if (res.url && !res.url.includes('pixel.gif')) {
            setWikiImage(res.url);
          } else {
            setWikiImage(null);
          }
        })
        .catch(() => setWikiImage(null));
    } else {
      setWikiImage(null);
    }
  }, [quiz]);

  const handleSelect = (optionIdx: number) => {
    if (submitted || showFeedback) return;
    playSelectSound();
    setAnswers(ans => {
      const copy = [...ans];
      copy[current] = optionIdx;
      return copy;
    });
    setShowFeedback(true);
    // Play correct/wrong sound immediately if answer is checked on select
    if (quiz && quiz.questions && quiz.questions[current]) {
      const correctIdx = quiz.questions[current].correctAnswer;
      if (optionIdx === correctIdx) {
        playCorrectSound();
        // Auto-advance after 1.5s if correct and not last question
        if (current < quiz.questions.length - 1) {
          const timeout = setTimeout(() => {
            setShowFeedback(false);
            setCurrent(c => c + 1);
          }, 1500);
          setAutoAdvanceTimeout(timeout);
        }
      } else {
        playWrongSound();
      }
    }
  };

  useEffect(() => {
    // Clear auto-advance timeout on unmount or question change
    return () => {
      if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    };
  }, [current]);

  const handleNext = () => {
    setShowFeedback(false);
    setCurrent(c => c + 1);
  };
  const handlePrev = () => {
    setShowFeedback(false);
    setCurrent(c => c - 1);
  };

  const startQuiz = () => {
    if (!user && !nickname) {
      setShowNicknamePrompt(true);
      return;
    }
    setStarted(true);
    setShowNicknamePrompt(false);
  };

  const handleSubmit = async () => {
    let sc = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
    setShowConfetti(true);
    // Play sound effect for result
    if (sc === quiz.questions.length) {
      playCorrectSound();
    } else if (sc === 0) {
      playWrongSound();
    } else {
      playCorrectSound();
      setTimeout(() => playWrongSound(), 500);
    }
    confettiTimeout.current = setTimeout(() => setShowConfetti(false), 4000);
    // Save result
    setSavingResult(true);
    await supabase.from('quiz_results').insert({
      quiz_id: quiz.id,
      user_id: user?.id || null,
      nickname: user ? user.email : nickname,
      score: sc,
      time_seconds: timer
    });
    setSavingResult(false);
    // Unlock achievements if user is logged in
    if (user?.id) {
      // Quiz Novice
      await unlockAchievement(user.id, 'quiz_completed_1');
      // Quiz Master (perfect score)
      if (sc === quiz.questions.length) {
        await unlockAchievement(user.id, 'quiz_perfect_score');
      }
      // Quiz Enthusiast (10 quizzes)
      // Count user's completed quizzes
      const { count } = await supabase
        .from('quiz_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if ((count || 0) >= 10) {
        await unlockAchievement(user.id, 'quiz_completed_10');
      }
    }
    // Fetch leaderboard
    fetchLeaderboard();
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('quiz_results')
      .select('nickname, user_id, score, time_seconds, created_at')
      .eq('quiz_id', quiz.id)
      .order('score', { ascending: false })
      .order('time_seconds', { ascending: true })
      .limit(10);
    setLeaderboard(data || []);
  };

  useEffect(() => {
    if (submitted && quiz) fetchLeaderboard();
    // eslint-disable-next-line
  }, [submitted, quiz]);

  const handleRestart = () => {
    setAnswers(Array(quiz.questions.length).fill(-1));
    setCurrent(0);
    setSubmitted(false);
    setScore(0);
    setStarted(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Quiz link copied to clipboard!');
  };

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`Check out this quiz: ${quiz?.name || 'Untitled Quiz'}!`);

  const SocialShareButtons = () => (
    <div className="flex gap-3 mt-2">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow"
      >
        Share on Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow"
      >
        Facebook
      </a>
      <a
        href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow"
      >
        WhatsApp
      </a>
    </div>
  );

  // Progress bar/dots
  const renderProgress = () => (
    <div className="flex gap-1 justify-center mb-4">
      {quiz.questions.map((_: any, idx: number) => (
        <div
          key={idx}
          className={`h-3 w-3 rounded-full border transition-all ${idx === current ? 'bg-timelingo-gold border-timelingo-gold scale-125' : answers[idx] !== -1 ? 'bg-timelingo-purple border-timelingo-purple' : 'bg-gray-200 border-gray-300'}`}
        />
      ))}
    </div>
  );

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleShareQuizTwitter = () => {
    const tweet = `Try this quiz: ${quiz.name || 'Untitled Quiz'}! Can you beat my score? ${shareUrl} #HistoriaQuiz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,'_blank');
  };

  const handleShareResultsTwitter = () => {
    const tweet = `I scored ${score}/${quiz.questions.length} in ${formatTime(timer)} on '${quiz.name || 'Untitled Quiz'}'! Can you beat me? ${shareUrl} #HistoriaQuiz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,'_blank');
  };

  const handleCopyLeaderboardLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.id}#leaderboard`);
    toast.success('Leaderboard link copied!');
  };

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadQuizAsCSV = async (quiz: Quiz) => {
    try {
      const response = await fetch('http://localhost:5001/api/quiz-to-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: quiz.questions.map(q => ({
            question: q.question || q.text,
            options: q.options,
            answer: typeof q.correctAnswer === 'number' ? q.correctAnswer : q.answer
          })),
          quizTitle: quiz.name || quiz.title || 'quiz'
        })
      });
      if (!response.ok) throw new Error('Failed to download CSV');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quiz.name || quiz.title || 'quiz'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Could not download CSV.');
    }
  };

  // Helper for background style
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${theme.colors.accent}10 0%, ${theme.colors.secondary}10 100%)`,
    backgroundImage: `${theme.backgroundPattern}, linear-gradient(135deg, ${theme.colors.accent}10 0%, ${theme.colors.secondary}10 100%)`,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px',
    color: theme.colors.text,
    fontFamily: theme.fontFamily,
    minHeight: '100vh',
  };
  const cardStyle = {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '1.25rem',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
    border: `1.5px solid ${theme.colors.border}`,
    backdropFilter: 'blur(2px)',
  };
  const buttonPrimaryStyle = {
    backgroundColor: theme.colors.primary,
    color: 'white',
    borderRadius: '0.75rem',
    fontWeight: 600,
    boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
  };
  const buttonAccentStyle = {
    backgroundColor: theme.colors.accent,
    color: theme.colors.text,
    borderRadius: '0.75rem',
    fontWeight: 600,
    boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen" style={backgroundStyle}>
      <div className="flex flex-col items-center">
        <img src="/images/mascot/dolphin-animated.gif" alt="Loading" className="h-24 w-24 mb-4 animate-bounce" />
        <span className="text-lg font-semibold text-timelingo-purple">Loading quiz...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-500" style={backgroundStyle}>{error}</div>
  );
  if (!quiz || !quiz.questions || quiz.questions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={backgroundStyle}>
      <img src="/images/mascot/dolphin-animated.gif" alt="No Questions" className="h-24 w-24 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-timelingo-navy">No questions found for this quiz.</h2>
      <p className="text-gray-600 mb-4">Try another quiz or create your own!</p>
      <Button onClick={() => navigate('/quiz-library')} style={buttonPrimaryStyle}>Back to Quiz Library</Button>
    </div>
  );

  // --- Landing Page ---
  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      {/* Animated floating shapes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-100 via-yellow-50 to-purple-100 rounded-full opacity-40 blur-2xl animate-float-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-gradient-to-tr from-blue-100 via-purple-100 to-yellow-50 rounded-full opacity-30 blur-2xl animate-float-slower" />
        <div className="absolute top-1/2 left-[-120px] w-[200px] h-[200px] bg-gradient-to-br from-purple-100 to-blue-50 rounded-full opacity-20 blur-2xl animate-float-medium" />
      </div>
      <style>{`
        @keyframes floatSlow { 0% { transform: translateY(0); } 50% { transform: translateY(30px); } 100% { transform: translateY(0); } }
        @keyframes floatSlower { 0% { transform: translateY(0); } 50% { transform: translateY(-40px); } 100% { transform: translateY(0); } }
        @keyframes floatMedium { 0% { transform: translateY(0); } 50% { transform: translateY(20px); } 100% { transform: translateY(0); } }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 10s ease-in-out infinite; }
      `}</style>
      {/* Glassmorphic card, less boxy, more blended */}
      <div className="w-full max-w-lg flex flex-col items-center gap-4 relative z-10 bg-white/60 rounded-[2.5rem] shadow-2xl p-10" style={{ backdropFilter: 'blur(16px)', boxShadow: '0 8px 40px 0 rgba(80,120,200,0.10)', border: 'none' }}>
        {/* Mascot/image/question mark floating above card */}
        <div className="relative flex flex-col items-center mb-2" style={{ marginTop: '-70px', marginBottom: '10px' }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100 blur-2xl opacity-60" style={{ width: 120, height: 120, zIndex: 0 }} />
          {wikiImage ? (
            <img
              src={wikiImage}
              alt="Quiz Topic"
              className="w-28 h-28 object-cover rounded-full border-4 border-yellow-200 shadow-xl relative z-10 bg-white"
              onError={e => (e.currentTarget.src = '')}
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-yellow-200 shadow-xl relative z-10 bg-white text-5xl text-gray-400 font-extrabold select-none">
              ?
            </div>
          )}
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-center text-timelingo-navy drop-shadow-lg tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>{quiz.name || 'Untitled Quiz'}</h1>
        {quiz.theme && (
          <span className="inline-block font-bold px-6 py-2 rounded-full text-lg mb-2 bg-gradient-to-r from-timelingo-gold to-yellow-400 text-white shadow-lg tracking-wide" style={{ letterSpacing: 1 }}>{quiz.theme}</span>
        )}
        {/* Creator info, more prominent */}
        <div className="flex items-center gap-3 mb-3 mt-1">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-timelingo-purple/10 text-timelingo-navy font-bold text-xl border-2 border-timelingo-gold shadow">
            {quiz.creator?.[0]?.toUpperCase() || '👤'}
          </span>
          <span className="text-timelingo-purple text-lg font-semibold">{quiz.creator || 'Anonymous'}</span>
        </div>
        {/* Friendly encouragement/description */}
        <div className="mb-4 text-timelingo-navy text-center text-lg font-medium bg-yellow-50/60 rounded-xl px-6 py-3 shadow-inner">
          {quiz.description || 'Ready to test your knowledge? Click below to start!'}
        </div>
        {/* Modern gradient buttons */}
        {user ? (
          <div className="mb-2 text-green-700 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">Logged in as {user.email}</div>
        ) : (
          <div className="mb-2 text-blue-700 text-xs">Enter a nickname to appear on the leaderboard!</div>
        )}
        <Button onClick={startQuiz} className="w-full font-bold py-4 rounded-2xl text-xl shadow-lg mb-3 bg-gradient-to-r from-timelingo-gold to-yellow-400 hover:from-yellow-400 hover:to-timelingo-gold text-white transition-all tracking-wide">
          Start Quiz
        </Button>
        <Button className="w-full bg-gradient-to-r from-purple-400 to-timelingo-purple hover:from-timelingo-purple hover:to-purple-400 text-xl font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-2">
          <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M7.05 7.05v.01M16.95 7.05v.01M16.95 16.95v.01M7.05 16.95v.01" /></svg>
          Share
        </Button>
        <button onClick={scrollToLeaderboard} className="mt-2 text-timelingo-gold underline font-semibold text-base">View Leaderboard</button>
      </div>
      {/* Leaderboard visually distinct */}
      <div ref={leaderboardRef} className="w-full max-w-xl mt-10 z-10">
        <h2 className="text-2xl font-extrabold mb-4 text-timelingo-navy text-center tracking-tight">Leaderboard</h2>
        <div className="bg-white/80 rounded-2xl shadow-lg p-6">
          {leaderboard.length === 0 ? (
            <div className="text-gray-400 text-base text-center">No results yet. Be the first!</div>
          ) : (
            <div className="relative">
              <button onClick={handleCopyLeaderboardLink} className="absolute right-0 top-0 text-xs bg-timelingo-gold/80 text-white px-2 py-1 rounded shadow">Copy Link</button>
              <table className="w-full text-base border rounded-xl overflow-hidden mt-6">
                <thead>
                  <tr className="bg-timelingo-gold/20">
                    <th className="py-2 px-2">Rank</th>
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Score</th>
                    <th className="py-2 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr key={idx} className={
                      (user && entry.user_id === user.id) || (!user && entry.nickname === nickname)
                        ? 'bg-timelingo-purple/10 font-bold'
                        : ''
                    }>
                      <td className="py-1 px-2 text-center">{idx + 1}</td>
                      <td className="py-1 px-2">{entry.nickname || 'Anonymous'}</td>
                      <td className="py-1 px-2 text-center">{entry.score}</td>
                      <td className="py-1 px-2 text-center">{formatTime(entry.time_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!user && (
            <div className="mt-2 text-xs text-gray-500 text-center">Want to track all your scores? <a href="/auth" className="text-timelingo-purple underline">Sign up or log in</a>!</div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Quiz Play UI ---
  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center py-10" style={backgroundStyle}>
      <Card className="p-8 text-center flex flex-col items-center" style={{ ...cardStyle, padding: '2rem' }}>
        <img src="/images/mascot/dolphin-animated.gif" alt="Quiz Complete" className="h-20 w-20 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-timelingo-navy">
          Quiz Complete!
        </h2>
        <p className="text-xl mb-4 text-timelingo-navy">
          Your score: <span className="font-bold text-timelingo-gold">{score}</span> out of {quiz.questions.length}
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/home')}
            style={buttonAccentStyle}
          >
            Back to Journey
          </Button>
          <Button
            onClick={() => navigate('/quiz-library')}
            style={buttonPrimaryStyle}
          >
            Try Another Quiz
          </Button>
          <Button
            onClick={handleShare}
            style={buttonAccentStyle}
          >
            Share Quiz
          </Button>
          <Button
            onClick={() => quiz && downloadQuizAsCSV(quiz)}
            style={buttonAccentStyle}
          >
            Download as CSV
          </Button>
        </div>
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2 text-timelingo-navy">Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <div className="text-gray-400 text-sm">No results yet. Be the first!</div>
          ) : (
            <table className="w-full text-sm border rounded-xl overflow-hidden mt-2">
              <thead>
                <tr className="bg-timelingo-gold/20">
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Score</th>
                  <th className="py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <tr key={idx} className={
                    (user && entry.user_id === user.id) || (!user && entry.nickname === nickname)
                      ? 'bg-timelingo-purple/10 font-bold'
                      : ''
                  }>
                    <td className="py-1 px-2 text-center">{idx + 1}</td>
                    <td className="py-1 px-2">{entry.nickname || 'Anonymous'}</td>
                    <td className="py-1 px-2 text-center">{entry.score}</td>
                    <td className="py-1 px-2 text-center">{formatTime(entry.time_seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );

  // --- Quiz Play UI ---
  return (
    <div className="min-h-screen flex flex-col items-center py-10" style={backgroundStyle}>
      <div className="max-w-xl mx-auto w-full">
        <Card className="p-8 flex flex-col items-center" style={cardStyle}>
          {renderProgress()}
          <div className="mb-6 w-full text-center">
            <Progress
              value={((current + 1) / quiz.questions.length) * 100}
              className="h-2"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Question {current + 1} of {quiz.questions.length} | Score: {answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length}
            </p>
          </div>
          <h2 className="text-2xl font-bold mb-4 w-full text-center text-timelingo-navy drop-shadow-lg">
            {quiz.questions[current].question}
          </h2>
          <div className="w-full flex flex-col gap-4">
            {quiz.questions[current].options.map((option, index) => {
              const isSelected = answers[current] === index;
              let optionBg = 'rgba(255,255,255,0.7)';
              let optionColor = theme.colors.text;
              let border = `1.5px solid ${theme.colors.border}`;
              let fontWeight = 500;
              let boxShadow = undefined;
              let feedbackIcon = null;
              if (isSelected) {
                fontWeight = 700;
                boxShadow = '0 2px 8px 0 rgba(31, 38, 135, 0.10)';
                if (showFeedback) {
                  if (index === quiz.questions[current].correctAnswer) {
                    optionBg = '#bbf7d0'; // green
                    optionColor = '#166534';
                    border = '2px solid #22c55e';
                    feedbackIcon = <span className="ml-2">✅</span>;
                  } else {
                    optionBg = '#fecaca'; // red
                    optionColor = '#991b1b';
                    border = '2px solid #ef4444';
                    feedbackIcon = <span className="ml-2">❌</span>;
                  }
                } else {
                  optionBg = theme.colors.primary;
                  optionColor = 'white';
                  border = `2px solid ${theme.colors.primary}`;
                }
              } else if (showFeedback && index === quiz.questions[current].correctAnswer) {
                optionBg = '#bbf7d0';
                optionColor = '#166534';
                border = '2px solid #22c55e';
                feedbackIcon = <span className="ml-2">✅</span>;
              }
              return (
                <Button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg transition-colors flex items-center justify-between text-lg shadow-md`}
                  onClick={() => handleSelect(index)}
                  disabled={showFeedback || answers[current] !== -1}
                  style={{
                    backgroundColor: optionBg,
                    color: optionColor,
                    border,
                    fontWeight,
                    boxShadow,
                  }}
                >
                  <span>{option}</span>
                  {feedbackIcon}
                </Button>
              );
            })}
          </div>
          {showFeedback && quiz.questions[current].explanation && (
            <div className="mt-4 w-full text-center text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
              <strong>Explanation:</strong> {quiz.questions[current].explanation}
            </div>
          )}
          <div className="mt-6 flex justify-between w-full">
            <Button
              onClick={handlePrev}
              disabled={current === 0 || showFeedback}
              style={buttonAccentStyle}
            >
              Previous
            </Button>
            {showFeedback && current < quiz.questions.length - 1 && (
              <Button
                onClick={handleNext}
                style={buttonAccentStyle}
              >
                Next
              </Button>
            )}
            {showFeedback && current === quiz.questions.length - 1 && (
              <Button
                onClick={handleSubmit}
                style={buttonAccentStyle}
              >
                Finish
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPlayPage; 