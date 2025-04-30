
import { useState, useEffect } from 'react';

export const useVideoHistory = () => {
  const trackVideoView = (id: string) => {
    if (!id) return;
    
    const viewsHistory = JSON.parse(localStorage.getItem('videoViews') || '{}');
    const now = Date.now();
    viewsHistory[id] = now;
    localStorage.setItem('videoViews', JSON.stringify(viewsHistory));
  };
  
  const getVideoHistory = () => {
    return JSON.parse(localStorage.getItem('videoViews') || '{}');
  };
  
  return {
    trackVideoView,
    getVideoHistory
  };
};
