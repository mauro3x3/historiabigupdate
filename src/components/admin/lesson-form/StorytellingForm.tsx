
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ImageLibrary from './ImageLibrary';
import StorytellingPreview from './StorytellingPreview';

interface StorytellingFormProps {
  form: UseFormReturn<any>;
}

const StorytellingForm: React.FC<StorytellingFormProps> = ({ form }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // Get current values for preview
  const storyContent = form.watch('story_content') || '';
  const transitionQuestion = form.watch('transition_question') || 'Are you ready for the test?';
  const imageUrlsString = form.watch('image_urls') || '';
  
  const handleAddImage = (url: string) => {
    const currentUrls = form.getValues('image_urls') || '';
    const updatedUrls = currentUrls ? `${currentUrls}\n${url}` : url;
    form.setValue('image_urls', updatedUrls);
    
    // Update selected images for display
    setSelectedImages([...selectedImages, url]);
  };
  
  const handleRemoveImage = (url: string) => {
    const currentUrls = form.getValues('image_urls') || '';
    const urlList = currentUrls.split('\n').filter(u => u.trim() !== '');
    const updatedUrls = urlList.filter(u => u !== url).join('\n');
    form.setValue('image_urls', updatedUrls);
    
    // Update selected images for display
    setSelectedImages(selectedImages.filter(img => img !== url));
  };
  
  // Initialize selected images from form value
  React.useEffect(() => {
    if (imageUrlsString && selectedImages.length === 0) {
      setSelectedImages(imageUrlsString.split('\n').filter(url => url.trim() !== ''));
    }
  }, [imageUrlsString]);

  return (
    <>
      <FormField
        control={form.control}
        name="story_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Story Content</FormLabel>
            <FormDescription>
              Write an engaging historical story (300-500 words) that will be displayed in a scrolling format.
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter your historical narrative" 
                rows={8} 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-4">
        <FormLabel>Images</FormLabel>
        <FormDescription className="mb-2">
          Add images to display alongside your story. These will be interspersed throughout the narrative.
        </FormDescription>
        
        <div className="flex items-center space-x-2 mb-4">
          <ImageLibrary onSelectImage={handleAddImage} />
          
          <span className="text-xs text-gray-500">or</span>
          
          <FormField
            control={form.control}
            name="custom_image_url"
            render={({ field }) => (
              <div className="flex-1 flex items-center space-x-2">
                <Input 
                  placeholder="Paste image URL" 
                  {...field} 
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    if (field.value) {
                      handleAddImage(field.value);
                      field.onChange('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          />
        </div>
        
        {/* Selected images */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {selectedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Story image ${index + 1}`} 
                  className="rounded-md aspect-video object-cover w-full border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image';
                  }}
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => handleRemoveImage(url)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Hidden field to store image URLs */}
        <FormField
          control={form.control}
          name="image_urls"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="transition_question"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Transition Question</FormLabel>
            <FormDescription>
              Question to display after the story concludes before showing the quiz.
            </FormDescription>
            <FormControl>
              <Input 
                placeholder="Are you ready for the test?"
                defaultValue="Are you ready for the test?"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Preview section */}
      <StorytellingPreview 
        storyContent={storyContent} 
        transitionQuestion={transitionQuestion}
        imageUrls={imageUrlsString}
      />
    </>
  );
};

export default StorytellingForm;
