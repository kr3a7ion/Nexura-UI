// Maintenance work orders: one list read by Work Orders, the detail screen, the department home,
// Suite Home and the manager dashboard. Housekeeping's "Report a fault" adds to it.
// shortcut: held in memory until the hotel server exists; changes last until the page reloads.
import { BUSINESS_DATE } from "../constants";
import { notify, type Level } from "./notify";

export type WOStatus = "Reported" | "Assigned" | "In progress" | "Fixed" | "Closed" | "Cancelled";
export type WOPriority = "Low" | "Medium" | "High";
export type WOEvent = { at: Date; event: string; by: string; note: string };
export type WorkOrder = {
  id: string; title: string; location: string; room?: string; cat: string; priority: WOPriority; status: WOStatus;
  tech: string | null; reportedBy: string; reportedAt: Date; slaDue: Date; guestImpact: boolean;
  outOfOrder: boolean; asset?: string; desc: string; timeline: WOEvent[];
  parts: { item: string; qty: number; unit: number; ref: string }[]; labourHours: number; resolution?: string;
};

export const TECHNICIANS = ["Emeka Obi", "Chidi Ike", "External vendor"];
export const WO_CATEGORIES = ["Electrical", "HVAC", "Plumbing", "Furniture", "Equipment", "Mechanical", "General"];
export const LABOUR_RATE = 5000;
// Hours to fix by priority, counted from when it was reported.
export const SLA_HOURS: Record<WOPriority, number> = { High: 6, Medium: 24, Low: 48 };
// The demo clock: mid-morning on the business date.
export const NOW = new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate(), 10, 15);

const at = (dayOffset: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + dayOffset, h, m);
const plusH = (d: Date, h: number) => new Date(d.getTime() + h * 3600000);
const wo = (w: Omit<WorkOrder, "slaDue" | "timeline" | "parts" | "labourHours"> & Partial<Pick<WorkOrder, "timeline" | "parts" | "labourHours">>): WorkOrder => ({
  timeline: [{ at: w.reportedAt, event: "Reported", by: w.reportedBy, note: w.desc }], parts: [], labourHours: 0,
  ...w, slaDue: plusH(w.reportedAt, SLA_HOURS[w.priority]),
});

const LIST: WorkOrder[] = [
  wo({ id: "WO-0094", title: "Shower valve leaking, room closed", location: "Room 112", room: "112", cat: "Plumbing", priority: "High", status: "In progress",
    tech: "Emeka Obi", reportedBy: "Fatima Musa", reportedAt: at(0, 7, 10), guestImpact: false, outOfOrder: true,
    desc: "Water leaking behind the shower panel onto the bathroom floor. Room taken out of order until fixed.",
    timeline: [
      { at: at(0, 7, 10), event: "Reported", by: "Fatima Musa", note: "Water leaking behind the shower panel onto the bathroom floor." },
      { at: at(0, 7, 25), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Emeka Obi." },
      { at: at(0, 8, 5), event: "Work started", by: "Emeka Obi", note: "Cartridge worn. Replacing it and resealing the panel." },
    ],
    parts: [{ item: "Shower cartridge", qty: 1, unit: 12500, ref: "STK-0052" }, { item: "Silicone sealant", qty: 1, unit: 3500, ref: "STK-0018" }], labourHours: 1.5 }),
  wo({ id: "WO-0093", title: "Ceiling stain under room 315", location: "Room 215", room: "215", cat: "Plumbing", priority: "Medium", status: "Assigned",
    tech: "Chidi Ike", reportedBy: "Amaka Osei", reportedAt: at(-1, 15, 40), guestImpact: false, outOfOrder: true,
    desc: "Damp patch spreading on the ceiling near the window. Room out of order until the source is found." }),
  wo({ id: "WO-0092", title: "Room rewiring after power surge", location: "Room 309", room: "309", cat: "Electrical", priority: "High", status: "Reported",
    tech: null, reportedBy: "Adaeze Okonkwo", reportedAt: at(0, 6, 50), guestImpact: false, outOfOrder: true,
    desc: "Sockets and bedside lights dead after last night's surge. Burning smell at the distribution board. Do not let the room." }),
  wo({ id: "WO-0091", title: "Air conditioner not cooling", location: "Room 316", room: "316", cat: "HVAC", priority: "High", status: "In progress",
    tech: "Emeka Obi", reportedBy: "John Abubakar", reportedAt: at(-1, 15, 0), guestImpact: true, outOfOrder: false, asset: "AST-001",
    desc: "Guest reports 29°C against a 23°C set point. Unit runs but blows warm air.",
    timeline: [
      { at: at(-1, 15, 0), event: "Reported", by: "John Abubakar", note: "Guest reports 29°C against a 23°C set point." },
      { at: at(-1, 15, 20), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Emeka Obi." },
      { at: at(-1, 16, 5), event: "Work started", by: "Emeka Obi", note: "Low refrigerant. Waiting for R-410A from stores." },
    ],
    parts: [{ item: "R-410A refrigerant (1 kg)", qty: 1, unit: 8500, ref: "STK-0044" }, { item: "Condenser filter", qty: 1, unit: 2200, ref: "STK-0041" }], labourHours: 1 }),
  wo({ id: "WO-0090", title: "Lobby light flickering", location: "Lobby", cat: "Electrical", priority: "Medium", status: "Reported",
    tech: null, reportedBy: "Fatima Al-Hassan", reportedAt: at(0, 6, 30), guestImpact: true, outOfOrder: false,
    desc: "Two downlights by the reception desk flicker every few seconds." }),
  wo({ id: "WO-0089", title: "Kitchen fridge noisy", location: "Restaurant kitchen", cat: "Equipment", priority: "Low", status: "Assigned",
    tech: "Chidi Ike", reportedBy: "Kitchen staff", reportedAt: at(-1, 9, 0), guestImpact: false, outOfOrder: false, asset: "AST-002",
    desc: "Compressor rattles loudly when it starts. Still holding temperature." }),
  wo({ id: "WO-0088", title: "Generator oil change", location: "Generator House", cat: "Mechanical", priority: "Medium", status: "Assigned",
    tech: "Emeka Obi", reportedBy: "Preventive schedule", reportedAt: at(0, 7, 0), guestImpact: false, outOfOrder: false, asset: "AST-004",
    desc: "250-hour service: oil, oil filter, battery and coolant check." }),
  wo({ id: "WO-0087", title: "Wardrobe door hinge broken", location: "Room 102", room: "102", cat: "Furniture", priority: "Low", status: "Fixed",
    tech: "Chidi Ike", reportedBy: "Grace Achebe", reportedAt: at(-2, 10, 0), guestImpact: false, outOfOrder: false,
    desc: "Top hinge pulled out of the wardrobe door.",
    timeline: [
      { at: at(-2, 10, 0), event: "Reported", by: "Grace Achebe", note: "Top hinge pulled out of the wardrobe door." },
      { at: at(-2, 11, 0), event: "Assigned", by: "Adaeze Okonkwo", note: "Assigned to Chidi Ike." },
      { at: at(0, 9, 30), event: "Fixed", by: "Chidi Ike", note: "New hinge fitted, screw holes plugged and redrilled." },
    ], parts: [{ item: "Cabinet hinge", qty: 2, unit: 1800, ref: "STK-0063" }], labourHours: 0.5, resolution: "New hinge fitted, screw holes plugged and redrilled." }),
  wo({ id: "WO-0086", title: "Pool pump making noise", location: "Pool area", cat: "Equipment", priority: "Medium", status: "Closed",
    tech: "Chidi Ike", reportedBy: "Bola Adewale", reportedAt: at(-3, 10, 15), guestImpact: false, outOfOrder: false, asset: "AST-007",
    desc: "Grinding noise from the pump housing.", labourHours: 2, resolution: "Bearing replaced; pump checked running quietly." }),
];

export const workOrders = () => LIST;
export const workOrder = (id: string) => LIST.find(w => w.id === id);
export const isOpen = (w: WorkOrder) => w.status !== "Closed" && w.status !== "Cancelled" && w.status !== "Fixed";
export const isOverdue = (w: WorkOrder) => isOpen(w) && w.slaDue < NOW;
export const ageOf = (w: WorkOrder) => {
  const h = Math.max(0, Math.round((NOW.getTime() - w.reportedAt.getTime()) / 3600000));
  return h < 1 ? "Under 1h" : h < 24 ? `${h}h` : `${Math.floor(h / 24)}d ${h % 24}h`;
};
export const fmtWhen = (d: Date) => `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

// A room is out of order while any order on it says so and is not closed or cancelled;
// a fixed job keeps the room out until someone has checked it.
export const isOutOfOrder = (room: string) => LIST.some(w => w.room === room && w.outOfOrder && w.status !== "Closed" && w.status !== "Cancelled");

let next = 95;
export const addWorkOrder = (w: Pick<WorkOrder, "title" | "location" | "cat" | "priority" | "reportedBy" | "desc"> & { room?: string; outOfOrder?: boolean; guestImpact?: boolean; asset?: string }) => {
  const created = wo({ id: `WO-${String(next++).padStart(4, "0")}`, status: "Reported", tech: null, reportedAt: NOW,
    guestImpact: false, outOfOrder: false, ...w });
  LIST.unshift(created);
  const link = { screen: "work-order-detail", label: "Work Order", param: created.id };
  // A job's priority sets how loudly Maintenance is told: High interrupts, Low waits on the bell.
  notify("workOrder.raised", { title: `New job ${created.id}: ${created.title}`, body: `${created.location}, reported by ${created.reportedBy}`, level: PRIORITY_LEVEL[created.priority], link });
  if (created.room && created.outOfOrder) notify("room.outOfOrder", { title: `Room ${created.room} is out of order`, body: `${created.title}. Do not sell or give it out.`, link });
  return created;
};
const PRIORITY_LEVEL: Record<WOPriority, Level> = { High: "Urgent", Medium: "High", Low: "Normal" };
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
  const created: FaultReport = { ...r, id: `RQ-${String(nextReport++).padStart(4, "0")}`, at: NOW, status: "New" };
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
  notify("fault.madeJob", { title: `Your report is now ${job.id}`, body: `${r.title}, ${r.location}. Priority ${j.priority.toLowerCase()}.`, people: [r.reportedBy], link: { screen: "fault-reports", label: "Fault Reports" } });
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
  if (patch.tech && patch.tech !== w.tech) notify("workOrder.assigned", { title: `${w.id} is yours: ${w.title}`, body: w.location, people: [patch.tech], level: PRIORITY_LEVEL[w.priority], link });
  if (log?.event === "Reopened" && w.tech) notify("workOrder.reopened", { title: `${w.id} sent back: ${w.title}`, body: log.note, people: [w.tech], link });
  Object.assign(w, patch);
  if (log) w.timeline.push({ at: new Date(NOW.getTime() + w.timeline.length * 60000), ...log });
};

