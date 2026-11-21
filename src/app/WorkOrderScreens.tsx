// Maintenance: the work order list and one work order, read from mock/maintenance.ts.
import React, { useState } from "react";
import { Plus, Download, Search, AlertCircle, Activity, AlertTriangle, CheckCircle2, Wrench, PauseCircle } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, SUBTLE, ERROR, PRIMARY, TEAL_INK, ORANGE_INK, WARNING_INK, display } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, EmptyState, Badge } from "./UIKit";
import { UI, Card, Field, Row, Dialog, controlClass, controlStyle, downloadCsv } from "./ui";
import { ROOMS } from "./mock/property";
import { ASSETS } from "./constants";
import {
  workOrders, workOrder, addWorkOrder, updateWorkOrder, moveWorkOrder, canMove, isOpen, isOverdue, isLateToRespond, respondDue, resolveDue, ageOf, fmtWhen, now,
  TECHNICIANS, WO_CATEGORIES, LABOUR_RATE, PRIORITIES, HOLD_REASONS, priorityLabel, type WorkOrder, type WOPriority, type WOStatus,
} from "./mock/maintenance";
import { finishWorkOrder } from "./mock/hotel";
import { roomState } from "./mock/rooms";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;

export const WO_STATUS_C: Record<WOStatus | "Overdue", { bg: string; text: string }> = {
  Raised: { bg: "#EEF2FF", text: "#4338CA" }, Assigned: { bg: "#F0FDFA", text: TEAL_INK }, Accepted: { bg: "#F0FDFA", text: TEAL_INK },
  "In progress": { bg: "#FEF3C7", text: "#92400E" }, "On hold": { bg: "#F5F3FF", text: "#5B21B6" },
  Completed: { bg: "#E0F2FE", text: "#075985" }, Verified: { bg: "#ECFDF5", text: "#047857" },
  Closed: { bg: "#DCFCE7", text: "#166534" }, Cancelled: { bg: "#F1F5F9", text: "#475569" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" },
};
export const WO_PRI_C: Record<WOPriority, { bg: string; text: string }> = {
  P1: { bg: "#FEE2E2", text: "#991B1B" }, P2: { bg: "#FFEDD5", text: "#9A3412" }, P3: { bg: "#FEF9C3", text: "#854D0E" }, P4: { bg: "#F1F5F9", text: "#475569" },
};
const statusLabel = (w: WorkOrder) => w.status === "Completed" ? "Ready to verify" : w.status === "Verified" ? "Verified, ready to close"
  : w.status === "On hold" ? `On hold: ${(w.holdReason ?? "").replace("Waiting for ", "")}` : w.status;
const StatusBadge = ({ w }: { w: WorkOrder }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <Badge label={statusLabel(w)} colors={WO_STATUS_C[w.status]} />
    {isOverdue(w) && <Badge label={isLateToRespond(w) ? "Not accepted in time" : "Overdue"} colors={WO_STATUS_C.Overdue} />}
  </span>
);
const PriBadge = ({ p }: { p: WOPriority }) => <Badge label={priorityLabel(p)} colors={WO_PRI_C[p]} />;
// What the job is racing now: being accepted, then being done.
const deadline = (w: WorkOrder) => w.acceptedAt ? { label: "Fix by", at: resolveDue(w) } : { label: "Accept by", at: respondDue(w) };
const Select = ({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: (string | [string, string])[]; id: string }) => (
  <Field label={label} htmlFor={id}>
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={controlClass} style={controlStyle()}>
      {options.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o}>{o}</option>)}
    </select>
  </Field>
);

// ── New work order (also used from the detail screen's follow-up) ───────────
export function NewWorkOrderDialog({ onClose, onCreated, reportedBy, room }: { onClose: () => void; onCreated: (w: WorkOrder) => void; reportedBy: string; room?: string }) {
  const [f, setF] = useState({ title: "", where: "Room", room: room ?? "", place: "", cat: "General", priority: "P3" as WOPriority, outOfOrder: false, guestImpact: false, desc: "" });
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof f) => (v: string | boolean) => setF(p => ({ ...p, [k]: v }));
  const location = f.where === "Room" ? (f.room ? `Room ${f.room}` : "") : f.place.trim();
  const ok = f.title.trim() && location;
  const save = () => {
    setTried(true); if (!ok) return;
    onCreated(addWorkOrder({ title: f.title.trim(), location, room: f.where === "Room" ? f.room : undefined, cat: f.cat, priority: f.priority,
      reportedBy, desc: f.desc.trim() || f.title.trim(), outOfOrder: f.where === "Room" && f.outOfOrder, guestImpact: f.guestImpact }));
  };
  return (
    <Dialog title="New work order" sub="Say what is wrong and where. It goes straight onto the Maintenance list." onClose={onClose}
      footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Create work order" onClick={save} /></>}>
      <Field label="What is wrong" htmlFor="wo-title" required error={tried && !f.title.trim() ? "Write a short title, for example \"Tap dripping\"." : undefined}>
        <input id="wo-title" value={f.title} onChange={e => set("title")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.title.trim())} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Select id="wo-where" label="Where" value={f.where} onChange={set("where")} options={["Room", "Somewhere else"]} />
        {f.where === "Room" ? (
          <Field label="Room" htmlFor="wo-room" required error={tried && !f.room ? "Choose the room." : undefined}>
            <select id="wo-room" value={f.room} onChange={e => set("room")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.room)}>
              <option value="">Choose…</option>
              {ROOMS.map(r => <option key={r.id} value={r.id}>{r.id} · {r.type}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Place" htmlFor="wo-place" required error={tried && !f.place.trim() ? "Say where, for example \"Lobby\"." : undefined}>
            <input id="wo-place" value={f.place} onChange={e => set("place")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.place.trim())} />
          </Field>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select id="wo-cat" label="Category" value={f.cat} onChange={set("cat")} options={WO_CATEGORIES} />
        <Select id="wo-pri" label="Priority" value={f.priority} onChange={set("priority")} options={(Object.keys(PRIORITIES) as WOPriority[]).map(p => [p, priorityLabel(p)] as [string, string])} />
      </div>
      <div className="space-y-2">
        {f.where === "Room" && (
          <label className="flex items-center gap-2.5 text-sm" style={{ color: TEXT }}>
            <input type="checkbox" checked={f.outOfOrder} onChange={e => set("outOfOrder")(e.target.checked)} className="w-4 h-4" />
            Take the room out of order until it is fixed
          </label>
        )}
        <label className="flex items-center gap-2.5 text-sm" style={{ color: TEXT }}>
          <input type="checkbox" checked={f.guestImpact} onChange={e => set("guestImpact")(e.target.checked)} className="w-4 h-4" />
          A guest is affected
        </label>
      </div>
      <Field label="Details" htmlFor="wo-desc" hint="What is broken, since when, and anything unsafe.">
        <textarea id="wo-desc" rows={3} value={f.desc} onChange={e => set("desc")(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none"
          style={{ border: "1px solid #CBD5E1", borderRadius: UI.radius.control, color: TEXT }} />
      </Field>
    </Dialog>
  );
}

// ── Work Orders list ─────────────────────────────────────────────────────────
const FILTERS = ["Open", "Overdue", "On hold", "To sign off", "Closed", "All"] as const;
type Filter = typeof FILTERS[number];

export function WorkOrders({ add, nav, staffName }: { add: Add; nav?: Nav; staffName: string }) {
  const [, refresh] = useState(0);
  const [filter, setFilter] = useState<Filter>("Open");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTech, setBulkTech] = useState<string | null>(null);

  const all = workOrders();
  const count = (fl: Filter) => all.filter(w => matches(w, fl)).length;
  function matches(w: WorkOrder, fl: Filter) {
    if (fl === "Open") return isOpen(w);
    if (fl === "Overdue") return isOverdue(w);
    if (fl === "On hold") return w.status === "On hold";
    if (fl === "To sign off") return w.status === "Completed" || w.status === "Verified";
    if (fl === "Closed") return w.status === "Closed" || w.status === "Cancelled";
    return true;
  }
  const visible = all.filter(w => matches(w, filter) &&
    (!search || `${w.id} ${w.title} ${w.location} ${w.tech ?? ""}`.toLowerCase().includes(search.toLowerCase())));
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const assignSelected = () => {
    if (!bulkTech) return;
    const done = selected.filter(id => !moveWorkOrder(id, "Assigned", { by: staffName, tech: bulkTech })).length;
    add({ type: done ? "success" : "warning", title: `${done} work order${done === 1 ? "" : "s"} assigned to ${bulkTech}`, body: done < selected.length ? `${selected.length - done} could not be assigned in their current state.` : undefined });
    setSelected([]); setBulkTech(null); refresh(n => n + 1);
  };
  const exportList = () => {
    downloadCsv("work-orders.csv", [["ID", "Title", "Location", "Category", "Priority", "Status", "Assigned to", "Reported", "Reported by", "Accept by", "Fix by"],
      ...visible.map(w => [w.id, w.title, w.location, w.cat, w.priority, statusLabel(w) + (isOverdue(w) ? " (overdue)" : ""), w.tech ?? "Nobody yet", fmtWhen(w.reportedAt), w.reportedBy, fmtWhen(respondDue(w)), fmtWhen(resolveDue(w))])]);
    add({ type: "success", title: `${visible.length} work orders saved as work-orders.csv` });
  };

  return (
    <div>
      <PageHeader title="Work Orders" sub="Everything that needs fixing, from report to sign-off."
        actions={<><BtnO label="Export" icon={Download} onClick={exportList} /><BtnP label="New work order" icon={Plus} onClick={() => setShowNew(true)} /></>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard label="Not started" value={String(all.filter(w => w.status === "Raised" || w.status === "Assigned").length)} sub={`${all.filter(w => w.status === "Raised").length} still need someone`} icon={AlertCircle} accent={PRIMARY} />
        <StatCard label="Being fixed" value={String(all.filter(w => w.status === "Accepted" || w.status === "In progress").length)} sub={`${count("On hold")} on hold, clock stopped`} icon={Activity} accent={ORANGE_INK} />
        <StatCard label="Overdue" value={String(count("Overdue"))} sub={`${all.filter(isLateToRespond).length} not accepted in time`} icon={AlertTriangle} accent={ERROR} />
        <StatCard label="To sign off" value={String(count("To sign off"))} sub="Completed, someone else verifies" icon={CheckCircle2} accent={TEAL_INK} />
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
          <input aria-label="Search work orders" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, place or technician"
            className={controlClass} style={{ ...controlStyle(), paddingLeft: 34 }} />
        </div>
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Show">
          {FILTERS.map(fl => (
            <button key={fl} role="tab" aria-selected={filter === fl} onClick={() => setFilter(fl)}
              className="px-3 text-sm font-medium whitespace-nowrap" style={{ height: 36, borderRadius: 10, border: `1px solid ${filter === fl ? UI.focus : "#CBD5E1"}`,
                backgroundColor: filter === fl ? UI.selectedBg : "white", color: filter === fl ? TEAL_INK : TEXT }}>
              {fl} <span style={{ color: fl === "Overdue" && count(fl) ? ERROR : SUBTLE }}>{count(fl)}</span>
            </button>
          ))}
        </div>
        {selected.length > 0 && <div className="ml-auto"><BtnP label={`Assign ${selected.length} selected`} onClick={() => setBulkTech(TECHNICIANS[0])} /></div>}
      </div>

      <div className="bg-white overflow-x-auto" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: UI.surface, borderBottom: `1px solid ${BORDER}` }}>
              <th className="pl-4 pr-1 py-3 w-8"><input aria-label="Select all shown" type="checkbox" className="w-4 h-4"
                checked={visible.length > 0 && visible.every(w => selected.includes(w.id))}
                onChange={() => setSelected(visible.every(w => selected.includes(w.id)) ? [] : visible.map(w => w.id))} /></th>
              {["Work order", "Priority", "Status", "Assigned to", "Reported", "Deadline"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(w => (
              <tr key={w.id} className="cursor-pointer hover:bg-slate-50" style={{ borderTop: `1px solid #F1F5F9` }}
                onClick={() => nav?.("work-order-detail", w.id, w.id)}>
                <td className="pl-4 pr-1 py-3" onClick={e => e.stopPropagation()}>
                  <input aria-label={`Select ${w.id}`} type="checkbox" className="w-4 h-4" checked={selected.includes(w.id)} onChange={() => toggle(w.id)} />
                </td>
                <td className="px-3 py-3 min-w-[240px]">
                  <div className="text-sm font-medium" style={{ color: TEXT }}>{w.title}</div>
                  <div className="text-sm" style={{ color: MUTED }}>
                    {w.id} · {w.location}
                    {w.outOfOrder && w.status !== "Closed" && w.status !== "Cancelled" ? <span style={{ color: ERROR }}> · Room out of order</span> : null}
                    {w.guestImpact && isOpen(w) ? <span style={{ color: ORANGE_INK }}> · Guest affected</span> : null}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap"><PriBadge p={w.priority} /></td>
                <td className="px-3 py-3"><StatusBadge w={w} /></td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: w.tech ? TEXT : WARNING_INK }}>{w.tech ?? "Nobody yet"}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm" style={{ color: TEXT }}>{fmtWhen(w.reportedAt)}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{w.reportedBy}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {isOpen(w) ? <>
                    <div className="text-sm" style={{ color: isOverdue(w) ? ERROR : TEXT }}>{deadline(w).label} {fmtWhen(deadline(w).at)}</div>
                    <div className="text-sm" style={{ color: MUTED }}>{w.status === "On hold" ? "Clock stopped" : `Open ${ageOf(w)}`}</div>
                  </> : <div className="text-sm" style={{ color: MUTED }}>{statusLabel(w)}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState icon={filter === "On hold" ? PauseCircle : Wrench} message={filter === "Overdue" ? "Nothing is overdue." : "No work orders here."} cta="New work order" onCta={() => setShowNew(true)} />}
      </div>

      {bulkTech !== null && (
        <Dialog title={`Assign ${selected.length} work order${selected.length === 1 ? "" : "s"}`} onClose={() => setBulkTech(null)}
          footer={<><BtnO label="Cancel" onClick={() => setBulkTech(null)} /><BtnP label="Assign" onClick={assignSelected} /></>}>
          <Select id="bulk-tech" label="Technician" value={bulkTech} onChange={setBulkTech} options={TECHNICIANS} />
          <p className="text-sm" style={{ color: MUTED }}>Closed and cancelled orders in the selection are left as they are.</p>
        </Dialog>
      )}
      {showNew && <NewWorkOrderDialog reportedBy={staffName} onClose={() => setShowNew(false)}
        onCreated={w => { setShowNew(false); add({ type: "success", title: `Work order ${w.id} created`, body: w.outOfOrder ? `Room ${w.room} is now out of order.` : w.location }); refresh(n => n + 1); }} />}
    </div>
  );
}

// ── One work order ───────────────────────────────────────────────────────────
// Raised → assigned → accepted → in progress ⇄ on hold → completed → verified by someone else → closed.
// Every button calls moveWorkOrder(), which refuses a move the job's status does not allow and says why.
type DialogKind = null | "assign" | "hold" | "complete" | "sendback" | "reopen" | "cancel" | "part" | "follow";

export function WorkOrderDetail({ add, nav, id, staffName }: { add: Add; nav?: Nav; id?: string; staffName: string }) {
  const [, refresh] = useState(0);
  const w = workOrder(id ?? "") ?? workOrders().find(isOpen) ?? workOrders()[0];
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [tech, setTech] = useState(w.tech ?? TECHNICIANS[0]);
  const [holdReason, setHoldReason] = useState(HOLD_REASONS[0]);
  const [text, setText] = useState("");
  const [part, setPart] = useState({ item: "", qty: "1", unit: "", ref: "" });
  const me = staffName;
  const done = () => { setDialog(null); setText(""); refresh(n => n + 1); };
  const asset = ASSETS.find(a => a.id === w.asset);
  const partTotal = w.parts.reduce((s, p) => s + p.qty * p.unit, 0);
  const labour = w.labourHours * LABOUR_RATE;
  const ended = w.status === "Closed" || w.status === "Cancelled";

  // One place that runs a move and reports the outcome.
  const go = (to: WOStatus, m: { note?: string; tech?: string; holdReason?: string }, ok: string, body?: string) => {
    const refused = to === "Closed" || to === "Cancelled" ? finishWorkOrder(w.id, to, me, m.note ?? "").refused : moveWorkOrder(w.id, to, { by: me, ...m });
    if (refused) { add({ type: "error", title: refused }); return false; }
    add({ type: "success", title: ok, body }); done(); return true;
  };
  const roomNote = w.room && w.outOfOrder ? `Room ${w.room} goes to Housekeeping to be cleaned before it is sold.` : undefined;
  const canAccept = w.tech === me || w.tech === "External vendor";

  // The main button for each status; the rest sit beside it.
  const primary = (() => {
    switch (w.status) {
      case "Raised": return <BtnP label="Assign" onClick={() => setDialog("assign")} />;
      case "Assigned": return canAccept ? <BtnP label="Accept the job" onClick={() => go("Accepted", {}, `${w.id} accepted`, "The response clock has stopped.")} /> : null;
      case "Accepted": return <BtnP label="Start work" onClick={() => go("In progress", {}, `${w.id}: work started`)} />;
      case "In progress": return <BtnP label="Mark as completed" onClick={() => setDialog("complete")} />;
      case "On hold": return <BtnP label="Resume work" onClick={() => go("In progress", {}, `${w.id} resumed`, "The clock is running again.")} />;
      case "Completed": return w.completedBy === me ? null : <BtnP label="Verify the work" onClick={() => go("Verified", {}, `${w.id} verified`, "It can be closed now.")} />;
      case "Verified": return <BtnP label="Close work order" onClick={() => go("Closed", {}, `${w.id} closed`, roomNote ? `Room ${w.room} is on the Housekeeping board to be cleaned.` : `${w.reportedBy} has been told.`)} />;
      default: return null;
    }
  })();
  const waitingNote = w.status === "Assigned" && !canAccept ? `Waiting for ${w.tech} to accept.`
    : w.status === "Completed" && w.completedBy === me ? "You completed this job, so someone else must verify it." : null;

  return (
    <div>
      <PageHeader title={`${w.title}`} sub={`${w.id} · ${w.location} · raised ${fmtWhen(w.reportedAt)} by ${w.reportedBy}`}
        actions={<div className="flex flex-wrap items-center gap-2">
          <BtnO label="All work orders" onClick={() => nav?.("work-orders", "Work Orders")} />
          {canMove(w, "Cancelled") && <BtnO label="Cancel order" onClick={() => setDialog("cancel")} />}
          {canMove(w, "Assigned") && w.status !== "Raised" && <BtnO label={w.status === "Verified" ? "Not right, reopen" : "Reassign"} onClick={() => setDialog(w.status === "Verified" ? "reopen" : "assign")} />}
          {canMove(w, "On hold") && <BtnO label="Put on hold" onClick={() => setDialog("hold")} />}
          {w.status === "Completed" && <BtnO label="Not done, send back" onClick={() => setDialog("sendback")} />}
          {primary}
        </div>} />
      {waitingNote && <p role="status" className="-mt-3 mb-5 text-sm" style={{ color: MUTED }}>{waitingNote}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">
        <div className="space-y-5 min-w-0">
          <Card title="What is wrong">
            <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{w.desc}</p>
            {w.resolution && (
              <div className="mt-4 px-4 py-3" style={{ backgroundColor: "#F0FDF4", borderRadius: UI.radius.control }}>
                <p className="text-sm font-medium" style={{ color: "#166534" }}>What was done</p>
                <p className="text-sm mt-0.5" style={{ color: TEXT }}>{w.resolution}</p>
              </div>
            )}
          </Card>

          <Card title="Parts and labour" actions={!ended && <BtnO label="Add a part" icon={Plus} onClick={() => setDialog("part")} />}>
            {w.parts.length ? (
              <table className="w-full mb-3">
                <thead><tr>{["Part", "Qty", "Each", "Total"].map((h, i) => <th key={h} className={`py-2 text-sm font-medium ${i ? "text-right" : "text-left"}`} style={{ color: MUTED }}>{h}</th>)}</tr></thead>
                <tbody>{w.parts.map((p, i) => (
                  <tr key={i} style={{ borderTop: `1px solid #F1F5F9` }}>
                    <td className="py-2.5 text-sm" style={{ color: TEXT }}>{p.item}<span className="block text-xs" style={{ color: SUBTLE }}>{p.ref}</span></td>
                    <td className="py-2.5 text-sm text-right" style={{ color: TEXT }}>{p.qty}</td>
                    <td className="py-2.5 text-sm text-right whitespace-nowrap" style={{ color: MUTED }}>₦{p.unit.toLocaleString()}</td>
                    <td className="py-2.5 text-sm text-right whitespace-nowrap" style={{ color: TEXT }}>₦{(p.qty * p.unit).toLocaleString()}</td>
                  </tr>))}</tbody>
              </table>
            ) : <p className="text-sm mb-3" style={{ color: MUTED }}>No parts used yet.</p>}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
              <label className="flex items-center gap-2 text-sm" style={{ color: MUTED }}>Labour hours
                <input aria-label="Labour hours" type="number" step="0.5" min="0" disabled={ended} value={w.labourHours}
                  onChange={e => { updateWorkOrder(w.id, { labourHours: Math.max(0, Number(e.target.value) || 0) }); refresh(n => n + 1); }}
                  className="w-20 px-2 text-sm outline-none" style={{ ...controlStyle(), height: 36 }} />
              </label>
              <span className="text-sm" style={{ color: MUTED }}>Labour at ₦{LABOUR_RATE.toLocaleString()} an hour: <span style={{ color: TEXT }}>₦{labour.toLocaleString()}</span></span>
              <span className="ml-auto text-sm font-semibold" style={{ color: TEXT }}>Total ₦{(partTotal + labour).toLocaleString()}</span>
            </div>
          </Card>

          <Card title="History">
            <ol className="space-y-4">
              {w.timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: i === w.timeline.length - 1 ? UI.focus : "#CBD5E1" }} />
                  <div>
                    <p className="text-sm" style={{ color: TEXT }}><span className="font-medium">{t.event}</span> <span style={{ color: MUTED }}>· {t.by} · {fmtWhen(t.at)}</span></p>
                    <p className="text-sm" style={{ color: MUTED }}>{t.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            {!ended && (
              <div className="mt-5 pt-4 flex gap-3 items-end" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="flex-1"><Field label="Add an update" htmlFor="wo-note">
                  <input id="wo-note" value={note} onChange={e => setNote(e.target.value)} placeholder="For example: waiting for parts from stores" className={controlClass} style={controlStyle()} />
                </Field></div>
                <BtnP label="Post update" onClick={() => { if (!note.trim()) return; updateWorkOrder(w.id, {}, { event: "Update", by: me, note: note.trim() }); setNote(""); refresh(n => n + 1); }} />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 xl:sticky xl:top-4">
          <Card title="Details">
            <Row label="Status" value={<StatusBadge w={w} />} />
            <Row label="Priority" value={<PriBadge p={w.priority} />} />
            <Row label="Category" value={w.cat} />
            <Row label="Assigned to" value={w.tech ?? "Nobody yet"} />
            <Row label="Accept by" value={w.acceptedAt ? `Accepted ${fmtWhen(w.acceptedAt)}` : <span style={{ color: isLateToRespond(w) ? ERROR : TEXT }}>{fmtWhen(respondDue(w))}</span>} />
            <Row label="Fix by" value={w.completedBy ? `Completed by ${w.completedBy}` : <span style={{ color: isOverdue(w) && !isLateToRespond(w) ? ERROR : TEXT }}>{fmtWhen(resolveDue(w))}</span>} />
            {(w.heldMs > 0 || w.heldSince) && <Row label="Time on hold" value={`${Math.round((w.heldMs + (w.heldSince ? now().getTime() - w.heldSince.getTime() : 0)) / 60000)} min, added to both deadlines`} />}
            {w.verifiedBy && <Row label="Verified by" value={w.verifiedBy} />}
            <Row label="Open for" value={isOpen(w) ? ageOf(w) : "No longer open"} />
            {w.room && <Row label="Room now" value={roomState(w.room) === "Out of order" ? <span style={{ color: ERROR }}>Out of order</span> : roomState(w.room)} />}
            <label className="flex items-center gap-2.5 text-sm pt-3" style={{ color: TEXT }}>
              <input type="checkbox" className="w-4 h-4" disabled={ended} checked={w.guestImpact}
                onChange={e => { updateWorkOrder(w.id, { guestImpact: e.target.checked }, { event: e.target.checked ? "Marked as affecting a guest" : "No longer affecting a guest", by: me, note: "" }); refresh(n => n + 1); }} />
              A guest is affected
            </label>
          </Card>
          {asset && (
            <Card title="Equipment">
              <Row label="Asset" value={`${asset.id} · ${asset.name}`} />
              <Row label="Location" value={asset.location} />
              <Row label="Next service" value={asset.nextService} />
            </Card>
          )}
          <Card title="Stop it happening again" sub="Raise a follow-up check for the same place.">
            <BtnO label="Raise a follow-up" onClick={() => setDialog("follow")} />
          </Card>
        </div>
      </div>

      {(dialog === "assign" || dialog === "reopen") && (
        <Dialog title={dialog === "reopen" ? "Reopen work order" : w.tech ? "Reassign" : "Assign"} onClose={() => setDialog(null)}
          sub={dialog === "reopen" ? "It goes back to the technician, who must accept it again." : `${priorityLabel(w.priority)}: someone must accept it by ${fmtWhen(respondDue(w))}.`}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label={dialog === "reopen" ? "Reopen" : "Assign"} onClick={() => go("Assigned", { tech, note: text }, `${w.id} ${dialog === "reopen" ? "reopened" : "assigned"} to ${tech}`)} /></>}>
          <Select id="as-tech" label="Technician" value={tech} onChange={setTech} options={TECHNICIANS} />
          {dialog === "reopen" && <Field label="What is still wrong" htmlFor="wo-why" required><input id="wo-why" value={text} onChange={e => setText(e.target.value)} className={controlClass} style={controlStyle(!text.trim())} /></Field>}
        </Dialog>
      )}
      {dialog === "hold" && (
        <Dialog title="Put on hold" sub="The clock stops while the job waits. The time held is added to both deadlines." onClose={() => setDialog(null)}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label="Put on hold" onClick={() => go("On hold", { holdReason, note: text }, `${w.id} on hold`, holdReason)} /></>}>
          <Select id="wo-hold" label="Waiting for" value={holdReason} onChange={setHoldReason} options={HOLD_REASONS} />
          <Field label="Details" htmlFor="wo-hold-note" hint="For example the part and when it is expected."><input id="wo-hold-note" value={text} onChange={e => setText(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
        </Dialog>
      )}
      {(dialog === "complete" || dialog === "sendback" || dialog === "cancel") && (
        <Dialog title={dialog === "complete" ? "Mark as completed" : dialog === "sendback" ? "Send back to the technician" : "Cancel work order"} danger={dialog === "cancel"} onClose={() => setDialog(null)}
          sub={dialog === "complete" ? "Say what was done. Someone else verifies it before the order closes." : dialog === "cancel" ? roomNote : "Say what is still wrong. It goes back to work in progress."}
          footer={<><BtnO label="Back" onClick={() => setDialog(null)} /><BtnP label={dialog === "complete" ? "Mark as completed" : dialog === "sendback" ? "Send back" : "Cancel work order"} onClick={() => {
            if (dialog === "complete") go("Completed", { note: text }, `${w.id} completed`, "It now waits for someone else to verify it.");
            else if (dialog === "sendback") go("In progress", { note: text }, `${w.id} sent back`, `${w.tech} has been told.`);
            else go("Cancelled", { note: text }, `${w.id} cancelled`, roomNote ? `Room ${w.room} is on the Housekeeping board to be cleaned.` : undefined);
          }} /></>}>
          <Field label={dialog === "complete" ? "What was done" : dialog === "sendback" ? "What is still wrong" : "Why cancel it"} htmlFor="wo-text" required error={!text.trim() ? "Needed before the order moves on." : undefined}>
            <textarea id="wo-text" rows={3} value={text} onChange={e => setText(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none"
              style={{ border: `1px solid ${text.trim() ? "#CBD5E1" : ERROR}`, borderRadius: UI.radius.control, color: TEXT }} />
          </Field>
        </Dialog>
      )}
      {dialog === "part" && (
        <Dialog title="Add a part" onClose={() => setDialog(null)}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label="Add part" onClick={() => {
            const qty = Number(part.qty), unit = Number(part.unit);
            if (!part.item.trim() || !(qty > 0) || !(unit >= 0)) return;
            updateWorkOrder(w.id, { parts: [...w.parts, { item: part.item.trim(), qty, unit, ref: part.ref.trim() || "Not from stores" }] }, { event: "Part added", by: me, note: `${qty} × ${part.item.trim()}` });
            setPart({ item: "", qty: "1", unit: "", ref: "" }); done();
          }} /></>}>
          <Field label="Part" htmlFor="pt-item" required><input id="pt-item" value={part.item} onChange={e => setPart(p => ({ ...p, item: e.target.value }))} className={controlClass} style={controlStyle()} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Qty" htmlFor="pt-qty"><input id="pt-qty" type="number" min="1" value={part.qty} onChange={e => setPart(p => ({ ...p, qty: e.target.value }))} className={controlClass} style={controlStyle()} /></Field>
            <Field label="Each (₦)" htmlFor="pt-unit"><input id="pt-unit" type="number" min="0" value={part.unit} onChange={e => setPart(p => ({ ...p, unit: e.target.value }))} className={controlClass} style={controlStyle()} /></Field>
            <Field label="Stock code" htmlFor="pt-ref"><input id="pt-ref" value={part.ref} onChange={e => setPart(p => ({ ...p, ref: e.target.value }))} className={controlClass} style={controlStyle()} /></Field>
          </div>
        </Dialog>
      )}
      {dialog === "follow" && (
        <NewWorkOrderDialog reportedBy={me} onClose={() => setDialog(null)}
          onCreated={f => { add({ type: "success", title: `Follow-up ${f.id} raised` }); setDialog(null); nav?.("work-order-detail", f.id, f.id); }} />
      )}
    </div>
  );
}
