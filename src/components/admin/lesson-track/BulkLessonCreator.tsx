
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, ListIcon } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetDescription
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HistoryEra } from '@/types';

interface BulkLessonCreatorProps {
  era: string;
  levelNumber: number;
  levelName: string;
  onLessonsAdded: () => void;
}

const BulkLessonCreator = ({ era, levelNumber, levelName, onLessonsAdded }: BulkLessonCreatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkContent, setBulkContent] = useState('');
  const [duration, setDuration] = useState('5');
  const [xpReward, setXpReward] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Process and validate bulk content
  const processedLines = bulkContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const handleSubmit = async () => {
    if (!bulkContent.trim()) {
      toast.error("Please enter some lesson titles");
      return;
    }

    setIsSubmitting(true);

    try {
      // Split text by new lines
      const lines = processedLines;

      if (lines.length === 0) {
        toast.error("No valid lesson titles found");
        setIsSubmitting(false);
        return;
      }

      const lessonEntries = lines.map((line, index) => {
        // Look for a separator (like a dash or colon) to split title from description
        let title = line;
        let description = '';
        
        if (line.includes(' – ')) {
          [title, description] = line.split(' – ');
        } else if (line.includes(' - ')) {
          [title, description] = line.split(' - ');
        } else if (line.includes(':')) {
          [title, description] = line.split(':');
        }
        
        return {
          id: Date.now() + index, // Generate a unique ID
          title: title.trim(),
          description: description.trim(),
          era: era as HistoryEra,
          xp_reward: parseInt(xpReward),
          duration: parseInt(duration),
          level: levelNumber,
          position: index + 1,
          content: description.trim() // Use description as initial content
        };
      });

      const { error } = await supabase
        .from('lessons')
        .insert(lessonEntries);

      if (error) throw error;

      toast.success(`Added ${lessonEntries.length} lessons to ${levelName}`);
      setBulkContent('');
      setIsOpen(false);
      onLessonsAdded();
    } catch (error) {
      console.error("Error creating lessons in bulk:", error);
      toast.error("Failed to create lessons");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <ListIcon className="h-4 w-4 mr-2" />
          Bulk Add Lessons
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md w-full">
        <SheetHeader className="pb-4">
          <SheetTitle>Bulk Add Lessons to {levelName}</SheetTitle>
          <SheetDescription>
            Paste multiple lesson titles and descriptions at once. 
            Each line will become a separate lesson.
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="bulkContent">Lesson Titles & Descriptions</Label>
              <span className="text-xs text-muted-foreground">
                {processedLines.length} lesson{processedLines.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Textarea
              id="bulkContent"
              placeholder="Example formats:
Ancient Egypt: An Introduction
The Pyramids - History and construction
The Sphinx – Mysteries and theories"
              rows={8}
              value={bulkContent}
              onChange={(e) => setBulkContent(e.target.value)}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use formats: "Title - Description" or "Title: Description" or "Title – Description"
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="xpReward">XP Reward</Label>
              <Input
                id="xpReward"
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                min="10"
              />
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-2">
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || processedLines.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${processedLines.length} Lesson${processedLines.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BulkLessonCreator;
