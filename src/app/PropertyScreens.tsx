// All screen components and shared UI primitives.
// Imported by App.tsx — no circular dependencies.
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, CalendarDays, KeyRound, BedDouble, Wrench,
  UtensilsCrossed, MessageSquare, DollarSign, Package, Users,
  Building2, BarChart3, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, User, ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, WifiOff, Plus, Search, Filter,
  MoreHorizontal, ArrowRight, Home, Layers, X, Lock, Globe,
  ClipboardList, CalendarCheck, Star, AlertCircle, Clock,
  RefreshCw, Hash, FileText, CreditCard, Truck, Phone,
  Edit3, Eye, Trash2, Download, Send, Menu as MenuIcon,
  HelpCircle, Shield, Server, Cpu, Activity, Wifi,
  MinusCircle, PlusCircle, ShoppingCart, MapPin, Mail,
  UserCheck, BookOpen, Inbox, Zap,
  ArrowDownToLine, ArrowUpFromLine, XCircle, Camera, Copy, CloudLightning,
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
} from "./constants";

// ─── UI Primitives ──────────────────────────────────────────────────────────
// ─── PREMIUM UI PRIMITIVES ────────────────────────────────────────────────────

import { Badge, EmptyState, ToastC, LiveClock, SyncPill, StatCard, PageHeader, BtnP, BtnO, Inp, Sel } from "./UIKit";
export function WalkInReg({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [step, setStep] = useState(1);
  const [selRoom, setSelRoom] = useState<{ id: string; type: string; rate: number } | null>(null);
  const [rateOverride, setRateOverride] = useState("");
  const [showOverride, setShowOverride] = useState(false);
  const AVAIL_ROOMS = [
    { id: "102", type: "Standard", floor: 1, rate: 35000, hkSt: "Inspected" },
    { id: "104", type: "Standard", floor: 1, rate: 35000, hkSt: "Clean" },
    { id: "201", type: "Deluxe", floor: 2, rate: 55000, hkSt: "Inspected" },
    { id: "301", type: "Suite", floor: 3, rate: 91125, hkSt: "Inspected" },
    { id: "501", type: "Suite", floor: 5, rate: 91125, hkSt: "Inspected" },
  ];
  const effectiveRate = rateOverride ? parseInt(rateOverride.replace(/,/g, "")) || selRoom?.rate : selRoom?.rate;
  const nights = 1;
  const subtotal = (effectiveRate ?? 35000) * nights;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  const deposit = subtotal;
  return (
    <div>
      <PageHeader title="Walk-In Registration" sub="Register a new guest and check in simultaneously" />
      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Available Rooms</h3>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 mb-3">
                {AVAIL_ROOMS.map(r => (
                  <button key={r.id} onClick={() => setSelRoom({ id: r.id, type: r.type, rate: r.rate })}
                    className="text-left rounded-xl border overflow-hidden transition-all hover:shadow-md"
                    style={{ borderColor: selRoom?.id === r.id ? PRIMARY : BORDER, borderWidth: selRoom?.id === r.id ? 2 : 1 }}>
                    <div className="px-3 py-2" style={{ backgroundColor: selRoom?.id === r.id ? "#EFF6FF" : "#F9FAFB" }}>
                      <div className="text-base font-black" style={{ color: selRoom?.id === r.id ? PRIMARY : TEXT }}>{r.id}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{r.type} · Fl {r.floor}</div>
                    </div>
                    <div className="px-3 py-1.5">
                      <div className="text-xs font-bold" style={{ color: SUCCESS, fontFamily: mono }}>₦{r.rate.toLocaleString()}/n</div>
                      <div className="text-xs" style={{ color: MUTED }}>{r.hkSt}</div>
                    </div>
                  </button>
                ))}
              </div>
              {selRoom && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>
                  <CheckCircle2 size={13} />Room {selRoom.id} selected — {selRoom.type} · ₦{selRoom.rate.toLocaleString()}/night
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Guest Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <Inp label="First Name" placeholder="Chukwuemeka" />
                <Inp label="Last Name" placeholder="Okafor" />
                <Inp label="Phone" placeholder="+234 801 234 5678" />
                <Inp label="Email" placeholder="guest@email.com" />
                <Sel label="Nationality" options={["Nigerian", "Ghanaian", "Kenyan", "South African", "British", "American", "Other"]} />
                <Inp label="Address" placeholder="12 Murtala Mohammed Way, Abuja" />
                <Sel label="ID Type" options={["International Passport", "National ID", "Driver's License", "Voter's Card"]} />
                <Inp label="ID Number" placeholder="A12345678" />
              </div>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Stay & Payment</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Inp label="Check-in Date" type="date" defaultValue="2025-06-24" />
                <Inp label="Check-out Date" type="date" defaultValue="2025-06-25" />
                <Inp label="Deposit (₦)" defaultValue={deposit.toLocaleString()} />
                <Sel label="Payment Method" options={["Cash", "POS / Card", "Bank Transfer"]} />
              </div>
              <div className="border-t pt-3" style={{ borderColor: BORDER }}>
                <button onClick={() => setShowOverride(!showOverride)} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: showOverride ? ORANGE : MUTED }}>
                  <AlertTriangle size={11} />Rate Override (Manager approval required){showOverride ? " — hide" : ""}
                </button>
                {showOverride && (
                  <div className="mt-3 p-3 rounded-lg border" style={{ borderColor: ORANGE, backgroundColor: "#FFF7ED" }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: ORANGE }}>Override requires manager PIN authorisation</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1"><Inp label="Override Rate (₦/night)" placeholder={String(selRoom?.rate ?? 35000)} /></div>
                      <div className="flex-1"><Inp label="Manager PIN" type="password" placeholder="••••" /></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => { if (!selRoom) { add({ type: "error", title: "Select a room first" }); return; } setStep(2); add({ type: "success", title: "Walk-in registered", body: `BK-2860 created · Room ${selRoom.id}` }); }} className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ backgroundColor: PRIMARY }}>
              <CheckCircle2 size={16} />Register & Check In
            </button>
          </div>
          <div className="bg-white rounded-xl border p-5 h-fit" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Booking Summary</h3>
            <div className="space-y-2.5 text-sm">
              {[["Guest", "—"], ["Room", selRoom ? `${selRoom.id} · ${selRoom.type}` : "Not selected"], ["Check-in", "24 Jun 2025"], ["Check-out", "25 Jun 2025"], ["Nights", String(nights)]].map(([k,v]) => (
                <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>
              ))}
              <div className="border-t my-2" style={{ borderColor: BORDER }} />
              {[["Rate/night", `₦${(effectiveRate ?? 35000).toLocaleString()}`], ["Subtotal", `₦${subtotal.toLocaleString()}`], ["VAT (7.5%)", `₦${vat.toLocaleString()}`]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-xs"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT, fontFamily: mono }}>{v}</span></div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold" style={{ borderColor: BORDER }}>
                <span style={{ color: TEXT }}>Total</span>
                <span style={{ color: PRIMARY, fontFamily: mono }}>₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs"><span style={{ color: MUTED }}>Deposit</span><span className="font-semibold" style={{ color: SUCCESS, fontFamily: mono }}>₦{deposit.toLocaleString()}</span></div>
            </div>
            {selRoom && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Selected Room</div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: "#EFF6FF" }}>
                  <div className="text-xl font-black" style={{ color: PRIMARY }}>{selRoom.id}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{selRoom.type}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center max-w-lg mx-auto" style={{ borderColor: BORDER }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D1FAE5" }}><CheckCircle2 size={32} style={{ color: SUCCESS }} /></div>
          <h2 className="text-lg font-bold mb-1" style={{ color: TEXT }}>Guest Registered & Checked In</h2>
          <p className="text-sm mb-1" style={{ color: MUTED }}>Chukwuemeka Okafor · Room {selRoom?.id ?? "102"}</p>
          <p className="text-sm mb-1" style={{ color: MUTED, fontFamily: mono }}>Booking: BK-2860 created</p>
          <p className="text-sm mb-6" style={{ color: TEAL }}>Deposit: ₦{deposit.toLocaleString()} Cash received. Folio opened.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <BtnO label="Print Receipt" icon={FileText} />
            <BtnO label="Activate Room Access" icon={Lock} />
            <BtnP label="New Walk-In" icon={Plus} onClick={() => { setStep(1); setSelRoom(null); setRateOverride(""); setShowOverride(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}


// InspectionLog, LinenSupplies, HousekeepingSchedule, KeyCardMgmt, HKMyTasks → HKOpsScreens.tsx
export { InspectionLog, LinenSupplies, HousekeepingSchedule, KeyCardMgmt, HKMyTasks } from "./HKOpsScreens";




// WorkOrderDetail, AssetRegister, PreventiveSchedule, VendorContacts → MaintenanceScreens.tsx
export { WorkOrderDetail, AssetRegister, PreventiveSchedule, VendorContacts } from "./MaintenanceScreens";


// RT-05 Dining Reservations
export function DiningReservations({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [viewMode, setViewMode] = useState<"list"|"timeline">("list");
  const [dayFilter, setDayFilter] = useState("Today");
  const [showNew, setShowNew] = useState(false);
  const [showWalkin, setShowWalkin] = useState(false);
  const [selectedRes, setSelectedRes] = useState<string|null>(null);
  const [walkinParty, setWalkinParty] = useState("2");
  const [walkinTable, setWalkinTable] = useState("T04");

  const FULL_DINING_RES = [
    { id: "DR001", date: "2025-10-14", time: "13:00", party: 2, guest: "Adaeze Okafor", phone: "0801 234 5678", table: "T02", status: "Seated", requests: "Gluten-free menu", vip: false, resId: "RES-2041" },
    { id: "DR002", date: "2025-10-14", time: "19:30", party: 6, guest: "Bello Family", phone: "0802 345 6789", table: "T08", status: "Booked", requests: "Birthday cake, high chair", vip: true, resId: "" },
    { id: "DR003", date: "2025-10-14", time: "20:00", party: 4, guest: "Chike Eze", phone: "0803 456 7890", table: "T11", status: "Booked", requests: "", vip: false, resId: "RES-2033" },
    { id: "DR004", date: "2025-10-14", time: "20:00", party: 2, guest: "Suleiman & partner", phone: "0804 567 8901", table: "T05", status: "Booked", requests: "Vegetarian options, anniversary dinner", vip: true, resId: "" },
    { id: "DR005", date: "2025-10-14", time: "12:30", party: 3, guest: "Ngozi Dike", phone: "0805 678 9012", table: "T03", status: "Completed", requests: "", vip: false, resId: "" },
    { id: "DR006", date: "2025-10-14", time: "14:00", party: 1, guest: "Walk-in", phone: "", table: "T01", status: "Completed", requests: "", vip: false, resId: "" },
    { id: "DR007", date: "2025-10-14", time: "21:00", party: 8, guest: "Emeka Nwosu Group", phone: "0806 789 0123", table: "T14", status: "Booked", requests: "Corporate dinner, projector setup", vip: true, resId: "RES-2055" },
    { id: "DR008", date: "2025-10-14", time: "19:00", party: 2, guest: "Fatima Ibrahim", phone: "0807 890 1234", table: "T07", status: "No-show", requests: "", vip: false, resId: "" },
  ];

  const [reservations, setReservations] = useState(FULL_DINING_RES.map(r => ({ ...r })));

  const statusColors: Record<string,{bg:string;text:string}> = {
    "Booked":    { bg: "#DBEAFE", text: "#1E40AF" },
    "Seated":    { bg: "#DCFCE7", text: "#166534" },
    "Completed": { bg: "#F1F5F9", text: "#475569" },
    "No-show":   { bg: "#FEE2E2", text: "#991B1B" },
    "Cancelled": { bg: "#FEE2E2", text: "#991B1B" },
  };

  const timeSlots = ["12:00","12:30","13:00","13:30","14:00","14:30","19:00","19:30","20:00","20:30","21:00","21:30"];
  const TABLES_AVL = ["T01","T03","T04","T06","T09","T10","T12","T13"];

  const changeStatus = (id: string, status: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    add({ type: "success", title: `Reservation ${id} — ${status}` });
  };

  const coverForecast = timeSlots.map(t => ({
    slot: t,
    covers: reservations.filter(r => r.time === t && r.status !== "Cancelled" && r.status !== "No-show").reduce((s,r)=>s+r.party,0)
  }));
  const maxCovers = Math.max(...coverForecast.map(c=>c.covers), 1);

  const sel = reservations.find(r => r.id === selectedRes);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Dining Reservations" sub="Day-view timeline, cover forecast, and booking management" actions={
          <div className="flex gap-2">
            <button onClick={() => setViewMode(v => v === "list" ? "timeline" : "list")} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ borderColor: BORDER, color: MUTED }}>{viewMode === "list" ? "Timeline View" : "List View"}</button>
            <BtnO label="Walk-in" icon={Plus} onClick={() => setShowWalkin(true)} />
            <BtnP label="New Reservation" icon={Plus} onClick={() => setShowNew(true)} />
          </div>
        } />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Tonight's Bookings" value={String(reservations.filter(r=>r.status==="Booked"||r.status==="Seated").length)} sub="Confirmed" icon={CalendarDays} accent={PRIMARY} />
          <StatCard label="Total Covers" value={String(reservations.filter(r=>r.status!=="Cancelled"&&r.status!=="No-show").reduce((s,r)=>s+r.party,0))} sub="Expected diners" icon={Users} accent={TEAL} />
          <StatCard label="No-shows" value={String(reservations.filter(r=>r.status==="No-show").length)} sub="Today" icon={AlertTriangle} accent={ERROR} />
          <StatCard label="VIP Bookings" value={String(reservations.filter(r=>r.vip).length)} sub="Special attention" icon={Star} accent={ORANGE} />
        </div>

        {/* Day toggle */}
        <div className="flex items-center gap-2 mb-4">
          {["Today","Tomorrow","This Week"].map(d => <button key={d} onClick={() => setDayFilter(d)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ backgroundColor: dayFilter===d ? PRIMARY : "white", color: dayFilter===d ? "white" : MUTED, borderColor: dayFilter===d ? PRIMARY : BORDER }}>{d}</button>)}
        </div>

        {viewMode === "timeline" ? (
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Cover Forecast — Today</h3>
            <div className="flex gap-2 items-end" style={{ height: 120 }}>
              {coverForecast.map(c => (
                <div key={c.slot} className="flex-1 flex flex-col items-center gap-1">
                  {c.covers > 0 && <div className="rounded-t" style={{ width: "100%", height: `${(c.covers/maxCovers)*90}px`, backgroundColor: c.covers >= 8 ? ORANGE : c.covers >= 4 ? PRIMARY : TEAL, minHeight: c.covers > 0 ? 16 : 0 }} />}
                  {c.covers === 0 && <div style={{ flex: 1 }} />}
                  <span className="text-xs" style={{ color: MUTED, fontSize: 9 }}>{c.slot}</span>
                  {c.covers > 0 && <span className="text-xs font-bold" style={{ color: TEXT, fontSize: 10 }}>{c.covers}</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {reservations.filter(r=>r.status==="Booked"||r.status==="Seated").map(r => (
                <div key={r.id} onClick={() => setSelectedRes(r.id)} className="border rounded-xl px-3 py-2 cursor-pointer hover:border-blue-300" style={{ borderColor: r.vip ? ORANGE : BORDER }}>
                  <div className="flex items-center justify-between"><span className="text-xs font-mono font-semibold" style={{ color: TEXT, fontFamily: mono }}>{r.time}</span>{r.vip && <span className="text-xs px-1 rounded" style={{ backgroundColor: "#FFF7ED", color: ORANGE }}>VIP</span>}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: TEXT }}>{r.guest}</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>{r.party} covers · {r.table}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Time","Party","Guest","Table","Requests","Status",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} onClick={() => setSelectedRes(r.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selectedRes===r.id ? "#EFF6FF" : undefined }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT, fontFamily: mono }}>{r.time}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{r.party}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {r.vip && <Star size={11} style={{ color: ORANGE }} />}
                        <span className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</span>
                        {r.resId && <span className="text-xs" style={{ color: SUBTLE }}>{r.resId}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge label={r.table} colors={{ bg: "#EFF6FF", text: PRIMARY }} /></td>
                    <td className="px-4 py-3 text-xs max-w-40 truncate" style={{ color: MUTED }}>{r.requests || "—"}</td>
                    <td className="px-4 py-3"><Badge label={r.status} colors={statusColors[r.status] ?? { bg: "#F1F5F9", text: MUTED }} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        {r.status === "Booked" && <><button onClick={() => changeStatus(r.id, "Seated")} className="text-xs px-2 py-1 rounded border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Seat</button><button onClick={() => changeStatus(r.id, "No-show")} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>No-show</button></>}
                        {r.status === "Seated" && <button onClick={() => changeStatus(r.id, "Completed")} className="text-xs px-2 py-1 rounded border font-medium" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Complete</button>}
                        {(r.status === "Booked") && <button onClick={() => changeStatus(r.id, "Cancelled")} className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side panel */}
      {sel && (
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-4"><div><div className="flex items-center gap-1.5">{sel.vip && <Star size={12} style={{ color: ORANGE }} />}<h3 className="text-sm font-bold" style={{ color: TEXT }}>{sel.guest}</h3></div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{sel.id}</div></div><button onClick={() => setSelectedRes(null)} className="text-sm" style={{ color: MUTED }}>✕</button></div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span style={{ color: MUTED }}>Time</span><span className="font-semibold" style={{ fontFamily: mono, color: TEXT }}>{sel.time}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Party size</span><span className="font-bold" style={{ color: PRIMARY }}>{sel.party} covers</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Table</span><span className="font-semibold" style={{ color: TEXT }}>{sel.table}</span></div>
            {sel.phone && <div className="flex justify-between"><span style={{ color: MUTED }}>Phone</span><span style={{ color: TEXT }}>{sel.phone}</span></div>}
            {sel.resId && <div className="flex justify-between"><span style={{ color: MUTED }}>Room Res.</span><span style={{ color: TEAL }}>{sel.resId}</span></div>}
            <div className="flex justify-between items-start"><span style={{ color: MUTED }}>Status</span><Badge label={sel.status} colors={statusColors[sel.status] ?? { bg: "#F1F5F9", text: MUTED }} /></div>
            {sel.requests && <div className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>{sel.requests}</div>}
          </div>
          <div className="mt-4 space-y-2">
            {sel.status === "Booked" && <button onClick={() => changeStatus(sel.id, "Seated")} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Seat Party</button>}
            {sel.status === "Seated" && <button onClick={() => changeStatus(sel.id, "Completed")} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Mark Completed</button>}
            {sel.status === "Booked" && <button onClick={() => { changeStatus(sel.id, "No-show"); setSelectedRes(null); }} className="w-full py-2 rounded-xl text-sm font-semibold border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Mark No-show</button>}
          </div>
        </div>
      )}

      {/* Walk-in modal */}
      {showWalkin && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowWalkin(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Seat Walk-in Party</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Party Size</label><input type="number" min="1" max="20" value={walkinParty} onChange={e=>setWalkinParty(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Available Table</label><select value={walkinTable} onChange={e=>setWalkinTable(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{TABLES_AVL.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowWalkin(false)} /><button onClick={() => { add({ type: "success", title: `Walk-in seated at ${walkinTable}`, body: `${walkinParty} covers` }); setShowWalkin(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Seat Now</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// RT-06 Room Service Orders
export function RoomServiceOrders({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type RSStatus = "Received" | "Preparing" | "Ready" | "En Route" | "Delivered" | "Cancelled";
  const RSO_INIT = [
    { id: "RS-0041", room: "204", guest: "Adaeze Okafor", items: [{ name: "Jollof Rice + Chicken", qty: 1, price: 4500 }, { name: "Chapman", qty: 2, price: 2000 }], ordered: "13:42", promised: "14:05", status: "Preparing" as RSStatus, assigned: "Kelechi O.", folioRef: "FO-2041", inHouse: true, note: "" },
    { id: "RS-0042", room: "311", guest: "Bello Abubakar", items: [{ name: "Grilled Fish (Tilapia)", qty: 1, price: 6800 }, { name: "Bottled Water", qty: 2, price: 500 }], ordered: "13:55", promised: "14:20", status: "Received" as RSStatus, assigned: "", folioRef: "FO-2033", inHouse: true, note: "No pepper please" },
    { id: "RS-0043", room: "507", guest: "Ngozi Dike", items: [{ name: "Chocolate Cake", qty: 2, price: 3500 }, { name: "Zobo", qty: 2, price: 1000 }], ordered: "13:10", promised: "13:30", status: "En Route" as RSStatus, assigned: "Amaka S.", folioRef: "FO-2055", inHouse: true, note: "" },
    { id: "RS-0040", room: "102", guest: "Emeka Nwosu", items: [{ name: "Egusi Soup + Pounded Yam", qty: 1, price: 5200 }], ordered: "11:30", promised: "12:00", status: "Delivered" as RSStatus, assigned: "Kelechi O.", folioRef: "FO-2022", inHouse: true, note: "" },
    { id: "RS-0039", room: "418", guest: "Fatima Ibrahim", items: [{ name: "Garden Salad", qty: 1, price: 2200 }, { name: "Suya", qty: 1, price: 3000 }], ordered: "10:55", promised: "11:20", status: "Delivered" as RSStatus, assigned: "Amaka S.", folioRef: "FO-2031", inHouse: true, note: "" },
  ];

  const stColors: Record<RSStatus, {bg:string;text:string}> = {
    "Received":  { bg: "#F1F5F9", text: "#475569" },
    "Preparing": { bg: "#DBEAFE", text: "#1E40AF" },
    "Ready":     { bg: "#FEF9C3", text: "#854D0E" },
    "En Route":  { bg: "#FEF3C7", text: "#92400E" },
    "Delivered": { bg: "#DCFCE7", text: "#166534" },
    "Cancelled": { bg: "#FEE2E2", text: "#991B1B" },
  };
  const nextStatus: Partial<Record<RSStatus,RSStatus>> = { Received: "Preparing", Preparing: "Ready", Ready: "En Route", "En Route": "Delivered" };
  const nextLabel: Partial<Record<RSStatus,string>> = { Received: "Start Preparing", Preparing: "Mark Ready", Ready: "Assign Runner", "En Route": "Confirm Delivered" };

  const RUNNERS = ["Kelechi O.", "Amaka S.", "Tunde B.", "Blessing A."];

  const [orders, setOrders] = useState(RSO_INIT);
  const [selected, setSelected] = useState<string|null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignRunner, setAssignRunner] = useState(RUNNERS[0]);
  const [statusFilter, setStatusFilter] = useState<RSStatus|"All">("All");

  const advance = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const ns = nextStatus[o.status];
      if (!ns) return o;
      if (o.status === "Ready") { setShowAssign(true); setSelected(id); return o; }
      return { ...o, status: ns };
    }));
    const o = orders.find(x=>x.id===id);
    if (o && o.status !== "Ready") add({ type: "success", title: `${id} → ${nextStatus[o.status]}` });
  };

  const confirmAssign = () => {
    if (!selected) return;
    setOrders(prev => prev.map(o => o.id === selected ? { ...o, status: "En Route", assigned: assignRunner } : o));
    add({ type: "success", title: `${selected} assigned to ${assignRunner} — En Route` });
    setShowAssign(false);
  };

  const filtered = statusFilter === "All" ? orders : orders.filter(o=>o.status===statusFilter);
  const sel = orders.find(o=>o.id===selected);

  const stats = {
    active: orders.filter(o=>!["Delivered","Cancelled"].includes(o.status)).length,
    preparing: orders.filter(o=>o.status==="Preparing").length,
    delivered: orders.filter(o=>o.status==="Delivered").length,
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Room Service Orders" sub="Order board: Received → Preparing → Ready → En Route → Delivered" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Active Orders" value={String(stats.active)} sub="In progress" icon={ClipboardList} accent={ORANGE} />
          <StatCard label="In Kitchen" value={String(stats.preparing)} sub="Being prepared" icon={UtensilsCrossed} accent={PRIMARY} />
          <StatCard label="Delivered Today" value={String(stats.delivered)} sub="Completed" icon={CheckCircle2} accent={SUCCESS} />
          <StatCard label="Avg Delivery Time" value="22 min" sub="Ordered to door" icon={Clock} accent={TEAL} />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["All","Received","Preparing","Ready","En Route","Delivered"] as (RSStatus|"All")[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="text-xs px-3 py-1.5 rounded-xl border font-medium" style={{ backgroundColor: statusFilter===s ? PRIMARY : "white", color: statusFilter===s ? "white" : MUTED, borderColor: statusFilter===s ? PRIMARY : BORDER }}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Order","Room / Guest","Items","Ordered","Promised","Status","Runner","Folio",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o => {
                const total = o.items.reduce((s,i)=>s+i.price*i.qty,0);
                const overdue = o.status !== "Delivered" && o.status !== "Cancelled";
                return (
                  <tr key={o.id} onClick={() => setSelected(o.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selected===o.id ? "#EFF6FF" : undefined }}>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{o.id}</td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-bold" style={{ color: PRIMARY }}>{o.room}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{o.guest}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs" style={{ color: TEXT }}>{o.items.map(i=>`${i.name}${i.qty>1?" ×"+i.qty:""}`).join(", ")}</div>
                      <div className="text-xs font-semibold mt-0.5" style={{ color: PRIMARY, fontFamily: mono }}>₦{total.toLocaleString()}</div>
                    </td>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{o.ordered}</td>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: overdue ? ORANGE : MUTED, fontFamily: mono }}>{o.promised}</td>
                    <td className="px-3 py-3"><Badge label={o.status} colors={stColors[o.status]} /></td>
                    <td className="px-3 py-3 text-xs" style={{ color: o.assigned ? TEXT : SUBTLE }}>{o.assigned || "—"}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{o.folioRef}</td>
                    <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                      {nextLabel[o.status] && <button onClick={() => advance(o.id)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold whitespace-nowrap" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>{nextLabel[o.status]}</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-4"><div><div className="text-sm font-bold" style={{ color: TEXT }}>Room {sel.room} — {sel.guest}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{sel.id}</div></div><button onClick={() => setSelected(null)} style={{ color: MUTED }}>✕</button></div>
          <div className="space-y-2 mb-4">
            {sel.items.map((item,i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span style={{ color: TEXT }}>{item.qty > 1 ? `${item.name} ×${item.qty}` : item.name}</span>
                <span className="font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>₦{(item.price*item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold text-sm" style={{ borderColor: BORDER }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: PRIMARY, fontFamily: mono }}>₦{sel.items.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: MUTED }}>Ordered</span><span style={{ fontFamily: mono, color: TEXT }}>{sel.ordered}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Promised</span><span style={{ fontFamily: mono, color: ORANGE }}>{sel.promised}</span></div>
            <div className="flex justify-between items-center"><span style={{ color: MUTED }}>Status</span><Badge label={sel.status} colors={stColors[sel.status]} /></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Runner</span><span style={{ color: TEXT }}>{sel.assigned || "Unassigned"}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Folio</span><span style={{ color: TEAL, fontFamily: mono }}>{sel.folioRef}</span></div>
          </div>
          {sel.note && <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>{sel.note}</div>}
          <div className="mt-4">
            {nextLabel[sel.status] && <button onClick={() => { advance(sel.id); }} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>{nextLabel[sel.status]}</button>}
          </div>
        </div>
      )}

      {/* Assign runner modal */}
      {showAssign && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowAssign(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Assign Delivery Runner</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Runner</label>
            <select value={assignRunner} onChange={e=>setAssignRunner(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{RUNNERS.map(r=><option key={r}>{r}</option>)}</select></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowAssign(false)} /><button onClick={confirmAssign} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Assign & Dispatch</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// CO-03 Announcements
export function Announcements({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type Priority = "Normal"|"High"|"Urgent";
  type AudienceKey = "All Staff"|"Front Desk"|"Housekeeping"|"Maintenance"|"Finance"|"F&B"|"Security"|"Management";
  const ANNOUNCEMENTS = [
    { id:"ANN-001", title:"Night Audit Time Change", body:"Starting tomorrow, night audit will run at 23:30 instead of 00:00. All POS shifts must be closed by 23:15.", by:"Fatima Ibrahim", audience:"All Staff" as AudienceKey, priority:"Urgent" as Priority, from:"14 Oct", expires:"20 Oct", read:42, total:47, ackRequired:true, active:true },
    { id:"ANN-002", title:"VIP Guest Protocol Reminder", body:"Dr. Chukwuemeka Bello (Suite 501) checks in this evening. All staff to review VIP handling procedures. Do not disturb unless requested.", by:"Grace Mensah", audience:"Front Desk" as AudienceKey, priority:"High" as Priority, from:"14 Oct", expires:"15 Oct", read:8, total:12, ackRequired:true, active:true },
    { id:"ANN-003", title:"Housekeeping Staffing Update", body:"Chidi Okeke is on approved leave today. Rooms may run 30 minutes behind schedule. Please inform guests of any delays proactively.", by:"Kemi Adeyemi", audience:"Housekeeping" as AudienceKey, priority:"Normal" as Priority, from:"14 Oct", expires:"14 Oct", read:9, total:9, ackRequired:false, active:true },
    { id:"ANN-004", title:"Monthly Generator Maintenance", body:"Generator maintenance scheduled for Saturday 19 Oct between 08:00 and 10:00. Grid power will be primary. Inform guests if they inquire.", by:"Chukwuemeka Obi", audience:"All Staff" as AudienceKey, priority:"Normal" as Priority, from:"12 Oct", expires:"19 Oct", read:35, total:47, ackRequired:false, active:true },
    { id:"ANN-005", title:"Q4 Performance Review Schedule", body:"Q4 performance reviews begin 01 November. Line managers will receive individual schedules by 25 October. Prepare your notes.", by:"HR Team", audience:"Management" as AudienceKey, priority:"Normal" as Priority, from:"10 Oct", expires:"25 Oct", read:5, total:5, ackRequired:false, active:false },
  ];
  const AUDIENCE_OPTIONS: AudienceKey[] = ["All Staff","Front Desk","Housekeeping","Maintenance","Finance","F&B","Security","Management"];
  const PRIORITY_COLORS: Record<Priority,{bg:string;text:string}> = {
    Normal:  { bg:"#F1F5F9", text:"#475569" },
    High:    { bg:"#FEF3C7", text:"#92400E" },
    Urgent:  { bg:"#FEE2E2", text:"#991B1B" },
  };

  const [showNew, setShowNew]     = useState(false);
  const [viewAck, setViewAck]     = useState<typeof ANNOUNCEMENTS[number]|null>(null);
  const [filterA, setFilterA]     = useState<"All"|"Active"|"Draft">("All");
  const [newAnn, setNewAnn]       = useState({ title:"", body:"", audience:"All Staff" as AudienceKey, priority:"Normal" as Priority, ackRequired:false, expires:"" });

  const filtered = ANNOUNCEMENTS.filter(a => filterA==="All" || (filterA==="Active"&&a.active) || (filterA==="Draft"&&!a.active));

  // Reusable read-progress bar
  const ReadBar = ({ read, total }: { read:number; total:number }) => (
    <div>
      <div className="text-xs font-semibold mb-0.5" style={{ color:read===total?SUCCESS:WARNING }}>{read}/{total} read</div>
      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
        <div className="h-full rounded-full" style={{ width:`${Math.round((read/total)*100)}%`, backgroundColor:read===total?SUCCESS:WARNING }} />
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Announcements" sub="Broadcast messages to staff by department, role, or branch"
        actions={<BtnP label="New Announcement" icon={Plus} onClick={()=>setShowNew(true)} />}
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Active"   value={String(ANNOUNCEMENTS.filter(a=>a.active).length)}  sub="Visible to staff"       icon={Bell}     accent={PRIMARY} />
        <StatCard label="Unacked"  value={String(ANNOUNCEMENTS.filter(a=>a.ackRequired&&a.read<a.total).length)} sub="Require acknowledgement" icon={AlertCircle} accent={WARNING} />
        <StatCard label="Drafts"   value={String(ANNOUNCEMENTS.filter(a=>!a.active).length)} sub="Pending publish"        icon={FileText}  accent={MUTED}   />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b mb-4" style={{ borderColor:BORDER }}>
        {(["All","Active","Draft"] as const).map(f=>(
          <button key={f} onClick={()=>setFilterA(f)} className="px-4 py-2.5 text-sm font-medium" style={{ color:filterA===f?PRIMARY:MUTED, borderBottom:`2px solid ${filterA===f?PRIMARY:"transparent"}` }}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(a=>(
          <div key={a.id} className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color:TEXT }}>{a.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:PRIORITY_COLORS[a.priority].bg, color:PRIORITY_COLORS[a.priority].text }}>{a.priority}</span>
                  {a.ackRequired && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#EFF6FF", color:PRIMARY }}>Ack. Required</span>}
                  {!a.active && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Draft</span>}
                </div>
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color:MUTED }}>
                  <span>By {a.by}</span>
                  <span>Audience: <strong style={{ color:TEXT }}>{a.audience}</strong></span>
                  <span>From {a.from}</span>
                  <span>Expires {a.expires}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color:MUTED }}>{a.body}</p>
              </div>
              <div className="text-right shrink-0">
                <ReadBar read={a.read} total={a.total} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor:"#F4F4F5" }}>
              <div className="flex gap-2">
                <button onClick={()=>add({type:"info",title:`Editing ${a.id}`})} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color:MUTED, borderColor:BORDER }}>Edit</button>
                <button onClick={()=>setViewAck(a)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color:PRIMARY, borderColor:`${PRIMARY}30` }}>View Acknowledgements</button>
                <button onClick={()=>add({type:"warning",title:`${a.id} archived`})} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color:ERROR, borderColor:`${ERROR}20` }}>Archive</button>
              </div>
              {!a.active && <button onClick={()=>add({type:"success",title:`${a.id} published`})} className="text-xs px-3 py-1.5 rounded-xl text-white font-semibold" style={{ backgroundColor:PRIMARY }}>Publish Now</button>}
            </div>
          </div>
        ))}
      </div>

      {/* New Announcement modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.45)" }} onClick={()=>setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-[520px]" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-4" style={{ color:TEXT }}>New Announcement</h3>
            <div className="space-y-3">
              <Inp label="Title" value={newAnn.title} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setNewAnn(n=>({...n,title:e.target.value}))} placeholder="Announcement title…" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Target Audience</label>
                  <select value={newAnn.audience} onChange={e=>setNewAnn(n=>({...n,audience:e.target.value as AudienceKey}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                    {AUDIENCE_OPTIONS.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Priority</label>
                  <select value={newAnn.priority} onChange={e=>setNewAnn(n=>({...n,priority:e.target.value as Priority}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                    {(["Normal","High","Urgent"] as Priority[]).map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Message</label>
                <textarea value={newAnn.body} onChange={e=>setNewAnn(n=>({...n,body:e.target.value}))} rows={4} placeholder="Write your announcement…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor:BORDER, color:TEXT }} />
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Expires</label>
                  <input type="date" value={newAnn.expires} onChange={e=>setNewAnn(n=>({...n,expires:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} />
                </div>
                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                  <input type="checkbox" checked={newAnn.ackRequired} onChange={e=>setNewAnn(n=>({...n,ackRequired:e.target.checked}))} className="w-4 h-4 rounded" />
                  <span className="text-sm" style={{ color:TEXT }}>Require acknowledgement</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Save Draft" onClick={()=>{ add({type:"info",title:"Saved as draft"}); setShowNew(false); }} />
              <button onClick={()=>{ add({type:"success",title:"Announcement posted"}); setShowNew(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:PRIMARY }}>Publish Now</button>
            </div>
          </div>
        </>
      )}

      {/* Acknowledgement tracking modal */}
      {viewAck && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.45)" }} onClick={()=>setViewAck(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-[480px] max-h-[70vh] overflow-y-auto" style={{ border:`1px solid ${BORDER}` }}>
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-sm font-bold" style={{ color:TEXT }}>{viewAck.title}</h3><div className="text-xs" style={{ color:MUTED }}>Acknowledgement tracking — {viewAck.audience}</div></div>
              <button onClick={()=>setViewAck(null)}><X size={16} style={{ color:SUBTLE }} /></button>
            </div>
            <div className="mb-3"><ReadBar read={viewAck.read} total={viewAck.total} /></div>
            <div className="space-y-1.5">
              {Array.from({length:viewAck.total},(_,i)=>(
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>S{i+1}</div>
                    <span className="text-xs font-medium" style={{ color:TEXT }}>Staff Member {i+1}</span>
                  </div>
                  {i < viewAck.read
                    ? <span className="flex items-center gap-1 text-xs" style={{ color:SUCCESS }}><CheckCircle2 size={12} />Acknowledged</span>
                    : <span className="text-xs" style={{ color:SUBTLE }}>Pending</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// HR-02 Staff Profile Detail
export function StaffProfileDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const STAFF_PROFILE = {
    id:"EMP-001", name:"John Abubakar", gender:"M" as const, role:"Front Desk Officer", dept:"Front Desk",
    phone:"0803-001-1001", email:"j.abubakar@grandpalms.ng", empType:"Full-time",
    hireDate:"03 Jan 2022", shift:"Morning 07:00–15:00", status:"Active",
    reportingTo:"Fatima Ibrahim (Reservations Manager)",
    contractEnd:"31 Dec 2025", salaryBand:"Band 3 — FD Officer", baseSalary:350000,
    nokName:"Mrs. Rabi Abubakar", nokPhone:"+234 807 123 4567", nokRelation:"Spouse",
    bankName:"GTBank", bankAcct:"•••• •••• 4421",
  };

  const ATTEND_LOG = [
    { date:"14 Oct", in:"07:03", out:"15:07", hours:8.1, late:3,  ot:0,   status:"Present" },
    { date:"13 Oct", in:"06:55", out:"15:00", hours:8.1, late:0,  ot:0,   status:"Present" },
    { date:"12 Oct", in:"07:15", out:"15:05", hours:7.8, late:15, ot:0,   status:"Late"    },
    { date:"11 Oct", in:"07:00", out:"18:00", hours:11,  late:0,  ot:3,   status:"Present" },
    { date:"10 Oct", in:"",      out:"",      hours:0,   late:0,  ot:0,   status:"Absent"  },
  ];

  const DOCS = [
    { name:"National ID (NIN)", type:"ID",          expiry:"N/A",      status:"Verified" },
    { name:"Employment Contract",type:"Contract",   expiry:"31 Dec 2025",status:"Active" },
    { name:"Hospitality Cert.", type:"Certificate", expiry:"Jan 2027",  status:"Valid"   },
    { name:"Medical Certificate",type:"Medical",    expiry:"Jan 2026",  status:"Valid"   },
  ];

  const LEAVE_BALANCES = [
    { type:"Annual Leave",    total:21, used:8,  remaining:13 },
    { type:"Sick Leave",      total:10, used:1,  remaining:9  },
    { type:"Compassionate",   total:5,  used:0,  remaining:5  },
    { type:"Study Leave",     total:5,  used:0,  remaining:5  },
  ];

  const PERFORMANCE = [
    { period:"Q3 2025", score:4.2, reviewer:"F. Ibrahim", notes:"Excellent guest handling, needs improvement in upselling." },
    { period:"Q2 2025", score:3.8, reviewer:"F. Ibrahim", notes:"Meets expectations. Punctuality improved significantly." },
    { period:"Q1 2025", score:3.5, reviewer:"F. Ibrahim", notes:"Good attitude. Some lateness in early months addressed." },
  ];

  const TABS = ["Overview","Employment","Documents","Attendance","Leave","Performance","Access"];
  const [tab, setTab]       = useState("Overview");
  const [showSalary, setShowSalary] = useState(false);
  const [salPin, setSalPin] = useState("");
  const [salRevealed, setSalRevealed] = useState(false);

  const revealSalary = () => {
    if (salPin !== "1234") { add({ type:"error", title:"Invalid PIN" }); return; }
    setSalRevealed(true); setShowSalary(false); setSalPin("");
  };

  return (
    <div>
      <PageHeader title={`Staff Profile — ${STAFF_PROFILE.name}`} sub={`${STAFF_PROFILE.id} · ${STAFF_PROFILE.role} · ${STAFF_PROFILE.dept}`}
        actions={
          <div className="flex gap-2">
            <BtnO label="Reset Password" icon={KeyRound} onClick={() => add({ type:"info", title:"Password reset sent" })} />
            <BtnP label="Edit Profile" icon={Edit3} onClick={() => add({ type:"info", title:"Edit staff profile" })} />
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5 text-center" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
            <div className="mx-auto mb-3 w-fit"><Av gender={STAFF_PROFILE.gender} size={64} /></div>
            <div className="text-sm font-bold mb-0.5" style={{ color: TEXT }}>{STAFF_PROFILE.name}</div>
            <div className="text-xs mb-2" style={{ color: MUTED }}>{STAFF_PROFILE.role}</div>
            <Badge label={STAFF_PROFILE.status} colors={{ bg:"#DCFCE7", text:"#166534" }} />
            <div className="space-y-2 text-xs mt-4 text-left border-t pt-3" style={{ borderColor: BORDER }}>
              {[["ID",STAFF_PROFILE.id],["Dept",STAFF_PROFILE.dept],["Type",STAFF_PROFILE.empType],["Shift",STAFF_PROFILE.shift]].map(([k,v])=>(
                <div key={k}><span style={{ color: MUTED }}>{k}: </span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex border-b overflow-x-auto" style={{ borderColor: BORDER }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color:tab===t?PRIMARY:MUTED, borderBottom:`2px solid ${tab===t?PRIMARY:"transparent"}` }}>{t}</button>
            ))}
          </div>
          <div className="p-5">
            {tab==="Overview" && (
              <div className="grid grid-cols-2 gap-3">
                {([["Full Name",STAFF_PROFILE.name],["Email",STAFF_PROFILE.email],["Phone",STAFF_PROFILE.phone],["Hire Date",STAFF_PROFILE.hireDate],["Shift",STAFF_PROFILE.shift],["Employment Type",STAFF_PROFILE.empType],["Next of Kin",STAFF_PROFILE.nokName],["NOK Phone",STAFF_PROFILE.nokPhone],["NOK Relation",STAFF_PROFILE.nokRelation]] as [string,string][]).map(([k,v])=>(
                  <div key={k}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                ))}
              </div>
            )}
            {tab==="Employment" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {([["Role",STAFF_PROFILE.role],["Department",STAFF_PROFILE.dept],["Reporting To",STAFF_PROFILE.reportingTo],["Contract End",STAFF_PROFILE.contractEnd],["Salary Band",STAFF_PROFILE.salaryBand],["Bank",STAFF_PROFILE.bankName+" — "+STAFF_PROFILE.bankAcct]] as [string,string][]).map(([k,v])=>(
                    <div key={k}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                  ))}
                </div>
                <div className="px-4 py-3 rounded-xl border mt-2" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center justify-between">
                    <div><div className="text-xs" style={{ color: MUTED }}>Base Salary</div><div className="text-sm font-bold mt-0.5" style={{ color: TEXT }}>{salRevealed?`₦${STAFF_PROFILE.baseSalary.toLocaleString()}`:"₦ ••• ••• (PIN protected)"}</div></div>
                    {!salRevealed && <button onClick={()=>setShowSalary(true)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Reveal</button>}
                    {salRevealed && <button onClick={()=>setSalRevealed(false)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ color: MUTED, borderColor: BORDER }}>Hide</button>}
                  </div>
                </div>
              </div>
            )}
            {tab==="Documents" && (
              <div className="space-y-2">
                {DOCS.map(d=>(
                  <div key={d.name} className="flex items-center justify-between px-3 py-2.5 rounded-xl border" style={{ borderColor: BORDER }}>
                    <div><div className="text-sm font-medium" style={{ color: TEXT }}>{d.name}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{d.type} · Expiry: {d.expiry}</div></div>
                    <div className="flex items-center gap-2">
                      <Badge label={d.status} colors={{ bg:d.status==="Verified"||d.status==="Valid"||d.status==="Active"?"#DCFCE7":"#FEE2E2", text:d.status==="Verified"||d.status==="Valid"||d.status==="Active"?"#166534":"#991B1B" }} />
                      <button onClick={()=>add({type:"info",title:`Download ${d.name}`})} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Download</button>
                    </div>
                  </div>
                ))}
                <button onClick={()=>add({type:"info",title:"Upload document"})} className="w-full py-2.5 rounded-xl border border-dashed text-xs font-semibold" style={{ color: TEAL, borderColor: TEAL }}>+ Upload Document</button>
              </div>
            )}
            {tab==="Attendance" && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="px-3 py-2.5 rounded-xl text-center" style={{ backgroundColor:"#F0FDF4" }}><div className="text-xs" style={{ color: MUTED }}>Attendance Rate</div><div className="text-lg font-bold" style={{ color: SUCCESS }}>95.7%</div></div>
                  <div className="px-3 py-2.5 rounded-xl text-center" style={{ backgroundColor:"#FEF3C7" }}><div className="text-xs" style={{ color: MUTED }}>Late Arrivals</div><div className="text-lg font-bold" style={{ color: WARNING }}>2</div></div>
                  <div className="px-3 py-2.5 rounded-xl text-center" style={{ backgroundColor:"#FEE2E2" }}><div className="text-xs" style={{ color: MUTED }}>Absences</div><div className="text-lg font-bold" style={{ color: ERROR }}>1</div></div>
                </div>
                <table className="w-full">
                  <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Date","Clock In","Clock Out","Hours","Late","OT","Status"].map((h,i)=><th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {ATTEND_LOG.map((a,i)=>(
                      <tr key={i} className="border-t" style={{ borderColor: BORDER }}>
                        <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{a.date}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: TEXT, fontFamily: mono }}>{a.in||"—"}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: TEXT, fontFamily: mono }}>{a.out||"—"}</td>
                        <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: a.hours>0?TEXT:SUBTLE, fontFamily: mono }}>{a.hours>0?`${a.hours}h`:"—"}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: a.late>0?WARNING:SUBTLE }}>{a.late>0?`${a.late}min`:"—"}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: a.ot>0?TEAL:SUBTLE }}>{a.ot>0?`+${a.ot}h`:"—"}</td>
                        <td className="px-3 py-2.5"><Badge label={a.status} colors={{ bg:a.status==="Present"?"#DCFCE7":a.status==="Late"?"#FEF3C7":"#FEE2E2", text:a.status==="Present"?"#166534":a.status==="Late"?"#92400E":"#991B1B" }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab==="Leave" && (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {LEAVE_BALANCES.map(lb=>(
                    <div key={lb.type} className="px-3 py-3 rounded-xl border" style={{ borderColor: BORDER }}>
                      <div className="text-xs mb-1" style={{ color: MUTED }}>{lb.type}</div>
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="text-xl font-bold" style={{ color: PRIMARY }}>{lb.remaining}</div>
                        <div className="text-xs" style={{ color: SUBTLE }}>of {lb.total} remaining</div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
                        <div className="h-full rounded-full" style={{ width:`${Math.round((lb.remaining/lb.total)*100)}%`, backgroundColor: lb.remaining>0?TEAL:ERROR }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Leave History</div>
                {[{ type:"Annual", from:"01 Sep", to:"05 Sep", days:5, status:"Completed" },{ type:"Sick", from:"22 Jul", to:"22 Jul", days:1, status:"Completed" }].map((l,i)=>(
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl border mb-2" style={{ borderColor: BORDER }}>
                    <div><div className="text-xs font-medium" style={{ color: TEXT }}>{l.type} Leave · {l.days} days</div><div className="text-xs" style={{ color: MUTED }}>{l.from} – {l.to}</div></div>
                    <Badge label={l.status} colors={{ bg:"#DCFCE7", text:"#166534" }} />
                  </div>
                ))}
              </div>
            )}
            {tab==="Performance" && (
              <div className="space-y-3">
                {PERFORMANCE.map((p,i)=>(
                  <div key={i} className="px-4 py-3 rounded-xl border" style={{ borderColor: BORDER }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold" style={{ color: TEXT }}>{p.period}</div>
                      <div className="flex items-center gap-1"><span className="text-base font-bold" style={{ color: p.score>=4?SUCCESS:p.score>=3?WARNING:ERROR }}>{p.score}</span><span className="text-xs" style={{ color: SUBTLE }}>/5</span></div>
                    </div>
                    <div className="text-xs mb-1" style={{ color: MUTED }}>Reviewer: {p.reviewer}</div>
                    <div className="text-xs italic" style={{ color: TEXT }}>{p.notes}</div>
                  </div>
                ))}
                <button onClick={()=>add({type:"info",title:"Add performance note"})} className="w-full py-2.5 rounded-xl border border-dashed text-xs font-semibold" style={{ color: PRIMARY, borderColor: PRIMARY }}>+ Add Note</button>
              </div>
            )}
            {tab==="Access" && (
              <div className="space-y-3">
                {([["System Role","Front Desk (FD)"],["Permissions","Dashboard, Reservations, Front Desk, Guest Messaging, Internal Chat"],["MFA Enabled","Yes — SMS"],["Last Login","14 Oct 2025, 07:01"],["Login Device","iPad · EMP-iPad-003"],["Failed Attempts (30d)","0"]] as [string,string][]).map(([k,v])=>(
                  <div key={k} className="flex justify-between text-sm border-b py-2" style={{ borderColor: BORDER }}>
                    <span style={{ color: MUTED }}>{k}</span><span className="font-medium text-right" style={{ color: TEXT }}>{v}</span>
                  </div>
                ))}
                <button onClick={()=>add({type:"warning",title:"Session revoked — EMP-001"})} className="text-xs px-3 py-2 rounded-xl border font-semibold" style={{ color: ERROR, borderColor:`${ERROR}30` }}>Revoke All Sessions</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSalary && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowSalary(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-72" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-1" style={{ color: TEXT }}>Manager PIN Required</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Salary details are permission-gated.</p>
            <input type="password" maxLength={4} value={salPin} onChange={e=>setSalPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest mb-4" style={{ borderColor: BORDER, fontFamily: mono }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>setShowSalary(false)} />
              <button onClick={revealSalary} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Reveal</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// HR-06 Payroll Summary
export function PayrollSummary({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const total = PAYROLL_DATA.reduce((s, p) => s + p.net, 0);
  return (
    <div>
      <PageHeader title="Payroll Summary" sub="June 2025 · Grand Palms Abuja Branch" actions={<><BtnO label="Export for Payroll" icon={Download} /><BtnP label="Process Payroll" icon={DollarSign} onClick={() => add({ type: "success", title: "Payroll submitted for processing" })} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Total Gross Pay" value={`₦${PAYROLL_DATA.reduce((s,p)=>s+p.baseSalary+p.overtime,0).toLocaleString()}`} sub="This pay period" icon={DollarSign} accent={PRIMARY} /><StatCard label="Total Deductions" value={`₦${PAYROLL_DATA.reduce((s,p)=>s+p.deductions,0).toLocaleString()}`} sub="Tax + pension + misc" icon={TrendingDown} accent={ERROR} /><StatCard label="Net Payroll" value={fmtN(total)} sub="To be disbursed" icon={CheckCircle2} accent={SUCCESS} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Staff Member", "Department", "Base Salary", "Overtime", "Deductions", "Net Pay", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{PAYROLL_DATA.map(p => <tr key={p.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}14` }}><User size={13} style={{ color: PRIMARY }} /></div><span className="text-sm font-medium" style={{ color: TEXT }}>{p.name}</span></div></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.dept}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>₦{p.baseSalary.toLocaleString()}</td><td className="px-5 py-3 text-sm" style={{ color: p.overtime > 0 ? TEAL : MUTED }}>{p.overtime > 0 ? `+₦${p.overtime.toLocaleString()}` : "—"}</td><td className="px-5 py-3 text-sm" style={{ color: ERROR }}>−₦{p.deductions.toLocaleString()}</td><td className="px-5 py-3 text-sm font-bold" style={{ color: SUCCESS }}>₦{p.net.toLocaleString()}</td><td className="px-5 py-3"><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Breakdown</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// MB-02 Branch Comparison
// BranchComparison → MultibranchSettingsScreens.tsx
export { BranchComparison } from "./MultibranchSettingsScreens";


export function GroupBookings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  // ── Constants ──────────────────────────────────────────────────────────────
  const PASS_BG     = "#F9FAFB";
  const PASS_BORDER = "#E2E8F0";
  const PASS_MUTED  = "#64748B";
  const PASS_DASH   = "#CBD5E1";

  const RATE_PLANS      = ["Group Rate", "Corporate Rate", "Negotiated", "Full Package"];
  const STATUS_PIPELINE = ["Tentative", "Contracted", "Confirmed", "Active", "Departed"];

  // ── State ──────────────────────────────────────────────────────────────────
  const [groupTypes,   setGroupTypes]   = useState(["Corporate", "Wedding", "Conference", "Government", "Tour Group", "Other"]);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [detailTab,    setDetailTab]    = useState<"overview"|"rooming"|"folio"|"contract">("overview");
  const [showCreate,   setShowCreate]   = useState(false);
  const [filterType,   setFilterType]   = useState("All");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [assignSlot,   setAssignSlot]   = useState<number | null>(null);
  const [assignName,   setAssignName]   = useState("");
  const [editingFolio, setEditingFolio] = useState(false);
  const [newCharge,    setNewCharge]    = useState({ description: "", amount: "" });
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [newTypeName,     setNewTypeName]     = useState("");
  const [paymentInput,    setPaymentInput]    = useState({ show: false, amount: "", groupId: "" });
  const [editingGroup,  setEditingGroup]  = useState<string | null>(null);
  const [editForm,      setEditForm]      = useState<Record<string, any>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "Corporate", organizer: "", phone: "", email: "",
    checkin: "2026-09-10", checkout: "2026-09-12",
    standardRooms: 4, deluxeRooms: 4, suiteRooms: 2,
    ratePlan: "Group Rate", cutoffDate: "2026-09-05", notes: "",
  });
  const upd = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  // ── Types & Mock Data ──────────────────────────────────────────────────────
  type RoomingGuest = { id: number; name: string; room: string; type: string; status: "Checked In" | "Assigned" | "Pending" };
  type FolioLine    = { id: number; description: string; amount: number; date: string; category: "room"|"fnb"|"extra"|"payment" };
  type Group = {
    id: string; name: string; type: string; organizer: string; phone: string; email: string;
    checkin: string; checkout: string; nights: number;
    rooms: { Standard: number; Deluxe: number; Suite: number };
    ratePlan: string; cutoffDate: string; notes: string; cancelPolicy?: string;
    depositPct: number; depositPaid: number; estValue: number;
    status: string; contractSent: boolean; contractSigned: boolean;
    rooming: RoomingGuest[]; folio: FolioLine[];
  };

  const [groups, setGroups] = useState<Group[]>([
    {
      id: "GRP-001", name: "Dangote Group Executive Retreat", type: "Corporate",
      organizer: "Mrs. Toyin Ahmed", phone: "+234 802 000 0001", email: "toyin@dangote.com",
      checkin: "2026-08-04", checkout: "2026-08-06", nights: 2,
      rooms: { Standard: 4, Deluxe: 6, Suite: 2 }, ratePlan: "Corporate Rate", cutoffDate: "2026-08-01", notes: "VIP group — priority handling for all requests.",
      depositPct: 30, depositPaid: 756000, estValue: 2520000,
      status: "Confirmed", contractSent: true, contractSigned: true,
      rooming: [
        { id: 1, name: "Alhaji A. Dangote",  room: "Suite 501",  type: "Suite",  status: "Checked In" },
        { id: 2, name: "Mrs. Toyin Ahmed",   room: "Suite 502",  type: "Suite",  status: "Assigned"   },
        { id: 3, name: "Emeka Obi",          room: "Deluxe 301", type: "Deluxe", status: "Assigned"   },
        { id: 4, name: "Kemi Afolabi",       room: "Deluxe 302", type: "Deluxe", status: "Assigned"   },
        { id: 5, name: "Bode Adewale",       room: "Deluxe 303", type: "Deluxe", status: "Pending"    },
      ],
      folio: [
        { id: 1, description: "Room charges — 12 rooms × 2 nights", amount: 2520000, date: "2026-08-06", category: "room"    },
        { id: 2, description: "Conference hall hire",                amount: 150000,  date: "2026-08-04", category: "extra"   },
        { id: 3, description: "Airport transfer × 4",               amount: 80000,   date: "2026-08-04", category: "extra"   },
        { id: 4, description: "Deposit received",                    amount: -756000, date: "2026-07-15", category: "payment" },
      ],
    },
    {
      id: "GRP-002", name: "Adeyemi Wedding Party", type: "Wedding",
      organizer: "Mr. Bolu Adeyemi", phone: "+234 803 555 2233", email: "bolu@adeyemi.ng",
      checkin: "2026-08-10", checkout: "2026-08-12", nights: 2,
      rooms: { Standard: 4, Deluxe: 3, Suite: 1 }, ratePlan: "Group Rate", cutoffDate: "2026-08-05", notes: "Bridal suite must be ready by 14:00 check-in.",
      depositPct: 50, depositPaid: 460000, estValue: 920000,
      status: "Confirmed", contractSent: false, contractSigned: false,
      rooming: [
        { id: 1, name: "Mr. Bolu Adeyemi",   room: "Suite 501",  type: "Suite",  status: "Assigned" },
        { id: 2, name: "Mrs. Ngozi Adeyemi", room: "Deluxe 301", type: "Deluxe", status: "Assigned" },
        { id: 3, name: "Tunde Bakare",       room: "Deluxe 302", type: "Deluxe", status: "Pending"  },
      ],
      folio: [
        { id: 1, description: "Room charges — 8 rooms × 2 nights", amount: 920000,  date: "2026-08-12", category: "room"    },
        { id: 2, description: "Wedding setup & décor",              amount: 75000,   date: "2026-08-10", category: "extra"   },
        { id: 3, description: "Welcome cocktail reception",         amount: 45000,   date: "2026-08-10", category: "fnb"     },
        { id: 4, description: "Deposit received",                   amount: -460000, date: "2026-07-20", category: "payment" },
      ],
    },
    {
      id: "GRP-003", name: "CBN Policy Summit Delegation", type: "Government",
      organizer: "Alhaji M. Sanusi", phone: "+234 809 100 4400", email: "msanusi@cbn.gov.ng",
      checkin: "2026-08-20", checkout: "2026-08-22", nights: 2,
      rooms: { Standard: 6, Deluxe: 4, Suite: 2 }, ratePlan: "Negotiated", cutoffDate: "2026-08-15", notes: "",
      depositPct: 25, depositPaid: 0, estValue: 1730000,
      status: "Tentative", contractSent: false, contractSigned: false,
      rooming: [],
      folio: [
        { id: 1, description: "Room charges — 12 rooms × 2 nights", amount: 1730000, date: "2026-08-22", category: "room" },
      ],
    },
  ]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const PassNotch = () => (
    <div className="flex items-center" style={{ marginLeft: -1, marginRight: -1 }}>
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: `1.5px solid ${PASS_BORDER}`, marginLeft: -8 }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: PASS_DASH }} />
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#EFF6FF", border: `1.5px solid ${PASS_BORDER}`, marginRight: -8 }} />
    </div>
  );

  const totalBlocked = (g: Group) => g.rooms.Standard + g.rooms.Deluxe + g.rooms.Suite;
  const pickupPct    = (g: Group) => totalBlocked(g) === 0 ? 0 : Math.round((g.rooming.length / totalBlocked(g)) * 100);
  const cutoffDays   = (g: Group) => Math.round((new Date(g.cutoffDate).getTime() - Date.now()) / 86400000);
  const statusStage  = (g: Group) => {
    if (g.status === "Departed")    return 4;
    if (g.status === "Active")      return 3;
    if (g.status === "Confirmed")   return 2;
    if (g.status === "Contracted")  return 1;
    return 0;
  };
  const statusColor = (s: string) =>
    s === "Confirmed"   ? { bg: "#DCFCE7", text: SUCCESS } :
    s === "Active"      ? { bg: "#DBEAFE", text: PRIMARY }  :
    s === "Departed"    ? { bg: "#F1F5F9", text: MUTED }    :
    s === "Contracted"  ? { bg: "#FFF7ED", text: ORANGE }   :
    s === "Tentative"   ? { bg: "#FEF9C3", text: "#92400E" } :
                          { bg: "#F1F5F9", text: MUTED };
  const roomingStatusColor = (s: string) =>
    s === "Checked In" ? { bg: "#DCFCE7", text: SUCCESS } :
    s === "Assigned"   ? { bg: "#EFF6FF", text: PRIMARY }  :
                         { bg: "#FEF3C7", text: "#D97706"  };

  // ── Computed ───────────────────────────────────────────────────────────────
  // Union of configured types + types that appear in actual group data
  const allTypes     = Array.from(new Set([...groupTypes, ...groups.map(g => g.type)])).sort();
  const filterOptions = ["All", ...allTypes];

  const filtered = groups.filter(g => {
    const matchType   = filterType === "All" || g.type === filterType;
    const matchSearch = !searchTerm || g.name.toLowerCase().includes(searchTerm.toLowerCase())
                     || g.organizer.toLowerCase().includes(searchTerm.toLowerCase())
                     || g.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });
  const selectedG     = groups.find(g => g.id === selectedId) ?? null;
  const totalRevenue  = groups.reduce((s, g) => s + g.estValue, 0);
  const totalPickedUp = groups.reduce((s, g) => s + g.rooming.length, 0);
  const totalBlock    = groups.reduce((s, g) => s + totalBlocked(g), 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const doCreateGroup = () => {
    if (!form.name.trim() || !form.organizer.trim()) {
      add({ type: "warning", title: "Group name and organizer are required" }); return;
    }
    const totalRms  = form.standardRooms + form.deluxeRooms + form.suiteRooms;
    const estNights = Math.max(1, Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000));
    const estVal    = (form.standardRooms * 35000 + form.deluxeRooms * 55000 + form.suiteRooms * 95000) * estNights;
    const newId     = `GRP-${String(groups.length + 1).padStart(3, "0")}`;
    setGroups(prev => [...prev, {
      id: newId, name: form.name.trim(), type: form.type,
      organizer: form.organizer.trim(), phone: form.phone, email: form.email,
      checkin: form.checkin, checkout: form.checkout, nights: estNights,
      rooms: { Standard: form.standardRooms, Deluxe: form.deluxeRooms, Suite: form.suiteRooms },
      ratePlan: form.ratePlan, cutoffDate: form.cutoffDate, notes: form.notes,
      depositPct: 30, depositPaid: 0, estValue: estVal,
      status: "Tentative", contractSent: false, contractSigned: false,
      rooming: [],
      folio: [{ id: 1, description: `Room charges — ${totalRms} rooms × ${estNights} nights`, amount: estVal, date: form.checkout, category: "room" as const }],
    }]);
    add({ type: "success", title: "Group created", body: `${form.name} · ${totalRms} rooms · Tentative` });
    setShowCreate(false);
    setForm({ name: "", type: "Corporate", organizer: "", phone: "", email: "", checkin: "2026-09-10", checkout: "2026-09-12", standardRooms: 4, deluxeRooms: 4, suiteRooms: 2, ratePlan: "Group Rate", cutoffDate: "2026-09-05", notes: "" });
  };

  const doAssign = (groupId: string, slotIdx: number) => {
    if (!assignName.trim()) return;
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const roomTypes = [...Array(g.rooms.Standard).fill("Standard"), ...Array(g.rooms.Deluxe).fill("Deluxe"), ...Array(g.rooms.Suite).fill("Suite")];
      const type = roomTypes[slotIdx] || "Standard";
      const newGuest: RoomingGuest = { id: slotIdx + 1, name: assignName.trim(), room: `${type} TBA`, type, status: "Assigned" };
      const newRooming = [...g.rooming]; newRooming[slotIdx] = newGuest;
      return { ...g, rooming: newRooming };
    }));
    add({ type: "success", title: `${assignName} assigned to slot ${slotIdx + 1}` });
    setAssignSlot(null); setAssignName("");
  };

  const doAdvanceStatus = (g: Group) => {
    const stage = statusStage(g);
    if (stage >= 4) return;
    let updates: Partial<Group> = {};
    let msg = "";
    if (stage === 0) { updates = { contractSent: true, status: "Contracted" }; msg = `Contract sent to ${g.email}`; }
    else if (stage === 1) { updates = { status: "Confirmed" };  msg = `${g.id} confirmed`; }
    else if (stage === 2) { updates = { status: "Active" };     msg = `${g.id} is now active`; }
    else if (stage === 3) { updates = { status: "Departed" };   msg = `${g.id} marked departed`; }
    setGroups(prev => prev.map(x => x.id === g.id ? { ...x, ...updates } : x));
    add({ type: "success", title: msg });
  };

  const doSaveGroupEdit = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const cin  = editForm.checkin  ?? g.checkin;
      const cout = editForm.checkout ?? g.checkout;
      const nights = Math.max(1, Math.round((new Date(cout).getTime() - new Date(cin).getTime()) / 86400000));
      return {
        ...g,
        organizer:    editForm.organizer    ?? g.organizer,
        phone:        editForm.phone        ?? g.phone,
        email:        editForm.email        ?? g.email,
        checkin:      cin,
        checkout:     cout,
        nights,
        rooms: {
          Standard: editForm.standardRooms ?? g.rooms.Standard,
          Deluxe:   editForm.deluxeRooms   ?? g.rooms.Deluxe,
          Suite:    editForm.suiteRooms    ?? g.rooms.Suite,
        },
        ratePlan:     editForm.ratePlan     ?? g.ratePlan,
        cutoffDate:   editForm.cutoffDate   ?? g.cutoffDate,
        notes:        editForm.notes        ?? g.notes,
        cancelPolicy: editForm.cancelPolicy ?? g.cancelPolicy,
      };
    }));
    add({ type: "success", title: "Group details updated" });
    setEditingGroup(null);
    setShowDeleteConfirm(false);
  };

  const doDeleteGroup = (groupId: string) => {
    const name = groups.find(g => g.id === groupId)?.name ?? groupId;
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setSelectedId(null);
    setDetailTab("overview");
    setShowDeleteConfirm(false);
    setEditingGroup(null);
    add({ type: "info", title: `${name} deleted` });
  };

  // ── Inline create form values ──────────────────────────────────────────────
  const createTotalRms  = form.standardRooms + form.deluxeRooms + form.suiteRooms;
  const createNights    = Math.max(1, Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000));
  const createEstVal    = (form.standardRooms * 35000 + form.deluxeRooms * 55000 + form.suiteRooms * 95000) * createNights;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative">

      {/* ── Quick Create Modal ─────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: PASS_BG, border: `1.5px solid ${PASS_BORDER}`, maxHeight: "90vh", overflowY: "auto" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: TEAL }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60">New Group Booking</p>
                <p className="text-base font-bold text-white mt-0.5">Quick Create — saved as Tentative</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <X size={16} color="white" />
              </button>
            </div>
            <PassNotch />

            <div className="px-6 py-5 space-y-5">
              {/* Group name + type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Group Name <span style={{ color: ERROR }}>*</span></label>
                  <input value={form.name} onChange={e => upd("name", e.target.value)} placeholder="e.g. Zenith Bank Team Offsite"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Group Type</label>
                  <select value={form.type} onChange={e => upd("type", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }}>
                    {allTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Organizer + contact */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Organizer <span style={{ color: ERROR }}>*</span></label>
                  <input value={form.organizer} onChange={e => upd("organizer", e.target.value)} placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Phone</label>
                  <input value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="+234 …"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Email</label>
                  <input value={form.email} onChange={e => upd("email", e.target.value)} placeholder="organizer@company.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Check-In</label>
                  <input type="date" value={form.checkin} onChange={e => upd("checkin", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Check-Out</label>
                  <input type="date" value={form.checkout} onChange={e => upd("checkout", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Cut-Off Date</label>
                  <input type="date" value={form.cutoffDate} onChange={e => upd("cutoffDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
                </div>
              </div>

              {/* Room block */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PASS_MUTED }}>Room Block</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    ["Standard", "standardRooms", "₦35,000/night"],
                    ["Deluxe",   "deluxeRooms",   "₦55,000/night"],
                    ["Suite",    "suiteRooms",     "₦95,000/night"],
                  ] as [string, "standardRooms"|"deluxeRooms"|"suiteRooms", string][]).map(([label, key, rate]) => (
                    <div key={key} className="rounded-xl p-4 text-center" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }}>
                      <p className="text-xs font-bold" style={{ color: PASS_MUTED }}>{label}</p>
                      <p className="text-xs mb-3" style={{ color: PASS_MUTED, opacity: 0.7 }}>{rate}</p>
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => upd(key, Math.max(0, (form[key] as number) - 1))}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                          style={{ backgroundColor: PASS_BG, border: `1.5px solid ${PASS_DASH}`, color: PASS_MUTED, fontSize: 18, lineHeight: 1 }}>−</button>
                        <span className="text-xl font-bold w-6 text-center" style={{ color: TEXT, fontFamily: mono }}>{form[key]}</span>
                        <button onClick={() => upd(key, (form[key] as number) + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                          style={{ backgroundColor: TEAL, color: "white", fontSize: 18, lineHeight: 1 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate plan + live estimate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Rate Plan</label>
                  <select value={form.ratePlan} onChange={e => upd("ratePlan", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }}>
                    {RATE_PLANS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="rounded-xl p-4 flex flex-col justify-center" style={{ backgroundColor: `${TEAL}0D`, border: `1.5px solid ${TEAL}28` }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: PASS_MUTED }}>{createTotalRms} rooms · {createNights} nights</span>
                    <span className="font-bold" style={{ color: TEAL }}>{form.type}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: TEAL, fontFamily: mono }}>₦{createEstVal.toLocaleString()}</p>
                  <p className="text-xs mt-0.5" style={{ color: PASS_MUTED }}>Estimated value (excl. taxes)</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PASS_MUTED }}>Notes</label>
                <textarea value={form.notes} onChange={e => upd("notes", e.target.value)} placeholder="Special requirements, inclusions, concessions…" rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${PASS_DASH}`, backgroundColor: "white" }} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={doCreateGroup} className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor: TEAL }}>
                <CheckCircle2 size={16} /> Create Group Booking
              </button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: PASS_MUTED }}>Reservations</p>
          <h1 className="text-2xl font-bold" style={{ color: TEXT }}>Group Bookings</h1>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: TEAL }}>
          <Plus size={15} /> New Group
        </button>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left column: KPI strip + filter + table ─────────────────────── */}
        <div className={selectedId ? "w-96 flex-shrink-0" : "flex-1"}>

          {/* KPI strip — hidden when detail panel is open */}
          {!selectedId && (
            <div className="grid grid-cols-4 gap-4 mb-5">
              {([
                ["Active Groups",  String(groups.length),                        "Confirmed & Tentative", Users,        TEAL   ],
                ["Rooms Blocked",  String(totalBlock),                           "Across all groups",      BedDouble,    PRIMARY],
                ["Guests Assigned",String(totalPickedUp),                        "Rooming list total",     UserCheck,    SUCCESS],
                ["Est. Revenue",   `₦${(totalRevenue/1000000).toFixed(1)}M`,    "Combined value",         DollarSign,   ORANGE ],
              ] as [string,string,string,React.ElementType,string][]).map(([label, value, sub, Icon, accent]) => (
                <div key={label} className="rounded-2xl p-5 border" style={{ backgroundColor: PASS_BG, borderColor: PASS_BORDER }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${accent}14` }}>
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: TEXT, fontFamily: mono }}>{value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: PASS_MUTED }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: PASS_MUTED, opacity: 0.7 }}>{sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search + type filter */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1 min-w-48" style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white" }}>
              <Search size={14} style={{ color: PASS_MUTED }} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search groups…"
                className="flex-1 text-sm outline-none bg-transparent" style={{ color: TEXT }} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {filterOptions.map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ backgroundColor: filterType === t ? PRIMARY : "white", color: filterType === t ? "white" : PASS_MUTED, border: `1.5px solid ${filterType === t ? PRIMARY : PASS_BORDER}` }}>
                  {t}
                </button>
              ))}
              <button onClick={() => setShowTypeManager(v => !v)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                style={{ backgroundColor: showTypeManager ? `${TEAL}14` : "white", color: showTypeManager ? TEAL : PASS_MUTED, border: `1.5px solid ${showTypeManager ? TEAL + "40" : PASS_BORDER}` }}
                title="Manage group types">
                <Settings size={12} />Types
              </button>
            </div>
          </div>

          {/* Type manager panel */}
          {showTypeManager && (
            <div className="rounded-xl mb-4 overflow-hidden" style={{ border: `1.5px solid ${TEAL}30`, backgroundColor: `${TEAL}06` }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${TEAL}20` }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>Manage Group Types</p>
                <p className="text-xs" style={{ color: PASS_MUTED }}>Types in use appear as filter pills automatically</p>
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {allTypes.map(t => {
                  const inUse = groups.some(g => g.type === t);
                  const inConfig = groupTypes.includes(t);
                  return (
                    <div key={t} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: "white", border: `1.5px solid ${inUse ? TEAL + "40" : PASS_BORDER}`, color: inUse ? TEAL : PASS_MUTED }}>
                      {t}
                      {inUse && <span className="font-normal opacity-60" style={{ fontSize: 9 }}>in use</span>}
                      {!inUse && inConfig && (
                        <button onClick={() => { setGroupTypes(prev => prev.filter(x => x !== t)); if (filterType === t) setFilterType("All"); }}
                          className="ml-1 opacity-50 hover:opacity-100 transition-opacity" title={`Remove "${t}"`}>
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 px-3 pb-3">
                <input value={newTypeName} onChange={e => setNewTypeName(e.target.value)}
                  placeholder="New type name (e.g. Sports Team)…"
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ border: `1.5px solid ${TEAL}40`, backgroundColor: "white" }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newTypeName.trim() && !groupTypes.includes(newTypeName.trim())) {
                      setGroupTypes(prev => [...prev, newTypeName.trim()]);
                      setNewTypeName("");
                    }
                  }} />
                <button onClick={() => {
                  const t = newTypeName.trim();
                  if (t && !groupTypes.includes(t)) { setGroupTypes(prev => [...prev, t]); setNewTypeName(""); }
                }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: TEAL }}>
                  + Add
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${PASS_BORDER}` }}>
            {/* Header row */}
            <div className="flex items-center px-4 py-2.5" style={{ backgroundColor: "#F1F5F9", borderBottom: `1.5px solid ${PASS_BORDER}` }}>
              <div className="flex-1 font-bold" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>GROUP</div>
              {!selectedId && (
                <>
                  <div className="w-36 font-bold flex-shrink-0" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>ORGANIZER</div>
                  <div className="w-28 font-bold flex-shrink-0" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>DATES</div>
                  <div className="w-16 font-bold flex-shrink-0 text-center" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>ROOMS</div>
                  <div className="w-24 font-bold flex-shrink-0" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>PICK-UP</div>
                  <div className="w-24 font-bold flex-shrink-0 text-right" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>VALUE</div>
                  <div className="w-24 font-bold flex-shrink-0 text-right" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>STATUS</div>
                </>
              )}
            </div>

            {/* Data rows */}
            {filtered.map(g => {
              const pct        = pickupPct(g);
              const sc         = statusColor(g.status);
              const isSelected = selectedId === g.id;
              const cd         = cutoffDays(g);
              return (
                <button key={g.id} onClick={() => { setSelectedId(isSelected ? null : g.id); setDetailTab("overview"); setAssignSlot(null); }}
                  className="w-full flex items-center px-4 py-3.5 text-left transition-all"
                  style={{ borderBottom: `1px solid ${PASS_DASH}`, backgroundColor: isSelected ? `${TEAL}08` : "white", borderLeft: `3px solid ${isSelected ? TEAL : "transparent"}` }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="font-bold" style={{ fontSize: 10, color: PASS_MUTED, fontFamily: mono }}>{g.id}</span>
                      <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ fontSize: 9, backgroundColor: `${TEAL}15`, color: TEAL }}>{g.type}</span>
                      {cd > 0 && cd <= 5 && <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ fontSize: 9, backgroundColor: "#FEF9C3", color: "#92400E" }}>⚠ {cd}d cut-off</span>}
                      {cd <= 0 && <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ fontSize: 9, backgroundColor: "#FEE2E2", color: ERROR }}>Cut-off passed</span>}
                    </div>
                    <p className="font-semibold text-sm truncate" style={{ color: TEXT }}>{g.name}</p>
                    {selectedId && <p className="text-xs mt-0.5 truncate" style={{ color: PASS_MUTED }}>{g.organizer}</p>}
                  </div>
                  {!selectedId && (
                    <>
                      <div className="w-36 flex-shrink-0 pl-2">
                        <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>{g.organizer}</p>
                        <p className="text-xs truncate" style={{ color: PASS_MUTED }}>{g.email}</p>
                      </div>
                      <div className="w-28 flex-shrink-0 pl-2">
                        <p className="text-xs font-semibold" style={{ color: TEXT }}>{g.checkin}</p>
                        <p className="text-xs" style={{ color: PASS_MUTED }}>{g.nights}n · {g.checkout}</p>
                      </div>
                      <div className="w-16 flex-shrink-0 text-center">
                        <p className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{totalBlocked(g)}</p>
                      </div>
                      <div className="w-24 flex-shrink-0 pl-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold" style={{ color: pct >= 80 ? SUCCESS : pct >= 50 ? ORANGE : ERROR, fontFamily: mono }}>{pct}%</span>
                          <span className="text-xs" style={{ color: PASS_MUTED, fontSize: 9 }}>{g.rooming.length}/{totalBlocked(g)}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: PASS_DASH }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? SUCCESS : pct >= 50 ? ORANGE : ERROR }} />
                        </div>
                      </div>
                      <div className="w-24 flex-shrink-0 text-right">
                        <p className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{(g.estValue/1000000).toFixed(1)}M</p>
                      </div>
                      <div className="w-24 flex-shrink-0 text-right">
                        <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: sc.bg, color: sc.text }}>{g.status}</span>
                      </div>
                    </>
                  )}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12" style={{ color: PASS_MUTED }}>
                <Building2 size={32} style={{ opacity: 0.3 }} />
                <p className="text-sm mt-3 font-semibold">No groups found</p>
                <p className="text-xs mt-1">Adjust search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Detail panel ──────────────────────────────────── */}
        {selectedId && selectedG && (() => {
          const g        = selectedG;
          const stage    = statusStage(g);
          const cd       = cutoffDays(g);
          const pct      = pickupPct(g);
          const total    = totalBlocked(g);
          const sc       = statusColor(g.status);
          const charges  = g.folio.filter(l => l.category !== "payment").reduce((s, l) => s + l.amount, 0);
          const payments = Math.abs(g.folio.filter(l => l.category === "payment").reduce((s, l) => s + l.amount, 0));
          const vat      = Math.round(charges * 0.075);
          const balance  = charges + vat - payments;
          const nextBtnLabel = stage === 0 ? "Send Contract" : stage === 1 ? "Mark Confirmed" : stage === 2 ? "Set Active" : stage === 3 ? "Mark Departed" : "Completed";

          return (
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ border: `1.5px solid ${PASS_BORDER}`, minWidth: 0 }}>

              {/* Panel header — boarding-pass style */}
              <div className="px-5 py-4" style={{ backgroundColor: TEAL }}>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-white opacity-60" style={{ fontFamily: mono }}>{g.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "white" }}>{g.type}</span>
                    </div>
                    <p className="text-lg font-bold text-white truncate">{g.name}</p>
                    <p className="text-xs text-white opacity-60 mt-0.5">{g.organizer} · {g.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: sc.bg, color: sc.text }}>{g.status}</span>
                    <button onClick={() => { setSelectedId(null); setDetailTab("overview"); setAssignSlot(null); setEditingFolio(false); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <X size={14} color="white" />
                    </button>
                  </div>
                </div>
              </div>

              <PassNotch />

              {/* Status pipeline */}
              <div className="px-5 py-3" style={{ backgroundColor: PASS_BG, borderBottom: `1px solid ${PASS_BORDER}` }}>
                <div className="flex items-center">
                  {STATUS_PIPELINE.map((s, i) => (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mb-1"
                          style={{ backgroundColor: i <= stage ? TEAL : PASS_DASH }}>
                          {i < stage
                            ? <CheckCircle2 size={12} color="white" />
                            : <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: i === stage ? "white" : PASS_MUTED }} />}
                        </div>
                        <p className="text-center font-bold" style={{ fontSize: 8, color: i <= stage ? TEAL : PASS_MUTED, letterSpacing: "0.06em" }}>{s.toUpperCase()}</p>
                      </div>
                      {i < STATUS_PIPELINE.length - 1 && (
                        <div className="flex-1 h-0.5 mx-1 mb-3.5" style={{ backgroundColor: i < stage ? TEAL : PASS_DASH }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex" style={{ borderBottom: `1.5px solid ${PASS_BORDER}`, backgroundColor: PASS_BG }}>
                {(["overview", "rooming", "folio", "contract"] as const).map(t => (
                  <button key={t} onClick={() => setDetailTab(t)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all"
                    style={{ borderBottom: `2px solid ${detailTab === t ? TEAL : "transparent"}`, color: detailTab === t ? TEAL : PASS_MUTED }}>
                    {t === "rooming" ? `Rooming (${g.rooming.length}/${total})` : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor: PASS_BG }}>

                {/* ── Overview tab ─────────────────────────────────────────── */}
                {detailTab === "overview" && (
                  <div className="p-5 space-y-4">
                    {cd > 0 && cd <= 5 && editingGroup !== g.id && (
                      <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#FFFBEB", border: `1.5px solid ${ORANGE}30`, color: "#92400E" }}>
                        <AlertTriangle size={15} /> Cut-off in {cd} day{cd !== 1 ? "s" : ""} — confirm unassigned rooms
                      </div>
                    )}
                    {cd <= 0 && editingGroup !== g.id && (
                      <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#FEE2E2", border: `1.5px solid ${ERROR}30`, color: ERROR }}>
                        <AlertTriangle size={15} /> Cut-off has passed — room block is frozen
                      </div>
                    )}

                    {editingGroup === g.id ? (
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED }}>Edit Group Details</p>

                        {/* Contact fields */}
                        {([["Organizer","organizer","text"],["Phone","phone","tel"],["Email","email","email"]] as [string,string,string][]).map(([label,field,type]) => (
                          <div key={field}>
                            <label className="block text-xs font-bold mb-1" style={{ color: PASS_MUTED }}>{label}</label>
                            <input type={type} value={editForm[field] ?? ""} onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg text-sm"
                              style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white", color: TEXT, outline: "none" }} />
                          </div>
                        ))}

                        {/* Date fields */}
                        <div className="grid grid-cols-3 gap-2">
                          {([["Check-In","checkin"],["Check-Out","checkout"],["Cut-Off","cutoffDate"]] as [string,string][]).map(([label,field]) => (
                            <div key={field}>
                              <label className="block text-xs font-bold mb-1" style={{ color: PASS_MUTED }}>{label}</label>
                              <input type="date" value={editForm[field] ?? ""} onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))}
                                className="w-full px-2 py-2 rounded-lg text-xs"
                                style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white", color: TEXT, outline: "none" }} />
                            </div>
                          ))}
                        </div>

                        {/* Rate plan */}
                        <div>
                          <label className="block text-xs font-bold mb-1" style={{ color: PASS_MUTED }}>Rate Plan</label>
                          <select value={editForm.ratePlan ?? g.ratePlan} onChange={e => setEditForm(p => ({ ...p, ratePlan: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white", color: TEXT, outline: "none" }}>
                            {RATE_PLANS.map(rp => <option key={rp} value={rp}>{rp}</option>)}
                          </select>
                        </div>

                        {/* Room allocation steppers */}
                        <div>
                          <label className="block text-xs font-bold mb-2" style={{ color: PASS_MUTED }}>Room Allocation</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["Standard","Deluxe","Suite"] as const).map(rt => {
                              const key = `${rt.toLowerCase()}Rooms`;
                              const val = editForm[key] ?? g.rooms[rt];
                              return (
                                <div key={rt} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ backgroundColor: "white", border: `1.5px solid ${PASS_BORDER}` }}>
                                  <p className="text-xs font-bold" style={{ color: PASS_MUTED }}>{rt}</p>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => setEditForm(p => ({ ...p, [key]: Math.max(0, val - 1) }))}
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                                      style={{ backgroundColor: PASS_DASH, color: TEXT }}>−</button>
                                    <span className="text-lg font-bold w-6 text-center" style={{ color: TEXT, fontFamily: mono }}>{val}</span>
                                    <button onClick={() => setEditForm(p => ({ ...p, [key]: val + 1 }))}
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                                      style={{ backgroundColor: TEAL, color: "white" }}>+</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-xs font-bold mb-1" style={{ color: PASS_MUTED }}>Notes</label>
                          <textarea value={editForm.notes ?? g.notes} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                            rows={3} className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white", color: TEXT, outline: "none" }} />
                        </div>

                        {/* Cancellation policy */}
                        <div>
                          <label className="block text-xs font-bold mb-1" style={{ color: PASS_MUTED }}>Cancellation Policy</label>
                          <input type="text"
                            value={editForm.cancelPolicy ?? (g.cancelPolicy ?? "48h notice / 1 night penalty")}
                            onChange={e => setEditForm(p => ({ ...p, cancelPolicy: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, backgroundColor: "white", color: TEXT, outline: "none" }} />
                        </div>

                        {/* Save / Cancel */}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => doSaveGroupEdit(g.id)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
                            style={{ backgroundColor: TEAL }}>Save Changes</button>
                          <button onClick={() => { setEditingGroup(null); setShowDeleteConfirm(false); }}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED, backgroundColor: "white" }}>Cancel</button>
                        </div>

                        {/* Delete zone */}
                        {showDeleteConfirm ? (
                          <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "#FEF2F2", border: `1.5px solid ${ERROR}30` }}>
                            <p className="text-sm font-bold" style={{ color: ERROR }}>Delete {g.name}?</p>
                            <p className="text-xs" style={{ color: PASS_MUTED }}>This cannot be undone. All rooming and folio data will be lost.</p>
                            <div className="flex gap-2">
                              <button onClick={() => doDeleteGroup(g.id)}
                                className="flex-1 py-2 rounded-lg text-xs font-bold text-white"
                                style={{ backgroundColor: ERROR }}>Yes, Delete</button>
                              <button onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 rounded-lg text-xs font-bold"
                                style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED, backgroundColor: "white" }}>Keep Group</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-2 rounded-xl text-xs font-bold"
                            style={{ border: `1.5px solid ${ERROR}30`, color: ERROR, backgroundColor: "#FEF2F2" }}>
                            Delete This Group
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            ["Check-In",    g.checkin,        CalendarDays ],
                            ["Check-Out",   g.checkout,       CalendarDays ],
                            ["Nights",      String(g.nights), Clock        ],
                            ["Cut-Off",     g.cutoffDate,     AlertTriangle],
                            ["Rate Plan",   g.ratePlan,       DollarSign   ],
                            ["Total Rooms", String(total),    BedDouble    ],
                          ] as [string, string, React.ElementType][]).map(([label, value, Icon]) => (
                            <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "white", border: `1px solid ${PASS_BORDER}` }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TEAL}10` }}>
                                <Icon size={15} style={{ color: TEAL }} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold uppercase" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.06em" }}>{label}</p>
                                <p className="font-semibold text-sm mt-0.5 truncate" style={{ color: TEXT }}>{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: `1px solid ${PASS_BORDER}` }}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold uppercase tracking-wider" style={{ color: PASS_MUTED }}>Pick-Up Progress</span>
                            <span className="font-bold" style={{ color: pct >= 80 ? SUCCESS : pct >= 50 ? ORANGE : ERROR, fontFamily: mono }}>{pct}% · {g.rooming.length}/{total}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: PASS_DASH }}>
                            <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? SUCCESS : pct >= 50 ? ORANGE : ERROR }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {([
                            ["Standard", g.rooms.Standard, "₦35K/nt"],
                            ["Deluxe",   g.rooms.Deluxe,   "₦55K/nt"],
                            ["Suite",    g.rooms.Suite,    "₦95K/nt"],
                          ] as [string, number, string][]).map(([type, count, rate]) => (
                            <div key={type} className="text-center p-3 rounded-xl" style={{ backgroundColor: "white", border: `1px solid ${PASS_BORDER}` }}>
                              <p className="text-xs font-bold" style={{ color: PASS_MUTED }}>{type}</p>
                              <p className="text-2xl font-bold my-1" style={{ color: count > 0 ? TEXT : PASS_DASH, fontFamily: mono }}>{count}</p>
                              <p className="text-xs" style={{ color: PASS_MUTED }}>{rate}</p>
                            </div>
                          ))}
                        </div>

                        {g.notes && (
                          <div className="px-4 py-3 rounded-xl text-sm italic" style={{ backgroundColor: "white", border: `1px solid ${PASS_BORDER}`, color: PASS_MUTED }}>
                            "{g.notes}"
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button onClick={() => doAdvanceStatus(g)} disabled={stage >= 4}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
                            style={{ backgroundColor: stage < 4 ? TEAL : PASS_DASH }}>
                            <ArrowRight size={13} />{nextBtnLabel}
                          </button>
                          <button onClick={() => {
                            setEditForm({
                              organizer: g.organizer, phone: g.phone, email: g.email,
                              checkin: g.checkin, checkout: g.checkout, cutoffDate: g.cutoffDate,
                              ratePlan: g.ratePlan, notes: g.notes,
                              standardRooms: g.rooms.Standard, deluxeRooms: g.rooms.Deluxe, suiteRooms: g.rooms.Suite,
                              cancelPolicy: g.cancelPolicy ?? "48h notice / 1 night penalty",
                            });
                            setEditingGroup(g.id);
                          }}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, color: TEXT, backgroundColor: "white" }}>
                            <Edit3 size={13} />Edit
                          </button>
                          <button onClick={() => add({ type: "info", title: `PDF — ${g.id}` })}
                            className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center"
                            style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED, backgroundColor: "white" }}>
                            <Download size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── Rooming list tab ─────────────────────────────────────── */}
                {detailTab === "rooming" && (
                  <div>
                    <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10" style={{ backgroundColor: "#F1F5F9", borderBottom: `1px solid ${PASS_BORDER}` }}>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED }}>{g.rooming.length} of {total} slots assigned</p>
                      <button onClick={() => add({ type: "info", title: "Rooming list exported" })} className="flex items-center gap-1 text-xs font-bold" style={{ color: TEAL }}>
                        <Download size={11} />CSV
                      </button>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: "white", borderBottom: `1px solid ${PASS_BORDER}` }}>
                          {["#", "GUEST", "TYPE", "ROOM", "STATUS", ""].map(h => (
                            <th key={h} className={`px-4 py-2.5 font-bold ${h === "" ? "text-right" : "text-left"}`} style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: total }, (_, idx) => {
                          const roomTypes = [...Array(g.rooms.Standard).fill("Standard"), ...Array(g.rooms.Deluxe).fill("Deluxe"), ...Array(g.rooms.Suite).fill("Suite")];
                          const guest = g.rooming[idx];
                          const rType = roomTypes[idx] || "Standard";
                          const rsc   = guest ? roomingStatusColor(guest.status) : null;
                          return (
                            <tr key={idx} style={{ borderBottom: `1px solid ${PASS_DASH}`, backgroundColor: idx % 2 === 0 ? "white" : "#FAFAF8" }}>
                              <td className="px-4 py-3 font-bold" style={{ color: PASS_MUTED, fontFamily: mono, fontSize: 11 }}>{String(idx + 1).padStart(2, "0")}</td>
                              <td className="px-4 py-3">
                                {guest ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TEAL}18` }}>
                                      <User size={12} style={{ color: TEAL }} />
                                    </div>
                                    <span className="font-semibold" style={{ color: TEXT }}>{guest.name}</span>
                                  </div>
                                ) : (
                                  <span style={{ color: PASS_MUTED }}>Slot {idx + 1}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs font-semibold" style={{ color: PASS_MUTED }}>{guest ? guest.type : rType}</td>
                              <td className="px-4 py-3 text-xs" style={{ color: guest ? TEXT : PASS_MUTED, fontFamily: mono }}>{guest ? guest.room : "—"}</td>
                              <td className="px-4 py-3">
                                {rsc
                                  ? <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: rsc.bg, color: rsc.text }}>{guest!.status}</span>
                                  : <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#F1F5F9", color: MUTED }}>Unassigned</span>}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {assignSlot === idx ? (
                                  <div className="flex items-center gap-1 justify-end">
                                    <input value={assignName} onChange={e => setAssignName(e.target.value)}
                                      placeholder="Guest name…" autoFocus
                                      className="px-2 py-1.5 text-xs rounded-lg outline-none"
                                      style={{ border: `1.5px solid ${TEAL}`, width: 120 }}
                                      onKeyDown={e => e.key === "Enter" && doAssign(g.id, idx)} />
                                    <button onClick={() => doAssign(g.id, idx)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: TEAL }}>OK</button>
                                    <button onClick={() => { setAssignSlot(null); setAssignName(""); }} className="px-2 py-1.5 rounded-lg text-xs" style={{ color: PASS_MUTED }}>✕</button>
                                  </div>
                                ) : (
                                  <button onClick={() => { setAssignSlot(idx); setAssignName(""); }}
                                    className="text-xs px-3 py-1.5 rounded-lg font-bold"
                                    style={{ border: `1.5px solid ${guest ? PASS_BORDER : TEAL}28`, color: guest ? PASS_MUTED : TEAL, backgroundColor: guest ? "transparent" : `${TEAL}08` }}>
                                    {guest ? "Reassign" : "Assign"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Folio tab ────────────────────────────────────────────── */}
                {detailTab === "folio" && (
                  <div>
                    <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10" style={{ backgroundColor: "#F1F5F9", borderBottom: `1px solid ${PASS_BORDER}` }}>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED }}>Master Folio — {g.id}</p>
                      <button onClick={() => setEditingFolio(v => !v)} className="flex items-center gap-1 text-xs font-bold" style={{ color: editingFolio ? ORANGE : TEAL }}>
                        <Plus size={11} />{editingFolio ? "Done" : "Add Charge"}
                      </button>
                    </div>
                    {editingFolio && (
                      <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: `${TEAL}08`, borderBottom: `1px solid ${PASS_BORDER}` }}>
                        <input value={newCharge.description} onChange={e => setNewCharge(p => ({ ...p, description: e.target.value }))}
                          placeholder="Description (e.g. Welcome dinner)"
                          className="flex-1 px-3 py-2 rounded-lg text-xs outline-none" style={{ border: `1.5px solid ${TEAL}40`, backgroundColor: "white" }} />
                        <input value={newCharge.amount} onChange={e => setNewCharge(p => ({ ...p, amount: e.target.value }))}
                          placeholder="Amount (₦)" type="number"
                          className="w-28 px-3 py-2 rounded-lg text-xs outline-none" style={{ border: `1.5px solid ${TEAL}40`, backgroundColor: "white" }} />
                        <button onClick={() => {
                          if (!newCharge.description || !newCharge.amount) return;
                          setGroups(prev => prev.map(x => x.id === g.id ? {
                            ...x, folio: [...x.folio, { id: x.folio.length + 1, description: newCharge.description, amount: Number(newCharge.amount), date: new Date().toISOString().split("T")[0], category: "extra" as const }],
                          } : x));
                          setNewCharge({ description: "", amount: "" });
                          add({ type: "success", title: "Charge added to folio" });
                        }} className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: TEAL }}>Add</button>
                      </div>
                    )}
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: "white", borderBottom: `1px solid ${PASS_BORDER}` }}>
                          <th className="px-5 py-2.5 text-left font-bold" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>DESCRIPTION</th>
                          <th className="px-5 py-2.5 text-left font-bold" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>DATE</th>
                          <th className="px-5 py-2.5 text-right font-bold" style={{ fontSize: 9, color: PASS_MUTED, letterSpacing: "0.08em" }}>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.folio.map(line => (
                          <tr key={line.id} style={{ borderBottom: `1px solid ${PASS_DASH}`, backgroundColor: line.category === "payment" ? "#F0FDF4" : "white" }}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: line.category === "payment" ? SUCCESS : line.category === "room" ? TEAL : line.category === "fnb" ? ORANGE : PRIMARY }} />
                                <span style={{ color: TEXT }}>{line.description}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-xs" style={{ color: PASS_MUTED, fontFamily: mono }}>{line.date}</td>
                            <td className="px-5 py-3 text-right font-semibold" style={{ color: line.category === "payment" ? SUCCESS : TEXT, fontFamily: mono }}>
                              {line.category === "payment" ? "–" : ""}₦{Math.abs(line.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: "#FAFAF8", borderBottom: `1.5px dashed ${PASS_DASH}` }}>
                          <td className="px-5 py-2.5 text-xs font-semibold" style={{ color: PASS_MUTED }}>VAT (7.5%)</td>
                          <td></td>
                          <td className="px-5 py-2.5 text-right font-semibold text-xs" style={{ color: PASS_MUTED, fontFamily: mono }}>₦{vat.toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{ backgroundColor: PASS_BG, borderTop: `1.5px solid ${PASS_BORDER}` }}>
                          <td className="px-5 py-4 font-bold text-sm" style={{ color: TEXT }}>Balance Due</td>
                          <td></td>
                          <td className="px-5 py-4 text-right font-bold text-lg" style={{ color: balance > 0 ? ORANGE : SUCCESS, fontFamily: mono }}>₦{balance.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                    {paymentInput.show && paymentInput.groupId === g.id && (
                      <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: `${SUCCESS}08`, borderTop: `1px solid ${PASS_BORDER}` }}>
                        <span className="text-xs font-bold" style={{ color: PASS_MUTED }}>Amount (₦)</span>
                        <input value={paymentInput.amount} onChange={e => setPaymentInput(p => ({ ...p, amount: e.target.value }))}
                          placeholder="e.g. 500000" type="number" autoFocus
                          className="flex-1 px-3 py-2 rounded-lg text-xs outline-none" style={{ border: `1.5px solid ${SUCCESS}40`, backgroundColor: "white" }} />
                        <button onClick={() => {
                          const amt = Number(paymentInput.amount);
                          if (!amt || amt <= 0) return;
                          setGroups(prev => prev.map(x => x.id === g.id ? {
                            ...x,
                            depositPaid: x.depositPaid + amt,
                            folio: [...x.folio, { id: x.folio.length + 1, description: `Payment received`, amount: -amt, date: new Date().toISOString().split("T")[0], category: "payment" as const }],
                          } : x));
                          add({ type: "success", title: `₦${amt.toLocaleString()} recorded — ${g.id}` });
                          setPaymentInput({ show: false, amount: "", groupId: "" });
                        }} className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: SUCCESS }}>Record</button>
                        <button onClick={() => setPaymentInput({ show: false, amount: "", groupId: "" })} className="px-2 py-2 text-xs" style={{ color: PASS_MUTED }}>✕</button>
                      </div>
                    )}
                    <div className="px-5 py-4 flex gap-2">
                      <button onClick={() => add({ type: "info", title: `Invoice sent — ${g.id}` })} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>
                        Send Invoice
                      </button>
                      <button onClick={() => setPaymentInput({ show: !paymentInput.show || paymentInput.groupId !== g.id, amount: "", groupId: g.id })} className="flex-1 py-2.5 rounded-xl text-xs font-bold" style={{ border: `1.5px solid ${paymentInput.show && paymentInput.groupId === g.id ? SUCCESS : PASS_BORDER}`, color: paymentInput.show && paymentInput.groupId === g.id ? SUCCESS : PASS_MUTED, backgroundColor: "white" }}>
                        Record Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Contract tab ─────────────────────────────────────────── */}
                {detailTab === "contract" && (
                  <div className="p-5 space-y-4">
                    <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: g.contractSigned ? "#F0FDF4" : g.contractSent ? "#FFF7ED" : "white", border: `1.5px solid ${g.contractSigned ? SUCCESS + "30" : g.contractSent ? ORANGE + "30" : PASS_BORDER}` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: g.contractSigned ? `${SUCCESS}15` : g.contractSent ? `${ORANGE}15` : PASS_BORDER }}>
                        {g.contractSigned ? <CheckCircle2 size={20} style={{ color: SUCCESS }} /> : g.contractSent ? <Clock size={20} style={{ color: ORANGE }} /> : <FileText size={20} style={{ color: PASS_MUTED }} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: TEXT }}>{g.contractSigned ? "Contract Signed" : g.contractSent ? "Contract Sent — Awaiting Signature" : "Contract Not Sent"}</p>
                        <p className="text-xs mt-0.5" style={{ color: PASS_MUTED }}>{g.contractSigned ? "Organizer has signed. Booking confirmed." : g.contractSent ? `Sent to ${g.email}` : "Contract has not been issued yet."}</p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${PASS_BORDER}` }}>
                      <div className="px-4 py-2.5" style={{ backgroundColor: "#F1F5F9" }}>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED }}>Contract Terms</p>
                      </div>
                      {([
                        ["Rate Plan",        g.ratePlan],
                        ["Cut-Off Date",     g.cutoffDate],
                        ["Deposit Required", `${g.depositPct}% of est. value`],
                        ["Cancellation",     g.cancelPolicy ?? "48h notice / 1 night penalty"],
                        ["Room Block",       `${total} rooms held until cut-off`],
                      ]).map(([label, value]) => (
                        <div key={label} className="flex justify-between px-4 py-2.5 text-sm" style={{ borderTop: `1px solid ${PASS_DASH}` }}>
                          <span style={{ color: PASS_MUTED }}>{label}</span>
                          <span className="font-semibold" style={{ color: TEXT }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${PASS_BORDER}` }}>
                      <div className="px-4 py-2.5" style={{ backgroundColor: "#F1F5F9" }}>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PASS_MUTED }}>Payment Schedule</p>
                      </div>
                      {([
                        [`Deposit (${g.depositPct}%)`, `₦${Math.round(g.estValue * g.depositPct / 100).toLocaleString()}`, g.depositPaid > 0, "On contract signing"],
                        ["Balance",                     `₦${Math.round(g.estValue * (1 - g.depositPct / 100) * 1.075).toLocaleString()}`, false, "On check-in"],
                      ] as [string, string, boolean, string][]).map(([label, amount, paid, due]) => (
                        <div key={label} className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${PASS_DASH}` }}>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: TEXT }}>{label}</p>
                            <p className="text-xs" style={{ color: PASS_MUTED }}>{due}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm" style={{ color: TEXT, fontFamily: mono }}>{amount}</p>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: paid ? "#DCFCE7" : "#FEF3C7", color: paid ? SUCCESS : "#92400E" }}>{paid ? "Paid" : "Pending"}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {!g.contractSent && (
                        <button onClick={() => { setGroups(prev => prev.map(x => x.id === g.id ? { ...x, contractSent: true } : x)); add({ type: "success", title: "Contract sent", body: g.email }); }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5" style={{ backgroundColor: TEAL }}>
                          <Send size={13} />Send Contract
                        </button>
                      )}
                      {g.contractSent && !g.contractSigned && (
                        <button onClick={() => { setGroups(prev => prev.map(x => x.id === g.id ? { ...x, contractSigned: true, status: "Confirmed" } : x)); add({ type: "success", title: "Contract signed", body: g.id }); }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5" style={{ backgroundColor: SUCCESS }}>
                          <CheckCircle2 size={13} />Mark as Signed
                        </button>
                      )}
                      {g.contractSent && (
                        <button onClick={() => { setGroups(prev => prev.map(x => x.id === g.id ? { ...x, contractSent: true } : x)); add({ type: "info", title: "Contract resent", body: g.email }); }}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED, backgroundColor: "white" }}>
                          <RefreshCw size={13} />Resend
                        </button>
                      )}
                      <button onClick={() => add({ type: "info", title: `Contract PDF — ${g.id}` })}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        style={{ border: `1.5px solid ${PASS_BORDER}`, color: PASS_MUTED, backgroundColor: "white" }}>
                        <Download size={13} />PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export function Waitlist({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const PASS_BG     = "#F9FAFB";
  const PASS_BORDER = "#E2E8F0";
  const PASS_MUTED  = "#64748B";
  const PASS_DASH   = "#CBD5E1";
  const ROOM_TYPES  = ["Suite", "Deluxe", "Standard"];
  const SOURCES     = ["Walk-in", "Phone", "Online", "Referral"];

  type WLEntry = {
    id: string; guest: string; phone: string; email: string;
    type: string; dates: string; waitDays: number; priority: number;
    source: string; notes: string;
    contacted: boolean; contactedAt: string | null;
    availMatch: boolean;
  };

  const [entries, setEntries] = useState<WLEntry[]>([
    { id:"WL-018", guest:"Amara Nwosu",   phone:"+234 802 111 2233", email:"amara@nwosu.ng",   type:"Suite",    dates:"26–29 Aug", waitDays:2, priority:1, source:"Phone",    notes:"VIP — CEO of Nwosu Group. Prefers high floor.",              contacted:false, contactedAt:null,          availMatch:true  },
    { id:"WL-017", guest:"Kunle Badmus",  phone:"+234 803 445 6677", email:"kunle@badmus.com",  type:"Deluxe",   dates:"25–27 Aug", waitDays:3, priority:2, source:"Walk-in",  notes:"Travelling with spouse. Needs connecting rooms if possible.", contacted:true,  contactedAt:"Today 09:14", availMatch:false },
    { id:"WL-016", guest:"Sade Oladipo",  phone:"+234 809 900 1122", email:"sade@gmail.com",    type:"Standard", dates:"25 Aug",    waitDays:1, priority:3, source:"Online",   notes:"",                                                           contacted:false, contactedAt:null,          availMatch:false },
    { id:"WL-015", guest:"Emeka Nwosu",   phone:"+234 706 334 5566", email:"emeka@nwosu.ng",    type:"Deluxe",   dates:"3–5 Sep",   waitDays:5, priority:4, source:"Referral", notes:"Referred by GRP-001.",                                       contacted:true,  contactedAt:"Yesterday",   availMatch:false },
    { id:"WL-014", guest:"Funke Abosede", phone:"+234 812 667 8899", email:"funke@abosede.ng",  type:"Standard", dates:"2–4 Sep",   waitDays:6, priority:5, source:"Phone",    notes:"Requested ground-floor room.",                               contacted:false, contactedAt:null,          availMatch:false },
  ]);

  const [dismissed,     setDismissed]     = useState<string[]>([]);
  const [filterType,    setFilterType]    = useState("All");
  const [searchTerm,    setSearchTerm]    = useState("");
  const [showAdd,       setShowAdd]       = useState(false);
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [showPromoteId, setShowPromoteId] = useState<string | null>(null);
  const [roomAvailType, setRoomAvailType] = useState<string | null>("Suite");
  const [form, setForm] = useState({ guest:"", phone:"", email:"", type:"Suite", dates:"", source:"Walk-in", notes:"" });
  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const list    = entries.filter(e =>
    !dismissed.includes(e.id) &&
    (filterType === "All" || e.type === filterType) &&
    (!searchTerm || e.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm))
  );
  const sorted  = [...list].sort((a, b) => a.priority - b.priority);
  const matches = roomAvailType ? sorted.filter(e => e.type === roomAvailType) : [];
  const avgWait = list.length ? (list.reduce((s, e) => s + e.waitDays, 0) / list.length).toFixed(1) : "0";
  const contactedCount = list.filter(e => e.contacted).length;

  const doPromote = (e: WLEntry) => {
    add({ type:"success", title:`${e.guest} promoted to reservation`, body:`${e.type} · ${e.dates}` });
    setDismissed(d => [...d, e.id]);
    setShowPromoteId(null);
    if (e.availMatch) setRoomAvailType(null);
  };

  const doContact = (e: WLEntry) => {
    setEntries(prev => prev.map(x => x.id === e.id ? { ...x, contacted:true, contactedAt:"Just now" } : x));
    add({ type:"info", title:`Contacted ${e.guest}`, body:"SMS + email sent" });
  };

  const doRemove = (e: WLEntry) => {
    add({ type:"warning", title:`${e.guest} removed from waitlist` });
    setDismissed(d => [...d, e.id]);
  };

  const doMove = (id: string, dir: -1 | 1) => {
    setEntries(prev => {
      const arr  = [...prev];
      const idx  = arr.findIndex(e => e.id === id);
      const tgt  = arr.findIndex(e => e.priority === arr[idx].priority + dir);
      if (tgt === -1) return prev;
      [arr[idx].priority, arr[tgt].priority] = [arr[tgt].priority, arr[idx].priority];
      return arr;
    });
  };

  const doAdd = () => {
    if (!form.guest.trim()) { add({ type:"warning", title:"Guest name is required" }); return; }
    if (editingId) {
      setEntries(prev => prev.map(e => e.id === editingId ? {
        ...e, guest:form.guest.trim(), phone:form.phone, email:form.email,
        type:form.type, dates:form.dates, source:form.source, notes:form.notes,
      } : e));
      add({ type:"success", title:`${form.guest} updated` });
    } else {
      const maxP  = entries.length ? Math.max(...entries.map(e => e.priority)) : 0;
      const newId = `WL-0${String(entries.length + 13).padStart(2,"0")}`;
      setEntries(prev => [...prev, {
        id:newId, guest:form.guest.trim(), phone:form.phone, email:form.email,
        type:form.type, dates:form.dates, waitDays:0, priority:maxP + 1,
        source:form.source, notes:form.notes, contacted:false, contactedAt:null, availMatch:false,
      }]);
      add({ type:"success", title:`${form.guest} added to waitlist`, body:`${form.type} · Priority ${maxP + 1}` });
    }
    setShowAdd(false);
    setEditingId(null);
    setForm({ guest:"", phone:"", email:"", type:"Suite", dates:"", source:"Walk-in", notes:"" });
  };

  const sourceBadge = (s: string) => ({
    "Walk-in":  { bg:"#EFF6FF", color:PRIMARY  },
    "Phone":    { bg:"#F0FDF4", color:SUCCESS   },
    "Online":   { bg:"#FFF7ED", color:ORANGE    },
    "Referral": { bg:"#FAF5FF", color:"#7C3AED" },
  }[s] ?? { bg:"#F1F5F9", color:MUTED });

  const priorityColor = (p: number) => p === 1 ? ERROR : p === 2 ? ORANGE : p === 3 ? WARNING : MUTED;

  const PassDivider = () => (
    <div className="flex items-center" style={{ marginLeft:-1, marginRight:-1 }}>
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor:"#EFF6FF", border:`1.5px solid ${PASS_BORDER}`, marginLeft:-8 }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor:PASS_DASH }} />
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor:"#EFF6FF", border:`1.5px solid ${PASS_BORDER}`, marginRight:-8 }} />
    </div>
  );

  return (
    <div>

      {/* ── Add Guest Modal ─────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor:PASS_BG, border:`1.5px solid ${PASS_BORDER}` }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor:TEAL }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60">Waitlist</p>
                <p className="text-base font-bold text-white mt-0.5">{editingId ? "Edit Entry" : "Add Guest to Waitlist"}</p>
              </div>
              <button onClick={() => { setShowAdd(false); setEditingId(null); setForm({ guest:"", phone:"", email:"", type:"Suite", dates:"", source:"Walk-in", notes:"" }); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:"rgba(255,255,255,0.2)" }}>
                <X size={16} color="white" />
              </button>
            </div>
            <PassDivider />
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Guest Name <span style={{ color:ERROR }}>*</span></label>
                <input value={form.guest} onChange={e => upd("guest", e.target.value)} placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Phone</label>
                  <input value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="+234 …"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Email</label>
                  <input value={form.email} onChange={e => upd("email", e.target.value)} placeholder="guest@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Room Preference</label>
                  <select value={form.type} onChange={e => upd("type", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }}>
                    {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Requested Dates</label>
                  <input value={form.dates} onChange={e => upd("dates", e.target.value)} placeholder="e.g. 10–12 Sep"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Source</label>
                <div className="flex gap-2 flex-wrap">
                  {SOURCES.map(s => {
                    const sb = sourceBadge(s);
                    return (
                      <button key={s} onClick={() => upd("source", s)}
                        className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ backgroundColor:form.source === s ? sb.bg : "white", color:form.source === s ? sb.color : PASS_MUTED, border:`1.5px solid ${form.source === s ? sb.color + "40" : PASS_BORDER}` }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:PASS_MUTED }}>Notes</label>
                <textarea value={form.notes} onChange={e => upd("notes", e.target.value)} placeholder="Special requests, VIP notes…" rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border:`1.5px solid ${PASS_DASH}`, backgroundColor:"white" }} />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={doAdd} className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor:TEAL }}>
                {editingId ? <><Edit3 size={15} />Save Changes</> : <><Plus size={15} />Add to Waitlist</>}
              </button>
              <button onClick={() => { setShowAdd(false); setEditingId(null); setForm({ guest:"", phone:"", email:"", type:"Suite", dates:"", source:"Walk-in", notes:"" }); }} className="px-5 py-3 rounded-xl text-sm font-bold" style={{ border:`1.5px solid ${PASS_BORDER}`, color:PASS_MUTED }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Promote confirm ─────────────────────────────────────────────── */}
      {showPromoteId && (() => {
        const e = sorted.find(x => x.id === showPromoteId);
        if (!e) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(15,23,42,0.45)", backdropFilter:"blur(4px)" }}>
            <div className="w-80 rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor:PASS_BG, border:`1.5px solid ${PASS_BORDER}` }}>
              <div className="px-5 py-4" style={{ backgroundColor:SUCCESS }}>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-70">Confirm Promotion</p>
                <p className="text-base font-bold text-white mt-0.5">Promote to Reservation?</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="rounded-xl p-4" style={{ backgroundColor:"white", border:`1px solid ${PASS_BORDER}` }}>
                  <p className="font-bold text-sm" style={{ color:TEXT }}>{e.guest}</p>
                  <p className="text-xs mt-0.5" style={{ color:PASS_MUTED }}>{e.type} · {e.dates}</p>
                  <p className="text-xs mt-0.5" style={{ color:PASS_MUTED }}>{e.phone}</p>
                </div>
                <p className="text-xs" style={{ color:PASS_MUTED }}>This removes {e.guest} from the waitlist and opens a reservation for {e.type} · {e.dates}.</p>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => doPromote(e)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:SUCCESS }}>Confirm</button>
                <button onClick={() => setShowPromoteId(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ border:`1.5px solid ${PASS_BORDER}`, color:PASS_MUTED }}>Cancel</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color:PASS_MUTED }}>Reservations</p>
          <h1 className="text-2xl font-bold" style={{ color:TEXT }}>Waitlist</h1>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor:TEAL }}>
          <Plus size={15} />Add Guest
        </button>
      </div>

      {/* ── KPI strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {([
          ["On Waitlist",      String(list.length),    "Awaiting a room",              Users,        TEAL   ],
          ["Avg Wait",         `${avgWait} days`,      "Based on current list",        Clock,        ORANGE ],
          ["Contacted",        String(contactedCount), `of ${list.length} reached`,    Phone,        SUCCESS],
          ["Converted / mo",  "12",                   "Promoted this month",          CheckCircle2, PRIMARY],
        ] as [string,string,string,React.ElementType,string][]).map(([label, value, sub, Icon, accent]) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ backgroundColor:PASS_BG, borderColor:PASS_BORDER }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor:`${accent}14` }}>
              <Icon size={18} style={{ color:accent }} />
            </div>
            <p className="text-2xl font-bold" style={{ color:TEXT, fontFamily:mono }}>{value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color:PASS_MUTED }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color:PASS_MUTED, opacity:0.7 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Room available alert ─────────────────────────────────────────── */}
      {roomAvailType && matches.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl mb-5" style={{ backgroundColor:"#CCFBF1", border:"1.5px solid #5EEAD4" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor:"#14B8A630" }}>
            <CheckCircle2 size={18} style={{ color:"#0F766E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color:"#0F766E" }}>
              {roomAvailType} room just freed up — {matches.length} guest{matches.length !== 1 ? "s" : ""} match
            </p>
            <p className="text-xs mt-0.5" style={{ color:"#0F766E", opacity:0.8 }}>
              {matches.map(m => m.guest).join(", ")} · Click <strong>Promote</strong> on a highlighted row to convert immediately
            </p>
          </div>
          <button onClick={() => setRoomAvailType(null)} style={{ color:"#0F766E", opacity:0.5 }}><X size={14} /></button>
        </div>
      )}

      {/* ── Search + Filter pills ────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1 min-w-48" style={{ border:`1.5px solid ${PASS_BORDER}`, backgroundColor:"white" }}>
          <Search size={14} style={{ color:PASS_MUTED }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search guests by name, ID, email, phone…"
            className="flex-1 text-sm outline-none bg-transparent" style={{ color:TEXT }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={{ color:PASS_MUTED }}><X size={13} /></button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["All", ...ROOM_TYPES].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ backgroundColor:filterType === t ? PRIMARY : PASS_BG, color:filterType === t ? "white" : PASS_MUTED, border:`1.5px solid ${filterType === t ? PRIMARY : PASS_BORDER}` }}>
            {t}{t !== "All" && ` (${list.filter(e => e.type === t).length})`}
          </button>
        ))}
        <div className="ml-auto">
          {!roomAvailType && (
            <button onClick={() => setRoomAvailType("Suite")}
              className="text-xs px-3 py-1.5 rounded-full font-bold"
              style={{ backgroundColor:`${TEAL}10`, color:TEAL, border:`1.5px solid ${TEAL}30` }}>
              ↑ Simulate Room Available
            </button>
          )}
        </div>
      </div>

      {/* ── Waitlist table ───────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border:`1.5px solid ${PASS_BORDER}` }}>
        <div className="flex items-center px-4 py-2.5" style={{ backgroundColor:"#F1F5F9", borderBottom:`1.5px solid ${PASS_BORDER}` }}>
          <div className="w-10 font-bold" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>#</div>
          <div className="w-6 flex-shrink-0" />
          <div className="flex-1 font-bold" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>GUEST</div>
          <div className="w-24 font-bold flex-shrink-0" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>ROOM TYPE</div>
          <div className="w-28 font-bold flex-shrink-0" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>DATES</div>
          <div className="w-20 font-bold flex-shrink-0" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>WAITING</div>
          <div className="w-20 font-bold flex-shrink-0" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>SOURCE</div>
          <div className="font-bold flex-shrink-0" style={{ fontSize:9, color:PASS_MUTED, letterSpacing:"0.08em" }}>ACTIONS</div>
        </div>

        {sorted.map((e) => {
          const isMatch    = roomAvailType === e.type;
          const sb         = sourceBadge(e.source);
          const maxP       = Math.max(...sorted.map(x => x.priority));
          return (
            <div key={e.id} className="flex items-center px-4 py-3.5"
              style={{ borderBottom:`1px solid ${PASS_DASH}`, backgroundColor:isMatch ? "#F0FDFA" : "white", borderLeft:`3px solid ${isMatch ? "#14B8A6" : "transparent"}` }}>

              {/* Priority badge */}
              <div className="w-10 flex-shrink-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor:priorityColor(e.priority) }}>
                  {e.priority}
                </div>
              </div>

              {/* Reorder arrows */}
              <div className="w-6 flex-shrink-0 flex flex-col gap-0.5">
                <button onClick={() => doMove(e.id, -1)} disabled={e.priority === 1}
                  className="flex items-center justify-center transition-opacity disabled:opacity-10 opacity-30 hover:opacity-100"
                  style={{ color:PASS_MUTED }}>
                  <ChevronUp size={11} />
                </button>
                <button onClick={() => doMove(e.id, 1)} disabled={e.priority === maxP}
                  className="flex items-center justify-center transition-opacity disabled:opacity-10 opacity-30 hover:opacity-100"
                  style={{ color:PASS_MUTED }}>
                  <ChevronDown size={11} />
                </button>
              </div>

              {/* Guest info */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color:TEXT }}>{e.guest}</p>
                  {isMatch && <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ backgroundColor:"#14B8A6", color:"white" }}>Room Open</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs" style={{ color:PASS_MUTED, fontFamily:mono }}>{e.id}</span>
                  <span className="text-xs" style={{ color:PASS_MUTED }}>{e.phone}</span>
                  {e.email && <span className="text-xs" style={{ color:PASS_MUTED }}>{e.email}</span>}
                  {e.contacted && (
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color:SUCCESS }}>
                      <CheckCircle2 size={10} />Contacted {e.contactedAt}
                    </span>
                  )}
                </div>
                {e.notes && <p className="text-xs mt-0.5 truncate" style={{ color:PASS_MUTED, fontStyle:"italic" }}>"{e.notes}"</p>}
              </div>

              {/* Room type */}
              <div className="w-24 flex-shrink-0">
                <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor:"#EFF6FF", color:PRIMARY }}>{e.type}</span>
              </div>

              {/* Dates */}
              <div className="w-28 flex-shrink-0">
                <p className="text-xs font-semibold" style={{ color:TEXT }}>{e.dates || "—"}</p>
              </div>

              {/* Wait time */}
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-semibold" style={{ color:e.waitDays >= 5 ? ERROR : e.waitDays >= 3 ? ORANGE : PASS_MUTED }}>
                  {e.waitDays === 0 ? "Just added" : `${e.waitDays}d`}
                </p>
              </div>

              {/* Source */}
              <div className="w-20 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor:sb.bg, color:sb.color }}>{e.source}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => setShowPromoteId(e.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold"
                  style={{ backgroundColor:isMatch ? SUCCESS : `${SUCCESS}12`, color:isMatch ? "white" : SUCCESS, border:`1.5px solid ${SUCCESS}30` }}>
                  Promote
                </button>
                {!e.contacted ? (
                  <button onClick={() => doContact(e)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold"
                    style={{ backgroundColor:"white", color:PASS_MUTED, border:`1.5px solid ${PASS_BORDER}` }}>
                    Contact
                  </button>
                ) : (
                  <button onClick={() => doContact(e)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold"
                    style={{ backgroundColor:`${SUCCESS}0D`, color:SUCCESS, border:`1.5px solid ${SUCCESS}20` }}>
                    Resend
                  </button>
                )}
                <button onClick={() => {
                  setForm({ guest:e.guest, phone:e.phone, email:e.email, type:e.type, dates:e.dates, source:e.source, notes:e.notes });
                  setEditingId(e.id);
                  setShowAdd(true);
                }}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-bold"
                  style={{ backgroundColor:"white", color:PRIMARY, border:`1.5px solid ${PRIMARY}20` }}>
                  Edit
                </button>
                <button onClick={() => doRemove(e)}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-bold"
                  style={{ backgroundColor:"white", color:ERROR, border:`1.5px solid ${ERROR}20` }}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14" style={{ backgroundColor:"white" }}>
            <CheckCircle2 size={36} style={{ color:SUCCESS }} />
            <p className="text-sm font-semibold mt-3" style={{ color:TEXT }}>Waitlist is clear</p>
            <p className="text-xs mt-1" style={{ color:PASS_MUTED }}>No guests currently waiting for a room</p>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t text-xs" style={{ borderColor:PASS_BORDER, backgroundColor:PASS_BG }}>
          <span style={{ color:PASS_MUTED }}>{dismissed.length} guest{dismissed.length !== 1 ? "s" : ""} promoted or removed this session</span>
          <button onClick={() => add({ type:"info", title:"Waitlist exported" })} className="flex items-center gap-1 font-bold" style={{ color:TEAL }}>
            <Download size={12} />Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export function RateManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ROOM_CATEGORIES = ["Standard", "Deluxe", "Suite"];
  const ROOM_TYPE_MULTIPLIERS = { Standard: 1, Deluxe: 1.57, Suite: 2.71 };

  const [plans, setPlans] = useState(RATE_PLANS.map(r => ({ ...r })));
  const [selectedPlan, setSelectedPlan] = useState<(typeof RATE_PLANS)[0] | null>(null);
  const [editPlan, setEditPlan] = useState<(typeof RATE_PLANS)[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", base: "", dates: "", rooms: [] as string[] });
  const [createValues, setCreateValues] = useState({ name: "", base: "", dates: "Year-round", rooms: ["Standard", "Deluxe", "Suite"] as string[] });
  const updC = (k: string, v: string) => setCreateValues(p => ({ ...p, [k]: v }));

  const openEdit = (r: typeof RATE_PLANS[0]) => {
    setEditPlan(r);
    setEditValues({ name: r.name, base: r.base.toString(), dates: r.dates, rooms: [...(r.rooms as string[])] });
  };
  const saveEdit = () => {
    if (!editPlan) return;
    const rooms = editValues.rooms.length > 0 ? editValues.rooms : (editPlan.rooms as string[]);
    const base  = Number(editValues.base) || editPlan.base;
    setPlans(p => p.map(r => r.id === editPlan.id ? { ...r, name: editValues.name, base, dates: editValues.dates, rooms } : r));
    if (selectedPlan?.id === editPlan.id) setSelectedPlan(p => p ? { ...p, name: editValues.name, base, dates: editValues.dates, rooms } : null);
    setEditPlan(null);
    add({ type: "success", title: "Rate plan updated", body: editValues.name });
  };
  const doCreate = () => {
    if (!createValues.name.trim() || !createValues.base) {
      add({ type: "warning", title: "Plan name and base rate are required" }); return;
    }
    const newId = `RP-${String(plans.length + 1).padStart(3, "0")}`;
    const rooms = createValues.rooms.length > 0 ? createValues.rooms : ["Standard"];
    setPlans(prev => [...prev, { id: newId, name: createValues.name.trim(), base: Number(createValues.base), dates: createValues.dates || "Year-round", active: true, rooms } as typeof RATE_PLANS[0]]);
    add({ type: "success", title: "Rate plan created", body: `${createValues.name} · ${rooms.join(", ")}` });
    setShowCreate(false);
    setCreateValues({ name: "", base: "", dates: "Year-round", rooms: ["Standard", "Deluxe", "Suite"] });
  };
  const doDelete = (id: string) => {
    const plan = plans.find(r => r.id === id);
    setPlans(prev => prev.filter(r => r.id !== id));
    if (selectedPlan?.id === id) setSelectedPlan(null);
    setShowDeleteConfirm(false);
    add({ type: "warning", title: `${plan?.name} deleted` });
  };
  const toggleActive = (id: string) => {
    const plan = plans.find(r => r.id === id);
    setPlans(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r));
    add({ type: plan?.active ? "warning" : "success", title: `${plan?.name} ${plan?.active ? "deactivated" : "activated"}` });
  };
  return (
    <div>
      <PageHeader title="Rate Management" sub="Rate plans, seasonal pricing, and per-room-type rates"
        actions={<BtnP label="Create Rate Plan" icon={Plus} onClick={() => setShowCreate(true)} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Plans" value={String(plans.filter(r=>r.active).length)} sub="Published" icon={DollarSign} accent={SUCCESS} />
        <StatCard label="Inactive" value={String(plans.filter(r=>!r.active).length)} sub="Disabled or seasonal" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Total Plans" value={String(plans.length)} sub="All categories" icon={Layers} accent={PRIMARY} />
        <StatCard label="Avg Base Rate" value={`₦${Math.round(plans.filter(r=>r.active).reduce((s,r)=>s+r.base,0)/Math.max(1,plans.filter(r=>r.active).length)).toLocaleString()}`} sub="Active plans" icon={TrendingUp} accent={TEAL} />
      </div>
      <div className="flex gap-5">
        {/* Plan list */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB", borderBottom:`2px solid ${BORDER}` }}>
              {["Plan ID","Rate Plan Name","Room Types","Base Rate","Dates","Active",""].map((h,i)=>(
                <th key={i} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{plans.map((r,i)=>(
              <tr key={r.id} onClick={()=>{ setSelectedPlan(r); setShowDeleteConfirm(false); }} className="border-t cursor-pointer transition-colors"
                style={{ borderColor:"#F4F4F5", backgroundColor: selectedPlan?.id===r.id ? "#EFF6FF" : i%2===0 ? "white" : "#FAFBFD" }}>
                <td className="px-4 py-3.5 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
                <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: selectedPlan?.id===r.id ? PRIMARY : TEXT }}>{r.name}</td>
                <td className="px-4 py-3.5"><div className="flex gap-1 flex-wrap">{r.rooms.map(rt=>(
                  <span key={rt} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#EFF6FF",color:PRIMARY }}>{rt}</span>
                ))}</div></td>
                <td className="px-4 py-3.5 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{r.base.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: MUTED }}>{r.dates}</td>
                <td className="px-4 py-3.5" onClick={e=>{ e.stopPropagation(); toggleActive(r.id); }}>
                  <button className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: r.active ? TEAL : "#CBD5E1" }}>
                    <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: r.active ? 22 : 2 }} />
                  </button>
                </td>
                <td className="px-4 py-3.5" onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>openEdit(r)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Edit</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {/* Detail panel */}
        {selectedPlan && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="text-sm font-bold" style={{ color: TEXT }}>{selectedPlan.name}</h3>
                <div className="text-xs mt-0.5" style={{ color: MUTED, fontFamily: mono }}>{selectedPlan.id}</div></div>
              <button onClick={()=>{ setSelectedPlan(null); setShowDeleteConfirm(false); }} className="text-xs p-1 rounded" style={{ color: MUTED }}><X size={14}/></button>
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Plan Details</div>
              {[["Applicable Dates",selectedPlan.dates],["Status",selectedPlan.active ? "Active" : "Inactive"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Per Room-Type Rate Table</div>
              <div className="space-y-2">
                {(["Standard","Deluxe","Suite"] as (keyof typeof ROOM_TYPE_MULTIPLIERS)[]).map(rt=>{
                  const applies = selectedPlan.rooms.includes(rt);
                  const rtRate = Math.round(selectedPlan.base * ROOM_TYPE_MULTIPLIERS[rt]);
                  return (
                    <div key={rt} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: applies ? "#F0F4F8" : "#FAFBFD", opacity: applies ? 1 : 0.4 }}>
                      <div><div className="text-xs font-semibold" style={{ color: TEXT }}>{rt} Room</div>
                        <div className="text-xs" style={{ color: MUTED }}>{applies ? "Rate applies" : "Not included"}</div></div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: applies ? PRIMARY : MUTED, fontFamily: mono }}>₦{rtRate.toLocaleString()}</div>
                        <div className="text-xs" style={{ color: MUTED }}>per night</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>With VAT (7.5%)</div>
              {(["Standard","Deluxe","Suite"] as (keyof typeof ROOM_TYPE_MULTIPLIERS)[]).filter(rt=>selectedPlan.rooms.includes(rt)).map(rt=>{
                const rtRate = Math.round(selectedPlan.base * ROOM_TYPE_MULTIPLIERS[rt]);
                return (
                  <div key={rt} className="flex justify-between text-xs mb-1">
                    <span style={{ color: MUTED }}>{rt}</span>
                    <span style={{ color: TEXT, fontFamily: mono }}>₦{Math.round(rtRate*1.075).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mb-3">
              <button onClick={()=>openEdit(selectedPlan)} className="flex-1 py-2 rounded-xl text-sm font-semibold border" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Edit Plan</button>
              <button onClick={()=>{ toggleActive(selectedPlan.id); setSelectedPlan(p=>p?{...p,active:!p.active}:null); }} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: selectedPlan.active ? "#FFF1F2" : "#F0FDF4", color: selectedPlan.active ? ERROR : SUCCESS }}>
                {selectedPlan.active ? "Deactivate" : "Activate"}
              </button>
            </div>
            {showDeleteConfirm ? (
              <div className="p-3 rounded-xl space-y-3" style={{ backgroundColor: "#FEF2F2", border: `1.5px solid ${ERROR}30` }}>
                <p className="text-xs font-bold" style={{ color: ERROR }}>Delete "{selectedPlan.name}"?</p>
                <p className="text-xs" style={{ color: MUTED }}>This removes the plan permanently and cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={() => doDelete(selectedPlan.id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: ERROR }}>Yes, Delete</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-1.5 rounded-lg text-xs font-bold border" style={{ color: MUTED, borderColor: BORDER }}>Keep</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2 rounded-xl text-xs font-bold"
                style={{ border: `1.5px solid ${ERROR}20`, color: ERROR, backgroundColor: "#FEF2F2" }}>
                Delete Plan
              </button>
            )}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editPlan && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setEditPlan(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Edit Rate Plan</h3>
            <p className="text-xs mb-5" style={{ color: MUTED }}>Changes apply to new bookings only — existing reservations unaffected.</p>
            <div className="space-y-4">
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Plan Name</label>
                <input value={editValues.name} onChange={e=>setEditValues(p=>({...p,name:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Base Rate — Standard Room (₦/night)</label>
                <input type="number" value={editValues.base} onChange={e=>setEditValues(p=>({...p,base:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Applicable Dates</label>
                <input value={editValues.dates} onChange={e=>setEditValues(p=>({...p,dates:e.target.value}))} placeholder="e.g. Year-round, Dec 20 – Jan 5" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Room Types</label>
                <div className="flex gap-2">
                  {ROOM_CATEGORIES.map(rt => {
                    const checked = editValues.rooms.includes(rt);
                    return (
                      <button key={rt} onClick={() => setEditValues(p => ({ ...p, rooms: checked ? p.rooms.filter(r => r !== rt) : [...p.rooms, rt] }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
                        style={{ borderColor: checked ? PRIMARY : BORDER, backgroundColor: checked ? "#EFF6FF" : "white", color: checked ? PRIMARY : MUTED }}>
                        {rt}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor:"#FFFBEB", border:"1px solid #FDE68A", color:"#92400E" }}>
                ⚠ Deluxe and Suite rates are calculated as multipliers of the Standard base rate.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setEditPlan(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save Changes</button>
            </div>
          </div>
        </>
      )}
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" style={{ border:`1.5px solid ${BORDER}` }}>
            {/* Header band */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: PRIMARY }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity:0.6 }}>Rate Plans</p>
                <p className="text-base font-bold text-white mt-0.5">Create Rate Plan</p>
              </div>
              <button onClick={()=>setShowCreate(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:"rgba(255,255,255,0.18)" }}>
                <X size={16} color="white" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: MUTED }}>Plan Name <span style={{ color: ERROR }}>*</span></label>
                <input value={createValues.name} onChange={e=>updC("name", e.target.value)} placeholder="e.g. Early Bird Discount"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: MUTED }}>Base Rate — Standard Room (₦/night) <span style={{ color: ERROR }}>*</span></label>
                <input type="number" value={createValues.base} onChange={e=>updC("base", e.target.value)} placeholder="e.g. 42000"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white", fontFamily: mono }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: MUTED }}>Applicable Dates</label>
                <input value={createValues.dates} onChange={e=>updC("dates", e.target.value)} placeholder="e.g. Dec 20 – Jan 5"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: MUTED }}>Room Types</label>
                <div className="flex gap-2">
                  {ROOM_CATEGORIES.map(rt => {
                    const checked = createValues.rooms.includes(rt);
                    return (
                      <button key={rt} onClick={() => setCreateValues(p => ({ ...p, rooms: checked ? p.rooms.filter(r => r !== rt) : [...p.rooms, rt] }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
                        style={{ borderColor: checked ? PRIMARY : BORDER, backgroundColor: checked ? `${PRIMARY}10` : "white", color: checked ? PRIMARY : MUTED }}>
                        {rt}
                      </button>
                    );
                  })}
                </div>
              </div>
              {createValues.base && Number(createValues.base) > 0 && (
                <div className="p-3 rounded-xl" style={{ backgroundColor: "#F0FDF4", border: `1px solid ${SUCCESS}30` }}>
                  <p className="text-xs font-bold mb-1" style={{ color: SUCCESS }}>Rate Preview</p>
                  {ROOM_CATEGORIES.filter(rt => createValues.rooms.includes(rt)).map(rt => (
                    <div key={rt} className="flex justify-between text-xs">
                      <span style={{ color: MUTED }}>{rt}</span>
                      <span style={{ color: TEXT, fontFamily: mono }}>₦{Math.round(Number(createValues.base) * ROOM_TYPE_MULTIPLIERS[rt as keyof typeof ROOM_TYPE_MULTIPLIERS]).toLocaleString()}/nt</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={doCreate} className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY }}>
                <Plus size={15} />Create Plan
              </button>
              <button onClick={()=>setShowCreate(false)} className="px-5 py-3 rounded-xl text-sm font-bold" style={{ border:`1.5px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// R-08 Cancellation & Refund
export function CancellationRefund({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [lookupQ,      setLookupQ]      = useState("BK-2840");
  const [selectedRes,  setSelectedRes]  = useState(ALL_RES[6]);
  const [waived,       setWaived]       = useState(false);
  const [waiverReason, setWaiverReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [approver,     setApprover]     = useState("Grace Mensah");
  const [refundMethod, setRefundMethod] = useState("Original Method");
  const [refundNote,   setRefundNote]   = useState("");
  const [step,         setStep]         = useState<"form"|"refund"|"done">("form");
  const [cancRef,      setCancRef]      = useState("");

  const CANCEL_REASONS: { label: string; icon: React.ElementType; sub: string }[] = [
    { label: "Guest Request",      icon: User,           sub: "Guest initiated"          },
    { label: "OTA Cancellation",   icon: Globe,          sub: "Via booking platform"     },
    { label: "Medical / Emergency",icon: AlertCircle,    sub: "Compassionate waiver"     },
    { label: "Duplicate Booking",  icon: Copy,           sub: "Reservation error"        },
    { label: "Force Majeure",      icon: CloudLightning, sub: "Act of God / flight etc." },
    { label: "Other",              icon: MoreHorizontal, sub: "See notes"                },
  ];
  const cancFee  = 17500;
  const deposit  = 35000;
  const refund   = waived ? deposit : deposit - cancFee;

  // Days until check-in (using checkin string like "28 Jun 2026")
  const checkinDate = new Date(selectedRes.checkin + " 2026");
  const daysToCheckin = Math.ceil((checkinDate.getTime() - Date.now()) / 86400000);
  const withinWindow  = daysToCheckin <= 2;

  const lookupResult = ALL_RES.find(r =>
    r.id.toLowerCase().includes(lookupQ.toLowerCase()) ||
    r.guest.toLowerCase().includes(lookupQ.toLowerCase())
  );

  const AUDIT_HISTORY = [
    { ts:"22 Jun 14:03", action:"BK-2820 cancelled — fee ₦17,500 retained",             by:"Fatima Al-Hassan", type:"cancel" },
    { ts:"18 Jun 09:22", action:"BK-2801 cancelled — fee waived (medical emergency)",    by:"Grace Mensah",    type:"waived" },
    { ts:"15 Jun 11:00", action:"Refund ₦42,000 processed — Bank Transfer",              by:"Bola Adewale",    type:"refund" },
    { ts:"10 Jun 16:45", action:"BK-2778 cancelled — fee ₦17,500 retained",              by:"John Abubakar",   type:"cancel" },
  ];

  const doCancel = () => {
    if (!cancelReason) { add({ type:"warning", title:"Select a cancellation reason" }); return; }
    const ref = `CX-${Math.floor(10000 + Math.random() * 90000)}`;
    setCancRef(ref);
    add({ type:"warning", title:"Reservation cancelled", body:`${selectedRes.id} · ${ref}` });
    setStep("refund");
  };

  const doRefund = () => {
    add({ type:"success", title:"Refund processed", body:`₦${refund.toLocaleString()} → ${selectedRes.guest} via ${refundMethod}` });
    setStep("done");
  };

  const reset = () => {
    setStep("form"); setWaived(false); setWaiverReason(""); setCancelReason(""); setRefundNote(""); setCancRef("");
  };

  const kpi = [
    { label:"Cancellations",  value:"24",       sub:"This month",          color:ERROR,   icon:XCircle    },
    { label:"Total Refunded", value:"₦384,500", sub:"Returned to guests",  color:WARNING, icon:DollarSign },
    { label:"Fees Collected", value:"₦98,000",  sub:"Cancellation charges", color:SUCCESS, icon:TrendingUp },
  ];

  return (
    <div>
      <PageHeader title="Cancellation & Refund" sub="Process reservation cancellations with policy enforcement and refund tracking" />

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {kpi.map(k => {
          const KI = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border overflow-hidden flex" style={{ borderColor: BORDER }}>
              <div className="w-1 flex-shrink-0" style={{ backgroundColor: k.color }} />
              <div className="flex items-center gap-3 px-4 py-4 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${k.color}14` }}>
                  <KI size={18} style={{ color: k.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none mb-1" style={{ color: k.color, fontFamily: mono }}>{k.value}</p>
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{k.label}</p>
                  <p className="text-xs" style={{ color: SUBTLE }}>{k.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation lookup bar */}
      <div className="mb-4">
        <div className="flex items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
            <input value={lookupQ} onChange={e => setLookupQ(e.target.value)}
              placeholder="Reservation ID or guest name…"
              className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none bg-white"
              style={{ borderColor: BORDER }} />
          </div>
          <button onClick={() => {
            if (lookupResult) { setSelectedRes(lookupResult); reset(); }
            else add({ type:"warning", title:"No reservation found" });
          }} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}>
            Look Up
          </button>
        </div>
        {lookupResult && lookupResult.id !== selectedRes.id && (
          <div className="flex items-center gap-3 mt-2 p-3 rounded-xl border max-w-xl" style={{ backgroundColor:"#EFF6FF", borderColor:`${PRIMARY}25` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}18` }}>
              <User size={15} style={{ color: PRIMARY }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: TEXT }}>{lookupResult.guest}</p>
              <p className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{lookupResult.id} · {lookupResult.type} · {lookupResult.checkin}–{lookupResult.checkout}</p>
            </div>
            <button onClick={() => { setSelectedRes(lookupResult); reset(); }}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: PRIMARY }}>
              Select
            </button>
          </div>
        )}
      </div>

      {/* ── DONE OVERLAY ── */}
      {step === "done" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md shadow-2xl">
            {/* Hero */}
            <div className="px-8 py-8 text-center relative" style={{ backgroundColor: PRIMARY }}>
              <button onClick={reset}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <X size={14} color="white" />
              </button>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor:`${TEAL}30`, border:`2px solid ${TEAL}60` }}>
                <CheckCircle2 size={30} style={{ color: TEAL }} />
              </div>
              <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color:"rgba(255,255,255,0.5)" }}>Cancellation Complete</p>
              <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: mono }}>{cancRef}</p>
              <p className="text-sm" style={{ color:"rgba(255,255,255,0.65)" }}>{selectedRes.guest} · {selectedRes.id}</p>
            </div>
            {/* Body */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {([
                  ["Cancellation Ref", cancRef,                      mono     ],
                  ["Refund Amount",    `₦${refund.toLocaleString()}`, mono     ],
                  ["Refund Via",       refundMethod,                  undefined],
                ] as [string, string, string | undefined][]).map(([k, v, f]) => (
                  <div key={k} className="p-3 rounded-xl text-center" style={{ backgroundColor:"#F8FAFC" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: MUTED }}>{k}</p>
                    <p className="text-sm font-bold truncate" style={{ color: TEXT, fontFamily: f }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ backgroundColor:"#F0FDF4", border:`1px solid #BBF7D0` }}>
                <CheckCircle2 size={13} style={{ color: SUCCESS }} />
                <span className="text-xs font-medium" style={{ color: SUCCESS }}>Confirmation email sent · Refund queued for processing</span>
              </div>
              <button onClick={reset}
                className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: PRIMARY }}>
                <Plus size={14} />New Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN FORM (always visible; done overlay sits on top) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left — Cancellation form */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: step === "refund" ? `${SUCCESS}50` : BORDER }}>
            {/* Step header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b" style={{
              borderColor: BORDER,
              backgroundColor: step === "refund" ? "#F0FDF4" : "#F8FAFC"
            }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: step === "refund" ? SUCCESS : PRIMARY, color:"white" }}>
                {step === "refund" ? "✓" : "1"}
              </div>
              <p className="text-sm font-semibold" style={{ color: step === "refund" ? SUCCESS : TEXT }}>
                {step === "refund" ? "Cancellation confirmed" : "Cancel Reservation"}
              </p>
              {step === "refund" && <span className="text-xs ml-auto font-semibold" style={{ color: SUCCESS, fontFamily: mono }}>{cancRef}</span>}
            </div>

            <div className="p-5">
              {/* Reservation card */}
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor:"#F8FAFC", border:`1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${PRIMARY}14` }}>
                  <User size={18} style={{ color: PRIMARY }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: TEXT }}>{selectedRes.guest}</p>
                  <p className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{selectedRes.id} · {selectedRes.type} · {selectedRes.checkin}–{selectedRes.checkout}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold" style={{ color: withinWindow ? ERROR : SUCCESS }}>
                    {daysToCheckin > 0 ? `${daysToCheckin}d to check-in` : daysToCheckin === 0 ? "Today" : "Past"}
                  </p>
                  <p className="text-xs" style={{ color: withinWindow ? ERROR : SUCCESS }}>
                    {withinWindow ? "Fee applies" : "Free cancel"}
                  </p>
                </div>
              </div>

              {/* Policy banner */}
              <div className="border-l-4 p-3 rounded-r-xl mb-4" style={{ borderColor: withinWindow ? ERROR : SUCCESS, backgroundColor: withinWindow ? "#FEF2F2" : "#F0FDF4" }}>
                <p className="text-xs font-bold mb-1" style={{ color: withinWindow ? ERROR : SUCCESS }}>
                  {withinWindow ? "Within cancellation window — fee applies" : "Outside cancellation window — free cancellation"}
                </p>
                <ul className="text-xs space-y-0.5" style={{ color: withinWindow ? "#7F1D1D" : "#14532D" }}>
                  <li>• Free cancellation up to 48 hours before check-in</li>
                  <li>• Within 48 hours: ₦{cancFee.toLocaleString()} (50% first night)</li>
                  <li>• No-show: 100% of first night charged</li>
                </ul>
              </div>

              {/* Fee calculation */}
              <div className="space-y-2 text-sm mb-4 p-3 rounded-xl" style={{ backgroundColor:"#F8FAFC" }}>
                {([
                  ["Cancellation fee",  `₦${waived ? 0 : cancFee.toLocaleString()}`, waived ? MUTED : ERROR],
                  ["Deposit paid",      `₦${deposit.toLocaleString()}`,               TEXT  ],
                ] as [string, string, string][]).map(([k, v, c]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: MUTED }}>{k}</span>
                    <span className="font-semibold" style={{ color: c, fontFamily: mono, textDecoration: waived && k === "Cancellation fee" ? "line-through" : undefined }}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: BORDER }}>
                  <span style={{ color: TEXT }}>Refundable</span>
                  <span style={{ color: refund > 0 ? SUCCESS : ERROR, fontFamily: mono }}>₦{refund.toLocaleString()}</span>
                </div>
              </div>

              {/* Cancellation reason */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider block mb-2.5" style={{ color: MUTED }}>
                  Cancellation Reason <span style={{ color: ERROR }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CANCEL_REASONS.map(r => {
                    const selected = cancelReason === r.label;
                    const RIcon = r.icon;
                    return (
                      <button key={r.label} onClick={() => setCancelReason(r.label)}
                        className="flex items-start gap-3 px-4 py-3.5 border-2 text-left transition-all"
                        style={{
                          borderRadius: 10,
                          borderColor: selected ? PRIMARY : BORDER,
                          backgroundColor: selected ? "#EFF6FF" : "white",
                        }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: selected ? `${PRIMARY}18` : "#F1F5F9" }}>
                          <RIcon size={15} style={{ color: selected ? PRIMARY : MUTED }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight" style={{ color: selected ? PRIMARY : TEXT }}>{r.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: selected ? `${PRIMARY}99` : SUBTLE }}>{r.sub}</p>
                        </div>
                        {selected && (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ml-auto mt-0.5"
                            style={{ backgroundColor: PRIMARY }}>
                            <CheckCircle2 size={10} color="white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Waiver toggle */}
              <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-3" style={{ borderColor: waived ? WARNING : BORDER, backgroundColor: waived ? "#FFFBEB" : "white" }}>
                <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: waived ? WARNING : "#CBD5E1", backgroundColor: waived ? WARNING : "transparent" }}>
                  {waived && <CheckCircle2 size={10} color="white" />}
                </div>
                <input type="checkbox" className="hidden" checked={waived} onChange={e => setWaived(e.target.checked)} />
                <div>
                  <p className="text-sm font-medium" style={{ color: TEXT }}>Waive cancellation fee</p>
                  <p className="text-xs" style={{ color: MUTED }}>Manager authorisation required</p>
                </div>
              </label>

              {waived && (
                <div className="space-y-2 mb-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Waiver Reason</label>
                    <textarea value={waiverReason} onChange={e => setWaiverReason(e.target.value)} rows={2}
                      placeholder="e.g. Guest experienced medical emergency…"
                      className="w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Approving Manager</label>
                    <select value={approver} onChange={e => setApprover(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                      {["Grace Mensah","Bola Adewale","John Abubakar"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Action buttons — clear hierarchy, disabled when already done */}
              {step === "form" && (
                <button onClick={doCancel}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: ERROR }}>
                  <XCircle size={15} />Confirm Cancellation
                </button>
              )}
            </div>
          </div>

          {/* Right — Refund + Audit */}
          <div className="space-y-4">
            {/* Refund panel — locked until step = "refund" */}
            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: step === "refund" ? PRIMARY : BORDER }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: step === "refund" ? "#EFF6FF" : "#F8FAFC" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: step === "refund" ? PRIMARY : "#CBD5E1", color:"white" }}>2</div>
                <p className="text-sm font-semibold" style={{ color: step === "refund" ? PRIMARY : MUTED }}>Process Refund</p>
                {step === "form" && <span className="text-xs ml-auto" style={{ color: SUBTLE }}>Complete step 1 first</span>}
              </div>

              <div className={`p-5 transition-opacity ${step === "form" ? "opacity-40 pointer-events-none select-none" : ""}`}>
                {/* Refund summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ backgroundColor:`${SUCCESS}10`, border:`1px solid ${SUCCESS}30` }}>
                  <DollarSign size={16} style={{ color: SUCCESS }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: SUCCESS, fontFamily: mono }}>₦{refund.toLocaleString()} to refund</p>
                    <p className="text-xs" style={{ color: MUTED }}>Deposit ₦{deposit.toLocaleString()} · Fee {waived ? "waived" : `₦${cancFee.toLocaleString()} retained`}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2.5" style={{ color: MUTED }}>Refund Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { label: "Original Method", icon: CreditCard,  sub: "Card / transfer" },
                      { label: "Cash",             icon: DollarSign, sub: "Physical payout" },
                      { label: "Bank Transfer",    icon: Building2,  sub: "1–3 business days" },
                    ] as { label: string; icon: React.ElementType; sub: string }[]).map(m => {
                      const sel = refundMethod === m.label;
                      const MI = m.icon;
                      return (
                        <button key={m.label} onClick={() => setRefundMethod(m.label)}
                          className="flex flex-col items-start gap-2 px-3 py-3 border-2 text-left transition-all"
                          style={{ borderRadius: 10, borderColor: sel ? PRIMARY : BORDER, backgroundColor: sel ? "#EFF6FF" : "white" }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: sel ? `${PRIMARY}18` : "#F1F5F9" }}>
                            <MI size={13} style={{ color: sel ? PRIMARY : MUTED }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold leading-tight" style={{ color: sel ? PRIMARY : TEXT }}>{m.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: sel ? `${PRIMARY}80` : SUBTLE }}>{m.sub}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Refund Amount (₦)</label>
                  <input value={refund.toLocaleString()} readOnly
                    className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none font-bold"
                    style={{ borderColor: BORDER, fontFamily: mono, color: SUCCESS, backgroundColor:"#F0FDF4" }} />
                </div>

                <div className="mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Approving Manager</label>
                  <select value={approver} onChange={e => setApprover(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                    {["Grace Mensah","Bola Adewale","John Abubakar"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Note for Guest (optional)</label>
                  <textarea value={refundNote} onChange={e => setRefundNote(e.target.value)} rows={2}
                    placeholder="Message to include in refund notification…"
                    className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
                </div>

                <BtnP label="Process Refund" icon={DollarSign} onClick={doRefund} />
              </div>
            </div>

            {/* Audit trail */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Recent Cancellations</h3>
              <div className="space-y-3">
                {AUDIT_HISTORY.map(a => (
                  <div key={a.ts + a.by} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: a.type==="refund" ? "#EFF6FF" : a.type==="waived" ? "#FFFBEB" : "#FEF2F2" }}>
                      {a.type==="refund"
                        ? <DollarSign size={13} style={{ color: PRIMARY }} />
                        : a.type==="waived"
                        ? <AlertTriangle size={13} style={{ color: ORANGE }} />
                        : <XCircle size={13} style={{ color: ERROR }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: TEXT }}>{a.action}</p>
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}><span style={{ fontFamily: mono }}>{a.ts}</span> · {a.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}






// GuestRoomCharges, ProductsScreen, SuppliersScreen, StockTransactions, PurchaseOrders → InventoryProcurementScreens.tsx
export { GuestRoomCharges, ProductsScreen, SuppliersScreen, StockTransactions, PurchaseOrders } from "./InventoryProcurementScreens";

// RP-05 Inventory Reports
// InventoryReports → ReportsScreens.tsx
export { InventoryReports } from "./ReportsScreens";

// StaffReports → ReportsScreens.tsx
export { StaffReports } from "./ReportsScreens";

// DeviceManagement → ITAdminScreens.tsx
export { DeviceManagement } from "./ITAdminScreens";

// SyncSettings → MultibranchSettingsScreens.tsx
export { SyncSettings } from "./MultibranchSettingsScreens";

export function LeaveManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type LvStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
  type LvType = "Annual" | "Sick" | "Casual" | "Maternity" | "Paternity" | "Compassionate" | "Study";

  const LEAVE_REQUESTS = [
    { id:"LV-2025-001", staff:"John Abubakar",    dept:"Front Desk",    type:"Annual" as LvType,      from:"25 Oct", to:"31 Oct", days:7,  reason:"Family vacation",              status:"Pending" as LvStatus,  applied:"12 Oct", cover:"Mary Okonkwo", approver:"F. Ibrahim" },
    { id:"LV-2025-002", staff:"Amina Yusuf",      dept:"Housekeeping",  type:"Sick" as LvType,        from:"14 Oct", to:"15 Oct", days:2,  reason:"Doctor's appointment",         status:"Approved" as LvStatus, applied:"11 Oct", cover:"N/A",           approver:"K. Diallo"  },
    { id:"LV-2025-003", staff:"Chukwuemeka Obi",  dept:"Maintenance",   type:"Casual" as LvType,      from:"20 Oct", to:"20 Oct", days:1,  reason:"Personal errand",              status:"Approved" as LvStatus, applied:"10 Oct", cover:"Y. Danjuma",    approver:"A. Musa"    },
    { id:"LV-2025-004", staff:"Fatima Ibrahim",   dept:"Reservations",  type:"Annual" as LvType,      from:"01 Nov", to:"07 Nov", days:7,  reason:"Rest and recreation",          status:"Pending" as LvStatus,  applied:"13 Oct", cover:"N. Suleiman",   approver:"GM"         },
    { id:"LV-2025-005", staff:"Ngozi Eze",        dept:"F&B",           type:"Maternity" as LvType,   from:"01 Nov", to:"31 Jan", days:90, reason:"Maternity leave",              status:"Approved" as LvStatus, applied:"01 Oct", cover:"Relief staff",  approver:"HR"         },
    { id:"LV-2025-006", staff:"Ibrahim Suleiman", dept:"Security",      type:"Annual" as LvType,      from:"18 Oct", to:"22 Oct", days:5,  reason:"Travel",                       status:"Rejected" as LvStatus, applied:"09 Oct", cover:"B. Adamu",      approver:"A. Musa"    },
    { id:"LV-2025-007", staff:"Kemi Adeyemi",     dept:"Front Desk",    type:"Compassionate" as LvType,from:"15 Oct",to:"17 Oct", days:3,  reason:"Bereavement — close family",  status:"Approved" as LvStatus, applied:"15 Oct", cover:"N/A",           approver:"GM"         },
  ];

  const BALANCES: Record<string, Record<LvType, { total: number; used: number }>> = {
    "John Abubakar":    { Annual:{total:21,used:8},  Sick:{total:10,used:1},  Casual:{total:5,used:0},  Maternity:{total:0,used:0},  Paternity:{total:5,used:0},  Compassionate:{total:5,used:0},  Study:{total:5,used:0}  },
    "Fatima Ibrahim":   { Annual:{total:21,used:3},  Sick:{total:10,used:0},  Casual:{total:5,used:1},  Maternity:{total:0,used:0},  Paternity:{total:5,used:0},  Compassionate:{total:5,used:0},  Study:{total:5,used:0}  },
  };

  const TEAM_CALENDAR = [
    { staff:"John Abubakar",   dept:"Front Desk",  color:"#1BA39C", from:25, to:31 },
    { staff:"Fatima Ibrahim",  dept:"Reservations",color:"#123A73", from:32, to:38 },
    { staff:"Ngozi Eze",       dept:"F&B",         color:"#F57C00", from:32, to:90 },
  ];

  const STATUS_COLORS: Record<LvStatus, { bg: string; text: string }> = {
    Pending:   { bg:"#FEF3C7", text:"#92400E" },
    Approved:  { bg:"#DCFCE7", text:"#166534" },
    Rejected:  { bg:"#FEE2E2", text:"#991B1B" },
    Cancelled: { bg:"#F1F5F9", text:"#475569" },
  };

  const TYPE_COLORS: Record<LvType, string> = {
    Annual:"#1BA39C", Sick:"#F57C00", Casual:"#6366F1", Maternity:"#DB2777",
    Paternity:"#2563EB", Compassionate:"#D97706", Study:"#059669"
  };

  const [filter, setFilter]     = useState<"All"|LvStatus>("All");
  const [deptF, setDeptF]       = useState("All");
  const [selected, setSelected] = useState<typeof LEAVE_REQUESTS[number]|null>(null);
  const [tab, setTab]           = useState<"Requests"|"Calendar"|"Balances">("Requests");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject]   = useState(false);
  const [approvePin, setApprovePin]   = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [newReq, setNewReq]     = useState({ staff:"", type:"Annual" as LvType, from:"", to:"", reason:"", cover:"" });

  const depts = ["All",...Array.from(new Set(LEAVE_REQUESTS.map(r=>r.dept)))];
  const filtered = LEAVE_REQUESTS.filter(r=>(filter==="All"||r.status===filter)&&(deptF==="All"||r.dept===deptF));

  const pendingCount  = LEAVE_REQUESTS.filter(r=>r.status==="Pending").length;
  const approvedCount = LEAVE_REQUESTS.filter(r=>r.status==="Approved").length;

  const handleApprove = () => {
    if (approvePin!=="1234") { add({ type:"error", title:"Invalid Manager PIN" }); return; }
    add({ type:"success", title:`Leave ${selected?.id} approved` });
    setShowApprove(false); setApprovePin(""); setSelected(null);
  };

  const handleReject = () => {
    if (!rejectComment.trim()) { add({ type:"error", title:"Rejection comment required" }); return; }
    add({ type:"info", title:`Leave ${selected?.id} rejected` });
    setShowReject(false); setRejectComment(""); setSelected(null);
  };

  return (
    <div>
      <PageHeader title="Leave Management" sub="Track requests, approvals, and team coverage"
        actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Exporting leave report…"})} />
            <BtnP label="New Request" icon={Plus} onClick={()=>setShowNew(true)} />
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label:"Pending Approval", val:pendingCount,  color:WARNING },
          { label:"Approved (Oct)",   val:approvedCount, color:SUCCESS },
          { label:"On Leave Today",   val:2,             color:TEAL    },
          { label:"Leave Types",      val:7,             color:PRIMARY },
        ].map(k=>(
          <div key={k.label} className="bg-white rounded-xl border px-4 py-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
            <div className="text-xs mb-1" style={{ color:MUTED }}>{k.label}</div>
            <div className="text-2xl font-bold" style={{ color:k.color, fontFamily:mono }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor:BORDER }}>
        {(["Requests","Calendar","Balances"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-2.5 text-sm font-medium" style={{ color:tab===t?PRIMARY:MUTED, borderBottom:`2px solid ${tab===t?PRIMARY:"transparent"}` }}>{t}</button>
        ))}
      </div>

      {tab==="Requests" && (
        <div className="flex gap-5">
          <div className="flex-1">
            {/* filters */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <select value={deptF} onChange={e=>setDeptF(e.target.value)} className="px-3 py-2 rounded-xl border text-xs outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                {depts.map(d=><option key={d}>{d}</option>)}
              </select>
              {(["All","Pending","Approved","Rejected","Cancelled"] as const).map(s=>(
                <button key={s} onClick={()=>setFilter(s)} className="px-3 py-1.5 rounded-xl text-xs font-medium border" style={{ backgroundColor:filter===s?PRIMARY:"white", color:filter===s?"white":MUTED, borderColor:filter===s?PRIMARY:BORDER }}>{s}</button>
              ))}
            </div>
            <table className="w-full">
              <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["ID","Staff","Dept","Type","Dates","Days","Status",""].map((h,i)=><th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color:MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor:BORDER }} onClick={()=>setSelected(r)}>
                    <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:PRIMARY, fontFamily:mono }}>{r.id}</td>
                    <td className="px-3 py-2.5 text-xs font-medium" style={{ color:TEXT }}>{r.staff}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.dept}</td>
                    <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor:TYPE_COLORS[r.type] }}>{r.type}</span></td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:TEXT, fontFamily:mono }}>{r.from} – {r.to}</td>
                    <td className="px-3 py-2.5 text-xs font-bold text-center" style={{ color:TEXT }}>{r.days}</td>
                    <td className="px-3 py-2.5"><Badge label={r.status} colors={STATUS_COLORS[r.status]} /></td>
                    <td className="px-3 py-2.5"><ChevronRight size={14} style={{ color:SUBTLE }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0 && <EmptyState icon={CalendarDays} message="No leave requests match the current filters." />}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 bg-white rounded-xl border p-4 shrink-0 self-start sticky top-4" style={{ borderColor:BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <div><div className="text-sm font-bold" style={{ color:TEXT }}>{selected.staff}</div><div className="text-xs" style={{ color:MUTED }}>{selected.id}</div></div>
                <button onClick={()=>setSelected(null)}><X size={16} style={{ color:SUBTLE }} /></button>
              </div>
              <div className="space-y-2 text-xs mb-4">
                {([["Type",selected.type],["Department",selected.dept],["Applied On",selected.applied],["From",selected.from],["To",selected.to],["Duration",`${selected.days} day${selected.days>1?"s":""}`],["Coverage",selected.cover],["Approver",selected.approver]] as [string,string][]).map(([k,v])=>(
                  <div key={k} className="flex justify-between border-b py-1.5" style={{ borderColor:"#F4F4F5" }}>
                    <span style={{ color:MUTED }}>{k}</span><span className="font-medium" style={{ color:TEXT }}>{v}</span>
                  </div>
                ))}
                <div className="border-b py-1.5" style={{ borderColor:"#F4F4F5" }}>
                  <span style={{ color:MUTED }}>Reason</span>
                  <div className="mt-1 font-medium" style={{ color:TEXT }}>{selected.reason}</div>
                </div>
              </div>
              {selected.status==="Pending" && (
                <div className="flex gap-2">
                  <button onClick={()=>setShowReject(true)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border" style={{ color:ERROR, borderColor:`${ERROR}30` }}>Reject</button>
                  <button onClick={()=>setShowApprove(true)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor:SUCCESS }}>Approve</button>
                </div>
              )}
              {selected.status!=="Pending" && <Badge label={selected.status} colors={STATUS_COLORS[selected.status]} />}
            </div>
          )}
        </div>
      )}

      {tab==="Calendar" && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor:BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color:TEXT }}>Team Leave — October & November 2025</div>
          <div className="grid grid-cols-31 gap-0.5 mb-3 text-center" style={{ gridTemplateColumns:"180px repeat(31,1fr)" }}>
            <div />
            {Array.from({length:31},(_,i)=>(
              <div key={i} className="text-xs font-semibold py-1" style={{ color:MUTED }}>{i+1}</div>
            ))}
          </div>
          {TEAM_CALENDAR.map((tc,i)=>(
            <div key={i} className="grid gap-0.5 mb-2" style={{ gridTemplateColumns:"180px repeat(31,1fr)" }}>
              <div className="text-xs flex items-center gap-1.5" style={{ color:TEXT }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor:tc.color }} />
                {tc.staff}
              </div>
              {Array.from({length:31},(_,d)=>{
                const day = d+1;
                const on = day>=tc.from && day<=Math.min(tc.to,31);
                return <div key={d} className="h-5 rounded-sm" style={{ backgroundColor:on?tc.color+"40":"#F9FAFB" }} />;
              })}
            </div>
          ))}
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor:"#FEF3C7" }}>
            <div className="text-xs font-semibold" style={{ color:WARNING }}>Coverage Risk — 25–31 Oct</div>
            <div className="text-xs mt-1" style={{ color:TEXT }}>Front Desk will have 1 officer absent (John Abubakar). Ensure relief coverage is confirmed.</div>
          </div>
        </div>
      )}

      {tab==="Balances" && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor:BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color:TEXT }}>Leave Balance — Selected Staff</div>
          {Object.entries(BALANCES).map(([name,bal])=>(
            <div key={name} className="mb-6">
              <div className="text-sm font-bold mb-3" style={{ color:PRIMARY }}>{name}</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.entries(bal) as [LvType, {total:number;used:number}][]).map(([type,{total,used}])=>{
                  const remaining = total - used;
                  return (
                    <div key={type} className="px-3 py-3 rounded-xl border" style={{ borderColor:BORDER }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor:TYPE_COLORS[type] }} />
                        <span className="text-xs" style={{ color:MUTED }}>{type}</span>
                      </div>
                      <div className="text-xl font-bold mb-1" style={{ color:remaining>0?PRIMARY:ERROR, fontFamily:mono }}>{remaining}</div>
                      <div className="text-xs mb-2" style={{ color:SUBTLE }}>of {total} remaining</div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
                        <div className="h-full rounded-full" style={{ width:`${total>0?Math.round((remaining/total)*100):0}%`, backgroundColor:total>0?TYPE_COLORS[type]:SUBTLE }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve modal */}
      {showApprove && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowApprove(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-1" style={{ color:TEXT }}>Approve Leave — {selected?.id}</h3>
            <p className="text-xs mb-4" style={{ color:MUTED }}>Enter Manager PIN to approve {selected?.staff}'s {selected?.type} leave ({selected?.days} days).</p>
            <input type="password" maxLength={4} value={approvePin} onChange={e=>setApprovePin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest mb-4" style={{ borderColor:BORDER, fontFamily:mono }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>setShowApprove(false)} />
              <button onClick={handleApprove} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:SUCCESS }}>Approve</button>
            </div>
          </div>
        </>
      )}

      {/* Reject modal */}
      {showReject && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowReject(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-1" style={{ color:TEXT }}>Reject Leave — {selected?.id}</h3>
            <p className="text-xs mb-3" style={{ color:MUTED }}>Provide a reason for rejection. This will be communicated to the staff member.</p>
            <textarea value={rejectComment} onChange={e=>setRejectComment(e.target.value)} rows={3} placeholder="Reason for rejection…" className="w-full px-3 py-2.5 rounded-xl border text-xs outline-none resize-none mb-4" style={{ borderColor:BORDER, color:TEXT }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>setShowReject(false)} />
              <button onClick={handleReject} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:ERROR }}>Reject</button>
            </div>
          </div>
        </>
      )}

      {/* New Request modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-96" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-4" style={{ color:TEXT }}>New Leave Request</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Staff Name</label><input value={newReq.staff} onChange={e=>setNewReq(r=>({...r,staff:e.target.value}))} placeholder="Full name…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} /></div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Leave Type</label><select value={newReq.type} onChange={e=>setNewReq(r=>({...r,type:e.target.value as LvType}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>{(["Annual","Sick","Casual","Maternity","Paternity","Compassionate","Study"] as LvType[]).map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>From</label><input type="date" value={newReq.from} onChange={e=>setNewReq(r=>({...r,from:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} /></div>
                <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>To</label><input type="date" value={newReq.to} onChange={e=>setNewReq(r=>({...r,to:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} /></div>
              </div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Coverage Arrangement</label><input value={newReq.cover} onChange={e=>setNewReq(r=>({...r,cover:e.target.value}))} placeholder="Who will cover?" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} /></div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Reason</label><textarea value={newReq.reason} onChange={e=>setNewReq(r=>({...r,reason:e.target.value}))} rows={2} placeholder="Brief reason…" className="w-full px-3 py-2.5 rounded-xl border text-xs outline-none resize-none" style={{ borderColor:BORDER, color:TEXT }} /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <BtnO label="Cancel" onClick={()=>setShowNew(false)} />
              <button onClick={()=>{ add({ type:"success", title:"Leave request submitted" }); setShowNew(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:PRIMARY }}>Submit Request</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
