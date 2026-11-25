// Incidents, as FacilityFlow keeps them (routes/safety.ts, 0008): anyone reports one; only managers and Maintenance
// leads read them, because injury records are sensitive staff data. A month's report is strictly that month.
import { BUSINESS_DATE } from "../constants";
import { notify } from "./notify";
import { holdersOf, staffList } from "./roster";
import { now } from "./maintenance";

export const INCIDENT_TYPES = ["Injury", "Near miss", "Property damage", "Fire", "Spill"] as const;
export const SEVERITIES = ["Minor", "Moderate", "Major", "Critical"] as const;
export type Incident = { id: string; occurredAt: Date; type: typeof INCIDENT_TYPES[number]; place?: string; description: string;
  severity: typeof SEVERITIES[number]; immediateAction?: string; reportedBy: string; at: Date };

const at = (day: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h, m);
const INCIDENTS: Incident[] = [
  { id: "INC-3", occurredAt: at(-2, 14, 20), type: "Near miss", place: "Generator house", description: "Diesel hose left across the walkway after the delivery. Nobody fell.", severity: "Minor", immediateAction: "Hose coiled and hung on its bracket.", reportedBy: "Emeka Obi", at: at(-2, 14, 40) },
  { id: "INC-2", occurredAt: at(-9, 11, 0), type: "Injury", place: "Restaurant kitchen", description: "Cut to the hand while changing a fridge door gasket.", severity: "Moderate", immediateAction: "First aid given; back at work the same day.", reportedBy: "Chidi Ike", at: at(-9, 11, 30) },
  { id: "INC-1", occurredAt: at(-30, 16, 0), type: "Spill", place: "Laundry", description: "Detergent drum leaked onto the floor by the washers.", severity: "Minor", immediateAction: "Area mopped and signed; drum replaced.", reportedBy: "Fatima Musa", at: at(-30, 16, 15) },
];
let incSeq = INCIDENTS.length;

const LEADS = ["Team lead", "Supervisor", "Head of department"] as const;
/** Managers, and Maintenance's team leads, supervisors and head of department. Reporting needs nothing. */
export const canReadIncidents = (name: string, role: string) => role === "MGT" || staffList().some(s => s.name === name && (LEADS as readonly string[]).includes(s.role));

export const reportIncident = (i: Pick<Incident, "occurredAt" | "type" | "place" | "description" | "severity" | "immediateAction">, by: string): Incident | string => {
  const description = i.description.trim();
  if (description.length < 5) return "Say what happened.";
  if (!(i.occurredAt instanceof Date) || isNaN(i.occurredAt.getTime())) return "Say when it happened.";
  if (i.occurredAt.getTime() > now().getTime() + 60000) return "An incident cannot have happened in the future.";
  const inc: Incident = { ...i, description, place: i.place?.trim() || undefined, immediateAction: i.immediateAction?.trim() || undefined, id: `INC-${++incSeq}`, reportedBy: by, at: now() };
  INCIDENTS.unshift(inc);
  // Only the people who may read incidents hear of one, and nothing about the injury goes in the bell.
  notify("incident.reported", { title: `${inc.severity} ${inc.type.toLowerCase()} reported${inc.place ? `: ${inc.place}` : ""}`, body: `${inc.id}, reported by ${by}.`,
    level: inc.severity === "Critical" || inc.severity === "Major" ? "Urgent" : inc.severity === "Moderate" ? "High" : "Normal",
    people: [...new Set(LEADS.flatMap(r => holdersOf(r)))], link: { screen: "mx-safety", label: "Safety" } });
  return inc;
};

/** Strictly the month: a safety report for September that quietly includes August is not a safety report. */
export const incidentsIn = (year: number, month: number) => INCIDENTS.filter(i => i.occurredAt.getFullYear() === year && i.occurredAt.getMonth() === month);
