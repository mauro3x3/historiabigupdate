// Test script to run in browser console
// Copy and paste this into the browser console on your globe page

console.log('🧪 Testing userdots connection...');

// Test 1: Direct Supabase query
fetch('https://gnnmljvgvcsinflxvrso.supabase.co/rest/v1/userdots?select=*', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdubm1sanZndmNzaW5mbHh2cnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzk1OTIsImV4cCI6MjA1ODg1NTU5Mn0.qKdzXY6VV2AlPLPHLI4tkOv5XMgILGXa4EaHdMBo0S0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdubm1sanZndmNzaW5mbHh2cnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzk1OTIsImV4cCI6MjA1ODg1NTU5Mn0.qKdzXY6VV2AlPLPHLI4tkOv5XMgILGXa4EaHdMBo0S0'
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ Direct API call result:', data);
  console.log('📊 Number of records:', data.length);
})
.catch(error => {
  console.error('❌ Direct API call failed:', error);
});

// Test 2: Try the service function
setTimeout(async () => {
  try {
    const { getUserContent } = await import('/src/services/userContentService.ts');
    console.log('🔄 Service function imported, calling...');
    const result = await getUserContent();
    console.log('✅ Service function result:', result);
  } catch (error) {
    console.error('❌ Service function failed:', error);
  }
}, 1000);
