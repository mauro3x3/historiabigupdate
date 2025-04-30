
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import QuestionForm from '../lesson-form/QuestionForm';
import { dbService } from '@/services/dbService';

interface QuestionsTabProps {
  moduleId: number;
  questions: any[];
  onQuestionsUpdated: (questions: any[]) => void;
}

const QuestionsTab = ({ moduleId, questions, onQuestionsUpdated }: QuestionsTabProps) => {
  const refreshQuestions = async () => {
    const { data } = await dbService.questions.getByModuleId(moduleId);
    if (data) {
      onQuestionsUpdated(data);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Create up to 5 quiz questions for this module. Each question should have multiple choice answers.
      </p>
      
      {questions.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No questions added yet. Create your first question below.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border border-muted">
              <div className="pt-6 px-6 pb-6">
                <p className="font-medium">Q{index + 1}: {question.question}</p>
                <div className="mt-2 space-y-1 pl-6">
                  {question.options.map((option: string, optIndex: number) => (
                    <p key={optIndex} className={optIndex === question.correct_answer ? "text-green-600 font-medium" : ""}>
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Add New Question</h3>
        <QuestionForm moduleId={moduleId} onSaved={refreshQuestions} />
      </div>
    </div>
  );
};

export default QuestionsTab;
