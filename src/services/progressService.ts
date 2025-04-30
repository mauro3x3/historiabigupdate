
import { supabase } from '@/integrations/supabase/client';
import { LessonProgress } from '@/types';

export const getLessonProgress = async (userId: string): Promise<Record<string, LessonProgress>> => {
  try {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching lesson progress:', error);
      throw error;
    }
    
    // Transform the data into a map of lessonId -> progress
    const progressMap: Record<string, LessonProgress> = {};
    
    data?.forEach(entry => {
      progressMap[entry.lesson_id] = {
        completed: entry.completed,
        stars: entry.stars,
        xp_earned: entry.xp_earned || 0,
        timestamp: entry.updated_at,
      };
    });
    
    return progressMap;
  } catch (error) {
    console.error('Error in getLessonProgress:', error);
    return {};
  }
};
