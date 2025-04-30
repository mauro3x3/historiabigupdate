
import React from 'react';
import { GraduationCapIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpenIcon } from 'lucide-react';
import JourneyCard from './JourneyCard';
import { HistoryEra } from '@/types';

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

interface JourneyListProps {
  journeys: Journey[];
  isLoading: boolean;
  onEditJourney: (journey: Journey) => void;
  onDeleteJourney: (id: number) => void;
}

const JourneyList = ({ journeys, isLoading, onEditJourney, onDeleteJourney }: JourneyListProps) => {
  if (journeys.length === 0 && !isLoading) {
    return (
      <div className="bg-white border rounded-md p-6 text-center">
        <GraduationCapIcon size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No learning journeys found. Create your first one above.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Your Learning Journeys</h3>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800 flex items-center">
          <BookOpenIcon size={16} className="mr-2" />
          Click on "Manage Modules" for a journey to add learning content to that journey.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journeys.map(journey => (
          <JourneyCard 
            key={journey.id} 
            journey={journey} 
            onEdit={onEditJourney} 
            onDelete={onDeleteJourney}
          />
        ))}
      </div>
    </div>
  );
};

export default JourneyList;
