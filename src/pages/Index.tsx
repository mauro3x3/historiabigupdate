import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Automatically import all background images in /public/images/ that start with 'background'
const imageModules = import.meta.glob('/public/images/background*', { eager: true, as: 'url' });
const backgroundImages = Object.values(imageModules);

const LandingPage = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * backgroundImages.length));

  // Change background every hour (3600000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => {
        let next = Math.floor(Math.random() * backgroundImages.length);
        // Ensure a different image
        while (next === prev && backgroundImages.length > 1) {
          next = Math.floor(Math.random() * backgroundImages.length);
        }
        return next;
      });
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: backgroundImages.length > 0
          ? `url(${backgroundImages[bgIndex]}) center center / cover no-repeat, linear-gradient(135deg, #f3e8ff 0%, #fef9c3 100%)`
          : 'linear-gradient(135deg, #f3e8ff 0%, #fef9c3 100%)',
        transition: 'background-image 0.2s',
      }}
    >
      {/* Soft background shapes (optional, can be removed if you want only the image) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-100 via-yellow-50 to-purple-100 rounded-full opacity-40 blur-2xl animate-float-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-gradient-to-tr from-blue-100 via-purple-100 to-yellow-50 rounded-full opacity-30 blur-2xl animate-float-slower" />
        <div className="absolute top-1/2 left-[-120px] w-[200px] h-[200px] bg-gradient-to-br from-purple-100 to-blue-50 rounded-full opacity-20 blur-2xl animate-float-medium" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-yellow-50/30 to-blue-50/40 animate-gradient-move" style={{ zIndex: 1, pointerEvents: 'none', mixBlendMode: 'lighten' }} />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Centered CTA box, lower on the page, with semi-transparent background */}
        <div className="w-full flex justify-center items-end min-h-[60vh]">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-6 max-w-lg mb-16 border-2 border-purple-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-timelingo-navy text-center">
              The free, fun, and effective way to learn history!
            </h1>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button
                className="bg-timelingo-purple hover:bg-yellow-400 text-white text-lg font-bold rounded-full py-3 shadow-lg"
                onClick={() => navigate('/onboarding')}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="text-timelingo-purple text-lg font-bold rounded-full py-3 border-2 border-timelingo-purple bg-white hover:bg-purple-50 shadow"
                onClick={() => navigate('/auth?tab=login')}
              >
                I Already Have an Account
              </Button>
            </div>
          </div>
        </div>
      </main>
      <div className="absolute top-6 left-8 z-20">
        {/* Cinzel font: Add <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet"> to your index.html */}
        <span
          className="text-3xl font-extrabold tracking-widest drop-shadow-lg select-none"
          style={{ fontFamily: "'Cinzel', serif", color: '#7c3aed' }}
        >
          HISTORIA
        </span>
      </div>
      {/* Discord link top right */}
      <div className="absolute top-6 right-8 z-20">
        <a
          href="https://discord.gg/WPFKEJsP"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-colors duration-200 text-lg"
        >
          Join Our Discord
        </a>
      </div>
      <style>{`
        @keyframes bounce { 0%{transform:translateY(0);} 50%{transform:translateY(-30px);} 100%{transform:translateY(0);} }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
        @keyframes float-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-18px);} }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        @keyframes float-slower { 0%,100%{transform:translateY(0);} 50%{transform:translateY(24px);} }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        @keyframes float-medium { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        .animate-float-medium { animation: float-medium 9s ease-in-out infinite; }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
