import { useState, type ElementType } from "react";
import {
  ArrowRight, Buildings, CalendarDots, CheckCircle, Clock, Drop, GearSix,
  Lightning, MagnifyingGlass, Plus, Wrench, Warning, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, display, mono,
} from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import {
  MAINTENANCE_EXCEPTIONS, MAINTENANCE_KPIS, MAINTENANCE_QUEUE,
  MAINTENANCE_POWER, type MaintenanceQueueItem,
} from "../../mock/maintenanceHome";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "maintenance")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const statusColors: Record<MaintenanceQueueItem["status"], { bg: string; text: string }> = {
  Reported: { bg: "#F1F5F9", text: "#475569" },
  Assigned: { bg: "#EFF6FF", text: "#1D4ED8" },
  "In progress": { bg: `${accent}12`, text: accent },
  "Awaiting parts": { bg: "#FFFBEB", text: "#B45309" },
};

const priorityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  High: { bg: "#FFFBEB", text: "#B45309" },
  Medium: { bg: BG, text: MUTED },
};

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function MaintenanceHome({ nav }: { nav: Nav }) {
  const [viewState, setViewState] = useState<ViewState>("Ready");

  const quickActions: Array<{ label: string; icon: ElementType; screen: Screen }> = [
    { label: "New work order", icon: Plus, screen: "work-orders" },
    { label: "Log diesel", icon: Drop, screen: "generator-diesel" },
    { label: "Preventive schedule", icon: CalendarDots, screen: "preventive-schedule" },
    { label: "Vendor contacts", icon: Buildings, screen: "vendor-contacts" },
  ];

  if (viewState === "Loading") {
    return <div><PageHeader title="Maintenance" sub="Loading engineering operations…" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} />)}</div><div className="mt-5 h-80 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} /></div>;
  }

  if (viewState === "Error") {
    return <div><PageHeader title="Maintenance" sub="Engineering and asset operations" /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={WarningCircle} message="Maintenance data could not be loaded from the local server." cta="Try again" onCta={() => setViewState("Ready")} /></div></div>;
  }

  if (viewState === "Empty") {
    return <div><PageHeader title="Maintenance" sub="Engineering and asset operations" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={CheckCircle} message="There are no open work orders or preventive tasks requiring action." cta="Open asset register" onCta={() => nav("asset-register", "Asset Register")} /></div></div>;
  }

  return (
    <div>
      <PageHeader title="Maintenance & Engineering command centre" sub="Today’s work orders, assets, power and preventive-maintenance operations." actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Wrench size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Maintenance & Engineering</h1><Badge label="Engineering online" colors={{ bg: `${accent}12`, text: accent }} /></div>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>Resolve guest-impacting faults, protect hotel assets and keep utilities running reliably.</p>
          <div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Maintenance" colors={{ bg: BG, text: PRIMARY }} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><Buildings size={14} style={{ color: accent }} />Grand Palms · Abuja</div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 14 sec ago</div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...MAINTENANCE_KPIS[0]} icon={Wrench} accent={accent} />
        <StatCard {...MAINTENANCE_KPIS[1]} icon={Clock} accent={accent} />
        <StatCard {...MAINTENANCE_KPIS[2]} icon={Buildings} accent={accent} />
        <StatCard {...MAINTENANCE_KPIS[3]} icon={Drop} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Power & generator</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Current backup-power position for the Abuja property.</p></div><Badge label="Generator B running" colors={{ bg: `${accent}12`, text: accent }} /></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[["Runtime today", MAINTENANCE_POWER.runtimeToday], ["Diesel remaining", MAINTENANCE_POWER.dieselRemaining], ["Reserve", MAINTENANCE_POWER.reserveDays], ["Last grid outage", MAINTENANCE_POWER.lastGridOutage]].map(([label, value]) => <div key={label} className="rounded-xl p-3" style={{ backgroundColor: BG }}><div className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</div><div className="mt-1.5 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{value}</div></div>)}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary engineering flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Resolve current faults and prevent the next service disruption.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">{flow.map((step, index) => <div key={`${step.screen}-${index}`} className="flex min-w-0 flex-1 items-center"><button onClick={() => nav(step.screen, step.label)} className="flex min-w-[130px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span></button>{index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}</div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Today’s work queue</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>18 open · 6 due today · updated 10:48</p></div><BtnO label="View work orders" icon={Wrench} onClick={() => nav("work-orders", "Work Orders")} /></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr style={{ backgroundColor: BG }}>{["Work order / room", "Asset", "Issue", "Assignee", "Age", "Priority", "Status", ""].map(label => <th key={label} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
              <tbody>{MAINTENANCE_QUEUE.map(item => <tr key={item.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.room}</div><div className="mt-0.5 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{item.id} · {item.branch}</div></td>
                <td className="max-w-[180px] px-4 py-3 text-xs" style={{ color: MUTED }}>{item.asset}</td>
                <td className="max-w-[200px] px-4 py-3"><div className="truncate text-xs" style={{ color: TEXT }}>{item.issue}</div></td>
                <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{item.assignee}</td>
                <td className="px-4 py-3 text-xs font-semibold" style={{ color: item.priority === "Critical" ? ERROR : TEXT, fontFamily: mono }}>{item.age}</td>
                <td className="px-4 py-3"><Badge label={item.priority} colors={priorityColors[item.priority]} /></td>
                <td className="px-4 py-3"><Badge label={item.status} colors={statusColors[item.status]} /></td>
                <td className="px-4 py-3 text-right"><button onClick={() => nav("work-order-detail", "Work Order Detail", item.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>Open<ArrowRight size={12} /></button></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Engineering exceptions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Service and asset risks requiring action.</p></div>
          {MAINTENANCE_EXCEPTIONS.map((item, index) => <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div><button onClick={() => nav(item.screen, item.screenLabel)} className="mt-2 flex min-h-8 items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button></div>)}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}><h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2><div className="flex flex-wrap gap-2">{quickActions.map((action, index) => index === 0 ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} /> : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}</div></section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Maintenance toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{department.screens.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))).map(item => <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><GearSix size={19} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-xs uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div><ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} /></button>)}</div>
      </section>
    </div>
  );
}
