
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionOptionsProps {
  options: string[];
  correctAnswer: number;
  onCorrectAnswerChange: (value: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  correctAnswer,
  onCorrectAnswerChange,
  onOptionChange,
  onAddOption,
  onRemoveOption
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddOption}
          disabled={options.length >= 6}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>
      
      <RadioGroup 
        value={correctAnswer.toString()} 
        onValueChange={(value) => onCorrectAnswerChange(parseInt(value))}
        className="space-y-3"
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <div className="flex-1 flex items-center space-x-2">
              <Label htmlFor={`option-${index}`} className="min-w-10">
                {String.fromCharCode(65 + index)}.
              </Label>
              <Input
                value={option}
                onChange={(e) => onOptionChange(index, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveOption(index)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <FormDescription>
        Select the radio button next to the correct answer.
      </FormDescription>
    </div>
  );
};

export default QuestionOptions;
