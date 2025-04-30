
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  disabled: boolean;
}

const FormActions = ({ isSubmitting, disabled }: FormActionsProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={disabled}
    >
      <FilePlus className="mr-2 h-4 w-4" />
      {isSubmitting ? 'Creating...' : 'Create Module'}
    </Button>
  );
};

export default FormActions;
