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

  console.log('Seeding Diverse Global Community Authors...');
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

  const jiyanUser = await prisma.user.create({
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

  const sophiaUser = await prisma.user.create({
    data: {
      email: 'sophia@globetrotter.com',
      passwordHash,
      name: 'Sophia Chen',
      role: 'USER',
      phone: '+65 6789 1234',
      city: 'Singapore',
      country: 'Singapore',
      bio: 'Southeast Asia food & tropical island wellness seeker',
      profilePic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      language: 'English & Mandarin',
    },
  });

  const marcusUser = await prisma.user.create({
    data: {
      email: 'marcus@globetrotter.com',
      passwordHash,
      name: 'Marcus Vance',
      role: 'USER',
      phone: '+1 310 555 0199',
      city: 'Los Angeles',
      country: 'United States',
      bio: 'Pacific coast road tripper & national park explorer',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  const tariqUser = await prisma.user.create({
    data: {
      email: 'tariq@globetrotter.com',
      passwordHash,
      name: 'Tariq Al-Mansoor',
      role: 'USER',
      phone: '+20 2 2794 0000',
      city: 'Cairo',
      country: 'Egypt',
      bio: 'Nile heritage guide & Egyptology scholar',
      profilePic: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      language: 'Arabic & English',
    },
  });

  const camilaUser = await prisma.user.create({
    data: {
      email: 'camila@globetrotter.com',
      passwordHash,
      name: 'Camila Silva',
      role: 'USER',
      phone: '+55 21 99876 5432',
      city: 'Rio de Janeiro',
      country: 'Brazil',
      bio: 'South American trekker & samba culture enthusiast',
      profilePic: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      language: 'Portuguese & Spanish',
    },
  });

  console.log('Seeding Global Destinations...');

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

  const bali = await prisma.city.create({
    data: { name: 'Bali', country: 'Indonesia', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', description: 'Tropical island paradise with rice terraces & Hindu sea temples.', costIndex: 'LOW', popularityScore: 95 },
  });

  const losangeles = await prisma.city.create({
    data: { name: 'Los Angeles', country: 'United States', region: 'North America', imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80', description: 'Hollywood, Pacific coast & Santa Monica pier.', costIndex: 'HIGH', popularityScore: 96 },
  });

  const cairo = await prisma.city.create({
    data: { name: 'Cairo', country: 'Egypt', region: 'Africa', imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80', description: 'Giza Pyramids, Sphinx & Khan el-Khalili bazaar.', costIndex: 'LOW', popularityScore: 98 },
  });

  const riodejaneiro = await prisma.city.create({
    data: { name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80', description: 'Christ the Redeemer statue, Copacabana & Sugarloaf mountain.', costIndex: 'MEDIUM', popularityScore: 97 },
  });

  const cusco = await prisma.city.create({
    data: { name: 'Cusco (Machu Picchu)', country: 'Peru', region: 'South America', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80', description: 'Inca Empire citadel in the Andes mountains.', costIndex: 'LOW', popularityScore: 98 },
  });

  console.log('Seeding Sample Multi-City Trips for Community Feed...');

  // 1. European Romance (Authored by Elena Rostova from Paris)
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

  // 2. Golden Triangle (Authored by Jiyan Mansuri)
  const indiaTrip = await prisma.trip.create({
    data: {
      userId: jiyanUser.id,
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

  // 3. Himalayan Motorbike (Authored by Aarav Sharma from Manali)
  const himalayanTrip = await prisma.trip.create({
    data: {
      userId: aaravUser.id,
      title: 'Ultimate Himalayan Overland Expedition (Manali to Leh Ladakh)',
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

  // 4. Bali Tropical Retreat (Authored by Sophia Chen from Singapore)
  const baliTrip = await prisma.trip.create({
    data: {
      userId: sophiaUser.id,
      title: 'Tropical Island Paradise & Wellness Retreat in Bali',
      description: '7 days in Ubud rice terraces, Uluwatu sea temples, and Seminyak sunset beach clubs.',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-08'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 95000,
    },
  });
  await prisma.tripStop.create({
    data: { tripId: baliTrip.id, cityId: bali.id, title: 'Stop 1: Ubud & Seminyak', stopOrder: 1, startDate: new Date('2026-11-01'), endDate: new Date('2026-11-08'), budget: 95000 },
  });

  // 5. US West Coast Road Trip (Authored by Marcus Vance from LA)
  const usRoadTrip = await prisma.trip.create({
    data: {
      userId: marcusUser.id,
      title: 'Pacific Coast Highway 1 Scenic Road Trip',
      description: 'Coastal drive from Los Angeles through Big Sur to Northern California and Vancouver.',
      coverImage: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-18'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 180000,
    },
  });
  await prisma.tripStop.create({
    data: { tripId: usRoadTrip.id, cityId: losangeles.id, title: 'Stop 1: Los Angeles & Highway 1', stopOrder: 1, startDate: new Date('2026-08-10'), endDate: new Date('2026-08-18'), budget: 180000 },
  });

  // 6. Wonders of Egypt & Nile (Authored by Tariq Al-Mansoor from Cairo)
  const egyptTrip = await prisma.trip.create({
    data: {
      userId: tariqUser.id,
      title: 'Pyramids of Giza & Ancient Nile River Cruise',
      description: 'Explore the Great Pyramids, Sphinx, Egyptian Museum, and Nile luxury felucca sailing.',
      coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-12-05'),
      endDate: new Date('2026-12-12'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 120000,
    },
  });
  await prisma.tripStop.create({
    data: { tripId: egyptTrip.id, cityId: cairo.id, title: 'Stop 1: Cairo & Giza Citadel', stopOrder: 1, startDate: new Date('2026-12-05'), endDate: new Date('2026-12-12'), budget: 120000 },
  });

  // 7. South American Expedition (Authored by Camila Silva from Rio)
  const southAmericaTrip = await prisma.trip.create({
    data: {
      userId: camilaUser.id,
      title: 'South American Wonders: Rio Beaches to Machu Picchu Citadel',
      description: 'A 12-day epic itinerary across Rio de Janeiro samba beaches and Andean mountain trails to Machu Picchu.',
      coverImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1000&q=80',
      startDate: new Date('2026-11-15'),
      endDate: new Date('2026-11-27'),
      status: 'UPCOMING',
      isPublic: true,
      totalBudget: 240000,
    },
  });
  await prisma.tripStop.createMany({
    data: [
      { tripId: southAmericaTrip.id, cityId: riodejaneiro.id, title: 'Stop 1: Rio Coastal Samba', stopOrder: 1, startDate: new Date('2026-11-15'), endDate: new Date('2026-11-20'), budget: 110000 },
      { tripId: southAmericaTrip.id, cityId: cusco.id, title: 'Stop 2: Machu Picchu Inca Citadel', stopOrder: 2, startDate: new Date('2026-11-20'), endDate: new Date('2026-11-27'), budget: 130000 },
    ],
  });

  console.log('Seeding Rich Community Posts...');

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
      authorId: jiyanUser.id,
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

  await prisma.communityPost.create({
    data: {
      tripId: baliTrip.id,
      authorId: sophiaUser.id,
      title: '7 Days Tropical Bali Wellness & Waterfall Trail',
      description: 'Ubud sacred monkey forest, Tegalalang rice terrace sunrise photography, and Seminyak sunset beach club itinerary curated by Sophia Chen!',
      likesCount: 518,
      clonesCount: 176,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: usRoadTrip.id,
      authorId: marcusUser.id,
      title: 'Pacific Coast Highway 1 Scenic Road Trip Guide',
      description: 'California coastal drives from Los Angeles to Big Sur & San Francisco with scenic viewpoint pull-outs and seafood dining stops.',
      likesCount: 275,
      clonesCount: 64,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: egyptTrip.id,
      authorId: tariqUser.id,
      title: 'Ancient Wonders of Egypt: Giza Pyramids & Nile Felucca Sailing',
      description: 'Authentic 7-day archaeological tour curated by Cairo native Tariq Al-Mansoor with Sphinx entry passes and Khan el-Khalili bazaar tips!',
      likesCount: 388,
      clonesCount: 110,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: southAmericaTrip.id,
      authorId: camilaUser.id,
      title: 'South American Dreams: Rio De Janeiro to Machu Picchu Inca Trail',
      description: 'Epic 12-day journey linking Christ the Redeemer in Rio to high Andes mountain clouds in Peru!',
      likesCount: 460,
      clonesCount: 142,
    },
  });

  console.log('Database seeding completed with 7 rich community posts across diverse authors!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
