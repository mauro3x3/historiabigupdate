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
import ProfilePublic from './pages/ProfilePublic';
import Globe from './pages/globe';
import Museum from './pages/Museum';
import Layout from './components/layout/Layout';
import ContentReviewPanel from './components/admin/ContentReviewPanel';

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
          <Layout>
            <HomeRevamp />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/auth" element={<ThemeProvider disableBackground={true}><Auth /></ThemeProvider>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile/:id" element={<ProfilePublic />} />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Layout>
            <Leaderboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/lesson/:lessonId" element={
        <ProtectedRoute>
          <Layout>
            <Lesson />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/guest-lesson/:lessonId" element={<Lesson />} />
      <Route path="/video/:videoId" element={
        <ProtectedRoute>
          <Layout>
            <VideoPlayer />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/historical-chat" element={
        <ProtectedRoute>
          <Layout>
            <HistoricalChat />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/historical-map" element={<HistoricalMap />} />
      <Route path="/historical-map/list" element={<HistoricalMapsList />} />
      <Route path="/historical-map/:era" element={<HistoricalMap />} />
      <Route path="/map-games" element={<MapGames />} />
      <Route path="/map-games/:gameSlug" element={<MapGamePlay />} />
      <Route path="/map-games/:gameSlug/edit" element={
        <ProtectedRoute>
          <Layout>
            <MapGameEdit />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/videos" element={
        <ProtectedRoute>
          <Layout>
            <Videos />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
      <Route path="/quiz-builder" element={
        <ProtectedRoute>
          <Layout>
            <QuizBuilder />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/quiz/:id" element={<QuizPlayPage />} />
      <Route path="/quiz-library" element={<QuizLibrary />} />
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Layout>
            <AllAchievements />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/quiz-edit/:id" element={<QuizEditPage />} />
      <Route path="/upvoting-board" element={
        <ProtectedRoute>
          <Layout>
            <UpvotingBoard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/globe" element={
        <ProtectedRoute>
          <Layout>
            <Globe />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/review" element={
        <ProtectedRoute>
          <Layout>
            <ContentReviewPanel />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/museum" element={
        <ProtectedRoute>
          <Layout>
            <Museum />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    posthog.init('phc_qJrMSxZ8mLABCLxtgCbXvwHWe67ZrmJFd9r8Og5iHJJ', { api_host: 'https://eu.posthog.com' });
    posthog.capture('test_event', { test: true });
  }, []);

  return (
    <ThemeContextProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </UserProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ThemeContextProvider>
  );
};

export default App;
