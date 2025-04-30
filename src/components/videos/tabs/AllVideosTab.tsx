
import React from 'react';
import { HistoryVideo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import VideoCard from '../VideoCard';

interface AllVideosTabProps {
  videos: HistoryVideo[];
  isLoading: boolean;
}

const AllVideosTab = ({ videos, isLoading }: AllVideosTabProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n} className="overflow-hidden">
            <div className="h-40 w-full bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (videos.length === 0) {
    return (
      <div className="col-span-3 py-8 text-center">
        <p className="text-gray-500">No videos match your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default AllVideosTab;
