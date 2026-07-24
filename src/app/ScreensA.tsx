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
  occData, revCat, roomSt, deptKPIs, recentAct, ROOMS, RES_GRID, IN_HOUSE, WORK_ORDERS,
  HK_ROOMS, STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ALL_RES, ARRIVALS_DATA, ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, ASSETS, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  HK_TASK_ROOMS, INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA,
} from "./data";

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
  const hrs = new Date().getHours();
  const greeting = hrs < 12 ? "Good morning" : hrs < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Guest genders for avatar (by name convention)
  const GUEST_GENDERS: Record<string, "M" | "F"> = {
    "Emeka Okafor": "M", "Aisha Bello": "F", "James Adeyemi": "M",
    "Ngozi Eze": "F", "Chibueze Nwachukwu": "M", "Fatima Suleiman": "F",
    "Oluwaseun Obaseki": "M", "Grace Odion": "F",
  };

  const glanceItems = [
    { icon: Building2, label: "Rooms", val: "62/100", sub: "occupied", color: PRIMARY, pct: 62, screen: "hk-board", sl: "Housekeeping Board" },
    { icon: UtensilsCrossed, label: "Tables", val: "14/20", sub: "active now · ₦225K", color: ORANGE, pct: 70, screen: "pos-terminal", sl: "POS Terminal" },
    { icon: Wrench, label: "Work Orders", val: "9", sub: "open · 3 overdue", color: ERROR, pct: 45, screen: "work-orders", sl: "Work Orders" },
    { icon: Users, label: "Staff On Duty", val: "24/32", sub: "on shift", color: SUCCESS, pct: 75, screen: "staff-directory", sl: "Staff Directory" },
  ];

  return (
    <div>
      {/* ── Welcome banner ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 mb-5 relative overflow-hidden transition-all hover:shadow-md"
        style={{ border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #0EA5E9 0%, #2563EB 50%, #7C3AED 100%)" }} />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: SUBTLE }}>{greeting}</div>
            <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: TEXT }}>Grace Mensah</h2>
            <div className="text-sm" style={{ color: MUTED }}>Grand Palms Hotel, Abuja &nbsp;·&nbsp; {today}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />88% Occupied
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" }}>
              <ArrowDownToLine size={12} />12 Arriving Today
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", color: "#92400E" }}>
              <ArrowUpFromLine size={12} />8 Departing Today
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <button onClick={() => nav && nav("new-reservation", "New Reservation")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md hover:-translate-y-px"
            style={{ backgroundColor: PRIMARY }}><Plus size={14} />New Reservation</button>
          <button onClick={() => nav && nav("check-in", "Check-In")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[#F4F4F5]"
            style={{ color: TEXT, borderColor: BORDER }}><ArrowDownToLine size={14} />Quick Check-In</button>
          <button onClick={() => nav && nav("check-out", "Check-Out")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[#F4F4F5]"
            style={{ color: TEXT, borderColor: BORDER }}><ArrowUpFromLine size={14} />Quick Check-Out</button>
          <button onClick={() => nav && nav("hk-board", "Housekeeping Board")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[#F4F4F5]"
            style={{ color: TEXT, borderColor: BORDER }}><BedDouble size={14} />HK Board</button>
        </div>
      </div>

      {/* ── KPI Cards row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Occupancy Rate" value="88%" sub="62 of 100 rooms" delta="+4% vs yesterday" deltaPositive icon={Building2} accent={PRIMARY} />
        <StatCard label="Revenue Today" value="₦1.25M" sub="Target: ₦1.1M" delta="+13.5%" deltaPositive icon={DollarSign} accent={TEAL} />
        <StatCard label="Active Guests" value="94" sub="12 arrivals · 8 departures" delta="+6 vs yesterday" deltaPositive icon={Users} accent={ORANGE} />
        <StatCard label="Open Issues" value="9" sub="7 maintenance · 2 complaints" delta="+2 since morning" deltaPositive={false} icon={AlertTriangle} accent={ERROR} />
      </div>

      {/* ── Operations glance cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {glanceItems.map(g => {
          const Icon = g.icon;
          return (
            <div key={g.label} onClick={() => nav && nav(g.screen as any, g.sl)}
              className="bg-white rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
              style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${g.color}14`, border: `1px solid ${g.color}20` }}>
                  <Icon size={18} style={{ color: g.color }} />
                </div>
                <ArrowRight size={14} style={{ color: SUBTLE }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl font-bold mb-0.5 tracking-tight" style={{ color: TEXT }}>{g.val}</div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>{g.label}</div>
              <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F4F4F5" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
              </div>
              <div className="text-xs mt-1" style={{ color: SUBTLE }}>{g.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Chart + Quick status ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border transition-all hover:shadow-md" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: TEXT }}>Occupancy & Revenue</div>
              <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>This week — daily trend</div>
            </div>
            <div className="flex gap-4 text-xs" style={{ color: MUTED }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: PRIMARY }} />Occupancy</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: TEAL }} />Revenue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={occData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any, n: any) => [n === "rev" ? `₦${v}K` : `${v}%`, n === "rev" ? "Revenue" : "Occupancy"]} />
              <Area type="monotone" dataKey="occ" name="Occupancy" stroke={PRIMARY} strokeWidth={2} fill={PRIMARY + "20"} dot={false} />
              <Area type="monotone" dataKey="rev" name="Revenue" stroke={TEAL} strokeWidth={2} fill={TEAL + "20"} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department quick-status cards */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Department Status</div>
          {[
            { dept: "Front Desk", status: "Active", metric: "4 pending check-ins", color: SUCCESS, screen: "in-house-guests", sl: "In-House Guests" },
            { dept: "Housekeeping", status: "In Progress", metric: "18 rooms to clean", color: TEAL, screen: "hk-board", sl: "Housekeeping Board" },
            { dept: "Restaurant", status: "Busy", metric: "14/20 tables occupied", color: ORANGE, screen: "pos-terminal", sl: "POS Terminal" },
            { dept: "Maintenance", status: "Alert", metric: "3 overdue jobs", color: ERROR, screen: "work-orders", sl: "Work Orders" },
          ].map(d => (
            <div key={d.dept} onClick={() => nav && nav(d.screen as any, d.sl)}
              className="bg-white rounded-xl px-4 py-3 border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3 group"
              style={{ borderColor: BORDER }}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" style={{ backgroundColor: d.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: TEXT }}>{d.dept}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${d.color}14`, color: d.color }}>{d.status}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>{d.metric}</div>
              </div>
              <ArrowRight size={13} style={{ color: SUBTLE }} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Arrivals + Activity ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}>
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Today's Arrivals</div>
            <button onClick={() => nav && nav("arrivals", "Arrivals")} className="text-xs font-semibold" style={{ color: TEAL }}>View all →</button>
          </div>
          <div>
            {IN_HOUSE.slice(0, 4).map((g, i) => {
              const gender: "M" | "F" = (GUEST_GENDERS[g.guest] ?? (i % 2 === 0 ? "M" : "F"));
              return (
                <div key={g.room} className="flex items-center gap-3 px-5 py-3 border-b hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ borderColor: "#F4F4F5" }}>
                  <Av gender={gender} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5"><span className="text-sm font-semibold truncate" style={{ color: TEXT }}>{g.guest}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Out {g.checkout}</div>
                  </div>
                  <div>{g.balance > 0 ? <span className="text-xs font-bold" style={{ color: ERROR }}>₦{g.balance.toLocaleString()}</span> : <CheckCircle2 size={14} style={{ color: SUCCESS }} />}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}>
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Live Activity</div>
            <button onClick={() => nav && nav("audit-log", "Audit Log")} className="text-xs font-semibold" style={{ color: TEAL }}>Full log →</button>
          </div>
          <div className="divide-y" style={{ borderColor: "#F4F4F5" }}>
            {recentAct.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F9FAFB] transition-colors">
                <Av gender={i % 2 === 0 ? "M" : "F"} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: actBg(r.type), color: actC(r.type) }}>{r.action}</span>
                    <span className="text-xs" style={{ color: SUBTLE }}>Room {r.room}</span>
                  </div>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: SUBTLE, fontFamily: mono }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardRole({ role, nav }: { role: Role; nav?: (s: string, label: string) => void }) {
  const cfgs: Record<string, { title: string; sub: string; img: string; stats: any[]; arrivals: { label: string; value: string; icon: React.ElementType }[] }> = {
    FD: { title: "Front Desk", sub: "Today's check-ins, check-outs, and guest activity",
      img: "https://images.unsplash.com/photo-1692153142524-60285a93c249?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Rooms Available", value: "18", sub: "Of 100 total rooms", accent: SUCCESS, icon: BedDouble }, { label: "Check-ins Today", value: "12", sub: "4 remaining", accent: PRIMARY, icon: KeyRound }, { label: "Check-outs", value: "8", sub: "3 still in-house", accent: ORANGE, icon: ArrowRight }, { label: "Outstanding", value: "₦284K", sub: "3 open folios", accent: ERROR, icon: DollarSign }],
      arrivals: [{ label: "New Arrivals", value: "4", icon: ArrowDownToLine }, { label: "Departures", value: "3", icon: ArrowUpFromLine }, { label: "Occupied Rooms", value: "82%", icon: BedDouble }] },
    HK: { title: "Housekeeping", sub: "Room cleaning status, inspections, and assignments",
      img: "https://images.unsplash.com/photo-1711873315178-ee7de0b2ea5d?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Rooms to Clean", value: "14", sub: "3 priority", accent: ERROR, icon: BedDouble }, { label: "In Progress", value: "5", sub: "3 attendants active", accent: ORANGE, icon: Activity }, { label: "Completed Today", value: "22", sub: "Of 40 assigned", accent: SUCCESS, icon: CheckCircle2 }, { label: "Inspections Due", value: "4", sub: "Supervisor review", accent: WARNING, icon: ClipboardList }],
      arrivals: [{ label: "Dirty Rooms", value: "14", icon: BedDouble }, { label: "Clean & Ready", value: "18", icon: CheckCircle2 }, { label: "DND Rooms", value: "3", icon: XCircle }] },
    MX: { title: "Maintenance", sub: "Work orders, assets, and preventive tasks",
      img: "https://images.unsplash.com/photo-1590033509078-7a65dd609114?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Open Work Orders", value: "7", sub: "All categories", accent: ERROR, icon: Wrench }, { label: "Overdue", value: "2", sub: "SLA breached", accent: "#EF4444", icon: AlertTriangle }, { label: "Completed Today", value: "3", sub: "This shift", accent: SUCCESS, icon: CheckCircle2 }, { label: "Assets Due", value: "1", sub: "Next 7 days", accent: ORANGE, icon: Settings }],
      arrivals: [{ label: "Open Orders", value: "7", icon: Wrench }, { label: "Overdue", value: "2", icon: AlertTriangle }, { label: "Completed", value: "3", icon: CheckCircle2 }] },
    FIN: { title: "Finance & Billing", sub: "Revenue, invoices, and payment tracking",
      img: "https://images.unsplash.com/photo-1779301674216-506de8607c87?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Revenue Today", value: "₦1.25M", sub: "113% of target", accent: SUCCESS, icon: TrendingUp }, { label: "Outstanding", value: "₦284K", sub: "3 open folios", accent: ERROR, icon: FileText }, { label: "Payments", value: "₦980K", sub: "Cash + POS + Transfer", accent: TEAL, icon: CreditCard }, { label: "Discounts", value: "₦45K", sub: "6 approved today", accent: ORANGE, icon: Activity }],
      arrivals: [{ label: "Revenue", value: "₦1.25M", icon: TrendingUp }, { label: "Outstanding", value: "₦284K", icon: FileText }, { label: "Discounts", value: "₦45K", icon: DollarSign }] },
    RT: { title: "Restaurant & POS", sub: "Tables, orders, and F&B revenue",
      img: "https://images.unsplash.com/photo-1670603999602-af0ddca5e5bb?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Tables Occupied", value: "12/24", sub: "50% capacity", accent: ORANGE, icon: UtensilsCrossed }, { label: "Orders in Queue", value: "4", sub: "Avg 12 min wait", accent: ERROR, icon: ClipboardList }, { label: "Room Service", value: "2", sub: "Rooms 304, 118", accent: WARNING, icon: Truck }, { label: "F&B Revenue", value: "₦225K", sub: "Today total", accent: SUCCESS, icon: DollarSign }],
      arrivals: [{ label: "Tables Open", value: "12", icon: UtensilsCrossed }, { label: "In Queue", value: "4", icon: ClipboardList }, { label: "Revenue", value: "₦225K", icon: DollarSign }] },
    MGT: { title: "Management Overview", sub: "Hotel-wide KPIs, alerts, and department status",
      img: "https://images.unsplash.com/photo-1646991761123-d83ce47c30c9?w=1200&h=300&fit=crop&auto=format",
      stats: [{ label: "Occupancy Rate", value: "88%", sub: "62 of 100 rooms", accent: PRIMARY, icon: Building2 }, { label: "Revenue Today", value: "₦1.25M", sub: "+13.5% vs target", accent: SUCCESS, icon: DollarSign }, { label: "Active Guests", value: "94", sub: "12 arrivals pending", accent: ORANGE, icon: Users }, { label: "Open Issues", value: "9", sub: "7 MX · 2 complaints", accent: ERROR, icon: AlertTriangle }],
      arrivals: [{ label: "Occupancy", value: "88%", icon: Building2 }, { label: "Revenue", value: "₦1.25M", icon: DollarSign }, { label: "Issues", value: "9", icon: AlertTriangle }] },
  };
  const cfg = cfgs[role] ?? cfgs.MGT;
  return (
    <div>
      {/* Role hero banner */}
      <div className="relative h-36 mb-6 rounded-2xl overflow-hidden bg-zinc-800">
        <img src={cfg.img} alt={cfg.title} className="w-full h-full object-cover" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center pl-7">
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>Role Dashboard · {role}</div>
          <div className="text-xl font-bold text-white">{cfg.title}</div>
          <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{cfg.sub}</div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3">
          {cfg.arrivals.map(a => { const Icon = a.icon; return (
            <div key={a.label} className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="text-white text-lg font-bold">{a.value}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>{a.label}</div>
            </div>
          ); })}
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{cfg.stats.map((s: any) => <StatCard key={s.label} {...s} />)}</div>
      {/* Today's Arrivals */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Today's Guest Activity</div>
          <button onClick={() => nav && nav("arrivals", "Arrivals")} className="text-xs font-semibold" style={{ color: TEAL }}>View Arrivals →</button>
        </div>
        {IN_HOUSE.slice(0, 4).map((g, i) => (
          <div key={g.room} className="flex items-center gap-4 px-5 py-3 border-b hover:bg-[#F9FAFB] transition-colors" style={{ borderColor: "#F4F4F5" }}>
            <Av gender={i % 2 === 0 ? "M" : "F"} size={36} /><div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span>{g.vip && <Star size={12} fill={ORANGE} style={{ color: ORANGE }} />}</div>
              <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Check-out {g.checkout}</div>
            </div>
            {g.balance > 0 ? <span className="text-xs font-semibold" style={{ color: ERROR }}>₦{g.balance.toLocaleString()}</span> : <CheckCircle2 size={15} style={{ color: SUCCESS }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReservationGrid({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const today = new Date(2025, 5, 24);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const DW = 60; const RH = 44;
  return (
    <div>
      <PageHeader title="Reservation Grid" sub="14-day availability · Click empty cell to create · Click bar for detail" actions={<><BtnO label="Jump to Date" icon={CalendarDays} /><BtnP label="New Reservation" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Reservations" value={String(RES_GRID.length)} sub="All statuses" icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Today's Arrivals" value={"3"} sub="Checking in today" icon={ArrowDownToLine} accent={TEAL} />
        <StatCard label="VIP Guests" value={"2"} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Unconfirmed" value={"1"} sub="Need confirmation" icon={AlertCircle} accent={ERROR} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F9FAFB", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search rooms…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }} /></div>
          {["All", "Standard", "Deluxe", "Suite"].map(f => <button key={f} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: f === "All" ? PRIMARY : BORDER, backgroundColor: f === "All" ? PRIMARY : "white", color: f === "All" ? "white" : MUTED }}>{f}</button>)}
          <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: MUTED }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: SUCCESS }} />Checked In</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: TEAL }} />Confirmed</span>
          </div>
        </div>
        <div style={{ overflowX: "auto", maxHeight: 520 }}>
          <div style={{ minWidth: 200 + DW * 14 }}>
            <div className="flex sticky top-0 z-10" style={{ backgroundColor: "#F9FAFB", borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex-shrink-0 flex items-center px-4 py-2" style={{ width: 200, borderRight: `1px solid ${BORDER}` }}><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Room</span></div>
              {days.map((d, i) => <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center py-2" style={{ width: DW, borderRight: `1px solid ${BORDER}`, backgroundColor: i === 0 ? "#EFF6FF" : "transparent" }}><span className="text-xs font-semibold" style={{ color: i === 0 ? PRIMARY : TEXT }}>{d.toLocaleDateString("en-NG", { weekday: "short" })}</span><span className="text-xs" style={{ color: i === 0 ? PRIMARY : SUBTLE }}>{d.getDate()}/{d.getMonth() + 1}</span></div>)}
            </div>
            {ROOMS.map(room => {
              const res = RES_GRID.filter(r => r.room === room.id);
              const c = roomStC[room.status] ?? { bg: "#F3F4F6", text: "#374151" };
              return (
                <div key={room.id} className="flex relative" style={{ height: RH, borderBottom: "1px solid #F1F5F9" }}>
                  <div className="flex-shrink-0 flex items-center gap-3 px-4 sticky left-0 z-10" style={{ width: 200, borderRight: `1px solid ${BORDER}`, backgroundColor: "white" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{room.id}</div>
                    <div><div className="text-xs font-semibold" style={{ color: TEXT }}>Room {room.id}</div><div className="text-xs" style={{ color: SUBTLE }}>{room.type} · F{room.floor}</div></div>
                    <div className="ml-auto"><span className="text-xs px-1.5 py-0.5 rounded" style={c}>{room.status}</span></div>
                  </div>
                  <div className="relative flex-1 flex">
                    {days.map((_, i) => <div key={i} className="flex-shrink-0 border-r hover:bg-[#F0F9FF] cursor-pointer transition-colors" style={{ width: DW, height: RH, borderRightColor: "#F4F4F5" }} onClick={() => add({ type: "info", title: "New Reservation", body: `Room ${room.id}` })} />)}
                    {res.map((r, ri) => <div key={ri} className="absolute flex items-center px-2 cursor-pointer hover:opacity-90 rounded-md" style={{ left: r.start * DW + 2, width: (r.end - r.start) * DW - 4, height: RH - 16, top: 8, backgroundColor: r.color }} onClick={() => nav ? nav("reservation-detail", `${r.guest} — ${room.id}`) : add({ type: "info", title: r.guest, body: `Room ${room.id}` })}><span className="text-white text-xs font-medium truncate">{r.guest}</span></div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewReservation({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [bookType, setBookType] = useState("Individual");
  return (
    <div>
      <PageHeader title="New Reservation" sub="Create a reservation for an individual, group, or walk-in guest" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Booking Type</h3>
            <div className="flex gap-2">{["Individual", "Group", "Walk-In"].map(t => <button key={t} onClick={() => setBookType(t)} className="px-4 py-2 rounded-lg text-sm font-medium border-2" style={{ borderColor: bookType === t ? PRIMARY : BORDER, backgroundColor: bookType === t ? "#EFF6FF" : "white", color: bookType === t ? PRIMARY : MUTED }}>{t}</button>)}</div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest</h3>
            <div className="relative mb-3"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search existing guests by name or phone…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: TEAL }}><Plus size={12} />Create new guest profile</button>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Dates & Room</h3>
            <div className="grid grid-cols-2 gap-3 mb-3"><Inp label="Check-In Date" type="date" defaultValue="2025-06-24" /><Inp label="Check-Out Date" type="date" defaultValue="2025-06-27" /></div>
            <div className="grid grid-cols-2 gap-3 mb-3"><Sel label="Room Type" options={["Standard Room", "Deluxe Room", "Suite"]} /><Sel label="Specific Room (optional)" options={["Auto-assign", "Room 101", "Room 102", "Room 301"]} /></div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#F0FDF4", color: SUCCESS }}><CheckCircle2 size={13} />18 rooms available for selected dates and type</div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Rate & Details</h3>
            <div className="grid grid-cols-2 gap-3 mb-3"><Sel label="Rate Plan" options={["Standard Rate", "Corporate Rate", "Weekend Special"]} /><Inp label="Nightly Rate (₦)" defaultValue="55,000" /></div>
            <div className="grid grid-cols-3 gap-3 mb-3"><Sel label="Adults" options={["1", "2", "3", "4"]} /><Sel label="Children" options={["0", "1", "2"]} /><Sel label="Rooms" options={["1", "2", "3"]} /></div>
            <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Special Requests</label><textarea className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" rows={2} placeholder="High floor, extra pillows, champagne on arrival…" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Deposit</h3><label className="flex items-center gap-2 cursor-pointer"><span className="text-sm" style={{ color: MUTED }}>Collect deposit</span><div className="w-10 h-5 rounded-full" style={{ backgroundColor: TEAL }}><div className="w-4 h-4 bg-white rounded-full m-0.5 ml-5 shadow" /></div></label></div>
            <div className="grid grid-cols-2 gap-3"><Inp label="Deposit Amount (₦)" defaultValue="55,000" /><Sel label="Payment Method" options={["Cash", "POS / Card", "Bank Transfer"]} /></div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Reservation Summary</h3>
            <div className="space-y-2 text-sm mb-4">{[["Room Type", "Deluxe Room"], ["Check-In", "24 Jun 2025"], ["Check-Out", "27 Jun 2025"], ["Nights", "3"], ["Rate", "₦55,000 / night"]].map(([k, v]) => <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>)}<div className="pt-2 mt-2 border-t" style={{ borderColor: BORDER }}>{[["Subtotal", "₦165,000"], ["VAT (7.5%)", "₦12,375"], ["Total", "₦177,375"]].map(([k, v], i) => <div key={k} className={`flex justify-between ${i === 2 ? "font-bold text-base" : "text-sm"} mb-1`}><span style={{ color: TEXT }}>{k}</span><span style={{ color: TEXT }}>{v}</span></div>)}</div></div>
            <div className="space-y-2"><BtnP label="Confirm Reservation" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Reservation confirmed!", body: "BK-2852 created successfully" })} /><BtnO label="Save as Draft" onClick={() => add({ type: "info", title: "Saved as draft" })} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckOut({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [cash, setCash] = useState("82100");
  const total = FOLIO_CHARGES.reduce((s, c) => s + c.amount, 0);
  const vat = Math.round(total * 0.075); const grand = total + vat; const paid = 55000; const balance = grand - paid;
  return (
    <div>
      <PageHeader title="Check-Out & Settlement" sub="Room 202 · Emmanuel Adeyemi · Checking out 25 Jun 2025"
        actions={<><BtnO label="Extend Stay" icon={CalendarDays} /><BtnP label="Settle & Release Room" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Check-out complete", body: "Room 202 released to Housekeeping. Access revoked." })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Departures Today" value={"1"} sub="Checked out + pending" icon={ArrowUpFromLine} accent={PRIMARY} />
        <StatCard label="Settled" value={balance <= 0 ? "1" : "0"} sub="Zero balance" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Outstanding" value={balance > 0 ? "1" : "0"} sub="Need payment" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Rooms Released" value="4" sub="Available for walk-in" icon={BedDouble} accent={TEAL} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><div><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Folio — BK-2848</h3><p className="text-xs mt-0.5" style={{ color: SUBTLE }}>Emmanuel Adeyemi · Room 202 · 23–25 Jun</p></div><div className="flex gap-2"><BtnO label="Print" icon={FileText} /><BtnO label="Email" icon={Mail} /></div></div>
            <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date", "Category", "Description", "Qty", "Unit", "Amount", "By"].map((h, i) => <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>{FOLIO_CHARGES.map((c, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{c.date}</td><td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F4F4F5", color: MUTED }}>{c.cat}</span></td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{c.desc}</td><td className="px-4 py-3 text-sm text-center" style={{ color: MUTED }}>{c.qty}</td><td className="px-4 py-3 text-sm" style={{ color: MUTED }}>₦{c.unit.toLocaleString()}</td><td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>₦{c.amount.toLocaleString()}</td><td className="px-4 py-3 text-xs" style={{ color: SUBTLE }}>{c.by}</td></tr>)}</tbody>
            </table>
            <div className="px-5 py-4 border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
              <div className="flex justify-end"><div className="w-64 space-y-1.5 text-sm">
                <div className="flex justify-between"><span style={{ color: MUTED }}>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>VAT (7.5%)</span><span>₦{vat.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>Deposit paid</span><span style={{ color: SUCCESS }}>−₦{paid.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: BORDER, color: TEXT }}><span>Balance Due</span><span>₦{balance.toLocaleString()}</span></div>
              </div></div>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}>
            <Lock size={16} style={{ color: SUCCESS, marginTop: 1 }} />
            <div><div className="text-sm font-semibold" style={{ color: SUCCESS }}>Room Access — Auto-Revoke on Release</div><div className="text-xs mt-0.5" style={{ color: "#065F46" }}>Key Card ×1 and PIN will be deactivated automatically when room is released.</div></div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Payment</h3>
            <div className="text-3xl font-bold mb-1" style={{ color: TEXT }}>₦{balance.toLocaleString()}</div>
            <div className="text-xs mb-5" style={{ color: MUTED }}>Balance remaining after deposit</div>
            {[{ label: "Cash", val: cash, setVal: setCash }, { label: "POS / Card", val: "0", setVal: () => {} }, { label: "Bank Transfer", val: "0", setVal: () => {} }].map(m => (
              <div key={m.label} className="mb-3"><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{m.label}</label><div className="flex items-center gap-2"><span className="text-sm font-medium" style={{ color: MUTED }}>₦</span><input value={m.val} onChange={e => m.setVal(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div></div>
            ))}
            <div className="px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
              {[["Received", `₦${(+cash).toLocaleString()}`], ["Balance due", `₦${balance.toLocaleString()}`], ["Change due", `₦${Math.max(0, +cash - balance).toLocaleString()}`]].map(([k, v]) => <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>)}
            </div>
            <BtnP label="Process Payment & Release Room" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Payment processed", body: "Room 202 → Cleaning. Access revoked." })} />
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest</h3>
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>EA</div><div><div className="text-sm font-semibold" style={{ color: TEXT }}>Emmanuel Adeyemi</div><div className="text-xs" style={{ color: MUTED }}>Room 202 · BK-2848 · 2 nights</div></div></div>
            <div className="text-xs space-y-1" style={{ color: MUTED }}>{[["Check-in", "23 Jun 14:05"], ["Check-out", "25 Jun 11:00"], ["Stays", "3rd visit"]].map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}</span><span style={{ color: TEXT }}>{v}</span></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InHouseGuests({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [ihSearch, setIhSearch] = useState("");
  const [ihFilter, setIhFilter] = useState("All");
  const ihGuests = IN_HOUSE.filter(g => {
    const ms = !ihSearch || g.guest.toLowerCase().includes(ihSearch.toLowerCase()) || g.room.includes(ihSearch);
    const mf = ihFilter === "All" ? true : ihFilter === "VIP" ? g.vip : ihFilter === "Balance" ? g.balance > 0 : g.nights > 5;
    return ms && mf;
  });
  const AVATARS = [33, 18, 61, 22, 45, 7, 52, 29];
  return (
    <div>
      <PageHeader title="In-House Guests" sub={`${IN_HOUSE.length} guests currently checked in`} actions={<><BtnO label="Export" icon={Download} /><BtnP label="Post Charge" icon={Plus} onClick={() => nav && nav("folio", "Folio Management")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="In-House" value={String(IN_HOUSE.length)} sub="Currently checked in" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Guests" value={String(IN_HOUSE.filter(g => g.vip).length)} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Outstanding" value={`₦${IN_HOUSE.reduce((s,g)=>s+g.balance,0).toLocaleString()}`} sub={`${IN_HOUSE.filter(g=>g.balance>0).length} open folios`} icon={DollarSign} accent={ERROR} />
        <StatCard label="Departures Today" value="3" sub="Expected by 11:00" icon={ArrowRight} accent={TEAL} />
      </div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={ihSearch} onChange={e => setIhSearch(e.target.value)} placeholder="Search guest or room…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Balance", "Long Stay"].map(f => <button key={f} onClick={() => setIhFilter(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: ihFilter===f ? PRIMARY : "white", color: ihFilter===f ? "white" : MUTED, borderColor: ihFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
        <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{ihGuests.length} of {IN_HOUSE.length}</span>
      </div>
      {ihGuests.length === 0 ? <EmptyState icon={Users} message="No guests match your filters" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ihGuests.map((g, i) => (
            <div key={g.room} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" style={{ borderColor: BORDER }}>
              <div className="flex items-stretch">
                {/* Room image strip */}
                <div className="w-28 flex-shrink-0 relative overflow-hidden bg-zinc-200">
                  <img src={`https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=200&h=300&fit=crop&auto=format&sat=-20`} alt={`Room ${g.room}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <div className="text-white text-xl font-black">{g.room}</div>
                    <div className="text-white/65 text-xs">{g.type ?? "Deluxe"}</div>
                  </div>
                </div>
                {/* Guest info */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Av gender={i % 2 === 0 ? "M" : "F"} size={36} /><div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span>
                          {g.vip && <Star size={11} fill={ORANGE} style={{ color: ORANGE }} />}
                        </div>
                        <div className="text-xs" style={{ color: MUTED }}>Floor {Math.floor(Number(g.room) / 100)}</div>
                      </div>
                    </div>
                    {g.balance > 0 ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{g.balance.toLocaleString()}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: SUCCESS }}><CheckCircle2 size={12} />Settled</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3" style={{ color: MUTED }}>
                    <div><div style={{ color: SUBTLE, fontSize: 10 }} className="uppercase tracking-wider mb-0.5">Check-in</div><div style={{ color: TEXT }}>{g.checkin}</div></div>
                    <div><div style={{ color: SUBTLE, fontSize: 10 }} className="uppercase tracking-wider mb-0.5">Check-out</div><div style={{ color: TEXT }}>{g.checkout}</div></div>
                    <div><div style={{ color: SUBTLE, fontSize: 10 }} className="uppercase tracking-wider mb-0.5">Nights</div><div style={{ color: TEXT, fontWeight: 700 }}>{g.nights}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => nav ? nav("check-out", "Check-Out") : add({ type: "info", title: "Check-out initiated", body: g.guest })} className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-colors" style={{ backgroundColor: PRIMARY }}>Check Out</button>
                    <button onClick={() => nav && nav("folio", "Folio Management")} className="text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors hover:bg-[#F4F4F5]" style={{ color: MUTED, borderColor: BORDER }}>View Folio</button>
                    <button className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5] transition-colors" style={{ color: SUBTLE }}><MoreHorizontal size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GuestProfiles({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const ALL_GUESTS = [
    { name: "Adaeze Okonkwo", id: "G-001", phone: "+234 801 111 2222", stays: 8, lastStay: "24 Jun", vip: true, tag: "Regular", activeStay: true, balance: 0, avatar: 20 },
    { name: "Dr. Chukwuemeka Bello", id: "G-002", phone: "+234 803 555 6666", stays: 15, lastStay: "24 Jun", vip: true, tag: "VIP", activeStay: true, balance: 0, avatar: 5 },
    { name: "Emmanuel Adeyemi", id: "G-003", phone: "+234 802 333 4444", stays: 3, lastStay: "23 Jun", vip: false, tag: "", activeStay: true, balance: 45000, avatar: 15 },
    { name: "Ibrahim Lawal", id: "G-004", phone: "+234 805 999 0000", stays: 5, lastStay: "23 Jun", vip: false, tag: "Corporate", activeStay: true, balance: 0, avatar: 3 },
    { name: "Fatima Al-Hassan", id: "G-005", phone: "+234 804 777 8888", stays: 1, lastStay: "22 Jun", vip: false, tag: "", activeStay: false, balance: 0, avatar: 47 },
    { name: "Tunde Bakare", id: "G-006", phone: "+234 809 123 4567", stays: 2, lastStay: "20 Jun", vip: false, tag: "Corporate", activeStay: false, balance: 18500, avatar: 8 },
    { name: "Ngozi Adeyemi", id: "G-007", phone: "+234 807 654 3210", stays: 4, lastStay: "18 Jun", vip: false, tag: "", activeStay: false, balance: 0, avatar: 44 },
    { name: "Chidi Eze", id: "G-008", phone: "+234 806 222 3333", stays: 6, lastStay: "15 Jun", vip: true, tag: "VIP", activeStay: false, balance: 0, avatar: 12 },
  ];
  const filtered = ALL_GUESTS.filter(g => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.id.includes(search) && !g.phone.includes(search)) return false;
    if (filterTab === "VIP") return g.vip;
    if (filterTab === "Active Stay") return g.activeStay;
    if (filterTab === "Has Balance") return g.balance > 0;
    return true;
  });
  return (
    <div>
      <PageHeader title="Guest Profiles" sub={`${filtered.length} of ${ALL_GUESTS.length} profiles`} actions={<><BtnO label="Merge Duplicates" icon={Layers} /><BtnP label="New Profile" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Profiles" value={String(ALL_GUESTS.length)} sub="Registered guests" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Members" value={String(ALL_GUESTS.filter(g=>g.vip).length)} sub="Loyalty & VIP tier" icon={Star} accent={ORANGE} />
        <StatCard label="Active Stay" value={String(IN_HOUSE.length)} sub="Currently in-house" icon={BedDouble} accent={TEAL} />
        <StatCard label="With Balance" value={String(ALL_GUESTS.filter(g=>g.balance>0).length)} sub="Open folios" icon={DollarSign} accent={ERROR} />
      </div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, or ID…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Active Stay", "Has Balance"].map(f => (
          <button key={f} onClick={() => setFilterTab(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all"
            style={{ borderColor: filterTab === f ? PRIMARY : BORDER, backgroundColor: filterTab === f ? PRIMARY : "white", color: filterTab === f ? "white" : MUTED }}>{f}</button>
        ))}
        {search && <button onClick={() => setSearch("")} className="text-xs" style={{ color: MUTED }}>Clear</button>}
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} message={`No guests match "${search || filterTab}"`} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(g => (
            <div key={g.id} onClick={() => nav && nav("guest-profile-detail", g.name)}
              className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all group"
              style={{ borderColor: BORDER }}>
              <div className="h-20 relative overflow-hidden bg-zinc-800">
                <img src="https://images.unsplash.com/photo-1646991761123-d83ce47c30c9?w=400&h=120&fit=crop&auto=format" alt="hotel" className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-2 left-3 flex gap-1.5">
                  {g.vip && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: ORANGE, color: "white" }}>VIP</span>}
                  {g.activeStay && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#10B981", color: "white" }}>In-house</span>}
                </div>
              </div>
              <div className="px-4 pt-0 pb-4">
                <div className="-mt-6 mb-3">
                  <Av gender={(g as any).gender ?? "M"} size={48} /></div>
                <div className="font-semibold text-sm leading-tight mb-0.5" style={{ color: TEXT }}>{g.name}</div>
                <div className="text-xs mb-3" style={{ color: MUTED, fontFamily: mono }}>{g.id} · {g.phone}</div>
                <div className="flex items-center justify-between text-xs mb-2" style={{ color: MUTED }}>
                  <span>{g.stays} stay{g.stays !== 1 ? "s" : ""}</span>
                  <span>Last: {g.lastStay}</span>
                </div>
                {g.balance > 0 && <div className="mb-2 px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{g.balance.toLocaleString()} outstanding</div>}
                {g.tag && <div className="mb-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{g.tag}</span></div>}
                <div className="flex gap-2">
                  <button onClick={e => { e.stopPropagation(); nav && nav("guest-profile-detail", g.name); }} className="flex-1 text-xs py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>View</button>
                  <button onClick={e => { e.stopPropagation(); nav && nav("new-reservation", "New Reservation"); }} className="flex-1 text-xs py-1.5 rounded-lg text-white font-semibold transition-colors" style={{ backgroundColor: PRIMARY }}>Reserve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FolioScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCharge, setShowCharge] = useState(false);
  const [charge, setCharge] = useState({ folio: "FO-2841", cat: "Restaurant", desc: "", amount: "", by: "John Abubakar" });

  const postCharge = () => {
    if (!charge.desc || !charge.amount) { add({ type: "warning", title: "Fill in description and amount" }); return; }
    setShowCharge(false);
    add({ type: "success", title: "Charge posted", body: `${charge.cat} · ₦${Number(charge.amount).toLocaleString()} → ${charge.folio}` });
    setCharge(p => ({ ...p, desc: "", amount: "" }));
  };

  const allFolios = IN_HOUSE.map((g, i) => ({ ...g, folio: `FO-${2840 + i}`, bal: [82100, 45000, 0, 120000, 0][i] }));
  const filtered = allFolios.filter(g =>
    (statusFilter === "All" || (statusFilter === "Open" ? g.bal > 0 : g.bal === 0)) &&
    (!search || g.guest.toLowerCase().includes(search.toLowerCase()) || g.room.includes(search))
  );

  return (
    <div>
      <PageHeader title="Folio Management" sub="All open and closed guest folios"
        actions={<><BtnO label="Export" icon={Download} /><BtnP label="Post Charge" icon={Plus} onClick={() => setShowCharge(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Charges" value={`₦${allFolios.reduce((s,f)=>s+f.bal,0).toLocaleString()}`} sub="All line items" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Outstanding" value={`₦${allFolios.filter(f=>f.bal>0).reduce((s,f)=>s+f.bal,0).toLocaleString()}`} sub="Unpaid charges" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Settled" value={`₦${allFolios.filter(f=>f.bal===0).reduce((s,_)=>s+0,0).toLocaleString()}`} sub="Paid items" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Line Items" value={String(allFolios.length)} sub="Total transactions" icon={FileText} accent={TEAL} />
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ backgroundColor: "#F9FAFB", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search folio, guest, or room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          {["All", "Open", "Settled"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all"
              style={{ borderColor: statusFilter === f ? PRIMARY : BORDER, backgroundColor: statusFilter === f ? PRIMARY : "white", color: statusFilter === f ? "white" : MUTED }}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{filtered.length} folios</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB", borderBottom: `2px solid ${BORDER}` }}>{["Folio ID", "Guest", "Room", "Check-in", "Check-out", "Total", "Paid", "Balance", "Status", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((g, i) => {
            const tot = g.bal + 55000;
            return (
              <tr key={g.room} className="border-t hover:bg-[#F9FAFB] cursor-pointer transition-colors" style={{ borderColor: "#F4F4F5", backgroundColor: i % 2 === 0 ? "white" : "#FAFBFD" }}>
                <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{g.folio}</td>
                <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{g.guest.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span></div></td>
                <td className="px-4 py-3.5 font-bold text-base" style={{ color: PRIMARY }}>{g.room}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: MUTED }}>{g.checkin}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: MUTED }}>{g.checkout}</td>
                <td className="px-4 py-3.5 text-sm font-bold" style={{ color: TEXT }}>₦{tot.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: SUCCESS }}>₦55,000</td>
                <td className="px-4 py-3.5 text-sm font-bold" style={{ color: g.bal > 0 ? ERROR : SUCCESS }}>{g.bal > 0 ? `₦${g.bal.toLocaleString()}` : "Settled"}</td>
                <td className="px-4 py-3.5"><Badge label={g.bal > 0 ? "Open" : "Settled"} colors={g.bal > 0 ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#DCFCE7", text: "#166534" }} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1">
                    <button onClick={() => { setCharge(p => ({ ...p, folio: g.folio })); setShowCharge(true); }} className="text-xs px-2 py-1 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Charge</button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: SUBTLE }}><MoreHorizontal size={13} /></button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={FileText} message="No folios match your search." />}
      </div>

      {/* Post Charge Modal */}
      {showCharge && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowCharge(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>Post Manual Charge</h3>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>Posting to folio <span className="font-mono font-semibold" style={{ color: PRIMARY }}>{charge.folio}</span></p>
              </div>
              <button onClick={() => setShowCharge(false)} style={{ color: SUBTLE }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Post to Folio</label>
                <select value={charge.folio} onChange={e => setCharge(p => ({ ...p, folio: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                  {IN_HOUSE.map((g, i) => <option key={g.room} value={`FO-${2840 + i}`}>FO-{2840 + i} — {g.guest} (Room {g.room})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Category</label>
                  <select value={charge.cat} onChange={e => setCharge(p => ({ ...p, cat: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                    {["Restaurant", "Bar", "Laundry", "Room Service", "Minibar", "Telephone", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Amount (₦)</label>
                  <input type="number" value={charge.amount} onChange={e => setCharge(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}
                    onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label>
                <input value={charge.desc} onChange={e => setCharge(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Room Service Order #RS-044, Dinner for 2 — Table T06"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}>
                ⚠ Discounts above ₦5,000 require Manager approval. Charges post immediately to the folio and sync on next connection.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={() => setShowCharge(false)} />
              <BtnP label="Post Charge" icon={DollarSign} onClick={postCharge} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const HK_STATUS_CYCLE = ["Dirty", "In Progress", "Clean", "Inspected"] as const;

export function HKBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [rooms, setRooms] = useState(() => HK_ROOMS.map(r => ({ ...r })));
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const COLS = [
    { id: "Dirty", label: "Dirty", color: "#D97706", bg: "#FFFBEB" },
    { id: "In Progress", label: "In Progress", color: "#2563EB", bg: "#EFF6FF" },
    { id: "Clean", label: "Clean", color: "#059669", bg: "#F0FDF4" },
    { id: "Inspected", label: "Inspected", color: "#7C3AED", bg: "#F5F3FF" },
  ];
  const filtered = rooms.filter(r => !search || r.id.includes(search) || (r.attendant || "").toLowerCase().includes(search.toLowerCase()));
  const moveTo = (roomId: string, colId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, hkSt: colId } : r));
    add({ type: "success", title: `Room ${roomId} → ${colId}` });
  };
  const onDrop = (colId: string) => {
    if (dragId) { moveTo(dragId, colId); setDragId(null); setDragOver(null); }
  };
  return (
    <div>
      <PageHeader title="Housekeeping Board" sub="Drag room cards between columns to update status" actions={<><BtnO label="Print Report" icon={Download} /><BtnP label="Assign Rooms" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {COLS.map(c => { const n = rooms.filter(r => r.hkSt === c.id).length; return (
          <div key={c.id} className="bg-white rounded-xl p-4 border flex items-center gap-3" style={{ borderColor: BORDER }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: c.bg, color: c.color }}>{n}</div>
            <div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c.label}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE }}>rooms</div></div>
          </div>
        ); })}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by room or attendant…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        <span className="text-xs" style={{ color: MUTED }}>Drag cards between columns · Click a room image to view work orders</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {COLS.map((col, ci) => {
          const colRooms = filtered.filter(r => r.hkSt === col.id);
          const isOver = dragOver === col.id;
          return (
            <div key={col.id} className="rounded-xl border overflow-hidden transition-all" style={{ borderColor: isOver ? col.color : BORDER, borderTop: `3px solid ${col.color}` }}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }} onDragLeave={() => setDragOver(null)} onDrop={() => onDrop(col.id)}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: col.bg, borderColor: BORDER }}>
                <span className="text-sm font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: col.color + "22", color: col.color }}>{colRooms.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-64" style={{ backgroundColor: isOver ? col.bg : "#F9FAFB" }}>
                {colRooms.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs rounded-xl border-2 border-dashed" style={{ color: col.color + "80", borderColor: col.color + "40", backgroundColor: col.bg + "60" }}>
                    Drop here
                  </div>
                )}
                {colRooms.map(r => (
                  <div key={r.id} draggable onDragStart={() => setDragId(r.id)} onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    className="bg-white rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow select-none"
                    style={{ borderColor: BORDER, opacity: dragId === r.id ? 0.45 : 1 }}>
                    <div className="h-24 bg-zinc-200 overflow-hidden relative">
                      <img src={`https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=300&h=150&fit=crop&auto=format&sat=-40`} alt={`Room ${r.id}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                        <span className="text-white font-bold text-base">Room {r.id}</span>
                        {r.priority === "High" && <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-red-500 text-white">!</span>}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: MUTED }}>
                        <span>{r.type} · Floor {r.floor}</span>
                        {r.since && <span style={{ fontFamily: mono }}>{r.since}</span>}
                      </div>
                      {r.attendant && <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: TEXT }}><div className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: col.color }}>{r.attendant[0]}</div>{r.attendant}</div>}
                      <div className="flex gap-1.5">
                        {ci < COLS.length - 1 && (
                          <button onClick={() => moveTo(r.id, COLS[ci + 1].id)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white transition-colors" style={{ backgroundColor: COLS[ci + 1].color }}>
                            → {COLS[ci + 1].label}
                          </button>
                        )}
                        {nav && <button onClick={() => nav("work-orders", "Work Orders")} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold" style={{ color: MUTED, borderColor: BORDER }}>WO</button>}
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
  const [showNew, setShowNew] = useState(false);
  const [newWO, setNewWO] = useState({ location: "", category: "Electrical", priority: "Medium", desc: "" });

  const visible = filter === "All" ? WORK_ORDERS : WORK_ORDERS.filter(w => w.status === filter);

  const submitWO = () => {
    if (!newWO.location || !newWO.desc) { add({ type: "warning", title: "Fill in location and description" }); return; }
    setShowNew(false);
    add({ type: "success", title: "Work order created", body: `${newWO.location} — ${newWO.category} · ${newWO.priority} priority` });
    setNewWO({ location: "", category: "Electrical", priority: "Medium", desc: "" });
  };

  return (
    <div>
      <PageHeader title="Work Orders" sub="All maintenance requests across the property"
        actions={<><BtnO label="Export" icon={Download} /><BtnP label="New Work Order" icon={Plus} onClick={() => setShowNew(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Open" value={String(WORK_ORDERS.filter(w=>w.status==="Reported"||w.status==="Assigned").length)} sub="Awaiting assignment" icon={AlertCircle} accent={ERROR} />
        <StatCard label="In Progress" value={String(WORK_ORDERS.filter(w=>w.status==="In Progress").length)} sub="Being worked on" icon={Activity} accent={ORANGE} />
        <StatCard label="Overdue" value={String(WORK_ORDERS.filter(w=>w.priority==="High").length)} sub="High priority" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Completed Today" value={String(WORK_ORDERS.filter(w=>w.status==="Closed").length)} sub="Resolved today" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="flex gap-2.5 mb-5 flex-wrap">
        {["All", "Reported", "Assigned", "In Progress", "Overdue", "Completed"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{ borderColor: filter === s ? PRIMARY : BORDER, backgroundColor: filter === s ? "#EFF6FF" : "white", color: filter === s ? PRIMARY : MUTED }}>
            {s}
            {s === "Overdue" && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>2</span>}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB", borderBottom: `2px solid ${BORDER}` }}>
              {["ID", "Location", "Category", "Priority", "Status", "Technician", "Age", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: MUTED, letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((w, i) => (
              <tr key={w.id} className="border-t hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ borderColor: "#F4F4F5", backgroundColor: i % 2 === 0 ? "white" : "#FAFBFD" }}
                onClick={() => nav && nav("work-order-detail", w.id)}>
                <td className="px-4 py-3.5 text-xs font-mono" style={{ color: MUTED, fontFamily: mono }}>{w.id}</td>
                <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: TEXT }}>{w.location}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: MUTED }}>{w.cat}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ color: priC[w.priority], backgroundColor: `${priC[w.priority]}12` }}>
                    {w.priority}
                  </span>
                </td>
                <td className="px-4 py-3.5"><Badge label={w.status} colors={woC[w.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                <td className="px-4 py-3.5 text-sm" style={{ color: MUTED }}>{w.tech}</td>
                <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: w.status === "Overdue" ? ERROR : ORANGE, fontFamily: mono }}>{w.age}</td>
                <td className="px-4 py-3.5"><button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: SUBTLE }} onClick={e => e.stopPropagation()}><MoreHorizontal size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState icon={Wrench} message="No work orders match this filter." cta="New Work Order" onCta={() => setShowNew(true)} />}
      </div>

      {/* New Work Order Modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>New Work Order</h3>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>Report a maintenance issue across the property</p>
              </div>
              <button onClick={() => setShowNew(false)} style={{ color: SUBTLE }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
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
  const channels = ["All Staff", "Reception", "Housekeeping", "Maintenance"];
  const [active, setActive] = useState("Reception");
  const [msg, setMsg] = useState("");
  const msgs = CHAT_MSGS[active] ?? [];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active]);
  const send = () => { if (!msg.trim()) return; add({ type: "success", title: "Message sent", body: `#${active}` }); setMsg(""); };
  return (
    <div>
      <PageHeader title="Internal Chat" sub="LAN-based staff messaging · Fully offline" actions={<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: ERROR }}><AlertTriangle size={14} />🚨 Emergency Broadcast</button>} />
      <div className="bg-white rounded-xl border overflow-hidden flex" style={{ borderColor: BORDER, height: 560 }}>
        <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Channels</div></div>
          <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
            {channels.map(ch => { const unread = ch === "Maintenance" ? 2 : ch === "All Staff" ? 1 : 0; return <button key={ch} onClick={() => setActive(ch)} className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[#F9FAFB]" style={{ backgroundColor: active === ch ? "#EFF6FF" : "transparent", borderLeft: active === ch ? `3px solid ${PRIMARY}` : "3px solid transparent" }}><span className="text-sm font-medium" style={{ color: active === ch ? PRIMARY : TEXT }}>#{ch}</span>{unread > 0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ERROR }}>{unread}</span>}</button>; })}
            <div className="px-4 py-2 mt-2 border-t" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Direct Messages</div>
              {STAFF.slice(0, 4).map(s => <button key={s.id} className="w-full flex items-center gap-2.5 py-2 text-left hover:bg-[#F9FAFB] rounded-lg px-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{s.av}</div><div className="min-w-0"><div className="text-xs font-medium truncate" style={{ color: TEXT }}>{s.name.split(" ")[0]}</div><div className="w-2 h-2 rounded-full mt-0.5" style={{ backgroundColor: SUCCESS }} /></div></button>)}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}18` }}><MessageSquare size={16} style={{ color: PRIMARY }} /></div>
            <div><div className="text-sm font-semibold" style={{ color: TEXT }}>#{active}</div><div className="text-xs" style={{ color: SUBTLE }}>Department channel</div></div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
            {msgs.map((m, i) => <div key={i} className={`flex items-end gap-3 ${m.mine ? "flex-row-reverse" : ""}`}>{!m.mine && <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-1" style={{ backgroundColor: PRIMARY }}>{m.av}</div>}<div className={`max-w-xs lg:max-w-md ${m.mine ? "items-end" : "items-start"} flex flex-col`}>{!m.mine && <span className="text-xs font-medium mb-1" style={{ color: MUTED }}>{m.from}</span>}<div className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: m.mine ? PRIMARY : "#F4F4F5", color: m.mine ? "white" : TEXT }}>{m.msg}</div><span className="text-xs mt-1" style={{ color: SUBTLE, fontFamily: mono }}>{m.time}</span></div></div>)}
            <div ref={endRef} />
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3"><input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Message #${active}…`} className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }} /><button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:opacity-90" style={{ backgroundColor: PRIMARY }}><Send size={16} /></button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function POSTerminal({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [order, setOrder] = useState<Array<{ id: number; name: string; price: number; qty: number }>>([]);
  const [activeCat, setActiveCat] = useState("Mains");
  const [showRoomPost, setShowRoomPost] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("202");
  const cats = ["Mains", "Starters", "Sides", "Drinks", "Desserts"];
  const items = MENU_ITEMS.filter(i => i.cat === activeCat && i.avail);
  const addItem = (item: typeof MENU_ITEMS[0]) => setOrder(prev => { const ex = prev.find(o => o.id === item.id); if (ex) return prev.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o); return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]; });
  const removeItem = (id: number) => setOrder(prev => prev.map(o => o.id === id ? { ...o, qty: Math.max(0, o.qty - 1) } : o).filter(o => o.qty > 0));
  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const tax = Math.round(subtotal * 0.075); const total = subtotal + tax;
  return (
    <div>
      <PageHeader title="POS Terminal" sub="Table T02 · Party of 3" actions={<BtnO label="Tables" icon={Layers} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Today's Revenue" value="₦184,500" sub="POS transactions" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Orders Today" value="42" sub="Completed orders" icon={ClipboardList} accent={TEAL} />
        <StatCard label="Avg Order Value" value="₦4,393" sub="Per transaction" icon={TrendingUp} accent={SUCCESS} />
        <StatCard label="Open Tabs" value="3" sub="Room folio charges" icon={FileText} accent={ORANGE} />
      </div>
      <div className="flex gap-4 h-[580px]">
        <div className="flex-1 flex flex-col bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>{cats.map(c => <button key={c} onClick={() => setActiveCat(c)} className="flex-1 py-3 text-sm font-medium transition-colors" style={{ color: activeCat === c ? PRIMARY : MUTED, borderBottom: activeCat === c ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{c}</button>)}</div>
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "none" }}><div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{items.map(item => <button key={item.id} onClick={() => addItem(item)} className="p-4 rounded-xl border-2 text-left transition-all hover:border-[#18181B] hover:shadow-sm" style={{ borderColor: order.find(o => o.id === item.id) ? PRIMARY : BORDER, backgroundColor: order.find(o => o.id === item.id) ? "#EFF6FF" : "white" }}><div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{item.name}</div><div className="text-base font-bold" style={{ color: PRIMARY }}>₦{item.price.toLocaleString()}</div>{order.find(o => o.id === item.id) && <div className="mt-1 text-xs font-medium" style={{ color: TEAL }}>×{order.find(o => o.id === item.id)?.qty} added</div>}</button>)}</div></div>
        </div>
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}><div className="text-sm font-semibold" style={{ color: TEXT }}>Current Order</div><div className="text-xs" style={{ color: SUBTLE }}>{order.length === 0 ? "No items yet" : `${order.reduce((s, o) => s + o.qty, 0)} items`}</div></div>
          <div className="flex-1 overflow-y-auto px-4 py-2" style={{ scrollbarWidth: "none" }}>
            {order.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center"><ShoppingCart size={28} style={{ color: SUBTLE }} /><p className="text-xs mt-2" style={{ color: SUBTLE }}>Tap menu items to add</p></div>
              : order.map(o => <div key={o.id} className="flex items-center gap-2 py-2.5 border-b" style={{ borderColor: "#F9FAFB" }}><div className="flex-1 min-w-0"><div className="text-xs font-medium truncate" style={{ color: TEXT }}>{o.name}</div><div className="text-xs" style={{ color: MUTED }}>₦{o.price.toLocaleString()}</div></div><div className="flex items-center gap-1"><button onClick={() => removeItem(o.id)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}><MinusCircle size={14} /></button><span className="w-5 text-center text-sm font-semibold" style={{ color: TEXT }}>{o.qty}</span><button onClick={() => addItem(MENU_ITEMS.find(i => i.id === o.id)!)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: PRIMARY }}><PlusCircle size={14} /></button></div><div className="text-sm font-semibold w-16 text-right" style={{ color: TEXT }}>₦{(o.price * o.qty).toLocaleString()}</div></div>)}
          </div>
          {order.length > 0 && <div className="px-4 py-4 border-t" style={{ borderColor: BORDER }}>
            <div className="space-y-1 text-sm mb-3"><div className="flex justify-between"><span style={{ color: MUTED }}>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span style={{ color: MUTED }}>VAT 7.5%</span><span>₦{tax.toLocaleString()}</span></div><div className="flex justify-between font-bold text-base" style={{ color: TEXT }}><span>Total</span><span>₦{total.toLocaleString()}</span></div></div>
            <div className="space-y-2"><BtnP label="Send to Kitchen" icon={UtensilsCrossed} onClick={() => { add({ type: "success", title: "Order sent to kitchen", body: `${order.length} items · Table T02` }); setOrder([]); }} /><BtnO label="Post to Room Folio" icon={FileText} onClick={() => setShowRoomPost(true)} /></div>
          </div>}
        </div>
      </div>

      {showRoomPost && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.55)", backdropFilter: "blur(4px)" }} onClick={() => setShowRoomPost(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl w-full max-w-md p-6" style={{ boxShadow: "0 24px 64px rgba(13,27,46,0.22)", border: "1px solid #E4E4E7" }}>
            <div className="flex items-center justify-between mb-5">
              <div><h3 className="text-base font-bold" style={{ color: TEXT, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Post to Room Folio</h3><p className="text-xs mt-0.5" style={{ color: MUTED }}>{order.length} item{order.length !== 1 ? "s" : ""} · ₦{total.toLocaleString()} total</p></div>
              <button onClick={() => setShowRoomPost(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: MUTED }}><X size={16} /></button>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Select in-house guest</p>
            <div className="space-y-2 mb-5 max-h-56 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {IN_HOUSE.map(g => (
                <button key={g.room} onClick={() => setSelectedRoom(g.room)} className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all" style={{ borderColor: selectedRoom === g.room ? PRIMARY : "#E4E4E7", backgroundColor: selectedRoom === g.room ? "#EFF6FF" : "white" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #1d4ed8)` }}>{g.guest.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate" style={{ color: TEXT }}>{g.guest}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>Room {g.room} · Check-out {g.checkout}</div></div>
                  {selectedRoom === g.room && <CheckCircle2 size={18} style={{ color: PRIMARY }} />}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl mb-4 text-sm font-medium" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: SUCCESS }}>
              ₦{total.toLocaleString()} will be posted to Room {selectedRoom}
            </div>
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={() => setShowRoomPost(false)} />
              <BtnP label="Confirm & Post" icon={DollarSign} onClick={() => { const g = IN_HOUSE.find(x => x.room === selectedRoom); setShowRoomPost(false); add({ type: "success", title: "Charge posted", body: `₦${total.toLocaleString()} → Room ${selectedRoom} (${g?.guest ?? ""})` }); setOrder([]); }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function TableManagement({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <PageHeader title="Table Management" sub="Restaurant floor plan · Live status" actions={<><BtnO label="Dining Reservations" icon={CalendarDays} onClick={() => nav && nav("dining-reservations", "Dining Reservations")} /><BtnP label="Open POS" icon={UtensilsCrossed} onClick={() => nav && nav("pos-terminal", "POS Terminal")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Occupied" value={String(TABLE_LAYOUT.filter(t=>t.status==="Occupied").length)} sub="Currently serving" icon={UtensilsCrossed} accent={ORANGE} /><StatCard label="Available" value={String(TABLE_LAYOUT.filter(t=>t.status==="Available").length)} sub="Ready for seating" icon={CheckCircle2} accent={SUCCESS} /><StatCard label="Reserved" value={String(TABLE_LAYOUT.filter(t=>t.status==="Reserved").length)} sub="Upcoming bookings" icon={CalendarDays} accent={TEAL} /><StatCard label="Dirty / Clearing" value={String(TABLE_LAYOUT.filter(t=>t.status==="Dirty").length)} sub="Awaiting turnover" icon={AlertTriangle} accent={WARNING} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Floor Plan</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 12, minHeight: 280 }}>
            {TABLE_LAYOUT.map(t => { const c = tblC[t.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" }; return <div key={t.id} onClick={() => setSelected(t.id)} className="cursor-pointer rounded-xl border-2 flex flex-col items-center justify-center hover:shadow-md transition-all" style={{ gridColumn: `${t.col} / span 2`, gridRow: `${t.row} / span 2`, backgroundColor: selected === t.id ? `${c.border}30` : c.bg, borderColor: selected === t.id ? c.border : `${c.border}80`, padding: 8, minHeight: 72 }}><div className="text-xs font-bold" style={{ color: c.text }}>{t.id}</div><div className="text-xs" style={{ color: c.text }}>{t.seats}p</div>{t.status === "Occupied" && (t as any).time && <div className="text-xs mt-0.5" style={{ color: c.text, fontFamily: mono }}>{(t as any).time}</div>}</div>; })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t text-xs" style={{ borderColor: "#F4F4F5", color: MUTED }}>{Object.entries(tblC).map(([s, c]) => <span key={s} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block border" style={{ backgroundColor: c.bg, borderColor: c.border }} />{s}</span>)}</div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>{selected ? `Table ${selected}` : "Select a table"}</h3>
          {selected ? (() => { const t = TABLE_LAYOUT.find(x => x.id === selected)!; const c = tblC[t.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" }; return <div><Badge label={t.status} colors={{ bg: c.bg, text: c.text }} /><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span style={{ color: MUTED }}>Seats</span><span style={{ color: TEXT }}>{t.seats} persons</span></div>{(t as any).guest && <div className="flex justify-between"><span style={{ color: MUTED }}>Guest</span><span style={{ color: TEXT }}>{(t as any).guest}</span></div>}{(t as any).time && <div className="flex justify-between"><span style={{ color: MUTED }}>Time seated</span><span style={{ color: TEXT, fontFamily: mono }}>{(t as any).time}</span></div>}</div><div className="space-y-2 mt-4">{t.status === "Available" && <BtnP label="Seat Party" icon={Users} onClick={() => add({ type: "success", title: `Table ${t.id} seated` })} />}{t.status === "Occupied" && <BtnP label="Open Check" icon={FileText} onClick={() => add({ type: "info", title: `Check for ${t.id}` })} />}{t.status === "Dirty" && <BtnP label="Mark Clean" icon={CheckCircle2} onClick={() => add({ type: "success", title: `Table ${t.id} clean` })} color={SUCCESS} />}<BtnO label="Reserve Table" icon={CalendarDays} /></div></div>; })()
            : <EmptyState icon={UtensilsCrossed} message="Click a table on the floor plan to see details and actions." />}
        </div>
      </div>
    </div>
  );
}

export function BranchOverview({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  return (
    <div>
      <PageHeader title="Branch Overview" sub="All branches under Grand Palms Group" actions={<BtnP label="Add New Branch" icon={Plus} onClick={() => add({ type: "info", title: "Branch provisioning", body: "Contact platform admin to provision a new local server" })} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Branches" value={String(BRANCHES.length)} sub="Under Grand Palms Group" icon={Building2} accent={PRIMARY} />
        <StatCard label="Online Now" value={String(BRANCHES.filter(b => b.online !== false).length)} sub="Connected & syncing" icon={Activity} accent={SUCCESS} />
        <StatCard label="Group Occupancy" value="84%" sub="Avg across all branches" icon={BedDouble} accent={TEAL} delta="+3% vs last week" deltaPositive />
        <StatCard label="Group Revenue Today" value="₦3.2M" sub="All branches combined" icon={DollarSign} accent={ORANGE} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">{BRANCHES.map(b => <div key={b.id} onClick={() => nav && nav("branch-comparison", b.name)} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer" style={{ borderColor: BORDER }}><div className="flex items-start justify-between mb-4"><div><h3 className="text-base font-bold" style={{ color: TEXT }}>{b.name}</h3><div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: MUTED }}><MapPin size={11} />{b.location}</div></div><div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: b.status === "synced" ? SUCCESS : WARNING }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.status === "synced" ? SUCCESS : WARNING }} />{b.status === "synced" ? "Synced" : "Pending"}</div></div><div className="grid grid-cols-2 gap-3 mb-4">{[{ l: "Occupancy", v: `${b.occ}%`, c: b.occ > 80 ? SUCCESS : WARNING }, { l: "Revenue Today", v: b.rev, c: TEXT }, { l: "Open Issues", v: b.issues, c: b.issues > 5 ? ERROR : SUCCESS }, { l: "Total Rooms", v: b.rooms, c: TEXT }].map(s => <div key={s.l} className="rounded-lg p-3" style={{ backgroundColor: "#F9FAFB" }}><div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div><div className="text-xs" style={{ color: MUTED }}>{s.l}</div></div>)}</div><div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "#F4F4F5" }}><div style={{ color: MUTED }}>Manager: <span style={{ color: TEXT, fontWeight: 500 }}>{b.manager}</span></div><div style={{ color: SUBTLE }}>Synced {b.lastSync}</div></div></div>)}</div>
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Occupancy Comparison</h3>
        <ResponsiveContainer width="100%" height={200}><BarChart data={BRANCHES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`, "Occupancy"]} /><Bar dataKey="occ" name="Occupancy" fill={PRIMARY} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

export function StaffDirectory({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const depts = ["All", ...Array.from(new Set(STAFF.map((s: any) => s.dept)))];
  const filtered = STAFF.filter((s: any) =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase())) &&
    (dept === "All" || s.dept === dept)
  );
  const STAFF_AVATARS = [26,32,50,17,40,23,62,36,55,19,45,68,14,28,39,53];
  const deptColors: Record<string, string> = { "Front Desk": "#2563EB", "Housekeeping": "#059669", "Maintenance": "#D97706", "Restaurant": "#9333EA", "Finance": "#0891B2", "Management": "#18181B", "IT": "#DC2626" };
  return (
    <div>
      <PageHeader title="Staff Directory" sub={`${filtered.length} of ${STAFF.length} staff members`} actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Staff" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Staff" value={String(STAFF.length)} sub="Active employees" icon={Users} accent={PRIMARY} />
        <StatCard label="On Shift" value={String(Math.round(STAFF.length * 0.7))} sub="Currently active" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Departments" value={String(new Set(STAFF.map((s: any) => s.dept)).size)} sub="Active departments" icon={Building2} accent={TEAL} />
        <StatCard label="On Leave" value="2" sub="This week" icon={AlertCircle} accent={ORANGE} />
      </div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
        {depts.map((d: any) => <button key={d} onClick={() => setDept(d)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ borderColor: dept === d ? PRIMARY : BORDER, backgroundColor: dept === d ? PRIMARY : "white", color: dept === d ? "white" : MUTED }}>{d}</button>)}
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} message="No staff match your search." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s: any, i: number) => {
            const dc = deptColors[s.dept] ?? PRIMARY;
            return (
              <div key={s.id} onClick={() => nav && nav("staff-profile", s.name)}
                className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                style={{ borderColor: BORDER }}>
                <div className="h-16 relative" style={{ background: `linear-gradient(135deg, ${dc}22 0%, ${dc}08 100%)` }}>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: dc }} />
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: dc + "18", color: dc }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SUCCESS }} />
                      On shift
                    </div>
                  </div>
                </div>
                <div className="px-4 pt-0 pb-4">
                  <div className="-mt-6 mb-3">
                    <Av gender={i % 2 === 0 ? "M" : "F"} size={48} /></div>
                  <div className="font-semibold text-sm leading-tight" style={{ color: TEXT }}>{s.name}</div>
                  <div className="text-xs mb-2" style={{ color: MUTED }}>{s.role}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: dc + "15", color: dc }}>{s.dept}</span>
                  <div className="flex items-center justify-between mt-3 text-xs" style={{ color: MUTED }}>
                    <span style={{ fontFamily: mono }}>{s.id}</span>
                    <span>{s.phone ?? "—"}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={e => { e.stopPropagation(); nav && nav("staff-profile", s.name); }} className="flex-1 text-xs py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>Profile</button>
                    <button onClick={e => { e.stopPropagation(); nav && nav("shift-scheduler", "Shift Scheduler"); }} className="flex-1 text-xs py-1.5 rounded-lg text-white font-semibold transition-colors" style={{ backgroundColor: PRIMARY }}>Schedule</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DailySummary({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [locked, setLocked] = useState(false);
  const cats = [{ cat: "Room Revenue", amount: 825000, txn: 15 }, { cat: "Restaurant & Bar", amount: 225000, txn: 42 }, { cat: "Laundry", amount: 18000, txn: 6 }, { cat: "Minibar", amount: 24000, txn: 18 }, { cat: "Events", amount: 155800, txn: 2 }];
  const total = cats.reduce((s, c) => s + c.amount, 0);
  return (
    <div>
      <PageHeader title="Daily Summary" sub="24 Jun 2025 · Grand Palms Hotel, Abuja"
        actions={locked ? <button onClick={() => add({ type: "info", title: "Reopen summary", body: "MGT/ORG authorization required" })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border" style={{ color: "#52525B", borderColor: "#D4D4D8" }}>Reopen (Auth Required)</button> : <BtnP label="Lock & Close Day" icon={Lock} onClick={() => { setLocked(true); add({ type: "success", title: "Daily summary locked", body: "24 Jun 2025 closed by Grace Mensah" }); }} />} />
      {locked && <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-medium" style={{ backgroundColor: "#DCFCE7", color: SUCCESS, border: `1px solid #BBF7D0` }}><Lock size={15} />Daily summary locked at 23:59 · Closed by Grace Mensah</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Total Revenue" value={fmtN(total)} sub="All departments combined" icon={TrendingUp} accent={SUCCESS} delta="+12.3% vs yesterday" deltaPositive /><StatCard label="Transactions" value="83" sub="Cash + POS + Transfer" icon={Activity} accent={PRIMARY} /><StatCard label="Discounts Applied" value="₦45,000" sub="6 manager approvals" icon={TrendingDown} accent={WARNING} /><StatCard label="Outstanding Balance" value="₦284,500" sub="3 open folios" icon={AlertTriangle} accent={ERROR} delta="₦45K added today" deltaPositive={false} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Revenue by Category</h3>
          {cats.map(c => <div key={c.cat} className="flex items-center gap-3 mb-3"><span className="text-sm flex-1" style={{ color: MUTED }}>{c.cat}</span><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${(c.amount / total) * 100}%`, backgroundColor: PRIMARY }} /></div><div className="text-right w-28"><div className="text-sm font-semibold" style={{ color: TEXT }}>{fmtN(c.amount)}</div><div className="text-xs" style={{ color: SUBTLE }}>{c.txn} txns</div></div></div>)}
          <div className="pt-3 mt-2 border-t flex items-center justify-between font-bold" style={{ borderColor: BORDER, color: TEXT }}><span>Total</span><span>{fmtN(total)}</span></div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Payments by Method</h3>
          {[{ method: "Cash", amount: 580000 }, { method: "POS / Card", amount: 420000 }, { method: "Bank Transfer", amount: 247800 }].map(p => <div key={p.method} className="flex items-center gap-3 mb-3"><CreditCard size={16} style={{ color: MUTED, flexShrink: 0 }} /><span className="text-sm flex-1" style={{ color: MUTED }}>{p.method}</span><span className="text-sm font-bold" style={{ color: TEXT }}>{fmtN(p.amount)}</span></div>)}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Cash Reconciliation</h4>
            {[["Opening Balance", "₦150,000"], ["Cash Received", "₦580,000"], ["Petty Cash Out", "−₦42,000"], ["Closing Balance", "₦688,000"]].map(([k, v], i) => <div key={k} className={`flex justify-between text-sm ${i === 3 ? "font-bold border-t pt-2 mt-1" : "mb-1.5"}`} style={{ borderColor: BORDER, color: i === 3 ? TEXT : MUTED }}><span>{k}</span><span style={{ color: i === 3 ? SUCCESS : undefined }}>{v}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OccupancyReports() {
  const monthly = [{ month: "Jan", occ: 61 }, { month: "Feb", occ: 68 }, { month: "Mar", occ: 74 }, { month: "Apr", occ: 71 }, { month: "May", occ: 79 }, { month: "Jun", occ: 88 }, { month: "Jul", occ: 92 }, { month: "Aug", occ: 90 }];
  return (
    <div>
      <PageHeader title="Occupancy Reports" sub="Grand Palms Hotel, Abuja · Year to date 2025" actions={<><BtnO label="Export Excel" icon={Download} /><BtnO label="Export PDF" icon={FileText} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Avg Occupancy (YTD)" value="78.4%" sub="Year to date 2025" icon={Building2} accent={PRIMARY} delta="+5.2% vs 2024" deltaPositive /><StatCard label="No-Show Rate" value="3.2%" sub="Improving trend" icon={UserCheck} accent={SUCCESS} delta="−0.8% vs last month" deltaPositive /><StatCard label="Cancellation Rate" value="8.1%" sub="+1.1% vs last month" icon={AlertCircle} accent={WARNING} delta="+1.1%" deltaPositive={false} /><StatCard label="Avg Length of Stay" value="2.8 nights" sub="+0.3 vs last month" icon={CalendarDays} accent={TEAL} delta="+0.3 nights" deltaPositive /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Monthly Occupancy — 2025</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} domain={[0, 100]} /><Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} /><Bar dataKey="occ" name="Occupancy" fill={PRIMARY} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Occupancy by Room Type</h3>
          {[{ type: "Suite", occ: 94 }, { type: "Deluxe", occ: 88 }, { type: "Standard", occ: 84 }].map(r => <div key={r.type} className="mb-4"><div className="flex items-center justify-between text-sm mb-1.5"><span style={{ color: TEXT }}>{r.type}</span><span className="font-bold" style={{ color: PRIMARY }}>{r.occ}%</span></div><div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${r.occ}%`, backgroundColor: PRIMARY }} /></div></div>)}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F4F4F5" }}>
            <div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Key Metrics</div>
            {[["ADR", "₦55,417"], ["RevPAR", "₦48,767"], ["GOP %", "62.4%"]].map(([k, v]) => <div key={k} className="flex justify-between text-sm mb-1.5"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StockDashboard({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const critical = STOCK.filter(i => i.status === "Critical");
  return (
    <div>
      <PageHeader title="Stock Dashboard" sub="Inventory overview · Grand Palms Hotel" actions={<><BtnO label="Purchase Orders" icon={FileText} /><BtnP label="Log Transaction" icon={Plus} /></>} />
      {critical.length > 0 && <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#FEF2F2", border: `1px solid #FECACA` }}><AlertTriangle size={16} style={{ color: ERROR, marginTop: 1 }} /><div><div className="text-sm font-semibold" style={{ color: ERROR }}>Critical Stock — {critical.length} items require immediate reorder</div><div className="text-xs mt-0.5" style={{ color: "#991B1B" }}>{critical.map(i => i.name).join(" · ")}</div></div><button className="ml-auto text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: ERROR }}>Reorder Now</button></div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Total Items" value={STOCK.length.toString()} sub="All inventory categories" icon={Package} accent={PRIMARY} /><StatCard label="Critical Stock" value={critical.length.toString()} sub="Immediate reorder needed" icon={AlertTriangle} accent={ERROR} /><StatCard label="Low Stock" value={STOCK.filter(i => i.status === "Low").length.toString()} sub="Below par level" icon={TrendingDown} accent={WARNING} /><StatCard label="Total Value" value={fmtN(STOCK.reduce((s, i) => s + i.current * i.cost, 0))} sub="Current inventory worth" icon={DollarSign} accent={SUCCESS} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>All Items</h3><BtnO label="Export" icon={Download} /></div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item", "Category", "Current / Par", "Reorder Point", "Unit Cost", "Value", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{STOCK.map(item => { const c = stC(item.status); const pct = Math.round((item.current / item.par) * 100); return <tr key={item.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{item.name}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{item.cat}</td><td className="px-5 py-3"><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{ color: c.text }}>{item.current}</span><span className="text-xs" style={{ color: SUBTLE }}>/ {item.par} {item.unit}</span></div><div className="mt-1 h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: c.bar }} /></div></td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{item.reorder} {item.unit}</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>₦{item.cost.toLocaleString()}</td><td className="px-5 py-3 text-sm font-semibold" style={{ color: TEXT }}>₦{(item.current * item.cost).toLocaleString()}</td><td className="px-5 py-3"><Badge label={item.status} colors={{ bg: c.bg, text: c.text }} /></td><td className="px-5 py-3"><button onClick={() => add({ type: "info", title: `Reorder ${item.name}` })} className="text-xs px-2.5 py-1 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Reorder</button></td></tr>; })}</tbody>
        </table>
      </div>
    </div>
  );
}

export function SystemHealth() {
  const svcs = [
    { name: "Web Server (Nginx)", status: "up", uptime: "14d 6h 22m", ver: "v1.25.3" },
    { name: "Application Server", status: "up", uptime: "14d 6h 22m", ver: "v2.4.1" },
    { name: "PostgreSQL Database", status: "up", uptime: "14d 6h 22m", ver: "v15.4" },
    { name: "Sync Service", status: "up", uptime: "2h 14m", ver: "v1.2.0" },
    { name: "Card Encoder Agent", status: "up", uptime: "8h 03m", ver: "v1.0.4" },
    { name: "Backup Service", status: "warning", uptime: "Last backup: 2h ago", ver: "v1.1.0" },
    { name: "TTLock API Adapter", status: "down", uptime: "Last contact: 47m ago", ver: "v1.3.2" },
  ];
  const sc: any = { up: SUCCESS, warning: WARNING, down: ERROR };
  const sb: any = { up: "#DCFCE7", warning: "#FEF9C3", down: "#FEE2E2" };
  return (
    <div>
      <PageHeader title="System Health" sub="Local server status · Grand Palms Abuja" actions={<BtnP label="Run Diagnostic" icon={Activity} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="System Uptime" value="99.8%" sub="Last 30 days" icon={Activity} accent={SUCCESS} delta="+0.1% this month" deltaPositive />
        <StatCard label="Active Sessions" value="23" sub="Staff logged in now" icon={Users} accent={PRIMARY} />
        <StatCard label="Alerts Today" value="2" sub="1 resolved, 1 open" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Last Backup" value="2h ago" sub="All systems healthy" icon={CheckCircle2} accent={TEAL} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">{[{l:"CPU Usage",v:"34%",c:SUCCESS,w:34,icon:Cpu},{l:"Memory",v:"61%",c:WARNING,w:61,icon:Server},{l:"Disk Usage",v:"47%",c:SUCCESS,w:47,icon:Package},{l:"Network (LAN)",v:"12 ms",c:SUCCESS,w:15,icon:Wifi}].map(s=>{const I=s.icon;return(<div key={s.l} className="rounded-2xl p-5 border" style={{borderColor:BORDER,boxShadow:"0 2px 8px rgba(13,27,46,0.06)"}}><div className="flex items-center justify-between mb-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${s.c}22,${s.c}11)`}}><I size={16} style={{color:s.c}} /></div><span className="text-2xl font-black" style={{color:s.c}}>{s.v}</span></div><div className="text-xs font-semibold mb-2" style={{color:MUTED}}>{s.l}</div><div className="h-1.5 rounded-full overflow-hidden" style={{backgroundColor:"#F4F4F5"}}><div className="h-full rounded-full" style={{width:`${s.w}%`,backgroundColor:s.c}} /></div></div>);})}</div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Services</h3></div>
        {svcs.map(s => <div key={s.name} className="flex items-center gap-4 px-5 py-4 border-b hover:bg-[#F9FAFB]" style={{ borderColor: "#F9FAFB" }}><div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: sb[s.status] }}><Server size={16} style={{ color: sc[s.status] }} /></div><div className="flex-1"><div className="text-sm font-medium" style={{ color: TEXT }}>{s.name}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{s.uptime} · {s.ver}</div></div><Badge label={s.status === "up" ? "Running" : s.status === "warning" ? "Warning" : "Down"} colors={{ bg: sb[s.status], text: sc[s.status] }} /><div className="flex gap-1"><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: "#52525B", borderColor: "#D4D4D8" }}>Restart</button><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: "#52525B", borderColor: "#D4D4D8" }}>Logs</button></div></div>)}
      </div>
    </div>
  );
}
