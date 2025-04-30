
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { HistoryEra } from '@/types';
import { eras } from '@/data/historyData';

interface JourneyMetadataFieldsProps {
  title: string;
  description: string;
  era: HistoryEra;
  coverImageUrl: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEraChange: (value: string) => void;
}

const JourneyMetadataFields = ({
  title,
  description,
  era,
  coverImageUrl,
  onInputChange,
  onEraChange
}: JourneyMetadataFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Journey Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Islamic History"
          value={title}
          onChange={onInputChange}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of this learning journey"
          value={description}
          onChange={onInputChange}
          className="w-full min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="era">Historical Era</Label>
          <Select
            value={era}
            onValueChange={onEraChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a historical era" />
            </SelectTrigger>
            <SelectContent>
              {eras.map(era => (
                <SelectItem key={era.code} value={era.code}>
                  {era.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="coverImageUrl">Cover Image URL</Label>
          <Input
            id="coverImageUrl"
            name="cover_image_url"
            placeholder="https://example.com/image.jpg"
            value={coverImageUrl}
            onChange={onInputChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyMetadataFields;
