// Maintenance setup, as FacilityFlow's admin keeps it (admin/Settings, admin/Supplies): the numbers the department
// is judged by and the plant it runs. Demo values; Properties & Settings will show the same for the whole property.
// Seeds use no other mock file: mock/maintenance.ts imports this one.

export type MoneySettings = { fuelTolerancePct: number; gridTariff: number; supervisorLimit: number; labourRate: number };
const MONEY: MoneySettings = { fuelTolerancePct: 3, gridTariff: 225, supervisorLimit: 50000, labourRate: 5000 };
export const money = () => MONEY;

export type GensetProfile = { assetId: string; kva: number; burnAt: { 25: number; 50: number; 75: number; 100: number }; serviceHours: number;
  highBurnPct: number; coolantMin: number; coolantMax: number; oilMin: number; batteryMin: number; nominalVolts: number; nominalHz: number; dayTankMin?: number };
// Limits are editable per set: a 60 Hz plant or an air-cooled set would otherwise be told it is in trouble every day.
const GENSETS: GensetProfile[] = [
  { assetId: "AST-004", kva: 500, burnAt: { 25: 35, 50: 58, 75: 82, 100: 108 }, serviceHours: 250, highBurnPct: 10,
    coolantMin: 70, coolantMax: 95, oilMin: 2, batteryMin: 24, nominalVolts: 400, nominalHz: 50, dayTankMin: 200 },
];
export const gensets = () => GENSETS;
export const genset = (assetId: string) => GENSETS.find(g => g.assetId === assetId);

export type TankKind = "Bulk" | "Day tank" | "Drum";
export type Tank = { id: string; name: string; kind: TankKind; capacity: number; minimum: number; chart?: [number, number][] };
const TANKS: Tank[] = [
  { id: "TK-1", name: "Bulk tank", kind: "Bulk", capacity: 10000, minimum: 3000,
    chart: [[0, 0], [200, 680], [400, 1850], [600, 3300], [800, 4900], [1000, 6500], [1200, 8000], [1400, 9250], [1600, 10000]] },
  { id: "TK-2", name: "Generator day tank", kind: "Day tank", capacity: 1000, minimum: 200 },
];
export const tanks = () => TANKS;

export type SupplyKind = "Utility" | "Generator" | "Feeder";
export type Supply = { id: string; name: string; kind: SupplyKind; gensetAssetId?: string; phases: 1 | 3; volts: number; pf: number; ctRatio: number; breakerAmps?: number };
// Only an incomer counts toward the building total; a feeder summed with the incomer that feeds it counts twice.
export const isIncomer = (s: Supply) => s.kind !== "Feeder";
const SUPPLIES: Supply[] = [
  { id: "PS-1", name: "Utility incomer", kind: "Utility", phases: 3, volts: 415, pf: 0.8, ctRatio: 1, breakerAmps: 800 },
  { id: "PS-2", name: "Main generator output", kind: "Generator", gensetAssetId: "AST-004", phases: 3, volts: 415, pf: 0.8, ctRatio: 1, breakerAmps: 800 },
  { id: "PS-3", name: "Kitchen feeder", kind: "Feeder", phases: 3, volts: 415, pf: 0.8, ctRatio: 1, breakerAmps: 160 },
];
export const supplies = () => SUPPLIES;

const positive = (n: number) => Number.isFinite(n) && n > 0;
const nextId = (prefix: string, list: { id: string }[]) => `${prefix}-${list.length + 1}`;

export const setMoney = (m: MoneySettings): string | null => {
  if (!(m.fuelTolerancePct > 0 && m.fuelTolerancePct <= 20)) return "Fuel tolerance must be between 0 and 20 percent.";
  if (![m.gridTariff, m.supervisorLimit, m.labourRate].every(positive)) return "Tariff, limit and labour rate must be more than zero.";
  Object.assign(MONEY, m); return null;
};

export const saveGenset = (g: GensetProfile): string | null => {
  if (!positive(g.kva)) return "Enter the set's kVA rating.";
  const b = [g.burnAt[25], g.burnAt[50], g.burnAt[75], g.burnAt[100]];
  if (!b.every(positive)) return "Enter the expected litres per hour at each load.";
  if (b.some((v, i) => i && v < b[i - 1])) return "Burn must not fall as the load rises.";
  if (!(g.coolantMin < g.coolantMax)) return "The coolant minimum must be below the maximum.";
  if (![g.serviceHours, g.highBurnPct, g.oilMin, g.batteryMin, g.nominalVolts, g.nominalHz].every(positive)) return "Every limit must be more than zero.";
  const i = GENSETS.findIndex(x => x.assetId === g.assetId);
  if (i >= 0) GENSETS[i] = g; else GENSETS.push(g);
  return null;
};

/** "mm=litres" per line. The chart must rise: a deeper dip is never fewer litres. */
export const parseChart = (text: string): [number, number][] | string => {
  const rows = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (!rows.length) return [];
  const pts: [number, number][] = [];
  for (const r of rows) {
    const m = r.match(/^(\d+(?:\.\d+)?)\s*[=,: ]\s*(\d+(?:\.\d+)?)$/);
    if (!m) return `"${r}" is not millimetres = litres.`;
    pts.push([Number(m[1]), Number(m[2])]);
  }
  pts.sort((a, b) => a[0] - b[0]);
  if (pts.some((p, i) => i && (p[0] === pts[i - 1][0] || p[1] < pts[i - 1][1]))) return "Each depth once, and litres must rise with depth.";
  return pts;
};

export const addTank = (t: Omit<Tank, "id">): string | null => {
  if (!t.name.trim()) return "Name the tank.";
  if (TANKS.some(x => x.name.toLowerCase() === t.name.trim().toLowerCase())) return "There is already a tank with that name.";
  if (!positive(t.capacity)) return "Enter the capacity in litres.";
  if (!(t.minimum >= 0 && t.minimum < t.capacity)) return "The minimum must be below the capacity.";
  if (t.chart?.length && t.chart[t.chart.length - 1][1] > t.capacity * 1.05) return "The chart goes past the tank's capacity.";
  TANKS.push({ ...t, name: t.name.trim(), id: nextId("TK", TANKS) });
  return null;
};

export const addSupply = (s: Omit<Supply, "id">): string | null => {
  if (!s.name.trim()) return "Name the supply.";
  if (SUPPLIES.some(x => x.name.toLowerCase() === s.name.trim().toLowerCase())) return "There is already a supply with that name.";
  if (!positive(s.volts) || !(s.pf > 0 && s.pf <= 1) || !positive(s.ctRatio)) return "Volts and CT ratio must be more than zero; power factor between 0 and 1.";
  if (s.kind === "Generator" && !s.gensetAssetId) return "Choose which generator this is.";
  SUPPLIES.push({ ...s, name: s.name.trim(), id: nextId("PS", SUPPLIES) });
  return null;
};
