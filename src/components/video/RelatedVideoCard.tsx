
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryVideo } from '@/types';

interface RelatedVideoCardProps {
  video: HistoryVideo;
}

const RelatedVideoCard = ({ video }: RelatedVideoCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-32 h-20 object-cover rounded"
        />
        <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1.5 py-0.5 text-xs rounded">
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
        <div className="flex items-center text-xs text-gray-500">
          <span>{video.views} views</span>
          <span className="mx-1">•</span>
          <span>{video.category}</span>
        </div>
      </div>
    </div>
  );
};

export default RelatedVideoCard;
