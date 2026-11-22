import { describe, expect, test } from "vitest";
import { draft, submitHandover, acknowledgeHandover, handovers } from "./handover";
import { noticesFor } from "./notify";
import { addWorkOrder, moveWorkOrder } from "./maintenance";

describe("shift handover (FacilityFlow rules)", () => {
  test("the draft carries every open job, most urgent first, and the plant", () => {
    const d = draft();
    expect(d.carried[0].priority).toBe("P1");
    expect(d.carried.some(j => j.status === "On hold" && j.holdReason)).toBe(true);
    expect(d.plant.map(p => p.id)).toContain("AST-004");
  });

  test("notes are required; the writer cannot acknowledge; acknowledged once only, and the writer is told", () => {
    expect(submitHandover("Emeka Obi", "Musa Danladi", "  ok ", "")).toMatch(/must know/);
    expect(submitHandover("Emeka Obi", "", "Lift 1 noisy", "")).toMatch(/taking over/);
    const h = submitHandover("Emeka Obi", "Musa Danladi", "Lift 1 making a noise at floor 3, watch it overnight.", "Plant room key");
    if (typeof h === "string") throw new Error(h);
    expect(handovers()[0].id).toBe(h.id);
    expect(h.shift).toBe("Morning");
    expect(noticesFor("Musa Danladi", "MX").some(n => n.event === "handover.submitted")).toBe(true);
    expect(noticesFor("Chidi Ike", "MX").some(n => n.event === "handover.submitted")).toBe(false);
    expect(h.permits[0]).toMatch(/^PTW-0001 electrical isolation on WO-0092/);
    expect(acknowledgeHandover(h.id, "Emeka Obi")).toMatch(/incoming shift/);
    expect(acknowledgeHandover(h.id, "Chidi Ike")).toMatch(/Only they/);
    expect(acknowledgeHandover(h.id, "Musa Danladi")).toBeNull();
    expect(acknowledgeHandover(h.id, "Musa Danladi")).toMatch(/already/);
    expect(noticesFor("Emeka Obi", "MX").some(n => n.title === "Musa Danladi acknowledged your handover")).toBe(true);
  });
});

describe("the handover is a gate", () => {
  test("the person taken over to cannot be given work until they acknowledge", () => {
    const h = submitHandover("Emeka Obi", "Chidi Ike", "Pool pump tripped twice, reset at 14:00.", "");
    if (typeof h === "string") throw new Error(h);
    const w = addWorkOrder({ title: "Gate test", location: "Pool area", cat: "Pool", priority: "P3", reportedBy: "Test", desc: "" });
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" })).toMatch(/not acknowledged the handover from Emeka Obi/);
    expect(acknowledgeHandover(h.id, "Chidi Ike")).toBeNull();
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" })).toBeNull();
  });
});
