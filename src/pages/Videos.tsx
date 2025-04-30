import React from 'react';
import VideosSection from '@/components/dashboard/sections/VideosSection';

const Videos = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <VideosSection />
      </div>
    </div>
  );
};

export default Videos; 