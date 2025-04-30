
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, BookOpen, Video, GamepadIcon, PencilIcon } from 'lucide-react';
import { HistoryLesson } from '@/types';

interface Level {
  id?: string;
  level: number;
  title?: string;
  lessons: HistoryLesson[];
  isUnlocked?: boolean;
}

interface LevelProgressProps {
  level: Level;
  title: string;
  lessons: HistoryLesson[];
  isUnlocked: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  title,
  lessons,
  isUnlocked = true
}) => {
  const navigate = useNavigate();

  const handleNavigateToLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  const getContentTypeIcon = (lesson: HistoryLesson) => {
    const contentType = lesson.content_type || lesson.lesson_type || 'standard';
    
    switch (contentType) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'game':
        return <GamepadIcon className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <PencilIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-purple-500" />;
    }
  };

  const completedLessons = lessons.filter(lesson => lesson.progress?.completed).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {title}
          {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-50">
            {completedLessons}/{lessons.length} Complete
          </Badge>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-4" />
      
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className={`border hover:border-gray-300 transition-colors ${
              lesson.progress?.completed ? 'bg-gray-50' : ''
            }`}
          >
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(lesson)}
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  {lesson.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                  )}
                </div>
              </div>
              
              <Button 
                variant={lesson.progress?.completed ? "outline" : "default"} 
                size="sm"
                onClick={() => handleNavigateToLesson(lesson.id)}
                disabled={!isUnlocked}
              >
                {lesson.progress?.completed ? 'Review' : 'Start'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LevelProgress;
