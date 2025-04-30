
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import HomeHeader from './HomeHeader';
import HeroSection from './HeroSection';
import FeatureBanner from './FeatureBanner';
import EraSelectionSection from './EraSelectionSection';
import { HistoryEra, LearningTrackLevel } from '@/types';
import { getLessonProgress } from '@/services/progressService';
import { generateTrackForEra } from '@/data/trackData';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user, preferredEra, setPreferredEra } = useUser();
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<string | null>(preferredEra);

  useEffect(() => {
    // Initialize the selected era from user preferences
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
        // For authenticated users, fetch progress
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
    
    // If user is logged in, also save to their profile
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
        <HeroSection 
          user={user}
          preferredEra={selectedEra}
          isLoading={isLoading}
          learningTrack={learningTrack}
          handleToDashboard={handleToProfile}
          handleEraChange={handleEraSelection}
        />

        <FeatureBanner 
          handleViewLessons={handleViewLessons}
          handleDailyChallenge={handleDailyChallenge}
        />
        
        <EraSelectionSection 
          handleEraSelection={handleEraSelection}
        />
      </main>
    </div>
  );
};

export default Home;
