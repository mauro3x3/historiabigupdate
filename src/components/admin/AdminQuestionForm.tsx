
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { QuestionOptions, QuestionFormFields, QuestionFormSubmit } from '@/components/admin/lesson-form';
import { supabase } from '@/integrations/supabase/client';

interface AdminQuestionFormProps {
  lessonId: string;
  onSuccess: () => void;
  existingQuestion?: any;
}

const AdminQuestionForm = ({ lessonId, onSuccess, existingQuestion }: AdminQuestionFormProps) => {
  const [options, setOptions] = useState<string[]>(
    existingQuestion?.options || ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    existingQuestion?.correct_answer || 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: existingQuestion || {
      question: '',
      explanation: '',
    }
  });
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };
  
  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      // Adjust correctAnswer if needed
      if (correctAnswer >= index && correctAnswer > 0) {
        setCorrectAnswer(correctAnswer - 1);
      }
    }
  };
  
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Filter out empty options
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      
      // Ensure we have at least 2 options
      if (filteredOptions.length < 2) {
        form.setError('question', {
          type: 'manual',
          message: 'You need at least 2 non-empty options'
        });
        setIsSubmitting(false);
        return;
      }
      
      const questionData = {
        lesson_id: lessonId,
        question: data.question,
        options: filteredOptions,
        correct_answer: correctAnswer,
        explanation: data.explanation || null
      };
      
      // Save to Supabase
      try {
        if (existingQuestion?.id) {
          await supabase
            .from('lesson_questions')
            .update(questionData)
            .eq('id', existingQuestion.id);
        } else {
          await supabase
            .from('lesson_questions')
            .insert(questionData);
        }
      } catch (error) {
        console.error("Error saving question to database:", error);
        throw error;
      }
      
      onSuccess();
      
      // Reset form for new questions
      if (!existingQuestion) {
        form.reset({
          question: '',
          explanation: '',
        });
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
      }
    } catch (error) {
      console.error("Error saving question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <QuestionFormFields form={form} />
        
        <QuestionOptions 
          options={options}
          correctAnswer={correctAnswer}
          onCorrectAnswerChange={setCorrectAnswer}
          onOptionChange={handleOptionChange}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
        />
        
        <QuestionFormSubmit 
          isSubmitting={isSubmitting} 
          isEditing={!!existingQuestion} 
        />
      </form>
    </Form>
  );
};

export default AdminQuestionForm;
