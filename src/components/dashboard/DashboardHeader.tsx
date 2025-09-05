import React from 'react';
import { Settings, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage');
  };
  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-gradient-to-r from-timelingo-navy/95 to-timelingo-purple/95 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3 h-[72px] relative">
        {/* Left: Empty space (Logo removed since sidebar navigation is available) */}
        <div className="flex items-center gap-4 min-w-[120px]">
          {/* Logo removed - sidebar navigation is used instead */}
        </div>
        {/* Center: HISTORIA title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full pointer-events-none">
          <span className="text-3xl font-extrabold text-white drop-shadow-lg tracking-widest select-none" style={{letterSpacing: '0.15em'}}>HISTORIA</span>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-6 min-w-[220px] justify-end">
          <button className="text-white/70 hover:text-timelingo-purple transition-colors flex items-center gap-1">
            <span className="sr-only">Settings</span>
            <Settings size={22} />
          </button>
          <button
            className="text-lg font-semibold text-timelingo-gold hover:text-white transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
