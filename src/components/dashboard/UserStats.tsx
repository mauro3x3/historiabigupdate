import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import UserProfileHeader from "./UserProfileHeader";
import UserActions from "./UserActions";
import { supabase } from "@/integrations/supabase/client";
import { HistoryEra } from "@/types";
import { Medal, Flame, Star, ArrowRightCircle, BookOpen, Map, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

const MOTIVATIONAL_QUOTES = [
  "Keep going! Every day is progress.",
  "History is made one step at a time.",
  "You're building your legacy!",
  "Great job! Keep up the streak!",
  "Every lesson brings you closer to mastery."
];

const AVATAR_OPTIONS = [
  { key: 'mascot', src: '/images/avatars/mascot.png', label: 'Mascot' },
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

export default function UserStats(props) {
  const { user, xp, streak, signOut, completedEras, preferredEra, setPreferredEra } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "Historian");
  const [showEraSelector, setShowEraSelector] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarBase, setAvatarBase] = useState(user?.user_metadata?.avatar_base || 'mascot');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarBase);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  
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

  return (
    <>
      <div id="profile-card" className="rounded-3xl shadow-2xl border border-white/20 overflow-hidden bg-gradient-to-br from-timelingo-navy/95 to-purple-900/90 text-white mb-10 max-w-2xl mx-auto">
        <div className="flex flex-col items-center p-8 pb-4 w-full">
          {/* Large Avatar & Name */}
          <div className="flex flex-col items-center gap-2 w-full">
            {/* Animated Avatar with Big Bowl Background */}
            <div className="relative flex flex-col items-center mb-3 w-full">
              <div className="relative flex flex-col items-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0" style={{ width: 220, height: 220 }}>
                  <div className="rounded-full bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-200 shadow-2xl w-full h-full" style={{ filter: 'blur(0px)' }}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center" style={{ height: 220, width: 220 }}>
                  <img
                    src={AVATAR_OPTIONS.find(opt => opt.key === avatarBase)?.src || AVATAR_OPTIONS[0].src}
                    alt={displayName + "'s avatar"}
                    className="w-40 h-40 object-contain drop-shadow-xl rounded-full mt-8 animate-avatar-bounce group-hover:animate-avatar-glow"
                  />
                </div>
              </div>
              <div className="relative z-20 flex flex-col items-center mt-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white drop-shadow-sm">{displayName}</h2>
                  <button
                    className="ml-1 p-1 rounded-full hover:bg-white/10"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit display name"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button
              className="mt-4 px-5 py-2 rounded-full bg-timelingo-gold/90 text-timelingo-navy font-bold text-base shadow-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
              onClick={openAvatarModal}
              tabIndex={0}
              aria-label="Customize Avatar"
            >
              Customize Avatar
            </button>
          </div>
          {/* Avatar Customization Modal */}
          {showAvatarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in flex flex-col items-center">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-timelingo-purple text-2xl font-bold focus:outline-none"
                  onClick={() => setShowAvatarModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-timelingo-navy mb-4">Choose Your Avatar</h2>
                {/* Live Preview */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="rounded-full bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-200 p-2 shadow-lg flex items-center justify-center w-24 h-24 mb-2">
                    <img src={AVATAR_OPTIONS.find(opt => opt.key === selectedAvatar)?.src} alt="Selected avatar preview" className="w-20 h-20 object-contain" />
                  </div>
                  <span className="text-base font-semibold text-timelingo-navy">{AVATAR_OPTIONS.find(opt => opt.key === selectedAvatar)?.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {AVATAR_OPTIONS.map(opt => (
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
                <div className="flex gap-4 w-full justify-center">
                  <button
                    className="px-5 py-2 rounded-full bg-gray-200 text-timelingo-navy font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                    onClick={() => setShowAvatarModal(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-5 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors flex items-center gap-2 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleAvatarSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <svg className="animate-spin h-5 w-5 text-timelingo-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* XP Progress Bar with Level and Shine */}
          <div className="w-full max-w-sm mt-6 flex flex-col items-center">
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
          {/* Badges Row */}
          <div className="flex gap-4 mt-8 flex-wrap justify-center w-full">
            <button className="flex flex-col items-center bg-gradient-to-br from-teal-400/50 to-timelingo-teal/70 rounded-2xl py-4 px-6 min-w-[110px] shadow-xl relative group focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all" tabIndex={0} aria-label="Day Streak" title="Your current login streak">
              <Flame className="text-timelingo-teal mb-1" size={32} />
              <span className="text-2xl font-extrabold text-white drop-shadow">{streak}</span>
              <span className="text-sm text-gray-100 font-semibold">Day Streak</span>
            </button>
            <button className="flex flex-col items-center bg-gradient-to-br from-yellow-200/60 to-timelingo-gold/80 rounded-2xl py-4 px-6 min-w-[110px] shadow-xl relative group focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all" tabIndex={0} aria-label="Completed Eras" title="Eras you've mastered">
              <Medal className="text-timelingo-gold mb-1" size={32} />
              <span className="text-2xl font-extrabold text-white drop-shadow">{completedEras.length}</span>
              <span className="text-sm text-gray-100 font-semibold">Completed Eras</span>
            </button>
            {/* Featured Achievement Placeholder */}
            <button className="flex flex-col items-center bg-gradient-to-br from-gray-200/40 to-gray-400/30 rounded-2xl py-4 px-6 min-w-[110px] shadow-xl relative group opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all" tabIndex={0} aria-label="Achievement" title="No featured achievement yet">
              <Star className="text-yellow-400 mb-1" size={32} />
              <span className="text-2xl font-extrabold text-white drop-shadow">-</span>
              <span className="text-sm text-gray-100 font-semibold">Achievement</span>
            </button>
          </div>
          {/* Next Achievement/Progress Placeholder */}
          <div className="mt-6 flex items-center gap-2 text-timelingo-gold text-base font-semibold">
            <ArrowRightCircle className="inline-block" size={20} />
            <span>Next Achievement: <span className="font-bold text-white/90">Complete 1 Era</span></span>
          </div>
          {/* Motivational Message */}
          <div className="mt-2 text-center text-timelingo-gold text-base font-medium min-h-[28px]">
            {MOTIVATIONAL_QUOTES[quoteIdx]}
          </div>
          {/* See all achievements link */}
          <div className="mt-2">
            <a href="#" className="text-sm text-timelingo-gold hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all">See all achievements</a>
          </div>
          {/* Actions */}
          <div className="mt-8 flex gap-4 flex-wrap justify-center w-full">
            <UserActions signOut={signOut} user={user} />
          </div>
        </div>
        {/* Animations CSS */}
        <style>{`
          @keyframes avatar-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-avatar-bounce {
            animation: avatar-bounce 2s infinite;
          }
          @keyframes avatar-glow {
            0%, 100% { filter: drop-shadow(0 0 0px #ffd700); }
            50% { filter: drop-shadow(0 0 16px #ffd700); }
          }
          .group:hover .animate-avatar-glow {
            animation: avatar-glow 1.2s infinite;
          }
          @keyframes xp-shine-move {
            0% { left: -25%; }
            100% { left: 100%; }
          }
          .animate-xp-shine-move {
            animation: xp-shine-move 2.5s linear infinite;
            position: absolute;
            top: 0;
          }
        `}</style>
      </div>
      {/* Current Journey Card */}
      <CurrentJourneyCard preferredEra={preferredEra} learningTrack={props.learningTrack} setShowEraSelector={setShowEraSelector} />
      {/* Share/Download Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className="px-5 py-2 rounded-full bg-timelingo-purple text-white font-bold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
          onClick={() => setShowShareModal(true)}
        >
          Share Profile
        </button>
        <button
          className="px-5 py-2 rounded-full bg-timelingo-gold text-timelingo-navy font-bold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
          onClick={handleDownloadCard}
        >
          Download Card
        </button>
      </div>
      {/* Share Modal with QR Code */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-timelingo-purple text-2xl font-bold focus:outline-none"
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-timelingo-navy mb-4">Share Your Profile</h2>
            <QRCodeCanvas value={profileUrl} size={180} fgColor="#6C4AB6" bgColor="#fff" />
            <div className="mt-4 text-timelingo-navy text-center break-all text-sm">{profileUrl}</div>
            <button
              className="mt-4 px-5 py-2 rounded-full bg-timelingo-purple text-white font-bold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
              onClick={() => { navigator.clipboard.writeText(profileUrl); toast.success('Profile link copied!'); }}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CurrentJourneyCard({ preferredEra, learningTrack, setShowEraSelector }) {
  // Calculate real progress
  const allLessons = (learningTrack || []).flatMap(level => level.lessons || []);
  const totalModules = allLessons.length;
  const completedModules = allLessons.filter(lesson => lesson.progress?.completed).length;
  const journeyProgressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  // Find current module (first incomplete, or last completed)
  const currentModule = allLessons.find(lesson => !lesson.progress?.completed) || allLessons[allLessons.length - 1];

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <div className="rounded-3xl shadow-2xl bg-white/95 p-7 flex flex-col md:flex-row items-center gap-8 border border-gray-200 transition-transform duration-200 hover:scale-[1.025] hover:shadow-3xl relative overflow-hidden">
        {/* Icon/Illustration with gradient background */}
        <div className="flex-shrink-0">
          <div className="rounded-full bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-200 p-4 shadow-lg flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
            <BookOpen className="text-timelingo-purple" size={48} />
          </div>
        </div>
        {/* Journey Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-timelingo-navy">Current Journey</span>
            <span className="inline-block px-2 py-0.5 rounded-full bg-timelingo-gold/20 text-timelingo-gold text-xs font-semibold ml-2">Active</span>
          </div>
          <div className="text-xl font-extrabold text-timelingo-purple capitalize mb-1">{preferredEra ? preferredEra.replace(/-/g, ' ') : 'No journey selected'}</div>
          <div className="text-sm text-gray-600 mb-2">Explore the history of {preferredEra ? preferredEra.replace(/-/g, ' ') : 'your chosen era'} from ancient times to today!</div>
          {/* Current module/chapter */}
          <div className="text-xs text-timelingo-purple font-semibold mb-3">Current Module: <span className="font-bold text-timelingo-navy">{currentModule ? currentModule.title : 'None'}</span></div>
          {/* Progress Bar with animation and shine */}
          <div className="mt-2 w-56 md:w-72">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{completedModules} / {totalModules} modules</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-timelingo-gold to-timelingo-purple rounded-full transition-all duration-700 animate-xp-shine"
                style={{ width: `${journeyProgressPercent}%` }}
              ></div>
              {/* Shine effect */}
              <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
                <div className="h-full w-1/4 bg-white/30 rounded-full blur-lg animate-xp-shine-move" />
              </div>
              {/* Percentage label */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-timelingo-purple drop-shadow">{journeyProgressPercent}%</span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 min-w-[150px] w-full md:w-auto">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-timelingo-purple text-white font-semibold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all transform hover:scale-105"
            onClick={() => setShowEraSelector(true)}
          >
            <RefreshCcw size={20} />
            Switch Journey
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-timelingo-gold text-timelingo-navy font-semibold shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all transform hover:scale-105"
            onClick={() => window.location.href = `/historical-map/${preferredEra}`}
            disabled={!preferredEra}
          >
            <Map size={20} />
            View Journey Map
          </button>
        </div>
        {/* Shine animation CSS (reuse from above) */}
        <style>{`
          @keyframes xp-shine-move {
            0% { left: -25%; }
            100% { left: 100%; }
          }
          .animate-xp-shine-move {
            animation: xp-shine-move 2.5s linear infinite;
            position: absolute;
            top: 0;
          }
        `}</style>
      </div>
    </div>
  );
}
