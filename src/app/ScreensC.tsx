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
export function WalkInReg({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [step, setStep] = useState(1);
  return (
    <div>
      <PageHeader title="Walk-In Registration" sub="Register a new guest and check in simultaneously" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && <>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <Inp label="First Name" placeholder="Chukwuemeka" />
                <Inp label="Last Name" placeholder="Okafor" />
                <Inp label="Phone" placeholder="+234 801 234 5678" />
                <Inp label="Email" placeholder="guest@email.com" />
                <Sel label="ID Type" options={["International Passport", "National ID", "Driver's License"]} />
                <Inp label="ID Number" placeholder="A12345678" />
              </div>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Stay Details</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Inp label="Check-in Date" type="date" defaultValue="2025-06-24" />
                <Inp label="Check-out Date" type="date" defaultValue="2025-06-25" />
                <Sel label="Room Type" options={["Standard — ₦35,000/night", "Deluxe — ₦55,000/night", "Suite — ₦85,000/night"]} />
                <Sel label="Room" options={["Auto-assign", "Room 102 (Standard)", "Room 104 (Standard)"]} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#F0FDF4", color: SUCCESS }}><CheckCircle2 size={13} />18 rooms available for tonight</div>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Payment</h3>
              <div className="grid grid-cols-2 gap-3"><Inp label="Deposit (₦)" defaultValue="35,000" /><Sel label="Method" options={["Cash", "POS / Card", "Bank Transfer"]} /></div>
            </div>
          </>}
          {step === 2 && (
            <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BORDER }}>
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: SUCCESS }} />
              <h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Guest Registered & Checked In</h2>
              <p className="text-sm mb-2" style={{ color: MUTED }}>Chukwuemeka Okafor · Room 102 · BK-2860 created</p>
              <p className="text-sm mb-5" style={{ color: TEAL }}>Deposit: ₦35,000 Cash received. Folio opened.</p>
              <div className="flex justify-center gap-3"><BtnO label="Print Receipt" icon={FileText} /><BtnO label="Activate Room Access" icon={Lock} /></div>
            </div>
          )}
          {step === 1 && <BtnP label="Register & Check In →" icon={CheckCircle2} onClick={() => { setStep(2); add({ type: "success", title: "Walk-in registered", body: "BK-2860 created · Room 102" }); }} />}
        </div>
        <div className="bg-white rounded-xl border p-5 h-fit" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Summary</h3>
          <div className="space-y-2 text-sm">{[["Guest", "—"], ["Room", "Standard (auto-assign)"], ["Check-in", "24 Jun 2025"], ["Check-out", "25 Jun 2025"], ["Nights", "1"], ["Rate", "₦35,000"], ["VAT", "₦2,625"], ["Total", "₦37,625"]].map(([k, v]) => <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}

// HK-04 Inspection Log
export function InspectionLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const logs = [
    { room: "104", inspector: "Grace Mensah", ts: "Today 09:45", result: "Pass", score: "18/20", issues: "Minor dust on top shelf", status: "Passed" },
    { room: "102", inspector: "Grace Mensah", ts: "Today 09:30", result: "Fail", score: "12/20", issues: "Bathroom not cleaned thoroughly, bed linen stained", status: "Re-assigned" },
    { room: "301", inspector: "David Okafor", ts: "Yesterday 16:00", result: "Pass", score: "20/20", issues: "None", status: "Passed" },
    { room: "203", inspector: "Grace Mensah", ts: "Yesterday 14:30", result: "Pass", score: "17/20", issues: "Minibar not restocked", status: "Passed" },
  ];
  const iC: Record<string, { bg: string; text: string }> = { Passed: { bg: "#DCFCE7", text: "#166534" }, "Re-assigned": { bg: "#FEE2E2", text: "#991B1B" } };
  return (
    <div>
      <PageHeader title="Inspection Log" sub="Supervisor inspections of cleaned rooms" actions={<BtnP label="New Inspection" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Backups Today" value="3" sub="Completed successfully" icon={CheckCircle2} accent={SUCCESS} /><StatCard label="Failed Today" value="1" sub="Retry scheduled" icon={AlertTriangle} accent={ERROR} /><StatCard label="Pass Rate" value="75%" sub="Last 30 days" icon={Activity} accent={PRIMARY} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Inspector", "Time", "Score", "Issues Found", "Result", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{logs.map((l, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 font-bold text-lg" style={{ color: PRIMARY }}>{l.room}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>{l.inspector}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{l.ts}</td><td className="px-5 py-3 text-sm font-bold" style={{ color: l.result === "Pass" ? SUCCESS : ERROR }}>{l.score}</td><td className="px-5 py-3 text-xs max-w-40" style={{ color: MUTED }}>{l.issues}</td><td className="px-5 py-3"><Badge label={l.status} colors={iC[l.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><button onClick={() => add({ type: "info", title: `Re-inspect Room ${l.room}` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Re-inspect</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// HK-06 Linen & Supplies
export function LinenSupplies({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const items = [
    { name: "Bath Towels", current: 45, par: 80, reorder: 30, unit: "pcs", status: "Low" },
    { name: "Hand Towels", current: 60, par: 80, reorder: 30, unit: "pcs", status: "Ok" },
    { name: "Bed Sheets (Queen)", current: 62, par: 100, reorder: 40, unit: "sets", status: "Ok" },
    { name: "Pillowcases", current: 95, par: 200, reorder: 80, unit: "pcs", status: "Low" },
    { name: "Duvet Covers", current: 48, par: 80, reorder: 30, unit: "pcs", status: "Ok" },
    { name: "Cleaning Cloths", current: 12, par: 50, reorder: 20, unit: "pcs", status: "Critical" },
    { name: "Mop Heads", current: 8, par: 20, reorder: 8, unit: "pcs", status: "Critical" },
  ];
  const sc = (s: string) => s === "Critical" ? { bg: "#FEE2E2", text: "#991B1B", bar: ERROR } : s === "Low" ? { bg: "#FEF3C7", text: "#92400E", bar: WARNING } : { bg: "#DCFCE7", text: "#166534", bar: SUCCESS };
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Low Stock Items" value={String(items.filter(i=>i.status==="Low").length)} sub="Below par level" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Critical Items" value={String(items.filter(i=>i.current<i.reorder).length)} sub="Reorder now" icon={TrendingDown} accent={WARNING} />
        <StatCard label="Total Item Types" value={String(items.length)} sub="Tracked in inventory" icon={Package} accent={PRIMARY} />
        <StatCard label="Ok Items" value={String(items.filter(i=>i.status==="Ok").length)} sub="Adequately stocked" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <PageHeader title="Linen & Supplies" sub="Stock levels against par for housekeeping items" actions={<><BtnO label="Request Restock" icon={Plus} /><BtnO label="Export" icon={Download} /></>} />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item", "Current / Par", "Reorder Point", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{items.map(item => { const c = sc(item.status); const pct = Math.min((item.current / item.par) * 100, 100); return <tr key={item.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-4 text-sm font-medium" style={{ color: TEXT }}>{item.name}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="text-sm font-bold w-8" style={{ color: c.text }}>{item.current}</span><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5", minWidth: 100 }}><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.bar }} /></div><span className="text-xs" style={{ color: SUBTLE }}>/ {item.par} {item.unit}</span></div></td><td className="px-5 py-4 text-sm" style={{ color: MUTED }}>{item.reorder} {item.unit}</td><td className="px-5 py-4"><Badge label={item.status} colors={{ bg: c.bg, text: c.text }} /></td><td className="px-5 py-4"><button onClick={() => add({ type: "info", title: `Restock requested: ${item.name}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Restock</button></td></tr>; })}</tbody>
        </table>
      </div>
    </div>
  );
}

// HK-08 Housekeeping Schedule
export function HousekeepingSchedule({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const attendants = ["Grace Achebe", "Amaka Osei", "Ngozi Ike"];
  const roomGroups = [["101", "102", "103", "104"], ["201", "202", "203", "204"], ["301", "302", "303", "304"]];
  const assigned: Record<string, string> = { "101": "Grace Achebe", "102": "Grace Achebe", "103": "Amaka Osei", "104": "Grace Achebe", "201": "Ngozi Ike", "202": "Ngozi Ike", "203": "", "204": "", "301": "Amaka Osei", "302": "Ngozi Ike", "303": "", "304": "" };
  return (
    <div>
      <PageHeader title="Housekeeping Schedule" sub="24 Jun 2025 · Room assignments per attendant" actions={<><BtnO label="Balance Workload" icon={RefreshCw} /><BtnP label="Print Assignments" icon={FileText} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Rooms Scheduled" value={String(roomGroups.flat().length)} sub="Today's assignments" icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Completed" value={"4"} sub="Cleaned & verified" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="In Progress" value={"2"} sub="Being cleaned now" icon={Activity} accent={ORANGE} />
        <StatCard label="Staff on Duty" value={String(attendants.length)} sub="Attendants working" icon={Users} accent={TEAL} />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">{attendants.map(a => { const count = Object.values(assigned).filter(v => v === a).length; return <div key={a} className="bg-white rounded-xl p-4 border text-center" style={{ borderColor: BORDER }}><div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-2" style={{ backgroundColor: PRIMARY }}>{a.split(" ").map(n => n[0]).join("")}</div><div className="text-sm font-semibold" style={{ color: TEXT }}>{a}</div><div className="text-2xl font-bold mt-1" style={{ color: PRIMARY }}>{count}</div><div className="text-xs" style={{ color: MUTED }}>rooms assigned</div></div>; })}</div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: "#F9FAFB" }}>
          <div className="w-20 flex-shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Room</div>
          {attendants.map(a => <div key={a} className="flex-1 text-center py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{a.split(" ")[0]}</div>)}
        </div>
        {roomGroups.flatMap(g => g).map(room => <div key={room} className="flex items-center border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5", minHeight: 44 }}><div className="w-20 flex-shrink-0 px-4 py-2 font-bold" style={{ color: PRIMARY }}>{room}</div>{attendants.map(a => <div key={a} className="flex-1 flex justify-center py-2"><div onClick={() => add({ type: "info", title: assigned[room] === a ? `Unassign ${a} from ${room}` : `Assign ${a} to ${room}` })} className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" style={{ borderColor: assigned[room] === a ? PRIMARY : "#CBD5E1", backgroundColor: assigned[room] === a ? PRIMARY : "transparent" }}>{assigned[room] === a && <CheckCircle2 size={12} color="white" />}</div></div>)}</div>)}
      </div>
    </div>
  );
}

// MX-02 Work Order Detail
export function WorkOrderDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const wo = WORK_ORDERS[0];
  const timeline = [
    { ts: "Today 08:58", event: "Work order created", by: "John Abubakar", note: "AC unit in Room 207 not cooling. Guest complaint." },
    { ts: "Today 09:05", event: "Assigned to technician", by: "Grace Mensah", note: "Assigned to Emeka Nwosu" },
    { ts: "Today 09:15", event: "Status → In Progress", by: "Emeka Nwosu", note: "Checked unit — compressor issue. Sourcing parts." },
  ];
  return (
    <div>
      <PageHeader title={`Work Order ${wo.id}`} sub={`${wo.location} · ${wo.cat} · Created Today 08:58`}
        actions={<><BtnO label="Escalate" icon={AlertTriangle} /><BtnP label="Close Order" icon={CheckCircle2} onClick={() => add({ type: "success", title: `${wo.id} closed` })} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[["Location", wo.location], ["Category", wo.cat], ["Priority", wo.priority], ["Status", wo.status], ["Assigned To", wo.tech], ["SLA Deadline", "Today 14:58"]].map(([k, v]) => <div key={k}><div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: MUTED }}>{k}</div><div className="text-sm font-semibold" style={{ color: k === "Priority" ? priC[v] : TEXT }}>{v as string}</div></div>)}
            </div>
            <div><div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: MUTED }}>Description</div><p className="text-sm" style={{ color: TEXT }}>AC unit not cooling in Room 207. Guest reported warm room temperature. Technician to inspect compressor, refrigerant levels, and filter.</p></div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Activity Log</h3>
            <div className="space-y-4">{timeline.map((t, i) => <div key={i} className="flex gap-3"><div className="flex flex-col items-center"><div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: PRIMARY }} />{i < timeline.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "#E4E4E7" }} />}</div><div className="pb-4 flex-1"><div className="flex items-baseline gap-2"><span className="text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{t.ts}</span><span className="text-xs font-semibold" style={{ color: PRIMARY }}>{t.event}</span></div><p className="text-sm mt-0.5" style={{ color: TEXT }}>{t.note}</p><div className="text-xs mt-0.5" style={{ color: MUTED }}>by {t.by}</div></div></div>)}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F4F4F5" }}>
              <textarea className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none mb-2" rows={2} placeholder="Add note or update…" style={{ borderColor: BORDER }} />
              <BtnP label="Post Update" icon={Send} onClick={() => add({ type: "success", title: "Update posted" })} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Update Status</h3>
            <div className="space-y-2">{["Reported", "Assigned", "In Progress", "Completed"].map(s => <button key={s} onClick={() => add({ type: "success", title: `Status → ${s}` })} className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: s === wo.status ? PRIMARY : BORDER, backgroundColor: s === wo.status ? "#EFF6FF" : "white", color: s === wo.status ? PRIMARY : MUTED }}><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: woC[s]?.text ?? SUBTLE }} />{s}</button>)}</div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Parts Used</h3>
            <p className="text-xs mb-2" style={{ color: MUTED }}>No parts logged yet.</p>
            <BtnO label="Log Parts" icon={Plus} />
          </div>
        </div>
      </div>
    </div>
  );
}

// MX-04 Asset Register
export function AssetRegister({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const astSt: Record<string, { bg: string; text: string }> = { Ok: { bg: "#DCFCE7", text: "#166534" }, "Due Soon": { bg: "#FEF3C7", text: "#92400E" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" } };
  return (
    <div>
      <PageHeader title="Asset Register" sub="All hotel assets with service history and warranty tracking" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Asset" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Assets" value={String(ASSETS.length)} sub="Registered items" icon={Package} accent={PRIMARY} />
        <StatCard label="Operational" value={String(ASSETS.filter(a=>a.condition==="Good"||a.condition==="Fair").length)} sub="In working condition" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Due Service" value="2" sub="Within 30 days" icon={CalendarDays} accent={WARNING} />
        <StatCard label="Poor Condition" value={String(ASSETS.filter(a=>a.condition==="Poor").length)} sub="Needs attention" icon={AlertTriangle} accent={ERROR} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Asset ID", "Name", "Category", "Location", "Warranty Expiry", "Last Serviced", "Next Service", "Status", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{ASSETS.map(a => <tr key={a.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.id}</td><td className="px-4 py-3 text-sm font-medium" style={{ color: TEXT }}>{a.name}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{a.cat}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{a.location}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{a.warranty}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{a.lastService}</td><td className="px-4 py-3 text-xs" style={{ color: a.status === "Overdue" ? ERROR : a.status === "Due Soon" ? ORANGE : MUTED }}>{a.nextService}</td><td className="px-4 py-3"><Badge label={a.status} colors={astSt[a.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "info", title: `Work order → ${a.name}` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Work Order</button><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>View</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// RT-05 Dining Reservations
export function DiningReservations({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Dining Reservations" sub="Restaurant booking management" actions={<><BtnO label="Walk-in Seat" icon={Plus} /><BtnP label="New Reservation" icon={Plus} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Tonight's Bookings" value={String(DINING_RES.length)} sub="Confirmed reservations" icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Total Covers" value={String(DINING_RES.reduce((s,r)=>s+r.party,0))} sub="Expected diners" icon={Users} accent={TEAL} />
        <StatCard label="Tables Reserved" value={String(new Set(DINING_RES.map(r=>r.table)).size)} sub="Of 24 available" icon={UtensilsCrossed} accent={ORANGE} />
        <StatCard label="Special Arrangements" value={String(DINING_RES.filter(r=>r.requests&&r.requests.length>0).length)} sub="Dietary / VIP notes" icon={Star} accent={SUCCESS} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          {["Today", "Tomorrow", "This Week"].map(f => <button key={f} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: f === "Today" ? PRIMARY : BORDER, backgroundColor: f === "Today" ? PRIMARY : "white", color: f === "Today" ? "white" : MUTED }}>{f}</button>)}
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date", "Time", "Party", "Guest", "Table", "Special Requests", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{DINING_RES.map((d, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{d.date}</td><td className="px-5 py-3 text-sm font-mono font-semibold" style={{ color: TEXT, fontFamily: mono }}>{d.time}</td><td className="px-5 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{d.party}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{d.guest}</td><td className="px-5 py-3"><Badge label={d.table} colors={{ bg: "#EFF6FF", text: PRIMARY }} /></td><td className="px-5 py-3 text-xs max-w-40" style={{ color: MUTED }}>{d.requests}</td><td className="px-5 py-3"><Badge label={d.status} colors={{ bg: "#CCFBF1", text: "#0F766E" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `${d.guest} seated` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Seat</button><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Cancel</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// RT-06 Room Service Orders
export function RoomServiceOrders({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { "In Kitchen": { bg: "#DBEAFE", text: "#1E40AF" }, "Delivered": { bg: "#DCFCE7", text: "#166534" }, "Assigned": { bg: "#FEF3C7", text: "#92400E" } };
  return (
    <div>
      <PageHeader title="Room Service Orders" sub="Manage and track room service from placement to delivery" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Active Orders" value="1" sub="In progress now" icon={ClipboardList} accent={ORANGE} /><StatCard label="In Kitchen" value="1" sub="Being prepared" icon={UtensilsCrossed} accent={PRIMARY} /><StatCard label="Delivered Today" value="3" sub="Completed orders" icon={CheckCircle2} accent={SUCCESS} /><StatCard label="Avg Delivery Time" value="22 min" sub="Room to door" icon={Clock} accent={TEAL} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Order ID", "Room", "Guest", "Items", "Ordered", "Promised", "Status", "Assigned To", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{ROOM_SERVICE_ORDERS.map(o => <tr key={o.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{o.id}</td><td className="px-4 py-3 font-bold" style={{ color: PRIMARY }}>{o.room}</td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{o.guest}</td><td className="px-4 py-3 text-xs max-w-36" style={{ color: MUTED }}>{o.items}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{o.ordered}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{o.promised}</td><td className="px-4 py-3"><Badge label={o.status} colors={stC[o.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{o.assigned}</td><td className="px-4 py-3"><button onClick={() => add({ type: "success", title: `${o.id} marked delivered` })} className="text-xs px-2 py-1 rounded border" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Delivered</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// CO-03 Announcements
export function Announcements({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <PageHeader title="Announcements" sub="Broadcast messages to all staff or specific departments" actions={<BtnP label="New Announcement" icon={Plus} onClick={() => setShowForm(p => !p)} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Active Announcements" value={String(ANNOUNCE_DATA.filter(a=>a.active).length)} sub="Visible to staff" icon={Bell} accent={PRIMARY} />
        <StatCard label="Drafts" value={String(ANNOUNCE_DATA.filter(a=>!a.active).length)} sub="Pending publish" icon={FileText} accent={WARNING} />
        <StatCard label="Recipients" value="47" sub="Staff across all depts" icon={Users} accent={TEAL} />
      </div>
      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>New Announcement</h3>
          <div className="grid grid-cols-2 gap-3 mb-3"><Inp label="Title" placeholder="Announcement title…" /><Sel label="Target Audience" options={["All Staff", "Front Desk", "Housekeeping", "Maintenance", "Finance", "Restaurant"]} /></div>
          <div className="mb-3"><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Body</label><textarea className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" rows={3} placeholder="Announcement details…" style={{ borderColor: BORDER }} /></div>
          <div className="flex gap-3"><BtnP label="Post Announcement" icon={Send} onClick={() => { add({ type: "success", title: "Announcement posted" }); setShowForm(false); }} /><BtnO label="Cancel" onClick={() => setShowForm(false)} /></div>
        </div>
      )}
      <div className="space-y-3">{ANNOUNCE_DATA.map(a => (
        <div key={a.id} className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="flex items-start justify-between mb-2">
            <div><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{a.title}</h3><div className="flex items-center gap-3 mt-1 text-xs" style={{ color: MUTED }}><span>By {a.by}</span><span>Expires {a.expires}</span><span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{a.audience}</span></div></div>
            <div className="text-right"><div className="text-xs font-semibold" style={{ color: a.read === a.total ? SUCCESS : WARNING }}>{a.read}/{a.total} read</div><div className="w-20 h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${(a.read / a.total) * 100}%`, backgroundColor: a.read === a.total ? SUCCESS : WARNING }} /></div></div>
          </div>
          <p className="text-sm" style={{ color: MUTED }}>{a.body}</p>
          <div className="flex gap-2 mt-3"><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button><button onClick={() => add({ type: "warning", title: `${a.id} archived` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Archive</button></div>
        </div>
      ))}</div>
    </div>
  );
}

// HR-02 Staff Profile Detail
export function StaffProfileDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Attendance Log", "Shifts", "Payroll Summary", "Management Notes"];
  const s = STAFF[0];
  return (
    <div>
      <PageHeader title={`Staff Profile — ${s.name}`} sub={`${s.id} · ${s.role} · ${s.dept}`}
        actions={<><BtnO label="Reset Password" icon={KeyRound} /><BtnP label="Edit Profile" icon={Edit3} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="text-center mb-4"><div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-2" style={{ backgroundColor: PRIMARY }}>{s.av}</div><div className="text-sm font-bold" style={{ color: TEXT }}>{s.name}</div><Badge label={s.status} colors={{ bg: "#DCFCE7", text: "#166534" }} /></div>
          <div className="space-y-2 text-xs border-t pt-3" style={{ borderColor: "#F4F4F5" }}>{[["Employee ID", s.id], ["Role", s.role], ["Department", s.dept], ["Phone", s.phone], ["Last Login", s.lastLogin]].map(([k, v]) => <div key={k} className="flex flex-col"><span style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>)}</div>
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex border-b" style={{ borderColor: BORDER }}>{tabs.map(t => <button key={t} onClick={() => setTab(t)} className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: tab === t ? PRIMARY : MUTED, borderBottom: tab === t ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{t}</button>)}</div>
          <div className="p-5">
            {tab === "Overview" && <div className="grid grid-cols-2 gap-3">{[["Full Name", s.name], ["Email", `${s.name.toLowerCase().replace(" ", ".")}@grandpalms.ng`], ["Start Date", "03 January 2022"], ["Contract Type", "Full-time"], ["Shift", "Morning · 07:00–15:00"], ["Emergency Contact", "Mrs. Mensah · +234 807 123 4567"]].map(([k, v]) => <div key={k}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>)}</div>}
            {tab === "Attendance Log" && <div className="text-sm" style={{ color: MUTED }}>June 2025: 22 days present, 0 absent, 1 leave day. Attendance rate: 95.7%</div>}
            {tab === "Shifts" && <div className="space-y-2">{["Mon 23 · Morning 07:00–15:00", "Tue 24 · Morning 07:00–15:00", "Wed 25 · Evening 15:00–23:00", "Thu 26 · Morning 07:00–15:00", "Fri 27 · Morning 07:00–15:00"].map(s => <div key={s} className="text-sm p-2 rounded-lg" style={{ backgroundColor: "#F9FAFB", color: TEXT }}>{s}</div>)}</div>}
            {tab === "Payroll Summary" && <div><div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>June 2025</div><div className="space-y-2">{[["Base Salary", "₦350,000"], ["Overtime", "₦0"], ["Deductions", "₦35,000"], ["Net Pay", "₦315,000"]].map(([k, v]) => <div key={k} className="flex justify-between text-sm border-b pb-2" style={{ borderColor: "#F4F4F5" }}><span style={{ color: MUTED }}>{k}</span><span className={`font-bold ${k === "Net Pay" ? "text-green-600" : ""}`} style={k !== "Net Pay" ? { color: TEXT } : {}}>{v as string}</span></div>)}</div></div>}
            {tab === "Management Notes" && <div><EmptyState icon={ClipboardList} message="No management notes on record." cta="Add Note" /></div>}
          </div>
        </div>
      </div>
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
          <tbody>{PAYROLL_DATA.map(p => <tr key={p.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><span className="text-sm font-medium" style={{ color: TEXT }}>{p.name}</span></div></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.dept}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>₦{p.baseSalary.toLocaleString()}</td><td className="px-5 py-3 text-sm" style={{ color: p.overtime > 0 ? TEAL : MUTED }}>{p.overtime > 0 ? `+₦${p.overtime.toLocaleString()}` : "—"}</td><td className="px-5 py-3 text-sm" style={{ color: ERROR }}>−₦{p.deductions.toLocaleString()}</td><td className="px-5 py-3 text-sm font-bold" style={{ color: SUCCESS }}>₦{p.net.toLocaleString()}</td><td className="px-5 py-3"><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Breakdown</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// MB-02 Branch Comparison
export function BranchComparison() {
  const compData = [
    { name: "Abuja", occ: 88, rev: 1250, adr: 55, revpar: 48, issues: 9 },
    { name: "Lagos", occ: 72, rev: 980, adr: 45, revpar: 32, issues: 4 },
    { name: "Port Harcourt", occ: 61, rev: 620, adr: 38, revpar: 23, issues: 2 },
  ];
  return (
    <div>
      <PageHeader title="Branch Comparison" sub="Side-by-side KPI comparison across all branches · June 2025" actions={<BtnO label="Export Report" icon={Download} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Best Performer" value="Lagos Main" sub="Highest occupancy this month" icon={TrendingUp} accent={SUCCESS} />
        <StatCard label="Total Revenue (All)" value="₦18.4M" sub="Across all branches" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Avg Occupancy" value="74%" sub="System-wide" icon={Activity} accent={TEAL} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Occupancy % by Branch</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={compData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`, "Occupancy"]} />
              <Bar dataKey="occ" name="Occupancy" fill={PRIMARY} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Revenue (₦K) by Branch</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={compData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`₦${v}K`, "Revenue"]} />
              <Bar dataKey="rev" name="Revenue" fill={TEAL} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>KPI Comparison Table</h3></div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Metric", ...compData.map(b => b.name)].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{[{ metric: "Occupancy %", key: "occ", fmt: (v: number) => `${v}%` }, { metric: "Revenue (₦K)", key: "rev", fmt: (v: number) => `₦${v}K` }, { metric: "ADR (₦K)", key: "adr", fmt: (v: number) => `₦${v}K` }, { metric: "RevPAR (₦K)", key: "revpar", fmt: (v: number) => `₦${v}K` }, { metric: "Open Issues", key: "issues", fmt: (v: number) => `${v}` }].map(row => <tr key={row.metric} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{row.metric}</td>{compData.map(b => <td key={b.name} className="px-5 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{row.fmt((b as any)[row.key])}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// RP-03 Department Reports
export function DepartmentReports({ role }: { role: Role }) {
  const deptData: Record<string, { metrics: Array<{ l: string; v: string; c: string }>; chartData: any[]; chartKey: string }> = {
    FD: { metrics: [{ l: "Check-ins Today", v: "12", c: PRIMARY }, { l: "Check-outs Today", v: "8", c: TEAL }, { l: "Walk-ins", v: "2", c: ORANGE }, { l: "Avg Processing", v: "4.2 min", c: SUCCESS }], chartData: [{ day: "Mon", checkins: 9, checkouts: 7 }, { day: "Tue", checkins: 11, checkouts: 8 }, { day: "Wed", checkins: 14, checkouts: 12 }, { day: "Thu", checkins: 10, checkouts: 9 }, { day: "Fri", checkins: 16, checkouts: 11 }, { day: "Sat", checkins: 18, checkouts: 14 }], chartKey: "checkins" },
    HK: { metrics: [{ l: "Rooms Cleaned", v: "31", c: SUCCESS }, { l: "Avg Turnaround", v: "42 min", c: TEAL }, { l: "Inspection Pass Rate", v: "75%", c: ORANGE }, { l: "DND Flagged", v: "2", c: ERROR }], chartData: [{ day: "Mon", cleaned: 28, inspected: 24 }, { day: "Tue", cleaned: 31, inspected: 26 }, { day: "Wed", cleaned: 35, inspected: 30 }, { day: "Thu", cleaned: 29, inspected: 25 }, { day: "Fri", cleaned: 38, inspected: 32 }], chartKey: "cleaned" },
    MX: { metrics: [{ l: "Orders Created", v: "5", c: ERROR }, { l: "Orders Closed", v: "3", c: SUCCESS }, { l: "Avg Resolution", v: "6.2 hrs", c: ORANGE }, { l: "Overdue", v: "2", c: ERROR }], chartData: [{ day: "Mon", created: 3, closed: 4 }, { day: "Tue", created: 5, closed: 3 }, { day: "Wed", created: 2, closed: 5 }, { day: "Thu", created: 6, closed: 3 }, { day: "Fri", created: 4, closed: 6 }], chartKey: "created" },
    default: { metrics: [{ l: "Revenue Today", v: "₦1.25M", c: SUCCESS }, { l: "Occupancy", v: "88%", c: PRIMARY }, { l: "Active Guests", v: "94", c: ORANGE }, { l: "Open Issues", v: "9", c: ERROR }], chartData: occData.map(d => ({ day: d.day, value: d.occ })), chartKey: "value" },
  };
  const cfg = deptData[role] ?? deptData.default;
  return (
    <div>
      <PageHeader title="Department Reports" sub={`Showing report for role: ${role} · June 2025`} actions={<><BtnO label="Export" icon={Download} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Staff" value={String(STAFF.length)} sub="Across all departments" icon={Users} accent={PRIMARY} />
        <StatCard label="Avg Attendance" value="94%" sub="Last 30 days" icon={UserCheck} accent={SUCCESS} />
        <StatCard label="Open Issues" value="3" sub="Pending resolution" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Total Payroll" value={"₦2.8M"} sub="Monthly cost" icon={DollarSign} accent={TEAL} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">{cfg.metrics.map((m: {l:string;v:string;c:string}) => <StatCard key={m.l} label={m.l} value={m.v} sub="" icon={Activity} accent={m.c} />)}</div>
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cfg.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} />
            <Bar key={`dept-bar-${cfg.chartKey}`} dataKey={cfg.chartKey} fill={PRIMARY} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// RP-04 Guest Analytics
export function GuestAnalytics() {
  return (
    <div>
      <PageHeader title="Guest Analytics" sub="Repeat guest rate, nationality, stay duration · June 2025" actions={<BtnO label="Export" icon={Download} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Repeat Guest Rate" value="42%" sub="Up 7pp vs May" icon={Users} accent={PRIMARY} delta="+7pp vs May" deltaPositive /><StatCard label="Avg Stay Duration" value="2.8 nights" sub="+0.3 vs last month" icon={CalendarDays} accent={TEAL} delta="+0.3 nights" deltaPositive /><StatCard label="New Guests" value="58%" sub="Of total arrivals" icon={UserCheck} accent={ORANGE} /><StatCard label="Guest Satisfaction" value="4.6/5" sub="34 reviews this month" icon={Star} accent={SUCCESS} delta="+0.2 vs last month" deltaPositive /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Repeat vs New Guests — Monthly</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GUEST_ANALYTICS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
              <Bar dataKey="repeat" name="Repeat" fill={PRIMARY} stackId="b" />
              <Bar dataKey="new" name="New" fill={TEAL} radius={[4, 4, 0, 0]} stackId="b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Guest Nationality</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={NATIONALITY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">{NATIONALITY_DATA.map((e, i) => <Cell key={`nat-cell-${i}`} fill={e.color} />)}</Pie><Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{NATIONALITY_DATA.map(n => <div key={n.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: n.color }} />{n.name}</div><span className="font-semibold" style={{ color: TEXT }}>{n.value}%</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}

// ST-01 Hotel Configuration
export function HotelConfig({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const modules = [{ name: "Reservations & Front Desk", desc: "Core booking and check-in/out module", on: true, required: true }, { name: "Housekeeping", desc: "Room cleaning management and inspections", on: true, required: false }, { name: "Maintenance", desc: "Work orders, assets, preventive schedules", on: true, required: false }, { name: "Restaurant / POS", desc: "POS terminal, kitchen display, menu management", on: true, required: false }, { name: "Inventory", desc: "Stock management and purchase orders", on: true, required: false }, { name: "Multi-Branch Dashboard", desc: "Cross-branch comparison and central sync", on: true, required: false }, { name: "Door Lock Integration", desc: "TTLock API integration for smart locks", on: true, required: false }];
  return (
    <div>
      <PageHeader title="Hotel Configuration" sub="Property profile, enabled modules, and tax settings" />
      <div className="space-y-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Property Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Hotel Name" defaultValue="Grand Palms Hotel" />
            <Inp label="Branch Name" defaultValue="Abuja Branch" />
            <Inp label="Address" defaultValue="Plot 14, Diplomatic Zone, Abuja" />
            <Inp label="Phone" defaultValue="+234 901 234 5678" />
            <Sel label="Currency" options={["NGN — Nigerian Naira", "USD — US Dollar", "GBP — British Pound"]} />
            <Sel label="Timezone" options={["Africa/Lagos (WAT, UTC+1)", "UTC"]} />
            <Inp label="Check-in Time" defaultValue="14:00" />
            <Inp label="Check-out Time" defaultValue="11:00" />
          </div>
          <div className="mt-4"><BtnP label="Save Profile" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Property profile saved" })} /></div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Enabled Modules</h3>
          <p className="text-xs mb-4" style={{ color: MUTED }}>Toggling a module hides it from the sidebar and disables all related features. Changes sync to all branch devices automatically.</p>
          <div className="space-y-3">{modules.map(m => <div key={m.name} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div><div className="text-sm font-medium" style={{ color: TEXT }}>{m.name}{m.required && <span className="ml-2 text-xs" style={{ color: MUTED }}>(required)</span>}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{m.desc}</div></div><div className="w-10 h-5 rounded-full relative flex-shrink-0 ml-4" style={{ backgroundColor: m.on ? TEAL : "#CBD5E1", opacity: m.required ? 0.5 : 1 }}><div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow" style={{ left: m.on ? 22 : 2 }} /></div></div>)}</div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Tax Configuration</h3>
          <div className="grid grid-cols-3 gap-4 mb-3"><Inp label="Tax Name" defaultValue="VAT" /><Inp label="Rate (%)" defaultValue="7.5" /><Sel label="Application" options={["Inclusive", "Exclusive"]} /></div>
          <div className="mb-4"><Sel label="Applicable to" options={["All Categories", "Room Revenue Only", "F&B Only", "Custom"]} /></div>
          <BtnP label="Save Tax Settings" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Tax settings saved" })} />
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Pricing Rules</h3>
          <div className="grid grid-cols-2 gap-4"><Inp label="Rate Rounding (₦)" defaultValue="100" /><Inp label="Discount Approval Threshold (₦)" defaultValue="5000" /></div>
          <p className="text-xs mt-2" style={{ color: MUTED }}>Discounts above ₦5,000 require Manager approval before being applied to a folio.</p>
          <div className="mt-3"><BtnP label="Save Rules" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Pricing rules saved" })} /></div>
        </div>
      </div>
    </div>
  );
}

// ST-03 My Preferences
export function MyPreferences({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [theme, setTheme] = useState("Light");
  const [lang, setLang] = useState("English");
  const notifPrefs = [{ label: "Reservation notifications", on: true }, { label: "Housekeeping alerts", on: true }, { label: "Maintenance work orders", on: false }, { label: "Finance notifications", on: true }, { label: "Door lock events", on: true }, { label: "Internal chat messages", on: true }, { label: "Shift handover reminders", on: true }];
  return (
    <div>
      <PageHeader title="My Preferences" sub="Grace Mensah · Hotel Manager — Personal settings" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Display & Language</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Language</label><div className="flex gap-2">{["English", "Hausa", "Yoruba", "Igbo"].map(l => <button key={l} onClick={() => setLang(l)} className="px-3 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: lang === l ? PRIMARY : BORDER, backgroundColor: lang === l ? "#EFF6FF" : "white", color: lang === l ? PRIMARY : MUTED }}>{l}</button>)}</div></div>
              <div><label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Theme</label><div className="flex gap-2">{["Light", "Dark", "System"].map(t => <button key={t} onClick={() => setTheme(t)} className="px-3 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: theme === t ? PRIMARY : BORDER, backgroundColor: theme === t ? "#EFF6FF" : "white", color: theme === t ? PRIMARY : MUTED }}>{t}</button>)}</div></div>
              <Sel label="Date Format" options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
              <Sel label="Time Format" options={["24-hour (14:30)", "12-hour (2:30 PM)"]} />
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Dashboard Widget Layout</h3>
            <p className="text-xs mb-3" style={{ color: MUTED }}>Drag to reorder widgets on your dashboard.</p>
            {["Occupancy & Revenue Chart", "Room Status Panel", "Department KPIs", "Recent Activity", "Arrivals Today"].map((w, i) => <div key={w} className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-grab" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}><span className="text-[#CBD5E1]">⠿</span><span className="text-sm flex-1" style={{ color: TEXT }}>{w}</span><span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>#{i + 1}</span></div>)}
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Notification Preferences</h3>
            <div className="space-y-3">{notifPrefs.map(n => <div key={n.label} className="flex items-center justify-between py-1.5"><span className="text-sm" style={{ color: TEXT }}>{n.label}</span><div className="w-10 h-5 rounded-full relative" style={{ backgroundColor: n.on ? TEAL : "#CBD5E1" }}><div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow" style={{ left: n.on ? 22 : 2 }} /></div></div>)}</div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Security</h3>
            <BtnO label="Change Password" icon={KeyRound} /><p className="text-xs mt-2" style={{ color: MUTED }}>Last changed 45 days ago. We recommend changing every 90 days.</p>
          </div>
          <BtnP label="Save All Preferences" icon={CheckCircle2} onClick={() => add({ type: "success", title: "Preferences saved" })} />
        </div>
      </div>
    </div>
  );
}

// ─── FINAL SCREENS BATCH ──────────────────────────────────────────────────────











// R-04 Group Bookings
export function GroupBookings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const groups = [
    { id: "GRP-001", name: "Dangote Group Executive Retreat", type: "Corporate", contact: "Mrs. Toyin Ahmed", rooms: 12, checkin: "28 Jun", checkout: "30 Jun", status: "Confirmed" },
    { id: "GRP-002", name: "Adeyemi Wedding Party", type: "Wedding", contact: "Mr. Bolu Adeyemi", rooms: 8, checkin: "05 Jul", checkout: "07 Jul", status: "Confirmed" },
  ];
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", type: "Corporate", contact: "", rooms: "5", checkin: "", checkout: "" });

  const createGroup = () => {
    if (!newGroup.name || !newGroup.contact) { add({ type: "warning", title: "Fill in group name and contact" }); return; }
    setShowCreate(false);
    add({ type: "success", title: "Group booking created", body: `${newGroup.name} · ${newGroup.rooms} rooms · ${newGroup.type}` });
    setNewGroup({ name: "", type: "Corporate", contact: "", rooms: "5", checkin: "", checkout: "" });
  };

  return (
    <div>
      <PageHeader title="Group Bookings" sub="Block bookings for groups, conferences, and events" actions={<BtnP label="New Group Booking" icon={Plus} onClick={() => setShowCreate(true)} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Active Groups" value={String(groups.length)} sub="Confirmed group blocks" icon={Users} accent={PRIMARY} />
        <StatCard label="Total Rooms Reserved" value={String(groups.reduce((s,g)=>s+g.rooms,0))} sub="Across all groups" icon={BedDouble} accent={TEAL} />
        <StatCard label="Est. Guests" value={String(groups.reduce((s,g)=>s+g.rooms*3,0))} sub="Expected guests" icon={CalendarDays} accent={ORANGE} />
      </div>
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="text-base font-semibold" style={{ color: TEXT }}>{g.name}</h3><div className="flex items-center gap-3 mt-1 text-xs" style={{ color: MUTED }}><span style={{ fontFamily: mono }}>{g.id}</span><span>{g.type}</span><span>Contact: {g.contact}</span></div></div>
              <Badge label={g.status} colors={{ bg: "#CCFBF1", text: "#0F766E" }} />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[{ l: "Rooms Blocked", v: g.rooms.toString() }, { l: "Check-in", v: g.checkin }, { l: "Check-out", v: g.checkout }, { l: "Nights", v: "2" }].map(s => <div key={s.l} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#F9FAFB" }}><div className="text-lg font-bold" style={{ color: TEXT }}>{s.v}</div><div className="text-xs" style={{ color: MUTED }}>{s.l}</div></div>)}
            </div>
            <div className="flex gap-2">
              <BtnO label="View Rooming List" icon={Users} />
              <BtnO label="Master Folio" icon={FileText} />
              <button onClick={() => add({ type: "info", title: `PDF generated — ${g.id}` })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border bg-white" style={{ color: MUTED, borderColor: BORDER }}><Download size={14} />Export PDF</button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-xl border" style={{ borderColor: BORDER }}>
          <EmptyState icon={Users} message="Create a new group booking to manage block reservations for corporate events, weddings, and conferences." cta="New Group Booking" onCta={() => add({ type: "info", title: "Group booking form" })} />
        </div>
      </div>
    </div>
  );
}

// R-05 Waitlist
export function Waitlist({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Waitlist" sub={`${WAITLIST_DATA.length} guests waiting for a room`} actions={<BtnP label="Add to Waitlist" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="On Waitlist" value={String(WAITLIST_DATA.length)} sub="Awaiting room" icon={Users} accent={PRIMARY} />
        <StatCard label="Avg Wait Time" value="2.3 days" sub="Based on occupancy" icon={Clock} accent={WARNING} />
        <StatCard label="Converted This Month" value="12" sub="From waitlist to booking" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Priority", "Ref", "Guest", "Room Type", "Requested Dates", "Waiting", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{WAITLIST_DATA.map(w => (
            <tr key={w.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}>
              <td className="px-5 py-3"><div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: w.priority === 1 ? ERROR : w.priority === 2 ? ORANGE : MUTED }}>{w.priority}</div></td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.id}</td>
              <td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{w.guest}</td>
              <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{w.type}</span></td>
              <td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{w.dates}</td>
              <td className="px-5 py-3 text-xs font-semibold" style={{ color: ORANGE }}>{w.waiting}</td>
              <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `${w.guest} promoted to reservation` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Promote</button><button onClick={() => add({ type: "info", title: `Contacted ${w.guest}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Contact</button><button onClick={() => add({ type: "warning", title: `${w.guest} removed from waitlist` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Remove</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// R-06 Rate Management
export function RateManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [plans, setPlans] = useState(RATE_PLANS.map(r => ({ ...r })));
  const [editPlan, setEditPlan] = useState<(typeof RATE_PLANS)[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", base: "", dates: "" });

  const openEdit = (r: typeof RATE_PLANS[0]) => {
    setEditPlan(r);
    setEditValues({ name: r.name, base: r.base.toString(), dates: r.dates });
  };
  const saveEdit = () => {
    if (!editPlan) return;
    setPlans(p => p.map(r => r.id === editPlan.id ? { ...r, name: editValues.name, base: Number(editValues.base) || r.base, dates: editValues.dates } : r));
    setEditPlan(null);
    add({ type: "success", title: "Rate plan updated", body: editValues.name });
  };
  const toggleActive = (id: string) => {
    setPlans(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const plan = plans.find(r => r.id === id);
    add({ type: plan?.active ? "warning" : "success", title: `${plan?.name} ${plan?.active ? "deactivated" : "activated"}` });
  };

  return (
    <div>
      <PageHeader title="Rate Management" sub="All rate plans, seasonal pricing, and corporate rates"
        actions={<BtnP label="Create Rate Plan" icon={Plus} onClick={() => setShowCreate(true)} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Rate Plans" value={String(RATE_PLANS.filter(r=>r.active).length)} sub="Currently published" icon={DollarSign} accent={SUCCESS} />
        <StatCard label="Inactive Plans" value={String(RATE_PLANS.filter(r=>!r.active).length)} sub="Disabled or seasonal" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Total Plans" value={String(RATE_PLANS.length)} sub="All rate categories" icon={Layers} accent={PRIMARY} />
        <StatCard label="Avg Base Rate" value={`₦${Math.round(RATE_PLANS.reduce((s,r)=>s+r.base,0)/RATE_PLANS.length).toLocaleString()}`} sub="Across all room types" icon={TrendingUp} accent={TEAL} />
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB", borderBottom: `2px solid ${BORDER}` }}>{["Plan ID", "Rate Plan Name", "Room Types", "Base Rate (₦)", "Applicable Dates", "Active", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{plans.map((r, i) => (
            <tr key={r.id} className="border-t hover:bg-[#F4F4F5] transition-colors" style={{ borderColor: "#F4F4F5", backgroundColor: i % 2 === 0 ? "white" : "#FAFBFD" }}>
              <td className="px-5 py-3.5 text-xs font-mono" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
              <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: TEXT }}>{r.name}</td>
              <td className="px-5 py-3.5"><div className="flex gap-1 flex-wrap">{r.rooms.map(rt => <span key={rt} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{rt}</span>)}</div></td>
              <td className="px-5 py-3.5 text-sm font-bold" style={{ color: PRIMARY }}>₦{r.base.toLocaleString()}</td>
              <td className="px-5 py-3.5 text-xs" style={{ color: MUTED }}>{r.dates}</td>
              <td className="px-5 py-3.5">
                <button onClick={() => toggleActive(r.id)} className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: r.active ? TEAL : "#CBD5E1" }}>
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: r.active ? 22 : 2 }} />
                </button>
              </td>
              <td className="px-5 py-3.5">
                <button onClick={() => openEdit(r)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold hover:shadow-sm transition-all" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Edit</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Edit Rate Plan Modal */}
      {editPlan && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setEditPlan(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: "1px solid #E4E4E7" }}>
            <h3 className="text-base font-bold mb-1" style={{ color: "#18181B", fontFamily: "'Inter', system-ui, sans-serif" }}>Edit Rate Plan</h3>
            <p className="text-xs mb-5" style={{ color: "#71717A" }}>Changes apply immediately to all new reservations using this plan.</p>
            <div className="space-y-4">
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#71717A" }}>Plan Name</label>
                <input value={editValues.name} onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E4E4E7", color: "#18181B" }} onFocus={e => e.target.style.borderColor = "#18181B"} onBlur={e => e.target.style.borderColor = "#E4E4E7"} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#71717A" }}>Base Rate (₦ per night)</label>
                <input type="number" value={editValues.base} onChange={e => setEditValues(p => ({ ...p, base: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E4E4E7", color: "#18181B" }} onFocus={e => e.target.style.borderColor = "#18181B"} onBlur={e => e.target.style.borderColor = "#E4E4E7"} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#71717A" }}>Applicable Dates</label>
                <input value={editValues.dates} onChange={e => setEditValues(p => ({ ...p, dates: e.target.value }))} placeholder="e.g. Year-round, Dec 20 – Jan 5, Fri–Sun" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E4E4E7", color: "#18181B" }} onFocus={e => e.target.style.borderColor = "#18181B"} onBlur={e => e.target.style.borderColor = "#E4E4E7"} /></div>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}>
                ⚠ Rate changes do not affect existing confirmed reservations — only new bookings made after this change.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditPlan(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: "#71717A", borderColor: "#E4E4E7" }}>Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#18181B" }}>Save Changes</button>
            </div>
          </div>
        </>
      )}

      {/* Create new rate plan */}
      {showCreate && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowCreate(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: "1px solid #E4E4E7" }}>
            <h3 className="text-base font-bold mb-5" style={{ color: "#18181B", fontFamily: "'Inter', system-ui, sans-serif" }}>Create Rate Plan</h3>
            <div className="space-y-4">
              {[["Plan Name", "e.g. Early Bird Discount"], ["Base Rate (₦)", "e.g. 42000"], ["Applicable Dates", "e.g. Jul 1 – Aug 31"]].map(([label, placeholder]) => (
                <div key={label}><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#71717A" }}>{label}</label><input placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E4E4E7", color: "#18181B" }} onFocus={e => e.target.style.borderColor = "#18181B"} onBlur={e => e.target.style.borderColor = "#E4E4E7"} /></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: "#71717A", borderColor: "#E4E4E7" }}>Cancel</button>
              <button onClick={() => { setShowCreate(false); add({ type: "success", title: "Rate plan created" }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#18181B" }}>Create Plan</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// R-08 Cancellation & Refund
export function CancellationRefund({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [waived, setWaived] = useState(false);
  const res = ALL_RES[6]; // BK-2840 Tunde Bakare
  const cancFee = 17500;
  const deposit = 35000;
  const refund = waived ? deposit : deposit - cancFee;
  return (
    <div>
      <PageHeader title="Cancellation & Refund" sub="Process reservation cancellation with policy enforcement" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Cancellations This Month" value={"24"} sub="Total processed" icon={XCircle} accent={ERROR} />
        <StatCard label="Total Refunds" value={`₦${"384,500"}`} sub="Returned to guests" icon={DollarSign} accent={WARNING} />
        <StatCard label="Fees Collected" value={`₦${"98,000"}`} sub="Cancellation charges" icon={TrendingUp} accent={SUCCESS} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Reservation to Cancel</h3>
          <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: "#F9FAFB" }}>
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>TB</div><div><div className="text-sm font-semibold" style={{ color: TEXT }}>{res.guest}</div><div className="text-xs" style={{ color: MUTED }}>{res.id} · {res.type} · {res.checkin}–{res.checkout}</div></div></div>
            {[["Rate Plan", "Standard Rate"], ["Total Value", `₦${(res.rate * res.nights * 1.075).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`], ["Deposit Paid", `₦${deposit.toLocaleString()}`]].map(([k, v]) => <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v as string}</span></div>)}
          </div>
          <div className="border-l-4 p-4 rounded-r-xl mb-4" style={{ borderColor: WARNING, backgroundColor: "#FFFBEB" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#92400E" }}>Cancellation Policy</div>
            <ul className="text-xs space-y-1" style={{ color: "#92400E" }}>
              <li>• Free cancellation up to 48 hours before check-in</li>
              <li>• Within 48 hours: 50% of first night charged (₦{cancFee.toLocaleString()})</li>
              <li>• No-show: 100% of first night charged</li>
            </ul>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span style={{ color: MUTED }}>Cancellation fee owed</span><span className="font-bold" style={{ color: ERROR }}>₦{cancFee.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Deposit paid</span><span style={{ color: TEXT }}>₦{deposit.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold border-t pt-2" style={{ borderColor: BORDER }}><span style={{ color: TEXT }}>Refundable amount</span><span style={{ color: refund > 0 ? SUCCESS : ERROR }}>₦{refund.toLocaleString()}</span></div>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-4" style={{ borderColor: waived ? WARNING : BORDER, backgroundColor: waived ? "#FFFBEB" : "white" }}>
            <div className="w-4 h-4 rounded border-2 flex items-center justify-center" style={{ borderColor: waived ? WARNING : "#CBD5E1", backgroundColor: waived ? WARNING : "transparent" }}>{waived && <CheckCircle2 size={10} color="white" />}</div>
            <input type="checkbox" className="hidden" checked={waived} onChange={e => setWaived(e.target.checked)} />
            <div><div className="text-sm font-medium" style={{ color: TEXT }}>Waive cancellation fee</div><div className="text-xs" style={{ color: MUTED }}>Requires manager authorisation and reason</div></div>
          </label>
          {waived && <div className="mb-4"><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Reason for waiver</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none" rows={2} placeholder="e.g. Guest experienced medical emergency…" style={{ borderColor: BORDER }} /></div>}
          <div className="flex gap-3">
            <BtnO label="Cancel & Keep Fee" onClick={() => add({ type: "warning", title: "Reservation cancelled", body: `₦${(deposit - cancFee).toLocaleString()} refund queued` })} />
            <button onClick={() => add({ type: "error", title: "Reservation cancelled", body: `Full refund ₦${deposit.toLocaleString()} processed` })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: ERROR }}>Confirm Cancellation</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Process Refund</h3>
          <Sel label="Refund Method" options={["Original payment method", "Cash", "Bank Transfer"]} />
          <div className="mt-3"><Inp label="Refund Amount (₦)" defaultValue={refund.toLocaleString()} /></div>
          <div className="mt-3"><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Notes for guest</label><textarea className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" rows={3} placeholder="Optional message to include with refund notification…" style={{ borderColor: BORDER }} /></div>
          <div className="mt-4"><BtnP label="Process Refund" icon={DollarSign} onClick={() => add({ type: "success", title: "Refund processed", body: `₦${refund.toLocaleString()} → ${res.guest}` })} /></div>
        </div>
      </div>
    </div>
  );
}

// FD-09 Key Card Management
export function KeyCardMgmt({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [encoderSt] = useState<"connected" | "encoding" | "disconnected">("connected");
  const cards = [
    { room: "101", guest: "Adaeze Okonkwo", count: 1, lastIssued: "22 Jun 14:03", by: "John A." },
    { room: "202", guest: "Emmanuel Adeyemi", count: 2, lastIssued: "23 Jun 14:12", by: "John A." },
    { room: "304", guest: "Chukwuemeka Obi", count: 1, lastIssued: "24 Jun 10:00", by: "John A." },
  ];
  const encC = { connected: { dot: SUCCESS, label: "Encoder Connected (USB)" }, encoding: { dot: WARNING, label: "Encoding in progress…" }, disconnected: { dot: ERROR, label: "Encoder not detected" } }[encoderSt];
  return (
    <div>
      <PageHeader title="Key Card Management" sub="Issue, re-encode, and deactivate physical room key cards" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Cards" value={String(cards.length)} sub="Currently issued" icon={CreditCard} accent={SUCCESS} />
        <StatCard label="Issued Today" value={String("3")} sub="New issuances" icon={Activity} accent={PRIMARY} />
        <StatCard label="Expired / Revoked" value={String("0")} sub="Deactivated cards" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Rooms Covered" value={String(cards.length)} sub="Unique rooms" icon={BedDouble} accent={TEAL} />
      </div>
      {/* Encoder status */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: encC.dot }} /><span className="text-sm font-medium" style={{ color: TEXT }}>{encC.label}</span></div>
        <div className="ml-auto flex gap-2"><button onClick={() => add({ type: "info", title: "Encoder test complete — 1 device found" })} className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Test Encoder</button></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F4F4F5" }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Active Key Cards</h3></div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest", "Cards Issued", "Last Issued", "By", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{cards.map(c => (
            <tr key={c.room} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}>
              <td className="px-5 py-3 font-bold text-lg" style={{ color: PRIMARY }}>{c.room}</td>
              <td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{c.guest}</td>
              <td className="px-5 py-3"><span className="text-xl font-bold" style={{ color: TEXT }}>{c.count}</span></td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{c.lastIssued}</td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{c.by}</td>
              <td className="px-5 py-3"><div className="flex gap-1">
                <button onClick={() => add({ type: "success", title: "Card encoded", body: `Room ${c.room} — insert blank card into encoder` })} disabled={encoderSt !== "connected"} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium disabled:opacity-40" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Encode New</button>
                <button onClick={() => add({ type: "warning", title: `Card deactivated — Room ${c.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Deactivate Lost</button>
                <button onClick={() => add({ type: "info", title: `History — Room ${c.room}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>History</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// HK-02 My Tasks (tablet-optimised)
export function HKMyTasks({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const setStatus = (id: string, s: string) => { setStatuses(p => ({ ...p, [id]: s })); add({ type: "success", title: `Room ${id} → ${s}` }); };
  return (
    <div>
      <PageHeader title="My Tasks — Grace Achebe" sub="24 Jun 2025 · Morning Shift · 4 rooms assigned" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="My Tasks Today" value={"4"} sub="Assigned to you" icon={ClipboardList} accent={PRIMARY} />
        <StatCard label="Completed" value={"1"} sub="Finished rooms" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Remaining" value={"3"} sub="Still to clean" icon={AlertCircle} accent={ORANGE} />
      </div>
      <div className="space-y-3">
        {HK_TASK_ROOMS.map(r => {
          const st = statuses[r.id] ?? r.hkStatus;
          const stC = hkC[st] ?? { bg: "#F4F4F5", text: "#374151" };
          return (
            <div key={r.id} className="bg-white rounded-xl border p-5" style={{ borderColor: r.priority ? ORANGE : BORDER, borderWidth: r.priority ? 2 : 1 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: PRIMARY }}>{r.id}</div>
                  <div><div className="flex items-center gap-2"><span className="text-xl font-bold" style={{ color: TEXT }}>Room {r.id}</span>{r.priority && <span className="text-xs px-2 py-1 rounded-lg font-bold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>PRIORITY</span>}</div><div className="text-sm mt-0.5" style={{ color: MUTED }}>{r.type} · Floor {r.floor} · {r.guestStatus}</div>{r.notes && <div className="text-sm mt-1 font-medium" style={{ color: ORANGE }}>{r.notes}</div>}</div>
                </div>
                <Badge label={st} colors={stC} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {st === "Dirty" && <button onClick={() => setStatus(r.id, "In Progress")} className="flex-1 py-3 rounded-xl text-sm font-bold text-white min-h-[48px]" style={{ backgroundColor: PRIMARY }}>Start Cleaning</button>}
                {st === "In Progress" && <button onClick={() => setStatus(r.id, "Clean")} className="flex-1 py-3 rounded-xl text-sm font-bold text-white min-h-[48px]" style={{ backgroundColor: SUCCESS }}>Mark Cleaned</button>}
                {st === "Clean" && <div className="flex-1 py-3 rounded-xl text-sm font-bold text-center min-h-[48px] flex items-center justify-center" style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}>✓ Cleaned — Awaiting Inspection</div>}
                {(st === "Dirty" || st === "In Progress") && <>
                  <button onClick={() => add({ type: "warning", title: `Issue flagged — Room ${r.id}` })} className="px-4 py-3 rounded-xl text-sm font-medium border min-h-[48px]" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Flag Issue</button>
                  <button onClick={() => add({ type: "info", title: `Lost item logged — Room ${r.id}` })} className="px-4 py-3 rounded-xl text-sm font-medium border min-h-[48px]" style={{ color: MUTED, borderColor: BORDER }}>Log Lost & Found</button>
                </>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// MX-06 Preventive Schedule
export function PreventiveSchedule({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const tasks = [
    { id: "PS-001", asset: "Central AC Unit", freq: "Monthly", lastDone: "12 Mar 2025", nextDue: "12 Jun 2025", status: "Overdue", tech: "Emeka Nwosu" },
    { id: "PS-002", asset: "Diesel Generator", freq: "Monthly", lastDone: "15 May 2025", nextDue: "15 Jun 2025", status: "Overdue", tech: "Emeka Nwosu" },
    { id: "PS-003", asset: "Elevator #1", freq: "Quarterly", lastDone: "01 Jun 2025", nextDue: "01 Sep 2025", status: "Ok", tech: "External Vendor" },
    { id: "PS-004", asset: "Pool Filtration", freq: "Monthly", lastDone: "20 Apr 2025", nextDue: "20 Jul 2025", status: "Ok", tech: "Chidi Ike" },
    { id: "PS-005", asset: "Fire Extinguishers", freq: "Annual", lastDone: "10 Jan 2025", nextDue: "10 Jan 2026", status: "Ok", tech: "External Vendor" },
    { id: "PS-006", asset: "Commercial Refrigerator", freq: "Quarterly", lastDone: "10 May 2025", nextDue: "10 Aug 2025", status: "Ok", tech: "Chidi Ike" },
  ];
  const stC: Record<string, { bg: string; text: string }> = { Ok: { bg: "#DCFCE7", text: "#166534" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" }, "Due Soon": { bg: "#FEF3C7", text: "#92400E" } };
  return (
    <div>
      <PageHeader title="Preventive Maintenance Schedule" sub="Scheduled service tasks by asset and frequency" actions={<><BtnO label="Calendar View" icon={CalendarDays} /><BtnP label="New Schedule Entry" icon={Plus} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Overdue Maintenance" value={tasks.filter(t=>t.status==="Overdue").length.toString()} sub="Past scheduled date" icon={AlertTriangle} accent={ERROR} /><StatCard label="Due This Month" value="2" sub="Scheduled service" icon={CalendarDays} accent={WARNING} /><StatCard label="On Schedule" value={tasks.filter(t=>t.status==="Ok").length.toString()} sub="No action needed" icon={CheckCircle2} accent={SUCCESS} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["ID", "Asset", "Frequency", "Last Completed", "Next Due", "Technician", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{tasks.map(t => <tr key={t.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.id}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{t.asset}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{t.freq}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{t.lastDone}</td><td className="px-5 py-3 text-xs font-semibold" style={{ color: t.status === "Overdue" ? ERROR : TEXT }}>{t.nextDue}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{t.tech}</td><td className="px-5 py-3"><Badge label={t.status} colors={stC[t.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "success", title: `${t.id} marked complete` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Mark Done</button><button onClick={() => add({ type: "info", title: `Work order created — ${t.asset}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Work Order</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// MX-07 Vendor Contacts
export function VendorContacts({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Vendor Contacts" sub="Suppliers and contractors linked to maintenance" actions={<BtnP label="Add Vendor" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Total Vendors" value={String(SUPPLIERS_DATA.length)} sub="Registered suppliers" icon={Truck} accent={PRIMARY} />
        <StatCard label="Active This Month" value={String(SUPPLIERS_DATA.filter(s=>s.lastOrder).length)} sub="Recent transactions" icon={Activity} accent={SUCCESS} />
        <StatCard label="Pending POs" value="3" sub="Awaiting delivery" icon={Package} accent={WARNING} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SUPPLIERS_DATA.map(s => (
          <div key={s.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{s.company}</h3><div className="text-xs mt-0.5" style={{ color: MUTED }}>{s.id} · {s.cat}</div></div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{s.cat}</span>
            </div>
            <div className="space-y-1.5 mb-3">
              {[["Contact", s.contact], ["Phone", s.phone], ["Payment Terms", s.terms], ["Last Order", s.lastOrder]].map(([k, v]) => <div key={k} className="flex gap-3 text-xs"><span className="w-24 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v as string}</span></div>)}
            </div>
            <div className="flex gap-2">
              <button onClick={() => add({ type: "info", title: `Call: ${s.contact}` })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border" style={{ color: MUTED, borderColor: BORDER }}><Phone size={12} />Call</button>
              <BtnO label="Create Work Order" icon={Wrench} onClick={() => add({ type: "info", title: `Work order → ${s.company}` })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// RT-07 Guest Room Charges
export function GuestRoomCharges({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const charges = [
    { folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Restaurant", desc: "Room Service RS-041", amount: 8500, date: "24 Jun 18:30", by: "Restaurant System", status: "Posted" },
    { folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Bar", desc: "Minibar — Water ×2, Juice ×1", amount: 3600, date: "24 Jun 20:15", by: "System", status: "Posted" },
    { folio: "FO-2849", room: "501", guest: "Dr. Chukwuemeka Bello", cat: "Restaurant", desc: "Welcome champagne", amount: 15000, date: "24 Jun 14:30", by: "Grace M.", status: "Posted" },
    { folio: "FO-2847", room: "304", guest: "Chukwuemeka Obi", cat: "Restaurant", desc: "Dinner for 2 — table T04", amount: 22500, date: "24 Jun 21:00", by: "Restaurant System", status: "Disputed" },
  ];
  const stC: Record<string, { bg: string; text: string }> = { Posted: { bg: "#DCFCE7", text: "#166534" }, Disputed: { bg: "#FEE2E2", text: "#991B1B" } };
  return (
    <div>
      <PageHeader title="Guest Room Charges" sub="All F&B and ancillary charges posted to room folios" actions={<BtnP label="Post New Charge" icon={Plus} onClick={() => add({ type: "info", title: "Post charge to room" })} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Charges" value={`₦${charges.reduce((s,c)=>s+c.amount,0).toLocaleString()}`} sub="All posted to rooms" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Pending" value={String(charges.filter(c=>c.status==="Pending").length)} sub="Awaiting payment" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Settled" value={String(charges.filter(c=>c.status==="Posted").length)} sub="Cleared charges" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Rooms with Charges" value={String(new Set(charges.map(c=>c.room)).size)} sub="Unique rooms billed" icon={BedDouble} accent={TEAL} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Folio", "Room", "Guest", "Category", "Description", "Amount", "Posted By", "Status", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{charges.map((c, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{c.folio}</td><td className="px-4 py-3 font-bold" style={{ color: PRIMARY }}>{c.room}</td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{c.guest}</td><td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F4F4F5", color: MUTED }}>{c.cat}</span></td><td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{c.desc}</td><td className="px-4 py-3 text-sm font-bold" style={{ color: TEXT }}>₦{c.amount.toLocaleString()}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{c.by}</td><td className="px-4 py-3"><Badge label={c.status} colors={stC[c.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "warning", title: `Charge disputed — Room ${c.room}` })} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Dispute</button><button onClick={() => add({ type: "info", title: `Charge transferred` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Transfer</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// IV-02 Products
export function ProductsScreen({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Products / Items" sub="All inventory items with par levels and reorder thresholds" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Item" icon={Plus} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Total Products" value={String(PRODUCTS_DATA.length)} sub="In catalog" icon={Package} accent={PRIMARY} />
        <StatCard label="Low Stock" value={String(PRODUCTS_DATA.filter(p=>p.stock<p.reorder).length)} sub="Below reorder level" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Categories" value="6" sub="Product categories" icon={Layers} accent={TEAL} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search items…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
          <Sel options={["All Categories", "Linen", "Toiletries", "F&B", "Kitchen", "Cleaning"]} />
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Code", "Name", "Category", "Unit", "Stock", "Par Level", "Reorder Point", "Unit Cost", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{PRODUCTS_DATA.map(p => {
            const low = p.stock <= p.reorder;
            return <tr key={p.code} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.code}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{p.name}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.cat}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.unit}</td><td className="px-5 py-3"><span className="text-sm font-bold" style={{ color: low ? ERROR : TEXT }}>{p.stock}</span>{low && <span className="ml-1 text-xs" style={{ color: ERROR }}>↓ low</span>}</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{p.par}</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{p.reorder}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>₦{p.cost.toLocaleString()}</td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "info", title: `Edit: ${p.name}` })} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button><button onClick={() => add({ type: "info", title: `Stock adjusted — ${p.name}` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Adjust</button></div></td></tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// IV-03 Suppliers
export function SuppliersScreen({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  return (
    <div>
      <PageHeader title="Suppliers" sub="Supplier directory with contact and payment terms" actions={<BtnP label="Add Supplier" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Total Suppliers" value={String(SUPPLIERS_DATA.length)} sub="Registered vendors" icon={Truck} accent={PRIMARY} />
        <StatCard label="Active Contracts" value={String(SUPPLIERS_DATA.filter(s=>s.contract).length)} sub="With valid agreements" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Spend This Month" value="₦462K" sub="All categories" icon={DollarSign} accent={TEAL} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Supplier", "Contact", "Phone", "Category", "Payment Terms", "Last Order", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{SUPPLIERS_DATA.map(s => <tr key={s.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{s.company}</div><div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{s.id}</div></td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>{s.contact}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{s.phone}</td><td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{s.cat}</span></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{s.terms}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{s.lastOrder}</td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "info", title: `Create PO — ${s.company}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Create PO</button><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// IV-04 Stock Transactions
export function StockTransactions({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const typeC: Record<string, { bg: string; text: string }> = { In: { bg: "#DCFCE7", text: "#166534" }, Out: { bg: "#FEF3C7", text: "#92400E" }, Adjustment: { bg: "#EEF2FF", text: "#4338CA" } };
  return (
    <div>
      <PageHeader title="Stock Transactions" sub="All stock movements — in, out, and adjustments" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Log Transaction" icon={Plus} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Transactions Today" value={"9"} sub="Inbound and outbound" icon={Activity} accent={PRIMARY} />
        <StatCard label="Stock In (units)" value={String(STOCK_TXN.filter(t=>t.type==="In").reduce((s,t)=>s+t.qty,0)) + " units"} sub="Units received" icon={TrendingUp} accent={SUCCESS} />
        <StatCard label="Stock Out (units)" value={String(STOCK_TXN.filter(t=>t.type==="Out").reduce((s,t)=>s+t.qty,0)) + " units"} sub="Units consumed" icon={TrendingDown} accent={ORANGE} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#FAFAFA", borderColor: BORDER }}>
          {["All", "In", "Out", "Adjustment"].map(f => <button key={f} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: f === "All" ? PRIMARY : BORDER, backgroundColor: f === "All" ? PRIMARY : "white", color: f === "All" ? "white" : MUTED }}>{f}</button>)}
          <input type="date" defaultValue="2025-06-24" className="ml-auto px-3 py-1.5 text-xs rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }} />
        </div>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date", "Item", "Type", "Qty", "Reference", "Logged By"].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{STOCK_TXN.map((t, i) => <tr key={i} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.date}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{t.item}</td><td className="px-5 py-3"><Badge label={t.type} colors={typeC[t.type] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3 text-sm font-bold" style={{ color: t.qty < 0 ? ERROR : t.type === "In" ? SUCCESS : TEXT }}>{t.qty > 0 ? "+" : ""}{t.qty}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{t.ref}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{t.by}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// IV-05 Purchase Orders
export function PurchaseOrders({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Draft: { bg: "#F3F4F6", text: "#374151" }, Sent: { bg: "#DBEAFE", text: "#1E40AF" }, Received: { bg: "#DCFCE7", text: "#166534" }, Cancelled: { bg: "#FEE2E2", text: "#991B1B" } };
  return (
    <div>
      <PageHeader title="Purchase Orders" sub="Manage POs from draft through receipt" actions={<BtnP label="Create PO" icon={Plus} onClick={() => add({ type: "info", title: "New purchase order" })} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total POs" value={String(PO_DATA.length)} sub="This month" icon={FileText} accent={PRIMARY} />
        <StatCard label="Pending" value={String(PO_DATA.filter(p=>p.status==="Pending").length)} sub="Awaiting approval" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Delivered" value={String(PO_DATA.filter(p=>p.status==="Delivered").length)} sub="Received & verified" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Total Spend" value={`₦${PO_DATA.reduce((s,p)=>s+p.total,0).toLocaleString()}`} sub="This month" icon={DollarSign} accent={TEAL} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["PO Number", "Supplier", "Date", "Items", "Total Value", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{PO_DATA.map(po => <tr key={po.id} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-xs font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>{po.id}</td><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{po.supplier}</td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{po.date} Jun</td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{po.items} items</td><td className="px-5 py-3 text-sm font-bold" style={{ color: TEXT }}>₦{po.total.toLocaleString()}</td><td className="px-5 py-3"><Badge label={po.status} colors={stC[po.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1">{po.status === "Draft" && <button onClick={() => add({ type: "success", title: `${po.id} sent to supplier` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Send</button>}{po.status === "Sent" && <button onClick={() => add({ type: "success", title: `${po.id} marked received — stock updated` })} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Mark Received</button>}<button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>View</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// RP-05 Inventory Reports
export function InventoryReports() {
  return (
    <div>
      <PageHeader title="Inventory Reports" sub="Consumption by category, low-stock frequency, supplier spend" actions={<BtnO label="Export" icon={Download} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"><StatCard label="Total Stock Value" value="₦1.84M" sub="Current inventory" icon={Package} accent={PRIMARY} /><StatCard label="Critical Items" value="2" sub="Reorder immediately" icon={AlertTriangle} accent={ERROR} /><StatCard label="Low Stock Items" value="3" sub="Below par level" icon={TrendingDown} accent={WARNING} /><StatCard label="Supplier Spend (Jun)" value="₦462K" sub="Month to date" icon={DollarSign} accent={TEAL} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>F&B Consumption Trend (₦K)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={INV_CONS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`₦${v}K`]} />
              <Bar dataKey="val" name="F&B Spend" fill={TEAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Stock Status by Category</h3>
          <div className="space-y-3">{[{ cat: "Linen", ok: 3, low: 1, critical: 0 }, { cat: "Toiletries", ok: 1, low: 0, critical: 1 }, { cat: "F&B", ok: 2, low: 1, critical: 0 }, { cat: "Kitchen", ok: 0, low: 0, critical: 1 }].map(c => <div key={c.cat}><div className="flex items-center justify-between text-xs mb-1"><span style={{ color: TEXT }}>{c.cat}</span><div className="flex gap-2">{c.critical > 0 && <span style={{ color: ERROR }}>{c.critical} critical</span>}{c.low > 0 && <span style={{ color: WARNING }}>{c.low} low</span>}<span style={{ color: SUCCESS }}>{c.ok} ok</span></div></div><div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: "#F4F4F5" }}><div style={{ width: `${(c.ok / (c.ok + c.low + c.critical)) * 100}%`, backgroundColor: SUCCESS }} /><div style={{ width: `${(c.low / (c.ok + c.low + c.critical)) * 100}%`, backgroundColor: WARNING }} /><div style={{ width: `${(c.critical / (c.ok + c.low + c.critical)) * 100}%`, backgroundColor: ERROR }} /></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// RP-06 Staff Reports
export function StaffReports() {
  return (
    <div>
      <PageHeader title="Staff Reports" sub="Hours worked, attendance rate, and shift coverage · June 2025" actions={<BtnO label="Export" icon={Download} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Total Hours Worked" value="1,596" sub="All departments · June 2025" icon={Clock} accent={PRIMARY} /><StatCard label="Overall Attendance" value="94%" sub="5 departments combined" icon={CheckCircle2} accent={SUCCESS} delta="+2% vs May" deltaPositive /><StatCard label="Overtime Hours" value="89h" sub="Flagged for review" icon={TrendingUp} accent={ORANGE} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Hours Worked by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={STAFF_RPT} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis type="number" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: SUBTLE }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}h`, "Hours"]} />
              <Bar dataKey="hours" name="Hours" fill={PRIMARY} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Attendance Rate by Department</h3>
          {STAFF_RPT.map(s => <div key={s.dept} className="mb-4"><div className="flex items-center justify-between text-sm mb-1.5"><span style={{ color: TEXT }}>{s.dept}</span><span className="font-bold" style={{ color: s.attend >= 95 ? SUCCESS : s.attend >= 90 ? WARNING : ERROR }}>{s.attend}%</span></div><div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${s.attend}%`, backgroundColor: s.attend >= 95 ? SUCCESS : s.attend >= 90 ? WARNING : ERROR }} /></div></div>)}
        </div>
      </div>
    </div>
  );
}

// IT-03 Device Management
export function DeviceManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Online: { bg: "#DCFCE7", text: "#166534" }, Idle: { bg: "#FEF3C7", text: "#92400E" }, Offline: { bg: "#F3F4F6", text: "#374151" } };
  return (
    <div>
      <PageHeader title="Device Management" sub="All registered devices on the branch LAN" actions={<BtnP label="Register Device" icon={Plus} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"><StatCard label="Online" value={DEVICES.filter(d=>d.status==="Online").length.toString()} sub="Connected and active" icon={Wifi} accent={SUCCESS} /><StatCard label="Idle / Offline" value={DEVICES.filter(d=>d.status==="Idle").length.toString()} sub="Check connectivity" icon={AlertTriangle} accent={WARNING} /><StatCard label="Total Registered" value={DEVICES.length.toString()} sub="All registered devices" icon={Server} accent={PRIMARY} /></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full"><thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Device Name", "Type", "Department", "IP Address", "MAC Address", "Last Seen", "Status", ""].map((h, i) => <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{DEVICES.map(d => <tr key={d.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3 text-sm font-medium" style={{ color: TEXT }}>{d.name}</td><td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#F4F4F5", color: MUTED }}>{d.type}</span></td><td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{d.dept}</td><td className="px-5 py-3 text-xs" style={{ color: TEXT, fontFamily: mono }}>{d.ip}</td><td className="px-5 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{d.mac}</td><td className="px-5 py-3 text-xs" style={{ color: SUBTLE }}>{d.lastSeen}</td><td className="px-5 py-3"><Badge label={d.status} colors={stC[d.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td><td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => add({ type: "warning", title: `Device deauthorized — ${d.name}` })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Deauthorize</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ST-02 Synchronization
export function SyncSettings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const conflicts = [
    { record: "Reservation BK-2847", local: "Check-in time 14:05", server: "Check-in time 14:08", ts: "24 Jun 14:09" },
  ];
  return (
    <div>
      <PageHeader title="Synchronization" sub="Local ↔ Central server sync settings and status" actions={<BtnP label="Sync Now" icon={RefreshCw} onClick={() => add({ type: "success", title: "Sync started", body: "Pushing 0 pending items to central server" })} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Synced Properties" value="3" sub="Connected branches" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Last Sync" value="2m ago" sub="All data up to date" icon={Activity} accent={TEAL} />
        <StatCard label="Pending Changes" value="0" sub="No queue backlog" icon={AlertCircle} accent={PRIMARY} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Connection Status</h3>
          <div className="space-y-3">
            {[{ l: "Central Server URL", v: "https://sync.grandpalms-hms.ng" }, { l: "Last Sync", v: "2 min ago" }, { l: "Pending Items", v: "0" }, { l: "Last Sync Duration", v: "1.2 seconds" }, { l: "Total Synced Today", v: "847 records" }].map(([k, v]) => <div key={k} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#F4F4F5" }}><span className="text-sm" style={{ color: MUTED }}>{k}</span><span className="text-sm font-semibold" style={{ color: TEXT }}>{v as string}</span></div>)}
          </div>
          <div className="mt-4"><Inp label="Central Server URL" defaultValue="https://sync.grandpalms-hms.ng" /><div className="mt-3"><BtnP label="Test Connection" icon={Wifi} onClick={() => add({ type: "success", title: "Connection successful", body: "Central server reachable · Latency: 45ms" })} /></div></div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Sync Configuration</h3>
          <div className="space-y-3">
            <Sel label="Sync Frequency" options={["Real-time (push on change)", "Every 5 minutes", "Every 15 minutes", "Manual only"]} />
            <div className="flex items-center justify-between py-2"><span className="text-sm" style={{ color: TEXT }}>Sync when internet restores</span><div className="w-10 h-5 rounded-full" style={{ backgroundColor: TEAL }}><div className="w-4 h-4 bg-white rounded-full m-0.5 ml-5 shadow" /></div></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm" style={{ color: TEXT }}>Notify on sync failure</span><div className="w-10 h-5 rounded-full" style={{ backgroundColor: TEAL }}><div className="w-4 h-4 bg-white rounded-full m-0.5 ml-5 shadow" /></div></div>
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F4F4F5" }}>
            <button onClick={() => add({ type: "warning", title: "Pending queue cleared", body: "0 items removed" })} className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 px-3 py-2 rounded-lg">Clear Pending Queue</button>
          </div>
        </div>
      </div>
      {conflicts.length > 0 && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#F4F4F5" }}><AlertTriangle size={15} style={{ color: WARNING }} /><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Conflict Resolution — {conflicts.length} pending</h3></div>
          {conflicts.map((c, i) => (
            <div key={i} className="p-5">
              <div className="text-xs font-semibold mb-3" style={{ color: MUTED }}>{c.record} · Conflict detected at {c.ts}</div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="p-3 rounded-xl border-2" style={{ borderColor: PRIMARY }}><div className="text-xs font-bold mb-1" style={{ color: PRIMARY }}>Local Version</div><div className="text-sm" style={{ color: TEXT }}>{c.local}</div></div>
                <div className="p-3 rounded-xl border-2" style={{ borderColor: TEAL }}><div className="text-xs font-bold mb-1" style={{ color: TEAL }}>Server Version</div><div className="text-sm" style={{ color: TEXT }}>{c.server}</div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => add({ type: "success", title: "Local version kept" })} className="px-3 py-2 rounded-lg text-xs font-medium border-2 text-white" style={{ backgroundColor: PRIMARY, borderColor: PRIMARY }}>Keep Local</button>
                <button onClick={() => add({ type: "success", title: "Server version accepted" })} className="px-3 py-2 rounded-lg text-xs font-medium border-2 text-white" style={{ backgroundColor: TEAL, borderColor: TEAL }}>Keep Server</button>
                <BtnO label="Resolve Manually" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
