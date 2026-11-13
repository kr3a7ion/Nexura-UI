import { useState, type ElementType } from "react";
import {
  ArrowRight, Buildings, Chat, CheckCircle, ClipboardText, Clock, Envelope,
  Megaphone, Users, WarningCircle,
} from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import {
  BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, display, mono,
} from "../../constants";
import { Badge, BtnO, BtnP, EmptyState, PageHeader, Sel, StatCard } from "../../UIKit";
import {
  COMMUNICATIONS_EXCEPTIONS, COMMUNICATIONS_KPIS, GUEST_CARE_QUEUE,
  type GuestCareQueueItem,
} from "../../mock/communicationsHome";
import { DEPARTMENTS } from "../departments";

const department = DEPARTMENTS.find(item => item.id === "communications")!;
const accent = department.accent;
const flow = department.flow;

type Nav = (screen: Screen, label: string, param?: string) => void;
type ViewState = "Ready" | "Loading" | "Empty" | "Error";

const statusColors: Record<GuestCareQueueItem["status"], { bg: string; text: string }> = {
  Unread: { bg: "#FEF2F2", text: ERROR },
  Assigned: { bg: "#EFF6FF", text: "#1D4ED8" },
  "In progress": { bg: `${accent}12`, text: accent },
  "Waiting guest": { bg: "#FFFBEB", text: "#B45309" },
};

const severityColors = {
  Critical: { bg: "#FEF2F2", text: ERROR },
  High: { bg: "#FFFBEB", text: "#B45309" },
  Normal: { bg: BG, text: MUTED },
  Warning: { bg: "#FFFBEB", text: "#B45309" },
  Info: { bg: "#EFF6FF", text: "#1D4ED8" },
};

export default function CommunicationsHome({ nav }: { nav: Nav }) {
  const [viewState, setViewState] = useState<ViewState>("Ready");
  const quickActions: Array<{ label: string; icon: ElementType; screen: Screen }> = [
    { label: "Send announcement", icon: Megaphone, screen: "announcements" },
    { label: "Start handover", icon: ClipboardText, screen: "shift-handover" },
    { label: "Open internal chat", icon: Chat, screen: "internal-chat" },
    { label: "Complaint dashboard", icon: WarningCircle, screen: "complaint-dashboard" },
  ];

  if (viewState === "Loading") return <div><PageHeader title="Communications & Guest Care" sub="Loading guest-care operations…" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} />)}</div><div className="mt-5 h-80 animate-pulse rounded-2xl border bg-white" style={{ borderColor: BORDER }} /></div>;
  if (viewState === "Error") return <div><PageHeader title="Communications & Guest Care" sub="Guest messages, complaints and shift continuity" /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={WarningCircle} message="Guest-care data could not be loaded from the local server." cta="Try again" onCta={() => setViewState("Ready")} /></div></div>;
  if (viewState === "Empty") return <div><PageHeader title="Communications & Guest Care" sub="Guest messages, complaints and shift continuity" actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} /><div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={CheckCircle} message="There are no unread messages, open complaints or pending handover items." cta="Open guest messaging" onCta={() => nav("guest-messaging", "Guest Messaging")} /></div></div>;

  return (
    <div>
      <PageHeader title="Communications & Guest Care" sub="Today’s guest messages, complaints and shift-continuity operations." actions={<Sel value={viewState} onChange={event => setViewState(event.target.value as ViewState)} options={["Ready", "Loading", "Empty", "Error"]} />} />
      <section className="mb-5 flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center" style={{ borderColor: BORDER }}>
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}><Chat size={27} weight="duotone" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Communications & Guest Care</h1><Badge label="Guest channels live" colors={{ bg: `${accent}12`, text: accent }} /></div><p className="mt-1 text-sm" style={{ color: MUTED }}>Keep every guest request visible, owned and resolved across departments and shifts.</p><div className="mt-3 flex flex-wrap gap-2"><Badge label="All staff" colors={{ bg: BG, text: PRIMARY }} /><Badge label="Manager" colors={{ bg: BG, text: PRIMARY }} /></div></div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end"><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}><Buildings size={14} style={{ color: accent }} />Grand Palms · Abuja</div><div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#A7F3D0", backgroundColor: "#ECFDF5", color: SUCCESS }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Synced 7 sec ago</div></div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard {...COMMUNICATIONS_KPIS[0]} icon={Envelope} accent={accent} />
        <StatCard {...COMMUNICATIONS_KPIS[1]} icon={WarningCircle} accent={accent} />
        <StatCard {...COMMUNICATIONS_KPIS[2]} icon={Clock} accent={accent} />
        <StatCard {...COMMUNICATIONS_KPIS[3]} icon={ClipboardText} accent={accent} />
      </section>

      <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>
        <div className="mb-4"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Primary guest-care flow</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Capture, assign, resolve and close each guest concern before shift handover.</p></div>
        <div className="flex items-center overflow-x-auto pb-1">{flow.map((step, index) => <div key={`${step.screen}-${index}`} className="flex min-w-0 flex-1 items-center"><button onClick={() => nav(step.screen, step.label)} className="flex min-w-[138px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm" style={{ borderColor: `${accent}35`, backgroundColor: index === 0 ? `${accent}0c` : "white" }}><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${accent}16`, color: accent }}>{index + 1}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{step.label}</span></button>{index < flow.length - 1 && <ArrowRight size={15} className="mx-2 flex-none" style={{ color: SUBTLE }} />}</div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><div><h2 className="text-sm font-bold" style={{ color: TEXT }}>Guest-care queue</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Messages and complaints sorted by severity · updated 11:06</p></div><BtnO label="Complaint dashboard" icon={WarningCircle} onClick={() => nav("complaint-dashboard", "Complaint Dashboard")} /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left">
            <thead><tr style={{ backgroundColor: BG }}>{["Guest", "Type", "Subject", "Department", "Age", "Severity", "Status", "Action"].map(label => <th key={label} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead>
            <tbody>{GUEST_CARE_QUEUE.map(item => <tr key={item.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
              <td className="px-4 py-3"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.guest}</div><div className="mt-0.5 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{item.id} · Room {item.room} · {item.branch}</div></td>
              <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{item.type}</td>
              <td className="max-w-[220px] px-4 py-3"><div className="truncate text-xs" style={{ color: MUTED }}>{item.subject}</div></td>
              <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{item.department}</td>
              <td className="px-4 py-3 text-xs font-semibold" style={{ color: item.severity === "Critical" ? ERROR : TEXT, fontFamily: mono }}>{item.age}</td>
              <td className="px-4 py-3"><Badge label={item.severity} colors={severityColors[item.severity]} /></td>
              <td className="px-4 py-3"><Badge label={item.status} colors={statusColors[item.status]} /></td>
              <td className="px-4 py-3 text-right"><button onClick={() => nav(item.type === "Message" ? "guest-messaging" : "complaint-management", item.type === "Message" ? "Guest Messaging" : "Complaint Management")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>Open<ArrowRight size={12} /></button></td>
            </tr>)}</tbody>
          </table></div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-bold" style={{ color: TEXT }}>Guest-care exceptions</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Response and handover risks requiring action.</p></div>
          {COMMUNICATIONS_EXCEPTIONS.map((item, index) => <div key={item.id} className="p-4" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-semibold" style={{ color: TEXT }}>{item.title}</div><p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{item.detail}</p></div><Badge label={item.severity} colors={severityColors[item.severity]} /></div><button onClick={() => nav(item.screen, item.screenLabel)} className="mt-2 flex min-h-8 items-center gap-1 text-xs font-semibold" style={{ color: accent }}>Open {item.screenLabel}<ArrowRight size={11} /></button></div>)}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}><h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Quick actions</h2><div className="flex flex-wrap gap-2">{quickActions.map((action, index) => index === 0 ? <BtnP key={action.label} label={action.label} icon={action.icon} color={accent} onClick={() => nav(action.screen, action.label)} /> : <BtnO key={action.label} label={action.label} icon={action.icon} onClick={() => nav(action.screen, action.label)} />)}</div></section>

      <section className="mt-5">
        <div className="mb-3"><h2 className="text-sm font-bold" style={{ color: TEXT }}>All screens in this app</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Complete Communications & Guest Care toolkit.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{department.screens.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))).map(item => <button key={`${item.group}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group flex min-h-20 items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}12`, color: accent }}><Chat size={19} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-1 text-xs uppercase tracking-wider" style={{ color: SUBTLE }}>{item.group}</div></div><ArrowRight size={13} className="flex-none transition-transform group-hover:translate-x-0.5" style={{ color: accent }} /></button>)}</div>
      </section>
    </div>
  );
}
