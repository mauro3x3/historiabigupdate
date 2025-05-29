import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LearningTrack from './LearningTrack';
import { LearningTrackLevel } from '@/types';
import EraLabel from '@/components/admin/lesson/EraLabel';
import { BookOpen, Map } from 'lucide-react';

interface LearningJourneyProps {
  currentEra: string | null;
  learningTrack: LearningTrackLevel[];
  isLoading: boolean;
}

const LearningJourney = ({ currentEra, learningTrack, isLoading }: LearningJourneyProps) => {
  const navigate = useNavigate();

  const handleViewHistoricalMap = () => {
    if (currentEra) {
      navigate(`/historical-map/${currentEra}`);
    } else {
      navigate('/historical-map/list');
    }
  };

  if (isLoading) {
    return (
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-timelingo-navy">Your Learning Journey</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center py-10">
            <div className="h-12 w-12 border-4 border-t-timelingo-purple border-b-timelingo-purple rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your learning journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Make sure we have lessons to show
  const hasLessons = learningTrack && learningTrack.some(level => level.lessons && level.lessons.length > 0);

  if (!hasLessons) return null;

  return (
    <div className="md:col-span-2">
      <h2 className="text-xl font-bold mb-4 text-timelingo-navy flex items-center gap-2">
        Your Learning Journey
        {currentEra && (
          <span className="text-sm font-normal bg-timelingo-gold/20 text-timelingo-navy px-3 py-1 rounded-full flex items-center">
            <BookOpen size={14} className="mr-1 text-timelingo-gold" />
            <EraLabel era={currentEra} />
          </span>
        )}
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleViewHistoricalMap}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Map size={16} />
            <span>View Historical Map</span>
          </Button>
        </div>
        <div className="w-full h-[70vh] md:h-[80vh] overflow-y-auto pr-2">
          <LearningTrack levels={learningTrack} />
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;
