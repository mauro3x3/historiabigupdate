// Test adding a single news article to the database
// This will help us debug the coordinate and display issue

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

if (supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
  console.log('❌ Please set your Supabase credentials in environment variables:');
  console.log('   VITE_SUPABASE_URL=your-supabase-url');
  console.log('   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSingleNewsArticle() {
  try {
    console.log('🧪 Testing single news article insertion...');
    
    // Test with known coordinates (Washington DC)
    const testArticle = {
      user_id: null,
      title: 'Test News Article - Washington DC',
      description: 'This is a test article to verify coordinate display on the globe',
      category: 'News Event',
      coordinates: [-77.0369, 38.9072], // Washington DC [lng, lat]
      author: 'Test System',
      date_happened: new Date().toLocaleDateString('en-GB'),
      source: 'Test Source',
      is_approved: true,
      is_public: true
    };
    
    console.log('📍 Test article data:', testArticle);
    console.log('📍 Coordinates format: [longitude, latitude] = [-77.0369, 38.9072]');
    
    // Insert into database
    const { data, error } = await supabase
      .from('userdots')
      .insert(testArticle)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert failed:', error);
      console.log('💡 This might be due to Row Level Security policies.');
      console.log('💡 Make sure you ran the setup-news-policy.sql script.');
      return;
    }
    
    console.log('✅ Test article inserted successfully!');
    console.log('📝 Inserted record:', data);
    
    // Verify the data was stored correctly
    const { data: verifyData, error: verifyError } = await supabase
      .from('userdots')
      .select('*')
      .eq('id', data.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('✅ Verification successful!');
      console.log('📊 Stored data:', verifyData);
      console.log('📍 Stored coordinates:', verifyData.coordinates);
      console.log('📍 Coordinate type:', typeof verifyData.coordinates);
      console.log('📍 Is array:', Array.isArray(verifyData.coordinates));
    }
    
    // Clean up test record
    console.log('🧹 Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('userdots')
      .delete()
      .eq('id', data.id);
    
    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
    } else {
      console.log('✅ Test record cleaned up successfully!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSingleNewsArticle();
