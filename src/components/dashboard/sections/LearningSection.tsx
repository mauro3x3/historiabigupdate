import React from 'react';
import { useNavigate } from 'react-router-dom';
import LearningJourney from '../LearningJourney';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearningSectionProps {
  currentEra: HistoryEra;
  learningTrack: LearningTrackLevel[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const LearningSection: React.FC<LearningSectionProps> = ({
  currentEra,
  learningTrack,
  isLoading,
  title = "Your Learning Journey",
  description = "Continue your history learning path and master new concepts."
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2 text-timelingo-navy">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Follow your personalized learning path to master historical concepts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <LearningJourney
          currentEra={currentEra}
          learningTrack={learningTrack}
          isLoading={isLoading}
        />
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-3 text-timelingo-navy">Quick Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-timelingo-purple mt-0.5" />
              <span>Click on any era to explore its historical content</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-timelingo-purple mt-0.5" />
              <span>Complete lessons to unlock new historical insights</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-timelingo-purple mt-0.5" />
              <span>Track your progress through the timeline</span>
            </li>
          </ul>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/era-selection')}
        >
          Change Learning Era
        </Button>
      </div>
    </div>
  );
};

export default LearningSection;
