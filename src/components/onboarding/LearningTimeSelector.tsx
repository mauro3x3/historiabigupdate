
import React from 'react';
import { LearningTime } from '@/types';
import { Clock, Clock2, Clock4, Clock8 } from 'lucide-react';
import { playSelectSound } from '@/utils/audioUtils';

interface LearnTimeOption {
  value: LearningTime;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const learningTimeOptions: LearnTimeOption[] = [
  {
    value: "5-min",
    label: "5 minutes",
    description: "Quick daily history facts",
    icon: <Clock className="h-8 w-8 text-timelingo-purple" />
  },
  {
    value: "15-min",
    label: "10-15 minutes",
    description: "Short lessons and quizzes",
    icon: <Clock2 className="h-8 w-8 text-timelingo-purple" />
  },
  {
    value: "30-min",
    label: "30 minutes",
    description: "Deeper learning with scenarios",
    icon: <Clock4 className="h-8 w-8 text-timelingo-purple" />
  },
  {
    value: "60-min",
    label: "60+ minutes",
    description: "Comprehensive historical immersion",
    icon: <Clock8 className="h-8 w-8 text-timelingo-purple" />
  }
];

interface LearningTimeSelectorProps {
  selectedTime: LearningTime | null;
  onSelect: (time: LearningTime) => void;
}

const LearningTimeSelector = ({ selectedTime, onSelect }: LearningTimeSelectorProps) => {
  const handleSelect = (time: LearningTime) => {
    playSelectSound();
    onSelect(time);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">How much time can you dedicate daily?</h2>
      <p className="text-gray-600 mb-8">Choose the daily learning time that works best for your schedule</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {learningTimeOptions.map((option) => (
          <div
            key={option.value}
            className={`learning-time-card ${selectedTime === option.value ? 'border-purple-500 bg-purple-50' : 'border border-gray-200 hover:border-purple-300'} rounded-xl p-4 flex flex-col items-center text-center cursor-pointer transition-all`}
            onClick={() => handleSelect(option.value)}
          >
            <div className="mb-2">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{option.label}</h3>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningTimeSelector;
