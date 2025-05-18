import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<any[]>([]);
  useEffect(() => {
    async function fetchAchievements() {
      if (!userId) return;
      const { data } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', userId);
      setAchievements(data || []);
    }
    fetchAchievements();
  }, [userId]);
  return achievements;
} 