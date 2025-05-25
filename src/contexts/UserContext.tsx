import React, { createContext, useState, useEffect, useContext } from 'react';
import { HistoryEra, UserPreferences } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { unlockAchievement } from '@/integrations/supabase/achievements';
import { toast } from 'sonner';

interface UserContextType {
  user: User | null;
  xp: number;
  streak: number;
  addXp: (xpToAdd: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  signOut: () => Promise<void>;
  completedEras: string[];
  preferredEra: HistoryEra | null;
  setPreferredEra: (era: HistoryEra | null) => void;
  isOnboarded: boolean;
  preferences: UserPreferences | null;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedEras, setCompletedEras] = useState<string[]>([]);
  const [preferredEra, setPreferredEra] = useState<HistoryEra | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      
      if (supaUser) {
        setUser(supaUser);
        
        // Fetch user profile data
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', supaUser.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching user profile:", profileError);
          }
          
          if (profileData) {
            setXp(profileData.xp || 0);
            setStreak(profileData.streak || 0);
            setCompletedEras(profileData.completed_eras || []);
            if (profileData.preferred_era) {
              setPreferredEra(profileData.preferred_era as HistoryEra);
            }
            // Set onboarded state based on is_onboarded field
            setIsOnboarded(!!profileData.is_onboarded);
            // Set preferences
            if (profileData.preferred_era) {
              setPreferences({
                interests: ['ancient-history'],
                era: profileData.preferred_era as HistoryEra,
                learningStyle: 'reading',
                dailyLearningTime: '15-min',
                reminderMethod: 'none',
                reminderTime: null
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserDetails();
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserDetails();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setXp(0);
        setStreak(0);
        setCompletedEras([]);
        setPreferredEra(null);
        setIsOnboarded(false);
        setPreferences(null);
      }
    });
  }, []);
  
  const addXp = (xpToAdd: number) => {
    setXp(prevXp => {
      const newXp = prevXp + xpToAdd;
      updateUserProfile({ xp: newXp });
      return newXp;
    });
  };
  
  const incrementStreak = async () => {
    let currentUser = user;
    if (!currentUser) {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      currentUser = supaUser;
      if (!currentUser) {
        toast.error('No user found for updating streak');
        return;
      }
    }
    const newStreak = (typeof streak === 'number' ? streak : 0) + 1;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ streak: newStreak })
        .eq('id', currentUser.id);
      if (error) {
        toast.error('Error updating streak: ' + error.message);
        console.error('Error updating streak:', error);
        return;
      }
      setStreak(newStreak);
      toast.success(`🔥 Streak increased! You're on a ${newStreak}-day streak!`);
      // Unlock streak achievements
      if (currentUser.id) {
        if (newStreak >= 3) unlockAchievement(currentUser.id, 'streak_3');
        if (newStreak >= 7) unlockAchievement(currentUser.id, 'streak_7');
        if (newStreak >= 30) unlockAchievement(currentUser.id, 'streak_30');
      }
    } catch (error) {
      toast.error('Error updating streak');
      console.error('Error updating streak:', error);
    }
  };
  
  const resetStreak = async () => {
    let currentUser = user;
    if (!currentUser) {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      currentUser = supaUser;
      if (!currentUser) {
        toast.error('No user found for resetting streak');
        return;
      }
    }
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ streak: 0 })
        .eq('id', currentUser.id);
      if (error) {
        toast.error('Error resetting streak: ' + error.message);
        console.error('Error resetting streak:', error);
        return;
      }
      setStreak(0);
      toast('Streak reset. Start again tomorrow!');
    } catch (error) {
      toast.error('Error resetting streak');
      console.error('Error resetting streak:', error);
    }
  };
  
  const setCompletedEra = (era: string) => {
    setCompletedEras(prevCompletedEras => {
      const newCompletedEras = [...prevCompletedEras, era];
      updateUserProfile({ completed_eras: newCompletedEras });
      // Unlock era achievements
      if (user?.id) {
        if (newCompletedEras.length >= 1) unlockAchievement(user.id, 'era_mastered');
        if (newCompletedEras.length >= 3) unlockAchievement(user.id, 'era_explorer');
      }
      return newCompletedEras;
    });
  };
  
  const setPreferredEraPreference = (era: HistoryEra | null) => {
    setPreferredEra(era);
    updateUserProfile({ preferred_era: era });
  };
  
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = prev ? { ...prev, ...prefs } : prefs as UserPreferences;
      // Also update preferred era if it's in the preferences
      if (prefs.era) {
        setPreferredEra(prefs.era);
        updateUserProfile({ preferred_era: prefs.era });
      }
      return updated;
    });
  };
  
  const completeOnboarding = () => {
    setIsOnboarded(true);
    updateUserProfile({ is_onboarded: true });
  };
  
  const updateUserProfile = async (updates: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: user.id, ...updates }, { onConflict: 'id' });
        
      if (error) {
        console.error("Error updating user profile:", error);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const updateUserProfileWithFallback = async (updates: any) => {
    let currentUser = user;
    if (!currentUser) {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      currentUser = supaUser;
      if (!currentUser) {
        console.error('No user found for updating profile');
        return;
      }
    }
    try {
      console.log('Updating user_profiles for', currentUser.id, 'with', updates);
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: currentUser.id, ...updates }, { onConflict: 'id' });
      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setXp(0);
    setStreak(0);
    setCompletedEras([]);
    setPreferredEra(null);
    setIsOnboarded(false);
    setPreferences(null);
  };

  const value: UserContextType = {
    user,
    xp,
    streak,
    addXp,
    incrementStreak,
    resetStreak,
    signOut,
    completedEras,
    preferredEra,
    setPreferredEra: setPreferredEraPreference,
    isOnboarded,
    preferences,
    updatePreferences,
    completeOnboarding
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
