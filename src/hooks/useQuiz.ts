import { useUser } from '@/contexts/UserContext';
import { HistoryLesson, QuizQuestion } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { dbService } from '@/services/dbService';
import { playCorrectAnswerSound } from '@/utils/soundUtils';
import { MuseumService } from '@/services/museumService';

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
  selectedAnswer: number | null,
  allLessonsOrdered?: HistoryLesson[]
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

    let isCorrect = false;
    if (typeof currentQuestion.correctAnswer === 'number' && currentQuestion.options[currentQuestion.correctAnswer] !== undefined) {
      // Old format: index
      isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
    } else if (currentQuestion.answer) {
      // New format: text, ultra-robust comparison
      const selectedOption = (currentQuestion.options[selectedAnswer ?? -1] || '').trim().toLowerCase();
      const correctAnswer = currentQuestion.answer.trim().toLowerCase();
      const stripPrefix = (str: string) => str.replace(/^[A-D]\.[ ]*/, '');
      const normalize = (str: string) => stripPrefix(str).replace(/[^a-z0-9]/gi, '');
      isCorrect = (normalize(selectedOption) === normalize(correctAnswer));
    }

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
    
    // Play success sound for lesson completion
    playCorrectAnswerSound();
    
    // Award random museum artifact (30% chance)
    if (Math.random() < 0.3) {
      const artifact = await MuseumService.awardRandomArtifact(user.id);
      if (artifact) {
        toast.success(`🏛️ New Museum Artifact Unlocked: ${artifact.name} (${artifact.rarity.toUpperCase()})!`, {
          duration: 5000,
        });
      }
    }
    
    try {
      if (!user) {
        console.log("User not authenticated, progress won't be saved to database");
        return;
      }
      
      // Mark current lesson as completed
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

      // --- Update user_journey_progress for module progression ---
      if ((lesson as any).journey_id && lesson.id) {
        // Mark current module as completed
        await dbService.userJourneyProgress.markCompleted(user.id, Number(lesson.id));
        // Unlock next module
        await dbService.userJourneyProgress.unlockNextModule(user.id, Number((lesson as any).journey_id), Number(lesson.id));
      }

      // --- Unlock all lessons at the next level ---
      if (allLessonsOrdered && Array.isArray(allLessonsOrdered)) {
        // Find the current lesson's level
        const currentLevel = lesson.level;
        if (typeof currentLevel !== 'undefined') {
          // Find the next level (the smallest level greater than currentLevel)
          const levels = allLessonsOrdered
            .map(l => l.level)
            .filter(lvl => typeof lvl === 'number') as number[];
          const uniqueSortedLevels = Array.from(new Set(levels)).sort((a, b) => a - b);
          const currentLevelIdx = uniqueSortedLevels.indexOf(currentLevel);
          if (currentLevelIdx !== -1 && currentLevelIdx < uniqueSortedLevels.length - 1) {
            const nextLevel = uniqueSortedLevels[currentLevelIdx + 1];
            // Find all lessons at the next level
            const nextLevelLessons = allLessonsOrdered.filter(l => l.level === nextLevel);
            for (const nextLesson of nextLevelLessons) {
              await supabase.from('user_lesson_progress').upsert({
                user_id: user.id,
                lesson_id: nextLesson.id,
                completed: false,
                stars: 0,
                xp_earned: 0
              }, {
                onConflict: 'user_id, lesson_id'
              });
            }
          }
        }
      }
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
