// Batch 19 — Fleet Operations (5 screens)
// DispatchBoard, TripDetail, NewTripRequest, DriverRoster, FleetCosting
import { useState, useEffect } from "react";
import {
  Car, Navigation, Users, Clock, MapPin, Flag, CheckCircle2,
  AlertTriangle, Plus, Search, Filter, Download, Phone,
  ArrowRight, ChevronDown, ChevronRight, Star, AlertCircle,
  Plane, Building2, DollarSign, Fuel, Wrench, BarChart3,
  UserCheck, UserX, TrendingUp, TrendingDown, RefreshCw,
  FileText, Receipt, Eye, Edit3, XCircle, Activity,
  CircleDot, Truck, Timer,
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  type Toast, mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR,
  BORDER, TEXT, MUTED, SUBTLE,
} from "./constants";
import { StatCard, PageHeader, BtnP, BtnO, Badge } from "./UIKit";

// ─── Shared fleet data ────────────────────────────────────────────────────────

type TripStatus = "requested" | "assigned" | "dispatched" | "en-route" | "in-transit" | "completed" | "cancelled";
type ServiceLine = "Airport Transfer" | "Charter" | "Hotel Transport" | "Staff & Logistics";
type ChargeType = "folio" | "complimentary" | "cost-centre" | "cash";

interface Trip {
  id: string;
  serviceL: ServiceLine;
  status: TripStatus;
  guest: string;
  dept?: string;
  pickup: string;
  dropoff: string;
  scheduledTime: string;
  vehicle?: string;
  driver?: string;
  pax: number;
  flight?: string;
  odomStart?: number;
  odomEnd?: number;
  chargeType: ChargeType;
  quotedFare: number;
  finalFare?: number;
  folioRef?: string;
  waitMinutes?: number;
  rating?: number;
  createdAt: string;
}

const TRIPS: Trip[] = [
  { id:"TRP-0041", serviceL:"Airport Transfer", status:"requested",  guest:"Dr. Chukwuemeka Bello",  pickup:"Grand Palms Abuja",   dropoff:"Nnamdi Azikiwe Int'l Airport", scheduledTime:"14:30", pax:2, flight:"AA421", chargeType:"folio",        quotedFare:18000, createdAt:"Today 09:42",  folioRef:"FOL-2019" },
  { id:"TRP-0040", serviceL:"Airport Transfer", status:"assigned",   guest:"Mrs. Ngozi Okonkwo",     pickup:"Nnamdi Azikiwe Int'l", dropoff:"Grand Palms Abuja",            scheduledTime:"12:15", pax:1, flight:"QR842", chargeType:"folio",        quotedFare:18000, createdAt:"Today 08:31",  vehicle:"ABJ-001E",  driver:"Uche Obi",         folioRef:"FOL-2014" },
  { id:"TRP-0039", serviceL:"Charter",          status:"dispatched", guest:"Senator Adeyemi",         pickup:"Grand Palms Abuja",   dropoff:"Aso Rock (State House)",       scheduledTime:"10:00", pax:3, chargeType:"complimentary",                  quotedFare:45000, createdAt:"Today 07:55",  vehicle:"ABJ-002E",  driver:"Emeka Eze"   },
  { id:"TRP-0038", serviceL:"Hotel Transport",  status:"en-route",   guest:"F&B Department",          pickup:"FreshMart Abuja",     dropoff:"Grand Palms Abuja",            scheduledTime:"09:30", pax:1, chargeType:"cost-centre",                    quotedFare:8500,  createdAt:"Today 07:10",  vehicle:"ABJ-003V",  driver:"Musa Danladi", dept:"F&B",  odomStart:48200 },
  { id:"TRP-0037", serviceL:"Airport Transfer", status:"completed",  guest:"Adaeze Okonkwo-James",    pickup:"Nnamdi Azikiwe Int'l", dropoff:"Grand Palms Abuja",           scheduledTime:"07:00", pax:2, flight:"ET902", chargeType:"folio",        quotedFare:18000, finalFare:20500, createdAt:"Yesterday 22:10", vehicle:"ABJ-001E", driver:"Uche Obi", odomStart:47850, odomEnd:47963, waitMinutes:25, rating:4.8, folioRef:"FOL-2010" },
  { id:"TRP-0036", serviceL:"Staff & Logistics",status:"requested",  guest:"Housekeeping Dept",       pickup:"Lagos Linen Co.",     dropoff:"Grand Palms Abuja",            scheduledTime:"11:00", pax:1, chargeType:"cost-centre",                    quotedFare:12000, createdAt:"Today 09:58",  dept:"Housekeeping" },
];

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

interface Driver {
  id: string; name: string; licNo: string; licClass: string;
  licExpiry: string; licDaysLeft: number;
  medExpiry: string; medDaysLeft: number;
  permitRef: string; vehicle?: string;
  onDuty: boolean; tripsToday: number; tripsMonth: number;
  totalKm: number; avgRating: number; incidents: number;
  status: "available" | "on-trip" | "off-duty" | "suspended";
}

const DRIVERS: Driver[] = [
  { id:"DRV-001", name:"Uche Obi",       licNo:"FCT/DL/2019/04821", licClass:"E", licExpiry:"15 Mar 2026", licDaysLeft:162, medExpiry:"01 Jun 2025", medDaysLeft:-136, permitRef:"NIG/DP/22/4821", vehicle:"ABJ-001E", onDuty:true,  tripsToday:2, tripsMonth:48, totalKm:14820, avgRating:4.9, incidents:0, status:"available" },
  { id:"DRV-002", name:"Emeka Eze",       licNo:"FCT/DL/2020/07114", licClass:"B", licExpiry:"03 Oct 2025", licDaysLeft:-11, medExpiry:"15 Apr 2026", medDaysLeft:183, permitRef:"NIG/DP/21/7114", vehicle:"ABJ-002E", onDuty:true,  tripsToday:1, tripsMonth:31, totalKm:9240,  avgRating:4.7, incidents:1, status:"on-trip"   },
  { id:"DRV-003", name:"Musa Danladi",    licNo:"FCT/DL/2021/09302", licClass:"B", licExpiry:"20 Jul 2026", licDaysLeft:289, medExpiry:"10 Jan 2026", medDaysLeft:88,  permitRef:"NIG/DP/23/9302", vehicle:"ABJ-003V", onDuty:true,  tripsToday:1, tripsMonth:22, totalKm:6810,  avgRating:4.6, incidents:0, status:"on-trip"   },
  { id:"DRV-004", name:"Blessing Okafor", licNo:"FCT/DL/2022/11540", licClass:"B", licExpiry:"18 Feb 2027", licDaysLeft:497, medExpiry:"22 Mar 2026", medDaysLeft:169, permitRef:"NIG/DP/23/1154", vehicle:undefined,  onDuty:false, tripsToday:0, tripsMonth:14, totalKm:4120,  avgRating:4.5, incidents:0, status:"off-duty"  },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

const SL_COLOR: Record<ServiceLine, string> = {
  "Airport Transfer": PRIMARY,
  "Charter":          TEAL,
  "Hotel Transport":  ORANGE,
  "Staff & Logistics":SUCCESS,
};

const STATUS_PILL: Record<TripStatus, { bg: string; text: string; label: string }> = {
  requested:  { bg:"#EFF6FF", text:"#1D4ED8", label:"Requested"  },
  assigned:   { bg:"#FEF3C7", text:"#92400E", label:"Assigned"   },
  dispatched: { bg:"#FEF9C3", text:"#713F12", label:"Dispatched" },
  "en-route": { bg:"#DCFCE7", text:"#166534", label:"En Route"   },
  "in-transit":{ bg:"#D1FAE5", text:"#065F46", label:"In Transit" },
  completed:  { bg:"#F1F5F9", text:"#475569", label:"Completed"  },
  cancelled:  { bg:"#FEE2E2", text:"#991B1B", label:"Cancelled"  },
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

  const STATUS_COLS: TripStatus[] = ["requested", "assigned", "dispatched", "en-route", "completed"];
  const unassigned = trips.filter(t => t.status === "requested");
  const selectedTripObj = trips.find(t => t.id === selectedTrip);

  const doAssign = () => {
    if (!selectedTrip || !assignVehicle || !assignDriver) return;
    const veh = VEHICLES.find(v => v.id === assignVehicle);
    const drv = DRIVERS.find(d => d.id === assignDriver);
    // Conflict checks
    if (veh?.status === "maintenance") { add({ type:"error", title:"Vehicle conflict", body:`${veh.plate} is in maintenance.` }); return; }
    if (!veh?.docsOk) { add({ type:"error", title:"Document issue", body:`${veh?.plate} has expired documents.` }); return; }
    if (drv && drv.licDaysLeft < 0) { add({ type:"error", title:"Licence expired", body:`${drv.name}'s licence is expired.` }); return; }
    if (drv && drv.medDaysLeft < 0) { add({ type:"error", title:"Medical expired", body:`${drv.name}'s medical certificate is expired.` }); return; }
    if (drv?.status === "on-trip") { add({ type:"error", title:"Driver conflict", body:`${drv.name} is already on a trip.` }); return; }
    setTrips(prev => prev.map(t => t.id === selectedTrip
      ? { ...t, status:"assigned" as TripStatus, vehicle:assignVehicle, driver:drv?.name }
      : t
    ));
    add({ type:"success", title:"Trip assigned", body:`${selectedTrip} → ${drv?.name} / ${veh?.plate}` });
    setSelectedTrip(null); setAssignVehicle(""); setAssignDriver("");
  };

  const advanceStatus = (id: string) => {
    const order: TripStatus[] = ["requested","assigned","dispatched","en-route","in-transit","completed"];
    setTrips(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx = order.indexOf(t.status);
      return idx < order.length - 1 ? { ...t, status: order[idx+1] } : t;
    }));
  };

  return (
    <div>
      <PageHeader title="Dispatch Board" sub="Fleet trip management — click a trip to assign a vehicle and driver"
        actions={<BtnP label="New Trip" icon={Plus} onClick={() => nav?.("new-trip", "New Trip Request")} />}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Trips Today"     value={String(trips.filter(t=>t.status!=="cancelled").length)} sub="All service lines" icon={Car}     accent={PRIMARY} />
        <StatCard label="Unassigned"      value={String(unassigned.length)} sub={unassigned.length>0?"Action required":"All covered"} icon={AlertCircle} accent={unassigned.length>0?ERROR:SUCCESS} />
        <StatCard label="Vehicles Active" value={String(VEHICLES.filter(v=>v.status==="on-trip").length)} sub={`of ${VEHICLES.length} total`} icon={Truck} accent={TEAL} />
        <StatCard label="Drivers On Duty" value={String(DRIVERS.filter(d=>d.onDuty).length)} sub={`of ${DRIVERS.length} total`} icon={Users} accent={ORANGE} />
      </div>

      <div className="flex gap-5">
        {/* Trip columns */}
        <div className="flex-1 min-w-0">
          {/* Unassigned queue */}
          {unassigned.length > 0 && (
            <div className="mb-4 p-3 rounded-xl border-2 border-dashed" style={{ borderColor:ERROR }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color:ERROR }} />
                <span className="text-xs font-bold" style={{ color:ERROR }}>Unassigned Queue — {unassigned.length} trip{unassigned.length>1?"s":""} pending</span>
              </div>
              <div className="space-y-2">
                {unassigned.map(t => (
                  <div key={t.id} onClick={() => setSelectedTrip(selectedTrip===t.id?null:t.id)} className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border" style={{ backgroundColor:selectedTrip===t.id?"#EFF6FF":"white", borderColor:selectedTrip===t.id?PRIMARY:BORDER }}>
                    <div>
                      <span className="text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{t.id}</span>
                      <span className="mx-2 text-xs" style={{ color:MUTED }}>·</span>
                      <span className="text-xs font-semibold" style={{ color:TEXT }}>{t.guest}</span>
                      <span className="mx-2 text-xs" style={{ color:MUTED }}>→</span>
                      <span className="text-xs" style={{ color:MUTED }}>{t.dropoff}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} style={{ color:MUTED }} />
                      <span className="text-xs font-bold" style={{ color:TEXT }}>{t.scheduledTime}</span>
                      <span className="text-xs" style={{ color:MUTED }}>· {t.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kanban columns */}
          <div className="grid grid-cols-5 gap-3">
            {STATUS_COLS.map(col => {
              const colTrips = trips.filter(t => t.status === col);
              return (
                <div key={col}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color:MUTED }}>{STATUS_PILL[col].label}</span>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor:STATUS_PILL[col].bg, color:STATUS_PILL[col].text }}>{colTrips.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colTrips.map(t => (
                      <div key={t.id} onClick={() => setSelectedTrip(selectedTrip===t.id?null:t.id)} className="p-2.5 rounded-xl border cursor-pointer transition-shadow hover:shadow-md" style={{ backgroundColor:selectedTrip===t.id?"#EFF6FF":"white", borderColor:selectedTrip===t.id?PRIMARY:BORDER }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{t.id}</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor:SL_COLOR[t.serviceL] }} title={t.serviceL} />
                        </div>
                        <div className="text-xs font-semibold mb-1 truncate" style={{ color:TEXT }}>{t.guest}</div>
                        <div className="text-xs truncate" style={{ color:MUTED }}><MapPin size={9} className="inline mr-0.5" />{t.dropoff}</div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs font-bold" style={{ color:TEXT }}>{t.scheduledTime}</span>
                          {t.vehicle && <span className="text-xs" style={{ color:SUBTLE }}>{t.vehicle}</span>}
                        </div>
                        {t.flight && <div className="text-xs mt-1" style={{ color:TEAL }}><Plane size={9} className="inline mr-0.5" />{t.flight}</div>}
                        {col !== "completed" && col !== "requested" && (
                          <button onClick={e=>{e.stopPropagation();advanceStatus(t.id);}} className="mt-2 w-full text-xs py-1 rounded-lg border text-center" style={{ borderColor:BORDER, color:MUTED }}>Advance →</button>
                        )}
                      </div>
                    ))}
                    {colTrips.length===0 && <div className="text-xs text-center py-4" style={{ color:SUBTLE }}>Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right rail */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Assignment panel */}
          {selectedTripObj && selectedTripObj.status === "requested" && (
            <div className="bg-white rounded-xl border p-3" style={{ borderColor:PRIMARY, boxShadow:`0 0 0 2px ${PRIMARY}20` }}>
              <div className="text-xs font-bold mb-2" style={{ color:PRIMARY }}>Assign {selectedTripObj.id}</div>
              <div className="text-xs mb-2" style={{ color:MUTED }}>{selectedTripObj.guest} → {selectedTripObj.dropoff} at {selectedTripObj.scheduledTime}</div>
              <div className="mb-2">
                <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Vehicle</div>
                <select value={assignVehicle} onChange={e=>setAssignVehicle(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor:BORDER }}>
                  <option value="">Select vehicle…</option>
                  {VEHICLES.map(v => <option key={v.id} value={v.id} disabled={v.status==="maintenance"}>{v.plate} — {v.make} {v.model} {v.status!=="available"?`(${v.status})`:""}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Driver</div>
                <select value={assignDriver} onChange={e=>setAssignDriver(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs outline-none" style={{ borderColor:BORDER }}>
                  <option value="">Select driver…</option>
                  {DRIVERS.filter(d=>d.onDuty).map(d => <option key={d.id} value={d.id}>{d.name} {d.status==="on-trip"?"(on trip)":""}</option>)}
                </select>
              </div>
              <button onClick={doAssign} className="w-full py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Confirm Assignment</button>
            </div>
          )}

          {/* Vehicle availability */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor:BORDER }}>
            <div className="text-xs font-bold mb-2" style={{ color:TEXT }}>Vehicles</div>
            <div className="space-y-2">
              {VEHICLES.map(v => (
                <div key={v.id} className="px-2 py-2 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color:TEXT, fontFamily:mono }}>{v.plate}</span>
                    <VehicleStatusPill status={v.status} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color:MUTED }}>{v.make} {v.model} · {v.type}</div>
                  {v.nextFree && <div className="text-xs" style={{ color:SUBTLE }}>Free: {v.nextFree}</div>}
                  {!v.docsOk && <div className="text-xs mt-0.5" style={{ color:ERROR }}>{v.docExpiry}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Drivers on duty */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor:BORDER }}>
            <div className="text-xs font-bold mb-2" style={{ color:TEXT }}>Drivers On Duty</div>
            <div className="space-y-2">
              {DRIVERS.filter(d=>d.onDuty).map(d => (
                <div key={d.id} className="px-2 py-2 rounded-lg" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color:TEXT }}>{d.name}</span>
                    <span className="text-xs" style={{ color:d.status==="on-trip"?ORANGE:SUCCESS }}>{d.status==="on-trip"?"On trip":"Available"}</span>
                  </div>
                  <div className="text-xs" style={{ color:MUTED }}>{d.vehicle ?? "No vehicle"} · {d.tripsToday} trip{d.tripsToday!==1?"s":""} today</div>
                  {d.licDaysLeft < 0 && <div className="text-xs mt-0.5 font-semibold" style={{ color:ERROR }}>⚠ Licence EXPIRED</div>}
                  {d.licDaysLeft >= 0 && d.licDaysLeft <= 30 && <div className="text-xs mt-0.5" style={{ color:WARNING }}>Licence expires {d.licDaysLeft}d</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. TripDetail ───────────────────────────────────────────────────────────

export function TripDetail({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const trip = TRIPS[4]; // completed trip with full data
  const distKm = trip.odomEnd && trip.odomStart ? trip.odomEnd - trip.odomStart : null;

  const TIMELINE = [
    { time:"22:10", event:"Trip created", actor:"System", note:"Auto-created from reservation RES-0892" },
    { time:"22:15", event:"Driver assigned", actor:"Dispatch (Adaeze)", note:"Driver: Uche Obi · Vehicle: ABJ 123 XA" },
    { time:"05:45", event:"Dispatched", actor:"Uche Obi", note:"En route to airport" },
    { time:"06:02", event:"Arrived at pickup", actor:"Uche Obi", note:`Wait started — flight ${trip.flight}` },
    { time:"06:27", event:"Trip started", actor:"Uche Obi", note:`Odometer: ${trip.odomStart?.toLocaleString()} km · Pax boarded` },
    { time:"07:11", event:"Completed", actor:"Uche Obi", note:`Odometer: ${trip.odomEnd?.toLocaleString()} km · Guests dropped off` },
    { time:"07:14", event:"Charge posted to folio", actor:"System", note:`₦${trip.finalFare?.toLocaleString()} → ${trip.folioRef}` },
  ];

  return (
    <div>
      <PageHeader title={trip.id} sub={`${trip.serviceL} · ${trip.guest}`}
        actions={
          <div className="flex gap-2">
            <TripPill status={trip.status} />
            <BtnO label="Print" icon={FileText} onClick={() => add({type:"info", title:"Print queued"})} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Route & Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Route</div>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor:SUCCESS }} />
                <div className="w-0.5 h-12 bg-slate-200" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor:ERROR }} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-xs" style={{ color:MUTED }}>Pickup</div>
                  <div className="text-sm font-semibold" style={{ color:TEXT }}>{trip.pickup}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color:MUTED }}>Drop-off</div>
                  <div className="text-sm font-semibold" style={{ color:TEXT }}>{trip.dropoff}</div>
                </div>
              </div>
              <div className="text-right">
                {distKm && <>
                  <div className="text-2xl font-bold" style={{ color:PRIMARY }}>{distKm} km</div>
                  <div className="text-xs" style={{ color:MUTED }}>Distance travelled</div>
                </>}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-3" style={{ borderColor:BORDER }}>
              {[["Odometer Start",`${trip.odomStart?.toLocaleString()} km`],["Odometer End",`${trip.odomEnd?.toLocaleString()} km`],["Waiting Time",`${trip.waitMinutes} min`]].map(([k,v])=>(
                <div key={k}><div className="text-xs" style={{ color:MUTED }}>{k}</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</div></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Schedule</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[["Scheduled","07:00"],["Dispatched","05:45"],["Arrived at Pickup","06:02"],["Completed","07:11"]].map(([k,v])=>(
                <div key={k} className="p-2 rounded-xl" style={{ backgroundColor:"#F9FAFB" }}>
                  <div className="text-xs" style={{ color:MUTED }}>{k}</div>
                  <div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Charge</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              {[["Type","Folio Charge"],["Quoted Fare",`₦${trip.quotedFare.toLocaleString()}`],["Final Fare",`₦${trip.finalFare?.toLocaleString()}`],["Waiting Surcharge","₦2,500"]].map(([k,v])=>(
                <div key={k}><div className="text-xs" style={{ color:MUTED }}>{k}</div><div className="text-sm font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</div></div>
              ))}
            </div>
            <div className="text-xs" style={{ color:MUTED }}>Folio Reference: <span className="font-semibold" style={{ color:PRIMARY, fontFamily:mono }}>{trip.folioRef}</span></div>
          </div>

          {trip.flight && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="text-sm font-semibold mb-2" style={{ color:TEXT }}>Flight Details</div>
              <div className="flex gap-6">
                <div><div className="text-xs" style={{ color:MUTED }}>Flight Number</div><div className="text-sm font-bold" style={{ color:TEAL, fontFamily:mono }}>{trip.flight}</div></div>
                <div><div className="text-xs" style={{ color:MUTED }}>Direction</div><div className="text-sm font-bold" style={{ color:TEXT }}>Arrival pickup</div></div>
                <div><div className="text-xs" style={{ color:MUTED }}>Terminal</div><div className="text-sm font-bold" style={{ color:TEXT }}>International</div></div>
              </div>
            </div>
          )}
        </div>

        {/* Right: vehicle, driver, rating, timeline */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Vehicle & Driver</div>
            {[["Vehicle","ABJ 123 XA"],["Make/Model","Toyota Camry"],["Driver","Uche Obi"],["Licence","FCT/DL/2019/04821"],["Passengers",String(trip.pax)]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-1.5 border-b last:border-b-0 text-xs" style={{ borderColor:BORDER }}><span style={{ color:MUTED }}>{k}</span><span className="font-semibold" style={{ color:TEXT }}>{v}</span></div>
            ))}
          </div>

          {trip.rating && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <div className="text-sm font-semibold mb-2" style={{ color:TEXT }}>Guest Rating</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold" style={{ color:TEXT }}>{trip.rating}</div>
                <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} size={16} fill={s<=Math.round(trip.rating!) ? WARNING : "none"} style={{ color:WARNING }} />)}</div>
              </div>
              <div className="text-xs mt-1" style={{ color:MUTED }}>Excellent service, very punctual.</div>
            </div>
          )}

          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Event Timeline</div>
            <div className="space-y-2.5">
              {TIMELINE.map((e,i)=>(
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor:i===TIMELINE.length-1?SUCCESS:BORDER }} />
                    {i<TIMELINE.length-1 && <div className="w-0.5 flex-1 bg-slate-200" style={{ minHeight:16 }} />}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{e.time}</span>
                      <span className="text-xs font-semibold" style={{ color:TEXT }}>{e.event}</span>
                    </div>
                    <div className="text-xs" style={{ color:MUTED }}>{e.actor} · {e.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. NewTripRequest ────────────────────────────────────────────────────────

type TripType = "Airport Transfer" | "Charter" | "Staff & Logistics";
const VEHICLE_RATES = [
  { type:"Saloon",  baseRate:8000,  perKm:120, waiting:500  },
  { type:"SUV",     baseRate:12000, perKm:180, waiting:750  },
  { type:"Van",     baseRate:10000, perKm:150, waiting:600  },
  { type:"Bus",     baseRate:18000, perKm:200, waiting:1000 },
];

export function NewTripRequest({ add, nav }: { add: (t: Omit<Toast,"id">) => void; nav?: (s: string, label: string) => void }) {
  const [tripType, setTripType] = useState<TripType>("Airport Transfer");
  const [vehicleType, setVehicleType] = useState("Saloon");
  const [chargeType, setChargeType] = useState<ChargeType>("folio");
  const [estKm, setEstKm] = useState(15);
  const [creating, setCreating] = useState(false);

  const rate = VEHICLE_RATES.find(r => r.type === vehicleType)!;
  const quote = rate.baseRate + rate.perKm * estKm;
  const afterHours = false;
  const afterHoursSurcharge = afterHours ? 2500 : 0;
  const total = quote + afterHoursSurcharge;

  const confirm = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      add({ type:"success", title:"Trip created — TRP-0042", body:"Status: Requested. Waiting for dispatch assignment." });
      nav?.("dispatch-board", "Dispatch Board");
    }, 1200);
  };

  const SL_TYPES: TripType[] = ["Airport Transfer","Charter","Staff & Logistics"];

  return (
    <div>
      <PageHeader title="New Trip Request" sub="Select a service line to begin" />

      {/* Service line selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SL_TYPES.map(t => (
          <button key={t} onClick={() => setTripType(t)} className="p-4 rounded-xl border text-left transition-all" style={{ borderColor:tripType===t?PRIMARY:BORDER, backgroundColor:tripType===t?"#EFF6FF":"white", boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="mb-1.5">{t==="Airport Transfer"?<Plane size={20} style={{ color:tripType===t?PRIMARY:SUBTLE }} />:t==="Charter"?<Car size={20} style={{ color:tripType===t?PRIMARY:SUBTLE }} />:<Truck size={20} style={{ color:tripType===t?PRIMARY:SUBTLE }} />}</div>
            <div className="text-sm font-bold" style={{ color:tripType===t?PRIMARY:TEXT }}>{t}</div>
            <div className="text-xs mt-0.5" style={{ color:MUTED }}>
              {t==="Airport Transfer"?"Pickup/dropoff at airport":t==="Charter"?"Custom hourly or daily booking":"Internal department logistics"}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dynamic form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-4" style={{ color:TEXT }}>
              {tripType === "Airport Transfer" ? "Transfer Details" : tripType === "Charter" ? "Charter Details" : "Logistics Details"}
            </div>

            {tripType === "Airport Transfer" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Direction</div>
                  <select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                    <option>Arrival pickup — airport → hotel</option>
                    <option>Departure drop-off — hotel → airport</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Reservation (optional lookup)</div>
                  <input placeholder="Search reservation or guest…" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
                </div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Guest Name</div><input defaultValue="Dr. Chukwuemeka Bello" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Flight Number</div><input placeholder="e.g. AA421" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Arrival / Departure Time</div><input type="time" defaultValue="14:30" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Terminal</div><select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}><option>International</option><option>Domestic</option></select></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Passenger Count</div><input type="number" defaultValue="2" min={1} max={20} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Luggage (bags)</div><input type="number" defaultValue="3" min={0} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
              </div>
            )}

            {tripType === "Charter" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Guest / Client</div><input placeholder="Guest name or company" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Duration Basis</div>
                  <select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}><option>Hourly</option><option>Half-day (4h)</option><option>Full day (8h)</option></select>
                </div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Start Time</div><input type="datetime-local" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Estimated End</div><input type="datetime-local" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div className="lg:col-span-2"><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Destination / Itinerary</div><input placeholder="e.g. Aso Rock → National Assembly → CBD" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
              </div>
            )}

            {tripType === "Staff & Logistics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Department</div><select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}><option>F&B</option><option>Housekeeping</option><option>Maintenance</option><option>Finance</option><option>Management</option></select></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Cost Centre</div><input placeholder="e.g. F&B-OPS-001" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Pickup Location</div><input placeholder="e.g. FreshMart Abuja, Wuse Market" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Dropoff Location</div><input defaultValue="Grand Palms Abuja" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Scheduled Time</div><input type="time" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
                <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Purpose</div><input placeholder="Brief description" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t" style={{ borderColor:BORDER }}>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Special Instructions</div>
              <textarea rows={2} placeholder="VIP handling, accessibility needs, stops…" className="w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none" style={{ borderColor:BORDER }} />
            </div>
          </div>
        </div>

        {/* Rate quote panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Vehicle & Rate</div>
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Vehicle Type</div>
              <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                {VEHICLE_RATES.map(r=><option key={r.type}>{r.type}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Estimated Distance (km)</div>
              <input type="number" value={estKm} onChange={e=>setEstKm(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>

            <div className="p-3 rounded-xl space-y-1.5" style={{ backgroundColor:"#F9FAFB" }}>
              <div className="text-xs font-semibold mb-1" style={{ color:MUTED }}>Quote Breakdown</div>
              {[["Base rate",`₦${rate.baseRate.toLocaleString()}`],[`Per km (${estKm} km)`,`₦${(rate.perKm*estKm).toLocaleString()}`],["Waiting time","Metered at ₦"+rate.waiting+"/15min"],[afterHours?"After-hours surcharge":"",""],].filter(r=>r[0]).map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs"><span style={{ color:MUTED }}>{k}</span><span style={{ color:TEXT }}>{v}</span></div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-1.5 border-t" style={{ borderColor:BORDER }}>
                <span style={{ color:TEXT }}>Quoted Total</span>
                <span style={{ color:PRIMARY, fontFamily:mono }}>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Charge Type</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(["folio","complimentary","cost-centre","cash"] as ChargeType[]).map(ct=>(
                  <button key={ct} onClick={()=>setChargeType(ct)} className="py-1.5 rounded-lg text-xs font-medium capitalize border" style={{ borderColor:chargeType===ct?PRIMARY:BORDER, backgroundColor:chargeType===ct?"#EFF6FF":"white", color:chargeType===ct?PRIMARY:MUTED }}>
                    {ct==="cost-centre"?"Cost Centre":ct.charAt(0).toUpperCase()+ct.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={confirm} disabled={creating} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor:PRIMARY }}>
            {creating ? "Creating…" : "Create Trip Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 4. DriverRoster ─────────────────────────────────────────────────────────

export function DriverRoster({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [drivers, setDrivers] = useState(DRIVERS);
  const [selected, setSelected] = useState<string | null>(null);

  const toggleDuty = (id: string) => {
    setDrivers(prev => prev.map(d => d.id===id ? { ...d, onDuty:!d.onDuty, status:d.onDuty?"off-duty":"available" as Driver["status"] } : d));
    add({ type:"info", title:"Duty status updated" });
  };

  const DRIVER_STATUS_PILL: Record<Driver["status"], { bg:string; text:string }> = {
    available: { bg:"#DCFCE7", text:"#166534" },
    "on-trip": { bg:"#FEF3C7", text:"#92400E" },
    "off-duty":{ bg:"#F1F5F9", text:"#64748B" },
    suspended: { bg:"#FEE2E2", text:"#991B1B" },
  };

  return (
    <div>
      <PageHeader title="Driver Roster" sub="Licence validity, on-duty status, trip history, and compliance"
        actions={<BtnP label="Add Driver" icon={Plus} onClick={() => add({type:"info",title:"Add driver"})} />}
      />

      {/* Compliance alerts */}
      {drivers.some(d=>d.licDaysLeft<0||d.medDaysLeft<0) && (
        <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor:"#FEF3C7", border:`1px solid #FDE68A` }}>
          <div className="text-xs font-bold mb-1" style={{ color:"#92400E" }}>Compliance alerts</div>
          {drivers.filter(d=>d.licDaysLeft<0).map(d=><div key={d.id} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Driver's licence EXPIRED ({d.licExpiry}). Remove from duty immediately.</div>)}
          {drivers.filter(d=>d.medDaysLeft<0).map(d=><div key={d.id} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Medical certificate EXPIRED ({d.medExpiry}).</div>)}
          {drivers.filter(d=>d.licDaysLeft>=0&&d.licDaysLeft<=30).map(d=><div key={d.id} className="text-xs" style={{ color:"#92400E" }}>⚠ {d.name} — Licence expires in {d.licDaysLeft} days.</div>)}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Drivers"  value={String(drivers.length)}                          sub="On roster"       icon={Users}     accent={PRIMARY} />
        <StatCard label="On Duty"        value={String(drivers.filter(d=>d.onDuty).length)}       sub="Available/On trip" icon={UserCheck} accent={SUCCESS} />
        <StatCard label="Licence Issues" value={String(drivers.filter(d=>d.licDaysLeft<=30).length)} sub="Expiring ≤30 days" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Trips This Month" value={String(drivers.reduce((s,d)=>s+d.tripsMonth,0))} sub="All drivers" icon={Car} accent={TEAL} />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead><TH cols={["Driver","Licence","Licence Expiry","Medical Cert","Vehicle","Status","Trips (Mo)","Rating","Actions"]} /></thead>
          <tbody>
            {drivers.map(d=>{
              const sel = selected===d.id;
              const licWarn = d.licDaysLeft < 0 ? "expired" : d.licDaysLeft <= 30 ? "warn" : "ok";
              const medWarn = d.medDaysLeft < 0 ? "expired" : d.medDaysLeft <= 60 ? "warn" : "ok";
              const sp = DRIVER_STATUS_PILL[d.status];
              return (
                <>
                  <tr key={d.id} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor:BORDER }} onClick={()=>setSelected(sel?null:d.id)}>
                    <td className="px-3 py-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mb-0.5" style={{ backgroundColor:PRIMARY }}>{d.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div className="text-xs font-semibold" style={{ color:TEXT }}>{d.name}</div>
                    </td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{d.licNo}<br/><span className="text-xs" style={{ color:SUBTLE }}>Class {d.licClass}</span></td>
                    <td className="px-3 py-2.5">
                      <ExpiryBadge days={d.licDaysLeft} label={d.licExpiry} />
                    </td>
                    <td className="px-3 py-2.5">
                      <ExpiryBadge days={d.medDaysLeft} label={d.medExpiry} />
                    </td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{d.vehicle ?? "—"}</td>
                    <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:sp.bg, color:sp.text }}>{d.status}</span></td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT }}>{d.tripsMonth}</td>
                    <td className="px-3 py-2.5 text-xs"><span className="flex items-center gap-1"><Star size={11} style={{ color:WARNING }} />{d.avgRating}</span></td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={e=>{e.stopPropagation();toggleDuty(d.id);}} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor:BORDER, color:d.onDuty?WARNING:SUCCESS }} title={d.onDuty?"Set Off Duty":"Set On Duty"}>
                          {d.onDuty?<UserX size={11}/>:<UserCheck size={11}/>}
                        </button>
                        <button onClick={e=>{e.stopPropagation();add({type:"info",title:`Assigning vehicle to ${d.name}` });}} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor:BORDER, color:MUTED }} title="Assign vehicle"><Car size={11}/></button>
                        {d.incidents>0 && <button className="px-2 py-1 rounded-lg text-xs border" style={{ borderColor:"#FCA5A5", color:ERROR }} title="View incidents"><AlertTriangle size={11}/></button>}
                      </div>
                    </td>
                  </tr>
                  {sel && (
                    <tr key={`${d.id}-exp`} style={{ backgroundColor:"#F9FAFB" }}>
                      <td colSpan={9} className="px-4 py-3 text-xs" style={{ color:MUTED }}>
                        <div className="flex gap-6 flex-wrap">
                          <span>Permit Ref: <strong style={{ fontFamily:mono, color:TEXT }}>{d.permitRef}</strong></span>
                          <span>Total km: <strong style={{ color:TEXT }}>{d.totalKm.toLocaleString()}</strong></span>
                          <span>Trips today: <strong style={{ color:TEXT }}>{d.tripsToday}</strong></span>
                          <span>Incidents: <strong style={{ color:d.incidents>0?ERROR:TEXT }}>{d.incidents}</strong></span>
                          <button onClick={()=>setSelected(null)} style={{ color:PRIMARY }}>Close</button>
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
