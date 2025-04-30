
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image, Search, Plus, X } from 'lucide-react';

// Sample historical images - in a real app, these would come from an API or database
const sampleImages = [
  { id: '1', url: 'https://source.unsplash.com/random/800x600/?ancient-egypt', tags: ['egypt', 'ancient'] },
  { id: '2', url: 'https://source.unsplash.com/random/800x600/?rome', tags: ['rome', 'ancient'] },
  { id: '3', url: 'https://source.unsplash.com/random/800x600/?greek', tags: ['greece', 'ancient'] },
  { id: '4', url: 'https://source.unsplash.com/random/800x600/?medieval', tags: ['medieval', 'castle'] },
  { id: '5', url: 'https://source.unsplash.com/random/800x600/?renaissance', tags: ['renaissance', 'art'] },
  { id: '6', url: 'https://source.unsplash.com/random/800x600/?industrial-revolution', tags: ['industrial', 'revolution'] },
  { id: '7', url: 'https://source.unsplash.com/random/800x600/?world-war', tags: ['war', 'modern'] },
  { id: '8', url: 'https://source.unsplash.com/random/800x600/?ancient-china', tags: ['china', 'ancient'] },
];

interface ImageLibraryProps {
  onSelectImage: (url: string) => void;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onSelectImage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState(sampleImages);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = sampleImages.filter(img => 
        img.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(sampleImages);
    }
  }, [searchTerm]);
  
  const handleSelectImage = (url: string) => {
    onSelectImage(url);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Browse Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Historical Image Library</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search by tag (e.g. egypt, medieval)" 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X 
              className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
        
        <div className="mb-2 text-xs text-gray-500">
          Click an image to add it to your lesson
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="overflow-hidden rounded-md border group relative cursor-pointer"
                onClick={() => handleSelectImage(image.url)}
              >
                <img 
                  src={image.url} 
                  alt={`Historical image ${image.id}`}
                  className="object-cover aspect-video w-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="text-white h-8 w-8" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                  {image.tags.map(tag => `#${tag}`).join(' ')}
                </div>
              </div>
            ))}
            
            {filteredImages.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No images found matching "{searchTerm}"
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-2 text-xs text-gray-500">
          Note: These are sample images. In a production environment, you could integrate with a real image library or upload system.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLibrary;
