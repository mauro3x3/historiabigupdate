import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { dbService } from '@/services/dbService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import QuestionsTab from '@/components/admin/tabs/QuestionsTab';

// Placeholder types for journeys, chapters, modules
interface Journey {
  id: number;
  title: string;
  description: string;
  era: string;
  status?: 'draft' | 'published' | 'needs_review';
}
interface Chapter {
  id: number;
  title: string;
  description: string;
  journey_id: number;
  position: number;
  status?: 'draft' | 'published' | 'needs_review';
}
interface Module {
  id: number;
  title: string;
  description: string;
  chapter_id: number;
  position: number;
  status?: 'draft' | 'published' | 'needs_review';
  era?: string;
  level?: number;
  xp_reward?: number;
  duration?: number;
  content_type?: string;
  image_urls?: string;
  story_content?: string;
  transition_question?: string;
  prompt?: string;
  character?: string;
}

const ADMIN_EMAILS = ["maurokjaer@gmail.com", "test@gmail.com"];

const AdminPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access the admin panel");
      navigate('/auth');
    } else if (!ADMIN_EMAILS.includes(user.email)) {
      toast.error("You are not authorized to access the admin panel");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // State for sidebar navigation
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  // New state for journey creation
  const [showJourneyForm, setShowJourneyForm] = useState(false);
  const [newJourneyTitle, setNewJourneyTitle] = useState("");
  const [newJourneyDescription, setNewJourneyDescription] = useState("");
  // New state for chapter and module creation
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterDescription, setNewChapterDescription] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [newModuleType, setNewModuleType] = useState('story');
  // Content editor state
  const [activeContentTab, setActiveContentTab] = useState('story');
  const [storyContent, setStoryContent] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{ question: '', answer: '' }]);
  const [imageUrls, setImageUrls] = useState(['']);
  // --- State for module content, now per module ---
  const [moduleContent, setModuleContent] = useState<{ [moduleId: number]: { story: string; quiz: { question: string; answer: string }[]; images: string[] } }>({});
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState<{
    title: string;
    description: string;
    status: 'draft' | 'published' | 'needs_review';
    files: string[];
    quiz: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
    era: string;
    level: number;
    xp_reward: number;
    duration: number;
    content_type: string;
    image_urls: string;
    story_content: string;
    transition_question: string;
    prompt: string;
    character: string;
  }>({
    title: '',
    description: '',
    status: 'draft',
    files: [],
    quiz: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }],
    era: '',
    level: 1,
    xp_reward: 50,
    duration: 5,
    content_type: 'story',
    image_urls: '',
    story_content: '',
    transition_question: '',
    prompt: '',
    character: '',
  });
  // Add loading and error state for uploads and CRUD
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Add validation state
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  // Add state for bulk upload modal and preview
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkModules, setBulkModules] = useState<any[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  // New state for duplicate module
  const [showDuplicateModule, setShowDuplicateModule] = useState(false);
  // New state for questions modal
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  // Add this state:
  const [lastSelectedModuleId, setLastSelectedModuleId] = useState<number | null>(null);

  // Helper to map status to badge variant
  const statusToBadgeVariant = (status?: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'needs_review': return 'outline';
      default: return 'secondary';
    }
  };

  // Fetch journeys
  useEffect(() => {
    dbService.learningTracks.getAll().then(({ data }) => {
      // Map and filter to expected Journey type
      const journeys = (data || [])
        .filter((j: any) => j && (j.title || j.level_one_name))
        .map((j: any) => ({
          id: j.id,
          title: j.title || j.level_one_name || 'Untitled Journey',
          description: j.description || '',
          era: j.era || '',
          status: j.status || 'draft',
        }));
      setJourneys(journeys as Journey[]);
    });
  }, []);

  // Fetch chapters when journey changes
  useEffect(() => {
    if (selectedJourney) {
      dbService.chapters.getByJourneyId(selectedJourney.id).then(({ data }) => {
        // Map and filter to expected Chapter type
        const chapters = (data || [])
          .filter((c: any) => c && (c.title || c.name) && (c.journey_id || selectedJourney.id))
          .map((c: any) => ({
            id: c.id,
            title: c.title || c.name || 'Untitled Chapter',
            description: c.description || '',
            journey_id: c.journey_id || selectedJourney.id,
            position: c.position || 1,
            status: c.status || 'draft',
          }));
        setChapters(chapters as Chapter[]);
        setSelectedChapter(null);
        setModules([]);
        setSelectedModuleId(null);
      });
    }
  }, [selectedJourney]);

  // Fetch modules when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
        // Map and filter to expected Module type
        const modules = (data || [])
          .filter((m: any) => m && (m.title || m.name))
          .map((m: any) => ({
            id: m.id,
            title: m.title || m.name || 'Untitled Module',
            description: m.description || '',
            chapter_id: m.chapter_id || selectedChapter.id,
            position: m.position || 1,
            status: m.status || 'draft',
            era: m.era,
            level: m.level,
            xp_reward: m.xp_reward,
            duration: m.duration,
            content_type: m.content_type,
            image_urls: m.image_urls,
            story_content: m.story_content,
            transition_question: m.transition_question,
            prompt: m.prompt,
            character: m.character,
          }));
        setModules(modules as Module[]);
        setSelectedModuleId(null);
      });
    }
  }, [selectedChapter]);

  // Load module content when selectedModule changes
  useEffect(() => {
    if (selectedModuleId) {
      // TODO: Replace with real fetch from dbService if available
      setModuleContent(prev => ({
        ...prev,
        [selectedModuleId]: prev[selectedModuleId] || { story: '', quiz: [{ question: '', answer: '' }], images: [''] }
      }));
      setIsEditingContent(false);
    }
  }, [selectedModuleId]);

  // Validation function
  const validateModule = (mod: any) => {
    const errors: { [key: string]: string } = {};
    if (!mod.title) errors.title = 'Title is required.';
    if (!mod.era) errors.era = 'Era is required.';
    if (!mod.level) errors.level = 'Level is required.';
    if (!mod.content_type) errors.content_type = 'Content type is required.';
    return errors;
  };

  // Handler for creating a journey
  const handleCreateJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJourneyTitle.trim()) return;
    const { data, error } = await dbService.learningTracks.create({
      title: newJourneyTitle,
      description: newJourneyDescription,
      era: "general"
    });
    if (error) {
      toast.error("Failed to create journey");
      return;
    }
    setShowJourneyForm(false);
    setNewJourneyTitle("");
    setNewJourneyDescription("");
    // Refresh journeys
    dbService.learningTracks.getAll().then(({ data }) => {
      const journeys = (data || [])
        .filter((j: any) => j && (j.title || j.level_one_name))
        .map((j: any) => ({
          id: j.id,
          title: j.title || j.level_one_name || 'Untitled Journey',
          description: j.description || '',
          era: j.era || '',
          status: j.status || 'draft',
        }));
      setJourneys(journeys as Journey[]);
    });
  };

  // Handler for creating a chapter
  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJourney || !newChapterTitle.trim()) return;
    const { data, error } = await dbService.chapters.create({
      journey_id: selectedJourney.id,
      title: newChapterTitle,
      description: newChapterDescription,
      position: chapters.length + 1
    });
    if (error) {
      toast.error("Failed to create chapter");
      return;
    }
    setShowChapterForm(false);
    setNewChapterTitle("");
    setNewChapterDescription("");
    // Refresh chapters
    dbService.chapters.getByJourneyId(selectedJourney.id).then(({ data }) => {
      const chapters = (data || [])
        .filter((c: any) => c && (c.title || c.name) && (c.journey_id || selectedJourney.id))
        .map((c: any) => ({
          id: c.id,
          title: c.title || c.name || 'Untitled Chapter',
          description: c.description || '',
          journey_id: c.journey_id || selectedJourney.id,
          position: c.position || 1,
          status: c.status || 'draft',
        }));
      setChapters(chapters as Chapter[]);
    });
  };

  // Handler for creating a module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapter || !newModuleTitle.trim()) return;
    const { data, error } = await dbService.modules.create({
      chapter_id: selectedChapter.id,
      title: newModuleTitle,
      description: newModuleDescription,
      position: modules.length + 1,
      content_type: newModuleType,
      is_journey_module: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error(error.message || "Failed to create module");
      return;
    }
    setShowModuleForm(false);
    setNewModuleTitle("");
    setNewModuleDescription("");
    setNewModuleType('story');
    // Refresh modules and auto-select the new one
    dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
      const modules = (data || [])
        .filter((m: any) => m && (m.title || m.name))
        .map((m: any) => ({
          id: m.id,
          title: m.title || m.name || 'Untitled Module',
          description: m.description || '',
          chapter_id: m.chapter_id || selectedChapter.id,
          position: m.position || 1,
          status: m.status || 'draft',
        }));
      setModules(modules as Module[]);
      // Auto-select the new module
      if (modules.length > 0) {
        setSelectedModuleId(modules[modules.length - 1].id);
        setTimeout(() => {
          const el = document.getElementById(`module-${modules[modules.length - 1].id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  };

  // --- Handlers for saving content ---
  const handleSaveModuleContent = async (type: 'story' | 'quiz' | 'images') => {
    if (!selectedModuleId) return;
    // TODO: Save to backend here
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} content saved!`);
    setIsEditingContent(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const { data, error } = await supabase.storage.from('module-media').upload(`modules/${Date.now()}-${file.name}`, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      } else if (data?.path) {
        const { publicUrl } = supabase.storage.from('module-media').getPublicUrl(data.path).data;
        uploadedUrls.push(publicUrl);
      }
    }
    setNewModule(m => ({ ...m, files: [...m.files, ...uploadedUrls] }));
  };

  const handleAddQuizQ = () => setNewModule(m => ({
    ...m,
    quiz: [...m.quiz, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
  }));

  const handleQuizChange = (idx: number, field: string, value: any) => {
    setNewModule(m => {
      const quiz = [...m.quiz];
      if (field === 'options') {
        quiz[idx].options = value;
      } else {
        quiz[idx][field] = value;
      }
      return { ...m, quiz };
    });
  };

  const handleQuizOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setNewModule(m => {
      const quiz = [...m.quiz];
      quiz[qIdx].options[optIdx] = value;
      return { ...m, quiz };
    });
  };

  const handleQuizCorrectChange = (qIdx: number, correctIdx: number) => {
    setNewModule(m => {
      const quiz = [...m.quiz];
      quiz[qIdx].correctAnswer = correctIdx;
      return { ...m, quiz };
    });
  };

  const handleQuizExplanationChange = (qIdx: number, value: string) => {
    setNewModule(m => {
      const quiz = [...m.quiz];
      quiz[qIdx].explanation = value;
      return { ...m, quiz };
    });
  };

  const handleRemoveQuizQ = (idx: number) => setNewModule(m => {
    const quiz = m.quiz.filter((_, i) => i !== idx);
    return { ...m, quiz };
  });

  // Update handleSaveModule and handleSaveNewModule to validate
  const handleSaveModule = async () => {
    if (!selectedChapter || !selectedModuleId) return;
    const errors = validateModule(selectedModule);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSaving(true);
    setSaveError(null);
    const { error } = await dbService.modules.update(selectedModuleId, {
      ...selectedModule,
      status: 'draft',
    });
    // --- Upsert story_content to module_content.story_text ---
    if (selectedModule.story_content) {
      const { data: existingContent } = await dbService.moduleContent.getByModuleId(selectedModuleId);
      if (existingContent) {
        await dbService.moduleContent.update(existingContent.id, { story_text: selectedModule.story_content });
      } else {
        await dbService.moduleContent.create({ module_id: selectedModuleId, story_text: selectedModule.story_content });
      }
    }
    setIsSaving(false);
    if (error) setSaveError(error.message);
    else toast.success('Module saved as draft!');
    dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        chapter_id: m.chapter_id,
        position: m.position,
        status: m.status,
        era: m.era,
        level: m.level,
        xp_reward: m.xp_reward,
        duration: m.duration,
        content_type: m.content_type,
        image_urls: m.image_urls,
        story_content: m.story_content,
        transition_question: m.transition_question,
        prompt: m.prompt,
        character: m.character,
      }));
      setModules(mapped);
    });
  };

  const handleSaveNewModule = async () => {
    if (!selectedChapter || !selectedJourney) return;
    const errors = validateModule(newModule);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const module = {
      title: newModule.title,
      description: newModule.description,
      chapter_id: selectedChapter.id,
      journey_id: selectedJourney.id,
      position: modules.length + 1,
      status: newModule.status,
      era: newModule.era,
      level: newModule.level,
      xp_reward: newModule.xp_reward,
      duration: newModule.duration,
      content_type: newModule.content_type,
      image_urls: newModule.image_urls,
      story_content: newModule.story_content,
      transition_question: newModule.transition_question,
      prompt: newModule.prompt,
      character: newModule.character,
    };
    const { data, error } = await dbService.modules.create(module);
    // --- Upsert story_content to module_content.story_text ---
    if (data && data[0] && newModule.story_content) {
      const moduleId = data[0].id;
      const { data: existingContent } = await dbService.moduleContent.getByModuleId(moduleId);
      if (existingContent) {
        await dbService.moduleContent.update(existingContent.id, { story_text: newModule.story_content });
      } else {
        await dbService.moduleContent.create({ module_id: moduleId, story_text: newModule.story_content });
      }
    }
    if (error) {
      toast.error(error.message || 'Failed to create module');
      return;
    }
    setShowAddModule(false);
    setNewModule({ title: '', description: '', status: 'draft', files: [], quiz: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }], era: '', level: 1, xp_reward: 50, duration: 5, content_type: 'story', image_urls: '', story_content: '', transition_question: '', prompt: '', character: '' });
    dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        chapter_id: m.chapter_id,
        position: m.position,
        status: m.status,
        era: m.era,
        level: m.level,
        xp_reward: m.xp_reward,
        duration: m.duration,
        content_type: m.content_type,
        image_urls: m.image_urls,
        story_content: m.story_content,
        transition_question: m.transition_question,
        prompt: m.prompt,
        character: m.character,
      }));
      setModules(mapped);
    });
  };

  // Publish module
  const handlePublishModule = async () => {
    if (!selectedChapter || !selectedModuleId) return;
    setIsSaving(true);
    setSaveError(null);
    const { error } = await dbService.modules.update(selectedModuleId, {
      ...selectedModule,
      status: 'published',
    });
    setIsSaving(false);
    if (error) setSaveError(error.message);
    else toast.success('Module published!');
    dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        chapter_id: m.chapter_id,
        position: m.position,
        status: m.status,
        era: m.era,
        level: m.level,
        xp_reward: m.xp_reward,
        duration: m.duration,
        content_type: m.content_type,
        image_urls: m.image_urls,
        story_content: m.story_content,
        transition_question: m.transition_question,
        prompt: m.prompt,
        character: m.character,
      }));
      setModules(mapped);
    });
  };

  // Delete module
  const handleDeleteModule = async () => {
    if (!selectedChapter || !selectedModuleId) return;
    setIsSaving(true);
    setSaveError(null);
    const { error } = await dbService.modules.delete(selectedModuleId);
    setIsSaving(false);
    if (error) setSaveError(error.message);
    else toast.success('Module deleted!');
    setSelectedModuleId(null);
    dbService.modules.getByChapterId(selectedChapter.id).then(({ data }) => {
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        chapter_id: m.chapter_id,
        position: m.position,
        status: m.status,
        era: m.era,
        level: m.level,
        xp_reward: m.xp_reward,
        duration: m.duration,
        content_type: m.content_type,
        image_urls: m.image_urls,
        story_content: m.story_content,
        transition_question: m.transition_question,
        prompt: m.prompt,
        character: m.character,
      }));
      setModules(mapped);
    });
  };

  // Bulk upload handler
  const handleBulkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        let modules: any[] = [];
        if (file.name.endsWith('.json')) {
          modules = JSON.parse(evt.target?.result as string);
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parser (expects header row)
          const text = evt.target?.result as string;
          const [header, ...rows] = text.split('\n').map(r => r.trim()).filter(Boolean);
          const keys = header.split(',').map(k => k.trim());
          modules = rows.map(row => {
            const values = row.split(',').map(v => v.trim());
            const obj: any = {};
            keys.forEach((k, i) => { obj[k] = values[i]; });
            return obj;
          });
        }
        setBulkModules(modules);
      } catch (err) {
        setBulkError('Failed to parse file. Make sure it is valid JSON or CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmBulkImport = () => {
    // TODO: Implement actual import logic (call dbService.modules.create for each)
    toast.success('Bulk import not implemented yet, but preview works!');
    setShowBulkUpload(false);
    setBulkModules([]);
  };

  // When rendering the editor, find the selected module object:
  const selectedModule = selectedModuleId ? modules.find(m => m.id === selectedModuleId) || null : null;

  // Add this useEffect to sync newModule when selectedModuleId changes:
  useEffect(() => {
    if (selectedModule) {
      // Only reset if the selected module is different from the current newModule (compare by id)
      if (lastSelectedModuleId !== selectedModuleId) {
        setNewModule({
          title: typeof selectedModule.title === 'string' ? selectedModule.title : '',
          description: typeof selectedModule.description === 'string' ? selectedModule.description : '',
          status: selectedModule.status || 'draft',
          files: [],
          quiz: Array.isArray((selectedModule as any).quiz) ? (selectedModule as any).quiz : [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }],
          era: typeof selectedModule.era === 'string' ? selectedModule.era : '',
          level: typeof selectedModule.level === 'number' ? selectedModule.level : 1,
          xp_reward: typeof selectedModule.xp_reward === 'number' ? selectedModule.xp_reward : 50,
          duration: typeof selectedModule.duration === 'number' ? selectedModule.duration : 5,
          content_type: typeof selectedModule.content_type === 'string' ? selectedModule.content_type : 'story',
          image_urls: typeof selectedModule.image_urls === 'string' ? selectedModule.image_urls : '',
          story_content: typeof selectedModule.story_content === 'string' ? selectedModule.story_content : '',
          transition_question: typeof selectedModule.transition_question === 'string' ? selectedModule.transition_question : '',
          prompt: typeof selectedModule.prompt === 'string' ? selectedModule.prompt : '',
          character: typeof selectedModule.character === 'string' ? selectedModule.character : '',
        });
        setLastSelectedModuleId(selectedModuleId);
      }
    }
    // eslint-disable-next-line
  }, [selectedModuleId]);

  return (
    <SidebarProvider>
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        {/* Sidebar Panel */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="bg-white border-r">
          <div className="h-full overflow-y-auto p-6 flex flex-col gap-6">
            <Button className="mb-4 w-32" variant="default" onClick={() => navigate('/dashboard')}>Home</Button>
            <h1 className="text-2xl font-bold mb-4">Content Dashboard</h1>
            <div>
              <h2 className="font-semibold text-lg mb-2">Journeys</h2>
              <ul className="mb-4">
                {journeys.map(journey => (
                  <li key={journey.id} className={`p-2 rounded cursor-pointer mb-1 ${selectedJourney?.id === journey.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                      onClick={() => { setSelectedJourney(journey); setSelectedChapter(null); setSelectedModuleId(null); }}>
                    <div className="flex items-center justify-between">
                      <span>{journey.title}</span>
                      <Badge variant={statusToBadgeVariant(journey.status)}>{journey.status || 'Draft'}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">{journey.description}</div>
                  </li>
                ))}
              </ul>
              {selectedJourney && (
                <>
                  <h2 className="font-semibold text-md mb-2">Chapters</h2>
                  <ul className="mb-4">
                    {chapters.map(chapter => (
                      <li key={chapter.id} className={`p-2 rounded cursor-pointer mb-1 ${selectedChapter?.id === chapter.id ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                          onClick={() => { setSelectedChapter(chapter); setSelectedModuleId(null); }}>
                        <div className="flex items-center justify-between">
                          <span>{chapter.title}</span>
                          <Badge variant={statusToBadgeVariant(chapter.status)}>{chapter.status || 'Draft'}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">{chapter.description}</div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selectedChapter && (
                <>
                  <h2 className="font-semibold text-md mb-2">Modules</h2>
                  <ul className="mb-4">
                    {modules.map(module => (
                      <li key={module.id} className={`p-2 rounded cursor-pointer mb-1 ${Number(selectedModuleId) === Number(module.id) ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                          onClick={() => {
                            setSelectedModuleId(module.id);
                          }}>
                        <div className="flex items-center justify-between">
                          <span>{module.title}</span>
                          <Badge variant={statusToBadgeVariant(module.status)}>{module.status || 'Draft'}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">{module.description}</div>
                      </li>
                    ))}
                  </ul>
                  <Dialog open={showAddModule} onOpenChange={setShowAddModule}>
                    <DialogTrigger asChild>
                      <Button className="mb-2 w-full" variant="secondary" onClick={() => setShowAddModule(true)}>+ Add Module</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Module</DialogTitle>
                      </DialogHeader>
                      <div className="mb-4 text-sm text-gray-600">
                        <div><b>Journey:</b> {selectedJourney?.title}</div>
                        <div><b>Chapter:</b> {selectedChapter?.title}</div>
                      </div>
                      {/* Basic Info Section */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Basic Info</h3>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Title" value={newModule.title} onChange={e => setNewModule(m => ({ ...m, title: e.target.value }))} />
                        {typeof newModule.description !== 'string' || newModule.description.length > 100000 ? (
                          <div className="bg-red-100 text-red-700 p-4 rounded mb-2">
                            <b>Warning:</b> The description field is corrupt or too large.<br />
                            <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={() => setNewModule(m => ({ ...m, description: '' }))}>
                              Reset Description
                            </button>
                          </div>
                        ) : (
                          <ReactQuill
                            theme="snow"
                            value={newModule.description}
                            onChange={val => setNewModule(m => ({ ...m, description: val }))}
                          />
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <input className="p-2 border rounded" placeholder="Era" value={newModule.era} onChange={e => setNewModule(m => ({ ...m, era: e.target.value }))} />
                          <input className="p-2 border rounded" type="number" placeholder="Level" value={newModule.level} onChange={e => setNewModule(m => ({ ...m, level: Number(e.target.value) }))} />
                          <input className="p-2 border rounded" type="number" placeholder="XP Reward" value={newModule.xp_reward} onChange={e => setNewModule(m => ({ ...m, xp_reward: Number(e.target.value) }))} />
                          <input className="p-2 border rounded" type="number" placeholder="Duration (min)" value={newModule.duration} onChange={e => setNewModule(m => ({ ...m, duration: Number(e.target.value) }))} />
                        </div>
                        <input className="w-full p-2 border rounded mt-2" placeholder="Content Type (e.g. story, quiz)" value={newModule.content_type} onChange={e => setNewModule(m => ({ ...m, content_type: e.target.value }))} />
                      </div>
                      {/* Content Section */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Content</h3>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Image URLs (comma separated)" value={newModule.image_urls} onChange={e => setNewModule(m => ({ ...m, image_urls: e.target.value }))} />
                        {typeof newModule.story_content !== 'string' || newModule.story_content.length > 100000 ? (
                          <div className="bg-red-100 text-red-700 p-4 rounded mb-2">
                            <b>Warning:</b> The story content field is corrupt or too large.<br />
                            <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={() => setNewModule(m => ({ ...m, story_content: '' }))}>
                              Reset Story Content
                            </button>
                          </div>
                        ) : (
                          <ReactQuill
                            theme="snow"
                            value={newModule.story_content}
                            onChange={val => setNewModule(m => ({ ...m, story_content: val }))}
                          />
                        )}
                      </div>
                      {/* Quiz Section */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Quiz Questions</h3>
                        {newModule.quiz.map((q, idx) => (
                          <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
                            <input
                              className="w-full p-2 border rounded mb-2"
                              placeholder="Question"
                              value={q.question}
                              onChange={e => handleQuizChange(idx, 'question', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <input
                                    className="flex-1 p-2 border rounded"
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={opt}
                                    onChange={e => handleQuizOptionChange(idx, optIdx, e.target.value)}
                                  />
                                  <input
                                    type="radio"
                                    name={`correct-${idx}`}
                                    checked={q.correctAnswer === optIdx}
                                    onChange={() => handleQuizCorrectChange(idx, optIdx)}
                                  />
                                  <span className="text-xs">Correct</span>
                                </div>
                              ))}
                            </div>
                            <input
                              className="w-full p-2 border rounded mb-2"
                              placeholder="Explanation (optional)"
                              value={q.explanation}
                              onChange={e => handleQuizExplanationChange(idx, e.target.value)}
                            />
                            <Button variant="destructive" onClick={() => handleRemoveQuizQ(idx)}>Remove</Button>
                          </div>
                        ))}
                        <Button variant="secondary" onClick={handleAddQuizQ}>+ Add Question</Button>
                      </div>
                      {/* Advanced Section (collapsible) */}
                      <details className="mb-4">
                        <summary className="font-semibold cursor-pointer mb-2">Advanced Fields</summary>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Transition Question" value={newModule.transition_question} onChange={e => setNewModule(m => ({ ...m, transition_question: e.target.value }))} />
                        <input className="w-full p-2 border rounded mb-2" placeholder="Prompt" value={newModule.prompt} onChange={e => setNewModule(m => ({ ...m, prompt: e.target.value }))} />
                        <input className="w-full p-2 border rounded mb-2" placeholder="Character" value={newModule.character} onChange={e => setNewModule(m => ({ ...m, character: e.target.value }))} />
                      </details>
                      <DialogFooter>
                        <Button onClick={handleSaveNewModule}>Save Module</Button>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
            {/* Bulk Upload Button */}
            <Button className="mt-2 w-full" variant="secondary" onClick={() => setShowBulkUpload(true)}>Bulk Upload Modules</Button>
            <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Modules</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                  <input type="file" accept=".json,.csv" onChange={handleBulkFile} />
                  <div className="text-xs text-gray-500 mt-2">Upload a JSON or CSV file with module data.</div>
                  {bulkError && <div className="text-red-500 mt-2">{bulkError}</div>}
                </div>
                {bulkModules.length > 0 && (
                  <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                    <div className="font-semibold mb-2">Preview ({bulkModules.length} modules):</div>
                    <ul className="text-xs">
                      {bulkModules.slice(0, 10).map((m, i) => (
                        <li key={i} className="mb-1">{JSON.stringify(m)}</li>
                      ))}
                      {bulkModules.length > 10 && <li>...and {bulkModules.length - 10} more</li>}
                    </ul>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={handleConfirmBulkImport} disabled={bulkModules.length === 0}>Confirm Import</Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* Editor Panel */}
        <ResizablePanel defaultSize={45} minSize={30} maxSize={70} className="bg-gray-50">
          <main className="h-full overflow-y-auto p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              {/* Editor for selected item */}
              {selectedModule ? (
                <div className="flex gap-8 max-w-5xl mx-auto">
                  {/* Editor */}
                  <div className="flex-1 p-4 bg-white rounded-lg shadow-md overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-4">Edit Module</h2>
                    {/* Basic Info Section */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Basic Info</h3>
                      <input className={`w-full p-2 border rounded mb-2 ${validationErrors.title ? 'border-red-500' : ''}`} placeholder="Title" value={selectedModule?.title || ''} onChange={e => setNewModule({ ...newModule, title: e.target.value })} />
                      {validationErrors.title && <div className="text-red-500 text-xs mb-1">{validationErrors.title}</div>}
                      <div className="mb-2">
                        <label className="block mb-1 font-medium">Description</label>
                        {typeof selectedModule.description !== 'string' || selectedModule.description.length > 100000 ? (
                          <div className="bg-red-100 text-red-700 p-4 rounded mb-2">
                            <b>Warning:</b> The description field is corrupt or too large.<br />
                            <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={() => setNewModule({ ...newModule, description: '' })}>
                              Reset Description
                            </button>
                          </div>
                        ) : (
                          <ReactQuill
                            theme="snow"
                            value={selectedModule.description}
                            onChange={val => setNewModule({ ...newModule, description: val })}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input className={`p-2 border rounded ${validationErrors.era ? 'border-red-500' : ''}`} placeholder="Era" value={selectedModule.era || ''} onChange={e => setNewModule({ ...newModule, era: e.target.value })} />
                        <input className={`p-2 border rounded ${validationErrors.level ? 'border-red-500' : ''}`} type="number" placeholder="Level" value={selectedModule.level || 1} onChange={e => setNewModule({ ...newModule, level: Number(e.target.value) })} />
                        <input className="p-2 border rounded" type="number" placeholder="XP Reward" value={selectedModule.xp_reward || 50} onChange={e => setNewModule({ ...newModule, xp_reward: Number(e.target.value) })} />
                        <input className="p-2 border rounded" type="number" placeholder="Duration (min)" value={selectedModule.duration || 5} onChange={e => setNewModule({ ...newModule, duration: Number(e.target.value) })} />
                      </div>
                      <input className={`w-full p-2 border rounded mt-2 ${validationErrors.content_type ? 'border-red-500' : ''}`} placeholder="Content Type (e.g. story, quiz)" value={selectedModule.content_type || ''} onChange={e => setNewModule({ ...newModule, content_type: e.target.value })} />
                      {validationErrors.era && <div className="text-red-500 text-xs mb-1">{validationErrors.era}</div>}
                      {validationErrors.level && <div className="text-red-500 text-xs mb-1">{validationErrors.level}</div>}
                      {validationErrors.content_type && <div className="text-red-500 text-xs mb-1">{validationErrors.content_type}</div>}
                    </div>
                    {/* Content Section */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Content</h3>
                      <input className="w-full p-2 border rounded mb-2" placeholder="Image URLs (comma separated)" value={selectedModule.image_urls || ''} onChange={e => setNewModule({ ...newModule, image_urls: e.target.value })} />
                      <div className="mb-2">
                        <label className="block mb-1 font-medium">Story Content</label>
                        {typeof selectedModule.story_content !== 'string' || selectedModule.story_content.length > 100000 ? (
                          <div className="bg-red-100 text-red-700 p-4 rounded mb-2">
                            <b>Warning:</b> The story content field is corrupt or too large.<br />
                            <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={() => setNewModule({ ...newModule, story_content: '' })}>
                              Reset Story Content
                            </button>
                          </div>
                        ) : (
                          <ReactQuill
                            theme="snow"
                            value={selectedModule.story_content}
                            onChange={val => setNewModule({ ...newModule, story_content: val })}
                          />
                        )}
                      </div>
                    </div>
                    {/* Quiz Section */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Quiz Questions</h3>
                      <Button variant="default" onClick={() => setShowQuestionsModal(true)}>Edit Quiz</Button>
                    </div>
                    {/* Advanced Section (collapsible) */}
                    <details className="mb-4">
                      <summary className="font-semibold cursor-pointer mb-2">Advanced Fields</summary>
                      <input className="w-full p-2 border rounded mb-2" placeholder="Transition Question" value={selectedModule.transition_question || ''} onChange={e => setNewModule({ ...newModule, transition_question: e.target.value })} />
                      <input className="w-full p-2 border rounded mb-2" placeholder="Prompt" value={selectedModule.prompt || ''} onChange={e => setNewModule({ ...newModule, prompt: e.target.value })} />
                      <input className="w-full p-2 border rounded mb-2" placeholder="Character" value={selectedModule.character || ''} onChange={e => setNewModule({ ...newModule, character: e.target.value })} />
                    </details>
                    {saveError && <div className="text-red-500 mb-2">{saveError}</div>}
                    <div className="flex gap-2 mb-4 border-t pt-4 mt-4">
                      <Button onClick={handleSaveModule} disabled={isSaving}>Save</Button>
                      <Button variant="outline" onClick={handlePublishModule} disabled={isSaving}>Publish</Button>
                      <Button variant="secondary" onClick={() => setShowDuplicateModule(true)}>Duplicate</Button>
                      <Button variant="destructive" onClick={handleDeleteModule} disabled={isSaving}>Delete</Button>
                    </div>
                  </div>
                  {/* Live Preview */}
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg shadow-inner overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
                    <div className="mb-2 text-2xl font-bold">{selectedModule.title}</div>
                    <div className="mb-2" dangerouslySetInnerHTML={{ __html: selectedModule.description || '' }} />
                    <div className="mb-2">
                      <b>Era:</b> {selectedModule.era} &nbsp; <b>Level:</b> {selectedModule.level}
                    </div>
                    <div className="mb-2">
                      <b>XP:</b> {selectedModule.xp_reward} &nbsp; <b>Duration:</b> {selectedModule.duration} min
                    </div>
                    <div className="mb-2">
                      <b>Type:</b> {selectedModule.content_type}
                    </div>
                    {selectedModule.image_urls && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {(selectedModule.image_urls.split(',').map(url => url.trim()).filter(Boolean)).map((url, idx) => (
                          <img key={idx} src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    <div className="mb-2" dangerouslySetInnerHTML={{ __html: selectedModule.story_content || '' }} />
                    {/* Advanced fields preview */}
                    {selectedModule.transition_question && <div className="mb-2"><b>Transition Question:</b> {selectedModule.transition_question}</div>}
                    {selectedModule.prompt && <div className="mb-2"><b>Prompt:</b> {selectedModule.prompt}</div>}
                    {selectedModule.character && <div className="mb-2"><b>Character:</b> {selectedModule.character}</div>}
                  </div>
                </div>
              ) : selectedChapter ? (
                <div>
                  <h2 className="text-xl font-bold mb-2">Edit Chapter</h2>
                  <input className="w-full p-2 border rounded mb-2" value={selectedChapter.title} onChange={e => setSelectedChapter({ ...selectedChapter, title: e.target.value })} />
                  <textarea className="w-full p-2 border rounded mb-2" value={selectedChapter.description} onChange={e => setSelectedChapter({ ...selectedChapter, description: e.target.value })} />
                  <select className="w-full p-2 border rounded mb-2" value={selectedChapter.status || 'draft'} onChange={e => setSelectedChapter({ ...selectedChapter, status: e.target.value as any })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="needs_review">Needs Review</option>
                  </select>
                  <div className="flex gap-2 mb-4">
                    <Button>Save</Button>
                    <Button variant="outline">Publish</Button>
                    <Button variant="secondary">Duplicate</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              ) : selectedJourney ? (
                <div>
                  <h2 className="text-xl font-bold mb-2">Edit Journey</h2>
                  <input className="w-full p-2 border rounded mb-2" value={selectedJourney.title} onChange={e => setSelectedJourney({ ...selectedJourney, title: e.target.value })} />
                  <textarea className="w-full p-2 border rounded mb-2" value={selectedJourney.description} onChange={e => setSelectedJourney({ ...selectedJourney, description: e.target.value })} />
                  <select className="w-full p-2 border rounded mb-2" value={selectedJourney.status || 'draft'} onChange={e => setSelectedJourney({ ...selectedJourney, status: e.target.value as any })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="needs_review">Needs Review</option>
                  </select>
                  <div className="flex gap-2 mb-4">
                    <Button>Save</Button>
                    <Button variant="outline">Publish</Button>
                    <Button variant="secondary">Duplicate</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-32">Select a Journey, Chapter, or Module to edit.</div>
              )}
            </div>
          </main>
        </ResizablePanel>
        <ResizableHandle withHandle />
      </ResizablePanelGroup>
      {/* Questions Modal */}
      <Dialog open={showQuestionsModal} onOpenChange={setShowQuestionsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
          </DialogHeader>
          <QuestionsTab />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminPage;
