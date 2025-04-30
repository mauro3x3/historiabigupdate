
import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 flex flex-col">
      <header className="py-6 px-4 container mx-auto">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">🧭</div>
          <h1 className="text-4xl font-bold mb-4 text-timelingo-navy">404 - Lost in History</h1>
          <p className="text-xl text-gray-600 mb-8">
            This historical page doesn't exist yet. Let's get you back to your timeline.
          </p>
          <Button 
            size="lg" 
            className="bg-timelingo-purple hover:bg-purple-700"
            onClick={() => window.location.href = '/'}
          >
            Return to Present Day
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
