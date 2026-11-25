import { describe, expect, test } from "vitest";
import { onHand, available, takeForJob, returnFromJob, takenFor, claimFor, receive, adjust, transfer, item, ledger, lowStock } from "./stores";
import { addWorkOrder, moveWorkOrder, workOrder } from "./maintenance";
import { finishWorkOrder } from "./hotel";

const M = "Maintenance store", G = "Store house";
const newJob = () => {
  const w = addWorkOrder({ title: "Socket burnt", location: "Room 204", room: "204", cat: "Electrical", priority: "P3", reportedBy: "Fatima Musa", desc: "x" });
  expect(moveWorkOrder(w.id, "Assigned", { by: "Yusuf Garba", tech: "Emeka Obi" })).toBeNull();
  expect(moveWorkOrder(w.id, "Accepted", { by: "Emeka Obi" })).toBeNull();
  expect(moveWorkOrder(w.id, "In progress", { by: "Emeka Obi" })).toBeNull();
  return w.id;
};

describe("stores: one ledger, two stores", () => {
  test("every movement carries the balance it produced; nothing is written over", () => {
    const before = onHand(M, "STK-0071"), rows = ledger().length;
    receive(M, "STK-0071", 10, 2600, "Yusuf Garba", "Delivery note 4471");
    expect(onHand(M, "STK-0071")).toBe(before + 10);
    expect(ledger()[0]).toMatchObject({ kind: "Receive", balance: before + 10 });
    expect(ledger().length).toBe(rows + 1);
  });

  test("receiving at a new price re-weights the average cost", () => {
    const total = onHand(M, "STK-0072") + onHand(G, "STK-0072"); // 6 at ₦4,800
    receive(M, "STK-0072", 6, 6000, "Yusuf Garba");
    expect(item("STK-0072")!.avgCost).toBe(Math.round((total * 4800 + 6 * 6000) / (total + 6)));
  });

  test("a transfer moves stock both ways and no money; never more than the store has free", () => {
    const m = onHand(M, "STK-0080"), g = onHand(G, "STK-0080");
    expect(transfer(G, M, "STK-0080", 10, "Yusuf Garba")).toBeNull();
    expect([onHand(M, "STK-0080"), onHand(G, "STK-0080")]).toEqual([m + 10, g - 10]);
    expect(ledger().slice(0, 2).map(r => r.kind).sort()).toEqual(["Transfer in", "Transfer out"]);
    expect(transfer(M, G, "STK-0080", 5, "Yusuf Garba")).toBeNull();
    expect(transfer(G, M, "STK-0080", 9999, "Yusuf Garba")).toMatch(/has \d+ pcs to give/);
  });

  test("an adjustment needs a reason and cannot take off what jobs hold", () => {
    expect(adjust(M, "STK-0052", -1, "", "Yusuf Garba")).toMatch(/Say why/);
    // WO-0094 holds one shower cartridge: it is off the shelf, so the count can only lose what is free.
    expect(adjust(M, "STK-0052", -onHand(M, "STK-0052"), "Broken in the box", "Yusuf Garba")).toMatch(/can come off/);
  });
});

describe("materials on a job (taken, claimed, confirmed, issued)", () => {
  test("taken items are held, not issued: the shelf count stays, what is free drops", () => {
    const id = newJob(), shelf = onHand(M, "STK-0071"), free = available(M, "STK-0071");
    expect(takeForJob(id, "STK-0071", 2, "Emeka Obi")).toBeNull();
    expect(onHand(M, "STK-0071")).toBe(shelf);
    expect(available(M, "STK-0071")).toBe(free - 2);
    expect(takeForJob(id, "STK-0071", 9999, "Emeka Obi")).toMatch(/free/);
    expect(returnFromJob(id, "STK-0071", 3, "Emeka Obi")).toMatch(/holds 2/);
  });

  test("completed: unused items go back; the supervisor's confirmation issues them onto the job's cost", () => {
    const id = newJob(), shelf = onHand(M, "STK-0071"), free = available(M, "STK-0071");
    takeForJob(id, "STK-0071", 3, "Emeka Obi");
    expect(moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "Replaced the socket", used: [{ sku: "STK-0071", qty: 2 }] })).toBeNull();
    expect(takenFor(id)).toEqual([{ sku: "STK-0071", qty: 2 }]);                 // the third went back on the shelf
    expect(available(M, "STK-0071")).toBe(free - 2);
    expect(onHand(M, "STK-0071")).toBe(shelf);                                    // still nothing issued
    expect(moveWorkOrder(id, "Verified", { by: "Yusuf Garba" })).toBeNull();     // confirmed as claimed
    expect(onHand(M, "STK-0071")).toBe(shelf - 2);
    expect(ledger()[0]).toMatchObject({ kind: "Issue", qty: -2, job: id, by: "Yusuf Garba" });
    expect(workOrder(id)!.parts).toEqual([expect.objectContaining({ item: "13 A socket outlet", qty: 2, unit: item("STK-0071")!.avgCost })]);
    expect(takenFor(id)).toEqual([]);
  });

  test("the supervisor corrects the list only with a reason", () => {
    const id = newJob(), shelf = onHand(M, "STK-0072");
    takeForJob(id, "STK-0072", 2, "Emeka Obi");
    moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "Changed the breakers", used: [{ sku: "STK-0072", qty: 2 }] });
    expect(moveWorkOrder(id, "Verified", { by: "Yusuf Garba", confirmed: [{ sku: "STK-0072", qty: 1 }] })).toMatch(/Say why/);
    expect(moveWorkOrder(id, "Verified", { by: "Yusuf Garba", confirmed: [{ sku: "STK-0072", qty: 1 }], materialsReason: "One breaker was still good and went back" })).toBeNull();
    expect(onHand(M, "STK-0072")).toBe(shelf - 1);
  });

  test("sent back: nothing is issued and what was taken stays with the technician", () => {
    const id = newJob(), shelf = onHand(M, "STK-0018");
    takeForJob(id, "STK-0018", 1, "Emeka Obi");
    moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "Sealed", used: [{ sku: "STK-0018", qty: 1 }] });
    expect(claimFor(id)).toEqual([{ sku: "STK-0018", qty: 1 }]);
    expect(moveWorkOrder(id, "In progress", { by: "Yusuf Garba", note: "Still leaking at the corner" })).toBeNull();
    expect(claimFor(id)).toBeUndefined();
    expect(takenFor(id)).toEqual([{ sku: "STK-0018", qty: 1 }]);
    expect(onHand(M, "STK-0018")).toBe(shelf);
  });

  test("completing with nothing used puts everything back; a job holding items cannot be cancelled", () => {
    const id = newJob(), free = available(M, "STK-0080");
    takeForJob(id, "STK-0080", 4, "Emeka Obi");
    expect(finishWorkOrder(id, "Cancelled", "Yusuf Garba", "Raised twice").refused).toMatch(/Return them to the store first/);
    expect(moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "Bulbs were fine, loose connection", used: [] })).toBeNull();
    expect(available(M, "STK-0080")).toBe(free);
  });

  test("a claim above what was taken needs the extra free in the store", () => {
    const id = newJob();
    expect(moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "x", used: [{ sku: "STK-0052", qty: 9999 }] })).toMatch(/more than the store has free/);
    expect(moveWorkOrder(id, "Completed", { by: "Emeka Obi", note: "x", used: [{ sku: "STK-0063", qty: 1 }, { sku: "STK-0063", qty: 1 }] })).toMatch(/listed twice/);
  });

  test("low stock counts what is free, not what is on the shelf", () => {
    expect(lowStock().some(l => l.item.sku === "STK-0052")).toBe(available(M, "STK-0052") <= 2);
  });
});

import { addItem, editItem, removeItem, items as allItems, startCount, recordCount, countDifferences, postCount, openCount, cancelCount } from "./stores";
describe("store setup: items", () => {
  test("add with or without a shelf; names stay unique; edit and remove", () => {
    expect(addItem({ name: " ", cat: "Plumbing", unit: "pcs" })).toMatch(/Enter the name/);
    expect(addItem({ name: "shower cartridge", cat: "Plumbing", unit: "pcs" })).toMatch(/already in the store/);
    const it = addItem({ name: "Ball valve 1/2 in", cat: "Plumbing", unit: "pcs", min: 3 });
    expect(it).toMatchObject({ shelf: undefined, min: { "Maintenance store": 3 } });          // the shelf is optional
    const sku = (it as { sku: string }).sku;
    expect(editItem(sku, { name: "Ball valve 1/2 in", cat: "Plumbing", shelf: "Rack A, shelf 3", unit: "pcs", min: 4 })).toBeNull();
    expect(item(sku)).toMatchObject({ shelf: "Rack A, shelf 3", min: { "Maintenance store": 4 } });
    expect(removeItem(sku)).toBeNull();                                                         // never moved: gone
    expect(allItems().some(i => i.sku === sku)).toBe(false);
  });

  test("an item with stock cannot go; one with history is retired and keeps its name", () => {
    const sku = (addItem({ name: "Gate valve 1 in", cat: "Plumbing", unit: "pcs" }) as { sku: string }).sku;
    receive(M, sku, 2, 5000, "Yusuf Garba");
    expect(removeItem(sku)).toMatch(/still has stock/);
    adjust(M, sku, -2, "Returned to the supplier", "Yusuf Garba");
    expect(removeItem(sku)).toBeNull();
    expect(allItems().some(i => i.sku === sku)).toBe(false);
    expect(item(sku)?.name).toBe("Gate valve 1 in");                                           // history still reads
  });
});

describe("stock count", () => {
  test("the shelf is judged against the books less what jobs hold; one count at a time", () => {
    cancelCount();
    const shelfNow = available(M, "STK-0044");                // WO-0091 holds refrigerant: it is off the shelf
    expect(startCount(M, "Yusuf Garba")).toMatchObject({ store: M });
    expect(startCount(M, "Yusuf Garba")).toMatch(/already open/);
    expect(recordCount("STK-0044", shelfNow)).toBeNull();     // the shelf matches: no difference
    expect(recordCount("STK-0063", available(M, "STK-0063") - 1)).toBeNull(); // one hinge missing
    expect(countDifferences().find(d => d.sku === "STK-0044")!.diff).toBe(0);
    const hinges = onHand(M, "STK-0063");
    expect(postCount("Yusuf Garba")).toEqual([{ sku: "STK-0063", qty: -1 }]);
    expect(onHand(M, "STK-0063")).toBe(hinges - 1);
    expect(ledger()[0].reason).toMatch(/Stock count SC-/);
    expect(openCount()).toBeUndefined();
  });

  test("a job taking items or a delivery while the count runs is neither a loss nor a gain", () => {
    cancelCount();
    const id = newJob();
    startCount(M, "Yusuf Garba");
    takeForJob(id, "STK-0071", 2, "Emeka Obi");                          // before this shelf is counted
    recordCount("STK-0071", available(M, "STK-0071"));                   // the counter sees two fewer: right
    recordCount("STK-0072", available(M, "STK-0072"));
    receive(M, "STK-0072", 5, 4800, "Yusuf Garba");                      // after this shelf was counted
    const mcb = onHand(M, "STK-0072");
    expect(postCount("Yusuf Garba")).toEqual([]);
    expect(onHand(M, "STK-0072")).toBe(mcb);                             // the delivery is kept, not counted away
  });
});

import { recordPurchase } from "./maintenance";
import { waitingFor, decide } from "./approvals";
import { maintenanceExceptions } from "./maintenanceHome";
describe("purchases on a job", () => {
  test("up to the supervisor's limit it goes straight onto the job's cost", () => {
    const id = newJob();
    expect(recordPurchase(id, { item: "Brass union 1/2 in", qty: 2, unit: 3500, supplier: "Wuse market", receipt: "R-118" }, "Emeka Obi")).toBe("Added");
    expect(workOrder(id)!.parts.at(-1)).toMatchObject({ item: "Brass union 1/2 in", qty: 2, unit: 3500, ref: "Bought from Wuse market, receipt R-118" });
    expect(recordPurchase(id, { item: "", qty: 1, unit: 1, supplier: "x" }, "Emeka Obi")).toMatch(/what was bought/);
  });

  test("over the limit it waits for someone else's approval and lands on the job only then", () => {
    const id = newJob(), before = workOrder(id)!.parts.length;
    expect(recordPurchase(id, { item: "Water heater element 3 kW", qty: 2, unit: 38000, supplier: "Ariaria Electricals" }, "Emeka Obi")).toBe("Waiting for approval");
    expect(workOrder(id)!.parts.length).toBe(before);
    const a = waitingFor("MGT").find(x => x.kind === "Purchase" && x.title.startsWith(id))!;
    expect(a.detail).toMatch(/₦76,000/);
    expect(decide(a.id, true, "Emeka Obi", "MGT")).toMatch(/Someone else/);                // nobody approves their own
    expect(decide(a.id, true, "Adaeze Okonkwo", "MGT")).toBeNull();
    expect(workOrder(id)!.parts.at(-1)).toMatchObject({ item: "Water heater element 3 kW", qty: 2, unit: 38000 });
  });

  test("low free stock shows on the Maintenance home", () => {
    const sku = "STK-0071";                                    // reorder at 5
    receive(M, sku, 10, 2600, "Yusuf Garba");
    expect(maintenanceExceptions().some(e => e.id === `MX-LOW-${sku}`)).toBe(false);
    expect(takeForJob(newJob(), sku, available(M, sku) - 1, "Emeka Obi")).toBeNull(); // one left free
    expect(maintenanceExceptions().find(e => e.id === `MX-LOW-${sku}`)).toMatchObject({ severity: "Warning", detail: expect.stringMatching(/^1 pcs free/) });
  });
});
