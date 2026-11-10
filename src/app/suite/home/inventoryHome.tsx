import { useState, type ElementType } from "react";
import {
  ArrowRight, Buildings, CheckCircle, ClipboardText, CurrencyNgn, Package,
  Plus, ShoppingCart, Stack, Truck, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, display, mono,
} from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import {
  INVENTORY_EXCEPTIONS, INVENTORY_KPIS, REORDER_SUGGESTIONS,
} from "../../mock/inventoryHome";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "inventory")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const priorityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  High: { bg: "#FFFBEB", text: "#B45309" },
  Normal: { bg: BG, text: MUTED },
};

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function InventoryHome({ nav }: { nav: Nav }) {
  const [viewState, setViewState] = useState<ViewState>("Ready");
  const quickActions: Array<{ label: string; icon: ElementType; screen: Screen }> = [
    { label: "New purchase order", icon: Plus, screen: "purchase-orders" },
    { label: "Receive delivery", icon: Truck, screen: "stock-transactions" },
    { label: "Stock count", icon: ClipboardText, screen: "stock-transactions" },
    { label: "Add product", icon: Package, screen: "products" },
  ];

  if (viewState === "Loading") return <div><PageHeader title="Inventory & Procurement" sub="Loading stock and purchasing operations…" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} />)}</div><div className="mt-5 h-80 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} /></div>;
  if (viewState === "Error") return <div><PageHeader title="Inventory & Procurement" sub="Stock and purchasing operations" /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={WarningCircle} message="Inventory data could not be loaded from the local server." cta="Try again" onCta={() => setViewState("Ready")} /></div></div>;
  if (viewState === "Empty") return <div><PageHeader title="Inventory & Procurement" sub="Stock and purchasing operations" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={CheckCircle} message="All stock is above reorder level and there are no pending procurement tasks." cta="Open stock dashboard" onCta={() => nav("stock-dashboard", "Stock Dashboard")} /></div></div>;

  return (
    <div>
      <PageHeader title="Inventory & Procurement command centre" sub="Today’s stock, supplier and purchasing operations." actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />
      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Package size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Inventory & Procurement</h1><Badge label="Stores synced" colors={{ bg: `${accent}12`, text: accent }} /></div><p className="mt-1 text-sm" style={{ color: MUTED }}>Keep every hotel department supplied while controlling purchasing cost and stock value.</p><div className="mt-3 flex flex-wrap gap-2"><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Finance" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Operations" colors={{ bg: BG, text: PRIMARY }} /></div></div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end"><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><Buildings size={14} style={{ color: accent }} />Grand Palms · Abuja</div><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 16 sec ago</div></div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...INVENTORY_KPIS[0]} icon={Package} accent={accent} />
        <StatCard {...INVENTORY_KPIS[1]} icon={ShoppingCart} accent={accent} />
        <StatCard {...INVENTORY_KPIS[2]} icon={CurrencyNgn} accent={accent} />
        <StatCard {...INVENTORY_KPIS[3]} icon={Truck} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary procurement flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Move low-stock items through purchasing, receipt and department issue.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">{flow.map((step, index) => <div key={`${step.screen}-${index}`} className="flex min-w-0 flex-1 items-center"><button onClick={() => nav(step.screen, step.label)} className="flex min-w-[145px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span></button>{index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}</div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Reorder suggestions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Sorted by stock risk · 17 items below level · updated 10:58</p></div><BtnO label="Purchase orders" icon={ShoppingCart} onClick={() => nav("purchase-orders", "Purchase Orders")} /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left">
            <thead><tr style={{ backgroundColor: BG }}>{["Product", "On hand", "Reorder level", "Suggested", "Supplier", "Last price", "Priority", "Action"].map(label => <th key={label} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
            <tbody>{REORDER_SUGGESTIONS.map(item => <tr key={`${item.branch}-${item.id}`} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
              <td className="px-4 py-3"><div className="max-w-[190px] truncate text-xs font-semibold" style={{ color: TEXT }}>{item.product}</div><div className="mt-0.5 text-[10px]" style={{ color: SUBTLE, fontFamily: mono }}>{item.id} · {item.branch}</div></td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: ERROR }}>{item.onHand} <span style={{ color: SUBTLE }}>{item.unit}</span></td>
              <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{item.reorderLevel}</td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: TEXT }}>{item.suggestedQty}</td>
              <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.supplier}</td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{item.lastPrice.toLocaleString("en-NG")}</td>
              <td className="px-4 py-3"><Badge label={item.priority} colors={priorityColors[item.priority]} /></td>
              <td className="px-4 py-3 text-right"><button onClick={() => nav("purchase-orders", "Purchase Orders")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>Create PO<ArrowRight size={12} /></button></td>
            </tr>)}</tbody>
          </table></div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Procurement exceptions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Cost, delivery and stock-control issues.</p></div>
          {INVENTORY_EXCEPTIONS.map((item, index) => <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div><button onClick={() => nav(item.screen, item.screenLabel)} className="mt-2 flex min-h-8 items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button></div>)}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}><h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2><div className="flex flex-wrap gap-2">{quickActions.map((action, index) => index === 0 ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} /> : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}</div></section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Inventory & Procurement toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{department.screens.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))).map(item => <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><Package size={19} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div><ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} /></button>)}</div>
      </section>
    </div>
  );
}
