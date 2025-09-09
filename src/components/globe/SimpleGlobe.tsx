import React, { useState, useMemo } from 'react';
import MapboxGlobe from './MapboxGlobe';

interface Module {
  id: string;
  title: string;
  completed: boolean;
  journey_id: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  year?: number;
  month?: number;
  day?: number;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface SimpleGlobeProps {
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
}

const SimpleGlobe: React.FC<SimpleGlobeProps> = ({
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
}) => {
  console.log('🔥 CALENDAR MODE COMPONENT LOADED - NEW VERSION 🔥');
  // Calendar mode state
  const [calendarMode, setCalendarMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1420);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(8);
  const [dateInput, setDateInput] = useState('1420-10-08');

  // Calculate modules to show based on calendar mode
  const modulesToShow = useMemo(() => {
    if (!calendarMode) {
      return journeys.flatMap(j => j.modules);
    }
    
    return journeys.flatMap(j => 
      j.modules.filter(module => 
        module.year === selectedYear && 
        module.month === selectedMonth && 
        module.day === selectedDay
      )
    );
  }, [journeys, calendarMode, selectedYear, selectedMonth, selectedDay]);

  const handleCalendarModeToggle = () => {
    setCalendarMode(!calendarMode);
  };

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

  return (
    <div className="flex h-full">
      {/* Control Panel */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Globe Controls</h3>
              <p className="text-sm text-gray-500">Filter and manage content</p>
            </div>
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
                      max="2000"
                      value={selectedYear}
                      onChange={(e) => handleYearChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((selectedYear - 1000) / 1000) * 100}%, #e5e7eb ${((selectedYear - 1000) / 1000) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  {/* Month Dropdown */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Day Input */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Day</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={selectedDay}
                      onChange={(e) => handleDayChange(parseInt(e.target.value) || 1)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    Showing {modulesToShow.length} events on {selectedYear}-{selectedMonth.toString().padStart(2, '0')}-{selectedDay.toString().padStart(2, '0')}
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
                  onChange={() => {}}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show Official Modules</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showUserContent}
                  onChange={() => {}}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show User Content</span>
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => {/* Add test dot functionality */}}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                + Add Test Dot
              </button>
            </div>
          </div>

          {/* Hint */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            Click anywhere on the globe to add historical content
          </div>
        </div>
      </div>

      {/* Globe */}
      <div className="flex-1">
        <MapboxGlobe
          journeys={journeys}
          onModuleClick={onModuleClick}
          userContent={userContent}
          showOfficialModules={showOfficialModules}
          showUserContent={showUserContent}
          showOnlyTodaysContent={showOnlyTodaysContent}
          onUserContentClick={onUserContentClick}
          onMapClick={onMapClick}
          mapStyle={mapStyle}
          isLoadingTexture={isLoadingTexture}
          globeTexture={globeTexture}
          calendarMode={calendarMode}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default SimpleGlobe;