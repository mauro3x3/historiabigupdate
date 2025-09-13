import { supabase } from '@/lib/supabase';

export interface MuseumArtifact {
  id: string;
  name: string;
  description: string;
  category: string;
  era: string;
  imageUrl: string;
  location: string;
  year: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  owned_by?: string[];
}

// Sample museum artifacts with rarity levels
export const MUSEUM_ARTIFACTS: MuseumArtifact[] = [
  {
    id: '1',
    name: 'Alan Turing',
    description: 'Pioneering computer scientist and mathematician who helped crack the Enigma code during WWII.',
    category: 'Science',
    era: 'Modern Era',
    imageUrl: '/images/museum/AlanTuring.png',
    location: 'Bletchley Park, UK',
    year: '1912-1954',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '2',
    name: 'Leonardo da Vinci',
    description: 'Renaissance polymath known for his art, inventions, and scientific discoveries.',
    category: 'Art',
    era: 'Renaissance',
    imageUrl: '/images/museum/DaVinci.png',
    location: 'Florence, Italy',
    year: '1452-1519',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '3',
    name: 'Aztec Calendar',
    description: 'Ancient Mesoamerican calendar stone representing the Aztec understanding of time and cosmology.',
    category: 'Archaeology',
    era: 'Pre-Columbian',
    imageUrl: '/images/museum/AztecCalender.png',
    location: 'Mexico City, Mexico',
    year: '1500 CE',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  },
  {
    id: '4',
    name: 'Rosetta Stone',
    description: 'Ancient Egyptian stone with inscriptions in three scripts that helped decipher hieroglyphs.',
    category: 'Archaeology',
    era: 'Ancient Egypt',
    imageUrl: '/images/museum/RosettaStone.png',
    location: 'British Museum, UK',
    year: '196 BCE',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '5',
    name: 'Mona Lisa',
    description: 'Famous portrait by Leonardo da Vinci, considered one of the most valuable paintings in the world.',
    category: 'Art',
    era: 'Renaissance',
    imageUrl: '/images/museum/MonaLisa.png',
    location: 'Louvre, France',
    year: '1503-1519',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '6',
    name: 'Anubis Statue',
    description: 'Ancient Egyptian statue of the jackal-headed god of mummification and the afterlife.',
    category: 'Archaeology',
    era: 'Ancient Egypt',
    imageUrl: '/images/museum/Anubis.png',
    location: 'Cairo, Egypt',
    year: '2000 BCE',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '7',
    name: 'Statue of Liberty',
    description: 'Iconic symbol of freedom and democracy, gifted to the United States by France.',
    category: 'Architecture',
    era: 'Modern Era',
    imageUrl: '/images/museum/StatueOfLiberty.png',
    location: 'New York, USA',
    year: '1886 CE',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '8',
    name: 'Sultan Helmet',
    description: 'Ornate helmet worn by Ottoman sultans, symbol of imperial power and authority.',
    category: 'Military',
    era: 'Ottoman Empire',
    imageUrl: '/images/museum/SultanHelmet.png',
    location: 'Istanbul, Turkey',
    year: '1400-1600 CE',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  },
  {
    id: '9',
    name: 'Roman Statue',
    description: 'Classical Roman sculpture representing the artistic achievements of the Roman Empire.',
    category: 'Sculpture',
    era: 'Ancient Rome',
    imageUrl: '/images/museum/Roman.png',
    location: 'Rome, Italy',
    year: '100-300 CE',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '10',
    name: 'Celtic Artifact',
    description: 'Ancient Celtic cultural artifact representing the artistic traditions of Celtic peoples.',
    category: 'Archaeology',
    era: 'Celtic',
    imageUrl: '/images/museum/Celtic.png',
    location: 'Various',
    year: '500 BCE - 100 CE',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  },
  {
    id: '11',
    name: 'Holy Bible',
    description: 'Sacred text of Christianity, containing the Old and New Testaments.',
    category: 'Religion',
    era: 'Ancient to Modern',
    imageUrl: '/images/museum/Bible.png',
    location: 'Jerusalem and beyond',
    year: 'Various dates',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '12',
    name: 'Printing Press',
    description: 'Revolutionary invention that made books widely available and spread knowledge across Europe.',
    category: 'Technology',
    era: 'Renaissance',
    imageUrl: '/images/museum/printingpress.png',
    location: 'Germany',
    year: '1440 CE',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '13',
    name: 'Tesla Coil',
    description: 'Electrical device invented by Nikola Tesla for wireless transmission of energy.',
    category: 'Science',
    era: 'Modern Era',
    imageUrl: '/images/museum/Tesla.png',
    location: 'Various',
    year: '1891 CE',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '14',
    name: 'Darwin\'s Theory',
    description: 'Revolutionary scientific theory of evolution by natural selection.',
    category: 'Science',
    era: 'Modern Era',
    imageUrl: '/images/museum/Darwin.png',
    location: 'England',
    year: '1859 CE',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '15',
    name: 'Descartes\' Philosophy',
    description: 'Foundational work in modern philosophy, "I think, therefore I am."',
    category: 'Philosophy',
    era: 'Renaissance',
    imageUrl: '/images/museum/Descartes.png',
    location: 'France',
    year: '1637 CE',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  },
  {
    id: '16',
    name: 'Srinivasa Ramanujan',
    description: 'Self-taught Indian mathematician who made extraordinary contributions to mathematical analysis.',
    category: 'Science',
    era: 'Modern Era',
    imageUrl: '/images/museum/SrinivasaRamanujan.png',
    location: 'India',
    year: '1887-1920',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '17',
    name: 'Colossus of Rhodes',
    description: 'One of the Seven Wonders of the Ancient World, a giant bronze statue of the sun god Helios.',
    category: 'Sculpture',
    era: 'Ancient Greece',
    imageUrl: '/images/museum/ColossusOfRhodes.png',
    location: 'Rhodes, Greece',
    year: '280 BCE',
    rarity: 'legendary',
    unlocked: false,
    owned_by: []
  },
  {
    id: '18',
    name: 'Assyrian Lamassu',
    description: 'Winged bull with human head, protective deity of ancient Assyrian palaces.',
    category: 'Sculpture',
    era: 'Ancient Mesopotamia',
    imageUrl: '/images/museum/Assyrian.png',
    location: 'Ancient Assyria',
    year: '700 BCE',
    rarity: 'epic',
    unlocked: false,
    owned_by: []
  },
  {
    id: '19',
    name: 'Vintage Camera',
    description: 'Early photographic equipment that revolutionized visual documentation.',
    category: 'Technology',
    era: 'Industrial Revolution',
    imageUrl: '/images/museum/Camera.png',
    location: 'Various',
    year: '1800s',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  },
  {
    id: '20',
    name: 'Inca Mask',
    description: 'Ceremonial mask from the Inca civilization, representing spiritual and cultural significance.',
    category: 'Archaeology',
    era: 'Pre-Columbian',
    imageUrl: '/images/museum/IncaMask.png',
    location: 'Peru',
    year: '1200-1500 CE',
    rarity: 'rare',
    unlocked: false,
    owned_by: []
  }
];

// Rarity weights for random selection (higher = more common)
const RARITY_WEIGHTS = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5
};

export class MuseumService {
  // Get all artifacts
  static async getAllArtifacts(): Promise<MuseumArtifact[]> {
    return MUSEUM_ARTIFACTS;
  }

  // Get user's owned artifacts
  static async getUserArtifacts(userId: string): Promise<MuseumArtifact[]> {
    const { data, error } = await supabase
      .from('user_museum_artifacts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user artifacts:', error);
      return [];
    }

    // Map database records back to artifacts
    return data.map(record => {
      const artifact = MUSEUM_ARTIFACTS.find(a => a.id === record.artifact_id);
      return {
        ...artifact!,
        unlocked: true,
        owned_by: [userId]
      };
    });
  }

  // Award a random artifact to a user
  static async awardRandomArtifact(userId: string): Promise<MuseumArtifact | null> {
    try {
      // Get user's current artifacts to avoid duplicates
      const userArtifacts = await this.getUserArtifacts(userId);
      const ownedIds = userArtifacts.map(a => a.id);
      
      // Filter out already owned artifacts
      const availableArtifacts = MUSEUM_ARTIFACTS.filter(a => !ownedIds.includes(a.id));
      
      if (availableArtifacts.length === 0) {
        console.log('User already owns all artifacts!');
        return null;
      }

      // Weighted random selection based on rarity
      const weightedArtifacts: MuseumArtifact[] = [];
      availableArtifacts.forEach(artifact => {
        const weight = RARITY_WEIGHTS[artifact.rarity];
        for (let i = 0; i < weight; i++) {
          weightedArtifacts.push(artifact);
        }
      });

      // Select random artifact
      const randomIndex = Math.floor(Math.random() * weightedArtifacts.length);
      const selectedArtifact = weightedArtifacts[randomIndex];

      // Save to database
      const { data, error } = await supabase
        .from('user_museum_artifacts')
        .insert({
          user_id: userId,
          artifact_id: selectedArtifact.id,
          earned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving artifact to database:', error);
        return null;
      }

      console.log(`🎉 User ${userId} earned artifact: ${selectedArtifact.name} (${selectedArtifact.rarity})`);
      
      return {
        ...selectedArtifact,
        unlocked: true,
        owned_by: [userId]
      };
    } catch (error) {
      console.error('Error awarding random artifact:', error);
      return null;
    }
  }

  // Check if user owns a specific artifact
  static async userOwnsArtifact(userId: string, artifactId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_museum_artifacts')
      .select('id')
      .eq('user_id', userId)
      .eq('artifact_id', artifactId)
      .single();

    return !error && !!data;
  }
}
