import React from "react";
import XpBadge from "@/components/XpBadge";
import StreakBadge from "@/components/StreakBadge";
import { Medal, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LeaderboardPage from "@/components/leaderboard/LeaderboardPage";

interface UserStatsBarProps {
  xp: number;
  streak: number;
  completedEras: string[];
}

const UserStatsBar: React.FC<UserStatsBarProps> = ({ xp, streak, completedEras }) => {
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [leaderboardType, setLeaderboardType] = React.useState<'xp' | 'streak'>('xp');

  const openLeaderboard = (type: 'xp' | 'streak') => {
    setLeaderboardType(type);
    setShowLeaderboard(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-timelingo-navy to-purple-900 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6 w-full sm:w-auto">
          <div 
            className="flex flex-col items-center bg-white/10 rounded-lg py-3 px-6 cursor-pointer hover:bg-white/15 transition-colors group"
            onClick={() => openLeaderboard('xp')}
          >
            <span className="text-xs text-gray-300 flex items-center gap-1">
              Experience 
              <TrendingUp size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-timelingo-gold">⚡</span>
              <span className="text-2xl font-bold">{xp}</span>
            </div>
            <span className="text-xs text-gray-300 mt-1">total XP</span>
          </div>
          <div 
            className="flex flex-col items-center bg-white/10 rounded-lg py-3 px-6 cursor-pointer hover:bg-white/15 transition-colors group"
            onClick={() => openLeaderboard('streak')}
          >
            <span className="text-xs text-gray-300 flex items-center gap-1">
              Streak
              <TrendingUp size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-timelingo-teal">🔥</span>
              <span className="text-2xl font-bold">{streak}</span>
            </div>
            <span className="text-xs text-gray-300 mt-1">day streak</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 rounded-lg py-3 px-6">
            <span className="text-xs text-gray-300">Completed Eras</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-timelingo-gold"><Medal size={24} /></span>
              <span className="text-2xl font-bold">{completedEras.length}</span>
            </div>
            <span className="text-xs text-gray-300 mt-1">total eras</span>
          </div>
        </div>
        <div className="flex gap-4 items-center w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex flex-wrap gap-4">
            <XpBadge xp={xp} />
            <StreakBadge streak={streak} />
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
            onClick={() => openLeaderboard('xp')}
          >
            <Award className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
        </div>
      </div>
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-3xl w-full">
          <LeaderboardPage initialType={leaderboardType} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserStatsBar;
