import { describe, expect, test } from "vitest";
import { STAYS, CHARGES, stayDates, gridBookings, postCharge, voidCharge, moveCharges, takePayment, paymentsFor, balanceOf } from "./frontOffice";
import { requestApproval, decide } from "./approvals";
import { extendStay, moveStay, roomsToMoveTo, addBooking, voidOrAsk, checkIn, roomsForBooking } from "./hotel";
import { ARRIVALS, addArrivalNote } from "./frontOffice";
import { waitingFor } from "./approvals";
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

  test("the bill is saved: charges, voids only once approved, moves off the bill, payments", () => {
    const s = STAYS[STAYS.length - 1], start = balanceOf(s);
    expect(postCharge(s.id, "Bar", "Two drinks", 4000, 2, "Chioma Nwosu")).toBe(true);
    expect(balanceOf(s)).toBe(start + 8600);
    const line = CHARGES[s.id].length - 1;
    const a = requestApproval({ kind: "Void", dept: "Front Office", ref: `${s.id}/${line}`, title: s.guest, detail: "₦8,600 off", reason: "Incorrectly posted",
      requestedBy: "Chioma Nwosu", apply: () => voidCharge(s.id, line, "Chioma Nwosu", "Incorrectly posted") });
    expect(balanceOf(s)).toBe(start + 8600);                                   // nothing changes while it waits
    expect(decide(a.id, true, "Chioma Nwosu", "MGT")).toMatch(/your own/);
    expect(decide(a.id, true, "Adaeze Okonkwo", "MGT")).toBeNull();
    expect(balanceOf(s)).toBe(start);
    expect(CHARGES[s.id][line]).toMatchObject({ reversed: true, voidReason: "Incorrectly posted" });
    expect(voidCharge(s.id, line, "x", "again")).toBe(false);

    postCharge(s.id, "Restaurant", "Dinner for a client", 10000, 1, "Chioma Nwosu");
    expect(moveCharges(s.id, [CHARGES[s.id].length - 1], "Company Folio · ACME-01")).toBe(true);
    expect(balanceOf(s)).toBe(start);                                          // on the company's account now

    const paid = paymentsFor(s.id).reduce((n, p) => n + p.amount, 0);
    expect(takePayment(s.id, 0, "Cash", "Chioma Nwosu")).toBe(false);
    expect(takePayment(s.id, 5000, "Cash", "Chioma Nwosu")).toBe(true);
    expect(paymentsFor(s.id).reduce((n, p) => n + p.amount, 0)).toBe(paid + 5000);
    expect(balanceOf(s)).toBe(start - 5000);
  });

  test("a small void is done at the desk; a bigger one waits for a manager", () => {
    const s = STAYS[0];
    postCharge(s.id, "Bar", "Soft drink", 1500, 1, "Chioma Nwosu");
    const small = CHARGES[s.id].length - 1;
    expect(voidOrAsk(s.id, small, "Chioma Nwosu", "")).toMatch(/Say why/);
    expect(voidOrAsk(s.id, small, "Chioma Nwosu", "Wrong room")).toBe("Voided");
    expect(CHARGES[s.id][small].reversed).toBe(true);
    postCharge(s.id, "Restaurant", "Dinner", 20000, 1, "Chioma Nwosu");
    const big = CHARGES[s.id].length - 1;
    expect(voidOrAsk(s.id, big, "Chioma Nwosu", "Guest complaint")).toBe("Asked");
    expect(CHARGES[s.id][big].reversed).toBe(false);
    expect(waitingFor("MGT").some(a => a.kind === "Void" && a.ref === `${s.id}/${big}`)).toBe(true);
  });

  test("the booking's request and notes stay with the guest after check-in", () => {
    const a = ARRIVALS.find(x => x.requests)!;
    addArrivalNote(a.id, { kind: "Note", text: "Arriving with a wheelchair", by: "Amina Yusuf", at: "Today" });
    const stay = checkIn(a.id, a.room || roomsForBooking(a.id)[0], a.rate, 0, "Chioma Nwosu")!;
    expect(stay.notes!.map(n => n.text)).toEqual([a.requests, "Arriving with a wheelchair"]);
  });
});
