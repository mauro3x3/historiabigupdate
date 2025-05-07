import React, { useState } from 'react';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { getEraTheme } from './hero/EraTheme';
import HeroTitle from './hero/HeroTitle';
import LearningContent from './hero/LearningContent';
import GuestContent from './hero/GuestContent';

interface HeroSectionProps {
  user: any;
  preferredEra: string | null;
  isLoading: boolean;
  learningTrack: any[];
  handleToDashboard: () => void;
  handleEraChange: (era: string) => Promise<void>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  user, 
  preferredEra, 
  isLoading, 
  learningTrack, 
  handleToDashboard,
  handleEraChange 
}) => {
  const [changingEra, setChangingEra] = useState(false);
  const eraTheme = getEraTheme(preferredEra);

  const onEraChange = async (era: string) => {
    setChangingEra(true);
    try {
      await handleEraChange(era);
    } catch (error) {
      console.error('Error setting era:', error);
    } finally {
      setChangingEra(false);
    }
  };

  return (
    <div className="mb-10">
      <HeroTitle 
        eraTheme={eraTheme} 
        preferredEra={preferredEra} 
        handleToDashboard={handleToDashboard}
        user={user}
      />
      {/* Old learning path UI removed */}
    </div>
  );
};

export default HeroSection;
