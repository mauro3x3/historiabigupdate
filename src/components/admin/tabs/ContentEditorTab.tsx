
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  EditorLoading,
  NoModuleSelected,
  ModuleNotFound,
  StorytellingTab,
  QuestionsTab,
  useContentEditor
} from '../content-editor';

const ContentEditorTab = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get('module');
  const { user } = useUser();
  
  // Check authentication first
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to edit content");
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const {
    isLoading,
    isSaving,
    module,
    activeTab,
    setActiveTab,
    questions,
    setQuestions,
    form,
    handleSave
  } = useContentEditor(moduleId, user?.id);
  
  // If no module is selected, show a message
  if (!moduleId) {
    return <NoModuleSelected />;
  }
  
  // If loading, show a loading spinner
  if (isLoading) {
    return <EditorLoading />;
  }
  
  // If module is not found, show an error message
  if (!module) {
    return <ModuleNotFound />;
  }
  
  // If form is not properly initialized, show an error
  if (!form || !form.control) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-red-50 text-red-800">
            <p>There was an error loading the editor. Please try refreshing the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editing: {module?.title || 'Untitled Module'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="storytelling" disabled={module?.content_type !== 'story'}>
              Storytelling Content
            </TabsTrigger>
            <TabsTrigger value="questions">
              Quiz Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="storytelling">
            <StorytellingTab 
              form={form}
              onSubmit={handleSave}
              isSaving={isSaving}
            />
          </TabsContent>
          
          <TabsContent value="questions">
            <QuestionsTab 
              moduleId={Number(moduleId)} 
              questions={questions || []}
              onQuestionsUpdated={setQuestions}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentEditorTab;
