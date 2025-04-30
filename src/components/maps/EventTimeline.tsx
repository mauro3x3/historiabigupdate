
import React from 'react';
import { HistoryEvent } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface EventTimelineProps {
  events: HistoryEvent[];
  activeEventIndex: number;
  onEventClick: (event: HistoryEvent) => void;
}

const EventTimeline = ({ events, activeEventIndex, onEventClick }: EventTimelineProps) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-bold mb-4">Timeline</h3>
        <p className="text-gray-500 text-center py-4">No events available for this era.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-[600px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Timeline</h3>
      <ol className="relative border-l border-gray-200">
        {events.map((event, index) => (
          <li 
            key={event.id} 
            className={cn(
              "mb-6 ml-6 cursor-pointer transition-all",
              index === activeEventIndex ? "scale-105" : "",
              index < activeEventIndex ? "opacity-70" : "",
            )}
            onClick={() => onEventClick(event)}
          >
            <span 
              className={cn(
                "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white",
                index <= activeEventIndex 
                  ? "bg-timelingo-purple text-white" 
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {index <= activeEventIndex ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </span>
            <div 
              className={cn(
                "p-3 rounded-lg border shadow-sm hover:shadow-md transition-all",
                index === activeEventIndex 
                  ? "border-timelingo-purple bg-purple-50" 
                  : "border-gray-200 bg-white"
              )}
            >
              <time className="block mb-1 text-xs font-normal text-gray-500">
                {event.year}
              </time>
              <h4 className="text-sm font-semibold text-gray-900">
                {event.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default EventTimeline;
