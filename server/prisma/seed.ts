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

  console.log('Seeding Users...');
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

  console.log('Seeding Destinations across ALL Continents (Asia, Europe, North America, South America, Africa, Oceania)...');

  // --- 1. ASIA (INDIA & INTERNATIONAL ASIA) ---
  const agra = await prisma.city.create({
    data: {
      name: 'Agra',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      description: 'Home to the iconic Taj Mahal - one of the Seven Wonders of the World, Mughal architecture, Agra Fort, and Mehtab Bagh.',
      costIndex: 'MEDIUM',
      popularityScore: 99,
    },
  });

  const jaipur = await prisma.city.create({
    data: {
      name: 'Jaipur',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      description: 'The majestic Pink City of Rajasthan, famous for Hawa Mahal, Amer Fort, grand royal palaces, and Johari Bazaar shopping.',
      costIndex: 'LOW',
      popularityScore: 98,
    },
  });

  const mumbai = await prisma.city.create({
    data: {
      name: 'Mumbai',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      description: 'The vibrant financial capital of India, famous for Gateway of India, Marine Drive promenade, Bollywood, and coastal street food.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const goa = await prisma.city.create({
    data: {
      name: 'Goa',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      description: 'India premier beach paradise with golden sands, Portuguese heritage, water sports, vibrant nightlife, and spice plantations.',
      costIndex: 'MEDIUM',
      popularityScore: 98,
    },
  });

  const varanasi = await prisma.city.create({
    data: {
      name: 'Varanasi',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'The spiritual capital of India along the sacred Ganges river, famous for ancient ghats, evening Ganga Aarti, and Kashi Vishwanath temple.',
      costIndex: 'LOW',
      popularityScore: 95,
    },
  });

  const delhi = await prisma.city.create({
    data: {
      name: 'New Delhi',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      description: 'The historic capital of India featuring Qutub Minar, India Gate, Red Fort, Humayun Tomb, and famous Chandni Chowk street food.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const udaipur = await prisma.city.create({
    data: {
      name: 'Udaipur',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Lakes, renowned for romantic Lake Pichola boat cruises, grand City Palace, and heritage havelis.',
      costIndex: 'MEDIUM',
      popularityScore: 95,
    },
  });

  const ahmedabad = await prisma.city.create({
    data: {
      name: 'Ahmedabad',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      description: "India's first UNESCO World Heritage City, famous for Sabarmati Ashram, Kankaria Lake, Adalaj Stepwell, and Gujarati cuisine.",
      costIndex: 'LOW',
      popularityScore: 94,
    },
  });

  // --- 2. EUROPE ---
  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Light, famous for Eiffel Tower, Louvre Museum, world-class gastronomy and romantic Seine river cruises.',
      costIndex: 'HIGH',
      popularityScore: 99,
    },
  });

  const rome = await prisma.city.create({
    data: {
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'The Eternal City with thousands of years of history, Colosseum, Vatican City, Trevi Fountain, and authentic pasta & gelato.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const barcelona = await prisma.city.create({
    data: {
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
      description: 'Cosmopolitan Mediterranean capital famous for Gaudí Sagrada Família, Park Güell, Gothic Quarter, and sunny beaches.',
      costIndex: 'MEDIUM',
      popularityScore: 96,
    },
  });

  console.log('Seeding Sample Multi-City Trips for Jiyan Mansuri...');

  // Indian Golden Triangle Trip
  const indiaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Incredible India: Golden Triangle & Royal Rajasthan',
      description: 'A 9-day epic journey across Delhi, Agra, Jaipur, and Udaipur discovering majestic forts, Taj Mahal sunrise, and royal palaces.',
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

  // European Trip with 3 FULL City Stops (Paris, Rome, Barcelona) for Consistency (Item 5)
  const euroTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Grand European Romance & Culture',
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
      { tripId: euroTrip.id, cityId: barcelona.id, title: 'Stop 3: Barcelona Mediterranean Coast', stopOrder: 3, startDate: new Date('2026-09-17'), endDate: new Date('2026-09-20'), budget: 50000 },
    ],
  });

  console.log('Database seeding finished with 3 city stops for Grand European trip!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
