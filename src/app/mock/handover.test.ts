import { describe, expect, test } from "vitest";
import { draft, submitHandover, acknowledgeHandover, handovers } from "./handover";
import { noticesFor } from "./notify";

describe("shift handover (FacilityFlow rules)", () => {
  test("the draft carries every open job, most urgent first, and the plant", () => {
    const d = draft();
    expect(d.carried[0].priority).toBe("P1");
    expect(d.carried.some(j => j.status === "On hold" && j.holdReason)).toBe(true);
    expect(d.plant.map(p => p.id)).toContain("AST-004");
  });

  test("notes are required; the writer cannot acknowledge; acknowledged once only, and the writer is told", () => {
    expect(submitHandover("Emeka Obi", "  ok ", "")).toMatch(/must know/);
    const h = submitHandover("Emeka Obi", "Lift 1 making a noise at floor 3, watch it overnight.", "Plant room key");
    if (typeof h === "string") throw new Error(h);
    expect(handovers()[0].id).toBe(h.id);
    expect(h.shift).toBe("Morning");
    expect(noticesFor("Chidi Ike", "MX").some(n => n.event === "handover.submitted")).toBe(true);
    expect(acknowledgeHandover(h.id, "Emeka Obi")).toMatch(/incoming shift/);
    expect(acknowledgeHandover(h.id, "Musa Danladi")).toBeNull();
    expect(acknowledgeHandover(h.id, "Chidi Ike")).toMatch(/already/);
    expect(noticesFor("Emeka Obi", "MX").some(n => n.title === "Musa Danladi acknowledged your handover")).toBe(true);
  });
});
