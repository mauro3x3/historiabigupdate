
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    description: string;
    content_type: 'story' | 'quiz' | 'video' | 'game';
    position: number;
    is_journey_module: boolean;
  };
  onDelete: () => void;
  onEdit?: () => void;
}

const ModuleCard = ({ module, onDelete, onEdit }: ModuleCardProps) => {
  // Define colors for different content types
  const typeColors = {
    story: 'bg-blue-100 text-blue-800',
    quiz: 'bg-purple-100 text-purple-800',
    video: 'bg-red-100 text-red-800',
    game: 'bg-green-100 text-green-800'
  };
  
  const contentTypeDisplay = {
    story: 'Story',
    quiz: 'Quiz',
    video: 'Video',
    game: 'Game'
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{module.title}</h3>
              <Badge variant="outline" className={typeColors[module.content_type]}>
                {contentTypeDisplay[module.content_type]}
              </Badge>
              {module.is_journey_module && (
                <Badge className="bg-timelingo-purple text-white">Main Journey</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{module.description || 'No description'}</p>
            <div className="text-xs text-gray-400 mt-1">Position: {module.position}</div>
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2"
                onClick={onEdit}
              >
                <FilePenLine className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
