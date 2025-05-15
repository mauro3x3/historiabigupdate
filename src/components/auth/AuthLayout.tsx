import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import Logo from '@/components/Logo'; // Hide logo for auth page

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-row bg-black font-inter auth-split">
      {/* Left: Illustration and tagline */}
      <div className="hidden md:flex flex-col justify-between items-center w-1/2 bg-black text-white p-12 relative overflow-hidden">
        {/* Background image fills the panel */}
        <img
          src="/images/avatars/4e75c56b-66fe-4089-a4a0-40fa53de4511.png"
          alt="Historia Illustration"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />
        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="flex-1 flex flex-col justify-center items-center relative z-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center tracking-widest uppercase" style={{ fontFamily: 'DM Sans, Montserrat, Poppins, Inter, sans-serif' }}>The best way to learn history.</h2>
          <p className="text-lg text-gray-200 text-center max-w-md tracking-wide" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }}>Explore the past, master the present. Join Historia and start your journey through time!</p>
        </div>
        <div className="mb-8 text-gray-500 text-sm text-center w-full relative z-20">&copy; {new Date().getFullYear()} Historia</div>
      </div>
      {/* Right: Auth card */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen bg-gradient-to-br from-[#f7f7fa] to-[#e9e9f3]">
        <div className="w-full max-w-md mx-auto flex flex-col items-center bg-white/95 shadow-2xl rounded-2xl p-10">
          {/* Add Log In heading above the form, only for login */}
          <h1 className="text-2xl font-bold text-center text-black tracking-widest uppercase mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Log In
          </h1>
          {children}
          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our <a href="#" className="underline hover:text-black">Terms of Service</a> & <a href="#" className="underline hover:text-black">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
