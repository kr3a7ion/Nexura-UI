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
          <tbody>{PAYROLL_DATA.map(p => <tr key={p.name} className="border-t hover:bg-[#F9FAFB]" style={{ borderColor: "#F4F4F5" }}><td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><span className="text-sm font-medium" style={{ color: TEXT }}>{p.name}</span></div></td><td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{p.dept}</td><td className="px-5 py-3 text-sm" style={{ color: TEXT }}>₦{p.baseSalary.toLocaleString()}</td><td className="px-5 py-3 text-sm" style={{ color: p.overtime > 0 ? TEAL : MUTED }}>{p.overtime > 0 ? `+₦${p.overtime.toLocaleString()}` : "—"}</td><td className="px-5 py-3 text-sm" style={{ color: ERROR }}>−₦{p.deductions.toLocaleString()}</td><td className="px-5 py-3 text-sm font-bold" style={{ color: SUCCESS }}>₦{p.net.toLocaleString()}</td><td className="px-5 py-3"><button className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Breakdown</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// MB-02 Branch Comparison
// BranchComparison → MultibranchSettingsScreens.tsx
export { BranchComparison } from "./MultibranchSettingsScreens";

export function GroupBookings({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>("GRP-001");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", type: "Corporate", contact: "", rooms: "5", checkin: "", checkout: "", cutoff: "" });
  const groups = [
    { id:"GRP-001", name:"Dangote Group Executive Retreat", type:"Corporate", contact:"Mrs. Toyin Ahmed", rooms:12, picked:9, checkin:"4 Aug 2026", checkout:"6 Aug 2026", nights:2, cutoffDays:3, status:"Confirmed",
      rooming:[{name:"Alhaji Dangote",room:"Suite 501",status:"Assigned"},{name:"Mrs. Toyin Ahmed",room:"Deluxe 302",status:"Assigned"},{name:"Emeka Obi",room:"Standard 101",status:"Assigned"},{name:"Kemi Afolabi",room:"Standard 102",status:"Assigned"},{name:"Bode Adewale",room:"Standard 201",status:"Pending"}]
    },
    { id:"GRP-002", name:"Adeyemi Wedding Party", type:"Wedding", contact:"Mr. Bolu Adeyemi", rooms:8, picked:3, checkin:"10 Aug 2026", checkout:"12 Aug 2026", nights:2, cutoffDays:9, status:"Confirmed",
      rooming:[{name:"Mr. Bolu Adeyemi",room:"Suite 501",status:"Assigned"},{name:"Mrs. Ngozi Adeyemi",room:"Deluxe 303",status:"Assigned"},{name:"Tunde Bakare",room:"Standard 103",status:"Pending"}]
    },
  ];
  const createGroup = () => {
    if (!newGroup.name || !newGroup.contact) { add({ type:"warning",title:"Fill in group name and contact" }); return; }
    setShowCreate(false);
    add({ type:"success",title:"Group booking created",body:`${newGroup.name} · ${newGroup.rooms} rooms · ${newGroup.type}` });
    setNewGroup({ name:"",type:"Corporate",contact:"",rooms:"5",checkin:"",checkout:"",cutoff:"" });
  };
  return (
    <div>
      <PageHeader title="Group Bookings" sub="Block bookings for groups, conferences, and events"
        actions={<BtnP label="New Group Booking" icon={Plus} onClick={()=>setShowCreate(true)} />} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Groups" value={String(groups.length)} sub="Confirmed blocks" icon={Users} accent={PRIMARY} />
        <StatCard label="Rooms Blocked" value={String(groups.reduce((s,g)=>s+g.rooms,0))} sub="Across all groups" icon={BedDouble} accent={TEAL} />
        <StatCard label="Picked Up" value={String(groups.reduce((s,g)=>s+g.picked,0))} sub="Rooms assigned to guests" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Pending" value={String(groups.reduce((s,g)=>s+(g.rooms-g.picked),0))} sub="Unassigned rooms" icon={AlertCircle} accent={ORANGE} />
      </div>
      <div className="space-y-4">
        {groups.map(g => {
          const pickupPct = Math.round((g.picked/g.rooms)*100);
          const cutoffAlert = g.cutoffDays <= 5;
          return (
            <div key={g.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: cutoffAlert ? `${ORANGE}60` : BORDER, borderWidth: cutoffAlert ? 2 : 1 }}>
              {/* Cut-off warning banner */}
              {cutoffAlert && (
                <div className="flex items-center gap-2 px-5 py-2 text-xs font-semibold" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>
                  <AlertTriangle size={12} />Cut-off in {g.cutoffDays} days — unassigned rooms may be released
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: TEXT }}>{g.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: MUTED }}>
                      <span style={{ fontFamily: mono }}>{g.id}</span>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{g.type}</span>
                      <span>Contact: {g.contact}</span>
                    </div>
                  </div>
                  <Badge label={g.status} colors={{ bg:"#CCFBF1",text:"#0F766E" }} />
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {[{l:"Rooms Blocked",v:String(g.rooms)},{l:"Picked Up",v:String(g.picked)},{l:"Remaining",v:String(g.rooms-g.picked)},{l:"Check-in",v:g.checkin},{l:"Check-out",v:g.checkout}].map(s=>(
                    <div key={s.l} className="rounded-xl p-3 text-center" style={{ backgroundColor:"#F0F4F8" }}>
                      <div className="text-base font-bold" style={{ color: TEXT, fontFamily: s.l.includes("Check") ? "inherit" : mono }}>{s.v}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Pick-up progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold" style={{ color: MUTED }}>Pick-up Progress</span>
                    <span className="font-bold" style={{ color: pickupPct >= 80 ? SUCCESS : pickupPct >= 50 ? ORANGE : ERROR }}>{pickupPct}% · {g.picked}/{g.rooms} rooms assigned</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }}>
                    <div className="h-2 rounded-full transition-all" style={{ width:`${pickupPct}%`, backgroundColor: pickupPct>=80 ? SUCCESS : pickupPct>=50 ? ORANGE : ERROR }} />
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={()=>setExpandedId(expandedId===g.id ? null : g.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: expandedId===g.id ? PRIMARY : BORDER, color: expandedId===g.id ? PRIMARY : MUTED, backgroundColor: expandedId===g.id ? "#EFF6FF" : "white" }}>
                    <Users size={13} />{expandedId===g.id ? "Hide" : "View"} Rooming List
                  </button>
                  <BtnO label="Master Folio" icon={FileText} onClick={()=>add({type:"info",title:`Master folio — ${g.id}`})} />
                  <button onClick={()=>add({type:"info",title:`PDF generated — ${g.id}`})} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border" style={{ color: MUTED, borderColor: BORDER }}><Download size={13}/>Export PDF</button>
                </div>
              </div>
              {/* Rooming list expansion */}
              {expandedId === g.id && (
                <div className="border-t" style={{ borderColor: BORDER }}>
                  <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Rooming List ({g.rooming.length} of {g.rooms})</span>
                    <button onClick={()=>add({type:"info",title:"Add guest to rooming list"})} className="text-xs flex items-center gap-1 font-medium" style={{ color: TEAL }}><Plus size={11}/>Add Guest</button>
                  </div>
                  <table className="w-full">
                    <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Guest Name","Room","Status",""].map(h=><th key={h} className="px-5 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {g.rooming.map((r,i)=>(
                        <tr key={i} className="border-t" style={{ borderColor:"#F1F5F9" }}>
                          <td className="px-5 py-2.5 text-sm font-medium" style={{ color: TEXT }}>{r.name}</td>
                          <td className="px-5 py-2.5 text-xs font-bold" style={{ color: PRIMARY }}>{r.room}</td>
                          <td className="px-5 py-2.5"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: r.status==="Assigned" ? "#CCFBF1" : "#FEF3C7", color: r.status==="Assigned" ? "#0F766E" : "#D97706" }}>{r.status}</span></td>
                          <td className="px-5 py-2.5"><button onClick={()=>add({type:"info",title:`Reassign — ${r.name}`})} className="text-xs px-2 py-1 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Reassign</button></td>
                        </tr>
                      ))}
                      {Array.from({length: g.rooms-g.rooming.length}).map((_,i)=>(
                        <tr key={`empty-${i}`} className="border-t" style={{ borderColor:"#F1F5F9", backgroundColor:"#FAFBFD" }}>
                          <td className="px-5 py-2.5 text-sm italic" style={{ color: SUBTLE }}>Unassigned slot</td>
                          <td className="px-5 py-2.5 text-xs" style={{ color: SUBTLE }}>–</td>
                          <td className="px-5 py-2.5"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#F0F4F8", color: MUTED }}>Empty</span></td>
                          <td className="px-5 py-2.5"><button onClick={()=>add({type:"info",title:"Assign guest to this slot"})} className="text-xs px-2 py-1 rounded-lg border" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Assign</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Create Group Modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowCreate(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>New Group Booking</h3>
            <p className="text-xs mb-5" style={{ color: MUTED }}>Create a block reservation for a group event.</p>
            <div className="space-y-3">
              {[["Group / Event Name","name","e.g. Zenith Bank Annual Conference"],["Lead Contact","contact","Contact person name"],["Rooms Required","rooms","e.g. 10"],["Cut-off Date","cutoff","YYYY-MM-DD"]].map(([label,key,placeholder])=>(
                <div key={key as string}><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{label as string}</label>
                  <input value={(newGroup as Record<string,string>)[key as string]} onChange={e=>setNewGroup(p=>({...p,[key as string]:e.target.value}))} placeholder={placeholder as string} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              ))}
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Group Type</label>
                <select value={newGroup.type} onChange={e=>setNewGroup(p=>({...p,type:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                  {["Corporate","Wedding","Conference","Government","Other"].map(t=><option key={t}>{t}</option>)}
                </select></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button>
              <button onClick={createGroup} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Create Group</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// R-05 Waitlist
export function Waitlist({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const fullList = [
    ...WAITLIST_DATA,
    { id:"WL-015", guest:"Emeka Nwosu", type:"Deluxe", dates:"3–5 Aug", waiting:"5 days", priority: 4, availOpened: true },
    { id:"WL-014", guest:"Funke Abosede", type:"Standard", dates:"2–4 Aug", waiting:"6 days", priority: 5, availOpened: false },
  ];
  const list = fullList.filter(w => !dismissed.includes(w.id));
  return (
    <div>
      <PageHeader title="Waitlist" sub={`${list.length} guests awaiting a room`} actions={<BtnP label="Add to Waitlist" icon={Plus} onClick={()=>add({type:"info",title:"Add guest to waitlist"})} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="On Waitlist" value={String(list.length)} sub="Awaiting room" icon={Users} accent={PRIMARY} />
        <StatCard label="Avg Wait Time" value="2.3 days" sub="Based on occupancy" icon={Clock} accent={WARNING} />
        <StatCard label="Converted This Month" value="12" sub="From waitlist to booking" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      {/* Availability opened banner */}
      {list.some(w => (w as {availOpened?:boolean}).availOpened) && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm font-medium" style={{ backgroundColor:"#CCFBF1", color:"#0F766E", border:"1px solid #5EEAD4" }}>
          <CheckCircle2 size={16} /><span>A room became available — guests below flagged with <strong>Room Available</strong> can be promoted now</span>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor:"#F9FAFB" }}>
            {["Priority","Ref","Guest","Room Type","Requested Dates","Waiting","",""].map((h,i)=>(
              <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{list.map(w=>{
            const availOpened = (w as {availOpened?:boolean}).availOpened;
            return (
              <tr key={w.id} className="border-t" style={{ borderColor:"#F1F5F9", backgroundColor: availOpened ? "rgba(27,163,156,0.04)" : "white" }}>
                <td className="px-5 py-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: w.priority===1 ? ERROR : w.priority===2 ? ORANGE : w.priority===3 ? WARNING : MUTED }}>{w.priority}</div>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.id}</td>
                <td className="px-5 py-3">
                  <div className="text-sm font-medium" style={{ color: TEXT }}>{w.guest}</div>
                  {availOpened && <div className="text-xs font-semibold mt-0.5" style={{ color: TEAL }}>Room Available</div>}
                </td>
                <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#EFF6FF",color:PRIMARY }}>{w.type}</span></td>
                <td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{w.dates}</td>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: ORANGE }}>{w.waiting}</td>
                <td className="px-5 py-3">
                  {availOpened && <span className="text-xs px-2 py-1 rounded-full font-bold animate-pulse" style={{ backgroundColor: TEAL, color: "white" }}>Room Open</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button onClick={()=>{ add({type:"success",title:`${w.guest} promoted to reservation`,body:`${w.type} · ${w.dates}`}); setDismissed(d=>[...d,w.id]); }}
                      className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>Promote</button>
                    <button onClick={()=>add({type:"info",title:`Contacted ${w.guest}`,body:"SMS + email sent"})}
                      className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Contact</button>
                    <button onClick={()=>{ add({type:"warning",title:`${w.guest} removed from waitlist`}); setDismissed(d=>[...d,w.id]); }}
                      className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor:`${ERROR}20` }}>Remove</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {list.length === 0 && <EmptyState icon={Users} message="Waitlist is clear — no guests waiting for a room." />}
        <div className="flex items-center justify-between px-5 py-3 border-t text-xs" style={{ borderColor: BORDER, color: MUTED }}>
          <span>{dismissed.length} guests promoted or removed this session</span>
          <button onClick={()=>add({type:"info",title:"Exported waitlist"})} className="flex items-center gap-1" style={{ color: PRIMARY }}><Download size={12}/>Export CSV</button>
        </div>
      </div>
    </div>
  );
}

// R-06 Rate Management
export function RateManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [plans, setPlans] = useState(RATE_PLANS.map(r => ({ ...r })));
  const [selectedPlan, setSelectedPlan] = useState<(typeof RATE_PLANS)[0] | null>(null);
  const [editPlan, setEditPlan] = useState<(typeof RATE_PLANS)[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", base: "", dates: "" });
  const ROOM_TYPE_MULTIPLIERS = { Standard: 1, Deluxe: 1.57, Suite: 2.71 };
  const openEdit = (r: typeof RATE_PLANS[0]) => { setEditPlan(r); setEditValues({ name: r.name, base: r.base.toString(), dates: r.dates }); };
  const saveEdit = () => {
    if (!editPlan) return;
    setPlans(p => p.map(r => r.id === editPlan.id ? { ...r, name: editValues.name, base: Number(editValues.base) || r.base, dates: editValues.dates } : r));
    if (selectedPlan?.id === editPlan.id) setSelectedPlan(p => p ? { ...p, name: editValues.name, base: Number(editValues.base) || p.base, dates: editValues.dates } : null);
    setEditPlan(null);
    add({ type: "success", title: "Rate plan updated", body: editValues.name });
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
              <tr key={r.id} onClick={()=>setSelectedPlan(r)} className="border-t cursor-pointer transition-colors"
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
              <button onClick={()=>setSelectedPlan(null)} className="text-xs p-1 rounded" style={{ color: MUTED }}><X size={14}/></button>
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
            <div className="flex gap-2">
              <button onClick={()=>openEdit(selectedPlan)} className="flex-1 py-2 rounded-xl text-sm font-semibold border" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Edit Plan</button>
              <button onClick={()=>{ toggleActive(selectedPlan.id); setSelectedPlan(p=>p?{...p,active:!p.active}:null); }} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: selectedPlan.active ? "#FFF1F2" : "#F0FDF4", color: selectedPlan.active ? ERROR : SUCCESS }}>
                {selectedPlan.active ? "Deactivate" : "Activate"}
              </button>
            </div>
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
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowCreate(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-5" style={{ color: TEXT }}>Create Rate Plan</h3>
            <div className="space-y-4">
              {[["Plan Name","e.g. Early Bird Discount"],["Base Rate (₦)","e.g. 42000"],["Applicable Dates","e.g. Aug 1 – Aug 31"]].map(([label,placeholder])=>(
                <div key={label as string}><label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>{label as string}</label>
                  <input placeholder={placeholder as string} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button>
              <button onClick={()=>{ setShowCreate(false); add({type:"success",title:"Rate plan created"}); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Create Plan</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// R-08 Cancellation & Refund
export function CancellationRefund({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [lookupQ, setLookupQ] = useState("BK-2840");
  const [selectedRes, setSelectedRes] = useState(ALL_RES[6]);
  const [waived, setWaived] = useState(false);
  const [waiverReason, setWaiverReason] = useState("");
  const [approver, setApprover] = useState("Grace Mensah");
  const [refundMethod, setRefundMethod] = useState("Original payment method");
  const [cancelled, setCancelled] = useState(false);
  const cancFee = 17500;
  const deposit = 35000;
  const refund = waived ? deposit : deposit - cancFee;
  const lookupResult = ALL_RES.find(r => r.id.toLowerCase().includes(lookupQ.toLowerCase()) || r.guest.toLowerCase().includes(lookupQ.toLowerCase()));
  const AUDIT_HISTORY = [
    { ts:"22 Jul 14:03", action:"Reservation BK-2820 cancelled — fee ₦17,500 retained", by:"Fatima Al-Hassan", type:"cancel" },
    { ts:"18 Jul 09:22", action:"Reservation BK-2801 cancelled — fee waived (medical emergency)", by:"Grace Mensah", type:"waived" },
    { ts:"15 Jul 11:00", action:"Refund ₦42,000 processed — Bank Transfer", by:"Bola Adewale", type:"refund" },
    { ts:"10 Jul 16:45", action:"Reservation BK-2778 cancelled — fee ₦17,500 retained", by:"John Abubakar", type:"cancel" },
  ];
  return (
    <div>
      <PageHeader title="Cancellation & Refund" sub="Process reservation cancellation with policy enforcement" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Cancellations This Month" value={"24"} sub="Total processed" icon={XCircle} accent={ERROR} />
        <StatCard label="Total Refunds" value={"₦384,500"} sub="Returned to guests" icon={DollarSign} accent={WARNING} />
        <StatCard label="Fees Collected" value={"₦98,000"} sub="Cancellation charges" icon={TrendingUp} accent={SUCCESS} />
      </div>
      {/* Reservation lookup */}
      <div className="bg-white rounded-xl border p-4 mb-4" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
            <input value={lookupQ} onChange={e=>setLookupQ(e.target.value)} placeholder="Search by reservation ID, guest name, or phone…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
          <button onClick={()=>{ if (lookupResult) { setSelectedRes(lookupResult); setWaived(false); setCancelled(false); } else add({type:"warning",title:"No reservation found"}); }}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Look Up</button>
        </div>
        {lookupResult && lookupResult.id !== selectedRes.id && (
          <div className="flex items-center gap-3 mt-3 p-3 rounded-xl" style={{ backgroundColor: "#EFF6FF" }}>
            <div><span className="text-sm font-semibold" style={{ color: TEXT }}>{lookupResult.guest}</span>
              <span className="text-xs ml-2" style={{ color: MUTED, fontFamily: mono }}>{lookupResult.id} · {lookupResult.type} · {lookupResult.checkin}–{lookupResult.checkout}</span></div>
            <button onClick={()=>{ setSelectedRes(lookupResult); setWaived(false); setCancelled(false); }} className="ml-auto text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: PRIMARY, color: "white" }}>Select</button>
          </div>
        )}
      </div>
      {cancelled ? (
        <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: BORDER }}>
          <CheckCircle2 size={36} className="mx-auto mb-3" style={{ color: SUCCESS }} />
          <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Cancellation Processed</h3>
          <p className="text-sm mb-4" style={{ color: MUTED }}>Reservation {selectedRes.id} cancelled. Refund ₦{refund.toLocaleString()} queued for processing via {refundMethod}.</p>
          <button onClick={()=>setCancelled(false)} className="text-sm font-medium" style={{ color: PRIMARY }}>Process another cancellation</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Left — Cancellation */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Reservation to Cancel</h3>
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: "#F0F4F8" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>
                  {selectedRes.guest.split(" ").map((n:string)=>n[0]).join("").slice(0,2)}
                </div>
                <div><div className="text-sm font-semibold" style={{ color: TEXT }}>{selectedRes.guest}</div>
                  <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{selectedRes.id} · {selectedRes.type} · {selectedRes.checkin}–{selectedRes.checkout}</div></div>
              </div>
              {[["Rate Plan","Standard Rate"],["Nightly Rate",`₦${selectedRes.rate.toLocaleString()}`],["Nights",String(selectedRes.nights)],["Total Value",`₦${Math.round(selectedRes.rate*selectedRes.nights*1.075).toLocaleString()}`],["Deposit Paid",`₦${deposit.toLocaleString()}`]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v as string}</span></div>
              ))}
            </div>
            <div className="border-l-4 p-4 rounded-r-xl mb-4" style={{ borderColor: WARNING, backgroundColor:"#FFFBEB" }}>
              <div className="text-sm font-semibold mb-1" style={{ color:"#92400E" }}>Cancellation Policy</div>
              <ul className="text-xs space-y-1" style={{ color:"#92400E" }}>
                <li>• Free cancellation up to 48 hours before check-in</li>
                <li>• Within 48 hours: 50% of first night charged (₦{cancFee.toLocaleString()})</li>
                <li>• No-show: 100% of first night charged</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span style={{ color: MUTED }}>Cancellation fee</span><span className="font-bold" style={{ color: ERROR }}>₦{cancFee.toLocaleString()}</span></div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Deposit paid</span><span style={{ color: TEXT }}>₦{deposit.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t pt-2" style={{ borderColor: BORDER }}>
                <span style={{ color: TEXT }}>Refundable amount</span>
                <span style={{ color: refund > 0 ? SUCCESS : ERROR }}>₦{refund.toLocaleString()}</span>
              </div>
            </div>
            {/* Waiver toggle */}
            <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-3" style={{ borderColor: waived ? WARNING : BORDER, backgroundColor: waived ? "#FFFBEB" : "white" }}>
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: waived ? WARNING : "#CBD5E1", backgroundColor: waived ? WARNING : "transparent" }}>{waived && <CheckCircle2 size={10} color="white" />}</div>
              <input type="checkbox" className="hidden" checked={waived} onChange={e=>setWaived(e.target.checked)} />
              <div><div className="text-sm font-medium" style={{ color: TEXT }}>Waive cancellation fee</div>
                <div className="text-xs" style={{ color: MUTED }}>Permission-gated — manager authorisation required</div></div>
            </label>
            {waived && (
              <div className="space-y-2 mb-4">
                <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Waiver Reason</label>
                  <textarea value={waiverReason} onChange={e=>setWaiverReason(e.target.value)} rows={2} placeholder="e.g. Guest experienced medical emergency…" className="w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Approving Manager</label>
                  <select value={approver} onChange={e=>setApprover(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                    {["Grace Mensah","Bola Adewale","John Abubakar"].map(m=><option key={m}>{m}</option>)}
                  </select></div>
              </div>
            )}
            <div className="flex gap-2">
              <BtnO label="Cancel & Keep Fee" onClick={()=>{ add({type:"warning",title:"Reservation cancelled",body:`₦${(deposit-cancFee).toLocaleString()} refund queued`}); setCancelled(true); }} />
              <button onClick={()=>{ add({type:"error",title:"Reservation cancelled",body:`₦${refund.toLocaleString()} refund → ${selectedRes.guest}`}); setCancelled(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: ERROR }}>
                <XCircle size={13} />Confirm Cancel
              </button>
            </div>
          </div>
          {/* Right — Refund + Audit */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Process Refund</h3>
              <div className="mb-3"><label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Refund Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Original payment method","Cash","Bank Transfer"].map(m=>(
                    <button key={m} onClick={()=>setRefundMethod(m)} className="py-2 rounded-xl text-xs font-semibold border-2 transition-all"
                      style={{ borderColor: refundMethod===m ? PRIMARY : BORDER, backgroundColor: refundMethod===m ? "#EFF6FF" : "white", color: refundMethod===m ? PRIMARY : MUTED }}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3"><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Refund Amount (₦)</label>
                <input defaultValue={refund.toLocaleString()} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              <div className="mb-3"><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Approving Manager</label>
                <select value={approver} onChange={e=>setApprover(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                  {["Grace Mensah","Bola Adewale","John Abubakar"].map(m=><option key={m}>{m}</option>)}
                </select></div>
              <div className="mb-4"><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>Notes for Guest</label>
                <textarea rows={2} placeholder="Optional message with refund notification…" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <BtnP label="Process Refund" icon={DollarSign} onClick={()=>add({type:"success",title:"Refund processed",body:`₦${refund.toLocaleString()} → ${selectedRes.guest} via ${refundMethod}`})} />
            </div>
            {/* Audit trail */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Cancellation Audit Trail</h3>
              <div className="space-y-3">
                {AUDIT_HISTORY.map((a,i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.type==="refund" ? "#EFF6FF" : a.type==="waived" ? "#FFFBEB" : "#FFF1F2" }}>
                      {a.type==="refund" ? <DollarSign size={12} style={{ color: PRIMARY }} /> : a.type==="waived" ? <AlertTriangle size={12} style={{ color: ORANGE }} /> : <XCircle size={12} style={{ color: ERROR }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: TEXT }}>{a.action}</div>
                      <div className="text-xs mt-0.5" style={{ color: MUTED }}><span style={{ fontFamily: mono }}>{a.ts}</span> · {a.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
