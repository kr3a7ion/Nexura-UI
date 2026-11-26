import { describe, expect, test } from "vitest";
import { recordDoorEvent, openAlarms, clearAlarm, remoteUnlock, askRemoteUnlock, doorEvents, locks, lockOf, canSeeDoorHistory } from "./doors";
import { waitingFor, decide } from "./approvals";
import { faultReports } from "./maintenance";
import { noticesFor } from "./notify";

describe("doors: alarms, batteries, offline locks, remote unlock", () => {
  test("a forced door rings Security and managers, and stays open until cleared with a note", () => {
    const e = recordDoorEvent("101", "Forced")!;
    expect(openAlarms().map(a => a.id)).toContain(e.id);
    expect(noticesFor("Ibrahim Danladi", "SEC").find(n => n.title.startsWith("Room 101: door forced"))?.level).toBe("Urgent");
    expect(clearAlarm(e.id, "Chioma Nwosu", "FD", "Checked")).toMatch(/Only Security or a manager/);
    expect(clearAlarm(e.id, "Ibrahim Danladi", "SEC", "")).toMatch(/what you found/);
    expect(clearAlarm(e.id, "Ibrahim Danladi", "SEC", "Guest's child pulled the handle")).toBeNull();
    expect(openAlarms().map(a => a.id)).not.toContain(e.id);
  });

  test("a low battery becomes one Maintenance fault report; an offline lock can't be opened remotely", () => {
    const before = faultReports().length;
    recordDoorEvent("102", "Low battery", "14"); recordDoorEvent("102", "Low battery", "12");
    expect(faultReports().length).toBe(before + 1);
    expect(faultReports()[0]).toMatchObject({ room: "102", reportedBy: "Door lock" });
    recordDoorEvent("103", "Offline");
    expect(lockOf("103")!.online).toBe(false);
    expect(remoteUnlock("103", "Ibrahim Danladi", "SEC", "Guest locked out")).toMatch(/offline/);
    recordDoorEvent("103", "Back online");
    expect(remoteUnlock("103", "Ibrahim Danladi", "SEC", "Guest locked out")).toBeNull();
    expect(doorEvents("103")[0]).toMatchObject({ kind: "Remote unlock", by: "Ibrahim Danladi", note: "Guest locked out" });
    expect(locks().length).toBeGreaterThan(10);
  });

  test("the front desk asks; the door opens only when Security or a manager approves; nobody approves their own", () => {
    expect(remoteUnlock("104", "Chioma Nwosu", "FD", "Guest locked out")).toMatch(/Ask Security/);
    expect(askRemoteUnlock("104", "Chioma Nwosu", "Guest locked out, ID checked")).toBeNull();
    expect(doorEvents("104").some(e => e.kind === "Remote unlock")).toBe(false);
    const a = waitingFor("SEC").find(x => x.kind === "Remote unlock" && x.ref === "104")!;
    expect(waitingFor("FD").some(x => x.id === a.id)).toBe(false);
    expect(decide(a.id, true, "Ibrahim Danladi", "SEC")).toBeNull();
    expect(doorEvents("104")[0]).toMatchObject({ kind: "Remote unlock", by: "Ibrahim Danladi", note: "Guest locked out, ID checked. Asked by Chioma Nwosu" });
    expect(canSeeDoorHistory("FD")).toBe(false);
    expect(canSeeDoorHistory("SEC")).toBe(true);
  });
});
