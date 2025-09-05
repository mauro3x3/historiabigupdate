import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddContentModal, { UserGeneratedContent } from './AddContentModal';
import UserContentModal from './UserContentModal';
import MapboxGlobe from './MapboxGlobe';
import { MAPBOX_CONFIG } from '../../config/mapbox';

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

interface ThreeGlobeProps {
  journeys: Journey[];
  onModuleClick?: (module: Module) => void;
}

// Simple Globe component using Three.js sphere with Mapbox texture
function SimpleGlobe({ 
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
  globeTexture
}: ThreeGlobeProps & {
  userContent: UserGeneratedContent[];
  showOfficialModules: boolean;
  showUserContent: boolean;
  showOnlyTodaysContent: boolean;
  onUserContentClick: (content: UserGeneratedContent) => void;
  onMapClick: (coordinates: [number, number]) => void;
  mapStyle: string;
  isLoadingTexture: boolean;
  globeTexture: string | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

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

  // Filter user content based on settings
  const filteredUserContent = useMemo(() => {
    let filtered = userContent;
    if (showOnlyTodaysContent) {
      const today = new Date().toDateString();
      filtered = userContent.filter(content => 
        new Date(content.createdAt).toDateString() === today
      );
    }
    return filtered;
  }, [userContent, showOnlyTodaysContent]);

  // Create points data for the globe
  const globeData = useMemo(() => {
    const allPoints = [
      ...(showOfficialModules ? modulesToShow.map(module => ({
        lat: module.latitude,
        lng: module.longitude,
        size: 0.5,
        color: module.completed ? '#FFD700' : '#4A90E2',
        type: 'module',
        id: module.id,
        title: module.title,
        completed: module.completed,
        journeyId: module.journey_id
      })) : []),
      ...(showUserContent ? filteredUserContent.map(content => ({
        lat: content.coordinates[1],
        lng: content.coordinates[0],
        size: 0.4,
        color: getCategoryColor(content.category),
        type: 'user-content',
        id: content.id,
        title: content.title,
        author: content.author,
        category: content.category,
        imageUrl: content.imageUrl
      })) : []),
      // Test points at known locations for verification
      {
        lat: 0, // Equator, Prime Meridian (Gulf of Guinea) - should be in front
        lng: 0,
        size: 3.0,
        color: '#FFFF00',
        type: 'test',
        id: 'equator-test',
        title: 'Equator (0,0)'
      },
      {
        lat: 90, // North Pole - should be at top
        lng: 0,
        size: 3.0,
        color: '#FF00FF',
        type: 'test',
        id: 'northpole-test',
        title: 'North Pole'
      },
      {
        lat: -90, // South Pole - should be at bottom
        lng: 0,
        size: 3.0,
        color: '#00FFFF',
        type: 'test',
        id: 'south-pole-test',
        title: 'South Pole'
      },
      {
        lat: 0, // Equator, 90° East - should be on right side
        lng: 90,
        size: 2.5,
        color: '#FF0000',
        type: 'test',
        id: 'east-test',
        title: 'East (0,90)'
      },
      {
        lat: 0, // Equator, 90° West - should be on left side
        lng: -90,
        size: 2.5,
        color: '#00FF00',
        type: 'test',
        id: 'west-test',
        title: 'West (0,-90)'
      },
      {
        lat: 0, // Equator, 180° - should be at back
        lng: 180,
        size: 2.5,
        color: '#0000FF',
        type: 'test',
        id: 'back-test',
        title: 'Back (0,180)'
      }
    ];
    
    return allPoints;
  }, [modulesToShow, filteredUserContent, showOfficialModules, showUserContent, getCategoryColor]);



  // Skip texture for now - use a simple Earth-like color
  useEffect(() => {
    console.log('Using simple Earth color instead of texture');
    setTexture(null); // No texture, just use color
  }, []);

  // Animation - disabled to keep module positions fixed
  useFrame(() => {
    // Globe rotation disabled - modules need to stay in fixed positions
    // if (meshRef.current) {
    //   meshRef.current.rotation.y += 0.001;
    // }
  });

  // Debug logging
  console.log('SimpleGlobe render - texture:', texture, 'globeTexture prop:', globeTexture);
  console.log('Texture loaded?', !!texture);
  if (texture) {
    console.log('Texture image:', texture.image);
    console.log('Texture dimensions:', texture.image?.width, 'x', texture.image?.height);
  }

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[100, 64, 32]} />
        <meshPhongMaterial 
          map={texture} 
          transparent={false}
          side={THREE.DoubleSide}
          shininess={30}
          specular={0x111111}
          color={texture ? undefined : '#4A90E2'}
        />
      </mesh>
      
      {/* Render points as simple spheres */}
      {globeData.map((point, index) => {
        // Convert lat/lng to 3D coordinates on sphere surface
        // Proper spherical coordinate conversion for Three.js
        const phi = (90 - point.lat) * (Math.PI / 180); // phi: 0 at north pole, π at south pole
        const theta = (point.lng + 180) * (Math.PI / 180); // theta: 0 to 2π
        const radius = 100; // Base radius of the globe
        
        // Convert spherical to Cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Debug logging for first few points
        if (index < 5) {
          console.log(`Point ${index}: lat=${point.lat}, lng=${point.lng} -> x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`);
        }
        
        const handlePointClick = () => {
      if (point.type === 'module') {
        const module = modulesToShow.find(m => m.id === point.id);
        if (module && onModuleClick) {
          onModuleClick(module);
        }
      } else if (point.type === 'user-content') {
        const content = userContent.find(c => c.id === point.id);
        if (content) {
          onUserContentClick(content);
        }
      }
        };

  return (
          <mesh 
            key={index} 
            position={[x, y, z]}
            onClick={handlePointClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <sphereGeometry args={[point.size || 0.5, 8, 8]} />
            <meshBasicMaterial color={point.color} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ThreeGlobe({ journeys, onModuleClick }: ThreeGlobeProps) {
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
  const [autoRotate, setAutoRotate] = useState(false);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [isLoadingTexture, setIsLoadingTexture] = useState(false);
  const [globeTexture, setGlobeTexture] = useState<string | null>(null);


  // Load a simple Earth texture
  useEffect(() => {
    console.log('Loading Earth texture...');
    setGlobeTexture('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    setIsLoadingTexture(false);
  }, [mapStyle]);

  const handleUserContentSubmit = useCallback((content: Omit<UserGeneratedContent, 'id' | 'createdAt'>) => {
    const newContent: UserGeneratedContent = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    console.log('Adding new user content:', newContent);
    setUserContent(prev => [...prev, newContent]);
    
    // Save to localStorage
    const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
    existingContent.push(newContent);
    localStorage.setItem('userContent', JSON.stringify(existingContent));
  }, []);

  const handleUserContentClick = useCallback((content: UserGeneratedContent) => {
    setSelectedUserContent(content);
    setShowUserContentModal(true);
  }, []);

  const handleMapClick = useCallback((coordinates: [number, number]) => {
    setClickedCoordinates(coordinates);
    setShowAddContentModal(true);
  }, []);

  // Load existing user content on component mount
  useEffect(() => {
    const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
    console.log('Loading existing user content:', existingContent);
    setUserContent(existingContent);
  }, []);

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

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <MapboxGlobe
          journeys={journeys}
          onModuleClick={onModuleClick}
          userContent={userContent}
          showOfficialModules={showOfficialModules}
          showUserContent={showUserContent}
          showOnlyTodaysContent={showOnlyTodaysContent}
          onUserContentClick={handleUserContentClick}
          onMapClick={handleMapClick}
          mapStyle={mapStyle}
          isLoadingTexture={isLoadingTexture}
          globeTexture={globeTexture}
        />
      </div>
      
      {/* Enhanced Control Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-w-sm">
        {/* Header */}
        <div className="bg-blue-600 rounded-t-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Globe Controls</h3>
              <p className="text-blue-100 text-sm">Filter and manage content</p>
            </div>
            <button
              onClick={() => {
                console.log('Current user content:', userContent);
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

            {/* Auto Rotate */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => {
                    setAutoRotate(e.target.checked);
                  }}
                  className="mr-2 rounded"
                />
                Auto Rotate Globe
              </label>
            </div>
          </div>

          {/* Map Style Selector */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Map Style</h4>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="satellite">Satellite</option>
              <option value="satelliteStreets">Satellite with Streets</option>
              <option value="outdoors">Outdoors</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            {isLoadingTexture && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading high-quality texture...
              </div>
            )}
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
                  category: 'Historical Event'
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
              💡 Click anywhere on the globe to add historical content
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
