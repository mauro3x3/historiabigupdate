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
    <div className="container mx-auto py-8 px-2 md:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-6">
            <VideoPlayerHeader />
            <VideoDisplay video={video} />
            <div className="border-b border-gray-200 my-6" />
            <VideoDetails video={video} />
            <VideoPlayerActions />
          </div>
        </div>
        <aside className="w-full lg:w-[340px] flex-shrink-0">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-xl p-6 sticky top-8">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoPlayer;
