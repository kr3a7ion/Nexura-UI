import { tanks } from "./setup";
import { levelOf, issues, runs } from "./power";
import { now, fmtWhen } from "./maintenance";
import { lowStock } from "./stores";

export type MaintenanceException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "work-orders" | "asset-register" | "preventive-schedule" | "generator-diesel" | "mx-stores";
  screenLabel: string;
};

// Fixed exceptions are demo text; the diesel one is worked out from the diesel book.
const FIXED: MaintenanceException[] = [
  { id: "MX-01", title: "Overdue preventive maintenance", detail: "The central air conditioning service was due on 12 Jun.", severity: "Critical", screen: "preventive-schedule", screenLabel: "Planned Work" },
  { id: "MX-04", title: "Repeat fault on same asset", detail: "The room 316 air conditioner has failed three times in 60 days.", severity: "Warning", screen: "asset-register", screenLabel: "Asset Register" },
];
export const maintenanceExceptions = (): MaintenanceException[] => [
  ...tanks().filter(t => levelOf(t.id) < t.minimum).map(t => ({ id: `MX-${t.id}`, title: `${t.name} below its minimum`, detail: `${Math.round(levelOf(t.id)).toLocaleString()} L against a minimum of ${t.minimum.toLocaleString()} L. Order diesel.`, severity: "Critical" as const, screen: "generator-diesel" as const, screenLabel: "Power & Diesel" })),
  // Free stock at or below the reorder level: what the store can still give out, not what the books say.
  ...lowStock().filter(l => l.store === "Maintenance store").map(l => ({ id: `MX-LOW-${l.item.sku}`, title: `${l.item.name} running low`, detail: `${l.left} ${l.item.unit} free in the maintenance store, reorder at ${l.item.min["Maintenance store"]}.`, severity: "Warning" as const, screen: "mx-stores" as const, screenLabel: "Maintenance Store" })),
  ...FIXED,
];

/** The power card, from the diesel book: today's run hours, the bulk tank, days of reserve at this month's rate, the last power cut. */
export const maintenancePower = () => {
  const t = now(), dayStart = new Date(t.getFullYear(), t.getMonth(), t.getDate()), monthStart = new Date(t.getFullYear(), t.getMonth(), 1);
  const bulk = tanks()[0];
  const used = issues().filter(i => i.tankId === bulk.id && i.at >= monthStart).reduce((n, i) => n + i.litres, 0);
  const perDay = used / Math.max(1, (t.getTime() - monthStart.getTime()) / 86400000);
  const cut = runs().find(r => r.reason === "Power cut");
  const pct = Math.round(levelOf(bulk.id) / bulk.capacity * 100);
  return {
    runtimeToday: `${runs().filter(r => r.at >= dayStart).reduce((n, r) => n + r.runHours, 0)} hours`,
    dieselPct: `${pct}%`,
    dieselRemaining: `${Math.round(levelOf(bulk.id)).toLocaleString()} L (${pct}%)`,
    reserveDays: perDay > 0 ? `About ${Math.floor(levelOf(bulk.id) / perDay)} days` : "Not enough use to tell",
    lastGridOutage: cut ? `${fmtWhen(cut.at)}, ${cut.runHours} hours on the generator` : "None recorded",
  };
};
