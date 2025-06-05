import React, { useState, useEffect } from 'react';
import { HistoryEra } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Check, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { playSelectSound } from '@/utils/audioUtils';

interface EraSelectorProps {
  selectedEra: HistoryEra | null;
  onSelect: (era: HistoryEra) => void;
  completedEras?: string[];
  showCompletedBadges?: boolean;
  preferredEra?: string | null;
  isPreferenceSelector?: boolean;
  directNavigation?: boolean;
}

// Add a mapping from era code to icon image
const eraIcons: Record<string, string> = {
  christian: '/images/icons/church.png',
  islamic: '/images/icons/islam.png',
  jewish: '/images/icons/judaism.png',
  russian: '/images/icons/russia.png',
  chinese: '/images/icons/china.png',
  'chinese history': '/images/icons/china.png',
  'china': '/images/icons/china.png',
  hindu: '/images/icons/hindu-history.png',
  'hindu history': '/images/icons/hindu-history.png',
  'hindu-history': '/images/icons/hindu-history.png',
  german: '/images/icons/german-history.png',
  'german history': '/images/icons/german-history.png',
  'german-history': '/images/icons/german-history.png',
  greece: '/images/icons/greek.png',
  'ancient greece': '/images/icons/greek.png',
  greek: '/images/icons/greek.png',
  'greek history': '/images/icons/greek.png',
  america: '/images/icons/america.png',
};

// Define locked eras
const lockedEras = [
  'chinese',
  'chinese history',
  'china',
  'hindu',
  'hindu history',
  'hindu-history',
  'german',
  'german history',
  'german-history',
];

const EraSelector = ({ 
  selectedEra, 
  onSelect, 
  completedEras = [], 
  showCompletedBadges = false,
  preferredEra,
  isPreferenceSelector = false,
  directNavigation = false
}: EraSelectorProps) => {
  const [eras, setEras] = useState<{code: string, name: string, emoji: string, time_period: string}[]>([]);
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const { setPreferredEra } = useUser();

  // Fetch learning journeys and era display fields separately, then merge in JS
  useEffect(() => {
    const fetchLearningTracksAndEras = async () => {
      // Fetch all learning tracks
      const { data: tracks, error: tracksError } = await supabase
        .from('learning_tracks')
        .select('era, id')
        .order('id');
      // Fetch all enabled history eras
      const { data: erasData, error: erasError } = await supabase
        .from('history_eras')
        .select('*')
        .eq('is_enabled', true);
      if (tracksError) {
        console.error('Error fetching learning tracks:', tracksError);
        return;
      }
      if (erasError) {
        console.error('Error fetching history eras:', erasError);
        return;
      }
      if (tracks && erasData) {
        // Merge: for each track, find the matching era for display fields
        const mapped = tracks.map((track: any) => {
          const era = erasData.find((e: any) => e.code === track.era);
          return {
            code: track.era,
            name: era?.name || track.era,
            emoji: era?.emoji || '📚',
            time_period: era?.time_period || '',
          };
        }).filter(e => !!e.name); // Only show if a matching era exists
        setEras(mapped);
      }
    };
    fetchLearningTracksAndEras();
  }, []);

  // Animation effect to stagger the appearance of era cards
  useEffect(() => {
    const timer = setTimeout(() => {
      if (eras.length > 0) {
        let timeoutId: NodeJS.Timeout;
        
        eras.forEach((era, index) => {
          timeoutId = setTimeout(() => {
            setAnimatedItems(prev => [...prev, era.code]);
          }, index * 100);
        });
        
        return () => clearTimeout(timeoutId);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [eras]);

  const isSelected = (era: string) => selectedEra === era;
  const isCompleted = (era: string) => completedEras.includes(era);
  const isPreferred = (era: string) => preferredEra === era;
  
  const handleEraSelection = async (era: HistoryEra) => {
    // Play the select sound effect
    playSelectSound();
    
    // Always call the provided onSelect function
    onSelect(era);
    
    // If direct navigation is enabled, set the era and navigate to dashboard
    if (directNavigation) {
      try {
        await setPreferredEra(era);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error setting preferred era:', error);
      }
    }
  };
  
  const handleViewMap = (era: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent onClick
    console.log("View Map button clicked for era:", era);
    navigate(`/historical-map/${era}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-timelingo-navy">
        {isPreferenceSelector ? 'Select your preferred era' : 'Pick a starting era!'}
      </h2>
      <p className="text-center text-gray-500">
        {isPreferenceSelector ? 'This will be displayed on your profile' : 'You\'ll unlock more as you learn'}
      </p>
      
      <div className="relative">
        {/* Era grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eras.map((era, index) => {
            // Lock logic
            const isLocked = lockedEras.includes(era.code.toLowerCase());
            // Use greek.png for Ancient Greece
            const isAncientGreece = era.code.toLowerCase() === 'ancient greece' || era.code.toLowerCase() === 'ancient-greece';
            let iconSrc = eraIcons[era.code.toLowerCase()];
            if (isAncientGreece) {
              iconSrc = '/images/icons/greek.png';
            }
            return (
              <div 
                key={era.code}
                data-era-idx={index}
                tabIndex={0}
                className={cn(
                  "era-card relative border-2 rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 outline-none",
                  animatedItems.includes(era.code) ? 'animate-scale-in' : 'opacity-0',
                  isSelected(era.code) ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' : '',
                  isPreferred(era.code) && isPreferenceSelector ? 'ring-2 ring-timelingo-teal' : '',
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md hover:scale-102'
                )}
                onClick={() => !isLocked && handleEraSelection(era.code as HistoryEra)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {showCompletedBadges && isCompleted(era.code) && (
                  <Badge className="absolute top-2 right-2 bg-green-500 animate-fade-in">
                    <Check className="h-3 w-3 mr-1" /> Completed
                  </Badge>
                )}
                {isPreferenceSelector && isPreferred(era.code) && (
                  <Badge className="absolute top-2 right-2 bg-timelingo-teal animate-fade-in">
                    Preferred
                  </Badge>
                )}
                <div className="flex justify-center mb-2">
                  {iconSrc ? (
                    <img src={iconSrc} alt={era.name} className="inline w-20 h-20 hover:animate-spin" />
                  ) : (
                    <span className="text-3xl">{era.emoji}</span>
                  )}
                </div>
                <h3 className="font-semibold text-timelingo-navy text-lg mb-1">{era.name}</h3>
                <p className="text-xs text-gray-500">{era.time_period}</p>
                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-lg z-10">
                    <svg className="w-10 h-10 text-white mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v1m0-4a2 2 0 00-2 2v1a2 2 0 002 2h0a2 2 0 002-2v-1a2 2 0 00-2-2zm0 0V9a4 4 0 10-8 0v4" /></svg>
                    <span className="text-xs text-white font-bold bg-black/60 px-2 py-0.5 rounded">Locked</span>
                  </div>
                )}
                {/* Background decorative element */}
                <div className={`
                  absolute inset-0 bg-gradient-to-tr from-transparent 
                  ${isSelected(era.code) ? 
                    'via-purple-100 to-purple-50' : 
                    'via-transparent to-transparent'
                  } opacity-50 transition-opacity duration-300 rounded-lg
                `} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EraSelector;
