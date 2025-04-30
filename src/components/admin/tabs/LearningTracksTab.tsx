
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryEra } from '@/types';
import { AdminLessonTrackAssociation } from '@/components/admin/lesson-track';
import AdminTrackManager from '@/components/admin/AdminTrackManager';
import { SaveIcon } from 'lucide-react';

interface LearningTracksTabProps {
  currentEra: HistoryEra;
  onEraChange: (era: HistoryEra) => void;
}

const LearningTracksTab = ({ currentEra, onEraChange }: LearningTracksTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdminTrackManager 
            currentEra={currentEra}
            onEraChange={onEraChange}
          />
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Configure Learning Journey: {currentEra}</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminLessonTrackAssociation era={currentEra} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningTracksTab;
