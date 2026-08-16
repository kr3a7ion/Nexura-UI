// Batch 17 — IT Admin & Devices (7 screens)
// UserManagement, SystemHealth, SchemaUpdateStatus, DeviceManagement,
// BackupRestore, AuditLog, ErrorLog
import { useState } from "react";
import {
  Users, Shield, Server, HardDrive, Activity, Database,
  Cpu, Wifi, WifiOff, CheckCircle2, AlertTriangle, XCircle,
  Clock, Download, Upload, RefreshCw, Plus, Search, Filter,
  Edit3, Trash2, Lock, Unlock, Eye, EyeOff, MoreHorizontal,
  Smartphone, Tablet, Monitor, Printer, Radio, Key,
  RotateCcw, Archive, FileText, Terminal, ChevronDown, ChevronRight,
  AlertCircle, Info, Zap, Globe, Layers, Package, Box,
  UserX, UserCheck, Mail, ShieldAlert, ShieldCheck,
  BatteryFull, BatteryLow, BatteryMedium, BatteryWarning,
  MapPin, CalendarDays, ArrowUpRight, ArrowDownRight,
  TriangleAlert,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { type Toast, mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE } from "./constants";
import { Badge, StatCard, PageHeader, BtnP, BtnO, Inp } from "./UIKit";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const PILL = {
  active:   { bg: "#DCFCE7", text: "#166534" },
  inactive: { bg: "#F1F5F9", text: "#64748B" },
  locked:   { bg: "#FEE2E2", text: "#991B1B" },
  idle:     { bg: "#FEF3C7", text: "#92400E" },
  offline:  { bg: "#F1F5F9", text: "#64748B" },
  lost:     { bg: "#FEE2E2", text: "#991B1B" },
  retired:  { bg: "#F1F5F9", text: "#475569" },
  ok:       { bg: "#DCFCE7", text: "#166534" },
  warning:  { bg: "#FEF3C7", text: "#92400E" },
  critical: { bg: "#FEE2E2", text: "#991B1B" },
  pending:  { bg: "#EFF6FF", text: "#1D4ED8" },
  resolved: { bg: "#DCFCE7", text: "#166534" },
  open:     { bg: "#FEE2E2", text: "#991B1B" },
};

type PillKey = keyof typeof PILL;
function Pill({ label, type }: { label: string; type: PillKey }) {
  const c = PILL[type] ?? PILL.inactive;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: c.bg, color: c.text }}>{label}</span>;
}

function TH({ cols }: { cols: string[] }) {
  return (
    <tr style={{ backgroundColor: "#F9FAFB" }}>
      {cols.map((c, i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c}</th>)}
    </tr>
  );
}

function PinInput({ onConfirm }: { onConfirm: (pin: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2 items-center">
      <input type="password" maxLength={4} value={v} onChange={e => setV(e.target.value)} placeholder="Manager PIN" className="w-28 px-2 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER, fontFamily: mono }} />
      <button onClick={() => { if (v === "1234") onConfirm(v); else setV(""); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Confirm</button>
    </div>
  );
}

// ─── 1. UserManagement ────────────────────────────────────────────────────────
const USERS_DATA = [
  { id:"USR-001", name:"Adaeze Okonkwo",        email:"manager@grandpalms.ng",     role:"MGT", dept:"Management",   branch:"Grand Palms Abuja", status:"active",   mfa:true,  lastLogin:"Today 08:14",  failed:0, locked:false },
  { id:"USR-002", name:"Emeka Nwosu",            email:"frontdesk@grandpalms.ng",   role:"FD",  dept:"Front Desk",   branch:"Grand Palms Abuja", status:"active",   mfa:false, lastLogin:"Today 07:58",  failed:0, locked:false },
  { id:"USR-003", name:"Fatima Al-Hassan",       email:"housekeeper@grandpalms.ng", role:"HK",  dept:"Housekeeping", branch:"Grand Palms Abuja", status:"active",   mfa:false, lastLogin:"Today 07:31",  failed:0, locked:false },
  { id:"USR-004", name:"Chukwubuike Eze",        email:"maintenance@grandpalms.ng", role:"MX",  dept:"Maintenance",  branch:"Grand Palms Abuja", status:"active",   mfa:true,  lastLogin:"Yesterday",    failed:0, locked:false },
  { id:"USR-005", name:"Ngozi Iweala-Obi",       email:"finance@grandpalms.ng",     role:"FIN", dept:"Finance",      branch:"Grand Palms Abuja", status:"active",   mfa:true,  lastLogin:"Today 09:02",  failed:0, locked:false },
  { id:"USR-006", name:"Musa Abdullahi",         email:"restaurant@grandpalms.ng",  role:"RT",  dept:"F&B",          branch:"Grand Palms Abuja", status:"active",   mfa:false, lastLogin:"Today 06:45",  failed:0, locked:false },
  { id:"USR-007", name:"Bola Adekunle",          email:"bola@grandpalms.ng",        role:"FD",  dept:"Front Desk",   branch:"Grand Palms Abuja", status:"inactive", mfa:false, lastLogin:"14 Oct 2025",  failed:0, locked:false },
  { id:"USR-008", name:"Seun Fadahunsi",         email:"seun@grandpalms.ng",        role:"FD",  dept:"Front Desk",   branch:"Grand Palms Abuja", status:"locked",   mfa:false, lastLogin:"12 Oct 2025",  failed:5, locked:true  },
];

const ROLE_LABELS: Record<string, string> = { MGT:"Manager", FD:"Front Desk", HK:"Housekeeping", MX:"Maintenance", FIN:"Finance", RT:"Restaurant", RSV:"Reservations", IT:"IT" };

export function UserManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [users, setUsers] = useState(USERS_DATA);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState("FD");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState<{ uid: string; action: "deactivate" | "unlock" | "force-pw" | "reset-mfa" } | null>(null);
  const [invite, setInvite] = useState({ name: "", email: "", role: "FD" });

  const filtered = users.filter(u =>
    !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  const doAction = (uid: string, action: typeof pinTarget extends null ? never : typeof pinTarget["action"]) => {
    setPinTarget({ uid, action });
  };

  const confirmAction = () => {
    if (!pinTarget) return;
    const { uid, action } = pinTarget;
    setUsers(prev => prev.map(u => {
      if (u.id !== uid) return u;
      if (action === "deactivate") return { ...u, status: "inactive" };
      if (action === "unlock")     return { ...u, locked: false, failed: 0, status: "active" };
      return u;
    }));
    add({ type: "success", title: `Action applied`, body: `${action} completed for user.` });
    setPinTarget(null);
  };

  const doBulkRole = () => {
    if (!selected.length) return;
    setUsers(prev => prev.map(u => selected.includes(u.id) ? { ...u, role: bulkRole } : u));
    add({ type: "success", title: `Role updated`, body: `${selected.length} user(s) set to ${ROLE_LABELS[bulkRole]}.` });
    setSelected([]);
  };

  const doInvite = () => {
    if (!invite.name || !invite.email) return;
    add({ type: "success", title: "Invitation sent", body: `${invite.email} invited as ${ROLE_LABELS[invite.role]}.` });
    setInviteOpen(false);
    setInvite({ name: "", email: "", role: "FD" });
  };

  return (
    <div>
      <PageHeader title="User Management" sub="Staff accounts, roles, MFA, and access control"
        actions={<BtnP label="Invite User" icon={Plus} onClick={() => setInviteOpen(true)} />}
      />

      {/* Invite panel */}
      {inviteOpen && (
        <div className="mb-5 p-4 bg-white rounded-xl border" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Invite New User</div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <Inp label="Full Name" placeholder="e.g. Emeka Chukwu" defaultValue={invite.name} />
            <Inp label="Email" placeholder="user@hotel.ng" type="email" defaultValue={invite.email} />
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Role</div>
              <select className="w-full px-2 py-2 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }}
                value={invite.role} onChange={e => setInvite(p => ({ ...p, role: e.target.value }))}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <BtnP label="Send Invite" icon={Mail} onClick={doInvite} />
              <BtnO label="Cancel" onClick={() => setInviteOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mb-3 px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs" style={{ backgroundColor: "#EFF6FF", border: `1px solid #BFDBFE` }}>
          <span style={{ color: PRIMARY }}><strong>{selected.length}</strong> selected</span>
          <span style={{ color: MUTED }}>Bulk role change:</span>
          <select value={bulkRole} onChange={e => setBulkRole(e.target.value)} className="px-2 py-1 border rounded-lg outline-none text-xs" style={{ borderColor: BORDER }}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <BtnP label="Apply" onClick={doBulkRole} />
          <button onClick={() => setSelected([])} className="ml-auto text-xs" style={{ color: MUTED }}>Clear</button>
        </div>
      )}

      {/* PIN confirmation modal */}
      {pinTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
          <div className="bg-white rounded-2xl p-6 w-80" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Manager authorisation required</div>
            <div className="text-xs mb-4" style={{ color: MUTED }}>Action: <strong>{pinTarget.action}</strong> on user {pinTarget.uid}</div>
            <PinInput onConfirm={confirmAction} />
            <button onClick={() => setPinTarget(null)} className="mt-3 text-xs" style={{ color: MUTED }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email…" className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Users"    value={String(users.length)}                         sub="All branches" icon={Users}      accent={PRIMARY} />
        <StatCard label="Active"         value={String(users.filter(u => u.status==="active").length)}   sub="Currently active" icon={UserCheck} accent={SUCCESS} />
        <StatCard label="MFA Enrolled"   value={String(users.filter(u => u.mfa).length)}       sub={`of ${users.length} users`}   icon={ShieldCheck} accent={TEAL}    />
        <StatCard label="Locked"         value={String(users.filter(u => u.locked).length)}   sub="Failed logins" icon={ShieldAlert} accent={ERROR}  />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              <th className="px-3 py-2.5 w-8"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(u => u.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} /></th>
              {["User", "Role", "Department", "Status", "MFA", "Last Login", "Actions"].map(c => (
                <th key={c} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t hover:bg-slate-50" style={{ borderColor: BORDER }}>
                <td className="px-3 py-2.5">
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={e => setSelected(p => e.target.checked ? [...p, u.id] : p.filter(x => x !== u.id))} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{u.name}</div>
                  <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{u.email}</div>
                </td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{ROLE_LABELS[u.role]}</span></td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{u.dept}</td>
                <td className="px-3 py-2.5"><Pill label={u.locked ? "Locked" : u.status} type={u.locked ? "locked" : u.status as PillKey} /></td>
                <td className="px-3 py-2.5">
                  {u.mfa
                    ? <span className="flex items-center gap-1 text-xs" style={{ color: SUCCESS }}><ShieldCheck size={12} /> Enabled</span>
                    : <span className="flex items-center gap-1 text-xs" style={{ color: SUBTLE }}><ShieldAlert size={12} /> Off</span>}
                </td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED, fontFamily: mono }}>{u.lastLogin}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5 flex-wrap">
                    <button onClick={() => add({ type: "info", title: "Edit role", body: `Editing ${u.name}` })} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: MUTED }} title="Edit role"><Edit3 size={11} /></button>
                    {u.locked && <button onClick={() => doAction(u.id, "unlock")} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: SUCCESS }} title="Unlock"><Unlock size={11} /></button>}
                    <button onClick={() => doAction(u.id, "force-pw")} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: WARNING }} title="Force password change"><Key size={11} /></button>
                    <button onClick={() => doAction(u.id, "reset-mfa")} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: ORANGE }} title="Reset MFA"><Shield size={11} /></button>
                    {u.status === "active" && <button onClick={() => doAction(u.id, "deactivate")} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: ERROR }} title="Deactivate"><UserX size={11} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-10 text-center text-xs" style={{ color: SUBTLE }}>No users match your search.</div>}
      </div>
    </div>
  );
}

// ─── 2. SystemHealth ──────────────────────────────────────────────────────────
const LATENCY_DATA = [
  { t: "09:00", ms: 42 }, { t: "09:10", ms: 38 }, { t: "09:20", ms: 55 },
  { t: "09:30", ms: 47 }, { t: "09:40", ms: 62 }, { t: "09:50", ms: 44 },
  { t: "10:00", ms: 39 }, { t: "10:10", ms: 41 },
];
const ERR_DATA = [
  { t: "09:00", n: 0 }, { t: "09:10", n: 1 }, { t: "09:20", n: 0 },
  { t: "09:30", n: 2 }, { t: "09:40", n: 0 }, { t: "09:50", n: 0 },
  { t: "10:00", n: 1 }, { t: "10:10", n: 0 },
];

function HealthBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: TEXT }}>{label}</span><span className="font-bold" style={{ color, fontFamily: mono }}>{pct}%</span></div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ServiceCheck({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b last:border-b-0" style={{ borderColor: BORDER }}>
      <div>
        <div className="text-xs font-semibold" style={{ color: TEXT }}>{label}</div>
        <div className="text-xs" style={{ color: MUTED }}>{detail}</div>
      </div>
      {ok
        ? <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle2 size={13} /> OK</span>
        : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: ERROR }}><XCircle size={13} /> Down</span>}
    </div>
  );
}

export function SystemHealth({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [checking, setChecking] = useState(false);

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); add({ type: "success", title: "Health check complete", body: "All services nominal." }); }, 1800);
  };

  return (
    <div>
      <PageHeader title="System Health" sub="Server status, resources, and service checks"
        actions={
          <BtnO label={checking ? "Checking…" : "Run Check"} icon={RefreshCw} onClick={runCheck} />
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Uptime"         value="99.97%"  sub="Last 30 days"        icon={Activity}  accent={SUCCESS} />
        <StatCard label="DB Size"        value="2.4 GB"  sub="WAL: 180 MB"         icon={Database}  accent={PRIMARY} />
        <StatCard label="Connections"    value="14 / 50" sub="Active DB sessions"   icon={Layers}    accent={TEAL}    />
        <StatCard label="Error Rate"     value="0.04%"   sub="Last 1 hour"         icon={AlertCircle} accent={WARNING} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Resources */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Resource Utilisation</div>
          <HealthBar label="CPU" pct={38} color={SUCCESS} />
          <HealthBar label="Memory" pct={61} color={TEAL} />
          <HealthBar label="Disk (Free: 47.2 GB)" pct={53} color={53 > 85 ? ERROR : 53 > 70 ? WARNING : PRIMARY} />
          <div className="mt-4 pt-3 border-t text-xs space-y-1.5" style={{ borderColor: BORDER }}>
            {[["Request latency (avg)", "44 ms"], ["Request latency (p95)", "112 ms"], ["Requests / min", "38"], ["Active sessions", "6"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>{v}</span></div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Request Latency (ms)</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={LATENCY_DATA} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}ms`]} />
              <Line type="monotone" dataKey="ms" stroke={PRIMARY} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-sm font-semibold mt-3 mb-2" style={{ color: TEXT }}>Errors / 10 min</div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={ERR_DATA} margin={{ left: -20 }}>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="n" stroke={ERROR} fill={`${ERROR}20`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service checks */}
      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Service Checks</div>
        </div>
        <ServiceCheck label="Database" detail="PostgreSQL 15.4 — writable, replication OK" ok={true} />
        <ServiceCheck label="Lock Provider" detail="Dormakaba DCOM — gateway reachable, 68 locks online" ok={true} />
        <ServiceCheck label="Central Sync Server" detail="api.nexura.ng — last ping 12s ago" ok={true} />
        <ServiceCheck label="Thermal Printer" detail="Receipt printer (192.168.1.45) — online, paper OK" ok={true} />
        <ServiceCheck label="Folio Printer" detail="Network printer (192.168.1.46) — offline" ok={false} />
      </div>

      {/* Recent errors */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Recent Error Log Entries</div>
        </div>
        {[
          { ts: "10:09:41", sev: "WARN",  module: "sync",    msg: "Central sync response delayed 3.2s — retrying" },
          { ts: "09:41:18", sev: "ERROR", module: "printer",  msg: "Folio printer (192.168.1.46) connection refused" },
          { ts: "09:32:05", sev: "WARN",  module: "auth",    msg: "Failed login attempt — user seun@grandpalms.ng (attempt 5/5 — account locked)" },
        ].map((e, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b last:border-b-0" style={{ borderColor: BORDER }}>
            <span className="text-xs mt-0.5 font-semibold w-16 shrink-0" style={{ fontFamily: mono, color: e.sev === "ERROR" ? ERROR : WARNING }}>{e.sev}</span>
            <span className="text-xs shrink-0 w-16" style={{ color: MUTED, fontFamily: mono }}>{e.ts}</span>
            <span className="text-xs shrink-0 w-16 px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9", color: MUTED }}>{e.module}</span>
            <span className="text-xs" style={{ color: TEXT }}>{e.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. SchemaUpdateStatus ────────────────────────────────────────────────────
const MIGRATIONS = [
  { id: "m_20251001_001", desc: "Add complaint_category index",          applied: "01 Oct 2025 02:14", status: "applied", snapshot: "snap_20251001_0200" },
  { id: "m_20250915_002", desc: "Add leave_requests table",              applied: "15 Sep 2025 02:11", status: "applied", snapshot: "snap_20250915_0200" },
  { id: "m_20250901_001", desc: "Add folio_void_reason column",          applied: "01 Sep 2025 02:09", status: "applied", snapshot: "snap_20250901_0200" },
  { id: "m_20250815_001", desc: "Extend audit_log with device_id",       applied: "15 Aug 2025 02:07", status: "applied", snapshot: "snap_20250815_0200" },
];
const PENDING_MIGS = [
  { id: "m_20251101_001", desc: "Add fleet_vehicles table",   eta: "Next maintenance window" },
  { id: "m_20251101_002", desc: "Add guest_portal_tokens",    eta: "Next maintenance window" },
];
const UPDATE_HISTORY = [
  { version: "v2.14.1", date: "01 Oct 2025", ring: "Stable", result: "ok",   note: "Routine patch" },
  { version: "v2.14.0", date: "15 Sep 2025", ring: "Stable", result: "ok",   note: "Leave management module" },
  { version: "v2.13.2", date: "02 Sep 2025", ring: "Stable", result: "ok",   note: "Complaint dashboard" },
  { version: "v2.12.0", date: "01 Aug 2025", ring: "Beta",   result: "rolled-back", note: "Rolled back — printer regression" },
];

export function SchemaUpdateStatus({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const applyUpdate = () => {
    setApplying(true);
    setTimeout(() => { setApplying(false); add({ type: "success", title: "Update applied", body: "v2.15.0 installed. Pre-migration snapshot saved." }); }, 2200);
  };

  return (
    <div>
      <PageHeader title="Schema & App Update Status" sub="Database migrations, application version, and rollout management" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Schema status */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Database Schema</div>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#F0FDF4" }}>
            <CheckCircle2 size={20} style={{ color: SUCCESS }} />
            <div><div className="text-xs font-semibold" style={{ color: SUCCESS }}>Schema up to date</div><div className="text-xs" style={{ color: MUTED }}>Version: <span style={{ fontFamily: mono }}>schema_v42</span></div></div>
          </div>
          {PENDING_MIGS.length > 0 && (
            <div className="mb-4 p-3 rounded-xl border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "#92400E" }}>Pending migrations ({PENDING_MIGS.length})</div>
              {PENDING_MIGS.map(m => (
                <div key={m.id} className="text-xs mb-1" style={{ color: "#78350F" }}>
                  <span style={{ fontFamily: mono }}>{m.id}</span> — {m.desc} <span style={{ color: MUTED }}>({m.eta})</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>Applied Migrations</div>
          {MIGRATIONS.map(m => (
            <div key={m.id} className="flex items-start justify-between py-2 border-b last:border-b-0 cursor-pointer" style={{ borderColor: BORDER }} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
              <div>
                <div className="text-xs font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>{m.id}</div>
                <div className="text-xs" style={{ color: MUTED }}>{m.desc}</div>
                {expanded === m.id && <div className="mt-1 text-xs" style={{ color: SUBTLE }}>Applied: {m.applied} · Snapshot: <span style={{ fontFamily: mono }}>{m.snapshot}</span></div>}
              </div>
              <span className="text-xs" style={{ color: SUBTLE }}>{expanded === m.id ? "▲" : "▼"}</span>
            </div>
          ))}
        </div>

        {/* App version */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Application Version</div>
          <div className="space-y-2.5 mb-4">
            {[
              ["Current version",       "v2.14.1"],
              ["Image digest",          "sha256:a3f8c…d42e"],
              ["Signature verified",    "✓ Valid — Nexura Systems"],
              ["Available update",      "v2.15.0"],
              ["Rollout ring",          "Stable"],
              ["Last health-check",     "10:09 — PASSED"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span style={{ color: MUTED }}>{k}</span>
                <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl border mb-4" style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: PRIMARY }}>Update available: v2.15.0</div>
            <div className="text-xs mb-2" style={{ color: MUTED }}>Fleet operations module (Batch 19). Pre-migration snapshot will be created automatically before applying.</div>
            <BtnP label={applying ? "Applying…" : "Apply Update"} icon={Upload} onClick={applyUpdate} />
          </div>

          <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>Update History</div>
          <table className="w-full">
            <thead><TH cols={["Version", "Date", "Ring", "Result"]} /></thead>
            <tbody>
              {UPDATE_HISTORY.map(h => (
                <tr key={h.version} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-3 py-2 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{h.version}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: MUTED }}>{h.date}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: MUTED }}>{h.ring}</td>
                  <td className="px-3 py-2">
                    {h.result === "ok"
                      ? <span className="text-xs font-semibold" style={{ color: SUCCESS }}>OK</span>
                      : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: ERROR }}><RotateCcw size={11} /> Rolled back</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 4. DeviceManagement ──────────────────────────────────────────────────────
type DeviceClass = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type DeviceStatus = "active" | "idle" | "offline" | "lost" | "retired";

const CLASS_DESC: Record<DeviceClass, string> = {
  A: "Manager tablet",   B: "Front desk terminal",  C: "Handheld scanner",
  D: "HK mobile",        E: "Room kiosk",            F: "Maintenance PDA",
  G: "Staff shared",     H: "Print/peripheral",
};

const DEVICES = [
  { id:"DEV-001", name:"FD-Terminal-01",   cls:"B" as DeviceClass, type:"Desktop terminal",   assigned:"Front Desk",        branch:"Abuja",  enrolled:"14 Jan 2025", heartbeat:"2 min ago",  appVer:"v2.14.1", battery:null, os:"Ubuntu 22.04", status:"active" as DeviceStatus   },
  { id:"DEV-002", name:"MGT-iPad-01",      cls:"A" as DeviceClass, type:"iPad 10th gen",       assigned:"Adaeze Okonkwo",   branch:"Abuja",  enrolled:"14 Jan 2025", heartbeat:"5 min ago",  appVer:"v2.14.1", battery:82,   os:"iPadOS 17.6",  status:"active" as DeviceStatus   },
  { id:"DEV-003", name:"HK-Mobile-01",     cls:"D" as DeviceClass, type:"Android phone",       assigned:"Fatima Al-Hassan", branch:"Abuja",  enrolled:"20 Feb 2025", heartbeat:"8 min ago",  appVer:"v2.14.0", battery:34,   os:"Android 14",   status:"active" as DeviceStatus   },
  { id:"DEV-004", name:"Room-Kiosk-501",   cls:"E" as DeviceClass, type:"Kiosk tablet",        assigned:"Room 501",          branch:"Abuja",  enrolled:"01 Mar 2025", heartbeat:"1 min ago",  appVer:"v2.14.1", battery:null, os:"Android 14",   status:"active" as DeviceStatus   },
  { id:"DEV-005", name:"MX-PDA-01",        cls:"F" as DeviceClass, type:"Rugged PDA",          assigned:"Chukwubuike Eze",  branch:"Abuja",  enrolled:"15 Mar 2025", heartbeat:"22 min ago", appVer:"v2.14.0", battery:17,   os:"Android 13",   status:"idle" as DeviceStatus     },
  { id:"DEV-006", name:"Staff-Shared-01",  cls:"G" as DeviceClass, type:"Shared tablet",       assigned:"Front Desk pool",  branch:"Abuja",  enrolled:"01 Apr 2025", heartbeat:"47 min ago", appVer:"v2.13.2", battery:61,   os:"Android 14",   status:"idle" as DeviceStatus     },
  { id:"DEV-007", name:"HK-Mobile-02",     cls:"D" as DeviceClass, type:"Android phone",       assigned:"Unassigned",       branch:"Abuja",  enrolled:"10 May 2025", heartbeat:"3 hrs ago",  appVer:"v2.12.0", battery:0,    os:"Android 14",   status:"offline" as DeviceStatus  },
  { id:"DEV-008", name:"FD-Scanner-01",    cls:"C" as DeviceClass, type:"Barcode scanner",     assigned:"Front Desk",       branch:"Abuja",  enrolled:"14 Jan 2025", heartbeat:"Reported lost", appVer:"v2.14.0", battery:null, os:"n/a",        status:"lost" as DeviceStatus     },
];

function BatteryIcon({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-xs" style={{ color: SUBTLE }}>n/a</span>;
  const color = pct <= 15 ? ERROR : pct <= 30 ? WARNING : SUCCESS;
  const Icon = pct <= 15 ? BatteryWarning : pct <= 30 ? BatteryLow : pct <= 60 ? BatteryMedium : BatteryFull;
  return <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}><Icon size={13} />{pct}%</span>;
}

export function DeviceManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [devices, setDevices] = useState(DEVICES);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  const filtered = devices.filter(d =>
    (filterStatus === "all" || d.status === filterStatus) &&
    (!q || d.name.toLowerCase().includes(q.toLowerCase()) || d.assigned.toLowerCase().includes(q.toLowerCase()))
  );

  const sel = devices.find(d => d.id === selected);

  const doAction = (id: string, action: string) => {
    if (action === "mark-lost") {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, status: "lost" } : d));
      add({ type: "warning", title: "Device marked lost", body: "Session revoked. IT notified." });
    } else if (action === "retire") {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, status: "retired" } : d));
      add({ type: "info", title: "Device retired", body: "Device removed from active pool." });
    } else {
      add({ type: "info", title: action, body: `Action queued for ${id}.` });
    }
    setSelected(null);
  };

  return (
    <div>
      <PageHeader title="Device Management" sub="Enrolment, assignment, remote actions, and Class E kiosk control"
        actions={<BtnP label="Enrol Device" icon={Plus} onClick={() => setEnrollOpen(true)} />}
      />

      {enrollOpen && (
        <div className="mb-5 p-4 bg-white rounded-xl border" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Enrol New Device</div>
          <div className="flex items-center gap-6">
            <div className="flex-1 text-xs" style={{ color: MUTED }}>
              On the device, open the Nexura app → Settings → Enrolment → scan the QR code below, or enter the pairing code manually.
            </div>
            <div className="w-20 h-20 rounded-xl flex items-center justify-center border" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
              <span className="text-xs text-center" style={{ color: MUTED, fontFamily: mono }}>QR<br />code</span>
            </div>
            <div className="text-center">
              <div className="text-xs" style={{ color: MUTED }}>Pairing code</div>
              <div className="text-2xl font-bold" style={{ color: PRIMARY, fontFamily: mono }}>7X4-M2Q</div>
              <div className="text-xs" style={{ color: SUBTLE }}>Expires in 10 min</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <BtnO label="Regenerate Code" icon={RefreshCw} onClick={() => add({ type: "info", title: "New code generated" })} />
            <BtnO label="Close" onClick={() => setEnrollOpen(false)} />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {(["active","idle","offline","lost","retired"] as DeviceStatus[]).map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)} className="bg-white rounded-xl border p-3 text-left transition-colors" style={{ borderColor: filterStatus === s ? PRIMARY : BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-lg font-bold" style={{ color: filterStatus === s ? PRIMARY : TEXT }}>{devices.filter(d => d.status === s).length}</div>
            <div className="text-xs capitalize" style={{ color: MUTED }}>{s}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Device list */}
        <div className="lg:col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="px-4 py-3 border-b flex gap-2" style={{ borderColor: BORDER }}>
            <div className="flex-1 relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search device or assignment…" className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }} />
            </div>
          </div>
          <table className="w-full">
            <thead><TH cols={["Device", "Class", "Assigned", "Heartbeat", "Version", "Battery", "Status", ""]} /></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className={`border-t cursor-pointer hover:bg-slate-50 ${selected === d.id ? "bg-blue-50" : ""}`} style={{ borderColor: BORDER }} onClick={() => setSelected(selected === d.id ? null : d.id)}>
                  <td className="px-3 py-2.5">
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{d.name}</div>
                    <div className="text-xs" style={{ color: SUBTLE }}>{d.type}</div>
                  </td>
                  <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Class {d.cls}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{d.assigned}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: d.status === "offline" || d.status === "lost" ? ERROR : MUTED, fontFamily: mono }}>{d.heartbeat}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: d.appVer === "v2.14.1" ? MUTED : WARNING, fontFamily: mono }}>{d.appVer}</td>
                  <td className="px-3 py-2.5"><BatteryIcon pct={d.battery} /></td>
                  <td className="px-3 py-2.5"><Pill label={d.status} type={d.status} /></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{selected === d.id ? "▲" : "▼"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail / actions panel */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          {!sel ? (
            <div className="py-16 text-center">
              <Smartphone size={28} style={{ color: SUBTLE, margin: "0 auto 8px" }} />
              <div className="text-xs" style={{ color: SUBTLE }}>Select a device to view details and actions</div>
            </div>
          ) : (
            <>
              <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>{sel.name}</div>
              <div className="space-y-2 mb-4">
                {[
                  ["Class", `Class ${sel.cls} — ${CLASS_DESC[sel.cls]}`],
                  ["Type", sel.type],
                  ["OS", sel.os],
                  ["Enrolled", sel.enrolled],
                  ["Branch", sel.branch],
                  ["App version", sel.appVer],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span style={{ color: MUTED }}>{k}</span>
                    <span className="font-semibold text-right" style={{ color: TEXT }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>Actions</div>
              <div className="space-y-2">
                <button onClick={() => doAction(sel.id, "remote-lock")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50" style={{ borderColor: BORDER, color: WARNING }}><Lock size={13} /> Remote Lock</button>
                <button onClick={() => doAction(sel.id, "revoke-session")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50" style={{ borderColor: BORDER, color: ORANGE }}><Key size={13} /> Revoke Session</button>
                {sel.cls === "E" && <button onClick={() => add({ type: "info", title: "Kiosk reset queued", body: "Checkout-reset queued for next unlock." })} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50" style={{ borderColor: BORDER, color: PRIMARY }}><Monitor size={13} /> Reset Kiosk State</button>}
                {sel.status !== "lost" && <button onClick={() => doAction(sel.id, "mark-lost")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50" style={{ borderColor: BORDER, color: ERROR }}><AlertTriangle size={13} /> Mark as Lost</button>}
                {sel.status !== "retired" && <button onClick={() => doAction(sel.id, "retire")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50" style={{ borderColor: BORDER, color: MUTED }}><Archive size={13} /> Retire</button>}
                <button onClick={() => doAction(sel.id, "remote-wipe")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs hover:bg-slate-50 border-red-200" style={{ color: ERROR }}><Trash2 size={13} /> Remote Wipe</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 5. BackupRestore ─────────────────────────────────────────────────────────
const BACKUPS = [
  { id:"BK-2025-1014-01", ts:"14 Oct 2025 02:00", size:"2.4 GB", type:"Scheduled",     enc:true,  checksum:"ok",   location:"Local + Offsite", retention:"13 Nov 2025", restoreTest:"PASSED — 12 Oct" },
  { id:"BK-2025-1013-01", ts:"13 Oct 2025 02:00", size:"2.3 GB", type:"Scheduled",     enc:true,  checksum:"ok",   location:"Local + Offsite", retention:"12 Nov 2025", restoreTest:"PASSED — 11 Oct" },
  { id:"BK-2025-1001-02", ts:"01 Oct 2025 01:55", size:"2.1 GB", type:"Pre-migration", enc:true,  checksum:"ok",   location:"Local + Offsite", retention:"31 Dec 2025", restoreTest:"Not tested"      },
  { id:"BK-2025-0915-02", ts:"15 Sep 2025 01:52", size:"2.0 GB", type:"Pre-migration", enc:true,  checksum:"ok",   location:"Local",           retention:"14 Dec 2025", restoreTest:"PASSED — 15 Sep" },
  { id:"BK-2025-0901-01", ts:"01 Sep 2025 02:01", size:"1.9 GB", type:"Manual",        enc:true,  checksum:"fail", location:"Local",           retention:"30 Nov 2025", restoreTest:"FAILED — checksum mismatch" },
];

export function BackupRestore({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [backing, setBacking] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [pinFor, setPinFor] = useState<string | null>(null);

  const doBackupNow = () => {
    setBacking(true);
    setTimeout(() => { setBacking(false); add({ type: "success", title: "Backup complete", body: "BK-2025-1014-02 created. 2.4 GB, encrypted, offsite queued." }); }, 2000);
  };

  const startRestore = (id: string) => setPinFor(id);
  const confirmRestore = () => {
    if (!pinFor) return;
    setRestoring(pinFor);
    setPinFor(null);
    setTimeout(() => {
      setRestoring(null);
      add({ type: "success", title: "Restore complete", body: `Restored from ${pinFor}. Boot marker cleared. Service restarted.` });
    }, 3000);
  };

  return (
    <div>
      <PageHeader title="Backup & Restore" sub="Scheduled and manual backups, verification, and restore history"
        actions={<BtnP label={backing ? "Backing up…" : "Back Up Now"} icon={Archive} onClick={doBackupNow} />}
      />

      {restoring && (
        <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3 text-xs" style={{ backgroundColor: "#FEF3C7", border: `1px solid #FDE68A` }}>
          <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: `${WARNING}40`, borderTopColor: WARNING }} />
          <span style={{ color: "#92400E" }}>Restoring from <strong style={{ fontFamily: mono }}>{restoring}</strong> — do not power off…</span>
        </div>
      )}

      {/* PIN modal for restore */}
      {pinFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
          <div className="bg-white rounded-2xl p-6 w-96" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: ERROR }}>⚠ Restore confirmation</div>
            <div className="text-xs mb-2" style={{ color: MUTED }}>Restoring replaces the current database. The application will restart automatically. A boot marker is written to disk so you can verify the restore completed if power is lost mid-way.</div>
            <div className="text-xs mb-4 p-2 rounded-lg" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Backup: <span style={{ fontFamily: mono }}>{pinFor}</span></div>
            <PinInput onConfirm={confirmRestore} />
            <button onClick={() => setPinFor(null)} className="mt-3 text-xs" style={{ color: MUTED }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Config panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Schedule & Retention</div>
          <div className="space-y-2.5 text-xs">
            {[["Frequency", "Daily at 02:00"], ["Retention (scheduled)", "30 days"], ["Retention (pre-migration)", "90 days"], ["Retention (manual)", "60 days"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>
            ))}
          </div>
          <div className="mt-3"><BtnO label="Edit Schedule" icon={Edit3} onClick={() => add({ type: "info", title: "Edit backup schedule" })} /></div>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Offsite Target</div>
          <div className="space-y-2.5 text-xs">
            {[["Provider", "Nexura Cloud (ng-south-1)"], ["Last transfer", "Today 02:04"], ["Transfer status", "OK — all replicated"], ["Encryption", "AES-256, key managed locally"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold text-right" style={{ color: TEXT }}>{v}</span></div>
            ))}
          </div>
          <div className="mt-3"><BtnO label="Configure Offsite" icon={Globe} onClick={() => add({ type: "info", title: "Configure offsite target" })} /></div>
        </div>
      </div>

      {/* Backup table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Backup History</div>
        </div>
        <table className="w-full">
          <thead><TH cols={["Backup ID", "Timestamp", "Size", "Type", "Enc", "Checksum", "Location", "Restore Test", "Actions"]} /></thead>
          <tbody>
            {BACKUPS.map(b => (
              <tr key={b.id} className="border-t" style={{ borderColor: BORDER }}>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{b.id}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED, fontFamily: mono }}>{b.ts}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: TEXT }}>{b.size}</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: b.type === "Pre-migration" ? "#FEF3C7" : "#F1F5F9", color: b.type === "Pre-migration" ? "#92400E" : MUTED }}>{b.type}</span></td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUCCESS }}>{b.enc ? "✓" : "—"}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: b.checksum === "ok" ? SUCCESS : ERROR }}>{b.checksum === "ok" ? "OK" : "FAIL"}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{b.location}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: b.restoreTest.startsWith("PASSED") ? SUCCESS : b.restoreTest.startsWith("FAILED") ? ERROR : MUTED }}>{b.restoreTest}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    <button onClick={() => add({ type: "info", title: "Verifying…", body: `Checksum check queued for ${b.id}.` })} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: MUTED }} title="Verify"><CheckCircle2 size={11} /></button>
                    <button onClick={() => add({ type: "info", title: "Download queued", body: `${b.id} download started.` })} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: BORDER, color: MUTED }} title="Download"><Download size={11} /></button>
                    <button onClick={() => startRestore(b.id)} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor: "#FCA5A5", color: ERROR }} title="Restore"><RotateCcw size={11} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 6. AuditLog ──────────────────────────────────────────────────────────────
const AUDIT_ENTRIES = [
  { ts:"2025-10-14 10:09:41", actor:"Adaeze Okonkwo",    role:"MGT", action:"UNLOCK_ACCOUNT",      entity:"User",        entityId:"USR-008", ip:"192.168.1.12", device:"MGT-iPad-01",    detail:"Unlocked account for seun@grandpalms.ng after 5 failed attempts" },
  { ts:"2025-10-14 09:51:02", actor:"Adaeze Okonkwo",    role:"MGT", action:"APPROVE_REFUND",      entity:"Folio",       entityId:"FOL-2014", ip:"192.168.1.12", device:"MGT-iPad-01",   detail:"Approved refund ₦45,000 — Reason: duplicate charge" },
  { ts:"2025-10-14 09:34:18", actor:"Emeka Nwosu",       role:"FD",  action:"CHECK_IN",            entity:"Reservation", entityId:"RES-1042", ip:"192.168.1.10", device:"FD-Terminal-01", detail:"Guest: Dr. Bello · Room 501 · Deposit: ₦50,000 cash" },
  { ts:"2025-10-14 09:12:55", actor:"Ngozi Iweala-Obi",  role:"FIN", action:"NIGHT_AUDIT_RUN",     entity:"Business Date",entityId:"2025-10-13", ip:"192.168.1.20", device:"FD-Terminal-01", detail:"Audit completed · Rooms: 62 · Revenue: ₦4,820,000" },
  { ts:"2025-10-14 08:50:31", actor:"System",            role:"SYS", action:"BACKUP_COMPLETED",    entity:"Backup",      entityId:"BK-2025-1014-01", ip:"localhost", device:"server", detail:"Scheduled backup 2.4 GB — offsite sync queued" },
  { ts:"2025-10-13 22:14:09", actor:"Musa Abdullahi",    role:"RT",  action:"VOID_CHARGE",         entity:"POS Order",   entityId:"ORD-4892", ip:"192.168.1.31", device:"FD-Terminal-01", detail:"Voided ₦12,400 — Reason: customer complaint" },
  { ts:"2025-10-13 18:40:22", actor:"Fatima Al-Hassan",  role:"HK",  action:"INSPECTION_PASS",     entity:"Room",        entityId:"RM-307",   ip:"10.0.0.5",     device:"HK-Mobile-01",  detail:"Room 307 passed inspection — ready for assignment" },
  { ts:"2025-10-13 15:22:01", actor:"Adaeze Okonkwo",    role:"MGT", action:"ROLE_CHANGE",         entity:"User",        entityId:"USR-006",  ip:"192.168.1.12", device:"MGT-iPad-01",   detail:"Role changed FD → RT for Musa Abdullahi" },
];

const ACTION_COLORS: Record<string, string> = {
  UNLOCK_ACCOUNT: WARNING, APPROVE_REFUND: ORANGE, CHECK_IN: SUCCESS,
  NIGHT_AUDIT_RUN: PRIMARY, BACKUP_COMPLETED: TEAL, VOID_CHARGE: ERROR,
  INSPECTION_PASS: SUCCESS, ROLE_CHANGE: WARNING,
};

export function AuditLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [q, setQ] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = AUDIT_ENTRIES.filter(e =>
    !q || e.actor.toLowerCase().includes(q.toLowerCase()) ||
    e.action.toLowerCase().includes(q.toLowerCase()) ||
    e.entity.toLowerCase().includes(q.toLowerCase()) ||
    e.entityId.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Audit Log" sub="Append-only record of all privileged actions — no deletions permitted"
        actions={<BtnO label="Export" icon={Download} onClick={() => add({ type: "success", title: "Audit log exported" })} />}
      />

      <div className="mb-4 px-3 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#FEF3C7", border: `1px solid #FDE68A`, color: "#92400E" }}>
        <strong>Retention policy:</strong> Audit records are retained for 7 years per Nigerian NDPR and FIRS requirements. Records cannot be deleted from this interface.
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by actor, action, entity, or ID…" className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER }} />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead><TH cols={["Timestamp", "Actor", "Role", "Action", "Entity", "IP", "Device", ""]} /></thead>
          <tbody>
            {filtered.map((e, i) => (
              <>
                <tr key={i} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setExpandedRow(expandedRow === e.ts ? null : e.ts)}>
                  <td className="px-3 py-2.5 text-xs" style={{ color: MUTED, fontFamily: mono, whiteSpace: "nowrap" }}>{e.ts}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: TEXT }}>{e.actor}</td>
                  <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{e.role}</span></td>
                  <td className="px-3 py-2.5"><span className="text-xs font-bold" style={{ color: ACTION_COLORS[e.action] ?? TEXT, fontFamily: mono }}>{e.action}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{e.entity} <span style={{ fontFamily: mono }}>{e.entityId}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{e.ip}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{e.device}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{expandedRow === e.ts ? "▲" : "▼"}</td>
                </tr>
                {expandedRow === e.ts && (
                  <tr key={`${i}-detail`} style={{ backgroundColor: "#F9FAFB" }}>
                    <td colSpan={8} className="px-4 py-2.5 text-xs" style={{ color: MUTED }}><strong style={{ color: TEXT }}>Detail:</strong> {e.detail}</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-10 text-center text-xs" style={{ color: SUBTLE }}>No matching audit entries.</div>}
      </div>
    </div>
  );
}

// ─── 7. ErrorLog ──────────────────────────────────────────────────────────────
type ErrSeverity = "ERROR" | "WARN" | "INFO";

const ERROR_LOG = [
  { id:"ERR-0041", ts:"2025-10-14 10:09:41", sev:"WARN"  as ErrSeverity, module:"sync",    msg:"Central sync response delayed 3.2s",                requestId:"req-8841a", user:"system",          resolved:false, count:3,  stack:"SyncClient.push (sync.ts:182)\nretryWithBackoff (utils.ts:44)" },
  { id:"ERR-0040", ts:"2025-10-14 09:41:18", sev:"ERROR" as ErrSeverity, module:"printer", msg:"Folio printer (192.168.1.46) connection refused",   requestId:"req-8820c", user:"Emeka Nwosu",      resolved:false, count:12, stack:"PrintService.send (printer.ts:94)\nFolioScreen.print (FolioScreen.tsx:312)" },
  { id:"ERR-0039", ts:"2025-10-14 09:32:05", sev:"WARN"  as ErrSeverity, module:"auth",    msg:"Account locked after 5 failed login attempts",      requestId:"req-8814b", user:"seun@grandpalms.ng",resolved:true, count:5,  stack:"AuthController.login (auth.ts:67)\nrateLimit (middleware.ts:22)" },
  { id:"ERR-0038", ts:"2025-10-14 08:50:31", sev:"INFO"  as ErrSeverity, module:"backup",  msg:"Offsite transfer delayed — network congestion",     requestId:"req-8800a", user:"system",           resolved:true, count:1,  stack:"BackupService.transfer (backup.ts:141)" },
  { id:"ERR-0037", ts:"2025-10-13 22:14:09", sev:"WARN"  as ErrSeverity, module:"pos",     msg:"POS shift not closed at night audit — auto-closed", requestId:"req-8780b", user:"system",           resolved:true, count:1,  stack:"NightAudit.precheck (audit.ts:58)" },
  { id:"ERR-0036", ts:"2025-10-13 15:22:01", sev:"ERROR" as ErrSeverity, module:"db",      msg:"Deadlock detected on reservation_locks table",      requestId:"req-8742a", user:"Emeka Nwosu",      resolved:true, count:2,  stack:"ReservationService.lock (reservation.ts:210)\nDB.transaction (db.ts:88)" },
];

const SEV_STYLE: Record<ErrSeverity, { bg: string; text: string }> = {
  ERROR: { bg: "#FEE2E2", text: "#991B1B" },
  WARN:  { bg: "#FEF3C7", text: "#92400E" },
  INFO:  { bg: "#EFF6FF", text: "#1D4ED8" },
};

export function ErrorLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [logs, setLogs] = useState(ERROR_LOG);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterSev, setFilterSev] = useState<ErrSeverity | "ALL">("ALL");
  const [filterResolved, setFilterResolved] = useState<"all" | "open" | "resolved">("all");

  const filtered = logs.filter(e =>
    (filterSev === "ALL" || e.sev === filterSev) &&
    (filterResolved === "all" || (filterResolved === "open" ? !e.resolved : e.resolved))
  );

  const markResolved = (id: string) => {
    setLogs(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
    add({ type: "success", title: "Error marked resolved", body: id });
  };

  const openCount  = logs.filter(e => !e.resolved).length;
  const errorCount = logs.filter(e => e.sev === "ERROR").length;

  return (
    <div>
      <PageHeader title="Error Log" sub="Application errors grouped by signature with occurrence counts"
        actions={<BtnO label="Export" icon={Download} onClick={() => add({ type: "success", title: "Error log exported" })} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Open Errors"   value={String(openCount)}  sub="Unresolved" icon={AlertTriangle} accent={ERROR}   />
        <StatCard label="Error Events"  value={String(errorCount)} sub="Severity: ERROR" icon={XCircle}  accent={ERROR}   />
        <StatCard label="Warnings"      value={String(logs.filter(e=>e.sev==="WARN").length)} sub="Severity: WARN" icon={TriangleAlert} accent={WARNING} />
        <StatCard label="Resolved"      value={String(logs.filter(e=>e.resolved).length)} sub="This period" icon={CheckCircle2} accent={SUCCESS} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
          {(["ALL","ERROR","WARN","INFO"] as const).map(s => (
            <button key={s} onClick={() => setFilterSev(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: filterSev === s ? "white" : "transparent", color: filterSev === s ? TEXT : MUTED, boxShadow: filterSev === s ? "0 1px 2px rgba(0,0,0,0.08)" : "none" }}>{s}</button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
          {(["all","open","resolved"] as const).map(s => (
            <button key={s} onClick={() => setFilterResolved(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors" style={{ backgroundColor: filterResolved === s ? "white" : "transparent", color: filterResolved === s ? TEXT : MUTED, boxShadow: filterResolved === s ? "0 1px 2px rgba(0,0,0,0.08)" : "none" }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        {filtered.length === 0 && <div className="py-10 text-center text-xs" style={{ color: SUBTLE }}>No errors match the current filter.</div>}
        {filtered.map((e) => (
          <div key={e.id} className="border-b last:border-b-0" style={{ borderColor: BORDER }}>
            <div className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50" onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold mt-0.5 shrink-0" style={{ backgroundColor: SEV_STYLE[e.sev].bg, color: SEV_STYLE[e.sev].text }}>{e.sev}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: TEXT }}>{e.msg}</span>
                  {e.count > 1 && <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#F1F5F9", color: MUTED }}>×{e.count}</span>}
                  {e.resolved
                    ? <span className="text-xs font-semibold" style={{ color: SUCCESS }}>Resolved</span>
                    : <span className="text-xs font-semibold" style={{ color: ERROR }}>Open</span>}
                </div>
                <div className="flex gap-3 mt-0.5 text-xs" style={{ color: SUBTLE }}>
                  <span style={{ fontFamily: mono }}>{e.ts}</span>
                  <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9" }}>{e.module}</span>
                  <span style={{ fontFamily: mono }}>{e.requestId}</span>
                  <span>{e.user}</span>
                </div>
              </div>
              <span className="text-xs shrink-0" style={{ color: SUBTLE }}>{expanded === e.id ? "▲" : "▼"}</span>
            </div>

            {expanded === e.id && (
              <div className="px-4 pb-3 ml-16">
                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: "#F9FAFB" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: MUTED }}>Stack trace</div>
                  <pre className="text-xs overflow-auto" style={{ color: TEXT, fontFamily: mono }}>{e.stack}</pre>
                </div>
                {!e.resolved && (
                  <button onClick={() => markResolved(e.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
                    <CheckCircle2 size={12} /> Mark Resolved
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
