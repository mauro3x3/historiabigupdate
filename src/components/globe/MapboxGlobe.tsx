import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../../config/mapbox';

interface Module {
  id: string;
  title: string;
  completed: boolean;
  journey_id: string;
  latitude?: number;
  longitude?: number;
  date?: string; // Format: "1420-10-08" or "October 8, 1420"
  year?: number;
  month?: number;
  day?: number;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface MapboxGlobeProps {
  journeys: Journey[];
  onModuleClick?: (module: Module) => void;
  userContent: any[];
  showOfficialModules: boolean;
  showUserContent: boolean;
  showOnlyTodaysContent: boolean;
  onUserContentClick: (content: any) => void;
  onMapClick: (coordinates: [number, number]) => void;
  mapStyle: string;
  isLoadingTexture: boolean;
  globeTexture: string | null;
  // Calendar mode props
  calendarMode: boolean;
  selectedDate: string; // Format: "1420-10-08"
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
}

const MapboxGlobe: React.FC<MapboxGlobeProps> = ({
  journeys,
  onModuleClick,
  userContent,
  showOfficialModules,
  showUserContent,
  showOnlyTodaysContent,
  onUserContentClick,
  onMapClick,
  mapStyle,
  isLoadingTexture,
  globeTexture,
  calendarMode,
  selectedDate,
  selectedYear,
  selectedMonth,
  selectedDay
}) => {
  // Function to get color based on category - all user content is blue
  const getCategoryColor = (category: string) => {
    return '#4A90E2'; // Blue for all user content to match official modules
  };
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      center: [0, 0],
      zoom: 1.5,
      pitch: 0,
      bearing: 0
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      console.log('Mapbox globe loaded successfully');
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onMapClick([lng, lat]);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for modules
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.module-marker, .test-marker, .user-content-marker');
    existingMarkers.forEach(marker => marker.remove());

    console.log('🗺️ MapboxGlobe: Adding markers for', journeys.length, 'journeys');
    console.log('🗺️ MapboxGlobe: Total modules to show:', journeys.reduce((sum, j) => sum + j.modules.length, 0));

    // Add module markers
    journeys.forEach(journey => {
      journey.modules.forEach(module => {
        if (!showOfficialModules) return;

        console.log('🗺️ Adding marker for module:', module.title, 'at', module.latitude, module.longitude);

        // Create a simple marker
        const marker = document.createElement('div');
        marker.className = 'module-marker';
        marker.style.width = '10px';
        marker.style.height = '10px';
        marker.style.borderRadius = '50%';
        marker.style.backgroundColor = module.completed ? '#FFD700' : '#4A90E2';
        marker.style.cursor = 'pointer';
        marker.style.border = '2px solid white';
        marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Add click handler
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onModuleClick) {
            onModuleClick(module);
          }
        });

        // Use actual module coordinates if available, otherwise use random
        const lng = module.longitude || (Math.random() - 0.5) * 360;
        const lat = module.latitude || (Math.random() - 0.5) * 180;

        new mapboxgl.Marker(marker)
          .setLngLat([lng, lat])
          .addTo(map.current!);
      });
    });

    // Add user content markers
    if (showUserContent && userContent) {
      console.log('🗺️ MapboxGlobe: Adding user content markers:', userContent.length);
      
      userContent
        .filter(content => {
          // Validate coordinates before adding to map
          const [lng, lat] = content.coordinates;
          const isValidLat = typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
          const isValidLng = typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
          
          if (!isValidLat || !isValidLng) {
            console.warn('🗺️ MapboxGlobe: Skipping invalid coordinates:', content.title, 'coords:', content.coordinates);
            return false;
          }
          return true;
        })
        .forEach(content => {
          console.log('🗺️ Adding user content marker:', content.title, 'at', content.coordinates);

          // Create a marker for user content
          const marker = document.createElement('div');
          marker.className = 'user-content-marker';
          marker.style.width = '12px';
          marker.style.height = '12px';
          marker.style.borderRadius = '50%';
          marker.style.backgroundColor = getCategoryColor(content.category);
          marker.style.cursor = 'pointer';
          marker.style.border = '2px solid white';
          marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

          // Add click handler
          marker.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onUserContentClick) {
              onUserContentClick(content);
            }
          });

          // Use content coordinates
          const lng = content.coordinates[0];
          const lat = content.coordinates[1];

          new mapboxgl.Marker(marker)
            .setLngLat([lng, lat])
            .addTo(map.current!);
        });
    }

  }, [journeys, showOfficialModules, showUserContent, userContent, isLoaded, onModuleClick, onUserContentClick, calendarMode, selectedYear, selectedMonth, selectedDay]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default MapboxGlobe;
