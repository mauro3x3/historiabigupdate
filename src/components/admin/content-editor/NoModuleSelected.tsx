
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NoModuleSelected = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-gray-500">
          Please select a module from the Modules tab to edit its content.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoModuleSelected;
