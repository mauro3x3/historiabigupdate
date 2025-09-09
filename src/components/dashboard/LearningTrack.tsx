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
      {/* Enhanced Timeline Path with Story Elements */}
      <div className="relative">
        {/* Main timeline with enhanced styling */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-300 to-green-400 rounded-full shadow-lg" />
        
        {/* Timeline progress indicator */}
        <div className="absolute left-8 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full shadow-lg transition-all duration-1000" 
             style={{ height: '60%' }} />
        
        {levels.map((level, levelIndex) => (
          <div key={level.level} className="mb-12 relative">
            {/* Enhanced Level header with story elements */}
            <div className="flex items-center gap-6 mb-8">
              {/* Timeline node with enhanced design */}
              <div className="relative z-20">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300
                  ${level.isUnlocked 
                    ? `bg-gradient-to-br from-${themeColor}-400 via-${themeColor}-500 to-${themeColor}-600 text-white hover:scale-110` 
                    : 'bg-gray-300 text-gray-500'}`}>
                  {level.isUnlocked ? (
                    <div className="text-center">
                      <div className="text-lg font-bold">{levelIndex + 1}</div>
                      <div className="text-xs opacity-80">Level</div>
                    </div>
                  ) : (
                    <Lock size={20} />
                  )}
                </div>
                
                {/* Pulsing ring for active level */}
                {level.isUnlocked && (
                  <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-20" />
                )}
              </div>
              
              {/* Level content with enhanced styling */}
              <div className="flex-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{level.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{level.description}</p>
                  
                  {/* Progress indicator for level */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500" 
                           style={{ width: `${(level.lessons?.filter(l => l?.progress?.completed).length || 0) / (level.lessons?.length || 1) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {level.lessons?.filter(l => l?.progress?.completed).length || 0}/{level.lessons?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Level lessons with story path */}
            <div className="ml-8 pl-12 space-y-6 relative">
              {level.lessons && level.lessons.length > 0 ? (() => {
                console.log('Rendering lessons for level', level.level, level.lessons);
                return level.lessons.map((lesson, lessonIndex) => {
                  if (!lesson) {
                    console.warn("Null lesson found in level", level.title);
                    return null;
                  }
                  
                  const isCompleted = lesson.progress?.completed ?? false;
                  const isLast = lessonIndex === level.lessons.length - 1;
                  const isFirst = lessonIndex === 0;
                  const isLevelUnlocked = lesson.isUnlocked !== false;
                  const progressPercentage = lesson.progress?.completed ? 100 : 0;
                  
                  return (
                    <div key={lesson.id} className="relative group">
                      {/* Visual debug badge for isUnlocked */}
                      <div style={{position: 'absolute', top: 0, right: 0, background: 'yellow', color: 'black', fontSize: 10, zIndex: 1000}}>
                        {String(lesson.isUnlocked)}
                      </div>
                      {/* Enhanced connector with story elements */}
                      {!isLast && (
                        <div className="absolute left-8 top-16 h-full">
                          <div className="w-1 h-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-sm"></div>
                          <div 
                            className={`w-1 bg-gradient-to-b from-green-400 to-green-500 rounded-full transition-all duration-700 shadow-lg`} 
                            style={{ height: `${progressPercentage}%` }}
                          ></div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-white border-2 border-green-400 rounded-full flex items-center justify-center shadow-md">
                              <ArrowDown size={12} className="text-green-500" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div
                        className={`group flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden
                          ${isLevelUnlocked 
                            ? isCompleted 
                              ? 'bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 border-2 border-green-200 cursor-pointer hover:shadow-xl hover:scale-[1.02]' 
                              : 'bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-purple-200 cursor-pointer hover:scale-[1.02]' 
                            : 'bg-gray-50 opacity-60 cursor-not-allowed pointer-events-none border-2 border-gray-200'}`}
                        onClick={() => isLevelUnlocked && handleStartLesson(lesson.id)}
                        tabIndex={isLevelUnlocked ? 0 : -1}
                        aria-disabled={!isLevelUnlocked}
                        title={isLevelUnlocked ? '' : 'Complete previous lessons to unlock this module!'}
                      >
                        {/* Enhanced background effects */}
                        {isLevelUnlocked && !isCompleted && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-100/50 to-blue-100/50 opacity-60 animate-pulse pointer-events-none"></div>
                        )}
                        
                        {/* Decorative corner elements */}
                        <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-40"></div>
                        
                        {/* Enhanced lesson node with story elements */}
                        <div className="relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300 group-hover:scale-110
                            ${isCompleted 
                              ? 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white shadow-green-200' 
                              : isLevelUnlocked 
                                ? `bg-gradient-to-br from-${themeColor}-400 via-${themeColor}-500 to-${themeColor}-600 text-white shadow-${themeColor}-200` 
                                : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500'}`}>
                            {isCompleted 
                              ? <CheckCircle size={24} className="drop-shadow-sm" /> 
                              : isLevelUnlocked 
                                ? <Book size={24} className="drop-shadow-sm" />
                                : <Lock size={20} />}
                          </div>
                          
                          {/* Completion sparkle effect */}
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                              <Star size={12} className="text-yellow-700" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-2">
                            <h4 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{lesson.duration} min • Interactive Lesson</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {/* Enhanced XP reward badge */}
                            <div className={`bg-gradient-to-r from-${themeColor}-100 to-${themeColor}-200 text-${themeColor}-800 text-sm px-4 py-2 rounded-full flex items-center shadow-md group-hover:shadow-lg transition-all duration-200`}>
                              <Star className={`w-4 h-4 mr-2 text-${themeColor}-600`} />
                              <span className="font-semibold">{lesson.xp_reward} XP</span>
                            </div>
                            
                            {/* Lesson type indicator */}
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-gray-500 font-medium">Story Module</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced completion stars or action button */}
                        <div className="flex items-center">
                          {isCompleted ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex">
                                {[...Array(3)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-2xl transition-all duration-300 ${i < (lesson.progress?.stars || 0) ? 'text-amber-400 drop-shadow-lg animate-pulse' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-green-600 font-semibold">Completed!</span>
                            </div>
                          ) : (
                            isLevelUnlocked && (
                              <Button 
                                size="lg" 
                                className={`bg-gradient-to-r from-${themeColor}-500 to-${themeColor}-600 hover:from-${themeColor}-600 hover:to-${themeColor}-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleStartLesson(lesson.id);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Book size={16} />
                                  {isFirst && levelIndex === 0 ? 'Start Journey' : 'Continue'}
                                </div>
                              </Button>
                            )
                          )}
                        </div>
                        {/* Tooltip for locked lessons */}
                        {!isLevelUnlocked && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 w-56 text-sm hidden group-hover:block">
                            <span className="font-semibold text-gray-700">Locked</span>
                            <div className="text-gray-500 mt-1">Complete previous lessons to unlock this module!</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })() : (
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
        
        {/* Enhanced final treasure element */}
        <div className="ml-6 flex flex-col items-center relative">
          {/* Celebration background */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          
          <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-xl border-4 border-white">
              <span role="img" aria-label="era-icon" className="text-3xl">{getIconForEra()}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Era Mastery Achieved!</h3>
            <p className="text-sm text-gray-600 text-center">You've completed the journey through {preferredEra?.replace('-', ' ')} history</p>
            
            {/* Achievement badges */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star size={12} className="text-yellow-800" />
              </div>
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <Book size={12} className="text-blue-800" />
              </div>
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle size={12} className="text-green-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningTrack;
