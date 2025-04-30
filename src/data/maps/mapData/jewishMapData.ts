
import { HistoryEvent, HistoryEra } from '@/types';

export const jewishMapData = {
  era: 'jewish' as HistoryEra,
  title: 'Jewish Historical Journey',
  description: 'Explore key events in Jewish history, starting with Abraham\'s journey to Canaan.',
  events: [
    {
      id: 'abraham-ur',
      title: 'Abraham in Ur',
      year: 'c. 1800 BCE',
      location: 'Ur of the Chaldees',
      latitude: 30.9626,
      longitude: 46.1031,
      description: 'Abraham\'s journey began in Ur, in present-day Iraq. According to biblical tradition, God called Abraham to leave his homeland and journey to a new land that would be shown to him.',
      significance: 'The beginning of the Abrahamic covenant that would establish the Jewish people.',
      imageUrl: 'https://images.unsplash.com/photo-1589714379796-77230d45a04d?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'abraham-harran',
      title: 'Stop at Harran',
      year: 'c. 1800 BCE',
      location: 'Harran',
      latitude: 36.8653,
      longitude: 39.0319,
      description: 'Abraham and his family first traveled to Harran (in modern-day Turkey), where they settled temporarily. His father Terah died in Harran before Abraham continued his journey.',
      significance: 'A significant stopping point in Abraham\'s migration toward Canaan.'
    },
    {
      id: 'abraham-shechem',
      title: 'Arrival in Shechem',
      year: 'c. 1775 BCE',
      location: 'Shechem',
      latitude: 32.2136,
      longitude: 35.2897,
      description: 'Abraham finally entered the promised land of Canaan, stopping first at Shechem. Here, God appeared to Abraham and promised to give this land to his descendants.',
      significance: 'The first place in Canaan where Abraham built an altar to God, marking the beginning of the Jewish connection to the land.',
      imageUrl: 'https://images.unsplash.com/photo-1552423314-cf29ab68ad81?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'abraham-bethel',
      title: 'Altar at Bethel',
      year: 'c. 1770 BCE',
      location: 'Bethel',
      latitude: 31.9289,
      longitude: 35.2422,
      description: 'Abraham moved to the hills east of Bethel and built another altar to call upon the name of God.',
      significance: 'Established a pattern of worship and would later become an important religious center.'
    },
    {
      id: 'abraham-egypt',
      title: 'Journey to Egypt',
      year: 'c. 1770 BCE',
      location: 'Egypt',
      latitude: 29.9773,
      longitude: 31.1325,
      description: 'Due to a severe famine in Canaan, Abraham traveled to Egypt with his wife Sarah. He presented her as his sister out of fear, which led to complications with the Pharaoh.',
      significance: 'Demonstrates Abraham\'s human frailty despite his status as the patriarch of the Jewish people.',
      imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'abraham-negev',
      title: 'Return to Canaan',
      year: 'c. 1765 BCE',
      location: 'Negev Desert',
      latitude: 30.8124,
      longitude: 34.7818,
      description: 'After leaving Egypt with great wealth, Abraham returned to the Negev and then back to the area between Bethel and Ai where he had previously built an altar.',
      significance: 'Abraham\'s prosperity grew, setting the stage for his role as a powerful chieftain in Canaan.'
    },
    {
      id: 'abraham-hebron',
      title: 'Settlement in Hebron',
      year: 'c. 1760 BCE',
      location: 'Hebron',
      latitude: 31.5326,
      longitude: 35.0998,
      description: 'Abraham moved his camp to the oaks of Mamre near Hebron, where he built another altar to God. This became his primary residence for many years.',
      significance: 'Hebron would later become the burial place for Abraham and the patriarchs, marking it as one of Judaism\'s holiest cities.',
      imageUrl: 'https://images.unsplash.com/photo-1512039324765-a222fba409cd?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'abraham-beersheba',
      title: 'Covenant at Beersheba',
      year: 'c. 1740 BCE',
      location: 'Beersheba',
      latitude: 31.2518,
      longitude: 34.7913,
      description: 'Abraham planted a tamarisk tree at Beersheba and called on the name of God. He made a covenant with Abimelech over water rights in this area.',
      significance: 'Beersheba became an important ancestral location, marking the southern boundary of the promised land.'
    },
    {
      id: 'abraham-moriah',
      title: 'The Binding of Isaac',
      year: 'c. 1730 BCE',
      location: 'Mount Moriah',
      latitude: 31.7781,
      longitude: 35.2366,
      description: 'God tested Abraham\'s faith by asking him to sacrifice his son Isaac on Mount Moriah. At the last moment, God provided a ram as a substitute.',
      significance: 'One of the most pivotal moments in Jewish history, demonstrating Abraham\'s complete faith and obedience to God.',
      imageUrl: 'https://images.unsplash.com/photo-1558366596-1f50c335be27?q=80&w=1000&auto=format&fit=crop'
    }
  ]
};
