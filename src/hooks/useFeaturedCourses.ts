import { useState } from 'react';

interface FeaturedCourse {
  title: string;
  emoji: string;
}

export const useFeaturedCourses = (
  initialCourses: FeaturedCourse[],
  setCourses: React.Dispatch<React.SetStateAction<FeaturedCourse[]>>
) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(initialCourses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCourses(items);
  };

  return { handleDragEnd };
}; 