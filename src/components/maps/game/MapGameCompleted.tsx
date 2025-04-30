
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import XpBadge from '@/components/XpBadge';
import MapNavigation from '@/components/maps/MapNavigation';

interface MapGameCompletedProps {
  totalScore: number;
  entriesCount: number;
  xpAwarded: number;
  onPlayAgain: () => void;
  showXpBadge: boolean;
}

const MapGameCompleted: React.FC<MapGameCompletedProps> = ({
  totalScore,
  entriesCount,
  xpAwarded,
  onPlayAgain,
  showXpBadge
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MapNavigation />
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="h-2 bg-gradient-to-r from-timelingo-purple to-purple-400"></div>
          <div className="p-6 text-center">
            <div className="mb-4 bg-timelingo-purple/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Award size={40} className="text-timelingo-purple" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Completed!</h2>
            <p className="text-gray-600 mb-6">You've completed all map entries in this game.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-xl font-semibold text-gray-800 mb-1">Final Score</div>
              <div className="text-4xl font-bold text-timelingo-purple">
                {Math.round(totalScore / entriesCount)}
                <span className="text-gray-500 text-lg">/100</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">Average across {entriesCount} maps</p>
            </div>
            
            {showXpBadge && (
              <div className="flex justify-center mb-6">
                <div className="bg-timelingo-purple/10 rounded-lg p-4 flex items-center">
                  <XpBadge xp={xpAwarded} />
                  <span className="ml-3 text-gray-800">XP Earned</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={onPlayAgain}
                className="border-timelingo-purple text-timelingo-purple hover:bg-timelingo-purple/10"
              >
                Play Again
              </Button>
              <Button 
                onClick={() => navigate('/map-games')}
                className="bg-timelingo-purple hover:bg-timelingo-purple/90"
              >
                Back to Map Games
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapGameCompleted;
