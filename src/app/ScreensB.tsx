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

import { Badge, EmptyState, ToastC, LiveClock, SyncPill, StatCard, PageHeader, BtnP, BtnO, Inp, Sel } from "./ScreensA";

// Local gender-coded avatar (mirrors ScreensA Av)
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
export function CheckInWizard({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [step, setStep] = useState(1);
  const [selRes, setSelRes] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [credType, setCredType] = useState<"card" | "pin" | "both">("both");
  const [encoded, setEncoded] = useState(false);
  const [pinGen, setPinGen] = useState(false);
  const STEPS = ["Select Reservation", "Verify Guest", "Assign Room", "Payment", "Receipt", "Confirm", "Room Access"];
  const arrivals = [
    { id: "BK-2849", guest: "Dr. Chukwuemeka Bello", room: "501", type: "Suite", checkin: "Today 14:00", nights: 3, rate: 85000, vip: true },
    { id: "BK-2850", guest: "Aisha Mohammed", room: "203", type: "Deluxe", checkin: "Today 12:00", nights: 2, rate: 55000, vip: false },
    { id: "BK-2851", guest: "Peter Okafor", room: "102", type: "Standard", checkin: "Today 15:30", nights: 1, rate: 35000, vip: false },
  ];
  const selData = arrivals.find(a => a.id === selRes);
  return (
    <div>
      <PageHeader title="Guest Check-In" sub="7-step check-in wizard" />
      <div className="bg-white rounded-xl border p-5 mb-4" style={{ borderColor: BORDER }}>
        <div className="flex items-center">{STEPS.map((s, i) => { const n = i + 1; const done = n < step; const active = n === step; return <div key={s} className="flex items-center flex-1"><div className="flex flex-col items-center flex-shrink-0"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: done ? SUCCESS : active ? PRIMARY : "#E4E4E7", color: done || active ? "white" : SUBTLE }}>{done ? <CheckCircle2 size={14} /> : n}</div><span className="text-xs mt-1 text-center w-16" style={{ color: active ? PRIMARY : done ? SUCCESS : SUBTLE, fontWeight: active ? 600 : 400 }}>{s}</span></div>{i < STEPS.length - 1 && <div className="flex-1 h-0.5 mx-1 mb-4" style={{ backgroundColor: done ? SUCCESS : "#E4E4E7" }} />}</div>; })}</div>
      </div>
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
        {step === 1 && <div><h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Select Reservation</h2><p className="text-sm mb-4" style={{ color: MUTED }}>Search or select from today's arrivals.</p><div className="relative mb-4"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search guest name or reservation ID…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div><div className="space-y-2">{arrivals.map(a => <div key={a.id} onClick={() => setSelRes(a.id)} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" style={{ borderColor: selRes === a.id ? PRIMARY : BORDER, backgroundColor: selRes === a.id ? "#EFF6FF" : "white" }}><div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{a.guest.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div className="flex-1"><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{ color: TEXT }}>{a.guest}</span>{a.vip && <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}><Star size={10} fill={ORANGE} />VIP</span>}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}><span style={{ fontFamily: mono }}>{a.id}</span> · Room {a.room} {a.type} · {a.checkin} · {a.nights}n</div></div><div className="text-right"><div className="text-sm font-bold" style={{ color: TEXT }}>{fmtN(a.rate * a.nights)}</div></div>{selRes === a.id && <CheckCircle2 size={20} style={{ color: PRIMARY }} />}</div>)}</div></div>}
        {step === 2 && selData && <div><h2 className="text-base font-semibold mb-4" style={{ color: TEXT }}>Verify Guest</h2>{selData.vip && <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ backgroundColor: "#FEF3C7", border: `1px solid #FDE68A` }}><Star size={16} fill={ORANGE} style={{ color: ORANGE }} /><span className="text-sm font-medium" style={{ color: "#92400E" }}>VIP Guest — Ensure Suite 501 is fully prepared. Champagne on arrival.</span></div>}<div className="grid grid-cols-2 gap-4 mb-4"><Inp label="Full Name" defaultValue={selData.guest} /><Inp label="Reservation ID" defaultValue={selData.id} /><Sel label="ID Type" options={["International Passport", "National ID Card", "Driver's License"]} /><Inp label="ID Number" placeholder="A1234567" /></div><div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: BORDER }}><FileText size={24} className="mx-auto mb-2" style={{ color: SUBTLE }} /><p className="text-sm" style={{ color: MUTED }}>Upload or scan ID document</p><button className="mt-3 px-4 py-2 rounded-lg text-xs font-medium border" style={{ color: PRIMARY, borderColor: PRIMARY }}>Choose File</button></div></div>}
        {step === 3 && <div><h2 className="text-base font-semibold mb-2" style={{ color: TEXT }}>Assign Room</h2><p className="text-sm mb-4" style={{ color: MUTED }}>Select from available rooms. Must be Clean or Inspected.</p><div className="grid grid-cols-3 gap-3">{ROOMS.filter(r => r.status === "Available").map(r => <div key={r.id} onClick={() => setSelRoom(r.id)} className="p-4 rounded-xl border-2 cursor-pointer transition-all" style={{ borderColor: selRoom === r.id ? PRIMARY : BORDER, backgroundColor: selRoom === r.id ? "#EFF6FF" : "white" }}><div className="flex items-center justify-between mb-1"><span className="text-lg font-bold" style={{ color: TEXT }}>{r.id}</span>{selRoom === r.id && <CheckCircle2 size={16} style={{ color: PRIMARY }} />}</div><div className="text-xs" style={{ color: MUTED }}>{r.type} · F{r.floor}</div><Badge label="Available" colors={{ bg: "#DCFCE7", text: "#166534" }} /></div>)}</div></div>}
        {step === 4 && selData && <div><h2 className="text-base font-semibold mb-4" style={{ color: TEXT }}>Collect Payment / Deposit</h2><div className="grid grid-cols-2 gap-6"><div><div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "#F9FAFB" }}><h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Charges</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span style={{ color: MUTED }}>Room × {selData.nights} nights</span><span>₦{(selData.rate * selData.nights).toLocaleString()}</span></div><div className="flex justify-between"><span style={{ color: MUTED }}>VAT (7.5%)</span><span>₦{Math.round(selData.rate * selData.nights * 0.075).toLocaleString()}</span></div><div className="pt-2 border-t flex justify-between font-bold" style={{ borderColor: BORDER, color: TEXT }}><span>Total</span><span>₦{Math.round(selData.rate * selData.nights * 1.075).toLocaleString()}</span></div></div></div><Inp label="Deposit Amount (₦)" defaultValue={selData.rate.toLocaleString()} /></div><div><label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Payment Method</label>{["Cash", "POS / Card", "Bank Transfer"].map(m => <label key={m} className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2" style={{ borderColor: payMethod === m ? PRIMARY : BORDER, backgroundColor: payMethod === m ? "#EFF6FF" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: payMethod === m ? PRIMARY : "#CBD5E1" }}>{payMethod === m && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY }} />}</div><input type="radio" className="hidden" checked={payMethod === m} onChange={() => setPayMethod(m)} /><span className="text-sm font-medium" style={{ color: TEXT }}>{m}</span></label>)}</div></div></div>}
        {step === 5 && <div className="text-center py-4"><CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: SUCCESS }} /><h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Receipt Generated</h2><p className="text-sm mb-5" style={{ color: MUTED }}>Payment received. Send receipt to guest.</p><div className="flex justify-center gap-3"><BtnO label="Print Receipt" icon={FileText} /><BtnO label="WhatsApp" icon={Send} /><BtnO label="Email" icon={Mail} /></div></div>}
        {step === 6 && <div className="text-center py-4"><div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#DCFCE7" }}><KeyRound size={32} style={{ color: SUCCESS }} /></div><h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Check-In Confirmed</h2><p className="text-sm mb-1" style={{ color: MUTED }}>Room {selRoom ?? "501"} is now Occupied. Folio opened.</p><p className="text-sm" style={{ color: TEAL }}>Proceeding to Room Access Activation…</p></div>}
        {step === 7 && <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Activate Room Access</h2>
          <p className="text-sm mb-4" style={{ color: MUTED }}>Issue credentials for Room {selRoom ?? "501"}.</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-sm" style={{ backgroundColor: "#DCFCE7", border: `1px solid #BBF7D0`, color: SUCCESS }}><Wifi size={14} /><span>Connected — TTLock API reachable</span></div>
          <div className="grid grid-cols-3 gap-3 mb-5">{(["card", "pin", "both"] as const).map(ct => <button key={ct} onClick={() => setCredType(ct)} className="p-4 rounded-xl border-2 text-center transition-all" style={{ borderColor: credType === ct ? PRIMARY : BORDER, backgroundColor: credType === ct ? "#EFF6FF" : "white" }}><div className="text-2xl mb-1">{ct === "card" ? "💳" : ct === "pin" ? "🔢" : "💳+🔢"}</div><div className="text-xs font-semibold" style={{ color: TEXT }}>{ct === "card" ? "Key Card" : ct === "pin" ? "PIN Code" : "Card + PIN"}</div></button>)}</div>
          {(credType === "card" || credType === "both") && <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER }}><div className="flex items-center gap-2 mb-3"><CreditCard size={16} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>Key Card Encoding</span></div><div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: SUCCESS }}><span className="w-2 h-2 rounded-full bg-green-500" />Encoder Connected (USB)</div>{!encoded ? <button onClick={() => { setEncoded(true); add({ type: "success", title: "Card encoded", body: `Room ${selRoom ?? "501"} · Valid until check-out` }); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: PRIMARY }}>Encode Card</button> : <div className="flex items-center gap-2 text-sm" style={{ color: SUCCESS }}><CheckCircle2 size={16} />Card 1 encoded · Serial XXXX-XXXX</div>}</div>}
          {(credType === "pin" || credType === "both") && <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER }}><div className="flex items-center gap-2 mb-3"><Hash size={16} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>PIN Code</span></div>{!pinGen ? <button onClick={() => { setPinGen(true); add({ type: "success", title: "PIN generated", body: "Show to guest now" }); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: PRIMARY }}>Generate PIN</button> : <div><div className="flex items-center gap-2 mb-3 text-sm" style={{ color: SUCCESS }}><CheckCircle2 size={16} />PIN generated and activated</div><div className="rounded-xl p-4 mb-2 text-center" style={{ backgroundColor: NAV_BG }}><div className="text-3xl font-bold tracking-[0.3em] text-white mb-1" style={{ fontFamily: mono }}>743812</div><div className="text-xs" style={{ color: SUBTLE }}>Valid until check-out</div></div><p className="text-xs mb-2" style={{ color: ERROR }}>⚠ Show to guest now. Cannot be retrieved after this screen.</p><div className="flex gap-2"><BtnO label="Copy PIN" icon={ClipboardList} /><BtnO label="Print" icon={FileText} /></div></div>}</div>}
          {(encoded || pinGen) && <div className="rounded-xl p-4" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}><div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Access Summary</div>{encoded && <div className="flex items-center gap-2 text-sm" style={{ color: SUCCESS }}><CheckCircle2 size={14} />Key Card ×1 — active</div>}{pinGen && <div className="flex items-center gap-2 text-sm mt-1" style={{ color: SUCCESS }}><CheckCircle2 size={14} />PIN Code — activated</div>}</div>}
        </div>}
        <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: "#F4F4F5" }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-40" style={{ borderColor: BORDER, color: MUTED }}><ChevronLeft size={15} />Back</button>
          {step < 7 ? <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !selRes} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{step === 6 ? "Proceed to Access" : "Continue"}<ChevronRight size={15} /></button>
            : <button onClick={() => { add({ type: "success", title: "Check-in complete!", body: `${selData?.guest ?? "Guest"} checked in` }); setStep(1); setSelRes(null); setSelRoom(null); setEncoded(false); setPinGen(false); }} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: SUCCESS }}><CheckCircle2 size={15} />Complete Check-In</button>}
        </div>
      </div>
    </div>
  );
}

export function BackupRestore({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [confirmText, setConfirmText] = useState("");
  const snaps = [{ ts: "24 Jun 2025 23:00", size: "4.2 GB", type: "Scheduled", loc: "Local + Cloud" }, { ts: "23 Jun 2025 23:00", size: "4.1 GB", type: "Scheduled", loc: "Local + Cloud" }, { ts: "23 Jun 2025 12:30", size: "4.0 GB", type: "Manual", loc: "Local" }];
  return (
    <div>
      <PageHeader title="Backup & Restore" sub="Local server data backups · Grand Palms Abuja" actions={<BtnP label="Back Up Now" icon={RefreshCw} onClick={() => add({ type: "success", title: "Backup started", body: "Full backup running in background" })} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Last Backup" value="2h ago" sub="All data backed up successfully" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Backup Size" value="142 MB" sub="Compressed archive" icon={Server} accent={PRIMARY} />
        <StatCard label="Retention Period" value="30 days" sub="Automatic purge after 30d" icon={Clock} accent={TEAL} />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Backup Settings</h3><Sel label="Frequency" options={["Every 6 hours", "Every 12 hours", "Daily at midnight"]} /><div className="mt-3 flex items-center justify-between py-2"><span className="text-sm" style={{ color: TEXT }}>Cloud backup enabled</span><div className="w-10 h-5 rounded-full" style={{ backgroundColor: TEAL }}><div className="w-4 h-4 bg-white rounded-full m-0.5 ml-5 shadow" /></div></div></div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Restore from Backup</h3><p className="text-xs mb-3" style={{ color: ERROR }}>⚠ Restore will overwrite all current data. This action cannot be undone.</p><Sel options={snaps.map(s => s.ts)} /><div className="mt-3"><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Type RESTORE to confirm</label><input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="RESTORE" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none mb-2 font-mono" style={{ borderColor: confirmText === "RESTORE" ? ERROR : BORDER }} /><button disabled={confirmText !== "RESTORE"} onClick={() => add({ type: "error", title: "Restore initiated", body: "Data restoration in progress" })} className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Restore Database</button></div></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Snapshot History</h3></div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Timestamp", "Size", "Type", "Location", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{snaps.map((s, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm" style={{ color: TEXT, fontFamily: mono }}>{s.ts}</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{s.size}</td><td className="px-5 py-3"><Badge label={s.type} colors={s.type === "Manual" ? { bg: "#EEF2FF", text: "#4338CA" } : { bg: "#DCFCE7", text: "#166534" }} /></td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{s.loc}</td><td className="px-5 py-3"><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Restore</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AuditLog() {
  const logs = [
    { ts: "09:42:11", user: "John Abubakar", role: "FD", action: "Check-In", module: "Front Desk", record: "BK-2847 · Room 304", ip: "192.168.1.22" },
    { ts: "09:31:05", user: "Fatima Al-Hassan", role: "RSV", action: "Reservation Created", module: "Reservations", record: "BK-2848", ip: "192.168.1.31" },
    { ts: "09:15:30", user: "John Abubakar", role: "FD", action: "Check-Out", module: "Front Desk", record: "BK-2845 · Room 212", ip: "192.168.1.22" },
    { ts: "09:00:00", user: "Grace Mensah", role: "MGT", action: "Announcement Posted", module: "Communications", record: "Fire Drill Notice", ip: "192.168.1.10" },
    { ts: "08:58:12", user: "System", role: "—", action: "Work Order Created", module: "Maintenance", record: "WO-0091", ip: "192.168.1.1" },
    { ts: "08:44:20", user: "John Abubakar", role: "FD", action: "Access Credential Issued", module: "Door Lock", record: "Room 421 · Card", ip: "192.168.1.22" },
  ];
  return (
    <div>
      <PageHeader title="Audit Log" sub="Append-only record of all system events · No delete capability" actions={<><BtnO label="Export CSV" icon={Download} /><BtnO label="Export PDF" icon={FileText} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}><div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search by user, module, or record…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-56" style={{ borderColor: BORDER }} /></div><Sel options={["All Modules", "Front Desk", "Reservations", "Door Lock", "Finance", "System"]} /><input type="date" className="px-3 py-1.5 text-xs rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }} defaultValue="2025-06-24" /></div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Timestamp", "User", "Role", "Action", "Module", "Record", "IP"].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{logs.map((l, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.ts}</td><td className="px-4 py-3 text-sm font-medium" style={{ color: TEXT }}>{l.user}</td><td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{l.role}</span></td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.action}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.module}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.record}</td><td className="px-4 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{l.ip}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function PlaceholderScreen({ title, desc, icon: Icon }: { title: string; desc: string; icon: React.ElementType }) {
  return <div><PageHeader title={title} /><div className="bg-white rounded-xl border" style={{ borderColor: BORDER }}><EmptyState icon={Icon} message={desc} cta={`Open ${title}`} /></div></div>;
}

// ─── Router ──────────────────────────────────────────────────────────────────
// ─── NEW SCREENS ─────────────────────────────────────────────────────────────


const DEPARTURES_DATA = [
  { room: "101", guest: "Adaeze Okonkwo", checkout: "11:00", balance: 0, lateFlag: false, nights: 3, av: "AO" },
  { room: "202", guest: "Emmanuel Adeyemi", checkout: "11:00", balance: 45000, lateFlag: false, nights: 2, av: "EA" },
  { room: "203", guest: "Fatima Musa", checkout: "12:00", balance: 0, lateFlag: true, nights: 3, av: "FM" },
  { room: "118", guest: "Tunde Lawal", checkout: "10:00", balance: 18500, lateFlag: false, nights: 1, av: "TL" },
];











const MENU_ALL = [
  { id: 1, name: "Jollof Rice + Chicken", price: 4500, cat: "Mains", avail: true },
  { id: 2, name: "Egusi Soup + Pounded Yam", price: 5200, cat: "Mains", avail: true },
  { id: 3, name: "Grilled Fish", price: 6800, cat: "Mains", avail: true },
  { id: 4, name: "Fried Plantain", price: 1500, cat: "Sides", avail: true },
  { id: 5, name: "Moi Moi", price: 1200, cat: "Sides", avail: false },
  { id: 6, name: "Chapman", price: 2000, cat: "Drinks", avail: true },
  { id: 7, name: "Zobo", price: 1000, cat: "Drinks", avail: true },
  { id: 8, name: "Chocolate Cake", price: 3500, cat: "Desserts", avail: true },
  { id: 9, name: "Suya", price: 3000, cat: "Starters", avail: true },
  { id: 10, name: "Spring Rolls (6pc)", price: 2800, cat: "Starters", avail: true },
];




export function ArrivalsScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [arSearch, setArSearch] = useState("");
  const [arTab, setArTab] = useState("All");
  const arFiltered = ARRIVALS_DATA.filter(a => {
    const ms = !arSearch || a.guest.toLowerCase().includes(arSearch.toLowerCase()) || a.id.includes(arSearch);
    const mt = arTab === "All" ? true : arTab === "VIP" ? a.vip : arTab === "Unassigned" ? !a.assigned : false;
    return ms && mt;
  });
  return (
    <div>
      <PageHeader title="Today's Arrivals" sub={`${ARRIVALS_DATA.length} expected · ${ARRIVALS_DATA.filter(a => a.vip).length} VIP · ${ARRIVALS_DATA.filter(a => !a.assigned).length} unassigned rooms`} actions={<><BtnO label="Print Manifest" icon={FileText} /><BtnP label="Quick Check-In" icon={KeyRound} onClick={() => nav && nav("check-in", "Check-In")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Arrivals" value={String(ARRIVALS_DATA.length)} sub="Expected today" icon={CalendarCheck} accent={PRIMARY} />
        <StatCard label="VIP Arrivals" value={String(ARRIVALS_DATA.filter(a => a.vip).length)} sub="Priority preparation" icon={Star} accent={ORANGE} />
        <StatCard label="Unassigned" value={String(ARRIVALS_DATA.filter(a => !a.assigned).length)} sub="Need room assignment" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Checked In" value="0" sub="Of today's arrivals" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={arSearch} onChange={e => setArSearch(e.target.value)} placeholder="Search guest or reservation…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Unassigned", "Arrived"].map(f => <button key={f} onClick={() => setArTab(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: arTab === f ? PRIMARY : "white", color: arTab === f ? "white" : MUTED, borderColor: arTab === f ? PRIMARY : BORDER }}>{f}</button>)}
        <span className="ml-auto text-xs font-medium" style={{ color: SUBTLE }}>{arFiltered.length} results</span>
      </div>
      <div className="grid gap-3">
        {arFiltered.map(a => (
          <div key={a.id} className="rounded-2xl border flex overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 10px rgba(13,27,46,0.06)" }}>
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: a.vip ? ORANGE : a.assigned ? PRIMARY : ERROR }} />
            <div className="flex-1 p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #1d4ed8)` }}>{a.av}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-bold" style={{ color: TEXT }}>{a.guest}</span>
                  {a.vip && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${ORANGE}18`, color: ORANGE }}><Star size={10} fill={ORANGE} />VIP</span>}
                  {!a.assigned && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${ERROR}15`, color: ERROR }}>Unassigned</span>}
                </div>
                <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: MUTED }}>
                  <span className="font-mono font-bold" style={{ color: PRIMARY }}>{a.id}</span>
                  <span>·</span><span>{a.type}</span>
                  <span>·</span><span>{a.nights} nights</span>
                  <span>·</span><span>ETA {a.eta}</span>
                  {a.requests && <><span>·</span><span className="italic truncate max-w-xs">{a.requests}</span></>}
                </div>
              </div>
              <div className="text-center px-3 hidden sm:block border-l" style={{ borderColor: BORDER }}>
                <div className="text-xs font-semibold mb-0.5" style={{ color: MUTED }}>Rate/night</div>
                <div className="text-base font-black" style={{ color: SUCCESS }}>₦{a.rate.toLocaleString()}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => nav ? nav("check-in", "Check-In") : add({ type: "success", title: "Check-in started", body: a.guest })} className="text-xs px-4 py-2 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: PRIMARY }}>Check In</button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4F4F5] transition-all" style={{ color: SUBTLE }}><MoreHorizontal size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {arFiltered.length === 0 && <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BORDER }}><CalendarCheck size={32} className="mx-auto mb-3" style={{ color: SUBTLE }} /><p className="text-sm font-medium" style={{ color: MUTED }}>No arrivals match your filters</p></div>}
      </div>
    </div>
  );
}

export function DeparturesScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const DEPARTURES_DATA = [
    { room: "101", guest: "Adaeze Okonkwo", checkout: "11:00", nights: 3, balance: 0, method: "Card", lateFlag: false },
    { room: "202", guest: "Emmanuel Adeyemi", checkout: "11:00", nights: 4, balance: 82100, method: "Cash", lateFlag: false },
    { room: "304", guest: "Chukwuemeka Obi", checkout: "14:00", nights: 2, balance: 0, method: "Transfer", lateFlag: true },
    { room: "501", guest: "Dr. Chukwuemeka Bello", checkout: "11:00", nights: 1, balance: 0, method: "Card", lateFlag: false },
    { room: "410", guest: "Fatima Al-Hassan", checkout: "12:00", nights: 5, balance: 35200, method: "Card", lateFlag: false },
  ];
  return (
    <div>
      <PageHeader title="Today's Departures" sub={`${DEPARTURES_DATA.length} check-outs expected · Deadline 11:00`} actions={<><BtnO label="Print List" icon={FileText} /><BtnP label="Bulk Check-Out" icon={ArrowRight} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Departures" value={String(DEPARTURES_DATA.length)} sub="Today's check-outs" icon={ArrowRight} accent={PRIMARY} />
        <StatCard label="Settled Folios" value={String(DEPARTURES_DATA.filter(d => d.balance === 0).length)} sub="Ready to leave" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Outstanding Balance" value={`₦${DEPARTURES_DATA.reduce((s, d) => s + d.balance, 0).toLocaleString()}`} sub="Must settle first" icon={DollarSign} accent={ERROR} />
        <StatCard label="Late Checkout" value={String(DEPARTURES_DATA.filter(d => d.lateFlag).length)} sub="Extended by request" icon={Clock} accent={WARNING} />
      </div>
      <div className="grid gap-3">
        {DEPARTURES_DATA.map(d => (
          <div key={d.room} className="rounded-2xl border flex overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 10px rgba(13,27,46,0.06)" }}>
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: d.balance > 0 ? ERROR : SUCCESS }} />
            <div className="flex-1 p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0 text-lg" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #1d4ed8)` }}>{d.room}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: TEXT }}>{d.guest}</span>
                  {d.lateFlag && <Badge label="Late Checkout" colors={{ bg: "#FEF3C7", text: "#92400E" }} />}
                </div>
                <div className="text-xs" style={{ color: MUTED }}>Checkout: <span className="font-mono font-semibold" style={{ color: TEXT }}>{d.checkout}</span></div>
              </div>
              <div className="text-center px-4 hidden sm:block border-l" style={{ borderColor: BORDER }}>
                {d.balance > 0 ? <div className="text-base font-black" style={{ color: ERROR }}>₦{d.balance.toLocaleString()}</div> : <div className="flex items-center gap-1 text-sm font-bold" style={{ color: SUCCESS }}><CheckCircle2 size={14} />Settled</div>}
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>Balance</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => nav ? nav("check-out", "Check-Out") : add({ type: "info", title: "Check-out initiated", body: `Room ${d.room} · ${d.guest}` })} className="text-xs px-4 py-2 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: TEAL }}>Check Out</button>
                <button className="text-xs px-3 py-2 rounded-xl border font-semibold transition-all" style={{ color: MUTED, borderColor: BORDER }}>Extend</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoomAccessMgmt({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [revokeRoom, setRevokeRoom] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  return (
    <div>
      <PageHeader title="Room Access Management" sub="All active access credentials across the property · Door Lock" actions={<BtnO label="Key Card Log" icon={ClipboardList} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Active Credentials" value="28" sub="Room access granted" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Revoked Today" value="3" sub="Access removed" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Master Access" value="2" sub="Full-property override" icon={Shield} accent={PRIMARY} />
      </div>
      <div className="space-y-3">
        {ACCESS_CREDS.map(r => (
          <div key={r.room} className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-4">
              <div><div className="flex items-center gap-3"><span className="text-xl font-bold" style={{ color: TEXT }}>Room {r.room}</span><Badge label={r.status} colors={{ bg: "#DCFCE7", text: "#166534" }} /></div><div className="text-sm mt-0.5" style={{ color: MUTED }}>{r.guest} · Valid until {r.validTo}</div></div>
              <button onClick={() => setRevokeRoom(r.room)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: ERROR }}><Lock size={14} />Revoke All</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ backgroundColor: "#F9FAFB" }}>
                <div className="flex items-center gap-2 mb-2"><CreditCard size={15} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>Key Cards ×{r.cards.length}</span></div>
                {r.cards.length === 0 ? <p className="text-xs" style={{ color: SUBTLE }}>No key cards issued</p> : r.cards.map((c, i) => <div key={i} className="flex items-center justify-between text-xs mb-1"><span style={{ color: MUTED, fontFamily: mono }}>{c.serial}</span><span style={{ color: SUBTLE }}>Issued {c.issued} by {c.by}</span></div>)}
                <button onClick={() => add({ type: "info", title: `Issue replacement card — Room ${r.room}` })} className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: TEAL }}><Plus size={11} />Issue Replacement Card</button>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: "#F9FAFB" }}>
                <div className="flex items-center gap-2 mb-2"><Hash size={15} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>PIN Code</span></div>
                {!r.pin ? <p className="text-xs" style={{ color: SUBTLE }}>No PIN issued</p> : <><div className="flex items-center justify-between text-xs mb-1"><span className="font-mono text-lg font-bold" style={{ color: TEXT, letterSpacing: "0.15em" }}>{r.pin.hint}</span><Badge label="Active" colors={{ bg: "#DCFCE7", text: "#166534" }} /></div><div className="text-xs" style={{ color: SUBTLE }}>Issued {r.pin.issued} by {r.pin.by}</div></>}
                <button onClick={() => add({ type: "info", title: `New PIN — Room ${r.room}` })} className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: TEAL }}><Plus size={11} />New PIN</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {revokeRoom && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h2 className="text-base font-bold mb-1" style={{ color: ERROR }}>🚨 Emergency Room Access Revocation</h2>
            <p className="text-sm mb-4" style={{ color: MUTED }}>Room {revokeRoom} — All active credentials will be deactivated immediately. Logged against your account.</p>
            <div className="space-y-2 mb-4">
              {["Security concern / suspected theft", "Guest dispute", "Incorrect room assigned", "Other"].map(r => <label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: revokeReason === r ? ERROR : BORDER, backgroundColor: revokeReason === r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: revokeReason === r ? ERROR : "#CBD5E1" }}>{revokeReason === r && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />}</div><input type="radio" className="hidden" onChange={() => setRevokeReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}
            </div>
            <p className="text-xs mb-4" style={{ color: ERROR }}>⚠ This action cannot be undone. All key cards and PINs will stop working immediately.</p>
            <div className="flex gap-3"><button onClick={() => setRevokeRoom(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button><button onClick={() => { add({ type: "error", title: `Emergency revoke — Room ${revokeRoom}`, body: "All credentials deactivated. Notification sent to all staff." }); setRevokeRoom(null); setRevokeReason(""); }} disabled={!revokeReason} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm Emergency Revoke</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function KeyCardLog() {
  const evtC: Record<string, { bg: string; text: string }> = {
    "Issued": { bg: "#CCFBF1", text: "#0F766E" }, "PIN Issued": { bg: "#CCFBF1", text: "#0F766E" },
    "Duplicate Issued": { bg: "#DBEAFE", text: "#1E40AF" }, "Revoked — Checkout": { bg: "#F3F4F6", text: "#374151" },
    "Encode Failed": { bg: "#FEE2E2", text: "#991B1B" }, "Queued Offline": { bg: "#FEF3C7", text: "#92400E" },
  };
  return (
    <div>
      <PageHeader title="Key Card Log" sub="Append-only audit trail of every access credential event" actions={<><BtnO label="Export CSV" icon={Download} /><BtnO label="Export PDF" icon={FileText} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search room, guest, or staff…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          <Sel options={["All Events", "Issued", "Revoked", "Failed", "Queued Offline"]} />
          <input type="date" defaultValue="2025-06-24" className="px-3 py-1.5 text-xs rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }} />
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Timestamp", "Event Type", "Room", "Guest", "Credential", "Reference", "Staff", "API Response"].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{KEY_LOG.map((l, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.ts}</td><td className="px-4 py-3"><Badge label={l.event} colors={evtC[l.event] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{l.room}</td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.guest}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.type}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.ref}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.staff}</td><td className="px-4 py-3 text-xs" style={{ color: l.apiResp.startsWith("error") || l.apiResp.startsWith("queued") ? (l.apiResp.startsWith("error") ? ERROR : WARNING) : SUCCESS, fontFamily: mono }}>{l.apiResp}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function PINManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [showPIN, setShowPIN] = useState<string | null>(null);
  const pinStC: Record<string, { bg: string; text: string }> = {
    "Active": { bg: "#DCFCE7", text: "#166534" }, "Expiring": { bg: "#FEF3C7", text: "#92400E" }, "Expired": { bg: "#F3F4F6", text: "#374151" },
  };
  return (
    <div>
      <PageHeader title="PIN Management" sub="All active PINs across the property · Door Lock" actions={<BtnO label="Key Card Log" icon={ClipboardList} />} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest", "PIN (masked)", "Valid From", "Valid To", "Status", "Issued By", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{ACTIVE_PINS.map(p => (
            <tr key={p.room} className="border-t hover:bg-[#F9FAFB] transition-colors group" style={{ borderColor: "#F4F4F5" }}>
              <td className="px-5 py-3 font-bold text-lg" style={{ color: PRIMARY }}>{p.room}</td>
              <td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{p.guest}</td>
              <td className="px-5 py-3"><div className="flex items-center gap-2"><span className="text-lg font-bold" style={{ fontFamily: mono, color: TEXT, letterSpacing: "0.15em" }}>{showPIN === p.room ? "74 38 12" : p.hint}</span><button onClick={() => setShowPIN(showPIN === p.room ? null : p.room)} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>{showPIN === p.room ? "Hide" : "Reveal"}</button></div></td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.validFrom}</td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.validTo}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2"><Badge label={p.status} colors={pinStC[p.status] ?? { bg: "#F4F4F5", text: "#374151" }} />{p.status === "Expiring" && <span className="text-xs" style={{ color: WARNING }}>⚠ 2h left</span>}</div>
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.by}</td>
              <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `New PIN issued — Room ${p.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: TEAL, borderColor: `${TEAL}30` }}>New PIN</button><button onClick={() => add({ type: "warning", title: `PIN revoked — Room ${p.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Revoke</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function ShiftHandover({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const sections = ["Outstanding Tasks", "VIP Guests In-House", "Maintenance Issues Open", "Guest Complaints in Progress", "Pending Payments", "General Notes"];
  const defaults = [
    "Room 304 late checkout approved until 14:00. Inform Housekeeping.",
    "Dr. Chukwuemeka Bello (Suite 501) — VIP arrival expected 18:30. Champagne and fruit basket pre-positioned.",
    "AC unit in Room 316 (WO-0090) — Emeka working on it. SLA breached. Escalate if not resolved by 14:00.",
    "Room 310 guest complained about noise from Room 311. Spoken to both parties. Monitor.",
    "Emmanuel Adeyemi (Room 202) — ₦45,000 outstanding. Collect before departure or upon check-out.",
    "Housekeeping is short-staffed today — Chidi on leave. Rooms may run 30 min behind schedule.",
  ];
  return (
    <div>
      <PageHeader title="Shift Handover" sub="Morning Shift → Evening Shift · 24 Jun 2025 15:00" />
      {submitted ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BORDER }}>
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: SUCCESS }} />
          <h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Handover Submitted</h2>
          <p className="text-sm mb-4" style={{ color: MUTED }}>Awaiting acknowledgement from Evening Shift leader.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: "#FFFBEB", border: `1px solid #FDE68A` }}><Clock size={14} style={{ color: WARNING }} /><span className="text-sm font-medium" style={{ color: "#92400E" }}>Pending acknowledgement</span></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {sections.map((s, i) => (
              <div key={s} className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: TEXT }}>{s}</h3>
                <textarea defaultValue={defaults[i]} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" rows={3} style={{ borderColor: BORDER, color: TEXT }} />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => { setSubmitted(true); add({ type: "success", title: "Shift handover submitted", body: "Evening shift notified" }); }} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}><CheckCircle2 size={16} />Submit Handover</button>
              <BtnO label="Save Draft" />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Shift Details</h3>
              {[["Outgoing Shift", "Morning · 07:00–15:00"], ["Outgoing Lead", "Grace Mensah"], ["Incoming Shift", "Evening · 15:00–23:00"], ["Incoming Lead", "David Okafor"], ["Date", "24 Jun 2025"], ["Time", "14:48"]].map(([k, v]) => <div key={k} className="flex justify-between text-sm mb-2"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>)}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F4F4F5" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Previous Handovers</div>
                {["Yesterday 15:00", "Yesterday 23:00", "23 Jun 07:00"].map(t => <button key={t} className="w-full flex items-center justify-between py-1.5 text-xs hover:text-[#18181B]" style={{ color: MUTED }}><span>{t}</span><Eye size={12} /></button>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuestMessaging({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [active, setActive] = useState("Adaeze Okonkwo");
  const [msg, setMsg] = useState("");
  const convos: Record<string, { room: string; msgs: Array<{ text: string; from: string; time: string }> }> = {
    "Adaeze Okonkwo": { room: "101", msgs: [{ text: "Hello, could I get extra towels in my room please?", from: "guest", time: "09:12" }, { text: "Of course! I'll have housekeeping bring them up right away.", from: "staff", time: "09:14" }, { text: "Thank you so much! 😊", from: "guest", time: "09:15" }] },
    "Emmanuel Adeyemi": { room: "202", msgs: [{ text: "What time does the restaurant open for dinner?", from: "guest", time: "08:45" }, { text: "The restaurant opens for dinner at 18:00. Would you like a reservation?", from: "staff", time: "08:47" }] },
    "Dr. Chukwuemeka Bello": { room: "501", msgs: [{ text: "I'll be arriving at approximately 18:30. Please ensure the champagne is ready.", from: "guest", time: "11:00" }, { text: "Absolutely, Doctor. Suite 501 is fully prepared. We look forward to welcoming you!", from: "staff", time: "11:03" }] },
  };
  const current = convos[active] ?? { room: "—", msgs: [] };
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active]);
  return (
    <div>
      <PageHeader title="Guest Messaging" sub="Message in-house guests via WhatsApp, SMS, or internal portal" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Total Threads" value="12" sub="Active conversations" icon={MessageSquare} accent={PRIMARY} />
        <StatCard label="Unread" value="4" sub="Pending reply" icon={AlertCircle} accent={ERROR} />
        <StatCard label="Resolved Today" value="8" sub="Guest issues closed" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="bg-white rounded-xl border flex overflow-hidden" style={{ borderColor: BORDER, height: 560 }}>
        <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}><div className="relative"><Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search guests…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-full" style={{ borderColor: BORDER }} /></div></div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {Object.entries(convos).map(([name, c]) => <button key={name} onClick={() => setActive(name)} className="w-full flex items-center gap-3 px-4 py-3 text-left border-b hover:bg-[#F4F4F5] transition-colors" style={{ borderColor: "#F9FAFB", backgroundColor: active === name ? "#EFF6FF" : "transparent", borderLeft: active === name ? `3px solid ${PRIMARY}` : "3px solid transparent" }}><div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div className="min-w-0"><div className="text-xs font-semibold truncate" style={{ color: TEXT }}>{name}</div><div className="text-xs" style={{ color: SUBTLE }}>Room {c.room}</div></div></button>)}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div><div className="text-sm font-semibold" style={{ color: TEXT }}>{active}</div><div className="text-xs" style={{ color: SUBTLE }}>Room {current.room} · via WhatsApp</div></div>
            <div className="flex gap-2 text-xs" style={{ color: MUTED }}><button className="flex items-center gap-1 px-2 py-1 rounded border hover:bg-white" style={{ borderColor: BORDER }}><Phone size={11} />Call</button></div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
            {current.msgs.map((m, i) => <div key={i} className={`flex ${m.from === "staff" ? "justify-end" : "justify-start"}`}><div className="max-w-xs"><div className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: m.from === "staff" ? PRIMARY : "#F4F4F5", color: m.from === "staff" ? "white" : TEXT }}>{m.text}</div><div className="text-xs mt-1" style={{ color: SUBTLE, textAlign: m.from === "staff" ? "right" : "left", fontFamily: mono }}>{m.time}</div></div></div>)}
            <div ref={endRef} />
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3"><input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && msg.trim() && (add({ type: "success", title: "Message sent" }), setMsg(""))} placeholder="Type a message…" className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }} /><button onClick={() => { if (msg.trim()) { add({ type: "success", title: "Message sent" }); setMsg(""); } }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: PRIMARY }}><Send size={16} /></button></div>
            <div className="flex gap-2 mt-2">{["WhatsApp", "SMS", "In-App"].map(c => <button key={c} className="text-xs px-2 py-1 rounded border" style={{ color: c === "WhatsApp" ? SUCCESS : MUTED, borderColor: c === "WhatsApp" ? `${SUCCESS}50` : BORDER }}>{c}</button>)}</div>
          </div>
        </div>
      </div>

      {/* Post to Room Folio Modal */}
      {showRoomPost && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowRoomPost(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: "1px solid #E4E4E7" }}>
            <h3 className="text-base font-bold mb-1" style={{ color: "#18181B", fontFamily: "'Inter', system-ui, sans-serif" }}>Post to Room Folio</h3>
            <p className="text-xs mb-4" style={{ color: "#71717A" }}>Charges will be added to the selected guest's folio and settled at check-out.</p>
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "#71717A" }}>Select Room / Guest</label>
              <div className="space-y-2">
                {IN_HOUSE.map(g => (
                  <button key={g.room} onClick={() => setSelectedRoom(g.room)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: selectedRoom === g.room ? "#18181B" : "#E4E4E7", backgroundColor: selectedRoom === g.room ? "#EFF6FF" : "white" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#18181B" }}>
                      {g.guest.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#18181B" }}>{g.guest}</div>
                      <div className="text-xs" style={{ color: "#71717A" }}>Room {g.room} · Checkout {g.checkout}</div>
                    </div>
                    {selectedRoom === g.room && <CheckCircle2 size={16} style={{ color: "#18181B" }} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E4E4E7" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#18181B" }}>Order Summary</div>
              <div className="text-xs" style={{ color: "#71717A" }}>{order.reduce((s, o) => s + o.qty, 0)} items · Total ₦{(order.reduce((s, o) => s + o.price * o.qty, 0) * 1.075).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} incl. VAT</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRoomPost(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: "#71717A", borderColor: "#E4E4E7" }}>Cancel</button>
              <button onClick={() => {
                setShowRoomPost(false);
                setOrder([]);
                add({ type: "success", title: "Charge posted to Room " + selectedRoom, body: `${order.reduce((s, o) => s + o.qty, 0)} items · ${order.map(o => o.name).slice(0, 2).join(", ")}${order.length > 2 ? "..." : ""}` });
              }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#18181B" }}>
                Post to Folio
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function KitchenDisplay() {
  const [orders, setOrders] = useState(KDS_ORDERS.map(o => ({ ...o })));
  const [elapsed, setElapsed] = useState<Record<string, number>>(
    Object.fromEntries(KDS_ORDERS.map(o => [o.id, o.elapsed]))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(p => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v + 1])));
    }, 60000); // tick every minute
    return () => clearInterval(id);
  }, []);
  const ageC = (e: number) => e > 15 ? { bg: "#FEE2E2", border: ERROR, text: ERROR, label: "URGENT" } : e > 8 ? { bg: "#FEF3C7", border: WARNING, text: WARNING, label: "RUSH" } : { bg: "#DCFCE7", border: SUCCESS, text: SUCCESS, label: "NEW" };
  const bump = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));
  return (
    <div>
      <PageHeader title="Kitchen Display Screen" sub="Live order queue · Auto-refreshing every 30s" actions={<div className="flex items-center gap-2 text-sm" style={{ color: MUTED }}><span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: SUCCESS }} />Live</div>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="In Queue" value={String(KDS_ORDERS.filter(o=>o.status==="New").length)} sub="Waiting to start" icon={ClipboardList} accent={ERROR} />
        <StatCard label="Cooking" value={String(KDS_ORDERS.filter(o=>o.status==="Cooking").length)} sub="In preparation" icon={UtensilsCrossed} accent={ORANGE} />
        <StatCard label="Ready" value={String(KDS_ORDERS.filter(o=>o.status==="Ready").length)} sub="Awaiting pickup" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Bumped Today" value="14" sub="Completed orders" icon={Activity} accent={PRIMARY} />
      </div>
      {orders.length === 0 ? <div className="bg-white rounded-xl border" style={{ borderColor: BORDER }}><EmptyState icon={UtensilsCrossed} message="No active orders in queue." /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {orders.map(o => {
            const liveElapsed = elapsed[o.id] ?? o.elapsed;
            const ac = ageC(liveElapsed);
            return (
              <div key={o.id} className="rounded-xl border-2 p-4 flex flex-col" style={{ backgroundColor: ac.bg, borderColor: ac.border }}>
                <div className="flex items-start justify-between mb-3">
                  <div><div className="text-lg font-bold" style={{ color: TEXT }}>{o.table}</div><div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{o.id}</div></div>
                  <div className="text-right"><div className="text-2xl font-bold" style={{ color: ac.text, fontFamily: mono }}>{liveElapsed}m</div><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: ac.border, color: "white" }}>{ac.label}</span></div>
                </div>
                <div className="flex-1 space-y-2 mb-4">
                  {o.items.map((item, i) => <div key={i} className="flex items-start gap-2"><div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2" style={{ borderColor: ac.border }} /><div><div className="text-sm font-medium" style={{ color: TEXT }}>{item.name}</div>{item.mod && <div className="text-xs italic" style={{ color: MUTED }}>{item.mod}</div>}</div></div>)}
                </div>
                <button onClick={() => bump(o.id)} className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: ac.border }}>BUMP ✓</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MenuManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [activeCat, setActiveCat] = useState("Mains");
  const items = MENU_ALL.filter(i => i.cat === activeCat);
  return (
    <div>
      <PageHeader title="Menu Management" sub="Configure menu items, pricing, and availability" actions={<><BtnO label="Add Category" icon={Plus} /><BtnP label="Add Item" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Items" value={String(MENU_ITEMS.length)} sub="In all categories" icon={UtensilsCrossed} accent={PRIMARY} />
        <StatCard label="Available" value={String(MENU_ITEMS.filter(m=>m.avail).length)} sub="On today's menu" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Unavailable" value={String(MENU_ITEMS.filter(m=>!m.avail).length)} sub="Out of stock" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Categories" value={String(MENU_CATS.length)} sub="Menu sections" icon={Layers} accent={TEAL} />
      </div>
      <div className="flex gap-4">
        <div className="w-44 flex-shrink-0 bg-white rounded-xl border p-2" style={{ borderColor: BORDER }}>
          {MENU_CATS.map(c => <button key={c} onClick={() => setActiveCat(c)} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1" style={{ backgroundColor: activeCat === c ? PRIMARY : "transparent", color: activeCat === c ? "white" : MUTED }}>{c}<span className="ml-2 text-xs opacity-70">({MENU_ALL.filter(i => i.cat === c).length})</span></button>)}
        </div>
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{activeCat}</h3><span className="text-xs" style={{ color: SUBTLE }}>{items.length} items</span></div>
          <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Name", "Price", "Available", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>{items.map(item => <tr key={item.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-4 text-sm font-medium" style={{ color: TEXT }}>{item.name}</td><td className="px-5 py-4 text-sm font-semibold" style={{ color: PRIMARY }}>₦{item.price.toLocaleString()}</td><td className="px-5 py-4"><label className="cursor-pointer"><div className="w-10 h-5 rounded-full relative" style={{ backgroundColor: item.avail ? TEAL : "#CBD5E1" }}><div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow" style={{ left: item.avail ? 22 : 2 }} /></div></label></td><td className="px-5 py-4"><div className="flex gap-1"><button onClick={() => add({ type: "info", title: `Edit: ${item.name}` })} className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: MUTED }}><Edit3 size={13} /></button><button className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>86'd</button></div></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function LostFound({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Held: { bg: "#FEF3C7", text: "#92400E" }, Claimed: { bg: "#DCFCE7", text: "#166534" }, Disposed: { bg: "#F3F4F6", text: "#374151" } };
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Items Held" value={String(LOST_FOUND.filter(i=>i.status==="Held").length)} sub="In safe keeping" icon={Package} accent={WARNING} />
        <StatCard label="Claimed" value={String(LOST_FOUND.filter(i=>i.status==="Claimed").length)} sub="Returned to owners" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Total Items" value={String(LOST_FOUND.length)} sub="All records" icon={ClipboardList} accent={PRIMARY} />
      </div>
      <PageHeader title="Lost & Found" sub={`${LOST_FOUND.length} items logged · ${LOST_FOUND.filter(i => i.status === "Held").length} currently held`} actions={<BtnP label="Log New Item" icon={Plus} />} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          {["All", "Held", "Claimed", "Disposed"].map(f => <button key={f} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: f === "All" ? PRIMARY : BORDER, backgroundColor: f === "All" ? PRIMARY : "white", color: f === "All" ? "white" : MUTED }}>{f}</button>)}
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item ID", "Description", "Location Found", "Date", "Logged By", "Claimed By", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{LOST_FOUND.map(item => <tr key={item.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs font-mono" style={{ color: MUTED, fontFamily: mono }}>{item.id}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{item.desc}</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{item.location}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{item.date}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{item.loggedBy}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{item.claimedBy}</td><td className="px-5 py-3"><Badge label={item.status} colors={stC[item.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `${item.id} marked claimed` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Claim</button><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Dispose</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DNDLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Do Not Disturb Log" sub="DND tracking with wellness check escalation" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Active DND" value={String(DND_ROOMS.filter(d=>d.flag).length)} sub="Do Not Disturb now" icon={AlertCircle} accent={ERROR} />
        <StatCard label="Resolved Today" value={String(DND_ROOMS.filter(d=>!d.flag).length)} sub="DND lifted" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Flagged Rooms" value={String(DND_ROOMS.length)} sub="Historical records" icon={BedDouble} accent={PRIMARY} />
      </div>
      <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: `1px solid #FECACA` }}>
        <AlertTriangle size={16} style={{ color: ERROR, marginTop: 1 }} /><div><div className="text-sm font-semibold" style={{ color: ERROR }}>2 rooms flagged — DND exceeds 12 hours</div><div className="text-xs mt-0.5" style={{ color: "#991B1B" }}>Rooms 315 and 410 require wellness check. No response from 315 on first attempt.</div></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest", "DND Start", "Duration", "Expected Checkout", "Wellness Check", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{DND_ROOMS.map(r => <tr key={r.room} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5", backgroundColor: r.flag ? "#FFF5F5" : "white" }}><td className="px-5 py-3 font-bold text-lg" style={{ color: r.flag ? ERROR : PRIMARY }}>{r.room}{r.flag && " ⚠"}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{r.guest}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.dndStart}</td><td className="px-5 py-3"><span className="text-sm font-bold" style={{ color: r.flag ? ERROR : TEXT }}>{r.hours}h</span></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{r.checkout}</td><td className="px-5 py-3 text-xs" style={{ color: r.wellness !== "—" ? WARNING : SUBTLE }}>{r.wellness}</td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "info", title: `Wellness check logged — Room ${r.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Log Check</button><button onClick={() => add({ type: "warning", title: `DND overridden — Room ${r.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Override DND</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function InvoiceReceipts({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Paid: { bg: "#DCFCE7", text: "#166534" }, Outstanding: { bg: "#FEF3C7", text: "#92400E" }, Refunded: { bg: "#EEF2FF", text: "#4338CA" }, Cancelled: { bg: "#F3F4F6", text: "#374151" } };
  return (
    <div>
      <PageHeader title="Invoice & Receipts" sub="All guest invoices and receipts" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Create Invoice" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Total Invoiced" value="₦687,100" sub="This month" icon={FileText} accent={PRIMARY} /><StatCard label="Paid" value="₦220,000" sub="32% settled" icon={CheckCircle2} accent={SUCCESS} /><StatCard label="Outstanding" value="₦467,100" sub="3 open invoices" icon={AlertCircle} accent={ERROR} delta="2 overdue" deltaPositive={false} /><StatCard label="Refunded" value="₦55,000" sub="1 refund this month" icon={TrendingDown} accent={"#6366F1"} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search invoice, guest…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
          {["All", "Paid", "Outstanding", "Refunded"].map(f => <button key={f} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: f === "All" ? PRIMARY : BORDER, backgroundColor: f === "All" ? PRIMARY : "white", color: f === "All" ? "white" : MUTED }}>{f}</button>)}
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Invoice #", "Guest", "Room", "Date", "Amount", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{INVOICES_DATA.map(inv => <tr key={inv.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{inv.id}</td><td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{inv.av}</div><span className="text-sm font-medium" style={{ color: TEXT }}>{inv.guest}</span></div></td><td className="px-5 py-3 font-bold" style={{ color: PRIMARY }}>{inv.room}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{inv.date}</td><td className="px-5 py-3 text-sm font-semibold" style={{ color: TEXT }}>₦{inv.amount.toLocaleString()}</td><td className="px-5 py-3"><Badge label={inv.status} colors={stC[inv.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>View</button><button onClick={() => add({ type: "success", title: `Invoice ${inv.id} sent` })} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Send</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AccountsPayable({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Unpaid: { bg: "#FEF3C7", text: "#92400E" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" }, Paid: { bg: "#DCFCE7", text: "#166534" } };
  const total = AP_DATA.filter(a => a.status !== "Paid").reduce((s, a) => s + a.amount, 0);
  return (
    <div>
      <PageHeader title="Accounts Payable" sub="Vendor invoices and payment scheduling" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Vendor Invoice" icon={Plus} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Total Outstanding" value={`₦${total.toLocaleString()}`} sub={`${AP_DATA.filter(a=>a.status!=="Paid").length} unpaid invoices`} icon={AlertCircle} accent={ERROR} /><StatCard label="Overdue" value={`₦${AP_DATA.filter(a=>a.status==="Overdue").reduce((s,a)=>s+a.amount,0).toLocaleString()}`} sub="Past due date" icon={AlertTriangle} accent={ERROR} delta="Action required" deltaPositive={false} /><StatCard label="Due This Week" value="₦227,000" sub="Next 7 days" icon={CalendarDays} accent={WARNING} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Vendor", "Invoice #", "Invoice Date", "Due Date", "Amount", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{AP_DATA.map((a, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{a.vendor}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.invoice}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{a.date} Jun</td><td className="px-5 py-3 text-xs" style={{ color: a.status === "Overdue" ? ERROR : MUTED }}>{a.due} Jun</td><td className="px-5 py-3 text-sm font-semibold" style={{ color: TEXT }}>₦{a.amount.toLocaleString()}</td><td className="px-5 py-3"><Badge label={a.status} colors={stC[a.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `Payment recorded — ${a.vendor}` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Mark Paid</button><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Schedule</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function RevenueReports() {
  return (
    <div>
      <PageHeader title="Revenue Reports" sub="Grand Palms Hotel, Abuja · Year to date 2025" actions={<><BtnO label="Export Excel" icon={Download} /><BtnO label="Export PDF" icon={FileText} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Total Revenue (YTD)" value="₦6.85M" sub="Year to date 2025" icon={DollarSign} accent={SUCCESS} delta="+18.4% vs 2024" deltaPositive /><StatCard label="ADR" value="₦55,417" sub="Avg daily rate" icon={TrendingUp} accent={PRIMARY} delta="+₦4,200 vs last month" deltaPositive /><StatCard label="RevPAR" value="₦48,767" sub="Revenue per available room" icon={Building2} accent={TEAL} delta="+12.1% vs last month" deltaPositive /><StatCard label="GOP %" value="62.4%" sub="Gross operating profit" icon={Activity} accent={ORANGE} delta="+3.2pp vs last month" deltaPositive /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Revenue by Category — Monthly (₦K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REV_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`₦${v}K`]} />
              <Bar dataKey="rooms" name="Rooms" fill={PRIMARY} stackId="a" />
              <Bar dataKey="fb" name="F&B" fill={TEAL} stackId="a" />
              <Bar dataKey="events" name="Events" fill={ORANGE} stackId="a" />
              <Bar dataKey="other" name="Other" fill={SUBTLE} radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Revenue vs. Target (₦K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REV_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`₦${v}K`]} />
              <Area type="monotone" dataKey="rooms" name="Total Revenue" stroke={PRIMARY} strokeWidth={2} fill={PRIMARY + "20"} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function RolesPermissions({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [activeRole, setActiveRole] = useState("Front Desk");
  const roles = Object.keys(DEPT_PERMS);
  const perms = DEPT_PERMS[activeRole] ?? [];
  const ALL_PERMS = Array.from(new Set(Object.values(DEPT_PERMS).flat()));
  return (
    <div>
      <PageHeader title="Roles & Permissions" sub="Module-level permission matrix per role" actions={<BtnP label="Create Custom Role" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Defined Roles" value={String(roles.length)} sub="Access level profiles" icon={Shield} accent={PRIMARY} />
        <StatCard label="Staff Members" value="47" sub="Across all roles" icon={Users} accent={TEAL} />
        <StatCard label="Restricted Modules" value="3" sub="Limited-access areas" icon={AlertTriangle} accent={WARNING} />
      </div>
      <div className="flex gap-4">
        <div className="w-48 flex-shrink-0 bg-white rounded-xl border p-2" style={{ borderColor: BORDER }}>
          {roles.map(r => <button key={r} onClick={() => setActiveRole(r)} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors" style={{ backgroundColor: activeRole === r ? PRIMARY : "transparent", color: activeRole === r ? "white" : MUTED }}>{r}</button>)}
        </div>
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{activeRole} — Permission Matrix</h3><button onClick={() => add({ type: "success", title: "Permissions saved" })} className="text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: PRIMARY }}>Save Changes</button></div>
          <div className="p-4 space-y-1">
            {ALL_PERMS.map(p => {
              const enabled = perms.includes(p) || perms.includes("All Modules");
              return (
                <div key={p} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F4F4F5]">
                  <span className="text-sm" style={{ color: TEXT }}>{p}</span>
                  <label className="cursor-pointer"><div className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: enabled ? TEAL : "#CBD5E1" }}><div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: enabled ? 22 : 2 }} /></div></label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttendanceScreen() {
  const days = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27"];
  const stC: Record<string, { bg: string; text: string }> = { P: { bg: "#DCFCE7", text: "#166534" }, A: { bg: "#FEE2E2", text: "#991B1B" }, L: { bg: "#FEF3C7", text: "#92400E" } };
  const fullLabel: Record<string, string> = { P: "Present", A: "Absent", L: "On Leave" };
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Present Today" value={String(ATTEND_DATA.filter(a=>a.status==="P").length)} sub="On duty" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Absent" value={String(ATTEND_DATA.filter(a=>a.status==="A").length)} sub="Not reported" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="On Leave" value={String(ATTEND_DATA.filter(a=>a.status==="L").length)} sub="Approved leave" icon={CalendarDays} accent={WARNING} />
        <StatCard label="Total Staff" value={String(ATTEND_DATA.length)} sub="All departments" icon={Users} accent={PRIMARY} />
      </div>
      <PageHeader title="Attendance" sub="Week of 23–27 Jun 2025 · Grand Palms Abuja Branch" actions={<><BtnO label="Export" icon={Download} /><BtnO label="Approve Leave" icon={CheckCircle2} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}><th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Staff Member</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Department</th>{days.map(d => <th key={d} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{d}</th>)}<th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Days Present</th></tr></thead>
          <tbody>{ATTEND_DATA.map(s => <tr key={s.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{s.name}</td><td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{s.dept}</span></td>{s.days.map((d, i) => <td key={i} className="px-4 py-3 text-center"><span title={fullLabel[d]} className="inline-flex w-8 h-8 rounded-lg items-center justify-center text-xs font-bold" style={stC[d] ?? { bg: "#F3F4F6", text: "#374151" }}>{d}</span></td>)}<td className="px-5 py-3 text-center font-bold text-sm" style={{ color: TEXT }}>{s.days.filter(d => d === "P").length}/5</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function ShiftScheduler({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const staff = ["John Abubakar", "Amaka Osei", "Emeka Nwosu", "Fatima Al-Hassan", "Ngozi Ike", "Bola Adewale"];
  const days = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27", "Sat 28", "Sun 29"];
  const shiftMap: Record<string, Record<string, string>> = {
    "John Abubakar": { "Mon 23": "Morning", "Tue 24": "Morning", "Wed 25": "Evening", "Thu 26": "Morning", "Fri 27": "Morning", "Sat 28": "Off", "Sun 29": "Off" },
    "Amaka Osei": { "Mon 23": "Morning", "Tue 24": "Morning", "Wed 25": "Morning", "Thu 26": "Off", "Fri 27": "Morning", "Sat 28": "Morning", "Sun 29": "Off" },
    "Emeka Nwosu": { "Mon 23": "Morning", "Tue 24": "Morning", "Wed 25": "Off", "Thu 26": "Off", "Fri 27": "Morning", "Sat 28": "Morning", "Sun 29": "Morning" },
    "Fatima Al-Hassan": { "Mon 23": "Morning", "Tue 24": "Morning", "Wed 25": "Morning", "Thu 26": "Morning", "Fri 27": "Morning", "Sat 28": "Off", "Sun 29": "Off" },
    "Ngozi Ike": { "Mon 23": "Evening", "Tue 24": "Evening", "Wed 25": "Morning", "Thu 26": "Morning", "Fri 27": "Off", "Sat 28": "Morning", "Sun 29": "Morning" },
    "Bola Adewale": { "Mon 23": "Morning", "Tue 24": "Morning", "Wed 25": "Morning", "Thu 26": "Morning", "Fri 27": "Morning", "Sat 28": "Off", "Sun 29": "Off" },
  };
  const shiftC: Record<string, { bg: string; text: string }> = { Morning: { bg: "#DCFCE7", text: "#166534" }, Evening: { bg: "#DBEAFE", text: "#1E40AF" }, Night: { bg: "#EDE9FE", text: "#6D28D9" }, Off: { bg: "#F3F4F6", text: "#71717A" } };
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Staff on Roster" value={String(staff.length)} sub="This week" icon={Users} accent={PRIMARY} />
        <StatCard label="Shifts Scheduled" value={String(staff.length * days.length)} sub="7-day period" icon={CalendarDays} accent={TEAL} />
        <StatCard label="Unassigned Slots" value="3" sub="Need scheduling" icon={AlertTriangle} accent={WARNING} />
      </div>
            <PageHeader title="Shift Scheduler" sub="Week of 23–29 Jun 2025" actions={<><BtnO label="Clone Last Week" icon={RefreshCw} /><BtnP label="Publish Schedule" icon={Send} onClick={() => add({ type: "success", title: "Schedule published", body: "All staff notified" })} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: "#F9FAFB" }}>
          <div className="w-44 flex-shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Staff</div>
          {days.map(d => <div key={d} className="flex-1 text-center py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED, minWidth: 80 }}>{d}</div>)}
        </div>
        {staff.map(s => <div key={s} className="flex items-center border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5", minHeight: 52 }}><div className="w-44 flex-shrink-0 px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{s.split(" ")[0]}</div>{days.map(d => { const shift = shiftMap[s]?.[d] ?? "Off"; const c = shiftC[shift]; return <div key={d} className="flex-1 flex justify-center py-2" style={{ minWidth: 80 }}><span className="px-2 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>{shift}</span></div>; })}</div>)}
        <div className="px-5 py-3 border-t flex gap-4 text-xs" style={{ borderColor: "#F4F4F5", color: MUTED }}>{Object.entries(shiftC).map(([s, c]) => <span key={s} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: c.bg, border: `1px solid ${c.text}30` }} />{s}</span>)}</div>
      </div>
    </div>
  );
}

export function CentralSyncStatus({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const syncC: Record<string, string> = { synced: SUCCESS, pending: WARNING, error: ERROR };
  return (
    <div>
      <PageHeader title="Central Sync Status" sub="Branch-by-branch sync health · Central server" actions={<BtnP label="Force Sync All" icon={RefreshCw} onClick={() => add({ type: "info", title: "Sync triggered for all branches" })} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Branches Online" value="3/3" sub="All connected" icon={Activity} accent={SUCCESS} /><StatCard label="Pending Sync Items" value="5" sub="Queued for next sync" icon={AlertTriangle} accent={WARNING} /><StatCard label="Last Full Sync" value="47m ago" sub="All data up to date" icon={CheckCircle2} accent={PRIMARY} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Branch Sync Status</h3></div>
        {SYNC_BRANCHES.map(b => (
          <div key={b.name} className="flex items-center gap-4 px-5 py-4 border-b hover:bg-[#F9FAFB]" style={{ borderColor: "#F9FAFB" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: b.status === "synced" ? "#DCFCE7" : "#FEF3C7" }}>
              <RefreshCw size={16} style={{ color: syncC[b.status] }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: TEXT }}>{b.name}</div>
              <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>IP: <span style={{ fontFamily: mono }}>{b.ip}</span> · Last sync: {b.lastSync}</div>
            </div>
            <div className="text-right">
              {b.pending > 0 ? <div className="text-sm font-bold" style={{ color: WARNING }}>{b.pending} pending</div> : <div className="text-sm font-semibold" style={{ color: SUCCESS }}>All synced</div>}
              <div className="text-xs" style={{ color: SUBTLE }}>{b.items} items</div>
            </div>
            <Badge label={b.status === "synced" ? "Synced" : "Pending"} colors={b.status === "synced" ? { bg: "#DCFCE7", text: "#166534" } : { bg: "#FEF3C7", text: "#92400E" }} />
            <button onClick={() => add({ type: "info", title: `Force sync — ${b.name}` })} className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Force Sync</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Users" value={String(USERS_DATA.length)} sub="All branches" icon={Users} accent={PRIMARY} />
        <StatCard label="Active Now" value={String(USERS_DATA.filter(u=>u.active).length)} sub="Currently logged in" icon={Activity} accent={SUCCESS} />
        <StatCard label="Suspended" value={String(USERS_DATA.filter(u=>!u.active).length)} sub="Access revoked" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Roles" value="8" sub="Across all departments" icon={Shield} accent={TEAL} />
      </div>
      <PageHeader title="User Management" sub="All branch user accounts · Grand Palms Abuja Branch" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Invite New User" icon={Plus} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          <div className="relative flex-1 max-w-xs"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search by name or email…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-full" style={{ borderColor: BORDER }} /></div>
          <Sel options={["All Roles", "MGT", "FD", "HK", "MX", "FIN", "RSV"]} />
          <Sel options={["All Status", "Active", "Inactive"]} />
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["User", "Email", "Role", "Department", "Status", "Last Login", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{USERS_DATA.map(u => <tr key={u.email} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><span className="text-sm font-medium" style={{ color: TEXT }}>{u.name}</span></div></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{u.email}</td><td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{u.role}</span></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{u.dept}</td><td className="px-5 py-3"><Badge label={u.status} colors={{ bg: "#DCFCE7", text: "#166534" }} /></td><td className="px-5 py-3 text-xs" style={{ color: SUBTLE }}>{u.lastLogin}</td><td className="px-5 py-3"><div className="flex gap-1"><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button><button onClick={() => add({ type: "info", title: `Password reset sent to ${u.name}` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Reset PW</button><button className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Deactivate</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DoorLockSettings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [enabled, setEnabled] = useState(true);
  const [tested, setTested] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const rooms = [{ room: "101", lockId: "LK-001A", name: "Room 101" }, { room: "102", lockId: "LK-002A", name: "Room 102" }, { room: "201", lockId: "LK-001B", name: "Room 201" }, { room: "301", lockId: "LK-001C", name: "Room 301" }];
  return (
    <div>
      <PageHeader title="Door Lock Integration" sub="TTLock Cloud API configuration · Grand Palms Abuja Branch" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Master Enable</h3>
            <label className="cursor-pointer flex items-center gap-2"><span className="text-sm" style={{ color: MUTED }}>Door Lock Module</span><div onClick={() => setEnabled(p => !p)} className="w-12 h-6 rounded-full relative cursor-pointer" style={{ backgroundColor: enabled ? TEAL : "#CBD5E1" }}><div className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: enabled ? 26 : 2 }} /></div></label>
          </div>
          {!enabled && <div className="text-xs p-2 rounded-lg" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>⚠ Door Lock module disabled. Step 7 hidden in check-in wizard. All door lock screens hidden from sidebar.</div>}
          <div className="mt-4"><Sel label="Lock Provider" options={["TTLock Cloud API", "ZKTeco (coming soon)", "Dormakaba (coming soon)"]} /></div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>TTLock API Credentials</h3>
          <div className="space-y-3">
            <Inp label="Client ID" defaultValue="ttlock_client_gp_abuja_001" />
            <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Client Secret</label><div className="relative"><input type="password" defaultValue="sk_live_xxxxxxxxxxxxx" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none pr-16" style={{ borderColor: BORDER }} /><button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: TEAL }}>Show</button></div></div>
            <Inp label="Username" defaultValue="grandpalms_abuja@ttlock.com" />
            <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Password</label><input type="password" defaultValue="••••••••••" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => { setTested("testing"); setTimeout(() => setTested("ok"), 1800); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>
              {tested === "testing" ? <span className="animate-spin">↻</span> : <Wifi size={14} />}Test Connection
            </button>
            {tested === "ok" && <span className="text-xs font-medium flex items-center gap-1" style={{ color: SUCCESS }}><CheckCircle2 size={13} />Connected · 12 locks found</span>}
            {tested === "fail" && <span className="text-xs font-medium" style={{ color: ERROR }}>Connection failed — check credentials</span>}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Room → Lock Mapping</h3><BtnO label="Auto-Map by Name" icon={RefreshCw} /></div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "TTLock Lock ID", "Lock Name", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{rooms.map(r => <tr key={r.room} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 font-bold" style={{ color: PRIMARY }}>Room {r.room}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.lockId}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>{r.name}</td><td className="px-5 py-3"><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button></td></tr>)}</tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Integration Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[{ l: "Auto-revoke access on check-out", on: true }, { l: "Queue commands when offline", on: true }, { l: "Notify MGT on offline revoke", on: true }, { l: "Encode 2nd card automatically", on: false }].map(s => <div key={s.l} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#F4F4F5" }}><span className="text-sm" style={{ color: TEXT }}>{s.l}</span><div className="w-10 h-5 rounded-full relative" style={{ backgroundColor: s.on ? TEAL : "#CBD5E1" }}><div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow" style={{ left: s.on ? 22 : 2 }} /></div></div>)}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Max cards per check-in</label><input defaultValue="3" type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
          <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Queue expiry buffer (hours)</label><input defaultValue="1" type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
        </div>
        <div className="mt-4"><BtnP label="Save Settings" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Door lock settings saved" })} /></div>
      </div>
    </div>
  );
}

// ─── BATCH 3 SCREENS ──────────────────────────────────────────────────────────










// R-07 Reservation Search
export function ReservationSearch({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = q ? ALL_RES.filter(r => r.guest.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q)) : ALL_RES;
  return (
    <div>
      <PageHeader title="Reservation Search" sub="Search all reservations by guest, ID, room, date, or status" actions={<BtnP label="New Reservation" icon={Plus} />} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-4 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
          <div className="lg:col-span-2 relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Guest name, reservation ID, or room…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
          <Sel options={["All Status", "Confirmed", "Checked In", "Checked Out", "No Show", "Cancelled"]} />
          <Inp label="" type="date" defaultValue="2025-06-24" placeholder="Check-in from" />
          <Inp label="" type="date" defaultValue="2025-06-30" placeholder="Check-in to" />
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Reservation ID", "Guest", "Room", "Check-in", "Check-out", "Nights", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(r => <tr key={r.id} className="border-t hover:bg-[#F9FAFB] cursor-pointer" style={{ borderColor: "#F4F4F5" }}>
            <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
            <td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{r.guest.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><span className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</span></div></td>
            <td className="px-5 py-3 font-bold" style={{ color: PRIMARY }}>Room {r.room}</td>
            <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{r.checkin}</td>
            <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{r.checkout}</td>
            <td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{r.nights}n</td>
            <td className="px-5 py-3"><Badge label={r.status} colors={resStC[r.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
            <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => nav && nav("reservation-detail", r.id)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>View</button>{r.status === "Confirmed" && <button onClick={() => nav ? nav("check-in", "Check-In") : add({ type: "success", title: "Check-in started", body: r.guest })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Check In</button>}</div></td>
          </tr>)}</tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={Search} message="No reservations match your search." />}
      </div>
    </div>
  );
}

// R-03 Reservation Detail
export function ReservationDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Folio", "History", "Notes"];
  const res = ALL_RES[0];
  return (
    <div>
      <PageHeader title={`Reservation ${res.id}`} sub={`${res.guest} · Room ${res.room} ${res.type}`}
        actions={<><BtnO label="Modify" icon={Edit3} /><BtnO label="Cancel" /><BtnP label="Check In" icon={KeyRound} onClick={() => add({ type: "success", title: "Check-in started", body: res.guest })} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {/* Status banner */}
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <Badge label={res.status} colors={resStC[res.status] ?? { bg: "#F4F4F5", text: "#374151" }} />
          <span className="text-sm" style={{ color: SUCCESS }}>Arriving today at 14:00 · Suite 501 prepped and ready</span>
        </div>
        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: BORDER }}>
          {tabs.map(t => <button key={t} onClick={() => setTab(t)} className="px-6 py-3 text-sm font-medium transition-colors" style={{ color: tab === t ? PRIMARY : MUTED, borderBottom: tab === t ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{t}</button>)}
        </div>
        <div className="p-6">
          {tab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Booking Details</h3>
                <div className="space-y-2">{[["Reservation ID", res.id], ["Booking Type", "Individual"], ["Source", res.source], ["Room Type", res.type], ["Room Number", `Room ${res.room}`], ["Check-in", `${res.checkin} 2025, 14:00`], ["Check-out", `${res.checkout} 2025, 11:00`], ["Nights", `${res.nights}`], ["Rate Plan", "Standard Rate"], ["Nightly Rate", `₦${res.rate.toLocaleString()}`], ["Total", `₦${(res.rate * res.nights * 1.075).toLocaleString()} incl. VAT`]].map(([k, v]) => <div key={k} className="flex gap-4 text-sm"><span className="w-32 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>)}</div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest Details</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl mb-3" style={{ backgroundColor: "#F9FAFB" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>CB</div>
                  <div><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{ color: TEXT }}>{res.guest}</span><Star size={13} fill={ORANGE} style={{ color: ORANGE }} /></div><div className="text-xs mt-0.5" style={{ color: MUTED }}>VIP · 15 previous stays</div></div>
                </div>
                <div className="space-y-2">{[["Phone", "+234 803 555 6666"], ["Email", "c.bello@example.com"], ["ID", "Passport · A12345678"], ["Special Requests", "Champagne, high floor, fruit basket"]].map(([k, v]) => <div key={k} className="flex gap-4 text-sm"><span className="w-32 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v as string}</span></div>)}</div>
              </div>
            </div>
          )}
          {tab === "Folio" && (
            <div>
              <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Folio Charges</h3><BtnP label="Post Charge" icon={Plus} /></div>
              <div className="text-sm text-center py-8" style={{ color: MUTED }}>No charges posted yet — guest has not checked in.</div>
            </div>
          )}
          {tab === "History" && (
            <div className="space-y-3">
              {[["24 Jun 09:15", "Reservation created via phone", "Fatima Al-Hassan"], ["24 Jun 09:20", "Room 501 pre-assigned", "System"], ["24 Jun 09:22", "Confirmation email sent", "System"], ["24 Jun 11:00", "Special request noted: Champagne + fruit basket", "Grace Mensah"]].map(([ts, action, by], i) => <div key={i} className="flex gap-3 text-sm"><span className="text-xs w-36 flex-shrink-0 pt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{ts as string}</span><div><div style={{ color: TEXT }}>{action as string}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>by {by as string}</div></div></div>)}
            </div>
          )}
          {tab === "Notes" && (
            <div>
              <div className="space-y-3 mb-4">{[{ note: "VIP guest — champagne on arrival, fruit basket, high floor preferred. Previous stays: always Suite.", by: "Grace Mensah", ts: "24 Jun 09:22" }].map((n, i) => <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><p className="text-sm" style={{ color: TEXT }}>{n.note}</p><div className="text-xs mt-2" style={{ color: MUTED }}>{n.by} · {n.ts}</div></div>)}</div>
              <div><textarea className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" rows={3} placeholder="Add an internal note…" style={{ borderColor: BORDER }} /><div className="mt-2"><BtnP label="Add Note" icon={Plus} onClick={() => add({ type: "success", title: "Note added" })} /></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FD-03 Room Assignment Board
export function RoomAssignmentBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const unassigned = ARRIVALS_DATA.filter(a => !a.assigned);
  const available = ROOMS.filter(r => r.status === "Available");
  const [sel, setSel] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [dragGuest, setDragGuest] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const ROOM_IMGS = [
    "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=300&h=200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1571898223382-0aa3499f0f2a?w=300&h=200&fit=crop&auto=format",
  ];
  const doAssign = (guestId: string, roomId: string) => {
    const g = ARRIVALS_DATA.find(a => a.id === guestId);
    setAssigned(prev => ({ ...prev, [roomId]: guestId }));
    add({ type: "success", title: "Room assigned", body: `${g?.guest} → Room ${roomId}` });
    setSel(null); setSelRoom(null); setDragGuest(null);
  };
  return (
    <div>
      <PageHeader title="Room Assignment Board" sub="Select a guest and room — or drag a guest card onto a room" actions={<BtnP label="Auto-Assign All" icon={Zap} onClick={() => add({ type: "success", title: "Auto-assigned all arrivals" })} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Unassigned" value={String(unassigned.length - Object.keys(assigned).length)} sub="Need room" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Available Rooms" value={String(available.length - Object.keys(assigned).length)} sub="Ready to assign" icon={BedDouble} accent={SUCCESS} />
        <StatCard label="Total Arrivals" value={String(ARRIVALS_DATA.length)} sub="Expected today" icon={CalendarCheck} accent={PRIMARY} />
        <StatCard label="Assigned" value={String((ARRIVALS_DATA.length - unassigned.length) + Object.keys(assigned).length)} sub="Ready for check-in" icon={CheckCircle2} accent={TEAL} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Arrivals list */}
        <div className="lg:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Unassigned Arrivals — click to select, or drag to a room</div>
          <div className="space-y-3">
            {unassigned.map((a, i) => {
              const isAssigned = Object.values(assigned).includes(a.id);
              return (
                <div key={a.id} draggable={!isAssigned} onDragStart={() => setDragGuest(a.id)}
                  onClick={() => !isAssigned && setSel(sel === a.id ? null : a.id)}
                  className="bg-white rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                  style={{ borderColor: sel === a.id ? PRIMARY : BORDER, borderWidth: sel === a.id ? 2 : 1, opacity: isAssigned ? 0.5 : 1 }}>
                  <div className="flex items-center gap-3 p-4">
                    <Av gender={i % 2 === 0 ? "M" : "F"} size={44} /><div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-semibold" style={{ color: TEXT }}>{a.guest}</span>
                        {a.vip && <Star size={11} fill={ORANGE} style={{ color: ORANGE }} />}
                      </div>
                      <div className="text-xs" style={{ color: MUTED }}>{a.type} · ETA {a.eta}</div>
                    </div>
                    {isAssigned ? (
                      <CheckCircle2 size={16} style={{ color: SUCCESS }} />
                    ) : sel === a.id ? (
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: PRIMARY, backgroundColor: PRIMARY }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: BORDER }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Room grid */}
        <div className="lg:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Available Rooms — click to select, or drop a guest</div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {available.map((r, i) => {
              const isOccupied = r.id in assigned;
              const assignedGuest = isOccupied ? ARRIVALS_DATA.find(a => a.id === assigned[r.id])?.guest : null;
              const isSelected = selRoom === r.id;
              return (
                <div key={r.id}
                  onDragOver={e => { if (!isOccupied) e.preventDefault(); }}
                  onDrop={() => { if (dragGuest && !isOccupied) doAssign(dragGuest, r.id); }}
                  onClick={() => { if (isOccupied) return; if (sel) { doAssign(sel, r.id); } else setSelRoom(selRoom === r.id ? null : r.id); }}
                  className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: isSelected ? PRIMARY : isOccupied ? SUCCESS : BORDER, borderWidth: isSelected || isOccupied ? 2 : 1 }}>
                  <div className="h-28 relative overflow-hidden bg-zinc-200">
                    <img src={ROOM_IMGS[i % ROOM_IMGS.length]} alt={`Room ${r.id}`} className="w-full h-full object-cover" style={{ opacity: isOccupied ? 0.5 : 0.85 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
                    <div className="absolute bottom-2 left-3 right-2 flex items-end justify-between">
                      <span className="text-white font-black text-xl">{r.id}</span>
                      {isOccupied && <CheckCircle2 size={18} style={{ color: "#34D399" }} />}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>{r.type}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Floor {r.floor} · Available</div>
                    {isOccupied && <div className="mt-1 text-xs font-semibold" style={{ color: SUCCESS }}>→ {assignedGuest}</div>}
                    {isSelected && sel && <div className="mt-1 text-xs px-2 py-1 rounded-lg font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Click to assign {ARRIVALS_DATA.find(a=>a.id===sel)?.guest?.split(" ")[0]}</div>}
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

// FD-05 Guest Profile Detail
export function GuestProfileDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Stay History", "Preferences", "Folios", "Complaints & Feedback"];
  return (
    <div>
      <PageHeader title="Guest Profile — Dr. Chukwuemeka Bello" sub="G-002 · VIP · 15 stays"
        actions={<><BtnO label="Create Reservation" icon={Plus} /><BtnP label="Edit Profile" icon={Edit3} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-2" style={{ backgroundColor: PRIMARY }}>CB</div>
            <div className="flex items-center justify-center gap-1 mb-1"><span className="text-base font-bold" style={{ color: TEXT }}>Dr. Chukwuemeka Bello</span></div>
            <Star size={14} fill={ORANGE} style={{ color: ORANGE, display: "inline" }} /><span className="text-xs ml-1" style={{ color: MUTED }}>VIP Guest</span>
          </div>
          <div className="space-y-2 text-xs border-t pt-3" style={{ borderColor: "#F4F4F5" }}>
            {[["Phone", "+234 803 555 6666"], ["Email", "c.bello@example.com"], ["ID", "Passport A12345678"], ["Nationality", "Nigerian"], ["Member Since", "March 2020"]].map(([k, v]) => <div key={k} className="flex flex-col"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>)}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-center" style={{ borderColor: "#F4F4F5" }}>
            <div><div className="text-xl font-bold" style={{ color: PRIMARY }}>15</div><div className="text-xs" style={{ color: MUTED }}>Total Stays</div></div>
            <div><div className="text-xl font-bold" style={{ color: PRIMARY }}>₦2.4M</div><div className="text-xs" style={{ color: MUTED }}>Lifetime Value</div></div>
          </div>
        </div>
        {/* Main */}
        <div className="lg:col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex border-b" style={{ borderColor: BORDER }}>
            {tabs.map(t => <button key={t} onClick={() => setTab(t)} className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: tab === t ? PRIMARY : MUTED, borderBottom: tab === t ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{t}</button>)}
          </div>
          <div className="p-5">
            {tab === "Overview" && <div className="space-y-4"><div className="p-4 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Current Stay</div><div className="text-sm" style={{ color: MUTED }}>BK-2849 · Suite 501 · 24–27 Jun 2025 · Confirmed, arriving today</div></div><div><div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Internal Notes</div><p className="text-sm" style={{ color: MUTED }}>VIP — always request champagne and fruit basket on arrival. Prefers high floors. Regular monthly business traveller. Never disturb before 10:00.</p></div></div>}
            {tab === "Stay History" && <div className="space-y-2">{[{ id: "BK-2849", dates: "24–27 Jun 2025", room: "Suite 501", total: "₦273,375", status: "Confirmed" }, { id: "BK-2741", dates: "15–18 May 2025", room: "Suite 501", total: "₦273,375", status: "Checked Out" }, { id: "BK-2630", dates: "8–10 Apr 2025", room: "Suite 502", total: "₦182,250", status: "Checked Out" }].map(s => <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="flex-1"><div className="text-sm font-medium" style={{ color: TEXT }}>{s.dates}</div><div className="text-xs" style={{ color: MUTED }}>{s.room} · <span style={{ fontFamily: mono }}>{s.id}</span></div></div><div className="text-sm font-bold" style={{ color: TEXT }}>{s.total}</div><Badge label={s.status} colors={resStC[s.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></div>)}</div>}
            {tab === "Preferences" && <div className="grid grid-cols-2 gap-3">{[["Room Type", "Suite — top floor"], ["Pillow Type", "Firm"], ["Wake-up Call", "07:30"], ["Newspaper", "The Punch"], ["Dietary", "No shellfish"], ["Temperature", "20°C"], ["Minibar", "Stock with whisky"], ["Amenities", "Extra towels × 4"]].map(([k, v]) => <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>)}</div>}
            {tab === "Folios" && <div className="text-sm" style={{ color: MUTED }}><p>No closed folios for current period. Previous folios archived.</p></div>}
            {tab === "Complaints & Feedback" && <EmptyState icon={CheckCircle2} message="No complaints or feedback on record. Excellent guest history." />}
          </div>
        </div>
      </div>
    </div>
  );
}

// FD-11 Walk-In Registration
