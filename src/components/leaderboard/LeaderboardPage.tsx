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
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import UserAvatar from '@/components/ui/UserAvatar';

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="gap-2 mb-8 text-timelingo-purple hover:text-timelingo-navy hover:bg-purple-50"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-5xl font-extrabold text-timelingo-navy mb-3">🏆 Leaderboard</h1>
              <p className="text-gray-600 text-xl">Compete with the best historians!</p>
            </div>
            
            <div className="flex-shrink-0">
              <Tabs 
                defaultValue="xp" 
                value={leaderboardType}
                onValueChange={(value) => setLeaderboardType(value as 'xp' | 'streak')}
                className="w-[320px]"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-timelingo-gold/20 h-12">
                  <TabsTrigger 
                    value="xp" 
                    className="flex items-center gap-2 data-[state=active]:bg-timelingo-gold data-[state=active]:text-white text-base font-semibold"
                  >
                    <Award size={18} /> XP
                  </TabsTrigger>
                  <TabsTrigger 
                    value="streak" 
                    className="flex items-center gap-2 data-[state=active]:bg-timelingo-gold data-[state=active]:text-white text-base font-semibold"
                  >
                    <Clock size={18} /> Streak
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {podium.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-16">
            {podium.map((rank, idx) => (
              <div key={rank.id} className={`flex flex-col items-center p-8 rounded-3xl shadow-2xl bg-white border-4 ${idx === 0 ? 'from-yellow-100 to-amber-50 border-timelingo-gold scale-105 z-10' : idx === 1 ? 'from-gray-50 to-gray-100 border-gray-300' : 'from-amber-50 to-yellow-100 border-amber-600'} w-full sm:w-[220px] relative`}>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <UserAvatar
                  avatarBase={rank.avatarBase}
                  avatarAccessories={rank.avatarAccessories}
                  username={rank.username}
                  size="lg"
                  showBorder={true}
                  className="mb-6"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="font-bold text-timelingo-navy hover:text-timelingo-purple hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-2 text-2xl transition-colors mb-4"
                      onClick={() => navigate(`/profile/${rank.id}`)}
                      tabIndex={0}
                      aria-label={`View ${rank.username}'s profile`}
                    >
                      {rank.username}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">View profile</TooltipContent>
                </Tooltip>
                <div className="flex gap-2 items-center text-timelingo-navy font-bold text-2xl">
                  {leaderboardType === 'xp' ? (
                    <>
                      <Sparkles className="h-7 w-7 text-timelingo-gold" /> {rank.xp} XP
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">🔥</span> {rank.streak} days
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rankings table */}
        <Card className="bg-white shadow-xl border-2 border-timelingo-gold/20 overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-timelingo-navy/5 to-timelingo-purple/5">
            <CardTitle className="flex items-center gap-3 text-timelingo-navy text-3xl mb-2">
              <Users size={28} />
              {leaderboardType === 'xp' ? 'Experience Leaderboard' : 'Streak Leaderboard'}
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
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
                    <TableHead className="w-24 text-left pl-8 text-timelingo-navy font-bold text-lg py-4">Rank</TableHead>
                    <TableHead className="text-left text-timelingo-navy font-bold text-lg py-4">User</TableHead>
                    <TableHead className="text-right pr-8 text-timelingo-navy font-bold text-lg py-4">{leaderboardType === 'xp' ? 'XP' : 'Streak'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {others.length > 0 ? (
                    others.map((rank, index) => (
                      <TableRow 
                        key={rank.id} 
                        className={`transition-all cursor-pointer group border-b border-gray-100 ${user?.id === rank.id ? 'bg-timelingo-gold/10 border-l-4 border-l-timelingo-gold' : 'hover:bg-gray-50'} text-lg`}
                      >
                        <TableCell className="font-bold text-gray-700 pl-8 py-4">#{index + 4}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <UserAvatar
                              avatarBase={rank.avatarBase}
                              avatarAccessories={rank.avatarAccessories}
                              username={rank.username}
                              size="md"
                              className="border-2 border-timelingo-purple/20"
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="font-semibold text-timelingo-navy group-hover:text-timelingo-purple hover:underline focus:outline-none focus:ring-2 focus:ring-timelingo-gold rounded px-2 transition-colors text-lg"
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
                        <TableCell className="text-right font-bold pr-8 py-4">
                          {leaderboardType === 'xp' ? (
                            <span className="text-timelingo-gold text-xl">{rank.xp} XP</span>
                          ) : (
                            <span className="text-orange-600 text-xl">{rank.streak} days</span>
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
