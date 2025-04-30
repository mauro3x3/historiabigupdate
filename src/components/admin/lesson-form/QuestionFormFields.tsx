
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface QuestionFormFieldsProps {
  form: UseFormReturn<any>;
}

const QuestionFormFields: React.FC<QuestionFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Text</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter your question here" 
                className="resize-none"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="explanation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Explanation (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Explain why the correct answer is right (shown after answering)" 
                className="resize-none"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default QuestionFormFields;
