
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, Map } from 'lucide-react';
import Logo from '@/components/Logo';

const MapNavigation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-timelingo-navy to-purple-800 text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/map-games')}
          >
            <Map size={18} className="mr-2" />
            Map Games
          </Button>
          
          <Button 
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/home')}
          >
            <Home size={18} className="mr-2" />
            Home
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            onClick={() => navigate('/profile')}
          >
            <User size={18} className="mr-2" />
            My Profile
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MapNavigation;
