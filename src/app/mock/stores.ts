// Stores, as FacilityFlow keeps them (services/stores.ts, 0007), with materials on a job as Gideon runs it (25 Nov).
// One item list, two stores (Maintenance and the Store house), and an append-only ledger: every movement carries the balance it
// produced in its store, and a balance is never written directly.
//
// Materials on a job: the technician takes items from the maintenance store against the job; they are HELD (off the
// shelf, not yet off the books, so the store never promises them to anyone else). Marking the job completed states what
// was used; anything taken and not used goes back on the shelf. The supervisor verifying the job confirms or corrects that
// list, and only then is it ISSUED out of the store at average cost onto the job's cost. Sent back, nothing is issued and
// what was taken stays held. A job cannot be cancelled while it still holds anything.
// Seeds use the business date: mock/maintenance.ts imports this file and calls it only at run time.
import { BUSINESS_DATE } from "../constants";
import { notify } from "./notify";
import { now, workOrder, updateWorkOrder } from "./maintenance";

export const STORES = ["Maintenance store", "Store house"] as const;
export type StoreName = typeof STORES[number];
// Every item has a category and a shelf, so the screen reads like the store looks.
export type Item = { sku: string; name: string; cat: string; shelf: string; unit: string; avgCost: number; min: Partial<Record<StoreName, number>> };
export type MoveKind = "Receive" | "Issue" | "Adjust" | "Transfer in" | "Transfer out";
export type Movement = { id: string; at: Date; sku: string; store: StoreName; kind: MoveKind; qty: number; unitCost: number; balance: number; job?: string; by: string; reason?: string };
export type Line = { sku: string; qty: number };

const ITEMS: Item[] = [
  { sku: "STK-0052", name: "Shower cartridge", cat: "Plumbing", shelf: "Rack A, shelf 1", unit: "pcs", avgCost: 12500, min: { "Maintenance store": 2 } },
  { sku: "STK-0018", name: "Silicone sealant", cat: "Plumbing", shelf: "Rack A, shelf 2", unit: "tube", avgCost: 3500, min: { "Maintenance store": 4 } },
  { sku: "STK-0044", name: "R-410A refrigerant (1 kg)", cat: "HVAC", shelf: "Gas cage", unit: "kg", avgCost: 8500, min: { "Maintenance store": 2 } },
  { sku: "STK-0041", name: "Condenser filter", cat: "HVAC", shelf: "Rack B, shelf 1", unit: "pcs", avgCost: 2200, min: { "Maintenance store": 3 } },
  { sku: "STK-0063", name: "Cabinet hinge", cat: "Carpentry", shelf: "Rack C, bin 4", unit: "pcs", avgCost: 1800, min: { "Maintenance store": 6 } },
  { sku: "STK-0071", name: "13 A socket outlet", cat: "Electrical", shelf: "Rack D, shelf 1", unit: "pcs", avgCost: 2600, min: { "Maintenance store": 5 } },
  { sku: "STK-0072", name: "MCB 32 A single pole", cat: "Electrical", shelf: "Rack D, shelf 2", unit: "pcs", avgCost: 4800, min: { "Maintenance store": 3 } },
  { sku: "STK-0080", name: "LED bulb 12 W", cat: "Lighting", shelf: "Rack D, shelf 3", unit: "pcs", avgCost: 1500, min: { "Maintenance store": 10, "Store house": 20 } },
  { sku: "CLN-001", name: "Floor cleaner 5 L", cat: "Cleaning", shelf: "Bay 2", unit: "jerrycan", avgCost: 2200, min: { "Store house": 20 } },
];
const LEDGER: Movement[] = [];
let seq = 0;
const at = (day: number, h: number) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate() + day, h);
const write = (m: Omit<Movement, "id" | "balance">) => {
  const balance = onHand(m.store, m.sku) + m.qty;
  const row = { ...m, id: `SM-${String(++seq).padStart(4, "0")}`, balance };
  LEDGER.push(row); return row;
};
// Opening stock a month ago, and what earlier jobs used.
([["STK-0052", 4], ["STK-0018", 10], ["STK-0044", 6], ["STK-0041", 8], ["STK-0063", 12], ["STK-0071", 15], ["STK-0072", 6], ["STK-0080", 30]] as const)
  .forEach(([sku, qty]) => write({ at: at(-30, 9), sku, store: "Maintenance store", kind: "Receive", qty, unitCost: ITEMS.find(i => i.sku === sku)!.avgCost, by: "Yusuf Garba", reason: "Opening stock" }));
([["STK-0080", 60], ["CLN-001", 18]] as const)
  .forEach(([sku, qty]) => write({ at: at(-30, 9), sku, store: "Store house", kind: "Receive", qty, unitCost: ITEMS.find(i => i.sku === sku)!.avgCost, by: "Store keeper", reason: "Opening stock" }));
write({ at: at(-2, 12), sku: "STK-0063", store: "Maintenance store", kind: "Issue", qty: -2, unitCost: 1800, job: "WO-0087", by: "Emeka Obi" });

// Held: taken off the shelf for a job, not yet issued. Claim: what the technician said they used, waiting for the supervisor.
const HELD: Record<string, Record<string, number>> = { "WO-0094": { "STK-0052": 1, "STK-0018": 1 }, "WO-0091": { "STK-0044": 1, "STK-0041": 1 } };
const CLAIM: Record<string, Line[]> = {};

export const items = () => ITEMS;
export const item = (sku: string) => ITEMS.find(i => i.sku === sku);
export const ledger = (store?: StoreName) => (store ? LEDGER.filter(m => m.store === store) : LEDGER).slice().reverse();
// A function declaration so the opening stock above can be written while this file loads.
export function onHand(store: StoreName, sku: string) { for (let i = LEDGER.length - 1; i >= 0; i--) if (LEDGER[i].store === store && LEDGER[i].sku === sku) return LEDGER[i].balance; return 0; }
export const held = (sku: string) => Object.values(HELD).reduce((n, h) => n + (h[sku] ?? 0), 0);
/** What a store can still give out: the maintenance store's shelf less what jobs already hold. */
export const available = (store: StoreName, sku: string) => onHand(store, sku) - (store === "Maintenance store" ? held(sku) : 0);
export const takenFor = (job: string): Line[] => Object.entries(HELD[job] ?? {}).filter(([, q]) => q > 0).map(([sku, qty]) => ({ sku, qty }));
export const claimFor = (job: string) => CLAIM[job];
export const lowStock = () => STORES.flatMap(store => ITEMS.filter(i => i.min[store] != null && available(store, i.sku) <= i.min[store]!).map(i => ({ store, item: i, left: available(store, i.sku) })));
const label = (l: Line) => `${l.qty} × ${item(l.sku)?.name ?? l.sku}`;
const whole = (q: number) => Number.isFinite(q) && q > 0 && Math.round(q * 100) === q * 100;

// ── Movements in the store itself
export const receive = (store: StoreName, sku: string, qty: number, unitCost: number, by: string, ref?: string): Movement | string => {
  const it = item(sku); if (!it) return "Choose an item.";
  if (!whole(qty)) return "Enter how many came in.";
  if (!(unitCost >= 0)) return "Enter what each one cost.";
  // Average cost is re-weighted across every store: a transfer moves stock, never money.
  const total = STORES.reduce((n, s) => n + onHand(s, sku), 0);
  it.avgCost = Math.round((total * it.avgCost + qty * unitCost) / (total + qty));
  return write({ at: now(), sku, store, kind: "Receive", qty, unitCost, by, reason: ref?.trim() || undefined });
};

export const adjust = (store: StoreName, sku: string, qty: number, reason: string, by: string): Movement | string => {
  const it = item(sku); if (!it) return "Choose an item.";
  if (!qty || !Number.isFinite(qty)) return "Enter how many to add or take off.";
  if (reason.trim().length < 5) return "Say why the count is being changed.";
  if (qty < 0 && -qty > available(store, sku)) return `Only ${available(store, sku)} ${it.unit} can come off: the rest is on the shelf for jobs or not there.`;
  return write({ at: now(), sku, store, kind: "Adjust", qty, unitCost: it.avgCost, by, reason: reason.trim() });
};

/** Out of one store and into the other in one step, at average cost: two rows, no money changes hands. */
export const transfer = (from: StoreName, to: StoreName, sku: string, qty: number, by: string, note?: string): string | null => {
  const it = item(sku); if (!it) return "Choose an item.";
  if (from === to) return "Choose two different stores.";
  if (!whole(qty)) return "Enter how many to move.";
  if (qty > available(from, sku)) return `${from} has ${available(from, sku)} ${it.unit} to give.`;
  const reason = note?.trim() || undefined, t = now();
  write({ at: t, sku, store: from, kind: "Transfer out", qty: -qty, unitCost: it.avgCost, by, reason });
  write({ at: t, sku, store: to, kind: "Transfer in", qty, unitCost: it.avgCost, by, reason });
  return null;
};

// ── Materials on a job
const workable = (job: string) => { const w = workOrder(job); return w && ["Accepted", "In progress", "On hold"].includes(w.status) ? w : undefined; };

export const takeForJob = (job: string, sku: string, qty: number, by: string): string | null => {
  const it = item(sku); if (!it) return "Choose an item.";
  if (!workable(job)) return "Items are taken for a job once it has been accepted and before it is completed.";
  if (!whole(qty)) return "Enter how many you are taking.";
  if (qty > available("Maintenance store", sku)) return `The maintenance store has ${available("Maintenance store", sku)} ${it.unit} of ${it.name} free.`;
  (HELD[job] ??= {})[sku] = (HELD[job][sku] ?? 0) + qty;
  updateWorkOrder(job, {}, { event: "Taken from the store", by, note: label({ sku, qty }) });
  if (available("Maintenance store", sku) <= (it.min["Maintenance store"] ?? -1))
    notify("stock.low", { title: `${it.name} is running low`, body: `${available("Maintenance store", sku)} ${it.unit} left free in the maintenance store.`, link: { screen: "mx-stores", label: "Stores" } });
  return null;
};

export const returnFromJob = (job: string, sku: string, qty: number, by: string): string | null => {
  const has = HELD[job]?.[sku] ?? 0;
  if (!whole(qty) || qty > has) return `This job holds ${has} of that item.`;
  HELD[job][sku] = has - qty;
  updateWorkOrder(job, {}, { event: "Returned to the store", by, note: label({ sku, qty }) });
  return null;
};

const sameList = (a: Line[], b: Line[]) => { const k = (l: Line[]) => l.filter(x => x.qty > 0).map(x => `${x.sku}:${x.qty}`).sort().join(","); return k(a) === k(b); };
const checkLines = (job: string, lines: Line[]): string | null => {
  const seen = new Set<string>();
  for (const l of lines) {
    const it = item(l.sku); if (!it) return "Choose an item for every line.";
    if (seen.has(l.sku)) return `${it.name} is listed twice.`; seen.add(l.sku);
    if (!whole(l.qty)) return `Enter how many ${it.name} were used.`;
    // More than was taken is fine only if the store still has the extra free.
    const extra = l.qty - (HELD[job]?.[l.sku] ?? 0);
    if (extra > 0 && extra > available("Maintenance store", l.sku)) return `${l.qty} × ${it.name} is more than was taken for this job and more than the store has free.`;
  }
  return null;
};

/** Run by moveWorkOrder before a job is marked completed. */
export const checkClaim = (job: string, used: Line[]) => checkLines(job, used);
/** After completion: what was taken and not used goes back on the shelf; the job now holds exactly what it claims. */
export const commitClaim = (job: string, used: Line[], by: string) => {
  const back = takenFor(job).map(h => ({ sku: h.sku, qty: h.qty - (used.find(u => u.sku === h.sku)?.qty ?? 0) })).filter(l => l.qty > 0);
  HELD[job] = Object.fromEntries(used.map(l => [l.sku, l.qty]));
  CLAIM[job] = used.map(l => ({ ...l }));
  if (back.length) updateWorkOrder(job, {}, { event: "Returned to the store", by, note: `Not used: ${back.map(label).join(", ")}` });
};
/** Run by moveWorkOrder before a job is verified: the supervisor's list, and a reason when it differs from the claim. */
export const checkConfirm = (job: string, confirmed: Line[], reason?: string): string | null => {
  if (!sameList(confirmed, CLAIM[job] ?? []) && (reason?.trim().length ?? 0) < 5) return "Say why the materials differ from what was claimed.";
  return checkLines(job, confirmed);
};
/** After verification: issue what was confirmed, at average cost, onto the job. Returns the lines for the job's cost. */
export const issueConfirmed = (job: string, confirmed: Line[], by: string, reason?: string) => {
  const parts = confirmed.filter(l => l.qty > 0).map(l => {
    const it = item(l.sku)!, m = write({ at: now(), sku: l.sku, store: "Maintenance store", kind: "Issue", qty: -l.qty, unitCost: it.avgCost, job, by, reason: reason?.trim() || undefined });
    return { item: it.name, qty: l.qty, unit: it.avgCost, ref: m.id };
  });
  delete HELD[job]; delete CLAIM[job];
  return parts;
};
/** Sent back to the technician: nothing is issued, what was taken stays with them, and they claim again. */
export const clearClaim = (job: string) => { delete CLAIM[job]; };
