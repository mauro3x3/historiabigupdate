
import React from 'react';
import EraLabel from '@/components/admin/lesson/EraLabel';
import { EraThemeProps } from './EraTheme';

interface HeroTitleProps {
  eraTheme: EraThemeProps;
  preferredEra: string | null;
  handleToDashboard: () => void;
  user: any;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ eraTheme, preferredEra, handleToDashboard, user }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-timelingo-navy">
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${eraTheme.gradient}`}>
          Your Learning Journey 
          {preferredEra && (
            <span className="ml-2 text-sm font-normal inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 text-gray-700">
              <span>{eraTheme.icon}</span>
              <EraLabel era={preferredEra} />
            </span>
          )}
        </span>
      </h2>
      {user && (
        <Button 
          variant="ghost" 
          className="text-timelingo-purple font-semibold flex items-center gap-1 hover:bg-purple-100"
          onClick={handleToDashboard}
        >
          Go to Profile
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Button>
      )}
    </div>
  );
};

// Add the missing Button import
import { Button } from '@/components/ui/button';

export default HeroTitle;
