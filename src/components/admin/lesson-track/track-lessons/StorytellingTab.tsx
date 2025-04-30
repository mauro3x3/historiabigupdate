
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import StorytellingLessonButton from './StorytellingLessonButton';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface StorytellingTabProps {
  isAddingLesson: boolean;
  setIsAddingLesson: React.Dispatch<React.SetStateAction<boolean>>;
  levelName: string;
  renderStorytellingForm: () => React.ReactNode;
}

const StorytellingTab = ({ 
  isAddingLesson, 
  setIsAddingLesson, 
  levelName, 
  renderStorytellingForm 
}: StorytellingTabProps) => {
  const safeLevelName = levelName || 'Level';

  return (
    <TabsContent value="storytelling" className="mt-2">
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="p-2 rounded-full bg-purple-100">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-900">Main Learning Journey Content</h3>
              <p className="text-xs text-purple-700 mt-1">
                Create immersive storytelling lessons that form the core of your learning track.
                These narrative-based lessons build real knowledge step by step and provide depth.
              </p>
            </div>
          </div>
          
          <StorytellingLessonButton
            isAddingLesson={isAddingLesson}
            setIsAddingLesson={setIsAddingLesson}
            levelName={safeLevelName}
            renderStorytellingForm={renderStorytellingForm}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StorytellingTab;
