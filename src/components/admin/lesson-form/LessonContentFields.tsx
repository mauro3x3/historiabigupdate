
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import StorytellingForm from './StorytellingForm';
import { Switch } from '@/components/ui/switch';

interface LessonContentFieldsProps {
  form: UseFormReturn<any>;
  lessonType: string;
}

export const LessonContentFields: React.FC<LessonContentFieldsProps> = ({ form, lessonType }) => {
  return (
    <div>
      {/* Common description field */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lesson Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a brief description of the lesson"
                {...field}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Type-specific content fields */}
      {lessonType === 'standard' && (
        <div className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the main content of the lesson"
                    {...field}
                    rows={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_journey_content"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Learning Journey Content</FormLabel>
                  <FormDescription>
                    Should this lesson appear in the main "Your Learning Journey" section?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
      
      {lessonType === 'storytelling' && (
        <div className="mt-4">
          <StorytellingForm form={form} />
        </div>
      )}
      
      {lessonType === 'reflection' && (
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Reflection Prompt</FormLabel>
              <FormDescription>
                A question or statement for students to reflect on
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="What does this historical event teach us about..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {lessonType === 'role-play' && (
        <div className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="character"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Character</FormLabel>
                <FormDescription>
                  The historical figure students will role-play as
                </FormDescription>
                <FormControl>
                  <Input placeholder="e.g., Julius Caesar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scenario Prompt</FormLabel>
                <FormDescription>
                  The historical situation and decision-making context
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="You are [character] facing..."
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Add more conditionals for other lesson types as needed */}
    </div>
  );
};
