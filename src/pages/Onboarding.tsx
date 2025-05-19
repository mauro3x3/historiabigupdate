import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import InterestSelector from '@/components/onboarding/InterestSelector';
import EraSelector from '@/components/onboarding/EraSelector';
import LearningStyleSelector from '@/components/onboarding/LearningStyleSelector';
import LearningTimeSelector from '@/components/onboarding/LearningTimeSelector';
import ReminderPreferences from '@/components/onboarding/ReminderPreferences';
import SkillLevelSelector from '@/components/onboarding/SkillLevelSelector';
import { HistoryInterest, HistoryEra, LearningStyle, LearningTime, UserPreferences, ReminderMethod } from '@/types';
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
    learningStyle,
    learningTime,
    reminderMethod,
    reminderTime,
    skillLevel,
    setInterests,
    setEra,
    setLearningStyle,
    setLearningTime,
    setReminderMethod,
    setReminderTime,
    setSkillLevel,
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
        {step === 3 && (
          <LearningStyleSelector 
            selectedStyle={learningStyle} 
            onSelect={setLearningStyle} 
          />
        )}
        {step === 4 && (
          <SkillLevelSelector
            selectedSkill={skillLevel}
            onSelect={setSkillLevel}
          />
        )}
        {step === 5 && (
          <LearningTimeSelector
            selectedTime={learningTime}
            onSelect={setLearningTime}
          />
        )}
        {step === 6 && (
          <ReminderPreferences
            selectedMethod={reminderMethod}
            selectedTime={reminderTime}
            onMethodSelect={setReminderMethod}
            onTimeSelect={setReminderTime}
          />
        )}
      </>
    </OnboardingContainer>
  );
};

export default Onboarding;
