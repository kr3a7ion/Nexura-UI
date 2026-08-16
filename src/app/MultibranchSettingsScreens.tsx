// Batch 18 — Multi-branch & Settings (8 screens)
// BranchOverview, BranchComparison, CentralSyncStatus, HotelConfig,
// SyncSettings, DoorLockSettings, MyPreferences, PrintSettings
import { useState } from "react";
import {
  Building2, RefreshCw, Download, Globe, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, XCircle, Clock, ArrowUpRight,
  ArrowDownRight, Settings, Lock, Key, Shield, Bell,
  Monitor, Printer, ChevronDown, Eye, EyeOff, Plus,
  Trash2, Edit3, RotateCcw, AlertCircle, Info,
  TrendingUp, TrendingDown, Users, DollarSign, BedDouble,
  MapPin, Activity, Zap, Database, LayoutDashboard,
  Calendar, Phone, Mail, FileText, CreditCard,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  type Toast, mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR,
  BORDER, TEXT, MUTED, SUBTLE,
} from "./constants";
import { StatCard, PageHeader, BtnP, BtnO } from "./UIKit";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Row({ label, value, mono: useMono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
      <span className="text-xs" style={{ color: MUTED }}>{label}</span>
      <span className="text-xs font-semibold text-right" style={{ color: TEXT, fontFamily: useMono ? mono : undefined }}>{value}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
      <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>{title}</div>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>{label}</div>
      {children}
    </div>
  );
}

function Inp({ label, defaultValue, type = "text", placeholder }: { label?: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div className={label ? "mb-3" : ""}>
      {label && <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>{label}</div>}
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER, color: TEXT }} />
    </div>
  );
}

function Sel({ label, options, value, onChange }: { label?: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className={label ? "mb-3" : ""}>
      {label && <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>{label}</div>}
      <select value={value} onChange={e => onChange?.(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER, color: TEXT }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-9 h-5 rounded-full transition-colors relative" style={{ backgroundColor: checked ? PRIMARY : "#CBD5E1" }}>
      <span className="absolute top-0.5 transition-all rounded-full w-4 h-4 bg-white shadow-sm" style={{ left: checked ? "18px" : "2px" }} />
    </button>
  );
}

function ExportBtn({ add, label }: { add: (t: Omit<Toast, "id">) => void; label: string }) {
  const [state, setState] = useState<"idle" | "gen" | "ready">("idle");
  if (state === "gen") return <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}><div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: `${PRIMARY}40`, borderTopColor: PRIMARY }} />Generating…</div>;
  if (state === "ready") return <button onClick={() => { add({ type: "success", title: `${label} downloaded` }); setState("idle"); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}><Download size={12} /> Download Ready</button>;
  return <button onClick={() => { setState("gen"); setTimeout(() => setState("ready"), 1600); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs" style={{ borderColor: BORDER, color: MUTED }}><Download size={12} /> Export</button>;
}

// ─── Shared branch data ───────────────────────────────────────────────────────

const BRANCHES = [
  {
    id: "ABJ", name: "Grand Palms Abuja",    location: "Wuse 2, Abuja",      rooms: 68, occ: 88, rev: 4820000, staff: 34, lastSync: "2 min ago",  syncOk: true,  schema: "schema_v42", appVer: "v2.14.1", drift: "+0.3s",  queueDepth: 0, pending: 0,  alerts: [],
  },
  {
    id: "LOS", name: "Grand Palms Lagos",    location: "Victoria Island, Lagos", rooms: 94, occ: 91, rev: 7140000, staff: 48, lastSync: "4 min ago",  syncOk: true,  schema: "schema_v42", appVer: "v2.14.1", drift: "+0.8s",  queueDepth: 2, pending: 0,  alerts: [],
  },
  {
    id: "PHC", name: "Grand Palms Port Harcourt", location: "GRA Phase 2, PH",   rooms: 52, occ: 79, rev: 3290000, staff: 28, lastSync: "18 min ago", syncOk: true,  schema: "schema_v41", appVer: "v2.13.2", drift: "+2.1s",  queueDepth: 5, pending: 2,  alerts: ["Schema behind — pending migration"],
  },
  {
    id: "KAN", name: "Grand Palms Kano",     location: "Nassarawa, Kano",     rooms: 40, occ: 72, rev: 1850000, staff: 22, lastSync: "3 hrs ago",  syncOk: false, schema: "schema_v40", appVer: "v2.12.0", drift: "unknown", queueDepth: 18, pending: 4, alerts: ["Sync offline — 3 hrs", "Schema 2 versions behind", "App update required"],
  },
];

const KPI_TREND = [
  { month: "Jul", abj: 88, los: 90, phc: 75, kan: 68 },
  { month: "Aug", abj: 90, los: 92, phc: 78, kan: 71 },
  { month: "Sep", abj: 85, los: 89, phc: 76, kan: 69 },
  { month: "Oct", abj: 88, los: 91, phc: 79, kan: 72 },
];

const BRANCH_COLORS: Record<string, string> = { ABJ: PRIMARY, LOS: TEAL, PHC: ORANGE, KAN: SUCCESS };

// ─── 1. BranchOverview ───────────────────────────────────────────────────────

export function BranchOverview({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const totalRooms  = BRANCHES.reduce((s, b) => s + b.rooms, 0);
  const avgOcc      = Math.round(BRANCHES.reduce((s, b) => s + b.occ, 0) / BRANCHES.length);
  const totalRev    = BRANCHES.reduce((s, b) => s + b.rev, 0);
  const totalStaff  = BRANCHES.reduce((s, b) => s + b.staff, 0);
  const offlineCount = BRANCHES.filter(b => !b.syncOk).length;

  return (
    <div>
      <PageHeader title="Branch Overview" sub="Aggregate performance across all properties"
        actions={<BtnO label="Sync All" icon={RefreshCw} onClick={() => add({ type: "info", title: "Manual sync triggered for all branches" })} />}
      />

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Rooms"     value={String(totalRooms)} sub={`${BRANCHES.length} properties`} icon={BedDouble}  accent={PRIMARY} />
        <StatCard label="Avg Occupancy"   value={`${avgOcc}%`}       sub="All branches"                    icon={TrendingUp} accent={TEAL}    delta="+3pp vs Sep" deltaPositive />
        <StatCard label="Total Revenue"   value={`₦${(totalRev/1000000).toFixed(2)}M`} sub="Today combined" icon={DollarSign} accent={SUCCESS} />
        <StatCard label="Sync Alerts"     value={String(offlineCount)} sub="Branch(es) with issues"       icon={offlineCount > 0 ? WifiOff : Wifi} accent={offlineCount > 0 ? ERROR : SUCCESS} />
      </div>

      {/* Branch cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {BRANCHES.map(b => (
          <div key={b.id} className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: b.alerts.length > 0 ? "#FCA5A5" : BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }} onClick={() => nav?.("sync-status", "Sync Status")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-bold" style={{ color: TEXT }}>{b.name}</div>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: MUTED }}><MapPin size={11} />{b.location}</div>
              </div>
              <div className="flex items-center gap-1.5">
                {b.syncOk
                  ? <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}><Wifi size={11} />Synced {b.lastSync}</span>
                  : <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}><WifiOff size={11} />Offline {b.lastSync}</span>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: "Rooms", val: String(b.rooms) },
                { label: "Occupancy", val: `${b.occ}%` },
                { label: "Revenue", val: `₦${(b.rev/1000000).toFixed(2)}M` },
                { label: "Staff on duty", val: String(b.staff) },
              ].map(k => (
                <div key={k.label} className="text-center">
                  <div className="text-lg font-bold" style={{ color: b.alerts.length > 0 && !b.syncOk ? MUTED : TEXT }}>{k.val}</div>
                  <div className="text-xs" style={{ color: SUBTLE }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Occ bar */}
            <div className="mb-2">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
                <div className="h-full rounded-full" style={{ width: `${b.occ}%`, backgroundColor: b.occ >= 85 ? SUCCESS : b.occ >= 70 ? PRIMARY : WARNING }} />
              </div>
            </div>

            {b.alerts.length > 0 && (
              <div className="mt-2 space-y-1">
                {b.alerts.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                    <AlertTriangle size={11} />{a}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Occupancy trend */}
      <SectionCard title="Occupancy Trend — All Branches (%)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={KPI_TREND} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} domain={[60, 100]} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`${v}%`]} />
            {BRANCHES.map(b => <Line key={b.id} type="monotone" dataKey={b.id.toLowerCase()} name={b.name.split(" ").pop()} stroke={BRANCH_COLORS[b.id]} strokeWidth={2} dot={{ r: 3 }} />)}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 flex-wrap">
          {BRANCHES.map(b => <div key={b.id} className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}><span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: BRANCH_COLORS[b.id] }} />{b.name.split(" ").pop()}</div>)}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── 2. BranchComparison ─────────────────────────────────────────────────────

const CMP_KPIS = [
  { key: "occ",      label: "Occupancy (%)",     fmt: (v: number) => `${v}%`,                  higherBetter: true  },
  { key: "adr",      label: "ADR (₦)",            fmt: (v: number) => `₦${v.toLocaleString()}`, higherBetter: true  },
  { key: "revpar",   label: "RevPAR (₦)",         fmt: (v: number) => `₦${v.toLocaleString()}`, higherBetter: true  },
  { key: "rev",      label: "Revenue Today (₦)",  fmt: (v: number) => `₦${(v/1000000).toFixed(2)}M`, higherBetter: true },
  { key: "alos",     label: "Avg LOS (nights)",   fmt: (v: number) => `${v}n`,                  higherBetter: true  },
  { key: "staff",    label: "Staff on Duty",      fmt: (v: number) => String(v),                higherBetter: false },
  { key: "complaints", label: "Complaints Open",  fmt: (v: number) => String(v),                higherBetter: false },
  { key: "wos",      label: "Open Work Orders",   fmt: (v: number) => String(v),                higherBetter: false },
];

const CMP_DATA: Record<string, Record<string, number>> = {
  ABJ: { occ:88, adr:55417, revpar:48767, rev:4820000, alos:2.8, staff:34, complaints:2, wos:3  },
  LOS: { occ:91, adr:62000, revpar:56420, rev:7140000, alos:3.1, staff:48, complaints:1, wos:5  },
  PHC: { occ:79, adr:48000, revpar:37920, rev:3290000, alos:2.4, staff:28, complaints:4, wos:7  },
  KAN: { occ:72, adr:41000, revpar:29520, rev:1850000, alos:2.1, staff:22, complaints:3, wos:12 },
};

export function BranchComparison({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ranked = [...BRANCHES].sort((a, b) => b.occ - a.occ);

  return (
    <div>
      <PageHeader title="Branch Comparison" sub="Side-by-side KPIs — figures as of last sync per branch"
        actions={<ExportBtn add={add} label="Branch Comparison" />}
      />

      {/* Last-sync disclaimer */}
      <div className="mb-4 px-3 py-2 rounded-xl text-xs flex flex-wrap gap-3" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
        {BRANCHES.map(b => (
          <span key={b.id} style={{ color: MUTED }}>
            <span className="font-semibold" style={{ color: BRANCH_COLORS[b.id] }}>{b.id}</span> as of {b.lastSync}
            {!b.syncOk && <span className="ml-1 font-semibold" style={{ color: ERROR }}>(offline)</span>}
          </span>
        ))}
      </div>

      {/* Ranking strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {ranked.map((b, i) => (
          <div key={b.id} className="bg-white rounded-xl border p-3 text-center" style={{ borderColor: i === 0 ? PRIMARY : BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: i === 0 ? PRIMARY : MUTED }}>#{i + 1}</div>
            <div className="text-sm font-bold" style={{ color: BRANCH_COLORS[b.id] }}>{b.id}</div>
            <div className="text-xs" style={{ color: MUTED }}>{b.occ}% occ</div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>KPI</th>
              {BRANCHES.map(b => (
                <th key={b.id} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: BRANCH_COLORS[b.id] }}>{b.id}</th>
              ))}
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Best</th>
            </tr>
          </thead>
          <tbody>
            {CMP_KPIS.map(kpi => {
              const vals = BRANCHES.map(b => CMP_DATA[b.id][kpi.key]);
              const best = kpi.higherBetter ? Math.max(...vals) : Math.min(...vals);
              const worst = kpi.higherBetter ? Math.min(...vals) : Math.max(...vals);
              const bestBranch = BRANCHES[vals.indexOf(best)];
              return (
                <tr key={kpi.key} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: TEXT }}>{kpi.label}</td>
                  {BRANCHES.map((b, i) => {
                    const v = CMP_DATA[b.id][kpi.key];
                    const isBest  = v === best;
                    const isWorst = v === worst;
                    return (
                      <td key={b.id} className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold" style={{ color: isBest ? SUCCESS : isWorst ? ERROR : TEXT, fontFamily: mono }}>{kpi.fmt(v)}</span>
                          {isBest  && <ArrowUpRight size={12} style={{ color: SUCCESS }} />}
                          {isWorst && <ArrowDownRight size={12} style={{ color: ERROR }} />}
                        </div>
                        {/* variance vs best */}
                        {!isBest && (
                          <div className="text-xs" style={{ color: SUBTLE }}>
                            {kpi.higherBetter ? "−" : "+"}{kpi.fmt(Math.abs(v - best))} vs best
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: BRANCH_COLORS[bestBranch.id] }}>{bestBranch.id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Revenue bar chart */}
      <SectionCard title="Revenue Today by Branch (₦M)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={BRANCHES.map(b => ({ name: b.id, rev: +(b.rev / 1000000).toFixed(2) }))} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}M`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`₦${v}M`]} />
            <Bar dataKey="rev" radius={[4, 4, 0, 0]}>
              {BRANCHES.map((b, i) => <rect key={i} fill={BRANCH_COLORS[b.id]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}

// ─── 3. CentralSyncStatus ────────────────────────────────────────────────────

export function CentralSyncStatus({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [syncing, setSyncing] = useState<string | null>(null);

  const triggerSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => { setSyncing(null); add({ type: "success", title: `Sync triggered`, body: `Manual sync queued for ${id}.` }); }, 1800);
  };

  return (
    <div>
      <PageHeader title="Central Sync Status" sub="Per-branch sync health, queue depth, schema and app versions"
        actions={<BtnO label="Sync All" icon={RefreshCw} onClick={() => add({ type: "info", title: "Global sync triggered" })} />}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Branches Online"  value={`${BRANCHES.filter(b=>b.syncOk).length} / ${BRANCHES.length}`} sub="Active connections" icon={Wifi}    accent={SUCCESS} />
        <StatCard label="Pending Queue"    value={String(BRANCHES.reduce((s,b)=>s+b.queueDepth,0))} sub="Snapshots to process" icon={Database} accent={PRIMARY} />
        <StatCard label="Schema Lag"       value={String(BRANCHES.filter(b=>b.schema!=="schema_v42").length)} sub="Branch(es) behind"  icon={AlertTriangle} accent={WARNING} />
        <StatCard label="App Lag"          value={String(BRANCHES.filter(b=>b.appVer!=="v2.14.1").length)} sub="Branch(es) outdated" icon={Activity} accent={ORANGE} />
      </div>

      {/* Per-branch panels */}
      <div className="space-y-4 mb-5">
        {BRANCHES.map(b => (
          <div key={b.id} className="bg-white rounded-xl border p-4" style={{ borderColor: b.syncOk ? BORDER : "#FCA5A5", boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: TEXT }}>{b.name}</span>
                  {b.syncOk
                    ? <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}><Wifi size={10} />Online</span>
                    : <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}><WifiOff size={10} />Offline</span>}
                </div>
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>Last sync: <span style={{ fontFamily: mono }}>{b.lastSync}</span></div>
              </div>
              <button onClick={() => triggerSync(b.id)} disabled={syncing === b.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border" style={{ borderColor: BORDER, color: MUTED }}>
                <RefreshCw size={12} className={syncing === b.id ? "animate-spin" : ""} />
                {syncing === b.id ? "Syncing…" : "Sync Now"}
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: "Queue Depth",    val: String(b.queueDepth),    warn: b.queueDepth > 5 },
                { label: "Pending Snaps",  val: String(b.pending),       warn: b.pending > 0    },
                { label: "Clock Drift",    val: b.drift,                 warn: b.drift === "unknown" || parseFloat(b.drift) > 2 },
                { label: "Schema Version", val: b.schema,                warn: b.schema !== "schema_v42" },
                { label: "App Version",    val: b.appVer,                warn: b.appVer !== "v2.14.1" },
              ].map(k => (
                <div key={k.label} className="p-2 rounded-xl" style={{ backgroundColor: k.warn ? "#FEF3C7" : "#F9FAFB" }}>
                  <div className="text-xs" style={{ color: MUTED }}>{k.label}</div>
                  <div className="text-xs font-bold mt-0.5" style={{ color: k.warn ? "#92400E" : TEXT, fontFamily: mono }}>{k.val}</div>
                </div>
              ))}
            </div>

            {b.alerts.length > 0 && (
              <div className="mt-3 space-y-1">
                {b.alerts.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                    <AlertTriangle size={11} />{a}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Retention / rollup */}
      <SectionCard title="Retention & Rollup Policy">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {[
            { label: "Snapshot retention (central)", value: "90 days — daily rollup after 30 days" },
            { label: "KPI rollup granularity", value: "Hourly for 7 days → daily for 30 days → monthly" },
            { label: "Minimum sync interval", value: "5 minutes" },
          ].map(r => (
            <div key={r.label} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}>
              <div style={{ color: MUTED }}>{r.label}</div>
              <div className="font-semibold mt-1" style={{ color: TEXT }}>{r.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── 4. HotelConfig ──────────────────────────────────────────────────────────

export function HotelConfig({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState<"identity" | "operations" | "policies" | "rooms">("identity");
  const TABS = ["identity", "operations", "policies", "rooms"] as const;
  const TAB_LABELS: Record<typeof TABS[number], string> = { identity: "Property Identity", operations: "Operational Settings", policies: "Policies", rooms: "Rooms & Floors" };

  return (
    <div>
      <PageHeader title="Hotel Configuration" sub="Property identity, operational settings, policies, and room configuration"
        actions={<button onClick={() => add({ type: "success", title: "Configuration saved" })} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save Changes</button>}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ backgroundColor: "#F1F5F9" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: tab === t ? "white" : "transparent", color: tab === t ? TEXT : MUTED, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "identity" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Property Details">
            <Inp label="Hotel Name" defaultValue="Grand Palms Hotel" />
            <Inp label="Legal Entity Name" defaultValue="Grand Palms Hospitality Ltd" />
            <Inp label="Tax Identification Number (TIN)" defaultValue="12345678-0001" />
            <Inp label="Address" defaultValue="Plot 14, Wuse 2, Abuja, FCT" />
            <Inp label="Phone" defaultValue="+234 803 123 4567" />
            <Inp label="Email" defaultValue="info@grandpalms.ng" />
          </SectionCard>
          <SectionCard title="Localisation">
            <Sel label="Timezone" options={["Africa/Lagos", "UTC", "Africa/Abuja"]} />
            <Sel label="Currency" options={["NGN — Nigerian Naira (₦)", "USD — US Dollar ($)", "EUR — Euro (€)"]} />
            <Sel label="Date Format" options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
            <Sel label="Time Format" options={["12-hour (AM/PM)", "24-hour"]} />
            <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: BORDER, color: MUTED }}>
              Timezone affects business-date roll, timestamps in audit log, and all printed documents.
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "operations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Operating Hours">
            <Inp label="Business Date Roll Time" defaultValue="02:00" type="time" />
            <Inp label="Standard Check-in Time" defaultValue="14:00" type="time" />
            <Inp label="Standard Check-out Time" defaultValue="12:00" type="time" />
            <Inp label="Late Check-out Cutoff" defaultValue="18:00" type="time" />
            <div className="mt-2 text-xs" style={{ color: MUTED }}>Business date rolls at 02:00 — the night audit must complete before this time.</div>
          </SectionCard>
          <SectionCard title="Service Charge & Tax">
            <Inp label="Service Charge Rate (%)" defaultValue="10" type="number" />
            <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>
              VAT and consumption tax rates are configured in <strong>Tax Configuration</strong> (Finance → Tax Config). Service charge is the hotel-level rate applied before tax.
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "policies" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Cancellation & No-Show">
            <Sel label="Cancellation Policy" options={["24 hours notice — full refund", "48 hours notice — full refund", "72 hours notice — full refund", "Non-refundable"]} />
            <Inp label="No-Show Charge (% of first night)" defaultValue="100" type="number" />
            <Inp label="Late Cancellation Charge (% of first night)" defaultValue="50" type="number" />
          </SectionCard>
          <SectionCard title="Deposit & Credit">
            <Inp label="Deposit Required (% of total stay)" defaultValue="30" type="number" />
            <Inp label="Credit Limit (₦)" defaultValue="500000" type="number" />
            <Sel label="Late Checkout Fee Policy" options={["₦5,000 / hour", "50% of one night's ADR", "Full night charge", "No charge"]} />
            <Inp label="Max. Advance Booking (days)" defaultValue="365" type="number" />
          </SectionCard>
        </div>
      )}

      {tab === "rooms" && (
        <SectionCard title="Room & Floor Configuration">
          <div className="mb-3 text-xs" style={{ color: MUTED }}>Room types are configured in <strong>Reservations → Room Types</strong>. This section defines physical floor and wing layout.</div>
          {[
            { floor: "Floor 1", rooms: "101–115", wing: "Main", notes: "Standard rooms" },
            { floor: "Floor 2", rooms: "201–220", wing: "Main", notes: "Deluxe rooms" },
            { floor: "Floor 3", rooms: "301–315", wing: "Main", notes: "Deluxe rooms" },
            { floor: "Floor 4", rooms: "401–410", wing: "Executive", notes: "Executive rooms" },
            { floor: "Floor 5", rooms: "501–508", wing: "Executive", notes: "Suites" },
          ].map(f => (
            <div key={f.floor} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold" style={{ color: TEXT }}>{f.floor}</div>
              <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{f.rooms}</div>
              <div className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: MUTED }}>{f.wing}</div>
              <div className="text-xs" style={{ color: SUBTLE }}>{f.notes}</div>
              <button className="text-xs" style={{ color: PRIMARY }}><Edit3 size={12} /></button>
            </div>
          ))}
          <div className="mt-3"><BtnO label="Add Floor / Wing" icon={Plus} onClick={() => add({ type: "info", title: "Add floor" })} /></div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── 5. SyncSettings ─────────────────────────────────────────────────────────

export function SyncSettings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [url, setUrl] = useState("https://api.nexura.ng/sync/v2");
  const [showKey, setShowKey] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [testing, setTesting] = useState(false);

  const isHttp = url.startsWith("http://");

  const rotateKey = () => {
    setRotating(true);
    setTimeout(() => { setRotating(false); add({ type: "success", title: "Sync key rotated", body: "New key active. All branches will re-authenticate on next sync." }); }, 1500);
  };

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => { setTesting(false); add({ type: "success", title: "Connection OK", body: "Central server reachable. Latency: 82ms." }); }, 1800);
  };

  return (
    <div>
      <PageHeader title="Sync Settings" sub="Central server connection, sync scope, and retry policy"
        actions={
          <div className="flex gap-2">
            <BtnO label={testing ? "Testing…" : "Test Connection"} icon={Activity} onClick={testConnection} />
            <button onClick={() => add({ type: "success", title: "Sync settings saved" })} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <SectionCard title="Connection">
            <FieldRow label="Central Server URL">
              <input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: isHttp ? ERROR : BORDER, fontFamily: mono }} />
              {isHttp && (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs p-2 rounded-lg" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  Plain HTTP is not permitted. All sync traffic must use HTTPS to protect guest data and API keys in transit. Change the URL to https://.
                </div>
              )}
            </FieldRow>
            <FieldRow label="Branch ID">
              <input defaultValue="GRND-PALMS-ABJ-001" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER, fontFamily: mono }} readOnly />
            </FieldRow>
            <FieldRow label="Sync Key">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type={showKey ? "text" : "password"} defaultValue="sk_live_gp_abj_7x4m2qnr9c" className="w-full px-3 py-2 pr-8 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER, fontFamily: mono }} readOnly />
                  <button onClick={() => setShowKey(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: MUTED }}>{showKey ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                </div>
                <button onClick={rotateKey} disabled={rotating} className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs" style={{ borderColor: BORDER, color: WARNING }}>
                  <RotateCcw size={12} className={rotating ? "animate-spin" : ""} />
                  {rotating ? "Rotating…" : "Rotate"}
                </button>
              </div>
              <div className="mt-1 text-xs" style={{ color: MUTED }}>Rotating the key will cause all branches to re-authenticate on their next sync. Plan for a brief sync gap.</div>
            </FieldRow>
          </SectionCard>

          <SectionCard title="Interval & Retry">
            <Sel label="Sync Interval" options={["Every 5 minutes", "Every 10 minutes", "Every 15 minutes", "Every 30 minutes"]} />
            <Sel label="Retry Policy" options={["Exponential backoff — max 5 retries", "Fixed 60s — max 3 retries", "Fixed 30s — unlimited"]} />
            <Inp label="Connection Timeout (seconds)" defaultValue="30" type="number" />
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="What Syncs (KPI Scope)">
            <div className="text-xs mb-3" style={{ color: MUTED }}>The following data categories sync to central. PII (guest personal data) stays on-property and is never transmitted.</div>
            {[
              { label: "Occupancy & RevPAR KPIs",       syncs: true,  note: "Aggregated, no room-level PII" },
              { label: "Revenue by category",           syncs: true,  note: "Totals only, no folio detail" },
              { label: "Operational metrics",           syncs: true,  note: "Work orders, HK throughput" },
              { label: "Staff headcount & attendance",  syncs: true,  note: "Counts by department, no names" },
              { label: "Inventory stock levels",        syncs: true,  note: "SKU quantities and values" },
              { label: "Guest profiles / PII",          syncs: false, note: "Stays on-property — never synced" },
              { label: "Full folio detail",             syncs: false, note: "Stays on-property — never synced" },
              { label: "Audit log entries",             syncs: false, note: "Stays on-property — never synced" },
            ].map(s => (
              <div key={s.label} className="flex items-start gap-2.5 py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                {s.syncs
                  ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: SUCCESS }} />
                  : <XCircle     size={14} className="mt-0.5 shrink-0" style={{ color: SUBTLE  }} />}
                <div>
                  <div className="text-xs font-semibold" style={{ color: s.syncs ? TEXT : MUTED }}>{s.label}</div>
                  <div className="text-xs" style={{ color: SUBTLE }}>{s.note}</div>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Last Sync Result">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} style={{ color: SUCCESS }} />
              <div className="text-xs font-semibold" style={{ color: SUCCESS }}>OK — 2 minutes ago</div>
            </div>
            <div className="text-xs" style={{ color: MUTED }}>Snapshots sent: 1 · Records: 847 · Duration: 1.2s · Server ACK received</div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── 6. DoorLockSettings ─────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "dormakaba",   name: "Dormakaba DCOM",    cards: true,  pin: true,  mobileKey: true,  offline: true,  remoteUnlock: true,  auditRead: true,  immediateRevoke: true,  gateway: true,  maxCodes: 10,
  },
  {
    id: "salto",       name: "Salto KS",           cards: true,  pin: true,  mobileKey: true,  offline: true,  remoteUnlock: true,  auditRead: true,  immediateRevoke: false, gateway: false, maxCodes: 8,
  },
  {
    id: "onity",       name: "Onity HT24",         cards: true,  pin: false, mobileKey: false, offline: true,  remoteUnlock: false, auditRead: false, immediateRevoke: false, gateway: false, maxCodes: 4,
  },
  {
    id: "assa",        name: "ASSA ABLOY VingCard", cards: true,  pin: true,  mobileKey: true,  offline: true,  remoteUnlock: true,  auditRead: true,  immediateRevoke: true,  gateway: true,  maxCodes: 12,
  },
];

type Provider = typeof PROVIDERS[0];
const CAP_COLS: { key: keyof Provider; label: string }[] = [
  { key: "cards",           label: "Cards"             },
  { key: "pin",             label: "PIN"               },
  { key: "mobileKey",       label: "Mobile Key"        },
  { key: "offline",         label: "Offline Issuance"  },
  { key: "remoteUnlock",    label: "Remote Unlock"     },
  { key: "auditRead",       label: "Audit Readback"    },
  { key: "immediateRevoke", label: "Immediate Revoke"  },
  { key: "gateway",         label: "Gateway Required"  },
];

export function DoorLockSettings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [providerId, setProviderId] = useState("dormakaba");
  const [testing, setTesting] = useState(false);
  const [autoRevoke, setAutoRevoke]     = useState(true);
  const [queueOffline, setQueueOffline] = useState(true);
  const [notifyMgmt, setNotifyMgmt]     = useState(true);

  const provider = PROVIDERS.find(p => p.id === providerId)!;

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => { setTesting(false); add({ type: "success", title: "Connection OK", body: `${provider.name}: 68 locks discovered, 68 online.` }); }, 2000);
  };

  return (
    <div>
      <PageHeader title="Door Lock Settings" sub="Provider selection, capability matrix, credentials, and behaviour"
        actions={
          <div className="flex gap-2">
            <BtnO label={testing ? "Testing…" : "Test Connection"} icon={Activity} onClick={testConnection} />
            <button onClick={() => add({ type: "success", title: "Lock settings saved" })} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save</button>
          </div>
        }
      />

      {/* Provider picker */}
      <SectionCard title="Lock Provider">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {PROVIDERS.map(p => (
            <button key={p.id} onClick={() => setProviderId(p.id)} className="p-3 rounded-xl border text-left transition-all" style={{ borderColor: providerId === p.id ? PRIMARY : BORDER, backgroundColor: providerId === p.id ? "#EFF6FF" : "white" }}>
              <Lock size={16} style={{ color: providerId === p.id ? PRIMARY : SUBTLE, marginBottom: 4 }} />
              <div className="text-xs font-semibold" style={{ color: providerId === p.id ? PRIMARY : TEXT }}>{p.name}</div>
            </button>
          ))}
        </div>

        {/* Capability matrix */}
        <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>Capability Matrix — {provider.name}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {CAP_COLS.map(c => {
            const val = provider[c.key] as boolean;
            return (
              <div key={c.key} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: val ? "#DCFCE7" : "#F1F5F9" }}>
                {val ? <CheckCircle2 size={13} style={{ color: SUCCESS }} /> : <XCircle size={13} style={{ color: SUBTLE }} />}
                <span className="text-xs" style={{ color: val ? TEXT : MUTED }}>{c.label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl col-span-2 lg:col-span-2" style={{ backgroundColor: "#EFF6FF" }}>
            <Info size={13} style={{ color: PRIMARY }} />
            <span className="text-xs" style={{ color: PRIMARY }}>Max {provider.maxCodes} codes per room</span>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        {/* Credentials — shape changes per provider */}
        <SectionCard title={`Credentials — ${provider.name}`}>
          {provider.id === "dormakaba" && <>
            <Inp label="Gateway Host / IP" defaultValue="192.168.1.80" />
            <Inp label="Gateway Port"      defaultValue="7070" type="number" />
            <Inp label="API Username"      defaultValue="nexura_svc" />
            <Inp label="API Password"      type="password" placeholder="••••••••" />
            <Inp label="Hotel Code"        defaultValue="GRND-ABJ-001" />
          </>}
          {provider.id === "salto" && <>
            <Inp label="Salto Cloud Site ID"   defaultValue="site_abj_001" />
            <Inp label="Salto API Key"          type="password" placeholder="••••••••" />
            <Inp label="Salto Site Secret"      type="password" placeholder="••••••••" />
          </>}
          {provider.id === "onity" && <>
            <Inp label="Encoder COM Port"  defaultValue="COM3" />
            <Inp label="Interface Type"    defaultValue="RS-232 / USB" />
          </>}
          {provider.id === "assa" && <>
            <Inp label="VingCard Online Server" defaultValue="192.168.1.81" />
            <Inp label="PMS Interface Port"     defaultValue="5010" type="number" />
            <Inp label="Property Code"          defaultValue="GRND01" />
            <Inp label="System Password"        type="password" placeholder="••••••••" />
          </>}
          {!provider.gateway && (
            <div className="mt-2 text-xs p-2 rounded-lg" style={{ backgroundColor: "#F0FDF4", color: "#166534" }}>
              This provider connects directly without a gateway appliance.
            </div>
          )}
        </SectionCard>

        {/* Behaviour */}
        <SectionCard title="Behaviour">
          <div className="space-y-3">
            {[
              { label: "Auto-revoke credentials on checkout",    val: autoRevoke,   set: setAutoRevoke,   note: provider.immediateRevoke ? "Immediate revocation supported." : "Revocation queued — takes effect on next lock sync." },
              { label: "Queue credential ops when offline",      val: queueOffline, set: setQueueOffline, note: "Credentials issued during offline will sync when connection restores." },
              { label: "Notify management on offline revoke",    val: notifyMgmt,   set: setNotifyMgmt,   note: "Manager receives push notification when a revoke must wait for reconnection." },
            ].map(t => (
              <div key={t.label} className="py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: TEXT }}>{t.label}</span>
                  <Toggle checked={t.val} onChange={t.set} />
                </div>
                <div className="text-xs" style={{ color: MUTED }}>{t.note}</div>
              </div>
            ))}
            <div>
              <Inp label="Max card credentials per check-in" defaultValue="2" type="number" />
              <Inp label="Queue expiry buffer (minutes after checkout)" defaultValue="15" type="number" />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── 7. MyPreferences ────────────────────────────────────────────────────────

const NOTIF_EVENTS = [
  "New reservation",     "Reservation modified",  "Check-in",           "Check-out",
  "Complaint opened",    "Work order overdue",     "Low stock alert",    "Night audit complete",
  "Sync error",          "Backup complete",        "Device offline",     "Staff leave request",
];

export function MyPreferences({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState<"display" | "notifications" | "security">("display");
  const TABS = ["display", "notifications", "security"] as const;
  const TAB_LABELS = { display: "Display & Locale", notifications: "Notifications", security: "Security" };
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(Object.fromEntries(NOTIF_EVENTS.map(e => [e, true])));
  const [inApp, setInApp]     = useState(true);
  const [push, setPush]       = useState(false);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [showPw, setShowPw]   = useState(false);

  const SESSIONS = [
    { id: "S1", device: "MGT-iPad-01",     location: "Abuja, NG",    started: "Today 08:14",    current: true  },
    { id: "S2", device: "Chrome / Windows", location: "Abuja, NG",    started: "Yesterday 18:40", current: false },
  ];

  return (
    <div>
      <PageHeader title="My Preferences" sub="Display, notifications, and account security" />

      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ backgroundColor: "#F1F5F9" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: tab === t ? "white" : "transparent", color: tab === t ? TEXT : MUTED, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "display" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Locale & Format">
            <Sel label="Language" options={["English (Nigeria)", "Hausa", "Yoruba", "Igbo"]} />
            <Sel label="Timezone" options={["Africa/Lagos (WAT, UTC+1)", "UTC"]} />
            <Sel label="Date Format" options={["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]} />
            <Sel label="Time Format" options={["12-hour (AM/PM)", "24-hour"]} />
            <Sel label="Default Landing Screen" options={["Dashboard", "Reservations", "Front Desk", "Housekeeping Board"]} />
          </SectionCard>
          <SectionCard title="Interface Density">
            <div className="flex gap-3">
              {(["comfortable", "compact"] as const).map(d => (
                <button key={d} onClick={() => setDensity(d)} className="flex-1 p-3 rounded-xl border text-center transition-all" style={{ borderColor: density === d ? PRIMARY : BORDER, backgroundColor: density === d ? "#EFF6FF" : "white" }}>
                  <div className="text-xs font-semibold capitalize" style={{ color: density === d ? PRIMARY : TEXT }}>{d}</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {d === "comfortable" ? "More spacing, easier to tap" : "Denser rows, more on screen"}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Sel label="Theme" options={["Light (default)", "Dark (coming soon)"]} />
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Notification Channels">
            {[
              { label: "In-app notifications", val: inApp, set: setInApp },
              { label: "Push notifications (mobile)", val: push, set: setPush },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                <span className="text-xs font-semibold" style={{ color: TEXT }}>{c.label}</span>
                <Toggle checked={c.val} onChange={c.set} />
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Events to Notify">
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {NOTIF_EVENTS.map(e => (
                <div key={e} className="flex items-center justify-between py-1.5">
                  <span className="text-xs" style={{ color: TEXT }}>{e}</span>
                  <Toggle checked={notifToggles[e]} onChange={v => setNotifToggles(p => ({ ...p, [e]: v }))} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Change Password">
            <div className="relative mb-3">
              <input type={showPw ? "text" : "password"} placeholder="Current password" className="w-full px-3 py-2 border rounded-xl text-xs outline-none pr-8" style={{ borderColor: BORDER }} />
              <button onClick={() => setShowPw(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: MUTED }}>{showPw ? <EyeOff size={13} /> : <Eye size={13} />}</button>
            </div>
            <Inp type="password" placeholder="New password" />
            <Inp type="password" placeholder="Confirm new password" />
            <button onClick={() => add({ type: "success", title: "Password updated" })} className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Update Password</button>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="MFA Enrolment">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={24} style={{ color: MUTED }} />
                <div className="text-xs" style={{ color: MUTED }}>MFA is not currently enabled on your account. Enable it to add a second layer of protection.</div>
              </div>
              <BtnP label="Enable MFA (TOTP)" icon={Shield} onClick={() => add({ type: "info", title: "MFA setup", body: "QR code will appear to scan with your authenticator app." })} />
            </SectionCard>

            <SectionCard title="Active Sessions">
              {SESSIONS.map(s => (
                <div key={s.id} className="flex items-start justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: TEXT }}>
                      {s.device}
                      {s.current && <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>Current</span>}
                    </div>
                    <div className="text-xs" style={{ color: MUTED }}>{s.location} · {s.started}</div>
                  </div>
                  {!s.current && <button onClick={() => add({ type: "info", title: "Session revoked", body: s.device })} className="text-xs" style={{ color: ERROR }}>Revoke</button>}
                </div>
              ))}
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 8. PrintSettings ────────────────────────────────────────────────────────

const PRINTER_PURPOSES = [
  { id: "folio",    label: "Folio / Invoice",         icon: FileText,  paper: ["A4", "A5", "Letter"], defaultCopies: 1 },
  { id: "receipt",  label: "Receipt (Thermal 80mm)",  icon: CreditCard, paper: ["80mm roll"],         defaultCopies: 1 },
  { id: "kitchen",  label: "Kitchen Ticket",          icon: FileText,  paper: ["80mm roll", "58mm roll"], defaultCopies: 1 },
  { id: "regcard",  label: "Registration Card",       icon: FileText,  paper: ["A4"],                  defaultCopies: 2 },
];

const AUTO_TRIGGERS = [
  "Print receipt on payment",
  "Print folio on checkout",
  "Print registration card on check-in",
  "Print kitchen ticket on order confirmation",
];

export function PrintSettings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [printers, setPrinters] = useState(
    PRINTER_PURPOSES.map(p => ({
      id: p.id,
      address: p.id === "folio" ? "192.168.1.46" : p.id === "receipt" ? "192.168.1.45" : p.id === "kitchen" ? "192.168.1.47" : "192.168.1.46",
      paper: p.paper[0],
      copies: p.defaultCopies,
      template: "Default",
      autoTriggers: AUTO_TRIGGERS.filter(t =>
        (p.id === "receipt" && t.includes("receipt")) ||
        (p.id === "folio"   && t.includes("folio"))   ||
        (p.id === "regcard" && t.includes("registration")) ||
        (p.id === "kitchen" && t.includes("kitchen"))
      ),
    }))
  );

  const [testing, setTesting] = useState<string | null>(null);

  const testPrint = (id: string, label: string) => {
    setTesting(id);
    setTimeout(() => { setTesting(null); add({ type: "success", title: "Test print sent", body: `Test page sent to ${label} printer.` }); }, 1500);
  };

  return (
    <div>
      <PageHeader title="Print Settings" sub="Printer configuration by purpose, templates, and auto-print triggers"
        actions={<button onClick={() => add({ type: "success", title: "Print settings saved" })} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save</button>}
      />

      <div className="space-y-4">
        {PRINTER_PURPOSES.map((purpose, i) => {
          const Icon = purpose.icon;
          const printer = printers[i];
          return (
            <div key={purpose.id} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
                    <Printer size={16} style={{ color: PRIMARY }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>{purpose.label}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Purpose: {purpose.id}</div>
                  </div>
                </div>
                <button
                  onClick={() => testPrint(purpose.id, purpose.label)}
                  disabled={testing === purpose.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs"
                  style={{ borderColor: BORDER, color: MUTED }}
                >
                  <Printer size={12} className={testing === purpose.id ? "animate-pulse" : ""} />
                  {testing === purpose.id ? "Printing…" : "Test Print"}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Network Address / IP</div>
                  <input
                    value={printer.address}
                    onChange={e => setPrinters(prev => prev.map((p, j) => j === i ? { ...p, address: e.target.value } : p))}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                    style={{ borderColor: BORDER, fontFamily: mono }}
                  />
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Paper Size</div>
                  <select
                    value={printer.paper}
                    onChange={e => setPrinters(prev => prev.map((p, j) => j === i ? { ...p, paper: e.target.value } : p))}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                    style={{ borderColor: BORDER }}
                  >
                    {purpose.paper.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Template</div>
                  <select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor: BORDER }}>
                    {["Default", "Branded", "Minimal"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Copies</div>
                  <input
                    type="number"
                    value={printer.copies}
                    min={1} max={5}
                    onChange={e => setPrinters(prev => prev.map((p, j) => j === i ? { ...p, copies: Number(e.target.value) } : p))}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                    style={{ borderColor: BORDER }}
                  />
                </div>
              </div>

              {/* Auto-print triggers */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: BORDER }}>
                <div className="text-xs font-medium mb-2" style={{ color: MUTED }}>Auto-print triggers</div>
                <div className="flex gap-3 flex-wrap">
                  {AUTO_TRIGGERS.map(trigger => {
                    const active = printer.autoTriggers.includes(trigger);
                    return (
                      <button
                        key={trigger}
                        onClick={() => setPrinters(prev => prev.map((p, j) => j === i ? {
                          ...p,
                          autoTriggers: active ? p.autoTriggers.filter(t => t !== trigger) : [...p.autoTriggers, trigger],
                        } : p))}
                        className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
                        style={{
                          backgroundColor: active ? "#EFF6FF" : "white",
                          borderColor: active ? PRIMARY : BORDER,
                          color: active ? PRIMARY : MUTED,
                        }}
                      >
                        {trigger}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
