import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { dbService } from '@/services/dbService';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ModuleMetadataFields } from './';
import { ModuleTypeFields } from './';
import { FormActions } from './';

interface ModuleFormProps {
  journeys: {
    id: number;
    name: string;
    era: string;
  }[];
  chapters: {
    id: number;
    title: string;
    description: string;
    journey_id: number;
    position: number;
  }[];
  selectedJourney: number | null;
  selectedChapter: number | null;
  modules: any[];
  onModuleCreated: () => void;
}

const ModuleForm = ({ 
  journeys, 
  chapters,
  selectedJourney, 
  selectedChapter, 
  modules, 
  onModuleCreated 
}: ModuleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      contentType: 'story',
      isJourney: true
    }
  });
  
  const handleSubmit = async (values: any) => {
    if (!selectedJourney || !selectedChapter) {
      toast.error('Please select a journey and chapter');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const moduleData = {
        title: values.title,
        description: values.description,
        content_type: values.contentType,
        is_journey_module: values.isJourney,
        journey_id: selectedJourney,
        chapter_id: selectedChapter,
        position: modules.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await dbService.modules.create(moduleData);
      
      if (error) throw error;
      
      toast.success('Module created successfully!');
      form.reset();
      onModuleCreated();
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Create Module</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <ModuleMetadataFields 
              form={form} 
              disabled={!selectedChapter || isSubmitting} 
            />
            
            <ModuleTypeFields
              form={form}
              disabled={!selectedChapter || isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <FormActions 
              isSubmitting={isSubmitting} 
              disabled={!selectedChapter || isSubmitting} 
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ModuleForm;
