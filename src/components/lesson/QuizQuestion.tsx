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
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-2">
      <Card className="w-full max-w-2xl mx-auto mb-8 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <CardContent className="py-10 px-6 md:px-12 flex flex-col items-center">
          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-timelingo-navy mb-8 text-center drop-shadow-lg">
            {question}
          </h2>

          {/* Answer Options */}
          <div className="w-full flex flex-col gap-5">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = isAnswerCorrect && correctAnswer === index;
              const isWrong = isAnswerCorrect === false && isSelected;
              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={isAnswerCorrect !== null}
                  className={`w-full flex items-center gap-4 px-6 py-4 md:py-5 rounded-full text-lg md:text-xl font-semibold border-2 transition-all duration-150 shadow-md focus:outline-none
                    ${isSelected && isAnswerCorrect === null ? 'border-timelingo-purple bg-purple-100 text-timelingo-navy scale-[1.03]' : ''}
                    ${isCorrect ? 'border-green-500 bg-green-50 text-green-700 scale-[1.03]' : ''}
                    ${isWrong ? 'border-red-500 bg-red-50 text-red-700 scale-[1.03]' : ''}
                    ${!isSelected && !isCorrect && !isWrong ? 'border-gray-200 bg-white hover:border-timelingo-gold hover:bg-yellow-50' : ''}
                    ${isAnswerCorrect !== null ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-105'}
                  `}
                  style={{ minHeight: 56 }}
                >
                  {/* Feedback icon */}
                  {isCorrect && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 border-2 border-green-400 mr-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                  )}
                  {isWrong && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 border-2 border-red-400 mr-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                  )}
                  <span className="flex-1 text-left">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback/Explanation */}
          {isAnswerCorrect !== null && explanation && (
            <Alert className={`mt-8 w-full max-w-lg mx-auto rounded-2xl border-2 ${isAnswerCorrect ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`} style={{ fontSize: 18 }}>
              <AlertDescription>
                <div className="font-bold mb-1">{isAnswerCorrect ? '🎉 Correct!' : '💡 Explanation:'}</div>
                <div>{explanation}</div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizQuestion;
