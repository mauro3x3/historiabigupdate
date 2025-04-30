
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { MapGameEntry } from '@/types/mapGame';
import { toast } from '@/components/ui/use-toast';
import { playCorrectSound, playWrongSound } from '@/utils/audioUtils';
import { calculateScore } from '@/utils/mapGameUtils';

export function useMapGameState(
  gameId: string | undefined,
  entries: MapGameEntry[] | undefined
) {
  const { user, addXp } = useUser();
  const navigate = useNavigate();
  
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  
  const currentEntry = entries && entries.length > 0 ? entries[currentEntryIndex] : null;
  
  const handleSubmitGuess = async () => {
    if (!user || !currentEntry || userGuess === null) return;
    
    const calculatedScore = calculateScore(userGuess, currentEntry.correct_year);
    setScore(calculatedScore);
    setShowResult(true);
    setTotalScore(prevTotal => prevTotal + calculatedScore);
    
    // Play sound effect based on score
    if (calculatedScore > 90) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    
    // Save guess to database
    const { error } = await supabase
      .from('map_game_guesses')
      .insert({
        entry_id: currentEntry.id,
        user_id: user.id,
        guessed_year: userGuess,
        score: calculatedScore
      });
      
    if (error) {
      console.error('Error saving guess:', error);
    }
  };
  
  const handleNextEntry = () => {
    if (!entries) return;
    
    if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex(currentEntryIndex + 1);
      setUserGuess(null);
      setShowResult(false);
    } else {
      // Game completed
      setGameCompleted(true);
      
      // Award XP if user is logged in
      if (user) {
        const xpToAward = 100;
        addXp(xpToAward);
        setXpAwarded(xpToAward);
        
        toast({
          title: 'Game completed!',
          description: `You earned ${xpToAward} XP for completing this game.`
        });
      }
    }
  };
  
  const handlePreviousEntry = () => {
    if (currentEntryIndex > 0) {
      setCurrentEntryIndex(currentEntryIndex - 1);
      setUserGuess(null);
      setShowResult(false);
    }
  };
  
  const handleImageError = () => {
    toast({
      title: "Image Error",
      description: "The map image could not be loaded",
      variant: "destructive"
    });
  };
  
  const handlePlayAgain = () => {
    setCurrentEntryIndex(0);
    setUserGuess(null);
    setShowResult(false);
    setGameCompleted(false);
    setTotalScore(0);
  };

  return {
    currentEntryIndex,
    userGuess,
    setUserGuess,
    showResult,
    score,
    isFullscreenOpen,
    setIsFullscreenOpen,
    gameCompleted,
    totalScore,
    xpAwarded,
    currentEntry,
    handleSubmitGuess,
    handleNextEntry,
    handlePreviousEntry,
    handleImageError,
    handlePlayAgain,
    navigate,
    user
  };
}
