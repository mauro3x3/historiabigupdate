
import React from 'react';
import { Button } from '@/components/ui/button';

interface DailyChallengeCompletedProps {
  onComplete: () => void;
}

const DailyChallengeCompleted = ({ onComplete }: DailyChallengeCompletedProps) => {
  return (
    <div className="p-8 text-center bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">You've already completed today's challenge!</h2>
      <p className="mb-4">Come back tomorrow for a new one.</p>
      <Button 
        className="bg-timelingo-purple hover:bg-timelingo-purple/90"
        onClick={onComplete}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default DailyChallengeCompleted;
