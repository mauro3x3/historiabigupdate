import React from 'react';
import SimpleGlobe from './SimpleGlobe';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  journey_id: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  summary?: string;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface GlobeProps {
  journeys: Journey[];
  onModuleClick?: (module: Module) => void;
}

export default function GlobeComponent({ journeys, onModuleClick }: GlobeProps) {
  // Debug what we're receiving
  console.log('🔍 Globe: Received journeys:', journeys);
  console.log('🔍 Globe: Journey count:', journeys?.length || 0);
  console.log('🔍 Globe: Journey IDs:', journeys?.map(j => j.id) || []);
  console.log('🔍 Globe: Total modules:', journeys?.reduce((sum, j) => sum + j.modules.length, 0) || 0);
  console.log('🔍 Globe: Filtered journeys should be empty if all deselected:', journeys?.length === 0);
  
  // Debug module data structure
  if (journeys && journeys.length > 0) {
    const firstJourney = journeys[0];
    const firstModule = firstJourney.modules[0];
    console.log('🔍 Globe: Sample module data structure:', {
      journeyId: firstJourney.id,
      journeyTitle: firstJourney.title,
      moduleId: firstModule?.id,
      moduleTitle: firstModule?.title,
      moduleLat: firstModule?.latitude,
      moduleLng: firstModule?.longitude,
      moduleCompleted: firstModule?.completed,
      moduleJourneyId: firstModule?.journey_id
    });
  }
  
  // If onModuleClick is provided, use it. Otherwise, navigate.
  const navigate = useNavigate();
  const handlePointClick = (module: Module) => {
    if (onModuleClick) {
      onModuleClick(module);
    } else if (module.id) {
      navigate(`/lesson/${module.id}`);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SimpleGlobe 
        journeys={journeys} 
        onModuleClick={handlePointClick}
        userContent={[]}
        showOfficialModules={true}
        showUserContent={false}
        showOnlyTodaysContent={false}
        onUserContentClick={() => {}}
        onMapClick={() => {}}
        mapStyle="satellite"
        isLoadingTexture={false}
        globeTexture={null}
      />
    </div>
  );
} 