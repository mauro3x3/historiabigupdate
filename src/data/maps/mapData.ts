import { HistoryEvent, HistoryEra } from '@/types';
import { jewishMapData } from './mapData/jewishMapData';
import { ancientEgyptMapData } from './mapData/ancientEgyptMapData';
import { romeGreeceMapData } from './mapData/romeGreeceMapData';
import { christianMapData } from './mapData/christianMapData';
import { islamicMapData } from './mapData/islamicMapData';

interface MapData {
  era: HistoryEra;
  title: string;
  description: string;
  events: HistoryEvent[];
}

export const getHistoricalMapData = (era: string): MapData => {
  // Convert events with string years to compatible format
  const processMapData = (data: any): MapData => {
    return {
      ...data,
      events: data.events.map((event: any) => ({
        ...event,
        // Keep year as is since we updated HistoryEvent to accept string or number
      }))
    };
  };

  // For Christian map data, we'll use the direct source data and bypass localStorage
  // to ensure the Unsplash images are loaded correctly
  if (era === 'christian') {
    return processMapData(christianMapData);
  }

  // For other eras, check localStorage first and fall back to source data
  const storageKey = `mapData_${era}`;
  const storedData = localStorage.getItem(storageKey);
  
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error(`Error parsing stored map data for ${era}:`, error);
      // Fall back to source data if parsing fails
    }
  }

  switch (era) {
    case 'jewish':
      return processMapData(jewishMapData);
    case 'ancient-egypt':
      return processMapData(ancientEgyptMapData);
    case 'rome-greece':
      return processMapData(romeGreeceMapData);
    case 'islamic':
      return processMapData(islamicMapData);
    default:
      return {
        era: era as HistoryEra,
        title: 'Historical Map',
        description: 'Explore historical events',
        events: []
      };
  }
};
