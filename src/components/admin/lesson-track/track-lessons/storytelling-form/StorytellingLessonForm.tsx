
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import StoryFormHeader from './StoryFormHeader';
import StoryContentFields from './StoryContentFields';
import StoryMetadataFields from './StoryMetadataFields';
import StoryFormActions from './StoryFormActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface StorytellingLessonFormProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const StorytellingLessonForm = ({ 
  form, 
  isSubmitting, 
  onSubmit,
  onCancel 
}: StorytellingLessonFormProps) => {
  // Early return if form is not available
  if (!form || !form.control || !form.handleSubmit) {
    console.error("StorytellingLessonForm: form object is invalid");
    return (
      <div className="p-4 text-center text-red-500">
        Error loading form. Please refresh the page and try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StoryFormHeader />
      
      <Alert className="bg-purple-50 border-purple-200">
        <InfoIcon className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          Storytelling lessons can be added to the main learning journey or kept as supplementary content.
          Use the toggle below to control where this lesson appears.
        </AlertDescription>
      </Alert>
      
      <StoryContentFields form={form} />
      <StoryMetadataFields form={form} />
      <StoryFormActions 
        isSubmitting={isSubmitting} 
        onSubmit={onSubmit}
        onCancel={onCancel} 
      />
    </div>
  );
};

export default StorytellingLessonForm;
