
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface DailyChallengeErrorProps {
  error: string | null;
  onRetry: () => void;
  onComplete: () => void;
  showErrorDialog: boolean;
  setShowErrorDialog: (show: boolean) => void;
}

const DailyChallengeError = ({ 
  error, 
  onRetry, 
  onComplete, 
  showErrorDialog, 
  setShowErrorDialog 
}: DailyChallengeErrorProps) => {
  return (
    <>
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Oops!</h2>
        <p className="mb-4">{error || "We couldn't load today's challenge."}</p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button 
            className="bg-timelingo-purple hover:bg-timelingo-purple/90"
            onClick={onRetry}
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowErrorDialog(true)}
          >
            Show Details
          </Button>
          <Button 
            variant="outline"
            onClick={onComplete}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
            <DialogDescription>
              <p className="mt-2">We're having trouble connecting to our challenge generator. This might be due to temporary service disruption.</p>
              <div className="mt-4 p-2 bg-gray-100 rounded text-sm font-mono overflow-auto max-h-40">
                {error || "Unknown error occurred while fetching today's challenge."}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyChallengeError;
