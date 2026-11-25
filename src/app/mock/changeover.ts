// Mains and generators as they change, as FacilityFlow keeps it (services/changeover.ts): mains failed, a set started,
// mains back, a set stopped, a set faulty. Recorded as it happens, so the people who need to know the building is on a
// set hear it now, not when the run is written up. Availability (the asset's status) and running are kept apart:
// a set can be in service and stopped, which is most of the time.
// Seeds use the business date: mock/handover.ts reads this file while mock/maintenance.ts is still loading.
import { BUSINESS_DATE } from "../constants";
import { gensets } from "./setup";
import { asset } from "./ppm";
import { notify } from "./notify";
import { now } from "./maintenance";

export type SwitchEvent = "Mains failed" | "Mains restored" | "Set started" | "Set stopped" | "Set faulty";
export type SwitchLine = { id: string; at: Date; event: SwitchEvent; assetId?: string; ranMinutes?: number; note?: string; by: string };
export type Outage = { id: string; start: Date; end?: Date; by: string };

const at = (day: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h, m);
// Last night's cut, the one the 12-hour run in the diesel book was for.
const OUTAGES: Outage[] = [{ id: "PO-2", start: at(-1, 19, 55), end: at(0, 8, 5), by: "Emeka Obi" }, { id: "PO-1", start: at(-3, 17, 50), end: at(-2, 6, 0), by: "Chidi Ike" }];
const RUNNING: Record<string, Date | undefined> = {};
const LOG: SwitchLine[] = [
  { id: "SW-4", at: at(0, 8, 10), event: "Set stopped", assetId: "AST-004", ranMinutes: 730, by: "Emeka Obi" },
  { id: "SW-3", at: at(0, 8, 5), event: "Mains restored", by: "Emeka Obi" },
  { id: "SW-2", at: at(-1, 20, 0), event: "Set started", assetId: "AST-004", by: "Emeka Obi" },
  { id: "SW-1", at: at(-1, 19, 55), event: "Mains failed", by: "Emeka Obi" },
];
let seq = 4;

const mins = (a: Date, b: Date) => Math.max(0, Math.round((b.getTime() - a.getTime()) / 60000));
export const span = (m: number) => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`;
const clock = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const openOutage = () => OUTAGES.find(o => !o.end);
const tag = (id: string) => asset(id)?.name ?? id;
const link = { screen: "generator-diesel", label: "Power & Diesel" };

export const switchLog = () => LOG;
export const outagesBetween = (from: Date, to: Date) => OUTAGES.filter(o => o.start < to && (o.end ?? to) > from);
export const plantNow = () => {
  const o = openOutage();
  return { mains: o ? "off" as const : "on" as const, offSince: o?.start,
    sets: gensets().map(g => ({ assetId: g.assetId, name: tag(g.assetId), status: asset(g.assetId)?.status ?? "Operational", runningSince: RUNNING[g.assetId] })) };
};

/** One changeover, entered as it happens or a few minutes late. Refused when it contradicts the live state. */
export const recordSwitch = (event: SwitchEvent, input: { assetId?: string; at?: Date; note?: string }, by: string): SwitchLine | string => {
  const t = now(), when = input.at ?? t, note = input.note?.trim() || undefined;
  if (when.getTime() > t.getTime() + 2 * 60000) return "A changeover cannot be recorded in the future.";
  const o = openOutage(), isSet = event.startsWith("Set"), a = input.assetId ? asset(input.assetId) : undefined;
  if (isSet && (!a || !gensets().some(g => g.assetId === a.id))) return "Pick which generator.";
  const others = () => Object.entries(RUNNING).filter(([id, s]) => s && id !== a?.id).map(([id]) => tag(id));
  let ranMinutes: number | undefined, title = "", body = "";
  switch (event) {
    case "Mains failed": {
      if (o) return `Mains has been recorded off since ${clock(o.start)}.`;
      const last = OUTAGES.find(x => x.end); // newest first
      if (last && when < last.end!) return `Mains was recorded back on at ${clock(last.end!)}. A failure before that would overlap the cut already recorded.`;
      const live = others();
      title = `Mains failed at ${clock(when)}`; body = live.length ? `${live.join(" and ")} already running.` : "No generator is running yet.";
      OUTAGES.unshift({ id: `PO-${OUTAGES.length + 1}`, start: when, by }); break;
    }
    case "Mains restored": {
      if (!o) return "Mains is already recorded on.";
      if (when < o.start) return `Mains went off at ${clock(o.start)}; it cannot come back before that.`;
      const live = others();
      title = "Mains restored"; body = `Off for ${span(mins(o.start, when))}.${live.length ? ` ${live.join(" and ")} still running. Stop ${live.length === 1 ? "it" : "them"} once the load is back on mains.` : ""}`;
      o.end = when; break;
    }
    case "Set started": {
      if (RUNNING[a!.id]) return `${a!.name} has been running since ${clock(RUNNING[a!.id]!)}.`;
      if (a!.status === "Offline") return `${a!.name} is marked offline. Put it back in service on the asset register first.`;
      title = `${a!.name} started`; body = o ? `Mains off since ${clock(o.start)}.` : "Mains is on: a test or a load run.";
      RUNNING[a!.id] = when; break;
    }
    case "Set stopped": {
      const since = RUNNING[a!.id];
      if (!since) return `${a!.name} is not recorded as running.`;
      if (when < since) return `${a!.name} started at ${clock(since)}; it cannot stop before that.`;
      ranMinutes = mins(since, when);
      title = `${a!.name} stopped after ${span(ranMinutes)}`;
      body = `Log the run on Power & Diesel so the diesel adds up.${o && !others().length ? " Mains is still off and no other set is running." : ""}`;
      RUNNING[a!.id] = undefined; break;
    }
    case "Set faulty": {
      if (RUNNING[a!.id]) ranMinutes = mins(RUNNING[a!.id]!, when);
      title = `${a!.name} reported faulty`; body = `${note ? `${note} ` : ""}Taken out of service.${o && !others().length ? " Mains is off and no other set is running." : ""}`;
      RUNNING[a!.id] = undefined; a!.status = "Offline"; break;
    }
  }
  const line: SwitchLine = { id: `SW-${++seq}`, at: when, event, assetId: a?.id, ranMinutes, note, by };
  LOG.unshift(line);
  const ev = ({ "Mains failed": "power.mainsOff", "Mains restored": "power.mainsOn", "Set started": "genset.started", "Set stopped": "genset.stopped", "Set faulty": "genset.fault" } as const)[event];
  notify(ev, { title, body: note && event !== "Set faulty" ? `${body} "${note}"` : body, link });
  return line;
};
