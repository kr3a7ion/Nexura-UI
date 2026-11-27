import { useOpens } from "../opens";
import { useState } from "react";
import {
  ArrowRight, Bed, Buildings, CalendarCheck, CheckCircle, Clock, CurrencyNgn,
  DoorOpen, MagnifyingGlass, MapPin, Plus, SignIn, SignOut, UserPlus, WarningCircle,
} from "@phosphor-icons/react";
import type { Role, Screen } from "../../constants";
import { ApprovalsCard } from "../ApprovalsCard";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, WARNING, display, mono, propertyLabel } from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import { frontOfficeKpis, frontOfficeExceptions, leavingToday } from "../../mock/front-officeHome";
import { ARRIVALS, STAYS, balanceOf } from "../../mock/frontOffice";
import { hkStatus } from "../../mock/housekeeping";
import { CardRail } from "../../ui";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "front-office")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

/** One guest on a card: who, where, one fact that matters, and the next step. */
function GuestCard({ name, vip, line, tag, action }: { name: string; vip?: boolean; line: string; tag: { label: string; good: boolean }; action: false | { label: string; run: () => void } }) {
  return <div className="flex w-56 flex-none snap-start flex-col justify-between rounded-xl border p-3.5 transition-shadow hover:shadow-md" style={{ borderColor: BORDER }}>
    <div>
      <div className="flex items-center gap-1.5"><span className="truncate text-sm font-semibold" style={{ color: TEXT }}>{name}</span>{vip && <Badge label="VIP" colors={{ bg: "#FFF7ED", text: "#B45309" }} />}</div>
      <p className="mt-0.5 truncate text-xs" style={{ color: MUTED }}>{line}</p>
      <div className="mt-2" title={tag.label}><Badge label={tag.label.length > 30 ? `${tag.label.slice(0, 29)}…` : tag.label} colors={tag.good ? { bg: "#ECFDF5", text: SUCCESS } : { bg: "#FFFBEB", text: "#B45309" }} /></div>
    </div>
    {action && <button onClick={action.run} className="mt-3 min-h-[32px] rounded-lg border px-3 text-xs font-semibold" style={{ borderColor: BORDER, color: PRIMARY }}>{action.label}</button>}
  </div>;
}

export default function FrontOfficeHome({ nav, role, staffName }: { nav: Nav; role: Role; staffName: string }) {
  const opens = useOpens();
  const [viewState, setViewState] = useState<ViewState>("Ready");
  const kpis = frontOfficeKpis();
  const staying = STAYS.filter(s => !leavingToday().includes(s) && (balanceOf(s) > 0 || s.complaints > 0 || s.requests > 0 || !!s.notes?.length || s.vip))
    .sort((x, y) => balanceOf(y) - balanceOf(x)); // biggest balance first; the row shows the first 12

  const quickActions: Array<{ label: string; icon: typeof Plus; screen: Screen }> = [
    { label: "New reservation", icon: Plus, screen: "new-reservation" },
    { label: "Walk-in", icon: UserPlus, screen: "walk-in" },
    { label: "Find reservation", icon: MagnifyingGlass, screen: "reservation-search" },
    { label: "Availability board", icon: Bed, screen: "availability-board" },
  ];

  if (viewState === "Loading") {
    return (
      <div>
        <PageHeader title="Front Office" sub="Loading today's guest operations…" />
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
        <PageHeader title="Front Office" sub="Guest operations command centre" />
        <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <EmptyState icon={CalendarCheck} message="There are no arrivals, departures or pending guest tasks for today." cta={opens("new-reservation") ? "Create reservation" : undefined} onCta={() => nav("new-reservation", "New Reservation")} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Front Office command centre"
        sub="Today’s reservation, arrival and guest-stay operations."
      />
      <div className="-mt-4 mb-5"><ApprovalsCard role={role} staffName={staffName} dept="Front Office" /></div>

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Buildings size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Front Office</h1><Badge label="Local operations" colors={{ bg: `${accent}12`, text: accent }} /></div>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>Move every guest smoothly from reservation and room assignment through check-in, stay and departure.</p>
          <div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Front Desk" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Reservations" colors={{ bg: BG, text: PRIMARY }} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><MapPin size={14} style={{ color: accent }} />{propertyLabel()}</div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 12 sec ago</div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...kpis[0]} icon={SignIn} accent={accent} />
        <StatCard {...kpis[1]} icon={SignOut} accent={accent} />
        <StatCard {...kpis[2]} icon={Buildings} accent={accent} />
        <StatCard {...kpis[3]} icon={Bed} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary guest flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Jump directly to each stage of today’s guest journey.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">
          {flow.filter(step => opens(step.screen)).map((step, index) => (
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
        <section className="min-w-0 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Today</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Every guest arriving, staying and leaving, with the next step on each card. Swipe or scroll sideways.</p></div>
            {opens("arrivals") && <BtnO label="View all arrivals" icon={CalendarCheck} onClick={() => nav("arrivals", "Arrivals List")} />}
          </div>
          <CardRail title="Arriving" count={ARRIVALS.length} empty="No more arrivals today.">
            {ARRIVALS.map(a => { const ready = !!a.room && ["Clean", "Inspected"].includes(hkStatus(a.room) ?? "");
              return <GuestCard key={a.id} name={a.guest} vip={a.vip} line={`${a.type} · ETA ${a.eta} · ${a.nights}n`}
                tag={a.room ? { label: ready ? `Room ${a.room} ready` : `Room ${a.room} not ready`, good: ready } : { label: "No room yet", good: false }}
                action={!a.room ? opens("room-assignment") && { label: "Give a room", run: () => nav("room-assignment", "Room Assignment") }
                  : opens("check-in") && { label: "Check in", run: () => nav("check-in", "Check-In", a.id) }} />; })}
          </CardRail>
          {/* Only guests who need something today, so the row stays short in a big hotel; everyone else is one tap away. */}
          <CardRail title="Staying, needs something" count={staying.length} empty="Nobody staying needs anything right now."
            more={opens("in-house-guests") ? { label: `View all ${STAYS.length - leavingToday().length} in house`, run: () => nav("in-house-guests", "In-House Guests") } : undefined}>
            {staying.slice(0, 12).map(s => <GuestCard key={s.id} name={s.guest} vip={s.vip} line={`Room ${s.room} · until ${s.checkout}`}
              tag={balanceOf(s) > 0 ? { label: `Owes ₦${balanceOf(s).toLocaleString()}`, good: false } : s.complaints ? { label: "Has a complaint", good: false } : s.notes?.length ? { label: `${s.notes.at(-1)!.kind}: ${s.notes.at(-1)!.text}`, good: false } : s.requests ? { label: `${s.requests} request${s.requests === 1 ? "" : "s"} open`, good: false } : { label: "VIP", good: true }}
              action={opens("folio") && { label: "Folio", run: () => nav("folio", "Folio", s.id) }} />)}
          </CardRail>
          <CardRail title="Leaving" count={leavingToday().length} empty="Nobody else leaves today.">
            {leavingToday().map(s => <GuestCard key={s.id} name={s.guest} vip={s.vip} line={`Room ${s.room} · by ${s.checkoutTime}`}
              tag={balanceOf(s) > 0 ? { label: `Owes ₦${balanceOf(s).toLocaleString()}`, good: false } : { label: "Paid up", good: true }}
              action={opens("check-out") && { label: "Check out", run: () => nav("check-out", "Check-Out", s.id) }} />)}
          </CardRail>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Needs attention</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Exceptions affecting today’s service.</p></div>
          <div>
            {frontOfficeExceptions().map((item, index) => (
              <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}>
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div>
                {opens(item.screen) && <button onClick={() => nav(item.screen, item.screenLabel, item.navParam)} className="mt-2 flex min-h-[32px] items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button>}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.filter(action => opens(action.screen)).map((action, index) => index === 0
            ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} />
            : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Front Office toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {department.screens.flatMap(group => group.items.filter(item => opens(item.screen)).map(item => ({ ...item, group: group.label }))).map(item => (
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
