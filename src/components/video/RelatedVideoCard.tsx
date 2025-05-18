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
      className="flex gap-3 p-2 rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group items-center"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-36 h-24 object-cover rounded-lg border-2 border-purple-100 group-hover:border-purple-300 transition-all"
        />
        <div className="absolute bottom-1 right-1 bg-black/70 text-white px-2 py-0.5 text-xs rounded">
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-base line-clamp-2 mb-1 text-timelingo-navy">{video.title}</h4>
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
