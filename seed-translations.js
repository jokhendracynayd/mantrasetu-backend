const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const translations = [
  // Header translations
  { key: 'header.home', language: 'en', value: 'Home', namespace: 'common' },
  { key: 'header.home', language: 'hi', value: 'होम', namespace: 'common' },
  { key: 'header.services', language: 'en', value: 'Services', namespace: 'common' },
  { key: 'header.services', language: 'hi', value: 'सेवाएं', namespace: 'common' },
  { key: 'header.spiritualTools', language: 'en', value: 'Spiritual Tools', namespace: 'common' },
  { key: 'header.spiritualTools', language: 'hi', value: 'आध्यात्मिक उपकरण', namespace: 'common' },
  { key: 'header.panchang', language: 'en', value: 'Panchang', namespace: 'common' },
  { key: 'header.panchang', language: 'hi', value: 'पंचांग', namespace: 'common' },
  { key: 'header.muhuratFinder', language: 'en', value: 'Muhurat Finder', namespace: 'common' },
  { key: 'header.muhuratFinder', language: 'hi', value: 'मुहूर्त खोजक', namespace: 'common' },
  { key: 'header.rashifal', language: 'en', value: 'Rashifal', namespace: 'common' },
  { key: 'header.rashifal', language: 'hi', value: 'राशिफल', namespace: 'common' },
  { key: 'header.kundaliCreation', language: 'en', value: 'Kundali Creation', namespace: 'common' },
  { key: 'header.kundaliCreation', language: 'hi', value: 'कुंडली निर्माण', namespace: 'common' },
  { key: 'header.gemstoneGuide', language: 'en', value: 'Gemstone Guide', namespace: 'common' },
  { key: 'header.gemstoneGuide', language: 'hi', value: 'रत्न गाइड', namespace: 'common' },
  { key: 'header.choghadiya', language: 'en', value: 'Choghadiya', namespace: 'common' },
  { key: 'header.choghadiya', language: 'hi', value: 'चौघड़िया', namespace: 'common' },
  { key: 'header.myBookings', language: 'en', value: 'My Bookings', namespace: 'common' },
  { key: 'header.myBookings', language: 'hi', value: 'मेरी बुकिंग', namespace: 'common' },
  { key: 'header.dashboard', language: 'en', value: 'Dashboard', namespace: 'common' },
  { key: 'header.dashboard', language: 'hi', value: 'डैशबोर्ड', namespace: 'common' },
  { key: 'header.manageBookings', language: 'en', value: 'Manage Bookings', namespace: 'common' },
  { key: 'header.manageBookings', language: 'hi', value: 'बुकिंग प्रबंधन', namespace: 'common' },
  { key: 'header.earnings', language: 'en', value: 'Earnings', namespace: 'common' },
  { key: 'header.earnings', language: 'hi', value: 'आय', namespace: 'common' },
  { key: 'header.contact', language: 'en', value: 'Contact', namespace: 'common' },
  { key: 'header.contact', language: 'hi', value: 'संपर्क', namespace: 'common' },
  
  // Hero section translations
  { key: 'hero.tagline', language: 'en', value: 'Authentic Pujas. Verified Panditjis. Divine Experience.', namespace: 'common' },
  { key: 'hero.tagline', language: 'hi', value: 'प्रामाणिक पूजा। सत्यापित पंडितजी। दिव्य अनुभव।', namespace: 'common' },
  { key: 'hero.title.part1', language: 'en', value: 'Where Mantras Flow,', namespace: 'common' },
  { key: 'hero.title.part1', language: 'hi', value: 'जहां मंत्र बहते हैं,', namespace: 'common' },
  { key: 'hero.title.part2', language: 'en', value: 'Divinity Grows', namespace: 'common' },
  { key: 'hero.title.part2', language: 'hi', value: 'दिव्यता बढ़ती है', namespace: 'common' },
  { key: 'hero.description', language: 'en', value: 'Connect with authentic Pandit services, live darshans, and spiritual guidance. Experience India\'s sacred traditions through our trusted platform.', namespace: 'common' },
  { key: 'hero.description', language: 'hi', value: 'प्रामाणिक पंडित सेवाओं, लाइव दर्शन और आध्यात्मिक मार्गदर्शन से जुड़ें। हमारे विश्वसनीय प्लेटफॉर्म के माध्यम से भारत की पवित्र परंपराओं का अनुभव करें।', namespace: 'common' },
  { key: 'hero.button.bookService', language: 'en', value: 'Book a Service', namespace: 'common' },
  { key: 'hero.button.bookService', language: 'hi', value: 'सेवा बुक करें', namespace: 'common' },
];

async function seedTranslations() {
  console.log('🌱 Seeding translations...');

  try {
    for (const translation of translations) {
      await prisma.translation.upsert({
        where: {
          key_language_namespace: {
            key: translation.key,
            language: translation.language,
            namespace: translation.namespace,
          },
        },
        update: {
          value: translation.value,
        },
        create: translation,
      });
      console.log(`✓ Added/Updated: ${translation.key} (${translation.language})`);
    }

    console.log(`\n✅ Successfully seeded ${translations.length} translations!`);
  } catch (error) {
    console.error('❌ Error seeding translations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedTranslations()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

