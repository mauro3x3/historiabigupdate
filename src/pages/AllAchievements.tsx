import React from 'react';
import AchievementsSection from '../components/dashboard/sections/AchievementsSection';
import { useNavigate } from 'react-router-dom';

const AllAchievements: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 w-full bg-white/90 border-b border-gray-200 flex items-center px-4 py-4 shadow-sm">
        <button
          onClick={handleBack}
          className="mr-4 px-4 py-2 rounded-lg bg-timelingo-purple text-white font-semibold hover:bg-timelingo-gold hover:text-timelingo-navy transition-colors shadow"
        >
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-timelingo-purple text-center w-full">All Achievements</h1>
      </header>
      <main className="flex flex-col items-center w-full flex-1 py-8">
        <div className="w-full max-w-5xl">
          <AchievementsSection />
        </div>
      </main>
    </div>
  );
};

export default AllAchievements; 