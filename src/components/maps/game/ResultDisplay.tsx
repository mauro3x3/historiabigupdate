
import React from 'react';

interface ResultDisplayProps {
  userGuess: number;
  correctYear: number;
  score: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  userGuess,
  correctYear,
  score
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-lg font-medium text-gray-800">Result:</p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-600">Your guess:</p>
            <p className="text-lg font-bold">{userGuess}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Correct year:</p>
            <p className="text-lg font-bold text-timelingo-purple">{correctYear}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">Difference:</p>
          <p className="text-lg font-bold">{Math.abs(userGuess - correctYear)} years</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-lg font-semibold">Score:</p>
        <div className="mt-1 h-8 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full flex items-center justify-center text-white text-sm font-medium ${
              score > 75 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`} 
            style={{ width: `${score}%` }}
          >
            {score}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
