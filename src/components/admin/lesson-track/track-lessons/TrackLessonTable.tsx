
import React from 'react';
import { HistoryLesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LessonTypeLabel from './LessonTypeLabel';

interface TrackLessonTableProps {
  trackLessons: HistoryLesson[];
  onDragEnd: (result: any) => void;
  onRemoveLesson: (lessonId: string) => void;
}

const TrackLessonTable = ({ 
  trackLessons, 
  onDragEnd, 
  onRemoveLesson 
}: TrackLessonTableProps) => {
  if (!trackLessons || trackLessons.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-500">No lessons added to this level yet.</p>
        <p className="text-xs text-gray-400 mt-1">Create a lesson or add an existing one from the panel on the left.</p>
      </div>
    );
  }
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="track-lessons">
        {(provided) => (
          <div 
            className="border rounded-md overflow-hidden"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div className="bg-gray-50 border-b px-4 py-2 grid grid-cols-12 gap-2 text-xs font-medium text-gray-600">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-1 text-center">Duration</div>
              <div className="col-span-1 text-center">XP</div>
              <div className="col-span-3 text-right">Action</div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {trackLessons.map((lesson, index) => (
                <Draggable key={lesson.id} draggableId={String(lesson.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b last:border-0 hover:bg-gray-50 items-center"
                    >
                      <div className="col-span-5 font-medium truncate">
                        {lesson.title}
                      </div>
                      <div className="col-span-2">
                        <LessonTypeLabel lessonType={lesson.lesson_type || 'standard'} />
                      </div>
                      <div className="col-span-1 text-center text-gray-600">
                        {lesson.duration || 5}m
                      </div>
                      <div className="col-span-1 text-center text-gray-600">
                        {lesson.xp_reward || 50}
                      </div>
                      <div className="col-span-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onRemoveLesson(String(lesson.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TrackLessonTable;
