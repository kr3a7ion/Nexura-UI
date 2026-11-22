import { describe, expect, test } from "vitest";
import { requestLeave, decideLeave, recordLeave, cancelLeave, leaves } from "./leave";
import { rosterDay, paintDay, markDay, staffList, absences, addDays, TODAY } from "./roster";
import { addWorkOrder, moveWorkOrder } from "./maintenance";
import { staffRecord } from "./staff";
import { noticesFor } from "./notify";

describe("people and absences shared between HR and Maintenance", () => {
  test("Maintenance's people come from HR's staff list; someone who left drops out", () => {
    expect(staffList().map(s => s.name)).toContain("Musa Danladi");
    staffRecord("Musa Danladi")!.status = "Left";
    expect(staffList().map(s => s.name)).not.toContain("Musa Danladi");
    staffRecord("Musa Danladi")!.status = "Active";
  });

  test("HR's approved leave lands on the roster, cannot be repainted or marked, and blocks work", () => {
    const d = addDays(TODAY, 10); // inside Chidi's seeded annual leave
    expect(rosterDay("Chidi Ike", d)).toMatchObject({ status: "Absent", source: "HR", reason: "Annual leave" });
    expect(paintDay("Chidi Ike", d, "SP-1")).toMatch(/recorded by HR/);
    const today = recordLeave({ staff: "Emeka Obi", type: "Sick", from: TODAY, to: TODAY, reason: "Fever, doctor's note" }, "Adaeze Okonkwo");
    if (typeof today === "string") throw new Error(today);
    expect(markDay("Emeka Obi", TODAY, "Present", "Yusuf Garba")).toMatch(/recorded by HR/);
    const w = addWorkOrder({ title: "Leave test", location: "Lobby", cat: "Electrical", priority: "P3", reportedBy: "Test", desc: "" });
    expect(moveWorkOrder(w.id, "Assigned", { by: "Yusuf Garba", tech: "Emeka Obi" })).toMatch(/not marked present/);
    expect(cancelLeave(today.id, "Adaeze Okonkwo")).toBeNull();
    expect(rosterDay("Emeka Obi", TODAY)?.source).toBeUndefined();
  });

  test("a roster absence shows in HR's list with its reason and who set it", () => {
    expect(absences().some(a => a.staff === "Musa Danladi" && a.reason === "Sick" && a.source === "Maintenance" && a.markedBy === "Yusuf Garba")).toBe(true);
  });

  test("Maintenance asks, HR decides; never the person who asked; a decline needs a reason and goes back", () => {
    const from = addDays(TODAY, 30), to = addDays(TODAY, 31);
    const r = requestLeave({ staff: "Bola Adewale", type: "Casual", from, to, reason: "Moving house" }, "Yusuf Garba", "Maintenance");
    if (typeof r === "string") throw new Error(r);
    expect(noticesFor("Adaeze Okonkwo", "MGT").some(n => n.title === "Time off to decide: Bola Adewale")).toBe(true);
    expect(requestLeave({ staff: "Bola Adewale", type: "Annual", from: to, to: addDays(to, 2), reason: "x" }, "Yusuf Garba", "Maintenance")).toMatch(/already has leave/);
    expect(decideLeave(r.id, true, "Yusuf Garba")).toMatch(/someone else/);
    expect(decideLeave(r.id, false, "Adaeze Okonkwo")).toMatch(/why/);
    expect(decideLeave(r.id, false, "Adaeze Okonkwo", "Peak week, ask for the week after")).toBeNull();
    expect(noticesFor("Yusuf Garba", "MX").some(n => n.title === "Time off declined: Bola Adewale" && n.body.includes("Peak week"))).toBe(true);
    expect(rosterDay("Bola Adewale", from)?.source).not.toBe("HR");
  });

  test("leave cannot go past the year's entitlement", () => {
    const r = requestLeave({ staff: "Yusuf Garba", type: "Casual", from: addDays(TODAY, 40), to: addDays(TODAY, 46), reason: "Long trip" }, "Bola Adewale", "Maintenance");
    if (typeof r === "string") throw new Error(r);
    expect(decideLeave(r.id, true, "Adaeze Okonkwo")).toMatch(/5 casual days left/);
    expect(leaves().length).toBeGreaterThan(3);
  });
});
