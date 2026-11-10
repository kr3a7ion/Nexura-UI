import { useState, type ElementType } from "react";
import {
  ArrowRight, Bell, CalendarDots, CheckCircle, Clock, CookingPot, CurrencyNgn,
  ForkKnife, List, Plus, Receipt, ShoppingCart, SquaresFour, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, display, mono,
} from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import {
  RESTAURANT_EXCEPTIONS, RESTAURANT_KPIS, RESTAURANT_QUEUE,
  type RestaurantQueueItem,
} from "../../mock/restaurant-posHome";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "restaurant-pos")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const statusColors: Record<RestaurantQueueItem["status"], { bg: string; text: string }> = {
  New: { bg: "#EFF6FF", text: "#1D4ED8" },
  Preparing: { bg: `${accent}12`, text: accent },
  Ready: { bg: "#ECFDF5", text: SUCCESS },
  "Payment due": { bg: "#FFFBEB", text: "#B45309" },
};

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function RestaurantPosHome({ nav }: { nav: Nav }) {
  const [viewState, setViewState] = useState<ViewState>("Ready");
  const quickActions: Array<{ label: string; icon: ElementType; screen: Screen }> = [
    { label: "New order", icon: ShoppingCart, screen: "pos-terminal" },
    { label: "Open kitchen display", icon: CookingPot, screen: "kitchen-display" },
    { label: "Cash drawer", icon: CurrencyNgn, screen: "cash-drawer" },
    { label: "Menu management", icon: List, screen: "menu-management" },
  ];

  if (viewState === "Loading") return <div><PageHeader title="Restaurant & POS" sub="Loading outlet operations…" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} />)}</div><div className="mt-5 h-80 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} /></div>;
  if (viewState === "Error") return <div><PageHeader title="Restaurant & POS" sub="Outlet, kitchen and settlement operations" /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={WarningCircle} message="Restaurant data could not be loaded from the local server." cta="Try again" onCta={() => setViewState("Ready")} /></div></div>;
  if (viewState === "Empty") return <div><PageHeader title="Restaurant & POS" sub="Outlet, kitchen and settlement operations" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={ForkKnife} message="There are no open tables, kitchen orders or room-service requests." cta="Open POS" onCta={() => nav("pos-terminal", "POS Terminal")} /></div></div>;

  return (
    <div>
      <PageHeader title="Restaurant & POS command centre" sub="Today’s dining, kitchen, room-service and settlement operations." actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />
      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><ForkKnife size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Restaurant & POS</h1><Badge label="Outlets live" colors={{ bg: `${accent}12`, text: accent }} /></div><p className="mt-1 text-sm" style={{ color: MUTED }}>Coordinate tables, kitchen tickets, room service and every guest payment.</p><div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Restaurant" colors={{ bg: BG, text: PRIMARY }} /></div></div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end"><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><ForkKnife size={14} style={{ color: accent }} />Grand Palms · Abuja</div><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />POS synced 6 sec ago</div></div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...RESTAURANT_KPIS[0]} icon={CurrencyNgn} accent={accent} />
        <StatCard {...RESTAURANT_KPIS[1]} icon={SquaresFour} accent={accent} />
        <StatCard {...RESTAURANT_KPIS[2]} icon={Receipt} accent={accent} />
        <StatCard {...RESTAURANT_KPIS[3]} icon={Bell} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary service flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Move guests from reservation and seating through preparation and settlement.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">{flow.map((step, index) => <div key={step.screen} className="flex min-w-0 flex-1 items-center"><button onClick={() => nav(step.screen, step.label)} className="flex min-w-[142px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span></button>{index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}</div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Open tables & room service</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>3 open tables · 2 room-service orders · updated 10:51</p></div><BtnO label="Kitchen display" icon={CookingPot} onClick={() => nav("kitchen-display", "Kitchen Display")} /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left">
            <thead><tr style={{ backgroundColor: BG }}>{["Order", "Guest / table", "Items", "Server", "Elapsed", "Total", "Status", ""].map(label => <th key={label} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
            <tbody>{RESTAURANT_QUEUE.map(item => <tr key={item.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
              <td className="px-4 py-3"><div className="text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{item.id}</div><div className="mt-0.5 text-[10px]" style={{ color: SUBTLE }}>{item.outlet} · {item.branch}</div></td>
              <td className="px-4 py-3"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.guest}</div><div className="mt-0.5 text-[10px]" style={{ color: SUBTLE }}>{item.table}</div></td>
              <td className="max-w-[210px] px-4 py-3"><div className="truncate text-xs" style={{ color: MUTED }}>{item.order}</div></td>
              <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{item.server}</td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: item.elapsed.startsWith("2") || item.elapsed.startsWith("3") ? ERROR : TEXT, fontFamily: mono }}>{item.elapsed}</td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{item.total.toLocaleString("en-NG")}</td>
              <td className="px-4 py-3"><Badge label={item.status} colors={statusColors[item.status]} /></td>
              <td className="px-4 py-3 text-right"><button onClick={() => nav(item.outlet === "Room service" ? "room-service" : item.status === "Payment due" ? "pos-terminal" : "kitchen-display", item.outlet === "Room service" ? "Room Service Orders" : item.status === "Payment due" ? "POS Terminal" : "Kitchen Display")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>{item.status === "Payment due" ? "Settle" : "Open"}<ArrowRight size={12} /></button></td>
            </tr>)}</tbody>
          </table></div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Service exceptions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Items affecting speed, posting or settlement.</p></div>
          {RESTAURANT_EXCEPTIONS.map((item, index) => <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div><button onClick={() => nav(item.screen, item.screenLabel)} className="mt-2 flex min-h-8 items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button></div>)}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}><h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2><div className="flex flex-wrap gap-2">{quickActions.map((action, index) => index === 0 ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} /> : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}</div></section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Restaurant & POS toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{department.screens.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))).map(item => <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><ForkKnife size={19} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div><ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} /></button>)}</div>
      </section>
    </div>
  );
}
