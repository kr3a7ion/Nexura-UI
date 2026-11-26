import { keys, keyState, validUntil, keyLog, activeKeysFor } from "./access";
import { STAYS, leavesToday } from "./frontOffice";
import { now } from "./maintenance";

export type AccessQueueItem = {
  id: string;
  holder: string;
  room: string;
  credential: string;
  departure: string;
  revokeAt: string;
  status: "Due" | "Scheduled" | "Overdue";
};

export type AccessException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "room-access" | "key-card-log" | "door-lock-settings";
  screenLabel: string;
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
/** The first two figures come from the guest keys; the lock figures come with door events (A2). */
export const accessKpis = () => {
  const t = now(), active = keys().filter(k => keyState(k, t) === "Active"), cards = active.filter(k => k.kind === "Card").length;
  const stopping = STAYS.filter(s => leavesToday(s) && activeKeysFor(s.id).length);
  const issuedToday = keyLog().filter(l => l.event === "Issued" && sameDay(l.at, t)).length;
  return [
    { label: "Active guest keys", value: String(active.length), sub: `${cards} cards, ${active.length - cards} passcodes`, delta: `${issuedToday} issued today`, deltaPositive: true },
    { label: "Keys stopping today", value: String(stopping.length), sub: `${stopping.length} departing stay${stopping.length === 1 ? "" : "s"}`, delta: "At each check-out time", deltaPositive: true },
    { label: "Locks with low battery", value: "3", sub: "Rooms 218, 412 and 507", delta: "Below 15%", deltaPositive: false },
    { label: "Locks offline", value: "1", sub: "Lagos staff entrance", delta: "1h 14m", deltaPositive: false },
  ];
};
/** Departing guests whose keys stop at their check-out time; overdue when the time has passed and they are still in. */
export const accessQueue = (): AccessQueueItem[] => {
  const t = now();
  return STAYS.filter(s => leavesToday(s) && activeKeysFor(s.id).length).map(s => {
    const ks = activeKeysFor(s.id), until = validUntil(ks[0])!, cards = ks.filter(k => k.kind === "Card").length;
    const status = until < t ? "Overdue" as const : until.getTime() - t.getTime() < 3600000 ? "Due" as const : "Scheduled" as const;
    return { id: s.id, holder: s.guest, room: s.room, credential: `${cards} card${cards === 1 ? "" : "s"}${ks.length > cards ? ", passcode" : ""}`, departure: `Today, ${s.checkoutTime}`, revokeAt: s.checkoutTime, status };
  }).sort((a, b) => a.revokeAt.localeCompare(b.revokeAt));
};



export const ACCESS_EXCEPTIONS: AccessException[] = [
  { id: "SEC-01", title: "Failed access attempts", detail: "Three denied attempts at the Abuja staff entrance by card STF-019.", severity: "Warning", screen: "key-card-log", screenLabel: "Key Card Log" },
  { id: "SEC-02", title: "Lock offline longer than 1 hour", detail: "Lagos staff entrance has been offline for 1 hour 14 minutes.", severity: "Critical", screen: "door-lock-settings", screenLabel: "Door Lock Settings" },
  { id: "SEC-03", title: "Master key used", detail: "Master key MK-02 opened Room 412 at 09:38; security review required.", severity: "Info", screen: "key-card-log", screenLabel: "Key Card Log" },
  { id: "SEC-04", title: "Lost key card", detail: "Room 507 reported a lost card; ₦5,000 replacement fee is pending.", severity: "Warning", screen: "room-access", screenLabel: "Room Access Mgmt" },
];

export const ACCESS_GATEWAY = {
  status: "Connected",
  address: "lock-gateway.local",
  latency: "18 ms",
  lastSync: "9 seconds ago",
};
