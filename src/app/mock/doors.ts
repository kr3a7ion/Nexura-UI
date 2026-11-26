// Door locks and what happens at each door: openings, alarms, a low battery, a lock going offline, and remote unlocks.
// Alarms ring Security and managers (Urgent) and stay open until someone clears them with a note. A low battery becomes a
// Maintenance fault report once; an offline lock tells IT and Security. Security and managers open a door remotely with a
// reason; the front desk asks, and the door opens only when Security or a manager approves (approvals "Remote unlock").
// shortcut: events come from the demo button on Locks & Doors; the hotel server takes them from the lock system (TTLock).
import type { Role } from "../constants";
import { ROOMS } from "./property";
import { notify } from "./notify";
import { now, reportFault } from "./maintenance";
import { requestApproval, setApproverRoles } from "./approvals";

export type DoorEventKind = "Opened" | "Remote unlock" | "Forced" | "Held open" | "Tampered" | "Low battery" | "Offline" | "Back online";
export const ALARMS: DoorEventKind[] = ["Forced", "Held open", "Tampered"];
export type DoorEvent = { id: string; at: Date; room: string; kind: DoorEventKind; by?: string; note?: string; clearedBy?: string; clearedAt?: Date; clearNote?: string };
export type Lock = { room: string; battery: number; online: boolean; faultRaised?: boolean };
export const LOW_BATTERY = 20; // per cent

setApproverRoles("Access & Security", ["MGT", "SEC"]);
export const canUnlockDirectly = (role: Role | string) => role === "MGT" || role === "SEC";
export const canSeeDoorHistory = canUnlockDirectly;

// Every room's lock; two need attention on the demo day.
const LOCKS: Lock[] = ROOMS.map((r, i) => ({ room: r.id, battery: i === 7 ? 15 : 60 + ((i * 37) % 40), online: i !== 12 }));
const EVENTS: DoorEvent[] = [];
let seq = 0;
const log = (room: string, kind: DoorEventKind, by?: string, note?: string) => {
  const e: DoorEvent = { id: `DE-${String(++seq).padStart(4, "0")}`, at: now(), room, kind, by, note };
  EVENTS.unshift(e); return e;
};

export const locks = () => LOCKS;
export const lockOf = (room: string) => LOCKS.find(l => l.room === room);
export const doorEvents = (room?: string) => room ? EVENTS.filter(e => e.room === room) : EVENTS;
export const openAlarms = () => EVENTS.filter(e => ALARMS.includes(e.kind) && !e.clearedBy);

/** What the lock reports. `detail` is who or what opened it, or the battery level. */
export const recordDoorEvent = (room: string, kind: DoorEventKind, detail?: string) => {
  const l = lockOf(room); if (!l) return null;
  const e = log(room, kind, kind === "Opened" ? detail : undefined, kind === "Low battery" ? `${detail ?? l.battery}%` : undefined);
  if (ALARMS.includes(kind))
    notify("door.alarm", { title: `Room ${room}: door ${kind === "Forced" ? "forced" : kind === "Held open" ? "held open" : "tampered with"}`, body: "Go to the room and clear the alarm with what you found.", link: { screen: "room-access", label: "Locks & Doors" } });
  if (kind === "Low battery") {
    l.battery = Number(detail ?? l.battery);
    if (!l.faultRaised) {
      l.faultRaised = true; // one report until the battery is changed
      reportFault({ title: "Door lock battery low", location: `Room ${room}`, room, desc: `The lock reports ${l.battery}% battery. Change it before it stops opening.`, reportedBy: "Door lock", dept: "Access & Security", guestCannotUse: false, danger: false });
    }
  }
  if (kind === "Offline") { l.online = false; notify("lock.offline", { title: `Room ${room}'s lock is offline`, body: "Keys still work on the lock, but changes and remote unlock wait until it is back.", link: { screen: "room-access", label: "Locks & Doors" } }); }
  if (kind === "Back online") l.online = true;
  return e;
};
/** Someone went to the door and says what they found. */
export const clearAlarm = (id: string, by: string, role: Role | string, note: string): string | null => {
  const e = EVENTS.find(x => x.id === id);
  if (!e || !ALARMS.includes(e.kind) || e.clearedBy) return "That alarm is already cleared.";
  if (!canUnlockDirectly(role)) return "Only Security or a manager clears an alarm.";
  if (note.trim().length < 3) return "Say what you found at the door.";
  Object.assign(e, { clearedBy: by, clearedAt: now(), clearNote: note.trim() }); return null;
};
export const batteryChanged = (room: string) => { const l = lockOf(room); if (l) Object.assign(l, { battery: 100, faultRaised: false }); };

/** Security and managers open a door now, with a reason. */
export const remoteUnlock = (room: string, by: string, role: Role | string, reason: string): string | null => {
  const l = lockOf(room); if (!l) return "There is no such room.";
  if (!canUnlockDirectly(role)) return "Ask Security or a manager to open it.";
  if (reason.trim().length < 3) return "Say why the door is opened.";
  if (!l.online) return `Room ${room}'s lock is offline, so it cannot be opened remotely.`;
  log(room, "Remote unlock", by, reason.trim()); return null;
};
/** The front desk asks; the door opens only when Security or a manager approves. Nobody approves their own. */
export const askRemoteUnlock = (room: string, by: string, reason: string): string | null => {
  if (!lockOf(room)) return "There is no such room.";
  if (reason.trim().length < 3) return "Say why the door should be opened.";
  requestApproval({ kind: "Remote unlock", dept: "Access & Security", ref: room, title: `Room ${room}`, detail: "Open the door remotely", reason: reason.trim(), requestedBy: by,
    apply: approvedBy => { const l = lockOf(room); if (!l?.online) return false; log(room, "Remote unlock", approvedBy, `${reason.trim()}. Asked by ${by}`); return true; } });
  return null;
};
