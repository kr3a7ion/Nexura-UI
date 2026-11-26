import { describe, expect, test } from "vitest";
import { STAYS, CHARGES, stayDates, gridBookings } from "./frontOffice";
import { extendStay, moveStay, roomsToMoveTo, addBooking } from "./hotel";
import { keysFor, activeKeysFor, validUntil } from "./access";
import { hkStatus } from "./housekeeping";

const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

describe("stay changes are saved, and keys follow", () => {
  test("a stay across New Year checks out the year after", () => {
    const d = stayDates({ checkin: "30 Dec", checkout: "2 Jan" }, new Date(2026, 11, 31));
    expect([iso(d.checkin), iso(d.checkout)]).toEqual(["2026-12-30", "2027-1-2"]);
    const later = stayDates({ checkin: "30 Dec", checkout: "2 Jan" }, new Date(2027, 0, 1));
    expect([iso(later.checkin), iso(later.checkout)]).toEqual(["2026-12-30", "2027-1-2"]);
  });

  test("extending moves the check-out, charges the nights, and the keys run to the new time", () => {
    // a stay whose room nobody has booked for the week after it leaves
    const s = STAYS.find(x => !gridBookings().some(b => b.id !== x.id && b.room === x.room))!;
    const before = stayDates(s).checkout.getTime(), lines = CHARGES[s.id].length, nights = s.nights;
    expect(extendStay(s.id, 0, "Chioma Nwosu")).toMatch(/1 to 30/);
    expect(extendStay(s.id, 2, "Chioma Nwosu")).toBeNull();
    expect(stayDates(s).checkout.getTime() - before).toBe(2 * 86400000);
    expect(s.nights).toBe(nights + 2);
    expect(CHARGES[s.id]).toHaveLength(lines + 1);
    expect(CHARGES[s.id].at(-1)).toMatchObject({ cat: "Room", qty: 2, by: "Chioma Nwosu" });
    expect(validUntil(activeKeysFor(s.id)[0])!.getTime()).toBeGreaterThan(before + 2 * 86400000 - 86400000);
  });

  test("no extension into someone else's booking", () => {
    const s = STAYS.find(x => !gridBookings().some(b => b.id !== x.id && b.room === x.room))!;
    expect(addBooking({ guest: "Next Guest", room: s.room, type: s.type, checkin: stayDates(s).checkout, nights: 2, rate: 50000, source: "Phone" })).toBeTruthy();
    expect(extendStay(s.id, 1, "Chioma Nwosu")).toMatch(/is booked from/);
  });

  test("a room move changes the room, re-keys the guest, and sends the old room to clean", () => {
    const s = STAYS.find(x => roomsToMoveTo(x.id).length)!, old = s.room, to = roomsToMoveTo(s.id)[0].id;
    expect(moveStay(s.id, to, "Chioma Nwosu", "")).toMatch(/Say why/);
    expect(moveStay(s.id, old, "Chioma Nwosu", "Noisy air conditioner")).toMatch(/not ready and free/);
    expect(moveStay(s.id, to, "Chioma Nwosu", "Noisy air conditioner")).toBeNull();
    expect(s.room).toBe(to);
    expect(activeKeysFor(s.id).every(k => k.room === to)).toBe(true);
    expect(keysFor(s.id).filter(k => k.room === old).every(k => k.status === "Cancelled" && k.reason === `Moved to room ${to}`)).toBe(true);
    expect(hkStatus(old)).toBe("Dirty");
  });
});
