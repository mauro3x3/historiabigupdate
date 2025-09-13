import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import AddContentModal, { UserGeneratedContent } from './AddContentModal';
import UserContentModal from './UserContentModal';
import MapboxGlobe from './MapboxGlobe';
import NewsflashNotification from './NewsflashNotification';
import PlayTodaySlideshow from './PlayTodaySlideshow';
import ContentModeration from './ContentModeration';
import { MAPBOX_CONFIG } from '../../config/mapbox';
import { supabase } from '@/integrations/supabase/client';
import SettingsModal from '@/components/SettingsModal';
import { useSettings } from '@/contexts/SettingsContext';
import { playNewDotSound } from '@/utils/soundUtils';

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
  sharedContentId?: string | null;
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
    console.log('🗺️ ThreeGlobe: Creating globe data...');
    console.log('📊 ThreeGlobe: Modules to show:', modulesToShow.length);
    console.log('📊 ThreeGlobe: User content to show:', filteredUserContent.length);
    console.log('📊 ThreeGlobe: Show official modules:', showOfficialModules);
    console.log('📊 ThreeGlobe: Show user content:', showUserContent);
    
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
      ...(showUserContent ? filteredUserContent.map(content => {
        console.log('📍 ThreeGlobe: Adding user content dot:', content.title, 'at', content.coordinates);
        return {
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
        };
      }) : []),
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

export default function ThreeGlobe({ journeys, onModuleClick, sharedContentId }: ThreeGlobeProps) {
  console.log('🔥🔥🔥 CALENDAR FIX V2 - TIMESTAMP:', Date.now(), '🔥🔥🔥');
  const navigate = useNavigate();
  const { formatDate } = useSettings();
  
  // Calendar mode state
  const [calendarMode, setCalendarMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(-400); // Start with 400 BC
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(8);
  const [dateInput, setDateInput] = useState('400 BC');

  // Calendar mode handlers
  const handleDateInputChange = (value: string) => {
    setDateInput(value);
    const parts = value.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
      }
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setDateInput(`${year}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setDateInput(`${selectedYear}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    setDateInput(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
  };
  
  // User content state
  const [userContent, setUserContent] = useState<UserGeneratedContent[]>([]);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showUserContentModal, setShowUserContentModal] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);
  const [selectedUserContent, setSelectedUserContent] = useState<UserGeneratedContent | null>(null);
  const [showPlayToday, setShowPlayToday] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set to today's date
  const [newsflashContent, setNewsflashContent] = useState<UserGeneratedContent | null>(null);
  const [showNewsflash, setShowNewsflash] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAllDotsModal, setShowAllDotsModal] = useState(false);
  
  // Filter state - removed old filtering options since we now filter by date
  const [autoRotate, setAutoRotate] = useState(false);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [isLoadingTexture, setIsLoadingTexture] = useState(false);
  const [globeTexture, setGlobeTexture] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');


  // Load a simple Earth texture
  useEffect(() => {
    console.log('Loading Earth texture...');
    setGlobeTexture('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    setIsLoadingTexture(false);
  }, [mapStyle]);

  const handleUserContentSubmit = useCallback(async (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>) => {
    try {
      const { saveUserContent } = await import('@/services/userContentService');
      const newContent = await saveUserContent(content);
      
      // Show newsflash notification
      setNewsflashContent(newContent);
      setShowNewsflash(true);
      
      // Play sound effect for new dot notification
      playNewDotSound();
      
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
      
      setNewsflashContent(newContent);
      setShowNewsflash(true);
      
      // Play sound effect for new dot notification (fallback case)
      playNewDotSound();
      
      setUserContent(prev => [...prev, newContent]);
    }
  }, []);

  const handleNewsflashClose = () => {
    setShowNewsflash(false);
    setNewsflashContent(null);
  };


  const handleNavigateToEvent = (coordinates: [number, number], event: any) => {
    // This will be handled by the globe component to zoom to coordinates
    console.log('Navigate to event:', coordinates, event);
  };

  const getTodaysEvents = () => {
    const today = new Date().toDateString();
    return userContent.filter(content => 
      new Date(content.createdAt).toDateString() === today
    );
  };

  // Helper function to check if a date matches an imprecise historical date
  const matchesImpreciseDate = (historicalYear: string, selectedDate: Date) => {
    const selectedYear = selectedDate.getFullYear();
    
    // Handle different date formats from the database
    if (historicalYear.includes('BCE') || historicalYear.includes('BC')) {
      // Extract year from strings like "c. 1406 BCE" or "1406 BC"
      const yearMatch = historicalYear.match(/(\d+)/);
      if (yearMatch) {
        const historicalYearNum = parseInt(yearMatch[1]);
        // For BCE dates, we need to convert to negative years
        // 1406 BCE = -1406 in our calendar
        const bceYear = -historicalYearNum;
        return selectedYear === bceYear;
      }
    } else if (historicalYear.includes('AD') || historicalYear.includes('CE')) {
      // Extract year from strings like "330 AD" or "330 CE"
      const yearMatch = historicalYear.match(/(\d+)/);
      if (yearMatch) {
        const historicalYearNum = parseInt(yearMatch[1]);
        return selectedYear === historicalYearNum;
      }
    } else if (historicalYear.includes('c.')) {
      // Handle "c." (circa) dates like "c. 300-100 BC"
      const yearMatch = historicalYear.match(/c\.\s*(\d+)/);
      if (yearMatch) {
        const historicalYearNum = parseInt(yearMatch[1]);
        // Check if it's BCE or AD based on context
        if (historicalYear.includes('BC') || historicalYear.includes('BCE')) {
          return selectedYear === -historicalYearNum;
        } else {
          return selectedYear === historicalYearNum;
        }
      }
    } else if (historicalYear.includes('-')) {
      // Handle date ranges like "334-330 BC" or "100 BC-300 AD"
      const parts = historicalYear.split('-');
      if (parts.length === 2) {
        const startYear = parts[0].trim();
        const endYear = parts[1].trim();
        
        // Extract years and convert BCE to negative
        const startYearNum = parseInt(startYear.match(/(\d+)/)?.[1] || '0');
        const endYearNum = parseInt(endYear.match(/(\d+)/)?.[1] || '0');
        
        let startYearActual = startYearNum;
        let endYearActual = endYearNum;
        
        if (startYear.includes('BC') || startYear.includes('BCE')) {
          startYearActual = -startYearNum;
        }
        if (endYear.includes('BC') || endYear.includes('BCE')) {
          endYearActual = -endYearNum;
        }
        
        return selectedYear >= Math.min(startYearActual, endYearActual) && 
               selectedYear <= Math.max(startYearActual, endYearActual);
      }
    } else {
      // Handle simple year numbers like "30" or "2025"
      const yearMatch = historicalYear.match(/(\d+)/);
      if (yearMatch) {
        const historicalYearNum = parseInt(yearMatch[1]);
        // If it's a small number (likely BCE), treat as BCE
        if (historicalYearNum < 1000 && historicalYearNum > 0) {
          return selectedYear === -historicalYearNum || selectedYear === historicalYearNum;
        }
        return selectedYear === historicalYearNum;
      }
    }
    
    return false;
  };

  // Function to spread out dots with the same coordinates
  const spreadOutDots = (items: any[], radius = 0.01) => {
    const coordinateMap = new Map<string, any[]>();
    
    // Group items by their coordinates
    items.forEach(item => {
      const key = `${item.latitude},${item.longitude}`;
      if (!coordinateMap.has(key)) {
        coordinateMap.set(key, []);
      }
      coordinateMap.get(key)!.push(item);
    });
    
    // Spread out items with the same coordinates
    const spreadItems = [];
    for (const [coords, itemsAtCoords] of coordinateMap) {
      if (itemsAtCoords.length === 1) {
        // Single item, keep original coordinates
        spreadItems.push(itemsAtCoords[0]);
      } else {
        // Multiple items, spread them out in a circle
        const [lat, lng] = coords.split(',').map(Number);
        const angleStep = (2 * Math.PI) / itemsAtCoords.length;
        
        itemsAtCoords.forEach((item, index) => {
          const angle = index * angleStep;
          const offsetLat = lat + (radius * Math.cos(angle));
          const offsetLng = lng + (radius * Math.sin(angle));
          
          spreadItems.push({
            ...item,
            latitude: offsetLat,
            longitude: offsetLng,
            originalLatitude: lat,
            originalLongitude: lng
          });
        });
      }
    }
    
    return spreadItems;
  };

  // Filter content by selected date (both official modules and user content)
  const getFilteredContent = () => {
    const selectedDateObj = new Date(selectedDate);
    const selectedYear = selectedDateObj.getFullYear();
    
    // Filter user content by date and category
    const filteredUserContent = userContent.filter(content => {
      // Filter by category first
      if (selectedCategory !== 'All Categories' && content.category !== selectedCategory) {
        return false;
      }
      
      if (!content.dateHappened) return false;
      
      // Parse the date from various formats
      let contentDate: Date;
      const dateStr = content.dateHappened.trim();
      
      // Handle different date formats
      if (dateStr.includes('/')) {
        // Handle MM/DD/YYYY or DD/MM/YYYY format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          
          // Check if it's MM/DD/YYYY (American) or DD/MM/YYYY (European)
          // If month > 12, it's definitely DD/MM/YYYY
          if (month > 12) {
            contentDate = new Date(year, day - 1, month); // DD/MM/YYYY
          } else if (day > 12) {
            contentDate = new Date(year, month - 1, day); // MM/DD/YYYY
          } else {
            // Ambiguous case - assume American format for now
            contentDate = new Date(year, month - 1, day); // MM/DD/YYYY
          }
        } else {
          return false;
        }
      } else if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD format
        contentDate = new Date(dateStr);
      } else {
        // Handle year-only format (e.g., "1066", "44 BC")
        const year = parseInt(dateStr.replace(/[^\d-]/g, ''));
        if (!isNaN(year)) {
          contentDate = new Date(year, 0, 1); // January 1st of that year
        } else {
          return false;
        }
      }
      
      if (isNaN(contentDate.getTime())) return false;
      
      // Check if the content date matches the selected date
      const contentYear = contentDate.getFullYear();
      const contentMonth = contentDate.getMonth();
      const contentDay = contentDate.getDate();
      
      const selectedYear = selectedDateObj.getFullYear();
      const selectedMonth = selectedDateObj.getMonth();
      const selectedDay = selectedDateObj.getDate();
      
      // Match exact date
      return contentYear === selectedYear && 
             contentMonth === selectedMonth && 
             contentDay === selectedDay;
    });
    
    console.log(`🗓️ Date filtering: Selected date "${selectedDate}", showing ${filteredUserContent.length} of ${userContent.length} user content items`);
    console.log(`🗓️ Filtered user content:`, filteredUserContent.map(c => ({ title: c.title, date: c.dateHappened, coordinates: c.coordinates })));
    
    // Filter official modules by imprecise date matching
    const filteredOfficialModules = journeys.flatMap(journey => 
      journey.modules.filter(module => {
        if (module.year) {
          const matches = matchesImpreciseDate(module.year, selectedDateObj);
          if (matches) {
            console.log(`Module "${module.title}" with year "${module.year}" matches selected year ${selectedYear}`);
          }
          return matches;
        }
        return false;
      })
    );
    
    // Spread out dots with the same coordinates
    const spreadOfficialModules = spreadOutDots(filteredOfficialModules);
    const spreadUserContent = spreadOutDots(filteredUserContent);
    
    console.log(`Selected year: ${selectedYear}, Found ${filteredOfficialModules.length} official modules, ${filteredUserContent.length} user content`);
    console.log('All user content:', userContent.map(c => ({ title: c.title, date: c.dateHappened, coordinates: c.coordinates })));
    console.log('Official modules:', filteredOfficialModules.map(m => ({ title: m.title, year: m.year })));
    console.log('Filtered user content:', filteredUserContent.map(c => ({ title: c.title, date: c.dateHappened, coordinates: c.coordinates })));
    
    return {
      userContent: spreadUserContent,
      officialModules: spreadOfficialModules
    };
  };

  // Format date for display using settings
  const formatDisplayDate = (dateString: string) => {
    return formatDate(dateString);
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Go to random date in history
  const goToRandomDate = () => {
    // Random date between 1000 BC and 2024 AD
    const minYear = -1000; // 1000 BC
    const maxYear = 2024;
    const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid month length issues
    
    const randomDate = new Date(randomYear, randomMonth - 1, randomDay);
    setSelectedDate(randomDate.toISOString().split('T')[0]);
  };

  const handleRemoveContent = async (contentId: string) => {
    try {
      // Delete from Supabase database
      const { error } = await supabase
        .from('userdots')
        .delete()
        .eq('id', contentId);

      if (error) {
        console.error('Error deleting content from database:', error);
        alert('Failed to delete content from database. Please try again.');
        return;
      }

      // Update local state
      setUserContent(prev => prev.filter(content => content.id !== contentId));
      
      // Update localStorage as backup
      const updatedContent = userContent.filter(content => content.id !== contentId);
      localStorage.setItem('userContent', JSON.stringify(updatedContent));
      
      console.log('Content successfully deleted from database:', contentId);
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content. Please try again.');
    }
  };

  const handleApproveContent = async (contentId: string) => {
    try {
      // Update approval status in Supabase database
      const { error } = await supabase
        .from('userdots')
        .update({ is_approved: true })
        .eq('id', contentId);

      if (error) {
        console.error('Error approving content in database:', error);
        alert('Failed to approve content in database. Please try again.');
        return;
      }

      // Update local state
      setUserContent(prev => prev.map(content => 
        content.id === contentId 
          ? { ...content, isApproved: true }
          : content
      ));
      
      console.log('Content successfully approved in database:', contentId);
    } catch (error) {
      console.error('Failed to approve content:', error);
      alert('Failed to approve content. Please try again.');
    }
  };

  const handleFlagContent = async (contentId: string) => {
    try {
      // Get current flags count
      const currentContent = userContent.find(c => c.id === contentId);
      const newFlagsCount = (currentContent?.flags || 0) + 1;

      // Update flags count in Supabase database
      const { error } = await supabase
        .from('userdots')
        .update({ flags: newFlagsCount })
        .eq('id', contentId);

      if (error) {
        console.error('Error updating flags in database:', error);
        alert('Failed to update flags in database. Please try again.');
        return;
      }

      // Update local state
      setUserContent(prev => prev.map(content => 
        content.id === contentId 
          ? { ...content, flags: newFlagsCount }
          : content
      ));
      
      console.log('Content flags successfully updated in database:', contentId);
    } catch (error) {
      console.error('Failed to update flags:', error);
      alert('Failed to update flags. Please try again.');
    }
  };

  const handleModerationClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'doflamingo') {
      setShowPasswordPrompt(false);
      setShowModeration(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
      setAdminPassword('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setAdminPassword('');
  };

  const handleUserContentClick = useCallback((content: UserGeneratedContent) => {
    setSelectedUserContent(content);
    setShowUserContentModal(true);
  }, []);

  const handleMapClick = useCallback((coordinates: [number, number]) => {
    setClickedCoordinates(coordinates);
    setShowAddContentModal(true);
  }, []);

  // Load existing user content on component mount and set up real-time updates
  useEffect(() => {
    console.log('🚀 ThreeGlobe: useEffect triggered for user content loading');
    
    const loadUserContent = async () => {
      try {
        console.log('🔄 ThreeGlobe: Loading user content...');
        const { getUserContent } = await import('@/services/userContentService');
        console.log('🔄 ThreeGlobe: getUserContent function imported');
        const content = await getUserContent();
        console.log('✅ ThreeGlobe: User content loaded:', content);
        console.log('📊 ThreeGlobe: Number of user dots:', content.length);
        setUserContent(content);
        
        // Check if there's a shared content ID to open
        if (sharedContentId) {
          console.log('🔗 ThreeGlobe: Opening shared content:', sharedContentId);
          const sharedContent = content.find(c => c.id === sharedContentId);
          if (sharedContent) {
            console.log('✅ ThreeGlobe: Found shared content, opening modal:', sharedContent);
            setSelectedUserContent(sharedContent);
            setShowUserContentModal(true);
          } else {
            console.log('❌ ThreeGlobe: Shared content not found:', sharedContentId);
          }
        }
      } catch (error) {
        console.error('❌ ThreeGlobe: Failed to load user content:', error);
        console.error('❌ ThreeGlobe: Error details:', error);
        // Fallback to localStorage
        const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
        console.log('🔄 ThreeGlobe: Fallback to localStorage:', existingContent);
        setUserContent(existingContent);
      }
    };
    
    console.log('🔄 ThreeGlobe: About to call loadUserContent');
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
    
    let validModules = journeys.flatMap(journey => journey.modules.filter(validModule));
    
    // Apply calendar mode filtering
    if (calendarMode) {
      console.log('🔍 Filtering for year:', selectedYear);
      validModules = validModules.filter(module => {
        const yearString = module.year || '';
        console.log('🔍 Checking module:', module.title, 'year string:', yearString);
        
        // Extract year from various formats
        let moduleYear = null;
        
        if (yearString.includes('BC')) {
          const bcMatch = yearString.match(/(\d+)/);
          if (bcMatch) {
            moduleYear = -parseInt(bcMatch[1]); // Convert BC to negative
          }
        } else if (yearString.includes('AD')) {
          const adMatch = yearString.match(/(\d+)/);
          if (adMatch) {
            moduleYear = parseInt(adMatch[1]);
          }
        } else if (/^\d+$/.test(yearString)) {
          // Simple number like "680" - assume AD if positive year selected
          moduleYear = parseInt(yearString);
        } else if (yearString.includes('c.')) {
          const circaMatch = yearString.match(/c\.\s*(\d+)/);
          if (circaMatch) {
            const circaYear = parseInt(circaMatch[1]);
            moduleYear = yearString.includes('BC') ? -circaYear : circaYear;
          }
        }
        
        console.log('🔍 Extracted year:', moduleYear, 'selected year:', selectedYear);
        
        // Check if module year matches selected year
        if (moduleYear !== null) {
          if (selectedYear < 0) {
            // Looking for BC dates - check if module is within 50 years
            const matches = Math.abs(moduleYear - selectedYear) <= 50;
            console.log('🔍 BC match:', matches);
            return matches;
          } else {
            // Looking for AD dates - exact match
            const matches = moduleYear === selectedYear;
            console.log('🔍 AD match:', matches);
            return matches;
          }
        }
        
        console.log('🔍 No match');
        return false;
      });
      
      console.log('🔍 Final filtered count:', validModules.length);
    }
    
    return validModules;
  }, [journeys, calendarMode, selectedYear, selectedMonth, selectedDay]);

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <MapboxGlobe
          journeys={[{ id: 'filtered', title: 'Filtered Modules', modules: getFilteredContent().officialModules }]}
          onModuleClick={onModuleClick}
          userContent={getFilteredContent().userContent}
          showOfficialModules={true}
          showUserContent={true}
          showOnlyTodaysContent={false}
          onUserContentClick={handleUserContentClick}
          onMapClick={handleMapClick}
          mapStyle={mapStyle}
          isLoadingTexture={isLoadingTexture}
          globeTexture={globeTexture}
          calendarMode={calendarMode}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
        />
      </div>
      
      {/* Enhanced Control Panel */}
      <div className="absolute top-20 left-4 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-w-sm">
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
        <div className="p-4 pt-4 space-y-3">
          {/* Total Historical Dots */}
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-lg p-3 text-center cursor-pointer hover:from-blue-100 hover:to-gray-100 transition-colors"
               onClick={() => setShowAllDotsModal(true)}>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {getFilteredContent().userContent.length + getFilteredContent().officialModules.length}
            </div>
            <div className="text-sm text-blue-600 font-medium">Total Historical Dots</div>
            <div className="text-xs text-gray-500 mt-1">Click to view all</div>
          </div>


          {/* Date Selector */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Current Date</h4>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">
                  {formatDisplayDate(selectedDate)}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {getFilteredContent().userContent.length} event{getFilteredContent().userContent.length !== 1 ? 's' : ''} on this date
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousDay}
                className="flex-1 btn-secondary btn-small"
              >
                ← Previous
              </button>
              <button
                onClick={goToToday}
                className="btn-primary btn-small"
              >
                Today
              </button>
              <button
                onClick={goToNextDay}
                className="flex-1 btn-secondary btn-small"
              >
                Next →
              </button>
            </div>
            
            <button
              onClick={goToRandomDate}
              className="w-full btn-primary btn-small flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Random Date
            </button>
            
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={formatDisplayDate(selectedDate)}
              />
            </div>
          </div>

          {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm">Category</h4>
              </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              size={1}
            >
              <option value="All Categories">All Categories</option>
              <option value="Historical Event">Historical Event</option>
              <option value="Historical Figure">Historical Figure</option>
              <option value="Archaeological Site">Archaeological Site</option>
              <option value="Battle">Battle</option>
              <option value="Monument">Monument</option>
              <option value="Cultural Site">Cultural Site</option>
              <option value="Discovery">Discovery</option>
              <option value="Politics / Government">Politics / Government</option>
              <option value="Conflict / War Updates">Conflict / War Updates</option>
              <option value="Environment / Climate">Environment / Climate</option>
              <option value="Protests">Protests</option>
              <option value="Economy / Business">Economy / Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Quick Actions</h4>
            

            <button
              onClick={() => setShowPlayToday(true)}
              disabled={getFilteredContent().userContent.length === 0}
              className="w-full btn-primary btn-small flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Selected Date ({getFilteredContent().userContent.length})
            </button>

            <button
              onClick={handleModerationClick}
              className="w-full btn-primary btn-small flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
              Moderate Content ({userContent.length})
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full btn-secondary btn-small flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </button>

            {/* Clear All User Content button removed */}
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
        defaultDate={selectedDate}
      />
      
      {/* User Content Modal */}
      <UserContentModal
        content={selectedUserContent}
        onClose={() => {
          setShowUserContentModal(false);
          setSelectedUserContent(null);
        }}
      />

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="bg-orange-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold">Admin Access Required</h2>
                  <p className="text-orange-100 text-sm">Enter password to access moderation panel</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePasswordCancel}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Access Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newsflash Notification */}
      <NewsflashNotification
        content={newsflashContent}
        onClose={handleNewsflashClose}
      />


      {/* Play Today Slideshow */}
      <PlayTodaySlideshow
        isOpen={showPlayToday}
        onClose={() => setShowPlayToday(false)}
        events={getFilteredContent().userContent}
        onNavigateToEvent={handleNavigateToEvent}
      />

      {/* Content Moderation */}
      {showModeration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
              <button
                onClick={() => {
                  setShowModeration(false);
                  setAdminPassword('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <ContentModeration
                userContent={userContent}
                onRemoveContent={handleRemoveContent}
                onApproveContent={handleApproveContent}
                onFlagContent={handleFlagContent}
              />
            </div>
          </div>
        </div>
      )}

      {/* All Dots Modal */}
      {showAllDotsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">All Historical Dots for {formatDisplayDate(selectedDate)}</h3>
              <button
                onClick={() => setShowAllDotsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Official Modules */}
              {getFilteredContent().officialModules.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-blue-700">Official Modules ({getFilteredContent().officialModules.length})</h4>
                  <div className="space-y-2">
                    {getFilteredContent().officialModules.map((module, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-900">{module.title}</div>
                        <div className="text-sm text-blue-700">Year: {module.year}</div>
                        <div className="text-sm text-gray-600">Location: {module.latitude}, {module.longitude}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* User Content */}
              {getFilteredContent().userContent.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-green-700">User Content ({getFilteredContent().userContent.length})</h4>
                  <div className="space-y-2">
                    {getFilteredContent().userContent.map((content, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-900">{content.title}</div>
                        <div className="text-sm text-green-700">Date: {content.dateHappened}</div>
                        <div className="text-sm text-gray-600">Location: {content.coordinates[1]?.toFixed(4) || 'Unknown'}, {content.coordinates[0]?.toFixed(4) || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">Source: {content.source}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getFilteredContent().officialModules.length === 0 && getFilteredContent().userContent.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No historical dots found for this date.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
