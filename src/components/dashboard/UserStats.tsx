import { useState, useEffect } from "react";
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

const MOTIVATIONAL_QUOTES = [
  "Keep going! Every day is progress.",
  "History is made one step at a time.",
  "You're building your legacy!",
  "Great job! Keep up the streak!",
  "Every lesson brings you closer to mastery."
];

const AVATAR_OPTIONS = [
  { key: 'mascot', src: '/images/avatars/Johan.png', label: 'Johan' },
  { key: 'goldfish_3', src: '/images/avatars/goldfish_3.png', label: 'Goldfish 3' },
  { key: 'goldfish_4', src: '/images/avatars/goldfish_4.png', label: 'Goldfish 4' },
  { key: 'goldfish_5', src: '/images/avatars/goldfish_5.png', label: 'Goldfish 5' },
  { key: 'goldfish_8', src: '/images/avatars/goldfish_8.png', label: 'Goldfish 8' },
  { key: 'goldfish_15', src: '/images/avatars/goldfish_15.png', label: 'Goldfish 15' },
  { key: 'goldfish_29', src: '/images/avatars/goldfish_29.png', label: 'Goldfish 29' },
  { key: 'goldfish_38', src: '/images/avatars/goldfish_38.png', label: 'Goldfish 38' },
  { key: 'goldfish_52', src: '/images/avatars/goldfish_52.png', label: 'Goldfish 52' },
  { key: 'goldfish_84', src: '/images/avatars/goldfish_84.png', label: 'Goldfish 84' },
];

const ALL_AVATARS = AVATAR_OPTIONS;
const ALL_COURSES = [
  { title: 'Christianity', emoji: '✝️' },
  { title: 'WWII', emoji: '🌍' },
  { title: 'Rome', emoji: '🏛️' },
  { title: 'Ancient Egypt', emoji: '🦅' },
  { title: 'Medieval', emoji: '🏰' },
];
const ALL_BADGES = [
  { icon: '🏆', name: 'Era Master' },
  { icon: '🔥', name: '7 Day Streak' },
  { icon: '📜', name: 'Quiz Pro' },
  { icon: '🌍', name: 'Explorer' },
  { icon: '🧠', name: 'History Buff' },
];

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

export default function UserStats(props) {
  const { user, xp, streak, signOut, completedEras, preferredEra, setPreferredEra } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "Historian");
  const [showEraSelector, setShowEraSelector] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarBase, setAvatarBase] = useState(user?.user_metadata?.avatar_base || 'mascot');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarBase);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  const [featuredCourses, setFeaturedCourses] = useState(ALL_COURSES.slice(0, 3));
  const [showcaseBadges, setShowcaseBadges] = useState(ALL_BADGES.slice(0, 4));
  const { handleDragEnd: handleCourseDragEnd } = useDragAndDrop(featuredCourses, setFeaturedCourses);
  const { handleDragEnd: handleBadgeDragEnd } = useDragAndDrop(showcaseBadges, setShowcaseBadges);
  const [profileTab, setProfileTab] = useState('avatar');
  
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
        if (data && data.username) {
          setDisplayName(data.username);
        }
        if (data && data.avatar_base) {
          setAvatarBase(data.avatar_base);
        }
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
  const level = Math.floor(xp / xpForNextLevel) + 1;
  const xpPercent = Math.min(100, Math.round((xp % xpForNextLevel) / xpForNextLevel * 100));
  
  // Dummy values for journey progress (replace with real data if available)
  const totalModules = props.totalModules || 12;
  const completedModules = props.completedModules || 3;
  const journeyProgressPercent = Math.round((completedModules / totalModules) * 100);
  
  // Open modal and reset selection
  const openAvatarModal = () => {
    setSelectedAvatar(avatarBase);
    setShowAvatarModal(true);
  };

  // Save avatar selection
  const handleAvatarSave = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await supabase.from('user_profiles').update({ avatar_base: selectedAvatar }).eq('id', user.id);
        // Re-fetch avatar_base after saving
        const { data, error } = await supabase
          .from('user_profiles')
          .select('avatar_base')
          .eq('id', user.id)
          .single();
        if (!error && data && data.avatar_base) {
          setAvatarBase(data.avatar_base);
        } else {
          setAvatarBase(selectedAvatar); // fallback
        }
        // Unlock Profile Pro achievement
        await unlockAchievement(user.id, 'customize_avatar');
      }
      setShowAvatarModal(false);
      toast.success('Avatar updated!');
    } catch (e) {
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
      const idx = AVATAR_OPTIONS.findIndex(opt => opt.key === selectedAvatar);
      if (e.key === 'ArrowRight') {
        setSelectedAvatar(AVATAR_OPTIONS[(idx + 1) % AVATAR_OPTIONS.length].key);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedAvatar(AVATAR_OPTIONS[(idx - 1 + AVATAR_OPTIONS.length) % AVATAR_OPTIONS.length].key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAvatarModal, selectedAvatar]);

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
  const allLessons = props.learningTrack ? props.learningTrack.flatMap(level => level.lessons || []) : [];
  let currentModuleTitle = 'None';
  if (allLessons.length > 0) {
    const firstIncomplete = allLessons.find(lesson => !lesson.progress?.completed);
    if (firstIncomplete) {
      currentModuleTitle = firstIncomplete.title;
    } else {
      currentModuleTitle = allLessons[allLessons.length - 1].title;
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-timelingo-navy/95 to-purple-900/90 flex flex-col lg:flex-row items-start justify-start py-10 relative overflow-x-hidden">
      {/* Animated/Blurred Background Shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-timelingo-gold/30 to-timelingo-purple/20 rounded-full blur-3xl opacity-60 z-0 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-timelingo-teal/30 to-timelingo-navy/20 rounded-full blur-2xl opacity-50 z-0 animate-pulse-slow" />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center z-10">
        {/* Glassy Profile Header */}
        <div className="w-full max-w-5xl rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-timelingo-gold/30 flex flex-col md:flex-row items-center gap-8 px-10 py-8 mb-8 transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(255,215,0,0.10)]">
          {/* Avatar + Level Badge */}
          <div className="flex flex-col items-center md:items-start gap-4 min-w-[180px]">
            <div className="relative">
                  <img
                    src={AVATAR_OPTIONS.find(opt => opt.key === avatarBase)?.src || AVATAR_OPTIONS[0].src}
                    alt={displayName + "'s avatar"}
                className="w-32 h-32 object-contain drop-shadow-xl rounded-full border-4 border-timelingo-gold bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-200"
              />
              <span className="absolute -bottom-2 -right-2 bg-timelingo-gold text-timelingo-navy font-bold px-3 py-1 rounded-full shadow text-xs border-2 border-white">Level {level}</span>
            </div>
            <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customize Profile</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 mb-4">
                  <button className={`px-3 py-1 rounded ${profileTab === 'avatar' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-white/10 text-white'}`} onClick={() => setProfileTab('avatar')}>Avatar</button>
                  <button className={`px-3 py-1 rounded ${profileTab === 'courses' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-white/10 text-white'}`} onClick={() => setProfileTab('courses')}>Featured Courses</button>
                  <button className={`px-3 py-1 rounded ${profileTab === 'badges' ? 'bg-timelingo-gold text-timelingo-navy font-bold' : 'bg-white/10 text-white'}`} onClick={() => setProfileTab('badges')}>Badges</button>
                </div>
                {/* Avatar Tab */}
                {profileTab === 'avatar' && (
                  <div className="grid grid-cols-3 gap-4">
                    {ALL_AVATARS.map(opt => (
                    <button
                      key={opt.key}
                      className={`rounded-xl border-2 p-2 flex flex-col items-center transition-all focus:outline-none focus:ring-2 focus:ring-timelingo-gold ${selectedAvatar === opt.key ? 'border-timelingo-gold bg-yellow-100 scale-105 shadow-lg' : 'border-gray-200 bg-gray-50 hover:border-timelingo-gold hover:scale-105'}`}
                      onClick={() => setSelectedAvatar(opt.key)}
                      aria-label={opt.label}
                      tabIndex={0}
                    >
                      <img src={opt.src} alt={opt.label} className="w-16 h-16 object-contain mb-2" />
                      <span className="text-xs font-semibold text-timelingo-navy">{opt.label}</span>
                    </button>
                  ))}
                </div>
                )}
                {/* Featured Courses Tab */}
                {profileTab === 'courses' && (
                  <div>
                    <div className="mb-2 text-sm text-white/80">Drag to reorder your featured courses:</div>
                    <div className="flex gap-4">
                      {featuredCourses.map((course, idx) => (
                        <div
                          key={course.title}
                          draggable
                          onDragStart={e => e.dataTransfer.setData('text/plain', idx.toString())}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            const from = Number(e.dataTransfer.getData('text/plain'));
                            const to = idx;
                            if (from !== to) {
                              const items = Array.from(featuredCourses);
                              const [moved] = items.splice(from, 1);
                              items.splice(to, 0, moved);
                              setFeaturedCourses(items);
                            }
                          }}
                          className="min-w-[120px] rounded-xl bg-gradient-to-br from-yellow-200 to-timelingo-gold p-4 flex flex-col items-center shadow-lg border-2 border-white/20 text-lg font-bold cursor-move transition-transform hover:scale-105"
                        >
                          <span className="text-2xl mb-1">{course.emoji}</span>
                          <span className="text-lg font-bold text-white mb-1">{course.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-white/70">Click a course below to add/remove from your featured list:</div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {ALL_COURSES.filter(c => !featuredCourses.includes(c)).map(course => (
                        <button key={course.title} className="px-3 py-1 rounded bg-white/10 text-white hover:bg-timelingo-gold/80 hover:text-timelingo-navy" onClick={() => setFeaturedCourses([...featuredCourses, course])}>{course.emoji} {course.title}</button>
                      ))}
                      {featuredCourses.length > 1 && featuredCourses.map(course => (
                        <button key={course.title + '-remove'} className="px-2 py-1 rounded bg-red-500/80 text-white hover:bg-red-700 ml-1" onClick={() => setFeaturedCourses(featuredCourses.filter(c => c !== course))}>Remove {course.emoji}</button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Badges Tab */}
                {profileTab === 'badges' && (
                  <div>
                    <div className="mb-2 text-sm text-white/80">Drag to reorder your showcase badges:</div>
                    <div className="flex gap-4">
                      {showcaseBadges.map((badge, idx) => (
                        <div
                          key={badge.name}
                          draggable
                          onDragStart={e => e.dataTransfer.setData('text/plain', idx.toString())}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            const from = Number(e.dataTransfer.getData('text/plain'));
                            const to = idx;
                            if (from !== to) {
                              const items = Array.from(showcaseBadges);
                              const [moved] = items.splice(from, 1);
                              items.splice(to, 0, moved);
                              setShowcaseBadges(items);
                            }
                          }}
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-timelingo-gold/80 to-yellow-200/80 flex flex-col items-center justify-center shadow-lg border-2 border-white/20 text-2xl font-bold cursor-move transition-transform hover:scale-110 hover:shadow-2xl"
                        >
                          <span>{badge.icon}</span>
                          <span className="text-xs text-timelingo-navy font-semibold mt-1">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-white/70">Click a badge below to add/remove from your showcase:</div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {ALL_BADGES.filter(b => !showcaseBadges.includes(b)).map(badge => (
                        <button key={badge.name} className="px-3 py-1 rounded bg-white/10 text-white hover:bg-timelingo-gold/80 hover:text-timelingo-navy" onClick={() => setShowcaseBadges([...showcaseBadges, badge])}>{badge.icon} {badge.name}</button>
                      ))}
                      {showcaseBadges.length > 1 && showcaseBadges.map(badge => (
                        <button key={badge.name + '-remove'} className="px-2 py-1 rounded bg-red-500/80 text-white hover:bg-red-700 ml-1" onClick={() => setShowcaseBadges(showcaseBadges.filter(b => b !== badge))}>Remove {badge.icon}</button>
                      ))}
                </div>
              </div>
                )}
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <button className="px-5 py-2 rounded-full bg-gray-200 text-timelingo-navy font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors" onClick={() => { setShowProfileModal(false); setAvatarBase(selectedAvatar); /* Save featuredCourses and showcaseBadges to user profile here */ }}>Save</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {/* Username + Years of Service + XP + Compact Stats */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">{displayName}</h2>
              <span className="bg-timelingo-teal/80 text-white px-3 py-1 rounded-full text-xs font-semibold shadow border border-white/10">{user?.created_at ? `${Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear())} Years of Service` : 'New Scholar'}</span>
            </div>
            <div className="text-sm text-white/80 mt-1">Historian since {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</div>
            {/* XP Progress Bar */}
            <div className="w-full max-w-md mt-4">
            <div className="flex justify-between items-center text-xs mb-1 w-full">
              <span className="font-semibold text-white/90">XP</span>
              <span className="font-semibold text-yellow-300">Level {level}</span>
              <span className="text-white/80">{xp % xpForNextLevel} / {xpForNextLevel} XP</span>
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
            <div className="w-full max-w-md mt-4 flex flex-row justify-between items-center gap-0 rounded-xl bg-gradient-to-br from-white/10 to-timelingo-navy/20 shadow border border-white/10 backdrop-blur-xl overflow-hidden">
              {[
                { value: streak, label: 'Streak', color: 'text-timelingo-teal' },
                { value: completedEras.length, label: 'Eras', color: 'text-timelingo-gold' },
                { value: '-', label: 'Achv.', color: 'text-timelingo-purple' },
                { value: xp, label: 'XP', color: 'text-white' },
              ].map((stat, idx, arr) => (
                <div
                  key={stat.label}
                  className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 cursor-pointer group text-xs ${idx < arr.length - 1 ? 'border-r border-white/10' : ''}`}
                >
                  <span className={`text-xl font-extrabold drop-shadow ${stat.color} group-hover:scale-110 group-hover:text-yellow-300 transition-all`}>{stat.value}</span>
                  <span className="text-xs text-white/80 font-semibold mt-1 tracking-wide group-hover:text-white transition-all">{stat.label}</span>
          </div>
              ))}
          </div>
          </div>
        </div>
        {/* Featured Courses Row */}
        <div className="w-full max-w-5xl mb-8 px-10">
          <h3 className="text-xl font-bold text-white mb-3">Featured Courses</h3>
          <div className="flex flex-row gap-6 overflow-x-auto pb-2">
            {featuredCourses.map((course, idx) => (
              <div key={course.title} className={`min-w-[220px] rounded-2xl bg-gradient-to-br ${course.color} p-5 shadow-xl flex flex-col items-center justify-center glass-card border border-white/20 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-timelingo-gold/60 cursor-pointer`}
                onClick={() => alert(`Go to ${course.title} course!`)}
              >
                <span className="text-4xl mb-2 drop-shadow-lg">{course.emoji}</span>
                <span className="text-lg font-bold text-white mb-1">{course.title}</span>
                <button className="mt-2 px-4 py-1 rounded-full bg-timelingo-purple text-white font-semibold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors text-sm"
                  onClick={e => { e.stopPropagation(); alert(`Go to ${course.title} course!`); }}
                >Go to Course</button>
      </div>
            ))}
          </div>
        </div>
        {/* Recent Activity Section */}
        <div className="w-full max-w-5xl mb-8 px-10">
          <h3 className="text-xl font-bold text-white mb-3">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            {[{title: 'Completed: Ancient Egypt Quiz', date: 'Today', icon: '📜'}, {title: 'Studied: WWII Module 2', date: 'Yesterday', icon: '🌍'}, {title: 'Achievement: 7 Day Streak!', date: '2 days ago', icon: '🔥'}].map((activity, idx) => (
              <div key={idx} className="rounded-xl bg-white/10 backdrop-blur-md p-4 flex items-center gap-4 shadow border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:border-timelingo-gold/40 cursor-pointer">
                <span className="text-2xl drop-shadow-lg">{activity.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{activity.title}</div>
                  <div className="text-xs text-white/60">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sidebar (desktop) or below (mobile) */}
      <aside className="w-full lg:w-[320px] flex-shrink-0 mt-10 lg:mt-0 lg:ml-8 px-6 lg:px-0 sticky top-10 z-10">
        <div className="rounded-2xl bg-white/20 backdrop-blur-2xl shadow-2xl border border-timelingo-gold/30 p-6 flex flex-col gap-8 transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(255,215,0,0.10)]">
          {/* Badges */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Badges</h4>
            <div className="flex flex-wrap gap-3">
              {showcaseBadges.map((badge, idx) => (
                <div key={idx} className="w-14 h-14 rounded-full bg-gradient-to-br from-timelingo-gold/80 to-yellow-200/80 flex flex-col items-center justify-center shadow-lg border-2 border-white/20 text-2xl font-bold cursor-pointer transition-transform hover:scale-110 hover:shadow-2xl hover:border-timelingo-gold/80 relative group">
                  <span>{badge.icon}</span>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Achievement Progress (replaces Groups) */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Achievement Progress</h4>
            <div className="flex flex-col gap-3">
              {[{era: 'Christianity', percent: 75, color: 'from-yellow-200 to-timelingo-gold'}, {era: 'WWII', percent: 40, color: 'from-timelingo-teal to-teal-400'}, {era: 'Rome', percent: 90, color: 'from-purple-300 to-timelingo-purple'}].map((prog, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-semibold">{prog.era}</span>
                    <span className="text-white/80 text-xs font-mono">{prog.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden relative">
                    <div className={`h-full bg-gradient-to-r ${prog.color} rounded-full transition-all duration-700`} style={{ width: `${prog.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Friends */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Friends</h4>
            <div className="flex flex-col gap-2">
              {[{name: 'Alex', avatar: '/images/avatars/goldfish_3.png'}, {name: 'Sam', avatar: '/images/avatars/goldfish_4.png'}].map((friend, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg bg-white/20 px-3 py-2 shadow border border-white/10 cursor-pointer hover:bg-timelingo-gold/30 hover:shadow-lg transition-colors">
                  <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full object-contain border-2 border-timelingo-gold" />
                  <span className="text-white font-medium">{friend.name}</span>
              </div>
              ))}
            </div>
          </div>
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
    </div>
  );
}
