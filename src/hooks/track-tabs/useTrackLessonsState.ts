
import { useState, useEffect } from 'react';
import { HistoryLesson } from '@/types';

export const useTrackLessonsState = (
  lessons: HistoryLesson[], 
  selectedLevel: number
) => {
  const [trackLessons, setTrackLessons] = useState<HistoryLesson[]>([]);
  
  // Update track lessons when selected level or lessons change
  useEffect(() => {
    updateTrackLessons();
  }, [selectedLevel, lessons]);
  
  const updateTrackLessons = () => {
    const filtered = lessons.filter(lesson => lesson.level === selectedLevel);
    const sorted = [...filtered].sort((a, b) => {
      const posA = a.position || 999;
      const posB = b.position || 999;
      return posA - posB;
    });
    setTrackLessons(sorted);
  };

  return {
    trackLessons,
    setTrackLessons,
    updateTrackLessons
  };
};
