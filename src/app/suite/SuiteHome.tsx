import { useState } from "react";
import {
  ArrowRight, Check, DeviceMobile, Globe, Lock, PushPin, Shield, SquaresFour,
} from "@phosphor-icons/react";
import type { Role, Screen } from "../constants";
import { BG, BORDER, MUTED, PRIMARY, SUBTLE, SUCCESS, TEAL, TEXT, display, mono } from "../constants";
import { Badge, EmptyState, PageHeader } from "../UIKit";
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
  const recent = departments.slice(0, 3);
  const pinnedDepartments = pinned.map(id => departments.find(department => department.id === id)).filter(Boolean) as Department[];
  const [pinMessage, setPinMessage] = useState("");

  const togglePin = (department: Department) => {
    if (!pinned.includes(department.id) && pinned.length >= 6) {
      setPinMessage("You can pin up to 6 departments.");
      return;
    }
    setPinMessage("");
    onTogglePin(department.id);
  };

  const portals = [
    { id: "field-app" as const, label: "Field App", sub: "Mobile tasks", icon: DeviceMobile, show: true },
    { id: "guest-access" as const, label: "Guest Portal", sub: "Guest self-service", icon: Globe, show: true },
    { id: "org-portal" as const, label: "Org Portal", sub: "Owner portfolio", icon: SquaresFour, show: role === "MGT" },
    { id: "admin-console" as const, label: "Admin Console", sub: "Platform controls", icon: Shield, show: role === "MGT" || role === "IT" },
  ].filter(portal => portal.show);

  return (
    <div>
      <PageHeader
        title={`Good morning, ${firstName}`}
        sub={`${ROLE_LABELS[role]} · Grand Palms Abuja`}
        actions={
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />
            Local server connected
            <span style={{ color: SUBTLE }}>·</span>
            <span style={{ color: offline ? MUTED : TEAL }}>{offline ? "Internet offline" : "Internet online"}</span>
          </div>
        }
      />

      <section>
        <div className="mb-3 flex items-end justify-between"><div><h2 className="text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>Your departments</h2><p className="mt-0.5 text-xs" style={{ color: MUTED }}>Everything your role needs, in one suite.</p></div><span className="text-xs" style={{ color: SUBTLE }}>{departments.length + (role === "MGT" ? 1 : 0)} apps</span></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {role === "MGT" && (
            <button onClick={() => onOpenScreen("dashboard-mgmt", "Management Overview")} className="group rounded-2xl border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: BORDER }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${PRIMARY}10`, color: PRIMARY }}><SquaresFour size={23} weight="duotone" /></div>
              <div className="text-sm font-bold" style={{ color: TEXT }}>Management Overview</div>
              <p className="mt-1 min-h-9 text-xs leading-relaxed" style={{ color: MUTED }}>Live occupancy, revenue and hotel-wide operations.</p>
              <div className="mt-4 flex items-center justify-between"><Badge label="Hotel overview" colors={{ bg: BG, text: PRIMARY }} /><ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" style={{ color: PRIMARY }} /></div>
            </button>
          )}
          {departments.map(department => {
            const Icon = department.icon;
            const isPinned = pinned.includes(department.id);
            return (
              <div key={department.id} className="group relative rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: BORDER }}>
                <button onClick={() => togglePin(department)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg opacity-60 transition hover:opacity-100" style={{ color: isPinned ? department.accent : SUBTLE, backgroundColor: isPinned ? `${department.accent}12` : "transparent" }} title={isPinned ? "Unpin" : "Pin to Suite Home"}><PushPin size={15} weight={isPinned ? "fill" : "regular"} /></button>
                <button onClick={() => onOpenDepartment(department)} className="w-full text-left">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${department.accent}14`, color: department.accent }}><Icon size={23} weight="duotone" /></div>
                  <div className="pr-8 text-sm font-bold" style={{ color: TEXT }}>{department.name}</div>
                  <p className="mt-1 min-h-9 text-xs leading-relaxed" style={{ color: MUTED }}>{META[department.id].description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge label={META[department.id].live} colors={{ bg: `${department.accent}12`, text: department.accent }} />
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" style={{ color: department.accent }} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        {pinMessage && <p className="mt-2 text-xs font-semibold" style={{ color: PRIMARY }}>{pinMessage}</p>}
      </section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold" style={{ color: TEXT }}>Pinned</h2><span className="text-xs" style={{ color: SUBTLE }}>{pinned.length}/6</span></div>
          <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
            {pinnedDepartments.length ? (
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ backgroundColor: BORDER }}>
                {pinnedDepartments.map(department => {
                  const Icon = department.icon;
                  return <button key={department.id} onClick={() => onOpenDepartment(department)} className="flex min-h-20 items-center gap-3 bg-white p-4 text-left hover:bg-slate-50"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${department.accent}12`, color: department.accent }}><Icon size={19} /></div><div><div className="text-sm font-semibold" style={{ color: TEXT }}>{department.name}</div><div className="mt-0.5 text-xs" style={{ color: MUTED }}>{META[department.id].live}</div></div></button>;
                })}
              </div>
            ) : <EmptyState icon={PushPin} message="Pin up to 6 departments for one-click access." />}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Recent</h2>
          <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
            {recent.map((department, index) => {
              const item = department.screens[0]?.items[0];
              const Icon = department.icon;
              return item && <button key={department.id} onClick={() => onOpenScreen(item.screen, item.label)} className="flex min-h-[68px] w-full items-center gap-3 px-4 text-left hover:bg-slate-50" style={{ borderTop: index ? `1px solid ${BORDER}` : undefined }}><div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${department.accent}12`, color: department.accent }}><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold" style={{ color: TEXT }}>{item.label}</div><div className="mt-0.5 text-xs" style={{ color: MUTED }}>{department.name}</div></div><span className="text-[10px]" style={{ color: SUBTLE, fontFamily: mono }}>Today</span></button>;
            })}
          </div>
        </section>
      </div>

      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT }}>Portals</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {portals.map(portal => {
            const Icon = portal.icon;
            return <button key={portal.id} onClick={() => onOpenPortal(portal.id)} className="flex items-center gap-3 rounded-2xl border bg-white p-4 text-left transition hover:shadow-sm" style={{ borderColor: BORDER }}><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: BG, color: PRIMARY }}><Icon size={19} /></div><div><div className="text-sm font-semibold" style={{ color: TEXT }}>{portal.label}</div><div className="mt-0.5 text-xs" style={{ color: MUTED }}>{portal.sub}</div></div></button>;
          })}
        </div>
      </section>
    </div>
  );
}

export function DepartmentHome({ department }: { department: Department }) {
  const Icon = department.icon;
  return (
    <div>
      <PageHeader title={department.name} sub="Department workspace" actions={<Badge label="Connected to local server" colors={{ bg: "#ECFDF5", text: SUCCESS }} />} />
      <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
        <EmptyState icon={Icon} message="Department home" />
      </div>
    </div>
  );
}
