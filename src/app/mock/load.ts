// Clamp readings and building load, as FacilityFlow keeps it (services/load.ts, 0009): amps on three phases turned into
// kW, the phases' imbalance, and which set to start for the load the building is drawing. Supplies come from
// Maintenance Setup. Seeds use the business date, like the other plant files.
import { BUSINESS_DATE } from "../constants";
import { supplies, isIncomer, gensets, genset } from "./setup";
import { asset } from "./ppm";
import { notify } from "./notify";
import { now } from "./maintenance";
import { plantNow } from "./changeover";
import { expectedLph } from "./power";

export const IMBALANCE_WATCH_PCT = 10, IMBALANCE_ACT_PCT = 20;
export const FRESH_MINUTES = 240;                       // older than a shift's round is history, not "right now"
export const MIN_LOAD_PCT = 30, MAX_HEALTHY_PCT = 80, MAX_USABLE_PCT = 90;

const r2 = (n: number) => Math.round(n * 100) / 100;
export type Phases = { l1: number; l2?: number; l3?: number; neutral?: number };
export type Computed = { amps: number[]; avgAmps: number; maxAmps: number; imbalancePct: number | null; kva: number; kw: number };

/** kVA = √3 × V × I for three phases. Imbalance is the largest departure from the mean, as a share of the mean (NEMA). */
export const compute = (p: Phases, phases: 1 | 3, volts: number, pf: number, ctRatio = 1): Computed => {
  const amps = (phases === 3 ? [p.l1, p.l2, p.l3] : [p.l1]).filter((a): a is number => a != null && Number.isFinite(a)).map(a => r2(a * ctRatio));
  const avg = amps.reduce((s, a) => s + a, 0) / amps.length, max = Math.max(...amps), min = Math.min(...amps);
  const kva = (phases === 3 ? Math.sqrt(3) : 1) * volts * avg / 1000;
  return { amps, avgAmps: r2(avg), maxAmps: r2(max), imbalancePct: phases === 3 && amps.length === 3 && avg > 0 ? r2(Math.max(max - avg, avg - min) / avg * 100) : null, kva: r2(kva), kw: r2(kva * pf) };
};
const flagOf = (pct: number | null) => pct == null ? null : pct >= IMBALANCE_ACT_PCT ? "Act" as const : pct >= IMBALANCE_WATCH_PCT ? "Watch" as const : "OK" as const;

export type Clamp = Computed & { id: string; supplyId: string; at: Date; volts: number; pf: number; by: string; note?: string };
const at = (day: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h, m);
const seed = (id: string, supplyId: string, d: Date, p: Phases, by: string): Clamp => {
  const s = supplies().find(x => x.id === supplyId)!;
  return { ...compute(p, s.phases, s.volts, s.pf, s.ctRatio), id, supplyId, at: d, volts: s.volts, pf: s.pf, by };
};
// This morning's round on mains, and last night's reading on the set during the cut (now too old to count).
const CLAMPS: Clamp[] = [
  seed("CR-3", "PS-3", at(0, 7, 40), { l1: 118, l2: 96, l3: 84 }, "Emeka Obi"),
  seed("CR-2", "PS-1", at(0, 7, 30), { l1: 412, l2: 388, l3: 356 }, "Emeka Obi"),
  seed("CR-1", "PS-2", at(-1, 21, 0), { l1: 372, l2: 351, l3: 344 }, "Emeka Obi"),
];
let seq = 3;
export const clamps = () => CLAMPS;

export const recordClamp = (supplyId: string, p: Phases & { volts?: number; pf?: number; note?: string }, by: string): (Clamp & { flag: "OK" | "Watch" | "Act" | null; overBreaker: boolean }) | string => {
  const s = supplies().find(x => x.id === supplyId); if (!s) return "That supply does not exist.";
  if (!(p.l1 >= 0) || (s.phases === 3 && !(p.l2! >= 0 && p.l3! >= 0)))
    return s.phases === 3 ? `${s.name} is three-phase. Read all three phases: a load worked out from one is wrong by however far the board is out of balance.` : "Enter the amps.";
  const volts = p.volts ?? s.volts, pf = p.pf ?? s.pf;
  if (!(volts > 0) || !(pf > 0 && pf <= 1)) return "Volts must be more than zero and the power factor between 0 and 1.";
  const c: Clamp = { ...compute(p, s.phases, volts, pf, s.ctRatio), id: `CR-${++seq}`, supplyId, at: now(), volts, pf, by, note: p.note?.trim() || undefined };
  CLAMPS.unshift(c);
  const flag = flagOf(c.imbalancePct), overBreaker = s.breakerAmps != null && c.maxAmps > s.breakerAmps, link = { screen: "generator-diesel", label: "Power & Diesel" };
  if (flag === "Act") notify("power.load", { title: `${s.name} is ${c.imbalancePct}% out of balance`, body: `Phases read ${c.amps.join(" / ")} A. Move single-phase loads between phases before the heaviest one trips.`, link });
  if (overBreaker) notify("power.load", { title: `${s.name} is drawing above its breaker`, body: `${c.maxAmps} A on the heaviest phase against a ${s.breakerAmps} A breaker.`, link });
  return { ...c, flag, overBreaker };
};

export type Verdict = "Good" | "Light" | "Tight" | "Over" | "Unavailable";
/**
 * What the building is drawing now, from the latest reading on each incomer. A feeder never counts (its incomer already
 * does), a reading older than FRESH_MINUTES never counts, and only the live side of the changeover counts: the building
 * is fed from mains or from a set, never both. When the live side has nothing fresh, the other side is used and said so.
 */
export const loadNow = (t = now()) => {
  const mains = plantNow().mains, latest = (id: string) => CLAMPS.filter(c => c.supplyId === id).sort((a, b) => b.at.getTime() - a.at.getTime())[0];
  const rows = supplies().map(s => { const c = latest(s.id), age = c ? Math.round((t.getTime() - c.at.getTime()) / 60000) : undefined; return { s, c, age, fresh: age != null && age <= FRESH_MINUTES && c!.kw > 0 }; });
  const side = (k: "Utility" | "Generator") => rows.some(r => r.s.kind === k && isIncomer(r.s) && r.fresh);
  const preferred = mains === "off" ? "Generator" : "Utility", other = preferred === "Utility" ? "Generator" : "Utility";
  const feeding = side(preferred) ? preferred : side(other) ? other : preferred, fellBack = feeding !== preferred;
  const sources = rows.map(({ s, c, age, fresh }) => {
    const counted = isIncomer(s) && fresh && s.kind === feeding;
    const why = !isIncomer(s) ? "Downstream of an incomer: shown, never added to the total" : age == null ? "Never clamped" : age > FRESH_MINUTES ? `Read ${Math.round(age / 60)} h ago: too old to count`
      : !fresh ? "Reading zero: not carrying load" : counted ? "Counted in the building total" : s.kind === "Utility" ? "Mains is off: the building is on a generator" : "Mains is on: this set is not carrying the building";
    return { id: s.id, name: s.name, kind: s.kind, reading: c, ageMinutes: age, counted, why, flag: c && fresh ? flagOf(c.imbalancePct) : null, breakerPct: c && s.breakerAmps ? Math.round(c.maxAmps / s.breakerAmps * 100) : null };
  });
  const counted = sources.filter(x => x.counted);
  const totalKw = counted.length ? r2(counted.reduce((n, x) => n + x.reading!.kw, 0)) : null, totalKva = counted.length ? r2(counted.reduce((n, x) => n + x.reading!.kva, 0)) : null;
  const options = gensets().map(g => {
    const a = asset(g.assetId), pct = totalKva != null ? Math.round(totalKva / g.kva * 1000) / 10 : null;
    const verdict: Verdict = a?.status === "Offline" ? "Unavailable" : pct == null ? "Good" : pct > MAX_USABLE_PCT ? "Over" : pct > MAX_HEALTHY_PCT ? "Tight" : pct < MIN_LOAD_PCT ? "Light" : "Good";
    const note = verdict === "Unavailable" ? "Marked offline: not a set to plan around." : pct == null ? `Rated ${g.kva} kVA. No current load reading to judge it against.`
      : verdict === "Over" ? `Would sit at ${pct}% of rating. One lift or chiller starting takes it over.` : verdict === "Tight" ? `${pct}% of rating. It carries it, with nothing left for a starting load.`
      : verdict === "Light" ? `Only ${pct}% of rating. Running a diesel this light glazes the bores; the repair costs more than the diesel saved.` : `${pct}% of rating: the band a diesel runs best in.`;
    return { assetId: g.assetId, name: a?.name ?? g.assetId, kva: g.kva, pct, verdict, lph: totalKw != null && verdict !== "Unavailable" ? expectedLph(genset(g.assetId)!, totalKw) : null, note };
  }).sort((a, b) => a.kva - b.kva);
  // Smallest set that carries the load without running cold: every spare kVA is diesel burned to make heat.
  const pick = (["Good", "Tight", "Light"] as Verdict[]).map(v => options.find(o => o.verdict === v)).find(Boolean);
  const advice = totalKva == null ? "No current clamp reading on any incomer. Take one and the load and the set to start appear here."
    : (!pick ? options.some(o => o.verdict === "Over") ? "No single set carries this load. Shed non-essential load before starting one." : "No generator is available: every set is offline."
      : pick.verdict === "Good" ? `${plantNow().sets.find(x => x.assetId === pick.assetId)?.runningSince ? `${pick.name} is the right set for this load` : `Start ${pick.name}`}: ${pick.pct}% of rating${pick.lph != null ? `, about ${pick.lph} L/h` : ""}.`
      : pick.verdict === "Tight" ? `${pick.name} is the only set that carries this, at ${pick.pct}% of rating. Shed something before a large motor starts.`
      : `Every available set is oversized for this load. ${pick.name} is the smallest, at ${pick.pct}%: keep the run short.`)
      + (fellBack ? feeding === "Generator" ? " Mains is recorded on, but only a generator has a current reading, so the load is taken from there." : " No generator has a current reading, so the load is taken from the mains incomer." : "");
  return { mains, totalKw, totalKva, sources, options, recommended: pick?.assetId ?? null, advice };
};
