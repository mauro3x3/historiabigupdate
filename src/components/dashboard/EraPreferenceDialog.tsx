
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EraSelector from "@/components/onboarding/EraSelector";
import { HistoryEra } from "@/types";

interface EraPreferenceDialogProps {
  showEraSelector: boolean;
  setShowEraSelector: (show: boolean) => void;
  preferredEra: HistoryEra | null;
  setPreferredEra: (era: HistoryEra | null) => void;
  completedEras: string[];
}

const EraPreferenceDialog: React.FC<EraPreferenceDialogProps> = ({
  showEraSelector,
  setShowEraSelector,
  preferredEra,
  setPreferredEra,
  completedEras,
}) => {
  return (
    <Dialog open={showEraSelector} onOpenChange={setShowEraSelector}>
      <DialogContent className="bg-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Your Preferred Era</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EraSelector 
            selectedEra={preferredEra} 
            onSelect={(era) => {
              setPreferredEra(era);
              setShowEraSelector(false);
            }}
            completedEras={completedEras}
            showCompletedBadges={true}
            preferredEra={preferredEra}
            isPreferenceSelector={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EraPreferenceDialog;
