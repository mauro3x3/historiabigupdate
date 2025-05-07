import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import EraSelector from '@/components/onboarding/EraSelector';
import AddEraDialog from '@/components/onboarding/AddEraDialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { HistoryEra } from '@/types';

interface EraSelectionSectionProps {
  handleEraSelection: (era: string) => Promise<void>;
}

const EraSelectionSection = ({ handleEraSelection }: EraSelectionSectionProps) => {
  const { preferredEra, completedEras } = useUser();
  const [showAddEra, setShowAddEra] = useState(false);
  const [eras, setEras] = useState<{ code: string, name: string, emoji: string, time_period: string }[]>([]);
  const [selectedEra, setSelectedEra] = useState<string | null>(preferredEra);

  // Fetch eras from Supabase (mimic EraSelector logic)
  useEffect(() => {
    const fetchEras = async () => {
      const { data } = await import('@/integrations/supabase/client').then(m => m.supabase)
        .then(supabase => supabase
          .from('history_eras')
          .select('*')
          .eq('is_enabled', true)
          .order('name')
        );
      if (data) {
        setEras(data.filter(era =>
          !['age-of-revolutions', 'alt-history', 'american-amendments', 'medieval-europe', 'modern-history', 'us-presidents', 'rome-greece'].includes(era.code)
        ));
      }
    };
    fetchEras();
  }, []);

  useEffect(() => {
    setSelectedEra(preferredEra);
  }, [preferredEra]);

  const handleEraChange = async (era: string) => {
    setSelectedEra(era);
    await handleEraSelection(era);
  };

  const handleEraAdded = (newEra: { code: string, name: string, emoji: string, time_period: string }) => {
    setEras(prev => [...prev, newEra]);
    setShowAddEra(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-8 rounded-xl shadow-sm border border-blue-100">
      {/* Dropdown for quick era switching */}
      <div className="flex justify-center mb-6">
        <Select value={selectedEra || undefined} onValueChange={handleEraChange}>
          <SelectTrigger className="w-64 bg-white shadow-md">
            <span className="flex items-center">
              {eras.find(e => e.code === selectedEra)?.emoji || '🌍'}
              <span className="ml-2">
                <SelectValue placeholder="Select Era" />
              </span>
            </span>
          </SelectTrigger>
          <SelectContent>
            {eras.map(era => (
              <SelectItem key={era.code} value={era.code}>
                <span className="flex items-center">
                  <span className="mr-2">{era.emoji}</span>
                  {era.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* EraSelector grid with AddEraDialog as last card */}
      <div className="relative">
        <EraSelector
          selectedEra={selectedEra as HistoryEra}
          onSelect={handleEraChange}
          completedEras={completedEras}
          showCompletedBadges={true}
        />
        <div className="mt-6 flex justify-center">
          <AddEraDialog onEraAdded={handleEraAdded} />
        </div>
      </div>
    </div>
  );
};

export default EraSelectionSection;
