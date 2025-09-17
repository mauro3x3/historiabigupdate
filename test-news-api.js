// Test script to verify news API is working
// Run with: node test-news-api.js

const NEWS_API_KEY = 'c8e585058c0a419a934dac762d26b68f';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

async function testNewsAPI() {
  try {
    console.log('🔍 Testing NewsAPI connection...');
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NewsAPI request failed:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    if (data.status !== 'ok') {
      console.error('❌ NewsAPI error:', data.message);
      return false;
    }

    console.log('✅ NewsAPI connection successful!');
    console.log(`📰 Found ${data.articles.length} articles:`);
    
    data.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log(`   URL: ${article.url}`);
      console.log('');
    });

    return true;

  } catch (error) {
    console.error('❌ NewsAPI test failed:', error);
    return false;
  }
}

// Test RSS fallback
async function testRSSFallback() {
  try {
    console.log('🔍 Testing RSS fallback...');
    
    const feedUrl = 'https://feeds.bbci.co.uk/news/rss.xml';
    const rssResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
    
    if (!rssResponse.ok) {
      console.error('❌ RSS response not ok:', rssResponse.status);
      return false;
    }
    
    const rssData = await rssResponse.json();
    console.log('📊 RSS data:', JSON.stringify(rssData, null, 2));
    
    if (rssData.items && Array.isArray(rssData.items)) {
      console.log(`✅ RSS fallback successful! Found ${rssData.items.length} items`);
      return true;
    } else {
      console.error('❌ RSS data format unexpected');
      return false;
    }
    
  } catch (error) {
    console.error('❌ RSS fallback test failed:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting news API tests...\n');
  
  const newsApiSuccess = await testNewsAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const rssSuccess = await testRSSFallback();
  console.log('\n' + '='.repeat(50) + '\n');
  
  if (newsApiSuccess || rssSuccess) {
    console.log('✅ At least one news source is working!');
  } else {
    console.log('❌ Both news sources failed!');
  }
}

runTests();
