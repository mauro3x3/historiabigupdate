
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryVideo } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVideoPlayer = (videoId: string | undefined) => {
  const navigate = useNavigate();
  const [video, setVideo] = useState<HistoryVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<HistoryVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!videoId) {
      navigate('/profile');
      return;
    }
    
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        
        // Check if this is a database video (UUID) or storage video (starts with storage-)
        if (videoId.startsWith('storage-')) {
          // Fetch all videos from the hook to find the matching one
          const { data: videos, error: videosError } = await fetchAllVideos();
          
          if (videosError || !videos || videos.length === 0) {
            throw new Error('Video not found');
          }
          
          const foundVideo = videos.find(v => v.id === videoId);
          if (!foundVideo) {
            throw new Error('Video not found');
          }
          
          setVideo(foundVideo);
          
          // Get videos from the same category for recommendations
          const relatedVids = videos
            .filter(v => v.category === foundVideo.category && v.id !== videoId)
            .slice(0, 4);
            
          setRelatedVideos(relatedVids);
        } else {
          // Fetch the video from Supabase database (original code path)
          const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .select('*')
            .eq('id', videoId)
            .single();
          
          if (videoError) {
            throw new Error('Video not found');
          }
          
          const formattedVideo: HistoryVideo = {
            id: videoData.id,
            title: videoData.title,
            description: videoData.description || '',
            thumbnail: videoData.thumbnail || 'https://placehold.co/640x360?text=Video+Thumbnail',
            videoUrl: videoData.video_url,
            duration: videoData.duration || 0,
            era: videoData.era || 'unknown',
            category: videoData.category || 'Uncategorized',
            uploadDate: videoData.upload_date,
            views: videoData.views || 0,
            uploaderId: videoData.uploader_id
          };
          
          setVideo(formattedVideo);
          
          // Get videos from the same category for recommendations
          const { data: relatedData, error: relatedError } = await supabase
            .from('videos')
            .select('*')
            .eq('category', formattedVideo.category)
            .neq('id', videoId)
            .limit(4);
          
          if (!relatedError && relatedData) {
            const formattedRelated: HistoryVideo[] = relatedData.map(video => ({
              id: video.id,
              title: video.title,
              description: video.description || '',
              thumbnail: video.thumbnail || 'https://placehold.co/640x360?text=Video+Thumbnail',
              videoUrl: video.video_url,
              duration: video.duration || 0,
              era: video.era || 'unknown',
              category: video.category || 'Uncategorized',
              uploadDate: video.upload_date,
              views: video.views || 0,
              uploaderId: video.uploader_id
            }));
            
            setRelatedVideos(formattedRelated);
          }
        }
        
        // Update document title with the video title
        if (video) {
          document.title = `${video.title} - TimeLingo`;
        }
        
        // Track that the user has watched this video
        const viewsHistory = JSON.parse(localStorage.getItem('videoViews') || '{}');
        const now = Date.now();
        viewsHistory[videoId] = now;
        localStorage.setItem('videoViews', JSON.stringify(viewsHistory));
        
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error("Video not found");
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideo();
    
    // Cleanup on unmount
    return () => {
      document.title = 'TimeLingo';
    };
  }, [videoId, navigate]);
  
  // Helper function to fetch all videos (for storage videos)
  const fetchAllVideos = async () => {
    try {
      // First try to get videos from database
      const { data: dbVideos, error: dbError } = await supabase
        .from('videos')
        .select('*');
      
      if (dbError) {
        console.error('Error fetching database videos:', dbError);
      }
      
      // Then get videos from storage
      const { data: storageFiles, error: storageError } = await supabase
        .storage
        .from('videos')
        .list();
        
      if (storageError) {
        console.error('Error fetching storage videos:', storageError);
        return { data: dbVideos || [], error: null };
      }
      
      if (!storageFiles || storageFiles.length === 0) {
        return { data: dbVideos || [], error: null };
      }
      
      // Filter and format storage videos
      const videoFiles = storageFiles.filter(file => 
        file.name.endsWith('.mp4') || 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mov')
      );
      
      const storageVideos: HistoryVideo[] = videoFiles.map((file, index) => {
        const videoUrl = supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl;
        
        // Extract era and title from filename
        const nameWithoutExt = file.name.split('.')[0];
        let title = nameWithoutExt;
        let era = 'unknown';
        
        if (nameWithoutExt.startsWith('historyof')) {
          title = nameWithoutExt.replace('historyof', '');
          era = title;
        }
        
        // Format title for display
        title = title.charAt(0).toUpperCase() + title.slice(1);
        
        // Determine category based on filename
        let category = 'Uncategorized';
        if (title.includes('india') || title.includes('asia')) {
          category = 'Ancient Civilizations';
        } else if (title.includes('middleeast') || title.includes('islam')) {
          category = 'Medieval History';
        } else if (title.includes('europe') || title.includes('world')) {
          category = 'World Wars';
        } else if (title.includes('iran') || title.includes('liberia')) {
          category = 'Great Leaders';
        }
        
        return {
          id: `storage-${index}`,
          title: title,
          description: `Historical overview of ${title}`,
          thumbnail: `https://placehold.co/640x360?text=${title}`,
          videoUrl: videoUrl,
          duration: 300, // Default duration of 5 minutes
          era: era,
          category: category,
          uploadDate: file.created_at || new Date().toISOString(),
          views: 0,
          uploaderId: null
        };
      });
      
      // Combine database and storage videos
      const allVideos = [
        ...(dbVideos || []).map(video => ({
          id: video.id,
          title: video.title,
          description: video.description || '',
          thumbnail: video.thumbnail || 'https://placehold.co/640x360?text=Video+Thumbnail',
          videoUrl: video.video_url,
          duration: video.duration || 300,
          era: video.era || 'unknown',
          category: video.category || 'Uncategorized',
          uploadDate: video.upload_date,
          views: video.views || 0,
          uploaderId: video.uploader_id
        })),
        ...storageVideos
      ];
      
      return { data: allVideos, error: null };
      
    } catch (error) {
      console.error('Error in fetchAllVideos:', error);
      return { data: [], error };
    }
  };
  
  return {
    video,
    relatedVideos,
    isLoading
  };
};
