
import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useQuestionForm } from './useQuestionForm';
import QuestionOptions from './QuestionOptions';
import QuestionFormFields from './QuestionFormFields';
import QuestionFormSubmit from './QuestionFormSubmit';

interface QuestionFormProps {
  moduleId: number;
  onSaved: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ moduleId, onSaved }) => {
  const {
    form,
    isSubmitting,
    options,
    correctAnswer,
    setCorrectAnswer,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSubmit
  } = useQuestionForm(moduleId, onSaved);
  
  return (
    <Card className="border border-muted">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <QuestionFormFields form={form} />
            
            <QuestionOptions 
              options={options}
              correctAnswer={correctAnswer}
              onCorrectAnswerChange={setCorrectAnswer}
              onOptionChange={handleOptionChange}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
            />
            
            <QuestionFormSubmit isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
