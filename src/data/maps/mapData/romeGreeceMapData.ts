
import { HistoryEvent, HistoryEra } from '@/types';

export const romeGreeceMapData = {
  era: 'rome-greece' as HistoryEra,
  title: 'Classical Antiquity: Greece & Rome',
  description: 'Explore the ancient civilizations of Greece and Rome that shaped Western civilization.',
  events: [
    {
      id: 'athens-democracy',
      title: 'Birth of Athenian Democracy',
      year: '508 BCE',
      location: 'Athens',
      latitude: 37.9838,
      longitude: 23.7275,
      description: 'Cleisthenes introduced political reforms that established the world\'s first democratic system in Athens. Citizens gained the right to vote directly on legislation and executive bills.',
      significance: 'Created the foundation for modern democratic systems and citizen participation in government.',
      imageUrl: '/lovable-uploads/f3a346a8-f934-4bbb-80a1-185c3cea2d92.png'
    },
    {
      id: 'battle-marathon',
      title: 'Battle of Marathon',
      year: '490 BCE',
      location: 'Marathon, Greece',
      latitude: 38.1613,
      longitude: 23.9430,
      description: 'The Athenians and their allies defeated the first Persian invasion of Greece under King Darius I, despite being vastly outnumbered.',
      significance: 'Prevented Persian conquest of Greece and preserved the developing democratic system.',
      imageUrl: '/lovable-uploads/ca07541f-437c-4a3e-a5dc-0ad021bc01c9.png'
    },
    {
      id: 'roman-republic',
      title: 'Founding of the Roman Republic',
      year: '509 BCE',
      location: 'Rome',
      latitude: 41.9028,
      longitude: 12.4964,
      description: 'After overthrowing the monarchy, Romans established a republican government with elected officials, a senate, and a system of checks and balances.',
      significance: 'Created a political system that would influence governments for centuries to come, including the United States.',
      imageUrl: '/lovable-uploads/14e71e3f-0b10-48ec-8c0b-f6b051cf18a1.png'
    },
    {
      id: 'punic-wars',
      title: 'Second Punic War',
      year: '218-201 BCE',
      location: 'Mediterranean',
      latitude: 41.8719,
      longitude: 12.5674,
      description: 'Hannibal of Carthage crossed the Alps with elephants to invade Italy, but was ultimately defeated by the Romans under Scipio Africanus.',
      significance: 'Established Rome as the dominant power in the Western Mediterranean.',
      imageUrl: '/lovable-uploads/2ef63e91-5570-41a8-909e-8ced875fb5fa.png'
    },
    {
      id: 'julius-caesar',
      title: 'Assassination of Julius Caesar',
      year: '44 BCE',
      location: 'Rome',
      latitude: 41.8956,
      longitude: 12.4829,
      description: 'Julius Caesar, who had been declared dictator for life, was assassinated by a group of senators led by Brutus and Cassius.',
      significance: 'Led to the final war of the Roman Republic and the establishment of the Roman Empire under Augustus.',
      imageUrl: '/lovable-uploads/4e7a143a-2aff-458d-8198-e4749f06304c.png'
    },
    {
      id: 'roman-empire',
      title: 'Pax Romana Begins',
      year: '27 BCE',
      location: 'Rome',
      latitude: 41.9028,
      longitude: 12.4964,
      description: 'Augustus became the first Roman Emperor, beginning a period of relative peace and stability known as Pax Romana that lasted about 200 years.',
      significance: 'Period of unprecedented peace and prosperity that allowed Roman culture, law, and engineering to flourish.',
      imageUrl: '/lovable-uploads/5bcb3957-b993-4eab-bf86-8fb485c10800.png'
    }
  ]
};
