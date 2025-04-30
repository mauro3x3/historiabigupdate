
import React, { useState } from 'react';
import { HistoryLesson } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

// Import our components
import {
  TrackLessonTable,
  LessonHeader,
} from './track-lessons';

// Import the new component
import LessonFormContent from './track-lessons/LessonFormContent';
import LessonTabs from './track-lessons/LessonTabs';

interface TrackLessonsListProps {
  trackLessons: HistoryLesson[];
  levelName: string;
  levelNumber: number;
  era: string;
  onDragEnd: (result: any) => void;
  onRemoveLesson: (lessonId: string) => void;
  onLessonAdded: () => void;
}

const TrackLessonsList = ({ 
  trackLessons, 
  levelName, 
  levelNumber,
  era,
  onDragEnd, 
  onRemoveLesson,
  onLessonAdded
}: TrackLessonsListProps) => {
  const safeTrackLessons = Array.isArray(trackLessons) ? trackLessons : [];
  const [isAddingStandardLesson, setIsAddingStandardLesson] = useState(false);
  const [isAddingStorytellingLesson, setIsAddingStorytellingLesson] = useState(false);
  
  // Get form rendering functions from the LessonFormContent component
  const formContent = LessonFormContent({
    levelName: levelName || 'Level',
    levelNumber: levelNumber || 1,
    era: era || 'ancient-egypt',
    trackLessons: safeTrackLessons,
    onLessonAdded
  });

  return (
    <div className="flex flex-col h-full">
      <LessonHeader levelName={levelName || 'Level'} trackLessons={safeTrackLessons} />
      
      <Card className="mb-4 border-gray-200">
        <CardContent className="p-4">
          {safeTrackLessons.length > 0 ? (
            <TrackLessonTable 
              trackLessons={safeTrackLessons} 
              onDragEnd={onDragEnd} 
              onRemoveLesson={onRemoveLesson} 
            />
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No content added yet to this level.</p>
              <p className="text-sm mt-2">Use the buttons below to add content.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <LessonTabs 
        trackLessons={safeTrackLessons}
        levelName={levelName || 'Level'}
        levelNumber={levelNumber || 1}
        era={era || 'ancient-egypt'}
        onLessonAdded={onLessonAdded}
        renderStandardLessonForm={formContent.renderStandardLessonForm}
        renderStorytellingForm={formContent.renderStorytellingForm}
        isAddingStandardLesson={isAddingStandardLesson}
        setIsAddingStandardLesson={setIsAddingStandardLesson}
        isAddingStorytellingLesson={isAddingStorytellingLesson}
        setIsAddingStorytellingLesson={setIsAddingStorytellingLesson}
      />
    </div>
  );
};

export default TrackLessonsList;
