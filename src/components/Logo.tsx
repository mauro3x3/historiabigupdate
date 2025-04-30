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
    <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
      <img src="/images/logo.png" alt="Historia Logo" className="h-10 w-10 object-contain drop-shadow-lg" />
      {/* TODO: Replace /images/logo.png with your real logo if needed */}
      <span className={`text-xl font-bold ${isHomePage ? 'text-white' : 'text-timelingo-navy'}`}>
        Historia
      </span>
    </div>
  );
};

export default Logo;
