
import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface GuessInputProps {
  userGuess: number | null;
  setUserGuess: (guess: number | null) => void;
  yearRange: [number, number];
}

const GuessInput: React.FC<GuessInputProps> = ({
  userGuess,
  setUserGuess,
  yearRange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium flex justify-between">
          <span>Year: {userGuess !== null ? userGuess : '?'}</span>
          <span className="text-timelingo-purple font-semibold">{yearRange[0]} - {yearRange[1]}</span>
        </label>
        <Slider
          defaultValue={[yearRange[0]]}
          min={yearRange[0]}
          max={yearRange[1]}
          step={1}
          onValueChange={(value) => setUserGuess(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>
      
      <div className="pt-4">
        <Input
          type="number"
          placeholder="Enter year"
          value={userGuess || ''}
          onChange={(e) => setUserGuess(parseInt(e.target.value) || null)}
          min={yearRange[0]}
          max={yearRange[1]}
          className="w-full border-gray-300 focus:border-timelingo-purple focus:ring-1 focus:ring-timelingo-purple"
        />
      </div>
    </div>
  );
};

export default GuessInput;
