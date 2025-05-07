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
      className="overflow-hidden border border-gray-200 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-purple-50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all duration-200 cursor-pointer group"
      onClick={handleVideoClick}
    >
      <div className="relative shadow-md rounded-t-2xl">
        {isEmojiFlagThumb ? (
          <div className="h-40 w-full flex flex-col items-center justify-center bg-gray-50 text-6xl select-none rounded-t-2xl">
            {/* Big flag emoji */}
            <span className="leading-none text-7xl drop-shadow-md">
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
            className="h-40 w-full object-cover rounded-t-2xl drop-shadow-md"
          />
        )}
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded flex items-center shadow">
          <Clock className="h-3 w-3 mr-1" />
          {formatDuration(video.duration)}
        </div>
        {/* View count badge */}
        {typeof video.views === 'number' && (
          <div className="absolute bottom-2 left-2 bg-white/80 text-gray-700 px-2 py-0.5 text-xs rounded shadow flex items-center gap-1">
            <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>
            {video.views}
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg scale-100 group-hover:scale-110 transition-transform duration-200">
            <Play className="h-8 w-8 text-timelingo-purple fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 text-timelingo-navy">
          {formatTitle(video.title)}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{video.description}</p>
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
