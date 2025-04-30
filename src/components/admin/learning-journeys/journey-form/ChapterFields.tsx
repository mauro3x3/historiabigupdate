
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';

interface ChapterFieldsProps {
  chapterNames: string[];
  onChapterChange: (index: number, value: string) => void;
}

const ChapterFields = ({ chapterNames, onChapterChange }: ChapterFieldsProps) => {
  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <h3 className="text-sm font-medium flex items-center">
        <BookOpen className="mr-2 h-4 w-4" />
        Chapters Structure
      </h3>
      
      <div>
        <Label htmlFor="chapter_one">Chapter 1 Name</Label>
        <Input
          id="chapter_one"
          placeholder="e.g. The Rise of Islam"
          value={chapterNames[0]}
          onChange={(e) => onChapterChange(0, e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="chapter_two">Chapter 2 Name</Label>
        <Input
          id="chapter_two"
          placeholder="e.g. The Golden Age"
          value={chapterNames[1]}
          onChange={(e) => onChapterChange(1, e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="chapter_three">Chapter 3 Name</Label>
        <Input
          id="chapter_three"
          placeholder="e.g. The Ottoman Empire"
          value={chapterNames[2]}
          onChange={(e) => onChapterChange(2, e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChapterFields;
