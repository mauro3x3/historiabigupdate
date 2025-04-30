
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { HistoryEvent } from '@/types';

interface EventDetailsProps {
  event: HistoryEvent;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Calendar className="h-4 w-4" />
        <span>{event.year}</span>
        
        <MapPin className="h-4 w-4 ml-2" />
        <span>{event.location}</span>
      </div>
      
      <div className="text-sm text-gray-700 my-3">
        {event.description}
      </div>
      
      {event.significance && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <h4 className="font-semibold mb-1">Historical Significance</h4>
          <p>{event.significance}</p>
        </div>
      )}
    </>
  );
};

export default EventDetails;
