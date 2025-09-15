// Test news coordinates and database insertion
// Run with: node test-news-coordinates.js

const NEWS_API_KEY = 'c8e585058c0a419a934dac762d26b68f';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Country capitals mapping (same as in newsService.ts)
const COUNTRY_CAPITALS = {
  'US': [-77.0369, 38.9072], // Washington DC
  'GB': [-0.1276, 51.5074],  // London
  'JP': [139.6917, 35.6895], // Tokyo
  'DE': [13.4050, 52.5200],  // Berlin
  'FR': [2.3522, 48.8566],   // Paris
};

function getRandomCoordinatesInCity(baseCoords) {
  const [lng, lat] = baseCoords;
  const offsetLng = (Math.random() - 0.5) * 0.2;
  const offsetLat = (Math.random() - 0.5) * 0.2;
  return [lng + offsetLng, lat + offsetLat];
}

function getCountryCoordinates(countryCode) {
  const coords = COUNTRY_CAPITALS[countryCode.toUpperCase()];
  if (!coords) {
    console.warn(`Country code ${countryCode} not found, using random coordinates`);
    return [
      (Math.random() - 0.5) * 360,
      (Math.random() - 0.5) * 180
    ];
  }
  return getRandomCoordinatesInCity(coords);
}

async function testNewsAndCoordinates() {
  try {
    console.log('🔍 Testing NewsAPI and coordinate generation...');
    
    // Test NewsAPI
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=3&apiKey=${NEWS_API_KEY}`
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
      const countryCode = article.country || 'US';
      const coordinates = getCountryCoordinates(countryCode);
      
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Country: ${countryCode}`);
      console.log(`   Coordinates: [${coordinates[0]}, ${coordinates[1]}] (lng, lat)`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log('');
    });

    // Test coordinate validation
    console.log('🧪 Testing coordinate validation...');
    const testCoords = getCountryCoordinates('US');
    const [lng, lat] = testCoords;
    
    const isValidLat = typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
    
    console.log(`Test coordinates: [${lng}, ${lat}]`);
    console.log(`Valid latitude: ${isValidLat} (${lat >= -90 && lat <= 90})`);
    console.log(`Valid longitude: ${isValidLng} (${lng >= -180 && lng <= 180})`);
    
    if (isValidLat && isValidLng) {
      console.log('✅ Coordinates are valid for map display');
    } else {
      console.log('❌ Coordinates are invalid for map display');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNewsAndCoordinates();
