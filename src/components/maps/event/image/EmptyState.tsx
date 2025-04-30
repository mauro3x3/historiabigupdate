
import React from 'react';
import { Image, Upload } from 'lucide-react';

interface EmptyStateProps {
  isAdmin: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isAdmin, onFileSelect }) => {
  return (
    <div className="my-3 w-full h-52 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-gray-500">
        <Image className="w-12 h-12 mb-2" />
        <span className="mb-2">No image available</span>
        
        {/* Only show upload button to admin */}
        {isAdmin && (
          <>
            <label 
              htmlFor="image-upload" 
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </label>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onFileSelect}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
