import { describe, expect, test } from "vitest";
import { reportIncident, incidentsIn, canReadIncidents, readMeter, readingsOf, addMeter, meters } from "./safety";
import { noticesFor } from "./notify";
import { holdersOf } from "./roster";
import { now } from "./maintenance";

describe("incidents (FacilityFlow safety)", () => {
  test("anyone reports; only managers and Maintenance leads read", () => {
    expect(canReadIncidents("Fatima Musa", "HK")).toBe(false);
    expect(canReadIncidents("Emeka Obi", "MX")).toBe(false);                 // a technician reports, never reads
    expect(canReadIncidents(holdersOf("Supervisor")[0], "MX")).toBe(true);
    expect(canReadIncidents(holdersOf("Team lead")[0], "MX")).toBe(true);
    expect(canReadIncidents("Anyone at all", "MGT")).toBe(true);
    const i = reportIncident({ occurredAt: now(), type: "Injury", place: "Laundry", description: "Slipped on a wet floor, bruised knee.", severity: "Major" }, "Fatima Musa");
    expect(i).toMatchObject({ reportedBy: "Fatima Musa", severity: "Major" });
    const n = noticesFor(holdersOf("Supervisor")[0], "MX").find(x => x.event === "incident.reported")!;
    expect(n).toMatchObject({ level: "Urgent" });
    expect(n.body).not.toMatch(/knee/);                                     // the injury stays in the record, not the bell
    expect(noticesFor("Emeka Obi", "MX").some(x => x.event === "incident.reported")).toBe(false);
  });

  test("what happened and when are required, and it cannot be in the future", () => {
    expect(reportIncident({ occurredAt: now(), type: "Fire", description: "  ", severity: "Minor" }, "Emeka Obi")).toMatch(/what happened/);
    expect(reportIncident({ occurredAt: new Date(NaN), type: "Fire", description: "Bin fire", severity: "Minor" }, "Emeka Obi")).toMatch(/when/);
    expect(reportIncident({ occurredAt: new Date(now().getTime() + 3600000), type: "Fire", description: "Bin fire", severity: "Minor" }, "Emeka Obi")).toMatch(/future/);
  });

  test("a month's incidents are strictly that month", () => {
    const t = now(), inMonth = incidentsIn(t.getFullYear(), t.getMonth());
    expect(inMonth.every(i => i.occurredAt.getMonth() === t.getMonth())).toBe(true);
    const lastDay = new Date(t.getFullYear(), t.getMonth(), 0, 23, 59); // the last minute of last month
    reportIncident({ occurredAt: lastDay, type: "Near miss", description: "Ladder left in the corridor overnight.", severity: "Minor" }, "Emeka Obi");
    expect(incidentsIn(t.getFullYear(), t.getMonth()).some(i => i.occurredAt.getTime() === lastDay.getTime())).toBe(false);
    expect(incidentsIn(lastDay.getFullYear(), lastDay.getMonth()).some(i => i.occurredAt.getTime() === lastDay.getTime())).toBe(true);
  });
});

describe("utility meters", () => {
  test("consumption goes through the multiplier; a reading never goes backwards unless it rolled over or was replaced", () => {
    const last = readingsOf("MTR-1")[0].reading;
    const r = readMeter("MTR-1", { reading: last + 1500 }, "Emeka Obi");
    expect(r).toMatchObject({ consumption: 60000 });                     // ×40 current transformer
    expect(readMeter("MTR-1", { reading: 12 }, "Emeka Obi")).toMatch(/rolled over or was replaced/);
    expect(readMeter("MTR-1", { reading: 12, reset: "Replaced" }, "Emeka Obi")).toMatchObject({ consumption: undefined, reset: "Replaced" });
    expect(readMeter("MTR-1", { reading: 20 }, "Emeka Obi")).toMatchObject({ consumption: 320 });
  });

  test("more than three times the recent average is flagged as a likely leak or misread", () => {
    const last = readingsOf("MTR-2")[0].reading;
    expect(readMeter("MTR-2", { reading: last + 400 }, "Chidi Ike")).toMatchObject({ flagged: undefined });
    const big = readMeter("MTR-2", { reading: last + 400 + 1200 }, "Chidi Ike");
    expect(big).toMatchObject({ flagged: true });
    expect(noticesFor("Emeka Obi", "MX").some(n => n.event === "meter.flagged")).toBe(true);
  });

  test("a new meter needs a serial nobody else has and a multiplier above zero", () => {
    expect(addMeter({ kind: "Water", serial: "wb-77812", place: "Pool plant", multiplier: 1, unit: "m³" })).toMatch(/already/);
    expect(addMeter({ kind: "Water", serial: "WB-90001", place: "Pool plant", multiplier: 0, unit: "m³" })).toMatch(/more than zero/);
    expect(addMeter({ kind: "Water", serial: "WB-90001", place: "Pool plant", multiplier: 1, unit: "m³" })).toBeNull();
    expect(meters().some(m => m.serial === "WB-90001")).toBe(true);
  });
});
