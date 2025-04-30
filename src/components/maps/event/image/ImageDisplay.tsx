import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl: string;
  title: string;
  onImageClick: () => void;
  onImageError: () => void;
  isAdmin: boolean;
  onUploadClick?: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl, 
  title,
  onImageClick, 
  onImageError,
  isAdmin,
  onUploadClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Use a default placeholder based on title if image fails to load
  const getFallbackSrc = () => {
    return `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
  };

  // Ensure the image URL is properly formatted
  const getFormattedImageUrl = (url: string) => {
    // If it's an Unsplash URL, use as is
    if (url.includes('unsplash.com')) {
      return url;
    }
    
    // If it's already an absolute URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL, ensure it starts with /
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };

  return (
    <div className="my-3 relative">
      {isLoading && !hasError && (
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-gray-500">Loading image...</div>
        </div>
      )}
      <img 
        src={getFormattedImageUrl(imageUrl)}
        alt={title} 
        className={`w-full h-52 object-cover rounded-lg shadow-md cursor-pointer ${isLoading ? 'hidden' : ''}`}
        onClick={onImageClick}
        onLoad={() => {
          console.log('Image loaded successfully:', imageUrl);
          setIsLoading(false);
          setHasError(false);
        }}
        onError={(e) => {
          setIsLoading(false);
          setHasError(true);
          
          // Log detailed error information
          console.error('Image failed to load:', {
            originalUrl: imageUrl,
            formattedUrl: getFormattedImageUrl(imageUrl),
            error: e
          });
          
          // Only use fallback for non-external URLs
          if (!imageUrl.includes('unsplash.com') && !imageUrl.includes('http')) {
            const target = e.currentTarget;
            target.src = getFallbackSrc();
          }
          
          onImageError();
        }}
      />
      
      {/* Only show upload control to admin */}
      {isAdmin && onUploadClick && (
        <label 
          htmlFor="image-upload" 
          className="absolute bottom-2 right-2 bg-white p-1 rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
          title="Replace image"
          onClick={onUploadClick}
        >
          <Upload className="h-5 w-5 text-gray-600" />
        </label>
      )}
    </div>
  );
};

export default ImageDisplay;
