
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import MapNavigation from '@/components/maps/MapNavigation';

const MapGameNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MapNavigation />
      <div className="container mx-auto p-6 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 max-w-lg mx-auto mt-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Map size={32} className="text-timelingo-purple" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Game not found</h3>
          <p className="mb-6 text-gray-600">This game doesn't exist or has no entries.</p>
          <Button onClick={() => navigate('/map-games')} className="bg-timelingo-purple hover:bg-timelingo-purple/90">
            Back to Map Games
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapGameNotFound;
