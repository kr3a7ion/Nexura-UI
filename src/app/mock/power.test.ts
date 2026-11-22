import { describe, expect, test } from "vitest";
import { litresFromDip, logDip, recordDelivery, issueFuel, recordRun, expectedLph, reconcile, saveReconciliation, costPerKwh, levelOf, highBurnStreak } from "./power";
import { genset, tanks } from "./setup";
import { asset } from "./ppm";
import { workOrder } from "./maintenance";
import { noticesFor } from "./notify";
import { BUSINESS_DATE } from "../constants";

const monthStart = new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), 1);

describe("diesel (FacilityFlow rules)", () => {
  test("a dip in millimetres is read through the tank's chart, point to point", () => {
    const chart = tanks()[0].chart;
    expect(litresFromDip(chart, 1016)).toBe(6620);
    expect(litresFromDip(chart, 100)).toBe(340);
    expect(litresFromDip(undefined, 500)).toMatch(/no dip chart/);
    expect(logDip("TK-2", { mm: 300 }, "Emeka Obi")).toMatch(/no dip chart/);
    expect(logDip("TK-2", { litres: 1500 }, "Emeka Obi")).toMatch(/more than/);
  });

  test("the receiver cannot witness; received comes from the dips; past the tolerance the supervisor is told", () => {
    const base = { tankId: "TK-1", vendor: "Emadeb Energy", waybill: "EMD-60010", invoicedL: 3000, dipBeforeL: 6620, dipAfterL: 9520, unitPrice: 1200 };
    expect(recordDelivery({ ...base, witnessedBy: "Emeka Obi" }, "Emeka Obi")).toMatch(/cannot also witness/);
    expect(recordDelivery({ ...base, dipAfterL: 5000, witnessedBy: "Chidi Ike" }, "Emeka Obi")).toMatch(/cannot be lower/);
    const d = recordDelivery({ ...base, witnessedBy: "Chidi Ike" }, "Emeka Obi");
    if (typeof d === "string") throw new Error(d);
    expect([d.receivedL, d.varianceL, d.variancePct, d.flagged]).toEqual([2900, -100, -3.33, true]);
    expect(levelOf("TK-1")).toBe(9520);
    expect(noticesFor("Yusuf Garba", "MX").some(n => n.title === `Delivery ${d.id} is short by 100 L`)).toBe(true);
  });

  test("fuel issued moves between tanks and never out of an empty one", () => {
    expect(issueFuel({ tankId: "TK-1", litres: 50 }, "Emeka Obi")).toMatch(/which generator or tank/);
    expect(issueFuel({ tankId: "TK-2", litres: 5000, toAssetId: "AST-004" }, "Emeka Obi")).toMatch(/only holds/);
    const before = levelOf("TK-2");
    expect(typeof issueFuel({ tankId: "TK-1", litres: 400, toTankId: "TK-2" }, "Emeka Obi")).toBe("object");
    expect(levelOf("TK-2")).toBe(before + 400);
  });

  test("expected burn follows the load carried", () => {
    const g = genset("AST-004")!; // 500 kVA = 400 kW usable
    expect(expectedLph(g, 200)).toBe(58); // half load
    expect(expectedLph(g, 250)).toBe(70); // 62.5% load: halfway between 58 and 82
    expect(expectedLph(g)).toBe(82);
  });

  test("a run moves the hour meter; the third high-burn run in a row raises one job and resets", () => {
    expect(recordRun({ assetId: "AST-004", reason: "Power cut", hoursStart: 3420, hoursEnd: 3418 }, "Emeka Obi")).toMatch(/lower than at the start/);
    expect(recordRun({ assetId: "AST-004", reason: "Power cut", hoursStart: 3400, hoursEnd: 3405 }, "Emeka Obi")).toMatch(/already reads 3,412/);
    expect(highBurnStreak("AST-004")).toBe(2);
    const r = recordRun({ assetId: "AST-004", reason: "Power cut", hoursStart: 3412, hoursEnd: 3422, avgLoadKw: 200, fuelStartL: 900, fuelEndL: 230, kwh: 2000 }, "Emeka Obi");
    if (typeof r === "string") throw new Error(r);
    expect([r.actualLph, r.expectedLph, r.deviationPct]).toEqual([67, 58, 15.52]);
    expect(r.raisedJob).toBeTruthy();
    expect(workOrder(r.raisedJob!)?.priority).toBe("P2");
    expect(highBurnStreak("AST-004")).toBe(0);
    expect(asset("AST-004")!.meter!.value).toBe(3422);
  });

  test("a reconciliation that does not balance is saved only with a written explanation", () => {
    const today8 = new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate(), 8);
    const day = reconcile("TK-2", monthStart, today8), bulk = reconcile("TK-1", monthStart, today8);
    if (typeof day === "string" || typeof bulk === "string") throw new Error("no reconciliation");
    expect([day.openingL, day.deliveriesL, day.issuesL, day.varianceL, day.flagged]).toEqual([620, 1830, 2040, 0, false]); // what went in was burned
    expect([bulk.computedL, bulk.dippedL, bulk.varianceL, bulk.flagged]).toEqual([6970, 6620, -350, true]);
    const r = bulk;
    expect(reconcile("TK-1", new Date(2020, 0, 1), monthStart)).toMatch(/needs a dip/);
    const flagged = { ...r, flagged: true, varianceL: -300 };
    expect(saveReconciliation(flagged, "Yusuf Garba", "short")).toMatch(/unaccounted/);
    expect(saveReconciliation(flagged, "Yusuf Garba", "Day tank drain valve found weeping; repaired under WO-0095.")).toBeNull();
  });

  test("diesel cost per kWh uses the last delivered price", () => {
    const c = costPerKwh(monthStart, new Date(2027, 0, 1));
    expect(c.kwh).toBeGreaterThan(0);
    expect(c.perKwh).toBe(Math.round(c.litres * 1200 / c.kwh));
  });
});
