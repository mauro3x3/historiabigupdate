
import React from 'react';
import { HistoryLesson } from '@/types';
import { Button } from '@/components/ui/button';
import XpBadge from '../XpBadge';

interface LessonCardProps {
  lesson: HistoryLesson;
  onStart: (lessonId: string) => void;
}

const LessonCard = ({ lesson, onStart }: LessonCardProps) => {
  return (
    <div className="timelingo-card flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-timelingo-navy">{lesson.title}</h3>
          <XpBadge xp={lesson.xp_reward} />
        </div>
        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
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
        className={`mt-4 ${lesson.progress?.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-timelingo-purple hover:bg-purple-700'} transition-colors`}
        onClick={() => onStart(lesson.id)}
      >
        {lesson.progress?.completed ? 'Review Lesson' : 'Start Lesson'}
      </Button>
    </div>
  );
};

export default LessonCard;
