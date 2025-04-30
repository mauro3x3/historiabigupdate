
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { CalendarCheck, TrendingUp, Award } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const DailyChallengesTab = () => {
  const { user } = useUser();
  
  const { data: challengeStats } = useQuery({
    queryKey: ['challengeStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const stats = {
        totalChallenges: data.length,
        correctAnswers: data.filter(d => d.correct).length,
        totalXP: data.reduce((sum, d) => sum + d.xp_earned, 0),
      };
      
      return stats;
    },
    enabled: !!user?.id
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Challenges</p>
              <h3 className="text-2xl font-bold mt-1">{challengeStats?.totalChallenges || 0}</h3>
            </div>
            <CalendarCheck className="h-8 w-8 text-purple-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Correct Answers</p>
              <h3 className="text-2xl font-bold mt-1">{challengeStats?.correctAnswers || 0}</h3>
            </div>
            <Award className="h-8 w-8 text-green-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total XP Earned</p>
              <h3 className="text-2xl font-bold mt-1">{challengeStats?.totalXP || 0}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </Card>
      </div>

      {/* History table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Challenges</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Result</th>
                <th className="px-4 py-2 text-left">XP Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* We'll fetch and display recent challenges here */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DailyChallengesTab;
