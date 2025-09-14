import { useState, useEffect, useRef, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import UserProfileHeader from "./UserProfileHeader";
import { supabase } from "@/integrations/supabase/client";
import { HistoryEra } from "@/types";
import { Medal, Flame, Star, ArrowRightCircle, BookOpen, Map, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { unlockAchievement } from '@/integrations/supabase/achievements';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDragAndDrop } from '@/hooks/track-tabs/useDragAndDrop';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useUserFriends } from '@/hooks/useUserFriends';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useFeaturedCourses } from '@/hooks/useFeaturedCourses';
import LeaderboardPage from "@/components/leaderboard/LeaderboardPage";
import { useUserProfile } from '@/hooks/useUserProfile';
import { getLessonProgress } from '@/services/progressService';
import FriendsManager from './FriendsManager';
import { generateTrackForEra } from '@/data/trackData';

const MOTIVATIONAL_QUOTES = [
  "Keep going! Every day is progress.",
  "History is made one step at a time.",
  "You're building your legacy!",
  "Great job! Keep up the streak!",
  "Every lesson brings you closer to mastery."
];

const ALL_COURSES = [
  { title: 'Christianity', emoji: '✝️' },
  { title: 'WWII', emoji: '🌍' },
  { title: 'Rome', emoji: '🏛️' },
  { title: 'Ancient Egypt', emoji: '🦅' },
  { title: 'Medieval', emoji: '🏰' },
];

const COURSE_COLORS = {
  Christianity: 'from-yellow-200 to-timelingo-gold',
  WWII: 'from-timelingo-teal to-teal-400',
  Rome: 'from-purple-300 to-timelingo-purple',
  'Ancient Egypt': 'from-yellow-100 to-yellow-400',
  Medieval: 'from-gray-300 to-gray-600',
};

const AVATAR_OPTIONS = [
  { key: 'ghost', src: '/images/avatars/ghost.png', unlockCondition: 'default', description: 'Ghost avatar' },
  { key: 'hummingbird', src: '/images/avatars/hummingbird.png', unlockCondition: 'default', description: 'Hummingbird avatar' },
  { key: 'lion', src: '/images/avatars/lion.png', unlockCondition: 'default', description: 'Lion avatar' },
  { key: 'whale', src: '/images/avatars/whale.png', unlockCondition: 'default', description: 'Whale avatar' },
  { key: 'squid', src: '/images/avatars/squid.png', unlockCondition: 'default', description: 'Squid avatar' },
  { key: 'axolotl', src: '/images/avatars/axolotl.png', unlockCondition: 'default', description: 'Axolotl avatar' },
  { key: 'bison', src: '/images/avatars/bison.png', unlockCondition: 'default', description: 'Bison avatar' },
  { key: 'cat', src: '/images/avatars/cat.png', unlockCondition: 'default', description: 'Cat avatar' },
  { key: 'crow', src: '/images/avatars/crow.png', unlockCondition: 'default', description: 'Crow avatar' },
  { key: 'koala', src: '/images/avatars/koala.png', unlockCondition: 'default', description: 'Koala avatar' },
  { key: 'orangutan', src: '/images/avatars/orangutan.png', unlockCondition: 'default', description: 'Orangutan avatar' },
  { key: 'panda', src: '/images/avatars/panda.png', unlockCondition: 'default', description: 'Panda avatar' },
  { key: 'snail', src: '/images/avatars/snail.png', unlockCondition: 'default', description: 'Snail avatar' },
  { key: 'snake', src: '/images/avatars/snake.png', unlockCondition: 'default', description: 'Snake avatar' },
  { key: 'snowfox', src: '/images/avatars/snowfox.png', unlockCondition: 'default', description: 'Snow fox avatar' },
];

// Set cat as the default avatar for all users
const DEFAULT_AVATAR_KEY = 'cat';

// Prize avatar filenames
const PRIZE_AVATARS = [
  "image-7EsQAdw5NUVcdw52hBwTqNGgip9vcR.png",
  "image-a6WugtiuViBPIRbDNPg3OtImITAx.png",
  "image-AR6B9OO3Hvvi0mCU7IMvQGiOHzzgN1.png",
  "image-dtoN56U9XTn0CfjjNUnMD2x1PzV51q.png",
  "image-h3qcn77afchwlZrlJ5eGWlgGGdRdJw.png",
  "image-JLGCwuVRfOMwVMpimP9wXFiuf6Nw4x.png",
  "image-N2KDrpBUh9PwoJIFRVq8kM6BPUg0a.png",
  "image-oYQvk6Y2V2EuKUJMTNt6lCyV5DzIx8x.png",
  "image-XWWDqRRiqU7CVt0JjdRPOCMPrSXfoY.png"
];

function getRandomPrizeAvatar(unlocked) {
  const locked = PRIZE_AVATARS.filter(a => !unlocked.includes(a));
  if (locked.length === 0) return null;
  return locked[Math.floor(Math.random() * locked.length)];
}

function StatCard({ icon, value, label, className, onClick = undefined, disabled = false, ariaLabel, title }) {
  return (
    <button
      className={`flex flex-col items-center rounded-2xl py-4 px-6 min-w-[110px] shadow-xl relative group focus:outline-none transition-all duration-200 transform ${className} ${disabled ? 'opacity-60 pointer-events-none' : 'hover:scale-105 hover:shadow-2xl'}`}
      tabIndex={0}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      <span className="text-2xl font-extrabold text-white drop-shadow">{value}</span>
      <span className="text-sm text-gray-100 font-semibold">{label}</span>
    </button>
  );
}

interface FeaturedCourse {
  title: string;
  emoji: string;
}

function ChangeUsername({ user, onUsernameChange }) {
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    setUsername(user?.username || '');
  }, [user]);
  const handleSave = async () => {
    setError('');
    if (!username.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ username })
      .eq('id', user.id);
    setLoading(false);
    if (!error) {
      toast.success('Username updated!');
      onUsernameChange?.(username);
      setEditing(false);
    } else if (error.code === '23505' || (error.message && error.message.includes('unique'))) {
      setError('That username is already taken.');
    } else {
      setError('Failed to update username.');
    }
  };
  const handleCancel = () => {
    setUsername(user?.username || '');
    setError('');
    setEditing(false);
  };
  if (!editing) {
    return (
      <div className="mb-4 flex items-center gap-3 w-full">
        <span className="text-lg font-semibold text-timelingo-navy">{user?.username || 'No username set'}</span>
        <button
          className="px-3 py-1 rounded bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-sm"
          onClick={() => setEditing(true)}
        >
          Change Username
        </button>
      </div>
    );
  }
  return (
    <div className="mb-4 flex flex-col items-start gap-2 w-full animate-fade-in">
      <label className="text-sm font-semibold text-timelingo-navy mb-1">Username</label>
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="rounded border px-2 py-1 flex-1"
          placeholder="Enter new username"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-timelingo-gold text-timelingo-navy px-3 py-1 rounded hover:bg-yellow-400 font-semibold"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleCancel}
          className="text-gray-500 underline text-sm hover:text-gray-700 focus:outline-none"
          type="button"
        >
          Cancel
        </button>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

export interface UserStatsProps {
  userId?: string;
  learningTrack?: any;
}

export default function UserStats(props: UserStatsProps) {
  const { userId, learningTrack } = props;
  const isPublic = !!userId;
  
  const { user, xp: myXp, streak: myStreak, completedEras: myCompletedEras, preferredEra: myPreferredEra, setPreferredEra: setMyPreferredEra } = useUser();
  const { xp, streak, completedEras, preferredEra, username, avatar_base, featured_eras, achievements, created_at, refetchProfile } = useUserProfile(userId || user?.id);
  
  // Debug logging for completed eras
  console.log('🔍 Completed eras debug:', {
    isPublic,
    myCompletedEras,
    completedEras,
    displayCompletedEras: isPublic ? completedEras : myCompletedEras,
    displayCompletedErasLength: (isPublic ? completedEras : myCompletedEras)?.length || 0
  });
  // Use the correct data depending on view - memoized to prevent infinite re-renders
  const displayXp = useMemo(() => isPublic ? xp : myXp, [isPublic, xp, myXp]);
  const displayStreak = useMemo(() => isPublic ? streak : myStreak, [isPublic, streak, myStreak]);
  const displayCompletedEras = useMemo(() => isPublic ? completedEras : myCompletedEras, [isPublic, completedEras, myCompletedEras]);
  const displayPreferredEra = useMemo(() => isPublic ? preferredEra : myPreferredEra, [isPublic, preferredEra, myPreferredEra]);
  const displayUsername = useMemo(() => {
    console.log('🔍 Username calculation debug:', {
      isPublic,
      username,
      userEmail: user?.email,
      userId: user?.id,
      userAuthEmail: user?.user_metadata?.email
    });
    
    if (isPublic) {
      return username || 'User Not Found';
    } else {
      // For current user, prioritize username from user_profiles, then email fallback
      const profileUsername = username; // This comes from useUserProfile
      const emailFallback = user?.email?.split('@')[0];
      const result = profileUsername || emailFallback || 'Historian';
      console.log('Display username calculation:', { profileUsername, emailFallback, result, userEmail: user?.email });
      return result;
    }
  }, [isPublic, username, user?.email, user?.id]);
  const displayAvatar = useMemo(() => {
    const result = isPublic ? (avatar_base || 'cat') : (user?.user_metadata?.avatar_base || avatar_base || 'cat');
    console.log('🎭 Avatar calculation:', { isPublic, avatar_base, userMetadataAvatar: user?.user_metadata?.avatar_base, result });
    return result;
  }, [isPublic, avatar_base, user?.user_metadata?.avatar_base]);
  const displayFeaturedEras = useMemo(() => (isPublic ? featured_eras : undefined) || [], [isPublic, featured_eras]);
  const displayAchievements = useMemo(() => (isPublic ? achievements : undefined) || [], [isPublic, achievements]);
  const displayCreatedAt = useMemo(() => isPublic ? created_at : user?.created_at, [isPublic, created_at, user?.created_at]);
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // Use displayUsername directly instead of maintaining separate state
  const displayName = displayUsername;
  const [showEraSelector, setShowEraSelector] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // Use displayAvatar directly instead of maintaining separate state
  const selectedAvatar = displayAvatar || DEFAULT_AVATAR_KEY;
  
  // Local state for modal avatar selection
  const [modalSelectedAvatar, setModalSelectedAvatar] = useState(selectedAvatar);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  const [dotsCount, setDotsCount] = useState(0);
  const [museumItemsCount, setMuseumItemsCount] = useState(0);
  
  // Calculate featured courses directly instead of using useEffect
  const featuredCourses = useMemo(() => {
    if (isPublic && displayCompletedEras.length > 0) {
      // For public profiles, show their completed eras as featured courses
      return displayCompletedEras.slice(0, 3).map(era => ({
        title: era,
        emoji: ALL_COURSES.find(c => c.title === era)?.emoji || '📚'
      }));
    } else if (isPublic) {
      // If no completed eras, show default courses
      return ALL_COURSES.slice(0, 3);
    } else {
      // Use current user's featured courses
      return ALL_COURSES.slice(0, 4);
    }
  }, [isPublic, displayCompletedEras]);
  
  // For featured courses drag and drop, we'll use a local state when needed
  const [localFeaturedCourses, setLocalFeaturedCourses] = useState<FeaturedCourse[]>(featuredCourses);
  const { handleDragEnd: handleCourseDragEnd } = useFeaturedCourses(localFeaturedCourses, setLocalFeaturedCourses);
  
  // Update local state when featuredCourses changes
  useEffect(() => {
    setLocalFeaturedCourses(featuredCourses);
  }, [featuredCourses]);
  const [profileTab, setProfileTab] = useState('avatar');
  const [eras, setEras] = useState<any[]>([]);
  const [eraLoading, setEraLoading] = useState(true);
  const [userFeaturedEras, setUserFeaturedEras] = useState<string[]>([]);
  const [savingFeaturedEras, setSavingFeaturedEras] = useState(false);
  const [selectedFeaturedEras, setSelectedFeaturedEras] = useState<string[]>([]);
  // Removed eraProgressData state - using direct calculation instead
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<'xp' | 'streak'>('xp');
  const [unlockedPrizeAvatars, setUnlockedPrizeAvatars] = useState<string[]>([]);
  const [showPrizeAvatarModal, setShowPrizeAvatarModal] = useState(false);
  const [rewardedPrizeAvatar, setRewardedPrizeAvatar] = useState<string | null>(null);
  
  // Load the username and avatar from the database when the component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('username, avatar_base')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        // Username and avatar are now handled by displayUsername and displayAvatar directly
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    loadUserProfile();
  }, [user]);
  
  // Rotate motivational quote every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((idx) => (idx + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Placeholder XP progress calculation
  const xpForNextLevel = 500;
  const level = Math.floor(displayXp / xpForNextLevel) + 1;
  const xpPercent = Math.min(100, Math.round((displayXp % xpForNextLevel) / xpForNextLevel * 100));
  
  // Dummy values for journey progress (replace with real data if available)
  const totalModules = 12;
  const completedModules = 3;
  const journeyProgressPercent = Math.round((completedModules / totalModules) * 100);
  
  // Open modal and reset selection
  const openAvatarModal = () => {
    setModalSelectedAvatar(selectedAvatar);
    setShowAvatarModal(true);
  };

  // Save avatar selection
  const handleAvatarSave = async () => {
    setIsSaving(true);
    try {
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ avatar_base: modalSelectedAvatar })
          .eq('id', user.id);
        
        if (error) {
          console.error('Avatar update error:', error);
          throw error;
        }
        
        // Refresh the profile data to show the new avatar immediately
        refetchProfile();
        
        // Unlock Profile Pro achievement
        await unlockAchievement(user.id, 'customize_avatar');
      }
      setShowAvatarModal(false);
      toast.success('Avatar updated!');
    } catch (e) {
      console.error('Failed to update avatar:', e);
      toast.error('Failed to update avatar');
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!showAvatarModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAvatarModal(false);
      if (e.key === 'Enter') handleAvatarSave();
      // Arrow keys navigation
      const idx = AVATAR_OPTIONS.findIndex(opt => opt.key === modalSelectedAvatar);
      if (e.key === 'ArrowRight') {
        setModalSelectedAvatar(AVATAR_OPTIONS[(idx + 1) % AVATAR_OPTIONS.length].key);
      }
      if (e.key === 'ArrowLeft') {
        setModalSelectedAvatar(AVATAR_OPTIONS[(idx - 1 + AVATAR_OPTIONS.length) % AVATAR_OPTIONS.length].key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAvatarModal, modalSelectedAvatar]);

  // Download profile card as image
  const handleDownloadCard = async () => {
    const card = document.getElementById('profile-card');
    if (!card) return;
    const canvas = await html2canvas(card, { backgroundColor: null });
    const link = document.createElement('a');
    link.download = 'historia-profile.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Add this before the return statement
  const allLessons = learningTrack ? learningTrack.flatMap(level => level.lessons || []) : [];
  let currentModuleTitle = 'None';
  if (allLessons.length > 0) {
    const firstIncomplete = allLessons.find(lesson => !lesson.progress?.completed);
    if (firstIncomplete) {
      currentModuleTitle = firstIncomplete.title;
    } else {
      currentModuleTitle = allLessons[allLessons.length - 1].title;
    }
  }

  // Fetch dynamic data from Supabase
  const { friends, loading: friendsLoading, error: friendsError } = useUserFriends(user?.id);
  const { activity, loading: activityLoading, error: activityError } = useUserActivity(user?.id);

  // Remove the old loading and error states since they're now handled by the hooks
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState('');

  useEffect(() => { setAchievementsLoading(false); }, [achievements]);


  // Calculate eraProgress based on completed modules and total modules
  const eraProgress = (eras || []).map(era => {
    // For public profiles, we'll show a simplified progress based on completed eras
    if (isPublic) {
      const isCompleted = displayCompletedEras.includes(era.name);
      console.log(`Era progress for ${era.name}:`, { isCompleted, displayCompletedEras, isPublic });
      return {
        era: era.name,
        percent: isCompleted ? 100 : 0,
        color: COURSE_COLORS[era.name] || 'from-gray-200 to-gray-400',
      };
    }
    
    // For current user, use simplified logic
    const total = 10; // Default total
    const completed = 0; // Default completed
    return {
      era: era.name,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      color: COURSE_COLORS[era.name] || 'from-gray-200 to-gray-400',
    };
  }).filter(e => e.percent > 0);

  useEffect(() => {
    const fetchEras = async () => {
      setEraLoading(true);
      const { data, error } = await supabase
        .from('history_eras')
        .select('*')
        .eq('is_enabled', true)
        .order('name', { ascending: true });
      console.log('Fetched eras:', data, 'Error:', error); // Debug log
      setEras(data || []);
      setEraLoading(false);
    };
    fetchEras();
  }, []);

  // Fetch user's featured_eras from user_profiles
  useEffect(() => {
    const fetchUserFeaturedEras = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data && (data as any).featured_eras) {
        setUserFeaturedEras((data as any).featured_eras);
      }
    };
    fetchUserFeaturedEras();
  }, [user]);

  // Helper: get full era objects for user's featured_eras (in order)
  const featuredEraObjects = userFeaturedEras
    .map(code => eras.find(e => e.code === code))
    .filter(Boolean);
  
  // Debug logging removed to fix MIME type issues

  // When opening the modal, sync selection with user's current featured eras
  useEffect(() => {
    if (showProfileModal && profileTab === 'courses') {
      setSelectedFeaturedEras(userFeaturedEras.length > 0 ? userFeaturedEras : []);
    }
  }, [showProfileModal, profileTab, userFeaturedEras]);

  // Save selected featured eras to user_profiles
  const handleSaveFeaturedEras = async () => {
    setSavingFeaturedEras(true);
    try {
      await supabase
        .from('user_profiles')
        .update({ featured_eras: selectedFeaturedEras } as any)
        .eq('id', user.id);
      setUserFeaturedEras(selectedFeaturedEras);
      toast.success('Featured courses updated!');
      setShowProfileModal(false);
    } catch (e) {
      toast.error('Failed to update featured courses');
    } finally {
      setSavingFeaturedEras(false);
    }
  };

  // Helper: get display name for an era
  function getDisplayEraName(era) {
    if (!era || !era.name) return '';
    const mappings = {
      'Jewish History': 'Judaism',
      'Christian History': 'Christianity',
      'Hindu History': 'Hinduism',
    };
    if (mappings[era.name]) return mappings[era.name];
    return era.name.replace(/ History$/, '');
  }

  // Use the same progress data as the home tab
  const [progressData, setProgressData] = useState({});
  const [eraProgressData, setEraProgressData] = useState({});
  
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      try {
        const progress = await getLessonProgress(user.id);
        setProgressData(progress);
        
        // Calculate progress for each era like the home tab does
        const eraProgress = {};
        for (const era of featuredEraObjects) {
          try {
            const track = await generateTrackForEra(era.code as HistoryEra);
            const trackWithProgress = track.levels.map(level => ({
              ...level,
              lessons: (level.lessons || []).map(lesson => ({
                ...lesson,
                progress: progress[String(lesson.id)] || undefined,
              })),
            }));
            
            const totalModules = trackWithProgress.reduce((sum, level) => sum + (level.lessons?.length || 0), 0);
            const completedModules = trackWithProgress.reduce(
              (sum, level) => sum + (level.lessons?.filter(l => l.progress?.completed).length || 0),
              0
            );
            
            eraProgress[era.code] = {
              completed: completedModules,
              total: totalModules,
              percent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
            };
          } catch (error) {
            console.error(`Error calculating progress for ${era.code}:`, error);
            eraProgress[era.code] = { completed: 0, total: 0, percent: 0 };
          }
        }
        
        setEraProgressData(eraProgress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    loadProgress();
  }, [user, featuredEraObjects]);

  // Removed getEraProgress function - using direct calculation instead

  // Leaderboard modal state
  const openLeaderboard = (type: 'xp' | 'streak') => {
    setLeaderboardType(type);
    setShowLeaderboard(true);
  };

  // Fetch unlocked prize avatars on mount
  useEffect(() => {
    if (!user) return;
    const fetchPrizeAvatars = async () => {
      // For now, skip prize avatars since the column doesn't exist in the database
      // TODO: Add prize_avatars column to user_profiles table if needed
      setUnlockedPrizeAvatars([]);
    };
    fetchPrizeAvatars();
  }, [user]);

  // Fetch dots count
  useEffect(() => {
    const fetchDotsCount = async () => {
      if (!user) return;
      try {
        // Use direct query with any type since userdots table is not in types
        const { data: directData, error: directError } = await (supabase as any)
          .from('userdots')
          .select('id')
          .eq('user_id', user.id);
        
        if (directError) {
          console.error('Direct query error:', directError);
          setDotsCount(0);
        } else {
          setDotsCount(directData?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching dots count:', error);
        setDotsCount(0);
      }
    };
    fetchDotsCount();
  }, [user]);

  // Fetch museum items count
  useEffect(() => {
    const fetchMuseumItemsCount = async () => {
      if (!user) {
        console.log('🔍 No user found for museum items fetch');
        return;
      }
      
      try {
        const { data, error } = await (supabase as any)
          .from('museum_items')
          .select('id')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching museum items count:', error);
          setMuseumItemsCount(0);
        } else {
          const count = data?.length || 0;
          console.log('🔍 Museum items count for user', user.id, ':', count);
          if (count > 0) {
            console.log('🔍 Museum item IDs:', data?.map(item => item.id));
          }
          setMuseumItemsCount(count);
        }
      } catch (error) {
        console.error('Error fetching museum items count:', error);
        setMuseumItemsCount(0);
      }
    };
    fetchMuseumItemsCount();
  }, [user]);

  // Temporarily disabled complex journey checking to fix loading issues
  // TODO: Re-enable once component loading is stable

  // Reward logic (simulate with a button for now)
  const handleRewardPrizeAvatar = async () => {
    if (!user) return;
    const avatar = getRandomPrizeAvatar(unlockedPrizeAvatars);
    if (!avatar) {
      toast('You have unlocked all prize avatars!');
      return;
    }
    const newUnlocked = [...unlockedPrizeAvatars, avatar];
    const { error } = await supabase.from('user_profiles').update({
      prize_avatars: newUnlocked,
      avatar_base: avatar
    }).eq('id', user.id);
    if (!error) {
      setUnlockedPrizeAvatars(newUnlocked);
      setRewardedPrizeAvatar(avatar);
      setShowPrizeAvatarModal(true);
      toast.success('New avatar unlocked!');
    } else {
      toast.error('Failed to unlock avatar');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-timelingo-navy/95 to-purple-900/90 flex flex-col lg:flex-row items-start justify-start pt-20 pb-0 relative overflow-x-hidden -mt-6 -ml-6 -mr-6">
      {/* Animated/Blurred Background Shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-timelingo-gold/30 to-timelingo-purple/20 rounded-full blur-3xl opacity-60 z-0 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-timelingo-teal/30 to-timelingo-navy/20 rounded-full blur-2xl opacity-50 z-0 animate-pulse-slow pointer-events-none" />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center z-10">
        {/* Glassy Profile Header */}
        <div className="w-full max-w-3xl rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-timelingo-gold/30 flex flex-col md:flex-row items-center gap-8 px-6 py-8 mb-8 transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(255,215,0,0.10)]">
          {/* Avatar + Level Badge */}
          <div className="flex flex-col items-center md:items-start gap-4 min-w-[180px]">
            <div className="relative">
                  <img
                    src={AVATAR_OPTIONS.find(opt => opt.key === selectedAvatar)?.src || AVATAR_OPTIONS.find(opt => opt.key === DEFAULT_AVATAR_KEY)?.src}
                    alt={displayName + "'s avatar"}
                className="w-32 h-32 object-contain drop-shadow-xl rounded-full border-4 border-timelingo-gold bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-200"
              />
              <span className="absolute -bottom-2 -right-2 bg-timelingo-gold text-timelingo-navy font-bold px-3 py-1 rounded-full shadow text-xs border-2 border-white">Level {level}</span>
            </div>
            <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
              {!isPublic && (
                <DialogTrigger asChild>
                  <button
                    className="px-4 py-1 rounded-full bg-timelingo-gold/90 text-timelingo-navy font-bold text-sm shadow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                    onClick={() => setShowProfileModal(true)}
                    tabIndex={0}
                    aria-label="Customize Profile"
                  >
                    Customize Profile
                  </button>
                </DialogTrigger>
              )}
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customize Profile</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 mb-4">
                  <button className={`px-3 py-1 rounded ${profileTab === 'avatar' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-timelingo-navy/40 text-white'}`} onClick={() => setProfileTab('avatar')}>Avatar</button>
                  <button className={`px-3 py-1 rounded ${profileTab === 'courses' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-timelingo-navy/40 text-white'}`} onClick={() => setProfileTab('courses')}>Featured Courses</button>
                  <button className={`px-3 py-1 rounded ${profileTab === 'username' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-timelingo-navy/40 text-white'}`} onClick={() => setProfileTab('username')}>Change Username</button>
                </div>
                {/* Avatar Tab */}
                {profileTab === 'avatar' && (
                  <div className="grid grid-cols-3 gap-4">
                    {AVATAR_OPTIONS.map(opt => {
                      return (
                        <button
                          key={opt.key}
                          className={`rounded-xl border-2 p-2 flex flex-col items-center transition-all focus:outline-none focus:ring-2 focus:ring-timelingo-gold relative group ${modalSelectedAvatar === opt.key ? 'border-timelingo-gold bg-timelingo-navy/80 scale-105 shadow-lg' : 'border-gray-600 bg-timelingo-navy/40 hover:border-timelingo-gold hover:scale-105'}`}
                          onClick={() => setModalSelectedAvatar(opt.key)}
                          aria-label={opt.key}
                          tabIndex={0}
                        >
                          <img src={opt.src} alt={opt.key} className="w-20 h-20 object-contain mb-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Featured Courses Tab */}
                {profileTab === 'courses' && (
                  <div>
                    <div className="mb-2 text-sm text-white/80">Select up to 4 featured courses:</div>
                    <div className="flex gap-4 mb-2">
                      {selectedFeaturedEras.map((code, idx) => {
                        const era = eras.find(e => e.code === code);
                        if (!era) return null;
                        return (
                          <div key={era.code} className="min-w-[120px] rounded-xl bg-gradient-to-br from-timelingo-purple to-timelingo-gold p-4 flex flex-col items-center shadow-lg border-2 border-white/20 text-lg font-bold relative">
                            <span className="text-3xl mb-1">{era.emoji}</span>
                            <span className="text-lg font-bold text-white mb-1">{getDisplayEraName(era)}</span>
                            <button
                              className="absolute top-1 right-1 px-2 py-1 rounded bg-red-500 text-white text-xs"
                              onClick={() => setSelectedFeaturedEras(selectedFeaturedEras.filter(c => c !== code))}
                            >Remove</button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {eras.filter(e => !selectedFeaturedEras.includes(e.code)).map(era => (
                        <button
                          key={era.code}
                          className={`px-3 py-1 rounded bg-timelingo-navy/40 text-white hover:bg-timelingo-gold/80 hover:text-timelingo-navy ${selectedFeaturedEras.length >= 4 ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={() => {
                            if (selectedFeaturedEras.length < 4) setSelectedFeaturedEras([...selectedFeaturedEras, era.code]);
                          }}
                          disabled={selectedFeaturedEras.length >= 4}
                        >{era.emoji} {getDisplayEraName(era)}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4 justify-end">
                      <button className="px-5 py-2 rounded-full bg-gray-200 text-timelingo-navy font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors" onClick={() => setShowProfileModal(false)}>Cancel</button>
                      <button className="px-5 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors" onClick={handleSaveFeaturedEras} disabled={savingFeaturedEras || selectedFeaturedEras.length === 0}>{savingFeaturedEras ? 'Saving...' : 'Save'}</button>
                    </div>
                  </div>
                )}
                {profileTab === 'username' && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Current Username</h3>
                      <p className="text-gray-300">
                        Profile: <span className="font-mono">{username || 'Not set'}</span>
                      </p>
                      <p className="text-gray-300">
                        Email: <span className="font-mono">{user?.email}</span>
                      </p>
                      <p className="text-gray-300">
                        Display: <span className="font-mono">{displayUsername}</span>
                      </p>
                    </div>
                    <ChangeUsername user={user} onUsernameChange={() => {}} />
                  </div>
                )}
                {profileTab !== 'courses' && (
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <button className="px-5 py-2 rounded-full bg-gray-200 text-timelingo-navy font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors">Cancel</button>
                    </DialogClose>
                    <button className="px-5 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors" onClick={handleAvatarSave} disabled={isSaving}>Save</button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
          {/* Username + Years of Service + XP + Compact Stats */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">{displayName}</h2>
            </div>
            <div className="text-sm text-white/80 mt-1">Historian since {displayCreatedAt ? new Date(displayCreatedAt).getFullYear() : '2024'}</div>
            {/* XP Progress Bar */}
            <div className="w-full max-w-md mt-4">
            <div className="flex justify-between items-center text-xs mb-1 w-full">
              <span className="font-semibold text-white/90">XP</span>
              <span className="font-semibold text-yellow-300">Level {level}</span>
              <span className="text-white/80">{displayXp % xpForNextLevel} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full transition-all duration-700 animate-xp-shine"
                style={{ width: `${xpPercent}%` }}
              ></div>
              {/* Shine effect */}
              <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
                <div className="h-full w-1/4 bg-white/30 rounded-full blur-lg animate-xp-shine-move" />
              </div>
            </div>
          </div>
            {/* Compact Stats Row */}
            <div className="w-full max-w-lg mt-4 grid grid-cols-5 gap-1 rounded-xl bg-gradient-to-br from-white/10 to-timelingo-navy/20 shadow border border-white/10 backdrop-blur-xl overflow-hidden">
              {[
                { value: displayStreak, label: 'Streak', color: 'text-timelingo-teal' },
                { value: displayCompletedEras.length, label: 'Journeys', color: 'text-timelingo-gold' },
                { value: museumItemsCount, label: 'Museum', color: 'text-timelingo-purple' },
                { value: dotsCount, label: 'Dots', color: 'text-timelingo-teal' },
                { value: displayXp, label: 'XP', color: 'text-white' },
              ].map((stat, idx, arr) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center py-2 transition-all duration-200 group text-xs"
                >
                  <span className={`text-xl font-extrabold drop-shadow ${stat.color} group-hover:scale-110 group-hover:text-yellow-300 transition-all`}>{stat.value}</span>
                  <span className="text-xs text-white/80 font-semibold mt-1 tracking-wide group-hover:text-white transition-all">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Featured Courses Row */}
        <div className="w-full max-w-3xl mb-8 px-6">
          <h3 className="text-xl font-bold text-white mb-3">Featured Courses</h3>
          {eraLoading && <div className="text-white/70">Loading...</div>}
          {!eraLoading && featuredEraObjects.length === 0 && <div className="text-white/70">No featured courses selected. <button className='underline' onClick={() => { setShowProfileModal(true); setProfileTab('courses'); }}>Customize</button></div>}
          <div className="flex flex-row gap-6 justify-center">
            {featuredEraObjects.slice(0, 4).map((era) => (
              <div key={era.code} className="min-w-[220px] rounded-2xl bg-gradient-to-br from-timelingo-navy/80 to-timelingo-purple/80 p-6 shadow-xl flex flex-col items-center justify-center glass-card border border-timelingo-gold/30 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-timelingo-gold/60 cursor-pointer backdrop-blur-xl">
                <span className="text-5xl mb-3 drop-shadow-lg">{era.emoji}</span>
                <span className="text-xl font-bold text-white mb-2">{getDisplayEraName(era)}</span>
                <span className="text-xs text-gray-300 mb-4">{era.time_period}</span>
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-timelingo-gold to-timelingo-purple text-white font-semibold shadow hover:bg-yellow-400/80 hover:text-timelingo-navy focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-base" onClick={() => navigate(`/home?era=${era.code}`)}>Go to Course</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sidebar (desktop) or below (mobile) */}
      <aside className="w-full lg:w-[260px] flex-shrink-0 mt-10 lg:mt-0 px-6 lg:px-0 lg:mr-8" style={{ transform: 'translateX(-20px)' }}>
        <div className="space-y-6">
          {/* Achievement Progress - Simplified */}
          {featuredEraObjects.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <h4 className="text-lg font-bold text-white mb-4">Learning Progress</h4>
              <div className="space-y-3">
                {featuredEraObjects.map((era, idx) => {
                  const progress = eraProgressData[era.code] || { completed: 0, total: 0, percent: 0 };
                  const isCompleted = progress.percent === 100;
                  
                  return (
                    <div key={era.code} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm">{getDisplayEraName(era)}</div>
                        <div className="text-white/60 text-xs">
                          {progress.completed}/{progress.total} modules
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isCompleted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {progress.percent}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Friends Manager */}
          <FriendsManager />
        </div>
      </aside>
      {/* Interactivity for main content */}
        <style>{`
        .glass-card:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25), 0 0 0 2px #ffd70044;
          z-index: 2;
        }
        .glass-card {
          transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        .glass-card-stats {
          box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18), 0 0 0 2px #ffd70022;
          background-blend-mode: overlay;
          background-image: repeating-linear-gradient(135deg,rgba(255,255,255,0.02) 0 8px,transparent 8px 16px);
          }
        `}</style>
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-3xl w-full">
          <LeaderboardPage initialType={leaderboardType} />
        </DialogContent>
      </Dialog>
      {/* Prize Avatar Reward Button (for demo) */}
      <Dialog open={showPrizeAvatarModal} onOpenChange={setShowPrizeAvatarModal}>
        <DialogContent>
          <DialogTitle>🎉 New Avatar Unlocked!</DialogTitle>
          {rewardedPrizeAvatar && (
            <div className="flex flex-col items-center">
              <img
                src={`/images/prizeavatars/${rewardedPrizeAvatar}`}
                alt="Prize Avatar"
                className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg mb-4"
              />
              <p className="text-lg font-bold">You earned a new avatar!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
