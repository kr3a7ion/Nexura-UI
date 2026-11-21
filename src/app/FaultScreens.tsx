// Fault reports: anyone outside Maintenance reports what is wrong; Maintenance decides if it is a job and how urgent.
import React, { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import type { Role, Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, TEAL_INK, ORANGE_INK } from "./constants";
import { PageHeader, BtnP, BtnO, EmptyState, Badge } from "./UIKit";
import { UI, Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { ROOMS } from "./mock/property";
import { faultReports, reportsBy, reportFault, makeJob, turnDown, fmtWhen, WO_CATEGORIES, PRIORITIES, priorityLabel, type FaultReport, type WOPriority } from "./mock/maintenance";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;
const TRIAGERS: Role[] = ["MX", "MGT"];
const STATUS_C: Record<FaultReport["status"], { bg: string; text: string }> = {
  New: { bg: "#EEF2FF", text: "#4338CA" }, "Made into a job": { bg: "#DCFCE7", text: "#166534" }, "Turned down": { bg: "#F1F5F9", text: "#475569" },
};
const Check = ({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) => (
  <label className="flex items-center gap-2.5 text-sm" style={{ color: TEXT }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4" />{children}
  </label>
);

// Shared by Housekeeping (My Tasks, the board), Front Office and this screen. The reporter never picks a priority.
export function ReportFaultDialog({ onClose, onReported, reportedBy, dept, room }: { onClose: () => void; onReported: (r: FaultReport) => void; reportedBy: string; dept: string; room?: string }) {
  const [f, setF] = useState({ title: "", where: "Room", room: room ?? "", place: "", desc: "", guestCannotUse: false, danger: false });
  const [tried, setTried] = useState(false);
  const set = <K extends keyof typeof f>(k: K) => (v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));
  const location = f.where === "Room" ? (f.room ? `Room ${f.room}` : "") : f.place.trim();
  const save = () => {
    setTried(true); if (!f.title.trim() || !location) return;
    onReported(reportFault({ title: f.title.trim(), location, room: f.where === "Room" ? f.room : undefined, desc: f.desc.trim() || f.title.trim(), reportedBy, dept, guestCannotUse: f.where === "Room" && f.guestCannotUse, danger: f.danger }));
  };
  return (
    <Dialog title="Report a fault" sub="Say what is wrong and where. Maintenance decides how urgent it is and tells you." onClose={onClose}
      footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Send report" onClick={save} /></>}>
      <Field label="What is wrong" htmlFor="rf-title" required error={tried && !f.title.trim() ? "Write a short title, for example \"Tap dripping\"." : undefined}>
        <input id="rf-title" value={f.title} onChange={e => set("title")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.title.trim())} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Where" htmlFor="rf-where">
          <select id="rf-where" value={f.where} onChange={e => set("where")(e.target.value)} className={controlClass} style={controlStyle()}>{["Room", "Somewhere else"].map(o => <option key={o}>{o}</option>)}</select>
        </Field>
        {f.where === "Room" ? (
          <Field label="Room" htmlFor="rf-room" required error={tried && !f.room ? "Choose the room." : undefined}>
            <select id="rf-room" value={f.room} onChange={e => set("room")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.room)}>
              <option value="">Choose…</option>{ROOMS.map(r => <option key={r.id} value={r.id}>{r.id} · {r.type}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Place" htmlFor="rf-place" required error={tried && !f.place.trim() ? "Say where, for example \"Lobby\"." : undefined}>
            <input id="rf-place" value={f.place} onChange={e => set("place")(e.target.value)} className={controlClass} style={controlStyle(tried && !f.place.trim())} />
          </Field>
        )}
      </div>
      <Field label="Details" htmlFor="rf-desc" hint="What you saw, since when, and anything you already tried.">
        <textarea id="rf-desc" rows={3} value={f.desc} onChange={e => set("desc")(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none" style={{ border: "1px solid #CBD5E1", borderRadius: UI.radius.control, color: TEXT }} />
      </Field>
      <div className="space-y-2">
        {f.where === "Room" && <Check checked={f.guestCannotUse} onChange={set("guestCannotUse")}>The guest cannot use the room like this</Check>}
        <Check checked={f.danger} onChange={set("danger")}>It is a danger to people (water near power, sparks, gas, smoke)</Check>
      </div>
    </Dialog>
  );
}

export function FaultReports({ add, nav, role, staffName, dept }: { add: Add; nav?: Nav; role: Role; staffName: string; dept: string }) {
  const [, refresh] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [job, setJob] = useState<FaultReport | null>(null);
  const [down, setDown] = useState<FaultReport | null>(null);
  const [j, setJ] = useState({ priority: "P3" as WOPriority, cat: "General", outOfOrder: false });
  const [reason, setReason] = useState("");
  const triager = TRIAGERS.includes(role);
  const list = triager ? faultReports() : reportsBy(staffName);
  const fresh = list.filter(r => r.status === "New"), done = list.filter(r => r.status !== "New");
  const close = () => { setJob(null); setDown(null); setReason(""); refresh(n => n + 1); };

  const row = (r: FaultReport) => (
    <div key={r.id} className="flex flex-col gap-3 border-t p-4 first:border-t-0 sm:flex-row sm:items-center" style={{ borderColor: BORDER }}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: TEXT }}>{r.title}</span>
          <Badge label={r.status} colors={STATUS_C[r.status]} />
          {r.danger && <Badge label="Danger to people" colors={{ bg: "#FEE2E2", text: "#991B1B" }} />}
          {r.guestCannotUse && <Badge label="Guest cannot use the room" colors={{ bg: "#FFEDD5", text: "#9A3412" }} />}
        </div>
        <p className="mt-1 text-sm" style={{ color: TEXT }}>{r.location}. {r.desc}</p>
        <p className="mt-0.5 text-sm" style={{ color: MUTED }}>
          {r.id} · {r.reportedBy}, {r.dept} · {fmtWhen(r.at)}
          {r.status === "Turned down" && ` · Turned down by ${r.decidedBy}: ${r.reason}`}
          {r.status === "Made into a job" && ` · ${r.jobId}, by ${r.decidedBy}`}
        </p>
      </div>
      <div className="flex flex-none gap-2">
        {triager && r.status === "New" && <><BtnO label="Turn down" onClick={() => setDown(r)} /><BtnP label="Make a job" onClick={() => { setJob(r); setJ({ priority: r.danger ? "P1" : r.guestCannotUse ? "P2" : "P3", cat: "General", outOfOrder: r.guestCannotUse }); }} /></>}
        {r.jobId && <BtnO label={`Open ${r.jobId}`} onClick={() => nav?.("work-order-detail", "Work Order", r.jobId)} />}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Fault reports" sub={triager ? "Reports from other departments. Make each one a job, or turn it down with a reason." : "Faults you reported and what Maintenance decided."}
        actions={<BtnP label="Report a fault" icon={Plus} onClick={() => setShowNew(true)} />} />
      <div className="space-y-7">
        <Card title={triager ? `To decide (${fresh.length})` : `Waiting for Maintenance (${fresh.length})`} flush>
          {fresh.length ? fresh.map(row) : <EmptyState icon={Wrench} message={triager ? "Nothing to decide. New reports appear here." : "Nothing waiting."} />}
        </Card>
        <Card title="Decided" flush>{done.length ? done.map(row) : <EmptyState icon={Wrench} message="No decided reports yet." />}</Card>
      </div>

      {showNew && <ReportFaultDialog reportedBy={staffName} dept={dept} onClose={() => setShowNew(false)}
        onReported={r => { setShowNew(false); add({ type: "success", title: `${r.id} sent to Maintenance`, body: "You will be told when they decide." }); refresh(n => n + 1); }} />}

      {job && (
        <Dialog title="Make a job" sub={`${job.id}: ${job.title}, ${job.location}`} onClose={() => setJob(null)}
          footer={<><BtnO label="Cancel" onClick={() => setJob(null)} /><BtnP label="Make the job" onClick={() => {
            const w = makeJob(job.id, { ...j, by: staffName });
            if (!w) { add({ type: "error", title: "This report has already been decided" }); close(); return; }
            add({ type: "success", title: `${w.id} raised from ${job.id}`, body: `${job.reportedBy} has been told.` }); close();
          }} /></>}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority" htmlFor="fr-pri"><select id="fr-pri" value={j.priority} onChange={e => setJ(p => ({ ...p, priority: e.target.value as WOPriority }))} className={controlClass} style={controlStyle()}>{(Object.keys(PRIORITIES) as WOPriority[]).map(o => <option key={o} value={o}>{priorityLabel(o)}</option>)}</select></Field>
            <Field label="Category" htmlFor="fr-cat"><select id="fr-cat" value={j.cat} onChange={e => setJ(p => ({ ...p, cat: e.target.value }))} className={controlClass} style={controlStyle()}>{WO_CATEGORIES.map(o => <option key={o}>{o}</option>)}</select></Field>
          </div>
          {job.room && <Check checked={j.outOfOrder} onChange={v => setJ(p => ({ ...p, outOfOrder: v }))}>Take room {job.room} out of order until it is fixed</Check>}
        </Dialog>
      )}
      {down && (
        <Dialog title="Turn down this report" sub={`${down.id}: ${down.title}`} onClose={() => setDown(null)}
          footer={<><BtnO label="Back" onClick={() => setDown(null)} /><BtnP label="Turn down" onClick={() => {
            if (!turnDown(down.id, reason, staffName)) { add({ type: "error", title: reason.trim() ? "This report has already been decided" : "Say why" }); if (reason.trim()) close(); return; }
            add({ type: "info", title: `${down.id} turned down`, body: `${down.reportedBy} has been told why.` }); close();
          }} /></>}>
          <Field label="Why" htmlFor="fr-why" required hint="The person who reported it sees this.">
            <input id="fr-why" value={reason} onChange={e => setReason(e.target.value)} className={controlClass} style={controlStyle(!reason.trim())} />
          </Field>
        </Dialog>
      )}
    </div>
  );
}
