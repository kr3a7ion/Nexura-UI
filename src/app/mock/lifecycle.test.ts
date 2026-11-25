import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addWorkOrder, moveWorkOrder, workOrder, resolveDue, isOverdue, isLateToRespond, PRIORITIES } from "./maintenance";
import { finishWorkOrder } from "./hotel";
import { noticesFor, setCurrentUser } from "./notify";

const job = (priority: "P1" | "P2" | "P3" | "P4" = "P2") => addWorkOrder({ title: "Leak", location: "Room 209", room: "209", cat: "Plumbing", priority, reportedBy: "Amaka Osei", desc: "" });
const step = (id: string, to: Parameters<typeof moveWorkOrder>[1], m: Parameters<typeof moveWorkOrder>[2]) => expect(moveWorkOrder(id, to, m)).toBeNull();

describe("work order lifecycle (FacilityFlow rules)", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  test("both deadlines come from the priority and are stored when the job is raised", () => {
    const w = job("P1");
    expect(w.respondBy.getTime() - w.reportedAt.getTime()).toBe(PRIORITIES.P1.respondMin * 60000);
    expect(w.resolveBy.getTime() - w.reportedAt.getTime()).toBe(PRIORITIES.P1.resolveMin * 60000);
  });

  test("moves the status does not allow are refused, with a reason", () => {
    const w = job();
    expect(moveWorkOrder(w.id, "Completed", { by: "Emeka Obi", note: "x" })).toMatch(/cannot/);
    expect(moveWorkOrder(w.id, "Assigned", { by: "Adaeze Okonkwo" })).toMatch(/technician or a team/);
    step(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    expect(moveWorkOrder(w.id, "Accepted", { by: "Chidi Ike" })).toMatch(/Only Emeka Obi/);
    step(w.id, "Accepted", { by: "Emeka Obi" });
    expect(moveWorkOrder(w.id, "On hold", { by: "Emeka Obi" })).toMatch(/why/);
    step(w.id, "In progress", { by: "Emeka Obi" });
    expect(moveWorkOrder(w.id, "Completed", { by: "Emeka Obi" })).toMatch(/what was done/);
    expect(moveWorkOrder(w.id, "Cancelled", { by: "Emeka Obi" })).toMatch(/why/i);
  });

  test("the person who completed a job cannot verify it; someone else can, and the reporter hears it was signed off", () => {
    const w = job();
    step(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    step(w.id, "Accepted", { by: "Emeka Obi" });
    step(w.id, "In progress", { by: "Emeka Obi" });
    step(w.id, "Completed", { by: "Emeka Obi", note: "New washer" });
    expect(moveWorkOrder(w.id, "Verified", { by: "Emeka Obi" })).toMatch(/someone else/);
    expect(moveWorkOrder(w.id, "Verified", { by: "Chidi Ike" })).toMatch(/Only a Maintenance supervisor/);   // a technician
    expect(moveWorkOrder(w.id, "Verified", { by: "Bola Adewale" })).toMatch(/Only a Maintenance supervisor/); // a team lead
    setCurrentUser("Chidi Ike", "MX");
    step(w.id, "Verified", { by: "Yusuf Garba" });
    expect(noticesFor("Amaka Osei", "HK").some(n => n.title === "Signed off: Leak")).toBe(true);
    expect(finishWorkOrder(w.id, "Closed", "Adaeze Okonkwo").refused).toBeNull();
    expect(workOrder(w.id)?.status).toBe("Closed");
  });

  test("a job sent back loses its completion, and closing needs it verified first", () => {
    const w = job();
    step(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    step(w.id, "Accepted", { by: "Emeka Obi" });
    step(w.id, "In progress", { by: "Emeka Obi" });
    step(w.id, "Completed", { by: "Emeka Obi", note: "Done" });
    expect(finishWorkOrder(w.id, "Closed", "Adaeze Okonkwo").refused).toMatch(/cannot/);
    expect(moveWorkOrder(w.id, "In progress", { by: "Chidi Ike" })).toMatch(/why/i);
    step(w.id, "In progress", { by: "Chidi Ike", note: "Still dripping" });
    expect(workOrder(w.id)?.completedBy).toBeUndefined();
  });

  test("accepting stops the response clock; hold stops both clocks and adds the time back", () => {
    const w = job("P1");
    step(w.id, "Assigned", { by: "Adaeze Okonkwo", tech: "Emeka Obi" });
    vi.advanceTimersByTime(20 * 60000); // P1 must be accepted within 15 minutes
    expect(isLateToRespond(workOrder(w.id)!)).toBe(true);
    step(w.id, "Accepted", { by: "Emeka Obi" });
    expect(isLateToRespond(workOrder(w.id)!)).toBe(false);
    const due = resolveDue(workOrder(w.id)!).getTime();
    step(w.id, "On hold", { by: "Emeka Obi", holdReason: "Waiting for parts" });
    vi.advanceTimersByTime(5 * 3600000); // past the 4-hour resolve deadline, but on hold
    expect(isOverdue(workOrder(w.id)!)).toBe(false);
    step(w.id, "In progress", { by: "Emeka Obi" });
    expect(resolveDue(workOrder(w.id)!).getTime()).toBe(due + 5 * 3600000);
    expect(workOrder(w.id)!.respondBy.getTime()).toBe(w.reportedAt.getTime() + 15 * 60000); // stored deadline never rewritten
  });
});
