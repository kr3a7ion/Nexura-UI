import { useOpens } from "../opens";
import { useState, type ElementType } from "react";
import {
  ArrowRight, Buildings, CalendarDots, CheckCircle, Clock, Drop, GearSix,
  Lightning, MagnifyingGlass, Plus, Wrench, Warning, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen, Role } from "../../constants";
import { ApprovalsCard } from "../ApprovalsCard";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, display, mono, propertyLabel } from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import { maintenanceExceptions, maintenancePower } from "../../mock/maintenanceHome";
import { workOrders, isOpen, isOverdue, isUrgent, ageOf, priorityLabel, assignee, type WorkOrder } from "../../mock/maintenance";
import { WO_STATUS_C, WO_PRI_C } from "../../WorkOrderScreens";
import { ROOMS } from "../../mock/property";
import { roomState } from "../../mock/rooms";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "maintenance")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;


const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function MaintenanceHome({ nav, role, staffName }: { nav: Nav; role: Role; staffName: string }) {
  const opens = useOpens();
  // Counted from the work orders and the property's rooms.
  const open = workOrders().filter(isOpen);
  const power = maintenancePower();
  const overdue = open.filter(isOverdue);
  const outOfOrder = ROOMS.filter(r => roomState(r.id) === "Out of order");

  const quickActions: Array<{ label: string; icon: ElementType; screen: Screen }> = [
    { label: "New work order", icon: Plus, screen: "work-orders" },
    { label: "Log diesel", icon: Drop, screen: "generator-diesel" },
    { label: "Planned work", icon: CalendarDots, screen: "preventive-schedule" },
    { label: "Vendor contacts", icon: Buildings, screen: "vendor-contacts" },
  ];

  return (
    <div>
      <PageHeader title="Maintenance & Engineering command centre" sub="Today’s work orders, assets, power and preventive-maintenance operations." />
      <div className="-mt-4 mb-5"><ApprovalsCard role={role} staffName={staffName} dept="Maintenance" /></div>

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Wrench size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Maintenance & Engineering</h1><Badge label="Engineering online" colors={{ bg: `${accent}12`, text: accent }} /></div>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>Resolve guest-impacting faults, protect hotel assets and keep utilities running reliably.</p>
          <div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Maintenance" colors={{ bg: BG, text: PRIMARY }} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><Buildings size={14} style={{ color: accent }} />{propertyLabel()}</div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 14 sec ago</div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open work orders" value={String(open.length)} sub={`${open.filter(w => w.room).length} in rooms · ${open.filter(w => !w.room).length} elsewhere`} icon={Wrench} accent={accent} />
        <StatCard label="Overdue" value={String(overdue.length)} sub={overdue.length ? `${overdue.filter(isUrgent).length} P1 or P2` : "All on time"} icon={Clock} accent={accent} />
        <StatCard label="Rooms out of order" value={String(outOfOrder.length)} sub={outOfOrder.length ? `Rooms ${outOfOrder.map(r => r.id).join(", ")}` : "All rooms in service"} icon={Buildings} accent={accent} />
        <StatCard label="Bulk diesel" value={power.dieselPct} sub={`${power.dieselRemaining.replace(/ \(.*\)$/, "")} · ${power.reserveDays.toLowerCase()} left`} icon={Drop} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Power & generator</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Backup power at this property right now.</p></div></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[["Generator run today", power.runtimeToday], ["Diesel remaining", power.dieselRemaining], ["Reserve", power.reserveDays], ["Last power cut", power.lastGridOutage]].map(([label, value]) => <div key={label} className="rounded-xl p-3" style={{ backgroundColor: BG }}><div className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</div><div className="mt-1.5 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{value}</div></div>)}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary engineering flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Resolve current faults and prevent the next service disruption.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">{flow.filter(step => opens(step.screen)).map((step, index) => <div key={`${step.screen}-${index}`} className="flex min-w-0 flex-1 items-center"><button onClick={() => nav(step.screen, step.label)} className="flex min-w-[130px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span></button>{index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}</div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><div><h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Open work orders</h2><p className="mt-0.5 text-sm" style={{ color: MUTED }}>{open.length} open · {overdue.length} overdue</p></div>{opens("work-orders") && <BtnO label="All work orders" icon={Wrench} onClick={() => nav("work-orders", "Work Orders")} />}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr style={{ backgroundColor: BG }}>{["Work order", "Assigned to", "Open for", "Priority", "Status", ""].map(label => <th key={label} className="px-4 py-2.5 text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
              <tbody>{open.map(item => <tr key={item.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 min-w-[220px]"><div className="text-sm font-medium" style={{ color: TEXT }}>{item.title}</div><div className="mt-0.5 text-sm" style={{ color: MUTED }}>{item.id} · {item.location}</div></td>
                <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: assignee(item) ? TEXT : "#B45309" }}>{assignee(item) ?? "Nobody yet"}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: isOverdue(item) ? ERROR : TEXT }}>{ageOf(item)}</td>
                <td className="px-4 py-3"><Badge label={priorityLabel(item.priority)} colors={WO_PRI_C[item.priority]} /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Badge label={isOverdue(item) ? "Overdue" : item.status} colors={WO_STATUS_C[isOverdue(item) ? "Overdue" : item.status]} /></td>
                <td className="px-4 py-3 text-right">{opens("work-order-detail") && <button onClick={() => nav("work-order-detail", item.id, item.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap" style={{ backgroundColor: `${accent}12`, color: "#C2410C" }}>Open<ArrowRight size={12} /></button>}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Engineering exceptions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Service and asset risks requiring action.</p></div>
          {maintenanceExceptions().map((item, index) => <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div>{opens(item.screen) && <button onClick={() => nav(item.screen, item.screenLabel)} className="mt-2 flex min-h-[32px] items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button>}</div>)}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}><h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2><div className="flex flex-wrap gap-2">{quickActions.filter(action => opens(action.screen)).map((action, index) => index === 0 ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, "Work Orders", "new:")} /> : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}</div></section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Maintenance toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{department.screens.flatMap(group => group.items.filter(item => opens(item.screen)).map(item => ({ ...item, group: group.label }))).map(item => <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><GearSix size={19} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-xs uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div><ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} /></button>)}</div>
      </section>
    </div>
  );
}
