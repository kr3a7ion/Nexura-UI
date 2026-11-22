// Assets and planned (preventive) maintenance, as FacilityFlow runs it (services/ppm.ts, 0005_ppm.sql):
// schedules raise P4 jobs ahead of their due date, checklists turn "serviced it" into a record of what was
// checked, and the next due date counts from the due date, never the completion date.
import { now, addWorkOrder, workOrders, isOpen, type WorkOrder, type WOPriority } from "./maintenance";
import { notify } from "./notify";
import { dayKey, parseDay, addDays } from "./roster";

export type Asset = { id: string; name: string; cat: string; location: string; criticality: "Critical" | "High" | "Medium" | "Low";
  purchased: string; cost: number; warranty: string; supplier: string; status: "Operational" | "Degraded" | "Offline"; meter?: { value: number; unit: "hours" | "km" } };
const ASSETS: Asset[] = [
  { id: "AST-001", name: "Central air conditioning unit", cat: "HVAC", location: "Roof", criticality: "Critical", purchased: "Jan 2021", cost: 2850000, warranty: "Jan 2025", supplier: "Airecon Nigeria", status: "Operational" },
  { id: "AST-002", name: "Restaurant refrigerator", cat: "Kitchen", location: "Restaurant kitchen", criticality: "High", purchased: "Mar 2022", cost: 980000, warranty: "Mar 2026", supplier: "CoolTech Ltd", status: "Operational" },
  { id: "AST-003", name: "Lift 1", cat: "Infrastructure", location: "Main building", criticality: "Critical", purchased: "Sep 2019", cost: 12500000, warranty: "Sep 2025", supplier: "Otis Nigeria", status: "Operational" },
  { id: "AST-004", name: "Main generator 500 kVA", cat: "Power", location: "Generator house", criticality: "Critical", purchased: "Jun 2020", cost: 4200000, warranty: "Jun 2026", supplier: "Mikano International", status: "Operational", meter: { value: 3412, unit: "hours" } },
  { id: "AST-006", name: "Commercial washing machine", cat: "Laundry", location: "Laundry room", criticality: "High", purchased: "Aug 2021", cost: 1450000, warranty: "Aug 2025", supplier: "CleanPro", status: "Degraded" },
  { id: "AST-007", name: "Pool circulation pump", cat: "Pool", location: "Pool area", criticality: "Medium", purchased: "Nov 2022", cost: 620000, warranty: "Nov 2026", supplier: "AquaTech", status: "Operational" },
  { id: "AST-008", name: "CCTV system, 32 channels", cat: "IT", location: "Security room", criticality: "High", purchased: "Jan 2022", cost: 1800000, warranty: "Jan 2026", supplier: "SecureVision", status: "Operational" },
];
export const assets = () => ASSETS;
export const asset = (id?: string) => ASSETS.find(a => a.id === id);
export const assetJobs = (id: string) => workOrders().filter(w => w.asset === id);
export const logMeter = (id: string, value: number): string | null => {
  const a = asset(id); if (!a?.meter) return "This asset has no meter.";
  if (!(value >= a.meter.value)) return `A reading cannot go backwards: the last one was ${a.meter.value.toLocaleString()} ${a.meter.unit}.`;
  a.meter.value = value; return null;
};

export type ChecklistItem = { id: string; task: string; expected?: string; reading?: boolean; critical?: boolean };
export type Checklist = { id: string; name: string; items: ChecklistItem[] };
const CHECKLISTS: Checklist[] = [
  { id: "CL-1", name: "Generator 250-hour service", items: [
    { id: "g1", task: "Engine oil and oil filter changed", critical: true },
    { id: "g2", task: "Fuel filter and water separator", critical: true },
    { id: "g3", task: "Battery voltage", expected: "12.6 V or more", reading: true, critical: true },
    { id: "g4", task: "Coolant level and hoses" },
    { id: "g5", task: "Air filter checked, cleaned or replaced" },
    { id: "g6", task: "Test run on load", expected: "15 minutes, no alarms", critical: true },
  ] },
  { id: "CL-2", name: "Air conditioning service", items: [
    { id: "a1", task: "Filters cleaned", critical: true },
    { id: "a2", task: "Coil and drain cleaned" },
    { id: "a3", task: "Supply air temperature", expected: "12 to 16 °C", reading: true, critical: true },
    { id: "a4", task: "Refrigerant pressure", expected: "Within the maker's range", reading: true },
  ] },
  { id: "CL-3", name: "Washing machine service", items: [
    { id: "w1", task: "Drum cleaned and inspected" },
    { id: "w2", task: "Door seal and lock", critical: true },
    { id: "w3", task: "Hoses and connections, no leaks", critical: true },
  ] },
];
export const checklists = () => CHECKLISTS;
export const addChecklist = (name: string, items: Omit<ChecklistItem, "id">[]): string | null => {
  if (!name.trim()) return "Name the checklist.";
  const rows = items.filter(i => i.task.trim());
  if (!rows.length) return "A checklist needs at least one step.";
  CHECKLISTS.push({ id: `CL-${CHECKLISTS.length + 1}`, name: name.trim(), items: rows.map((r, i) => ({ ...r, task: r.task.trim(), id: `n${CHECKLISTS.length}-${i}` })) });
  return null;
};

export type Unit = "day" | "week" | "month" | "year" | "hours" | "km";
export const CALENDAR_UNITS: Unit[] = ["day", "week", "month", "year"];
export type Schedule = { id: string; name: string; assetId: string; every: number; unit: Unit; leadDays: number; checklist?: string;
  priority: WOPriority; estMins: number; nextDue?: string; nextMeter?: number; lastDone?: string };
const metered = (u: Unit) => u === "hours" || u === "km";
const SCHEDULES: Schedule[] = [
  { id: "PM-001", name: "Full service", assetId: "AST-001", every: 3, unit: "month", leadDays: 7, checklist: "CL-2", priority: "P4", estMins: 120, nextDue: "2026-06-12", lastDone: "2026-03-12" },
  { id: "PM-002", name: "250-hour service", assetId: "AST-004", every: 250, unit: "hours", leadDays: 0, checklist: "CL-1", priority: "P4", estMins: 90, nextMeter: 3400, lastDone: "2026-05-15" },
  { id: "PM-003", name: "Brake and safety inspection", assetId: "AST-003", every: 3, unit: "month", leadDays: 14, priority: "P3", estMins: 240, nextDue: "2026-09-01", lastDone: "2026-06-01" },
  { id: "PM-004", name: "Condenser coil clean", assetId: "AST-002", every: 3, unit: "month", leadDays: 7, priority: "P4", estMins: 60, nextDue: "2026-08-10", lastDone: "2026-05-10" },
  { id: "PM-005", name: "Drum and seal service", assetId: "AST-006", every: 1, unit: "month", leadDays: 3, checklist: "CL-3", priority: "P4", estMins: 45, nextDue: "2026-05-20", lastDone: "2026-04-20" },
  { id: "PM-006", name: "Backwash and balance", assetId: "AST-007", every: 1, unit: "month", leadDays: 14, priority: "P4", estMins: 60, nextDue: "2026-07-05", lastDone: "2026-06-05" },
];
export const schedules = () => SCHEDULES;
export const schedule = (id?: string) => SCHEDULES.find(s => s.id === id);
export const everyLabel = (s: Pick<Schedule, "every" | "unit">) => metered(s.unit) ? `Every ${s.every.toLocaleString()} ${s.unit}` : `Every ${s.every === 1 ? "" : `${s.every} `}${s.unit}${s.every === 1 ? "" : "s"}`;

/** One interval on from a day; months and years keep the day of the month. */
export const addInterval = (from: string, every: number, unit: Unit) => {
  if (unit === "day") return addDays(from, every);
  if (unit === "week") return addDays(from, every * 7);
  const d = parseDay(from);
  if (unit === "month") d.setMonth(d.getMonth() + every); else d.setFullYear(d.getFullYear() + every);
  return dayKey(d);
};
export const today = () => dayKey(now());
export const openJobFor = (s: Schedule) => workOrders().find(w => w.ppm === s.id && isOpen(w));
export const isDue = (s: Schedule) => metered(s.unit)
  ? (asset(s.assetId)?.meter?.value ?? 0) >= (s.nextMeter ?? Infinity)
  : !!s.nextDue && s.nextDue <= addDays(today(), s.leadDays);
export const scheduleState = (s: Schedule) => metered(s.unit)
  ? (isDue(s) ? "Due now" : "On schedule")
  : !s.nextDue ? "On schedule" : s.nextDue < today() ? "Overdue" : isDue(s) ? "Due soon" : "On schedule";

const raise = (s: Schedule): WorkOrder => {
  const a = asset(s.assetId)!;
  const dueAt = metered(s.unit) ? addDays(today(), 7) : s.nextDue!;
  return addWorkOrder({ title: `${s.name}: ${a.name}`, location: a.location, cat: a.cat, priority: s.priority, reportedBy: "Planned work",
    desc: metered(s.unit) ? `Meter-triggered service at ${a.meter!.value.toLocaleString()} ${s.unit}.` : `${everyLabel(s)}.`,
    asset: a.id, ppm: s.id, dueAt });
};
/** The sweep: every due schedule without an open job gets one. One notice per sweep, not one per job. */
export const generateDue = () => {
  const created = SCHEDULES.filter(s => isDue(s) && !openJobFor(s)).map(raise);
  if (created.length) notify("ppm.dueSoon", {
    title: created.length === 1 ? `${created[0].id}: ${created[0].title} is coming due` : `${created.length} planned jobs are coming due`,
    body: `${created.map(w => w.id).join(", ")}. Assign them from Work Orders.`, by: "System",
    link: created.length === 1 ? { screen: "work-order-detail", label: "Work Order", param: created[0].id } : { screen: "work-orders", label: "Work Orders" } });
  return created;
};
/** Raise the job now, ahead of its lead time; still one open job per schedule. */
export const raiseNow = (id: string): WorkOrder | string => {
  const s = schedule(id); if (!s) return "There is no such schedule.";
  const open = openJobFor(s); if (open) return `${open.id} is already open for this schedule.`;
  return raise(s);
};

/** Called when a planned job is verified. Next due counts from the due date, rolled past today if very late. */
export const onPlannedVerified = (w: WorkOrder) => {
  const s = schedule(w.ppm); if (!s) return;
  s.lastDone = today();
  if (metered(s.unit)) { s.nextMeter = (asset(s.assetId)?.meter?.value ?? 0) + s.every; return; }
  let next = addInterval(w.dueAt ?? s.nextDue ?? today(), s.every, s.unit);
  for (let guard = 0; next <= today() && guard < 500; guard++) next = addInterval(next, s.every, s.unit);
  s.nextDue = next;
};

export const addSchedule = (s: Omit<Schedule, "id" | "lastDone">): string | null => {
  if (!s.name.trim()) return "Name the job.";
  if (!asset(s.assetId)) return "Choose the asset it applies to.";
  if (!(s.every > 0)) return "The interval must be more than zero.";
  if (metered(s.unit) && !asset(s.assetId)?.meter) return "That asset has no meter. Use a calendar interval.";
  SCHEDULES.push({ ...s, name: s.name.trim(), id: `PM-${String(SCHEDULES.length + 1).padStart(3, "0")}`,
    ...(metered(s.unit) ? { nextMeter: s.nextMeter ?? asset(s.assetId)!.meter!.value + s.every, nextDue: undefined } : { nextDue: s.nextDue ?? addInterval(today(), s.every, s.unit) }) });
  return null;
};

// ── Checklists on a planned job ───────────────────────────────────────────────
export type CheckResult = { item: string; result: "Pass" | "Fail" | "N/A"; value?: string; note?: string; by: string };
export const sheetFor = (w: WorkOrder) => CHECKLISTS.find(c => c.id === schedule(w.ppm)?.checklist);
/** Saves the whole sheet at once. A reading step needs its value unless it is not applicable. */
export const recordChecklist = (w: WorkOrder, results: Omit<CheckResult, "by">[], by: string): { refused: string | null; failed: number } => {
  const sheet = sheetFor(w); if (!sheet) return { refused: "This job has no checklist.", failed: 0 };
  const noValue = results.find(r => r.result !== "N/A" && sheet.items.find(i => i.id === r.item)?.reading && !r.value?.trim());
  if (noValue) return { refused: `Enter the reading for "${sheet.items.find(i => i.id === noValue.item)!.task}".`, failed: 0 };
  const kept = (w.checklist ?? []).filter(x => !results.some(r => r.item === x.item));
  w.checklist = [...kept, ...results.map(r => ({ ...r, by }))];
  return { refused: null, failed: results.filter(r => r.result === "Fail").length };
};
/** Non-critical steps can be left; critical ones cannot, or "serviced" means nothing. */
export const missingCritical = (w: WorkOrder) => (sheetFor(w)?.items ?? []).filter(i => i.critical && !w.checklist?.some(r => r.item === i.id));
export const failedCritical = (w: WorkOrder) => (sheetFor(w)?.items ?? []).filter(i => i.critical && w.checklist?.some(r => r.item === i.id && r.result === "Fail"));

/** PPM compliance: done on time over everything judged. A job not yet due is not judged; nothing judged is unknown, not zero. */
export const compliance = (days = 90) => {
  const from = addDays(today(), -days);
  const jobs = workOrders().filter(w => w.ppm && dayKey(w.reportedAt) >= from);
  let onTime = 0, late = 0, open = 0, overdue = 0;
  for (const w of jobs) {
    if (isOpen(w) || !w.completedAt) { if (w.status === "Cancelled") continue; open++; if (w.dueAt && w.dueAt < today()) overdue++; continue; }
    if (w.dueAt && dayKey(w.completedAt) <= w.dueAt) onTime++; else late++;
  }
  const judged = onTime + late + overdue;
  return { raised: jobs.length, onTime, late, open, overdue, judged, pct: judged ? Math.round(onTime / judged * 1000) / 10 : null };
};
