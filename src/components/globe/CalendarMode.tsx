import React, { useState, useEffect } from 'react';
import { Calendar, Search, X, MapPin, Clock, User } from 'lucide-react';

interface CalendarModeProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  events: Array<{
    id: string;
    title: string;
    description: string;
    author: string;
    category: string;
    coordinates: [number, number];
    dateHappened: string;
    imageUrl?: string;
  }>;
}

export default function CalendarMode({ isOpen, onClose, onDateSelect, selectedDate, events }: CalendarModeProps) {
  const [searchDate, setSearchDate] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setSearchDate(selectedDate);
      filterEventsByDate(selectedDate);
    }
  }, [selectedDate, events]);

  const filterEventsByDate = (dateString: string) => {
    setIsSearching(true);
    
    // Parse different date formats
    let searchDate: Date;
    
    if (dateString.includes('/')) {
      // MM/DD/YYYY format
      const [month, day, year] = dateString.split('/').map(Number);
      searchDate = new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD format
      searchDate = new Date(dateString);
    } else if (/^\d{4}$/.test(dateString)) {
      // Just year
      searchDate = new Date(parseInt(dateString), 0, 1);
    } else {
      // Try to parse as-is
      searchDate = new Date(dateString);
    }

    if (isNaN(searchDate.getTime())) {
      setFilteredEvents([]);
      setIsSearching(false);
      return;
    }

    const filtered = events.filter(event => {
      const eventDate = new Date(event.dateHappened);
      
      if (dateString.length === 4) {
        // Year search
        return eventDate.getFullYear() === searchDate.getFullYear();
      } else {
        // Specific date search
        return eventDate.toDateString() === searchDate.toDateString();
      }
    });

    setFilteredEvents(filtered);
    setIsSearching(false);
  };

  const handleSearch = () => {
    if (searchDate.trim()) {
      filterEventsByDate(searchDate.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Historical Event': 'bg-red-100 text-red-800',
      'Historical Figure': 'bg-blue-100 text-blue-800',
      'Archaeological Site': 'bg-yellow-100 text-yellow-800',
      'Battle': 'bg-red-100 text-red-800',
      'Monument': 'bg-purple-100 text-purple-800',
      'Cultural Site': 'bg-green-100 text-green-800',
      'Discovery': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Calendar Mode</h2>
                <p className="text-blue-100">Explore historical events by date</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Date
              </label>
              <input
                type="text"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter date (e.g., 12/25/1066, 1776, or 44 BC)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: 12/25/1066, 1776, 44 BC, 07/04/1776
              </p>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {isSearching ? 'Searching...' : 'No events found'}
              </h3>
              <p className="text-gray-500">
                {isSearching 
                  ? 'Please wait while we search...' 
                  : 'Try searching for a different date or year'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </h3>
                <div className="text-sm text-gray-500">
                  {searchDate && `for ${searchDate}`}
                </div>
              </div>
              
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onDateSelect(event.dateHappened)}
                >
                  <div className="flex items-start gap-4">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          {event.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{event.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatEventDate(event.dateHappened)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {event.coordinates[1].toFixed(2)}°, {event.coordinates[0].toFixed(2)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
