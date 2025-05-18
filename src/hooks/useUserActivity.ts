import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserActivity(userId: string | undefined) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        setActivity(data || []);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activity');
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [userId]);

  return { activity, loading, error };
} 