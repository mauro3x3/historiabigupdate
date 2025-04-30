
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LessonHeaderProps {
  title: string;
}

const LessonHeader = ({ title }: LessonHeaderProps) => {
  const navigate = useNavigate();
  
  const returnToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto py-4 px-4 flex items-center">
        <Button variant="ghost" onClick={returnToDashboard} className="mr-4">
          ← Back
        </Button>
        <h1 className="text-xl font-bold text-timelingo-navy">{title}</h1>
      </div>
    </header>
  );
};

export default LessonHeader;
