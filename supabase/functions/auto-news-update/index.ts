// Supabase Edge Function for automatic news updates
// This function will be called every 6 hours to add new news articles

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// NewsAPI configuration
const NEWS_API_KEY = 'c8e585058c0a419a934dac762d26b68f'
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

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
  'HR': [15.9819, 45.8150],  // Zagreb
  'SI': [14.5058, 46.0569],  // Ljubljana
  'SK': [17.1077, 48.1486],  // Bratislava
  'LT': [25.2797, 54.6872],  // Vilnius
  'LV': [24.1052, 56.9496],  // Riga
  'EE': [24.7536, 59.4370],  // Tallinn
  'IE': [-6.2603, 53.3498],  // Dublin
  'PT': [-9.1393, 38.7223],  // Lisbon
  'GR': [23.7275, 37.9838],  // Athens
  'CY': [33.4299, 35.1264],  // Nicosia
  'MT': [14.5147, 35.8997],  // Valletta
  'LU': [6.1296, 49.6116],   // Luxembourg
}

interface NewsArticle {
  title: string
  description?: string
  url: string
  publishedAt: string
  source: {
    id: string
    name: string
  }
  urlToImage?: string
  content?: string
}

function getRandomCoordinatesInCity(baseCoords: [number, number]): [number, number] {
  const [lng, lat] = baseCoords
  const offsetLng = (Math.random() - 0.5) * 0.1 // ±0.05 degrees
  const offsetLat = (Math.random() - 0.5) * 0.1
  return [lng + offsetLng, lat + offsetLat]
}

function getCountryCoordinates(countryCode: string): [number, number] {
  const coords = COUNTRY_CAPITALS[countryCode]
  if (!coords) {
    // Default to Washington DC if country not found
    return [-77.0369, 38.9072]
  }
  return getRandomCoordinatesInCity(coords)
}

function detectCountryFromArticle(article: NewsArticle): string {
  // Simple country detection based on source and content
  const sourceName = article.source.name.toLowerCase()
  const title = article.title.toLowerCase()
  const description = (article.description || '').toLowerCase()
  
  // Check for specific countries in source names
  if (sourceName.includes('bbc')) return 'GB'
  if (sourceName.includes('cnn') || sourceName.includes('fox') || sourceName.includes('abc')) return 'US'
  if (sourceName.includes('reuters')) return 'GB' // Reuters is international but based in UK
  if (sourceName.includes('ap news')) return 'US'
  if (sourceName.includes('npr')) return 'US'
  
  // Check for country names in title/description
  const countryKeywords = {
    'US': ['united states', 'america', 'usa', 'washington', 'new york', 'california'],
    'GB': ['united kingdom', 'britain', 'london', 'england', 'scotland', 'wales'],
    'CA': ['canada', 'toronto', 'vancouver', 'montreal'],
    'AU': ['australia', 'sydney', 'melbourne', 'canberra'],
    'DE': ['germany', 'berlin', 'munich', 'hamburg'],
    'FR': ['france', 'paris', 'lyon', 'marseille'],
    'IT': ['italy', 'rome', 'milan', 'naples'],
    'ES': ['spain', 'madrid', 'barcelona', 'valencia'],
    'JP': ['japan', 'tokyo', 'osaka', 'kyoto'],
    'CN': ['china', 'beijing', 'shanghai', 'hong kong'],
    'KR': ['korea', 'seoul', 'busan'],
    'IN': ['india', 'delhi', 'mumbai', 'bangalore'],
    'BR': ['brazil', 'sao paulo', 'rio de janeiro', 'brasilia'],
    'RU': ['russia', 'moscow', 'st petersburg'],
    'MX': ['mexico', 'mexico city', 'guadalajara'],
    'AR': ['argentina', 'buenos aires', 'cordoba'],
    'ZA': ['south africa', 'cape town', 'johannesburg'],
    'EG': ['egypt', 'cairo', 'alexandria'],
    'NG': ['nigeria', 'lagos', 'abuja'],
    'KE': ['kenya', 'nairobi', 'mombasa'],
    'MA': ['morocco', 'rabat', 'casablanca'],
    'TR': ['turkey', 'istanbul', 'ankara'],
    'SA': ['saudi arabia', 'riyadh', 'jeddah'],
    'AE': ['uae', 'dubai', 'abu dhabi'],
    'IL': ['israel', 'jerusalem', 'tel aviv'],
    'QA': ['qatar', 'doha'],
    'TH': ['thailand', 'bangkok', 'chiang mai'],
    'VN': ['vietnam', 'hanoi', 'ho chi minh'],
    'ID': ['indonesia', 'jakarta', 'surabaya'],
    'MY': ['malaysia', 'kuala lumpur', 'penang'],
    'SG': ['singapore'],
    'PH': ['philippines', 'manila', 'cebu'],
    'NZ': ['new zealand', 'auckland', 'wellington'],
    'NP': ['nepal', 'kathmandu'],
    'NO': ['norway', 'oslo', 'bergen'],
    'SE': ['sweden', 'stockholm', 'gothenburg'],
    'DK': ['denmark', 'copenhagen', 'aarhus'],
    'FI': ['finland', 'helsinki', 'tampere'],
    'NL': ['netherlands', 'amsterdam', 'rotterdam'],
    'BE': ['belgium', 'brussels', 'antwerp'],
    'CH': ['switzerland', 'zurich', 'geneva'],
    'AT': ['austria', 'vienna', 'salzburg'],
    'PL': ['poland', 'warsaw', 'krakow'],
    'CZ': ['czech republic', 'prague', 'brno'],
    'HU': ['hungary', 'budapest', 'debrecen'],
    'RO': ['romania', 'bucharest', 'cluj'],
    'BG': ['bulgaria', 'sofia', 'plovdiv'],
    'HR': ['croatia', 'zagreb', 'split'],
    'SI': ['slovenia', 'ljubljana', 'maribor'],
    'SK': ['slovakia', 'bratislava', 'kosice'],
    'LT': ['lithuania', 'vilnius', 'kaunas'],
    'LV': ['latvia', 'riga', 'daugavpils'],
    'EE': ['estonia', 'tallinn', 'tartu'],
    'IE': ['ireland', 'dublin', 'cork'],
    'PT': ['portugal', 'lisbon', 'porto'],
    'GR': ['greece', 'athens', 'thessaloniki'],
    'CY': ['cyprus', 'nicosia', 'limassol'],
    'MT': ['malta', 'valletta', 'sliema'],
    'LU': ['luxembourg', 'luxembourg city']
  }
  
  for (const [country, keywords] of Object.entries(countryKeywords)) {
    for (const keyword of keywords) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return country
      }
    }
  }
  
  // Default to US if no country detected
  return 'US'
}

async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching news articles...')
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=10&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'ok' || !data.articles) {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`)
    }

    console.log(`Fetched ${data.articles.length} news articles`)
    return data.articles
  } catch (error) {
    console.error('Error fetching news:', error)
    throw error
  }
}

async function addNewsToGlobe(article: NewsArticle, supabase: any): Promise<void> {
  try {
    // Skip ABC News articles as they may cause issues
    if (article.source.name.toLowerCase().includes('abc news')) {
      console.log(`Skipping ABC News article: ${article.title}`)
      return
    }

    // Detect country from article content and source
    const detectedCountry = detectCountryFromArticle(article)
    const coordinates = getCountryCoordinates(detectedCountry)

    console.log(`Adding news article: "${article.title}"`)
    console.log(`Detected country: ${detectedCountry}`)
    console.log(`Coordinates: [${coordinates[0]}, ${coordinates[1]}]`)

    // Store as today's date
    const today = new Date()
    const eventDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

    // Prepare content data for database
    const contentData = {
      user_id: 'api',
      title: article.title,
      description: article.description || article.content || `Breaking news from ${article.source.name}. Click to read more.`,
      category: 'News Event',
      coordinates: coordinates,
      image_url: article.urlToImage || null,
      author: article.source.name,
      date_happened: eventDate,
      source: `NewsAPI - ${article.source.name}`,
      is_approved: true,
      is_public: true
    }

    // Insert into database
    const { data, error } = await supabase
      .from('userdots')
      .insert(contentData)
      .select()
      .single()

    if (error) {
      console.error('Error saving news article:', error)
      throw error
    }

    console.log('News article added to globe:', data.id)
  } catch (error) {
    console.error('Failed to add news article to globe:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting automatic news update...')

    // Fetch news articles
    const articles = await fetchNewsArticles()
    
    console.log(`Found ${articles.length} news articles`)

    // Add each article to the globe
    let successCount = 0
    let errorCount = 0

    for (const article of articles) {
      try {
        await addNewsToGlobe(article, supabase)
        successCount++
        console.log(`Successfully added: ${article.title}`)
      } catch (error) {
        errorCount++
        console.error(`Failed to add article "${article.title}":`, error)
        // Continue with other articles even if one fails
      }
    }

    const result = {
      success: true,
      message: `News update completed. Added ${successCount} articles, ${errorCount} errors.`,
      added: successCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    }

    console.log('News update completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('News update failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
