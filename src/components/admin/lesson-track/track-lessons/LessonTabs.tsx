
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, Info, ArrowRight } from 'lucide-react';
import StandardLessonButton from './StandardLessonButton';
import StorytellingLessonButton from './StorytellingLessonButton';
import NoLessonsState from './NoLessonsState';
import { HistoryLesson } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LessonTabsProps {
  trackLessons: HistoryLesson[];
  levelName: string;
  levelNumber: number;
  era: string;
  onLessonAdded: () => void;
  renderStandardLessonForm: () => React.ReactNode;
  renderStorytellingForm: () => React.ReactNode;
  isAddingStandardLesson: boolean;
  setIsAddingStandardLesson: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingStorytellingLesson: boolean;
  setIsAddingStorytellingLesson: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonTabs = ({
  trackLessons,
  levelName,
  levelNumber,
  era,
  onLessonAdded,
  renderStandardLessonForm,
  renderStorytellingForm,
  isAddingStandardLesson,
  setIsAddingStandardLesson,
  isAddingStorytellingLesson,
  setIsAddingStorytellingLesson
}: LessonTabsProps) => {
  const safeTrackLessons = Array.isArray(trackLessons) ? trackLessons : [];
  const safeLevelName = levelName || 'Level';
  const safeLevelNumber = levelNumber || 1;
  const safeEra = era || 'ancient-egypt';
  
  return (
    <Card className="p-4 mt-4 border-purple-200 bg-purple-50/30 hover:bg-purple-50/50 transition-colors">
      {safeTrackLessons.length === 0 && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="flex items-center">
            <span className="font-medium mr-2">Instructions:</span>
            <ArrowRight className="mx-2 h-4 w-4" />
            <span>Use the options below to add content to <strong>{safeLevelName}</strong></span>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3">Add Content to <span className="text-purple-700 font-semibold">{safeLevelName}</span></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Learning Journey Card */}
          <Card className="border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-2 rounded-full bg-purple-100">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-900">Main Learning Journey</h3>
                  <p className="text-xs text-purple-700 mt-1">
                    Create immersive storytelling lessons that form the core curriculum of your learning track.
                  </p>
                </div>
              </div>
              
              <StorytellingLessonButton
                isAddingLesson={isAddingStorytellingLesson}
                setIsAddingLesson={setIsAddingStorytellingLesson}
                levelName={safeLevelName}
                renderStorytellingForm={renderStorytellingForm}
              />
            </CardContent>
          </Card>
          
          {/* Supplementary Content Card */}
          <Card className="border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Supplementary Content</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Create standard lessons that supplement the main learning journey with additional knowledge.
                  </p>
                </div>
              </div>
              
              <StandardLessonButton
                isAddingLesson={isAddingStandardLesson}
                setIsAddingLesson={setIsAddingStandardLesson}
                era={safeEra}
                levelNumber={safeLevelNumber}
                levelName={safeLevelName}
                onLessonAdded={onLessonAdded}
                renderStandardLessonForm={renderStandardLessonForm}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default LessonTabs;
