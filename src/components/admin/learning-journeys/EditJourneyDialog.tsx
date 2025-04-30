
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { HistoryEra } from '@/types';

interface Journey {
  id: number;
  title: string;
  description: string | null;
  type: string;
  era: HistoryEra;
  cover_image_url: string | null;
  level_names: string[];
  modules_count: number;
}

interface EditJourneyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJourney: Journey | null;
  onJourneyChange: (journey: Journey) => void;
  onSave: () => void;
}

const EditJourneyDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedJourney, 
  onJourneyChange, 
  onSave 
}: EditJourneyDialogProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedJourney) return;
    
    const { name, value } = e.target;
    onJourneyChange({ ...selectedJourney, [name]: value });
  };
  
  if (!selectedJourney) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Learning Journey</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="edit-title">Journey Title</Label>
            <Input
              id="edit-title"
              name="title"
              value={selectedJourney.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={selectedJourney.description || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJourneyDialog;
