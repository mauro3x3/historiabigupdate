
import { useState } from 'react';
import { HistoryVideo } from '@/types';
import { useVideoData } from './useVideoData';

export const useRelatedVideos = () => {
  const { fetchAllVideos } = useVideoData();
  
  const getRelatedVideos = async (currentVideo: HistoryVideo) => {
    const { data: allVideos } = await fetchAllVideos();
    
    if (!allVideos) return [];
    
    return allVideos
      .filter(v => v.category === currentVideo.category && v.id !== currentVideo.id)
      .slice(0, 4);
  };
  
  return { getRelatedVideos };
};
