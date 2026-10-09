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
  occData, occ30Data, revCat, roomSt, deptKPIs, recentAct, ROOMS, RES_GRID, IN_HOUSE, WORK_ORDERS,
  HK_ROOMS, STAFF, BRANCHES, FOLIO_CHARGES, MENU_ITEMS, MENU_CATS, TABLE_LAYOUT, STOCK, CHAT_MSGS,
  ALL_RES, ARRIVALS_DATA, ACCESS_CREDS, KEY_LOG, ACTIVE_PINS, LOST_FOUND, DND_ROOMS,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, SYNC_BRANCHES, KDS_ORDERS, REV_DATA,
  USERS_DATA, ASSETS, SUPPLIERS_DATA, PRODUCTS_DATA, STOCK_TXN, PO_DATA, DEVICES,
  HK_TASK_ROOMS, INV_CONS, STAFF_RPT, RATE_PLANS, WAITLIST_DATA, ROOM_SERVICE_ORDERS,
  DINING_RES, ANNOUNCE_DATA, PAYROLL_DATA, GUEST_ANALYTICS_DATA, NATIONALITY_DATA,
} from "./constants";

import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp, Sel, Av } from "./UIKit";

const HK_STATUS_CYCLE = ["Dirty", "In Progress", "Clean", "Inspected"] as const;

export function HKBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const EXTENDED_ROOMS = [
    { id: "101", type: "Deluxe", floor: 1, hkSt: "Dirty", attendant: "Grace Achebe", priority: "High", since: "08:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "102", type: "Standard", floor: 1, hkSt: "In Progress", attendant: "Grace Achebe", priority: null, since: "09:15", dnd: false, inspectionFlag: false, guestState: "Stayover" },
    { id: "103", type: "Standard", floor: 1, hkSt: "Clean", attendant: "Amaka Osei", priority: null, since: "09:40", dnd: false, inspectionFlag: true, guestState: "Vacant" },
    { id: "104", type: "Deluxe", floor: 1, hkSt: "Inspected", attendant: "Grace Achebe", priority: null, since: "09:45", dnd: false, inspectionFlag: false, guestState: "Arrival" },
    { id: "201", type: "Standard", floor: 2, hkSt: "Dirty", attendant: "Ngozi Ike", priority: null, since: "08:30", dnd: true, inspectionFlag: false, guestState: "Stayover" },
    { id: "202", type: "Deluxe", floor: 2, hkSt: "Dirty", attendant: null, priority: "High", since: "08:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "203", type: "Standard", floor: 2, hkSt: "In Progress", attendant: "Ngozi Ike", priority: null, since: "09:30", dnd: false, inspectionFlag: false, guestState: "Stayover" },
    { id: "301", type: "Junior Suite", floor: 3, hkSt: "Dirty", attendant: "Amaka Osei", priority: null, since: "09:00", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "302", type: "Standard", floor: 3, hkSt: "Clean", attendant: "Amaka Osei", priority: null, since: "10:00", dnd: false, inspectionFlag: false, guestState: "Arrival" },
    { id: "304", type: "Junior Suite", floor: 3, hkSt: "Dirty", attendant: "Ngozi Ike", priority: "High", since: "08:15", dnd: false, inspectionFlag: false, guestState: "Departure" },
    { id: "501", type: "Presidential Suite", floor: 5, hkSt: "Inspected", attendant: "Grace Achebe", priority: null, since: "09:55", dnd: false, inspectionFlag: false, guestState: "Occupied" },
  ];
  const [rooms, setRooms] = useState(EXTENDED_ROOMS);
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("All");
  const [attFilter, setAttFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTarget, setBulkTarget] = useState("");
  const COLS = [
    { id: "Dirty", label: "Dirty", color: "#D97706", bg: "#FFFBEB" },
    { id: "In Progress", label: "In Progress", color: "#2563EB", bg: "#EFF6FF" },
    { id: "Clean", label: "Clean", color: "#059669", bg: "#F0FDF4" },
    { id: "Inspected", label: "Inspected", color: "#7C3AED", bg: "#F5F3FF" },
  ];
  const ATTENDANTS = ["All", ...Array.from(new Set(EXTENDED_ROOMS.map(r => r.attendant).filter(Boolean))) as string[]];
  const FLOORS = ["All", "1", "2", "3", "5"];
  const filtered = rooms.filter(r =>
    (!search || r.id.includes(search) || (r.attendant || "").toLowerCase().includes(search.toLowerCase())) &&
    (floorFilter === "All" || String(r.floor) === floorFilter) &&
    (attFilter === "All" || r.attendant === attFilter)
  );
  const moveTo = (roomId: string, colId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, hkSt: colId } : r));
    add({ type: "success", title: `Room ${roomId} → ${colId}` });
  };
  const bulkMove = () => {
    if (!bulkTarget || selected.length === 0) return;
    setRooms(prev => prev.map(r => selected.includes(r.id) ? { ...r, hkSt: bulkTarget } : r));
    add({ type: "success", title: `${selected.length} rooms → ${bulkTarget}` });
    setSelected([]); setBulkTarget("");
  };
  const toggleSel = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const guestStateColor = (gs: string) => gs === "Departure" ? ERROR : gs === "Arrival" ? TEAL : gs === "Stayover" ? MUTED : SUBTLE;
  return (
    <div>
      <PageHeader title="Housekeeping Board" sub="Floor-by-floor room status · Click advance button to update"
        actions={<><BtnO label="Print Report" icon={Download} /><BtnP label="Assign Rooms" icon={Plus} onClick={() => add({ type: "info", title: "Open schedule to assign rooms" })} /></>} />
      {/* Counts strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {COLS.map(c => { const n = rooms.filter(r => r.hkSt === c.id).length; const pri = rooms.filter(r => r.hkSt === c.id && r.priority).length; return (
          <div key={c.id} className="bg-white rounded-xl p-4 border flex items-center gap-3" style={{ borderColor: BORDER }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0" style={{ backgroundColor: c.bg, color: c.color }}>{n}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c.label}</div>
              {pri > 0 && <div className="text-xs mt-0.5 font-semibold" style={{ color: ERROR }}>{pri} priority</div>}
            </div>
          </div>
        ); })}
      </div>
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Room or attendant…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-44" style={{ borderColor: BORDER }} /></div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: MUTED }}>Floor:</span>
          {FLOORS.map(f => <button key={f} onClick={() => setFloorFilter(f)} className="text-xs px-2 py-1.5 rounded-lg border" style={{ backgroundColor: floorFilter === f ? PRIMARY : "white", color: floorFilter === f ? "white" : MUTED, borderColor: floorFilter === f ? PRIMARY : BORDER }}>{f}</button>)}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: MUTED }}>Attendant:</span>
          <select value={attFilter} onChange={e => setAttFilter(e.target.value)} className="text-xs px-2 py-1.5 rounded-lg border bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}>
            {ATTENDANTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        {selected.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: MUTED }}>{selected.length} selected</span>
            <select value={bulkTarget} onChange={e => setBulkTarget(e.target.value)} className="text-xs px-2 py-1.5 rounded-lg border bg-white outline-none" style={{ borderColor: BORDER }}>
              <option value="">Move to…</option>
              {COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <button onClick={bulkMove} disabled={!bulkTarget} className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Apply</button>
            <button onClick={() => setSelected([])} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Clear</button>
          </div>
        )}
        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto text-xs" style={{ color: SUBTLE }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR }} />Departure</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL }} />Arrival</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: MUTED }} />Stayover</span>
        </div>
      </div>
      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {COLS.map((col, ci) => {
          const colRooms = filtered.filter(r => r.hkSt === col.id);
          return (
            <div key={col.id} className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER, borderTop: `3px solid ${col.color}` }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: col.bg, borderColor: BORDER }}>
                <span className="text-sm font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: col.color + "22", color: col.color }}>{colRooms.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-64" style={{ backgroundColor: "#F9FAFB" }}>
                {colRooms.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs rounded-xl border-2 border-dashed" style={{ color: col.color + "70", borderColor: col.color + "30" }}>No rooms</div>
                )}
                {colRooms.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow" style={{ borderColor: selected.includes(r.id) ? PRIMARY : (r.priority ? ORANGE : BORDER), borderWidth: selected.includes(r.id) || r.priority ? 2 : 1 }}>
                    {/* Card header */}
                    <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: col.bg }}>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSel(r.id)} className="w-3.5 h-3.5" />
                        <span className="text-lg font-black" style={{ color: col.color }}>{r.id}</span>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: guestStateColor(r.guestState) }} title={r.guestState} />
                      </div>
                      <div className="flex items-center gap-1">
                        {r.dnd && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ backgroundColor: "#F3F4F6", color: MUTED }}>DND</span>}
                        {r.priority && <span className="text-xs px-1 py-0.5 rounded font-bold text-white" style={{ backgroundColor: ERROR }}>!</span>}
                        {r.inspectionFlag && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}>INS</span>}
                      </div>
                    </div>
                    <div className="px-3 pb-3 pt-1">
                      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: MUTED }}>
                        <span>{r.type} · F{r.floor}</span>
                        <span style={{ fontFamily: mono }}>{r.since}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span style={{ color: guestStateColor(r.guestState), fontWeight: 600 }}>{r.guestState}</span>
                        {r.attendant ? <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: col.color, fontSize: 9 }}>{r.attendant[0]}</div><span style={{ color: MUTED, fontSize: 10 }}>{r.attendant.split(" ")[0]}</span></div> : <span style={{ color: SUBTLE, fontSize: 10 }}>Unassigned</span>}
                      </div>
                      <div className="flex gap-1">
                        {ci < COLS.length - 1 && (
                          <button onClick={() => moveTo(r.id, COLS[ci + 1].id)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white" style={{ backgroundColor: COLS[ci + 1].color }}>
                            → {COLS[ci + 1].label}
                          </button>
                        )}
                        {nav && <button onClick={() => nav("work-orders", "Work Orders")} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>WO</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkOrders({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkTech, setBulkTech] = useState("Emeka Nwosu");
  const [newWO, setNewWO] = useState({ title: "", location: "", category: "Electrical", priority: "Medium", reportedBy: "John Abubakar", desc: "" });

  const EXTENDED_WO = [
    { id: "WO-0091", title: "AC not cooling", location: "Room 207", cat: "HVAC", priority: "High", status: "In Progress", tech: "Emeka Nwosu", reportedBy: "John Abubakar", reportedAt: "24 Jun 08:58", slaDue: "24 Jun 14:58", age: "1h 20m", guestImpact: true },
    { id: "WO-0090", title: "Bathroom pipe leak", location: "Room 316", cat: "Plumbing", priority: "High", status: "Overdue", tech: "Emeka Nwosu", reportedBy: "Grace Mensah", reportedAt: "23 Jun 13:00", slaDue: "23 Jun 21:00", age: "19h", guestImpact: true },
    { id: "WO-0089", title: "Lobby light flickering", location: "Lobby", cat: "Electrical", priority: "Medium", status: "Reported", tech: "Unassigned", reportedBy: "Fatima Al-Hassan", reportedAt: "24 Jun 06:30", slaDue: "24 Jun 14:30", age: "3h", guestImpact: false },
    { id: "WO-0088", title: "Commercial fridge noisy", location: "Restaurant Kitchen", cat: "Equipment", priority: "Low", status: "Assigned", tech: "Chidi Ike", reportedBy: "Kitchen Staff", reportedAt: "23 Jun 09:00", slaDue: "25 Jun 09:00", age: "1d", guestImpact: false },
    { id: "WO-0087", title: "Wardrobe door hinge broken", location: "Room 102", cat: "Furniture", priority: "Low", status: "Completed", tech: "Chidi Ike", reportedBy: "Grace Achebe", reportedAt: "22 Jun 10:00", slaDue: "24 Jun 10:00", age: "2d", guestImpact: false },
    { id: "WO-0086", title: "Generator #2 oil change due", location: "Generator Room", cat: "Mechanical", priority: "Medium", status: "Assigned", tech: "Emeka Nwosu", reportedBy: "System PM", reportedAt: "24 Jun 07:00", slaDue: "26 Jun 07:00", age: "2h", guestImpact: false },
    { id: "WO-0085", title: "Pool pump making noise", location: "Pool Area", cat: "Equipment", priority: "Medium", status: "Reported", tech: "Unassigned", reportedBy: "Bola Adewale", reportedAt: "24 Jun 10:15", slaDue: "25 Jun 10:15", age: "45m", guestImpact: false },
  ];

  const overdueCnt = EXTENDED_WO.filter(w => w.status === "Overdue").length;
  const visible = EXTENDED_WO.filter(w => {
    if (filter !== "All" && w.status !== filter) return false;
    if (search && !`${w.id} ${w.title} ${w.location} ${w.tech}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleRow = (id: string) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === visible.length ? [] : visible.map(w=>w.id));

  const submitWO = () => {
    if (!newWO.location || !newWO.title) { add({ type: "warning", title: "Fill in title and location" }); return; }
    setShowNew(false);
    add({ type: "success", title: "Work order created", body: `${newWO.location} — ${newWO.category} · ${newWO.priority} priority` });
    setNewWO({ title: "", location: "", category: "Electrical", priority: "Medium", reportedBy: "John Abubakar", desc: "" });
  };

  return (
    <div>
      <PageHeader title="Work Orders" sub="All maintenance requests across the property"
        actions={<><BtnO label="Export" icon={Download} /><BtnP label="New Work Order" icon={Plus} onClick={() => setShowNew(true)} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Open" value={String(EXTENDED_WO.filter(w=>w.status==="Reported"||w.status==="Assigned").length)} sub="Awaiting action" icon={AlertCircle} accent={ERROR} />
        <StatCard label="In Progress" value={String(EXTENDED_WO.filter(w=>w.status==="In Progress").length)} sub="Being worked on" icon={Activity} accent={ORANGE} />
        <StatCard label="Overdue" value={String(overdueCnt)} sub="Past SLA deadline" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Completed" value={String(EXTENDED_WO.filter(w=>w.status==="Completed").length)} sub="Resolved today" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, location, technician…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-56" style={{ borderColor: BORDER }} /></div>
        <div className="flex gap-2 flex-wrap">
          {["All","Reported","Assigned","In Progress","Overdue","Completed"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
              style={{ borderColor: filter===s ? PRIMARY : BORDER, backgroundColor: filter===s ? "#EFF6FF" : "white", color: filter===s ? PRIMARY : MUTED }}>
              {s}{s==="Overdue" && overdueCnt > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{overdueCnt}</span>}
            </button>
          ))}
        </div>
        {selected.length > 0 && <button onClick={() => setShowBulkAssign(true)} className="ml-auto px-3.5 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Assign {selected.length} selected</button>}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 2px 8px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB", borderBottom: `2px solid ${BORDER}` }}>
              <th className="px-4 py-3 w-8"><input type="checkbox" checked={selected.length === visible.length && visible.length > 0} onChange={toggleAll} className="rounded" /></th>
              {["ID","Title / Location","Category","Priority","Status","Reported By","Reported At","SLA Due","Assigned To","Age",""].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(w => (
              <tr key={w.id} className="border-t hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ borderColor: "#F4F4F5", backgroundColor: w.status === "Overdue" ? "#FFF5F5" : "white" }}
                onClick={() => nav && nav("work-order-detail", w.id)}>
                <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleRow(w.id); }}><input type="checkbox" checked={selected.includes(w.id)} onChange={() => toggleRow(w.id)} className="rounded" /></td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.id}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    {w.guestImpact && <span title="Guest impact" style={{ color: ERROR }}>⚑</span>}
                    <div><div className="text-sm font-semibold" style={{ color: TEXT }}>{w.title}</div><div className="text-xs" style={{ color: SUBTLE }}>{w.location}</div></div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{w.cat}</td>
                <td className="px-3 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: priC[w.priority], backgroundColor: `${priC[w.priority]}15` }}>{w.priority}</span></td>
                <td className="px-3 py-3"><Badge label={w.status} colors={woC[w.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{w.reportedBy}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{w.reportedAt}</td>
                <td className="px-3 py-3 text-xs font-semibold" style={{ color: w.status === "Overdue" ? ERROR : MUTED, fontFamily: mono }}>{w.slaDue}</td>
                <td className="px-3 py-3 text-xs" style={{ color: w.tech === "Unassigned" ? WARNING : MUTED }}>{w.tech}</td>
                <td className="px-3 py-3 text-xs font-semibold" style={{ color: w.status === "Overdue" ? ERROR : ORANGE, fontFamily: mono }}>{w.age}</td>
                <td className="px-3 py-3"><button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: SUBTLE }} onClick={e => e.stopPropagation()}><MoreHorizontal size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState icon={Wrench} message="No work orders match this filter." cta="New Work Order" onCta={() => setShowNew(true)} />}
      </div>

      {/* Bulk Assign Modal */}
      {showBulkAssign && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowBulkAssign(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-3" style={{ color: TEXT }}>Bulk Assign — {selected.length} work orders</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Assign to Technician</label>
            <select value={bulkTech} onChange={e => setBulkTech(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
              {["Emeka Nwosu","Chidi Ike","External Vendor"].map(t => <option key={t}>{t}</option>)}
            </select></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowBulkAssign(false)} /><button onClick={() => { add({ type: "success", title: `${selected.length} WOs assigned to ${bulkTech}` }); setSelected([]); setShowBulkAssign(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Assign</button></div>
          </div>
        </>
      )}

      {/* New Work Order Modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: TEXT }}>New Work Order</h3>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>Report a maintenance issue across the property</p>
              </div>
              <button onClick={() => setShowNew(false)} style={{ color: SUBTLE }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Title</label>
                <input value={newWO.title} onChange={e => setNewWO(p => ({ ...p, title: e.target.value }))} placeholder="Brief description of the issue"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Location</label>
                <input value={newWO.location} onChange={e => setNewWO(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Room 207, Restaurant Kitchen, Pool Area"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Category</label>
                  <select value={newWO.category} onChange={e => setNewWO(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                    {["Electrical", "HVAC", "Plumbing", "Furniture", "Equipment", "General"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Priority</label>
                  <select value={newWO.priority} onChange={e => setNewWO(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }}>
                    {["Low", "Medium", "High"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label>
                <textarea value={newWO.desc} onChange={e => setNewWO(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue clearly. Include what's broken, how long it's been a problem, and any safety concerns." rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = BORDER} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={() => setShowNew(false)} />
              <BtnP label="Create Work Order" icon={CheckCircle2} onClick={submitWO} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function InternalChat({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type Presence = "online" | "away" | "offline";
  const CHANNELS: { name: string; unread: number; pinned?: string }[] = [
    { name: "All Staff",     unread: 1, pinned: "📌 Reminder: Night audit at 23:00 tonight." },
    { name: "Front Desk",    unread: 0, pinned: "📌 New walk-in procedure posted — check docs." },
    { name: "Housekeeping",  unread: 3, pinned: undefined },
    { name: "Maintenance",   unread: 2, pinned: undefined },
    { name: "F&B",           unread: 0, pinned: undefined },
    { name: "Management",    unread: 0, pinned: "📌 Q4 targets shared in Files." },
  ];
  const DMS: { name: string; av: string; presence: Presence; unread: number }[] = [
    { name: "Fatima Ibrahim",  av: "FI", presence: "online",  unread: 1 },
    { name: "Chukwuemeka Obi", av: "CO", presence: "away",    unread: 0 },
    { name: "Amina Yusuf",     av: "AY", presence: "online",  unread: 0 },
    { name: "Kemi Adeyemi",    av: "KA", presence: "offline", unread: 0 },
  ];
  const presenceColor: Record<Presence, string> = { online: SUCCESS, away: WARNING, offline: SUBTLE };

  const [activeCh, setActiveCh]     = useState("Front Desk");
  const [activeView, setActiveView] = useState<"channel"|"dm">("channel");
  const [activeDM, setActiveDM]     = useState(DMS[0].name);
  const [msg, setMsg]               = useState("");
  const [search, setSearch]         = useState("");
  const [showPinned, setShowPinned] = useState(false);
  const msgs = CHAT_MSGS[activeCh] ?? [];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeCh, activeDM]);

  const pinnedMsg = CHANNELS.find(c => c.name === activeCh)?.pinned;
  const filtered = search ? msgs.filter(m => m.msg.toLowerCase().includes(search.toLowerCase())) : msgs;
  const send = () => {
    if (!msg.trim()) return;
    add({ type: "success", title: "Message sent", body: activeView === "channel" ? `#${activeCh}` : `DM → ${activeDM}` });
    setMsg("");
  };

  // Reusable bubble
  const Bubble = ({ m }: { m: { from: string; av: string; msg: string; time: string; mine?: boolean } }) => (
    <div className={`flex items-end gap-3 ${m.mine ? "flex-row-reverse" : ""}`}>
      {!m.mine && <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-1" style={{ backgroundColor: PRIMARY }}>{m.av}</div>}
      <div className={`max-w-xs lg:max-w-md flex flex-col ${m.mine ? "items-end" : "items-start"}`}>
        {!m.mine && <span className="text-xs font-medium mb-1" style={{ color: MUTED }}>{m.from}</span>}
        <div className="px-3 py-2 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: m.mine ? PRIMARY : "#F4F4F5", color: m.mine ? "white" : TEXT }}>{m.msg}</div>
        <span className="text-xs mt-1" style={{ color: SUBTLE, fontFamily: mono }}>{m.time}</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Internal Chat" sub="LAN-based staff messaging · Fully offline"
        actions={
          <button onClick={() => add({ type: "warning", title: "Emergency broadcast sent to all staff" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>
            <AlertTriangle size={14} /> Emergency Broadcast
          </button>
        }
      />
      <div className="bg-white rounded-xl border overflow-hidden flex" style={{ borderColor: BORDER, height: 600 }}>
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ borderColor: BORDER }}>
          <div className="p-2 border-b" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
              <Search size={12} style={{ color: SUBTLE }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" className="flex-1 text-xs outline-none bg-transparent" style={{ color: TEXT }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: SUBTLE }}>Channels</div>
            {CHANNELS.map(ch => (
              <button key={ch.name} onClick={() => { setActiveCh(ch.name); setActiveView("channel"); }}
                className="w-full flex items-center justify-between px-3 py-2 text-left"
                style={{ backgroundColor: activeView === "channel" && activeCh === ch.name ? "#EFF6FF" : "transparent", borderLeft: `3px solid ${activeView === "channel" && activeCh === ch.name ? PRIMARY : "transparent"}` }}>
                <span className="text-xs font-medium" style={{ color: activeView === "channel" && activeCh === ch.name ? PRIMARY : TEXT }}>#{ch.name}</span>
                {ch.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ERROR, fontSize: 10 }}>{ch.unread}</span>}
              </button>
            ))}
            <div className="px-3 pt-3 pb-1 mt-1 border-t text-xs font-semibold uppercase tracking-wider" style={{ color: SUBTLE, borderColor: BORDER }}>Direct Messages</div>
            {DMS.map(dm => (
              <button key={dm.name} onClick={() => { setActiveDM(dm.name); setActiveView("dm"); }}
                className="w-full flex items-center gap-2 px-3 py-2"
                style={{ backgroundColor: activeView === "dm" && activeDM === dm.name ? "#EFF6FF" : "transparent" }}>
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{dm.av}</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: presenceColor[dm.presence] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: TEXT }}>{dm.name.split(" ")[0]}</div>
                  <div className="text-xs" style={{ color: SUBTLE }}>{dm.presence}</div>
                </div>
                {dm.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ERROR, fontSize: 10 }}>{dm.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}18` }}>
                <MessageSquare size={16} style={{ color: PRIMARY }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: TEXT }}>
                  {activeView === "channel" ? `#${activeCh}` : activeDM}
                </div>
                <div className="text-xs" style={{ color: SUBTLE }}>
                  {activeView === "channel" ? "Department channel" : `${DMS.find(d => d.name === activeDM)?.presence}`}
                </div>
              </div>
            </div>
            {activeView === "channel" && pinnedMsg && (
              <button onClick={() => setShowPinned(p => !p)} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                📌 Pinned
              </button>
            )}
          </div>

          {/* Pinned banner */}
          {showPinned && pinnedMsg && (
            <div className="px-5 py-2.5 text-xs border-b" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A", color: "#92400E" }}>
              {pinnedMsg}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
            {search && <div className="text-xs text-center mb-2" style={{ color: MUTED }}>Showing results for "{search}"</div>}
            {filtered.length === 0 && <div className="text-center text-xs mt-8" style={{ color: SUBTLE }}>No messages found.</div>}
            {filtered.map((m, i) => <Bubble key={i} m={m} />)}
            {activeView === "dm" && (
              <Bubble m={{ from: activeDM, av: DMS.find(d=>d.name===activeDM)?.av ?? "?", msg: "Hi, let me check on that and get back to you shortly.", time: "14:22", mine: false }} />
            )}
            <div ref={endRef} />
          </div>

          {/* Compose */}
          <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder={activeView === "channel" ? `Message #${activeCh}…` : `Message ${activeDM.split(" ")[0]}…`}
                className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
              <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: PRIMARY }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function POSTerminal({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  type OrderLine = { id: number; name: string; price: number; qty: number; note: string; mod: string };
  const [order, setOrder] = useState<OrderLine[]>([]);
  const [activeCat, setActiveCat] = useState("Mains");
  const [payMethod, setPayMethod] = useState("cash");
  const [cashIn, setCashIn] = useState("");
  const [compReason, setCompReason] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("202");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [activeTable, setActiveTable] = useState("T02");
  const [editNote, setEditNote] = useState<number | null>(null);
  const [noteVal, setNoteVal] = useState("");
  const [held, setHeld] = useState(false);

  const FULL_MENU = [
    { id: 1, name: "Jollof Rice + Chicken", price: 4500, cat: "Mains", avail: true, mods: ["Extra spicy","Less spicy","No pepper"] },
    { id: 2, name: "Egusi Soup + Pounded Yam", price: 5200, cat: "Mains", avail: true, mods: ["Extra soup","Half portion"] },
    { id: 3, name: "Grilled Fish", price: 6800, cat: "Mains", avail: true, mods: ["No pepper","Extra lemon"] },
    { id: 13, name: "Pepper Soup", price: 5500, cat: "Mains", avail: false, mods: [] },
    { id: 11, name: "Suya", price: 3000, cat: "Starters", avail: true, mods: ["Extra suya spice","Less spice"] },
    { id: 12, name: "Spring Rolls (6pc)", price: 2800, cat: "Starters", avail: true, mods: [] },
    { id: 14, name: "Garden Salad", price: 2200, cat: "Starters", avail: true, mods: ["No onion","Extra dressing"] },
    { id: 4, name: "Fried Plantain", price: 1500, cat: "Sides", avail: true, mods: [] },
    { id: 5, name: "Moi Moi", price: 1200, cat: "Sides", avail: false, mods: [] },
    { id: 15, name: "White Rice", price: 800, cat: "Sides", avail: true, mods: [] },
    { id: 6, name: "Chapman", price: 2000, cat: "Drinks", avail: true, mods: [] },
    { id: 7, name: "Zobo", price: 1000, cat: "Drinks", avail: true, mods: [] },
    { id: 8, name: "Bottled Water", price: 500, cat: "Drinks", avail: true, mods: [] },
    { id: 16, name: "Fanta / Coke", price: 600, cat: "Drinks", avail: true, mods: [] },
    { id: 9, name: "Chocolate Cake", price: 3500, cat: "Desserts", avail: true, mods: [] },
    { id: 10, name: "Fruit Salad", price: 2500, cat: "Desserts", avail: true, mods: [] },
  ];

  const CATS = ["Mains","Starters","Sides","Drinks","Desserts"];
  const catItems = FULL_MENU.filter(i => i.cat === activeCat);

  const addItem = (item: typeof FULL_MENU[0]) => {
    if (!item.avail) return;
    setOrder(prev => {
      const ex = prev.find(o => o.id === item.id);
      if (ex) return prev.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, note: "", mod: item.mods[0] ?? "" }];
    });
  };
  const setQty = (id: number, qty: number) => { if (qty < 1) setOrder(p => p.filter(o => o.id !== id)); else setOrder(p => p.map(o => o.id === id ? { ...o, qty } : o)); };
  const setMod = (id: number, mod: string) => setOrder(p => p.map(o => o.id === id ? { ...o, mod } : o));
  const voidLine = (id: number) => { setOrder(p => p.filter(o => o.id !== id)); add({ type: "warning", title: "Line voided" }); };

  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const svcCharge = Math.round(subtotal * 0.10);
  const vat = Math.round((subtotal + svcCharge) * 0.075);
  const total = subtotal + svcCharge + vat;
  const cashInNum = parseFloat(cashIn.replace(/,/g, "")) || 0;
  const change = Math.max(0, cashInNum - total);

  const sendToKitchen = () => {
    if (order.length === 0) return;
    add({ type: "success", title: "Order sent to kitchen", body: `${order.reduce((s,o)=>s+o.qty,0)} items · ${activeTable}` });
    setOrder([]); setHeld(false);
  };

  const handlePayment = () => {
    if (order.length === 0) return;
    if (payMethod === "cash" && cashInNum < total) { add({ type: "warning", title: "Insufficient cash tendered" }); return; }
    if (payMethod === "complimentary" && !compReason.trim()) { add({ type: "warning", title: "Complimentary reason required" }); return; }
    if (payMethod === "room") { const g = IN_HOUSE.find(x => x.room === selectedRoom); add({ type: "success", title: "Posted to room folio", body: `₦${total.toLocaleString()} → Room ${selectedRoom} · ${g?.guest ?? ""}` }); }
    else add({ type: "success", title: `Payment received — ${payMethod.toUpperCase()}`, body: `₦${total.toLocaleString()} · ${activeTable}` });
    setOrder([]); setCashIn(""); setCompReason("");
  };

  const PAY_METHODS = [
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "pos", label: "POS Terminal" },
    { id: "room", label: "Room Charge" },
    { id: "complimentary", label: "Comp" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="text-xl font-bold" style={{ color: TEXT }}>POS Terminal</div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs" style={{ color: MUTED }}>Table:</span>
          {TABLE_LAYOUT.slice(0, 6).map(t => <button key={t.id} onClick={() => setActiveTable(t.id)} className="text-xs px-2.5 py-1 rounded-lg border font-semibold" style={{ backgroundColor: activeTable===t.id ? PRIMARY : "white", color: activeTable===t.id ? "white" : MUTED, borderColor: activeTable===t.id ? PRIMARY : BORDER }}>{t.id}</button>)}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => nav && nav("table-management", "Tables")} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border" style={{ color: MUTED, borderColor: BORDER }}><Layers size={13} />Tables</button>
          {held && <span className="text-xs px-2.5 py-2 rounded-xl font-bold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>HELD</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Today's Revenue" value="₦184,500" sub="POS transactions" icon={DollarSign} accent={PRIMARY} />
        <StatCard label="Orders" value="42" sub="Completed today" icon={ClipboardList} accent={TEAL} />
        <StatCard label="Avg Order" value="₦4,393" sub="Per ticket" icon={TrendingUp} accent={SUCCESS} />
        <StatCard label="Open Tabs" value="3" sub="Room folio charges" icon={FileText} accent={ORANGE} />
      </div>

      <div className="flex gap-3" style={{ height: 600 }}>
        {/* LEFT — menu grid */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            {CATS.map(c => <button key={c} onClick={() => setActiveCat(c)} className="flex-1 py-3 text-sm font-semibold transition-colors" style={{ color: activeCat===c ? PRIMARY : MUTED, borderBottom: activeCat===c ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{c}</button>)}
          </div>
          <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {catItems.map(item => {
                const inOrder = order.find(o => o.id === item.id);
                return (
                  <button key={item.id} onClick={() => addItem(item)} disabled={!item.avail} className="p-4 rounded-xl border-2 text-left transition-all" style={{ borderColor: inOrder ? PRIMARY : BORDER, backgroundColor: !item.avail ? "#F9FAFB" : inOrder ? "#EFF6FF" : "white", opacity: item.avail ? 1 : 0.55, cursor: item.avail ? "pointer" : "not-allowed" }}>
                    <div className="text-sm font-semibold mb-1 leading-tight" style={{ color: item.avail ? TEXT : SUBTLE }}>{item.name}</div>
                    <div className="text-base font-bold" style={{ color: item.avail ? PRIMARY : SUBTLE }}>₦{item.price.toLocaleString()}</div>
                    {!item.avail && <div className="text-xs mt-1 font-semibold" style={{ color: ERROR }}>86'd</div>}
                    {inOrder && <div className="text-xs mt-1 font-semibold" style={{ color: TEAL }}>×{inOrder.qty} added</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTRE — order lines */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{activeTable} · Current Order</div><div className="text-xs" style={{ color: SUBTLE }}>{order.reduce((s,o)=>s+o.qty,0)} items</div></div>
            {order.length > 0 && <button onClick={() => { setHeld(true); add({ type: "info", title: `${activeTable} order held` }); }} className="text-xs px-2 py-1.5 rounded-lg border" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>Hold</button>}
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {order.length === 0
              ? <div className="flex flex-col items-center justify-center h-full text-center px-4"><ShoppingCart size={28} style={{ color: SUBTLE }} /><p className="text-xs mt-2" style={{ color: SUBTLE }}>Tap menu items to add to order</p></div>
              : order.map(o => {
                  const menuItem = FULL_MENU.find(i => i.id === o.id);
                  return (
                    <div key={o.id} className="px-3 py-3 border-b" style={{ borderColor: "#F4F4F5" }}>
                      <div className="flex items-start gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: TEXT }}>{o.name}</div>
                          <div className="text-xs" style={{ color: MUTED }}>₦{o.price.toLocaleString()} each</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setQty(o.id, o.qty-1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}><MinusCircle size={13} /></button>
                          <span className="w-5 text-center text-xs font-bold" style={{ color: TEXT }}>{o.qty}</span>
                          <button onClick={() => setQty(o.id, o.qty+1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: PRIMARY }}><PlusCircle size={13} /></button>
                        </div>
                        <div className="text-xs font-bold w-14 text-right" style={{ color: TEXT }}>₦{(o.price*o.qty).toLocaleString()}</div>
                      </div>
                      {menuItem && menuItem.mods.length > 0 && (
                        <select value={o.mod} onChange={e => setMod(o.id, e.target.value)} className="w-full text-xs px-2 py-1 rounded-lg border outline-none mb-1" style={{ borderColor: BORDER, color: MUTED }}>
                          {menuItem.mods.map(m => <option key={m}>{m}</option>)}
                        </select>
                      )}
                      <div className="flex items-center gap-2">
                        {editNote === o.id
                          ? <input autoFocus value={noteVal} onChange={e=>setNoteVal(e.target.value)} onBlur={() => { setOrder(p=>p.map(x=>x.id===o.id?{...x,note:noteVal}:x)); setEditNote(null); }} className="flex-1 text-xs px-2 py-1 rounded-lg border outline-none" style={{ borderColor: BORDER }} placeholder="Note…" />
                          : <button onClick={() => { setEditNote(o.id); setNoteVal(o.note); }} className="text-xs" style={{ color: o.note ? TEAL : SUBTLE }}>✎ {o.note || "Add note"}</button>
                        }
                        <button onClick={() => voidLine(o.id)} className="text-xs ml-auto px-2 py-0.5 rounded" style={{ color: ERROR, backgroundColor: "#FEF2F2" }}>void</button>
                      </div>
                    </div>
                  );
                })
            }
          </div>
          {order.length > 0 && (
            <div className="px-4 py-3 border-t" style={{ borderColor: BORDER }}>
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between"><span style={{ color: MUTED }}>Subtotal</span><span style={{ fontFamily: mono }}>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>Service Charge 10%</span><span style={{ fontFamily: mono }}>₦{svcCharge.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: MUTED }}>VAT 7.5%</span><span style={{ fontFamily: mono }}>₦{vat.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t" style={{ color: TEXT, borderColor: BORDER }}>
                  <span>Total</span><span style={{ fontFamily: mono }}>₦{total.toLocaleString()}</span>
                </div>
              </div>
              <BtnP label="Send to Kitchen" icon={UtensilsCrossed} onClick={sendToKitchen} />
            </div>
          )}
        </div>

        {/* RIGHT — payment panel */}
        <div className="w-64 flex-shrink-0 bg-white rounded-xl border flex flex-col" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}><div className="text-sm font-bold" style={{ color: TEXT }}>Payment</div></div>
          <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
            {/* Payment method */}
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Method</div>
              <div className="grid grid-cols-2 gap-1.5">
                {PAY_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} className="py-2 rounded-xl text-xs font-semibold border-2 transition-all" style={{ borderColor: payMethod===m.id ? PRIMARY : BORDER, backgroundColor: payMethod===m.id ? "#EFF6FF" : "white", color: payMethod===m.id ? PRIMARY : MUTED }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash change calculator */}
            {payMethod === "cash" && (
              <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Cash Tendered</div>
                <input value={cashIn} onChange={e=>setCashIn(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none" style={{ borderColor: BORDER, fontFamily: mono }} />
                {cashInNum > 0 && <div className="mt-2 flex justify-between text-xs"><span style={{ color: MUTED }}>Change</span><span className="font-bold" style={{ color: change >= 0 ? SUCCESS : ERROR, fontFamily: mono }}>₦{change.toLocaleString()}</span></div>}
              </div>
            )}

            {/* Room charge picker */}
            {payMethod === "room" && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Guest Room</div>
                <button onClick={() => setShowRoomPicker(p=>!p)} className="w-full px-3 py-2 rounded-xl border text-xs text-left flex items-center justify-between" style={{ borderColor: BORDER }}>
                  <span style={{ color: TEXT }}>Room {selectedRoom}</span>
                  <ChevronDown size={12} style={{ color: SUBTLE }} />
                </button>
                {showRoomPicker && (
                  <div className="mt-1 rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: BORDER }}>
                    {IN_HOUSE.map(g => <button key={g.room} onClick={() => { setSelectedRoom(g.room); setShowRoomPicker(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] border-b last:border-0" style={{ borderColor: "#F4F4F5", color: TEXT }}><span className="font-semibold">Room {g.room}</span> — {g.guest}</button>)}
                  </div>
                )}
              </div>
            )}

            {/* Complimentary reason */}
            {payMethod === "complimentary" && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Reason (required)</div>
                <textarea value={compReason} onChange={e=>setCompReason(e.target.value)} rows={2} placeholder="e.g. VIP guest, manager approval…" className="w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none" style={{ borderColor: BORDER }} />
              </div>
            )}

            {/* Order total summary */}
            {order.length > 0 && (
              <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: "#F0FDF4", border: `1px solid #BBF7D0` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: SUCCESS }}>Order Total</div>
                <div className="text-xl font-black" style={{ color: SUCCESS, fontFamily: mono }}>₦{total.toLocaleString()}</div>
              </div>
            )}
          </div>
          <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: BORDER }}>
            <button disabled={order.length === 0} onClick={handlePayment} className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: SUCCESS }}>
              Charge ₦{total.toLocaleString()}
            </button>
            <button onClick={() => { add({ type: "info", title: `${activeTable} order held` }); setHeld(true); }} disabled={order.length === 0} className="w-full py-2.5 rounded-xl text-xs font-semibold border disabled:opacity-40" style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>
              Hold Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableManagement({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  type TblStatus = "Available" | "Occupied" | "Reserved" | "Dirty";
  type TblRow = { id: string; seats: number; status: TblStatus; col: number; row: number; guest?: string; time?: string; server?: string; orderValue?: number; covers?: number };

  const TABLES: TblRow[] = [
    { id: "T01", seats: 2, status: "Available", col: 1, row: 1 },
    { id: "T02", seats: 4, status: "Occupied", col: 3, row: 1, guest: "Okafor party", time: "34m", server: "Mike A.", orderValue: 18500, covers: 3 },
    { id: "T03", seats: 4, status: "Occupied", col: 5, row: 1, guest: "Adeyemi ×4", time: "12m", server: "Bisi O.", orderValue: 9200, covers: 4 },
    { id: "T04", seats: 6, status: "Reserved", col: 7, row: 1 },
    { id: "T05", seats: 2, status: "Available", col: 1, row: 3 },
    { id: "T06", seats: 4, status: "Occupied", col: 3, row: 3, guest: "Couple", time: "1h 5m", server: "Mike A.", orderValue: 14800, covers: 2 },
    { id: "T07", seats: 4, status: "Dirty", col: 5, row: 3 },
    { id: "T08", seats: 8, status: "Available", col: 7, row: 3 },
    { id: "T09", seats: 2, status: "Occupied", col: 1, row: 5, guest: "Dr. Bello ×2", time: "22m", server: "Bisi O.", orderValue: 12000, covers: 2 },
    { id: "T10", seats: 6, status: "Reserved", col: 3, row: 5 },
    { id: "T11", seats: 4, status: "Available", col: 5, row: 5 },
    { id: "T12", seats: 4, status: "Occupied", col: 7, row: 5, guest: "Eze family", time: "8m", server: "Mike A.", orderValue: 4500, covers: 3 },
  ];

  const [tables, setTables] = useState<TblRow[]>(TABLES);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSeat, setShowSeat] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [seatParty, setSeatParty] = useState({ size: "2", server: "Mike A." });
  const [transferTo, setTransferTo] = useState("");

  const sel = selected ? tables.find(t => t.id === selected) : null;
  const c = sel ? (tblC[sel.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" }) : null;

  const seat = () => {
    setTables(p => p.map(t => t.id === selected ? { ...t, status: "Occupied" as TblStatus, guest: `Party of ${seatParty.size}`, time: "0m", server: seatParty.server, covers: parseInt(seatParty.size), orderValue: 0 } : t));
    add({ type: "success", title: `Table ${selected} seated — party of ${seatParty.size}` });
    setShowSeat(false);
  };

  const markClean = (id: string) => { setTables(p => p.map(t => t.id === id ? { ...t, status: "Available" as TblStatus, guest: undefined, time: undefined, server: undefined, orderValue: undefined, covers: undefined } : t)); add({ type: "success", title: `Table ${id} marked clean` }); };
  const markDirty = (id: string) => { setTables(p => p.map(t => t.id === id ? { ...t, status: "Dirty" as TblStatus } : t)); add({ type: "info", title: `Table ${id} marked dirty` }); setSelected(null); };

  const transferTable = () => {
    if (!transferTo || !selected) return;
    const from = tables.find(t => t.id === selected)!;
    setTables(p => p.map(t => {
      if (t.id === selected) return { ...t, status: "Dirty" as TblStatus, guest: undefined, time: undefined, server: undefined, orderValue: undefined };
      if (t.id === transferTo) return { ...t, status: "Occupied" as TblStatus, guest: from.guest, time: from.time, server: from.server, orderValue: from.orderValue, covers: from.covers };
      return t;
    }));
    add({ type: "success", title: `Order transferred ${selected} → ${transferTo}` });
    setSelected(transferTo); setShowTransfer(false);
  };

  const SERVERS = ["Mike A.", "Bisi O.", "Tunde E."];

  return (
    <div>
      <PageHeader title="Table Management" sub="Restaurant floor plan · Live status" actions={<><BtnO label="Dining Reservations" icon={CalendarDays} onClick={() => nav && nav("dining-reservations", "Dining Reservations")} /><BtnP label="Open POS" icon={UtensilsCrossed} onClick={() => nav && nav("pos-terminal", "POS Terminal")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Occupied" value={String(tables.filter(t=>t.status==="Occupied").length)} sub="Currently serving" icon={UtensilsCrossed} accent={ORANGE} />
        <StatCard label="Available" value={String(tables.filter(t=>t.status==="Available").length)} sub="Ready for seating" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Reserved" value={String(tables.filter(t=>t.status==="Reserved").length)} sub="Upcoming bookings" icon={CalendarDays} accent={TEAL} />
        <StatCard label="On Floor" value={`₦${tables.filter(t=>t.status==="Occupied").reduce((s,t)=>s+(t.orderValue??0),0).toLocaleString()}`} sub="Open tab value" icon={DollarSign} accent={PRIMARY} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Floor plan */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Floor Plan — Main Dining Room</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 10, minHeight: 300 }}>
            {tables.map(t => {
              const tc = tblC[t.status] ?? { bg: "#F4F4F5", border: "#CBD5E1", text: "#374151" };
              const isSelected = selected === t.id;
              return (
                <div key={t.id} onClick={() => setSelected(isSelected ? null : t.id)} className="cursor-pointer rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:shadow-md" style={{ gridColumn: `${t.col} / span 2`, gridRow: `${t.row} / span 2`, backgroundColor: isSelected ? `${tc.border}25` : tc.bg, borderColor: isSelected ? tc.border : `${tc.border}60`, padding: 8, minHeight: 80 }}>
                  <div className="text-xs font-black" style={{ color: tc.text }}>{t.id}</div>
                  <div className="text-xs" style={{ color: tc.text }}>{t.seats}p</div>
                  {t.status === "Occupied" && t.time && <div className="text-xs font-bold mt-0.5" style={{ color: tc.text, fontFamily: mono }}>{t.time}</div>}
                  {t.status === "Occupied" && t.orderValue != null && t.orderValue > 0 && <div className="text-xs mt-0.5 font-semibold" style={{ color: tc.text }}>₦{Math.round(t.orderValue/1000)}k</div>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t text-xs flex-wrap" style={{ borderColor: "#F4F4F5", color: MUTED }}>
            {Object.entries(tblC).map(([s, tc]) => <span key={s} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block border" style={{ backgroundColor: tc.bg, borderColor: tc.border }} />{s}</span>)}
          </div>
        </div>

        {/* Action panel */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          {sel && c ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-bold" style={{ color: TEXT }}>Table {sel.id}</div>
                <Badge label={sel.status} colors={{ bg: c.bg, text: c.text }} />
              </div>
              <div className="space-y-2 text-xs mb-4 border-b pb-4" style={{ borderColor: BORDER }}>
                {[["Seats", `${sel.seats} persons`], ...(sel.covers ? [["Covers", `${sel.covers}`]] : []), ...(sel.guest ? [["Party", sel.guest]] : []), ...(sel.time ? [["Seated", sel.time + " ago"]] : []), ...(sel.server ? [["Server", sel.server]] : []), ...(sel.orderValue != null && sel.orderValue > 0 ? [["Tab Value", `₦${sel.orderValue.toLocaleString()}`]] : [])].map(([k,v]) => (
                  <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT }}>{v}</span></div>
                ))}
              </div>
              <div className="space-y-2">
                {sel.status === "Available" && <BtnP label="Seat Party" icon={Users} onClick={() => setShowSeat(true)} />}
                {sel.status === "Occupied" && <>
                  <BtnP label="Open POS / Check" icon={FileText} onClick={() => nav && nav("pos-terminal", "POS")} />
                  <BtnO label="Transfer Table" icon={ArrowRight} onClick={() => { setShowTransfer(true); setTransferTo(""); }} />
                  <BtnO label="Mark Dirty / Cleared" icon={AlertCircle} onClick={() => markDirty(sel.id)} />
                </>}
                {sel.status === "Dirty" && <BtnP label="Mark Clean ✓" icon={CheckCircle2} onClick={() => { markClean(sel.id); setSelected(null); }} color={SUCCESS} />}
                {sel.status === "Reserved" && <BtnP label="Seat Walk-in" icon={Users} onClick={() => setShowSeat(true)} />}
                {/* Assign server */}
                {sel.status === "Occupied" && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Assign Server</label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl border outline-none" style={{ borderColor: BORDER }} defaultValue={sel.server ?? ""} onChange={e => { setTables(p => p.map(t => t.id === sel.id ? { ...t, server: e.target.value } : t)); add({ type: "info", title: `Server updated — ${sel.id}` }); }}>
                      {SERVERS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : <EmptyState icon={UtensilsCrossed} message="Click a table on the floor plan to view details and actions." />}
        </div>
      </div>

      {/* Seat modal */}
      {showSeat && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowSeat(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Seat Party — Table {selected}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Party Size</label>
              <select value={seatParty.size} onChange={e=>setSeatParty(p=>({...p,size:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
                {["1","2","3","4","5","6","7","8"].map(n=><option key={n}>{n}</option>)}
              </select></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Server</label>
              <select value={seatParty.server} onChange={e=>setSeatParty(p=>({...p,server:e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
                {SERVERS.map(s=><option key={s}>{s}</option>)}
              </select></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowSeat(false)} /><button onClick={seat} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Seat Party</button></div>
          </div>
        </>
      )}

      {/* Transfer modal */}
      {showTransfer && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowTransfer(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Transfer Table {selected} →</h3>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Transfer to</label>
            <select value={transferTo} onChange={e=>setTransferTo(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
              <option value="">Select available table…</option>
              {tables.filter(t=>t.status==="Available" && t.id !== selected).map(t=><option key={t.id}>{t.id} ({t.seats} seats)</option>)}
            </select></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowTransfer(false)} /><button disabled={!transferTo} onClick={transferTable} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Transfer</button></div>
          </div>
        </>
      )}
    </div>
  );
}


export function StaffDirectory({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const STAFF_FULL = [
    { id:"EMP-001", name:"John Abubakar",    role:"Front Desk Officer",  dept:"Front Desk",  phone:"0803-001-1001", email:"j.abubakar@grandpalms.ng",   empType:"Full-time",  hireDate:"03 Jan 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" as const },
    { id:"EMP-002", name:"Amaka Osei",       role:"Housekeeping Attendant",dept:"Housekeeping",phone:"0802-002-2002",email:"a.osei@grandpalms.ng",       empType:"Full-time",  hireDate:"15 Mar 2021", status:"Active",   shift:"Morning 06:00–14:00", gender:"F" as const },
    { id:"EMP-003", name:"Emeka Nwosu",      role:"Executive Chef",       dept:"Restaurant",  phone:"0801-003-3003", email:"e.nwosu@grandpalms.ng",       empType:"Full-time",  hireDate:"01 Jun 2020", status:"Active",   shift:"Morning 06:00–14:00", gender:"M" as const },
    { id:"EMP-004", name:"Fatima Ibrahim",   role:"Reservations Manager", dept:"Front Desk",  phone:"0805-004-4004", email:"f.ibrahim@grandpalms.ng",     empType:"Full-time",  hireDate:"20 Sep 2023", status:"Active",   shift:"Morning 08:00–16:00", gender:"F" as const },
    { id:"EMP-005", name:"Chidi Eze",        role:"Maintenance Engineer", dept:"Maintenance", phone:"0806-005-5005", email:"c.eze@grandpalms.ng",         empType:"Full-time",  hireDate:"10 Apr 2019", status:"Active",   shift:"Rotating",            gender:"M" as const },
    { id:"EMP-006", name:"Ngozi Okonkwo",    role:"HK Supervisor",       dept:"Housekeeping",phone:"0807-006-6006", email:"n.okonkwo@grandpalms.ng",     empType:"Full-time",  hireDate:"01 Feb 2022", status:"On Leave", shift:"Morning 06:00–14:00", gender:"F" as const },
    { id:"EMP-007", name:"Bello Musa",       role:"Finance Officer",      dept:"Finance",     phone:"0808-007-7007", email:"b.musa@grandpalms.ng",        empType:"Full-time",  hireDate:"14 Jul 2023", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" as const },
    { id:"EMP-008", name:"Ada Okonkwo",      role:"Guest Relations",      dept:"Front Desk",  phone:"0809-008-8008", email:"a.okonkwo@grandpalms.ng",     empType:"Contract",   hireDate:"01 Jan 2025", status:"Active",   shift:"Evening 15:00–23:00", gender:"F" as const },
    { id:"EMP-009", name:"Tunde Adeyemi",    role:"IT Administrator",     dept:"IT",          phone:"0810-009-9009", email:"t.adeyemi@grandpalms.ng",     empType:"Full-time",  hireDate:"05 May 2021", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" as const },
    { id:"EMP-010", name:"Grace Ojo",        role:"Restaurant Supervisor",dept:"Restaurant",  phone:"0811-010-1010", email:"g.ojo@grandpalms.ng",         empType:"Full-time",  hireDate:"22 Oct 2022", status:"Active",   shift:"Evening 14:00–22:00", gender:"F" as const },
    { id:"EMP-011", name:"Samuel Okafor",    role:"Security Officer",     dept:"Security",    phone:"0812-011-1011", email:"s.okafor@grandpalms.ng",      empType:"Contract",   hireDate:"01 Mar 2024", status:"Active",   shift:"Night 23:00–07:00",   gender:"M" as const },
    { id:"EMP-012", name:"Chidinma Eze",     role:"Spa Therapist",        dept:"Spa",         phone:"0813-012-1012", email:"c.eze2@grandpalms.ng",        empType:"Part-time",  hireDate:"15 Aug 2023", status:"Inactive", shift:"Morning 09:00–15:00", gender:"F" as const },
  ];

  const deptColors: Record<string, string> = { "Front Desk":"#2563EB","Housekeeping":"#059669","Maintenance":"#D97706","Restaurant":"#9333EA","Finance":"#0891B2","IT":"#DC2626","Security":"#374151","Spa":"#BE185D" };
  const stColors: Record<string,{bg:string;text:string}> = { Active:{bg:"#DCFCE7",text:"#166534"}, "On Leave":{bg:"#FEF3C7",text:"#92400E"}, Inactive:{bg:"#F3F4F6",text:"#374151"} };

  const [search, setSearch]     = useState("");
  const [dept, setDept]         = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [view, setView]         = useState<"card"|"table">("card");

  const depts = ["All", ...Array.from(new Set(STAFF_FULL.map(s=>s.dept)))];

  const filtered = STAFF_FULL.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (dept==="All" || s.dept===dept) &&
    (statusF==="All" || s.status===statusF)
  );

  return (
    <div>
      <PageHeader title="Staff Directory" sub={`${filtered.length} of ${STAFF_FULL.length} staff members`} actions={
        <div className="flex gap-2">
          <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting staff list" })} />
          <BtnP label="Add Staff" icon={Plus} onClick={() => add({ type:"info", title:"Add staff member" })} />
        </div>
      } />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Staff"  value={String(STAFF_FULL.length)}                                          sub="All employment types" icon={Users}         accent={PRIMARY} />
        <StatCard label="On Shift"     value={String(STAFF_FULL.filter(s=>s.status==="Active").length)}            sub="Currently active"    icon={CheckCircle2}  accent={SUCCESS} />
        <StatCard label="On Leave"     value={String(STAFF_FULL.filter(s=>s.status==="On Leave").length)}          sub="Approved leave"      icon={CalendarCheck} accent={WARNING} />
        <StatCard label="Departments"  value={String(new Set(STAFF_FULL.map(s=>s.dept)).size)}                     sub="Active departments"  icon={Building2}     accent={TEAL}    />
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, role, or ID…" className="pl-7 pr-3 py-2 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
        <div className="flex gap-1.5 flex-wrap">
          {depts.map(d=><button key={d} onClick={()=>setDept(d)} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold" style={{ borderColor:dept===d?PRIMARY:BORDER, backgroundColor:dept===d?PRIMARY:"white", color:dept===d?"white":MUTED }}>{d}</button>)}
        </div>
        <div className="flex gap-1 ml-auto">
          {["All","Active","On Leave","Inactive"].map(s=><button key={s} onClick={()=>setStatusF(s)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor:statusF===s?TEAL:"white", color:statusF===s?"white":MUTED, borderColor:statusF===s?TEAL:BORDER }}>{s}</button>)}
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: BORDER }}>
          <button onClick={()=>setView("card")} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor:view==="card"?PRIMARY:"transparent", color:view==="card"?"white":MUTED }}>Cards</button>
          <button onClick={()=>setView("table")} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor:view==="table"?PRIMARY:"transparent", color:view==="table"?"white":MUTED }}>Table</button>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon={Users} message="No staff match your filters." /> : view==="card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s,i) => {
            const dc = deptColors[s.dept] ?? PRIMARY;
            return (
              <div key={s.id} onClick={() => nav && nav("staff-profile", s.name)} className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all" style={{ borderColor: BORDER, opacity: s.status==="Inactive"?0.65:1 }}>
                <div className="h-14 relative flex-shrink-0" style={{ backgroundColor: dc+"14", borderBottom:`2px solid ${dc}` }}>
                  <div className="absolute top-2 right-2"><Badge label={s.status} colors={stColors[s.status]} /></div>
                </div>
                <div className="px-4 pt-0 pb-4">
                  <div className="-mt-5 mb-3"><Av gender={s.gender} size={44} /></div>
                  <div className="font-semibold text-sm leading-tight mb-0.5" style={{ color: TEXT }}>{s.name}</div>
                  <div className="text-xs mb-1" style={{ color: MUTED }}>{s.role}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: dc+"18", color: dc }}>{s.dept}</span>
                  <div className="mt-3 space-y-1 text-xs" style={{ color: MUTED }}>
                    <div style={{ fontFamily: mono }}>{s.id} · {s.empType}</div>
                    <div>{s.shift}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={e=>{ e.stopPropagation(); nav&&nav("staff-profile",s.name); }} className="flex-1 text-xs py-1.5 rounded-lg border font-semibold" style={{ color: PRIMARY, borderColor: BORDER }}>Profile</button>
                    <button onClick={e=>{ e.stopPropagation(); add({ type:"info", title:`Invite sent — ${s.email}` }); }} className="flex-1 text-xs py-1.5 rounded-lg text-white font-semibold" style={{ backgroundColor: PRIMARY }}>Invite</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["ID","Name","Role","Dept","Type","Hire Date","Shift","Status",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((s,i) => {
                const dc = deptColors[s.dept]??PRIMARY;
                return (
                  <tr key={s.id} onClick={()=>nav&&nav("staff-profile",s.name)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, opacity:s.status==="Inactive"?0.65:1 }}>
                    <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{s.id}</td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><Av gender={s.gender} size={28} /><span className="text-sm font-medium" style={{ color: TEXT }}>{s.name}</span></div></td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.role}</td>
                    <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor:dc+"18",color:dc }}>{s.dept}</span></td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.empType}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.hireDate}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{s.shift}</td>
                    <td className="px-3 py-3"><Badge label={s.status} colors={stColors[s.status]} /></td>
                    <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={()=>add({type:"info",title:`Invite sent — ${s.name}`})} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Invite</button>
                        {s.status==="Active"&&<button onClick={()=>add({type:"warning",title:`${s.name} deactivated`})} className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor:`${ERROR}30` }}>Deactivate</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function DailySummary({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type DayStatus = "Open" | "Closed" | "Reopened";
  const [dayStatus, setDayStatus] = useState<DayStatus>("Open");
  const [showClose, setShowClose] = useState(false);
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopenPin, setReopenPin] = useState("");
  const [closedBy, setClosedBy] = useState("");
  const [closedAt, setClosedAt] = useState("");

  const BDATE = "14 Oct 2025";
  const cats = [
    { cat: "Room Revenue",    amount: 825000,  tax: 61875,  txn: 15, prev: 714000 },
    { cat: "Restaurant & Bar",amount: 225000,  tax: 42188,  txn: 42, prev: 198000 },
    { cat: "Laundry",         amount: 18000,   tax: 1350,   txn: 6,  prev: 21000  },
    { cat: "Minibar",         amount: 24000,   tax: 1800,   txn: 18, prev: 19500  },
    { cat: "Events",          amount: 155800,  tax: 11685,  txn: 2,  prev: 0      },
  ];
  const payments = [
    { method: "Cash",           amount: 580000, icon: DollarSign },
    { method: "POS / Card",     amount: 420000, icon: CreditCard },
    { method: "Bank Transfer",  amount: 247800, icon: ArrowUpFromLine },
  ];
  const total    = cats.reduce((s,c)=>s+c.amount,0);
  const totalTax = cats.reduce((s,c)=>s+c.tax,0);
  const prevTotal= cats.reduce((s,c)=>s+c.prev,0);
  const variance = total - prevTotal;
  const lastWk   = 1043200;

  const occupancyStats = { occupied: 15, available: 20, occ: 75, adr: 55000, revpar: 41250, arrivals: 8, departures: 5, noShows: 1 };

  const statusColors: Record<DayStatus,{bg:string;border:string;text:string}> = {
    Open:     { bg: "#DBEAFE", border: "#BFDBFE", text: "#1E40AF" },
    Closed:   { bg: "#DCFCE7", border: "#BBF7D0", text: "#166534" },
    Reopened: { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
  };

  const sc = statusColors[dayStatus];

  return (
    <div>
      <PageHeader title="Daily Summary" sub={`${BDATE} · Grand Palms Hotel, Abuja`} actions={
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {dayStatus === "Closed" && <Lock size={12} />}{dayStatus}
            {closedBy && <span className="opacity-70"> · {closedBy}</span>}
          </div>
          {dayStatus === "Open" && <BtnP label="Close Day" icon={Lock} onClick={() => setShowClose(true)} />}
          {dayStatus === "Closed" && <button onClick={() => setShowReopen(true)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ color: MUTED, borderColor: BORDER }}>Reopen (Auth)</button>}
          {dayStatus === "Reopened" && <BtnP label="Re-close Day" icon={Lock} onClick={() => setShowClose(true)} />}
          <BtnO label="Export" icon={Download} onClick={() => add({ type: "info", title: "Exporting daily summary PDF" })} />
        </div>
      } />

      {dayStatus !== "Open" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-medium" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
          <Lock size={14} />{dayStatus === "Closed" ? `Day closed at ${closedAt} by ${closedBy}` : `Day reopened — ${reopenReason}`}
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Revenue" value={fmtN(total)} sub={`Tax excl. · ${cats.reduce((s,c)=>s+c.txn,0)} txns`} icon={TrendingUp} accent={SUCCESS} delta={`${variance>=0?"+":""}${fmtN(variance)} vs yesterday`} deltaPositive={variance>=0} />
        <StatCard label="Tax Collected" value={fmtN(totalTax)} sub="VAT + service charge" icon={DollarSign} accent={TEAL} />
        <StatCard label="Discounts / Comp" value="₦45,000" sub="6 manager approvals" icon={TrendingDown} accent={WARNING} />
        <StatCard label="Outstanding" value="₦284,500" sub="3 open folios" icon={AlertTriangle} accent={ERROR} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Revenue by category */}
        <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Revenue by Category — Tax Breakdown</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: SUBTLE }}>
              <span>vs Yesterday: <span className="font-semibold" style={{ color: variance>=0?SUCCESS:ERROR }}>{variance>=0?"+":""}{fmtN(variance)}</span></span>
              <span>vs Same Day Last Wk: <span className="font-semibold" style={{ color: total>=lastWk?SUCCESS:ERROR }}>{fmtN(total-lastWk)}</span></span>
            </div>
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Category","Revenue","Tax","# Txns","vs Yesterday",""].map((h,i)=><th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {cats.map(c => {
                const diff = c.amount - c.prev;
                const pct = c.prev > 0 ? Math.round((diff/c.prev)*100) : null;
                return (
                  <tr key={c.cat} className="border-t" style={{ borderColor: BORDER }}>
                    <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{c.cat}</td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(c.amount)}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{c.tax.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm" style={{ color: MUTED }}>{c.txn}</td>
                    <td className="px-3 py-3">
                      {pct !== null && <span className="text-xs font-semibold" style={{ color: diff>=0?SUCCESS:ERROR }}>{diff>=0?"+":""}{pct}%</span>}
                      {pct === null && <span className="text-xs" style={{ color: SUBTLE }}>—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                        <div className="h-full rounded-full" style={{ width: `${(c.amount/total)*100}%`, backgroundColor: PRIMARY }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT }}>Total</td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(total)}</td>
                <td className="px-3 py-3 text-xs font-bold" style={{ color: MUTED, fontFamily: mono }}>₦{totalTax.toLocaleString()}</td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: MUTED }}>{cats.reduce((s,c)=>s+c.txn,0)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Occupancy */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Occupancy</h3>
            <div className="grid grid-cols-2 gap-2">
              {[["Occupied", occupancyStats.occupied], ["Available", occupancyStats.available], ["ADR", `₦${occupancyStats.adr.toLocaleString()}`], ["RevPAR", `₦${occupancyStats.revpar.toLocaleString()}`]].map(([k,v])=>(
                <div key={String(k)} className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                  <div className="text-xs" style={{ color: MUTED }}>{k}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: TEXT }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs flex gap-4" style={{ color: MUTED }}>
              <span>Arrivals <span className="font-semibold" style={{ color: TEXT }}>{occupancyStats.arrivals}</span></span>
              <span>Departures <span className="font-semibold" style={{ color: TEXT }}>{occupancyStats.departures}</span></span>
              <span>No-shows <span className="font-semibold" style={{ color: ERROR }}>{occupancyStats.noShows}</span></span>
            </div>
          </div>
          {/* Payments by method */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Payments by Method</h3>
            {payments.map(p => (
              <div key={p.method} className="flex items-center gap-2.5 mb-2.5">
                <p.icon size={14} style={{ color: MUTED }} />
                <span className="text-sm flex-1" style={{ color: MUTED }}>{p.method}</span>
                <span className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{fmtN(p.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-2.5 mt-1.5 flex justify-between text-sm font-bold" style={{ borderColor: BORDER }}>
              <span style={{ color: TEXT }}>Total</span>
              <span style={{ color: PRIMARY, fontFamily: mono }}>{fmtN(payments.reduce((s,p)=>s+p.amount,0))}</span>
            </div>
          </div>
          {/* Complimentary/Discounts */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Comp &amp; Discounts</h3>
            {[{ desc: "VIP comp — Suite 501", amt: 25000, by: "Tunde A." },{ desc: "Loyalty discount — Room 202", amt: 12000, by: "Grace M." },{ desc: "Rate adjustment — Room 311", amt: 8000, by: "Nkechi O." }].map((d,i)=>(
              <div key={i} className="flex items-start justify-between gap-2 mb-2">
                <div><div className="text-xs font-medium" style={{ color: TEXT }}>{d.desc}</div><div className="text-xs" style={{ color: SUBTLE }}>{d.by}</div></div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: ORANGE, fontFamily: mono }}>₦{d.amt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Close day modal */}
      {showClose && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowClose(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-2" style={{ color: TEXT }}>Close Business Day</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Closing <strong>{BDATE}</strong>. This will freeze revenue figures. Run Night Audit first to ensure all charges are posted.</p>
            <div className="px-3 py-2.5 rounded-xl text-xs mb-4" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>Ensure Night Audit has run successfully before closing the day.</div>
            <div className="flex gap-3"><BtnO label="Cancel" onClick={() => setShowClose(false)} /><button onClick={() => { const now = new Date(); setClosedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`); setClosedBy("Grace Mensah"); setDayStatus("Closed"); setShowClose(false); add({ type: "success", title: `Day closed — ${BDATE}`, body: "Revenue frozen. Night audit reference created." }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Close Day</button></div>
          </div>
        </>
      )}

      {/* Reopen modal */}
      {showReopen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowReopen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Reopen Business Day</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>This action is audited and requires manager authorisation.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason for Reopening</label><textarea value={reopenReason} onChange={e=>setReopenReason(e.target.value)} rows={2} placeholder="State the reason…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" maxLength={4} value={reopenPin} onChange={e=>setReopenPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowReopen(false)} /><button onClick={() => { if (reopenPin !== "1234" || !reopenReason.trim()) { add({ type: "error", title: "Invalid PIN or missing reason" }); return; } setDayStatus("Reopened"); setShowReopen(false); add({ type: "warning", title: `Day reopened — ${BDATE}`, body: reopenReason }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ORANGE }}>Reopen Day</button></div>
          </div>
        </>
      )}
    </div>
  );
}


export function StockDashboard({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const PRODUCTS_SD = [
    { sku:"LIN-001", name:"Bath Towels",         cat:"Linen",      par:200, current:148, reorder:80,  reorderQty:100, cost:2800, perishable:false, expiry:"",         unit:"pcs",  fast:true  },
    { sku:"TOI-001", name:"Shower Gel 300ml",    cat:"Toiletries", par:500, current:62,  reorder:100, reorderQty:200, cost:450,  perishable:true,  expiry:"18 Oct",   unit:"btl",  fast:true  },
    { sku:"TOI-002", name:"Shampoo 250ml",       cat:"Toiletries", par:500, current:78,  reorder:100, reorderQty:200, cost:380,  perishable:true,  expiry:"02 Nov",   unit:"btl",  fast:true  },
    { sku:"FB-001",  name:"Mineral Water 50cl",  cat:"F&B",        par:1000,current:240, reorder:300, reorderQty:500, cost:120,  perishable:true,  expiry:"Dec 2025", unit:"btl",  fast:true  },
    { sku:"FB-002",  name:"Eggs (Crate)",        cat:"F&B",        par:80,  current:22,  reorder:25,  reorderQty:40,  cost:3800, perishable:true,  expiry:"18 Oct",   unit:"crate",fast:true  },
    { sku:"CLN-001", name:"Floor Cleaner 5L",    cat:"Cleaning",   par:60,  current:18,  reorder:20,  reorderQty:30,  cost:2200, perishable:false, expiry:"",         unit:"jrn",  fast:false },
    { sku:"CLN-002", name:"Disinfectant Spray",  cat:"Cleaning",   par:100, current:45,  reorder:30,  reorderQty:50,  cost:1800, perishable:false, expiry:"",         unit:"btl",  fast:false },
    { sku:"KIT-001", name:"Cooking Gas (12.5kg)",cat:"Kitchen",    par:12,  current:3,   reorder:4,   reorderQty:6,   cost:12500,perishable:false, expiry:"",         unit:"cyl",  fast:true  },
    { sku:"LIN-002", name:"Bed Sheets (King)",   cat:"Linen",      par:120, current:88,  reorder:50,  reorderQty:60,  cost:4500, perishable:false, expiry:"",         unit:"sets", fast:false },
    { sku:"KIT-002", name:"Palm Oil (25L)",      cat:"Kitchen",    par:20,  current:14,  reorder:6,   reorderQty:10,  cost:42000,perishable:true,  expiry:"Mar 2026", unit:"drum", fast:true  },
  ];
  const SD_MOVEMENTS = [
    { date:"14 Oct 14:22", item:"Bath Towels",         type:"Issue",      qty:-12, ref:"HK-TASK-0441", by:"Ada Okonkwo"  },
    { date:"14 Oct 13:05", item:"Mineral Water 50cl",  type:"Receipt",    qty:500, ref:"PO-0451",      by:"Store Mgr"    },
    { date:"14 Oct 11:30", item:"Eggs (Crate)",        type:"Issue",      qty:-5,  ref:"KITCHEN-DAILY", by:"Chef Emeka"  },
    { date:"14 Oct 09:15", item:"Floor Cleaner 5L",    type:"Adjustment", qty:-2,  ref:"BREAKAGE-ADJ", by:"Mgr. Bello"  },
    { date:"13 Oct 22:00", item:"Shower Gel 300ml",    type:"Issue",      qty:-24, ref:"HK-SHIFT-PM",  by:"HK Supervisor"},
    { date:"13 Oct 16:40", item:"Cooking Gas (12.5kg)",type:"Receipt",    qty:6,   ref:"PO-0448",      by:"Store Mgr"    },
  ];
  const CAT_COLORS = [PRIMARY, TEAL, ORANGE, SUCCESS, "#6366F1"];
  const cats = ["Linen","Toiletries","F&B","Cleaning","Kitchen"];
  const CAT_VALS = cats.map(cat=>({ name:cat, value:PRODUCTS_SD.filter(p=>p.cat===cat).reduce((s,p)=>s+p.current*p.cost,0) }));
  const pending  = PRODUCTS_SD.filter(p=>p.current<=p.reorder);
  const expiring = PRODUCTS_SD.filter(p=>p.perishable&&p.expiry&&!p.expiry.includes("2026")&&!p.expiry.includes("Nov")&&!p.expiry.includes("Dec"));
  const totalVal = PRODUCTS_SD.reduce((s,p)=>s+p.current*p.cost,0);
  const typeColor: Record<string,{bg:string;text:string}> = { Receipt:{bg:"#DCFCE7",text:"#166534"}, Issue:{bg:"#FEF3C7",text:"#92400E"}, Adjustment:{bg:"#EDE9FE",text:"#5B21B6"} };
  const critical = PRODUCTS_SD.filter(i => i.current === 0);
  return (
    <div>
      <PageHeader title="Stock Dashboard" sub="Live inventory overview · Grand Palms Hotel, Abuja" actions={
        <div className="flex gap-2">
          <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting inventory report" })} />
          <BtnP label="Log Transaction" icon={Plus} onClick={() => add({ type:"info", title:"New stock transaction" })} />
        </div>
      } />
      {pending.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA" }}>
          <AlertTriangle size={15} style={{ color: ERROR, flexShrink:0 }} />
          <div className="flex-1 text-sm" style={{ color: ERROR }}><span className="font-semibold">{pending.length} items at or below reorder point</span><span className="ml-2 font-normal text-xs" style={{ color:"#991B1B" }}>{pending.map(p=>p.name).join(" · ")}</span></div>
          <button onClick={() => add({ type:"info", title:"Creating reorder POs" })} className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white flex-shrink-0" style={{ backgroundColor: ERROR }}>Create Reorder POs</button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard label="Total Stock Value"   value={`₦${(totalVal/1000).toFixed(0)}K`}  sub="Current on-hand value"        icon={DollarSign}    accent={SUCCESS}  />
        <StatCard label="Below Reorder"       value={String(pending.length)}               sub="Need replenishment now"       icon={AlertTriangle} accent={ERROR}    />
        <StatCard label="Out of Stock"        value={String(critical.length)}              sub="Zero on-hand"                 icon={XCircle}       accent={ERROR}    />
        <StatCard label="Expiring Soon"       value={String(expiring.length)}              sub="Within 7 days"                icon={Clock}         accent={WARNING}  />
        <StatCard label="Pending POs"         value="3"                                    sub="Awaiting delivery"            icon={Truck}         accent={TEAL}     />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Reorder Suggestions</h3>
            <span className="text-xs" style={{ color: MUTED }}>{pending.length} items</span>
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Item","Cat","On Hand","Reorder Pt","Suggest Qty","Est. Cost",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {pending.map(p => {
                const pct   = Math.round((p.current/p.par)*100);
                const col   = p.current===0?ERROR:p.current<=p.reorder?WARNING:SUCCESS;
                return (
                  <tr key={p.sku} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{p.name}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{p.sku}</div></td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{p.cat}</td>
                    <td className="px-4 py-3"><div className="text-sm font-bold" style={{ color: col }}>{p.current} <span className="text-xs font-normal" style={{ color: SUBTLE }}>{p.unit}</span></div><div className="mt-1 h-1.5 w-20 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(pct,100)}%`, backgroundColor: col }} /></div></td>
                    <td className="px-4 py-3 text-sm" style={{ color: MUTED, fontFamily: mono }}>{p.reorder}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>{p.reorderQty} {p.unit}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{(p.reorderQty*p.cost).toLocaleString()}</td>
                    <td className="px-4 py-3"><button onClick={() => add({ type:"info", title:`PO draft — ${p.name}` })} className="text-xs px-2.5 py-1.5 rounded border font-semibold whitespace-nowrap" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Draft PO</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Value by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CAT_VALS} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={40}>
                {CAT_VALS.map((_,i) => <Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v:any) => [`₦${Number(v).toLocaleString()}`]} contentStyle={{ border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CAT_VALS.map((c,i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_COLORS[i%CAT_COLORS.length] }} />
                <span className="flex-1" style={{ color: MUTED }}>{c.name}</span>
                <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>₦{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Recent Movements</h3>
            <span className="text-xs" style={{ color: MUTED }}>Last 24h</span>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {SD_MOVEMENTS.map((m,i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F8FAFC]">
                <span className="text-xs px-2 py-0.5 rounded font-semibold mt-0.5 whitespace-nowrap" style={{ backgroundColor: typeColor[m.type]?.bg||"#F4F4F5", color: typeColor[m.type]?.text||TEXT }}>{m.type}</span>
                <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate" style={{ color: TEXT }}>{m.item}</div><div className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{m.ref} · {m.by}</div></div>
                <div className="text-right flex-shrink-0"><div className="text-sm font-bold" style={{ color: m.qty<0?ERROR:SUCCESS, fontFamily: mono }}>{m.qty>0?"+":""}{m.qty}</div><div className="text-xs" style={{ color: SUBTLE }}>{m.date.split(" ")[1]}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Fast / Slow Movers</h3>
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SUCCESS }}>Fast Movers</div>
            {PRODUCTS_SD.filter(p=>p.fast).slice(0,4).map(p => (
              <div key={p.sku} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 text-xs" style={{ color: TEXT }}>{p.name}</div>
                <div className="h-2 w-24 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(Math.round((p.current/p.par)*100),100)}%`, backgroundColor: SUCCESS }} /></div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: MUTED, fontFamily: mono }}>{Math.round((p.current/p.par)*100)}%</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SUBTLE }}>Slow Movers</div>
            {PRODUCTS_SD.filter(p=>!p.fast).slice(0,3).map(p => (
              <div key={p.sku} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 text-xs" style={{ color: TEXT }}>{p.name}</div>
                <div className="h-2 w-24 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${Math.min(Math.round((p.current/p.par)*100),100)}%`, backgroundColor: SUBTLE }} /></div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: MUTED, fontFamily: mono }}>{Math.round((p.current/p.par)*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export function RoomTypeManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type RT = { code:string; name:string; count:number; available:number; maxOcc:number; beds:string; size:string; amenities:string[]; base:number; description:string; order:number };

  const INIT: RT[] = [
    { code:"STD", name:"Standard Room", count:10, available:6, maxOcc:2, beds:"1 King or 2 Twin", size:"28 m²",
      amenities:["Air Conditioning","Free Wi-Fi","Flat-screen TV","Mini Fridge","Safe","Kettle","En-suite Shower"],
      base:35000, description:"Comfortable standard rooms ideal for business and leisure travellers.", order:1 },
    { code:"DLX", name:"Deluxe Room", count:8, available:4, maxOcc:3, beds:"1 King + Sofa Bed", size:"38 m²",
      amenities:["Air Conditioning","Free Wi-Fi","Smart TV","Minibar","In-room Safe","Work Desk","Bathtub + Shower","Premium Toiletries","Balcony"],
      base:55000, description:"Spacious deluxe rooms with balcony views and premium furnishings.", order:2 },
    { code:"STE", name:"Suite", count:4, available:2, maxOcc:4, beds:"1 King + Separate Lounge", size:"65 m²",
      amenities:["Air Conditioning","Free Wi-Fi","65\" Smart TV","Full Minibar","Butler Service","Kitchenette","Jacuzzi","Panoramic Balcony","Dining Area","VIP Amenity Kit"],
      base:95000, description:"Flagship suites with panoramic views, butler service, and luxury amenities.", order:3 },
  ];

  const [roomTypes,     setRoomTypes]     = useState<RT[]>(INIT);
  const [selected,      setSelected]      = useState<RT>(INIT[0]);
  const [showEdit,      setShowEdit]      = useState(false);
  const [showAddType,   setShowAddType]   = useState(false);
  const [showAmenity,   setShowAmenity]   = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showManage,    setShowManage]    = useState(false);
  const [editVals,   setEditVals]   = useState({ name:"", base:"", size:"", beds:"", maxOcc:"", description:"" });
  const [newType,    setNewType]    = useState({ code:"", name:"", base:"", size:"", beds:"", maxOcc:"2", description:"" });
  const [newAmenity, setNewAmenity] = useState("");
  /* swipe — right=delete, left=edit; swipe IS the action, no tap needed */
  const dragRef = useRef<{
    code: string; active: boolean;
    startX: number; baseX: number;
    lastX: number; lastT: number; vel: number;
  }>({ code:"", active:false, startX:0, baseX:0, lastX:0, lastT:0, vel:0 });
  const cardRefs  = useRef<Record<string, HTMLDivElement|null>>({});
  const deleteRef = useRef<Record<string, HTMLDivElement|null>>({});
  const editRef   = useRef<Record<string, HTMLDivElement|null>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ code: string; name: string } | null>(null);
  /* room assignments: roomId → rtCode (or "" = unassigned) */
  const initAssign = () => {
    const m: Record<string,string> = {};
    ROOMS.forEach(r => {
      m[r.id] = r.type==="Suite" ? "STE" : r.type==="Deluxe" ? "DLX" : r.type==="Standard" ? "STD" : "";
    });
    return m;
  };
  const [roomAssign, setRoomAssign] = useState<Record<string,string>>(initAssign);

  const PRESETS = ["Room Service","Daily Housekeeping","Parking","Airport Shuttle","Pool Access","Gym Access","Spa Access","Business Centre","Laundry Service","Pet Friendly","Connecting Rooms","Sea View","City View","Butler Service","Kitchenette"];

  const ANALYTICS: Record<string,{ revenue:number; nights:number; adr:number; revpar:number; occ:number[]; dRev:number; dOcc:number }> = {
    STD: { revenue:1890000, nights:54, adr:35000, revpar:21000, occ:[60,65,55,70,68,72,64], dRev:+8,  dOcc:+5  },
    DLX: { revenue:1760000, nights:32, adr:55000, revpar:35200, occ:[50,62,45,58,70,65,55], dRev:+12, dOcc:+7  },
    STE: { revenue:1330000, nights:14, adr:95000, revpar:47500, occ:[35,50,40,55,60,50,45], dRev:-3,  dOcc:-2  },
  };

  const tC = (code: string) => code==="STE" ? ORANGE : code==="DLX" ? TEAL : PRIMARY;

  /* mutate helpers — keep roomTypes array + selected in sync */
  const patchType = (code: string, patch: Partial<RT>) => {
    setRoomTypes(prev => prev.map(r => r.code===code ? {...r,...patch} : r));
    setSelected(prev => prev.code===code ? {...prev,...patch} : prev);
  };

  const openEdit = (rt: RT) => {
    setEditVals({ name:rt.name, base:String(rt.base), size:rt.size, beds:rt.beds, maxOcc:String(rt.maxOcc), description:rt.description });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editVals.name || !editVals.base) { add({ type:"warning", title:"Name and rate are required" }); return; }
    patchType(selected.code, { name:editVals.name, base:Number(editVals.base), size:editVals.size, beds:editVals.beds, maxOcc:Number(editVals.maxOcc)||selected.maxOcc, description:editVals.description });
    setShowEdit(false);
    add({ type:"success", title:"Room type updated", body:editVals.name });
  };

  const doAddAmenity = (a: string) => {
    const t = a.trim();
    if (!t) return;
    if (selected.amenities.includes(t)) { add({ type:"warning", title:"Already added", body:t }); return; }
    patchType(selected.code, { amenities:[...selected.amenities, t] });
    add({ type:"success", title:"Amenity added", body:t });
    setNewAmenity("");
  };

  const removeAmenity = (a: string) => {
    patchType(selected.code, { amenities: selected.amenities.filter(x=>x!==a) });
    add({ type:"info", title:"Amenity removed", body:a });
  };

  const saveNewType = () => {
    if (!newType.code || !newType.name || !newType.base) {
      add({ type:"warning", title:"Code, name and rate are required" }); return;
    }
    const code = newType.code.toUpperCase().slice(0,4);
    if (roomTypes.find(r=>r.code===code)) { add({ type:"warning", title:"Code already exists", body:code }); return; }
    const rt: RT = { code, name:newType.name, count:0, available:0, maxOcc:Number(newType.maxOcc)||2, beds:newType.beds||"1 King", size:newType.size||"30 m²", amenities:[], base:Number(newType.base), description:newType.description, order:roomTypes.length+1 };
    setRoomTypes(prev=>[...prev, rt]);
    setSelected(rt);
    setShowAddType(false);
    setNewType({ code:"", name:"", base:"", size:"", beds:"", maxOcc:"2", description:"" });
    add({ type:"success", title:"Room type created", body:rt.name });
  };

  const assignedRooms = (rt: RT) =>
    ROOMS.filter(r => roomAssign[r.id] === rt.code);

  /* ── Swipe: right = delete, left = edit ── */
  const REVEAL   = 110;
  const TRIGGER  = REVEAL * 0.45; // position threshold to fire action
  const SPRING   = "transform 0.36s cubic-bezier(0.34,1.56,0.64,1)";
  const EASE_OUT = "transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)";

  const snapTo = (code: string, targetX: number, useSpring = false) => {
    const el = cardRefs.current[code];
    if (!el) return;
    el.style.transition = useSpring ? SPRING : EASE_OUT;
    el.style.transform = `translateX(${targetX}px)`;
    setTimeout(() => { if (el) el.style.transition = ""; }, 420);
  };

  /* update the visual hint zone opacity directly (no re-render) */
  const setHintOpacity = (code: string, raw: number) => {
    const delEl = deleteRef.current[code];
    const edEl  = editRef.current[code];
    if (delEl) delEl.style.opacity = raw > 0  ? String(Math.min(1, raw / REVEAL)) : "0";
    if (edEl)  edEl.style.opacity  = raw < 0  ? String(Math.min(1, -raw / REVEAL)) : "0";
  };

  const deleteType = (code: string) => {
    const el = cardRefs.current[code];
    if (el) {
      el.style.transition = "transform 0.3s cubic-bezier(0.4,0,1,1), opacity 0.3s ease";
      el.style.transform = "translateX(110%)";
      el.style.opacity = "0";
    }
    setTimeout(() => {
      setRoomTypes(prev => {
        const next = prev.filter(r=>r.code!==code);
        if (selected.code===code) setSelected(next[0] ?? INIT[0]);
        return next;
      });
      add({ type:"info", title:"Room type deleted" });
    }, 320);
  };

  const onPtrDown = (e: React.PointerEvent, code: string) => {
    const el = cardRefs.current[code];
    let baseX = 0;
    if (el) baseX = new DOMMatrix(getComputedStyle(el).transform).m41;
    const now = performance.now();
    dragRef.current = { code, active:true, startX:e.clientX, baseX, lastX:e.clientX, lastT:now, vel:0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPtrMove = (e: React.PointerEvent, code: string) => {
    const d = dragRef.current;
    if (!d.active || d.code !== code) return;
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.vel = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX; d.lastT = now;
    const raw = d.baseX + (e.clientX - d.startX);
    const rubber = raw > REVEAL
      ? REVEAL  + Math.pow(raw - REVEAL, 0.65)
      : raw < -REVEAL
      ? -REVEAL - Math.pow(-raw - REVEAL, 0.65)
      : raw;
    const el = cardRefs.current[code];
    if (el) el.style.transform = `translateX(${rubber}px)`;
    setHintOpacity(code, raw);
  };

  const onPtrUp = (rt: RT) => {
    const d = dragRef.current;
    if (!d.active || d.code !== rt.code) return;
    d.active = false;
    const el = cardRefs.current[rt.code];
    if (!el) return;
    const curX = new DOMMatrix(getComputedStyle(el).transform).m41;
    const goDelete = d.vel >  0.45 || (Math.abs(d.vel) < 0.35 && curX >  TRIGGER);
    const goEdit   = d.vel < -0.45 || (Math.abs(d.vel) < 0.35 && curX < -TRIGGER);
    setHintOpacity(rt.code, 0);
    if (goDelete) {
      snapTo(rt.code, 0, false);
      setTimeout(() => setConfirmDelete({ code: rt.code, name: rt.name }), 180);
    } else if (goEdit) {
      snapTo(rt.code, 0);
      setTimeout(() => openEdit(rt), 260);
    } else {
      snapTo(rt.code, 0, false);
    }
  };

  const ModalShell = ({ title, sub, onClose, children, wide }: { title:string; sub:string; onClose:()=>void; children:React.ReactNode; wide?:boolean }) => (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full overflow-hidden" style={{ maxWidth: wide ? 560 : 480, border:`1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor:`${tC(selected.code)}15` }}>
              <BedDouble size={15} style={{ color: tC(selected.code) }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: TEXT }}>{title}</p>
              <p className="text-xs" style={{ color: MUTED }}>{sub}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"><X size={14} style={{ color: MUTED }} /></button>
        </div>
        {children}
      </div>
    </>
  );

  return (
    <div>
      <PageHeader title="Room Types" sub="Configure room categories, inventory, amenities and assignments"
        actions={<BtnP label="Add Room Type" icon={Plus} onClick={()=>setShowAddType(true)} />} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Room Types"  value={String(roomTypes.length)}  sub="Configured categories" icon={BedDouble}    accent={PRIMARY} />
        <StatCard label="Total Rooms" value={String(roomTypes.reduce((s,t)=>s+t.count,0))}     sub="All inventory"     icon={BedDouble}    accent={TEAL}    />
        <StatCard label="Available"   value={String(roomTypes.reduce((s,t)=>s+t.available,0))} sub="Ready to sell"     icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Avg Rate"    value={roomTypes.length ? `₦${Math.round(roomTypes.reduce((s,t)=>s+t.base,0)/roomTypes.length).toLocaleString()}` : "—"} sub="Base rate / night" icon={DollarSign} accent={ORANGE} />
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Room type cards ── */}
        <div className="flex-1 space-y-3">

          {/* Swipe legend */}
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: ERROR, opacity: 0.7 }}>
              <ChevronRight size={12}/><Trash2 size={11}/><span>Swipe right to delete</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: MUTED, opacity: 0.7 }}>
              <span>Swipe left to edit</span><Edit3 size={11}/><ChevronLeft size={12}/>
            </div>
          </div>

          {roomTypes.map(rt => {
            const color  = tC(rt.code);
            const isSel  = selected.code === rt.code;
            const occPct = rt.count ? Math.round(((rt.count-rt.available)/rt.count)*100) : 0;
            const avPct  = rt.count ? Math.round((rt.available/rt.count)*100) : 0;
            return (
              <div key={rt.code} className="relative rounded-xl overflow-hidden select-none"
                style={{ border:`2px solid ${isSel ? color : BORDER}` }}
                onClick={()=>setSelected(rt)}>

                {/* ── LEFT: DELETE zone (visual only, revealed on swipe right) ── */}
                <div ref={el=>{ deleteRef.current[rt.code]=el; }}
                  className="absolute inset-y-0 left-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none"
                  style={{ width: REVEAL, backgroundColor:`${ERROR}14`, opacity:0 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor:`${ERROR}25` }}>
                    <Trash2 size={19} style={{ color: ERROR }}/>
                  </div>
                  <span className="text-xs font-bold" style={{ color: ERROR }}>Delete</span>
                </div>

                {/* ── RIGHT: EDIT zone (visual only, revealed on swipe left) ── */}
                <div ref={el=>{ editRef.current[rt.code]=el; }}
                  className="absolute inset-y-0 right-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none"
                  style={{ width: REVEAL, backgroundColor:`${color}12`, opacity:0 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor:`${color}22` }}>
                    <Edit3 size={19} style={{ color }}/>
                  </div>
                  <span className="text-xs font-bold" style={{ color }}>Edit</span>
                </div>

                {/* ── Card content (draggable layer, always on top) ── */}
                <div ref={el=>{ cardRefs.current[rt.code]=el; }}
                  className="bg-white flex cursor-grab active:cursor-grabbing relative"
                  style={{ willChange:"transform", touchAction:"pan-y", zIndex:2 }}
                  onPointerDown={e=>onPtrDown(e, rt.code)}
                  onPointerMove={e=>onPtrMove(e, rt.code)}
                  onPointerUp={()=>onPtrUp(rt)}>

                  {/* Faint ghost edge hints on the card face */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none" style={{ opacity:0.14 }}>
                    <Trash2 size={13} style={{ color: ERROR }}/>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none" style={{ opacity:0.14 }}>
                    <Edit3 size={13} style={{ color }}/>
                  </div>

                  <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 px-5 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:`${color}15` }}>
                          <BedDouble size={20} style={{ color }} />
                        </div>
                        <div>
                          <p className="text-base font-bold leading-tight" style={{ color: TEXT }}>{rt.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: MUTED }}>{rt.beds} · {rt.size} · Max {rt.maxOcc} pax</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-black leading-none" style={{ color, fontFamily: mono }}>{rt.available}<span className="text-sm font-normal" style={{ color: MUTED }}>/{rt.count}</span></p>
                        <p className="text-xs mt-0.5" style={{ color: rt.available>2 ? SUCCESS : ORANGE }}>{rt.available>2 ? "Good availability" : "Low availability"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-2xl font-black" style={{ color, fontFamily: mono }}>₦{rt.base.toLocaleString()}<span className="text-xs font-normal" style={{ color: MUTED }}>/night</span></p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
                        <span style={{ color: occPct>=70 ? ERROR : SUCCESS, fontWeight:600 }}>{occPct}% occupied</span>
                        <span>·</span><span>{avPct}% free</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ backgroundColor:"#E2E8F0" }}>
                      <div className="h-2 rounded-full" style={{ width:`${avPct}%`, backgroundColor: rt.available>2 ? SUCCESS : ORANGE }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rt.amenities.slice(0,5).map(a=>(
                        <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:`${color}10`, color }}>{a}</span>
                      ))}
                      {rt.amenities.length>5 && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>+{rt.amenities.length-5} more</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {roomTypes.length === 0 && (
            <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BORDER }}>
              <BedDouble size={32} style={{ color: SUBTLE, margin:"0 auto 12px" }} />
              <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>No room types yet</p>
              <p className="text-xs mb-4" style={{ color: MUTED }}>Click "Add Room Type" to get started</p>
              <BtnP label="Add Room Type" icon={Plus} onClick={()=>setShowAddType(true)} />
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Hero card */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="px-5 py-5" style={{ backgroundColor:`${tC(selected.code)}08` }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tC(selected.code) }}>
                  <BedDouble size={24} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-black" style={{ color: TEXT }}>{selected.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: tC(selected.code) }}>{selected.code}</span>
                  </div>
                  <p className="text-2xl font-black" style={{ color: tC(selected.code), fontFamily: mono }}>₦{selected.base.toLocaleString()}<span className="text-xs font-normal" style={{ color: MUTED }}>/night</span></p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{selected.description || "No description set."}</p>
            </div>
            <div className="flex border-t" style={{ borderColor: BORDER }}>
              {([
                { label:"Edit",      icon:Edit3,    fn:()=>openEdit(selected)      },
                { label:"Amenities", icon:Plus,     fn:()=>setShowAmenity(true)    },
                { label:"Analytics", icon:BarChart3, fn:()=>setShowAnalytics(true) },
              ] as {label:string;icon:React.ElementType;fn:()=>void}[]).map((a,i,arr)=>(
                <button key={a.label} onClick={a.fn}
                  className="flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
                  style={{ color: tC(selected.code), borderRight: i<arr.length-1 ? `1px solid ${BORDER}` : undefined }}>
                  <a.icon size={12}/>{a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specs grid */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Specifications</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["Rooms",       `${selected.available} / ${selected.count}`],
                ["Room Size",   selected.size],
                ["Bed Config",  selected.beds],
                ["Max Guests",  `${selected.maxOcc} pax`],
                ["Rank",        `#${selected.order}`],
                ["Occupancy",   selected.count ? `${Math.round(((selected.count-selected.available)/selected.count)*100)}%` : "—"],
              ] as [string,string][]).map(([k,v])=>(
                <div key={k} className="p-3 rounded-xl" style={{ backgroundColor:"#F8FAFC" }}>
                  <p className="text-xs mb-0.5" style={{ color: MUTED }}>{k}</p>
                  <p className="text-sm font-bold" style={{ color: TEXT }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Amenities ({selected.amenities.length})</h3>
              <button onClick={()=>setShowAmenity(true)} className="text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border" style={{ color: tC(selected.code), borderColor:`${tC(selected.code)}30` }}>
                <Plus size={10}/>Add
              </button>
            </div>
            {selected.amenities.length === 0
              ? <p className="text-xs" style={{ color: SUBTLE }}>No amenities added yet.</p>
              : <div className="flex flex-wrap gap-1.5">
                  {selected.amenities.map(a=>(
                    <span key={a} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 group cursor-pointer" style={{ backgroundColor:"#F0FDF4", color:SUCCESS }}>
                      <CheckCircle2 size={9}/>{a}
                      <button onClick={e=>{e.stopPropagation();removeAmenity(a);}} className="opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5">
                        <X size={9} style={{ color: ERROR }} />
                      </button>
                    </span>
                  ))}
                </div>
            }
          </div>

          {/* Assigned rooms */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Assigned Rooms</h3>
              <button onClick={()=>setShowManage(true)} className="text-xs font-semibold px-2.5 py-1 rounded-lg border" style={{ color: tC(selected.code), borderColor:`${tC(selected.code)}30` }}>Manage</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {assignedRooms(selected).map(r=>(
                <div key={r.id} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: r.status==="Available" ? SUCCESS : r.status==="Occupied" ? ORANGE : MUTED }}>{r.id}</div>
              ))}
              {assignedRooms(selected).length===0 && <p className="text-xs" style={{ color: SUBTLE }}>No rooms assigned.</p>}
            </div>
            {assignedRooms(selected).length > 0 && (
              <div className="mt-3 flex gap-3 text-xs" style={{ color: MUTED }}>
                {([{c:SUCCESS,l:"Available"},{c:ORANGE,l:"Occupied"},{c:MUTED,l:"Other"}] as {c:string;l:string}[]).map(b=>(
                  <span key={b.l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor:b.c }}/>{b.l}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ MANAGE ROOMS MODAL ══ */}
      {showManage && (
        <ModalShell title={`Assign Rooms — ${selected.name}`} sub={`${assignedRooms(selected).length} rooms currently assigned`} onClose={()=>setShowManage(false)} wide>
          <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
            <p className="text-xs mb-4" style={{ color: MUTED }}>Click any room to toggle its assignment to <strong style={{ color: tC(selected.code) }}>{selected.name}</strong>. A room can only belong to one type.</p>
            {/* Group by floor */}
            {[1,2,3].map(floor => {
              const floorRooms = ROOMS.filter(r=>r.floor===floor);
              return (
                <div key={floor} className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Floor {floor}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {floorRooms.map(r=>{
                      const isAssigned = roomAssign[r.id] === selected.code;
                      const otherType  = roomTypes.find(t=>t.code===roomAssign[r.id] && t.code!==selected.code);
                      const roomColor  = isAssigned ? tC(selected.code) : otherType ? tC(otherType.code) : SUBTLE;
                      return (
                        <button key={r.id}
                          onClick={()=>{
                            setRoomAssign(prev=>{
                              const next = {...prev};
                              if (isAssigned) { next[r.id]=""; }
                              else { next[r.id]=selected.code; }
                              return next;
                            });
                          }}
                          className="p-3 rounded-xl border-2 text-center transition-all hover:scale-105"
                          style={{ borderColor: isAssigned ? tC(selected.code) : BORDER, backgroundColor: isAssigned ? `${tC(selected.code)}10` : "#F8FAFC" }}>
                          <p className="text-sm font-black" style={{ color: roomColor, fontFamily: mono }}>{r.id}</p>
                          <p className="text-xs mt-0.5 font-semibold" style={{ color: isAssigned ? tC(selected.code) : otherType ? tC(otherType.code) : SUBTLE }}>
                            {isAssigned ? selected.code : otherType ? otherType.code : "—"}
                          </p>
                          <div className="mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.status==="Available" ? SUCCESS : r.status==="Occupied" ? ORANGE : r.status==="Reserved" ? TEAL : MUTED }} />
                          <p className="text-xs mt-0.5" style={{ color: SUBTLE }}>{r.status}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 text-xs mt-2" style={{ color: MUTED }}>
              {([{c:SUCCESS,l:"Available"},{c:ORANGE,l:"Occupied"},{c:TEAL,l:"Reserved"},{c:MUTED,l:"Other"}] as {c:string;l:string}[]).map(b=>(
                <span key={b.l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor:b.c }}/>{b.l}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor:BORDER }}>
            <button onClick={()=>setShowManage(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color:MUTED, borderColor:BORDER }}>Cancel</button>
            <button onClick={()=>{ setShowManage(false); add({ type:"success", title:"Room assignments saved", body:`${assignedRooms(selected).length} rooms assigned to ${selected.name}` }); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: tC(selected.code) }}>
              Save Assignments
            </button>
          </div>
        </ModalShell>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor:"rgba(13,27,46,0.55)" }}
            onClick={()=>setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full overflow-hidden"
            style={{ maxWidth: 400, border:`1px solid ${BORDER}` }}>
            {/* Icon strip */}
            <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor:`${ERROR}12` }}>
                <Trash2 size={26} style={{ color: ERROR }}/>
              </div>
              <p className="text-base font-black mb-1.5" style={{ color: TEXT }}>Delete Room Type?</p>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                <strong style={{ color: TEXT }}>{confirmDelete.name}</strong> and all its configuration will be permanently removed. This cannot be undone.
              </p>
              {assignedRooms(roomTypes.find(r=>r.code===confirmDelete.code)!).length > 0 && (
                <div className="mt-4 flex items-start gap-2.5 text-left p-3 rounded-xl w-full"
                  style={{ backgroundColor:`${WARNING}10`, border:`1px solid ${WARNING}30` }}>
                  <AlertTriangle size={14} style={{ color: WARNING, flexShrink:0, marginTop:1 }}/>
                  <p className="text-xs" style={{ color: WARNING }}>
                    <strong>{assignedRooms(roomTypes.find(r=>r.code===confirmDelete.code)!).length} room{assignedRooms(roomTypes.find(r=>r.code===confirmDelete.code)!).length!==1?"s":""}</strong> are currently assigned to this type and will become unassigned.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={()=>setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ color: MUTED, borderColor: BORDER }}>
                Cancel
              </button>
              <button onClick={()=>{ const code=confirmDelete.code; setConfirmDelete(null); deleteType(code); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: ERROR }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══ EDIT MODAL ══ */}
      {showEdit && (
        <ModalShell title="Edit Room Type" sub={`${selected.name} · ${selected.code}`} onClose={()=>setShowEdit(false)} wide>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Display Name <span style={{ color:ERROR }}>*</span></label>
                <input value={editVals.name} onChange={e=>setEditVals(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Base Rate (₦/night) <span style={{ color:ERROR }}>*</span></label>
                <input type="number" value={editVals.base} onChange={e=>setEditVals(p=>({...p,base:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER, fontFamily:mono }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Max Occupancy</label>
                <select value={editVals.maxOcc} onChange={e=>setEditVals(p=>({...p,maxOcc:e.target.value}))} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
                  {["1","2","3","4","5","6","8","10"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Room Size</label>
                <input value={editVals.size} onChange={e=>setEditVals(p=>({...p,size:e.target.value}))} placeholder="e.g. 38 m²" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Bed Configuration</label>
                <input value={editVals.beds} onChange={e=>setEditVals(p=>({...p,beds:e.target.value}))} placeholder="e.g. 1 King + Sofa Bed" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Description</label>
                <textarea value={editVals.description} onChange={e=>setEditVals(p=>({...p,description:e.target.value}))} rows={3} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none" style={{ borderColor: BORDER }} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: BORDER }}>
            <button onClick={()=>setShowEdit(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ color:MUTED, borderColor:BORDER }}>Cancel</button>
            <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: tC(selected.code) }}>Save Changes</button>
          </div>
        </ModalShell>
      )}

      {/* ══ ADD ROOM TYPE MODAL ══ */}
      {showAddType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" style={{ border:`1.5px solid ${BORDER}` }}>
            {/* Header band */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: PRIMARY }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity:0.6 }}>Room Types</p>
                <p className="text-base font-bold text-white mt-0.5">Add Room Type</p>
              </div>
              <button onClick={()=>setShowAddType(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:"rgba(255,255,255,0.18)" }}>
                <X size={16} color="white" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Type Code <span style={{ color:ERROR }}>*</span></label>
                  <input value={newType.code} onChange={e=>setNewType(p=>({...p,code:e.target.value.toUpperCase().slice(0,4)}))} placeholder="e.g. PEN" maxLength={4}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white", fontFamily:mono, letterSpacing:"0.1em" }} />
                  <p className="text-xs mt-1" style={{ color:SUBTLE }}>Unique 2–4 char identifier</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Display Name <span style={{ color:ERROR }}>*</span></label>
                  <input value={newType.name} onChange={e=>setNewType(p=>({...p,name:e.target.value}))} placeholder="e.g. Penthouse Suite"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Base Rate (₦/night) <span style={{ color:ERROR }}>*</span></label>
                  <input type="number" value={newType.base} onChange={e=>setNewType(p=>({...p,base:e.target.value}))} placeholder="120000"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white", fontFamily:mono }} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Max Occupancy</label>
                  <select value={newType.maxOcc} onChange={e=>setNewType(p=>({...p,maxOcc:e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}>
                    {["1","2","3","4","5","6","8","10"].map(v=><option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Room Size</label>
                  <input value={newType.size} onChange={e=>setNewType(p=>({...p,size:e.target.value}))} placeholder="e.g. 80 m²"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Bed Configuration</label>
                  <input value={newType.beds} onChange={e=>setNewType(p=>({...p,beds:e.target.value}))} placeholder="e.g. 2 King beds"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Description</label>
                  <textarea value={newType.description} onChange={e=>setNewType(p=>({...p,description:e.target.value}))} rows={2} placeholder="Brief description…"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }} />
                </div>
              </div>
              <p className="text-xs" style={{ color:SUBTLE }}>Amenities can be added after creation via the Amenities button.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={saveNewType} className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY }}>
                <Plus size={15} />Create Room Type
              </button>
              <button onClick={()=>setShowAddType(false)} className="px-5 py-3 rounded-xl text-sm font-bold" style={{ border:`1.5px solid ${BORDER}`, color:MUTED }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD / MANAGE AMENITY MODAL ══ */}
      {showAmenity && (
        <ModalShell title="Manage Amenities" sub={selected.name} onClose={()=>{ setShowAmenity(false); setNewAmenity(""); }}>
          <div className="px-6 py-5">
            {/* Custom input */}
            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color:MUTED }}>Add Custom Amenity</label>
            <div className="flex gap-2 mb-5">
              <input value={newAmenity} onChange={e=>setNewAmenity(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"){ doAddAmenity(newAmenity); } }}
                placeholder="Type an amenity name…"
                className="flex-1 px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor:BORDER }} />
              <button onClick={()=>doAddAmenity(newAmenity)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex-shrink-0" style={{ backgroundColor: tC(selected.code) }}>Add</button>
            </div>

            {/* Quick-add presets */}
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:MUTED }}>Quick Add</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {PRESETS.filter(a=>!selected.amenities.includes(a)).map(a=>(
                <button key={a} onClick={()=>doAddAmenity(a)}
                  className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:bg-gray-50 flex items-center gap-1"
                  style={{ borderColor:BORDER, color:MUTED }}>
                  <Plus size={9}/>{a}
                </button>
              ))}
              {PRESETS.filter(a=>!selected.amenities.includes(a)).length===0 && <p className="text-xs" style={{ color:SUBTLE }}>All presets already added.</p>}
            </div>

            {/* Current list */}
            {selected.amenities.length > 0 && (
              <div className="border-t pt-4" style={{ borderColor:BORDER }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:MUTED }}>Current ({selected.amenities.length}) — click × to remove</p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {selected.amenities.map(a=>(
                    <span key={a} className="text-xs px-2 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor:"#F0FDF4", color:SUCCESS }}>
                      <CheckCircle2 size={9}/>{a}
                      <button onClick={()=>removeAmenity(a)} className="hover:opacity-70 transition-opacity">
                        <X size={10} style={{ color:ERROR }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t" style={{ borderColor:BORDER }}>
            <button onClick={()=>{ setShowAmenity(false); setNewAmenity(""); }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: tC(selected.code) }}>Done</button>
          </div>
        </ModalShell>
      )}

      {/* ══ ANALYTICS MODAL ══ */}
      {showAnalytics && (
        <ModalShell title={`${selected.name} Analytics`} sub="June 2026 · Grand Palms Abuja" onClose={()=>setShowAnalytics(false)} wide>
          <div className="px-6 py-5">
            {(() => {
              const A = ANALYTICS[selected.code] ?? { revenue:0, nights:0, adr:selected.base, revpar:0, occ:[0,0,0,0,0,0,0], dRev:0, dOcc:0 };
              const color = tC(selected.code);
              const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
              const maxOcc = Math.max(...A.occ, 1);
              return (
                <>
                  {/* KPI tiles */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {([
                      { label:"Monthly Revenue",  value:`₦${(A.revenue/1000000).toFixed(2)}M`, sub:`${A.dRev>=0?"+":""}${A.dRev}% vs last month`,    good:A.dRev>=0   },
                      { label:"Nights Sold",       value:String(A.nights),                      sub:`of ${selected.count*30} possible nights`,            good:true        },
                      { label:"ADR",               value:`₦${A.adr.toLocaleString()}`,          sub:"Average daily rate",                                 good:true        },
                      { label:"RevPAR",            value:`₦${A.revpar.toLocaleString()}`,       sub:`${A.dOcc>=0?"+":""}${A.dOcc}% occupancy change`,     good:A.dOcc>=0   },
                    ] as {label:string;value:string;sub:string;good:boolean}[]).map(k=>(
                      <div key={k.label} className="p-4 rounded-xl" style={{ backgroundColor:"#F8FAFC" }}>
                        <p className="text-xs mb-1" style={{ color:MUTED }}>{k.label}</p>
                        <p className="text-xl font-black" style={{ color, fontFamily:mono }}>{k.value}</p>
                        <p className="text-xs mt-0.5 font-semibold" style={{ color: k.good ? SUCCESS : ERROR }}>{k.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* 7-day occupancy bars */}
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color:MUTED }}>Occupancy — Last 7 Days</p>
                  <div className="flex items-end gap-1.5 mb-1" style={{ height:80 }}>
                    {A.occ.map((v,i)=>(
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                        <span style={{ fontSize:9, color, fontWeight:700 }}>{v}%</span>
                        <div className="w-full rounded-t-md" style={{ height:`${Math.round((v/maxOcc)*64)}px`, backgroundColor:`${color}${v>=70?"FF":v>=50?"BB":"66"}` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 mb-5">
                    {DAYS.map(d=><div key={d} className="flex-1 text-center" style={{ fontSize:9, color:SUBTLE }}>{d}</div>)}
                  </div>

                  {/* Summary banner */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: A.dRev>=0 ? "#F0FDF4" : "#FEF2F2", border:`1px solid ${A.dRev>=0 ? "#BBF7D0" : "#FECACA"}` }}>
                    <TrendingUp size={15} style={{ color: A.dRev>=0 ? SUCCESS : ERROR }} />
                    <p className="text-xs font-medium" style={{ color: A.dRev>=0 ? SUCCESS : ERROR }}>
                      Revenue {A.dRev>=0?"up":"down"} {Math.abs(A.dRev)}% · Occupancy {A.dOcc>=0?"up":"down"} {Math.abs(A.dOcc)}% compared to May 2026
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
          <div className="px-6 py-4 border-t" style={{ borderColor:BORDER }}>
            <button onClick={()=>setShowAnalytics(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ color:MUTED, borderColor:BORDER }}>Close</button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

// B4-2 Rate Calendar
export function RateCalendar({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset,        setOffset]        = useState(0);
  const [viewDays,      setViewDays]      = useState<7|14>(7);
  const [planName,      setPlanName]      = useState("Standard Rate");
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [bulkRate,      setBulkRate]      = useState("");
  const [minStay,       setMinStay]       = useState("No restriction");
  const [stopSell,      setStopSell]      = useState<string[]>([]);
  const [cellRates,     setCellRates]     = useState<Record<string,number>>({});
  const [hoveredOvIdx,  setHoveredOvIdx]  = useState<number|null>(null);

  const DAYS = viewDays;
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(TODAY); d.setDate(TODAY.getDate() + offset + i); return d;
  });
  /* 30-day overview always computed for the heat-map strip */
  const overviewDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(TODAY); d.setDate(TODAY.getDate() + i); return d;
  });
  const TYPES = [
    { code:"STD", name:"Standard Room", total:10, mult:1    },
    { code:"DLX", name:"Deluxe Room",   total:8,  mult:1.57 },
    { code:"STE", name:"Suite",         total:4,  mult:2.71 },
  ];
  const TYPE_COLOR: Record<string,string> = { STD: PRIMARY, DLX: TEAL, STE: ORANGE };

  /* availability uses an absolute day index from TODAY to be stable */
  const getAvailAbs = (code: string, absDay: number) => {
    const total = TYPES.find(t=>t.code===code)!.total;
    const dow = ((TODAY.getDay() + absDay) % 7 + 7) % 7;
    const isWk = dow===5||dow===6;
    const seed = (absDay*7+code.charCodeAt(0))%11;
    return Math.max(0, total - Math.min(total, Math.round((isWk?0.85:0.55)*total+(seed-5)*0.3)));
  };
  const getAvail = (code: string, di: number) => getAvailAbs(code, offset + di);

  const getBase     = () => RATE_PLANS.find(p=>p.name===planName)?.base ?? 35000;
  const getPlanRate = (mult: number) => Math.round(getBase() * mult);
  const cKey        = (code: string, di: number) => `${code}|${days[di].toISOString().slice(0,10)}`;
  const cKeyAbs     = (code: string, d: Date)    => `${code}|${d.toISOString().slice(0,10)}`;
  const cellRate    = (code: string, mult: number, di: number) => cellRates[cKey(code,di)] ?? getPlanRate(mult);
  const isCustom    = (code: string, di: number) => cKey(code,di) in cellRates;

  const toggleCell = (code: string, di: number) => {
    const k = cKey(code, di);
    if (stopSell.includes(k)) {
      setStopSell(prev => prev.filter(x=>x!==k));
      add({ type:"success", title:"Stop-sell lifted", body:`${code} · ${days[di].toLocaleDateString("en-NG",{day:"numeric",month:"short"})}` });
      return;
    }
    setSelectedCells(prev => prev.includes(k) ? prev.filter(x=>x!==k) : [...prev,k]);
  };

  const applyBulk = () => {
    if (!bulkRate) { add({type:"warning",title:"Enter a rate first"}); return; }
    const rate = Number(bulkRate);
    if (isNaN(rate)||rate<=0) { add({type:"warning",title:"Enter a valid positive rate"}); return; }
    const updates: Record<string,number> = {};
    selectedCells.forEach(k => { updates[k] = rate; });
    setCellRates(prev => ({...prev,...updates}));
    add({type:"success",title:`₦${rate.toLocaleString()} applied`,body:`${selectedCells.length} cell${selectedCells.length!==1?"s":""}${minStay!=="No restriction"?` · Min stay ${minStay}n`:""}`});
    setSelectedCells([]); setBulkRate("");
  };

  const applyPct = (pct: number) => {
    if (!selectedCells.length) { add({type:"warning",title:"Select cells first"}); return; }
    const updates: Record<string,number> = {};
    selectedCells.forEach(k => {
      const [code] = k.split("|");
      const t = TYPES.find(t=>t.code===code)!;
      updates[k] = Math.max(1000, Math.round((cellRates[k] ?? getPlanRate(t.mult)) * (1+pct/100)));
    });
    setCellRates(prev => ({...prev,...updates}));
    add({type:"success",title:`${pct>0?"+":""}${pct}% applied`,body:`${selectedCells.length} cell${selectedCells.length!==1?"s":""} updated`});
    setSelectedCells([]);
  };

  const avgOcc = (() => {
    let total=0, occ=0;
    TYPES.forEach(rt => days.forEach((_,di) => { total+=rt.total; occ+=rt.total-getAvail(rt.code,di); }));
    return total ? Math.round((occ/total)*100) : 0;
  })();

  const overrides  = Object.keys(cellRates).length;
  const todayIdx   = days.findIndex(d=>d.toDateString()===TODAY.toDateString());
  const canGoBack  = offset > 0;
  /* DW = min-width per cell; actual width is flex:1 so grid fills the container */
  const DW      = viewDays===7 ? 100 : 62;
  const LABEL_W = viewDays===7 ? 210 : 168;
  const ROW_H   = viewDays===7 ? 78 : 62;

  /* professional heat-map scale */
  const heatColor = (avail: number, total: number, isStop: boolean): string => {
    if (isStop) return "#8FA3B1";          // slate gray — closed
    const pct = total > 0 ? avail/total : 0;
    if (pct >= 0.6) return "#6EC49A";     // mint green — available
    if (pct >= 0.3) return "#6AAFD4";     // soft sky — medium
    if (pct > 0)    return "#C9A84C";     // flaxen gold — low
    return "#D4826A";                     // muted coral — sold out
  };
  /* hover preview window helpers */
  const hovStart = hoveredOvIdx !== null ? Math.max(0, hoveredOvIdx - Math.floor(viewDays/2)) : -1;
  const hovEnd   = hovStart >= 0 ? Math.min(30, hovStart + viewDays) : -1;
  const isInHoverWin = (oi: number) => hovStart >= 0 && oi >= hovStart && oi < hovEnd;

  return (
    <div>
      <PageHeader title="Rate Calendar"
        sub={`${viewDays}-day view · click to select · click STOP to lift · ${overrides} override${overrides!==1?"s":""} pending`}
        actions={<>
          <BtnO label="Copy Forward" icon={CalendarDays}
            onClick={()=>add({type:"success",title:"Rates copied 30 days forward",body:`${overrides} override${overrides!==1?"s":""} included`})} />
          <BtnP label={overrides>0?`Publish (${overrides})`:"Publish Rates"} icon={CheckCircle2}
            onClick={()=>{ add({type:"success",title:"Rates published",body:`${overrides} custom rate${overrides!==1?"s":""} pushed live`}); setCellRates({}); }} />
        </>} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Plans"    value={String(RATE_PLANS.filter(r=>r.active).length)} sub="Rate plans available"  icon={DollarSign}    accent={PRIMARY} />
        <StatCard label="Stop-Sell"       value={String(stopSell.length)}  sub={stopSell.length>0?"Tap STOP cell to lift":"No closures"}   icon={AlertTriangle} accent={stopSell.length>0?ERROR:SUCCESS} />
        <StatCard label="Rate Overrides"  value={String(overrides)}        sub={overrides>0?"Unpublished changes":"In sync with plan"}       icon={Edit3}         accent={overrides>0?ORANGE:TEAL} />
        <StatCard label="Avg Occupancy"   value={`${avgOcc}%`}             sub={`Next ${viewDays} days · live`}                             icon={TrendingUp}    accent={avgOcc>=80?ERROR:avgOcc>=60?ORANGE:SUCCESS} />
      </div>

      {/* ── Toolbar: plan selector + view toggle + navigation ── */}
      <div className="bg-white rounded-xl border p-3 mb-4" style={{ borderColor: BORDER }}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Rate plan pills */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <span className="text-xs font-bold uppercase tracking-wider flex-shrink-0" style={{ color:MUTED }}>Plan:</span>
            {RATE_PLANS.map(p=>(
              <button key={p.id} onClick={()=>setPlanName(p.name)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: planName===p.name?PRIMARY:BORDER, backgroundColor: planName===p.name?PRIMARY:"#F8FAFC", color: planName===p.name?"white":p.active?MUTED:SUBTLE }}
                title={`${p.dates}${p.active?"":" · Inactive"}`}>
                {p.name} {!p.active&&<span style={{ opacity:0.6 }}>○</span>}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg flex-shrink-0" style={{ backgroundColor:"#F1F5F9" }}>
            {([7,14] as (7|14)[]).map(v=>(
              <button key={v} onClick={()=>setViewDays(v)}
                className="text-xs px-3 py-1.5 rounded-md font-semibold transition-all"
                style={{ backgroundColor: viewDays===v?"white":"transparent", color: viewDays===v?TEXT:MUTED, boxShadow: viewDays===v?"0 1px 3px rgba(0,0,0,0.1)":"none" }}>
                {v} days
              </button>
            ))}
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={()=>setOffset(0)} disabled={offset===0}
              className="text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all"
              style={{ color:offset===0?SUBTLE:PRIMARY, borderColor:offset===0?BORDER:`${PRIMARY}40`, backgroundColor:offset===0?"#F8FAFC":"#EFF6FF" }}>
              Today
            </button>
            <button onClick={()=>setOffset(o=>Math.max(0,o-viewDays))} disabled={!canGoBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg border"
              style={{ color:canGoBack?MUTED:SUBTLE, borderColor:BORDER, backgroundColor:canGoBack?"white":"#F8FAFC" }}>
              <ChevronLeft size={14}/>
            </button>
            <span className="text-sm font-bold px-1 whitespace-nowrap" style={{ color:TEXT, minWidth:160, textAlign:"center" }}>
              {days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[DAYS-1].toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"2-digit"})}
            </span>
            <button onClick={()=>setOffset(o=>o+viewDays)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-gray-50"
              style={{ color:MUTED, borderColor:BORDER }}>
              <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-start">

        {/* ── Rate grid ── */}
        <div className="flex-1 min-w-0">

          {/* Selection banner */}
          {selectedCells.length>0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3 border"
              style={{ backgroundColor:`${PRIMARY}08`, borderColor:`${PRIMARY}25` }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor:PRIMARY }}>
                <CheckCircle2 size={12} color="white"/>
              </div>
              <span className="text-sm font-bold" style={{ color:PRIMARY }}>{selectedCells.length} cell{selectedCells.length!==1?"s":""} selected</span>
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedCells.slice(0,8).map(k=>{
                  const [code,date]=k.split("|");
                  return <span key={k} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor:`${TYPE_COLOR[code]}15`,color:TYPE_COLOR[code] }}>{code} {date.slice(5)}</span>;
                })}
                {selectedCells.length>8 && <span className="text-xs" style={{ color:MUTED }}>+{selectedCells.length-8} more</span>}
              </div>
              <button onClick={()=>setSelectedCells([])} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ color:MUTED,borderColor:BORDER,backgroundColor:"white" }}>
                <X size={11}/> Clear
              </button>
            </div>
          )}

          {/* Main grid card */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER }}>
            <div style={{ overflowX:"auto" }}>
              <div style={{ width:"100%" }}>

                {/* Date header */}
                <div className="flex sticky top-0 z-10" style={{ backgroundColor:"#F8FAFC", borderBottom:`1px solid ${BORDER}` }}>
                  <div className="flex-shrink-0 flex items-center px-4" style={{ width:LABEL_W, borderRight:`1px solid ${BORDER}` }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color:MUTED }}>Room Type</span>
                  </div>
                  {days.map((d,i)=>{
                    const isToday   = i===todayIdx;
                    const isWeekend = d.getDay()===0||d.getDay()===6;
                    const isMon     = d.getDay()===1;
                    return (
                      <div key={i} className="flex flex-col items-center justify-center py-2 gap-0.5"
                        style={{ flex:1, minWidth:DW, borderRight:`1px solid ${isWeekend?"#E2E8F0":"#F1F5F9"}`,
                                 backgroundColor: isToday?"#EFF6FF":isWeekend?"#F4F6FA":"transparent",
                                 borderLeft: isMon&&i>0 ? `2px solid ${BORDER}` : undefined }}>
                        <span style={{ fontSize:11, fontWeight:700, color:isToday?PRIMARY:isWeekend?MUTED:SUBTLE, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                          {d.toLocaleDateString("en-NG",{weekday:"short"}).slice(0,3)}
                        </span>
                        <div className="flex flex-col items-center">
                          <span style={{ fontSize: viewDays===7?18:14, fontWeight:800, lineHeight:1, color:isToday?PRIMARY:isWeekend?"#475569":TEXT }}>
                            {d.getDate()}
                          </span>
                          {(i===0||d.getDate()===1) && (
                            <span style={{ fontSize:9, color:SUBTLE, fontWeight:600 }}>
                              {d.toLocaleDateString("en-NG",{month:"short"})}
                            </span>
                          )}
                        </div>
                        {isToday && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor:PRIMARY }}/>}
                      </div>
                    );
                  })}
                </div>

                {/* Room type rows */}
                {TYPES.map((rt,ri)=>(
                  <div key={rt.code} className="flex" style={{ borderBottom: ri<TYPES.length-1?`1px solid ${BORDER}`:"none" }}>

                    {/* Row label — sticky */}
                    <div className="flex-shrink-0 flex items-center gap-3 px-4 sticky left-0 z-10 bg-white"
                      style={{ width:LABEL_W, borderRight:`1px solid ${BORDER}`, minHeight:ROW_H }}>
                      <div className="w-2 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLOR[rt.code] }}/>
                      <div>
                        <div className="text-xs font-bold" style={{ color:TEXT }}>{rt.name}</div>
                        <div className="text-xs mt-0.5 font-black" style={{ color:TYPE_COLOR[rt.code], fontFamily:mono }}>
                          ₦{getPlanRate(rt.mult).toLocaleString()}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color:SUBTLE }}>{rt.total} rooms total</div>
                      </div>
                    </div>

                    {/* Cells */}
                    {days.map((_,i)=>{
                      const avail   = getAvail(rt.code, i);
                      const k       = cKey(rt.code, i);
                      const isSel   = selectedCells.includes(k);
                      const isStop  = stopSell.includes(k);
                      const hasOvr  = isCustom(rt.code, i);
                      const rate    = cellRate(rt.code, rt.mult, i);
                      const pct     = rt.total>0 ? avail/rt.total : 0;
                      const isWeekend = days[i].getDay()===0||days[i].getDay()===6;
                      const isMon     = days[i].getDay()===1;

                      const bg = isStop?"#FEF2F2":isSel?`${PRIMARY}0F`:isWeekend?"#FAFBFD":"white";
                      const barColor = avail===0?ERROR:avail<=2?ORANGE:avail<=5?WARNING:SUCCESS;
                      const rateColor = isStop?ERROR:isSel?PRIMARY:TYPE_COLOR[rt.code];

                      return (
                        <div key={i} onClick={()=>toggleCell(rt.code,i)}
                          className="border-r relative"
                          style={{ flex:1, minWidth:DW, minHeight:ROW_H, borderColor:isWeekend?"#E2E8F0":"#F1F5F9",
                                   backgroundColor:bg, cursor:"pointer",
                                   borderLeft: isMon&&i>0 ? `2px solid ${BORDER}` : undefined }}
                          title={isStop?"Click to lift stop-sell":isSel?"Click to deselect":"Click to select"}>

                          {isStop ? (
                            /* Stop-sell cell */
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:"#FEE2E2" }}>
                                <MinusCircle size={14} style={{ color:ERROR }}/>
                              </div>
                              <span style={{ fontSize:9, fontWeight:800, color:ERROR, letterSpacing:"0.08em" }}>CLOSED</span>
                              <span style={{ fontSize:8, color:"#F87171" }}>tap to lift</span>
                            </div>
                          ) : (
                            /* Normal cell */
                            <div className="absolute inset-0 flex flex-col justify-between p-2">
                              {/* Rate */}
                              <div className="flex items-start justify-between">
                                <span style={{ fontSize: viewDays===7?15:12, fontWeight:800, color:rateColor, fontFamily:mono, lineHeight:1 }}>
                                  ₦{(rate/1000).toFixed(rate%1000===0?0:1)}k
                                </span>
                                {hasOvr && (
                                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor:ORANGE }} title="Custom rate"/>
                                )}
                              </div>
                              {/* Availability bar */}
                              <div>
                                <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ backgroundColor:"#E2E8F0" }}>
                                  <div className="h-1.5 rounded-full transition-all" style={{ width:`${Math.round(pct*100)}%`, backgroundColor:barColor }}/>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span style={{ fontSize:10, fontWeight:600, color:avail===0?ERROR:avail<=2?ORANGE:MUTED }}>
                                    {avail}/{rt.total}
                                  </span>
                                  <span style={{ fontSize:9, color:SUBTLE }}>rm</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Selected border */}
                          {isSel && <div className="absolute inset-0 border-2 pointer-events-none" style={{ borderColor:PRIMARY, borderRadius:2 }}/>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend row */}
            <div className="flex items-center gap-5 px-4 py-2.5 border-t flex-wrap" style={{ borderColor:BORDER, backgroundColor:"#F8FAFC" }}>
              <span className="text-xs font-bold" style={{ color:TEXT }}>Key:</span>
              {([{c:SUCCESS,l:"High avail"},{c:WARNING,l:"Low (≤5)"},{c:ORANGE,l:"Critical (≤2)"},{c:ERROR,l:"Sold out"}] as {c:string;l:string}[]).map(x=>(
                <span key={x.l} className="flex items-center gap-1.5 text-xs" style={{ color:MUTED }}>
                  <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor:x.c }}/>{x.l}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-xs" style={{ color:MUTED }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor:ORANGE }}/> Rate override
              </span>
              <span className="ml-auto text-xs" style={{ color:SUBTLE }}>Mon–week dividers shown · Rate in ₦ · tap STOP to lift</span>
            </div>
          </div>

          {/* ── 30-day heat-map overview strip ── */}
          <div className="bg-white rounded-xl border mt-4 mb-2 px-5 pt-4 pb-5" style={{ borderColor:BORDER }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold" style={{ color:TEXT }}>30-Day Overview</span>
                <span className="text-xs ml-2" style={{ color:SUBTLE }}>hover to preview · click to jump</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color:MUTED }}>
                {([
                  {c:"#6EC49A", l:"Available"},
                  {c:"#6AAFD4", l:"Medium"},
                  {c:"#C9A84C", l:"Low"},
                  {c:"#D4826A", l:"Sold Out"},
                  {c:"#8FA3B1", l:"Closed"},
                ] as {c:string;l:string}[]).map(x=>(
                  <span key={x.l} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor:x.c }}/>
                    {x.l}
                  </span>
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-2.5" onMouseLeave={()=>setHoveredOvIdx(null)}>
              {TYPES.map(rt=>(
                <div key={rt.code} className="flex items-center gap-3">
                  {/* Badge */}
                  <div className="flex-shrink-0 w-10 h-7 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor:TYPE_COLOR[rt.code], fontSize:10, fontWeight:800, letterSpacing:"0.04em" }}>
                    {rt.code}
                  </div>
                  {/* Cells */}
                  <div className="flex gap-px flex-1">
                    {overviewDays.map((od,oi)=>{
                      const avail    = getAvailAbs(rt.code, oi);
                      const k        = cKeyAbs(rt.code, od);
                      const isStop   = stopSell.includes(k);
                      const isInView = oi >= offset && oi < offset + viewDays;
                      const inHover  = isInHoverWin(oi);
                      const opacity  = isInView ? 1 : inHover ? 0.86 : 0.28;
                      return (
                        <div key={oi}
                          onClick={()=>setOffset(Math.max(0, oi - Math.floor(viewDays/2)))}
                          onMouseEnter={()=>setHoveredOvIdx(oi)}
                          className="flex-1 rounded-sm cursor-pointer"
                          style={{
                            height: 14,
                            backgroundColor: heatColor(avail, rt.total, isStop),
                            opacity,
                            transition: "opacity 0.12s ease",
                          }}
                          title={`${rt.code} · ${od.toLocaleDateString("en-NG",{day:"numeric",month:"short"})} · ${avail}/${rt.total} avail`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Date ticks */}
              <div className="flex gap-px" style={{ paddingLeft: "52px" }}>
                {overviewDays.map((od,oi)=>{
                  const show = od.getDate()===1 || oi===0 || oi===7 || oi===14 || oi===21;
                  return (
                    <div key={oi} className="flex-1 text-center" style={{ fontSize:8, color: show?MUTED:"transparent" }}>
                      {show ? od.toLocaleDateString("en-NG",{day:"numeric",month:"short"}) : "."}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bulk edit sidebar (always visible) ── */}
        <div className="w-64 flex-shrink-0 space-y-3">

          {/* Selection */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold" style={{ color:TEXT }}>
                {selectedCells.length>0?`${selectedCells.length} selected`:"Edit Panel"}
              </h3>
              {selectedCells.length>0 && (
                <button onClick={()=>setSelectedCells([])} className="p-1 rounded hover:bg-gray-100" style={{ color:MUTED }}><X size={13}/></button>
              )}
            </div>
            {selectedCells.length===0 ? (
              <div className="text-center py-4">
                <CalendarDays size={22} style={{ color:SUBTLE, margin:"0 auto 8px" }}/>
                <p className="text-xs leading-relaxed" style={{ color:MUTED }}>Tap cells in the calendar to select dates, then apply rates or adjustments here.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {selectedCells.slice(0,10).map(k=>{ const [code,date]=k.split("|");
                  return <span key={k} className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor:`${TYPE_COLOR[code]}15`,color:TYPE_COLOR[code] }}>{code} {date.slice(5)}</span>;
                })}
                {selectedCells.length>10 && <span className="text-xs" style={{ color:MUTED }}>+{selectedCells.length-10} more</span>}
              </div>
            )}
          </div>

          {/* Rate tools */}
          <div className="bg-white rounded-xl border p-4 space-y-4" style={{ borderColor:BORDER }}>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color:MUTED }}>Set Rate (₦/night)</label>
              <div className="flex gap-2">
                <input type="number" value={bulkRate} onChange={e=>setBulkRate(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&applyBulk()}
                  placeholder="e.g. 42,000"
                  className="flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor:BORDER, fontFamily:mono }} />
                <button onClick={applyBulk} disabled={!bulkRate||!selectedCells.length}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor:PRIMARY, opacity:(!bulkRate||!selectedCells.length)?0.35:1 }}>
                  Set
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color:MUTED }}>Adjust %</label>
              <div className="grid grid-cols-2 gap-1.5">
                {([[-10,"−10%"],[-5,"−5%"],[5,"+5%"],[10,"+10%"]] as [number,string][]).map(([pct,lbl])=>(
                  <button key={pct} onClick={()=>applyPct(pct)} disabled={!selectedCells.length}
                    className="py-2 rounded-lg border text-xs font-bold transition-colors"
                    style={{ borderColor:pct<0?`${ERROR}30`:`${SUCCESS}30`, color:pct<0?ERROR:SUCCESS, backgroundColor:pct<0?`${ERROR}08`:`${SUCCESS}08`, opacity:!selectedCells.length?0.35:1 }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color:MUTED }}>Min Stay</label>
              <select value={minStay} onChange={e=>setMinStay(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor:BORDER }}>
                {["No restriction","1 night","2 nights","3 nights","5 nights","7 nights"].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Stop-sell */}
          <div className="bg-white rounded-xl border p-4 space-y-2" style={{ borderColor:BORDER }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:MUTED }}>Stop-Sell</h3>
            <button onClick={()=>{
              if (!selectedCells.length) { add({type:"warning",title:"Select cells first"}); return; }
              setStopSell(p=>[...new Set([...p,...selectedCells])]);
              setSelectedCells([]);
              add({type:"warning",title:`${selectedCells.length} date${selectedCells.length!==1?"s":""} closed`,body:"Tap any STOP cell to lift"});
            }} className="w-full py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5"
              style={{ color:ERROR, borderColor:`${ERROR}30`, backgroundColor:`${ERROR}06` }}>
              <MinusCircle size={12}/> Close Selected Dates
            </button>
            {stopSell.length>0 && (
              <button onClick={()=>{ setStopSell([]); add({type:"success",title:"All stop-sells cleared"}); }}
                className="w-full py-2 rounded-xl text-xs font-semibold border" style={{ color:MUTED, borderColor:BORDER }}>
                Clear All ({stopSell.length} closed)
              </button>
            )}
            {stopSell.length===0 && <p className="text-xs text-center pt-1" style={{ color:SUBTLE }}>No closures active.</p>}
          </div>

          {/* Overrides summary */}
          {overrides>0 && (
            <div className="rounded-xl border p-4" style={{ borderColor:`${ORANGE}30`, backgroundColor:`${ORANGE}06` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color:ORANGE }}>Pending</span>
                <button onClick={()=>{ setCellRates({}); add({type:"info",title:"Overrides cleared"}); }}
                  className="text-xs px-2 py-0.5 rounded border" style={{ color:MUTED, borderColor:BORDER, backgroundColor:"white" }}>
                  Clear
                </button>
              </div>
              <p className="text-2xl font-black" style={{ color:ORANGE, fontFamily:mono }}>{overrides}</p>
              <p className="text-xs" style={{ color:ORANGE }}>override{overrides!==1?"s":""} · publish to go live</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// B4-3 Availability Board
export function AvailabilityBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const TODAY = new Date(2026, 7, 1);
  const [offset,      setOffset]      = useState(0);
  const [viewDays,    setViewDays]    = useState<7|14>(14);
  const [drillCell,   setDrillCell]   = useState<{ code:string; type:string; date:string; dateObj:Date; sold:number; avail:number; total:number }|null>(null);
  const [stopSells,   setStopSells]   = useState<string[]>([]);
  const [showGroup,   setShowGroup]   = useState(false);
  const [groupBlocks, setGroupBlocks] = useState([
    { type:"STD", start:3, end:5,  rooms:5, name:"Dangote Group" },
    { type:"DLX", start:3, end:5,  rooms:4, name:"Dangote Group" },
    { type:"STD", start:9, end:11, rooms:3, name:"Adeyemi Wedding" },
  ]);
  const [grpForm, setGrpForm] = useState({ name:"", type:"STD", rooms:"2", checkin:"", checkout:"" });

  const DAYS   = viewDays;
  const LABEL_W = 180;
  const ROW_H   = viewDays===7 ? 82 : 70;
  const days    = Array.from({ length: DAYS }, (_, i) => { const d = new Date(TODAY); d.setDate(TODAY.getDate()+offset+i); return d; });
  const TYPES   = [
    { code:"STD", name:"Standard", total:10, color:PRIMARY },
    { code:"DLX", name:"Deluxe",   total:8,  color:TEAL   },
    { code:"STE", name:"Suite",    total:4,  color:ORANGE },
  ];
  const totalInv  = TYPES.reduce((s,t)=>s+t.total, 0);
  const todayIdx  = days.findIndex(d=>d.toDateString()===TODAY.toDateString());
  const canGoBack = offset > 0;
  /* Local scale: golden yellow for Low keeps it visually distinct from orange Critical */
  const AVAIL_LOW = "#C59800";
  const heatC     = (occ: number) => occ>=90?ERROR:occ>=75?ORANGE:occ>=50?AVAIL_LOW:SUCCESS;
  const cKey      = (code: string, d: Date) => `${code}|${d.toISOString().slice(0,10)}`;

  const getSold = (code: string, di: number) => {
    const rt  = TYPES.find(t=>t.code===code)!;
    const d   = days[di];
    const dow = d.getDay();
    const isWk = dow===5||dow===6;
    const seed = (di*5+code.charCodeAt(0))%7;
    const grp  = groupBlocks.filter(g=>g.type===code&&di>=g.start&&di<g.end).reduce((s,g)=>s+g.rooms,0);
    return Math.min(rt.total, Math.round((isWk?0.82:0.6)*rt.total+(seed-3)*0.4)+grp);
  };

  const avgOcc7 = Math.round(
    Array.from({length:Math.min(7,DAYS)},(_,i)=>TYPES.reduce((s,rt)=>s+getSold(rt.code,i),0))
      .reduce((a,b)=>a+b,0) / (Math.min(7,DAYS)*totalInv) * 100
  );

  const toggleStopSell = (key: string) => setStopSells(p=>p.includes(key)?p.filter(k=>k!==key):[...p,key]);

  const saveGroupBlock = () => {
    if (!grpForm.name || !grpForm.rooms) { add({type:"warning",title:"Fill in all fields"}); return; }
    const rooms = Math.max(1, parseInt(grpForm.rooms)||1);
    setGroupBlocks(p=>[...p, { type:grpForm.type, start:1, end:4, rooms, name:grpForm.name }]);
    add({ type:"success", title:"Group block created", body:`${grpForm.name} · ${rooms} ${grpForm.type} rooms` });
    setShowGroup(false);
    setGrpForm({ name:"", type:"STD", rooms:"2", checkin:"", checkout:"" });
  };

  return (
    <div>
      <PageHeader title="Availability Board" sub="Inventory, sold, and available rooms by type × date"
        actions={<>
          <BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Availability report exported",body:"CSV download started"})} />
          <BtnP label="Add Group Block" icon={Plus} onClick={()=>setShowGroup(true)} />
        </>} />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Inventory" value={String(totalInv)}  sub="All room types"  icon={BedDouble}    accent={PRIMARY} />
        <StatCard label="Avg Occupancy"   value={`${avgOcc7}%`}     sub="Next 7 days"    icon={TrendingUp}   accent={TEAL} />
        <StatCard label="Group Blocks"    value={String(new Set(groupBlocks.map(g=>g.name)).size)} sub="Active blocks" icon={Users} accent={ORANGE} />
        <StatCard label="Stop-Sells"      value={String(stopSells.length)} sub={stopSells.length>0?"Cells closed":"No restrictions"} icon={stopSells.length>0?MinusCircle:CheckCircle2} accent={stopSells.length>0?ERROR:SUCCESS} />
      </div>

      <div className="flex gap-4 items-start">

        {/* ── Grid ── */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER }}>

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor:BORDER, backgroundColor:"#F9FAFB" }}>
            {/* 7 / 14 toggle */}
            <div className="flex rounded-lg border overflow-hidden flex-shrink-0" style={{ borderColor:BORDER }}>
              {([7,14] as (7|14)[]).map(v=>(
                <button key={v} onClick={()=>setViewDays(v)}
                  className="px-3 py-1.5 text-xs font-semibold"
                  style={{ backgroundColor:viewDays===v?PRIMARY:"white", color:viewDays===v?"white":MUTED }}>
                  {v}d
                </button>
              ))}
            </div>

            {/* Date nav */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              <button onClick={()=>setOffset(o=>Math.max(0,o-viewDays))} disabled={!canGoBack}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border"
                style={{ color:canGoBack?MUTED:SUBTLE, borderColor:BORDER, opacity:canGoBack?1:0.4 }}>
                <ChevronLeft size={13}/>Prev {viewDays}d
              </button>
              <span className="text-sm font-semibold px-2 whitespace-nowrap" style={{ color:TEXT }}>
                {days[0].toLocaleDateString("en-NG",{day:"numeric",month:"short"})} – {days[DAYS-1].toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}
              </span>
              <button onClick={()=>setOffset(o=>o+viewDays)}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border"
                style={{ color:MUTED, borderColor:BORDER }}>
                Next {viewDays}d<ChevronRight size={13}/>
              </button>
            </div>

            {/* Today jump */}
            {offset!==0 && (
              <button onClick={()=>setOffset(0)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ backgroundColor:`${PRIMARY}12`, color:PRIMARY }}>
                Today
              </button>
            )}
          </div>

          {/* Scrollable grid */}
          <div style={{ overflowX:"auto" }}>
            <div style={{ width:"100%" }}>

              {/* Date header */}
              <div className="flex sticky top-0 z-10" style={{ backgroundColor:"#F9FAFB", borderBottom:`1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-4 py-2 flex items-center" style={{ width:LABEL_W, borderRight:`1px solid ${BORDER}` }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color:MUTED }}>Room Type</span>
                </div>
                {days.map((d,i)=>{
                  const isToday   = i===todayIdx;
                  const isWeekend = d.getDay()===0||d.getDay()===6;
                  return (
                    <div key={i} className="flex flex-col items-center justify-center py-2 gap-0.5"
                      style={{ flex:1, minWidth:62, borderRight:`1px solid ${isWeekend?"#E2E8F0":"#F1F5F9"}`,
                               backgroundColor:isToday?"#EFF6FF":isWeekend?"#F4F6FA":"transparent" }}>
                      <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:isToday?PRIMARY:isWeekend?MUTED:SUBTLE }}>
                        {d.toLocaleDateString("en-NG",{weekday:"short"}).slice(0,3)}
                      </span>
                      <span style={{ fontSize:viewDays===7?17:14, fontWeight:800, lineHeight:1, color:isToday?PRIMARY:isWeekend?"#475569":TEXT }}>
                        {d.getDate()}
                      </span>
                      {(i===0||d.getDate()===1) && (
                        <span style={{ fontSize:9, color:SUBTLE, fontWeight:600 }}>
                          {d.toLocaleDateString("en-NG",{month:"short"})}
                        </span>
                      )}
                      {isToday && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:PRIMARY }}/>}
                    </div>
                  );
                })}
              </div>

              {/* Room type rows */}
              {TYPES.map((rt,ri)=>(
                <div key={rt.code} className="flex" style={{ borderBottom:`${ri<TYPES.length-1?"1":"2"}px solid ${BORDER}` }}>

                  {/* Row label */}
                  <div className="flex-shrink-0 flex items-center gap-2.5 px-4 sticky left-0 z-10 bg-white"
                    style={{ width:LABEL_W, borderRight:`1px solid ${BORDER}`, minHeight:ROW_H }}>
                    <div className="w-2 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor:rt.color }}/>
                    <div className="w-9 h-7 rounded flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor:rt.color, fontSize:10, fontWeight:800 }}>{rt.code}</div>
                    <div>
                      <div className="text-xs font-bold" style={{ color:TEXT }}>{rt.name}</div>
                      <div className="text-xs mt-0.5" style={{ color:MUTED }}>{rt.total} rooms</div>
                    </div>
                  </div>

                  {/* Cells */}
                  {days.map((d,i)=>{
                    const sold      = getSold(rt.code, i);
                    const avail     = rt.total - sold;
                    const pct       = rt.total>0 ? avail/rt.total : 0;
                    const k         = cKey(rt.code, d);
                    const isStop    = stopSells.includes(k);
                    const isWeekend = d.getDay()===0||d.getDay()===6;
                    const isToday   = i===todayIdx;
                    const grpBlock  = groupBlocks.find(g=>g.type===rt.code&&i>=g.start&&i<g.end);
                    const barColor  = avail===0?ERROR:avail<=2?ORANGE:avail<=4?AVAIL_LOW:SUCCESS;
                    const isSel     = drillCell?.code===rt.code&&drillCell?.dateObj?.toDateString()===d.toDateString();

                    return (
                      <div key={i}
                        onClick={()=>{
                          if (isStop) { toggleStopSell(k); add({type:"success",title:"Stop-sell lifted",body:`${rt.name} · ${d.toLocaleDateString("en-NG",{day:"numeric",month:"short"})}`}); return; }
                          setDrillCell({ code:rt.code, type:rt.name, date:d.toLocaleDateString("en-NG",{weekday:"short",day:"numeric",month:"short"}), dateObj:d, sold, avail, total:rt.total });
                        }}
                        className="border-r relative cursor-pointer transition-colors hover:brightness-95"
                        style={{
                          flex:1, minWidth:62, minHeight:ROW_H,
                          borderColor:isWeekend?"#E2E8F0":"#F1F5F9",
                          backgroundColor:isStop?"#FEF2F2":isSel?`${PRIMARY}0D`:isToday?"rgba(18,58,115,0.025)":"white",
                          outline:isSel?`2px solid ${PRIMARY}`:"none", outlineOffset:-2,
                        }}>

                        {isStop ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:"#FEE2E2" }}>
                              <MinusCircle size={14} style={{ color:ERROR }}/>
                            </div>
                            <span style={{ fontSize:9, fontWeight:800, color:ERROR, letterSpacing:"0.06em" }}>STOP SELL</span>
                            <span style={{ fontSize:8, color:"#F87171" }}>tap to lift</span>
                          </div>
                        ) : viewDays===7 ? (
                          /* 7-day expanded cell */
                          <div className="absolute inset-0 flex flex-col justify-between p-2.5">
                            {/* Avail + Sold side by side */}
                            <div className="flex items-end justify-between">
                              <div className="flex flex-col items-start">
                                <span style={{ fontSize:26, fontWeight:900, lineHeight:1, color:avail===0?ERROR:avail<=2?ORANGE:avail<=4?AVAIL_LOW:TEXT, fontFamily:mono }}>{avail}</span>
                                <span style={{ fontSize:9, color:MUTED, marginTop:1 }}>available</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span style={{ fontSize:16, fontWeight:800, lineHeight:1, color:sold===rt.total?ERROR:MUTED, fontFamily:mono }}>{sold}</span>
                                <span style={{ fontSize:9, color:SUBTLE, marginTop:1 }}>sold</span>
                              </div>
                            </div>
                            {/* Bar + stats */}
                            <div>
                              {grpBlock && (
                                <div className="mb-1.5 px-1.5 py-0.5 rounded text-white inline-block max-w-full truncate"
                                  style={{ backgroundColor:TEAL, fontSize:8, fontWeight:800 }}>
                                  {grpBlock.name} · {grpBlock.rooms}rm
                                </div>
                              )}
                              <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor:"#E2E8F0" }}>
                                <div className="h-2 rounded-full transition-all" style={{ width:`${Math.round(pct*100)}%`, backgroundColor:barColor }}/>
                              </div>
                              <div className="flex justify-between items-center">
                                <span style={{ fontSize:9, color:MUTED }}>{rt.total} total</span>
                                <span style={{ fontSize:10, fontWeight:800, color:barColor, fontFamily:mono }}>{Math.round(pct*100)}%</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* 14-day compact cell */
                          <div className="absolute inset-0 flex flex-col justify-between p-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-baseline gap-0.5">
                                <span style={{ fontSize:16, fontWeight:900, lineHeight:1, color:avail===0?ERROR:avail<=2?ORANGE:avail<=4?AVAIL_LOW:TEXT, fontFamily:mono }}>{avail}</span>
                                <span style={{ fontSize:9, color:MUTED }}>available</span>
                              </div>
                              {grpBlock && (
                                <div className="px-1 py-0.5 rounded text-white flex-shrink-0" style={{ backgroundColor:TEAL, fontSize:8, fontWeight:800 }}>
                                  GRP·{grpBlock.rooms}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ backgroundColor:"#E2E8F0" }}>
                                <div className="h-1.5 rounded-full transition-all" style={{ width:`${Math.round(pct*100)}%`, backgroundColor:barColor }}/>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ fontSize:9, color:MUTED }}>{sold}/{rt.total}</span>
                                <span style={{ fontSize:9, fontWeight:700, color:barColor }}>{Math.round(pct*100)}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Property occupancy footer */}
              <div className="flex sticky bottom-0 z-10" style={{ backgroundColor:"#F9FAFB", borderTop:`2px solid ${BORDER}` }}>
                <div className="flex-shrink-0 px-4 py-2 flex items-center" style={{ width:LABEL_W, borderRight:`1px solid ${BORDER}` }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color:MUTED }}>Property Occ %</span>
                </div>
                {days.map((d,i)=>{
                  const totalSold = TYPES.reduce((s,rt)=>s+getSold(rt.code,i),0);
                  const occ = Math.round((totalSold/totalInv)*100);
                  const c   = heatC(occ);
                  return (
                    <div key={i} className="flex flex-col items-center justify-center py-2.5 gap-1"
                      style={{ flex:1, minWidth:62, borderRight:`1px solid ${BORDER}`, backgroundColor:i===todayIdx?"#EFF6FF":"transparent" }}>
                      <span style={{ fontSize:viewDays===7?15:13, fontWeight:800, color:c, fontFamily:mono }}>{occ}%</span>
                      <div className="rounded-full overflow-hidden" style={{ width:"72%", height:5, backgroundColor:"#E2E8F0" }}>
                        <div className="h-full rounded-full" style={{ width:`${occ}%`, backgroundColor:c }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend bar */}
          <div className="flex items-center gap-5 px-4 py-2 border-t flex-wrap" style={{ borderColor:BORDER, backgroundColor:"#F8FAFC" }}>
            <span className="text-xs font-bold" style={{ color:TEXT }}>Key:</span>
            {([{c:SUCCESS,l:"Good"},{c:AVAIL_LOW,l:"Low (≤4)"},{c:ORANGE,l:"Critical (≤2)"},{c:ERROR,l:"Sold out"}] as {c:string;l:string}[]).map(x=>(
              <span key={x.l} className="flex items-center gap-1.5 text-xs" style={{ color:MUTED }}>
                <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor:x.c }}/>{x.l}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs" style={{ color:MUTED }}>
              <span className="px-1 rounded text-white inline-block" style={{ backgroundColor:TEAL, fontSize:8, fontWeight:800 }}>GRP·N</span> Group block
            </span>
            <span className="ml-auto text-xs" style={{ color:SUBTLE }}>Click any cell to inspect · click stop-sell cell to lift</span>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="w-72 flex-shrink-0">

          {drillCell ? (
            /* Drill-down panel */
            <div className="bg-white rounded-xl border p-5" style={{ borderColor:BORDER }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor:TYPES.find(t=>t.name===drillCell.type)?.color??PRIMARY }}/>
                    <h3 className="text-sm font-bold" style={{ color:TEXT }}>{drillCell.type}</h3>
                  </div>
                  <div className="text-xs mt-0.5 ml-4" style={{ color:MUTED }}>{drillCell.date}</div>
                </div>
                <button onClick={()=>setDrillCell(null)} className="p-1 rounded hover:bg-gray-100" style={{ color:MUTED }}><X size={14}/></button>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {([
                  ["Inventory", String(drillCell.total), TEXT],
                  ["Sold",      String(drillCell.sold),  drillCell.sold===drillCell.total?ERROR:MUTED],
                  ["Available", String(drillCell.avail), drillCell.avail===0?ERROR:drillCell.avail<=2?ORANGE:SUCCESS],
                ] as [string,string,string][]).map(([l,v,c])=>(
                  <div key={l} className="text-center p-3 rounded-xl" style={{ backgroundColor:"#F0F4F8" }}>
                    <div className="text-xl font-black" style={{ color:c, fontFamily:mono }}>{v}</div>
                    <div className="text-xs mt-0.5" style={{ color:MUTED }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Occupancy bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold" style={{ color:MUTED }}>Occupancy</span>
                  <span className="text-xs font-black" style={{ color:heatC(Math.round(drillCell.sold/drillCell.total*100)), fontFamily:mono }}>
                    {Math.round(drillCell.sold/drillCell.total*100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor:"#E2E8F0" }}>
                  <div className="h-2 rounded-full" style={{ width:`${Math.round(drillCell.sold/drillCell.total*100)}%`, backgroundColor:heatC(Math.round(drillCell.sold/drillCell.total*100)) }}/>
                </div>
              </div>

              {/* Reservations */}
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:MUTED }}>
                  Reservations ({drillCell.sold})
                </div>
                <div className="space-y-2">
                  {ALL_RES.filter(r=>{
                    if(r.type!==drillCell.type) return false;
                    // parse "24 Jun" strings against the drill cell year
                    const yr = drillCell.dateObj.getFullYear();
                    const parseD = (s:string) => new Date(`${s} ${yr}`);
                    const ci = parseD(r.checkin); const co = parseD(r.checkout);
                    return drillCell.dateObj >= ci && drillCell.dateObj < co;
                  }).concat(
                    ALL_RES.filter(r=>r.type===drillCell.type)
                  ).filter((r,i,a)=>a.findIndex(x=>x.id===r.id)===i)
                   .slice(0, Math.min(Math.max(drillCell.sold,1), 4)).map(r=>(
                    <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                      <div className="min-w-0 mr-2">
                        <div className="text-xs font-semibold truncate" style={{ color:TEXT }}>{r.guest}</div>
                        <div className="text-xs" style={{ color:MUTED, fontFamily:mono }}>{r.id} · {r.checkin}–{r.checkout}</div>
                      </div>
                      <button onClick={()=>nav?nav("reservation-detail",r.guest,r.id):add({type:"info",title:r.id})}
                        className="text-xs px-2 py-1 rounded-lg border flex-shrink-0" style={{ color:TEAL, borderColor:`${TEAL}30` }}>View</button>
                    </div>
                  ))}
                  {drillCell.sold===0 && <div className="text-xs text-center py-3" style={{ color:MUTED }}>No reservations for this cell</div>}
                  {drillCell.sold>4 && <div className="text-xs text-center mt-1" style={{ color:MUTED }}>+{drillCell.sold-4} more reservations</div>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {(() => {
                  const k = cKey(drillCell.code, drillCell.dateObj);
                  const isStop = stopSells.includes(k);
                  return (
                    <button onClick={()=>{
                        toggleStopSell(k);
                        add({ type:isStop?"success":"warning", title:isStop?"Stop-sell lifted":"Stop-sell applied", body:`${drillCell.type} · ${drillCell.date}` });
                        setDrillCell(null);
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-bold border"
                      style={{ color:isStop?SUCCESS:ERROR, borderColor:isStop?`${SUCCESS}30`:`${ERROR}30` }}>
                      {isStop?"Lift Stop-Sell":"Stop-Sell"}
                    </button>
                  );
                })()}
                <button onClick={()=>nav?nav("new-reservation","New Reservation"):add({type:"info",title:"New reservation"})}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>
                  New Booking
                </button>
              </div>
            </div>
          ) : (
            /* Default summary panel */
            <div className="space-y-3">
              <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color:MUTED }}>Property Snapshot</h3>
                <div className="space-y-3.5">
                  {TYPES.map(rt=>{
                    const avgSold = Array.from({length:Math.min(7,DAYS)},(_,i)=>getSold(rt.code,i)).reduce((a,b)=>a+b,0)/Math.min(7,DAYS);
                    const occ = Math.round(avgSold/rt.total*100);
                    return (
                      <div key={rt.code}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-5 rounded flex items-center justify-center text-white" style={{ backgroundColor:rt.color, fontSize:9, fontWeight:800 }}>{rt.code}</div>
                            <span className="text-xs font-semibold" style={{ color:TEXT }}>{rt.name}</span>
                          </div>
                          <span className="text-xs font-black" style={{ color:heatC(occ), fontFamily:mono }}>{occ}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor:"#E2E8F0" }}>
                          <div className="h-2 rounded-full" style={{ width:`${occ}%`, backgroundColor:rt.color, opacity:0.75 }}/>
                        </div>
                        <div className="mt-0.5" style={{ fontSize:10, color:SUBTLE }}>avg ~{Math.round(avgSold)} sold / {rt.total} total</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color:MUTED }}>Legend</h3>
                <div className="space-y-2">
                  {([
                    {c:SUCCESS, l:"Good availability", s:"Avail > 4 rooms"},
                    {c:AVAIL_LOW, l:"Low",              s:"≤4 rooms left"},
                    {c:ORANGE,    l:"Critical",         s:"≤2 rooms left"},
                    {c:ERROR,   l:"Sold out",          s:"0 rooms available"},
                  ] as {c:string;l:string;s:string}[]).map(x=>(
                    <div key={x.l} className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor:x.c }}/>
                      <div>
                        <div className="text-xs font-semibold" style={{ color:TEXT }}>{x.l}</div>
                        <div style={{ fontSize:10, color:SUBTLE }}>{x.s}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 pt-2 border-t" style={{ borderColor:BORDER }}>
                    <div className="px-1.5 py-0.5 rounded text-white flex-shrink-0" style={{ backgroundColor:TEAL, fontSize:8, fontWeight:800 }}>GRP·N</div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color:TEXT }}>Group block</div>
                      <div style={{ fontSize:10, color:SUBTLE }}>N rooms held for a group</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-3 text-xs" style={{ backgroundColor:`${PRIMARY}08`, color:MUTED }}>
                Click any cell to inspect reservations, toggle stop-sells, or start a new booking.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Group Block modal ── */}
      {showGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" style={{ border:`1.5px solid ${BORDER}` }}>
            {/* Header band */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: PRIMARY }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white" style={{ opacity:0.6 }}>Availability Board</p>
                <p className="text-base font-bold text-white mt-0.5">Add Group Block</p>
              </div>
              <button onClick={()=>setShowGroup(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:"rgba(255,255,255,0.18)" }}>
                <X size={16} color="white" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Group / Company Name</label>
                <input value={grpForm.name} onChange={e=>setGrpForm(f=>({...f,name:e.target.value}))}
                  placeholder="e.g. Dangote Conference"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Room Type</label>
                  <select value={grpForm.type} onChange={e=>setGrpForm(f=>({...f,type:e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}>
                    <option value="STD">Standard</option>
                    <option value="DLX">Deluxe</option>
                    <option value="STE">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Number of Rooms</label>
                  <input value={grpForm.rooms} onChange={e=>setGrpForm(f=>({...f,rooms:e.target.value}))}
                    type="number" min="1" max="20"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Check-in Date</label>
                  <input value={grpForm.checkin} onChange={e=>setGrpForm(f=>({...f,checkin:e.target.value}))}
                    type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color:MUTED }}>Check-out Date</label>
                  <input value={grpForm.checkout} onChange={e=>setGrpForm(f=>({...f,checkout:e.target.value}))}
                    type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border:`1.5px solid ${BORDER}`, backgroundColor:"white" }}/>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={saveGroupBlock}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor:PRIMARY }}><Plus size={15}/>Create Block</button>
              <button onClick={()=>setShowGroup(false)}
                className="px-5 py-3 rounded-xl text-sm font-bold"
                style={{ border:`1.5px solid ${BORDER}`, color:MUTED }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
