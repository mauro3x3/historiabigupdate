
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { BookOpen, Plus, Route } from 'lucide-react';

interface StorytellingLessonButtonProps {
  isAddingLesson: boolean;
  setIsAddingLesson: React.Dispatch<React.SetStateAction<boolean>>;
  levelName: string;
  renderStorytellingForm: () => React.ReactNode;
}

const StorytellingLessonButton = ({
  isAddingLesson,
  setIsAddingLesson,
  levelName,
  renderStorytellingForm
}: StorytellingLessonButtonProps) => {
  const safeLevelName = levelName || 'Level';

  return (
    <>
      <Button 
        size="lg"
        className="w-full flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-all p-6"
        onClick={() => setIsAddingLesson(true)}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <BookOpen className="h-5 w-5" />
            <Route className="h-5 w-5" />
          </div>
          <span className="font-medium">Create Main Learning Journey</span>
          <span className="text-xs text-purple-100">Add an immersive storytelling lesson to {safeLevelName}</span>
          <div className="mt-1 text-xxs bg-purple-800 text-white px-2 py-0.5 rounded-full">
            Primary Learning Content
          </div>
        </div>
      </Button>

      <Sheet open={isAddingLesson} onOpenChange={setIsAddingLesson}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Learning Journey for {safeLevelName}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {renderStorytellingForm()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StorytellingLessonButton;
