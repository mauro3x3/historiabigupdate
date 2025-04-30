
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HistoryEra, HistoryLesson } from '@/types';
import { DbLesson, LevelInfo } from './types';

export const useFetchTrackData = (era: HistoryEra) => {
  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useState<HistoryLesson[]>([]);
  const [availableLevels, setAvailableLevels] = useState<LevelInfo[]>([
    {id: '1', name: 'Level 1'},
    {id: '2', name: 'Level 2'},
    {id: '3', name: 'Level 3'}
  ]);

  const fetchLevelsAndLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: trackConfig, error: trackError } = await supabase
        .from('learning_tracks')
        .select('*')
        .eq('era', era)
        .maybeSingle();
        
      if (trackConfig && !trackError) {
        const levels: LevelInfo[] = [];
        
        if (trackConfig.level_one_name) {
          levels.push({id: '1', name: trackConfig.level_one_name});
        }
        if (trackConfig.level_two_name) {
          levels.push({id: '2', name: trackConfig.level_two_name});
        }
        if (trackConfig.level_three_name) {
          levels.push({id: '3', name: trackConfig.level_three_name});
        }
        
        const additionalLevelsData = trackConfig.levels ? 
          (typeof trackConfig.levels === 'string' ? 
            JSON.parse(trackConfig.levels) : trackConfig.levels) : [];
        
        if (Array.isArray(additionalLevelsData)) {
          const additionalLevels = additionalLevelsData.slice(levels.length);
          additionalLevels.forEach((level, index) => {
            const levelId = String(levels.length + 1);
            levels.push({
              id: levelId,
              name: level.name || `Level ${levelId}`
            });
          });
        }
        
        if (levels.length > 0) {
          setAvailableLevels(levels);
        } else {
          setAvailableLevels([
            {id: '1', name: 'Level 1'},
            {id: '2', name: 'Level 2'},
            {id: '3', name: 'Level 3'}
          ]);
        }
      }
      
      // Log the query for debugging
      console.log(`Fetching lessons for era: ${era}`);
      
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('era', era)
        .order('title');
        
      if (lessonError) {
        console.error("Error fetching lessons:", lessonError);
        throw lessonError;
      }
      
      if (lessonData) {
        // Log the data for debugging
        console.log(`Found ${lessonData.length} lessons for era ${era}:`, lessonData);
        
        const typedLessons = lessonData.map((lesson: DbLesson) => ({
          id: String(lesson.id),
          title: lesson.title || '',
          description: lesson.description || '',
          era: lesson.era as HistoryEra || era,
          xp_reward: lesson.xp_reward || 50,
          duration: lesson.duration || 5,
          level: lesson.level,
          position: lesson.position,
          content: '', // Add the required content property
          lesson_type: lesson.lesson_type || 'standard',
          story_content: lesson.story_content || '',
          image_urls: lesson.image_urls || '',
          transition_question: lesson.transition_question || '',
          prompt: lesson.prompt || '',
          character: lesson.character || ''
        }));
        
        setLessons(typedLessons);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  }, [era]);

  return {
    isLoading,
    lessons,
    setLessons,
    availableLevels,
    fetchLevelsAndLessons
  };
};
