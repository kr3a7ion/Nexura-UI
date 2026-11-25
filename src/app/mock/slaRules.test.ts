import { describe, expect, test } from "vitest";
import { addWorkOrder, ruleFor, saveRule, removeRule, slaRules, escalate, workOrders, PRIORITIES, GUEST_ROOMS, type WorkOrder } from "./maintenance";
import { noticesFor } from "./notify";
import { holdersOf, setPerson, staff } from "./roster";

const mins = (w: WorkOrder) => [(w.respondBy.getTime() - w.reportedAt.getTime()) / 60000, (w.resolveBy.getTime() - w.reportedAt.getTime()) / 60000];
const job = (priority: "P1" | "P2" | "P3" | "P4", cat: string, location: string, room?: string) =>
  addWorkOrder({ title: "Test job", location, room, cat, priority, reportedBy: "Fatima Musa", desc: "x" });

describe("deadline rules per job type (FacilityFlow slaRules)", () => {
  test("a rule only changes what it names; blanks come from the priority", () => {
    const w = job("P2", "Plumbing", "Room 210", "210");
    expect(w.rule).toBe("SR-2");                         // P2, Plumbing, Guest rooms
    expect(mins(w)).toEqual([PRIORITIES.P2.respondMin, 360]);
    const none = job("P2", "Plumbing", "Lobby");
    expect(none.rule).toBeUndefined();
    expect(mins(none)).toEqual([PRIORITIES.P2.respondMin, PRIORITIES.P2.resolveMin]);
  });

  test("the most specific rule wins: trade and place, then place, then trade; an exact place beats guest rooms", () => {
    expect(saveRule({ priority: "P2", place: "Room 210", resolveMin: 120 }, "Musa Danladi")).toBeNull();
    expect(saveRule({ priority: "P2", trade: "Plumbing", resolveMin: 600 }, "Musa Danladi")).toBeNull();
    expect(ruleFor("P2", "Plumbing", "Room 210", "210")?.id).toBe("SR-2");        // trade and place beat place only
    expect(ruleFor("P2", "Electrical", "Room 210", "210")?.place).toBe("Room 210"); // place only beats nothing
    expect(ruleFor("P2", "Plumbing", "Lobby")?.trade).toBe("Plumbing");             // trade only, anywhere
    expect(saveRule({ priority: "P2", trade: "Plumbing", place: "Room 210", resolveMin: 90 }, "Musa Danladi")).toBeNull();
    expect(ruleFor("P2", "Plumbing", "Room 210", "210")?.place).toBe("Room 210");    // exact place beats guest rooms
    expect(ruleFor("P3", "Plumbing", "Room 210", "210")).toBeUndefined();           // another priority
  });

  test("a rule must be scoped, change something, and never give less time to fix than to respond", () => {
    expect(saveRule({ priority: "P3", resolveMin: 60 }, "Musa Danladi")).toMatch(/Pick a trade, a place/);
    expect(saveRule({ priority: "P3", trade: "HVAC" }, "Musa Danladi")).toMatch(/has to change something/);
    expect(saveRule({ priority: "P3", trade: "Juggling", resolveMin: 60 * 5 }, "Musa Danladi")).toMatch(/not one of/);
    expect(saveRule({ priority: "P3", trade: "HVAC", resolveMin: 30 }, "Musa Danladi")).toMatch(/at least as long as respond/); // P3 respond is 240
    expect(saveRule({ priority: "P3", trade: "HVAC", respondMin: 1.5 }, "Musa Danladi")).toMatch(/whole minutes/);
    expect(saveRule({ priority: "P3", trade: "HVAC", respondMin: 60, escalateTo: "Technician" }, "Musa Danladi")).toBeNull();
    expect(saveRule({ priority: "P3", place: "Generator house", respondMin: 30 }, "Musa Danladi")).toMatch(/already a rule/);
  });

  test("editing or removing a rule leaves jobs already raised alone", () => {
    const w = job("P3", "Power", "Generator house");
    expect(w.rule).toBe("SR-1");
    const before = mins(w);
    expect(before).toEqual([60, 480]);
    expect(saveRule({ priority: "P3", place: "Generator house", respondMin: 30, resolveMin: 120, escalateTo: "Supervisor" }, "Musa Danladi", "SR-1")).toBeNull();
    expect(mins(w)).toEqual(before);
    expect(mins(job("P3", "Power", "Generator house"))).toEqual([30, 120]);
    expect(removeRule("SR-1")).toBeGreaterThanOrEqual(2);
    expect(slaRules().some(r => r.id === "SR-1")).toBe(false);
    expect(saveRule({ priority: "P3", place: "Generator house", respondMin: 45 }, "Musa Danladi", "SR-1")).toMatch(/removed/);
    expect(job("P3", "Power", "Generator house").rule).toBeUndefined();
    expect(mins(w)).toEqual(before);
  });

  test("a breach goes to whoever the job's rule names, even after the rule is removed", () => {
    const w = workOrders().find(x => x.rule === "SR-1" && x.status === "Raised")!;
    w.reportedAt = new Date(w.reportedAt.getTime() - 2 * 3600000); w.respondBy = new Date(w.reportedAt.getTime() + 60 * 60000);
    escalate();
    const sup = holdersOf("Supervisor")[0];
    const n = noticesFor(sup, "MX").find(x => x.event === "workOrder.late" && x.title.startsWith(w.id));
    expect(n?.people).toEqual(expect.arrayContaining([...holdersOf("Team lead"), ...holdersOf("Supervisor")])); // usual chain kept, the rule's role added
    expect(n?.body).toMatch(/Deadlines from the rule P3, Generator house/);
    expect(GUEST_ROOMS).toBe("Guest rooms");
  });

  test("a rule cannot add a role nobody holds", () => {
    const sup = holdersOf("Supervisor")[0], was = staff(sup)!;
    expect(setPerson(sup, { trade: was.trade, team: was.team, role: "Technician" })).toBeNull();
    expect(saveRule({ priority: "P4", trade: "HVAC", resolveMin: 2000, escalateTo: "Supervisor" }, "Adaeze Okonkwo")).toMatch(/Nobody in Maintenance is a supervisor/);
    expect(setPerson(sup, { trade: was.trade, team: was.team, role: "Supervisor" })).toBeNull();
  });
});
