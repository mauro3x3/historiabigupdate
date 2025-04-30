
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ModuleMetadataFieldsProps {
  form: any;
  disabled: boolean;
}

const ModuleMetadataFields = ({ form, disabled }: ModuleMetadataFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Module Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter module title" 
                {...field} 
                disabled={disabled}
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of this module" 
                {...field} 
                disabled={disabled}
                className="resize-none"
                rows={3}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ModuleMetadataFields;
