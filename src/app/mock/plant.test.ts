import { describe, expect, test } from "vitest";
import { recordSwitch, plantNow, switchLog } from "./changeover";
import { assess, logGenset, shiftAt, shiftLogStatus } from "./gensetLog";
import { compute, recordClamp, loadNow } from "./load";
import { draft } from "./handover";
import { genset } from "./setup";
import { asset } from "./ppm";
import { holdersOf } from "./roster";
import { now } from "./maintenance";
import { noticesFor } from "./notify";

const plant = () => Object.fromEntries(draft().plant.map(l => [l.id, l.status]));

describe("power as it happens (FacilityFlow rules)", () => {
  test("clamp sum: kW = √3 × V × I × power factor, imbalance is the largest departure from the mean", () => {
    expect(compute({ l1: 100, l2: 100, l3: 100 }, 3, 415, 0.8)).toMatchObject({ kva: 71.88, kw: 57.5, imbalancePct: 0 });
    expect(compute({ l1: 110, l2: 100, l3: 90 }, 3, 415, 0.8).imbalancePct).toBe(10);
    expect(compute({ l1: 50 }, 1, 230, 1)).toMatchObject({ kva: 11.5, imbalancePct: null });
    expect(compute({ l1: 2, l2: 2, l3: 2 }, 3, 415, 0.8, 100).avgAmps).toBe(200); // through the CT ratio
  });

  test("the building load counts fresh incomers on the live side only, and picks the set by 30/80/90 of rating", () => {
    const l = loadNow();
    expect(l.mains).toBe("on");
    expect(l.sources.find(s => s.id === "PS-1")!.counted).toBe(true);
    expect(l.sources.find(s => s.id === "PS-3")!.why).toMatch(/never added/); // a feeder sits under its incomer
    expect(l.sources.find(s => s.id === "PS-2")!.why).toMatch(/too old/);     // last night's reading is history
    expect(l.totalKw).toBe(221.58);
    expect(l.options[0]).toMatchObject({ verdict: "Good", pct: 55.4 });
    expect(l.advice).toMatch(/^Start Main generator/);
    expect(recordClamp("PS-1", { l1: 400 }, "Emeka Obi")).toMatch(/all three phases/);
    const light = recordClamp("PS-1", { l1: 120, l2: 60, l3: 60 }, "Emeka Obi");
    expect(light).toMatchObject({ flag: "Act" }); // 50% out of balance
    expect(noticesFor("Musa Danladi", "MX").some(n => n.event === "power.load")).toBe(true);
    expect(loadNow().options[0].verdict).toBe("Light");
  });

  test("mains and sets are recorded as they happen and refused when they contradict what is recorded", () => {
    const t = now();
    expect(recordSwitch("Mains restored", {}, "Emeka Obi")).toMatch(/already recorded on/);
    expect(recordSwitch("Mains failed", { at: new Date(t.getTime() + 10 * 60000) }, "Emeka Obi")).toMatch(/future/);
    expect(recordSwitch("Set started", {}, "Emeka Obi")).toMatch(/Pick which generator/);
    expect(recordSwitch("Mains failed", { at: new Date(t.getTime() - 3 * 3600000) }, "Emeka Obi")).toMatch(/overlap/); // 07:15, inside last night's cut
    expect(recordSwitch("Mains failed", { at: new Date(t.getTime() - 5 * 60000) }, "Emeka Obi")).toMatchObject({ event: "Mains failed" });
    expect(noticesFor("Musa Danladi", "MX").find(n => n.event === "power.mainsOff")).toMatchObject({ level: "Urgent" });
    expect(recordSwitch("Mains failed", {}, "Emeka Obi")).toMatch(/recorded off since/);
    expect(plant().MAINS).toMatch(/^Off since/);
    // Mains off and no fresh reading on the set: the load falls back to mains and says so.
    expect(loadNow().advice).toMatch(/only|No generator has a current reading/);

    expect(recordSwitch("Set started", { assetId: "AST-004" }, "Emeka Obi")).toMatchObject({ event: "Set started" });
    expect(plantNow().sets[0].runningSince).toBeDefined();
    expect(plant().MAINS).toMatch(/Main generator 500 kVA running since/);
    expect(recordSwitch("Set started", { assetId: "AST-004" }, "Emeka Obi")).toMatch(/has been running since/);
    expect(recordSwitch("Mains restored", { at: new Date(t.getTime() - 60 * 60000) }, "Emeka Obi")).toMatch(/cannot come back before/);
    expect(recordSwitch("Mains restored", {}, "Emeka Obi")).toMatchObject({ event: "Mains restored" });
    expect(noticesFor("Musa Danladi", "MX").find(n => n.event === "power.mainsOn")!.body).toMatch(/still running/);
    const stop = recordSwitch("Set stopped", { assetId: "AST-004" }, "Emeka Obi");
    expect(stop).toMatchObject({ event: "Set stopped" });
    expect(plant().OUTAGES).toMatch(/^2,/); // this morning's cut that ran past 07:00, and this one

    expect(recordSwitch("Set faulty", { assetId: "AST-004", note: "Black smoke" }, "Emeka Obi")).toMatchObject({ event: "Set faulty" });
    expect(asset("AST-004")!.status).toBe("Offline");
    expect(noticesFor("Musa Danladi", "MX").find(n => n.event === "genset.fault")).toMatchObject({ level: "Urgent" });
    expect(recordSwitch("Set started", { assetId: "AST-004" }, "Emeka Obi")).toMatch(/marked offline/);
    expect(loadNow().options[0].verdict).toBe("Unavailable");
    asset("AST-004")!.status = "Operational";
    expect(switchLog()[0].event).toBe("Set faulty");
  });

  test("the generator log judges only what was read, against that set's own limits", () => {
    const g = genset("AST-004");
    expect(assess({ state: "Running", coolantC: 96 }, g)[0]).toMatchObject({ field: "Coolant", severity: "Act" });
    expect(assess({ state: "Running", coolantC: 91 }, g)[0].severity).toBe("Watch");
    expect(assess({ state: "Running" }, g)).toEqual([]);                        // blank: could not read it safely
    expect(assess({ state: "Stopped", coolantC: 30, oilBar: 0 }, g)).toEqual([]); // a stopped set is cold with no pressure
    expect(assess({ state: "Stopped", batteryV: 22 }, g)[0].severity).toBe("Watch");
    expect(assess({ state: "Running", volts: [400, 450, 400] }, g).map(f => f.severity)).toEqual(["Act", "Watch"]);
    expect(assess({ state: "Running", loadKw: 360 }, g)[0].severity).toBe("Watch"); // 90% of 400 kW
  });

  test("a reading out of range tells the supervisor at once; the shift count shows who logged", () => {
    expect(plant().GENLOG).toMatch(/Not logged this shift: Main generator/);
    expect(shiftLogStatus().sets[0].entries).toBe(0);
    expect(logGenset("AST-004", { state: "Running", oilBar: 1.4 }, "")).toMatch(/named person/);
    const e = logGenset("AST-004", { state: "Running", oilBar: 1.4, hoursMeter: 3300 }, "Emeka Obi");
    expect(typeof e === "object" && e.findings.map(f => f.field)).toEqual(["Oil pressure", "Hour meter"]);
    const sup = holdersOf("Supervisor")[0];
    expect(noticesFor(sup, "MX").find(n => n.event === "genset.outOfRange")).toMatchObject({ level: "Urgent", people: holdersOf("Supervisor") });
    expect(shiftLogStatus().sets[0]).toMatchObject({ entries: 1, worst: "Act" });
    expect(plant().GENLOG).toBe("Every set logged this shift");
  });

  test("a night shift that crosses midnight began the evening before", () => {
    const d = (h: number) => new Date(2026, 5, 24, h, 30);
    expect(shiftAt(d(23))).toMatchObject({ name: "Night", start: new Date(2026, 5, 24, 23, 0) });
    expect(shiftAt(d(3))).toMatchObject({ name: "Night", start: new Date(2026, 5, 23, 23, 0), end: new Date(2026, 5, 24, 7, 0) });
    expect(shiftAt(d(10)).name).toBe("Morning");
  });
});
