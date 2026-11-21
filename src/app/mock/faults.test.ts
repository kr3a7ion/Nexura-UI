import { describe, expect, test } from "vitest";
import { reportFault, makeJob, turnDown, faultReports, reportsBy, workOrders } from "./maintenance";
import { noticesFor, setCurrentUser } from "./notify";
import { roomState } from "./rooms";

const report = (over: Partial<Parameters<typeof reportFault>[0]> = {}) => reportFault({ title: "Leak under sink", location: "Room 209", room: "209", desc: "Water on the floor", reportedBy: "Amaka Osei", dept: "Housekeeping", guestCannotUse: false, danger: false, ...over });

describe("fault reports", () => {
  test("a report is not a job, and Maintenance is told how urgent it sounds", () => {
    setCurrentUser("Amaka Osei", "HK");
    const before = workOrders().length;
    const r = report({ danger: true });
    expect(workOrders().length).toBe(before);
    expect(r.status).toBe("New");
    expect(noticesFor("Emeka Obi", "MX").find(n => n.title === "Fault reported: Leak under sink")?.level).toBe("Urgent");
    expect(reportsBy("Amaka Osei").some(x => x.id === r.id)).toBe(true);
    expect(reportsBy("Chioma Nwosu").some(x => x.id === r.id)).toBe(false);
  });

  test("Maintenance makes it a job once, sets the priority, and the reporter is told", () => {
    const r = report({ title: "Toilet running", room: "211", location: "Room 211", guestCannotUse: true });
    setCurrentUser("Emeka Obi", "MX");
    const job = makeJob(r.id, { priority: "Medium", outOfOrder: true, cat: "Plumbing", by: "Emeka Obi" })!;
    expect(job.priority).toBe("Medium");
    expect(job.reportedBy).toBe("Amaka Osei");
    expect(roomState("211")).toBe("Occupied"); // a guest is in 211, so the room stays occupied though the job holds it
    expect(makeJob(r.id, { priority: "High", outOfOrder: false, cat: "Plumbing", by: "Emeka Obi" })).toBeNull(); // no second job
    expect(faultReports().find(x => x.id === r.id)).toMatchObject({ status: "Made into a job", jobId: job.id });
    expect(noticesFor("Amaka Osei", "HK").some(n => n.title === `Your report is now ${job.id}`)).toBe(true);
  });

  test("turning a report down needs a reason, which the reporter sees", () => {
    const r = report({ title: "Paint chipped", room: "212", location: "Room 212" });
    setCurrentUser("Emeka Obi", "MX");
    expect(turnDown(r.id, "  ", "Emeka Obi")).toBe(false);
    expect(turnDown(r.id, "Repainting is booked for the whole floor next month", "Emeka Obi")).toBe(true);
    expect(makeJob(r.id, { priority: "Low", outOfOrder: false, cat: "General", by: "Emeka Obi" })).toBeNull();
    expect(noticesFor("Amaka Osei", "HK").find(n => n.title === "Report turned down: Paint chipped")?.body).toBe("Emeka Obi: Repainting is booked for the whole floor next month");
  });
});
