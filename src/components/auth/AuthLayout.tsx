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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-[#f3e8ff] via-[#fef9c3] to-[#e0e7ff]">
      {/* Immersive animated background shapes */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-gradient-to-br from-yellow-200 via-yellow-50 to-purple-200 rounded-full opacity-50 blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-160px] right-[-160px] w-[500px] h-[500px] bg-gradient-to-tr from-blue-200 via-purple-100 to-yellow-100 rounded-full opacity-40 blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-[-180px] w-[300px] h-[300px] bg-gradient-to-br from-purple-200 to-blue-100 rounded-full opacity-30 blur-2xl animate-float-medium" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-yellow-50/40 to-blue-50/60 animate-gradient-move" style={{ zIndex: 1, pointerEvents: 'none', mixBlendMode: 'lighten' }} />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/background-pattern.svg')] opacity-10 mix-blend-overlay" />
      </div>
      {/* Big Johan mascot and greeting for large screens */}
      <div className="hidden lg:block absolute right-32 top-1/2 -translate-y-1/2 z-10">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-8 bg-gradient-to-br from-yellow-100 via-purple-100 to-blue-100 rounded-full blur-2xl opacity-60 w-[480px] h-[480px]" />
          <img src="/images/avatars/Johan.png" alt="Johan greets you!" className="w-[340px] h-[340px] object-contain drop-shadow-2xl relative z-10 animate-bounce-slow" />
          <div className="mt-6 text-5xl font-extrabold text-timelingo-purple drop-shadow-lg text-center relative z-10">
            Welcome, future historian!
          </div>
          <div className="text-2xl text-timelingo-navy font-medium mt-3 relative z-10 text-center">
            Johan is excited to see you learn today!
          </div>
        </div>
      </div>
      <div className="w-full max-w-xl mx-auto pt-20 px-4 flex flex-col items-center z-20">
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-14 w-full flex flex-col items-center border-2 border-purple-200 border-opacity-40 transition-all duration-300 hover:shadow-3xl mt-2 mb-8">
          <div className="w-full flex flex-col items-center mb-8">
            <h1 className="text-5xl font-extrabold text-center text-timelingo-purple mb-2 drop-shadow">Welcome to Historia</h1>
            <div className="text-2xl text-timelingo-navy font-medium text-center">Sign in or create an account to start your journey!</div>
          </div>
          <div className="w-full">{children}</div>
          <div className="mt-10 text-center text-base text-gray-500">
            <p>By continuing, you agree to our</p>
            <p>
              <a href="#" className="text-timelingo-purple hover:underline">Terms of Service</a>
              {' & '}
              <a href="#" className="text-timelingo-purple hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
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

export default AuthLayout;
