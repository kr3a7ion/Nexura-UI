// Actions that touch more than one department. Each one changes every record involved,
// so a screen never has to keep two departments in step by itself.
// PR C adds the bell: each action will also tell the people who need to know.
import { BUSINESS_DATE } from "../constants";
import { ARRIVALS, STAYS, gridBookings, bookedOn, nextBookingId, initials, addFutureBooking, addArrival, arrivalToStay, endStay, setBookingRoom, arrivalToNoShow, stayDates, addNights, setStayRoom } from "./frontOffice";
import { updateRoom, hkStatus, hkRooms } from "./housekeeping";
import { notify } from "./notify";
import { ROOMS } from "./property";
import { workOrder, moveWorkOrder, isOutOfOrder } from "./maintenance";
import { issueStayKeys, cancelStayKeys, rekeyStay, type KeyChoice } from "./access";
import { roomState } from "./rooms";

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
export const checkIn = (arrivalId: string, room: string, rate: number, paid: number, by = "Front desk", keys?: KeyChoice) => {
  // The room must be free for every night of the stay, not just tonight, and not out of order.
  const a = ARRIVALS.find(x => x.id === arrivalId);
  if (!a || isOutOfOrder(room) || !roomFree(room, BUSINESS_DATE, a.nights, a.id)) return null;
  const stay = arrivalToStay(arrivalId, room, rate, paid);
  if (stay) {
    issueStayKeys(stay.id, by, keys); // the cards and passcode chosen at the desk, valid to the departure check-out time
    notify("guest.checkedIn", { title: `${stay.guest} checked in to room ${room}`, body: "Now a stayover on the Housekeeping board." });
  }
  return stay;
};

// A walk-in is a booking for tonight checked in straight away.
export const walkIn = (b: Omit<NewBooking, "checkin" | "status">, paid: number, by = "Front desk") => {
  const id = addBooking({ ...b, checkin: BUSINESS_DATE });
  return id ? checkIn(id, b.room, b.rate, paid, by) : null;
};

// Ends the stay and puts the room on the Housekeeping board to be cleaned.
export const checkOut = (stayId: string, by = "Front desk") => {
  const s = endStay(stayId);
  if (s) {
    cancelStayKeys(s.id, by); // no key outlives the stay
    updateRoom(s.room, { hkSt: "Dirty", awaitingInspection: false, note: "" });
    notify("guest.checkedOut", { title: `Room ${s.room} is free to clean`, body: `${s.guest} checked out.`, people: [attendantOf(s.room)], link: { screen: "hk-board", label: "Housekeeping Board" } });
  }
  return s;
};

const nightsFromToday = (stayId: string) => {
  const s = STAYS.find(x => x.id === stayId)!;
  return Math.max(1, Math.round((day(stayDates(s).checkout).getTime() - day(BUSINESS_DATE).getTime()) / 86400000));
};
/** More nights in the same room. The keys follow by themselves: they run to the stay's check-out time. */
export const extendStay = (stayId: string, nights: number, by: string): string | null => {
  const s = STAYS.find(x => x.id === stayId); if (!s) return "That guest is not in house.";
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) return "Extend by 1 to 30 nights.";
  if (!roomFree(s.room, stayDates(s).checkout, nights, s.id)) return `Room ${s.room} is booked from ${s.checkout}. Move the guest to another room first.`;
  addNights(s.id, nights, by);
  return null;
};
/** Rooms a guest can move to: ready now and free for the rest of the stay. */
export const roomsToMoveTo = (stayId: string) => {
  const s = STAYS.find(x => x.id === stayId); if (!s) return [];
  return ROOMS.filter(r => r.id !== s.room && roomState(r.id) === "Ready" && roomFree(r.id, BUSINESS_DATE, nightsFromToday(stayId), s.id));
};
/** Moves an in-house guest: new room on the stay, old keys stopped and new ones issued, old room to Housekeeping dirty.
 *  The nightly rate stays as it was; a different price is a rate change for approval. */
export const moveStay = (stayId: string, room: string, by: string, reason: string): string | null => {
  const s = STAYS.find(x => x.id === stayId); if (!s) return "That guest is not in house.";
  if (reason.trim().length < 3) return "Say why the guest is moving.";
  if (!roomsToMoveTo(stayId).some(r => r.id === room)) return `Room ${room} is not ready and free for the rest of this stay.`;
  const old = s.room;
  setStayRoom(stayId, room);
  rekeyStay(stayId, by, `Moved to room ${room}`);
  updateRoom(old, { hkSt: "Dirty", awaitingInspection: false, note: "" });
  notify("guest.moved", { title: `${s.guest} moved from room ${old} to ${room}`, body: `Room ${old} is free to clean. ${reason.trim()}`, people: [attendantOf(old)], link: { screen: "hk-board", label: "Housekeeping Board" } });
  return null;
};

// Closing or cancelling the last order that held a room sends it to Housekeeping dirty, not straight to sale.
// Only a verified job can be closed; cancelling needs a reason. Returns why it was refused, if it was.
export const finishWorkOrder = (id: string, status: "Closed" | "Cancelled", by: string, note = "") => {
  const w = workOrder(id); if (!w) return { refused: "There is no such work order.", backToHousekeeping: false };
  const refused = moveWorkOrder(id, status, { by, note });
  if (refused) return { refused, backToHousekeeping: false };
  const backToHousekeeping = !!w.room && w.outOfOrder && !isOutOfOrder(w.room) && !STAYS.some(s => s.room === w.room);
  if (backToHousekeeping) {
    updateRoom(w.room!, { hkSt: "Dirty", awaitingInspection: false, note: "Back from maintenance: clean before it is sold" });
    notify("room.backFromMaintenance", { title: `Room ${w.room} is back from maintenance`, body: "Clean and inspect it before it is sold.", people: [attendantOf(w.room!)], link: { screen: "hk-board", label: "Housekeeping Board" } });
  }
  notify("workOrder.closed", { title: `${w.id} ${status === "Closed" ? "is done" : "was cancelled"}: ${w.title}`, body: status === "Closed" ? w.resolution ?? "" : note, people: [w.reportedBy], link: { screen: "work-order-detail", label: "Work Order", param: w.id } });
  return { refused: null, backToHousekeeping };
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
