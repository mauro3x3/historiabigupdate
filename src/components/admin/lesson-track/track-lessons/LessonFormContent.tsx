
import React from 'react';
import { useTrackLessonForms } from '@/hooks/track-lessons/useTrackLessonForms';
import { HistoryLesson } from '@/types';

interface LessonFormContentProps {
  levelName: string;
  levelNumber: number;
  era: string;
  trackLessons: HistoryLesson[];
  onLessonAdded: () => void;
}

const LessonFormContent = ({
  levelName,
  levelNumber,
  era,
  trackLessons,
  onLessonAdded
}: LessonFormContentProps) => {
  const safeTrackLessons = Array.isArray(trackLessons) ? trackLessons : [];
  
  const {
    renderStandardLessonForm,
    renderStorytellingForm
  } = useTrackLessonForms(
    levelNumber,  // Passing levelNumber as number
    levelName,    // Passing levelName
    era,          // Passing era
    onLessonAdded // Callback when a lesson is added
  );

  return {
    renderStandardLessonForm,
    renderStorytellingForm
  };
};

export default LessonFormContent;
