
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EraManagerProps {
  onEraAdded: () => Promise<void>;
}

const EraManager = ({ onEraAdded }: EraManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddEraDialogOpen, setIsAddEraDialogOpen] = useState(false);
  const [newEra, setNewEra] = useState({ name: '', emoji: '', time_period: '' });

  const handleAddEra = async () => {
    if (!newEra.name || !newEra.emoji || !newEra.time_period) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
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
        setNewEra({ name: '', emoji: '', time_period: '' });
        setIsAddEraDialogOpen(false);
        toast.success(`${newEra.name} era added successfully`);
        
        // Call the parent's callback to refresh eras
        await onEraAdded();
      }
    } catch (error) {
      console.error("Error adding era:", error);
      toast.error('Failed to add new era');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddEraDialogOpen} onOpenChange={setIsAddEraDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus size={16} />
          Add New Era
        </Button>
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
            disabled={isLoading || !newEra.name || !newEra.emoji || !newEra.time_period}
          >
            {isLoading ? 'Adding...' : 'Add Era'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EraManager;
