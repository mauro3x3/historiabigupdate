
import React from 'react';

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-t-timelingo-purple border-b-timelingo-purple rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your learning journey...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
