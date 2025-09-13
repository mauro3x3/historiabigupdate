import React from 'react';
import { X, Calendar, Settings } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { dateFormat, setDateFormat } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gray-50 rounded-t-xl p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Format Setting */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Date Format</h3>
            </div>
            <p className="text-gray-600 mb-4">Choose how dates are displayed throughout the application.</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="dateFormat"
                  value="european"
                  checked={dateFormat === 'european'}
                  onChange={(e) => setDateFormat(e.target.value as 'european')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">European (DD/MM/YYYY)</div>
                  <div className="text-sm text-gray-500">12 September 2025</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="dateFormat"
                  value="american"
                  checked={dateFormat === 'american'}
                  onChange={(e) => setDateFormat(e.target.value as 'american')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">American (MM/DD/YYYY)</div>
                  <div className="text-sm text-gray-500">September 12, 2025</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-xl p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
