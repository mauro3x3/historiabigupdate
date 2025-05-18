import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserFriends(userId: string | undefined) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFriends() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('friends')
          .select('friend_id, friend:user_profiles!friends_friend_id_fkey(*)')
          .eq('user_id', userId);
        
        if (error) throw error;
        setFriends(data || []);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, [userId]);

  return { friends, loading, error };
} 