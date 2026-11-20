// The bell. Every department calls notify() when something happens that someone else must know;
// the table below decides who hears it and how loudly, so changing who is told never touches a screen.
// shortcut: notices live in this browser tab until reload; the hotel server stores them and pushes them to every device.
import type { Role } from "../constants";

// Urgent: banner across the top until someone says they are on it, plus a sound.
// High: a pop-up as it arrives. Normal: counted on the bell. Low: listed only, not counted.
export type Level = "Urgent" | "High" | "Normal" | "Low";
export const LEVEL_ORDER: Level[] = ["Urgent", "High", "Normal", "Low"];

export type Notice = {
  id: number; event: string; level: Level; title: string; body: string;
  roles: Role[]; people: string[]; by: string; at: number;
  link?: { screen: string; label: string; param?: string };
  readBy: string[];
};

// Who is told about each event, and how loudly. Properties & Settings will edit this table.
export const ROUTES = {
  "booking.made":          { level: "Normal", roles: ["RSV", "FD"] },
  "guest.checkedIn":       { level: "Low",    roles: ["HK"] },
  "guest.checkedOut":      { level: "Normal", roles: ["HK"] },
  "arrival.rushRoom":      { level: "High",   roles: ["HK"] },
  "arrival.noShow":        { level: "Low",    roles: ["RSV"] },
  "approval.requested":    { level: "High",   roles: [] },
  "approval.decided":      { level: "Normal", roles: [] },
  "inspection.passed":     { level: "Normal", roles: ["FD"] },
  "inspection.failed":     { level: "Normal", roles: [] },
  "workOrder.raised":      { level: "Normal", roles: ["MX"] },
  "room.outOfOrder":       { level: "High",   roles: ["FD", "HK"] },
  "workOrder.assigned":    { level: "Normal", roles: [] },
  "workOrder.reopened":    { level: "High",   roles: [] },
  "workOrder.closed":      { level: "Normal", roles: [] },
  "room.backFromMaintenance": { level: "Normal", roles: ["HK"] },
  "dnd.overridden":        { level: "High",   roles: ["FD", "MGT"] },
  "foundItem.logged":      { level: "Low",    roles: ["FD"] },
} satisfies Record<string, { level: Level; roles: Role[] }>;
export type NoticeEvent = keyof typeof ROUTES;

// Who is signed in on this device, so nobody is told about what they did themselves.
// shortcut: one user per tab; the server takes this from the session.
let me = { name: "", role: "MGT" as Role };
export const setCurrentUser = (name: string, role: Role) => { me = { name, role }; };

let LIST: Notice[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
let version = 0;
const changed = () => { version++; listeners.forEach(l => l()); };
export const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getVersion = () => version;

export const notify = (event: NoticeEvent, n: { title: string; body?: string; people?: string[]; roles?: Role[]; level?: Level; link?: Notice["link"]; by?: string }) => {
  const route = ROUTES[event];
  const notice: Notice = { id: nextId++, event, level: n.level ?? route.level, title: n.title, body: n.body ?? "",
    roles: [...route.roles, ...(n.roles ?? [])], people: n.people ?? [], by: n.by ?? me.name, at: Date.now(), link: n.link, readBy: [] };
  LIST = [notice, ...LIST];
  changed();
  return notice;
};

// A manager sees everything; everyone else what is sent to their role or to them by name. Never your own action.
export const isFor = (x: Notice, name: string, role: Role) =>
  x.by !== name && (role === "MGT" || x.roles.includes(role) || x.people.includes(name));
export const noticesFor = (name: string, role: Role) =>
  LIST.filter(x => isFor(x, name, role)).sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) || b.at - a.at);
export const isRead = (x: Notice, name: string) => x.readBy.includes(name);
// Low notices are listed but never counted, so the number on the bell always means "look now".
export const unreadCount = (name: string, role: Role) => noticesFor(name, role).filter(x => x.level !== "Low" && !isRead(x, name)).length;
export const markRead = (id: number, name: string) => { const x = LIST.find(n => n.id === id); if (x && !x.readBy.includes(name)) { x.readBy.push(name); changed(); } };
export const markAllRead = (name: string, role: Role) => { noticesFor(name, role).forEach(x => { if (!x.readBy.includes(name)) x.readBy.push(name); }); changed(); };

// Today's notices before anyone signs in, so the bell is not empty on a demo.
const ago = (min: number) => Date.now() - min * 60000;
LIST = [
  { id: nextId++, event: "announcement", level: "High", title: "Fire drill in Zone B at 10:30", body: "Scheduled drill 10:30 to 10:45. Tell guests on floors 2 and 3.", roles: ["FD", "HK", "MX", "RT"], people: [], by: "Security", at: ago(2), readBy: [] },
  { id: nextId++, event: "booking.made", level: "Normal", title: "VIP arriving: Chief Emeka Okafor", body: "Suite 502, arriving 14:00. Champagne and fruit basket requested.", roles: ["FD", "RSV", "HK"], people: [], by: "Amina Yusuf", at: ago(8), link: { screen: "arrivals", label: "Arrivals List" }, readBy: [] },
  { id: nextId++, event: "workOrder.raised", level: "High", title: "WO-0091 is late", body: "Air conditioner not cooling, room 316. Assigned to Emeka Obi.", roles: ["MX"], people: [], by: "System", at: ago(32), link: { screen: "work-order-detail", label: "Work Order", param: "WO-0091" }, readBy: [] },
  { id: nextId++, event: "report.ready", level: "Low", title: "End-of-day summary ready", body: "Yesterday's revenue report is in Reports.", roles: ["FIN"], people: [], by: "System", at: ago(60), readBy: [] },
];
