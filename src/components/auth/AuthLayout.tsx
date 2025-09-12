import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Logo from '@/components/Logo'; // Hide logo for auth page

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-inter relative">
      {/* Logo in top left */}
      <a
        href="/"
        className="absolute top-8 left-8 z-20 transition-transform duration-200 hover:scale-105"
        style={{ display: 'inline-block' }}
      >
        <img
          src="/images/rainbowjohan (2).png"
          alt="Historia Logo"
          className="w-20 h-20 object-contain drop-shadow"
        />
      </a>
      <div className="w-full max-w-md mx-auto px-10 py-12 bg-white rounded-2xl shadow-none flex flex-col items-center">
        {/* Remove the heading here, let LoginForm provide it */}
        {children}
        <p className="text-xs text-gray-300 mt-8 text-center font-normal">
          By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> & <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
