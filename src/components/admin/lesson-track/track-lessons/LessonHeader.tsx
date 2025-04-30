
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HistoryLesson } from '@/types';

interface LessonHeaderProps {
  levelName: string;
  trackLessons: HistoryLesson[];
}

const LessonHeader = ({ levelName, trackLessons }: LessonHeaderProps) => {
  return (
    <h3 className="font-medium mb-2 flex items-center gap-2">
      {levelName} Lessons 
      <Badge variant="outline" className="text-xs font-normal">
        {trackLessons.length} {trackLessons.length === 1 ? 'lesson' : 'lessons'}
      </Badge>
      <span className="text-xs text-gray-500">(Drag to Reorder)</span>
    </h3>
  );
};

export default LessonHeader;
