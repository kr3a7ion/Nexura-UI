// All screen components and shared UI primitives.
// Imported by App.tsx — no circular dependencies.
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SquaresFour, CalendarDots, Key, Bed, Wrench,
  ForkKnife, Chat, CurrencyDollar, Package, Users,
  Buildings, ChartBar, GearSix, CaretLeft, CaretRight,
  Bell, SignOut, User, CaretDown, TrendUp, TrendDown,
  Warning, CheckCircle, WifiSlash, Plus, MagnifyingGlass, Funnel,
  DotsThree, ArrowRight, House, Stack, XCircle, Lock, Globe,
  ClipboardText, CalendarCheck, Star, WarningCircle, Clock,
  ArrowClockwise, Hash, FileText, CreditCard, Truck, Phone,
  PencilSimple, Eye, Trash, DownloadSimple, PaperPlaneRight, List as MenuIcon,
  Question, Shield, HardDrives, Cpu, Pulse, WifiHigh,
  MinusCircle, PlusCircle, ShoppingCart, MapPin, Envelope,
  UserCheck, BookOpen, Tray, Lightning,
  ArrowLineDown, ArrowLineUp,
  Wine, Gift, Coffee, Car,
} from "@phosphor-icons/react";
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
    success: { bg: "#EFFEF7", border: "#86EFAC", icon: CheckCircle, accent: "#16A34A" },
    error:   { bg: "#FFF1F2", border: "#FDA4AF", icon: WarningCircle, accent: "#E11D48" },
    info:    { bg: "#EFF6FF", border: "#93C5FD", icon: WarningCircle, accent: "#2563EB" },
    warning: { bg: "#FFFBEB", border: "#FCD34D", icon: Warning, accent: "#D97706" },
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
            <XCircle size={14} weight="bold" />
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
            {deltaPositive ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
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
export function Inp({ label, placeholder, type, defaultValue, value, onChange, readOnly, mono: monoFont }: {
  label?: string; placeholder?: string; type?: string; defaultValue?: string;
  value?: string; onChange?: (e: { target: { value: string } }) => void;
  readOnly?: boolean; mono?: boolean;
}) {
  return (
    <div>
      {label && <label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{label}</label>}
      <input
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={e => onChange?.({ target: { value: e.target.value } })}
        readOnly={readOnly}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
        style={{ borderColor: BORDER, color: TEXT, fontFamily: monoFont ? "'JetBrains Mono', monospace" : undefined }}
      />
    </div>
  );
}
export function Sel({ label, options, value, onChange }: {
  label?: string; options: string[];
  value?: string; onChange?: (e: { target: { value: string } }) => void;
}) {
  return (
    <div>
      {label && <label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange?.({ target: { value: e.target.value } })}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
        style={{ borderColor: BORDER, color: TEXT }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// Gender-coded SVG avatar: blue for male, purple for female
export function Av({ gender = "M", size = 36 }: { gender?: "M" | "F"; size?: number }) {
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
export { DashboardMgmt, DashboardRole } from "./DashboardScreens";

export function ReservationGrid({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset, setOffset] = useState(0);
  const [filterType, setFilterType] = useState("All");
  const [filterFloor, setFilterFloor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  type ResEntry = typeof RES_GRID[0];
  const [selectedRes, setSelectedRes] = useState<{ room: string; res: ResEntry; dayIdx: number } | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(TODAY); d.setDate(TODAY.getDate() + offset + i); return d; });
  const DW = 58; const RH = 44;
  const todayIdx = days.findIndex(d => d.toDateString() === TODAY.toDateString());
  const allFloors = [...new Set(ROOMS.map(r => r.floor))].sort() as number[];

  const filteredRooms = ROOMS.filter(r => {
    if (filterType !== "All" && r.type !== filterType) return false;
    if (filterFloor !== "All" && r.floor !== Number(filterFloor)) return false;
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const roomRes = RES_GRID.filter(gr => gr.room === r.id);
      const matchGuest = roomRes.some(gr => gr.guest.toLowerCase().includes(q));
      if (!`room ${r.id}`.includes(q) && !r.type.toLowerCase().includes(q) && !matchGuest) return false;
    }
    return true;
  });

  const occPerDay = days.map((_, di) => {
    const adjDi = di + offset;
    const occupied = filteredRooms.filter(room => RES_GRID.some(r => r.room === room.id && r.start <= adjDi && r.end > adjDi)).length;
    return filteredRooms.length > 0 ? Math.round((occupied / filteredRooms.length) * 100) : 0;
  });

  const checkedIn = RES_GRID.filter(r => r.status === "Checked In").length;
  const arrivals = RES_GRID.filter(r => r.start === 0).length;

  const DetailPanel = () => {
    if (!selectedRes) return null;
    const { room, res } = selectedRes;
    const sc = resStC[res.status] ?? { bg: "#F3F4F6", text: "#374151" };
    const totalRate = res.rate * res.nights;
    const arrDate = new Date(TODAY); arrDate.setDate(TODAY.getDate() + res.start);
    const depDate = new Date(TODAY); depDate.setDate(TODAY.getDate() + res.end);
    return (
      <div className="w-64 flex-shrink-0 bg-white rounded-xl border overflow-hidden flex flex-col" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Reservation</span>
          <button onClick={() => setSelectedRes(null)} className="p-0.5 rounded hover:bg-gray-100">
            <XCircle size={13} style={{ color: MUTED }} weight="bold" />
          </button>
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Av size={36} />
            <div className="min-w-0">
              <div className="text-sm font-bold truncate" style={{ color: TEXT }}>{res.guest}</div>
              <div className="text-xs" style={{ color: MUTED }}>Room {room} · {res.nights}N</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-3" style={{ backgroundColor: sc.bg, color: sc.text }}>{res.status}</span>
          {[
            { label: "Booking ID",   value: res.id                                                              },
            { label: "Check-in",     value: arrDate.toLocaleDateString("en-NG",{ day:"numeric", month:"short", year:"numeric" }) },
            { label: "Check-out",    value: depDate.toLocaleDateString("en-NG",{ day:"numeric", month:"short", year:"numeric" }) },
            { label: "Nights",       value: String(res.nights)                                                  },
            { label: "Rate/Night",   value: `₦${res.rate.toLocaleString()}`                                     },
            { label: "Total",        value: `₦${totalRate.toLocaleString()}`                                    },
            { label: "Source",       value: res.source                                                          },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-1.5 border-b last:border-b-0 text-xs" style={{ borderColor: BORDER }}>
              <span style={{ color: MUTED }}>{row.label}</span>
              <span className="font-semibold text-right" style={{ color: TEXT }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: BORDER }}>
          <button onClick={() => { nav?.("reservation-detail", `${res.guest} — Rm ${room}`); setSelectedRes(null); }}
            className="w-full text-xs font-semibold py-2 rounded-lg text-white" style={{ backgroundColor: PRIMARY }}>
            Open Full Detail
          </button>
          <button onClick={() => { nav?.("check-in", "Check-In"); setSelectedRes(null); }}
            className="w-full text-xs font-semibold py-2 rounded-lg border" style={{ borderColor: BORDER, color: TEXT }}>
            Check In Guest
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="Reservation Grid" sub="14-day Gantt · Click empty cell to create · Click reservation bar for detail"
        actions={<><BtnO label="Today" icon={CalendarDots} onClick={() => setOffset(0)} /><BtnP label="New Reservation" icon={Plus} onClick={() => nav && nav("new-reservation","New Reservation")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Reservations" value={String(RES_GRID.length)} sub="All statuses" icon={CalendarDots} accent={PRIMARY} />
        <StatCard label="Checked In" value={String(checkedIn)} sub="In-house tonight" icon={ArrowLineDown} accent={SUCCESS} />
        <StatCard label="Arrivals Today" value={String(arrivals)} sub="Check in today" icon={ArrowLineDown} accent={TEAL} />
        <StatCard label="Occ. Today" value={`${occPerDay[todayIdx < 0 ? 0 : todayIdx] ?? 0}%`} sub="Filtered rooms" icon={Buildings} accent={ORANGE} />
      </div>
      <div className="flex gap-4">
        {/* Sidebar filters */}
        <div className="w-44 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: BORDER }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Search</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Guest or room…"
              className="w-full text-xs border rounded-lg px-2 py-1.5 outline-none" style={{ borderColor: BORDER, color: TEXT }} />
          </div>
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
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Legend</div>
            {[{ label:"Checked In", color:SUCCESS }, { label:"Confirmed", color:TEAL }, { label:"Pending", color:ORANGE }, { label:"Checked Out", color:SUBTLE }].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-xs mb-1.5" style={{ color: TEXT }}>
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: l.color }} />{l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <button onClick={() => setOffset(o => o - 7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}><CaretLeft size={13} weight="bold" />Prev 7</button>
            <span className="text-sm font-semibold" style={{ color: TEXT }}>
              {days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[13].toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}
            </span>
            <button onClick={() => setOffset(o => o + 7)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Next 7<CaretRight size={13} weight="bold" /></button>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 520 }}>
            <div style={{ minWidth: 200 + DW * 14 }}>
              {/* Header row */}
              <div className="flex sticky top-0 z-10" style={{ backgroundColor: "#F9FAFB", borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 flex items-center px-4 py-2" style={{ width: 200, borderRight: `1px solid ${BORDER}` }}>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Room · {filteredRooms.length}</span>
                </div>
                {days.map((d, i) => {
                  const isToday = i === todayIdx;
                  return (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center py-1.5" style={{ width: DW, borderRight: `1px solid ${BORDER}`, backgroundColor: isToday ? "#EFF6FF" : "transparent" }}>
                      <span className="text-xs font-semibold" style={{ color: isToday ? PRIMARY : TEXT }}>{d.toLocaleDateString("en-NG",{weekday:"short"})}</span>
                      <span className="text-xs" style={{ color: isToday ? PRIMARY : SUBTLE }}>{d.getDate()}/{d.getMonth()+1}</span>
                      {isToday && <span style={{ fontSize: 8, fontWeight: 800, color: PRIMARY, letterSpacing: "0.05em" }}>TODAY</span>}
                    </div>
                  );
                })}
              </div>

              {/* Room rows */}
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
                      {days.map((d, i) => {
                        const adjI = i + offset;
                        const isOccupied = res.some(r => r.start <= adjI && r.end > adjI);
                        const isToday = i === todayIdx;
                        return (
                          <div key={i} className="flex-shrink-0 border-r"
                            style={{ width: DW, height: RH, borderRightColor: "#F4F4F5",
                              backgroundColor: isToday ? "rgba(18,58,115,0.04)" : undefined,
                              cursor: isOccupied ? "default" : "pointer" }}
                            onClick={() => {
                              if (isOccupied) return;
                              if (nav) nav("new-reservation", "New Reservation");
                              else add({ type: "info", title: "New Reservation", body: `Room ${room.id} · ${d.toLocaleDateString("en-NG",{day:"numeric",month:"short"})}` });
                            }}
                            onMouseEnter={e => { if (!isOccupied) (e.currentTarget as HTMLElement).style.backgroundColor = "#EFF6FF"; }}
                            onMouseLeave={e => { if (!isOccupied) (e.currentTarget as HTMLElement).style.backgroundColor = isToday ? "rgba(18,58,115,0.04)" : ""; }}
                          />
                        );
                      })}
                      {res.map((r, ri) => {
                        const leftDay = r.start - offset;
                        const endDay  = r.end   - offset;
                        const visStart = Math.max(0, leftDay);
                        const visEnd   = Math.min(14, endDay);
                        if (visEnd <= 0 || visStart >= 14) return null;
                        const barLeft  = visStart * DW + 2;
                        const barWidth = (visEnd - visStart) * DW - 4;
                        const isSelected = selectedRes?.res.id === r.id && selectedRes?.room === room.id;
                        return (
                          <div key={ri}
                            className="absolute flex items-center gap-1.5 px-2 cursor-pointer rounded-md shadow-sm transition-opacity"
                            style={{ left: barLeft, width: barWidth, height: RH - 14, top: 7,
                              backgroundColor: r.color,
                              opacity: isSelected ? 1 : 0.9,
                              outline: isSelected ? `2px solid ${PRIMARY}` : "none",
                              outlineOffset: 1 }}
                            onClick={e => { e.stopPropagation(); setSelectedRes({ room: room.id, res: r, dayIdx: r.start }); }}>
                            <span className="text-white text-xs font-semibold truncate">{r.guest}</span>
                            {barWidth > 90 && <span className="text-white opacity-70 text-xs flex-shrink-0">{r.nights}N</span>}
                          </div>
                        );
                      })}
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

        {/* Detail side panel */}
        {selectedRes && <DetailPanel />}
      </div>
    </div>
  );
}

export function NewReservation({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState("");
  const [guestSearchQ, setGuestSearchQ] = useState("");
  const [showGuestResults, setShowGuestResults] = useState(false);
  const [manualRate, setManualRate] = useState(false);

  const [form, setForm] = useState({
    checkin: "2026-08-04", checkout: "2026-08-07",
    adults: "2", children: "0",
    roomType: "Deluxe", roomNumber: "",
    source: "Phone",
    ratePlan: "Standard Rate", nightlyRate: "55000",
    manualRateVal: "",
    guestName: "", phone: "", email: "",
    nationality: "Nigerian", company: "", vip: false,
    idType: "Passport", idNum: "",
    specialNotes: "",
    extras: [] as string[], transfer: false, flightNum: "",
    depositPct: "50", depositAmount: "", payMethod: "POS / Card",
    payRef: "",
    sendEmail: true, sendSMS: true, printRegCard: true,
  });

  const upd = (k: string, v: string | boolean | string[]) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const ROOM_OPTIONS: Record<string, string[]> = {
    Standard: ["101","102","104","204"],
    Deluxe:   ["103","201","202","302"],
    Suite:    ["203","301"],
  };
  const ROOM_PRICES: Record<string, number> = { Standard: 35000, Deluxe: 55000, Suite: 95000 };
  const ROOM_DESC: Record<string, string> = {
    Standard: "King bed · Courtyard view · 28 m²",
    Deluxe:   "King bed · Pool view · 38 m²",
    Suite:    "2 beds · Panoramic city & pool view · 68 m²",
  };

  const EXTRAS_CATALOG = [
    { name: "Champagne on Arrival",  price: 8500,  icon: Wine      },
    { name: "Fruit Basket",          price: 3500,  icon: Gift      },
    { name: "Extra Pillows",         price: 0,     icon: Bed },
    { name: "Breakfast Included",    price: 4500,  icon: Coffee    },
    { name: "Late Check-out (2 PM)", price: 15000, icon: Clock     },
    { name: "Airport Pick-up",       price: 12000, icon: Car       },
    { name: "Welcome Flowers",       price: 4000,  icon: Star      },
    { name: "Laundry Package",       price: 6000,  icon: Package   },
  ];

  const GUEST_SUGGESTIONS = ALL_RES.filter(r =>
    guestSearchQ.length >= 2 &&
    (r.guest.toLowerCase().includes(guestSearchQ.toLowerCase()) ||
     r.id.toLowerCase().includes(guestSearchQ.toLowerCase()))
  ).slice(0, 4);

  const nights = Math.max(1, Math.round(
    (new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000
  ));
  const baseRate = manualRate && form.manualRateVal
    ? Number(form.manualRateVal)
    : Number(form.nightlyRate) || ROOM_PRICES[form.roomType] || 55000;
  const extrasTotal = form.extras.reduce((s, ex) => {
    const cat = EXTRAS_CATALOG.find(e => e.name === ex);
    return s + (cat ? (cat.name === "Breakfast Included" ? cat.price * nights : cat.price) : 0);
  }, 0);
  const subtotal = baseRate * nights + extrasTotal;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  const depositAmt = form.depositAmount
    ? Number(form.depositAmount)
    : Math.round(total * Number(form.depositPct) / 100);

  const STEPS = ["Dates & Room", "Rate Plan", "Guest Details", "Extras", "Deposit", "Confirm"];
  const STEP_ICONS = [CalendarDots, CurrencyDollar, Users, Package, CreditCard, CheckCircle];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.checkin) errs.checkin = "Required";
      if (!form.checkout) errs.checkout = "Required";
      if (form.checkin && form.checkout && form.checkout <= form.checkin)
        errs.checkout = "Must be after check-in";
    }
    if (step === 3) {
      if (!form.guestName.trim()) errs.guestName = "Required";
      if (!form.phone.trim()) errs.phone = "Required";
      if (!form.idNum.trim()) errs.idNum = "Required";
    }
    if (step === 5 && Number(form.depositPct) > 0 && form.payMethod !== "Cash" && !form.payRef.trim())
      errs.payRef = "Reference required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const proceed = () => {
    if (!validate()) return;
    if (step === 6) {
      const id = `BK-${Math.floor(2881 + Math.random() * 100)}`;
      setConfirmedId(id);
      setConfirmed(true);
      add({ type: "success", title: "Reservation confirmed!", body: `${id} · ${form.guestName || "Guest"} · ${form.roomType}` });
      return;
    }
    setStep(s => s + 1);
  };

  // ── Mini-helpers ──────────────────────────────────────────────────────────
  const PASS_BG   = "#F9FAFB";
  const PASS_BORDER = "#E2E8F0";
  const PASS_MUTED  = "#64748B";
  const PASS_DASH   = "#CBD5E1";

  const PassNotch = () => (
    <div className="flex items-center" style={{ marginLeft: -1, marginRight: -1 }}>
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: `1.5px solid ${PASS_BORDER}`, marginLeft: -8 }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: PASS_DASH }} />
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: `1.5px solid ${PASS_BORDER}`, marginRight: -8 }} />
    </div>
  );

  const ErrMsg = ({ field }: { field: string }) => errors[field]
    ? <p className="flex items-center gap-1 mt-1.5 text-xs font-medium" style={{ color: ERROR }}><WarningCircle size={11} weight="bold" />{errors[field]}</p>
    : null;
  const SLabel = ({ children }: { children: string }) => (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PASS_MUTED, letterSpacing: "0.1em" }}>{children}</p>
  );
  const FLabel = ({ children, req }: { children: string; req?: boolean }) => (
    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED, letterSpacing: "0.08em" }}>
      {children}{req && <span style={{ color: ERROR }}> *</span>}
    </label>
  );
  const Input = ({ type = "text", value, onChange, placeholder, err, mono: isMono }: {
    type?: string; value: string; onChange: (v: string) => void; placeholder?: string; err?: boolean; mono?: boolean;
  }) => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
      style={{ borderColor: err ? ERROR : PASS_DASH, border: `1.5px solid ${err ? ERROR : PASS_DASH}`, backgroundColor: "white", fontFamily: isMono ? mono : undefined }} />
  );
  const Tog = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle} className="w-11 h-6 rounded-full relative flex-shrink-0 transition-colors"
      style={{ backgroundColor: on ? TEAL : PASS_DASH }}>
      <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all" style={{ left: on ? 22 : 2 }} />
    </button>
  );

  // ── Post-confirm ──────────────────────────────────────────────────────────
  if (confirmed) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
        <div className="px-8 py-10 text-center relative" style={{ backgroundColor: PRIMARY }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% -10%, ${TEAL}35 0%, transparent 60%)` }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${TEAL}22`, border: `1.5px solid ${TEAL}55` }}>
              <CheckCircle size={30} style={{ color: TEAL }} weight="bold" />
            </div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>Reservation Confirmed</p>
            <p className="text-3xl font-bold text-white mb-1.5" style={{ fontFamily: mono }}>{confirmedId}</p>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.72)" }}>
              {form.guestName || "Guest"} · {form.roomType}{form.roomNumber ? ` Rm ${form.roomNumber}` : ""}
            </p>
            <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.38)" }}>
              {form.checkin} → {form.checkout} · {nights}N · ₦{total.toLocaleString()} incl. VAT
            </p>
          </div>
        </div>
        <div className="bg-white px-6 pt-5 pb-6">
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {form.sendEmail && <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}><CheckCircle size={11} weight="bold" />Email sent</span>}
            {form.sendSMS   && <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}><CheckCircle size={11} weight="bold" />SMS sent</span>}
            {form.printRegCard && <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}><FileText size={11} weight="bold" />Reg card printing…</span>}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => nav?.("check-in","Check-In")} className="py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Check In Now</button>
            <button onClick={() => nav?.("reservation-detail", confirmedId)} className="py-3 rounded-xl text-sm font-bold border" style={{ borderColor: BORDER, color: TEXT }}>View Reservation</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => nav?.("reservation-grid","Reservation Grid")} className="py-2.5 rounded-xl text-xs font-medium border" style={{ borderColor: BORDER, color: MUTED }}>Back to Grid</button>
            <button onClick={() => { setConfirmed(false); setStep(1); setForm(f => ({ ...f, guestName:"", phone:"", email:"", idNum:"", extras:[], roomNumber:"", depositAmount:"", payRef:"", specialNotes:"" })); }}
              className="py-2.5 rounded-xl text-xs font-medium" style={{ color: MUTED }}>New Reservation</button>
          </div>
        </div>
      </div>
    </div>
  );

  const SIcon = STEP_ICONS[step - 1];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ backgroundColor: PASS_BG, border: `1.5px solid ${PASS_BORDER}` }}>
            <CaretLeft size={16} style={{ color: PASS_MUTED }} weight="bold" />
          </button>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED, letterSpacing: "0.1em" }}>Step {step} of 6 · {STEPS[step - 1]}</p>
          <h1 className="text-2xl font-bold leading-tight mt-0.5" style={{ color: TEXT }}>New Reservation</h1>
        </div>
      </div>

      {/* Boarding-pass step progress */}
      <div className="flex items-stretch gap-0 mb-6 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: PASS_BG }}>
        {([
          { label: "Dates & Room",  icon: CalendarDots  },
          { label: "Rate Plan",     icon: CurrencyDollar    },
          { label: "Guest Details", icon: UserCheck     },
          { label: "Extras",        icon: ShoppingCart  },
          { label: "Deposit",       icon: CreditCard    },
          { label: "Confirm",       icon: ClipboardText },
        ] as { label: string; icon: React.ElementType }[]).map(({ label, icon: SI }, i) => {
          const done   = i + 1 < step;
          const active = i + 1 === step;
          const clickable = done;
          return (
            <button key={i} disabled={!clickable}
              onClick={() => clickable && setStep(i + 1)}
              className="flex-1 flex flex-col items-center justify-center py-5 px-2 relative transition-all"
              style={{
                backgroundColor: active ? TEAL : done ? `${TEAL}18` : "transparent",
                borderRight: i < 5 ? `1px dashed ${PASS_DASH}` : undefined,
                cursor: clickable ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (clickable && !active) e.currentTarget.style.backgroundColor = `${TEAL}28`; }}
              onMouseLeave={e => { if (clickable && !active) e.currentTarget.style.backgroundColor = `${TEAL}18`; }}>

              {/* Top-right badge */}
              <div className="absolute top-2 right-2 flex flex-col items-end gap-0.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.25)" : done ? TEAL : PASS_BORDER, color: active ? "white" : done ? "white" : PASS_MUTED, fontSize: 9 }}>
                  {done ? <CheckCircle size={10} color="white" weight="bold" /> : i + 1}
                </div>
                {done && (
                  <span className="font-bold rounded" style={{ fontSize: 7, color: TEAL, letterSpacing: "0.06em" }}>EDIT</span>
                )}
              </div>

              <SI size={24} style={{ color: active ? "white" : done ? TEAL : PASS_MUTED }} />
              <p className="text-center mt-2 font-bold leading-tight" style={{ fontSize: 9, color: active ? "white" : done ? TEAL : PASS_MUTED, letterSpacing: "0.05em" }}>
                {label.toUpperCase()}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── Step Panel ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: PASS_BG, border: `1.5px solid ${PASS_BORDER}` }}>

            {/* Teal header band */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: TEAL }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60" style={{ letterSpacing: "0.1em" }}>Step {step} of 6</p>
                <p className="text-base font-bold text-white mt-0.5">{STEPS[step - 1]}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <SIcon size={17} color="white" />
              </div>
            </div>

            {/* Notch tear-off */}
            <PassNotch />

            <div className="p-6 space-y-6">

              {/* ── STEP 1: Dates & Room ────────────────────────────────── */}
              {step === 1 && (<>
                <section>
                  <SLabel>Stay Dates & Source</SLabel>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <FLabel>Check-In</FLabel>
                      <Input type="date" value={form.checkin} onChange={v => upd("checkin", v)} err={!!errors.checkin} />
                      <ErrMsg field="checkin" />
                    </div>
                    <div>
                      <FLabel>Check-Out</FLabel>
                      <Input type="date" value={form.checkout} onChange={v => upd("checkout", v)} err={!!errors.checkout} />
                      <ErrMsg field="checkout" />
                    </div>
                    <div>
                      <FLabel>Source</FLabel>
                      <select value={form.source} onChange={e => upd("source", e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl text-sm outline-none appearance-none" style={{ borderColor: BORDER }}>
                        {["Phone","Walk-in","Email","Online","OTA","Corporate","Direct"].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  {nights > 0 && form.checkout > form.checkin && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${TEAL}14`, color: TEAL }}>
                      <CalendarDots size={11} weight="bold" />{nights} night{nights !== 1 ? "s" : ""} selected
                    </div>
                  )}
                </section>

                <section>
                  <SLabel>Guests</SLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {([["Adults","adults",["1","2","3","4"]],["Children","children",["0","1","2","3"]]] as [string,string,string[]][]).map(([lbl,key,opts]) => (
                      <div key={key}>
                        <FLabel>{lbl}</FLabel>
                        <select value={(form as Record<string,string>)[key]} onChange={e => upd(key, e.target.value)}
                          className="w-full px-4 py-3 border rounded-xl text-sm outline-none appearance-none" style={{ borderColor: BORDER }}>
                          {opts.map(v => <option key={v}>{v}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <SLabel>Room Type</SLabel>
                  <div className="space-y-2.5">
                    {[{ type:"Standard",avail:4,price:35000 },{ type:"Deluxe",avail:4,price:55000 },{ type:"Suite",avail:2,price:95000 }].map(rt => {
                      const sel = form.roomType === rt.type;
                      return (
                        <button key={rt.type}
                          onClick={() => { upd("roomType", rt.type); upd("roomNumber", ""); upd("nightlyRate", String(rt.price)); }}
                          className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                          style={{ border: sel ? `2px solid ${TEAL}` : `1.5px dashed ${PASS_DASH}`, backgroundColor: sel ? `${TEAL}08` : "white" }}>
                          <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: sel ? TEAL : PASS_DASH }} />
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: sel ? `${TEAL}18` : "#F8FAFC" }}>
                            <Bed size={18} style={{ color: sel ? TEAL : MUTED }} weight="bold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm" style={{ color: sel ? TEAL : TEXT }}>{rt.type}</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{ROOM_DESC[rt.type]}</p>
                            <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}>{rt.avail} available</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold" style={{ color: sel ? TEAL : PRIMARY, fontFamily: mono }}>₦{rt.price.toLocaleString()}</p>
                            <p className="text-xs" style={{ color: MUTED }}>/night</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <SLabel>Assign Room (optional)</SLabel>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => upd("roomNumber", "")}
                      className="px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all"
                      style={{ borderColor: !form.roomNumber ? PRIMARY : BORDER, backgroundColor: !form.roomNumber ? "#EFF6FF" : "white", color: !form.roomNumber ? PRIMARY : MUTED }}>
                      Assign at check-in
                    </button>
                    {(ROOM_OPTIONS[form.roomType] ?? []).map(rn => (
                      <button key={rn} onClick={() => upd("roomNumber", rn)}
                        className="px-3.5 py-2 rounded-lg border text-xs font-bold transition-all"
                        style={{ borderColor: form.roomNumber === rn ? PRIMARY : BORDER, backgroundColor: form.roomNumber === rn ? "#EFF6FF" : "white", color: form.roomNumber === rn ? PRIMARY : TEXT }}>
                        Rm {rn}
                      </button>
                    ))}
                  </div>
                </section>
              </>)}

              {/* ── STEP 2: Rate Plan ───────────────────────────────────── */}
              {step === 2 && (<>
                <section>
                  <SLabel>Plans for {form.roomType}</SLabel>
                  <div className="space-y-2.5">
                    {RATE_PLANS.filter(r => r.active && r.rooms.includes(form.roomType)).map((plan, idx) => {
                      const sel = form.ratePlan === plan.name && !manualRate;
                      return (
                        <button key={plan.id}
                          onClick={() => { upd("ratePlan", plan.name); upd("nightlyRate", plan.base.toString()); setManualRate(false); }}
                          className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all"
                          style={{ border: sel ? `2px solid ${PRIMARY}` : `1.5px dashed ${PASS_DASH}`, backgroundColor: sel ? "#EFF6FF" : "white" }}>
                          <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: sel ? PRIMARY : PASS_DASH }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm" style={{ color: sel ? PRIMARY : TEXT }}>{plan.name}</span>
                              {idx === 0 && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${TEAL}18`, color: TEAL }}>Recommended</span>}
                            </div>
                            <p className="text-xs mt-1" style={{ color: MUTED }}>{plan.dates} · {plan.rooms.join(" · ")}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold" style={{ color: sel ? PRIMARY : TEXT, fontFamily: mono }}>₦{plan.base.toLocaleString()}</p>
                            <p className="text-xs" style={{ color: MUTED }}>/night</p>
                          </div>
                        </button>
                      );
                    })}

                    {/* Negotiated rate */}
                    <div className="p-4 rounded-xl border-2 transition-all"
                      style={{ borderColor: manualRate ? ORANGE : BORDER, backgroundColor: manualRate ? "#FFF7ED" : "white" }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm" style={{ color: manualRate ? ORANGE : TEXT }}>Negotiated / Override Rate</p>
                          <p className="text-xs mt-0.5" style={{ color: MUTED }}>Manager authorisation required</p>
                        </div>
                        <Tog on={manualRate} toggle={() => setManualRate(m => !m)} />
                      </div>
                      {manualRate && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: `${ORANGE}30` }}>
                          <span className="font-bold text-sm" style={{ color: MUTED }}>₦</span>
                          <input type="number" value={form.manualRateVal} onChange={e => upd("manualRateVal", e.target.value)}
                            placeholder="Enter nightly rate" className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none"
                            style={{ borderColor: BORDER, fontFamily: mono }} />
                          <span className="text-xs" style={{ color: MUTED }}>/night</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="p-5 rounded-xl" style={{ backgroundColor: "white", border: `1.5px dashed ${PASS_DASH}` }}>
                  <SLabel>Breakdown — {nights}N</SLabel>
                  <div className="space-y-2 text-sm">
                    {Array.from({ length: Math.min(nights, 3) }, (_, i) => (
                      <div key={i} className="flex justify-between">
                        <span style={{ color: MUTED }}>Night {i + 1}</span>
                        <span style={{ fontFamily: mono }}>₦{baseRate.toLocaleString()}</span>
                      </div>
                    ))}
                    {nights > 3 && <p className="text-xs" style={{ color: MUTED }}>…{nights - 3} more nights</p>}
                    <div className="border-t pt-3 mt-1 space-y-1.5" style={{ borderColor: BORDER }}>
                      <div className="flex justify-between"><span style={{ color: MUTED }}>Subtotal</span><span style={{ fontFamily: mono }}>₦{(baseRate * nights).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span style={{ color: MUTED }}>VAT 7.5%</span><span style={{ fontFamily: mono }}>₦{Math.round(baseRate * nights * 0.075).toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold text-base pt-1">
                        <span style={{ color: TEXT }}>Room Total</span>
                        <span style={{ color: PRIMARY, fontFamily: mono }}>₦{Math.round(baseRate * nights * 1.075).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>)}

              {/* ── STEP 3: Guest Details ───────────────────────────────── */}
              {step === 3 && (<>
                <section>
                  <SLabel><MagnifyingGlass size={13} style={{ display:"inline", marginRight:5, verticalAlign:"middle", color:TEAL }} weight="bold" />Returning Guest</SLabel>
                  <div className="relative">
                    <MagnifyingGlass size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SUBTLE }} weight="bold" />
                    <input value={guestSearchQ}
                      onChange={e => { setGuestSearchQ(e.target.value); setShowGuestResults(true); }}
                      onFocus={() => setShowGuestResults(true)}
                      placeholder="Type guest name or booking ID…"
                      className="pl-11 pr-4 py-3.5 w-full border-2 rounded-xl text-sm outline-none transition-colors"
                      style={{ borderColor: guestSearchQ.length >= 2 ? TEAL : BORDER }} />
                  </div>
                  {showGuestResults && GUEST_SUGGESTIONS.length > 0 && (
                    <div className="mt-1 rounded-xl border shadow-lg overflow-hidden bg-white" style={{ borderColor: BORDER }}>
                      {GUEST_SUGGESTIONS.map(g => (
                        <button key={g.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                          onClick={() => {
                            const first = g.guest.split(" ")[0].toLowerCase();
                            const last  = g.guest.split(" ").pop()?.toLowerCase() ?? "";
                            upd("guestName", g.guest);
                            upd("phone", `+234 80${g.id.slice(-1)} 000 ${g.id.slice(-4)}`);
                            upd("email", `${first}.${last}@example.com`);
                            upd("idNum", `NG${g.id.replace(/\D/g,"").slice(-8).padStart(8,"0")}`);
                            setGuestSearchQ(g.guest);
                            setShowGuestResults(false);
                            add({ type: "info", title: "Profile loaded", body: g.guest });
                          }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TEAL}18` }}>
                            <User size={16} style={{ color: TEAL }} weight="bold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</p>
                            <p className="text-xs truncate" style={{ color: MUTED }}>{g.id} · {g.checkin} – {g.checkout}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}>Returning</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs" style={{ color: MUTED }}>Or enter details below to register a new guest</p>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <div>
                    <FLabel req>Full Name</FLabel>
                    <Input value={form.guestName} onChange={v => upd("guestName",v)} placeholder="Chukwuemeka Bello" err={!!errors.guestName} />
                    <ErrMsg field="guestName" />
                  </div>
                  <div>
                    <FLabel req>Phone</FLabel>
                    <Input value={form.phone} onChange={v => upd("phone",v)} placeholder="+234 80x xxx xxxx" err={!!errors.phone} />
                    <ErrMsg field="phone" />
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <div>
                    <FLabel>Email</FLabel>
                    <Input type="email" value={form.email} onChange={v => upd("email",v)} placeholder="guest@example.com" />
                  </div>
                  <div>
                    <FLabel>Nationality</FLabel>
                    <select value={form.nationality} onChange={e => upd("nationality",e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm outline-none appearance-none" style={{ borderColor: BORDER }}>
                      {["Nigerian","Ghanaian","Kenyan","South African","British","American","Other"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <div>
                    <FLabel>ID Type</FLabel>
                    <select value={form.idType} onChange={e => upd("idType",e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm outline-none appearance-none" style={{ borderColor: BORDER }}>
                      {["Passport","National ID","Driver's Licence","NIN"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <FLabel req>ID Number</FLabel>
                    <Input value={form.idNum} onChange={v => upd("idNum",v)} placeholder="Document number" err={!!errors.idNum} mono />
                    <ErrMsg field="idNum" />
                  </div>
                </section>

                <section>
                  <FLabel>Company / Organisation</FLabel>
                  <Input value={form.company} onChange={v => upd("company",v)} placeholder="For corporate bookings" />
                </section>

                <section>
                  <FLabel>Special Requests</FLabel>
                  <textarea value={form.specialNotes} onChange={e => upd("specialNotes",e.target.value)}
                    placeholder="High floor, anniversary, allergies, dietary needs…"
                    rows={3} className="w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
                </section>

                <section className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
                  style={{ borderColor: form.vip ? ORANGE : BORDER, backgroundColor: form.vip ? "#FFF7ED" : "white" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: form.vip ? `${ORANGE}18` : "#F8FAFC" }}>
                      <Star size={16} style={{ color: form.vip ? ORANGE : MUTED }} weight="bold" />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: form.vip ? ORANGE : TEXT }}>VIP Guest</p>
                      <p className="text-xs" style={{ color: MUTED }}>Priority service · Amenity upgrades</p>
                    </div>
                  </div>
                  <Tog on={form.vip as boolean} toggle={() => upd("vip", !form.vip)} />
                </section>
              </>)}

              {/* ── STEP 4: Extras ──────────────────────────────────────── */}
              {step === 4 && (<>
                <section>
                  <SLabel>Add-ons & Services</SLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {EXTRAS_CATALOG.map(ex => {
                      const sel = form.extras.includes(ex.name);
                      const lp = ex.name === "Breakfast Included" ? ex.price * nights : ex.price;
                      const EI = ex.icon;
                      return (
                        <button key={ex.name}
                          onClick={() => upd("extras", sel ? form.extras.filter(e => e !== ex.name) : [...form.extras, ex.name])}
                          className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                          style={{ border: sel ? `2px solid ${TEAL}` : `1.5px dashed ${PASS_DASH}`, backgroundColor: sel ? `${TEAL}08` : "white" }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: sel ? `${TEAL}18` : "#F1F5F9" }}>
                            <EI size={16} style={{ color: sel ? TEAL : MUTED }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-tight" style={{ color: sel ? TEAL : TEXT }}>{ex.name}</p>
                            <p className="text-xs mt-0.5 font-medium" style={{ color: MUTED }}>
                              {lp === 0 ? "Complimentary" : `₦${lp.toLocaleString()}`}{ex.name === "Breakfast Included" && lp > 0 ? ` · ${nights}N` : ""}
                            </p>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                            style={{ borderColor: sel ? TEAL : "#CBD5E1", backgroundColor: sel ? TEAL : "transparent" }}>
                            {sel && <CheckCircle size={9} color="white" weight="bold" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {form.extras.length > 0 && (
                  <section className="p-4 rounded-xl" style={{ backgroundColor: `${TEAL}08`, border: `1.5px solid ${TEAL}28` }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: TEAL }}>Selected · {form.extras.length} add-on{form.extras.length !== 1 ? "s" : ""}</p>
                    {form.extras.map(ex => {
                      const cat = EXTRAS_CATALOG.find(e => e.name === ex);
                      const lp = cat ? (cat.name === "Breakfast Included" ? cat.price * nights : cat.price) : 0;
                      return (
                        <div key={ex} className="flex justify-between text-xs mb-1.5">
                          <span style={{ color: TEXT }}>{ex}</span>
                          <span style={{ color: TEAL, fontFamily: mono }}>{lp === 0 ? "Free" : `₦${lp.toLocaleString()}`}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-bold text-sm border-t pt-2 mt-1" style={{ borderColor: `${TEAL}28` }}>
                      <span style={{ color: TEAL }}>Extras Total</span>
                      <span style={{ color: TEAL, fontFamily: mono }}>₦{extrasTotal.toLocaleString()}</span>
                    </div>
                  </section>
                )}

                <section className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
                  style={{ borderColor: form.transfer ? TEAL : BORDER, backgroundColor: form.transfer ? `${TEAL}08` : "white" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: form.transfer ? `${TEAL}18` : "#F8FAFC" }}>
                      <Truck size={16} style={{ color: form.transfer ? TEAL : MUTED }} weight="bold" />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: form.transfer ? TEAL : TEXT }}>Airport Transfer</p>
                      <p className="text-xs" style={{ color: MUTED }}>Driver at arrivals · ₦12,000</p>
                    </div>
                  </div>
                  <Tog on={form.transfer as boolean} toggle={() => upd("transfer", !form.transfer)} />
                </section>
                {form.transfer && (
                  <section>
                    <FLabel>Flight Number</FLabel>
                    <Input value={form.flightNum} onChange={v => upd("flightNum",v)} placeholder="e.g. QR 1401" mono />
                  </section>
                )}
              </>)}

              {/* ── STEP 5: Deposit ─────────────────────────────────────── */}
              {step === 5 && (<>
                <section>
                  <SLabel>Deposit Percentage</SLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {["0","25","50","100"].map(pct => (
                      <button key={pct} onClick={() => { upd("depositPct", pct); upd("depositAmount",""); }}
                        className="py-3 rounded-xl text-sm font-bold border-2 transition-all"
                        style={{ borderColor: form.depositPct === pct ? PRIMARY : BORDER, backgroundColor: form.depositPct === pct ? "#EFF6FF" : "white", color: form.depositPct === pct ? PRIMARY : TEXT }}>
                        {pct === "0" ? "None" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Big deposit display */}
                <section className="rounded-2xl p-6 text-center" style={{ backgroundColor: PRIMARY }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>Deposit Due</p>
                  <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: mono }}>₦{depositAmt.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{form.depositPct}% of ₦{total.toLocaleString()} total</p>
                  <div className="flex justify-center gap-6 mt-3 text-xs">
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Room ₦{(baseRate * nights).toLocaleString()}</span>
                    {extrasTotal > 0 && <span style={{ color: TEAL }}>Extras ₦{extrasTotal.toLocaleString()}</span>}
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>VAT ₦{vat.toLocaleString()}</span>
                  </div>
                </section>

                <section>
                  <FLabel>Override Deposit Amount (optional)</FLabel>
                  <Input type="number" value={form.depositAmount} onChange={v => upd("depositAmount",v)}
                    placeholder={`Blank = auto ₦${Math.round(total * Number(form.depositPct) / 100).toLocaleString()}`} mono />
                </section>

                {Number(form.depositPct) > 0 && (<>
                  <section>
                    <SLabel>Payment Method</SLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {["Cash","POS / Card","Bank Transfer"].map(m => (
                        <button key={m} onClick={() => upd("payMethod", m)}
                          className="py-3 rounded-xl text-xs font-bold border-2 transition-all"
                          style={{ borderColor: form.payMethod === m ? PRIMARY : BORDER, backgroundColor: form.payMethod === m ? "#EFF6FF" : "white", color: form.payMethod === m ? PRIMARY : TEXT }}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </section>
                  {form.payMethod !== "Cash" && (
                    <section>
                      <FLabel req>{form.payMethod === "POS / Card" ? "POS Terminal Reference" : "Bank Transfer Reference"}</FLabel>
                      <Input value={form.payRef} onChange={v => upd("payRef",v)}
                        placeholder={form.payMethod === "POS / Card" ? "POS-00124381" : "NGBT-20260801-0042"}
                        err={!!errors.payRef} mono />
                      <ErrMsg field="payRef" />
                    </section>
                  )}
                </>)}
              </>)}

              {/* ── STEP 6: Confirm ─────────────────────────────────────── */}
              {step === 6 && (<>
                <div className="space-y-3">
                  {([
                    { title:"Dates & Room", icon: CalendarDots, items:[
                      ["Check-In",form.checkin],["Check-Out",form.checkout],["Nights",String(nights)],
                      ["Room",`${form.roomType}${form.roomNumber ? ` · Rm ${form.roomNumber}` : ""}`],
                      ["Guests",`${form.adults}A · ${form.children}C`],["Source",form.source],
                    ] as [string,string][] },
                    { title:"Rate", icon: CurrencyDollar, items:[
                      ["Plan", manualRate ? "Negotiated" : form.ratePlan],
                      ["Rate/Night",`₦${baseRate.toLocaleString()}`],
                      ["Subtotal",`₦${(baseRate*nights).toLocaleString()}`],
                      ...(extrasTotal > 0 ? [["Extras",`₦${extrasTotal.toLocaleString()}`] as [string,string]] : []),
                      ["VAT 7.5%",`₦${vat.toLocaleString()}`],["Total",`₦${total.toLocaleString()}`],
                    ] as [string,string][] },
                    { title:"Guest", icon: Users, items:[
                      ["Name",form.guestName||"–"],["Phone",form.phone||"–"],
                      ["Email",form.email||"–"],["Nationality",form.nationality],
                      ["ID",`${form.idType}: ${form.idNum||"–"}`],
                      ...(form.company ? [["Company",form.company] as [string,string]] : []),
                      ...(form.vip ? [["VIP","Yes ★"] as [string,string]] : []),
                    ] as [string,string][] },
                    { title:"Extras", icon: Package, items: form.extras.length > 0
                      ? form.extras.map(e => {
                          const cat = EXTRAS_CATALOG.find(x => x.name === e);
                          const lp = cat ? (cat.name==="Breakfast Included" ? cat.price*nights : cat.price) : 0;
                          return [e, lp === 0 ? "Free" : `₦${lp.toLocaleString()}`] as [string,string];
                        })
                      : [["None selected",""] as [string,string]] },
                    { title:"Payment", icon: CreditCard, items:[
                      ["Deposit",`₦${depositAmt.toLocaleString()} (${form.depositPct}%)`],
                      ["Method", Number(form.depositPct) > 0 ? form.payMethod : "No deposit"],
                      ...(form.payRef ? [["Ref",form.payRef] as [string,string]] : []),
                    ] as [string,string][] },
                  ] as { title:string; icon: typeof CalendarDots; items:[string,string][] }[]).map(sec => {
                    const SI = sec.icon;
                    return (
                      <div key={sec.title} className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${PASS_BORDER}` }}>
                        <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: TEAL }}>
                          <SI size={12} color="white" style={{ opacity: 0.8 }} />
                          <p className="text-xs font-bold uppercase tracking-wider text-white" style={{ opacity: 0.9 }}>{sec.title}</p>
                        </div>
                        <PassNotch />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3" style={{ backgroundColor: PASS_BG }}>
                          {sec.items.map(([k,v]) => (
                            <div key={k}>
                              <p className="text-xs font-bold uppercase" style={{ color: PASS_MUTED, letterSpacing: "0.06em" }}>{k}</p>
                              <p className="text-xs font-semibold mt-0.5" style={{ color: TEXT }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <section className="p-4 rounded-xl" style={{ border: `1.5px dashed ${PASS_DASH}`, backgroundColor: "white" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PASS_MUTED, letterSpacing: "0.1em" }}>Notifications & Documents</p>
                  <div className="space-y-3">
                    {([
                      ["sendEmail","Send confirmation email"],
                      ["sendSMS","Send SMS confirmation"],
                      ["printRegCard","Print registration card"],
                    ] as [keyof typeof form, string][]).map(([key,label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: TEXT }}>{label}</span>
                        <Tog on={form[key] as boolean} toggle={() => upd(key, !form[key])} />
                      </div>
                    ))}
                  </div>
                </section>
              </>)}

            </div>
          </div>
        </div>

        {/* ── Boarding-Pass Summary ───────────────────────────────────────── */}
        <div className="sticky top-4">

          {/* Pass body */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "#F9FAFB", border: `1.5px solid #E2E8F0` }}>

            {/* Teal header band */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: TEAL }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60" style={{ letterSpacing: "0.12em" }}>Summary</p>
                <p className="text-lg font-bold text-white mt-0.5">{form.guestName || "New Guest"}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Bed size={17} color="white" weight="bold" />
              </div>
            </div>

            {/* Guest status row */}
            <div className="px-5 pt-3 pb-3 flex items-center justify-between" style={{ borderBottom: "1.5px dashed #CBD5E1" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: form.guestName ? (form.vip ? `${ORANGE}18` : `${TEAL}18`) : "#F1F5F9" }}>
                  <User size={15} style={{ color: form.guestName ? (form.vip ? ORANGE : TEAL) : SUBTLE }} weight="bold" />
                </div>
                <span className="text-xs font-semibold" style={{ color: form.guestName ? TEXT : SUBTLE }}>
                  {form.guestName || "Guest name pending"}
                </span>
              </div>
              {form.vip && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ORANGE}18`, color: ORANGE }}>★ VIP</span>}
              {!form.guestName && <span className="text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EFF6FF", color: PRIMARY, fontSize: 9 }}>STEP 3</span>}
            </div>

            {/* Notch cutout row */}
            <div className="flex items-center" style={{ marginLeft: -1, marginRight: -1 }}>
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: "1.5px solid #E2E8F0", marginLeft: -8 }} />
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "#CBD5E1" }} />
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: "1.5px solid #E2E8F0", marginRight: -8 }} />
            </div>

            {/* Stay grid — 2-up like boarding pass fields */}
            <div className="px-5 pt-3 pb-4 grid grid-cols-2 gap-x-4 gap-y-3" style={{ borderBottom: "1.5px dashed #CBD5E1" }}>
              {([
                ["CHECK-IN",  form.checkin],
                ["CHECK-OUT", form.checkout],
                ["ROOM TYPE", form.roomType],
                ["ROOM NO",   form.roomNumber || "TBA"],
                ["NIGHTS",    String(nights)],
                ["GUESTS",    `${form.adults}A · ${form.children}C`],
              ] as [string,string][]).map(([k,v]) => (
                <div key={k}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#64748B", letterSpacing: "0.1em" }}>{k}</p>
                  <p className="font-bold text-sm" style={{ color: TEXT, fontFamily: k === "CHECK-IN" || k === "CHECK-OUT" ? mono : undefined }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Pricing section */}
            <div className="px-5 py-4 space-y-2 text-sm" style={{ borderBottom: "1.5px dashed #CBD5E1" }}>
              <div className="flex justify-between">
                <span style={{ color: "#64748B" }}>Room × {nights}N</span>
                <span style={{ color: TEXT, fontFamily: mono }}>₦{(baseRate * nights).toLocaleString()}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#64748B" }}>Extras ({form.extras.length})</span>
                  <span style={{ color: TEAL, fontFamily: mono }}>₦{extrasTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: "#64748B" }}>VAT 7.5%</span>
                <span style={{ color: TEXT, fontFamily: mono }}>₦{vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 mt-1" style={{ borderTop: "1px solid #E2E8F0" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>Total</span>
                <span className="text-lg font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{total.toLocaleString()}</span>
              </div>
              {Number(form.depositPct) > 0 && (
                <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: `${TEAL}10` }}>
                  <span className="text-xs font-medium" style={{ color: TEAL }}>Deposit {form.depositPct}% due</span>
                  <span className="text-sm font-bold" style={{ color: TEAL, fontFamily: mono }}>₦{depositAmt.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Extras tags */}
            {form.extras.length > 0 && (
              <div className="px-5 py-3" style={{ borderBottom: "1.5px dashed #CBD5E1" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#64748B" }}>Add-ons</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.extras.map(ex => (
                    <span key={ex} className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `${TEAL}12`, color: TEAL, border: `1px solid ${TEAL}28` }}>{ex}</span>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code stub */}
            <div className="px-5 py-4 flex items-center gap-4" style={{ backgroundColor: "#F1F5F9" }}>
              {/* QR graphic */}
              <div className="flex-shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* White background */}
                  <rect width="72" height="72" rx="6" fill="white"/>
                  {/* Finder TL */}
                  <rect x="2" y="2" width="20" height="20" rx="3" fill={PRIMARY}/>
                  <rect x="5" y="5" width="14" height="14" rx="1.5" fill="white"/>
                  <rect x="8" y="8" width="8" height="8" rx="1" fill={PRIMARY}/>
                  {/* Finder TR */}
                  <rect x="50" y="2" width="20" height="20" rx="3" fill={PRIMARY}/>
                  <rect x="53" y="5" width="14" height="14" rx="1.5" fill="white"/>
                  <rect x="56" y="8" width="8" height="8" rx="1" fill={PRIMARY}/>
                  {/* Finder BL */}
                  <rect x="2" y="50" width="20" height="20" rx="3" fill={PRIMARY}/>
                  <rect x="5" y="53" width="14" height="14" rx="1.5" fill="white"/>
                  <rect x="8" y="56" width="8" height="8" rx="1" fill={PRIMARY}/>
                  {/* Timing strip H */}
                  {[26,30,34,38,42].map((x, i) => i%2===0 && <rect key={x} x={x} y="24" width="3" height="3" rx="0.5" fill={PRIMARY} opacity="0.7"/>)}
                  {/* Timing strip V */}
                  {[26,30,34,38,42].map((y, i) => i%2===0 && <rect key={y} x="24" y={y} width="3" height="3" rx="0.5" fill={PRIMARY} opacity="0.7"/>)}
                  {/* Data modules */}
                  {[
                    [26,26],[30,26],[38,26],[42,26],
                    [26,30],[34,30],[42,30],
                    [28,34],[32,34],[36,34],[40,34],
                    [26,38],[30,38],[38,38],
                    [28,42],[34,42],[38,42],[42,42],
                    [50,26],[54,26],[58,26],[62,26],
                    [50,30],[58,30],[62,30],
                    [52,34],[56,34],[60,34],
                    [50,38],[54,38],[62,38],
                    [52,42],[56,42],[60,42],
                    [26,50],[30,50],[34,50],[42,50],
                    [26,54],[34,54],[38,54],
                    [28,58],[32,58],[36,58],[40,58],
                    [26,62],[30,62],[38,62],[42,62],
                  ].map(([x,y]) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill={PRIMARY} opacity="0.9"/>
                  ))}
                </svg>
              </div>
              {/* Label */}
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PASS_MUTED, fontSize: 9, letterSpacing: "0.1em" }}>Scan to verify</p>
                <p className="font-bold text-xs leading-snug truncate" style={{ color: PRIMARY, fontFamily: mono }}>
                  {form.guestName ? form.guestName.toUpperCase() : "PENDING GUEST"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: PASS_MUTED, fontFamily: mono }}>
                  {form.roomType.toUpperCase()}{form.roomNumber ? ` · RM ${form.roomNumber}` : ""} · {form.checkin}
                </p>
              </div>
            </div>
          </div>

          {/* CTA below the pass */}
          <div className="mt-3 space-y-2">
            <button onClick={proceed}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              style={{ backgroundColor: step === 6 ? SUCCESS : TEAL, color: "white" }}>
              {step === 6
                ? <><CheckCircle size={15} weight="bold" /> Confirm Reservation</>
                : <>{STEPS[step]} <ArrowRight size={14} weight="bold" /></>}
            </button>
            {step === 6 && (
              <button onClick={() => add({ type: "info", title: "Saved as draft" })}
                className="w-full py-2 text-xs text-center rounded-xl border bg-white hover:bg-gray-50 transition-colors"
                style={{ borderColor: BORDER, color: MUTED }}>
                Save as Draft
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
export function CheckOut({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type ChargeRow = { date: string; cat: string; desc: string; qty: number; unit: number; amount: number; by: string; tax: number; reversed: boolean };

  const ALL_GUESTS = [
    // Due today
    { id: "BK-2848", guest: "Emmanuel Adeyemi",  av: "EA", room: "202", type: "Deluxe",   nights: 2, checkin: "23 Jun", checkout: "25 Jun", deposit: 55000, vip: false, phone: "+234 802 333 4444", visits: 3,  dueToday: true  },
    { id: "BK-2846", guest: "Adaeze Okonkwo",    av: "AO", room: "101", type: "Deluxe",   nights: 3, checkin: "22 Jun", checkout: "25 Jun", deposit: 55000, vip: true,  phone: "+234 803 111 2222", visits: 5,  dueToday: true  },
    { id: "BK-2850", guest: "Ibrahim Sule",       av: "IS", room: "304", type: "Standard", nights: 1, checkin: "24 Jun", checkout: "25 Jun", deposit: 35000, vip: false, phone: "+234 805 555 6666", visits: 1,  dueToday: true  },
    // In-house (early checkout candidates)
    { id: "BK-2843", guest: "Fatima Musa",        av: "FM", room: "203", type: "Suite",    nights: 5, checkin: "22 Jun", checkout: "27 Jun", deposit: 80000, vip: true,  phone: "+234 802 777 8888", visits: 8,  dueToday: false },
    { id: "BK-2845", guest: "Ibrahim Lawal",      av: "IL", room: "302", type: "Deluxe",   nights: 3, checkin: "23 Jun", checkout: "26 Jun", deposit: 55000, vip: false, phone: "+234 806 222 3333", visits: 2,  dueToday: false },
    { id: "BK-2851", guest: "Dr. Emeka Bello",   av: "EB", room: "501", type: "Suite",    nights: 4, checkin: "24 Jun", checkout: "28 Jun", deposit: 80000, vip: true,  phone: "+234 803 999 1111", visits: 12, dueToday: false },
  ];

  const BASE_CHARGES: Record<string, ChargeRow[]> = {
    "BK-2848": [
      { date: "23 Jun", cat: "Room",       desc: "Deluxe Room 202 × 2 nights",   qty: 2, unit: 55000, amount: 110000, by: "System",   tax: 8250,  reversed: false },
      { date: "23 Jun", cat: "Restaurant", desc: "Room Service #RS-041",          qty: 1, unit: 8500,  amount: 8500,   by: "John A.",  tax: 638,   reversed: false },
      { date: "24 Jun", cat: "Bar",        desc: "Minibar — 2× Water, 1× Juice", qty: 3, unit: 1200,  amount: 3600,   by: "System",   tax: 270,   reversed: false },
      { date: "24 Jun", cat: "Laundry",    desc: "Express laundry — 3 items",    qty: 3, unit: 2000,  amount: 6000,   by: "HK Staff", tax: 450,   reversed: false },
    ],
    "BK-2846": [
      { date: "22 Jun", cat: "Room",       desc: "Deluxe Room 101 × 3 nights",   qty: 3, unit: 55000, amount: 165000, by: "System",   tax: 12375, reversed: false },
      { date: "23 Jun", cat: "Restaurant", desc: "Breakfast × 2 pax",            qty: 1, unit: 6000,  amount: 6000,   by: "F&B",      tax: 450,   reversed: false },
    ],
    "BK-2850": [
      { date: "24 Jun", cat: "Room",       desc: "Standard Room 304 × 1 night",  qty: 1, unit: 35000, amount: 35000,  by: "System",   tax: 2625,  reversed: false },
      { date: "24 Jun", cat: "Bar",        desc: "Minibar consumption",           qty: 1, unit: 4500,  amount: 4500,   by: "System",   tax: 338,   reversed: false },
    ],
    "BK-2843": [
      { date: "22 Jun", cat: "Room",       desc: "Suite Room 203 × 5 nights",    qty: 5, unit: 85000, amount: 425000, by: "System",   tax: 31875, reversed: false },
      { date: "23 Jun", cat: "Restaurant", desc: "In-room dining × 3 meals",     qty: 3, unit: 12000, amount: 36000,  by: "F&B",      tax: 2700,  reversed: false },
      { date: "24 Jun", cat: "Laundry",    desc: "Same-day laundry — VIP",       qty: 1, unit: 8000,  amount: 8000,   by: "HK Staff", tax: 600,   reversed: false },
    ],
    "BK-2845": [
      { date: "23 Jun", cat: "Room",       desc: "Deluxe Room 302 × 3 nights",   qty: 3, unit: 55000, amount: 165000, by: "System",   tax: 12375, reversed: false },
      { date: "24 Jun", cat: "Bar",        desc: "Minibar — assorted",            qty: 1, unit: 5200,  amount: 5200,   by: "System",   tax: 390,   reversed: false },
    ],
    "BK-2851": [
      { date: "24 Jun", cat: "Room",       desc: "Suite Room 501 × 4 nights",    qty: 4, unit: 85000, amount: 340000, by: "System",   tax: 25500, reversed: false },
      { date: "24 Jun", cat: "Restaurant", desc: "Welcome dinner — VIP",          qty: 1, unit: 25000, amount: 25000,  by: "F&B",      tax: 1875,  reversed: false },
    ],
  };

  const [selectedId, setSelectedId]         = useState("BK-2848");
  const g = ALL_GUESTS.find(d => d.id === selectedId) ?? ALL_GUESTS[0];

  const [chargesMap, setChargesMap]         = useState<Record<string, ChargeRow[]>>(BASE_CHARGES);
  const [checkedOutIds, setCheckedOutIds]   = useState<string[]>([]);
  const [payMethod, setPayMethod]           = useState("Cash");
  const [cashAmt, setCashAmt]               = useState("");
  const [cardAmt, setCardAmt]               = useState("");
  const [bankRef, setBankRef]               = useState("");
  const [voidLine, setVoidLine]             = useState<number | null>(null);
  const [voidReason, setVoidReason]         = useState("");
  const [showDiscount, setShowDiscount]     = useState(false);
  const [discountAmt, setDiscountAmt]       = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [managerPin, setManagerPin]         = useState("");
  const [discountMap, setDiscountMap]       = useState<Record<string, number>>({});
  const [showLateCharge, setShowLateCharge] = useState(false);
  const [lateChargeCat, setLateChargeCat]   = useState("Bar");
  const [lateChargeDesc, setLateChargeDesc] = useState("");
  const [lateChargeAmt, setLateChargeAmt]   = useState("");
  const [accessRevoked, setAccessRevoked]   = useState<Record<string, boolean>>({});
  const [keyReturned, setKeyReturned]       = useState<Record<string, boolean>>({});
  const [feedbackSent, setFeedbackSent]     = useState<Record<string, boolean>>({});
  const [guestSearch, setGuestSearch]       = useState("");

  const charges    = chargesMap[selectedId] ?? [];
  const setCharges = (fn: (p: ChargeRow[]) => ChargeRow[]) =>
    setChargesMap(m => ({ ...m, [selectedId]: fn(m[selectedId] ?? []) }));

  const isCheckedOut = checkedOutIds.includes(selectedId);
  const gDiscount    = discountMap[selectedId] ?? 0;
  const gAccess      = accessRevoked[selectedId] ?? false;
  const gKey         = keyReturned[selectedId]   ?? false;
  const gFeedback    = feedbackSent[selectedId]  ?? false;

  const subtotal     = charges.filter(c => !c.reversed).reduce((s, c) => s + c.amount, 0);
  const taxTotal     = charges.filter(c => !c.reversed).reduce((s, c) => s + c.tax, 0);
  const grand        = subtotal + taxTotal;
  const balance      = Math.max(0, grand - g.deposit - gDiscount);
  const cashNum      = parseInt(cashAmt.replace(/,/g, "")) || 0;
  const cardNum      = parseInt(cardAmt.replace(/,/g, "")) || 0;
  const totalReceived =
    payMethod === "Cash"       ? cashNum :
    payMethod === "POS / Card" ? cardNum :
    payMethod === "Cash + POS" ? cashNum + cardNum : balance;
  const changeAmt    = Math.max(0, totalReceived - balance);
  const balanceCovered =
    balance === 0 ||
    payMethod === "Corporate Account" ||
    (payMethod === "Bank Transfer" && !!bankRef.trim()) ||
    totalReceived >= balance;
  const canCheckOut  = balanceCovered && gAccess && gKey && !isCheckedOut;

  const catColor: Record<string, string> = { Room: PRIMARY, Restaurant: TEAL, Bar: ORANGE, Laundry: MUTED, "Late Charge": ERROR };

  const CK_BG  = "#F9FAFB";
  const CK_BD  = "#E2E8F0";
  const CK_DSH = "#CBD5E1";
  const CK_MUT = "#64748B";

  const Notch = () => (
    <div className="flex items-center px-5" style={{ margin: "-1px 0", position: "relative", zIndex: 2, backgroundColor: CK_BG }}>
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "white", border: `1.5px solid ${CK_BD}`, marginLeft: -8 }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: CK_DSH }} />
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "white", border: `1.5px solid ${CK_BD}`, marginRight: -8 }} />
    </div>
  );

  // ── POST-CHECKOUT SUCCESS STATE ─────────────────────────────────────────
  if (isCheckedOut) return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CK_MUT, letterSpacing: "0.1em" }}>Check-Out · 25 Jun 2025</p>
          <h1 className="text-2xl font-bold mt-0.5" style={{ color: TEXT }}>Guest Check-Out</h1>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: PRIMARY }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>Check-Out Complete · {g.id}</p>
            <p className="text-base font-bold text-white mt-0.5">{g.guest} · Room {g.room}</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <CheckCircle size={18} color="white" weight="bold" />
          </div>
        </div>
        <Notch />
        <div className="p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#D1FAE5" }}>
            <CheckCircle size={32} weight="bold" style={{ color: SUCCESS }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: CK_MUT }}>Room Released</p>
          <p className="text-2xl font-bold mb-1" style={{ color: TEXT }}>{g.guest}</p>
          <p className="text-sm mb-3" style={{ color: CK_MUT }}>Room {g.room} · {g.type} · {g.nights} night{g.nights !== 1 ? "s" : ""}</p>
          <p className="text-xs mb-6 px-4 py-2 rounded-xl inline-block font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
            Folio closed · Room {g.room} queued for housekeeping · Access revoked
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
            {([["Print Invoice", FileText], ["Email Invoice", Envelope], ["Print Reg. Card", ClipboardText], ["Guest Portal", Globe]] as [string, typeof FileText][]).map(([l, Ic]) => (
              <button key={l} onClick={() => add({ type: "success", title: l })}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:shadow-md"
                style={{ border: `1.5px dashed ${CK_DSH}`, backgroundColor: "white" }}>
                <Ic size={20} style={{ color: PRIMARY }} />
                <span className="text-xs font-semibold text-center" style={{ color: TEXT }}>{l}</span>
              </button>
            ))}
          </div>
          <button onClick={() => {
            setCheckedOutIds(p => p.filter(id => id !== selectedId));
            const remaining = ALL_GUESTS.filter(d => !checkedOutIds.includes(d.id) && d.id !== selectedId && d.dueToday);
            if (remaining.length > 0) setSelectedId(remaining[0].id);
          }} className="text-sm px-6 py-2.5 rounded-xl font-bold text-white" style={{ backgroundColor: PRIMARY }}>
            Next Guest
          </button>
        </div>
      </div>
    </div>
  );

  // ── MAIN CHECKOUT VIEW ──────────────────────────────────────────────────
  const q = guestSearch.toLowerCase();
  const filteredDue = ALL_GUESTS.filter(d => d.dueToday && (!q || d.guest.toLowerCase().includes(q) || d.room.includes(q)));
  const filteredIH  = ALL_GUESTS.filter(d => !d.dueToday && (!q || d.guest.toLowerCase().includes(q) || d.room.includes(q)));

  const GuestRow = ({ d }: { d: typeof ALL_GUESTS[0] }) => {
    const active = d.id === selectedId;
    const done   = checkedOutIds.includes(d.id);
    return (
      <button onClick={() => { setSelectedId(d.id); setPayMethod("Cash"); setCashAmt(""); setCardAmt(""); setBankRef(""); }}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl mb-0.5 text-left transition-all relative"
        style={{ backgroundColor: done ? `${SUCCESS}10` : active ? PRIMARY : "transparent" }}>
        {done && <div className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: SUCCESS }}><CheckCircle size={9} color="white" weight="bold" /></div>}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: done ? SUCCESS : d.vip ? ORANGE : (active ? "rgba(255,255,255,0.3)" : PRIMARY) }}>{d.av}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold truncate leading-tight" style={{ color: active ? "white" : done ? SUCCESS : TEXT }}>{d.guest}</p>
          <p className="text-xs truncate leading-tight" style={{ color: active ? "rgba(255,255,255,0.6)" : CK_MUT }}>Rm {d.room} · {d.checkout}</p>
        </div>
        {d.vip && !done && <span className="text-xs font-bold flex-shrink-0" style={{ color: active ? "rgba(255,255,255,0.65)" : ORANGE, fontSize: 9 }}>VIP</span>}
      </button>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CK_MUT, letterSpacing: "0.1em" }}>Check-Out & Settlement · 25 Jun 2025</p>
          <h1 className="text-2xl font-bold mt-0.5" style={{ color: TEXT }}>Guest Check-Out</h1>
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── GUEST LIST PANEL ── */}
        <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-sm" style={{ width: 232, backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
          <div className="px-4 py-3.5" style={{ backgroundColor: PRIMARY }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>In-House</p>
            <p className="text-sm font-bold text-white mt-0.5">{ALL_GUESTS.length} guests · 25 Jun</p>
          </div>
          <div className="p-2.5 border-b" style={{ borderColor: CK_BD }}>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
              <MagnifyingGlass size={12} style={{ color: CK_MUT }} />
              <input value={guestSearch} onChange={e => setGuestSearch(e.target.value)} placeholder="Name or room…"
                className="flex-1 text-xs outline-none bg-transparent" style={{ color: TEXT }} />
              {guestSearch && <button onClick={() => setGuestSearch("")} style={{ color: CK_MUT }}><XCircle size={12} /></button>}
            </div>
          </div>
          <div className="p-2.5 overflow-y-auto" style={{ maxHeight: 520 }}>
            {filteredDue.length > 0 && (
              <>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="font-bold uppercase" style={{ color: ERROR, fontSize: 9, letterSpacing: "0.1em" }}>Due Today</span>
                  <span className="font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${ERROR}15`, color: ERROR, fontSize: 9 }}>{filteredDue.length}</span>
                </div>
                {filteredDue.map(d => <GuestRow key={d.id} d={d} />)}
              </>
            )}
            {filteredIH.length > 0 && (
              <div className={filteredDue.length > 0 ? "mt-3" : ""}>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="font-bold uppercase" style={{ color: TEAL, fontSize: 9, letterSpacing: "0.1em" }}>In-House</span>
                  <span className="font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${TEAL}15`, color: TEAL, fontSize: 9 }}>{filteredIH.length}</span>
                </div>
                {filteredIH.map(d => <GuestRow key={d.id} d={d} />)}
              </div>
            )}
            {filteredDue.length === 0 && filteredIH.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: CK_MUT }}>No guests found</p>
            )}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard label="Charges" value={`₦${grand.toLocaleString()}`} sub={`${charges.filter(c => !c.reversed).length} items incl. tax`} icon={FileText} accent={PRIMARY} />
            <StatCard label="Deposit Paid" value={`₦${g.deposit.toLocaleString()}`} sub="At check-in" icon={CheckCircle} accent={SUCCESS} />
            <StatCard label="Balance Due" value={`₦${balance.toLocaleString()}`} sub="After deposit" icon={CurrencyDollar} accent={balance > 0 ? ERROR : SUCCESS} />
            <StatCard label="Stays" value={String(g.visits)} sub={g.visits === 1 ? "First visit" : "Returning guest"} icon={Users} accent={TEAL} />
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── FOLIO ── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: PRIMARY }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>Folio · {g.id}</p>
                <p className="text-sm font-bold text-white mt-0.5">{g.guest} · Room {g.room} · {g.checkin}–{g.checkout}</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button onClick={() => setShowDiscount(true)} className="text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0" style={{ color: ORANGE, backgroundColor: `${ORANGE}20` }}>Apply Discount</button>
                <button onClick={() => setShowLateCharge(true)} className="text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0" style={{ color: "white", backgroundColor: "rgba(255,255,255,0.18)" }}>+ Late Charge</button>
                <button onClick={() => add({ type: "info", title: "Folio sent to printer" })} className="text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0" style={{ color: "white", backgroundColor: "rgba(255,255,255,0.18)" }}>Print</button>
                <button onClick={() => add({ type: "info", title: "Folio emailed", body: g.guest })} className="text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0" style={{ color: "white", backgroundColor: "rgba(255,255,255,0.18)" }}>Email</button>
              </div>
            </div>
            <Notch />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: CK_BG }}>
                    {["Date", "Category", "Description", "Qty", "Unit", "Amount", "Tax", "By", ""].map((h, i) => (
                      <th key={i} className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: CK_MUT }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {charges.map((c, i) => (
                    <tr key={i} className="border-t transition-colors hover:bg-white" style={{ borderColor: CK_BD, opacity: c.reversed ? 0.45 : 1 }}>
                      <td className="px-3 py-3 text-xs" style={{ color: CK_MUT, fontFamily: mono }}>{c.date}</td>
                      <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: (catColor[c.cat] ?? MUTED) + "18", color: catColor[c.cat] ?? MUTED }}>{c.cat}</span></td>
                      <td className="px-3 py-3 text-sm max-w-40" style={{ color: c.reversed ? CK_MUT : TEXT }}>{c.reversed ? <span className="line-through">{c.desc}</span> : c.desc}</td>
                      <td className="px-3 py-3 text-xs text-center" style={{ color: CK_MUT }}>{c.qty}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: CK_MUT, fontFamily: mono }}>₦{c.unit.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm font-bold" style={{ color: c.reversed ? CK_MUT : TEXT, fontFamily: mono }}>₦{c.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>₦{c.tax.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: SUBTLE }}>{c.by}</td>
                      <td className="px-3 py-3">
                        {!c.reversed
                          ? <button onClick={() => { setVoidLine(i); setVoidReason(""); }} className="text-xs px-2 py-1 rounded-lg border font-semibold" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Void</button>
                          : <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Voided</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t" style={{ borderColor: CK_BD, backgroundColor: "white" }}>
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span style={{ color: CK_MUT }}>Charges subtotal</span><span style={{ fontFamily: mono }}>₦{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span style={{ color: CK_MUT }}>VAT (7.5%)</span><span style={{ fontFamily: mono }}>₦{taxTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span style={{ color: CK_MUT }}>Deposit paid</span><span style={{ color: SUCCESS, fontFamily: mono }}>−₦{g.deposit.toLocaleString()}</span></div>
                  {gDiscount > 0 && <div className="flex justify-between"><span style={{ color: CK_MUT }}>Discount</span><span style={{ color: SUCCESS, fontFamily: mono }}>−₦{gDiscount.toLocaleString()}</span></div>}
                  <div className="flex justify-between font-black text-base border-t pt-2" style={{ borderColor: CK_BD, color: balance > 0 ? ERROR : SUCCESS }}>
                    <span>Balance Due</span><span style={{ fontFamily: mono }}>₦{balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout checklist card */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
            <div className="px-5 py-4" style={{ backgroundColor: PRIMARY }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>Checkout Checklist</p>
            </div>
            <Notch />
            <div className="p-5 space-y-4">
              {/* Access revocation */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: gAccess ? "#D1FAE5" : "#FEF2F2" }}>
                    <Lock size={15} weight="bold" style={{ color: gAccess ? SUCCESS : ERROR }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEXT }}>Room Access Credentials</p>
                    <p className="text-xs mt-0.5" style={{ color: CK_MUT }}>Key Card ×1 · PIN Active · Room {g.room} · TTLock</p>
                    <p className="text-xs mt-0.5" style={{ color: SUBTLE }}>Immediate revocation — stops working within 30s</p>
                  </div>
                </div>
                {!gAccess
                  ? <button onClick={() => { setAccessRevoked(p => ({ ...p, [selectedId]: true })); add({ type: "success", title: "Access revoked", body: `Room ${g.room} credentials deactivated` }); }}
                      className="text-xs px-3 py-1.5 rounded-lg font-bold text-white flex-shrink-0" style={{ backgroundColor: ERROR }}>Revoke Now</button>
                  : <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold flex-shrink-0" style={{ backgroundColor: "#D1FAE5", color: SUCCESS }}><CheckCircle size={11} weight="bold" />Revoked</span>}
              </div>

              {/* Key return */}
              <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: CK_DSH }}>
                <button onClick={() => setKeyReturned(p => ({ ...p, [selectedId]: !gKey }))}
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ border: `2px solid ${gKey ? SUCCESS : CK_DSH}`, backgroundColor: gKey ? SUCCESS : "white" }}>
                  {gKey && <CheckCircle size={12} color="white" weight="bold" />}
                </button>
                <div>
                  <p className="text-sm font-semibold" style={{ color: TEXT }}>Physical key card returned</p>
                  <p className="text-xs" style={{ color: CK_MUT }}>Confirm guest has returned all issued key cards</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="pt-3 border-t" style={{ borderColor: CK_DSH }}>
                <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Guest Feedback</p>
                <p className="text-xs mb-3" style={{ color: CK_MUT }}>Send a post-stay feedback request to the guest.</p>
                {!gFeedback ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setFeedbackSent(p => ({ ...p, [selectedId]: true })); add({ type: "success", title: "Feedback sent via WhatsApp", body: g.guest }); }}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: TEAL, borderColor: `${TEAL}40` }}>WhatsApp</button>
                    <button onClick={() => { setFeedbackSent(p => ({ ...p, [selectedId]: true })); add({ type: "success", title: "Feedback sent via Email", body: g.guest }); }}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Email</button>
                    <button onClick={() => setFeedbackSent(p => ({ ...p, [selectedId]: true }))}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: CK_MUT, borderColor: CK_DSH }}>Skip</button>
                  </div>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: SUCCESS }}><CheckCircle size={12} weight="bold" />Feedback request sent</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── SETTLEMENT SIDEBAR ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
            <div className="px-5 py-4" style={{ backgroundColor: PRIMARY }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>Settlement</p>
            </div>
            <Notch />
            <div className="p-5">
              <div className="text-3xl font-black mb-0.5" style={{ color: balance > 0 ? ERROR : SUCCESS, fontFamily: mono }}>₦{balance.toLocaleString()}</div>
              <div className="text-xs mb-4" style={{ color: CK_MUT }}>Balance due after deposit{gDiscount > 0 ? " & discount" : ""}</div>

              {balance === 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs font-bold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
                  <CheckCircle size={14} weight="bold" />Zero balance — express check-out ready
                </div>
              )}

              {balance > 0 && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: CK_MUT, letterSpacing: "0.08em" }}>Payment Method</p>
                  <div className="space-y-2 mb-4">
                    {["Cash", "POS / Card", "Cash + POS", "Bank Transfer", "Corporate Account"].map(m => (
                      <button key={m} onClick={() => setPayMethod(m)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                        style={{ border: payMethod === m ? `2px solid ${PRIMARY}` : `1.5px dashed ${CK_DSH}`, backgroundColor: payMethod === m ? `${PRIMARY}08` : "white" }}>
                        <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                          style={{ borderColor: payMethod === m ? PRIMARY : CK_DSH, backgroundColor: payMethod === m ? PRIMARY : "transparent" }}>
                          {payMethod === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: TEXT }}>{m}</span>
                      </button>
                    ))}
                  </div>

                  {(payMethod === "Cash" || payMethod === "Cash + POS") && (
                    <div className="mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Cash Received (₦)</label>
                      <input value={cashAmt} onChange={e => setCashAmt(e.target.value)} placeholder={balance.toLocaleString()}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                    </div>
                  )}
                  {(payMethod === "POS / Card" || payMethod === "Cash + POS") && (
                    <div className="mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Card Amount (₦)</label>
                      <input value={cardAmt} onChange={e => setCardAmt(e.target.value)} placeholder={balance.toLocaleString()}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                    </div>
                  )}
                  {payMethod === "Bank Transfer" && (
                    <div className="mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: ERROR }}>Transfer Reference *</label>
                      <input value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="TRN-2025-XXXXXX"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${bankRef ? CK_DSH : ERROR}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                    </div>
                  )}
                  {payMethod === "Corporate Account" && (
                    <div className="mb-4 px-3 py-3 rounded-xl text-xs" style={{ backgroundColor: `${PRIMARY}08`, border: `1.5px dashed ${CK_DSH}` }}>
                      <p className="font-bold mb-0.5" style={{ color: TEXT }}>Corporate billing activated</p>
                      <p style={{ color: CK_MUT }}>Invoice will be sent to the corporate account on file.</p>
                    </div>
                  )}

                  {(payMethod === "Cash" || payMethod === "POS / Card" || payMethod === "Cash + POS") && totalReceived > 0 && (
                    <div className="p-3 rounded-xl mb-3 space-y-1.5 text-xs" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
                      <div className="flex justify-between"><span style={{ color: CK_MUT }}>Total received</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{totalReceived.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span style={{ color: CK_MUT }}>Balance due</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{balance.toLocaleString()}</span></div>
                      {changeAmt > 0 && <div className="flex justify-between border-t pt-1.5" style={{ borderColor: CK_DSH }}><span style={{ color: CK_MUT }}>Change due</span><span className="font-bold" style={{ color: SUCCESS, fontFamily: mono }}>₦{changeAmt.toLocaleString()}</span></div>}
                      {totalReceived < balance && <div className="flex justify-between border-t pt-1.5" style={{ borderColor: CK_DSH }}><span style={{ color: ERROR }}>Shortfall</span><span className="font-bold" style={{ color: ERROR, fontFamily: mono }}>₦{(balance - totalReceived).toLocaleString()}</span></div>}
                    </div>
                  )}
                </>
              )}

              {/* Pre-checkout checklist summary */}
              <div className="space-y-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: CK_MUT }}>Before checkout</p>
                {([
                  [balanceCovered, "Balance settled"],
                  [gAccess, "Access revoked"],
                  [gKey, "Key cards returned"],
                ] as [boolean, string][]).map(([done, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: done ? SUCCESS : CK_DSH }}>
                      {done && <CheckCircle size={10} color="white" weight="bold" />}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: done ? SUCCESS : CK_MUT }}>{label}</span>
                  </div>
                ))}
              </div>

              <button disabled={!canCheckOut}
                onClick={() => {
                  setCheckedOutIds(p => [...p, selectedId]);
                  add({ type: "success", title: "Check-out complete", body: `Room ${g.room} → Cleaning · Access revoked · Folio closed` });
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: canCheckOut ? SUCCESS : PRIMARY }}>
                {canCheckOut ? <CheckCircle size={15} weight="bold" /> : <CurrencyDollar size={15} weight="bold" />}
                {!gAccess ? "Revoke access first" : !gKey ? "Confirm key return" : !balanceCovered ? "Settle balance first" : "Process & Release Room"}
              </button>
            </div>
          </div>

          {/* Guest summary card */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: CK_BG, border: `1.5px solid ${CK_BD}` }}>
            <div className="px-5 py-4" style={{ backgroundColor: PRIMARY }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.55, letterSpacing: "0.1em" }}>Guest</p>
            </div>
            <Notch />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: g.vip ? ORANGE : PRIMARY }}>{g.av}</div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: TEXT }}>{g.guest}</span>
                    {g.vip && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>VIP</span>}
                  </div>
                  <div className="text-xs" style={{ color: CK_MUT }}>Room {g.room} · {g.id}</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {([
                  ["Check-in",  `${g.checkin} 14:00`],
                  ["Check-out", `${g.checkout} 11:00`],
                  ["Nights",    `${g.nights} night${g.nights !== 1 ? "s" : ""}`],
                  ["Phone",     g.phone],
                  ["Visits",    `${g.visits}${g.visits === 1 ? "st" : g.visits === 2 ? "nd" : g.visits === 3 ? "rd" : "th"} visit`],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: CK_MUT }}>{k}</span>
                    <span className="font-semibold" style={{ color: TEXT }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => add({ type: "info", title: "Extend Stay", body: `Opening extension dialog for ${g.guest}` })}
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:shadow-sm"
                style={{ borderColor: CK_DSH, color: CK_MUT }}>
                Extend Stay
              </button>
            </div>
          </div>
        </div>
        </div>{/* /flex-1 main content */}
      </div>{/* /flex gap-5 */}

      {/* ── VOID MODAL ── */}
      {voidLine !== null && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => { setVoidLine(null); setVoidReason(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 py-4" style={{ backgroundColor: ERROR, borderRadius: "1rem 1rem 0 0" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.6 }}>Irreversible Action</p>
              <p className="text-base font-bold text-white mt-0.5">Void Charge</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs mb-4 p-3 rounded-xl" style={{ color: CK_MUT, backgroundColor: CK_BG }}>
                Voiding: <strong style={{ color: TEXT }}>{charges[voidLine]?.desc}</strong> — ₦{charges[voidLine]?.amount.toLocaleString()}. A reversal entry will be posted and cannot be undone.
              </p>
              <div className="space-y-2 mb-4">
                {["Guest complaint", "Incorrectly posted", "Complimentary — VIP service", "Manager override", "Other"].map(r => (
                  <label key={r} className="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
                    style={{ borderColor: voidReason === r ? ERROR : CK_DSH, backgroundColor: voidReason === r ? "#FEF2F2" : "white" }}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: voidReason === r ? ERROR : CK_DSH }}>
                      {voidReason === r && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />}
                    </div>
                    <input type="radio" className="hidden" onChange={() => setVoidReason(r)} />
                    <span className="text-sm" style={{ color: TEXT }}>{r}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setVoidLine(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={!voidReason}
                  onClick={() => {
                    setCharges(cs => cs.map((c, i) => i === voidLine ? { ...c, reversed: true } : c));
                    add({ type: "info", title: "Charge voided", body: `${charges[voidLine]?.desc} · Reason: ${voidReason}` });
                    setVoidLine(null); setVoidReason("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: ERROR }}>Confirm Void</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DISCOUNT MODAL ── */}
      {showDiscount && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }}
            onClick={() => { setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); setManagerPin(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 py-4" style={{ backgroundColor: ORANGE, borderRadius: "1rem 1rem 0 0" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.6 }}>Folio Adjustment</p>
              <p className="text-base font-bold text-white mt-0.5">Apply Discount</p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Discount Amount (₦) *</label>
                <input value={discountAmt} onChange={e => setDiscountAmt(e.target.value)} placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${CK_DSH}`, fontFamily: mono }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Reason *</label>
                <textarea value={discountReason} onChange={e => setDiscountReason(e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ border: `1.5px solid ${CK_DSH}` }} placeholder="Guest complaint, loyalty benefit, etc." />
              </div>
              {parseInt(discountAmt || "0") > 5000 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: ERROR }}>Manager PIN * (required for amounts above ₦5,000)</label>
                  <input type="password" value={managerPin} onChange={e => setManagerPin(e.target.value)} placeholder="••••••"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${managerPin ? CK_DSH : ERROR}`, fontFamily: mono }} />
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); setManagerPin(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button
                  disabled={!discountReason || !discountAmt || (parseInt(discountAmt || "0") > 5000 && !managerPin)}
                  onClick={() => {
                    const amt = parseInt(discountAmt) || 0;
                    setDiscountMap(m => ({ ...m, [selectedId]: (m[selectedId] ?? 0) + amt }));
                    add({ type: "success", title: `Discount applied: ₦${amt.toLocaleString()}`, body: discountReason });
                    setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); setManagerPin("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: ORANGE }}>Apply Discount</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── LATE CHARGE MODAL ── */}
      {showLateCharge && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }}
            onClick={() => { setShowLateCharge(false); setLateChargeDesc(""); setLateChargeAmt(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 py-4" style={{ backgroundColor: PRIMARY, borderRadius: "1rem 1rem 0 0" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity: 0.6 }}>Folio</p>
              <p className="text-base font-bold text-white mt-0.5">Post Late Charge</p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Category</label>
                <select value={lateChargeCat} onChange={e => setLateChargeCat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
                  style={{ border: `1.5px solid ${CK_DSH}`, color: TEXT, backgroundColor: "white" }}>
                  {["Bar", "Restaurant", "Laundry", "Room", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Description *</label>
                <input value={lateChargeDesc} onChange={e => setLateChargeDesc(e.target.value)} placeholder="e.g. Minibar — 2× Beer"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${CK_DSH}` }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: CK_MUT }}>Amount (₦) *</label>
                <input value={lateChargeAmt} onChange={e => setLateChargeAmt(e.target.value)} placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: `1.5px solid ${CK_DSH}`, fontFamily: mono }} />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowLateCharge(false); setLateChargeDesc(""); setLateChargeAmt(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={!lateChargeDesc || !lateChargeAmt}
                  onClick={() => {
                    const amt = parseInt(lateChargeAmt) || 0;
                    const tax = Math.round(amt * 0.075);
                    setCharges(cs => [...cs, { date: g.checkout, cat: lateChargeCat, desc: lateChargeDesc, qty: 1, unit: amt, amount: amt, by: "Staff", tax, reversed: false }]);
                    add({ type: "success", title: "Late charge posted", body: `₦${amt.toLocaleString()} · ${lateChargeDesc}` });
                    setShowLateCharge(false); setLateChargeDesc(""); setLateChargeAmt("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Post Charge</button>
              </div>
            </div>
          </div>
        </>
      )}
      </div>{/* /flex gap-5 outer */}
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
      <PageHeader title="In-House Guests" sub={`${IH_GUESTS.length} guests currently checked in`} actions={<><BtnO label="Export" icon={DownloadSimple} /><BtnP label="Post Charge" icon={Plus} onClick={() => nav && nav("folio", "Folio Management")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="In-House" value={String(IH_GUESTS.length)} sub="Currently checked in" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Guests" value={String(IH_GUESTS.filter(g => g.vip).length)} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Outstanding" value={`₦${IH_GUESTS.reduce((s,g)=>s+g.balance,0).toLocaleString()}`} sub={`${IH_GUESTS.filter(g=>g.balance>0).length} open folios`} icon={CurrencyDollar} accent={ERROR} />
        <StatCard label="Depart Today" value={String(IH_GUESTS.filter(g=>g.nightsLeft===0).length)} sub="Expected by 11:00" icon={ArrowRight} accent={TEAL} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={ihSearch} onChange={e => setIhSearch(e.target.value)} placeholder="Search guest or room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
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
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} weight="bold" />}</div>
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
                    {g.balance > 0 ? <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{g.balance.toLocaleString()}</span> : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle size={11} weight="bold" />Settled</span>}
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
                        <button onClick={() => setMoreMenu(moreMenu === g.room ? null : g.room)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5] transition-colors" style={{ color: SUBTLE }}><DotsThree size={13} weight="bold" /></button>
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
      <PageHeader title="Guest Profiles" sub={`${filtered.length} of ${ALL_GUESTS.length} profiles`} actions={<><BtnO label="Merge Duplicates" icon={Stack} /><BtnP label="New Profile" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Profiles" value={String(ALL_GUESTS.length)} sub="Registered guests" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP Members" value={String(ALL_GUESTS.filter(g=>g.vip).length)} sub="Loyalty & VIP tier" icon={Star} accent={ORANGE} />
        <StatCard label="Active Stay" value={String(ALL_GUESTS.filter(g=>g.activeStay).length)} sub="Currently in-house" icon={Bed} accent={TEAL} />
        <StatCard label="With Balance" value={String(ALL_GUESTS.filter(g=>g.balance>0).length)} sub="Open folios" icon={CurrencyDollar} accent={ERROR} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, phone, or ID…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
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
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: g.blacklist ? ERROR : TEXT }}>{g.name}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} weight="bold" />}</div>
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
        actions={<><BtnO label="Print Folio" icon={FileText} /><BtnO label="Split Folio" icon={Stack} /><BtnP label="Post Charge" icon={Plus} onClick={() => setShowCharge(true)} /></>} />
      {/* Header stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Charges + Tax" value={`₦${grand.toLocaleString()}`} sub={`${lines.filter(l=>!l.reversed).length} active lines`} icon={FileText} accent={PRIMARY} />
        <StatCard label="Payments" value={`₦${paidTotal.toLocaleString()}`} sub={`${PAYMENTS.length} payment${PAYMENTS.length !== 1 ? "s" : ""}`} icon={CheckCircle} accent={SUCCESS} />
        <StatCard label="Balance Due" value={`₦${Math.max(0,balance).toLocaleString()}`} sub="Remaining" icon={CurrencyDollar} accent={balance > 0 ? ERROR : SUCCESS} />
        <StatCard label="Room Night Rate" value="₦55,000" sub="Deluxe · 2 nights" icon={Bed} accent={TEAL} />
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
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post Charge</h3><button onClick={() => setShowCharge(false)} style={{ color: SUBTLE }}><XCircle size={18} weight="bold" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Category</label><select value={charge.cat} onChange={e => setCharge(p => ({...p, cat: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{["Room","Restaurant","Bar","Laundry","Minibar","Telephone","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Quantity</label><input type="number" min="1" value={charge.qty} onChange={e => setCharge(p => ({...p, qty: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Description</label><input value={charge.desc} onChange={e => setCharge(p=>({...p,desc:e.target.value}))} placeholder="e.g. Room Service #RS-055" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Unit Amount (₦)</label><input type="number" value={charge.amount} onChange={e => setCharge(p=>({...p,amount:e.target.value}))} placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              {charge.amount && charge.qty && <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Total: ₦{((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)).toLocaleString()} + VAT ₦{Math.round((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)*0.075).toLocaleString()}</div>}
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowCharge(false)} /><BtnP label="Post Charge" icon={CurrencyDollar} onClick={postCharge} /></div>
          </div>
        </>
      )}
      {/* Post Payment Modal */}
      {showPayment && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowPayment(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post Payment</h3><button onClick={() => setShowPayment(false)} style={{ color: SUBTLE }}><XCircle size={18} weight="bold" /></button></div>
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
        actions={<><BtnO label="Export" icon={DownloadSimple} /><BtnP label="Post Charge" icon={Plus} onClick={() => add({ type: "info", title: "Select a folio first" })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Open Folios" value={String(FOLIOS.filter(f=>f.balance>0).length)} sub="With outstanding balance" icon={FileText} accent={PRIMARY} />
        <StatCard label="Total Outstanding" value={`₦${totalOutstanding.toLocaleString()}`} sub="Across all open folios" icon={CurrencyDollar} accent={ERROR} />
        <StatCard label="No Payment on File" value={String(FOLIOS.filter(f=>f.flags.noPayment).length)} sub="No deposit collected" icon={Warning} accent={WARNING} />
        <StatCard label="Unposted Charges" value={String(FOLIOS.filter(f=>f.flags.unposted).length)} sub="Charges not yet synced" icon={Clock} accent={ORANGE} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search folio, guest, or room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          {["All", "Open", "Settled", "High Balance", "No Payment"].map(f => <button key={f} onClick={() => setStatusFilter(f)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: statusFilter===f ? PRIMARY : "white", color: statusFilter===f ? "white" : MUTED, borderColor: statusFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
          {selected.length > 0 && <div className="ml-auto flex items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>{selected.length} selected</span><button onClick={() => add({ type: "info", title: `Bulk action on ${selected.length} folios` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Bulk Post Charge</button></div>}
          <span className={`text-xs ${selected.length > 0 ? "" : "ml-auto"}`} style={{ color: SUBTLE }}>{filtered.length} folios</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>
            <th className="px-4 py-3 w-8"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(f=>f.id) : [])} /></th>
            {["Folio / Res", "Guest", "Room", "Dates", "Charges", "Payments", "Balance", "Days Open", "Last Pulse", "Flags", ""].map((h,i) => <th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}
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
                  {f.balance > 0 ? <span className="text-sm font-bold" style={{ color: f.flags.highBalance ? ERROR : TEXT, fontFamily: mono }}>₦{f.balance.toLocaleString()}</span> : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle size={11} weight="bold" />Settled</span>}
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

export { HKBoard, WorkOrders, InternalChat, POSTerminal, TableManagement, StaffDirectory, DailySummary, StockDashboard, RoomTypeManagement, RateCalendar, AvailabilityBoard } from "./OperationsScreens";

// BranchOverview → MultibranchSettingsScreens.tsx
export { BranchOverview } from "./MultibranchSettingsScreens";

// OccupancyReports → ReportsScreens.tsx
export { OccupancyReports } from "./ReportsScreens";

// SystemHealth → ITAdminScreens.tsx
export { SystemHealth } from "./ITAdminScreens";
