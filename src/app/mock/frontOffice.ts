// Front Office made-up data. Every Front Office screen reads guests, charges and
// arrivals from here, so one guest shows the same booking, room, stay and balance
// everywhere. When the hotel server is wired, this file is the one that changes.
import { BUSINESS_DATE, DEMO_STATE } from "../constants";
import { roomPrice, ROOMS } from "./property";

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
  { id: "BK-2843", folio: "FO-2842", guest: "Halima Yusuf", av: "HY", room: "203", type: "Suite", checkin: "21 Jun", checkout: "24 Jun", nights: 3, vip: true, phone: "+234 802 777 8888", visits: 8, paid: 321425, method: "Transfer", checkoutTime: "14:00", lateCheckout: true, dnd: true, requests: 0, complaints: 0, lastActivity: "Today 07:10", creditLimit: false, unposted: false },
  { id: "BK-2852", folio: "FO-2846", guest: "Tunde Lawal", av: "TL", room: "118", type: "Standard", checkin: "23 Jun", checkout: "24 Jun", nights: 1, vip: false, phone: "+234 807 444 2211", visits: 2, paid: 35000, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 0, complaints: 0, lastActivity: "23 Jun 21:15", creditLimit: false, unposted: false },
  // Staying on
  { id: "BK-2850", folio: "FO-2843", guest: "Chukwuemeka Obi", av: "CO", room: "304", type: "Standard", checkin: "24 Jun", checkout: "28 Jun", nights: 4, vip: false, phone: "+234 805 555 6666", visits: 1, paid: 35000, method: "Transfer", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 2, complaints: 1, lastActivity: "Today 07:55", creditLimit: true, unposted: true },
  { id: "BK-2845", folio: "FO-2844", guest: "Ibrahim Lawal", av: "IL", room: "302", type: "Deluxe", checkin: "23 Jun", checkout: "26 Jun", nights: 3, vip: false, phone: "+234 806 222 3333", visits: 2, paid: 182965, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: true, requests: 0, complaints: 0, lastActivity: "23 Jun 14:00", creditLimit: false, unposted: false },
  { id: "BK-2851", folio: "FO-2845", guest: "Dr. Chukwuemeka Bello", av: "CB", room: "501", type: "Suite", checkin: "24 Jun", checkout: "27 Jun", nights: 3, vip: true, phone: "+234 803 999 1111", visits: 12, paid: 301000, method: "Card", checkoutTime: "11:00", lateCheckout: false, dnd: false, requests: 1, complaints: 0, lastActivity: "Today 14:10", creditLimit: false, unposted: false },
];

// More guests so the demo hotel runs about 60% full: room, guest, check-in day in June, nights, share paid, VIP.
// These rooms have no future bookings, so nobody is double-booked.
const MORE: [string, string, number, number, number, boolean][] = [
  ["204", "Ngozi Chukwu", 22, 2, 1, false], ["205", "Babatunde Ojo", 23, 3, 0.5, false], ["206", "Aisha Bello", 21, 5, 1, false],
  ["207", "Peter Nwachukwu", 24, 2, 0.5, false], ["208", "Funmi Adebayo", 22, 4, 1, true], ["209", "Garba Usman", 23, 1, 1, false],
  ["210", "Kelechi Eze", 20, 6, 0.5, false], ["211", "Zainab Abdullahi", 24, 3, 1, false], ["212", "Olumide Bakare", 22, 2, 1, false],
  ["213", "Chinwe Okeke", 23, 4, 0.3, false], ["214", "Ahmed Musa", 21, 7, 1, true], ["216", "Tolu Ajayi", 24, 1, 1, false],
  ["217", "Uche Okonkwo", 23, 3, 0.5, false], ["301", "Hauwa Sani", 22, 4, 1, false], ["305", "Segun Oyelaran", 24, 2, 1, false],
  ["306", "Rukayat Lawal", 23, 2, 0, false], ["307", "Obinna Agu", 21, 6, 1, false], ["308", "Esther Danjuma", 24, 4, 0.5, false],
  ["310", "Yakubu Bala", 22, 2, 1, false], ["311", "Folake Ade", 23, 5, 1, true], ["312", "Ifeanyi Obi", 24, 3, 0.5, false],
  ["313", "Mariam Idris", 20, 7, 1, false], ["314", "Sunday Etim", 23, 1, 1, false], ["316", "Victoria Akpan", 22, 4, 1, false],
  ["317", "Danladi Yusuf", 24, 2, 0, false], ["503", "Chief Ayo Fashola", 22, 5, 1, true], ["504", "Dr. Amara Nnadi", 23, 3, 0.5, true],
  ["505", "Engr. Bello Kano", 24, 4, 1, false],
];
const moreStays: Stay[] = MORE.map(([room, guest, inDay, nights, share, vip], i) => {
  const type = ROOMS.find(r => r.id === room)?.type ?? "Standard", id = `BK-${2801 + i}`;
  return { id, folio: `FO-${2801 + i}`, guest, av: guest.split(" ").filter(w => !w.endsWith(".")).map(w => w[0]).join("").slice(0, 2), room, type,
    checkin: `${inDay} Jun`, checkout: `${inDay + nights} Jun`, nights, vip, phone: `+234 80${i % 10} ${String(100 + i * 7).slice(-3)} ${String(4000 + i * 13).slice(-4)}`,
    visits: 1 + (i % 4), paid: Math.round(roomPrice(type) * nights * 1.075 * share), method: (["Cash", "Card", "Transfer"] as const)[i % 3], checkoutTime: "11:00",
    lateCheckout: false, dnd: i % 9 === 4, requests: i % 5 === 0 ? 1 : 0, complaints: room === "316" ? 1 : 0, lastActivity: "Today 08:00", creditLimit: false, unposted: false };
});
ALL_STAYS.push(...moreStays);

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

for (const st of moreStays) {
  const unit = roomPrice(st.type), amount = unit * st.nights;
  CHARGES[st.id] = [{ date: st.checkin, cat: "Room", desc: `${st.type} Room ${st.room} × ${st.nights} night${st.nights === 1 ? "" : "s"}`, qty: st.nights, unit, amount, by: "System", tax: Math.round(amount * 0.075), reversed: false }];
}
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
export type ArrivalNote = { kind: string; text: string; by: string; at: string };
export type Arrival = { id: string; guest: string; av: string; room: string; type: string; eta: string; nights: number; rate: number; vip: boolean; requests: string; balance: number; status: string; risk: boolean; notes?: ArrivalNote[] };
const ALL_ARRIVALS: Arrival[] = [
  { id: "BK-2855", guest: "Chief Emeka Okafor", av: "EO", room: "502", type: "Suite",    eta: "14:00", nights: 3, rate: 85000, vip: true,  requests: "Champagne + fruit basket",         balance: 0,     status: "Confirmed", risk: false },
  { id: "BK-2856", guest: "Aisha Mohammed",     av: "AM", room: "303", type: "Deluxe",   eta: "15:30", nights: 2, rate: 55000, vip: false, requests: "High floor preferred",             balance: 27500, status: "Confirmed", risk: false },
  { id: "BK-2857", guest: "Peter Okafor",       av: "PO", room: "",    type: "Standard", eta: "12:00", nights: 1, rate: 35000, vip: false, requests: "",                                 balance: 35000, status: "Confirmed", risk: true  },
  { id: "BK-2858", guest: "Ngozi Adeyemi",      av: "NA", room: "",    type: "Deluxe",   eta: "16:00", nights: 4, rate: 55000, vip: true,  requests: "Extra pillows, no smoking floor",  balance: 0,     status: "Pending",   risk: false },
];

export const ARRIVALS: Arrival[] = EMPTY ? [] : ALL_ARRIVALS;

// Every booking the Reservation Grid draws: guests in house, today's arrivals with a room,
// and future bookings. Dates are real dates so the grid can place them on any day.
export type GridBooking = { id: string; room: string; guest: string; checkin: Date; checkout: Date; status: "Checked in" | "Confirmed" | "Pending"; rate: number; source: string; vip: boolean; type?: string };
const year = BUSINESS_DATE.getFullYear();
const dayMonth = (s: string) => new Date(`${s} ${year}`);
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const FUTURE: [string, string, string, string, number, GridBooking["status"], string][] = [
  // id, room, guest, check-in (ISO), nights, status, source
  ["BK-2861", "101", "Blessing Eze", "2026-06-25", 3, "Confirmed", "Phone"],
  ["BK-2874", "101", "Chioma Okafor", "2026-07-01", 3, "Confirmed", "Online"],
  ["BK-2863", "102", "Musa Ibrahim", "2026-06-26", 3, "Confirmed", "Online"],
  ["BK-2875", "102", "Kemi Suleiman", "2026-07-02", 3, "Pending", "Phone"],
  ["BK-2876", "103", "Damilola Ogunleye", "2026-06-27", 4, "Confirmed", "Walk-in"],
  ["BK-2866", "104", "Prof. Emeka Eze", "2026-06-25", 4, "Pending", "Direct"],
  ["BK-2871", "118", "Bola Adewale", "2026-06-25", 2, "Confirmed", "Online"],
  ["BK-2849", "201", "Dr. Hassan Umar", "2026-06-26", 5, "Confirmed", "Online"],
  ["BK-2867", "202", "Fatima Garba", "2026-06-25", 3, "Confirmed", "Online"],
  ["BK-2877", "202", "Alhaji Musa Sule", "2026-07-03", 4, "Confirmed", "Phone"],
  ["BK-2869", "203", "Yemi Ogundimu", "2026-06-26", 3, "Confirmed", "Walk-in"],
  ["BK-2879", "302", "Grace Uchenna", "2026-06-27", 3, "Confirmed", "Online"],
  ["BK-2870", "303", "Dr. Afolake Oladele", "2026-06-28", 5, "Confirmed", "Direct"],
  ["BK-2880", "304", "Ade Adeleke", "2026-06-29", 3, "Pending", "Direct"],
  ["BK-2881", "501", "Ifeoma Nnaji", "2026-06-30", 4, "Confirmed", "Corporate"],
];
const roomType = (room: string) => ROOMS.find(r => r.id === room)?.type ?? "";
// Bookings made in this session, and stays that have ended. shortcut: kept in memory until reload; the hotel server stores them.
const ADDED: GridBooking[] = [];
const DEPARTED: Reservation[] = [];
const NO_SHOWS: (Reservation & { reason: string })[] = [];
export const gridBookings = (): GridBooking[] => [
  ...ADDED,
  ...STAYS.map(s => ({ id: s.id, room: s.room, guest: s.guest, checkin: dayMonth(s.checkin), checkout: dayMonth(s.checkout), status: "Checked in" as const, rate: roomPrice(s.type), source: "Front desk", vip: s.vip })),
  ...ARRIVALS.filter(a => a.room).map(a => ({ id: a.id, room: a.room, guest: a.guest, checkin: BUSINESS_DATE, checkout: addDays(BUSINESS_DATE, a.nights), status: (a.status === "Pending" ? "Pending" : "Confirmed") as GridBooking["status"], rate: a.rate, source: "Phone", vip: a.vip })),
  ...(EMPTY ? [] : FUTURE.map(([id, room, guest, iso, n, status, source]) => {
    const checkin = new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
    return { id, room, guest, checkin, checkout: addDays(checkin, n), status, rate: roomPrice(roomType(room)), source, vip: false };
  })),
];
// Arrivals still waiting for a room; the grid shows them above the rooms.
export const unassignedArrivals = () => ARRIVALS.filter(a => !a.room);
// Rooms of a type taken on a night, counting bookings with no room yet, so "room at check-in" can't oversell a type.
export const bookedOn = (type: string, night: Date) =>
  gridBookings().filter(b => (b.type ?? roomType(b.room)) === type && b.checkin <= night && b.checkout > night).length
  + unassignedArrivals().filter(a => a.type === type && night >= BUSINESS_DATE && night < addDays(BUSINESS_DATE, a.nights)).length;

// Every booking in one list for Reservation Search, Cancellations and the dashboards.
// Built from the lists above, so it can never disagree with Front Office.
const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export type Reservation = { id: string; guest: string; room: string; type: string; checkin: string; checkout: string; status: string; source: string; nights: number; rate: number };
export const reservations = (): Reservation[] => [
  ...gridBookings().map(b => ({ id: b.id, guest: b.guest, room: b.room, type: b.type ?? roomType(b.room), checkin: short(b.checkin), checkout: short(b.checkout),
    status: b.status === "Checked in" ? "Checked In" : b.status, source: b.source, nights: Math.round((b.checkout.getTime() - b.checkin.getTime()) / 86400000), rate: b.rate })),
  ...unassignedArrivals().map(a => ({ id: a.id, guest: a.guest, room: "", type: a.type, checkin: TODAY, checkout: short(addDays(BUSINESS_DATE, a.nights)),
    status: a.status, source: "Phone", nights: a.nights, rate: a.rate })),
  ...DEPARTED,
  ...NO_SHOWS,
];

// Plain record changes. mock/hotel.ts calls these and keeps the other departments in step.
const bkNum = (id: string) => Number(id.slice(3));
export const nextBookingId = () => `BK-${Math.max(...[...STAYS, ...ARRIVALS, ...ADDED, ...DEPARTED].map(b => bkNum(b.id)), ...FUTURE.map(f => bkNum(f[0]))) + 1}`;
export const initials = (name: string) => name.split(/\s+/).filter(w => !w.endsWith(".")).map(w => w[0]).join("").slice(0, 2).toUpperCase();
export const addFutureBooking = (b: GridBooking) => { ADDED.push(b); };
export const addArrival = (a: Arrival) => { ARRIVALS.push(a); };
export const arrivalToStay = (arrivalId: string, room: string, rate: number, paid: number) => {
  const i = ARRIVALS.findIndex(a => a.id === arrivalId); if (i < 0) return null;
  const [a] = ARRIVALS.splice(i, 1);
  const type = roomType(room), amount = rate * a.nights;
  const stay: Stay = { id: a.id, folio: `FO-${bkNum(a.id)}`, guest: a.guest, av: a.av, room, type, checkin: TODAY, checkout: short(addDays(BUSINESS_DATE, a.nights)),
    nights: a.nights, vip: a.vip, phone: "", visits: 1, paid, method: "Cash", checkoutTime: "11:00", lateCheckout: false, dnd: false,
    requests: a.requests ? 1 : 0, complaints: 0, lastActivity: "Just now", creditLimit: false, unposted: false };
  CHARGES[a.id] = [{ date: TODAY, cat: "Room", desc: `${type} Room ${room} × ${a.nights} night${a.nights === 1 ? "" : "s"}`, qty: a.nights, unit: rate, amount, by: "System", tax: Math.round(amount * 0.075), reversed: false }];
  STAYS.push(stay);
  return stay;
};
// Changes the nightly rate on a stay's room charge, for example after an approved rate override.
export const setRoomRate = (stayId: string, rate: number) => {
  const row = CHARGES[stayId]?.find(c => c.cat === "Room" && !c.reversed); if (!row) return;
  Object.assign(row, { unit: rate, amount: rate * row.qty, tax: Math.round(rate * row.qty * 0.075) });
};
export const setLateCheckout = (stayId: string, time: string) => {
  const stay = STAYS.find(x => x.id === stayId); if (stay) Object.assign(stay, { lateCheckout: true, checkoutTime: time });
};
// Discounts given off a stay's bill, small ones at the desk and larger ones once approved.
const DISCOUNTS: Record<string, number> = {};
export const addDiscount = (stayId: string, amount: number) => { DISCOUNTS[stayId] = (DISCOUNTS[stayId] ?? 0) + amount; };
export const discountOf = (stayId: string) => DISCOUNTS[stayId] ?? 0;
// Today's arrivals screen: guests still to come, guests who already checked in today, and today's no-shows.
export const checkedInToday = () => STAYS.filter(s => s.checkin === TODAY);
export const noShowsToday = () => NO_SHOWS;
export const setArrivalRoom = (arrivalId: string, room: string) => { const a = ARRIVALS.find(x => x.id === arrivalId); if (a) a.room = room; };
export const addArrivalNote = (arrivalId: string, note: ArrivalNote) => { const a = ARRIVALS.find(x => x.id === arrivalId); if (a) a.notes = [...(a.notes ?? []), note]; };
export const arrivalToNoShow = (arrivalId: string, reason: string) => {
  const i = ARRIVALS.findIndex(a => a.id === arrivalId); if (i < 0) return null;
  const [a] = ARRIVALS.splice(i, 1);
  NO_SHOWS.push({ id: a.id, guest: a.guest, room: "", type: a.type, checkin: TODAY, checkout: short(addDays(BUSINESS_DATE, a.nights)), status: "No Show", source: "Phone", nights: a.nights, rate: a.rate, reason });
  return a;
};
export const endStay = (stayId: string) => {
  const i = STAYS.findIndex(s => s.id === stayId); if (i < 0) return null;
  const [s] = STAYS.splice(i, 1);
  DEPARTED.push({ id: s.id, guest: s.guest, room: s.room, type: s.type, checkin: s.checkin, checkout: TODAY, status: "Checked Out", source: "Front desk", nights: s.nights, rate: roomPrice(s.type) });
  return s;
};
