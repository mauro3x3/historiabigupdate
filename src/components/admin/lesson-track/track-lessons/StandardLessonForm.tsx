
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface StandardLessonFormProps {
  newLessonTitle: string;
  newLessonDescription: string;
  newLessonDuration: string;
  newLessonXp: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onXpChange: (value: string) => void;
  onSubmit: () => void; // Updated to match the parameter-less pattern
  onCancel: () => void;
}

const StandardLessonForm: React.FC<StandardLessonFormProps> = ({
  newLessonTitle,
  newLessonDescription,
  newLessonDuration,
  newLessonXp,
  isSubmitting,
  onTitleChange,
  onDescriptionChange,
  onDurationChange,
  onXpChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-1">Create Side Learning Content</h3>
        <p className="text-sm text-gray-500">
          Add quizzes, challenges, and supplemental lessons to enhance the main learning journey.
        </p>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Lesson Title</label>
          <Input
            id="title"
            value={newLessonTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter lesson title"
            className="w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            id="description"
            value={newLessonDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter lesson description"
            className="w-full"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (min)</label>
            <Input
              id="duration"
              type="number"
              value={newLessonDuration}
              onChange={(e) => onDurationChange(e.target.value)}
              placeholder="5"
              min="1"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="xp" className="block text-sm font-medium mb-1">XP Reward</label>
            <Input
              id="xp"
              type="number"
              value={newLessonXp}
              onChange={(e) => onXpChange(e.target.value)}
              placeholder="50"
              min="10"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : 'Create Side Learning Lesson'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StandardLessonForm;
