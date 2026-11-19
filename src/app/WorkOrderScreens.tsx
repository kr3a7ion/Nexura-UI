// Maintenance: the work order list and one work order, read from mock/maintenance.ts.
import React, { useState } from "react";
import { Plus, Download, Search, AlertCircle, Activity, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, SUBTLE, ERROR, PRIMARY, TEAL_INK, ORANGE_INK, WARNING_INK, display } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, EmptyState, Badge } from "./UIKit";
import { UI, Card, Field, Row, Dialog, controlClass, controlStyle, downloadCsv } from "./ui";
import { ROOMS } from "./mock/property";
import { ASSETS } from "./constants";
import {
  workOrders, workOrder, addWorkOrder, updateWorkOrder, isOpen, isOverdue, ageOf, fmtWhen,
  TECHNICIANS, WO_CATEGORIES, LABOUR_RATE, type WorkOrder, type WOPriority, type WOStatus,
} from "./mock/maintenance";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;

const STATUS_C: Record<string, { bg: string; text: string }> = {
  Reported: { bg: "#EEF2FF", text: "#4338CA" }, Assigned: { bg: "#F0FDFA", text: TEAL_INK },
  "In progress": { bg: "#FEF3C7", text: "#92400E" }, Fixed: { bg: "#E0F2FE", text: "#075985" },
  Closed: { bg: "#DCFCE7", text: "#166534" }, Cancelled: { bg: "#F1F5F9", text: "#475569" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" },
};
const PRI_C: Record<WOPriority, string> = { High: ERROR, Medium: ORANGE_INK, Low: MUTED };
const statusLabel = (w: WorkOrder) => w.status === "Fixed" ? "Waiting to be checked" : w.status;
const StatusBadge = ({ w }: { w: WorkOrder }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <Badge label={statusLabel(w)} colors={STATUS_C[w.status]} />
    {isOverdue(w) && <Badge label="Overdue" colors={STATUS_C.Overdue} />}
  </span>
);
const Select = ({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: string[]; id: string }) => (
  <Field label={label} htmlFor={id}>
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={controlClass} style={controlStyle()}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </Field>
);

// ── New work order (also used from the detail screen's follow-up) ───────────
export function NewWorkOrderDialog({ onClose, onCreated, reportedBy, room }: { onClose: () => void; onCreated: (w: WorkOrder) => void; reportedBy: string; room?: string }) {
  const [f, setF] = useState({ title: "", where: "Room", room: room ?? "", place: "", cat: "General", priority: "Medium" as WOPriority, outOfOrder: false, guestImpact: false, desc: "" });
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
        <Select id="wo-pri" label="Priority" value={f.priority} onChange={set("priority")} options={["High", "Medium", "Low"]} />
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
const FILTERS = ["Open", "Overdue", "Waiting to be checked", "Closed", "All"] as const;
type Filter = typeof FILTERS[number];

export function WorkOrders({ add, nav, openNew }: { add: Add; nav?: Nav; openNew?: string }) {
  const [, refresh] = useState(0);
  const [filter, setFilter] = useState<Filter>("Open");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(openNew !== undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTech, setBulkTech] = useState<string | null>(null);

  const all = workOrders();
  const count = (fl: Filter) => all.filter(w => matches(w, fl)).length;
  function matches(w: WorkOrder, fl: Filter) {
    if (fl === "Open") return isOpen(w);
    if (fl === "Overdue") return isOverdue(w);
    if (fl === "Waiting to be checked") return w.status === "Fixed";
    if (fl === "Closed") return w.status === "Closed" || w.status === "Cancelled";
    return true;
  }
  const visible = all.filter(w => matches(w, filter) &&
    (!search || `${w.id} ${w.title} ${w.location} ${w.tech ?? ""}`.toLowerCase().includes(search.toLowerCase())));
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const assignSelected = () => {
    if (!bulkTech) return;
    selected.forEach(id => {
      const w = workOrder(id);
      if (w && isOpen(w)) updateWorkOrder(id, { tech: bulkTech, status: w.status === "Reported" ? "Assigned" : w.status }, { event: "Assigned", by: "Adaeze Okonkwo", note: `Assigned to ${bulkTech}.` });
    });
    add({ type: "success", title: `${selected.length} work order${selected.length === 1 ? "" : "s"} assigned to ${bulkTech}` });
    setSelected([]); setBulkTech(null); refresh(n => n + 1);
  };
  const exportList = () => {
    downloadCsv("work-orders.csv", [["ID", "Title", "Location", "Category", "Priority", "Status", "Assigned to", "Reported", "Reported by", "Due"],
      ...visible.map(w => [w.id, w.title, w.location, w.cat, w.priority, statusLabel(w) + (isOverdue(w) ? " (overdue)" : ""), w.tech ?? "Nobody yet", fmtWhen(w.reportedAt), w.reportedBy, fmtWhen(w.slaDue)])]);
    add({ type: "success", title: `${visible.length} work orders saved as work-orders.csv` });
  };

  return (
    <div>
      <PageHeader title="Work Orders" sub="Everything that needs fixing, from report to sign-off."
        actions={<><BtnO label="Export" icon={Download} onClick={exportList} /><BtnP label="New work order" icon={Plus} onClick={() => setShowNew(true)} /></>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard label="Not started" value={String(all.filter(w => w.status === "Reported" || w.status === "Assigned").length)} sub={`${all.filter(w => w.status === "Reported").length} still need someone`} icon={AlertCircle} accent={PRIMARY} />
        <StatCard label="Being fixed" value={String(all.filter(w => w.status === "In progress").length)} sub="Work started" icon={Activity} accent={ORANGE_INK} />
        <StatCard label="Overdue" value={String(count("Overdue"))} sub="Past the time to fix" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Waiting to be checked" value={String(count("Waiting to be checked"))} sub="Fixed, needs sign-off" icon={CheckCircle2} accent={TEAL_INK} />
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
              {["Work order", "Priority", "Status", "Assigned to", "Reported", "Fix by"].map(h => (
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
                    {w.outOfOrder && isOpen(w) || (w.outOfOrder && w.status === "Fixed") ? <span style={{ color: ERROR }}> · Room out of order</span> : null}
                    {w.guestImpact && isOpen(w) ? <span style={{ color: ORANGE_INK }}> · Guest affected</span> : null}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm font-medium whitespace-nowrap" style={{ color: PRI_C[w.priority] }}>{w.priority}</td>
                <td className="px-3 py-3"><StatusBadge w={w} /></td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: w.tech ? TEXT : WARNING_INK }}>{w.tech ?? "Nobody yet"}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm" style={{ color: TEXT }}>{fmtWhen(w.reportedAt)}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{w.reportedBy}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm" style={{ color: isOverdue(w) ? ERROR : TEXT }}>{fmtWhen(w.slaDue)}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{isOpen(w) ? `Open ${ageOf(w)}` : statusLabel(w)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState icon={Wrench} message={filter === "Overdue" ? "Nothing is overdue." : "No work orders here."} cta="New work order" onCta={() => setShowNew(true)} />}
      </div>

      {bulkTech !== null && (
        <Dialog title={`Assign ${selected.length} work order${selected.length === 1 ? "" : "s"}`} onClose={() => setBulkTech(null)}
          footer={<><BtnO label="Cancel" onClick={() => setBulkTech(null)} /><BtnP label="Assign" onClick={assignSelected} /></>}>
          <Select id="bulk-tech" label="Technician" value={bulkTech} onChange={setBulkTech} options={TECHNICIANS} />
          <p className="text-sm" style={{ color: MUTED }}>Closed and cancelled orders in the selection are left as they are.</p>
        </Dialog>
      )}
      {showNew && <NewWorkOrderDialog room={openNew} reportedBy="Adaeze Okonkwo" onClose={() => setShowNew(false)}
        onCreated={w => { setShowNew(false); add({ type: "success", title: `Work order ${w.id} created`, body: w.outOfOrder ? `Room ${w.room} is now out of order.` : w.location }); refresh(n => n + 1); }} />}
    </div>
  );
}

// ── One work order ───────────────────────────────────────────────────────────
// Report → assign → start → fixed → checked and closed. Cancelled ends it at any point before closing.
const NEXT: Partial<Record<WOStatus, { to: WOStatus; label: string }>> = {
  Assigned: { to: "In progress", label: "Start work" },
  "In progress": { to: "Fixed", label: "Mark as fixed" },
};

export function WorkOrderDetail({ add, nav, id }: { add: Add; nav?: Nav; id?: string }) {
  const [, refresh] = useState(0);
  const w = workOrder(id ?? "") ?? workOrders().find(isOpen) ?? workOrders()[0];
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState<null | "assign" | "fixed" | "close" | "reopen" | "cancel" | "part" | "follow">(null);
  const [tech, setTech] = useState(w.tech ?? TECHNICIANS[0]);
  const [resolution, setResolution] = useState(w.resolution ?? "");
  const [reason, setReason] = useState("");
  const [part, setPart] = useState({ item: "", qty: "1", unit: "", ref: "" });
  const me = "Adaeze Okonkwo";
  const done = () => { setDialog(null); refresh(n => n + 1); };
  const asset = ASSETS.find(a => a.id === w.asset);
  const partTotal = w.parts.reduce((s, p) => s + p.qty * p.unit, 0);
  const labour = w.labourHours * LABOUR_RATE;
  const closedOrCancelled = w.status === "Closed" || w.status === "Cancelled";

  const move = (to: WOStatus, event: string, noteText: string, patch: Partial<WorkOrder> = {}) => {
    updateWorkOrder(w.id, { status: to, ...patch }, { event, by: patch.tech && to === "Assigned" ? me : (w.tech ?? me), note: noteText });
  };

  const primary = (() => {
    if (w.status === "Reported") return <BtnP label="Assign a technician" onClick={() => setDialog("assign")} />;
    if (w.status === "Assigned") return <BtnP label="Start work" onClick={() => { move("In progress", "Work started", "Work started."); add({ type: "success", title: `${w.id}: work started` }); done(); }} />;
    if (w.status === "In progress") return <BtnP label="Mark as fixed" onClick={() => setDialog("fixed")} />;
    if (w.status === "Fixed") return <BtnP label="Check and close" onClick={() => setDialog("close")} />;
    return null;
  })();

  return (
    <div>
      <PageHeader title={`${w.title}`} sub={`${w.id} · ${w.location} · reported ${fmtWhen(w.reportedAt)} by ${w.reportedBy}`}
        actions={<div className="flex flex-wrap gap-2">
          <BtnO label="All work orders" onClick={() => nav?.("work-orders", "Work Orders")} />
          {!closedOrCancelled && <BtnO label="Cancel order" onClick={() => setDialog("cancel")} />}
          {w.status === "Fixed" && <BtnO label="Not fixed, reopen" onClick={() => setDialog("reopen")} />}
          {primary}
        </div>} />

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

          <Card title="Parts and labour" actions={!closedOrCancelled && <BtnO label="Add a part" icon={Plus} onClick={() => setDialog("part")} />}>
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
                <input aria-label="Labour hours" type="number" step="0.5" min="0" disabled={closedOrCancelled} value={w.labourHours}
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
            {!closedOrCancelled && (
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
            <Row label="Priority" value={<span style={{ color: PRI_C[w.priority] }}>{w.priority}</span>} />
            <Row label="Category" value={w.cat} />
            <Row label="Assigned to" value={w.tech ?? "Nobody yet"} />
            <Row label="Fix by" value={<span style={{ color: isOverdue(w) ? ERROR : TEXT }}>{fmtWhen(w.slaDue)}</span>} />
            <Row label="Open for" value={isOpen(w) ? ageOf(w) : "No longer open"} />
            {w.room && <Row label="Room" value={w.outOfOrder && !closedOrCancelled ? <span style={{ color: ERROR }}>Out of order</span> : "In service"} />}
            <label className="flex items-center gap-2.5 text-sm pt-3" style={{ color: TEXT }}>
              <input type="checkbox" className="w-4 h-4" disabled={closedOrCancelled} checked={w.guestImpact}
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

      {dialog === "assign" && (
        <Dialog title="Assign a technician" onClose={() => setDialog(null)}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label="Assign" onClick={() => { move("Assigned", "Assigned", `Assigned to ${tech}.`, { tech }); add({ type: "success", title: `${w.id} assigned to ${tech}` }); done(); }} /></>}>
          <Select id="as-tech" label="Technician" value={tech} onChange={setTech} options={TECHNICIANS} />
        </Dialog>
      )}
      {(dialog === "fixed" || dialog === "close") && (
        <Dialog title={dialog === "fixed" ? "Mark as fixed" : "Check and close"} onClose={() => setDialog(null)}
          sub={dialog === "fixed" ? "Say what was done. Someone else checks it before the order closes." : w.room && w.outOfOrder ? `Closing puts room ${w.room} back in service.` : "Close the order once you have checked the fix."}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label={dialog === "fixed" ? "Mark as fixed" : "Close work order"} onClick={() => {
            if (!resolution.trim()) return;
            if (dialog === "fixed") { move("Fixed", "Fixed", resolution.trim(), { resolution: resolution.trim() }); add({ type: "success", title: `${w.id} fixed, waiting to be checked` }); }
            else { updateWorkOrder(w.id, { status: "Closed", resolution: resolution.trim() }, { event: "Checked and closed", by: me, note: resolution.trim() }); add({ type: "success", title: `${w.id} closed`, body: w.room && w.outOfOrder ? `Room ${w.room} is back in service.` : undefined }); }
            done();
          }} /></>}>
          <Field label="What was done" htmlFor="wo-res" required error={!resolution.trim() ? "Needed before the order moves on." : undefined}>
            <textarea id="wo-res" rows={3} value={resolution} onChange={e => setResolution(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none"
              style={{ border: `1px solid ${resolution.trim() ? "#CBD5E1" : ERROR}`, borderRadius: UI.radius.control, color: TEXT }} />
          </Field>
        </Dialog>
      )}
      {(dialog === "reopen" || dialog === "cancel") && (
        <Dialog title={dialog === "reopen" ? "Reopen work order" : "Cancel work order"} danger={dialog === "cancel"} onClose={() => setDialog(null)}
          sub={dialog === "cancel" && w.room && w.outOfOrder ? `Room ${w.room} goes back in service.` : undefined}
          footer={<><BtnO label="Back" onClick={() => setDialog(null)} /><BtnP label={dialog === "reopen" ? "Reopen" : "Cancel work order"} onClick={() => {
            if (!reason.trim()) return;
            if (dialog === "reopen") move("In progress", "Reopened", reason.trim(), { resolution: undefined });
            else move("Cancelled", "Cancelled", reason.trim());
            add({ type: dialog === "reopen" ? "warning" : "info", title: `${w.id} ${dialog === "reopen" ? "reopened" : "cancelled"}` }); setReason(""); done();
          }} /></>}>
          <Field label={dialog === "reopen" ? "What is still wrong" : "Why cancel it"} htmlFor="wo-why" required>
            <input id="wo-why" value={reason} onChange={e => setReason(e.target.value)} className={controlClass} style={controlStyle()} />
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
