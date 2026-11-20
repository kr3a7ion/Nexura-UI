import { describe, expect, test } from "vitest";
import { roomState, roomCounts } from "./rooms";
import { ROOMS } from "./property";
import { STAYS, reservations } from "./frontOffice";
import { updateRoom } from "./housekeeping";
import { addWorkOrder, updateWorkOrder } from "./maintenance";

describe("room state", () => {
  test("every room is counted once and the demo day adds up", () => {
    const counts = Object.fromEntries(roomCounts().map(c => [c.state, c.count]));
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(ROOMS.length);
    expect(counts).toEqual({ Occupied: 35, "Arriving today": 2, "Out of order": 3, "Being cleaned": 2, Ready: 18 });
  });

  test("a guest in the room wins over everything else", () => {
    for (const s of STAYS) expect(roomState(s.room)).toBe("Occupied");
  });

  test("an out-of-order order takes a room out until it is closed or cancelled, not when it is only fixed", () => {
    expect(roomState("105")).toBe("Ready");
    const w = addWorkOrder({ title: "Leak", location: "Room 105", cat: "Plumbing", priority: "High", reportedBy: "Test", desc: "Leak", room: "105", outOfOrder: true });
    expect(roomState("105")).toBe("Out of order");
    updateWorkOrder(w.id, { status: "Fixed" });
    expect(roomState("105")).toBe("Out of order");
    updateWorkOrder(w.id, { status: "Closed" });
    expect(roomState("105")).not.toBe("Out of order");
  });

  test("a room Housekeeping marks dirty is being cleaned, and ready again once clean", () => {
    updateRoom("106", { hkSt: "Dirty" });
    expect(roomState("106")).toBe("Being cleaned");
    updateRoom("106", { hkSt: "Clean" });
    expect(roomState("106")).toBe("Ready");
  });
});

describe("reservations", () => {
  test("one list that agrees with Front Office", () => {
    const list = reservations();
    expect(new Set(list.map(r => r.id)).size).toBe(list.length);
    for (const s of STAYS) expect(list.find(r => r.id === s.id)).toMatchObject({ guest: s.guest, room: s.room, status: "Checked In" });
    for (const r of list) if (r.room) expect(r.type).toBe(ROOMS.find(x => x.id === r.room)?.type);
  });
});
