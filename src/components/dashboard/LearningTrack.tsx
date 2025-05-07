import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningTrackLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Lock, Book, Star, ArrowDown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Separator } from '@/components/ui/separator';

interface LearningTrackProps {
  levels: LearningTrackLevel[];
  themeColor?: string;
}

const LearningTrack: React.FC<LearningTrackProps> = ({ levels, themeColor = 'timelingo-purple' }) => {
  const navigate = useNavigate();
  const { preferredEra } = useUser();

  const handleStartLesson = (lessonId: string) => {
    console.log("Starting lesson:", lessonId);
    navigate(`/lesson/${lessonId}`);
  };

  if (!levels || levels.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-700">No learning track available</h3>
        <p className="text-sm text-gray-500">Please select an era in your preferences</p>
      </div>
    );
  }

  // Custom theme styling based on era
  const getIconForEra = () => {
    switch(preferredEra) {
      case 'jewish': return '✡️';
      case 'ancient-egypt': return '🏺';
      case 'rome-greece': return '🏛️';
      case 'medieval': return '🏰';
      case 'revolutions': return '⚔️';
      case 'modern': return '🌍';
      case 'china': return '🐲';
      case 'islamic': return '☪️';
      case 'christian': return '✝️';
      case 'russian': return '🇷🇺';
      default: return '📚';
    }
  };

  return (
    <div className="w-full">
      {/* Track path line - continuous vertical line */}
      <div className="relative">
        <div className={`absolute left-6 top-4 bottom-8 w-1.5 bg-gradient-to-b from-${themeColor}-400 to-${themeColor}-600 rounded-full`} />
        
        {levels.map((level, levelIndex) => (
          <div key={level.level} className="mb-10 relative">
            {/* Level header with colorful badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-md
                ${level.isUnlocked 
                  ? `bg-gradient-to-r from-${themeColor}-500 to-${themeColor}-600 text-white` 
                  : 'bg-gray-300 text-gray-500'}`}>
                {level.isUnlocked ? levelIndex + 1 : <Lock size={18} />}
              </div>
              <div>
                <h3 className="font-bold text-lg">{level.title}</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>
            
            {/* Level lessons */}
            <div className="ml-6 pl-10 space-y-5 relative">
              {level.lessons && level.lessons.length > 0 ? level.lessons.map((lesson, lessonIndex) => {
                if (!lesson) {
                  console.warn("Null lesson found in level", level.title);
                  return null;
                }
                
                const isCompleted = lesson.progress?.completed ?? false;
                const isLast = lessonIndex === level.lessons.length - 1;
                const isFirst = lessonIndex === 0;
                // Default all levels to unlocked if no specific unlock flag is set
                const isLevelUnlocked = level.isUnlocked !== false; 
                const progressPercentage = lesson.progress?.completed ? 100 : 0;
                
                return (
                  <div key={lesson.id} className="relative">
                    {/* Connector line to next lesson with progress indicator */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 h-full">
                        <div className="w-0.5 h-full bg-gray-200 absolute"></div>
                        <div 
                          className={`w-0.5 bg-green-500 absolute transition-all duration-500`} 
                          style={{ height: `${progressPercentage}%` }}
                        ></div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <ArrowDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all relative
                        ${isLevelUnlocked 
                          ? isCompleted 
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                            : 'bg-white shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:border-purple-200' 
                          : 'bg-gray-100 opacity-60 cursor-not-allowed'}`}
                      onClick={() => handleStartLesson(lesson.id)}
                    >
                      {/* Pulsing animation for active lesson */}
                      {isLevelUnlocked && !isCompleted && (
                        <div className="absolute inset-0 rounded-xl border-2 border-purple-300 opacity-50 animate-pulse pointer-events-none"></div>
                      )}
                      
                      {/* Lesson node/circle */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-sm
                        ${isCompleted 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                          : isLevelUnlocked 
                            ? `bg-gradient-to-r from-${themeColor}-400 to-${themeColor}-500 text-white` 
                            : 'bg-gray-300 text-gray-500'}`}>
                        {isCompleted 
                          ? <CheckCircle size={20} /> 
                          : <Book size={20} />}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{lesson.duration} min</p>
                          
                          {/* XP reward badge */}
                          <div className={`bg-${themeColor}-100 text-${themeColor}-700 text-xs px-2 py-1 rounded-full flex items-center`}>
                            <Star className={`w-3 h-3 mr-1 text-${themeColor}-500`} />
                            {lesson.xp_reward} XP
                          </div>
                        </div>
                      </div>
                      
                      {/* Completion stars or start button */}
                      <div className="flex items-center">
                        {isCompleted ? (
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-lg ${i < (lesson.progress?.stars || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        ) : (
                          isLevelUnlocked && (
                            <Button 
                              size="sm" 
                              className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white text-xs whitespace-nowrap`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartLesson(lesson.id);
                              }}
                            >
                              {isFirst && levelIndex === 0 ? 'Start' : 'Continue'}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No lessons available for this level</p>
                </div>
              )}
            </div>
            
            {/* Level separator */}
            {levelIndex < levels.length - 1 && (
              <div className="ml-6 pl-10 py-2">
                <div className="relative">
                  <Separator className="my-2" />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <ArrowDown size={14} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Final treasure element at the bottom of the path */}
        <div className="ml-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center z-10 mb-2 shadow-md">
            <span role="img" aria-label="era-icon">{getIconForEra()}</span>
          </div>
          <p className="text-sm text-gray-500">Master the era</p>
        </div>
      </div>
    </div>
  );
};

export default LearningTrack;
