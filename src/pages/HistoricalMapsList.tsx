
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Map era data
const availableMaps = [
  { id: 'jewish', name: 'Jewish History', description: 'Explore key events in Jewish historical timeline' },
  { id: 'ancient-egypt', name: 'Ancient Egypt', description: 'Discover the civilization of ancient Egypt' },
  { id: 'rome-greece', name: 'Rome & Greece', description: 'Navigate through the classical civilizations' },
  { id: 'christian', name: 'Christian History', description: 'Explore the spread and development of Christianity' },
  { id: 'islamic', name: 'Islamic History', description: 'Learn about key events in Islamic civilization' }
];

const HistoricalMapsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container mx-auto py-4 px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-timelingo-navy">
            Historical Maps
          </h1>
        </div>
        
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-600">
            Explore historical events through interactive maps. Select a map below to begin your journey.
          </p>
        </div>
        
        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableMaps.map((map) => (
            <Link to={`/historical-map/${map.id}`} key={map.id} className="no-underline">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full border border-gray-100">
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${getMapColor(map.id)}-100`}>
                    <svg className={`w-6 h-6 text-${getMapColor(map.id)}-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" x2="9" y1="3" y2="18"></line>
                      <line x1="15" x2="15" y1="6" y2="21"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-timelingo-navy">{map.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{map.description}</p>
                <Button variant="secondary" className="w-full">
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
    case 'rome-greece':
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
