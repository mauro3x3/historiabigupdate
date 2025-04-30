import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { getLessonProgress } from '@/services/progressService';
import { generateTrackForEra } from '@/data/trackData';
import { toast } from 'sonner';

import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/home/HeroSection';
import FeatureBanner from '@/components/home/FeatureBanner';
import ScenariosSection from '@/components/home/ScenariosSection';
import EraSelectionSection from '@/components/home/EraSelectionSection';
import { VideosSection } from '@/components/dashboard/sections';
import DailyHistoricalEventsGame from '@/components/DailyHistoricalEventsGame';
import GuestContent from '@/components/home/hero/GuestContent';

const NAV_LINKS = [
  { label: 'Videos', href: '/videos', icon: '🎬' },
  { label: 'All Lessons', href: '/all-lessons', icon: '📚' },
  { label: 'Maps', href: '/historical-map/list', icon: '🗺️' },
  { label: 'Games', href: '/map-games', icon: '🎮' },
  { label: 'Explore Eras', href: '/onboarding', icon: '⏳' },
  { label: 'Profile', href: '/profile', icon: '👤' },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, preferredEra, setPreferredEra } = useUser();
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<string | null>(preferredEra);

  useEffect(() => {
    setSelectedEra(preferredEra);
  }, [preferredEra]);

  useEffect(() => {
    const loadLearningTrack = async () => {
      if (!selectedEra) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (user) {
          const progressMap = await getLessonProgress(user.id);
        }
        
        const track = await generateTrackForEra(selectedEra as HistoryEra);
        setLearningTrack(track.levels);
      } catch (error) {
        console.error('Error loading learning track:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLearningTrack();
  }, [user, selectedEra]);

  const handleViewLessons = () => {
    navigate('/all-lessons');
  };

  const handleViewScenarios = () => {
    navigate('/all-lessons?tab=scenarios');
  };

  const handleToProfile = () => {
    navigate('/profile');
  };
  
  const handleDailyChallenge = () => {
    navigate('/daily-challenge');
  };

  const handleEraSelection = async (era: string) => {
    if (era === 'onboarding') {
      navigate('/onboarding');
      return;
    }

    setSelectedEra(era as HistoryEra);
    
    if (user) {
      try {
        await setPreferredEra(era as HistoryEra);
        toast.success(`Now exploring ${era.replace(/-/g, ' ')}!`);
      } catch (error) {
        console.error('Error setting preferred era:', error);
      }
    } else {
      toast.info('Sign in to save your preferences');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      <HomeHeader 
        user={user} 
        handleToDashboard={handleToProfile} 
      />
      <main className="container mx-auto py-8 px-4">
        {!user ? (
          <GuestContent />
        ) : (
          <HeroSection 
            user={user}
            preferredEra={selectedEra}
            isLoading={isLoading}
            learningTrack={learningTrack}
            handleToDashboard={handleToProfile}
            handleEraChange={handleEraSelection}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
