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
      description: 'Follow a themed path like in Duolingo focusing on a historical topic of your liking!',
      isNew: true,
      isRecommended: true
    },
    {
      id: 'globe' as LearningStyle,
      emoji: '🌍',
      icon: Map,
      customIcon: '/images/icons/globe.png',
      title: 'Globe & Map Learning',
      description: 'Explore history through a globe!',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        How do you like to learn?
      </h2>
      <p className="text-center text-gray-500">Choose your preferred learning style</p>
      
      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {learningStyles.map((style, index) => {
          const isJourney = style.id === 'journey';
          return (
            <div 
              key={style.id}
              className={cn(
                "relative rounded-2xl border-4 transition-all duration-300 flex items-start gap-12 cursor-pointer",
                animatedItems.includes(style.id) ? 'animate-scale-in' : 'opacity-0',
                isSelected(style.id) ? 
                  'border-purple-500 bg-purple-50 shadow-xl scale-105' : 
                  'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50',
                isJourney ? 'p-12 min-h-[300px] bg-gradient-to-br from-yellow-50 to-white shadow-lg ring-2 ring-yellow-300/60' : 'p-10 min-h-[300px]',
                isJourney ? 'hover:shadow-2xl' : '',
                isJourney && style.isRecommended ? 'before:content-["Recommended"] before:absolute before:-top-5 before:left-1/2 before:-translate-x-1/2 before:bg-yellow-400 before:text-white before:px-4 before:py-1 before:rounded-full before:shadow-lg before:text-xs before:font-bold' : ''
              )}
              onClick={() => handleSelect(style.id)}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full p-8 min-w-[160px] min-h-[160px] flex-shrink-0",
                isJourney ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-100'
              )}>
                {style.customIcon ? (
                  <img 
                    src={style.customIcon} 
                    alt={style.title}
                    className="h-40 w-40 object-contain"
                  />
                ) : style.icon ? (
                  <style.icon className="h-32 w-32 text-gray-600" />
                ) : (
                  <span className="text-9xl">{style.emoji}</span>
                )}
              </div>
              <div className="flex-grow min-w-0 flex-1 pr-8">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className={isJourney ? "font-bold text-timelingo-navy text-2xl" : "font-semibold text-timelingo-navy text-xl"}>{style.title}</h3>
                  {style.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">New</Badge>
                  )}
                </div>
                <p className={cn(
                  "text-gray-600 leading-relaxed text-lg",
                  isJourney ? "font-medium" : ""
                )}>{style.description}</p>
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
