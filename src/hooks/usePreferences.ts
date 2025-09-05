
import { useState } from 'react';
import { HistoryEra, HistoryInterest, LearningStyle, LearningTime, ReminderMethod, UserPreferences } from '@/types';

interface UsePreferencesResult {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

// Define a function to generate default preferences
const defaultPreferences = (): UserPreferences => {
  return {
    interests: ['ancient-history'] as HistoryInterest[],
    era: 'ancient-egypt' as HistoryEra,
    learningStyle: 'traditional' as LearningStyle,
    dailyLearningTime: '15-min' as LearningTime,
    reminderMethod: 'none' as ReminderMethod,
    reminderTime: null
  };
};

export const usePreferences = (): UsePreferencesResult => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences());

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      ...newPreferences
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences());
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};
