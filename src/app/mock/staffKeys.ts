// Staff keys: master, floor and area cards, signed out per shift and signed back in (Access & Security A3).
// Only Security and managers hand them out, only to someone at work today. A key runs to the end of the holder's
// shift (from their HR record); one not back by then is flagged to Security once. Someone HR marks as left has their
// key stopped on the lock at once, and Security is told to recover it.
import type { Role } from "../constants";
import { ROOMS } from "./property";
import { notify } from "./notify";
import { now } from "./maintenance";
import { staffRecord, atWork, isEmployed } from "./staff";

export type StaffKeyKind = "Master" | "Floor" | "Area";
export type StaffKey = { id: string; kind: StaffKeyKind; opens: string; status: "In" | "Out" | "Stopped"; holder?: string; outAt?: Date; dueBack?: Date; flagged?: boolean };
export type StaffKeyLine = { id: string; at: Date; keyId: string; event: "Signed out" | "Signed back" | "Not back" | "Stopped"; holder?: string; by: string; note?: string };

const KEYS: StaffKey[] = [
  { id: "MK-01", kind: "Master", opens: "Every room", status: "In" },
  { id: "MK-02", kind: "Master", opens: "Every room", status: "In" },
  ...[...new Set(ROOMS.map(r => r.floor))].map(f => ({ id: `FK-${f}`, kind: "Floor" as const, opens: `Floor ${f}`, status: "In" as const })),
  { id: "AK-01", kind: "Area", opens: "Plant room", status: "In" },
  { id: "AK-02", kind: "Area", opens: "Store house", status: "In" },
];
const LOG: StaffKeyLine[] = [];
let seq = 0;
const log = (k: StaffKey, event: StaffKeyLine["event"], by: string, note?: string) =>
  LOG.unshift({ id: `SK-${String(++seq).padStart(4, "0")}`, at: now(), keyId: k.id, event, holder: k.holder, by, note });

export const staffKeys = () => KEYS;
export const staffKeyLog = () => LOG;
export const canHandOut = (role: Role | string) => role === "MGT" || role === "SEC";

/** When the holder's shift ends, from the HR record ("Morning 07:00–15:00"); a night shift ends the next morning. */
export const shiftEnd = (name: string, from = now()) => {
  const m = staffRecord(name)?.shift.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  const end = new Date(from);
  if (!m) { end.setHours(23, 59, 0, 0); return end; }
  end.setHours(+m[3], +m[4], 0, 0);
  if (+m[3] * 60 + +m[4] <= +m[1] * 60 + +m[2] && end <= from) end.setDate(end.getDate() + 1);
  return end;
};

export const signOutKey = (id: string, holder: string, by: string, role: Role | string): string | null => {
  const k = KEYS.find(x => x.id === id); if (!k) return "There is no such key.";
  if (!canHandOut(role)) return "Only Security or a manager hands out staff keys.";
  if (k.status !== "In") return `${k.id} is not in the key cabinet.`;
  if (!atWork(holder)) return `${holder} is not at work today.`;
  Object.assign(k, { status: "Out", holder, outAt: now(), dueBack: shiftEnd(holder), flagged: false });
  log(k, "Signed out", by, `Back by ${k.dueBack!.toTimeString().slice(0, 5)}`); return null;
};
export const signBackKey = (id: string, by: string, role: Role | string): string | null => {
  const k = KEYS.find(x => x.id === id); if (!k) return "There is no such key.";
  if (!canHandOut(role)) return "Only Security or a manager signs a staff key back in.";
  if (k.status === "In") return `${k.id} is already in.`;
  log(k, "Signed back", by, k.status === "Stopped" ? "Recovered after it was stopped" : undefined);
  Object.assign(k, { status: "In", holder: undefined, outAt: undefined, dueBack: undefined, flagged: false }); return null;
};

/** Runs every minute: flags keys past their shift's end once, and stops keys held by someone who has left. */
export const checkStaffKeys = (t = now()) => {
  for (const k of KEYS.filter(x => x.status === "Out" && x.holder)) {
    if (!isEmployed(k.holder!)) {
      k.status = "Stopped"; log(k, "Stopped", "System", `${k.holder} has left; the card no longer opens doors`);
      notify("staffkey.stopped", { title: `${k.id} stopped: ${k.holder} has left`, body: `It opened ${k.opens.toLowerCase()}. Recover the card.`, link: { screen: "staff-keys", label: "Staff Keys" } });
    } else if (k.dueBack && t > k.dueBack && !k.flagged) {
      k.flagged = true; log(k, "Not back", "System", `Due back at ${k.dueBack.toTimeString().slice(0, 5)}`);
      notify("staffkey.overdue", { title: `${k.id} not signed back`, body: `${k.holder} has it. It opens ${k.opens.toLowerCase()}.`, link: { screen: "staff-keys", label: "Staff Keys" } });
    }
  }
};
