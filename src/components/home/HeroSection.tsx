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
      
      <div className={`bg-white p-6 rounded-xl border border-${eraTheme.accent}-200 shadow-sm relative overflow-hidden`}>
        {/* Background pattern with pointer-events-none to allow clicking through it */}
        <div className={`absolute inset-0 ${eraTheme.bgPattern} opacity-10 pointer-events-none`}></div>
        
        {!user ? (
          <GuestContent />
        ) : (
          <LearningContent 
            isLoading={isLoading}
            preferredEra={preferredEra}
            learningTrack={learningTrack}
            eraTheme={eraTheme}
            onEraChange={onEraChange}
            changingEra={changingEra}
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
