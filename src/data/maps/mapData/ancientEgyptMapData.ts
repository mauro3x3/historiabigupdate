
import { HistoryEvent, HistoryEra } from '@/types';

export const ancientEgyptMapData = {
  era: 'ancient-egypt' as HistoryEra,
  title: 'Ancient Egyptian History',
  description: 'Explore key events and locations in Ancient Egyptian history.',
  events: [
    {
      id: 'egypt-unification',
      title: 'Unification of Upper and Lower Egypt',
      year: 'c. 3100 BCE',
      location: 'Memphis',
      latitude: 29.8711,
      longitude: 31.2156,
      description: 'King Narmer (also known as Menes) united Upper and Lower Egypt into one kingdom, founding the First Dynasty and establishing Memphis as the capital.',
      significance: 'This marked the beginning of Ancient Egyptian civilization as a unified state.',
      imageUrl: 'https://images.unsplash.com/photo-1608328894904-80f7ed9a7676?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'great-pyramid',
      title: 'Construction of the Great Pyramid',
      year: 'c. 2560 BCE',
      location: 'Giza',
      latitude: 29.9792,
      longitude: 31.1342,
      description: 'The Great Pyramid was built as a tomb for Pharaoh Khufu of the Fourth Dynasty. It was the tallest man-made structure in the world for over 3,800 years.',
      significance: 'Demonstrates the engineering and organizational prowess of Ancient Egypt during the Old Kingdom.',
      imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'valley-kings',
      title: 'Valley of the Kings Established',
      year: 'c. 1539 BCE',
      location: 'Thebes (Luxor)',
      latitude: 25.7402,
      longitude: 32.6014,
      description: 'The Valley of the Kings became the principal burial place for pharaohs and powerful nobles during the New Kingdom period.',
      significance: 'Contains the tomb of Tutankhamun and many other significant archaeological discoveries.',
      imageUrl: 'https://images.unsplash.com/photo-1600006887654-bf47c33d8e69?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'ramses-kadesh',
      title: 'Battle of Kadesh',
      year: '1274 BCE',
      location: 'Kadesh (Syria)',
      latitude: 34.5667,
      longitude: 36.5000,
      description: 'Pharaoh Ramses II led Egyptian forces against the Hittite Empire at Kadesh. The battle ended in a stalemate but was portrayed as a great Egyptian victory.',
      significance: 'Led to the world\'s first known peace treaty, signed between the Egyptians and Hittites.',
      imageUrl: 'https://images.unsplash.com/photo-1669447845477-297f429b50b7?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'cleopatra',
      title: 'Reign of Cleopatra VII',
      year: '51-30 BCE',
      location: 'Alexandria',
      latitude: 31.2156,
      longitude: 29.9553,
      description: 'Cleopatra, the last active ruler of the Ptolemaic Kingdom, formed alliances with Roman leaders Julius Caesar and Mark Antony to protect Egypt\'s independence.',
      significance: 'Her death marked the end of the Ptolemaic dynasty and the beginning of Roman Egypt.',
      imageUrl: 'https://images.unsplash.com/photo-1624138784782-817d6de39525?q=80&w=1000&auto=format&fit=crop'
    }
  ]
};
