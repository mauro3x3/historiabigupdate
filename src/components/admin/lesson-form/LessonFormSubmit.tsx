
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LessonFormSubmitProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

const LessonFormSubmit: React.FC<LessonFormSubmitProps> = ({ 
  isSubmitting, 
  isEditing = false
}) => {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : isEditing ? (
        'Update Lesson'
      ) : (
        'Create Lesson'
      )}
    </Button>
  );
};

export default LessonFormSubmit;
