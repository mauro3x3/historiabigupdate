import React, { useRef, useEffect, useState } from 'react';
import { Check, Lock, BookOpen, ChevronDown, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Chapter-based data structure
// chapters: [{ title, description, lessons: [{ id, title, emoji, xp, status, description }] }]

const getNodeColor = (status) => {
  if (status === 'current') return 'bg-gradient-to-br from-yellow-300 to-pink-400 border-pink-500';
  if (status === 'completed') return 'bg-gradient-to-br from-green-300 to-blue-400 border-green-400';
  return 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-500';
};

const getNodeShadow = (status) => {
  if (status === 'current') return 'shadow-2xl ring-4 ring-pink-400 animate-glow';
  if (status === 'completed') return 'shadow-xl';
  return 'shadow-lg';
};

const AVATAR_SIZE = 120;

// Keyframes for pop-in and checkmark
const popIn = {
  animation: 'popIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
};
const checkmarkAnim = {
  animation: 'checkPop 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
};

const MASCOT_BLINK_INTERVAL = 3500;
const MASCOT_BOUNCE_INTERVAL = 2500;

const getEraBackground = (era) => {
  // Example: return different backgrounds based on era string
  if (!era) return 'linear-gradient(to bottom, #181e2a, #232946)';
  if (era === 'ancient') return 'linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%)';
  if (era === 'medieval') return 'linear-gradient(135deg, #b1cbbb 0%, #6b7a8f 100%)';
  if (era === 'modern') return 'linear-gradient(135deg, #f67280 0%, #355c7d 100%)';
  return 'linear-gradient(to bottom, #181e2a, #232946)';
};

const CRESCENT_NODES = 24; // Default for Islamic journey

// Helper: Generate crescent path coordinates
function getCrescentPathCoords(count, radius = 320, cx = 0, cy = 0) {
  // Crescent: Use a partial arc (e.g., 210deg to -30deg)
  const startAngle = (210 * Math.PI) / 180;
  const endAngle = (-30 * Math.PI) / 180;
  const angleStep = (endAngle - startAngle) / (count - 1);
  const coords = [];
  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    // Crescent: Offset the center for the inner arc
    const r = radius + (i > count / 2 ? 30 : 0);
    coords.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return coords;
}

const LearningPath = (props) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const nodeRefs = useRef([]);
  const [currentYear, setCurrentYear] = useState(null);
  const lessonRefs = useRef([]);

  // Fallback emoji-rich era options
  const defaultEraOptions = [
    { code: 'jewish', name: 'Jewish History', emoji: '✡️' },
    { code: 'ancient-egypt', name: 'Ancient Egypt', emoji: '🏺' },
    { code: 'rome-greece', name: 'Rome & Greece', emoji: '🏛️' },
    { code: 'medieval', name: 'Medieval', emoji: '🏰' },
    { code: 'revolutions', name: 'Revolutions', emoji: '⚔️' },
    { code: 'modern', name: 'Modern', emoji: '🌍' },
    { code: 'china', name: 'Chinese History', emoji: '🐲' },
    { code: 'islamic', name: 'Islamic History', emoji: '☪️' },
    { code: 'christian', name: 'Christian History', emoji: '✝️' },
    { code: 'russian', name: 'Russian History', emoji: '🇷🇺' },
  ];
  const eraOptions = props.eraOptions && props.eraOptions.length > 0 ? props.eraOptions : defaultEraOptions;

  // Debug log for eraOptions
  console.log('RECEIVED eraOptions in LearningPath:', eraOptions);

  useEffect(() => {
    const blinkInterval = setInterval(() => setIsBlinking((b) => !b), MASCOT_BLINK_INTERVAL);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const current = nodeRefs.current.find(Boolean);
    if (current) {
      current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [props.chapters]);

  // Find the index and position of the current lesson for mascot placement
  let currentLessonIdx = -1;
  let currentChapterIdx = -1;
  let currentNodeGlobalIdx = -1;
  let nodeCount = 0;
  props.chapters.forEach((chapter, cIdx) => {
    chapter.lessons.forEach((lesson, lIdx) => {
      if (lesson.status === 'current') {
        currentLessonIdx = lIdx;
        currentChapterIdx = cIdx;
        currentNodeGlobalIdx = nodeCount;
      }
      nodeCount++;
    });
  });

  // Debug logs to verify data and rendering
  console.log('CHAPTERS:', props.chapters);
  // Helper: flat list of all lessons for vertical path
  const allLessons = props.chapters.flatMap((chapter) => chapter.lessons.map((lesson, idx) => ({
    ...lesson,
    chapterTitle: chapter.title,
    chapterIdx: props.chapters.indexOf(chapter),
    lessonIdx: idx,
  })));
  console.log('ALL LESSONS:', allLessons);

  // Mascot vertical position
  const [mascotTop, setMascotTop] = useState(0);
  useEffect(() => {
    if (currentNodeGlobalIdx !== -1 && nodeRefs.current[currentNodeGlobalIdx]) {
      const rect = nodeRefs.current[currentNodeGlobalIdx].getBoundingClientRect();
      setMascotTop(rect.top + rect.height / 2 + window.scrollY);
    }
  }, [currentNodeGlobalIdx, allLessons.length, isBlinking]);

  // Dynamic mascot message based on progress (keep for fun)
  const mascotMessages = [
    "Hi, I am Johan! I will guide you on your journey! 🚀",
    "Great job! Ready for your next adventure? 🌟",
    "Keep going! You're making history! 📚",
    "Checkpoint ahead! Almost there! 🏰",
    "You unlocked a new lesson! 🎉",
  ];
  let mascotMessage = mascotMessages[0];
  if (props.chapters && props.chapters.length > 0) {
    const completed = props.chapters.flatMap(ch => ch.lessons).filter(l => l.status === 'completed').length;
    const total = props.chapters.flatMap(ch => ch.lessons).length;
    if (completed === 0) mascotMessage = mascotMessages[0];
    else if (completed < total - 1) mascotMessage = mascotMessages[1];
    else if (completed === total - 1) mascotMessage = mascotMessages[3];
    else mascotMessage = mascotMessages[2];
  }

  React.useEffect(() => { nodeRefs.current = nodeRefs.current.slice(0, allLessons.length); }, [allLessons.length]);

  // Helper: chapter progress
  function getChapterProgress(chapter) {
    const total = chapter.lessons.length;
    const completed = chapter.lessons.filter(l => l.status === 'completed').length;
    return { completed, total };
  }

  // Filter chapters to only those with lessons
  const chaptersWithLessons = Array.isArray(props.chapters)
    ? props.chapters.filter(ch => Array.isArray(ch.lessons) && ch.lessons.length > 0)
    : [];
  const hasAnyLessons = chaptersWithLessons.length > 0;

  // If no real lessons, use a demo path for MVP/demo
  const demoChapters = [
    {
      title: 'Demo Chapter – Try the Path!',
      icon: '✨',
      description: 'This is a playful demo path. Add real lessons to see your own journey!',
      lessons: [
        { id: 'demo1', title: 'Welcome!', emoji: '👋', status: 'current', xp: 50 },
        { id: 'demo2', title: 'Learn the Basics', emoji: '📚', status: 'locked', xp: 50 },
        { id: 'demo3', title: 'Test Your Skills', emoji: '🧠', status: 'locked', xp: 50 },
        { id: 'demo4', title: 'Celebrate!', emoji: '🎉', status: 'locked', xp: 50 },
      ]
    }
  ];
  const chaptersToShow = hasAnyLessons ? chaptersWithLessons : demoChapters;

  // Determine if we're in the Islamic journey
  const isIslamic = (props.era && (props.era.toLowerCase().includes('islamic') || props.era.toLowerCase().includes('islam')));

  // Render all lessons in a single vertical column, no crescent, no padding, no limit
  let nodesToShow = allLessons;

  // Attach refs to each lesson node
  useEffect(() => {
    lessonRefs.current = lessonRefs.current.slice(0, nodesToShow.length);
  }, [nodesToShow.length]);

  // Intersection Observer to update year as you scroll
  useEffect(() => {
    if (!lessonRefs.current.length) return;
    const handleIntersect = (entries) => {
      // Find the lesson most in view (closest to top)
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        // Sort by boundingClientRect.top
        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const idx = Number(visible[0].target.getAttribute('data-idx'));
        const lesson = nodesToShow[idx];
        if (lesson && lesson.year) setCurrentYear(lesson.year);
      }
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Focus on center of viewport
      threshold: 0.1,
    });
    lessonRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [nodesToShow]);

  // Default to first lesson's year if not set or if currentYear is invalid
  useEffect(() => {
    if ((!currentYear || isNaN(currentYear)) && nodesToShow.length > 0 && nodesToShow[0].year) {
      setCurrentYear(nodesToShow[0].year);
    }
  }, [nodesToShow, currentYear]);

  return (
    <>
      {/* Removed sticky timeline header with large year label */}
      <div className="relative flex flex-col items-center w-full max-w-3xl mx-auto pt-10 pb-16 z-10">
        {/* Thinner, lighter vertical timeline line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 opacity-30 rounded-full z-0" style={{minHeight: '100%'}} />
        {nodesToShow.map((lesson, idx) => (
          <div key={lesson.id} className="relative flex flex-col items-center w-full mb-28 z-10">
            {/* Lesson card above the node, with clear margin */}
            <div
              className={`z-20 mb-4 w-full flex justify-center ${lesson.status !== 'locked' ? 'cursor-pointer hover:scale-[1.02] transition-transform' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => lesson.status !== 'locked' && props.onLessonClick && props.onLessonClick(lesson)}
              style={{ pointerEvents: lesson.status !== 'locked' ? 'auto' : 'none' }}
            >
              <div className="bg-white rounded-xl shadow-xl px-6 py-4 max-w-lg w-full flex flex-col items-start border border-gray-200" style={{ minHeight: 80 }}>
                <div className="font-bold text-lg mb-1">{lesson.title}</div>
                {lesson.description && <div className="text-gray-600 text-base mb-1">{lesson.description}</div>}
              </div>
            </div>
            {/* Node (circle) on the timeline, with year label to the left */}
            <div className="z-20 flex flex-row items-center justify-center" style={{marginBottom: 0}}>
              {/* Year label to the left of the node */}
              {lesson.year && (
                <div className="text-xs font-bold text-blue-700 bg-white/80 rounded-lg px-3 py-1 mr-4 shadow border border-blue-200" style={{minWidth: 54, textAlign: 'right', fontSize: 16, letterSpacing: 1}}>
                  {lesson.year}
                </div>
              )}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${lesson.status === 'completed' ? 'bg-green-200 border-green-400 shadow-xl' : lesson.status === 'current' ? 'bg-yellow-100 border-yellow-400 shadow-2xl ring-4 ring-pink-400 animate-glow' : 'bg-gray-200 border-gray-300 opacity-60 shadow-lg'} ${lesson.status !== 'locked' ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-not-allowed'}`}
                style={{fontSize: 32, position: 'relative', zIndex: 2, pointerEvents: lesson.status !== 'locked' ? 'auto' : 'none'}}
                onClick={() => lesson.status !== 'locked' && props.onLessonClick && props.onLessonClick(lesson)}
                title={lesson.status === 'locked' ? 'Complete previous lessons to unlock!' : ''}
              >
                {lesson.emoji || '📖'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LearningPath;