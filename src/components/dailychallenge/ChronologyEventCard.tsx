
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
      className={`p-4 border rounded-lg flex items-center ${
        isSubmitted 
          ? eventId === correctEventId
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50'
          : isDragging
            ? 'border-timelingo-purple bg-purple-50 shadow-md'
            : 'border-gray-300 hover:border-timelingo-purple/60 hover:bg-purple-50/30'
      } transition-all ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        ...(draggableProps.style || {}),
        transitionDelay: `${index * 75}ms`,
        transitionProperty: 'all',
        transitionDuration: '0.3s',
      }}
    >
      <div className="mr-3 text-gray-400 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
        <MoveVertical className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{description}</p>
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
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <div className="bg-red-100 rounded-full p-1">
              <X className="h-5 w-5" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChronologyEventCard;
