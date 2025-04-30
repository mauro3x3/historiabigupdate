
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Book, ListChecks, Video, Gamepad2 } from 'lucide-react';

export type LessonType = 'story' | 'quiz' | 'video' | 'game' | 'standard' | 'storytelling';

interface LessonTypeSelectorProps {
  value: LessonType;
  onValueChange: (value: LessonType) => void;
}

export const LessonTypeSelector: React.FC<LessonTypeSelectorProps> = ({ 
  value, 
  onValueChange 
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => val && onValueChange(val as LessonType)}
      className="justify-start"
      variant="outline"
    >
      <ToggleGroupItem value="story" aria-label="Storytelling lesson">
        <Book className="h-4 w-4 mr-2" />
        Story
      </ToggleGroupItem>
      <ToggleGroupItem value="storytelling" aria-label="Storytelling lesson">
        <Book className="h-4 w-4 mr-2" />
        Storytelling
      </ToggleGroupItem>
      <ToggleGroupItem value="standard" aria-label="Standard lesson">
        <Book className="h-4 w-4 mr-2" />
        Standard
      </ToggleGroupItem>
      <ToggleGroupItem value="quiz" aria-label="Quiz lesson">
        <ListChecks className="h-4 w-4 mr-2" />
        Quiz
      </ToggleGroupItem>
      <ToggleGroupItem value="video" aria-label="Video lesson">
        <Video className="h-4 w-4 mr-2" />
        Video
      </ToggleGroupItem>
      <ToggleGroupItem value="game" aria-label="Game lesson">
        <Gamepad2 className="h-4 w-4 mr-2" />
        Game
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
