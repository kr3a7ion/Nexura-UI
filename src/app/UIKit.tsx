// All screen components and shared UI primitives.
// Imported by App.tsx — no circular dependencies.
import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, CalendarDays, KeyRound, BedDouble, Wrench,
  UtensilsCrossed, MessageSquare, DollarSign, Package, Users,
  Building2, BarChart3, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, User, ChevronDown, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, WifiOff, Plus, Search, Filter,
  MoreHorizontal, ArrowRight, Home, Layers, X, Lock, Globe,
  ClipboardList, CalendarCheck, Star, AlertCircle, Clock,
  RefreshCw, Hash, FileText, CreditCard, Truck, Phone,
  Edit3, Eye, Trash2, Download, Send, Menu as MenuIcon,
  HelpCircle, Shield, Server, Cpu, Activity, Wifi,
  MinusCircle, PlusCircle, ShoppingCart, MapPin, Mail,
  UserCheck, BookOpen, Inbox, Zap,
  ArrowDownToLine, ArrowUpFromLine, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  type Role, type Toast, type ToastType, type AddToast, fmtN, uid, actC, actBg,
  mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE,
  hkC, woC, priC, tblC, stC, roomStC, resStC,
  occData, occ30Data, revCat, roomSt, deptKPIs, recentAct, ROOMS, RES_GRID, IN_HOUSE, WORK_ORDERS,
  HK_ROOMS, STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ALL_RES, ARRIVALS_DATA, ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, ASSETS, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  HK_TASK_ROOMS, INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA,
} from "./constants";

// ─── UI Primitives ──────────────────────────────────────────────────────────
// ─── PREMIUM UI PRIMITIVES ────────────────────────────────────────────────────

export function Badge({ label, colors }: { label: string; colors: { bg: string; text: string } }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text, letterSpacing: "0.01em" }}>
      {label}
    </span>
  );
}

export function EmptyState({ icon: Icon, message, cta, onCta }: { icon: React.ElementType; message: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-sm"
        style={{ background: "linear-gradient(135deg, #F4F4F5, #E4E4E7)" }}>
        <Icon size={26} color={SUBTLE} />
      </div>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: MUTED }}>{message}</p>
      {cta && (
        <button onClick={onCta} className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: PRIMARY }}>
          {cta}
        </button>
      )}
    </div>
  );
}

export function ToastC({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  const cfg: Record<ToastType, { bg: string; border: string; icon: React.ElementType; accent: string }> = {
    success: { bg: "#EFFEF7", border: "#86EFAC", icon: CheckCircle2, accent: "#16A34A" },
    error:   { bg: "#FFF1F2", border: "#FDA4AF", icon: AlertCircle, accent: "#E11D48" },
    info:    { bg: "#EFF6FF", border: "#93C5FD", icon: AlertCircle, accent: "#2563EB" },
    warning: { bg: "#FFFBEB", border: "#FCD34D", icon: AlertTriangle, accent: "#D97706" },
  };
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none" style={{ maxWidth: 360 }}>
      {toasts.map(t => { const c = cfg[t.type]; const Icon = c.icon; return (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border min-w-72"
          style={{ backgroundColor: c.bg, borderColor: c.border }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${c.accent}15` }}>
            <Icon size={14} style={{ color: c.accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: TEXT }}>{t.title}</div>
            {t.body && <div className="text-xs mt-0.5 leading-relaxed" style={{ color: MUTED }}>{t.body}</div>}
          </div>
          <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100 transition-opacity mt-0.5" style={{ color: MUTED }}>
            <X size={14} />
          </button>
        </div>
      ); })}
    </div>
  );
}

export function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="text-right">
      <div className="text-sm font-semibold text-white leading-none tracking-wide" style={{ fontFamily: mono, letterSpacing: "0.05em" }}>
        {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "#A1A1AA", fontFamily: mono }}>
        {t.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
}

export function SyncPill() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
      style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.20)" }}>
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
      Synced
    </div>
  );
}

export function StatCard({ label, value, sub, delta, deltaPositive, icon: Icon, accent }: {
  label: string; value: string; sub: string; delta?: string; deltaPositive?: boolean; icon: React.ElementType; accent: string;
}) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
      style={{ backgroundColor: "#FFFFFF", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-5 right-5 h-px rounded-b-full opacity-80" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}40)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}0a)`, border: `1px solid ${accent}18` }}>
          <Icon size={21} style={{ color: accent }} />
        </div>
        {delta && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${deltaPositive ? "text-emerald-700" : "text-rose-600"}`}
            style={{ backgroundColor: deltaPositive ? "#ECFDF5" : "#FFF1F2" }}>
            {deltaPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {delta}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold leading-none mb-1.5 tracking-tight" style={{ color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: MUTED, letterSpacing: "0.08em" }}>{label}</div>
      <div className="text-xs" style={{ color: SUBTLE }}>{sub}</div>
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-bold tracking-tight" style={{ color: TEXT, fontSize: 22, fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
        {sub && <p className="text-sm mt-0.5" style={{ color: MUTED }}>{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function BtnP({ label, icon: Icon, onClick, color }: { label: string; icon?: React.ElementType; onClick?: () => void; color?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0"
      style={{ backgroundColor: color ?? PRIMARY }}>
      {Icon && <Icon size={14} />}{label}
    </button>
  );
}

export function BtnO({ label, icon: Icon, onClick }: { label: string; icon?: React.ElementType; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white hover:bg-[#F4F4F5] transition-all hover:shadow-sm"
      style={{ color: "#52525B", borderColor: "#D4D4D8" }}>
      {Icon && <Icon size={14} />}{label}
    </button>
  );
}
export function Inp({ label, placeholder, type, defaultValue }: { label?: string; placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      {label && <label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{label}</label>}
      <input type={type ?? "text"} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
    </div>
  );
}
export function Sel({ label, options }: { label?: string; options: string[] }) {
  return (
    <div>
      {label && <label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{label}</label>}
      <select className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// Gender-coded SVG avatar: blue for male, purple for female
function Av({ gender = "M", size = 36 }: { gender?: "M" | "F"; size?: number }) {
  const isFemale = gender === "F";
  const bg = isFemale ? "#FDF4FF" : "#EFF6FF";
  const fg = isFemale ? "#A855F7" : "#3B82F6";
  const border = isFemale ? "#E9D5FF" : "#BFDBFE";
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ width: size, height: size, backgroundColor: bg, border: `2px solid ${border}` }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 24 24" fill={fg}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        {isFemale && <path d="M8.5 6 C9 3.5 15 3.5 15.5 6" fill="none" stroke={fg} strokeWidth="1.5" strokeLinecap="round" />}
      </svg>
    </div>
  );
}
export function DashboardMgmt({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [auditRunning, setAuditRunning] = useState(false);
  const go = (s: string, l: string) => nav && nav(s, l);

  const KPIS = [
    { label: "Occupancy", value: "88%", sub: "62 / 100 rooms", delta: "+4%", up: true, icon: Building2, accent: PRIMARY },
    { label: "ADR", value: "₦55,000", sub: "per occupied room", delta: "+₦2,100", up: true, icon: TrendingUp, accent: TEAL },
    { label: "RevPAR", value: "₦48,400", sub: "revenue per avail. room", delta: "+₦1,700", up: true, icon: BarChart3, accent: TEAL },
    { label: "Revenue Today", value: "₦1.25M", sub: "target: ₦1.1M · +13.5%", delta: "+13.5%", up: true, icon: DollarSign, accent: SUCCESS },
    { label: "Arrivals", value: "12", sub: "4 still pending room", delta: "—", up: true, icon: ArrowDownToLine, accent: PRIMARY },
    { label: "Departures", value: "8", sub: "3 still in-house", delta: "—", up: true, icon: ArrowUpFromLine, accent: MUTED },
    { label: "In House", value: "94", sub: "guests on property", delta: "+6 vs yesterday", up: true, icon: Users, accent: ORANGE },
    { label: "Complaints", value: "2", sub: "1 SLA at risk", delta: "+1 since 08:00", up: false, icon: AlertTriangle, accent: ERROR },
  ];

  const ALERTS = [
    { icon: Wrench, label: "2 work orders overdue", sub: "WO-0090 · WO-0088 — SLA breached", color: ERROR, screen: "work-orders", sl: "Work Orders" },
    { icon: Package, label: "3 items below reorder level", sub: "Towels · Breakfast cereals · Diesel", color: ORANGE, screen: "stock-dashboard", sl: "Stock Dashboard" },
    { icon: Truck, label: "Vehicle licence expiring", sub: "ABU-423-XK expiring in 8 days", color: WARNING, screen: "asset-register", sl: "Asset Register" },
    { icon: Shield, label: "Backup age: 26 h", sub: "Last successful backup 01 Aug 07:14", color: ORANGE, screen: "backup-restore", sl: "Backup & Restore" },
    { icon: Globe, label: "Lagos branch sync lag: 45 min", sub: "Last snapshot received 01 Aug 10:12", color: MUTED, screen: "sync-status", sl: "Central Sync Status" },
  ];

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold" style={{ color: TEXT }}>Management Dashboard</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>Grand Palms, Abuja &nbsp;·&nbsp; Business date: 01 Aug 2026</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => go("new-reservation", "New Reservation")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}><Plus size={13} />New Reservation</button>
          <button onClick={() => go("check-in", "Check-In")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ color: TEXT, borderColor: BORDER }}><ArrowDownToLine size={13} />Check-In</button>
          <button onClick={() => go("check-out", "Check-Out")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ color: TEXT, borderColor: BORDER }}><ArrowUpFromLine size={13} />Check-Out</button>
        </div>
      </div>

      {/* ── KPI Strip — 8 cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
        {KPIS.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl p-3.5 border" style={{ borderColor: BORDER }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${k.accent}14` }}>
                  <Icon size={14} style={{ color: k.accent }} />
                </div>
                {k.delta !== "—" && (
                  <span className="text-xs font-semibold flex items-center gap-0.5"
                    style={{ color: k.up ? SUCCESS : ERROR }}>
                    {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{k.delta}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold tracking-tight mb-0.5" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: k.accent }}>{k.label}</div>
              <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid: chart + room status + revenue donut ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

        {/* Occupancy trend — 30 days */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: TEXT }}>Occupancy Trend</div>
              <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>June 2026 — 30 days</div>
            </div>
            <div className="flex gap-4 text-xs" style={{ color: MUTED }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: PRIMARY }} />Occupancy %</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: TEAL }} />RevPAR (₦K)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={occ30Data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: SUBTLE }} axisLine={false} tickLine={false}
                tickFormatter={(v) => Number(v) % 5 === 1 ? v : ""} />
              <YAxis tick={{ fontSize: 10, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
                formatter={(v: any, n: any) => [n === "rev" ? `₦${v}K` : `${v}%`, n === "rev" ? "RevPAR" : "Occupancy"]} />
              <Area type="monotone" dataKey="occ" name="Occupancy" stroke={PRIMARY} strokeWidth={2} fill={PRIMARY + "18"} dot={false} />
              <Area type="monotone" dataKey="rev" name="Revenue" stroke={TEAL} strokeWidth={2} fill={TEAL + "18"} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by category — donut */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 border" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Revenue by Category</div>
          <div className="text-xs mb-3" style={{ color: SUBTLE }}>Today · total ₦1.25M</div>
          <div className="flex items-center justify-center">
            <PieChart width={130} height={130}>
              <Pie data={revCat} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} strokeWidth={0}>
                {revCat.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5 mt-2">
            {revCat.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />{c.name}</span>
                <span className="font-semibold" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room status panel */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 border" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Room Status</div>
            <button onClick={() => go("hk-board", "Housekeeping Board")} className="text-xs font-semibold" style={{ color: TEAL }}>Board →</button>
          </div>
          <div className="space-y-2">
            {roomSt.map(r => (
              <div key={r.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: TEXT }}>{r.status}</span>
                  <span className="text-xs font-bold" style={{ color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: BORDER }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(r.count / 100) * 100}%`, backgroundColor: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t text-xs" style={{ borderColor: BORDER, color: MUTED }}>100 rooms total</div>
        </div>
      </div>

      {/* ── Department KPI grid + Activity feed ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

        {/* Department KPI grid */}
        <div className="lg:col-span-5 bg-white rounded-xl border" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Department KPIs</div>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {deptKPIs.map(d => {
              const Icon = d.icon;
              const sc = d.st === "error" ? { bg: "#FEE2E2", text: "#991B1B" } : d.st === "warning" ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#DCFCE7", text: "#166534" };
              return (
                <div key={d.dept} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sc.text}14` }}>
                    <Icon size={15} style={{ color: sc.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{d.dept}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{d.metric} · {d.sub}</div>
                  </div>
                  <div className="text-sm font-bold flex-shrink-0" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{d.value}</div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sc.bg, color: sc.text }}>
                    {d.st === "error" ? "Alert" : d.st === "warning" ? "Attn" : "OK"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity feed */}
        <div className="lg:col-span-4 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Live Activity</div>
            <button onClick={() => go("audit-log", "Audit Log")} className="text-xs font-semibold" style={{ color: TEAL }}>Full log →</button>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {recentAct.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 px-5 py-3">
                <Av gender={i % 2 === 0 ? "M" : "F"} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: TEXT }}>{r.guest}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: actBg(r.type), color: actC(r.type) }}>{r.action}</span>
                    <span className="text-xs" style={{ color: SUBTLE }}>Rm {r.room}</span>
                  </div>
                </div>
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: SUBTLE, fontFamily: "'JetBrains Mono', monospace" }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Night Audit */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Alerts panel */}
          <div className="bg-white rounded-xl border flex-1" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: BORDER }}>
              <AlertTriangle size={13} style={{ color: ERROR }} />
              <div className="text-sm font-semibold" style={{ color: TEXT }}>Alerts</div>
              <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{ALERTS.length}</span>
            </div>
            <div className="divide-y" style={{ borderColor: BORDER }}>
              {ALERTS.map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => go(a.screen as any, a.sl)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F0F4F8]">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${a.color}14` }}>
                      <Icon size={12} style={{ color: a.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: TEXT }}>{a.label}</div>
                      <div className="text-xs truncate" style={{ color: SUBTLE }}>{a.sub}</div>
                    </div>
                    <ArrowRight size={11} style={{ color: SUBTLE }} className="flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Night audit status card */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: auditRunning ? `${TEAL}14` : "#FEF3C7" }}>
                <RefreshCw size={13} style={{ color: auditRunning ? TEAL : "#92400E" }} className={auditRunning ? "animate-spin" : ""} />
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: TEXT }}>Night Audit</div>
                <div className="text-xs" style={{ color: SUBTLE }}>Business date: 01 Aug 2026</div>
              </div>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: auditRunning ? `${TEAL}14` : "#FEF3C7", color: auditRunning ? TEAL : "#92400E" }}>
                {auditRunning ? "Running…" : "Pending"}
              </span>
            </div>
            <div className="text-xs mb-3" style={{ color: MUTED }}>
              Last run: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: TEXT }}>31 Jul 2026 · 23:58</span>
            </div>
            {!auditRunning ? (
              <button onClick={() => { setAuditRunning(true); add({ type: "info", title: "Night audit started", body: "Processing business date 01 Aug 2026…" }); setTimeout(() => { setAuditRunning(false); add({ type: "success", title: "Night audit complete", body: "Business date rolled to 02 Aug 2026." }); }, 4000); }}
                className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}>
                Run Night Audit
              </button>
            ) : (
              <div className="w-full py-2 rounded-xl text-xs font-semibold text-center" style={{ backgroundColor: `${TEAL}14`, color: TEAL }}>
                Processing…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Role Dashboard ───────────────────────────────────────────────────────────
function RoleKPI({ label, value, sub, accent, icon: Icon }: { label: string; value: string; sub: string; accent: string; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-xl p-4 border" style={{ borderColor: BORDER }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${accent}14` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>{label}</div>
      <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{sub}</div>
    </div>
  );
}

function RoleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
        <div className="text-sm font-semibold" style={{ color: TEXT }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

export function DashboardRole({ role, nav }: { role: Role; nav?: (s: string, label: string) => void }) {
  const go = (s: string, l: string) => nav && nav(s, l);

  // ── FD Dashboard ─────────────────────────────────────────────────────────────
  if (role === "FD") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Front Desk</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Morning shift 07:00–15:00</div></div>
        <div className="flex gap-2">
          <button onClick={() => go("walk-in", "Walk-In Registration")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
            <Plus size={13} />Walk-In
          </button>
          <button onClick={() => go("check-in", "Check-In")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <ArrowDownToLine size={13} />Check-In
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Arrivals Today" value="12" sub="4 still pending" accent={PRIMARY} icon={ArrowDownToLine} />
        <RoleKPI label="Departures Today" value="8" sub="3 still in-house" accent={MUTED} icon={ArrowUpFromLine} />
        <RoleKPI label="Rooms Ready" value="18" sub="available now" accent={SUCCESS} icon={BedDouble} />
        <RoleKPI label="Open Balances" value="₦284K" sub="3 guest folios" accent={ERROR} icon={DollarSign} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Today's Arrivals">
          {IN_HOUSE.slice(0, 4).map((g, i) => (
            <div key={g.room} className="flex items-center gap-3 px-5 py-3 border-b cursor-pointer transition-colors"
              style={{ borderColor: BORDER }} onClick={() => go("arrivals", "Arrivals")}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Av gender={i % 2 === 0 ? "M" : "F"} size={34} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1"><span className="text-sm font-semibold truncate" style={{ color: TEXT }}>{g.guest}</span>
                  {g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Out {g.checkout}</div>
              </div>
              {g.balance > 0 ? <span className="text-xs font-bold" style={{ color: ERROR, fontFamily: "'JetBrains Mono', monospace" }}>₦{g.balance.toLocaleString()}</span>
                : <CheckCircle2 size={14} style={{ color: SUCCESS }} />}
            </div>
          ))}
        </RoleCard>
        <RoleCard title="Guest Messages">
          {[
            { room: "204", guest: "Blessing Okafor", msg: "Requesting late checkout — 14:00 please", time: "09:31", unread: true },
            { room: "302", guest: "Ibrahim Lawal", msg: "Extra towels needed urgently", time: "09:15", unread: true },
            { room: "118", guest: "Emmanuel Adeyemi", msg: "AC not cooling properly. Room feels warm.", time: "08:47", unread: false },
          ].map((m, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3 border-b cursor-pointer transition-colors"
              style={{ borderColor: BORDER }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              {m.unread && <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: PRIMARY }} />}
              {!m.unread && <div className="w-1.5 flex-shrink-0" />}
              <Av gender={i % 2 === 0 ? "F" : "M"} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{m.guest} <span style={{ color: SUBTLE }}>· Rm {m.room}</span></div>
                <div className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{m.msg}</div>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: SUBTLE, fontFamily: "'JetBrains Mono', monospace" }}>{m.time}</span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── HK Dashboard ─────────────────────────────────────────────────────────────
  if (role === "HK") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Housekeeping</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Morning shift</div></div>
        <button onClick={() => go("hk-board", "Housekeeping Board")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <BedDouble size={13} />HK Board
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Assigned" value="40" sub="rooms this shift" accent={PRIMARY} icon={BedDouble} />
        <RoleKPI label="Dirty" value="14" sub="3 departures priority" accent={ERROR} icon={AlertTriangle} />
        <RoleKPI label="Clean / Ready" value="18" sub="inspected & released" accent={SUCCESS} icon={CheckCircle2} />
        <RoleKPI label="DND Rooms" value="3" sub="wellness check due × 1" accent={WARNING} icon={XCircle} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Room Status Grid">
          <div className="p-4 grid grid-cols-2 gap-2">
            {HK_ROOMS.slice(0, 8).map(r => {
              const c = hkC[r.hkSt] ?? { bg: "#F3F4F6", text: "#374151" };
              return (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: BORDER }}>
                  <div>
                    <div className="text-sm font-bold" style={{ color: TEXT }}>Rm {r.id}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{r.type}</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>{r.hkSt}</span>
                </div>
              );
            })}
          </div>
        </RoleCard>
        <RoleCard title="My Attendants">
          {[
            { name: "Grace Achebe", rooms: 14, done: 9, status: "Active" },
            { name: "Amaka Osei", rooms: 13, done: 7, status: "Active" },
            { name: "Ngozi Ike", rooms: 13, done: 5, status: "On break" },
          ].map(a => (
            <div key={a.name} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
              <Av gender="F" size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{a.name}</div>
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>{a.done}/{a.rooms} rooms done</div>
                <div className="h-1.5 rounded-full mt-1.5" style={{ backgroundColor: BORDER }}>
                  <div className="h-full rounded-full" style={{ width: `${(a.done / a.rooms) * 100}%`, backgroundColor: TEAL }} />
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: a.status === "Active" ? "#D1FAE5" : "#FEF3C7", color: a.status === "Active" ? "#065F46" : "#92400E" }}>
                {a.status}
              </span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── MX Dashboard ─────────────────────────────────────────────────────────────
  if (role === "MX") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Maintenance</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Technician view</div></div>
        <button onClick={() => go("work-orders", "Work Orders")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <Wrench size={13} />Work Orders
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Open Orders" value="7" sub="all priorities" accent={PRIMARY} icon={Wrench} />
        <RoleKPI label="Overdue" value="2" sub="SLA breached" accent={ERROR} icon={AlertTriangle} />
        <RoleKPI label="PM Due" value="1" sub="generator — 7 days" accent={ORANGE} icon={CalendarCheck} />
        <RoleKPI label="Completed" value="3" sub="this shift" accent={SUCCESS} icon={CheckCircle2} />
      </div>
      <RoleCard title="My Work Orders">
        {WORK_ORDERS.slice(0, 5).map(wo => {
          const sc = woC[wo.status] ?? { bg: "#F3F4F6", text: "#374151" };
          const pc = priC[wo.priority] ?? MUTED;
          return (
            <div key={wo.id} className="flex items-center gap-4 px-5 py-3.5 border-b cursor-pointer transition-colors"
              style={{ borderColor: BORDER }} onClick={() => go("work-order-detail", "Work Order Detail")}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: pc }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{wo.id}</div>
                <div className="text-xs" style={{ color: MUTED }}>{wo.location} · {wo.cat}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{wo.status}</span>
              <span className="text-xs" style={{ color: SUBTLE }}>{wo.age}</span>
            </div>
          );
        })}
      </RoleCard>
    </div>
  );

  // ── RT Dashboard ─────────────────────────────────────────────────────────────
  if (role === "RT") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Restaurant & POS</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Breakfast 06:30–10:30</div></div>
        <button onClick={() => go("pos-terminal", "POS Terminal")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <UtensilsCrossed size={13} />Open POS
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Covers Today" value="47" sub="breakfast service" accent={PRIMARY} icon={Users} />
        <RoleKPI label="Open Tables" value="8/24" sub="tables available" accent={SUCCESS} icon={UtensilsCrossed} />
        <RoleKPI label="KDS Queue" value="4" sub="orders in kitchen" accent={ORANGE} icon={ClipboardList} />
        <RoleKPI label="F&B Revenue" value="₦225K" sub="today so far" accent={TEAL} icon={DollarSign} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="KDS Queue">
          {[
            { order: "T-04", items: "Full English × 2, Orange juice × 2", elapsed: "08:12", status: "Preparing" },
            { order: "T-09", items: "Pancakes × 1, Coffee × 1", elapsed: "04:30", status: "Ready" },
            { order: "RS-041", items: "Club sandwich × 1, Fries × 1", elapsed: "02:05", status: "New" },
            { order: "T-12", items: "Omelette × 3, Toast × 3", elapsed: "00:45", status: "New" },
          ].map(o => {
            const sc = o.status === "Ready" ? { bg: "#DCFCE7", text: "#166534" } : o.status === "Preparing" ? { bg: "#DBEAFE", text: "#1E40AF" } : { bg: "#FEF3C7", text: "#92400E" };
            return (
              <div key={o.order} className="flex items-start gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
                <div className="text-sm font-bold flex-shrink-0" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace", minWidth: 40 }}>{o.order}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: MUTED }}>{o.items}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold" style={{ color: Number(o.elapsed.split(":")[0]) > 5 ? ERROR : TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{o.elapsed}</div>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{o.status}</span>
                </div>
              </div>
            );
          })}
        </RoleCard>
        <RoleCard title="Top Items Today">
          {[
            { item: "Full English Breakfast", count: 18, rev: "₦162K" },
            { item: "Pancakes with Syrup", count: 11, rev: "₦66K" },
            { item: "Club Sandwich", count: 9, rev: "₦81K" },
            { item: "Jollof Rice Platter", count: 7, rev: "₦84K" },
          ].map((t, i) => (
            <div key={t.item} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
              <span className="text-xs font-bold" style={{ color: SUBTLE, minWidth: 16 }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{t.item}</div>
                <div className="text-xs" style={{ color: MUTED }}>{t.count} orders</div>
              </div>
              <span className="text-xs font-bold" style={{ color: SUCCESS, fontFamily: "'JetBrains Mono', monospace" }}>{t.rev}</span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── FIN Dashboard ─────────────────────────────────────────────────────────────
  if (role === "FIN") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Finance & Billing</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Day close: Pending</div></div>
        <button onClick={() => go("daily-summary", "Daily Summary")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <DollarSign size={13} />Daily Summary
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Revenue Today" value="₦1.25M" sub="113% of ₦1.1M target" accent={SUCCESS} icon={TrendingUp} />
        <RoleKPI label="Outstanding" value="₦284K" sub="3 open guest folios" accent={ERROR} icon={FileText} />
        <RoleKPI label="AP Due This Week" value="₦640K" sub="2 suppliers overdue" accent={ORANGE} icon={CreditCard} />
        <RoleKPI label="Day Close" value="Pending" sub="audit not yet run" accent={WARNING} icon={RefreshCw} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Open Folios">
          {IN_HOUSE.filter(g => g.balance > 0).map((g, i) => (
            <div key={g.room} className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
              <Av gender={i % 2 === 0 ? "M" : "F"} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{g.guest}</div>
                <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Out {g.checkout}</div>
              </div>
              <span className="text-sm font-bold" style={{ color: ERROR, fontFamily: "'JetBrains Mono', monospace" }}>₦{g.balance.toLocaleString()}</span>
            </div>
          ))}
        </RoleCard>
        <RoleCard title="Unposted Charges">
          {[
            { desc: "Room charge — Rm 202 × 1 night", amount: "₦55,000", dept: "Rooms" },
            { desc: "Room Service Rm 118 × RS-041", amount: "₦8,500", dept: "F&B" },
            { desc: "Minibar Rm 304 × 2 items", amount: "₦3,200", dept: "F&B" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{c.desc}</div>
                <div className="text-xs" style={{ color: MUTED }}>{c.dept}</div>
              </div>
              <span className="text-sm font-bold" style={{ color: ORANGE, fontFamily: "'JetBrains Mono', monospace" }}>{c.amount}</span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── RSV Dashboard ─────────────────────────────────────────────────────────────
  if (role === "RSV") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Reservations</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Reservations Officer view</div></div>
        <button onClick={() => go("new-reservation", "New Reservation")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <Plus size={13} />New Reservation
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Bookings Today" value="7" sub="4 confirmed · 3 pending" accent={PRIMARY} icon={CalendarDays} />
        <RoleKPI label="Pipeline (7d)" value="34" sub="reservations ahead" accent={TEAL} icon={TrendingUp} />
        <RoleKPI label="Waitlist" value="3" sub="guests waiting" accent={ORANGE} icon={ClipboardList} />
        <RoleKPI label="Group Blocks" value="1" sub="12 rooms · 60% picked up" accent={SUCCESS} icon={Users} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Upcoming Reservations">
          {ALL_RES.slice(0, 5).map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
              <Av gender={i % 2 === 0 ? "M" : "F"} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: TEXT }}>{r.guest}</div>
                <div className="text-xs" style={{ color: MUTED }}>{r.checkin} – {r.checkout} · {r.type}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: resStC[r.status]?.bg ?? "#F3F4F6", color: resStC[r.status]?.text ?? "#374151" }}>{r.status}</span>
            </div>
          ))}
        </RoleCard>
        <RoleCard title="Waitlist">
          {WAITLIST_DATA.slice(0, 4).map((w, i) => (
            <div key={w.id} className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
              <Av gender={i % 2 === 0 ? "F" : "M"} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{w.guest}</div>
                <div className="text-xs" style={{ color: MUTED }}>{w.dates} · {w.type}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Waiting</span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── IT Dashboard ─────────────────────────────────────────────────────────────
  if (role === "IT") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>IT Administration</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · System status</div></div>
        <button onClick={() => go("system-health", "System Health")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          <Server size={13} />System Health
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Uptime" value="99.8%" sub="30-day average" accent={SUCCESS} icon={Activity} />
        <RoleKPI label="Devices Online" value="23/26" sub="3 offline / idle" accent={ORANGE} icon={Cpu} />
        <RoleKPI label="Backup Age" value="26 h" sub="last: 31 Jul 07:14" accent={ERROR} icon={Shield} />
        <RoleKPI label="Sync Lag" value="45 min" sub="Lagos branch" accent={WARNING} icon={Globe} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Service Checks">
          {[
            { service: "Database", status: "Writable", ok: true },
            { service: "Lock Provider API", status: "Reachable", ok: true },
            { service: "Central Sync", status: "Connected", ok: true },
            { service: "Receipt Printer", status: "Offline", ok: false },
            { service: "FIRS e-Invoice", status: "Warning — TIN mismatch", ok: false },
          ].map(s => (
            <div key={s.service} className="flex items-center gap-4 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.ok ? SUCCESS : ERROR }} />
              <div className="flex-1 text-xs font-semibold" style={{ color: TEXT }}>{s.service}</div>
              <span className="text-xs" style={{ color: s.ok ? MUTED : ERROR }}>{s.status}</span>
            </div>
          ))}
        </RoleCard>
        <RoleCard title="Device Status">
          {DEVICES.slice(0, 5).map(d => (
            <div key={d.id} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: TEXT }}>{d.name}</div>
                <div className="text-xs" style={{ color: MUTED }}>{d.type} · {d.class}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: d.status === "Active" ? "#DCFCE7" : d.status === "Offline" ? "#FEE2E2" : "#F3F4F6", color: d.status === "Active" ? "#166534" : d.status === "Offline" ? "#991B1B" : "#374151" }}>
                {d.status}
              </span>
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );

  // ── MGT / default Dashboard (same as DashboardMgmt but role-contextualised) ──
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Management Overview</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Role: {role}</div></div>
        <div className="flex gap-2">
          <button onClick={() => go("new-reservation", "New Reservation")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <Plus size={13} />New Reservation
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Occupancy" value="88%" sub="62 / 100 rooms" accent={PRIMARY} icon={Building2} />
        <RoleKPI label="Revenue Today" value="₦1.25M" sub="+13.5% vs target" accent={SUCCESS} icon={DollarSign} />
        <RoleKPI label="In House" value="94" sub="12 arrivals today" accent={ORANGE} icon={Users} />
        <RoleKPI label="Open Issues" value="9" sub="7 MX · 2 complaints" accent={ERROR} icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleCard title="Department Status">
          {deptKPIs.map(d => {
            const Icon = d.icon;
            const sc = d.st === "error" ? { bg: "#FEE2E2", text: "#991B1B" } : d.st === "warning" ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#DCFCE7", text: "#166534" };
            return (
              <div key={d.dept} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${sc.text}14` }}>
                  <Icon size={14} style={{ color: sc.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{d.dept} — {d.value}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{d.metric} · {d.sub}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: sc.bg, color: sc.text }}>
                  {d.st === "error" ? "Alert" : d.st === "warning" ? "Attn" : "OK"}
                </span>
              </div>
            );
          })}
        </RoleCard>
        <RoleCard title="Today's Guest Activity">
          {IN_HOUSE.slice(0, 4).map((g, i) => (
            <div key={g.room} className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
              <Av gender={i % 2 === 0 ? "M" : "F"} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1"><span className="text-xs font-semibold" style={{ color: TEXT }}>{g.guest}</span>
                  {g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Out {g.checkout}</div>
              </div>
              {g.balance > 0 ? <span className="text-xs font-bold" style={{ color: ERROR, fontFamily: "'JetBrains Mono', monospace" }}>₦{g.balance.toLocaleString()}</span>
                : <CheckCircle2 size={13} style={{ color: SUCCESS }} />}
            </div>
          ))}
        </RoleCard>
      </div>
    </div>
  );
}

export function ReservationGrid({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset, setOffset] = useState(0);
  const [filterType, setFilterType] = useState("All");
  const [filterFloor, setFilterFloor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(TODAY); d.setDate(TODAY.getDate() + offset + i); return d; });
  const DW = 58; const RH = 44;
  const todayIdx = days.findIndex(d => d.toDateString() === TODAY.toDateString());
  const allFloors = [...new Set(ROOMS.map(r => r.floor))].sort() as number[];
  const filteredRooms = ROOMS.filter(r => {
    if (filterType !== "All" && r.type !== filterType) return false;
    if (filterFloor !== "All" && r.floor !== Number(filterFloor)) return false;
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    return true;
  });
  const occPerDay = days.map((_, di) => {
    const occupied = filteredRooms.filter(room => RES_GRID.some(r => r.room === room.id && r.start <= di && r.end > di)).length;
    return filteredRooms.length > 0 ? Math.round((occupied / filteredRooms.length) * 100) : 0;
  });
  return (
    <div>
      <PageHeader title="Reservation Grid" sub="14-day availability · Click empty cell to create · Click bar for detail"
        actions={<><BtnO label="Today" icon={CalendarDays} onClick={() => setOffset(0)} /><BtnP label="New Reservation" icon={Plus} onClick={() => nav && nav("new-reservation","New Reservation")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Reservations" value={String(RES_GRID.length)} sub="All statuses" icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Today's Arrivals" value={"3"} sub="Checking in today" icon={ArrowDownToLine} accent={TEAL} />
        <StatCard label="VIP Guests" value={"2"} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Unconfirmed" value={"1"} sub="Need confirmation" icon={AlertCircle} accent={ERROR} />
      </div>
      <div className="flex gap-4">
        {/* Sidebar filters */}
        <div className="w-44 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: BORDER }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Room Type</div>
            {["All","Standard","Deluxe","Suite"].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className="w-full text-left text-xs px-2 py-1.5 rounded-lg mb-0.5 transition-colors"
                style={{ backgroundColor: filterType === t ? "#EFF6FF" : "transparent", color: filterType === t ? PRIMARY : TEXT, fontWeight: filterType === t ? 600 : 400 }}>{t}</button>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: BORDER }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Floor</div>
            {["All",...allFloors.map(String)].map(f => (
              <button key={f} onClick={() => setFilterFloor(f)} className="w-full text-left text-xs px-2 py-1.5 rounded-lg mb-0.5 transition-colors"
                style={{ backgroundColor: filterFloor === f ? "#EFF6FF" : "transparent", color: filterFloor === f ? PRIMARY : TEXT, fontWeight: filterFloor === f ? 600 : 400 }}>
                {f === "All" ? "All Floors" : `Floor ${f}`}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: BORDER }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Status</div>
            {["All","Available","Occupied","Maintenance"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className="w-full text-left text-xs px-2 py-1.5 rounded-lg mb-0.5 transition-colors"
                style={{ backgroundColor: filterStatus === s ? "#EFF6FF" : "transparent", color: filterStatus === s ? PRIMARY : TEXT, fontWeight: filterStatus === s ? 600 : 400 }}>{s}</button>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: BORDER }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Legend</div>
            {[{ label: "Confirmed", color: TEAL }, { label: "Checked In", color: SUCCESS }, { label: "Pending", color: ORANGE }, { label: "Checked Out", color: SUBTLE }].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-xs mb-1.5" style={{ color: TEXT }}>
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: l.color }} />{l.label}
              </div>
            ))}
          </div>
        </div>
        {/* Grid */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <button onClick={() => setOffset(o => o - 7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}><ChevronLeft size={13} />Prev 7</button>
            <span className="text-sm font-semibold" style={{ color: TEXT }}>
              {days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[13].toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}
            </span>
            <button onClick={() => setOffset(o => o + 7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Next 7<ChevronRight size={13} /></button>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 520 }}>
            <div style={{ minWidth: 200 + DW * 14 }}>
              <div className="flex sticky top-0 z-10" style={{ backgroundColor: "#F9FAFB", borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 flex items-center px-4 py-2" style={{ width: 200, borderRight: `1px solid ${BORDER}` }}>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Room · {filteredRooms.length}</span>
                </div>
                {days.map((d, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center py-1.5" style={{ width: DW, borderRight: `1px solid ${BORDER}`, backgroundColor: i === todayIdx ? "#EFF6FF" : "transparent" }}>
                    <span className="text-xs font-semibold" style={{ color: i === todayIdx ? PRIMARY : TEXT }}>{d.toLocaleDateString("en-NG",{weekday:"short"})}</span>
                    <span className="text-xs" style={{ color: i === todayIdx ? PRIMARY : SUBTLE }}>{d.getDate()}/{d.getMonth()+1}</span>
                    {i === todayIdx && <span className="text-xs font-bold" style={{ color: PRIMARY, fontSize: 9 }}>TODAY</span>}
                  </div>
                ))}
              </div>
              {filteredRooms.map(room => {
                const res = RES_GRID.filter(r => r.room === room.id);
                const c = roomStC[room.status] ?? { bg: "#F3F4F6", text: "#374151" };
                return (
                  <div key={room.id} className="flex relative" style={{ height: RH, borderBottom: "1px solid #F1F5F9" }}>
                    <div className="flex-shrink-0 flex items-center gap-2 px-3 sticky left-0 z-10" style={{ width: 200, borderRight: `1px solid ${BORDER}`, backgroundColor: "white" }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{room.id}</div>
                      <div className="min-w-0"><div className="text-xs font-semibold truncate" style={{ color: TEXT }}>Room {room.id}</div><div className="text-xs" style={{ color: SUBTLE }}>{room.type} · F{room.floor}</div></div>
                      <div className="ml-auto flex-shrink-0"><span className="text-xs px-1.5 py-0.5 rounded" style={c}>{room.status.slice(0,3)}</span></div>
                    </div>
                    <div className="relative flex-1 flex">
                      {days.map((_, i) => (
                        <div key={i} className="flex-shrink-0 border-r cursor-pointer transition-colors hover:bg-blue-50"
                          style={{ width: DW, height: RH, borderRightColor: "#F4F4F5", backgroundColor: i === todayIdx ? "rgba(18,58,115,0.03)" : undefined }}
                          onClick={() => add({ type: "info", title: "New Reservation", body: `Room ${room.id} · ${days[i].toLocaleDateString("en-NG",{day:"numeric",month:"short"})}` })} />
                      ))}
                      {res.map((r, ri) => (
                        <div key={ri} className="absolute flex items-center px-2 cursor-pointer hover:opacity-90 rounded-md shadow-sm"
                          style={{ left: r.start * DW + 2, width: (r.end - r.start) * DW - 4, height: RH - 14, top: 7, backgroundColor: r.color }}
                          onClick={() => nav ? nav("reservation-detail", `${r.guest} — ${room.id}`) : add({ type: "info", title: r.guest, body: `Room ${room.id}` })}>
                          <span className="text-white text-xs font-medium truncate">{r.guest}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Occupancy footer */}
              <div className="flex sticky bottom-0 z-10" style={{ backgroundColor: "#F9FAFB", borderTop: `2px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-3 py-2 flex items-center" style={{ width: 200, borderRight: `1px solid ${BORDER}` }}>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Occupancy %</span>
                </div>
                {occPerDay.map((occ, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center py-1.5" style={{ width: DW, borderRight: `1px solid ${BORDER}`, backgroundColor: i === todayIdx ? "#EFF6FF" : "transparent" }}>
                    <span className="text-xs font-bold" style={{ color: occ >= 80 ? SUCCESS : occ >= 50 ? ORANGE : MUTED }}>{occ}%</span>
                    <div className="w-8 h-1 rounded-full mt-0.5" style={{ backgroundColor: "#E2E8F0" }}>
                      <div className="h-1 rounded-full" style={{ width: `${occ}%`, backgroundColor: occ >= 80 ? SUCCESS : occ >= 50 ? ORANGE : MUTED }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewReservation({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    checkin: "2026-08-04", checkout: "2026-08-07", adults: "2", children: "0",
    roomType: "Deluxe", ratePlan: "Standard Rate", nightlyRate: "55000",
    guestName: "", phone: "", email: "", idType: "Passport", idNum: "",
    extras: [] as string[], transfer: false, flightNum: "",
    depositPct: "50", payMethod: "POS / Card",
  });
  const upd = (k: string, v: string | boolean | string[]) => setForm(p => ({ ...p, [k]: v }));
  const nights = Math.max(1, Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000));
  const rate = Number(form.nightlyRate) || 55000;
  const subtotal = rate * nights;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  const deposit = Math.round(total * Number(form.depositPct) / 100);
  const steps = ["Dates & Room", "Rate Plan", "Guest Details", "Extras", "Deposit", "Confirm"];
  const EXTRAS_LIST = ["Champagne on Arrival", "Fruit Basket", "Extra Pillows", "Breakfast Included", "Late Check-out (2 PM)", "Airport Drop-off", "Welcome Flowers"];
  const proceed = () => {
    if (step === 6) {
      add({ type: "success", title: "Reservation confirmed!", body: `BK-${Math.floor(2850 + Math.random()*100)} · ${form.guestName || "Guest"} · ${form.roomType}` });
      nav && nav("reservation-search", "Reservations");
      return;
    }
    setStep(s => s + 1);
  };
  return (
    <div>
      <PageHeader title="New Reservation" sub={`Step ${step} of 6 — ${steps[step-1]}`}
        actions={step > 1 ? <BtnO label="Back" icon={ChevronLeft} onClick={() => setStep(s=>s-1)} /> : undefined} />
      {/* Step progress bar */}
      <div className="flex items-start bg-white rounded-xl border p-4 mb-5 overflow-x-auto" style={{ borderColor: BORDER }}>
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{ backgroundColor: i+1 < step ? TEAL : i+1 === step ? PRIMARY : "white", borderColor: i+1 <= step ? (i+1 < step ? TEAL : PRIMARY) : BORDER, color: i+1 <= step ? "white" : MUTED }}>
                {i+1 < step ? "✓" : i+1}
              </div>
              <div className="text-xs mt-1 font-medium text-center whitespace-nowrap" style={{ color: i+1 === step ? PRIMARY : MUTED }}>{s}</div>
            </div>
            {i < steps.length-1 && <div className="flex-1 h-0.5 mx-1 mb-5" style={{ backgroundColor: i+1 < step ? TEAL : BORDER }} />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {/* Step 1 — Dates & Room */}
          {step === 1 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: TEXT }}>Dates, Guests & Room Type</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Check-In</label><input type="date" value={form.checkin} onChange={e=>upd("checkin",e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Check-Out</label><input type="date" value={form.checkout} onChange={e=>upd("checkout",e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[["Adults","adults",["1","2","3","4"]],["Children","children",["0","1","2","3"]],["Rooms","rooms",["1","2","3"]]].map(([label,key,opts]) => (
                  <div key={key as string}><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>{label as string}</label>
                    <select value={(form as Record<string,string>)[key as string] ?? "1"} onChange={e=>upd(key as string,e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>{(opts as string[]).map(v=><option key={v}>{v}</option>)}</select></div>
                ))}
              </div>
              <div className="mb-4"><label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Room Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ type:"Standard",avail:6,price:"₦35,000" },{ type:"Deluxe",avail:4,price:"₦55,000" },{ type:"Suite",avail:2,price:"₦95,000" }].map(rt=>(
                    <button key={rt.type} onClick={()=>upd("roomType",rt.type)} className="p-3 rounded-xl border-2 text-left transition-all"
                      style={{ borderColor: form.roomType===rt.type ? PRIMARY : BORDER, backgroundColor: form.roomType===rt.type ? "#EFF6FF" : "white" }}>
                      <div className="text-sm font-bold" style={{ color: form.roomType===rt.type ? PRIMARY : TEXT }}>{rt.type}</div>
                      <div className="text-xs mt-0.5" style={{ color: SUCCESS }}>{rt.avail} available</div>
                      <div className="text-xs font-semibold" style={{ color: MUTED }}>{rt.price}/night</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ backgroundColor: "#F0FDF4", color: SUCCESS }}>
                <CheckCircle2 size={13} />{form.roomType} rooms available — {form.roomType==="Suite" ? 2 : form.roomType==="Deluxe" ? 4 : 6} units free for selected dates
              </div>
            </div>
          )}
          {/* Step 2 — Rate Plan */}
          {step === 2 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: TEXT }}>Select Rate Plan</h3>
              <div className="space-y-3 mb-5">
                {RATE_PLANS.filter(r=>r.active && r.rooms.includes(form.roomType)).map(plan=>(
                  <button key={plan.id} onClick={()=>{ upd("ratePlan",plan.name); upd("nightlyRate",plan.base.toString()); }}
                    className="w-full flex items-start justify-between p-4 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: form.ratePlan===plan.name ? PRIMARY : BORDER, backgroundColor: form.ratePlan===plan.name ? "#EFF6FF" : "white" }}>
                    <div><div className="text-sm font-bold" style={{ color: form.ratePlan===plan.name ? PRIMARY : TEXT }}>{plan.name}</div>
                      <div className="text-xs mt-1" style={{ color: MUTED }}>{plan.dates} · {plan.rooms.join(", ")}</div></div>
                    <div className="text-right ml-4 flex-shrink-0"><div className="text-base font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{plan.base.toLocaleString()}</div><div className="text-xs" style={{ color: MUTED }}>per night</div></div>
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#F0F4F8" }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Rate Breakdown — {nights} night{nights!==1?"s":""}</div>
                {Array.from({ length: Math.min(nights,4) },(_,i)=>(
                  <div key={i} className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: MUTED }}>Night {i+1}</span>
                    <span style={{ color: TEXT, fontFamily: mono }}>₦{rate.toLocaleString()}</span>
                  </div>
                ))}
                {nights > 4 && <div className="text-xs mb-2" style={{ color: MUTED }}>…{nights-4} more nights at ₦{rate.toLocaleString()}</div>}
                <div className="border-t pt-2 mt-1" style={{ borderColor: BORDER }}>
                  {[["Subtotal",`₦${subtotal.toLocaleString()}`],["VAT (7.5%)",`₦${vat.toLocaleString()}`]].map(([k,v])=>(
                    <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span style={{ fontFamily: mono }}>{v as string}</span></div>
                  ))}
                  <div className="flex justify-between font-bold text-sm"><span style={{ color: TEXT }}>Total</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          )}
          {/* Step 3 — Guest Details */}
          {step === 3 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: TEXT }}>Guest Details</h3>
              <div className="relative mb-3"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
                <input placeholder="Search existing guests by name, phone, or email…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div className="text-xs px-3 py-2 rounded-lg mb-4" style={{ backgroundColor: "#F0F4F8", color: MUTED }}>Or fill in below to create a new guest profile</div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Full Name</label><input value={form.guestName} onChange={e=>upd("guestName",e.target.value)} placeholder="e.g. Chukwuemeka Bello" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Phone</label><input value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+234 80x xxx xxxx" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div className="mb-4"><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Email Address</label><input type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="guest@example.com" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>ID Type</label>
                  <select value={form.idType} onChange={e=>upd("idType",e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                    {["Passport","National ID","Driver's Licence","NIN"].map(v=><option key={v}>{v}</option>)}
                  </select></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>ID Number</label><input value={form.idNum} onChange={e=>upd("idNum",e.target.value)} placeholder="ID number" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              </div>
            </div>
          )}
          {/* Step 4 — Extras */}
          {step === 4 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: TEXT }}>Extras & Transport</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {EXTRAS_LIST.map(ex=>{ const sel=form.extras.includes(ex); return (
                  <button key={ex} onClick={()=>upd("extras",sel?form.extras.filter(e=>e!==ex):[...form.extras,ex])}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: sel ? TEAL : BORDER, backgroundColor: sel ? "#F0FDFA" : "white" }}>
                    <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: sel ? TEAL : "#CBD5E1", backgroundColor: sel ? TEAL : "transparent" }}>{sel && <CheckCircle2 size={10} color="white" />}</div>
                    <span className="text-xs font-medium" style={{ color: sel ? TEAL : TEXT }}>{ex}</span>
                  </button>
                );})}
              </div>
              <div className="border-t pt-4" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-3">
                  <div><div className="text-sm font-semibold" style={{ color: TEXT }}>Airport Transfer</div><div className="text-xs" style={{ color: MUTED }}>Driver meets guest at arrivals hall</div></div>
                  <button onClick={()=>upd("transfer",!form.transfer)} className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: form.transfer ? TEAL : "#CBD5E1" }}>
                    <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: form.transfer ? 22 : 2 }} />
                  </button>
                </div>
                {form.transfer && <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Flight Number</label><input value={form.flightNum} onChange={e=>upd("flightNum",e.target.value)} placeholder="e.g. LOS-UK1234" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>}
              </div>
            </div>
          )}
          {/* Step 5 — Deposit */}
          {step === 5 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: TEXT }}>Deposit & Payment</h3>
              <div className="mb-4"><label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Deposit Percentage</label>
                <div className="flex gap-2">
                  {["0","25","50","100"].map(pct=>(
                    <button key={pct} onClick={()=>upd("depositPct",pct)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                      style={{ borderColor: form.depositPct===pct ? PRIMARY : BORDER, backgroundColor: form.depositPct===pct ? "#EFF6FF" : "white", color: form.depositPct===pct ? PRIMARY : TEXT }}>
                      {pct==="0" ? "None" : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: "#F0F4F8" }}>
                <div className="flex justify-between text-sm mb-1.5"><span style={{ color: MUTED }}>Reservation total</span><span style={{ fontFamily: mono }}>₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-bold"><span style={{ color: TEXT }}>Deposit required ({form.depositPct}%)</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{deposit.toLocaleString()}</span></div>
              </div>
              {Number(form.depositPct) > 0 && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Payment Method</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["Cash","POS / Card","Bank Transfer"].map(m=>(
                      <button key={m} onClick={()=>upd("payMethod",m)} className="py-2.5 rounded-xl text-xs font-semibold border-2 transition-all"
                        style={{ borderColor: form.payMethod===m ? PRIMARY : BORDER, backgroundColor: form.payMethod===m ? "#EFF6FF" : "white", color: form.payMethod===m ? PRIMARY : TEXT }}>{m}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ backgroundColor: "#F0FDF4", color: SUCCESS }}>
                    <CheckCircle2 size={13} />Receipt will be printed and emailed to guest
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Step 6 — Confirm */}
          {step === 6 && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: TEXT }}>Confirm Reservation</h3>
              <div className="space-y-4">
                {[
                  { title:"Dates & Room", items:[["Check-In",form.checkin],["Check-Out",form.checkout],["Room Type",form.roomType],["Nights",String(nights)],["Guests",`${form.adults} adults, ${form.children} children`]] },
                  { title:"Rate", items:[["Rate Plan",form.ratePlan],["Nightly Rate",`₦${rate.toLocaleString()}`],["Total",`₦${total.toLocaleString()} incl. VAT`]] },
                  { title:"Guest", items:[["Name",form.guestName||"–"],["Phone",form.phone||"–"],["Email",form.email||"–"],["ID",`${form.idType}: ${form.idNum||"–"}`]] },
                  { title:"Extras", items:form.extras.length>0 ? form.extras.map(e=>[e,"✓"] as [string,string]) : [["None selected",""] as [string,string]] },
                  { title:"Payment", items:[["Deposit",`₦${deposit.toLocaleString()} (${form.depositPct}%)`],["Method",Number(form.depositPct)>0 ? form.payMethod : "No deposit"]] },
                ].map(section=>(
                  <div key={section.title} className="p-4 rounded-xl" style={{ backgroundColor: "#F0F4F8" }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>{section.title}</div>
                    {section.items.map(([k,v])=>(
                      <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Summary sidebar */}
        <div>
          <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Reservation Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {[["Room Type",form.roomType],["Check-In",form.checkin],["Check-Out",form.checkout],["Nights",String(nights)],["Rate Plan",form.ratePlan],["Nightly Rate",`₦${rate.toLocaleString()}`]].map(([k,v])=>(
                <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>
              ))}
              <div className="pt-2 mt-1 border-t" style={{ borderColor: BORDER }}>
                {[["Subtotal",`₦${subtotal.toLocaleString()}`],["VAT (7.5%)",`₦${vat.toLocaleString()}`]].map(([k,v])=>(
                  <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span>{v as string}</span></div>
                ))}
                <div className="flex justify-between font-bold mt-2"><span style={{ color: TEXT }}>Total</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{total.toLocaleString()}</span></div>
              </div>
              {Number(form.depositPct) > 0 && (
                <div className="flex justify-between text-sm font-semibold pt-2 border-t" style={{ borderColor: BORDER }}>
                  <span style={{ color: MUTED }}>Deposit Due</span><span style={{ color: TEAL, fontFamily: mono }}>₦{deposit.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button onClick={proceed} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ backgroundColor: step === 6 ? SUCCESS : PRIMARY }}>
                {step === 6 ? "Confirm & Create Reservation" : `Continue → ${steps[step]}`}
              </button>
              {step === 6 && <BtnO label="Save as Draft" onClick={() => add({ type: "info", title: "Saved as draft" })} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckOut({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [cashAmt, setCashAmt] = useState("82100");
  const [cardAmt, setCardAmt] = useState("0");
  const [voidLine, setVoidLine] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountAmt, setDiscountAmt] = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [accessRevoked, setAccessRevoked] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [settled, setSettled] = useState(false);
  const CHARGES = [
    { date: "23 Jun", cat: "Room", desc: "Deluxe Room 202 × 2 nights", qty: 2, unit: 55000, amount: 110000, by: "System", tax: 8250, reversed: false },
    { date: "23 Jun", cat: "Restaurant", desc: "Room Service Order #RS-041", qty: 1, unit: 8500, amount: 8500, by: "John A.", tax: 638, reversed: false },
    { date: "24 Jun", cat: "Bar", desc: "Minibar — 2× Water, 1× Juice", qty: 3, unit: 1200, amount: 3600, by: "System", tax: 270, reversed: false },
    { date: "24 Jun", cat: "Laundry", desc: "Express laundry — 3 items", qty: 3, unit: 2000, amount: 6000, by: "HK Staff", tax: 450, reversed: false },
  ];
  const [charges, setCharges] = useState(CHARGES);
  const subtotal = charges.filter(c => !c.reversed).reduce((s, c) => s + c.amount, 0);
  const taxTotal = charges.filter(c => !c.reversed).reduce((s, c) => s + c.tax, 0);
  const grand = subtotal + taxTotal;
  const deposit = 55000;
  const discount = discountAmt ? parseInt(discountAmt) || 0 : 0;
  const balance = grand - deposit - discount;
  const totalReceived = parseInt(cashAmt || "0") + parseInt(cardAmt || "0");
  const change = Math.max(0, totalReceived - balance);
  const catColor: Record<string, string> = { Room: PRIMARY, Restaurant: TEAL, Bar: ORANGE, Laundry: MUTED, "Late Charge": ERROR };
  return (
    <div>
      <PageHeader title="Check-Out & Settlement" sub="Room 202 · Emmanuel Adeyemi · 25 Jun 2025"
        actions={<><BtnO label="Extend Stay" icon={CalendarDays} /><BtnP label="Express Check-Out" icon={Zap} onClick={() => add({ type: "info", title: "Express check-out — zero balance", body: "Folio emailed to guest" })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Charges" value={`₦${grand.toLocaleString()}`} sub={`${charges.filter(c=>!c.reversed).length} line items incl. tax`} icon={FileText} accent={PRIMARY} />
        <StatCard label="Deposit Paid" value={`₦${deposit.toLocaleString()}`} sub="At check-in" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Balance Due" value={`₦${Math.max(0,balance).toLocaleString()}`} sub="After deposit" icon={DollarSign} accent={balance > 0 ? ERROR : SUCCESS} />
        <StatCard label="Stays" value="3" sub="Returning guest" icon={Users} accent={TEAL} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Folio */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <div><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Folio — BK-2848</h3><p className="text-xs mt-0.5" style={{ color: SUBTLE }}>Emmanuel Adeyemi · Room 202 · 23–25 Jun</p></div>
              <div className="flex gap-2">
                <button onClick={() => setShowDiscount(true)} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ color: ORANGE, borderColor: `${ORANGE}40` }}>Apply Discount</button>
                <BtnO label="Print" icon={FileText} /><BtnO label="Email" icon={Mail} />
              </div>
            </div>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Date", "Category", "Description", "Qty", "Unit", "Amount", "Tax", "By", ""].map((h,i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {charges.map((c, i) => (
                  <tr key={i} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: c.reversed ? 0.45 : 1 }}>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{c.date}</td>
                    <td className="px-3 py-3"><span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: (catColor[c.cat] ?? MUTED) + "18", color: catColor[c.cat] ?? MUTED }}>{c.cat}</span></td>
                    <td className="px-3 py-3 text-sm max-w-40" style={{ color: c.reversed ? MUTED : TEXT }}>{c.reversed && <span className="line-through">{c.desc}</span>}{!c.reversed && c.desc}</td>
                    <td className="px-3 py-3 text-xs text-center" style={{ color: MUTED }}>{c.qty}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{c.unit.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm font-semibold" style={{ color: c.reversed ? MUTED : TEXT, fontFamily: mono }}>₦{c.amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>₦{c.tax.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: SUBTLE }}>{c.by}</td>
                    <td className="px-3 py-3">
                      {!c.reversed && <button onClick={() => setVoidLine(i)} className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Void</button>}
                      {c.reversed && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Voided</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span style={{ color: MUTED }}>Charges subtotal</span><span style={{ fontFamily: mono }}>₦{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span style={{ color: MUTED }}>VAT (7.5%)</span><span style={{ fontFamily: mono }}>₦{taxTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span style={{ color: MUTED }}>Deposit paid</span><span style={{ color: SUCCESS, fontFamily: mono }}>−₦{deposit.toLocaleString()}</span></div>
                  {discount > 0 && <div className="flex justify-between"><span style={{ color: MUTED }}>Discount</span><span style={{ color: SUCCESS, fontFamily: mono }}>−₦{discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between font-black text-base pt-2 border-t" style={{ borderColor: BORDER, color: balance > 0 ? ERROR : SUCCESS }}>
                    <span>Balance Due</span><span style={{ fontFamily: mono }}>₦{Math.max(0, balance).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Access credential revocation */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accessRevoked ? "#D1FAE5" : "#FEF2F2" }}><Lock size={15} style={{ color: accessRevoked ? SUCCESS : ERROR }} /></div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>Room Access Credentials</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>Key Card ×1 · PIN Active · Room {202} · Provider: TTLock</div>
                  <div className="text-xs mt-1" style={{ color: SUBTLE }}>Immediate revocation — card and PIN stop working at provider within 30s</div>
                </div>
              </div>
              {!accessRevoked ? (
                <button onClick={() => { setAccessRevoked(true); add({ type: "success", title: "Access revoked", body: "Room 202 credentials deactivated · TTLock notified" }); }} className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex-shrink-0" style={{ backgroundColor: ERROR }}>Revoke Now</button>
              ) : (
                <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ backgroundColor: "#D1FAE5", color: SUCCESS }}>Revoked</span>
              )}
            </div>
          </div>
          {/* Guest feedback */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Guest Feedback</div>
            <p className="text-xs mb-3" style={{ color: MUTED }}>Send a feedback request to the guest via email or WhatsApp.</p>
            {!feedbackSent ? (
              <div className="flex gap-2">
                <button onClick={() => { setFeedbackSent(true); add({ type: "success", title: "Feedback link sent via WhatsApp", body: "Emmanuel Adeyemi" }); }} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ color: TEAL, borderColor: `${TEAL}30` }}>WhatsApp</button>
                <button onClick={() => { setFeedbackSent(true); add({ type: "success", title: "Feedback link sent via Email", body: "Emmanuel Adeyemi" }); }} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Email</button>
                <button onClick={() => setFeedbackSent(true)} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ color: MUTED, borderColor: BORDER }}>Skip</button>
              </div>
            ) : <span className="text-xs font-semibold" style={{ color: SUCCESS }}>Feedback request sent</span>}
          </div>
        </div>
        {/* Settlement panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Settlement</h3>
            <div className="text-3xl font-black mb-1" style={{ color: balance > 0 ? ERROR : SUCCESS, fontFamily: mono }}>₦{Math.max(0, balance).toLocaleString()}</div>
            <div className="text-xs mb-5" style={{ color: MUTED }}>Balance due after deposit</div>
            {balance > 0 ? (
              <div className="space-y-3 mb-4">
                {[{ label: "Cash (₦)", val: cashAmt, setVal: setCashAmt }, { label: "POS / Card (₦)", val: cardAmt, setVal: setCardAmt }].map(m => (
                  <div key={m.label}><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{m.label}</label><div className="flex items-center gap-2"><span className="text-sm" style={{ color: MUTED }}>₦</span><input value={m.val} onChange={e => m.setVal(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }} /></div></div>
                ))}
                <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
                  {[["Total received", `₦${totalReceived.toLocaleString()}`], ["Balance due", `₦${balance.toLocaleString()}`], ["Change due", `₦${change.toLocaleString()}`]].map(([k, v]) => <div key={k} className="flex justify-between mb-1"><span style={{ color: MUTED }}>{k}</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>{v}</span></div>)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-sm font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}><CheckCircle2 size={14} />Zero balance — express check-out ready</div>
            )}
            <BtnP label={settled ? "Check-Out Complete" : "Process & Release Room"} icon={settled ? CheckCircle2 : CheckCircle2} onClick={() => { setSettled(true); add({ type: "success", title: "Check-out complete", body: "Room 202 → Cleaning · Access revoked · Folio closed" }); }} />
            {settled && <div className="mt-3 flex gap-2"><BtnO label="Print Invoice" icon={FileText} /><BtnO label="Email Invoice" icon={Mail} /></div>}
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>EA</div>
              <div><div className="text-sm font-semibold" style={{ color: TEXT }}>Emmanuel Adeyemi</div><div className="text-xs" style={{ color: MUTED }}>Room 202 · BK-2848 · 2 nights</div></div>
            </div>
            <div className="text-xs space-y-1.5" style={{ color: MUTED }}>
              {[["Check-in", "23 Jun 14:05"], ["Check-out", "25 Jun 11:00"], ["Stays", "3rd visit"], ["Phone", "+234 802 333 4444"]].map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}</span><span style={{ color: TEXT }}>{v}</span></div>)}
            </div>
          </div>
        </div>
      </div>
      {/* Void modal */}
      {voidLine !== null && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setVoidLine(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Void Charge</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Voiding: <span className="font-semibold" style={{ color: TEXT }}>{charges[voidLine]?.desc}</span> — ₦{charges[voidLine]?.amount.toLocaleString()}. A reversal entry will be posted. This cannot be undone.</p>
            <div className="space-y-2 mb-4">
              {["Guest complaint", "Incorrectly posted", "Complimentary — VIP service", "Manager override", "Other"].map(r => (
                <label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: voidReason === r ? ERROR : BORDER, backgroundColor: voidReason === r ? "#FEF2F2" : "white" }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: voidReason === r ? ERROR : "#CBD5E1" }}>{voidReason === r && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />}</div>
                  <input type="radio" className="hidden" onChange={() => setVoidReason(r)} />
                  <span className="text-sm" style={{ color: TEXT }}>{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setVoidLine(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
              <button disabled={!voidReason} onClick={() => { setCharges(cs => cs.map((c,i) => i === voidLine ? { ...c, reversed: true } : c)); add({ type: "info", title: "Charge voided", body: `${charges[voidLine]?.desc} · Reason: ${voidReason}` }); setVoidLine(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm Void</button>
            </div>
          </div>
        </>
      )}
      {/* Discount modal */}
      {showDiscount && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowDiscount(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Apply Discount</h3>
            <p className="text-xs mb-4" style={{ color: ERROR }}>Requires Manager authorisation for amounts above ₦5,000</p>
            <div className="space-y-3 mb-4">
              <Inp label="Discount Amount (₦)" placeholder="0" value={discountAmt} onChange={e => setDiscountAmt(e.target.value)} />
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Reason (required)</label><textarea value={discountReason} onChange={e => setDiscountReason(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-xl text-sm outline-none resize-none" style={{ borderColor: BORDER }} placeholder="Guest complaint, loyalty discount, etc." /></div>
              <Inp label="Manager PIN (for amounts above ₦5,000)" type="password" placeholder="••••" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
              <button disabled={!discountReason || !discountAmt} onClick={() => { setShowDiscount(false); add({ type: "success", title: `Discount applied: ₦${parseInt(discountAmt).toLocaleString()}`, body: discountReason }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Apply Discount</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function InHouseGuests({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [ihSearch, setIhSearch] = useState("");
  const [ihFilter, setIhFilter] = useState("All");
  const [moreMenu, setMoreMenu] = useState<string | null>(null);
  const IH_GUESTS = [
    { room: "101", guest: "Adaeze Okonkwo", av: "AO", checkin: "22 Jun", checkout: "25 Jun", nights: 3, nightsLeft: 1, vip: true, balance: 0, dnd: false, requests: 0, complaints: 0, type: "Deluxe" },
    { room: "202", guest: "Emmanuel Adeyemi", av: "EA", checkin: "23 Jun", checkout: "26 Jun", nights: 3, nightsLeft: 2, vip: false, balance: 45000, dnd: false, requests: 1, complaints: 0, type: "Deluxe" },
    { room: "203", guest: "Fatima Musa", av: "FM", checkin: "21 Jun", checkout: "24 Jun", nights: 3, nightsLeft: 0, vip: true, balance: 0, dnd: true, requests: 0, complaints: 0, type: "Suite" },
    { room: "304", guest: "Chukwuemeka Obi", av: "CO", checkin: "24 Jun", checkout: "28 Jun", nights: 4, nightsLeft: 4, vip: false, balance: 120000, dnd: false, requests: 2, complaints: 1, type: "Standard" },
    { room: "302", guest: "Ibrahim Lawal", av: "IL", checkin: "23 Jun", checkout: "25 Jun", nights: 2, nightsLeft: 1, vip: false, balance: 0, dnd: false, requests: 0, complaints: 0, type: "Deluxe" },
    { room: "501", guest: "Dr. Chukwuemeka Bello", av: "CB", checkin: "24 Jun", checkout: "27 Jun", nights: 3, nightsLeft: 3, vip: true, balance: 0, dnd: false, requests: 1, complaints: 0, type: "Suite" },
  ];
  const filtered = IH_GUESTS.filter(g => {
    const ms = !ihSearch || g.guest.toLowerCase().includes(ihSearch.toLowerCase()) || g.room.includes(ihSearch);
    const mf = ihFilter === "All" ? true : ihFilter === "VIP" ? g.vip : ihFilter === "Balance" ? g.balance > 0 : ihFilter === "DND" ? g.dnd : g.nightsLeft === 0;
    return ms && mf;
  });
  const typeColors: Record<string, string> = { Suite: PRIMARY, Deluxe: TEAL, Standard: MUTED };
  return (
    <div>
      <PageHeader title="In-House Guests" sub={`${IH_GUESTS.length} guests currently checked in`} actions={<><BtnO label="Export" icon={Download} /><BtnP label="Post Charge" icon={Plus} onClick={() => nav && nav("folio", "Folio Management")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="In-House" value={String(IH_GUESTS.length)} sub="Currently checked in" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Guests" value={String(IH_GUESTS.filter(g => g.vip).length)} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Outstanding" value={`₦${IH_GUESTS.reduce((s,g)=>s+g.balance,0).toLocaleString()}`} sub={`${IH_GUESTS.filter(g=>g.balance>0).length} open folios`} icon={DollarSign} accent={ERROR} />
        <StatCard label="Depart Today" value={String(IH_GUESTS.filter(g=>g.nightsLeft===0).length)} sub="Expected by 11:00" icon={ArrowRight} accent={TEAL} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={ihSearch} onChange={e => setIhSearch(e.target.value)} placeholder="Search guest or room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Balance", "DND", "Departing"].map(f => <button key={f} onClick={() => setIhFilter(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: ihFilter===f ? PRIMARY : "white", color: ihFilter===f ? "white" : MUTED, borderColor: ihFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
        <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{filtered.length} of {IH_GUESTS.length}</span>
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} message="No guests match your filters" /> : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Room", "Guest", "Check-in", "Check-out", "Nights Left", "Balance", "Flags", "Actions"].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.room} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: typeColors[g.type] ?? MUTED }}>{g.room}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{g.type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{g.av}</div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                        <div className="text-xs" style={{ color: MUTED }}>Floor {Math.floor(Number(g.room)/100)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT, fontFamily: mono }}>{g.checkin}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: g.nightsLeft === 0 ? WARNING : TEXT, fontFamily: mono, fontWeight: g.nightsLeft === 0 ? 700 : 400 }}>{g.checkout}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{ color: g.nightsLeft === 0 ? ERROR : g.nightsLeft === 1 ? WARNING : SUCCESS }}>{g.nightsLeft === 0 ? "Departs today" : `${g.nightsLeft}d`}</span>
                  </td>
                  <td className="px-4 py-3">
                    {g.balance > 0 ? <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{g.balance.toLocaleString()}</span> : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle2 size={11} />Settled</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {g.dnd && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#F3F4F6", color: MUTED }}>DND</span>}
                      {g.requests > 0 && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{g.requests} req</span>}
                      {g.complaints > 0 && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>{g.complaints} complaint</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 relative">
                      <button onClick={() => nav && nav("folio", "Folio")} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>Folio</button>
                      <button onClick={() => nav && nav("check-out", "Check-Out")} className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{ backgroundColor: TEAL }}>Check Out</button>
                      <div className="relative">
                        <button onClick={() => setMoreMenu(moreMenu === g.room ? null : g.room)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5] transition-colors" style={{ color: SUBTLE }}><MoreHorizontal size={13} /></button>
                        {moreMenu === g.room && (
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border shadow-lg py-1 min-w-36" style={{ borderColor: BORDER }}>
                            {[["Message Guest", "guest-messaging"],["Post Charge","folio"],["Extend Stay","folio"],["Move Room","room-assignment"]].map(([l,s]) => (
                              <button key={l} onClick={() => { setMoreMenu(null); nav && nav(s, l); }} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>{l}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function GuestProfiles({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const ALL_GUESTS = [
    { name: "Adaeze Okonkwo", av: "AO", id: "G-001", phone: "+234 801 111 2222", email: "a.okonkwo@corp.ng", nationality: "Nigerian", stays: 8, lastStay: "24 Jun", lifetimeValue: 520000, vip: true, vipTier: "Gold", tag: "Regular", activeStay: true, balance: 0, blacklist: false, allergy: "Seafood" },
    { name: "Dr. Chukwuemeka Bello", av: "CB", id: "G-002", phone: "+234 803 555 6666", email: "c.bello@example.com", nationality: "Nigerian", stays: 15, lastStay: "24 Jun", lifetimeValue: 2400000, vip: true, vipTier: "Platinum", tag: "VIP", activeStay: true, balance: 0, blacklist: false, allergy: "" },
    { name: "Emmanuel Adeyemi", av: "EA", id: "G-003", phone: "+234 802 333 4444", email: "e.adeyemi@email.com", nationality: "Nigerian", stays: 3, lastStay: "23 Jun", lifetimeValue: 185000, vip: false, vipTier: "", tag: "", activeStay: true, balance: 45000, blacklist: false, allergy: "" },
    { name: "Ibrahim Lawal", av: "IL", id: "G-004", phone: "+234 805 999 0000", email: "i.lawal@corp.ng", nationality: "Nigerian", stays: 5, lastStay: "23 Jun", lifetimeValue: 340000, vip: false, vipTier: "", tag: "Corporate", activeStay: true, balance: 0, blacklist: false, allergy: "Gluten" },
    { name: "Fatima Al-Hassan", av: "FA", id: "G-005", phone: "+234 804 777 8888", email: "f.alhassan@mail.com", nationality: "Nigerian", stays: 1, lastStay: "22 Jun", lifetimeValue: 55000, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Tunde Bakare", av: "TB", id: "G-006", phone: "+234 809 123 4567", email: "t.bakare@corp.ng", nationality: "Nigerian", stays: 2, lastStay: "20 Jun", lifetimeValue: 92000, vip: false, vipTier: "", tag: "Corporate", activeStay: false, balance: 18500, blacklist: false, allergy: "" },
    { name: "Ngozi Adeyemi", av: "NA", id: "G-007", phone: "+234 807 654 3210", email: "n.adeyemi@email.com", nationality: "Nigerian", stays: 4, lastStay: "18 Jun", lifetimeValue: 210000, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Chidi Eze", av: "CE", id: "G-008", phone: "+234 806 222 3333", email: "c.eze@example.com", nationality: "Nigerian", stays: 6, lastStay: "15 Jun", lifetimeValue: 480000, vip: true, vipTier: "Gold", tag: "VIP", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Amara Nwachukwu", av: "AN", id: "G-009", phone: "+234 811 444 5555", email: "a.nwachukwu@corp.ng", nationality: "Nigerian", stays: 0, lastStay: "—", lifetimeValue: 0, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: true, allergy: "" },
  ];
  const filtered = ALL_GUESTS.filter(g => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.id.includes(search) && !g.phone.includes(search)) return false;
    if (filterTab === "VIP") return g.vip;
    if (filterTab === "Active Stay") return g.activeStay;
    if (filterTab === "Has Balance") return g.balance > 0;
    if (filterTab === "Blacklist") return g.blacklist;
    return true;
  });
  const tierColor = (t: string) => t === "Platinum" ? { bg: "#F5F3FF", text: "#7C3AED" } : t === "Gold" ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#EFF6FF", text: PRIMARY };
  return (
    <div>
      <PageHeader title="Guest Profiles" sub={`${filtered.length} of ${ALL_GUESTS.length} profiles`} actions={<><BtnO label="Merge Duplicates" icon={Layers} /><BtnP label="New Profile" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Profiles" value={String(ALL_GUESTS.length)} sub="Registered guests" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Members" value={String(ALL_GUESTS.filter(g=>g.vip).length)} sub="Loyalty & VIP tier" icon={Star} accent={ORANGE} />
        <StatCard label="Active Stay" value={String(ALL_GUESTS.filter(g=>g.activeStay).length)} sub="Currently in-house" icon={BedDouble} accent={TEAL} />
        <StatCard label="With Balance" value={String(ALL_GUESTS.filter(g=>g.balance>0).length)} sub="Open folios" icon={DollarSign} accent={ERROR} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, phone, or ID…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Active Stay", "Has Balance", "Blacklist"].map(f => (
          <button key={f} onClick={() => setFilterTab(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all"
            style={{ borderColor: filterTab === f ? PRIMARY : BORDER, backgroundColor: filterTab === f ? PRIMARY : "white", color: filterTab === f ? "white" : MUTED }}>{f}</button>
        ))}
        {search && <button onClick={() => setSearch("")} className="text-xs" style={{ color: MUTED }}>Clear</button>}
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} message={`No guests match "${search || filterTab}"`} /> : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Guest", "Contact", "Stays / Last Stay", "Lifetime Value", "Tier / Flags", "Actions"].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id} className="border-t hover:bg-[#F8FAFC] transition-colors cursor-pointer" style={{ borderColor: BORDER }} onClick={() => nav && nav("guest-profile-detail", g.name)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: g.vip ? ORANGE : PRIMARY }}>{g.av}</div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: g.blacklist ? ERROR : TEXT }}>{g.name}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                        <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{g.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: TEXT }}>{g.phone}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{g.nationality}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>{g.stays} stay{g.stays !== 1 ? "s" : ""}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Last: {g.lastStay}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold" style={{ color: g.lifetimeValue >= 500000 ? PRIMARY : TEXT, fontFamily: mono }}>₦{g.lifetimeValue.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {g.vipTier && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={tierColor(g.vipTier)}>{g.vipTier}</span>}
                      {g.activeStay && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>In-house</span>}
                      {g.blacklist && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Blacklist</span>}
                      {g.balance > 0 && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>Balance</span>}
                      {g.allergy && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FFF7ED", color: ORANGE }}>Allergy</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => nav && nav("guest-profile-detail", g.name)} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>View</button>
                      <button onClick={() => nav && nav("new-reservation", "New Reservation")} className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{ backgroundColor: PRIMARY }}>Reserve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function FolioScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [catFilter, setCatFilter] = useState("All");
  const [showCharge, setShowCharge] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [charge, setCharge] = useState({ cat: "Restaurant", desc: "", qty: "1", amount: "" });
  const [payAmt, setPayAmt] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");
  const FOLIO_LINES = [
    { date: "23 Jun", cat: "Room", desc: "Deluxe Room 202 × 2 nights", qty: 2, unit: 55000, amount: 110000, tax: 8250, by: "System", reversed: false, id: 1 },
    { date: "23 Jun", cat: "Restaurant", desc: "Room Service Order #RS-041", qty: 1, unit: 8500, amount: 8500, tax: 638, by: "John A.", reversed: false, id: 2 },
    { date: "23 Jun", cat: "Bar", desc: "Minibar restock — 2× Water, 1× Juice", qty: 3, unit: 1200, amount: 3600, tax: 270, by: "System", reversed: false, id: 3 },
    { date: "24 Jun", cat: "Laundry", desc: "Express laundry — 3 items", qty: 3, unit: 2000, amount: 6000, tax: 450, by: "HK Staff", reversed: false, id: 4 },
    { date: "24 Jun", cat: "Restaurant", desc: "Breakfast × 1 cover", qty: 1, unit: 4500, amount: 4500, tax: 338, by: "System", reversed: false, id: 5 },
  ];
  const PAYMENTS = [
    { date: "23 Jun", desc: "Check-in deposit", method: "Cash", amount: 55000, by: "John A.", id: "P1" },
  ];
  const [lines, setLines] = useState(FOLIO_LINES);
  const [voidId, setVoidId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const cats = ["All", ...Array.from(new Set(FOLIO_LINES.map(l => l.cat)))];
  const visibleLines = catFilter === "All" ? lines : lines.filter(l => l.cat === catFilter);
  const chargesTotal = lines.filter(l => !l.reversed).reduce((s, l) => s + l.amount, 0);
  const taxTotal = lines.filter(l => !l.reversed).reduce((s, l) => s + l.tax, 0);
  const grand = chargesTotal + taxTotal;
  const paidTotal = PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const balance = grand - paidTotal;
  let runningBal = paidTotal;
  const catColor: Record<string, string> = { Room: PRIMARY, Restaurant: TEAL, Bar: ORANGE, Laundry: MUTED, Minibar: "#8B5CF6" };
  const postCharge = () => {
    if (!charge.desc || !charge.amount) { add({ type: "warning", title: "Fill in description and amount" }); return; }
    const amt = parseInt(charge.amount) || 0; const qty = parseInt(charge.qty) || 1;
    const total = amt * qty; const tax = Math.round(total * 0.075);
    setLines(prev => [...prev, { date: "24 Jun", cat: charge.cat, desc: charge.desc, qty, unit: amt, amount: total, tax, by: "John A.", reversed: false, id: Date.now() }]);
    setShowCharge(false); setCharge({ cat: "Restaurant", desc: "", qty: "1", amount: "" });
    add({ type: "success", title: "Charge posted", body: `${charge.cat} · ₦${total.toLocaleString()}` });
  };
  return (
    <div>
      <PageHeader title="Folio — BK-2848" sub="Emmanuel Adeyemi · Room 202 · 23–25 Jun 2025"
        actions={<><BtnO label="Print Folio" icon={FileText} /><BtnO label="Split Folio" icon={Layers} /><BtnP label="Post Charge" icon={Plus} onClick={() => setShowCharge(true)} /></>} />
      {/* Header stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Charges + Tax" value={`₦${grand.toLocaleString()}`} sub={`${lines.filter(l=>!l.reversed).length} active lines`} icon={FileText} accent={PRIMARY} />
        <StatCard label="Payments" value={`₦${paidTotal.toLocaleString()}`} sub={`${PAYMENTS.length} payment${PAYMENTS.length !== 1 ? "s" : ""}`} icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Balance Due" value={`₦${Math.max(0,balance).toLocaleString()}`} sub="Remaining" icon={DollarSign} accent={balance > 0 ? ERROR : SUCCESS} />
        <StatCard label="Room Night Rate" value="₦55,000" sub="Deluxe · 2 nights" icon={BedDouble} accent={TEAL} />
      </div>
      {/* Charge lines */}
      <div className="bg-white rounded-xl border overflow-hidden mb-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Charge Lines</span>
          <div className="flex gap-1.5 ml-2">
            {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className="text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all" style={{ backgroundColor: catFilter === c ? PRIMARY : "white", color: catFilter === c ? "white" : MUTED, borderColor: catFilter === c ? PRIMARY : BORDER }}>{c}</button>)}
          </div>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>Posted charges are reversal-only — no direct editing</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date", "Cat", "Description", "Qty", "Unit (₦)", "Amount (₦)", "Tax (₦)", "Running Bal", "By", ""].map((h,i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {visibleLines.map((l) => {
              if (!l.reversed) runningBal -= l.amount + l.tax; else runningBal += l.amount + l.tax;
              const rowBal = l.reversed ? null : runningBal;
              return (
                <tr key={l.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: l.reversed ? 0.45 : 1 }}>
                  <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{l.date}</td>
                  <td className="px-3 py-3"><span className="text-xs px-1.5 py-0.5 rounded font-semibold whitespace-nowrap" style={{ backgroundColor: (catColor[l.cat] ?? MUTED) + "18", color: catColor[l.cat] ?? MUTED }}>{l.cat}</span></td>
                  <td className="px-3 py-3 text-sm max-w-48" style={{ color: l.reversed ? MUTED : TEXT }}>
                    {l.reversed ? <><span className="line-through">{l.desc}</span><span className="ml-1.5 text-xs font-semibold" style={{ color: ERROR }}>Reversed</span></> : l.desc}
                  </td>
                  <td className="px-3 py-3 text-xs text-center" style={{ color: MUTED }}>{l.qty}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.unit.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: l.reversed ? MUTED : TEXT, fontFamily: mono }}>{l.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{l.tax.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color: rowBal !== null ? (rowBal < 0 ? ERROR : MUTED) : SUBTLE, fontFamily: mono }}>
                    {rowBal !== null ? `₦${Math.abs(rowBal).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: SUBTLE }}>{l.by}</td>
                  <td className="px-3 py-3">
                    {!l.reversed ? (
                      <button onClick={() => setVoidId(l.id)} className="text-xs px-2 py-1 rounded border whitespace-nowrap" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Reverse</button>
                    ) : <span className="text-xs" style={{ color: SUBTLE }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Payments section */}
        <div className="border-t" style={{ borderColor: BORDER }}>
          <div className="px-5 py-2.5 flex items-center justify-between" style={{ backgroundColor: "#F0FDF4" }}>
            <span className="text-xs font-semibold" style={{ color: SUCCESS }}>Payments</span>
            <button onClick={() => setShowPayment(true)} className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ color: SUCCESS, border: `1px solid ${SUCCESS}30` }}>+ Post Payment</button>
          </div>
          {PAYMENTS.map(p => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3 border-t" style={{ borderColor: BORDER }}>
              <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.date}</div>
              <div className="flex-1 text-sm" style={{ color: TEXT }}>{p.desc} · {p.method}</div>
              <div className="text-sm font-bold" style={{ color: SUCCESS, fontFamily: mono }}>−₦{p.amount.toLocaleString()}</div>
              <div className="text-xs" style={{ color: SUBTLE }}>{p.by}</div>
            </div>
          ))}
        </div>
        {/* Totals footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              {[["Charges", `₦${chargesTotal.toLocaleString()}`], ["VAT (7.5%)", `₦${taxTotal.toLocaleString()}`], ["Gross Total", `₦${grand.toLocaleString()}`], ["Less Payments", `−₦${paidTotal.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span style={{ fontFamily: mono, color: k.startsWith("Less") ? SUCCESS : TEXT }}>{v}</span></div>
              ))}
              <div className="flex justify-between font-black text-base pt-2 border-t" style={{ borderColor: BORDER, color: balance > 0 ? ERROR : SUCCESS }}>
                <span>Balance Due</span><span style={{ fontFamily: mono }}>₦{Math.max(0, balance).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Post Charge Modal */}
      {showCharge && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowCharge(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post Charge</h3><button onClick={() => setShowCharge(false)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Category</label><select value={charge.cat} onChange={e => setCharge(p => ({...p, cat: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{["Room","Restaurant","Bar","Laundry","Minibar","Telephone","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Quantity</label><input type="number" min="1" value={charge.qty} onChange={e => setCharge(p => ({...p, qty: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Description</label><input value={charge.desc} onChange={e => setCharge(p=>({...p,desc:e.target.value}))} placeholder="e.g. Room Service #RS-055" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Unit Amount (₦)</label><input type="number" value={charge.amount} onChange={e => setCharge(p=>({...p,amount:e.target.value}))} placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              {charge.amount && charge.qty && <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Total: ₦{((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)).toLocaleString()} + VAT ₦{Math.round((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)*0.075).toLocaleString()}</div>}
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowCharge(false)} /><BtnP label="Post Charge" icon={DollarSign} onClick={postCharge} /></div>
          </div>
        </>
      )}
      {/* Post Payment Modal */}
      {showPayment && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowPayment(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post Payment</h3><button onClick={() => setShowPayment(false)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Amount (₦)</label><input value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder={Math.max(0,balance).toLocaleString()} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Payment Method</label>
                <div className="grid grid-cols-2 gap-2">{["Cash","POS / Card","Bank Transfer","Corporate Account"].map(m=><label key={m} className="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer" style={{ borderColor: payMethod===m ? SUCCESS : BORDER, backgroundColor: payMethod===m ? "#F0FDF4" : "white" }}><div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: payMethod===m ? SUCCESS : "#CBD5E1", backgroundColor: payMethod===m ? SUCCESS : "transparent" }} /><input type="radio" className="hidden" onChange={() => setPayMethod(m)} /><span className="text-xs" style={{ color: TEXT }}>{m}</span></label>)}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowPayment(false)} /><button onClick={() => { setShowPayment(false); add({ type: "success", title: "Payment posted", body: `₦${parseInt(payAmt||"0").toLocaleString()} ${payMethod}` }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Post Payment</button></div>
          </div>
        </>
      )}
      {/* Void / Reverse modal */}
      {voidId !== null && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setVoidId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Reverse Charge</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>A credit reversal line will be posted. The original line is never deleted. Select a reason:</p>
            <div className="space-y-2 mb-4">{["Guest complaint / dispute","Incorrectly posted","Complimentary by manager","Other"].map(r=><label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: voidReason===r ? ERROR : BORDER, backgroundColor: voidReason===r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: voidReason===r ? ERROR : "#CBD5E1" }}>{voidReason===r && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />}</div><input type="radio" className="hidden" onChange={() => setVoidReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}</div>
            <div className="flex gap-3"><button onClick={() => { setVoidId(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button><button disabled={!voidReason} onClick={() => { setLines(ls => ls.map(l => l.id === voidId ? {...l, reversed: true} : l)); add({ type: "info", title: "Charge reversed", body: voidReason }); setVoidId(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm Reversal</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function FinanceFolioManagement({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const FOLIOS = [
    { id: "FO-2840", res: "BK-2845", guest: "Adaeze Okonkwo", av: "AO", room: "101", checkin: "22 Jun", checkout: "25 Jun", charges: 165000, payments: 55000, balance: 110000, daysOpen: 2, lastActivity: "Today 09:42", flags: { highBalance: true, noPayment: false, creditLimit: false, unposted: false } },
    { id: "FO-2841", res: "BK-2848", guest: "Emmanuel Adeyemi", av: "EA", room: "202", checkin: "23 Jun", checkout: "25 Jun", charges: 131600, payments: 55000, balance: 76600, daysOpen: 1, lastActivity: "Today 08:30", flags: { highBalance: false, noPayment: false, creditLimit: false, unposted: true } },
    { id: "FO-2842", res: "BK-2849", guest: "Fatima Musa", av: "FM", room: "203", checkin: "21 Jun", checkout: "24 Jun", charges: 273375, payments: 273375, balance: 0, daysOpen: 3, lastActivity: "24 Jun 11:05", flags: { highBalance: false, noPayment: false, creditLimit: false, unposted: false } },
    { id: "FO-2843", res: "BK-2852", guest: "Chukwuemeka Obi", av: "CO", room: "304", checkin: "24 Jun", checkout: "28 Jun", charges: 397360, payments: 91125, balance: 306235, daysOpen: 1, lastActivity: "Today 07:55", flags: { highBalance: true, noPayment: false, creditLimit: true, unposted: true } },
    { id: "FO-2844", res: "BK-2853", guest: "Ibrahim Lawal", av: "IL", room: "302", checkin: "23 Jun", checkout: "25 Jun", charges: 73150, payments: 0, balance: 73150, daysOpen: 2, lastActivity: "23 Jun 14:00", flags: { highBalance: false, noPayment: true, creditLimit: false, unposted: false } },
    { id: "FO-2845", res: "BK-2854", guest: "Dr. Chukwuemeka Bello", av: "CB", room: "501", checkin: "24 Jun", checkout: "27 Jun", charges: 294404, payments: 91125, balance: 203279, daysOpen: 1, lastActivity: "Today 14:10", flags: { highBalance: true, noPayment: false, creditLimit: false, unposted: false } },
  ];
  const filtered = FOLIOS.filter(f => {
    const ms = !search || f.guest.toLowerCase().includes(search.toLowerCase()) || f.room.includes(search) || f.id.includes(search);
    const sf = statusFilter === "All" ? true : statusFilter === "Open" ? f.balance > 0 : statusFilter === "Settled" ? f.balance === 0 : statusFilter === "High Balance" ? f.flags.highBalance : statusFilter === "No Payment" ? f.flags.noPayment : true;
    return ms && sf;
  });
  const totalOutstanding = FOLIOS.filter(f => f.balance > 0).reduce((s, f) => s + f.balance, 0);
  const toggleSel = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div>
      <PageHeader title="Folio Management" sub="All open guest folios across the property"
        actions={<><BtnO label="Export" icon={Download} /><BtnP label="Post Charge" icon={Plus} onClick={() => add({ type: "info", title: "Select a folio first" })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Open Folios" value={String(FOLIOS.filter(f=>f.balance>0).length)} sub="With outstanding balance" icon={FileText} accent={PRIMARY} />
        <StatCard label="Total Outstanding" value={`₦${totalOutstanding.toLocaleString()}`} sub="Across all open folios" icon={DollarSign} accent={ERROR} />
        <StatCard label="No Payment on File" value={String(FOLIOS.filter(f=>f.flags.noPayment).length)} sub="No deposit collected" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Unposted Charges" value={String(FOLIOS.filter(f=>f.flags.unposted).length)} sub="Charges not yet synced" icon={Clock} accent={ORANGE} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search folio, guest, or room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          {["All", "Open", "Settled", "High Balance", "No Payment"].map(f => <button key={f} onClick={() => setStatusFilter(f)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: statusFilter===f ? PRIMARY : "white", color: statusFilter===f ? "white" : MUTED, borderColor: statusFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
          {selected.length > 0 && <div className="ml-auto flex items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>{selected.length} selected</span><button onClick={() => add({ type: "info", title: `Bulk action on ${selected.length} folios` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Bulk Post Charge</button></div>}
          <span className={`text-xs ${selected.length > 0 ? "" : "ml-auto"}`} style={{ color: SUBTLE }}>{filtered.length} folios</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>
            <th className="px-4 py-3 w-8"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(f=>f.id) : [])} /></th>
            {["Folio / Res", "Guest", "Room", "Dates", "Charges", "Payments", "Balance", "Days Open", "Last Activity", "Flags", ""].map((h,i) => <th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, backgroundColor: f.flags.highBalance && f.balance > 0 ? "#FFFBEB" : "transparent" }}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggleSel(f.id)} /></td>
                <td className="px-3 py-3">
                  <div className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{f.id}</div>
                  <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{f.res}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{f.av}</div>
                    <span className="text-sm font-semibold" style={{ color: TEXT }}>{f.guest}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{f.room}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: MUTED }}>{f.checkin} → {f.checkout}</td>
                <td className="px-3 py-3 text-sm font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{f.charges.toLocaleString()}</td>
                <td className="px-3 py-3 text-sm" style={{ color: SUCCESS, fontFamily: mono }}>₦{f.payments.toLocaleString()}</td>
                <td className="px-3 py-3">
                  {f.balance > 0 ? <span className="text-sm font-bold" style={{ color: f.flags.highBalance ? ERROR : TEXT, fontFamily: mono }}>₦{f.balance.toLocaleString()}</span> : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle2 size={11} />Settled</span>}
                </td>
                <td className="px-3 py-3 text-sm" style={{ color: MUTED }}>{f.daysOpen}d</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{f.lastActivity}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    {f.flags.highBalance && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>High ₦</span>}
                    {f.flags.noPayment && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>No Pay</span>}
                    {f.flags.creditLimit && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>CL</span>}
                    {f.flags.unposted && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FFF7ED", color: ORANGE }}>Unposted</span>}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => nav && nav("folio", f.guest)} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold whitespace-nowrap" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Open Folio</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={FileText} message="No folios match your search." />}
      </div>
    </div>
  );
}

const HK_STATUS_CYCLE = ["Dirty", "In Progress", "Clean", "Inspected"] as const;

export function HKBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const EXTENDED_ROOMS = [
    { id: "101", type: "Deluxe", floor: 1, hkSt: "Dirty", attendant: "Grace Achebe", priority: "High", since: "08:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "102", type: "Standard", floor: 1, hkSt: "In Progress", attendant: "Grace Achebe", priority: null, since: "09:15", dnd: false, inspectionFlag: false, guestState: "Stayover" },
    { id: "103", type: "Standard", floor: 1, hkSt: "Clean", attendant: "Amaka Osei", priority: null, since: "09:40", dnd: false, inspectionFlag: true, guestState: "Vacant" },
    { id: "104", type: "Deluxe", floor: 1, hkSt: "Inspected", attendant: "Grace Achebe", priority: null, since: "09:45", dnd: false, inspectionFlag: false, guestState: "Arrival" },
    { id: "201", type: "Standard", floor: 2, hkSt: "Dirty", attendant: "Ngozi Ike", priority: null, since: "08:30", dnd: true, inspectionFlag: false, guestState: "Stayover" },
    { id: "202", type: "Deluxe", floor: 2, hkSt: "Dirty", attendant: null, priority: "High", since: "08:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "203", type: "Standard", floor: 2, hkSt: "In Progress", attendant: "Ngozi Ike", priority: null, since: "09:30", dnd: false, inspectionFlag: false, guestState: "Stayover" },
    { id: "301", type: "Junior Suite", floor: 3, hkSt: "Dirty", attendant: "Amaka Osei", priority: null, since: "09:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "302", type: "Standard", floor: 3, hkSt: "Clean", attendant: "Amaka Osei", priority: null, since: "10:00", dnd: false, inspectionFlag: false, guestState: "Arrival" },
    { id: "304", type: "Junior Suite", floor: 3, hkSt: "Dirty", attendant: "Ngozi Ike", priority: "High", since: "08:15", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "501", type: "Presidential Suite", floor: 5, hkSt: "Inspected", attendant: "Grace Achebe", priority: null, since: "09:55", dnd: false, inspectionFlag: false, guestState: "Occupied" },
  ];
  const [rooms, setRooms] = useState(EXTENDED_ROOMS);
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("All");
  const [attFilter, setAttFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTarget, setBulkTarget] = useState("");
  const COLS = [
    { id: "Dirty", label: "Dirty", color: "#D97706", bg: "#FFFBEB" },
    { id: "In Progress", label: "In Progress", color: "#2563EB", bg: "#EFF6FF" },
    { id: "Clean", label: "Clean", color: "#059669", bg: "#F0FDF4" },
    { id: "Inspected", label: "Inspected", color: "#7C3AED", bg: "#F5F3FF" },
  ];
  const ATTENDANTS = ["All", ...Array.from(new Set(EXTENDED_ROOMS.map(r => r.attendant).filter(Boolean))) as string[]];
  const FLOORS = ["All", "1", "2", "3", "5"];
  const filtered = rooms.filter(r =>
    (!search || r.id.includes(search) || (r.attendant || "").toLowerCase().includes(search.toLowerCase())) &&
    (floorFilter === "All" || String(r.floor) === floorFilter) &&
    (attFilter === "All" || r.attendant === attFilter)
  );
  const moveTo = (roomId: string, colId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, hkSt: colId } : r));
    add({ type: "success", title: `Room ${roomId} → ${colId}` });
  };
  const bulkMove = () => {
    if (!bulkTarget || selected.length === 0) return;
    setRooms(prev => prev.map(r => selected.includes(r.id) ? { ...r, hkSt: bulkTarget } : r));
    add({ type: "success", title: `${selected.length} rooms → ${bulkTarget}` });
    setSelected([]); setBulkTarget("");
  };
  const toggleSel = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const guestStateColor = (gs: string) => gs === "Departure" ? ERROR : gs === "Arrival" ? TEAL : gs === "Stayover" ? MUTED : SUBTLE;
  return (
    <div>
      <PageHeader title="Housekeeping Board" sub="Floor-by-floor room status · Click advance button to update"
        actions={<><BtnO label="Print Report" icon={Download} /><BtnP label="Assign Rooms" icon={Plus} onClick={() => add({ type: "info", title: "Open schedule to assign rooms" })} /></>} />
      {/* Counts strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {COLS.map(c => { const n = rooms.filter(r => r.hkSt === c.id).length; const pri = rooms.filter(r => r.hkSt === c.id && r.priority).length; return (
          <div key={c.id} className="bg-white rounded-xl p-4 border flex items-center gap-3" style={{ borderColor: BORDER }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0" style={{ backgroundColor: c.bg, color: c.color }}>{n}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c.label}</div>
              {pri > 0 && <div className="text-xs mt-0.5 font-semibold" style={{ color: ERROR }}>{pri} priority</div>}
            </div>
          </div>
        ); })}
      </div>
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Room or attendant…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-44" style={{ borderColor: BORDER }} /></div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: MUTED }}>Floor:</span>
          {FLOORS.map(f => <button key={f} onClick={() => setFloorFilter(f)} className="text-xs px-2 py-1.5 rounded-lg border" style={{ backgroundColor: floorFilter === f ? PRIMARY : "white", color: floorFilter === f ? "white" : MUTED, borderColor: floorFilter === f ? PRIMARY : BORDER }}>{f}</button>)}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: MUTED }}>Attendant:</span>
          <select value={attFilter} onChange={e => setAttFilter(e.target.value)} className="text-xs px-2 py-1.5 rounded-lg border bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}>
            {ATTENDANTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        {selected.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: MUTED }}>{selected.length} selected</span>
            <select value={bulkTarget} onChange={e => setBulkTarget(e.target.value)} className="text-xs px-2 py-1.5 rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }}>
              <option value="">Move to…</option>
              {COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <button onClick={bulkMove} disabled={!bulkTarget} className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Apply</button>
            <button onClick={() => setSelected([])} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Clear</button>
          </div>
        )}
        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto text-xs" style={{ color: SUBTLE }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />Departure</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL }} />Arrival</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: MUTED }} />Stayover</span>
        </div>
      </div>
      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {COLS.map((col, ci) => {
          const colRooms = filtered.filter(r => r.hkSt === col.id);
          return (
            <div key={col.id} className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER, borderTop: `3px solid ${col.color}` }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: col.bg, borderColor: BORDER }}>
                <span className="text-sm font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: col.color + "22", color: col.color }}>{colRooms.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-64" style={{ backgroundColor: "#F9FAFB" }}>
                {colRooms.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs rounded-xl border-2 border-dashed" style={{ color: col.color + "70", borderColor: col.color + "30" }}>No rooms</div>
                )}
                {colRooms.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow" style={{ borderColor: selected.includes(r.id) ? PRIMARY : (r.priority ? ORANGE : BORDER), borderWidth: selected.includes(r.id) || r.priority ? 2 : 1 }}>
                    {/* Card header */}
                    <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: col.bg }}>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSel(r.id)} className="w-3.5 h-3.5" />
                        <span className="text-lg font-black" style={{ color: col.color }}>{r.id}</span>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: guestStateColor(r.guestState) }} title={r.guestState} />
                      </div>
                      <div className="flex items-center gap-1">
                        {r.dnd && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ backgroundColor: "#F3F4F6", color: MUTED }}>DND</span>}
                        {r.priority && <span className="text-xs px-1 py-0.5 rounded font-bold text-white" style={{ backgroundColor: ERROR }}>!</span>}
                        {r.inspectionFlag && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}>INS</span>}
                      </div>
                    </div>
                    <div className="px-3 pb-3 pt-1">
                      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: MUTED }}>
                        <span>{r.type} · F{r.floor}</span>
                        <span style={{ fontFamily: mono }}>{r.since}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span style={{ color: guestStateColor(r.guestState), fontWeight: 600 }}>{r.guestState}</span>
                        {r.attendant ? <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: col.color, fontSize: 9 }}>{r.attendant[0]}</div><span style={{ color: MUTED, fontSize: 10 }}>{r.attendant.split(" ")[0]}</span></div> : <span style={{ color: SUBTLE, fontSize: 10 }}>Unassigned</span>}
                      </div>
                      <div className="flex gap-1">
                        {ci < COLS.length - 1 && (
                          <button onClick={() => moveTo(r.id, COLS[ci + 1].id)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white" style={{ backgroundColor: COLS[ci + 1].color }}>
                            → {COLS[ci + 1].label}
                          </button>
                        )}
                        {nav && <button onClick={() => nav("work-orders", "Work Orders")} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>WO</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkOrders({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTech, setBulkTech] = useState("Emeka Nwosu");
  const [newWO, setNewWO] = useState({ title: "", location: "", category: "Electrical", priority: "Medium", reportedBy: "John Abubakar", desc: "" });

  const EXTENDED_WO = [
    { id: "WO-0091", title: "AC not cooling", location: "Room 207", cat: "HVAC", priority: "High", status: "In Progress", tech: "Emeka Nwosu", reportedBy: "John Abubakar", reportedAt: "24 Jun 08:58", slaDue: "24 Jun 14:58", age: "1h 20m", guestImpact: true },
    { id: "WO-0090", title: "Bathroom pipe leak", location: "Room 316", cat: "Plumbing", priority: "High", status: "Overdue", tech: "Emeka Nwosu", reportedBy: "Grace Mensah", reportedAt: "23 Jun 13:00", slaDue: "23 Jun 21:00", age: "19h", guestImpact: true },
    { id: "WO-0089", title: "Lobby light flickering", location: "Lobby", cat: "Electrical", priority: "Medium", status: "Reported", tech: "Unassigned", reportedBy: "Fatima Al-Hassan", reportedAt: "24 Jun 06:30", slaDue: "24 Jun 14:30", age: "3h", guestImpact: false },
    { id: "WO-0088", title: "Commercial fridge noisy", location: "Restaurant Kitchen", cat: "Equipment", priority: "Low", status: "Assigned", tech: "Chidi Ike", reportedBy: "Kitchen Staff", reportedAt: "23 Jun 09:00", slaDue: "25 Jun 09:00", age: "1d", guestImpact: false },
    { id: "WO-0087", title: "Wardrobe door hinge broken", location: "Room 102", cat: "Furniture", priority: "Low", status: "Completed", tech: "Chidi Ike", reportedBy: "Grace Achebe", reportedAt: "22 Jun 10:00", slaDue: "24 Jun 10:00", age: "2d", guestImpact: false },
    { id: "WO-0086", title: "Generator #2 oil change due", location: "Generator Room", cat: "Mechanical", priority: "Medium", status: "Assigned", tech: "Emeka Nwosu", reportedBy: "System PM", reportedAt: "24 Jun 07:00", slaDue: "26 Jun 07:00", age: "2h", guestImpact: false },
    { id: "WO-0085", title: "Pool pump making noise", location: "Pool Area", cat: "Equipment", priority: "Medium", status: "Reported", tech: "Unassigned", reportedBy: "Bola Adewale", reportedAt: "24 Jun 10:15", slaDue: "25 Jun 10:15", age: "45m", guestImpact: false },
  ];

  const overdueCnt = EXTENDED_WO.filter(w => w.status === "Overdue").length;
  const visible = EXTENDED_WO.filter(w => {
    if (filter !== "All" && w.status !== filter) return false;
    if (search && !`${w.id} ${w.title} ${w.location} ${w.tech}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleRow = (id: string) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === visible.length ? [] : visible.map(w=>w.id));

  const submitWO = () => {
    if (!newWO.location || !newWO.title) { add({ type: "warning", title: "Fill in title and location" }); return; }
    setShowNew(false);
    add({ type: "success", title: "Work order created", body: `${newWO.location} — ${newWO.category} · ${newWO.priority} priority` });
    setNewWO({ title: "", location: "", category: "Electrical", priority: "Medium", reportedBy: "John Abubakar", desc: "" });
  };

  return (
    <div>
      <PageHeader title="Work Orders" sub="All maintenance requests across the property"
        actions={<><BtnO label="Export" icon={Download} /><BtnP label="New Work Order" icon={Plus} onClick={() => setShowNew(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Open" value={String(EXTENDED_WO.filter(w=>w.status==="Reported"||w.status==="Assigned").length)} sub="Awaiting action" icon={AlertCircle} accent={ERROR} />
        <StatCard label="In Progress" value={String(EXTENDED_WO.filter(w=>w.status==="In Progress").length)} sub="Being worked on" icon={Activity} accent={ORANGE} />
        <StatCard label="Overdue" value={String(overdueCnt)} sub="Past SLA deadline" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Completed" value={String(EXTENDED_WO.filter(w=>w.status==="Completed").length)} sub="Resolved today" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, location, technician…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-56" style={{ borderColor: BORDER }} /></div>
        <div className="flex gap-2 flex-wrap">
          {["All","Reported","Assigned","In Progress","Overdue","Completed"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
              style={{ borderColor: filter===s ? PRIMARY : BORDER, backgroundColor: filter===s ? "#EFF6FF" : "white", color: filter===s ? PRIMARY : MUTED }}>
              {s}{s==="Overdue" && overdueCnt > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{overdueCnt}</span>}
            </button>
          ))}
        </div>
        {selected.length > 0 && <button onClick={() => setShowBulkAssign(true)} className="ml-auto px-3.5 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Assign {selected.length} selected</button>}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 8px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB", borderBottom: `2px solid ${BORDER}` }}>
              <th className="px-4 py-3 w-8"><input type="checkbox" checked={selected.length === visible.length && visible.length > 0} onChange={toggleAll} className="rounded" /></th>
              {["ID","Title / Location","Category","Priority","Status","Reported By","Reported At","SLA Due","Assigned To","Age",""].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(w => (
              <tr key={w.id} className="border-t hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ borderColor: "#F4F4F5", backgroundColor: w.status === "Overdue" ? "#FFF5F5" : "white" }}
                onClick={() => nav && nav("work-order-detail", w.id)}>
                <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleRow(w.id); }}><input type="checkbox" checked={selected.includes(w.id)} onChange={() => toggleRow(w.id)} className="rounded" /></td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.id}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    {w.guestImpact && <span title="Guest impact" style={{ color: ERROR }}>⚑</span>}
                    <div><div className="text-sm font-semibold" style={{ color: TEXT }}>{w.title}</div><div className="text-xs" style={{ color: SUBTLE }}>{w.location}</div></div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{w.cat}</td>
                <td className="px-3 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: priC[w.priority], backgroundColor: `${priC[w.priority]}15` }}>{w.priority}</span></td>
                <td className="px-3 py-3"><Badge label={w.status} colors={woC[w.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{w.reportedBy}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.reportedAt}</td>
                <td className="px-3 py-3 text-xs font-semibold" style={{ color: w.status === "Overdue" ? ERROR : MUTED, fontFamily: mono }}>{w.slaDue}</td>
                <td className="px-3 py-3 text-xs" style={{ color: w.tech === "Unassigned" ? WARNING : MUTED }}>{w.tech}</td>
                <td className="px-3 py-3 text-xs font-semibold" style={{ color: w.status === "Overdue" ? ERROR : ORANGE, fontFamily: mono }}>{w.age}</td>
                <td className="px-3 py-3"><button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: SUBTLE }} onClick={e => e.stopPropagation()}><MoreHorizontal size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState icon={Wrench} message="No work orders match this filter." cta="New Work Order" onCta={() => setShowNew(true)} />}
      </div>

      {/* Bulk Assign Modal */}
      {showBulkAssign && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowBulkAssign(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-3" style={{ color: TEXT }}>Bulk Assign — {selected.length} work orders</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Assign to Technician</label>
            <select value={bulkTech} onChange={e => setBulkTech(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
              {["Emeka Nwosu","Chidi Ike","External Vendor"].map(t => <option key={t}>{t}</option>)}
            </select></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowBulkAssign(false)} /><button onClick={() => { add({ type: "success", title: `${selected.length} WOs assigned to ${bulkTech}` }); setSelected([]); setShowBulkAssign(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Assign</button></div>
          </div>
        </>
      )}

      {/* New Work Order Modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: TEXT }}>New Work Order</h3>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>Report a maintenance issue across the property</p>
              </div>
              <button onClick={() => setShowNew(false)} style={{ color: SUBTLE }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Title</label>
                <input value={newWO.title} onChange={e => setNewWO(p => ({ ...p, title: e.target.value }))} placeholder="Brief description of the issue"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Location</label>
                <input value={newWO.location} onChange={e => setNewWO(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Room 207, Restaurant Kitchen, Pool Area"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Category</label>
                  <select value={newWO.category} onChange={e => setNewWO(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                    {["Electrical", "HVAC", "Plumbing", "Furniture", "Equipment", "General"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Priority</label>
                  <select value={newWO.priority} onChange={e => setNewWO(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                    {["Low", "Medium", "High"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label>
                <textarea value={newWO.desc} onChange={e => setNewWO(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue clearly. Include what's broken, how long it's been a problem, and any safety concerns." rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={() => setShowNew(false)} />
              <BtnP label="Create Work Order" icon={CheckCircle2} onClick={submitWO} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function InternalChat({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type Presence = "online" | "away" | "offline";
  const CHANNELS: { name: string; unread: number; pinned?: string }[] = [
    { name: "All Staff",     unread: 1, pinned: "📌 Reminder: Night audit at 23:00 tonight." },
    { name: "Front Desk",    unread: 0, pinned: "📌 New walk-in procedure posted — check docs." },
    { name: "Housekeeping",  unread: 3, pinned: undefined },
    { name: "Maintenance",   unread: 2, pinned: undefined },
    { name: "F&B",           unread: 0, pinned: undefined },
    { name: "Management",    unread: 0, pinned: "📌 Q4 targets shared in Files." },
  ];
  const DMS: { name: string; av: string; presence: Presence; unread: number }[] = [
    { name: "Fatima Ibrahim",  av: "FI", presence: "online",  unread: 1 },
    { name: "Chukwuemeka Obi", av: "CO", presence: "away",    unread: 0 },
    { name: "Amina Yusuf",     av: "AY", presence: "online",  unread: 0 },
    { name: "Kemi Adeyemi",    av: "KA", presence: "offline", unread: 0 },
  ];
  const presenceColor: Record<Presence, string> = { online: SUCCESS, away: WARNING, offline: SUBTLE };

  const [activeCh, setActiveCh]     = useState("Front Desk");
  const [activeView, setActiveView] = useState<"channel"|"dm">("channel");
  const [activeDM, setActiveDM]     = useState(DMS[0].name);
  const [msg, setMsg]               = useState("");
  const [search, setSearch]         = useState("");
  const [showPinned, setShowPinned] = useState(false);
  const msgs = CHAT_MSGS[activeCh] ?? [];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeCh, activeDM]);

  const pinnedMsg = CHANNELS.find(c => c.name === activeCh)?.pinned;
  const filtered = search ? msgs.filter(m => m.msg.toLowerCase().includes(search.toLowerCase())) : msgs;
  const send = () => {
    if (!msg.trim()) return;
    add({ type: "success", title: "Message sent", body: activeView === "channel" ? `#${activeCh}` : `DM → ${activeDM}` });
    setMsg("");
  };

  // Reusable bubble
  const Bubble = ({ m }: { m: { from: string; av: string; msg: string; time: string; mine?: boolean } }) => (
    <div className={`flex items-end gap-3 ${m.mine ? "flex-row-reverse" : ""}`}>
      {!m.mine && <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-1" style={{ backgroundColor: PRIMARY }}>{m.av}</div>}
      <div className={`max-w-xs lg:max-w-md flex flex-col ${m.mine ? "items-end" : "items-start"}`}>
        {!m.mine && <span className="text-xs font-medium mb-1" style={{ color: MUTED }}>{m.from}</span>}
        <div className="px-3 py-2 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: m.mine ? PRIMARY : "#F4F4F5", color: m.mine ? "white" : TEXT }}>{m.msg}</div>
        <span className="text-xs mt-1" style={{ color: SUBTLE, fontFamily: mono }}>{m.time}</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Internal Chat" sub="LAN-based staff messaging · Fully offline"
        actions={
          <button onClick={() => add({ type: "warning", title: "Emergency broadcast sent to all staff" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>
            <AlertTriangle size={14} /> Emergency Broadcast
          </button>
        }
      />
      <div className="bg-white rounded-xl border overflow-hidden flex" style={{ borderColor: BORDER, height: 600 }}>
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ borderColor: BORDER }}>
          <div className="p-2 border-b" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
              <Search size={12} style={{ color: SUBTLE }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" className="flex-1 text-xs outline-none bg-transparent" style={{ color: TEXT }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: SUBTLE }}>Channels</div>
            {CHANNELS.map(ch => (
              <button key={ch.name} onClick={() => { setActiveCh(ch.name); setActiveView("channel"); }}
                className="w-full flex items-center justify-between px-3 py-2 text-left"
                style={{ backgroundColor: activeView === "channel" && activeCh === ch.name ? "#EFF6FF" : "transparent", borderLeft: `3px solid ${activeView === "channel" && activeCh === ch.name ? PRIMARY : "transparent"}` }}>
                <span className="text-xs font-medium" style={{ color: activeView === "channel" && activeCh === ch.name ? PRIMARY : TEXT }}>#{ch.name}</span>
                {ch.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ERROR, fontSize: 10 }}>{ch.unread}</span>}
              </button>
            ))}
            <div className="px-3 pt-3 pb-1 mt-1 border-t text-xs font-semibold uppercase tracking-wider" style={{ color: SUBTLE, borderColor: BORDER }}>Direct Messages</div>
            {DMS.map(dm => (
              <button key={dm.name} onClick={() => { setActiveDM(dm.name); setActiveView("dm"); }}
                className="w-full flex items-center gap-2 px-3 py-2"
                style={{ backgroundColor: activeView === "dm" && activeDM === dm.name ? "#EFF6FF" : "transparent" }}>
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{dm.av}</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: presenceColor[dm.presence] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: TEXT }}>{dm.name.split(" ")[0]}</div>
                  <div className="text-xs" style={{ color: SUBTLE }}>{dm.presence}</div>
                </div>
                {dm.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ERROR, fontSize: 10 }}>{dm.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}18` }}>
                <MessageSquare size={16} style={{ color: PRIMARY }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: TEXT }}>
                  {activeView === "channel" ? `#${activeCh}` : activeDM}
                </div>
                <div className="text-xs" style={{ color: SUBTLE }}>
                  {activeView === "channel" ? "Department channel" : `${DMS.find(d => d.name === activeDM)?.presence}`}
                </div>
              </div>
            </div>
            {activeView === "channel" && pinnedMsg && (
              <button onClick={() => setShowPinned(p => !p)} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                📌 Pinned
              </button>
            )}
          </div>

          {/* Pinned banner */}
          {showPinned && pinnedMsg && (
            <div className="px-5 py-2.5 text-xs border-b" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A", color: "#92400E" }}>
              {pinnedMsg}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
            {search && <div className="text-xs text-center mb-2" style={{ color: MUTED }}>Showing results for "{search}"</div>}
            {filtered.length === 0 && <div className="text-center text-xs mt-8" style={{ color: SUBTLE }}>No messages found.</div>}
            {filtered.map((m, i) => <Bubble key={i} m={m} />)}
            {activeView === "dm" && (
              <Bubble m={{ from: activeDM, av: DMS.find(d=>d.name===activeDM)?.av ?? "?", msg: "Hi, let me check on that and get back to you shortly.", time: "14:22", mine: false }} />
            )}
            <div ref={endRef} />
          </div>

          {/* Compose */}
          <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder={activeView === "channel" ? `Message #${activeCh}…` : `Message ${activeDM.split(" ")[0]}…`}
                className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
              <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: PRIMARY }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function POSTerminal({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  type OrderLine = { id: number; name: string; price: number; qty: number; note: string; mod: string };
  const [order, setOrder] = useState<OrderLine[]>([]);
  const [activeCat, setActiveCat] = useState("Mains");
  const [payMethod, setPayMethod] = useState("cash");
  const [cashIn, setCashIn] = useState("");
  const [compReason, setCompReason] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("202");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [activeTable, setActiveTable] = useState("T02");
  const [editNote, setEditNote] = useState<number | null>(null);
  const [noteVal, setNoteVal] = useState("");
  const [held, setHeld] = useState(false);

  const FULL_MENU = [
    { id: 1, name: "Jollof Rice + Chicken", price: 4500, cat: "Mains", avail: true, mods: ["Extra spicy","Less spicy","No pepper"] },
    { id: 2, name: "Egusi Soup + Pounded Yam", price: 5200, cat: "Mains", avail: true, mods: ["Extra soup","Half portion"] },
    { id: 3, name: "Grilled Fish", price: 6800, cat: "Mains", avail: true, mods: ["No pepper","Extra lemon"] },
    { id: 13, name: "Pepper Soup", price: 5500, cat: "Mains", avail: false, mods: [] },
    { id: 11, name: "Suya", price: 3000, cat: "Starters", avail: true, mods: ["Extra suya spice","Less spice"] },
    { id: 12, name: "Spring Rolls (6pc)", price: 2800, cat: "Starters", avail: true, mods: [] },
    { id: 14, name: "Garden Salad", price: 2200, cat: "Starters", avail: true, mods: ["No onion","Extra dressing"] },
    { id: 4, name: "Fried Plantain", price: 1500, cat: "Sides", avail: true, mods: [] },
    { id: 5, name: "Moi Moi", price: 1200, cat: "Sides", avail: false, mods: [] },
    { id: 15, name: "White Rice", price: 800, cat: "Sides", avail: true, mods: [] },
    { id: 6, name: "Chapman", price: 2000, cat: "Drinks", avail: true, mods: [] },
    { id: 7, name: "Zobo", price: 1000, cat: "Drinks", avail: true, mods: [] },
    { id: 8, name: "Bottled Water", price: 500, cat: "Drinks", avail: true, mods: [] },
    { id: 16, name: "Fanta / Coke", price: 600, cat: "Drinks", avail: true, mods: [] },
    { id: 9, name: "Chocolate Cake", price: 3500, cat: "Desserts", avail: true, mods: [] },
    { id: 10, name: "Fruit Salad", price: 2500, cat: "Desserts", avail: true, mods: [] },
  ];

  const CATS = ["Mains","Starters","Sides","Drinks","Desserts"];
  const catItems = FULL_MENU.filter(i => i.cat === activeCat);

  const addItem = (item: typeof FULL_MENU[0]) => {
    if (!item.avail) return;
    setOrder(prev => {
      const ex = prev.find(o => o.id === item.id);
      if (ex) return prev.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, note: "", mod: item.mods[0] ?? "" }];
    });
  };
  const setQty = (id: number, qty: number) => { if (qty < 1) setOrder(p => p.filter(o => o.id !== id)); else setOrder(p => p.map(o => o.id === id ? { ...o, qty } : o)); };
  const setMod = (id: number, mod: string) => setOrder(p => p.map(o => o.id === id ? { ...o, mod } : o));
  const voidLine = (id: number) => { setOrder(p => p.filter(o => o.id !== id)); add({ type: "warning", title: "Line voided" }); };

  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const svcCharge = Math.round(subtotal * 0.10);
  const vat = Math.round((subtotal + svcCharge) * 0.075);
  const total = subtotal + svcCharge + vat;
  const cashInNum = parseFloat(cashIn.replace(/,/g, "")) || 0;
  const change = Math.max(0, cashInNum - total);

  const sendToKitchen = () => {
    if (order.length === 0) return;
    add({ type: "success", title: "Order sent to kitchen", body: `${order.reduce((s,o)=>s+o.qty,0)} items · ${activeTable}` });
    setOrder([]); setHeld(false);
  };

  const handlePayment = () => {
    if (order.length === 0) return;
    if (payMethod === "cash" && cashInNum < total) { add({ type: "warning", title: "Insufficient cash tendered" }); return; }
    if (payMethod === "complimentary" && !compReason.trim()) { add({ type: "warning", title: "Complimentary reason required" }); return; }
    if (payMethod === "room") { const g = IN_HOUSE.find(x => x.room === selectedRoom); add({ type: "success", title: "Posted to room folio", body: `₦${total.toLocaleString()} → Room ${selectedRoom} · ${g?.guest ?? ""}` }); }
    else add({ type: "success", title: `Payment received — ${payMethod.toUpperCase()}`, body: `₦${total.toLocaleString()} · ${activeTable}` });
    setOrder([]); setCashIn(""); setCompReason("");
  };

  const PAY_METHODS = [
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "pos", label: "POS Terminal" },
    { id: "room", label: "Room Charge" },
    { id: "complimentary", label: "Comp" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="text-xl font-bold" style={{ color: TEXT }}>POS Terminal</div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs" style={{ color: MUTED }}>Table:</span>
          {TABLE_LAYOUT.slice(0, 6).map(t => <button key={t.id} onClick={() => setActiveTable(t.id)} className="text-xs px-2.5 py-1 rounded-lg border font-semibold" style={{ backgroundColor: activeTable===t.id ? PRIMARY : "white", color: activeTable===t.id ? "white" : MUTED, borderColor: activeTable===t.id ? PRIMARY : BORDER }}>{t.id}</button>)}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => nav && nav("table-management", "Tables")} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border" style={{ color: MUTED, borderColor: BORDER }}><Layers size={13} />Tables</button>
          {held && <span className="text-xs px-2.5 py-2 rounded-xl font-bold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>HELD</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Today's Revenue" value="₦184,500" sub="POS transactions" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Orders" value="42" sub="Completed today" icon={ClipboardList} accent={TEAL} />
        <StatCard label="Avg Order" value="₦4,393" sub="Per ticket" icon={TrendingUp} accent={SUCCESS} />
        <StatCard label="Open Tabs" value="3" sub="Room folio charges" icon={FileText} accent={ORANGE} />
      </div>

      <div className="flex gap-3" style={{ height: 600 }}>
        {/* LEFT — menu grid */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            {CATS.map(c => <button key={c} onClick={() => setActiveCat(c)} className="flex-1 py-3 text-sm font-semibold transition-colors" style={{ color: activeCat===c ? PRIMARY : MUTED, borderBottom: activeCat===c ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{c}</button>)}
          </div>
          <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {catItems.map(item => {
                const inOrder = order.find(o => o.id === item.id);
                return (
                  <button key={item.id} onClick={() => addItem(item)} disabled={!item.avail} className="p-4 rounded-xl border-2 text-left transition-all" style={{ borderColor: inOrder ? PRIMARY : BORDER, backgroundColor: !item.avail ? "#F9FAFB" : inOrder ? "#EFF6FF" : "white", opacity: item.avail ? 1 : 0.55, cursor: item.avail ? "pointer" : "not-allowed" }}>
                    <div className="text-sm font-semibold mb-1 leading-tight" style={{ color: item.avail ? TEXT : SUBTLE }}>{item.name}</div>
                    <div className="text-base font-bold" style={{ color: item.avail ? PRIMARY : SUBTLE }}>₦{item.price.toLocaleString()}</div>
                    {!item.avail && <div className="text-xs mt-1 font-semibold" style={{ color: ERROR }}>86'd</div>}
                    {inOrder && <div className="text-xs mt-1 font-semibold" style={{ color: TEAL }}>×{inOrder.qty} added</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTRE — order lines */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{activeTable} · Current Order</div><div className="text-xs" style={{ color: SUBTLE }}>{order.reduce((s,o)=>s+o.qty,0)} items</div></div>
            {order.length > 0 && <button onClick={() => { setHeld(true); add({ type: "info", title: `${activeTable} order held` }); }} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>Hold</button>}
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {order.length === 0
              ? <div className="flex flex-col items-center justify-center h-full text-center px-4"><ShoppingCart size={28} style={{ color: SUBTLE }} /><p className="text-xs mt-2" style={{ color: SUBTLE }}>Tap menu items to add to order</p></div>
              : order.map(o => {
                  const menuItem = FULL_MENU.find(i => i.id === o.id);
                  return (
                    <div key={o.id} className="px-3 py-3 border-b" style={{ borderColor: "#F4F4F5" }}>
                      <div className="flex items-start gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: TEXT }}>{o.name}</div>
                          <div className="text-xs" style={{ color: MUTED }}>₦{o.price.toLocaleString()} each</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setQty(o.id, o.qty-1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}><MinusCircle size={13} /></button>
                          <span className="w-5 text-center text-xs font-bold" style={{ color: TEXT }}>{o.qty}</span>
                          <button onClick={() => setQty(o.id, o.qty+1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: PRIMARY }}><PlusCircle size={13} /></button>
                        </div>
                        <div className="text-xs font-bold w-14 text-right" style={{ color: TEXT }}>₦{(o.price*o.qty).toLocaleString()}</div>
                      </div>
                      {menuItem && menuItem.mods.length > 0 && (
                        <select value={o.mod} onChange={e => setMod(o.id, e.target.value)} className="w-full text-xs px-2 py-1 rounded-lg border outline-none mb-1" style={{ borderColor: BORDER, color: MUTED }}>
                          {menuItem.mods.map(m => <option key={m}>{m}</option>)}
                        </select>
                      )}
                      <div className="flex items-center gap-2">
                        {editNote === o.id
                          ? <input autoFocus value={noteVal} onChange={e=>setNoteVal(e.target.value)} onBlur={() => { setOrder(p=>p.map(x=>x.id===o.id?{...x,note:noteVal}:x)); setEditNote(null); }} className="flex-1 text-xs px-2 py-1 rounded-lg border outline-none" style={{ borderColor: BORDER }} placeholder="Note…" />
                          : <button onClick={() => { setEditNote(o.id); setNoteVal(o.note); }} className="text-xs" style={{ color: o.note ? TEAL : SUBTLE }}>✎ {o.note || "Add note"}</button>
                        }
                        <button onClick={() => voidLine(o.id)} className="text-xs ml-auto px-2 py-0.5 rounded" style={{ color: ERROR, backgroundColor: "#FEF2F2" }}>void</button>
                      </div>
                    </div>
                  );
                })
            }
          </div>
          {order.length > 0 && (
            <div className="px-4 py-3 border-t" style={{ borderColor: BORDER }}>
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between"><span style={{ color: MUTED }}>Subtotal</span><span style={{ fontFamily: mono }}>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>Service Charge 10%</span><span style={{ fontFamily: mono }}>₦{svcCharge.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>VAT 7.5%</span><span style={{ fontFamily: mono }}>₦{vat.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t" style={{ color: TEXT, borderColor: BORDER }}>
                  <span>Total</span><span style={{ fontFamily: mono }}>₦{total.toLocaleString()}</span>
                </div>
              </div>
              <BtnP label="Send to Kitchen" icon={UtensilsCrossed} onClick={sendToKitchen} />
            </div>
          )}
        </div>

        {/* RIGHT — payment panel */}
        <div className="w-64 flex-shrink-0 bg-white rounded-xl border flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}><div className="text-sm font-bold" style={{ color: TEXT }}>Payment</div></div>
          <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
            {/* Payment method */}
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Method</div>
              <div className="grid grid-cols-2 gap-1.5">
                {PAY_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} className="py-2 rounded-xl text-xs font-semibold border-2 transition-all" style={{ borderColor: payMethod===m.id ? PRIMARY : BORDER, backgroundColor: payMethod===m.id ? "#EFF6FF" : "white", color: payMethod===m.id ? PRIMARY : MUTED }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash change calculator */}
            {payMethod === "cash" && (
              <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Cash Tendered</div>
                <input value={cashIn} onChange={e=>setCashIn(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none" style={{ borderColor: BORDER, fontFamily: mono }} />
                {cashInNum > 0 && <div className="mt-2 flex justify-between text-xs"><span style={{ color: MUTED }}>Change</span><span className="font-bold" style={{ color: change >= 0 ? SUCCESS : ERROR, fontFamily: mono }}>₦{change.toLocaleString()}</span></div>}
              </div>
            )}

            {/* Room charge picker */}
            {payMethod === "room" && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Guest Room</div>
                <button onClick={() => setShowRoomPicker(p=>!p)} className="w-full px-3 py-2 rounded-xl border text-xs text-left flex items-center justify-between" style={{ borderColor: BORDER }}>
                  <span style={{ color: TEXT }}>Room {selectedRoom}</span>
                  <ChevronDown size={12} style={{ color: SUBTLE }} />
                </button>
                {showRoomPicker && (
                  <div className="mt-1 rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: BORDER }}>
                    {IN_HOUSE.map(g => <button key={g.room} onClick={() => { setSelectedRoom(g.room); setShowRoomPicker(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] border-b last:border-0" style={{ borderColor: "#F4F4F5", color: TEXT }}><span className="font-semibold">Room {g.room}</span> — {g.guest}</button>)}
                  </div>
                )}
              </div>
            )}

            {/* Complimentary reason */}
            {payMethod === "complimentary" && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Reason (required)</div>
                <textarea value={compReason} onChange={e=>setCompReason(e.target.value)} rows={2} placeholder="e.g. VIP guest, manager approval…" className="w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none" style={{ borderColor: BORDER }} />
              </div>
            )}

            {/* Order total summary */}
            {order.length > 0 && (
              <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: SUCCESS }}>Order Total</div>
                <div className="text-xl font-black" style={{ color: SUCCESS, fontFamily: mono }}>₦{total.toLocaleString()}</div>
              </div>
            )}
          </div>
          <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: BORDER }}>
            <button disabled={order.length === 0} onClick={handlePayment} className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: SUCCESS }}>
              Charge ₦{total.toLocaleString()}
            </button>
            <button onClick={() => { add({ type: "info", title: `${activeTable} order held` }); setHeld(true); }} disabled={order.length === 0} className="w-full py-2.5 rounded-xl text-xs font-semibold border disabled:opacity-40" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>
              Hold Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableManagement({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  type TblStatus = "Available" | "Occupied" | "Reserved" | "Dirty";
  type TblRow = { id: string; seats: number; status: TblStatus; col: number; row: number; guest?: string; time?: string; server?: string; orderValue?: number; covers?: number };

  const TABLES: TblRow[] = [
    { id: "T01", seats: 2, status: "Available", col: 1, row: 1 },
    { id: "T02", seats: 4, status: "Occupied", col: 3, row: 1, guest: "Okafor party", time: "34m", server: "Mike A.", orderValue: 18500, covers: 3 },
    { id: "T03", seats: 4, status: "Occupied", col: 5, row: 1, guest: "Adeyemi ×4", time: "12m", server: "Bisi O.", orderValue: 9200, covers: 4 },
    { id: "T04", seats: 6, status: "Reserved", col: 7, row: 1 },
    { id: "T05", seats: 2, status: "Available", col: 1, row: 3 },
    { id: "T06", seats: 4, status: "Occupied", col: 3, row: 3, guest: "Couple", time: "1h 5m", server: "Mike A.", orderValue: 14800, covers: 2 },
    { id: "T07", seats: 4, status: "Dirty", col: 5, row: 3 },
    { id: "T08", seats: 8, status: "Available", col: 7, row: 3 },
    { id: "T09", seats: 2, status: "Occupied", col: 1, row: 5, guest: "Dr. Bello ×2", time: "22m", server: "Bisi O.", orderValue: 12000, covers: 2 },
    { id: "T10", seats: 6, status: "Reserved", col: 3, row: 5 },
    { id: "T11", seats: 4, status: "Available", col: 5, row: 5 },
    { id: "T12", seats: 4, status: "Occupied", col: 7, row: 5, guest: "Eze family", time: "8m", server: "Mike A.", orderValue: 4500, covers: 3 },
  ];

  const [tables, setTables] = useState<TblRow[]>(TABLES);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSeat, setShowSeat] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [seatParty, setSeatParty] = useState({ size: "2", server: "Mike A." });
  const [transferTo, setTransferTo] = useState("");

  const sel = selected ? tables.find(t => t.id === selected) : null;
  const c = sel ? (tblC[sel.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" }) : null;

  const seat = () => {
    setTables(p => p.map(t => t.id === selected ? { ...t, status: "Occupied" as TblStatus, guest: `Party of ${seatParty.size}`, time: "0m", server: seatParty.server, covers: parseInt(seatParty.size), orderValue: 0 } : t));
    add({ type: "success", title: `Table ${selected} seated — party of ${seatParty.size}` });
    setShowSeat(false);
  };

  const markClean = (id: string) => { setTables(p => p.map(t => t.id === id ? { ...t, status: "Available" as TblStatus, guest: undefined, time: undefined, server: undefined, orderValue: undefined, covers: undefined } : t)); add({ type: "success", title: `Table ${id} marked clean` }); };
  const markDirty = (id: string) => { setTables(p => p.map(t => t.id === id ? { ...t, status: "Dirty" as TblStatus } : t)); add({ type: "info", title: `Table ${id} marked dirty` }); setSelected(null); };

  const transferTable = () => {
    if (!transferTo || !selected) return;
    const from = tables.find(t => t.id === selected)!;
    setTables(p => p.map(t => {
      if (t.id === selected) return { ...t, status: "Dirty" as TblStatus, guest: undefined, time: undefined, server: undefined, orderValue: undefined };
      if (t.id === transferTo) return { ...t, status: "Occupied" as TblStatus, guest: from.guest, time: from.time, server: from.server, orderValue: from.orderValue, covers: from.covers };
      return t;
    }));
    add({ type: "success", title: `Order transferred ${selected} → ${transferTo}` });
    setSelected(transferTo); setShowTransfer(false);
  };

  const SERVERS = ["Mike A.", "Bisi O.", "Tunde E."];

  return (
    <div>
      <PageHeader title="Table Management" sub="Restaurant floor plan · Live status" actions={<><BtnO label="Dining Reservations" icon={CalendarDays} onClick={() => nav && nav("dining-reservations", "Dining Reservations")} /><BtnP label="Open POS" icon={UtensilsCrossed} onClick={() => nav && nav("pos-terminal", "POS Terminal")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Occupied" value={String(tables.filter(t=>t.status==="Occupied").length)} sub="Currently serving" icon={UtensilsCrossed} accent={ORANGE} />
        <StatCard label="Available" value={String(tables.filter(t=>t.status==="Available").length)} sub="Ready for seating" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Reserved" value={String(tables.filter(t=>t.status==="Reserved").length)} sub="Upcoming bookings" icon={CalendarDays} accent={TEAL} />
        <StatCard label="On Floor" value={`₦${tables.filter(t=>t.status==="Occupied").reduce((s,t)=>s+(t.orderValue??0),0).toLocaleString()}`} sub="Open tab value" icon={DollarSign} accent={PRIMARY} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Floor plan */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Floor Plan — Main Dining Room</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 10, minHeight: 300 }}>
            {tables.map(t => {
              const tc = tblC[t.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" };
              const isSelected = selected === t.id;
              return (
                <div key={t.id} onClick={() => setSelected(isSelected ? null : t.id)} className="cursor-pointer rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:shadow-md" style={{ gridColumn: `${t.col} / span 2`, gridRow: `${t.row} / span 2`, backgroundColor: isSelected ? `${tc.border}25` : tc.bg, borderColor: isSelected ? tc.border : `${tc.border}60`, padding: 8, minHeight: 80 }}>
                  <div className="text-xs font-black" style={{ color: tc.text }}>{t.id}</div>
                  <div className="text-xs" style={{ color: tc.text }}>{t.seats}p</div>
                  {t.status === "Occupied" && t.time && <div className="text-xs font-bold mt-0.5" style={{ color: tc.text, fontFamily: mono }}>{t.time}</div>}
                  {t.status === "Occupied" && t.orderValue != null && t.orderValue > 0 && <div className="text-xs mt-0.5 font-semibold" style={{ color: tc.text }}>₦{Math.round(t.orderValue/1000)}k</div>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t text-xs flex-wrap" style={{ borderColor: "#F4F4F5", color: MUTED }}>
            {Object.entries(tblC).map(([s, tc]) => <span key={s} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block border" style={{ backgroundColor: tc.bg, borderColor: tc.border }} />{s}</span>)}
          </div>
        </div>

        {/* Action panel */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          {sel && c ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-bold" style={{ color: TEXT }}>Table {sel.id}</div>
                <Badge label={sel.status} colors={{ bg: c.bg, text: c.text }} />
              </div>
              <div className="space-y-2 text-xs mb-4 border-b pb-4" style={{ borderColor: BORDER }}>
                {[["Seats", `${sel.seats} persons`], ...(sel.covers ? [["Covers", `${sel.covers}`]] : []), ...(sel.guest ? [["Party", sel.guest]] : []), ...(sel.time ? [["Seated", sel.time + " ago"]] : []), ...(sel.server ? [["Server", sel.server]] : []), ...(sel.orderValue != null && sel.orderValue > 0 ? [["Tab Value", `₦${sel.orderValue.toLocaleString()}`]] : [])].map(([k,v]) => (
                  <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>
                ))}
              </div>
              <div className="space-y-2">
                {sel.status === "Available" && <BtnP label="Seat Party" icon={Users} onClick={() => setShowSeat(true)} />}
                {sel.status === "Occupied" && <>
                  <BtnP label="Open POS / Check" icon={FileText} onClick={() => nav && nav("pos-terminal", "POS")} />
                  <BtnO label="Transfer Table" icon={ArrowRight} onClick={() => { setShowTransfer(true); setTransferTo(""); }} />
                  <BtnO label="Mark Dirty / Cleared" icon={AlertCircle} onClick={() => markDirty(sel.id)} />
                </>}
                {sel.status === "Dirty" && <BtnP label="Mark Clean ✓" icon={CheckCircle2} onClick={() => { markClean(sel.id); setSelected(null); }} color={SUCCESS} />}
                {sel.status === "Reserved" && <BtnP label="Seat Walk-in" icon={Users} onClick={() => setShowSeat(true)} />}
                {/* Assign server */}
                {sel.status === "Occupied" && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Assign Server</label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl border outline-none" style={{ borderColor: BORDER }} defaultValue={sel.server ?? ""} onChange={e => { setTables(p => p.map(t => t.id === sel.id ? { ...t, server: e.target.value } : t)); add({ type: "info", title: `Server updated — ${sel.id}` }); }}>
                      {SERVERS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : <EmptyState icon={UtensilsCrossed} message="Click a table on the floor plan to view details and actions." />}
        </div>
      </div>

      {/* Seat modal */}
      {showSeat && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowSeat(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Seat Party — Table {selected}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Party Size</label>
              <select value={seatParty.size} onChange={e=>setSeatParty(p=>({...p,size:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
                {["1","2","3","4","5","6","7","8"].map(n=><option key={n}>{n}</option>)}
              </select></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Server</label>
              <select value={seatParty.server} onChange={e=>setSeatParty(p=>({...p,server:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
                {SERVERS.map(s=><option key={s}>{s}</option>)}
              </select></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowSeat(false)} /><button onClick={seat} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Seat Party</button></div>
          </div>
        </>
      )}

      {/* Transfer modal */}
      {showTransfer && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowTransfer(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Transfer Table {selected} →</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Transfer to</label>
            <select value={transferTo} onChange={e=>setTransferTo(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
              <option value="">Select available table…</option>
              {tables.filter(t=>t.status==="Available" && t.id !== selected).map(t=><option key={t.id}>{t.id} ({t.seats} seats)</option>)}
            </select></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowTransfer(false)} /><button disabled={!transferTo} onClick={transferTable} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Transfer</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// BranchOverview → MultibranchSettingsScreens.tsx
export { BranchOverview } from "./MultibranchSettingsScreens";

export function StaffDirectory({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const STAFF_FULL = [
    { id:"EMP-001", name:"John Abubakar",    role:"Front Desk Officer",  dept:"Front Desk",  phone:"0803-001-1001", email:"j.abubakar@grandpalms.ng",   empType:"Full-time",  hireDate:"03 Jan 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" as const },
    { id:"EMP-002", name:"Amaka Osei",       role:"Housekeeping Attendant",dept:"Housekeeping",phone:"0802-002-2002",email:"a.osei@grandpalms.ng",       empType:"Full-time",  hireDate:"15 Mar 2021", status:"Active",   shift:"Morning 06:00–14:00", gender:"F" as const },
    { id:"EMP-003", name:"Emeka Nwosu",      role:"Executive Chef",       dept:"Restaurant",  phone:"0801-003-3003", email:"e.nwosu@grandpalms.ng",       empType:"Full-time",  hireDate:"01 Jun 2020", status:"Active",   shift:"Morning 06:00–14:00", gender:"M" as const },
    { id:"EMP-004", name:"Fatima Ibrahim",   role:"Reservations Manager", dept:"Front Desk",  phone:"0805-004-4004", email:"f.ibrahim@grandpalms.ng",     empType:"Full-time",  hireDate:"20 Sep 2023", status:"Active",   shift:"Morning 08:00–16:00", gender:"F" as const },
    { id:"EMP-005", name:"Chidi Eze",        role:"Maintenance Engineer", dept:"Maintenance", phone:"0806-005-5005", email:"c.eze@grandpalms.ng",         empType:"Full-time",  hireDate:"10 Apr 2019", status:"Active",   shift:"Rotating",            gender:"M" as const },
    { id:"EMP-006", name:"Ngozi Okonkwo",    role:"HK Supervisor",       dept:"Housekeeping",phone:"0807-006-6006", email:"n.okonkwo@grandpalms.ng",     empType:"Full-time",  hireDate:"01 Feb 2022", status:"On Leave", shift:"Morning 06:00–14:00", gender:"F" as const },
    { id:"EMP-007", name:"Bello Musa",       role:"Finance Officer",      dept:"Finance",     phone:"0808-007-7007", email:"b.musa@grandpalms.ng",        empType:"Full-time",  hireDate:"14 Jul 2023", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" as const },
    { id:"EMP-008", name:"Ada Okonkwo",      role:"Guest Relations",      dept:"Front Desk",  phone:"0809-008-8008", email:"a.okonkwo@grandpalms.ng",     empType:"Contract",   hireDate:"01 Jan 2025", status:"Active",   shift:"Evening 15:00–23:00", gender:"F" as const },
    { id:"EMP-009", name:"Tunde Adeyemi",    role:"IT Administrator",     dept:"IT",          phone:"0810-009-9009", email:"t.adeyemi@grandpalms.ng",     empType:"Full-time",  hireDate:"05 May 2021", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" as const },
    { id:"EMP-010", name:"Grace Ojo",        role:"Restaurant Supervisor",dept:"Restaurant",  phone:"0811-010-1010", email:"g.ojo@grandpalms.ng",         empType:"Full-time",  hireDate:"22 Oct 2022", status:"Active",   shift:"Evening 14:00–22:00", gender:"F" as const },
    { id:"EMP-011", name:"Samuel Okafor",    role:"Security Officer",     dept:"Security",    phone:"0812-011-1011", email:"s.okafor@grandpalms.ng",      empType:"Contract",   hireDate:"01 Mar 2024", status:"Active",   shift:"Night 23:00–07:00",   gender:"M" as const },
    { id:"EMP-012", name:"Chidinma Eze",     role:"Spa Therapist",        dept:"Spa",         phone:"0813-012-1012", email:"c.eze2@grandpalms.ng",        empType:"Part-time",  hireDate:"15 Aug 2023", status:"Inactive", shift:"Morning 09:00–15:00", gender:"F" as const },
  ];

  const deptColors: Record<string, string> = { "Front Desk":"#2563EB","Housekeeping":"#059669","Maintenance":"#D97706","Restaurant":"#9333EA","Finance":"#0891B2","IT":"#DC2626","Security":"#374151","Spa":"#BE185D" };
  const stColors: Record<string,{bg:string;text:string}> = { Active:{bg:"#DCFCE7",text:"#166534"}, "On Leave":{bg:"#FEF3C7",text:"#92400E"}, Inactive:{bg:"#F3F4F6",text:"#374151"} };

  const [search, setSearch]     = useState("");
  const [dept, setDept]         = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [view, setView]         = useState<"card"|"table">("card");

  const depts = ["All", ...Array.from(new Set(STAFF_FULL.map(s=>s.dept)))];

  const filtered = STAFF_FULL.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (dept==="All" || s.dept===dept) &&
    (statusF==="All" || s.status===statusF)
  );

  return (
    <div>
      <PageHeader title="Staff Directory" sub={`${filtered.length} of ${STAFF_FULL.length} staff members`} actions={
        <div className="flex gap-2">
          <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting staff list" })} />
          <BtnP label="Add Staff" icon={Plus} onClick={() => add({ type:"info", title:"Add staff member" })} />
        </div>
      } />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Staff"  value={String(STAFF_FULL.length)}                                          sub="All employment types" icon={Users}         accent={PRIMARY} />
        <StatCard label="On Shift"     value={String(STAFF_FULL.filter(s=>s.status==="Active").length)}            sub="Currently active"    icon={CheckCircle2}  accent={SUCCESS} />
        <StatCard label="On Leave"     value={String(STAFF_FULL.filter(s=>s.status==="On Leave").length)}          sub="Approved leave"      icon={CalendarCheck} accent={WARNING} />
        <StatCard label="Departments"  value={String(new Set(STAFF_FULL.map(s=>s.dept)).size)}                     sub="Active departments"  icon={Building2}     accent={TEAL}    />
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, role, or ID…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
        <div className="flex gap-1.5 flex-wrap">
          {depts.map(d=><button key={d} onClick={()=>setDept(d)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold" style={{ borderColor:dept===d?PRIMARY:BORDER, backgroundColor:dept===d?PRIMARY:"white", color:dept===d?"white":MUTED }}>{d}</button>)}
        </div>
        <div className="flex gap-1 ml-auto">
          {["All","Active","On Leave","Inactive"].map(s=><button key={s} onClick={()=>setStatusF(s)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor:statusF===s?TEAL:"white", color:statusF===s?"white":MUTED, borderColor:statusF===s?TEAL:BORDER }}>{s}</button>)}
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: BORDER }}>
          <button onClick={()=>setView("card")} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor:view==="card"?PRIMARY:"transparent", color:view==="card"?"white":MUTED }}>Cards</button>
          <button onClick={()=>setView("table")} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor:view==="table"?PRIMARY:"transparent", color:view==="table"?"white":MUTED }}>Table</button>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon={Users} message="No staff match your filters." /> : view==="card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s,i) => {
            const dc = deptColors[s.dept] ?? PRIMARY;
            return (
              <div key={s.id} onClick={() => nav && nav("staff-profile", s.name)} className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all" style={{ borderColor: BORDER, opacity: s.status==="Inactive"?0.65:1 }}>
                <div className="h-14 relative flex-shrink-0" style={{ backgroundColor: dc+"14", borderBottom:`2px solid ${dc}` }}>
                  <div className="absolute top-2 right-2"><Badge label={s.status} colors={stColors[s.status]} /></div>
                </div>
                <div className="px-4 pt-0 pb-4">
                  <div className="-mt-5 mb-3"><Av gender={s.gender} size={44} /></div>
                  <div className="font-semibold text-sm leading-tight mb-0.5" style={{ color: TEXT }}>{s.name}</div>
                  <div className="text-xs mb-1" style={{ color: MUTED }}>{s.role}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: dc+"18", color: dc }}>{s.dept}</span>
                  <div className="mt-3 space-y-1 text-xs" style={{ color: MUTED }}>
                    <div style={{ fontFamily: mono }}>{s.id} · {s.empType}</div>
                    <div>{s.shift}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={e=>{ e.stopPropagation(); nav&&nav("staff-profile",s.name); }} className="flex-1 text-xs py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: BORDER }}>Profile</button>
                    <button onClick={e=>{ e.stopPropagation(); add({ type:"info", title:`Invite sent — ${s.email}` }); }} className="flex-1 text-xs py-1.5 rounded-lg text-white font-semibold" style={{ backgroundColor: PRIMARY }}>Invite</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["ID","Name","Role","Dept","Type","Hire Date","Shift","Status",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((s,i) => {
                const dc = deptColors[s.dept]??PRIMARY;
                return (
                  <tr key={s.id} onClick={()=>nav&&nav("staff-profile",s.name)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, opacity:s.status==="Inactive"?0.65:1 }}>
                    <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{s.id}</td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><Av gender={s.gender} size={28} /><span className="text-sm font-medium" style={{ color: TEXT }}>{s.name}</span></div></td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.role}</td>
                    <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor:dc+"18",color:dc }}>{s.dept}</span></td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.empType}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.hireDate}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.shift}</td>
                    <td className="px-3 py-3"><Badge label={s.status} colors={stColors[s.status]} /></td>
                    <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={()=>add({type:"info",title:`Invite sent — ${s.name}`})} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Invite</button>
                        {s.status==="Active"&&<button onClick={()=>add({type:"warning",title:`${s.name} deactivated`})} className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor:`${ERROR}30` }}>Deactivate</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function DailySummary({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type DayStatus = "Open" | "Closed" | "Reopened";
  const [dayStatus, setDayStatus] = useState<DayStatus>("Open");
  const [showClose, setShowClose] = useState(false);
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopenPin, setReopenPin] = useState("");
  const [closedBy, setClosedBy] = useState("");
  const [closedAt, setClosedAt] = useState("");

  const BDATE = "14 Oct 2025";
  const cats = [
    { cat: "Room Revenue",    amount: 825000,  tax: 61875,  txn: 15, prev: 714000 },
    { cat: "Restaurant & Bar",amount: 225000,  tax: 42188,  txn: 42, prev: 198000 },
    { cat: "Laundry",         amount: 18000,   tax: 1350,   txn: 6,  prev: 21000  },
    { cat: "Minibar",         amount: 24000,   tax: 1800,   txn: 18, prev: 19500  },
    { cat: "Events",          amount: 155800,  tax: 11685,  txn: 2,  prev: 0      },
  ];
  const payments = [
    { method: "Cash",           amount: 580000, icon: DollarSign },
    { method: "POS / Card",     amount: 420000, icon: CreditCard },
    { method: "Bank Transfer",  amount: 247800, icon: ArrowUpFromLine },
  ];
  const total    = cats.reduce((s,c)=>s+c.amount,0);
  const totalTax = cats.reduce((s,c)=>s+c.tax,0);
  const prevTotal= cats.reduce((s,c)=>s+c.prev,0);
  const variance = total - prevTotal;
  const lastWk   = 1043200;

  const occupancyStats = { occupied: 15, available: 20, occ: 75, adr: 55000, revpar: 41250, arrivals: 8, departures: 5, noShows: 1 };

  const statusColors: Record<DayStatus,{bg:string;border:string;text:string}> = {
    Open:     { bg: "#DBEAFE", border: "#BFDBFE", text: "#1E40AF" },
    Closed:   { bg: "#DCFCE7", border: "#BBF7D0", text: "#166534" },
    Reopened: { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
  };

  const sc = statusColors[dayStatus];

  return (
    <div>
      <PageHeader title="Daily Summary" sub={`${BDATE} · Grand Palms Hotel, Abuja`} actions={
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {dayStatus === "Closed" && <Lock size={12} />}{dayStatus}
            {closedBy && <span className="opacity-70"> · {closedBy}</span>}
          </div>
          {dayStatus === "Open" && <BtnP label="Close Day" icon={Lock} onClick={() => setShowClose(true)} />}
          {dayStatus === "Closed" && <button onClick={() => setShowReopen(true)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ color: MUTED, borderColor: BORDER }}>Reopen (Auth)</button>}
          {dayStatus === "Reopened" && <BtnP label="Re-close Day" icon={Lock} onClick={() => setShowClose(true)} />}
          <BtnO label="Export" icon={Download} onClick={() => add({ type: "info", title: "Exporting daily summary PDF" })} />
        </div>
      } />

      {dayStatus !== "Open" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-medium" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
          <Lock size={14} />{dayStatus === "Closed" ? `Day closed at ${closedAt} by ${closedBy}` : `Day reopened — ${reopenReason}`}
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Revenue" value={fmtN(total)} sub={`Tax excl. · ${cats.reduce((s,c)=>s+c.txn,0)} txns`} icon={TrendingUp} accent={SUCCESS} delta={`${variance>=0?"+":""}${fmtN(variance)} vs yesterday`} deltaPositive={variance>=0} />
        <StatCard label="Tax Collected" value={fmtN(totalTax)} sub="VAT + service charge" icon={DollarSign} accent={TEAL} />
        <StatCard label="Discounts / Comp" value="₦45,000" sub="6 manager approvals" icon={TrendingDown} accent={WARNING} />
        <StatCard label="Outstanding" value="₦284,500" sub="3 open folios" icon={AlertTriangle} accent={ERROR} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Revenue by category */}
        <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Revenue by Category — Tax Breakdown</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: SUBTLE }}>
              <span>vs Yesterday: <span className="font-semibold" style={{ color: variance>=0?SUCCESS:ERROR }}>{variance>=0?"+":""}{fmtN(variance)}</span></span>
              <span>vs Same Day Last Wk: <span className="font-semibold" style={{ color: total>=lastWk?SUCCESS:ERROR }}>{fmtN(total-lastWk)}</span></span>
            </div>
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Category","Revenue","Tax","# Txns","vs Yesterday",""].map((h,i)=><th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {cats.map(c => {
                const diff = c.amount - c.prev;
                const pct = c.prev > 0 ? Math.round((diff/c.prev)*100) : null;
                return (
                  <tr key={c.cat} className="border-t" style={{ borderColor: BORDER }}>
                    <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{c.cat}</td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(c.amount)}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{c.tax.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm" style={{ color: MUTED }}>{c.txn}</td>
                    <td className="px-3 py-3">
                      {pct !== null && <span className="text-xs font-semibold" style={{ color: diff>=0?SUCCESS:ERROR }}>{diff>=0?"+":""}{pct}%</span>}
                      {pct === null && <span className="text-xs" style={{ color: SUBTLE }}>—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                        <div className="h-full rounded-full" style={{ width: `${(c.amount/total)*100}%`, backgroundColor: PRIMARY }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT }}>Total</td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(total)}</td>
                <td className="px-3 py-3 text-xs font-bold" style={{ color: MUTED, fontFamily: mono }}>₦{totalTax.toLocaleString()}</td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: MUTED }}>{cats.reduce((s,c)=>s+c.txn,0)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Occupancy */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Occupancy</h3>
            <div className="grid grid-cols-2 gap-2">
              {[["Occupied", occupancyStats.occupied], ["Available", occupancyStats.available], ["ADR", `₦${occupancyStats.adr.toLocaleString()}`], ["RevPAR", `₦${occupancyStats.revpar.toLocaleString()}`]].map(([k,v])=>(
                <div key={String(k)} className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                  <div className="text-xs" style={{ color: MUTED }}>{k}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: TEXT }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs flex gap-4" style={{ color: MUTED }}>
              <span>Arrivals <span className="font-semibold" style={{ color: TEXT }}>{occupancyStats.arrivals}</span></span>
              <span>Departures <span className="font-semibold" style={{ color: TEXT }}>{occupancyStats.departures}</span></span>
              <span>No-shows <span className="font-semibold" style={{ color: ERROR }}>{occupancyStats.noShows}</span></span>
            </div>
          </div>
          {/* Payments by method */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Payments by Method</h3>
            {payments.map(p => (
              <div key={p.method} className="flex items-center gap-2.5 mb-2.5">
                <p.icon size={14} style={{ color: MUTED }} />
                <span className="text-sm flex-1" style={{ color: MUTED }}>{p.method}</span>
                <span className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{fmtN(p.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-2.5 mt-1.5 flex justify-between text-sm font-bold" style={{ borderColor: BORDER }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(payments.reduce((s,p)=>s+p.amount,0))}</span>
            </div>
          </div>
          {/* Complimentary/Discounts */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Comp &amp; Discounts</h3>
            {[{ desc: "VIP comp — Suite 501", amt: 25000, by: "Tunde A." },{ desc: "Loyalty discount — Room 202", amt: 12000, by: "Grace M." },{ desc: "Rate adjustment — Room 311", amt: 8000, by: "Nkechi O." }].map((d,i)=>(
              <div key={i} className="flex items-start justify-between gap-2 mb-2">
                <div><div className="text-xs font-medium" style={{ color: TEXT }}>{d.desc}</div><div className="text-xs" style={{ color: SUBTLE }}>{d.by}</div></div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: ORANGE, fontFamily: mono }}>₦{d.amt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Close day modal */}
      {showClose && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowClose(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-2" style={{ color: TEXT }}>Close Business Day</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Closing <strong>{BDATE}</strong>. This will freeze revenue figures. Run Night Audit first to ensure all charges are posted.</p>
            <div className="px-3 py-2.5 rounded-xl text-xs mb-4" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>Ensure Night Audit has run successfully before closing the day.</div>
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowClose(false)} /><button onClick={() => { const now = new Date(); setClosedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`); setClosedBy("Grace Mensah"); setDayStatus("Closed"); setShowClose(false); add({ type: "success", title: `Day closed — ${BDATE}`, body: "Revenue frozen. Night audit reference created." }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Close Day</button></div>
          </div>
        </>
      )}

      {/* Reopen modal */}
      {showReopen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowReopen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Reopen Business Day</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>This action is audited and requires manager authorisation.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason for Reopening</label><textarea value={reopenReason} onChange={e=>setReopenReason(e.target.value)} rows={2} placeholder="State the reason…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" maxLength={4} value={reopenPin} onChange={e=>setReopenPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowReopen(false)} /><button onClick={() => { if (reopenPin !== "1234" || !reopenReason.trim()) { add({ type: "error", title: "Invalid PIN or missing reason" }); return; } setDayStatus("Reopened"); setShowReopen(false); add({ type: "warning", title: `Day reopened — ${BDATE}`, body: reopenReason }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ORANGE }}>Reopen Day</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// OccupancyReports → ReportsScreens.tsx
export { OccupancyReports } from "./ReportsScreens";

export function StockDashboard({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const PRODUCTS_SD = [
    { sku:"LIN-001", name:"Bath Towels",         cat:"Linen",      par:200, current:148, reorder:80,  reorderQty:100, cost:2800, perishable:false, expiry:"",         unit:"pcs",  fast:true  },
    { sku:"TOI-001", name:"Shower Gel 300ml",    cat:"Toiletries", par:500, current:62,  reorder:100, reorderQty:200, cost:450,  perishable:true,  expiry:"18 Oct",   unit:"btl",  fast:true  },
    { sku:"TOI-002", name:"Shampoo 250ml",       cat:"Toiletries", par:500, current:78,  reorder:100, reorderQty:200, cost:380,  perishable:true,  expiry:"02 Nov",   unit:"btl",  fast:true  },
    { sku:"FB-001",  name:"Mineral Water 50cl",  cat:"F&B",        par:1000,current:240, reorder:300, reorderQty:500, cost:120,  perishable:true,  expiry:"Dec 2025", unit:"btl",  fast:true  },
    { sku:"FB-002",  name:"Eggs (Crate)",        cat:"F&B",        par:80,  current:22,  reorder:25,  reorderQty:40,  cost:3800, perishable:true,  expiry:"18 Oct",   unit:"crate",fast:true  },
    { sku:"CLN-001", name:"Floor Cleaner 5L",    cat:"Cleaning",   par:60,  current:18,  reorder:20,  reorderQty:30,  cost:2200, perishable:false, expiry:"",         unit:"jrn",  fast:false },
    { sku:"CLN-002", name:"Disinfectant Spray",  cat:"Cleaning",   par:100, current:45,  reorder:30,  reorderQty:50,  cost:1800, perishable:false, expiry:"",         unit:"btl",  fast:false },
    { sku:"KIT-001", name:"Cooking Gas (12.5kg)",cat:"Kitchen",    par:12,  current:3,   reorder:4,   reorderQty:6,   cost:12500,perishable:false, expiry:"",         unit:"cyl",  fast:true  },
    { sku:"LIN-002", name:"Bed Sheets (King)",   cat:"Linen",      par:120, current:88,  reorder:50,  reorderQty:60,  cost:4500, perishable:false, expiry:"",         unit:"sets", fast:false },
    { sku:"KIT-002", name:"Palm Oil (25L)",      cat:"Kitchen",    par:20,  current:14,  reorder:6,   reorderQty:10,  cost:42000,perishable:true,  expiry:"Mar 2026", unit:"drum", fast:true  },
  ];
  const SD_MOVEMENTS = [
    { date:"14 Oct 14:22", item:"Bath Towels",         type:"Issue",      qty:-12, ref:"HK-TASK-0441", by:"Ada Okonkwo"  },
    { date:"14 Oct 13:05", item:"Mineral Water 50cl",  type:"Receipt",    qty:500, ref:"PO-0451",      by:"Store Mgr"    },
    { date:"14 Oct 11:30", item:"Eggs (Crate)",        type:"Issue",      qty:-5,  ref:"KITCHEN-DAILY", by:"Chef Emeka"  },
    { date:"14 Oct 09:15", item:"Floor Cleaner 5L",    type:"Adjustment", qty:-2,  ref:"BREAKAGE-ADJ", by:"Mgr. Bello"  },
    { date:"13 Oct 22:00", item:"Shower Gel 300ml",    type:"Issue",      qty:-24, ref:"HK-SHIFT-PM",  by:"HK Supervisor"},
    { date:"13 Oct 16:40", item:"Cooking Gas (12.5kg)",type:"Receipt",    qty:6,   ref:"PO-0448",      by:"Store Mgr"    },
  ];
  const CAT_COLORS = [PRIMARY, TEAL, ORANGE, SUCCESS, "#6366F1"];
  const cats = ["Linen","Toiletries","F&B","Cleaning","Kitchen"];
  const CAT_VALS = cats.map(cat=>({ name:cat, value:PRODUCTS_SD.filter(p=>p.cat===cat).reduce((s,p)=>s+p.current*p.cost,0) }));
  const pending  = PRODUCTS_SD.filter(p=>p.current<=p.reorder);
  const expiring = PRODUCTS_SD.filter(p=>p.perishable&&p.expiry&&!p.expiry.includes("2026")&&!p.expiry.includes("Nov")&&!p.expiry.includes("Dec"));
  const totalVal = PRODUCTS_SD.reduce((s,p)=>s+p.current*p.cost,0);
  const typeColor: Record<string,{bg:string;text:string}> = { Receipt:{bg:"#DCFCE7",text:"#166534"}, Issue:{bg:"#FEF3C7",text:"#92400E"}, Adjustment:{bg:"#EDE9FE",text:"#5B21B6"} };
  const critical = PRODUCTS_SD.filter(i => i.current === 0);
  return (
    <div>
      <PageHeader title="Stock Dashboard" sub="Live inventory overview · Grand Palms Hotel, Abuja" actions={
        <div className="flex gap-2">
          <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting inventory report" })} />
          <BtnP label="Log Transaction" icon={Plus} onClick={() => add({ type:"info", title:"New stock transaction" })} />
        </div>
      } />
      {pending.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA" }}>
          <AlertTriangle size={15} style={{ color: ERROR, flexShrink:0 }} />
          <div className="flex-1 text-sm" style={{ color: ERROR }}><span className="font-semibold">{pending.length} items at or below reorder point</span><span className="ml-2 font-normal text-xs" style={{ color:"#991B1B" }}>{pending.map(p=>p.name).join(" · ")}</span></div>
          <button onClick={() => add({ type:"info", title:"Creating reorder POs" })} className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white flex-shrink-0" style={{ backgroundColor: ERROR }}>Create Reorder POs</button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard label="Total Stock Value"   value={`₦${(totalVal/1000).toFixed(0)}K`}  sub="Current on-hand value"        icon={DollarSign}    accent={SUCCESS}  />
        <StatCard label="Below Reorder"       value={String(pending.length)}               sub="Need replenishment now"       icon={AlertTriangle} accent={ERROR}    />
        <StatCard label="Out of Stock"        value={String(critical.length)}              sub="Zero on-hand"                 icon={XCircle}       accent={ERROR}    />
        <StatCard label="Expiring Soon"       value={String(expiring.length)}              sub="Within 7 days"                icon={Clock}         accent={WARNING}  />
        <StatCard label="Pending POs"         value="3"                                    sub="Awaiting delivery"            icon={Truck}         accent={TEAL}     />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Reorder Suggestions</h3>
            <span className="text-xs" style={{ color: MUTED }}>{pending.length} items</span>
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Item","Cat","On Hand","Reorder Pt","Suggest Qty","Est. Cost",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {pending.map(p => {
                const pct   = Math.round((p.current/p.par)*100);
                const col   = p.current===0?ERROR:p.current<=p.reorder?WARNING:SUCCESS;
                return (
                  <tr key={p.sku} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{p.name}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{p.sku}</div></td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{p.cat}</td>
                    <td className="px-4 py-3"><div className="text-sm font-bold" style={{ color: col }}>{p.current} <span className="text-xs font-normal" style={{ color: SUBTLE }}>{p.unit}</span></div><div className="mt-1 h-1.5 w-20 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(pct,100)}%`, backgroundColor: col }} /></div></td>
                    <td className="px-4 py-3 text-sm" style={{ color: MUTED, fontFamily: mono }}>{p.reorder}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>{p.reorderQty} {p.unit}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{(p.reorderQty*p.cost).toLocaleString()}</td>
                    <td className="px-4 py-3"><button onClick={() => add({ type:"info", title:`PO draft — ${p.name}` })} className="text-xs px-2.5 py-1.5 rounded border font-semibold whitespace-nowrap" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Draft PO</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Value by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CAT_VALS} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={40}>
                {CAT_VALS.map((_,i) => <Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v:any) => [`₦${Number(v).toLocaleString()}`]} contentStyle={{ border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CAT_VALS.map((c,i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_COLORS[i%CAT_COLORS.length] }} />
                <span className="flex-1" style={{ color: MUTED }}>{c.name}</span>
                <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Recent Movements</h3>
            <span className="text-xs" style={{ color: MUTED }}>Last 24h</span>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {SD_MOVEMENTS.map((m,i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F8FAFC]">
                <span className="text-xs px-2 py-0.5 rounded font-semibold mt-0.5 whitespace-nowrap" style={{ backgroundColor: typeColor[m.type]?.bg||"#F4F4F5", color: typeColor[m.type]?.text||TEXT }}>{m.type}</span>
                <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate" style={{ color: TEXT }}>{m.item}</div><div className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{m.ref} · {m.by}</div></div>
                <div className="text-right flex-shrink-0"><div className="text-sm font-bold" style={{ color: m.qty<0?ERROR:SUCCESS, fontFamily: mono }}>{m.qty>0?"+":""}{m.qty}</div><div className="text-xs" style={{ color: SUBTLE }}>{m.date.split(" ")[1]}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Fast / Slow Movers</h3>
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SUCCESS }}>Fast Movers</div>
            {PRODUCTS_SD.filter(p=>p.fast).slice(0,4).map(p => (
              <div key={p.sku} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 text-xs" style={{ color: TEXT }}>{p.name}</div>
                <div className="h-2 w-24 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(Math.round((p.current/p.par)*100),100)}%`, backgroundColor: SUCCESS }} /></div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: MUTED, fontFamily: mono }}>{Math.round((p.current/p.par)*100)}%</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SUBTLE }}>Slow Movers</div>
            {PRODUCTS_SD.filter(p=>!p.fast).slice(0,3).map(p => (
              <div key={p.sku} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 text-xs" style={{ color: TEXT }}>{p.name}</div>
                <div className="h-2 w-24 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(Math.round((p.current/p.par)*100),100)}%`, backgroundColor: SUBTLE }} /></div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: MUTED, fontFamily: mono }}>{Math.round((p.current/p.par)*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SystemHealth → ITAdminScreens.tsx
export { SystemHealth } from "./ITAdminScreens";

export function RoomTypeManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ROOM_TYPES = [
    { code:"STD", name:"Standard Room", count:10, available:6, maxOcc:2, beds:"1 King or 2 Twin", size:"28 m²",
      amenities:["Air Conditioning","Free Wi-Fi","Flat-screen TV","Mini Fridge","Safe","Kettle","En-suite Shower"],
      base:35000, description:"Comfortable standard rooms ideal for business and leisure travellers.", order:1 },
    { code:"DLX", name:"Deluxe Room", count:8, available:4, maxOcc:3, beds:"1 King + Sofa Bed", size:"38 m²",
      amenities:["Air Conditioning","Free Wi-Fi","Smart TV","Minibar","In-room Safe","Work Desk","Bathtub + Shower","Premium Toiletries","Balcony"],
      base:55000, description:"Spacious deluxe rooms with balcony views and premium furnishings.", order:2 },
    { code:"STE", name:"Suite", count:4, available:2, maxOcc:4, beds:"1 King + Separate Lounge", size:"65 m²",
      amenities:["Air Conditioning","Free Wi-Fi","65\" Smart TV","Full Minibar","Butler Service","Kitchenette","Jacuzzi","Panoramic Balcony","Dining Area","VIP Amenity Kit"],
      base:95000, description:"Flagship suites with panoramic views, butler service, and luxury amenities.", order:3 },
  ];
  const [selected, setSelected] = useState<typeof ROOM_TYPES[0] | null>(ROOM_TYPES[0]);
  const [showEdit, setShowEdit] = useState(false);
  const [editVals, setEditVals] = useState({ name:"", base:"", description:"" });
  const openEdit = () => {
    if (!selected) return;
    setEditVals({ name:selected.name, base:selected.base.toString(), description:selected.description });
    setShowEdit(true);
  };
  const typeColor = (code: string) => code==="STE" ? ORANGE : code==="DLX" ? TEAL : PRIMARY;
  return (
    <div>
      <PageHeader title="Room Types" sub="Room type configuration, inventory, amenities, and room assignment"
        actions={<BtnP label="Add Room Type" icon={Plus} onClick={()=>add({type:"info",title:"Add room type form"})} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Room Types" value="3" sub="Configured categories" icon={BedDouble} accent={PRIMARY} />
        <StatCard label="Total Rooms" value={String(ROOM_TYPES.reduce((s,t)=>s+t.count,0))} sub="All inventory" icon={BedDouble} accent={TEAL} />
        <StatCard label="Available Now" value={String(ROOM_TYPES.reduce((s,t)=>s+t.available,0))} sub="Ready to sell" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Avg Base Rate" value={`₦${Math.round(ROOM_TYPES.reduce((s,t)=>s+t.base,0)/ROOM_TYPES.length).toLocaleString()}`} sub="Across all types" icon={DollarSign} accent={ORANGE} />
      </div>
      <div className="flex gap-5">
        {/* Type cards */}
        <div className="flex-1 space-y-3">
          {ROOM_TYPES.map(rt=>(
            <div key={rt.code} onClick={()=>setSelected(rt)} className="bg-white rounded-xl border cursor-pointer transition-all overflow-hidden"
              style={{ borderColor: selected?.code===rt.code ? PRIMARY : BORDER, borderWidth: selected?.code===rt.code ? 2 : 1 }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ backgroundColor:"#F0F4F8", borderColor: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ backgroundColor: typeColor(rt.code) }}>{rt.code}</div>
                  <div><div className="text-base font-bold" style={{ color: TEXT }}>{rt.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>{rt.beds} · {rt.size} · Max {rt.maxOcc} guests</div></div>
                </div>
                <Badge label={`${rt.available}/${rt.count} available`} colors={rt.available>2 ? {bg:"#DCFCE7",text:"#166534"} : {bg:"#FEF3C7",text:"#92400E"}} />
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {rt.amenities.slice(0,6).map(a=><span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#EFF6FF",color:PRIMARY }}>{a}</span>)}
                  {rt.amenities.length>6 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#F0F4F8",color:MUTED }}>+{rt.amenities.length-6} more</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{rt.base.toLocaleString()}<span className="font-normal text-xs" style={{ color: MUTED }}> / night</span></span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor:"#E2E8F0" }}>
                      <div className="h-1.5 rounded-full" style={{ width:`${(rt.available/rt.count)*100}%`, backgroundColor: SUCCESS }} />
                    </div>
                    <span className="text-xs" style={{ color: MUTED }}>{Math.round((rt.available/rt.count)*100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: TEXT }}>Type Details</h3>
                <button onClick={openEdit} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}><Edit3 size={12}/>Edit</button>
              </div>
              <div className="space-y-2">
                {[["Code",selected.code],["Name",selected.name],["Max Occupancy",`${selected.maxOcc} guests`],["Bed Configuration",selected.beds],["Room Size",selected.size],["Base Rate",`₦${selected.base.toLocaleString()}/night`],["Total Rooms",String(selected.count)],["Available Now",String(selected.available)],["Display Order",String(selected.order)]].map(([k,v])=>(
                  <div key={k} className="flex justify-between text-sm">
                    <span style={{ color: MUTED }}>{k}</span>
                    <span className="font-medium" style={{ color: TEXT, fontFamily: k==="Code"||k==="Base Rate" ? mono : "inherit" }}>{v as string}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3 pt-3 border-t" style={{ color: MUTED, borderColor: BORDER }}>{selected.description}</p>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: TEXT }}>All Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {selected.amenities.map(a=>(
                  <span key={a} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor:"#F0FDF4",color:SUCCESS }}>
                    <CheckCircle2 size={10}/>{a}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: TEXT }}>Assigned Rooms</h3>
                <button onClick={()=>add({type:"info",title:"Manage room assignments"})} className="text-xs font-medium" style={{ color: TEAL }}>Manage</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROOMS.filter(r=>(selected.code==="STE"&&r.type==="Suite")||(selected.code==="DLX"&&r.type==="Deluxe")||(selected.code==="STD"&&r.type==="Standard")).map(r=>(
                  <div key={r.id} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: r.status==="Available" ? SUCCESS : r.status==="Occupied" ? ORANGE : MUTED }}>
                    {r.id}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-3 text-xs" style={{ color: MUTED }}>
                {[{c:SUCCESS,l:"Available"},{c:ORANGE,l:"Occupied"},{c:MUTED,l:"Other"}].map(b=>(
                  <span key={b.l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor:b.c }}/>{b.l}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showEdit && selected && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowEdit(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-5" style={{ color: TEXT }}>Edit — {selected.name}</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Display Name</label>
                <input value={editVals.name} onChange={e=>setEditVals(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Base Rate (₦ / night)</label>
                <input type="number" value={editVals.base} onChange={e=>setEditVals(p=>({...p,base:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label>
                <textarea value={editVals.description} onChange={e=>setEditVals(p=>({...p,description:e.target.value}))} rows={3} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowEdit(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button>
              <button onClick={()=>{ setShowEdit(false); add({type:"success",title:"Room type updated",body:editVals.name}); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// B4-2 Rate Calendar
export function RateCalendar({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset, setOffset] = useState(0);
  const [planName, setPlanName] = useState("Standard Rate");
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [bulkRate, setBulkRate] = useState("");
  const [stopSell, setStopSell] = useState<string[]>([]);
  const DAYS = 30;
  const days = Array.from({ length: DAYS }, (_, i) => { const d = new Date(TODAY); d.setDate(TODAY.getDate()+offset+i); return d; });
  const TYPES = [
    { code:"STD", name:"Standard", total:10, mult:1 },
    { code:"DLX", name:"Deluxe", total:8, mult:1.57 },
    { code:"STE", name:"Suite", total:4, mult:2.71 },
  ];
  const TYPE_COLOR: Record<string,string> = { STD: PRIMARY, DLX: TEAL, STE: ORANGE };
  const getAvail = (code: string, di: number) => {
    const total = TYPES.find(t=>t.code===code)!.total;
    const dow = days[di].getDay();
    const isWk = dow===5||dow===6;
    const seed = (di*7+code.charCodeAt(0))%11;
    return Math.max(0, total - Math.min(total, Math.round((isWk?0.85:0.55)*total+(seed-5)*0.3)));
  };
  const getBase = () => RATE_PLANS.find(p=>p.name===planName)?.base ?? 35000;
  const getRate = (mult: number) => Math.round(getBase() * mult);
  const cKey = (code: string, di: number) => `${code}-${di}`;
  const toggleCell = (code: string, di: number) => {
    const k = cKey(code, di);
    setSelectedCells(prev => prev.includes(k) ? prev.filter(x=>x!==k) : [...prev, k]);
  };
  const applyBulk = () => {
    if (!bulkRate) { add({type:"warning",title:"Enter a rate first"}); return; }
    add({type:"success",title:`Rate applied to ${selectedCells.length} cell${selectedCells.length!==1?"s":""}`,body:`₦${Number(bulkRate).toLocaleString()}/night`});
    setSelectedCells([]); setBulkRate("");
  };
  const todayIdx = days.findIndex(d=>d.toDateString()===TODAY.toDateString());
  const DW = 50;
  return (
    <div>
      <PageHeader title="Rate Calendar" sub="30-day rate grid · Click cells to select · Bulk edit on the right"
        actions={<><BtnO label="Copy Forward" icon={CalendarDays} onClick={()=>add({type:"info",title:"Rates copied 30 days forward"})} /><BtnP label="Publish Rates" icon={CheckCircle2} onClick={()=>add({type:"success",title:"Rates published to all channels"})} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Plans" value={String(RATE_PLANS.filter(r=>r.active).length)} sub="Available to assign" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Stop-Sell Dates" value={String(stopSell.length)} sub="Closed cells" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Selected Cells" value={String(selectedCells.length)} sub="Ready for bulk edit" icon={CalendarDays} accent={TEAL} />
        <StatCard label="Avg Occupancy" value="73%" sub="Next 30 days" icon={TrendingUp} accent={SUCCESS} />
      </div>
      {/* Rate plan selector + nav */}
      <div className="flex items-center gap-3 bg-white rounded-xl border p-3 mb-4 flex-wrap" style={{ borderColor: BORDER }}>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Rate Plan:</span>
        <div className="flex gap-1 flex-wrap">
          {RATE_PLANS.filter(r=>r.active).map(p=>(
            <button key={p.id} onClick={()=>setPlanName(p.name)} className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: planName===p.name ? PRIMARY : BORDER, backgroundColor: planName===p.name ? PRIMARY : "white", color: planName===p.name ? "white" : MUTED }}>{p.name}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>setOffset(o=>o-7)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}><ChevronLeft size={12}/></button>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: TEXT }}>{days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[DAYS-1].toLocaleDateString("en-NG",{day:"numeric",month:"short"})}</span>
          <button onClick={()=>setOffset(o=>o+7)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}><ChevronRight size={12}/></button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div style={{ overflowX:"auto" }}>
            <div style={{ minWidth: 130 + DW*DAYS }}>
              {/* Date header */}
              <div className="flex sticky top-0 z-10" style={{ backgroundColor:"#F9FAFB", borderBottom:`1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-3 py-2 flex items-center" style={{ width:130, borderRight:`1px solid ${BORDER}` }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Type / Date</span>
                </div>
                {days.map((d,i)=>(
                  <div key={i} className="flex-shrink-0 flex flex-col items-center py-1.5" style={{ width:DW, borderRight:`1px solid ${BORDER}`, backgroundColor: i===todayIdx ? "#EFF6FF" : d.getDay()===0||d.getDay()===6 ? "#FAFBFD" : "transparent" }}>
                    <span className="text-xs font-semibold" style={{ color: i===todayIdx ? PRIMARY : TEXT, fontSize:10 }}>{d.toLocaleDateString("en-NG",{weekday:"short"}).slice(0,2)}</span>
                    <span style={{ fontSize:10, color: i===todayIdx ? PRIMARY : SUBTLE }}>{d.getDate()}</span>
                  </div>
                ))}
              </div>
              {/* Type rows */}
              {TYPES.map(rt=>(
                <div key={rt.code} className="flex" style={{ borderBottom:`1px solid ${BORDER}` }}>
                  <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 sticky left-0 z-10" style={{ width:130, borderRight:`1px solid ${BORDER}`, backgroundColor:"white" }}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-white" style={{ backgroundColor:TYPE_COLOR[rt.code], fontSize:9 }}>{rt.code}</div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: TEXT }}>{rt.name}</div>
                      <div className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{getRate(rt.mult).toLocaleString()}</div>
                    </div>
                  </div>
                  {days.map((_,i)=>{
                    const avail = getAvail(rt.code, i);
                    const key = cKey(rt.code, i);
                    const isSel = selectedCells.includes(key);
                    const isStop = stopSell.includes(key);
                    const bg = isStop ? "#FEE2E2" : isSel ? "#EFF6FF" : avail===0 ? "#FEE2E2" : avail<=2 ? "#FEF9C3" : avail<=5 ? "#FEF3C7" : "#F0FDF4";
                    const tc = isStop ? ERROR : avail===0 ? ERROR : avail<=2 ? "#92400E" : SUCCESS;
                    return (
                      <div key={i} onClick={()=>!isStop&&toggleCell(rt.code,i)}
                        className="flex-shrink-0 flex flex-col items-center justify-center border-r relative"
                        style={{ width:DW, minHeight:50, borderColor:"#F1F5F9", backgroundColor: bg, cursor: isStop ? "not-allowed" : "pointer" }}>
                        {isStop ? <span style={{ fontSize:9,color:ERROR,fontWeight:700 }}>STOP</span> : (
                          <>
                            <span className="font-bold" style={{ color: isSel ? PRIMARY : tc, fontFamily:mono, fontSize:11 }}>{Math.round(getRate(rt.mult)/1000)}k</span>
                            <span style={{ fontSize:10, color: MUTED }}>{avail}rm</span>
                          </>
                        )}
                        {isSel && <div className="absolute inset-0 border-2 pointer-events-none" style={{ borderColor:PRIMARY }} />}
                      </div>
                    );
                  })}
                </div>
              ))}
              {/* Legend footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t text-xs flex-wrap" style={{ borderColor: BORDER, color: MUTED }}>
                <span className="font-bold">Legend:</span>
                {[{bg:"#F0FDF4",l:"High avail"},{bg:"#FEF3C7",l:"Medium"},{bg:"#FEE2E2",l:"Low/Sold"},{bg:"#EFF6FF",l:"Selected"}].map(l=>(
                  <span key={l.l} className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm border" style={{ backgroundColor:l.bg,borderColor:BORDER }}/>{l.l}</span>
                ))}
                <span>· Rate in ₦k · rm = available rooms</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bulk edit panel */}
        {selectedCells.length > 0 && (
          <div className="w-60 flex-shrink-0 bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{selectedCells.length} cell{selectedCells.length!==1?"s":""} selected</h3>
              <button onClick={()=>setSelectedCells([])} className="p-1 rounded" style={{ color: MUTED }}><X size={14}/></button>
            </div>
            <div className="space-y-3 mb-4">
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Set Rate (₦/night)</label>
                <input type="number" value={bulkRate} onChange={e=>setBulkRate(e.target.value)} placeholder="e.g. 42000" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Apply % Adjustment</label>
                <div className="grid grid-cols-4 gap-1">
                  {["-10%","-5%","+5%","+10%"].map(p=>(
                    <button key={p} className="py-1.5 rounded-lg border text-xs font-bold" style={{ borderColor:BORDER, color:p.startsWith("+") ? SUCCESS : ERROR }}>{p}</button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Min Stay</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                  {["No restriction","1","2","3","5","7"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <button onClick={()=>{ setStopSell(p=>[...new Set([...p,...selectedCells])]); setSelectedCells([]); add({type:"warning",title:`Stop-sell: ${selectedCells.length} date(s) closed`}); }}
              className="w-full py-2 rounded-xl text-xs font-bold border mb-2" style={{ color: ERROR, borderColor:`${ERROR}30` }}>
              Apply Stop-Sell
            </button>
            <button onClick={applyBulk} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Apply Rate</button>
          </div>
        )}
      </div>
    </div>
  );
}

// B4-3 Availability Board
export function AvailabilityBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset, setOffset] = useState(0);
  const [drillCell, setDrillCell] = useState<{ type:string; date:string; sold:number; avail:number; total:number } | null>(null);
  const DAYS = 14;
  const days = Array.from({ length: DAYS }, (_, i) => { const d = new Date(TODAY); d.setDate(TODAY.getDate()+offset+i); return d; });
  const TYPES = [
    { code:"STD", name:"Standard", total:10, color:PRIMARY },
    { code:"DLX", name:"Deluxe", total:8, color:TEAL },
    { code:"STE", name:"Suite", total:4, color:ORANGE },
  ];
  const GROUP_BLOCKS = [
    { type:"STD", start:3, end:5, rooms:5, name:"Dangote Group" },
    { type:"DLX", start:3, end:5, rooms:4, name:"Dangote Group" },
    { type:"STD", start:9, end:11, rooms:3, name:"Adeyemi Wedding" },
  ];
  const getSold = (code: string, di: number) => {
    const total = TYPES.find(t=>t.code===code)!.total;
    const dow = days[di].getDay();
    const isWk = dow===5||dow===6;
    const seed = (di*5+code.charCodeAt(0))%7;
    const grp = GROUP_BLOCKS.filter(g=>g.type===code&&di>=g.start&&di<g.end).reduce((s,g)=>s+g.rooms,0);
    return Math.min(total, Math.round((isWk?0.82:0.6)*total+(seed-3)*0.4)+grp);
  };
  const todayIdx = days.findIndex(d=>d.toDateString()===TODAY.toDateString());
  const DW = 70;
  const heatC = (occ: number) => occ>=90 ? ERROR : occ>=75 ? ORANGE : occ>=50 ? WARNING : SUCCESS;
  return (
    <div>
      <PageHeader title="Availability Board" sub="Inventory, sold, and available rooms by type × date · Click any cell to drill down"
        actions={<><BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Availability report exported"})} /><BtnP label="Add Group Block" icon={Plus} onClick={()=>add({type:"info",title:"Create group block"})} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Inventory" value={String(TYPES.reduce((s,t)=>s+t.total,0))} sub="All room types" icon={BedDouble} accent={PRIMARY} />
        <StatCard label="Avg Occupancy" value="73%" sub="Next 14 days" icon={TrendingUp} accent={TEAL} />
        <StatCard label="Group Blocks" value="2" sub="Active blocks" icon={Users} accent={ORANGE} />
        <StatCard label="Overbooking" value="0" sub="No alerts" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
            <button onClick={()=>setOffset(o=>o-7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color:MUTED,borderColor:BORDER }}><ChevronLeft size={13}/>Prev 7</button>
            <span className="text-sm font-semibold" style={{ color: TEXT }}>{days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[DAYS-1].toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}</span>
            <button onClick={()=>setOffset(o=>o+7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color:MUTED,borderColor:BORDER }}>Next 7<ChevronRight size={13}/></button>
          </div>
          <div style={{ overflowX:"auto" }}>
            <div style={{ minWidth: 160+DW*DAYS }}>
              {/* Date header */}
              <div className="flex sticky top-0 z-10" style={{ backgroundColor:"#F9FAFB", borderBottom:`1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-4 py-2 flex items-center" style={{ width:160, borderRight:`1px solid ${BORDER}` }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Room Type</span>
                </div>
                {days.map((d,i)=>(
                  <div key={i} className="flex-shrink-0 flex flex-col items-center py-2" style={{ width:DW, borderRight:`1px solid ${BORDER}`, backgroundColor: i===todayIdx ? "#EFF6FF" : d.getDay()===0||d.getDay()===6 ? "#FAFBFD" : "transparent" }}>
                    <span className="text-xs font-semibold" style={{ color: i===todayIdx ? PRIMARY : TEXT }}>{d.toLocaleDateString("en-NG",{weekday:"short"})}</span>
                    <span className="text-xs" style={{ color: i===todayIdx ? PRIMARY : SUBTLE }}>{d.getDate()}/{d.getMonth()+1}</span>
                    {i===todayIdx && <span style={{ fontSize:9,color:PRIMARY,fontWeight:700 }}>TODAY</span>}
                  </div>
                ))}
              </div>
              {/* Type rows */}
              {TYPES.map(rt=>(
                <div key={rt.code} style={{ borderBottom:`2px solid ${BORDER}` }}>
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 sticky left-0 z-10" style={{ width:160, borderRight:`1px solid ${BORDER}`, backgroundColor:"white" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white" style={{ backgroundColor:rt.color, fontSize:10 }}>{rt.code}</div>
                      <div><div className="text-xs font-semibold" style={{ color: TEXT }}>{rt.name}</div><div className="text-xs" style={{ color: MUTED }}>{rt.total} rooms</div></div>
                    </div>
                    {days.map((_,i)=>{
                      const sold = getSold(rt.code,i);
                      const avail = rt.total - sold;
                      const grpBlock = GROUP_BLOCKS.find(g=>g.type===rt.code&&i>=g.start&&i<g.end);
                      return (
                        <div key={i} onClick={()=>setDrillCell({type:rt.name,date:days[i].toLocaleDateString("en-NG",{day:"numeric",month:"short"}),sold,avail,total:rt.total})}
                          className="flex-shrink-0 flex flex-col items-center justify-center py-2 cursor-pointer border-r transition-colors hover:bg-blue-50"
                          style={{ width:DW, minHeight:60, borderColor:"#F1F5F9", backgroundColor: i===todayIdx ? "rgba(18,58,115,0.03)" : "white" }}>
                          <div className="text-xs w-full flex justify-around px-1">
                            <span style={{ color: MUTED }}>inv <span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>{rt.total}</span></span>
                            <span style={{ color: MUTED }}>sold <span className="font-bold" style={{ color: sold===rt.total ? ERROR : TEXT, fontFamily: mono }}>{sold}</span></span>
                          </div>
                          <div className="text-sm font-black mt-0.5" style={{ color: avail===0 ? ERROR : avail<=2 ? ORANGE : SUCCESS, fontFamily: mono }}>{avail}</div>
                          <div className="text-xs" style={{ color: MUTED }}>avail</div>
                          {grpBlock && (
                            <div className="w-full px-2 mt-1">
                              <div className="rounded-sm text-center px-1" style={{ backgroundColor:`${TEAL}20`,color:TEAL,fontSize:8,fontWeight:700 }}>GRP {grpBlock.rooms}rm</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* Occupancy heat row */}
              <div className="flex sticky bottom-0 z-10" style={{ backgroundColor:"#F9FAFB", borderTop:`2px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-4 py-2 flex items-center" style={{ width:160, borderRight:`1px solid ${BORDER}` }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Property Occ %</span>
                </div>
                {days.map((_,i)=>{
                  const totalSold = TYPES.reduce((s,rt)=>s+getSold(rt.code,i),0);
                  const totalInv = TYPES.reduce((s,rt)=>s+rt.total,0);
                  const occ = Math.round((totalSold/totalInv)*100);
                  return (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center py-2" style={{ width:DW, borderRight:`1px solid ${BORDER}`, backgroundColor: i===todayIdx ? "#EFF6FF" : "transparent" }}>
                      <span className="text-sm font-bold" style={{ color: heatC(occ), fontFamily: mono }}>{occ}%</span>
                      <div className="w-10 h-1.5 rounded-full mt-0.5" style={{ backgroundColor:"#E2E8F0" }}>
                        <div className="h-1.5 rounded-full" style={{ width:`${occ}%`, backgroundColor: heatC(occ) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Drill panel */}
        {drillCell && (
          <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold" style={{ color: TEXT }}>{drillCell.type}</h3>
                <div className="text-xs" style={{ color: MUTED }}>{drillCell.date}</div></div>
              <button onClick={()=>setDrillCell(null)} className="p-1 rounded" style={{ color: MUTED }}><X size={14}/></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[["Inventory",String(drillCell.total),TEXT],["Sold",String(drillCell.sold),drillCell.sold>0?ERROR:MUTED],["Available",String(drillCell.avail),drillCell.avail===0?ERROR:drillCell.avail<=2?ORANGE:SUCCESS]].map(([l,v,c])=>(
                <div key={l} className="text-center p-3 rounded-xl" style={{ backgroundColor:"#F0F4F8" }}>
                  <div className="text-xl font-black" style={{ color:c as string,fontFamily:mono }}>{v}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Reservations in this cell ({drillCell.sold})</div>
              <div className="space-y-2">
                {ALL_RES.filter(r=>(r.type===drillCell.type||r.type.startsWith(drillCell.type.split(" ")[0]))).slice(0,Math.min(drillCell.sold,4)).map(r=>(
                  <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: TEXT }}>{r.guest}</div>
                      <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.id} · {r.checkin}–{r.checkout}</div>
                    </div>
                    <button onClick={()=>nav ? nav("reservation-detail","Reservation") : add({type:"info",title:r.id})} className="text-xs px-2 py-1 rounded-lg border" style={{ color: TEAL, borderColor:`${TEAL}30` }}>View</button>
                  </div>
                ))}
                {drillCell.sold===0 && <div className="text-xs text-center py-3" style={{ color: MUTED }}>No reservations for this cell</div>}
                {drillCell.sold>4 && <div className="text-xs text-center" style={{ color: MUTED }}>+ {drillCell.sold-4} more reservations</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>add({type:"warning",title:"Stop-sell applied",body:`${drillCell.type} · ${drillCell.date}`})} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{ color: ERROR, borderColor:`${ERROR}30` }}>Stop-Sell</button>
              <button onClick={()=>nav ? nav("new-reservation","New Reservation") : add({type:"info",title:"New reservation"})} className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>New Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
