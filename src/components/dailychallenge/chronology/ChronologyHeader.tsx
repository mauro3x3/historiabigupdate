
import React from 'react';
import { Calendar, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChronologyHintAlert from '../ChronologyHintAlert';

interface ChronologyHeaderProps {
  showHint: boolean;
  toggleHint: () => void;
}

const ChronologyHeader = ({ showHint, toggleHint }: ChronologyHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-timelingo-purple" />
          <h2 className="text-xl font-semibold text-timelingo-navy">Today's Chronology Challenge</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleHint}
          className="text-timelingo-purple hover:text-timelingo-purple/80"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          {showHint ? "Hide Hint" : "Need a Hint?"}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-1">Arrange these historical events in chronological order from earliest to latest</p>
      <ChronologyHintAlert showHint={showHint} />
    </>
  );
};

export default ChronologyHeader;
