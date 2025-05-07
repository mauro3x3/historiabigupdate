import React, { useState, useEffect } from 'react';
import { LearningStyle } from '@/types';
import { Check, BookOpen, Video, Calendar, Map, PuzzleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playSelectSound } from '@/utils/audioUtils';
import { Badge } from '@/components/ui/badge';

interface LearningStyleSelectorProps {
  selectedStyle: LearningStyle | null;
  onSelect: (style: LearningStyle) => void;
}

const LearningStyleSelector = ({ selectedStyle, onSelect }: LearningStyleSelectorProps) => {
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const styles = learningStyles.map(style => style.id);
      
      styles.forEach((style, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => [...prev, style]);
        }, index * 100);
      });
      
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelect = (style: LearningStyle) => {
    playSelectSound();
    onSelect(style);
  };

  const isSelected = (style: LearningStyle) => selectedStyle === style;

  const learningStyles = [
    {
      id: 'journey' as LearningStyle,
      emoji: '🗺️',
      icon: Map,
      title: 'Learning Journeys',
      description: 'Themed paths like "Rise of Rome" or "World War II Leaders"',
      isNew: true
    },
    {
      id: 'ai-dolphin' as LearningStyle,
      emoji: '🐬',
      icon: null,
      title: 'AI Quiz Dolphin',
      description: 'Let our friendly AI dolphin create custom quizzes just for you!',
      isNew: true,
      isAi: true
    },
    {
      id: 'reading' as LearningStyle,
      emoji: '📘',
      icon: BookOpen,
      title: 'Quick Quizzes',
      description: 'Bite-sized trivia to test facts and recall',
      isNew: false
    },
    {
      id: 'visual' as LearningStyle,
      emoji: '🎥',
      icon: Video,
      title: 'Story Mode',
      description: 'Short video episodes that bring history to life',
      isNew: false
    },
    {
      id: 'daily' as LearningStyle,
      emoji: '📆',
      icon: Calendar,
      title: 'Daily Challenge',
      description: 'Drop in daily to place events on a timeline',
      isNew: false
    },
    {
      id: 'mystery' as LearningStyle,
      emoji: '🧩',
      icon: PuzzleIcon,
      title: 'Mystery History',
      description: 'Guess the topic from clues, images, or quotes',
      isNew: true
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        How do you like to learn?
      </h2>
      <p className="text-center text-gray-500">Choose your preferred learning style</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {learningStyles.map((style, index) => (
          <div 
            key={style.id}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md",
              "flex items-center gap-3",
              animatedItems.includes(style.id) ? 'animate-scale-in' : 'opacity-0',
              isSelected(style.id) ? 
                'border-purple-500 bg-purple-50 shadow-md transform scale-102' : 
                'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50',
              style.isAi ? 'border-blue-400 bg-blue-50' : ''
            )}
            onClick={() => handleSelect(style.id)}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3 text-purple-600">
              {style.icon ? <style.icon className="h-6 w-6" /> : <span className="text-2xl">{style.emoji}</span>}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-timelingo-navy">{style.title}</h3>
                {style.isAi && (
                  <Badge className="bg-blue-500 text-white text-xs">AI-powered</Badge>
                )}
                {style.isNew && !style.isAi && (
                  <Badge className="bg-green-500 text-white text-xs">New</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{style.description}</p>
            </div>
            
            {isSelected(style.id) && (
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1 shadow-md animate-fade-in">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningStyleSelector;
