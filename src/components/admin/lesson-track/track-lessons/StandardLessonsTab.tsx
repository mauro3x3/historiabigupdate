
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import StandardLessonButton from './StandardLessonButton';

interface StandardLessonsTabProps {
  isAddingLesson: boolean;
  setIsAddingLesson: React.Dispatch<React.SetStateAction<boolean>>;
  era: string;
  levelNumber: number;
  levelName: string;
  onLessonAdded: () => void;
  renderStandardLessonForm: () => React.ReactNode;
}

const StandardLessonsTab = ({
  isAddingLesson,
  setIsAddingLesson,
  era,
  levelNumber,
  levelName,
  onLessonAdded,
  renderStandardLessonForm
}: StandardLessonsTabProps) => {
  const safeEra = era || 'ancient-egypt';
  const safeLevelNumber = levelNumber || 1;
  const safeLevelName = levelName || 'Level';
  
  return (
    <TabsContent value="standard" className="mt-2">
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Supplementary Learning Content</h3>
              <p className="text-xs text-blue-700 mt-1">
                Create standard lessons that supplement the main learning journey. 
                These appear in "All Lessons" and serve as refreshers or quick knowledge checks.
              </p>
            </div>
          </div>
          
          <StandardLessonButton
            isAddingLesson={isAddingLesson}
            setIsAddingLesson={setIsAddingLesson}
            era={safeEra}
            levelNumber={safeLevelNumber}
            levelName={safeLevelName}
            onLessonAdded={onLessonAdded}
            renderStandardLessonForm={renderStandardLessonForm}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StandardLessonsTab;
