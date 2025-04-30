
import { useEffect } from 'react';
import { useJourneyChapterSelection } from './useJourneyChapterSelection';
import { useModuleOperations } from './useModuleOperations';
import { useModuleFilters } from './useModuleFilters';

// Main hook that combines the smaller hooks for complete module management
export const useModules = () => {
  const {
    chapters,
    journeys,
    selectedJourney,
    selectedChapter,
    isLoading: selectionLoading,
    fetchChapters,
    handleJourneyChange,
    handleChapterChange,
    getJourneyNameById,
    getChapterNameById
  } = useJourneyChapterSelection();
  
  const {
    modules,
    isLoading: moduleLoading,
    fetchModules,
    handleDeleteModule
  } = useModuleOperations();
  
  const {
    searchTerm,
    setSearchTerm,
    clearFilters,
    applyFilters
  } = useModuleFilters();
  
  // Fetch modules when the selected chapter changes
  useEffect(() => {
    if (selectedChapter) {
      fetchModules(selectedChapter);
    }
  }, [selectedChapter]);
  
  // Combine loading states
  const isLoading = selectionLoading || moduleLoading;
  
  // Filter modules based on search term and other filters
  const filteredModules = applyFilters(modules);
  
  return {
    // From useJourneyChapterSelection
    chapters,
    journeys,
    selectedJourney,
    selectedChapter,
    handleJourneyChange,
    handleChapterChange,
    getJourneyNameById,
    getChapterNameById,
    
    // From useModuleOperations
    modules: filteredModules,
    fetchModules,
    handleDeleteModule,
    
    // From useModuleFilters
    searchTerm,
    setSearchTerm,
    clearFilters,
    
    // Combined state
    isLoading
  };
};
