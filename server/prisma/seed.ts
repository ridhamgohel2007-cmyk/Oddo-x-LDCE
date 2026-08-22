import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.communityPost.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Diverse Community Authors & Users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@globetrotter.com',
      passwordHash,
      name: 'Ridham Gohel',
      role: 'ADMIN',
      phone: '+91 98765 43210',
      city: 'Ahmedabad',
      country: 'India',
      bio: 'GlobeTrotter Lead Administrator & Travel Curator',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'traveler@globetrotter.com',
      passwordHash,
      name: 'Jiyan Mansuri',
      role: 'USER',
      phone: '+91 91234 56789',
      city: 'Ahmedabad',
      country: 'India',
      bio: 'Avid traveler exploring India, Europe, Asia, and global continents',
      profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  // Author Diversity: User 3 (Elena Rostova - European Travel Specialist)
  const elenaUser = await prisma.user.create({
    data: {
      email: 'elena@globetrotter.com',
      passwordHash,
      name: 'Elena Rostova',
      role: 'USER',
      phone: '+33 1 42 68 55 00',
      city: 'Paris',
      country: 'France',
      bio: 'European art historian & romance travel curator based in Paris',
      profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      language: 'French & English',
    },
  });

  // Author Diversity: User 4 (Aarav Sharma - Himalayan Expedition Guide)
  const aaravUser = await prisma.user.create({
    data: {
      email: 'aarav@globetrotter.com',
      passwordHash,
      name: 'Aarav Sharma',
      role: 'USER',
      phone: '+91 98112 34567',
      city: 'Manali',
      country: 'India',
      bio: 'Himalayan overland adventure guide & high-altitude photographer',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      language: 'Hindi & English',
    },
  });

  console.log('Seeding Destinations...');

  const agra = await prisma.city.create({
    data: { name: 'Agra', country: 'India', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', description: 'Home to Taj Mahal, Agra Fort & Mehtab Bagh.', costIndex: 'MEDIUM', popularityScore: 99 },
  });

  const jaipur = await prisma.city.create({
    data: { name: 'Jaipur', country: 'India', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', description: 'Pink City of Rajasthan, famous for Hawa Mahal & Amer Fort.', costIndex: 'LOW', popularityScore: 98 },
  });

  const delhi = await prisma.city.create({
    data: { name: 'New Delhi', country: 'India', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', description: 'Capital of India featuring Qutub Minar & Red Fort.', costIndex: 'MEDIUM', popularityScore: 97 },
  });

  const ladakh = await prisma.city.create({
    data: { name: 'Ladakh (Leh)', country: 'India', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80', description: 'Land of High Passes & Pangong Lake.', costIndex: 'HIGH', popularityScore: 98 },
  });

  const manali = await prisma.city.create({
    data: { name: 'Manali', country: 'India', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', description: 'High-altitude Himalayan resort town in Himachal.', costIndex: 'MEDIUM', popularityScore: 97 },
  });

  const paris = await prisma.city.create({
    data: { name: 'Paris', country: 'France', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', description: 'The City of Light, famous for Eiffel Tower & Louvre.', costIndex: 'HIGH', popularityScore: 99 },
  });

  const rome = await prisma.city.create({
    data: { name: 'Rome', country: 'Italy', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', description: 'The Eternal City with Colosseum & Vatican City.', costIndex: 'MEDIUM', popularityScore: 97 },
  });

  const barcelona = await prisma.city.create({
    data: { name: 'Barcelona', country: 'Spain', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80', description: 'Gaudí Sagrada Família & Gothic Quarter.', costIndex: 'MEDIUM', popularityScore: 96 },
  });

  console.log('Seeding Sample Multi-City Trips...');

  // 1. Golden Triangle Trip (Authored by Jiyan Mansuri)
  const indiaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Incredible India: Golden Triangle & Royal Rajasthan',
      description: 'A 9-day epic journey across Delhi, Agra, and Jaipur discovering majestic forts, Taj Mahal sunrise, and royal palaces.',
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-14'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 150000,
    },
  });

  await prisma.tripStop.createMany({
    data: [
      { tripId: indiaTrip.id, cityId: delhi.id, title: 'Stop 1: Historic New Delhi', stopOrder: 1, startDate: new Date('2026-10-05'), endDate: new Date('2026-10-07'), budget: 35000 },
      { tripId: indiaTrip.id, cityId: agra.id, title: 'Stop 2: Taj Mahal & Agra Heritage', stopOrder: 2, startDate: new Date('2026-10-07'), endDate: new Date('2026-10-09'), budget: 35000 },
      { tripId: indiaTrip.id, cityId: jaipur.id, title: 'Stop 3: Pink City Jaipur Palaces', stopOrder: 3, startDate: new Date('2026-10-09'), endDate: new Date('2026-10-14'), budget: 80000 },
    ],
  });

  // 2. European Trip (Authored by Elena Rostova from Paris)
  const euroTrip = await prisma.trip.create({
    data: {
      userId: elenaUser.id,
      title: 'Grand European Romance & Culture (Paris, Rome, Barcelona)',
      description: 'A 10-day dream vacation through Paris, Rome, and Barcelona capturing art, food, and romantic sights.',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-20'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 220000,
    },
  });

  await prisma.tripStop.createMany({
    data: [
      { tripId: euroTrip.id, cityId: paris.id, title: 'Stop 1: Paris Light & Romance', stopOrder: 1, startDate: new Date('2026-09-10'), endDate: new Date('2026-09-14'), budget: 100000 },
      { tripId: euroTrip.id, cityId: rome.id, title: 'Stop 2: Rome Eternal Heritage', stopOrder: 2, startDate: new Date('2026-09-14'), endDate: new Date('2026-09-17'), budget: 70000 },
      { tripId: euroTrip.id, cityId: barcelona.id, title: 'Stop 3: Barcelona Coastal Charm', stopOrder: 3, startDate: new Date('2026-09-17'), endDate: new Date('2026-09-20'), budget: 50000 },
    ],
  });

  // 3. Himalayan Motorbike Overland Trip (Authored by Aarav Sharma from Manali)
  const himalayanTrip = await prisma.trip.create({
    data: {
      userId: aaravUser.id,
      title: 'Ultimate Himalayan Overland Expedition (Manali to Ladakh)',
      description: 'A 7-day high-altitude adventure across Rohtang Pass, Keylong, Nubra Valley, and Pangong Tso Lake.',
      coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-07-15'),
      endDate: new Date('2026-07-22'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 85000,
    },
  });

  await prisma.tripStop.createMany({
    data: [
      { tripId: himalayanTrip.id, cityId: manali.id, title: 'Stop 1: Manali Base Camp', stopOrder: 1, startDate: new Date('2026-07-15'), endDate: new Date('2026-07-17'), budget: 25000 },
      { tripId: himalayanTrip.id, cityId: ladakh.id, title: 'Stop 2: Leh Ladakh High Passes', stopOrder: 2, startDate: new Date('2026-07-17'), endDate: new Date('2026-07-22'), budget: 60000 },
    ],
  });

  console.log('Seeding Diverse Community Posts...');

  await prisma.communityPost.create({
    data: {
      tripId: euroTrip.id,
      authorId: elenaUser.id,
      title: '10 Days Ultimate European Romance (Paris, Rome, Barcelona)',
      description: 'Detailed day-by-day budget friendly itinerary created by Elena Rostova with museum passes, Eiffel Tower entry, and Colosseum guides!',
      likesCount: 342,
      clonesCount: 98,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: indiaTrip.id,
      authorId: demoUser.id,
      title: 'Golden Triangle India (Delhi, Agra, Jaipur) Complete 9-Day Itinerary',
      description: 'Complete travel plan created by Jiyan Mansuri with sunrise Taj Mahal entry tips, private car hiring advice, and authentic Rajasthani food spots!',
      likesCount: 289,
      clonesCount: 84,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: himalayanTrip.id,
      authorId: aaravUser.id,
      title: 'High-Altitude Overland Expedition: Manali to Leh Ladakh',
      description: 'Rugged mountain pass route guide curated by Himalayan expert Aarav Sharma with bike rental advice & AMS survival tips!',
      likesCount: 412,
      clonesCount: 125,
    },
  });

  console.log('Database seeding finished with diverse community authors and multi-city stops!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
