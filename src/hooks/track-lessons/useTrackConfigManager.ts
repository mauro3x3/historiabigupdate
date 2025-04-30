
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HistoryLesson } from '@/types';

export const useTrackConfigManager = (lessons: HistoryLesson[], setLessons: (lessons: HistoryLesson[]) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveTrackConfiguration = async () => {
    setIsSaving(true);
    try {
      const updatedLessons = lessons.filter(lesson => 
        lesson.level !== undefined || lesson.position !== undefined
      ).map(lesson => ({
        id: Number(lesson.id),
        level: lesson.level || null,
        position: lesson.position || null,
      }));
      
      if (updatedLessons.length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }
      
      for (let i = 0; i < updatedLessons.length; i += 100) {
        const batch = updatedLessons.slice(i, i + 100);
        const { error } = await supabase
          .from('lessons')
          .upsert(batch, { onConflict: 'id' });
          
        if (error) throw error;
      }
      
      toast.success("Track configuration saved successfully");
    } catch (error) {
      console.error("Error saving track configuration:", error);
      toast.error("Failed to save track configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const getLessonCountByLevel = () => {
    const counts: Record<string, number> = {};
    
    // Calculate lesson counts for each level
    lessons.forEach(lesson => {
      if (lesson.level !== undefined) {
        const levelId = String(lesson.level);
        counts[levelId] = (counts[levelId] || 0) + 1;
      }
    });
    
    return counts;
  };

  return {
    isSaving,
    saveTrackConfiguration,
    getLessonCountByLevel
  };
};
