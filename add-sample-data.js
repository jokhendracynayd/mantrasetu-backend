const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3000/api/v1';

async function addSampleData() {
  console.log('🌱 Adding sample data...');

  try {
    // Sample services data
    const services = [
      {
        name: 'Grih Pravesh Puja',
        description: 'Sacred housewarming ceremony to bless your new home and ensure prosperity, peace, and positive energy.',
        category: 'POOJA',
        subcategory: 'Housewarming',
        durationMinutes: 120,
        basePrice: 2500,
        isVirtual: false,
        requiresSamagri: true,
        instructions: 'Please provide the house address and preferred date. We will bring all necessary materials.',
        isActive: true,
        imageUrl: '/images/services/grih-pravesh.jpg',
        tags: ['housewarming', 'vastu', 'prosperity', 'new home'],
      },
      {
        name: 'Satyanarayan Puja',
        description: 'Sacred puja dedicated to Lord Vishnu to seek blessings for family harmony, prosperity, and fulfillment of wishes.',
        category: 'POOJA',
        subcategory: 'Devotional',
        durationMinutes: 180,
        basePrice: 1800,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Virtual puja will be conducted via video call. Samagri kit will be delivered to your address.',
        isActive: true,
        imageUrl: '/images/services/satyanarayan.jpg',
        tags: ['vishnu', 'family', 'harmony', 'prosperity'],
      },
      {
        name: 'Marriage Ceremony (Vivah Sanskar)',
        description: 'Complete Hindu marriage ceremony following traditional Vedic rituals. Includes all seven sacred vows, fire ceremony, and blessings.',
        category: 'POOJA',
        subcategory: 'Marriage',
        durationMinutes: 240,
        basePrice: 5000,
        isVirtual: false,
        requiresSamagri: true,
        instructions: 'Please provide venue details and guest count. We will coordinate with your wedding planner.',
        isActive: true,
        imageUrl: '/images/services/marriage.jpg',
        tags: ['wedding', 'vivah', 'sacred vows', 'fire ceremony'],
      },
      {
        name: 'Havan (Fire Ceremony)',
        description: 'Sacred fire ritual to purify the environment and invoke divine blessings. Includes chanting of Vedic mantras and offerings to the sacred fire.',
        category: 'HAVAN',
        subcategory: 'Purification',
        durationMinutes: 90,
        basePrice: 2200,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Virtual havan will be conducted. We will guide you through the process and provide all necessary materials.',
        isActive: true,
        imageUrl: '/images/services/havan.jpg',
        tags: ['fire ceremony', 'purification', 'vedic mantras', 'blessings'],
      },
      {
        name: 'Astrological Consultation',
        description: 'Personalized astrological reading based on your birth chart. Includes predictions, remedies, and guidance for life decisions.',
        category: 'ASTROLOGY',
        subcategory: 'Consultation',
        durationMinutes: 60,
        basePrice: 1200,
        isVirtual: true,
        requiresSamagri: false,
        instructions: 'Please provide your birth details (date, time, place). Consultation will be conducted via video call.',
        isActive: true,
        imageUrl: '/images/services/astrology.jpg',
        tags: ['astrology', 'birth chart', 'predictions', 'guidance'],
      },
      {
        name: 'Rudrabhishek',
        description: 'Sacred puja dedicated to Lord Shiva for removing obstacles, gaining strength, and achieving success.',
        category: 'POOJA',
        subcategory: 'Devotional',
        durationMinutes: 150,
        basePrice: 3000,
        isVirtual: false,
        requiresSamagri: true,
        instructions: 'Please specify if you want to perform at temple or home. Special arrangements may be needed.',
        isActive: true,
        imageUrl: '/images/services/rudrabhishek.jpg',
        tags: ['shiva', 'obstacles', 'strength', 'success'],
      },
      {
        name: 'Naming Ceremony (Namkaran)',
        description: 'Sacred ceremony to name your newborn child according to Vedic traditions.',
        category: 'POOJA',
        subcategory: 'Birth Ceremony',
        durationMinutes: 90,
        basePrice: 1500,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Please provide child\'s birth details and preferred name suggestions.',
        isActive: true,
        imageUrl: '/images/services/namkaran.jpg',
        tags: ['naming', 'newborn', 'blessings', 'horoscope'],
      },
      {
        name: 'Annaprashan (First Rice)',
        description: 'Sacred ceremony for baby\'s first solid food. Traditional ritual to bless the child with good health and prosperity.',
        category: 'POOJA',
        subcategory: 'Birth Ceremony',
        durationMinutes: 75,
        basePrice: 1200,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Please provide baby\'s age and preferred date.',
        isActive: true,
        imageUrl: '/images/services/annaprashan.jpg',
        tags: ['baby', 'first food', 'health', 'prosperity'],
      }
    ];

    console.log('📝 Adding services...');
    for (const service of services) {
      try {
        const response = await fetch(`${API_BASE}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(service),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Added service: ${service.name}`);
        } else {
          console.log(`❌ Failed to add service: ${service.name} - ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error adding service ${service.name}:`, error.message);
      }
    }

    console.log('🎉 Sample data addition completed!');
    
    // Test the services endpoint
    console.log('🔍 Testing services endpoint...');
    const servicesResponse = await fetch(`${API_BASE}/services`);
    const servicesData = await servicesResponse.json();
    console.log(`📊 Found ${servicesData.total} services in database`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSampleData();
