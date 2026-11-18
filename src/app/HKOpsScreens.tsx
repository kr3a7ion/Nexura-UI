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
  occData, revCat, roomSt, deptKPIs, recentAct, ROOMS, WORK_ORDERS,
  STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ALL_RES, ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, ASSETS, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA,
stampNow, ORANGE_INK, TEAL_INK, WARNING_INK, fmtDate, BUSINESS_DATE } from "./constants";
import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp, Sel } from "./UIKit";
import { roomsFor, hkRooms, updateRoom, logFoundItem, INSPECTIONS, CHECKLIST, PASS_MARK, passed, addInspection, ATTENDANTS as HK_ATTENDANTS } from "./mock/housekeeping";
import { STAYS } from "./mock/frontOffice";
// HK-04 Inspection Log
export function InspectionLog({ add, staffName, navParam }: { add: (t: Omit<Toast, "id">) => void; staffName: string; navParam?: string }) {
  const [logs, setLogs] = useState(() => [...INSPECTIONS]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const waiting = hkRooms().filter(r => r.hkSt === "Clean");
  // Opened from the board's Inspect button with a room number.
  const [room, setRoom] = useState<string | null>(navParam && /^\d+$/.test(navParam) ? navParam : null);
  const [failed, setFailed] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const open = (r: string) => { setRoom(r); setFailed([]); setNotes(""); };
  const score = CHECKLIST.length - failed.length;
  const submit = () => {
    if (!room) return;
    const attendant = hkRooms().find(r => r.id === room)?.attendant ?? "Unassigned";
    const rec = addInspection({ room, attendant, inspector: staffName, ts: `Today ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, failed, notes: notes.trim() });
    setLogs([...INSPECTIONS]);
    add(passed(rec) ? { type: "success", title: `Room ${room} passed and is ready for the next guest` } : { type: "warning", title: `Room ${room} failed: sent back to ${attendant} to clean again` });
    setRoom(null);
  };
  const resultColors = (ok: boolean) => ok ? { bg: "#DCFCE7", text: "#166534" } : { bg: "#FEE2E2", text: "#991B1B" };
  const attScores = HK_ATTENDANTS.map(name => {
    const mine = logs.filter(l => l.attendant === name);
    const avg = mine.length ? Math.round(mine.reduce((s, l) => s + (CHECKLIST.length - l.failed.length) / CHECKLIST.length * 100, 0) / mine.length) : 0;
    return { name, avg, count: mine.length, fails: mine.filter(l => !passed(l)).length };
  });
  const today = logs.filter(l => l.ts.startsWith("Today"));
  return (
    <div>
      <PageHeader title="Inspection Log" sub={`A room passes with ${PASS_MARK} of ${CHECKLIST.length} checks; anything less goes back to the attendant.`}
        actions={<BtnP label="Inspect a room" icon={Plus} onClick={() => open(waiting[0]?.id ?? hkRooms()[0].id)} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Waiting for inspection" value={String(waiting.length)} sub="Clean, not yet checked" icon={ClipboardList} accent={PRIMARY} />
        <StatCard label="Inspected today" value={String(today.length)} sub={`${today.filter(passed).length} passed`} icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Sent back today" value={String(today.filter(l => !passed(l)).length)} sub="To be cleaned again" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Pass rate" value={`${logs.length ? Math.round(logs.filter(passed).length / logs.length * 100) : 0}%`} sub="All inspections" icon={Activity} accent={PRIMARY} />
      </div>

      <section className="bg-white rounded-xl border mb-5" style={{ borderColor: BORDER }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}><h2 className="text-base font-semibold" style={{ color: TEXT }}>Waiting for inspection</h2></div>
        {waiting.length === 0 ? <p className="px-5 py-4 text-sm" style={{ color: MUTED }}>No clean rooms are waiting. Rooms appear here when an attendant marks them clean.</p> : (
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {waiting.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-4">
                <span className="text-base font-semibold w-12" style={{ color: TEXT }}>{r.id}</span>
                <div className="flex-1 min-w-0"><div className="text-sm" style={{ color: TEXT }}>{r.type} · cleaned by {r.attendant ?? "unassigned"} at {r.since}</div>{r.note && <div className="text-sm" style={{ color: MUTED }}>{r.note}</div>}</div>
                {r.guestState === "Arrival" && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "#F0FDFA", color: TEAL_INK }}>Guest arriving</span>}
                <button onClick={() => open(r.id)} className="text-sm h-9 px-4 rounded-lg font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Inspect</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {attScores.map(a => (
          <div key={a.name} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{a.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate" style={{ color: TEXT }}>{a.name}</div><div className="text-xs" style={{ color: MUTED }}>{a.count} inspection{a.count === 1 ? "" : "s"}</div></div>
              <div className="text-xl font-semibold" style={{ color: TEXT }}>{a.avg}%</div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}><div className="h-2 rounded-full" style={{ width: `${a.avg}%`, backgroundColor: a.avg >= 85 ? SUCCESS : a.avg >= 70 ? WARNING : ERROR }} /></div>
            {a.fails > 0 && <div className="text-sm mt-1.5" style={{ color: ERROR }}>{a.fails} sent back</div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["", "Room", "Attendant", "Inspector", "Time", "Checks passed", "Result", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {logs.map(l => {
              const ok = passed(l);
              return (
                <React.Fragment key={l.id}>
                  <tr className="border-t" style={{ borderColor: BORDER }}>
                    <td className="pl-3"><button onClick={() => setExpanded(expanded === l.id ? null : l.id)} aria-expanded={expanded === l.id} aria-label={`Show checks for ${l.id}`} className="h-9 w-9 flex items-center justify-center rounded-lg" style={{ color: MUTED }}>{expanded === l.id ? "▾" : "▸"}</button></td>
                    <td className="px-4 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{l.room}</div><div className="text-xs" style={{ color: MUTED }}>{l.id}</div></td>
                    <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.attendant}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.inspector}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.ts}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: ok ? TEXT : ERROR }}>{CHECKLIST.length - l.failed.length} of {CHECKLIST.length}</td>
                    <td className="px-4 py-3"><Badge label={ok ? "Passed" : "Sent back"} colors={resultColors(ok)} /></td>
                    <td className="px-4 py-3">{!ok && hkRooms().find(r => r.id === l.room)?.hkSt === "Clean" && <button onClick={() => open(l.room)} className="text-sm h-9 px-3 rounded-lg border whitespace-nowrap" style={{ color: TEXT, borderColor: BORDER }}>Inspect again</button>}</td>
                  </tr>
                  {expanded === l.id && (
                    <tr style={{ backgroundColor: "#F8FAFC" }}>
                      <td colSpan={8} className="px-6 py-4 border-t" style={{ borderColor: BORDER }}>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {CHECKLIST.map((item, i) => { const bad = l.failed.includes(i); return (
                            <li key={item} className="flex items-center gap-2 text-sm" style={{ color: bad ? ERROR : TEXT }}><span aria-hidden>{bad ? "✕" : "✓"}</span>{item}{bad && <span className="sr-only"> (failed)</span>}</li>
                          ); })}
                        </ul>
                        {l.notes && <p className="text-sm" style={{ color: TEXT }}>Notes: {l.notes}</p>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {room && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setRoom(null)} />
          <div role="dialog" aria-label={`Inspect room ${room}`} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold" style={{ color: TEXT }}>Inspect room</h3>
              <button aria-label="Close" onClick={() => setRoom(null)} style={{ color: MUTED }}><X size={18} /></button>
            </div>
            <label className="flex items-center gap-2 text-sm mb-4" style={{ color: MUTED }}>Room
              <select value={room} onChange={e => open(e.target.value)} className="h-9 px-2 rounded-lg border bg-white text-sm" style={{ borderColor: BORDER, color: TEXT }}>
                {hkRooms().map(r => <option key={r.id} value={r.id}>{r.id}{r.hkSt === "Clean" ? " (waiting)" : ""}</option>)}
              </select>
            </label>
            <p className="text-sm mb-2" style={{ color: MUTED }}>Untick anything that is not right.</p>
            <ul className="space-y-1">
              {CHECKLIST.map((item, i) => (
                <li key={item}>
                  <label className="flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-slate-50 text-sm" style={{ color: failed.includes(i) ? ERROR : TEXT }}>
                    <input type="checkbox" className="w-4 h-4" checked={!failed.includes(i)} onChange={() => setFailed(f => f.includes(i) ? f.filter(x => x !== i) : [...f, i])} />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
            <label htmlFor="ins-notes" className="text-sm font-medium block mt-4 mb-1.5" style={{ color: TEXT }}>Notes for the attendant</label>
            <textarea id="ins-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm" style={{ color: score >= PASS_MARK ? TEXT : ERROR }}>{score} of {CHECKLIST.length} · {score >= PASS_MARK ? "passes" : "goes back to the attendant"}</span>
              <div className="flex gap-2"><BtnO label="Cancel" onClick={() => setRoom(null)} /><button onClick={submit} className="h-10 px-4 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>{score >= PASS_MARK ? "Pass room" : "Send back"}</button></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// HK-06 Linen & Supplies
export function LinenSupplies({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [floorFilter, setFloorFilter] = useState("All");
  const [showIssue, setShowIssue] = useState(false);
  const [issueItem, setIssueItem] = useState("");
  const [issueQty, setIssueQty] = useState("1");
  const [issueAtt, setIssueAtt] = useState("Fatima Musa");
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
  const exportCsv = () => {
    const rows = [["Item", "Category", "Current", "Par", "Reorder point", "Unit", "Soiled", "Lost", "Status"], ...ITEMS.map(i => [i.name, i.cat, i.current, i.par, i.reorder, i.unit, i.soiled, i.lost, statusOf(i)])];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" }));
    a.download = `linen-and-supplies-${BUSINESS_DATE.toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div>
      <PageHeader title="Linen & Supplies" sub="Stock against par, soiled counts and what has been issued to attendants" actions={<><BtnO label="Export" icon={Download} onClick={exportCsv} /><BtnP label="Issue to attendant" icon={Plus} onClick={() => setShowIssue(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Critical items" value={String(ITEMS.filter(i=>statusOf(i)==="Critical").length)} sub="Below reorder point" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Low stock" value={String(ITEMS.filter(i=>statusOf(i)==="Low").length)} sub="Below 60% of par" icon={TrendingDown} accent={WARNING} />
        <StatCard label="Soiled today" value={String(ITEMS.reduce((s,i)=>s+i.soiled,0))} sub="Awaiting laundry" icon={Package} accent={MUTED} />
        <StatCard label="Ok items" value={String(ITEMS.filter(i=>statusOf(i)==="Ok").length)} sub="Adequately stocked" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Stock by item</span>
          <div className="flex gap-1.5 ml-2">{["All","1","2","3"].map(f => <button key={f} onClick={() => setFloorFilter(f)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ backgroundColor: floorFilter===f ? PRIMARY : "white", color: floorFilter===f ? "white" : MUTED, borderColor: floorFilter===f ? PRIMARY : BORDER }}>Floor {f}</button>)}</div>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item", "Category", "Current / par", "Soiled", "Lost", "Reorder point", "Status", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
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
                      <span className="text-sm font-semibold w-10" style={{ color: TEXT }}>{item.current}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0", minWidth: 80 }}>
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: c.bar }} />
                      </div>
                      <span className="text-sm whitespace-nowrap" style={{ color: MUTED }}>of {item.par} {item.unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: item.soiled > 0 ? ORANGE : MUTED, fontFamily: mono }}>{item.soiled}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: item.lost > 0 ? ERROR : MUTED, fontFamily: mono }}>{item.lost}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{item.reorder} {item.unit}</td>
                  <td className="px-4 py-3"><Badge label={st} colors={{ bg: c.bg, text: c.text }} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setIssueItem(item.name); setShowIssue(true); }} className="text-sm h-9 px-3 rounded-lg border whitespace-nowrap" style={{ color: TEXT, borderColor: BORDER }}>Issue</button>
                      <button onClick={() => add({ type: "success", title: `Restock request for ${item.name.toLowerCase()} sent to Inventory` })} className="text-sm h-9 px-3 rounded-lg border whitespace-nowrap" style={{ color: TEXT, borderColor: BORDER }}>Restock</button>
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
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Issue to attendant</h3><button aria-label="Close" onClick={() => setShowIssue(false)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Item</label><select aria-label="Item" value={issueItem} onChange={e => setIssueItem(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option value="">Select item…</option>{ITEMS.map(i => <option key={i.name}>{i.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Quantity</label><input aria-label="Quantity" type="number" min="1" value={issueQty} onChange={e => setIssueQty(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-sm font-medium block mb-1.5" style={{ color: TEXT }}>Attendant</label><select aria-label="Attendant" value={issueAtt} onChange={e => setIssueAtt(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>{HK_ATTENDANTS.map(a=><option key={a}>{a}</option>)}</select></div>
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
  const ATTENDANTS = HK_ATTENDANTS;
  // Same rooms and attendants as the board.
  const board = hkRooms();
  const ROOMS = board.map(r => r.id);
  const SHIFTS = ["Morning (07:00–15:00)", "Evening (15:00–23:00)", "Night (23:00–07:00)"];
  const [shift, setShift] = useState(SHIFTS[0]);
  const [assignments, setAssignments] = useState<Record<string, string>>(Object.fromEntries(board.map(r => [r.id, r.attendant ?? ""])));

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
      <PageHeader title="Housekeeping Schedule" sub="Who cleans which room this shift. Changes reach the board and My Tasks when you publish." actions={<><BtnO label="Balance workload" icon={RefreshCw} onClick={autoBalance} /><BtnP label={published ? "Published" : "Publish schedule"} icon={published ? CheckCircle2 : Send} onClick={() => { setPublished(true); Object.entries(assignments).forEach(([id, who]) => updateRoom(id, { attendant: who || null })); add({ type: "success", title: "Schedule published", body: "Field devices notified" }); }} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Rooms scheduled" value={String(ROOMS.filter(r=>assignments[r]).length)} sub={`of ${ROOMS.length} total`} icon={CalendarDays} accent={PRIMARY} />
        <StatCard label="Unassigned" value={String(ROOMS.filter(r=>!assignments[r]).length)} sub="Need assignment" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Staff on duty" value={String(ATTENDANTS.length)} sub="This shift" icon={Users} accent={TEAL} />
        <StatCard label="Shift" value={shift.split(" ")[0]} sub={shift.split(" ")[1] ?? ""} icon={Clock} accent={ORANGE} />
      </div>
      {/* Shift selector */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-medium" style={{ color: MUTED }}>Shift</span>
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
          <div className="w-48 flex-shrink-0 px-4 py-3 text-xs font-semibold" style={{ color: MUTED }}>Room</div>
          {ATTENDANTS.map(a => <div key={a} className="flex-1 text-center py-3 text-xs font-semibold" style={{ color: MUTED }}>{a}</div>)}
          <div className="w-32 flex-shrink-0 px-4 py-3 text-xs font-semibold" style={{ color: MUTED }}>Status</div>
        </div>
        {board.map(({ id: room, type, guestState, priority }) => (
          <div key={room} className="flex items-center border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, minHeight: 48 }}>
            <div className="w-48 flex-shrink-0 px-4 py-2"><div className="text-sm font-semibold" style={{ color: TEXT }}>{room}{priority && <span className="ml-2 text-xs font-normal" style={{ color: ERROR }}>Priority</span>}</div><div className="text-xs" style={{ color: MUTED }}>{type} · {guestState}</div></div>
            {ATTENDANTS.map(a => (
              <div key={a} className="flex-1 flex justify-center py-2">
                <button type="button" onClick={() => toggleAssign(room, a)} aria-pressed={assignments[room] === a} aria-label={`Assign room ${room} to ${a}`} className="rounded-lg border-2 flex items-center justify-center" style={{ width: 36, height: 36, borderColor: assignments[room] === a ? PRIMARY : "#CBD5E1", backgroundColor: assignments[room] === a ? PRIMARY : "transparent" }}>
                  {assignments[room] === a && <CheckCircle2 size={14} color="white" />}
                </button>
              </div>
            ))}
            <div className="w-32 flex-shrink-0 px-4 py-2">
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
    const newCard = { id: `KC-00${cards.length + 1}`, room: issueRoom, guest: "Emmanuel Adeyemi", res: issueRes, serial: serialRead, issued: stampNow(), validTo: "25 Jun 12:00", status: "Active" as const, duplicate: cardCount > 1, by: "Grace M." };
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
        actions={<><BtnO label="Key Card Log" icon={ClipboardList} /><BtnP label="Issue card" icon={Plus} onClick={() => { setShowIssue(true); setIssueStep("lookup"); setSerialRead(""); }} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active cards" value={String(cards.filter(c=>c.status==="Active").length)} sub="Currently issued" icon={CreditCard} accent={SUCCESS} />
        <StatCard label="Issued today" value="4" sub="New issuances" icon={Activity} accent={PRIMARY} />
        <StatCard label="Revoked today" value={String(cards.filter(c=>c.status==="Revoked").length)} sub="Deactivated" icon={AlertTriangle} accent={ERROR} />
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
          <button onClick={() => { setEncoderSt("encoding"); setTimeout(() => setEncoderSt("connected"), 1200); add({ type: "info", title: "Encoder test complete — 1 device found" }); }} className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Test encoder</button>
          <button onClick={() => setEncoderSt(p => p === "connected" ? "disconnected" : "connected")} className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>{encoderSt === "connected" ? "Simulate Offline" : "Go Online"}</button>
        </div>
      </div>
      {/* Active cards table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search room, guest, serial…" aria-label="Search room, guest, serial" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{cards.length} credentials</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest / reservation", "Serial", "Issued", "Valid to", "Status", "Flags", "By", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
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
                      <button onClick={() => add({ type: "success", title: `Duplicate issued — Room ${c.room}`, body: `Insert blank card into encoder` })} disabled={encoderSt !== "connected"} className="text-xs px-2 py-1.5 rounded border disabled:opacity-40" style={{ color: TEAL_INK, borderColor: `${TEAL}30` }}>Duplicate</button>
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
                  <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Select reservation</h3>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reservation</label><select aria-label="Reservation" value={issueRes} onChange={e => setIssueRes(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>BK-2845 — Adaeze Okonkwo · Room 101</option><option>BK-2848 — Emmanuel Adeyemi · Room 202</option><option>BK-2852 — Chukwuemeka Obi · Room 304</option><option>BK-2854 — Dr. Chukwuemeka Bello · Room 501</option></select></div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Room</label><input aria-label="Room" value={issueRoom} onChange={e => setIssueRoom(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                  <button onClick={() => setIssueStep("config")} className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Continue</button>
                </div>
              )}
              {issueStep === "config" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Card configuration</h3>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Number of Cards (max {MAX_CARDS})</label>
                    <div className="flex items-center gap-3"><button onClick={() => setCardCount(p => Math.max(1, p-1))} className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold" style={{ borderColor: BORDER, color: TEXT }}>−</button><span className="text-xl font-bold w-8 text-center" style={{ color: TEXT, fontFamily: mono }}>{cardCount}</span><button onClick={() => setCardCount(p => Math.min(MAX_CARDS, p+1))} className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold" style={{ borderColor: BORDER, color: TEXT }}>+</button></div>
                  </div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Validity (hours from now)</label><select aria-label="Validity (hours from now)" value={validHrs} onChange={e => setValidHrs(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option value="24">24 h — 1 day</option><option value="48">48 h — 2 days</option><option value="72">72 h — 3 days</option><option value="96">96 h — 4 days</option></select></div>
                  {encoderSt !== "connected" && <div className="p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Encoder offline — card will be queued and encoded when encoder reconnects.</div>}
                  <div className="flex gap-3 mt-4"><BtnO label="Back" onClick={() => setIssueStep("lookup")} /><button onClick={simulateRead} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Read Card Serial →</button></div>
                </div>
              )}
              {issueStep === "read" && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${TEAL}18` }}><CreditCard size={28} style={{ color: TEAL_INK }} /></div>
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Insert blank card into encoder</h3>
                  <p className="text-sm" style={{ color: MUTED }}>Waiting for card read… Do not remove card.</p>
                  <div className="flex justify-center gap-1">{[0,1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL, opacity: 0.3 + (i * 0.15), animation: `pulse ${0.8 + i * 0.1}s infinite` }} />)}</div>
                </div>
              )}
              {issueStep === "register" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Register with lock provider</h3>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} style={{ color: SUCCESS }} /><span className="text-sm font-semibold" style={{ color: SUCCESS }}>Card serial read</span></div>
                    <div className="text-sm font-mono font-bold" style={{ color: TEXT, fontFamily: mono }}>{serialRead}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[["Room", issueRoom], ["Reservation", issueRes], ["Cards", String(cardCount)], ["Valid for", `${validHrs} hours`], ["Provider", "SALTO KS"]].map(([k,v]) => (
                      <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT, fontFamily: ["Room","Reservation","Cards","Valid for"].includes(k) ? "inherit" : mono }}>{v}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowIssue(false)} /><button onClick={finishIssue} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Register & encode</button></div>
                </div>
              )}
              {issueStep === "done" && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}><CheckCircle2 size={28} style={{ color: SUCCESS }} /></div>
                  <h3 className="text-base font-bold" style={{ color: TEXT }}>Card issued successfully</h3>
                  <p className="text-sm" style={{ color: MUTED }}>Room {issueRoom} · Serial <span style={{ fontFamily: mono }}>{serialRead}</span></p>
                  {encoderSt !== "connected" && <p className="text-xs font-semibold" style={{ color: WARNING_INK }}>Card registered offline — will activate on next sync.</p>}
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
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Revoke card</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{cards.find(c=>c.id===revokeId)?.serial} · This card will stop working{encoderSt !== "connected" ? " on next lock sync" : " immediately"}.</p>
            <div className="space-y-2 mb-4">{["Lost / reported stolen","Guest requested replacement","Error issued","Security concern"].map(r => <label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: revokeReason===r ? ERROR : BORDER, backgroundColor: revokeReason===r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: revokeReason===r ? ERROR : "#CBD5E1", backgroundColor: revokeReason===r ? ERROR : "transparent" }} /><input type="radio" className="hidden" onChange={() => setRevokeReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}</div>
            {encoderSt !== "connected" && <p className="text-xs mb-3 font-semibold" style={{ color: WARNING_INK }}>Encoder offline — revocation will queue and apply on next lock sync.</p>}
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setRevokeId(null)} /><button disabled={!revokeReason} onClick={revokeCard} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm revoke</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// HK-02 My Tasks (tablet-optimised)
export function HKMyTasks({ add, staffName }: { add: (t: Omit<Toast, "id">) => void; staffName: string }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [showInspect, setShowInspect] = useState<string | null>(null);
  const [showIssue, setShowIssue] = useState<string | null>(null);
  const [issueDesc, setIssueDesc] = useState("");
  const mine = roomsFor(staffName);
  const [showFound, setShowFound] = useState<string | null>(null);
  const [foundDesc, setFoundDesc] = useState("");
  const [dndRooms, setDndRooms] = useState<Set<string>>(new Set(mine.filter(r => r.dnd).map(r => r.id)));

  const setStatus = (id: string, s: string) => {
    setStatuses(p => ({ ...p, [id]: s }));
    updateRoom(id, { hkSt: s as "Dirty" });
    add({ type: "success", title: s === "In Progress" ? `Room ${id}: cleaning started` : `Room ${id} marked ${s.toLowerCase()}` });
  };

  // Sort: priority first, then by floor
  // Work still to do first, then priority, then room number.
  const done = (r: typeof mine[number]) => ["Clean", "Inspected"].includes(statuses[r.id] ?? r.hkSt);
  const sorted = [...mine].sort((a, b) => {
    if (done(a) !== done(b)) return done(a) ? 1 : -1;
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return Number(a.id) - Number(b.id);
  });

  const completed = sorted.filter(r => ["Clean", "Inspected"].includes(statuses[r.id] ?? r.hkSt)).length;
  const total = sorted.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  if (total === 0) return (
    <div>
      <PageHeader title="My Tasks" sub={`${fmtDate(BUSINESS_DATE)} · Morning shift`} />
      <div className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}><EmptyState icon={BedDouble} message="No rooms are assigned to you today. Rooms appear here once a supervisor assigns them on the schedule." /></div>
    </div>
  );

  return (
    <div>
      <PageHeader title="My Tasks" sub={`${staffName} · ${fmtDate(BUSINESS_DATE)} · Morning shift`} />
      {/* Progress summary bar */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: TEXT }}>{completed} of {total} rooms cleaned</span>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? SUCCESS : PRIMARY }} />
        </div>
        <div className="flex gap-4 mt-3">
          <span className="text-xs" style={{ color: MUTED }}><span className="font-semibold" style={{ color: TEXT }}>{total - completed}</span> remaining</span>
          <span className="text-xs" style={{ color: MUTED }}><span className="font-semibold" style={{ color: TEXT }}>{sorted.filter(r=>r.priority).length}</span> priority</span>
          <span className="text-xs" style={{ color: MUTED }}><span className="font-semibold" style={{ color: TEXT }}>{dndRooms.size}</span> do not disturb</span>
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map(r => {
          const st = statuses[r.id] ?? r.hkSt;
          const waiting = requested.has(r.id) || (st === "Clean" && r.awaitingInspection);
          const stC = hkC[st] ?? { bg: "#F4F4F5", text: "#374151" };
          const isDND = dndRooms.has(r.id);
          return (
            <div key={r.id} className="bg-white rounded-xl border p-5" style={{ borderColor: r.priority ? "#FDBA74" : BORDER, borderWidth: r.priority || isDND ? 2 : 1 }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold flex-shrink-0" style={{ backgroundColor: "#F1F5F9", color: TEXT }}>{r.id}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-semibold" style={{ color: TEXT }}>Room {r.id}</span>
                      {r.priority && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "#FFF7ED", color: ORANGE_INK }}>Priority</span>}
                      {isDND && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "#F1F5F9", color: TEXT }}>Do not disturb</span>}
                      {waiting && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}>Awaiting inspection</span>}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: MUTED }}>{r.type} · Floor {r.floor} · {r.guestState}</div>
                    {r.note && <div className="text-sm mt-1" style={{ color: TEXT }}>{r.note}</div>}
                  </div>
                </div>
                <Badge label={st === "In Progress" ? "In progress" : st === "Inspected" ? "Ready" : st} colors={stC} />
              </div>
              {/* Primary action */}
              <div className="flex gap-2 flex-wrap mb-2">
                {st === "Dirty" && <button onClick={() => setStatus(r.id, "In Progress")} disabled={isDND} title={isDND ? "Guest has asked not to be disturbed" : undefined} className="flex-1 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY, minHeight: 48 }}>Start cleaning</button>}
                {st === "In Progress" && <button onClick={() => setStatus(r.id, "Clean")} className="flex-1 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY, minHeight: 48 }}>Mark clean</button>}
                {st === "Clean" && !waiting && <button onClick={() => setShowInspect(r.id)} className="flex-1 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY, minHeight: 48 }}>Request inspection</button>}
                {st === "Clean" && waiting && <div className="flex-1 rounded-xl text-sm text-center flex items-center justify-center" style={{ backgroundColor: "#F8FAFC", color: MUTED, minHeight: 48 }}>Waiting for the supervisor to inspect</div>}
                {st === "Inspected" && <div className="flex-1 rounded-xl text-sm text-center flex items-center justify-center" style={{ backgroundColor: "#F0FDF4", color: "#166534", minHeight: 48 }}>Inspected and ready</div>}
              </div>
              {/* Secondary actions */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setShowIssue(r.id); setIssueDesc(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: TEXT, borderColor: BORDER, minHeight: 44 }}>Report a fault</button>
                <button onClick={() => { setDndRooms(p => { const n = new Set(p); isDND ? n.delete(r.id) : n.add(r.id); return n; }); add({ type: "info", title: isDND ? `Room ${r.id}: do not disturb cleared` : `Room ${r.id}: do not disturb noted` }); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: TEXT, borderColor: BORDER, minHeight: 44 }}>{isDND ? "Clear do not disturb" : "Do not disturb"}</button>
                <button onClick={() => { setShowFound(r.id); setFoundDesc(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ color: TEXT, borderColor: BORDER, minHeight: 44 }}>Log found item</button>
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
            <h3 className="text-base font-semibold mb-2" style={{ color: TEXT }}>Request inspection for room {showInspect}</h3>
            <p className="text-sm mb-4" style={{ color: MUTED }}>The supervisor is told room {showInspect} is clean and ready to check.</p>
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowInspect(null)} /><button onClick={() => { add({ type: "success", title: `Room ${showInspect}: inspection requested` }); updateRoom(showInspect, { awaitingInspection: true }); setRequested(p => new Set(p).add(showInspect)); setShowInspect(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Request</button></div>
          </div>
        </>
      )}
      {showFound && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowFound(null)} />
          <div role="dialog" aria-label="Log found item" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Item found in room {showFound}</h3>
            <p className="text-sm mb-3" style={{ color: MUTED }}>Take it to the housekeeping store; the front desk sees it in Lost & Found.</p>
            <input value={foundDesc} onChange={e => setFoundDesc(e.target.value)} placeholder="For example: black leather wallet" aria-label="What was found" className="w-full h-11 px-3 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} />
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowFound(null)} /><button disabled={!foundDesc.trim()} onClick={() => {
              const stay = STAYS.find(x => x.room === showFound);
              const item = logFoundItem({ desc: foundDesc.trim(), cat: "Personal", storage: "Housekeeping store A", room: showFound, guest: stay?.guest ?? "Unknown", guestRes: stay?.id ?? "", date: fmtDate(BUSINESS_DATE), loggedBy: staffName });
              add({ type: "success", title: `${item.id} logged: ${item.desc}` }); setShowFound(null);
            }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Log item</button></div>
          </div>
        </>
      )}
      {/* Issue modal */}
      {showIssue && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowIssue(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-semibold mb-3" style={{ color: TEXT }}>Report a fault in room {showIssue}</h3>
            <textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)} placeholder="What is wrong, and where in the room?" aria-label="Describe the fault" rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
            <div className="flex gap-3 mt-3"><BtnO label="Cancel" onClick={() => setShowIssue(null)} /><button disabled={!issueDesc.trim()} onClick={() => { add({ type: "success", title: `Room ${showIssue}: fault sent to Maintenance`, body: issueDesc }); setShowIssue(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Send to Maintenance</button></div>
          </div>
        </>
      )}
    </div>
  );
}
