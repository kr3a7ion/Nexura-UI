// Guest keys, as TTLock locks take them: cards encoded at the desk and door passcodes (phone eKeys come with the Android
// app). A key belongs to a stay. It is valid until the stay's departure day at its check-out time, worked out from the
// stay rather than stored, so a late check-out extends every key with no extra step. Check-out cancels them all.
// Every issue, cancel, loss and replacement is a line in an append-only key log that says who did it.
// Seeds use the business date and the stays in mock/frontOffice.ts; nothing here calls back into another department
// while loading.
import { BUSINESS_DATE } from "../constants";
import { STAYS, stayDates } from "./frontOffice";
import { notify } from "./notify";
import { now } from "./maintenance";

export const CARDS_PER_STAY = 4; // shortcut: fixed until Door Lock Settings holds it (A3)
export type KeyKind = "Card" | "Passcode";
export type GuestKey = { id: string; kind: KeyKind; stayId: string; room: string; guest: string; serial?: string; code?: string;
  issuedAt: Date; issuedBy: string; status: "Active" | "Cancelled" | "Lost"; endedAt?: Date; endedBy?: string; reason?: string };
export type KeyEvent = "Issued" | "Cancelled" | "Reported lost";
export type KeyLogLine = { id: string; at: Date; keyId: string; kind: KeyKind; room: string; guest: string; event: KeyEvent; by: string; note?: string };

const KEYS: GuestKey[] = [];
const LOG: KeyLogLine[] = [];
let keySeq = 0, logSeq = 0;
const DEPARTED: Record<string, Date> = {}; // stays that have checked out: their keys stopped then

/** The stay's departure: its check-out day ("24 Jun") at its check-out time ("11:00"). */
const departureOf = (stayId: string) => {
  const s = STAYS.find(x => x.id === stayId); if (!s) return DEPARTED[stayId];
  const d = stayDates(s).checkout, [h, m] = s.checkoutTime.split(":").map(Number); d.setHours(h, m);
  return isNaN(d.getTime()) ? undefined : d;
};
export const validUntil = (k: GuestKey) => k.endedAt ?? departureOf(k.stayId);
/** Active, or Expired once its stay's check-out time has passed without a check-out (the lock stops it either way). */
export const keyState = (k: GuestKey, t = now()) => k.status === "Active" && (validUntil(k)?.getTime() ?? Infinity) < t.getTime() ? "Expired" as const : k.status;

const log = (k: GuestKey, event: KeyEvent, by: string, note?: string, at = now()) =>
  LOG.unshift({ id: `KL-${String(++logSeq).padStart(4, "0")}`, at, keyId: k.id, kind: k.kind, room: k.room, guest: k.guest, event, by, note });
const newCode = (room: string) => {
  // A passcode is unique among the active codes on that room's lock.
  const taken = new Set(KEYS.filter(k => k.room === room && k.kind === "Passcode" && k.status === "Active").map(k => k.code));
  let code: string; do code = String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000); while (taken.has(code)); // opens a guest's door: not Math.random
  return code;
};
const issue = (stayId: string, kind: KeyKind, by: string, at = now(), note?: string) => {
  const s = STAYS.find(x => x.id === stayId)!;
  const cards = KEYS.filter(k => k.room === s.room && k.kind === "Card").length; // numbered by room across stays, so a serial names one card
  const k: GuestKey = { id: `KEY-${String(++keySeq).padStart(4, "0")}`, kind, stayId, room: s.room, guest: s.guest, issuedAt: at, issuedBy: by, status: "Active",
    ...(kind === "Card" ? { serial: `C-${s.room}-${cards + 1}` } : { code: newCode(s.room) }) };
  KEYS.push(k); log(k, "Issued", by, note, at); return k;
};
const end = (k: GuestKey, status: "Cancelled" | "Lost", by: string, reason?: string) => {
  Object.assign(k, { status, endedAt: now(), endedBy: by, reason }); log(k, status === "Lost" ? "Reported lost" : "Cancelled", by, reason);
};

// Every guest already in house has the card and passcode they were given at check-in.
for (const s of STAYS) { const at = stayDates(s).checkin; at.setHours(14); issue(s.id, "Card", "Front desk", at); issue(s.id, "Passcode", "Front desk", at); }

export const keys = () => KEYS;
export const keysFor = (stayId: string) => KEYS.filter(k => k.stayId === stayId);
export const activeKeysFor = (stayId: string) => keysFor(stayId).filter(k => keyState(k) === "Active");
export const keyLog = () => LOG;

export type KeyChoice = { cards: number; passcode: boolean; code?: string };
/** At check-in: the cards encoded and the door passcode the desk chose, all until the departure check-out time.
 *  The code the guest was shown is kept, unless another active code on that lock already has it. */
export const issueStayKeys = (stayId: string, by: string, c: KeyChoice = { cards: 1, passcode: true }) => {
  const out = Array.from({ length: Math.min(Math.max(c.cards, 0), CARDS_PER_STAY) }, () => issue(stayId, "Card", by));
  if (c.passcode) { const k = issue(stayId, "Passcode", by); const room = k.room;
    if (c.code && /^\d{6}$/.test(c.code) && !KEYS.some(x => x !== k && x.room === room && x.kind === "Passcode" && x.status === "Active" && x.code === c.code)) k.code = c.code;
    out.push(k); }
  return out;
};

export const addCard = (stayId: string, by: string): GuestKey | string => {
  if (!STAYS.some(s => s.id === stayId)) return "That guest is not in house.";
  if (activeKeysFor(stayId).filter(k => k.kind === "Card").length >= CARDS_PER_STAY) return `A stay can hold ${CARDS_PER_STAY} cards at once. Cancel one first.`;
  return issue(stayId, "Card", by);
};
/** A lost card stops working at once and a new one is encoded in its place. */
export const reportLost = (keyId: string, by: string, note?: string): GuestKey | string => {
  const k = KEYS.find(x => x.id === keyId);
  if (!k || keyState(k) !== "Active" || k.kind !== "Card") return "Only an active card can be reported lost.";
  end(k, "Lost", by, note?.trim() || undefined);
  notify("key.lost", { title: `Card for room ${k.room} reported lost`, body: `${k.serial} stopped. A new card was encoded for ${k.guest}.`, link: { screen: "key-card-log", label: "Key Log" } });
  return issue(k.stayId, "Card", by, now(), `In place of ${k.serial}`);
};
/** A new passcode for the stay; the old one stops at once (the guest shared it, or asked for a new one). */
export const replacePasscode = (stayId: string, by: string): GuestKey | string => {
  if (!STAYS.some(s => s.id === stayId)) return "That guest is not in house.";
  activeKeysFor(stayId).filter(k => k.kind === "Passcode").forEach(k => end(k, "Cancelled", by, "Replaced with a new passcode"));
  return issue(stayId, "Passcode", by);
};
export const cancelKey = (keyId: string, by: string, reason: string): string | null => {
  const k = KEYS.find(x => x.id === keyId);
  if (!k || keyState(k) !== "Active") return "That key is not active.";
  if (reason.trim().length < 3) return "Say why the key is being cancelled.";
  end(k, "Cancelled", by, reason.trim()); return null;
};
/** At check-out, in the same step: every key the stay holds stops. */
/** A room move: the old room's keys stop and the same set is issued for the new room. */
export const rekeyStay = (stayId: string, by: string, reason: string) => {
  const live = activeKeysFor(stayId);
  live.forEach(k => end(k, "Cancelled", by, reason));
  return issueStayKeys(stayId, by, { cards: Math.max(1, live.filter(k => k.kind === "Card").length), passcode: live.some(k => k.kind === "Passcode") || !live.length });
};
export const cancelStayKeys = (stayId: string, by: string) => {
  DEPARTED[stayId] = now();
  keysFor(stayId).filter(k => k.status === "Active").forEach(k => end(k, "Cancelled", by, "Checked out"));
};
/** Stop every key a guest still in house holds, at once (a dispute, a safety matter). Says why; managers and the desk are told. */
export const stopAllKeys = (stayId: string, by: string, reason: string): number | string => {
  const live = activeKeysFor(stayId);
  if (!live.length) return "This guest has no active keys.";
  if (reason.trim().length < 3) return "Say why every key is being stopped.";
  live.forEach(k => end(k, "Cancelled", by, reason.trim()));
  notify("key.revoked", { title: `Every key for room ${live[0].room} stopped`, body: `${live[0].guest}. ${reason.trim()}`, link: { screen: "key-card", label: "Guest Keys" } });
  return live.length;
};
