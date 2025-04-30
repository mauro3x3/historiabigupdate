
import React from 'react';

interface StreakBadgeProps {
  streak: number;
}

const StreakBadge = ({ streak }: StreakBadgeProps) => {
  // Determine badge color and text based on streak length
  const getBadgeInfo = () => {
    if (streak >= 30) return { title: 'Legendary', color: 'from-purple-600 to-indigo-600' };
    if (streak >= 14) return { title: 'Dedicated', color: 'from-red-500 to-orange-500' };
    if (streak >= 7) return { title: 'Consistent', color: 'from-timelingo-teal to-emerald-400' };
    return { title: 'Starting', color: 'from-timelingo-teal to-emerald-400' };
  };
  
  const { title, color } = getBadgeInfo();

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
        <span>🔥</span>
        <span>{streak} day{streak !== 1 ? 's' : ''}</span>
      </div>
      <span className="text-xs mt-1 font-medium">{title}</span>
    </div>
  );
};

export default StreakBadge;
