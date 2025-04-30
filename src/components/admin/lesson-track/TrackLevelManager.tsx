
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash } from 'lucide-react';
import BulkLevelCreator from './BulkLevelCreator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TrackLevel {
  id: string;
  name: string;
}

interface TrackLevelManagerProps {
  trackLevels: TrackLevel[];
  onAddLevel: () => void;
  onRemoveLevel: (index: number) => void;
  onUpdateLevelName: (index: number, name: string) => void;
  onBulkLevelsCreated: (levels: TrackLevel[]) => void;
}

const TrackLevelManager = ({
  trackLevels,
  onAddLevel,
  onRemoveLevel,
  onUpdateLevelName,
  onBulkLevelsCreated
}: TrackLevelManagerProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium">Track Modules</h3>
        <div className="flex gap-2">
          <BulkLevelCreator onLevelsCreated={onBulkLevelsCreated} />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onAddLevel}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add Module
          </Button>
        </div>
      </div>
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-2.5">
          {trackLevels.map((level, index) => (
            <div key={level.id} className="flex items-center gap-2 group animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
              <div className="flex-grow">
                <FormItem>
                  <FormLabel className="text-xs text-slate-600">Module {index + 1} Name</FormLabel>
                  <FormControl>
                    <Input 
                      value={level.name}
                      onChange={(e) => onUpdateLevelName(index, e.target.value)}
                      placeholder={`Module ${index + 1}`}
                      className="h-9"
                    />
                  </FormControl>
                </FormItem>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveLevel(index)}
              >
                <Trash size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrackLevelManager;
