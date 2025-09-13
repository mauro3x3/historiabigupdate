import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HistoryEra } from '@/types';
import { toast } from 'sonner';

export const useUserProfile = (userId: string | undefined) => {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedEras, setCompletedEras] = useState<string[]>([]);
  const [preferredEra, setPreferredEra] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [avatarBase, setAvatarBase] = useState<string>('mascot');
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to get the most recent record, handling duplicates
      let profileData, profileError;
      
      try {
        // First try with .single() for efficiency
        const result = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        profileData = result.data;
        profileError = result.error;
      } catch (singleError) {
        // If .single() fails due to multiple rows, use limit(1) with ordering
        const result = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        profileData = result.data;
        profileError = result.error;
      }

      if (profileError) {
        throw profileError;
      }

      // Handle both single record and array responses
      const userProfile = Array.isArray(profileData) ? profileData[0] : profileData;
      
      if (userProfile) {
        console.log('✅ Setting profile data for user:', userId, userProfile);
        console.log('📋 Profile data details:', {
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          avatar_base: userProfile.avatar_base
        });
        setXp(userProfile.xp || 0);
        setStreak(userProfile.streak || 0);
        setCompletedEras(userProfile.completed_eras || []);
        setPreferredEra(userProfile.preferred_era || null);
        setUsername(userProfile.username || '');
        setAvatarBase(userProfile.avatar_base || 'mascot');
        setCreatedAt(userProfile.created_at || null);
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  // Expose a refetch function
  const refetchProfile = () => {
    if (userId) {
      fetchUserProfile(userId);
    }
  };

  const addXp = async (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);
    
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            xp: newXp,
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving XP:', error);
        toast.error('Failed to save XP');
      }
    }
  };

  const incrementStreak = async (amount: number = 1) => {
    const newStreak = streak + amount;
    setStreak(newStreak);
    
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            streak: newStreak, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving streak:', error);
        toast.error('Failed to save streak');
      }
    }
  };

  const completeEra = async (era: HistoryEra) => {
    if (completedEras.includes(era)) {
      return;
    }

    const newCompletedEras = [...completedEras, era];
    setCompletedEras(newCompletedEras);

    if (userId) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            completed_eras: newCompletedEras,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
        toast.success(`Completed the ${era} era!`);
      } catch (error) {
        console.error('Error saving completed era:', error);
        toast.error('Failed to save completed era');
      }
    }
  };

  const handleSetPreferredEra = async (era: HistoryEra | null) => {
    setPreferredEra(era);

    if (userId) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            preferred_era: era,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
        toast.success(era ? `Set ${era} as your preferred era` : 'Cleared preferred era');
      } catch (error) {
        console.error('Error saving preferred era:', error);
        toast.error('Failed to save preferred era');
      }
    }
  };

  return {
    xp,
    streak,
    completedEras,
    preferredEra,
    username,
    avatar_base: avatarBase,
    featured_eras: [],
    badges: [],
    achievements: [],
    created_at: createdAt,
    fetchUserProfile,
    refetchProfile,
    addXp,
    incrementStreak,
    completeEra,
    setPreferredEra: handleSetPreferredEra
  };
};
