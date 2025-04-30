
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayerHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="mb-4 flex items-center gap-2"
      onClick={() => navigate('/profile?tab=videos')}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Videos
    </Button>
  );
};

export default VideoPlayerHeader;
