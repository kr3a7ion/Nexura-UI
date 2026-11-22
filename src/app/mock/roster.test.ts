import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addWorkOrder, moveWorkOrder, workOrder, assignable, escalate, VENDOR } from "./maintenance";
import { markDay, paintDay, publish, fillPattern, rosterDay, presentToday, weekStart, addDays, TODAY } from "./roster";
import { noticesFor } from "./notify";

const job = (priority: "P1" | "P3" = "P1") => addWorkOrder({ title: `Job ${Math.random()}`, location: "Room 210", cat: "Electrical", priority, reportedBy: "Amaka Osei", desc: "" });
const lateFor = (name: string, id: string) => noticesFor(name, "MX").filter(n => n.event === "workOrder.late" && n.link?.param === id);
const NEXT = addDays(weekStart(TODAY), 7);

describe("roster (FacilityFlow rules)", () => {
  afterEach(() => { markDay("Chidi Ike", TODAY, "Present", "Yusuf Garba"); });

  test("only people marked present today can be given work; an outside vendor always can", () => {
    expect(assignable()).not.toContain("Musa Danladi"); // off sick today
    markDay("Chidi Ike", TODAY, "Absent", "Yusuf Garba", "Training");
    expect(presentToday()).not.toContain("Chidi Ike");
    const w = job("P3");
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" })).toMatch(/not marked present/);
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: VENDOR })).toBeNull();
  });

  test("absent needs a reason; off-duty and unpublished days cannot be marked", () => {
    expect(markDay("Chidi Ike", TODAY, "Absent", "Yusuf Garba")).toMatch(/why/);
    expect(markDay("Emeka Obi", weekStart(TODAY), "Present", "Yusuf Garba")).toMatch(/off duty/); // Emeka rests on Monday
    expect(paintDay("Emeka Obi", NEXT, "SP-1")).toBeNull();
    expect(markDay("Emeka Obi", NEXT, "Present", "Yusuf Garba")).toMatch(/not published/);
    expect(publish(NEXT, addDays(NEXT, 6))).toBe(1);
    expect(rosterDay("Emeka Obi", NEXT)?.published).toBe(true);
  });

  test("a marked day is never repainted; a fill rotates people through shifts and leaves rest days off", () => {
    expect(paintDay("Chidi Ike", TODAY, null)).toMatch(/already marked/);
    const r = fillPattern({ from: NEXT, to: addDays(NEXT, 6), people: ["Chidi Ike", "Musa Danladi"], restDays: [6], shifts: ["SP-1", "SP-2"] });
    expect(r.written).toBe(14);
    expect(rosterDay("Chidi Ike", NEXT)?.shift).toBe("SP-1");
    expect(rosterDay("Musa Danladi", NEXT)?.shift).toBe("SP-2");
    expect(rosterDay("Chidi Ike", addDays(NEXT, 6))?.status).toBe("Off");
    expect(fillPattern({ from: NEXT, to: addDays(NEXT, 20), people: ["Chidi Ike"], restDays: [], shifts: ["SP-1"] }).refused).toMatch(/two weeks/);
  });

  test("a job given to a team becomes the name of whoever on it accepts; someone off the team cannot", () => {
    const w = job("P3");
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", team: "Electrical and HVAC" })).toBeNull();
    expect(noticesFor("Emeka Obi", "MX").some(n => n.title.startsWith(`${w.id} is with your team`))).toBe(true);
    expect(moveWorkOrder(w.id, "Accepted", { by: "Chidi Ike" })).toMatch(/Only Electrical and HVAC team/);
    expect(moveWorkOrder(w.id, "Accepted", { by: "Emeka Obi" })).toBeNull();
    expect(workOrder(w.id)?.tech).toBe("Emeka Obi");
  });

  test("reassigning tells the person the job left their board", () => {
    const w = job("P3");
    moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Chidi Ike" });
    expect(noticesFor("Emeka Obi", "MX").some(n => n.title === `${w.id} is no longer yours: ${workOrder(w.id)!.title}`)).toBe(true);
  });
});

describe("escalation", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  test("a P1 nobody accepts goes to its team's lead, then its supervisor, then the head of department, each once", () => {
    const w = job("P1");
    moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo", team: "Plumbing and building" });
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
