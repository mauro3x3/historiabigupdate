
import React from 'react';
import StandardLessonForm from '@/components/admin/lesson-track/track-lessons/StandardLessonForm';
import StorytellingLessonForm from '@/components/admin/lesson-track/track-lessons/storytelling-form/StorytellingLessonForm';
import { useStandardLessonFormLogic } from './useStandardLessonFormLogic';
import { useStorytellingFormLogic } from './useStorytellingFormLogic';

export const useTrackLessonForms = (
  levelNumber: number, 
  levelName: string, 
  era: string, 
  onLessonAdded: () => void
) => {
  // Standard lesson form logic
  const {
    newLessonTitle,
    setNewLessonTitle,
    newLessonDescription,
    setNewLessonDescription,
    newLessonDuration,
    setNewLessonDuration,
    newLessonXp,
    setNewLessonXp,
    isSubmitting: isStandardSubmitting,
    handleAddNewLesson
  } = useStandardLessonFormLogic(era, levelNumber, 0, onLessonAdded);

  // Storytelling lesson form logic
  const {
    form,
    isSubmitting: isStorySubmitting,
    onSubmit: handleStorySubmit
  } = useStorytellingFormLogic(era, levelNumber, 0, onLessonAdded);

  // Render the standard lesson form
  const renderStandardLessonForm = () => {
    return (
      <StandardLessonForm
        newLessonTitle={newLessonTitle}
        newLessonDescription={newLessonDescription}
        newLessonDuration={newLessonDuration}
        newLessonXp={newLessonXp}
        isSubmitting={isStandardSubmitting}
        onTitleChange={setNewLessonTitle}
        onDescriptionChange={setNewLessonDescription}
        onDurationChange={setNewLessonDuration}
        onXpChange={setNewLessonXp}
        onSubmit={handleAddNewLesson}
        onCancel={() => {}} // Empty function for cancel action
      />
    );
  };

  // Render the storytelling form
  const renderStorytellingForm = () => {
    return (
      <StorytellingLessonForm
        form={form}
        isSubmitting={isStorySubmitting}
        onSubmit={handleStorySubmit}
        onCancel={() => {}} // Empty function for cancel action
      />
    );
  };

  return {
    renderStandardLessonForm,
    renderStorytellingForm
  };
};
