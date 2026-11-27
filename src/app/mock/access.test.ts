import { describe, expect, test } from "vitest";
import { BUSINESS_DATE } from "../constants";
import { addBooking, checkIn, checkOut, walkIn } from "./hotel";
import { STAYS, setLateCheckout } from "./frontOffice";
import { keysFor, activeKeysFor, keyState, validUntil, addCard, reportLost, replacePasscode, cancelKey, keyLog, stopAllKeys, lockSettings } from "./access";

const arriveAndCheckIn = (room: string, nights = 2) => {
  const id = addBooking({ guest: `Key Guest ${room}`, room, type: "Deluxe", checkin: BUSINESS_DATE, nights, rate: 55000, source: "Phone" })!;
  return checkIn(id, room, 55000, 0, "Chioma Nwosu")!;
};

describe("guest keys follow the stay (A1)", () => {
  test("every guest already in house holds a card and a passcode", () => {
    for (const s of STAYS) expect(activeKeysFor(s.id).map(k => k.kind).sort()).toEqual(["Card", "Passcode"]);
  });

  test("check-in issues a card and a passcode, valid to the departure day's check-out time", () => {
    const stay = arriveAndCheckIn("119", 3);
    const [card, code] = keysFor(stay.id);
    expect(card).toMatchObject({ kind: "Card", room: "119", issuedBy: "Chioma Nwosu", status: "Active" });
    expect(code.code).toMatch(/^\d{6}$/);
    const until = validUntil(card)!;
    expect([until.getDate(), until.getHours()]).toEqual([BUSINESS_DATE.getDate() + 3, 11]);
    expect(keyLog().slice(0, 2).map(l => l.event)).toEqual(["Issued", "Issued"]);
  });

  test("a late check-out extends every key with no extra step", () => {
    const stay = arriveAndCheckIn("113", 1);
    setLateCheckout(stay.id, "15:00");
    expect(keysFor(stay.id).every(k => validUntil(k)!.getHours() === 15)).toBe(true);
  });

  test("check-out cancels every key the stay holds, in the same step", () => {
    const stay = arriveAndCheckIn("114", 1);
    addCard(stay.id, "Chioma Nwosu");
    checkOut(stay.id, "Chioma Nwosu");
    expect(keysFor(stay.id).every(k => k.status === "Cancelled" && k.endedBy === "Chioma Nwosu")).toBe(true);
    expect(activeKeysFor(stay.id)).toEqual([]);
  });

  test("a walk-in gets keys too", () => {
    const stay = walkIn({ guest: "Walk In Keys", room: "115", type: "Deluxe", nights: 1, rate: 55000, source: "Walk-in" }, 0, "Chioma Nwosu")!;
    expect(activeKeysFor(stay.id).length).toBe(2);
  });

  test("a lost card stops at once and a new one is encoded; a stay holds at most its card limit", () => {
    const stay = arriveAndCheckIn("116");
    const card = keysFor(stay.id).find(k => k.kind === "Card")!;
    const fresh = reportLost(card.id, "Chioma Nwosu", "Left in a taxi");
    expect(card.status).toBe("Lost");
    expect(fresh).toMatchObject({ kind: "Card", serial: "C-116-2", status: "Active" });
    expect(reportLost(card.id, "Chioma Nwosu")).toMatch(/Only an active card/);
    for (let i = activeKeysFor(stay.id).filter(k => k.kind === "Card").length; i < lockSettings().cardsPerStay; i++) expect(addCard(stay.id, "Chioma Nwosu")).toMatchObject({ kind: "Card" });
    expect(addCard(stay.id, "Chioma Nwosu")).toMatch(/hold 4 cards/);
  });

  test("a new passcode stops the old one; cancelling needs a reason; the log is only ever added to", () => {
    const stay = arriveAndCheckIn("117");
    const old = keysFor(stay.id).find(k => k.kind === "Passcode")!;
    const lines = keyLog().length;
    const fresh = replacePasscode(stay.id, "Chioma Nwosu") as { code: string };
    expect(old.status).toBe("Cancelled");
    expect(fresh.code).not.toBe(old.code);
    expect(cancelKey(fresh as never as string, "Chioma Nwosu", "x")).toMatch(/not active/);
    const card = keysFor(stay.id).find(k => k.kind === "Card")!;
    expect(cancelKey(card.id, "Chioma Nwosu", "")).toMatch(/Say why/);
    expect(cancelKey(card.id, "Chioma Nwosu", "Guest returned it")).toBeNull();
    expect(keyLog().length).toBe(lines + 3);                       // cancel old code, issue new, cancel card
  });

  test("a key past its stay's check-out time reads as expired", () => {
    const stay = arriveAndCheckIn("118", 1);
    const k = keysFor(stay.id)[0];
    expect(keyState(k, new Date(validUntil(k)!.getTime() + 60000))).toBe("Expired");
  });

  test("stopping every key needs a reason, stops them all, and can't run twice", () => {
    const stay = arriveAndCheckIn("120");
    expect(stopAllKeys(stay.id, "Chioma Nwosu", "")).toMatch(/Say why/);
    expect(stopAllKeys(stay.id, "Chioma Nwosu", "Security incident")).toBe(2);
    expect(activeKeysFor(stay.id)).toHaveLength(0);
    expect(stopAllKeys(stay.id, "Chioma Nwosu", "Security incident")).toMatch(/no active keys/);
  });
});
