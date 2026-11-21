// One check per finding of the Phase 1 audit (21 Nov).
import { describe, expect, test } from "vitest";
import { BUSINESS_DATE } from "../constants";
import { addBooking, checkIn, checkOut, markNoShow, assignRoom, roomsForBooking, finishWorkOrder, roomFree } from "./hotel";
import { ARRIVALS, STAYS, reservations, balanceOf, addDiscount, unassignedFuture, gridBookings } from "./frontOffice";
import { requestApproval, decide } from "./approvals";
import { addInspection } from "./housekeeping";
import { addWorkOrder } from "./maintenance";
import { noticesFor, setCurrentUser } from "./notify";

const plus = (n: number) => { const d = new Date(BUSINESS_DATE); d.setDate(d.getDate() + n); return d; };

describe("Phase 1 audit fixes", () => {
  test("1. check-in refuses a room booked by someone else on a later night of the stay", () => {
    const ngozi = ARRIVALS.find(a => a.guest === "Ngozi Adeyemi")!; // Deluxe, 4 nights; 104 is booked from tomorrow
    expect(roomFree("104", BUSINESS_DATE, ngozi.nights, ngozi.id)).toBe(false);
    expect(checkIn(ngozi.id, "104", ngozi.rate, 0)).toBeNull();
    expect(checkIn(ngozi.id, "112", ngozi.rate, 0)).toBeNull(); // out of order
  });

  test("2. a booking number is never given twice, even after a no-show", () => {
    const first = addBooking({ guest: "Id One", room: "", type: "Standard", checkin: BUSINESS_DATE, nights: 1, rate: 35000, source: "Phone" })!;
    markNoShow(first, "No answer");
    const second = addBooking({ guest: "Id Two", room: "", type: "Standard", checkin: BUSINESS_DATE, nights: 1, rate: 35000, source: "Phone" })!;
    expect(second).not.toBe(first);
    const ids = reservations().map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("3. a money approval after the guest has left is declined, not applied to a closed bill", () => {
    const stay = STAYS.find(s => s.room === "205")!;
    const a = requestApproval({ kind: "Discount", dept: "Front Office", ref: stay.id, title: "Late", detail: "₦9,000 off", reason: "Noise", requestedBy: "Chioma Nwosu", apply: () => addDiscount(stay.id, 9000) });
    checkOut(stay.id);
    expect(decide(a.id, true, "Adaeze Okonkwo", "MGT")).toMatch(/checked out/);
    expect(a.status).toBe("Declined");
  });

  test("4. a discount lowers what the guest owes on every screen", () => {
    const stay = STAYS.find(s => s.room === "206")!;
    const before = balanceOf(stay);
    addDiscount(stay.id, 5000);
    expect(balanceOf(stay)).toBe(before - 5000);
  });

  test("5. a later booking with no room yet is listed and can be given a free room of its type", () => {
    const id = addBooking({ guest: "Later Guest", room: "", type: "Executive", checkin: plus(20), nights: 2, rate: 70000, source: "Phone" })!;
    expect(unassignedFuture().some(b => b.id === id)).toBe(true);
    const rooms = roomsForBooking(id);
    expect(rooms.length).toBeGreaterThan(0);
    expect(assignRoom(id, rooms[0])).toBe(true);
    expect(gridBookings().find(b => b.id === id)?.room).toBe(rooms[0]);
    expect(unassignedFuture().some(b => b.id === id)).toBe(false);
  });

  test("6. a failed inspection tells the attendant what failed, in words", () => {
    setCurrentUser("Grace Mensah", "HK");
    addInspection({ room: "207", attendant: "Amaka Osei", inspector: "Grace Mensah", ts: "Today", failed: [2, 3, 4], notes: "" });
    expect(noticesFor("Amaka Osei", "HK").find(n => n.title === "Room 207 failed inspection")?.body).toBe("Clean it again: Bathroom scrubbed, Toilet disinfected, Minibar restocked.");
  });

  test("7. cancelling a job tells the person who reported it, with the reason", () => {
    setCurrentUser("Emeka Obi", "MX");
    const w = addWorkOrder({ title: "Dripping tap", location: "Room 208", cat: "Plumbing", priority: "Low", reportedBy: "Fatima Musa", desc: "" });
    finishWorkOrder(w.id, "Cancelled", {}, { event: "Cancelled", by: "Emeka Obi", note: "Same as WO-0090" });
    expect(noticesFor("Fatima Musa", "HK").find(n => n.title === `${w.id} was cancelled: Dripping tap`)?.body).toBe("Same as WO-0090");
  });
});
