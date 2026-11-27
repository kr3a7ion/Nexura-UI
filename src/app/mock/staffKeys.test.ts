import { describe, expect, test } from "vitest";
import { staffKeys, signOutKey, signBackKey, checkStaffKeys, shiftEnd, staffKeyLog } from "./staffKeys";
import { staffRecord } from "./staff";
import { setLockSettings, lockSettings, issueStayKeys } from "./access";
import { STAYS } from "./frontOffice";
import { now } from "./maintenance";

describe("staff keys per shift", () => {
  test("only Security or a manager hands one out, only to someone at work, until their shift ends", () => {
    expect(signOutKey("FK-1", "Fatima Musa", "Chioma Nwosu", "FD")).toMatch(/Only Security/);
    expect(signOutKey("FK-1", "Ngozi Okonkwo", "Ibrahim Danladi", "SEC")).toMatch(/not at work/);   // on leave
    expect(signOutKey("FK-1", "Fatima Musa", "Ibrahim Danladi", "SEC")).toBeNull();
    const k = staffKeys().find(x => x.id === "FK-1")!;
    expect(k.dueBack!.getHours()).toBe(15);                                                           // Morning 07:00–15:00
    expect(signOutKey("FK-1", "Amina Yusuf", "Ibrahim Danladi", "SEC")).toMatch(/not in the key cabinet/);
  });
  test("a night shift ends the next morning", () => {
    staffRecord("Tunde Afolabi")!.shift = "Night 23:00–07:00";
    const from = new Date(2026, 5, 24, 23, 30), end = shiftEnd("Tunde Afolabi", from);
    expect([end.getDate(), end.getHours()]).toEqual([25, 7]);
  });
  test("not back by the end of the shift is flagged once; a leaver's key is stopped", () => {
    const k = staffKeys().find(x => x.id === "FK-1")!;
    checkStaffKeys(new Date(k.dueBack!.getTime() + 60000)); checkStaffKeys(new Date(k.dueBack!.getTime() + 120000));
    expect(staffKeyLog().filter(l => l.keyId === "FK-1" && l.event === "Not back")).toHaveLength(1);
    expect(signBackKey("FK-1", "Ibrahim Danladi", "SEC")).toBeNull();
    expect(k.status).toBe("In");
    signOutKey("MK-01", "Samuel Okafor", "Ibrahim Danladi", "SEC");
    staffRecord("Samuel Okafor")!.status = "Left";
    checkStaffKeys(now());
    expect(staffKeys().find(x => x.id === "MK-01")!.status).toBe("Stopped");
    staffRecord("Samuel Okafor")!.status = "Active";
  });
});

describe("door lock settings", () => {
  test("Security leads and managers change them, within limits; new keys use them", () => {
    const s = { ...lockSettings() };
    expect(setLockSettings("Samuel Okafor", "SEC", { ...s, cardsPerStay: 2 })).toMatch(/Only Security's supervisors/);
    expect(setLockSettings("Ibrahim Danladi", "SEC", { ...s, cardsPerStay: 0 })).toMatch(/1 to 8/);
    expect(setLockSettings("Ibrahim Danladi", "SEC", { ...s, cardsPerStay: 2, passcodeLength: 8 })).toBeNull();
    const stay = STAYS[STAYS.length - 2];
    const out = issueStayKeys(stay.id, "Front desk", { cards: 5, passcode: true });
    expect(out.filter(k => k.kind === "Card")).toHaveLength(2);
    expect(out.find(k => k.kind === "Passcode")!.code).toHaveLength(8);
    setLockSettings("Adaeze Okonkwo", "MGT", s);
  });
});
