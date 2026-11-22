// Leave, owned by HR (Leave Management). An approved leave marks the Maintenance roster absent for its days;
// a department can ask for time off for its people, and HR decides. Nobody decides a request they raised.
import { notify } from "./notify";
import { applyLeave, clearLeave, parseDay, dayKey, addDays } from "./roster";
import { staffRecord } from "./staff";
import { BUSINESS_DATE } from "../constants";

export const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Maternity", "Paternity", "Compassionate", "Study", "Unpaid"] as const;
export type LeaveType = typeof LEAVE_TYPES[number];
/** Days a year. shortcut: one entitlement for everyone; per-grade entitlements come with HR's walk-through (Phase 3). */
export const ENTITLEMENT: Record<LeaveType, number> = { Annual: 21, Sick: 10, Casual: 5, Maternity: 90, Paternity: 5, Compassionate: 5, Study: 5, Unpaid: 30 };
export type LeaveStatus = "Requested" | "Approved" | "Declined" | "Cancelled";
export type Leave = { id: string; staff: string; type: LeaveType; from: string; to: string; reason: string; status: LeaveStatus;
  requestedBy: string; source: string; decidedBy?: string; decision?: string };

// shortcut: calendar days, weekends included; working-day counting comes with HR's walk-through (Phase 3).
export const days = (l: Pick<Leave, "from" | "to">) => Math.round((parseDay(l.to).getTime() - parseDay(l.from).getTime()) / 86400000) + 1;
export const reasonFor = (t: LeaveType) => t === "Sick" ? "Sick leave" : `${t} leave`;

const T = dayKey(BUSINESS_DATE);
const LIST: Leave[] = [
  { id: "LV-0001", staff: "Ngozi Okonkwo", type: "Annual", from: addDays(T, -2), to: addDays(T, 5), reason: "Family travel", status: "Approved", requestedBy: "Ngozi Okonkwo", source: "Housekeeping", decidedBy: "Adaeze Okonkwo" },
  { id: "LV-0002", staff: "Chidi Ike", type: "Annual", from: addDays(T, 9), to: addDays(T, 13), reason: "Brother's wedding in Enugu", status: "Approved", requestedBy: "Chidi Ike", source: "Maintenance", decidedBy: "Adaeze Okonkwo" },
  { id: "LV-0003", staff: "John Abubakar", type: "Annual", from: addDays(T, 11), to: addDays(T, 17), reason: "Family vacation", status: "Requested", requestedBy: "John Abubakar", source: "Front Office" },
];
LIST.filter(l => l.status === "Approved").forEach(l => applyLeave(l.staff, l.from, l.to, reasonFor(l.type), l.decidedBy!));
let next = LIST.length + 1;
export const leaves = () => LIST;
export const leave = (id: string) => LIST.find(l => l.id === id);
export const usedDays = (staff: string, type: LeaveType) => LIST.filter(l => l.staff === staff && l.type === type && l.status === "Approved" && l.from.slice(0, 4) === T.slice(0, 4)).reduce((n, l) => n + days(l), 0);
const overlaps = (a: Pick<Leave, "from" | "to">, b: Pick<Leave, "from" | "to">) => a.from <= b.to && b.from <= a.to;

/** A request from a department (or the person). HR decides it. */
export const requestLeave = (r: { staff: string; type: LeaveType; from: string; to: string; reason: string }, by: string, source: string, tellHR = true): Leave | string => {
  if (!staffRecord(r.staff)) return "Choose who the time off is for.";
  if (!r.from || !r.to || r.to < r.from) return "The last day cannot be before the first.";
  if (!r.reason.trim()) return "Say why.";
  if (LIST.some(l => l.staff === r.staff && ["Requested", "Approved"].includes(l.status) && overlaps(l, r))) return `${r.staff} already has leave asked for or approved on some of those days.`;
  const l: Leave = { ...r, reason: r.reason.trim(), id: `LV-${String(next++).padStart(4, "0")}`, status: "Requested", requestedBy: by, source };
  LIST.unshift(l);
  if (tellHR) notify("leave.requested", { title: `Time off to decide: ${l.staff}`, body: `${l.type}, ${days(l)} day${days(l) === 1 ? "" : "s"} from ${fmt(l.from)}. Asked by ${by} (${source}).`, link: { screen: "leave-management", label: "Leave Management" } });
  return l;
};

/** Approve or decline. A decline needs a reason, which goes back to whoever asked and the person. */
export const decideLeave = (id: string, approve: boolean, by: string, note = ""): string | null => {
  const l = leave(id); if (!l) return "That request does not exist.";
  if (l.status !== "Requested") return `That request is already ${l.status.toLowerCase()}.`;
  if (l.requestedBy === by || l.staff === by) return "You asked for this time off, so someone else has to decide it.";
  if (!approve && !note.trim()) return "Say why it is declined.";
  if (approve && usedDays(l.staff, l.type) + days(l) > ENTITLEMENT[l.type]) return `${l.staff} has ${ENTITLEMENT[l.type] - usedDays(l.staff, l.type)} ${l.type.toLowerCase()} days left this year.`;
  Object.assign(l, { status: approve ? "Approved" : "Declined", decidedBy: by, decision: note.trim() || undefined });
  if (approve) applyLeave(l.staff, l.from, l.to, reasonFor(l.type), by);
  notify("leave.decided", { title: `Time off ${approve ? "approved" : "declined"}: ${l.staff}`, body: approve ? `${fmt(l.from)} to ${fmt(l.to)}. ${l.staff} cannot be given work on those days.` : `Reason: ${note.trim()}`,
    people: [...new Set([l.requestedBy, l.staff])], link: { screen: "leave-management", label: "Leave Management" } });
  return null;
};

/** HR recording leave directly (sick note, a call in): approved at once, on the roster at once. */
export const recordLeave = (r: { staff: string; type: LeaveType; from: string; to: string; reason: string }, by: string): Leave | string => {
  const l = requestLeave(r, by, "HR", false);
  if (typeof l === "string") return l;
  Object.assign(l, { status: "Approved", decidedBy: by });
  applyLeave(l.staff, l.from, l.to, reasonFor(l.type), by);
  return l;
};

export const cancelLeave = (id: string, by: string): string | null => {
  const l = leave(id); if (!l) return "That request does not exist.";
  if (l.status === "Declined" || l.status === "Cancelled") return `That request is already ${l.status.toLowerCase()}.`;
  if (l.status === "Approved") clearLeave(l.staff, l.from, l.to);
  Object.assign(l, { status: "Cancelled", decidedBy: by });
  return null;
};

export const fmt = (k: string) => parseDay(k).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
