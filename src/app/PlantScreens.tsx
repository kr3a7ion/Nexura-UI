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
  const [time, setTime] = useState(clock(now())); const [note, setNote] = useState("");
  const when = () => {
    const [h, m] = time.split(":").map(Number), d = now(); d.setHours(h, m, 0, 0);
    if (d.getTime() > now().getTime() + 2 * 60000) d.setDate(d.getDate() - 1); // a time later than now is last night's
    return d;
  };
  return <Dialog title={s.title} danger={s.event === "Mains failed" || s.event === "Set faulty"} onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label={`Record ${s.event.toLowerCase()}`} onClick={() => onSave(when(), note)} /></>}>
    <Field label="When it happened" htmlFor="sw-time" hint="Change it if you are entering this late. A time later than now is taken as yesterday."><input id="sw-time" type="time" value={time} onChange={e => setTime(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
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
