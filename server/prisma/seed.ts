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
      name: 'Alex Morgan',
      role: 'ADMIN',
      phone: '+1 555 019 2831',
      city: 'San Francisco',
      country: 'USA',
      bio: 'GlobeTrotter Administrator & Avid Backpacker',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'traveler@globetrotter.com',
      passwordHash,
      name: 'Elena Rostova',
      role: 'USER',
      phone: '+1 415 882 1049',
      city: 'Chicago',
      country: 'USA',
      bio: 'Wanderlust soul exploring Europe, Asia and Incredible India.',
      profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  console.log('Seeding Indian Cities & Global Destinations...');

  // Indian Cities
  const agra = await prisma.city.create({
    data: {
      name: 'Agra',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      description: 'Home to the iconic Taj Mahal - one of the Seven Wonders of the World, Mughal grandeur, Agra Fort, and Mehtab Bagh sunset views.',
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
      description: 'The majestic Pink City of Rajasthan, famous for Hawa Mahal, Amer Fort, grand palaces, vibrant bazaars, and royal heritage.',
      costIndex: 'LOW',
      popularityScore: 97,
    },
  });

  const mumbai = await prisma.city.create({
    data: {
      name: 'Mumbai',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      description: 'The vibrant financial capital of India, famous for Gateway of India, Marine Drive promenade, Bollywood studios, and street food.',
      costIndex: 'MEDIUM',
      popularityScore: 96,
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
      popularityScore: 96,
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
      popularityScore: 94,
    },
  });

  const kerala = await prisma.city.create({
    data: {
      name: 'Kerala (Alleppey)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Gods Own Country, famous for serene backwater houseboat cruises, coconut groves, Ayurvedic wellness, and tea gardens.',
      costIndex: 'MEDIUM',
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
      popularityScore: 95,
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
      popularityScore: 93,
    },
  });

  // Global Cities
  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Light, famous for Eiffel Tower, Louvre Museum, world-class gastronomy and romantic boulevards.',
      costIndex: 'HIGH',
      popularityScore: 98,
    },
  });

  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-modern metropolis seamlessly blending futuristic skyscrapers, neon lights, ancient temples and sublime food.',
      costIndex: 'HIGH',
      popularityScore: 96,
    },
  });

  const rome = await prisma.city.create({
    data: {
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'The Eternal City with thousands of years of history, Colosseum, Vatican City, gelato, and cobblestone plazas.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
    },
  });

  const bali = await prisma.city.create({
    data: {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Tropical paradise known for lush rice terraces, sacred Hindu temples, surfing beaches, and wellness retreats.',
      costIndex: 'LOW',
      popularityScore: 92,
    },
  });

  console.log('Seeding Activities for Indian and International Cities...');

  // Indian Activities
  const tajMahal = await prisma.activity.create({
    data: {
      cityId: agra.id,
      title: 'Taj Mahal Sunrise VIP Guided Tour',
      description: 'Witness the breathtaking marble monument of love bathed in golden dawn light with expert storytelling.',
      category: 'Sightseeing',
      estimatedCost: 30,
      durationHours: 3.0,
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    },
  });

  const amerFort = await prisma.activity.create({
    data: {
      cityId: jaipur.id,
      title: 'Amer Fort Hilltop Tour & Sheesh Mahal',
      description: 'Explore the grand 16th-century fortress, mirror palace (Sheesh Mahal), and breathtaking Maota Lake views.',
      category: 'Culture',
      estimatedCost: 20,
      durationHours: 3.5,
      imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    },
  });

  const hawaMahal = await prisma.activity.create({
    data: {
      cityId: jaipur.id,
      title: 'Hawa Mahal Palace of Winds & Johari Bazaar Walk',
      description: 'Iconic 953 honeycomb window facade tour followed by traditional Rajasthani jewelry and textile shopping.',
      category: 'Culture',
      estimatedCost: 12,
      durationHours: 2.5,
      imageUrl: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80',
    },
  });

  const gatewayMumbai = await prisma.activity.create({
    data: {
      cityId: mumbai.id,
      title: 'Gateway of India & Elephanta Caves Speedboat Tour',
      description: 'Iconic arch monument photo session followed by a scenic bay boat ride to 5th-century rock-cut cave temples.',
      category: 'Sightseeing',
      estimatedCost: 25,
      durationHours: 4.0,
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    },
  });

  const marineDrive = await prisma.activity.create({
    data: {
      cityId: mumbai.id,
      title: 'Marine Drive Queen’s Necklace Sunset & Street Food Trail',
      description: 'Stroll along the Arabian Sea promenade and savor authentic Vada Pav, Pav Bhaji, and Kulfi.',
      category: 'Food',
      estimatedCost: 15,
      durationHours: 2.5,
      imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80',
    },
  });

  const gangaAarti = await prisma.activity.create({
    data: {
      cityId: varanasi.id,
      title: 'Sacred Dashashwamedh Ghat Evening Ganga Aarti Ceremony',
      description: 'Experience the mesmeric spiritual ritual of brass lamps, chants, and incense aboard a sunset river boat.',
      category: 'Culture',
      estimatedCost: 15,
      durationHours: 2.5,
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    },
  });

  const houseboatKerala = await prisma.activity.create({
    data: {
      cityId: kerala.id,
      title: 'Alleppey Backwaters Luxury Kettuvallam Houseboat Cruise',
      description: 'Glide through tranquil palm-fringed canals, village lagoons, and enjoy fresh Karimeen fish curry meals.',
      category: 'Relaxation',
      estimatedCost: 110,
      durationHours: 6.0,
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    },
  });

  const goaWatersports = await prisma.activity.create({
    data: {
      cityId: goa.id,
      title: 'Calangute Beach Parasailing, Jet Ski & Fort Aguada',
      description: 'Thrill-seeking ocean sports at North Goa beaches followed by 17th-century Portuguese lighthouse fort views.',
      category: 'Adventure',
      estimatedCost: 35,
      durationHours: 4.0,
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    },
  });

  const udaipurCruise = await prisma.activity.create({
    data: {
      cityId: udaipur.id,
      title: 'Lake Pichola Sunset Boat Cruise & City Palace Museum',
      description: 'Sail past Taj Lake Palace and Jag Mandir island, followed by Rajasthan largest royal palace complex.',
      category: 'Sightseeing',
      estimatedCost: 28,
      durationHours: 3.5,
      imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
    },
  });

  const delhiFood = await prisma.activity.create({
    data: {
      cityId: delhi.id,
      title: 'Old Delhi Chandni Chowk Tuk-Tuk Food Trail & Red Fort',
      description: 'Navigate sensory spice markets, Paranthe Wali Gali delicacies, and UNESCO Red Fort heritage.',
      category: 'Food',
      estimatedCost: 18,
      durationHours: 3.0,
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    },
  });

  // International Activities
  const eiffel = await prisma.activity.create({
    data: {
      cityId: paris.id,
      title: 'Eiffel Tower Summit Access & Champagne',
      description: 'Ascend to the top of Paris for breathtaking panoramic views and a celebratory glass of champagne.',
      category: 'Sightseeing',
      estimatedCost: 65,
      durationHours: 3.0,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
    },
  });

  const louvre = await prisma.activity.create({
    data: {
      cityId: paris.id,
      title: 'Louvre Museum Guided Masterpiece Tour',
      description: 'Explore the Mona Lisa, Venus de Milo, and Winged Victory with an expert art historian.',
      category: 'Culture',
      estimatedCost: 45,
      durationHours: 3.5,
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    },
  });

  const sensoji = await prisma.activity.create({
    data: {
      cityId: tokyo.id,
      title: 'Senso-ji Temple & Asakusa Food Tasting',
      description: 'Discover Tokyo’s oldest Buddhist temple followed by traditional street food stalls.',
      category: 'Culture',
      estimatedCost: 35,
      durationHours: 2.5,
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('Seeding Sample Indian & International Trips...');

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
      totalBudget: 1800,
    },
  });

  const stopDelhi = await prisma.tripStop.create({
    data: {
      tripId: indiaTrip.id,
      cityId: delhi.id,
      title: 'Stop 1: Historic New Delhi',
      stopOrder: 1,
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-07'),
      budget: 450,
    },
  });

  const stopAgra = await prisma.tripStop.create({
    data: {
      tripId: indiaTrip.id,
      cityId: agra.id,
      title: 'Stop 2: Taj Mahal & Agra Heritage',
      stopOrder: 2,
      startDate: new Date('2026-10-07'),
      endDate: new Date('2026-10-09'),
      budget: 400,
    },
  });

  const stopJaipur = await prisma.tripStop.create({
    data: {
      tripId: indiaTrip.id,
      cityId: jaipur.id,
      title: 'Stop 3: Pink City Jaipur Palaces',
      stopOrder: 3,
      startDate: new Date('2026-10-09'),
      endDate: new Date('2026-10-14'),
      budget: 650,
    },
  });

  await prisma.itineraryItem.createMany({
    data: [
      {
        stopId: stopDelhi.id,
        activityId: delhiFood.id,
        title: 'Old Delhi Chandni Chowk Food Trail',
        dayNumber: 1,
        timeSlot: '04:00 PM - 07:00 PM',
        cost: 18,
        type: 'MEAL',
        itemOrder: 1,
      },
      {
        stopId: stopAgra.id,
        activityId: tajMahal.id,
        title: 'Taj Mahal Sunrise Guided Tour',
        dayNumber: 1,
        timeSlot: '05:45 AM - 09:00 AM',
        cost: 30,
        type: 'ACTIVITY',
        itemOrder: 1,
      },
      {
        stopId: stopJaipur.id,
        activityId: amerFort.id,
        title: 'Amer Fort Hilltop Tour & Sheesh Mahal',
        dayNumber: 1,
        timeSlot: '09:30 AM - 01:00 PM',
        cost: 20,
        type: 'ACTIVITY',
        itemOrder: 1,
      },
      {
        stopId: stopJaipur.id,
        activityId: hawaMahal.id,
        title: 'Hawa Mahal Palace & Johari Bazaar Walk',
        dayNumber: 2,
        timeSlot: '03:00 PM - 06:00 PM',
        cost: 12,
        type: 'ACTIVITY',
        itemOrder: 2,
      },
    ],
  });

  await prisma.tripExpense.createMany({
    data: [
      {
        tripId: indiaTrip.id,
        category: 'STAY',
        amount: 600,
        notes: 'ITC Rajputana Jaipur & Oberoi Amarvilas Agra',
        date: new Date('2026-10-05'),
      },
      {
        tripId: indiaTrip.id,
        category: 'TRANSPORT',
        amount: 250,
        notes: 'Private AC Car with Chauffeur Delhi-Agra-Jaipur',
        date: new Date('2026-10-05'),
      },
      {
        tripId: indiaTrip.id,
        category: 'MEALS',
        amount: 220,
        notes: 'Dal Baati Churma, Mughlai dining, Lassi',
        date: new Date('2026-10-08'),
      },
    ],
  });

  // European Trip
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
      totalBudget: 2800,
    },
  });

  const stopParis = await prisma.tripStop.create({
    data: {
      tripId: euroTrip.id,
      cityId: paris.id,
      title: 'Stop 1: Paris Light & Romance',
      stopOrder: 1,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-14'),
      budget: 1200,
    },
  });

  await prisma.itineraryItem.create({
    data: {
      stopId: stopParis.id,
      activityId: eiffel.id,
      title: 'Eiffel Tower Summit Access & Champagne',
      dayNumber: 1,
      timeSlot: '10:00 AM - 01:00 PM',
      cost: 65,
      type: 'ACTIVITY',
      itemOrder: 1,
    },
  });

  console.log('Seeding Community Posts for India and Global Trips...');
  await prisma.communityPost.create({
    data: {
      tripId: indiaTrip.id,
      authorId: demoUser.id,
      title: 'Golden Triangle India (Delhi, Agra, Jaipur) Complete 9-Day Itinerary',
      description: 'Complete travel plan with sunrise Taj Mahal entry tips, private car hiring advice, and authentic Rajasthani food spots!',
      likesCount: 289,
      clonesCount: 84,
    },
  });

  await prisma.communityPost.create({
    data: {
      tripId: euroTrip.id,
      authorId: demoUser.id,
      title: '10 Days Ultimate European Romance (Paris, Rome, Barcelona)',
      description: 'Detailed day-by-day budget friendly itinerary with museum passes and dinner cruise recommendations!',
      likesCount: 142,
      clonesCount: 38,
    },
  });

  console.log('Database seeding finished successfully with Indian destinations!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
