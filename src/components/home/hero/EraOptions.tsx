
import React from 'react';
import { Button } from '@/components/ui/button';
import { HistoryEra } from '@/types';

export interface EraOption {
  code: string;
  name: string;
  emoji: string;
}

export const eraOptions: EraOption[] = [
  { code: 'jewish', name: 'Jewish History', emoji: '✡️' },
  { code: 'ancient-egypt', name: 'Ancient Egypt', emoji: '🏺' },
  { code: 'rome-greece', name: 'Rome & Greece', emoji: '🏛️' },
  { code: 'medieval', name: 'Medieval', emoji: '🏰' },
  { code: 'revolutions', name: 'Revolutions', emoji: '⚔️' },
  { code: 'modern', name: 'Modern', emoji: '🌍' },
  { code: 'china', name: 'Chinese History', emoji: '🐲' },
  { code: 'islamic', name: 'Islamic History', emoji: '☪️' },
  { code: 'christian', name: 'Christian History', emoji: '✝️' },
  { code: 'russian', name: 'Russian History', emoji: '🇷🇺' },
];

interface EraOptionsListProps {
  onEraChange: (era: string) => Promise<void>;
  changingEra: boolean;
}

export const EraOptionsList: React.FC<EraOptionsListProps> = ({ onEraChange, changingEra }) => {
  return (
    <div className="grid gap-1">
      {eraOptions.map((era) => (
        <Button
          key={era.code}
          variant="ghost"
          className="flex items-center justify-start w-full px-2 py-1.5 text-sm"
          onClick={() => onEraChange(era.code)}
          disabled={changingEra}
        >
          <span className="mr-2">{era.emoji}</span>
          {era.name}
        </Button>
      ))}
    </div>
  );
};
