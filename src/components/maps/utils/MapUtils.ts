
import mapboxgl from 'mapbox-gl';
import { HistoryEvent } from '@/types';

export interface MapboxError extends Error {
  status?: number;
}

export const drawRouteOnMap = (map: mapboxgl.Map, events: HistoryEvent[], routeLayerId: string): void => {
  if (!map || events.length < 2) return;
  
  // Check if the map style has finished loading
  if (!map.isStyleLoaded()) {
    console.log('Map style not loaded yet, waiting for style.load event');
    map.once('style.load', () => {
      drawRouteOnMap(map, events, routeLayerId);
    });
    return;
  }

  console.log('Drawing route on map');
  
  // Remove existing layer and source if they exist
  if (map.getLayer(routeLayerId)) {
    map.removeLayer(routeLayerId);
  }
  if (map.getSource(routeLayerId)) {
    map.removeSource(routeLayerId);
  }

  const routeGeoJSON = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: events.map(event => [event.longitude, event.latitude])
    }
  };

  try {
    map.addSource(routeLayerId, {
      type: 'geojson',
      data: routeGeoJSON as any
    });

    map.addLayer({
      id: routeLayerId,
      type: 'line',
      source: routeLayerId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#8b5cf6',
        'line-width': 3,
        'line-dasharray': [2, 1]
      }
    });
    console.log('Route drawn successfully');
  } catch (error) {
    console.error('Error drawing route:', error);
  }
};

export const createMarkerElement = (index: number, isActive: boolean): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = `map-marker ${isActive ? 'active' : ''}`;
  markerElement.innerHTML = `
    <div class="map-marker-inner flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border-2 border-timelingo-purple text-lg">
      ${index + 1}
    </div>
  `;
  return markerElement;
};

export const initializeMapbox = (
  container: HTMLDivElement, 
  initialCenter: [number, number],
  initialZoom: number,
  projection: mapboxgl.ProjectionSpecification
): mapboxgl.Map => {
  console.log('Initializing mapbox with token:', mapboxgl.accessToken ? 'Token set' : 'No token');
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: initialCenter,
    zoom: initialZoom,
    projection,
  });
};
