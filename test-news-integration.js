// Simple test script to verify news integration
// Run with: node test-news-integration.js

const NEWS_API_KEY = 'c8e585058c0a419a934dac762d26b68f';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

async function testNewsAPI() {
  try {
    console.log('Testing NewsAPI connection...');
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message}`);
    }

    console.log('✅ NewsAPI connection successful!');
    console.log(`Found ${data.articles.length} articles:`);
    
    data.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log(`   URL: ${article.url}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ NewsAPI test failed:', error);
  }
}

// Test country capitals mapping
const COUNTRY_CAPITALS = {
  'US': [-77.0369, 38.9072], // Washington DC
  'GB': [-0.1276, 51.5074],  // London
  'JP': [139.6917, 35.6895], // Tokyo
  'DE': [13.4050, 52.5200],  // Berlin
  'FR': [2.3522, 48.8566],   // Paris
};

console.log('Testing country capitals mapping...');
Object.entries(COUNTRY_CAPITALS).forEach(([country, coords]) => {
  console.log(`${country}: [${coords[0]}, ${coords[1]}]`);
});

console.log('\n' + '='.repeat(50));
testNewsAPI();
