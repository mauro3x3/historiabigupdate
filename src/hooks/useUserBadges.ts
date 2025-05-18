import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserBadges(userId: string | undefined) {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', userId);
        
        if (error) throw error;
        setBadges(data || []);
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch badges');
      } finally {
        setLoading(false);
      }
    }
    fetchBadges();
  }, [userId]);

  return { badges, loading, error };
} 