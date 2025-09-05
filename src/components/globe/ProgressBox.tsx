import React from 'react';

interface Module {
  id: string;
  title: string;
  journey_id: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  summary?: string;
}

interface Journey {
  id: string;
  title: string;
  modules: Module[];
}

interface ProgressBoxProps {
  journeys: Journey[];
}

export default function ProgressBox({ journeys }: ProgressBoxProps) {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 pointer-events-none">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
      
      <div className="space-y-4">
        {journeys.map(journey => {
          const completedCount = journey.modules.filter(m => m.completed).length;
          const totalCount = journey.modules.length;
          const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
          
          return (
            <div key={journey.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{journey.title}</span>
                <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {percentage.toFixed(0)}% Complete
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 