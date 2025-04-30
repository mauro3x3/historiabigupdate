
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapGameEntry, asMapGame, asMapGameEntryArray } from '@/types/mapGame';

export function useMapGameData() {
  const { gameId } = useParams<{ gameId: string }>();
  
  // Fetch game details
  const { data: game, isLoading: isGameLoading } = useQuery({
    queryKey: ['mapGame', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const { data, error } = await supabase
        .from('map_games')
        .select('*')
        .eq('id', gameId)
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
    queryKey: ['mapGameEntries', gameId],
    queryFn: async () => {
      if (!gameId) return [];
      const { data, error } = await supabase
        .from('map_game_entries')
        .select('*')
        .eq('game_id', gameId)
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
    gameId,
    game,
    entries,
    isLoading
  };
}
