import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import ContentValidator from './ContentValidator';
import { useSettings } from '@/contexts/SettingsContext';

export interface UserGeneratedContent {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  coordinates: [number, number];
  category: string;
  imageUrl?: string;
  dateHappened: string;
  source: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
  onSubmit: (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>) => void;
  defaultDate?: string;
}

export default function AddContentModal({ isOpen, onClose, coordinates, onSubmit, defaultDate }: AddContentModalProps) {
  const { dateFormat } = useSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Historical Event');
  const [author, setAuthor] = useState('Anonymous');
  const [dateHappened, setDateHappened] = useState('');
  const [source, setSource] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Set default date when modal opens
  React.useEffect(() => {
    if (isOpen && defaultDate) {
      setDateHappened(defaultDate);
    }
  }, [isOpen, defaultDate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processImageFile(imageFile);
    }
  };

  const handleDropZoneClick = () => {
    // Trigger file input click
    const fileInput = document.getElementById('image-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
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
          imageUrl: base64Image,
          dateHappened: dateHappened.trim(),
          source: source.trim()
        };
        onSubmit(newContent);
        
        // Reset form and close modal after successful submission
        setTitle('');
        setDescription('');
        setCategory('Historical Event');
        setAuthor('');
        setDateHappened('');
        setSource('');
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
      imageUrl: finalImageUrl,
      dateHappened: dateHappened.trim(),
      source: source.trim()
    };
    onSubmit(newContent);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Historical Event');
    setAuthor('');
    setDateHappened('');
    setSource('');
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
              <h2 className="text-2xl font-bold">Add Content</h2>
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
          {/* Validation Results */}
          {validationResult && (
            <div className={`p-4 rounded-lg border ${
              validationResult.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    validationResult.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validationResult.isValid ? 'Content looks good!' : 'Please fix the following issues:'}
                  </h4>
                  {validationResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                  {validationResult.warnings.length > 0 && (
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your content"
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
              placeholder="Describe the event, person, or place..."
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
              style={{ appearance: 'auto' }}
              size={5}
            >
              <option value="Historical Event">Historical Event</option>
              <option value="Historical Figure">Historical Figure</option>
              <option value="Archaeological Site">Archaeological Site</option>
              <option value="Battle">Battle</option>
              <option value="Monument">Monument</option>
              <option value="Cultural Site">Cultural Site</option>
              <option value="Discovery">Discovery</option>
              <option value="Politics / Government">Politics / Government</option>
              <option value="Conflict / War Updates">Conflict / War Updates</option>
              <option value="Environment / Climate">Environment / Climate</option>
              <option value="Protests">Protests</option>
              <option value="Economy / Business">Economy / Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date It Happened *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dateHappened}
                onChange={(e) => setDateHappened(e.target.value)}
                placeholder="Enter date (e.g., 02/24/1337, 1066, or 44 BC)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const month = (today.getMonth() + 1).toString().padStart(2, '0');
                  const day = today.getDate().toString().padStart(2, '0');
                  const year = today.getFullYear();
                  // Use European format (DD/MM/YYYY) by default, or American if user prefers
                  const formattedDate = dateFormat === 'european' 
                    ? `${day}/${month}/${year}` 
                    : `${month}/${day}/${year}`;
                  setDateHappened(formattedDate);
                }}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                Today
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Examples: {dateFormat === 'european' ? '24/02/1337, 1066, 44 BC, 1776, 25/12/800' : '02/24/1337, 1066, 44 BC, 1776, 12/25/800'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source *
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where did you learn this information? (e.g., book, website, museum)"
              required
            />
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
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleDropZoneClick}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>
                      {' '}or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                      title="Remove image"
                    >
                      ×
                    </button>
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
                {imageUrl && !imageUrl.startsWith('http') && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ URL should start with http:// or https://
                  </p>
                )}
                {imageUrl && (
                  <div className="mt-2 relative">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                      title="Remove image"
                    >
                      ×
                    </button>
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
              type="button"
              onClick={() => {
                const contentToValidate = {
                  title: title.trim(),
                  description: description.trim(),
                  author: author.trim() || 'Anonymous',
                  coordinates: coordinates!,
                  category,
                  dateHappened: dateHappened.trim(),
                  source: source.trim()
                };
                const validator = ContentValidator.getInstance();
                const validation = validator.validateContent(contentToValidate);
                setValidationResult(validation);
              }}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Validate
            </button>
            <button
              type="submit"
              disabled={isValidating || (validationResult && !validationResult.isValid)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {isValidating ? 'Validating...' : 'Add to Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
