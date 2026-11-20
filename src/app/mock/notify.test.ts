import { describe, expect, test } from "vitest";
import { notify, noticesFor, unreadCount, markRead, setCurrentUser } from "./notify";
import { checkOut, addBooking } from "./hotel";
import { addWorkOrder } from "./maintenance";
import { requestApproval, decide } from "./approvals";
import { STAYS } from "./frontOffice";
import { BUSINESS_DATE } from "../constants";

const newest = (name: string, role: Parameters<typeof noticesFor>[1], event: string) => noticesFor(name, role).find(n => n.event === event);

describe("the bell", () => {
  test("a notice reaches its roles and named people, the manager sees all, and nobody hears their own action", () => {
    setCurrentUser("Chioma Nwosu", "FD");
    const n = notify("guest.checkedOut", { title: "T1", people: ["Fatima Musa"] });
    expect(noticesFor("Fatima Musa", "HK").some(x => x.id === n.id)).toBe(true);
    expect(noticesFor("Emeka Obi", "MX").some(x => x.id === n.id)).toBe(false);
    expect(noticesFor("Adaeze Okonkwo", "MGT").some(x => x.id === n.id)).toBe(true);
    expect(noticesFor("Chioma Nwosu", "MGT").some(x => x.id === n.id)).toBe(false);
  });

  test("urgent comes first, and low notices are listed but never counted on the bell", () => {
    setCurrentUser("Someone", "FD");
    const before = unreadCount("Tester", "FIN");
    const low = notify("foundItem.logged", { title: "Low", roles: ["FIN"] });
    expect(unreadCount("Tester", "FIN")).toBe(before);
    const urgent = notify("workOrder.raised", { title: "Urgent", level: "Urgent", roles: ["FIN"] });
    expect(unreadCount("Tester", "FIN")).toBe(before + 1);
    const list = noticesFor("Tester", "FIN");
    expect(list[0].id).toBe(urgent.id);
    expect(list.some(x => x.id === low.id)).toBe(true);
    markRead(urgent.id, "Tester");
    expect(unreadCount("Tester", "FIN")).toBe(before);
  });

  test("a high-priority job interrupts Maintenance; a low one waits on the bell", () => {
    setCurrentUser("Fatima Musa", "HK");
    addWorkOrder({ title: "Sparking socket", location: "Room 117", cat: "Electrical", priority: "High", reportedBy: "Fatima Musa", desc: "" });
    expect(noticesFor("Emeka Obi", "MX").find(n => n.title.endsWith("Sparking socket"))?.level).toBe("Urgent");
    addWorkOrder({ title: "Loose handle", location: "Room 117", cat: "Furniture", priority: "Low", reportedBy: "Fatima Musa", desc: "" });
    expect(noticesFor("Emeka Obi", "MX").find(n => n.title.endsWith("Loose handle"))?.level).toBe("Normal");
  });

  test("check-out tells Housekeeping, a booking tells Reservations, approvals reach approvers and come back to the asker", () => {
    setCurrentUser("Chioma Nwosu", "FD");
    checkOut(STAYS.find(s => s.room === "203")!.id);
    expect(newest("Fatima Musa", "HK", "guest.checkedOut")?.title).toBe("Room 203 is free to clean");
    addBooking({ guest: "Bell Test", room: "119", type: "Standard", checkin: BUSINESS_DATE, nights: 1, rate: 35000, source: "Phone" });
    expect(newest("Amina Yusuf", "RSV", "booking.made")?.title).toBe("New booking: Bell Test");
    const a = requestApproval({ kind: "Discount", dept: "Front Office", ref: "BK-BELL", title: "Guest", detail: "₦8,000 off", reason: "Noise", requestedBy: "Chioma Nwosu", apply: () => {} });
    expect(newest("Adaeze Okonkwo", "MGT", "approval.requested")?.level).toBe("High");
    expect(noticesFor("Chioma Nwosu", "FD").some(x => x.event === "approval.requested")).toBe(false);
    setCurrentUser("Adaeze Okonkwo", "MGT");
    decide(a.id, true, "Adaeze Okonkwo", "MGT");
    expect(newest("Chioma Nwosu", "FD", "approval.decided")?.title).toMatch(/approved/);
  });
});
