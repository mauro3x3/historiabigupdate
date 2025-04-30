
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

// Define types for messages
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'historical';
  timestamp: Date;
}

// Define historical figures data
const HISTORICAL_FIGURES = [
  { id: 'julius-caesar', name: 'Julius Caesar', era: 'Ancient Rome', avatar: '🏛️' },
  { id: 'cleopatra', name: 'Cleopatra', era: 'Ancient Egypt', avatar: '👑' },
  { id: 'napoleon', name: 'Napoleon Bonaparte', era: 'Revolutionary France', avatar: '⚔️' },
  { id: 'winston-churchill', name: 'Winston Churchill', era: 'World War II', avatar: '🎩' },
  { id: 'joan-of-arc', name: 'Joan of Arc', era: 'Medieval France', avatar: '🛡️' },
  { id: 'genghis-khan', name: 'Genghis Khan', era: 'Mongol Empire', avatar: '🐎' },
  { id: 'leonardo-da-vinci', name: 'Leonardo da Vinci', era: 'Renaissance', avatar: '🎨' },
  { id: 'marie-curie', name: 'Marie Curie', era: 'Modern Science', avatar: '⚗️' },
  { id: 'mahatma-gandhi', name: 'Mahatma Gandhi', era: 'Indian Independence', avatar: '🕊️' },
  { id: 'joseph-stalin', name: 'Joseph Stalin', era: 'Soviet Union', avatar: '☭' },
];

// Sample responses for each historical figure (to be expanded)
const SAMPLE_RESPONSES: Record<string, string[]> = {
  'julius-caesar': [
    "Veni, vidi, vici! I came, I saw, I conquered!",
    "The die is cast. What question do you bring before Caesar?",
    "Rome was not built in a day, nor was its empire. What else would you like to know?"
  ],
  'cleopatra': [
    "The might of Egypt and the wisdom of Greece flow through my veins.",
    "I am Cleopatra VII Philopator, last active ruler of the Ptolemaic Kingdom of Egypt.",
    "Intelligence and charm are more valuable than mere beauty. How may I enlighten you today?"
  ],
  'napoleon': [
    "Never interrupt your enemy when he is making a mistake.",
    "Impossible is a word to be found only in the dictionary of fools.",
    "Victory belongs to the most persevering. What would you like to discuss?"
  ],
  'winston-churchill': [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The best argument against democracy is a five-minute conversation with the average voter.",
    "I have nothing to offer but blood, toil, tears, and sweat. And perhaps some historical insight."
  ],
  'joan-of-arc': [
    "I am not afraid. I was born to do this.",
    "One life is all we have and we live it as we believe in living it.",
    "I place my trust in God, and my sword is at His service. What do you wish to know?"
  ],
  'genghis-khan': [
    "I am the punishment of God. If you had not committed great sins, God would not have sent a punishment like me upon you.",
    "Conquering the world on horseback is easy; it is dismounting and governing that is hard.",
    "Not even the mighty walls can stop the will of the great Khan. Ask your questions."
  ],
  'leonardo-da-vinci': [
    "Simplicity is the ultimate sophistication.",
    "Learning never exhausts the mind. What would you like to learn today?",
    "Art is never finished, only abandoned. Like many of my inventions and paintings."
  ],
  'marie-curie': [
    "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more.",
    "One never notices what has been done; one can only see what remains to be done.",
    "I was taught that the way of progress was neither swift nor easy. What scientific matter interests you?"
  ],
  'mahatma-gandhi': [
    "Be the change that you wish to see in the world.",
    "An eye for an eye only ends up making the whole world blind.",
    "The weak can never forgive. Forgiveness is the attribute of the strong. How may I guide you?"
  ],
  'joseph-stalin': [
    "Death is the solution to all problems. No man - no problem.",
    "Ideas are more powerful than guns. We would not let our enemies have guns, why should we let them have ideas?",
    "The people who cast the votes decide nothing. The people who count the votes decide everything. What is your question, comrade?"
  ],
};

const HistoricalChat = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedFigure, setSelectedFigure] = useState<string>(
    sessionStorage.getItem('selectedHistoricalFigure') || 'julius-caesar'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current figure details
  const currentFigure = HISTORICAL_FIGURES.find(f => f.id === selectedFigure) || HISTORICAL_FIGURES[0];

  // Handle figure change
  const handleFigureChange = (figureId: string) => {
    setSelectedFigure(figureId);
    sessionStorage.setItem('selectedHistoricalFigure', figureId);
    
    // Clear chat and add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `Greetings, I am ${HISTORICAL_FIGURES.find(f => f.id === figureId)?.name}. How may I assist you?`,
      sender: 'historical',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  // Generate AI response
  const generateResponse = (question: string) => {
    // Simulate AI response delay
    setIsTyping(true);
    
    setTimeout(() => {
      // Get random response from sample responses
      const responses = SAMPLE_RESPONSES[selectedFigure] || SAMPLE_RESPONSES['julius-caesar'];
      const randomIndex = Math.floor(Math.random() * responses.length);
      
      const newResponse: ChatMessage = {
        id: Date.now().toString(),
        content: responses[randomIndex],
        sender: 'historical',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Generate response
    generateResponse(newMessage);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      handleFigureChange(selectedFigure);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <Logo />
          </div>
          <div className="flex items-center">
            <Select value={selectedFigure} onValueChange={handleFigureChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Choose a historical figure" />
              </SelectTrigger>
              <SelectContent>
                {HISTORICAL_FIGURES.map(figure => (
                  <SelectItem key={figure.id} value={figure.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{figure.avatar}</span>
                      <span>{figure.name}</span>
                      <span className="ml-2 text-xs text-gray-500">({figure.era})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-8 w-8 bg-timelingo-purple rounded-full flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto flex-1 flex flex-col p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
              {currentFigure.avatar}
            </div>
            <div>
              <h2 className="font-bold text-timelingo-navy">{currentFigure.name}</h2>
              <p className="text-xs text-gray-500">{currentFigure.era}</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-timelingo-purple text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <Separator />
          
          <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Ask ${currentFigure.name} a question...`}
              className="flex-1 border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-timelingo-purple"
            />
            <Button 
              type="submit" 
              className="bg-timelingo-purple hover:bg-purple-700"
              disabled={isTyping || !newMessage.trim()}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HistoricalChat;
