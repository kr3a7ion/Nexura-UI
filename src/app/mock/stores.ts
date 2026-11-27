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
import { leadsOf } from "./staff";

// The store house is its own department over every department's store (decided 25 Nov): it runs the central store,
// buys through procurement, and keeps every department store's catalogue. Each department store belongs to a department.
export const STORE_DEPT = {
  "Store house": "Store house",
  "Front Office supplies": "Front Desk", "HR & admin supplies": "HR", "Maintenance store": "Maintenance", "Fleet parts": "Fleet",
  "Kitchen": "Kitchen", "Restaurant": "Restaurant", "Bar": "Restaurant", "Minibar": "Housekeeping", "Housekeeping supplies": "Housekeeping",
  "Linen": "Housekeeping", "Laundry": "Laundry", "Uniforms": "HR", "Security": "Security", "IT": "IT",
  "Spa & gym": "Spa", "Pool & grounds": "Maintenance", "Banquet & events": "Banquet",
} as const;
export type StoreName = keyof typeof STORE_DEPT;
export const STORES = Object.keys(STORE_DEPT) as StoreName[];
// Every item has a category, and a shelf where one is set, so the screen reads like the store looks. A retired item
// keeps its name for the history but is no longer offered.
export type Item = { sku: string; name: string; cat: string; shelf?: string; unit: string; avgCost: number; min: Partial<Record<StoreName, number>>; retired?: boolean };
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
  { sku: "CLN-001", name: "Floor cleaner 5 L", cat: "Cleaning", shelf: "Bay 2", unit: "jerrycan", avgCost: 2200, min: { "Store house": 20, "Housekeeping supplies": 6 } },
  { sku: "AMN-001", name: "Bath soap 40 g", cat: "Guest amenities", shelf: "Bay 3", unit: "pcs", avgCost: 150, min: { "Store house": 300, "Housekeeping supplies": 120 } },
  { sku: "AMN-002", name: "Shampoo 30 ml", cat: "Guest amenities", shelf: "Bay 3", unit: "pcs", avgCost: 180, min: { "Store house": 300, "Housekeeping supplies": 120 } },
  { sku: "LIN-001", name: "Bed sheet, king", cat: "Bed linen", shelf: "Linen room, shelf 1", unit: "pcs", avgCost: 9500, min: { "Linen": 60 } },
  { sku: "LIN-002", name: "Bath towel", cat: "Bath linen", shelf: "Linen room, shelf 3", unit: "pcs", avgCost: 4200, min: { "Linen": 80 } },
  { sku: "MNB-001", name: "Bottled water 75 cl", cat: "Drinks", shelf: "Cold room", unit: "bottle", avgCost: 250, min: { "Store house": 240, "Minibar": 60 } },
  { sku: "BAR-001", name: "Lager beer 60 cl", cat: "Beer", shelf: "Bar store, rack 1", unit: "bottle", avgCost: 900, min: { "Bar": 48 } },
  { sku: "KIT-001", name: "Rice, 50 kg bag", cat: "Dry goods", shelf: "Dry store, rack 1", unit: "bag", avgCost: 78000, min: { "Kitchen": 2 } },
  { sku: "KIT-002", name: "Vegetable oil 25 L", cat: "Dry goods", shelf: "Dry store, rack 2", unit: "jerrycan", avgCost: 52000, min: { "Kitchen": 1 } },
  { sku: "LAU-001", name: "Laundry detergent 20 kg", cat: "Chemicals", shelf: "Chemical cage", unit: "bag", avgCost: 41000, min: { "Laundry": 2 } },
  { sku: "FOS-001", name: "Registration card pad", cat: "Stationery", shelf: "Back office drawer", unit: "pad", avgCost: 2500, min: { "Front Office supplies": 4 } },
  { sku: "FOS-002", name: "Blank key card", cat: "Key cards", shelf: "Back office safe", unit: "pcs", avgCost: 900, min: { "Store house": 100, "Front Office supplies": 40 } },
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
([["Store house", "STK-0080", 60], ["Store house", "CLN-001", 18], ["Store house", "AMN-001", 900], ["Store house", "AMN-002", 650], ["Store house", "MNB-001", 480],
  ["Store house", "FOS-002", 400], ["Housekeeping supplies", "CLN-001", 5], ["Housekeeping supplies", "AMN-001", 140], ["Housekeeping supplies", "AMN-002", 90],
  ["Linen", "LIN-001", 120], ["Linen", "LIN-002", 150], ["Minibar", "MNB-001", 48], ["Bar", "BAR-001", 96], ["Kitchen", "KIT-001", 3], ["Kitchen", "KIT-002", 2],
  ["Laundry", "LAU-001", 3], ["Front Office supplies", "FOS-001", 6], ["Front Office supplies", "FOS-002", 35]] as const)
  .forEach(([store, sku, qty]) => write({ at: at(-30, 9), sku, store, kind: "Receive", qty, unitCost: ITEMS.find(i => i.sku === sku)!.avgCost, by: "Halima Bako", reason: "Opening stock" }));
write({ at: at(-2, 12), sku: "STK-0063", store: "Maintenance store", kind: "Issue", qty: -2, unitCost: 1800, job: "WO-0087", by: "Emeka Obi" });

// Held: taken off the shelf for a job, not yet issued. Claim: what the technician said they used, waiting for the supervisor.
const HELD: Record<string, Record<string, number>> = { "WO-0094": { "STK-0052": 1, "STK-0018": 1 }, "WO-0091": { "STK-0044": 1, "STK-0041": 1 } };
const CLAIM: Record<string, Line[]> = {};

export const items = () => ITEMS.filter(i => !i.retired);
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

// ── Who keeps which store. The store house's staff (and hotel managers) keep every store: catalogue, receiving what
// procurement buys, moving stock out to departments. A department's own store is also kept by its supervisors and
// managers at work, and by anyone the store house names for it, so a department can enter what it gets itself.
const KEEPERS: Partial<Record<StoreName, string[]>> = {};
export const storeHouseStaff = (by: string, role: string) => role === "MGT" || role === "STH";
export const keepersOf = (store: StoreName) => KEEPERS[store] ?? [];
export const canKeep = (by: string, role: string, store: StoreName) =>
  storeHouseStaff(by, role) || (store !== "Store house" && (leadsOf(STORE_DEPT[store]).includes(by) || keepersOf(store).includes(by)));
export const setKeepers = (by: string, role: string, store: StoreName, names: string[]): string | null => {
  if (!storeHouseStaff(by, role)) return "Only the store house names a store's keepers.";
  if (store === "Store house") return "The store house's own staff keep it.";
  KEEPERS[store] = [...new Set(names)]; return null;
};
/** The stores a person works with: every store for the store house; otherwise the ones they keep. */
export const storesFor = (by: string, role: string) => STORES.filter(s => canKeep(by, role, s));

// ── Store setup: the store house adds, edits and removes items for every store; Maintenance's supervisors do it for theirs.
export type ItemInput = { name: string; cat: string; shelf?: string; unit: string; min?: number; store?: StoreName }; // min is the reorder level in `store` (the maintenance store unless named)
const checkItem = (x: ItemInput, sku?: string): string | null => {
  if (!x.name.trim() || !x.cat.trim() || !x.unit.trim()) return "Enter the name, the category and the unit.";
  if (ITEMS.some(i => !i.retired && i.sku !== sku && i.name.trim().toLowerCase() === x.name.trim().toLowerCase())) return "An item with that name is already in the store.";
  if (x.min != null && !(x.min >= 0)) return "The reorder level cannot be below zero.";
  return null;
};
const tidy = (x: ItemInput) => ({ name: x.name.trim(), cat: x.cat.trim(), shelf: x.shelf?.trim() || undefined, unit: x.unit.trim() });
let skuSeq = 100;
export const addItem = (x: ItemInput): Item | string => {
  const r = checkItem(x); if (r) return r;
  const it: Item = { sku: `STK-${String(++skuSeq).padStart(4, "0")}`, ...tidy(x), avgCost: 0, min: { [x.store ?? "Maintenance store"]: x.min } }; // the key marks the item as kept in that store
  ITEMS.push(it); return it;
};
export const editItem = (sku: string, x: ItemInput): string | null => {
  const it = item(sku); if (!it || it.retired) return "That item is no longer in the store.";
  const r = checkItem(x, sku); if (r) return r;
  Object.assign(it, tidy(x), { min: { ...it.min, [x.store ?? "Maintenance store"]: x.min } }); return null;
};
/** Only an item with nothing on any shelf and nothing held can go. One with history is retired, so old movements keep their name. */
export const removeItem = (sku: string): string | null => {
  const it = item(sku); if (!it || it.retired) return "That item is no longer in the store.";
  if (STORES.some(st => onHand(st, sku)) || held(sku)) return `${it.name} still has stock or is held for a job. Count it out or issue it first.`;
  if (LEDGER.some(m => m.sku === sku)) it.retired = true; else ITEMS.splice(ITEMS.indexOf(it), 1);
  return null;
};

// ── Stock count, shelf by shelf. Each item is judged against what its shelf should hold at the moment it is counted
// (the books less what jobs hold, since held items are off the shelf), and the difference goes onto the balance as it
// is when posted. A job taking items, or a delivery, while the count runs is then never mistaken for a loss or a gain.
// (A snapshot taken when the count opens gets either of those wrong depending on whether the shelf was counted first.)
export type Count = { id: string; store: StoreName; openedBy: string; at: Date; counted: Record<string, { shelf: number; expected: number }> };
let COUNT: Count | undefined; let countSeq = 0;
export const openCount = () => COUNT;
export const startCount = (store: StoreName, by: string): Count | string => {
  if (COUNT) return `A count of the ${COUNT.store.toLowerCase()} is already open.`;
  COUNT = { id: `SC-${++countSeq}`, store, openedBy: by, at: now(), counted: {} }; return COUNT;
};
export const recordCount = (sku: string, qty: number): string | null => {
  if (!COUNT) return "No count is open.";
  if (!(qty >= 0) || !Number.isFinite(qty)) return "Enter what is on the shelf, or leave it blank if you did not count it.";
  COUNT.counted[sku] = { shelf: qty, expected: available(COUNT.store, sku) }; return null;
};
/** Items not counted are left as they are. */
export const countDifferences = () => !COUNT ? [] : Object.entries(COUNT.counted).map(([sku, c]) => ({ sku, expected: c.expected, shelf: c.shelf, diff: c.shelf - c.expected }));
export const postCount = (by: string): Line[] | string => {
  if (!COUNT) return "No count is open.";
  const c = COUNT, diffs = countDifferences().filter(d => d.diff);
  for (const d of diffs) if (onHand(c.store, d.sku) + d.diff < (c.store === "Maintenance store" ? held(d.sku) : 0)) return `${item(d.sku)?.name}: the count would leave less than jobs already hold. Recount it.`;
  for (const d of diffs) write({ at: now(), sku: d.sku, store: c.store, kind: "Adjust", qty: d.diff, unitCost: item(d.sku)!.avgCost, by, reason: `Stock count ${c.id}, opened by ${c.openedBy}` });
  COUNT = undefined;
  return diffs.map(d => ({ sku: d.sku, qty: d.diff }));
};
export const cancelCount = () => { COUNT = undefined; };
