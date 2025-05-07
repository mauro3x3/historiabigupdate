import React, { useState } from 'react';
import { CheckCircle, Lock, Star, Info } from 'lucide-react';

export interface JourneyLessonNode {
  id: string | number;
  title: string;
  xp: number;
  status: 'completed' | 'current' | 'locked';
  description?: string;
  duration?: string;
}

const jewishTheme = {
  background: 'bg-gradient-to-b from-[#eaf0fa] to-[#f7fafd]', // subtle blue gradient
  node: {
    completed: 'bg-[#b3c7e6] border-[#23395d] text-[#23395d]', // lighter blue
    current: 'bg-[#23395d] border-[#23395d] text-[#e2b13c] animate-bounce', // deep blue, gold text
    locked: 'bg-[#e5eaf3] border-[#b3c7e6] text-gray-400', // blue-gray
  },
  connector: 'bg-gradient-to-b from-[#23395d] to-[#b3c7e6]', // blue connector
  icon: {
    completed: <CheckCircle className="w-7 h-7 text-[#23395d]" />,
    current: <Star className="w-7 h-7 text-[#e2b13c] animate-pulse" />,
    locked: <Lock className="w-7 h-7" />,
  },
  starOfDavid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block ml-1 align-middle">
      <polygon points="12,2 15,8 21,8 17,13 19,20 12,16 5,20 7,13 3,8 9,8" stroke="#23395d" strokeWidth="1.5" fill="#eaf0fa" />
      <polygon points="12,4 14.5,8.5 19,8.5 15.5,13 17,18 12,15 7,18 8.5,13 5,8.5 9.5,8.5" stroke="#e2b13c" strokeWidth="0.7" fill="#b3c7e6" />
    </svg>
  ),
};

interface JourneyPathProps {
  lessons: JourneyLessonNode[];
  onLessonClick?: (lessonId: string | number) => void;
  theme?: 'jewish';
}

const JourneyPath: React.FC<JourneyPathProps> = ({ lessons, onLessonClick, theme = 'jewish' }) => {
  const [hoveredLesson, setHoveredLesson] = useState<JourneyLessonNode | null>(null);
  const t = jewishTheme; // For now, only Jewish theme

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const totalCount = lessons.length;

  return (
    <div className={`flex flex-col items-center w-full py-8 ${t.background}`} style={{ borderRadius: 18 }}>
      <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
        {lessons.map((lesson, idx) => (
          <React.Fragment key={lesson.id}>
            {/* Connector */}
            {idx > 0 && (
              <div className={`w-1 h-10 ${t.connector} mx-auto`} />
            )}
            {/* Node */}
            <button
              type="button"
              disabled={lesson.status === 'locked'}
              onClick={() => lesson.status !== 'locked' && onLessonClick?.(lesson.id)}
              onMouseEnter={() => setHoveredLesson(lesson)}
              onMouseLeave={() => setHoveredLesson(null)}
              className={`flex items-center w-full max-w-xs px-4 py-3 mb-2 rounded-2xl border-4 shadow-lg transition-all duration-300 relative z-10 focus:outline-none group
                ${t.node[lesson.status]}
                ${lesson.status !== 'locked' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
              `}
              style={{ minHeight: 64 }}
              tabIndex={lesson.status === 'locked' ? -1 : 0}
              aria-label={lesson.title}
            >
              <div className="flex-shrink-0 mr-4">
                {t.icon[lesson.status]}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-base leading-tight flex items-center gap-2">
                  {lesson.title}
                  {lesson.status === 'current' && t.starOfDavid}
                  <Info className="w-4 h-4 text-[#23395d]/60 group-hover:text-[#23395d] ml-1" />
                </div>
                <div className="text-xs font-semibold mt-1 flex items-center gap-1">
                  <span className="text-[#e2b13c]">{lesson.xp} XP</span>
                  {lesson.status === 'completed' && <span className="ml-2 text-[#23395d] bg-[#b3c7e6] rounded px-2 py-0.5 text-xs">Completed</span>}
                  {lesson.status === 'current' && <span className="ml-2 text-[#e2b13c] bg-[#23395d]/80 rounded px-2 py-0.5 text-xs animate-pulse">Current</span>}
                  {lesson.status === 'locked' && <span className="ml-2 text-gray-500 bg-[#e5eaf3] rounded px-2 py-0.5 text-xs">Locked</span>}
                </div>
              </div>
            </button>
            {/* Tooltip for lesson details */}
            {hoveredLesson && hoveredLesson.id === lesson.id && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white border border-[#b3c7e6] rounded-lg shadow-lg p-4 z-50 w-64 animate-fade-in text-left">
                <div className="font-bold text-[#23395d] mb-1">{lesson.title}</div>
                {lesson.description && <div className="text-sm text-gray-700 mb-1">{lesson.description}</div>}
                {lesson.duration && <div className="text-xs text-gray-500 mb-1">Duration: {lesson.duration}</div>}
                <div className="text-xs text-[#e2b13c] font-semibold">{lesson.xp} XP</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s;
        }
      `}</style>
    </div>
  );
};

export default JourneyPath; 