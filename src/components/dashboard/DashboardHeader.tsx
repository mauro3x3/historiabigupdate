import React from 'react';
import Logo from '@/components/Logo';
import { Settings, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = [
  { key: 'mascot_default', src: '/images/avatars/Johan.png' },
  { key: 'goldfish_1', src: '/images/avatars/goldfish_1.png' },
  { key: 'goldfish_2', src: '/images/avatars/goldfish_2.png' },
  { key: 'goldfish_3', src: '/images/avatars/goldfish_3.png' },
  { key: 'goldfish_4', src: '/images/avatars/goldfish_4.png' },
  { key: 'goldfish_5', src: '/images/avatars/goldfish_5.png' },
  { key: 'goldfish_6', src: '/images/avatars/goldfish_6.png' },
];

const DashboardHeader = () => {
  const { user, signOut } = useUser();
  const avatarBase = user?.user_metadata?.avatar_base || 'mascot_default';
  const avatarSrc = AVATAR_OPTIONS.find(opt => opt.key === avatarBase)?.src || AVATAR_OPTIONS[0].src;
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage');
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <button
            className="text-timelingo-gold font-semibold hover:underline text-base"
            onClick={() => window.location.href = '/videos'}
          >
            Videos
          </button>
          <button className="text-gray-500 hover:text-timelingo-purple">
            <span className="sr-only">Settings</span>
            <Settings size={20} />
          </button>
          <button
            className="text-timelingo-gold font-semibold hover:underline text-base"
            onClick={handleLogout}
          >
            Logout
          </button>
          <Avatar className="h-10 w-10 border-2 border-timelingo-gold bg-white">
            <AvatarImage src={avatarSrc} alt="Profile avatar" />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
