
import React from 'react';

interface XpBadgeProps {
  xp: number;
}

const XpBadge = ({ xp }: XpBadgeProps) => {
  // Determine badge color and text based on XP amount
  const getBadgeInfo = () => {
    if (xp >= 1000) return { title: 'Expert', color: 'from-amber-500 to-yellow-300' };
    if (xp >= 500) return { title: 'Advanced', color: 'from-blue-500 to-cyan-400' };
    if (xp >= 100) return { title: 'Intermediate', color: 'from-green-500 to-emerald-400' };
    return { title: 'Beginner', color: 'from-timelingo-gold to-amber-400' };
  };
  
  const { title, color } = getBadgeInfo();

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
        <span className="text-yellow-100">⚡</span>
        <span>{xp} XP</span>
      </div>
      <span className="text-xs mt-1 font-medium">{title}</span>
    </div>
  );
};

export default XpBadge;
