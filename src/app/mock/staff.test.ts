import { describe, expect, test } from "vitest";
import { levelOf, leadsOf, setLevel } from "./staff";

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
});
