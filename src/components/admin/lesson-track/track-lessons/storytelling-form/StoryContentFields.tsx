
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface StoryContentFieldsProps {
  form: UseFormReturn<any>;
}

const StoryContentFields = ({ form }: StoryContentFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lesson Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter lesson title" 
                {...field} 
                required 
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brief Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="A short description of the lesson" 
                {...field} 
                className="h-20"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="story_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Story Content</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter the storytelling content here..." 
                className="min-h-[200px]"
                {...field} 
                required
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Markdown formatting is supported for rich content.
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};

export default StoryContentFields;
