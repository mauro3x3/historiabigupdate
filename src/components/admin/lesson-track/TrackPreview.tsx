
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrackPreviewProps {
  previewTrack: any | null;
}

const TrackPreview = ({ previewTrack }: TrackPreviewProps) => {
  if (!previewTrack) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {previewTrack.levels.map((level: any, index: number) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">{level.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{level.description}</p>
              
              <div className="text-sm">
                <strong>Lessons:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {level.lessons.map((lesson: any, idx: number) => (
                    <li key={idx}>{lesson.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackPreview;
