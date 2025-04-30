import React, { useState } from 'react';

interface DirectImageDisplayProps {
  imageUrl: string;
  title: string;
  onImageClick: () => void;
}

const DirectImageDisplay: React.FC<DirectImageDisplayProps> = ({ 
  imageUrl, 
  title,
  onImageClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
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
      `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
  };

  return (
    <div className="my-3 relative">
      {isLoading && !hasError && (
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-gray-500">Loading image...</div>
        </div>
      )}
      {!hasError && (
        <img 
          src={imageUrl}
          alt={title} 
          className={`w-full h-52 object-cover rounded-lg shadow-md cursor-pointer ${isLoading ? 'hidden' : ''}`}
          onClick={onImageClick}
          onLoad={() => {
            console.log('Direct image loaded successfully:', imageUrl);
            setIsLoading(false);
          }}
          onError={() => {
            console.log('Image failed, trying fallback for:', title);
            // When main image fails, try using a reliable fallback
            const fallbackImg = getReliableFallbackImage(title);
            // If we're already using the fallback image, mark as error
            if (imageUrl === fallbackImg) {
              setIsLoading(false);
              setHasError(true);
            } else {
              // Otherwise, replace the src with the fallback
              const imgElement = document.querySelector(`img[alt="${title}"]`) as HTMLImageElement;
              if (imgElement) {
                imgElement.src = fallbackImg;
              }
            }
          }}
        />
      )}
      {hasError && (
        <div 
          onClick={onImageClick}
          className="w-full h-52 bg-gray-100 flex flex-col items-center justify-center rounded-lg text-center p-4 cursor-pointer"
        >
          <div className="text-gray-500 mb-2">Image unavailable</div>
          <div className="text-2xl font-bold">{title}</div>
        </div>
      )}
    </div>
  );
};

export default DirectImageDisplay; 