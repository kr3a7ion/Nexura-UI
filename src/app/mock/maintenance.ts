// Maintenance work orders: one list read by Work Orders, the detail screen, the department home,
// Suite Home and the manager dashboard. Housekeeping's "Report a fault" adds to it.
// shortcut: held in memory until the hotel server exists; changes last until the page reloads.
import { BUSINESS_DATE } from "../constants";
import { ROOMS } from "./property";

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

// A room is out of order while any open order on it says so; closing the last one puts it back in service.
const syncRoom = (room?: string) => {
  if (!room) return;
  const r = ROOMS.find(x => x.id === room); if (!r) return;
  const out = LIST.some(w => w.room === room && w.outOfOrder && w.status !== "Closed" && w.status !== "Cancelled");
  if (out && r.status !== "Occupied" && r.status !== "Out of service") r.status = "Maintenance";
  else if (!out && (r.status === "Maintenance" || r.status === "Out of service")) r.status = "Available";
};

let next = 95;
export const addWorkOrder = (w: Pick<WorkOrder, "title" | "location" | "cat" | "priority" | "reportedBy" | "desc"> & { room?: string; outOfOrder?: boolean; guestImpact?: boolean; asset?: string }) => {
  const created = wo({ id: `WO-${String(next++).padStart(4, "0")}`, status: "Reported", tech: null, reportedAt: NOW,
    guestImpact: false, outOfOrder: false, ...w });
  LIST.unshift(created); syncRoom(created.room);
  return created;
};
export const updateWorkOrder = (id: string, patch: Partial<WorkOrder>, log?: { event: string; by: string; note: string }) => {
  const w = workOrder(id); if (!w) return;
  Object.assign(w, patch);
  if (log) w.timeline.push({ at: new Date(NOW.getTime() + w.timeline.length * 60000), ...log });
  syncRoom(w.room);
};

console.assert(ROOMS.filter(r => r.status === "Maintenance" || r.status === "Out of service").every(r => LIST.some(w => w.room === r.id && w.outOfOrder && isOpen(w))), "every out-of-order room has an open work order");
