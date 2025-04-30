
import React from 'react';
import { HistoryVideo } from '@/types';

interface VideoDetailsProps {
  video: HistoryVideo;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>{video.views || 0} views</span>
        <span className="mx-2">•</span>
        <span>Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{video.description}</p>
      </div>
    </>
  );
};

export default VideoDetails;
