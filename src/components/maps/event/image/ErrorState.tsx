
import React from 'react';

interface ErrorStateProps {
  title?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title }) => {
  return (
    <div className="w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-gray-500 mb-2">Image could not be loaded</p>
        {title && <p className="text-sm text-gray-400">{title}</p>}
        <p className="text-xs text-gray-400 mt-1">Check image path in Supabase storage</p>
        <p className="text-xs text-gray-400">Path should be: event_images/{title?.toLowerCase().split(' ')[0] || 'event'}-X/filename</p>
      </div>
    </div>
  );
};

export default ErrorState;
