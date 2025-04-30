
import { useState, useEffect } from 'react';
import { HistoryEra } from '@/types';
import { useFetchTrackData } from './useFetchTrackData';
import { useTrackConfigManager } from './useTrackConfigManager';
import { UseTrackLessonsResult } from './types';

export const useTrackLessonsManagement = (era: HistoryEra): UseTrackLessonsResult => {
  const { isLoading, lessons, setLessons, availableLevels, fetchLevelsAndLessons } = useFetchTrackData(era);
  const { isSaving, saveTrackConfiguration, getLessonCountByLevel } = useTrackConfigManager(lessons, setLessons);
  
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchLevelsAndLessons();
  }, [era, fetchLevelsAndLessons]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedLevel(Number(value));
  };

  return {
    lessons,
    setLessons,
    isLoading,
    selectedLevel,
    availableLevels,
    activeTab,
    searchTerm,
    isSaving,
    fetchLevelsAndLessons,
    handleTabChange,
    setSearchTerm,
    getLessonCountByLevel,
    saveTrackConfiguration
  };
};
