import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export interface RankingUser {
  id: string;
  username: string | null;
  email: string | null;
  xp: number;
  streak: number;
  completedEras: string[];
  avatarBase: string | null;
  avatarAccessories: any;
  rank: number;
}

export function useLeaderboard(type: 'xp' | 'streak') {
  const { user } = useUser();
  
  // Fetch leaderboard data
  const { data: rankings, isLoading, error } = useQuery({
    queryKey: ['leaderboard', type],
    queryFn: async (): Promise<RankingUser[]> => {
      const orderBy = type === 'xp' ? 'xp' : 'streak';
      
      console.log(`Fetching leaderboard data, ordering by ${orderBy}`);
      
      // Get all users ordered by the selected metric
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, email, xp, streak, completed_eras, avatar_base, avatar_accessories')
        .order(orderBy, { ascending: false })
        .limit(100);
        
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        throw new Error(`Failed to fetch leaderboard data: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.log('No leaderboard data found');
        return [];
      }
      
      console.log(`Found ${data.length} users for leaderboard`);
      
      return data.map((profile, index) => ({
        id: profile.id,
        username: profile.username || profile.email?.split('@')[0] || 'Anonymous User',
        email: profile.email,
        xp: profile.xp || 0,
        streak: profile.streak || 0,
        completedEras: profile.completed_eras || [],
        avatarBase: profile.avatar_base,
        avatarAccessories: profile.avatar_accessories,
        rank: index + 1
      }));
    },
    refetchOnWindowFocus: false
  });
  
  // Find the current user's ranking
  const userRanking = rankings?.find(ranking => ranking.id === user?.id) || null;
  
  useEffect(() => {
    console.log('Leaderboard Rankings:', rankings);
    console.log('Current User Ranking:', userRanking);
  }, [rankings, userRanking]);
  
  return {
    rankings: rankings || [],
    userRanking,
    isLoading,
    error
  };
}
