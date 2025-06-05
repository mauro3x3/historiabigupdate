import React from 'react';
import { Button } from '@/components/ui/button';

const OutOfLives = ({ returnToDashboard }: { returnToDashboard: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-yellow-50 to-purple-100">
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full border-4 border-red-200">
      <span className="text-4xl font-extrabold text-red-500 mb-2">💔 Out of Lives!</span>
      <p className="text-lg text-gray-700 mb-6 text-center">You've run out of lives for this module. Try again later or go back to the previous module to regain a life.</p>
      <Button className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-full shadow-lg font-bold tracking-wide" onClick={returnToDashboard}>
        Return to Profile
      </Button>
    </div>
  </div>
);

export default OutOfLives; 