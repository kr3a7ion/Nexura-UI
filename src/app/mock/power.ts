// Diesel, as FacilityFlow keeps it (services/fuel.ts, 0006): dips read through the tank's chart, deliveries signed by
// two people, fuel issued to the sets, generator runs judged against the expected burn, and a reconciliation that
// says where the diesel went. Tanks, sets, tolerance and tariff come from Maintenance Setup (mock/setup.ts).
// Seeds call nothing from other mock files: mock/handover.ts reads this file while maintenance is still loading.
import { BUSINESS_DATE } from "../constants";
import { tanks, genset, money, type Tank, type GensetProfile } from "./setup";
import { notify } from "./notify";
import { holdersOf } from "./roster";
import { isEmployed } from "./staff";
import { asset } from "./ppm";
import { addWorkOrder, now } from "./maintenance";

const r2 = (n: number) => Math.round(n * 100) / 100;
const at = (day: number, h: number, m = 0) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h, m);
const tank = (id: string) => tanks().find(t => t.id === id);

/** A horizontal cylinder is not linear: millimetres to litres goes through the maker's chart, point to point. */
export const litresFromDip = (chart: [number, number][] | undefined, mm: number): number | string => {
  if (!chart || chart.length < 2) return "This tank has no dip chart, so a reading in millimetres cannot be turned into litres. Add the chart in Maintenance Setup, or enter litres.";
  const p = [...chart].sort((a, b) => a[0] - b[0]);
  if (mm <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) if (mm <= p[i][0]) return r2(p[i - 1][1] + (mm - p[i - 1][0]) / (p[i][0] - p[i - 1][0]) * (p[i][1] - p[i - 1][1]));
  return p[p.length - 1][1];
};

export type Dip = { id: string; tankId: string; at: Date; litres: number; mm?: number; by: string; note?: string };
export type Delivery = { id: string; tankId: string; at: Date; vendor: string; waybill: string; invoicedL: number; dipBeforeL: number; dipAfterL: number;
  receivedL: number; varianceL: number; variancePct: number; flagged: boolean; unitPrice: number; receivedBy: string; witnessedBy: string };
export type Issue = { id: string; tankId: string; at: Date; litres: number; toAssetId?: string; toTankId?: string; by: string };
export type RunReason = "Power cut" | "Weekly test" | "Load test" | "Maintenance";
export type Run = { id: string; assetId: string; at: Date; reason: RunReason; hoursStart: number; hoursEnd: number; runHours: number; avgLoadKw?: number;
  fuelUsedL?: number; actualLph?: number; expectedLph?: number; deviationPct?: number; kwh?: number; by: string; raisedJob?: string };
export type Reconciliation = { tankId: string; from: Date; to: Date; openingL: number; deliveriesL: number; issuesL: number; computedL: number; dippedL: number;
  varianceL: number; variancePct: number; tolerancePct: number; flagged: boolean };
export type SavedReconciliation = Reconciliation & { id: string; savedBy: string; explanation?: string };

// June so far: the bulk tank fed the generator's day tank three times, one delivery came in short, and the
// bulk tank is down about 350 L more than the book explains. The day tank balances: what went in was burned.
const DIPS: Dip[] = [
  { id: "DP-1", tankId: "TK-1", at: at(-23, 7), litres: 4020, mm: 690, by: "Emeka Obi" },
  { id: "DP-2", tankId: "TK-2", at: at(-23, 7), litres: 620, by: "Emeka Obi" },
  { id: "DP-3", tankId: "TK-1", at: at(0, 7), litres: 6620, mm: 1016, by: "Emeka Obi" },
  { id: "DP-4", tankId: "TK-2", at: at(0, 7), litres: 410, by: "Emeka Obi" },
];
const DELIVERIES: Delivery[] = [
  { id: "FD-0001", tankId: "TK-1", at: at(-14, 10), vendor: "Emadeb Energy", waybill: "EMD-55821", invoicedL: 5000, dipBeforeL: 3420, dipAfterL: 8200,
    receivedL: 4780, varianceL: -220, variancePct: -4.4, flagged: true, unitPrice: 1180, receivedBy: "Emeka Obi", witnessedBy: "Yusuf Garba" },
];
const ISSUES: Issue[] = [
  { id: "FI-6", tankId: "TK-2", at: at(-1, 23), litres: 792, toAssetId: "AST-004", by: "Emeka Obi" },
  { id: "FI-5", tankId: "TK-1", at: at(-4, 8), litres: 600, toTankId: "TK-2", by: "Emeka Obi" },
  { id: "FI-4", tankId: "TK-2", at: at(-3, 23), litres: 780, toAssetId: "AST-004", by: "Chidi Ike" },
  { id: "FI-3", tankId: "TK-2", at: at(-6, 23), litres: 468, toAssetId: "AST-004", by: "Emeka Obi" },
  { id: "FI-2", tankId: "TK-1", at: at(-12, 8), litres: 630, toTankId: "TK-2", by: "Chidi Ike" },
  { id: "FI-1", tankId: "TK-1", at: at(-20, 8), litres: 600, toTankId: "TK-2", by: "Emeka Obi" },
];
const RUNS: Run[] = [
  { id: "GR-3", assetId: "AST-004", at: at(-1, 20), reason: "Power cut", hoursStart: 3400, hoursEnd: 3412, runHours: 12, avgLoadKw: 200, fuelUsedL: 792, actualLph: 66, expectedLph: 58, deviationPct: 13.79, kwh: 2400, by: "Emeka Obi" },
  { id: "GR-2", assetId: "AST-004", at: at(-3, 18), reason: "Power cut", hoursStart: 3388, hoursEnd: 3400, runHours: 12, avgLoadKw: 200, fuelUsedL: 780, actualLph: 65, expectedLph: 58, deviationPct: 12.07, kwh: 2400, by: "Chidi Ike" },
  { id: "GR-1", assetId: "AST-004", at: at(-6, 19), reason: "Power cut", hoursStart: 3380, hoursEnd: 3388, runHours: 8, avgLoadKw: 200, fuelUsedL: 468, actualLph: 58.5, expectedLph: 58, deviationPct: 0.86, kwh: 1600, by: "Emeka Obi" },
];
const STREAK: Record<string, number> = { "AST-004": 2 }; // two high-burn runs in a row so far
const SAVED: SavedReconciliation[] = [];
const LEVEL: Record<string, number> = { "TK-1": 6620, "TK-2": 410 };
let seq = 10;
const nextId = (p: string) => `${p}-${String(++seq).padStart(4, "0")}`;

export const dips = () => DIPS;
export const deliveries = () => DELIVERIES;
export const issues = () => ISSUES;
export const runs = () => RUNS;
export const reconciliations = () => SAVED;
export const levelOf = (tankId: string) => LEVEL[tankId] ?? 0;
export const highBurnStreak = (assetId: string) => STREAK[assetId] ?? 0;

export const logDip = (tankId: string, input: { litres?: number; mm?: number; note?: string }, by: string): { litres: number; belowMinimum: boolean } | string => {
  const t = tank(tankId); if (!t) return "That tank does not exist.";
  let litres = input.litres;
  if (litres == null) {
    if (input.mm == null) return "Give a dip in millimetres or a level in litres.";
    const l = litresFromDip(t.chart, input.mm); if (typeof l === "string") return l; litres = l;
  }
  if (!(litres >= 0) || litres > t.capacity * 1.02) return `${Math.round(litres)} L is more than a ${t.capacity.toLocaleString()} L tank holds. Check the reading.`;
  DIPS.push({ id: nextId("DP"), tankId, at: now(), litres, mm: input.mm, by, note: input.note?.trim() || undefined });
  LEVEL[tankId] = litres;
  const belowMinimum = litres < t.minimum;
  if (belowMinimum) notify("fuel.low", { title: `${t.name} below its minimum`, body: `${Math.round(litres).toLocaleString()} L against a minimum of ${t.minimum.toLocaleString()} L. Order diesel.`, link: { screen: "generator-diesel", label: "Power & Diesel" } });
  return { litres, belowMinimum };
};

/** Two signatures: whoever receives a delivery cannot also witness it. Received is what the dips say, not the invoice. */
export const recordDelivery = (d: { tankId: string; vendor: string; waybill: string; invoicedL: number; dipBeforeL: number; dipAfterL: number; unitPrice: number; witnessedBy: string }, by: string): Delivery | string => {
  const t = tank(d.tankId); if (!t) return "That tank does not exist.";
  if (!d.witnessedBy) return "A second person must witness the delivery.";
  if (d.witnessedBy === by) return "The person who receives a delivery cannot also witness it. Get a second person.";
  if (!isEmployed(d.witnessedBy)) return "That witness is not on the staff list.";
  if (!(d.invoicedL > 0)) return "Enter the litres on the invoice.";
  if (d.dipAfterL < d.dipBeforeL) return "The dip after the discharge cannot be lower than the dip before it.";
  if (d.dipAfterL > t.capacity * 1.02) return `A closing dip of ${Math.round(d.dipAfterL).toLocaleString()} L is more than the tank's ${t.capacity.toLocaleString()} L.`;
  const receivedL = r2(d.dipAfterL - d.dipBeforeL), varianceL = r2(receivedL - d.invoicedL), variancePct = r2(varianceL / d.invoicedL * 100);
  const tol = money().fuelTolerancePct;
  const row: Delivery = { ...d, id: nextId("FD"), at: now(), receivedL, varianceL, variancePct, flagged: Math.abs(variancePct) > tol, receivedBy: by };
  DELIVERIES.unshift(row);
  LEVEL[d.tankId] = d.dipAfterL;
  const link = { screen: "generator-diesel", label: "Power & Diesel" };
  notify("fuel.delivered", { title: `Diesel delivered: ${Math.round(receivedL).toLocaleString()} L into ${t.name}`, body: `${row.id}, invoiced ${d.invoicedL.toLocaleString()} L.`, link });
  if (row.flagged) notify("fuel.variance", { title: `Delivery ${row.id} is ${varianceL > 0 ? "over" : "short"} by ${Math.abs(varianceL).toLocaleString()} L`,
    body: `Invoiced ${d.invoicedL.toLocaleString()} L, received ${receivedL.toLocaleString()} L (${variancePct}%). Tolerance is ${tol}%.`, people: holdersOf("Supervisor"), link });
  return row;
};

/** Fuel pumped from a tank into a set or another tank. */
export const issueFuel = (i: { tankId: string; litres: number; toAssetId?: string; toTankId?: string }, by: string): Issue | string => {
  if (!tank(i.tankId)) return "That tank does not exist.";
  if (!(i.litres > 0)) return "Enter how many litres.";
  if (!i.toAssetId && !i.toTankId) return "Say which generator or tank the fuel went to.";
  if (i.toTankId === i.tankId) return "Fuel cannot go into the tank it came out of.";
  if (i.litres > levelOf(i.tankId) + 1) return `${tank(i.tankId)!.name} only holds about ${Math.round(levelOf(i.tankId)).toLocaleString()} L by its last reading.`;
  const row: Issue = { ...i, id: nextId("FI"), at: now(), by };
  ISSUES.unshift(row);
  LEVEL[i.tankId] = r2(levelOf(i.tankId) - i.litres);
  if (i.toTankId) LEVEL[i.toTankId] = r2(levelOf(i.toTankId) + i.litres);
  return row;
};

/** Expected litres an hour for the load carried, between the profile's points (kVA at 0.8 power factor = usable kW). */
export const expectedLph = (g: GensetProfile, avgLoadKw?: number): number => {
  const pts: [number, number][] = [[0.25, g.burnAt[25]], [0.5, g.burnAt[50]], [0.75, g.burnAt[75]], [1, g.burnAt[100]]];
  if (avgLoadKw == null) return g.burnAt[75];
  const load = Math.max(0, Math.min(1, avgLoadKw / (g.kva * 0.8)));
  if (load <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (load <= pts[i][0]) return r2(pts[i - 1][1] + (load - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]) * (pts[i][1] - pts[i - 1][1]));
  return pts[3][1];
};

/** A run moves the set's hour meter. Rising burn at the same load is mechanical: three runs over the threshold raise a job. */
export const recordRun = (r: { assetId: string; reason: RunReason; hoursStart: number; hoursEnd: number; avgLoadKw?: number; fuelStartL?: number; fuelEndL?: number; topupL?: number; kwh?: number }, by: string): Run | string => {
  const a = asset(r.assetId), g = genset(r.assetId);
  if (!a?.meter || !g) return "Choose a generator set up in Maintenance Setup.";
  if (!(r.hoursEnd >= r.hoursStart)) return "The hour meter at the end is lower than at the start. Check the readings.";
  if (r.hoursEnd < a.meter.value) return `The set's meter already reads ${a.meter.value.toLocaleString()} hours; a run cannot end before that.`;
  const runHours = r2(r.hoursEnd - r.hoursStart);
  const fuelUsedL = r.fuelStartL != null && r.fuelEndL != null ? r2(r.fuelStartL + (r.topupL ?? 0) - r.fuelEndL) : undefined;
  if (fuelUsedL != null && fuelUsedL < 0) return "More fuel at the end than at the start plus any top-up. Check the readings.";
  const actualLph = fuelUsedL != null && runHours > 0 ? r2(fuelUsedL / runHours) : undefined;
  const expected = expectedLph(g, r.avgLoadKw);
  const deviationPct = actualLph != null ? r2((actualLph - expected) / expected * 100) : undefined;
  const row: Run = { id: nextId("GR"), assetId: r.assetId, at: now(), reason: r.reason, hoursStart: r.hoursStart, hoursEnd: r.hoursEnd, runHours,
    avgLoadKw: r.avgLoadKw, fuelUsedL, actualLph, expectedLph: expected, deviationPct, kwh: r.kwh, by };
  RUNS.unshift(row);
  a.meter.value = r.hoursEnd; // the planned 250-hour service comes due from this on the next check
  if (deviationPct != null) {
    STREAK[r.assetId] = deviationPct > g.highBurnPct ? highBurnStreak(r.assetId) + 1 : 0;
    if (STREAK[r.assetId] >= 3) {
      const w = addWorkOrder({ title: `${a.name}: fuel burn ${deviationPct}% above expected`, location: a.location, cat: "Mechanical", priority: "P2", reportedBy: "Diesel book", asset: a.id,
        desc: `Three runs in a row above the ${g.highBurnPct}% threshold (latest ${actualLph} L/h against ${expected} L/h expected). Check injectors, air filter and fuel filter before the set is needed in a power cut.` });
      row.raisedJob = w.id; STREAK[r.assetId] = 0;
    }
  }
  return row;
};

/** Opening dip + received − issued should equal the closing dip. Judged against what moved, not what is left. */
export const reconcile = (tankId: string, from: Date, to: Date): Reconciliation | string => {
  const t = tank(tankId); if (!t) return "That tank does not exist.";
  const last = (d: Date) => DIPS.filter(x => x.tankId === tankId && x.at <= d).sort((a, b) => b.at.getTime() - a.at.getTime())[0];
  // Opening is the last dip at or before the start; a period that starts before the first dip opens on that first dip.
  const open = last(from) ?? DIPS.filter(x => x.tankId === tankId && x.at > from && x.at <= to).sort((a, b) => a.at.getTime() - b.at.getTime())[0], close = last(to);
  if (!open || !close || open === close) return "A reconciliation needs a dip at the start and another at the end of the period.";
  const inRange = (d: Date) => d > open.at && d <= to;
  const deliveriesL = r2(DELIVERIES.filter(d => d.tankId === tankId && inRange(d.at)).reduce((n, d) => n + d.receivedL, 0)
    + ISSUES.filter(i => i.toTankId === tankId && inRange(i.at)).reduce((n, i) => n + i.litres, 0));
  const issuesL = r2(ISSUES.filter(i => i.tankId === tankId && inRange(i.at)).reduce((n, i) => n + i.litres, 0));
  const computedL = r2(open.litres + deliveriesL - issuesL), varianceL = r2(close.litres - computedL);
  // With nothing recorded as moving, compare against the opening stock: what actually left.
  const moved = deliveriesL + issuesL, base = moved > 1 ? moved : open.litres;
  const variancePct = base > 0 ? r2(varianceL / base * 100) : 0, tolerancePct = money().fuelTolerancePct;
  return { tankId, from: open.at, to: close.at, openingL: open.litres, deliveriesL, issuesL, computedL, dippedL: close.litres, varianceL, variancePct, tolerancePct, flagged: Math.abs(variancePct) > tolerancePct };
};

/** A period that does not balance is saved only with a written explanation of where the diesel went. */
export const saveReconciliation = (r: Reconciliation, by: string, explanation = ""): string | null => {
  if (r.flagged && explanation.trim().length < 10) return `${r.varianceL.toLocaleString()} L is unaccounted for. Write where it went (a leak, a missed issue, theft) before saving.`;
  SAVED.unshift({ ...r, id: nextId("RC"), savedBy: by, explanation: explanation.trim() || undefined });
  if (r.flagged) notify("fuel.variance", { title: `Diesel short by ${Math.abs(r.varianceL).toLocaleString()} L: ${tank(r.tankId)!.name}`, body: `${r.variancePct}% of what moved. Explained by ${by}: ${explanation.trim()}`, link: { screen: "generator-diesel", label: "Power & Diesel" } });
  return null;
};

/** Diesel cost per kWh generated, at the last delivered price, against the grid tariff. The number to take upstairs. */
export const costPerKwh = (from: Date, to: Date) => {
  const rs = RUNS.filter(r => r.at >= from && r.at <= to && r.fuelUsedL != null && r.kwh);
  const litres = rs.reduce((n, r) => n + r.fuelUsedL!, 0), kwh = rs.reduce((n, r) => n + r.kwh!, 0);
  const price = DELIVERIES.find(d => d.unitPrice > 0)?.unitPrice ?? 0;
  return { litres: r2(litres), kwh, cost: Math.round(litres * price), perKwh: kwh ? Math.round(litres * price / kwh) : null, grid: money().gridTariff };
};

export const tankLine = (t: Tank) => `${t.name}: ${Math.round(levelOf(t.id)).toLocaleString()} of ${t.capacity.toLocaleString()} L${levelOf(t.id) < t.minimum ? " (below minimum)" : ""}`;
