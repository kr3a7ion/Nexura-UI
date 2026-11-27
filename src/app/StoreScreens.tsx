// Stores: the maintenance store and the general store on one ledger (mock/stores.ts), and the materials pieces the work
// order uses: what a job holds from the store, and the list stated at completion and confirmed at verification.
import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, WARNING_INK } from "./constants";
import { PageHeader, BtnP, BtnO } from "./UIKit";
import { Card, Field, Dialog, Segmented, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { fmtWhen } from "./mock/maintenance";
import { canSetUp } from "./mock/roster";
import { staffAll } from "./mock/staff";
import { StoreItems } from "./SetupScreens";
import { STORES, STORE_DEPT, canKeep, storeHouseStaff, keepersOf, setKeepers, items, item, onHand, held, available, ledger, receive, adjust, transfer, takeForJob, returnFromJob, takenFor, openCount, startCount, recordCount, countDifferences, postCount, cancelCount, type StoreName, type Line } from "./mock/stores";

type Add = (t: Omit<Toast, "id">) => void;
const td = "px-3 py-2.5 text-sm";
const naira = (n: number) => `₦${n.toLocaleString()}`;
const num = (id: string, label: string, value: string, set: (v: string) => void, hint?: string) =>
  <Field label={label} htmlFor={id} hint={hint}><input id={id} inputMode="decimal" value={value} onChange={e => set(e.target.value.replace(/[^\d.-]/g, ""))} className={controlClass} style={controlStyle()} /></Field>;
const itemOptions = (store: StoreName = "Maintenance store") => items().map(i => [i.sku, `${i.cat}: ${i.name} (${available(store, i.sku)} ${i.unit} free${i.shelf ? `, ${i.shelf}` : ""})`] as [string, string]);

// Maintenance sees only its own store. The Store House department sees every store it keeps (all of them for its staff),
// moves stock from the store house out to departments and back, names each department store's keepers and sets up items.
export function Stores(p: { add: Add; staffName: string; role: string; stores?: StoreName[] }) {
  if (p.stores && !p.stores.length) return <div><PageHeader title="Stores" sub="You don't keep a store. The store house names each department store's keepers." /></div>;
  return <StoreView {...p} />;
}
function StoreView({ add, staffName, role, stores = [...STORES] }: { add: Add; staffName: string; role: string; stores?: StoreName[] }) {
  const [store, setStore] = useState<StoreName>(stores[0]);
  const [dialog, setDialog] = useState<null | "receive" | "transfer" | "adjust">(null);
  const [, redraw] = useState(0);
  // Receiving and moving stock is for supervisors and up; technicians take items for a job from the job itself.
  const manager = canKeep(staffName, role, store) || (store === "Maintenance store" && canSetUp(staffName, role)), house = storeHouseStaff(staffName, role);
  const done = (ok: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return; } add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); };
  const rows = items().filter(i => onHand(store, i.sku) || i.min[store] != null);
  const cats = [...new Set(rows.map(i => i.cat))].sort();
  const count = openCount()?.store === store ? openCount() : undefined, diffs = countDifferences();
  const posted = () => { const r = postCount(staffName); if (typeof r === "string") { add({ type: "error", title: r }); return; }
    add({ type: "success", title: "Count posted", body: r.length ? `${r.length} item${r.length === 1 ? "" : "s"} adjusted: ${r.map(l => `${l.qty > 0 ? "+" : ""}${l.qty} ${item(l.sku)?.name}`).join(", ")}.` : "Every counted shelf matched the books." }); redraw(n => n + 1); };

  return <div>
    <PageHeader title={stores.length > 1 ? "Stores" : store} sub="Laid out as the shelves are. A job takes items from the maintenance store; they leave the books only when a supervisor confirms them at verification."
      actions={manager && <div className="flex flex-wrap gap-2">{count ? <><BtnO label="Cancel the count" onClick={() => { cancelCount(); redraw(n => n + 1); }} /><BtnP label="Post the count" onClick={posted} /></>
        : <BtnO label="Start a stock count" onClick={() => { const r = startCount(store, staffName); if (typeof r === "string") add({ type: "error", title: r }); redraw(n => n + 1); }} />}{(house || store !== "Maintenance store") && <BtnO label={store === "Store house" ? "Send to a department" : "Return to the store house"} onClick={() => setDialog("transfer")} />}<BtnO label="Adjust a count" onClick={() => setDialog("adjust")} /><BtnP label="Receive stock" onClick={() => setDialog("receive")} /></div>} />
    {stores.length > 1 && <div className="mb-6 max-w-xs"><Field label="Store" htmlFor="st-store"><select id="st-store" value={store} onChange={e => setStore(e.target.value as StoreName)} className={controlClass} style={controlStyle()}>
      {stores.map(s => <option key={s} value={s}>{s}{s === "Store house" ? "" : ` (${STORE_DEPT[s]})`}</option>)}</select></Field></div>}
    <div className="space-y-4">
      <Card title={count ? `Counting the ${store.toLowerCase()} (${count.id})` : store} sub={count ? "Enter what is on each shelf as you count it. Items held for jobs are off the shelf already. A shelf left blank is not changed." : store === "Maintenance store" ? "Held: taken for a job and not yet confirmed. Free: what the store can still give out." : undefined}>
        <div className="overflow-x-auto"><table className="w-full">
          <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Item", "Shelf", "On the books", ...(store === "Maintenance store" ? ["Held for jobs"] : []), "Free", ...(count ? ["Counted on the shelf", "Difference"] : ["Reorder at", "Average cost"])].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          {cats.map(cat => <tbody key={cat}><tr><th colSpan={7} scope="colgroup" className="px-3 pt-4 pb-1 text-left text-sm font-semibold" style={{ color: TEXT }}>{cat}</th></tr>{rows.filter(i => i.cat === cat).map(i => { const free = available(store, i.sku), low = i.min[store] != null && free <= i.min[store]!; return <tr key={i.sku} style={{ borderTop: `1px solid ${BORDER}` }}>
            <td className={td} style={{ color: TEXT }}><b>{i.name}</b><span className="block" style={{ color: MUTED }}>{i.sku}</span></td>
            <td className={td} style={{ color: MUTED }}>{i.shelf ?? "Not set"}</td>
            <td className={td} style={{ color: TEXT }}>{onHand(store, i.sku)} {i.unit}</td>
            {store === "Maintenance store" && <td className={td} style={{ color: held(i.sku) ? WARNING_INK : MUTED }}>{held(i.sku) || "None"}</td>}
            <td className={td} style={{ color: low ? ERROR : TEXT }}>{free}{low ? ". Reorder" : ""}</td>
            {count ? <><td className="px-3 py-2"><input aria-label={`${i.name} counted on the shelf`} inputMode="numeric" defaultValue={count.counted[i.sku]?.shelf ?? ""}
                onBlur={e => { if (e.target.value.trim() === "") return; const r = recordCount(i.sku, Number(e.target.value)); if (r) add({ type: "error", title: r }); redraw(n => n + 1); }} className={controlClass} style={{ ...controlStyle(), maxWidth: 110 }} /></td>
              <td className={td} style={{ color: (diffs.find(d => d.sku === i.sku)?.diff ?? 0) ? ERROR : MUTED }}>{(d => d == null ? "" : d.diff ? `${d.diff > 0 ? "+" : ""}${d.diff}` : "Matches")(diffs.find(d => d.sku === i.sku))}</td></>
            : <><td className={td} style={{ color: MUTED }}>{i.min[store] ?? "Not set"}</td>
            <td className={td} style={{ color: TEXT }}>{naira(i.avgCost)}</td></>}
          </tr>; })}</tbody>)}
        </table></div>
      </Card>
      {house && store !== "Store house" && <Keepers add={add} staffName={staffName} role={role} store={store} />}
      {house && <StoreItems key={store} add={add} store={store} />}
      <Card title="Movements" sub="Newest first. Each row carries the balance it left in the store.">
        {ledger(store).slice(0, 12).map(m => <div key={m.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}>
          <span>{fmtWhen(m.at)}: {m.kind.toLowerCase()} {Math.abs(m.qty)} × {item(m.sku)?.name}{m.job ? ` for ${m.job}` : ""}{m.reason ? `. ${m.reason}` : ""}</span>
          <span style={{ color: MUTED }}>Left {m.balance}. {m.by}</span>
        </div>)}
      </Card>
    </div>

    {dialog === "receive" && <MoveDialog title="Receive stock" store={store} onClose={() => setDialog(null)} cost
      onSave={(sku, qty, extra) => done("Stock received", receive(store, sku, qty, Number(extra.cost), staffName, extra.note))} />}
    {dialog === "adjust" && <MoveDialog title="Adjust a count" store={store} onClose={() => setDialog(null)} signed
      onSave={(sku, qty, extra) => done("Count adjusted", adjust(store, sku, qty, extra.note, staffName))} />}
    {dialog === "transfer" && <MoveDialog title={store === "Store house" ? "Send stock to a department" : "Return stock to the store house"} store={store} onClose={() => setDialog(null)}
      to={store === "Store house" ? STORES.filter(s => s !== "Store house") : ["Store house"]}
      onSave={(sku, qty, extra) => done(`${qty} moved to ${extra.to}`, transfer(store, extra.to as StoreName, sku, qty, staffName, extra.note))} />}
  </div>;
}

function MoveDialog({ title, store, onClose, onSave, cost, signed, to }: { title: string; store: StoreName; onClose: () => void; onSave: (sku: string, qty: number, extra: { cost: string; note: string; to: string }) => void; cost?: boolean; signed?: boolean; to?: StoreName[] }) {
  const kept = items().filter(i => store in i.min || onHand(store, i.sku) > 0), first = kept[0] ?? items()[0];
  const [f, setF] = useState({ sku: first.sku, qty: "", cost: String(first.avgCost), note: "", to: to?.[0] ?? "" });
  return <Dialog title={title} onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label={title} onClick={() => onSave(f.sku, Number(f.qty || NaN), f)} /></>}>
    {to && to.length > 1 && <Select id="mv-to" label="To" value={f.to} onChange={v => setF({ ...f, to: v })} options={to.map(s => [s, `${s} (${STORE_DEPT[s]})`] as [string, string])} />}
    <Select id="mv-item" label="Item" value={f.sku} onChange={v => setF({ ...f, sku: v, cost: String(item(v)!.avgCost) })} options={itemOptions(store).filter(([sku]) => kept.some(i => i.sku === sku))} />
    <div className="grid grid-cols-2 gap-4">{num("mv-qty", signed ? "Add or take off (use - to take off)" : "How many", f.qty, v => setF({ ...f, qty: v }))}
      {cost && num("mv-cost", "Each (₦)", f.cost, v => setF({ ...f, cost: v }))}</div>
    <Field label={signed ? "Why" : cost ? "Delivery note or supplier" : "Note"} htmlFor="mv-note">
      <input id="mv-note" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} className={controlClass} style={controlStyle()} /></Field>
  </Dialog>;
}

/** On the work order: what this job holds from the maintenance store, with take and return. */
export function MaterialsCard({ job, by, canTake, add, onChange }: { job: string; by: string; canTake: boolean; add: Add; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ sku: items()[0].sku, qty: "1" });
  const out = takenFor(job);
  const done = (r: string | null, ok: string) => { if (r) add({ type: "error", title: r }); else { add({ type: "success", title: ok }); setOpen(false); onChange(); } };
  return <Card title="Materials from the store" sub="Taken for this job and held. They leave the store's books when the job is verified."
    actions={canTake && <BtnO label="Take from the store" icon={Plus} onClick={() => setOpen(true)} />}>
    {out.length ? out.map(l => <div key={l.sku} className="flex items-center justify-between gap-2 py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}>
      <span>{l.qty} × {item(l.sku)?.name}</span>
      {canTake && <BtnO label={`Return 1 ${item(l.sku)?.name}`} onClick={() => done(returnFromJob(job, l.sku, 1, by), "Returned to the store")} />}
    </div>) : <p className="text-sm" style={{ color: MUTED }}>Nothing taken from the store for this job.</p>}
    {open && <Dialog title="Take from the maintenance store" sub="Held for this job until it is verified." onClose={() => setOpen(false)}
      footer={<><BtnO label="Cancel" onClick={() => setOpen(false)} /><BtnP label="Take it" onClick={() => done(takeForJob(job, f.sku, Number(f.qty || NaN), by), "Taken for this job")} /></>}>
      <Select id="tk-item" label="Item" value={f.sku} onChange={v => setF({ ...f, sku: v })} options={itemOptions()} />
      {num("tk-qty", "How many", f.qty, v => setF({ ...f, qty: v }))}
    </Dialog>}
  </Card>;
}

/** The list of items used, in the completion and verification dialogs. */
export function LinesEditor({ lines, setLines, prefix }: { lines: Line[]; setLines: (l: Line[]) => void; prefix: string }) {
  const set = (i: number, l: Partial<Line>) => setLines(lines.map((x, k) => k === i ? { ...x, ...l } : x));
  return <div className="space-y-2">
    {lines.map((l, i) => <div key={i} className="grid grid-cols-[1fr_96px_auto] items-end gap-2">
      <Select id={`${prefix}-item-${i}`} label="Item" value={l.sku} onChange={v => set(i, { sku: v })} options={itemOptions()} />
      <Field label="Used" htmlFor={`${prefix}-qty-${i}`}><input id={`${prefix}-qty-${i}`} aria-label={`How many ${item(l.sku)?.name} used`} inputMode="decimal" value={l.qty || ""} onChange={e => set(i, { qty: Number(e.target.value.replace(/[^\d.]/g, "")) })} className={controlClass} style={controlStyle()} /></Field>
      <BtnO label={`Remove ${item(l.sku)?.name}`} onClick={() => setLines(lines.filter((_, k) => k !== i))} />
    </div>)}
    <BtnO label="Add an item used" icon={Plus} onClick={() => setLines([...lines, { sku: items()[0].sku, qty: 1 }])} />
  </div>;
}

/** Who may enter receipts into a department's own store, besides its supervisors and managers and the store house. */
function Keepers({ add, staffName, role, store }: { add: Add; staffName: string; role: string; store: StoreName }) {
  const [, redraw] = useState(0);
  const [pick, setPick] = useState("");
  const dept = STORE_DEPT[store], names = keepersOf(store);
  const people = staffAll().filter(s => s.dept === dept && s.status !== "Left" && !names.includes(s.name)).map(s => s.name);
  const save = (next: string[], ok: string) => { const r = setKeepers(staffName, role, store, next); add(r ? { type: "error", title: r } : { type: "success", title: ok }); setPick(""); redraw(n => n + 1); };
  return <Card title={`Keepers of the ${store.toLowerCase()} store`} sub={`${dept}'s supervisors and managers keep it already. Name anyone else in ${dept} who may enter what the department gets itself.`}>
    <div className="flex flex-wrap items-center gap-2">
      {names.length ? names.map(n => <span key={n} className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm" style={{ borderColor: BORDER, color: TEXT }}>{n}
        <button aria-label={`Remove ${n} as a keeper`} onClick={() => save(names.filter(x => x !== n), `${n} no longer keeps this store`)} className="ml-1 text-xs" style={{ color: ERROR }}>Remove</button></span>)
        : <span className="text-sm" style={{ color: MUTED }}>Only {dept}'s supervisors and managers.</span>}
    </div>
    {people.length > 0 && <div className="mt-3 flex flex-wrap items-end gap-2"><div className="w-64"><Field label="Add a keeper" htmlFor="kp-add"><select id="kp-add" value={pick} onChange={e => setPick(e.target.value)} className={controlClass} style={controlStyle()}>
      <option value="">Choose a person</option>{people.map(n => <option key={n}>{n}</option>)}</select></Field></div>
      <BtnP label="Add as keeper" onClick={() => pick ? save([...names, pick], `${pick} now keeps the ${store.toLowerCase()} store`) : add({ type: "error", title: "Choose a person first" })} /></div>}
  </Card>;
}
