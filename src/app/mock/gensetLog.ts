// The generator logbook, as FacilityFlow keeps it (services/gensetLog.ts, 0010): readings taken on each set every shift,
// checked against that set's own limits as they are saved, with the verdict stored so a month of history keeps saying
// what it said at the time. A blank box means the gauge could not be read safely, so it is never judged.
// Entries are never changed: a wrong one is followed by a new one explained in its remarks.
// Seeds use the business date: mock/handover.ts reads this file while mock/maintenance.ts is still loading.
import { BUSINESS_DATE } from "../constants";
import { genset, gensets, type GensetProfile } from "./setup";
import { asset } from "./ppm";
import { notify } from "./notify";
import { holdersOf, patterns } from "./roster";
import { now } from "./maintenance";

export type Reading = { state: "Running" | "Stopped"; hoursMeter?: number; dayTankL?: number; coolantC?: number; oilBar?: number; batteryV?: number;
  volts?: [number?, number?, number?]; hz?: number; loadKw?: number; remarks?: string };
export type Finding = { field: string; severity: "Watch" | "Act"; says: string };
export type LogEntry = Reading & { id: string; assetId: string; at: Date; shift: string; findings: Finding[]; by: string };

const VOLT_TOLERANCE_PCT = 10; // this far from nominal is a fault, not drift
const HZ_TOLERANCE = 1.5;      // governed speed: a whole hertz out is the governor, not the load
const LOAD_WARN_PCT = 80;

/** Only what was entered is judged; a missing number never becomes a finding. */
export const assess = (r: Reading, g: GensetProfile | undefined): Finding[] => {
  const out: Finding[] = [], running = r.state === "Running";
  if (!g) return out;
  if (r.coolantC != null && running) {
    if (r.coolantC >= g.coolantMax) out.push({ field: "Coolant", severity: "Act", says: `Running at ${r.coolantC} °C against a limit of ${g.coolantMax} °C. Check the radiator, the belt and the coolant level before it runs again under load.` });
    else if (r.coolantC >= g.coolantMax - 5) out.push({ field: "Coolant", severity: "Watch", says: `${r.coolantC} °C is close to the ${g.coolantMax} °C limit. Watch it on the next round.` });
    else if (r.coolantC < g.coolantMin) out.push({ field: "Coolant", severity: "Watch", says: `${r.coolantC} °C is cold for a loaded set. A thermostat stuck open wastes fuel.` });
  }
  if (r.oilBar != null && running && r.oilBar < g.oilMin) out.push({ field: "Oil pressure", severity: "Act", says: `Oil pressure ${r.oilBar} bar, below the ${g.oilMin} bar minimum. Stop the set rather than run it.` });
  if (r.batteryV != null && r.batteryV < g.batteryMin) out.push({ field: "Battery", severity: running ? "Act" : "Watch",
    says: running ? `${r.batteryV} V while running means the alternator is not charging. The set will not start next time.` : `${r.batteryV} V at rest is low. A set that will not crank in a power cut is no set at all.` });
  const v = (r.volts ?? []).filter((x): x is number => x != null);
  if (v.length && running) {
    const worst = v.find(x => Math.abs(x - g.nominalVolts) > g.nominalVolts * VOLT_TOLERANCE_PCT / 100);
    if (worst != null) out.push({ field: "Volts", severity: "Act", says: `${worst} V against a nominal ${g.nominalVolts} V. More than ${VOLT_TOLERANCE_PCT}% out damages motors and electronics across the building.` });
    if (v.length === 3 && Math.max(...v) - Math.min(...v) > g.nominalVolts * 0.05)
      out.push({ field: "Volts", severity: "Watch", says: `The three phases differ by ${Math.round(Math.max(...v) - Math.min(...v))} V. One phase is loaded far harder than the others: worth a clamp reading.` });
  }
  if (r.hz != null && running && Math.abs(r.hz - g.nominalHz) > HZ_TOLERANCE) out.push({ field: "Frequency", severity: "Act", says: `${r.hz} Hz against ${g.nominalHz} Hz. The governor is not holding speed.` });
  if (r.loadKw != null && g.kva > 0) {
    const pct = Math.round(r.loadKw / (g.kva * 0.8) * 100); // kW against a kVA plate at the usual 0.8 power factor
    if (pct > 100) out.push({ field: "Load", severity: "Act", says: `${r.loadKw} kW is beyond what this set is rated for. Shed load now.` });
    else if (pct > LOAD_WARN_PCT) out.push({ field: "Load", severity: "Watch", says: `${r.loadKw} kW is ${pct}% of rating. Nothing left for a lift or a chiller starting.` });
  }
  if (r.dayTankL != null && g.dayTankMin != null && r.dayTankL < g.dayTankMin) out.push({ field: "Day tank", severity: "Act", says: `Day tank at ${r.dayTankL} L, below the ${g.dayTankMin} L minimum. Fill it before the next outage, not during one.` });
  return out;
};

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
/** The shift a moment falls in, and when that shift began (a night shift that crosses midnight began the day before). */
export const shiftAt = (d: Date): { name: string; start: Date; end: Date } => {
  const m = d.getHours() * 60 + d.getMinutes();
  for (const p of patterns()) {
    const s = toMin(p.start), e = toMin(p.end), crosses = e <= s;
    if (crosses ? m >= s || m < e : m >= s && m < e) {
      const start = new Date(d); start.setHours(0, s, 0, 0); if (crosses && m < e) start.setDate(start.getDate() - 1);
      const end = new Date(start); end.setMinutes(end.getMinutes() + ((e - s + 1440) % 1440 || 1440));
      return { name: p.name, start, end };
    }
  }
  const start = new Date(d); start.setHours(0, 0, 0, 0); const end = new Date(start); end.setDate(end.getDate() + 1);
  return { name: "Day", start, end };
};

const at = (day: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h, m);
const seed = (id: string, d: Date, shift: string, r: Reading, by: string): LogEntry => ({ ...r, id, assetId: "AST-004", at: d, shift, by, findings: assess(r, genset("AST-004")) });
// Last night's cut: two rounds on the running set, the second running warm.
const LOG: LogEntry[] = [
  seed("GL-3", at(0, 4, 30), "Night", { state: "Running", hoursMeter: 3408, dayTankL: 610, coolantC: 91, oilBar: 3.4, batteryV: 27.6, volts: [402, 398, 405], hz: 50.1, loadKw: 205 }, "Emeka Obi"),
  seed("GL-2", at(-1, 23, 40), "Night", { state: "Running", hoursMeter: 3404, dayTankL: 860, coolantC: 84, oilBar: 3.6, batteryV: 27.8, volts: [404, 401, 406], hz: 50, loadKw: 198 }, "Emeka Obi"),
  seed("GL-1", at(-1, 16, 10), "Afternoon", { state: "Stopped", hoursMeter: 3400, dayTankL: 820, batteryV: 25.9, remarks: "Walk-round, no leaks." }, "Chidi Ike"),
];
let seq = 3;
export const gensetLog = () => LOG;

export const logGenset = (assetId: string, r: Reading, by: string): LogEntry | string => {
  const a = asset(assetId), g = genset(assetId);
  if (!a || !g) return "Choose a generator set up in Maintenance Setup.";
  if (!by) return "A log entry has to be recorded by a named person."; // "who read this gauge, and when" is the first question asked
  const t = now(), findings = assess(r, g);
  // A meter that went backwards is a typo or a replaced meter: say so rather than store a negative run quietly.
  const last = LOG.find(e => e.assetId === assetId && e.hoursMeter != null);
  if (r.hoursMeter != null && last && r.hoursMeter < last.hoursMeter!)
    findings.push({ field: "Hour meter", severity: "Watch", says: `The hour meter reads ${r.hoursMeter}, lower than the ${last.hoursMeter} logged before. Check the reading, or say in the remarks that the meter was changed.` });
  const e: LogEntry = { ...r, remarks: r.remarks?.trim() || undefined, id: `GL-${++seq}`, assetId, at: t, shift: shiftAt(t).name, findings, by };
  LOG.unshift(e);
  if (r.hoursMeter != null && a.meter && r.hoursMeter > a.meter.value) a.meter.value = r.hoursMeter; // keeps the planned service and the book in step
  const act = findings.filter(f => f.severity === "Act");
  if (act.length) notify("genset.outOfRange", { title: `${a.name} logged out of range`, body: act.map(f => f.says).join(" "), people: holdersOf("Supervisor"), link: { screen: "generator-diesel", label: "Power & Diesel" } });
  return e;
};

/** The supervisor's end-of-shift question: which sets were logged this shift, and the worst any entry said. */
export const shiftLogStatus = (d = now()) => {
  const s = shiftAt(d);
  return { shift: s.name, sets: gensets().map(g => {
    const es = LOG.filter(e => e.assetId === g.assetId && e.at >= s.start && e.at < s.end);
    const worst = es.some(e => e.findings.some(f => f.severity === "Act")) ? "Act" : es.some(e => e.findings.length) ? "Watch" : "OK";
    return { assetId: g.assetId, name: asset(g.assetId)?.name ?? g.assetId, entries: es.length, lastAt: es[0]?.at, worst: worst as "OK" | "Watch" | "Act" };
  }) };
};
