import { Toaster, toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import HomeRevamp from "./pages/HomeRevamp";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Lesson from "./pages/Lesson";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AllLessons from "./pages/AllLessons";
import HistoricalChat from "./pages/HistoricalChat";
import HistoricalMap from "./pages/HistoricalMap";
import HistoricalMapsList from "./pages/HistoricalMapsList";
import MapGames from "./pages/MapGames";
import MapGamePlay from "./pages/MapGamePlay";
import MapGameEdit from "./pages/MapGameEdit";
import Leaderboard from "./pages/Leaderboard";
import VideoPlayer from "./pages/VideoPlayer";
import { useUser } from "./contexts/UserContext";
import React, { useState, useEffect } from 'react';
import { Film, BookOpen, Map, Gamepad2, Hourglass, User, X, Lock, Home as HomeIcon } from 'lucide-react';
import Videos from "./pages/Videos";
import QuizBuilder from "./pages/QuizBuilder";
import { Sparkles } from 'lucide-react';
import QuizPlayPage from "./pages/QuizPlayPage";
import AllAchievements from "./pages/AllAchievements";
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import QuizLibrary from '@/pages/QuizLibrary';
import LandingPage from "./pages/Index";
import posthog from 'posthog-js';
import QuizEditPage from './pages/QuizEditPage';
import UpvotingBoard from "./pages/UpvotingBoard";
import AiWhale from "./pages/AiWhale";
import ProfilePublic from './pages/ProfilePublic';
import { ShepherdJourneyProvider } from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isOnboarded } = useUser();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component (separated to use context)
const AppRoutes = () => {
  const { user, isOnboarded } = useUser();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <HomeRevamp />
        </ProtectedRoute>
      } />
      <Route path="/auth" element={<ThemeProvider disableBackground={true}><Auth /></ThemeProvider>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/profile/:id" element={<ProfilePublic />} />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      <Route path="/lesson/:lessonId" element={
        <ProtectedRoute>
          <Lesson />
        </ProtectedRoute>
      } />
      <Route path="/video/:videoId" element={
        <ProtectedRoute>
          <VideoPlayer />
        </ProtectedRoute>
      } />
      <Route path="/historical-chat" element={
        <ProtectedRoute>
          <HistoricalChat />
        </ProtectedRoute>
      } />
      <Route path="/historical-map" element={<HistoricalMap />} />
      <Route path="/historical-map/list" element={<HistoricalMapsList />} />
      <Route path="/historical-map/:era" element={<HistoricalMap />} />
      <Route path="/map-games" element={<MapGames />} />
      <Route path="/map-games/:gameSlug" element={<MapGamePlay />} />
      <Route path="/map-games/:gameSlug/edit" element={
        <ProtectedRoute>
          <MapGameEdit />
        </ProtectedRoute>
      } />
      <Route path="/videos" element={
        <ProtectedRoute>
          <Videos />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
      <Route path="/quiz-builder" element={
        <ProtectedRoute>
          <QuizBuilder />
        </ProtectedRoute>
      } />
      <Route path="/quiz/:id" element={<QuizPlayPage />} />
      <Route path="/quiz-library" element={<QuizLibrary />} />
      <Route path="/achievements" element={<AllAchievements />} />
      <Route path="/quiz-edit/:id" element={<QuizEditPage />} />
      <Route path="/upvoting-board" element={<UpvotingBoard />} />
      <Route path="/ai-whale" element={<AiWhale />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NAV_LINKS = [
  { label: 'Home', href: '/home', icon: <HomeIcon className="h-6 w-6" /> },
  { label: 'Quiz Your Friends', href: '/quiz-builder', icon: <Sparkles className="h-6 w-6 text-yellow-400" /> },
  { label: 'Explore Eras', href: '/onboarding', icon: <Hourglass className="h-6 w-6" /> },
  { label: 'Upvoting board', href: '/upvoting-board', icon: <span className="h-6 w-6">⬆️</span>, external: true },
  { label: 'AI Whale', href: '/ai-whale', icon: <span className="h-6 w-6">🐋</span> },
  { label: 'Profile', href: '/profile', icon: <User className="h-6 w-6" /> },
];

function GlobalFishbowlMenu() {
  const [open, setOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const menuId = "fishbowl-menu";
  const navigate = useNavigate();

  // Show balloon only if not dismissed in last 24 hours
  useEffect(() => {
    const lastClosed = localStorage.getItem('fishbowlBalloonClosed');
    if (lastClosed) {
      const last = parseInt(lastClosed, 10);
      const now = Date.now();
      if (now - last < 24 * 60 * 60 * 1000) {
        setShowBalloon(false);
      }
    }
  }, []);

  const handleCloseBalloon = () => {
    setShowBalloon(false);
    localStorage.setItem('fishbowlBalloonClosed', Date.now().toString());
  };

  return (
    <div className="fixed bottom-8 right-8 z-20 flex flex-col items-end">
      {/* White Popover Menu */}
      <div
        className={`transition-all duration-300 mb-2 absolute ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'} right-0 bottom-20`}
        aria-hidden={!open}
        id={menuId}
        role="menu"
        style={{ zIndex: 40 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-1 border border-gray-200 animate-fade-in min-w-[220px] relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-timelingo-purple focus:outline-none"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {NAV_LINKS.map(link => (
            <React.Fragment key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-timelingo-gold/20 focus:bg-timelingo-gold/30 text-timelingo-navy font-semibold transition-all group focus:outline-none w-full text-left text-lg`}
                  tabIndex={open ? 0 : -1}
                  role="menuitem"
                  aria-label={link.label}
                  onClick={() => setOpen(false)}
                >
                  <span className="transition-transform duration-150 group-hover:scale-110 group-focus:scale-110 group-hover:text-timelingo-gold group-focus:text-timelingo-gold text-2xl">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-timelingo-gold/20 focus:bg-timelingo-gold/30 text-timelingo-navy font-semibold transition-all group focus:outline-none w-full text-left text-lg`}
                  tabIndex={open ? 0 : -1}
                  role="menuitem"
                  aria-label={link.label}
                  onClick={() => { setOpen(false); navigate(link.href); }}
                  disabled={false}
                >
                  <span className="transition-transform duration-150 group-hover:scale-110 group-focus:scale-110 group-hover:text-timelingo-gold group-focus:text-timelingo-gold text-2xl">
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Orb Button */}
      <button
        className={`special-glow-button rounded-full shadow-2xl bg-gradient-to-br from-blue-100 via-timelingo-gold to-purple-200 p-3 border-4 border-white transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${open ? 'ring-4 ring-timelingo-gold scale-105' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(o => !o)}
        style={{ width: 120, height: 120 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Glowing Orb */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-orb-float"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #fffbe6 0%, #ffd700 30%, #7f5af0 70%, #2dd4bf 100%)',
              boxShadow: '0 0 32px 8px #ffd70088, 0 0 64px 16px #7f5af088, 0 0 24px 4px #2dd4bf66',
              opacity: 0.96,
              border: '4px solid #fff',
              filter: 'blur(0.5px)',
            }}
          />
        </div>
        <span className="sr-only">Open navigation menu</span>
      </button>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }
        @keyframes orb-float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -60%) scale(1.04); }
        }
        .animate-orb-float { animation: orb-float 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function RouterWithFishbowl() {
  const location = useLocation();
  return (
    <>
      <AppRoutes />
      {location.pathname !== "/" && location.pathname !== "/landingpage" && location.pathname !== "/auth" && location.pathname !== "/onboarding" && <GlobalFishbowlMenu />}
    </>
  );
}

const App: React.FC = () => {
  React.useEffect(() => {
    posthog.init('phc_qJrMSxZ8mLABCLxtgCbXvwHWe67ZrmJFd9r8Og5iHJJ', { api_host: 'https://eu.posthog.com' });
    posthog.capture('test_event', { test: true });
  }, []);

  return (
    <ShepherdJourneyProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <RouterWithFishbowl />
                </BrowserRouter>
              </TooltipProvider>
            </UserProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </ShepherdJourneyProvider>
  );
};

export default App;
