import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { HistoryEra, LearningTrackLevel, HistoryLesson } from '@/types';
import { generateTrackForEra } from '@/data/tracks/generateTrack';
import { getLessonProgress } from '@/services/progressService';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const { user, preferredEra } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [currentEra, setCurrentEra] = useState<HistoryEra | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        let era = preferredEra as HistoryEra;
        
        // If no preferred era, try to get one from the database
        if (!era && user) {
          try {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('preferred_era')
              .eq('id', user.id)
              .single();
              
            if (profileData?.preferred_era) {
              era = profileData.preferred_era as HistoryEra;
            }
          } catch (error) {
            console.error('Error fetching preferred era:', error);
          }
        }
        
        // If still no era, use a default
        if (!era) {
          era = 'ancient-egypt';
        }
        
        setCurrentEra(era);
        
        // Fetch the track data
        const track = await generateTrackForEra(era);
        console.log('generateTrackForEra result:', track);
        
        // If user is logged in, fetch progress data
        if (user) {
          const progressMap = await getLessonProgress(user.id);
          console.log('User lesson progress map:', progressMap);

          // Sequential unlock logic: set status for each lesson
          let foundFirstIncomplete = false;
          const levelsWithProgress = track.levels.map(level => {
            let lessonsWithProgress = level.lessons.map(lesson => {
              let status = 'locked';
              if (progressMap[String(lesson.id)]?.completed) {
                status = 'completed';
              } else if (!foundFirstIncomplete) {
                status = 'current';
                foundFirstIncomplete = true;
              }
              return {
                ...lesson,
                progress: progressMap[String(lesson.id)] || {
                  completed: false,
                  stars: 0,
                  xp_earned: 0
                },
                isUnlocked: status !== 'locked',
                status // <-- for JourneyPath/LearningPath
              };
            });
            return {
              ...level,
              lessons: lessonsWithProgress,
              isUnlocked: lessonsWithProgress.some(l => l.status !== 'locked')
            };
          });

          setLearningTrack(levelsWithProgress);
        } else {
          setLearningTrack(track.levels);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, preferredEra]);
  
  return {
    currentEra,
    learningTrack,
    isLoading
  };
};
