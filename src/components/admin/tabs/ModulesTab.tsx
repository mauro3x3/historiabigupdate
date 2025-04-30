import React, { useState } from 'react';
import { useModules } from '@/hooks/modules'; // Updated import path
import JourneySelector from '../modules/JourneySelector';
import ChapterSelector from '../modules/ChapterSelector';
import ModuleForm from '../modules/module-form/ModuleForm';
import ModuleList from '../modules/ModuleList';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { dbService } from '@/services/dbService';

const ModulesTab = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  const {
    modules,
    chapters,
    journeys,
    selectedJourney,
    selectedChapter,
    isLoading,
    fetchModules,
    handleJourneyChange,
    handleChapterChange,
    handleDeleteModule,
    getJourneyNameById,
    getChapterNameById
  } = useModules();
  
  const handleModuleCreated = () => {
    if (selectedChapter) {
      fetchModules(selectedChapter);
    }
  };

  const handleEditModule = (moduleId: number) => {
    if (!user) {
      toast.error("You must be logged in to edit modules");
      return;
    }
    
    setSelectedModuleId(moduleId);
    
    // Add custom data to the URL so the era information is available when editing
    const currentModule = modules.find(m => m.id === moduleId);
    const journeyName = getJourneyNameById(selectedJourney);
    let eraCode = 'ancient-egypt';
    
    // Map journey names to era codes (customize this mapping based on your app's data)
    if (journeyName) {
      if (journeyName.toLowerCase().includes('jewish')) {
        eraCode = 'jewish';
      } else if (journeyName.toLowerCase().includes('egypt')) {
        eraCode = 'ancient-egypt';
      } else if (journeyName.toLowerCase().includes('roman') || journeyName.toLowerCase().includes('greece')) {
        eraCode = 'rome-greece';
      } else if (journeyName.toLowerCase().includes('medieval')) {
        eraCode = 'medieval';
      } else if (journeyName.toLowerCase().includes('modern')) {
        eraCode = 'modern';
      } else if (journeyName.toLowerCase().includes('islamic')) {
        eraCode = 'islamic';
      } else if (journeyName.toLowerCase().includes('christian')) {
        eraCode = 'christian';
      } else if (journeyName.toLowerCase().includes('china')) {
        eraCode = 'china';
      }
    }
    
    // Update the module with the era information
    if (currentModule) {
      dbService.modules.update(moduleId, { era: eraCode })
        .then(() => {
          console.log(`Updated module ${moduleId} with era ${eraCode}`);
        })
        .catch(error => {
          console.error("Failed to update module era:", error);
        });
    }
    
    // Navigate to the content editor tab with the module ID as a parameter
    navigate(`/admin?tab=editor&module=${moduleId}&era=${eraCode}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <JourneySelector 
          journeys={journeys}
          selectedJourney={selectedJourney}
          onJourneyChange={handleJourneyChange}
        />
        
        <ChapterSelector 
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterChange={handleChapterChange}
          isLoading={isLoading && selectedJourney !== null && chapters.length === 0}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ModuleForm 
          journeys={journeys}
          chapters={chapters}
          selectedJourney={selectedJourney}
          selectedChapter={selectedChapter}
          modules={modules}
          onModuleCreated={handleModuleCreated}
        />
        
        <div className="lg:col-span-2">
          <ModuleList 
            modules={modules}
            isLoading={isLoading && selectedChapter !== null}
            journeyName={getJourneyNameById(selectedJourney)}
            chapterName={getChapterNameById(selectedChapter)}
            onDeleteModule={handleDeleteModule}
            onEditModule={handleEditModule}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulesTab;
