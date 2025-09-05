import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import InterestSelector from '@/components/onboarding/InterestSelector';
import EraSelector from '@/components/onboarding/EraSelector';


import { HistoryInterest, HistoryEra, LearningTime, UserPreferences } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { preloadSounds } from '@/utils/audioUtils';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updatePreferences, completeOnboarding } = useUser();
  
  const {
    step,
    totalSteps,
    interests,
    era,
    setInterests,
    setEra,
    handleNext,
    handleBack,
    finishOnboarding
  } = useOnboardingFlow(navigate, user, updatePreferences, completeOnboarding);
  
  // Preload sounds on component mount
  useEffect(() => {
    preloadSounds();
  }, []);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  return (
    <OnboardingContainer 
      step={step} 
      totalSteps={totalSteps} 
      onNext={handleNext} 
      onBack={handleBack} 
      isLastStep={step === totalSteps}
    >
      <>
        {step === 1 && (
          <InterestSelector 
            selectedInterests={interests} 
            onSelect={setInterests} 
          />
        )}
        {step === 2 && (
          <EraSelector 
            selectedEra={era} 
            onSelect={setEra} 
          />
        )}

      </>
    </OnboardingContainer>
  );
};

export default Onboarding;
