import { describe, expect, test } from "vitest";
import { levelOf, leadsOf, setLevel, setJobTitle, setBlocked, canOpen, staffRecord } from "./staff";

describe("department levels", () => {
  test("start from the job title", () => {
    expect(levelOf("Fatima Ibrahim")).toBe("Manager");      // Reservations Manager
    expect(levelOf("Grace Ojo")).toBe("Supervisor");        // Restaurant Supervisor
    expect(levelOf("Bola Adewale")).toBe("Supervisor");     // Maintenance Team Lead
    expect(levelOf("Chioma Nwosu")).toBe("Staff");
    expect(leadsOf("Front Desk")).toEqual(["Fatima Ibrahim"]);
  });
  test("HR and managers set anyone's; a department manager only staff and supervisors in their own; nobody their own", () => {
    expect(setLevel("Adaeze Okonkwo", "MGT", "Adaeze Okonkwo", "Staff")).toMatch(/own level/);
    expect(setLevel("Fatima Ibrahim", "FD", "Chioma Nwosu", "Supervisor")).toBeNull();
    expect(levelOf("Chioma Nwosu")).toBe("Supervisor");
    expect(setLevel("Fatima Ibrahim", "FD", "Amina Yusuf", "Manager")).toMatch(/Only HR/);
    expect(setLevel("Fatima Ibrahim", "FD", "Grace Ojo", "Staff")).toMatch(/Only HR or this department/);
    expect(setLevel("Chioma Nwosu", "FD", "Amina Yusuf", "Supervisor")).toMatch(/Only HR or this department/); // a supervisor can't
    expect(setLevel("Adaeze Okonkwo", "MGT", "Grace Ojo", "Manager")).toBeNull();
    expect(setLevel("Adaeze Okonkwo", "MGT", "Chioma Nwosu", "Staff")).toBeNull();
  });

  test("on leave is not a lead", () => {
    expect(leadsOf("Housekeeping")).toEqual([]);  // Ngozi Okonkwo, HK Supervisor, is on leave
  });
  test("job titles and what a person can open follow the same rule", () => {
    expect(setJobTitle("Fatima Ibrahim", "FD", "Amina Yusuf", "Senior Reservations Officer")).toBeNull();
    expect(staffRecord("Amina Yusuf")!.role).toBe("Senior Reservations Officer");
    expect(setJobTitle("Fatima Ibrahim", "FD", "Amina Yusuf", " ")).toMatch(/2 to 60/);
    expect(setJobTitle("Amina Yusuf", "RSV", "Amina Yusuf", "Boss")).toMatch(/own/);
    expect(setBlocked("Fatima Ibrahim", "FD", "Amina Yusuf", ["night-audit", "night-audit"])).toBeNull();
    expect(canOpen("Amina Yusuf", "RSV", "night-audit")).toBe(false);
    expect(canOpen("Amina Yusuf", "RSV", "arrivals")).toBe(true);
    expect(setBlocked("Fatima Ibrahim", "FD", "Grace Ojo", [])).toMatch(/Only HR or this department/);
    expect(canOpen("Adaeze Okonkwo", "MGT", "night-audit")).toBe(true);
  });
});
