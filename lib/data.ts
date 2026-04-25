export interface Service {
  id: string;
  name: string;
  category: 'household' | 'commercial';
  icon: string;
  demand?: string;
}

export interface Worker {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: number;
  price: number;
  availability: 'available' | 'busy' | 'offline';
  tags: string[];
  service: string;
  experience: number;
  completedJobs: number;
  skills: string[];
  reviews: Review[];
  phone: string;
  personality: 'fast' | 'premium' | 'negotiator' | 'friendly';
  trustScore: number;
  trustBadge: 'elite' | 'verified' | 'new';
  onTimeRate: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  service: string;
  date: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'upi' | 'wallet';
}

export interface Notification {
  id: string;
  type: 'accepted' | 'on-the-way' | 'arrived' | 'completed' | 'bargain';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  workerName: string;
  service: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
  method: 'cash' | 'upi' | 'wallet';
}

export const services: Service[] = [
  { id: 'car-cleaning', name: 'Car Cleaning', category: 'household', icon: '🚗', demand: 'High Demand' },
  { id: 'bike-cleaning', name: 'Bike Cleaning', category: 'household', icon: '🏍️' },
  { id: 'maid', name: 'Maid', category: 'household', icon: '🧹', demand: 'High Demand' },
  { id: 'cook', name: 'Cook', category: 'household', icon: '👨‍🍳' },
  { id: 'babysitter', name: 'Babysitter', category: 'household', icon: '👶' },
  { id: 'elder-care', name: 'Elder Care', category: 'household', icon: '🧓' },
  { id: 'electrician', name: 'Electrician', category: 'household', icon: '⚡', demand: 'High Demand' },
  { id: 'plumber', name: 'Plumber', category: 'household', icon: '🔧', demand: 'High Demand' },
  { id: 'carpenter', name: 'Carpenter', category: 'household', icon: '🪚' },
  { id: 'painter', name: 'Painter', category: 'household', icon: '🎨' },
  { id: 'ac-repair', name: 'AC Repair', category: 'household', icon: '❄️', demand: 'High Demand' },
  { id: 'appliance-repair', name: 'Appliance Repair', category: 'household', icon: '🔌' },
  { id: 'gardener', name: 'Gardener', category: 'household', icon: '🌿' },
  { id: 'driver', name: 'Driver', category: 'household', icon: '🚕' },
  { id: 'security', name: 'Security', category: 'household', icon: '🛡️' },
  { id: 'office-cleaning', name: 'Office Cleaning', category: 'commercial', icon: '🏢', demand: 'High Demand' },
  { id: 'pantry-staff', name: 'Pantry Staff', category: 'commercial', icon: '☕' },
  { id: 'office-boy', name: 'Office Boy', category: 'commercial', icon: '📋' },
  { id: 'it-support', name: 'IT Support', category: 'commercial', icon: '💻', demand: 'High Demand' },
  { id: 'cctv', name: 'CCTV Installation', category: 'commercial', icon: '📹' },
  { id: 'network-setup', name: 'Network Setup', category: 'commercial', icon: '🌐' },
  { id: 'loaders', name: 'Loaders', category: 'commercial', icon: '📦' },
  { id: 'movers', name: 'Movers', category: 'commercial', icon: '🚚' },
  { id: 'warehouse', name: 'Warehouse Workers', category: 'commercial', icon: '🏭' },
  { id: 'construction', name: 'Construction Workers', category: 'commercial', icon: '🏗️' },
  { id: 'delivery', name: 'Delivery Staff', category: 'commercial', icon: '🛵', demand: 'High Demand' },
  { id: 'event-staff', name: 'Event Staff', category: 'commercial', icon: '🎉' },
];

const workerImages = [
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
];

const firstNames = ['Rajesh', 'Suresh', 'Anita', 'Mohammed', 'Vikram', 'Lakshmi', 'Deepak', 'Priya', 'Ramesh', 'Kavita', 'Arun', 'Gopal', 'Nitin', 'Sunita', 'Manoj', 'Pooja', 'Ashok', 'Rekha', 'Sanjay', 'Neha', 'Rahul', 'Meera', 'Amit', 'Swati', 'Dinesh', 'Geeta', 'Harish', 'Indira', 'Jitendra', 'Kamla', 'Lalit', 'Madhu', 'Naresh', 'Om', 'Parveen', 'Qadir', 'Roshni', 'Satish', 'Tarun', 'Uma', 'Vivek', 'Waseem', 'Xena', 'Yogesh', 'Zeenat', 'Bharat', 'Chandra', 'Dev', 'Esha', 'Farhan'];
const lastNames = ['Kumar', 'Yadav', 'Sharma', 'Ali', 'Singh', 'Devi', 'Verma', 'Patel', 'Gupta', 'Joshi', 'Mehta', 'Reddy', 'Chauhan', 'Mishra', 'Agarwal', 'Rao', 'Nair', 'Iyer', 'Pillai', 'Das', 'Bhat', 'Kulkarni', 'Desai', 'Shah', 'Jain', 'Malhotra', 'Kapoor', 'Seth', 'Bansal', 'Tiwari', 'Pandey', 'Shukla', 'Saxena', 'Mathur', 'Dubey', 'Rawat', 'Pawar', 'Jadhav', 'More', 'Patil'];

const personalities: Worker['personality'][] = ['fast', 'premium', 'negotiator', 'friendly'];
const personalityTags: Record<Worker['personality'], string[]> = {
  fast: ['Fast', 'Quick Response'],
  premium: ['Top Rated', 'Premium'],
  negotiator: ['Best Price', 'Negotiator'],
  friendly: ['Friendly', 'Trusted'],
};

const serviceSkills: Record<string, string[]> = {
  'car-cleaning': ['Exterior Wash', 'Interior Clean', 'Polishing', 'Vacuuming', 'Ceramic Coat', 'Detailing'],
  'bike-cleaning': ['Wash', 'Polish', 'Chain Lube', 'Detailing', 'Paint Protection'],
  'maid': ['Cleaning', 'Cooking', 'Laundry', 'Organizing', 'Deep Clean', 'Dusting'],
  'cook': ['North Indian', 'South Indian', 'Chinese', 'Baking', 'Continental', 'Vegan'],
  'babysitter': ['Child Care', 'Tutoring', 'Activities', 'First Aid', 'Storytelling', 'Crafts'],
  'elder-care': ['Elder Care', 'Medication', 'Companionship', 'Physiotherapy Assist', 'Cooking', 'Walking Assist'],
  'electrician': ['Wiring', 'Switch Repair', 'Fan Installation', 'MCB Repair', 'Inverter Setup', 'LED Install'],
  'plumber': ['Pipe Repair', 'Leak Fix', 'Bathroom Fitting', 'Water Tank', 'Drainage', 'Water Purifier'],
  'carpenter': ['Furniture Repair', 'Wood Polish', 'Cabinet Making', 'Door Fitting', 'Modular Kitchen', 'Shelving'],
  'painter': ['Interior Paint', 'Exterior Paint', 'Texture', 'Waterproofing', 'Wood Polish', 'Stenciling'],
  'ac-repair': ['AC Installation', 'Gas Refill', 'Cleaning', 'Compressor Repair', 'Duct Work', 'Smart Thermostat'],
  'appliance-repair': ['Washing Machine', 'Refrigerator', 'Microwave', 'Dishwasher', 'Water Heater', 'Chimney'],
  'gardener': ['Lawn Care', 'Pruning', 'Planting', 'Landscaping', 'Irrigation', 'Pest Control'],
  'driver': ['City Driving', 'Highway', 'Automatic', 'Manual', 'Night Driving', 'Outstation'],
  'security': ['Gate Security', 'CCTV Monitor', 'Patrol', 'Event Security', 'Night Watch', 'Access Control'],
  'office-cleaning': ['Office Cleaning', 'Deep Clean', 'Sanitization', 'Floor Care', 'Window Clean', 'Washroom'],
  'pantry-staff': ['Tea/Coffee', 'Snack Prep', 'Inventory', 'Serving', 'Hygiene', 'Catering Assist'],
  'office-boy': ['Filing', 'Courier', 'Printing', 'Errands', 'Stationery', 'Visitor Management'],
  'it-support': ['Network Setup', 'PC Repair', 'Software Install', 'Data Recovery', 'Printer Setup', 'VPN Config'],
  'cctv': ['CCTV Install', 'DVR Setup', 'Remote Access', 'Cable Routing', 'Night Vision', 'Maintenance'],
  'network-setup': ['LAN Setup', 'WiFi Config', 'Router Install', 'Cable Management', 'Firewall', 'Server Rack'],
  'loaders': ['Loading', 'Unloading', 'Sorting', 'Inventory', 'Heavy Lifting', 'Forklift'],
  'movers': ['Packing', 'Moving', 'Unpacking', 'Furniture Wrap', 'Transport', 'Insurance'],
  'warehouse': ['Picking', 'Packing', 'Inventory', 'Forklift', 'Shipping', 'Receiving'],
  'construction': ['Masonry', 'Plumbing', 'Electrical', 'Painting', 'Welding', 'Scaffolding'],
  'delivery': ['Bike Delivery', 'Van Delivery', 'Express', 'Same Day', 'COD Handling', 'Route Planning'],
  'event-staff': ['Setup', 'Serving', 'Coordination', 'Cleanup', 'Sound Setup', 'Lighting'],
};

const reviewComments = [
  'Excellent work! Very professional.',
  'Great service, arrived on time.',
  'Very thorough and trustworthy.',
  'Fixed the issue quickly. Highly recommended!',
  'Good quality work, slightly delayed.',
  'Amazing experience. Will hire again!',
  'Decent work, could be more thorough.',
  'Best in the area. Five stars!',
  'Very polite and skilled.',
  'Quick and efficient. Great value.',
  'Exceeded expectations. Wonderful!',
  'Reliable and punctual. Impressed.',
  'Good communication throughout the job.',
  'Clean work, no mess left behind.',
  'Very knowledgeable about the work.',
];

const reviewNames = ['Priya S.', 'Amit K.', 'Sneha M.', 'Rahul D.', 'Meera J.', 'Kavita R.', 'Deepak S.', 'Vikram P.', 'Nisha T.', 'Rohit M.', 'Pooja K.', 'Sunita B.', 'Arjun N.', 'Manish G.', 'Swati L.', 'Neha J.', 'Sanjay R.', 'Ashok T.', 'Rekha V.', 'Raj K.'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateWorkers(): Worker[] {
  const rng = seededRandom(42);
  const result: Worker[] = [];
  let idCounter = 1;

  for (const service of services) {
    const count = 7 + Math.floor(rng() * 5);
    const skills = serviceSkills[service.id] || ['General'];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(rng() * firstNames.length)];
      const lastName = lastNames[Math.floor(rng() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const personality = personalities[Math.floor(rng() * personalities.length)];
      const rating = Math.round((3.5 + rng() * 1.5) * 10) / 10;
      const distance = Math.round((0.2 + rng() * 4.8) * 10) / 10;
      const basePrice = 150 + Math.floor(rng() * 400);
      const price = personality === 'premium' ? basePrice + 100 : personality === 'negotiator' ? basePrice - 30 : basePrice;
      const availRoll = rng();
      const availability: Worker['availability'] = availRoll < 0.6 ? 'available' : availRoll < 0.85 ? 'busy' : 'offline';
      const experience = 1 + Math.floor(rng() * 15);
      const completedJobs = 20 + Math.floor(rng() * 500);
      const image = workerImages[idCounter % workerImages.length];
      const workerSkills = skills.slice(0, 2 + Math.floor(rng() * (skills.length - 2)));
      const tags = [...personalityTags[personality]];
      if (rating >= 4.7) tags.push('Top Rated');
      if (distance < 1) tags.push('Nearby');

      const numReviews = 1 + Math.floor(rng() * 4);
      const reviews: Review[] = [];
      for (let r = 0; r < numReviews; r++) {
        reviews.push({
          id: `r-${idCounter}-${r}`,
          userName: reviewNames[Math.floor(rng() * reviewNames.length)],
          rating: Math.min(5, Math.max(3, Math.round(rating + (rng() - 0.5)))),
          comment: reviewComments[Math.floor(rng() * reviewComments.length)],
          date: `2024-0${1 + Math.floor(rng() * 3)}-${10 + Math.floor(rng() * 18)}`,
        });
      }

      const trustScore = Math.round(40 + rng() * 60);
      const trustBadge: Worker['trustBadge'] = trustScore >= 85 ? 'elite' : trustScore >= 60 ? 'verified' : 'new';
      const onTimeRate = Math.round(75 + rng() * 25);

      result.push({
        id: `w${idCounter}`,
        name,
        image,
        rating,
        distance,
        price,
        availability,
        tags: Array.from(new Set(tags)),
        service: service.id,
        experience,
        completedJobs,
        skills: workerSkills,
        reviews,
        phone: `+91 ${90000 + Math.floor(rng() * 9999)} ${10000 + Math.floor(rng() * 89999)}`,
        personality,
        trustScore,
        trustBadge,
        onTimeRate,
      });
      idCounter++;
    }
  }

  return result;
}

export const workers: Worker[] = generateWorkers();

export const bargainResponses: Record<string, string[]> = {
  low: [
    "That's a bit low for the quality I provide. How about we meet in the middle?",
    "I understand budget constraints, but I can't go that low. Can we try a bit higher?",
    "I appreciate the offer, but my work speaks for itself. Let's find a fair price.",
    "Hmm, that won't cover my costs. I can do ₹{mid} if you book now.",
    "I've spent years perfecting my craft. Can we find something fairer?",
  ],
  medium: [
    "That's reasonable! I can work with that if you book right now.",
    "Almost there! Just a little more and we have a deal.",
    "Good offer! I can accept if you add a small tip for the effort.",
    "I can come in 20 mins if we finalize at this price!",
    "Deal! But only if you confirm the booking right away.",
  ],
  high: [
    "Deal! That works perfectly for me. Let's get started!",
    "Absolutely! I accept. When would you like me to start?",
    "Perfect! You won't be disappointed. Booking confirmed!",
    "Great choice! I'll bring my best tools for this one.",
  ],
  accept: [
    "Great choice! I'll be there on time. Looking forward to working with you!",
    "Awesome! I'll prepare everything and be there as scheduled.",
    "Wonderful! You've made the right choice. See you soon!",
    "Excellent! I'll arrive early to get started right away.",
  ],
  reject: [
    "No problem! Let me know if you change your mind. I'm always available.",
    "I understand. Feel free to reach out anytime you need my services.",
  ],
};

export const transactions: Transaction[] = [
  { id: 't1', workerName: 'Rajesh Kumar', service: 'Electrician', amount: 314, date: '2024-03-20', status: 'completed', method: 'upi' },
  { id: 't2', workerName: 'Anita Sharma', service: 'Maid', amount: 349, date: '2024-03-18', status: 'completed', method: 'wallet' },
  { id: 't3', workerName: 'Mohammed Ali', service: 'Car Cleaning', amount: 199, date: '2024-03-15', status: 'completed', method: 'cash' },
  { id: 't4', workerName: 'Vikram Singh', service: 'AC Repair', amount: 419, date: '2024-03-12', status: 'completed', method: 'upi' },
  { id: 't5', workerName: 'Suresh Yadav', service: 'Plumber', amount: 261, date: '2024-03-10', status: 'completed', method: 'wallet' },
  { id: 't6', workerName: 'Lakshmi Devi', service: 'Cook', amount: 188, date: '2024-03-08', status: 'pending', method: 'upi' },
  { id: 't7', workerName: 'Deepak Verma', service: 'Carpenter', amount: 293, date: '2024-03-05', status: 'completed', method: 'cash' },
  { id: 't8', workerName: 'Priya Patel', service: 'Babysitter', amount: 471, date: '2024-03-01', status: 'refunded', method: 'wallet' },
];

export function getWorkersByService(serviceId: string): Worker[] {
  const result = workers.filter(w => w.service === serviceId);
  if (result.length === 0) return generateFallbackWorkers(serviceId);
  return result;
}

function generateFallbackWorkers(serviceId: string): Worker[] {
  const svc = services.find(s => s.id === serviceId);
  const fallbackSkills = serviceSkills[serviceId] || ['General'];
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `fb-${serviceId}-${i}`,
    name: `${firstNames[i]} ${lastNames[i]}`,
    image: workerImages[i % workerImages.length],
    rating: Math.round((4 + Math.random()) * 10) / 10,
    distance: Math.round((0.5 + Math.random() * 3) * 10) / 10,
    price: 200 + Math.floor(Math.random() * 200),
    availability: 'available' as const,
    tags: ['Available'],
    service: serviceId,
    experience: 3 + Math.floor(Math.random() * 8),
    completedJobs: 50 + Math.floor(Math.random() * 200),
    skills: fallbackSkills.slice(0, 3),
    reviews: [],
    phone: `+91 98765 ${43210 + i}`,
    personality: 'friendly' as const,
    trustScore: 70,
    trustBadge: 'verified' as const,
    onTimeRate: 90,
  }));
}

export function getWorkerById(workerId: string): Worker | undefined {
  return workers.find(w => w.id === workerId);
}

export function getNearbyWorkers(limit = 6): Worker[] {
  return [...workers].filter(w => w.availability === 'available').sort((a, b) => a.distance - b.distance).slice(0, limit);
}

export function getPopularWorkers(limit = 6): Worker[] {
  return [...workers].sort((a, b) => b.completedJobs - a.completedJobs).slice(0, limit);
}

export function getTrendingWorkers(limit = 6): Worker[] {
  return [...workers].filter(w => w.rating >= 4.5 && w.availability === 'available').sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getHighDemandServices(): Service[] {
  return services.filter(s => s.demand);
}

export function getRecommendedWorkers(limit = 4): Worker[] {
  return [...workers].filter(w => w.availability === 'available' && w.rating >= 4.3).sort(() => Math.random() - 0.5).slice(0, limit);
}
