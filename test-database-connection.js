// Test database connection and check userdots table
// Run with: node test-database-connection.js

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

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('userdots')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${data.length} records in userdots table:`);
    
    data.forEach((record, index) => {
      console.log(`${index + 1}. ${record.title}`);
      console.log(`   Category: ${record.category}`);
      console.log(`   Coordinates: [${record.coordinates[0]}, ${record.coordinates[1]}]`);
      console.log(`   User ID: ${record.user_id}`);
      console.log(`   Public: ${record.is_public}, Approved: ${record.is_approved}`);
      console.log('');
    });
    
    // Test inserting a test record
    console.log('🧪 Testing insert with null user_id...');
    const testData = {
      user_id: null,
      title: 'Test News Article',
      description: 'This is a test article to verify database insertion',
      category: 'News Event',
      coordinates: [-77.0369, 38.9072], // Washington DC
      author: 'Test System',
      date_happened: new Date().toLocaleDateString('en-GB'),
      source: 'Test Source',
      is_approved: true,
      is_public: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('userdots')
      .insert(testData)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      console.log('💡 This might be due to Row Level Security policies.');
      console.log('💡 Run the setup-news-policy.sql script in your Supabase SQL editor.');
    } else {
      console.log('✅ Insert test successful!');
      console.log('📝 Inserted record:', insertData);
      
      // Clean up test record
      await supabase
        .from('userdots')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test record cleaned up.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseConnection();
