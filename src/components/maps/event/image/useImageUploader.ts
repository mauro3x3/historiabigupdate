import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HistoryEvent } from '@/types';

interface UseImageUploaderProps {
  event: HistoryEvent;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setImageError: (error: boolean) => void;
}

export function useImageUploader({ 
  event, 
  imageUrl, 
  setImageUrl, 
  setImageError 
}: UseImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Reset image load error when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImageLoadError(false);
    }
  }, [imageUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Create a unique file path for the image
      const fileExt = file.name.split('.').pop();
      const fileName = `${event.id}.${fileExt}`;  // Simpler naming pattern
      const filePath = `${event.id.split('-')[0]}/${fileName}`; // Group by era
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('event_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('event_images')
        .getPublicUrl(filePath);
      
      // Update local state with the new image URL
      setImageUrl(publicUrl);
      setImageError(false);
      setImageLoadError(false);
      
      // Update the event object with the new image URL
      event.imageUrl = publicUrl;
      
      // Save the updated event in localStorage
      saveEventWithImage(event, publicUrl);
      
      toast({
        title: "Image saved",
        description: "The image has been successfully uploaded and saved for this event.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the image. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to save the event with the updated image URL to localStorage
  const saveEventWithImage = (event: HistoryEvent, imageUrl: string) => {
    try {
      // Get the era from the event ID (e.g., "christian-1" -> "christian")
      const era = event.id.split('-')[0];
      const storageKey = `mapData_${era}`;
      
      // Get existing map data from localStorage or create new data structure
      let mapData = { events: [] };
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        mapData = JSON.parse(storedData);
      }
      
      // Find and update the event in the data
      if (mapData && mapData.events) {
        const eventIndex = mapData.events.findIndex((e: HistoryEvent) => e.id === event.id);
        if (eventIndex !== -1) {
          mapData.events[eventIndex].imageUrl = imageUrl;
        } else {
          // If event not found, add it (unlikely scenario)
          mapData.events.push({...event, imageUrl});
        }
        
        // Save updated data back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(mapData));
      }
    } catch (error) {
      console.error("Error saving event image URL to localStorage:", error);
    }
  };

  const handleImageError = () => {
    // Only set error if it's not an external URL
    if (!imageUrl.includes('unsplash.com') && !imageUrl.includes('http')) {
      setImageLoadError(true);
      setImageError(true);
      console.log('Local image failed to load:', imageUrl);
    } else {
      // For external URLs, try to load a fallback directly
      console.log('External image failed to load:', imageUrl);
      // Don't set the error state for external URLs to avoid showing error UI
    }
  };

  return {
    isUploading,
    imageLoadError,
    handleImageUpload,
    handleImageError
  };
}
