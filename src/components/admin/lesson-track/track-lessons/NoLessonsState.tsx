
import React from 'react';
import { Card } from '@/components/ui/card';
import { Book } from 'lucide-react';

const NoLessonsState = ({ levelName }: { levelName: string }) => {
  return (
    <Card className="p-4 bg-slate-50 border border-slate-200 rounded-md">
      <div className="flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
          <Book className="h-6 w-6 text-slate-500" />
        </div>
        <h4 className="text-lg font-medium text-slate-700">No lessons assigned</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Add lessons from the available list or create new ones using the options below.
        </p>
      </div>
    </Card>
  );
};

export default NoLessonsState;
