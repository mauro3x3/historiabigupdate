import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Home, 
  BookOpen, 
  Map, 
  Globe, 
  Trophy, 
  User, 
  Settings,
  Gamepad2,
  Video,
  BarChart3,
  Bookmark,
  ShoppingBag
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { label: 'HOME', href: '/home', icon: <Home className="h-6 w-6" /> },
  { label: 'GLOBE', href: '/globe', icon: <Globe className="h-6 w-6" /> },
  { label: 'MUSEUM', href: '/museum', icon: <Trophy className="h-6 w-6" /> },
  { label: 'LEADERBOARD', href: '/leaderboard', icon: <BarChart3 className="h-6 w-6" /> },
  { label: 'BOOKMARKS', href: '/bookmarks', icon: <Bookmark className="h-6 w-6" /> },
  { label: 'GET A JOHAN PLUSHIE!', href: '/store', icon: <ShoppingBag className="h-6 w-6" />, disabled: true },
  { label: 'SETTINGS', href: '/settings', icon: <Settings className="h-6 w-6" /> },
  { label: 'PROFILE', href: '/profile', icon: <User className="h-6 w-6" /> },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

    return (
    <div className={cn(
      "fixed left-0 top-0 h-full w-64 bg-gray-900 text-white border-r border-gray-700 z-50",
              className
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img 
              src="/images/avatars/logo.png" 
              alt="Johan Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Historia
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
              >
                <div className="text-gray-500">
                  {item.icon}
                </div>
                <span className={`font-semibold text-sm tracking-wide ${item.label === 'GLOBE' ? 'font-jetbrainsmono' : ''}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-auto bg-gray-600 text-gray-400 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <div className={cn(
                "transition-colors duration-200",
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              )}>
                {item.icon}
              </div>
              <span className={`font-semibold text-sm tracking-wide ${item.label === 'GLOBE' ? 'font-jetbrainsmono' : ''}`}>
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Bottom Section - Removed Daily Streak */}
    </div>
  );
}

