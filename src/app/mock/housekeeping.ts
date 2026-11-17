// Housekeeping made-up data. The board, My Tasks, the schedule and the dashboards read
// rooms from here. Who is leaving, staying or arriving comes from mock/frontOffice.ts,
// so a room never says "stayover" on one screen and "departure" on another.
import { STAYS, ARRIVALS, leavesToday } from "./frontOffice";

export type HKStatus = "Dirty" | "In Progress" | "Clean" | "Inspected";
export type HKRoom = {
  id: string; type: string; floor: number; hkSt: HKStatus; attendant: string | null;
  priority: boolean; since: string; dnd: boolean; awaitingInspection: boolean; note: string;
  guestState: "Departure" | "Arrival" | "Stayover" | "Vacant";
};

export const ATTENDANTS = ["Fatima Musa", "Amaka Osei", "Ngozi Ike"];

// Housekeeping's own facts per room; guestState is filled in from Front Office below.
const ROOMS: Omit<HKRoom, "guestState">[] = [
  { id: "101", type: "Deluxe",   floor: 1, hkSt: "Dirty",       attendant: "Fatima Musa", priority: true,  since: "08:00", dnd: false, awaitingInspection: false, note: "" },
  { id: "102", type: "Standard", floor: 1, hkSt: "In Progress", attendant: "Fatima Musa", priority: false, since: "09:15", dnd: false, awaitingInspection: false, note: "Re-clean after failed inspection" },
  { id: "103", type: "Standard", floor: 1, hkSt: "Inspected",   attendant: "Amaka Osei",  priority: false, since: "09:40", dnd: false, awaitingInspection: false, note: "" },
  { id: "104", type: "Deluxe",   floor: 1, hkSt: "Clean",       attendant: "Fatima Musa", priority: false, since: "09:45", dnd: false, awaitingInspection: true,  note: "" },
  { id: "118", type: "Standard", floor: 1, hkSt: "Dirty",       attendant: "Fatima Musa", priority: false, since: "08:10", dnd: false, awaitingInspection: false, note: "" },
  { id: "201", type: "Standard", floor: 2, hkSt: "Dirty",       attendant: "Ngozi Ike",   priority: false, since: "08:30", dnd: false, awaitingInspection: false, note: "" },
  { id: "202", type: "Deluxe",   floor: 2, hkSt: "Dirty",       attendant: null,          priority: true,  since: "08:00", dnd: false, awaitingInspection: false, note: "" },
  { id: "203", type: "Suite",    floor: 2, hkSt: "Dirty",       attendant: "Ngozi Ike",   priority: false, since: "08:20", dnd: false, awaitingInspection: false, note: "Late check-out 14:00" },
  { id: "302", type: "Deluxe",   floor: 3, hkSt: "Dirty",       attendant: "Amaka Osei",  priority: false, since: "09:30", dnd: false, awaitingInspection: false, note: "" },
  { id: "303", type: "Deluxe",   floor: 3, hkSt: "Clean",       attendant: "Amaka Osei",  priority: true,  since: "10:00", dnd: false, awaitingInspection: true,  note: "High floor guest arriving 15:30" },
  { id: "304", type: "Standard", floor: 3, hkSt: "In Progress", attendant: "Amaka Osei",  priority: false, since: "08:15", dnd: false, awaitingInspection: false, note: "" },
  { id: "501", type: "Suite",    floor: 5, hkSt: "Inspected",   attendant: "Fatima Musa", priority: false, since: "09:55", dnd: false, awaitingInspection: false, note: "" },
  { id: "502", type: "Suite",    floor: 5, hkSt: "Inspected",   attendant: "Fatima Musa", priority: true,  since: "10:20", dnd: false, awaitingInspection: false, note: "VIP arrival 14:00: champagne and fruit basket" },
];

const guestState = (room: string): HKRoom["guestState"] => {
  const stay = STAYS.find(s => s.room === room);
  if (stay) return leavesToday(stay) ? "Departure" : "Stayover";
  return ARRIVALS.some(a => a.room === room) ? "Arrival" : "Vacant";
};

// Do not disturb is the guest's request, so it comes from the stay too.
export const hkRooms = (): HKRoom[] => ROOMS.map(r => ({ ...r, guestState: guestState(r.id), dnd: !!STAYS.find(s => s.room === r.id)?.dnd }));
export const roomsFor = (attendant: string) => hkRooms().filter(r => r.attendant === attendant);
