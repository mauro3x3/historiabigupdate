import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogoClick = () => {
    navigate('/home');
  };
  
  // Check if we're on the home page to apply different styling
  const isHomePage = location.pathname === '/home';
  
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl transition-all duration-150 ${isHomePage ? 'bg-timelingo-gold/10' : 'hover:bg-timelingo-gold/20'}`}
      onClick={handleLogoClick}
      title="Go to Home"
      style={{ minHeight: 56 }}
    >
      <img src="/images/logo.png" alt="Historia Logo" className="h-12 w-12 object-contain drop-shadow-lg" />
      {/* TODO: Replace /images/logo.png with your real logo if needed */}
      <span className={`text-2xl font-extrabold tracking-tight ${isHomePage ? 'text-timelingo-gold' : 'text-timelingo-navy'} group-hover:text-timelingo-gold transition-colors`}>
        Historia <span className="text-base font-semibold ml-2 text-timelingo-navy/70 group-hover:text-timelingo-gold/80">Home</span>
      </span>
    </div>
  );
};

export default Logo;
