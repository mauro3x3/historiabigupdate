
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStandardLessonFormLogic = (
  era: string, 
  levelNumber: number, 
  trackLessonsLength: number,
  onLessonAdded?: () => void
) => {
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('5');
  const [newLessonXp, setNewLessonXp] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a parameter-less wrapper function
  const handleAddNewLesson = async () => {
    if (!newLessonTitle) {
      toast.error("Please provide a lesson title");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a numeric ID based on timestamp
      const supabaseId = Date.now();
      
      const { error } = await supabase
        .from('lessons')
        .insert({
          id: supabaseId,
          title: newLessonTitle,
          description: newLessonDescription,
          era: era,
          xp_reward: parseInt(newLessonXp) || 50,
          duration: parseInt(newLessonDuration) || 5,
          level: levelNumber,
          position: trackLessonsLength + 1,
          content: newLessonDescription,
          lesson_type: 'standard',
          is_journey_content: false // Standard lessons are side content by default
        });
      
      if (error) {
        console.error("Error inserting lesson:", error);
        throw error;
      }
      
      // Success!
      toast.success("New side learning lesson added successfully!");
      
      // Reset form
      setNewLessonTitle('');
      setNewLessonDescription('');
      setNewLessonDuration('5');
      setNewLessonXp('50');
      
      // Notify parent to refresh lessons
      if (onLessonAdded) onLessonAdded();
    } catch (error) {
      toast.error("Failed to create side learning lesson");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    newLessonTitle,
    setNewLessonTitle,
    newLessonDescription,
    setNewLessonDescription,
    newLessonDuration,
    setNewLessonDuration,
    newLessonXp,
    setNewLessonXp,
    isSubmitting,
    handleAddNewLesson
  };
};
