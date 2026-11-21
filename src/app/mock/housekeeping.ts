// Housekeeping made-up data. The board, My Tasks, the schedule and the dashboards read
// rooms from here. Changes are kept in memory so every screen sees them until the page reloads.
// shortcut: in-memory only; the hotel server replaces these functions when Housekeeping is wired.
// Who is leaving, staying or arriving comes from mock/frontOffice.ts,
// so a room never says "stayover" on one screen and "departure" on another.
import { STAYS, ARRIVALS, leavesToday } from "./frontOffice";
import { ROOMS as PROPERTY_ROOMS } from "./property";
import { isOutOfOrder } from "./maintenance";
import { notify } from "./notify";

export type HKStatus = "Dirty" | "In Progress" | "Clean" | "Inspected";
export type HKRoom = {
  id: string; type: string; floor: number; hkSt: HKStatus; attendant: string | null;
  priority: boolean; since: string; dnd: boolean; awaitingInspection: boolean; note: string;
  guestState: "Departure" | "Arrival" | "Stayover" | "Vacant";
};

export const ATTENDANTS = ["Fatima Musa", "Amaka Osei", "Ngozi Ike"];

// Housekeeping's own facts per room; guestState is filled in from Front Office below.
type HKFacts = Pick<HKRoom, "hkSt" | "attendant" | "priority" | "since" | "awaitingInspection" | "note">;
const FACTS: Record<string, HKFacts> = {
  "101": { hkSt: "Dirty",       attendant: "Fatima Musa", priority: true,  since: "08:00", awaitingInspection: false, note: "" },
  "102": { hkSt: "In Progress", attendant: "Fatima Musa", priority: false, since: "09:15", awaitingInspection: false, note: "Re-clean after failed inspection" },
  "103": { hkSt: "Inspected",   attendant: "Amaka Osei",  priority: false, since: "09:40", awaitingInspection: false, note: "" },
  "104": { hkSt: "Clean",       attendant: "Fatima Musa", priority: false, since: "09:45", awaitingInspection: true,  note: "" },
  "118": { hkSt: "Dirty",       attendant: "Fatima Musa", priority: false, since: "08:10", awaitingInspection: false, note: "" },
  "201": { hkSt: "Dirty",       attendant: "Ngozi Ike",   priority: false, since: "08:30", awaitingInspection: false, note: "" },
  "202": { hkSt: "Dirty",       attendant: null,          priority: true,  since: "08:00", awaitingInspection: false, note: "" },
  "203": { hkSt: "Dirty",       attendant: "Ngozi Ike",   priority: false, since: "08:20", awaitingInspection: false, note: "Late check-out 14:00" },
  "302": { hkSt: "Dirty",       attendant: "Amaka Osei",  priority: false, since: "09:30", awaitingInspection: false, note: "" },
  "303": { hkSt: "Clean",       attendant: "Amaka Osei",  priority: true,  since: "10:00", awaitingInspection: true,  note: "High floor guest arriving 15:30" },
  "304": { hkSt: "In Progress", attendant: "Amaka Osei",  priority: false, since: "08:15", awaitingInspection: false, note: "" },
  "501": { hkSt: "Inspected",   attendant: "Fatima Musa", priority: false, since: "09:55", awaitingInspection: false, note: "" },
  "502": { hkSt: "Inspected",   attendant: "Fatima Musa", priority: true,  since: "10:20", awaitingInspection: false, note: "VIP arrival 14:00: champagne and fruit basket" },
};
// Every room of the property; rooms without their own facts start the day inspected and unassigned.
const ROOMS: Omit<HKRoom, "guestState" | "dnd">[] = PROPERTY_ROOMS.map(r => ({
  id: r.id, type: r.type, floor: r.floor,
  ...(FACTS[r.id] ?? { hkSt: "Inspected", attendant: null, priority: false, since: "07:00", awaitingInspection: false,
    note: "" }),
}));

const guestState = (room: string): HKRoom["guestState"] => {
  const stay = STAYS.find(s => s.room === room);
  if (stay) return leavesToday(stay) ? "Departure" : "Stayover";
  return ARRIVALS.some(a => a.room === room) ? "Arrival" : "Vacant";
};

// Do not disturb is the guest's request, so it comes from the stay too.
export const hkRooms = (): HKRoom[] => ROOMS.map(r => ({ ...r, note: isOutOfOrder(r.id) ? "Out of order, with Maintenance" : r.note, type: PROPERTY_ROOMS.find(p => p.id === r.id)?.type ?? r.type, guestState: guestState(r.id), dnd: !!STAYS.find(s => s.room === r.id)?.dnd }));
export const hkStatus = (id: string) => ROOMS.find(r => r.id === id)?.hkSt;
export const roomsFor = (attendant: string) => hkRooms().filter(r => r.attendant === attendant);

// Status changes made on the board, My Tasks or an inspection.
export const updateRoom = (id: string, patch: Partial<Pick<HKRoom, "hkSt" | "attendant" | "awaitingInspection" | "note" | "priority">>) => {
  const r = ROOMS.find(x => x.id === id);
  if (r) Object.assign(r, patch);
};

// Inspections: the twelve checks a supervisor makes; a room passes with at least 10.
export const CHECKLIST = ["Bed made correctly", "Linen clean and pressed", "Bathroom scrubbed", "Toilet disinfected", "Minibar restocked", "Amenities replenished", "Floors vacuumed or mopped", "Surfaces dusted", "Mirrors polished", "TV and AC working", "Curtains aligned", "Nothing left behind"];
export const PASS_MARK = 10;
export type Inspection = { id: string; room: string; attendant: string; inspector: string; ts: string; failed: number[]; notes: string };
export const INSPECTIONS: Inspection[] = [
  { id: "INS-041", room: "103", attendant: "Amaka Osei",  inspector: "Grace Mensah", ts: "Today 09:40",     failed: [7],          notes: "Minor dust on top shelf. Otherwise excellent." },
  { id: "INS-040", room: "102", attendant: "Fatima Musa", inspector: "Grace Mensah", ts: "Today 09:30",     failed: [2, 3, 4, 5, 6], notes: "Bathroom not cleaned. Bed linen stained." },
  { id: "INS-039", room: "301", attendant: "Amaka Osei",  inspector: "David Okafor", ts: "Yesterday 16:00", failed: [],           notes: "Spotless." },
  { id: "INS-038", room: "203", attendant: "Ngozi Ike",   inspector: "Grace Mensah", ts: "Yesterday 14:30", failed: [4, 10],      notes: "Minibar not restocked; curtains not aligned." },
  { id: "INS-037", room: "501", attendant: "Fatima Musa", inspector: "David Okafor", ts: "Yesterday 11:00", failed: [],           notes: "Suite passed fully." },
];
export const passed = (i: Inspection) => CHECKLIST.length - i.failed.length >= PASS_MARK;
export const addInspection = (i: Omit<Inspection, "id">) => {
  const next = { ...i, id: `INS-${String(Number(INSPECTIONS[0].id.slice(4)) + 1).padStart(3, "0")}` };
  INSPECTIONS.unshift(next);
  updateRoom(i.room, passed(next) ? { hkSt: "Inspected", awaitingInspection: false } : { hkSt: "Dirty", awaitingInspection: false, note: "Re-clean after failed inspection" });
  if (passed(next)) notify("inspection.passed", { title: `Room ${i.room} is ready to sell`, body: `Passed inspection by ${i.inspector}.`, link: { screen: "reservation-grid", label: "Reservation Grid" } });
  else notify("inspection.failed", { title: `Room ${i.room} failed inspection`, body: `Clean it again: ${i.failed.map(n => CHECKLIST[n]).join(", ")}.`, people: [i.attendant], link: { screen: "hk-board", label: "Housekeeping Board" } });
  return next;
};

// Lost and found: attendants log items from My Tasks; the front desk works the list.
export type FoundItem = { id: string; desc: string; cat: string; storage: string; room: string; guestRes: string; guest: string; date: string; loggedBy: string; claimedBy: string; status: string };
export const FOUND_ITEMS: FoundItem[] = [
  { id: "LF-0041", desc: "iPhone 14 Pro (black)", cat: "Electronics", storage: "Front desk safe B-2", room: "202", guestRes: "BK-2790", guest: "Mrs. Adeola Bello", date: "22 Jun 2026", loggedBy: "Fatima Musa", claimedBy: "", status: "Held" },
  { id: "LF-0040", desc: "Gold bracelet", cat: "Jewellery", storage: "Safe box 1", room: "302", guestRes: "BK-2784", guest: "Dr. Emeka Chukwu", date: "20 Jun 2026", loggedBy: "Ngozi Ike", claimedBy: "Dr. Emeka Chukwu", status: "Claimed" },
  { id: "LF-0039", desc: "Blue Patagonia jacket", cat: "Clothing", storage: "Housekeeping store A", room: "104", guestRes: "BK-2779", guest: "Ms. Sarah Okafor", date: "18 Jun 2026", loggedBy: "Amaka Osei", claimedBy: "", status: "Held" },
  { id: "LF-0038", desc: "Laptop charger (Dell)", cat: "Electronics", storage: "Front desk shelf", room: "203", guestRes: "BK-2770", guest: "Mr. Tunde Adeyemi", date: "15 Jun 2026", loggedBy: "Fatima Musa", claimedBy: "Mr. Tunde Adeyemi", status: "Shipped" },
  { id: "LF-0037", desc: "Prescription glasses", cat: "Personal", storage: "Front desk safe B-1", room: "501", guestRes: "BK-2761", guest: "Mrs. Ngozi Eze", date: "10 Jun 2026", loggedBy: "Ngozi Ike", claimedBy: "", status: "Held" },
  { id: "LF-0036", desc: "Child's stuffed bear", cat: "Clothing", storage: "Disposed after 30 days", room: "103", guestRes: "BK-2752", guest: "Mr. Femi Adesanya", date: "1 Jun 2026", loggedBy: "Amaka Osei", claimedBy: "", status: "Disposed" },
];
export const logFoundItem = (i: Omit<FoundItem, "id" | "status" | "claimedBy">) => {
  const item = { ...i, claimedBy: "", id: `LF-${String(Number(FOUND_ITEMS[0].id.slice(3)) + 1).padStart(4, "0")}`, status: "Held" };
  FOUND_ITEMS.unshift(item);
  notify("foundItem.logged", { title: `Found item: ${item.desc}`, body: `Held in ${item.storage} as ${item.id}.`, link: { screen: "lost-found", label: "Lost & Found" } });
  return item;
};
