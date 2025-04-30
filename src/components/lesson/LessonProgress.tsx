
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LessonProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
}

const LessonProgress = ({
  currentQuestionIndex,
  totalQuestions,
  correctAnswers,
}: LessonProgressProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
        <p className="text-sm font-semibold">
          {correctAnswers} correct
        </p>
      </div>
      <Progress value={(currentQuestionIndex / totalQuestions) * 100} />
    </div>
  );
};

export default LessonProgress;
