
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';

interface StorytellingTabProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isSaving: boolean;
}

const StorytellingTab = ({ form, onSubmit, isSaving }: StorytellingTabProps) => {
  if (!form || !form.control) {
    return (
      <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
        <p>Form data is not properly initialized. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Story Content</h3>
              <p className="text-sm text-gray-500">
                Write your story text that will be displayed to the user.
              </p>
            </div>
            
            {form.formState.errors.story_content && (
              <p className="text-sm text-red-500">
                {form.formState.errors.story_content.message?.toString()}
              </p>
            )}
            
            <textarea 
              {...form.register('story_content')}
              className="min-h-[200px] w-full rounded-md border border-gray-300 p-4"
              placeholder="Enter your cinematic story text here..."
              rows={8}
            />
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Transition Question</h3>
              <p className="text-sm text-gray-500">
                Question that will be displayed at the end of the story.
              </p>
            </div>
            
            <input 
              {...form.register('transition_question')}
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Are you ready for the quiz?"
            />
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Images</h3>
              <p className="text-sm text-gray-500">
                Add image URLs, one per line, to illustrate your story.
              </p>
            </div>
            
            <textarea 
              {...form.register('image_urls')}
              className="min-h-[100px] w-full rounded-md border border-gray-300 p-4"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Content'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StorytellingTab;
