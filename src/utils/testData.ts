import { supabase } from '@/integrations/supabase/client';

// Function to add test streak data for leaderboard testing
export const addTestStreakData = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user logged in');
      return;
    }

    // Update current user's streak to a test value
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        streak: 15,
        xp: 2500,
        username: 'Mauro'
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return;
    }

    console.log('Test streak data added successfully!');
    console.log('User streak set to 15, XP set to 2500');
    
    // Refresh the page to see updated data
    window.location.reload();
  } catch (error) {
    console.error('Error adding test data:', error);
  }
};

// Function to add multiple test users for leaderboard
export const addTestLeaderboardData = async () => {
  try {
    // This would require creating test users, which is more complex
    // For now, just update the current user with test data
    await addTestStreakData();
  } catch (error) {
    console.error('Error adding test leaderboard data:', error);
  }
};
