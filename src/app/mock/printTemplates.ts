export type PrintTemplateId = "folio" | "receipt" | "registration" | "kitchen" | "trip" | "audit";

export const PRINT_TEMPLATE_OPTIONS: Array<{ id: PrintTemplateId; name: string; paper: string; description: string }> = [
  { id: "folio", name: "Guest Folio / Invoice", paper: "A4", description: "Itemised charges, taxes, payments and balance" },
  { id: "receipt", name: "Payment Receipt", paper: "80mm / A4", description: "Guest payment acknowledgement" },
  { id: "registration", name: "Registration Card", paper: "A4", description: "Guest identity, stay terms and signature" },
  { id: "kitchen", name: "Kitchen Ticket", paper: "80mm", description: "Large-type production ticket" },
  { id: "trip", name: "Trip Sheet / Waybill", paper: "A4", description: "Vehicle, route, fuel and signatures" },
  { id: "audit", name: "Night Audit Report", paper: "A4", description: "Daily occupancy, revenue and exceptions" },
];

export const HOTEL_PRINT_DETAILS = {
  hotel: "Grand Palms Hotel Ikoyi",
  legalEntity: "Nexura Hospitality Services Limited",
  address: "17 Alexander Avenue, Ikoyi, Lagos",
  phone: "+234 1 700 4410",
  email: "accounts@grandpalms.ng",
  tin: "21009483-0001",
  bank: "Access Bank · Nexura Hospitality Services Ltd · 0123456789",
};

export const FOLIO_INVOICE = {
  invoiceNo: "INV-2026-0841",
  date: "5 Aug 2026",
  guest: "Chukwuemeka Okafor",
  company: "Okafor & Balogun Chambers",
  address: "24 Bourdillon Road, Ikoyi, Lagos",
  reservation: "BK-2860",
  room: "301 · Suite",
  stay: "4–5 Aug 2026",
  lines: [
    { date: "4 Aug", description: "Suite accommodation", quantity: 1, unit: 91125, amount: 91125 },
    { date: "4 Aug", description: "Room service dinner", quantity: 1, unit: 18500, amount: 18500 },
    { date: "5 Aug", description: "Airport transfer", quantity: 1, unit: 25000, amount: 25000 },
  ],
  subtotal: 134625,
  vat: 10097,
  tourismLevy: 2693,
  total: 147415,
  payments: 100000,
  balance: 47415,
  terms: "Balance due at check-out. Quote the invoice number on all bank transfers.",
};

export const PAYMENT_RECEIPT = {
  receiptNo: "RCT-2026-1098",
  date: "4 Aug 2026",
  time: "16:42",
  guest: "Chukwuemeka Okafor",
  room: "301",
  amount: 100000,
  method: "POS / Card",
  reference: "GTB-POS-884201",
  cashier: "Chioma Nwosu",
};

export const REGISTRATION_CARD = {
  guest: "Chukwuemeka Okafor",
  phone: "+234 803 555 2041",
  email: "chukwuemeka.okafor@email.ng",
  nationality: "Nigerian",
  address: "24 Bourdillon Road, Ikoyi, Lagos",
  idType: "International Passport",
  idNumber: "A09843211",
  room: "301 · Suite",
  stay: "4 Aug 2026, 14:00 — 5 Aug 2026, 12:00",
  rate: 91125,
  vehicle: "LAG 482 GK",
  terms: "I accept responsibility for all charges incurred during this stay and agree to the hotel’s check-out, non-smoking, privacy and property-damage policies.",
};

export const KITCHEN_TICKET = {
  orderNo: "KOT-1842",
  location: "Room 301",
  time: "19:18",
  server: "Biodun Adeyemi",
  priority: "RUSH",
  items: [
    { quantity: 2, name: "Jollof Rice + Grilled Chicken", modifier: "Extra pepper · no coleslaw" },
    { quantity: 1, name: "Seafood Okra", modifier: "No prawns · allergy noted" },
    { quantity: 2, name: "Chapman", modifier: "Less ice" },
  ],
  note: "Guest has a shellfish allergy. Call room before dispatch.",
};

export const TRIP_SHEET = {
  tripNo: "TRP-2026-0318",
  date: "5 Aug 2026",
  vehicle: "Toyota Hiace · ABJ 621 XV",
  driver: "Uche Obi",
  passengers: "Chukwuemeka Okafor + 2 guests",
  pickup: "Grand Palms Maitama, Abuja",
  dropoff: "Nnamdi Azikiwe International Airport, Abuja",
  odometerStart: "48,214 km",
  odometerEnd: "48,263 km",
  distance: "49 km",
  fuel: "12 L · ₦14,400",
  charge: 35000,
};

export const NIGHT_AUDIT_REPORT = {
  businessDate: "4 Aug 2026",
  occupancy: "78.4% · 40 of 51 rooms",
  adr: 68450,
  revpar: 53665,
  revenue: [
    { category: "Room revenue", amount: 2738000 },
    { category: "Restaurant & bar", amount: 684500 },
    { category: "Transport", amount: 175000 },
    { category: "Laundry & other", amount: 96200 },
  ],
  taxes: [
    { name: "VAT 7.5%", amount: 277028 },
    { name: "Tourism levy", amount: 73874 },
  ],
  movements: { arrivals: 12, departures: 9, noShows: 2 },
  exceptions: [
    "Room 204: ₦18,500 balance exceeds approved credit threshold.",
    "POS terminal 2 settlement differs from PMS total by ₦2,000.",
  ],
  auditor: "Adaeze Okonkwo",
};
