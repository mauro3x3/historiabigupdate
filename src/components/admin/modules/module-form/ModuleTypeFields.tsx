
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ModuleTypeFieldsProps {
  form: any;
  disabled: boolean;
}

const ModuleTypeFields = ({ form, disabled }: ModuleTypeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="contentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Type</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="story">Storytelling</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="game">Game</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isJourney"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Learning Type</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={(value) => field.onChange(value === 'true')}
              defaultValue={field.value ? 'true' : 'false'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select learning type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Main Learning Journey</SelectItem>
                <SelectItem value="false">Side Learning</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ModuleTypeFields;
