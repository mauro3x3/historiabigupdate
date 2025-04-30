import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-yellow-50 relative overflow-x-hidden">
      <div className="w-full max-w-md mx-auto pt-12 px-4 flex flex-col items-center">
        {/* Mascot */}
        <img src="/images/avatars/goldfish_3.png" alt="Historia Mascot" className="w-24 h-24 object-contain drop-shadow-lg mb-2 animate-bounce-slow" />
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        {/* Tagline */}
        <div className="text-timelingo-purple text-lg font-semibold mb-4 text-center">The fun, interactive way to learn history!</div>
        {/* Card */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 w-full flex flex-col items-center border-2 border-purple-100">
          <h1 className="text-3xl font-extrabold text-center text-timelingo-purple mb-6">Welcome to Historia</h1>
          {children}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <p>
              <a href="#" className="text-timelingo-purple hover:underline">Terms of Service</a>
              {' & '}
              <a href="#" className="text-timelingo-purple hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}> 
            Back to Home
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes bounce { 0%{transform:translateY(0);} 50%{transform:translateY(-30px);} 100%{transform:translateY(0);} }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  );
};

export default AuthLayout;
