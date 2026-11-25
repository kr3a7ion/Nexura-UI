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
import { STORES, items, item, onHand, held, available, ledger, receive, adjust, transfer, takeForJob, returnFromJob, takenFor, openCount, startCount, recordCount, countDifferences, postCount, cancelCount, type StoreName, type Line } from "./mock/stores";

type Add = (t: Omit<Toast, "id">) => void;
const td = "px-3 py-2.5 text-sm";
const naira = (n: number) => `₦${n.toLocaleString()}`;
const num = (id: string, label: string, value: string, set: (v: string) => void, hint?: string) =>
  <Field label={label} htmlFor={id} hint={hint}><input id={id} inputMode="decimal" value={value} onChange={e => set(e.target.value.replace(/[^\d.-]/g, ""))} className={controlClass} style={controlStyle()} /></Field>;
const itemOptions = (store: StoreName = "Maintenance store") => items().map(i => [i.sku, `${i.cat}: ${i.name} (${available(store, i.sku)} ${i.unit} free${i.shelf ? `, ${i.shelf}` : ""})`] as [string, string]);

// Maintenance sees only its own store. The store house will be its own department that every department's stock syncs to;
// until it exists, Inventory's menu shows both stores and is where transfers happen.
export function Stores({ add, staffName, role, stores = [...STORES] }: { add: Add; staffName: string; role: string; stores?: StoreName[] }) {
  const [store, setStore] = useState<StoreName>(stores[0]);
  const [dialog, setDialog] = useState<null | "receive" | "transfer" | "adjust">(null);
  const [, redraw] = useState(0);
  // Receiving and moving stock is for supervisors and up; technicians take items for a job from the job itself.
  const manager = canSetUp(staffName, role);
  const done = (ok: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return; } add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); };
  const rows = items().filter(i => onHand(store, i.sku) || i.min[store] != null);
  const cats = [...new Set(rows.map(i => i.cat))].sort();
  const count = openCount()?.store === store ? openCount() : undefined, diffs = countDifferences();
  const posted = () => { const r = postCount(staffName); if (typeof r === "string") { add({ type: "error", title: r }); return; }
    add({ type: "success", title: "Count posted", body: r.length ? `${r.length} item${r.length === 1 ? "" : "s"} adjusted: ${r.map(l => `${l.qty > 0 ? "+" : ""}${l.qty} ${item(l.sku)?.name}`).join(", ")}.` : "Every counted shelf matched the books." }); redraw(n => n + 1); };

  return <div>
    <PageHeader title={stores.length > 1 ? "Stores" : store} sub="Laid out as the shelves are. A job takes items from the maintenance store; they leave the books only when a supervisor confirms them at verification."
      actions={manager && <div className="flex flex-wrap gap-2">{count ? <><BtnO label="Cancel the count" onClick={() => { cancelCount(); redraw(n => n + 1); }} /><BtnP label="Post the count" onClick={posted} /></>
        : <BtnO label="Start a stock count" onClick={() => { const r = startCount(store, staffName); if (typeof r === "string") add({ type: "error", title: r }); redraw(n => n + 1); }} />}{stores.length > 1 && <BtnO label="Transfer between stores" onClick={() => setDialog("transfer")} />}<BtnO label="Adjust a count" onClick={() => setDialog("adjust")} /><BtnP label="Receive stock" onClick={() => setDialog("receive")} /></div>} />
    {stores.length > 1 && <div className="mb-6"><Segmented label="Store" options={stores} value={store} onChange={setStore} /></div>}
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
    {dialog === "transfer" && <MoveDialog title={`Transfer out of the ${store.toLowerCase()}`} store={store} onClose={() => setDialog(null)}
      onSave={(sku, qty, extra) => { const to = STORES.find(s => s !== store)!; done(`${qty} moved to the ${to.toLowerCase()}`, transfer(store, to, sku, qty, staffName, extra.note)); }} />}
  </div>;
}

function MoveDialog({ title, store, onClose, onSave, cost, signed }: { title: string; store: StoreName; onClose: () => void; onSave: (sku: string, qty: number, extra: { cost: string; note: string }) => void; cost?: boolean; signed?: boolean }) {
  const [f, setF] = useState({ sku: items()[0].sku, qty: "", cost: String(items()[0].avgCost), note: "" });
  return <Dialog title={title} onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label={title} onClick={() => onSave(f.sku, Number(f.qty || NaN), f)} /></>}>
    <Select id="mv-item" label="Item" value={f.sku} onChange={v => setF({ ...f, sku: v, cost: String(item(v)!.avgCost) })} options={itemOptions(store)} />
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
