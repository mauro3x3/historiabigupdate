
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface JourneyOption {
  id: number;
  name: string;
  era: string;
}

interface JourneySelectorProps {
  journeys: JourneyOption[];
  selectedJourney: number | null;
  onJourneyChange: (journeyId: number) => void;
}

const JourneySelector = ({ journeys, selectedJourney, onJourneyChange }: JourneySelectorProps) => {
  return (
    <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
      <Select
        value={selectedJourney?.toString() || ''}
        onValueChange={(value) => onJourneyChange(parseInt(value))}
      >
        <SelectTrigger className="w-full md:w-80">
          <SelectValue placeholder="Select a learning journey" />
        </SelectTrigger>
        <SelectContent>
          {journeys.map(journey => (
            <SelectItem key={journey.id} value={journey.id.toString()}>
              {journey.name} ({journey.era})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JourneySelector;
