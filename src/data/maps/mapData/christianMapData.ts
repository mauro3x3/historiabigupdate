import { HistoryEvent, HistoryEra } from '@/types';

export const christianMapData = {
  era: 'christian' as HistoryEra,
  title: 'Christian History',
  description: 'Explore key events in Christian history',
  events: [
    {
      id: 'christian-1',
      title: 'Birth of Jesus',
      year: '4 BCE',
      location: 'Bethlehem',
      latitude: 31.7,
      longitude: 35.2,
      description: 'Jesus of Nazareth is born in Bethlehem, marking the beginning of Christianity.',
      significance: 'Central event in Christian faith, celebrated as Christmas.',
      imageUrl: 'https://cdn.pixabay.com/photo/2020/07/12/18/51/jesus-5397281_1280.jpg'
    },
    {
      id: 'christian-2',
      title: 'Crucifixion of Jesus',
      year: '30-33 CE',
      location: 'Jerusalem',
      latitude: 31.78,
      longitude: 35.23,
      description: 'Jesus is crucified in Jerusalem under Pontius Pilate.',
      significance: 'Foundational event in Christian theology, believed to represent atonement for humanity\'s sins.',
      imageUrl: 'https://cdn.pixabay.com/photo/2015/04/14/20/28/jesus-722718_1280.jpg'
    },
    {
      id: 'christian-3',
      title: 'Pentecost',
      year: '33 CE',
      location: 'Jerusalem',
      latitude: 31.78,
      longitude: 35.23,
      description: 'The Holy Spirit descends on the apostles, empowering them to spread Christianity.',
      significance: 'Considered the birth of the Christian Church.',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/13/20/47/bible-1822110_1280.jpg'
    },
    {
      id: 'christian-4',
      title: 'Conversion of Paul',
      year: '33-36 CE',
      location: 'Damascus',
      latitude: 33.51,
      longitude: 36.40,
      description: 'Saul of Tarsus (later Paul) converts to Christianity on the road to Damascus.',
      significance: 'Led to the spread of Christianity to gentiles and the writing of much of the New Testament.',
      imageUrl: 'https://cdn.pixabay.com/photo/2015/07/14/19/53/bible-845847_1280.jpg'
    },
    {
      id: 'christian-5',
      title: 'Council of Nicaea',
      year: '325 CE',
      location: 'Nicaea (modern İznik, Turkey)',
      latitude: 40.43,
      longitude: 29.06,
      description: 'First ecumenical council called by Emperor Constantine I to address Arianism.',
      significance: 'Formulated the Nicene Creed, addressing the divine nature of Jesus.',
      imageUrl: 'https://cdn.pixabay.com/photo/2015/12/09/14/56/church-1084672_1280.jpg'
    },
    {
      id: 'christian-6',
      title: 'Christianity becomes Roman state religion',
      year: '380 CE',
      location: 'Rome',
      latitude: 41.9,
      longitude: 12.5,
      description: 'Emperor Theodosius I issues the Edict of Thessalonica, making Christianity the state religion.',
      significance: 'Transformed Christianity from a persecuted faith to the official religion of the Roman Empire.',
      imageUrl: 'https://cdn.pixabay.com/photo/2018/05/13/11/44/pantheon-3396536_1280.jpg'
    },
    {
      id: 'christian-7',
      title: 'Fall of Rome & Rise of Papal Power',
      year: '476 CE',
      location: 'Rome',
      latitude: 41.9,
      longitude: 12.5,
      description: 'As the Western Roman Empire falls, the Bishop of Rome (Pope) gains increasing political influence.',
      significance: 'Began the era of significant papal influence in European politics.',
      imageUrl: 'https://cdn.pixabay.com/photo/2013/07/07/04/30/roman-143551_1280.jpg'
    },
    {
      id: 'christian-8',
      title: 'Great Schism',
      year: '1054 CE',
      location: 'Constantinople',
      latitude: 41.01,
      longitude: 28.98,
      description: 'The formal split between Eastern (Orthodox) and Western (Catholic) Christianity.',
      significance: 'Created the two major branches of Christianity that continue today.',
      imageUrl: 'https://cdn.pixabay.com/photo/2014/03/02/16/21/church-278368_1280.jpg'
    },
    {
      id: 'christian-9',
      title: 'Protestant Reformation',
      year: '1517 CE',
      location: 'Wittenberg',
      latitude: 51.17,
      longitude: 12.95,
      description: 'Martin Luther posts his 95 Theses, criticizing practices of the Catholic Church.',
      significance: 'Sparked the Protestant Reformation and the formation of Protestant churches.',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/05/08/16/32/martin-luther-4188078_1280.jpg'
    },
    {
      id: 'christian-10',
      title: 'Second Vatican Council',
      year: '1962-1965 CE',
      location: 'Vatican City',
      latitude: 41.9,
      longitude: 12.45,
      description: 'Major reforming council that addressed the Catholic Church\'s relation to the modern world.',
      significance: 'Modernized Catholic practices and improved relations with other Christian denominations.',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/08/22/10/47/vatican-1611768_1280.jpg'
    }
  ]
};
