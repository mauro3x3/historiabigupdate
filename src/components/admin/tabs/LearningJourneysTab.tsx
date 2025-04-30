
import React from 'react';
import { useLearningJourneys } from '@/hooks/useLearningJourneys';
import { JourneyForm, JourneyList, EditJourneyDialog } from '@/components/admin/learning-journeys';

const LearningJourneysTab = () => {
  const {
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
  } = useLearningJourneys();

  return (
    <div className="space-y-8">
      <JourneyForm onJourneyAdded={fetchJourneys} />
      
      <JourneyList 
        journeys={journeys}
        isLoading={isLoading}
        onEditJourney={handleEditJourney}
        onDeleteJourney={handleDeleteJourney}
      />
      
      <EditJourneyDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedJourney={selectedJourney}
        onJourneyChange={handleJourneyChange}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default LearningJourneysTab;
