
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  onSubmit: () => void;
  isLoading: boolean;
}

const FormActions = ({ onSubmit, isLoading }: FormActionsProps) => {
  return (
    <CardFooter>
      <Button 
        onClick={onSubmit} 
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        <PlusIcon size={16} className="mr-2" />
        Create Learning Journey
      </Button>
    </CardFooter>
  );
};

export default FormActions;
