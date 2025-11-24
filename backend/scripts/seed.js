const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create sample users
    const users = [];
    
    // Regular users
    users.push(await prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Rajesh',
        lastName: 'Kumar',
        phone: '+919876543210',
        role: 'USER',
        isEmailVerified: true,
        isVerified: true,
      },
    }));

    users.push(await prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Priya',
        lastName: 'Sharma',
        phone: '+919876543211',
        role: 'USER',
        isEmailVerified: true,
        isVerified: true,
      },
    }));

    // Pandit users
    users.push(await prisma.user.upsert({
      where: { email: 'pandit1@example.com' },
      update: {},
      create: {
        email: 'pandit1@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Swami',
        lastName: 'Vishnu',
        phone: '+919876543212',
        role: 'PANDIT',
        isEmailVerified: true,
        isVerified: true,
      },
    }));

    users.push(await prisma.user.upsert({
      where: { email: 'pandit2@example.com' },
      update: {},
      create: {
        email: 'pandit2@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Acharya',
        lastName: 'Ram',
        phone: '+919876543213',
        role: 'PANDIT',
        isEmailVerified: true,
        isVerified: true,
      },
    }));

    console.log('✅ Users created');

    // Get pandit users
    const panditUsers = users.filter(user => user.role === 'PANDIT');

    // Create pandit profiles
    await prisma.pandit.upsert({
      where: { userId: panditUsers[0].id },
      update: {},
      create: {
        userId: panditUsers[0].id,
        certificationNumber: 'PANDIT001',
        experienceYears: 15,
        specialization: ['Vedic Puja', 'Astrology', 'Grih Pravesh'],
        languagesSpoken: ['Hindi', 'English', 'Sanskrit'],
        serviceAreas: ['Delhi', 'Mumbai', 'Bangalore'],
        hourlyRate: 2500,
        rating: 4.8,
        totalBookings: 156,
        isVerified: true,
        isAvailable: true,
        bio: 'Experienced Vedic scholar with 15 years of practice in traditional Hindu rituals and astrology.',
        education: 'Master of Sanskrit, Vedic Studies',
        achievements: ['Best Pandit Award 2023', 'Certified Astrologer', 'Vedic Scholar Recognition'],
      },
    });

    await prisma.pandit.upsert({
      where: { userId: panditUsers[1].id },
      update: {},
      create: {
        userId: panditUsers[1].id,
        certificationNumber: 'PANDIT002',
        experienceYears: 12,
        specialization: ['Satyanarayan Puja', 'Havan', 'Rudrabhishek'],
        languagesSpoken: ['Hindi', 'English', 'Tamil'],
        serviceAreas: ['Chennai', 'Hyderabad', 'Pune'],
        hourlyRate: 2000,
        rating: 4.6,
        totalBookings: 98,
        isVerified: true,
        isAvailable: true,
        bio: 'Devoted priest specializing in Satyanarayan Puja and Havan ceremonies.',
        education: 'Bachelor of Sanskrit, Religious Studies',
        achievements: ['Satyanarayan Puja Expert', 'Community Service Award'],
      },
    });

    console.log('✅ Pandits created');

    // Create services
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

    for (const service of services) {
      await prisma.service.upsert({
        where: { name: service.name },
        update: {},
        create: service,
      });
    }

    console.log('✅ Services created');
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
