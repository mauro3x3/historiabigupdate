import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { getLessonProgress } from '@/services/progressService';
import { generateTrackForEra } from '@/data/trackData';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, Map, Check, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LearningPath from '../components/home/LearningPath';

const ERA_OPTIONS = [
  { code: 'jewish', name: 'Jewish History', emoji: '✡️' },
  { code: 'ancient-greece', name: 'Ancient Greece', emoji: '🏛️' },
  { code: 'ancient-rome', name: 'Ancient Rome', emoji: '🏺' },
  { code: 'china', name: 'Chinese History', emoji: '🐲' },
  { code: 'islamic', name: 'Islamic History', emoji: '☪️' },
  { code: 'christian', name: 'Christian History', emoji: '✝️' },
  { code: 'russian', name: 'Russian History', emoji: '🇷🇺' },
  { code: 'america', name: 'American History', emoji: '🗽' },
];

const AVATAR = '/images/avatars/Johan.png';
const AVATAR_SIZE = 120;

function FullscreenBackground() {
  return (
    <div style={{position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 60%, #4f5bd5 0%, #6a82fb 60%, #232946 100%)', animation: 'bgFadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1)'}}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] z-10 animate-aurora" style={{background: 'radial-gradient(ellipse at 60% 40%, #a5b4fc88 0%, #fbbf2488 40%, transparent 80%)', filter: 'blur(32px)', opacity: 0.7}} />
      <div style={{position: 'absolute', inset: 0, zIndex: 0, background: "url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 fill=none xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=10 cy=10 r=2 fill=%23a5b4fc fill-opacity=0.10/%3E%3Ccircle cx=50 cy=50 r=1.5 fill=%23fbbf24 fill-opacity=0.08/%3E%3Crect x=30 y=30 width=3 height=3 fill=%23f472b6 fill-opacity=0.08/%3E%3C/svg%3E') repeat", animation: 'sparkleMove 16s linear infinite'}} />
      <div className="pointer-events-none absolute inset-0 z-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute animate-float-sparkle" style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: 10 + Math.random() * 8,
            height: 10 + Math.random() * 8,
            opacity: 0.08 + Math.random() * 0.10,
            background: 'radial-gradient(circle, #fffbe6 0%, #fbbf24 80%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
            animationDelay: `${Math.random() * 8}s`,
          }} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-30" style={{background: 'radial-gradient(ellipse at 50% 60%, transparent 60%, #232946 100%)'}} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[80vw] h-24 md:h-32 rounded-t-full bg-gradient-to-t from-blue-200/40 via-purple-200/20 to-transparent blur-2xl z-20" />
      <style>{`
        @keyframes bgFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes sparkleMove { 0% { background-position: 0 0; } 100% { background-position: 120px 120px; } }
        @keyframes float-sparkle {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px) scale(1.05); }
          100% { transform: translateY(0); }
        }
        .animate-float-sparkle { animation: float-sparkle 9s ease-in-out infinite; }
        @keyframes auroraMove { 0% { transform: translateY(0) scaleX(1); opacity: 0.7; } 50% { transform: translateY(-30px) scaleX(1.1); opacity: 1; } 100% { transform: translateY(0) scaleX(1); opacity: 0.7; } }
        .animate-aurora { animation: auroraMove 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function EraPicker({ era, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-white/80 border-2 border-purple-200 text-purple-700 font-bold text-base px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-purple-200"
          disabled={disabled}
        >
          <BookOpen className="h-6 w-6" />
          {ERA_OPTIONS.find(e => e.code === era)?.name || 'Change Era'}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 bg-white/95 rounded-2xl shadow-2xl z-[99999] fixed top-24 right-10">
        {ERA_OPTIONS.map((eraOpt) => (
          <Button
            key={eraOpt.code}
            variant="ghost"
            className={`flex items-center justify-start w-full px-3 py-2 text-base rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${eraOpt.code === era ? 'ring-4 ring-pink-300' : ''}`}
            onClick={() => { onChange(eraOpt.code); setOpen(false); }}
            disabled={disabled}
          >
            <span className="mr-3 text-xl">{eraOpt.emoji}</span>
            {eraOpt.name}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

const HomeRevamp = () => {
  const navigate = useNavigate();
  const { user, preferredEra, setPreferredEra } = useUser();
  const [selectedEra, setSelectedEra] = useState(preferredEra || ERA_OPTIONS[0].code);
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackEra, setFallbackEra] = useState(null);

  // Redirect not-logged-in users to landing page
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Load path for selected era
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      if (!selectedEra) return;
      try {
        let progressMap = {};
        if (user) progressMap = await getLessonProgress(user.id);
        const track = await generateTrackForEra(selectedEra as HistoryEra);
        // Attach progress to each lesson
        const trackWithProgress = track.levels.map(level => ({
          ...level,
          lessons: (level.lessons || []).map(lesson => ({
            ...lesson,
            progress: progressMap[String(lesson.id)] || undefined,
          })),
        }));
        if ((trackWithProgress || []).some(lvl => (lvl.lessons || []).length > 0)) {
          setLearningTrack(trackWithProgress);
          setFallbackEra(null);
        } else {
          // Find first era with lessons
          for (const eraOpt of ERA_OPTIONS) {
            if (eraOpt.code === selectedEra) continue;
            const altTrack = await generateTrackForEra(eraOpt.code as HistoryEra);
            if ((altTrack.levels || []).some(lvl => (lvl.lessons || []).length > 0)) {
              if (!cancelled) {
                setSelectedEra(eraOpt.code);
                setLearningTrack(altTrack.levels);
                setFallbackEra(eraOpt.code);
              }
              return;
            }
          }
          setLearningTrack([]);
          setFallbackEra('none');
        }
      } catch (e) {
        setLearningTrack([]);
        setFallbackEra('none');
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedEra, user]);

  // Compute chapters for LearningPath
  let chapters = [];
  if (learningTrack && learningTrack.length > 0) {
    // Sequential unlock logic: only one 'current', rest locked
    let foundFirstIncomplete = false;
    chapters = learningTrack.map((level) => {
      const lessons = (level.lessons || []).map((lesson) => {
        // Debug: log lesson id and progress
        if (typeof window !== 'undefined') {
          console.log('[Timeline] Lesson:', lesson.id, 'Progress:', lesson.progress, 'Type:', typeof lesson.id);
        }
        // Use String(lesson.id) for progress lookup
        const progress = lesson.progress;
        let status = 'locked';
        if (progress?.completed) {
          status = 'completed';
        } else if (!foundFirstIncomplete) {
          status = 'current';
          foundFirstIncomplete = true;
        }
        // Debug: log computed status
        if (typeof window !== 'undefined') {
          console.log('[Timeline] Computed status for lesson', lesson.id, ':', status);
        }
        return {
          id: lesson.id,
          title: lesson.title,
          xp: lesson.xp_reward || 50,
          status,
          description: lesson.description,
          emoji: '📖',
          progress,
          year: (lesson as any).year,
        };
      });
      return {
        title: level.title || 'Chapter',
        description: level.description || '',
        lessons,
      };
    });
    // Debug: log all progress keys
    if (typeof window !== 'undefined' && learningTrack[0]?.lessons) {
      const allProgressKeys = learningTrack[0].lessons.map(l => l.progress && l.progress.completed !== undefined ? l.id : null).filter(Boolean);
      console.log('[Timeline] All lesson IDs with progress:', allProgressKeys);
    }
  }
  const chaptersWithLessons = Array.isArray(chapters) ? chapters.filter(ch => Array.isArray(ch.lessons) && ch.lessons.length > 0) : [];
  // Find mascot node idx
  let mascotNodeIdx = -1, nodeCount = 0;
  chaptersWithLessons.forEach((chapter) => {
    chapter.lessons.forEach((lesson) => {
      if (lesson.status === 'current') mascotNodeIdx = nodeCount;
      nodeCount++;
    });
  });

  // Helper: get index and next/prev era
  const eraList = ERA_OPTIONS.map(e => e.code);
  const currentEraIdx = selectedEra ? eraList.indexOf(selectedEra) : 0;
  const prevEra = eraList[(currentEraIdx - 1 + eraList.length) % eraList.length];
  const nextEra = eraList[(currentEraIdx + 1) % eraList.length];

  // Keyboard navigation for era
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        handleEraChange(prevEra);
      } else if (e.key === 'ArrowRight') {
        handleEraChange(nextEra);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevEra, nextEra]);

  // Helper: background by era
  const eraBg = (era: string | null) => {
    switch (era) {
      case 'jewish': return 'from-yellow-100 to-blue-100';
      case 'islamic': return 'from-yellow-200 to-orange-100';
      case 'christian': return 'from-purple-100 to-blue-50';
      case 'chinese': return 'from-green-100 to-yellow-50';
      case 'ancient-greece': return 'from-blue-100 to-white';
      case 'ancient-rome': return 'from-red-100 to-yellow-100';
      default: return 'from-gray-50 to-purple-50';
    }
  };

  // Era change handler
  const handleEraChange = async (era) => {
    setSelectedEra(era);
    if (user) {
      try {
        await setPreferredEra(era);
        toast.success(`Now exploring ${ERA_OPTIONS.find(e => e.code === era)?.name || era}!`);
      } catch {}
    } else {
      toast.info('Sign in to save your preferences');
    }
  };

  // Lesson click
  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${lesson.id}`);
  };

  // View map
  const handleViewMap = () => {
    navigate(`/historical-map/${selectedEra}`);
  };

  return (
    <div style={{position: 'relative', zIndex: 1, minHeight: '100vh'}} className={`bg-gradient-to-b ${eraBg(selectedEra)}`}>
      <FullscreenBackground />
      <div className="fixed top-8 right-10 z-40 flex items-center gap-4">
        <div className="flex gap-2 px-5 py-3 rounded-2xl shadow-2xl bg-gradient-to-br from-white/80 to-purple-100/80 backdrop-blur-md border border-purple-200/60">
          {/* Temporarily hiding the View Map button
          <Button
            variant="default"
            size="lg"
            onClick={handleViewMap}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-400 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-base px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-pink-200 relative overflow-hidden ripple-effect"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <Map size={22} />
            )}
            <span>View Map</span>
          </Button>
          */}
          <EraPicker era={selectedEra} onChange={handleEraChange} disabled={isLoading} />
        </div>
      </div>
      <main className="container mx-auto py-8 px-4 relative">
        {/* Left Arrow Button */}
        <button
          className="fixed left-8 top-1/2 -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-4 z-50 hover:bg-purple-100 transition"
          style={{ fontSize: 32, display: eraList.length > 1 ? 'block' : 'none' }}
          onClick={() => handleEraChange(prevEra)}
          aria-label="Previous Era"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        {/* Right Arrow Button */}
        <button
          className="fixed right-8 top-1/2 -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-4 z-50 hover:bg-purple-100 transition"
          style={{ fontSize: 32, display: eraList.length > 1 ? 'block' : 'none' }}
          onClick={() => handleEraChange(nextEra)}
          aria-label="Next Era"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img src={AVATAR} alt="Mascot" className="w-40 h-40 rounded-full border-4 border-pink-400 shadow-2xl bg-white object-cover mb-6" />
            <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl shadow-lg px-8 py-6 text-timelingo-navy font-bold text-xl mb-4">
              Sign in to start your learning journey!
            </div>
          </div>
        ) : fallbackEra === 'none' ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img src={AVATAR} alt="Mascot" className="w-40 h-40 rounded-full border-4 border-pink-400 shadow-2xl bg-white object-cover mb-6" />
            <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl shadow-lg px-8 py-6 text-timelingo-navy font-bold text-xl mb-4">
              Oops! No learning paths are available for any era right now.<br />Please check back later or contact support.
            </div>
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-3 rounded-xl shadow-lg mt-2">Retry</Button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-center mb-8 mt-12 text-timelingo-navy drop-shadow-lg">Your Learning Journey</h2>
            <div className="flex justify-center">
              <LearningPath
                chapters={chaptersWithLessons}
                onLessonClick={handleLessonClick}
                mascotNodeIdx={mascotNodeIdx}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomeRevamp; 