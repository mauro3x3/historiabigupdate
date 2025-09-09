import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, MapPin, Clock, User, Volume2, VolumeX } from 'lucide-react';
import SpeechService from './SpeechService';

interface PlayTodaySlideshowProps {
  isOpen: boolean;
  onClose: () => void;
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
  onNavigateToEvent: (coordinates: [number, number], event: any) => void;
}

export default function PlayTodaySlideshow({ 
  isOpen, 
  onClose, 
  events, 
  onNavigateToEvent 
}: PlayTodaySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechService = useRef(SpeechService.getInstance());

  const currentEvent = events[currentIndex];
  const totalEvents = events.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(false);
      setProgress(0);
      setIsSpeaking(false);
      
      // Load voices when slideshow opens
      speechService.current.loadVoices().then(() => {
        setVoicesLoaded(true);
      });
    }
  }, [isOpen]);

  // Enhanced speech functions using SpeechService
  const speakEvent = async (event: any) => {
    if (!speechEnabled) return;

    try {
      const speechText = await speechService.current.generateSpeech(event);
      speechService.current.speakText(
        speechText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    } catch (error) {
      console.error('Speech generation error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    speechService.current.stopSpeech();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (isPlaying && currentEvent) {
      // Navigate to the event on the globe
      onNavigateToEvent(currentEvent.coordinates, currentEvent);
      
      // Start speaking the event content
      if (speechEnabled) {
        speakEvent(currentEvent);
      }
      
      // Start progress animation
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2; // 2% every 100ms = 5 seconds total
        });
      }, 100);

      // Auto-advance after 5 seconds
      intervalRef.current = setTimeout(() => {
        nextEvent();
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // Stop speech when not playing
      stopSpeech();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      stopSpeech();
    };
  }, [isPlaying, currentIndex, currentEvent, onNavigateToEvent, speechEnabled]);

  const nextEvent = () => {
    if (currentIndex < totalEvents - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of slideshow
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const prevEvent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // Pausing - stop speech
      stopSpeech();
    } else {
      // Playing - start speech for current event
      if (speechEnabled && currentEvent) {
        speakEvent(currentEvent);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setProgress(0);
    stopSpeech();
    onClose();
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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || totalEvents === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Historical Journey</h2>
                <p className="text-blue-100">
                  {totalEvents} event{totalEvents !== 1 ? 's' : ''} • {currentIndex + 1} of {totalEvents}
                  {speechEnabled && (
                    <span className="ml-2 flex items-center gap-1">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">Audio enabled</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-100 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Event Content */}
        <div className="p-6">
          {currentEvent && (
            <div className="space-y-6">
              {/* Event Image */}
              {currentEvent.imageUrl && (
                <div className="relative">
                  <img
                    src={currentEvent.imageUrl}
                    alt={currentEvent.title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentEvent.category)}`}>
                      {currentEvent.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentEvent.title}
                  </h3>
                  {isSpeaking && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                      <span className="text-sm font-medium">Speaking</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {currentEvent.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{currentEvent.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatEventDate(currentEvent.dateHappened)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {currentEvent.coordinates[1].toFixed(2)}°, {currentEvent.coordinates[0].toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevEvent}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              
              <button
                onClick={nextEvent}
                disabled={currentIndex === totalEvents - 1}
                className="p-2 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                disabled={!voicesLoaded}
                className={`p-2 rounded-full transition-colors ${
                  speechEnabled 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } ${!voicesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={
                  !voicesLoaded 
                    ? 'Loading voices...' 
                    : speechEnabled 
                      ? 'Disable speech' 
                      : 'Enable speech'
                }
              >
                {!voicesLoaded ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                ) : speechEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              
              <div className="text-sm text-gray-500">
                {isPlaying ? (isSpeaking ? 'Speaking...' : 'Playing...') : 'Paused'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
