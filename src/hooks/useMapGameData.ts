import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapGameEntry, asMapGame, asMapGameEntryArray } from '@/types/mapGame';

export function useMapGameData() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  
  // Fetch game details
  const { data: game, isLoading: isGameLoading } = useQuery({
    queryKey: ['mapGame', gameSlug],
    queryFn: async () => {
      if (!gameSlug) return null;
      const { data, error } = await supabase
        .from('map_games')
        .select('*')
        .eq('slug', gameSlug)
        .single();
      
      if (error) {
        console.error('Error fetching game:', error);
        return null;
      }
      
      return asMapGame(data);
    }
  });
  
  // Fetch game entries
  const { data: entries, isLoading: isEntriesLoading } = useQuery({
    queryKey: ['mapGameEntries', gameSlug],
    queryFn: async () => {
      if (!game || !game.id) return [];
      const { data, error } = await supabase
        .from('map_game_entries')
        .select('*')
        .eq('game_id', game.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching entries:', error);
        return [];
      }
      
      return asMapGameEntryArray(data || []);
    }
  });
  
  const isLoading = isGameLoading || isEntriesLoading;
  
  return {
    gameSlug,
    game,
    entries,
    isLoading
  };
}
