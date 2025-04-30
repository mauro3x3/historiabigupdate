
import React from 'react';
import { Button } from '@/components/ui/button';
import { HistoryVideo } from '@/types';

interface VideoDisplayProps {
  video: HistoryVideo;
}

const VideoDisplay = ({ video }: VideoDisplayProps) => {
  // Check if this is a real video URL
  if (video.videoUrl) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
        <video 
          src={video.videoUrl}
          poster={video.thumbnail}
          controls
          className="w-full h-full"
          autoPlay
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else {
    // Fallback for videos without URL
    return (
      <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="default" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
            Video Unavailable
          </Button>
        </div>
      </div>
    );
  }
};

export default VideoDisplay;
