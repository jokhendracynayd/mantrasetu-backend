export interface PujaDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  difficulty: string;
  locationType: string;
  panditRequired: boolean;
  locationDetails: string;
  category: string;
  imageUrl?: string;
  benefits: string[];
  included: string[];
  requirements: string[];
  relatedTopics: string[];
  availableDays: string[];
  isAvailable: boolean;
}

export const dummyPujasData: PujaDetail[] = [
  {
    id: 'seed-puja-6',
    name: 'Satyanarayan Puja',
    description: 'Sacred ritual for Lord Vishnu seeking blessings and prosperity',
    longDescription: 'Satyanarayan Puja is a sacred Hindu ritual dedicated to Lord Vishnu in his Satyanarayan form. This puja is performed to seek divine blessings for prosperity, peace, and success in all endeavors. It is believed to remove obstacles, bring harmony to the family, and fulfill wishes. The ceremony includes traditional Vedic mantras, offerings, and the narration of the Satyanarayan Katha.',
    price: 2500,
    duration: '2-3 hours',
    difficulty: 'Moderate',
    locationType: 'Home Visit',
    panditRequired: true,
    locationDetails: 'Pandit will visit your home with all necessary materials',
    category: 'POOJA',
    benefits: [
      'Removes obstacles and negativity',
      'Brings prosperity and abundance',
      'Ensures peace and harmony',
      'Fulfills wishes and desires',
      'Strengthens spiritual connection',
      'Blesses the entire family'
    ],
    included: [
      'Traditional Satyanarayan puja ceremony',
      'Experienced and knowledgeable pandit',
      'All puja materials and samagri',
      'Sacred mantras and prayers',
      'Satyanarayan Katha narration',
      'Prasad distribution',
      'Puja guidance and instructions'
    ],
    requirements: [
      'Clean and sacred space for puja',
      'Flowers and garlands',
      'Fruits and sweets for offerings',
      'Traditional clothes (optional)',
      'Family members present',
      'Pure ghee and incense sticks'
    ],
    relatedTopics: ['vishnu', 'prosperity', 'peace', 'family blessing', 'vedic ritual'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isAvailable: true
  },
  {
    id: 'seed-puja-7',
    name: 'Diwali Laxmi Puja',
    description: 'Festival of lights celebrating Goddess Laxmi for wealth and abundance',
    longDescription: 'Diwali Laxmi Puja is the most auspicious ceremony performed during the festival of lights. This sacred ritual is dedicated to Goddess Lakshmi, the deity of wealth, prosperity, and abundance. The puja is performed to invite divine blessings for financial prosperity, business success, and overall well-being. It includes traditional rituals, Lakshmi mantras, and offerings to honor the goddess.',
    price: 3000,
    duration: '1-2 hours',
    difficulty: 'Easy',
    locationType: 'Home Visit',
    panditRequired: true,
    locationDetails: 'Special Diwali puja at your home or business',
    category: 'POOJA',
    benefits: [
      'Attracts wealth and prosperity',
      'Brings abundance and fortune',
      'Ensures business success',
      'Removes financial obstacles',
      'Blesses with happiness and peace',
      'Invites positive energy'
    ],
    included: [
      'Complete Lakshmi puja ceremony',
      'Traditional diyas and decorations',
      'Experienced pandit service',
      'Sacred Lakshmi mantras',
      'Puja flowers and offerings',
      'Blessed prasad',
      'Rangoli consultation'
    ],
    requirements: [
      'Clean and decorated puja area',
      'Silver or copper coins',
      'Fresh flowers and lotus',
      'Sweets and dry fruits',
      'New clothes (optional)',
      'Diyas and oil lamps'
    ],
    relatedTopics: ['diwali', 'lakshmi', 'wealth', 'prosperity', 'abundance', 'festival'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isAvailable: true
  },
  {
    id: 'seed-puja-8',
    name: 'Govardhan Puja',
    description: 'Celebrating Lord Krishna\'s protection and the abundance of nature',
    longDescription: 'Govardhan Puja, also known as Annakut, celebrates Lord Krishna\'s lifting of Govardhan Hill to protect the people of Vrindavan. This puja honors nature, cattle, and the divine protection of Lord Krishna. It is performed with great devotion, offering a mountain of food (Annakut) to express gratitude for nature\'s abundance and seeking blessings for prosperity and protection.',
    price: 2800,
    duration: '2-4 hours',
    difficulty: 'Moderate',
    locationType: 'Home or Temple Visit',
    panditRequired: true,
    locationDetails: 'Can be performed at home or at a temple',
    category: 'POOJA',
    benefits: [
      'Divine protection from Lord Krishna',
      'Abundance and prosperity',
      'Gratitude for nature\'s gifts',
      'Protection of livestock',
      'Family harmony and unity',
      'Spiritual growth'
    ],
    included: [
      'Traditional Govardhan puja',
      'Annakut (food mountain) arrangement',
      'Krishna mantras and bhajans',
      'Experienced pandit guidance',
      'Puja materials included',
      'Sacred offerings and prasad',
      'Cow worship rituals'
    ],
    requirements: [
      'Various food items for Annakut',
      'Cow dung for Govardhan creation',
      'Fresh flowers and tulsi leaves',
      'Milk and dairy products',
      'Traditional decorations',
      'Family participation'
    ],
    relatedTopics: ['krishna', 'govardhan', 'protection', 'nature', 'abundance', 'gratitude'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isAvailable: true
  },
  {
    id: 'seed-puja-9',
    name: 'Bhai Dooj Puja',
    description: 'Sacred celebration of sibling bond and family protection',
    longDescription: 'Bhai Dooj Puja is a beautiful ceremony that celebrates the sacred bond between brothers and sisters. This puja is performed to strengthen sibling relationships, seek protection for brothers, and ensure family harmony. It\'s performed during the Diwali festival and is especially meaningful for families with strong sibling bonds. The ritual includes applying tilak, exchanging gifts, and praying for each other\'s well-being.',
    price: 1500,
    duration: '60 minutes',
    difficulty: 'Easy',
    locationType: 'Pandit-Travels',
    panditRequired: true,
    locationDetails: 'Home visit for family ceremony',
    category: 'POOJA',
    benefits: [
      'Strengthens sibling bonds',
      'Brings family harmony',
      'Provides protection to brothers',
      'Ensures long life and prosperity',
      'Brings love and understanding',
      'Creates lasting memories'
    ],
    included: [
      'Traditional Bhai Dooj ceremony',
      'Sibling blessing rituals',
      'Experienced pandit service',
      'Family harmony mantras',
      'Protection blessings',
      'Sacred prasad',
      'Tilak ceremony guidance'
    ],
    requirements: [
      'Tilak materials (kumkum, rice)',
      'Sweets and fruits',
      'Flowers and garlands',
      'Traditional clothes',
      'Sister\'s blessings',
      'Gift exchange items'
    ],
    relatedTopics: ['bhai dooj', 'siblings', 'family', 'protection', 'harmony', 'festival'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isAvailable: true
  },
  {
    id: '1',
    name: 'Maha Lakshmi Puja',
    description: 'Seek blessings of Goddess Lakshmi for wealth, prosperity, and abundance',
    longDescription: 'Maha Lakshmi Puja is an elaborate and powerful ceremony dedicated to Goddess Lakshmi, the supreme deity of wealth, fortune, and prosperity. This sacred ritual invokes the divine blessings of the goddess to remove financial obstacles, attract abundance, and ensure overall well-being. The puja includes traditional Vedic mantras, elaborate offerings, and ancient rituals passed down through generations.',
    price: 2500,
    duration: '120 minutes',
    difficulty: 'Moderate',
    locationType: 'Home or Office Visit',
    panditRequired: true,
    locationDetails: 'Pandit will visit your preferred location',
    category: 'POOJA',
    benefits: [
      'Attracts wealth and prosperity',
      'Removes financial obstacles',
      'Brings business success',
      'Ensures family harmony',
      'Invites divine blessings',
      'Creates positive energy flow'
    ],
    included: [
      'Complete Maha Lakshmi puja ceremony',
      'All traditional puja materials',
      'Experienced Vedic pandit',
      'Sacred Lakshmi mantras',
      '108 names chanting',
      'Blessed prasad',
      'Puja guidance and instructions'
    ],
    requirements: [
      'Clean and sacred puja space',
      'Fresh flowers and garlands',
      'Fruits and sweets',
      'Pure ghee for lamps',
      'New clothes (optional)',
      'Family members present'
    ],
    relatedTopics: ['lakshmi', 'wealth', 'prosperity', 'abundance', 'success'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Vedic Astrology Reading',
    description: 'Get personalized astrological guidance based on your birth chart',
    longDescription: 'Vedic Astrology Reading provides deep insights into your life path, destiny, and potential based on ancient Vedic astrology principles. Our expert astrologers analyze your birth chart (Kundali) to provide accurate predictions, identify favorable and challenging periods, and recommend remedies for a harmonious life. The session includes detailed analysis of planetary positions, doshas, and personalized guidance.',
    price: 1500,
    duration: '60 minutes',
    difficulty: 'Easy',
    locationType: 'Virtual or In-Person',
    panditRequired: true,
    locationDetails: 'Virtual consultation via video call or in-person meeting',
    category: 'ASTROLOGY',
    benefits: [
      'Understanding of life path and destiny',
      'Accurate predictions for future',
      'Career and business guidance',
      'Relationship compatibility analysis',
      'Health and wellness insights',
      'Personalized remedies'
    ],
    included: [
      'Complete birth chart analysis',
      'Planetary position assessment',
      'Dosha identification',
      'Future predictions',
      'Gemstone recommendations',
      'Remedy suggestions',
      'Written report provided'
    ],
    requirements: [
      'Exact birth date and time',
      'Birth place details',
      'Current life situation details',
      'Specific questions prepared',
      'Pen and paper for notes'
    ],
    relatedTopics: ['astrology', 'birth chart', 'predictions', 'guidance', 'kundali'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    isAvailable: true
  }
];

export const getPujaById = (id: string): PujaDetail | undefined => {
  return dummyPujasData.find(puja => puja.id === id);
};

