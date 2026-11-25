import { describe, expect, test } from "vitest";
import { BUSINESS_DATE } from "../constants";
import { addBooking, checkIn, checkOut, walkIn, finishWorkOrder, roomFree } from "./hotel";
import { roomState } from "./rooms";
import { ARRIVALS, STAYS, reservations, gridBookings } from "./frontOffice";
import { hkRooms, addInspection } from "./housekeeping";
import { addWorkOrder, moveWorkOrder } from "./maintenance";

// Takes a job from raised to verified the way the department does: assigned, accepted, done, checked by someone else.
const toVerified = (id: string) => {
  for (const [to, m] of [["Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" }], ["Accepted", { by: "Emeka Obi" }], ["In progress", { by: "Emeka Obi" }],
    ["Completed", { by: "Emeka Obi", note: "Fixed" }], ["Verified", { by: "Yusuf Garba" }]] as const) expect(moveWorkOrder(id, to, m)).toBeNull();
};


const plus = (n: number) => { const d = new Date(BUSINESS_DATE); d.setDate(d.getDate() + n); return d; };

describe("hotel actions", () => {
  test("check-out ends the stay, the room goes dirty, and only a passed inspection makes it sellable", () => {
    const stay = STAYS.find(s => s.room === "202")!;
    checkOut(stay.id);
    expect(STAYS.some(s => s.id === stay.id)).toBe(false);
    expect(reservations().find(r => r.id === stay.id)?.status).toBe("Checked Out");
    expect(hkRooms().find(r => r.id === "202")).toMatchObject({ hkSt: "Dirty", guestState: "Vacant" });
    expect(roomState("202")).toBe("Being cleaned");
    addInspection({ room: "202", attendant: "Ngozi Ike", inspector: "Grace Mensah", ts: "Today", failed: [], notes: "" });
    expect(roomState("202")).toBe("Ready");
  });

  test("a second booking on a night the room is taken is refused", () => {
    const first = addBooking({ guest: "Test One", room: "110", type: "Deluxe", checkin: plus(10), nights: 3, rate: 55000, source: "Phone" });
    expect(first).toMatch(/^BK-\d+$/);
    expect(gridBookings().some(b => b.id === first && b.room === "110")).toBe(true);
    expect(addBooking({ guest: "Test Two", room: "110", type: "Deluxe", checkin: plus(12), nights: 2, rate: 55000, source: "Phone" })).toBeNull();
    expect(roomFree("110", plus(13), 2)).toBe(true); // check-out day is free again
  });

  test("a booking for today becomes an arrival, and check-in puts the guest in the room", () => {
    const id = addBooking({ guest: "Test Three", room: "111", type: "Deluxe", checkin: BUSINESS_DATE, nights: 2, rate: 55000, source: "Phone" })!;
    expect(ARRIVALS.some(a => a.id === id)).toBe(true);
    expect(roomState("111")).toBe("Arriving today");
    checkIn(id, "111", 55000, 0);
    expect(ARRIVALS.some(a => a.id === id)).toBe(false);
    expect(roomState("111")).toBe("Occupied");
    expect(hkRooms().find(r => r.id === "111")?.guestState).toBe("Stayover");
  });

  test("a walk-in is booked and checked in at once, and cannot take an occupied room", () => {
    expect(walkIn({ guest: "Test Four", room: "113", type: "Deluxe", nights: 1, rate: 55000, source: "Walk-in" }, 55000)?.room).toBe("113");
    expect(walkIn({ guest: "Test Five", room: "113", type: "Deluxe", nights: 1, rate: 55000, source: "Walk-in" }, 0)).toBeNull();
  });

  test("closing the last out-of-order order sends the room to Housekeeping dirty", () => {
    const w = addWorkOrder({ title: "Socket", location: "Room 114", cat: "Electrical", priority: "P1", reportedBy: "Test", desc: "", room: "114", outOfOrder: true });
    expect(finishWorkOrder(w.id, "Closed", "Adaeze Okonkwo").refused).toMatch(/cannot/); // not verified yet
    toVerified(w.id);
    const r = finishWorkOrder(w.id, "Closed", "Adaeze Okonkwo");
    expect(r?.backToHousekeeping).toBe(true);
    expect(roomState("114")).toBe("Being cleaned");
  });
});

import { assignRoom, roomsForBooking, markNoShow } from "./hotel";
describe("today's arrivals", () => {
  test("an arrival can only be given a free room of its type, ready rooms first", () => {
    const a = ARRIVALS.find(x => x.id === "BK-2857")!; // Standard, no room yet
    const rooms = roomsForBooking(a.id);
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms.indexOf("102")).toBeGreaterThan(rooms.indexOf("103")); // 102 is being cleaned, 103 is ready
    expect(assignRoom(a.id, "202")).toBe(false); // a Deluxe room
    expect(assignRoom(a.id, rooms[0])).toBe(true);
    expect(roomState(rooms[0])).toBe("Arriving today");
  });

  test("a no-show leaves today's list, shows in Reservation Search and frees the room", () => {
    const a = ARRIVALS.find(x => x.id === "BK-2856")!; // room 303
    markNoShow(a.id, "No answer on two calls");
    expect(ARRIVALS.some(x => x.id === a.id)).toBe(false);
    expect(reservations().find(r => r.id === a.id)?.status).toBe("No Show");
    expect(roomFree("303", BUSINESS_DATE, 1)).toBe(true);
  });
});

import { typeAvailable } from "./hotel";
describe("room at check-in", () => {
  test("bookings without a room use up their type, so the type cannot be oversold", () => {
    const night = plus(40);
    const left = typeAvailable("Suite", night, 1);
    expect(left).toBeGreaterThan(0);
    for (let i = 0; i < left; i++) expect(addBooking({ guest: `Suite ${i}`, room: "", type: "Suite", checkin: night, nights: 1, rate: 85000, source: "Phone" })).not.toBeNull();
    expect(typeAvailable("Suite", night, 1)).toBe(0);
    expect(addBooking({ guest: "One too many", room: "", type: "Suite", checkin: night, nights: 1, rate: 85000, source: "Phone" })).toBeNull();
    expect(roomFree("505", night, 1)).toBe(true); // no room was taken, the type is just full
    expect(addBooking({ guest: "Named room", room: "505", type: "Suite", checkin: night, nights: 1, rate: 85000, source: "Phone" })).toBeNull();
  });
});
