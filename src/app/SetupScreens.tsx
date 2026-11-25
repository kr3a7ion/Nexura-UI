// Maintenance setup and configuration (FacilityFlow's admin: People, Shifts, Settings, Supplies). Demo values.
import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED } from "./constants";
import { PageHeader, BtnP, BtnO } from "./UIKit";
import { Card, Field, Row, Dialog, Segmented, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import { PRIORITIES, HOLD_REASONS, WO_CATEGORIES, setTarget, addTrade, addHoldReason, removeHoldReason, slaRules, saveRule, removeRule, workOrders, GUEST_ROOMS, type WOPriority, type SlaRule } from "./mock/maintenance";
import { staffList, teams, teamMembers, patterns, setPerson, addTeam, addPattern, ROLES, type StaffRole } from "./mock/roster";
import { money, setMoney, gensets, saveGenset, tanks, addTank, parseChart, supplies, addSupply, isIncomer, type GensetProfile, type TankKind, type SupplyKind } from "./mock/setup";
import { asset, assets } from "./mock/ppm";

type Add = (t: Omit<Toast, "id">) => void;
const TABS = ["People and teams", "Shifts", "Targets", "Power and diesel", "Money"] as const;
type Tab = typeof TABS[number];
const input = (id: string, value: string, set: (v: string) => void, numeric = false) =>
  <input id={id} inputMode={numeric ? "decimal" : undefined} value={value} onChange={e => set(numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)} className={controlClass} style={controlStyle()} />;
const Table = ({ heads, children }: { heads: string[]; children: React.ReactNode }) => (
  <div className="overflow-x-auto"><table className="w-full">
    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{heads.map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
    <tbody>{children}</tbody>
  </table></div>
);
const td = "px-3 py-2.5 text-sm whitespace-nowrap";

export function MaintenanceSetup({ add, staffName }: { add: Add; staffName: string }) {
  const [tab, setTab] = useState<Tab>("People and teams");
  const [dialog, setDialog] = useState<null | { kind: "person"; name: string } | { kind: "team" | "shift" | "tank" | "supply" } | { kind: "genset"; assetId: string } | { kind: "rule"; rule?: SlaRule }>(null);
  const [, redraw] = useState(0);
  const result = (ok: string) => (refused: string | null) => {
    if (refused) { add({ type: "error", title: refused }); return false; }
    add({ type: "success", title: ok }); setDialog(null); redraw(n => n + 1); return true;
  };
  return (
    <div>
      <PageHeader title="Maintenance Setup" sub="The people, shifts, targets and plant the department runs on. Changes shape future work; a job keeps the deadlines it was raised with." />
      <div className="mb-6"><Segmented label="Setup section" options={TABS} value={tab} onChange={setTab} /></div>

      {tab === "People and teams" && <div className="space-y-4">
        <Card title="People" sub="Their records come from HR. Here Maintenance sets each person's trade, team and role, which decide what they can be given and who a late job goes to.">
          <Table heads={["Name", "Trade", "Team", "Role", ""]}>
            {staffList().map(s => <tr key={s.name} style={{ borderTop: `1px solid ${BORDER}` }}>
              <td className={td} style={{ color: TEXT, fontWeight: 600 }}>{s.name}</td><td className={td} style={{ color: TEXT }}>{s.trade}</td>
              <td className={td} style={{ color: MUTED }}>{s.team ?? "No team"}</td><td className={td} style={{ color: TEXT }}>{s.role}</td>
              <td className={`${td} text-right`}><BtnO label={`Edit ${s.name}`} onClick={() => setDialog({ kind: "person", name: s.name })} /></td>
            </tr>)}
          </Table>
        </Card>
        <Card title="Teams" sub="A job can go to a team. Late jobs go to its lead, then its supervisor." footer={<BtnO label="Add a team" icon={Plus} onClick={() => setDialog({ kind: "team" })} />}>
          {teams().map(t => <Row key={t.name} label={t.name} value={`Lead ${t.lead}, supervisor ${t.supervisor}. ${teamMembers(t.name).length} people.`} />)}
        </Card>
      </div>}

      {tab === "Shifts" && <Card title="Shift patterns" sub="Used to plan the roster. Any number, any names and times." footer={<BtnO label="Add a shift" icon={Plus} onClick={() => setDialog({ kind: "shift" })} />}>
        {patterns().map(p => <Row key={p.id} label={p.name} value={`${p.start} to ${p.end}${p.end < p.start ? " (next day)" : ""}`} />)}
      </Card>}

      {tab === "Targets" && <Targets onSaved={result("Targets saved")} onRule={rule => setDialog({ kind: "rule", rule })} />}

      {tab === "Power and diesel" && <div className="space-y-4">
        <Card title="Generators" sub="Each set's rating, expected burn and log limits. The diesel book and the generator log are judged against these.">
          <Table heads={["Generator", "Rating", "Burn at 25 / 50 / 75 / 100%", "Service every", "Log limits", ""]}>
            {gensets().map(g => <tr key={g.assetId} style={{ borderTop: `1px solid ${BORDER}` }}>
              <td className={td} style={{ color: TEXT, fontWeight: 600 }}>{asset(g.assetId)?.name}</td><td className={td} style={{ color: TEXT }}>{g.kva} kVA</td>
              <td className={td} style={{ color: TEXT }}>{[g.burnAt[25], g.burnAt[50], g.burnAt[75], g.burnAt[100]].join(" / ")} L/h</td>
              <td className={td} style={{ color: TEXT }}>{g.serviceHours} hours</td>
              <td className={td} style={{ color: MUTED }}>Coolant {g.coolantMin}–{g.coolantMax} °C, oil ≥ {g.oilMin} bar, battery ≥ {g.batteryMin} V</td>
              <td className={`${td} text-right`}><BtnO label={`Edit ${asset(g.assetId)?.name}`} onClick={() => setDialog({ kind: "genset", assetId: g.assetId })} /></td>
            </tr>)}
          </Table>
        </Card>
        <Card title="Diesel tanks" sub="A tank with a dip chart reads millimetres; without one, litres." footer={<BtnO label="Add a tank" icon={Plus} onClick={() => setDialog({ kind: "tank" })} />}>
          {tanks().map(t => <Row key={t.id} label={`${t.name} (${t.kind.toLowerCase()})`} value={`${t.capacity.toLocaleString()} L, order below ${t.minimum.toLocaleString()} L${t.chart?.length ? `, dip chart of ${t.chart.length} points` : ", read in litres"}`} />)}
        </Card>
        <Card title="Supplies you clamp" sub="Only incomers count toward the building total; feeders are for finding faults." footer={<BtnO label="Add a supply" icon={Plus} onClick={() => setDialog({ kind: "supply" })} />}>
          {supplies().map(s => <Row key={s.id} label={`${s.name} (${s.kind.toLowerCase()})`} value={`${s.phases === 3 ? "Three" : "Single"} phase, ${s.volts} V, power factor ${s.pf}${s.breakerAmps ? `, ${s.breakerAmps} A breaker` : ""}${isIncomer(s) ? "" : ", not in the total"}`} />)}
        </Card>
      </div>}

      {tab === "Money" && <MoneyCard onSaved={result("Settings saved")} />}

      {dialog?.kind === "person" && <PersonDialog name={dialog.name} onClose={() => setDialog(null)} onSave={(p) => result(`${dialog.name} updated`)(setPerson(dialog.name, p))} />}
      {dialog?.kind === "rule" && <RuleDialog rule={dialog.rule} onClose={() => setDialog(null)}
        onSave={r => result(dialog.rule ? "Rule saved. Jobs already raised keep their deadlines" : "Rule added. It applies to jobs raised from now")(saveRule(r, staffName, dialog.rule?.id))}
        onRemove={() => { const n = removeRule(dialog.rule!.id); result(`Rule removed.${n ? ` ${n} open job${n === 1 ? "" : "s"} keep${n === 1 ? "s" : ""} the deadlines it gave.` : ""}`)(null); }} />}
      {dialog?.kind === "team" && <TeamDialog onClose={() => setDialog(null)} onSave={t => result(`Team "${t.name.trim()}" added`)(addTeam(t))} />}
      {dialog?.kind === "shift" && <ShiftDialog onClose={() => setDialog(null)} onSave={p => result(`Shift "${p.name.trim()}" added`)(addPattern(p))} />}
      {dialog?.kind === "genset" && <GensetDialog g={gensets().find(x => x.assetId === dialog.assetId)!} onClose={() => setDialog(null)} onSave={g => result("Generator saved")(saveGenset(g))} />}
      {dialog?.kind === "tank" && <TankDialog onClose={() => setDialog(null)} onSave={(t, chart) => { const c = parseChart(chart); if (typeof c === "string") { add({ type: "error", title: c }); return; } result(`Tank "${t.name.trim()}" added`)(addTank({ ...t, chart: c.length ? c : undefined })); }} />}
      {dialog?.kind === "supply" && <SupplyDialog onClose={() => setDialog(null)} onSave={s => result(`Supply "${s.name.trim()}" added`)(addSupply(s))} />}
    </div>
  );
}

const mins = (m?: number) => m == null ? "" : m % 60 ? `${m} min` : `${m / 60} h`;
function Targets({ onSaved, onRule }: { onSaved: (r: string | null) => boolean; onRule: (r?: SlaRule) => void }) {
  const P = Object.keys(PRIORITIES) as WOPriority[];
  const [t, setT] = useState(() => Object.fromEntries(P.map(p => [p, { r: String(PRIORITIES[p].respondMin), f: String(PRIORITIES[p].resolveMin) }])) as Record<WOPriority, { r: string; f: string }>);
  const [trade, setTrade] = useState(""); const [reason, setReason] = useState("");
  const [, redraw] = useState(0);
  const save = () => { for (const p of P) { const r = setTarget(p, Number(t[p].r), Number(t[p].f)); if (r) { onSaved(r); return; } } onSaved(null); };
  return <div className="space-y-4">
    <Card title="Response and resolve targets" sub="Minutes from when a job is raised. A change applies to jobs raised after it." footer={<BtnP label="Save targets" onClick={save} />}>
      <Table heads={["Priority", "Respond within (minutes)", "Resolve within (minutes)"]}>
        {P.map(p => <tr key={p} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={td} style={{ color: TEXT, fontWeight: 600 }}>{p} · {PRIORITIES[p].name}</td>
          <td className="px-3 py-2"><input aria-label={`${p} respond within`} inputMode="numeric" value={t[p].r} onChange={e => setT({ ...t, [p]: { ...t[p], r: e.target.value.replace(/\D/g, "") } })} className={controlClass} style={{ ...controlStyle(), maxWidth: 160 }} /></td>
          <td className="px-3 py-2"><input aria-label={`${p} resolve within`} inputMode="numeric" value={t[p].f} onChange={e => setT({ ...t, [p]: { ...t[p], f: e.target.value.replace(/\D/g, "") } })} className={controlClass} style={{ ...controlStyle(), maxWidth: 160 }} /></td>
        </tr>)}
      </Table>
    </Card>
    <Card title="Deadline rules" sub="A priority narrowed to a trade, a place, or both. Blanks take the priority's target. The most specific rule wins: trade and place, then place, then trade."
      footer={<BtnO label="Add a rule" icon={Plus} onClick={() => onRule()} />}>
      {slaRules().length ? <Table heads={["Rule", "Respond within", "Resolve within", "A breach goes to", ""]}>
        {slaRules().map(r => <tr key={r.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className="px-3 py-2.5 text-sm" style={{ color: TEXT }}><b>{r.priority}{r.trade ? `, ${r.trade}` : ""}{r.place ? `, ${r.place}` : ""}</b>{r.note && <span className="block" style={{ color: MUTED }}>{r.note}</span>}</td>
          <td className={td} style={{ color: r.respondMin ? TEXT : MUTED }}>{r.respondMin ? mins(r.respondMin) : `${mins(PRIORITIES[r.priority].respondMin)} (priority)`}</td>
          <td className={td} style={{ color: r.resolveMin ? TEXT : MUTED }}>{r.resolveMin ? mins(r.resolveMin) : `${mins(PRIORITIES[r.priority].resolveMin)} (priority)`}</td>
          <td className={td} style={{ color: r.escalateTo ? TEXT : MUTED }}>{r.escalateTo ?? "As usual"}</td>
          <td className="px-3 py-2 text-right"><BtnO label="Edit rule" onClick={() => onRule(r)} /></td>
        </tr>)}
      </Table> : <p className="text-sm" style={{ color: MUTED }}>No rules. Every job takes its priority's targets.</p>}
    </Card>
    <div className="grid xl:grid-cols-2 gap-4">
      <Card title="Trades" sub="Used for people and job categories.">
        <p className="text-sm mb-3" style={{ color: TEXT }}>{WO_CATEGORIES.join(", ")}</p>
        <div className="flex gap-2 items-end"><div className="flex-1"><Field label="New trade" htmlFor="st-trade">{input("st-trade", trade, setTrade)}</Field></div>
          <BtnO label="Add trade" onClick={() => { if (onSaved(addTrade(trade))) setTrade(""); }} /></div>
      </Card>
      <Card title="Hold reasons" sub="What a job can be waiting for. Removing one leaves jobs already on hold as they are.">
        {HOLD_REASONS.map(h => <div key={h} className="flex items-center justify-between py-1.5 text-sm" style={{ color: TEXT, borderTop: `1px solid ${BORDER}` }}>{h}
          <BtnO label={`Remove ${h}`} onClick={() => { onSaved(removeHoldReason(h)); redraw(n => n + 1); }} /></div>)}
        <div className="flex gap-2 items-end mt-3"><div className="flex-1"><Field label="New hold reason" htmlFor="st-hold">{input("st-hold", reason, setReason)}</Field></div>
          <BtnO label="Add hold reason" onClick={() => { if (onSaved(addHoldReason(reason))) setReason(""); }} /></div>
      </Card>
    </div>
  </div>;
}

function MoneyCard({ onSaved }: { onSaved: (r: string | null) => boolean }) {
  const m = money();
  const [f, setF] = useState({ fuelTolerancePct: String(m.fuelTolerancePct), gridTariff: String(m.gridTariff), supervisorLimit: String(m.supervisorLimit), labourRate: String(m.labourRate) });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Card title="Tolerances, tariff and limits" footer={<BtnP label="Save settings" onClick={() => onSaved(setMoney({ fuelTolerancePct: Number(f.fuelTolerancePct), gridTariff: Number(f.gridTariff), supervisorLimit: Number(f.supervisorLimit), labourRate: Number(f.labourRate) }))} />}>
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Fuel variance tolerance (%)" htmlFor="st-fuel" hint="A delivery or a month's diesel off by more than this is flagged and must be explained.">{input("st-fuel", f.fuelTolerancePct, set("fuelTolerancePct"), true)}</Field>
      <Field label="Grid tariff (₦ per kWh)" htmlFor="st-tariff" hint="What generated power is compared against.">{input("st-tariff", f.gridTariff, set("gridTariff"), true)}</Field>
      <Field label="Supervisor's approval limit (₦)" htmlFor="st-limit" hint="Requisitions and purchases above this go to the approvals queue.">{input("st-limit", f.supervisorLimit, set("supervisorLimit"), true)}</Field>
      <Field label="Labour rate (₦ per hour)" htmlFor="st-labour" hint="Used to cost a job's labour hours.">{input("st-labour", f.labourRate, set("labourRate"), true)}</Field>
    </div>
  </Card>;
}

function PersonDialog({ name, onClose, onSave }: { name: string; onClose: () => void; onSave: (p: { trade: string; team?: string; role: StaffRole }) => void }) {
  const s = staffList().find(x => x.name === name)!;
  const [trade, setTrade] = useState(s.trade); const [team, setTeam] = useState(s.team ?? ""); const [role, setRole] = useState<string>(s.role);
  return <Dialog title={`Edit ${name}`} onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save person" onClick={() => onSave({ trade, team: team || undefined, role: role as StaffRole })} /></>}>
    <Select id="sp-trade" label="Trade" value={trade} onChange={setTrade} options={[...new Set([...WO_CATEGORIES, trade])]} />
    <Select id="sp-team" label="Team" value={team} onChange={setTeam} options={[["", "No team"], ...teams().map(t => [t.name, t.name] as [string, string])]} />
    <Select id="sp-role" label="Maintenance role" value={role} onChange={setRole} options={ROLES} />
  </Dialog>;
}

function TeamDialog({ onClose, onSave }: { onClose: () => void; onSave: (t: { name: string; trade: string; lead: string; supervisor: string }) => void }) {
  const people = staffList().map(s => s.name);
  const [f, setF] = useState({ name: "", trade: WO_CATEGORIES[0], lead: people[0], supervisor: people[0] });
  return <Dialog title="Add a team" onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add team" onClick={() => onSave(f)} /></>}>
    <Field label="Team name" htmlFor="tm-name" required>{input("tm-name", f.name, v => setF({ ...f, name: v }))}</Field>
    <Select id="tm-trade" label="Trade" value={f.trade} onChange={v => setF({ ...f, trade: v })} options={WO_CATEGORIES} />
    <Select id="tm-lead" label="Team lead" value={f.lead} onChange={v => setF({ ...f, lead: v })} options={people} />
    <Select id="tm-sup" label="Supervisor" value={f.supervisor} onChange={v => setF({ ...f, supervisor: v })} options={people} />
  </Dialog>;
}

function ShiftDialog({ onClose, onSave }: { onClose: () => void; onSave: (p: { name: string; start: string; end: string }) => void }) {
  const [f, setF] = useState({ name: "", start: "07:00", end: "15:00" });
  return <Dialog title="Add a shift" sub="Times are 24-hour. A shift may run past midnight." onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add shift" onClick={() => onSave(f)} /></>}>
    <Field label="Name" htmlFor="sh-name" required>{input("sh-name", f.name, v => setF({ ...f, name: v }))}</Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Starts" htmlFor="sh-start">{input("sh-start", f.start, v => setF({ ...f, start: v }))}</Field>
      <Field label="Ends" htmlFor="sh-end">{input("sh-end", f.end, v => setF({ ...f, end: v }))}</Field>
    </div>
  </Dialog>;
}

function GensetDialog({ g, onClose, onSave }: { g: GensetProfile; onClose: () => void; onSave: (g: GensetProfile) => void }) {
  const flat = { kva: g.kva, b25: g.burnAt[25], b50: g.burnAt[50], b75: g.burnAt[75], b100: g.burnAt[100], serviceHours: g.serviceHours, highBurnPct: g.highBurnPct,
    coolantMin: g.coolantMin, coolantMax: g.coolantMax, oilMin: g.oilMin, batteryMin: g.batteryMin, nominalVolts: g.nominalVolts, nominalHz: g.nominalHz };
  const [f, setF] = useState(Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, String(v)])) as Record<keyof typeof flat, string>);
  const n = (k: keyof typeof flat) => Number(f[k]);
  const field = (k: keyof typeof flat, label: string) => <Field label={label} htmlFor={`gs-${k}`}>{input(`gs-${k}`, f[k], v => setF({ ...f, [k]: v }), true)}</Field>;
  return <Dialog title={`Edit ${asset(g.assetId)?.name}`} wide onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Save generator" onClick={() => onSave({ ...g,
    kva: n("kva"), burnAt: { 25: n("b25"), 50: n("b50"), 75: n("b75"), 100: n("b100") }, serviceHours: n("serviceHours"), highBurnPct: n("highBurnPct"),
    coolantMin: n("coolantMin"), coolantMax: n("coolantMax"), oilMin: n("oilMin"), batteryMin: n("batteryMin"), nominalVolts: n("nominalVolts"), nominalHz: n("nominalHz") })} /></>}>
    <div className="grid grid-cols-3 gap-4">{field("kva", "Rating (kVA)")}{field("serviceHours", "Service every (hours)")}{field("highBurnPct", "High burn above (%)")}</div>
    <div className="grid grid-cols-4 gap-4">{field("b25", "L/h at 25%")}{field("b50", "L/h at 50%")}{field("b75", "L/h at 75%")}{field("b100", "L/h at 100%")}</div>
    <div className="grid grid-cols-3 gap-4">{field("coolantMin", "Coolant min (°C)")}{field("coolantMax", "Coolant max (°C)")}{field("oilMin", "Oil pressure min (bar)")}</div>
    <div className="grid grid-cols-3 gap-4">{field("batteryMin", "Battery min (V)")}{field("nominalVolts", "Nominal volts")}{field("nominalHz", "Nominal hertz")}</div>
  </Dialog>;
}

function TankDialog({ onClose, onSave }: { onClose: () => void; onSave: (t: { name: string; kind: TankKind; capacity: number; minimum: number }, chart: string) => void }) {
  const [f, setF] = useState({ name: "", kind: "Bulk", capacity: "", minimum: "", chart: "" });
  return <Dialog title="Add a tank" onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add tank" onClick={() => onSave({ name: f.name, kind: f.kind as TankKind, capacity: Number(f.capacity), minimum: Number(f.minimum) }, f.chart)} /></>}>
    <Field label="Name" htmlFor="tk-name" required hint="Bulk tank, day tank, the drum by the pump house.">{input("tk-name", f.name, v => setF({ ...f, name: v }))}</Field>
    <Select id="tk-kind" label="Kind" value={f.kind} onChange={v => setF({ ...f, kind: v })} options={["Bulk", "Day tank", "Drum"]} />
    <div className="grid grid-cols-2 gap-4">
      <Field label="Capacity (litres)" htmlFor="tk-cap" required>{input("tk-cap", f.capacity, v => setF({ ...f, capacity: v }), true)}</Field>
      <Field label="Minimum (litres)" htmlFor="tk-min" hint="Below this, order.">{input("tk-min", f.minimum, v => setF({ ...f, minimum: v }), true)}</Field>
    </div>
    <Field label="Dip chart" htmlFor="tk-chart" hint="Optional. One line per point: millimetres = litres, from the tank maker's chart. A horizontal tank is not linear.">
      <textarea id="tk-chart" rows={4} value={f.chart} onChange={e => setF({ ...f, chart: e.target.value })} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none" style={controlStyle()} />
    </Field>
  </Dialog>;
}

function SupplyDialog({ onClose, onSave }: { onClose: () => void; onSave: (s: { name: string; kind: SupplyKind; gensetAssetId?: string; phases: 1 | 3; volts: number; pf: number; ctRatio: number; breakerAmps?: number }) => void }) {
  const sets = assets().filter(a => a.cat === "Power");
  const [f, setF] = useState({ name: "", kind: "Feeder", genset: sets[0]?.id ?? "", phases: "3", volts: "415", pf: "0.8", ct: "1", breaker: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return <Dialog title="Add a supply" sub="Something you clamp on the round." onClose={onClose} footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Add supply" onClick={() => onSave({ name: f.name, kind: f.kind as SupplyKind,
    gensetAssetId: f.kind === "Generator" ? f.genset : undefined, phases: f.phases === "1" ? 1 : 3, volts: Number(f.volts), pf: Number(f.pf), ctRatio: Number(f.ct), breakerAmps: f.breaker ? Number(f.breaker) : undefined })} /></>}>
    <Field label="Name" htmlFor="ps-name" required hint="What somebody would call it standing in front of it.">{input("ps-name", f.name, set("name"))}</Field>
    <div className="grid grid-cols-2 gap-4">
      <Select id="ps-kind" label="Kind" value={f.kind} onChange={set("kind")} options={[["Utility", "Utility incomer"], ["Generator", "Generator output"], ["Feeder", "Feeder (not in the total)"]]} />
      <Select id="ps-phases" label="Phases" value={f.phases} onChange={set("phases")} options={[["3", "Three phase"], ["1", "Single phase"]]} />
    </div>
    {f.kind === "Generator" && <Select id="ps-genset" label="Which generator" value={f.genset} onChange={set("genset")} options={sets.map(a => [a.id, a.name] as [string, string])} />}
    <div className="grid grid-cols-4 gap-4">
      <Field label="Volts" htmlFor="ps-volts">{input("ps-volts", f.volts, set("volts"), true)}</Field>
      <Field label="Power factor" htmlFor="ps-pf">{input("ps-pf", f.pf, set("pf"), true)}</Field>
      <Field label="CT ratio" htmlFor="ps-ct" hint="1 on the cable">{input("ps-ct", f.ct, set("ct"), true)}</Field>
      <Field label="Breaker (A)" htmlFor="ps-brk">{input("ps-brk", f.breaker, set("breaker"), true)}</Field>
    </div>
  </Dialog>;
}

function RuleDialog({ rule, onClose, onSave, onRemove }: { rule?: SlaRule; onClose: () => void; onSave: (r: Parameters<typeof saveRule>[0]) => void; onRemove: () => void }) {
  const [f, setF] = useState({ priority: rule?.priority ?? "P2", trade: rule?.trade ?? "", place: rule?.place ?? "", respond: rule?.respondMin?.toString() ?? "", resolve: rule?.resolveMin?.toString() ?? "", escalateTo: rule?.escalateTo ?? "", note: rule?.note ?? "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  // Places a job can name: where the plant is and where jobs have been raised, plus every guest room at once.
  const places = [...new Set([GUEST_ROOMS, ...assets().map(a => a.location), ...workOrders().filter(w => !w.room).map(w => w.location), ...(rule?.place ? [rule.place] : [])])];
  const p = PRIORITIES[f.priority as WOPriority], n = (v: string) => (v.trim() === "" ? undefined : Number(v));
  return <Dialog title={rule ? "Edit deadline rule" : "Add a deadline rule"} sub="Applies to jobs raised from now. Jobs already raised keep their deadlines." wide onClose={onClose}
    footer={<>{rule && <BtnO label="Remove rule" onClick={onRemove} />}<BtnO label="Cancel" onClick={onClose} /><BtnP label={rule ? "Save rule" : "Add rule"} onClick={() => onSave({ priority: f.priority as WOPriority, trade: f.trade, place: f.place, respondMin: n(f.respond), resolveMin: n(f.resolve), escalateTo: (f.escalateTo || undefined) as StaffRole | undefined, note: f.note })} /></>}>
    <div className="grid sm:grid-cols-3 gap-4">
      <Select id="sr-priority" label="Priority" value={f.priority} onChange={set("priority")} options={(Object.keys(PRIORITIES) as WOPriority[]).map(k => [k, `${k} · ${PRIORITIES[k].name}`] as [string, string])} />
      <Select id="sr-trade" label="Trade" value={f.trade} onChange={set("trade")} options={[["", "Any trade"], ...WO_CATEGORIES.map(t => [t, t] as [string, string])]} />
      <Select id="sr-place" label="Place" value={f.place} onChange={set("place")} options={[["", "Anywhere"], ...places.map(x => [x, x] as [string, string])]} />
    </div>
    <div className="grid sm:grid-cols-3 gap-4">
      <Field label="Respond (minutes)" htmlFor="sr-respond" hint={`Blank takes ${p.respondMin}.`}>{input("sr-respond", f.respond, set("respond"), true)}</Field>
      <Field label="Resolve (minutes)" htmlFor="sr-resolve" hint={`Blank takes ${p.resolveMin}.`}>{input("sr-resolve", f.resolve, set("resolve"), true)}</Field>
      <Select id="sr-escalate" label="Breach goes to" value={f.escalateTo} onChange={set("escalateTo")} options={[["", "As usual"], ...ROLES.map(r => [r, r] as [string, string])]} />
    </div>
    <Field label="Why this rule" htmlFor="sr-note" hint="Shown with the rule, so the next person knows why it is there.">{input("sr-note", f.note, set("note"))}</Field>
  </Dialog>;
}
