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
// HK-04 Inspection Log
export function InspectionLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const CHECKLIST = ["Bed made correctly", "Linen clean & pressed", "Bathroom scrubbed", "Toilet disinfected", "Minibar restocked", "Amenities replenished", "Floors vacuumed/mopped", "Surfaces dusted", "Mirrors polished", "TV/AC functioning", "Curtains aligned", "No items left behind"];
  const LOGS = [
    { id: "INS-041", room: "104", attendant: "Grace Achebe", inspector: "Grace Mensah", ts: "Today 09:45", score: 18, total: 20, reclean: false, notes: "Minor dust on top shelf. Otherwise excellent.", status: "Passed", checks: CHECKLIST.map((item,i) => ({ item, pass: i !== 7 })) },
    { id: "INS-040", room: "102", attendant: "Grace Achebe", inspector: "Grace Mensah", ts: "Today 09:30", score: 12, total: 20, reclean: true, notes: "Bathroom not cleaned. Bed linen stained. Re-assigned to Amaka.", status: "Re-clean", checks: CHECKLIST.map((item,i) => ({ item, pass: i < 2 || i > 6 })) },
    { id: "INS-039", room: "301", attendant: "Amaka Osei", inspector: "David Okafor", ts: "Yesterday 16:00", score: 20, total: 20, reclean: false, notes: "Spotless. Perfect score.", status: "Passed", checks: CHECKLIST.map(item => ({ item, pass: true })) },
    { id: "INS-038", room: "203", attendant: "Ngozi Ike", inspector: "Grace Mensah", ts: "Yesterday 14:30", score: 17, total: 20, reclean: false, notes: "Minibar not restocked. Items 5 and 11 failed.", status: "Passed", checks: CHECKLIST.map((item,i) => ({ item, pass: i !== 4 && i !== 10 })) },
    { id: "INS-037", room: "501", attendant: "Grace Achebe", inspector: "David Okafor", ts: "Yesterday 11:00", score: 20, total: 20, reclean: false, notes: "Suite inspection passed fully.", status: "Passed", checks: CHECKLIST.map(item => ({ item, pass: true })) },
  ];
  const iC: Record<string, { bg: string; text: string }> = { Passed: { bg: "#DCFCE7", text: "#166534" }, "Re-clean": { bg: "#FEE2E2", text: "#991B1B" } };
  const ATTENDANTS = ["Grace Achebe", "Amaka Osei", "Ngozi Ike"];
  const attScores = ATTENDANTS.map(a => {
    const al = LOGS.filter(l => l.attendant === a);
    const avg = al.length ? Math.round(al.reduce((s,l) => s + (l.score/l.total*100), 0) / al.length) : 0;
    return { name: a, avg, count: al.length, fails: al.filter(l => l.reclean).length };
  });
  return (
    <div>
      <PageHeader title="Inspection Log" sub="Supervisor inspections with per-item checklist results" actions={<BtnP label="New Inspection" icon={Plus} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Inspected Today" value={String(LOGS.filter(l=>l.ts.startsWith("Today")).length)} sub="Rooms checked" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Re-clean Required" value={String(LOGS.filter(l=>l.reclean).length)} sub="Failed inspection" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Pass Rate" value={`${Math.round(LOGS.filter(l=>l.status==="Passed").length/LOGS.length*100)}%`} sub="All inspections" icon={Activity} accent={PRIMARY} />
        <StatCard label="Avg Score" value={`${Math.round(LOGS.reduce((s,l)=>s+(l.score/l.total*100),0)/LOGS.length)}%`} sub="All attendants" icon={Star} accent={TEAL} />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {attScores.map(a => (
          <div key={a.name} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{a.name.split(" ").map(n=>n[0]).join("")}</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate" style={{ color: TEXT }}>{a.name}</div><div className="text-xs" style={{ color: MUTED }}>{a.count} inspections</div></div>
              <div className="text-xl font-black" style={{ color: a.avg >= 85 ? SUCCESS : a.avg >= 70 ? ORANGE : ERROR, fontFamily: mono }}>{a.avg}%</div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
              <div className="h-2 rounded-full" style={{ width: `${a.avg}%`, backgroundColor: a.avg >= 85 ? SUCCESS : a.avg >= 70 ? ORANGE : ERROR }} />
            </div>
            {a.fails > 0 && <div className="text-xs mt-1.5 font-semibold" style={{ color: ERROR }}>{a.fails} re-clean this week</div>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["", "ID", "Room", "Attendant", "Inspector", "Time", "Score", "Re-clean", "Result", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {LOGS.map(l => (
              <React.Fragment key={l.id}>
                <tr className="border-t hover:bg-[#F8FAFC] transition-colors cursor-pointer" style={{ borderColor: BORDER, backgroundColor: l.reclean ? "#FFF5F5" : "transparent" }} onClick={() => setExpanded(expanded === l.id ? null : l.id)}>
                  <td className="px-4 py-3 text-xs" style={{ color: SUBTLE }}>{expanded === l.id ? "▾" : "▸"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.id}</td>
                  <td className="px-4 py-3 text-base font-bold" style={{ color: PRIMARY }}>{l.room}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.attendant}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{l.inspector}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{l.ts}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: l.score/l.total >= 0.85 ? SUCCESS : l.score/l.total >= 0.7 ? ORANGE : ERROR }}>{l.score}/{l.total}</td>
                  <td className="px-4 py-3">{l.reclean && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Required</span>}</td>
                  <td className="px-4 py-3"><Badge label={l.status} colors={iC[l.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                  <td className="px-4 py-3"><button onClick={e => { e.stopPropagation(); add({ type: "info", title: `Re-inspect Room ${l.room}` }); }} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Re-inspect</button></td>
                </tr>
                {expanded === l.id && (
                  <tr key={l.id + "-d"} style={{ backgroundColor: "#F8FAFC" }}>
                    <td colSpan={10} className="px-6 py-4 border-t" style={{ borderColor: BORDER }}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                        {l.checks.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.pass ? "#DCFCE7" : "#FEE2E2" }}><span style={{ color: c.pass ? SUCCESS : ERROR, fontSize: 10 }}>{c.pass ? "✓" : "✕"}</span></div>
                            <span style={{ color: c.pass ? MUTED : ERROR, fontWeight: c.pass ? 400 : 600 }}>{c.item}</span>
                          </div>
                        ))}
                      </div>
                      {l.notes && <div className="text-xs p-2.5 rounded-lg" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>Notes: {l.notes}</div>}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// HK-06 Linen & Supplies
export function LinenSupplies({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [floorFilter, setFloorFilter] = useState("All");
  const [showIssue, setShowIssue] = useState(false);
  const [issueItem, setIssueItem] = useState("");
  const [issueQty, setIssueQty] = useState("1");
  const [issueAtt, setIssueAtt] = useState("Grace Achebe");
  const ITEMS = [
    { name: "Bath Towels", cat: "Linen", floor: "All", current: 45, par: 80, reorder: 30, unit: "pcs", soiled: 8, lost: 1 },
    { name: "Hand Towels", cat: "Linen", floor: "All", current: 60, par: 80, reorder: 30, unit: "pcs", soiled: 5, lost: 0 },
    { name: "Bed Sheets (Queen)", cat: "Linen", floor: "All", current: 62, par: 100, reorder: 40, unit: "sets", soiled: 12, lost: 0 },
    { name: "Pillowcases", cat: "Linen", floor: "All", current: 95, par: 200, reorder: 80, unit: "pcs", soiled: 20, lost: 3 },
    { name: "Duvet Covers", cat: "Linen", floor: "All", current: 48, par: 80, reorder: 30, unit: "pcs", soiled: 7, lost: 0 },
    { name: "Cleaning Cloths", cat: "Supplies", floor: "1", current: 12, par: 50, reorder: 20, unit: "pcs", soiled: 0, lost: 0 },
    { name: "Mop Heads", cat: "Supplies", floor: "2", current: 8, par: 20, reorder: 8, unit: "pcs", soiled: 0, lost: 0 },
    { name: "Toiletry Sets", cat: "Amenities", floor: "All", current: 140, par: 200, reorder: 60, unit: "sets", soiled: 0, lost: 0 },
    { name: "Toilet Rolls (pack)", cat: "Amenities", floor: "All", current: 88, par: 120, reorder: 40, unit: "packs", soiled: 0, lost: 0 },
  ];
  const statusOf = (item: typeof ITEMS[0]) => item.current < item.reorder ? "Critical" : item.current < item.par * 0.6 ? "Low" : "Ok";
  const sc = (s: string) => s === "Critical" ? { bg: "#FEE2E2", text: "#991B1B", bar: ERROR } : s === "Low" ? { bg: "#FEF3C7", text: "#92400E", bar: WARNING } : { bg: "#DCFCE7", text: "#166534", bar: SUCCESS };
  const filtered = floorFilter === "All" ? ITEMS : ITEMS.filter(i => i.floor === floorFilter || i.floor === "All");
  return (
    <div>
      <PageHeader title="Linen & Supplies" sub="Par levels, soiled counts, and issue tracking by floor" actions={<><BtnO label="Export" icon={Download} /><BtnP label="Issue to Attendant" icon={Plus} onClick={() => setShowIssue(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Critical Items" value={String(ITEMS.filter(i=>statusOf(i)==="Critical").length)} sub="Below reorder point" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Low Stock" value={String(ITEMS.filter(i=>statusOf(i)==="Low").length)} sub="Below 60% of par" icon={TrendingDown} accent={WARNING} />
        <StatCard label="Soiled Today" value={String(ITEMS.reduce((s,i)=>s+i.soiled,0))} sub="Awaiting laundry" icon={Package} accent={MUTED} />
        <StatCard label="Ok Items" value={String(ITEMS.filter(i=>statusOf(i)==="Ok").length)} sub="Adequately stocked" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Stock by Item</span>
          <div className="flex gap-1.5 ml-2">{["All","1","2","3"].map(f => <button key={f} onClick={() => setFloorFilter(f)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ backgroundColor: floorFilter===f ? PRIMARY : "white", color: floorFilter===f ? "white" : MUTED, borderColor: floorFilter===f ? PRIMARY : BORDER }}>Floor {f}</button>)}</div>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item", "Category", "Current / Par", "Soiled", "Lost", "Reorder Point", "Status", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(item => {
              const st = statusOf(item);
              const c = sc(st);
              const pct = Math.min((item.current / item.par) * 100, 100);
              return (
                <tr key={item.name} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: TEXT }}>{item.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.cat}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-10" style={{ color: c.text, fontFamily: mono }}>{item.current}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0", minWidth: 80 }}>
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: c.bar }} />
                      </div>
                      <span className="text-xs" style={{ color: SUBTLE }}>/{item.par} {item.unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: item.soiled > 0 ? ORANGE : MUTED, fontFamily: mono }}>{item.soiled}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: item.lost > 0 ? ERROR : MUTED, fontFamily: mono }}>{item.lost}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{item.reorder} {item.unit}</td>
                  <td className="px-4 py-3"><Badge label={st} colors={{ bg: c.bg, text: c.text }} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setIssueItem(item.name); setShowIssue(true); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Issue</button>
                      <button onClick={() => add({ type: "info", title: `Restock requested: ${item.name}` })} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Restock</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showIssue && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowIssue(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Issue to Attendant</h3><button onClick={() => setShowIssue(false)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Item</label><select value={issueItem} onChange={e => setIssueItem(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option value="">Select item…</option>{ITEMS.map(i => <option key={i.name}>{i.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Quantity</label><input type="number" min="1" value={issueQty} onChange={e => setIssueQty(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Attendant</label><select value={issueAtt} onChange={e => setIssueAtt(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{"Grace Achebe,Amaka Osei,Ngozi Ike".split(",").map(a=><option key={a}>{a}</option>)}</select></div>
              </div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowIssue(false)} /><button disabled={!issueItem} onClick={() => { add({ type: "success", title: `${issueQty}× ${issueItem} issued to ${issueAtt}` }); setShowIssue(false); setIssueItem(""); setIssueQty("1"); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Issue</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// HK-08 Housekeeping Schedule
export function HousekeepingSchedule({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ATTENDANTS = ["Grace Achebe", "Amaka Osei", "Ngozi Ike"];
  const ROOMS = ["101","102","103","104","201","202","203","204","301","302","303","304"];
  const SHIFTS = ["Morning (07:00–15:00)", "Evening (15:00–23:00)", "Night (23:00–07:00)"];
  const [shift, setShift] = useState(SHIFTS[0]);
  const [assignments, setAssignments] = useState<Record<string, string>>({
    "101": "Grace Achebe", "102": "Grace Achebe", "103": "Amaka Osei", "104": "Grace Achebe",
    "201": "Ngozi Ike", "202": "Ngozi Ike", "203": "", "204": "",
    "301": "Amaka Osei", "302": "Ngozi Ike", "303": "", "304": "",
  });
  const [published, setPublished] = useState(false);
  const toggleAssign = (room: string, att: string) => {
    setAssignments(p => ({ ...p, [room]: p[room] === att ? "" : att }));
    setPublished(false);
  };
  const autoBalance = () => {
    const newAss: Record<string, string> = {};
    ROOMS.forEach((r, i) => { newAss[r] = ATTENDANTS[i % ATTENDANTS.length]; });
    setAssignments(newAss);
    setPublished(false);
    add({ type: "info", title: "Workload balanced", body: `${ROOMS.length} rooms distributed across ${ATTENDANTS.length} attendants` });
  };
  const workload = (att: string) => ROOMS.filter(r => assignments[r] === att).length;
  const MAX_LOAD = 6;
  return (
    <div>
      <PageHeader title="Housekeeping Schedule" sub="Room assignments per attendant · Click cell to assign" actions={<><BtnO label="Balance Workload" icon={RefreshCw} onClick={autoBalance} /><BtnP label={published ? "Published ✓" : "Publish Schedule"} icon={published ? CheckCircle2 : Send} onClick={() => { setPublished(true); add({ type: "success", title: "Schedule published", body: "Field devices notified" }); }} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Rooms Scheduled" value={String(ROOMS.filter(r=>assignments[r]).length)} sub={`of ${ROOMS.length} total`} icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Unassigned" value={String(ROOMS.filter(r=>!assignments[r]).length)} sub="Need assignment" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Staff on Duty" value={String(ATTENDANTS.length)} sub="This shift" icon={Users} accent={TEAL} />
        <StatCard label="Shift" value={shift.split(" ")[0]} sub={shift.split(" ")[1] ?? ""} icon={Clock} accent={ORANGE} />
      </div>
      {/* Shift selector */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Shift:</span>
        {SHIFTS.map(s => <button key={s} onClick={() => setShift(s)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ backgroundColor: shift===s ? PRIMARY : "white", color: shift===s ? "white" : MUTED, borderColor: shift===s ? PRIMARY : BORDER }}>{s}</button>)}
      </div>
      {/* Attendant workload summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {ATTENDANTS.map(a => {
          const n = workload(a);
          const pct = (n / MAX_LOAD) * 100;
          return (
            <div key={a} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{a.split(" ").map(x=>x[0]).join("")}</div>
                <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate" style={{ color: TEXT }}>{a}</div><div className="text-xs" style={{ color: MUTED }}>{n} rooms</div></div>
                <div className="text-xl font-black" style={{ color: n > MAX_LOAD ? ERROR : n >= MAX_LOAD * 0.8 ? ORANGE : SUCCESS, fontFamily: mono }}>{n}</div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(pct,100)}%`, backgroundColor: n > MAX_LOAD ? ERROR : n >= MAX_LOAD * 0.8 ? ORANGE : SUCCESS }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Assignment grid */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
          <div className="w-20 flex-shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Room</div>
          {ATTENDANTS.map(a => <div key={a} className="flex-1 text-center py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{a.split(" ")[0]}</div>)}
          <div className="w-24 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Status</div>
        </div>
        {ROOMS.map(room => (
          <div key={room} className="flex items-center border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, minHeight: 48 }}>
            <div className="w-20 flex-shrink-0 px-4 py-2 font-bold" style={{ color: PRIMARY }}>{room}</div>
            {ATTENDANTS.map(a => (
              <div key={a} className="flex-1 flex justify-center py-2">
                <div onClick={() => toggleAssign(room, a)} className="w-7 h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" style={{ borderColor: assignments[room] === a ? PRIMARY : "#CBD5E1", backgroundColor: assignments[room] === a ? PRIMARY : "transparent" }}>
                  {assignments[room] === a && <CheckCircle2 size={13} color="white" />}
                </div>
              </div>
            ))}
            <div className="w-24 px-4 py-2">
              {assignments[room] ? <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>Assigned</span> : <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Unassigned</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FD-09 Key Card Management
export function KeyCardMgmt({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type EncoderState = "connected" | "encoding" | "disconnected" | "error";
  type IssueStep = "lookup" | "config" | "read" | "register" | "done";
  const [encoderSt, setEncoderSt] = useState<EncoderState>("connected");
  const [showIssue, setShowIssue] = useState(false);
  const [issueStep, setIssueStep] = useState<IssueStep>("lookup");
  const [issueRes, setIssueRes] = useState("BK-2848");
  const [issueRoom, setIssueRoom] = useState("202");
  const [cardCount, setCardCount] = useState(1);
  const [validHrs, setValidHrs] = useState("48");
  const [serialRead, setSerialRead] = useState("");
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const MAX_CARDS = 3;
  const ACTIVE_CARDS = [
    { id: "KC-001", room: "101", guest: "Adaeze Okonkwo", res: "BK-2845", serial: "A3F9-21CC", issued: "22 Jun 14:03", validTo: "25 Jun 12:00", status: "Active", duplicate: false, by: "John A." },
    { id: "KC-002", room: "202", guest: "Emmanuel Adeyemi", res: "BK-2848", serial: "B7D4-55EE", issued: "23 Jun 14:12", validTo: "25 Jun 12:00", status: "Active", duplicate: false, by: "John A." },
    { id: "KC-003", room: "202", guest: "Emmanuel Adeyemi", res: "BK-2848", serial: "B7D4-55EF", issued: "23 Jun 14:35", validTo: "25 Jun 12:00", status: "Active", duplicate: true, by: "Grace M." },
    { id: "KC-004", room: "304", guest: "Chukwuemeka Obi", res: "BK-2852", serial: "C2A1-9900", issued: "24 Jun 10:00", validTo: "28 Jun 12:00", status: "Active", duplicate: false, by: "John A." },
    { id: "KC-005", room: "501", guest: "Dr. Chukwuemeka Bello", res: "BK-2854", serial: "D5F2-4412", issued: "24 Jun 14:10", validTo: "27 Jun 12:00", status: "Active", duplicate: false, by: "Grace M." },
    { id: "KC-006", room: "101", guest: "Adaeze Okonkwo", res: "BK-2845", serial: "A3F9-21CD", issued: "22 Jun 16:00", validTo: "25 Jun 12:00", status: "Revoked", duplicate: false, by: "John A." },
  ];
  const [cards, setCards] = useState(ACTIVE_CARDS);
  const encInfo: Record<EncoderState, { dot: string; label: string }> = {
    connected: { dot: SUCCESS, label: "Encoder ready (USB — SALTO KS)" },
    encoding: { dot: WARNING, label: "Encoding in progress…" },
    disconnected: { dot: ERROR, label: "Encoder not detected" },
    error: { dot: ERROR, label: "Encoder error — check USB connection" },
  };
  const enc = encInfo[encoderSt];
  const stC = (s: string) => s === "Active" ? { bg: "#DCFCE7", text: "#166534" } : s === "Revoked" ? { bg: "#FEE2E2", text: "#991B1B" } : { bg: "#F3F4F6", text: "#374151" };
  const stepLabels: IssueStep[] = ["lookup", "config", "read", "register", "done"];
  const stepNames = ["Reservation", "Configuration", "Read Card", "Register", "Complete"];
  const simulateRead = () => { setIssueStep("read"); setTimeout(() => { setSerialRead(`E9B3-${Math.floor(Math.random() * 9999).toString().padStart(4,"0")}`); setIssueStep("register"); }, 1400); };
  const finishIssue = () => {
    const newCard = { id: `KC-00${cards.length + 1}`, room: issueRoom, guest: "Emmanuel Adeyemi", res: issueRes, serial: serialRead, issued: "24 Jun " + new Date().getHours() + ":" + String(new Date().getMinutes()).padStart(2,"0"), validTo: "25 Jun 12:00", status: "Active" as const, duplicate: cardCount > 1, by: "Grace M." };
    setCards(p => [...p, newCard]);
    setIssueStep("done");
    add({ type: "success", title: `Card encoded — Room ${issueRoom}`, body: `Serial ${serialRead} · Valid ${validHrs}h` });
  };
  const revokeCard = () => {
    if (!revokeId || !revokeReason) return;
    setCards(p => p.map(c => c.id === revokeId ? { ...c, status: "Revoked" } : c));
    const isOffline = encoderSt === "disconnected";
    add({ type: isOffline ? "warning" : "error", title: `Card revoked${isOffline ? " (queued)" : ""}`, body: `${revokeId} · ${revokeReason}${isOffline ? " · Will sync on reconnect" : ""}` });
    setRevokeId(null); setRevokeReason("");
  };
  return (
    <div>
      <PageHeader title="Key Card Management" sub="Issue, duplicate, replace and revoke physical room key cards"
        actions={<><BtnO label="Key Card Log" icon={ClipboardList} /><BtnP label="Issue Card" icon={Plus} onClick={() => { setShowIssue(true); setIssueStep("lookup"); setSerialRead(""); }} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Cards" value={String(cards.filter(c=>c.status==="Active").length)} sub="Currently issued" icon={CreditCard} accent={SUCCESS} />
        <StatCard label="Issued Today" value="4" sub="New issuances" icon={Activity} accent={PRIMARY} />
        <StatCard label="Revoked Today" value={String(cards.filter(c=>c.status==="Revoked").length)} sub="Deactivated" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Duplicates" value={String(cards.filter(c=>c.duplicate&&c.status==="Active").length)} sub="Spare cards active" icon={Layers} accent={TEAL} />
      </div>
      {/* Encoder status bar */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: enc.dot }} />
          <span className="text-sm font-medium" style={{ color: TEXT }}>{enc.label}</span>
        </div>
        {encoderSt === "disconnected" && <span className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>⚠ Cards will queue offline</span>}
        <div className="ml-auto flex gap-2">
          <button onClick={() => { setEncoderSt("encoding"); setTimeout(() => setEncoderSt("connected"), 1200); add({ type: "info", title: "Encoder test complete — 1 device found" }); }} className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Test Encoder</button>
          <button onClick={() => setEncoderSt(p => p === "connected" ? "disconnected" : "connected")} className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>{encoderSt === "connected" ? "Simulate Offline" : "Go Online"}</button>
        </div>
      </div>
      {/* Active cards table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search room, guest, serial…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{cards.length} credentials</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest / Reservation", "Serial", "Issued", "Valid To", "Status", "Flags", "By", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {cards.map(c => (
              <tr key={c.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: c.status === "Revoked" ? 0.55 : 1 }}>
                <td className="px-4 py-3 text-base font-bold" style={{ color: PRIMARY }}>{c.room}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>{c.guest}</div>
                  <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{c.res}</div>
                </td>
                <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: TEXT, fontFamily: mono }}>{c.serial}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{c.issued}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{c.validTo}</td>
                <td className="px-4 py-3"><Badge label={c.status} colors={stC(c.status)} /></td>
                <td className="px-4 py-3">{c.duplicate && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}>Dupe</span>}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{c.by}</td>
                <td className="px-4 py-3">
                  {c.status === "Active" ? (
                    <div className="flex gap-1">
                      <button onClick={() => add({ type: "success", title: `Duplicate issued — Room ${c.room}`, body: `Insert blank card into encoder` })} disabled={encoderSt !== "connected"} className="text-xs px-2 py-1.5 rounded border disabled:opacity-40" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Duplicate</button>
                      <button onClick={() => { setRevokeId(c.id); setRevokeReason(""); }} className="text-xs px-2 py-1.5 rounded border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Revoke</button>
                    </div>
                  ) : <span className="text-xs" style={{ color: SUBTLE }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Card wizard */}
      {showIssue && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onClick={() => { if (issueStep !== "read") setShowIssue(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-lg" style={{ border: `1px solid ${BORDER}` }}>
            {/* Step progress */}
            <div className="flex items-center gap-1 px-6 py-4 border-b" style={{ borderColor: BORDER }}>
              {stepLabels.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${stepLabels.indexOf(issueStep) >= i ? "text-white" : ""}`} style={{ backgroundColor: stepLabels.indexOf(issueStep) >= i ? PRIMARY : "#E2E8F0", color: stepLabels.indexOf(issueStep) >= i ? "white" : MUTED }}>{stepLabels.indexOf(issueStep) > i ? "✓" : i+1}</div>
                  <span className="text-xs hidden sm:block" style={{ color: stepLabels.indexOf(issueStep) >= i ? TEXT : MUTED }}>{stepNames[i]}</span>
                  {i < stepLabels.length - 1 && <div className="flex-1 h-px mx-1" style={{ backgroundColor: stepLabels.indexOf(issueStep) > i ? TEAL : BORDER }} />}
                </div>
              ))}
            </div>
            <div className="p-6">
              {issueStep === "lookup" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Select Reservation</h3>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reservation</label><select value={issueRes} onChange={e => setIssueRes(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>BK-2845 — Adaeze Okonkwo · Room 101</option><option>BK-2848 — Emmanuel Adeyemi · Room 202</option><option>BK-2852 — Chukwuemeka Obi · Room 304</option><option>BK-2854 — Dr. Chukwuemeka Bello · Room 501</option></select></div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Room</label><input value={issueRoom} onChange={e => setIssueRoom(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                  <button onClick={() => setIssueStep("config")} className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Continue</button>
                </div>
              )}
              {issueStep === "config" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Card Configuration</h3>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Number of Cards (max {MAX_CARDS})</label>
                    <div className="flex items-center gap-3"><button onClick={() => setCardCount(p => Math.max(1, p-1))} className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold" style={{ borderColor: BORDER, color: TEXT }}>−</button><span className="text-xl font-bold w-8 text-center" style={{ color: TEXT, fontFamily: mono }}>{cardCount}</span><button onClick={() => setCardCount(p => Math.min(MAX_CARDS, p+1))} className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold" style={{ borderColor: BORDER, color: TEXT }}>+</button></div>
                  </div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Validity (hours from now)</label><select value={validHrs} onChange={e => setValidHrs(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option value="24">24 h — 1 day</option><option value="48">48 h — 2 days</option><option value="72">72 h — 3 days</option><option value="96">96 h — 4 days</option></select></div>
                  {encoderSt !== "connected" && <div className="p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Encoder offline — card will be queued and encoded when encoder reconnects.</div>}
                  <div className="flex gap-3 mt-4"><BtnO label="Back" onClick={() => setIssueStep("lookup")} /><button onClick={simulateRead} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Read Card Serial →</button></div>
                </div>
              )}
              {issueStep === "read" && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${TEAL}18` }}><CreditCard size={28} style={{ color: TEAL }} /></div>
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Insert blank card into encoder</h3>
                  <p className="text-sm" style={{ color: MUTED }}>Waiting for card read… Do not remove card.</p>
                  <div className="flex justify-center gap-1">{[0,1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL, opacity: 0.3 + (i * 0.15), animation: `pulse ${0.8 + i * 0.1}s infinite` }} />)}</div>
                </div>
              )}
              {issueStep === "register" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Register with Lock Provider</h3>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} style={{ color: SUCCESS }} /><span className="text-sm font-semibold" style={{ color: SUCCESS }}>Card serial read</span></div>
                    <div className="text-sm font-mono font-bold" style={{ color: TEXT, fontFamily: mono }}>{serialRead}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[["Room", issueRoom], ["Reservation", issueRes], ["Cards", String(cardCount)], ["Valid for", `${validHrs} hours`], ["Provider", "SALTO KS"]].map(([k,v]) => (
                      <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT, fontFamily: ["Room","Reservation","Cards","Valid for"].includes(k) ? "inherit" : mono }}>{v}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowIssue(false)} /><button onClick={finishIssue} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Register & Encode</button></div>
                </div>
              )}
              {issueStep === "done" && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}><CheckCircle2 size={28} style={{ color: SUCCESS }} /></div>
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Card Issued Successfully</h3>
                  <p className="text-sm" style={{ color: MUTED }}>Room {issueRoom} · Serial <span style={{ fontFamily: mono }}>{serialRead}</span></p>
                  {encoderSt !== "connected" && <p className="text-xs font-semibold" style={{ color: WARNING }}>Card registered offline — will activate on next sync.</p>}
                  <button onClick={() => setShowIssue(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Done</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Revoke modal */}
      {revokeId && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setRevokeId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Revoke Card</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{cards.find(c=>c.id===revokeId)?.serial} · This card will stop working{encoderSt !== "connected" ? " on next lock sync" : " immediately"}.</p>
            <div className="space-y-2 mb-4">{["Lost / reported stolen","Guest requested replacement","Error issued","Security concern"].map(r => <label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: revokeReason===r ? ERROR : BORDER, backgroundColor: revokeReason===r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: revokeReason===r ? ERROR : "#CBD5E1", backgroundColor: revokeReason===r ? ERROR : "transparent" }} /><input type="radio" className="hidden" onChange={() => setRevokeReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}</div>
            {encoderSt !== "connected" && <p className="text-xs mb-3 font-semibold" style={{ color: WARNING }}>Encoder offline — revocation will queue and apply on next lock sync.</p>}
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setRevokeId(null)} /><button disabled={!revokeReason} onClick={revokeCard} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm Revoke</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// HK-02 My Tasks (tablet-optimised)
export function HKMyTasks({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [showInspect, setShowInspect] = useState<string | null>(null);
  const [showIssue, setShowIssue] = useState<string | null>(null);
  const [issueDesc, setIssueDesc] = useState("");
  const [dndRooms, setDndRooms] = useState<Set<string>>(new Set());

  const setStatus = (id: string, s: string) => {
    setStatuses(p => ({ ...p, [id]: s }));
    add({ type: "success", title: `Room ${id} marked ${s}` });
  };

  // Sort: priority first, then by floor
  const sorted = [...HK_TASK_ROOMS].sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return Number(a.id) - Number(b.id);
  });

  const completed = sorted.filter(r => (statuses[r.id] ?? r.hkStatus) === "Clean").length;
  const total = sorted.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div>
      <PageHeader title="My Tasks — Grace Achebe" sub="24 Jun 2025 · Morning Shift" />
      {/* Progress summary bar */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: TEXT }}>{completed} of {total} rooms cleaned</span>
          <span className="text-sm font-bold" style={{ color: pct === 100 ? SUCCESS : PRIMARY, fontFamily: mono }}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? SUCCESS : PRIMARY }} />
        </div>
        <div className="flex gap-4 mt-3">
          <span className="text-xs" style={{ color: MUTED }}><span className="font-bold" style={{ color: TEXT }}>{total - completed}</span> remaining</span>
          <span className="text-xs" style={{ color: MUTED }}><span className="font-bold" style={{ color: ORANGE }}>{sorted.filter(r=>r.priority).length}</span> priority</span>
          <span className="text-xs" style={{ color: MUTED }}><span className="font-bold" style={{ color: TEAL }}>{dndRooms.size}</span> DND active</span>
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map(r => {
          const st = statuses[r.id] ?? r.hkStatus;
          const stC = hkC[st] ?? { bg: "#F4F4F5", text: "#374151" };
          const isDND = dndRooms.has(r.id);
          return (
            <div key={r.id} className="bg-white rounded-xl border p-5" style={{ borderColor: r.priority ? ORANGE : isDND ? `${ERROR}40` : BORDER, borderWidth: r.priority || isDND ? 2 : 1 }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0" style={{ backgroundColor: st === "Clean" ? SUCCESS : PRIMARY }}>{r.id}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold" style={{ color: TEXT }}>Room {r.id}</span>
                      {r.priority && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>PRIORITY</span>}
                      {isDND && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>DND</span>}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: MUTED }}>{r.type} · Floor {r.floor} · {r.guestStatus}</div>
                    {r.notes && <div className="text-sm mt-1 font-medium" style={{ color: ORANGE }}>{r.notes}</div>}
                  </div>
                </div>
                <Badge label={st} colors={stC} />
              </div>
              {/* Primary action */}
              <div className="flex gap-2 flex-wrap mb-2">
                {st === "Dirty" && <button onClick={() => setStatus(r.id, "In Progress")} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY, minHeight: 52 }}>Start Cleaning</button>}
                {st === "In Progress" && <button onClick={() => setStatus(r.id, "Clean")} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: SUCCESS, minHeight: 52 }}>Mark Cleaned</button>}
                {st === "Clean" && <button onClick={() => setShowInspect(r.id)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: "#DCFCE7", color: SUCCESS, minHeight: 52 }}>Request Inspection</button>}
                {st === "Inspected" && <div className="flex-1 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center" style={{ backgroundColor: "#EFF6FF", color: PRIMARY, minHeight: 52 }}>✓ Inspected</div>}
              </div>
              {/* Secondary actions */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setShowIssue(r.id); setIssueDesc(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: ORANGE, borderColor: `${ORANGE}40`, minHeight: 44 }}>Report Issue</button>
                <button onClick={() => { setDndRooms(p => { const n = new Set(p); isDND ? n.delete(r.id) : n.add(r.id); return n; }); add({ type: isDND ? "info" : "warning", title: isDND ? `DND cleared — Room ${r.id}` : `DND set — Room ${r.id}` }); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: isDND ? ERROR : MUTED, borderColor: isDND ? `${ERROR}40` : BORDER, minHeight: 44 }}>{isDND ? "Clear DND" : "Mark DND"}</button>
                <button onClick={() => add({ type: "info", title: `Lost item logged — Room ${r.id}` })} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: MUTED, borderColor: BORDER, minHeight: 44 }}>Log L&F</button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Inspect modal */}
      {showInspect && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowInspect(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-2" style={{ color: TEXT }}>Request Inspection — Room {showInspect}</h3>
            <p className="text-sm mb-4" style={{ color: MUTED }}>An inspector will be notified to verify Room {showInspect} is ready for the next guest.</p>
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowInspect(null)} /><button onClick={() => { add({ type: "success", title: `Inspection requested — Room ${showInspect}` }); setStatus(showInspect, "Inspected"); setShowInspect(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Request</button></div>
          </div>
        </>
      )}
      {/* Issue modal */}
      {showIssue && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowIssue(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-3" style={{ color: TEXT }}>Report Issue — Room {showIssue}</h3>
            <textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)} placeholder="Describe the issue…" rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
            <div className="flex gap-3 mt-3"><BtnO label="Cancel" onClick={() => setShowIssue(null)} /><button disabled={!issueDesc.trim()} onClick={() => { add({ type: "warning", title: `Issue reported — Room ${showIssue}`, body: issueDesc }); setShowIssue(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Report</button></div>
          </div>
        </>
      )}
    </div>
  );
}
