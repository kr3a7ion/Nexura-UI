// Batch 19 — Fleet Operations (5 screens)
// DispatchBoard, TripDetail, NewTripRequest, DriverRoster, FleetCosting
import { useState, useEffect, useRef } from "react";
import {
  Car, Navigation, Users, Clock, MapPin, Flag, CheckCircle2,
  AlertTriangle, Plus, Search, Filter, Download, Phone,
  ArrowRight, ChevronDown, ChevronRight, Star, AlertCircle,
  Plane, Building2, DollarSign, Fuel, Wrench, BarChart3,
  UserCheck, UserX, TrendingUp, TrendingDown, RefreshCw,
  FileText, Receipt, Eye, Edit3, XCircle, Activity,
  CircleDot, Truck, Timer, Wifi, WifiOff, Upload,
  LogIn, LogOut as LogOutIcon, Send, Inbox,
  ShoppingCart, Calendar, Package, Banknote,
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  type Toast, mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR,
  BORDER, TEXT, MUTED, SUBTLE,
  ShiftProposalStore, type ShiftProposal,
} from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";

// ─── Shared fleet data ────────────────────────────────────────────────────────

type TripStatus = "pending-approval" | "requested" | "assigned" | "dispatched" | "en-route" | "in-transit" | "completed" | "cancelled";
type ServiceLine = "Airport Transfer" | "Charter" | "Hotel Transport" | "Staff & Logistics";
type ChargeType = "folio" | "complimentary" | "cost-centre" | "cash";
type TripPriority = "Normal" | "Urgent" | "Emergency";
type CancelReason = "Guest cancelled" | "Guest no-show" | "Flight changed" | "No vehicle available" | "No driver available" | "Vehicle breakdown" | "Duplicate request" | "Other";
interface TripEvent { time: string; event: string; actor: string; note?: string; }

interface Trip {
  id: string;
  serviceL: ServiceLine;
  status: TripStatus;
  priority: TripPriority;
  // guest trip
  guest?: string;
  reservationRef?: string;
  // dept trip
  dept?: string;
  requestedBy?: string;
  supervisor?: string;
  costCentre?: string;
  pickup: string;
  dropoff: string;
  scheduledTime: string;
  vehicle?: string;
  driver?: string;
  pax: number;
  flight?: string;
  terminal?: "International" | "Domestic";
  tripMode: "one-way" | "round-trip";
  odomStart?: number;
  odomEnd?: number;
  chargeType: ChargeType;
  quotedFare: number;
  finalFare?: number;
  waitingSurcharge?: number;
  folioRef?: string;
  postedToFolio?: boolean;
  waitMinutes?: number;
  rating?: number;
  feedback?: string;
  notes?: string;
  cancelReason?: CancelReason;
  cancelNote?: string;
  createdAt: string;
  createdAtMs: number;
  events: TripEvent[];
}

const _minsAgo = (m: number) => Date.now() - m * 60_000;
const _nowStr = () => new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });

const TRIPS: Trip[] = [
  {
    id:"TRP-0041", serviceL:"Airport Transfer", status:"requested", priority:"Normal",
    guest:"Dr. Chukwuemeka Bello", reservationRef:"BK-2849",
    pickup:"Grand Palms Abuja", dropoff:"Nnamdi Azikiwe Int'l Airport",
    scheduledTime:"14:30", pax:2, flight:"AA421", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, folioRef:"FOL-2019",
    createdAt:"Today 09:42", createdAtMs:_minsAgo(48),
    events:[{ time:"09:42", event:"Trip created", actor:"Front Desk", note:"From reservation BK-2849" }],
  },
  {
    id:"TRP-0040", serviceL:"Airport Transfer", status:"assigned", priority:"Normal",
    guest:"Mrs. Ngozi Okonkwo", reservationRef:"BK-2850",
    pickup:"Nnamdi Azikiwe Int'l Airport", dropoff:"Grand Palms Abuja",
    scheduledTime:"12:15", pax:1, flight:"QR842", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, folioRef:"FOL-2014",
    vehicle:"ABJ-001E", driver:"Uche Obi",
    createdAt:"Today 08:31", createdAtMs:_minsAgo(119),
    events:[
      { time:"08:31", event:"Trip created", actor:"Front Desk" },
      { time:"08:35", event:"Driver assigned", actor:"Dispatch", note:"Uche Obi · ABJ 123 XA" },
    ],
  },
  {
    id:"TRP-0039", serviceL:"Charter", status:"dispatched", priority:"Urgent",
    guest:"Senator Adeyemi",
    pickup:"Grand Palms Abuja", dropoff:"Aso Rock (State House)",
    scheduledTime:"10:00", pax:3,
    tripMode:"round-trip", chargeType:"complimentary", quotedFare:45000,
    vehicle:"ABJ-002E", driver:"Emeka Eze",
    createdAt:"Today 07:55", createdAtMs:_minsAgo(155),
    events:[
      { time:"07:55", event:"Trip created", actor:"Management" },
      { time:"07:58", event:"Driver assigned", actor:"Dispatch", note:"Emeka Eze · ABJ 456 YB" },
      { time:"09:52", event:"Dispatched", actor:"Emeka Eze" },
    ],
  },
  {
    id:"TRP-0038", serviceL:"Hotel Transport", status:"en-route", priority:"Normal",
    dept:"F&B", requestedBy:"Chukwudi Eze", supervisor:"Grace Mensah", costCentre:"FB-OPS-001",
    pickup:"FreshMart Wuse II", dropoff:"Grand Palms Abuja",
    scheduledTime:"09:30", pax:1,
    tripMode:"round-trip", chargeType:"cost-centre", quotedFare:8500,
    vehicle:"ABJ-003V", driver:"Musa Danladi", odomStart:31380,
    createdAt:"Today 07:10", createdAtMs:_minsAgo(200),
    events:[
      { time:"07:10", event:"Trip created", actor:"Chukwudi Eze" },
      { time:"07:12", event:"Approved", actor:"Grace Mensah" },
      { time:"07:15", event:"Driver assigned", actor:"Dispatch", note:"Musa Danladi · ABJ 789 ZC" },
      { time:"09:28", event:"Dispatched", actor:"Musa Danladi" },
      { time:"09:31", event:"En Route", actor:"Musa Danladi" },
    ],
  },
  {
    id:"TRP-0037", serviceL:"Airport Transfer", status:"completed", priority:"Normal",
    guest:"Adaeze Okonkwo-James", reservationRef:"BK-2847",
    pickup:"Nnamdi Azikiwe Int'l Airport", dropoff:"Grand Palms Abuja",
    scheduledTime:"07:00", pax:2, flight:"ET902", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, finalFare:20500, waitingSurcharge:2500,
    vehicle:"ABJ-001E", driver:"Uche Obi",
    odomStart:47850, odomEnd:47963, waitMinutes:25, rating:4.8,
    feedback:"Excellent service, very punctual.",
    folioRef:"FOL-2010", postedToFolio:true,
    createdAt:"Yesterday 22:10", createdAtMs:_minsAgo(1440),
    events:[
      { time:"22:10", event:"Trip created", actor:"System", note:"Auto from reservation BK-2847" },
      { time:"22:15", event:"Driver assigned", actor:"Dispatch (Adaeze)", note:"Uche Obi · ABJ 123 XA" },
      { time:"05:45", event:"Dispatched", actor:"Uche Obi", note:"En route to airport" },
      { time:"06:02", event:"Arrived at pickup", actor:"Uche Obi", note:"Wait started — flight ET902" },
      { time:"06:27", event:"Trip started", actor:"Uche Obi", note:"Odometer 47,850 km · Pax boarded" },
      { time:"07:11", event:"Completed", actor:"Uche Obi", note:"Odometer 47,963 km · Guests dropped off" },
      { time:"07:14", event:"Charge posted to folio", actor:"System", note:"₦20,500 → FOL-2010" },
    ],
  },
  {
    id:"TRP-0036", serviceL:"Staff & Logistics", status:"pending-approval", priority:"Normal",
    dept:"Housekeeping", requestedBy:"Amaka Osei", supervisor:"Grace Mensah", costCentre:"HK-OPS-001",
    pickup:"Lagos Linen Co.", dropoff:"Grand Palms Abuja",
    scheduledTime:"11:00", pax:1,
    tripMode:"round-trip", chargeType:"cost-centre", quotedFare:12000,
    notes:"Linen pickup — 6 bundles. Loading bay access required.",
    createdAt:"Today 09:58", createdAtMs:_minsAgo(32),
    events:[{ time:"09:58", event:"Request submitted", actor:"Amaka Osei", note:"Awaiting Grace Mensah approval" }],
  },
  {
    id:"TRP-0035", serviceL:"Hotel Transport", status:"pending-approval", priority:"Urgent",
    dept:"Maintenance", requestedBy:"Chidi Eze", supervisor:"Bello Musa", costCentre:"MX-OPS-002",
    pickup:"Grand Palms Abuja", dropoff:"Techno Tools Market, Wuse",
    scheduledTime:"10:30", pax:2,
    tripMode:"one-way", chargeType:"cost-centre", quotedFare:6000,
    notes:"Emergency parts run — HVAC compressor needed for Block C repair.",
    createdAt:"Today 10:01", createdAtMs:_minsAgo(9),
    events:[{ time:"10:01", event:"Request submitted", actor:"Chidi Eze", note:"Urgent — awaiting Bello Musa approval" }],
  },
];

// shared mutable pointer so DispatchBoard → TripDetail navigation works
let _detailTripId = "TRP-0037";
export const setDetailTripId = (id: string) => { _detailTripId = id; };

// shared tab flag so App.tsx quick actions can deep-link into the driver dashboard
let _driverTab: "assignments" | "logbook" = "assignments";
export const setDriverTab = (tab: "assignments" | "logbook") => { _driverTab = tab; };

interface Vehicle {
  id: string; plate: string; make: string; model: string; type: string;
  status: "available" | "on-trip" | "maintenance" | "offline";
  currentTripId?: string; nextFree?: string; driver?: string;
  docExpiry?: string; docsOk: boolean;
}

const VEHICLES: Vehicle[] = [
  { id:"ABJ-001E", plate:"ABJ 123 XA", make:"Toyota",   model:"Camry",   type:"Saloon",  status:"available",    nextFree:"Now",     docsOk:true  },
  { id:"ABJ-002E", plate:"ABJ 456 YB", make:"Toyota",   model:"HiAce",   type:"Van",     status:"on-trip",      currentTripId:"TRP-0039", nextFree:"~11:30", driver:"Emeka Eze", docsOk:true  },
  { id:"ABJ-003V", plate:"ABJ 789 ZC", make:"Toyota",   model:"Land Cruiser", type:"SUV",status:"on-trip",      currentTripId:"TRP-0038", nextFree:"~10:15", driver:"Musa Danladi", docsOk:true },
  { id:"ABJ-004V", plate:"ABJ 321 WD", make:"Mercedes", model:"Sprinter", type:"Bus",    status:"maintenance",  nextFree:"Tomorrow",docsOk:false, docExpiry:"Expired: Vehicle Licence" },
];

type HRShift = "Morning" | "Evening" | "Night" | "Off";

interface Driver {
  id: string; name: string; licNo: string; licClass: string;
  licExpiry: string; licDaysLeft: number;
  medExpiry: string; medDaysLeft: number;
  permitRef: string; vehicle?: string;
  onDuty: boolean; tripsToday: number; tripsMonth: number;
  totalKm: number; avgRating: number; incidents: number;
  status: "available" | "on-trip" | "off-duty" | "suspended";
  hrShift: HRShift;
  hrEmpId?: string;
  shiftOverride?: boolean;
}

const DRIVERS: Driver[] = [
  { id:"DRV-001", name:"Uche Obi",       licNo:"FCT/DL/2019/04821", licClass:"E", licExpiry:"15 Mar 2026", licDaysLeft:162, medExpiry:"01 Jun 2025", medDaysLeft:-136, permitRef:"NIG/DP/22/4821", vehicle:"ABJ-001E", onDuty:true,  tripsToday:2, tripsMonth:48, totalKm:14820, avgRating:4.9, incidents:0, status:"available", hrShift:"Morning" },
  { id:"DRV-002", name:"Emeka Eze",       licNo:"FCT/DL/2020/07114", licClass:"B", licExpiry:"03 Oct 2025", licDaysLeft:-11, medExpiry:"15 Apr 2026", medDaysLeft:183, permitRef:"NIG/DP/21/7114", vehicle:"ABJ-002E", onDuty:true,  tripsToday:1, tripsMonth:31, totalKm:9240,  avgRating:4.7, incidents:1, status:"on-trip",   hrShift:"Morning" },
  { id:"DRV-003", name:"Musa Danladi",    licNo:"FCT/DL/2021/09302", licClass:"B", licExpiry:"20 Jul 2026", licDaysLeft:289, medExpiry:"10 Jan 2026", medDaysLeft:88,  permitRef:"NIG/DP/23/9302", vehicle:"ABJ-003V", onDuty:true,  tripsToday:1, tripsMonth:22, totalKm:6810,  avgRating:4.6, incidents:0, status:"on-trip",   hrShift:"Evening" },
  { id:"DRV-004", name:"Blessing Okafor", licNo:"FCT/DL/2022/11540", licClass:"B", licExpiry:"18 Feb 2027", licDaysLeft:497, medExpiry:"22 Mar 2026", medDaysLeft:169, permitRef:"NIG/DP/23/1154", vehicle:undefined,  onDuty:false, tripsToday:0, tripsMonth:14, totalKm:4120,  avgRating:4.5, incidents:0, status:"off-duty",  hrShift:"Off"     },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

const SL_COLOR: Record<ServiceLine, string> = {
  "Airport Transfer": PRIMARY,
  "Charter":          TEAL,
  "Hotel Transport":  ORANGE,
  "Staff & Logistics":SUCCESS,
};

const STATUS_PILL: Record<TripStatus, { bg: string; text: string; label: string }> = {
  "pending-approval": { bg:"#EDE9FE", text:"#5B21B6", label:"Pending Approval" },
  requested:          { bg:"#EFF6FF", text:"#1D4ED8", label:"Requested"         },
  assigned:           { bg:"#FEF3C7", text:"#92400E", label:"Assigned"          },
  dispatched:         { bg:"#FEF9C3", text:"#713F12", label:"Dispatched"        },
  "en-route":         { bg:"#DCFCE7", text:"#166534", label:"En Route"          },
  "in-transit":       { bg:"#D1FAE5", text:"#065F46", label:"In Transit"        },
  completed:          { bg:"#F1F5F9", text:"#475569", label:"Completed"         },
  cancelled:          { bg:"#FEE2E2", text:"#991B1B", label:"Cancelled"         },
};

function TripPill({ status }: { status: TripStatus }) {
  const s = STATUS_PILL[status];
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>;
}

function VehicleStatusPill({ status }: { status: Vehicle["status"] }) {
  const map = {
    available:   { bg:"#DCFCE7", text:"#166534", label:"Available"   },
    "on-trip":   { bg:"#FEF3C7", text:"#92400E", label:"On Trip"     },
    maintenance: { bg:"#FEE2E2", text:"#991B1B", label:"Maintenance" },
    offline:     { bg:"#F1F5F9", text:"#475569", label:"Offline"     },
  };
  const s = map[status];
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>;
}

function ExportBtn({ add, label }: { add: (t: Omit<Toast,"id">) => void; label: string }) {
  const [st, setSt] = useState<"idle"|"gen"|"ready">("idle");
  if (st==="gen") return <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor:"#EFF6FF", color:PRIMARY }}><div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor:`${PRIMARY}40`, borderTopColor:PRIMARY }} />Generating…</div>;
  if (st==="ready") return <button onClick={()=>{add({type:"success",title:`${label} exported`});setSt("idle");}} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor:"#DCFCE7", color:"#166534" }}><Download size={12}/>Download Ready</button>;
  return <button onClick={()=>{setSt("gen");setTimeout(()=>setSt("ready"),1600);}} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs" style={{ borderColor:BORDER, color:MUTED }}><Download size={12}/>Export</button>;
}

function TH({ cols }: { cols: string[] }) {
  return (
    <tr style={{ backgroundColor:"#F9FAFB" }}>
      {cols.map((c,i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color:MUTED }}>{c}</th>)}
    </tr>
  );
}

function ExpiryBadge({ days, label }: { days: number; label: string }) {
  if (days < 0)   return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#FEE2E2", color:"#991B1B" }}>{label}: EXPIRED</span>;
  if (days <= 30) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#FEF3C7", color:"#92400E" }}>{label}: {days}d left</span>;
  return <span className="text-xs" style={{ color:MUTED }}>{label}: {days}d</span>;
}

// ─── 1. DispatchBoard ─────────────────────────────────────────────────────────

export function DispatchBoard({ add, nav }: { add: (t: Omit<Toast,"id">) => void; nav?: (s: string, label: string) => void }) {
  const [trips, setTrips] = useState(TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [assignVehicle, setAssignVehicle] = useState<string>("");
  const [assignDriver,  setAssignDriver]  = useState<string>("");
  const [cancelTarget, setCancelTarget]   = useState<string | null>(null);
  const [cancelReason, setCancelReason]   = useState<CancelReason>("Guest cancelled");
  const [cancelNote,   setCancelNote]     = useState("");

  const STATUS_COLS: TripStatus[] = ["requested", "assigned", "dispatched", "en-route", "in-transit", "completed"];
  const pendingApproval = trips.filter(t => t.status === "pending-approval");
  const unassigned = trips.filter(t => t.status === "requested");
  const selectedTripObj = trips.find(t => t.id === selectedTrip);

// ─── 1. DispatchBoard ─────────────────────────────────────────────────────────

  const goToDetail = (id: string) => { setDetailTripId(id); nav?.("trip-detail", `Trip ${id}`); };

  const logEvent = (id: string, event: string, actor = "Dispatch") => {
    const t = new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
    setTrips(prev => prev.map(x => x.id === id ? { ...x, events: [...x.events, { time:t, event, actor }] } : x));
  };

  const doAssign = () => {
    if (!selectedTrip || !assignVehicle || !assignDriver) { add({ type:"error", title:"Select a vehicle and driver" }); return; }
    const veh = VEHICLES.find(v => v.id === assignVehicle);
    const drv = DRIVERS.find(d => d.id === assignDriver);
    if (veh?.status === "maintenance") { add({ type:"error", title:"Vehicle in maintenance", body:`${veh.plate} is not available.` }); return; }
    if (!veh?.docsOk) { add({ type:"error", title:"Documents expired", body:`${veh?.plate} has expired paperwork.` }); return; }
    if (drv && drv.licDaysLeft < 0) { add({ type:"error", title:"Licence expired", body:`${drv.name}'s licence is expired.` }); return; }
    if (drv && drv.medDaysLeft < 0) { add({ type:"error", title:"Medical expired", body:`${drv.name}'s medical certificate expired.` }); return; }
    if (drv?.status === "on-trip")  { add({ type:"error", title:"Driver unavailable", body:`${drv.name} is already on a trip.` }); return; }
    const t = _nowStr();
    setTrips(prev => prev.map(x => x.id === selectedTrip
      ? { ...x, status:"assigned" as TripStatus, vehicle:assignVehicle, driver:drv?.name,
          events:[...x.events, { time:t, event:"Driver assigned", actor:"Dispatch", note:`${drv?.name} · ${veh?.plate}` }] }
      : x));
    add({ type:"success", title:"Trip assigned", body:`${selectedTrip} → ${drv?.name} / ${veh?.plate}` });
    setSelectedTrip(null); setAssignVehicle(""); setAssignDriver("");
  };

  const approveRequest = (id: string) => {
    const t = _nowStr();
    setTrips(prev => prev.map(x => x.id === id
      ? { ...x, status:"requested" as TripStatus, events:[...x.events, { time:t, event:"Approved by supervisor", actor:"Management" }] }
      : x));
    add({ type:"success", title:"Request approved — added to dispatch queue", body:id });
  };

  const advanceStatus = (id: string) => {
    const order: TripStatus[] = ["requested","assigned","dispatched","en-route","in-transit","completed"];
    const t = _nowStr();
    setTrips(prev => prev.map(x => {
      if (x.id !== id) return x;
      const idx = order.indexOf(x.status);
      if (idx < 0 || idx >= order.length - 1) return x;
      const next = order[idx + 1];
      return { ...x, status: next, events:[...x.events, { time:t, event: STATUS_PILL[next].label, actor:"Dispatch" }] };
    }));
  };

  const doCancel = () => {
    if (!cancelTarget) return;
    const t = _nowStr();
    setTrips(prev => prev.map(x => x.id === cancelTarget
      ? { ...x, status:"cancelled" as TripStatus, cancelReason, cancelNote,
          events:[...x.events, { time:t, event:"Cancelled", actor:"Dispatch", note:`${cancelReason}${cancelNote ? " — "+cancelNote : ""}` }] }
      : x));
    add({ type:"warning", title:"Trip cancelled", body:`${cancelTarget} — ${cancelReason}` });
    setCancelTarget(null); setCancelNote(""); setSelectedTrip(null);
  };

  const ageLabel = (ms: number) => {
    const m = Math.round((Date.now() - ms) / 60_000);
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m/60)}h ${m%60}m ago`;
  };
  const ageColor = (ms: number) => {
    const m = (Date.now() - ms) / 60_000;
    if (m > 120) return ERROR;
    if (m > 45)  return WARNING;
    return MUTED;
  };

  return (
    <div>
      <PageHeader title="Dispatch Board" sub="Real-time trip management — assign, advance, and track all active trips"
        actions={<BtnP label="New Trip" icon={Plus} onClick={() => nav?.("new-trip", "New Trip Request")} />}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Active Trips"     value={String(trips.filter(t=>!["cancelled","completed"].includes(t.status)).length)} sub="Pending + in progress" icon={Car}          accent={PRIMARY} />
        <StatCard label="Pending Approval" value={String(pendingApproval.length)} sub={pendingApproval.length>0?"Needs manager action":"All clear"} icon={AlertCircle} accent={pendingApproval.length>0?"#5B21B6":SUCCESS} />
        <StatCard label="Vehicles Active"  value={String(VEHICLES.filter(v=>v.status==="on-trip").length)} sub={`of ${VEHICLES.length} total`} icon={Truck} accent={TEAL} />
        <StatCard label="Drivers On Duty"  value={String(DRIVERS.filter(d=>d.onDuty).length)} sub={`of ${DRIVERS.length} total`} icon={Users} accent={ORANGE} />
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(2px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
              <div className="text-sm font-bold" style={{ color:ERROR }}>Cancel Trip {cancelTarget}</div>
              <button onClick={()=>setCancelTarget(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:"#F1F5F9", color:MUTED }}><XCircle size={14}/></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color:TEXT }}>Cancellation reason</label>
                <select value={cancelReason} onChange={e=>setCancelReason(e.target.value as CancelReason)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                  {(["Guest cancelled","Guest no-show","Flight changed","No vehicle available","No driver available","Vehicle breakdown","Duplicate request","Other"] as CancelReason[]).map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color:TEXT }}>Additional note (optional)</label>
                <textarea rows={2} value={cancelNote} onChange={e=>setCancelNote(e.target.value)} placeholder="Any additional context…" className="w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none" style={{ borderColor:BORDER }} />
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t" style={{ borderColor:BORDER }}>
              <button onClick={()=>setCancelTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor:BORDER, color:MUTED }}>Keep Trip</button>
              <button onClick={doCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:ERROR }}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-5">
        <div className="flex-1 min-w-0 space-y-4">

          {/* Pending approval section */}
          {pendingApproval.length > 0 && (
            <div className="rounded-xl border-2 p-3" style={{ borderColor:"#7C3AED", backgroundColor:"#FAFAFF" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color:"#5B21B6" }} />
                <span className="text-xs font-bold" style={{ color:"#5B21B6" }}>Pending Approval — {pendingApproval.length} dept request{pendingApproval.length>1?"s":""} awaiting manager sign-off</span>
              </div>
              <div className="space-y-2">
                {pendingApproval.map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border" style={{ borderColor:"#DDD6FE" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold" style={{ color:"#5B21B6", fontFamily:mono }}>{t.id}</span>
                        {t.priority === "Urgent" && <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor:"#FFF7ED", color:ORANGE }}>Urgent</span>}
                        <span className="text-xs font-semibold" style={{ color:TEXT }}>{t.dept}</span>
                        <span className="text-xs" style={{ color:MUTED }}>· {t.requestedBy}</span>
                      </div>
                      <div className="text-xs truncate mt-0.5" style={{ color:MUTED }}><MapPin size={9} className="inline mr-0.5"/>{t.pickup} → {t.dropoff} · {t.scheduledTime}</div>
                      {t.notes && <div className="text-xs mt-0.5 truncate" style={{ color:SUBTLE }}>{t.notes}</div>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={()=>approveRequest(t.id)} className="px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1" style={{ backgroundColor:SUCCESS }}>
                        <CheckCircle2 size={11}/>Approve
                      </button>
                      <button onClick={()=>{setCancelTarget(t.id);}} className="px-2.5 py-1 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor:"#FCA5A5", color:ERROR, backgroundColor:"#FFF1F2" }}>
                        <XCircle size={11}/>Decline
                      </button>
                      <button onClick={()=>goToDetail(t.id)} className="px-2.5 py-1 rounded-lg text-xs border" style={{ borderColor:BORDER, color:MUTED }}>Detail</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unassigned queue */}
          {unassigned.length > 0 && (
            <div className="p-3 rounded-xl border-2 border-dashed" style={{ borderColor:ERROR, backgroundColor:"#FFFAFA" }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color:ERROR }} />
                <span className="text-xs font-bold" style={{ color:ERROR }}>Unassigned — {unassigned.length} trip{unassigned.length>1?"s":""} need dispatch</span>
              </div>
              <div className="space-y-2">
                {unassigned.map(t => {
                  const ac = ageColor(t.createdAtMs);
                  return (
                    <div key={t.id} onClick={()=>setSelectedTrip(selectedTrip===t.id?null:t.id)} className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border bg-white" style={{ borderColor:selectedTrip===t.id?PRIMARY:BORDER }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold flex-shrink-0" style={{ color:PRIMARY, fontFamily:mono }}>{t.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor:SL_COLOR[t.serviceL] }}/>
                        <span className="text-xs font-semibold truncate" style={{ color:TEXT }}>{t.guest ?? `${t.dept} · ${t.requestedBy}`}</span>
                        <span className="text-xs flex-shrink-0" style={{ color:MUTED }}>→ {t.dropoff}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-xs font-bold" style={{ color:TEXT }}>{t.scheduledTime}</span>
                        <span className="text-xs" style={{ color:ac }}>{ageLabel(t.createdAtMs)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kanban */}
          <div className="grid gap-3" style={{ gridTemplateColumns:`repeat(${STATUS_COLS.length}, minmax(0,1fr))` }}>
            {STATUS_COLS.map(col => {
              const colTrips = trips.filter(t => t.status === col);
              const pill = STATUS_PILL[col];
              return (
                <div key={col}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide truncate" style={{ color:MUTED }}>{pill.label}</span>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor:pill.bg, color:pill.text }}>{colTrips.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colTrips.map(t => {
                      const isDept = !!t.dept;
                      return (
                        <div key={t.id} onClick={()=>col==="completed"||col==="cancelled"?goToDetail(t.id):setSelectedTrip(selectedTrip===t.id?null:t.id)} className="p-2.5 rounded-xl border cursor-pointer transition-shadow hover:shadow-md" style={{ backgroundColor:selectedTrip===t.id?"#EFF6FF":"white", borderColor:selectedTrip===t.id?PRIMARY:BORDER }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{t.id}</span>
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:SL_COLOR[t.serviceL] }} title={t.serviceL}/>
                          </div>
                          {isDept
                            ? <><div className="text-xs font-semibold truncate" style={{ color:TEXT }}>{t.dept}</div><div className="text-xs truncate" style={{ color:MUTED }}>{t.requestedBy}</div></>
                            : <div className="text-xs font-semibold mb-0.5 truncate" style={{ color:TEXT }}>{t.guest}</div>
                          }
                          <div className="text-xs truncate mt-0.5" style={{ color:MUTED }}><MapPin size={9} className="inline mr-0.5"/>{t.dropoff}</div>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs font-bold" style={{ color:TEXT }}>{t.scheduledTime}</span>
                            {t.vehicle && <span className="text-xs" style={{ color:SUBTLE, fontFamily:mono }}>{VEHICLES.find(v=>v.id===t.vehicle)?.plate ?? t.vehicle}</span>}
                          </div>
                          {t.flight && <div className="text-xs mt-0.5" style={{ color:TEAL }}><Plane size={9} className="inline mr-0.5"/>{t.flight}</div>}
                          {(col==="completed"||col==="cancelled") && <div className="text-xs mt-1.5 font-medium" style={{ color:PRIMARY }}>View detail →</div>}
                          {col!=="completed" && col!=="cancelled" && col!=="requested" && (
                            <div className="flex gap-1 mt-2">
                              <button onClick={e=>{e.stopPropagation();advanceStatus(t.id);}} className="flex-1 text-xs py-1 rounded-lg border" style={{ borderColor:BORDER, color:PRIMARY }}>Advance →</button>
                              <button onClick={e=>{e.stopPropagation();setCancelTarget(t.id);}} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor:"#FCA5A5", color:ERROR }} title="Cancel trip"><XCircle size={10}/></button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {colTrips.length===0 && <div className="text-xs text-center py-6" style={{ color:SUBTLE }}>Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right rail */}
        <div className="w-60 shrink-0 space-y-4">
          {/* Assignment panel */}
          {selectedTripObj && selectedTripObj.status === "requested" && (
            <div className="bg-white rounded-xl border p-3" style={{ borderColor:PRIMARY, boxShadow:`0 0 0 2px ${PRIMARY}18` }}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-bold" style={{ color:PRIMARY }}>Assign {selectedTripObj.id}</div>
                <button onClick={()=>setSelectedTrip(null)} className="text-xs" style={{ color:MUTED }}><XCircle size={13}/></button>
              </div>
              <div className="text-xs mb-3 truncate" style={{ color:MUTED }}>
                {selectedTripObj.guest ?? `${selectedTripObj.dept} · ${selectedTripObj.requestedBy}`} → {selectedTripObj.dropoff} @ {selectedTripObj.scheduledTime}
              </div>
              <div className="mb-2">
                <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Vehicle</div>
                <select value={assignVehicle} onChange={e=>setAssignVehicle(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor:BORDER }}>
                  <option value="">Select vehicle…</option>
                  {VEHICLES.map(v=><option key={v.id} value={v.id} disabled={v.status==="maintenance"}>{v.plate} — {v.make} {v.model}{v.status!=="available"?` (${v.status})`:""}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Driver</div>
                <select value={assignDriver} onChange={e=>setAssignDriver(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor:BORDER }}>
                  <option value="">Select driver…</option>
                  {DRIVERS.filter(d=>d.onDuty).map(d=><option key={d.id} value={d.id}>{d.name}{d.status==="on-trip"?" (on trip)":""}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={doAssign} className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Confirm Assignment</button>
                <button onClick={()=>{setCancelTarget(selectedTripObj.id);setSelectedTrip(null);}} className="px-3 py-2 rounded-xl text-xs border" style={{ borderColor:"#FCA5A5", color:ERROR }} title="Cancel this trip"><XCircle size={13}/></button>
              </div>
            </div>
          )}

          {/* Vehicles */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor:BORDER }}>
            <div className="text-xs font-bold mb-2" style={{ color:TEXT }}>Fleet Status</div>
            <div className="space-y-1.5">
              {VEHICLES.map(v => (
                <div key={v.id} className="px-2 py-1.5 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color:TEXT, fontFamily:mono }}>{v.plate}</span>
                    <VehicleStatusPill status={v.status} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color:MUTED }}>{v.make} {v.model} · {v.type}</div>
                  {v.nextFree && <div className="text-xs" style={{ color:SUBTLE }}>Free: {v.nextFree}</div>}
                  {!v.docsOk && <div className="text-xs font-semibold mt-0.5" style={{ color:ERROR }}>⚠ Docs expired</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Drivers */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor:BORDER }}>
            <div className="text-xs font-bold mb-2" style={{ color:TEXT }}>Drivers On Duty</div>
            <div className="space-y-1.5">
              {DRIVERS.filter(d=>d.onDuty).map(d => (
                <div key={d.id} className="px-2 py-1.5 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color:TEXT }}>{d.name}</span>
                    <span className="text-xs font-medium" style={{ color:d.status==="on-trip"?ORANGE:SUCCESS }}>{d.status==="on-trip"?"On trip":"Free"}</span>
                  </div>
                  <div className="text-xs" style={{ color:MUTED }}>{d.vehicle ?? "Unassigned"} · {d.tripsToday} trip{d.tripsToday!==1?"s":""} today</div>
                  {d.licDaysLeft < 0 && <div className="text-xs font-semibold mt-0.5" style={{ color:ERROR }}>⚠ Licence expired</div>}
                  {d.licDaysLeft >= 0 && d.licDaysLeft <= 30 && <div className="text-xs mt-0.5" style={{ color:WARNING }}>Lic. expires in {d.licDaysLeft}d</div>}
                </div>
              ))}
              {DRIVERS.filter(d=>d.onDuty).length === 0 && <div className="text-xs text-center py-3" style={{ color:SUBTLE }}>No drivers on duty</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. TripDetail ───────────────────────────────────────────────────────────

export function TripDetail({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [trips, setTrips] = useState(TRIPS);
  const trip = trips.find(t => t.id === _detailTripId) ?? trips.find(t => t.status === "completed") ?? trips[0];
  if (!trip) return <div className="p-8 text-center text-sm" style={{ color:MUTED }}>Trip not found.</div>;

  const distKm = trip.odomEnd && trip.odomStart ? trip.odomEnd - trip.odomStart : null;
  const veh = VEHICLES.find(v => v.id === trip.vehicle);
  const drv = DRIVERS.find(d => d.name === trip.driver);
  const isDept = !!trip.dept;

  const chargeLabel: Record<ChargeType, string> = {
    folio:"Folio Charge", complimentary:"Complimentary", "cost-centre":"Cost Centre", cash:"Cash",
  };

  return (
    <div>
      <PageHeader
        title={trip.id}
        sub={`${trip.serviceL} · ${isDept ? `${trip.dept} — ${trip.requestedBy}` : trip.guest ?? ""}`}
        actions={
          <div className="flex gap-2 items-center">
            <TripPill status={trip.status} />
            {trip.priority !== "Normal" && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: trip.priority==="Emergency"?"#FEE2E2":"#FFF7ED", color: trip.priority==="Emergency"?ERROR:ORANGE }}>{trip.priority}</span>
            )}
            <BtnO label="Print" icon={FileText} onClick={()=>add({type:"info", title:"Print queued"})} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          {/* Route */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Route</div>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor:SUCCESS }}/>
                <div className="w-0.5 h-10 bg-slate-200"/>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor:ERROR }}/>
              </div>
              <div className="flex-1 space-y-3">
                <div><div className="text-xs" style={{ color:MUTED }}>Pickup</div><div className="text-sm font-semibold" style={{ color:TEXT }}>{trip.pickup}</div></div>
                <div><div className="text-xs" style={{ color:MUTED }}>Drop-off</div><div className="text-sm font-semibold" style={{ color:TEXT }}>{trip.dropoff}</div></div>
              </div>
              {distKm && (
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color:PRIMARY }}>{distKm} km</div>
                  <div className="text-xs" style={{ color:MUTED }}>Distance</div>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-3" style={{ borderColor:BORDER }}>
              <div><div className="text-xs" style={{ color:MUTED }}>Mode</div><div className="text-sm font-bold capitalize" style={{ color:TEXT }}>{trip.tripMode}</div></div>
              <div><div className="text-xs" style={{ color:MUTED }}>Passengers</div><div className="text-sm font-bold" style={{ color:TEXT }}>{trip.pax}</div></div>
              {trip.waitMinutes && <div><div className="text-xs" style={{ color:MUTED }}>Wait time</div><div className="text-sm font-bold" style={{ color:TEXT }}>{trip.waitMinutes} min</div></div>}
              {trip.odomStart && <div><div className="text-xs" style={{ color:MUTED }}>Odom start</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{trip.odomStart.toLocaleString()} km</div></div>}
              {trip.odomEnd   && <div><div className="text-xs" style={{ color:MUTED }}>Odom end</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{trip.odomEnd.toLocaleString()} km</div></div>}
            </div>
          </div>

          {/* Flight (guest trips) */}
          {trip.flight && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="text-sm font-semibold mb-2" style={{ color:TEXT }}>Flight Details</div>
              <div className="flex gap-6">
                <div><div className="text-xs" style={{ color:MUTED }}>Flight</div><div className="text-sm font-bold" style={{ color:TEAL, fontFamily:mono }}>{trip.flight}</div></div>
                {trip.terminal && <div><div className="text-xs" style={{ color:MUTED }}>Terminal</div><div className="text-sm font-bold" style={{ color:TEXT }}>{trip.terminal}</div></div>}
                {trip.reservationRef && <div><div className="text-xs" style={{ color:MUTED }}>Reservation</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{trip.reservationRef}</div></div>}
              </div>
            </div>
          )}

          {/* Dept info */}
          {isDept && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Department Request</div>
              <div className="grid grid-cols-2 gap-3">
                {[["Department",trip.dept!],["Requested By",trip.requestedBy!],["Supervisor",trip.supervisor!],["Cost Centre",trip.costCentre!]].filter(([,v])=>v).map(([k,v])=>(
                  <div key={k}><div className="text-xs" style={{ color:MUTED }}>{k}</div><div className="text-sm font-semibold" style={{ color:TEXT, fontFamily:k==="Cost Centre"?mono:undefined }}>{v}</div></div>
                ))}
              </div>
              {trip.notes && <div className="mt-3 p-2.5 rounded-xl text-xs" style={{ backgroundColor:"#F9FAFB", color:MUTED }}>{trip.notes}</div>}
            </div>
          )}

          {/* Charge */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Charge & Billing</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div><div className="text-xs" style={{ color:MUTED }}>Type</div><div className="text-sm font-bold" style={{ color:TEXT }}>{chargeLabel[trip.chargeType]}</div></div>
              <div><div className="text-xs" style={{ color:MUTED }}>Quoted</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>₦{trip.quotedFare.toLocaleString()}</div></div>
              {trip.finalFare && <div><div className="text-xs" style={{ color:MUTED }}>Final</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>₦{trip.finalFare.toLocaleString()}</div></div>}
              {trip.waitingSurcharge && <div><div className="text-xs" style={{ color:MUTED }}>Wait surcharge</div><div className="text-sm font-bold" style={{ color:ORANGE, fontFamily:mono }}>₦{trip.waitingSurcharge.toLocaleString()}</div></div>}
            </div>
            {trip.folioRef && (
              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor:BORDER }}>
                <div className="text-xs" style={{ color:MUTED }}>Folio: <span className="font-semibold" style={{ color:PRIMARY, fontFamily:mono }}>{trip.folioRef}</span></div>
                {trip.postedToFolio
                  ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#DCFCE7", color:"#166534" }}>Posted ✓</span>
                  : <button onClick={()=>add({type:"success",title:"Charge posted to folio",body:`₦${(trip.finalFare??trip.quotedFare).toLocaleString()} → ${trip.folioRef}`})} className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor:PRIMARY, color:"white" }}>Post to Folio</button>
                }
              </div>
            )}
            {trip.costCentre && (
              <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor:BORDER, color:MUTED }}>Cost Centre: <span className="font-semibold" style={{ color:TEXT, fontFamily:mono }}>{trip.costCentre}</span></div>
            )}
          </div>

          {/* Cancel info */}
          {trip.status === "cancelled" && trip.cancelReason && (
            <div className="p-3 rounded-xl" style={{ backgroundColor:"#FEF2F2", border:`1px solid #FECACA` }}>
              <div className="text-xs font-bold mb-1" style={{ color:ERROR }}>Trip Cancelled</div>
              <div className="text-xs" style={{ color:"#7F1D1D" }}>Reason: {trip.cancelReason}{trip.cancelNote ? ` — ${trip.cancelNote}` : ""}</div>
            </div>
          )}
        </div>

        {/* Right: crew, rating, timeline */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Vehicle & Driver</div>
            {veh
              ? [["Plate",veh.plate],["Type",`${veh.make} ${veh.model}`],["Seats",String(veh.type)],].map(([k,v])=>(
                  <div key={k} className="flex justify-between py-1.5 border-b last:border-b-0 text-xs" style={{ borderColor:BORDER }}><span style={{ color:MUTED }}>{k}</span><span className="font-semibold" style={{ color:TEXT, fontFamily:k==="Plate"?mono:undefined }}>{v}</span></div>
                ))
              : <div className="text-xs" style={{ color:MUTED }}>No vehicle assigned</div>
            }
            {drv && [["Driver",drv.name],["Licence",drv.licNo]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-1.5 border-b last:border-b-0 text-xs" style={{ borderColor:BORDER }}><span style={{ color:MUTED }}>{k}</span><span className="font-semibold" style={{ color:TEXT, fontFamily:k==="Licence"?mono:undefined }}>{v}</span></div>
            ))}
            {!drv && trip.driver && (
              <div className="flex justify-between py-1.5 text-xs border-t" style={{ borderColor:BORDER }}><span style={{ color:MUTED }}>Driver</span><span className="font-semibold" style={{ color:TEXT }}>{trip.driver}</span></div>
            )}
          </div>

          {trip.rating && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="text-sm font-semibold mb-2" style={{ color:TEXT }}>Guest Rating</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold" style={{ color:TEXT }}>{trip.rating}</div>
                <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} size={16} fill={s<=Math.round(trip.rating!)?WARNING:"none"} style={{ color:WARNING }}/>)}</div>
              </div>
              {trip.feedback && <div className="text-xs mt-1.5" style={{ color:MUTED }}>"{trip.feedback}"</div>}
            </div>
          )}

          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Event Timeline</div>
            <div className="space-y-2.5">
              {trip.events.map((e,i)=>(
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor:i===trip.events.length-1?PRIMARY:BORDER }}/>
                    {i<trip.events.length-1 && <div className="w-0.5 flex-1 bg-slate-200" style={{ minHeight:14 }}/>}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{e.time}</span>
                      <span className="text-xs font-semibold" style={{ color:TEXT }}>{e.event}</span>
                    </div>
                    <div className="text-xs" style={{ color:MUTED }}>{e.actor}{e.note ? ` · ${e.note}` : ""}</div>
                  </div>
                </div>
              ))}
              {trip.events.length === 0 && <div className="text-xs" style={{ color:SUBTLE }}>No events recorded yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. NewTripRequest ────────────────────────────────────────────────────────

type TripGroup = "guest" | "dept";
type GuestTripType = "Airport Transfer" | "Guest Charter";
type DeptTripType  = "Procurement Run" | "Staff Transport" | "Bank / Cash Run" | "Maintenance Run" | "Laundry & Linen" | "Event Support" | "Official Errand";
type TripType = GuestTripType | DeptTripType;

const DEPT_TRIP_TYPES: { type: DeptTripType; icon: React.FC<{size?:number;style?:React.CSSProperties}>; desc: string }[] = [
  { type: "Procurement Run",  icon: ShoppingCart, desc: "Supplies, market & vendor runs"   },
  { type: "Staff Transport",  icon: Users,        desc: "Pickup or drop-off of staff"       },
  { type: "Bank / Cash Run",  icon: Banknote,     desc: "Bank, cash collection or deposit"  },
  { type: "Maintenance Run",  icon: Wrench,       desc: "Equipment, tools & trade runs"     },
  { type: "Laundry & Linen",  icon: Package,      desc: "Linen pickup, laundry services"    },
  { type: "Event Support",    icon: Calendar,     desc: "Event setup, decor & support"      },
  { type: "Official Errand",  icon: FileText,     desc: "Ad-hoc official or admin errand"   },
];

type Priority = "Normal" | "Urgent" | "Emergency";

const VEHICLE_RATES = [
  { type:"Saloon",  baseRate:8000,  perKm:120, waiting:500  },
  { type:"SUV",     baseRate:12000, perKm:180, waiting:750  },
  { type:"Van",     baseRate:10000, perKm:150, waiting:600  },
  { type:"Bus",     baseRate:18000, perKm:200, waiting:1000 },
];

const DEPT_FROM_ROLE: Record<string, string> = {
  HK: "Housekeeping", MX: "Maintenance", RT: "F&B", FIN: "Finance",
  FD: "Front Desk", MGT: "Management",
};

const DEPT_DEFAULT_TYPE: Record<string, DeptTripType> = {
  HK: "Laundry & Linen", MX: "Maintenance Run", FIN: "Bank / Cash Run",
  RT: "Procurement Run", FD: "Official Errand",
};

export function NewTripRequest({ add, nav, deptRole }: { add: (t: Omit<Toast,"id">) => void; nav?: (s: string, label: string) => void; deptRole?: string }) {
  const isDept = !!deptRole && deptRole !== "MGT" && !!DEPT_FROM_ROLE[deptRole];
  const defaultGroup: TripGroup = isDept ? "dept" : "guest";
  const defaultDeptType: DeptTripType = isDept ? (DEPT_DEFAULT_TYPE[deptRole!] ?? "Official Errand") : "Procurement Run";

  const [group,       setGroup]       = useState<TripGroup>(defaultGroup);
  const [guestType,   setGuestType]   = useState<GuestTripType>("Airport Transfer");
  const [deptType,    setDeptType]    = useState<DeptTripType>(defaultDeptType);
  const [vehicleType, setVehicleType] = useState("Saloon");
  const [chargeType,  setChargeType]  = useState<ChargeType>(isDept ? "cost-centre" : "folio");
  const [estKm,       setEstKm]       = useState(15);
  const [priority,    setPriority]    = useState<Priority>("Normal");
  const [creating,    setCreating]    = useState(false);

  // Dept request form fields
  const [df, setDf] = useState({
    dept: isDept ? (DEPT_FROM_ROLE[deptRole!] ?? "") : "F&B",
    requestedBy: "", supervisor: "", dateNeeded: "", timeNeeded: "",
    from: "Grand Palms Abuja", to: "", passengers: "1", cargo: "", purpose: "", notes: "",
    costCentre: isDept ? (DEPT_FROM_ROLE[deptRole!]?.replace(/[^A-Z]/g,"") + "-OPS-001") : "",
  });

  const rate  = VEHICLE_RATES.find(r => r.type === vehicleType)!;
  const quote = rate.baseRate + rate.perKm * estKm;
  const total = quote;

  const inp = "w-full px-3 py-2 border rounded-xl text-xs outline-none";

  const confirm = () => {
    if (group === "dept") {
      if (!df.requestedBy.trim()) { add({ type:"error", title:"Requested by (staff name) is required" }); return; }
      if (!df.to.trim())          { add({ type:"error", title:"Destination is required" }); return; }
      if (!df.dateNeeded)         { add({ type:"error", title:"Date needed is required" }); return; }
    }
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      if (group === "dept") {
        add({ type:"success", title:"Request submitted — TRP-0042", body:"Sent to supervisor for approval. You will be notified once approved." });
      } else {
        add({ type:"success", title:"Trip created — TRP-0042", body:"Status: Requested. Waiting for dispatch assignment." });
        nav?.("dispatch-board", "Dispatch Board");
      }
    }, 1200);
  };

  const PriorityBtn = ({ p }: { p: Priority }) => {
    const colors: Record<Priority,{bg:string;border:string;text:string}> = {
      Normal:    { bg:"#F1F5F9", border:BORDER,   text:MUTED },
      Urgent:    { bg:"#FFF7ED", border:"#FED7AA", text:ORANGE },
      Emergency: { bg:"#FEF2F2", border:"#FECACA", text:ERROR },
    };
    const c = colors[p];
    return (
      <button onClick={() => setPriority(p)}
        className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
        style={{ borderColor: priority===p ? c.border : BORDER, backgroundColor: priority===p ? c.bg : "white", color: priority===p ? c.text : MUTED }}>
        {p}
      </button>
    );
  };

  return (
    <div>
      <PageHeader
        title="New Trip Request"
        sub={isDept ? (DEPT_FROM_ROLE[deptRole!] + " — vehicle request") : "Create a guest transfer, charter, or department vehicle request"}
      />

      {/* ── Group tabs ── */}
      {!isDept && (
        <div className="flex gap-2 mb-5 p-1 rounded-xl inline-flex" style={{ backgroundColor:"#F1F5F9" }}>
          {([["guest","Guest & Client Trips"],["dept","Department Request"]] as [TripGroup,string][]).map(([g,label]) => (
            <button key={g} onClick={() => setGroup(g)}
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ backgroundColor: group===g ? "white" : "transparent", color: group===g ? PRIMARY : MUTED,
                boxShadow: group===g ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Type selector ── */}
      {group === "guest" ? (
        <div className="grid grid-cols-2 gap-3 mb-5 max-w-lg">
          {([
            { t:"Airport Transfer" as GuestTripType, icon: Plane, desc:"Guest pickup or dropoff at airport" },
            { t:"Guest Charter"    as GuestTripType, icon: Car,   desc:"Hourly or day hire for guests or clients" },
          ]).map(({ t, icon: Icon, desc }) => (
            <button key={t} onClick={() => setGuestType(t)}
              className="p-4 rounded-xl border text-left transition-all"
              style={{ borderColor:guestType===t?PRIMARY:BORDER, backgroundColor:guestType===t?"#F8FAFF":"white", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <Icon size={20} className="mb-1.5" style={{ color:guestType===t?PRIMARY:SUBTLE }} />
              <div className="text-sm font-bold" style={{ color:guestType===t?PRIMARY:TEXT }}>{t}</div>
              <div className="text-xs mt-0.5" style={{ color:MUTED }}>{desc}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-5">
          {DEPT_TRIP_TYPES.map(({ type: t, icon: Icon, desc }) => (
            <button key={t} onClick={() => setDeptType(t)}
              className="p-3.5 rounded-xl border text-left transition-all"
              style={{ borderColor:deptType===t?PRIMARY:BORDER, backgroundColor:deptType===t?"#F8FAFF":"white", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <Icon size={18} className="mb-1.5" style={{ color:deptType===t?PRIMARY:SUBTLE }} />
              <div className="text-sm font-bold leading-tight" style={{ color:deptType===t?PRIMARY:TEXT }}>{t}</div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color:MUTED }}>{desc}</div>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Main form ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* ── GUEST FORMS ── */}
          {group === "guest" && (
            <div className="bg-white rounded-xl border p-4 space-y-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="text-sm font-semibold" style={{ color:TEXT }}>{guestType === "Airport Transfer" ? "Transfer Details" : "Charter Details"}</div>

              {guestType === "Airport Transfer" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Direction</div>
                    <select className={inp} style={{ borderColor:BORDER }}>
                      <option>Arrival pickup — airport → hotel</option>
                      <option>Departure drop-off — hotel → airport</option>
                    </select>
                  </div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Reservation (optional)</div><input placeholder="Search reservation or guest…" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Guest Name *</div><input placeholder="e.g. Dr. Amaka Osei" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Flight Number</div><input placeholder="e.g. DL421" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Arrival / Departure Time *</div><input type="time" defaultValue="14:30" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Terminal</div><select className={inp} style={{ borderColor:BORDER }}><option>International</option><option>Domestic</option></select></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Passengers</div><input type="number" defaultValue="1" min={1} max={20} className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Luggage (bags)</div><input type="number" defaultValue="2" min={0} className={inp} style={{ borderColor:BORDER }} /></div>
                </div>
              )}

              {guestType === "Guest Charter" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Guest / Client *</div><input placeholder="Guest name or company" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Duration Basis</div><select className={inp} style={{ borderColor:BORDER }}><option>Hourly</option><option>Half-day (4h)</option><option>Full day (8h)</option></select></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Start Date & Time *</div><input type="datetime-local" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Estimated End</div><input type="datetime-local" className={inp} style={{ borderColor:BORDER }} /></div>
                  <div className="lg:col-span-2"><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Destination / Itinerary</div><input placeholder="e.g. Aso Rock → National Assembly → CBD" className={inp} style={{ borderColor:BORDER }} /></div>
                </div>
              )}

              <div className="pt-2 border-t" style={{ borderColor:BORDER }}>
                <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Special Instructions</div>
                <textarea rows={2} placeholder="VIP handling, accessibility needs, extra stops…" className={"resize-none " + inp} style={{ borderColor:BORDER }} />
              </div>
            </div>
          )}

          {/* ── DEPARTMENT REQUEST FORM ── */}
          {group === "dept" && (
            <>
              {/* Requestor info */}
              <div className="bg-white rounded-xl border p-4 space-y-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="text-sm font-semibold" style={{ color:TEXT }}>Request Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Department</div>
                    {isDept
                      ? <div className={inp + " font-semibold"} style={{ borderColor:BORDER, backgroundColor:"#F9FAFB", color:TEXT }}>{DEPT_FROM_ROLE[deptRole!]}</div>
                      : <select value={df.dept} onChange={e => setDf(f => ({ ...f, dept: e.target.value }))} className={inp} style={{ borderColor:BORDER }}>
                          {Object.values(DEPT_FROM_ROLE).filter(d => d !== "Management").map(d => <option key={d}>{d}</option>)}
                        </select>
                    }
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Requested By (Staff Name) *</div>
                    <input value={df.requestedBy} onChange={e => setDf(f => ({ ...f, requestedBy: e.target.value }))} placeholder="Your full name" className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Supervisor / Approver</div>
                    <input value={df.supervisor} onChange={e => setDf(f => ({ ...f, supervisor: e.target.value }))} placeholder="Name of approving supervisor" className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Cost Centre</div>
                    <input value={df.costCentre} onChange={e => setDf(f => ({ ...f, costCentre: e.target.value }))} placeholder="e.g. FB-OPS-001" className={inp} style={{ borderColor:BORDER }} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium mb-1.5" style={{ color:MUTED }}>Priority</div>
                  <div className="flex gap-2">
                    <PriorityBtn p="Normal" /><PriorityBtn p="Urgent" /><PriorityBtn p="Emergency" />
                  </div>
                </div>
              </div>

              {/* Trip info */}
              <div className="bg-white rounded-xl border p-4 space-y-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="text-sm font-semibold flex items-center gap-2" style={{ color:TEXT }}>
                  Trip Information
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>{deptType}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Date Needed *</div>
                    <input type="date" value={df.dateNeeded} onChange={e => setDf(f => ({ ...f, dateNeeded: e.target.value }))} className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Time Needed</div>
                    <input type="time" value={df.timeNeeded} onChange={e => setDf(f => ({ ...f, timeNeeded: e.target.value }))} className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Departure / From</div>
                    <input value={df.from} onChange={e => setDf(f => ({ ...f, from: e.target.value }))} className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Destination / To *</div>
                    <input value={df.to} onChange={e => setDf(f => ({ ...f, to: e.target.value }))}
                      placeholder={deptType==="Bank / Cash Run"?"Bank name & branch":deptType==="Procurement Run"?"e.g. FreshMart Wuse II":"Destination"} className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>
                      {deptType === "Procurement Run" ? "Items / Goods to Collect" : deptType === "Bank / Cash Run" ? "Authorised Amount (₦)" : deptType === "Staff Transport" ? "Number of Staff" : "Passengers / Load"}
                    </div>
                    <input value={df.cargo} onChange={e => setDf(f => ({ ...f, cargo: e.target.value }))}
                      placeholder={deptType==="Procurement Run"?"e.g. 50kg rice, vegetables, cleaning supplies":deptType==="Bank / Cash Run"?"e.g. ₦500,000":""}
                      className={inp} style={{ borderColor:BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Trip Purpose / Description</div>
                    <input value={df.purpose} onChange={e => setDf(f => ({ ...f, purpose: e.target.value }))} placeholder="Brief description of why this trip is needed" className={inp} style={{ borderColor:BORDER }} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Additional Notes for Driver</div>
                  <textarea rows={2} value={df.notes} onChange={e => setDf(f => ({ ...f, notes: e.target.value }))} placeholder="Loading bay access, contact at destination, time constraints…" className={"resize-none " + inp} style={{ borderColor:BORDER }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Vehicle & {group==="dept"?"Class Preference":"Rate"}</div>
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Vehicle Class</div>
              <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                {VEHICLE_RATES.map(r=><option key={r.type}>{r.type}</option>)}
              </select>
            </div>

            {group === "guest" && (
              <>
                <div className="mb-3">
                  <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Estimated Distance (km)</div>
                  <input type="number" value={estKm} onChange={e=>setEstKm(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
                </div>
                <div className="p-3 rounded-xl space-y-1.5 mb-3" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color:MUTED }}>Quote Breakdown</div>
                  {[["Base rate",`₦${rate.baseRate.toLocaleString()}`],[`Per km (${estKm} km)`,`₦${(rate.perKm*estKm).toLocaleString()}`],["Waiting time","Metered at ₦"+rate.waiting+"/15min"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between text-xs"><span style={{ color:MUTED }}>{k}</span><span style={{ color:TEXT }}>{v}</span></div>
                  ))}
                  <div className="flex justify-between text-sm font-bold pt-1.5 border-t" style={{ borderColor:BORDER }}>
                    <span style={{ color:TEXT }}>Quoted Total</span>
                    <span style={{ color:PRIMARY, fontFamily:mono }}>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {group === "dept" && (
              <div className="mb-3 p-3 rounded-xl text-xs" style={{ backgroundColor:"#F0F9FF", border:"1px solid #BAE6FD", color:"#0369A1" }}>
                This request will be routed to your supervisor for approval before a vehicle is dispatched. You will receive a notification on the outcome.
              </div>
            )}

            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Charge Type</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(["folio","complimentary","cost-centre","cash"] as ChargeType[]).map(ct=>(
                  <button key={ct} onClick={()=>setChargeType(ct)} className="py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor:chargeType===ct?PRIMARY:BORDER, backgroundColor:chargeType===ct?"#F8FAFF":"white", color:chargeType===ct?PRIMARY:MUTED }}>
                    {ct==="cost-centre"?"Cost Centre":ct.charAt(0).toUpperCase()+ct.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={confirm} disabled={creating} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
            {creating ? "Submitting…" : group==="dept" ? "Submit for Supervisor Approval" : "Create Trip Request"}
          </button>

          {group === "dept" && priority !== "Normal" && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: priority==="Emergency"?"#FEF2F2":"#FFF7ED", color: priority==="Emergency"?ERROR:ORANGE, border:`1px solid ${priority==="Emergency"?"#FECACA":"#FED7AA"}` }}>
              <AlertTriangle size={13} />
              {priority} — supervisors and dispatch will be alerted immediately.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 4. DriverRoster ─────────────────────────────────────────────────────────

// Staff pool — hotel employees who can be designated as drivers
interface StaffMember { id: string; name: string; dept: string; empId: string; }
const STAFF_POOL: StaffMember[] = [
  { id:"EMP-010", name:"Tunde Adeleke",   dept:"Security",    empId:"SC-1012" },
  { id:"EMP-011", name:"Yakubu Sule",     dept:"Security",    empId:"SC-1013" },
  { id:"EMP-012", name:"Sunday Afolabi",  dept:"Security",    empId:"SC-1014" },
  { id:"EMP-013", name:"Obinna Okeke",    dept:"Maintenance", empId:"MX-2341" },
  { id:"EMP-014", name:"Badmus Yusuf",    dept:"Logistics",   empId:"LG-0091" },
  { id:"EMP-015", name:"Chukwudi Eze",    dept:"F&B",         empId:"FB-3321" },
];

// HR shift schedule — synced from the Shift Scheduler module
// Keys: driver ID (DRV-xxx for seeded drivers, EMP-xxx for staff added from pool)
const HR_DRIVER_SHIFTS: Record<string, HRShift> = {
  "DRV-001": "Morning", "DRV-002": "Morning", "DRV-003": "Evening", "DRV-004": "Off",
  "EMP-010": "Morning", "EMP-011": "Evening", "EMP-012": "Off",
  "EMP-013": "Morning", "EMP-014": "Morning", "EMP-015": "Night",
};

const SHIFT_PILL: Record<HRShift,{bg:string;text:string}> = {
  Morning: { bg:"#DCFCE7", text:"#166534" },
  Evening: { bg:"#DBEAFE", text:"#1E40AF" },
  Night:   { bg:"#EDE9FE", text:"#6D28D9" },
  Off:     { bg:"#F3F4F6", text:"#71717A" },
};

const ROSTER_DAYS = ["Mon 13","Tue 14","Wed 15","Thu 16","Fri 17","Sat 18","Sun 19"] as const;
const ROSTER_WEEK = "13–19 Oct 2025";

// Weekly shift schedule per driver — mutable so approved proposals update it
const DRIVER_WEEK_SCHEDULE: Record<string, Record<string, HRShift>> = {
  "DRV-001": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Morning","Thu 16":"Morning","Fri 17":"Morning","Sat 18":"Off",    "Sun 19":"Off"     },
  "DRV-002": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Evening","Thu 16":"Morning","Fri 17":"Morning","Sat 18":"Off",    "Sun 19":"Off"     },
  "DRV-003": { "Mon 13":"Evening","Tue 14":"Evening","Wed 15":"Evening","Thu 16":"Off",    "Fri 17":"Evening","Sat 18":"Evening","Sun 19":"Off"     },
  "DRV-004": { "Mon 13":"Off",    "Tue 14":"Off",    "Wed 15":"Off",    "Thu 16":"Off",    "Fri 17":"Off",    "Sat 18":"Morning","Sun 19":"Morning" },
};

export function DriverRoster({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [drivers, setDrivers] = useState(DRIVERS);
  const [selected, setSelected] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [assignVehicleId, setAssignVehicleId] = useState("");

  // Add Driver modal state
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [staffSearch, setStaffSearch] = useState("");
  const [pickedStaff, setPickedStaff] = useState<StaffMember | null>(null);
  const [nf, setNf] = useState({ licNo:"", licClass:"B", licExpiry:"", medExpiry:"", permitRef:"", vehicleId:"" });

  // Shift Schedule tab
  const [activeTab, setActiveTab] = useState<"roster" | "shifts">("roster");
  const [weekSchedule, setWeekSchedule] = useState<Record<string, Record<string, HRShift>>>(() =>
    Object.fromEntries(DRIVERS.map(d => [d.id, { ...(DRIVER_WEEK_SCHEDULE[d.id] ?? {}) }]))
  );
  const [proposals, setProposals] = useState<ShiftProposal[]>(() => ShiftProposalStore.getAll());
  const [shiftModal, setShiftModal] = useState<{ driverId: string; driverName: string; day: string; current: HRShift } | null>(null);
  const [proposedShift, setProposedShift] = useState<HRShift>("Morning");
  const [proposalReason, setProposalReason] = useState("");

  const alreadyDriverIds = new Set(drivers.map(d => d.hrEmpId).filter(Boolean));
  const availableStaff = STAFF_POOL.filter(s => !alreadyDriverIds.has(s.id));
  const filteredStaff = availableStaff.filter(s =>
    s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.dept.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const inp = "w-full px-3 py-2 border rounded-xl text-xs outline-none";

  const closeModal = () => { setShowAddDriver(false); setAddStep(1); setPickedStaff(null); setStaffSearch(""); setNf({ licNo:"", licClass:"B", licExpiry:"", medExpiry:"", permitRef:"", vehicleId:"" }); };

  const confirmAddDriver = () => {
    if (!pickedStaff) return;
    if (!nf.licNo.trim()) { add({ type:"error", title:"Licence number is required" }); return; }
    if (!nf.licExpiry)    { add({ type:"error", title:"Licence expiry date is required" }); return; }
    if (!nf.medExpiry)    { add({ type:"error", title:"Medical certificate expiry is required" }); return; }
    const msDay = 86400000;
    const licDaysLeft = Math.round((new Date(nf.licExpiry).getTime() - Date.now()) / msDay);
    const medDaysLeft = Math.round((new Date(nf.medExpiry).getTime() - Date.now()) / msDay);
    const fmt = (s: string) => new Date(s).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
    const hrShift: HRShift = HR_DRIVER_SHIFTS[pickedStaff.id] ?? "Off";
    const newId = `DRV-${String(drivers.length + 1).padStart(3, "0")}`;
    const newDriver: Driver = {
      id: newId, name: pickedStaff.name,
      licNo: nf.licNo, licClass: nf.licClass,
      licExpiry: fmt(nf.licExpiry), licDaysLeft,
      medExpiry: fmt(nf.medExpiry), medDaysLeft,
      permitRef: nf.permitRef || `NIG/DP/${new Date().getFullYear()}/${String(Math.floor(Math.random()*9000)+1000)}`,
      vehicle: nf.vehicleId || undefined,
      onDuty: hrShift !== "Off",
      tripsToday: 0, tripsMonth: 0, totalKm: 0, avgRating: 0, incidents: 0,
      status: hrShift !== "Off" ? "available" : "off-duty",
      hrShift, hrEmpId: pickedStaff.id,
    };
    setDrivers(prev => [...prev, newDriver]);
    add({ type:"success", title:`${pickedStaff.name} added to driver roster`, body:`HR Shift: ${hrShift} · ID: ${newId}` });
    closeModal();
  };

  const syncFromHR = () => {
    setDrivers(prev => prev.map(d => {
      if (d.status === "suspended" || d.status === "on-trip") return d;
      const shift: HRShift = HR_DRIVER_SHIFTS[d.id] ?? HR_DRIVER_SHIFTS[d.hrEmpId ?? ""] ?? "Off";
      const onDuty = shift !== "Off";
      return { ...d, hrShift: shift, onDuty, shiftOverride: false, status: onDuty ? "available" : "off-duty" } as Driver;
    }));
    add({ type:"success", title:"Duty status synced from HR shifts", body:"All manual overrides cleared." });
  };

  const DRIVER_STATUS_PILL: Record<Driver["status"], { bg:string; text:string }> = {
    available: { bg:"#DCFCE7", text:"#166534" },
    "on-trip": { bg:"#FEF3C7", text:"#92400E" },
    "off-duty":{ bg:"#F1F5F9", text:"#64748B" },
    suspended: { bg:"#FEE2E2", text:"#991B1B" },
  };

  const toggleDuty = (id: string) => {
    const d = drivers.find(x => x.id === id)!;
    if (d.status === "suspended") { add({ type:"error", title:"Cannot change duty — driver is suspended" }); return; }
    if (d.status === "on-trip")   { add({ type:"error", title:"Cannot change duty — driver is on a trip" }); return; }
    const nowOnDuty = !d.onDuty;
    setDrivers(prev => prev.map(x => x.id===id
      ? { ...x, onDuty: nowOnDuty, shiftOverride: true, status: (nowOnDuty ? "available" : "off-duty") as Driver["status"] }
      : x
    ));
    add({ type:"info", title:`${d.name} manually set ${nowOnDuty ? "on" : "off"} duty`, body:"Override applied — use Sync from HR to restore schedule." });
  };

  const confirmSuspend = (id: string) => {
    if (!suspendReason.trim()) { add({ type:"error", title:"Reason is required to suspend a driver" }); return; }
    const d = drivers.find(x => x.id === id)!;
    setDrivers(prev => prev.map(x => x.id===id ? { ...x, status:"suspended" as Driver["status"], onDuty:false } : x));
    add({ type:"warning", title:`${d.name} suspended`, body:suspendReason.trim() });
    setSuspendTarget(null); setSuspendReason("");
  };

  const unsuspend = (id: string) => {
    const d = drivers.find(x => x.id === id)!;
    const hrShift: HRShift = HR_DRIVER_SHIFTS[d.id] ?? HR_DRIVER_SHIFTS[d.hrEmpId ?? ""] ?? "Off";
    setDrivers(prev => prev.map(x => x.id===id ? { ...x, status:(hrShift !== "Off" ? "available" : "off-duty") as Driver["status"], onDuty: hrShift !== "Off", hrShift } : x));
    add({ type:"success", title:`${d.name} suspension lifted`, body:`Restored to HR shift: ${hrShift}` });
  };

  const confirmAssign = (driverId: string) => {
    if (!assignVehicleId) { add({ type:"error", title:"Select a vehicle to assign" }); return; }
    const veh = VEHICLES.find(v => v.id === assignVehicleId);
    setDrivers(prev => prev.map(d => d.id===driverId ? { ...d, vehicle:assignVehicleId } : d));
    add({ type:"success", title:"Vehicle assigned", body:`${veh?.plate} → ${drivers.find(d=>d.id===driverId)?.name}` });
    setAssignTarget(null); setAssignVehicleId("");
  };

  const submitShiftProposal = () => {
    if (!shiftModal) return;
    if (!proposalReason.trim()) { add({ type:"error", title:"A reason is required for the shift change" }); return; }
    const capturedShift = proposedShift;
    const capturedModal = { ...shiftModal };
    const id = ShiftProposalStore.create({
      driverId: capturedModal.driverId,
      driverName: capturedModal.driverName,
      day: capturedModal.day,
      weekOf: ROSTER_WEEK,
      currentShift: capturedModal.current,
      proposedShift: capturedShift,
      reason: proposalReason.trim(),
      proposedBy: "Fleet Manager",
      proposedAt: new Date().toLocaleString("en-GB", { dateStyle:"medium", timeStyle:"short" }),
    });
    setProposals(ShiftProposalStore.getAll());
    add({ type:"info", title:"Shift proposal sent to HR", body:`${capturedModal.driverName}: ${capturedModal.day} · ${capturedModal.current} → ${capturedShift}` });
    setShiftModal(null);
    setProposalReason("");
    const willApprove = Math.random() > 0.15;
    setTimeout(() => {
      if (willApprove) {
        ShiftProposalStore.approve(id, "HR Manager");
        setWeekSchedule(prev => ({ ...prev, [capturedModal.driverId]: { ...prev[capturedModal.driverId], [capturedModal.day]: capturedShift } }));
        setDrivers(prev => prev.map(d => d.id === capturedModal.driverId ? { ...d, hrShift: capturedShift } : d));
        add({ type:"success", title:"HR approved shift change", body:`${capturedModal.driverName}: ${capturedModal.day} → ${capturedShift}` });
      } else {
        ShiftProposalStore.reject(id, "HR Manager", "Insufficient staffing justification — resubmit with operational notes.");
        add({ type:"error", title:"HR rejected shift change", body:`${capturedModal.driverName}: ${capturedModal.day} unchanged` });
      }
      setProposals(ShiftProposalStore.getAll());
    }, 4000 + Math.random() * 3000);
  };

  return (
    <div>
      <PageHeader title="Driver Roster"
        sub="Licence validity · HR shift sync · vehicle assignment · suspension"
        actions={
          <div className="flex gap-2">
            <BtnO label="Sync from HR" icon={RefreshCw} onClick={syncFromHR} />
            <BtnP label="Add Driver" icon={Plus} onClick={() => setShowAddDriver(true)} />
          </div>
        }
      />

      {/* ── Add Driver modal ── */}
      {showAddDriver && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ backgroundColor:"rgba(0,0,0,0.55)", backdropFilter:"blur(2px)" }}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight:"92vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:BORDER }}>
              <div>
                <div className="text-sm font-bold" style={{ color:TEXT }}>Add Driver to Roster</div>
                <div className="text-xs mt-0.5" style={{ color:MUTED }}>Step {addStep} of 2 — {addStep===1?"Select existing staff":"Enter driving credentials"}</div>
              </div>
              <button onClick={closeModal} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color:MUTED, backgroundColor:"#F1F5F9" }}>
                <XCircle size={15} />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight:"calc(92vh - 130px)" }}>
              {/* Step 1 — pick staff */}
              {addStep === 1 && (
                <div className="p-5">
                  <div className="relative mb-3">
                    <Search size={13} className="absolute left-3 top-2.5" style={{ color:MUTED }} />
                    <input
                      value={staffSearch} onChange={e => setStaffSearch(e.target.value)}
                      placeholder="Search by name or department…"
                      className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}
                    />
                  </div>
                  {filteredStaff.length === 0 ? (
                    <div className="text-center py-8 text-xs" style={{ color:MUTED }}>
                      {availableStaff.length === 0 ? "All eligible staff are already on the driver roster." : "No staff matching your search."}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredStaff.map(s => (
                        <button key={s.id} onClick={() => setPickedStaff(pickedStaff?.id === s.id ? null : s)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                          style={{ borderColor: pickedStaff?.id===s.id ? PRIMARY : BORDER, backgroundColor: pickedStaff?.id===s.id ? "#F8FAFF" : "white" }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: pickedStaff?.id===s.id ? PRIMARY : SUBTLE }}>
                            {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold" style={{ color:TEXT }}>{s.name}</div>
                            <div className="text-xs" style={{ color:MUTED }}>{s.dept} · {s.empId}</div>
                          </div>
                          {HR_DRIVER_SHIFTS[s.id] && HR_DRIVER_SHIFTS[s.id] !== "Off" && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={{ backgroundColor: SHIFT_PILL[HR_DRIVER_SHIFTS[s.id]!].bg, color: SHIFT_PILL[HR_DRIVER_SHIFTS[s.id]!].text }}>
                              {HR_DRIVER_SHIFTS[s.id]}
                            </span>
                          )}
                          {pickedStaff?.id === s.id && <CheckCircle2 size={16} className="flex-shrink-0" style={{ color:PRIMARY }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 — driving credentials */}
              {addStep === 2 && pickedStaff && (
                <div className="p-5 space-y-4">
                  {/* Selected staff display */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor:"#F8FAFF", border:`1px solid ${BORDER}` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
                      {pickedStaff.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color:TEXT }}>{pickedStaff.name}</div>
                      <div className="text-xs" style={{ color:MUTED }}>{pickedStaff.dept} · {pickedStaff.empId}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs" style={{ color:MUTED }}>HR Shift</div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: SHIFT_PILL[HR_DRIVER_SHIFTS[pickedStaff.id] ?? "Off"].bg, color: SHIFT_PILL[HR_DRIVER_SHIFTS[pickedStaff.id] ?? "Off"].text }}>
                        {HR_DRIVER_SHIFTS[pickedStaff.id] ?? "Off"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Driving Licence Number *</div>
                      <input value={nf.licNo} onChange={e => setNf(f => ({ ...f, licNo: e.target.value }))}
                        placeholder="e.g. FCT/DL/2023/12345" className={inp} style={{ borderColor:BORDER }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Licence Class</div>
                      <select value={nf.licClass} onChange={e => setNf(f => ({ ...f, licClass: e.target.value }))} className={inp} style={{ borderColor:BORDER }}>
                        {["A","B","C","D","E"].map(c => <option key={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Licence Expiry *</div>
                      <input type="date" value={nf.licExpiry} onChange={e => setNf(f => ({ ...f, licExpiry: e.target.value }))} className={inp} style={{ borderColor:BORDER }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Medical Cert. Expiry *</div>
                      <input type="date" value={nf.medExpiry} onChange={e => setNf(f => ({ ...f, medExpiry: e.target.value }))} className={inp} style={{ borderColor:BORDER }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Permit Reference</div>
                      <input value={nf.permitRef} onChange={e => setNf(f => ({ ...f, permitRef: e.target.value }))}
                        placeholder="Auto-generated if blank" className={inp} style={{ borderColor:BORDER }} />
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Assign Vehicle (optional)</div>
                      <select value={nf.vehicleId} onChange={e => setNf(f => ({ ...f, vehicleId: e.target.value }))} className={inp} style={{ borderColor:BORDER }}>
                        <option value="">No vehicle yet</option>
                        {VEHICLES.filter(v => v.status !== "maintenance").map(v => (
                          <option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 px-5 py-4 border-t" style={{ borderColor:BORDER }}>
              {addStep === 1 ? (
                <>
                  <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor:BORDER, color:MUTED }}>Cancel</button>
                  <button onClick={() => { if (!pickedStaff) { add({ type:"error", title:"Select a staff member first" }); return; } setAddStep(2); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
                    Next — Enter Credentials
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setAddStep(1)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor:BORDER, color:MUTED }}>← Back</button>
                  <button onClick={confirmAddDriver} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
                    Add to Roster
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shift proposal modal */}
      {shiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:"rgba(0,0,0,0.55)", backdropFilter:"blur(2px)" }}>
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:BORDER }}>
              <div>
                <div className="text-sm font-bold" style={{ color:TEXT }}>Propose Shift Change</div>
                <div className="text-xs mt-0.5" style={{ color:MUTED }}>{shiftModal.driverName} · {shiftModal.day}</div>
              </div>
              <button onClick={() => { setShiftModal(null); setProposalReason(""); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color:MUTED, backgroundColor:"#F1F5F9" }}>
                <XCircle size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor:"#F9FAFB", border:`1px solid ${BORDER}` }}>
                <div className="text-xs" style={{ color:MUTED }}>Current shift</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:SHIFT_PILL[shiftModal.current].bg, color:SHIFT_PILL[shiftModal.current].text }}>{shiftModal.current}</span>
                  <span className="text-xs" style={{ color:MUTED }}>on {shiftModal.day}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color:TEXT }}>Proposed shift</label>
                <div className="flex gap-2 flex-wrap">
                  {(["Morning","Evening","Night","Off"] as HRShift[]).map(s => (
                    <button key={s} onClick={() => setProposedShift(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                      style={proposedShift===s ? { backgroundColor:SHIFT_PILL[s].bg, color:SHIFT_PILL[s].text, borderColor:SHIFT_PILL[s].text } : { borderColor:BORDER, color:MUTED, backgroundColor:"white" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color:TEXT }}>Reason for change</label>
                <textarea rows={3} value={proposalReason} onChange={e => setProposalReason(e.target.value)}
                  placeholder="Explain the operational need for this shift change…"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none"
                  style={{ borderColor:BORDER, color:TEXT }} />
              </div>
              <div className="p-2.5 rounded-xl text-xs" style={{ backgroundColor:"#EFF6FF", color:"#1E40AF" }}>
                HR will review and approve or reject this request. You will be notified of the outcome.
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t" style={{ borderColor:BORDER }}>
              <button onClick={() => { setShiftModal(null); setProposalReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor:BORDER, color:MUTED }}>Cancel</button>
              <button onClick={submitShiftProposal} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
                Submit to HR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 bg-white border rounded-xl p-1 w-fit" style={{ borderColor:BORDER }}>
        {([["roster","Roster"],["shifts","Shift Schedule"]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={activeTab===tab ? { backgroundColor:PRIMARY, color:"white" } : { color:MUTED }}>
            {label}
            {tab==="shifts" && proposals.filter(p=>p.status==="pending").length>0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full font-bold align-middle"
                style={{ backgroundColor:activeTab==="shifts"?"rgba(255,255,255,0.3)":"#F59E0B", color:"white", fontSize:9 }}>
                {proposals.filter(p=>p.status==="pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Roster tab ── */}
      {activeTab === "roster" && (
        <>
          {drivers.some(d=>d.licDaysLeft<0||d.medDaysLeft<0||d.status==="suspended") && (
            <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor:"#FEF3C7", border:`1px solid #FDE68A` }}>
              <div className="text-xs font-bold mb-1" style={{ color:"#92400E" }}>Compliance & Status Alerts</div>
              {drivers.filter(d=>d.status==="suspended").map(d=><div key={d.id+"s"} className="text-xs font-semibold" style={{ color:ERROR }}>🚫 {d.name} — SUSPENDED. Cannot be dispatched.</div>)}
              {drivers.filter(d=>d.licDaysLeft<0).map(d=><div key={d.id+"l"} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Licence EXPIRED ({d.licExpiry}). Remove from duty immediately.</div>)}
              {drivers.filter(d=>d.medDaysLeft<0).map(d=><div key={d.id+"m"} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Medical certificate EXPIRED ({d.medExpiry}).</div>)}
              {drivers.filter(d=>d.licDaysLeft>=0&&d.licDaysLeft<=30).map(d=><div key={d.id+"lw"} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Licence expires in {d.licDaysLeft} days.</div>)}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard label="Total Drivers"    value={String(drivers.length)}                                    sub="On roster"         icon={Users}         accent={PRIMARY} />
            <StatCard label="On Duty"          value={String(drivers.filter(d=>d.onDuty).length)}                sub="Available/On trip" icon={UserCheck}     accent={SUCCESS} />
            <StatCard label="Suspended"        value={String(drivers.filter(d=>d.status==="suspended").length)}  sub="Cannot dispatch"   icon={XCircle}       accent={ERROR}   />
            <StatCard label="Trips This Month" value={String(drivers.reduce((s,d)=>s+d.tripsMonth,0))}          sub="All drivers"       icon={Car}           accent={TEAL}    />
          </div>

          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <table className="w-full">
              <thead><TH cols={["Driver","Licence","Lic. Expiry","Med. Cert","Vehicle","Shift (HR)","Status","Trips (Mo)","Rating","Actions"]} /></thead>
              <tbody>
                {drivers.map(d => {
                  const sel = selected === d.id;
                  const isSuspended = d.status === "suspended";
                  const sp = DRIVER_STATUS_PILL[d.status];
                  const rowBg = isSuspended ? "#FFFAF0" : "white";
                  return (
                    <>
                      <tr key={d.id} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor:BORDER, backgroundColor:rowBg }} onClick={() => setSelected(sel ? null : d.id)}>
                        <td className="px-3 py-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mb-0.5" style={{ backgroundColor:isSuspended?"#DC2626":PRIMARY }}>
                            {d.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div className="text-xs font-semibold" style={{ color:TEXT }}>{d.name}</div>
                        </td>
                        <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{d.licNo}<br/><span style={{ color:SUBTLE }}>Class {d.licClass}</span></td>
                        <td className="px-3 py-2.5"><ExpiryBadge days={d.licDaysLeft} label={d.licExpiry} /></td>
                        <td className="px-3 py-2.5"><ExpiryBadge days={d.medDaysLeft} label={d.medExpiry} /></td>
                        <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{d.vehicle ?? "—"}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold w-fit" style={{ backgroundColor:SHIFT_PILL[d.hrShift].bg, color:SHIFT_PILL[d.hrShift].text }}>{d.hrShift}</span>
                            {d.shiftOverride && <span className="text-xs" style={{ color:ORANGE, fontSize:10 }}>⚡ override</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:sp.bg, color:sp.text }}>{d.status}</span></td>
                        <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT }}>{d.tripsMonth}</td>
                        <td className="px-3 py-2.5 text-xs"><span className="flex items-center gap-1"><Star size={11} style={{ color:WARNING }} />{d.avgRating}</span></td>
                        <td className="px-3 py-2.5">
                          <div className="flex gap-1 flex-wrap">
                            {!isSuspended && (
                              <button onClick={e=>{e.stopPropagation();toggleDuty(d.id);}} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor:BORDER, color:d.onDuty?WARNING:SUCCESS }} title={d.onDuty?"Set Off Duty":"Set On Duty"}>
                                {d.onDuty ? <UserX size={11}/> : <UserCheck size={11}/>}
                              </button>
                            )}
                            {!isSuspended && (
                              <button onClick={e=>{e.stopPropagation();setAssignTarget(assignTarget===d.id?null:d.id);setSuspendTarget(null);}} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor:BORDER, color:PRIMARY }} title="Assign vehicle">
                                <Car size={11}/>
                              </button>
                            )}
                            {isSuspended ? (
                              <button onClick={e=>{e.stopPropagation();unsuspend(d.id);}} className="px-2 py-1 rounded-lg text-xs border font-semibold" style={{ borderColor:"#FCA5A5", color:SUCCESS, backgroundColor:"#F0FDF4" }} title="Lift suspension">
                                Lift
                              </button>
                            ) : (
                              <button onClick={e=>{e.stopPropagation();setSuspendTarget(suspendTarget===d.id?null:d.id);setAssignTarget(null);setSuspendReason("");}} className="px-2 py-1 rounded-lg text-xs border hover:bg-red-50" style={{ borderColor:"#FCA5A5", color:ERROR }} title="Suspend driver">
                                <XCircle size={11}/>
                              </button>
                            )}
                            {d.incidents > 0 && (
                              <button onClick={e=>e.stopPropagation()} className="px-2 py-1 rounded-lg text-xs border" style={{ borderColor:"#FCA5A5", color:ERROR }} title={`${d.incidents} incident(s) on record`}>
                                <AlertTriangle size={11}/>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {suspendTarget === d.id && (
                        <tr key={`${d.id}-suspend`} style={{ backgroundColor:"#FFF1F2" }}>
                          <td colSpan={10} className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <XCircle size={14} style={{ color:ERROR }} />
                              <span className="text-xs font-bold" style={{ color:ERROR }}>Suspend {d.name}</span>
                              <input autoFocus value={suspendReason} onChange={e => setSuspendReason(e.target.value)}
                                placeholder="Enter reason for suspension (required)…"
                                className="flex-1 px-3 py-1.5 border rounded-lg text-xs outline-none"
                                style={{ borderColor:ERROR }}
                                onKeyDown={e => e.key === "Enter" && confirmSuspend(d.id)}
                              />
                              <button onClick={() => confirmSuspend(d.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor:ERROR }}>Confirm Suspend</button>
                              <button onClick={() => { setSuspendTarget(null); setSuspendReason(""); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {assignTarget === d.id && (
                        <tr key={`${d.id}-assign`} style={{ backgroundColor:"#EFF6FF" }}>
                          <td colSpan={10} className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Car size={14} style={{ color:PRIMARY }} />
                              <span className="text-xs font-bold" style={{ color:PRIMARY }}>Assign vehicle to {d.name}</span>
                              <select value={assignVehicleId} onChange={e => setAssignVehicleId(e.target.value)} className="flex-1 max-w-xs px-3 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor:PRIMARY }}>
                                <option value="">Select vehicle…</option>
                                {VEHICLES.filter(v => v.status !== "maintenance").map(v => (
                                  <option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model} ({v.status})</option>
                                ))}
                              </select>
                              <button onClick={() => confirmAssign(d.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Assign</button>
                              <button onClick={() => { setAssignTarget(null); setAssignVehicleId(""); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {sel && !suspendTarget && !assignTarget && (
                        <tr key={`${d.id}-detail`} style={{ backgroundColor:"#F9FAFB" }}>
                          <td colSpan={10} className="px-4 py-3 text-xs" style={{ color:MUTED }}>
                            <div className="flex gap-6 flex-wrap items-center">
                              <span>Permit: <strong style={{ fontFamily:mono, color:TEXT }}>{d.permitRef}</strong></span>
                              <span>Total km: <strong style={{ color:TEXT }}>{d.totalKm.toLocaleString()}</strong></span>
                              <span>Trips today: <strong style={{ color:TEXT }}>{d.tripsToday}</strong></span>
                              <span>Avg rating: <strong style={{ color:TEXT }}>{d.avgRating}</strong></span>
                              <span>Incidents: <strong style={{ color:d.incidents>0?ERROR:TEXT }}>{d.incidents}</strong></span>
                              {isSuspended && <span className="font-semibold" style={{ color:ERROR }}>Driver is suspended — cannot be assigned to trips</span>}
                              <button onClick={() => setSelected(null)} className="ml-auto text-xs" style={{ color:PRIMARY }}>Close</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Shift Schedule tab ── */}
      {activeTab === "shifts" && (
        <>
          <div className="bg-white rounded-xl border overflow-x-auto mb-5" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
              <div>
                <div className="text-sm font-bold" style={{ color:TEXT }}>Week of {ROSTER_WEEK}</div>
                <div className="text-xs mt-0.5" style={{ color:MUTED }}>Click any cell to propose a shift change — HR will review and approve</div>
              </div>
            </div>
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b" style={{ borderColor:BORDER }}>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color:MUTED, minWidth:150 }}>Driver</th>
                  {ROSTER_DAYS.map(day => (
                    <th key={day} className="px-2 py-2.5 text-center text-xs font-semibold" style={{ color:day==="Mon 13"?PRIMARY:MUTED, minWidth:88 }}>
                      {day}{day==="Mon 13" && <span className="ml-1 font-normal" style={{ color:TEAL, fontSize:10 }}>today</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map((d, i) => (
                  <tr key={d.id} className="border-t" style={{ borderColor:BORDER, backgroundColor:i%2===0?"white":"#FAFAFA" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor:PRIMARY }}>
                          {d.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold" style={{ color:TEXT }}>{d.name}</div>
                          <div className="text-xs" style={{ color:SUBTLE, fontSize:10 }}>{d.id}</div>
                        </div>
                      </div>
                    </td>
                    {ROSTER_DAYS.map(day => {
                      const shift = (weekSchedule[d.id]?.[day] ?? "Off") as HRShift;
                      const pending = proposals.find(p => p.status==="pending" && p.driverId===d.id && p.day===day);
                      const pill = SHIFT_PILL[shift];
                      return (
                        <td key={day} className="px-2 py-2.5 text-center">
                          <button
                            onClick={() => { setShiftModal({ driverId:d.id, driverName:d.name, day, current:shift }); setProposedShift(shift); }}
                            title="Click to propose a shift change"
                            className="relative px-2 py-1 rounded-lg text-xs font-semibold w-full transition-all hover:opacity-75"
                            style={{ backgroundColor:pill.bg, color:pill.text }}>
                            {shift}
                            {pending && (
                              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor:"#F59E0B", fontSize:8 }}>!</span>
                            )}
                          </button>
                          {pending && (
                            <div className="text-xs mt-0.5" style={{ color:"#92400E", fontSize:9 }}>→ {pending.proposedShift}</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Proposals log */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor:BORDER }}>
              <div className="text-sm font-bold" style={{ color:TEXT }}>Shift Change Proposals</div>
              {proposals.filter(p=>p.status==="pending").length>0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor:"#F59E0B" }}>
                  {proposals.filter(p=>p.status==="pending").length} pending HR review
                </span>
              )}
            </div>
            {proposals.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm" style={{ color:MUTED }}>No shift change proposals yet — click a cell above to propose a change</div>
            ) : (
              <div>
                {[...proposals].reverse().map((p, i) => {
                  const statusColor = p.status==="pending" ? "#92400E" : p.status==="approved" ? "#166534" : "#991B1B";
                  const statusBg = p.status==="pending" ? "#FEF3C7" : p.status==="approved" ? "#DCFCE7" : "#FEE2E2";
                  const statusLabel = p.status==="pending" ? "Pending HR" : p.status==="approved" ? "Approved" : "Rejected";
                  return (
                    <div key={p.id} className="px-5 py-3 flex items-start gap-4 border-t" style={{ borderColor:i===0?"transparent":BORDER }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color:TEXT }}>{p.driverName}</span>
                          <span className="text-xs" style={{ color:MUTED }}>·</span>
                          <span className="text-xs font-medium" style={{ color:MUTED }}>{p.day}, {p.weekOf}</span>
                          <span className="text-xs" style={{ color:MUTED }}>·</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:SHIFT_PILL[p.currentShift].bg, color:SHIFT_PILL[p.currentShift].text }}>{p.currentShift}</span>
                          <span className="text-xs font-bold" style={{ color:MUTED }}>→</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:SHIFT_PILL[p.proposedShift].bg, color:SHIFT_PILL[p.proposedShift].text }}>{p.proposedShift}</span>
                        </div>
                        <div className="text-xs mt-1" style={{ color:MUTED }}>{p.reason}</div>
                        {p.rejectionReason && <div className="text-xs mt-1 font-medium" style={{ color:ERROR }}>HR note: {p.rejectionReason}</div>}
                        <div className="text-xs mt-0.5" style={{ color:SUBTLE }}>Submitted {p.proposedAt} by {p.proposedBy}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor:statusBg, color:statusColor }}>
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── 5. FleetCosting ─────────────────────────────────────────────────────────

const COST_BY_VEHICLE = [
  { plate:"ABJ 123 XA", type:"Saloon",  trips:48, km:1482, fuelCost:44460, maintCost:12000, revTotal:1286000, utilPct:78, idleHrs:8  },
  { plate:"ABJ 456 YB", type:"Van",     trips:31, km:980,  fuelCost:39200, maintCost:22000, revTotal:621000,  utilPct:62, idleHrs:14 },
  { plate:"ABJ 789 ZC", type:"SUV",     trips:22, km:720,  fuelCost:28800, maintCost:8500,  revTotal:468000,  utilPct:55, idleHrs:19 },
  { plate:"ABJ 321 WD", type:"Bus",     trips:0,  km:0,    fuelCost:0,     maintCost:45000, revTotal:0,       utilPct:0,  idleHrs:0  },
];

const REV_VS_COST = [
  { month:"May", rev:1820000, cost:980000  },
  { month:"Jun", rev:2140000, cost:1120000 },
  { month:"Jul", rev:2380000, cost:1240000 },
  { month:"Aug", rev:1960000, cost:1080000 },
  { month:"Sep", rev:2210000, cost:1190000 },
  { month:"Oct", rev:2375000, cost:1248760 },
];

const FUEL_TREND = [
  { month:"May", cost:82000 },{ month:"Jun", cost:96000 },{ month:"Jul", cost:108000 },
  { month:"Aug", cost:91000 },{ month:"Sep", cost:98000 },{ month:"Oct", cost:112460 },
];

export function FleetCosting({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [dim, setDim] = useState<"vehicle"|"service-line">("vehicle");
  const [drill, setDrill] = useState<string|null>(null);

  const totalRev  = COST_BY_VEHICLE.reduce((s,v)=>s+v.revTotal,0);
  const totalFuel = COST_BY_VEHICLE.reduce((s,v)=>s+v.fuelCost,0);
  const totalMaint= COST_BY_VEHICLE.reduce((s,v)=>s+v.maintCost,0);
  const totalCost = totalFuel + totalMaint;
  const totalKm   = COST_BY_VEHICLE.reduce((s,v)=>s+v.km,0);

  const SL_COSTS = [
    { line:"Airport Transfer", trips:48, rev:1286000, cost:488000 },
    { line:"Charter",          trips:14, rev:756000,  cost:312000 },
    { line:"Hotel Transport",  trips:23, rev:218500,  cost:198000 },
    { line:"Staff & Logistics",trips:16, rev:114500,  cost:250760 },
  ];

  return (
    <div>
      <PageHeader title="Fleet Costing" sub="Cost per km, cost per trip, revenue vs cost, and utilisation"
        actions={<ExportBtn add={add} label="Fleet Costing" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Revenue (Oct)" value={`₦${(totalRev/1000000).toFixed(2)}M`} sub="All service lines" icon={DollarSign} accent={SUCCESS} delta="+7.5% vs Sep" deltaPositive />
        <StatCard label="Total Costs (Oct)"   value={`₦${(totalCost/1000).toFixed(0)}K`}   sub="Fuel + maintenance" icon={Activity}  accent={ERROR}   />
        <StatCard label="Net Margin"           value={`${(((totalRev-totalCost)/totalRev)*100).toFixed(1)}%`} sub="Revenue - cost" icon={TrendingUp} accent={TEAL} />
        <StatCard label="Cost per km"          value={`₦${(totalCost/totalKm).toFixed(0)}`} sub="Fleet average"     icon={Fuel}      accent={ORANGE}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Revenue vs Cost — Monthly (₦M)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REV_VS_COST.map(r=>({...r,rev:+(r.rev/1000000).toFixed(2),cost:+(r.cost/1000000).toFixed(2)}))} margin={{ left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} tickFormatter={v=>`₦${v}M`} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={(v:number)=>[`₦${v}M`]} />
              <Bar dataKey="rev"  name="Revenue" fill={SUCCESS} radius={[3,3,0,0]} barSize={14} />
              <Bar dataKey="cost" name="Cost"    fill={ERROR}   radius={[3,3,0,0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Fuel Cost Trend (₦)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FUEL_TREND} margin={{ left:-20 }}>
              <defs><linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ORANGE} stopOpacity={0.15}/><stop offset="95%" stopColor={ORANGE} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} tickFormatter={v=>`₦${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={(v:number)=>[`₦${v.toLocaleString()}`]} />
              <Area type="monotone" dataKey="cost" stroke={ORANGE} strokeWidth={2} fill="url(#fuelGrad)" name="Fuel" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dimension toggle + table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
          <div className="text-sm font-semibold" style={{ color:TEXT }}>Cost Breakdown</div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor:"#F1F5F9" }}>
            {(["vehicle","service-line"] as const).map(d=>(
              <button key={d} onClick={()=>setDim(d)} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize" style={{ backgroundColor:dim===d?"white":"transparent", color:dim===d?TEXT:MUTED, boxShadow:dim===d?"0 1px 2px rgba(0,0,0,0.08)":"none" }}>{d==="service-line"?"Service Line":"By Vehicle"}</button>
            ))}
          </div>
        </div>

        {dim==="vehicle" ? (
          <table className="w-full">
            <thead><TH cols={["Vehicle","Type","Trips","Distance","Fuel Cost","Maint Cost","Revenue","Cost/km","Cost/trip","Margin","Util %",""]} /></thead>
            <tbody>
              {COST_BY_VEHICLE.map(v=>{
                const totalC = v.fuelCost + v.maintCost;
                const margin = v.revTotal>0 ? (((v.revTotal-totalC)/v.revTotal)*100).toFixed(1) : "—";
                const cpk = v.km>0 ? (totalC/v.km).toFixed(0) : "—";
                const cpt = v.trips>0 ? (totalC/v.trips).toFixed(0) : "—";
                return (
                  <>
                    <tr key={v.plate} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor:BORDER }} onClick={()=>setDrill(drill===v.plate?null:v.plate)}>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{v.plate}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{v.type}</td>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT }}>{v.trips}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{v.km.toLocaleString()} km</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:TEXT, fontFamily:mono }}>₦{v.fuelCost.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:TEXT, fontFamily:mono }}>₦{v.maintCost.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:SUCCESS, fontFamily:mono }}>₦{v.revTotal.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{cpk==="—"?cpk:`₦${cpk}`}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{cpt==="—"?cpt:`₦${cpt}`}</td>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:parseFloat(margin)>=40?SUCCESS:parseFloat(margin)>=20?WARNING:ERROR }}>{margin==="—"?margin:`${margin}%`}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}><div className="h-full rounded-full" style={{ width:`${v.utilPct}%`, backgroundColor:v.utilPct>=70?SUCCESS:v.utilPct>=50?WARNING:ERROR }} /></div><span className="text-xs font-bold" style={{ color:TEXT }}>{v.utilPct}%</span></div>
                      </td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:SUBTLE }}>{drill===v.plate?"▲":"▼"}</td>
                    </tr>
                    {drill===v.plate && (
                      <tr key={`${v.plate}-d`} style={{ backgroundColor:"#F9FAFB" }}>
                        <td colSpan={12} className="px-4 py-2.5 text-xs" style={{ color:MUTED }}>
                          Idle hours: {v.idleHrs}h · Revenue per km: ₦{v.km>0?(v.revTotal/v.km).toFixed(0):"—"} · Total cost: ₦{(v.fuelCost+v.maintCost).toLocaleString()}
                          <button onClick={()=>setDrill(null)} className="ml-3" style={{ color:PRIMARY }}>Close</button>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><TH cols={["Service Line","Trips","Revenue","Total Cost","Net","Margin","Cost/trip"]} /></thead>
            <tbody>
              {SL_COSTS.map(s=>{
                const net = s.rev-s.cost;
                const margin = ((net/s.rev)*100).toFixed(1);
                const cpt = (s.cost/s.trips).toFixed(0);
                return (
                  <tr key={s.line} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:SL_COLOR[s.line as ServiceLine] }}>{s.line}</td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT }}>{s.trips}</td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:SUCCESS, fontFamily:mono }}>₦{s.rev.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:ERROR, fontFamily:mono }}>₦{s.cost.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:net>=0?SUCCESS:ERROR, fontFamily:mono }}>₦{net.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:parseFloat(margin)>=30?SUCCESS:parseFloat(margin)>=0?WARNING:ERROR }}>{margin}%</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>₦{cpt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


interface TripStop {
  id: string;
  time: string;
  location: string;
  durationMin: number;
  purpose: string;
  leg?: "outbound" | "return";
}

interface TripLog {
  id: string;
  driver: string;
  vehicle: string;
  date: string;
  purpose: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime?: string;
  odomStart: number;
  odomEnd?: number;
  distanceKm?: number;
  passengers: number;
  fuelFilled?: number;
  stops: TripStop[];
  notes: string;
  status: "active" | "completed";
  synced: boolean;
  tripMode: "one-way" | "round-trip";
  returnStarted: boolean;
}

const LOGBOOK_SEED: TripLog[] = [
  {
    id: "TL-0008", driver: "Uche Obi", vehicle: "ABJ 123 XA", date: "20 Aug 2025",
    purpose: "Airport Transfer — Guest pickup",
    from: "Grand Palms Abuja", to: "Nnamdi Azikiwe Intl Airport",
    departureTime: "05:45", arrivalTime: "07:11",
    odomStart: 47900, odomEnd: 47963, distanceKm: 63, passengers: 1, fuelFilled: 45,
    stops: [{ id: "s1", time: "06:02", location: "Terminal 1 Arrival Hall", durationMin: 25, purpose: "Wait for flight ET902 — passenger boarding", leg: "outbound" }],
    notes: "Guest: Adaeze Okonkwo-James · Ref: TRP-0037", status: "completed", synced: true,
    tripMode: "round-trip", returnStarted: true,
  },
  {
    id: "TL-0007", driver: "Emeka Eze", vehicle: "ABJ 456 YB", date: "20 Aug 2025",
    purpose: "Charter — Senator Adeyemi",
    from: "Grand Palms Abuja", to: "Aso Rock (State House)",
    departureTime: "10:00", arrivalTime: "10:32",
    odomStart: 97800, odomEnd: 97822, distanceKm: 22, passengers: 3,
    stops: [],
    notes: "VIP — no stops, direct", status: "completed", synced: true,
    tripMode: "one-way", returnStarted: false,
  },
  {
    id: "TL-0006", driver: "Musa Danladi", vehicle: "ABJ 789 ZC", date: "19 Aug 2025",
    purpose: "F&B Procurement — FreshMart run",
    from: "Grand Palms Abuja", to: "FreshMart Wuse II",
    departureTime: "09:00", arrivalTime: "11:45",
    odomStart: 31100, odomEnd: 31200, distanceKm: 100, passengers: 1,
    stops: [
      { id: "s2", time: "09:40", location: "FreshMart Wuse II", durationMin: 95, purpose: "Loading: fresh produce and dry goods for F&B", leg: "outbound" },
      { id: "s3", time: "11:20", location: "Ardova Filling Station", durationMin: 15, purpose: "Fuel — 60L diesel", leg: "return" },
    ],
    notes: "Cost centre: F&B-OPS-001", status: "completed", synced: true,
    tripMode: "round-trip", returnStarted: true,
  },
];

let _tripCounter = 9;
let _stopCounter = 10;

function nowStr() {
  const d = new Date();
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function todayStr() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function stopLabel(m: number) {
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

export function DriverAccessLog({ add, driverName, role }: { add: (t: Omit<Toast, "id">) => void; driverName?: string; role?: string }) {
  const isDrv = role === "DRV" && !!driverName;

  // Resolve driver record and assigned vehicle
  const driverRecord = driverName ? DRIVERS.find(d => d.name === driverName) : undefined;
  const assignedVeh  = driverRecord?.vehicle ? VEHICLES.find(v => v.id === driverRecord.vehicle) : null;

  // Seed logbook — DRV sees only own trips
  const seedForRole = isDrv ? LOGBOOK_SEED.filter(l => l.driver === driverName) : LOGBOOK_SEED;

  // Assigned trip requests for this driver (status ≤ assigned)
  const myAssigned = TRIPS.filter(t =>
    isDrv && t.driver === driverName && (t.status === "assigned" || t.status === "dispatched")
  );

  // Track accept state per trip-id: "idle" | "pending" | "approved" | "cancelled"
  const [acceptState, setAcceptState] = useState<Record<string, "idle" | "pending" | "approved" | "cancelled">>(() =>
    Object.fromEntries(myAssigned.map(t => [t.id, t.status === "dispatched" ? "approved" : "idle"]))
  );

  const [activeTab, setActiveTab]       = useState<"assignments" | "logbook">(_driverTab);
  const [online, setOnline]             = useState(navigator.onLine);
  const [syncing, setSyncing]           = useState(false);
  const [logs, setLogs]                 = useState<TripLog[]>(seedForRole);
  const [expanded, setExpanded]         = useState<string | null>(null);
  const [showStart, setShowStart]       = useState(false);
  const [showStop, setShowStop]         = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState<string | null>(null);
  const [filterDriver, setFilterDriver] = useState("All");
  const [filterDate, setFilterDate]     = useState("All");

  const [sf, setSf] = useState({
    driver: driverName ?? DRIVERS[0].name,
    vehicle: assignedVeh?.plate ?? VEHICLES[0].plate,
    purpose: "", from: "Grand Palms Abuja", to: "",
    odomStart: "", passengers: "1", notes: "",
    tripMode: "one-way" as "one-way" | "round-trip",
  });
  const [pf, setPf] = useState({ location: "", durationMin: "15", purpose: "" });
  const [cf, setCf] = useState({ odomEnd: "", fuelFilled: "", to: "", notes: "" });

  const activeTrips = logs.filter(l => l.status === "active");
  const pending     = logs.filter(l => !l.synced);

  const acceptTrip = (tripId: string) => {
    setAcceptState(s => ({ ...s, [tripId]: "pending" }));
    add({ type: "info", title: "Acceptance sent to supervisor", body: "Waiting for approval on " + tripId + "…" });
    // Simulate supervisor responding after 4–6 s
    const willApprove = Math.random() > 0.2; // 80 % approval rate
    setTimeout(() => {
      const newState = willApprove ? "approved" : "cancelled";
      setAcceptState(s => ({ ...s, [tripId]: newState }));
      if (willApprove) {
        add({ type: "success", title: tripId + " approved — you are dispatched!", body: "Check trip details and proceed to pickup." });
      } else {
        add({ type: "error", title: tripId + " cancelled by manager", body: "The trip was cancelled. Check dispatch for updates." });
      }
    }, 4500 + Math.random() * 2000);
  };

  // Stable refs for use inside event listeners
  const logsRef = useRef<TripLog[]>(logs);
  useEffect(() => { logsRef.current = logs; }, [logs]);

  const syncNow = () => {
    const unsynced = logsRef.current.filter(l => !l.synced);
    if (unsynced.length === 0) { add({ type: "info", title: "All entries already synced" }); return; }
    setSyncing(true);
    setTimeout(() => {
      setLogs(p => p.map(l => ({ ...l, synced: true })));
      setSyncing(false);
      const n = unsynced.length;
      add({ type: "success", title: n + " trip log" + (n === 1 ? "" : "s") + " synced", body: "Logbook up to date." });
    }, 2200);
  };

  // Auto-detect connectivity and trigger sync on restore
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      const unsynced = logsRef.current.filter(l => !l.synced);
      if (unsynced.length > 0) {
        setSyncing(true);
        setTimeout(() => {
          setLogs(p => p.map(l => ({ ...l, synced: true })));
          setSyncing(false);
          const n = unsynced.length;
          add({ type: "success", title: "Network restored — " + n + " log" + (n === 1 ? "" : "s") + " synced automatically" });
        }, 1800);
      } else {
        add({ type: "info", title: "Network connection restored" });
      }
    };
    const handleOffline = () => {
      setOnline(false);
      add({ type: "warning", title: "Connection lost", body: "Trips are saving locally. Sync will happen automatically when reconnected." });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // add is stable (useCallback in HMSApp)

  const startTrip = () => {
    if (!sf.purpose.trim()) { add({ type: "error", title: "Trip purpose is required" }); return; }
    if (!sf.to.trim())      { add({ type: "error", title: "Destination is required" }); return; }
    if (!sf.odomStart)      { add({ type: "error", title: "Odometer reading at departure is required" }); return; }
    if (isDrv && !assignedVeh) { add({ type: "error", title: "No vehicle assigned — contact Fleet Manager" }); return; }
    const id = "TL-" + String(_tripCounter).padStart(4, "0");
    _tripCounter++;
    const log: TripLog = {
      id, driver: sf.driver,
      vehicle: isDrv ? (assignedVeh?.plate ?? sf.vehicle) : sf.vehicle,
      date: todayStr(), purpose: sf.purpose, from: sf.from, to: sf.to,
      departureTime: nowStr(), odomStart: parseInt(sf.odomStart),
      passengers: parseInt(sf.passengers) || 1,
      stops: [], notes: sf.notes, status: "active", synced: false,
      tripMode: sf.tripMode, returnStarted: false,
    };
    setLogs(p => [log, ...p]);
    add({ type: "success", title: "Trip " + id + " started", body: sf.from + " → " + sf.to + (sf.tripMode === "round-trip" ? " · Round Trip" : "") });
    setShowStart(false);
    setSf(f => ({ ...f, purpose: "", to: "", odomStart: "", passengers: "1", notes: "" }));
  };

  const logStop = (tripId: string) => {
    if (!pf.location.trim()) { add({ type: "error", title: "Stop location is required" }); return; }
    const trip = logs.find(l => l.id === tripId);
    const stop: TripStop = {
      id: "s" + _stopCounter++, time: nowStr(),
      location: pf.location, durationMin: parseInt(pf.durationMin) || 0, purpose: pf.purpose,
      leg: trip?.returnStarted ? "return" : "outbound",
    };
    setLogs(p => p.map(l => l.id === tripId ? { ...l, stops: [...l.stops, stop] } : l));
    add({ type: "info", title: "Stop logged — " + stop.location + (trip?.returnStarted ? " (return leg)" : "") });
    setShowStop(null);
    setPf({ location: "", durationMin: "15", purpose: "" });
  };

  const beginReturn = (tripId: string) => {
    setLogs(p => p.map(l => l.id === tripId ? { ...l, returnStarted: true } : l));
    add({ type: "info", title: "Return journey started", body: "Log stops on your way back to base. Complete the trip when you arrive." });
  };

  const completeTrip = (tripId: string) => {
    if (!cf.odomEnd) { add({ type: "error", title: "Odometer at arrival is required" }); return; }
    const trip = logs.find(l => l.id === tripId)!;
    const odomEnd = parseInt(cf.odomEnd);
    const distanceKm = odomEnd - trip.odomStart;
    if (distanceKm < 0) { add({ type: "error", title: "Odometer end cannot be less than start" }); return; }
    setLogs(p => p.map(l => l.id === tripId ? {
      ...l, status: "completed" as const, arrivalTime: nowStr(),
      odomEnd, distanceKm, to: cf.to || l.to,
      fuelFilled: cf.fuelFilled ? parseInt(cf.fuelFilled) : undefined,
      notes: cf.notes || l.notes, synced: online,
    } : l));
    add({ type: "success", title: "Trip " + tripId + " completed — " + distanceKm + " km", body: online ? "Synced" : "Queued for sync" });
    setShowComplete(null);
    setCf({ odomEnd: "", fuelFilled: "", to: "", notes: "" });
  };

  const dates    = [...new Set(logs.map(l => l.date))];
  const filtered = logs.filter(l =>
    (filterDriver === "All" || l.driver === filterDriver) &&
    (filterDate   === "All" || l.date   === filterDate)
  );

  const inp = "w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white";

  // ── Subcomponents ────────────────────────────────────────────────────────────

  const SyncBar = () => (
    <div className="px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between"
      style={{ backgroundColor: online ? "#F0FDF4" : "#FFF7ED", border: "1px solid " + (online ? "#BBF7D0" : "#FED7AA") }}>
      <div className="flex items-center gap-2.5">
        {syncing
          ? <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin flex-shrink-0" style={{ borderColor: TEAL + "40", borderTopColor: TEAL }} />
          : online ? <Wifi size={14} className="flex-shrink-0" style={{ color: SUCCESS }} /> : <WifiOff size={14} className="flex-shrink-0" style={{ color: ORANGE }} />
        }
        <div>
          <div className="text-xs font-bold" style={{ color: online ? "#166534" : "#9A3412" }}>
            {syncing ? "Syncing…" : online ? "Connected — auto-sync on" : "Offline — saved locally"}
          </div>
          <div className="text-xs" style={{ color: online ? "#4ADE80" : ORANGE }}>
            {syncing
              ? "Uploading " + pending.length + " log" + (pending.length === 1 ? "" : "s") + "…"
              : online ? "All entries synced."
                : pending.length + " log" + (pending.length === 1 ? "" : "s") + " queued."
            }
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {online && pending.length > 0 && (
          <button onClick={syncNow} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: SUCCESS }}>
            <Upload size={11} />Retry Sync
          </button>
        )}
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  // Manager/admin view — single column
  if (!isDrv) return (
    <div>
      <PageHeader title="Driver Logbook" sub="Trip-by-trip log — start trip, log stops, record odometer, complete — offline queue syncs on facility network" />
      <div className="mb-4"><SyncBar /></div>

      {/* Start trip */}
      <div className="bg-white rounded-2xl border mb-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.06)" }}>
        <button onClick={() => setShowStart(!showStart)} className="w-full flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
              <Plus size={14} style={{ color: PRIMARY }} />
            </div>
            <span className="text-sm font-bold" style={{ color: PRIMARY }}>Log a Trip</span>
          </div>
          <ChevronDown size={16} style={{ color: MUTED, transform: showStart ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </button>
        {showStart && (
          <div className="px-4 pb-4 border-t space-y-3 pt-3" style={{ borderColor: BORDER }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Driver</div>
                <select value={sf.driver} onChange={e => setSf(f => ({ ...f, driver: e.target.value }))} className={inp} style={{ borderColor: BORDER }}>
                  {DRIVERS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Vehicle</div>
                <select value={sf.vehicle} onChange={e => setSf(f => ({ ...f, vehicle: e.target.value }))} className={inp} style={{ borderColor: BORDER }}>
                  {VEHICLES.map(v => <option key={v.id}>{v.plate}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Trip Purpose *</div>
                <input value={sf.purpose} onChange={e => setSf(f => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Airport Transfer…" className={inp} style={{ borderColor: BORDER }} />
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Departure</div>
                <input value={sf.from} onChange={e => setSf(f => ({ ...f, from: e.target.value }))} className={inp} style={{ borderColor: BORDER }} />
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Destination *</div>
                <input value={sf.to} onChange={e => setSf(f => ({ ...f, to: e.target.value }))} placeholder="Final destination" className={inp} style={{ borderColor: BORDER }} />
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Odometer Start *</div>
                <input type="number" value={sf.odomStart} onChange={e => setSf(f => ({ ...f, odomStart: e.target.value }))} placeholder="e.g. 47963" className={inp} style={{ borderColor: BORDER }} />
              </div>
            </div>
            <button onClick={startTrip} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>
              <Car size={14} />Start Trip
            </button>
          </div>
        )}
      </div>

      {/* Filters + history */}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <select value={filterDriver} onChange={e => setFilterDriver(e.target.value)} className="px-3 py-2 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }}>
          <option value="All">All Drivers</option>
          {DRIVERS.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
        <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="px-3 py-2 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }}>
          <option value="All">All Dates</option>
          {dates.map(d => <option key={d}>{d}</option>)}
        </select>
        <div className="ml-auto text-xs" style={{ color: MUTED }}>{filtered.length} trip{filtered.length === 1 ? "" : "s"}</div>
      </div>
      <LogbookList logs={filtered} expanded={expanded} setExpanded={setExpanded} isDrv={false} />
    </div>
  );

  // ── Driver view (DRV role) ── two-column on large screens ────────────────────
  return (
    <div>
      {/* ── Driver / Vehicle Identity Card ──────────────────────────────────── */}
      <div className="mb-5 rounded-2xl border overflow-hidden" style={{ borderColor: PRIMARY + "30", backgroundColor: "white", boxShadow: "0 2px 8px rgba(18,58,115,0.08)" }}>
        <div className="px-5 py-2.5 flex items-center gap-2" style={{ backgroundColor: PRIMARY }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: assignedVeh ? "#4ADE80" : "#FCA5A5" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.65)" }}>Driver Profile</span>
        </div>
        <div className="p-5 flex flex-col sm:flex-row gap-5">
          {/* Driver side */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>
              {(driverName ?? "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold" style={{ color: TEXT }}>{driverName}</div>
              <div className="text-xs mt-0.5" style={{ color: MUTED }}>{driverRecord?.id ?? "—"} · Class {driverRecord?.licClass ?? "—"} Licence · {driverRecord?.licNo}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{
                  backgroundColor: driverRecord?.status === "available" ? "#DCFCE7" : driverRecord?.status === "on-trip" ? "#FEF3C7" : "#F1F5F9",
                  color: driverRecord?.status === "available" ? "#166534" : driverRecord?.status === "on-trip" ? "#92400E" : "#475569",
                }}>{driverRecord?.status ?? "—"}</span>
                <ExpiryBadge days={driverRecord?.licDaysLeft ?? 0} label={"Lic " + (driverRecord?.licExpiry ?? "—")} />
                <ExpiryBadge days={driverRecord?.medDaysLeft ?? 0} label={"Med " + (driverRecord?.medExpiry ?? "—")} />
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: BORDER }} />
          <div className="h-px sm:hidden" style={{ backgroundColor: BORDER }} />
          {/* Vehicle side */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: MUTED }}>Assigned Vehicle</div>
            {assignedVeh ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EFF6FF" }}>
                  <Car size={20} style={{ color: PRIMARY }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold" style={{ color: TEXT, fontFamily: mono }}>{assignedVeh.plate}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{assignedVeh.make} {assignedVeh.model} · {assignedVeh.type}</div>
                  {!assignedVeh.docsOk && <div className="text-xs font-semibold mt-0.5" style={{ color: ERROR }}>⚠ {assignedVeh.docExpiry}</div>}
                </div>
                <VehicleStatusPill status={assignedVeh.status} />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#FEF3C7", border: "1px solid #FDE68A" }}>
                <AlertTriangle size={16} style={{ color: WARNING }} />
                <span className="text-sm font-semibold" style={{ color: "#92400E" }}>No vehicle assigned — contact Fleet Manager</span>
              </div>
            )}
          </div>
          {/* Stats */}
          {driverRecord && (
            <>
              <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: BORDER }} />
              <div className="grid grid-cols-3 sm:flex sm:flex-col gap-3 sm:gap-2 text-center sm:text-right justify-around sm:justify-start">
                {[
                  ["Today", String(driverRecord.tripsToday) + " trip" + (driverRecord.tripsToday === 1 ? "" : "s")],
                  ["Month", String(driverRecord.tripsMonth) + " trips"],
                  ["Rating", "★ " + driverRecord.avgRating],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs" style={{ color: MUTED }}>{k}</div>
                    <div className="text-sm font-bold" style={{ color: TEXT }}>{v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
        {([
          { key: "assignments", label: "My Assignments", badge: myAssigned.filter(t => acceptState[t.id] === "idle").length },
          { key: "logbook",     label: "My Logbook",     badge: activeTrips.length },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? "white" : "transparent",
              color: activeTab === tab.key ? TEXT : MUTED,
              boxShadow: activeTab === tab.key ? "0 1px 3px rgba(13,27,46,0.1)" : "none",
            }}>
            {tab.label}
            {tab.badge > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: tab.key === "assignments" ? ERROR : TEAL }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────────── */}
      {activeTab === "assignments" && (
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">

          {/* Sync bar */}
          <SyncBar />

          {/* Assigned trip requests */}
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.06)" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
              <div className="text-sm font-bold" style={{ color: TEXT }}>My Assignments</div>
              {myAssigned.length > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: myAssigned.some(t => acceptState[t.id] === "idle") ? ERROR : SUCCESS }}>
                  {myAssigned.length}
                </span>
              )}
            </div>

            {myAssigned.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-xs" style={{ color: SUBTLE }}>No trip requests assigned to you</div>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: BORDER }}>
                {myAssigned.map(t => {
                  const st = acceptState[t.id] ?? "idle";
                  return (
                    <div key={t.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</div>
                          <div className="text-sm font-semibold" style={{ color: TEXT }}>{t.guest}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold" style={{ color: TEXT }}>{t.scheduledTime}</div>
                          <div className="text-xs" style={{ color: MUTED }}>{t.serviceL}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: MUTED }}>
                        <MapPin size={10} className="flex-shrink-0" />
                        <span className="truncate">{t.pickup}</span>
                        <ArrowRight size={10} className="flex-shrink-0" />
                        <span className="truncate">{t.dropoff}</span>
                      </div>
                      {t.flight && <div className="text-xs mb-2" style={{ color: TEAL }}>Flight: {t.flight}</div>}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                          backgroundColor: st === "approved" ? "#DCFCE7" : st === "cancelled" ? "#FEE2E2" : st === "pending" ? "#FEF3C7" : "#EFF6FF",
                          color: st === "approved" ? "#166534" : st === "cancelled" ? "#991B1B" : st === "pending" ? "#92400E" : "#1D4ED8",
                        }}>
                          {st === "idle" ? "Awaiting your response" : st === "pending" ? "Sent — awaiting supervisor" : st === "approved" ? "Approved — dispatched" : "Cancelled by manager"}
                        </span>
                      </div>
                      {st === "idle" && (
                        <button onClick={() => acceptTrip(t.id)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
                          style={{ backgroundColor: PRIMARY }}>
                          <CheckCircle2 size={14} />Accept Trip
                        </button>
                      )}
                      {st === "pending" && (
                        <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                          <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin flex-shrink-0" style={{ borderColor: "#FDE68A", borderTopColor: "#D97706" }} />
                          Waiting for supervisor…
                        </div>
                      )}
                      {st === "approved" && (
                        <div className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
                          <CheckCircle2 size={13} />Approved — proceed to pickup
                        </div>
                      )}
                      {st === "cancelled" && (
                        <div className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                          <XCircle size={13} />Cancelled — check dispatch for updates
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick stats for driver */}
          {driverRecord && (
            <div className="bg-white rounded-2xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.06)" }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: MUTED }}>My Stats</div>
              <div className="space-y-2.5">
                {[
                  ["Trips Today",   String(driverRecord.tripsToday),   PRIMARY],
                  ["Trips This Month", String(driverRecord.tripsMonth), TEAL],
                  ["Total KM",      driverRecord.totalKm.toLocaleString() + " km", SUCCESS],
                  ["Avg Rating",    "★ " + driverRecord.avgRating,      WARNING],
                  ["Incidents",     String(driverRecord.incidents),     driverRecord.incidents > 0 ? ERROR : SUCCESS],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>{k}</span>
                    <span className="text-sm font-bold" style={{ color: c, fontFamily: mono }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN CONTENT (assignments tab: active trips only) ──────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Active trips */}
          {activeTrips.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border-2 p-4" style={{ borderColor: TEAL }}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TEAL }} />
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TEAL }}>Active Trip</span>
                    <span className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</span>
                    {t.tripMode === "round-trip" && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#EDE9FE", color: "#5B21B6" }}>⇄ Round Trip</span>
                    )}
                  </div>
                  <div className="text-sm font-bold" style={{ color: TEXT }}>{t.purpose}</div>
                  <div className="text-xs flex flex-wrap items-center gap-1 mt-0.5" style={{ color: MUTED }}>
                    <MapPin size={11} className="flex-shrink-0" /><span>{t.from}</span>
                    <ArrowRight size={11} className="flex-shrink-0" /><span>{t.to}</span>
                    {t.tripMode === "round-trip" && <><ArrowRight size={11} className="flex-shrink-0" /><span>{t.from}</span></>}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>Dep. {t.departureTime} · Odom: {t.odomStart.toLocaleString()} km</div>
                </div>
              </div>

              {/* Phase indicator for round trips */}
              {t.tripMode === "round-trip" && (
                <div className="flex items-center gap-0 mb-3 text-xs">
                  {[
                    { label: "Base", active: true },
                    { label: "En Route", active: true },
                    { label: "Destination", active: t.stops.some(s => s.leg === "outbound") || t.returnStarted },
                    { label: "Returning", active: t.returnStarted },
                    { label: "Back at Base", active: false },
                  ].map((phase, i, arr) => (
                    <div key={phase.label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full border-2 transition-all"
                          style={{ backgroundColor: phase.active ? TEAL : "white", borderColor: phase.active ? TEAL : BORDER }} />
                        <div className="text-xs mt-0.5 whitespace-nowrap" style={{ color: phase.active ? TEAL : MUTED, fontSize: 9, fontWeight: phase.active ? 700 : 400 }}>
                          {phase.label}
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="h-0.5 w-8 -mt-3 mx-0.5" style={{ backgroundColor: arr[i + 1].active ? TEAL : BORDER }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Outbound stops */}
              {t.stops.filter(s => s.leg !== "return").length > 0 && (
                <div className="mb-2 pl-3 border-l-2" style={{ borderColor: TEAL + "60" }}>
                  {t.tripMode === "round-trip" && (
                    <div className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: TEAL }}>
                      <ArrowRight size={10} />Outbound stops
                    </div>
                  )}
                  {t.stops.filter(s => s.leg !== "return").map(s => (
                    <div key={s.id} className="flex flex-wrap items-center gap-2 py-1 text-xs" style={{ color: MUTED }}>
                      <span className="font-bold" style={{ fontFamily: mono }}>{s.time}</span>
                      <MapPin size={10} /><span className="font-medium" style={{ color: TEXT }}>{s.location}</span>
                      <span>· {stopLabel(s.durationMin)}</span>
                      {s.purpose && <span>· {s.purpose}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Return stops */}
              {t.returnStarted && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
                    <span className="text-xs font-bold px-2" style={{ color: "#5B21B6" }}>↩ Return Journey</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
                  </div>
                  {t.stops.filter(s => s.leg === "return").length > 0 && (
                    <div className="mb-2 pl-3 border-l-2" style={{ borderColor: "#A78BFA" }}>
                      {t.stops.filter(s => s.leg === "return").map(s => (
                        <div key={s.id} className="flex flex-wrap items-center gap-2 py-1 text-xs" style={{ color: MUTED }}>
                          <span className="font-bold" style={{ fontFamily: mono }}>{s.time}</span>
                          <MapPin size={10} /><span className="font-medium" style={{ color: TEXT }}>{s.location}</span>
                          <span>· {stopLabel(s.durationMin)}</span>
                          {s.purpose && <span>· {s.purpose}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Log stop form */}
              {showStop === t.id && (
                <div className="mb-3 p-3 rounded-xl space-y-2.5" style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD" }}>
                  <div className="text-xs font-bold" style={{ color: PRIMARY }}>Log Stop</div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Location *</div>
                    <input value={pf.location} onChange={e => setPf(f => ({ ...f, location: e.target.value }))} placeholder="e.g. FreshMart Wuse II" className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Duration (min)</div>
                      <input type="number" value={pf.durationMin} onChange={e => setPf(f => ({ ...f, durationMin: e.target.value }))} className={inp} style={{ borderColor: BORDER }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Purpose</div>
                      <input value={pf.purpose} onChange={e => setPf(f => ({ ...f, purpose: e.target.value }))} placeholder="Fuel, loading…" className={inp} style={{ borderColor: BORDER }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => logStop(t.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Save Stop</button>
                    <button onClick={() => setShowStop(null)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Complete form */}
              {showComplete === t.id && (
                <div className="mb-3 p-3 rounded-xl space-y-2.5" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <div className="text-xs font-bold" style={{ color: SUCCESS }}>Complete Trip</div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Odometer at Arrival *</div>
                    <input type="number" value={cf.odomEnd} onChange={e => setCf(f => ({ ...f, odomEnd: e.target.value }))} placeholder={"Greater than " + t.odomStart.toLocaleString()} className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  {cf.odomEnd && parseInt(cf.odomEnd) > t.odomStart && (
                    <div className="text-sm font-bold" style={{ color: SUCCESS }}>Distance: {parseInt(cf.odomEnd) - t.odomStart} km</div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>{t.tripMode === "round-trip" ? "Return Point" : "Actual Destination"}</div>
                      <input value={cf.to || (t.tripMode === "round-trip" ? t.from : t.to)} onChange={e => setCf(f => ({ ...f, to: e.target.value }))} className={inp} style={{ borderColor: BORDER }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Fuel Filled (L)</div>
                      <input type="number" value={cf.fuelFilled} onChange={e => setCf(f => ({ ...f, fuelFilled: e.target.value }))} placeholder="0" className={inp} style={{ borderColor: BORDER }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Remarks</div>
                    <input value={cf.notes} onChange={e => setCf(f => ({ ...f, notes: e.target.value }))} placeholder="Optional" className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => completeTrip(t.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: SUCCESS }}>Complete &amp; Close Trip</button>
                    <button onClick={() => setShowComplete(null)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
                  </div>
                </div>
              )}

              {showStop !== t.id && showComplete !== t.id && (
                <div className="space-y-2">
                  {/* Begin Return Journey — round trip only, before return started */}
                  {t.tripMode === "round-trip" && !t.returnStarted && (
                    <button onClick={() => beginReturn(t.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2"
                      style={{ borderColor: "#7C3AED", color: "#7C3AED", backgroundColor: "#F5F3FF" }}>
                      <ArrowRight size={14} />Begin Return Journey
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setShowStop(t.id)} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
                      <MapPin size={14} />{t.returnStarted ? "Log Return Stop" : "Log Stop"}
                    </button>
                    <button onClick={() => setShowComplete(t.id)} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: SUCCESS }}>
                      <Flag size={14} />Complete Trip
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {activeTrips.length === 0 && (
            <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: BORDER }}>
              <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>No active trips</div>
              <div className="text-xs" style={{ color: MUTED }}>Switch to the Logbook tab to start a trip</div>
              <button onClick={() => setActiveTab("logbook")} className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>Go to My Logbook →</button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── LOGBOOK TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "logbook" && (
      <div className="space-y-4">
        <SyncBar />

          {/* Active trips */}
          {activeTrips.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border-2 p-4" style={{ borderColor: TEAL }}>
              {/* same active-trip card as assignments tab */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TEAL }} />
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TEAL }}>Active Trip</span>
                    <span className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</span>
                    {t.tripMode === "round-trip" && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#EDE9FE", color: "#5B21B6" }}>⇄ Round Trip</span>
                    )}
                  </div>
                  <div className="text-sm font-bold" style={{ color: TEXT }}>{t.purpose}</div>
                  <div className="text-xs flex flex-wrap items-center gap-1 mt-0.5" style={{ color: MUTED }}>
                    <MapPin size={11} className="flex-shrink-0"/><span>{t.from}</span>
                    <ArrowRight size={11} className="flex-shrink-0"/><span>{t.to}</span>
                    {t.tripMode === "round-trip" && <><ArrowRight size={11} className="flex-shrink-0"/><span>{t.from}</span></>}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>Dep. {t.departureTime} · Odom: {t.odomStart.toLocaleString()} km</div>
                </div>
              </div>
              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setShowStop(showStop === t.id ? null : t.id)} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
                  <MapPin size={14}/>{t.returnStarted ? "Log Return Stop" : "Log Stop"}
                </button>
                <button onClick={() => setShowComplete(showComplete === t.id ? null : t.id)} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: SUCCESS }}>
                  <Flag size={14}/>Complete Trip
                </button>
              </div>
              {t.tripMode === "round-trip" && !t.returnStarted && (
                <button onClick={() => beginReturn(t.id)} className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2" style={{ borderColor:"#7C3AED", color:"#7C3AED", backgroundColor:"#F5F3FF" }}>
                  <ArrowRight size={14}/>Begin Return Journey
                </button>
              )}
              {showStop === t.id && (
                <div className="mt-3 p-3 rounded-xl space-y-2" style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD" }}>
                  <div className="text-xs font-bold" style={{ color: PRIMARY }}>Log Stop</div>
                  <input value={pf.location} onChange={e => setPf(f => ({ ...f, location: e.target.value }))} placeholder="Stop location *" className={inp} style={{ borderColor: BORDER }} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={pf.durationMin} onChange={e => setPf(f => ({ ...f, durationMin: e.target.value }))} placeholder="Duration (min)" className={inp} style={{ borderColor: BORDER }} />
                    <input value={pf.purpose} onChange={e => setPf(f => ({ ...f, purpose: e.target.value }))} placeholder="Purpose" className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => logStop(t.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Save Stop</button>
                    <button onClick={() => setShowStop(null)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
                  </div>
                </div>
              )}
              {showComplete === t.id && (
                <div className="mt-3 p-3 rounded-xl space-y-2" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <div className="text-xs font-bold" style={{ color: SUCCESS }}>Complete Trip</div>
                  <input type="number" value={cf.odomEnd} onChange={e => setCf(f => ({ ...f, odomEnd: e.target.value }))} placeholder="Odometer at arrival *" className={inp} style={{ borderColor: BORDER }} />
                  <input type="number" value={cf.fuelFilled} onChange={e => setCf(f => ({ ...f, fuelFilled: e.target.value }))} placeholder="Fuel filled (litres)" className={inp} style={{ borderColor: BORDER }} />
                  <input value={cf.notes} onChange={e => setCf(f => ({ ...f, notes: e.target.value }))} placeholder="Notes (optional)" className={inp} style={{ borderColor: BORDER }} />
                  <div className="flex gap-2">
                    <button onClick={() => completeTrip(t.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: SUCCESS }}>Complete &amp; Close Trip</button>
                    <button onClick={() => setShowComplete(null)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Start trip accordion */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.06)" }}>
            <button onClick={() => setShowStart(!showStart)} className="w-full flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
                  <Plus size={15} style={{ color: PRIMARY }} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold" style={{ color: PRIMARY }}>Start New Trip</div>
                  {assignedVeh && (
                    <div className="text-xs" style={{ color: MUTED }}>{assignedVeh.plate} — {assignedVeh.make} {assignedVeh.model}</div>
                  )}
                </div>
                {!online && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#FFF7ED", color: ORANGE }}>Offline — saves locally</span>}
              </div>
              <ChevronDown size={18} style={{ color: MUTED, transform: showStart ? "rotate(180deg)" : "none", transition: "0.2s" }} />
            </button>
            {showStart && (
              <div className="px-4 pb-4 border-t space-y-3 pt-4" style={{ borderColor: BORDER }}>
                {/* Read-only driver + vehicle */}
                <div className="flex gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB", border: "1px solid " + BORDER }}>
                  <div className="flex-1">
                    <div className="text-xs" style={{ color: MUTED }}>Driver</div>
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>{driverName}</div>
                  </div>
                  {assignedVeh ? (
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: MUTED }}>Vehicle</div>
                      <div className="text-sm font-semibold" style={{ color: TEXT, fontFamily: mono }}>{assignedVeh.plate}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{assignedVeh.make} {assignedVeh.model}</div>
                    </div>
                  ) : (
                    <div className="flex-1 text-xs font-semibold" style={{ color: ERROR }}>No vehicle assigned</div>
                  )}
                </div>
                {/* One Way / Round Trip toggle */}
                <div>
                  <div className="text-xs font-medium mb-1.5" style={{ color: MUTED }}>Trip Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["one-way", "round-trip"] as const).map(mode => (
                      <button key={mode} onClick={() => setSf(f => ({ ...f, tripMode: mode }))}
                        className="py-2.5 rounded-xl text-xs font-bold border transition-all"
                        style={{
                          borderColor: sf.tripMode === mode ? PRIMARY : BORDER,
                          backgroundColor: sf.tripMode === mode ? PRIMARY : "white",
                          color: sf.tripMode === mode ? "white" : MUTED,
                        }}>
                        {mode === "one-way" ? "→ One Way" : "⇄ Round Trip"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Trip Purpose *</div>
                  <input value={sf.purpose} onChange={e => setSf(f => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Airport Transfer, F&B Procurement…" className={inp} style={{ borderColor: BORDER }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Departure Location</div>
                    <input value={sf.from} onChange={e => setSf(f => ({ ...f, from: e.target.value }))} className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Destination *</div>
                    <input value={sf.to} onChange={e => setSf(f => ({ ...f, to: e.target.value }))} placeholder="Final destination" className={inp} style={{ borderColor: BORDER }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Odometer at Departure *</div>
                    <input type="number" value={sf.odomStart} onChange={e => setSf(f => ({ ...f, odomStart: e.target.value }))} placeholder="e.g. 47963" className={inp} style={{ borderColor: BORDER }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Passengers</div>
                    <input type="number" min="1" value={sf.passengers} onChange={e => setSf(f => ({ ...f, passengers: e.target.value }))} className={inp} style={{ borderColor: BORDER }} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: MUTED }}>Notes / Reference</div>
                  <input value={sf.notes} onChange={e => setSf(f => ({ ...f, notes: e.target.value }))} placeholder="Trip ref, guest name, cost centre…" className={inp} style={{ borderColor: BORDER }} />
                </div>
                <button onClick={startTrip} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>
                  <Car size={15} />Start Trip — Record Departure
                </button>
              </div>
            )}
          </div>

          {/* Logbook history */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3 items-center">
              <div className="text-sm font-bold" style={{ color: TEXT }}>Trip History</div>
              <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="ml-auto px-3 py-2 border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }}>
                <option value="All">All Dates</option>
                {dates.map(d => <option key={d}>{d}</option>)}
              </select>
              <div className="text-xs" style={{ color: MUTED }}>{filtered.length} trip{filtered.length === 1 ? "" : "s"}</div>
            </div>
            <LogbookList logs={filtered} expanded={expanded} setExpanded={setExpanded} isDrv={true} />
          </div>
      </div>
      )}
    </div>
  );
}

// Shared logbook list used by both driver and manager views
function LogbookList({ logs, expanded, setExpanded, isDrv }: {
  logs: TripLog[]; expanded: string | null; setExpanded: (id: string | null) => void; isDrv: boolean;
}) {
  if (logs.length === 0) return (
    <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: BORDER }}>
      <div className="text-sm" style={{ color: SUBTLE }}>No trips recorded yet</div>
    </div>
  );
  return (
    <div className="space-y-2">
      {logs.map(t => {
        const isExp = expanded === t.id;
        const statusColor = t.status === "active" ? TEAL : t.synced ? SUCCESS : ORANGE;
        const statusLabel = t.status === "active" ? "Active" : t.synced ? "Synced" : "Pending";
        return (
          <div key={t.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.05)" }}>
            <div onClick={() => setExpanded(isExp ? null : t.id)} className="px-4 py-3 flex items-start sm:items-center gap-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 select-none">
              <div className="shrink-0" style={{ minWidth: 52 }}>
                <div className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</div>
                <div className="text-xs" style={{ color: MUTED }}>{t.departureTime}{t.arrivalTime ? " → " + t.arrivalTime : ""}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: TEXT }}>{t.purpose}</div>
                <div className="text-xs flex flex-wrap items-center gap-1" style={{ color: MUTED }}>
                  <span className="truncate max-w-[120px]">{t.from}</span>
                  <ArrowRight size={9} className="flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{t.to}</span>
                </div>
                {!isDrv && <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{t.driver} · {t.vehicle}</div>}
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                {t.distanceKm !== undefined && (
                  <span className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{t.distanceKm} km</span>
                )}
                {t.stops.length > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: MUTED }}>{t.stops.length} stop{t.stops.length > 1 ? "s" : ""}</span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusColor + "20", color: statusColor }}>{statusLabel}</span>
                <ChevronDown size={13} style={{ color: MUTED, transform: isExp ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              </div>
            </div>
            {isExp && (
              <div className="border-t px-4 py-4" style={{ borderColor: BORDER, backgroundColor: "#FAFAFA" }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {([
                    ["Date", t.date],
                    ["Driver", t.driver],
                    ["Vehicle", t.vehicle],
                    ["Passengers", String(t.passengers)],
                    ["Odom. Start", t.odomStart.toLocaleString() + " km"],
                    ["Odom. End",   t.odomEnd   ? t.odomEnd.toLocaleString()   + " km" : "—"],
                    ["Distance",    t.distanceKm !== undefined ? t.distanceKm + " km" : "—"],
                    ["Fuel Filled", t.fuelFilled ? t.fuelFilled + " L" : "—"],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs" style={{ color: MUTED }}>{k}</div>
                      <div className="text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>{v}</div>
                    </div>
                  ))}
                </div>
                {t.stops.length > 0 && (
                  <div className="mb-3">
                    {t.tripMode === "round-trip" ? (
                      <>
                        {(["outbound", "return"] as const).map(leg => {
                          const legStops = t.stops.filter(s => (leg === "return" ? s.leg === "return" : s.leg !== "return"));
                          if (!legStops.length) return null;
                          return (
                            <div key={leg} className="mb-2">
                              <div className="text-xs font-semibold mb-1.5 flex items-center gap-1"
                                style={{ color: leg === "return" ? "#5B21B6" : TEAL }}>
                                {leg === "return" ? "↩ Return stops" : "→ Outbound stops"}
                              </div>
                              <div className="relative pl-5">
                                <div className="absolute left-2 top-0 bottom-0 w-px" style={{ backgroundColor: leg === "return" ? "#A78BFA" : TEAL + "50" }} />
                                {legStops.map(s => (
                                  <div key={s.id} className="relative mb-2">
                                    <div className="absolute -left-3.5 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: leg === "return" ? "#7C3AED" : ORANGE }} />
                                    <div className="flex flex-wrap items-start gap-2">
                                      <span className="text-xs font-bold shrink-0" style={{ color: TEXT, fontFamily: mono }}>{s.time}</span>
                                      <div>
                                        <div className="text-xs font-semibold" style={{ color: TEXT }}>{s.location}</div>
                                        <div className="text-xs" style={{ color: MUTED }}>{stopLabel(s.durationMin)} · {s.purpose || "No purpose recorded"}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>Stops</div>
                        <div className="relative pl-5">
                          <div className="absolute left-2 top-0 bottom-0 w-px" style={{ backgroundColor: BORDER }} />
                          {t.stops.map(s => (
                            <div key={s.id} className="relative mb-2.5">
                              <div className="absolute -left-3.5 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }} />
                              <div className="flex flex-wrap items-start gap-2">
                                <span className="text-xs font-bold shrink-0" style={{ color: TEXT, fontFamily: mono }}>{s.time}</span>
                                <div>
                                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{s.location}</div>
                                  <div className="text-xs" style={{ color: MUTED }}>{stopLabel(s.durationMin)} · {s.purpose || "No purpose recorded"}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {t.notes && <div className="text-xs" style={{ color: MUTED }}>Notes: <span style={{ color: TEXT }}>{t.notes}</span></div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
