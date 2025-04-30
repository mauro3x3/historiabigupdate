
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUp, BookPlus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface BulkLevelCreatorProps {
  onLevelsCreated: (levels: Array<{ id: string; name: string }>) => void;
}

const BulkLevelCreator = ({ onLevelsCreated }: BulkLevelCreatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [levelsText, setLevelsText] = useState('');

  const handleSubmit = () => {
    if (!levelsText.trim()) {
      toast.error("Please enter level names");
      return;
    }

    const levelNames = levelsText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim());

    if (levelNames.length === 0) {
      toast.error("No valid level names found");
      return;
    }

    // Create level objects with IDs
    const newLevels = levelNames.map((name, index) => ({
      id: String(index + 1),
      name
    }));

    onLevelsCreated(newLevels);
    setIsOpen(false);
    setLevelsText('');
    toast.success(`${newLevels.length} levels created successfully`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileUp size={16} />
          Bulk Add Levels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Create Learning Track Levels</DialogTitle>
        </DialogHeader>
        
        {!levelsText.trim() ? (
          <EmptyState
            icon={<BookPlus className="h-8 w-8" />}
            title="Create Multiple Levels at Once"
            description="Paste a list of level names, with one level per line."
          />
        ) : null}

        <div className="space-y-4">
          {levelsText.trim() ? (
            <div className="text-sm text-muted-foreground">
              <p>Enter one level name per line.</p>
              <p className="mt-1">For example:</p>
              <pre className="p-2 bg-secondary/50 rounded text-xs mt-1">
                Beginner Level{'\n'}
                Intermediate Level{'\n'}
                Advanced Level{'\n'}
                Expert Level
              </pre>
            </div>
          ) : null}
          <Textarea
            placeholder="Enter level names, one per line..."
            value={levelsText}
            onChange={(e) => setLevelsText(e.target.value)}
            className={`${!levelsText.trim() ? "min-h-[120px]" : "min-h-[200px]"}`}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Levels
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkLevelCreator;
