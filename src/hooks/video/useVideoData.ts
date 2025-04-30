
import { useState } from 'react';
import { HistoryVideo } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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

export const useVideoData = () => {
  const fetchAllVideos = async () => {
    try {
      const { data: storageFiles, error: storageError } = await supabase
        .storage
        .from('videos')
        .list();
        
      if (storageError) {
        console.error('Error fetching storage videos:', storageError);
        return { data: [], error: storageError };
      }
      
      if (!storageFiles || storageFiles.length === 0) {
        return { data: [], error: null };
      }
      
      const videoFiles = storageFiles.filter(file => 
        file.name.endsWith('.mp4') || 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mov')
      );
      
      const storageVideos: HistoryVideo[] = videoFiles.map((file, index) => {
        const videoUrl = supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl;
        const nameWithoutExt = file.name.split('.')[0];
        let title = nameWithoutExt;

        if (nameWithoutExt.startsWith('historyof')) {
          title = nameWithoutExt.replace('historyof', '');
        }
        title = title.charAt(0).toUpperCase() + title.slice(1);

        let category = 'Uncategorized';
        if (title.toLowerCase().includes('india') || title.toLowerCase().includes('asia')) {
          category = 'Ancient Civilizations';
        } else if (title.toLowerCase().includes('middleeast') || title.toLowerCase().includes('islam')) {
          category = 'Medieval History';
        } else if (title.toLowerCase().includes('europe') || title.toLowerCase().includes('world')) {
          category = 'World Wars';
        } else if (title.toLowerCase().includes('iran') || title.toLowerCase().includes('iberia')) {
          category = 'Great Leaders';
        }

        const key = title.replace(/\s+/g, '').toLowerCase();
        const emoji = FLAG_EMOJIS[key] || "🏳️";

        // Generate a random duration for each video
        const duration = generateRandomDuration();

        return {
          id: `storage-${index}`,
          title,
          description: `Historical overview of ${title}`,
          thumbnail: emoji, // Store emoji
          videoUrl,
          duration,
          era: category.toLowerCase(),
          category,
          uploadDate: file.created_at || new Date().toISOString(),
          views: 0,
          uploaderId: null
        };
      });
      return { data: storageVideos, error: null };
    } catch (error) {
      console.error('Error in fetchAllVideos:', error);
      return { data: [], error };
    }
  };
  
  return { fetchAllVideos };
};
