import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, Home, Globe, Trophy, BarChart3, Bookmark, ShoppingBag, Settings, User } from 'lucide-react';
import GlobeComponent from '@/components/globe/Globe';
import ModuleModal from '@/components/globe/ModuleModal';
import ProgressBox from '@/components/globe/ProgressBox';
import ThreeGlobe from '@/components/globe/ThreeGlobe'; // Added import for ThreeGlobe

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

export default function GlobeView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showDebug, setShowDebug] = useState(true);
  const [visibleJourneys, setVisibleJourneys] = useState<Set<number>>(new Set());
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Get content ID from URL parameters for sharing
  const sharedContentId = searchParams.get('content');
  
  // Handle module clicks
  const handleModuleClick = (module: any) => {
    console.log('🗺️ Globe: Module clicked:', module);
    
    if (module && module.id) {
      console.log('🗺️ Globe: Starting module:', module.id);
      
      // Navigate to guest lesson route - no auth required
      window.location.href = `/guest-lesson/${module.id}`;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*');
      if (modulesError) throw modulesError;
      
      console.log('📊 Raw modules data from Supabase:', modulesData?.length || 0);
      
      // Count modules with coordinates
      const modulesWithCoords = modulesData?.filter(m => 
        typeof m.latitude === 'number' && 
        typeof m.longitude === 'number' && 
        !isNaN(m.latitude) && 
        !isNaN(m.longitude)
      ) || [];
      
      console.log('📍 Modules with coordinates:', modulesWithCoords.length);
      console.log('📍 Sample coordinates:', modulesWithCoords.slice(0, 3).map(m => ({ title: m.title, lat: m.latitude, lng: m.longitude })));
      
      const journeysMap: { [key: string]: Module[] } = {};
      modulesData?.forEach((module: Module) => {
        if (!journeysMap[module.journey_id]) {
          journeysMap[module.journey_id] = [];
        }
        journeysMap[module.journey_id].push(module);
      });
      
      const journeys = Object.entries(journeysMap).map(([journey_id, modules]) => ({
        id: journey_id,
        title: journey_id,
        modules,
      }));
      
      console.log('🗺️ Processed journeys:', journeys.length);
      console.log('🗺️ Total modules across all journeys:', journeys.reduce((sum, j) => sum + j.modules.length, 0));
      setJourneys(journeys);
      
      // Initialize all journeys as visible
      const allJourneyIds = new Set(journeys.map(j => Number(j.id)));
      console.log('🔍 Page: Setting initial visible journeys:', Array.from(allJourneyIds));
      setVisibleJourneys(allJourneyIds);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Override root element styles to ensure full viewport
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.maxWidth = 'none';
      rootElement.style.margin = '0';
      rootElement.style.padding = '0';
      rootElement.style.width = '100vw';
      rootElement.style.height = '100vh';
    }
    
    // Cleanup function to restore original styles
    return () => {
      if (rootElement) {
        rootElement.style.maxWidth = '';
        rootElement.style.margin = '';
        rootElement.style.padding = '';
        rootElement.style.width = '';
        rootElement.style.height = '';
      }
    };
  }, [fetchData]);
  
  // Removed duplicate initialization - now only happens in fetchData

  // Debug when visibleJourneys changes
  useEffect(() => {
    console.log('🔍 Page: visibleJourneys changed:', {
      visibleCount: visibleJourneys.size,
      visibleIds: Array.from(visibleJourneys),
      totalJourneys: journeys.length
    });
  }, [visibleJourneys, journeys.length]);

  // Filter journeys based on visibility selection
  const filteredJourneys = useMemo(() => {
    const filtered = journeys.filter(journey => visibleJourneys.has(Number(journey.id)));
    console.log('🔍 Page: Filtering journeys:', {
      visibleJourneys: Array.from(visibleJourneys),
      totalJourneys: journeys.length,
      filteredCount: filtered.length,
      filteredDetails: filtered.map(j => ({ id: j.id, title: j.title, moduleCount: j.modules.length }))
    });
    return filtered;
  }, [journeys, visibleJourneys]);

  // Force re-render when filtering changes
  const filteredJourneysKey = useMemo(() => 
    Array.from(visibleJourneys).sort().join(','),
    [visibleJourneys]
  );

  // Memoize the debug info calculations to prevent unnecessary re-renders
  const debugInfo = useMemo(() => {
    const totalModules = journeys.reduce((sum, j) => sum + j.modules.length, 0);
    const modulesWithCoordinates = journeys.reduce((sum, j) => 
      sum + j.modules.filter(m => 
        typeof m.latitude === 'number' && 
        typeof m.longitude === 'number' && 
        !isNaN(m.latitude) && 
        !isNaN(m.longitude)
      ).length, 0
    );
    
    const visibleModulesWithCoordinates = filteredJourneys.reduce((sum, j) => 
      sum + j.modules.filter(m => 
        typeof m.latitude === 'number' && 
        typeof m.longitude === 'number' && 
        !isNaN(m.latitude) && 
        !isNaN(m.longitude)
      ).length, 0
    );

    return { totalModules, modulesWithCoordinates, visibleModulesWithCoordinates };
  }, [journeys, filteredJourneys]);

  // Memoize the Globe component to prevent unnecessary re-renders
  const memoizedGlobe = useMemo(() => (
    <ThreeGlobe 
      key={`globe-${Array.from(visibleJourneys).sort().join('-')}`} // Force re-render when visibleJourneys changes
      journeys={filteredJourneys} 
      onModuleClick={handleModuleClick}
      sharedContentId={sharedContentId}
    />
  ), [filteredJourneys, visibleJourneys, sharedContentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Render the globe with debug overlay
  return (
    <div className="fixed inset-0 z-50 bg-black w-screen h-screen" style={{ 
      margin: 0, 
      padding: 0, 
      maxWidth: 'none',
      width: '100vw',
      height: '100vh'
    }}>
      {/* Three.js Globe Styles */}
      <style>
        {`
          canvas {
            display: block;
            outline: none;
          }
        `}
      </style>
      
      {memoizedGlobe}
      
      {/* Debug overlay removed - now handled by ThreeGlobe component */}
      {false && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-base">Debug Info</h3>
            <div className="flex gap-2">
              <button 
                onClick={fetchData}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                title="Refresh coordinates data"
              >
                🔄
              </button>
              <button 
                onClick={() => {
                  // Force a re-render of the Globe component
                  console.log('🔍 Page: Force updating map...');
                  setVisibleJourneys(new Set(visibleJourneys));
                }}
                className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 rounded hover:bg-green-50"
                title="Force map update"
              >
                🗺️
              </button>
              <button 
                onClick={() => {
                  // Force a complete refresh of the globe
                  console.log('🔍 Page: Force refreshing globe...');
                  setVisibleJourneys(new Set());
                  setTimeout(() => {
                    setVisibleJourneys(new Set(journeys.map(j => Number(j.id))));
                  }, 100);
                }}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium px-2 py-1 rounded hover:bg-orange-50"
                title="Force globe refresh"
              >
                🔄
              </button>
              <button 
                onClick={() => setShowDebug(false)}
                className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-50"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Journeys:</strong> {journeys.length}</div>
              <div><strong>Modules:</strong> {debugInfo.totalModules}</div>
              <div><strong>With Coords:</strong> {debugInfo.modulesWithCoordinates}</div>
              <div><strong>Visible:</strong> {debugInfo.visibleModulesWithCoordinates}</div>
            </div>
            
            {journeys.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setVisibleJourneys(new Set(journeys.map(j => Number(j.id))))}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Show All
                  </button>
                  <button
                    onClick={() => {
                      console.log('🔍 Page: Clearing all journeys...');
                      console.log('🔍 Page: Current visibleJourneys before clear:', Array.from(visibleJourneys));
                      
                      // Clear all journeys
                      setVisibleJourneys(new Set());
                      
                      // Force immediate update
                      setTimeout(() => {
                        console.log('🔍 Page: Forcing complete refresh after clear...');
                        console.log('🔍 Page: visibleJourneys after clear:', Array.from(visibleJourneys));
                        
                        // Force another update to ensure state is properly cleared
                        setVisibleJourneys(new Set());
                        
                        // Log the filtered journeys to verify they're empty
                        const emptyFiltered = journeys.filter(journey => false);
                        console.log('🔍 Page: Filtered journeys after clear:', emptyFiltered.length);
                      }, 10);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {journeys.map((journey, idx) => (
                    <label key={journey.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={visibleJourneys.has(Number(journey.id))}
                        onChange={(e) => {
                          const newVisible = new Set(visibleJourneys);
                          if (e.target.checked) {
                            newVisible.add(Number(journey.id));
                          } else {
                            newVisible.delete(Number(journey.id));
                          }
                          setVisibleJourneys(newVisible);
                        }}
                        className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">
                        {idx + 1}: {journey.modules.length} modules
                        {journey.modules.some(m => m.latitude && m.longitude) && (
                          <span className="text-green-600 ml-1">✓</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="fixed top-4 left-4 z-50 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
        title="Open Navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50" 
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 text-white shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Historia
                  </span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {[
                { label: 'HOME', href: '/home', icon: <Home className="h-6 w-6" /> },
                { label: 'GLOBE', href: '/globe', icon: <Globe className="h-6 w-6" /> },
                { label: 'MUSEUM', href: '/museum', icon: <Trophy className="h-6 w-6" /> },
                { label: 'LEADERBOARD', href: '/leaderboard', icon: <BarChart3 className="h-6 w-6" /> },
                { label: 'BOOKMARKS', href: '/bookmarks', icon: <Bookmark className="h-6 w-6" /> },
                { label: 'GET A JOHAN PLUSHIE!', href: '/store', icon: <ShoppingBag className="h-6 w-6" /> },
                { label: 'SETTINGS', href: '/settings', icon: <Settings className="h-6 w-6" /> },
                { label: 'PROFILE', href: '/profile', icon: <User className="h-6 w-6" /> },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setShowSidebar(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group text-left hover:bg-gray-800"
                >
                  <div className="text-gray-400 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-sm tracking-wide">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Toggle debug button removed - now handled by ThreeGlobe component */}
    </div>
  );
} 