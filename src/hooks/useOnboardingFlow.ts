import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { HistoryEra, HistoryInterest, LearningStyle, LearningTime, UserPreferences, ReminderMethod } from '@/types';
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
  const [reminderMethod, setReminderMethod] = useState<ReminderMethod | null>(null);
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  
  const totalSteps = 5;
  
  const handleNext = () => {
    if (step === 1 && interests.length === 0) {
      toast.error('Please select at least one interest to continue');
      return;
    }
    
    if (step === 2 && !era) {
      toast.error('Please select an era to continue');
      return;
    }
    
    if (step === 3 && !learningStyle) {
      toast.error('Please select a learning style to continue');
      return;
    }

    if (step === 4 && !learningTime) {
      toast.error('Please select a daily learning time to continue');
      return;
    }
    
    if (step === 5 && !reminderMethod) {
      toast.error('Please select a reminder method to continue');
      return;
    }

    if (step === 5 && reminderMethod !== 'none' && !reminderTime) {
      toast.error('Please select a reminder time');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const finishOnboarding = async () => {
    if (interests.length > 0 && era && learningStyle && learningTime) {
      const preferences: UserPreferences = {
        interests,
        era,
        learningStyle,
        dailyLearningTime: learningTime,
        reminderMethod: reminderMethod || 'none',
        reminderTime: reminderMethod !== 'none' ? reminderTime || null : null
      };
      
      updatePreferences(preferences);
      completeOnboarding();
      
      if (user) {
        try {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              updated_at: new Date().toISOString(),
              preferred_era: era,
              learning_style: learningStyle
            })
            .eq('id', user.id);
            
          if (error) throw error;
          
          // Register for push notifications if selected
          if (reminderMethod === 'push') {
            if ('Notification' in window) {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  toast.success('Push notifications enabled!');
                }
              });
            }
          }
          
        } catch (error) {
          console.error('Error saving onboarding preferences:', error);
        }
      }
      
      toast.success('Welcome to TimeLingo! Your journey begins now.');
      
      // Direct user based on learning style
      if (learningStyle === 'visual') {
        navigate('/profile?tab=videos');
      } else if (learningStyle === 'daily') {
        navigate('/daily-challenge');
      } else if (learningStyle === 'journey') {
        navigate('/learning-journeys');
      } else if (learningStyle === 'mystery') {
        navigate('/mystery-history');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return {
    step,
    totalSteps,
    interests,
    era,
    learningStyle,
    learningTime,
    reminderMethod,
    reminderTime,
    setInterests,
    setEra,
    setLearningStyle,
    setLearningTime,
    setReminderMethod,
    setReminderTime,
    handleNext,
    handleBack,
    finishOnboarding
  };
};
