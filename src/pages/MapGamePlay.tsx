import React, { useEffect, useRef } from 'react';
import MapNavigation from '@/components/maps/MapNavigation';
import { useMapGame } from '@/hooks/useMapGame';
import MapGameLoading from '@/components/maps/game/MapGameLoading';
import MapGameNotFound from '@/components/maps/game/MapGameNotFound';
import MapGameCompleted from '@/components/maps/game/MapGameCompleted';
import GameInterface from '@/components/maps/game/GameInterface';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MapGamePlay: React.FC = () => {
  const {
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
    user
  } = useMapGame();
  
  // Increment play count when game is loaded
  const hasIncremented = useRef(false);
  useEffect(() => {
    if (game && entries && entries.length > 0 && !hasIncremented.current) {
      hasIncremented.current = true;
      supabase.rpc('increment_play_count', { game_id: game.id });
    }
  }, [game, entries]);
  
  if (isLoading) {
    return <MapGameLoading />;
  }
  
  if (!game || !entries || entries.length === 0) {
    return <MapGameNotFound />;
  }
  
  if (gameCompleted) {
    return (
      <MapGameCompleted
        totalScore={totalScore}
        entriesCount={entries.length}
        xpAwarded={xpAwarded}
        onPlayAgain={handlePlayAgain}
        showXpBadge={!!user}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MapNavigation />
      <div className="container mx-auto flex justify-end mt-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: 'Link copied!', description: 'Game link copied to clipboard.' });
          }}
          className="px-4 py-2 bg-yellow-400 text-timelingo-navy rounded-lg shadow hover:bg-yellow-300 font-semibold"
        >
          Share
        </button>
      </div>
      
      {currentEntry && (
        <GameInterface
          game={game}
          currentEntry={currentEntry}
          currentEntryIndex={currentEntryIndex}
          entriesLength={entries.length}
          userGuess={userGuess}
          setUserGuess={setUserGuess}
          showResult={showResult}
          score={score}
          yearRange={yearRange}
          isFullscreenOpen={isFullscreenOpen}
          setIsFullscreenOpen={setIsFullscreenOpen}
          handleSubmitGuess={handleSubmitGuess}
          handleNextEntry={handleNextEntry}
          handlePreviousEntry={handlePreviousEntry}
          handleImageError={handleImageError}
          navigateToGames={() => navigate('/map-games')}
        />
      )}
    </div>
  );
};

export default MapGamePlay;
