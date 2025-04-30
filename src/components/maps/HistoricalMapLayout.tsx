import React from 'react';
import { Link } from 'react-router-dom';
import { HistoryEvent } from '@/types';
import MapContainer from './MapContainer';
import MapControls from './MapControls';
import EventTimeline from './EventTimeline';
import EventPopup from './event/EventPopup';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Home, Map } from 'lucide-react';

interface HistoricalMapLayoutProps {
  events: HistoryEvent[];
  selectedEvent: HistoryEvent | null;
  activeEventIndex: number;
  isPlaying: boolean;
  era: string;
  onEventClick: (event: HistoryEvent) => void;
  onPlayToggle: () => void;
  onNextEvent: () => void;
  onPrevEvent: () => void;
  onClosePopup: () => void;
}

const HistoricalMapLayout: React.FC<HistoricalMapLayoutProps> = ({
  events,
  selectedEvent,
  activeEventIndex,
  isPlaying,
  era,
  onEventClick,
  onPlayToggle,
  onNextEvent,
  onPrevEvent,
  onClosePopup
}) => {
  return (
    <div className="flex flex-col">
      {/* Navigation bar */}
      <div className="bg-white shadow-sm p-2 mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <Link to="/historical-map/list" className="mr-4">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Map className="h-4 w-4 mr-1" />
              All Maps
            </Button>
          </Link>
          {era && (
            <span className="text-sm font-medium">Current Map: {era}</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar with timeline */}
        <div className="lg:col-span-1">
          <EventTimeline 
            events={events} 
            activeEventIndex={activeEventIndex}
            onEventClick={onEventClick} 
          />
        </div>
        
        {/* Main map container */}
        <div className="lg:col-span-3 relative">
          <MapContainer 
            events={events}
            selectedEvent={selectedEvent}
            activeEventIndex={activeEventIndex}
            era={era}
            onEventClick={onEventClick}
          />
          
          {/* Map controls overlay */}
          <MapControls 
            isPlaying={isPlaying}
            onPlayToggle={onPlayToggle}
            onNextEvent={onNextEvent}
            onPrevEvent={onPrevEvent}
            canGoNext={activeEventIndex < events.length - 1}
            canGoPrev={activeEventIndex > 0}
          />
          
          {/* Event popup */}
          {selectedEvent && (
            <EventPopup 
              event={selectedEvent}
              onClose={onClosePopup}
            />
          )}
        </div>
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  );
};

export default HistoricalMapLayout;
