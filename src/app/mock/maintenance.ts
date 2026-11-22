// Maintenance work orders: one list read by Work Orders, the detail screen, the department home,
// Suite Home and the manager dashboard. Housekeeping's "Report a fault" adds to it.
// shortcut: held in memory until the hotel server exists; changes last until the page reloads.
import { BUSINESS_DATE } from "../constants";
import { notify, type Level } from "./notify";
import { presentToday, isPresentToday, team, teamMembers, staff, holdersOf, type StaffRole } from "./roster";

// The lifecycle and priorities follow FacilityFlow (docs/OPERATING.md, services/workOrders.ts).
export type WOStatus = "Raised" | "Assigned" | "Accepted" | "In progress" | "On hold" | "Completed" | "Verified" | "Closed" | "Cancelled";
export type WOPriority = "P1" | "P2" | "P3" | "P4";
export type WOEvent = { at: Date; event: string; by: string; note: string };
export type WorkOrder = {
  id: string; title: string; location: string; room?: string; cat: string; priority: WOPriority; status: WOStatus;
  tech: string | null; reportedBy: string; reportedAt: Date; guestImpact: boolean;
  // Both deadlines are set once when the job is raised and never rewritten; time on hold is added back when reading them.
  respondBy: Date; resolveBy: Date; acceptedAt?: Date; heldMs: number; heldSince?: Date; holdReason?: string;
  completedBy?: string; verifiedBy?: string;
  outOfOrder: boolean; asset?: string; desc: string; timeline: WOEvent[];
  parts: { item: string; qty: number; unit: number; ref: string }[]; labourHours: number; resolution?: string;
  escalated?: Escalation[];
  team?: string; // handed to a team: whoever on it accepts becomes the name on the job
};

export const VENDOR = "External vendor";
// Work goes only to people marked present on today's roster (mock/roster.ts), to a team, or to an outside vendor.
export const assignable = () => [...presentToday(), VENDOR];
export const assignee = (w: WorkOrder) => w.tech ?? (w.team ? `${w.team} team` : null);
export const WO_CATEGORIES = ["Electrical", "HVAC", "Plumbing", "Furniture", "Equipment", "Mechanical", "General"];
export const LABOUR_RATE = 5000;
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
  wo({ id: "WO-0088", title: "Generator oil change", location: "Generator House", cat: "Mechanical", priority: "P4", status: "Assigned",
    tech: "Emeka Obi", reportedBy: "Preventive schedule", reportedAt: at(0, 7, 0), guestImpact: false, outOfOrder: false, asset: "AST-004",
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
// a completed or verified job keeps the room out until it is closed.
export const isOutOfOrder = (room: string) => LIST.some(w => w.room === room && w.outOfOrder && w.status !== "Closed" && w.status !== "Cancelled");

let next = 95;
export const addWorkOrder = (w: Pick<WorkOrder, "title" | "location" | "cat" | "priority" | "reportedBy" | "desc"> & { room?: string; outOfOrder?: boolean; guestImpact?: boolean; asset?: string }) => {
  const created = wo({ id: `WO-${String(next++).padStart(4, "0")}`, status: "Raised", tech: null, reportedAt: now(),
    guestImpact: false, outOfOrder: false, ...w });
  LIST.unshift(created);
  const link = { screen: "work-order-detail", label: "Work Order", param: created.id };
  // A job's priority sets how loudly Maintenance is told: P1 interrupts, P4 waits on the bell.
  notify("workOrder.raised", { title: `New ${created.priority} job ${created.id}: ${created.title}`, body: `${created.location}, reported by ${created.reportedBy}`, level: PRIORITIES[created.priority].level, link });
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
  const onTeam = !!w.team && (teamMembers(w.team).includes(m.by) || team(w.team)?.lead === m.by);
  if (to === "Accepted" && (w.tech ? w.tech !== m.by && w.tech !== VENDOR : !onTeam)) return `Only ${assignee(w)} can accept this job.`;
  if (to === "On hold" && !HOLD_REASONS.includes(m.holdReason ?? "")) return "Choose why it is on hold.";
  if (to === "Completed" && !note) return "Say what was done.";
  if (to === "Verified" && m.by === w.completedBy) return "You completed this job, so someone else must verify it.";
  if ((to === "Cancelled" || sentBack || reopened) && !note) return "Say why.";

  // Leaving hold adds the time held back onto both deadlines.
  const patch: Partial<WorkOrder> = { status: to };
  if (w.status === "On hold" && w.heldSince) Object.assign(patch, { heldMs: w.heldMs + now().getTime() - w.heldSince.getTime(), heldSince: undefined, holdReason: undefined });
  if (to === "Assigned") Object.assign(patch, m.team ? { tech: null, team: m.team } : { tech: m.tech, team: undefined });
  if (to === "Accepted") Object.assign(patch, { acceptedAt: w.acceptedAt ?? now() }, w.tech ? {} : { tech: m.by });
  if (to === "On hold") Object.assign(patch, { holdReason: m.holdReason, heldSince: now() });
  if (to === "Completed") Object.assign(patch, { completedBy: m.by, resolution: note });
  if (to === "Verified") patch.verifiedBy = m.by;
  if (sentBack || reopened) Object.assign(patch, { completedBy: undefined, verifiedBy: undefined, resolution: undefined });
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
      notify("workOrder.late", { title, body: `${w.title}, ${w.location}. ${assignee(w) ? `With ${assignee(w)}.` : "Nobody assigned."}`, people: to, level, link, by: "System" });
    };
    const t2 = team(w.team ?? staff(w.tech ?? "")?.team ?? "");
    const who = (name: string | undefined, role: StaffRole) => name ? [name] : holdersOf(role).length ? holdersOf(role) : holdersOf("Head of department");
    if (isLateToRespond(w)) send("respond", who(t2?.lead, "Team lead"), `${w.id} not accepted in time`, "High");
    if (resolveDue(w).getTime() < t) send("resolve", who(t2?.supervisor, "Supervisor"), `${w.id} past its fix-by deadline`, "High");
    const doubled = w.reportedAt.getTime() + 2 * (w.resolveBy.getTime() - w.reportedAt.getTime()) + heldFor(w);
    if (w.priority === "P1" && doubled < t) send("p1Double", holdersOf("Head of department"), `${w.id} P1 at twice its deadline`, "Urgent");
  }
};
