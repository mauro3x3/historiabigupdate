
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

interface HomeHeaderProps {
  user: any;
  handleToDashboard: () => void;
}

const HomeHeader = ({ user, handleToDashboard }: HomeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-timelingo-purple to-purple-700 text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          {user ? (
            <Button 
              variant="secondary" 
              className="flex items-center gap-2 bg-white text-timelingo-purple hover:bg-gray-100"
              onClick={handleToDashboard}
            >
              My Profile
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-white text-timelingo-purple hover:bg-gray-100"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
