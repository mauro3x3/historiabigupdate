
import React from 'react';
import { Input } from '@/components/ui/input';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="time-picker">
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        className="time-input"
      />
    </div>
  );
};
