import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Comprehensive avatar mapping
const AVATAR_MAP = {
  mascot_default: '/images/rainbowjohan (1).png',
  ghost: '/images/avatars/ghost.png',
  hummingbird: '/images/avatars/hummingbird.png',
  lion: '/images/avatars/lion.png',
  whale: '/images/avatars/whale.png',
  squid: '/images/avatars/squid.png',
  axolotl: '/images/avatars/axolotl.png',
  bison: '/images/avatars/bison.png',
  cat: '/images/avatars/cat.png',
  crow: '/images/avatars/crow.png',
  koala: '/images/avatars/koala.png',
  orangutan: '/images/avatars/orangutan.png',
  panda: '/images/avatars/panda.png',
  snail: '/images/avatars/snail.png',
  snake: '/images/avatars/snake.png',
  snowfox: '/images/avatars/snowfox.png',
  // Prize avatars
  'image-7EsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-7EsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-8FsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-8FsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-9GsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-9GsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-10HsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-10HsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-11IsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-11IsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-12JsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-12JsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-13KsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-13KsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-14LsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-14LsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-15MsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-15MsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
  'image-16NsQAdw5NUVcdw52hBwTqNGgip9vcR.png': '/images/prizeavatars/image-16NsQAdw5NUVcdw52hBwTqNGgip9vcR.png',
};

interface UserAvatarProps {
  avatarBase?: string | null;
  avatarAccessories?: any;
  username?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32',
};

export default function UserAvatar({
  avatarBase,
  avatarAccessories,
  username,
  className = '',
  size = 'md',
  showBorder = false,
}: UserAvatarProps) {
  // Get avatar image source
  const getAvatarSrc = () => {
    if (!avatarBase) return null;
    
    // Check if it's a prize avatar (has .png extension)
    if (avatarBase.includes('.png')) {
      return AVATAR_MAP[avatarBase as keyof typeof AVATAR_MAP] || null;
    }
    
    // Check regular avatar mapping
    return AVATAR_MAP[avatarBase as keyof typeof AVATAR_MAP] || null;
  };

  const avatarSrc = getAvatarSrc();
  const fallbackText = username?.charAt(0).toUpperCase() || 'U';
  const sizeClass = sizeClasses[size];
  const borderClass = showBorder ? 'border-4 border-white shadow-lg' : '';

  return (
    <Avatar className={`${sizeClass} ${borderClass} ${className}`}>
      <AvatarImage 
        src={avatarSrc || undefined} 
        alt={`${username || 'User'}'s avatar`} 
      />
      <AvatarFallback className="bg-timelingo-purple text-white font-bold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
