
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { dbService } from '@/services/dbService';
import { toast } from 'sonner';
import { CustomDatabase } from '@/types/supabase';
import { lessons } from '@/data/historyData';

export const useContentEditor = (moduleId: string | null, userId: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [module, setModule] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('storytelling');
  const [questions, setQuestions] = useState<any[]>([]);
  
  const form = useForm({
    defaultValues: {
      story_content: '[Insert cinematic story text here – 300–500 words]',
      transition_question: 'Are you ready for the test?',
      image_urls: '',
      custom_image_url: '',
      title: '[Insert title here]',
    }
  });
  
  useEffect(() => {
    const fetchModuleData = async () => {
      if (!moduleId || !userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch the module
        const { data: moduleData, error: moduleError } = await dbService.modules.getById(Number(moduleId));
        
        if (moduleError) throw moduleError;
        
        if (!moduleData) {
          throw new Error("Module not found");
        }
        
        setModule(moduleData);
        
        // Fetch module content if available
        const { data: contentData, error: contentError } = await dbService.moduleContent.getByModuleId(Number(moduleId));
        
        if (contentError) throw contentError;
        
        // Fetch questions for this module
        const { data: questionsData, error: questionsError } = await dbService.questions.getByModuleId(Number(moduleId));
        
        if (questionsError) throw questionsError;
        
        setQuestions(questionsData || []);
        
        // Set form values based on existing content
        if (contentData) {
          // We need to use type assertions here to help TypeScript understand that these properties exist
          const content = contentData as Partial<CustomDatabase['module_content']>;
          
          const imageUrlsString = Array.isArray(content.image_urls) 
            ? content.image_urls.join('\n') 
            : '';
          
          form.reset({
            story_content: content.story_text || '[Insert cinematic story text here – 300–500 words]',
            transition_question: content.transition_question || 'Are you ready for the test?',
            image_urls: imageUrlsString,
            custom_image_url: '',
            title: moduleData?.title || '[Insert title here]',
          });
        } else {
          // Initialize with template values if no content exists
          form.reset({
            story_content: '[Insert cinematic story text here – 300–500 words]',
            transition_question: 'Are you ready for the test?',
            image_urls: '',
            custom_image_url: '',
            title: moduleData?.title || '[Insert title here]',
          });
        }
        
        // Set the appropriate tab based on module content type
        setActiveTab(moduleData?.content_type === 'story' ? 'storytelling' : 'questions');
      } catch (error) {
        console.error('Error fetching module data:', error);
        toast.error('Failed to load module data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModuleData();
  }, [moduleId, form, userId]);
  
  const handleSave = async (formData: any) => {
    if (!moduleId || !module || !userId) {
      toast.error('No module selected or not authenticated');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Prepare content data based on module type
      const contentData: any = {
        module_id: Number(moduleId),
        transition_question: formData.transition_question || 'Are you ready for the test?',
      };
      
      if (module.content_type === 'story') {
        contentData.story_text = formData.story_content;
        contentData.image_urls = formData.image_urls
          ? formData.image_urls.split('\n').filter((url: string) => url.trim() !== '')
          : [];
        
        // Also update the module title if it has changed
        if (formData.title && formData.title !== module.title) {
          await dbService.modules.update(Number(moduleId), {
            title: formData.title
          });
        }
      }
      
      // Check if content already exists
      const { data: existingContent } = await dbService.moduleContent.getByModuleId(Number(moduleId));
      
      if (existingContent) {
        // Update existing content
        await dbService.moduleContent.update(existingContent.id, contentData);
      } else {
        // Create new content
        await dbService.moduleContent.create(contentData);
      }
      
      // Create or update a corresponding lesson in the local lessons array
      // This helps to make the content available in the learning journey
      const lessonId = `module-${moduleId}`;
      const existingLesson = lessons.find(l => l.id === lessonId);
      
      const lessonData = {
        id: lessonId,
        title: formData.title || module.title,
        description: "Interactive module lesson",
        era: module.journey_id === 4 ? 'jewish' : module.era || 'ancient-egypt', // Use module.era if available
        xp_reward: 50,
        duration: 10,
        content: '',
        lesson_type: 'storytelling',
        story_content: formData.story_content,
        transition_question: formData.transition_question,
        image_urls: formData.image_urls,
        is_journey_content: module.is_journey_module || true,
        level: module.level || 1 // Use module.level if available, otherwise default to level 1
      };
      
      if (existingLesson) {
        // Update existing lesson
        const index = lessons.findIndex(l => l.id === lessonId);
        lessons[index] = { ...existingLesson, ...lessonData };
        console.log("Updated existing lesson:", lessonData);
      } else {
        // Add new lesson
        lessons.push(lessonData);
        console.log("Added new lesson:", lessonData);
      }
      
      toast.success("Module content saved successfully");
      
      // Force reload data to ensure all components are updated
      const event = new CustomEvent('content-saved', { detail: { moduleId, lessonId } });
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error saving module content:', error);
      toast.error('Failed to save module content');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    module,
    activeTab,
    setActiveTab,
    questions,
    setQuestions,
    form,
    handleSave
  };
};
