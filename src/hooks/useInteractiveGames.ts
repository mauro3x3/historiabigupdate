import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InteractiveQuestion {
  id: string;
  uuid: string;
  type: string;
  prompt: string;
  options: string;
  correct_answers: string;
  left_zone_label: string;
  middle_zone_label?: string;
  right_zone_label: string;
  topic_tag: string;
  inserted_at: string;
}

export function useInteractiveGames() {
  const [games, setGames] = useState<InteractiveQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('interactive_questions')
          .select('*')
          .order('inserted_at', { ascending: false });
        
        if (error) throw error;
        setGames(data || []);
      } catch (err) {
        console.error('Error fetching interactive games:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch games');
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  return { games, loading, error };
}
