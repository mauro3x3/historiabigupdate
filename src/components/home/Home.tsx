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
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, preferredEra, setPreferredEra } = useUser();
  const [learningTrack, setLearningTrack] = useState<LearningTrackLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<string | null>(preferredEra);
  const [showTrackModal, setShowTrackModal] = useState(true);

  // Helper: get index and next/prev era
  const eraList = eraOptions.map(e => e.code);
  const currentEraIdx = selectedEra ? eraList.indexOf(selectedEra) : 0;
  const prevEra = eraList[(currentEraIdx - 1 + eraList.length) % eraList.length];
  const nextEra = eraList[(currentEraIdx + 1) % eraList.length];

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

  // Keyboard navigation for era
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        handleEraSelection(prevEra);
      } else if (e.key === 'ArrowRight') {
        handleEraSelection(nextEra);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevEra, nextEra]);

  // Helper: background by era
  const eraBg = (era: string | null) => {
    switch (era) {
      case 'jewish': return 'from-yellow-100 to-blue-100';
      case 'islamic': return 'from-yellow-200 to-orange-100';
      case 'christian': return 'from-purple-100 to-blue-50';
      case 'chinese': return 'from-green-100 to-yellow-50';
      case 'ancient-greece': return 'from-blue-100 to-white';
      case 'ancient-rome': return 'from-red-100 to-yellow-100';
      default: return 'from-gray-50 to-purple-50';
    }
  };

  const handleViewLessons = () => {
    navigate('/all-lessons');
  };

  const handleToProfile = () => {
    navigate('/profile');
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
    <div className={`min-h-screen bg-gradient-to-b ${eraBg(selectedEra)}`}>
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
      <main className="container mx-auto py-8 px-4 relative">
        {/* Left Arrow Button */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-4 z-30 hover:bg-purple-100 transition"
          style={{ fontSize: 32, display: eraList.length > 1 ? 'block' : 'none' }}
          onClick={() => {
            const audio = new Audio('/sounds/swoosh.mp3');
            audio.volume = 1;
            audio.muted = false;
            audio.play().catch((err) => {
              console.error('Audio play error:', err);
            });
            handleEraSelection(prevEra);
          }}
          aria-label="Previous Era"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        {/* Right Arrow Button */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-4 z-30 hover:bg-purple-100 transition"
          style={{ fontSize: 32, display: eraList.length > 1 ? 'block' : 'none' }}
          onClick={() => {
            const audio = new Audio('/sounds/swoosh.mp3');
            audio.volume = 1;
            audio.muted = false;
            audio.play().catch((err) => {
              console.error('Audio play error:', err);
            });
            handleEraSelection(nextEra);
          }}
          aria-label="Next Era"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
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
