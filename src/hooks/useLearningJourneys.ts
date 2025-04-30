
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { HistoryEra } from '@/types';
import { dbService } from '@/services/dbService';

interface Journey {
  id: number;
  title: string;
  description: string | null;
  type: string;
  era: HistoryEra;
  cover_image_url: string | null;
  level_names: string[];
  modules_count: number;
}

export const useLearningJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  
  useEffect(() => {
    fetchJourneys();
  }, []);
  
  const fetchJourneys = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_tracks')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        const journeysWithCounts = await Promise.all(data.map(async (track) => {
          // Use our service to get module counts
          const { count, error: countError } = await dbService.modules.countByJourneyId(track.id);
          
          if (countError) {
            console.error('Error fetching module count:', countError);
          }
          
          return {
            id: track.id,
            title: track.level_one_name || track.era,
            description: track.level_three_name || null,
            type: track.era,
            era: track.era as HistoryEra,
            cover_image_url: null,
            level_names: [
              track.level_one_name || 'Beginner',
              track.level_two_name || 'Intermediate',
              track.level_three_name || 'Advanced'
            ],
            modules_count: count || 0
          };
        }));
        
        setJourneys(journeysWithCounts);
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
      toast.error('Failed to load learning journeys');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditJourney = (journey: Journey) => {
    setSelectedJourney(journey);
    setIsEditDialogOpen(true);
  };
  
  const handleJourneyChange = (updatedJourney: Journey) => {
    setSelectedJourney(updatedJourney);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedJourney) return;
    
    try {
      const { error } = await supabase
        .from('learning_tracks')
        .update({
          level_one_name: selectedJourney.title,
          level_three_name: selectedJourney.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedJourney.id);
      
      if (error) throw error;
      
      toast.success('Journey updated successfully');
      setIsEditDialogOpen(false);
      fetchJourneys();
    } catch (error) {
      console.error('Error updating journey:', error);
      toast.error('Failed to update journey');
    }
  };
  
  const handleDeleteJourney = async (id: number) => {
    if (!confirm('Are you sure you want to delete this journey? This will also delete all modules and content associated with it.')) return;
    
    setIsLoading(true);
    try {
      // Using cascade delete with our foreign key constraints,
      // deleting the journey will automatically delete related modules
      const { error } = await supabase
        .from('learning_tracks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Learning journey deleted successfully');
      setJourneys(journeys.filter(journey => journey.id !== id));
    } catch (error) {
      console.error('Error deleting journey:', error);
      toast.error('Failed to delete learning journey');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    journeys,
    isLoading,
    selectedJourney,
    isEditDialogOpen,
    setIsEditDialogOpen,
    fetchJourneys,
    handleEditJourney,
    handleJourneyChange,
    handleSaveEdit,
    handleDeleteJourney
  };
};
