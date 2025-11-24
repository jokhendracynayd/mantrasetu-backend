// Simple direct database seeding using raw SQL
const { Client } = require('pg');

async function seedDatabase() {
  console.log('🌱 Starting direct database seeding...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://erp:iiterp@localhost:5432/mantrasetu',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Insert services
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
      }
    ];

    console.log('📝 Inserting services...');
    for (const service of services) {
      const query = `
        INSERT INTO services (id, name, description, category, subcategory, "durationMinutes", "basePrice", "isVirtual", "requiresSamagri", instructions, "isActive", "imageUrl", tags, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      
      const values = [
        service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        service.name,
        service.description,
        service.category,
        service.subcategory,
        service.durationMinutes,
        service.basePrice,
        service.isVirtual,
        service.requiresSamagri,
        service.instructions,
        service.isActive,
        service.imageUrl,
        `{${service.tags.map(tag => `"${tag}"`).join(',')}}`,
      ];

      try {
        await client.query(query, values);
        console.log(`✅ Inserted service: ${service.name}`);
      } catch (error) {
        console.log(`❌ Error inserting service ${service.name}:`, error.message);
      }
    }

    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await client.end();
  }
}

seedDatabase();
