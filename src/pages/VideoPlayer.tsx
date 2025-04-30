import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  VideoPlayerHeader, 
  VideoDisplay, 
  VideoDetails, 
  VideoPlayerActions,
  RelatedVideos
} from '@/components/video';
import { useVideoPlayer } from '@/hooks/video/useVideoPlayer';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { video, relatedVideos, isLoading } = useVideoPlayer(videoId);
  
  if (isLoading || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-timelingo-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <VideoPlayerHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <VideoDisplay video={video} />
          
          {/* Video Details */}
          <VideoDetails video={video} />
          
          {/* Actions */}
          <VideoPlayerActions />
        </div>
        
        {/* Related Videos */}
        <div>
          <RelatedVideos videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
