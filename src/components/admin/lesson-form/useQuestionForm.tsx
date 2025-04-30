
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { dbService } from '@/services/dbService';
import { toast } from 'sonner';

export const useQuestionForm = (moduleId: number, onSaved: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(3); // Default to the last option (D)
  
  const form = useForm({
    defaultValues: {
      question: '[Insert question here]',
      explanation: '',
    }
  });
  
  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    } else {
      toast.warning('Maximum of 6 options allowed');
    }
  };
  
  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      // Adjust correctAnswer if needed
      if (correctAnswer === index) {
        setCorrectAnswer(0);
      } else if (correctAnswer > index) {
        setCorrectAnswer(correctAnswer - 1);
      }
    } else {
      toast.warning('Minimum of 2 options required');
    }
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = async (data: any) => {
    // Validate that all options have content
    const filledOptions = options.filter(option => option.trim() !== '');
    if (filledOptions.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare question data
      const questionData = {
        module_id: moduleId,
        question: data.question,
        options: options,
        correct_answer: correctAnswer,
        explanation: data.explanation || null,
      };
      
      // Save question to database
      const { error } = await dbService.questions.create(questionData);
      
      if (error) throw error;
      
      toast.success('Question saved successfully');
      
      // Reset form
      form.reset({
        question: '[Insert question here]',
        explanation: '',
      });
      setOptions(['', '', '', '']);
      setCorrectAnswer(3);
      
      // Callback to parent
      onSaved();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    options,
    correctAnswer,
    setCorrectAnswer,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSubmit
  };
};
