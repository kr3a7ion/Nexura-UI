import { describe, expect, test } from "vitest";
import { requestApproval, waitingFor, decide, latestFor, setApproverRoles, canApprove } from "./approvals";
import { walkIn } from "./hotel";
import { CHARGES, setRoomRate } from "./frontOffice";

describe("approvals", () => {
  test("a request waits on the manager's dashboard and the change happens only when approved", () => {
    let applied = 0;
    const a = requestApproval({ kind: "Rate override", dept: "Front Office", ref: "BK-T1", title: "T", detail: "", reason: "Corporate", requestedBy: "Chioma Nwosu", apply: () => applied++ });
    expect(waitingFor("MGT").some(x => x.id === a.id)).toBe(true);
    expect(waitingFor("FD").some(x => x.id === a.id)).toBe(false);
    expect(decide(a.id, true, "Chioma Nwosu", "MGT")).toMatch(/someone else/i);
    expect(decide(a.id, true, "Chioma Nwosu", "FD")).toMatch(/cannot approve/i);
    expect(applied).toBe(0);
    expect(decide(a.id, true, "Adaeze Okonkwo", "MGT")).toBeNull();
    expect(applied).toBe(1);
    expect(decide(a.id, true, "Adaeze Okonkwo", "MGT")).toMatch(/already/);
    expect(latestFor("Rate override", "BK-T1")?.status).toBe("Approved");
  });

  test("a declined request changes nothing, and asking twice keeps one waiting request", () => {
    let applied = 0;
    const one = requestApproval({ kind: "Discount", dept: "Front Office", ref: "BK-T2", title: "T", detail: "₦6,000", reason: "R", requestedBy: "X", apply: () => applied++ });
    const two = requestApproval({ kind: "Discount", dept: "Front Office", ref: "BK-T2", title: "T", detail: "₦7,000", reason: "R", requestedBy: "X", apply: () => applied++ });
    expect(two.id).toBe(one.id);
    expect(two.detail).toBe("₦7,000");
    decide(one.id, false, "Adaeze Okonkwo", "MGT", "Too much");
    expect(applied).toBe(0);
    expect(latestFor("Discount", "BK-T2")).toMatchObject({ status: "Declined", note: "Too much" });
  });

  test("the admin can make a department lead an approver, but never remove the manager", () => {
    setApproverRoles("Front Office", ["RSV"]);
    expect(canApprove("RSV", "Front Office")).toBe(true);
    expect(canApprove("MGT", "Front Office")).toBe(true);
    setApproverRoles("Front Office", ["MGT"]);
  });

  test("an approved rate override changes the walk-in's room charge", () => {
    const stay = walkIn({ guest: "Rate Test", room: "116", type: "Executive", nights: 2, rate: 70000, source: "Walk-in" }, 0)!;
    setRoomRate(stay.id, 60000);
    expect(CHARGES[stay.id][0]).toMatchObject({ unit: 60000, amount: 120000, tax: 9000 });
  });
});
