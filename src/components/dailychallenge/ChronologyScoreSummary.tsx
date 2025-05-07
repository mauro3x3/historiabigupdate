import React from 'react';
import { Trophy, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';

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
  const perfect = score === total;
  // Placeholder for global stats
  const percentPerfect = 7;
  return (
    <>
      {perfect && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-7 mb-6 animate-fade-in flex flex-col items-center">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-4 rounded-full mr-6 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-timelingo-purple" />
          </div>
          <img src="/images/mascot/celebrate.gif" alt="Mascot celebrating" className="h-16 w-16 object-contain drop-shadow-lg" />
        </div>
        <h3 className={`text-2xl font-extrabold mb-2 ${perfect ? 'text-green-600' : 'text-timelingo-navy'}`}>Your Score: {score}/{total}</h3>
        <div className="flex mb-2">
          {Array.from({ length: total }).map((_, i) => (
            <span 
              key={i} 
              className={`h-3 w-10 mr-2 rounded-full ${i < score ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <p className={`mt-2 text-lg font-semibold ${perfect ? 'text-green-700' : 'text-blue-700'}`}
        >
          {perfect
            ? "Perfect! You're a chronology master! 🎉"
            : score >= total / 2
              ? "Good job! You're getting the hang of historical timelines."
              : "Keep practicing to improve your historical knowledge!"}
        </p>
        <p className="mt-2 text-sm text-gray-500">Only {percentPerfect}% of users got a perfect score today!</p>
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
        <Button
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Try Again
        </Button>
      </div>
    </>
  );
};

export default ChronologyScoreSummary;
