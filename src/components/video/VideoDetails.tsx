import React from 'react';
import { HistoryVideo } from '@/types';

interface VideoDetailsProps {
  video: HistoryVideo;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-timelingo-navy leading-tight">{video.title}</h1>
      <div className="text-base text-purple-600 font-semibold mb-2">{video.category}</div>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>{video.views || 0} views</span>
        <span className="mx-2">•</span>
        <span>Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</span>
      </div>
      <div className="bg-gray-50 p-5 rounded-xl mt-6 shadow-sm">
        <h3 className="font-semibold mb-2 text-timelingo-navy">Description</h3>
        <p className="text-base text-gray-700 whitespace-pre-line">{video.description}</p>
      </div>
    </>
  );
};

export default VideoDetails;
