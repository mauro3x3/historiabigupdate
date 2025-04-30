
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpenIcon } from 'lucide-react';

interface ChapterSelectorProps {
  chapters: {
    id: number;
    title: string;
    description: string;
    journey_id: number;
    position: number;
  }[];
  selectedChapter: number | null;
  onChapterChange: (chapterId: number) => void;
  isLoading?: boolean;
}

const ChapterSelector = ({
  chapters,
  selectedChapter,
  onChapterChange,
  isLoading = false,
}: ChapterSelectorProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <BookOpenIcon className="mr-2 h-5 w-5 text-muted-foreground" />
          Select Chapter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-8 items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading chapters...</p>
          </div>
        ) : chapters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No chapters available for this journey.
          </p>
        ) : (
          <Select
            value={selectedChapter?.toString() || ''}
            onValueChange={(value) => onChapterChange(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id.toString()}>
                  {chapter.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterSelector;
