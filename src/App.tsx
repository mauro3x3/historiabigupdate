import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AllLessons from "./pages/AllLessons";
import DailyChallenge from "./pages/DailyChallenge";
import HistoricalChat from "./pages/HistoricalChat";
import HistoricalMap from "./pages/HistoricalMap";
import HistoricalMapsList from "./pages/HistoricalMapsList";
import MapGames from "./pages/MapGames";
import MapGamePlay from "./pages/MapGamePlay";
import MapGameEdit from "./pages/MapGameEdit";
import Leaderboard from "./pages/Leaderboard";
import VideoPlayer from "./pages/VideoPlayer";
import { useUser } from "./contexts/UserContext";
import React, { useState } from 'react';
import { Film, BookOpen, Map, Gamepad2, Hourglass, User, X } from 'lucide-react';

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
  
  const defaultRoute = user 
    ? (isOnboarded ? <Navigate to="/profile" replace /> : <Navigate to="/onboarding" replace />)
    : <Navigate to="/home" replace />;
  
  return (
    <Routes>
      <Route path="/" element={defaultRoute} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      <Route path="/all-lessons" element={
        <ProtectedRoute>
          <AllLessons />
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
      <Route path="/daily-challenge" element={
        <ProtectedRoute>
          <DailyChallenge />
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
      <Route path="/map-games/:gameId" element={<MapGamePlay />} />
      <Route path="/map-games/:gameId/edit" element={
        <ProtectedRoute>
          <MapGameEdit />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NAV_LINKS = [
  { label: 'Videos', href: '/videos', icon: <Film className="h-6 w-6" /> },
  { label: 'All Lessons', href: '/all-lessons', icon: <BookOpen className="h-6 w-6" /> },
  { label: 'Maps', href: '/historical-map/list', icon: <Map className="h-6 w-6" /> },
  { label: 'Games', href: '/map-games', icon: <Gamepad2 className="h-6 w-6" /> },
  { label: 'Explore Eras', href: '/onboarding', icon: <Hourglass className="h-6 w-6" /> },
  { label: 'Profile', href: '/profile', icon: <User className="h-6 w-6" /> },
];

function GlobalFishbowlMenu() {
  const [open, setOpen] = useState(false);
  const menuId = "fishbowl-menu";
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Speech bubble with tail - repositioned to be above and left of the bowl */}
      <div className={`transition-all duration-300 ${open ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{ pointerEvents: open ? 'none' : 'auto', position: 'absolute', right: '110px', bottom: '110px' }}>
        <div className="relative">
          <div className="bg-white text-timelingo-navy px-5 py-2 rounded-2xl shadow-lg border border-gray-200 font-semibold text-base animate-fade-in">
            Want to try other ways of learning?
          </div>
          {/* Tail - now points more directly at the mascot */}
          <svg width="32" height="16" viewBox="0 0 32 16" className="absolute left-[70%] -bottom-3 -translate-x-1/2">
            <polygon points="16,0 32,16 0,16" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
          </svg>
        </div>
      </div>
      {/* Menu */}
      <div
        className={`transition-all duration-300 mb-2 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}
        aria-hidden={!open}
        id={menuId}
        role="menu"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-gray-200 animate-fade-in min-w-[200px] relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-timelingo-purple focus:outline-none"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-timelingo-gold/20 focus:bg-timelingo-gold/30 text-timelingo-navy font-semibold transition-all group focus:outline-none"
              tabIndex={open ? 0 : -1}
              role="menuitem"
              aria-label={link.label}
              onClick={() => setOpen(false)}
            >
              <span className="transition-transform duration-150 group-hover:scale-110 group-focus:scale-110 group-hover:text-timelingo-gold group-focus:text-timelingo-gold">
                {link.icon}
              </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {/* Fishbowl Button */}
      <button
        className={`rounded-full shadow-2xl bg-gradient-to-br from-blue-100 via-timelingo-gold to-purple-200 p-3 border-4 border-white transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${open ? 'ring-4 ring-timelingo-gold' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(o => !o)}
        style={{ width: 120, height: 120 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Bowl SVG */}
          <svg width="110" height="110" viewBox="0 0 110 110" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <ellipse cx="55" cy="70" rx="48" ry="35" fill="#e0f7fa" stroke="#b3e5fc" strokeWidth="4" />
            <ellipse cx="55" cy="90" rx="30" ry="8" fill="#b3e5fc" opacity="0.5" />
          </svg>
          {/* Mascot with bounce animation */}
          <img
            src="/images/avatars/goldfish_3.png"
            alt="Fishbowl mascot"
            className={`w-20 h-20 object-contain z-10 transition-transform duration-300 animate-bounce-slow ${open ? 'scale-110' : ''}`}
            style={{ marginTop: '10px' }}
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
      `}</style>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
          <GlobalFishbowlMenu />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
