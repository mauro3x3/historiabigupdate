import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FullScreenImageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
  onImageError: () => void;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  open,
  onOpenChange,
  imageUrl,
  title,
  onImageError
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Get a reliable fallback image based on event title
  const getReliableFallbackImage = (title: string): string => {
    // Map of reliable fallback images for different events
    const fallbackMap: Record<string, string> = {
      'Birth of Jesus': 'https://cdn.pixabay.com/photo/2020/07/12/18/51/jesus-5397281_1280.jpg',
      'Crucifixion of Jesus': 'https://cdn.pixabay.com/photo/2015/04/14/20/28/jesus-722718_1280.jpg',
      'Pentecost': 'https://cdn.pixabay.com/photo/2016/11/13/20/47/bible-1822110_1280.jpg',
      'Conversion of Paul': 'https://cdn.pixabay.com/photo/2015/07/14/19/53/bible-845847_1280.jpg',
      'Council of Nicaea': 'https://cdn.pixabay.com/photo/2015/12/09/14/56/church-1084672_1280.jpg',
      'Christianity becomes Roman state religion': 'https://cdn.pixabay.com/photo/2018/05/13/11/44/pantheon-3396536_1280.jpg',
      'Fall of Rome & Rise of Papal Power': 'https://cdn.pixabay.com/photo/2013/07/07/04/30/roman-143551_1280.jpg',
      'Great Schism': 'https://cdn.pixabay.com/photo/2014/03/02/16/21/church-278368_1280.jpg',
      'Protestant Reformation': 'https://cdn.pixabay.com/photo/2019/05/08/16/32/martin-luther-4188078_1280.jpg',
      'Second Vatican Council': 'https://cdn.pixabay.com/photo/2016/08/22/10/47/vatican-1611768_1280.jpg',
    };
    
    // Return the fallback image for this title or a generic placeholder
    return fallbackMap[title] || 
      `https://placehold.co/800x600?text=${encodeURIComponent(title)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          {imageUrl && !hasError && (
            <img 
              src={imageUrl} 
              alt={title} 
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                console.log('Image failed in fullscreen, trying fallback for:', title);
                // When main image fails, try using a reliable fallback
                const fallbackImg = getReliableFallbackImage(title);
                // If we're already using the fallback image, mark as error
                if (imageUrl === fallbackImg) {
                  setHasError(true);
                  onImageError();
                } else {
                  // Otherwise, replace the src with the fallback
                  e.currentTarget.src = fallbackImg;
                }
              }}
            />
          )}
          {(hasError || !imageUrl) && (
            <div className="max-h-[70vh] w-full flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-500 mb-2">Image could not be loaded</p>
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImage;
