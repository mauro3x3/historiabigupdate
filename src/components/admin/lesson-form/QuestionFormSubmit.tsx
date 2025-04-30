
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface QuestionFormSubmitProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

const QuestionFormSubmit: React.FC<QuestionFormSubmitProps> = ({ 
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
        'Update Question'
      ) : (
        'Add Question'
      )}
    </Button>
  );
};

export default QuestionFormSubmit;
