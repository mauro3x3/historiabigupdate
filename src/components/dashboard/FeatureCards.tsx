import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Book, Map, Star, GamepadIcon, CalendarCheck } from 'lucide-react';

const FeatureCards = () => {
  const navigate = useNavigate();

  const handleViewAllLessons = () => {
    navigate('/all-lessons');
  };
  
  const handleExploreHistoricalMaps = () => {
    navigate('/historical-map/list');
  };

  const handleGoHome = () => {
    navigate('/home');
  };
  
  const handleMapGames = () => {
    navigate('/map-games');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-10">
      {/* All Lessons Card */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4 h-full">
          <div className="bg-blue-100 rounded-full p-3">
            <Book className="h-6 w-6 text-timelingo-teal" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-timelingo-navy mb-2">All Lessons</h3>
            <p className="text-sm text-gray-500 mb-4">Explore our complete collection of historical lessons</p>
            <Button 
              onClick={handleViewAllLessons} 
              variant="secondary"
              className="w-full"
            >
              View Lessons
            </Button>
          </div>
        </div>
      </div>
      
      {/* Historical Maps Card */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4 h-full">
          <div className="bg-green-100 rounded-full p-3">
            <Map className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-timelingo-navy mb-2">Historical Maps</h3>
            <p className="text-sm text-gray-500 mb-4">Explore historical events through interactive maps</p>
            <Button 
              onClick={handleExploreHistoricalMaps} 
              variant="secondary"
              className="w-full"
            >
              Explore Maps
            </Button>
          </div>
        </div>
      </div>
      
      {/* Map Games Card */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4 h-full">
          <div className="bg-indigo-100 rounded-full p-3">
            <GamepadIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-timelingo-navy mb-2">Map Games</h3>
            <p className="text-sm text-gray-500 mb-4">Test your knowledge by guessing years of historical maps</p>
            <Button 
              onClick={handleMapGames} 
              variant="secondary"
              className="w-full"
            >
              Play Games
            </Button>
          </div>
        </div>
      </div>
      
      {/* Discover More Card */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4 h-full">
          <div className="bg-amber-100 rounded-full p-3">
            <Star className="h-6 w-6 text-timelingo-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-timelingo-navy mb-2">Discover More</h3>
            <p className="text-sm text-gray-500 mb-4">Discover new eras and customize your history journey</p>
            <Button 
              onClick={handleGoHome} 
              variant="secondary"
              className="w-full"
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
