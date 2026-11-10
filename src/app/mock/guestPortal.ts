export const GUEST_STAY = {
  guest: "Chukwuemeka Okafor",
  surname: "Okafor",
  reservation: "BK-2860",
  property: "Grand Palms Ikoyi",
  location: "Ikoyi, Lagos",
  room: "301",
  roomType: "Palm Suite",
  checkIn: "4 Aug 2026",
  checkOut: "7 Aug 2026",
  nightsLeft: 2,
};

export const ROOM_SERVICE_MENU = [
  { id: "RS-01", category: "Breakfast", name: "Nigerian Breakfast", description: "Akara, pap, plantain and eggs", price: 8500, available: true },
  { id: "RS-02", category: "Breakfast", name: "Continental Breakfast", description: "Pastries, fruit, yoghurt and coffee", price: 10500, available: true },
  { id: "RS-03", category: "Mains", name: "Jollof Rice & Grilled Chicken", description: "Smoky jollof, chicken and coleslaw", price: 14500, available: true },
  { id: "RS-04", category: "Mains", name: "Seafood Okra", description: "Fresh okra, prawns and local spices", price: 18500, available: true },
  { id: "RS-05", category: "Mains", name: "Ofada Rice & Ayamase", description: "Local rice, green pepper sauce and beef", price: 13200, available: true },
  { id: "RS-06", category: "Drinks", name: "Chapman", description: "Classic Nigerian fruit cocktail", price: 3500, available: true },
  { id: "RS-07", category: "Drinks", name: "Fresh Pineapple Juice", description: "Pressed to order", price: 4200, available: false },
];

export const ACTIVE_ORDER = {
  id: "RS-0048",
  placed: "19:18",
  estimate: "35–45 min",
  statusIndex: 2,
  steps: ["Order received", "Preparing", "Ready for delivery", "Delivered"],
  items: ["2 × Jollof Rice & Grilled Chicken", "1 × Chapman"],
  total: 34937,
};

export const ACTIVE_REQUESTS = [
  { id: "REQ-241", type: "Extra towels", status: "On the way", updated: "5 min ago" },
  { id: "RS-0048", type: "Room service", status: "Preparing", updated: "12 min ago" },
];

export const CHAT_MESSAGES = [
  { id: "MSG-1", sender: "Front Desk", body: "Good evening, Mr Okafor. How may we help?", time: "19:04" },
  { id: "MSG-2", sender: "Guest", body: "Could I please have a late checkout tomorrow?", time: "19:06" },
  { id: "MSG-3", sender: "Front Desk", body: "Certainly. We are checking availability and will confirm shortly.", time: "19:07" },
];

export const TRANSPORT_HISTORY = [
  { id: "TRP-0281", date: "4 Aug", route: "Murtala Muhammed Airport → Grand Palms Ikoyi", amount: 25000, status: "Completed" },
  { id: "TRP-0214", date: "18 May", route: "Grand Palms Maitama → Nnamdi Azikiwe Airport", amount: 35000, status: "Completed" },
];

export const ACTIVE_TRIP = {
  id: "TRP-0318",
  pickup: "Grand Palms Ikoyi",
  dropoff: "Murtala Muhammed Airport, Lagos",
  pickupTime: "Tomorrow · 09:30",
  driver: "Uche Obi",
  vehicle: "Toyota Prado · LAG 482 GK",
  phone: "+234 803 440 1902",
};

export const RESTAURANT_SLOTS = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

export const BILL_CHARGES = [
  { id: "CH-01", date: "4 Aug", description: "Palm Suite · Night 1", category: "Room", amount: 91125, disputed: false },
  { id: "CH-02", date: "4 Aug", description: "Airport transfer", category: "Transport", amount: 25000, disputed: false },
  { id: "CH-03", date: "4 Aug", description: "Room service dinner", category: "Dining", amount: 32500, disputed: false },
  { id: "CH-04", date: "5 Aug", description: "Laundry service", category: "Laundry", amount: 12000, disputed: false },
];

export const BILL_SUMMARY = {
  subtotal: 160625,
  vat: 12047,
  tourismLevy: 3213,
  total: 175885,
  payments: 100000,
  balance: 75885,
};

export const HOTEL_DIRECTORY = [
  { name: "Front Desk", extension: "0", description: "Available 24 hours" },
  { name: "Security", extension: "9", description: "Emergency and safety support" },
  { name: "Restaurant", extension: "2", description: "Dining and room service" },
  { name: "Housekeeping", extension: "3", description: "Room care and amenities" },
];

export const GUEST_FAQS = [
  { question: "What time is check-out?", answer: "Standard check-out is 12:00 noon. Late check-out is subject to availability." },
  { question: "Where is breakfast served?", answer: "Breakfast is served at Palm Restaurant from 06:30 to 10:30 daily." },
  { question: "How do I connect to Wi-Fi?", answer: "Join GrandPalms-Guest and enter your surname and room number." },
  { question: "Can I invite a visitor?", answer: "Yes. Please register all visitors with Front Desk before they proceed to your room." },
];
