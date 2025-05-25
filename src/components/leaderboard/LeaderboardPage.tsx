import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, ArrowUpRight, Clock, ArrowLeft, Info, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from '@/contexts/UserContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import XpBadge from '@/components/XpBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function LeaderboardPage({ initialType = 'xp' }: { initialType?: 'xp' | 'streak' }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [leaderboardType, setLeaderboardType] = useState<'xp' | 'streak'>(initialType);
  const { rankings, userRanking, isLoading, error } = useLeaderboard(leaderboardType);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    console.log("Leaderboard component mounted");
    console.log("Current user ID:", user?.id);
    console.log("Rankings data:", rankings);
    console.log("User ranking:", userRanking);
    
    // Mark data as loaded after initial render
    if (!isLoading) {
      setDataLoaded(true);
    }
  }, [rankings, userRanking, isLoading, user]);

  // Helper: Top 3 podium
  const podium = rankings.slice(0, 3);
  const others = rankings.slice(3);

  return (
    <div className="container mx-auto px-2 py-8 max-w-5xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="gap-2 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-timelingo-gold drop-shadow">🏆 Leaderboard</h1>
            <p className="text-gray-200">Compete with the best historians!</p>
          </div>
          <Tabs 
            defaultValue="xp" 
            value={leaderboardType}
            onValueChange={(value) => setLeaderboardType(value as 'xp' | 'streak')}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="xp" className="flex items-center gap-2">
                <Award size={16} /> XP
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Clock size={16} /> Streak
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {/* Podium for Top 3 */}
      {podium.length > 0 && (
        <div className="flex justify-center gap-6 mb-8">
          {podium.map((rank, idx) => (
            <div key={rank.id} className={`flex flex-col items-center p-4 rounded-2xl shadow-xl bg-gradient-to-br ${idx === 0 ? 'from-yellow-300 to-amber-400 scale-110 z-10' : idx === 1 ? 'from-gray-200 to-gray-400' : 'from-amber-700 to-yellow-400'} border-4 ${idx === 0 ? 'border-timelingo-gold' : idx === 1 ? 'border-gray-300' : 'border-amber-700'} min-w-[160px] relative`}>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
              <Avatar className="h-16 w-16 border-2 border-white mb-2">
                <AvatarFallback className="bg-timelingo-purple text-white text-2xl">{rank.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="font-bold text-timelingo-purple hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-1 text-lg"
                    onClick={() => navigate(`/profile/${rank.id}`)}
                    tabIndex={0}
                    aria-label={`View ${rank.username}'s profile`}
                  >
                    {rank.username}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">View profile</TooltipContent>
              </Tooltip>
              <div className="flex gap-1 items-center mt-1 text-yellow-900 font-bold text-lg">
                {leaderboardType === 'xp' ? (
                  <>
                    <Sparkles className="h-5 w-5 text-yellow-500" /> {rank.xp} XP
                  </>
                ) : (
                  <>
                    <span className="text-orange-500">🔥</span> {rank.streak} days
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Rankings table */}
      <Card className="bg-white/10 backdrop-blur-xl border-timelingo-gold/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-timelingo-gold">
            <Users size={20} />
            {leaderboardType === 'xp' ? 'Experience Leaderboard' : 'Streak Leaderboard'}
          </CardTitle>
          <CardDescription className="text-white/80">
            {leaderboardType === 'xp' 
              ? "Learn, earn XP, and climb the ranks" 
              : "Maintain your daily streak to top the charts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">{leaderboardType === 'xp' ? 'XP' : 'Streak'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {others.length > 0 ? (
                  others.map((rank, index) => (
                    <TableRow 
                      key={rank.id} 
                      className={`transition-colors cursor-pointer group ${user?.id === rank.id ? 'bg-amber-50' : 'hover:bg-yellow-100/60'} text-base`}
                    >
                      <TableCell className="font-medium">#{index + 4}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-timelingo-purple/80 text-white">
                              {rank.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="font-bold text-timelingo-purple group-hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-1"
                                onClick={() => navigate(`/profile/${rank.id}`)}
                                tabIndex={0}
                                aria-label={`View ${rank.username}'s profile`}
                              >
                                {rank.username}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">View profile</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {leaderboardType === 'xp' ? (
                          <span className="text-timelingo-gold">{rank.xp} XP</span>
                        ) : (
                          <span className="text-orange-500">{rank.streak} days</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No users found. Be the first to earn points!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
