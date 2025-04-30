
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MapGameEntry } from '@/types/mapGame';
import FullScreenImage from '@/components/maps/event/FullScreenImage';
import MapDisplay from './MapDisplay';
import GuessInput from './GuessInput';
import ResultDisplay from './ResultDisplay';
import GuessControlFooter from './GuessControlFooter';
import GameHeader from './GameHeader';
import GameProgress from './GameProgress';

interface GameInterfaceProps {
  game: {
    title: string;
    description: string | null;
  };
  currentEntry: MapGameEntry;
  currentEntryIndex: number;
  entriesLength: number;
  userGuess: number | null;
  setUserGuess: (guess: number | null) => void;
  showResult: boolean;
  score: number;
  yearRange: [number, number];
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (open: boolean) => void;
  handleSubmitGuess: () => void;
  handleNextEntry: () => void;
  handlePreviousEntry: () => void;
  handleImageError: () => void;
  navigateToGames: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({
  game,
  currentEntry,
  currentEntryIndex,
  entriesLength,
  userGuess,
  setUserGuess,
  showResult,
  score,
  yearRange,
  isFullscreenOpen,
  setIsFullscreenOpen,
  handleSubmitGuess,
  handleNextEntry,
  handlePreviousEntry,
  handleImageError,
  navigateToGames
}) => {
  return (
    <div className="container mx-auto p-6">
      <GameHeader 
        title={game.title}
        description={game.description}
        navigateToGames={navigateToGames}
      />
      
      <GameProgress 
        currentEntryIndex={currentEntryIndex}
        entriesLength={entriesLength}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapDisplay 
          currentEntry={currentEntry}
          hint={currentEntry.hint}
          showResult={showResult}
          isFullscreenOpen={isFullscreenOpen}
          setIsFullscreenOpen={setIsFullscreenOpen}
          handleImageError={handleImageError}
        />
        
        <Card className="border-gray-200">
          <CardHeader className="bg-gradient-to-r from-timelingo-purple/10 to-timelingo-purple/5">
            <CardTitle>Make Your Guess</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {!showResult ? (
              <GuessInput 
                userGuess={userGuess}
                setUserGuess={setUserGuess}
                yearRange={yearRange}
              />
            ) : (
              <ResultDisplay 
                userGuess={userGuess!}
                correctYear={currentEntry.correct_year}
                score={score}
              />
            )}
          </CardContent>
          <CardFooter className="p-0">
            <GuessControlFooter 
              currentEntryIndex={currentEntryIndex}
              showResult={showResult}
              userGuess={userGuess}
              handleSubmitGuess={handleSubmitGuess}
              handlePreviousEntry={handlePreviousEntry}
              handleNextEntry={handleNextEntry}
              entriesLength={entriesLength}
            />
          </CardFooter>
        </Card>
      </div>
      
      {/* Fullscreen Image Dialog */}
      <FullScreenImage
        open={isFullscreenOpen}
        onOpenChange={setIsFullscreenOpen}
        imageUrl={currentEntry?.image_url || ''}
        title={`Map from ${currentEntry?.correct_year}`}
        onImageError={handleImageError}
      />
    </div>
  );
};

export default GameInterface;
