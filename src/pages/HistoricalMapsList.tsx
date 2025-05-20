import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Map era data
const availableMaps = [
  { id: 'jewish', name: 'Jewish History', description: 'Explore key events in Jewish historical timeline' },
  { id: 'ancient-egypt', name: 'Ancient Egypt', description: 'Discover the civilization of ancient Egypt' },
  { id: 'ancient-greece', name: 'Ancient Greece', description: 'Navigate through the classical Greek civilization' },
  { id: 'ancient-rome', name: 'Ancient Rome', description: 'Navigate through the Roman civilization' },
  { id: 'christian', name: 'Christian History', description: 'Explore the spread and development of Christianity' },
  { id: 'islamic', name: 'Islamic History', description: 'Learn about key events in Islamic civilization' }
];

const HistoricalMapsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container mx-auto py-4 px-4">
        {/* Disclaimer */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-200 border-2 border-yellow-400 text-yellow-900 rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 text-lg font-bold animate-pulse" style={{ fontSize: 22 }}>
              <svg className="w-7 h-7 text-yellow-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" /></svg>
              DISCLAIMER: This feature is <span className="underline mx-1">FAR FROM COMPLETE</span> and is a work in progress!
            </div>
          </div>
          <p className="text-gray-600 text-center">
            Explore historical events through interactive maps. Select a map below to begin your journey.
          </p>
        </div>
        
        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableMaps.map((map) => (
            <Link to={`/historical-map/${map.id}`} key={map.id} className="no-underline">
              <div className={`bg-gradient-to-br from-white via-${getMapColor(map.id)}-50 to-${getMapColor(map.id)}-100 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow h-full border border-gray-100 flex flex-col items-center justify-between min-h-[260px]`}>
                <div className="mb-4 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-${getMapColor(map.id)}-100 shadow-lg mb-2`}>
                    <svg className={`w-7 h-7 text-${getMapColor(map.id)}-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" x2="9" y1="3" y2="18"></line>
                      <line x1="15" x2="15" y1="6" y2="21"></line>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-timelingo-navy text-center">{map.name}</h3>
                  <p className="text-gray-500 text-base mb-4 text-center">{map.description}</p>
                </div>
                <Button variant="secondary" className="w-full text-base font-bold py-3 rounded-xl shadow-md bg-gradient-to-r from-timelingo-purple to-purple-700 hover:from-purple-700 hover:to-timelingo-purple transition-all">
                  Explore Map
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get a color based on map ID
const getMapColor = (mapId: string): string => {
  switch (mapId) {
    case 'jewish':
      return 'purple';
    case 'ancient-egypt':
      return 'amber';
    case 'ancient-greece':
      return 'green';
    case 'ancient-rome':
      return 'blue';
    case 'christian':
      return 'green';
    case 'islamic':
      return 'teal';
    default:
      return 'gray';
  }
};

export default HistoricalMapsList;
