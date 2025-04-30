
import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChronologyScoreSummary from '../ChronologyScoreSummary';

interface ChronologyFooterProps {
  isSubmitted: boolean;
  score: number;
  totalEvents: number;
  onShare: () => void;
  onComplete: () => void;
  onSubmit: () => void;
}

const ChronologyFooter = ({ 
  isSubmitted, 
  score, 
  totalEvents, 
  onShare, 
  onComplete, 
  onSubmit 
}: ChronologyFooterProps) => {
  if (isSubmitted) {
    return (
      <ChronologyScoreSummary
        score={score}
        total={totalEvents}
        onShare={onShare}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Award className="h-5 w-5 mr-2 text-timelingo-gold" />
        <span className="text-sm font-medium">Earn up to {totalEvents * 5} XP by placing events correctly</span>
      </div>
      <Button 
        onClick={onSubmit}
        className="bg-timelingo-purple hover:bg-timelingo-purple/90"
        disabled={totalEvents === 0}
      >
        Submit Order
      </Button>
    </div>
  );
};

export default ChronologyFooter;
