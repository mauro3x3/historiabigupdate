import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HistoryVideo, VideoCategory } from '@/types';
import { useUser } from '@/contexts/UserContext';

const MOCK_CATEGORIES: VideoCategory[] = [
  {
    id: '1',
    name: 'Ancient Civilizations',
    description: 'Explore the wonders of ancient Egypt, Greece, and Rome',
    thumbnailUrl: 'https://placehold.co/600x400?text=Ancient+Civilizations',
    videoCount: 12
  },
  {
    id: '2',
    name: 'Medieval History',
    description: 'Knights, castles and the Middle Ages',
    thumbnailUrl: 'https://placehold.co/600x400?text=Medieval+History',
    videoCount: 8
  },
  {
    id: '3',
    name: 'World Wars',
    description: 'Key events and figures from WWI and WWII',
    thumbnailUrl: 'https://placehold.co/600x400?text=World+Wars',
    videoCount: 15
  },
  {
    id: '4',
    name: 'Great Leaders',
    description: 'Profiles of influential historical leaders',
    thumbnailUrl: 'https://placehold.co/600x400?text=Great+Leaders',
    videoCount: 10
  }
];

const THUMBNAILS = {
  india: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  iran: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  islam: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
  middleeast: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  southasia: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  iberia: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  theworld: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  westerneurope: "https://images.unsplash.com/photo-1426604966848-d7adac402bff"
};

const FLAG_EMOJIS: Record<string, string> = {
  iberia: "🇪🇸",
  india: "🇮🇳",
  iran: "🇮🇷",
  islam: "🕌",
  middleeast: "🇸🇦",
  southasia: "🇮🇳",
  theworld: "🌏",
  westerneurope: "🇬🇧",
};

// Function to generate a random duration between 3 and 20 minutes
const generateRandomDuration = (): number => {
  // Generate between 180 (3 mins) and 1200 (20 mins) seconds
  return Math.floor(Math.random() * (1200 - 180 + 1)) + 180;
};

function formatVideoTitle(raw: string): string {
  // Remove 'historyof' prefix if present
  let title = raw.replace(/^historyof/i, '');
  // Known fixes
  const fixes: Record<string, string> = {
    'middleeast': 'Middle East',
    'southasia': 'South Asia',
    'westerneurope': 'Western Europe',
    'theworld': 'The World',
    'westernEurope': 'Western Europe',
    'northamerica': 'North America',
    'eastasia': 'East Asia',
    'southeastasia': 'Southeast Asia',
    'sub-saharanafrica': 'Sub-Saharan Africa',
    // Add more as needed
  };
  const lower = title.toLowerCase();
  if (fixes[lower]) return fixes[lower];
  // Insert spaces before capital letters and between lowercase-uppercase
  title = title.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize each word
  title = title.replace(/\b\w/g, c => c.toUpperCase());
  return title.trim();
}

export const useVideosData = (userId?: string) => {
  const [videos, setVideos] = useState<HistoryVideo[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const { data: dbVideos, error: dbError } = await supabase
          .from('videos')
          .select('*')
          .order('upload_date', { ascending: false });

        if (dbError) {
          console.error('Error fetching videos from database:', dbError);
        }

        if (dbVideos && dbVideos.length > 0) {
          const formattedVideos: HistoryVideo[] = dbVideos.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || '',
            thumbnail: video.thumbnail || 'https://placehold.co/640x360?text=Video+Thumbnail',
            videoUrl: video.video_url,
            duration: video.duration || generateRandomDuration(),
            era: video.era || 'unknown',
            category: video.category || 'Uncategorized',
            uploadDate: video.upload_date,
            views: video.views || 0,
            uploaderId: video.uploader_id
          }));
          
          setVideos(formattedVideos);
          setIsLoading(false);
          return;
        }

        const { data: storageFiles, error: storageError } = await supabase
          .storage
          .from('videos')
          .list();

        if (storageError) {
          console.error('Error fetching videos from storage:', storageError);
          setVideos([]);
          setIsLoading(false);
          return;
        }

        if (storageFiles && storageFiles.length > 0) {
          const videoFiles = storageFiles.filter(file => 
            file.name.endsWith('.mp4') || 
            file.name.endsWith('.webm') || 
            file.name.endsWith('.mov')
          );

          const storageVideos: HistoryVideo[] = videoFiles.map((file, index) => {
            const videoUrl = supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl;
            const nameWithoutExt = file.name.split('.')[0];
            let title = formatVideoTitle(nameWithoutExt);
            let era = 'unknown';
            if (nameWithoutExt.startsWith('historyof')) {
              era = title;
            }

            let category = 'Uncategorized';
            if (title.toLowerCase().includes('india') || title.toLowerCase().includes('asia')) {
              category = 'Ancient Civilizations';
            } else if (title.toLowerCase().includes('middleeast') || title.toLowerCase().includes('islam')) {
              category = 'Medieval History';
            } else if (title.toLowerCase().includes('europe') || title.toLowerCase().includes('world')) {
              category = 'World Wars';
            } else if (title.toLowerCase().includes('iran') || title.toLowerCase().includes('liberia')) {
              category = 'Great Leaders';
            }

            const key = title.replace(/\s+/g, '').toLowerCase();
            const emoji = FLAG_EMOJIS[key] || "🏳️";
            
            // Generate a random duration for each video
            const duration = generateRandomDuration();
            
            return {
              id: `storage-${index}`,
              title: title,
              description: `Historical overview of ${title}`,
              thumbnail: emoji,
              videoUrl: videoUrl,
              duration: duration,
              era: era,
              category: category,
              uploadDate: file.created_at || new Date().toISOString(),
              views: 0,
              uploaderId: user?.id
            };
          });
          setVideos(storageVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [userId, user?.id]);

  const filteredVideos = videos.filter(
    video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    videos: filteredVideos,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery
  };
};
