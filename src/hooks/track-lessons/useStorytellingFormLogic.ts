
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HistoryEra } from '@/types';

export const useStorytellingFormLogic = (
  era: string, 
  levelNumber: number, 
  trackLessonsLength: number,
  onLessonAdded?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ensure we have valid default values
  const safeEra = era || 'ancient-egypt';
  const safeLevelNumber = levelNumber || 1;
  const safeTrackLessonsLength = trackLessonsLength || 0;
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      story_content: '',
      image_urls: '',
      transition_question: 'Are you ready to test your knowledge?',
      xpReward: 50,
      duration: 5,
      era: safeEra,
      lesson_type: 'storytelling',
      is_journey_content: true // Default to true for storytelling lessons
    }
  });

  useEffect(() => {
    // Update era value when it changes
    form.setValue('era', safeEra);
  }, [safeEra, form]);

  // Modified to not require event parameter
  const onSubmit = async () => {
    const data = form.getValues();
    
    if (!data || !data.title) {
      toast.error("Please provide a lesson title");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a numeric ID based on timestamp
      const supabaseId = Date.now();
      
      // Prepare storytelling content
      const storyContent = data.story_content || '';
      const imageUrls = data.image_urls || '';
      
      console.log("Creating storytelling lesson with journey content:", data.is_journey_content);
      
      // Insert new storytelling lesson directly with level and position
      const { error } = await supabase
        .from('lessons')
        .insert({
          id: supabaseId,
          title: data.title,
          description: data.description || '',
          era: safeEra,
          xp_reward: data.xpReward || 50,
          duration: data.duration || 5,
          level: safeLevelNumber,
          position: safeTrackLessonsLength + 1,
          content: data.description || '',
          lesson_type: 'storytelling',
          story_content: storyContent,
          transition_question: data.transition_question || 'Are you ready to test your knowledge?',
          image_urls: imageUrls,
          is_journey_content: data.is_journey_content // Save the journey content flag
        });

      if (error) {
        console.error("Error creating storytelling lesson:", error);
        throw error;
      }

      // Adjust success message based on journey content setting
      const journeyStatus = data.is_journey_content ? 'Learning Journey' : 'Side Learning';
      toast.success(`New ${journeyStatus} lesson "${data.title}" added successfully`);
      
      // Reset form
      form.reset({
        title: '',
        description: '',
        story_content: '',
        image_urls: '',
        transition_question: 'Are you ready to test your knowledge?',
        xpReward: 50,
        duration: 5,
        era: safeEra,
        lesson_type: 'storytelling',
        is_journey_content: true
      });
      
      // Notify parent to refresh lessons
      if (onLessonAdded) onLessonAdded();
    } catch (error) {
      toast.error("Failed to create lesson");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
};
