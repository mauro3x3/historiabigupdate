import React, { useState, useEffect } from 'react';
import ImageUploader from '../maps/event/ImageUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HistoryEra } from '@/types';
import ReactMarkdown from 'react-markdown';

// Types for our structured journey data
interface Module {
  id?: string;
  title: string;
  summary: string;
  quiz: QuizQuestion[];
  imageUrl: string;
  lessonText?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface JourneyData {
  title: string;
  description: string;
  era: HistoryEra;
  coverImageUrl: string;
  modules: Module[];
}

const JourneyEditor = ({ initialJourney, onSave, onDownload }) => {
  // Use initialJourney as an object directly
  const [journeyData, setJourneyData] = useState<JourneyData>(() => ({
    title: initialJourney?.title || '',
    description: initialJourney?.description || '',
    era: 'rome-greece' as HistoryEra,
    coverImageUrl: '',
    modules: initialJourney?.modules?.map((m, i) => ({ ...m, id: m.id || `module-${i + 1}` })) || []
  }));

  // Update state if initialJourney changes
  useEffect(() => {
    setJourneyData({
      title: initialJourney?.title || '',
      description: initialJourney?.description || '',
      era: 'rome-greece' as HistoryEra,
      coverImageUrl: '',
      modules: initialJourney?.modules?.map((m, i) => ({ ...m, id: m.id || `module-${i + 1}` })) || []
    });
  }, [initialJourney]);

  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageError, setCoverImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  // Mock HistoryEvent for cover image upload
  const coverEvent = {
    id: 'ai-whale-journey',
    title: 'Journey Cover',
    year: '',
    location: '',
    latitude: 0,
    longitude: 0,
    description: '',
    significance: '',
  };

  const handleModuleChange = (moduleId: string, field: keyof Module, value: any) => {
    setJourneyData(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleQuizChange = (moduleId: string, questionIndex: number, field: keyof QuizQuestion, value: any) => {
    setJourneyData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id !== moduleId) return module;
        const updatedQuiz = [...module.quiz];
        updatedQuiz[questionIndex] = { ...updatedQuiz[questionIndex], [field]: value };
        return { ...module, quiz: updatedQuiz };
      })
    }));
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      // Save journey to learning_tracks
      const { data: journeyInsert, error: journeyError } = await supabase
        .from('learning_tracks')
        .insert([{
          level_one_name: journeyData.title,
          level_two_name: 'Intermediate',
          level_three_name: journeyData.description,
          era: journeyData.era,
          cover_image_url: coverImageUrl,
          levels: JSON.stringify([
            { id: '1', name: journeyData.title },
            { id: '2', name: 'Intermediate' },
            { id: '3', name: 'Advanced' }
          ]),
          updated_at: new Date().toISOString(),
        }])
        .select();
      if (journeyError) throw journeyError;
      const journeyId = journeyInsert[0].id;
      // Save modules
      for (const module of journeyData.modules) {
        const { error: moduleError } = await supabase
          .from('modules')
          .insert([{
            title: module.title,
            description: module.summary,
            content: JSON.stringify(module.quiz),
            image_urls: module.imageUrl,
            journey_id: journeyId,
            position: journeyData.modules.indexOf(module),
            created_at: new Date().toISOString(),
          }]);
        if (moduleError) throw moduleError;
      }
      toast.success('Learning journey saved successfully!');
      onSave(journeyData);
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save learning journey');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(journeyData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${journeyData.title.replace(/\s+/g, '-').toLowerCase()}-journey.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Learning Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Journey Title</label>
                  <Input
                    value={journeyData.title}
                    onChange={e => setJourneyData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter journey title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={journeyData.description}
                    onChange={e => setJourneyData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter journey description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image</label>
                  <ImageUploader
                    event={coverEvent}
                    imageUrl={coverImageUrl}
                    setImageUrl={setCoverImageUrl}
                    setImageError={setCoverImageError}
                    onImageClick={() => {}}
                    isAdmin={true}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="modules">
              <div className="space-y-6">
                {journeyData.modules.map((module, index) => (
                  <Card key={module.id || index} className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Module {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          value={module.title}
                          onChange={e => handleModuleChange(module.id || `module-${index + 1}`, 'title', e.target.value)}
                          placeholder="Enter module title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lesson Text (skimmable, key terms bolded)</label>
                        <Textarea
                          value={module.lessonText || ''}
                          onChange={e => handleModuleChange(module.id || `module-${index + 1}`, 'lessonText', e.target.value)}
                          placeholder="Enter lesson text (key terms in **bold** Markdown)"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Summary</label>
                        <Textarea
                          value={module.summary}
                          onChange={e => handleModuleChange(module.id || `module-${index + 1}`, 'summary', e.target.value)}
                          placeholder="Enter module summary"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Module Image</label>
                        <ImageUploader
                          event={{
                            ...coverEvent,
                            id: `module-${module.id || index + 1}`,
                            title: module.title
                          }}
                          imageUrl={module.imageUrl}
                          setImageUrl={url => handleModuleChange(module.id || `module-${index + 1}`, 'imageUrl', url)}
                          setImageError={() => {}}
                          onImageClick={() => {}}
                          isAdmin={true}
                        />
                      </div>
                      <div>
                        <h4 className="text-md font-medium mb-2">Quiz Questions</h4>
                        {module.quiz.map((question, qIndex) => (
                          <div key={qIndex} className="mb-4 p-3 border rounded">
                            <div className="mb-2">
                              <label className="block text-sm font-medium mb-1">Question</label>
                              <Input
                                value={question.question}
                                onChange={e => handleQuizChange(module.id || `module-${index + 1}`, qIndex, 'question', e.target.value)}
                                placeholder="Enter question"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium mb-1">Options</label>
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center mb-1">
                                  <span className="mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                                  <Input
                                    value={option}
                                    onChange={e => {
                                      const newOptions = [...question.options];
                                      newOptions[oIndex] = e.target.value;
                                      handleQuizChange(module.id || `module-${index + 1}`, qIndex, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium mb-1">Correct Answer</label>
                              <select
                                value={question.correctAnswer}
                                onChange={e => handleQuizChange(module.id || `module-${index + 1}`, qIndex, 'correctAnswer', Number(e.target.value))}
                                className="w-full p-2 border rounded"
                              >
                                {question.options.map((_, oIndex) => (
                                  <option key={oIndex} value={oIndex}>
                                    {String.fromCharCode(65 + oIndex)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Explanation</label>
                              <Textarea
                                value={question.explanation}
                                onChange={e => handleQuizChange(module.id || `module-${index + 1}`, qIndex, 'explanation', e.target.value)}
                                placeholder="Enter explanation"
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{journeyData.title}</h3>
                <p className="text-gray-600">{journeyData.description}</p>
                {coverImageUrl && (
                  <div className="my-4">
                    <img src={coverImageUrl} alt="Cover" className="w-full h-48 object-cover rounded" />
                  </div>
                )}
                <div className="space-y-6">
                  {journeyData.modules.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-4">
                      <h4 className="text-lg font-semibold">Module {index + 1}: {module.title}</h4>
                      {/* Render lessonText as Markdown with bold highlighting */}
                      {module.lessonText && (
                        <div className="my-2 text-base">
                          <ReactMarkdown>{module.lessonText}</ReactMarkdown>
                        </div>
                      )}
                      {/* Fallback to summary if lessonText is missing */}
                      {!module.lessonText && (
                        <p className="text-gray-600 my-2">{module.summary}</p>
                      )}
                      {module.imageUrl && (
                        <div className="my-2">
                          <img src={module.imageUrl} alt={module.title} className="w-full h-32 object-cover rounded" />
                        </div>
                      )}
                      <div className="mt-4">
                        <h5 className="font-medium">Quiz</h5>
                        {module.quiz.map((question, qIndex) => (
                          <div key={qIndex} className="mt-2 p-3 bg-gray-50 rounded">
                            <p className="font-medium">{question.question}</p>
                            <ul className="mt-2 space-y-1">
                              {question.options.map((option, oIndex) => (
                                <li key={oIndex} className="flex items-center">
                                  <span className="mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                                  <span>{option}</span>
                                  {oIndex === question.correctAnswer && (
                                    <span className="ml-2 text-green-600">✓</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-sm text-gray-600">{question.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isSaving}
            >
              Download as JSON
            </Button>
            <Button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save to Database'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyEditor; 