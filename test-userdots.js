// Simple test script to check if userdots data is being loaded correctly
// Run this in the browser console on your globe page

console.log('🧪 Testing userdots data loading...');

// Test the getUserContent function
import('@/services/userContentService').then(async (service) => {
  try {
    console.log('📡 Fetching user content from database...');
    const content = await service.getUserContent();
    console.log('✅ User content loaded:', content);
    console.log('📊 Number of dots:', content.length);
    
    content.forEach((dot, index) => {
      console.log(`📍 Dot ${index + 1}:`, {
        title: dot.title,
        coordinates: dot.coordinates,
        category: dot.category,
        author: dot.author
      });
    });
  } catch (error) {
    console.error('❌ Error loading user content:', error);
  }
});

// Also test direct Supabase query
import('@/integrations/supabase/client').then(async (supabase) => {
  try {
    console.log('🔍 Direct Supabase query...');
    const { data, error } = await supabase.client
      .from('userdots')
      .select('*')
      .eq('is_public', true)
      .eq('is_approved', true);
    
    if (error) {
      console.error('❌ Supabase error:', error);
    } else {
      console.log('✅ Direct Supabase data:', data);
    }
  } catch (error) {
    console.error('❌ Supabase import error:', error);
  }
});
