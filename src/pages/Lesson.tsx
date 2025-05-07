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

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [showStoryPhase, setShowStoryPhase] = useState(true);
  const [showJohanTransition, setShowJohanTransition] = useState(false);
  const [animatedStory, setAnimatedStory] = useState('');
  const [nextModule, setNextModule] = useState<any | null>(null);
  
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
    setLessonCompleted
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
  
  // Animate story text
  useEffect(() => {
    if (showStoryPhase && lesson?.story_content) {
      preloadSounds();
      let i = 0;
      setAnimatedStory('');
      const plainText = lesson.story_content.replace(/<[^>]+>/g, ''); // Remove HTML tags for animation
      const interval = setInterval(() => {
        setAnimatedStory(plainText.slice(0, i + 1));
        i++;
        if (i >= plainText.length) clearInterval(interval);
      }, 8);
      return () => clearInterval(interval);
    }
  }, [showStoryPhase, lesson?.story_content]);

  // Fetch next module after lesson is completed
  useEffect(() => {
    if (lessonCompleted && lesson && lesson.id) {
      const fetchNext = async () => {
        const allRes = await dbService.modules.getAll();
        let allModules = (allRes.data || []).filter((m: any) =>
          m.journey_id && lesson.journey_id && String(m.journey_id) === String(lesson.journey_id)
        );
        // Do NOT fall back to all modules if none found for journey
        allModules.sort((a: any, b: any) => {
          const aLevel = Number(a.level) || 0;
          const bLevel = Number(b.level) || 0;
          if (aLevel !== bLevel) {
            return aLevel - bLevel;
          }
          return a.id - b.id;
        });
        let idx = allModules.findIndex((m: any) => String(m.id) === String(lesson.id));
        if (idx !== -1 && idx < allModules.length - 1) {
          setNextModule(allModules[idx + 1]);
        } else {
          setNextModule(null);
        }
      };
      fetchNext();
    }
  }, [lessonCompleted, lesson]);

  // On lessonId change, always reset to story phase and not completed
  useEffect(() => {
    setShowStoryPhase(true);
    setShowJohanTransition(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setCorrectAnswers(0);
    setLessonCompleted(false);
  }, [lessonId]);

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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading lesson content...</p>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-500">Lesson not found</p>
        <Button className="mt-4" onClick={returnToDashboard}>Return to Dashboard</Button>
      </div>
    );
  }

  // Show story phase first (Duolingo-style, now with image and animated text)
  if (showStoryPhase) {
    // Improved image selection: check both image_urls and image_url
    let mainImage = '';
    if (lesson.image_urls && lesson.image_urls.split(',').filter(url => url.trim())[0]) {
      mainImage = lesson.image_urls.split(',').filter(url => url.trim())[0];
    }
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-blue-100 flex flex-col items-center justify-center relative">
        {/* Step badge */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow border border-green-200">Step 1 of 2: Story</span>
        </div>
        <div className="max-w-xl w-full mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center border border-blue-100 backdrop-blur-md" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #e0e7ff 10%, transparent 80%)' }}>
          {mainImage && (
            <img src={mainImage} alt="Story visual" className="w-56 h-56 object-cover rounded-full border-4 border-blue-200 shadow-lg mb-6" />
          )}
          <div className="w-full prose prose-lg max-w-none mb-8 min-h-[200px] text-center text-gray-800" style={{ fontSize: 20, lineHeight: 1.7 }}>
            <span style={{ whiteSpace: 'pre-line', fontFamily: 'inherit' }}>{animatedStory || <em>Loading story...</em>}</span>
          </div>
          <Button className="mt-2 px-10 py-3 text-lg bg-green-500 hover:bg-green-600 rounded-full shadow-lg font-bold tracking-wide" onClick={() => { setShowStoryPhase(false); setShowJohanTransition(true); }}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Show Johan transition before quiz
  if (showJohanTransition) {
    const johanLines = [
      "Yo! I'm Johan, your adventure buddy!",
      "Ready to test your knowledge? Let's do this!",
      "Remember, every question is a chance to learn something new!"
    ];

    return (
      <JohanDialogue
        lines={johanLines.length > 0 ? johanLines : ["Let's get started!"]}
        onComplete={() => setShowJohanTransition(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LessonHeader title={lesson?.title || 'Loading...'} />
      
      <main className="container mx-auto py-8 px-4">
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
                explanation={questions[currentQuestionIndex].explanation}
                onAnswerSelect={handleAnswerSelect}
              />
            ) : (
              <Card className="mb-6">
                <CardContent className="py-6">
                  <p className="text-center">No questions available for this lesson.</p>
                </CardContent>
              </Card>
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
          // Always show the completion modal when lessonCompleted is true
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-yellow-50/80 to-purple-100/80 backdrop-blur animate-aurora-fade-in">
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border-4 border-yellow-200">
              <span className="text-4xl font-extrabold text-timelingo-purple mb-2">🎉 Module Completed!</span>
              <h2 className="text-2xl font-bold mb-4 text-center">{lesson?.title}</h2>
              <p className="text-lg text-gray-700 mb-6 text-center">
                {lesson?.description || "Great job finishing this module!"}
              </p>
              <div className="flex gap-4 mt-2 w-full justify-center">
                {nextModule && (
                  <Button
                    className="px-8 py-3 text-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full shadow-lg font-bold tracking-wide"
                    onClick={() => navigate(`/lesson/${nextModule.id}`)}
                  >
                    Next Module
                  </Button>
                )}
                <Button
                  className="px-8 py-3 text-lg bg-timelingo-purple hover:bg-purple-700 text-white rounded-full shadow-lg font-bold tracking-wide"
                  onClick={() => navigate('/dashboard')}
                >
                  Return to Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
