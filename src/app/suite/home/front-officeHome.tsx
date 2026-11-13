import { useState } from "react";
import {
  ArrowRight, Bed, Buildings, CalendarCheck, CheckCircle, Clock, CurrencyNgn,
  DoorOpen, MagnifyingGlass, MapPin, Plus, SignIn, SignOut, UserPlus, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, WARNING, display, mono,
} from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import {
  FRONT_OFFICE_EXCEPTIONS, FRONT_OFFICE_KPIS, FRONT_OFFICE_QUEUE,
  type FrontOfficeQueueItem,
} from "../../mock/front-officeHome";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "front-office")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const depositColors: Record<FrontOfficeQueueItem["depositStatus"], { bg: string; text: string }> = {
  Paid: { bg: "#ECFDF5", text: SUCCESS },
  Partial: { bg: "#FFFBEB", text: "#B45309" },
  Unpaid: { bg: "#FEF2F2", text: ERROR },
};

const roomReadyColors: Record<FrontOfficeQueueItem["roomReady"], { bg: string; text: string }> = {
  Ready: { bg: "#ECFDF5", text: SUCCESS },
  Cleaning: { bg: "#EFF6FF", text: "#1D4ED8" },
  "Not assigned": { bg: "#FEF2F2", text: ERROR },
  "Inspection due": { bg: "#F5F3FF", text: "#6D28D9" },
};

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function FrontOfficeHome({ nav }: { nav: Nav }) {
  const [viewState, setViewState] = useState<ViewState>("Ready");

  const quickActions: Array<{ label: string; icon: typeof Plus; screen: Screen }> = [
    { label: "New reservation", icon: Plus, screen: "new-reservation" },
    { label: "Walk-in", icon: UserPlus, screen: "walk-in" },
    { label: "Find reservation", icon: MagnifyingGlass, screen: "reservation-search" },
    { label: "Availability board", icon: Bed, screen: "availability-board" },
  ];

  if (viewState === "Loading") {
    return (
      <div>
        <PageHeader title="Front Office" sub="Loading today's guest operations…" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border" style={{ borderColor: BORDER, backgroundColor: "white" }} />)}</div>
        <div className="mt-5 h-80 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} />
      </div>
    );
  }

  if (viewState === "Error") {
    return (
      <div>
        <PageHeader title="Front Office" sub="Guest operations command centre" />
        <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <EmptyState icon={WarningCircle} message="Front Office data could not be loaded from the local server." cta="Try again" onCta={() => setViewState("Ready")} />
        </div>
      </div>
    );
  }

  if (viewState === "Empty") {
    return (
      <div>
        <PageHeader title="Front Office" sub="Guest operations command centre" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />
        <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <EmptyState icon={CalendarCheck} message="There are no arrivals, departures or pending guest tasks for today." cta="Create reservation" onCta={() => nav("new-reservation", "New Reservation")} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Front Office command centre"
        sub="Today’s reservation, arrival and guest-stay operations."
        actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />}
      />

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Buildings size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Front Office</h1><Badge label="Local operations" colors={{ bg: `${accent}12`, text: accent }} /></div>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>Move every guest smoothly from reservation and room assignment through check-in, stay and departure.</p>
          <div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Front Desk" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Reservations" colors={{ bg: BG, text: PRIMARY }} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><MapPin size={14} style={{ color: accent }} />Grand Palms · Abuja</div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 12 sec ago</div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...FRONT_OFFICE_KPIS[0]} icon={SignIn} accent={accent} />
        <StatCard {...FRONT_OFFICE_KPIS[1]} icon={SignOut} accent={accent} />
        <StatCard {...FRONT_OFFICE_KPIS[2]} icon={Buildings} accent={accent} />
        <StatCard {...FRONT_OFFICE_KPIS[3]} icon={Bed} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary guest flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Jump directly to each stage of today’s guest journey.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">
          {flow.map((step, index) => (
            <div key={step.screen} className="flex min-w-0 flex-1 items-center">
              <button onClick={() => nav(step.screen, step.label)} className="group flex min-w-[132px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}>
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span>
                <span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span>
              </button>
              {index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Today’s arrival queue</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>12 expected · 7 rooms assigned · updated 10:42</p></div>
            <BtnO label="View all arrivals" icon={CalendarCheck} onClick={() => nav("arrivals", "Arrivals List")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead><tr style={{ backgroundColor: BG }}>{["Guest", "Room type", "ETA", "Deposit", "Room ready", "Actions"].map(label => <th key={label} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
              <tbody>
                {FRONT_OFFICE_QUEUE.map(item => (
                  <tr key={item.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3"><button onClick={() => nav("reservation-detail", "Reservation Detail", item.id)} className="text-left"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.guest}</div><div className="mt-0.5 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{item.id} · {item.city}</div></button></td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.roomType}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{item.eta}</td>
                    <td className="px-4 py-3"><Badge label={item.depositStatus} colors={depositColors[item.depositStatus]} /></td>
                    <td className="px-4 py-3"><Badge label={item.roomReady} colors={roomReadyColors[item.roomReady]} /></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => nav("room-assignment", "Room Assignment")} className="inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-semibold" style={{ borderColor: BORDER, color: TEXT }}>Assign room</button><button onClick={() => nav("check-in", "Check-In", item.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>Check in<ArrowRight size={12} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Needs attention</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Exceptions affecting today’s service.</p></div>
          <div>
            {FRONT_OFFICE_EXCEPTIONS.map((item, index) => (
              <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}>
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div>
                <button onClick={() => nav(item.screen, item.screenLabel, item.navParam)} className="mt-2 flex min-h-8 items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => index === 0
            ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} />
            : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Front Office toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {department.screens.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))).map(item => (
            <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}>
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><DoorOpen size={19} /></div>
              <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-xs uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div>
              <ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
