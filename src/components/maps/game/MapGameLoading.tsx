
import React from 'react';
import MapNavigation from '@/components/maps/MapNavigation';

const MapGameLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MapNavigation />
      <div className="container mx-auto p-6 text-center">
        <div className="mt-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading game...</p>
        </div>
      </div>
    </div>
  );
};

export default MapGameLoading;
