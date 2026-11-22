// All screen components and shared UI primitives.
// Imported by App.tsx — no circular dependencies.
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SquaresFour, CalendarDots, Key, Bed, Wrench,
  ForkKnife, Chat, CurrencyDollar, Package, Users,
  Buildings, ChartBar, GearSix, CaretLeft, CaretRight,
  Bell, SignOut, Receipt, User, CaretDown, TrendUp, TrendDown,
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
  type Role, type Toast, type ToastType, type AddToast, fmtN, BUSINESS_DATE, fmtDate, uid, actC, actBg,
  mono, display, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE,
  PROPERTY_PROFILE,
  hkC, woC, priC, tblC, stC, roomStC, resStC,
  occData, occ30Data, revCat, deptKPIs, recentAct, ROOMS, STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA, ORANGE_INK, TEAL_INK } from "./constants";
import { TextOrDate } from "./DateInput";
import { CHARGES, type ChargeRow, checkoutGuests, inHouseGuests, folios, STAYS, balanceOf, gridBookings, unassignedArrivals, type GridBooking, reservations, unassignedFuture } from "./mock/frontOffice";
import { UI, controlClass, controlStyle, Field, Card, SectionTitle, Stepper, Choice, Segmented, Row } from "./ui";
import { ROOM_TYPES, roomPrice, roomTypeNames } from "./mock/property";
import { roomState, ROOM_STATE_COLOR } from "./mock/rooms";
import { addBooking, checkOut, typeAvailable, assignRoom, roomsForBooking } from "./mock/hotel";
import { requestApproval } from "./mock/approvals";
import { addDiscount, discountOf } from "./mock/frontOffice";
import { ReportFaultDialog } from "./FaultScreens";

// ─── UI Primitives ──────────────────────────────────────────────────────────
// ─── PREMIUM UI PRIMITIVES ────────────────────────────────────────────────────

export function Badge({ label, colors }: { label: string; colors: { bg: string; text: string } }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text }}>
      {label}
    </span>
  );
}

// Shown while a screen's data is on its way from the hotel server.
export function ScreenLoading() {
  const bar = (w: string, h = 12) => <div className="rounded-md animate-pulse" style={{ width: w, height: h, backgroundColor: "#E4E4E7" }} />;
  return (
    <div role="status" aria-label="Loading" className="space-y-6">
      <div className="space-y-2">{bar("220px", 22)}{bar("320px")}</div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <div key={i} className="space-y-3 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>{bar("36px", 36)}{bar("60%", 20)}{bar("40%")}</div>)}</div>
      <div className="space-y-4 rounded-2xl border bg-white p-5" style={{ borderColor: BORDER }}>{[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="flex items-center gap-4">{bar("32px", 32)}{bar("30%")}{bar("15%")}{bar("20%")}</div>)}</div>
    </div>
  );
}

// Shown when the hotel server cannot be reached from this computer.
export function ScreenError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-8 text-center" style={{ borderColor: BORDER }}>
      <h1 className="text-lg font-semibold" style={{ color: TEXT }}>Can't reach the hotel server</h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>This computer has lost its connection to the server in the back office. Check the network cable or Wi-Fi, then try again. Nothing you saved has been lost.</p>
      <button onClick={onRetry} className="mt-5 h-11 rounded-[10px] px-5 text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Try again</button>
    </div>
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
          <button aria-label="Close" onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100 transition-opacity mt-0.5" style={{ color: MUTED }}>
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
      <div className="text-sm font-semibold text-white leading-none tracking-wide" style={{ fontFamily: mono }}>
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
    <div className="bg-white p-5" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}14` }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
        <div className="text-sm font-medium flex-1 min-w-0" style={{ color: MUTED }}>{label}</div>
        {delta && (
          <div className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: deltaPositive ? "#047857" : "#BE123C", backgroundColor: deltaPositive ? "#ECFDF5" : "#FFF1F2" }}>
            {deltaPositive ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
            {delta}
          </div>
        )}
      </div>
      <div className="leading-none mb-1.5" style={{ color: TEXT, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</div>
      <div className="text-sm" style={{ color: MUTED }}>{sub}</div>
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 style={{ color: TEXT, fontSize: 24, lineHeight: "30px", fontFamily: display, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</h1>
        {sub && <p className="text-sm mt-0.5" style={{ color: MUTED }}>{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function BtnP({ label, icon: Icon, onClick, color }: { label: string; icon?: React.ElementType; onClick?: () => void; color?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
      style={{ backgroundColor: color ?? PRIMARY, height: 40, borderRadius: 10 }}>
      {Icon && <Icon size={14} />}{label}
    </button>
  );
}

export function BtnO({ label, icon: Icon, onClick }: { label: string; icon?: React.ElementType; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-4 text-sm font-semibold border bg-white hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
      style={{ color: TEXT, borderColor: "#CBD5E1", height: 40, borderRadius: 10 }}>
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
      {label && <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>{label}</label>}
      <TextOrDate
        aria-label={label ?? placeholder}
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={e => onChange?.({ target: { value: e.target.value } })}
        readOnly={readOnly}
        className={controlClass}
        style={{ ...controlStyle(), fontFamily: monoFont ? "'Inter', system-ui, sans-serif" : undefined }}
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
      {label && <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>{label}</label>}
      <select
        aria-label={label}
        value={value}
        onChange={e => onChange?.({ target: { value: e.target.value } })}
        className={controlClass}
        style={controlStyle()}
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
// Bars run from the afternoon of check-in to the morning of check-out (half a day in from each
// edge), so a guest leaving and a guest arriving on the same day sit side by side.
const BAR_STYLE: Record<string, { bg: string; edge: string; text: string }> = {
  "Checked in": { bg: "#CCFBF1", edge: "#0F766E", text: "#134E4A" },
  Confirmed:    { bg: "#E0F2FE", edge: "#0369A1", text: "#0C4A6E" },
  Pending:      { bg: "#FEF3C7", edge: "#B45309", text: "#78350F" },
};

export function ReservationGrid({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string, param?: string) => void }) {
  // A week on narrow screens so names stay readable; two weeks when there is room.
  const [DAYS] = useState(() => (typeof window !== "undefined" && window.innerWidth < 1280 ? 7 : 14));
  const MIN_DW = 64, RH = 56, ROOMW = 184;
  const pct = (days: number) => `${(days / DAYS) * 100}%`;
  const [offset, setOffset] = useState(-2); // open two days back so in-house stays show where they began
  const [type, setType] = useState<string>("All");
  const [floor, setFloor] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GridBooking | null>(null);
  const bookings = gridBookings();
  const [, refresh] = useState(0);
  // Bookings with no room yet: today's arrivals and later "room at check-in" bookings. The desk gives each a room here.
  const waiting = [...unassignedArrivals().map(a => ({ id: a.id, guest: a.guest, type: a.type, nights: a.nights, vip: a.vip, from: BUSINESS_DATE })),
    ...unassignedFuture().map(b => ({ id: b.id, guest: b.guest, type: b.type ?? "", nights: Math.round((b.checkout.getTime() - b.checkin.getTime()) / 86400000), vip: b.vip, from: b.checkin }))];

  const start = new Date(BUSINESS_DATE); start.setDate(start.getDate() + offset);
  const days = Array.from({ length: DAYS }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const dayIndex = (d: Date) => Math.round((d.getTime() - start.getTime()) / 86400000);
  const todayIdx = dayIndex(BUSINESS_DATE);
  const floors = ["All", ...Array.from(new Set(ROOMS.map(r => String(r.floor))))];
  const q = search.trim().toLowerCase();
  const rooms = ROOMS.filter(r =>
    (type === "All" || r.type === type) && (floor === "All" || String(r.floor) === floor) &&
    (!q || r.id.includes(q) || bookings.some(b => b.room === r.id && b.guest.toLowerCase().includes(q))));
  const booked = (d: Date) => rooms.filter(r => bookings.some(b => b.room === r.id && b.checkin <= d && b.checkout > d)).length;
  const tonight = booked(BUSINESS_DATE);
  const arriving = bookings.filter(b => b.status !== "Checked in" && b.checkin.toDateString() === BUSINESS_DATE.toDateString()).length + waiting.filter(w => w.from.toDateString() === BUSINESS_DATE.toDateString()).length;
  const leaving = bookings.filter(b => b.checkout.toDateString() === BUSINESS_DATE.toDateString()).length;
  const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const bar = (b: GridBooking) => {
    const from = dayIndex(b.checkin) + 0.5, to = dayIndex(b.checkout) + 0.5;
    const left = Math.max(from, 0), right = Math.min(to, DAYS);
    if (right <= 0 || left >= DAYS) return null;
    const st = BAR_STYLE[b.status];
    const isSel = selected?.id === b.id;
    const nights = Math.round((b.checkout.getTime() - b.checkin.getTime()) / 86400000);
    return (
      <button key={b.id} type="button" onClick={e => { e.stopPropagation(); setSelected(b); }}
        title={`${b.guest} · ${short(b.checkin)} to ${short(b.checkout)} · ${b.status}`}
        aria-label={`${b.guest}, room ${b.room}, ${short(b.checkin)} to ${short(b.checkout)}, ${b.status.toLowerCase()}`}
        className="absolute flex items-center gap-1.5 px-2.5 text-left overflow-hidden"
        style={{ left: `calc(${pct(left)} + 2px)`, width: `calc(${pct(right - left)} - 4px)`, top: 10, height: RH - 20, borderRadius: 8,
          backgroundColor: st.bg, color: st.text, borderLeft: from >= 0 ? `3px solid ${st.edge}` : undefined,
          outline: isSel ? `2px solid ${st.edge}` : undefined, outlineOffset: 1 }}>
        {b.vip && <span aria-hidden className="text-xs flex-shrink-0">★</span>}
        <span className="text-sm font-medium truncate">{b.guest}</span>
        {right - left >= 3 && <span className="text-xs flex-shrink-0 opacity-80">{nights} night{nights === 1 ? "" : "s"}</span>}
      </button>
    );
  };

  return (
    <div>
      <PageHeader title="Reservation Grid" sub="Who is in which room, night by night. Select a free night to book it."
        actions={<BtnP label="New reservation" icon={Plus} onClick={() => nav?.("new-reservation", "New Reservation")} />} />

      <section className="bg-white overflow-hidden" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous week" onClick={() => setOffset(o => o - 7)} className="h-9 w-9 flex items-center justify-center rounded-lg border" style={{ borderColor: "#CBD5E1", color: TEXT }}><CaretLeft size={16} /></button>
            <button type="button" onClick={() => setOffset(-2)} className="h-9 px-3 rounded-lg border text-sm font-medium" style={{ borderColor: "#CBD5E1", color: TEXT }}>Today</button>
            <button type="button" aria-label="Next week" onClick={() => setOffset(o => o + 7)} className="h-9 w-9 flex items-center justify-center rounded-lg border" style={{ borderColor: "#CBD5E1", color: TEXT }}><CaretRight size={16} /></button>
          </div>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>{short(days[0])} – {fmtDate(days[DAYS - 1])}</span>
          <div className="flex-1" />
          <Segmented label="Room type" options={["All", ...roomTypeNames()]} value={type} onChange={setType} />
          <select aria-label="Floor" value={floor} onChange={e => setFloor(e.target.value)} className="h-9 px-2.5 rounded-lg border text-sm bg-white" style={{ borderColor: "#CBD5E1", color: TEXT }}>
            {floors.map(f => <option key={f} value={f}>{f === "All" ? "All floors" : `Floor ${f}`}</option>)}
          </select>
          <div className="relative">
            <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Guest or room" aria-label="Search guest or room"
              className="h-9 pl-9 pr-3 rounded-lg border text-sm outline-none w-44" style={{ borderColor: "#CBD5E1", color: TEXT }} />
          </div>
        </div>

        {/* Tonight at a glance and the key */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 text-sm" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: UI.surface }}>
          <span style={{ color: TEXT }}><b className="font-semibold">{tonight}</b> of {rooms.length} rooms booked tonight</span>
          <span style={{ color: MUTED }}>{arriving} arriving · {leaving} leaving today</span>
          <span className="flex-1" />
          {Object.entries(BAR_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5" style={{ color: MUTED }}><span className="w-5 h-3.5 rounded" style={{ backgroundColor: v.bg, borderLeft: `3px solid ${v.edge}` }} />{k}</span>
          ))}
        </div>

        <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 300px)", minHeight: 360 }}>
          <div style={{ minWidth: ROOMW + MIN_DW * DAYS }}>
            {/* Day header */}
            <div className="flex sticky top-0 z-20 bg-white" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="sticky left-0 z-10 bg-white flex items-end px-4 pb-2 text-xs font-medium flex-shrink-0" style={{ width: ROOMW, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Room</div>
              <div className="flex flex-1">{days.map((d, i) => {
                const isToday = i === todayIdx;
                return (
                  <div key={i} className="flex flex-col items-center justify-center" style={{ width: pct(1), height: 56, backgroundColor: isToday ? "#F0FDFA" : weekend(d) ? UI.surface : undefined, borderRight: `1px solid #F1F5F9` }}>
                    <span className="text-xs" style={{ color: isToday ? TEAL_INK : MUTED }}>{isToday ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                    <span className="text-base leading-tight" style={{ color: isToday ? TEAL_INK : TEXT, fontWeight: isToday ? 700 : 500 }}>{d.getDate()}</span>
                    {(i === 0 || d.getDate() === 1) && <span className="text-xs leading-none" style={{ color: MUTED }}>{d.toLocaleDateString("en-GB", { month: "short" })}</span>}
                  </div>
                );
              })}</div>
            </div>

            {/* Arrivals still waiting for a room */}
            {waiting.length > 0 && (
              <div className="flex" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: "#FFFBEB" }}>
                <div className="sticky left-0 z-10 px-4 py-2.5 flex flex-col justify-center flex-shrink-0" style={{ width: ROOMW, backgroundColor: "#FFFBEB", borderRight: `1px solid ${BORDER}` }}>
                  <span className="text-sm font-semibold" style={{ color: TEXT }}>No room yet</span>
                  <button type="button" onClick={() => nav?.("room-assignment", "Room Assignment")} className="text-sm text-left font-medium" style={{ color: TEAL_INK }}>Assign rooms</button>
                </div>
                <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                  {waiting.map(a => (
                    <span key={a.id} className="flex items-center gap-2 text-sm pl-2.5 pr-1 py-1 rounded-lg" style={{ backgroundColor: "white", border: "1px solid #FCD34D", color: "#78350F" }}>
                      {a.vip && "★ "}{a.guest} · {a.type} · {a.nights} night{a.nights === 1 ? "" : "s"} from {a.from.toDateString() === BUSINESS_DATE.toDateString() ? "today" : fmtDate(a.from)}
                      <select aria-label={`Give ${a.guest} a room`} value="" onChange={e => { if (assignRoom(a.id, e.target.value)) { add({ type: "success", title: `Room ${e.target.value} given to ${a.guest}` }); refresh(n => n + 1); } }}
                        className="h-7 rounded-md border bg-white px-1.5 text-sm" style={{ borderColor: "#FCD34D", color: TEXT }}>
                        <option value="">Give a room</option>
                        {roomsForBooking(a.id).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms */}
            {rooms.map(r => (
              <div key={r.id} className="flex" style={{ height: RH, borderBottom: `1px solid #F1F5F9` }}>
                <div className="sticky left-0 z-10 bg-white flex flex-col justify-center px-4 flex-shrink-0" style={{ width: ROOMW, borderRight: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold" style={{ color: TEXT }}>{r.id}</span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }} title={`Room is ${roomState(r.id).toLowerCase()} now`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ROOM_STATE_COLOR[roomState(r.id)] }} />{roomState(r.id)}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: MUTED }}>{r.type} · Floor {r.floor}</div>
                </div>
                <div className="relative flex flex-1">
                  {days.map((d, i) => {
                    const taken = roomState(r.id) === "Out of order" || bookings.some(b => b.room === r.id && b.checkin <= d && b.checkout > d);
                    return (
                      taken || d < BUSINESS_DATE
                        ? <div key={i} aria-hidden className="h-full" style={{ width: pct(1), borderRight: `1px solid #F1F5F9`, backgroundColor: i === todayIdx ? "rgba(240,253,250,0.6)" : weekend(d) ? UI.surface : undefined }} />
                        : <button key={i} type="button" aria-label={`Book room ${r.id} from ${short(d)}`}
                            onClick={() => nav?.("new-reservation", "New Reservation", `${r.id}|${iso(d)}`)}
                            className="h-full hover:bg-[#F0FDFA]"
                            style={{ width: pct(1), borderRight: `1px solid #F1F5F9`, backgroundColor: i === todayIdx ? "rgba(240,253,250,0.6)" : weekend(d) ? UI.surface : undefined }} />
                    );
                  })}
                  {bookings.filter(b => b.room === r.id).map(bar)}
                </div>
              </div>
            ))}
            {rooms.length === 0 && <EmptyState icon={MagnifyingGlass} message="No rooms match. Clear the search or pick another room type or floor." />}

            {/* Nights booked per day */}
            <div className="flex sticky bottom-0 z-20 bg-white" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="sticky left-0 z-10 bg-white px-4 py-2.5 text-xs font-medium flex-shrink-0" style={{ width: ROOMW, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Rooms booked</div>
              <div className="flex flex-1">{days.map((d, i) => {
                const n = booked(d), full = rooms.length > 0 && n === rooms.length;
                return <div key={i} className="flex items-center justify-center text-sm" style={{ width: pct(1), color: full ? ERROR : n / Math.max(rooms.length, 1) >= 0.8 ? ORANGE_INK : TEXT, fontWeight: i === todayIdx ? 600 : 400, backgroundColor: i === todayIdx ? "#F0FDFA" : undefined }}>{n}/{rooms.length}</div>;
              })}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking details */}
      {selected && (() => {
        const nights = Math.round((selected.checkout.getTime() - selected.checkin.getTime()) / 86400000);
        const arrivesToday = selected.status !== "Checked in" && selected.checkin.toDateString() === BUSINESS_DATE.toDateString();
        return (
          <>
            <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(15,23,42,0.25)" }} onClick={() => setSelected(null)} />
            <aside role="dialog" aria-label={`Booking ${selected.id}`} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white flex flex-col" style={{ borderLeft: `1px solid ${BORDER}` }}>
              <div className="flex items-start justify-between gap-3 px-6 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <p className="text-sm" style={{ color: MUTED }}>{selected.id} · Room {selected.room}</p>
                  <h2 className="text-lg font-semibold" style={{ color: TEXT, fontFamily: display }}>{selected.vip && "★ "}{selected.guest}</h2>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: BAR_STYLE[selected.status].bg, color: BAR_STYLE[selected.status].text }}>{selected.status}</span>
                </div>
                <button aria-label="Close" onClick={() => setSelected(null)} className="h-9 w-9 flex items-center justify-center rounded-lg" style={{ color: MUTED }}><XCircle size={20} /></button>
              </div>
              <div className="px-6 py-4 flex-1 overflow-y-auto">
                <Row label="Check-in" value={fmtDate(selected.checkin)} />
                <Row label="Check-out" value={fmtDate(selected.checkout)} />
                <Row label="Nights" value={nights} />
                <Row label="Rate per night" value={`₦${selected.rate.toLocaleString()}`} />
                <Row label="Booked through" value={selected.source} />
                <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}><Row label="Room total before VAT" value={`₦${(selected.rate * nights).toLocaleString()}`} strong /></div>
              </div>
              <div className="px-6 py-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                {selected.status === "Checked in" && <BtnP label="Open check-out" onClick={() => nav?.("check-out", "Check-Out", selected.id)} />}
                {arrivesToday && <BtnP label="Check in" onClick={() => nav?.("check-in", "Check-In")} />}
                <BtnO label="Open reservation" onClick={() => nav?.("reservation-detail", `${selected.guest} — Rm ${selected.room}`)} />
              </div>
            </aside>
          </>
        );
      })()}
    </div>
  );
}

export function NewReservation({ add, nav, initialGuestName = "" }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string, param?: string) => void; initialGuestName?: string }) {
  // Opened from a free night on the grid: "101|2026-06-25" means that room from that date.
  const fromGrid = /^(\d+)\|(\d{4}-\d{2}-\d{2})$/.exec(initialGuestName);
  const gridRoom = fromGrid ? ROOMS.find(r => r.id === fromGrid[1]) : undefined;
  const plusDays = (isoDate: string, n: number) => { const d = new Date(`${isoDate}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState("");
  const [guestSearchQ, setGuestSearchQ] = useState("");
  const [showGuestResults, setShowGuestResults] = useState(false);
  const [manualRate, setManualRate] = useState(false);

  const [form, setForm] = useState({
    checkin: fromGrid ? fromGrid[2] : "2026-06-24", checkout: fromGrid ? plusDays(fromGrid[2], 1) : "2026-06-27",
    adults: "2", children: "0",
    roomType: gridRoom?.type ?? "Deluxe", roomNumber: gridRoom?.id ?? "",
    source: "Phone",
    ratePlan: "Standard Rate", nightlyRate: String(roomPrice(gridRoom?.type ?? "Deluxe")),
    manualRateVal: "",
    guestName: fromGrid ? "" : initialGuestName, phone: "", email: "",
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

  // Rooms of each type with no booking overlapping the chosen nights.
  const bookingsNow = gridBookings();
  const stayFrom = new Date(`${form.checkin}T00:00:00`), stayTo = new Date(`${form.checkout}T00:00:00`);
  // Bookings still waiting for a room use up rooms of their type too, so the list is cut to what is really left.
  const freeRooms = (t: string) => ROOMS.filter(r => r.type === t && roomState(r.id) !== "Out of order" && !bookingsNow.some(b => b.room === r.id && b.checkin < stayTo && b.checkout > stayFrom)).map(r => r.id)
    .slice(0, Math.max(0, typeAvailable(t, stayFrom, Math.max(1, Math.round((stayTo.getTime() - stayFrom.getTime()) / 86400000)))));
  const ROOM_DESC = (t: string) => { const rt = ROOM_TYPES.find(x => x.name === t); return rt ? `${rt.beds} · ${rt.size} · up to ${rt.maxOcc} guests` : ""; };

  const EXTRAS_CATALOG = [
    { name: "Champagne on arrival",  price: 8500,  icon: Wine      },
    { name: "Fruit basket",          price: 3500,  icon: Gift      },
    { name: "Extra pillows",         price: 0,     icon: Bed },
    { name: "Breakfast included",    price: 4500,  icon: Coffee    },
    { name: "Late check-out (2 pm)", price: 15000, icon: Clock     },
    { name: "Airport pick-up",       price: 12000, icon: Car       },
    { name: "Welcome flowers",       price: 4000,  icon: Star      },
    { name: "Laundry package",       price: 6000,  icon: Package   },
  ];

  const GUEST_SUGGESTIONS = reservations().filter(r =>
    guestSearchQ.length >= 2 &&
    (r.guest.toLowerCase().includes(guestSearchQ.toLowerCase()) ||
     r.id.toLowerCase().includes(guestSearchQ.toLowerCase()))
  ).slice(0, 4);

  const nights = Math.max(1, Math.round(
    (new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000
  ));
  const baseRate = manualRate && form.manualRateVal
    ? Number(form.manualRateVal)
    : Number(form.nightlyRate) || roomPrice(form.roomType) || 55000;
  const extrasTotal = form.extras.reduce((s, ex) => {
    const cat = EXTRAS_CATALOG.find(e => e.name === ex);
    return s + (cat ? (cat.name === "Breakfast included" ? cat.price * nights : cat.price) : 0);
  }, 0);
  const subtotal = baseRate * nights + extrasTotal;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  const depositAmt = form.depositAmount
    ? Number(form.depositAmount)
    : Math.round(total * Number(form.depositPct) / 100);

  const STEPS = ["Stay", "Rate", "Guest", "Extras", "Deposit", "Review"];
  const STEP_SUB = ["When they arrive, how many guests and which room.", "The price per night for this stay.", "Who is staying. Search first to reuse a returning guest.", "Anything to prepare before they arrive.", "What the guest pays now to hold the room.", "Check everything, then confirm the booking."];
  // Rate plans are priced against the Standard room; scale them to the chosen room type.
  const planPrice = (base: number) => Math.round(roomPrice(form.roomType) * base / roomPrice(roomTypeNames()[0]) / 500) * 500;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.checkin) errs.checkin = "Choose a check-in date";
      if (!form.checkout) errs.checkout = "Choose a check-out date";
      if (form.checkin && form.checkout && form.checkout <= form.checkin)
        errs.checkout = "Check-out must be after check-in";
      else if (freeRooms(form.roomType).length === 0) errs.roomType = "No rooms of this type are free";
    }
    if (step === 3) {
      if (!form.guestName.trim()) errs.guestName = "Enter the guest's name";
      if (!form.phone.trim()) errs.phone = "Enter a phone number";
      if (!form.idNum.trim()) errs.idNum = "Enter the ID number";
    }
    if (step === 5 && Number(form.depositPct) > 0 && form.payMethod !== "Cash" && !form.payRef.trim())
      errs.payRef = "Enter the reference so the payment can be matched";
    setErrors(errs);
    // Take the person straight to the first field that needs fixing.
    if (Object.keys(errs).length) setTimeout(() => (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(), 0);
    return Object.keys(errs).length === 0;
  };
  // Each step starts at the top of the page.
  useEffect(() => { document.querySelector("[data-suite-content]")?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); }, [step]);

  const proceed = () => {
    if (!validate()) return;
    if (step === 6) {
      const id = addBooking({ guest: form.guestName.trim(), room: form.roomNumber, type: form.roomType, checkin: new Date(`${form.checkin}T00:00:00`), nights,
        rate: baseRate, source: form.source, vip: form.vip, balance: total - depositAmt });
      if (!id) { add({ type: "error", title: `Room ${form.roomNumber} is already booked on one of those nights`, body: "Choose another room or other dates." }); setStep(1); return; }
      setConfirmedId(id);
      setConfirmed(true);
      add({ type: "success", title: "Reservation confirmed", body: `${id} · ${form.guestName || "Guest"} · ${form.roomType}` });
      return;
    }
    setStep(s => s + 1);
  };

  // ── Pieces built on the global values (ui.tsx) ──────────────────────────
  const Input = ({ id, type = "text", value, onChange, placeholder, err }: {
    id: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; err?: boolean;
  }) => (
    <TextOrDate id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      aria-invalid={err || undefined} className={controlClass} style={controlStyle(err)} />
  );
  const Select = ({ id, value, onChange, options }: { id: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={controlClass} style={controlStyle()}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const Tog = ({ on, toggle, label }: { on: boolean; toggle: () => void; label: string }) => (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={toggle} className="w-11 h-6 rounded-full relative flex-shrink-0 transition-colors"
      style={{ backgroundColor: on ? UI.focus : "#CBD5E1" }}>
      <span className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all" style={{ left: on ? 22 : 2 }} />
    </button>
  );
  const ToggleRow = ({ title, sub, on, toggle }: { title: string; sub?: string; on: boolean; toggle: () => void }) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div><p className="text-sm font-medium" style={{ color: TEXT }}>{title}</p>{sub && <p className="text-sm" style={{ color: MUTED }}>{sub}</p>}</div>
      <Tog on={on} toggle={toggle} label={title} />
    </div>
  );
  const Pills = ({ options, value, onChange, label }: { options: { v: string; l: string }[]; value: string; onChange: (v: string) => void; label: string }) => (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = value === o.v;
        return (
          <button key={o.v} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.v)}
            className="px-4 text-sm transition-colors" style={{ height: 40, borderRadius: UI.radius.control, border: `${on ? 2 : 1}px solid ${on ? UI.focus : "#CBD5E1"}`, backgroundColor: on ? UI.selectedBg : "white", color: TEXT, fontWeight: on ? 600 : 400 }}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
  const naira = (n: number) => `₦${n.toLocaleString()}`;
  const extraPrice = (name: string) => { const c = EXTRAS_CATALOG.find(e => e.name === name); return c ? (c.name === "Breakfast included" ? c.price * nights : c.price) : 0; };

  // ── After confirming ──────────────────────────────────────────────────────
  if (confirmed) return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <div className="pt-8 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#CCFBF1" }}>
            <CheckCircle size={28} style={{ color: TEAL_INK }} weight="bold" />
          </div>
          <p className="text-sm" style={{ color: MUTED }}>Reservation confirmed</p>
          <h1 className="text-2xl font-semibold mt-1" style={{ color: TEXT, fontFamily: display }}>{confirmedId}</h1>
          <p className="text-sm mt-1" style={{ color: TEXT }}>{form.guestName} · {form.roomType}{form.roomNumber ? `, room ${form.roomNumber}` : ""}</p>
          <p className="text-sm" style={{ color: MUTED }}>{fmtDate(form.checkin)} to {fmtDate(form.checkout)} · {nights} night{nights === 1 ? "" : "s"} · {naira(total)} with VAT</p>
          {(form.sendEmail || form.sendSMS || form.printRegCard) && (
            <p className="text-sm mt-4" style={{ color: MUTED }}>
              {[form.sendEmail && "Email confirmation queued", form.sendSMS && "SMS queued", form.printRegCard && "Registration card sent to the printer"].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {form.checkin === "2026-06-24" ? <BtnP label="Check in now" onClick={() => nav?.("check-in", "Check-In")} /> : <BtnP label="Open reservation" onClick={() => nav?.("reservation-detail", confirmedId)} />}
            <BtnO label="Back to the grid" onClick={() => nav?.("reservation-grid", "Reservation Grid")} />
          </div>
          <button type="button" onClick={() => { setConfirmed(false); setStep(1); setForm(f => ({ ...f, guestName: "", phone: "", email: "", idNum: "", extras: [], roomNumber: "", depositAmount: "", payRef: "", specialNotes: "" })); }}
            className="mt-3 h-10 text-sm font-medium" style={{ color: TEAL_INK }}>Book another room</button>
        </div>
      </Card>
    </div>
  );

  const types = roomTypeNames();
  return (
    <div>
      <PageHeader title="New reservation" sub="Book a room in six short steps. The summary on the right updates as you go." />

      <div className="bg-white px-5 py-4 mb-5" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
        <Stepper steps={STEPS} current={step} onStep={setStep} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">
        <Card title={`${step}. ${["Stay details", "Rate", "Guest details", "Extras", "Deposit", "Review and confirm"][step - 1]}`} sub={STEP_SUB[step - 1]}
          footer={<>
            {step > 1 ? <BtnO label="Back" icon={CaretLeft} onClick={() => setStep(s => s - 1)} /> : <span />}
            <div className="flex items-center gap-3">
              {step === 6 && <button type="button" onClick={() => add({ type: "info", title: "Saved as a draft", body: "Find it in Reservation Lookup." })} className="h-10 px-3 text-sm font-medium" style={{ color: MUTED }}>Save as draft</button>}
              <BtnP label={step === 6 ? "Confirm reservation" : `Continue to ${STEPS[step].toLowerCase()}`} onClick={proceed} />
            </div>
          </>}>
          <div className="space-y-7">

            {step === 1 && (<>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Check-in" htmlFor="nr-in" required error={errors.checkin}><Input id="nr-in" type="date" value={form.checkin} onChange={v => upd("checkin", v)} err={!!errors.checkin} /></Field>
                <Field label="Check-out" htmlFor="nr-out" required error={errors.checkout} hint={form.checkout > form.checkin ? `${nights} night${nights === 1 ? "" : "s"}` : undefined}><Input id="nr-out" type="date" value={form.checkout} onChange={v => upd("checkout", v)} err={!!errors.checkout} /></Field>
                <Field label="Booked by" htmlFor="nr-src"><Select id="nr-src" value={form.source} onChange={v => upd("source", v)} options={["Phone", "Walk-in", "Email", "Online", "OTA", "Corporate", "Direct"]} /></Field>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Adults" htmlFor="nr-ad"><Select id="nr-ad" value={form.adults} onChange={v => upd("adults", v)} options={["1", "2", "3", "4"]} /></Field>
                <Field label="Children" htmlFor="nr-ch"><Select id="nr-ch" value={form.children} onChange={v => upd("children", v)} options={["0", "1", "2", "3"]} /></Field>
              </div>
              <div>
                <SectionTitle sub="Prices are per night before VAT. Availability is for the dates above.">Room type</SectionTitle>
                <div className="space-y-2.5">
                  {types.map(t => {
                    const free = freeRooms(t).length;
                    return (
                      <Choice key={t} name="room-type" selected={form.roomType === t} title={t} sub={ROOM_DESC(t)}
                        badge={<span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: free ? "#F0FDF4" : "#FEF2F2", color: free ? "#166534" : "#991B1B" }}>{free ? `${free} free` : "Full"}</span>}
                        onSelect={() => { upd("roomType", t); upd("roomNumber", ""); upd("nightlyRate", String(roomPrice(t))); upd("ratePlan", "Standard Rate"); setManualRate(false); }}
                        aside={<><span className="block text-base font-semibold" style={{ color: TEXT }}>{naira(roomPrice(t))}</span><span className="text-sm" style={{ color: MUTED }}>per night</span></>} />
                    );
                  })}
                </div>
              </div>
              <div>
                <SectionTitle sub="Leave it for check-in if you are not sure yet.">Room</SectionTitle>
                <Pills label="Room" value={form.roomNumber} onChange={v => upd("roomNumber", v)}
                  options={[{ v: "", l: "Assign at check-in" }, ...freeRooms(form.roomType).map(r => ({ v: r, l: `Room ${r}` }))]} />
                {freeRooms(form.roomType).length === 0 && <p className="text-sm mt-2" style={{ color: ERROR }}>No {form.roomType.toLowerCase()} rooms are free for these nights. Try other dates or put the guest on the waitlist.</p>}
              </div>
            </>)}

            {step === 2 && (<>
              <div className="space-y-2.5">
                {RATE_PLANS.filter(r => r.active && r.rooms.includes(form.roomType)).map((plan, idx) => (
                  <Choice key={plan.id} name="rate-plan" selected={form.ratePlan === plan.name && !manualRate} title={plan.name} sub={plan.dates}
                    badge={idx === 0 ? <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: "#F0FDFA", color: TEAL_INK }}>Usual rate</span> : undefined}
                    onSelect={() => { upd("ratePlan", plan.name); upd("nightlyRate", String(planPrice(plan.base))); setManualRate(false); }}
                    aside={<><span className="block text-base font-semibold" style={{ color: TEXT }}>{naira(planPrice(plan.base))}</span><span className="text-sm" style={{ color: MUTED }}>per night</span></>} />
                ))}
              </div>
              <div className="px-4" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.control + 2 }}>
                <ToggleRow title="Agreed price" sub="A price agreed with the guest. A manager approves it at check-in." on={manualRate} toggle={() => setManualRate(m => !m)} />
                {manualRate && (
                  <div className="pb-4 max-w-xs"><Field label="Price per night (₦)" htmlFor="nr-rate"><Input id="nr-rate" type="number" value={form.manualRateVal} onChange={v => upd("manualRateVal", v)} placeholder="45000" /></Field></div>
                )}
              </div>
              <div className="p-4" style={{ backgroundColor: UI.surface, borderRadius: UI.radius.control + 2 }}>
                <Row label={`${naira(baseRate)} × ${nights} night${nights === 1 ? "" : "s"}`} value={naira(baseRate * nights)} />
                <Row label="VAT 7.5%" value={naira(Math.round(baseRate * nights * 0.075))} />
                <div className="mt-1 pt-1" style={{ borderTop: `1px solid ${BORDER}` }}><Row label="Room total" value={naira(Math.round(baseRate * nights * 1.075))} strong /></div>
              </div>
            </>)}

            {step === 3 && (<>
              <Field label="Returning guest" htmlFor="nr-find" hint="Type at least two letters of a name or a booking number.">
                <div className="relative">
                  <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SUBTLE }} />
                  <input id="nr-find" value={guestSearchQ} onChange={e => { setGuestSearchQ(e.target.value); setShowGuestResults(true); }} onFocus={() => setShowGuestResults(true)}
                    placeholder="Search guests" className={controlClass} style={{ ...controlStyle(), paddingLeft: 40 }} />
                </div>
                {showGuestResults && GUEST_SUGGESTIONS.length > 0 && (
                  <div className="mt-1 overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.control, boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
                    {GUEST_SUGGESTIONS.map(g => (
                      <button key={g.id} type="button" className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                        onClick={() => {
                          const first = g.guest.split(" ")[0].toLowerCase(), last = g.guest.split(" ").pop()?.toLowerCase() ?? "";
                          upd("guestName", g.guest); upd("phone", `+234 80${g.id.slice(-1)} 000 ${g.id.slice(-4)}`); upd("email", `${first}.${last}@example.com`);
                          upd("idNum", `NG${g.id.replace(/\D/g, "").slice(-8).padStart(8, "0")}`);
                          setGuestSearchQ(g.guest); setShowGuestResults(false); add({ type: "info", title: `${g.guest}'s details filled in` });
                        }}>
                        <span><span className="block text-sm font-medium" style={{ color: TEXT }}>{g.guest}</span><span className="text-sm" style={{ color: MUTED }}>{g.id} · stayed {g.checkin} to {g.checkout}</span></span>
                        <span className="text-sm font-medium" style={{ color: TEAL_INK }}>Use</span>
                      </button>
                    ))}
                  </div>
                )}
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name" htmlFor="nr-name" required error={errors.guestName}><Input id="nr-name" value={form.guestName} onChange={v => upd("guestName", v)} placeholder="As on their ID" err={!!errors.guestName} /></Field>
                <Field label="Phone" htmlFor="nr-phone" required error={errors.phone}><Input id="nr-phone" value={form.phone} onChange={v => upd("phone", v)} placeholder="+234 80x xxx xxxx" err={!!errors.phone} /></Field>
                <Field label="Email" htmlFor="nr-email" hint="For the confirmation and receipt"><Input id="nr-email" type="email" value={form.email} onChange={v => upd("email", v)} placeholder="guest@example.com" /></Field>
                <Field label="Nationality" htmlFor="nr-nat"><Select id="nr-nat" value={form.nationality} onChange={v => upd("nationality", v)} options={["Nigerian", "Ghanaian", "Kenyan", "South African", "British", "American", "Other"]} /></Field>
                <Field label="ID type" htmlFor="nr-idt"><Select id="nr-idt" value={form.idType} onChange={v => upd("idType", v)} options={["NIN", "Passport", "National ID", "Driver's Licence"]} /></Field>
                <Field label="ID number" htmlFor="nr-idn" required error={errors.idNum}><Input id="nr-idn" value={form.idNum} onChange={v => upd("idNum", v)} placeholder="Document number" err={!!errors.idNum} /></Field>
                <Field label="Company" htmlFor="nr-co" hint="Only for corporate bookings"><Input id="nr-co" value={form.company} onChange={v => upd("company", v)} /></Field>
              </div>
              <Field label="Special requests" htmlFor="nr-notes">
                <textarea id="nr-notes" value={form.specialNotes} onChange={e => upd("specialNotes", e.target.value)} placeholder="High floor, anniversary, allergies…" rows={3}
                  className="w-full px-3.5 py-2.5 text-sm outline-none resize-none focus:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]" style={{ border: "1px solid #CBD5E1", borderRadius: UI.radius.control, color: TEXT }} />
              </Field>
              <div className="px-4" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.control + 2 }}>
                <ToggleRow title="VIP guest" sub="Flags the booking for priority service and amenities." on={form.vip as boolean} toggle={() => upd("vip", !form.vip)} />
              </div>
            </>)}

            {step === 4 && (<>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {EXTRAS_CATALOG.map(ex => {
                  const on = form.extras.includes(ex.name), price = extraPrice(ex.name);
                  return (
                    <label key={ex.name} className="flex items-center gap-3 p-3.5 cursor-pointer" style={{ borderRadius: UI.radius.control + 2, border: `${on ? 2 : 1}px solid ${on ? UI.focus : "#CBD5E1"}`, backgroundColor: on ? UI.selectedBg : "white", margin: on ? 0 : 1 }}>
                      <input type="checkbox" checked={on} onChange={() => upd("extras", on ? form.extras.filter(e => e !== ex.name) : [...form.extras, ex.name])} className="w-4 h-4 accent-[#0F766E]" />
                      <span className="flex-1 text-sm font-medium" style={{ color: TEXT }}>{ex.name}</span>
                      <span className="text-sm" style={{ color: MUTED }}>{price === 0 ? "Free" : naira(price)}</span>
                    </label>
                  );
                })}
              </div>
              {form.extras.includes("Airport pick-up") && (
                <div className="max-w-xs"><Field label="Flight number" htmlFor="nr-flight" hint="So the driver can track the arrival."><Input id="nr-flight" value={form.flightNum} onChange={v => upd("flightNum", v)} placeholder="QR 1401" /></Field></div>
              )}
            </>)}

            {step === 5 && (<>
              <div>
                <SectionTitle>How much to take now</SectionTitle>
                <Pills label="Deposit" value={form.depositPct} onChange={v => { upd("depositPct", v); upd("depositAmount", ""); }}
                  options={[{ v: "0", l: "No deposit" }, { v: "25", l: "25%" }, { v: "50", l: "50%" }, { v: "100", l: "Full amount" }]} />
              </div>
              <div className="p-5" style={{ backgroundColor: UI.surface, borderRadius: UI.radius.control + 2 }}>
                <p className="text-sm" style={{ color: MUTED }}>Deposit due now</p>
                <p className="mt-1" style={{ color: TEXT, fontSize: 28, fontWeight: 600 }}>{naira(depositAmt)}</p>
                <p className="text-sm" style={{ color: MUTED }}>{form.depositAmount ? "Amount entered by hand" : `${form.depositPct}% of ${naira(total)}`}</p>
              </div>
              <Field label="Different amount (₦)" htmlFor="nr-dep" hint="Leave empty to use the percentage above."><Input id="nr-dep" type="number" value={form.depositAmount} onChange={v => upd("depositAmount", v)} /></Field>
              {Number(form.depositPct) > 0 && (<>
                <div>
                  <SectionTitle>Paid by</SectionTitle>
                  <Pills label="Payment method" value={form.payMethod} onChange={v => upd("payMethod", v)} options={["Cash", "POS / Card", "Bank Transfer"].map(m => ({ v: m, l: m === "POS / Card" ? "Card (POS)" : m === "Bank Transfer" ? "Bank transfer" : m }))} />
                </div>
                {form.payMethod !== "Cash" && (
                  <Field label={form.payMethod === "POS / Card" ? "POS receipt number" : "Transfer reference"} htmlFor="nr-ref" required error={errors.payRef}>
                    <Input id="nr-ref" value={form.payRef} onChange={v => upd("payRef", v)} placeholder={form.payMethod === "POS / Card" ? "POS-00124381" : "NGBT-20260624-0042"} err={!!errors.payRef} />
                  </Field>
                )}
              </>)}
            </>)}

            {step === 6 && (<>
              {([
                ["Stay", 1, [["Dates", `${fmtDate(form.checkin)} to ${fmtDate(form.checkout)}`], ["Nights", String(nights)], ["Room", `${form.roomType}${form.roomNumber ? `, room ${form.roomNumber}` : ", assigned at check-in"}`], ["Guests", `${form.adults} adult${form.adults === "1" ? "" : "s"}, ${form.children} child${form.children === "1" ? "" : "ren"}`], ["Booked by", form.source]]],
                ["Rate", 2, [["Plan", manualRate ? "Agreed price" : form.ratePlan], ["Per night", naira(baseRate)]]],
                ["Guest", 3, [["Name", form.guestName], ["Phone", form.phone], ["Email", form.email || "Not given"], ["ID", `${form.idType} ${form.idNum}`], ...(form.company ? [["Company", form.company]] : []), ...(form.vip ? [["VIP", "Yes"]] : []), ...(form.specialNotes ? [["Requests", form.specialNotes]] : [])]],
                ["Extras", 4, form.extras.length ? form.extras.map(e => [e, extraPrice(e) ? naira(extraPrice(e)) : "Free"]) : [["Extras", "None"]]],
                ["Deposit", 5, [["Due now", naira(depositAmt)], ["Paid by", Number(form.depositPct) > 0 ? form.payMethod : "No deposit"], ...(form.payRef ? [["Reference", form.payRef]] : [])]],
              ] as [string, number, string[][]][]).map(([title, n, rows]) => (
                <div key={title} style={{ borderBottom: `1px solid ${BORDER}` }} className="pb-4">
                  <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{title}</h3><button type="button" onClick={() => setStep(n)} className="text-sm font-medium h-8" style={{ color: TEAL_INK }}>Change</button></div>
                  {rows.map(([k, v]) => <Row key={k} label={k} value={v} />)}
                </div>
              ))}
              <div>
                <SectionTitle>After confirming</SectionTitle>
                <ToggleRow title="Email the confirmation" on={form.sendEmail as boolean} toggle={() => upd("sendEmail", !form.sendEmail)} />
                <ToggleRow title="Text the confirmation" on={form.sendSMS as boolean} toggle={() => upd("sendSMS", !form.sendSMS)} />
                <ToggleRow title="Print the registration card" on={form.printRegCard as boolean} toggle={() => upd("printRegCard", !form.printRegCard)} />
              </div>
            </>)}
          </div>
        </Card>

        {/* Summary */}
        <aside className="xl:sticky xl:top-4">
          <Card title="Summary">
            <p className="text-base font-semibold" style={{ color: form.guestName ? TEXT : MUTED }}>{form.vip && "★ "}{form.guestName || "Guest not added yet"}</p>
            <p className="text-sm" style={{ color: MUTED }}>{form.roomType}{form.roomNumber ? ` · Room ${form.roomNumber}` : " · Room at check-in"}</p>
            <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
              <Row label="Check-in" value={fmtDate(form.checkin)} />
              <Row label="Check-out" value={fmtDate(form.checkout)} />
              <Row label="Guests" value={`${form.adults} + ${form.children}`} />
            </div>
            <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
              <Row label={`Room, ${nights} night${nights === 1 ? "" : "s"}`} value={naira(baseRate * nights)} />
              {extrasTotal > 0 && <Row label={`Extras (${form.extras.length})`} value={naira(extrasTotal)} />}
              <Row label="VAT 7.5%" value={naira(vat)} />
              <div className="mt-1 pt-1" style={{ borderTop: `1px solid ${BORDER}` }}><Row label="Total" value={naira(total)} strong /></div>
            </div>
            {Number(form.depositPct) > 0 && (
              <div className="mt-3 px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: "#F0FDFA", borderRadius: UI.radius.control }}>
                <span className="text-sm" style={{ color: TEAL_INK }}>Deposit due now</span>
                <span className="text-sm font-semibold" style={{ color: TEAL_INK }}>{naira(depositAmt)}</span>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

export function CheckOut({ add, initialReservationId = "", staffName }: { add: (t: Omit<Toast, "id">) => void; initialReservationId?: string; staffName: string }) {

  // The list as the screen opened, so a guest just checked out stays on screen with their receipt.
  const [ALL_GUESTS] = useState(checkoutGuests);

  const BASE_CHARGES = CHARGES;

  const [selectedId, setSelectedId]         = useState("BK-2848");
  const [chargesMap, setChargesMap]         = useState<Record<string, ChargeRow[]>>(BASE_CHARGES);
  const [checkedOutIds, setCheckedOutIds]   = useState<string[]>([]);
  const [payMethod, setPayMethod]           = useState("Cash");
  const [cashAmt, setCashAmt]               = useState("");
  const [cardAmt, setCardAmt]               = useState("");
  const [cardRef, setCardRef]               = useState("");
  const [bankRef, setBankRef]               = useState("");
  const [corporateAccount, setCorporateAccount] = useState("Bello & Associates Ltd.");
  const [corporateRef, setCorporateRef]      = useState("");
  const [voidLine, setVoidLine]             = useState<number | null>(null);
  const [voidReason, setVoidReason]         = useState("");
  const [showDiscount, setShowDiscount]     = useState(false);
  const [discountAmt, setDiscountAmt]       = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [showLateCharge, setShowLateCharge] = useState(false);
  const [lateChargeCat, setLateChargeCat]   = useState("Bar");
  const [lateChargeDesc, setLateChargeDesc] = useState("");
  const [lateChargeAmt, setLateChargeAmt]   = useState("");
  const [accessRevoked, setAccessRevoked]   = useState<Record<string, boolean>>({});
  const [keyReturned, setKeyReturned]       = useState<Record<string, boolean>>({});
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, "sent" | "skipped">>({});
  const [guestSearch, setGuestSearch]       = useState("");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [earlyDepartureReason, setEarlyDepartureReason] = useState("");
  const [showSplitFolio, setShowSplitFolio] = useState(false);
  const [splitLines, setSplitLines] = useState<number[]>([]);
  const [splitTarget, setSplitTarget] = useState("Guest Folio B");
  const [splitReference, setSplitReference] = useState("");
  const [showTransferCharge, setShowTransferCharge] = useState(false);
  const [transferLine, setTransferLine] = useState<number | null>(null);
  const [transferTarget, setTransferTarget] = useState("Guest Folio");
  const [transferReference, setTransferReference] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [showExtendStay, setShowExtendStay] = useState(false);
  const [extensionNights, setExtensionNights] = useState("1");
  const [extensionReason, setExtensionReason] = useState("");
  const [extensionMap, setExtensionMap] = useState<Record<string, number>>({});
  const [checkoutOverrides, setCheckoutOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    const [reservationId, context] = initialReservationId.split("|");
    if (reservationId && ALL_GUESTS.some(d => d.id === reservationId)) {
      setSelectedId(reservationId);
      if (context === "revoked") setAccessRevoked(state => ({ ...state, [reservationId]: true }));
    }
  }, [initialReservationId]);

  const addDaysLabel = (label: string, days: number) => {
    const [day, mon] = label.split(" ");
    const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const date = new Date(2026, months[mon] ?? 0, Number(day));
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  // A quiet day has nobody to check out; the placeholder keeps the hooks below in order.
  const baseGuest = ALL_GUESTS.find(d => d.id === selectedId) ?? ALL_GUESTS[0] ?? { id: "", guest: "", av: "", room: "", type: "", nights: 0, checkin: "", checkout: "", deposit: 0, vip: false, phone: "", visits: 0, dueToday: false };
  const addedNights = extensionMap[selectedId] ?? 0;
  const g = {
    ...baseGuest,
    nights: baseGuest.nights + addedNights,
    checkout: checkoutOverrides[selectedId] ?? baseGuest.checkout,
    dueToday: addedNights > 0 ? false : baseGuest.dueToday,
  };
  const charges    = chargesMap[selectedId] ?? [];
  const setCharges = (fn: (p: ChargeRow[]) => ChargeRow[]) =>
    setChargesMap(m => ({ ...m, [selectedId]: fn(m[selectedId] ?? []) }));

  const isCheckedOut = checkedOutIds.includes(selectedId);
  const gDiscount    = discountOf(selectedId);
  const gAccess      = accessRevoked[selectedId] ?? false;
  const gKey         = keyReturned[selectedId]   ?? false;
  const gFeedback    = feedbackStatus[selectedId];

  const activeCharges = charges.filter(c => !c.reversed && !c.movedTo);
  const subtotal     = activeCharges.reduce((s, c) => s + c.amount, 0);
  const taxTotal     = activeCharges.reduce((s, c) => s + c.tax, 0);
  const grand        = subtotal + taxTotal;
  const balance      = Math.max(0, grand - g.deposit - gDiscount);
  const discountNum  = parseInt(discountAmt || "0") || 0;
  const cashNum      = parseInt(cashAmt.replace(/,/g, "")) || 0;
  const cardNum      = parseInt(cardAmt.replace(/,/g, "")) || 0;
  const totalReceived =
    payMethod === "Cash"       ? cashNum :
    payMethod === "POS / Card" ? cardNum :
    payMethod === "Cash + POS" ? cashNum + cardNum : balance;
  const changeAmt    = Math.max(0, totalReceived - balance);
  const paymentEvidenceOk =
    payMethod === "Cash" ? cashNum >= balance :
    payMethod === "POS / Card" ? cardNum >= balance && !!cardRef.trim() :
    payMethod === "Cash + POS" ? cashNum > 0 && cardNum > 0 && cashNum + cardNum >= balance && !!cardRef.trim() :
    payMethod === "Bank Transfer" ? !!bankRef.trim() :
    payMethod === "Corporate Account" ? !!corporateAccount && !!corporateRef.trim() :
    false;
  const balanceCovered =
    balance === 0 ||
    paymentEvidenceOk;
  const canCheckOut  = balanceCovered && gAccess && gKey && !isCheckedOut;
  const releaseConfirmed = g.dueToday || !!earlyDepartureReason.trim();
  const splitTotal = splitLines.reduce((sum, index) => {
    const charge = charges[index];
    return charge && !charge.reversed && !charge.movedTo ? sum + charge.amount + charge.tax : sum;
  }, 0);
  const extensionCount = Math.max(1, parseInt(extensionNights) || 1);
  const nightlyRate = roomPrice(g.type);
  const extensionSubtotal = nightlyRate * extensionCount;
  const extensionTax = Math.round(extensionSubtotal * 0.075);
  const extensionCheckout = addDaysLabel(g.checkout, extensionCount);

  const catColor: Record<string, string> = { Room: PRIMARY, Restaurant: TEAL, Bar: ORANGE, Laundry: MUTED, "Late Charge": ERROR };

  const CK_BG  = "white";
  const CK_BD  = "#E2E8F0";
  const CK_DSH = "#CBD5E1";
  const CK_MUT = "#475569";

  const Notch = () => (
    <div className="flex items-center px-5" style={{ margin: "-1px 0", position: "relative", zIndex: 2, backgroundColor: CK_BG }}>
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "white", border: `1.5px solid ${CK_BD}`, marginLeft: -8 }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: CK_DSH }} />
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "white", border: `1.5px solid ${CK_BD}`, marginRight: -8 }} />
    </div>
  );

  // ── POST-CHECKOUT SUCCESS STATE ─────────────────────────────────────────
  if (ALL_GUESTS.length === 0) return (
    <div>
      <PageHeader title="Guest Check-Out" sub={`Business date ${fmtDate(BUSINESS_DATE)}`} />
      <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
        <EmptyState icon={SignOut} message="Nobody is checked in, so there is no one to check out. Guests appear here once they check in." />
      </div>
    </div>
  );
  if (isCheckedOut) return (
    <div>
      <PageHeader title="Guest Check-Out" sub={`${g.guest} · Room ${g.room}`} />
      <div className="overflow-hidden bg-white" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
                <div className="p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#D1FAE5" }}>
            <CheckCircle size={32} weight="bold" style={{ color: SUCCESS }} />
          </div>
          <p className="text-sm font-medium mb-2" style={{ color: SUCCESS }}>Checked out · {g.id}</p>
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
          {ALL_GUESTS.some(d => !checkedOutIds.includes(d.id)) && (
            <button onClick={() => {
              const remaining = ALL_GUESTS.filter(d => !checkedOutIds.includes(d.id));
              if (remaining.length > 0) setSelectedId(remaining[0].id);
            }} className="text-sm px-6 py-2.5 rounded-xl font-bold text-white" style={{ backgroundColor: PRIMARY }}>
              Next Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── MAIN CHECKOUT VIEW ──────────────────────────────────────────────────
  const q = guestSearch.toLowerCase();
  const filteredDue = ALL_GUESTS.filter(d => d.dueToday && !(extensionMap[d.id] > 0) && (!q || d.guest.toLowerCase().includes(q) || d.room.includes(q)));
  const filteredIH  = ALL_GUESTS.filter(d => (!d.dueToday || extensionMap[d.id] > 0) && (!q || d.guest.toLowerCase().includes(q) || d.room.includes(q)));

  const pick = (id: string) => {
    setSelectedId(id); setPayMethod("Cash"); setCashAmt(""); setCardAmt(""); setCardRef(""); setBankRef(""); setCorporateRef("");
    setEarlyDepartureReason(""); setShowReleaseConfirm(false); setShowRevokeConfirm(false);
    setShowSplitFolio(false); setSplitLines([]); setShowTransferCharge(false); setTransferLine(null); setShowExtendStay(false);
  };
  const GuestRow = ({ d }: { d: typeof ALL_GUESTS[0] }) => {
    const active = d.id === selectedId;
    const done   = checkedOutIds.includes(d.id);
    const displayedCheckout = checkoutOverrides[d.id] ?? d.checkout;
    return (
      <button onClick={() => pick(d.id)}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl mb-0.5 text-left transition-all relative"
        style={{ backgroundColor: done ? `${SUCCESS}10` : active ? UI.selectedBg : "transparent", boxShadow: active ? `inset 3px 0 0 ${UI.focus}` : undefined }}>
        {done && <div className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: SUCCESS }}><CheckCircle size={9} color="white" weight="bold" /></div>}
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: done ? SUCCESS : d.vip ? ORANGE : PRIMARY }}>
          <User size={13} color="white" weight="bold" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" style={{ color: done ? SUCCESS : TEXT }}>{d.guest}</p>
          <p className="text-xs truncate" style={{ color: CK_MUT }}>Room {d.room} · {displayedCheckout}</p>
        </div>
        {!d.dueToday && !done
          ? <span className="text-xs font-bold flex-shrink-0" style={{ color: TEAL_INK, fontSize: 12 }}>Early</span>
          : d.vip && !done && <span className="text-xs font-bold flex-shrink-0" style={{ color: ORANGE_INK, fontSize: 12 }}>VIP</span>}
      </button>
    );
  };

  return (
    <div>
      <PageHeader title="Guest Check-Out" sub={`Settle the bill, take the key back and close the stay. Business date ${fmtDate(BUSINESS_DATE)}.`} />

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* ── GUEST LIST PANEL ── */}
        <div className="hidden xl:block w-64 flex-shrink-0 overflow-hidden bg-white sticky top-4" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Guests in house</h2>
            <p className="text-sm" style={{ color: MUTED }}>{ALL_GUESTS.length} guests</p>
          </div>
          <div className="p-2.5 border-b" style={{ borderColor: CK_BD }}>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
              <MagnifyingGlass size={12} style={{ color: CK_MUT }} />
              <input value={guestSearch} onChange={e => setGuestSearch(e.target.value)} placeholder="Name or room…" aria-label="Name or room"
                className="flex-1 text-xs outline-none bg-transparent" style={{ color: TEXT }} />
              {guestSearch && <button aria-label="Close" onClick={() => setGuestSearch("")} style={{ color: CK_MUT }}><XCircle size={12} /></button>}
            </div>
          </div>
          <div className="p-2.5 overflow-y-auto" style={{ maxHeight: 420 }}>
            {filteredDue.length > 0 && (
              <>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="font-medium" style={{ color: ERROR, fontSize: 13 }}>Leaving today</span>
                  <span className="font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${ERROR}15`, color: ERROR, fontSize: 12 }}>{filteredDue.length}</span>
                </div>
                {filteredDue.map(d => <GuestRow key={d.id} d={d} />)}
              </>
            )}
            {filteredIH.length > 0 && (
              <div className={filteredDue.length > 0 ? "mt-3" : ""}>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="font-medium" style={{ color: TEAL_INK, fontSize: 13 }}>Leaving later</span>
                  <span className="font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${TEAL}15`, color: TEAL_INK, fontSize: 12 }}>{filteredIH.length}</span>
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
        <div className="flex-1 min-w-0 w-full">
          {/* Narrow screens: pick the guest from a list instead of the side panel */}
          <div className="xl:hidden mb-4 max-w-md">
            <Field label="Guest" htmlFor="co-guest">
              <select id="co-guest" value={selectedId} onChange={e => pick(e.target.value)} className={controlClass} style={controlStyle()}>
                {ALL_GUESTS.map(d => <option key={d.id} value={d.id}>{d.guest} · room {d.room}{d.dueToday ? " · leaving today" : ""}</option>)}
              </select>
            </Field>
          </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        {/* ── FOLIO ── */}
        <div className="space-y-4 min-w-0">
          <div className="overflow-hidden bg-white" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
            <div className="flex flex-col gap-3 px-5 pt-5 pb-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>{g.vip && "★ "}{g.guest} · Room {g.room}</h2>
                <p className="text-sm mt-0.5" style={{ color: MUTED }}>{g.id} · {g.checkin} to {g.checkout} · {g.visits === 1 ? "First stay" : `${g.visits} stays with us`}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowDiscount(true)} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>{discountNum > 5000 ? "Send for approval" : "Apply discount"}</button>
                <button onClick={() => setShowLateCharge(true)} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>Add late charge</button>
                <button onClick={() => { setSplitLines([]); setSplitTarget("Guest Folio B"); setSplitReference(""); setShowSplitFolio(true); }} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>Split folio</button>
                <button onClick={() => { setTransferLine(null); setTransferTarget("Guest Folio"); setTransferReference(""); setTransferReason(""); setShowTransferCharge(true); }} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>Transfer a charge</button>
                <button onClick={() => add({ type: "info", title: "Folio sent to printer" })} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>Print folio</button>
                <button onClick={() => add({ type: "info", title: "Folio emailed", body: g.guest })} className="text-sm px-3 rounded-lg font-medium flex-shrink-0 bg-white" style={{ height: 34, color: TEXT, border: "1px solid #CBD5E1" }}>Email folio</button>
              </div>
            </div>
                        <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: CK_BG }}>
                    {["Date", "Type", "Item", "Amount", "VAT", "Posted by", ""].map((h, i) => (
                      <th key={i} className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap ${i === 3 || i === 4 ? "text-right" : "text-left"}`} style={{ color: MUTED, backgroundColor: UI.surface }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {charges.map((c, i) => (
                    <tr key={i} className="border-t transition-colors hover:bg-white" style={{ borderColor: CK_BD, opacity: c.reversed || c.movedTo ? 0.5 : 1 }}>
                      <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: CK_MUT }}>{c.date}</td>
                      <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap" style={{ backgroundColor: (catColor[c.cat] ?? MUTED) + "18", color: catColor[c.cat] ?? MUTED }}>{c.cat}</span></td>
                      <td className="px-3 py-3 text-sm" style={{ color: c.reversed || c.movedTo ? CK_MUT : TEXT }}>
                        {c.reversed ? <span className="line-through">{c.desc}</span> : c.desc}
                        {c.qty > 1 && <span className="block text-xs" style={{ color: SUBTLE }}>{c.qty} × ₦{c.unit.toLocaleString()}</span>}
                        {c.movedTo && <span className="block text-xs font-medium mt-0.5" style={{ color: TEAL_INK }}>Moved to {c.movedTo}</span>}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-right whitespace-nowrap" style={{ color: c.reversed ? CK_MUT : TEXT }}>₦{c.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm text-right whitespace-nowrap" style={{ color: SUBTLE }}>₦{c.tax.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: SUBTLE }}>{c.by}</td>
                      <td className="px-3 py-3">
                        {!c.reversed && !c.movedTo
                          ? <button onClick={() => { setVoidLine(i); setVoidReason(""); }} className="text-xs px-2 py-1 rounded-lg border font-semibold" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Void</button>
                          : <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: c.movedTo ? "#CCFBF1" : "#FEE2E2", color: c.movedTo ? TEAL : ERROR }}>{c.movedTo ? "Moved" : "Voided"}</span>}
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
                  <div className="flex justify-between font-medium"><span style={{ color: TEXT }}>Total charges</span><span>₦{(subtotal + taxTotal).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span style={{ color: CK_MUT }}>Deposit paid</span><span style={{ color: TEXT, fontFamily: mono }}>−₦{g.deposit.toLocaleString()}</span></div>
                  {gDiscount > 0 && <div className="flex justify-between"><span style={{ color: CK_MUT }}>Discount</span><span style={{ color: TEXT, fontFamily: mono }}>−₦{gDiscount.toLocaleString()}</span></div>}
                  <div className="flex justify-between font-semibold text-base border-t pt-2" style={{ borderColor: CK_BD, color: balance > 0 ? ERROR : SUCCESS }}>
                    <span>Balance due</span><span style={{ fontFamily: mono }}>₦{balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout checklist card */}
          <div className="overflow-hidden bg-white" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
            <div className="px-5 pt-5"><h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Before the guest leaves</h2></div>
                        <div className="p-5 space-y-4">
              {/* Access revocation */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: gAccess ? "#D1FAE5" : "#FEF2F2" }}>
                    <Lock size={15} weight="bold" style={{ color: gAccess ? SUCCESS : ERROR }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEXT }}>Room access credentials</p>
                    <p className="text-xs mt-0.5" style={{ color: CK_MUT }}>Key Card ×1 · PIN Active · Room {g.room} · TTLock</p>
                    <p className="text-xs mt-0.5" style={{ color: SUBTLE }}>Immediate revocation — stops working within 30s</p>
                  </div>
                </div>
                {!gAccess
                  ? <button onClick={() => setShowRevokeConfirm(true)}
                      className="text-xs px-3 py-1.5 rounded-lg font-bold text-white flex-shrink-0" style={{ backgroundColor: ERROR }}>Revoke now</button>
                  : <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold flex-shrink-0" style={{ backgroundColor: "#D1FAE5", color: SUCCESS }}><CheckCircle size={11} weight="bold" />Revoked</span>}
              </div>

              {/* Key return */}
              <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: CK_DSH }}>
                <button aria-label="Physical key card returned" role="checkbox" aria-checked={!!(gKey)} onClick={() => setKeyReturned(p => ({ ...p, [selectedId]: !gKey }))}
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
                <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Guest feedback</p>
                <p className="text-xs mb-3" style={{ color: CK_MUT }}>Send a post-stay feedback request to the guest.</p>
                {!gFeedback ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setFeedbackStatus(p => ({ ...p, [selectedId]: "sent" })); add({ type: "success", title: "Feedback sent via WhatsApp", body: g.guest }); }}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: TEAL_INK, borderColor: `${TEAL}40` }}>WhatsApp</button>
                    <button onClick={() => { setFeedbackStatus(p => ({ ...p, [selectedId]: "sent" })); add({ type: "success", title: "Feedback sent via Email", body: g.guest }); }}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Email</button>
                    <button onClick={() => setFeedbackStatus(p => ({ ...p, [selectedId]: "skipped" }))}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold" style={{ color: CK_MUT, borderColor: CK_DSH }}>Skip</button>
                  </div>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: gFeedback === "sent" ? SUCCESS : CK_MUT }}>
                    {gFeedback === "sent" ? <CheckCircle size={12} weight="bold" /> : <MinusCircle size={12} weight="bold" />}
                    {gFeedback === "sent" ? "Feedback request sent" : "Feedback request skipped"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── SETTLEMENT SIDEBAR ── */}
        <div className="space-y-4 2xl:sticky 2xl:top-4">
          <div className="overflow-hidden bg-white" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
            <div className="px-5 pt-5"><h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Settle the bill</h2></div>
                        <div className="p-5">
              <div className="font-bold mb-0.5" style={{ fontSize: 28, color: balance > 0 ? ERROR : SUCCESS }}>₦{balance.toLocaleString()}</div>
              <div className="text-xs mb-4" style={{ color: CK_MUT }}>Balance due after deposit{gDiscount > 0 ? " & discount" : ""}</div>

              {balance === 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs font-bold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
                  <CheckCircle size={14} weight="bold" />Zero balance — express check-out ready
                </div>
              )}

              {balance > 0 && (
                <>
                  <p className="text-sm font-medium mb-2" style={{ color: TEXT }}>Payment method</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-1 gap-2 mb-4">
                    {["Cash", "POS / Card", "Cash + POS", "Bank transfer", "Corporate account"].map(m => (
                      <button key={m} onClick={() => setPayMethod(m)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                        style={{ border: payMethod === m ? `2px solid ${PRIMARY}` : `1px solid ${CK_BD}`, backgroundColor: payMethod === m ? `${PRIMARY}08` : "white" }}>
                        <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                          style={{ borderColor: payMethod === m ? PRIMARY : CK_DSH, backgroundColor: payMethod === m ? PRIMARY : "transparent" }}>
                          {payMethod === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm" style={{ color: TEXT }}>{m}</span>
                      </button>
                    ))}
                  </div>

                  {(payMethod === "Cash" || payMethod === "Cash + POS") && (
                    <div className="mb-3">
                      <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Cash received (₦)</label>
                      <input aria-label="Cash received (₦)" type="number" value={cashAmt} onChange={e => setCashAmt(e.target.value)} placeholder={balance.toLocaleString()}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                    </div>
                  )}
                  {(payMethod === "POS / Card" || payMethod === "Cash + POS") && (
                    <div className="mb-3 space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Card amount (₦)</label>
                        <input aria-label="Card amount (₦)" type="number" value={cardAmt} onChange={e => setCardAmt(e.target.value)} placeholder={balance.toLocaleString()}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>POS reference *</label>
                        <input value={cardRef} onChange={e => setCardRef(e.target.value)} placeholder="POS-2025-XXXXXX" aria-label="POS-2025-XXXXXX"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ border: `1.5px solid ${cardRef ? CK_DSH : ERROR}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                      </div>
                    </div>
                  )}
                  {payMethod === "Bank Transfer" && (
                    <div className="mb-3">
                      <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Transfer reference *</label>
                      <input value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="TRN-2025-XXXXXX" aria-label="TRN-2025-XXXXXX"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${bankRef ? CK_DSH : ERROR}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                    </div>
                  )}
                  {payMethod === "Corporate Account" && (
                    <div className="mb-4 space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Corporate account</label>
                        <select aria-label="Corporate account" value={corporateAccount} onChange={e => setCorporateAccount(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
                          style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT }}>
                          {["Bello & Associates Ltd.", "Lagos Corp Group", "Federal Ministry of Works"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Purchase order number *</label>
                        <input value={corporateRef} onChange={e => setCorporateRef(e.target.value)} placeholder="PO-2025-XXXX" aria-label="PO-2025-XXXX"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ border: `1.5px solid ${corporateRef ? CK_DSH : ERROR}`, backgroundColor: "white", color: TEXT, fontFamily: mono }} />
                      </div>
                    </div>
                  )}

                  {(payMethod === "Cash" || payMethod === "POS / Card" || payMethod === "Cash + POS") && totalReceived > 0 && (
                    <div className="p-3 rounded-xl mb-3 space-y-1.5 text-xs" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
                      <div className="flex justify-between"><span style={{ color: CK_MUT }}>Total received</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{totalReceived.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span style={{ color: CK_MUT }}>Balance due</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{balance.toLocaleString()}</span></div>
                      {changeAmt > 0 && <div className="flex justify-between border-t pt-1.5" style={{ borderColor: CK_DSH }}><span style={{ color: CK_MUT }}>Change due</span><span className="font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{changeAmt.toLocaleString()}</span></div>}
                      {totalReceived < balance && <div className="flex justify-between border-t pt-1.5" style={{ borderColor: CK_DSH }}><span style={{ color: ERROR }}>Shortfall</span><span className="font-bold" style={{ color: ERROR, fontFamily: mono }}>₦{(balance - totalReceived).toLocaleString()}</span></div>}
                    </div>
                  )}
                </>
              )}

              {/* Pre-checkout checklist summary */}
              <div className="space-y-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "white", border: `1.5px solid ${CK_DSH}` }}>
                <p className="text-sm font-medium mb-2" style={{ color: TEXT }}>Before check-out</p>
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

              {!g.dueToday && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}>
                  <Warning size={14} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Early departure:</strong> review unused-night policy and record a reason before releasing the room.</span>
                </div>
              )}
              <button disabled={!canCheckOut}
                onClick={() => { setEarlyDepartureReason(""); setShowReleaseConfirm(true); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: canCheckOut ? SUCCESS : PRIMARY }}>
                {canCheckOut ? <CheckCircle size={15} weight="bold" /> : <CurrencyDollar size={15} weight="bold" />}
                {!gAccess ? "Revoke access first" : !gKey ? "Confirm key return" : !balanceCovered ? "Settle balance first" : "Process & Release Room"}
              </button>
            </div>
          </div>

          {/* Guest summary card */}
          <div className="overflow-hidden bg-white" style={{ border: `1px solid ${CK_BD}`, borderRadius: UI.radius.card }}>
            <div className="px-5 pt-5"><h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Stay details</h2></div>
            <div className="p-5 pt-2">
              <div>
                {([
                  ["Check-in",  `${g.checkin} 14:00`],
                  ["Check-out", `${g.checkout} ${PROPERTY_PROFILE.checkOutTime}`],
                  ["Nights",    `${g.nights} night${g.nights !== 1 ? "s" : ""}`],
                  ["Phone",     g.phone],
                ] as [string, string][]).map(([k, v]) => <Row key={k} label={k} value={v} />)}
              </div>
              <button disabled={gAccess} onClick={() => { setExtensionNights("1"); setExtensionReason(""); setShowExtendStay(true); }}
                className="w-full mt-4 text-sm font-medium bg-white disabled:opacity-40"
                style={{ height: 40, borderRadius: 10, border: "1px solid #CBD5E1", color: TEXT }}>
                {gAccess ? "Key access ended, the stay can't be extended" : "Extend the stay"}
              </button>
            </div>
          </div>
        </div>
        </div>{/* /flex-1 main content */}
      </div>{/* /flex gap-5 */}

      {showSplitFolio && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowSplitFolio(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-2xl overflow-hidden" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Split the folio · {g.guest}</p>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: CK_MUT }}>Select charges to move</p>
                <div className="space-y-2">
                  {charges.map((charge, index) => {
                    if (charge.reversed || charge.movedTo) return null;
                    const selected = splitLines.includes(index);
                    return (
                      <button key={index} onClick={() => setSplitLines(lines => selected ? lines.filter(i => i !== index) : [...lines, index])}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                        style={{ border: `1.5px solid ${selected ? PRIMARY : CK_DSH}`, backgroundColor: selected ? `${PRIMARY}08` : "white" }}>
                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${selected ? PRIMARY : CK_DSH}`, backgroundColor: selected ? PRIMARY : "white" }}>
                          {selected && <CheckCircle size={12} color="white" weight="bold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{charge.desc}</p>
                          <p className="text-xs" style={{ color: CK_MUT }}>{charge.cat} · {charge.date}</p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{(charge.amount + charge.tax).toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Destination</label>
                  <select aria-label="Destination" value={splitTarget} onChange={e => setSplitTarget(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT }}>
                    {["Guest Folio B", "Company Master Folio", "Shared Guest Folio"].map(option => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Reference / Bill To *</label>
                  <input value={splitReference} onChange={e => setSplitReference(e.target.value)} placeholder="Guest, company, or folio reference" aria-label="Guest, company, or folio reference"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${splitReference.trim() ? CK_DSH : ERROR}` }} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: CK_BG, border: `1px solid ${CK_BD}` }}>
                <span className="text-sm font-semibold" style={{ color: CK_MUT }}>{splitLines.length} charge{splitLines.length === 1 ? "" : "s"} selected</span>
                <span className="text-base font-black" style={{ color: PRIMARY, fontFamily: mono }}>₦{splitTotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSplitFolio(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={splitLines.length === 0 || !splitReference.trim()} onClick={() => {
                  const destination = `${splitTarget} · ${splitReference.trim()}`;
                  setCharges(rows => rows.map((row, index) => splitLines.includes(index) ? { ...row, movedTo: destination } : row));
                  add({ type: "success", title: "Folio split complete", body: `${splitLines.length} charge${splitLines.length === 1 ? "" : "s"} · ₦${splitTotal.toLocaleString()} moved to ${splitReference.trim()}` });
                  setShowSplitFolio(false); setSplitLines([]); setSplitReference("");
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Create split folio</button>
              </div>
            </div>
          </div>
        </>
      )}

      {showTransferCharge && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowTransferCharge(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-lg overflow-hidden" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Transfer charge</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Charge *</label>
                <select aria-label="Charge" value={transferLine ?? ""} onChange={e => setTransferLine(e.target.value === "" ? null : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT }}>
                  <option value="">Select a charge</option>
                  {charges.map((charge, index) => !charge.reversed && !charge.movedTo ? <option key={index} value={index}>{charge.desc} · ₦{(charge.amount + charge.tax).toLocaleString()}</option> : null)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Transfer to</label>
                  <select aria-label="Transfer to" value={transferTarget} onChange={e => setTransferTarget(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT }}>
                    {["Guest Folio", "Company Folio", "Group Master Folio"].map(option => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Folio / Company Reference *</label>
                  <input value={transferReference} onChange={e => setTransferReference(e.target.value)} placeholder="FO-XXXX or company" aria-label="FO-XXXX or company"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${transferReference.trim() ? CK_DSH : ERROR}`, fontFamily: mono }} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Transfer Reason *</label>
                <textarea value={transferReason} onChange={e => setTransferReason(e.target.value)} rows={2} placeholder="Why is this charge being transferred?" aria-label="Why is this charge being transferred?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${CK_DSH}` }} />
              </div>
              {transferLine !== null && charges[transferLine] && (
                <div className="flex justify-between p-3 rounded-xl text-sm" style={{ backgroundColor: CK_BG, border: `1px solid ${CK_BD}` }}>
                  <span style={{ color: CK_MUT }}>Transfer total incl. tax</span>
                  <span className="font-black" style={{ color: TEAL_INK, fontFamily: mono }}>₦{(charges[transferLine].amount + charges[transferLine].tax).toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowTransferCharge(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={transferLine === null || !transferReference.trim() || !transferReason.trim()} onClick={() => {
                  if (transferLine === null) return;
                  const destination = `${transferTarget} · ${transferReference.trim()}`;
                  const charge = charges[transferLine];
                  setCharges(rows => rows.map((row, index) => index === transferLine ? { ...row, movedTo: destination } : row));
                  add({ type: "success", title: "Charge transferred", body: `${charge.desc} → ${transferReference.trim()} · ${transferReason.trim()}` });
                  setShowTransferCharge(false); setTransferLine(null); setTransferReference(""); setTransferReason("");
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: TEAL_INK }}>Confirm transfer</button>
              </div>
            </div>
          </div>
        </>
      )}

      {showExtendStay && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowExtendStay(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-lg overflow-hidden" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Extend the stay · room {g.room}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#F0FDF4", color: "#065F46", border: "1px solid #BBF7D0" }}>
                <CheckCircle size={14} weight="fill" />Room {g.room} is available through {extensionCheckout}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: CK_BG, border: `1px solid ${CK_BD}` }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: CK_MUT }}>Current checkout</p>
                  <p className="text-sm font-bold mt-1" style={{ color: TEXT }}>{g.checkout} · {PROPERTY_PROFILE.checkOutTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Additional nights</label>
                  <select aria-label="Additional nights" value={extensionNights} onChange={e => setExtensionNights(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${CK_DSH}`, backgroundColor: "white", color: TEXT }}>
                    {["1", "2", "3", "4", "5", "7"].map(count => <option key={count} value={count}>{count} night{count === "1" ? "" : "s"}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Extension Reason *</label>
                <textarea value={extensionReason} onChange={e => setExtensionReason(e.target.value)} rows={2} placeholder="Guest request, flight change, business extension…" aria-label="Guest request, flight change, business extension"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${CK_DSH}` }} />
              </div>
              <div className="rounded-xl p-4 space-y-2 text-sm" style={{ backgroundColor: CK_BG, border: `1px solid ${CK_BD}` }}>
                <div className="flex justify-between"><span style={{ color: CK_MUT }}>{extensionCount} night{extensionCount === 1 ? "" : "s"} × ₦{nightlyRate.toLocaleString()}</span><span style={{ fontFamily: mono }}>₦{extensionSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: CK_MUT }}>VAT 7.5%</span><span style={{ fontFamily: mono }}>₦{extensionTax.toLocaleString()}</span></div>
                <div className="flex justify-between font-black border-t pt-2" style={{ borderColor: CK_DSH, color: TEXT }}><span>Added to folio</span><span style={{ fontFamily: mono }}>₦{(extensionSubtotal + extensionTax).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold"><span style={{ color: CK_MUT }}>New checkout</span><span style={{ color: SUCCESS }}>{extensionCheckout} · {PROPERTY_PROFILE.checkOutTime}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowExtendStay(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={!extensionReason.trim()} onClick={() => {
                  setCharges(rows => [...rows, {
                    date: g.checkout,
                    cat: "Room",
                    desc: `${g.type} Room ${g.room} · Stay extension × ${extensionCount} night${extensionCount === 1 ? "" : "s"}`,
                    qty: extensionCount,
                    unit: nightlyRate,
                    amount: extensionSubtotal,
                    by: "Front Desk",
                    tax: extensionTax,
                    reversed: false,
                  }]);
                  setExtensionMap(map => ({ ...map, [selectedId]: (map[selectedId] ?? 0) + extensionCount }));
                  setCheckoutOverrides(map => ({ ...map, [selectedId]: extensionCheckout }));
                  setShowExtendStay(false);
                  add({ type: "success", title: "Stay extended", body: `Room ${g.room} · New checkout ${extensionCheckout} ${PROPERTY_PROFILE.checkOutTime} · Access validity extended` });
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Confirm extension</button>
              </div>
            </div>
          </div>
        </>
      )}

      {showRevokeConfirm && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowRevokeConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-md overflow-hidden" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: ERROR, fontFamily: display }}>End key access for room {g.room}</p>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 p-3 rounded-xl mb-4" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>
                <Lock size={18} weight="bold" className="flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">Immediate TTLock revocation</p>
                  <p className="text-xs mt-1 leading-relaxed">The active key card and PIN will stop working within 30 seconds. If the provider is offline, revocation is queued and the room must not be released until sync is confirmed.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRevokeConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button onClick={() => {
                  setAccessRevoked(p => ({ ...p, [selectedId]: true }));
                  setShowRevokeConfirm(false);
                  add({ type: "success", title: "Access revoked", body: `Room ${g.room} · TTLock confirmed immediate revocation` });
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ERROR }}>End key access</button>
              </div>
            </div>
          </div>
        </>
      )}

      {showReleaseConfirm && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onClick={() => setShowReleaseConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-lg overflow-hidden" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Release room {g.room} to housekeeping</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Guest", g.guest],
                  ["Final balance", `₦${balance.toLocaleString()}`],
                  ["Settlement", balance === 0 ? "No payment due" : payMethod],
                  ["Access", "Revoked · TTLock"],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: CK_BG, border: `1px solid ${CK_BD}` }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: CK_MUT }}>{label}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: TEXT }}>{value}</p>
                  </div>
                ))}
              </div>
              {!g.dueToday && (
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Early Departure Reason *</label>
                  <textarea value={earlyDepartureReason} onChange={e => setEarlyDepartureReason(e.target.value)} rows={3}
                    placeholder="Record the guest's reason and confirm unused-night charges were reviewed…" aria-label="Record the guest's reason and confirm unused-night charges were reviewed"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ border: `1.5px solid ${earlyDepartureReason.trim() ? CK_DSH : ERROR}` }} />
                  <p className="text-xs mt-1.5" style={{ color: CK_MUT }}>This reason is added to the reservation audit trail.</p>
                </div>
              )}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#F0FDF4", color: "#065F46" }}>
                <CheckCircle size={14} weight="fill" className="flex-shrink-0 mt-0.5" />
                The stay ends and the room goes on the Housekeeping board to be cleaned.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReleaseConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={!releaseConfirmed} onClick={() => {
                  checkOut(selectedId);
                  setCheckedOutIds(p => p.includes(selectedId) ? p : [...p, selectedId]);
                  setShowReleaseConfirm(false);
                  add({ type: "success", title: "Check-out complete", body: `Room ${g.room} is on the Housekeeping board to be cleaned.` });
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: SUCCESS }}>Confirm & release</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── VOID MODAL ── */}
      {voidLine !== null && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => { setVoidLine(null); setVoidReason(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: ERROR, fontFamily: display }}>Void charge</p>
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
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: ERROR }}>Confirm void</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DISCOUNT MODAL ── */}
      {showDiscount && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }}
            onClick={() => { setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: `1.5px solid ${CK_BD}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Apply discount</p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Discount Amount (₦) *</label>
                <input type="number" value={discountAmt} onChange={e => setDiscountAmt(e.target.value)} placeholder="0" aria-label="0"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${CK_DSH}`, fontFamily: mono }} />
                {discountNum > balance && <p className="text-xs font-semibold mt-1.5" style={{ color: ERROR }}>Discount cannot exceed the ₦{balance.toLocaleString()} outstanding balance.</p>}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Reason *</label>
                <textarea value={discountReason} onChange={e => setDiscountReason(e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ border: `1.5px solid ${CK_DSH}` }} placeholder="Guest complaint, loyalty benefit, etc." aria-label="Guest complaint, loyalty benefit, etc" />
              </div>
              {discountNum > 5000 && (
                <div>
                  <p className="text-sm" style={{ color: CK_MUT }}>Discounts above ₦5,000 go to a manager to approve from their dashboard. The bill changes once they approve.</p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowDiscount(false); setDiscountAmt(""); setDiscountReason(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button
                  disabled={!discountReason || discountNum <= 0 || discountNum > balance }
                  onClick={() => {
                    const amt = discountNum;
                    if (amt > 5000) {
                      requestApproval({ kind: "Discount", dept: "Front Office", ref: selectedId, title: `${g.guest}, room ${g.room}`, detail: `₦${amt.toLocaleString()} off the bill`,
                        reason: discountReason, requestedBy: staffName, apply: () => addDiscount(selectedId, amt) });
                      add({ type: "info", title: `Discount of ₦${amt.toLocaleString()} sent for approval`, body: "A manager approves it from their dashboard." });
                    } else {
                      addDiscount(selectedId, amt);
                      add({ type: "success", title: `Discount applied: ₦${amt.toLocaleString()}`, body: discountReason });
                    }
                    setShowDiscount(false); setDiscountAmt(""); setDiscountReason("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: ORANGE }}>{discountNum > 5000 ? "Send for approval" : "Apply discount"}</button>
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
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>Post late charge</p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Category</label>
                <select aria-label="Category" value={lateChargeCat} onChange={e => setLateChargeCat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
                  style={{ border: `1.5px solid ${CK_DSH}`, color: TEXT, backgroundColor: "white" }}>
                  {["Bar", "Restaurant", "Laundry", "Room", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Description *</label>
                <input value={lateChargeDesc} onChange={e => setLateChargeDesc(e.target.value)} placeholder="e.g. Minibar — 2× Beer" aria-label="e.g. Minibar — 2× Beer"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${CK_DSH}` }} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Amount (₦) *</label>
                <input type="number" value={lateChargeAmt} onChange={e => setLateChargeAmt(e.target.value)} placeholder="0" aria-label="0"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: `1.5px solid ${CK_DSH}`, fontFamily: mono }} />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowLateCharge(false); setLateChargeDesc(""); setLateChargeAmt(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: CK_DSH, color: CK_MUT }}>Cancel</button>
                <button disabled={!lateChargeDesc || (parseInt(lateChargeAmt) || 0) <= 0}
                  onClick={() => {
                    const amt = parseInt(lateChargeAmt) || 0;
                    const tax = Math.round(amt * 0.075);
                    setCharges(cs => [...cs, { date: g.checkout, cat: lateChargeCat, desc: lateChargeDesc, qty: 1, unit: amt, amount: amt, by: "Staff", tax, reversed: false }]);
                    add({ type: "success", title: "Late charge posted", body: `₦${amt.toLocaleString()} · ${lateChargeDesc}` });
                    setShowLateCharge(false); setLateChargeDesc(""); setLateChargeAmt("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Post charge</button>
              </div>
            </div>
          </div>
        </>
      )}
      </div>{/* /flex gap-5 outer */}
    </div>
  );
}

export function InHouseGuests({ add, nav, staffName }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string, param?: string) => void; staffName: string }) {
  const [faultRoom, setFaultRoom] = useState<string | null>(null);
  const [ihSearch, setIhSearch] = useState("");
  const [ihFilter, setIhFilter] = useState("All");
  const [moreMenu, setMoreMenu] = useState<string | null>(null);
  const [guests, setGuests] = useState(inHouseGuests);
  type InHouseGuest = typeof guests[number];
  type GuestAction = "message" | "charge" | "extend" | "move" | "revoke";
  const [guestAction, setGuestAction] = useState<{ type: GuestAction; guestId: string } | null>(null);
  const [messageChannel, setMessageChannel] = useState("WhatsApp");
  const [messageText, setMessageText] = useState("");
  const [chargeForm, setChargeForm] = useState({ category: "Restaurant", description: "", amount: "" });
  const [extendNights, setExtendNights] = useState("1");
  const [extendReason, setExtendReason] = useState("");
  const [moveRoom, setMoveRoom] = useState("");
  const [moveReason, setMoveReason] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [revokedAccess, setRevokedAccess] = useState<string[]>([]);
  const filtered = guests.filter(g => {
    const ms = !ihSearch || g.guest.toLowerCase().includes(ihSearch.toLowerCase()) || g.room.includes(ihSearch);
    const mf = ihFilter === "All" ? true : ihFilter === "VIP" ? g.vip : ihFilter === "Outstanding" ? g.balance > 0 : ihFilter === "DND" ? g.dnd : ihFilter === "Attention" ? g.requests > 0 || g.complaints > 0 : g.nightsLeft === 0;
    return ms && mf;
  });
  const typeColors: Record<string, string> = { Suite: PRIMARY, Deluxe: TEAL, Standard: MUTED };
  const actionGuest = guests.find(g => g.id === guestAction?.guestId);
  const addDaysLabel = (label: string, days: number) => {
    const [day, mon] = label.split(" ");
    const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const date = new Date(2026, months[mon] ?? 0, Number(day));
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  const openAction = (type: GuestAction, guest: InHouseGuest) => {
    setMoreMenu(null);
    setGuestAction({ type, guestId: guest.id });
    setMessageChannel("WhatsApp"); setMessageText("");
    setChargeForm({ category: "Restaurant", description: "", amount: "" });
    setExtendNights("1"); setExtendReason("");
    setMoveRoom(""); setMoveReason(""); setRevokeReason("");
  };
  return (
    <div>
      <PageHeader title="In-House Guests" sub={`${guests.length} guests currently checked in`} actions={<><BtnO label="Export" icon={DownloadSimple} onClick={() => add({ type: "success", title: "In-house guest list exported" })} /><BtnP label="Open folios" icon={FileText} onClick={() => nav && nav("finance-folio", "Folio Management")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="In-House" value={String(guests.length)} sub="Currently checked in" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP guests" value={String(guests.filter(g => g.vip).length)} sub="Priority service" icon={Star} accent={ORANGE} />
        <StatCard label="Outstanding" value={`₦${guests.reduce((s,g)=>s+g.balance,0).toLocaleString()}`} sub={`${guests.filter(g=>g.balance>0).length} open folios`} icon={CurrencyDollar} accent={ERROR} />
        <StatCard label="Needs attention" value={String(guests.filter(g=>g.requests>0 || g.complaints>0 || g.nightsLeft===0).length)} sub="Requests, complaints, departures" icon={WarningCircle} accent={WARNING} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative w-full sm:w-64"><MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={ihSearch} onChange={e => setIhSearch(e.target.value)} placeholder="Search guest or room…" aria-label="Search guest or room" className="w-full pl-7 pr-8 py-2 text-xs rounded-xl border bg-white outline-none" style={{ borderColor: BORDER }} />{ihSearch && <button aria-label="Close" onClick={() => setIhSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }}><XCircle size={13} /></button>}</div>
        {["All", "VIP", "Outstanding", "DND", "Attention", "Departing"].map(f => <button key={f} onClick={() => setIhFilter(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: ihFilter===f ? PRIMARY : "white", color: ihFilter===f ? "white" : MUTED, borderColor: ihFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
        <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{filtered.length} of {guests.length}</span>
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} message={guests.length === 0 ? "Nobody is checked in. Guests appear here once they check in." : "No guests match your filters"} cta={guests.length === 0 ? "Go to Check-In" : undefined} onCta={() => nav?.("check-in", "Check-In")} /> : (
        <div className="bg-white rounded-xl border overflow-x-auto" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full min-w-[1050px]">
            <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Room", "Guest", "Check-in", "Check-out", "Nights left", "Balance", "Flags", "Actions"].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: g.vip ? ORANGE : PRIMARY }}><User size={14} weight="bold" /></div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: TEXT }}>{g.guest}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE_INK }} weight="bold" />}</div>
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
                      {revokedAccess.includes(g.id) && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Access revoked</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 relative">
                      <button onClick={() => nav && nav("check-out", "Guest Folio", revokedAccess.includes(g.id) ? `${g.id}|revoked` : g.id)} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>Folio</button>
                      <button onClick={() => nav && nav("check-out", "Check-Out", revokedAccess.includes(g.id) ? `${g.id}|revoked` : g.id)} className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{ backgroundColor: PRIMARY }}>Check out</button>
                      <div className="relative">
                        <button aria-label="More actions" onClick={() => setMoreMenu(moreMenu === g.room ? null : g.room)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5] transition-colors" style={{ color: SUBTLE }}><DotsThree size={13} weight="bold" /></button>
                        {moreMenu === g.room && (
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border shadow-lg py-1 min-w-36" style={{ borderColor: BORDER }}>
                            <button onClick={() => { setMoreMenu(null); nav && nav("guest-profile-detail", g.guest, g.id); }} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>View profile</button>
                            <button onClick={() => openAction("message", g)} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>Message guest</button>
                            <button onClick={() => openAction("charge", g)} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>Post charge</button>
                            <button onClick={() => openAction("extend", g)} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>Extend stay</button>
                            <button onClick={() => openAction("move", g)} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>Move room</button>
                            <button onClick={() => { setMoreMenu(null); setFaultRoom(g.room); }} className="w-full text-left px-4 py-2 text-xs hover:bg-[#F8FAFC] transition-colors" style={{ color: TEXT }}>Report a fault</button>
                            <button disabled={revokedAccess.includes(g.id)} onClick={() => openAction("revoke", g)} className="w-full text-left px-4 py-2 text-xs hover:bg-[#FEF2F2] transition-colors disabled:opacity-40" style={{ color: ERROR }}>{revokedAccess.includes(g.id) ? "Access Already Revoked" : "Revoke Room Access"}</button>
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
      {guestAction && actionGuest && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setGuestAction(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-lg overflow-hidden" style={{ border: `1.5px solid ${BORDER}` }}>
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <p className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>
                {guestAction.type === "message" ? "Message the guest" : guestAction.type === "charge" ? "Post a charge" : guestAction.type === "extend" ? "Extend the stay" : guestAction.type === "move" ? "Move to another room" : "End room access"}
              </p>
              <p className="text-sm mt-0.5" style={{ color: MUTED }}>{actionGuest.guest} · Room {actionGuest.room} · {actionGuest.id}</p>
            </div>
            <div className="p-6 space-y-4">
              {guestAction.type === "message" && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Channel</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["WhatsApp", "SMS", "Guest Portal"].map(channel => <button key={channel} onClick={() => setMessageChannel(channel)} className="py-2.5 rounded-xl text-xs font-bold border" style={{ borderColor: messageChannel === channel ? PRIMARY : BORDER, backgroundColor: messageChannel === channel ? PRIMARY : "white", color: messageChannel === channel ? "white" : MUTED }}>{channel}</button>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Message *</label>
                    <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={4} placeholder="Type a message for the guest…" aria-label="Type a message for the guest" className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${BORDER}` }} />
                  </div>
                </>
              )}

              {guestAction.type === "charge" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Category</label>
                      <select aria-label="Category" value={chargeForm.category} onChange={e => setChargeForm(form => ({ ...form, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${BORDER}`, backgroundColor: "white", color: TEXT }}>
                        {["Restaurant", "Bar", "Laundry", "Minibar", "Telephone", "Other"].map(category => <option key={category}>{category}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Amount (₦) *</label>
                      <input type="number" value={chargeForm.amount} onChange={e => setChargeForm(form => ({ ...form, amount: e.target.value }))} placeholder="0" aria-label="0" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${BORDER}`, fontFamily: mono }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description *</label>
                    <input value={chargeForm.description} onChange={e => setChargeForm(form => ({ ...form, description: e.target.value }))} placeholder="e.g. Room service order #RS-055" aria-label="e.g. Room service order #RS-055" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${BORDER}` }} />
                  </div>
                  {(parseInt(chargeForm.amount) || 0) > 0 && (
                    <div className="flex justify-between p-3 rounded-xl text-sm" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>
                      <span>Charge + VAT 7.5%</span>
                      <span className="font-black" style={{ fontFamily: mono }}>₦{Math.round((parseInt(chargeForm.amount) || 0) * 1.075).toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}

              {guestAction.type === "extend" && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#F0FDF4", color: "#065F46", border: "1px solid #BBF7D0" }}>
                    <CheckCircle size={14} weight="fill" />Room {actionGuest.room} is available for the selected extension.
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Current checkout</p>
                      <p className="text-sm font-bold mt-1" style={{ color: TEXT }}>{actionGuest.checkout} · {PROPERTY_PROFILE.checkOutTime}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Additional nights</label>
                      <select aria-label="Additional nights" value={extendNights} onChange={e => setExtendNights(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${BORDER}`, backgroundColor: "white", color: TEXT }}>
                        {["1", "2", "3", "4", "5", "7"].map(nights => <option key={nights} value={nights}>{nights} night{nights === "1" ? "" : "s"}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason *</label>
                    <textarea value={extendReason} onChange={e => setExtendReason(e.target.value)} rows={2} placeholder="Guest request, flight change, business extension…" aria-label="Guest request, flight change, business extension" className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${BORDER}` }} />
                  </div>
                  <div className="flex justify-between p-3 rounded-xl text-sm" style={{ backgroundColor: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                    <span style={{ color: MUTED }}>New checkout</span>
                    <span className="font-bold" style={{ color: SUCCESS }}>{addDaysLabel(actionGuest.checkout, parseInt(extendNights) || 1)} · {PROPERTY_PROFILE.checkOutTime}</span>
                  </div>
                </>
              )}

              {guestAction.type === "move" && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ backgroundColor: typeColors[actionGuest.type] ?? PRIMARY }}>{actionGuest.room}</div>
                    <div><p className="text-sm font-bold" style={{ color: TEXT }}>Current room</p><p className="text-xs" style={{ color: MUTED }}>{actionGuest.type} · Floor {Math.floor(Number(actionGuest.room) / 100)}</p></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>New Inspected Room *</label>
                    <select aria-label="New inspected room" value={moveRoom} onChange={e => setMoveRoom(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${moveRoom ? BORDER : ERROR}`, backgroundColor: "white", color: TEXT }}>
                      <option value="">Select available room</option>
                      {["102 · Standard", "104 · Standard", "201 · Deluxe", "301 · Suite", "402 · Deluxe", "502 · Suite"].map(room => <option key={room}>{room}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Move Reason *</label>
                    <textarea value={moveReason} onChange={e => setMoveReason(e.target.value)} rows={2} placeholder="Maintenance issue, guest request, service recovery…" aria-label="Maintenance issue, guest request, service recovery" className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${BORDER}` }} />
                  </div>
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
                    <Warning size={14} className="flex-shrink-0" />Room access will be reissued for the new room and housekeeping will be notified about both rooms.
                  </div>
                </>
              )}

              {guestAction.type === "revoke" && (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>
                    <Lock size={18} weight="bold" className="flex-shrink-0" />
                    <div><p className="text-sm font-bold">Emergency access revocation</p><p className="text-xs mt-1 leading-relaxed">All key cards and PINs for Room {actionGuest.room} will be revoked through TTLock. Management and logged-in Front Desk staff will be notified.</p></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: ERROR }}>Revocation Reason *</label>
                    <select aria-label="Revocation reason" value={revokeReason} onChange={e => setRevokeReason(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none" style={{ border: `1.5px solid ${revokeReason ? BORDER : ERROR}`, backgroundColor: "white", color: TEXT }}>
                      <option value="">Select reason</option>
                      {["Guest safety concern", "Lost or stolen credential", "Security incident", "Management instruction", "Room move", "Other"].map(reason => <option key={reason}>{reason}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setGuestAction(null)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
                {guestAction.type === "message" && <button disabled={!messageText.trim()} onClick={() => { add({ type: "success", title: `Message sent via ${messageChannel}`, body: `${actionGuest.guest} · Room ${actionGuest.room}` }); setGuestAction(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Send message</button>}
                {guestAction.type === "charge" && <button disabled={!chargeForm.description.trim() || (parseInt(chargeForm.amount) || 0) <= 0} onClick={() => {
                  const total = Math.round((parseInt(chargeForm.amount) || 0) * 1.075);
                  setGuests(list => list.map(guest => guest.id === actionGuest.id ? { ...guest, balance: guest.balance + total } : guest));
                  add({ type: "success", title: "Charge posted", body: `${actionGuest.guest} · ${chargeForm.category} · ₦${total.toLocaleString()} incl. VAT` }); setGuestAction(null);
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Post charge</button>}
                {guestAction.type === "extend" && <button disabled={!extendReason.trim()} onClick={() => {
                  const extra = parseInt(extendNights) || 1;
                  const checkout = addDaysLabel(actionGuest.checkout, extra);
                  setGuests(list => list.map(guest => guest.id === actionGuest.id ? { ...guest, checkout, nights: guest.nights + extra, nightsLeft: guest.nightsLeft + extra } : guest));
                  add({ type: "success", title: "Stay extended", body: `${actionGuest.guest} · New checkout ${checkout} ${PROPERTY_PROFILE.checkOutTime}` }); setGuestAction(null);
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Confirm extension</button>}
                {guestAction.type === "move" && <button disabled={!moveRoom || !moveReason.trim()} onClick={() => {
                  const [room, type] = moveRoom.split(" · ");
                  const oldRoom = actionGuest.room;
                  setGuests(list => list.map(guest => guest.id === actionGuest.id ? { ...guest, room, type } : guest));
                  add({ type: "success", title: "Room move complete", body: `${actionGuest.guest} · ${oldRoom} → ${room} · New access issued` }); setGuestAction(null);
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: PRIMARY }}>Confirm move</button>}
                {guestAction.type === "revoke" && <button disabled={!revokeReason} onClick={() => {
                  setRevokedAccess(ids => ids.includes(actionGuest.id) ? ids : [...ids, actionGuest.id]);
                  add({ type: "error", title: `Emergency revoke — Room ${actionGuest.room}`, body: `${revokeReason} · Management and Front Desk notified` }); setGuestAction(null);
                }} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-35" style={{ backgroundColor: ERROR }}>End key access</button>}
              </div>
            </div>
          </div>
        </>
      )}
      {faultRoom && <ReportFaultDialog room={faultRoom} reportedBy={staffName} dept="Front Office" onClose={() => setFaultRoom(null)}
        onReported={rep => { add({ type: "success", title: `${rep.id} sent to Maintenance`, body: "You will be told when they decide." }); setFaultRoom(null); }} />}
    </div>
  );
}

export function GuestProfiles({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string, param?: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const [showNew, setShowNew] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", phone: "", email: "", nationality: "Nigerian" });
  const [mergeForm, setMergeForm] = useState({ primaryId: "", duplicateId: "", reason: "" });
  const [guests, setGuests] = useState([
    { name: "Adaeze Okonkwo", av: "AO", id: "G-001", phone: "+234 801 111 2222", email: "a.okonkwo@corp.ng", nationality: "Nigerian", stays: 8, lastStay: "24 Jun", lifetimeValue: 520000, vip: true, vipTier: "Gold", tag: "Regular", activeStay: true, balance: 0, blacklist: false, allergy: "Seafood" },
    { name: "Dr. Chukwuemeka Bello", av: "CB", id: "G-002", phone: "+234 803 555 6666", email: "c.bello@example.com", nationality: "Nigerian", stays: 15, lastStay: "24 Jun", lifetimeValue: 2400000, vip: true, vipTier: "Platinum", tag: "VIP", activeStay: true, balance: 0, blacklist: false, allergy: "" },
    { name: "Emmanuel Adeyemi", av: "EA", id: "G-003", phone: "+234 802 333 4444", email: "e.adeyemi@email.com", nationality: "Nigerian", stays: 3, lastStay: "23 Jun", lifetimeValue: 185000, vip: false, vipTier: "", tag: "", activeStay: true, balance: 45000, blacklist: false, allergy: "" },
    { name: "Ibrahim Lawal", av: "IL", id: "G-004", phone: "+234 805 999 0000", email: "i.lawal@corp.ng", nationality: "Nigerian", stays: 5, lastStay: "23 Jun", lifetimeValue: 340000, vip: false, vipTier: "", tag: "Corporate", activeStay: true, balance: 0, blacklist: false, allergy: "Gluten" },
    { name: "Fatima Al-Hassan", av: "FA", id: "G-005", phone: "+234 804 777 8888", email: "f.alhassan@mail.com", nationality: "Nigerian", stays: 1, lastStay: "22 Jun", lifetimeValue: 55000, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Tunde Bakare", av: "TB", id: "G-006", phone: "+234 809 123 4567", email: "t.bakare@corp.ng", nationality: "Nigerian", stays: 2, lastStay: "20 Jun", lifetimeValue: 92000, vip: false, vipTier: "", tag: "Corporate", activeStay: false, balance: 18500, blacklist: false, allergy: "" },
    { name: "Ngozi Adeyemi", av: "NA", id: "G-007", phone: "+234 807 654 3210", email: "n.adeyemi@email.com", nationality: "Nigerian", stays: 4, lastStay: "18 Jun", lifetimeValue: 210000, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Chidi Eze", av: "CE", id: "G-008", phone: "+234 806 222 3333", email: "c.eze@example.com", nationality: "Nigerian", stays: 6, lastStay: "15 Jun", lifetimeValue: 480000, vip: true, vipTier: "Gold", tag: "VIP", activeStay: false, balance: 0, blacklist: false, allergy: "" },
    { name: "Amara Nwachukwu", av: "AN", id: "G-009", phone: "+234 811 444 5555", email: "a.nwachukwu@corp.ng", nationality: "Nigerian", stays: 0, lastStay: "—", lifetimeValue: 0, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0, blacklist: true, allergy: "" },
  ].map(g => {
    // In-house status and balance come from the same stays the other Front Office screens use.
    const stay = STAYS.find(x => x.guest === g.name);
    return stay ? { ...g, activeStay: true, balance: balanceOf(stay) } : { ...g, activeStay: false };
  }));
  const filtered = guests.filter(g => {
    const query = search.trim().toLowerCase();
    if (query && ![g.name, g.id, g.phone, g.email, g.nationality].some(value => value.toLowerCase().includes(query))) return false;
    if (filterTab === "VIP") return g.vip;
    if (filterTab === "Active Stay") return g.activeStay;
    if (filterTab === "Has Balance") return g.balance > 0;
    if (filterTab === "Blacklisted") return g.blacklist;
    return true;
  });
  const createGuest = () => {
    if (!newGuest.name.trim() || (!newGuest.phone.trim() && !newGuest.email.trim())) {
      add({ type: "error", title: "Guest details incomplete", body: "Enter a name and at least a phone number or email address." });
      return;
    }
    const nextNumber = Math.max(0, ...guests.map(g => Number(g.id.replace(/\D/g, "")) || 0)) + 1;
    const guest = {
      name: newGuest.name.trim(), av: "", id: `G-${String(nextNumber).padStart(3, "0")}`,
      phone: newGuest.phone.trim() || "Not provided", email: newGuest.email.trim() || "Not provided",
      nationality: newGuest.nationality.trim() || "Not provided", stays: 0, lastStay: "—",
      lifetimeValue: 0, vip: false, vipTier: "", tag: "", activeStay: false, balance: 0,
      blacklist: false, allergy: "",
    };
    setGuests(list => [guest, ...list]);
    setSearch("");
    setFilterTab("All");
    setNewGuest({ name: "", phone: "", email: "", nationality: "Nigerian" });
    setShowNew(false);
    add({ type: "success", title: "Guest profile created", body: `${guest.name} · ${guest.id}` });
  };
  const mergeGuests = () => {
    const primary = guests.find(g => g.id === mergeForm.primaryId);
    const duplicate = guests.find(g => g.id === mergeForm.duplicateId);
    if (!primary || !duplicate || primary.id === duplicate.id || !mergeForm.reason.trim()) {
      add({ type: "error", title: "Merge details incomplete", body: "Choose two different profiles and record a merge reason." });
      return;
    }
    setGuests(list => list.filter(g => g.id !== duplicate.id).map(g => g.id === primary.id ? {
      ...g,
      stays: g.stays + duplicate.stays,
      lifetimeValue: g.lifetimeValue + duplicate.lifetimeValue,
      balance: g.balance + duplicate.balance,
      activeStay: g.activeStay || duplicate.activeStay,
      vip: g.vip || duplicate.vip,
      blacklist: g.blacklist || duplicate.blacklist,
      allergy: g.allergy || duplicate.allergy,
      tag: g.tag || duplicate.tag,
    } : g));
    setMergeForm({ primaryId: "", duplicateId: "", reason: "" });
    setShowMerge(false);
    add({ type: "success", title: "Duplicate profiles merged", body: `${duplicate.name} was consolidated into ${primary.name}.` });
  };
  const tierColor = (t: string) => t === "Platinum" ? { bg: "#F5F3FF", text: "#7C3AED" } : t === "Gold" ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#EFF6FF", text: PRIMARY };
  return (
    <div>
      <PageHeader title="Guest Profiles" sub={`${filtered.length} of ${guests.length} profiles`} actions={<><BtnO label="Merge duplicates" icon={Stack} onClick={() => setShowMerge(true)} /><BtnP label="New profile" icon={Plus} onClick={() => setShowNew(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total profiles" value={String(guests.length)} sub="Registered guests" icon={Users} accent={PRIMARY} />
        <StatCard label="VIP members" value={String(guests.filter(g=>g.vip).length)} sub="Loyalty & VIP tier" icon={Star} accent={ORANGE} />
        <StatCard label="Active stay" value={String(guests.filter(g=>g.activeStay).length)} sub="Currently in-house" icon={Bed} accent={TEAL} />
        <StatCard label="With balance" value={String(guests.filter(g=>g.balance>0).length)} sub="Open folios" icon={CurrencyDollar} accent={ERROR} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative w-full sm:w-72"><MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, contact, ID, nationality…" aria-label="Search name, contact, ID, nationality" className="pl-9 pr-9 py-2 text-xs rounded-xl border bg-white outline-none w-full" style={{ borderColor: BORDER }} />{search && <button aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }}><XCircle size={16} /></button>}</div>
        {["All", "Active Stay", "Blacklisted", "VIP", "Has Balance"].map(f => (
          <button key={f} onClick={() => setFilterTab(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all"
            style={{ borderColor: filterTab === f ? PRIMARY : BORDER, backgroundColor: filterTab === f ? PRIMARY : "white", color: filterTab === f ? "white" : MUTED }}>{f}</button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={User} message={`No guest profiles match ${search ? `"${search}"` : `the ${filterTab} filter`}.`} cta="Clear filters" onCta={() => { setSearch(""); setFilterTab("All"); }} /> : (
        <div className="bg-white rounded-xl border overflow-x-auto" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full min-w-[920px]">
            <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Guest", "Contact", "Stays / last stay", "Lifetime value", "Tier / flags", "Actions"].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id} className="border-t hover:bg-[#F8FAFC] transition-colors cursor-pointer" style={{ borderColor: BORDER }} onClick={() => nav && nav("guest-profile-detail", g.name, g.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: g.vip ? "#FFF7ED" : "#EFF6FF", color: g.vip ? ORANGE : PRIMARY }}><User size={18} weight="fill" /></div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: g.blacklist ? ERROR : TEXT }}>{g.name}</span>{g.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE_INK }} weight="bold" />}</div>
                        <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{g.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: TEXT }}>{g.phone}</div>
                    <div className="text-xs truncate max-w-[190px]" style={{ color: MUTED }}>{g.email}</div>
                    <div className="text-xs" style={{ color: SUBTLE }}>{g.nationality}</div>
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
                      {g.vipTier && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: tierColor(g.vipTier).bg, color: tierColor(g.vipTier).text }}>{g.vipTier}</span>}
                      {g.activeStay && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>In-house</span>}
                      {g.blacklist && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Blacklist</span>}
                      {g.balance > 0 && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>Balance</span>}
                      {g.allergy && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FFF7ED", color: ORANGE_INK }}>Allergy</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => nav && nav("guest-profile-detail", g.name, g.id)} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold hover:bg-[#F4F4F5] transition-colors" style={{ color: PRIMARY, borderColor: BORDER }}>View</button>
                      <button onClick={() => nav && nav("new-reservation", "New Reservation", g.name)} className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{ backgroundColor: PRIMARY }}>Reserve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onMouseDown={() => setShowNew(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onMouseDown={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}><div><h3 className="font-bold" style={{ color: TEXT }}>Create guest profile</h3><p className="text-xs mt-0.5" style={{ color: MUTED }}>Add a searchable identity before creating a stay.</p></div><button aria-label="Close" onClick={() => setShowNew(false)}><XCircle size={21} style={{ color: MUTED }} /></button></div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["Full name *", "name", "e.g. Amina Yusuf"], ["Phone", "phone", "+234…"], ["Email", "email", "guest@example.com"], ["Nationality", "nationality", "Nationality"]].map(([label, key, placeholder]) => <label key={key} className="text-xs font-semibold" style={{ color: MUTED }}>{label}<input value={newGuest[key as keyof typeof newGuest]} onChange={e => setNewGuest(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full mt-1.5 px-3 py-2.5 rounded-xl border text-sm outline-none font-normal" style={{ borderColor: BORDER, color: TEXT }} /></label>)}
              <p className="sm:col-span-2 text-xs" style={{ color: MUTED }}>A phone number or email address is required to reduce duplicate profiles.</p>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2" style={{ borderColor: BORDER }}><button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button><button onClick={createGuest} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Create profile</button></div>
          </div>
        </div>
      )}
      {showMerge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onMouseDown={() => setShowMerge(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onMouseDown={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}><div><h3 className="font-bold" style={{ color: TEXT }}>Merge duplicate profiles</h3><p className="text-xs mt-0.5" style={{ color: MUTED }}>Choose the profile that should remain on record.</p></div><button aria-label="Close" onClick={() => setShowMerge(false)}><XCircle size={21} style={{ color: MUTED }} /></button></div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl flex gap-2 text-xs" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}><Warning size={17} className="flex-shrink-0" /><span>Stays, balances, flags, and lifetime value from the duplicate will be consolidated into the primary profile. This action cannot be undone.</span></div>
              {[["Primary profile (keep) *", "primaryId"], ["Duplicate profile (remove) *", "duplicateId"]].map(([label, key]) => <label key={key} className="block text-xs font-semibold" style={{ color: MUTED }}>{label}<select value={mergeForm[key as "primaryId" | "duplicateId"]} onChange={e => setMergeForm(p => ({ ...p, [key]: e.target.value }))} className="w-full mt-1.5 px-3 py-2.5 rounded-xl border text-sm bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}><option value="">Select guest profile</option>{guests.filter(g => key === "primaryId" ? g.id !== mergeForm.duplicateId : g.id !== mergeForm.primaryId).map(g => <option key={g.id} value={g.id}>{g.name} · {g.id} · {g.phone}</option>)}</select></label>)}
              <label className="block text-xs font-semibold" style={{ color: MUTED }}>Merge reason *<textarea value={mergeForm.reason} onChange={e => setMergeForm(p => ({ ...p, reason: e.target.value }))} rows={3} placeholder="How was the duplicate verified?" aria-label="How was the duplicate verified?" className="w-full mt-1.5 px-3 py-2.5 rounded-xl border text-sm outline-none resize-none font-normal" style={{ borderColor: BORDER, color: TEXT }} /></label>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2" style={{ borderColor: BORDER }}><button onClick={() => setShowMerge(false)} className="px-4 py-2 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button><button onClick={mergeGuests} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>Confirm merge</button></div>
          </div>
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
  const FOLIO_LINES = CHARGES["BK-2848"].map((c, i) => ({ date: c.date, cat: c.cat, desc: c.desc, qty: c.qty, unit: c.unit, amount: c.amount, tax: c.tax, by: c.by, reversed: c.reversed, id: i + 1 }));

  const PAYMENTS = [
    { date: "22 Jun", desc: "Check-in deposit", method: "Cash", amount: 55000, by: "John A.", id: "P1" },
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
  if (STAYS.length === 0) return (
    <div>
      <PageHeader title="Folio Management" sub="Open guest folios" />
      <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
        <EmptyState icon={Receipt} message="No open folios. A folio opens when a guest checks in." cta="Go to Check-In" onCta={() => nav?.("check-in", "Check-In")} />
      </div>
    </div>
  );
  return (
    <div>
      <PageHeader title="Folio — BK-2848" sub="Emmanuel Adeyemi · Room 202 · 22–24 Jun 2026"
        actions={<><BtnO label="Print folio" icon={FileText} /><BtnO label="Split folio" icon={Stack} /><BtnP label="Post charge" icon={Plus} onClick={() => setShowCharge(true)} /></>} />
      {/* Header stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Charges + Tax" value={`₦${grand.toLocaleString()}`} sub={`${lines.filter(l=>!l.reversed).length} active lines`} icon={FileText} accent={PRIMARY} />
        <StatCard label="Payments" value={`₦${paidTotal.toLocaleString()}`} sub={`${PAYMENTS.length} payment${PAYMENTS.length !== 1 ? "s" : ""}`} icon={CheckCircle} accent={SUCCESS} />
        <StatCard label="Balance due" value={`₦${Math.max(0,balance).toLocaleString()}`} sub="Remaining" icon={CurrencyDollar} accent={balance > 0 ? ERROR : SUCCESS} />
        <StatCard label="Room night rate" value="₦55,000" sub="Deluxe · 2 nights" icon={Bed} accent={TEAL} />
      </div>
      {/* Charge lines */}
      <div className="bg-white rounded-xl border overflow-hidden mb-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Charge lines</span>
          <div className="flex gap-1.5 ml-2">
            {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className="text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all" style={{ backgroundColor: catFilter === c ? PRIMARY : "white", color: catFilter === c ? "white" : MUTED, borderColor: catFilter === c ? PRIMARY : BORDER }}>{c}</button>)}
          </div>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>Posted charges are reversal-only — no direct editing</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date", "Cat", "Description", "Qty", "Unit (₦)", "Amount (₦)", "Tax (₦)", "Running bal", "By", ""].map((h,i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
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
              <div className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>−₦{p.amount.toLocaleString()}</div>
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
                <span>Balance due</span><span style={{ fontFamily: mono }}>₦{Math.max(0, balance).toLocaleString()}</span>
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
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post charge</h3><button aria-label="Close" onClick={() => setShowCharge(false)} style={{ color: SUBTLE }}><XCircle size={18} weight="bold" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Category</label><select aria-label="Category" value={charge.cat} onChange={e => setCharge(p => ({...p, cat: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{["Room","Restaurant","Bar","Laundry","Minibar","Telephone","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Quantity</label><input aria-label="Quantity" type="number" min="1" value={charge.qty} onChange={e => setCharge(p => ({...p, qty: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Description</label><input value={charge.desc} onChange={e => setCharge(p=>({...p,desc:e.target.value}))} placeholder="e.g. Room Service #RS-055" aria-label="e.g. Room Service #RS-055" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Unit amount (₦)</label><input type="number" value={charge.amount} onChange={e => setCharge(p=>({...p,amount:e.target.value}))} placeholder="0" aria-label="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              {charge.amount && charge.qty && <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Total: ₦{((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)).toLocaleString()} + VAT ₦{Math.round((parseInt(charge.amount)||0)*(parseInt(charge.qty)||1)*0.075).toLocaleString()}</div>}
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowCharge(false)} /><BtnP label="Post charge" icon={CurrencyDollar} onClick={postCharge} /></div>
          </div>
        </>
      )}
      {/* Post Payment Modal */}
      {showPayment && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowPayment(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Post payment</h3><button aria-label="Close" onClick={() => setShowPayment(false)} style={{ color: SUBTLE }}><XCircle size={18} weight="bold" /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Amount (₦)</label><input aria-label="Amount (₦)" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder={Math.max(0,balance).toLocaleString()} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Payment method</label>
                <div className="grid grid-cols-2 gap-2">{["Cash","POS / Card","Bank Transfer","Corporate Account"].map(m=><label key={m} className="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer" style={{ borderColor: payMethod===m ? SUCCESS : BORDER, backgroundColor: payMethod===m ? "#F0FDF4" : "white" }}><div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: payMethod===m ? SUCCESS : "#CBD5E1", backgroundColor: payMethod===m ? SUCCESS : "transparent" }} /><input type="radio" className="hidden" onChange={() => setPayMethod(m)} /><span className="text-xs" style={{ color: TEXT }}>{m}</span></label>)}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowPayment(false)} /><button onClick={() => { setShowPayment(false); add({ type: "success", title: "Payment posted", body: `₦${parseInt(payAmt||"0").toLocaleString()} ${payMethod}` }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Post payment</button></div>
          </div>
        </>
      )}
      {/* Void / Reverse modal */}
      {voidId !== null && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setVoidId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Reverse charge</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>A credit reversal line will be posted. The original line is never deleted. Select a reason:</p>
            <div className="space-y-2 mb-4">{["Guest complaint / dispute","Incorrectly posted","Complimentary by manager","Other"].map(r=><label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: voidReason===r ? ERROR : BORDER, backgroundColor: voidReason===r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: voidReason===r ? ERROR : "#CBD5E1" }}>{voidReason===r && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />}</div><input type="radio" className="hidden" onChange={() => setVoidReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}</div>
            <div className="flex gap-3"><button onClick={() => { setVoidId(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button><button disabled={!voidReason} onClick={() => { setLines(ls => ls.map(l => l.id === voidId ? {...l, reversed: true} : l)); add({ type: "info", title: "Charge reversed", body: voidReason }); setVoidId(null); setVoidReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm reversal</button></div>
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
  const FOLIOS = folios();
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
          <div className="relative"><MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} weight="bold" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search folio, guest, or room…" aria-label="Search folio, guest, or room" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          {["All", "Open", "Settled", "High Balance", "No Payment"].map(f => <button key={f} onClick={() => setStatusFilter(f)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: statusFilter===f ? PRIMARY : "white", color: statusFilter===f ? "white" : MUTED, borderColor: statusFilter===f ? PRIMARY : BORDER }}>{f}</button>)}
          {selected.length > 0 && <div className="ml-auto flex items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>{selected.length} selected</span><button onClick={() => add({ type: "info", title: `Bulk action on ${selected.length} folios` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Bulk Post Charge</button></div>}
          <span className={`text-xs ${selected.length > 0 ? "" : "ml-auto"}`} style={{ color: SUBTLE }}>{filtered.length} folios</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>
            <th className="px-4 py-3 w-8"><input aria-label="Select all" type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(f=>f.id) : [])} /></th>
            {["Folio / res", "Guest", "Room", "Dates", "Charges", "Payments", "Balance", "Days open", "Last pulse", "Flags", ""].map((h,i) => <th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, backgroundColor: f.flags.highBalance && f.balance > 0 ? "#FFFBEB" : "transparent" }}>
                <td className="px-4 py-3"><input aria-label={`Select ${f.id}`} type="checkbox" checked={selected.includes(f.id)} onChange={() => toggleSel(f.id)} /></td>
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
                <td className="px-3 py-3 text-sm" style={{ color: TEXT, fontFamily: mono }}>₦{f.payments.toLocaleString()}</td>
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
                    {f.flags.unposted && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FFF7ED", color: ORANGE_INK }}>Unposted</span>}
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
