import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addWorkOrder, moveWorkOrder, workOrder, assignable, setPresent, escalate, VENDOR } from "./maintenance";
import { noticesFor } from "./notify";

const job = (priority: "P1" | "P3" = "P1") => addWorkOrder({ title: `Job ${Math.random()}`, location: "Room 210", cat: "Electrical", priority, reportedBy: "Amaka Osei", desc: "" });
const lateFor = (name: string, id: string) => noticesFor(name, "MX").filter(n => n.event === "workOrder.late" && n.link?.param === id);

describe("roster and escalation (FacilityFlow rules)", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); setPresent("Chidi Ike", true); });

  test("only people in today can be given work; an outside vendor always can", () => {
    expect(assignable()).not.toContain("Musa Danladi");
    expect(assignable()).not.toContain("Yusuf Garba"); // supervisors do not take jobs
    setPresent("Chidi Ike", false);
    const w = job("P3");
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" })).toMatch(/not on today/);
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: VENDOR })).toBeNull();
  });

  test("a P1 nobody accepts goes to the team lead, then the supervisor, then the head of department, each once", () => {
    const w = job("P1");
    escalate();
    expect(lateFor("Bola Adewale", w.id)).toHaveLength(0);
    vi.advanceTimersByTime(16 * 60000); escalate(); escalate();
    expect(lateFor("Bola Adewale", w.id)).toHaveLength(1);
    vi.advanceTimersByTime(4 * 3600000); escalate();
    expect(lateFor("Yusuf Garba", w.id)).toHaveLength(1);
    expect(lateFor("Adaeze Okonkwo", w.id).some(n => n.level === "Urgent")).toBe(false);
    vi.advanceTimersByTime(4 * 3600000); escalate(); escalate();
    expect(lateFor("Adaeze Okonkwo", w.id).filter(n => n.level === "Urgent")).toHaveLength(1);
    expect(lateFor("Bola Adewale", w.id)).toHaveLength(1);
  });

  test("a job on hold does not escalate", () => {
    const w = job("P1");
    moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    moveWorkOrder(w.id, "Accepted", { by: "Emeka Obi" });
    moveWorkOrder(w.id, "On hold", { by: "Emeka Obi", holdReason: "Waiting for parts" });
    vi.advanceTimersByTime(10 * 3600000); escalate();
    expect(workOrder(w.id)!.escalated ?? []).toHaveLength(0);
  });
});
