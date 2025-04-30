
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FileText, Plus } from 'lucide-react';

interface StandardLessonButtonProps {
  isAddingLesson: boolean;
  setIsAddingLesson: React.Dispatch<React.SetStateAction<boolean>>;
  era: string;
  levelNumber: number;
  levelName: string;
  onLessonAdded: () => void;
  renderStandardLessonForm: () => React.ReactNode;
}

const StandardLessonButton = ({
  isAddingLesson,
  setIsAddingLesson,
  era,
  levelNumber,
  levelName,
  onLessonAdded,
  renderStandardLessonForm
}: StandardLessonButtonProps) => {
  const safeEra = era || 'ancient-egypt';
  const safeLevelNumber = levelNumber || 1;
  const safeLevelName = levelName || 'Level';

  return (
    <>
      <Button
        size="lg"
        className="w-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-all p-6"
        onClick={() => setIsAddingLesson(true)}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-medium">Create Side Learning Lesson</span>
          <span className="text-xs text-blue-100">Add supplementary content to {safeLevelName}</span>
        </div>
      </Button>

      <Sheet open={isAddingLesson} onOpenChange={setIsAddingLesson}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Side Learning for {safeLevelName}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {renderStandardLessonForm()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StandardLessonButton;
