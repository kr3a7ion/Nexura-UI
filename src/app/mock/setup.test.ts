import { describe, expect, test } from "vitest";
import { addWorkOrder, setTarget, PRIORITIES, addHoldReason, removeHoldReason, HOLD_REASONS, addTrade } from "./maintenance";
import { setPerson, addTeam, addPattern, staff, patterns } from "./roster";
import { setMoney, saveGenset, genset, addTank, parseChart, addSupply, tanks } from "./setup";

describe("maintenance setup (FacilityFlow admin rules)", () => {
  test("a target change shapes future jobs only", () => {
    const before = addWorkOrder({ title: "Before", location: "Lobby", cat: "Electrical", priority: "P2", reportedBy: "Test", desc: "" });
    const due = before.respondBy.getTime();
    expect(setTarget("P2", 90, 60)).toMatch(/cannot be longer/);
    expect(setTarget("P2", 30, 1440)).toBeNull();
    expect(before.respondBy.getTime()).toBe(due);
    const after = addWorkOrder({ title: "After", location: "Lobby", cat: "Electrical", priority: "P2", reportedBy: "Test", desc: "" });
    expect(after.respondBy.getTime() - after.reportedAt.getTime()).toBe(30 * 60000);
    expect(PRIORITIES.P2.respondMin).toBe(30);
    setTarget("P2", 60, 1440);
  });

  test("lists refuse duplicates and blanks; one hold reason always stays", () => {
    expect(addTrade("electrical")).toMatch(/already/);
    expect(addHoldReason(" ")).toMatch(/Enter/);
    expect(addHoldReason("Waiting for a permit")).toBeNull();
    expect(removeHoldReason("Not a reason")).toMatch(/not on the list/);
    expect(removeHoldReason("Waiting for a permit")).toBeNull();
    expect(HOLD_REASONS).not.toContain("Waiting for a permit");
  });

  test("people, teams and shifts", () => {
    expect(setPerson("Chidi Ike", { trade: "Plumbing", team: "Nowhere", role: "Technician" })).toMatch(/no such team/);
    expect(addTeam({ name: "Building fabric", trade: "General", lead: "Chidi Ike", supervisor: "Yusuf Garba" })).toBeNull();
    expect(setPerson("Chidi Ike", { trade: "Plumbing", team: "Building fabric", role: "Team lead" })).toBeNull();
    expect(staff("Chidi Ike")?.role).toBe("Team lead");
    expect(addTeam({ name: "building fabric", trade: "General", lead: "Chidi Ike", supervisor: "Yusuf Garba" })).toMatch(/already/);
    expect(addPattern({ name: "Split", start: "7:00", end: "15:00" })).toMatch(/24-hour/);
    expect(addPattern({ name: "Late", start: "19:00", end: "03:00" })).toBeNull();
    expect(patterns().some(p => p.name === "Late")).toBe(true);
  });

  test("plant: generator limits, tank charts, supplies, money", () => {
    const g = genset("AST-004")!;
    expect(saveGenset({ ...g, burnAt: { 25: 40, 50: 30, 75: 82, 100: 108 } })).toMatch(/must not fall/);
    expect(saveGenset({ ...g, coolantMin: 96 })).toMatch(/below the maximum/);
    expect(parseChart("0=0\n200=680\n100=900")).toMatch(/rise/);
    expect(parseChart("0 = 0\n200=680")).toEqual([[0, 0], [200, 680]]);
    expect(addTank({ name: "Bulk tank", kind: "Bulk", capacity: 5000, minimum: 100 })).toMatch(/already/);
    expect(addTank({ name: "Drum by the pump house", kind: "Drum", capacity: 200, minimum: 300 })).toMatch(/below the capacity/);
    expect(addTank({ name: "Drum by the pump house", kind: "Drum", capacity: 200, minimum: 20 })).toBeNull();
    expect(tanks()).toHaveLength(3);
    expect(addSupply({ name: "Laundry feeder", kind: "Generator", phases: 3, volts: 415, pf: 0.8, ctRatio: 1 })).toMatch(/which generator/);
    expect(addSupply({ name: "Laundry feeder", kind: "Feeder", phases: 3, volts: 415, pf: 1.2, ctRatio: 1 })).toMatch(/power factor/);
    expect(setMoney({ fuelTolerancePct: 0, gridTariff: 225, supervisorLimit: 50000, labourRate: 5000 })).toMatch(/between 0 and 20/);
  });
});
