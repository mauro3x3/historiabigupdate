
import { useState, useEffect, useCallback } from 'react';
import { HistoryLesson } from '@/types';
import { toast } from 'sonner';

export const useTrackTabContent = (
  lessons: HistoryLesson[] | null | undefined,
  selectedLevel: number
) => {
  const [trackLessons, setTrackLessons] = useState<HistoryLesson[]>([]);

  const updateTrackLessons = useCallback(() => {
    // Ensure we have valid data
    if (!lessons || !Array.isArray(lessons)) {
      setTrackLessons([]);
      console.log("No lessons available or invalid lessons data");
      return;
    }
    
    const safeSelectedLevel = selectedLevel || 1;
    
    try {
      const filtered = lessons.filter(lesson => lesson && lesson.level === safeSelectedLevel);
      const sorted = [...filtered].sort((a, b) => {
        const posA = a.position || 999;
        const posB = b.position || 999;
        return posA - posB;
      });
      setTrackLessons(sorted);
    } catch (error) {
      console.error("Error updating track lessons:", error);
      setTrackLessons([]);
    }
  }, [lessons, selectedLevel]);

  useEffect(() => {
    updateTrackLessons();
  }, [updateTrackLessons]);

  const handleDragEnd = (result: any) => {
    if (!result || !result.destination || !trackLessons || !Array.isArray(trackLessons)) {
      console.log("Invalid drag result or track lessons");
      return;
    }
    
    try {
      const items = Array.from(trackLessons);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      const updatedItems = items.map((item, index) => ({
        ...item,
        position: index + 1
      }));
      
      setTrackLessons(updatedItems);
    } catch (error) {
      console.error("Error handling drag end:", error);
      toast.error("Failed to reorder lessons");
    }
  };
  
  const addLessonToTrack = (lesson: HistoryLesson) => {
    if (!lesson || !lessons || !Array.isArray(lessons)) {
      console.error("Invalid lesson or lessons array");
      return lessons || [];
    }
    
    const safeSelectedLevel = selectedLevel || 1;
    const safeTrackLessons = trackLessons || [];
    
    if (safeTrackLessons.some(l => l.id === lesson.id)) {
      toast.error("This lesson is already in this level");
      return lessons;
    }
    
    try {
      const updatedLesson = {
        ...lesson,
        level: safeSelectedLevel,
        position: safeTrackLessons.length + 1
      };
      
      const updatedLessons = lessons.map(l => 
        l.id === lesson.id ? updatedLesson : l
      );
      
      toast.success(`Added "${lesson.title}" to Level ${safeSelectedLevel}`);
      return updatedLessons;
    } catch (error) {
      console.error("Error adding lesson to track:", error);
      toast.error("Failed to add lesson to track");
      return lessons;
    }
  };
  
  const removeLessonFromTrack = (lessonId: string) => {
    if (!lessonId || !lessons || !Array.isArray(lessons)) {
      console.error("Invalid lessonId or lessons array");
      return lessons || [];
    }
    
    const safeSelectedLevel = selectedLevel || 1;
    const safeTrackLessons = trackLessons || [];
    
    try {
      const lessonToRemove = safeTrackLessons.find(l => l.id === lessonId);
      
      const updatedLessons = lessons.map(l => 
        l.id === lessonId 
          ? { ...l, level: undefined, position: undefined } 
          : l
      );
      
      if (lessonToRemove) {
        toast.success(`Removed "${lessonToRemove.title}" from Level ${safeSelectedLevel}`);
      }
      
      return updatedLessons;
    } catch (error) {
      console.error("Error removing lesson from track:", error);
      toast.error("Failed to remove lesson from track");
      return lessons;
    }
  };
  
  const refreshLessons = () => {
    updateTrackLessons();
  };

  return {
    trackLessons,
    handleDragEnd,
    addLessonToTrack,
    removeLessonFromTrack,
    refreshLessons
  };
};
