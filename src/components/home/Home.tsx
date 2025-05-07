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
import LearningPath from './LearningPath';
import { eraOptions } from './hero/EraOptions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const Home = () => {
  const navigate = useNavigate();
  const { user, preferredEra, setPreferredEra } = useUser();
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<string | null>(preferredEra);
  const [showTrackModal, setShowTrackModal] = useState(true);

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
          await getLessonProgress(user.id);
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
      {/* Stay on track modal */}
      <Dialog open={showTrackModal} onOpenChange={setShowTrackModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/images/avatars/Johan.png" alt="Johan" className="w-24 h-24 mb-2" />
              <DialogTitle className="text-center text-2xl font-bold">Stay on track</DialogTitle>
              <DialogDescription className="text-center text-lg">
                We'll send you reminders so you don't forget to practice.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 mt-4">
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
              onClick={() => setShowTrackModal(false)}
            >
              Allow Notifications
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => setShowTrackModal(false)}
            >
              Not Now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        {/* Main Duolingo-style Learning Path */}
        <h2 className="text-3xl font-extrabold text-center mb-8 mt-12 text-timelingo-navy drop-shadow-lg">Your Learning Journey</h2>
        <div className="flex justify-center">
          <LearningPath
            chapters={learningTrack}
            era={selectedEra}
            onViewMap={() => {
              if (selectedEra) {
                navigate(`/historical-map/${selectedEra}`);
              } else {
                navigate('/historical-map/list');
              }
            }}
            onChangeEra={handleEraSelection}
            changingEra={isLoading}
            eraOptions={eraOptions}
            onLessonClick={() => {}}
          />
        </div>
        <EraSelectionSection 
          handleEraSelection={handleEraSelection}
        />
      </main>
    </div>
  );
};

export default Home;
