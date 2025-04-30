
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2, Bookmark, Flag } from 'lucide-react';

const VideoPlayerActions = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <ThumbsUp className="h-4 w-4" />
        Like
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Bookmark className="h-4 w-4" />
        Save
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Flag className="h-4 w-4" />
        Report
      </Button>
    </div>
  );
};

export default VideoPlayerActions;
