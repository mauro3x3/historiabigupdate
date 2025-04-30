import { useState } from 'react';
import { toast } from 'sonner';
import { dbService } from '@/services/dbService';

export const useModuleOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  
  const fetchModules = async (chapterId: number) => {
    setIsLoading(true);
    try {
      // Fetch modules by chapter_id directly
      const { data, error } = await dbService.modules.getByChapterId(chapterId);
      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteModule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    
    try {
      const { error } = await dbService.modules.delete(id);
      
      if (error) throw error;
      
      toast.success('Module deleted successfully');
      
      // Remove from local state
      setModules(modules.filter(module => module.id !== id));
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };
  
  return {
    modules,
    isLoading,
    setModules,
    fetchModules,
    handleDeleteModule
  };
};
