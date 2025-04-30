
import React from 'react';
import { Trophy, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChronologyScoreSummaryProps {
  score: number;
  total: number;
  onShare: () => void;
  onComplete: () => void;
}

const ChronologyScoreSummary = ({
  score,
  total,
  onShare,
  onComplete,
}: ChronologyScoreSummaryProps) => {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-6 animate-fade-in">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Trophy className="h-8 w-8 text-timelingo-purple" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-timelingo-navy">Your Score: {score}/{total}</h3>
            <div className="flex mt-1">
              {Array.from({ length: total }).map((_, i) => (
                <span 
                  key={i} 
                  className={`h-2 w-8 mr-1 rounded-full ${i < score ? 'bg-green-500' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-2">
              {score === total 
                ? "Perfect! You've mastered historical chronology." 
                : score >= total / 2 
                  ? "Good job! You're getting the hang of historical timelines." 
                  : "Keep practicing to improve your historical knowledge!"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          onClick={onShare}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </Button>

        <Button
          onClick={onComplete}
          className="bg-timelingo-purple hover:bg-timelingo-purple/90"
        >
          Back to Dashboard
        </Button>
      </div>
    </>
  );
};

export default ChronologyScoreSummary;
