import React from 'react';
import { HistoryVideo } from '@/types';
import RelatedVideoCard from './RelatedVideoCard';
import { Sparkles } from 'lucide-react';

interface RelatedVideosProps {
  videos: HistoryVideo[];
}

const RelatedVideos = ({ videos }: RelatedVideosProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-400" />
        <h3 className="font-semibold text-lg text-timelingo-navy">Related Videos</h3>
      </div>
      <div className="space-y-4">
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
