
import React from 'react';

interface GameProgressProps {
  currentEntryIndex: number;
  entriesLength: number;
}

const GameProgress: React.FC<GameProgressProps> = ({
  currentEntryIndex,
  entriesLength
}) => {
  return (
    <div className="mb-4 bg-timelingo-purple/5 px-4 py-2 rounded-lg flex items-center justify-between">
      <p className="text-sm font-medium">
        Entry {currentEntryIndex + 1} of {entriesLength}
      </p>
      <div className="flex items-center">
        <div className="h-2 bg-gray-200 rounded-full w-32 overflow-hidden">
          <div 
            className="h-full bg-timelingo-purple" 
            style={{ width: `${((currentEntryIndex + 1) / entriesLength) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
