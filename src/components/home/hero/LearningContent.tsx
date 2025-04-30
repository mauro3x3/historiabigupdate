
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, Sparkles, Map } from 'lucide-react';
import LearningTrack from '@/components/dashboard/LearningTrack';
import { EraThemeProps } from './EraTheme';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EraOptionsList } from './EraOptions';

interface LearningContentProps {
  isLoading: boolean;
  preferredEra: string | null;
  learningTrack: any[];
  eraTheme: EraThemeProps;
  onEraChange: (era: string) => Promise<void>;
  changingEra: boolean;
}

const LearningContent: React.FC<LearningContentProps> = ({ 
  isLoading, 
  preferredEra, 
  learningTrack, 
  eraTheme,
  onEraChange,
  changingEra
}) => {
  const navigate = useNavigate();
  
  const handleViewMap = () => {
    if (preferredEra) {
      navigate(`/historical-map/${preferredEra}`);
    } else {
      navigate('/historical-map/list');
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className={`h-12 w-12 border-4 border-t-${eraTheme.accent}-500 border-b-${eraTheme.accent}-500 rounded-full animate-spin mx-auto`}></div>
        <p className="mt-4 text-gray-600">Loading your learning journey...</p>
      </div>
    );
  }

  if (learningTrack.length > 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{eraTheme.icon}</span>
            <h3 className={`text-${eraTheme.accent}-700 font-medium`}>
              {eraTheme.name} Learning Path
            </h3>
            <span className="bg-gradient-to-r from-yellow-300 to-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </span>
          </div>
          <div className="flex gap-2 relative z-10">
            <Button 
              variant="default"
              size="sm"
              onClick={handleViewMap}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 relative z-10"
            >
              <Map size={16} />
              <span>View Map</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 relative z-10"
                >
                  <BookOpen className="h-4 w-4" />
                  Change Era
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white z-50">
                <EraOptionsList onEraChange={onEraChange} changingEra={changingEra} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className={`bg-gradient-to-r ${eraTheme.bgGradient} rounded-lg p-4 relative`}>
          <LearningTrack levels={learningTrack} themeColor={eraTheme.accent} />
        </div>
      </div>
    );
  }

  if (preferredEra) {
    return (
      <div className={`text-center py-10 bg-gradient-to-r ${eraTheme.bgGradient} rounded-lg relative`}>
        <div className="text-4xl mb-4">{eraTheme.icon}</div>
        <h3 className="text-xl font-medium text-gray-700">Start your history adventure</h3>
        <p className="text-sm text-gray-500 mb-6">Select a historical era to begin your personalized learning journey</p>
        <div className="flex justify-center gap-3 relative z-10">
          <Button
            onClick={handleViewMap}
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 relative z-10"
          >
            <Map size={16} />
            <span>View Map</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 relative z-10"
              >
                <BookOpen className="h-4 w-4" />
                Change Era
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-white z-50">
              <EraOptionsList onEraChange={onEraChange} changingEra={changingEra} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg relative">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-xl font-medium text-gray-700">Start your history adventure</h3>
      <p className="text-sm text-gray-500 mb-6">Select a historical era to begin your personalized learning journey</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-2xl mx-auto mb-6">
        {eraOptions.map((era) => (
          <Button
            key={era.code}
            variant="outline"
            className="flex flex-col items-center gap-1 p-4 h-auto relative z-10"
            onClick={() => onEraChange(era.code)}
          >
            <span className="text-2xl mb-1">{era.emoji}</span>
            <span className="text-xs text-center">{era.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

import { eraOptions } from './EraOptions';

export default LearningContent;
