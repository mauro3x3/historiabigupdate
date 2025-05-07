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

  // Detect if user is likely American
  const isAmerican = navigator.language === 'en-US';

  return (
    <div className="time-picker">
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        className="time-input"
        lang={isAmerican ? 'en-US' : 'en-GB'} // Force 24-hour for non-Americans
      />
    </div>
  );
};
