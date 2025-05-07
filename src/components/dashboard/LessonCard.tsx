import React from 'react';
import { HistoryLesson } from '@/types';
import { Button } from '@/components/ui/button';
import XpBadge from '../XpBadge';

interface LessonCardProps {
  lesson: HistoryLesson;
  onStart: (lessonId: string) => void;
}

const LessonCard = ({ lesson, onStart }: LessonCardProps) => {
  // Determine lesson type icon
  let typeIcon = '📚';
  if ('type' in lesson && lesson.type === 'quiz') typeIcon = '📝';
  else if ('type' in lesson && lesson.type === 'story') typeIcon = '📖';
  // Optionally, show a 'New' badge if lesson.new === true
  const isNew = 'new' in lesson && lesson.new;
  return (
    <div className="border-l-4 border-timelingo-purple border border-gray-200 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] hover:bg-white transition-all duration-200 flex flex-col justify-between group p-5 relative" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #f3e8ff 8%, transparent 80%)' }}>
      {/* New badge */}
      {isNew && (
        <span className="absolute top-3 right-3 bg-green-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">New</span>
      )}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">{typeIcon}</span>
            <h3 className="font-bold text-lg text-timelingo-navy line-clamp-1">{lesson.title}</h3>
          </div>
          <XpBadge xp={lesson.xp_reward} />
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span>⏱️</span> {lesson.duration} min
          </span>
          
          {lesson.progress && lesson.progress.completed && (
            <span className="ml-auto flex items-center">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-sm ${i < lesson.progress!.stars ? 'text-timelingo-gold' : 'text-gray-300'}`}>★</span>
              ))}
            </span>
          )}
        </div>
      </div>
      <Button 
        className={`mt-4 w-full py-2 rounded-lg font-semibold text-base shadow-md transition-colors ${lesson.progress?.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-timelingo-purple hover:bg-purple-700'}`}
        onClick={() => onStart(lesson.id)}
      >
        {lesson.progress?.completed ? 'Review Lesson' : 'Start Lesson'}
      </Button>
    </div>
  );
};

export default LessonCard;
