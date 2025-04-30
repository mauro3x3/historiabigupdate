
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { HistoryLesson } from '@/types';
import EraLabel from './EraLabel';

interface LessonTableRowProps {
  lesson: HistoryLesson;
  isSelected: boolean;
  onSelect: (lessonId: string) => void;
}

const LessonTableRow: React.FC<LessonTableRowProps> = ({ lesson, isSelected, onSelect }) => {
  return (
    <TableRow className={isSelected ? "bg-muted" : ""}>
      <TableCell className="font-medium">{lesson.title}</TableCell>
      <TableCell><EraLabel era={lesson.era} /></TableCell>
      <TableCell>{lesson.xp_reward}</TableCell>
      <TableCell>{lesson.duration} min</TableCell>
      <TableCell className="text-right">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm"
          onClick={() => onSelect(lesson.id)}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default LessonTableRow;
