
import React from 'react';
import { HistoryEvent } from '@/types';
import { useImageUploader } from './image/useImageUploader';
import ImageDisplay from './image/ImageDisplay';
import LoadingState from './image/LoadingState';
import EmptyState from './image/EmptyState';
import ErrorState from './image/ErrorState';

interface ImageUploaderProps {
  event: HistoryEvent;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setImageError: (error: boolean) => void;
  onImageClick: () => void;
  isAdmin: boolean; // Only admins can upload images
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  event, 
  imageUrl, 
  setImageUrl, 
  setImageError, 
  onImageClick,
  isAdmin
}) => {
  const {
    isUploading,
    imageLoadError,
    handleImageUpload,
    handleImageError
  } = useImageUploader({
    event,
    imageUrl,
    setImageUrl,
    setImageError
  });

  // Display the uploaded image if available
  if (imageUrl && !isUploading) {
    return imageLoadError ? (
      <ErrorState title={event.title} />
    ) : (
      <ImageDisplay
        imageUrl={imageUrl}
        title={event.title}
        onImageClick={onImageClick}
        onImageError={handleImageError}
        isAdmin={isAdmin}
        onUploadClick={() => document.getElementById('image-upload')?.click()}
      />
    );
  }

  // Show loading state while uploading
  if (isUploading) {
    return <LoadingState />;
  }

  // No image state
  return <EmptyState isAdmin={isAdmin} onFileSelect={handleImageUpload} />;
};

export default ImageUploader;
