import { useState, useEffect } from 'react';
import { HistoryLesson, QuizQuestion, HistoryEra } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { lessons } from '@/data/historyData';

export const useLesson = (lessonId: string | undefined, navigate: (path: string) => void) => {
  const [lesson, setLesson] = useState<HistoryLesson | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      setLoading(true);
      let foundLesson = null;
      try {
        // Always fetch from modules
        const moduleResponse = await supabase
          .from('modules')
          .select('*')
          .eq('id', Number(lessonId))
          .maybeSingle();
        const moduleData = moduleResponse.data;
        const moduleError = moduleResponse.error;
        if (moduleError) {
          console.error("Error fetching module as lesson:", moduleError);
        }
        if (moduleData) {
          // Fetch module_content for this module
          let story_content = '';
          let image_urls = '';
          try {
            const contentResponse = await supabase
              .from('module_content')
              .select('*')
              .eq('module_id', moduleData.id)
              .maybeSingle();
            const contentData = contentResponse.data;
            if (contentData) {
              story_content = contentData.story_text || '';
              image_urls = Array.isArray(contentData.image_urls) ? contentData.image_urls.join(',') : (contentData.image_urls || '');
            }
          } catch (err) {
            console.error('Error fetching module_content:', err);
          }
          // Fallback: if story_content is still empty, use moduleData.story_content if available
          if (!story_content && moduleData.story_content) {
            story_content = moduleData.story_content;
          }
          // Fallback: if image_urls is still empty, use moduleData.image_url if available
          if (!image_urls && moduleData.image_url) {
            image_urls = moduleData.image_url;
          }
          foundLesson = {
            id: String(moduleData.id),
            title: moduleData.title || '',
            description: moduleData.description || '',
            content: '',
            era: moduleData.era || 'jewish',
            xp_reward: moduleData.xp_reward || 50,
            duration: moduleData.duration || 5,
            level: moduleData.level || 1,
            position: moduleData.position,
            lesson_type: moduleData.content_type || 'standard',
            prompt: '',
            character: '',
            story_content,
            transition_question: '', // default value
            image_urls,
            journey_id: moduleData.journey_id
          };
        }
      } catch (error) {
        console.error("Error fetching lesson/module from database:", error);
      }
      if (!foundLesson) {
        toast.error("Lesson not found");
        navigate('/dashboard');
        return;
      }
      setLesson(foundLesson);
      // Fetch quiz questions for this lesson
      try {
        let questionData = [];
        let questionError = null;
        // For modules, fetch from questions table
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('module_id', foundLesson.id);
        questionData = data || [];
        questionError = error;
        if (questionError) {
          console.error("Error fetching questions:", questionError);
        }
        if (questionData && questionData.length > 0) {
          // Transform DB data to match our QuizQuestion interface
          const formattedQuestions: QuizQuestion[] = questionData.map(q => ({
            question: q.question,
            options: Array.isArray(q.options) ? q.options.map(opt => String(opt)) : [],
            correctAnswer: q.correct_answer,
            explanation: q.explanation || '',
            lesson_id: foundLesson.id
          }));
          setQuestions(formattedQuestions);
        } else {
          // If no questions found, create some dummy ones
          setQuestions([
            {
              question: 'What is the capital of Ancient Egypt?',
              options: ['Memphis', 'Thebes', 'Alexandria', 'Cairo'],
              correctAnswer: 0,
              explanation: 'Memphis was the ancient capital of Aneb-Hetch, the first nome of Lower Egypt.'
            },
            {
              question: 'Who built the Great Pyramid of Giza?',
              options: ['Tutankhamun', 'Khufu', 'Cleopatra', 'Ramesses II'],
              correctAnswer: 1,
              explanation: 'The Great Pyramid was built as a tomb for the pharaoh Khufu (also known as Cheops).'
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId, navigate]);

  return {
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
  };
};
