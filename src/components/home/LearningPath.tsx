import React, { useState, useRef, useEffect } from 'react';
import { Check, Lock, BookOpen, Package, BookText, Star, Shield, Zap } from 'lucide-react';

const NODE_SIZE = 80;
const ROW_HEIGHT = 140;

export default function LearningPath({ chapters = [], onLessonClick }) {
  // Section/unit info for top bar (use first chapter as example)
  const sectionTitle = chapters[0]?.title || 'Section 1, Unit 1';
  const mainTitle = chapters[0]?.lessons?.[0]?.title || 'Your Learning Journey';

  // Flatten lessons
  const lessons = chapters.flatMap(ch => ch.lessons);
  
  // Check if this is Christian content by looking at the first lesson's era
  const isChristianContent = lessons[0]?.era === 'christian';
  
  // --- Scroll tracking state ---
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const nodeRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!nodeRefs.current.length) return;
      const offsets = nodeRefs.current.map(ref => {
        if (!ref) return Infinity;
        const rect = ref.getBoundingClientRect();
        return Math.abs(rect.top - 140); // 140px below top bar
      });
      const minIdx = offsets.indexOf(Math.min(...offsets));
      setActiveLessonIdx(minIdx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lessons.length]);

  const activeLesson = lessons[activeLessonIdx] || {};
  const activeTitle = activeLesson.title || mainTitle;

  // Calculate cross dimensions and positions
  const getCrossLayout = () => {
    if (lessons.length < 5) return null; // Need at least 5 lessons for a cross
    
    const centerX = 200;
    const centerY = 200;
    const horizontalSpacing = 120;
    const verticalSpacing = 100;
    
    // Define cross positions: vertical line + horizontal line
    const positions = [];
    
    // Vertical line (top to bottom)
    const verticalCount = Math.ceil(lessons.length / 2);
    for (let i = 0; i < verticalCount; i++) {
      positions.push({
        x: centerX,
        y: centerY - (verticalCount - 1) * verticalSpacing / 2 + i * verticalSpacing
      });
    }
    
    // Horizontal line (left to right, excluding center which is already covered)
    const horizontalCount = Math.floor(lessons.length / 2);
    for (let i = 0; i < horizontalCount; i++) {
      if (i === 0) continue; // Skip center point
      positions.push({
        x: centerX - horizontalCount * horizontalSpacing / 2 + i * horizontalSpacing,
        y: centerY
      });
    }
    
    return positions;
  };

  const crossLayout = getCrossLayout();

  // Render the learning path
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Top Bar - Duolingo Style */}
      <div className="w-full flex items-center justify-between rounded-2xl px-8 py-6 mb-12 shadow-2xl bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-400 sticky top-4 z-30" style={{ minHeight: 80 }}>
        <div className="flex flex-col">
          <span className="uppercase text-sm font-bold text-green-100 tracking-widest mb-2">
            {sectionTitle}
          </span>
          <span className="text-3xl font-extrabold text-white drop-shadow-lg">{activeTitle}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full px-4 py-2 text-white font-semibold">
            <Star className="w-5 h-5 inline mr-2" />
            {lessons.filter(l => l.status === 'completed').length}/{lessons.length}
          </div>
        </div>
      </div>

      {/* Main Learning Path - Christian Cross or Regular Curved Path */}
      <div className="flex justify-center">
        <div className="relative">
          {isChristianContent && crossLayout ? (
            /* Christian Cross Path */
            <svg width="400" height="400" className="absolute inset-0 pointer-events-none">
              <defs>
                <linearGradient id="crossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <filter id="crossGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Vertical line of the cross */}
              <line
                x1="200" y1="50"
                x2="200" y2="350"
                stroke="url(#crossGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                filter="url(#crossGlow)"
                opacity="1"
                className="animate-path-glow"
              />
              
              {/* Horizontal line of the cross */}
              <line
                x1="80" y1="200"
                x2="320" y2="200"
                stroke="url(#crossGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                filter="url(#crossGlow)"
                opacity="1"
                className="animate-path-glow"
              />
            </svg>
          ) : (
            /* Regular Curved Path */
            <svg width="400" height={lessons.length * ROW_HEIGHT + 100} className="absolute inset-0 pointer-events-none">
              <defs>
                <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Create a smooth, elegant curved path with better curves */}
              <path
                d={(() => {
                  let path = `M 200 40`;
                  lessons.forEach((_, idx) => {
                    const y = 40 + idx * ROW_HEIGHT;
                    // Create a more natural, flowing curve pattern
                    const waveOffset = Math.sin(idx * 0.6) * 35;
                    const controlY = y - ROW_HEIGHT * 0.3;
                    path += ` Q ${200 + waveOffset} ${controlY} ${200 + waveOffset} ${y}`;
                  });
                  return path;
                })()}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                opacity="1"
                className="animate-path-glow"
              />
              
              {/* Fallback straight path in case the curved path fails */}
              <path
                d={`M 200 40 L 200 ${40 + lessons.length * ROW_HEIGHT}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          )}
          
          {/* Lesson Nodes */}
          {lessons.map((lesson, idx) => {
            const isCompleted = lesson.status === 'completed';
            const isCurrent = lesson.status === 'current';
            const isLocked = lesson.status === 'locked';
            
            let x, y;
            
            if (isChristianContent && crossLayout && crossLayout[idx]) {
              // Position nodes along the cross
              x = crossLayout[idx].x;
              y = crossLayout[idx].y;
            } else {
              // Position nodes along the regular curved path
              y = 40 + idx * ROW_HEIGHT;
              const waveOffset = Math.sin(idx * 0.6) * 35;
              x = 200 + waveOffset;
            }
            
            // Node styling based on status - Clean Duolingo style
            let nodeClasses = '';
            let icon = null;
            
            if (isCompleted) {
              nodeClasses = 'bg-green-500 border-green-600 shadow-lg';
              icon = <Check className="w-8 h-8 text-white" />;
            } else if (isCurrent) {
              nodeClasses = 'bg-green-500 border-green-600 shadow-xl animate-pulse';
              icon = <Star className="w-8 h-8 text-white" />;
            } else {
              nodeClasses = 'bg-gray-300 border-gray-400 shadow-md';
              icon = <Lock className="w-6 h-6 text-gray-500" />;
            }

            return (
              <div key={lesson.id} className="absolute" style={{ left: x - 40, top: y - 40 }}>
                {/* Node - Clean circular design */}
                <button
                  className={`w-20 h-20 rounded-full border-4 ${nodeClasses} flex items-center justify-center transition-all duration-300 focus:outline-none ${
                    !isLocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  onClick={() => !isLocked && onLessonClick && onLessonClick(lesson)}
                  disabled={isLocked}
                  title={!isLocked ? lesson.title : 'Complete previous lessons to unlock!'}
                  tabIndex={isLocked ? -1 : 0}
                  ref={el => {
                    if (!nodeRefs.current) nodeRefs.current = [];
                    nodeRefs.current[idx] = el;
                  }}
                >
                  {icon}
                </button>
                
                {/* Lesson Label - Minimal and clean */}
                <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white rounded-lg px-3 py-2 shadow-md border border-gray-200 min-w-[160px] max-w-[200px] ${
                  isCurrent ? 'border-green-300 shadow-green-200/50' : ''
                }`}>
                  <div className="font-semibold text-gray-900 text-sm mb-1 truncate">{lesson.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium text-xs">{lesson.xp || 50} XP</span>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full animate-pulse">
                        Current
                      </span>
                    )}
                    {isLocked && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Final Reward Node */}
          {isChristianContent && crossLayout ? (
            /* Christian Cross Completion Reward - Center of cross */
            <div className="absolute" style={{ left: 200 - 48, top: 200 - 48 }}>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-yellow-700" />
              </div>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white rounded-lg px-3 py-2 shadow-md border border-yellow-200 min-w-[160px]">
                <div className="font-semibold text-gray-900 text-sm mb-1">Cross Complete!</div>
                <div className="text-xs text-gray-600">Faith strengthened!</div>
              </div>
            </div>
          ) : (
            /* Regular Path Completion Reward */
            <div className="absolute" style={{ left: 200 - 48, top: 40 + lessons.length * ROW_HEIGHT }}>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-yellow-700" />
              </div>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white rounded-lg px-3 py-2 shadow-md border border-yellow-200 min-w-[160px]">
                <div className="font-semibold text-gray-900 text-sm mb-1">Complete!</div>
                <div className="text-xs text-gray-600">Great job!</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Free Jumping Companion - Positioned to the right of the path */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 z-20">
        <div className="w-24 h-24 animate-gentle-bounce">
          <img 
            src="/images/firstgif.gif" 
            alt="Jumping Companion" 
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const nextSibling = target.nextSibling as HTMLElement;
              if (nextSibling) {
                nextSibling.style.display = 'block';
              }
            }}
          />
          <span className="text-6xl hidden">🎉</span>
        </div>
      </div>
    </div>
  );
}

// Add custom CSS animations
const styles = `
  @keyframes gentle-bounce {
    0%, 100% { 
      transform: translateY(0px) scale(1); 
    }
    25% { 
      transform: translateY(-8px) scale(1.05); 
    }
    50% { 
      transform: translateY(-12px) scale(1.1); 
    }
    75% { 
      transform: translateY(-6px) scale(1.05); 
    }
  }
  
  @keyframes path-glow {
    0%, 100% { 
      opacity: 0.9;
      filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
    }
    50% { 
      opacity: 1;
      filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.8));
    }
  }
  
  .animate-gentle-bounce {
    animation: gentle-bounce 2s ease-in-out infinite;
  }
  
  .animate-path-glow {
    animation: path-glow 3s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}