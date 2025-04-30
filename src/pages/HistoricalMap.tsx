
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import HistoricalMapHeader from '@/components/maps/HistoricalMapHeader';
import HistoricalMapLayout from '@/components/maps/HistoricalMapLayout';
import { useHistoricalMapState } from '@/components/maps/hooks/useHistoricalMapState';

const HistoricalMap = () => {
  const { era } = useParams<{ era: string }>();
  
  // Redirect to the list page if no era is provided or if era is "list"
  if (!era || era === 'list') {
    return <Navigate to="/historical-map/list" replace />;
  }
  
  const {
    events,
    selectedEvent,
    activeEventIndex,
    isPlaying,
    setSelectedEvent,
    handleEventClick,
    handlePlayToggle,
    handleNextEvent,
    handlePrevEvent
  } = useHistoricalMapState({ era });

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container mx-auto py-4 px-4">
        <HistoricalMapHeader era={era} />
        
        <HistoricalMapLayout 
          events={events}
          selectedEvent={selectedEvent}
          activeEventIndex={activeEventIndex}
          isPlaying={isPlaying}
          era={era || ''}
          onEventClick={handleEventClick}
          onPlayToggle={handlePlayToggle}
          onNextEvent={handleNextEvent}
          onPrevEvent={handlePrevEvent}
          onClosePopup={handleClosePopup}
        />
      </div>
    </div>
  );
};

export default HistoricalMap;
