
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryVideo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Play } from 'lucide-react';

// Mapping for flag emojis
const FLAG_EMOJIS: Record<string, string> = {
  iberia: "🇪🇸",
  india: "🇮🇳",
  iran: "🇮🇷",
  islam: "🕌",
  middleeast: "🇸🇦",
  southasia: "🇮🇳",
  theworld: "🌏",
  westerneurope: "🇬🇧",
};

interface VideoCardProps {
  video: HistoryVideo;
}

const formatDuration = (seconds: number): string => {
  if (!seconds) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  // For videos longer than an hour
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const extractFlagEmoji = (input: string) => {
  // Try to determine emoji from thumbnail string; fallback to mapping
  // If input is emoji, show as is. Otherwise, map known name to emoji.
  if (
    typeof input === 'string' &&
    (input.match(/[\p{Emoji}]/u) || input.length <= 3)
  ) {
    // Looks like emoji or short code
    return input;
  }
  // Try to map lowercased and spaceless string to the FLAG_EMOJIS
  const key = input.replace(/\s+/g, '').toLowerCase();
  return FLAG_EMOJIS[key] || "🏳️";
};

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate(`/video/${video.id}`);
  };

  // Format the title without "History of X Every Year"
  const formatTitle = (title: string) => {
    // Just capitalize first letter if needed
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const isEmojiFlagThumb =
    typeof video.thumbnail === 'string' &&
    (video.thumbnail.match(/[\p{Emoji}]/u) || FLAG_EMOJIS[video.title.replace(/\s+/g, '').toLowerCase()]);

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleVideoClick}
    >
      <div className="relative">
        {isEmojiFlagThumb ? (
          <div className="h-40 w-full flex flex-col items-center justify-center bg-gray-50 text-6xl select-none">
            {/* Big flag emoji */}
            <span className="leading-none text-7xl">
              {extractFlagEmoji(video.thumbnail || video.title)}
            </span>
            {/* Optional label below, e.g., "Iberia" */}
            <span className="text-xs text-gray-400 mt-1 select-none">
              {video.title}
            </span>
          </div>
        ) : (
          <img
            src={video.thumbnail || `https://placehold.co/640x360?text=${video.title}`}
            alt={video.title}
            className="h-40 w-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-timelingo-purple fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
          {formatTitle(video.title)}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
        <div className="flex justify-end items-center mt-2">
          <span className="text-xs bg-timelingo-gold/20 text-timelingo-navy px-2 py-0.5 rounded-full">
            {video.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
