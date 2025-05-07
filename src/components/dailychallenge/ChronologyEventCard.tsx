import React from 'react';
import { MoveVertical, Check, X } from 'lucide-react';

interface ChronologyEventCardProps {
  event: {
    id: string;
    description: string;
    year: number;
    explanation: string;
  };
  index: number;
  correctEventId: string | null;
  isSubmitted: boolean;
  animate: boolean;
  provided: any;
  snapshot: any;
}

const ChronologyEventCard = ({
  event,
  index,
  correctEventId,
  isSubmitted,
  animate,
  provided,
  snapshot
}: ChronologyEventCardProps) => {
  // Ensure event properties have fallback values
  const eventId = event?.id || 'unknown';
  const description = event?.description || 'Unknown event';
  const year = event?.year || 0;
  const explanation = event?.explanation || 'No explanation available';
  
  // Safely check for snapshot being null and handle provided properly
  const isDragging = snapshot && snapshot.isDragging;
  
  // Create safe references to avoid null errors
  const refFunction = provided?.innerRef || (() => {});
  const draggableProps = provided?.draggableProps || {};
  const dragHandleProps = provided?.dragHandleProps || {};
  
  return (
    <div
      ref={refFunction}
      {...draggableProps}
      {...dragHandleProps}
      className={`p-4 border rounded-2xl flex items-center bg-gradient-to-br from-white via-purple-50 to-blue-50 shadow-sm transition-all duration-200 group
        ${isSubmitted 
          ? eventId === correctEventId
            ? 'border-green-500 bg-green-50 animate-pulse'
            : 'border-red-500 bg-red-50'
          : isDragging
            ? 'border-timelingo-purple bg-purple-100 shadow-lg scale-105 z-10'
            : 'border-gray-300 hover:border-timelingo-purple/60 hover:bg-purple-50/30'}
        ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        ...(draggableProps.style || {}),
        transitionDelay: `${index * 75}ms`,
        transitionProperty: 'all',
        transitionDuration: '0.3s',
      }}
    >
      {/* Drag handle with tooltip */}
      <div
        className={`mr-3 text-timelingo-purple flex items-center justify-center w-10 h-10 bg-white border-2 border-timelingo-purple/30 rounded-full shadow group-hover:scale-110 group-active:scale-125 transition-transform duration-150 cursor-grab ${isDragging ? 'ring-2 ring-timelingo-gold' : ''}`}
        title="Drag to reorder"
      >
        <MoveVertical className="h-5 w-5" />
      </div>
      {/* Fun icon/emoji for event */}
      <span className="text-2xl mr-3 select-none">{['📜','🏛️','🕰️','🌍','🏺','⚔️','📅'][index % 7]}</span>
      <div className="flex-1">
        <p className="font-bold text-lg text-timelingo-navy mb-1">{description}</p>
        {isSubmitted && (
          <div className="mt-2 text-sm flex items-center">
            <span className="font-bold px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full mr-2">{year}</span>
            <span className="text-gray-600">{explanation}</span>
          </div>
        )}
      </div>
      {isSubmitted && (
        <div className={`ml-3 ${eventId === correctEventId ? 'text-green-500' : 'text-red-500'}`}>
          {eventId === correctEventId ? (
            <div className="bg-green-100 rounded-full p-1 animate-bounce">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <div className="bg-red-100 rounded-full p-1 animate-shake">
              <X className="h-5 w-5" />
            </div>
          )}
        </div>
      )}
      {/* Confetti burst for correct order (optional, simple sparkle emoji) */}
      {isSubmitted && eventId === correctEventId && (
        <span className="absolute -top-2 right-2 text-yellow-400 text-xl animate-ping">✨</span>
      )}
    </div>
  );
};

export default ChronologyEventCard;
