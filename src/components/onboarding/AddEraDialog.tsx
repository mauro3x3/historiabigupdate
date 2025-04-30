
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddEraDialogProps {
  onEraAdded: (newEra: {code: string, name: string, emoji: string, time_period: string}) => void;
}

const AddEraDialog = ({ onEraAdded }: AddEraDialogProps) => {
  const [newEra, setNewEra] = useState({ name: '', emoji: '', time_period: '' });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddEra = async () => {
    if (!newEra.name || !newEra.emoji || !newEra.time_period) {
      toast.error('Please fill in all fields');
      return;
    }

    const code = newEra.name.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const { data, error } = await supabase
        .from('history_eras')
        .insert({
          code,
          name: newEra.name,
          emoji: newEra.emoji,
          time_period: newEra.time_period,
          is_enabled: true
        })
        .select();

      if (error) {
        toast.error('Error creating era: ' + error.message);
        return;
      }

      if (data && data[0]) {
        onEraAdded(data[0]);
        setNewEra({ name: '', emoji: '', time_period: '' });
        setIsOpen(false);
        toast.success(`${newEra.name} era added successfully`);
      }
    } catch (error) {
      console.error("Error adding era:", error);
      toast.error('Failed to add new era');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="era-card bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center">
          <Plus className="text-3xl text-timelingo-navy" />
          <span className="ml-2 text-timelingo-navy">Add Era</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Historical Era</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Era Name (e.g., Hindu History)" 
            value={newEra.name}
            onChange={(e) => setNewEra({...newEra, name: e.target.value})}
          />
          <Input 
            placeholder="Emoji (e.g., 🕉️)" 
            value={newEra.emoji}
            onChange={(e) => setNewEra({...newEra, emoji: e.target.value})}
          />
          <Input 
            placeholder="Time Period (e.g., 1500 BCE - Present)" 
            value={newEra.time_period}
            onChange={(e) => setNewEra({...newEra, time_period: e.target.value})}
          />
          <Button 
            onClick={handleAddEra}
            className="w-full"
            disabled={!newEra.name || !newEra.emoji || !newEra.time_period}
          >
            Add Era
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEraDialog;
