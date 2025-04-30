
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { lessons } from '@/data/historyData';
import { HistoryEra } from '@/types';
import { LessonType } from '@/components/admin/lesson-form';

interface UseLessonFormProps {
  onSuccess: (lessonId: string) => void;
  existingLesson?: any;
}

export const useLessonForm = ({ onSuccess, existingLesson }: UseLessonFormProps) => {
  const [lessonType, setLessonType] = useState<LessonType>(existingLesson?.lesson_type || 'standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: existingLesson || {
      id: '',
      title: '',
      description: '',
      era: 'ancient-egypt' as HistoryEra,
      xpReward: 50,
      duration: 5,
      lesson_type: 'standard',
      prompt: '',
      character: '',
      is_journey_content: false 
    }
  });
  
  // Set default is_journey_content based on lesson type
  React.useEffect(() => {
    if (lessonType === 'storytelling') {
      form.setValue('is_journey_content', true);
    }
  }, [lessonType, form]);
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Generate a unique ID if it's a new lesson
      if (!data.id) {
        // Create format similar to existing IDs like 'ancient-egypt-3'
        const eraLessons = lessons.filter(l => l.era === data.era);
        const nextNumber = eraLessons.length + 1;
        data.id = `${data.era}-${nextNumber}`;
      }
      
      // Add lesson type to data
      data.lesson_type = lessonType;
      
      // Set is_journey_content to true for storytelling by default
      if (lessonType === 'storytelling' && data.is_journey_content === undefined) {
        data.is_journey_content = true;
      }
      
      // Update local lessons array for immediate UI feedback
      const lessonIndex = lessons.findIndex(l => l.id === data.id);
      if (lessonIndex >= 0) {
        lessons[lessonIndex] = { ...data };
      } else {
        lessons.push({ ...data });
      }
      
      // Save to Supabase
      try {
        // For Supabase, generate a numeric ID instead of the string format
        // This fixes the "invalid input syntax for type bigint" error
        let supabaseId: number;
        
        if (existingLesson && !isNaN(Number(existingLesson.id))) {
          // If editing an existing lesson with numeric ID, use that ID
          supabaseId = Number(existingLesson.id);
        } else {
          // For new lessons, generate a timestamp-based numeric ID
          supabaseId = Date.now();
        }
        
        // Check if lesson exists in DB by numeric id
        const { data: existingData, error: existingError } = await supabase
          .from('lessons')
          .select('id')
          .eq('id', supabaseId)
          .maybeSingle();
          
        if (existingError) {
          console.error("Error checking for existing lesson:", existingError);
          throw existingError;
        }
        
        // Prepare lesson data for database
        const lessonData = {
          title: data.title,
          description: data.description,
          era: data.era,
          xp_reward: data.xpReward,
          duration: data.duration,
          content: data.description, // Use description as content for now
          lesson_type: data.lesson_type,
          prompt: data.prompt,
          character: data.character,
          story_content: data.story_content,
          transition_question: data.transition_question,
          image_urls: data.image_urls,
          is_journey_content: data.is_journey_content
        };
          
        if (existingData) {
          // Update existing lesson
          const { error: updateError } = await supabase
            .from('lessons')
            .update(lessonData)
            .eq('id', supabaseId);
            
          if (updateError) {
            console.error("Error updating lesson:", updateError);
            throw updateError;
          }
        } else {
          // Insert new lesson with numeric ID
          const { error: insertError } = await supabase
            .from('lessons')
            .insert({
              id: supabaseId, // Use numeric ID for Supabase
              ...lessonData
            });
            
          if (insertError) {
            console.error("Error inserting lesson:", insertError);
            throw insertError;
          }
        }
        
        toast.success("Lesson saved successfully to database");
      } catch (error: any) {
        console.warn("Couldn't save lesson to database:", error);
        
        if (error.code === '42501') {
          // This is a Row Level Security policy violation
          toast.error("Permission denied: You may not have the right permissions to save lessons to the database");
          toast.info("The lesson is available locally but not saved to the database");
        } else {
          toast.error("Error saving to database, but lesson is available locally");
        }
      }
      
      onSuccess(data.id);
      
      // Reset form if it's a new lesson
      if (!existingLesson) {
        form.reset({
          id: '',
          title: '',
          description: '',
          era: 'ancient-egypt' as HistoryEra,
          xpReward: 50,
          duration: 5,
          lesson_type: 'standard',
          prompt: '',
          character: '',
          is_journey_content: false
        });
        setLessonType('standard');
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Failed to save lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    lessonType,
    setLessonType,
    isSubmitting,
    onSubmit
  };
};
