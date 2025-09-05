
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LessonHeaderProps {
  title: string;
}

const LessonHeader = ({ title }: LessonHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto py-4 px-4 flex items-center">
        <h1 className="text-xl font-bold text-timelingo-navy">{title}</h1>
      </div>
    </header>
  );
};

export default LessonHeader;
