
import React from 'react';
import MapNavigation from '@/components/maps/MapNavigation';
import { useMapGame } from '@/hooks/useMapGame';
import MapGameLoading from '@/components/maps/game/MapGameLoading';
import MapGameNotFound from '@/components/maps/game/MapGameNotFound';
import MapGameCompleted from '@/components/maps/game/MapGameCompleted';
import GameInterface from '@/components/maps/game/GameInterface';

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
