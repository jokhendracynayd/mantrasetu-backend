// Seed availability data for pandits
const { Client } = require('pg');

async function seedAvailability() {
  console.log('🌱 Starting availability seeding...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://erp:iiterp@localhost:5432/mantrasetu',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Availability data for each pandit
    const availabilityData = [
      // Pandit 1 - Swami Vishnu
      { panditId: 'pandit_profile_1', dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 6, startTime: '10:00', endTime: '16:00', isActive: true },
      { panditId: 'pandit_profile_1', dayOfWeek: 0, startTime: '10:00', endTime: '16:00', isActive: true },

      // Pandit 2 - Acharya Ram
      { panditId: 'pandit_profile_2', dayOfWeek: 1, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 2, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 3, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 4, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 5, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 6, startTime: '09:00', endTime: '18:00', isActive: true },
      { panditId: 'pandit_profile_2', dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: true },

      // Pandit 3 - Pandit Krishna
      { panditId: 'pandit_profile_3', dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 6, startTime: '11:00', endTime: '17:00', isActive: true },
      { panditId: 'pandit_profile_3', dayOfWeek: 0, startTime: '11:00', endTime: '17:00', isActive: true },

      // Pandit 4 - Maharishi Shiva
      { panditId: 'pandit_profile_4', dayOfWeek: 1, startTime: '06:00', endTime: '22:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 2, startTime: '06:00', endTime: '22:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 3, startTime: '06:00', endTime: '22:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 4, startTime: '06:00', endTime: '22:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 5, startTime: '06:00', endTime: '22:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 6, startTime: '08:00', endTime: '20:00', isActive: true },
      { panditId: 'pandit_profile_4', dayOfWeek: 0, startTime: '08:00', endTime: '20:00', isActive: true },
    ];

    console.log('📝 Inserting availability data...');
    for (const availability of availabilityData) {
      const availabilityQuery = `
        INSERT INTO availability (id, "panditId", "dayOfWeek", "startTime", "endTime", "isActive", "createdAt", "updatedAt")
        VALUES ($6, $1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `;
      
      const availabilityValues = [
        availability.panditId,
        availability.dayOfWeek,
        availability.startTime,
        availability.endTime,
        availability.isActive,
        `avail_${availability.panditId}_${availability.dayOfWeek}_${Date.now()}`,
      ];

      try {
        await client.query(availabilityQuery, availabilityValues);
        console.log(`✅ Inserted availability for pandit ${availability.panditId} on day ${availability.dayOfWeek}`);
      } catch (error) {
        console.log(`❌ Error inserting availability:`, error.message);
      }
    }

    console.log('🎉 Availability seeding completed!');

  } catch (error) {
    console.error('❌ Availability seeding failed:', error);
  } finally {
    await client.end();
  }
}

seedAvailability();
