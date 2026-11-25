// Maintenance: Safety. Incidents (anyone reports from the top bar; only managers and Maintenance leads read) and utility
// meters. Permits to Work stays its own screen.
import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, WARNING_INK } from "./constants";
import { PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { Card, Field, Dialog, Segmented, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { fmtWhen, now } from "./mock/maintenance";
import { INCIDENT_TYPES, SEVERITIES, METER_KINDS, reportIncident, incidentsIn, canReadIncidents, meters, readingsOf, readMeter, addMeter, type Incident, type Meter } from "./mock/safety";

type Add = (t: Omit<Toast, "id">) => void;
const TABS = ["Incidents", "Meters"] as const;
const td = "px-3 py-2.5 text-sm align-top";
const sev = { Minor: { bg: "#F1F5F9", text: "#334155" }, Moderate: { bg: "#FEF3C7", text: "#92400E" }, Major: { bg: "#FFEDD5", text: "#9A3412" }, Critical: { bg: "#FEE2E2", text: "#991B1B" } };
const text = (id: string, value: string, set: (v: string) => void, numeric = false) =>
  <input id={id} inputMode={numeric ? "decimal" : undefined} value={value} onChange={e => set(numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)} className={controlClass} style={controlStyle()} />;
const localNow = () => { const d = now(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

export function Safety({ add, staffName, role }: { add: Add; staffName: string; role: string }) {
  const [tab, setTab] = useState<typeof TABS[number]>("Incidents");
  const [month, setMonth] = useState(() => { const d = now(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [dialog, setDialog] = useState<null | "incident" | "meter" | { read: Meter }>(null);
  const [, redraw] = useState(0);
  const done = (ok: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return; } add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); };
  const reader = canReadIncidents(staffName, role), list = incidentsIn(month.getFullYear(), month.getMonth());
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return <div>
    <PageHeader title="Safety" sub="Incidents and near misses, and the utility meters. Permits to Work has its own screen."
      actions={<BtnP label="Report an incident" onClick={() => setDialog("incident")} />} />
    <div className="mb-6"><Segmented label="Safety section" options={TABS} value={tab} onChange={setTab} /></div>

    {tab === "Incidents" && (reader ? <Card title={`Incidents in ${month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`} sub="Strictly this month, by when it happened. Injury records are staff data: only managers and Maintenance leads see this list."
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
    </Card>)}

    {tab === "Meters" && <Card title="Utility meters" sub="A reading never goes backwards. A meter that rolled over or was replaced starts the count again. More than three times the recent average is flagged."
      footer={<BtnO label="Add a meter" icon={Plus} onClick={() => setDialog("meter")} />}>
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Meter", "Place", "Last reading", "Used since the one before", ""].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
        <tbody>{meters().map(m => { const [last] = readingsOf(m.id); return <tr key={m.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={td} style={{ color: TEXT }}><b>{m.kind}</b><span className="block" style={{ color: MUTED }}>{m.serial}{m.multiplier !== 1 ? `, ×${m.multiplier}` : ""}</span></td>
          <td className={td} style={{ color: TEXT }}>{m.place}</td>
          <td className={td} style={{ color: TEXT }}>{last ? <>{last.reading}<span className="block" style={{ color: MUTED }}>{fmtWhen(last.at)}, {last.by}{last.estimated ? ", estimated" : ""}</span></> : <span style={{ color: MUTED }}>Never read</span>}</td>
          <td className={td} style={{ color: last?.flagged ? ERROR : last?.reset ? WARNING_INK : TEXT }}>{!last ? "" : last.reset ? `${last.reset}: counting again` : last.consumption == null ? "First reading" : `${last.consumption} ${m.unit}${last.flagged ? ". Over three times the recent average: check for a leak or a misread" : ""}`}</td>
          <td className="px-3 py-2 text-right"><BtnO label={`Read ${m.serial}`} onClick={() => setDialog({ read: m })} /></td>
        </tr>; })}</tbody>
      </table></div>
    </Card>}

    {dialog === "incident" && <IncidentDialog onClose={() => setDialog(null)} onSave={i => done(`Incident reported. ${reader ? "" : "The managers and Maintenance leads have it."}`.trim(), reportIncident(i, staffName))} />}
    {dialog === "meter" && <MeterDialog onClose={() => setDialog(null)} onSave={m => done(`Meter ${m.serial.trim()} added`, addMeter(m))} />}
    {dialog && typeof dialog === "object" && <ReadDialog m={dialog.read} onClose={() => setDialog(null)} onSave={r => {
      const x = readMeter(dialog.read.id, r, staffName);
      if (typeof x !== "string" && x.flagged) { add({ type: "warning", title: "Saved. Over three times the recent average: check for a leak or a misread" }); setDialog(null); redraw(n => n + 1); }
      else done("Reading saved", x);
    }} />}
  </div>;
}

/** Used here and from the top bar, so anyone on any screen can report. */
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

function MeterDialog({ onClose, onSave }: { onClose: () => void; onSave: (m: Omit<Meter, "id">) => void }) {
  const [f, setF] = useState({ kind: "Electricity", serial: "", place: "", multiplier: "1", unit: "kWh" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Dialog title="Add a meter" onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add meter" onClick={() => onSave({ kind: f.kind as Meter["kind"], serial: f.serial, place: f.place, multiplier: Number(f.multiplier), unit: f.unit })} /></>}>
    <div className="grid grid-cols-2 gap-4"><Select id="mt-kind" label="Kind" value={f.kind} onChange={v => setF({ ...f, kind: v, unit: v === "Electricity" ? "kWh" : v === "Water" ? "m³" : "kg" })} options={[...METER_KINDS]} />
      <Field label="Serial" htmlFor="mt-serial">{text("mt-serial", f.serial, set("serial"))}</Field></div>
    <Field label="Where it is" htmlFor="mt-place">{text("mt-place", f.place, set("place"))}</Field>
    <div className="grid grid-cols-2 gap-4"><Field label="Multiplier" htmlFor="mt-mult" hint="The CT ratio on a meter read through current transformers. 1 otherwise.">{text("mt-mult", f.multiplier, set("multiplier"), true)}</Field>
      <Field label="Unit" htmlFor="mt-unit">{text("mt-unit", f.unit, set("unit"))}</Field></div>
  </Dialog>;
}

function ReadDialog({ m, onClose, onSave }: { m: Meter; onClose: () => void; onSave: (r: Parameters<typeof readMeter>[1]) => void }) {
  const [f, setF] = useState({ reading: "", reset: "", estimated: false, note: "" });
  const last = readingsOf(m.id)[0];
  return <Dialog title={`Read ${m.kind.toLowerCase()} meter ${m.serial}`} sub={last ? `Last read ${last.reading} on ${fmtWhen(last.at)}.` : "First reading."} onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save reading" onClick={() => onSave({ reading: f.reading.trim() === "" ? NaN : Number(f.reading), reset: (f.reset || undefined) as "Rolled over" | "Replaced" | undefined, estimated: f.estimated, note: f.note })} /></>}>
    <div className="grid grid-cols-2 gap-4"><Field label="Figure on the meter" htmlFor="rd-reading">{text("rd-reading", f.reading, v => setF({ ...f, reading: v }), true)}</Field>
      <Select id="rd-reset" label="The meter" value={f.reset} onChange={v => setF({ ...f, reset: v })} options={[["", "Counts on as before"], ["Rolled over", "Rolled over to zero"], ["Replaced", "Was replaced"]]} /></div>
    <label className="flex items-center gap-2 text-sm" style={{ color: TEXT }}><input type="checkbox" checked={f.estimated} onChange={e => setF({ ...f, estimated: e.target.checked })} /> Estimated: the meter could not be reached</label>
    <Field label="Note" htmlFor="rd-note">{text("rd-note", f.note, v => setF({ ...f, note: v }))}</Field>
  </Dialog>;
}
