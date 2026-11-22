// Maintenance: permits to work. Asked for by whoever does the work, issued by someone else, closed only with every lock restored.
import React, { useState } from "react";
import { Plus, ShieldCheck, Clock, Lock, AlertTriangle } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, TEAL_INK, WARNING_INK } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { UI, Card, Field, Row, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { workOrders, isOpen, now, fmtWhen } from "./mock/maintenance";
import {
  permits, permit, requestPermit, issuePermit, isolatePoint, closePermit, lockedPoints, isExpired, PERMIT_TYPES, PRECAUTIONS,
  type Permit, type PermitType,
} from "./mock/permits";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;
const STATUS_C = { Requested: { bg: "#FEF3C7", text: "#92400E" }, Issued: { bg: "#DCFCE7", text: "#166534" }, Closed: { bg: "#F1F5F9", text: "#475569" }, Expired: { bg: "#FEE2E2", text: "#991B1B" } };
const stateOf = (p: Permit) => isExpired(p) ? "Expired" : p.status;

export function Permits({ add, nav, staffName, woId }: { add: Add; nav?: Nav; staffName: string; woId?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [, redraw] = useState(0);
  const list = permits();
  const live = list.filter(p => p.status === "Issued"), waiting = list.filter(p => p.status === "Requested");
  const locks = list.reduce((n, p) => n + lockedPoints(p).length, 0);
  const done = (title: string, refused: string | null) => { if (refused) add({ type: "error", title: refused }); else { add({ type: "success", title }); redraw(n => n + 1); } };
  const sel = open ? permit(open) : undefined;

  return (
    <div>
      <PageHeader title="Permits to Work" sub="Whoever asks for a permit never issues it, and no permit closes while a lock is still on."
        actions={<BtnP label="Request a permit" icon={Plus} onClick={() => setAsking(true)} />} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard label="Live" value={String(live.length)} sub="Issued and open" icon={ShieldCheck} accent={TEAL_INK} />
        <StatCard label="Waiting to be issued" value={String(waiting.length)} sub={waiting.length ? "Work cannot start yet" : "Nothing waiting"} icon={Clock} accent={WARNING_INK} />
        <StatCard label="Points locked out" value={String(locks)} sub="Isolated and not yet restored" icon={Lock} accent={MUTED} />
        <StatCard label="Past their end time" value={String(list.filter(isExpired).length)} sub="Still open: close or renew" icon={AlertTriangle} accent={ERROR} />
      </div>
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0 bg-white overflow-x-auto" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: UI.surface, borderBottom: `1px solid ${BORDER}` }}>
              {["Permit", "Job", "Valid", "People", "Locks", "Status"].map(x => <th key={x} className="px-3 py-3 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{x}</th>)}
            </tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} onClick={() => setOpen(p.id === open ? null : p.id)} className="cursor-pointer" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: p.id === open ? UI.selectedBg : "white" }}>
                  <td className="px-3 py-3 whitespace-nowrap"><div className="text-sm font-semibold" style={{ color: TEXT }}>{p.id}</div><div className="text-sm" style={{ color: MUTED }}>{PERMIT_TYPES[p.type]}</div></td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{p.woId ?? "None"}</td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: isExpired(p) ? ERROR : TEXT }}>{fmtWhen(p.validFrom)}<div style={{ color: isExpired(p) ? ERROR : MUTED }}>to {fmtWhen(p.validTo)}</div></td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: TEXT }}>{p.requestedBy}<div style={{ color: MUTED }}>{p.issuedBy ? `issued by ${p.issuedBy}` : "not issued yet"}</div></td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: lockedPoints(p).length ? ERROR : MUTED }}>{p.points.length ? (lockedPoints(p).length ? `${lockedPoints(p).length} locked` : `${p.points.length} point${p.points.length === 1 ? "" : "s"}, none locked`) : "None"}</td>
                  <td className="px-3 py-3 whitespace-nowrap"><Badge label={stateOf(p)} colors={STATUS_C[stateOf(p)]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel && (
          <div className="w-96 flex-shrink-0">
            <Card title={`${sel.id}: ${PERMIT_TYPES[sel.type]}`} sub={sel.woId ? `For ${sel.woId}` : "Not linked to a job"}
              footer={<div className="flex flex-wrap gap-2">
                {sel.woId && <BtnO label="Open the job" onClick={() => nav?.("work-order-detail", sel.woId!, sel.woId)} />}
                {sel.status === "Requested" && sel.requestedBy !== staffName && <BtnP label="Issue permit" onClick={() => done(`${sel.id} issued`, issuePermit(sel.id, staffName))} />}
                {sel.status === "Issued" && <BtnP label="Close permit" onClick={() => done(`${sel.id} closed`, closePermit(sel.id, staffName))} />}
              </div>}>
              <Row label="Requested by" value={sel.requestedBy} />
              <Row label="Issued by" value={sel.issuedBy ?? (sel.requestedBy === staffName ? "Someone else must issue it" : "Not yet")} />
              <Row label="Valid" value={`${fmtWhen(sel.validFrom)} to ${fmtWhen(sel.validTo)}`} />
              {sel.closedBy && <Row label="Closed" value={`${sel.closedBy}, ${fmtWhen(sel.closedAt!)}`} />}
              {sel.precautions.length > 0 && <>
                <div className="text-sm font-semibold mt-4 mb-1.5" style={{ color: TEXT }}>Precautions</div>
                <ul className="list-disc pl-5 space-y-1">{sel.precautions.map(c => <li key={c} className="text-sm" style={{ color: TEXT }}>{c}</li>)}</ul>
              </>}
              {sel.points.length > 0 && <>
                <div className="text-sm font-semibold mt-4 mb-1.5" style={{ color: TEXT }}>Isolation points</div>
                {sel.points.map(i => {
                  const state = i.restoredAt ? "Restored" : i.isolatedAt ? "Locked out" : "Not isolated";
                  return (
                    <div key={i.id} className="py-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm" style={{ color: TEXT }}>{i.desc}{i.lockTag ? `, tag ${i.lockTag}` : ""}</span>
                        <span className="flex-shrink-0 whitespace-nowrap"><Badge label={state} colors={i.restoredAt ? STATUS_C.Issued : i.isolatedAt ? STATUS_C.Expired : STATUS_C.Closed} /></span>
                      </div>
                      <div className="text-sm" style={{ color: MUTED }}>{i.isolatedAt ? `Isolated by ${i.isolatedBy}, ${fmtWhen(i.isolatedAt)}` : ""}{i.restoredAt ? `. Restored by ${i.restoredBy}, ${fmtWhen(i.restoredAt)}` : ""}</div>
                      {sel.status === "Issued" && !i.restoredAt && <div className="mt-1.5"><BtnO label={i.isolatedAt ? `Restore ${i.desc}` : `Isolate ${i.desc}`}
                        onClick={() => done(i.isolatedAt ? "Isolation restored" : "Point isolated and locked", isolatePoint(sel.id, i.id, staffName, i.isolatedAt ? "restore" : "isolate"))} /></div>}
                    </div>
                  );
                })}
              </>}
            </Card>
          </div>
        )}
      </div>
      {asking && <RequestPermitDialog by={staffName} woId={woId} onClose={() => setAsking(false)}
        onDone={p => { add({ type: "success", title: `${p.id} requested`, body: "The supervisor has been told. Do not start until it is issued." }); setAsking(false); setOpen(p.id); }}
        onError={t => add({ type: "error", title: t })} />}
    </div>
  );
}

// Shared with the work order screen, so a permit can be asked for from the job itself.
export function RequestPermitDialog({ by, woId, onClose, onDone, onError }: { by: string; woId?: string; onClose: () => void; onDone: (p: Permit) => void; onError: (t: string) => void }) {
  const [type, setType] = useState<PermitType>("electrical");
  const [job, setJob] = useState(woId ?? "");
  const [hours, setHours] = useState("4");
  const [checks, setChecks] = useState<string[]>(PRECAUTIONS.electrical);
  const [extra, setExtra] = useState("");
  const [points, setPoints] = useState([{ desc: "", lockTag: "" }]);
  const pickType = (t: string) => { setType(t as PermitType); setChecks(PRECAUTIONS[t as PermitType]); };
  const save = () => {
    const start = now();
    const r = requestPermit({ type, woId: job || undefined, validFrom: start, validTo: new Date(start.getTime() + Number(hours) * 3600000),
      precautions: [...checks, ...extra.split("\n")], points }, by);
    if (typeof r === "string") onError(r); else onDone(r);
  };
  return (
    <Dialog title="Request a permit" sub="It starts now. Nobody begins the work until someone else issues it." wide onClose={onClose}
      footer={<><BtnO label="Cancel" onClick={onClose} /><BtnO label="Add an isolation point" onClick={() => setPoints([...points, { desc: "", lockTag: "" }])} /><BtnP label="Request permit" onClick={save} /></>}>
      <div className="grid grid-cols-2 gap-4">
        <Select id="pt-type" label="Type of work" value={type} onChange={pickType} options={(Object.keys(PERMIT_TYPES) as PermitType[]).map(t => [t, PERMIT_TYPES[t]] as [string, string])} />
        <Select id="pt-hours" label="Valid for" value={hours} onChange={setHours} options={["2", "4", "8", "12"].map(h => [h, `${h} hours`] as [string, string])} />
      </div>
      <Select id="pt-job" label="For job" value={job} onChange={setJob} options={[["", "Not linked to a job"], ...workOrders().filter(isOpen).map(w => [w.id, `${w.id}: ${w.title}`] as [string, string])]} />
      <Field label="Precautions" hint="The standard ones for this type. Untick any that do not apply; add your own below.">
        <div className="space-y-1.5">{PRECAUTIONS[type].map(c => (
          <label key={c} className="flex items-center gap-2.5 text-sm" style={{ color: TEXT }}>
            <input type="checkbox" className="w-4 h-4" checked={checks.includes(c)} onChange={e => setChecks(e.target.checked ? [...checks, c] : checks.filter(x => x !== c))} />{c}
          </label>))}</div>
      </Field>
      <Field label="Other precautions" htmlFor="pt-extra" hint="One per line."><textarea id="pt-extra" rows={2} value={extra} onChange={e => setExtra(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none" style={controlStyle()} /></Field>
      {points.map((p, i) => (
        <div key={i} className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label={`Isolation point ${i + 1}`} htmlFor={`pt-pt-${i}`} required={type === "electrical" && i === 0}>
            <input id={`pt-pt-${i}`} value={p.desc} placeholder="For example sub-board 2, breaker 4" onChange={e => setPoints(points.map((x, n) => n === i ? { ...x, desc: e.target.value } : x))} className={controlClass} style={controlStyle()} /></Field></div>
          <Field label="Lock tag" htmlFor={`pt-tag-${i}`}><input id={`pt-tag-${i}`} value={p.lockTag} onChange={e => setPoints(points.map((x, n) => n === i ? { ...x, lockTag: e.target.value } : x))} className={controlClass} style={controlStyle()} /></Field>
        </div>
      ))}
    </Dialog>
  );
}
