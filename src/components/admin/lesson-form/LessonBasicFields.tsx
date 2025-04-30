
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface LessonBasicFieldsProps {
  form: UseFormReturn<any>;
}

const LessonBasicFields: React.FC<LessonBasicFieldsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lesson Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter lesson title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LessonBasicFields;
