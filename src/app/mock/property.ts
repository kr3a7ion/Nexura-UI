// The property's own setup: room types, prices and rooms. Every screen reads these;
// Room Types and Rate Management change them. Nothing about one property belongs in a screen.
// shortcut: held in memory until the hotel server exists; changes last until the page reloads.

export type RoomType = {
  code: string; name: string; base: number; maxOcc: number; beds: string; size: string;
  amenities: string[]; description: string; order: number;
};

export const ROOM_TYPES: RoomType[] = [
  { code: "STD", name: "Standard", base: 35000, maxOcc: 2, beds: "1 King or 2 Twin", size: "28 m²", order: 1,
    amenities: ["Air conditioning", "Free Wi-Fi", "Flat-screen TV", "Mini fridge", "Safe", "Kettle", "En-suite shower"],
    description: "Comfortable rooms for business and leisure travellers." },
  { code: "DLX", name: "Deluxe", base: 55000, maxOcc: 3, beds: "1 King + sofa bed", size: "38 m²", order: 2,
    amenities: ["Air conditioning", "Free Wi-Fi", "Smart TV", "Minibar", "In-room safe", "Work desk", "Bathtub and shower", "Balcony"],
    description: "Larger rooms with a balcony and premium furnishings." },
  { code: "EXC", name: "Executive", base: 70000, maxOcc: 2, beds: "1 King", size: "45 m²", order: 3,
    amenities: ["Air conditioning", "Free Wi-Fi", "Smart TV", "Minibar", "Lounge access", "Work desk", "Rain shower"],
    description: "Corner rooms with lounge access for business guests." },
  { code: "STE", name: "Suite", base: 85000, maxOcc: 4, beds: "1 King + separate lounge", size: "65 m²", order: 4,
    amenities: ["Air conditioning", "Free Wi-Fi", "65\" Smart TV", "Full minibar", "Butler service", "Kitchenette", "Jacuzzi", "Dining area"],
    description: "Top-floor suites with a separate lounge and butler service." },
];

export const roomTypeNames = () => [...ROOM_TYPES].sort((a, b) => a.order - b.order).map(t => t.name);
export const roomPrice = (type: string) => ROOM_TYPES.find(t => t.name === type)?.base ?? 0;
export const replaceRoomTypes = (list: RoomType[]) => {
  // A renamed type renames its rooms too, so counts and prices still match.
  list.forEach(t => { const old = ROOM_TYPES.find(o => o.code === t.code); if (old && old.name !== t.name) ROOMS.forEach(r => { if (r.type === old.name) r.type = t.name; }); });
  ROOM_TYPES.splice(0, ROOM_TYPES.length, ...list);
};

export type Room = { id: string; type: string; floor: number };

// Demo property: floors 1–3 with 18 rooms each, suites on floor 5 (floor 4 is the restaurant and gym).
// A room keeps no state of its own: mock/rooms.ts works it out from the guests, work orders and cleaning.
const KNOWN: Record<string, string> = {
  "101": "Deluxe", "104": "Deluxe", "118": "Standard", "202": "Deluxe", "203": "Suite", "302": "Deluxe", "303": "Deluxe",
};
const typeFor = (n: number) => (n <= 8 ? "Standard" : n <= 14 ? "Deluxe" : "Executive");
export const ROOMS: Room[] = [
  ...[1, 2, 3].flatMap(floor => Array.from({ length: 18 }, (_, i) => ({ id: `${floor}${String(i + 1).padStart(2, "0")}`, type: typeFor(i + 1), floor }))),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `50${i + 1}`, type: "Suite", floor: 5 })),
].map(r => KNOWN[r.id] ? { ...r, type: KNOWN[r.id] } : r);

console.assert(ROOMS.length === 60 && ROOMS.every(r => roomPrice(r.type) > 0), "every demo room has a priced type");
