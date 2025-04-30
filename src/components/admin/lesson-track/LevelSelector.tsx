
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LevelSelectorProps {
  selectedLevel: number;
  availableLevels: { id: string; name: string }[];
  onLevelChange: (value: number) => void;
}

const LevelSelector = ({ selectedLevel, availableLevels, onLevelChange }: LevelSelectorProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Level</label>
      <Select 
        value={String(selectedLevel)} 
        onValueChange={(value) => onLevelChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {availableLevels.map(level => (
            <SelectItem key={level.id} value={level.id}>
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LevelSelector;
