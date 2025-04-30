
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import DailyChallengeLoading from './DailyChallengeLoading';
import DailyChallengeError from './DailyChallengeError';
import DailyChallengeCompleted from './DailyChallengeCompleted';
import ChronologyChallenge from './chronology/ChronologyChallenge';
import DailyChallengeQuiz from './DailyChallengeQuiz';
import { DailyChallenge, HistoricalEvent } from '@/types';

interface DailyChallengeContainerProps {
  onComplete: () => void;
}

const DailyChallengeContainer = ({ onComplete }: DailyChallengeContainerProps) => {
  const { user } = useUser();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch today's challenge from the database
        const { data: todaysChallenge, error: challengeError } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('challenge_date', today)
          .maybeSingle();
        
        if (challengeError) {
          console.error("Error fetching daily challenge:", challengeError);
          throw challengeError;
        }
        
        // Check if user already completed today's challenge
        if (user && todaysChallenge) {
          const { data: userProgress } = await supabase
            .from('user_challenge_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('challenge_id', todaysChallenge.id)
            .maybeSingle();
            
          if (userProgress) {
            setAlreadyCompleted(true);
          }
        }
        
        if (todaysChallenge) {
          console.log("Found challenge for today:", todaysChallenge);
          
          // Create a properly formatted challenge object
          const formattedChallenge: DailyChallenge = {
            ...todaysChallenge,
            // Safely parse options if it's a string
            options: typeof todaysChallenge.options === 'string' 
              ? JSON.parse(todaysChallenge.options)
              : (todaysChallenge.options || [])
          };
          
          setChallenge(formattedChallenge);
        } else {
          console.log("No challenge found for today, using fallback");
          // Fallback to mock chronology challenge data if no challenge found
          const mockEvents: HistoricalEvent[] = [
            {
              id: '1',
              description: 'The signing of the Declaration of Independence',
              year: 1776,
              explanation: 'Marked the formation of the United States of America'
            },
            {
              id: '2',
              description: 'The fall of the Berlin Wall',
              year: 1989,
              explanation: 'Symbolized the end of the Cold War'
            },
            {
              id: '3',
              description: 'The first Moon landing',
              year: 1969,
              explanation: 'Neil Armstrong became the first human to walk on the Moon'
            },
            {
              id: '4',
              description: 'The invention of the World Wide Web',
              year: 1989,
              explanation: 'Tim Berners-Lee proposed the global hypertext system'
            },
            {
              id: '5',
              description: 'The discovery of Tutankhamun\'s tomb',
              year: 1922,
              explanation: 'Howard Carter found the intact tomb of the Egyptian pharaoh'
            }
          ];
          
          setChallenge({
            id: 'fallback-challenge-' + Date.now(),
            challenge_date: today,
            events: mockEvents,
            topic: 'Modern History Milestones',
            xp_reward: 25,
            question: null,
            options: null,
            correct_answer: null,
            explanation: null
          });
        }
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
        setError('We had trouble loading today\'s challenge. Please try again.');
        toast.error('Failed to load today\'s challenge');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyChallenge();
  }, [user, retryCount]);

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  if (loading) {
    return <DailyChallengeLoading />;
  }

  if (alreadyCompleted) {
    return <DailyChallengeCompleted onComplete={onComplete} />;
  }

  if (!challenge) {
    return (
      <DailyChallengeError
        error={error || "No challenge available"}
        onRetry={handleRetry}
        onComplete={onComplete}
        showErrorDialog={showErrorDialog}
        setShowErrorDialog={setShowErrorDialog}
      />
    );
  }

  // Determine which type of challenge to display - check both question AND options exist
  if (challenge.question && challenge.options && Array.isArray(challenge.options) && challenge.options.length > 0) {
    return (
      <DailyChallengeQuiz 
        challenge={challenge}
        onComplete={onComplete}
      />
    );
  } else if (challenge.events && Array.isArray(challenge.events) && challenge.events.length > 0) {
    return (
      <ChronologyChallenge 
        events={challenge.events} 
        challengeId={challenge.id} 
        onComplete={onComplete} 
      />
    );
  }

  // If we got here, the challenge data is incomplete or invalid
  return (
    <DailyChallengeError
      error="Invalid challenge format - missing required data"
      onRetry={handleRetry}
      onComplete={onComplete}
      showErrorDialog={showErrorDialog}
      setShowErrorDialog={setShowErrorDialog}
    />
  );
};

export default DailyChallengeContainer;
