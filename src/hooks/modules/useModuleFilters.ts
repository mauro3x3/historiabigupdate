
import { useState, useCallback } from 'react';

// Simple hook to manage module filtering functionality if needed in the future
export const useModuleFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string | null>(null);
  const [journeyFilter, setJourneyFilter] = useState<boolean | null>(null);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setContentTypeFilter(null);
    setJourneyFilter(null);
  }, []);

  const applyFilters = useCallback((modules: any[]) => {
    return modules.filter(module => {
      // Apply search term filter
      const matchesSearch = !searchTerm || 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (module.description && module.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply content type filter
      const matchesContentType = !contentTypeFilter || 
        module.content_type === contentTypeFilter;
      
      // Apply journey filter
      const matchesJourney = journeyFilter === null || 
        module.is_journey_module === journeyFilter;
      
      return matchesSearch && matchesContentType && matchesJourney;
    });
  }, [searchTerm, contentTypeFilter, journeyFilter]);

  return {
    searchTerm,
    setSearchTerm,
    contentTypeFilter,
    setContentTypeFilter,
    journeyFilter,
    setJourneyFilter,
    clearFilters,
    applyFilters
  };
};
