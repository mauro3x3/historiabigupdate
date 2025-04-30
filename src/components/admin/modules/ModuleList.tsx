
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModuleCard from './ModuleCard';
import { AlertTriangle } from 'lucide-react';

interface ModuleListProps {
  modules: any[];
  isLoading: boolean;
  journeyName: string | null;
  chapterName: string | null;
  onDeleteModule: (id: number) => void;
  onEditModule?: (id: number) => void;
}

const ModuleList = ({ 
  modules, 
  isLoading, 
  journeyName, 
  chapterName,
  onDeleteModule,
  onEditModule
}: ModuleListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">Loading modules...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {journeyName && chapterName 
            ? `Modules for ${journeyName} → ${chapterName}`
            : 'Modules'
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            {journeyName && chapterName ? (
              <>
                <div className="flex justify-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                </div>
                <p className="text-gray-500">No modules available for this chapter.</p>
                <p className="text-sm text-gray-400">Create your first module to start building your learning journey.</p>
              </>
            ) : (
              <p className="text-gray-500">Select a journey and chapter to view modules.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onDelete={() => onDeleteModule(module.id)}
                onEdit={onEditModule ? () => onEditModule(module.id) : undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleList;
