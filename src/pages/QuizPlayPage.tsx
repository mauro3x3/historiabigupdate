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

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    playSelectSound();
    setAnswers(ans => {
      const copy = [...ans];
      copy[current] = optionIdx;
      return copy;
    });
    // Play correct/wrong sound immediately if answer is checked on select
    if (quiz && quiz.questions && quiz.questions[current]) {
      const correctIdx = quiz.questions[current].answer;
      if (optionIdx === correctIdx) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) setCurrent(c => c + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(c => c - 1);
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
      if (answers[idx] === q.answer) sc++;
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
  const shareText = encodeURIComponent(`Check out this quiz: ${quiz?.title || 'Untitled Quiz'}!`);

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
    const tweet = `Try this quiz: ${quiz.title || 'Untitled Quiz'}! Can you beat my score? ${shareUrl} #HistoriaQuiz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,'_blank');
  };

  const handleShareResultsTwitter = () => {
    const tweet = `I scored ${score}/${quiz.questions.length} in ${formatTime(timer)} on '${quiz.title || 'Untitled Quiz'}'! Can you beat me? ${shareUrl} #HistoriaQuiz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,'_blank');
  };

  const handleCopyLeaderboardLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.id}#leaderboard`);
    toast.success('Leaderboard link copied!');
  };

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex justify-center items-center min-h-screen" style={backgroundStyle}>Loading quiz...</div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-500" style={backgroundStyle}>{error}</div>
  );
  if (!quiz) return null;

  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10" style={backgroundStyle}>
      <div className="w-full max-w-md flex flex-col items-center gap-4 relative" style={cardStyle}>
        <img src="/images/mascot/dolphin-animated.gif" alt="Quiz Mascot" className="h-16 w-16 absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full shadow border-2 border-yellow-100" />
        <h1 className="text-2xl font-extrabold mt-8 mb-1 text-center" style={{ color: theme.colors.primary }}>{quiz.title || 'Untitled Quiz'}</h1>
        {quiz.theme && (
          <span className="inline-block font-semibold px-3 py-1 rounded-full text-xs mb-1" style={{ backgroundColor: theme.colors.secondary, color: 'white' }}>{quiz.theme}</span>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-timelingo-purple/10 text-timelingo-navy font-bold">
            {quiz.creator?.[0]?.toUpperCase() || '👤'}
          </span>
          <span className="text-gray-700 text-sm">By: <span className="font-semibold">{quiz.creator || 'Anonymous'}</span></span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><ListChecks className="h-4 w-4" /> {quiz.questions?.length || 0} questions</span>
          <span className="flex items-center gap-1"><PlayCircle className="h-4 w-4" /> {plays} plays</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(quiz.created_at).toLocaleDateString()}</span>
        </div>
        {user ? (
          <div className="mb-1 text-green-700 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">Logged in as {user.email}</div>
        ) : (
          <div className="mb-1 text-blue-700 text-xs">Enter a nickname to appear on the leaderboard!</div>
        )}
        {showNicknamePrompt && !user && (
          <div className="mb-2 w-full flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter nickname..."
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="border rounded px-3 py-2 text-lg mb-2 w-full"
              maxLength={20}
            />
            <button
              onClick={startQuiz}
              className="w-full font-bold py-2 px-6 text-base shadow"
              style={buttonAccentStyle}
              disabled={!nickname.trim()}
            >Start Quiz</button>
          </div>
        )}
        {!showNicknamePrompt && (
          <button onClick={startQuiz} className="w-full font-bold py-3 rounded-xl text-lg shadow mb-1" style={buttonAccentStyle}>Start Quiz</button>
        )}
        <div className="flex flex-wrap gap-2 w-full justify-center mb-1">
          <button onClick={handleShare} className="flex-1 min-w-[120px] font-semibold py-2 rounded-xl text-base shadow" style={buttonPrimaryStyle}>Share Quiz</button>
          <button onClick={handleShareQuizTwitter} className="flex-1 min-w-[120px] font-semibold py-2 rounded-xl text-base shadow" style={buttonAccentStyle}>Tweet Quiz</button>
        </div>
        <div className="flex flex-wrap gap-2 w-full justify-center mb-1">
          <SocialShareButtons />
        </div>
        <button onClick={scrollToLeaderboard} className="mt-2 text-timelingo-gold underline font-semibold">View Leaderboard</button>
      </div>
      <div ref={leaderboardRef} className="w-full max-w-xl mt-8">
        <h2 className="text-lg font-bold mb-2 text-timelingo-navy">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <div className="text-gray-400 text-sm">No results yet. Be the first!</div>
        ) : (
          <div className="relative">
            <button onClick={handleCopyLeaderboardLink} className="absolute right-0 top-0 text-xs bg-timelingo-gold/80 text-white px-2 py-1 rounded shadow">Copy Link</button>
            <table className="w-full text-sm border rounded-xl overflow-hidden mt-6">
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
          <div className="mt-2 text-xs text-gray-500">Want to track all your scores? <a href="/auth" className="text-timelingo-purple underline">Sign up or log in</a>!</div>
        )}
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center py-10" style={backgroundStyle}>
      <Card className="p-6 text-center" style={{ ...cardStyle, padding: '2rem' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
          Quiz Complete!
        </h2>
        <p className="text-xl mb-4" style={{ color: theme.colors.text }}>
          Your score: {score} out of {quiz.questions.length}
        </p>
        <div className="flex justify-center space-x-4">
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
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-10" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>{quiz.title}</h1>
          {quiz.theme && (
            <span className="inline-block px-3 py-1 rounded-full text-xs mb-1" style={{ backgroundColor: theme.colors.secondary, color: 'white' }}>
              {quiz.theme}
            </span>
          )}
          <p className="text-gray-600 mt-2">{quiz.description}</p>
        </div>
        <Card className="p-6 mb-8" style={cardStyle}>
          <div className="mb-6">
            <Progress
              value={(current / quiz.questions.length) * 100}
              className="h-2"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Question {current + 1} of {quiz.questions.length}
            </p>
          </div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>
            {quiz.questions[current].question}
          </h2>
          <div className="space-y-3">
            {quiz.questions[current].options.map((option, index) => (
              <Button
                key={index}
                className={`w-full text-left p-4 rounded-lg transition-colors`}
                onClick={() => handleSelect(index)}
                style={{
                  backgroundColor: answers[current] === index ? theme.colors.primary : 'rgba(255,255,255,0.7)',
                  color: answers[current] === index ? 'white' : theme.colors.text,
                  border: `1.5px solid ${theme.colors.border}`,
                  fontWeight: answers[current] === index ? 700 : 500,
                  boxShadow: answers[current] === index ? '0 2px 8px 0 rgba(31, 38, 135, 0.10)' : undefined,
                }}
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={answers[current] === null}
              style={buttonAccentStyle}
            >
              {current === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPlayPage; 