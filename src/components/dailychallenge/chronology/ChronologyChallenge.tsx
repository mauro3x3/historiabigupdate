
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import ShareResultsModal from '../ShareResultsModal';
import ChronologyEventCard from '../ChronologyEventCard';
import ChronologyHeader from './ChronologyHeader';
import ChronologyFooter from './ChronologyFooter';
import { useChronologyGame } from '@/hooks/useChronologyGame';
import { HistoricalEvent } from '@/types';

interface ChronologyChallengeProps {
  events: HistoricalEvent[];
  challengeId: string;
  onComplete: () => void;
}

const ChronologyChallenge = ({ events, challengeId, onComplete }: ChronologyChallengeProps) => {
  // Ensure events is always an array even if passed as null
  const safeEvents = Array.isArray(events) ? events : [];
  
  const {
    orderedEvents,
    isSubmitted,
    score,
    animateItems,
    showHint,
    shareModalOpen,
    correctOrder,
    setShowHint,
    setShareModalOpen,
    handleDragEnd,
    checkOrder
  } = useChronologyGame({ 
    events: safeEvents, 
    challengeId: challengeId || 'fallback-challenge', 
    onComplete 
  });
  
  const handleShare = () => setShareModalOpen(true);
  const toggleHint = () => setShowHint(!showHint);
  
  return (
    <Card className="mb-6 border-timelingo-purple/20 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 pb-4">
        <ChronologyHeader showHint={showHint} toggleHint={toggleHint} />
      </CardHeader>
      
      <CardContent className="pt-6 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJNNTkuOTk5IDAgTDYwIDYwIEwwIDYwIEwwIDB6IiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxwYXRoIGQ9Ik0zMCA1IEwzMCA2MCBMMjggNjAgTDI4IDUgeiBNMzIgNSBMMzIgNjAgTDMwIDYwIEwzMCA1eiBNNjAgNSBMNjAgNyBMNDIgNyBMNDIgNXoiIGZpbGw9IiNmOGY4ZmY0MCIvPjwvZz48L3N2Zz4=')] bg-opacity-5">
        {orderedEvents.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="events">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 mb-6"
                >
                  {orderedEvents.map((event, index) => (
                    <Draggable 
                      key={event.id} 
                      draggableId={event.id} 
                      index={index}
                      isDragDisabled={isSubmitted}
                    >
                      {(provided, snapshot) => (
                        <ChronologyEventCard
                          key={event.id}
                          event={event}
                          index={index}
                          correctEventId={isSubmitted && correctOrder[index] ? correctOrder[index].id : null}
                          isSubmitted={isSubmitted}
                          animate={animateItems}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <EmptyState
            icon={<Calendar className="h-10 w-10 text-gray-400" />}
            title="No events available"
            description="There are no historical events to arrange today. Please check back later."
          />
        )}
        
        <ChronologyFooter
          isSubmitted={isSubmitted}
          score={score}
          totalEvents={safeEvents.length}
          onShare={handleShare}
          onComplete={onComplete}
          onSubmit={checkOrder}
        />
      </CardContent>
      
      <ShareResultsModal 
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        score={score}
        totalEvents={safeEvents.length}
      />
    </Card>
  );
};

export default ChronologyChallenge;
