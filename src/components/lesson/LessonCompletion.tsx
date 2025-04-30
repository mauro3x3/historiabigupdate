import React from 'react';
import { Button } from '@/components/ui/button';

interface LessonCompletionProps {
  correctAnswers: number;
  totalQuestions: number;
  onReturn: () => void;
  onNext?: () => void;
  nextModuleTitle?: string;
}

const LessonCompletion = ({
  correctAnswers,
  totalQuestions,
  onReturn,
  onNext,
  nextModuleTitle
}: LessonCompletionProps) => {
  const stars = Math.ceil((correctAnswers / totalQuestions) * 3);
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Lesson Completed!</h2>
      <p className="mb-6">
        You got {correctAnswers} out of {totalQuestions} questions correct.
      </p>
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map(star => (
          <span 
            key={star} 
            className={`text-4xl ${star <= stars ? 'text-timelingo-gold' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
      {onNext && nextModuleTitle && (
        <Button 
          className="bg-green-500 hover:bg-green-600 mb-4 mr-2"
          onClick={onNext}
        >
          Proceed to {nextModuleTitle}
        </Button>
      )}
      <Button 
        className="bg-timelingo-purple hover:bg-purple-700"
        onClick={onReturn}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default LessonCompletion;
