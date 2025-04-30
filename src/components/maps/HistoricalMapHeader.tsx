
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoricalMapHeaderProps {
  era: string | undefined;
}

const HistoricalMapHeader: React.FC<HistoricalMapHeaderProps> = ({ era }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mr-2"
      >
        <ArrowLeft size={18} />
        <span className="ml-1">Back</span>
      </Button>
      <h1 className="text-2xl font-bold text-timelingo-navy">
        {era ? era.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Historical'} Map
      </h1>
    </div>
  );
};

export default HistoricalMapHeader;
