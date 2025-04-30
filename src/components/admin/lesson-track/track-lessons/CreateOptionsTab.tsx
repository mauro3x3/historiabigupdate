
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BulkLessonCreator from '../BulkLessonCreator';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { HistoryEra } from '@/types';

interface CreateOptionsTabProps {
  isAddingLesson: boolean;
  setIsAddingLesson: (value: boolean) => void;
  era: HistoryEra;
  levelNumber: number;
  levelName: string;
  onLessonAdded: () => void;
  renderStandardLessonForm: () => React.ReactNode;
}

const CreateOptionsTab = ({
  isAddingLesson, 
  setIsAddingLesson, 
  era, 
  levelNumber,
  levelName,
  onLessonAdded,
  renderStandardLessonForm
}: CreateOptionsTabProps) => {
  return (
    <div className="space-y-2">
      <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full flex items-center"
            onClick={() => setIsAddingLesson(true)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Create Standard Lesson
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Lesson to {levelName}</DialogTitle>
          </DialogHeader>
          {renderStandardLessonForm()}
        </DialogContent>
      </Dialog>
      
      <BulkLessonCreator
        era={era}
        levelNumber={levelNumber}
        levelName={levelName}
        onLessonsAdded={onLessonAdded}
      />
    </div>
  );
};

export default CreateOptionsTab;
