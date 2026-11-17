// Front Office made-up data. Every Front Office screen reads guests, charges and
// arrivals from here, so one guest shows the same booking, room, stay and balance
// everywhere. When the hotel server is wired, this file is the one that changes.
import { BUSINESS_DATE, DEMO_STATE } from "../constants";

// ?state=empty shows a quiet day: nobody in house, nobody arriving.
const EMPTY = DEMO_STATE === "empty";

export type ChargeRow = { date: string; cat: string; desc: string; qty: number; unit: number; amount: number; by: string; tax: number; reversed: boolean; movedTo?: string };

export type Stay = {
  id: string; folio: string; guest: string; av: string; room: string; type: string;
  checkin: string; checkout: string; nights: number; vip: boolean; phone: string; visits: number;
  paid: number;                       // deposits and payments so far
  method: "Cash" | "Card" | "Transfer";
  checkoutTime: string; lateCheckout: boolean;
  dnd: boolean; requests: number; complaints: number;
  lastActivity: string; creditLimit: boolean; unposted: boolean;
};

const TODAY = BUSINESS_DATE.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); // "24 Jun"

const ALL_STAYS: Stay[] = [
  // Leaving today
  { id: "BK-2848", folio: "FO-2841", guest: "Emmanuel Adeyemi", av: "EA", room: "202", type: "Deluxe", checkin: "22 Jun", checkout: "24 Jun", nights: 2, vip: false, phone: "+234 802 333 4444", visits: 3, paid: 55000, method: "Cash", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 1, complaints: 0, lastActivity: "Today 08:30", creditLimit: false, unposted: true },
  { id: "BK-2846", folio: "FO-2840", guest: "Adaeze Okonkwo", av: "AO", room: "101", type: "Deluxe", checkin: "21 Jun", checkout: "24 Jun", nights: 3, vip: true, phone: "+234 803 111 2222", visits: 5, paid: 183825, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 0, complaints: 0, lastActivity: "Today 09:42", creditLimit: false, unposted: false },
  { id: "BK-2843", folio: "FO-2842", guest: "Fatima Musa", av: "FM", room: "203", type: "Suite", checkin: "21 Jun", checkout: "24 Jun", nights: 3, vip: true, phone: "+234 802 777 8888", visits: 8, paid: 321425, method: "Transfer", checkoutTime: "14:00", lateCheckout: true, dnd: true, requests: 0, complaints: 0, lastActivity: "Today 07:10", creditLimit: false, unposted: false },
  { id: "BK-2852", folio: "FO-2846", guest: "Tunde Lawal", av: "TL", room: "118", type: "Standard", checkin: "23 Jun", checkout: "24 Jun", nights: 1, vip: false, phone: "+234 807 444 2211", visits: 2, paid: 35000, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 0, complaints: 0, lastActivity: "23 Jun 21:15", creditLimit: false, unposted: false },
  // Staying on
  { id: "BK-2850", folio: "FO-2843", guest: "Chukwuemeka Obi", av: "CO", room: "304", type: "Standard", checkin: "24 Jun", checkout: "28 Jun", nights: 4, vip: false, phone: "+234 805 555 6666", visits: 1, paid: 35000, method: "Transfer", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 2, complaints: 1, lastActivity: "Today 07:55", creditLimit: true, unposted: true },
  { id: "BK-2845", folio: "FO-2844", guest: "Ibrahim Lawal", av: "IL", room: "302", type: "Deluxe", checkin: "23 Jun", checkout: "26 Jun", nights: 3, vip: false, phone: "+234 806 222 3333", visits: 2, paid: 182965, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 0, complaints: 0, lastActivity: "23 Jun 14:00", creditLimit: false, unposted: false },
  { id: "BK-2851", folio: "FO-2845", guest: "Dr. Chukwuemeka Bello", av: "CB", room: "501", type: "Suite", checkin: "24 Jun", checkout: "27 Jun", nights: 3, vip: true, phone: "+234 803 999 1111", visits: 12, paid: 301000, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 1, complaints: 0, lastActivity: "Today 14:10", creditLimit: false, unposted: false },
];

export const STAYS: Stay[] = EMPTY ? [] : ALL_STAYS;

export const CHARGES: Record<string, ChargeRow[]> = {
  "BK-2848": [
    { date: "22 Jun", cat: "Room",       desc: "Deluxe Room 202 × 2 nights",   qty: 2, unit: 55000, amount: 110000, by: "System",   tax: 8250,  reversed: false },
    { date: "23 Jun", cat: "Restaurant", desc: "Room Service #RS-041",          qty: 1, unit: 8500,  amount: 8500,   by: "John A.",  tax: 638,   reversed: false },
    { date: "24 Jun", cat: "Bar",        desc: "Minibar — 2× Water, 1× Juice", qty: 3, unit: 1200,  amount: 3600,   by: "System",   tax: 270,   reversed: false },
    { date: "24 Jun", cat: "Laundry",    desc: "Express laundry — 3 items",    qty: 3, unit: 2000,  amount: 6000,   by: "HK Staff", tax: 450,   reversed: false },
  ],
  "BK-2846": [
    { date: "21 Jun", cat: "Room",       desc: "Deluxe Room 101 × 3 nights",   qty: 3, unit: 55000, amount: 165000, by: "System",   tax: 12375, reversed: false },
    { date: "23 Jun", cat: "Restaurant", desc: "Breakfast × 2 pax",            qty: 1, unit: 6000,  amount: 6000,   by: "F&B",      tax: 450,   reversed: false },
  ],
  "BK-2850": [
    { date: "24 Jun", cat: "Room",       desc: "Standard Room 304 × 4 nights", qty: 4, unit: 35000, amount: 140000, by: "System",   tax: 10500,  reversed: false },
    { date: "24 Jun", cat: "Bar",        desc: "Minibar consumption",           qty: 1, unit: 4500,  amount: 4500,   by: "System",   tax: 338,   reversed: false },
  ],
  "BK-2852": [
    { date: "23 Jun", cat: "Room",       desc: "Standard Room 118 × 1 night",  qty: 1, unit: 35000, amount: 35000,  by: "System",   tax: 2625,  reversed: false },
    { date: "23 Jun", cat: "Restaurant", desc: "Dinner and room service",        qty: 1, unit: 18500, amount: 18500,  by: "F&B",      tax: 1388,  reversed: false },
  ],
  "BK-2843": [
    { date: "21 Jun", cat: "Room",       desc: "Suite Room 203 × 3 nights",    qty: 3, unit: 85000, amount: 255000, by: "System",   tax: 19125, reversed: false },
    { date: "23 Jun", cat: "Restaurant", desc: "In-room dining × 3 meals",     qty: 3, unit: 12000, amount: 36000,  by: "F&B",      tax: 2700,  reversed: false },
    { date: "24 Jun", cat: "Laundry",    desc: "Same-day laundry — VIP",       qty: 1, unit: 8000,  amount: 8000,   by: "HK Staff", tax: 600,   reversed: false },
  ],
  "BK-2845": [
    { date: "23 Jun", cat: "Room",       desc: "Deluxe Room 302 × 3 nights",   qty: 3, unit: 55000, amount: 165000, by: "System",   tax: 12375, reversed: false },
    { date: "24 Jun", cat: "Bar",        desc: "Minibar — assorted",            qty: 1, unit: 5200,  amount: 5200,   by: "System",   tax: 390,   reversed: false },
  ],
  "BK-2851": [
    { date: "24 Jun", cat: "Room",       desc: "Suite Room 501 × 3 nights",    qty: 3, unit: 85000, amount: 255000, by: "System",   tax: 19125, reversed: false },
    { date: "24 Jun", cat: "Restaurant", desc: "Welcome dinner — VIP",          qty: 1, unit: 25000, amount: 25000,  by: "F&B",      tax: 1875,  reversed: false },
  ],
};

export const chargesTotal = (id: string) => (CHARGES[id] ?? []).filter(c => !c.reversed).reduce((s, c) => s + c.amount + c.tax, 0);
export const balanceOf = (s: Stay) => chargesTotal(s.id) - s.paid;
export const leavesToday = (s: Stay) => s.checkout === TODAY;
const nightsLeft = (s: Stay) => Math.max(0, Math.round((new Date(`${s.checkout} ${BUSINESS_DATE.getFullYear()}`).getTime() - BUSINESS_DATE.getTime()) / 86400000));

// Check-Out list
export const checkoutGuests = () => STAYS.map(s => ({
  id: s.id, guest: s.guest, av: s.av, room: s.room, type: s.type, nights: s.nights, checkin: s.checkin, checkout: s.checkout,
  deposit: s.paid, vip: s.vip, phone: s.phone, visits: s.visits, dueToday: leavesToday(s),
}));

// In-House Guests
export const inHouseGuests = () => STAYS.map(s => ({
  id: s.id, room: s.room, guest: s.guest, av: s.av, checkin: s.checkin, checkout: s.checkout, nights: s.nights,
  nightsLeft: nightsLeft(s), vip: s.vip, balance: balanceOf(s), dnd: s.dnd, requests: s.requests, complaints: s.complaints, type: s.type,
}));

// Departures List
export const departures = () => STAYS.filter(leavesToday).map(s => ({
  id: s.id, room: s.room, guest: s.guest, checkout: s.checkoutTime, nights: s.nights, balance: balanceOf(s),
  method: s.method as string, hkSt: "Occupied", lateFlag: s.lateCheckout, overstay: false, status: "Pending",
}));

// Folio Management
export const folios = () => STAYS.map(s => {
  const charges = chargesTotal(s.id), balance = charges - s.paid;
  return {
    id: s.folio, res: s.id, guest: s.guest, av: s.av, room: s.room, checkin: s.checkin, checkout: s.checkout,
    charges, payments: s.paid, balance, daysOpen: Math.max(1, s.nights - nightsLeft(s)), lastActivity: s.lastActivity,
    flags: { highBalance: balance > 100000, noPayment: s.paid === 0, creditLimit: s.creditLimit, unposted: s.unposted },
  };
});

// Today's arrivals: none of them are in house yet. Check-In and Arrivals list both read this.
const ALL_ARRIVALS = [
  { id: "BK-2855", guest: "Chief Emeka Okafor", av: "EO", room: "502", type: "Suite",    eta: "14:00", nights: 3, rate: 85000, vip: true,  requests: "Champagne + fruit basket",         balance: 0,     status: "Confirmed", risk: false },
  { id: "BK-2856", guest: "Aisha Mohammed",     av: "AM", room: "303", type: "Deluxe",   eta: "15:30", nights: 2, rate: 55000, vip: false, requests: "High floor preferred",             balance: 27500, status: "Confirmed", risk: false },
  { id: "BK-2857", guest: "Peter Okafor",       av: "PO", room: "",    type: "Standard", eta: "12:00", nights: 1, rate: 35000, vip: false, requests: "",                                 balance: 35000, status: "Confirmed", risk: true  },
  { id: "BK-2858", guest: "Ngozi Adeyemi",      av: "NA", room: "",    type: "Deluxe",   eta: "16:00", nights: 4, rate: 55000, vip: true,  requests: "Extra pillows, no smoking floor",  balance: 0,     status: "Pending",   risk: false },
];

export const ARRIVALS = EMPTY ? [] : ALL_ARRIVALS;
