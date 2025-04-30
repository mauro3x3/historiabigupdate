
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Star } from 'lucide-react';

interface StoryMetadataFieldsProps {
  form: UseFormReturn<any>;
}

const StoryMetadataFields = ({ form }: StoryMetadataFieldsProps) => {
  return (
    <>
      {/* Learning Journey toggle - moved to top for prominence */}
      <FormField
        control={form.control}
        name="is_journey_content"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-4 shadow-sm mb-6">
            <div className="space-y-0.5">
              <FormLabel className="text-base font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Add to Learning Journey
              </FormLabel>
              <FormDescription className="text-purple-700">
                When enabled, this lesson will appear in the main "Your Learning Journey" section as core curriculum
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-purple-600"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="xpReward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>XP Reward</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="10"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 50)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default StoryMetadataFields;
