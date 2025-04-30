
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuthManagement = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = async (userId: string) => {
    try {
      // First check if the user has a record in user_profiles with preferences set
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // If the user has completed preferences in their profile, they're considered onboarded
      // Check if preferred_era is set or if the profile has been updated after creation
      if (profileData && (
          profileData.preferred_era || 
          profileData.created_at !== profileData.updated_at
      )) {
        setIsOnboarded(true);
        setIsLoading(false);
        return true;
      }
      
      // As a fallback, also check the lesson progress
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      const hasCompletedOnboarding = !!(progressData && progressData.length > 0);
      setIsOnboarded(hasCompletedOnboarding);
      setIsLoading(false);
      return hasCompletedOnboarding;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsLoading(false);
      return false;
    }
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    user,
    setUser,
    session,
    setSession,
    isOnboarded,
    setIsOnboarded,
    isLoading,
    setIsLoading,
    checkOnboardingStatus,
    completeOnboarding,
    signOut
  };
};
