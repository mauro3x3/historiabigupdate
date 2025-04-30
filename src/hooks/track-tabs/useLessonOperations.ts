
import { HistoryLesson } from '@/types';
import { toast } from 'sonner';

export const useLessonOperations = (
  trackLessons: HistoryLesson[],
  setTrackLessons: React.Dispatch<React.SetStateAction<HistoryLesson[]>>,
  selectedLevel: number
) => {
  const addLessonToTrack = (lesson: HistoryLesson) => {
    if (trackLessons.some(l => l.id === lesson.id)) {
      toast.error("This lesson is already in this level");
      return null;
    }
    
    // Create a copy of the lesson to avoid modifying the original
    const lessonCopy = { 
      ...lesson,
      level: selectedLevel,
      position: trackLessons.length + 1
    };
    
    // Return the modified lesson
    return lessonCopy;
  };
  
  const removeLessonFromTrack = (lessonId: string) => {
    const lessonToRemove = trackLessons.find(l => l.id === lessonId);
    if (!lessonToRemove) return null;
    
    const updatedLesson = { 
      ...lessonToRemove,
      level: undefined, 
      position: undefined 
    };
    
    return updatedLesson;
  };

  return {
    addLessonToTrack,
    removeLessonFromTrack
  };
};
