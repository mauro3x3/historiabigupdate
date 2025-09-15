import React, { useState, useEffect } from 'react';
import { InteractiveQuestion } from '@/hooks/useInteractiveGames';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface SortingGameProps {
  question: InteractiveQuestion;
  onComplete?: (correct: boolean, score: number) => void;
}

export default function SortingGame({ question, onComplete }: SortingGameProps) {
  const [items, setItems] = useState<string[]>([]);
  const [leftZone, setLeftZone] = useState<string[]>([]);
  const [middleZone, setMiddleZone] = useState<string[]>([]);
  const [rightZone, setRightZone] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Parse the question data
  useEffect(() => {
    // Handle undefined or missing data
    if (!question || !question.options || !question.correct_answers) {
      console.error('Invalid question data:', question);
      return;
    }

    const itemsList = question.options.split(', ').map(item => item.trim());
    const correctAnswers = question.correct_answers.split(', ').map(item => item.trim());
    
    // Shuffle the items for the game
    const shuffledItems = [...itemsList].sort(() => Math.random() - 0.5);
    
    setItems(shuffledItems);
    setLeftZone([]);
    setMiddleZone([]);
    setRightZone([]);
    setIsCompleted(false);
    setShowResult(false);
  }, [question]);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, zone: 'left' | 'middle' | 'right') => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove from all zones first
    setLeftZone(prev => prev.filter(item => item !== draggedItem));
    setMiddleZone(prev => prev.filter(item => item !== draggedItem));
    setRightZone(prev => prev.filter(item => item !== draggedItem));

    // Add to the target zone
    switch (zone) {
      case 'left':
        setLeftZone(prev => [...prev, draggedItem]);
        break;
      case 'middle':
        setMiddleZone(prev => [...prev, draggedItem]);
        break;
      case 'right':
        setRightZone(prev => [...prev, draggedItem]);
        break;
    }

    setDraggedItem(null);
  };

  const checkAnswer = () => {
    if (!question || !question.correct_answers) {
      console.error('Cannot check answer: question data is invalid');
      return;
    }
    
    const correctAnswers = question.correct_answers.split(', ').map(item => item.trim());
    
    // Create expected zones based on correct answers
    const totalItems = correctAnswers.length;
    const itemsPerZone = Math.ceil(totalItems / 3);
    
    const expectedLeft = correctAnswers.slice(0, itemsPerZone);
    const expectedMiddle = correctAnswers.slice(itemsPerZone, itemsPerZone * 2);
    const expectedRight = correctAnswers.slice(itemsPerZone * 2);

    // Check if current arrangement matches expected
    const leftCorrect = JSON.stringify([...leftZone].sort()) === JSON.stringify([...expectedLeft].sort());
    const middleCorrect = JSON.stringify([...middleZone].sort()) === JSON.stringify([...expectedMiddle].sort());
    const rightCorrect = JSON.stringify([...rightZone].sort()) === JSON.stringify([...expectedRight].sort());

    const correct = leftCorrect && middleCorrect && rightCorrect;
    const score = correct ? 100 : Math.round(((leftCorrect ? 1 : 0) + (middleCorrect ? 1 : 0) + (rightCorrect ? 1 : 0)) / 3 * 100);

    setIsCorrect(correct);
    setShowResult(true);
    setIsCompleted(true);
    
    if (onComplete) {
      onComplete(correct, score);
    }
  };

  const resetGame = () => {
    if (!question || !question.options) {
      console.error('Cannot reset game: question data is invalid');
      return;
    }
    
    const itemsList = question.options.split(', ').map(item => item.trim());
    const shuffledItems = [...itemsList].sort(() => Math.random() - 0.5);
    
    setItems(shuffledItems);
    setLeftZone([]);
    setMiddleZone([]);
    setRightZone([]);
    setIsCompleted(false);
    setShowResult(false);
  };

  const allItemsPlaced = leftZone.length + middleZone.length + rightZone.length === items.length;

  // Show error state if question data is invalid
  if (!question || !question.options || !question.correct_answers) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Invalid Game Data</div>
          <div className="text-white/60 text-sm">
            This game has missing or invalid data. Please try another game.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Sorting Game</h3>
        <p className="text-white/80 text-sm">
          Drag the items below into the correct zones based on their chronological order or category.
        </p>
      </div>

      {/* Game Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left Zone */}
        <div
          className="min-h-[200px] p-4 rounded-lg border-2 border-dashed border-blue-400 bg-blue-500/10"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'left')}
        >
          <h4 className="text-blue-300 font-semibold text-sm mb-3 text-center">
            {question.left_zone_label}
          </h4>
          <div className="space-y-2">
            {leftZone.map((item, index) => (
              <div
                key={`left-${item}-${index}`}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Middle Zone */}
        {question.middle_zone_label && (
          <div
            className="min-h-[200px] p-4 rounded-lg border-2 border-dashed border-yellow-400 bg-yellow-500/10"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'middle')}
          >
            <h4 className="text-yellow-300 font-semibold text-sm mb-3 text-center">
              {question.middle_zone_label}
            </h4>
            <div className="space-y-2">
              {middleZone.map((item, index) => (
                <div
                  key={`middle-${item}-${index}`}
                  className="bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Zone */}
        <div
          className="min-h-[200px] p-4 rounded-lg border-2 border-dashed border-green-400 bg-green-500/10"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'right')}
        >
          <h4 className="text-green-300 font-semibold text-sm mb-3 text-center">
            {question.right_zone_label}
          </h4>
          <div className="space-y-2">
            {rightZone.map((item, index) => (
              <div
                key={`right-${item}-${index}`}
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Items */}
      <div className="mb-6">
        <h4 className="text-white font-semibold text-sm mb-3">Available Items</h4>
        <div className="flex flex-wrap gap-2">
          {items
            .filter(item => !leftZone.includes(item) && !middleZone.includes(item) && !rightZone.includes(item))
            .map((item, index) => (
              <div
                key={`available-${item}-${index}`}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm cursor-move hover:bg-gray-500 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item}
              </div>
            ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <button
          onClick={checkAnswer}
          disabled={!allItemsPlaced || isCompleted}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isCompleted ? 'Completed' : 'Check Answer'}
        </button>
      </div>

      {/* Result */}
      {showResult && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-semibold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </span>
          </div>
          <p className={`text-sm ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
            {isCorrect 
              ? 'Great job! You sorted everything correctly.' 
              : 'Try again to get the perfect arrangement.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
