
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopupHeaderProps {
  title: string;
  onClose: () => void;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-timelingo-navy">{title}</h3>
      <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PopupHeader;
