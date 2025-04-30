
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HistoryEra } from '@/types';
import { generateTrackForEra } from '@/data/tracks/generateTrack';

interface TrackLevel {
  id: string;
  name: string;
}

export const useTrackManagement = (initialEra: HistoryEra | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewTrack, setPreviewTrack] = useState<any>(null);
  const [trackLevels, setTrackLevels] = useState<TrackLevel[]>([
    { id: '1', name: 'Beginner' },
    { id: '2', name: 'Intermediate' },
    { id: '3', name: 'Advanced' }
  ]);
  const [currentEra, setCurrentEra] = useState<HistoryEra | null>(initialEra);
  const [availableEras, setAvailableEras] = useState<{code: string, name: string}[]>([]);
  
  useEffect(() => {
    fetchAvailableEras();
  }, []);

  useEffect(() => {
    if (currentEra) {
      loadTrackConfiguration(currentEra);
    }
  }, [currentEra]);

  const fetchAvailableEras = async () => {
    try {
      const { data, error } = await supabase
        .from('history_eras')
        .select('code, name')
        .order('name');
      
      if (data && !error) {
        setAvailableEras(data);
      }
    } catch (error) {
      console.error("Error fetching eras:", error);
    }
  };
  
  const loadTrackConfiguration = async (era: HistoryEra) => {
    try {
      const { data: trackConfig, error } = await supabase
        .from('learning_tracks')
        .select('*')
        .eq('era', era)
        .maybeSingle();
      
      const track = await generateTrackForEra(era);
      setPreviewTrack(track);
      
      if (trackConfig && !error) {
        const dbLevels: TrackLevel[] = [];
        
        if (trackConfig.level_one_name) {
          dbLevels.push({ id: '1', name: trackConfig.level_one_name });
        }
        if (trackConfig.level_two_name) {
          dbLevels.push({ id: '2', name: trackConfig.level_two_name });
        }
        if (trackConfig.level_three_name) {
          dbLevels.push({ id: '3', name: trackConfig.level_three_name });
        }
        
        const additionalLevelsData = trackConfig.levels ? 
          (typeof trackConfig.levels === 'string' ? 
            JSON.parse(trackConfig.levels) : trackConfig.levels) : [];
        
        if (Array.isArray(additionalLevelsData)) {
          const additionalLevels = additionalLevelsData.slice(dbLevels.length);
          additionalLevels.forEach((level, index) => {
            dbLevels.push({
              id: String(dbLevels.length + 1),
              name: level.name
            });
          });
        }
        
        if (dbLevels.length > 0) {
          setTrackLevels(dbLevels);
        }
      } else {
        try {
          const levelNames = track.levels.map(level => level.title);
          if (levelNames.length > 0) {
            const newLevels = levelNames.map((name, index) => ({
              id: String(index + 1),
              name: name || `Level ${index + 1}`
            }));
            setTrackLevels(newLevels);
          }
        } catch (error) {
          console.error("Error setting form values from track:", error);
        }
      }
    } catch (error) {
      console.error("Error loading track configuration:", error);
    }
  };

  const handleEraChange = (era: HistoryEra) => {
    setCurrentEra(era);
  };
  
  const addNewLevel = () => {
    setTrackLevels([
      ...trackLevels,
      { id: String(trackLevels.length + 1), name: `Level ${trackLevels.length + 1}` }
    ]);
  };
  
  const removeLevel = (indexToRemove: number) => {
    if (trackLevels.length <= 1) {
      toast.error("You must have at least one level");
      return;
    }
    
    const updatedLevels = trackLevels.filter((_, index) => index !== indexToRemove);
    const renumberedLevels = updatedLevels.map((level, index) => ({
      ...level,
      id: String(index + 1)
    }));
    setTrackLevels(renumberedLevels);
  };
  
  const updateLevelName = (index: number, newName: string) => {
    const updatedLevels = [...trackLevels];
    updatedLevels[index].name = newName;
    setTrackLevels(updatedLevels);
  };
  
  const handleBulkLevelsCreated = (newLevels: TrackLevel[]) => {
    if (newLevels.length === 0) return;
    
    setTrackLevels(newLevels);
    toast.success(`Added ${newLevels.length} levels to the track`);
  };

  const saveTrackConfiguration = async (era: HistoryEra) => {
    setIsLoading(true);
    try {
      const trackData = {
        era,
        level_one_name: trackLevels[0]?.name || 'Beginner',
        level_two_name: trackLevels[1]?.name || 'Intermediate',
        level_three_name: trackLevels[2]?.name || 'Advanced',
        levels: JSON.stringify(trackLevels.map((level) => ({
          id: level.id,
          name: level.name
        }))),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('learning_tracks')
        .upsert(trackData, {
          onConflict: 'era'
        });
      
      if (error) throw error;
      
      toast.success('Track configuration saved successfully');
    } catch (error) {
      console.error("Error saving track configuration:", error);
      toast.error('Failed to save track configuration');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    previewTrack,
    trackLevels,
    currentEra,
    availableEras,
    fetchAvailableEras,
    handleEraChange,
    addNewLevel,
    removeLevel,
    updateLevelName,
    handleBulkLevelsCreated,
    saveTrackConfiguration
  };
};
