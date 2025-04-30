
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ModuleNotFound = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-red-500">
          Module not found. Please select another module.
        </p>
      </CardContent>
    </Card>
  );
};

export default ModuleNotFound;
