// Utility meters, as FacilityFlow stores them (routes/safety.ts, 0008; it has no screen for them). Shown on Power & Diesel.
// A reading never goes backwards; a meter that rolled over or was replaced is recorded as such and starts again;
// more than three times the recent average is flagged.
import { BUSINESS_DATE } from "../constants";
import { notify } from "./notify";
import { now } from "./maintenance";

export const METER_KINDS = ["Electricity", "Water", "Gas"] as const;
export type Meter = { id: string; kind: typeof METER_KINDS[number]; serial: string; place: string; multiplier: number; unit: string };
export type MeterReading = { id: string; meterId: string; at: Date; reading: number; consumption?: number; by: string; estimated?: boolean;
  reset?: "Rolled over" | "Replaced"; flagged?: boolean; note?: string };

const METERS: Meter[] = [
  { id: "MTR-1", kind: "Electricity", serial: "EKEDC 45091238", place: "Main switch room", multiplier: 40, unit: "kWh" },
  { id: "MTR-2", kind: "Water", serial: "WB-77812", place: "Water tank house", multiplier: 1, unit: "m³" },
  { id: "MTR-3", kind: "Gas", serial: "GS-2031", place: "Restaurant kitchen", multiplier: 1, unit: "kg" },
];
let mtrSeq = METERS.length, rdSeq = 0;
const READINGS: MeterReading[] = [];
// Six months of first-of-the-month readings, oldest first, so the newest reading is READINGS' last for each meter.
const seedMonthly = (meterId: string, start: number, steps: number[], by: string) => {
  const m = METERS.find(x => x.id === meterId)!;
  let r = start;
  steps.forEach((step, k) => {
    const prev = k ? r : undefined; r += step;
    READINGS.push({ id: `RD-${++rdSeq}`, meterId, at: new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth() - steps.length + 1 + k, 1, 9), reading: r, consumption: prev == null ? undefined : step * m.multiplier, by });
  });
};
seedMonthly("MTR-1", 81200, [0, 1510, 1480, 1630, 1550, 1590], "Emeka Obi");
seedMonthly("MTR-2", 4410, [0, 362, 348, 371, 355, 366], "Chidi Ike");
seedMonthly("MTR-3", 1200, [0, 410, 395, 420, 405, 398], "Chidi Ike");

export const meters = () => METERS;
// Newest first by entry order: readings are only ever added, never back-dated, and two in one minute must not tie.
export const readingsOf = (id: string) => READINGS.filter(r => r.meterId === id).reverse();

export const addMeter = (m: Omit<Meter, "id">): string | null => {
  const serial = m.serial.trim(), place = m.place.trim(), unit = m.unit.trim();
  if (!serial || !place || !unit) return "Enter the serial, the place and the unit.";
  if (METERS.some(x => x.serial.toLowerCase() === serial.toLowerCase())) return "A meter with that serial is already on the list.";
  if (!(m.multiplier > 0)) return "The multiplier must be more than zero. Use 1 for a meter read directly.";
  METERS.push({ ...m, serial, place, unit, id: `MTR-${++mtrSeq}` }); return null;
};

export const readMeter = (meterId: string, r: { reading: number; reset?: MeterReading["reset"]; estimated?: boolean; note?: string }, by: string): MeterReading | string => {
  const m = METERS.find(x => x.id === meterId); if (!m) return "That meter does not exist.";
  if (!(r.reading >= 0)) return "Enter the figure on the meter.";
  const prev = readingsOf(meterId)[0];
  if (prev && r.reading < prev.reading && !r.reset)
    return `The meter last read ${prev.reading}. A lower figure means it rolled over or was replaced: record that instead.`;
  // After a rollover or a new meter there is nothing to subtract from: this reading starts the count again.
  const consumption = prev && !r.reset ? Math.round((r.reading - prev.reading) * m.multiplier * 100) / 100 : undefined;
  const recent = readingsOf(meterId).map(x => x.consumption).filter((c): c is number => c != null).slice(0, 6);
  const avg = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
  const flagged = consumption != null && avg > 0 && consumption > avg * 3;
  const line: MeterReading = { id: `RD-${++rdSeq}`, meterId, at: now(), reading: r.reading, consumption, by, estimated: r.estimated || undefined, reset: r.reset, flagged: flagged || undefined, note: r.note?.trim() || undefined };
  READINGS.push(line);
  if (flagged) notify("meter.flagged", { title: `${m.kind} meter ${m.serial} reads high`, body: `${consumption} ${m.unit} since the last reading, over three times the recent average of ${Math.round(avg)}. Check for a leak or a misread.`, link: { screen: "generator-diesel", label: "Power & Diesel" } });
  return line;
};
