
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GuessControlFooterProps {
  currentEntryIndex: number;
  showResult: boolean;
  userGuess: number | null;
  handleSubmitGuess: () => void;
  handlePreviousEntry: () => void;
  handleNextEntry: () => void;
  entriesLength: number;
}

const GuessControlFooter: React.FC<GuessControlFooterProps> = ({
  currentEntryIndex,
  showResult,
  userGuess,
  handleSubmitGuess,
  handlePreviousEntry,
  handleNextEntry,
  entriesLength
}) => {
  return (
    <div className="flex justify-between bg-gray-50 border-t border-gray-200 p-4">
      <Button
        variant="outline"
        disabled={currentEntryIndex === 0 || !showResult}
        onClick={handlePreviousEntry}
        className="border-gray-300"
      >
        <ArrowLeft size={16} className="mr-2" />
        Previous
      </Button>
      
      {!showResult ? (
        <Button
          disabled={userGuess === null}
          onClick={handleSubmitGuess}
          className="bg-timelingo-purple hover:bg-timelingo-purple/90"
        >
          Submit Guess
        </Button>
      ) : (
        <Button 
          onClick={handleNextEntry}
          className="bg-timelingo-purple hover:bg-timelingo-purple/90"
        >
          {currentEntryIndex < entriesLength - 1 ? (
            <>
              Next <ArrowRight size={16} className="ml-2" />
            </>
          ) : (
            'Finish'
          )}
        </Button>
      )}
    </div>
  );
};

export default GuessControlFooter;
