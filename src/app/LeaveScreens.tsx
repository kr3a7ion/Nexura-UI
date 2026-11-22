// HR: Leave Management on the shared leave data. Approved leave marks department rosters; departments ask, HR decides.
import React, { useState } from "react";
import { Plus, CalendarCheck, Clock, UserX } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, TEAL_INK, WARNING_INK } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { UI, Card, Field, Row, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { DateInput } from "./DateInput";
import { leaves, leave, decideLeave, recordLeave, cancelLeave, usedDays, days, fmt, LEAVE_TYPES, ENTITLEMENT, type LeaveType, type LeaveStatus } from "./mock/leave";
import { staffAll, staffRecord } from "./mock/staff";
import { dayKey } from "./mock/roster";
import { now } from "./mock/maintenance";

type Add = (t: Omit<Toast, "id">) => void;
const ST_C: Record<LeaveStatus, { bg: string; text: string }> = { Requested: { bg: "#FEF3C7", text: "#92400E" }, Approved: { bg: "#DCFCE7", text: "#166534" }, Declined: { bg: "#FEE2E2", text: "#991B1B" }, Cancelled: { bg: "#F1F5F9", text: "#475569" } };

export function LeaveManagement({ add, staffName }: { add: Add; staffName: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | "record" | "decline">(null);
  const [note, setNote] = useState("");
  const [, redraw] = useState(0);
  const list = leaves();
  const today = dayKey(now());
  const off = list.filter(l => l.status === "Approved" && l.from <= today && l.to >= today);
  const sel = open ? leave(open) : undefined;
  const done = (title: string, refused: string | null) => { if (refused) add({ type: "error", title: refused }); else { add({ type: "success", title }); setDialog(null); setNote(""); redraw(n => n + 1); } };

  return (
    <div>
      <PageHeader title="Leave Management" sub="Departments ask for time off for their people; HR decides. Approved leave marks the person absent on their department's roster, so they cannot be given work."
        actions={<BtnP label="Record leave" icon={Plus} onClick={() => setDialog("record")} />} />
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
        <StatCard label="Waiting for a decision" value={String(list.filter(l => l.status === "Requested").length)} sub="Asked for by departments" icon={Clock} accent={WARNING_INK} />
        <StatCard label="Off today" value={String(off.length)} sub={off.map(l => l.staff.split(" ")[0]).join(", ") || "Nobody"} icon={UserX} accent={MUTED} />
        <StatCard label="Approved" value={String(list.filter(l => l.status === "Approved").length)} sub="This year" icon={CalendarCheck} accent={TEAL_INK} />
      </div>
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0 bg-white overflow-x-auto" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: UI.surface, borderBottom: `1px solid ${BORDER}` }}>
              {["Person", "Leave", "Dates", "Asked by", "Status"].map(h => <th key={h} className="px-3 py-3 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}
            </tr></thead>
            <tbody>{list.map(l => (
              <tr key={l.id} onClick={() => setOpen(l.id === open ? null : l.id)} className="cursor-pointer" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: l.id === open ? UI.selectedBg : "white" }}>
                <td className="px-3 py-3 whitespace-nowrap"><div className="text-sm font-semibold" style={{ color: TEXT }}>{l.staff}</div><div className="text-sm" style={{ color: MUTED }}>{staffRecord(l.staff)?.dept}</div></td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{l.type}, {days(l)} day{days(l) === 1 ? "" : "s"}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{fmt(l.from)} to {fmt(l.to)}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.requestedBy} ({l.source})</td>
                <td className="px-3 py-3 whitespace-nowrap"><Badge label={l.status} colors={ST_C[l.status]} /></td>
              </tr>))}</tbody>
          </table>
        </div>
        {sel && (
          <div className="w-80 flex-shrink-0">
            <Card title={`${sel.staff}: ${sel.type.toLowerCase()} leave`} sub={`${sel.id}, asked by ${sel.requestedBy} (${sel.source})`}
              footer={<div className="flex flex-wrap gap-2">
                {sel.status === "Requested" && <><BtnO label="Decline" onClick={() => setDialog("decline")} /><BtnP label="Approve" onClick={() => done(`Leave approved for ${sel.staff}`, decideLeave(sel.id, true, staffName))} /></>}
                {(sel.status === "Approved" || sel.status === "Requested") && <BtnO label="Cancel leave" onClick={() => done(`Leave cancelled for ${sel.staff}`, cancelLeave(sel.id, staffName))} />}
              </div>}>
              <Row label="Dates" value={`${fmt(sel.from)} to ${fmt(sel.to)}`} />
              <Row label="Why" value={sel.reason} />
              {sel.decidedBy && <Row label={sel.status === "Declined" ? "Declined by" : "Decided by"} value={sel.decidedBy} />}
              {sel.decision && <Row label="Reason given" value={sel.decision} />}
              <div className="text-sm font-semibold mt-4 mb-1" style={{ color: TEXT }}>Days used this year</div>
              {(["Annual", "Sick", "Casual"] as LeaveType[]).concat(sel.type).filter((t, i, a) => a.indexOf(t) === i).map(t =>
                <Row key={t} label={t} value={`${usedDays(sel.staff, t)} of ${ENTITLEMENT[t]}`} />)}
            </Card>
          </div>
        )}
      </div>
      {dialog === "decline" && sel && (
        <Dialog title={`Decline ${sel.staff}'s leave`} sub="The reason goes to whoever asked and to the person." onClose={() => setDialog(null)}
          footer={<><BtnO label="Cancel" onClick={() => setDialog(null)} /><BtnP label="Decline leave" onClick={() => done(`Leave declined for ${sel.staff}`, decideLeave(sel.id, false, staffName, note))} /></>}>
          <Field label="Reason" htmlFor="lv-why" required><textarea id="lv-why" rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none" style={controlStyle()} /></Field>
        </Dialog>
      )}
      {dialog === "record" && <LeaveDialog title="Record leave" sub="For leave HR already knows about (a sick note, a call in). It is approved at once and marks the roster." people={staffAll().filter(s => s.status !== "Left").map(s => s.name)}
        onClose={() => setDialog(null)} onSave={r => { const l = recordLeave(r, staffName); done(typeof l === "string" ? "" : `Leave recorded for ${l.staff}`, typeof l === "string" ? l : null); }} />}
    </div>
  );
}

/** Shared with the roster: a department asks HR for time off for one of its people. */
export function LeaveDialog({ title, sub, people, onClose, onSave }: { title: string; sub: string; people: string[]; onClose: () => void;
  onSave: (r: { staff: string; type: LeaveType; from: string; to: string; reason: string }) => void }) {
  const [f, setF] = useState({ staff: people[0] ?? "", type: "Annual", from: "", to: "", reason: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return (
    <Dialog title={title} sub={sub} onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label={title} onClick={() => onSave({ ...f, type: f.type as LeaveType })} /></>}>
      <Select id="lv-staff" label="Who" value={f.staff} onChange={set("staff")} options={people} />
      <Select id="lv-type" label="Kind of leave" value={f.type} onChange={set("type")} options={[...LEAVE_TYPES]} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="First day" htmlFor="lv-from" required><DateInput id="lv-from" value={f.from} onChange={e => set("from")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
        <Field label="Last day" htmlFor="lv-to" required><DateInput id="lv-to" value={f.to} onChange={e => set("to")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
      </div>
      <Field label="Why" htmlFor="lv-reason" required><input id="lv-reason" value={f.reason} onChange={e => set("reason")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </Dialog>
  );
}

