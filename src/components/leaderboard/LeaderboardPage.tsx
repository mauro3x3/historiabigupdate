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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="gap-2 mb-6 text-timelingo-purple hover:text-timelingo-navy hover:bg-purple-50"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-timelingo-navy mb-2">🏆 Leaderboard</h1>
              <p className="text-gray-600 text-lg">Compete with the best historians!</p>
            </div>
            <Tabs 
              defaultValue="xp" 
              value={leaderboardType}
              onValueChange={(value) => setLeaderboardType(value as 'xp' | 'streak')}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-timelingo-gold/20">
                <TabsTrigger 
                  value="xp" 
                  className="flex items-center gap-2 data-[state=active]:bg-timelingo-gold data-[state=active]:text-white"
                >
                  <Award size={16} /> XP
                </TabsTrigger>
                <TabsTrigger 
                  value="streak" 
                  className="flex items-center gap-2 data-[state=active]:bg-timelingo-gold data-[state=active]:text-white"
                >
                  <Clock size={16} /> Streak
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {podium.length > 0 && (
          <div className="flex justify-center gap-6 mb-10">
            {podium.map((rank, idx) => (
              <div key={rank.id} className={`flex flex-col items-center p-6 rounded-3xl shadow-2xl bg-white border-4 ${idx === 0 ? 'from-yellow-100 to-amber-50 border-timelingo-gold scale-110 z-10' : idx === 1 ? 'from-gray-50 to-gray-100 border-gray-300' : 'from-amber-50 to-yellow-100 border-amber-600'} min-w-[180px] relative`}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <Avatar className="h-20 w-20 border-4 border-white mb-4 shadow-lg">
                  <AvatarFallback className="bg-timelingo-purple text-white text-3xl font-bold">{rank.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="font-bold text-timelingo-navy hover:text-timelingo-purple hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-2 text-xl transition-colors"
                      onClick={() => navigate(`/profile/${rank.id}`)}
                      tabIndex={0}
                      aria-label={`View ${rank.username}'s profile`}
                    >
                      {rank.username}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">View profile</TooltipContent>
                </Tooltip>
                <div className="flex gap-2 items-center mt-3 text-timelingo-navy font-bold text-xl">
                  {leaderboardType === 'xp' ? (
                    <>
                      <Sparkles className="h-6 w-6 text-timelingo-gold" /> {rank.xp} XP
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🔥</span> {rank.streak} days
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rankings table */}
        <Card className="bg-white shadow-xl border-2 border-timelingo-gold/20">
          <CardHeader className="pb-4 bg-gradient-to-r from-timelingo-navy/5 to-timelingo-purple/5">
            <CardTitle className="flex items-center gap-3 text-timelingo-navy text-2xl">
              <Users size={24} />
              {leaderboardType === 'xp' ? 'Experience Leaderboard' : 'Streak Leaderboard'}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {leaderboardType === 'xp' 
                ? "Learn, earn XP, and climb the ranks" 
                : "Maintain your daily streak to top the charts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-20 text-left pl-6 text-timelingo-navy font-bold">Rank</TableHead>
                    <TableHead className="text-left text-timelingo-navy font-bold">User</TableHead>
                    <TableHead className="text-right pr-6 text-timelingo-navy font-bold">{leaderboardType === 'xp' ? 'XP' : 'Streak'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {others.length > 0 ? (
                    others.map((rank, index) => (
                      <TableRow 
                        key={rank.id} 
                        className={`transition-all cursor-pointer group border-b border-gray-100 ${user?.id === rank.id ? 'bg-timelingo-gold/10 border-l-4 border-l-timelingo-gold' : 'hover:bg-gray-50'} text-base`}
                      >
                        <TableCell className="font-bold text-gray-700 pl-6">#{index + 4}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-timelingo-purple/20">
                              <AvatarFallback className="bg-timelingo-purple text-white font-semibold">
                                {rank.username?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="font-semibold text-timelingo-navy group-hover:text-timelingo-purple hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-1 transition-colors"
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
                        <TableCell className="text-right font-bold pr-6">
                          {leaderboardType === 'xp' ? (
                            <span className="text-timelingo-gold text-lg">{rank.xp} XP</span>
                          ) : (
                            <span className="text-orange-600 text-lg">{rank.streak} days</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={48} className="text-gray-300" />
                          <p className="text-lg">No users found. Be the first to earn points!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
