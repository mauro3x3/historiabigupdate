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
      customIcon: '/images/icons/learningjourney.png',
      title: 'Learning Journeys',
      description: 'Themed paths like "Rise of Rome" or "World War II Leaders"',
      isNew: true,
      isRecommended: true
    },
    {
      id: 'ai-dolphin' as LearningStyle,
      emoji: '🐬',
      icon: null,
      customIcon: '/images/icons/dolphin.png',
      title: 'AI Quiz Dolphin',
      description: 'Let our friendly AI dolphin create custom quizzes just for you!',
      isNew: true,
      isAi: true
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        How do you like to learn?
      </h2>
      <p className="text-center text-gray-500">Choose your preferred learning style</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {learningStyles.map((style, index) => {
          const isJourney = style.id === 'journey';
          return (
            <div 
              key={style.id}
              className={cn(
                "relative rounded-2xl border-4 transition-all duration-300 flex items-center gap-6 cursor-pointer",
                animatedItems.includes(style.id) ? 'animate-scale-in' : 'opacity-0',
                isSelected(style.id) ? 
                  'border-purple-500 bg-purple-50 shadow-xl scale-105' : 
                  'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50',
                style.isAi ? 'border-blue-400 bg-blue-50' : '',
                isJourney ? 'p-8 min-h-[180px] bg-gradient-to-br from-yellow-50 to-white shadow-lg ring-2 ring-yellow-300/60' : 'p-6 min-h-[150px]',
                isJourney ? 'hover:shadow-2xl' : '',
                isJourney && style.isRecommended ? 'before:content-["Recommended"] before:absolute before:-top-5 before:left-1/2 before:-translate-x-1/2 before:bg-yellow-400 before:text-white before:px-4 before:py-1 before:rounded-full before:shadow-lg before:text-xs before:font-bold' : ''
              )}
              onClick={() => handleSelect(style.id)}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className={cn(
                isJourney ? 'flex-shrink-0 bg-yellow-100 rounded-full p-5 text-yellow-600 shadow-lg' : 'flex-shrink-0 bg-purple-100 rounded-full p-4 text-purple-600',
                isJourney ? 'border-2 border-yellow-300' : ''
              )}>
                {style.customIcon ? (
                  <img 
                    src={style.customIcon} 
                    alt={style.title}
                    className={isJourney ? "h-14 w-14 object-contain" : "h-10 w-10 object-contain"}
                  />
                ) : style.icon ? (
                  <style.icon className={isJourney ? "h-10 w-10" : "h-6 w-6"} />
                ) : (
                  <span className={isJourney ? "text-4xl" : "text-2xl"}>{style.emoji}</span>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className={isJourney ? "font-bold text-timelingo-navy text-2xl" : "font-semibold text-timelingo-navy text-lg"}>{style.title}</h3>
                  {style.isAi && (
                    <Badge className="bg-blue-500 text-white text-xs">AI-powered</Badge>
                  )}
                  {style.isNew && !style.isAi && (
                    <Badge className="bg-green-500 text-white text-xs">New</Badge>
                  )}
                </div>
                <p className={isJourney ? "text-base text-gray-600 font-medium" : "text-sm text-gray-500"}>{style.description}</p>
              </div>
              {isSelected(style.id) && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1 shadow-md animate-fade-in">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningStyleSelector;
