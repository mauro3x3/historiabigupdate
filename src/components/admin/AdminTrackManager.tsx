
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { HistoryEra } from '@/types';
import EraManager from './lesson-track/EraManager';
import TrackLevelManager from './lesson-track/TrackLevelManager';
import TrackPreview from './lesson-track/TrackPreview';
import { useTrackManagement } from '@/hooks/useTrackManagement';
import { SaveIcon } from 'lucide-react';

interface AdminTrackManagerProps {
  currentEra: HistoryEra | null;
  onEraChange: (era: HistoryEra) => void;
}

const AdminTrackManager = ({ currentEra, onEraChange }: AdminTrackManagerProps) => {
  const {
    isLoading,
    previewTrack,
    trackLevels,
    availableEras,
    fetchAvailableEras,
    handleEraChange,
    addNewLevel,
    removeLevel,
    updateLevelName,
    handleBulkLevelsCreated,
    saveTrackConfiguration
  } = useTrackManagement(currentEra);

  const form = useForm({
    defaultValues: {
      era: currentEra || 'ancient-egypt',
    },
  });

  const onSubmit = (data: any) => {
    saveTrackConfiguration(data.era as HistoryEra);
  };

  const handleEraAdded = async () => {
    await fetchAvailableEras();
    return Promise.resolve();
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Learning Track Configuration</CardTitle>
          <EraManager onEraAdded={handleEraAdded} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select 
              value={currentEra || 'ancient-egypt'} 
              onValueChange={(value) => {
                handleEraChange(value as HistoryEra);
                onEraChange(value as HistoryEra);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select historical era" />
              </SelectTrigger>
              <SelectContent>
                {availableEras.map(era => (
                  <SelectItem key={era.code} value={era.code}>{era.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <TrackLevelManager 
                  trackLevels={trackLevels}
                  onAddLevel={addNewLevel}
                  onRemoveLevel={removeLevel}
                  onUpdateLevelName={updateLevelName}
                  onBulkLevelsCreated={handleBulkLevelsCreated}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full"
                >
                  <SaveIcon size={16} className="mr-2" />
                  {isLoading ? 'Saving...' : 'Save Track Configuration'}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      
      <TrackPreview previewTrack={previewTrack} />
    </div>
  );
};

export default AdminTrackManager;
