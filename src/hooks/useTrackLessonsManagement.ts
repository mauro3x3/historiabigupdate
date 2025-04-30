
// This file now directly exports the implementations instead of re-exporting
import { useState, useEffect } from 'react';
import { HistoryEra } from '@/types';
import { useFetchTrackData } from './track-lessons/useFetchTrackData';
import { useTrackConfigManager } from './track-lessons/useTrackConfigManager';
import { UseTrackLessonsResult } from './track-lessons/types';

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

// Also export the form logic hooks directly for convenience
export { useStandardLessonFormLogic } from './track-lessons/useStandardLessonFormLogic';
export { useStorytellingFormLogic } from './track-lessons/useStorytellingFormLogic';
