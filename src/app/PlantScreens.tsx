// Power as it happens, on Power & Diesel: mains and sets changing over, the generator log for this shift, and the
// building load from clamp readings. PowerStrip is the one line on every screen that says whether mains is on.
import React, { useState } from "react";
import { Lightning } from "@phosphor-icons/react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, SUCCESS, WARNING_INK, TEAL_INK } from "./constants";
import { BtnP, BtnO, Badge } from "./UIKit";
import { Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { fmtWhen, now } from "./mock/maintenance";
import { supplies } from "./mock/setup";
import { asset } from "./mock/ppm";
import { plantNow, recordSwitch, switchLog, span, type SwitchEvent } from "./mock/changeover";
import { gensetLog, logGenset, shiftLogStatus, type Reading } from "./mock/gensetLog";
import { loadNow, recordClamp, FRESH_MINUTES } from "./mock/load";
import { METER_KINDS, meters, readingsOf, readMeter, addMeter, type Meter } from "./mock/meters";
import { Plus } from "lucide-react";

type Add = (t: Omit<Toast, "id">) => void;
const clock = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const mins = (d: Date) => Math.max(0, Math.round((now().getTime() - d.getTime()) / 60000));
const n = (v: string) => (v.trim() === "" ? undefined : Number(v));
const num = (id: string, label: string, value: string, set: (v: string) => void, hint?: string) => (
  <Field label={label} htmlFor={id} hint={hint}><input id={id} inputMode="decimal" value={value} onChange={e => set(e.target.value.replace(/[^\d.]/g, ""))} className={controlClass} style={controlStyle()} /></Field>
);
const tone = { OK: { bg: "#DCFCE7", text: "#166534" }, Watch: { bg: "#FEF3C7", text: "#92400E" }, Act: { bg: "#FEE2E2", text: "#991B1B" } };

/** One line under the header on every screen: mains, and any set running. Red while the building is off mains. */
export function PowerStrip({ onOpen }: { onOpen: () => void }) {
  const p = plantNow(), running = p.sets.filter(s => s.runningSince), off = p.mains === "off";
  const text = `${off ? `Mains off since ${clock(p.offSince!)} (${span(mins(p.offSince!))})` : "Mains on"}. ${running.length ? running.map(s => `${s.name} running ${span(mins(s.runningSince!))}`).join(", ") : off ? "No generator running" : "Generators stopped"}.`;
  return <button onClick={onOpen} className="mb-5 flex w-full items-center gap-2 rounded-xl border px-4 py-2 text-left text-sm font-medium"
    style={{ backgroundColor: off ? "#FEF2F2" : "white", borderColor: off ? "#FECACA" : BORDER, color: off ? "#991B1B" : MUTED }}>
    <Lightning size={15} weight="fill" style={{ color: off ? ERROR : SUCCESS }} /><span className="truncate">{text}</span><span className="ml-auto whitespace-nowrap text-xs" style={{ color: off ? "#991B1B" : TEAL_INK }}>Open Power & Diesel</span>
  </button>;
}

type Switching = { event: SwitchEvent; assetId?: string; title: string };
export function PlantNow({ add, staffName }: { add: Add; staffName: string }) {
  const [sw, setSw] = useState<Switching | null>(null);
  const [logFor, setLogFor] = useState<string | null>(null);
  const [clamping, setClamping] = useState(false);
  const [, redraw] = useState(0);
  const p = plantNow(), shift = shiftLogStatus(), load = loadNow();
  const ok = (title: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return false; } add({ type: "success", title }); redraw(x => x + 1); return true; };

  return <div className="mb-7 grid xl:grid-cols-3 gap-4">
    <Card title="Mains and generators" sub="Record it as it happens. A mains failure is urgent for the whole team.">
      <div className="flex items-center justify-between gap-2 py-2.5 text-sm" style={{ color: TEXT }}>
        <b>Mains {p.mains === "off" ? `off since ${clock(p.offSince!)}` : "on"}</b>
        {p.mains === "on" ? <BtnP label="Mains failed" color={ERROR} onClick={() => setSw({ event: "Mains failed", title: "Mains failed" })} /> : <BtnP label="Mains restored" onClick={() => setSw({ event: "Mains restored", title: "Mains restored" })} />}
      </div>
      {p.sets.map(s => <div key={s.assetId} className="py-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="text-sm" style={{ color: TEXT }}><b>{s.name}</b></div>
        <div className="mb-2 text-sm" style={{ color: s.status === "Offline" ? ERROR : MUTED }}>{s.status === "Offline" ? "Offline: put it back in service on the asset register" : s.runningSince ? `Running since ${clock(s.runningSince)}` : "Stopped"}</div>
        <div className="flex flex-wrap gap-2">
          {s.runningSince ? <BtnO label="Stop set" onClick={() => setSw({ event: "Set stopped", assetId: s.assetId, title: `Stop ${s.name}` })} />
            : s.status !== "Offline" && <BtnO label="Start set" onClick={() => setSw({ event: "Set started", assetId: s.assetId, title: `Start ${s.name}` })} />}
          {s.status !== "Offline" && <BtnO label="Report a fault" onClick={() => setSw({ event: "Set faulty", assetId: s.assetId, title: `${s.name} is faulty` })} />}
        </div>
      </div>)}
      {switchLog().slice(0, 4).map(l => <p key={l.id} className="py-1 text-sm" style={{ color: MUTED }}>{fmtWhen(l.at)}: {l.event.toLowerCase()}{l.assetId ? `, ${asset(l.assetId)?.name}` : ""}{l.ranMinutes != null ? ` after ${span(l.ranMinutes)}` : ""}. {l.by}.</p>)}
    </Card>

    <Card title={`Generator log, ${shift.shift.toLowerCase()} shift`} sub="Readings on each set every shift, checked against its limits. Leave a box blank if it could not be read safely.">
      {shift.sets.map(s => <div key={s.assetId} className="py-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between gap-2 text-sm" style={{ color: TEXT }}><b>{s.name}</b>
          {s.entries ? <Badge label={s.worst === "OK" ? "In range" : s.worst === "Watch" ? "Watch" : "Out of range"} colors={tone[s.worst]} /> : <Badge label="Not logged" colors={tone.Watch} />}</div>
        <div className="mb-2 text-sm" style={{ color: MUTED }}>{s.entries ? `${s.entries} entr${s.entries === 1 ? "y" : "ies"} this shift, last at ${clock(s.lastAt!)}` : "Nobody has logged this set this shift."}</div>
        <BtnO label="Log readings" onClick={() => setLogFor(s.assetId)} />
      </div>)}
      {gensetLog().slice(0, 3).map(e => <div key={e.id} className="py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
        {fmtWhen(e.at)}, {e.state.toLowerCase()}, {e.by}.{e.findings.map(f => <span key={f.field} className="block" style={{ color: f.severity === "Act" ? ERROR : WARNING_INK }}>{f.says}</span>)}
      </div>)}
    </Card>

    <Card title="Building load" sub={`From the latest clamp reading on each incomer. Feeders are never added, and a reading over ${FRESH_MINUTES / 60} hours old is history.`}>
      <div className="py-2.5 text-sm" style={{ color: TEXT }}><b>{load.totalKw == null ? "No current reading" : `${load.totalKw} kW (${load.totalKva} kVA)`}</b></div>
      <p className="mb-2 text-sm" style={{ color: load.recommended ? TEXT : MUTED }}>{load.advice}</p>
      {load.sources.map(s => <div key={s.id} className="py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="flex justify-between gap-2" style={{ color: TEXT }}><span>{s.name}</span><span>{s.reading ? `${s.reading.kw} kW${s.reading.imbalancePct != null ? `, ${s.reading.imbalancePct}% imbalance` : ""}` : ""}</span></div>
        <div style={{ color: s.flag === "Act" ? ERROR : s.flag === "Watch" ? WARNING_INK : MUTED }}>{s.why}{s.reading ? `. ${s.reading.amps.join(" / ")} A, ${fmtWhen(s.reading.at)}` : ""}{s.breakerPct != null && s.breakerPct > 80 ? `. ${s.breakerPct}% of its breaker` : ""}.</div>
      </div>)}
      <div className="mt-3"><BtnO label="Take a clamp reading" onClick={() => setClamping(true)} /></div>
    </Card>

    {sw && <SwitchDialog s={sw} onClose={() => setSw(null)} onSave={(when, note) => {
      if (ok(`Recorded: ${sw.event.toLowerCase()} at ${clock(when)}`, recordSwitch(sw.event, { assetId: sw.assetId, at: when, note }, staffName))) setSw(null);
    }} />}
    {logFor && <LogDialog assetId={logFor} onClose={() => setLogFor(null)} onSave={r => {
      const e = logGenset(logFor, r, staffName);
      if (ok(typeof e === "string" ? "" : e.findings.length ? `Saved. ${e.findings.length} reading${e.findings.length === 1 ? "" : "s"} to look at` : "Saved. Every reading in range", e)) setLogFor(null);
    }} />}
    {clamping && <ClampDialog onClose={() => setClamping(false)} onSave={(id, x) => {
      const c = recordClamp(id, x, staffName);
      if (ok(typeof c === "string" ? "" : `Saved: ${c.kw} kW${c.imbalancePct != null ? `, ${c.imbalancePct}% imbalance` : ""}`, c)) setClamping(false);
    }} />}
  </div>;
}

function SwitchDialog({ s, onClose, onSave }: { s: Switching; onClose: () => void; onSave: (when: Date, note: string) => void }) {
  const [time, setTime] = useState(clock(now())); const [day, setDay] = useState("Today"); const [note, setNote] = useState("");
  const when = () => {
    const [h, m] = time.split(":").map(Number), d = now(); d.setHours(h, m, 0, 0);
    if (day === "Yesterday") d.setDate(d.getDate() - 1); // said, never guessed: a later time today is refused as the future
    return d;
  };
  return <Dialog title={s.title} danger={s.event === "Mains failed" || s.event === "Set faulty"} onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label={`Record ${s.event.toLowerCase()}`} onClick={() => onSave(when(), note)} /></>}>
    <div className="grid grid-cols-2 gap-4">
      <Select id="sw-day" label="Day" value={day} onChange={setDay} options={[["Today", "Today"], ["Yesterday", "Yesterday"]]} />
      <Field label="Time it happened" htmlFor="sw-time" hint="Change it if you are entering this late."><input id="sw-time" type="time" value={time} onChange={e => setTime(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </div>
    <Field label={s.event === "Set faulty" ? "What is wrong" : "Note"} htmlFor="sw-note"><input id="sw-note" value={note} onChange={e => setNote(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
  </Dialog>;
}

function LogDialog({ assetId, onClose, onSave }: { assetId: string; onClose: () => void; onSave: (r: Reading) => void }) {
  const [f, setF] = useState({ state: plantNow().sets.find(s => s.assetId === assetId)?.runningSince ? "Running" : "Stopped", hours: "", tank: "", coolant: "", oil: "", battery: "", v1: "", v2: "", v3: "", hz: "", kw: "", remarks: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const running = f.state === "Running";
  return <Dialog title={`Log ${asset(assetId)?.name}`} sub="Leave a box blank if you could not read it safely. Only what you enter is checked." wide onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save readings" onClick={() => onSave({ state: f.state as Reading["state"], hoursMeter: n(f.hours), dayTankL: n(f.tank), coolantC: n(f.coolant), oilBar: n(f.oil), batteryV: n(f.battery),
      volts: [n(f.v1), n(f.v2), n(f.v3)], hz: n(f.hz), loadKw: n(f.kw), remarks: f.remarks })} /></>}>
    <div className="grid grid-cols-3 gap-4">
      <Select id="gl-state" label="The set is" value={f.state} onChange={set("state")} options={[["Running", "Running"], ["Stopped", "Stopped (walk-round)"]]} />
      {num("gl-hours", "Hour meter", f.hours, set("hours"))}{num("gl-tank", "Day tank (L)", f.tank, set("tank"))}
    </div>
    <div className="grid grid-cols-3 gap-4">{running && num("gl-coolant", "Coolant (°C)", f.coolant, set("coolant"))}{running && num("gl-oil", "Oil pressure (bar)", f.oil, set("oil"))}{num("gl-battery", "Battery (V)", f.battery, set("battery"))}</div>
    {running && <div className="grid grid-cols-5 gap-4">{num("gl-v1", "Volts L1", f.v1, set("v1"))}{num("gl-v2", "Volts L2", f.v2, set("v2"))}{num("gl-v3", "Volts L3", f.v3, set("v3"))}{num("gl-hz", "Frequency (Hz)", f.hz, set("hz"))}{num("gl-kw", "Load (kW)", f.kw, set("kw"))}</div>}
    <Field label="What you noticed" htmlFor="gl-remarks" hint="Knocking, black smoke, a smell of coolant. What no gauge shows."><input id="gl-remarks" value={f.remarks} onChange={e => set("remarks")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
  </Dialog>;
}

function ClampDialog({ onClose, onSave }: { onClose: () => void; onSave: (supplyId: string, x: { l1: number; l2?: number; l3?: number; volts?: number; pf?: number; note?: string }) => void }) {
  const [f, setF] = useState({ supply: supplies()[0].id, l1: "", l2: "", l3: "", volts: "", pf: "", note: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const s = supplies().find(x => x.id === f.supply)!;
  return <Dialog title="Take a clamp reading" sub="Amps on each phase. The load is worked out as √3 × volts × amps × power factor." wide onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save reading" onClick={() => onSave(f.supply, { l1: Number(f.l1 || NaN), l2: n(f.l2), l3: n(f.l3), volts: n(f.volts), pf: n(f.pf), note: f.note })} /></>}>
    <Select id="cr-supply" label="Supply" value={f.supply} onChange={set("supply")} options={supplies().map(x => [x.id, `${x.name} (${x.kind.toLowerCase()})`] as [string, string])} />
    <div className="grid grid-cols-3 gap-4">{num("cr-l1", s.phases === 3 ? "L1 (A)" : "Amps", f.l1, set("l1"))}{s.phases === 3 && num("cr-l2", "L2 (A)", f.l2, set("l2"))}{s.phases === 3 && num("cr-l3", "L3 (A)", f.l3, set("l3"))}</div>
    <div className="grid grid-cols-2 gap-4">{num("cr-volts", "Volts", f.volts, set("volts"), `Blank uses ${s.volts} V from setup.`)}{num("cr-pf", "Power factor", f.pf, set("pf"), `Blank uses ${s.pf}.`)}</div>
  </Dialog>;
}

/** Electricity, water and gas meters: what the building used, read by hand. */
export function UtilityMeters({ add, staffName }: { add: Add; staffName: string }) {
  const [dialog, setDialog] = useState<null | "meter" | { read: Meter }>(null);
  const [, redraw] = useState(0);
  const td = "px-3 py-2.5 text-sm align-top";
  const done = (ok: string, r: unknown) => { if (typeof r === "string") { add({ type: "error", title: r }); return; } add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); };
  return <><Card title="Utility meters" sub="A reading never goes backwards. A meter that rolled over or was replaced starts the count again. More than three times the recent average is flagged."
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
    </Card>
    {dialog === "meter" && <MeterDialog onClose={() => setDialog(null)} onSave={m => done(`Meter ${m.serial.trim()} added`, addMeter(m))} />}
    {dialog && typeof dialog === "object" && <ReadDialog m={dialog.read} onClose={() => setDialog(null)} onSave={r => {
      const x = readMeter(dialog.read.id, r, staffName);
      if (typeof x !== "string" && x.flagged) { add({ type: "warning", title: "Saved. Over three times the recent average: check for a leak or a misread" }); setDialog(null); redraw(n => n + 1); }
      else done("Reading saved", x);
    }} />}
  </>;
}

const text = (id: string, value: string, set: (v: string) => void, numeric = false) =>
  <input id={id} inputMode={numeric ? "decimal" : undefined} value={value} onChange={e => set(numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)} className={controlClass} style={controlStyle()} />;

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
