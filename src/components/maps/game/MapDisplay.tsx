
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Maximize } from 'lucide-react';
import { MapGameEntry } from '@/types/mapGame';

interface MapDisplayProps {
  currentEntry: MapGameEntry;
  hint: string | null;
  showResult: boolean;
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (open: boolean) => void;
  handleImageError: () => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  currentEntry,
  hint,
  showResult,
  isFullscreenOpen,
  setIsFullscreenOpen,
  handleImageError
}) => {
  return (
    <Card className="overflow-hidden border-gray-200">
      <CardHeader className="bg-gradient-to-r from-timelingo-purple/10 to-timelingo-purple/5">
        <CardTitle>When was this map from?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        <div 
          className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md" 
          onClick={() => setIsFullscreenOpen(true)}
        >
          <img 
            src={currentEntry.image_url} 
            alt={`Map from ${currentEntry.correct_year}`}
            className="w-full max-h-96 object-contain"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <Maximize className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg" size={32} />
          </div>
        </div>
        
        {hint && !showResult && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-md w-full">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Hint:</span> {hint}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapDisplay;
