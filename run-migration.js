#!/usr/bin/env node

// Simple script to run the Supabase migration
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Supabase migration for user content table...');

try {
  // Check if supabase CLI is available
  execSync('supabase --version', { stdio: 'pipe' });
  
  // Run the migration
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20241220_create_user_content.sql');
  console.log(`📄 Migration file: ${migrationPath}`);
  
  // Apply the migration
  execSync('supabase db push', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Migration completed successfully!');
  console.log('🎉 User content table created and ready for shared dots!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('\n📋 Manual steps:');
  console.log('1. Open your Supabase dashboard');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy and paste the contents of supabase/migrations/20241220_create_user_content.sql');
  console.log('4. Run the SQL script');
  console.log('\n🔗 Or run: supabase db push');
}
