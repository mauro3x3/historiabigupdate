
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, ArrowUpRight, Clock, ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from '@/contexts/UserContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import XpBadge from '@/components/XpBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [leaderboardType, setLeaderboardType] = useState<'xp' | 'streak'>('xp');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600">See how you rank against other historians!</p>
          </div>
          
          <Tabs 
            defaultValue="xp" 
            value={leaderboardType}
            onValueChange={(value) => setLeaderboardType(value as 'xp' | 'streak')}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="xp" className="flex items-center gap-2">
                <Award size={16} />
                Experience
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Clock size={16} />
                Streak
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Error loading leaderboard data: {error.toString()}
          </AlertDescription>
        </Alert>
      )}
      
      {dataLoaded && rankings.length === 0 && !isLoading && !error && (
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No users found on the leaderboard. The issue might be with database permissions or the data hasn't been populated yet.
          </AlertDescription>
        </Alert>
      )}
      
      {userRanking && (
        <Card className="mb-8 border-2 border-timelingo-gold bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Your Ranking</CardTitle>
            <CardDescription>
              {leaderboardType === 'xp' 
                ? "Your position based on total experience points" 
                : "Your position based on current streak"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-timelingo-gold/20 text-timelingo-gold font-bold text-xl">
                  #{userRanking.rank}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback className="bg-timelingo-purple text-white">
                      {userRanking.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{userRanking.username || 'You'}</div>
                    <div className="text-sm text-gray-500">{userRanking.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {leaderboardType === 'xp' ? (
                  <XpBadge xp={userRanking.xp} />
                ) : (
                  <div className="flex gap-1 items-center bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <span>🔥 {userRanking.streak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Rankings table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            {leaderboardType === 'xp' ? 'Experience Leaderboard' : 'Streak Leaderboard'}
          </CardTitle>
          <CardDescription>
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
                  <TableHead className="text-right">
                    {leaderboardType === 'xp' ? 'XP' : 'Streak'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.length > 0 ? (
                  rankings.map((rank, index) => (
                    <TableRow 
                      key={rank.id} 
                      className={user?.id === rank.id ? "bg-amber-50" : undefined}
                    >
                      <TableCell className="font-medium">
                        {index === 0 && <Badge variant="default" className="bg-timelingo-gold">🏆 #{index + 1}</Badge>}
                        {index === 1 && <Badge variant="secondary" className="bg-gray-300">🥈 #{index + 1}</Badge>}
                        {index === 2 && <Badge variant="secondary" className="bg-amber-700 text-white">🥉 #{index + 1}</Badge>}
                        {index > 2 && <span>#{index + 1}</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-timelingo-purple/80 text-white">
                              {rank.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{rank.username}</div>
                            {rank.completedEras.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {rank.completedEras.length} {rank.completedEras.length === 1 ? 'era' : 'eras'} completed
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {leaderboardType === 'xp' ? (
                          <div className="flex items-center justify-end gap-1 font-semibold text-timelingo-gold">
                            {rank.xp} <span className="text-xs">XP</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1 font-semibold text-orange-500">
                            {rank.streak} <span className="text-xs">days</span>
                          </div>
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
