import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users (including pandits)
  const users = await Promise.all([
    // Regular users
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Rajesh',
        lastName: 'Kumar',
        phone: '+919876543210',
        role: 'USER',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Priya',
        lastName: 'Sharma',
        phone: '+919876543211',
        role: 'USER',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    
    // Pandit users
    prisma.user.upsert({
      where: { email: 'pandit1@example.com' },
      update: {},
      create: {
        email: 'pandit1@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Swami',
        lastName: 'Vishnu',
        phone: '+919876543212',
        role: 'PANDIT',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'pandit2@example.com' },
      update: {},
      create: {
        email: 'pandit2@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Acharya',
        lastName: 'Ram',
        phone: '+919876543213',
        role: 'PANDIT',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'pandit3@example.com' },
      update: {},
      create: {
        email: 'pandit3@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Pandit',
        lastName: 'Krishna',
        phone: '+919876543214',
        role: 'PANDIT',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'pandit4@example.com' },
      update: {},
      create: {
        email: 'pandit4@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Maharishi',
        lastName: 'Shiva',
        phone: '+919876543215',
        role: 'PANDIT',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
    
    // Admin user
    prisma.user.upsert({
      where: { email: 'admin@mantrasetu.com' },
      update: {},
      create: {
        email: 'admin@mantrasetu.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        phone: '+919876543216',
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Users created');

  // Get pandit users
  const panditUsers = users.filter(user => user.role === 'PANDIT');

  // Create pandit profiles
  const pandits = await Promise.all([
    prisma.pandit.upsert({
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
        bio: 'Experienced Vedic scholar with 15 years of practice in traditional Hindu rituals and astrology. Specializes in Grih Pravesh, marriage ceremonies, and astrological consultations.',
        education: 'Master of Sanskrit, Vedic Studies',
        achievements: ['Best Pandit Award 2023', 'Certified Astrologer', 'Vedic Scholar Recognition'],
      },
    }),
    prisma.pandit.upsert({
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
        bio: 'Devoted priest specializing in Satyanarayan Puja and Havan ceremonies. Known for authentic rituals and spiritual guidance.',
        education: 'Bachelor of Sanskrit, Religious Studies',
        achievements: ['Satyanarayan Puja Expert', 'Community Service Award'],
      },
    }),
    prisma.pandit.upsert({
      where: { userId: panditUsers[2].id },
      update: {},
      create: {
        userId: panditUsers[2].id,
        certificationNumber: 'PANDIT003',
        experienceYears: 20,
        specialization: ['Marriage Ceremonies', 'Naming Ceremony', 'Annaprashan'],
        languagesSpoken: ['Hindi', 'English', 'Bengali'],
        serviceAreas: ['Kolkata', 'Delhi', 'Gujarat'],
        hourlyRate: 3000,
        rating: 4.9,
        totalBookings: 234,
        isVerified: true,
        isAvailable: true,
        bio: 'Senior priest with 20 years of experience in conducting marriage ceremonies and family rituals. Expert in Bengali and North Indian traditions.',
        education: 'PhD in Religious Studies, Vedic Literature',
        achievements: ['Senior Priest Certification', 'Marriage Ceremony Expert', 'Cultural Heritage Award'],
      },
    }),
    prisma.pandit.upsert({
      where: { userId: panditUsers[3].id },
      update: {},
      create: {
        userId: panditUsers[3].id,
        certificationNumber: 'PANDIT004',
        experienceYears: 8,
        specialization: ['Online Puja', 'Virtual Consultations', 'Astrology'],
        languagesSpoken: ['Hindi', 'English', 'Telugu'],
        serviceAreas: ['Online', 'Hyderabad', 'Bangalore'],
        hourlyRate: 1500,
        rating: 4.4,
        totalBookings: 67,
        isVerified: true,
        isAvailable: true,
        bio: 'Modern pandit offering online puja services and virtual consultations. Combines traditional knowledge with modern technology.',
        education: 'Bachelor of Technology, Vedic Studies',
        achievements: ['Digital Puja Pioneer', 'Online Consultation Expert'],
      },
    }),
  ]);

  console.log('✅ Pandits created');

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Grih Pravesh Puja',
        description: 'Sacred housewarming ceremony to bless your new home and ensure prosperity, peace, and positive energy. Includes Vastu Shanti and purification rituals.',
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
    }),
    prisma.service.create({
      data: {
        name: 'Satyanarayan Puja',
        description: 'Sacred puja dedicated to Lord Vishnu to seek blessings for family harmony, prosperity, and fulfillment of wishes. Traditional ceremony with storytelling.',
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
    }),
    prisma.service.create({
      data: {
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
    }),
    prisma.service.create({
      data: {
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
    }),
    prisma.service.create({
      data: {
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
    }),
    prisma.service.create({
      data: {
        name: 'Rudrabhishek',
        description: 'Sacred puja dedicated to Lord Shiva for removing obstacles, gaining strength, and achieving success. Powerful ritual with special offerings.',
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
    }),
    prisma.service.create({
      data: {
        name: 'Naming Ceremony (Namkaran)',
        description: 'Sacred ceremony to name your newborn child according to Vedic traditions. Includes horoscope preparation and blessing rituals.',
        category: 'POOJA',
        subcategory: 'Birth Ceremony',
        durationMinutes: 90,
        basePrice: 1500,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Please provide child\'s birth details and preferred name suggestions. Ceremony will be conducted virtually.',
        isActive: true,
        imageUrl: '/images/services/namkaran.jpg',
        tags: ['naming', 'newborn', 'blessings', 'horoscope'],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Annaprashan (First Rice)',
        description: 'Sacred ceremony for baby\'s first solid food. Traditional ritual to bless the child with good health and prosperity.',
        category: 'POOJA',
        subcategory: 'Birth Ceremony',
        durationMinutes: 75,
        basePrice: 1200,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Please provide baby\'s age and preferred date. We will guide you through the traditional ceremony.',
        isActive: true,
        imageUrl: '/images/services/annaprashan.jpg',
        tags: ['baby', 'first food', 'health', 'prosperity'],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ganesh Chaturthi Puja',
        description: 'Special puja dedicated to Lord Ganesha for removing obstacles and bringing success. Includes idol installation and daily rituals.',
        category: 'POOJA',
        subcategory: 'Festival',
        durationMinutes: 120,
        basePrice: 2000,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Festival puja will be conducted virtually. We will provide guidance for daily worship.',
        isActive: true,
        imageUrl: '/images/services/ganesh-chaturthi.jpg',
        tags: ['ganesha', 'festival', 'obstacles', 'success'],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Durga Puja',
        description: 'Sacred puja dedicated to Goddess Durga for strength, protection, and victory over evil. Traditional Bengali and North Indian rituals.',
        category: 'POOJA',
        subcategory: 'Festival',
        durationMinutes: 180,
        basePrice: 2800,
        isVirtual: true,
        requiresSamagri: true,
        instructions: 'Festival puja with traditional rituals. We will guide you through the nine-day celebration.',
        isActive: true,
        imageUrl: '/images/services/durga-puja.jpg',
        tags: ['durga', 'festival', 'strength', 'protection'],
      },
    }),
  ]);

  console.log('✅ Services created');

  // Create some sample bookings
  const sampleBookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: users[0].id,
        panditId: pandits[0].id,
        serviceId: services[0].id,
        bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        bookingTime: '10:00',
        timezone: 'Asia/Kolkata',
        durationMinutes: 120,
        totalAmount: 2500,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialInstructions: 'Please bring all necessary materials for Grih Pravesh puja.',
      },
    }),
    prisma.booking.create({
      data: {
        userId: users[1].id,
        panditId: pandits[1].id,
        serviceId: services[1].id,
        bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        bookingTime: '14:00',
        timezone: 'Asia/Kolkata',
        durationMinutes: 180,
        totalAmount: 1800,
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        meetingLink: 'https://zoom.us/j/123456789',
        specialInstructions: 'Virtual Satyanarayan puja with family.',
      },
    }),
  ]);

  console.log('✅ Sample bookings created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`Created ${users.length} users, ${pandits.length} pandits, ${services.length} services, and ${sampleBookings.length} bookings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
