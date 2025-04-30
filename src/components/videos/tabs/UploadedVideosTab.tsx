
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryVideo } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import VideoCard from '../VideoCard';

interface UploadedVideosTabProps {
  videos: HistoryVideo[];
  userId?: string;
  isLoading: boolean;
}

const UploadedVideosTab = ({ videos, userId, isLoading }: UploadedVideosTabProps) => {
  const navigate = useNavigate();
  const userVideos = videos.filter(v => v.uploaderId === userId);
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent" />
        <p className="mt-2 text-gray-500">Loading your uploads...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">Your Uploaded Videos</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate('/video-upload')}
        >
          <Plus className="h-4 w-4" />
          New Upload
        </Button>
      </div>
      
      {userVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-gray-50 rounded-lg">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 mb-4">You haven't uploaded any videos yet</p>
          <Button 
            onClick={() => navigate('/video-upload')}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Upload Your First Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadedVideosTab;
