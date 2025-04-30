import React from 'react';
import { Button } from '@/components/ui/button';
import LearningJourney from '../LearningJourney';
import { LearningTrackLevel } from '@/types';
import { useNavigate } from 'react-router-dom';

interface LearningSectionProps {
  currentEra: string | null;
  learningTrack: LearningTrackLevel[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const LearningSection: React.FC<LearningSectionProps> = ({
  currentEra,
  learningTrack,
  isLoading,
  title = "Your Learning Journey",
  description = "Continue your history learning path and master new concepts."
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-2 text-timelingo-navy">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <LearningJourney
          currentEra={currentEra}
          learningTrack={learningTrack}
          isLoading={isLoading}
        />
      </div>
      
      <div className="space-y-6">
        {/* Add supplementary content or widgets here */}
      </div>
    </div>
  );
};

export default LearningSection;
