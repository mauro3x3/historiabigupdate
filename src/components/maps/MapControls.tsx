
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

interface MapControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNextEvent: () => void;
  onPrevEvent: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

const MapControls = ({ 
  isPlaying, 
  onPlayToggle, 
  onNextEvent, 
  onPrevEvent,
  canGoNext,
  canGoPrev
}: MapControlsProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-1 z-10 flex items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPrevEvent} 
        disabled={!canGoPrev}
        className={`rounded-full ${!canGoPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous Event</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPlayToggle}
        className="bg-timelingo-purple text-white hover:bg-timelingo-purple/90 rounded-full mx-2"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
        <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onNextEvent} 
        disabled={!canGoNext}
        className={`rounded-full ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next Event</span>
      </Button>
    </div>
  );
};

export default MapControls;
