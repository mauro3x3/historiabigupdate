import React from 'react';
import { Button } from '@/components/ui/button';
import { HistoryEra } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Star } from 'lucide-react';
import EraLabel from '@/components/admin/lesson/EraLabel';
import { toast } from 'sonner';

interface EraSelectionSectionProps {
  handleEraSelection: (era: string) => Promise<void>;
}

const EraSelectionSection = ({ handleEraSelection }: EraSelectionSectionProps) => {
  const { preferredEra, completedEras } = useUser();
  
  // Enhanced era definitions with richer theming elements
  const eras = [
    { 
      name: 'Ancient Egypt', 
      emoji: '🏺', 
      color: 'from-amber-100 to-yellow-300',
      borderColor: 'border-amber-300', 
      code: 'ancient-egypt',
      description: 'Pyramids, pharaohs, and the mysteries of the Nile',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17L5 7h10l-5 10zm30 0l-5-10h10l-5 10z\' fill=\'%23FBBF24\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Rome & Greece', 
      emoji: '🏛️', 
      color: 'from-blue-100 to-sky-200',
      borderColor: 'border-blue-300', 
      code: 'rome-greece',
      description: 'Discover the foundations of Western civilization',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 30h30v30H30V30zm0-30h30v30H30V0zM0 30h30v30H0V30zM0 0h30v30H0V0z\' fill=\'%230EA5E9\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Medieval', 
      emoji: '🏰', 
      color: 'from-stone-100 to-stone-200',
      borderColor: 'border-stone-300', 
      code: 'medieval',
      description: 'Knights, castles, and life in the Middle Ages',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 15h30v30H15V15zm30 0h15v15H45V15zm0 30h15v15H45V45zM0 0h15v15H0V0zm0 45h15v15H0V45z\' fill=\'%2378716C\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Jewish History', 
      emoji: '✡️', 
      color: 'from-blue-100 to-indigo-200',
      borderColor: 'border-blue-400', 
      code: 'jewish',
      description: 'From ancient Israel to modern Jewish communities',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z\' fill=\'%233B82F6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Islamic History', 
      emoji: '☪️', 
      color: 'from-green-100 to-emerald-200',
      borderColor: 'border-emerald-400', 
      code: 'islamic',
      description: 'Explore the rich Islamic cultural heritage',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z\' fill=\'%2310B981\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Christian History', 
      emoji: '✝️', 
      color: 'from-purple-100 to-violet-200',
      borderColor: 'border-purple-400', 
      code: 'christian',
      description: 'From early Christianity to modern churches',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M25 0v25H0v10h25v25h10V35h25V25H35V0H25z\' fill=\'%238B5CF6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Revolutions', 
      emoji: '⚔️', 
      color: 'from-red-100 to-rose-200',
      borderColor: 'border-red-400', 
      code: 'revolutions',
      description: 'The people and events that changed history',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v60h60V30H30V0H0zm30 30h30v30H30V30z\' fill=\'%23F43F5E\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Modern', 
      emoji: '🌍', 
      color: 'from-green-100 to-teal-200',
      borderColor: 'border-teal-400', 
      code: 'modern',
      description: 'The events shaping our contemporary world',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 45c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z\' fill=\'%2314B8A6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Chinese History', 
      emoji: '🐲', 
      color: 'from-red-100 to-orange-200',
      borderColor: 'border-red-500', 
      code: 'china',
      description: 'Ancient dynasties to modern China',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 30a30 30 0 1 1 60 0 30 30 0 1 1-60 0z\' fill=\'%23EF4444\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
    { 
      name: 'Russian History', 
      emoji: '🇷🇺', 
      color: 'from-blue-100 to-red-100',
      borderColor: 'border-blue-500', 
      code: 'russian',
      description: 'From Tsarist Russia to the modern era',
      bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 0v15h15V0H15zm30 0v15h15V0H45zM0 15v15h15V15H0zm45 0v15h15V15H45zM15 30v15h15V30H15zm30 0v15h15V30H45zM0 45v15h15V45H0zm15 0v15h15V45H15zm30 0v15h15V45H45z\' fill=\'%232563EB\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-8 rounded-xl shadow-sm border border-blue-100">
      <h2 className="text-2xl font-bold mb-4 text-timelingo-navy">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Explore Different Eras
        </span>
      </h2>
      <p className="text-gray-600 mb-6">Choose a historical journey that interests you the most</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eras.map((era) => {
          const isSelected = preferredEra === era.code;
          const isCompleted = completedEras?.includes(era.code);
          
          return (
            <div 
              key={era.name} 
              className={`p-4 bg-gradient-to-br ${era.color} ${era.bgPattern} bg-opacity-50 rounded-lg ${
                isSelected ? `ring-2 ring-${era.borderColor.split('-')[1]} ${era.borderColor}` : 'border-white/40'
              } hover:shadow-md cursor-pointer transition transform hover:scale-[1.02]`}
              onClick={() => handleEraSelection(era.code as HistoryEra)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{era.emoji}</span>
                  <h3 className="font-semibold text-timelingo-navy">{era.name}</h3>
                </div>
                {isSelected && (
                  <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    Current
                  </span>
                )}
                {isCompleted && !isSelected && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    <Star size={12} />
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2">{era.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <Button 
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
          onClick={() => handleEraSelection('onboarding' as HistoryEra)}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Customize Your Learning Path
        </Button>
      </div>
    </div>
  );
};

export default EraSelectionSection;
