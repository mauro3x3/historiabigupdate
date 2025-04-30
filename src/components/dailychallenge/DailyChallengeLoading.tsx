
import React from 'react';

const DailyChallengeLoading = () => {
  return (
    <div className="p-8 text-center bg-white rounded-lg shadow">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 border-4 border-t-timelingo-purple border-b-timelingo-purple rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading today's challenge...</p>
        <p className="text-sm text-gray-500">Please wait while we prepare your daily knowledge test</p>
      </div>
    </div>
  );
};

export default DailyChallengeLoading;
