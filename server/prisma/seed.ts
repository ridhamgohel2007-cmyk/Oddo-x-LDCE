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

  const kerala = await prisma.city.create({
    data: {
      name: 'Kerala (Alleppey)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Gods Own Country, famous for serene backwater houseboat cruises, coconut groves, Ayurvedic wellness, and tea gardens.',
      costIndex: 'MEDIUM',
      popularityScore: 96,
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

  const manali = await prisma.city.create({
    data: {
      name: 'Manali',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      description: 'High-altitude Himalayan resort town in Himachal, famous for Solang Valley adventure sports, Rohtang Pass, and pine forests.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const shimla = await prisma.city.create({
    data: {
      name: 'Shimla',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1562670652-e5947bddb335?auto=format&fit=crop&w=800&q=80',
      description: 'The Queen of Hill Stations in Himachal Pradesh, famous for snow-capped Himalayan peaks, colonial Ridge, and Mall Road walks.',
      costIndex: 'MEDIUM',
      popularityScore: 95,
    },
  });

  const srinagar = await prisma.city.create({
    data: {
      name: 'Srinagar (Kashmir)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      description: 'Heaven on Earth in Jammu & Kashmir, famous for Dal Lake Shikara rides, wooden houseboats, Indira Gandhi Tulip Garden, and Gulmarg snow.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const ladakh = await prisma.city.create({
    data: {
      name: 'Ladakh (Leh)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      description: 'The Land of High Passes, famous for azure Pangong Tso Lake, double-humped camel rides in Nubra Valley, magnetic hill, and monasteries.',
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

  const bali = await prisma.city.create({
    data: {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Tropical island paradise known for lush rice terraces, sacred sea temples, surfing beaches, and luxury wellness resorts.',
      costIndex: 'LOW',
      popularityScore: 95,
    },
  });

  const dubai = await prisma.city.create({
    data: {
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'Futuristic desert oasis famous for Burj Khalifa, palm-shaped islands, mega shopping malls, and dune bashing safaris.',
      costIndex: 'HIGH',
      popularityScore: 97,
    },
  });

  const bangkok = await prisma.city.create({
    data: {
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant capital of Thailand famous for ornate Grand Palace, floating street markets, tuk-tuks, and world-class street food.',
      costIndex: 'LOW',
      popularityScore: 94,
    },
  });

  const singapore = await prisma.city.create({
    data: {
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      description: 'Global financial hub and island city-state, famous for Marina Bay Sands, Gardens by the Bay Supertrees, and hawker centres.',
      costIndex: 'HIGH',
      popularityScore: 96,
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

  const london = await prisma.city.create({
    data: {
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      description: 'Historic royal capital featuring Big Ben, Tower Bridge, British Museum, West End theatre shows, and red double-decker buses.',
      costIndex: 'HIGH',
      popularityScore: 98,
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

  const amsterdam = await prisma.city.create({
    data: {
      name: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
      description: 'Picturesque canal city known for historic gabled houses, Van Gogh Museum, bicycle culture, and tulip gardens.',
      costIndex: 'HIGH',
      popularityScore: 95,
    },
  });

  const venice = await prisma.city.create({
    data: {
      name: 'Venice',
      country: 'Italy',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
      description: 'Floating city built on 118 islands, famous for romantic gondola rides along Grand Canal, St. Mark Square, and Rialto Bridge.',
      costIndex: 'HIGH',
      popularityScore: 97,
    },
  });

  const zurich = await prisma.city.create({
    data: {
      name: 'Zurich (Swiss Alps)',
      country: 'Switzerland',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      description: 'Gateway to snow-capped Swiss Alps, pristine Lake Zurich, luxury watchmaking, and Swiss chocolate boutiques.',
      costIndex: 'HIGH',
      popularityScore: 96,
    },
  });

  const santorini = await prisma.city.create({
    data: {
      name: 'Santorini (Oia)',
      country: 'Greece',
      region: 'Europe',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      description: 'Romantic Cycladic island famous for whitewashed cliffside villages, blue-domed churches, volcanic beaches, and sunsets.',
      costIndex: 'HIGH',
      popularityScore: 98,
    },
  });

  // --- 3. NORTH AMERICA ---
  const newyork = await prisma.city.create({
    data: {
      name: 'New York City',
      country: 'United States',
      region: 'North America',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'The Big Apple, famous for Times Square, Statue of Liberty, Central Park, Broadway shows, and iconic skyline skyscrapers.',
      costIndex: 'HIGH',
      popularityScore: 99,
    },
  });

  const losangeles = await prisma.city.create({
    data: {
      name: 'Los Angeles (Hollywood)',
      country: 'United States',
      region: 'North America',
      imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80',
      description: 'Entertainment capital of the world, home to Hollywood Walk of Fame, Santa Monica Pier, Beverly Hills, and Pacific beaches.',
      costIndex: 'HIGH',
      popularityScore: 96,
    },
  });

  const vancouver = await prisma.city.create({
    data: {
      name: 'Vancouver',
      country: 'Canada',
      region: 'North America',
      imageUrl: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80',
      description: 'Coastal Canadian seaport surrounded by snow-peaked mountains, Stanley Park seawall, Capilano Suspension Bridge, and ocean vistas.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
    },
  });

  const cancun = await prisma.city.create({
    data: {
      name: 'Cancún',
      country: 'Mexico',
      region: 'North America',
      imageUrl: 'https://images.unsplash.com/photo-1510097467424-192d713be8b2?auto=format&fit=crop&w=800&q=80',
      description: 'Mexican Caribbean resort city famous for turquoise waters, white sand beaches, luxury beachfront resorts, and nearby Mayan ruins.',
      costIndex: 'MEDIUM',
      popularityScore: 95,
    },
  });

  // --- 4. SOUTH AMERICA ---
  const riodejaneiro = await prisma.city.create({
    data: {
      name: 'Rio de Janeiro',
      country: 'Brazil',
      region: 'South America',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
      description: 'Marvelous City famous for Christ the Redeemer statue on Corcovado mountain, Sugarloaf mountain, Copacabana beach, and Carnival.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const cusco = await prisma.city.create({
    data: {
      name: 'Cusco (Machu Picchu)',
      country: 'Peru',
      region: 'South America',
      imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
      description: 'Historic Inca Empire capital and gateway to the ancient mountain citadel of Machu Picchu in the Andes mountains.',
      costIndex: 'LOW',
      popularityScore: 98,
    },
  });

  const buenosaires = await prisma.city.create({
    data: {
      name: 'Buenos Aires',
      country: 'Argentina',
      region: 'South America',
      imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80',
      description: 'Paris of South America, famous for passionate Tango dancing, colorful La Boca district, steakhouses, and European architecture.',
      costIndex: 'LOW',
      popularityScore: 94,
    },
  });

  // --- 5. AFRICA ---
  const cairo = await prisma.city.create({
    data: {
      name: 'Cairo (Giza Pyramids)',
      country: 'Egypt',
      region: 'Africa',
      imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
      description: 'Sprawling capital along the Nile river, famous for Great Pyramids of Giza, Sphinx monument, Egyptian Museum, and Khan el-Khalili bazaar.',
      costIndex: 'LOW',
      popularityScore: 98,
    },
  });

  const capetown = await prisma.city.create({
    data: {
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Africa',
      imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      description: 'South Africa coastal jewel dominated by flat-topped Table Mountain, Cape of Good Hope, penguin colonies, and Stellenbosch vineyards.',
      costIndex: 'MEDIUM',
      popularityScore: 97,
    },
  });

  const marrakech = await prisma.city.create({
    data: {
      name: 'Marrakech',
      country: 'Morocco',
      region: 'Africa',
      imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
      description: 'The Red City of Morocco, famous for maze-like Medina souks, Jemaa el-Fnaa square, Arabian palaces, and camel desert safaris.',
      costIndex: 'LOW',
      popularityScore: 95,
    },
  });

  // --- 6. OCEANIA ---
  const sydney = await prisma.city.create({
    data: {
      name: 'Sydney',
      country: 'Australia',
      region: 'Oceania',
      imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      description: 'Harbourfront metropolis famous for Sydney Opera House, Harbour Bridge, golden Bondi Beach, and vibrant coastal lifestyle.',
      costIndex: 'HIGH',
      popularityScore: 98,
    },
  });

  const melbourne = await prisma.city.create({
    data: {
      name: 'Melbourne',
      country: 'Australia',
      region: 'Oceania',
      imageUrl: 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?auto=format&fit=crop&w=800&q=80',
      description: 'Cultural capital of Australia, famous for hidden laneway street art, world-renowned coffee culture, and Great Ocean Road drives.',
      costIndex: 'HIGH',
      popularityScore: 95,
    },
  });

  const auckland = await prisma.city.create({
    data: {
      name: 'Auckland',
      country: 'New Zealand',
      region: 'Oceania',
      imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
      description: 'City of Sails surrounded by two harbors, Sky Tower views, volcanic cones, and gateway to Hobbiton movie set landscapes.',
      costIndex: 'HIGH',
      popularityScore: 96,
    },
  });

  console.log('Seeding Activities for Global Continents...');

  // Activities
  await prisma.activity.createMany({
    data: [
      {
        cityId: agra.id,
        title: 'Taj Mahal Sunrise VIP Guided Tour',
        description: 'Witness the breathtaking marble monument of love bathed in golden dawn light.',
        category: 'Sightseeing',
        estimatedCost: 2500,
        durationHours: 3.0,
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: jaipur.id,
        title: 'Amer Fort Hilltop Tour & Sheesh Mahal',
        description: 'Explore the grand 16th-century fortress and mirror palace (Sheesh Mahal).',
        category: 'Culture',
        estimatedCost: 1500,
        durationHours: 3.5,
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: paris.id,
        title: 'Eiffel Tower Summit Access & Champagne',
        description: 'Ascend to the top of Paris for breathtaking panoramic views.',
        category: 'Sightseeing',
        estimatedCost: 5500,
        durationHours: 3.0,
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: newyork.id,
        title: 'Statue of Liberty & Ellis Island Ferry Tour',
        description: 'Cruise past Manhattan skyline to touch Lady Liberty and explore American immigration history.',
        category: 'Sightseeing',
        estimatedCost: 3500,
        durationHours: 4.0,
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: cusco.id,
        title: 'Machu Picchu Inca Citadel Express Tour',
        description: 'Explore the mystical stone ruins of Machu Picchu nestled high in the Andean cloud forest.',
        category: 'Adventure',
        estimatedCost: 12000,
        durationHours: 6.0,
        imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: cairo.id,
        title: 'Giza Pyramids & Great Sphinx Camel Safari',
        description: 'Guided tour around Khufu Pyramid followed by a camel ride across desert dunes.',
        category: 'Culture',
        estimatedCost: 4000,
        durationHours: 4.0,
        imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80',
      },
      {
        cityId: sydney.id,
        title: 'Sydney Opera House Behind-the-Scenes Tour',
        description: 'Step inside the world-famous sails of Sydney Opera House with an architectural expert.',
        category: 'Culture',
        estimatedCost: 3000,
        durationHours: 2.5,
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      },
    ],
  });

  console.log('Seeding Sample Multi-Continent Trips for Jiyan Mansuri...');

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

  const stopDelhi = await prisma.tripStop.create({
    data: {
      tripId: indiaTrip.id,
      cityId: delhi.id,
      title: 'Stop 1: Historic New Delhi',
      stopOrder: 1,
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-07'),
      budget: 35000,
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
      budget: 35000,
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
      budget: 80000,
    },
  });

  await prisma.tripExpense.createMany({
    data: [
      {
        tripId: indiaTrip.id,
        category: 'STAY',
        amount: 45000,
        notes: 'ITC Rajputana Jaipur & Oberoi Amarvilas Agra',
        date: new Date('2026-10-05'),
      },
      {
        tripId: indiaTrip.id,
        category: 'TRANSPORT',
        amount: 20000,
        notes: 'Private AC Car with Chauffeur Delhi-Agra-Jaipur',
        date: new Date('2026-10-05'),
      },
      {
        tripId: indiaTrip.id,
        category: 'MEALS',
        amount: 15000,
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
      totalBudget: 220000,
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
      budget: 100000,
    },
  });

  console.log('Seeding Community Posts...');
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
      tripId: euroTrip.id,
      authorId: demoUser.id,
      title: '10 Days Ultimate European Romance (Paris, Rome, Barcelona)',
      description: 'Detailed day-by-day budget friendly itinerary created by Jiyan Mansuri with museum passes and dinner cruise recommendations!',
      likesCount: 142,
      clonesCount: 38,
    },
  });

  console.log('Database seeding finished successfully across ALL Continents (Asia, Europe, North America, South America, Africa, Oceania)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
