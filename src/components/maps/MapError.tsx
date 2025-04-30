
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapErrorProps {
  error: string;
  onRequestToken: () => void;
}

const MapError: React.FC<MapErrorProps> = ({ error, onRequestToken }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="text-red-500">{error}</p>
        <p className="text-sm mt-2">Try refreshing the page or check your internet connection.</p>
        <Button 
          onClick={onRequestToken} 
          className="mt-4"
        >
          Enter Map Token
        </Button>
      </div>
    </div>
  );
};

export default MapError;
