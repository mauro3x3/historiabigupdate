import React from 'react';
import { X } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  journey_id: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  summary?: string;
}

interface ModuleModalProps {
  module: Module;
  onClose: () => void;
}

export default function ModuleModal({ module, onClose }: ModuleModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{module.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              module.completed 
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {module.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          {module.summary && (
            <p className="text-gray-600">{module.summary}</p>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Location:</span>
              <span>{module.latitude.toFixed(2)}°N, {module.longitude.toFixed(2)}°E</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 