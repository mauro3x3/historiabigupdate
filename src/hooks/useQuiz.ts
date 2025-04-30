import { useUser } from '@/contexts/UserContext';
import { HistoryLesson, QuizQuestion } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useQuiz = (
  lesson: HistoryLesson | null,
  questions: QuizQuestion[],
  currentQuestionIndex: number,
  correctAnswers: number,
  setCurrentQuestionIndex: (index: number) => void,
  setSelectedAnswer: (answer: number | null) => void,
  setIsAnswerCorrect: (isCorrect: boolean | null) => void,
  setCorrectAnswers: (count: number) => void,
  setLessonCompleted: (completed: boolean) => void,
  isAnswerCorrect: boolean | null,
  selectedAnswer: number | null
) => {
  const { addXp, user } = useUser();

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswerCorrect !== null) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (currentQuestionIndex >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);
    
    // Just update correct answers (sound is handled in QuizQuestion component)
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 3000); // Keep the increased time to allow reading explanations
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      completeLessonAndAwardXp();
    }
  };

  const completeLessonAndAwardXp = async () => {
    setLessonCompleted(true);
    
    if (!lesson) return;
    
    const totalQuestions = questions.length;
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;
    let stars = 1;
    
    if (percentageCorrect >= 80) {
      stars = 3;
    } else if (percentageCorrect >= 60) {
      stars = 2;
    }
    
    const xpEarned = lesson.xp_reward * (stars / 3);
    addXp(Math.round(xpEarned));
    
    toast.success(`Lesson completed! You earned ${Math.round(xpEarned)} XP and ${stars} stars!`);
    
    try {
      if (!user) {
        console.log("User not authenticated, progress won't be saved to database");
        return;
      }
      
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          stars,
          xp_earned: Math.round(xpEarned)
        }, {
          onConflict: 'user_id, lesson_id'
        });
        
      if (error) throw error;
    } catch (error) {
      console.error("Error saving lesson progress:", error);
      toast.error("Failed to save your progress");
    }
  };

  return {
    handleAnswerSelect,
    checkAnswer,
    completeLessonAndAwardXp
  };
};
