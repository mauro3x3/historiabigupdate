
import { useState, useEffect } from 'react';
import { HistoryEvent } from '@/types';
import { getHistoricalMapData } from '@/data/maps/mapData';

interface UseHistoricalMapStateProps {
  era: string | undefined;
}

interface UseHistoricalMapStateReturn {
  events: HistoryEvent[];
  selectedEvent: HistoryEvent | null;
  activeEventIndex: number;
  isPlaying: boolean;
  setSelectedEvent: (event: HistoryEvent | null) => void;
  setActiveEventIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  handleEventClick: (event: HistoryEvent) => void;
  handlePlayToggle: () => void;
  handleNextEvent: () => void;
  handlePrevEvent: () => void;
}

export const useHistoricalMapState = ({ era }: UseHistoricalMapStateProps): UseHistoricalMapStateReturn => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  
  useEffect(() => {
    if (!era) return;
    
    // First try to load from localStorage to preserve any user changes (like images)
    const storageKey = `mapData_${era}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && Array.isArray(parsedData.events) && parsedData.events.length > 0) {
          console.log(`Loaded ${parsedData.events.length} events from localStorage for era: ${era}`);
          setEvents(parsedData.events);
          
          // Reset state when era changes
          setSelectedEvent(null);
          setIsPlaying(false);
          setActiveEventIndex(0);
          return;
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    }
    
    // Fall back to original data if localStorage data is not available or invalid
    const mapData = getHistoricalMapData(era);
    setEvents(mapData.events);
    
    // Save the original data to localStorage for future reference
    try {
      localStorage.setItem(storageKey, JSON.stringify(mapData));
      console.log(`Saved original data to localStorage for era: ${era}`);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    
    // Reset state when era changes
    setSelectedEvent(null);
    setIsPlaying(false);
    setActiveEventIndex(0);
  }, [era]);

  // Handle auto-play functionality
  useEffect(() => {
    if (!isPlaying || !events.length) return;
    
    const interval = setInterval(() => {
      setActiveEventIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= events.length) {
          setIsPlaying(false);
          return prevIndex;
        }
        setSelectedEvent(events[nextIndex]);
        return nextIndex;
      });
    }, 8000); // Changed from 5000 to 8000 ms (8 seconds) to slow down playback
    
    return () => clearInterval(interval);
  }, [isPlaying, events]);

  const handleEventClick = (event: HistoryEvent) => {
    setSelectedEvent(event);
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      setActiveEventIndex(index);
    }
  };

  const handlePlayToggle = () => {
    if (!isPlaying && events.length) {
      // If starting playback, continue from the current event
      setIsPlaying(true);
      if (!selectedEvent && activeEventIndex < events.length) {
        setSelectedEvent(events[activeEventIndex]);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextEvent = () => {
    if (activeEventIndex < events.length - 1) {
      const nextIndex = activeEventIndex + 1;
      setActiveEventIndex(nextIndex);
      setSelectedEvent(events[nextIndex]);
    }
  };

  const handlePrevEvent = () => {
    if (activeEventIndex > 0) {
      const prevIndex = activeEventIndex - 1;
      setActiveEventIndex(prevIndex);
      setSelectedEvent(events[prevIndex]);
    }
  };

  return {
    events,
    selectedEvent,
    activeEventIndex,
    isPlaying,
    setSelectedEvent,
    setActiveEventIndex,
    setIsPlaying,
    handleEventClick,
    handlePlayToggle,
    handleNextEvent,
    handlePrevEvent
  };
};
