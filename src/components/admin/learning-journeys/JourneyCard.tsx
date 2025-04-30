
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JourneyCardProps {
  journey: {
    id: number;
    title: string;
    description: string | null;
    era: string;
    level_names: string[];
    modules_count: number;
  };
  onEdit: (journey: any) => void;
  onDelete: (id: number) => void;
}

const JourneyCard = ({ journey, onEdit, onDelete }: JourneyCardProps) => {
  const navigate = useNavigate();
  
  const handleManageModules = () => {
    navigate(`/admin?tab=modules&journey=${journey.id}`);
  };

  return (
    <Card className="h-full transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-5 pt-5">
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold">{journey.title}</h3>
            <Badge variant="outline" className="ml-2">
              {journey.era}
            </Badge>
          </div>
          
          {journey.description && (
            <p className="text-sm text-muted-foreground">{journey.description}</p>
          )}
        </div>
        
        <div className="mb-3 space-y-1">
          <h4 className="text-xs font-medium uppercase text-muted-foreground">
            Chapters
          </h4>
          
          <div className="grid gap-1.5">
            {journey.level_names.map((level, index) => (
              <div 
                key={index} 
                className="flex items-center rounded border p-1.5"
              >
                <BookOpen className="mr-1.5 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{level}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <Layers className="mr-1.5 h-4 w-4" />
            {journey.modules_count} 
            {journey.modules_count === 1 ? ' module' : ' modules'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-5 pt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onEdit(journey)}
        >
          <Edit size={16} className="mr-1.5" />
          Edit
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="flex-1"
          onClick={handleManageModules}
        >
          <Layers size={16} className="mr-1.5" />
          Modules
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex-none text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(journey.id)}
        >
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JourneyCard;
