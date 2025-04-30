import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Trash2, Plus, Check, Book, Pencil } from 'lucide-react';
import { dbService } from '@/services/dbService';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  module_id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface Module {
  id: number;
  title: string;
  journey_name?: string;
}

const QuestionsTab = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    module_id: ''
  });
  
  useEffect(() => {
    fetchModules();
  }, []);
  
  useEffect(() => {
    if (selectedModule) {
      fetchQuestions(selectedModule);
    }
  }, [selectedModule]);
  
  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const { data: modulesData, error: modulesError } = await dbService.modules.getAll();
      
      if (modulesError) throw modulesError;
      
      // Get journey names for each module
      if (modulesData && modulesData.length > 0) {
        const modulePromises = modulesData.map(async (module) => {
          const { data: journeyData, error: journeyError } = await supabase
            .from('learning_tracks')
            .select('level_one_name')
            .eq('id', module.journey_id)
            .single();
          
          return {
            ...module,
            journey_name: journeyError ? 'Unknown Journey' : journeyData.level_one_name
          };
        });
        
        const modulesWithJourneys = await Promise.all(modulePromises);
        setModules(modulesWithJourneys);
        
        // Auto-select first module
        if (!selectedModule && modulesWithJourneys.length > 0) {
          setSelectedModule(modulesWithJourneys[0].id);
          setNewQuestion(prev => ({ ...prev, module_id: modulesWithJourneys[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQuestions = async (moduleId: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await dbService.questions.getByModuleId(moduleId);
      
      if (error) throw error;

      // Convert from JSONB to string[] if needed
      const formattedQuestions = data?.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as unknown as string)
      })) || [];
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
  };
  
  const handleAddOption = () => {
    if (newQuestion.options.length < 6) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };
  
  const handleRemoveOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      const newOptions = [...newQuestion.options];
      newOptions.splice(index, 1);
      
      // Adjust correct answer index if needed
      let newCorrectAnswer = newQuestion.correct_answer;
      if (newCorrectAnswer === index) {
        newCorrectAnswer = 0;
      } else if (newCorrectAnswer > index) {
        newCorrectAnswer = newCorrectAnswer - 1;
      }
      
      setNewQuestion(prev => ({
        ...prev,
        options: newOptions,
        correct_answer: newCorrectAnswer
      }));
    } else {
      toast.error('Questions must have at least 2 options');
    }
  };
  
  const handleSubmit = async () => {
    if (!newQuestion.question || !newQuestion.module_id) {
      toast.error('Question text and module are required');
      return;
    }
    
    // Ensure we have at least 2 valid options
    const validOptions = newQuestion.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 valid options');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await dbService.questions.create({
        module_id: parseInt(newQuestion.module_id),
        question: newQuestion.question,
        options: newQuestion.options,
        correct_answer: newQuestion.correct_answer,
        explanation: newQuestion.explanation || null
      });
      
      if (error) throw error;
      
      toast.success('Question created successfully');
      
      // Refresh questions
      if (selectedModule) {
        fetchQuestions(selectedModule);
      }
      
      // Reset form
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
        module_id: newQuestion.module_id
      });
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const { error } = await dbService.questions.delete(id);
      
      if (error) throw error;
      
      toast.success('Question deleted successfully');
      
      // Remove from local state
      setQuestions(questions.filter(question => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };
  
  const getModuleNameById = (id: number) => {
    const module = modules.find(m => m.id === id);
    return module ? module.title : 'Unknown Module';
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
        <Select
          value={selectedModule?.toString() || ''}
          onValueChange={(value) => {
            setSelectedModule(parseInt(value));
            setNewQuestion(prev => ({ ...prev, module_id: value }));
          }}
        >
          <SelectTrigger className="w-full md:w-80">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map(module => (
              <SelectItem key={module.id} value={module.id.toString()}>
                {module.title} {module.journey_name ? `(${module.journey_name})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
            <CardDescription>
              Create a quiz question for the selected module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="module_id">Module</Label>
                <Select
                  value={newQuestion.module_id}
                  onValueChange={(value) => setNewQuestion(prev => ({ ...prev, module_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map(module => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  name="question"
                  placeholder="Enter your question here"
                  value={newQuestion.question}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddOption}
                    disabled={newQuestion.options.length >= 6}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                <RadioGroup 
                  value={newQuestion.correct_answer.toString()} 
                  onValueChange={(value) => setNewQuestion(prev => ({ ...prev, correct_answer: parseInt(value) }))}
                >
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                      {newQuestion.options.length > 2 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveOption(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-gray-500">
                  Select the radio button next to the correct answer
                </p>
              </div>
              
              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  name="explanation"
                  placeholder="Explain why the correct answer is right"
                  value={newQuestion.explanation}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="w-full mt-2"
              >
                {isLoading ? 'Creating...' : 'Create Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions for {selectedModule ? getModuleNameById(selectedModule) : 'Selected Module'}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                  <p className="mt-2 text-gray-500">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-gray-500">No questions found. Add your first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <Card key={question.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold flex items-center gap-2">
                              <Pencil className="h-4 w-4 text-blue-500" />
                              {question.question}
                            </h3>
                            
                            <div className="mt-3 space-y-1">
                              {question.options.map((option, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                    question.correct_answer === index ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {question.correct_answer === index ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <span className="text-xs">{index + 1}</span>
                                    )}
                                  </div>
                                  <span className={question.correct_answer === index ? 'font-medium text-green-700' : ''}>
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {question.explanation && (
                              <div className="mt-3 text-sm text-gray-600 border-t pt-2">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="h-8 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionsTab;
