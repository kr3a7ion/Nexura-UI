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
// RT-07 Guest Room Charges
export function GuestRoomCharges({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type ChargeStatus = "Posted" | "Pending" | "Failed" | "Disputed" | "Reversed";

  const CHARGES_INIT = [
    { id: "CH-5041", folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Restaurant", desc: "Room Service RS-0041", amount: 8500, date: "2025-10-14 18:30", by: "Restaurant System", status: "Posted" as ChargeStatus, ref: "RS-0041", disputeNote: "" },
    { id: "CH-5042", folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Minibar", desc: "Minibar — Water ×2, Juice ×1", amount: 3600, date: "2025-10-14 20:15", by: "System", status: "Posted" as ChargeStatus, ref: "", disputeNote: "" },
    { id: "CH-5043", folio: "FO-2849", room: "501", guest: "Dr. Chukwuemeka Bello", cat: "Restaurant", desc: "Welcome champagne (comp upgrade)", amount: 15000, date: "2025-10-14 14:30", by: "Grace M.", status: "Posted" as ChargeStatus, ref: "", disputeNote: "" },
    { id: "CH-5044", folio: "FO-2847", room: "304", guest: "Chukwuemeka Obi", cat: "Restaurant", desc: "Dinner for 2 — Table T04", amount: 22500, date: "2025-10-13 21:00", by: "Restaurant System", status: "Disputed" as ChargeStatus, ref: "DR003", disputeNote: "Guest claims amount differs from bill presented" },
    { id: "CH-5045", folio: "FO-2851", room: "418", guest: "Fatima Ibrahim", cat: "Restaurant", desc: "Room Service RS-0039", amount: 5200, date: "2025-10-14 11:00", by: "Restaurant System", status: "Failed" as ChargeStatus, ref: "RS-0039", disputeNote: "" },
    { id: "CH-5046", folio: "FO-2852", room: "311", guest: "Bello Abubakar", cat: "Spa", desc: "Spa session — 60 min massage", amount: 18000, date: "2025-10-14 16:00", by: "Spa System", status: "Pending" as ChargeStatus, ref: "", disputeNote: "" },
    { id: "CH-5047", folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Laundry", desc: "Express laundry — 4 items", amount: 4500, date: "2025-10-14 09:00", by: "Housekeeping", status: "Reversed" as ChargeStatus, ref: "", disputeNote: "Double-posted in error" },
  ];

  const stColors: Record<ChargeStatus,{bg:string;text:string}> = {
    "Posted":   { bg: "#DCFCE7", text: "#166534" },
    "Pending":  { bg: "#F1F5F9", text: "#475569" },
    "Failed":   { bg: "#FEE2E2", text: "#991B1B" },
    "Disputed": { bg: "#FEF3C7", text: "#92400E" },
    "Reversed": { bg: "#F3E8FF", text: "#6B21A8" },
  };

  const catColors: Record<string,{bg:string;text:string}> = {
    Restaurant: { bg: "#EFF6FF", text: PRIMARY },
    Minibar:    { bg: "#F0FDF4", text: "#166534" },
    Spa:        { bg: "#FDF4FF", text: "#7E22CE" },
    Laundry:    { bg: "#FFFBEB", text: "#92400E" },
  };

  const [charges, setCharges] = useState(CHARGES_INIT);
  const [selected, setSelected] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState<ChargeStatus|"All">("All");
  const [showDispute, setShowDispute] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [disputeNote, setDisputeNote] = useState("");
  const [postRoom, setPostRoom] = useState("202");
  const [postAmt, setPostAmt] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postCat, setPostCat] = useState("Restaurant");

  const retry = (id: string) => {
    setCharges(prev => prev.map(c => c.id === id ? { ...c, status: "Pending" } : c));
    setTimeout(() => {
      setCharges(prev => prev.map(c => c.id === id ? { ...c, status: "Posted" } : c));
    }, 1200);
    add({ type: "info", title: `Retrying charge ${id}…` });
  };

  const openDispute = (id: string) => { setSelected(id); setDisputeNote(""); setShowDispute(true); };

  const confirmDispute = () => {
    if (!selected || !disputeNote.trim()) return;
    setCharges(prev => prev.map(c => c.id === selected ? { ...c, status: "Disputed", disputeNote } : c));
    add({ type: "warning", title: `Charge ${selected} — dispute raised`, body: disputeNote });
    setShowDispute(false);
  };

  const resolveDispute = (id: string, action: "Reversed"|"Posted") => {
    setCharges(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
    add({ type: "success", title: `Dispute ${action === "Reversed" ? "resolved — reversed" : "dismissed — charge reinstated"}` });
    setSelected(null);
  };

  const filtered = statusFilter === "All" ? charges : charges.filter(c=>c.status===statusFilter);
  const sel = charges.find(c=>c.id===selected);

  const total = charges.filter(c=>c.status==="Posted").reduce((s,c)=>s+c.amount,0);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Guest Room Charges" sub="F&B and ancillary charges posted to room folios — retry, dispute, reverse" actions={<BtnP label="Post Charge" icon={Plus} onClick={() => setShowPost(true)} />} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Posted Today" value={`₦${total.toLocaleString()}`} sub="Revenue to folios" icon={DollarSign} accent={PRIMARY} />
          <StatCard label="Failed" value={String(charges.filter(c=>c.status==="Failed").length)} sub="Require retry" icon={AlertTriangle} accent={ERROR} />
          <StatCard label="Disputed" value={String(charges.filter(c=>c.status==="Disputed").length)} sub="Awaiting resolution" icon={AlertTriangle} accent={ORANGE} />
          <StatCard label="Active Rooms" value={String(new Set(charges.filter(c=>!["Reversed"].includes(c.status)).map(c=>c.room)).size)} sub="With open charges" icon={BedDouble} accent={TEAL} />
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["All","Posted","Pending","Failed","Disputed","Reversed"] as (ChargeStatus|"All")[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="text-xs px-3 py-1.5 rounded-xl border font-medium" style={{ backgroundColor: statusFilter===s ? PRIMARY : "white", color: statusFilter===s ? "white" : MUTED, borderColor: statusFilter===s ? PRIMARY : BORDER }}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Charge ID","Folio","Room / Guest","Category","Description","Amount","Posted","Status",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selected===c.id ? "#EFF6FF" : c.status==="Failed" ? "#FFF8F8" : c.status==="Disputed" ? "#FFFBEB" : undefined }}>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{c.id}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{c.folio}</td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-bold" style={{ color: PRIMARY }}>{c.room}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{c.guest}</div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: catColors[c.cat]?.bg ?? "#F4F4F5", color: catColors[c.cat]?.text ?? MUTED }}>{c.cat}</span></td>
                  <td className="px-3 py-3 text-sm max-w-44 truncate" style={{ color: TEXT }}>{c.desc}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: c.status==="Reversed" ? SUBTLE : PRIMARY, fontFamily: mono, textDecoration: c.status==="Reversed" ? "line-through" : "none" }}>₦{c.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{c.date.slice(11)}</td>
                  <td className="px-3 py-3"><Badge label={c.status} colors={stColors[c.status]} /></td>
                  <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                    <div className="flex gap-1">
                      {c.status === "Failed" && <button onClick={() => retry(c.id)} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Retry</button>}
                      {c.status === "Posted" && <button onClick={() => openDispute(c.id)} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Dispute</button>}
                      {c.status === "Disputed" && <><button onClick={() => resolveDispute(c.id, "Reversed")} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>Reverse</button><button onClick={() => resolveDispute(c.id, "Posted")} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Dismiss</button></>}
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
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-4"><div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</div><div className="text-xs mt-0.5" style={{ color: TEAL }}>{sel.folio}</div></div><button onClick={() => setSelected(null)} style={{ color: MUTED }}>✕</button></div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span style={{ color: MUTED }}>Room</span><span className="font-bold" style={{ color: PRIMARY }}>{sel.room}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Guest</span><span style={{ color: TEXT }}>{sel.guest}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Category</span><span style={{ color: MUTED }}>{sel.cat}</span></div>
            <div className="flex justify-between items-start"><span style={{ color: MUTED }}>Description</span><span className="text-right max-w-32 text-xs" style={{ color: TEXT }}>{sel.desc}</span></div>
            <div className="flex justify-between font-bold"><span style={{ color: MUTED }}>Amount</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{sel.amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Date/Time</span><span className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{sel.date}</span></div>
            <div className="flex justify-between"><span style={{ color: MUTED }}>Posted by</span><span style={{ color: TEXT }}>{sel.by}</span></div>
            <div className="flex justify-between items-center"><span style={{ color: MUTED }}>Status</span><Badge label={sel.status} colors={stColors[sel.status]} /></div>
            {sel.ref && <div className="flex justify-between"><span style={{ color: MUTED }}>Reference</span><span style={{ color: TEAL, fontFamily: mono }}>{sel.ref}</span></div>}
          </div>
          {sel.disputeNote && <div className="px-3 py-2 rounded-xl text-xs mb-4" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}><div className="font-semibold mb-0.5">Dispute note:</div>{sel.disputeNote}</div>}
          <div className="space-y-2">
            {sel.status === "Failed" && <button onClick={() => { retry(sel.id); setSelected(null); }} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>Retry Posting</button>}
            {sel.status === "Posted" && <button onClick={() => { openDispute(sel.id); }} className="w-full py-2 rounded-xl text-sm font-semibold border" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>Raise Dispute</button>}
            {sel.status === "Disputed" && <>
              <button onClick={() => resolveDispute(sel.id, "Reversed")} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ORANGE }}>Reverse Charge</button>
              <button onClick={() => resolveDispute(sel.id, "Posted")} className="w-full py-2 rounded-xl text-sm font-semibold border" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Dismiss Dispute</button>
            </>}
          </div>
        </div>
      )}

      {/* Dispute modal */}
      {showDispute && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowDispute(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Raise Dispute</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Charge {selected} — this will flag for manager review.</p>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Dispute Reason</label><textarea value={disputeNote} onChange={e=>setDisputeNote(e.target.value)} rows={3} placeholder="Explain the dispute…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowDispute(false)} /><button onClick={confirmDispute} disabled={!disputeNote.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ORANGE }}>Submit Dispute</button></div>
          </div>
        </>
      )}

      {/* Post charge modal */}
      {showPost && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowPost(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Post Room Charge</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Room</label><input value={postRoom} onChange={e=>setPostRoom(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Category</label><select value={postCat} onChange={e=>setPostCat(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>Restaurant</option><option>Minibar</option><option>Spa</option><option>Laundry</option><option>Telephone</option></select></div>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label><input value={postDesc} onChange={e=>setPostDesc(e.target.value)} placeholder="Charge description…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Amount (₦)</label><input type="number" value={postAmt} onChange={e=>setPostAmt(e.target.value)} placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowPost(false)} /><button onClick={() => { add({ type: "success", title: `Charge posted to Room ${postRoom}`, body: `₦${Number(postAmt).toLocaleString()} — ${postDesc}` }); setShowPost(false); setPostAmt(""); setPostDesc(""); }} disabled={!postAmt||!postDesc} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Post to Folio</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// IV-02 Products
export function ProductsScreen({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ITEMS = [
    { sku:"LIN-001", name:"Bath Towels",          cat:"Linen",      unit:"pcs",   stock:148, par:200, reorder:80,  reorderQty:100, unitCost:2800, lastCost:2900, avgCost:2850, suppliers:["Lagos Linen Co."],   perishable:false, expiry:"",         barcode:"6001234567890", location:"Linen Store" },
    { sku:"LIN-002", name:"Bed Sheets (King)",    cat:"Linen",      unit:"sets",  stock:88,  par:120, reorder:50,  reorderQty:60,  unitCost:4500, lastCost:4500, avgCost:4450, suppliers:["Lagos Linen Co."],   perishable:false, expiry:"",         barcode:"6001234567891", location:"Linen Store" },
    { sku:"TOI-001", name:"Shower Gel 300ml",     cat:"Toiletries", unit:"btl",   stock:62,  par:500, reorder:100, reorderQty:200, unitCost:450,  lastCost:460,  avgCost:452,  suppliers:["Procter Nig."],      perishable:true,  expiry:"Jan 2026", barcode:"6001234567892", location:"Housekeeping" },
    { sku:"TOI-002", name:"Shampoo 250ml",        cat:"Toiletries", unit:"btl",   stock:78,  par:500, reorder:100, reorderQty:200, unitCost:380,  lastCost:390,  avgCost:382,  suppliers:["Procter Nig."],      perishable:true,  expiry:"Feb 2026", barcode:"6001234567893", location:"Housekeeping" },
    { sku:"FB-001",  name:"Mineral Water 50cl",   cat:"F&B",        unit:"btl",   stock:240, par:1000,reorder:300, reorderQty:500, unitCost:120,  lastCost:125,  avgCost:121,  suppliers:["Abuja Fresh Farms"], perishable:true,  expiry:"Dec 2025", barcode:"6001234567894", location:"F&B Store" },
    { sku:"FB-002",  name:"Eggs (Crate)",         cat:"F&B",        unit:"crate", stock:22,  par:80,  reorder:25,  reorderQty:40,  unitCost:3800, lastCost:4000, avgCost:3850, suppliers:["Abuja Fresh Farms"], perishable:true,  expiry:"18 Oct",   barcode:"6001234567895", location:"Cold Room" },
    { sku:"CLN-001", name:"Floor Cleaner 5L",     cat:"Cleaning",   unit:"jrn",   stock:18,  par:60,  reorder:20,  reorderQty:30,  unitCost:2200, lastCost:2200, avgCost:2180, suppliers:["Jumia Business"],    perishable:false, expiry:"",         barcode:"6001234567896", location:"Maintenance" },
    { sku:"KIT-001", name:"Cooking Gas (12.5kg)", cat:"Kitchen",    unit:"cyl",   stock:3,   par:12,  reorder:4,   reorderQty:6,   unitCost:12500,lastCost:13000,avgCost:12600,suppliers:["Eko Gas Ltd"],       perishable:false, expiry:"",         barcode:"6001234567897", location:"Kitchen" },
    { sku:"KIT-002", name:"Palm Oil (25L)",       cat:"Kitchen",    unit:"drum",  stock:14,  par:20,  reorder:6,   reorderQty:10,  unitCost:42000,lastCost:44000,avgCost:42500,suppliers:["Abuja Fresh Farms"], perishable:true,  expiry:"Mar 2026", barcode:"6001234567898", location:"Kitchen" },
  ];

  const MOVEMENT_HISTORY: Record<string, {date:string;type:string;qty:number;ref:string;by:string}[]> = {
    "LIN-001": [
      { date:"14 Oct 14:22",type:"Issue",      qty:-12, ref:"HK-TASK-0441",by:"Ada Okonkwo" },
      { date:"13 Oct 22:00",type:"Issue",      qty:-8,  ref:"HK-SHIFT-PM", by:"HK Supervisor" },
      { date:"10 Oct 09:00",type:"Receipt",    qty:100, ref:"PO-0430",      by:"Store Mgr" },
    ],
    "FB-002": [
      { date:"14 Oct 11:30",type:"Issue",      qty:-5,  ref:"KITCHEN-DAILY",by:"Chef Emeka" },
      { date:"13 Oct 11:15",type:"Issue",      qty:-6,  ref:"KITCHEN-DAILY",by:"Chef Emeka" },
      { date:"12 Oct 08:00",type:"Receipt",    qty:20,  ref:"PO-0438",      by:"Store Mgr" },
    ],
  };

  type TxnType = "Receipt"|"Issue"|"Transfer"|"Adjustment"|"Wastage"|"Return"|"Count";
  const CATS = ["All Categories","Linen","Toiletries","F&B","Cleaning","Kitchen"];
  const [catFilter, setCatFilter]   = useState("All Categories");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<string|null>(null);
  const [showAdj, setShowAdj]       = useState<string|null>(null);
  const [adjQty, setAdjQty]         = useState("");
  const [adjReason, setAdjReason]   = useState("");
  const [adjPin, setAdjPin]         = useState("");
  const [items, setItems]           = useState(ITEMS);

  const applyAdj = (sku: string) => {
    if (adjPin !== "1234") { add({ type:"error", title:"Invalid Manager PIN" }); return; }
    if (!adjReason.trim()) { add({ type:"error", title:"Reason required for adjustment" }); return; }
    const qty = parseInt(adjQty);
    if (isNaN(qty)) { add({ type:"error", title:"Invalid quantity" }); return; }
    setItems(prev=>prev.map(p=>p.sku===sku?{...p,stock:Math.max(0,p.stock+qty)}:p));
    add({ type:"success", title:`Adjustment applied — ${sku}`, body:`${qty>=0?"+":""}${qty} units · ${adjReason}` });
    setShowAdj(null); setAdjQty(""); setAdjReason(""); setAdjPin("");
  };

  const filtered = items.filter(p =>
    (catFilter==="All Categories"||p.cat===catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase())||p.sku.toLowerCase().includes(search.toLowerCase()))
  );
  const sel = items.find(p=>p.sku===selected);

  const txnTypeColor: Record<string,{bg:string;text:string}> = {
    Receipt:    { bg:"#DCFCE7", text:"#166534" },
    Issue:      { bg:"#FEF3C7", text:"#92400E" },
    Adjustment: { bg:"#EDE9FE", text:"#5B21B6" },
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Products & Items" sub="SKU · UoM · multi-location stock · cost history · expiry tracking" actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting product catalog" })} />
            <BtnP label="Add Item" icon={Plus} onClick={() => add({ type:"info", title:"Add inventory item" })} />
          </div>
        } />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total SKUs"      value={String(items.length)}                                                    sub="In catalog"          icon={Package}      accent={PRIMARY} />
          <StatCard label="Below Reorder"   value={String(items.filter(p=>p.stock<=p.reorder).length)}                     sub="Need replenishment"  icon={AlertTriangle} accent={ERROR}   />
          <StatCard label="Perishable"      value={String(items.filter(p=>p.perishable).length)}                           sub="With expiry tracking" icon={Clock}         accent={WARNING} />
          <StatCard label="Total On-Hand ₦" value={`₦${(items.reduce((s,p)=>s+p.stock*p.unitCost,0)/1000).toFixed(0)}K`} sub="Inventory value"     icon={DollarSign}    accent={SUCCESS} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search SKU, name…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
          <div className="flex gap-1.5 flex-wrap">
            {CATS.map(c=><button key={c} onClick={()=>setCatFilter(c)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor:catFilter===c?PRIMARY:"white", color:catFilter===c?"white":MUTED, borderColor:catFilter===c?PRIMARY:BORDER }}>{c}</button>)}
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["SKU","Name","Cat","UoM","Location","Stock","Par","Reorder","Unit Cost","Avg Cost","Expiry",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => {
                const low   = p.stock <= p.reorder;
                const pct   = Math.round((p.stock/p.par)*100);
                const col   = p.stock===0?ERROR:low?WARNING:SUCCESS;
                const expired = p.perishable && p.expiry && (p.expiry.includes("Oct") || p.expiry.includes("Nov 2025"));
                return (
                  <tr key={p.sku} onClick={()=>setSelected(p.sku)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, backgroundColor: selected===p.sku?"#EFF6FF":undefined }}>
                    <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{p.sku}</td>
                    <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{p.name}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{p.cat}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{p.unit}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{p.location}</td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-bold" style={{ color: col }}>{p.stock}</div>
                      <div className="mt-0.5 h-1.5 w-14 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(pct,100)}%`, backgroundColor: col }} /></div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.par}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: low?WARNING:SUBTLE, fontFamily: mono }}>{p.reorder}</td>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{p.unitCost.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{p.avgCost.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: expired?ERROR:p.perishable?WARNING:SUBTLE }}>{p.expiry||"—"}</td>
                    <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={()=>add({type:"info",title:`Edit ${p.sku}`})} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Edit</button>
                        <button onClick={()=>setShowAdj(p.sku)} className="text-xs px-2 py-1 rounded border font-semibold" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Adjust</button>
                      </div>
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
        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
            <div className="flex items-start justify-between mb-4">
              <div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.name}</div><div className="text-xs mt-0.5" style={{ color: PRIMARY, fontFamily: mono }}>{sel.sku}</div></div>
              <button onClick={()=>setSelected(null)} style={{ color: MUTED }}>✕</button>
            </div>
            <div className="space-y-2 text-xs mb-4">
              {([["Category",sel.cat],["Unit",sel.unit],["Location",sel.location],["Barcode",sel.barcode],["Supplier",sel.suppliers.join(", ")],["Unit Cost",`₦${sel.unitCost.toLocaleString()}`],["Last Cost",`₦${sel.lastCost.toLocaleString()}`],["Avg Cost",`₦${sel.avgCost.toLocaleString()}`],["Expiry",sel.expiry||"—"]] as [string,string][]).map(([k,v])=>(
                <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold text-right" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
            {sel.perishable && <div className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor:"#FEF3C7", color:"#92400E" }}>⚠ Perishable · Expiry: {sel.expiry}</div>}
          </div>
          {MOVEMENT_HISTORY[sel.sku] && (
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Movement History</h4>
              {MOVEMENT_HISTORY[sel.sku].map((m,i) => (
                <div key={i} className="flex items-start gap-2 mb-2.5">
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold mt-0.5 whitespace-nowrap" style={{ backgroundColor: txnTypeColor[m.type]?.bg||"#F4F4F5", color: txnTypeColor[m.type]?.text||TEXT }}>{m.type}</span>
                  <div className="flex-1 text-xs"><div style={{ color: TEXT }}>{m.ref}</div><div style={{ color: SUBTLE }}>{m.date} · {m.by}</div></div>
                  <span className="text-xs font-bold" style={{ color: m.qty<0?ERROR:SUCCESS, fontFamily: mono }}>{m.qty>0?"+":""}{m.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adjustment modal */}
      {showAdj && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>{setShowAdj(null);setAdjQty("");setAdjReason("");setAdjPin("");}} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Stock Adjustment — {showAdj}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Manager PIN required. Use negative values for write-off.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Qty Change (e.g. −3 or +10)</label><input type="number" value={adjQty} onChange={e=>setAdjQty(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Reason (required)</label><input value={adjReason} onChange={e=>setAdjReason(e.target.value)} placeholder="Breakage, correction, count…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" maxLength={4} value={adjPin} onChange={e=>setAdjPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={()=>{setShowAdj(null);setAdjQty("");setAdjReason("");setAdjPin("");}} />
              <button onClick={()=>applyAdj(showAdj)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>Apply Adjustment</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function SuppliersScreen({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const SUPPLIERS = [
    { id:"SUP-001", company:"Lagos Linen Co.",    cat:"Linen",      contact:"Funmi Adeyemi",  phone:"0803-001-1001", email:"info@lagoslinen.ng",    terms:"Net 30", leadDays:5,  rating:4.8, totalSpend:1240000, onTimePct:96, activePOs:1, outstanding:185000, active:true,  note:"Preferred supplier for bedding and towels" },
    { id:"SUP-002", company:"Procter Nig.",       cat:"Toiletries", contact:"Tunde Okonkwo",  phone:"0801-002-2002", email:"sales@procter.ng",       terms:"Net 14", leadDays:3,  rating:4.5, totalSpend:620000,  onTimePct:91, activePOs:0, outstanding:78000,  active:true,  note:"Amenity kits, bath products" },
    { id:"SUP-003", company:"Abuja Fresh Farms",  cat:"F&B",        contact:"Ngozi Obi",      phone:"0802-003-3003", email:"orders@abujafrm.ng",     terms:"COD",    leadDays:1,  rating:4.2, totalSpend:980000,  onTimePct:88, activePOs:2, outstanding:95400,  active:true,  note:"Daily produce — perishable items" },
    { id:"SUP-004", company:"Jumia Business",     cat:"Cleaning",   contact:"Online Portal",  phone:"0700-800-0000", email:"biz@jumia.com.ng",       terms:"Prepaid",leadDays:2,  rating:3.9, totalSpend:340000,  onTimePct:82, activePOs:1, outstanding:78000,  active:true,  note:"Consumables via e-commerce" },
    { id:"SUP-005", company:"Eko Gas Ltd",        cat:"Kitchen",    contact:"Bello Musa",     phone:"0805-004-4004", email:"bello@ekogas.ng",        terms:"COD",    leadDays:1,  rating:4.6, totalSpend:280000,  onTimePct:98, activePOs:0, outstanding:0,      active:true,  note:"LPG for kitchen and laundry" },
    { id:"SUP-006", company:"GP Maintenance Ltd", cat:"Maintenance",contact:"Chidi Eze",      phone:"0806-005-5005", email:"chidi@gpmaint.ng",       terms:"Net 30", leadDays:7,  rating:4.0, totalSpend:580000,  onTimePct:85, activePOs:1, outstanding:220000, active:true,  note:"General maintenance contracts" },
  ];

  const PRICE_LIST: Record<string, {item:string;unit:string;price:number;lastUpdated:string}[]> = {
    "SUP-001": [{ item:"Bath Towels",      unit:"pcs",  price:2900, lastUpdated:"Oct 2025" },{ item:"Bed Sheets King", unit:"sets", price:4500, lastUpdated:"Sep 2025" }],
    "SUP-003": [{ item:"Eggs (Crate)",     unit:"crate",price:4000, lastUpdated:"Oct 2025" },{ item:"Palm Oil 25L",   unit:"drum", price:44000,lastUpdated:"Oct 2025" },{ item:"Mineral Water",  unit:"btl",  price:125,  lastUpdated:"Sep 2025" }],
  };

  const [selected, setSelected] = useState<string|null>(null);
  const [tab, setTab]           = useState<"overview"|"pricelist"|"history">("overview");
  const sel = SUPPLIERS.find(s=>s.id===selected);

  const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r));

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Suppliers" sub="Vendor directory · ratings · spend · lead times · outstanding balances" actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting supplier list" })} />
            <BtnP label="Add Supplier" icon={Plus} onClick={() => add({ type:"info", title:"Add supplier" })} />
          </div>
        } />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Suppliers"   value={String(SUPPLIERS.length)}                                              sub="Registered vendors"    icon={Truck}         accent={PRIMARY} />
          <StatCard label="Active POs"        value={String(SUPPLIERS.reduce((s,v)=>s+v.activePOs,0))}                     sub="Outstanding orders"    icon={FileText}      accent={TEAL}    />
          <StatCard label="Outstanding AP"    value={`₦${SUPPLIERS.reduce((s,v)=>s+v.outstanding,0).toLocaleString()}`}   sub="Unpaid balances"       icon={AlertCircle}   accent={ERROR}   />
          <StatCard label="Total Spend (YTD)" value={`₦${(SUPPLIERS.reduce((s,v)=>s+v.totalSpend,0)/1000).toFixed(0)}K`} sub="All vendors year-to-date" icon={DollarSign} accent={SUCCESS} />
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Supplier","Category","Contact","Terms","Lead","Rating","On-Time","Spend","Outstanding","POs",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {SUPPLIERS.map(s => (
                <tr key={s.id} onClick={()=>setSelected(s.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, backgroundColor: selected===s.id?"#EFF6FF":undefined }}>
                  <td className="px-3 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{s.company}</div><div className="text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{s.id}</div></td>
                  <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor:"#EFF6FF", color: PRIMARY }}>{s.cat}</span></td>
                  <td className="px-3 py-3"><div className="text-xs" style={{ color: TEXT }}>{s.contact}</div><div className="text-xs" style={{ color: SUBTLE }}>{s.phone}</div></td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.terms}</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: s.leadDays<=2?SUCCESS:s.leadDays<=5?WARNING:ORANGE, fontFamily: mono }}>{s.leadDays}d</td>
                  <td className="px-3 py-3"><div className="text-xs" style={{ color: s.rating>=4.5?SUCCESS:s.rating>=4?WARNING:ERROR }}>{stars(s.rating)}</div><div className="text-xs font-semibold" style={{ color: MUTED }}>{s.rating}</div></td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: s.onTimePct>=95?SUCCESS:s.onTimePct>=85?WARNING:ERROR }}>{s.onTimePct}%</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{(s.totalSpend/1000).toFixed(0)}K</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: s.outstanding>0?ERROR:SUBTLE, fontFamily: mono }}>{s.outstanding>0?`₦${s.outstanding.toLocaleString()}`:"—"}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: s.activePOs>0?PRIMARY:SUBTLE }}>{s.activePOs}</td>
                  <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>add({type:"info",title:`Create PO — ${s.company}`})} className="text-xs px-2.5 py-1.5 rounded border font-semibold whitespace-nowrap" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Create PO</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-3">
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.company}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{sel.id}</div></div>
            <button onClick={()=>setSelected(null)} style={{ color: MUTED }}>✕</button>
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-[#F8FAFC] border mb-4" style={{ borderColor: BORDER }}>
            {(["overview","pricelist","history"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize" style={{ backgroundColor: tab===t?"white":"transparent", color: tab===t?PRIMARY:MUTED, boxShadow: tab===t?"0 1px 2px rgba(0,0,0,0.06)":undefined }}>{t}</button>
            ))}
          </div>
          {tab==="overview" && (
            <div className="space-y-2 text-sm">
              {([["Category",sel.cat],["Contact",sel.contact],["Phone",sel.phone],["Email",sel.email],["Terms",sel.terms],["Lead Time",`${sel.leadDays} days`],["Rating",`${sel.rating} / 5`],["On-Time %",`${sel.onTimePct}%`],["Total Spend",`₦${sel.totalSpend.toLocaleString()}`],["Outstanding",sel.outstanding>0?`₦${sel.outstanding.toLocaleString()}`:"₦0"],["Active POs",String(sel.activePOs)]] as [string,string][]).map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>
              ))}
              <div className="pt-2 text-xs italic" style={{ color: SUBTLE }}>{sel.note}</div>
            </div>
          )}
          {tab==="pricelist" && (
            <div>
              {PRICE_LIST[sel.id] ? PRICE_LIST[sel.id].map((p,i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: BORDER }}>
                  <div><div style={{ color: TEXT }}>{p.item}</div><div style={{ color: SUBTLE }}>per {p.unit} · {p.lastUpdated}</div></div>
                  <div className="font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{p.price.toLocaleString()}</div>
                </div>
              )) : <div className="text-xs text-center py-4" style={{ color: SUBTLE }}>No price list on file</div>}
            </div>
          )}
          {tab==="history" && (
            <div className="text-xs" style={{ color: MUTED }}>
              <div className="py-2 border-b" style={{ borderColor: BORDER }}>
                <div className="font-semibold" style={{ color: TEXT }}>PO-0451 · Mineral Water</div>
                <div>₦60,000 · 10 Oct · Received</div>
              </div>
              <div className="py-2 border-b" style={{ borderColor: BORDER }}>
                <div className="font-semibold" style={{ color: TEXT }}>PO-0438 · Eggs</div>
                <div>₦80,000 · 01 Oct · Received</div>
              </div>
              <div className="py-2 text-center" style={{ color: SUBTLE }}>3 previous orders this quarter</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function StockTransactions({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type TxnType = "Receipt"|"Issue"|"Transfer"|"Adjustment"|"Wastage"|"Return"|"Count";

  const INIT_TXN = [
    { id:"TXN-0291", date:"14 Oct 14:22", item:"Bath Towels",         sku:"LIN-001", type:"Issue" as TxnType,      qty:-12, from:"Linen Store",    to:"Room 202",         ref:"HK-TASK-0441",  unitCost:2800, value:33600,  by:"Ada Okonkwo",    reason:"" },
    { id:"TXN-0290", date:"14 Oct 13:05", item:"Mineral Water 50cl",  sku:"FB-001",  type:"Receipt" as TxnType,    qty:500, from:"",               to:"F&B Store",        ref:"PO-0451",       unitCost:120,  value:60000,  by:"Store Mgr",      reason:"" },
    { id:"TXN-0289", date:"14 Oct 11:30", item:"Eggs (Crate)",        sku:"FB-002",  type:"Issue" as TxnType,      qty:-5,  from:"Cold Room",       to:"Main Kitchen",     ref:"KITCHEN-DAILY", unitCost:3800, value:19000,  by:"Chef Emeka",     reason:"" },
    { id:"TXN-0288", date:"14 Oct 09:15", item:"Floor Cleaner 5L",    sku:"CLN-001", type:"Adjustment" as TxnType, qty:-2,  from:"Maintenance",     to:"",                 ref:"BREAKAGE-ADJ",  unitCost:2200, value:4400,   by:"Mgr. Bello",     reason:"2 bottles broken during cleaning shift" },
    { id:"TXN-0287", date:"13 Oct 22:00", item:"Shower Gel 300ml",    sku:"TOI-001", type:"Issue" as TxnType,      qty:-24, from:"Housekeeping",    to:"Room Restocking",  ref:"HK-SHIFT-PM",   unitCost:450,  value:10800,  by:"HK Supervisor",  reason:"" },
    { id:"TXN-0286", date:"13 Oct 16:40", item:"Cooking Gas (12.5kg)",sku:"KIT-001", type:"Receipt" as TxnType,    qty:6,   from:"",               to:"Kitchen",          ref:"PO-0448",       unitCost:12500,value:75000,  by:"Store Mgr",      reason:"" },
    { id:"TXN-0285", date:"13 Oct 10:20", item:"Shampoo 250ml",       sku:"TOI-002", type:"Return" as TxnType,     qty:8,   from:"Room Restocking", to:"Housekeeping",     ref:"HK-RETURN-003", unitCost:380,  value:3040,   by:"Ada Okonkwo",    reason:"Excess returned from floors" },
    { id:"TXN-0284", date:"12 Oct 14:00", item:"Bath Towels",         sku:"LIN-001", type:"Transfer" as TxnType,   qty:20,  from:"Linen Store",     to:"Pool Towel Store", ref:"INTERNAL-TRF",  unitCost:2800, value:56000,  by:"HK Supervisor",  reason:"Pool restocking" },
    { id:"TXN-0283", date:"12 Oct 09:00", item:"Palm Oil (25L)",      sku:"KIT-002", type:"Wastage" as TxnType,    qty:-1,  from:"Kitchen",         to:"",                 ref:"WASTE-OCT12",   unitCost:42000,value:42000,  by:"Chef Emeka",     reason:"Expired — past best-before date" },
    { id:"TXN-0282", date:"11 Oct 18:00", item:"Eggs (Crate)",        sku:"FB-002",  type:"Count" as TxnType,      qty:0,   from:"Cold Room",       to:"",                 ref:"STOCKCOUNT-OCT",unitCost:3800, value:0,      by:"Mgr. Bello",     reason:"Periodic stock count — variance: 0" },
  ];

  const typeColor: Record<TxnType,{bg:string;text:string}> = {
    Receipt:    { bg:"#DCFCE7", text:"#166534" },
    Issue:      { bg:"#FEF3C7", text:"#92400E" },
    Transfer:   { bg:"#DBEAFE", text:"#1E40AF" },
    Adjustment: { bg:"#EDE9FE", text:"#5B21B6" },
    Wastage:    { bg:"#FEE2E2", text:"#991B1B" },
    Return:     { bg:"#F0FDF4", text:"#166534" },
    Count:      { bg:"#F3F4F6", text:"#374151" },
  };

  const ALL_TYPES: (TxnType|"All")[] = ["All","Receipt","Issue","Transfer","Adjustment","Wastage","Return","Count"];

  const [txns, setTxns]           = useState(INIT_TXN);
  const [typeFilter, setTypeFilter] = useState<TxnType|"All">("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showNew, setShowNew]     = useState(false);
  const [showCount, setShowCount] = useState(false);

  // New txn form
  const [newType, setNewType]     = useState<TxnType>("Issue");
  const [newItem, setNewItem]     = useState("");
  const [newQty, setNewQty]       = useState("");
  const [newFrom, setNewFrom]     = useState("");
  const [newTo, setNewTo]         = useState("");
  const [newRef, setNewRef]       = useState("");
  const [newReason, setNewReason] = useState("");
  const [newPin, setNewPin]       = useState("");

  const needsPin   = newType==="Adjustment"||newType==="Wastage";
  const needsReason = newType==="Adjustment"||newType==="Wastage"||newType==="Return";

  const logTxn = () => {
    if (needsPin && newPin!=="1234") { add({ type:"error", title:"Invalid Manager PIN" }); return; }
    if (needsReason && !newReason.trim()) { add({ type:"error", title:"Reason required for this transaction type" }); return; }
    const qty = parseInt(newQty)||0;
    const id  = `TXN-${String(parseInt(txns[0].id.split("-")[1])+1).padStart(4,"0")}`;
    setTxns(prev => [{ id, date:"14 Oct now", item:newItem||"—", sku:"—", type:newType, qty, from:newFrom, to:newTo, ref:newRef||id, unitCost:0, value:0, by:"Current User", reason:newReason },...prev]);
    add({ type:"success", title:`Transaction logged — ${newType}`, body:`${qty>=0?"+":""}${qty} · ${newItem}` });
    setShowNew(false); setNewItem(""); setNewQty(""); setNewFrom(""); setNewTo(""); setNewRef(""); setNewReason(""); setNewPin("");
  };

  // Stock count
  const [countItems, setCountItems] = useState([
    { sku:"LIN-001", name:"Bath Towels",        system:148, counted:0, done:false },
    { sku:"TOI-001", name:"Shower Gel 300ml",   system:62,  counted:0, done:false },
    { sku:"FB-001",  name:"Mineral Water 50cl", system:240, counted:0, done:false },
    { sku:"KIT-001", name:"Cooking Gas",        system:3,   counted:0, done:false },
  ]);

  const filtered = txns.filter(t =>
    (typeFilter==="All"||t.type===typeFilter) &&
    (!dateFilter||t.date.includes(dateFilter))
  );

  return (
    <div>
      <PageHeader title="Stock Transactions" sub="Receipts · issues · transfers · adjustments · wastage · stock counts" actions={
        <div className="flex gap-2">
          <BtnO label="Stock Count" icon={ClipboardList} onClick={()=>setShowCount(true)} />
          <BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Exporting transactions"})} />
          <BtnP label="Log Movement" icon={Plus} onClick={()=>setShowNew(true)} />
        </div>
      } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Receipts Today"   value={String(txns.filter(t=>t.type==="Receipt"&&t.date.includes("14 Oct")).length)} sub="Items received"     icon={TrendingUp}    accent={SUCCESS} />
        <StatCard label="Issues Today"     value={String(txns.filter(t=>t.type==="Issue"&&t.date.includes("14 Oct")).length)}   sub="Items consumed"     icon={TrendingDown}  accent={ORANGE}  />
        <StatCard label="Adjustments"      value={String(txns.filter(t=>t.type==="Adjustment").length)}                         sub="Corrections (need reason)" icon={Edit3}   accent={WARNING} />
        <StatCard label="Wastage Value"    value={`₦${txns.filter(t=>t.type==="Wastage").reduce((s,t)=>s+t.value,0).toLocaleString()}`} sub="Written-off" icon={Trash2}  accent={ERROR}   />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {ALL_TYPES.map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)} className="text-xs px-3 py-1.5 rounded-xl border" style={{ backgroundColor: typeFilter===t?PRIMARY:"white", color: typeFilter===t?"white":MUTED, borderColor: typeFilter===t?PRIMARY:BORDER }}>{t}</button>
        ))}
        <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="ml-auto px-3 py-1.5 text-xs rounded-xl border bg-white outline-none" style={{ borderColor: BORDER }} />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Txn ID","Date","Item","SKU","Type","Qty","From","To","Ref","Unit Cost","Value","By",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.date}</td>
                <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{t.item}</td>
                <td className="px-3 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{t.sku}</td>
                <td className="px-3 py-3"><Badge label={t.type} colors={typeColor[t.type]} /></td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: t.qty<0?ERROR:t.qty>0?SUCCESS:SUBTLE, fontFamily: mono }}>{t.qty!==0?(t.qty>0?"+":"")+t.qty:"—"}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{t.from||"—"}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{t.to||"—"}</td>
                <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{t.ref}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.unitCost?`₦${t.unitCost.toLocaleString()}`:"—"}</td>
                <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{t.value?`₦${t.value.toLocaleString()}`:"—"}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{t.by}</td>
                <td className="px-3 py-3 text-xs" style={{ color: SUBTLE }}>{t.reason&&<span title={t.reason} className="cursor-help underline decoration-dotted">note</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New transaction modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Log Stock Movement</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Movement Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["Receipt","Issue","Transfer","Adjustment","Wastage","Return"] as TxnType[]).map(t=>(
                    <button key={t} onClick={()=>setNewType(t)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold" style={{ backgroundColor: newType===t?PRIMARY:"white", color: newType===t?"white":MUTED, borderColor: newType===t?PRIMARY:BORDER }}>{t}</button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Item Name</label><input value={newItem} onChange={e=>setNewItem(e.target.value)} placeholder="Item name" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Quantity</label><input type="number" value={newQty} onChange={e=>setNewQty(e.target.value)} placeholder={newType==="Issue"||newType==="Wastage"?"−qty":"+qty"} className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>From Location</label><input value={newFrom} onChange={e=>setNewFrom(e.target.value)} placeholder="Store, supplier…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>To Location</label><input value={newTo} onChange={e=>setNewTo(e.target.value)} placeholder="Kitchen, room…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div className="col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Reference</label><input value={newRef} onChange={e=>setNewRef(e.target.value)} placeholder="PO number, work order…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              {needsReason && <div className="col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: ERROR }}>Reason (required for {newType})</label><input value={newReason} onChange={e=>setNewReason(e.target.value)} placeholder="State reason clearly…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: ERROR }} /></div>}
              {needsPin && <div className="col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Manager PIN (required for {newType})</label><input type="password" maxLength={4} value={newPin} onChange={e=>setNewPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>}
            </div>
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>setShowNew(false)} />
              <button onClick={logTxn} disabled={!newItem||!newQty} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Log Movement</button>
            </div>
          </div>
        </>
      )}

      {/* Stock count modal */}
      {showCount && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowCount(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Stock Count Session</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Enter physical counts. Variance = System − Counted.</p>
            <div className="space-y-2 mb-4">
              {countItems.map((ci,i) => {
                const variance = ci.done ? ci.system - ci.counted : null;
                return (
                  <div key={ci.sku} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border" style={{ borderColor: variance!=null&&variance!==0?WARNING:BORDER }}>
                    <div className="flex-1 text-sm" style={{ color: TEXT }}>{ci.name}</div>
                    <div className="text-xs text-right" style={{ color: MUTED }}><div>System: {ci.system}</div>{ci.done&&<div style={{ color: variance!==0?WARNING:SUCCESS }}>Var: {variance!==0?variance:"✓"}</div>}</div>
                    <input type="number" value={ci.counted||""} onChange={e=>setCountItems(prev=>prev.map((x,j)=>j===i?{...x,counted:parseInt(e.target.value)||0}:x))} placeholder="Count" className="w-20 px-2 py-1.5 rounded-lg border text-sm outline-none text-center" style={{ borderColor: BORDER, fontFamily: mono }} />
                    <button onClick={()=>setCountItems(prev=>prev.map((x,j)=>j===i?{...x,done:true}:x))} disabled={ci.done} className="text-xs px-2 py-1.5 rounded-lg border font-semibold disabled:opacity-40" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>✓</button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-1 mb-4 text-xs">
              <span style={{ color: MUTED }}>{countItems.filter(c=>c.done).length}/{countItems.length} items counted</span>
              {countItems.filter(c=>c.done&&c.system!==c.counted).length>0 && <span className="font-semibold" style={{ color: WARNING }}>{countItems.filter(c=>c.done&&c.system!==c.counted).length} variances found</span>}
            </div>
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>setShowCount(false)} />
              <button onClick={()=>{ add({ type:"success", title:"Stock count saved — variance report generated" }); setShowCount(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save Count & Report</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PurchaseOrders({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type POStatus = "Draft"|"Pending Approval"|"Approved"|"Sent"|"Partially Received"|"Received"|"Cancelled";

  const INIT_POS = [
    { id:"PO-0451", supplier:"Abuja Fresh Farms",  raisedBy:"Store Mgr",    date:"10 Oct", expected:"12 Oct", status:"Received" as POStatus,           total:60000,  receivedPct:100, approver:"Mgr. Bello",
      lines: [{ item:"Mineral Water 50cl", sku:"FB-001", ordered:500, received:500, unitCost:120,  total:60000 }] },
    { id:"PO-0450", supplier:"Lagos Linen Co.",    raisedBy:"HK Supervisor", date:"08 Oct", expected:"13 Oct", status:"Received" as POStatus,           total:185000, receivedPct:100, approver:"Mgr. Bello",
      lines: [{ item:"Bath Towels", sku:"LIN-001", ordered:100, received:100, unitCost:2900, total:290000 }] },
    { id:"PO-0449", supplier:"Jumia Business",     raisedBy:"Store Mgr",    date:"05 Oct", expected:"07 Oct", status:"Partially Received" as POStatus,  total:78000,  receivedPct:60,  approver:"Mgr. Bello",
      lines: [{ item:"Floor Cleaner 5L", sku:"CLN-001", ordered:30, received:18, unitCost:2200, total:39600 },{ item:"Disinfectant Spray", sku:"CLN-002", ordered:50, received:30, unitCost:1800, total:54000 }] },
    { id:"PO-0452", supplier:"Procter Nig.",       raisedBy:"HK Supervisor", date:"14 Oct", expected:"17 Oct", status:"Approved" as POStatus,           total:89600,  receivedPct:0,   approver:"Mgr. Bello",
      lines: [{ item:"Shower Gel 300ml", sku:"TOI-001", ordered:200, received:0, unitCost:460, total:92000 },{ item:"Shampoo 250ml", sku:"TOI-002", ordered:200, received:0, unitCost:390, total:78000 }] },
    { id:"PO-0453", supplier:"Eko Gas Ltd",        raisedBy:"Chef Emeka",   date:"14 Oct", expected:"15 Oct", status:"Sent" as POStatus,                total:75000,  receivedPct:0,   approver:"",
      lines: [{ item:"Cooking Gas 12.5kg", sku:"KIT-001", ordered:6, received:0, unitCost:12500, total:75000 }] },
    { id:"PO-0454", supplier:"Abuja Fresh Farms",  raisedBy:"Chef Emeka",   date:"14 Oct", expected:"14 Oct", status:"Pending Approval" as POStatus,    total:152000, receivedPct:0,   approver:"",
      lines: [{ item:"Eggs (Crate)", sku:"FB-002", ordered:40, received:0, unitCost:4000, total:160000 },{ item:"Palm Oil 25L", sku:"KIT-002", ordered:0, received:0, unitCost:44000, total:0 }] },
    { id:"PO-0455", supplier:"GP Maintenance Ltd", raisedBy:"Maintenance",  date:"12 Oct", expected:"19 Oct", status:"Draft" as POStatus,               total:220000, receivedPct:0,   approver:"",
      lines: [{ item:"Maintenance Contract Q4", sku:"SVC-001", ordered:1, received:0, unitCost:220000, total:220000 }] },
  ];

  const stColors: Record<POStatus,{bg:string;text:string}> = {
    "Draft":              { bg:"#F1F5F9", text:"#475569" },
    "Pending Approval":   { bg:"#DBEAFE", text:"#1E40AF" },
    "Approved":           { bg:"#DCFCE7", text:"#166534" },
    "Sent":               { bg:"#FEF3C7", text:"#92400E" },
    "Partially Received": { bg:"#EDE9FE", text:"#5B21B6" },
    "Received":           { bg:"#F0FDF4", text:"#166534" },
    "Cancelled":          { bg:"#FEE2E2", text:"#991B1B" },
  };

  const [pos, setPos]           = useState(INIT_POS);
  const [selected, setSelected] = useState<string|null>(null);
  const [statusFilter, setFilter] = useState<POStatus|"All">("All");
  const [showApprove, setShowApprove] = useState<string|null>(null);
  const [approvePin, setApprovePin]   = useState("");
  const [showGRN, setShowGRN]         = useState<string|null>(null);
  const [grnQtys, setGrnQtys]         = useState<Record<string,number>>({});

  const approve = (id: string) => {
    if (approvePin!=="1234") { add({ type:"error", title:"Invalid PIN" }); return; }
    setPos(prev=>prev.map(p=>p.id===id?{...p,status:"Approved" as POStatus,approver:"Mgr. Bello"}:p));
    add({ type:"success", title:`${id} approved` }); setShowApprove(null); setApprovePin("");
  };

  const receiveGRN = (id: string) => {
    setPos(prev=>prev.map(po => {
      if (po.id!==id) return po;
      const updLines = po.lines.map(l=>({ ...l, received: l.received+(grnQtys[l.sku]||0) }));
      const totalReceived = updLines.reduce((s,l)=>s+l.received,0);
      const totalOrdered  = updLines.reduce((s,l)=>s+l.ordered,0);
      const newStatus: POStatus = totalReceived>=totalOrdered?"Received":totalReceived>0?"Partially Received":"Sent";
      return { ...po, lines:updLines, receivedPct:Math.round((totalReceived/totalOrdered)*100), status:newStatus };
    }));
    add({ type:"success", title:`GRN recorded — ${id}`, body:"Stock quantities updated" });
    setShowGRN(null); setGrnQtys({});
  };

  const filtered = statusFilter==="All" ? pos : pos.filter(p=>p.status===statusFilter);
  const sel      = pos.find(p=>p.id===selected);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Purchase Orders" sub="Full approval workflow · partial receipts · GRN · invoice match" actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Exporting POs"})} />
            <BtnP label="Create PO" icon={Plus} onClick={()=>add({type:"info",title:"Create purchase order"})} />
          </div>
        } />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total POs"        value={String(pos.length)}                                                        sub="This period"        icon={FileText}      accent={PRIMARY} />
          <StatCard label="Pending Approval" value={String(pos.filter(p=>p.status==="Pending Approval").length)}                sub="Awaiting sign-off"  icon={AlertTriangle} accent={WARNING} />
          <StatCard label="In Transit"       value={String(pos.filter(p=>p.status==="Sent"||p.status==="Approved").length)}    sub="Sent / approved"    icon={Truck}         accent={TEAL}    />
          <StatCard label="Total Committed"  value={`₦${pos.filter(p=>!["Received","Cancelled"].includes(p.status)).reduce((s,p)=>s+p.total,0).toLocaleString()}`} sub="Open orders" icon={DollarSign} accent={ORANGE} />
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["All","Draft","Pending Approval","Approved","Sent","Partially Received","Received","Cancelled"] as (POStatus|"All")[]).map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className="text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap" style={{ backgroundColor:statusFilter===s?PRIMARY:"white", color:statusFilter===s?"white":MUTED, borderColor:statusFilter===s?PRIMARY:BORDER }}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["PO #","Supplier","Raised By","Date","Expected","Status","Total","Received",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id} onClick={()=>setSelected(po.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, backgroundColor: selected===po.id?"#EFF6FF":undefined }}>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{po.id}</td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{po.supplier}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{po.raisedBy}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{po.date}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{po.expected}</td>
                  <td className="px-3 py-3"><Badge label={po.status} colors={stColors[po.status]} /></td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{po.total.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: po.receivedPct===100?SUCCESS:po.receivedPct>0?WARNING:MUTED }}>{po.receivedPct}%</div>
                    <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${po.receivedPct}%`, backgroundColor: po.receivedPct===100?SUCCESS:WARNING }} /></div>
                  </td>
                  <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                    <div className="flex gap-1">
                      {po.status==="Pending Approval" && <button onClick={()=>setShowApprove(po.id)} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>Approve</button>}
                      {po.status==="Approved" && <button onClick={()=>{ setPos(prev=>prev.map(p=>p.id===po.id?{...p,status:"Sent" as POStatus}:p)); add({type:"success",title:`${po.id} sent to supplier`}); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Send</button>}
                      {(po.status==="Sent"||po.status==="Partially Received") && <button onClick={()=>{ setSelected(po.id); setShowGRN(po.id); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Receive</button>}
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
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-4">
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</div><div className="text-xs mt-0.5" style={{ color: TEAL }}>{sel.supplier}</div></div>
            <button onClick={()=>setSelected(null)} style={{ color: MUTED }}>✕</button>
          </div>
          <div className="space-y-1.5 text-xs mb-4">
            {([["Raised By",sel.raisedBy],["Date",sel.date],["Expected",sel.expected],["Approver",sel.approver||"—"],["Status",sel.status],["Received",`${sel.receivedPct}%`]] as [string,string][]).map(([k,v])=>(
              <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>
            ))}
          </div>
          <div className="border rounded-xl overflow-hidden mb-4" style={{ borderColor: BORDER }}>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor:"#F9FAFB", color: MUTED }}>Line Items</div>
            {sel.lines.map((l,i) => {
              const outstanding = l.ordered - l.received;
              return (
                <div key={i} className="px-3 py-2.5 border-t text-xs" style={{ borderColor: BORDER }}>
                  <div className="font-semibold mb-1" style={{ color: TEXT }}>{l.item}</div>
                  <div className="flex justify-between" style={{ color: MUTED }}>
                    <span>Ordered: {l.ordered}</span>
                    <span style={{ color: l.received===l.ordered?SUCCESS:WARNING }}>Received: {l.received}</span>
                    <span style={{ color: outstanding>0?ERROR:SUBTLE }}>O/S: {outstanding}</span>
                  </div>
                  <div className="flex justify-between mt-1"><span style={{ color: MUTED }}>Unit: ₦{l.unitCost.toLocaleString()}</span><span className="font-semibold" style={{ color: PRIMARY }}>₦{l.total.toLocaleString()}</span></div>
                </div>
              );
            })}
            <div className="px-3 py-2.5 border-t flex justify-between text-sm font-bold" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: PRIMARY, fontFamily: mono }}>₦{sel.total.toLocaleString()}</span>
            </div>
          </div>
          <Badge label={sel.status} colors={stColors[sel.status]} />
        </div>
      )}

      {/* Approve modal */}
      {showApprove && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>{setShowApprove(null);setApprovePin("");}} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Approve {showApprove}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Manager PIN required to approve purchase orders.</p>
            <input type="password" maxLength={4} value={approvePin} onChange={e=>setApprovePin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest mb-4" style={{ borderColor: BORDER, fontFamily: mono }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>{setShowApprove(null);setApprovePin("");}} />
              <button onClick={()=>approve(showApprove)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Approve PO</button>
            </div>
          </div>
        </>
      )}

      {/* GRN modal */}
      {showGRN && sel && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>{setShowGRN(null);setGrnQtys({});}} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Goods Received — {showGRN}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Enter quantities received. Partial receipts are supported — stock will update immediately.</p>
            <div className="space-y-3 mb-4">
              {sel.lines.map(l => {
                const outstanding = l.ordered - l.received;
                return (
                  <div key={l.sku} className="px-3 py-3 rounded-xl border" style={{ borderColor: BORDER }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold" style={{ color: TEXT }}>{l.item}</div>
                      <div className="text-xs" style={{ color: MUTED }}>O/S: <span className="font-bold" style={{ color: outstanding>0?PRIMARY:SUBTLE }}>{outstanding}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: MUTED }}>Receive qty:</span>
                      <input type="number" value={grnQtys[l.sku]||""} onChange={e=>setGrnQtys(prev=>({...prev,[l.sku]:Math.min(parseInt(e.target.value)||0,outstanding)}))} max={outstanding} placeholder={`0 – ${outstanding}`} className="flex-1 px-2.5 py-1.5 rounded-lg border text-sm outline-none text-center" style={{ borderColor: BORDER, fontFamily: mono }} />
                    </div>
                    {(grnQtys[l.sku]||0) > 0 && <div className="mt-1.5 text-xs" style={{ color: SUCCESS }}>+₦{((grnQtys[l.sku]||0)*l.unitCost).toLocaleString()} added to stock</div>}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={()=>{setShowGRN(null);setGrnQtys({});}} />
              <button onClick={()=>receiveGRN(showGRN)} disabled={Object.values(grnQtys).every(v=>v===0)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: SUCCESS }}>Record Receipt & Update Stock</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
