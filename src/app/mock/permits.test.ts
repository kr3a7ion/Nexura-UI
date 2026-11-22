import { describe, expect, test } from "vitest";
import { requestPermit, issuePermit, isolatePoint, closePermit, livePermits, PRECAUTIONS } from "./permits";
import { now } from "./maintenance";
import { noticesFor } from "./notify";

const hrs = (n: number) => new Date(now().getTime() + n * 3600000);

describe("permits to work (FacilityFlow rules)", () => {
  test("dates, a job that exists, and isolation points for an electrical permit are checked", () => {
    expect(requestPermit({ type: "hotWork", validFrom: hrs(2), validTo: hrs(1), precautions: [], points: [] }, "Emeka Obi")).toMatch(/end after/);
    expect(requestPermit({ type: "hotWork", woId: "WO-9999", validFrom: hrs(0), validTo: hrs(2), precautions: [], points: [] }, "Emeka Obi")).toMatch(/no such work order/);
    expect(requestPermit({ type: "electrical", validFrom: hrs(0), validTo: hrs(2), precautions: [], points: [{ desc: " " }] }, "Emeka Obi")).toMatch(/point to isolate/);
  });

  test("requested → issued by someone else → isolate → restore → close; no close while locked", () => {
    const p = requestPermit({ type: "electrical", woId: "WO-0090", validFrom: hrs(0), validTo: hrs(4), precautions: PRECAUTIONS.electrical, points: [{ desc: "Lobby lighting circuit L3", lockTag: "LT-20" }] }, "Emeka Obi");
    if (typeof p === "string") throw new Error(p);
    expect(noticesFor("Yusuf Garba", "MX").some(n => n.title.startsWith(`${p.id}:`))).toBe(true);
    expect(isolatePoint(p.id, p.points[0].id, "Yusuf Garba", "isolate")).toMatch(/issued permit/);
    expect(issuePermit(p.id, "Emeka Obi")).toMatch(/someone else/);
    expect(issuePermit(p.id, "Yusuf Garba")).toBeNull();
    expect(issuePermit(p.id, "Adaeze Okonkwo")).toMatch(/already issued/);
    expect(noticesFor("Emeka Obi", "MX").some(n => n.title === `${p.id} issued: you can start`)).toBe(true);
    expect(isolatePoint(p.id, p.points[0].id, "Yusuf Garba", "restore")).toMatch(/not isolated/);
    expect(isolatePoint(p.id, p.points[0].id, "Yusuf Garba", "isolate")).toBeNull();
    expect(closePermit(p.id, "Yusuf Garba")).toMatch(/1 isolation point is still locked out/);
    expect(livePermits().some(x => x.id === p.id)).toBe(true);
    expect(isolatePoint(p.id, p.points[0].id, "Emeka Obi", "restore")).toBeNull();
    expect(closePermit(p.id, "Yusuf Garba")).toBeNull();
    expect(livePermits().some(x => x.id === p.id)).toBe(false);
  });
});
