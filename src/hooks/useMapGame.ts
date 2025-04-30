
import { useState, useEffect } from 'react';
import { useMapGameData } from './useMapGameData';
import { useMapGameState } from './useMapGameState';
import { parseYearRangeFromHint } from '@/utils/mapGameUtils';

export function useMapGame() {
  const { gameId, game, entries, isLoading } = useMapGameData();
  const [yearRange, setYearRange] = useState<[number, number]>([1000, 2023]);
  
  const {
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
  } = useMapGameState(gameId, entries);

  // Set initial year range based on current entry hint or default range
  useEffect(() => {
    if (currentEntry?.hint) {
      const parsedRange = parseYearRangeFromHint(currentEntry.hint);
      setYearRange(parsedRange);
    } else {
      // Default range
      setYearRange([1000, 2023]);
    }
  }, [currentEntry]);

  return {
    game,
    entries,
    isLoading,
    currentEntry,
    currentEntryIndex,
    userGuess,
    setUserGuess,
    showResult,
    score,
    yearRange,
    isFullscreenOpen,
    setIsFullscreenOpen,
    gameCompleted,
    totalScore,
    xpAwarded,
    handleSubmitGuess,
    handleNextEntry,
    handlePreviousEntry,
    handleImageError,
    handlePlayAgain,
    navigate,
    user  // Make sure we're returning the user
  };
}
