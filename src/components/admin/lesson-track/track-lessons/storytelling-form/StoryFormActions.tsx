
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StoryFormActionsProps {
  isSubmitting: boolean;
  onSubmit: () => void; // No parameters expected
  onCancel: () => void;
}

const StoryFormActions = ({ isSubmitting, onSubmit, onCancel }: StoryFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : 'Create Learning Journey Lesson'}
      </Button>
    </div>
  );
};

export default StoryFormActions;
