import { supabase } from './client';

export async function unlockAchievement(userId: string, achievementId: string) {
  if (!userId || !achievementId) return;
  // Check if already unlocked
  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single();
  if (!data) {
    await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: achievementId,
      date_earned: new Date().toISOString(),
    });
  }
} 