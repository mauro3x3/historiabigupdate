
import React from 'react';
import { Form } from '@/components/ui/form';
import { 
  LessonType, 
  LessonTypeSelector, 
  LessonContentFields, 
  LessonMetadataFields,
  LessonBasicFields, 
  LessonFormSubmit
} from './lesson-form';
import { useLessonForm } from '@/hooks/useLessonForm';

interface AdminLessonFormProps {
  onSuccess: (lessonId: string) => void;
  existingLesson?: any;
}

const AdminLessonForm = ({ onSuccess, existingLesson }: AdminLessonFormProps) => {
  const {
    form,
    lessonType,
    setLessonType,
    isSubmitting,
    onSubmit
  } = useLessonForm({ onSuccess, existingLesson });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Lesson Type Selector */}
        <LessonTypeSelector value={lessonType} onValueChange={setLessonType} />
        
        {/* Title field */}
        <LessonBasicFields form={form} />
        
        {/* Content fields based on lesson type */}
        <LessonContentFields form={form} lessonType={lessonType} />
        
        {/* Common metadata fields */}
        <LessonMetadataFields form={form} />
        
        <LessonFormSubmit 
          isSubmitting={isSubmitting} 
          isEditing={!!existingLesson} 
        />
      </form>
    </Form>
  );
};

export default AdminLessonForm;
