
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChronologyHintAlertProps {
  showHint: boolean;
}

const ChronologyHintAlert = ({ showHint }: ChronologyHintAlertProps) => {
  if (!showHint) return null;
  return (
    <Alert className="mt-3 bg-blue-50 border-blue-200 animate-fade-in">
      <AlertDescription className="text-sm">
        <span className="font-medium">Hint:</span> Look for contextual clues in each event's description. For example, technological advancements typically happened later, while foundational historical events occurred earlier.
      </AlertDescription>
    </Alert>
  );
};

export default ChronologyHintAlert;
