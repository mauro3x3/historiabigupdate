import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { HistoryEra, HistoryInterest, LearningStyle, LearningTime, UserPreferences } from '@/types';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOnboardingFlow = (
  navigate: NavigateFunction,
  user: User | null,
  updatePreferences: (preferences: UserPreferences) => void,
  completeOnboarding: () => void
) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<HistoryInterest[]>([]);
  const [era, setEra] = useState<HistoryEra | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [learningTime, setLearningTime] = useState<LearningTime | null>(null);
  
  const totalSteps = 2;
  
  const handleNext = () => {
    console.log('🔄 handleNext called for step:', step);
    console.log('🔄 Current state:', { interests, era, learningStyle });
    console.log('🔄 Step 1 validation - interests.length:', interests.length);
    
    if (step === 1 && interests.length === 0) {
      console.log('🔄 Step 1 validation failed - no interests selected');
      toast.error('Please select at least one interest to continue');
      return;
    }
    if (step === 2 && !era) {
      toast.error('Please select an era to continue');
      return;
    }

    // Check if user selected "World Map History" in Step 1
    const hasWorldMapHistory = interests.includes('world-map-history');
    
    if (step === 1 && hasWorldMapHistory) {
      console.log('🔄 User selected World Map History, skipping Step 2 and finishing onboarding');
      finishOnboarding();
      return;
    }

    console.log('🔄 All validations passed, proceeding...');
    console.log('🔄 Current step:', step, 'Total steps:', totalSteps);
    
    if (step < totalSteps) {
      console.log('🔄 Moving to next step:', step + 1);
      setStep(step + 1);
    } else {
      console.log('🔄 Last step reached, finishing onboarding...');
      finishOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const finishOnboarding = async () => {
    // Check if user selected "World Map History" interest
    const hasWorldMapHistory = interests.includes('world-map-history');
    
    // For World Map History users, we don't require an era selection
    if (interests.length > 0 && (era || hasWorldMapHistory)) {
      const preferences: UserPreferences = {
        interests,
        era: era || 'rome-greece', // Default era for World Map History users
        learningStyle: 'journey', // Default since we removed the selection
        dailyLearningTime: '15-min', // Default since we removed the time selection
        reminderMethod: 'none', // Default to no reminders since we removed that step
        reminderTime: null
      };
      
      updatePreferences(preferences);
      completeOnboarding();
      
      if (user) {
        try {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              updated_at: new Date().toISOString(),
              preferred_era: era || 'rome-greece', // Default era for World Map History users
              learning_style: 'journey', // Default since we removed the selection
              is_onboarded: true
            })
            .eq('id', user.id);
            
          if (error) throw error;
          
        } catch (error) {
          console.error('Error saving onboarding preferences:', error);
        }
      }
      
      toast.success('Welcome to Historia! Your journey begins now.');
      
      // Direct user based on interests selected in Step 1
      console.log('🎯 Onboarding complete! Directing user based on interests:', interests);
      console.log('🎯 User era:', era);
      
      if (hasWorldMapHistory) {
        console.log('🎯 User selected World Map History, navigating to Globe (/globe)');
        navigate('/globe'); // Go to globe
      } else {
        console.log('🎯 User selected other interests, navigating to Learning Journeys (/home)');
        navigate('/home'); // Go to learning journeys
      }
    }
  };

  return {
    step,
    totalSteps,
    interests,
    era,
    setInterests,
    setEra,
    handleNext,
    handleBack,
    finishOnboarding
  };
};
