import { supabase } from '@/integrations/supabase/client';

// NewsAPI configuration
const NEWS_API_KEY = 'c8e585058c0a419a934dac762d26b68f';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Fallback to a different news source if NewsAPI fails
const FALLBACK_NEWS_SOURCES = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rss.cnn.com/rss/edition.rss'
];

// Country codes to capital city coordinates mapping
const COUNTRY_CAPITALS: { [key: string]: [number, number] } = {
  'US': [-77.0369, 38.9072], // Washington DC
  'GB': [-0.1276, 51.5074],  // London
  'JP': [139.6917, 35.6895], // Tokyo
  'DE': [13.4050, 52.5200],  // Berlin
  'FR': [2.3522, 48.8566],   // Paris
  'IT': [12.4964, 41.9028],  // Rome
  'ES': [-3.7038, 40.4168],  // Madrid
  'CA': [-75.6972, 45.4215], // Ottawa
  'AU': [149.1300, -35.2809], // Canberra
  'BR': [-47.8825, -15.7942], // Brasília
  'IN': [77.2090, 28.6139],  // New Delhi
  'CN': [116.4074, 39.9042], // Beijing
  'RU': [37.6173, 55.7558],  // Moscow
  'KR': [126.9780, 37.5665], // Seoul
  'MX': [-99.1332, 19.4326], // Mexico City
  'AR': [-58.3816, -34.6037], // Buenos Aires
  'ZA': [28.1871, -25.7479], // Pretoria
  'EG': [31.2357, 30.0444],  // Cairo
  'NG': [7.3986, 9.0765],    // Abuja
  'KE': [36.8219, -1.2921],  // Nairobi
  'MA': [-6.8498, 33.9716],  // Rabat
  'TR': [32.8597, 39.9334],  // Ankara
  'SA': [46.6753, 24.7136],  // Riyadh
  'AE': [54.3773, 24.4539],  // Abu Dhabi
  'IL': [35.2137, 31.7683],  // Jerusalem
  'QA': [51.5310, 25.2854],  // Doha (Qatar)
  'TH': [100.5018, 13.7563], // Bangkok
  'VN': [105.8342, 21.0285], // Hanoi
  'ID': [106.8456, -6.2088], // Jakarta
  'MY': [101.6869, 3.1390],  // Kuala Lumpur
  'SG': [103.8198, 1.3521],  // Singapore
  'PH': [120.9842, 14.5995], // Manila
  'NZ': [174.7762, -41.2865], // Wellington
  'NP': [85.3240, 27.7172],  // Kathmandu (Nepal)
  'NO': [10.7522, 59.9139],  // Oslo
  'SE': [18.0686, 59.3293],  // Stockholm
  'DK': [12.5683, 55.6761],  // Copenhagen
  'FI': [24.9458, 60.1699],  // Helsinki
  'NL': [4.9041, 52.3676],   // Amsterdam
  'BE': [4.3517, 50.8503],   // Brussels
  'CH': [7.4474, 46.9481],   // Bern
  'AT': [16.3738, 48.2082],  // Vienna
  'PL': [21.0122, 52.2297],  // Warsaw
  'CZ': [14.4378, 50.0755],  // Prague
  'HU': [19.0402, 47.4979],  // Budapest
  'RO': [26.1025, 44.4268],  // Bucharest
  'BG': [23.3219, 42.6977],  // Sofia
  'GR': [23.7275, 37.9838],  // Athens
  'PT': [-9.1393, 38.7223],  // Lisbon
  'IE': [-6.2603, 53.3498],  // Dublin
  'IS': [-21.8278, 64.1466], // Reykjavik
  'LU': [6.1296, 49.6116],   // Luxembourg
  'MT': [14.5147, 35.8997],  // Valletta
  'CY': [33.4299, 35.1264],  // Nicosia
  'HR': [15.9819, 45.8150],  // Zagreb
  'SI': [14.5058, 46.0569],  // Ljubljana
  'SK': [17.1077, 48.1486],  // Bratislava
  'LT': [25.2797, 54.6872],  // Vilnius
  'LV': [24.1052, 56.9496],  // Riga
  'EE': [24.7536, 59.4370],  // Tallinn
  'UA': [30.5234, 50.4501],  // Kyiv
  'BY': [27.5674, 53.9006],  // Minsk
  'MD': [28.8575, 47.0105],  // Chișinău
  'RS': [20.4573, 44.7866],  // Belgrade
  'ME': [19.2594, 42.4304],  // Podgorica
  'BA': [18.4131, 43.8563],  // Sarajevo
  'MK': [21.4361, 41.9981],  // Skopje
  'AL': [19.8190, 41.3275],  // Tirana
  'XK': [21.1641, 42.6629],  // Pristina
};

// News article interface
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  urlToImage?: string;
  content?: string;
  country?: string;
}

// Function to get random coordinates within a city (adds some variation)
function getRandomCoordinatesInCity(baseCoords: [number, number]): [number, number] {
  const [lng, lat] = baseCoords;
  // Add random offset within ~50km radius for better spread
  const offsetLng = (Math.random() - 0.5) * 1.0; // ~50km
  const offsetLat = (Math.random() - 0.5) * 1.0; // ~50km
  
  return [lng + offsetLng, lat + offsetLat];
}

// Function to detect country from article content and source
function detectCountryFromArticle(article: NewsArticle): string {
  const title = article.title.toLowerCase();
  const description = (article.description || '').toLowerCase();
  const source = article.source.name.toLowerCase();
  const content = `${title} ${description}`;
  
  // Country detection patterns
  const countryPatterns = {
    // SOUTH ASIA & MIDDLE EAST FIRST
    'NP': ['nepal', 'kathmandu', 'nepali'],
    'QA': ['qatar', 'doha', 'al jazeera'],
    'AE': ['uae', 'dubai', 'abu dhabi', 'emirates'],
    'SA': ['saudi arabia', 'riyadh', 'jeddah', 'saudi'],
    'TR': ['turkey', 'istanbul', 'ankara', 'turkish'],
    'IL': ['israel', 'jerusalem', 'tel aviv', 'israeli'],
    'EG': ['egypt', 'cairo', 'egyptian'],
    'PK': ['pakistan', 'islamabad', 'karachi', 'pakistani'],
    'BD': ['bangladesh', 'dhaka', 'bangladeshi'],
    'GB': ['london', 'britain', 'uk', 'england', 'scotland', 'wales', 'bbc', 'the guardian', 'daily mail', 'telegraph'],
    'DE': ['germany', 'berlin', 'munich', 'hamburg', 'deutschland', 'spiegel', 'bild'],
    'FR': ['france', 'paris', 'lyon', 'marseille', 'le monde', 'le figaro', 'french'],
    'IT': ['italy', 'rome', 'milan', 'naples', 'corriere', 'repubblica', 'italian'],
    'ES': ['spain', 'madrid', 'barcelona', 'el país', 'elmundo', 'spanish'],
    'CA': ['canada', 'toronto', 'vancouver', 'montreal', 'ottawa', 'cbc', 'canadian'],
    'AU': ['australia', 'sydney', 'melbourne', 'perth', 'australian'],
    'JP': ['japan', 'tokyo', 'osaka', 'kyoto', 'nihon', 'asahi', 'japanese'],
    'CN': ['china', 'beijing', 'shanghai', 'hong kong', 'xinhua', 'chinese'],
    'IN': ['india', 'delhi', 'mumbai', 'bangalore', 'times of india', 'indian'],
    'BR': ['brazil', 'são paulo', 'rio de janeiro', 'brasília', 'globo', 'brazilian'],
    'RU': ['russia', 'moscow', 'st petersburg', 'rt news', 'russian'],
    'KR': ['south korea', 'seoul', 'korean', 'kbs', 'chosun'],
    'MX': ['mexico', 'mexico city', 'guadalajara', 'mexican'],
    'AR': ['argentina', 'buenos aires', 'argentine'],
    'ZA': ['south africa', 'johannesburg', 'cape town', 'south african'],
    'EG': ['egypt', 'cairo', 'egyptian'],
    'NG': ['nigeria', 'lagos', 'abuja', 'nigerian'],
    'KE': ['kenya', 'nairobi', 'kenyan'],
    'MA': ['morocco', 'rabat', 'casablanca', 'moroccan'],
    'TR': ['turkey', 'istanbul', 'ankara', 'turkish'],
    'SA': ['saudi arabia', 'riyadh', 'jeddah', 'saudi'],
    'AE': ['uae', 'dubai', 'abu dhabi', 'emirates'],
    'IL': ['israel', 'jerusalem', 'tel aviv', 'israeli'],
    'TH': ['thailand', 'bangkok', 'thai'],
    'VN': ['vietnam', 'hanoi', 'ho chi minh', 'vietnamese'],
    'ID': ['indonesia', 'jakarta', 'indonesian'],
    'MY': ['malaysia', 'kuala lumpur', 'malaysian'],
    'SG': ['singapore', 'singaporean'],
    'PH': ['philippines', 'manila', 'filipino'],
    'NZ': ['new zealand', 'auckland', 'wellington', 'kiwi'],
    'NO': ['norway', 'oslo', 'norwegian'],
    'SE': ['sweden', 'stockholm', 'swedish'],
    'DK': ['denmark', 'copenhagen', 'danish'],
    'FI': ['finland', 'helsinki', 'finnish'],
    'NL': ['netherlands', 'amsterdam', 'rotterdam', 'dutch'],
    'BE': ['belgium', 'brussels', 'belgian'],
    'CH': ['switzerland', 'zurich', 'geneva', 'swiss'],
    'AT': ['austria', 'vienna', 'austrian'],
    'PL': ['poland', 'warsaw', 'krakow', 'polish'],
    'CZ': ['czech', 'prague', 'czech republic'],
    'HU': ['hungary', 'budapest', 'hungarian'],
    'RO': ['romania', 'bucharest', 'romanian'],
    'BG': ['bulgaria', 'sofia', 'bulgarian'],
    'GR': ['greece', 'athens', 'greek'],
    'PT': ['portugal', 'lisbon', 'portuguese'],
    'IE': ['ireland', 'dublin', 'irish'],
    'IS': ['iceland', 'reykjavik', 'icelandic'],
    'LU': ['luxembourg', 'luxembourgish'],
    'MT': ['malta', 'valletta', 'maltese'],
    'CY': ['cyprus', 'nicosia', 'cypriot'],
    'HR': ['croatia', 'zagreb', 'croatian'],
    'SI': ['slovenia', 'ljubljana', 'slovenian'],
    'SK': ['slovakia', 'bratislava', 'slovak'],
    'LT': ['lithuania', 'vilnius', 'lithuanian'],
    'LV': ['latvia', 'riga', 'latvian'],
    'EE': ['estonia', 'tallinn', 'estonian'],
    'UA': ['ukraine', 'kyiv', 'kiev', 'ukrainian'],
    'BY': ['belarus', 'minsk', 'belarusian'],
    'MD': ['moldova', 'chișinău', 'moldovan'],
    'RS': ['serbia', 'belgrade', 'serbian'],
    'ME': ['montenegro', 'podgorica', 'montenegrin'],
    'BA': ['bosnia', 'sarajevo', 'bosnian'],
    'MK': ['macedonia', 'skopje', 'macedonian'],
    'AL': ['albania', 'tirana', 'albanian'],
    'XK': ['kosovo', 'pristina', 'kosovar'],
    'US': ['united states', 'usa', 'america', 'washington', 'new york', 'california', 'texas', 'florida', 'cnn', 'fox news', 'msnbc', 'nbc', 'cbs', 'pbs', 'reuters', 'associated press', 'ap news', 'bloomberg', 'wall street journal', 'new york times', 'washington post', 'usa today', 'los angeles times', 'chicago tribune', 'boston globe', 'miami herald', 'dallas morning news', 'houston chronicle', 'philadelphia inquirer', 'detroit free press', 'arizona republic', 'denver post', 'seattle times', 'portland oregonian', 'san francisco chronicle', 'sacramento bee', 'atlanta journal', 'baltimore sun', 'charlotte observer', 'cincinnati enquirer', 'cleveland plain dealer', 'columbus dispatch', 'indianapolis star', 'kansas city star', 'louisville courier', 'memphis commercial appeal', 'milwaukee journal', 'minneapolis star', 'nashville tennessean', 'new orleans times', 'oklahoma city oklahoman', 'omaha world', 'pittsburgh post', 'providence journal', 'richmond times', 'rochester democrat', 'salt lake tribune', 'san antonio express', 'st louis post', 'tampa bay times', 'tulsa world', 'virginia pilot', 'winston salem journal', 'republican', 'democrat', 'congress', 'senate', 'house', 'white house', 'pentagon', 'fbi', 'cia', 'nsa', 'supreme court', 'federal', 'state', 'governor', 'mayor', 'president', 'vice president', 'secretary', 'senator', 'representative', 'mcconnell', 'pelosi', 'schumer', 'mccarthy', 'jeffries', 'trump', 'biden', 'harris', 'pence', 'obama', 'bush', 'clinton', 'reagan', 'carter', 'ford', 'nixon', 'johnson', 'kennedy', 'eisenhower', 'truman', 'roosevelt', 'hoover', 'coolidge', 'harding', 'wilson', 'taft', 'mckinley', 'cleveland', 'harrison', 'arthur', 'garfield', 'hayes', 'grant', 'johnson', 'lincoln', 'buchanan', 'pierce', 'fillmore', 'taylor', 'polk', 'tyler', 'harrison', 'van buren', 'jackson', 'adams', 'monroe', 'madison', 'jefferson', 'adams', 'washington']
  };
  
  // Check each country pattern
  for (const [countryCode, patterns] of Object.entries(countryPatterns)) {
    for (const pattern of patterns) {
      // Prefer content keyword match; treat source match as weaker
      if (content.includes(pattern)) {
        console.log(`🌍 Detected country ${countryCode} from content pattern "${pattern}" in: ${article.title}`);
        return countryCode;
      }
      if (source.includes(pattern)) {
        console.log(`🌍 Detected country ${countryCode} from pattern "${pattern}" in: ${article.title}`);
        return countryCode;
      }
    }
  }
  
  // If no pattern matches, return 'US' as default
  console.log(`🌍 No country pattern matched for: ${article.title} (${article.source.name})`);
  return 'US';
}

// Function to get coordinates for a country
function getCountryCoordinates(countryCode: string): [number, number] {
  const coords = COUNTRY_CAPITALS[countryCode.toUpperCase()];
  if (!coords) {
    // Default to a random location if country not found
    console.warn(`Country code ${countryCode} not found, using random coordinates`);
    return [
      (Math.random() - 0.5) * 360, // longitude
      (Math.random() - 0.5) * 180  // latitude
    ];
  }
  return getRandomCoordinatesInCity(coords);
}

// Function to fetch news from NewsAPI
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    console.log('Attempting to fetch news...');
    
    // Try NewsAPI first
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=10&apiKey=${NEWS_API_KEY}`
    );

    console.log('NewsAPI response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('NewsAPI data:', data);
      if (data.status === 'ok' && data.articles) {
        console.log('NewsAPI success, returning', data.articles.length, 'articles');
        return data.articles;
      }
    }
    
    console.warn('NewsAPI failed with status', response.status, ', trying RSS fallback...');
    
    // Fallback to RSS feeds
    const articles: NewsArticle[] = [];
    
    for (const feedUrl of FALLBACK_NEWS_SOURCES) {
      try {
        console.log('Trying RSS feed:', feedUrl);
        const rssResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
        if (rssResponse.ok) {
          const rssData = await rssResponse.json();
          console.log('RSS data for', feedUrl, ':', rssData);
          if (rssData.items && Array.isArray(rssData.items)) {
            const feedArticles = rssData.items.slice(0, 5).map((item: any) => ({
              title: item.title || 'No title',
              description: item.description || item.content || '',
              url: item.link || '#',
              publishedAt: item.pubDate || new Date().toISOString(),
              source: { id: rssData.feed?.title || 'RSS', name: rssData.feed?.title || 'RSS Feed' },
              urlToImage: item.thumbnail || null,
              content: item.content || item.description || ''
            }));
            articles.push(...feedArticles);
            console.log('Added', feedArticles.length, 'articles from', feedUrl);
          }
        } else {
          console.warn('RSS response not ok:', rssResponse.status);
        }
      } catch (rssError) {
        console.warn(`RSS feed failed: ${feedUrl}`, rssError);
      }
    }
    
    console.log('Total articles from RSS fallback:', articles.length);
    return articles.slice(0, 10);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// Function to add news article to the globe
export async function addNewsToGlobe(article: NewsArticle): Promise<void> {
  try {
    // Skip ABC News articles as they may cause issues
    if (article.source.name.toLowerCase().includes('abc news')) {
      console.log(`⚠️ Skipping ABC News article: ${article.title}`);
      return;
    }

    // Detect country from article content and source
    const detectedCountry = detectCountryFromArticle(article);
    const coordinates = getCountryCoordinates(detectedCountry);

    console.log(`📍 Adding news article: "${article.title}"`);
    console.log(`📍 Detected country: ${detectedCountry}`);
    console.log(`📍 Coordinates: [${coordinates[0]}, ${coordinates[1]}]`);

    // Store as the user's local "today" (not the article's UTC date) to avoid off-by-one
    const today = new Date();
    const eventDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    // Prepare content data for database
    const contentData = {
      user_id: 'api', // Set to 'api' for news articles
      title: article.title,
      description: article.description || article.content || `Breaking news from ${article.source.name}. Click to read more.`,
      category: 'News Event',
      coordinates: coordinates,
      image_url: article.urlToImage || null, // Don't set empty string, use null
      author: article.source.name,
      date_happened: eventDate,
      source: `NewsAPI - ${article.source.name}`,
      is_approved: true,
      is_public: true
    };

    console.log('📍 Content data to insert:', contentData);

    // Insert into database
    const { data, error } = await supabase
      .from('userdots')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving news article:', error);
      throw error;
    }

    console.log('✅ News article added to globe:', data);
  } catch (error) {
    console.error('❌ Failed to add news article to globe:', error);
    throw error;
  }
}

// Main function to fetch and add news to the globe
export async function addDailyNewsToGlobe(): Promise<void> {
  try {
    console.log('Fetching daily news articles...');
    const articles = await fetchNewsArticles();
    
    console.log(`Found ${articles.length} news articles`);
    
    // Add each article to the globe
    for (const article of articles) {
      try {
        await addNewsToGlobe(article);
        console.log(`Added article: ${article.title}`);
      } catch (error) {
        console.error(`Failed to add article "${article.title}":`, error);
        // Continue with other articles even if one fails
      }
    }
    
    console.log('Daily news integration completed');
  } catch (error) {
    console.error('Failed to add daily news to globe:', error);
    throw error;
  }
}

// Function to clear old news articles (optional cleanup)
export async function clearOldNewsArticles(): Promise<void> {
  try {
    const { error } = await supabase
      .from('userdots')
      .delete()
      .eq('category', 'News Event')
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Older than 7 days

    if (error) {
      console.error('Error clearing old news articles:', error);
      throw error;
    }

    console.log('Old news articles cleared');
  } catch (error) {
    console.error('Failed to clear old news articles:', error);
    throw error;
  }
}

// Function to clear ALL news articles (for testing)
export async function clearAllNewsArticles(): Promise<void> {
  try {
    const { error } = await supabase
      .from('userdots')
      .delete()
      .eq('category', 'News Event');

    if (error) {
      console.error('Error clearing all news articles:', error);
      throw error;
    }

    console.log('All news articles cleared');
  } catch (error) {
    console.error('Failed to clear all news articles:', error);
    throw error;
  }
}

// Function to clear ABC News articles specifically
export async function clearABCNewsArticles(): Promise<void> {
  try {
    const { error } = await supabase
      .from('userdots')
      .delete()
      .eq('user_id', 'api')
      .eq('category', 'News Event')
      .ilike('author', '%abc news%');

    if (error) {
      console.error('Error clearing ABC News articles:', error);
      throw error;
    }

    console.log('✅ ABC News articles cleared');
  } catch (error) {
    console.error('Error clearing ABC News articles:', error);
    throw error;
  }
}
