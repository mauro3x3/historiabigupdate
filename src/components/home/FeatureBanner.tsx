
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FeatureBannerProps {
  handleViewLessons: () => void;
  handleDailyChallenge: () => void;
}

const FeatureBanner = ({ handleViewLessons, handleDailyChallenge }: FeatureBannerProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div className="bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-xl shadow-sm border border-green-100 transition-transform hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 text-timelingo-navy">Daily History Challenge</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-green-200 p-4 rounded-full">
            <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path><path d="M16.5 9.4 7.55 4.24"></path><path d="M3.29 7 12 12l8.71-5"></path><path d="M12 22V12"></path><circle cx="18.5" cy="15.5" r="2.5"></circle><path d="M20.27 17.27 22 19"></path></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Test Your Chronological Knowledge</h3>
            <p className="text-gray-600 mb-4">Challenge yourself with our daily history chronology quiz</p>
            <Button 
              onClick={handleDailyChallenge} 
              className="bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 w-full md:w-auto"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Start Challenge
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-green-100 p-8 rounded-xl shadow-sm border border-teal-100 transition-transform hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 text-timelingo-navy">All Lessons</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-teal-200 p-4 rounded-full">
            <svg className="w-12 h-12 text-timelingo-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Browse All Lessons</h3>
            <p className="text-gray-600 mb-4">Explore our complete collection of historical lessons</p>
            <Button 
              onClick={handleViewLessons} 
              className="bg-gradient-to-r from-timelingo-teal to-green-500 hover:opacity-90 w-full md:w-auto"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              View Lessons
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureBanner;
