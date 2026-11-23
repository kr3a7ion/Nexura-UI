// Maintenance: Power & Diesel. Mains and sets as they change (PlantScreens), then dips, two-signature deliveries, fuel issued, generator runs and the month's reconciliation.
import React, { useState } from "react";
import { Fuel, Zap, Gauge, AlertTriangle } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, TEAL_INK, WARNING_INK, fmtDate } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { UI, Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { fmtWhen, now } from "./mock/maintenance";
import { tanks, gensets, money } from "./mock/setup";
import { asset } from "./mock/ppm";
import { staffAll } from "./mock/staff";
import {
  dips, deliveries, runs, reconciliations, levelOf, highBurnStreak, logDip, recordDelivery, issueFuel, recordRun, reconcile, saveReconciliation, costPerKwh,
  type RunReason, type Reconciliation,
} from "./mock/power";
import { PlantNow } from "./PlantScreens";

type Add = (t: Omit<Toast, "id">) => void;
type Kind = null | "dip" | "delivery" | "issue" | "run";
const n = (v: string) => (v.trim() === "" ? undefined : Number(v));
const num = (id: string, label: string, value: string, set: (v: string) => void, hint?: string) => (
  <Field label={label} htmlFor={id} hint={hint}><input id={id} inputMode="decimal" value={value} onChange={e => set(e.target.value.replace(/[^\d.]/g, ""))} className={controlClass} style={controlStyle()} /></Field>
);
const L = (v: number) => `${Math.round(v).toLocaleString()} L`;
const th = "px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap";
const td = "px-3 py-2.5 text-sm whitespace-nowrap";

export function PowerDiesel({ add, staffName }: { add: Add; staffName: string }) {
  const [dialog, setDialog] = useState<Kind>(null);
  const [why, setWhy] = useState<Record<string, string>>({});
  const [, redraw] = useState(0);
  const t = now();
  const monthStart = new Date(t.getFullYear(), t.getMonth(), 1);
  const cost = costPerKwh(monthStart, t);
  const sets = gensets();
  const lastRun = runs()[0];
  const flaggedDeliveries = deliveries().filter(d => d.flagged && d.at >= monthStart).length;
  const done = (ok: string) => (refused: string | null) => { if (refused) add({ type: "error", title: refused }); else { add({ type: "success", title: ok }); setDialog(null); redraw(x => x + 1); } };
  const recs = tanks().map(tk => ({ tk, r: reconcile(tk.id, monthStart, t) }));

  return (
    <div>
      <PageHeader title="Power & Diesel" sub="Mains and generators as they change, the generator log and the building load. Then where the diesel came from and where it went. Deliveries are signed by two people, and a month that does not balance is explained in writing."
        actions={<div className="flex flex-wrap gap-2 justify-end">
          <BtnO label="Log a dip" onClick={() => setDialog("dip")} /><BtnO label="Issue fuel" onClick={() => setDialog("issue")} />
          <BtnO label="Log a generator run" onClick={() => setDialog("run")} /><BtnP label="Record a delivery" onClick={() => setDialog("delivery")} />
        </div>} />
      <PlantNow add={add} staffName={staffName} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {tanks().slice(0, 2).map(tk => <StatCard key={tk.id} label={tk.name} value={L(levelOf(tk.id))} sub={`${Math.round(levelOf(tk.id) / tk.capacity * 100)}% of ${tk.capacity.toLocaleString()} L${levelOf(tk.id) < tk.minimum ? ", below minimum" : ""}`} icon={Fuel} accent={levelOf(tk.id) < tk.minimum ? ERROR : TEAL_INK} />)}
        <StatCard label="Diesel cost per kWh" value={cost.perKwh == null ? "No runs yet" : `₦${cost.perKwh}`} sub={`This month, against ₦${cost.grid} from the grid`} icon={Zap} accent={cost.perKwh && cost.perKwh > cost.grid ? WARNING_INK : TEAL_INK} />
        <StatCard label="Generator burn" value={lastRun?.deviationPct == null ? "Not measured" : `${lastRun.deviationPct > 0 ? "+" : ""}${lastRun.deviationPct}%`}
          sub={sets[0] ? `${highBurnStreak(sets[0].assetId)} of 3 high runs in a row. ${flaggedDeliveries} delivery flagged this month.` : ""} icon={Gauge} accent={lastRun?.deviationPct && lastRun.deviationPct > (sets[0]?.highBurnPct ?? 10) ? ERROR : MUTED} />
      </div>

      <div className="mb-7"><Card title="This month's reconciliation" sub={`Opening dip + received − issued should equal the closing dip. Off by more than ${money().fuelTolerancePct}% of what moved, it must be explained before it is saved.`}>
        <div className="overflow-x-auto"><table className="w-full">
          <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Tank", "Opening", "In", "Out", "Should be", "Dipped", "Difference", ""].map(h => <th key={h} className={th} style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{recs.map(({ tk, r }) => typeof r === "string"
            ? <tr key={tk.id} style={{ borderTop: `1px solid ${BORDER}` }}><td className={td} style={{ color: TEXT, fontWeight: 600 }}>{tk.name}</td><td colSpan={7} className={td} style={{ color: MUTED }}>{r}</td></tr>
            : <RecRow key={tk.id} name={tk.name} r={r} why={why[tk.id] ?? ""} setWhy={v => setWhy({ ...why, [tk.id]: v })}
                onSave={() => done(`${tk.name} reconciliation saved`)(saveReconciliation(r, staffName, why[tk.id]))} />)}</tbody>
        </table></div>
        {reconciliations().length > 0 && <div className="mt-4">{reconciliations().map(s => (
          <p key={s.id} className="text-sm py-1" style={{ color: MUTED }}>{s.id}: {tanks().find(x => x.id === s.tankId)?.name}, {fmtDate(s.from)} to {fmtDate(s.to)}, {s.varianceL > 0 ? "+" : ""}{L(s.varianceL)} ({s.variancePct}%), saved by {s.savedBy}{s.explanation ? `. ${s.explanation}` : ""}</p>))}</div>}
      </Card></div>

      <div className="grid xl:grid-cols-2 gap-4">
        <Card title="Deliveries" sub="Received is what the dips say, not what the invoice says.">
          {deliveries().map(d => (
            <div key={d.id} className="py-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="flex justify-between gap-2 text-sm" style={{ color: TEXT }}><b>{d.id}, {d.vendor}</b>{d.flagged ? <Badge label={`${d.varianceL > 0 ? "Over" : "Short"} ${Math.abs(d.varianceL)} L`} colors={{ bg: "#FEE2E2", text: "#991B1B" }} /> : <Badge label="Within tolerance" colors={{ bg: "#DCFCE7", text: "#166534" }} />}</div>
              <div className="text-sm" style={{ color: MUTED }}>{fmtWhen(d.at)}. Invoiced {L(d.invoicedL)}, received {L(d.receivedL)} ({d.variancePct}%). Received by {d.receivedBy}, witnessed by {d.witnessedBy}. Waybill {d.waybill}.</div>
            </div>))}
        </Card>
        <Card title="Generator runs" sub="Three runs in a row burning more than expected raise a job before the set fails in a power cut.">
          {runs().map(r => (
            <div key={r.id} className="py-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="flex justify-between gap-2 text-sm" style={{ color: TEXT }}><b>{asset(r.assetId)?.name}, {r.runHours} h</b>
                {r.deviationPct != null && <span style={{ color: r.deviationPct > (sets.find(g => g.assetId === r.assetId)?.highBurnPct ?? 10) ? ERROR : MUTED }}>{r.actualLph} L/h, expected {r.expectedLph} ({r.deviationPct > 0 ? "+" : ""}{r.deviationPct}%)</span>}</div>
              <div className="text-sm" style={{ color: MUTED }}>{fmtWhen(r.at)}, {r.reason.toLowerCase()}. Meter {r.hoursStart.toLocaleString()} to {r.hoursEnd.toLocaleString()} h{r.kwh ? `, ${r.kwh.toLocaleString()} kWh` : ""}. {r.by}.{r.raisedJob ? ` Raised ${r.raisedJob}.` : ""}</div>
            </div>))}
        </Card>
        <Card title="Recent dips">
          {dips().slice().reverse().slice(0, 6).map(d => <div key={d.id} className="flex justify-between py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}>
            <span>{tanks().find(x => x.id === d.tankId)?.name}{d.mm != null ? `, ${d.mm} mm` : ""}</span><span style={{ color: MUTED }}>{L(d.litres)}, {fmtWhen(d.at)}, {d.by}</span></div>)}
        </Card>
      </div>

      {dialog === "dip" && <DipDialog onClose={() => setDialog(null)} onSave={(id, v, unit) => {
        const r = logDip(id, unit === "mm" ? { mm: n(v) } : { litres: n(v) }, staffName);
        if (typeof r === "string") add({ type: "error", title: r }); else done(`Dip saved: ${L(r.litres)}${r.belowMinimum ? ", below minimum" : ""}`)(null);
      }} />}
      {dialog === "delivery" && <DeliveryDialog me={staffName} onClose={() => setDialog(null)} onSave={d => { const r = recordDelivery(d, staffName); done(typeof r === "string" ? "" : `${r.id} saved: received ${L(r.receivedL)}${r.flagged ? `, ${r.variancePct}% off the invoice` : ""}`)(typeof r === "string" ? r : null); }} />}
      {dialog === "issue" && <IssueDialog onClose={() => setDialog(null)} onSave={i => { const r = issueFuel(i, staffName); done(`${L(i.litres)} issued`)(typeof r === "string" ? r : null); }} />}
      {dialog === "run" && <RunDialog onClose={() => setDialog(null)} onSave={x => { const r = recordRun(x, staffName); done(typeof r === "string" ? "" : `Run saved${r.deviationPct != null ? `: ${r.actualLph} L/h, ${r.deviationPct > 0 ? "+" : ""}${r.deviationPct}%` : ""}${r.raisedJob ? `. ${r.raisedJob} raised` : ""}`)(typeof r === "string" ? r : null); }} />}
    </div>
  );
}

function RecRow({ name, r, why, setWhy, onSave }: { name: string; r: Reconciliation; why: string; setWhy: (v: string) => void; onSave: () => void }) {
  return <>
    <tr style={{ borderTop: `1px solid ${BORDER}` }}>
      <td className={td} style={{ color: TEXT, fontWeight: 600 }}>{name}</td><td className={td}>{L(r.openingL)}</td><td className={td}>{L(r.deliveriesL)}</td><td className={td}>{L(r.issuesL)}</td>
      <td className={td}>{L(r.computedL)}</td><td className={td}>{L(r.dippedL)}</td>
      <td className={td} style={{ color: r.flagged ? ERROR : TEXT, fontWeight: r.flagged ? 600 : 400 }}>{r.varianceL > 0 ? "+" : ""}{L(r.varianceL)} ({r.variancePct}%)</td>
      <td className={`${td} text-right`}><BtnO label={`Save ${name} reconciliation`} onClick={onSave} /></td>
    </tr>
    {r.flagged && <tr><td colSpan={8} className="px-3 pb-3">
      <Field label={`Where did ${L(Math.abs(r.varianceL))} go?`} htmlFor={`rc-${r.tankId}`} hint="A leak, an issue nobody wrote down, a wrong dip, theft. Saved with the month and sent to the managers.">
        <input id={`rc-${r.tankId}`} value={why} onChange={e => setWhy(e.target.value)} className={controlClass} style={controlStyle()} />
      </Field>
    </td></tr>}
  </>;
}

function DipDialog({ onClose, onSave }: { onClose: () => void; onSave: (tankId: string, v: string, unit: "mm" | "L") => void }) {
  const [tk, setTk] = useState(tanks()[0].id); const [v, setV] = useState(""); const [unit, setUnit] = useState<"mm" | "L">(tanks()[0].chart ? "mm" : "L");
  const hasChart = !!tanks().find(x => x.id === tk)?.chart;
  return <Dialog title="Log a dip" onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save dip" onClick={() => onSave(tk, v, hasChart ? unit : "L")} /></>}>
    <Select id="dp-tank" label="Tank" value={tk} onChange={x => { setTk(x); setUnit(tanks().find(t => t.id === x)?.chart ? "mm" : "L"); }} options={tanks().map(t => [t.id, t.name] as [string, string])} />
    {hasChart && <Select id="dp-unit" label="Reading in" value={unit} onChange={x => setUnit(x as "mm" | "L")} options={[["mm", "Millimetres on the dip stick"], ["L", "Litres"]]} />}
    {num("dp-value", hasChart && unit === "mm" ? "Dip (mm)" : "Level (litres)", v, setV, hasChart && unit === "mm" ? "Turned into litres through the tank's chart." : undefined)}
  </Dialog>;
}

function DeliveryDialog({ me, onClose, onSave }: { me: string; onClose: () => void; onSave: (d: { tankId: string; vendor: string; waybill: string; invoicedL: number; dipBeforeL: number; dipAfterL: number; unitPrice: number; witnessedBy: string }) => void }) {
  const witnesses = staffAll().filter(s => s.status !== "Left" && s.name !== me).map(s => s.name);
  const [f, setF] = useState({ tankId: tanks()[0].id, vendor: "", waybill: "", invoicedL: "", dipBeforeL: String(Math.round(levelOf(tanks()[0].id))), dipAfterL: "", unitPrice: "", witnessedBy: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Dialog title="Record a delivery" sub="Dip before and after the discharge. The person receiving it cannot also witness it." wide onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save delivery" onClick={() => onSave({ tankId: f.tankId, vendor: f.vendor.trim(), waybill: f.waybill.trim(), invoicedL: Number(f.invoicedL), dipBeforeL: Number(f.dipBeforeL), dipAfterL: Number(f.dipAfterL), unitPrice: Number(f.unitPrice) || 0, witnessedBy: f.witnessedBy })} /></>}>
    <div className="grid grid-cols-2 gap-4">
      <Select id="fd-tank" label="Into tank" value={f.tankId} onChange={v => setF({ ...f, tankId: v, dipBeforeL: String(Math.round(levelOf(v))) })} options={tanks().map(t => [t.id, t.name] as [string, string])} />
      <Select id="fd-witness" label="Witnessed by" value={f.witnessedBy} onChange={set("witnessedBy")} options={[["", "Choose a second person"], ...witnesses.map(w => [w, w] as [string, string])]} />
      <Field label="Supplier" htmlFor="fd-vendor"><input id="fd-vendor" value={f.vendor} onChange={e => set("vendor")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
      <Field label="Waybill number" htmlFor="fd-waybill"><input id="fd-waybill" value={f.waybill} onChange={e => set("waybill")(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {num("fd-inv", "Invoiced (L)", f.invoicedL, set("invoicedL"))}{num("fd-before", "Dip before (L)", f.dipBeforeL, set("dipBeforeL"))}
      {num("fd-after", "Dip after (L)", f.dipAfterL, set("dipAfterL"))}{num("fd-price", "Price per litre (₦)", f.unitPrice, set("unitPrice"))}
    </div>
  </Dialog>;
}

function IssueDialog({ onClose, onSave }: { onClose: () => void; onSave: (i: { tankId: string; litres: number; toAssetId?: string; toTankId?: string }) => void }) {
  const [from, setFrom] = useState(tanks()[0].id); const [to, setTo] = useState(""); const [l, setL] = useState("");
  const targets: [string, string][] = [["", "Choose where it went"], ...tanks().filter(t => t.id !== from).map(t => [`tank:${t.id}`, t.name] as [string, string]), ...gensets().map(g => [`set:${g.assetId}`, asset(g.assetId)?.name ?? g.assetId] as [string, string])];
  return <Dialog title="Issue fuel" sub="Fuel pumped out of a tank into a generator or another tank." onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save issue" onClick={() => onSave({ tankId: from, litres: Number(l), toTankId: to.startsWith("tank:") ? to.slice(5) : undefined, toAssetId: to.startsWith("set:") ? to.slice(4) : undefined })} /></>}>
    <Select id="fi-from" label="From tank" value={from} onChange={setFrom} options={tanks().map(t => [t.id, `${t.name} (${L(levelOf(t.id))})`] as [string, string])} />
    <Select id="fi-to" label="Into" value={to} onChange={setTo} options={targets} />
    {num("fi-litres", "Litres", l, setL)}
  </Dialog>;
}

function RunDialog({ onClose, onSave }: { onClose: () => void; onSave: (r: { assetId: string; reason: RunReason; hoursStart: number; hoursEnd: number; avgLoadKw?: number; fuelStartL?: number; fuelEndL?: number; topupL?: number; kwh?: number }) => void }) {
  const first = gensets()[0]?.assetId ?? "";
  const meter = (id: string) => String(asset(id)?.meter?.value ?? "");
  const [f, setF] = useState({ assetId: first, reason: "Power cut", hoursStart: meter(first), hoursEnd: "", load: "", fuelStart: "", fuelEnd: "", topup: "", kwh: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Dialog title="Log a generator run" sub="The hour meter at the end becomes the set's meter, so its planned service comes due by itself." wide onClose={onClose}
    footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save run" onClick={() => onSave({ assetId: f.assetId, reason: f.reason as RunReason, hoursStart: Number(f.hoursStart), hoursEnd: Number(f.hoursEnd),
      avgLoadKw: n(f.load), fuelStartL: n(f.fuelStart), fuelEndL: n(f.fuelEnd), topupL: n(f.topup), kwh: n(f.kwh) })} /></>}>
    <div className="grid grid-cols-2 gap-4">
      <Select id="gr-set" label="Generator" value={f.assetId} onChange={v => setF({ ...f, assetId: v, hoursStart: meter(v) })} options={gensets().map(g => [g.assetId, asset(g.assetId)?.name ?? g.assetId] as [string, string])} />
      <Select id="gr-reason" label="Why it ran" value={f.reason} onChange={set("reason")} options={["Power cut", "Weekly test", "Load test", "Maintenance"]} />
    </div>
    <div className="grid grid-cols-3 gap-4">{num("gr-h0", "Hour meter at start", f.hoursStart, set("hoursStart"))}{num("gr-h1", "Hour meter at end", f.hoursEnd, set("hoursEnd"))}{num("gr-load", "Average load (kW)", f.load, set("load"), "From the panel or a clamp reading.")}</div>
    <div className="grid grid-cols-4 gap-4">{num("gr-f0", "Day tank at start (L)", f.fuelStart, set("fuelStart"))}{num("gr-f1", "Day tank at end (L)", f.fuelEnd, set("fuelEnd"))}{num("gr-top", "Topped up (L)", f.topup, set("topup"))}{num("gr-kwh", "kWh generated", f.kwh, set("kwh"))}</div>
  </Dialog>;
}
