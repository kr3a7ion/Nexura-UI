import { describe, expect, test } from "vitest";
import { requestTrip, signOff, fleetDecide, trip } from "./fleet";
import { setApproverNames } from "./approvals";

const ask = (by: string, role: string, guest?: string) => requestTrip({ serviceL: guest ? "Airport Transfer" : "Staff & Logistics", priority: "Normal", guest,
  pickup: "Hotel", dropoff: "Market", scheduledTime: "10:00", pax: 1, tripMode: "round-trip", chargeType: "cost-centre", quotedFare: 8000 }, by, role);

describe("vehicle requests: department sign-off, then Fleet", () => {
  test("staff ask; only a lead of their own department signs off, never themselves", () => {
    const t = ask("Fatima Musa", "HK");                       // Housekeeping attendant
    expect(t.dept).toBe("Housekeeping");
    expect(t.status).toBe("waiting-department");
    expect(signOff(t.id, "Fatima Musa", "HK", true)).toMatch(/own request/);
    expect(signOff(t.id, "Grace Ojo", "RT", true)).toMatch(/Housekeeping supervisor or manager/);  // a lead, but of Restaurant
    expect(signOff(t.id, "Amaka Osei", "HK", true)).toMatch(/Housekeeping supervisor or manager/); // same department, but staff
    expect(signOff(t.id, "Ngozi Okonkwo", "HK", true)).toBeNull();                                 // HK Supervisor
    expect(trip(t.id)!.status).toBe("waiting-fleet");
  });

  test("Fleet approves; not the requester, not whoever signed it off, not a driver", () => {
    const t = ask("Chidi Ike", "MX");
    signOff(t.id, "Adaeze Okonkwo", "MGT", true);              // a hotel manager signs off
    expect(fleetDecide(t.id, "Adaeze Okonkwo", "MGT", true)).toMatch(/signed this off/);
    expect(fleetDecide(t.id, "Sani Abdullahi", "FLT", true)).toMatch(/Fleet's approvers/);
    expect(fleetDecide(t.id, "Kunle Bello", "FLT", true)).toBeNull();   // Fleet Manager
    expect(trip(t.id)!.status).toBe("requested");
    expect(trip(t.id)!.approvedBy).toBe("Kunle Bello");
  });

  test("a lead's own request skips their sign-off; a guest trip goes straight to Fleet", () => {
    expect(ask("Yusuf Garba", "MX").status).toBe("waiting-fleet");    // Maintenance Supervisor
    const g = ask("Chioma Nwosu", "FD", "Mr Danjuma");
    expect(g.status).toBe("waiting-fleet");
    expect(g.dept).toBeUndefined();
  });

  test("turning down needs a reason; Fleet's named approvers can approve", () => {
    const t = ask("Yusuf Garba", "MX");
    expect(fleetDecide(t.id, "Kunle Bello", "FLT", false, "")).toMatch(/Say why/);
    setApproverNames("Fleet", ["Sani Abdullahi"]);
    expect(fleetDecide(t.id, "Sani Abdullahi", "FLT", false, "No van free today")).toBeNull();
    expect(trip(t.id)!.status).toBe("turned-down");
    expect(fleetDecide(t.id, "Kunle Bello", "FLT", true)).toMatch(/not waiting/);
  });
});
