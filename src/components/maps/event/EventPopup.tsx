import React, { useState, useEffect } from 'react';
import { HistoryEvent } from '@/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploader from './ImageUploader';
import DirectImageDisplay from './DirectImageDisplay';
import EventDetails from './EventDetails';
import { useUser } from '@/contexts/UserContext';
import FullScreenImage from './FullScreenImage';
import PopupHeader from './PopupHeader';

interface EventPopupProps {
  event: HistoryEvent;
  onClose: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showFullImage, setShowFullImage] = useState(false);
  const { user } = useUser();
  
  // Admin check - replace with your own admin user check logic
  const isAdmin = user?.email === 'admin@timelingo.app';
  
  // Update imageUrl when event changes
  useEffect(() => {
    if (event.imageUrl) {
      setImageUrl(event.imageUrl);
      setImageError(false);
    } else {
      setImageUrl('');
    }
  }, [event.id, event.imageUrl]);
  
  const handleImageClick = () => {
    if (imageUrl && !imageError) {
      setShowFullImage(true);
    }
  };

  // Check if the image is an external URL (e.g., Unsplash, etc.)
  const isExternalUrl = imageUrl && (imageUrl.includes('unsplash.com') || imageUrl.includes('wikimedia.org'));

  return (
    <>
      <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-xl p-4 z-20 animate-fade-in">
        <PopupHeader title={event.title} onClose={onClose} />
        
        <EventDetails event={event} />
        
        {isExternalUrl ? (
          <DirectImageDisplay 
            imageUrl={imageUrl}
            title={event.title}
            onImageClick={handleImageClick}
          />
        ) : (
          <ImageUploader 
            event={event}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            setImageError={setImageError}
            onImageClick={handleImageClick}
            isAdmin={isAdmin}
          />
        )}
      </div>

      <FullScreenImage 
        open={showFullImage}
        onOpenChange={setShowFullImage}
        imageUrl={imageUrl}
        title={event.title}
        onImageError={() => setImageError(true)}
      />
    </>
  );
};

export default EventPopup;
