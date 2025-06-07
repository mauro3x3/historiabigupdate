import React, { useState, useRef, useEffect } from 'react';
import { Check, Lock, BookOpen, Package, BookText } from 'lucide-react';

const NODE_SIZE = 60;
const CHEST_SIZE = 80;
const LABEL_GAP = 8;
const ROW_HEIGHT = 92;
const ZIGZAG_X = 60;
const PATH_WIDTH = 20;
const PATH_COLOR = 'url(#pathGradient)';

function getNodeX(idx, centerX) {
  return centerX + (idx % 2 === 0 ? -ZIGZAG_X : ZIGZAG_X);
}

function getMajorityEra(lessons) {
  // Returns 'BC' if most years are BC/BCE, 'AD' if most are AD/CE, '' otherwise
  let bc = 0, ad = 0;
  for (const l of lessons) {
    const y = String(l.year || '').toUpperCase();
    if (y.includes('BC') || y.includes('BCE')) bc++;
    if (y.includes('AD') || y.includes('CE')) ad++;
  }
  if (bc > ad && bc > 0) return 'BC';
  if (ad > bc && ad > 0) return 'AD';
  return '';
}

// Add a helper for rolling number animation
function RollingYear({ value, defaultEra }) {
  // Extract numeric year and suffix (e.g., BCE, BC, AD, CE)
  const match = String(value).match(/(\d{1,4})(\s*(BCE|BC|CE|AD))?/i);
  const numericYear = match ? match[1] : null;
  let suffix = match && match[3] ? match[3].toUpperCase() : '';
  // If no suffix, use defaultEra if provided
  if (!suffix && defaultEra) suffix = defaultEra;
  const [display, setDisplay] = useState(numericYear || value);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!numericYear) {
      setDisplay(value);
      setRolling(false);
      return;
    }
    if (numericYear === display) return;
    setRolling(true);
    let frame = 0;
    const start = parseInt(display) || 0;
    const end = parseInt(numericYear) || 0;
    const diff = end - start;
    const steps = 12;
    function animate() {
      frame++;
      const next = Math.round(start + (diff * frame) / steps);
      setDisplay(next);
      if (frame < steps) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(end);
        setRolling(false);
      }
    }
    animate();
    // eslint-disable-next-line
  }, [numericYear, value]);

  // If not a numeric year, just show the value as plain text
  if (!numericYear) {
    return <span style={{ minWidth: 40 }}>{value}</span>;
  }
  // Style for rolling effect
  return (
    <span style={{ display: 'inline-block', minWidth: 40, transition: 'transform 0.3s', transform: rolling ? 'translateY(-10%) scale(1.1)' : 'none' }}>
      {display} {suffix && <span style={{ fontSize: 14, marginLeft: 2 }}>{suffix}</span>}
    </span>
  );
}

export default function LearningPath({ chapters = [], onLessonClick }) {
  // Section/unit info for top bar (use first chapter as example)
  const sectionTitle = chapters[0]?.title || 'Section 1, Unit 1';
  const mainTitle = chapters[0]?.lessons?.[0]?.title || 'Your Learning Journey';

  // Flatten lessons
  const lessons = chapters.flatMap(ch => ch.lessons);
  // Chunk into sections of 5
  const chunkSize = 5;
  const lessonChunks = [];
  for (let i = 0; i < lessons.length; i += chunkSize) {
    lessonChunks.push(lessons.slice(i, i + chunkSize));
  }

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
  const activeYear = activeLesson.year || '';
  const activeTitle = activeLesson.title || mainTitle;

  // Determine the defaultEra for the current chunk
  const currentChunkIdx = Math.floor(activeLessonIdx / chunkSize);
  const currentChunk = lessonChunks[currentChunkIdx] || [];
  const defaultEra = getMajorityEra(currentChunk);

  // Render each chunk as a vertical path
  return (
    <div className="relative w-full max-w-xl mx-auto py-8">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between rounded-2xl px-6 py-4 mb-8 shadow-xl bg-gradient-to-r from-green-400 to-lime-400 border border-green-300 sticky top-4 z-30" style={{ minHeight: 70 }}>
        <div className="flex flex-col">
          <span className="uppercase text-xs font-bold text-green-900/80 tracking-widest mb-1">
            <RollingYear value={activeYear} defaultEra={defaultEra} />
          </span>
          <span className="text-2xl font-extrabold text-white drop-shadow-lg">{activeTitle}</span>
        </div>
        {/* Date and section/unit title now update as you scroll. */}
      </div>
      {lessonChunks.map((chunk, chunkIdx) => {
        // Add chest as last node
        const nodes = [...chunk, { isChest: true, id: `chest-${chunkIdx}` }];
        const svgHeight = ROW_HEIGHT * (nodes.length - 1) + NODE_SIZE;
        const svgWidth = 340;
        const centerX = svgWidth / 2;
        // Calculate node positions
        const points = nodes.map((_, idx) => ({
          x: getNodeX(idx, centerX),
          y: idx * ROW_HEIGHT + NODE_SIZE / 2,
        }));
        // Path: single polyline through all node centers
        const pathD = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
        return (
          <div key={chunkIdx} className="relative w-full" style={{ minHeight: svgHeight + 40, marginBottom: 24 }}>
            {/* SVG path */}
            <svg width={svgWidth} height={svgHeight} className="absolute left-1/2 -translate-x-1/2 top-0 z-0 pointer-events-none">
              <defs>
                <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.0" />
                  <stop offset="10%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={pathD} fill="none" stroke={PATH_COLOR} strokeWidth={PATH_WIDTH} strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            </svg>
            {/* Render nodes */}
            {nodes.map((lesson, idx) => {
              const pt = points[idx];
              const isLeft = idx % 2 === 0;
              // Chest node
              if (lesson.isChest) {
                return (
                  <div
                    key={lesson.id}
                    style={{
                      position: 'absolute',
                      left: pt.x - CHEST_SIZE / 2,
                      top: pt.y - CHEST_SIZE / 2,
                      zIndex: 2,
                      width: CHEST_SIZE,
                      height: CHEST_SIZE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #fbbf24 60%, #f59e42 100%)',
                      borderRadius: 28,
                      boxShadow: '0 0 48px 12px #fbbf24cc, 0 8px 32px #fbbf24cc',
                      border: '4px solid #f59e42',
                    }}
                  >
                    <Package className="w-16 h-16 text-yellow-700 drop-shadow-xl" />
                  </div>
                );
              }
              // Node status
              let nodeColor = 'bg-gray-200 border-gray-300 shadow-xl';
              let icon = <Lock className="w-8 h-8 text-gray-400" />;
              if (lesson.status === 'completed') {
                nodeColor = 'bg-gradient-to-br from-green-400 to-blue-400 border-green-500 shadow-2xl';
                icon = <Check className="w-9 h-9 text-white drop-shadow-lg" />;
              } else if (lesson.status === 'current') {
                nodeColor = 'bg-gradient-to-br from-yellow-200 to-pink-300 border-pink-400 shadow-2xl animate-glow';
                icon = <BookOpen className="w-9 h-9 text-pink-600 drop-shadow-lg" />;
              }
              const clickable = lesson.status !== 'locked';
              // Label pill
              const label = (
                <div
                  className="inline-block font-semibold text-gray-900 text-base bg-white/90 px-5 py-2 rounded-full shadow-lg border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    minWidth: 120,
                    maxWidth: 220,
                    marginLeft: isLeft ? LABEL_GAP : 0,
                    marginRight: isLeft ? 0 : LABEL_GAP,
                    boxShadow: '0 2px 12px #b3b3b3cc',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                  ref={el => {
                    if (!nodeRefs.current) nodeRefs.current = [];
                    nodeRefs.current[idx + chunkIdx * chunkSize] = el;
                  }}
                >
                  {lesson.title}
                </div>
              );
              // Year pill hidden since date is now in the top bar
              const year = null;
              return (
                <div
                  key={lesson.id}
                  style={{
                    position: 'absolute',
                    left: isLeft ? pt.x - NODE_SIZE / 2 - 2 : pt.x - NODE_SIZE / 2 - 2,
                    top: pt.y - NODE_SIZE / 2,
                    zIndex: 2,
                    width: svgWidth,
                    height: NODE_SIZE,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  }}
                >
                  {/* Node (circle) */}
                  <button
                    className={`w-16 h-16 rounded-full border-4 ${nodeColor} flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-300 focus:outline-none ${clickable ? 'hover:scale-110 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                    onClick={() => clickable && onLessonClick && onLessonClick(lesson)}
                    disabled={!clickable}
                    title={clickable ? lesson.title : 'Complete previous lessons to unlock!'}
                    tabIndex={clickable ? 0 : -1}
                    style={lesson.status === 'current' ? { boxShadow: '0 0 0 10px #fbbf24aa, 0 2px 16px #bbb' } : {}}
                  >
                    {icon}
                  </button>
                  {/* Label pill, attached and slightly overlapping node */}
                  {isLeft ? (
                    <>
                      {label}
                      {/* {year} */}
                    </>
                  ) : (
                    <>
                      {/* {year} */}
                      {label}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}