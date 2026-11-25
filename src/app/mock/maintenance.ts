// Maintenance work orders: one list read by Work Orders, the detail screen, the department home,
// Suite Home and the manager dashboard. Housekeeping's "Report a fault" adds to it.
// shortcut: held in memory until the hotel server exists; changes last until the page reloads.
import { BUSINESS_DATE } from "../constants";
import { notify, type Level } from "./notify";
import { pendingFor } from "./handover";
import { onPlannedVerified, missingCritical, type CheckResult } from "./ppm";
import { presentToday, isPresentToday, team, teamMembers, staff, holdersOf, type StaffRole } from "./roster";

// The lifecycle and priorities follow FacilityFlow (docs/OPERATING.md, services/workOrders.ts).
export type WOStatus = "Raised" | "Assigned" | "Accepted" | "In progress" | "On hold" | "Completed" | "Verified" | "Closed" | "Cancelled";
export type WOPriority = "P1" | "P2" | "P3" | "P4";
export type WOEvent = { at: Date; event: string; by: string; note: string };
export type WorkOrder = {
  id: string; title: string; location: string; room?: string; cat: string; priority: WOPriority; status: WOStatus;
  tech: string | null; reportedBy: string; reportedAt: Date; guestImpact: boolean;
  // Both deadlines are set once when the job is raised and never rewritten; time on hold is added back when reading them.
  respondBy: Date; resolveBy: Date; rule?: string; acceptedAt?: Date; heldMs: number; heldSince?: Date; holdReason?: string;
  completedBy?: string; verifiedBy?: string;
  outOfOrder: boolean; asset?: string; desc: string; timeline: WOEvent[];
  parts: { item: string; qty: number; unit: number; ref: string }[]; labourHours: number; resolution?: string;
  escalated?: Escalation[];
  ppm?: string; dueAt?: string; completedAt?: Date; checklist?: CheckResult[]; // planned work: schedule, due day, sheet
  team?: string; // handed to a team: whoever on it accepts becomes the name on the job
};

export const VENDOR = "External vendor";
// Work goes only to people marked present on today's roster (mock/roster.ts), to a team, or to an outside vendor.
export const assignable = () => [...presentToday(), VENDOR];
export const assignee = (w: WorkOrder) => w.tech ?? (w.team ? `${w.team} team` : null);
export const WO_CATEGORIES = ["Electrical", "HVAC", "Plumbing", "Furniture", "Equipment", "Mechanical", "General"];
// ── Maintenance setup: targets, trades, hold reasons. A change shapes future jobs only; deadlines are stored on each job.
const MINUTES = (n: number) => Number.isInteger(n) && n > 0;
export const setTarget = (p: WOPriority, respondMin: number, resolveMin: number): string | null => {
  if (!MINUTES(respondMin) || !MINUTES(resolveMin)) return "Times must be whole minutes, more than zero.";
  if (respondMin > resolveMin) return `${p}: respond time cannot be longer than resolve time.`;
  Object.assign(PRIORITIES[p], { respondMin, resolveMin }); return null;
};
const addTo = (list: string[], what: string, v: string): string | null => {
  const t = v.trim(); if (!t) return `Enter the ${what}.`;
  if (list.some(x => x.toLowerCase() === t.toLowerCase())) return `That ${what} is already on the list.`;
  list.push(t); return null;
};
export const addTrade = (v: string) => addTo(WO_CATEGORIES, "trade", v);
export const addHoldReason = (v: string) => addTo(HOLD_REASONS, "hold reason", v);
/** A job already on hold keeps its reason; the reason only leaves the list for new holds. */
export const removeHoldReason = (v: string): string | null => {
  if (!HOLD_REASONS.includes(v)) return "That hold reason is not on the list.";
  if (HOLD_REASONS.length === 1) return "Keep at least one hold reason.";
  HOLD_REASONS.splice(HOLD_REASONS.indexOf(v), 1); return null;
};
// Respond = someone accepted it; resolve = it was completed. Minutes from when the job is raised.
export const PRIORITIES: Record<WOPriority, { name: string; respondMin: number; resolveMin: number; level: Level }> = {
  P1: { name: "Emergency", respondMin: 15, resolveMin: 4 * 60, level: "Urgent" },
  P2: { name: "Urgent", respondMin: 60, resolveMin: 24 * 60, level: "High" },
  P3: { name: "Routine", respondMin: 4 * 60, resolveMin: 3 * 24 * 60, level: "Normal" },
  P4: { name: "Scheduled", respondMin: 24 * 60, resolveMin: 7 * 24 * 60, level: "Low" },
};
export const priorityLabel = (p: WOPriority) => `${p} · ${PRIORITIES[p].name}`;
export const HOLD_REASONS = ["Waiting for parts", "Waiting for access", "Waiting for a vendor", "Waiting for approval"];
// The demo clock starts mid-morning on the business date and runs in real time, so holds and deadlines move.
// shortcut: a browser clock; the hotel server's clock replaces it.
export const NOW = new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate(), 10, 15);
const LOADED = Date.now();
export const now = () => new Date(NOW.getTime() + Date.now() - LOADED);

const at = (dayOffset: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + dayOffset, h, m);
const plusMin = (d: Date, m: number) => new Date(d.getTime() + m * 60000);
const wo = (w: Omit<WorkOrder, "respondBy" | "resolveBy" | "heldMs" | "timeline" | "parts" | "labourHours"> & Partial<Pick<WorkOrder, "timeline" | "parts" | "labourHours" | "heldMs">>): WorkOrder => ({
  timeline: [{ at: w.reportedAt, event: "Raised", by: w.reportedBy, note: w.desc }], parts: [], labourHours: 0, heldMs: 0,
  ...w, respondBy: plusMin(w.reportedAt, PRIORITIES[w.priority].respondMin), resolveBy: plusMin(w.reportedAt, PRIORITIES[w.priority].resolveMin),
});

const LIST: WorkOrder[] = [
  wo({ id: "WO-0094", title: "Shower valve leaking, room closed", location: "Room 112", room: "112", cat: "Plumbing", priority: "P2", status: "In progress",
    tech: "Emeka Obi", acceptedAt: at(0, 7, 40), reportedBy: "Fatima Musa", reportedAt: at(0, 7, 10), guestImpact: false, outOfOrder: true,
    desc: "Water leaking behind the shower panel onto the bathroom floor. Room taken out of order until fixed.",
    timeline: [
      { at: at(0, 7, 10), event: "Reported", by: "Fatima Musa", note: "Water leaking behind the shower panel onto the bathroom floor." },
      { at: at(0, 7, 25), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Emeka Obi." },
      { at: at(0, 7, 40), event: "Accepted", by: "Emeka Obi", note: "" },
      { at: at(0, 8, 5), event: "Work started", by: "Emeka Obi", note: "Cartridge worn. Replacing it and resealing the panel." },
    ],
    parts: [{ item: "Shower cartridge", qty: 1, unit: 12500, ref: "STK-0052" }, { item: "Silicone sealant", qty: 1, unit: 3500, ref: "STK-0018" }], labourHours: 1.5 }),
  wo({ id: "WO-0093", title: "Ceiling stain under room 315", location: "Room 215", room: "215", cat: "Plumbing", priority: "P3", status: "Assigned",
    tech: "Chidi Ike", reportedBy: "Amaka Osei", reportedAt: at(-1, 15, 40), guestImpact: false, outOfOrder: true,
    desc: "Damp patch spreading on the ceiling near the window. Room out of order until the source is found." }),
  wo({ id: "WO-0092", title: "Room rewiring after power surge", location: "Room 309", room: "309", cat: "Electrical", priority: "P1", status: "Raised",
    tech: null, reportedBy: "Adaeze Okonkwo", reportedAt: at(0, 6, 50), guestImpact: false, outOfOrder: true,
    desc: "Sockets and bedside lights dead after last night's surge. Burning smell at the distribution board. Do not let the room." }),
  wo({ id: "WO-0091", title: "Air conditioner not cooling", location: "Room 316", room: "316", cat: "HVAC", priority: "P2", status: "On hold",
    tech: "Emeka Obi", acceptedAt: at(-1, 15, 30), holdReason: "Waiting for parts", heldSince: at(-1, 16, 10), reportedBy: "John Abubakar", reportedAt: at(-1, 15, 0), guestImpact: true, outOfOrder: false, asset: "AST-001",
    desc: "Guest reports 29°C against a 23°C set point. Unit runs but blows warm air.",
    timeline: [
      { at: at(-1, 15, 0), event: "Reported", by: "John Abubakar", note: "Guest reports 29°C against a 23°C set point." },
      { at: at(-1, 15, 20), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Emeka Obi." },
      { at: at(-1, 15, 30), event: "Accepted", by: "Emeka Obi", note: "" },
      { at: at(-1, 16, 5), event: "Work started", by: "Emeka Obi", note: "Low refrigerant." },
      { at: at(-1, 16, 10), event: "On hold: waiting for parts", by: "Emeka Obi", note: "R-410A ordered from stores." },
    ],
    parts: [{ item: "R-410A refrigerant (1 kg)", qty: 1, unit: 8500, ref: "STK-0044" }, { item: "Condenser filter", qty: 1, unit: 2200, ref: "STK-0041" }], labourHours: 1 }),
  wo({ id: "WO-0090", title: "Lobby light flickering", location: "Lobby", cat: "Electrical", priority: "P3", status: "Raised",
    tech: null, reportedBy: "Fatima Al-Hassan", reportedAt: at(0, 6, 30), guestImpact: true, outOfOrder: false,
    desc: "Two downlights by the reception desk flicker every few seconds." }),
  wo({ id: "WO-0089", title: "Kitchen fridge noisy", location: "Restaurant kitchen", cat: "Equipment", priority: "P4", status: "Assigned",
    tech: "Chidi Ike", reportedBy: "Kitchen staff", reportedAt: at(-1, 9, 0), guestImpact: false, outOfOrder: false, asset: "AST-002",
    desc: "Compressor rattles loudly when it starts. Still holding temperature." }),
  wo({ id: "WO-0088", title: "250-hour service: Main generator 500 kVA", location: "Generator house", cat: "Power", priority: "P4", status: "Assigned",
    tech: "Emeka Obi", reportedBy: "Planned work", reportedAt: at(0, 7, 0), guestImpact: false, outOfOrder: false, asset: "AST-004", ppm: "PM-002", dueAt: "2026-07-01",
    desc: "250-hour service: oil, oil filter, battery and coolant check." }),
  wo({ id: "WO-0087", title: "Wardrobe door hinge broken", location: "Room 102", room: "102", cat: "Furniture", priority: "P4", status: "Completed",
    tech: "Chidi Ike", acceptedAt: at(-2, 11, 10), completedBy: "Chidi Ike", reportedBy: "Grace Achebe", reportedAt: at(-2, 10, 0), guestImpact: false, outOfOrder: false,
    desc: "Top hinge pulled out of the wardrobe door.",
    timeline: [
      { at: at(-2, 10, 0), event: "Reported", by: "Grace Achebe", note: "Top hinge pulled out of the wardrobe door." },
      { at: at(-2, 11, 0), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Chidi Ike." },
      { at: at(0, 9, 30), event: "Completed", by: "Chidi Ike", note: "New hinge fitted, screw holes plugged and redrilled." },
    ], parts: [{ item: "Cabinet hinge", qty: 2, unit: 1800, ref: "STK-0063" }], labourHours: 0.5, resolution: "New hinge fitted, screw holes plugged and redrilled." }),
  wo({ id: "WO-0086", title: "Pool pump making noise", location: "Pool area", cat: "Equipment", priority: "P3", status: "Closed",
    tech: "Chidi Ike", acceptedAt: at(-3, 10, 40), completedBy: "Chidi Ike", verifiedBy: "Bola Adewale", reportedBy: "Bola Adewale", reportedAt: at(-3, 10, 15), guestImpact: false, outOfOrder: false, asset: "AST-007",
    desc: "Grinding noise from the pump housing.", labourHours: 2, resolution: "Bearing replaced; pump checked running quietly." }),

  // Planned work already done this quarter, so compliance has history to judge.
  wo({ id: "WO-0085", title: "Backwash and balance: Pool circulation pump", location: "Pool area", cat: "Pool", priority: "P4", status: "Closed",
    tech: "Chidi Ike", acceptedAt: at(-21, 9, 0), completedBy: "Chidi Ike", completedAt: at(-19, 11, 0), verifiedBy: "Bola Adewale", reportedBy: "Planned work", reportedAt: at(-22, 6, 0),
    guestImpact: false, outOfOrder: false, asset: "AST-007", ppm: "PM-006", dueAt: "2026-06-05", desc: "Every month.", resolution: "Backwashed, basket cleaned, chlorine and pH balanced." }),
  wo({ id: "WO-0084", title: "Brake and safety inspection: Lift 1", location: "Main building", cat: "Infrastructure", priority: "P3", status: "Closed",
    tech: "External vendor", acceptedAt: at(-24, 10, 0), completedBy: "External vendor", completedAt: at(-23, 15, 0), verifiedBy: "Yusuf Garba", reportedBy: "Planned work", reportedAt: at(-30, 6, 0),
    guestImpact: false, outOfOrder: false, asset: "AST-003", ppm: "PM-003", dueAt: "2026-06-01", desc: "Every 3 months.", resolution: "Otis engineer: brakes, ropes and safety gear inspected, certificate issued." }),
];

export const workOrders = () => LIST;
export const workOrder = (id: string) => LIST.find(w => w.id === id);
// Open = still being worked on; a completed job waits for someone else to verify it.
export const isOpen = (w: WorkOrder) => !["Completed", "Verified", "Closed", "Cancelled"].includes(w.status);
export const isUrgent = (w: WorkOrder) => w.priority === "P1" || w.priority === "P2";
const heldFor = (w: WorkOrder) => w.heldMs + (w.heldSince ? now().getTime() - w.heldSince.getTime() : 0);
export const respondDue = (w: WorkOrder) => new Date(w.respondBy.getTime() + heldFor(w));
export const resolveDue = (w: WorkOrder) => new Date(w.resolveBy.getTime() + heldFor(w));
// Late = nobody accepted it in time, or it is not done in time. The clock stops on hold.
export const isLateToRespond = (w: WorkOrder) => isOpen(w) && w.status !== "On hold" && !w.acceptedAt && respondDue(w) < now();
export const isOverdue = (w: WorkOrder) => isOpen(w) && w.status !== "On hold" && (isLateToRespond(w) || resolveDue(w) < now());
export const ageOf = (w: WorkOrder) => {
  const h = Math.max(0, Math.round((now().getTime() - w.reportedAt.getTime()) / 3600000));
  return h < 1 ? "Under 1h" : h < 24 ? `${h}h` : `${Math.floor(h / 24)}d ${h % 24}h`;
};
export const fmtWhen = (d: Date) => `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

// A room is out of order while any order on it says so and is not closed or cancelled;
// ── Deadline rules, as FacilityFlow keeps them (slaRules.ts). A rule names a priority and narrows it to a trade, a
// place, or both; it may change the respond time, the resolve time and who a breach goes to. Blanks come from the
// priority. Read once when a job is raised: deadlines are stored on the job, so editing or removing a rule never moves them.
export const GUEST_ROOMS = "Guest rooms"; // any job on a room; a rule on the exact place beats it
export type SlaRule = { id: string; priority: WOPriority; trade?: string; place?: string; respondMin?: number; resolveMin?: number;
  escalateTo?: StaffRole; note?: string; removed?: boolean; by: string; at: Date };
const SLA_RULES: SlaRule[] = [
  { id: "SR-1", priority: "P3", place: "Generator house", respondMin: 60, resolveMin: 8 * 60, escalateTo: "Supervisor", note: "A slow fix here leaves the building with no standby power.", by: "Adaeze Okonkwo", at: at(-30, 9) },
  { id: "SR-2", priority: "P2", trade: "Plumbing", place: GUEST_ROOMS, resolveMin: 6 * 60, note: "A guest room with no water cannot be sold.", by: "Adaeze Okonkwo", at: at(-30, 9) },
];
let ruleSeq = SLA_RULES.length;
export const slaRules = () => SLA_RULES.filter(r => !r.removed);
export const slaRule = (id?: string) => SLA_RULES.find(r => r.id === id); // removed rules still answer for the jobs that took them
export const describeRule = (r: SlaRule) => [r.priority, r.trade, r.place].filter(Boolean).join(", ");

export type RuleInput = Pick<SlaRule, "priority" | "trade" | "place" | "respondMin" | "resolveMin" | "escalateTo" | "note">;
export const saveRule = (input: RuleInput, by: string, id?: string): string | null => {
  const trade = input.trade?.trim() || undefined, place = input.place?.trim() || undefined, note = input.note?.trim() || undefined;
  if (!trade && !place) return "Pick a trade, a place, or both. A rule for every job of a priority is that priority's target: change it above.";
  if (input.respondMin == null && input.resolveMin == null && !input.escalateTo) return "The rule has to change something: the respond time, the resolve time, or who a breach goes to.";
  if (input.escalateTo && !holdersOf(input.escalateTo).length) return `Nobody in Maintenance is a ${input.escalateTo.toLowerCase()} right now. Give someone that role first, or leave it as usual.`;
  if (trade && !WO_CATEGORIES.includes(trade)) return `"${trade}" is not one of Maintenance's trades.`;
  if ([input.respondMin, input.resolveMin].some(m => m != null && !MINUTES(m))) return "Times must be whole minutes, more than zero.";
  // Judged against what the job would actually get, so a rule that only shortens resolve cannot fall below the default respond.
  const respond = input.respondMin ?? PRIORITIES[input.priority].respondMin, resolve = input.resolveMin ?? PRIORITIES[input.priority].resolveMin;
  if (resolve < respond) return `That gives these jobs ${resolve} minutes to fix but ${respond} to respond. Resolve has to be at least as long as respond.`;
  if (slaRules().some(r => r.id !== id && r.priority === input.priority && r.trade === trade && r.place === place)) return "There is already a rule for that priority, trade and place. Edit that one instead.";
  const fields = { priority: input.priority, trade, place, respondMin: input.respondMin, resolveMin: input.resolveMin, escalateTo: input.escalateTo, note, by, at: now() };
  if (!id) { SLA_RULES.push({ id: `SR-${++ruleSeq}`, ...fields }); return null; }
  const r = slaRules().find(x => x.id === id); if (!r) return "That rule has been removed.";
  Object.assign(r, fields); return null;
};
/** Removed, not deleted: the jobs that took it keep their deadlines and its escalation. Returns how many open jobs did. */
export const removeRule = (id: string) => { const r = slaRules().find(x => x.id === id); if (r) r.removed = true; return LIST.filter(w => w.rule === id && isOpen(w)).length; };

/** The most specific rule for a job: trade and place, then place, then trade; an exact place beats "Guest rooms". */
export const ruleFor = (priority: WOPriority, trade: string, location: string, room?: string) => {
  const places = [location, ...(room ? [GUEST_ROOMS] : [])]; // nearest first
  let best: SlaRule | undefined, bestScore = -1;
  for (const r of slaRules()) {
    if (r.priority !== priority || (r.trade && r.trade !== trade)) continue;
    const depth = r.place ? places.indexOf(r.place) : -1;
    if (r.place && depth < 0) continue;
    const score = (r.trade && r.place ? 2000 : r.place ? 1000 : 0) + (depth >= 0 ? 100 - depth : 0);
    if (score > bestScore) { best = r; bestScore = score; }
  }
  return best;
};

// a completed or verified job keeps the room out until it is closed.
export const isOutOfOrder = (room: string) => LIST.some(w => w.room === room && w.outOfOrder && w.status !== "Closed" && w.status !== "Cancelled");

let next = 95;
export const addWorkOrder = (w: Pick<WorkOrder, "title" | "location" | "cat" | "priority" | "reportedBy" | "desc"> & { room?: string; outOfOrder?: boolean; guestImpact?: boolean; asset?: string; ppm?: string; dueAt?: string }) => {
  const created = wo({ id: `WO-${String(next++).padStart(4, "0")}`, status: "Raised", tech: null, reportedAt: now(),
    guestImpact: false, outOfOrder: false, ...w });
  const rule = ruleFor(created.priority, created.cat, created.location, created.room);
  if (rule) Object.assign(created, { rule: rule.id,
    respondBy: plusMin(created.reportedAt, rule.respondMin ?? PRIORITIES[created.priority].respondMin),
    resolveBy: plusMin(created.reportedAt, rule.resolveMin ?? PRIORITIES[created.priority].resolveMin) });
  LIST.unshift(created);
  const link = { screen: "work-order-detail", label: "Work Order", param: created.id };
  // A job's priority sets how loudly Maintenance is told: P1 interrupts, P4 waits on the bell.
  // Planned jobs are announced once per sweep by generateDue(), not one chime each.
  if (!created.ppm) notify("workOrder.raised", { title: `New ${created.priority} job ${created.id}: ${created.title}`, body: `${created.location}, reported by ${created.reportedBy}`, level: PRIORITIES[created.priority].level, link });
  if (created.room && created.outOfOrder) notify("room.outOfOrder", { title: `Room ${created.room} is out of order`, body: `${created.title}. Do not sell or give it out.`, link });
  return created;
};
// Fault reports: Housekeeping and Front Office say what is wrong; Maintenance decides whether it is a job and how urgent.
// The reporter never sets the priority, and a report becomes a job only once (FacilityFlow F1, F2).
export type FaultReport = {
  id: string; title: string; location: string; room?: string; desc: string; reportedBy: string; dept: string; at: Date;
  guestCannotUse: boolean; danger: boolean; status: "New" | "Made into a job" | "Turned down"; jobId?: string; reason?: string; decidedBy?: string;
};
const REPORTS: FaultReport[] = [
  { id: "RQ-0012", title: "Bathroom light flickering", location: "Room 207", room: "207", desc: "Ceiling light above the mirror flickers and buzzes.", reportedBy: "Amaka Osei", dept: "Housekeeping", at: at(0, 9, 50), guestCannotUse: false, danger: false, status: "New" },
  { id: "RQ-0011", title: "Shower drain slow", location: "Room 210", room: "210", desc: "Water stands for a few minutes after a shower.", reportedBy: "Chioma Nwosu", dept: "Front Office", at: at(0, 8, 40), guestCannotUse: false, danger: false, status: "New" },
  { id: "RQ-0010", title: "Wardrobe door hinge broken", location: "Room 102", room: "102", desc: "Door hangs loose.", reportedBy: "Fatima Musa", dept: "Housekeeping", at: at(-1, 15, 0), guestCannotUse: false, danger: false, status: "Made into a job", jobId: "WO-0087", decidedBy: "Emeka Obi" },
];
let nextReport = 13;
export const faultReports = () => REPORTS;
export const reportsBy = (name: string) => REPORTS.filter(r => r.reportedBy === name);
export const reportFault = (r: Pick<FaultReport, "title" | "location" | "room" | "desc" | "reportedBy" | "dept" | "guestCannotUse" | "danger">) => {
  const created: FaultReport = { ...r, id: `RQ-${String(nextReport++).padStart(4, "0")}`, at: now(), status: "New" };
  REPORTS.unshift(created);
  notify("fault.reported", { title: `Fault reported: ${created.title}`, body: `${created.location}, by ${created.reportedBy} (${created.dept})${created.guestCannotUse ? ". The guest cannot use the room." : ""}`,
    level: created.danger ? "Urgent" : created.guestCannotUse ? "High" : "Normal", link: { screen: "fault-reports", label: "Fault Reports" } });
  return created;
};
// One step: a report that is no longer New cannot become a second job.
export const makeJob = (reportId: string, j: { priority: WOPriority; outOfOrder: boolean; cat: string; by: string }) => {
  const r = REPORTS.find(x => x.id === reportId);
  if (!r || r.status !== "New") return null;
  Object.assign(r, { status: "Made into a job", decidedBy: j.by });
  const job = addWorkOrder({ title: r.title, location: r.location, room: r.room, cat: j.cat, priority: j.priority, reportedBy: r.reportedBy, desc: r.desc, outOfOrder: !!r.room && j.outOfOrder, guestImpact: r.guestCannotUse });
  r.jobId = job.id;
  notify("fault.madeJob", { title: `Your report is now ${job.id}`, body: `${r.title}, ${r.location}. ${priorityLabel(j.priority)}.`, people: [r.reportedBy], link: { screen: "fault-reports", label: "Fault Reports" } });
  return job;
};
export const turnDown = (reportId: string, reason: string, by: string) => {
  const r = REPORTS.find(x => x.id === reportId);
  if (!r || r.status !== "New" || !reason.trim()) return false;
  Object.assign(r, { status: "Turned down", reason: reason.trim(), decidedBy: by });
  notify("fault.turnedDown", { title: `Report turned down: ${r.title}`, body: `${by}: ${r.reason}`, people: [r.reportedBy], link: { screen: "fault-reports", label: "Fault Reports" } });
  return true;
};

export const updateWorkOrder = (id: string, patch: Partial<WorkOrder>, log?: { event: string; by: string; note: string }) => {
  const w = workOrder(id); if (!w) return;
  const link = { screen: "work-order-detail", label: "Work Order", param: w.id };
  if (patch.tech && patch.tech !== w.tech) notify("workOrder.assigned", { title: `${w.id} is yours: ${w.title}`, body: `${w.location}. ${priorityLabel(w.priority)}: accept it by ${fmtWhen(respondDue(w))}.`, people: [patch.tech], level: PRIORITIES[w.priority].level, link });
  Object.assign(w, patch);
  if (log) w.timeline.push({ at: now(), ...log });
};

// Which moves each status allows; anything else is refused with a reason.
const ALLOWED: Record<WOStatus, WOStatus[]> = {
  Raised: ["Assigned", "Cancelled"],
  Assigned: ["Accepted", "Assigned", "On hold", "Cancelled"],
  Accepted: ["In progress", "On hold", "Assigned", "Cancelled"],
  "In progress": ["On hold", "Completed", "Assigned", "Cancelled"],
  "On hold": ["In progress", "Assigned", "Cancelled"],
  Completed: ["Verified", "In progress"],
  Verified: ["Closed", "Assigned"],
  Closed: [], Cancelled: [],
};
export const canMove = (w: WorkOrder, to: WOStatus) => ALLOWED[w.status].includes(to);
export type Move = { by: string; note?: string; tech?: string; team?: string; holdReason?: string };

// The only way a job changes status. Returns why a move is refused, or null when it is done.
// Closing and cancelling go through finishWorkOrder() in mock/hotel.ts, which also returns the room.
export const moveWorkOrder = (id: string, to: WOStatus, m: Move): string | null => {
  const w = workOrder(id); if (!w) return "There is no such work order.";
  if (!canMove(w, to)) return `A job that is ${w.status.toLowerCase()} cannot be ${to === "Assigned" ? "assigned" : `moved to ${to.toLowerCase()}`}.`;
  const note = m.note?.trim() ?? "", sentBack = w.status === "Completed" && to === "In progress", reopened = w.status === "Verified" && to === "Assigned";
  if (to === "Assigned" && !m.tech && !m.team) return "Choose a technician or a team.";
  if (to === "Assigned" && m.team && !team(m.team)) return "There is no such team.";
  if (to === "Assigned" && m.tech && m.tech !== VENDOR && !isPresentToday(m.tech)) return `${m.tech} is not marked present today. Mark them present on the roster first, or choose someone who is on shift.`;
  const unread = to === "Assigned" && m.tech ? pendingFor(m.tech) : undefined;
  if (unread) return `${m.tech} has not acknowledged the handover from ${unread.from} yet. They read it and acknowledge it first.`;
  const onTeam = !!w.team && (teamMembers(w.team).includes(m.by) || team(w.team)?.lead === m.by);
  if (to === "Accepted" && (w.tech ? w.tech !== m.by && w.tech !== VENDOR : !onTeam)) return `Only ${assignee(w)} can accept this job.`;
  if (to === "On hold" && !HOLD_REASONS.includes(m.holdReason ?? "")) return "Choose why it is on hold.";
  if (to === "Completed" && !note) return "Say what was done.";
  const missing = to === "Completed" ? missingCritical(w) : [];
  if (missing.length) return `${missing.length} critical step${missing.length === 1 ? "" : "s"} on the checklist ${missing.length === 1 ? "has" : "have"} not been recorded: ${missing.slice(0, 3).map(i => i.task).join("; ")}${missing.length > 3 ? `; and ${missing.length - 3} more` : ""}.`;
  if (to === "Verified" && m.by === w.completedBy) return "You completed this job, so someone else must verify it.";
  if ((to === "Cancelled" || sentBack || reopened) && !note) return "Say why.";

  // Leaving hold adds the time held back onto both deadlines.
  const patch: Partial<WorkOrder> = { status: to };
  if (w.status === "On hold" && w.heldSince) Object.assign(patch, { heldMs: w.heldMs + now().getTime() - w.heldSince.getTime(), heldSince: undefined, holdReason: undefined });
  if (to === "Assigned") Object.assign(patch, m.team ? { tech: null, team: m.team } : { tech: m.tech, team: undefined });
  if (to === "Accepted") Object.assign(patch, { acceptedAt: w.acceptedAt ?? now() }, w.tech ? {} : { tech: m.by });
  if (to === "On hold") Object.assign(patch, { holdReason: m.holdReason, heldSince: now() });
  if (to === "Completed") Object.assign(patch, { completedBy: m.by, completedAt: now(), resolution: note });
  if (to === "Verified") patch.verifiedBy = m.by;
  if (sentBack || reopened) Object.assign(patch, { completedBy: undefined, completedAt: undefined, verifiedBy: undefined, resolution: undefined });
  const prevTech = w.tech; // w is changed in place below
  const event = reopened ? "Reopened" : sentBack ? "Sent back" : to === "Assigned" ? (w.tech || w.team ? "Reassigned" : "Assigned") : to === "In progress" ? (w.status === "On hold" ? "Resumed" : "Work started")
    : to === "On hold" ? `On hold: ${m.holdReason!.toLowerCase()}` : to;
  updateWorkOrder(id, patch, { event, by: m.by, note: note || (to === "Assigned" ? `Assigned to ${m.team ? `the ${m.team} team` : m.tech}.` : "") });

  const link = { screen: "work-order-detail", label: "Work Order", param: w.id };
  // Reassigning tells the person it left their board, so nobody keeps working on something that moved.
  if (to === "Assigned" && prevTech && prevTech !== VENDOR && prevTech !== m.tech) notify("workOrder.assigned", { title: `${w.id} is no longer yours: ${w.title}`, body: `Reassigned by ${m.by} to ${m.team ? `the ${m.team} team` : m.tech}.`, people: [prevTech], link });
  if (to === "Assigned" && m.team) { const t = team(m.team)!; notify("workOrder.assigned", { title: `${w.id} is with your team: ${w.title}`, body: `${w.location}. ${priorityLabel(w.priority)}: first to accept takes it, by ${fmtWhen(respondDue(w))}.`, people: [...new Set([...teamMembers(t.name), t.lead])], level: PRIORITIES[w.priority].level, link }); }
  if ((sentBack || reopened) && w.tech) notify("workOrder.reopened", { title: `${w.id} ${sentBack ? "sent back" : "reopened"}: ${w.title}`, body: note, people: [w.tech], link });
  if (to === "Completed") notify("workOrder.completed", { title: `${w.id} is ready to verify: ${w.title}`, body: `Completed by ${m.by}: ${note}`, link });
  if (to === "Verified") onPlannedVerified(w);
  if (to === "Verified") notify("workOrder.verified", { title: `Signed off: ${w.title}`, body: `${w.id}, ${w.location}. Verified by ${m.by}.`, people: [w.reportedBy], link });
  return null;
};


// Late jobs chase themselves. Each step is sent once per job, never while it is on hold.
// shortcut: run every minute in the browser on the demo clock; the hotel server runs it as a job.
export type Escalation = "respond" | "resolve" | "p1Double";
export const escalate = () => {
  const t = now().getTime();
  for (const w of LIST) {
    if (!isOpen(w) || w.status === "On hold") continue;
    const done = (w.escalated ??= []);
    const link = { screen: "work-order-detail", label: "Work Order", param: w.id };
    const send = (step: Escalation, to: string[], title: string, level: Level) => {
      if (done.includes(step)) return;
      done.push(step);
      w.timeline.push({ at: now(), event: `Escalated to ${to.join(", ")}`, by: "System", note: title });
      notify("workOrder.late", { title, body: `${w.title}, ${w.location}. ${assignee(w) ? `With ${assignee(w)}.` : "Nobody assigned."}${rule ? ` Deadlines from the rule ${describeRule(rule)}.` : ""}`, people: to, level, link, by: "System" });
    };
    const t2 = team(w.team ?? staff(w.tech ?? "")?.team ?? "");
    // The job's rule adds people to a breach; it never takes the usual chain off it.
    const rule = slaRule(w.rule), named = rule?.escalateTo ? holdersOf(rule.escalateTo) : [];
    const who = (name: string | undefined, role: StaffRole) => [...new Set([...(name ? [name] : holdersOf(role).length ? holdersOf(role) : holdersOf("Head of department")), ...named])];
    if (isLateToRespond(w)) send("respond", who(t2?.lead, "Team lead"), `${w.id} not accepted in time`, "High");
    if (resolveDue(w).getTime() < t) send("resolve", who(t2?.supervisor, "Supervisor"), `${w.id} past its fix-by deadline`, "High");
    const doubled = w.reportedAt.getTime() + 2 * (w.resolveBy.getTime() - w.reportedAt.getTime()) + heldFor(w);
    if (w.priority === "P1" && doubled < t) send("p1Double", holdersOf("Head of department"), `${w.id} P1 at twice its deadline`, "Urgent");
  }
};
