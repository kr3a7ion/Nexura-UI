import { useState } from "react";
import {
  ArrowRight, Check, DeviceMobile, Globe, PushPin, Shield, SquaresFour,
} from "@phosphor-icons/react";
import type { Role, Screen } from "../constants";
import { BG, BORDER, ERROR, MUTED, PRIMARY, SUBTLE, SUCCESS, TEXT, WARNING, display } from "../constants";
import { Badge, EmptyState, PageHeader, StatCard } from "../UIKit";
import { DEPARTMENT_HOME } from "../mock/departmentHome";
import { HOME_TODAY } from "../mock/suiteHome";
import type { Department, DepartmentId } from "./departments";

const META: Record<DepartmentId, { description: string; live: string }> = {
  "front-office": { description: "Reservations, arrivals and every guest stay.", live: "12 arrivals" },
  "access-security": { description: "Room access, key cards and lock activity.", live: "42 locks online" },
  housekeeping: { description: "Room readiness, inspections and linen.", live: "8 rooms ready" },
  maintenance: { description: "Work orders, assets and preventive care.", live: "2 urgent" },
  "restaurant-pos": { description: "Tables, kitchen, POS and room service.", live: "3 open tables" },
  finance: { description: "Folios, audit, payments and accounting.", live: "Night audit due" },
  inventory: { description: "Stock, suppliers and purchase orders.", live: "5 low-stock items" },
  hr: { description: "People, shifts, attendance and payroll.", live: "4 on leave" },
  communications: { description: "Staff chat, guest messages and handovers.", live: "5 unread" },
  fleet: { description: "Dispatch, drivers, vehicles and fuel.", live: "3 trips active" },
  reports: { description: "Hotel performance and operating insights.", live: "6 live reports" },
  "it-system": { description: "Devices, users, backups and system health.", live: "All systems healthy" },
  "properties-settings": { description: "Branches, hotel setup and preferences.", live: "3 branches synced" },
};

const ROLE_LABELS: Record<Role, string> = {
  MGT: "Hotel Manager", FD: "Front Desk", HK: "Housekeeping", MX: "Maintenance",
  FIN: "Finance", RT: "Restaurant", RSV: "Reservations", IT: "IT Administrator",
  DRV: "Driver", FLT: "Fleet Supervisor",
};

type PortalId = "field-app" | "guest-access" | "org-portal" | "admin-console";

export function SuiteHome({
  staffName, role, departments, offline, pinned, onTogglePin, onOpenDepartment,
  onOpenScreen, onOpenPortal,
}: {
  staffName: string;
  role: Role;
  departments: Department[];
  offline: boolean;
  pinned: DepartmentId[];
  onTogglePin: (id: DepartmentId) => void;
  onOpenDepartment: (department: Department) => void;
  onOpenScreen: (screen: Screen, label: string) => void;
  onOpenPortal: (portal: PortalId) => void;
}) {
  const firstName = staffName.split(" ")[0];
  const [pinMessage, setPinMessage] = useState("");
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const today = now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" });
  const { stats, alerts } = HOME_TODAY[role];
  // Pinned departments come first, so a separate "Pinned" list is not needed.
  const ordered = [...departments].sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)));

  const togglePin = (department: Department) => {
    if (!pinned.includes(department.id) && pinned.length >= 6) {
      setPinMessage("You can pin up to 6 departments.");
      return;
    }
    setPinMessage("");
    onTogglePin(department.id);
  };

  const portals = [
    { id: "field-app" as const, label: "Field App", sub: "Tasks on a phone", icon: DeviceMobile, show: true },
    { id: "guest-access" as const, label: "Guest Portal", sub: "What guests see", icon: Globe, show: true },
    { id: "org-portal" as const, label: "Owner Portal", sub: "All branches", icon: SquaresFour, show: role === "MGT" },
    { id: "admin-console" as const, label: "Admin Console", sub: "Platform controls", icon: Shield, show: role === "MGT" || role === "IT" },
  ].filter(portal => portal.show);

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        sub={`${today} · ${ROLE_LABELS[role]} · Grand Palms Abuja`}
        actions={
          <div className="hidden items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-semibold md:flex" style={{ borderColor: BORDER, color: MUTED }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />
            Running on this hotel's server
            <span style={{ color: SUBTLE }}>·</span>
            <span style={{ color: offline ? "#92400E" : MUTED }}>{offline ? "Changes will sync later" : "All changes synced"}</span>
          </div>
        }
      />

      <section aria-label="Today" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(item => (
          <button key={item.label} onClick={() => onOpenScreen(item.screen, item.screenLabel)} className="group rounded-2xl border bg-white p-4 text-left transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1BA39C]" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: MUTED }}>{item.label}<ArrowRight size={14} className="opacity-0 transition group-hover:opacity-100" /></div>
            <div className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-[-0.02em]" style={{ color: TEXT, fontFamily: display }}>{item.value}</div>
            <div className="mt-0.5 text-xs" style={{ color: MUTED }}>{item.sub}</div>
          </button>
        ))}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>Needs attention</h2>
        <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          {alerts.length ? alerts.map((item, index) => (
            <button key={item.text} onClick={() => onOpenScreen(item.screen, item.screenLabel)} className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}>
              <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: item.tone === "error" ? ERROR : WARNING }} />
              <span className="min-w-0 flex-1 text-sm font-medium" style={{ color: TEXT }}>{item.text}</span>
              <span className="hidden w-28 flex-none text-xs sm:block" style={{ color: MUTED }}>{item.from}</span>
              <span className="hidden w-20 flex-none text-xs sm:block" style={{ color: MUTED }}>{item.since}</span>
              <Badge label={item.tone === "error" ? "Urgent" : "Check"} colors={item.tone === "error" ? { bg: "#FEE2E2", text: "#991B1B" } : { bg: "#FEF3C7", text: "#92400E" }} />
            </button>
          )) : <EmptyState icon={Check} message="Nothing is waiting on you right now." />}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>Your departments</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {role === "MGT" && (
            <button onClick={() => onOpenScreen("dashboard-mgmt", "Management Overview")} className="flex min-h-[72px] items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition hover:shadow-md" style={{ borderColor: BORDER }}>
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${PRIMARY}10`, color: PRIMARY }}><SquaresFour size={21} weight="duotone" /></span>
              <span className="min-w-0"><span className="block truncate text-sm font-bold" style={{ color: TEXT }}>Management Overview</span><span className="block truncate text-xs" style={{ color: MUTED }}>Occupancy, revenue, whole hotel</span></span>
            </button>
          )}
          {ordered.map(department => {
            const Icon = department.icon;
            const isPinned = pinned.includes(department.id);
            return (
              <div key={department.id} className="relative flex min-h-[72px] items-center rounded-2xl border bg-white transition hover:shadow-md" style={{ borderColor: BORDER }}>
                <button onClick={() => onOpenDepartment(department)} title={META[department.id].description} className="flex min-w-0 flex-1 items-center gap-3 self-stretch rounded-2xl p-3.5 pr-12 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1BA39C]">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${department.accent}14`, color: department.accent }}><Icon size={21} weight="duotone" /></span>
                  <span className="min-w-0"><span className="block truncate text-sm font-bold" style={{ color: TEXT }}>{department.name}</span><span className="block truncate text-xs" style={{ color: MUTED }}>{META[department.id].live}</span></span>
                </button>
                <button onClick={() => togglePin(department)} aria-label={isPinned ? `Unpin ${department.name}` : `Pin ${department.name}`} aria-pressed={isPinned} className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100" style={{ color: isPinned ? department.accent : SUBTLE }}><PushPin size={15} weight={isPinned ? "fill" : "regular"} /></button>
              </div>
            );
          })}
        </div>
        {pinMessage && <p className="mt-2 text-xs font-semibold" style={{ color: PRIMARY }}>{pinMessage}</p>}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>Other ways in</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {portals.map(portal => {
            const Icon = portal.icon;
            return <button key={portal.id} onClick={() => onOpenPortal(portal.id)} className="flex min-h-[60px] items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition hover:shadow-sm" style={{ borderColor: BORDER }}><span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: BG, color: MUTED }}><Icon size={18} /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold" style={{ color: TEXT }}>{portal.label}</span><span className="block truncate text-xs" style={{ color: MUTED }}>{portal.sub}</span></span></button>;
          })}
        </div>
      </section>
    </div>
  );
}

export function DepartmentHome({ department, nav }: { department: Department; nav: (screen: Screen, label: string) => void }) {
  const Icon = department.icon;
  const home = DEPARTMENT_HOME[department.id];
  return (
    <div>
      <PageHeader title={department.name} sub={home?.sub ?? "Department workspace"} />
      {home && (
        <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {home.stats.map(stat => <StatCard key={stat.label} {...stat} icon={Icon} accent={department.accent} />)}
        </section>
      )}
      {department.screens.map(group => (
        <section key={group.label} className="mb-5">
          <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>{group.label.charAt(0) + group.label.slice(1).toLowerCase()}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {group.items.map(item => (
              <button key={item.screen} onClick={() => nav(item.screen, item.label)} className="flex min-h-[64px] items-center gap-3 rounded-2xl border bg-white p-4 text-left transition hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1BA39C]" style={{ borderColor: BORDER }}>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${department.accent}14`, color: department.accent }}><Icon size={18} weight="duotone" /></span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ color: TEXT }}>{item.label}</span>
                <ArrowRight size={16} style={{ color: SUBTLE }} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
