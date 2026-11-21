// Actions that touch more than one department. Each one changes every record involved,
// so a screen never has to keep two departments in step by itself.
// PR C adds the bell: each action will also tell the people who need to know.
import { BUSINESS_DATE } from "../constants";
import { ARRIVALS, STAYS, gridBookings, bookedOn, nextBookingId, initials, addFutureBooking, addArrival, arrivalToStay, endStay, setBookingRoom, arrivalToNoShow } from "./frontOffice";
import { updateRoom, hkStatus, hkRooms } from "./housekeeping";
import { notify } from "./notify";
import { ROOMS } from "./property";
import { workOrder, updateWorkOrder, isOutOfOrder, type WorkOrder } from "./maintenance";

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// True when nobody holds the room on any of the nights from checkin for that many nights.
// `except` is the booking being placed, so its own current room does not count against it.
export const roomFree = (room: string, checkin: Date, nights: number, except?: string) => {
  const from = day(checkin), to = addDays(from, nights);
  return !gridBookings().some(b => b.id !== except && b.room === room && day(b.checkin) < to && day(b.checkout) > from);
};

// How many rooms of a type are still free on every night of a stay, out-of-order rooms excluded.
export const typeAvailable = (type: string, checkin: Date, nights: number) => {
  const sellable = ROOMS.filter(r => r.type === type && !isOutOfOrder(r.id)).length;
  return Math.min(...Array.from({ length: Math.max(1, nights) }, (_, i) => { const n = addDays(day(checkin), i); n.setHours(12); return sellable - bookedOn(type, n); }));
};

export type NewBooking = { guest: string; room: string; type: string; checkin: Date; nights: number; rate: number; source: string; vip?: boolean; status?: "Confirmed" | "Pending"; balance?: number };
// Saves a booking, or returns null when the room is already taken on one of those nights.
// A booking starting today joins today's arrivals, so Check-In offers it.
export const addBooking = (b: NewBooking) => {
  // A chosen room must be free, and the type must have a room left once bookings with no room yet are counted.
  if (b.nights < 1 || (b.room && !roomFree(b.room, b.checkin, b.nights)) || typeAvailable(b.type, b.checkin, b.nights) < 1) return null;
  const id = nextBookingId(), status = b.status ?? "Confirmed";
  if (day(b.checkin).getTime() === day(BUSINESS_DATE).getTime())
    addArrival({ id, guest: b.guest, av: initials(b.guest), room: b.room, type: b.type, eta: "", nights: b.nights, rate: b.rate, vip: !!b.vip, requests: "", balance: b.balance ?? b.rate * b.nights, status, risk: false });
  else addFutureBooking({ id, room: b.room, guest: b.guest, checkin: day(b.checkin), checkout: addDays(day(b.checkin), b.nights), status, rate: b.rate, source: b.source, vip: !!b.vip, type: b.type });
  notify("booking.made", { title: `New booking: ${b.guest}`, body: `${b.room ? `Room ${b.room}` : `${b.type}, room at check-in`}, ${b.nights} night${b.nights === 1 ? "" : "s"} from ${day(b.checkin).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`, link: { screen: "reservation-grid", label: "Reservation Grid" } });
  return id;
};

// Turns today's arrival into a guest in the room; Housekeeping then sees a stayover.
export const checkIn = (arrivalId: string, room: string, rate: number, paid: number) => {
  // The room must be free for every night of the stay, not just tonight, and not out of order.
  const a = ARRIVALS.find(x => x.id === arrivalId);
  if (!a || isOutOfOrder(room) || !roomFree(room, BUSINESS_DATE, a.nights, a.id)) return null;
  const stay = arrivalToStay(arrivalId, room, rate, paid);
  if (stay) notify("guest.checkedIn", { title: `${stay.guest} checked in to room ${room}`, body: "Now a stayover on the Housekeeping board." });
  return stay;
};

// A walk-in is a booking for tonight checked in straight away.
export const walkIn = (b: Omit<NewBooking, "checkin" | "status">, paid: number) => {
  const id = addBooking({ ...b, checkin: BUSINESS_DATE });
  return id ? checkIn(id, b.room, b.rate, paid) : null;
};

// Ends the stay and puts the room on the Housekeeping board to be cleaned.
export const checkOut = (stayId: string) => {
  const s = endStay(stayId);
  if (s) {
    updateRoom(s.room, { hkSt: "Dirty", awaitingInspection: false, note: "" });
    notify("guest.checkedOut", { title: `Room ${s.room} is free to clean`, body: `${s.guest} checked out.`, people: [attendantOf(s.room)], link: { screen: "hk-board", label: "Housekeeping Board" } });
  }
  return s;
};

// Closing or cancelling the last order that held a room sends it to Housekeeping dirty, not straight to sale.
export const finishWorkOrder = (id: string, status: "Closed" | "Cancelled", patch: Partial<WorkOrder>, log: { event: string; by: string; note: string }) => {
  const w = workOrder(id); if (!w) return null;
  updateWorkOrder(id, { ...patch, status }, log);
  const backToHousekeeping = !!w.room && w.outOfOrder && !isOutOfOrder(w.room) && !STAYS.some(s => s.room === w.room);
  if (backToHousekeeping) {
    updateRoom(w.room!, { hkSt: "Dirty", awaitingInspection: false, note: "Back from maintenance: clean before it is sold" });
    notify("room.backFromMaintenance", { title: `Room ${w.room} is back from maintenance`, body: "Clean and inspect it before it is sold.", people: [attendantOf(w.room!)], link: { screen: "hk-board", label: "Housekeeping Board" } });
  }
  notify("workOrder.closed", { title: `${w.id} ${status === "Closed" ? "is done" : "was cancelled"}: ${w.title}`, body: status === "Closed" ? patch.resolution ?? "" : log.note, people: [w.reportedBy], link: { screen: "work-order-detail", label: "Work Order", param: w.id } });
  return { order: w, backToHousekeeping };
};

// Rooms a booking (today's arrival or a later one) can be given: its booked type, free for every night
// of the stay and not out of order, ready rooms first so the guest is not kept waiting.
export const roomsForBooking = (id: string) => {
  const a = ARRIVALS.find(x => x.id === id), g = a ? null : gridBookings().find(x => x.id === id);
  const b = a ? { type: a.type, checkin: BUSINESS_DATE, nights: a.nights }
    : g ? { type: g.type ?? ROOMS.find(r => r.id === g.room)?.type ?? "", checkin: g.checkin, nights: Math.round((day(g.checkout).getTime() - day(g.checkin).getTime()) / 86400000) } : null;
  if (!b) return [];
  const ready = (r: string) => ["Clean", "Inspected"].includes(hkStatus(r) ?? "") ? 0 : 1;
  return ROOMS.filter(r => r.type === b.type && !isOutOfOrder(r.id) && roomFree(r.id, b.checkin, b.nights, id))
    .map(r => r.id).sort((x, y) => ready(x) - ready(y) || x.localeCompare(y));
};
export const assignRoom = (id: string, room: string) => {
  if (!roomsForBooking(id).includes(room)) return false;
  setBookingRoom(id, room);
  return true;
};
// The room is released, so the grid and New Reservation can sell it again.
export const markNoShow = (arrivalId: string, reason: string) => {
  const a = arrivalToNoShow(arrivalId, reason);
  if (a) notify("arrival.noShow", { title: `No-show: ${a.guest}`, body: `${a.id}${a.room ? `, room ${a.room} released` : ""}. ${reason}` });
  return a;
};
// Asks Housekeeping to do this room next because its guest is on the way.
export const rushRoom = (room: string, guest: string) => {
  updateRoom(room, { priority: true });
  notify("arrival.rushRoom", { title: `Clean room ${room} next`, body: `${guest} is on the way.`, people: [attendantOf(room)], link: { screen: "hk-board", label: "Housekeeping Board" } });
};
const attendantOf = (room: string) => hkRooms().find(r => r.id === room)?.attendant ?? "";
