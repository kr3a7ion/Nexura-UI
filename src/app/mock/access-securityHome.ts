import { keys, keyState, validUntil, keyLog, activeKeysFor } from "./access";
import { STAYS, leavesToday } from "./frontOffice";
import { now, fmtWhen } from "./maintenance";
import { locks, openAlarms, lowBattery } from "./doors";

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
/** Guest keys (mock/access.ts) and locks (mock/doors.ts). */
export const accessKpis = () => {
  const t = now(), active = keys().filter(k => keyState(k, t) === "Active"), cards = active.filter(k => k.kind === "Card").length;
  const stopping = STAYS.filter(s => leavesToday(s) && activeKeysFor(s.id).length);
  const issuedToday = keyLog().filter(l => l.event === "Issued" && sameDay(l.at, t)).length;
  return [
    { label: "Active guest keys", value: String(active.length), sub: `${cards} cards, ${active.length - cards} passcodes`, delta: `${issuedToday} issued today`, deltaPositive: true },
    { label: "Keys stopping today", value: String(stopping.length), sub: `${stopping.length} departing stay${stopping.length === 1 ? "" : "s"}`, delta: "At each check-out time", deltaPositive: true },
    { label: "Locks with low battery", value: String(locks().filter(l => l.battery < lowBattery()).length), sub: locks().filter(l => l.battery < lowBattery()).map(l => `Room ${l.room}`).join(", ") || "None", delta: `Below ${lowBattery()}%`, deltaPositive: false },
    { label: "Door alarms open", value: String(openAlarms().length), sub: `${locks().filter(l => !l.online).length} lock${locks().filter(l => !l.online).length === 1 ? "" : "s"} offline`, delta: openAlarms().length ? "Go and clear them" : "All clear", deltaPositive: !openAlarms().length },
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



/** What needs Security now: open door alarms, offline locks, low batteries (mock/doors.ts). */
export const accessExceptions = (): AccessException[] => [
  ...openAlarms().map(e => ({ id: e.id, title: `Room ${e.room}: door ${e.kind.toLowerCase()}`, detail: `At ${fmtWhen(e.at)}. Go to the room and clear the alarm.`, severity: "Critical" as const, screen: "room-access" as const, screenLabel: "Locks & Doors" })),
  ...locks().filter(l => !l.online).map(l => ({ id: `OFF-${l.room}`, title: `Room ${l.room}'s lock is offline`, detail: "Keys still work on the lock; remote unlock waits until it is back.", severity: "Warning" as const, screen: "room-access" as const, screenLabel: "Locks & Doors" })),
  ...locks().filter(l => l.battery < lowBattery()).map(l => ({ id: `BAT-${l.room}`, title: `Room ${l.room}'s lock battery is at ${l.battery}%`, detail: "Maintenance has a fault report to change it.", severity: "Info" as const, screen: "room-access" as const, screenLabel: "Locks & Doors" })),
];

export const ACCESS_GATEWAY = {
  status: "Connected",
  address: "lock-gateway.local",
  latency: "18 ms",
  lastSync: "9 seconds ago",
};
