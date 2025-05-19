import React, { useState, useEffect } from 'react';
import { HistoryInterest } from '@/types';
import { playSelectSound } from '@/utils/audioUtils';
import { CheckCircle, Sword, ScrollText, Church, Globe } from 'lucide-react';

interface InterestSelectorProps {
  selectedInterests: HistoryInterest[];
  onSelect: (interests: HistoryInterest[]) => void;
}

const InterestSelector = ({ selectedInterests, onSelect }: InterestSelectorProps) => {
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);

  // Animation effect for items 
  useEffect(() => {
    const timer = setTimeout(() => {
      const interests = ['wars', 'politics', 'religious', 'world-map'];
      let timeoutId: NodeJS.Timeout;
      
      interests.forEach((interest, index) => {
        timeoutId = setTimeout(() => {
          setAnimatedItems(prev => [...prev, interest]);
        }, index * 150);
      });
      
      return () => clearTimeout(timeoutId);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleInterest = (interest: HistoryInterest) => {
    playSelectSound();
    const newSelection = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    onSelect(newSelection);
  };

  const isSelected = (interest: HistoryInterest) => selectedInterests.includes(interest);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        What type of history interests you?
      </h2>
      <p className="text-center text-gray-500">Select all that apply</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'wars', icon: '/images/icons/swords.png', title: 'Wars & Battles', description: 'Conflicts that shaped nations' },
          { id: 'politics', icon: '/images/icons/scroll.png', title: 'Political History', description: 'Leaders and governance' },
          { id: 'religious', icon: '/images/icons/church.png', title: 'Religious History', description: 'Faith traditions and their impact' },
          { id: 'world-map', icon: '/images/icons/globe.png', title: 'World Map History', description: 'Geographical changes over time' }
        ].map((item, index) => (
          <div 
            key={item.id}
            className={`
              relative history-option 
              ${animatedItems.includes(item.id) ? 'animate-scale-in' : 'opacity-0'} 
              ${isSelected(item.id as HistoryInterest) ? 
                'border-purple-500 bg-purple-50 shadow-md transform scale-105' : 
                'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
              }
              overflow-hidden rounded-xl border-2 p-5 text-center cursor-pointer
              transition-all duration-300 hover:shadow-md hover:transform hover:scale-105
            `}
            onClick={() => toggleInterest(item.id as HistoryInterest)}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {isSelected(item.id as HistoryInterest) && (
              <div className="absolute top-3 right-3 text-purple-500 animate-fade-in">
                <CheckCircle size={20} />
              </div>
            )}
            <div className="flex justify-center mb-3">
              <img src={item.icon} alt={item.title} className="inline w-20 h-20 hover:animate-spin" />
            </div>
            <h3 className="font-semibold text-timelingo-navy text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            
            {/* Background decorative element */}
            <div className={`
              absolute inset-0 bg-gradient-to-tr from-transparent 
              ${isSelected(item.id as HistoryInterest) ? 
                'via-purple-100 to-purple-50' : 
                'via-transparent to-transparent'
              } opacity-50 transition-opacity duration-300
            `} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestSelector;
