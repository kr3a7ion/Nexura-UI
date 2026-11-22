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
  occData, revCat, deptKPIs, recentAct, ROOMS, STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA, ORANGE_INK, TEAL_INK } from "./constants";
import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp, Sel } from "./UIKit";
import { DateInput } from "./DateInput";
import { addWorkOrder, updateWorkOrder } from "./mock/maintenance";
import { downloadCsv } from "./ui";
// MX-07 Vendor Contacts
export function VendorContacts({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCall, setShowCall] = useState<string | null>(null);
  const [callNotes, setCallNotes] = useState("");

  const VENDORS = [
    { id: "VND-001", company: "Airecon Nigeria Ltd", cat: "HVAC / Refrigeration", contact: "Engr. Seun Adeyemi", phone: "+234 804 400 5000", email: "service@airecon.ng", address: "12 Industrial Road, Lagos", services: "AC installation, servicing, refrigerant supply", rateCard: "₦35,000/visit + parts", sla: "4h response, 24h resolution", contractExpiry: "Dec 2026", rating: 4.5, jobsDone: 12, avgResponse: "3h 20m" },
    { id: "VND-002", company: "Mikano International", cat: "Generator / Power", contact: "Mr. Femi Ola", phone: "+234 802 200 3000", email: "service@mikano.ng", address: "5 Aba Johnson Cres, Abuja", services: "Generator sales, servicing, fuel supply, AMC", rateCard: "AMC ₦180,000/year", sla: "2h response (critical), 8h resolution", contractExpiry: "Jun 2027", rating: 4.8, jobsDone: 8, avgResponse: "1h 45m" },
    { id: "VND-003", company: "TechFix Services", cat: "General Maintenance", contact: "Engr. Bayo Ike", phone: "+234 803 300 4000", email: "info@techfix.ng", address: "7 Murtala Way, Abuja", services: "Electrical, plumbing, civil, welding, general repairs", rateCard: "₦15,000/hour labour", sla: "8h response, 48h resolution", contractExpiry: "Mar 2027", rating: 3.9, jobsDone: 34, avgResponse: "6h 10m" },
    { id: "VND-004", company: "Otis Nigeria", cat: "Elevator / Escalator", contact: "Mrs. Amara Eze", phone: "+234 801 100 2000", email: "nigeria@otis.com", address: "10 Marina Street, Lagos", services: "Elevator installation, AMC, emergency callout", rateCard: "AMC ₦620,000/year", sla: "1h emergency response", contractExpiry: "Sep 2027", rating: 4.7, jobsDone: 5, avgResponse: "55m" },
    { id: "VND-005", company: "AquaTech Pool Services", cat: "Pool / Water", contact: "Mr. Chidi Aneke", phone: "+234 805 500 6000", email: "aquatech@pool.ng", address: "3 Recreation Drive, Abuja", services: "Pool maintenance, chemical balance, pump repair", rateCard: "₦45,000/month retainer", sla: "Same-day", contractExpiry: "Dec 2026", rating: 4.2, jobsDone: 18, avgResponse: "2h 30m" },
    { id: "VND-006", company: "Toyota Nigeria Limited", cat: "Vehicles", contact: "Mrs. Kemi James", phone: "+234 806 600 7000", email: "fleet@toyotanigeria.ng", address: "Toyota House, Victoria Island", services: "Fleet servicing, warranty repairs, spare parts", rateCard: "Service rates per model", sla: "Scheduled appointments", contractExpiry: "Oct 2026", rating: 4.6, jobsDone: 7, avgResponse: "N/A" },
  ];

  const sel = selected ? VENDORS.find(v=>v.id===selected) : null;

  const JOB_HISTORY: Record<string, Array<{ date: string; desc: string; amount: number; rating: number }>> = {
    "VND-001": [{ date: "24 Jun 2026", desc: "AC service — Room 207 compressor", amount: 85000, rating: 5 },{ date: "10 May 2026", desc: "Refrigerant recharge — Main AC", amount: 45000, rating: 4 }],
    "VND-002": [{ date: "15 May 2026", desc: "Generator oil change + filter", amount: 35000, rating: 5 }],
    "VND-003": [{ date: "22 Jun 2026", desc: "Lobby electrical fault", amount: 28000, rating: 4 }],
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0">
        <PageHeader title="Vendor Contacts" sub="Suppliers and service contractors linked to maintenance" actions={<><BtnO label="Export" icon={Download} onClick={() => { downloadCsv("vendors.csv", [["ID", "Company", "Category", "Contact", "Phone", "Email"], ...VENDORS.map(v => [v.id, v.company, v.cat, v.contact, v.phone, v.email])]); add({ type: "success", title: `${VENDORS.length} vendors saved as vendors.csv` }); }} /><BtnP label="Add vendor" icon={Plus} onClick={() => add({ type: "info", title: "Add new vendor" })} /></>} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total vendors" value={String(VENDORS.length)} sub="Registered" icon={Truck} accent={PRIMARY} />
          <StatCard label="Active contracts" value={String(VENDORS.filter(v=>v.contractExpiry>"Jun 2026").length)} sub="In force" icon={CheckCircle2} accent={SUCCESS} />
          <StatCard label="Avg rating" value={`${(VENDORS.reduce((s,v)=>s+v.rating,0)/VENDORS.length).toFixed(1)}★`} sub="Across all vendors" icon={Star} accent={ORANGE} />
          <StatCard label="Total jobs" value={String(VENDORS.reduce((s,v)=>s+v.jobsDone,0))} sub="This year" icon={Wrench} accent={TEAL} />
        </div>
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["ID","Company / category","Contact","Services","Rate card","SLA","Contract expiry","Rating","Jobs","Avg response",""].map(h=><th key={h} className="px-3 py-3 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {VENDORS.map(v => (
                <tr key={v.id} onClick={() => setSelected(selected===v.id?null:v.id)} className="border-t cursor-pointer transition-colors hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, backgroundColor: selected===v.id ? "#EFF6FF" : "white" }}>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, whiteSpace: "nowrap" }}>{v.id}</td>
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
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: v.contractExpiry < "Jul 2026" ? ERROR : v.contractExpiry < "Dec 2026" ? ORANGE : TEXT }}>{v.contractExpiry}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1"><Star size={11} style={{ color: ORANGE_INK }} /><span className="text-xs font-semibold" style={{ color: TEXT }}>{v.rating.toFixed(1)}</span></div>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{v.jobsDone}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{v.avgResponse}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                      <button onClick={() => { setShowCall(v.id); setCallNotes(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: MUTED, borderColor: BORDER }}>Log call</button>
                      <button onClick={() => { const w = addWorkOrder({ title: `Job for ${v.company}`, location: "To be confirmed", cat: "General", priority: "P3", reportedBy: "Adaeze Okonkwo", desc: `Work handed to ${v.company}.` }); updateWorkOrder(w.id, { status: "Assigned", tech: "External vendor" }, { event: "Assigned", by: "Adaeze Okonkwo", note: `Given to ${v.company}.` }); add({ type: "success", title: `Work order ${w.id} raised for ${v.company}` }); }} className="text-sm px-2.5 rounded-lg border whitespace-nowrap bg-white" style={{ height: 32, color: TEXT, borderColor: "#CBD5E1" }}>Raise work order</button>
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
            <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</h3><button aria-label="Close" onClick={()=>setSelected(null)} style={{ color: SUBTLE }}><X size={16} /></button></div>
            <div className="text-base font-bold mb-0.5" style={{ color: TEXT }}>{sel.company}</div>
            <div className="text-xs mb-3" style={{ color: MUTED }}>{sel.cat}</div>
            <div className="space-y-1.5 text-xs mb-4">
              {[["Contact",sel.contact],["Phone",sel.phone],["Email",sel.email],["Address",sel.address],["Rate Card",sel.rateCard],["SLA",sel.sla],["Contract Expiry",sel.contractExpiry]].map(([k,v])=>(
                <div key={k} className="flex gap-2"><span className="w-24 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium break-words" style={{ color: TEXT }}>{v}</span></div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2" style={{ color: MUTED }}>Services</div>
              <div className="text-xs" style={{ color: TEXT }}>{sel.services}</div>
            </div>
            {JOB_HISTORY[sel.id] && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2" style={{ color: MUTED }}>Recent jobs</div>
                <div className="space-y-2">
                  {JOB_HISTORY[sel.id].map((j,i) => (
                    <div key={i} className="rounded-lg p-2.5 border" style={{ borderColor: BORDER }}>
                      <div className="flex items-start justify-between"><span className="text-xs font-medium" style={{ color: TEXT }}>{j.desc}</span><span className="text-xs font-bold flex-shrink-0" style={{ color: PRIMARY, fontFamily: mono }}>₦{j.amount.toLocaleString()}</span></div>
                      <div className="flex items-center gap-2 mt-1"><span className="text-xs" style={{ color: MUTED }}>{j.date}</span><span style={{ color: ORANGE_INK }}>{"★".repeat(j.rating)}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <button onClick={() => add({ type: "info", title: `Work order → ${sel.company}` })} className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Create work order</button>
              <button onClick={() => { setShowCall(sel.id); setCallNotes(""); }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Log call</button>
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
                <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Call date</label><DateInput aria-label="Call date" type="date" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Outcome</label><select aria-label="Outcome" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>Resolved</option><option>Follow-up required</option><option>WO scheduled</option><option>Quote requested</option></select></div>
              </div>
              <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Call notes</label><textarea value={callNotes} onChange={e=>setCallNotes(e.target.value)} rows={3} placeholder="Summary of what was discussed…" aria-label="Summary of what was discussed" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowCall(null)} /><button onClick={() => { add({ type: "success", title: `Call logged — ${v.company}` }); setShowCall(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Save log</button></div>
          </div>
        </>
      ); })()}
    </div>
  );
}
