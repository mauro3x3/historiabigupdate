import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { getLessonProgress } from '@/services/progressService';
import { generateTrackForEra } from '@/data/trackData';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, Map, Check, Lock, ChevronLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LearningPath from '../components/home/LearningPath';

const ERA_OPTIONS = [
  { code: 'jewish', name: 'Jewish History', emoji: '✡️' },
  { code: 'ancient-greece', name: 'Ancient Greece', emoji: '🏛️' },
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

// Course Selection Modal Component (rendered via Portal)
function CourseSelectionModal({ isOpen, onClose, era, onChange }) {
  const iconMap = {
    'jewish': '/images/icons/judaism.png',
    'ancient-greece': '/images/icons/greek.png',
    'ancient-rome': '/images/icons/scroll.png',
    'china': '/images/icons/china.png',
    'islamic': '/images/icons/islam.png',
    'christian': '/images/icons/church.png',
    'russian': '/images/icons/russia.png',
    'america': '/images/icons/america.png'
  };

  const selectCourse = (courseCode) => {
    onChange(courseCode);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-white z-[999999] overflow-y-auto"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold mb-2">Choose Your Historical Journey</h1>
            <p className="text-blue-100 text-lg">Select the historical period that fascinates you most</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Available Courses Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">📚 Available Courses</h2>
              <p className="text-gray-600 text-lg">Start your journey through time with these carefully crafted historical experiences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {ERA_OPTIONS.map((eraOpt) => {
                const isSelected = eraOpt.code === era;
                
                // Course metadata with historical dates and real module counts
                const courseData = {
                  'jewish': { dates: '2000 BCE - 70 CE', modules: 100 },
                  'ancient-greece': { dates: '800 - 146 BCE', modules: 60 },
                  'ancient-rome': { dates: '753 BCE - 476 CE', modules: 120 },
                  'china': { dates: '2070 BCE - 1644 CE', modules: 180 },
                  'islamic': { dates: '610 - 1258 CE', modules: 29 },
                  'christian': { dates: '30 - 1517 CE', modules: 150 },
                  'russian': { dates: '862 - 1917 CE', modules: 95 },
                  'america': { dates: '1492 - 1865 CE', modules: 110 }
                };
                
                const currentCourse = courseData[eraOpt.code] || { dates: 'Various dates', modules: 50 };
                
                return (
                  <div
                    key={eraOpt.code}
                    onClick={() => selectCourse(eraOpt.code)}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                      isSelected ? 'scale-105 -translate-y-2' : ''
                    }`}
                  >
                    {/* Course Card */}
                    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border-4 transition-all duration-300 ${
                      isSelected 
                        ? 'border-green-400 shadow-green-200' 
                        : 'border-transparent group-hover:border-blue-300 group-hover:shadow-blue-200'
                    }`}>
                      
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}

                      {/* Course Image/Icon */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        {iconMap[eraOpt.code] ? (
                          <img 
                            src={iconMap[eraOpt.code]} 
                            alt={eraOpt.name}
                            className="w-20 h-20 object-contain filter drop-shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                            {eraOpt.emoji}
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent via-50% to-transparent opacity-20"></div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {eraOpt.name}
                        </h3>
                        
                        <div className="space-y-3 mb-4">
                          {isSelected && (
                            <div className="flex items-center text-sm text-green-600 font-medium">
                              <span className="mr-2">📈</span>
                              <span>45% completed</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📅</span>
                            <span>{currentCourse.dates}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📚</span>
                            <span>{currentCourse.modules} modules</span>
                          </div>
                        </div>

                        {/* Progress Bar for selected course */}
                        {isSelected && (
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-green-500 text-white shadow-lg hover:bg-green-600' 
                            : 'bg-blue-500 text-white shadow-lg hover:bg-blue-600 hover:shadow-xl'
                        }`}>
                          {isSelected ? '✓ Currently Learning' : 'Start Learning'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">🚀 Coming Soon</h2>
            <p className="text-gray-600 text-lg mb-12">Exciting new historical journeys in development</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Ancient Rome', emoji: '🏺', description: '753 BCE - 476 CE' },
                { name: 'Chinese History', emoji: '🐲', description: '2070 BCE - 1644 CE' },
                { name: 'Indian History', emoji: '🕉️', description: 'Vedic Period - Mughal Empire' },
                { name: 'German History', emoji: '🏰', description: 'Holy Roman Empire - WWII' },
                { name: 'African Empires', emoji: '🌍', description: 'Mali, Songhai & More' },
                { name: 'Viking Age', emoji: '⚔️', description: 'Norse Exploration' },
                { name: 'Medieval Europe', emoji: '🏰', description: 'Feudalism & Crusades' },
                { name: 'Industrial Revolution', emoji: '🏭', description: 'Steam & Progress' }
              ].map((course, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-60 rounded-3xl p-6 border-2 border-dashed border-gray-300 relative overflow-hidden"
                >
                  {/* Lock Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>

                  {/* Course Icon */}
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {course.emoji}
                  </div>

                  {/* Course Info */}
                  <h3 className="text-lg font-bold text-gray-600 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                  <div className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Coming Soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EraPicker({ era, onChange, disabled, completedModules = 0, totalModules = 0 }) {
  const [open, setOpen] = useState(false);
  
  const currentEra = ERA_OPTIONS.find(e => e.code === era);
  const iconMap = {
    'jewish': '/images/icons/judaism.png',
    'ancient-greece': '/images/icons/greek.png',
    'ancient-rome': '/images/icons/scroll.png',
    'china': '/images/icons/china.png',
    'islamic': '/images/icons/islam.png',
    'christian': '/images/icons/church.png',
    'russian': '/images/icons/russia.png',
    'america': '/images/icons/america.png'
  };

  // Course metadata with historical dates and real module counts
  const courseData = {
    'jewish': { dates: '2000 BCE - 70 CE', modules: 100 },
    'ancient-greece': { dates: '800 - 146 BCE', modules: 60 },
    'ancient-rome': { dates: '753 BCE - 476 CE', modules: 120 },
    'china': { dates: '2070 BCE - 1644 CE', modules: 180 },
    'islamic': { dates: '610 - 1258 CE', modules: 29 },
    'christian': { dates: '30 - 1517 CE', modules: 150 },
    'russian': { dates: '862 - 1917 CE', modules: 95 },
    'america': { dates: '1492 - 1865 CE', modules: 110 }
  };

  return (
    <>
      {/* Course Selector Card Button */}
      <div 
        className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 min-w-[280px]"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-4">
          {/* Course Icon */}
          <div className="flex-shrink-0">
            {iconMap[era] ? (
              <img 
                src={iconMap[era]} 
                alt={currentEra?.name}
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                {currentEra?.emoji || '📚'}
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {currentEra?.name || 'Select Course'}
              </h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📊 Progress: {totalModules > 0 ? Math.floor((completedModules / totalModules) * 100) : 0}% ({completedModules}/{totalModules} modules)</span>
              <span>🔥 3 day streak</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: totalModules > 0 ? `${Math.floor((completedModules / totalModules) * 100)}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal rendered via Portal */}
      <CourseSelectionModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        era={era}
        onChange={onChange}
      />
    </>
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
  
  // Find current lesson idx
  let currentLessonIdx = -1;
  chaptersWithLessons.forEach((chapter) => {
    chapter.lessons.forEach((lesson, idx) => {
      if (lesson.status === 'current') {
        currentLessonIdx = idx;
      }
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
      if (['ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        handleEraChange(prevEra);
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

  // Compute real progress for selected era
  let completedModules = 0;
  let totalModules = 0;
  if (learningTrack && learningTrack.length > 0) {
    totalModules = learningTrack.reduce((sum, level) => sum + (level.lessons?.length || 0), 0);
    completedModules = learningTrack.reduce(
      (sum, level) => sum + (level.lessons?.filter(l => l.progress?.completed).length || 0),
      0
    );
  }

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
          <EraPicker 
            era={selectedEra} 
            onChange={handleEraChange} 
            completedModules={completedModules}
            totalModules={totalModules}
            disabled={isLoading}
          />
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
        {/* Removed Right Arrow Button */}
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
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomeRevamp; 