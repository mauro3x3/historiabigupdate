
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import XpBadge from '../XpBadge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyXp, setDailyXp] = useState(25);

  useEffect(() => {
    // Check if user has completed today's challenge
    const checkTodaysCompletion = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        
        // First get today's challenge
        const { data: todaysChallenge, error } = await supabase
          .from('daily_challenges')
          .select('id, xp_reward')
          .eq('challenge_date', today)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching challenge:", error);
          return;
        }
          
        if (todaysChallenge) {
          // Set the XP reward
          setDailyXp(todaysChallenge.xp_reward || 25);
          
          // Check if user has already completed it
          const { data: userProgress } = await supabase
            .from('user_challenge_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('challenge_id', todaysChallenge.id)
            .maybeSingle();
            
          if (userProgress) {
            setHasCompletedToday(true);
          }
        }
      } catch (error) {
        console.error('Error checking challenge completion:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTodaysCompletion();
  }, [user]);

  const handleStartChallenge = () => {
    navigate('/daily-challenge');
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-timelingo-navy to-indigo-900 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">Daily Challenge</h3>
        <XpBadge xp={dailyXp} />
      </div>
      <p className="text-sm text-gray-200 mb-4">
        Test your knowledge with today's challenge about niche historical facts.
      </p>
      <div className="animate-bounce-small w-fit mx-auto mb-3">
        <div className="text-3xl">{isLoading ? '⏳' : '👑'}</div>
      </div>
      <Button 
        className="w-full bg-timelingo-gold hover:bg-amber-500 text-gray-900"
        onClick={handleStartChallenge}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : hasCompletedToday ? 'View Results' : 'Begin Challenge'}
      </Button>
    </div>
  );
};

export default DailyChallenge;
