import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, User, Plus, CheckCircle, ChevronRight, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import QuizLibrary from './QuizLibrary';

const THEMES = [
  'World War II',
  'Ancient Egypt',
  'Revolutions',
  'Famous Leaders',
  'Inventions',
  'Custom...'
];

const TABS = ['AI Dolphin', 'Browse Library'];

const EXAMPLE_TOPICS = [
  'Napoleon',
  'Space Race',
  'Vikings',
  'Women in Science',
  'Ancient Rome',
  'World Cup History',
  'Black Death',
  'Samurai',
  'Cold War',
];

const TAB_ICONS = {
  'AI Dolphin': <Sparkles className="h-5 w-5 mr-1" />,
  'Browse Library': <User className="h-5 w-5 mr-1" />,
};

const QuizBuilder: React.FC = () => {
  const [tab, setTab] = useState('AI Dolphin');
  const [theme, setTheme] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], answer: 0, type: 'mc' as 'mc' | 'tf' }
  ]);
  const [signature, setSignature] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const aiPromptInputRef = useRef<HTMLInputElement>(null);
  const [inputHighlight, setInputHighlight] = useState(false);
  const themeInputRef = useRef<HTMLInputElement>(null);

  const handleThemeSelect = (t: string) => {
    setTheme(t);
  };

  const handleQuestionChange = (idx: number, field: string, value: string | number | string[]) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions(qs => [...qs, { text: '', options: ['', '', '', ''], answer: 0, type: 'mc' }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const handleCreate = async (questionsForDb?: any[], topicArg?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a quiz.',
        variant: 'destructive',
      });
      return;
    }
    // First ensure user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    if (profileError || !profile) {
      toast({
        title: 'Error',
        description: 'User profile not found. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }
    // Always use topicArg || aiPrompt || theme for the title, never quizName
    const topic = topicArg || aiPrompt || theme || '';
    console.log('Topic value received in handleCreate:', topic);
    function capitalizeWords(str: string) {
      return str.replace(/\b\w/g, c => c.toUpperCase());
    }
    let base = topic;
    base = base.replace(/quiz$/i, '').trim();
    let autoTitle = '';
    if (!base || base.length === 1) {
      autoTitle = 'Custom Quiz';
    } else {
      const capitalized = capitalizeWords(base);
      autoTitle = capitalized + ' Quiz';
    }
    // Use the argument if provided, otherwise map from state
    const questionsToSave = questionsForDb || questions.map(q => ({
      question: q.text,
      options: q.options,
      correctAnswer: q.answer,
      type: q.type
    }));
    const quizData = {
      creator_id: user.id,
      theme: topic,
      name: autoTitle,
      signature,
      questions: questionsToSave,
      created_at: new Date().toISOString(),
    };
    console.log('Questions to be saved:', questionsToSave);
    console.log('Quiz data to be inserted:', quizData);
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single();
    if (error) {
      console.error('Supabase insert error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create quiz. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Success',
      description: 'Quiz created successfully!',
    });
    // Redirect to the quiz play page
    navigate(`/quiz/${data.id}`);
  };

  // Dolphin sound effect
  function playDolphinSound() {
    const audio = new Audio('/sounds/dolphin.mp3');
    audio.volume = 0.2;
    audio.play();
  }

  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiPrompt })
      });
      const data = await response.json();
      console.log('Full AI response:', data);
      let aiQuestions = data.questions;
      if (typeof aiQuestions === 'string') {
        try {
          aiQuestions = JSON.parse(aiQuestions);
          console.log('Parsed AI questions from string:', aiQuestions);
        } catch (e) {
          setAiError('AI returned invalid questions format.');
          return;
        }
      }
      if (Array.isArray(aiQuestions)) {
        // For display and saving to DB
        const mappedQuestions = aiQuestions.map(q => ({
          question: q.question || q.text || '',
          options: q.options || q.answers || [],
          correctAnswer: q.correctAnswer ?? q.answer ?? 0,
          type: 'mc' as 'mc',
        }));
        console.log('Mapped questions:', mappedQuestions);
        // Validate questions
        if (!mappedQuestions.length || mappedQuestions.some(q => !q.question || !q.options.length)) {
          setAiError('AI did not return valid questions. Try a different topic!');
          return;
        }
        // For setQuestions (UI state)
        const uiQuestions = aiQuestions.map(q => ({
          text: q.question || q.text || '',
          options: q.options || q.answers || [],
          answer: q.correctAnswer ?? q.answer ?? 0,
          type: 'mc' as 'mc',
        }));
        setQuestions(uiQuestions);
        setTheme(aiPrompt); // Always use the full user input as the theme
        playDolphinSound();
        // Automatically create the quiz after generation, passing mappedQuestions and the actual user input as topic
        await handleCreate(mappedQuestions, aiPrompt);
      } else {
        setAiError('Could not generate quiz. Try a different topic!');
      }
    } catch (err) {
      setAiError('Error generating quiz. Try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleThemeQuickFill = (theme: string) => {
    setAiPrompt(theme);
    setInputHighlight(true);
    setTimeout(() => setInputHighlight(false), 800);
    if (aiPromptInputRef.current) {
      aiPromptInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ background: 'radial-gradient(ellipse at 60% 0%, #f8fafc 60%, #e0e7ff 100%)' }}>
      {/* Animated background shapes and animated gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-100 via-yellow-50 to-purple-100 rounded-full opacity-40 blur-2xl animate-float-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-gradient-to-tr from-blue-100 via-purple-100 to-yellow-50 rounded-full opacity-30 blur-2xl animate-float-slower" />
        <div className="absolute top-1/2 left-[-120px] w-[200px] h-[200px] bg-gradient-to-br from-purple-100 to-blue-50 rounded-full opacity-20 blur-2xl animate-float-medium" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-yellow-50/30 to-blue-50/40 animate-gradient-move" style={{ zIndex: 1, pointerEvents: 'none', mixBlendMode: 'lighten' }} />
      </div>
      <style>{`
        @keyframes floatSlow { 0% { transform: translateY(0); } 50% { transform: translateY(30px); } 100% { transform: translateY(0); } }
        @keyframes floatSlower { 0% { transform: translateY(0); } 50% { transform: translateY(-40px); } 100% { transform: translateY(0); } }
        @keyframes floatMedium { 0% { transform: translateY(0); } 50% { transform: translateY(20px); } 100% { transform: translateY(0); } }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 10s ease-in-out infinite; }
        .fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-move { background-size: 200% 200%; animation: gradientMove 18s ease-in-out infinite; }
        .input-highlight { box-shadow: 0 0 0 4px #a5b4fc88, 0 2px 8px 0 #0001 !important; transition: box-shadow 0.3s; }
      `}</style>
      <div className="flex flex-col items-center justify-center w-full min-h-[90vh]">
        <div className="bg-white/90 rounded-[2.5rem] shadow-2xl p-12 w-full max-w-3xl border border-yellow-100 relative z-10 fade-in" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 100%)', boxShadow: '0 8px 40px 0 rgba(80,120,200,0.10)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-7 w-7 text-yellow-400" />
            <h1 className="text-3xl font-extrabold text-timelingo-navy tracking-tight">Quiz Your Friends</h1>
          </div>
          <div className="mb-4 text-gray-600 text-lg">Create a custom quiz and share it with friends! Get creative, compete, and go viral.</div>
          <div className="mb-8 flex gap-3 justify-center flex-wrap md:flex-nowrap md:gap-6 border-b border-gray-200 pb-4 bg-gradient-to-r from-white via-yellow-50 to-white rounded-t-2xl">
            {TABS.map(t => (
              <button
                key={t}
                className={`flex items-center px-6 py-2 rounded-xl font-bold text-base transition-all duration-150 shadow-sm border-2 md:mx-2 my-1 md:my-0 ${tab === t ? 'bg-timelingo-gold/90 text-white border-timelingo-gold scale-110 shadow-lg z-10' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-yellow-100 hover:scale-105'}`}
                onClick={() => setTab(t)}
                style={{ minWidth: 160, minHeight: 48 }}
              >
                {TAB_ICONS[t]}{t}
              </button>
            ))}
          </div>
          <div className="mb-4" />
          {tab === 'AI Dolphin' && (
            <>
              <div className="flex flex-col items-center relative w-full mb-10 fade-in" style={{ background: 'radial-gradient(circle at 80% 20%, #e0f2fe 10%, transparent 80%)' }}>
                <div className="flex justify-center mb-2">
                  <span className="text-4xl">🐬</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl px-6 py-5 mb-4 text-blue-900 text-center max-w-md font-mono shadow-xl relative flex flex-col items-center" style={{ minWidth: 340, boxShadow: '0 4px 32px 0 #a5b4fc33, 0 2px 8px 0 #0001' }}>
                  <span id="dolphin-typewriter" className="text-base font-medium">Hi! I'm your AI Dolphin. What do you want to test your friends on? Type a topic or a Wikipedia link and I'll make a battle for you!</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {EXAMPLE_TOPICS.map(topic => (
                    <button
                      key={topic}
                      className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all shadow-sm border border-blue-200"
                      onClick={() => setAiPrompt(topic)}
                      disabled={aiLoading}
                    >{topic}</button>
                  ))}
                </div>
                <input
                  ref={aiPromptInputRef}
                  type="text"
                  className={`border-2 border-blue-300 bg-white px-5 py-3 w-full text-lg mb-4 focus:outline-none focus:border-timelingo-gold rounded-xl shadow-lg transition-all ${inputHighlight ? 'input-highlight' : ''}`}
                  placeholder="e.g. The French Revolution or https://en.wikipedia.org/wiki/French_Revolution"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  disabled={aiLoading}
                  style={{ maxWidth: 420 }}
                />
                <Button onClick={handleAIGenerate} disabled={aiLoading || !aiPrompt} className="w-full bg-timelingo-purple hover:bg-purple-700 text-lg font-bold py-3 mb-2 flex items-center justify-center gap-2 rounded-xl shadow-lg transition-all" style={{ maxWidth: 420 }}>
                  {aiLoading ? <span className="animate-spin">🐬</span> : <Sparkles className="h-5 w-5" />} Generate Quiz
                </Button>
                {aiError && <div className="text-red-500 mt-2">{aiError}</div>}
                {aiLoading && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 animate-bounce-slow">
                    <span className="h-4 w-4 bg-blue-200 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="h-3 w-3 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                )}
                {/* Show Create Quiz button if questions are present and not loading */}
                {false && questions.length > 0 && !aiLoading && (
                  <Button
                    onClick={() => {
                      // Always use the full aiPrompt as the topic for AI quizzes
                      handleCreate(
                        questions.map(q => ({
                          question: q.text,
                          options: q.options,
                          correctAnswer: q.answer,
                          type: q.type
                        })),
                        aiPrompt
                      );
                    }}
                    className="w-full bg-timelingo-gold hover:bg-yellow-400 text-lg font-bold py-3 mt-4 rounded-xl shadow-lg"
                  >
                    Create Quiz
                  </Button>
                )}
              </div>
            </>
          )}
          {tab === 'Browse Library' && (
            <QuizLibrary />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder; 