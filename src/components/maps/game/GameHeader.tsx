
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  description: string | null;
  navigateToGames: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  description,
  navigateToGames
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-timelingo-navy">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <Button 
        variant="outline" 
        className="border-timelingo-purple text-timelingo-purple hover:bg-timelingo-purple/10"
        onClick={navigateToGames}
      >
        <Map size={16} className="mr-2" />
        All Games
      </Button>
    </div>
  );
};

export default GameHeader;
