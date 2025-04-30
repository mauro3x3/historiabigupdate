
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { playCorrectSound, playWrongSound, preloadSounds } from '@/utils/audioUtils';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  correctAnswer: number;
  explanation?: string;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuizQuestion = ({
  question,
  options,
  selectedAnswer,
  isAnswerCorrect,
  correctAnswer,
  explanation,
  onAnswerSelect,
}: QuizQuestionProps) => {
  // Preload sounds when component mounts
  useEffect(() => {
    preloadSounds();
  }, []);

  // Play appropriate sound when isAnswerCorrect changes from null to true/false
  useEffect(() => {
    if (isAnswerCorrect === true) {
      playCorrectSound();
    } else if (isAnswerCorrect === false) {
      playWrongSound();
    }
  }, [isAnswerCorrect]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">
          {question}
        </h2>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => onAnswerSelect(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === index 
                  ? isAnswerCorrect === null
                    ? 'border-timelingo-purple bg-purple-50' 
                    : isAnswerCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  : correctAnswer === index && isAnswerCorrect !== null
                    ? 'border-green-500 bg-green-50'
                    : 'hover:border-gray-400'
              }`}
            >
              <p>{option}</p>
            </div>
          ))}
        </div>
        
        {isAnswerCorrect !== null && explanation && (
          <Alert className={`mt-4 ${isAnswerCorrect ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <AlertDescription>
              <p className="font-semibold">{isAnswerCorrect ? 'Correct!' : 'Explanation:'}</p>
              <p>{explanation}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
