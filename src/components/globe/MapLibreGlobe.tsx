import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import AddContentModal, { UserGeneratedContent } from './AddContentModal';
import UserContentModal from './UserContentModal';

interface Module {
  id: string;
  title: string;
  journey_id: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  summary?: string;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface MapLibreGlobeProps {
  journeys: Journey[];
  onModuleClick?: (module: Module) => void;
}

export default function MapLibreGlobe({ journeys, onModuleClick }: MapLibreGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const mapInitialized = useRef(false);
  const navigate = useNavigate();
  
  // User content state
  const [userContent, setUserContent] = useState<UserGeneratedContent[]>([]);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showUserContentModal, setShowUserContentModal] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);
  const [selectedUserContent, setSelectedUserContent] = useState<UserGeneratedContent | null>(null);
  
  // Filter state
  const [showOfficialModules, setShowOfficialModules] = useState(true);
  const [showUserContent, setShowUserContent] = useState(true);
  const [showOnlyTodaysContent, setShowOnlyTodaysContent] = useState(false);

  // Only include modules with valid lat/lng
  const validModule = (module: Module) => {
    return typeof module.latitude === 'number' &&
      typeof module.longitude === 'number' &&
      !isNaN(module.latitude) &&
      !isNaN(module.longitude);
  };

  // Memoize modules with valid coordinates
  const modulesToShow = useMemo(() => {
    if (journeys.length === 0) {
      return [];
    }
    
    const validModules = journeys.flatMap(journey => journey.modules.filter(validModule));
    return validModules;
  }, [journeys]);

  const handlePointClick = useCallback((module: Module) => {
    if (onModuleClick) {
      onModuleClick(module);
    } else if (module.id) {
      navigate(`/lesson/${module.id}`);
    }
  }, [onModuleClick, navigate]);

  const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
    const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    setClickedCoordinates(coordinates);
    setShowAddContentModal(true);
  }, []);

  const handleUserContentSubmit = useCallback(async (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>) => {
    try {
      const { saveUserContent } = await import('@/services/userContentService');
      const newContent = await saveUserContent(content);
      console.log('Adding new user content:', newContent);
      setUserContent(prev => [...prev, newContent]);
    } catch (error) {
      console.error('Failed to save user content:', error);
      // Fallback to local state if save fails
      const newContent: UserGeneratedContent = {
        ...content,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setUserContent(prev => [...prev, newContent]);
    }
  }, []);

  const handleUserContentClick = useCallback((content: UserGeneratedContent) => {
    setSelectedUserContent(content);
    setShowUserContentModal(true);
  }, []);

  // Function to get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Historical Event':
        return '#FF6B6B'; // Red
      case 'Historical Figure':
        return '#4ECDC4'; // Teal
      case 'Archaeological Site':
        return '#45B7D1'; // Blue
      case 'Battle':
        return '#FF8E53'; // Orange
      case 'Monument':
        return '#96CEB4'; // Green
      case 'Cultural Site':
        return '#FFEAA7'; // Yellow
      case 'Discovery':
        return '#DDA0DD'; // Plum
      case 'Other':
        return '#98D8C8'; // Mint
      default:
        return '#FF6B6B'; // Default red
    }
  };



  // Load existing user content on component mount and set up real-time updates
  useEffect(() => {
    const loadUserContent = async () => {
      try {
        const { getUserContent } = await import('@/services/userContentService');
        const content = await getUserContent();
        console.log('Loading existing user content:', content);
        setUserContent(content);
      } catch (error) {
        console.error('Failed to load user content:', error);
        // Fallback to localStorage
        const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
        setUserContent(existingContent);
      }
    };
    
    loadUserContent();

    // Set up real-time subscription for live updates
    const setupRealtimeSubscription = async () => {
      try {
        const { subscribeToUserContent } = await import('@/services/userContentService');
        const subscription = subscribeToUserContent((content) => {
          console.log('Real-time update received:', content);
          setUserContent(content);
        });
        
        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to set up real-time subscription:', error);
      }
    };

    const cleanup = setupRealtimeSubscription();
    
    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [0, 0],
      zoom: 1.5,
      maxZoom: 18,
      minZoom: 1,
      maxPitch: 60,
      renderWorldCopies: false,
      fadeDuration: 0,
      crossSourceCollisions: false
    });

    map.current.on('load', () => {
      if (!map.current) return;
      mapInitialized.current = true;
    });
    
    map.current.on('styledata', () => {
      if (!map.current) return;
      
      // Map will be updated by the useEffect when data is ready
    });

          map.current.on('error', (e) => {
        console.error('Map error occurred:', e);
      });

      // Add map click handler for adding user content (only when not clicking on existing points)
      map.current.on('click', (e) => {
        console.log('Map clicked at:', e.lngLat);
        // Check if we clicked on a feature (existing point)
        const features = map.current!.queryRenderedFeatures(e.point, { layers: ['modules-points'] });
        console.log('Features at click point:', features.length);
        if (features.length === 0) {
          // Only open add content modal if we didn't click on an existing point
          console.log('Opening add content modal');
          handleMapClick(e);
        } else {
          console.log('Clicked on existing point, not opening modal');
        }
      });

      const fallbackTimer = setTimeout(() => {
        if (mapInitialized.current && map.current && map.current.loaded() && map.current.isStyleLoaded()) {
          // Map will be updated by the useEffect when data is ready
        }
      }, 3000);

      return () => {
        clearTimeout(fallbackTimer);
      };

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapInitialized.current = false;
      }
    };
  }, []);

  // Single effect to handle all map updates (modules, user content, and filters)
  useEffect(() => {
    if (mapInitialized.current && map.current && map.current.loaded()) {
      console.log('Map update effect triggered');
      console.log('Filters - Official:', showOfficialModules, 'User:', showUserContent, 'Today only:', showOnlyTodaysContent);
      
      // Remove existing layers and source if they exist
      if (map.current.getSource('modules')) {
        try {
          map.current.removeLayer('modules-labels');
          map.current.removeLayer('modules-points');
          map.current.removeSource('modules');
        } catch (e) {
          console.log('Error clearing existing layers:', e);
        }
      }

      // Filter user content based on settings
      let filteredUserContent = userContent;
      if (showOnlyTodaysContent) {
        const today = new Date().toDateString();
        filteredUserContent = userContent.filter(content => 
          new Date(content.createdAt).toDateString() === today
        );
      }

      // Create points data based on current filters
      const allPoints = [
        ...(showOfficialModules ? modulesToShow.map(module => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [Number(module.longitude), Number(module.latitude)]
          },
          properties: {
            id: module.id,
            title: module.title,
            completed: Boolean(module.completed),
            journeyId: module.journey_id,
            color: module.completed ? '#FFD700' : '#4A90E2',
            type: 'module'
          }
        })) : []),
        ...(showUserContent ? filteredUserContent.map(content => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: content.coordinates
          },
          properties: {
            id: content.id,
            title: content.title,
            author: content.author,
            category: content.category,
            color: getCategoryColor(content.category),
            type: 'user-content',
            imageUrl: content.imageUrl
          }
        })) : [])
      ];
      
      console.log('Creating map with', allPoints.length, 'total points');
      console.log('Official modules:', showOfficialModules ? modulesToShow.length : 0);
      console.log('User content:', showUserContent ? filteredUserContent.length : 0);

      // Add the source
      map.current.addSource('modules', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: allPoints
        }
      });

      // Add the points layer
      map.current.addLayer({
        id: 'modules-points',
        type: 'circle',
        source: 'modules',
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000000',
          'circle-opacity': 1.0
        }
      });

      // Add click event handling
      map.current.on('click', 'modules-points', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const featureType = feature.properties?.type;
          
          if (featureType === 'module') {
            const moduleId = feature.properties?.id;
            if (onModuleClick && moduleId) {
              const module = modulesToShow.find(m => m.id === moduleId);
              if (module) {
                onModuleClick(module);
              }
            }
          } else if (featureType === 'user-content') {
            const contentId = feature.properties?.id;
            const content = userContent.find(c => c.id === contentId);
            if (content) {
              handleUserContentClick(content);
            }
          }
        }
      });

      // Add hover effects
      map.current.on('mouseenter', 'modules-points', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'modules-points', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      // Add labels layer
      map.current.addLayer({
        id: 'modules-labels',
        type: 'symbol',
        source: 'modules',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Regular'],
          'text-size': 18,
          'text-offset': [0, 2.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 4
        }
      });

    }
  }, [modulesToShow, userContent, showOfficialModules, showUserContent, showOnlyTodaysContent, getCategoryColor, onModuleClick, handleUserContentClick]);

  return (
    <>
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          minHeight: '400px'
        }} 
      />
      
      {/* Enhanced Control Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-w-sm">
        {/* Header */}
        <div className="bg-blue-600 rounded-t-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Map Controls</h3>
              <p className="text-blue-100 text-sm">Filter and manage content</p>
            </div>
            <button
              onClick={() => {
                console.log('Current user content:', userContent);
                console.log('Map source exists:', map.current?.getSource('modules'));
              }}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{modulesToShow.length}</div>
              <div className="text-xs text-blue-500">Official Modules</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{userContent.length}</div>
              <div className="text-xs text-blue-500">User Content</div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Content Filter</h4>
            
            {/* Show/Hide Official Modules */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showOfficialModules}
                  onChange={(e) => {
                    setShowOfficialModules(e.target.checked);
                  }}
                  className="mr-2 rounded"
                />
                Show Official Modules
              </label>
            </div>

            {/* Show/Hide User Content */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showUserContent}
                  onChange={(e) => {
                    setShowUserContent(e.target.checked);
                  }}
                  className="mr-2 rounded"
                />
                Show User Content
              </label>
            </div>

            {/* Show Only Today's Content */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showOnlyTodaysContent}
                  onChange={(e) => {
                    setShowOnlyTodaysContent(e.target.checked);
                  }}
                  className="mr-2 rounded"
                />
                Show Only Today's Content
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Quick Actions</h4>
            
            <button
              onClick={() => {
                const testContent: UserGeneratedContent = {
                  id: 'test-' + Date.now(),
                  title: 'Test Historical Event',
                  description: 'This is a test event to verify dots are working',
                  author: 'Test User',
                  createdAt: new Date().toISOString(),
                  coordinates: [0, 0], // Center of map
                  category: 'Historical Event',
                  dateHappened: '2024',
                  source: 'Test data'
                };
                setUserContent(prev => [...prev, testContent]);
                console.log('Added test content:', testContent);
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Test Dot
            </button>

            <button
              onClick={() => {
                setUserContent([]);
                localStorage.removeItem('userContent');
                console.log('Cleared all user content');
              }}
              className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Clear All User Content
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Click anywhere on the map to add historical content
            </p>
          </div>
        </div>
      </div>
      
      {/* Add Content Modal */}
      <AddContentModal
        isOpen={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        coordinates={clickedCoordinates}
        onSubmit={handleUserContentSubmit}
      />
      
      {/* User Content Modal */}
      <UserContentModal
        content={selectedUserContent}
        onClose={() => {
          setShowUserContentModal(false);
          setSelectedUserContent(null);
        }}
      />
    </>
  );
}
