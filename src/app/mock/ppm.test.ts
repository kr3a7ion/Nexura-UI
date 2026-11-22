import { describe, expect, test } from "vitest";
import { moveWorkOrder, workOrder, workOrders } from "./maintenance";
import { generateDue, schedule, openJobFor, recordChecklist, sheetFor, missingCritical, compliance, logMeter, raiseNow, addInterval, addSchedule } from "./ppm";
import { noticesFor } from "./notify";

const walk = (id: string) => {
  expect(moveWorkOrder(id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" })).toBeNull();
  expect(moveWorkOrder(id, "Accepted", { by: "Chidi Ike" })).toBeNull();
  expect(moveWorkOrder(id, "In progress", { by: "Chidi Ike" })).toBeNull();
};

describe("planned work (FacilityFlow rules)", () => {
  test("the sweep raises one job per due schedule, once, with one notice for the whole sweep", () => {
    const made = generateDue();
    expect(made.map(w => w.ppm).sort()).toEqual(["PM-001", "PM-005", "PM-006"]); // overdue, overdue, inside its 14-day lead
    expect(openJobFor(schedule("PM-002")!)?.id).toBe("WO-0088"); // the generator already has its job
    expect(generateDue()).toHaveLength(0);
    expect(noticesFor("Emeka Obi", "MX").filter(n => n.event === "ppm.dueSoon")).toHaveLength(1);
    expect(noticesFor("Emeka Obi", "MX").some(n => n.event === "workOrder.raised" && made.some(w => n.title.includes(w.id)))).toBe(false);
    expect(raiseNow("PM-001")).toMatch(/already open/);
  });

  test("critical checklist steps must be recorded before completing; readings need a value", () => {
    const w = workOrders().find(x => x.ppm === "PM-005")!;
    walk(w.id);
    expect(moveWorkOrder(w.id, "Completed", { by: "Chidi Ike", note: "Serviced" })).toMatch(/2 critical steps/);
    expect(missingCritical(w).map(i => i.id)).toEqual(["w2", "w3"]);
    expect(recordChecklist(w, [{ item: "w2", result: "Pass" }, { item: "w3", result: "Fail", note: "Inlet hose perished" }], "Chidi Ike").failed).toBe(1);
    expect(moveWorkOrder(w.id, "Completed", { by: "Chidi Ike", note: "Serviced, hose to replace" })).toBeNull();
    const ac = workOrders().find(x => x.ppm === "PM-001")!;
    expect(recordChecklist(ac, [{ item: "a3", result: "Pass" }], "Emeka Obi").refused).toMatch(/reading/);
    expect(sheetFor(ac)?.name).toBe("Air conditioning service");
  });

  test("verifying moves the next due date on from the due date, rolled past today, not from the day it was done", () => {
    const w = workOrders().find(x => x.ppm === "PM-005")!; // due 20 May, monthly, done 24 Jun
    expect(moveWorkOrder(w.id, "Verified", { by: "Bola Adewale" })).toBeNull();
    expect(schedule("PM-005")!.nextDue).toBe("2026-07-20");
    expect(addInterval("2026-01-31", 1, "month")).toBe("2026-03-03"); // JS month overflow, same as the server
  });

  test("a meter schedule is due when the reading passes it; the next one counts from the reading", () => {
    expect(logMeter("AST-004", 3000)).toMatch(/backwards/);
    expect(logMeter("AST-004", 3460)).toBeNull();
    const w = workOrder("WO-0088")!;
    moveWorkOrder(w.id, "Accepted", { by: "Emeka Obi" }); moveWorkOrder(w.id, "In progress", { by: "Emeka Obi" });
    recordChecklist(w, ["g1", "g2", "g6"].map(item => ({ item, result: "Pass" as const })).concat([{ item: "g3", result: "Pass", value: "12.8 V" } as never]), "Emeka Obi");
    expect(moveWorkOrder(w.id, "Completed", { by: "Emeka Obi", note: "Serviced" })).toBeNull();
    expect(moveWorkOrder(w.id, "Verified", { by: "Bola Adewale" })).toBeNull();
    expect(schedule("PM-002")!.nextMeter).toBe(3710);
  });

  test("compliance judges only what is done or already late; new schedules need a sensible interval", () => {
    const c = compliance();
    expect(c.onTime).toBeGreaterThanOrEqual(2);
    expect(c.pct).not.toBeNull();
    expect(addSchedule({ name: "Hours on a pump", assetId: "AST-007", every: 100, unit: "hours", leadDays: 0, priority: "P4", estMins: 30 })).toMatch(/no meter/);
    expect(addSchedule({ name: "", assetId: "AST-007", every: 1, unit: "month", leadDays: 0, priority: "P4", estMins: 30 })).toMatch(/Name/);
  });
});
