import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { HistoryEvent } from '@/types';
import { getEraMapConfig } from '@/data/maps/mapConfig';
import { MapboxError, createMarkerElement, drawRouteOnMap, initializeMapbox } from '../utils/MapUtils';

// Permanent Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoibWF1cm9ramFlcjEyMyIsImEiOiJjbTh5dmt1aXAwNG0yMmpyeTdwbTJiMXVuIn0.rMZrAGudtcbignhhBK65rQ";

interface UseMapStateProps {
  events: HistoryEvent[];
  era: string;
  activeEventIndex: number;
  selectedEvent: HistoryEvent | null;
  onEventClick: (event: HistoryEvent) => void;
}

interface UseMapStateReturn {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapError: string | null;
  needsToken: boolean;
  setNeedsToken: React.Dispatch<React.SetStateAction<boolean>>;
  handleTokenSubmit: () => void;
}

export const useMapState = ({
  events,
  era,
  activeEventIndex,
  selectedEvent,
  onEventClick,
}: UseMapStateProps): UseMapStateReturn => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [needsToken, setNeedsToken] = useState(false);
  const routeLayerId = 'route-layer';

  // Check for stored token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      try {
        mapboxgl.accessToken = storedToken;
        setNeedsToken(false);
      } catch (error) {
        console.error('Error setting Mapbox token:', error);
        // Fall back to default token
        try {
          mapboxgl.accessToken = MAPBOX_TOKEN;
          localStorage.setItem('mapbox_token', MAPBOX_TOKEN);
          setNeedsToken(false);
        } catch (fallbackError) {
          console.error('Error setting default Mapbox token:', fallbackError);
          setNeedsToken(true);
        }
      }
    } else {
      // If no token is stored, use the default token
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        localStorage.setItem('mapbox_token', MAPBOX_TOKEN);
        setNeedsToken(false);
      } catch (error) {
        console.error('Error setting default Mapbox token:', error);
        setNeedsToken(true);
      }
    }
  }, []);

  // Initialize map when container is ready and token is available
  useEffect(() => {
    if (mapContainer.current && !map.current && mapboxgl.accessToken && !needsToken) {
      const mapConfig = getEraMapConfig(era);
      
      try {
        map.current = initializeMapbox(
          mapContainer.current,
          mapConfig.initialCenter,
          mapConfig.initialZoom,
          mapConfig.projection
        );

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setMapReady(true);
          setMapError(null);
          
          // Only try to add markers and draw route after the map is fully loaded
          if (events.length > 0) {
            clearMarkers();
            addMarkers();
            drawRouteOnMap(map.current!, events, routeLayerId);
          }
        });

        map.current.on('error', (e: { error?: MapboxError }) => {
          console.error('Map error:', e);
          
          if (e.error && e.error.message && 
              (e.error.message.includes('access token') || 
               (e.error.status === 401))) {
            setNeedsToken(true);
            setMapError('Invalid Mapbox access token. Please provide a valid token.');
            
            if (map.current) {
              map.current.remove();
              map.current = null;
            }
          } else {
            setMapError('Failed to load map. Please try again.');
          }
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setMapError('Failed to initialize map');
      }
    }

    return () => {
      if (map.current) {
        clearMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, [era, needsToken]);

  // Update markers and route when events or active index changes
  useEffect(() => {
    if (mapReady && map.current && events.length > 0) {
      console.log('Updating map markers and route');
      clearMarkers();
      addMarkers();
      
      // Only attempt to draw route if map is fully loaded
      map.current.once('idle', () => {
        drawRouteOnMap(map.current!, events, routeLayerId);
      });
    }
  }, [mapReady, events, activeEventIndex]);

  // Handle selected event changes
  useEffect(() => {
    if (!map.current || !mapReady || !selectedEvent) return;
    
    map.current.flyTo({
      center: [selectedEvent.longitude, selectedEvent.latitude],
      zoom: 8,
      duration: 1500
    });
  }, [selectedEvent, mapReady]);

  const handleTokenSubmit = () => {
    setNeedsToken(false);
    setMapError(null);
  };

  const clearMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    }
    
    if (map.current?.getLayer(routeLayerId)) {
      map.current.removeLayer(routeLayerId);
    }
    
    if (map.current?.getSource(routeLayerId)) {
      map.current.removeSource(routeLayerId);
    }
  };

  const addMarkers = () => {
    if (!map.current) return;
    
    events.forEach((event, index) => {
      const markerElement = createMarkerElement(index, index <= activeEventIndex);
      
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current!);
        
      markerElement.addEventListener('click', () => {
        onEventClick(event);
      });
      
      markersRef.current.push(marker);
    });
  };

  return {
    mapContainer,
    mapError,
    needsToken,
    setNeedsToken,
    handleTokenSubmit
  };
};
