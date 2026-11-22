// Shift handover, as FacilityFlow keeps it (shift_handovers, pages/Handover.tsx): the system fills in what it
// already knows, the outgoing shift writes only what it cannot know, and the incoming shift acknowledges.
import { workOrders, isOpen, now, type WOPriority, type WOStatus } from "./maintenance";
import { assets } from "./ppm";
import { rosterDay, patternName, dayKey } from "./roster";
import { notify } from "./notify";
import { BUSINESS_DATE } from "../constants";
import { livePermits, PERMIT_TYPES } from "./permits";

export type CarriedJob = { id: string; title: string; priority: WOPriority; status: WOStatus; holdReason?: string; with?: string };
export type PlantLine = { id: string; name: string; status: string; meter?: string };
export type Handover = { id: string; at: Date; from: string; to: string; shift: string; permits: string[]; plant: PlantLine[]; carried: CarriedJob[];
  notes: string; keys: string; status: "Submitted" | "Acknowledged"; acknowledgedBy?: string; acknowledgedAt?: Date };

const PRI_ORDER: WOPriority[] = ["P1", "P2", "P3", "P4"];
/** The facts the system already holds at this moment: power plant and every open job, most urgent first. */
export const draft = (): { plant: PlantLine[]; carried: CarriedJob[]; permits: string[] } => ({
  permits: livePermits().map(p => `${p.id} ${PERMIT_TYPES[p.type].toLowerCase()}${p.woId ? ` on ${p.woId}` : ""}`),
  // shortcut: plant is the metered power assets; fuel tanks and utility outages join when Diesel and Power is built.
  plant: assets().filter(a => a.cat === "Power").map(a => ({ id: a.id, name: a.name, status: a.status, meter: a.meter ? `${a.meter.value.toLocaleString()} ${a.meter.unit}` : undefined })),
  carried: workOrders().filter(isOpen).sort((a, b) => PRI_ORDER.indexOf(a.priority) - PRI_ORDER.indexOf(b.priority))
    .map(w => ({ id: w.id, title: w.title, priority: w.priority, status: w.status, holdReason: w.holdReason, with: w.tech ?? (w.team ? `${w.team} team` : undefined) })),
});

// Seeds use the business date directly: mock/maintenance.ts imports this file, so it is not loaded yet here.
const yesterday = new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() - 1);
const LIST: Handover[] = [
  { id: "HO-0001", at: new Date(yesterday.setHours(15, 5, 0, 0)), from: "Chidi Ike", to: "Musa Danladi", shift: "Morning", permits: [],
    plant: [{ id: "AST-004", name: "Main generator 500 kVA", status: "Operational", meter: "3,398 hours" }],
    carried: [{ id: "WO-0091", title: "Air conditioner not cooling", priority: "P2", status: "On hold", holdReason: "Waiting for parts", with: "Emeka Obi" },
      { id: "WO-0093", title: "Ceiling stain under room 315", priority: "P3", status: "Assigned", with: "Chidi Ike" }],
    notes: "Room 316 AC waiting for refrigerant from stores; guest moved to 318. Generator ran 40 minutes at 13:10 during the outage, no alarms.",
    keys: "Plant room key with security", status: "Acknowledged", acknowledgedBy: "Musa Danladi", acknowledgedAt: new Date(new Date(yesterday).setHours(15, 20, 0, 0)) },
];
let next = 2;
export const handovers = () => LIST;

/** A handover not yet acknowledged by the person it was handed to: they cannot be given work until they read it. */
export const pendingFor = (name: string) => LIST.find(h => h.to === name && h.status === "Submitted");

export const submitHandover = (from: string, to: string, notes: string, keys: string): Handover | string => {
  if (!to || to === from) return "Choose who is taking over.";
  if (notes.trim().length < 5) return "Write what the next shift must know before submitting.";
  const h: Handover = { id: `HO-${String(next++).padStart(4, "0")}`, at: now(), from, to, shift: patternName(rosterDay(from, dayKey(now()))?.shift ?? null),
    ...draft(), notes: notes.trim(), keys: keys.trim(), status: "Submitted" };
  LIST.unshift(h);
  notify("handover.submitted", { title: `Shift handover from ${from} waiting for you`, body: `${h.carried.length} open job${h.carried.length === 1 ? "" : "s"} carried over. Acknowledge it before you can be given work.`, people: [to], link: { screen: "mx-handover", label: "Shift Handover" } });
  return h;
};

/** Acknowledgement is a gate, not a courtesy: only once, and never by the person who wrote it. */
export const acknowledgeHandover = (id: string, by: string): string | null => {
  const h = LIST.find(x => x.id === id);
  if (!h) return "That handover does not exist.";
  if (h.status === "Acknowledged") return "This handover is already acknowledged.";
  if (h.from === by) return "You wrote this handover, so the incoming shift has to acknowledge it.";
  if (h.to !== by) return `This handover is for ${h.to}. Only they can acknowledge it.`;
  Object.assign(h, { status: "Acknowledged", acknowledgedBy: by, acknowledgedAt: now() });
  notify("handover.acknowledged", { title: `${by} acknowledged your handover`, body: `${h.id}, ${h.shift} shift.`, people: [h.from], link: { screen: "mx-handover", label: "Shift Handover" } });
  return null;
};
