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
      bio: 'Avid traveler exploring India, Europe and Asia',
      profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      language: 'English',
    },
  });

  console.log('Seeding All Popular Cities in India & International Destinations...');

  // --- POPULAR INDIAN CITIES ---
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

  const bangalore = await prisma.city.create({
    data: {
      name: 'Bangalore (Bengaluru)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      description: 'The Garden City and tech hub of India, famous for Cubbon Park, Bangalore Palace, craft breweries, and pleasant weather.',
      costIndex: 'MEDIUM',
      popularityScore: 93,
    },
  });

  const chennai = await prisma.city.create({
    data: {
      name: 'Chennai',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      description: 'The gateway to South India, renowned for Marina Beach, Dravidian Kapaleeshwarar Temple, and classical music & dance heritage.',
      costIndex: 'LOW',
      popularityScore: 92,
    },
  });

  const kolkata = await prisma.city.create({
    data: {
      name: 'Kolkata',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Joy, famous for Victoria Memorial, Howrah Bridge, iconic yellow taxis, colonial charm, and sweets.',
      costIndex: 'LOW',
      popularityScore: 93,
    },
  });

  const hyderabad = await prisma.city.create({
    data: {
      name: 'Hyderabad',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Pearls, renowned for Charminar, Golconda Fort, Ramoji Film City, and world-famous Hyderabadi Biryani.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
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

  const rishikesh = await prisma.city.create({
    data: {
      name: 'Rishikesh',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      description: 'The Yoga Capital of the World along the Ganges in Uttarakhand, famous for white-water river rafting, Lakshman Jhula, and Beatles Ashram.',
      costIndex: 'LOW',
      popularityScore: 96,
    },
  });

  const amritsar = await prisma.city.create({
    data: {
      name: 'Amritsar',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1609946779435-0ef41680d283?auto=format&fit=crop&w=800&q=80',
      description: 'Spiritual hub of Sikhism in Punjab, home to the shimmering Golden Temple (Harmandir Sahib), Wagah Border ceremony, and Kulchas.',
      costIndex: 'LOW',
      popularityScore: 96,
    },
  });

  const darjeeling = await prisma.city.create({
    data: {
      name: 'Darjeeling',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      description: 'The Queen of Hills in West Bengal, famous for Kanchenjunga sunrise views from Tiger Hill, UNESCO Himalayan Toy Train, and tea estates.',
      costIndex: 'LOW',
      popularityScore: 94,
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

  const jodhpur = await prisma.city.create({
    data: {
      name: 'Jodhpur',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?auto=format&fit=crop&w=800&q=80',
      description: 'The Sun City & Blue City of Rajasthan, guarded by the towering Mehrangarh Fort, Jaswant Thada, and Umaid Bhawan Palace.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
    },
  });

  const jaisalmer = await prisma.city.create({
    data: {
      name: 'Jaisalmer',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      description: 'The Golden City in the heart of Thar Desert, famous for living Jaisalmer Fort, Sam Sand Dunes desert safari, and overnight luxury camps.',
      costIndex: 'MEDIUM',
      popularityScore: 95,
    },
  });

  const mysore = await prisma.city.create({
    data: {
      name: 'Mysore (Mysuru)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
      description: 'The Heritage City of Karnataka, famous for the opulent Mysore Palace, Chamundeshwari Temple, silk saris, and Dasara celebrations.',
      costIndex: 'LOW',
      popularityScore: 93,
    },
  });

  const ooty = await prisma.city.create({
    data: {
      name: 'Ooty',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      description: 'Queen of Hill Stations in the Nilgiri Hills of Tamil Nadu, famous for botanical gardens, Ooty Lake, and tea plantation walks.',
      costIndex: 'LOW',
      popularityScore: 93,
    },
  });

  const coorg = await prisma.city.create({
    data: {
      name: 'Coorg (Kodagu)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      description: 'The Scotland of India in Karnataka, famous for rolling coffee plantations, mist-covered Western Ghats, Abbey Falls, and spice estates.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
    },
  });

  const pondicherry = await prisma.city.create({
    data: {
      name: 'Pondicherry (Puducherry)',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1589793463357-5fb813435467?auto=format&fit=crop&w=800&q=80',
      description: 'The French Riviera of the East, famous for mustard-yellow French Quarter villas, Auroville experimental township, and Promenade Beach.',
      costIndex: 'LOW',
      popularityScore: 95,
    },
  });

  const mahabalipuram = await prisma.city.create({
    data: {
      name: 'Mahabalipuram',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
      description: 'UNESCO World Heritage coastal town in Tamil Nadu, renowned for 7th-century Pallava Shore Temple, Pancha Rathas, and rock relief carvings.',
      costIndex: 'LOW',
      popularityScore: 91,
    },
  });

  const madurai = await prisma.city.create({
    data: {
      name: 'Madurai',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient temple city of Tamil Nadu, famous for the towering colorful gopurams of Meenakshi Amman Temple and Thirumalai Nayakkar Palace.',
      costIndex: 'LOW',
      popularityScore: 92,
    },
  });

  const kanyakumari = await prisma.city.create({
    data: {
      name: 'Kanyakumari',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      description: 'The southernmost tip of mainland India where the Arabian Sea, Bay of Bengal, and Indian Ocean meet; famous for Vivekananda Rock Memorial.',
      costIndex: 'LOW',
      popularityScore: 92,
    },
  });

  const shillong = await prisma.city.create({
    data: {
      name: 'Shillong',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=800&q=80',
      description: 'The Scotland of the East in Meghalaya, famous for Elephant Falls, Shillong Peak, pine-covered hills, and nearby Cherrapunji root bridges.',
      costIndex: 'LOW',
      popularityScore: 93,
    },
  });

  const gangtok = await prisma.city.create({
    data: {
      name: 'Gangtok',
      country: 'India',
      region: 'Asia',
      imageUrl: 'https://images.unsplash.com/photo-1573059224625-99e80479d20f?auto=format&fit=crop&w=800&q=80',
      description: 'Capital of Sikkim nestled in the Eastern Himalayas, famous for Rumtek Monastery, Nathula Pass border, and Tsomgo Lake.',
      costIndex: 'MEDIUM',
      popularityScore: 94,
    },
  });

  // --- INTERNATIONAL CITIES ---
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

  console.log('Seeding Activities...');

  // Indian Activities
  const tajMahal = await prisma.activity.create({
    data: {
      cityId: agra.id,
      title: 'Taj Mahal Sunrise VIP Guided Tour',
      description: 'Witness the breathtaking marble monument of love bathed in golden dawn light with expert storytelling.',
      category: 'Sightseeing',
      estimatedCost: 2500,
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
      estimatedCost: 1500,
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
      estimatedCost: 1000,
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
      estimatedCost: 2000,
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
      estimatedCost: 1200,
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
      estimatedCost: 1200,
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
      estimatedCost: 8500,
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
      estimatedCost: 3000,
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
      estimatedCost: 2200,
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
      estimatedCost: 1500,
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
      estimatedCost: 5500,
      durationHours: 3.0,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('Seeding Sample Trips for Jiyan Mansuri...');

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

  await prisma.itineraryItem.createMany({
    data: [
      {
        stopId: stopDelhi.id,
        activityId: delhiFood.id,
        title: 'Old Delhi Chandni Chowk Food Trail',
        dayNumber: 1,
        timeSlot: '04:00 PM - 07:00 PM',
        cost: 1500,
        type: 'MEAL',
        itemOrder: 1,
      },
      {
        stopId: stopAgra.id,
        activityId: tajMahal.id,
        title: 'Taj Mahal Sunrise Guided Tour',
        dayNumber: 1,
        timeSlot: '05:45 AM - 09:00 AM',
        cost: 2500,
        type: 'ACTIVITY',
        itemOrder: 1,
      },
      {
        stopId: stopJaipur.id,
        activityId: amerFort.id,
        title: 'Amer Fort Hilltop Tour & Sheesh Mahal',
        dayNumber: 1,
        timeSlot: '09:30 AM - 01:00 PM',
        cost: 1500,
        type: 'ACTIVITY',
        itemOrder: 1,
      },
      {
        stopId: stopJaipur.id,
        activityId: hawaMahal.id,
        title: 'Hawa Mahal Palace & Johari Bazaar Walk',
        dayNumber: 2,
        timeSlot: '03:00 PM - 06:00 PM',
        cost: 1000,
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

  await prisma.itineraryItem.create({
    data: {
      stopId: stopParis.id,
      activityId: eiffel.id,
      title: 'Eiffel Tower Summit Access & Champagne',
      dayNumber: 1,
      timeSlot: '10:00 AM - 01:00 PM',
      cost: 5500,
      type: 'ACTIVITY',
      itemOrder: 1,
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

  console.log('Database seeding finished successfully with 31 popular Indian cities!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
