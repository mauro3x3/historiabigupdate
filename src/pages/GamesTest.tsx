import React, { useState } from 'react';
import { useInteractiveGames } from '@/hooks/useInteractiveGames';
import SortingGame from '@/components/games/SortingGame';
import { Play, RotateCcw, Trophy, Clock } from 'lucide-react';

export default function GamesTest() {
  const { games, loading, error } = useInteractiveGames();
  const [selectedGame, setSelectedGame] = useState<number>(0);
  const [gameStats, setGameStats] = useState<{ correct: number; total: number; score: number }>({
    correct: 0,
    total: 0,
    score: 0
  });
  const [gameHistory, setGameHistory] = useState<Array<{ correct: boolean; score: number; timestamp: Date }>>([]);

  const handleGameComplete = (correct: boolean, score: number) => {
    setGameStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      score: prev.score + score
    }));
    
    setGameHistory(prev => [...prev, { correct, score, timestamp: new Date() }]);
  };

  const resetStats = () => {
    setGameStats({ correct: 0, total: 0, score: 0 });
    setGameHistory([]);
  };

  const nextGame = () => {
    if (selectedGame < games.length - 1) {
      setSelectedGame(selectedGame + 1);
    }
  };

  const prevGame = () => {
    if (selectedGame > 0) {
      setSelectedGame(selectedGame - 1);
    }
  };

  const randomGame = () => {
    const randomIndex = Math.floor(Math.random() * games.length);
    setSelectedGame(randomIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white/60">Loading games...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error loading games</div>
          <div className="text-white/60">{error}</div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/60 text-lg">No games available</div>
        </div>
      </div>
    );
  }

  const currentGame = games[selectedGame];
  
  // Debug: Log the current game data
  console.log('Current game data:', currentGame);
  const averageScore = gameStats.total > 0 ? Math.round(gameStats.score / gameStats.total) : 0;
  const accuracy = gameStats.total > 0 ? Math.round((gameStats.correct / gameStats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Games Test Area</h1>
          <p className="text-white/70">Test and perfect the interactive games before release</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Game Stats
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-sm">Games Played</div>
                  <div className="text-2xl font-bold text-white">{gameStats.total}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-sm">Accuracy</div>
                  <div className="text-2xl font-bold text-white">{accuracy}%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-sm">Average Score</div>
                  <div className="text-2xl font-bold text-white">{averageScore}</div>
                </div>
                
                <button
                  onClick={resetStats}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Stats
                </button>
              </div>
            </div>

            {/* Game History */}
            {gameHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Games
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {gameHistory.slice(-10).reverse().map((game, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        {game.correct ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        )}
                        <span className="text-white text-sm">Game {gameHistory.length - index}</span>
                      </div>
                      <span className="text-white/60 text-sm">{game.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {/* Game Navigation */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Game {selectedGame + 1} of {games.length}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevGame}
                    disabled={selectedGame === 0}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextGame}
                    disabled={selectedGame === games.length - 1}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
                  >
                    Next
                  </button>
                  <button
                    onClick={randomGame}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    Random
                  </button>
                </div>
              </div>
              
              <div className="text-white/70 text-sm">
                <strong>Question:</strong> {currentGame.prompt}
              </div>
            </div>

            {/* Game Component */}
            <SortingGame 
              question={currentGame} 
              onComplete={handleGameComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
