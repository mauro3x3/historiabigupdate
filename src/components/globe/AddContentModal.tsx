import React, { useState } from 'react';

export interface UserGeneratedContent {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  coordinates: [number, number];
  category: string;
  imageUrl?: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
  onSubmit: (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>) => void;
}

export default function AddContentModal({ isOpen, onClose, coordinates, onSubmit }: AddContentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Historical Event');
  const [author, setAuthor] = useState('Anonymous');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinates) return;

    // Determine which image source to use
    let finalImageUrl = undefined;
    if (useImageUrl && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
    } else if (imageFile) {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        const newContent = {
          title: title.trim(),
          description: description.trim(),
          author: author.trim() || 'Anonymous',
          coordinates,
          category,
          imageUrl: base64Image
        };
        onSubmit(newContent);
        
        // Reset form and close modal after successful submission
        setTitle('');
        setDescription('');
        setCategory('Historical Event');
        setAuthor('');
        setImageFile(null);
        setImagePreview(null);
        setImageUrl('');
        setUseImageUrl(false);
        onClose();
      };
      reader.readAsDataURL(imageFile);
      return; // Exit early since we're handling async file reading
    }

    const newContent = {
      title: title.trim(),
      description: description.trim(),
      author: author.trim() || 'Anonymous',
      coordinates,
      category,
      imageUrl: finalImageUrl
    };
    onSubmit(newContent);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Historical Event');
    setAuthor('');
    setImageFile(null);
    setImagePreview(null);
    setImageUrl('');
    setUseImageUrl(false);
    
    onClose();
  };

  if (!isOpen || !coordinates) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 rounded-t-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Add Historical Content</h2>
              <p className="text-blue-100 mt-1">Share your knowledge with the community</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your historical content"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the historical event, person, or place..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Historical Event">Historical Event</option>
              <option value="Historical Figure">Historical Figure</option>
              <option value="Archaeological Site">Archaeological Site</option>
              <option value="Battle">Battle</option>
              <option value="Monument">Monument</option>
              <option value="Cultural Site">Cultural Site</option>
              <option value="Discovery">Discovery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name or 'Anonymous'"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optional)
            </label>
            
            {/* Image source toggle */}
            <div className="flex space-x-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!useImageUrl}
                  onChange={() => setUseImageUrl(false)}
                  className="mr-2"
                />
                Upload File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={useImageUrl}
                  onChange={() => setUseImageUrl(true)}
                  className="mr-2"
                />
                Image URL
              </label>
            </div>
            
            {!useImageUrl ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">📍 Selected Location</div>
            <div className="font-mono text-sm text-gray-800">
              {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
            >
              Add to Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
