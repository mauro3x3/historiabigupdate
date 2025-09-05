import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddContentModal, { UserGeneratedContent } from './AddContentModal';
import UserContentModal from './UserContentModal';
import MapboxGlobe from './MapboxGlobe';
import { MAPBOX_CONFIG } from '../../config/mapbox';

interface Module {
  id: string;
  title: string;
  completed: boolean;
  journey_id: string;
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

export default function SimpleGlobe({ journeys, onModuleClick }: ThreeGlobeProps) {
  const navigate = useNavigate();
  
  // User content state
  const [userContent, setUserContent] = useState<UserGeneratedContent[]>([]);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showUserContentModal, setShowUserContentModal] = useState(false);
  const [selectedUserContent, setSelectedUserContent] = useState<UserGeneratedContent | null>(null);

  // Filter states
  const [showOfficialModules, setShowOfficialModules] = useState(true);
  const [showUserContent, setShowUserContent] = useState(true);
  const [showOnlyTodaysContent, setShowOnlyTodaysContent] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [isLoadingTexture, setIsLoadingTexture] = useState(false);
  const [globeTexture, setGlobeTexture] = useState<string | null>(null);
  
  // Calendar mode states
  const [calendarMode, setCalendarMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1420);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(8);
  const [selectedDate, setSelectedDate] = useState('1420-10-08');
  const [dateInput, setDateInput] = useState('1420-10-08');

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
    setUserContent(prev => [...prev, newContent]);
    setShowAddContentModal(false);
  }, []);

  const handleUserContentClick = useCallback((content: UserGeneratedContent) => {
    setSelectedUserContent(content);
    setShowUserContentModal(true);
  }, []);

  const handleMapClick = useCallback((coordinates: [number, number]) => {
    setShowAddContentModal(true);
  }, []);

  const handleAddTestDot = useCallback(() => {
    const testContent: UserGeneratedContent = {
      id: Date.now().toString(),
      title: `Test Content ${userContent.length + 1}`,
      description: 'This is a test content item',
      coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
      category: 'event',
      author: 'Test User',
      imageUrl: '',
      createdAt: new Date().toISOString()
    };
    setUserContent(prev => [...prev, testContent]);
  }, [userContent.length]);

  const handleClearUserContent = useCallback(() => {
    setUserContent([]);
  }, []);

  // Calendar mode handlers
  const handleCalendarModeToggle = useCallback(() => {
    setCalendarMode(!calendarMode);
  }, [calendarMode]);

  const handleDateChange = useCallback((year: number, month: number, day: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    const newDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(newDate);
    setDateInput(newDate);
  }, []);

  const handleDateInputChange = useCallback((dateString: string) => {
    setDateInput(dateString);
    // Parse the date string (format: YYYY-MM-DD)
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
        setSelectedDate(dateString);
      }
    }
  }, []);

  const handleYearChange = useCallback((year: number) => {
    handleDateChange(year, selectedMonth, selectedDay);
  }, [selectedMonth, selectedDay, handleDateChange]);

  const handleMonthChange = useCallback((month: number) => {
    handleDateChange(selectedYear, month, selectedDay);
  }, [selectedYear, selectedDay, handleDateChange]);

  const handleDayChange = useCallback((day: number) => {
    handleDateChange(selectedYear, selectedMonth, day);
  }, [selectedYear, selectedMonth, handleDateChange]);

  // Get modules to show based on filters
  const modulesToShow = useMemo(() => {
    const allModules = journeys.flatMap(journey => journey.modules);
    return allModules;
  }, [journeys]);

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
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
          calendarMode={calendarMode}
          selectedDate={selectedDate}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
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
              className="text-blue-200 hover:text-white transition-colors"
              onClick={() => {/* Add help functionality */}}
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

          {/* Calendar Mode */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Calendar Mode</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={calendarMode}
                  onChange={handleCalendarModeToggle}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Enable Calendar Mode</span>
              </label>
              
              {calendarMode && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                  <div className="text-xs text-gray-500 mb-2">Select a date to see what happened that day:</div>
                  
                  {/* Date Input */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Date (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      value={dateInput}
                      onChange={(e) => handleDateInputChange(e.target.value)}
                      placeholder="1420-10-08"
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Year Slider */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Year: {selectedYear}</label>
                    <input
                      type="range"
                      min="1000"
                      max="2024"
                      value={selectedYear}
                      onChange={(e) => handleYearChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1000</span>
                      <span>2024</span>
                    </div>
                  </div>
                  
                  {/* Month and Day */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Month</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                        className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Day</label>
                      <input
                        type="number"
                        value={selectedDay}
                        onChange={(e) => handleDayChange(parseInt(e.target.value) || 1)}
                        className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        min="1"
                        max="31"
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-blue-600 font-medium text-center">
                    Selected: {selectedDate}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Content Filter</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOfficialModules}
                  onChange={(e) => setShowOfficialModules(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show Official Modules</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showUserContent}
                  onChange={(e) => setShowUserContent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show User Content</span>
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Quick Actions</h4>
            <div className="flex space-x-2">
              <button
                onClick={handleAddTestDot}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Add Test Dot
              </button>
            </div>
          </div>

          {/* Hint */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">
                Click anywhere on the globe to add historical content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddContentModal && (
        <AddContentModal
          onClose={() => setShowAddContentModal(false)}
          onSubmit={handleUserContentSubmit}
        />
      )}

      {showUserContentModal && selectedUserContent && (
        <UserContentModal
          content={selectedUserContent}
          onClose={() => {
            setShowUserContentModal(false);
            setSelectedUserContent(null);
          }}
        />
      )}
    </>
  );
}
