// Simple direct database seeding for pandits using raw SQL
const { Client } = require('pg');

async function seedPandits() {
  console.log('🌱 Starting pandit seeding...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://erp:iiterp@localhost:5432/mantrasetu',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // First, create pandit users
    const panditUsers = [
      {
        id: 'pandit_user_1',
        email: 'pandit1@example.com',
        passwordHash: '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF',
        firstName: 'Swami',
        lastName: 'Vishnu',
        phone: '+919876543212',
        role: 'PANDIT',
        isVerified: true,
      },
      {
        id: 'pandit_user_2',
        email: 'pandit2@example.com',
        passwordHash: '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF',
        firstName: 'Acharya',
        lastName: 'Ram',
        phone: '+919876543213',
        role: 'PANDIT',
        isVerified: true,
      },
      {
        id: 'pandit_user_3',
        email: 'pandit3@example.com',
        passwordHash: '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF',
        firstName: 'Pandit',
        lastName: 'Krishna',
        phone: '+919876543214',
        role: 'PANDIT',
        isVerified: true,
      },
      {
        id: 'pandit_user_4',
        email: 'pandit4@example.com',
        passwordHash: '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF',
        firstName: 'Maharishi',
        lastName: 'Shiva',
        phone: '+919876543215',
        role: 'PANDIT',
        isVerified: true,
      }
    ];

    console.log('📝 Inserting pandit users...');
    for (const user of panditUsers) {
      const userQuery = `
        INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, role, "isVerified", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      
      const userValues = [
        user.id,
        user.email,
        user.passwordHash,
        user.firstName,
        user.lastName,
        user.phone,
        user.role,
        user.isVerified,
      ];

      try {
        await client.query(userQuery, userValues);
        console.log(`✅ Inserted user: ${user.firstName} ${user.lastName}`);
      } catch (error) {
        console.log(`❌ Error inserting user ${user.firstName}:`, error.message);
      }
    }

    // Then, create pandit profiles
    const panditProfiles = [
      {
        id: 'pandit_profile_1',
        userId: 'pandit_user_1',
        certificationNumber: 'PANDIT001',
        experienceYears: 15,
        specialization: '{Vedic Puja,Astrology,Grih Pravesh}',
        languagesSpoken: '{Hindi,English,Sanskrit}',
        serviceAreas: '{Delhi,Mumbai,Bangalore}',
        hourlyRate: 2500,
        rating: 4.8,
        totalBookings: 156,
        isVerified: true,
        isAvailable: true,
        bio: 'Experienced Vedic scholar with 15 years of practice in traditional Hindu rituals and astrology.',
        education: 'Master of Sanskrit, Vedic Studies',
        achievements: '{Best Pandit Award 2023,Certified Astrologer,Vedic Scholar Recognition}',
      },
      {
        id: 'pandit_profile_2',
        userId: 'pandit_user_2',
        certificationNumber: 'PANDIT002',
        experienceYears: 12,
        specialization: '{Satyanarayan Puja,Havan,Rudrabhishek}',
        languagesSpoken: '{Hindi,English,Tamil}',
        serviceAreas: '{Chennai,Hyderabad,Pune}',
        hourlyRate: 2000,
        rating: 4.6,
        totalBookings: 98,
        isVerified: true,
        isAvailable: true,
        bio: 'Devoted priest specializing in Satyanarayan Puja and Havan ceremonies.',
        education: 'Bachelor of Sanskrit, Religious Studies',
        achievements: '{Satyanarayan Puja Expert,Community Service Award}',
      },
      {
        id: 'pandit_profile_3',
        userId: 'pandit_user_3',
        certificationNumber: 'PANDIT003',
        experienceYears: 20,
        specialization: '{Marriage Ceremonies,Naming Ceremony,Annaprashan}',
        languagesSpoken: '{Hindi,English,Bengali}',
        serviceAreas: '{Kolkata,Delhi,Gujarat}',
        hourlyRate: 3000,
        rating: 4.9,
        totalBookings: 234,
        isVerified: true,
        isAvailable: true,
        bio: 'Senior priest with 20 years of experience in conducting marriage ceremonies and family rituals.',
        education: 'PhD in Religious Studies, Vedic Literature',
        achievements: '{Senior Priest Certification,Marriage Ceremony Expert,Cultural Heritage Award}',
      },
      {
        id: 'pandit_profile_4',
        userId: 'pandit_user_4',
        certificationNumber: 'PANDIT004',
        experienceYears: 8,
        specialization: '{Online Puja,Virtual Consultations,Astrology}',
        languagesSpoken: '{Hindi,English,Telugu}',
        serviceAreas: '{Online,Hyderabad,Bangalore}',
        hourlyRate: 1500,
        rating: 4.4,
        totalBookings: 67,
        isVerified: true,
        isAvailable: true,
        bio: 'Modern pandit offering online puja services and virtual consultations.',
        education: 'Bachelor of Technology, Vedic Studies',
        achievements: '{Digital Puja Pioneer,Online Consultation Expert}',
      }
    ];

    console.log('📝 Inserting pandit profiles...');
    for (const pandit of panditProfiles) {
      const panditQuery = `
        INSERT INTO pandits (id, "userId", "certificationNumber", "experienceYears", specialization, "languagesSpoken", "serviceAreas", "hourlyRate", rating, "totalBookings", "isVerified", "isAvailable", bio, education, achievements, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      
      const panditValues = [
        pandit.id,
        pandit.userId,
        pandit.certificationNumber,
        pandit.experienceYears,
        pandit.specialization,
        pandit.languagesSpoken,
        pandit.serviceAreas,
        pandit.hourlyRate,
        pandit.rating,
        pandit.totalBookings,
        pandit.isVerified,
        pandit.isAvailable,
        pandit.bio,
        pandit.education,
        pandit.achievements,
      ];

      try {
        await client.query(panditQuery, panditValues);
        console.log(`✅ Inserted pandit profile: ${pandit.certificationNumber}`);
      } catch (error) {
        console.log(`❌ Error inserting pandit ${pandit.certificationNumber}:`, error.message);
      }
    }

    console.log('🎉 Pandit seeding completed!');

  } catch (error) {
    console.error('❌ Pandit seeding failed:', error);
  } finally {
    await client.end();
  }
}

seedPandits();
