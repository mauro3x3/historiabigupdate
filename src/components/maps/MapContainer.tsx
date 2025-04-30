
import React, { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HistoryEvent } from '@/types';
import MapTokenInput from './MapTokenInput';
import MapError from './MapError';
import { useMapState } from './hooks/useMapState';

interface MapContainerProps {
  events: HistoryEvent[];
  selectedEvent: HistoryEvent | null;
  activeEventIndex: number;
  era: string;
  onEventClick: (event: HistoryEvent) => void;
}

const MapContainer = ({ 
  events, 
  selectedEvent, 
  activeEventIndex, 
  era, 
  onEventClick 
}: MapContainerProps) => {
  const { 
    mapContainer, 
    mapError, 
    needsToken, 
    setNeedsToken, 
    handleTokenSubmit 
  } = useMapState({
    events,
    era,
    activeEventIndex,
    selectedEvent,
    onEventClick
  });

  useEffect(() => {
    // Add a global handler for image loading errors
    const handleGlobalImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        console.log('Image failed to load:', target.src);
        
        // Skip if the image already has a placeholder URL
        if (target.src.includes('placehold.co')) return;
        
        // Get alt text if any to use in placeholder
        const altText = target.alt || 'Image Not Available';
        
        // Fallback to a placeholder
        target.onerror = null; // Prevent infinite loop
        target.src = `https://placehold.co/600x400?text=${encodeURIComponent(altText)}`;
      }
    };

    // Add event listener
    window.addEventListener('error', handleGlobalImageError, true);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalImageError, true);
    };
  }, []);

  if (needsToken) {
    return (
      <div className="h-[600px] rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
        <MapTokenInput onTokenSubmit={handleTokenSubmit} error={mapError || undefined} />
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      <div ref={mapContainer} className="w-full h-full" />
      {mapError && !needsToken && (
        <MapError error={mapError} onRequestToken={() => setNeedsToken(true)} />
      )}
    </div>
  );
};

export default MapContainer;
