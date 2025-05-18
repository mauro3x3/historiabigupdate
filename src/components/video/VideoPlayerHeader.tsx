import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayerHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      className="mb-6 flex items-center gap-2 px-6 py-3 rounded-full shadow-md bg-white/80 hover:bg-purple-50 text-timelingo-navy font-semibold text-lg border-2 border-purple-100"
      onClick={() => navigate('/profile?tab=videos')}
    >
      <ArrowLeft className="h-5 w-5" />
      Back to Videos
    </Button>
  );
};

export default VideoPlayerHeader;
