import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryVideo } from '@/types';
import { toast } from 'sonner';
import { useVideoData } from './useVideoData';
import { useVideoHistory } from './useVideoHistory';
import { useRelatedVideos } from './useRelatedVideos';

export const useVideoPlayer = (videoId: string | undefined) => {
  const navigate = useNavigate();
  const [video, setVideo] = useState<HistoryVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<HistoryVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { fetchAllVideos } = useVideoData();
  const { trackVideoView } = useVideoHistory();
  const { getRelatedVideos } = useRelatedVideos();
  
  useEffect(() => {
    if (!videoId) {
      navigate('/profile');
      return;
    }
    
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        
        const { data: videos, error } = await fetchAllVideos();
        
        if (error || !videos || videos.length === 0) {
          throw new Error('Video not found');
        }
        
        const foundVideo = videos.find(v => v.id === videoId);
        if (!foundVideo) {
          throw new Error('Video not found');
        }
        
        setVideo(foundVideo);
        
        // Get related videos
        const relatedVids = await getRelatedVideos(foundVideo);
        setRelatedVideos(relatedVids);
        
        // Track view
        trackVideoView(videoId);
        
        // Update document title
        document.title = `${foundVideo.title} - Historia`;
        
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error("Video not found");
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideo();
    
    // Cleanup
    return () => {
      document.title = 'Historia';
    };
  }, [videoId, navigate]);
  
  return {
    video,
    relatedVideos,
    isLoading
  };
};
