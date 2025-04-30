
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { eras } from '@/data/historyData';
import { BookOpen } from 'lucide-react';

interface LessonMetadataFieldsProps {
  form: UseFormReturn<any>;
  lessonType?: string;
}

const LessonMetadataFields = ({ form, lessonType }: LessonMetadataFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="era"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historical Era</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select era" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eras.map(era => (
                    <SelectItem key={era.code} value={era.code}>
                      {era.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  onChange={e => field.onChange(parseInt(e.target.value) || 50)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  onChange={e => field.onChange(parseInt(e.target.value) || 5)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Add Learning Journey toggle for all lesson types */}
      <FormField
        control={form.control}
        name="is_journey_content"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-4 mt-4">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                Add to Learning Journey
              </FormLabel>
              <FormDescription>
                When enabled, this lesson will appear in the main "Your Learning Journey" section
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
    </div>
  );
};

export default LessonMetadataFields;
