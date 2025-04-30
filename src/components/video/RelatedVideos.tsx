
import React from 'react';
import { HistoryVideo } from '@/types';
import RelatedVideoCard from './RelatedVideoCard';

interface RelatedVideosProps {
  videos: HistoryVideo[];
}

const RelatedVideos = ({ videos }: RelatedVideosProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Related Videos</h3>
      <div className="space-y-3">
        {videos.length > 0 ? (
          videos.map(relatedVideo => (
            <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No related videos found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedVideos;
