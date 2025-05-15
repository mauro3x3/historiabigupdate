import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

const Logo = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogoClick = () => {
    navigate('/home');
  };
  
  // Check if we're on the home page to apply different styling
  const isHomePage = location.pathname === '/home';
  
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer group px-3 py-2 rounded-xl transition-all duration-150 hover:bg-timelingo-gold/20 ${className}`}
      onClick={handleLogoClick}
      title="Go to Home"
      style={{ minHeight: 56 }}
    >
      <HomeIcon className="w-6 h-6 text-white drop-shadow" />
      <span className="text-lg font-bold text-white drop-shadow">Home</span>
    </div>
  );
};

export default Logo;
