import React, { useState, useEffect } from 'react';
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

// Phoenix Wright-style Tenma dialogue box with sound and pop-in animation
const TenmaDialogue = ({ lines, onComplete }: { lines: string[]; onComplete: () => void }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    playBubblesSound(); // Play water sound when Tenma appears
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(lines[currentLine].slice(0, i + 1));
      i++;
      if (i >= lines[currentLine].length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [currentLine, lines]);

  const handleNext = () => {
    if (currentLine < lines.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      playJoyfulSound();
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <img 
        src="/images/avatars/mascot.png" 
        alt="Tenma" 
        className="w-32 h-32 mb-2 tenma-pop-in"
        style={{ animation: 'tenmaPopIn 0.5s cubic-bezier(.68,-0.55,.27,1.55)' }}
      />
      <div className="bg-blue-100 border border-blue-300 rounded-xl px-6 py-4 mb-4 text-lg text-blue-900 max-w-xl w-full shadow-lg relative">
        <span className="block font-bold mb-2">Tenma</span>
        <span>{displayedText}</span>
      </div>
      <div className="flex gap-4">
        {currentLine < lines.length - 1 ? (
          <Button onClick={handleNext} className="bg-green-500 hover:bg-green-600">Next</Button>
        ) : (
          <Button onClick={handleNext} className="bg-green-500 hover:bg-green-600">Start Quiz</Button>
        )}
      </div>
    </div>
  );
};

// Add Tenma pop-in animation CSS
const style = document.createElement('style');
style.innerHTML = `
@keyframes tenmaPopIn {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.tenma-pop-in { animation: tenmaPopIn 0.5s cubic-bezier(.68,-0.55,.27,1.55); }
`;
document.head.appendChild(style);

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [showStoryPhase, setShowStoryPhase] = useState(true);
  const [showTenmaTransition, setShowTenmaTransition] = useState(false);
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
    setLessonCompleted,
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
      // Try to fetch all modules in the same journey or chapter
      // Prefer journey_id if available, else fallback to era
      const fetchNext = async () => {
        let modulesRes;
        if ((lesson as any).journey_id) {
          modulesRes = await dbService.modules.getByJourneyId((lesson as any).journey_id);
        } else if ((lesson as any).chapter_id) {
          modulesRes = await dbService.modules.getByChapterId((lesson as any).chapter_id);
        } else if (lesson.era) {
          // Fallback: fetch all modules with same era
          modulesRes = await dbService.modules.getAll();
          if (modulesRes.data) {
            modulesRes.data = modulesRes.data.filter((m: any) => m.era === lesson.era);
          }
        }
        const modules = modulesRes?.data || [];
        // Sort by position or id
        modules.sort((a: any, b: any) => (a.position || a.id) - (b.position || b.id));
        const idx = modules.findIndex((m: any) => String(m.id) === String(lesson.id));
        if (idx !== -1 && idx < modules.length - 1) {
          setNextModule(modules[idx + 1]);
        } else {
          setNextModule(null);
        }
      };
      fetchNext();
    }
  }, [lessonCompleted, lesson]);

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
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
          {mainImage && (
            <img src={mainImage} alt="Story visual" className="w-48 h-48 object-cover rounded shadow mb-4" />
          )}
          <div className="w-full prose prose-lg max-w-none mb-6 min-h-[200px]">
            <span style={{ whiteSpace: 'pre-line', fontFamily: 'inherit' }}>{animatedStory || <em>Loading story...</em>}</span>
          </div>
          <Button className="mt-2 px-8 py-3 text-lg bg-green-500 hover:bg-green-600" onClick={() => { setShowStoryPhase(false); setShowTenmaTransition(true); }}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Show Tenma transition before quiz
  if (showTenmaTransition) {
    const tenmaLines = [
      "Yo! I'm Tenma, your adventure buddy!",
      "That was a wild story, huh? Ready to show me what you learned? Let's go!"
    ].filter(Boolean);
    return (
      <TenmaDialogue
        lines={tenmaLines.length > 0 ? tenmaLines : ["Let's get started!"]}
        onComplete={() => setShowTenmaTransition(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LessonHeader title={lesson?.title || 'Loading...'} />
      
      <main className="container mx-auto py-8 px-4">
        {!lessonCompleted ? (
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
          <>
            <div className="flex flex-col items-center justify-center mb-4">
              <img src="/images/avatars/mascot.png" alt="Mascot" className="w-32 h-32 mb-2 animate-bounce-slow" />
            </div>
            <LessonCompletion
              correctAnswers={correctAnswers}
              totalQuestions={questions.length}
              onReturn={returnToDashboard}
              onNext={nextModule ? () => navigate(`/lesson/${nextModule.id}`) : undefined}
              nextModuleTitle={nextModule ? nextModule.title : undefined}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
