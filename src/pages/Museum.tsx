import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Grid, List } from 'lucide-react';

interface MuseumItem {
  id: string;
  name: string;
  description: string;
  category: string;
  era: string;
  imageUrl: string;
  location: string;
  year: string;
}

export default function Museum() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MuseumItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MuseumItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEra, setSelectedEra] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false); // Set to false for testing
  const [displayCount, setDisplayCount] = useState(50); // Show all items by default

  // Real museum items from the museum folder
  const sampleItems: MuseumItem[] = [
    {
      id: '1',
      name: 'Alan Turing',
      description: 'Pioneering computer scientist and mathematician who helped crack the Enigma code during WWII.',
      category: 'Science',
      era: 'Modern Era',
      imageUrl: '/images/museum/AlanTuring.png',
      location: 'Bletchley Park, UK',
      year: '1912-1954'
    },
    {
      id: '2',
      name: 'Leonardo da Vinci',
      description: 'Renaissance polymath known for his art, inventions, and scientific discoveries.',
      category: 'Art',
      era: 'Renaissance',
      imageUrl: '/images/museum/DaVinci.png',
      location: 'Florence, Italy',
      year: '1452-1519'
    },
    {
      id: '3',
      name: 'Aztec Calendar',
      description: 'Ancient Mesoamerican calendar stone representing the Aztec understanding of time and cosmology.',
      category: 'Archaeology',
      era: 'Pre-Columbian',
      imageUrl: '/images/museum/AztecCalender.png',
      location: 'Mexico City, Mexico',
      year: '1500 CE'
    },
    {
      id: '4',
      name: 'Rosetta Stone',
      description: 'Ancient Egyptian artifact that was key to deciphering hieroglyphs.',
      category: 'Archaeology',
      era: 'Ancient Egypt',
      imageUrl: '/images/museum/RosettaStone.png',
      location: 'British Museum, London',
      year: '196 BCE'
    },
    {
      id: '5',
      name: 'Mona Lisa',
      description: 'Famous Renaissance portrait by Leonardo da Vinci, one of the most recognized paintings in the world.',
      category: 'Art',
      era: 'Renaissance',
      imageUrl: '/images/museum/MonaLisa.png',
      location: 'Louvre Museum, Paris',
      year: '1503-1519'
    },
    {
      id: '6',
      name: 'Anubis',
      description: 'Ancient Egyptian god of the dead and mummification, often depicted with a jackal head.',
      category: 'Mythology',
      era: 'Ancient Egypt',
      imageUrl: '/images/museum/Anubis.png',
      location: 'Egypt',
      year: '3000 BCE'
    },
    {
      id: '7',
      name: 'Samurai',
      description: 'Feudal Japanese warrior class known for their strict code of honor and martial skills.',
      category: 'Military',
      era: 'Feudal Japan',
      imageUrl: '/images/museum/Samurai.png',
      location: 'Japan',
      year: '1185-1868'
    },
    {
      id: '8',
      name: 'Nikola Tesla',
      description: 'Inventor and electrical engineer who pioneered alternating current electricity.',
      category: 'Science',
      era: 'Modern Era',
      imageUrl: '/images/museum/Tesla.png',
      location: 'New York, USA',
      year: '1856-1943'
    },
    {
      id: '9',
      name: 'Charles Darwin',
      description: 'Naturalist and biologist who developed the theory of evolution by natural selection.',
      category: 'Science',
      era: 'Modern Era',
      imageUrl: '/images/museum/Darwin.png',
      location: 'Down House, UK',
      year: '1809-1882'
    },
    {
      id: '10',
      name: 'Buddhist Temple',
      description: 'Sacred Buddhist architecture representing spiritual enlightenment and meditation.',
      category: 'Architecture',
      era: 'Ancient Asia',
      imageUrl: '/images/museum/Buddhist.png',
      location: 'Various locations in Asia',
      year: '500 BCE - Present'
    },
    {
      id: '11',
      name: 'African Mask',
      description: 'Traditional ceremonial mask representing African cultural heritage and spirituality.',
      category: 'Art',
      era: 'Traditional Africa',
      imageUrl: '/images/museum/African.png',
      location: 'Various African regions',
      year: 'Varies'
    },
    {
      id: '12',
      name: 'Assyrian Lamassu',
      description: 'Winged bull with human head, protective deity of ancient Assyrian palaces.',
      category: 'Sculpture',
      era: 'Ancient Mesopotamia',
      imageUrl: '/images/museum/Assyrian.png',
      location: 'Ancient Assyria',
      year: '700 BCE'
    },
    {
      id: '13',
      name: 'Holy Bible',
      description: 'Sacred text of Christianity, containing the Old and New Testaments.',
      category: 'Religion',
      era: 'Ancient to Modern',
      imageUrl: '/images/museum/Bible.png',
      location: 'Jerusalem and beyond',
      year: 'Various dates'
    },
    {
      id: '14',
      name: 'Vintage Camera',
      description: 'Early photographic equipment that revolutionized visual documentation.',
      category: 'Technology',
      era: 'Industrial Revolution',
      imageUrl: '/images/museum/Camera.png',
      location: 'Various locations',
      year: '1800s-1900s'
    },
    {
      id: '15',
      name: 'Celtic Knot',
      description: 'Intricate Celtic spiral design representing eternity and interconnectedness.',
      category: 'Art',
      era: 'Celtic Period',
      imageUrl: '/images/museum/Celtic.png',
      location: 'Ireland, Scotland, Wales',
      year: '500 BCE - 500 CE'
    },
    {
      id: '16',
      name: 'Chainmail Armor',
      description: 'Medieval protective armor made of interlinked metal rings.',
      category: 'Military',
      era: 'Medieval Europe',
      imageUrl: '/images/museum/chainmail.png',
      location: 'Europe',
      year: '300-1600 CE'
    },
    {
      id: '17',
      name: 'Colossus of Rhodes',
      description: 'Ancient Greek statue of the sun god Helios, one of the Seven Wonders.',
      category: 'Sculpture',
      era: 'Ancient Greece',
      imageUrl: '/images/museum/ColossusOfRhodes.png',
      location: 'Rhodes, Greece',
      year: '280 BCE'
    },
    {
      id: '18',
      name: 'René Descartes',
      description: 'French philosopher and mathematician, father of modern philosophy.',
      category: 'Philosophy',
      era: 'Enlightenment',
      imageUrl: '/images/museum/Descartes.png',
      location: 'France',
      year: '1596-1650'
    },
    {
      id: '19',
      name: 'Diamond',
      description: 'Precious gemstone formed under extreme pressure, symbol of wealth and beauty.',
      category: 'Minerals',
      era: 'Geological',
      imageUrl: '/images/museum/Diamond.png',
      location: 'Various mines worldwide',
      year: 'Millions of years'
    },
    {
      id: '20',
      name: 'Fez Hat',
      description: 'Traditional brimless felt hat, symbol of Ottoman and Middle Eastern culture.',
      category: 'Fashion',
      era: 'Ottoman Empire',
      imageUrl: '/images/museum/Fez.png',
      location: 'Ottoman Empire',
      year: '1800s'
    },
    {
      id: '21',
      name: 'Fleur-de-lis',
      description: 'Stylized lily flower, heraldic symbol of French royalty.',
      category: 'Heraldry',
      era: 'Medieval France',
      imageUrl: '/images/museum/FleurDeLis.png',
      location: 'France',
      year: '1100s-1800s'
    },
    {
      id: '22',
      name: 'Golden Apple',
      description: 'Symbol of temptation and knowledge, featured in Greek mythology.',
      category: 'Mythology',
      era: 'Ancient Greece',
      imageUrl: '/images/museum/GoldenApple.png',
      location: 'Mount Olympus',
      year: 'Ancient times'
    },
    {
      id: '23',
      name: 'Hand Grenade',
      description: 'Explosive weapon used in modern warfare.',
      category: 'Military',
      era: 'Modern Era',
      imageUrl: '/images/museum/Grenade.png',
      location: 'Various battlefields',
      year: '1900s-present'
    },
    {
      id: '24',
      name: 'Guillotine',
      description: 'Execution device used during the French Revolution.',
      category: 'Historical',
      era: 'French Revolution',
      imageUrl: '/images/museum/Guillotine.png',
      location: 'France',
      year: '1790s'
    },
    {
      id: '25',
      name: 'Guinea Coin',
      description: 'British gold coin worth 21 shillings, used in 17th-19th centuries.',
      category: 'Currency',
      era: 'British Empire',
      imageUrl: '/images/museum/Guinea.png',
      location: 'United Kingdom',
      year: '1663-1813'
    },
    {
      id: '26',
      name: 'Flintlock Pistol',
      description: 'Early firearm using flintlock mechanism for ignition.',
      category: 'Military',
      era: 'Early Modern',
      imageUrl: '/images/museum/Gun.png',
      location: 'Europe',
      year: '1600s-1800s'
    },
    {
      id: '27',
      name: 'Inca Mask',
      description: 'Ceremonial mask from the Inca civilization of South America.',
      category: 'Art',
      era: 'Inca Empire',
      imageUrl: '/images/museum/IncaMask.png',
      location: 'Peru',
      year: '1200-1500 CE'
    },
    {
      id: '28',
      name: 'Kaaba',
      description: 'Sacred building in Mecca, the holiest site in Islam.',
      category: 'Religion',
      era: 'Islamic Era',
      imageUrl: '/images/museum/Kaaba.png',
      location: 'Mecca, Saudi Arabia',
      year: 'Pre-Islamic to present'
    },
    {
      id: '29',
      name: 'The Great Wave',
      description: 'Famous woodblock print by Hokusai, iconic Japanese artwork.',
      category: 'Art',
      era: 'Edo Period',
      imageUrl: '/images/museum/Kanagawa.png',
      location: 'Japan',
      year: '1831'
    },
    {
      id: '30',
      name: 'Kimono',
      description: 'Traditional Japanese garment, symbol of Japanese culture.',
      category: 'Fashion',
      era: 'Edo Period',
      imageUrl: '/images/museum/Kimono.png',
      location: 'Japan',
      year: '1600s-present'
    },
    {
      id: '31',
      name: 'Treasure Map',
      description: 'Pirate treasure map, symbol of adventure and exploration.',
      category: 'Cartography',
      era: 'Age of Exploration',
      imageUrl: '/images/museum/Map.png',
      location: 'Various seas',
      year: '1500s-1800s'
    },
    {
      id: '32',
      name: 'Maracas',
      description: 'Latin American percussion instrument, symbol of music and dance.',
      category: 'Music',
      era: 'Pre-Columbian to present',
      imageUrl: '/images/museum/Maracas.png',
      location: 'Latin America',
      year: 'Ancient to present'
    },
    {
      id: '33',
      name: 'Mount Rushmore',
      description: 'Monumental sculpture of four US presidents carved into granite.',
      category: 'Sculpture',
      era: 'Modern Era',
      imageUrl: '/images/museum/MountRushmoore.png',
      location: 'South Dakota, USA',
      year: '1927-1941'
    },
    {
      id: '34',
      name: 'Museum Building',
      description: 'Classical museum architecture, temple of knowledge and culture.',
      category: 'Architecture',
      era: 'Neoclassical',
      imageUrl: '/images/museum/Museum.png',
      location: 'Various cities',
      year: '1700s-present'
    },
    {
      id: '35',
      name: 'Persian Rug',
      description: 'Handwoven carpet, masterpiece of Persian craftsmanship.',
      category: 'Textiles',
      era: 'Persian Empire',
      imageUrl: '/images/museum/PersianRug.png',
      location: 'Persia/Iran',
      year: 'Ancient to present'
    },
    {
      id: '36',
      name: 'Pirate Flag',
      description: 'Jolly Roger flag, symbol of piracy and maritime adventure.',
      category: 'Military',
      era: 'Golden Age of Piracy',
      imageUrl: '/images/museum/Pirate.png',
      location: 'Caribbean Sea',
      year: '1600s-1800s'
    },
    {
      id: '37',
      name: 'Gunpowder',
      description: 'Explosive powder that revolutionized warfare and technology.',
      category: 'Technology',
      era: 'Medieval China',
      imageUrl: '/images/museum/Powder.png',
      location: 'China',
      year: '800s CE'
    },
    {
      id: '38',
      name: 'Printing Press',
      description: 'Revolutionary invention that enabled mass production of books.',
      category: 'Technology',
      era: 'Renaissance',
      imageUrl: '/images/museum/printingpress.png',
      location: 'Germany',
      year: '1440'
    },
    {
      id: '39',
      name: 'Quran',
      description: 'Holy book of Islam, containing the revelations to Prophet Muhammad.',
      category: 'Religion',
      era: 'Islamic Era',
      imageUrl: '/images/museum/Quran.png',
      location: 'Mecca and Medina',
      year: '610-632 CE'
    },
    {
      id: '40',
      name: 'Roman Laurel Wreath',
      description: 'Symbol of victory and honor in ancient Rome.',
      category: 'Symbol',
      era: 'Roman Empire',
      imageUrl: '/images/museum/Roman.png',
      location: 'Rome',
      year: 'Ancient Rome'
    },
    {
      id: '41',
      name: 'Shuriken',
      description: 'Japanese throwing star, weapon of the ninja.',
      category: 'Military',
      era: 'Feudal Japan',
      imageUrl: '/images/museum/Shuriken.png',
      location: 'Japan',
      year: 'Feudal period'
    },
    {
      id: '42',
      name: 'Srinivasa Ramanujan',
      description: 'Indian mathematical genius with extraordinary contributions to number theory.',
      category: 'Science',
      era: 'Modern Era',
      imageUrl: '/images/museum/SrinivasaRamanujan.png',
      location: 'India',
      year: '1887-1920'
    },
    {
      id: '43',
      name: 'Classical Bust',
      description: 'Sculpted portrait bust, symbol of classical art and culture.',
      category: 'Sculpture',
      era: 'Classical Antiquity',
      imageUrl: '/images/museum/Statue.png',
      location: 'Greece and Rome',
      year: 'Ancient times'
    },
    {
      id: '44',
      name: 'Statue of Liberty',
      description: 'Iconic symbol of freedom and democracy in New York Harbor.',
      category: 'Sculpture',
      era: 'Modern Era',
      imageUrl: '/images/museum/StatueOfLiberty.png',
      location: 'New York, USA',
      year: '1886'
    },
    {
      id: '45',
      name: 'Sultan Helmet',
      description: 'Ornate helmet worn by Ottoman sultans, symbol of power.',
      category: 'Military',
      era: 'Ottoman Empire',
      imageUrl: '/images/museum/SultanHelmet.png',
      location: 'Ottoman Empire',
      year: '1300s-1900s'
    },
    {
      id: '46',
      name: 'Military Tank',
      description: 'Armored fighting vehicle that revolutionized modern warfare.',
      category: 'Military',
      era: 'Modern Era',
      imageUrl: '/images/museum/Tank.png',
      location: 'Various battlefields',
      year: '1916-present'
    },
    {
      id: '47',
      name: 'Turkey/Istanbul',
      description: 'Historic city bridging Europe and Asia, former Constantinople.',
      category: 'Architecture',
      era: 'Byzantine to Ottoman',
      imageUrl: '/images/museum/Turkey.png',
      location: 'Istanbul, Turkey',
      year: '330 CE - present'
    },
    {
      id: '48',
      name: 'Vampire',
      description: 'Mythical creature of folklore, symbol of the supernatural.',
      category: 'Folklore',
      era: 'Medieval to Modern',
      imageUrl: '/images/museum/vampire.png',
      location: 'Various cultures',
      year: 'Medieval to present'
    },
    {
      id: '49',
      name: 'Voodoo Doll',
      description: 'Ritual object used in Haitian Vodou and related traditions.',
      category: 'Religion',
      era: 'Modern Era',
      imageUrl: '/images/museum/Voodoo.png',
      location: 'Haiti',
      year: '1700s-present'
    },
    {
      id: '50',
      name: 'Zeppelin',
      description: 'Rigid airship, early form of passenger air travel.',
      category: 'Transportation',
      era: 'Early Aviation',
      imageUrl: '/images/museum/Zeppelin.png',
      location: 'Germany',
      year: '1900-1940'
    }
  ];

  useEffect(() => {
    // Load museum items immediately
    setItems(sampleItems);
    setFilteredItems(sampleItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter items based on search and filters
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.era.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedEra !== 'all') {
      filtered = filtered.filter(item => item.era === selectedEra);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, selectedEra, items]);

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const eras = ['all', ...Array.from(new Set(items.map(item => item.era)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Museum Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Museum</h1>
                <p className="text-gray-600">Explore historical artifacts and treasures</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artifacts, eras, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eras.map(era => (
                  <option key={era} value={era}>
                    {era === 'all' ? 'All Eras' : era}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {Math.min(filteredItems.length, displayCount)} of {items.length} artifacts
          </p>
        </div>

        {/* Museum Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No artifacts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredItems.slice(0, displayCount).map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain bg-gray-100"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                    <span className="text-gray-400 text-sm">Image Placeholder</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-sm text-gray-500">{item.year}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {item.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {item.era}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>📍 {item.location}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {filteredItems.length > displayCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 20, filteredItems.length))}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More Artifacts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
