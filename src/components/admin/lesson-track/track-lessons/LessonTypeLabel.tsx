
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, BookText, ScrollText } from 'lucide-react';

interface LessonTypeLabelProps {
  lessonType: string;
}

const LessonTypeLabel: React.FC<LessonTypeLabelProps> = ({ lessonType }) => {
  switch (lessonType) {
    case 'storytelling':
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
          <ScrollText className="h-3 w-3 mr-1" />
          <span className="text-xs">Learning Journey</span>
        </Badge>
      );
      
    case 'quiz':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
          <BookText className="h-3 w-3 mr-1" />
          <span className="text-xs">Quiz</span>
        </Badge>
      );
      
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
          <BookOpen className="h-3 w-3 mr-1" />
          <span className="text-xs">Side Learning</span>
        </Badge>
      );
  }
};

export default LessonTypeLabel;
