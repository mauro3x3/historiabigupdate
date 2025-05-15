import { HistoryEvent, HistoryEra } from '@/types';
import { jewishMapData } from './mapData/jewishMapData';
import { ancientEgyptMapData } from './mapData/ancientEgyptMapData';
import { romeGreeceMapData } from './mapData/romeGreeceMapData';
import { christianMapData } from './mapData/christianMapData';
import { islamicMapData } from './mapData/islamicMapData';
import { supabase } from '@/integrations/supabase/client';

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

export const getHistoricalMapDataWithImages = async (era: string): Promise<MapData> => {
  // Get the base map data (with hardcoded imageUrls)
  const baseData = getHistoricalMapData(era);
  // Fetch all images for this era from Supabase
  const { data: dbImages, error } = await supabase
    .from('map_images')
    .select('*')
    .eq('era', era);
  if (error) {
    console.error('Error fetching map_images:', error);
    return baseData;
  }
  // Build a lookup by event_key
  const imageMap = new Map<string, string>();
  dbImages?.forEach(img => {
    if (img.event_key && img.image_url) {
      imageMap.set(img.event_key, img.image_url);
    }
  });
  // Replace event imageUrls if found in db
  const events = baseData.events.map(event => {
    const dbImageUrl = imageMap.get(event.id);
    return dbImageUrl ? { ...event, imageUrl: dbImageUrl } : event;
  });
  return { ...baseData, events };
};
