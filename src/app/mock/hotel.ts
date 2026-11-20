// Actions that touch more than one department. Each one changes every record involved,
// so a screen never has to keep two departments in step by itself.
// PR C adds the bell: each action will also tell the people who need to know.
import { BUSINESS_DATE } from "../constants";
import { ARRIVALS, STAYS, gridBookings, nextBookingId, initials, addFutureBooking, addArrival, arrivalToStay, endStay, setArrivalRoom, arrivalToNoShow } from "./frontOffice";
import { updateRoom, hkStatus } from "./housekeeping";
import { ROOMS } from "./property";
import { workOrder, updateWorkOrder, isOutOfOrder, type WorkOrder } from "./maintenance";

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// True when nobody holds the room on any of the nights from checkin for that many nights.
export const roomFree = (room: string, checkin: Date, nights: number) => {
  const from = day(checkin), to = addDays(from, nights);
  return !gridBookings().some(b => b.room === room && day(b.checkin) < to && day(b.checkout) > from);
};

export type NewBooking = { guest: string; room: string; type: string; checkin: Date; nights: number; rate: number; source: string; vip?: boolean; status?: "Confirmed" | "Pending"; balance?: number };
// Saves a booking, or returns null when the room is already taken on one of those nights.
// A booking starting today joins today's arrivals, so Check-In offers it.
export const addBooking = (b: NewBooking) => {
  // An empty room means "room at check-in"; only a chosen room is checked for clashes.
  if (b.nights < 1 || (b.room && !roomFree(b.room, b.checkin, b.nights))) return null;
  const id = nextBookingId(), status = b.status ?? "Confirmed";
  if (day(b.checkin).getTime() === day(BUSINESS_DATE).getTime())
    addArrival({ id, guest: b.guest, av: initials(b.guest), room: b.room, type: b.type, eta: "", nights: b.nights, rate: b.rate, vip: !!b.vip, requests: "", balance: b.balance ?? b.rate * b.nights, status, risk: false });
  else addFutureBooking({ id, room: b.room, guest: b.guest, checkin: day(b.checkin), checkout: addDays(day(b.checkin), b.nights), status, rate: b.rate, source: b.source, vip: !!b.vip, type: b.type });
  return id;
};

// Turns today's arrival into a guest in the room; Housekeeping then sees a stayover.
export const checkIn = (arrivalId: string, room: string, rate: number, paid: number) => {
  const a = ARRIVALS.find(x => x.id === arrivalId);
  if (!a || STAYS.some(s => s.room === room)) return null;
  return arrivalToStay(arrivalId, room, rate, paid);
};

// A walk-in is a booking for tonight checked in straight away.
export const walkIn = (b: Omit<NewBooking, "checkin" | "status">, paid: number) => {
  const id = addBooking({ ...b, checkin: BUSINESS_DATE });
  return id ? checkIn(id, b.room, b.rate, paid) : null;
};

// Ends the stay and puts the room on the Housekeeping board to be cleaned.
export const checkOut = (stayId: string) => {
  const s = endStay(stayId);
  if (s) updateRoom(s.room, { hkSt: "Dirty", awaitingInspection: false, note: "" });
  return s;
};

// Closing or cancelling the last order that held a room sends it to Housekeeping dirty, not straight to sale.
export const finishWorkOrder = (id: string, status: "Closed" | "Cancelled", patch: Partial<WorkOrder>, log: { event: string; by: string; note: string }) => {
  const w = workOrder(id); if (!w) return null;
  updateWorkOrder(id, { ...patch, status }, log);
  const backToHousekeeping = !!w.room && w.outOfOrder && !isOutOfOrder(w.room) && !STAYS.some(s => s.room === w.room);
  if (backToHousekeeping) updateRoom(w.room!, { hkSt: "Dirty", awaitingInspection: false, note: "Back from maintenance: clean before it is sold" });
  return { order: w, backToHousekeeping };
};

// Rooms an arrival can be given: its booked type, free for every night of the stay and not out of order,
// ready rooms first so the guest is not kept waiting.
export const roomsForArrival = (arrivalId: string) => {
  const a = ARRIVALS.find(x => x.id === arrivalId); if (!a) return [];
  const ready = (id: string) => ["Clean", "Inspected"].includes(hkStatus(id) ?? "") ? 0 : 1;
  return ROOMS.filter(r => r.type === a.type && !isOutOfOrder(r.id) && (r.id === a.room || roomFree(r.id, BUSINESS_DATE, a.nights)))
    .map(r => r.id).sort((x, y) => ready(x) - ready(y) || x.localeCompare(y));
};
export const assignRoom = (arrivalId: string, room: string) => {
  if (!roomsForArrival(arrivalId).includes(room)) return false;
  setArrivalRoom(arrivalId, room);
  return true;
};
// The room is released, so the grid and New Reservation can sell it again.
export const markNoShow = (arrivalId: string, reason: string) => arrivalToNoShow(arrivalId, reason);
// Asks Housekeeping to do this room next because its guest is on the way.
export const rushRoom = (room: string) => updateRoom(room, { priority: true });
