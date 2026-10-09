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
  ArrowDownToLine, ArrowUpFromLine, XCircle, Car,
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

import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp, Sel, LiveClock, SyncPill, Av } from "./UIKit";

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
                ticks={[1, 6, 11, 16, 21, 26]} />
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
                {revCat.map((e) => <Cell key={e.name} fill={e.color} />)}
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

      {/* ── Fleet & Transport snapshot ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border mt-4" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <Car size={14} style={{ color: PRIMARY }} />
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Fleet &amp; Transport</div>
          </div>
          <button onClick={() => go("dispatch-board", "Dispatch Board")} className="text-xs font-semibold" style={{ color: TEAL }}>Dispatch Board →</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-0 divide-x" style={{ borderColor: BORDER }}>
          {[
            { label:"Active Trips",    value:"3", sub:"en-route / in-transit",  color:PRIMARY   },
            { label:"Pending Approval",value:"1", sub:"awaiting sign-off",       color:ERROR     },
            { label:"Vehicles Active", value:"3/4",sub:"1 in maintenance",       color:SUCCESS   },
            { label:"Doc Alerts",      value:"2", sub:"expired or expiring",      color:WARNING   },
            { label:"Bulk Diesel Tank",value:"42%",sub:"≈14.2 days remaining",   color:ORANGE    },
          ].map(item => (
            <div key={item.label} className="px-5 py-4 text-center">
              <div className="text-2xl font-bold" style={{ color:item.color, fontFamily:"'JetBrains Mono', monospace" }}>{item.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color:item.color }}>{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color:SUBTLE }}>{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t flex items-center gap-4" style={{ borderColor: BORDER }}>
          <button onClick={() => go("vehicle-register", "Vehicle Register")} className="text-xs font-semibold" style={{ color: MUTED }}>Vehicle Register</button>
          <span style={{ color: BORDER }}>·</span>
          <button onClick={() => go("fuel-log", "Fuel Log")} className="text-xs font-semibold" style={{ color: MUTED }}>Fuel Log</button>
          <span style={{ color: BORDER }}>·</span>
          <button onClick={() => go("purchase-orders", "Purchase Orders")} className="text-xs font-semibold" style={{ color: MUTED }}>Procurement</button>
          <span style={{ color: BORDER }}>·</span>
          <button onClick={() => go("fleet-costing", "Fleet Costing")} className="text-xs font-semibold" style={{ color: MUTED }}>Fleet Costing</button>
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
  if (role === "FD") {
    const FD_ARRIVALS = [
      { id:"RES-1041", guest:"Dr. Chukwuemeka Okonkwo", room:"301", type:"Suite",        eta:"09:30", vip:true,  status:"checked-in",   gender:"M" as const },
      { id:"RES-1042", guest:"Mrs. Aisha Bello",         room:"204", type:"Deluxe",       eta:"10:00", vip:false, status:"checked-in",   gender:"F" as const },
      { id:"RES-1043", guest:"Mr. Emeka Eze",            room:"118", type:"Standard",     eta:"11:00", vip:false, status:"checked-in",   gender:"M" as const },
      { id:"RES-1044", guest:"Prof. Ngozi Umeora",       room:"405", type:"Executive",    eta:"13:00", vip:true,  status:"arriving",     gender:"F" as const },
      { id:"RES-1045", guest:"Chief Tunde Adeyemi",      room:"—",   type:"Deluxe Twin",  eta:"14:00", vip:true,  status:"no-room",      gender:"M" as const },
      { id:"RES-1046", guest:"Miss Fatima Suleiman",     room:"—",   type:"Standard",     eta:"15:00", vip:false, status:"no-room",      gender:"F" as const },
      { id:"RES-1047", guest:"Mr. Biodun Olatunji",      room:"112", type:"Standard",     eta:"16:00", vip:false, status:"arriving",     gender:"M" as const },
    ];
    const FD_DEPARTURES = [
      { room:"101", guest:"Amaka Osei",        type:"Suite",    checkout:"12:00", balance:0,     status:"departed",      gender:"F" as const },
      { room:"203", guest:"Alhaji Musa Bello", type:"Deluxe",   checkout:"11:00", balance:45000, status:"still-in",      gender:"M" as const },
      { room:"304", guest:"Blessing Okafor",   type:"Standard", checkout:"11:00", balance:0,     status:"late-checkout", gender:"F" as const },
      { room:"209", guest:"Emmanuel Adeyemi",  type:"Deluxe",   checkout:"12:00", balance:8200,  status:"still-in",      gender:"M" as const },
      { room:"406", guest:"Grace Achebe",      type:"Executive",checkout:"14:00", balance:0,     status:"approved-late", gender:"F" as const },
    ];
    const FD_MSGS = [
      { room:"304", guest:"Blessing Okafor",   msg:"Requesting late checkout until 14:00 — meeting ran over", time:"09:31", unread:true,  type:"request" },
      { room:"203", guest:"Alhaji Musa Bello", msg:"Please settle my outstanding balance before I leave",       time:"09:18", unread:true,  type:"billing" },
      { room:"118", guest:"Emmanuel Adeyemi",  msg:"AC not cooling properly — room feels very warm",            time:"08:47", unread:true,  type:"complaint" },
      { room:"405", guest:"Prof. Ngozi Umeora",msg:"Confirming arrival around 13:00 — need non-smoking floor",  time:"08:12", unread:false, type:"info" },
    ];
    const ciDone    = FD_ARRIVALS.filter(a => a.status === "checked-in").length;
    const noRoom    = FD_ARRIVALS.filter(a => a.status === "no-room").length;
    const stillIn   = FD_DEPARTURES.filter(d => ["still-in","late-checkout"].includes(d.status)).length;
    const openBal   = FD_DEPARTURES.filter(d => d.balance > 0).reduce((s,d) => s + d.balance, 0);
    const unreadMsg = FD_MSGS.filter(m => m.unread).length;

    const arrSc = (s: string) =>
      s === "checked-in"   ? { bg:"#DCFCE7", text:"#166534", label:"Checked In"  }
      : s === "arriving"   ? { bg:"#DBEAFE", text:"#1E40AF", label:"Arriving"    }
      :                      { bg:"#FEF3C7", text:"#92400E", label:"No Room"     };
    const depSc = (s: string) =>
      s === "departed"       ? { bg:"#F1F5F9", text:"#475569", label:"Departed"      }
      : s === "still-in"    ? { bg:"#FEE2E2", text:"#991B1B", label:"Overdue"       }
      : s === "late-checkout"? { bg:"#FEF3C7", text:"#92400E", label:"Late Check-Out" }
      :                        { bg:"#DCFCE7", text:"#166534", label:"Late Approved"  };
    const msgSc = (t: string) =>
      t === "complaint" ? ERROR : t === "billing" ? ORANGE : t === "request" ? WARNING : MUTED;

    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold" style={{ color: TEXT }}>Front Desk</h1>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Morning shift 07:00–15:00</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => go("walk-in", "Walk-In Registration")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Plus size={13} />Walk-In
            </button>
            <button onClick={() => go("check-out", "Check-Out")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <ArrowUpFromLine size={13} />Check-Out
            </button>
            <button onClick={() => go("check-in", "Check-In")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <ArrowDownToLine size={13} />Check-In
            </button>
          </div>
        </div>

        {/* KPI strip — 6 cards */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {[
            { label:"Arrivals",          value:"7",           sub:`${ciDone} checked in · ${noRoom} no room`, accent:PRIMARY,  icon:ArrowDownToLine },
            { label:"Checked In",        value:`${ciDone}/7`,  sub:"completed this shift",                    accent:SUCCESS,  icon:CheckCircle2    },
            { label:"No Room Assigned",  value:String(noRoom), sub:"need room before arrival",                accent:noRoom > 0 ? ERROR : MUTED, icon:BedDouble },
            { label:"Departures",        value:"5",           sub:`${stillIn} still on property`,             accent:MUTED,    icon:ArrowUpFromLine },
            { label:"Overdue",           value:String(stillIn),sub:"past checkout time",                      accent:stillIn > 0 ? ERROR : MUTED, icon:AlertTriangle },
            { label:"Unread Messages",   value:String(unreadMsg), sub:`₦${openBal.toLocaleString()} outstanding bal`, accent:unreadMsg > 0 ? WARNING : MUTED, icon:MessageSquare },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white rounded-xl p-3.5 border" style={{ borderColor: BORDER }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${k.accent}14` }}>
                  <Icon size={14} style={{ color: k.accent }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: k.accent }}>{k.label}</div>
                <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{k.sub}</div>
              </div>
            );
          })}
        </div>

        {/* No-room alert */}
        {noRoom > 0 && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor:"#FEF3C7", border:"1px solid #FDE68A" }}>
            <AlertTriangle size={14} style={{ color:"#92400E" }} />
            <div className="flex-1 text-xs font-semibold" style={{ color:"#92400E" }}>
              {noRoom} arriving guest{noRoom !== 1 ? "s" : ""} have no room assigned — assign rooms before their ETA
            </div>
            <button onClick={() => go("room-assignment", "Room Assignment")} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor:"#92400E", color:"white" }}>
              Room Assignment →
            </button>
          </div>
        )}

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Arrivals */}
          <RoleCard title={`Today's Arrivals (${FD_ARRIVALS.length})`}>
            {FD_ARRIVALS.map((g, i) => {
              const sc = arrSc(g.status);
              return (
                <div key={g.id} className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors"
                  style={{ borderColor: BORDER }} onClick={() => go("check-in", "Check-In")}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Av gender={g.gender} size={30} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold truncate" style={{ color: TEXT }}>{g.guest}</span>
                      {g.vip && <Star size={9} fill={ORANGE} style={{ color: ORANGE }} />}
                    </div>
                    <div className="text-xs" style={{ color: MUTED }}>
                      {g.room !== "—" ? `Rm ${g.room}` : "No room"} · {g.type} · ETA {g.eta}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                </div>
              );
            })}
            <div className="px-4 py-2.5">
              <button onClick={() => go("arrivals", "Arrivals")} className="text-xs font-semibold" style={{ color: TEAL }}>Full arrivals list →</button>
            </div>
          </RoleCard>

          {/* Departures */}
          <RoleCard title={`Today's Departures (${FD_DEPARTURES.length})`}>
            {FD_DEPARTURES.map((d, i) => {
              const sc = depSc(d.status);
              return (
                <div key={d.room} className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors"
                  style={{ borderColor: BORDER }} onClick={() => go("check-out", "Check-Out")}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Av gender={d.gender} size={30} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{d.guest}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Rm {d.room} · {d.type} · CO {d.checkout}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                    {d.balance > 0 && <div className="text-xs font-bold mt-0.5" style={{ color: ERROR, fontFamily: "'JetBrains Mono', monospace" }}>₦{d.balance.toLocaleString()}</div>}
                  </div>
                </div>
              );
            })}
            <div className="px-4 py-2.5">
              <button onClick={() => go("departures", "Departures")} className="text-xs font-semibold" style={{ color: TEAL }}>Full departures list →</button>
            </div>
          </RoleCard>

          {/* Messages + Quick Links */}
          <div className="flex flex-col gap-4">
            <RoleCard title={`Guest Messages (${unreadMsg} unread)`}>
              {FD_MSGS.map((m, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-colors"
                  style={{ borderColor: BORDER }} onClick={() => go("guest-messaging", "Guest Messaging")}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: m.unread ? msgSc(m.type) : "transparent" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: TEXT }}>{m.guest}</span>
                      <span className="text-xs" style={{ color: SUBTLE, fontFamily: "'JetBrains Mono', monospace" }}>{m.time}</span>
                    </div>
                    <div className="text-xs" style={{ color: SUBTLE }}>Rm {m.room}</div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{m.msg}</div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button onClick={() => go("guest-messaging", "Guest Messaging")} className="text-xs font-semibold" style={{ color: TEAL }}>All messages →</button>
              </div>
            </RoleCard>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Actions</div>
              <div className="space-y-2">
                {[
                  { label:"New Reservation",    screen:"new-reservation", color:PRIMARY  },
                  { label:"Guest Profiles",     screen:"guest-profiles",  color:TEAL     },
                  { label:"Room Assignment",    screen:"room-assignment",  color:ORANGE   },
                  { label:"Folio Management",   screen:"folio",           color:SUCCESS  },
                  { label:"Key Card Mgmt",      screen:"key-card",        color:MUTED    },
                  { label:"Lost & Found",       screen:"lost-found",      color:SUBTLE   },
                ].map(a => (
                  <button key={a.label} onClick={() => go(a.screen, a.label)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-[#F0F4F8]"
                    style={{ borderColor: BORDER, color: TEXT }}>
                    {a.label}
                    <span style={{ color: a.color }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── HK Dashboard ─────────────────────────────────────────────────────────────
  if (role === "HK") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Housekeeping</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Morning shift</div></div>
        <div className="flex gap-2">
          <button onClick={() => go("new-trip", "New Trip Request")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
            <Car size={13} />Request Vehicle
          </button>
          <button onClick={() => go("hk-board", "Housekeeping Board")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <BedDouble size={13} />HK Board
          </button>
        </div>
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
        <div className="flex gap-2">
          <button onClick={() => go("new-trip", "New Trip Request")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
            <Car size={13} />Request Vehicle
          </button>
          <button onClick={() => go("generator-diesel", "Generator Diesel")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
            <Zap size={13} />Generator Diesel
          </button>
          <button onClick={() => go("work-orders", "Work Orders")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <Wrench size={13} />Work Orders
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoleKPI label="Open Orders" value="7" sub="all priorities" accent={PRIMARY} icon={Wrench} />
        <RoleKPI label="Overdue" value="2" sub="SLA breached" accent={ERROR} icon={AlertTriangle} />
        <RoleKPI label="PM Due" value="1" sub="generator — 7 days" accent={ORANGE} icon={CalendarCheck} />
        <RoleKPI label="Completed" value="3" sub="this shift" accent={SUCCESS} icon={CheckCircle2} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="px-5 py-3">
            <button onClick={() => go("work-orders", "Work Orders")} className="text-xs font-semibold" style={{ color: TEAL }}>All work orders →</button>
          </div>
        </RoleCard>

        <div className="flex flex-col gap-4">
          {/* Generator status */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={13} style={{ color: WARNING }} />
                <div className="text-sm font-semibold" style={{ color: TEXT }}>Generator Status</div>
              </div>
              <button onClick={() => go("generator-diesel", "Generator Diesel")} className="text-xs font-semibold" style={{ color: TEAL }}>Log diesel →</button>
            </div>
            {[
              { name:"Main Generator",  kva:500, status:"standby", svcLeft:220 },
              { name:"Block B Backup",  kva:200, status:"standby", svcLeft:60  },
              { name:"Pool Area Small", kva:50,  status:"running",  svcLeft:190 },
            ].map(g => {
              const sc = g.status === "running" ? { bg:"#DCFCE7", text:"#166534" } : { bg:"#EFF6FF", text:"#1D4ED8" };
              return (
                <div key={g.name} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{g.name}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{g.kva} kVA · {g.svcLeft} hrs to service</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {g.svcLeft <= 100 && <AlertTriangle size={11} style={{ color: WARNING }} />}
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>{g.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preventive maintenance due */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold" style={{ color: TEXT }}>PM Schedule — Next 7 Days</div>
              <button onClick={() => go("preventive-schedule", "Preventive Schedule")} className="text-xs font-semibold" style={{ color: TEAL }}>Full schedule →</button>
            </div>
            {[
              { asset:"HVAC Unit — Floor 3", due:"02 Aug", priority:"High",   status:"due"     },
              { asset:"Fire Suppression Check", due:"04 Aug", priority:"Critical", status:"upcoming"},
              { asset:"Pool Pump Inspection",   due:"05 Aug", priority:"Medium", status:"upcoming"},
              { asset:"Elevator — Cab 2",       due:"07 Aug", priority:"High",   status:"upcoming"},
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{p.asset}</div>
                  <div className="text-xs" style={{ color: MUTED }}>Due {p.due}</div>
                </div>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: p.priority === "Critical" ? "#FEE2E2" : p.priority === "High" ? "#FEF3C7" : "#F1F5F9", color: p.priority === "Critical" ? "#991B1B" : p.priority === "High" ? "#92400E" : "#475569" }}>
                  {p.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── RT Dashboard ─────────────────────────────────────────────────────────────
  if (role === "RT") return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Restaurant & POS</h1>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Breakfast 06:30–10:30</div></div>
        <div className="flex gap-2">
          <button onClick={() => go("new-trip", "New Trip Request")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
            <Car size={13} />Request Vehicle
          </button>
          <button onClick={() => go("pos-terminal", "POS Terminal")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <UtensilsCrossed size={13} />Open POS
          </button>
        </div>
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
  if (role === "FIN") {
    const FIN_WEEKLY = [
      { day:"Mon", actual:980000,  target:1100000 },
      { day:"Tue", actual:1140000, target:1100000 },
      { day:"Wed", actual:1070000, target:1100000 },
      { day:"Thu", actual:1250000, target:1100000 },
      { day:"Fri", actual:890000,  target:1100000 },
      { day:"Sat", actual:1380000, target:1100000 },
      { day:"Sun", actual:720000,  target:1100000 },
    ];
    const AP_AGING = [
      { supplier:"Emadeb Energy",      due:"01 Aug", days:0,  amount:320000, status:"current" },
      { supplier:"Umarfaruq Feeds",    due:"28 Jul", days:3,  amount:84000,  status:"overdue" },
      { supplier:"Ardova Direct",      due:"25 Jul", days:6,  amount:236000, status:"overdue" },
      { supplier:"Hygiene Plus Ltd",   due:"15 Aug", days:-14,amount:145000, status:"upcoming"},
    ];
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Finance &amp; Billing</h1>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Day close: Pending</div></div>
          <div className="flex gap-2">
            <button onClick={() => go("accounting-export", "Accounting Export")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Download size={13} />Export
            </button>
            <button onClick={() => go("daily-summary", "Daily Summary")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <DollarSign size={13} />Daily Summary
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <RoleKPI label="Revenue Today" value="₦1.25M" sub="113% of ₦1.1M target"  accent={SUCCESS}  icon={TrendingUp}  />
          <RoleKPI label="Outstanding"   value="₦284K"  sub="3 open guest folios"    accent={ERROR}    icon={FileText}   />
          <RoleKPI label="AP Due / Wk"   value="₦640K"  sub="2 suppliers overdue"    accent={ORANGE}   icon={CreditCard} />
          <RoleKPI label="Day Close"     value="Pending" sub="audit not yet run"      accent={WARNING}  icon={RefreshCw}  />
        </div>

        {/* Revenue vs Target chart */}
        <div className="bg-white rounded-xl border p-4 mb-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Revenue vs Target — Last 7 Days</div>
            <button onClick={() => go("revenue-reports", "Revenue Reports")} className="text-xs font-semibold" style={{ color: TEAL }}>Full report →</button>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={FIN_WEEKLY} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `₦${(v / 1000000).toFixed(1)}M`} domain={[0, 1600000]} />
              <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`}
                contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="actual" name="Actual" fill={PRIMARY} radius={[3,3,0,0]} barSize={14} />
              <Bar dataKey="target" name="Target" fill="#E5E7EB"  radius={[3,3,0,0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1 justify-end text-xs" style={{ color: MUTED }}>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: PRIMARY }} />Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: "#E5E7EB" }} />Target</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RoleCard title="Open Folios">
            {IN_HOUSE.filter(g => g.balance > 0).map((g, i) => (
              <div key={g.room} className="flex items-center gap-3 px-5 py-3 border-b cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                style={{ borderColor: BORDER }} onClick={() => go("folio", "Folio Management")}>
                <Av gender={i % 2 === 0 ? "M" : "F"} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{g.guest}</div>
                  <div className="text-xs" style={{ color: MUTED }}>Room {g.room} · Out {g.checkout}</div>
                </div>
                <span className="text-xs font-bold" style={{ color: ERROR, fontFamily: "'JetBrains Mono', monospace" }}>₦{g.balance.toLocaleString()}</span>
              </div>
            ))}
            <div className="px-5 py-3">
              <button onClick={() => go("finance-folio", "Folio Management")} className="text-xs font-semibold" style={{ color: TEAL }}>All folios →</button>
            </div>
          </RoleCard>

          <RoleCard title="AP Aging">
            {AP_AGING.map(a => {
              const sc = a.status === "overdue" ? { bg:"#FEE2E2", text:"#991B1B" } : a.status === "current" ? { bg:"#DCFCE7", text:"#166534" } : { bg:"#EFF6FF", text:"#1E40AF" };
              return (
                <div key={a.supplier} className="px-5 py-3 border-b" style={{ borderColor: BORDER }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: TEXT }}>{a.supplier}</span>
                    <span className="text-xs font-bold" style={{ color: a.status === "overdue" ? ERROR : TEXT, fontFamily: "'JetBrains Mono', monospace" }}>
                      ₦{a.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs" style={{ color: MUTED }}>Due {a.due}{a.days > 0 ? ` · ${a.days}d overdue` : ""}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
            <div className="px-5 py-3">
              <button onClick={() => go("accounts-payable", "Accounts Payable")} className="text-xs font-semibold" style={{ color: TEAL }}>All payables →</button>
            </div>
          </RoleCard>

          {/* Unposted charges + quick links */}
          <div className="flex flex-col gap-4">
            <RoleCard title="Unposted Charges">
              {[
                { desc:"Room charge — Rm 202 × 1 night", amount:"₦55,000", dept:"Rooms" },
                { desc:"Room Service Rm 118 × RS-041",   amount:"₦8,500",  dept:"F&B"  },
                { desc:"Minibar Rm 304 × 2 items",       amount:"₦3,200",  dept:"F&B"  },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{c.desc}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{c.dept}</div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: ORANGE, fontFamily: "'JetBrains Mono', monospace" }}>{c.amount}</span>
                </div>
              ))}
            </RoleCard>
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Links</div>
              {[
                { label:"Night Audit",        screen:"night-audit"         },
                { label:"Refund Processing",  screen:"refund-processing"   },
                { label:"Tax Configuration",  screen:"tax-config"          },
                { label:"Folio Void/Reversal",screen:"folio-void"          },
                { label:"Credit Notes",       screen:"credit-notes"        },
              ].map(a => (
                <button key={a.label} onClick={() => go(a.screen, a.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border mb-1.5 last:mb-0 hover:bg-[#F0F4F8] transition-colors"
                  style={{ borderColor: BORDER, color: TEXT }}>
                  {a.label}<span style={{ color: TEAL }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RSV Dashboard ─────────────────────────────────────────────────────────────
  if (role === "RSV") {
    const RSV_PIPELINE = [
      { date:"01 Aug", arr:12, dep:8,  occ:88, rev:1250000 },
      { date:"02 Aug", arr:9,  dep:11, occ:86, rev:1190000 },
      { date:"03 Aug", arr:14, dep:7,  occ:93, rev:1365000 },
      { date:"04 Aug", arr:6,  dep:12, occ:87, rev:1218000 },
      { date:"05 Aug", arr:11, dep:9,  occ:89, rev:1243000 },
      { date:"06 Aug", arr:8,  dep:13, occ:84, rev:1176000 },
      { date:"07 Aug", arr:15, dep:5,  occ:94, rev:1421000 },
    ];
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>Reservations</h1>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Reservations Officer view</div></div>
          <div className="flex gap-2">
            <button onClick={() => go("reservation-search", "Reservation Search")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Search size={13} />Search
            </button>
            <button onClick={() => go("new-reservation", "New Reservation")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <Plus size={13} />New Reservation
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <RoleKPI label="Bookings Today"  value="7"  sub="4 confirmed · 3 pending" accent={PRIMARY} icon={CalendarDays} />
          <RoleKPI label="Pipeline (7d)"   value="34" sub="reservations ahead"      accent={TEAL}    icon={TrendingUp}   />
          <RoleKPI label="Waitlist"        value="3"  sub="guests waiting"           accent={ORANGE}  icon={ClipboardList}/>
          <RoleKPI label="Group Blocks"    value="1"  sub="12 rooms · 60% picked up" accent={SUCCESS}  icon={Users}        />
        </div>

        {/* 7-day pipeline chart */}
        <div className="bg-white rounded-xl border p-4 mb-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: TEXT }}>7-Day Arrival / Departure Pipeline</div>
            <button onClick={() => go("availability-board", "Availability Board")} className="text-xs font-semibold" style={{ color: TEAL }}>Availability Board →</button>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={RSV_PIPELINE} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} domain={[0, 20]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="arr" name="Arrivals"   fill={PRIMARY} radius={[3,3,0,0]} barSize={14} />
              <Bar dataKey="dep" name="Departures" fill={TEAL}    radius={[3,3,0,0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-end text-xs" style={{ color: MUTED }}>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: PRIMARY }} />Arrivals</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: TEAL }} />Departures</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RoleCard title="Upcoming Reservations">
            {ALL_RES.slice(0, 5).map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3 border-b cursor-pointer transition-colors"
                style={{ borderColor: BORDER }} onClick={() => go("reservation-search", "Reservation Search")}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Av gender={i % 2 === 0 ? "M" : "F"} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: TEXT }}>{r.guest}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{r.checkin} – {r.checkout} · {r.type}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: resStC[r.status]?.bg ?? "#F3F4F6", color: resStC[r.status]?.text ?? "#374151" }}>{r.status}</span>
              </div>
            ))}
            <div className="px-5 py-3">
              <button onClick={() => go("reservation-grid", "Reservation Grid")} className="text-xs font-semibold" style={{ color: TEAL }}>Full reservation grid →</button>
            </div>
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
            <div className="px-5 py-3">
              <button onClick={() => go("waitlist", "Waitlist")} className="text-xs font-semibold" style={{ color: TEAL }}>Manage waitlist →</button>
            </div>
          </RoleCard>

          {/* Quick Links + Cancellations */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Recent Cancellations</div>
              {[
                { id:"RES-1031", guest:"Mr. Bello Haruna",   type:"Deluxe",   reason:"Change of plans", date:"31 Jul", penalty:"₦15,000" },
                { id:"RES-1028", guest:"Miss Chika Okafor",  type:"Standard", reason:"No-show",         date:"30 Jul", penalty:"₦25,000" },
                { id:"RES-1025", guest:"Dr. Lawal Ibrahim",  type:"Suite",    reason:"Flight cancelled", date:"29 Jul", penalty:"Waived"  },
              ].map(c => (
                <div key={c.id} className="py-2 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: "'JetBrains Mono', monospace" }}>{c.id}</span>
                    <span className="text-xs" style={{ color: MUTED }}>{c.date}</span>
                  </div>
                  <div className="text-xs" style={{ color: TEXT }}>{c.guest} · {c.type}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs" style={{ color: MUTED }}>{c.reason}</span>
                    <span className="text-xs font-bold" style={{ color: c.penalty === "Waived" ? SUCCESS : ERROR }}>{c.penalty}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Actions</div>
              {[
                { label:"Group Bookings",  screen:"group-bookings"  },
                { label:"Rate Calendar",   screen:"rate-calendar"   },
                { label:"Room Types",      screen:"room-types"      },
                { label:"Cancellation &amp; Refund", screen:"cancellation" },
              ].map(a => (
                <button key={a.label} onClick={() => go(a.screen, a.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border mb-1.5 last:mb-0 transition-colors hover:bg-[#F0F4F8]"
                  style={{ borderColor: BORDER, color: TEXT }}>
                  <span dangerouslySetInnerHTML={{ __html: a.label }} />
                  <span style={{ color: TEAL }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // ── FLT Dashboard ─────────────────────────────────────────────────────────────
  if (role === "FLT") {
    const FLEET_TRIPS = [
      { id:"TRP-0041", status:"en-route",    passenger:"Amaka Osei",        route:"Hotel → NAIA Terminal 2", driver:"Uche Obi",     vehicle:"ABJ 123 XA", dept:null },
      { id:"TRP-0040", status:"in-transit",  passenger:"Alhaji Musa Bello", route:"Abuja Sheraton → Hotel", driver:"Emeka Eze",    vehicle:"ABJ 456 YB", dept:null },
      { id:"TRP-0039", status:"dispatched",  passenger:"HR",                route:"Hotel → FCTA Office",    driver:"Musa Danladi", vehicle:"ABJ 789 ZC", dept:"HR" },
      { id:"TRP-0038", status:"assigned",    passenger:"Blessing Okoro",    route:"Airport → Hotel",        driver:"Uche Obi",     vehicle:"ABJ 123 XA", dept:null },
      { id:"TRP-0037", status:"pending-approval", passenger:"Finance", route:"Hotel → Zenith Bank HQ", driver:"—", vehicle:"—", dept:"Finance" },
      { id:"TRP-0036", status:"requested",   passenger:"Chidi Nwosu",       route:"Hotel → Silverbird",     driver:"—",            vehicle:"—",          dept:null },
    ];
    const statusColor: Record<string, { bg: string; text: string; label: string }> = {
      "pending-approval": { bg:"#F3E8FF", text:"#7C3AED", label:"Pending Approval" },
      "requested":        { bg:"#DBEAFE", text:"#1E40AF", label:"Requested"         },
      "assigned":         { bg:"#E0F2FE", text:"#0369A1", label:"Assigned"          },
      "dispatched":       { bg:"#FEF3C7", text:"#92400E", label:"Dispatched"        },
      "en-route":         { bg:"#FFF7ED", text:"#C2410C", label:"En-Route"          },
      "in-transit":       { bg:"#DCFCE7", text:"#166534", label:"In-Transit"        },
      "completed":        { bg:"#F1F5F9", text:"#475569", label:"Completed"         },
      "cancelled":        { bg:"#FEE2E2", text:"#991B1B", label:"Cancelled"         },
    };
    const FLEET_VEHICLES = [
      { id:"ABJ-001E", plate:"ABJ 123 XA", make:"Toyota Camry",      status:"active",      driver:"Uche Obi",     docSt:"valid",          odom:47963, util:78 },
      { id:"ABJ-002E", plate:"ABJ 456 YB", make:"Toyota HiAce",      status:"active",      driver:"Emeka Eze",    docSt:"expiring-soon",  odom:98210, util:62 },
      { id:"ABJ-003V", plate:"ABJ 789 ZC", make:"Toyota Land Cruiser",status:"active",      driver:"Musa Danladi", docSt:"valid",          odom:31480, util:55 },
      { id:"ABJ-004V", plate:"ABJ 321 WD", make:"Mercedes Sprinter", status:"maintenance", driver:"—",            docSt:"expired",        odom:214850,util:0  },
    ];
    const GENS = [
      { name:"Main Generator",  kva:500, status:"standby", svcLeft:220 },
      { name:"Block B Backup",  kva:200, status:"standby", svcLeft:60  },
      { name:"Pool Area Small", kva:50,  status:"running",  svcLeft:190 },
    ];
    const activeTrips = FLEET_TRIPS.filter(t => ["dispatched","en-route","in-transit"].includes(t.status));
    const pendingApproval = FLEET_TRIPS.filter(t => t.status === "pending-approval");
    const vehiclesAvailable = FLEET_VEHICLES.filter(v => v.status === "active").length;
    const docAlerts = FLEET_VEHICLES.filter(v => v.docSt !== "valid").length;

    return (
      <div>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold" style={{ color: TEXT }}>Fleet &amp; Transport</h1>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Fleet Supervisor view</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => go("vehicle-register", "Vehicle Register")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Car size={13} />Vehicles
            </button>
            <button onClick={() => go("dispatch-board", "Dispatch Board")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <Activity size={13} />Dispatch Board
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <RoleKPI label="Active Trips"        value={String(activeTrips.length)}    sub="dispatched / en-route / in-transit" accent={PRIMARY}  icon={Car}           />
          <RoleKPI label="Vehicles Available"  value={`${vehiclesAvailable}/4`}      sub="1 in maintenance"                   accent={SUCCESS}  icon={CheckCircle2}  />
          <RoleKPI label="Pending Approval"    value={String(pendingApproval.length)} sub={pendingApproval.length > 0 ? "Awaiting supervisor sign-off" : "Queue clear"} accent={pendingApproval.length > 0 ? ERROR : MUTED} icon={AlertTriangle} />
          <RoleKPI label="Doc / Service Alerts" value={String(docAlerts)}            sub="vehicles with expired or expiring docs" accent={docAlerts > 0 ? WARNING : MUTED} icon={Wrench} />
        </div>

        {pendingApproval.length > 0 && (
          <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor:"#F3E8FF", border:"1px solid #DDD6FE" }}>
            <div className="text-xs font-bold mb-2" style={{ color:"#6D28D9" }}>Pending Approval — {pendingApproval.length} trip{pendingApproval.length !== 1 ? "s" : ""} need supervisor sign-off</div>
            {pendingApproval.map(t => (
              <div key={t.id} className="flex items-center justify-between py-1.5">
                <div className="text-xs" style={{ color:"#4C1D95" }}>
                  <span className="font-bold" style={{ fontFamily:"'JetBrains Mono', monospace" }}>{t.id}</span> · {t.route} · {t.dept ?? t.passenger}
                </div>
                <button onClick={() => go("dispatch-board", "Dispatch Board")}
                  className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor:"#7C3AED", color:"white" }}>
                  Review →
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Dispatch queue */}
          <RoleCard title="Today's Trips">
            {FLEET_TRIPS.slice(0, 5).map(t => {
              const sc = statusColor[t.status] ?? { bg:"#F1F5F9", text:"#475569", label:t.status };
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 border-b cursor-pointer transition-colors"
                  style={{ borderColor: BORDER }}
                  onClick={() => go("dispatch-board", "Dispatch Board")}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0F4F8")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold" style={{ color:PRIMARY, fontFamily:"'JetBrains Mono', monospace" }}>{t.id}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor:sc.bg, color:sc.text }}>{sc.label}</span>
                    </div>
                    <div className="text-xs truncate" style={{ color:TEXT }}>{t.route}</div>
                    <div className="text-xs" style={{ color:MUTED }}>{t.driver !== "—" ? `${t.driver} · ${t.vehicle}` : "Unassigned"}</div>
                  </div>
                </div>
              );
            })}
            <div className="px-5 py-3">
              <button onClick={() => go("dispatch-board", "Dispatch Board")} className="text-xs font-semibold" style={{ color:TEAL }}>
                Full dispatch board →
              </button>
            </div>
          </RoleCard>

          {/* Vehicle + Generator status */}
          <div className="flex flex-col gap-4">
            <RoleCard title="Vehicle Readiness">
              {FLEET_VEHICLES.map(v => {
                const stSc = v.status === "active" ? { bg:"#DCFCE7", text:"#166534" } : v.status === "maintenance" ? { bg:"#FEF3C7", text:"#92400E" } : { bg:"#FEE2E2", text:"#991B1B" };
                const docSc = v.docSt === "valid" ? { color:SUCCESS } : v.docSt === "expiring-soon" ? { color:WARNING } : { color:ERROR };
                return (
                  <div key={v.id} className="flex items-center gap-3 px-5 py-3 border-b"
                    style={{ borderColor: BORDER }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold" style={{ color:TEXT, fontFamily:"'JetBrains Mono', monospace" }}>{v.plate}</div>
                      <div className="text-xs" style={{ color:MUTED }}>{v.make} · {v.driver}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor:stSc.bg, color:stSc.text }}>{v.status}</span>
                      <span className="text-xs font-semibold" style={{ color:docSc.color }}>
                        {v.docSt === "valid" ? "Docs OK" : v.docSt === "expiring-soon" ? "Expiring" : "Expired"}
                      </span>
                      <span className="text-xs" style={{ color:MUTED }}>{v.util}%</span>
                    </div>
                  </div>
                );
              })}
            </RoleCard>

            <RoleCard title="Generator Status">
              {GENS.map(g => {
                const gSc = g.status === "running" ? { bg:"#DCFCE7", text:"#166534" } : g.status === "standby" ? { bg:"#EFF6FF", text:"#1D4ED8" } : { bg:"#FEF3C7", text:"#92400E" };
                const svcSc = g.svcLeft <= 100 ? WARNING : SUCCESS;
                return (
                  <div key={g.name} className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold" style={{ color:TEXT }}>{g.name}</div>
                      <div className="text-xs" style={{ color:MUTED }}>{g.kva} kVA · {g.svcLeft} hrs to service</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor:gSc.bg, color:gSc.text }}>{g.status}</span>
                      {g.svcLeft <= 100 && <AlertTriangle size={12} style={{ color:WARNING }} />}
                    </div>
                  </div>
                );
              })}
              <div className="px-5 py-3">
                <span className="text-xs" style={{ color:SUBTLE }}>Diesel procurement handled by Procurement dept.</span>
              </div>
            </RoleCard>
          </div>
        </div>
      </div>
    );
  }

  // ── DRV Dashboard ─────────────────────────────────────────────────────────────
  if (role === "DRV") {
    const DRV_TRIPS = [
      { id:"TRP-0041", time:"08:00", route:"Hotel → NAIA Terminal 2",  passenger:"Amaka Osei",        status:"en-route",   plate:"ABJ 123 XA" },
      { id:"TRP-0038", time:"14:30", route:"Airport → Hotel",          passenger:"Blessing Okoro",    status:"assigned",   plate:"ABJ 123 XA" },
      { id:"TRP-0035", time:"17:00", route:"Hotel → Aso Rock",         passenger:"Finance Delegation", status:"scheduled",  plate:"ABJ 123 XA" },
    ];
    const tSc: Record<string, { bg:string; text:string }> = {
      "en-route":  { bg:"#FFF7ED", text:"#C2410C" },
      "assigned":  { bg:"#DBEAFE", text:"#1E40AF" },
      "scheduled": { bg:"#F3F4F6", text:"#374151" },
      "completed": { bg:"#DCFCE7", text:"#166534" },
    };
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div><h1 className="text-lg font-bold" style={{ color: TEXT }}>My Dashboard</h1>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>01 Aug 2026 · Driver view</div></div>
          <button onClick={() => go("new-trip", "New Trip Request")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <Car size={13} />Request Trip
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <RoleKPI label="Today's Trips" value="3"    sub="1 active · 2 upcoming" accent={PRIMARY}  icon={Car}          />
          <RoleKPI label="Km Today"      value="84km" sub="est. 210km total"      accent={TEAL}     icon={MapPin}       />
          <RoleKPI label="Vehicle"       value="ABJ 123 XA" sub="Toyota Camry"   accent={SUCCESS}   icon={CheckCircle2} />
          <RoleKPI label="Fuel Level"    value="72%"  sub="~310 km range"         accent={WARNING}   icon={Layers}       />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RoleCard title="Today's Trips">
            {DRV_TRIPS.map(t => (
              <div key={t.id} className="flex items-start gap-4 px-5 py-3.5 border-b" style={{ borderColor: BORDER }}>
                <div className="text-xs font-bold pt-0.5 flex-shrink-0" style={{ color: PRIMARY, fontFamily:"'JetBrains Mono',monospace", minWidth:42 }}>{t.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{t.route}</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>{t.passenger}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tSc[t.status]?.bg ?? "#F3F4F6", color: tSc[t.status]?.text ?? "#374151" }}>
                  {t.status}
                </span>
              </div>
            ))}
            <div className="px-5 py-3">
              <button onClick={() => go("driver-access-log", "Driver Access Log")} className="text-xs font-semibold" style={{ color: TEAL }}>My access log →</button>
            </div>
          </RoleCard>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Vehicle Status</div>
              {[
                { label:"Plate",       value:"ABJ 123 XA"    },
                { label:"Make",        value:"Toyota Camry 2022" },
                { label:"Odometer",    value:"47,963 km"     },
                { label:"Road Worth.", value:"Valid · 30 Sep 2026" },
                { label:"Insurance",  value:"Valid · 15 Dec 2026" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5 border-b last:border-b-0" style={{ borderColor: BORDER }}>
                  <span className="text-xs" style={{ color: MUTED }}>{r.label}</span>
                  <span className="text-xs font-semibold" style={{ color: TEXT }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Actions</div>
              {[
                { label:"Report Defect",     screen:"internal-chat"  },
                { label:"Internal Chat",     screen:"internal-chat"  },
                { label:"Announcements",     screen:"announcements"  },
              ].map(a => (
                <button key={a.label} onClick={() => go(a.screen, a.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border mb-1.5 last:mb-0 hover:bg-[#F0F4F8] transition-colors"
                  style={{ borderColor: BORDER, color: TEXT }}>
                  {a.label}<span style={{ color: TEAL }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
