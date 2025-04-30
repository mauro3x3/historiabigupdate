
import { HistoryEvent, HistoryEra } from '@/types';

export const islamicMapData = {
  era: 'islamic' as HistoryEra,
  title: 'Islamic History',
  description: 'Explore key events in Islamic history',
  events: [
    {
      id: 'islamic-1',
      title: 'Birth of Muhammad',
      year: '570 CE',
      location: 'Mecca',
      latitude: 21.42,
      longitude: 39.83,
      description: 'Muhammad ibn Abdullah is born in Mecca.',
      significance: 'Birth of the final prophet in Islam who would receive divine revelation.',
      imageUrl: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80'
    },
    {
      id: 'islamic-2',
      title: 'First Revelation',
      year: '610 CE',
      location: 'Cave of Hira, near Mecca',
      latitude: 21.42,
      longitude: 39.85,
      description: 'Muhammad receives his first revelation from the angel Gabriel in the Cave of Hira.',
      significance: 'Marks the beginning of the revelation of the Quran and Muhammad\'s prophethood.',
      imageUrl: 'https://images.unsplash.com/photo-1566419808810-658178380987?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1741&q=80'
    },
    {
      id: 'islamic-3',
      title: 'The Hijra',
      year: '622 CE',
      location: 'Medina',
      latitude: 24.47,
      longitude: 39.61,
      description: 'Muhammad and his followers migrate from Mecca to Medina.',
      significance: 'Marks the beginning of the Islamic calendar and the establishment of the first Muslim community.',
      imageUrl: 'https://images.unsplash.com/photo-1591283261811-4f1cf36b8e41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    },
    {
      id: 'islamic-4',
      title: 'Conquest of Mecca',
      year: '630 CE',
      location: 'Mecca',
      latitude: 21.42,
      longitude: 39.83,
      description: 'Muhammad peacefully conquers Mecca and removes idols from the Kaaba.',
      significance: 'Established Mecca as the spiritual center of Islam.',
      imageUrl: 'https://images.unsplash.com/photo-1587979830964-1cf66332d464?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    },
    {
      id: 'islamic-5',
      title: 'Death of Muhammad',
      year: '632 CE',
      location: 'Medina',
      latitude: 24.47,
      longitude: 39.61,
      description: 'Muhammad passes away in Medina after completing his mission.',
      significance: 'Marks the end of direct divine revelation and the beginning of the caliphate.',
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80'
    },
    {
      id: 'islamic-6',
      title: 'Rashidun Caliphate',
      year: '632-661 CE',
      location: 'Baghdad (approximate center)',
      latitude: 33.35,
      longitude: 44.40,
      description: 'The first four caliphs (Abu Bakr, Umar, Uthman, and Ali) lead the Islamic community.',
      significance: 'Period of rapid expansion of Islam and compilation of the Quran.',
      imageUrl: 'https://images.unsplash.com/photo-1569948936239-908a7bc95231?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1746&q=80'
    },
    {
      id: 'islamic-7',
      title: 'Umayyad Caliphate',
      year: '661-750 CE',
      location: 'Damascus',
      latitude: 33.51,
      longitude: 36.30,
      description: 'The Umayyad dynasty rules the Islamic empire from Damascus.',
      significance: 'Period of great expansion, with Islamic territory stretching from Spain to India.',
      imageUrl: 'https://images.unsplash.com/photo-1583579366799-1c73bd5d2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80'
    },
    {
      id: 'islamic-8',
      title: 'Abbasid Caliphate',
      year: '750-1258 CE',
      location: 'Baghdad',
      latitude: 33.35,
      longitude: 44.36,
      description: 'The Abbasid dynasty overthrows the Umayyads and establishes Baghdad as their capital.',
      significance: 'Golden Age of Islam with flourishing of arts, sciences, and culture.',
      imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    },
    {
      id: 'islamic-9',
      title: 'Ottoman Empire',
      year: '1299-1922 CE',
      location: 'Istanbul (Constantinople)',
      latitude: 41.01,
      longitude: 28.98,
      description: 'The Ottoman Empire rises and becomes one of the world\'s most powerful states.',
      significance: 'Last major Islamic caliphate that significantly influenced global politics.',
      imageUrl: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    },
    {
      id: 'islamic-10',
      title: 'Modern Islamic Revival',
      year: '20th-21st centuries',
      location: 'Middle East',
      latitude: 25.00,
      longitude: 45.00,
      description: 'Rise of various Islamic revival movements and establishment of new Islamic states.',
      significance: 'Continues the evolution of Islamic political and religious thought in the modern era.',
      imageUrl: 'https://images.unsplash.com/photo-1563897539633-7d3a39f8decc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80'
    }
  ]
};
