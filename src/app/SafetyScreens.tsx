// Maintenance: Safety. Incidents: anyone reports (here, or from the account menu on any screen); only managers and
// Maintenance leads read. Permits to Work stays its own screen; utility meters are on Power & Diesel.
import React, { useState } from "react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED } from "./constants";
import { PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { fmtWhen, now } from "./mock/maintenance";
import { INCIDENT_TYPES, SEVERITIES, reportIncident, incidentsIn, canReadIncidents, type Incident } from "./mock/safety";

type Add = (t: Omit<Toast, "id">) => void;
const td = "px-3 py-2.5 text-sm align-top";
const sev = { Minor: { bg: "#F1F5F9", text: "#334155" }, Moderate: { bg: "#FEF3C7", text: "#92400E" }, Major: { bg: "#FFEDD5", text: "#9A3412" }, Critical: { bg: "#FEE2E2", text: "#991B1B" } };
const text = (id: string, value: string, set: (v: string) => void, numeric = false) =>
  <input id={id} inputMode={numeric ? "decimal" : undefined} value={value} onChange={e => set(numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)} className={controlClass} style={controlStyle()} />;
const localNow = () => { const d = now(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

export function Safety({ add, staffName, role }: { add: Add; staffName: string; role: string }) {
  const [month, setMonth] = useState(() => { const d = now(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [dialog, setDialog] = useState<null | "incident">(null);
  const [, redraw] = useState(0);
  const done = (ok: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return; } add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); };
  const reader = canReadIncidents(staffName, role), list = incidentsIn(month.getFullYear(), month.getMonth());
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return <div>
    <PageHeader title="Safety" sub="Incidents and near misses. Permits to Work has its own screen; utility meters are on Power & Diesel."
      actions={<BtnP label="Report an incident" onClick={() => setDialog("incident")} />} />
    {reader ? <Card title={`Incidents in ${month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`} sub="Strictly this month, by when it happened. Injury records are staff data: only managers and Maintenance leads see this list."
      footer={<div className="flex gap-2"><BtnO label="Previous month" onClick={() => shift(-1)} /><BtnO label="Next month" onClick={() => shift(1)} /></div>}>
      {list.length ? <div className="overflow-x-auto"><table className="w-full">
        <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["When", "What", "Severity", "What happened", "Done at once", "Reported by"].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
        <tbody>{list.map((i: Incident) => <tr key={i.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={`${td} whitespace-nowrap`} style={{ color: TEXT }}>{fmtWhen(i.occurredAt)}</td>
          <td className={td} style={{ color: TEXT }}><b>{i.type}</b>{i.place && <span className="block" style={{ color: MUTED }}>{i.place}</span>}</td>
          <td className={td}><Badge label={i.severity} colors={sev[i.severity]} /></td>
          <td className={td} style={{ color: TEXT, maxWidth: 360 }}>{i.description}</td>
          <td className={td} style={{ color: i.immediateAction ? TEXT : MUTED, maxWidth: 260 }}>{i.immediateAction ?? "Nothing recorded"}</td>
          <td className={`${td} whitespace-nowrap`} style={{ color: MUTED }}>{i.reportedBy}<span className="block">{i.id}</span></td>
        </tr>)}</tbody>
      </table></div> : <p className="text-sm" style={{ color: MUTED }}>No incidents this month.</p>}
    </Card> : <Card title="Incident records" sub="Read by managers and Maintenance leads only, because they hold staff injury details.">
      <p className="text-sm" style={{ color: TEXT }}>You can report an incident or a near miss from here or from the top bar on any screen. A near miss reported today is the injury that does not happen next month.</p>
    </Card>}

    {dialog === "incident" && <IncidentDialog onClose={() => setDialog(null)} onSave={i => done(`Incident reported. ${reader ? "" : "The managers and Maintenance leads have it."}`.trim(), reportIncident(i, staffName))} />}
  </div>;
}

/** Used here and from the account menu, so anyone on any screen can report. */
export function IncidentDialog({ onClose, onSave }: { onClose: () => void; onSave: (i: Parameters<typeof reportIncident>[0]) => void }) {
  const [f, setF] = useState({ when: localNow(), type: "Near miss", place: "", description: "", severity: "Minor", action: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Dialog title="Report an incident" sub="An injury, a near miss, damage, a fire or a spill. Only managers and Maintenance leads read incident records." wide onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Report incident" onClick={() => onSave({ occurredAt: new Date(f.when), type: f.type as Incident["type"], place: f.place, description: f.description, severity: f.severity as Incident["severity"], immediateAction: f.action })} /></>}>
    <div className="grid sm:grid-cols-3 gap-4">
      <Select id="inc-type" label="What" value={f.type} onChange={set("type")} options={[...INCIDENT_TYPES]} />
      <Select id="inc-severity" label="How serious" value={f.severity} onChange={set("severity")} options={[...SEVERITIES]} />
      <Field label="When it happened" htmlFor="inc-when"><input id="inc-when" type="datetime-local" value={f.when} onChange={e => set("when")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </div>
    <Field label="Where" htmlFor="inc-place">{text("inc-place", f.place, set("place"))}</Field>
    <Field label="What happened" htmlFor="inc-desc" required><textarea id="inc-desc" rows={3} value={f.description} onChange={e => set("description")(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none rounded-xl border" style={{ borderColor: BORDER, color: TEXT }} /></Field>
    <Field label="What was done at once" htmlFor="inc-action" hint="First aid, the area closed off, the spill cleaned.">{text("inc-action", f.action, set("action"))}</Field>
  </Dialog>;
}
