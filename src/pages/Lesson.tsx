import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LessonHeader from '@/components/lesson/LessonHeader';
import LessonProgress from '@/components/lesson/LessonProgress';
import QuizQuestion from '@/components/lesson/QuizQuestion';
import LessonCompletion from '@/components/lesson/LessonCompletion';
import StorytellingLesson from '@/components/lesson/StorytellingLesson'; 
import { useLesson } from '@/hooks/useLesson';
import { useUser } from '@/contexts/UserContext';
import { useQuiz } from '@/hooks/useQuiz';
import { playBubblesSound, playJoyfulSound, preloadSounds } from '@/utils/audioUtils';
import { dbService } from '@/services/dbService';
import ReadAloudButton from '@/components/ReadAloudButton';
import { Volume2, Heart, Flame } from 'lucide-react';

// Phoenix Wright-style Johan dialogue box with sound and pop-in animation
const playJohanDialogueSound = () => {
  const audio = new Audio('/sounds/correct-answer.mp3');
  audio.volume = 0.7;
  audio.play();
};

const JohanDialogue = ({ lines, onComplete }: { lines: string[]; onComplete: () => void }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (!soundPlayed.current) {
      playJohanDialogueSound();
      soundPlayed.current = true;
    }
  }, []);

  const handleNext = () => {
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-yellow-50/80 to-purple-100/80 backdrop-blur transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} animate-aurora-fade-in`}>
      {/* Sparkle/confetti effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className={`absolute rounded-full opacity-30 animate-johan-sparkle sparkle-color-${i % 4}`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
        <div className="relative mb-4 flex flex-col items-center">
          {/* Soft colored glow behind Johan */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100 blur-2xl opacity-60" style={{ width: 220, height: 220 }} />
          {/* Johan image with drop shadow */}
          <img src="/images/avatars/Johan.png" alt="Johan" className="w-44 h-44 z-10 relative drop-shadow-2xl animate-johan-pop" />
          {/* Animated speech bubble with typing effect */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-6 py-3 text-lg font-semibold text-timelingo-purple border-2 border-yellow-200 animate-bubble-in"
            style={{ minWidth: 260, maxWidth: 340, fontFamily: 'Baloo 2, cursive', fontWeight: 700, textAlign: 'center', zIndex: 10 }}>
            {lines[currentLineIndex]}
            <span className="inline-block w-2 h-5 align-middle animate-type-cursor bg-timelingo-purple/60 ml-1 rounded" />
            {/* Bubble tail */}
            <span style={{
              position: 'absolute',
              left: '50%',
              bottom: '-18px',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '18px solid #fff',
              filter: 'drop-shadow(0 2px 2px #eab30833)'
            }} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-timelingo-purple mb-2">Johan</h2>
        {/* Keep the original button as is */}
        <button
          onClick={handleNext}
          className="mt-2 px-10 py-3 text-lg bg-gradient-to-r from-timelingo-gold to-yellow-400 hover:from-yellow-400 hover:to-timelingo-gold text-timelingo-navy rounded-full shadow-lg font-bold tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-200 flex items-center gap-2 animate-fade-in z-20 animate-pulse-btn"
        >
          {currentLineIndex < lines.length - 1 ? (<><span>Next</span><svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>) : (<><span>Start Quiz</span><svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg></>)}
        </button>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap');
        .animate-bubble-in { animation: bubbleIn 0.7s cubic-bezier(.22,1,.36,1); }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(24px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-johan-pop { animation: johanPop 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
        @keyframes johanPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-johan-sparkle { animation: sparkle 5.5s infinite linear; }
        @keyframes sparkle {
          0% { opacity: 0.2; transform: scale(1) translateY(0); }
          50% { opacity: 0.5; transform: scale(1.3) translateY(-10px); }
          100% { opacity: 0.2; transform: scale(1) translateY(0); }
        }
        .sparkle-color-0 { background: #fbbf24; }
        .sparkle-color-1 { background: #a5b4fc; }
        .sparkle-color-2 { background: #f472b6; }
        .sparkle-color-3 { background: #6ee7b7; }
      `}</style>
    </div>
  );
};

// Add Johan pop-in animation CSS
const styles = `
  @keyframes johanPopIn {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  .johan-pop-in { animation: johanPopIn 0.5s cubic-bezier(.68,-0.55,.27,1.55); }
`;

const MAX_LIVES = 3;
const STREAK_KEY = 'historia_streak';
const STREAK_DATE_KEY = 'historia_streak_date';
const STREAK_REWARD_MILESTONE = 5;

// Simple Tooltip component
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={e => { e.preventDefault(); setVisible(v => !v); }}
      tabIndex={0}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute left-1/2 -translate-x-1/2 -top-10 z-50 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fade-in" style={{ minWidth: 120 }}>
          {text}
        </span>
      )}
    </span>
  );
};

// Removed utility functions that were only used for dolphin functionality

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXp, incrementStreak, resetStreak, streak } = useUser();
  const [showStoryPhase, setShowStoryPhase] = useState(true);
  const [storyFading, setStoryFading] = useState(false);
  const [animatedStory, setAnimatedStory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [nextModule, setNextModule] = useState<any | null>(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [outOfLives, setOutOfLives] = useState(false);
  const [showStreakReward, setShowStreakReward] = useState(false);
  const [nextModuleLoading, setNextModuleLoading] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [storyFont, setStoryFont] = useState<string>(() => localStorage.getItem('lessonFont') || 'serif');
  
  // Admin editing state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingText, setEditingText] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [editStartIndex, setEditStartIndex] = useState(0);
  const [editEndIndex, setEditEndIndex] = useState(0);
  const [originalText, setOriginalText] = useState('');
  
  // Card resizing state
  const [cardWidth, setCardWidth] = useState(768); // Default max-w-3xl (768px)
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  
  const {
    lesson,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswerCorrect,
    correctAnswers,
    loading,
    lessonCompleted,
    setCurrentQuestionIndex,
    setSelectedAnswer,
    setIsAnswerCorrect,
    setCorrectAnswers,
    setLessonCompleted,
    error
  } = useLesson(lessonId, navigate);
  
  const { 
    handleAnswerSelect, 
    checkAnswer, 
    completeLessonAndAwardXp
  } = useQuiz(
    lesson, 
    questions, 
    currentQuestionIndex, 
    correctAnswers, 
    setCurrentQuestionIndex,
    setSelectedAnswer,
    setIsAnswerCorrect,
    setCorrectAnswers,
    (val) => { setLessonCompleted(val); },
    isAnswerCorrect,
    selectedAnswer
  );

  // Admin functions
  const handlePasswordSubmit = () => {
    if (adminPassword === 'doflamingo') {
      setIsAdminMode(true);
      setShowPasswordPrompt(false);
      setAdminPassword('');
      toast.success('Admin mode enabled');
    } else {
      toast.error('Incorrect password');
      setAdminPassword('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setAdminPassword('');
  };

  const handleTextSelection = () => {
    if (!isAdminMode) return;
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
      setOriginalText(selection.toString());
      setEditStartIndex(selection.anchorOffset);
      setEditEndIndex(selection.focusOffset);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (!isAdminMode) return;
    
    e.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
      setOriginalText(selection.toString());
      setEditStartIndex(selection.anchorOffset);
      setEditEndIndex(selection.focusOffset);
      setEditingText(true);
    }
  };

  const handleTextEdit = (newText: string) => {
    setSelectedText(newText);
  };

  const saveTextChanges = async () => {
    if (!lesson || !storyRef.current) return;

    try {
      const { error } = await supabase
        .from('modules')
        .update({ 
          story_content: storyRef.current.innerHTML 
        })
        .eq('id', parseInt(lesson.id));

      if (error) {
        console.error('Error saving text:', error);
        toast.error('Failed to save changes');
      } else {
        toast.success('Text saved successfully');
        setEditingText(false);
        setSelectedText('');
      }
    } catch (error) {
      console.error('Error saving text:', error);
      toast.error('Failed to save changes');
    }
  };

  const cancelTextEdit = () => {
    if (storyRef.current) {
      storyRef.current.innerHTML = originalText;
    }
    setEditingText(false);
    setSelectedText('');
  };

  // Card resizing functions
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStartX(e.clientX);
    setResizeStartWidth(cardWidth);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStartX;
    const newWidth = Math.max(400, Math.min(1600, resizeStartWidth + deltaX)); // Min 400px, Max 1600px
    setCardWidth(newWidth);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizeStartX, resizeStartWidth]);
  
  // Animate story text
  useEffect(() => {
    const storyText = lesson?.story_content || lesson?.description || '';
    if (showStoryPhase && storyText) {
      setIsTyping(true);
      let i = 0;
      setAnimatedStory('');
      const plainText = storyText.replace(/<[^>]+>/g, ''); // Remove HTML tags for animation
      const interval = setInterval(() => {
        setAnimatedStory(plainText.slice(0, i + 1));
        i++;
        if (i >= plainText.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 12);
      return () => clearInterval(interval);
    }
  }, [showStoryPhase, lesson]);

  // Quiz fail logic: lose a life if answer is wrong
  useEffect(() => {
    if (isAnswerCorrect === false) {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setOutOfLives(true);
        return Math.max(newLives, 0);
      });
    }
  }, [isAnswerCorrect]);

  useEffect(() => {
    if (lessonCompleted) {
      const updateStreak = async () => {
        const today = new Date().toISOString().slice(0, 10);
        const lastDate = localStorage.getItem('historia_streak_date');
        if (lastDate === today) {
          // Already counted today, do nothing
          return;
        }
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (lastDate === yesterday) {
          await incrementStreak();
        } else {
          await resetStreak();
          await incrementStreak();
        }
        localStorage.setItem('historia_streak_date', today);
      };
      updateStreak();
    }
  }, [lessonCompleted]);

  // Next Module logic: query Supabase directly for next module
  useEffect(() => {
    if (lessonCompleted && lesson && lesson.id && lesson.journey_id != null && lesson.level != null) {
      setNextModuleLoading(true);
      const fetchNext = async () => {
        // Ensure journey_id and level are numbers
        const journeyIdNum = Number(lesson.journey_id);
        const levelNum = Number(lesson.level);
        console.log('Querying next module with journey_id:', journeyIdNum, 'level:', levelNum);
        // Query Supabase for the next module in the journey
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('journey_id', journeyIdNum)
          .gt('level', levelNum)
          .order('level', { ascending: true })
          .limit(1)
          .maybeSingle();
        if (error) {
          console.error('Error fetching next module:', error);
        }
        setNextModule(data || null);
        setNextModuleLoading(false);
        // Debug log
        console.log('[NextModule Direct Query] Next module:', data);
      };
      fetchNext();
    }
  }, [lessonCompleted, lesson]);

  // On lessonId change, always reset to story phase and not completed
  useEffect(() => {
    setShowStoryPhase(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setCorrectAnswers(0);
    setLessonCompleted(false);
    // If the new lesson has no story, skip story phase
    if (lesson && !lesson.story_content && !lesson.description) {
      setShowStoryPhase(false);
    }
  }, [lessonId, lesson]);

  // Listen for text selection in the story
  useEffect(() => {
    const handleSelectionChange = () => {
      // Removed dolphin functionality - no more text selection handling needed
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Removed handler for "Ask the Dolphin"

  // Removed tooltip on click elsewhere

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      completeLessonAndAwardXp();
    }
  };

  const returnToDashboard = () => {
    navigate('/dashboard');
  };
  
  // Debug log for lessonId and lesson
  console.log('LessonPage loaded for lessonId:', lessonId);

  // Add Enter key handler for story phase Continue button
  useEffect(() => {
    if (!showStoryPhase) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        const btn = document.querySelector('button[data-testid="story-continue-btn"]');
        if (btn) (btn as HTMLButtonElement).click();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showStoryPhase]);

  // Add ArrowLeft key handler for Back button
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        const btn = document.querySelector('button[data-testid="lesson-back-btn"]');
        if (btn) (btn as HTMLButtonElement).click();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Add robust error handling for loading and missing lesson
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-timelingo-purple">Loading lesson...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}. Please check your link or try again later.</div>;
  }
  if (!lesson) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Lesson not found. Please check your link or try again later.</div>;
  }

  // Debug logs to verify lesson data
  console.log('--- STORY PHASE DEBUG ---');
  console.log('lesson:', lesson);
  console.log('lesson.story_content:', lesson?.story_content);
  console.log('lesson.description:', lesson?.description);
  let mainImage = '';
  if (lesson.image_urls && lesson.image_urls.split(',').filter(url => url.trim())[0]) {
    mainImage = lesson.image_urls.split(',').filter(url => url.trim())[0];
  }

  let storyPhaseContent = null;
  if (showStoryPhase) {
    storyPhaseContent = (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center relative">
        <div
          className="mx-auto p-8 bg-gray-200 rounded-3xl shadow-2xl flex flex-col items-center border border-gray-400 relative"
          style={{ width: `${cardWidth}px` }}
        >
          {/* Resize handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-300 transition-colors group"
            onMouseDown={handleResizeStart}
            style={{ 
              background: isResizing ? '#60a5fa' : 'transparent',
              borderRadius: '0 1.5rem 1.5rem 0'
            }}
            title="Drag to resize card"
          >
            {/* Resize indicator dots */}
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 bg-blue-500 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          {mainImage && (
             <img
               src={mainImage}
               alt="Story visual"
               className="w-56 h-56 object-cover rounded-full border-4 border-blue-200 shadow-lg mb-6 cursor-pointer hover:scale-105 transition-transform"
               onClick={() => setModalImageUrl(mainImage)}
             />
           )}
          <div className="flex justify-center w-full mb-4">
            <ReadAloudButton text={lesson.story_content || lesson.description || ''} />
          </div>
          <div
            ref={storyRef}
            className={`w-full prose prose-lg max-w-none mb-8 min-h-[200px] text-center text-gray-800 relative ${storyFont === 'serif' ? 'font-serif' : storyFont === 'sans-serif' ? 'font-sans' : storyFont === 'opendyslexic' ? 'font-opendyslexic' : storyFont ? `font-${storyFont}` : ''} ${isAdminMode ? 'cursor-text select-text' : ''}`}
            style={{ fontSize: 20, lineHeight: 1.7 }}
            onMouseUp={handleTextSelection}
            onContextMenu={handleRightClick}
            contentEditable={isAdminMode}
            suppressContentEditableWarning={true}
          >
            {isTyping ? (
              <span>{animatedStory}<span className="type-cursor">|</span></span>
            ) : (
              (() => {
                const html = lesson.story_content || lesson.description || '<em>No story available.</em>';
                const parser = new DOMParser();
                const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
                function renderNode(node: ChildNode, i: number): React.ReactNode {
                  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
                  if (node.nodeType !== Node.ELEMENT_NODE) return null;
                  const el = node as HTMLElement;
                  if (el.classList.contains('explain') && el.dataset.explain) {
                    return <Tooltip key={i} text={el.dataset.explain}>{el.textContent}</Tooltip>;
                  }
                  // Recursively render children
                  return React.createElement(
                    el.tagName.toLowerCase(),
                    { key: i, ...Array.from(el.attributes).reduce((acc, attr) => { acc[attr.name] = attr.value; return acc; }, {}) },
                    ...Array.from(el.childNodes).map((child, j) => renderNode(child, j))
                  );
                }
                return Array.from(doc.body.firstChild?.childNodes || []).map((node, i) => renderNode(node, i));
              })()
            )}
            <style>{`
              .type-cursor {
                display: inline-block;
                width: 1ch;
                animation: blink 1s steps(1) infinite;
                color: #888;
                font-weight: bold;
              }
              @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
              }
            `}</style>
                                      {/* Removed Ask the Dolphin button and related functionality */}
             <div className="mt-8 flex justify-center" style={{ minHeight: '60px' }}>
               <button
                 className="px-10 py-3 text-lg continue-button-solid transition-all duration-200"
                 style={{
                   backgroundColor: '#2563eb',
                   color: 'white',
                   border: '2px solid #1d4ed8',
                   fontWeight: 'bold',
                   backgroundImage: 'none',
                   position: 'relative',
                   zIndex: 10,
                   transform: 'translateZ(0)'
                 }}
                 onClick={() => {
                   setStoryFading(true);
                   setTimeout(() => setShowStoryPhase(false), 400);
                 }}
                 data-testid="story-continue-btn"
               >
                 Continue
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (outOfLives) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-yellow-50 to-purple-100">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full border-4 border-red-200">
          <span className="text-4xl font-extrabold text-red-500 mb-2">💔 Out of Lives!</span>
          <p className="text-lg text-gray-700 mb-6 text-center">You've run out of lives for this module. Try again later or go back to the previous module to regain a life.</p>
          <Button className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-full shadow-lg font-bold tracking-wide" onClick={returnToDashboard}>
            Return to Profile
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
             <LessonHeader title={lesson?.title || 'Loading...'} />
       {/* Fixed back button to navigate to globe instead of navigate(-1) */}
       <button
         className="absolute top-20 left-6 bg-white rounded-full px-6 py-2 shadow-md text-black font-bold text-lg flex items-center gap-2 hover:bg-gray-50 transition z-20"
         onClick={() => navigate('/globe')}
         data-testid="lesson-back-btn"
       >
         <span className="mr-2">&larr;</span> Back to Globe
       </button>
       
       {/* Admin Mode Button */}
       {!isAdminMode && (
         <button
           className="absolute top-20 right-6 bg-orange-500 text-white rounded-full px-4 py-2 shadow-md font-bold text-sm hover:bg-orange-600 transition z-20"
           onClick={() => setShowPasswordPrompt(true)}
         >
           Admin
         </button>
       )}
       
       {/* Admin Mode Indicator */}
       {isAdminMode && (
         <div className="absolute top-20 right-6 bg-green-500 text-white rounded-full px-4 py-2 shadow-md font-bold text-sm z-20">
           Admin Mode
         </div>
       )}
      {/* Story phase content, if active */}
      {showStoryPhase ? (
        storyPhaseContent
      ) : (
        <main className="container mx-auto py-8 px-4">
          {/* Streak indicator hidden */}
          {(!lessonCompleted) ? (
            <>
              <LessonProgress 
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                correctAnswers={correctAnswers}
              />
              {questions.length > 0 && questions[currentQuestionIndex] ? (
                <QuizQuestion
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  selectedAnswer={selectedAnswer}
                  isAnswerCorrect={isAnswerCorrect}
                  correctAnswer={questions[currentQuestionIndex].correctAnswer}
                  answer={questions[currentQuestionIndex].answer}
                  explanation={questions[currentQuestionIndex].explanation}
                  onAnswerSelect={handleAnswerSelect}
                />
              ) : (
                <div className="text-red-500 text-center my-8">
                  No quiz questions found for this lesson.
                </div>
              )}
              {questions.length > 0 && (
                <div className="flex justify-center">
                  <Button 
                    className="bg-timelingo-purple hover:bg-purple-700"
                    disabled={selectedAnswer === null || isAnswerCorrect !== null}
                    onClick={checkAnswer}
                  >
                    Check Answer
                  </Button>
                </div>
              )}
            </>
          ) : (
            // Only show the completion modal when nextModuleLoading is false
            nextModuleLoading ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-yellow-50/80 to-purple-100/80 backdrop-blur animate-aurora-fade-in">
                <div className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border-4 border-yellow-200">
                  <span className="text-2xl font-bold text-timelingo-purple mb-2">Loading next module...</span>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-yellow-50/80 to-purple-100/80 backdrop-blur animate-aurora-fade-in">
                <div className="bg-white/90 rounded-3xl shadow-2xl p-16 flex flex-col items-center max-w-3xl w-full border-4 border-yellow-200">
                  <div className="mb-8">
                    <span className="text-6xl font-extrabold text-timelingo-purple block text-center">🎉</span>
                    <span className="text-4xl font-extrabold text-timelingo-purple block text-center mt-4">Module Completed!</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 leading-tight">{lesson?.title}</h2>
                  <p className="text-xl text-gray-700 mb-12 text-center leading-relaxed max-w-2xl">
                    {lesson?.description || "Great job finishing this module!"}
                  </p>
                  <div className="flex gap-8 mt-6 w-full justify-center">
                    <Button
                      className="px-8 py-3 text-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full shadow-lg font-bold tracking-wide"
                      onClick={() => nextModule && nextModule.id && navigate(`/lesson/${nextModule.id}`)}
                      disabled={!nextModule || !nextModule.id}
                    >
                      Next Module
                    </Button>
                    <Button
                      className="px-8 py-3 text-lg bg-timelingo-purple hover:bg-purple-700 text-white rounded-full shadow-lg font-bold tracking-wide"
                      onClick={() => navigate('/dashboard')}
                    >
                      Return to Profile
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      )}
      {/* Image Modal (always available) */}
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalImageUrl(null)}
        >
          <img
            src={modalImageUrl}
            alt="Full story visual"
            className="max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border-4 border-blue-200 bg-white"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-8 right-8 text-white text-3xl font-bold bg-black/40 rounded-full px-4 py-2 hover:bg-black/70 transition"
            onClick={() => setModalImageUrl(null)}
            aria-label="Close image modal"
          >
            ×
          </button>
        </div>
      )}

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Admin Access</h3>
            <p className="text-gray-600 mb-4">Enter the admin password to enable text editing:</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={handlePasswordCancel}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Editing Modal */}
      {editingText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Text</h3>
            <p className="text-gray-600 mb-2">Selected text:</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">
              {originalText}
            </div>
            <p className="text-gray-600 mb-2">Edit text:</p>
            <textarea
              value={selectedText}
              onChange={(e) => handleTextEdit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 min-h-[100px]"
              placeholder="Enter new text..."
            />
            <div className="flex gap-2">
              <button
                onClick={saveTextChanges}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={cancelTextEdit}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
 