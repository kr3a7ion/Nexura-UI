// Maintenance: the asset register and planned work (schedules and checklists), read from mock/ppm.ts.
import React, { useState } from "react";
import { Plus, Download, AlertTriangle, CalendarClock, CheckCircle2, Gauge, Package, Activity } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, TEAL_INK, WARNING_INK } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { UI, Card, Field, Row, Dialog, controlClass, controlStyle, downloadCsv } from "./ui";
import { Select, WO_STATUS_C } from "./WorkOrderScreens";
import { fmtDate } from "./constants";
import { addWorkOrder, PRIORITIES, priorityLabel, type WOPriority } from "./mock/maintenance";
import {
  assets, asset, assetJobs, logMeter, schedules, checklists, addChecklist, addSchedule, raiseNow, openJobFor, scheduleState, everyLabel,
  compliance, CALENDAR_UNITS, type Schedule, type Unit, type ChecklistItem,
} from "./mock/ppm";
import { parseDay } from "./mock/roster";
import { DateInput } from "./DateInput";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;
const STATE_C: Record<string, { bg: string; text: string }> = {
  Overdue: { bg: "#FEE2E2", text: "#991B1B" }, "Due soon": { bg: "#FEF3C7", text: "#92400E" }, "Due now": { bg: "#FEF3C7", text: "#92400E" }, "On schedule": { bg: "#DCFCE7", text: "#166534" },
};
const ASSET_C: Record<string, { bg: string; text: string }> = { Operational: { bg: "#DCFCE7", text: "#166534" }, Degraded: { bg: "#FEF3C7", text: "#92400E" }, Offline: { bg: "#FEE2E2", text: "#991B1B" } };
const day = (k?: string) => k ? fmtDate(parseDay(k)) : "Not set";
const dueText = (s: Schedule) => s.nextMeter != null ? `At ${s.nextMeter.toLocaleString()} ${s.unit}` : day(s.nextDue);
const naira = (n: number) => `₦${n.toLocaleString()}`;
const th = "px-3 py-3 text-left text-sm font-medium whitespace-nowrap";
const Table = ({ heads, children }: { heads: string[]; children: React.ReactNode }) => (
  <div className="bg-white overflow-x-auto" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
    <table className="w-full">
      <thead><tr style={{ backgroundColor: UI.surface, borderBottom: `1px solid ${BORDER}` }}>{heads.map(h => <th key={h} className={th} style={{ color: MUTED }}>{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

// ── Asset register ──────────────────────────────────────────────────────────
export function AssetRegister({ add, nav, staffName }: { add: Add; nav?: Nav; staffName: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [, redraw] = useState(0);
  const list = assets();
  const sel = asset(selected ?? undefined);
  const plansFor = (id: string) => schedules().filter(s => s.assetId === id);
  const worst = (id: string) => plansFor(id).map(scheduleState).sort((a, b) => ["Overdue", "Due now", "Due soon", "On schedule"].indexOf(a) - ["Overdue", "Due now", "Due soon", "On schedule"].indexOf(b))[0];
  const raise = (id: string) => {
    const a = asset(id)!;
    const w = addWorkOrder({ title: `Fault on ${a.name}`, location: a.location, cat: a.cat, priority: "P3", reportedBy: staffName, desc: `Raised from the asset register for ${a.id}.`, asset: a.id });
    add({ type: "success", title: `Work order ${w.id} raised`, body: a.name }); nav?.("work-order-detail", w.id, w.id);
  };
  const saveReading = () => {
    const refused = logMeter(reading!, Number(value));
    if (refused) { add({ type: "error", title: refused }); return; }
    add({ type: "success", title: "Reading saved", body: "Any service it brings due is raised on the next check." }); setReading(null); setValue(""); redraw(n => n + 1);
  };

  return (
    <div>
      <PageHeader title="Asset Register" sub="Everything Maintenance looks after, its planned service and its job history."
        actions={<BtnO label="Export" icon={Download} onClick={() => { downloadCsv("asset-register.csv", [["ID", "Name", "Category", "Location", "Criticality", "Status", "Next service"], ...list.map(a => [a.id, a.name, a.cat, a.location, a.criticality, a.status, plansFor(a.id).map(dueText).join("; ")])]); add({ type: "success", title: `${list.length} assets saved as asset-register.csv` }); }} />} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard label="Assets" value={String(list.length)} sub="On the register" icon={Package} accent={TEAL_INK} />
        <StatCard label="Service overdue" value={String(list.filter(a => worst(a.id) === "Overdue").length)} sub="Past the planned date" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Service due" value={String(list.filter(a => ["Due soon", "Due now"].includes(worst(a.id) ?? "")).length)} sub="Raised or about to be" icon={CalendarClock} accent={WARNING_INK} />
        <StatCard label="Degraded or offline" value={String(list.filter(a => a.status !== "Operational").length)} sub="Needs attention" icon={Activity} accent={MUTED} />
      </div>
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <Table heads={["Asset", "Location", "Criticality", "Meter", "Next service", "Status", ""]}>
            {list.map(a => (
              <tr key={a.id} onClick={() => setSelected(a.id === selected ? null : a.id)} className="cursor-pointer"
                style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: a.id === selected ? UI.selectedBg : "white" }}>
                <td className="px-3 py-3 min-w-[220px]"><div className="text-sm font-semibold" style={{ color: TEXT }}>{a.name}</div><div className="text-sm" style={{ color: MUTED }}>{a.id}, {a.cat}</div></td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{a.location}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: a.criticality === "Critical" ? ERROR : TEXT }}>{a.criticality}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{a.meter ? `${a.meter.value.toLocaleString()} ${a.meter.unit}` : "None"}</td>
                <td className="px-3 py-3 whitespace-nowrap">{plansFor(a.id).length ? <>
                  <div className="text-sm" style={{ color: TEXT }}>{plansFor(a.id).map(dueText).join(", ")}</div>
                  <Badge label={worst(a.id)!} colors={STATE_C[worst(a.id)!]} /></> : <span className="text-sm" style={{ color: MUTED }}>No plan</span>}</td>
                <td className="px-3 py-3 whitespace-nowrap"><Badge label={a.status} colors={ASSET_C[a.status]} /></td>
                <td className="px-3 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                  {a.meter && <span className="mr-2"><BtnO label={`Log reading for ${a.id}`} onClick={() => { setReading(a.id); setValue(String(a.meter!.value)); }} /></span>}
                  <BtnO label={`Raise a job for ${a.id}`} onClick={() => raise(a.id)} />
                </td>
              </tr>
            ))}
          </Table>
        </div>
        {sel && (
          <div className="w-80 flex-shrink-0 space-y-4">
            <Card title={sel.name} sub={`${sel.id}, ${sel.cat}`}>
              <Row label="Location" value={sel.location} /><Row label="Supplier" value={sel.supplier} /><Row label="Bought" value={sel.purchased} />
              <Row label="Cost" value={naira(sel.cost)} /><Row label="Warranty to" value={sel.warranty} />
              {sel.meter && <Row label="Meter" value={`${sel.meter.value.toLocaleString()} ${sel.meter.unit}`} />}
            </Card>
            <Card title="Planned service">
              {plansFor(sel.id).length ? plansFor(sel.id).map(s => <Row key={s.id} label={s.name} value={`${everyLabel(s)}. Next: ${dueText(s)}`} />) : <p className="text-sm" style={{ color: MUTED }}>No schedule yet. Add one under Planned Work.</p>}
            </Card>
            <Card title="Job history" sub="Repeat faults on one asset are a maintenance problem, and show here.">
              {assetJobs(sel.id).length ? assetJobs(sel.id).map(w => (
                <button key={w.id} type="button" onClick={() => nav?.("work-order-detail", w.id, w.id)} className="w-full text-left py-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>{w.id}: {w.title}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{fmtDate(w.reportedAt)} · <span style={{ color: WO_STATUS_C[w.status].text }}>{w.status}</span>{w.timeline.filter(e => e.event === "Sent back" || e.event === "Reopened").length ? `, ${w.timeline.filter(e => e.event === "Sent back" || e.event === "Reopened").length} reopened` : ""}</div>
                </button>)) : <p className="text-sm" style={{ color: MUTED }}>No jobs yet.</p>}
            </Card>
          </div>
        )}
      </div>
      {reading && (
        <Dialog title={`Log reading: ${asset(reading)!.name}`} sub="A reading never goes backwards. A meter-based service comes due when the reading passes its figure." onClose={() => setReading(null)}
          footer={<><BtnO label="Cancel" onClick={() => setReading(null)} /><BtnP label="Save reading" onClick={saveReading} /></>}>
          <Field label={`Reading (${asset(reading)!.meter!.unit})`} htmlFor="as-meter" required>
            <input id="as-meter" inputMode="numeric" value={value} onChange={e => setValue(e.target.value.replace(/[^\d.]/g, ""))} className={controlClass} style={controlStyle()} />
          </Field>
        </Dialog>
      )}
    </div>
  );
}

// ── Planned work ────────────────────────────────────────────────────────────
export function PlannedWork({ add, nav }: { add: Add; nav?: Nav }) {
  const [dialog, setDialog] = useState<null | "schedule" | "checklist">(null);
  const [, redraw] = useState(0);
  const c = compliance();
  const list = schedules();
  const raise = (id: string) => {
    const r = raiseNow(id);
    if (typeof r === "string") { add({ type: "error", title: r }); return; }
    add({ type: "success", title: `${r.id} raised`, body: "Assign it from Work Orders." }); redraw(n => n + 1);
  };
  return (
    <div>
      <PageHeader title="Planned Work" sub="Servicing that happens because a schedule said so, not because something broke."
        actions={<><BtnO label="New checklist" icon={Plus} onClick={() => setDialog("checklist")} /><BtnP label="New schedule" icon={Plus} onClick={() => setDialog("schedule")} /></>} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard label="Compliance, 90 days" value={c.pct == null ? "Not yet" : `${c.pct}%`} sub={c.pct == null ? "Nothing done or late yet to judge" : `${c.onTime} on time of ${c.judged} judged`} icon={Gauge} accent={TEAL_INK} />
        <StatCard label="Raised" value={String(c.raised)} sub="Planned jobs in 90 days" icon={CalendarClock} accent={MUTED} />
        <StatCard label="Late" value={String(c.late + c.overdue)} sub={`${c.late} done late, ${c.overdue} open past due`} icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Open" value={String(c.open)} sub="Raised, not yet done" icon={CheckCircle2} accent={WARNING_INK} />
      </div>
      <div className="mb-7">
        <Table heads={["Schedule", "Every", "Next due", "Checklist", "Job", "State", ""]}>
          {list.map(s => {
            const job = openJobFor(s), st = scheduleState(s);
            return (
              <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td className="px-3 py-3 min-w-[220px]"><div className="text-sm font-semibold" style={{ color: TEXT }}>{s.name}</div><div className="text-sm" style={{ color: MUTED }}>{asset(s.assetId)?.name}, {priorityLabel(s.priority)}</div></td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{everyLabel(s)}{s.leadDays ? <div style={{ color: MUTED }}>Raised {s.leadDays} days early</div> : null}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: st === "Overdue" ? ERROR : TEXT }}>{dueText(s)}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{checklists().find(x => x.id === s.checklist)?.name ?? "None"}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">{job
                  ? <button type="button" className="font-semibold underline" style={{ color: TEAL_INK }} onClick={() => nav?.("work-order-detail", job.id, job.id)}>{job.id}, {job.status.toLowerCase()}</button>
                  : <span style={{ color: MUTED }}>None open</span>}</td>
                <td className="px-3 py-3 whitespace-nowrap"><Badge label={st} colors={STATE_C[st]} /></td>
                <td className="px-3 py-3 whitespace-nowrap text-right">{!job && <BtnO label={`Raise ${s.id} now`} onClick={() => raise(s.id)} />}</td>
              </tr>
            );
          })}
        </Table>
      </div>
      <div className="grid xl:grid-cols-2 gap-4">
        {checklists().map(cl => (
          <Card key={cl.id} title={cl.name} sub={`${cl.items.length} steps. The technician fills this in on the job; critical steps must be recorded before it can be completed.`}>
            <ol className="space-y-1.5">{cl.items.map((i, n) => (
              <li key={i.id} className="text-sm" style={{ color: TEXT }}>{n + 1}. {i.task}{i.expected ? <span style={{ color: MUTED }}> (expect {i.expected})</span> : null}
                {i.critical && <span className="ml-2"><Badge label="Critical" colors={{ bg: "#FEE2E2", text: "#991B1B" }} /></span>}{i.reading && <span className="ml-2"><Badge label="Reading" colors={{ bg: "#F0FDFA", text: TEAL_INK }} /></span>}</li>))}</ol>
          </Card>
        ))}
      </div>
      {dialog === "schedule" && <ScheduleDialog onClose={() => setDialog(null)} onDone={msg => { add({ type: "success", title: msg }); setDialog(null); redraw(n => n + 1); }} onError={t => add({ type: "error", title: t })} />}
      {dialog === "checklist" && <ChecklistDialog onClose={() => setDialog(null)} onDone={msg => { add({ type: "success", title: msg }); setDialog(null); redraw(n => n + 1); }} onError={t => add({ type: "error", title: t })} />}
    </div>
  );
}

function ScheduleDialog({ onClose, onDone, onError }: { onClose: () => void; onDone: (m: string) => void; onError: (m: string) => void }) {
  const [f, setF] = useState({ name: "", assetId: assets()[0].id, every: "1", unit: "month" as Unit, leadDays: "7", priority: "P4" as WOPriority, checklist: "", estMins: "60", first: "" });
  const set = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const meterUnit = asset(f.assetId)?.meter?.unit;
  const save = () => {
    const refused = addSchedule({ name: f.name, assetId: f.assetId, every: Number(f.every), unit: f.unit, leadDays: Number(f.leadDays) || 0, priority: f.priority,
      checklist: f.checklist || undefined, estMins: Number(f.estMins) || 0, nextDue: f.first || undefined });
    if (refused) onError(refused); else onDone(`Schedule "${f.name.trim()}" added`);
  };
  return (
    <Dialog title="New maintenance schedule" wide onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add schedule" onClick={save} /></>}>
      <Field label="What is this job called" htmlFor="ps-name" required><input id="ps-name" value={f.name} onChange={e => set("name")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
      <Select id="ps-asset" label="Applies to" value={f.assetId} onChange={set("assetId")} options={assets().map(a => [a.id, `${a.name} (${a.id})`] as [string, string])} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Every" htmlFor="ps-every" required><input id="ps-every" inputMode="numeric" value={f.every} onChange={e => set("every")(e.target.value.replace(/\D/g, ""))} className={controlClass} style={controlStyle()} /></Field>
        <Select id="ps-unit" label="Unit" value={f.unit} onChange={set("unit")} options={[...CALENDAR_UNITS.map(u => [u, `${u}s`] as [string, string]), ...(meterUnit ? [[meterUnit, `${meterUnit} on the meter`] as [string, string]] : [])]} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Raise the job this early" htmlFor="ps-lead" hint="Days of warning before the due date."><input id="ps-lead" inputMode="numeric" value={f.leadDays} onChange={e => set("leadDays")(e.target.value.replace(/\D/g, ""))} className={controlClass} style={controlStyle()} /></Field>
        <Select id="ps-pri" label="Priority" value={f.priority} onChange={set("priority")} options={(Object.keys(PRIORITIES) as WOPriority[]).map(p => [p, priorityLabel(p)] as [string, string])} />
      </div>
      <Select id="ps-check" label="Checklist to attach" value={f.checklist} onChange={set("checklist")} options={[["", "None"], ...checklists().map(c => [c.id, c.name] as [string, string])]} />
      {CALENDAR_UNITS.includes(f.unit) && <Field label="First one due on" htmlFor="ps-first" hint="Leave blank to count one interval from today.">
        <DateInput id="ps-first" value={f.first} onChange={e => set("first")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>}
    </Dialog>
  );
}

function ChecklistDialog({ onClose, onDone, onError }: { onClose: () => void; onDone: (m: string) => void; onError: (m: string) => void }) {
  const [name, setName] = useState("");
  const [items, setItems] = useState<Omit<ChecklistItem, "id">[]>([{ task: "", critical: false, reading: false }]);
  const upd = (i: number, p: Partial<Omit<ChecklistItem, "id">>) => setItems(list => list.map((x, n) => n === i ? { ...x, ...p } : x));
  const save = () => { const refused = addChecklist(name, items); if (refused) onError(refused); else onDone(`Checklist "${name.trim()}" added`); };
  return (
    <Dialog title="New checklist" wide onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnO label="Add a step" onClick={() => setItems([...items, { task: "", critical: false, reading: false }])} /><BtnP label="Save checklist" onClick={save} /></>}>
      <Field label="Checklist name" htmlFor="cl-name" required><input id="cl-name" value={name} onChange={e => setName(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
      {items.map((it, i) => (
        <div key={i} className="p-3 space-y-2" style={{ border: `1px solid ${BORDER}`, borderRadius: 10 }}>
          <Field label={`Step ${i + 1}`} htmlFor={`cl-task-${i}`}><input id={`cl-task-${i}`} value={it.task} onChange={e => upd(i, { task: e.target.value })} className={controlClass} style={controlStyle()} /></Field>
          <Field label="Expected value" htmlFor={`cl-exp-${i}`} hint="Optional, for example 12.6 V or more."><input id={`cl-exp-${i}`} value={it.expected ?? ""} onChange={e => upd(i, { expected: e.target.value || undefined })} className={controlClass} style={controlStyle()} /></Field>
          <div className="flex gap-5 text-sm" style={{ color: TEXT }}>
            <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" checked={!!it.critical} onChange={e => upd(i, { critical: e.target.checked })} />Critical: must be recorded</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" checked={!!it.reading} onChange={e => upd(i, { reading: e.target.checked })} />Needs a reading</label>
          </div>
        </div>
      ))}
    </Dialog>
  );
}
