
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="my-3 w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500 flex flex-col items-center">
        <Loader2 className="w-12 h-12 mb-2 animate-spin" />
        <span>Uploading image...</span>
      </div>
    </div>
  );
};

export default LoadingState;
