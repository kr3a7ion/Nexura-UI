// All screen components and shared UI primitives.
// Imported by App.tsx — no circular dependencies.
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ArrowDownToLine, ArrowUpFromLine, XCircle, Camera,
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
import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp, Sel } from "./UIKit";
// MX-02 Work Order Detail
export function WorkOrderDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [status, setStatus] = useState("In Progress");
  const [guestImpact, setGuestImpact] = useState(true);
  const [note, setNote] = useState("");
  const [partNote, setPartNote] = useState("");
  const [showClose, setShowClose] = useState(false);
  const [resolution, setResolution] = useState("");
  const [labourHours, setLabourHours] = useState("1.5");
  const [showFollowUp, setShowFollowUp] = useState(false);

  const TIMELINE = [
    { ts: "24 Jun 08:58", event: "Work order created", by: "John Abubakar", note: "AC unit in Room 207 not cooling. Guest complaint — hot room.", color: PRIMARY },
    { ts: "24 Jun 09:05", event: "Assigned to technician", by: "Grace Mensah", note: "Assigned to Emeka Nwosu (HVAC specialist)", color: TEAL },
    { ts: "24 Jun 09:15", event: "Status → In Progress", by: "Emeka Nwosu", note: "Checked unit — low refrigerant. Sourcing R-410A. Estimated 2h.", color: ORANGE },
  ];
  const [timeline, setTimeline] = useState(TIMELINE);

  const PARTS = [
    { item: "R-410A Refrigerant (1kg)", qty: 1, unit: 8500, ref: "STK-0044" },
    { item: "Condenser Filter", qty: 1, unit: 2200, ref: "STK-0041" },
  ];

  const STATUS_STEPS = ["Reported","Assigned","In Progress","Completed","Cancelled"];

  const postNote = () => {
    if (!note.trim()) return;
    setTimeline(p => [...p, { ts: new Date().toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"}), event: "Note added", by: "Current User", note, color: MUTED }]);
    add({ type: "success", title: "Note posted" }); setNote("");
  };

  const closeWO = () => {
    if (!resolution.trim()) { add({ type: "warning", title: "Resolution notes required to close" }); return; }
    setStatus("Completed"); setShowClose(false);
    setTimeline(p => [...p, { ts: new Date().toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"}), event: "Work order closed", by: "Current User", note: resolution, color: SUCCESS }]);
    add({ type: "success", title: "WO-0091 closed", body: "Guest room status updated" });
  };

  const partTotal = PARTS.reduce((s,p) => s+p.qty*p.unit, 0);
  const labourCost = parseFloat(labourHours || "0") * 5000;

  return (
    <div>
      <PageHeader title="Work Order WO-0091" sub="Room 207 · HVAC · Reported 24 Jun 08:58 by John Abubakar"
        actions={<><BtnO label="Escalate" icon={AlertTriangle} onClick={() => add({ type: "warning", title: "WO-0091 escalated to GM" })} /><BtnP label="Close Order" icon={CheckCircle2} onClick={() => setShowClose(true)} /></>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header card */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-bold" style={{ color: TEXT }}>AC not cooling — Room 207</div>
                <div className="text-sm mt-0.5" style={{ color: MUTED }}>SLA Deadline: <span className="font-semibold" style={{ color: ERROR }}>24 Jun 14:58</span> · Age: <span style={{ fontFamily: mono }}>1h 20m</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuestImpact(p=>!p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold" style={{ borderColor: guestImpact ? `${ERROR}40` : BORDER, backgroundColor: guestImpact ? "#FEF2F2" : "white", color: guestImpact ? ERROR : MUTED }}>
                  <AlertCircle size={12} />Guest Impact {guestImpact ? "ON" : "OFF"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[["Location","Room 207"],["Category","HVAC"],["Priority","High"],["Assigned To","Emeka Nwosu"],["Asset","AST-001 — Central AC"],["Status",status]].map(([k,v]) => (
                <div key={k}><div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: MUTED }}>{k}</div>
                <div className="text-sm font-semibold" style={{ color: k==="Priority" ? ERROR : k==="Status" ? PRIMARY : TEXT }}>{v}</div></div>
              ))}
            </div>
            <div><div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: MUTED }}>Description</div>
            <p className="text-sm leading-relaxed" style={{ color: TEXT }}>AC unit not cooling in Room 207. Guest reported warm room temperature (29°C vs 23°C set point). Technician to inspect compressor, refrigerant levels, filter, and thermostat calibration. Room has been offered a temporary fan.</p></div>
          </div>

          {/* Photo attachments — colored div placeholders */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Photo Evidence</h3><button className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }} onClick={() => add({ type: "info", title: "Camera access requested" })}>+ Upload</button></div>
            <div className="flex gap-3">
              {[["#DBEAFE","AC Unit — External"],["#FEF3C7","Control Panel"],["#DCFCE7","Filter — clogged"]].map(([bg, label]) => (
                <div key={label} className="flex-1 rounded-xl flex flex-col items-center justify-center gap-1.5 py-6 cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: bg, minHeight: 80 }}>
                  <Camera size={20} style={{ color: MUTED }} />
                  <span className="text-xs text-center px-2" style={{ color: MUTED }}>{label}</span>
                </div>
              ))}
              <div className="flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 py-6 cursor-pointer" style={{ borderColor: BORDER }}>
                <Plus size={18} style={{ color: SUBTLE }} /><span className="text-xs" style={{ color: SUBTLE }}>Add photo</span>
              </div>
            </div>
          </div>

          {/* Parts consumed */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Parts Consumed</h3><button onClick={() => add({ type: "info", title: "Log parts from stock" })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>+ Log Parts</button></div>
            <table className="w-full mb-3">
              <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item","Qty","Unit Cost","Total","Stock Ref"].map(h=><th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>{PARTS.map((p,i) => <tr key={i} className="border-t" style={{ borderColor: BORDER }}><td className="px-3 py-2.5 text-sm" style={{ color: TEXT }}>{p.item}</td><td className="px-3 py-2.5 text-sm" style={{ color: TEXT, fontFamily: mono }}>{p.qty}</td><td className="px-3 py-2.5 text-sm" style={{ color: TEXT, fontFamily: mono }}>₦{p.unit.toLocaleString()}</td><td className="px-3 py-2.5 text-sm font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{(p.qty*p.unit).toLocaleString()}</td><td className="px-3 py-2.5 text-xs" style={{ color: TEAL, fontFamily: mono }}>{p.ref}</td></tr>)}</tbody>
            </table>
            <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: BORDER }}>
              <span className="text-xs" style={{ color: MUTED }}>Parts total: <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{partTotal.toLocaleString()}</span></span>
              <div className="flex items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>Labour hours:</span><input type="number" step="0.5" min="0" value={labourHours} onChange={e=>setLabourHours(e.target.value)} className="w-16 px-2 py-1 text-xs border rounded outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <span className="text-xs" style={{ color: MUTED }}>Labour @ ₦5,000/h: <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{labourCost.toLocaleString()}</span></span>
              <span className="ml-auto text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>Total: ₦{(partTotal+labourCost).toLocaleString()}</span>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Activity Log</h3>
            <div className="space-y-0">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: t.color }} />
                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 mt-1 mb-1" style={{ backgroundColor: "#E2E8F0" }} />}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{t.ts}</span>
                      <span className="text-xs font-semibold" style={{ color: t.color }}>{t.event}</span>
                      <span className="text-xs" style={{ color: MUTED }}>by {t.by}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: TEXT }}>{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t" style={{ borderColor: "#F4F4F5" }}>
              <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none mb-2" rows={2} placeholder="Add note or update…" style={{ borderColor: BORDER }} />
              <BtnP label="Post Update" icon={Send} onClick={postNote} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Status Transition</h3>
            <div className="space-y-2">
              {STATUS_STEPS.map(s => (
                <button key={s} onClick={() => { if (s === "Completed") { setShowClose(true); } else { setStatus(s); add({ type: "success", title: `Status → ${s}` }); setTimeline(p=>[...p,{ts:new Date().toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"}),event:`Status → ${s}`,by:"Current User",note:"",color:woC[s]?.text??MUTED}]); } }} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: s===status ? PRIMARY : BORDER, backgroundColor: s===status ? "#EFF6FF" : "white", color: s===status ? PRIMARY : MUTED }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: woC[s]?.text ?? SUBTLE }} />{s}
                  {s==="Completed" && <span className="ml-auto text-xs" style={{ color: SUBTLE }}>requires notes</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Linked Asset</h3>
            <div className="space-y-1.5 text-xs">
              {[["Asset Tag","AST-001"],["Asset","Central AC Unit"],["Location","Roof"],["Last Service","12 Mar 2025"],["Next Service","12 Jun 2025"]].map(([k,v]) => (
                <div key={k} className="flex gap-2"><span className="w-24 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Follow-up PM</h3><button onClick={() => setShowFollowUp(true)} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Create</button></div>
            {showFollowUp ? (
              <div className="space-y-2">
                <select className="w-full px-2.5 py-2 text-xs rounded-xl border outline-none" style={{ borderColor: BORDER }}><option>Monthly PM — AC Unit</option><option>Quarterly — AC full service</option></select>
                <input type="date" className="w-full px-2.5 py-2 text-xs rounded-xl border outline-none" style={{ borderColor: BORDER }} defaultValue="2025-07-24" />
                <button onClick={() => { setShowFollowUp(false); add({ type: "success", title: "PM task created — AST-001" }); }} className="w-full py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Create PM Task</button>
              </div>
            ) : <p className="text-xs" style={{ color: SUBTLE }}>Create a preventive maintenance task from this work order to prevent recurrence.</p>}
          </div>
        </div>
      </div>

      {/* Close modal */}
      {showClose && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowClose(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Close Work Order</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Document the resolution before closing. This is required and will appear on the audit trail.</p>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Resolution Notes</label>
            <textarea value={resolution} onChange={e=>setResolution(e.target.value)} placeholder="Describe what was found and what was done to resolve the issue…" rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowClose(false)} /><button disabled={!resolution.trim()} onClick={closeWO} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: SUCCESS }}>Close Order</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// MX-04 Asset Register
export function AssetRegister({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const REGISTER = [
    { id: "AST-001", name: "Central Air Conditioning Unit", cat: "HVAC", location: "Roof", criticality: "Critical", purchased: "Jan 2021", cost: 2850000, warranty: "Jan 2024", supplier: "Airecon Nigeria", lastService: "12 Mar 2025", nextService: "12 Jun 2025", serviceStatus: "Overdue", downtimeYTD: "4h 20m", runtime: "8,742 h", status: "Operational" },
    { id: "AST-002", name: "Commercial Refrigerator (Restaurant)", cat: "Kitchen", location: "Restaurant Kitchen", criticality: "High", purchased: "Mar 2022", cost: 980000, warranty: "Mar 2025", supplier: "CoolTech Ltd", lastService: "10 May 2025", nextService: "10 Aug 2025", serviceStatus: "Ok", downtimeYTD: "0h", runtime: "—", status: "Operational" },
    { id: "AST-003", name: "Elevator #1 (10-person)", cat: "Infrastructure", location: "Main Building", criticality: "Critical", purchased: "Sep 2019", cost: 12500000, warranty: "Sep 2024", supplier: "Otis Nigeria", lastService: "01 Jun 2025", nextService: "01 Sep 2025", serviceStatus: "Ok", downtimeYTD: "1h", runtime: "—", status: "Operational" },
    { id: "AST-004", name: "Diesel Generator 50kVA", cat: "Generator", location: "Generator Room", criticality: "Critical", purchased: "Jun 2020", cost: 4200000, warranty: "Jun 2025", supplier: "Mikano Int'l", lastService: "15 May 2025", nextService: "15 Jun 2025", serviceStatus: "Due Soon", downtimeYTD: "0h", runtime: "3,412 h", status: "Operational" },
    { id: "AST-005", name: "Toyota HiAce Bus (Hotel Shuttle)", cat: "Vehicle", location: "Parking", criticality: "Medium", purchased: "Feb 2023", cost: 9800000, warranty: "Feb 2026", supplier: "Toyota Nigeria", lastService: "01 Apr 2025", nextService: "01 Jul 2025", serviceStatus: "Due Soon", downtimeYTD: "0h", runtime: "14,200 km", status: "Operational" },
    { id: "AST-006", name: "Commercial Washing Machine", cat: "Laundry", location: "Laundry Room", criticality: "High", purchased: "Aug 2021", cost: 1450000, warranty: "Aug 2024", supplier: "CleanPro", lastService: "20 Feb 2025", nextService: "20 May 2025", serviceStatus: "Overdue", downtimeYTD: "8h", runtime: "—", status: "Degraded" },
    { id: "AST-007", name: "Pool Circulation Pump", cat: "Pool", location: "Pool Area", criticality: "Medium", purchased: "Nov 2022", cost: 620000, warranty: "Nov 2025", supplier: "AquaTech", lastService: "05 Jun 2025", nextService: "05 Sep 2025", serviceStatus: "Ok", downtimeYTD: "2h", runtime: "—", status: "Operational" },
    { id: "AST-008", name: "CCTV System (32-channel)", cat: "IT", location: "Security Room", criticality: "High", purchased: "Jan 2022", cost: 1800000, warranty: "Jan 2025", supplier: "SecureVision", lastService: "15 Jan 2025", nextService: "15 Jul 2025", serviceStatus: "Due Soon", downtimeYTD: "0h", runtime: "—", status: "Operational" },
    { id: "AST-009", name: "Conference Room AV System", cat: "IT", location: "Conference Room A", criticality: "Low", purchased: "Mar 2023", cost: 2200000, warranty: "Mar 2026", supplier: "AV Solutions NG", lastService: "10 Jun 2025", nextService: "10 Dec 2025", serviceStatus: "Ok", downtimeYTD: "0h", runtime: "—", status: "Operational" },
    { id: "AST-010", name: "Toyota Hilux (Management)", cat: "Vehicle", location: "Parking", criticality: "Low", purchased: "Oct 2022", cost: 14500000, warranty: "Oct 2025", supplier: "Toyota Nigeria", lastService: "15 Mar 2025", nextService: "15 Jun 2025", serviceStatus: "Overdue", downtimeYTD: "0h", runtime: "28,440 km", status: "Operational" },
  ];

  const CATS = ["All","HVAC","Kitchen","Infrastructure","Generator","Vehicle","Laundry","Pool","IT"];
  const stC: Record<string, { bg: string; text: string }> = { Ok: { bg: "#DCFCE7", text: "#166534" }, "Due Soon": { bg: "#FEF3C7", text: "#92400E" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" } };
  const statusC: Record<string, { bg: string; text: string }> = { Operational: { bg: "#DCFCE7", text: "#166534" }, Degraded: { bg: "#FEF3C7", text: "#92400E" }, Offline: { bg: "#FEE2E2", text: "#991B1B" } };

  const visible = REGISTER.filter(a => (catFilter === "All" || a.cat === catFilter) && (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())));
  const sel = selected ? REGISTER.find(a=>a.id===selected) : null;

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">
        <PageHeader title="Asset Register" sub="All property assets including vehicles and generators" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Asset" icon={Plus} onClick={() => add({ type: "info", title: "Add new asset" })} /></>} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Assets" value={String(REGISTER.length)} sub="Registered items" icon={Package} accent={PRIMARY} />
          <StatCard label="Overdue Service" value={String(REGISTER.filter(a=>a.serviceStatus==="Overdue").length)} sub="Past schedule" icon={AlertTriangle} accent={ERROR} />
          <StatCard label="Due Soon" value={String(REGISTER.filter(a=>a.serviceStatus==="Due Soon").length)} sub="Within 30 days" icon={CalendarDays} accent={WARNING} />
          <StatCard label="Degraded" value={String(REGISTER.filter(a=>a.status==="Degraded").length)} sub="Needs attention" icon={Activity} accent={ORANGE} />
        </div>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search asset name or ID…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          <div className="flex gap-1.5 flex-wrap">{CATS.map(c => <button key={c} onClick={() => setCatFilter(c)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ backgroundColor: catFilter===c ? PRIMARY : "white", color: catFilter===c ? "white" : MUTED, borderColor: catFilter===c ? PRIMARY : BORDER }}>{c}</button>)}</div>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Asset ID","Name / Category","Location","Criticality","Purchase Cost","Warranty","Supplier","Next Service","Runtime","Status",""].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id} onClick={() => setSelected(selected===a.id?null:a.id)} className="border-t cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selected===a.id ? "#EFF6FF" : "white" }}>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.id}</td>
                  <td className="px-3 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{a.name}</div><div className="text-xs" style={{ color: SUBTLE }}>{a.cat}</div></td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.location}</td>
                  <td className="px-3 py-3"><span className="text-xs font-semibold" style={{ color: a.criticality==="Critical" ? ERROR : a.criticality==="High" ? ORANGE : a.criticality==="Medium" ? WARNING : MUTED }}>{a.criticality}</span></td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{a.cost.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.warranty}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.supplier}</td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-semibold" style={{ color: a.serviceStatus==="Overdue" ? ERROR : a.serviceStatus==="Due Soon" ? ORANGE : MUTED }}>{a.nextService}</div>
                    <Badge label={a.serviceStatus} colors={stC[a.serviceStatus] ?? { bg: "#F4F4F5", text: "#374151" }} />
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.runtime}</td>
                  <td className="px-3 py-3"><Badge label={a.status} colors={statusC[a.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={e=>{e.stopPropagation();add({type:"info",title:`Work order → ${a.name}` });}} className="text-xs px-2 py-1 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>WO</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="w-80 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</h3><button onClick={()=>setSelected(null)} style={{ color: SUBTLE }}><X size={16} /></button></div>
            <div className="text-base font-bold mb-1" style={{ color: TEXT }}>{sel.name}</div>
            <div className="flex gap-1.5 mb-4"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{sel.cat}</span><span className="text-xs font-semibold" style={{ color: sel.criticality==="Critical"?ERROR:sel.criticality==="High"?ORANGE:MUTED }}>{sel.criticality}</span></div>
            <div className="space-y-2 text-xs mb-4">
              {[["Location",sel.location],["Supplier",sel.supplier],["Purchased",sel.purchased],["Cost",`₦${sel.cost.toLocaleString()}`],["Warranty",sel.warranty],["Last Service",sel.lastService],["Next Service",sel.nextService],["Runtime/Odometer",sel.runtime],["Downtime YTD",sel.downtimeYTD]].map(([k,v])=>(
                <div key={k} className="flex gap-2"><span className="w-28 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
            <div className="space-y-2">
              <button onClick={() => add({ type: "info", title: `Work order → ${sel.name}` })} className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Create Work Order</button>
              <button onClick={() => add({ type: "success", title: `Service logged — ${sel.id}` })} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>Log Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MX-06 Preventive Schedule
export function PreventiveSchedule({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showDone, setShowDone] = useState<string | null>(null);
  const [showSkip, setShowSkip] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState<string | null>(null);
  const [meter, setMeter] = useState("");
  const [skipReason, setSkipReason] = useState("");
  const [newDate, setNewDate] = useState("");

  const TASKS = [
    { id: "PS-001", asset: "Central AC Unit", assetId: "AST-001", task: "Full service — filter, coil, refrigerant check", freqType: "time", freq: "Monthly", lastDone: "12 Mar 2025", nextDue: "12 Jun 2025", status: "Overdue", tech: "Emeka Nwosu", estMins: 120, meterLabel: "Runtime hours" },
    { id: "PS-002", asset: "Diesel Generator 50kVA", assetId: "AST-004", task: "Oil change, filter, battery, coolant level", freqType: "usage", freq: "Every 250 runtime hours", lastDone: "15 May 2025", nextDue: "15 Jun 2025", status: "Due Soon", tech: "Emeka Nwosu", estMins: 90, meterLabel: "Runtime hours at completion" },
    { id: "PS-003", asset: "Elevator #1", assetId: "AST-003", task: "Brake inspection, cable, safety systems", freqType: "time", freq: "Quarterly", lastDone: "01 Jun 2025", nextDue: "01 Sep 2025", status: "Ok", tech: "External Vendor", estMins: 240, meterLabel: "" },
    { id: "PS-004", asset: "Pool Filtration System", assetId: "AST-007", task: "Backwash filter, clean pump basket, balance chemicals", freqType: "time", freq: "Monthly", lastDone: "20 Apr 2025", nextDue: "20 Jul 2025", status: "Ok", tech: "Chidi Ike", estMins: 60, meterLabel: "" },
    { id: "PS-005", asset: "Fire Extinguishers (all 24)", assetId: "AST-005", task: "Pressure check, tag renewal, mounting inspect", freqType: "time", freq: "Annual", lastDone: "10 Jan 2025", nextDue: "10 Jan 2026", status: "Ok", tech: "External Vendor", estMins: 180, meterLabel: "" },
    { id: "PS-006", asset: "Commercial Refrigerator", assetId: "AST-002", task: "Condenser coil clean, door seal check, temperature calibration", freqType: "time", freq: "Quarterly", lastDone: "10 May 2025", nextDue: "10 Aug 2025", status: "Ok", tech: "Chidi Ike", estMins: 60, meterLabel: "" },
    { id: "PS-007", asset: "Toyota HiAce Shuttle", assetId: "AST-005", task: "Oil change, tyre rotation, brake inspection", freqType: "usage", freq: "Every 5,000 km", lastDone: "01 Apr 2025", nextDue: "01 Jul 2025", status: "Due Soon", tech: "External Vendor", estMins: 120, meterLabel: "Odometer reading (km)" },
    { id: "PS-008", asset: "Commercial Washing Machine", assetId: "AST-006", task: "Drum clean, door seal, hose inspection", freqType: "time", freq: "Monthly", lastDone: "20 Feb 2025", nextDue: "20 May 2025", status: "Overdue", tech: "Chidi Ike", estMins: 45, meterLabel: "" },
  ];

  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const statusOf = (t: typeof TASKS[0]) => statuses[t.id] ?? t.status;

  const stC: Record<string, { bg: string; text: string }> = { Ok: { bg: "#DCFCE7", text: "#166534" }, Overdue: { bg: "#FEE2E2", text: "#991B1B" }, "Due Soon": { bg: "#FEF3C7", text: "#92400E" }, Completed: { bg: "#EEF2FF", text: "#4338CA" }, Skipped: { bg: "#F3F4F6", text: "#374151" } };

  const markDone = () => {
    if (!meter.trim() && TASKS.find(t=>t.id===showDone)?.meterLabel) { add({ type: "warning", title: "Enter meter reading" }); return; }
    setStatuses(p=>({...p,[showDone!]:"Completed"}));
    add({ type: "success", title: `${showDone} marked complete`, body: meter ? `Meter: ${meter}` : undefined });
    setShowDone(null); setMeter("");
  };

  const skipTask = () => {
    if (!skipReason.trim()) { add({ type: "warning", title: "Skip reason is required" }); return; }
    setStatuses(p=>({...p,[showSkip!]:"Skipped"}));
    add({ type: "info", title: `${showSkip} skipped`, body: skipReason });
    setShowSkip(null); setSkipReason("");
  };

  // Calendar view — show tasks on a 4-week grid
  const WEEKS = [["Jun 2","Jun 9","Jun 16","Jun 23","Jun 30"]];
  const calTasks = TASKS.filter(t => statusOf(t) !== "Completed" && statusOf(t) !== "Skipped");

  return (
    <div>
      <PageHeader title="Preventive Maintenance Schedule" sub="Time-based and usage-based PM tasks" actions={<><div className="flex rounded-xl overflow-hidden border" style={{ borderColor: BORDER }}>{["list","calendar"].map(v=><button key={v} onClick={()=>setView(v as "list"|"calendar")} className="px-3 py-2 text-xs font-semibold capitalize" style={{ backgroundColor: view===v ? PRIMARY : "white", color: view===v ? "white" : MUTED }}>{v}</button>)}</div><BtnP label="New PM Task" icon={Plus} onClick={() => add({ type: "info", title: "New PM task" })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Overdue" value={String(TASKS.filter(t=>statusOf(t)==="Overdue").length)} sub="Past scheduled date" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Due Soon" value={String(TASKS.filter(t=>statusOf(t)==="Due Soon").length)} sub="Within 30 days" icon={Clock} accent={WARNING} />
        <StatCard label="On Schedule" value={String(TASKS.filter(t=>statusOf(t)==="Ok").length)} sub="No action needed" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Completed" value={String(Object.values(statuses).filter(s=>s==="Completed").length)} sub="This period" icon={CheckCircle2} accent={TEAL} />
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["ID","Asset / Task","Frequency","Est. Duration","Last Done","Next Due","Technician","Status",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {TASKS.map(t => {
                const st = statusOf(t);
                return (
                  <tr key={t.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, backgroundColor: st==="Overdue" ? "#FFF8F8" : "white" }}>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium" style={{ color: TEXT }}>{t.asset}</div>
                      <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{t.task}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: TEXT }}>{t.freq}</div>
                      <div className="text-xs" style={{ color: t.freqType==="usage" ? TEAL : MUTED }}>{t.freqType==="usage" ? "Usage-based" : "Time-based"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{t.estMins >= 60 ? `${Math.floor(t.estMins/60)}h ${t.estMins%60 ? t.estMins%60+"m" : ""}` : `${t.estMins}m`}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{t.lastDone}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: st==="Overdue" ? ERROR : st==="Due Soon" ? ORANGE : TEXT }}>{t.nextDue}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{t.tech}</td>
                    <td className="px-4 py-3"><Badge label={st} colors={stC[st] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {st !== "Completed" && st !== "Skipped" && <>
                          <button onClick={() => { setShowDone(t.id); setMeter(""); }} className="text-xs px-2 py-1.5 rounded border font-medium whitespace-nowrap" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Mark Done</button>
                          <button onClick={() => add({ type: "info", title: `Work order → ${t.asset}` })} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>WO</button>
                          <button onClick={() => { setShowReschedule(t.id); setNewDate(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: MUTED, borderColor: BORDER }}>Reschedule</button>
                          <button onClick={() => { setShowSkip(t.id); setSkipReason(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: MUTED, borderColor: BORDER }}>Skip</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calendar view */
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold mb-4" style={{ color: TEXT }}>June / July 2025 — Due tasks</div>
          <div className="overflow-x-auto">
            <div className="grid gap-2" style={{ gridTemplateColumns: "120px repeat(5,1fr)" }}>
              <div />
              {["Week 1 (Jun 2–8)","Week 2 (Jun 9–15)","Week 3 (Jun 16–22)","Week 4 (Jun 23–29)","Week 5 (Jun 30+)"].map(w => (
                <div key={w} className="text-xs text-center font-semibold pb-2 border-b" style={{ color: MUTED, borderColor: BORDER }}>{w}</div>
              ))}
              {calTasks.map(t => (
                <React.Fragment key={t.id}>
                  <div className="text-xs py-2 pr-2 font-medium" style={{ color: TEXT }}>{t.asset.split(" ").slice(0,2).join(" ")}</div>
                  {[0,1,2,3,4].map(week => {
                    const dueWeek = t.nextDue.includes("Jun") ? Math.ceil((parseInt(t.nextDue.split(" ")[1]||"30"))/7)-1 : 4;
                    const isThis = dueWeek === week;
                    const st = statusOf(t);
                    return (
                      <div key={week} className="py-2 flex items-center justify-center">
                        {isThis ? (
                          <div className="text-xs px-2 py-1 rounded-lg text-center font-semibold" style={{ backgroundColor: st==="Overdue"?"#FEE2E2":st==="Due Soon"?"#FEF3C7":"#EFF6FF", color: st==="Overdue"?ERROR:st==="Due Soon"?ORANGE:PRIMARY, minWidth: 60 }}>
                            {t.nextDue}
                          </div>
                        ) : <div className="w-2 h-0.5 rounded" style={{ backgroundColor: "#E2E8F0" }} />}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mark Done modal */}
      {showDone && (() => { const t = TASKS.find(x=>x.id===showDone)!; return (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowDone(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Mark Complete — {t.id}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{t.asset} · {t.task}</p>
            <div className="space-y-3">
              {t.meterLabel && <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>{t.meterLabel}</label><input value={meter} onChange={e=>setMeter(e.target.value)} placeholder={t.meterLabel} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>}
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Completion Notes (optional)</label><textarea rows={2} placeholder="Any observations or issues found…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Completed By</label><select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>Emeka Nwosu</option><option>Chidi Ike</option><option>External Vendor</option></select></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowDone(null)} /><button onClick={markDone} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Confirm Completion</button></div>
          </div>
        </>
      ); })()}

      {/* Skip modal */}
      {showSkip && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowSkip(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-3" style={{ color: TEXT }}>Skip PM Task — {showSkip}</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason (required)</label><textarea value={skipReason} onChange={e=>setSkipReason(e.target.value)} placeholder="e.g. External vendor unavailable — rescheduled to next week" rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowSkip(null)} /><button disabled={!skipReason.trim()} onClick={skipTask} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Skip Task</button></div>
          </div>
        </>
      )}

      {/* Reschedule modal */}
      {showReschedule && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowReschedule(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-3" style={{ color: TEXT }}>Reschedule — {showReschedule}</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>New Due Date</label><input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowReschedule(null)} /><button disabled={!newDate} onClick={() => { add({ type: "info", title: `${showReschedule} rescheduled to ${newDate}` }); setShowReschedule(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Reschedule</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// MX-07 Vendor Contacts
export function VendorContacts({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCall, setShowCall] = useState<string | null>(null);
  const [callNotes, setCallNotes] = useState("");

  const VENDORS = [
    { id: "VND-001", company: "Airecon Nigeria Ltd", cat: "HVAC / Refrigeration", contact: "Engr. Seun Adeyemi", phone: "+234 804 400 5000", email: "service@airecon.ng", address: "12 Industrial Road, Lagos", services: "AC installation, servicing, refrigerant supply", rateCard: "₦35,000/visit + parts", sla: "4h response, 24h resolution", contractExpiry: "Dec 2025", rating: 4.5, jobsDone: 12, avgResponse: "3h 20m" },
    { id: "VND-002", company: "Mikano International", cat: "Generator / Power", contact: "Mr. Femi Ola", phone: "+234 802 200 3000", email: "service@mikano.ng", address: "5 Aba Johnson Cres, Abuja", services: "Generator sales, servicing, fuel supply, AMC", rateCard: "AMC ₦180,000/year", sla: "2h response (critical), 8h resolution", contractExpiry: "Jun 2026", rating: 4.8, jobsDone: 8, avgResponse: "1h 45m" },
    { id: "VND-003", company: "TechFix Services", cat: "General Maintenance", contact: "Engr. Bayo Ike", phone: "+234 803 300 4000", email: "info@techfix.ng", address: "7 Murtala Way, Abuja", services: "Electrical, plumbing, civil, welding, general repairs", rateCard: "₦15,000/hour labour", sla: "8h response, 48h resolution", contractExpiry: "Mar 2026", rating: 3.9, jobsDone: 34, avgResponse: "6h 10m" },
    { id: "VND-004", company: "Otis Nigeria", cat: "Elevator / Escalator", contact: "Mrs. Amara Eze", phone: "+234 801 100 2000", email: "nigeria@otis.com", address: "10 Marina Street, Lagos", services: "Elevator installation, AMC, emergency callout", rateCard: "AMC ₦620,000/year", sla: "1h emergency response", contractExpiry: "Sep 2026", rating: 4.7, jobsDone: 5, avgResponse: "55m" },
    { id: "VND-005", company: "AquaTech Pool Services", cat: "Pool / Water", contact: "Mr. Chidi Aneke", phone: "+234 805 500 6000", email: "aquatech@pool.ng", address: "3 Recreation Drive, Abuja", services: "Pool maintenance, chemical balance, pump repair", rateCard: "₦45,000/month retainer", sla: "Same-day", contractExpiry: "Dec 2025", rating: 4.2, jobsDone: 18, avgResponse: "2h 30m" },
    { id: "VND-006", company: "Toyota Nigeria Limited", cat: "Vehicles", contact: "Mrs. Kemi James", phone: "+234 806 600 7000", email: "fleet@toyotanigeria.ng", address: "Toyota House, Victoria Island", services: "Fleet servicing, warranty repairs, spare parts", rateCard: "Service rates per model", sla: "Scheduled appointments", contractExpiry: "Oct 2025", rating: 4.6, jobsDone: 7, avgResponse: "N/A" },
  ];

  const sel = selected ? VENDORS.find(v=>v.id===selected) : null;

  const JOB_HISTORY: Record<string, Array<{ date: string; desc: string; amount: number; rating: number }>> = {
    "VND-001": [{ date: "24 Jun 2025", desc: "AC service — Room 207 compressor", amount: 85000, rating: 5 },{ date: "10 May 2025", desc: "Refrigerant recharge — Main AC", amount: 45000, rating: 4 }],
    "VND-002": [{ date: "15 May 2025", desc: "Generator oil change + filter", amount: 35000, rating: 5 }],
    "VND-003": [{ date: "22 Jun 2025", desc: "Lobby electrical fault", amount: 28000, rating: 4 }],
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">
        <PageHeader title="Vendor Contacts" sub="Suppliers and service contractors linked to maintenance" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Add Vendor" icon={Plus} onClick={() => add({ type: "info", title: "Add new vendor" })} /></>} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Vendors" value={String(VENDORS.length)} sub="Registered" icon={Truck} accent={PRIMARY} />
          <StatCard label="Active Contracts" value={String(VENDORS.filter(v=>v.contractExpiry>"Jun 2025").length)} sub="In force" icon={CheckCircle2} accent={SUCCESS} />
          <StatCard label="Avg Rating" value={`${(VENDORS.reduce((s,v)=>s+v.rating,0)/VENDORS.length).toFixed(1)}★`} sub="Across all vendors" icon={Star} accent={ORANGE} />
          <StatCard label="Total Jobs" value={String(VENDORS.reduce((s,v)=>s+v.jobsDone,0))} sub="This year" icon={Wrench} accent={TEAL} />
        </div>
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["ID","Company / Category","Contact","Services","Rate Card","SLA","Contract Expiry","Rating","Jobs","Avg Response",""].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {VENDORS.map(v => (
                <tr key={v.id} onClick={() => setSelected(selected===v.id?null:v.id)} className="border-t cursor-pointer transition-colors hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, backgroundColor: selected===v.id ? "#EFF6FF" : "white" }}>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{v.id}</td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>{v.company}</div>
                    <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{v.cat}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-medium" style={{ color: TEXT }}>{v.contact}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{v.phone}</div>
                  </td>
                  <td className="px-3 py-3 text-xs max-w-36" style={{ color: MUTED }}>{v.services.split(",")[0]}…</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{v.rateCard}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{v.sla}</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: v.contractExpiry < "Jul 2025" ? ERROR : v.contractExpiry < "Dec 2025" ? ORANGE : TEXT }}>{v.contractExpiry}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1"><Star size={11} style={{ color: ORANGE }} /><span className="text-xs font-semibold" style={{ color: TEXT }}>{v.rating.toFixed(1)}</span></div>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{v.jobsDone}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{v.avgResponse}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                      <button onClick={() => { setShowCall(v.id); setCallNotes(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: MUTED, borderColor: BORDER }}>Log Call</button>
                      <button onClick={() => add({ type: "info", title: `Work order → ${v.company}` })} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>WO</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</h3><button onClick={()=>setSelected(null)} style={{ color: SUBTLE }}><X size={16} /></button></div>
            <div className="text-base font-bold mb-0.5" style={{ color: TEXT }}>{sel.company}</div>
            <div className="text-xs mb-3" style={{ color: MUTED }}>{sel.cat}</div>
            <div className="space-y-1.5 text-xs mb-4">
              {[["Contact",sel.contact],["Phone",sel.phone],["Email",sel.email],["Address",sel.address],["Rate Card",sel.rateCard],["SLA",sel.sla],["Contract Expiry",sel.contractExpiry]].map(([k,v])=>(
                <div key={k} className="flex gap-2"><span className="w-24 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium break-words" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Services</div>
              <div className="text-xs" style={{ color: TEXT }}>{sel.services}</div>
            </div>
            {JOB_HISTORY[sel.id] && (
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Recent Jobs</div>
                <div className="space-y-2">
                  {JOB_HISTORY[sel.id].map((j,i) => (
                    <div key={i} className="rounded-lg p-2.5 border" style={{ borderColor: BORDER }}>
                      <div className="flex items-start justify-between"><span className="text-xs font-medium" style={{ color: TEXT }}>{j.desc}</span><span className="text-xs font-bold flex-shrink-0" style={{ color: PRIMARY, fontFamily: mono }}>₦{j.amount.toLocaleString()}</span></div>
                      <div className="flex items-center gap-2 mt-1"><span className="text-xs" style={{ color: MUTED }}>{j.date}</span><span style={{ color: ORANGE }}>{"★".repeat(j.rating)}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <button onClick={() => add({ type: "info", title: `Work order → ${sel.company}` })} className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Create Work Order</button>
              <button onClick={() => { setShowCall(sel.id); setCallNotes(""); }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Log Call</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Call modal */}
      {showCall && (() => { const v = VENDORS.find(x=>x.id===showCall)!; return (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowCall(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Log Call — {v.company}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{v.contact} · {v.phone}</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Call Date</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Outcome</label><select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>Resolved</option><option>Follow-up required</option><option>WO scheduled</option><option>Quote requested</option></select></div>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Call Notes</label><textarea value={callNotes} onChange={e=>setCallNotes(e.target.value)} rows={3} placeholder="Summary of what was discussed…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowCall(null)} /><button onClick={() => { add({ type: "success", title: `Call logged — ${v.company}` }); setShowCall(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save Log</button></div>
          </div>
        </>
      ); })()}
    </div>
  );
}
