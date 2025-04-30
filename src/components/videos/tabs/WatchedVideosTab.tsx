
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HistoryVideo } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import VideoCard from '../VideoCard';

const WatchedVideosTab = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [watchedVideos, setWatchedVideos] = useState<HistoryVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedVideos = async () => {
      setIsLoading(true);
      try {
        // Get history from localStorage
        const viewsHistory = JSON.parse(localStorage.getItem('videoViews') || '{}');
        const watchedVideoIds = Object.keys(viewsHistory);
        
        if (watchedVideoIds.length === 0) {
          setWatchedVideos([]);
          setIsLoading(false);
          return;
        }
        
        // Separate database IDs from storage IDs
        const dbVideoIds = watchedVideoIds.filter(id => !id.startsWith('storage-'));
        const storageVideoIds = watchedVideoIds.filter(id => id.startsWith('storage-'));
        
        let dbVideos: HistoryVideo[] = [];
        let storageVideos: HistoryVideo[] = [];
        
        // Fetch database videos if any
        if (dbVideoIds.length > 0) {
          const { data, error } = await supabase
            .from('videos')
            .select('*')
            .in('id', dbVideoIds);
            
          if (error) throw error;
          
          dbVideos = (data || []).map(video => ({
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
        }
        
        // For storage videos, we need to fetch all and filter
        if (storageVideoIds.length > 0) {
          const { data: storageFiles, error: storageError } = await supabase
            .storage
            .from('videos')
            .list();
            
          if (!storageError && storageFiles) {
            // Filter video files
            const videoFiles = storageFiles.filter(file => 
              file.name.endsWith('.mp4') || 
              file.name.endsWith('.webm') || 
              file.name.endsWith('.mov')
            );
            
            // Create video objects
            const allStorageVideos = videoFiles.map((file, index) => {
              const videoId = `storage-${index}`;
              
              // Skip if not in watched list
              if (!storageVideoIds.includes(videoId)) {
                return null;
              }
              
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
                id: videoId,
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
            }).filter(video => video !== null) as HistoryVideo[];
            
            storageVideos = allStorageVideos;
          }
        }
        
        // Combine all videos
        const allWatchedVideos = [...dbVideos, ...storageVideos];
        
        // Sort by most recently watched
        allWatchedVideos.sort((a, b) => {
          const timeA = viewsHistory[a.id] || 0;
          const timeB = viewsHistory[b.id] || 0;
          return timeB - timeA; // Descending order
        });
        
        setWatchedVideos(allWatchedVideos);
      } catch (error) {
        console.error('Error fetching watched videos:', error);
        setWatchedVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWatchedVideos();
  }, []);
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent" />
        <p className="mt-2 text-gray-500">Loading your watched videos...</p>
      </div>
    );
  }
  
  if (watchedVideos.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 mb-4">You haven't watched any videos yet.</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => navigate('/profile?tab=videos')}
        >
          Explore videos
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">Recently Watched Videos</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {watchedVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default WatchedVideosTab;
