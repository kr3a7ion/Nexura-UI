// Batch 20 — Fleet Assets & Fuel (4 screens)
// VehicleRegister, VehicleDetail, FuelLog, GeneratorDieselLog
import { useState } from "react";
import {
  Car, AlertTriangle, CheckCircle2, Clock, Fuel, Wrench, FileText,
  Plus, Download, Search, Filter, ChevronDown, ChevronRight,
  BarChart3, Activity, Zap, MapPin, User, Calendar, TrendingUp,
  TrendingDown, AlertCircle, RefreshCw, Settings, Eye, Edit3,
  Battery, Gauge, Thermometer,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  type Toast, type Role, mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR,
  BORDER, TEXT, MUTED, SUBTLE,
} from "./constants";
import { StatCard, PageHeader, BtnP, BtnO } from "./UIKit";

// ─── Shared data ──────────────────────────────────────────────────────────────

type DocStatus = "valid" | "expiring-soon" | "expired";
type VehicleOwnership = "owned" | "leased" | "contractor";
type VehicleStatus = "active" | "maintenance" | "off-road" | "decommissioned";

interface VehicleDoc {
  type: string; ref: string; issuer: string;
  issued: string; expires: string; daysLeft: number;
  status: DocStatus; hasAttachment: boolean;
}

interface Vehicle {
  id: string; plate: string; make: string; model: string; year: number;
  type: "Saloon" | "SUV" | "Van" | "Bus" | "Pickup";
  seats: number; ownership: VehicleOwnership;
  status: VehicleStatus;
  odometer: number; fuelType: "Petrol" | "Diesel" | "Hybrid";
  nextServiceKm: number; nextServiceDate: string;
  assignedDriver?: string; utilPct: number;
  docs: VehicleDoc[];
  worstDocStatus: DocStatus;
}

const VEHICLES: Vehicle[] = [
  {
    id: "ABJ-001E", plate: "ABJ 123 XA", make: "Toyota", model: "Camry", year: 2021,
    type: "Saloon", seats: 5, ownership: "owned", status: "active",
    odometer: 47963, fuelType: "Petrol", nextServiceKm: 50000, nextServiceDate: "15 Nov 2025",
    assignedDriver: "Uche Obi", utilPct: 78, worstDocStatus: "valid",
    docs: [
      { type: "Vehicle Licence",   ref: "FCT/VL/2025/04821", issuer: "FCTA",      issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  status: "valid",          hasAttachment: true },
      { type: "Insurance",         ref: "AIG/COM/2025/78431", issuer: "AIG Nigeria", issued: "01 Mar 2025", expires: "28 Feb 2026", daysLeft: 192,  status: "valid",          hasAttachment: true },
      { type: "Roadworthiness",    ref: "NIG/RW/2025/10029",  issuer: "VIO",       issued: "10 Jan 2025", expires: "09 Jan 2026", daysLeft: 142,  status: "valid",          hasAttachment: true },
      { type: "Hackney Permit",    ref: "FCT/HP/2025/00912",  issuer: "FCTA",      issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  status: "valid",          hasAttachment: false },
      { type: "Proof of Ownership",ref: "CMR/2021/09842",     issuer: "FRN",       issued: "15 May 2021", expires: "N/A",         daysLeft: 9999, status: "valid",          hasAttachment: true },
    ],
  },
  {
    id: "ABJ-002E", plate: "ABJ 456 YB", make: "Toyota", model: "HiAce", year: 2019,
    type: "Van", seats: 14, ownership: "owned", status: "active",
    odometer: 98210, fuelType: "Diesel", nextServiceKm: 100000, nextServiceDate: "01 Oct 2025",
    assignedDriver: "Emeka Eze", utilPct: 62, worstDocStatus: "expiring-soon",
    docs: [
      { type: "Vehicle Licence",   ref: "FCT/VL/2025/04822", issuer: "FCTA",      issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  status: "valid",          hasAttachment: true },
      { type: "Insurance",         ref: "AIG/COM/2024/65201", issuer: "AIG Nigeria", issued: "01 Oct 2024", expires: "30 Sep 2025", daysLeft: 41,   status: "expiring-soon",  hasAttachment: true },
      { type: "Roadworthiness",    ref: "NIG/RW/2024/08801",  issuer: "VIO",       issued: "10 Sep 2024", expires: "09 Sep 2025", daysLeft: 20,   status: "expiring-soon",  hasAttachment: true },
      { type: "Hackney Permit",    ref: "FCT/HP/2025/00913",  issuer: "FCTA",      issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  status: "valid",          hasAttachment: true },
      { type: "Proof of Ownership",ref: "CMR/2019/04521",     issuer: "FRN",       issued: "03 Mar 2019", expires: "N/A",         daysLeft: 9999, status: "valid",          hasAttachment: true },
    ],
  },
  {
    id: "ABJ-003V", plate: "ABJ 789 ZC", make: "Toyota", model: "Land Cruiser", year: 2022,
    type: "SUV", seats: 7, ownership: "leased", status: "active",
    odometer: 31480, fuelType: "Diesel", nextServiceKm: 35000, nextServiceDate: "20 Nov 2025",
    assignedDriver: "Musa Danladi", utilPct: 55, worstDocStatus: "valid",
    docs: [
      { type: "Vehicle Licence",   ref: "FCT/VL/2025/04823", issuer: "FCTA",      issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  status: "valid",          hasAttachment: true },
      { type: "Insurance",         ref: "AIICO/2025/44120",   issuer: "AIICO",     issued: "01 May 2025", expires: "30 Apr 2026", daysLeft: 252,  status: "valid",          hasAttachment: true },
      { type: "Roadworthiness",    ref: "NIG/RW/2025/14100",  issuer: "VIO",       issued: "15 Mar 2025", expires: "14 Mar 2026", daysLeft: 206,  status: "valid",          hasAttachment: true },
      { type: "Hackney Permit",    ref: "FCT/HP/2025/00914",  issuer: "FCTA",      issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  status: "valid",          hasAttachment: true },
      { type: "Proof of Ownership",ref: "LEASE/STANBIC/2022", issuer: "Stanbic",   issued: "01 Apr 2022", expires: "31 Mar 2027", daysLeft: 588,  status: "valid",          hasAttachment: true },
    ],
  },
  {
    id: "ABJ-004V", plate: "ABJ 321 WD", make: "Mercedes", model: "Sprinter", year: 2018,
    type: "Bus", seats: 20, ownership: "owned", status: "maintenance",
    odometer: 214850, fuelType: "Diesel", nextServiceKm: 215000, nextServiceDate: "OVERDUE",
    assignedDriver: undefined, utilPct: 0, worstDocStatus: "expired",
    docs: [
      { type: "Vehicle Licence",   ref: "FCT/VL/2024/01821", issuer: "FCTA",      issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, status: "expired",        hasAttachment: true },
      { type: "Insurance",         ref: "AIG/COM/2024/21009", issuer: "AIG Nigeria", issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, status: "expired",        hasAttachment: true },
      { type: "Roadworthiness",    ref: "NIG/RW/2024/00901",  issuer: "VIO",       issued: "10 Jan 2024", expires: "09 Jan 2025", daysLeft: -233, status: "expired",        hasAttachment: true },
      { type: "Hackney Permit",    ref: "FCT/HP/2024/00410",  issuer: "FCTA",      issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, status: "expired",        hasAttachment: false },
      { type: "Proof of Ownership",ref: "CMR/2018/08811",     issuer: "FRN",       issued: "10 Oct 2018", expires: "N/A",         daysLeft: 9999, status: "valid",          hasAttachment: true },
    ],
  },
];

// ─── Generator data ───────────────────────────────────────────────────────────
interface Generator {
  id: string; name: string; kva: number; location: string;
  runtimeHours: number; tankCapacityL: number; status: "running" | "standby" | "maintenance";
  nextServiceHrs: number;
}

const GENERATORS: Generator[] = [
  { id:"GEN-001", name:"Main Generator",  kva:500, location:"Generator House",     runtimeHours:14280, tankCapacityL:1000, status:"standby",     nextServiceHrs:14500 },
  { id:"GEN-002", name:"Block B Backup",  kva:200, location:"Block B Annex",        runtimeHours:8940,  tankCapacityL:500,  status:"standby",     nextServiceHrs:9000  },
  { id:"GEN-003", name:"Pool Area Small", kva:50,  location:"Pool & Spa Building",  runtimeHours:2310,  tankCapacityL:200,  status:"running",     nextServiceHrs:2500  },
];

// ─── Navigation state ─────────────────────────────────────────────────────────
let _vehicleId = "ABJ-001E";
export const setVehicleId = (id: string) => { _vehicleId = id; };

// ─── Shared helpers ───────────────────────────────────────────────────────────

function DocPill({ status }: { status: DocStatus }) {
  const map = {
    valid:          { bg:"#DCFCE7", text:"#166534", label:"Valid"    },
    "expiring-soon":{ bg:"#FEF3C7", text:"#92400E", label:"Expiring" },
    expired:        { bg:"#FEE2E2", text:"#991B1B", label:"Expired"  },
  };
  const s = map[status];
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:s.bg, color:s.text }}>{s.label}</span>;
}

function VStatusPill({ status }: { status: VehicleStatus }) {
  const map = {
    active:         { bg:"#DCFCE7", text:"#166534" },
    maintenance:    { bg:"#FEF3C7", text:"#92400E" },
    "off-road":     { bg:"#FEE2E2", text:"#991B1B" },
    decommissioned: { bg:"#F1F5F9", text:"#475569" },
  };
  const s = map[status];
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:s.bg, color:s.text }}>{status}</span>;
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

// ─── 1. VehicleRegister ───────────────────────────────────────────────────────

export function VehicleRegister({ add, nav }: { add: (t: Omit<Toast,"id">) => void; nav?: (s: string, label: string) => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwnership, setFilterOwnership] = useState("all");
  const [filterDocState, setFilterDocState] = useState("all");
  const [statusEdit, setStatusEdit] = useState<{ id: string; current: VehicleStatus } | null>(null);
  const [statusTarget, setStatusTarget] = useState<VehicleStatus>("active");
  const [statusReason, setStatusReason] = useState("");

  const alertVehicles = vehicles.filter(v =>
    v.docs.some(d => d.daysLeft > 0 && d.daysLeft <= 30) ||
    v.nextServiceDate === "OVERDUE" ||
    v.docs.some(d => d.daysLeft < 0)
  );

  const filtered = vehicles.filter(v => {
    if (search && !v.plate.toLowerCase().includes(search.toLowerCase()) && !v.make.toLowerCase().includes(search.toLowerCase()) && !v.model.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (filterOwnership !== "all" && v.ownership !== filterOwnership) return false;
    if (filterDocState !== "all" && v.worstDocStatus !== filterDocState) return false;
    return true;
  });

  const applyStatusChange = () => {
    if (!statusEdit) return;
    setVehicles(prev => prev.map(v => v.id === statusEdit.id ? { ...v, status: statusTarget } : v));
    add({ type: "success", title: `${statusEdit.id} status → ${statusTarget}`, body: statusReason || undefined });
    setStatusEdit(null); setStatusReason("");
  };

  return (
    <div>
      {/* Status change modal */}
      {statusEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:"rgba(13,27,46,0.55)" }}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <div className="text-sm font-bold mb-1" style={{ color:TEXT }}>Change Vehicle Status</div>
            <div className="text-xs mb-4" style={{ color:MUTED }}>Vehicle: <strong style={{ fontFamily:mono }}>{statusEdit.id}</strong> · Current: <strong className="capitalize">{statusEdit.current}</strong></div>
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>New Status</div>
              <select value={statusTarget} onChange={e => setStatusTarget(e.target.value as VehicleStatus)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                {(["active","maintenance","off-road","decommissioned"] as VehicleStatus[]).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Reason / Note</div>
              <input value={statusReason} onChange={e => setStatusReason(e.target.value)} placeholder="e.g. Engine overhaul scheduled" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>
            <div className="flex gap-2">
              <button onClick={applyStatusChange} className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Apply</button>
              <button onClick={() => { setStatusEdit(null); setStatusReason(""); }} className="flex-1 py-2 rounded-xl text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <PageHeader title="Vehicle Register" sub="Fleet assets — document status, service schedule, utilisation"
        actions={<BtnP label="Add Vehicle" icon={Plus} onClick={() => add({type:"info",title:"Add vehicle — full form coming in next release"})} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total Vehicles"  value={String(vehicles.length)}                              sub="On register"        icon={Car}           accent={PRIMARY} />
        <StatCard label="Active"          value={String(vehicles.filter(v=>v.status==="active").length)} sub="Operational"       icon={CheckCircle2}  accent={SUCCESS} />
        <StatCard label="Doc Issues"      value={String(vehicles.filter(v=>v.worstDocStatus!=="valid").length)} sub="Expiring or expired" icon={AlertTriangle} accent={ERROR}   />
        <StatCard label="Services Overdue" value={String(vehicles.filter(v=>v.nextServiceDate==="OVERDUE").length)} sub="Immediate action" icon={Wrench}       accent={WARNING} />
      </div>

      {/* Alert strip */}
      {alertVehicles.length > 0 && (
        <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor:"#FEF3C7", border:`1px solid #FDE68A` }}>
          <div className="text-xs font-bold mb-1" style={{ color:"#92400E" }}>Document & Service Alerts</div>
          {alertVehicles.map(v => (
            <div key={v.id} className="text-xs" style={{ color:"#92400E" }}>
              {v.plate} ({v.make} {v.model}) — {
                v.docs.filter(d=>d.daysLeft<0).length > 0 ? `${v.docs.filter(d=>d.daysLeft<0).length} document(s) EXPIRED` :
                v.nextServiceDate === "OVERDUE" ? "Service OVERDUE" :
                `${v.docs.filter(d=>d.daysLeft>=0&&d.daysLeft<=30).length} document(s) expiring within 30 days`
              }
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border" style={{ borderColor:BORDER, backgroundColor:"white" }}>
          <Search size={13} style={{ color:MUTED }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plate, make, model…" className="text-xs outline-none" style={{ color:TEXT, width:160 }} />
        </div>
        {[["Status","filterStatus",["all","active","maintenance","off-road","decommissioned"]],["Ownership","filterOwnership",["all","owned","leased","contractor"]],["Documents","filterDocState",["all","valid","expiring-soon","expired"]]].map(([label, key, opts]) => (
          <select key={key as string} value={key==="filterStatus"?filterStatus:key==="filterOwnership"?filterOwnership:filterDocState} onChange={e=>key==="filterStatus"?setFilterStatus(e.target.value):key==="filterOwnership"?setFilterOwnership(e.target.value):setFilterDocState(e.target.value)} className="px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
            {(opts as string[]).map(o=><option key={o} value={o}>{o==="all"?`All ${label}`:o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
          </select>
        ))}
        <ExportBtn add={add} label="Vehicle Register" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead><TH cols={["Registration","Make / Model","Type","Ownership","Status","Odometer","Documents","Next Service","Driver","Util %",""]} /></thead>
          <tbody>
            {filtered.map(v => {
              const serviceKmLeft = v.nextServiceKm - v.odometer;
              const serviceOverdue = v.nextServiceDate === "OVERDUE" || serviceKmLeft <= 0;
              return (
                <tr key={v.id} className="border-t hover:bg-slate-50 cursor-pointer" style={{ borderColor:BORDER }} onClick={() => { setVehicleId(v.id); nav?.("vehicle-detail", "Vehicle Detail"); }}>
                  <td className="px-3 py-3">
                    <div className="text-sm font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{v.plate}</div>
                    <div className="text-xs" style={{ color:SUBTLE }}>{v.id}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-semibold" style={{ color:TEXT }}>{v.make} {v.model}</div>
                    <div className="text-xs" style={{ color:MUTED }}>{v.year} · {v.fuelType} · {v.seats} seats</div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color:MUTED }}>{v.type}</td>
                  <td className="px-3 py-3 text-xs capitalize" style={{ color:MUTED }}>{v.ownership}</td>
                  <td className="px-3 py-3" onClick={e => { e.stopPropagation(); setStatusTarget(v.status); setStatusEdit({ id:v.id, current:v.status }); }}>
                    <VStatusPill status={v.status} />
                    <div className="text-xs mt-0.5" style={{ color:SUBTLE }}>click to change</div>
                  </td>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{v.odometer.toLocaleString()} km</td>
                  <td className="px-3 py-3">
                    <DocPill status={v.worstDocStatus} />
                    {v.worstDocStatus !== "valid" && (
                      <div className="text-xs mt-0.5" style={{ color:MUTED }}>
                        {v.docs.filter(d=>d.status!=="valid").length} issue{v.docs.filter(d=>d.status!=="valid").length!==1?"s":""}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-semibold" style={{ color:serviceOverdue?ERROR:serviceKmLeft<=2000?WARNING:TEXT }}>
                      {serviceOverdue ? "OVERDUE" : `${serviceKmLeft.toLocaleString()} km`}
                    </div>
                    <div className="text-xs" style={{ color:MUTED }}>{v.nextServiceDate}</div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color:MUTED }}>{v.assignedDriver ?? "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
                        <div className="h-full rounded-full" style={{ width:`${v.utilPct}%`, backgroundColor:v.utilPct>=70?SUCCESS:v.utilPct>=50?WARNING:ERROR }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color:TEXT }}>{v.utilPct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color:SUBTLE }}><ChevronRight size={14}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 2. VehicleDetail ─────────────────────────────────────────────────────────

const FUEL_ENTRIES = [
  { date:"18 Aug",  litres:45, odom:47500, cost:50625, station:"MRS Wuse",      prev:47202, driver:"Uche Obi"    },
  { date:"10 Aug",  litres:48, odom:47202, cost:54000, station:"Ardova Garki",  prev:46900, driver:"Uche Obi"    },
  { date:"02 Aug",  litres:42, odom:46900, cost:47250, station:"MRS Wuse",      prev:46620, driver:"Uche Obi"    },
  { date:"25 Jul",  litres:50, odom:46620, cost:56250, station:"Conoil Maitama",prev:46300, driver:"Uche Obi"    },
  { date:"17 Jul",  litres:44, odom:46300, cost:49500, station:"MRS Wuse",      prev:46010, driver:"Uche Obi"    },
];

const FUEL_CHART_DATA = FUEL_ENTRIES.map(e => ({
  date: e.date,
  consumption: +((e.litres / (e.odom - e.prev)) * 100).toFixed(1),
}));

const SVC_HISTORY = [
  { date:"12 Jun 2025", km:45000, type:"10k Service", cost:85000, parts:"Oil filter, air filter, brake pads", garage:"Elizade Toyota Abuja" },
  { date:"15 Mar 2025", km:42500, type:"Minor Service", cost:35000, parts:"Engine oil, oil filter", garage:"Elizade Toyota Abuja" },
  { date:"04 Jan 2025", km:40000, type:"Major Service", cost:240000, parts:"Timing belt, water pump, full brake set, 4 tyres", garage:"Elizade Toyota Abuja" },
];

const TRIP_HISTORY = [
  { date:"20 Aug", id:"TRP-0040", route:"Hotel → Airport", km:63, revenue:20500, driver:"Uche Obi" },
  { date:"18 Aug", id:"TRP-0038", route:"Airport → Hotel", km:61, revenue:18000, driver:"Uche Obi" },
  { date:"15 Aug", id:"TRP-0035", route:"Hotel → State House", km:22, revenue:45000, driver:"Uche Obi" },
];

const TABS = ["Documents","Service","Fuel","Trips","Costs","Telematics"];
export function VehicleDetail({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [tab, setTab] = useState("Documents");
  const vehicle = VEHICLES.find(v => v.id === _vehicleId) ?? VEHICLES[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-2xl font-bold mb-0.5" style={{ color:PRIMARY, fontFamily:mono }}>{vehicle.plate}</div>
          <div className="text-sm" style={{ color:MUTED }}>{vehicle.make} {vehicle.model} · {vehicle.year} · {vehicle.fuelType} · {vehicle.type}</div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <div className="text-xs" style={{ color:MUTED }}>Odometer</div>
            <div className="text-xl font-bold" style={{ color:TEXT, fontFamily:mono }}>{vehicle.odometer.toLocaleString()} km</div>
          </div>
          <VStatusPill status={vehicle.status} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor:BORDER }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors" style={{ borderColor:tab===t?PRIMARY:"transparent", color:tab===t?PRIMARY:MUTED }}>
            {t}
          </button>
        ))}
      </div>

      {/* Documents tab */}
      {tab === "Documents" && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
          <table className="w-full">
            <thead><TH cols={["Document Type","Reference","Issuer","Issued","Expires","Status","Days Left","Attachment","Action"]} /></thead>
            <tbody>
              {vehicle.docs.map((d,i) => (
                <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color:TEXT }}>{d.type}</td>
                  <td className="px-3 py-3 text-xs" style={{ color:MUTED, fontFamily:mono }}>{d.ref}</td>
                  <td className="px-3 py-3 text-xs" style={{ color:MUTED }}>{d.issuer}</td>
                  <td className="px-3 py-3 text-xs" style={{ color:MUTED }}>{d.issued}</td>
                  <td className="px-3 py-3 text-xs font-medium" style={{ color:d.status==="expired"?ERROR:d.status==="expiring-soon"?WARNING:TEXT }}>{d.expires}</td>
                  <td className="px-3 py-3"><DocPill status={d.status} /></td>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color:d.daysLeft<0?ERROR:d.daysLeft<=30?WARNING:SUCCESS, fontFamily:mono }}>
                    {d.daysLeft===9999?"Permanent":d.daysLeft<0?`${Math.abs(d.daysLeft)}d overdue`:`${d.daysLeft}d`}
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color:d.hasAttachment?TEAL:SUBTLE }}>{d.hasAttachment?"Attached":"—"}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => add({type:"info",title:`Renew ${d.type}`})} className="px-2 py-1 rounded-lg text-xs border hover:bg-slate-50" style={{ borderColor:BORDER, color:MUTED }}>Renew</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service tab */}
      {tab === "Service" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["Current Odometer",`${vehicle.odometer.toLocaleString()} km`],["Next Service at",`${vehicle.nextServiceKm.toLocaleString()} km`],["Remaining",`${(vehicle.nextServiceKm-vehicle.odometer).toLocaleString()} km`]].map(([k,v])=>(
              <div key={k} className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
                <div className="text-xs" style={{ color:MUTED }}>{k}</div>
                <div className="text-xl font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER }}>
            <div className="px-4 py-3 border-b text-sm font-semibold" style={{ borderColor:BORDER, color:TEXT }}>Service History</div>
            <table className="w-full">
              <thead><TH cols={["Date","Odometer","Type","Parts / Work","Cost","Garage"]} /></thead>
              <tbody>
                {SVC_HISTORY.map((s,i)=>(
                  <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                    <td className="px-3 py-2.5 text-xs font-medium" style={{ color:TEXT }}>{s.date}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{s.km.toLocaleString()} km</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:TEXT }}>{s.type}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{s.parts}</td>
                    <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>₦{s.cost.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{s.garage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fuel tab */}
      {tab === "Fuel" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["Avg Consumption","8.4 L/100km"],["Total Fuel (Aug)","135 L"],["Fuel Cost (Aug)","₦151,875"]].map(([k,v])=>(
              <div key={k} className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
                <div className="text-xs" style={{ color:MUTED }}>{k}</div>
                <div className="text-xl font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Consumption Trend (L/100km) — Baseline: 8.5</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={FUEL_CHART_DATA} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                <XAxis dataKey="date" tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} domain={[6,12]} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={(v:number)=>[`${v} L/100km`]} />
                <ReferenceLine y={8.5} stroke={WARNING} strokeDasharray="4 4" label={{ value:"Baseline", fill:WARNING, fontSize:10 }} />
                <Line type="monotone" dataKey="consumption" stroke={TEAL} strokeWidth={2} dot={{ r:4, fill:TEAL }} name="L/100km" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER }}>
            <table className="w-full">
              <thead><TH cols={["Date","Litres","Odometer","Interval km","L/100km","Cost","Station","Driver"]} /></thead>
              <tbody>
                {FUEL_ENTRIES.map((e,i)=>{
                  const intKm = e.odom - e.prev;
                  const lper100 = +((e.litres/intKm)*100).toFixed(1);
                  const anomaly = lper100 > 11;
                  return (
                    <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER, backgroundColor:anomaly?"#FFFBEB":"white" }}>
                      <td className="px-3 py-2.5 text-xs font-medium" style={{ color:TEXT }}>{e.date}</td>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{e.litres}L</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{e.odom.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{intKm}</td>
                      <td className="px-3 py-2.5 text-xs font-bold" style={{ color:anomaly?ERROR:TEXT, fontFamily:mono }}>
                        {lper100}{anomaly && <span className="ml-1 text-xs" style={{ color:ERROR }}>⚠</span>}
                      </td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:TEXT, fontFamily:mono }}>₦{e.cost.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.station}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.driver}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips tab */}
      {tab === "Trips" && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER }}>
          <table className="w-full">
            <thead><TH cols={["Date","Trip","Route","Distance","Revenue","Driver"]} /></thead>
            <tbody>
              {TRIP_HISTORY.map((t,i)=>(
                <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{t.date}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{t.id}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:TEXT }}>{t.route}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{t.km} km</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:SUCCESS, fontFamily:mono }}>₦{t.revenue.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{t.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Costs tab */}
      {tab === "Costs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Cost of Ownership</div>
            {[["Acquisition Cost","₦14,800,000"],["Depreciation (4yr)","₦3,700,000/yr"],["Book Value (Est.)","₦9,400,000"],["Fuel (Aug)","₦151,875"],["Maintenance YTD","₦360,000"],["Total Cost This Year","₦511,875"]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-2 border-b last:border-b-0 text-xs" style={{ borderColor:BORDER }}>
                <span style={{ color:MUTED }}>{k}</span>
                <span className="font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER }}>
            <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Efficiency Metrics</div>
            {[["Total km (YTD)","47,963 km"],["Revenue Generated","₦1,286,000"],["Revenue per km","₦26.8"],["Cost per km","₦10.7"],["Net Margin per km","₦16.1"],["Utilisation","78%"]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-2 border-b last:border-b-0 text-xs" style={{ borderColor:BORDER }}>
                <span style={{ color:MUTED }}>{k}</span>
                <span className="font-bold" style={{ color:TEXT, fontFamily:mono }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Telematics tab */}
      {tab === "Telematics" && (
        <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor:BORDER }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor:"#F1F5F9" }}>
            <MapPin size={22} style={{ color:SUBTLE }} />
          </div>
          <div className="text-sm font-semibold mb-1" style={{ color:TEXT }}>Telematics Not Configured</div>
          <div className="text-xs mb-4" style={{ color:MUTED }}>Bind a GPS device to this vehicle to enable live position, trip recording, speed monitoring, and geofence alerts.</div>
          <button onClick={() => add({type:"info",title:"GPS device binding coming soon"})} className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor:"#EFF6FF", color:PRIMARY }}>Configure GPS Device</button>
        </div>
      )}
    </div>
  );
}

// ─── 3. FuelLog ───────────────────────────────────────────────────────────────

interface FuelEntry {
  id: string; date: string; vehicle: string; driver: string;
  type: "fill" | "drain" | "transfer" | "adjustment";
  litres: number; unitPrice: number; total: number;
  odomBefore: number; odomAfter: number;
  consumption?: number; station: string; paymentMethod: string;
  receiptRef: string; recordedBy: string;
  anomaly?: string;
}

const FUEL_LOG: FuelEntry[] = [
  { id:"FL-0081", date:"20 Aug 09:14", vehicle:"ABJ 123 XA", driver:"Uche Obi",     type:"fill",  litres:45, unitPrice:1125, total:50625, odomBefore:47500, odomAfter:47500, station:"MRS Wuse II",    paymentMethod:"Corporate Card", receiptRef:"MRS-20250820-041", recordedBy:"Uche Obi"    },
  { id:"FL-0080", date:"19 Aug 07:30", vehicle:"ABJ 456 YB", driver:"Emeka Eze",     type:"fill",  litres:80, unitPrice:1125, total:90000, odomBefore:97900, odomAfter:97900, station:"Ardova Garki",   paymentMethod:"Cash",           receiptRef:"AGA-20250819-098", recordedBy:"Emeka Eze",   anomaly:"Consumption 18.2 L/100km — exceeds threshold (12.0)" },
  { id:"FL-0079", date:"18 Aug 14:22", vehicle:"ABJ 789 ZC", driver:"Musa Danladi",  type:"fill",  litres:60, unitPrice:1125, total:67500, odomBefore:31200, odomAfter:31200, station:"MRS Wuse II",    paymentMethod:"Corporate Card", receiptRef:"MRS-20250818-077", recordedBy:"Musa Danladi" },
  { id:"FL-0078", date:"17 Aug 11:05", vehicle:"ABJ 123 XA", driver:"Uche Obi",     type:"fill",  litres:48, unitPrice:1125, total:54000, odomBefore:47202, odomAfter:47202, station:"Conoil Maitama", paymentMethod:"Corporate Card", receiptRef:"CNL-20250817-031", recordedBy:"Uche Obi"    },
  { id:"FL-0077", date:"15 Aug 08:00", vehicle:"ABJ 456 YB", driver:"Emeka Eze",     type:"drain", litres:20, unitPrice:1125, total:0,     odomBefore:97400, odomAfter:97400, station:"Hotel Store",    paymentMethod:"Internal",       receiptRef:"INT-20250815-003", recordedBy:"Isaac Sule"   },
];

// ─ New entry form state type
interface NewFuelEntry { vehicle: string; driver: string; type: string; litres: string; unitPrice: string; odomAfter: string; station: string; paymentMethod: string; receiptRef: string; }

const EMPTY_FORM: NewFuelEntry = { vehicle:"", driver:"", type:"fill", litres:"", unitPrice:"1125", odomAfter:"", station:"", paymentMethod:"Corporate Card", receiptRef:"" };

// Variance data (by driver)
const DRIVER_VARIANCE = [
  { driver:"Uche Obi",     avgConsumption:8.4, baseline:8.5, variance:-0.1, entries:12, status:"ok"   },
  { driver:"Emeka Eze",    avgConsumption:14.2, baseline:12.0, variance:2.2, entries:9,  status:"high" },
  { driver:"Musa Danladi", avgConsumption:11.8, baseline:12.0, variance:-0.2, entries:7,  status:"ok"  },
];

export function FuelLog({ add }: { add: (t: Omit<Toast,"id">) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewFuelEntry>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<NewFuelEntry>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Partial<NewFuelEntry> = {};
    if (!form.vehicle)  e.vehicle  = "Vehicle is required";
    if (!form.driver)   e.driver   = "Driver is required";
    if (!form.litres || isNaN(+form.litres) || +form.litres <= 0) e.litres = "Enter a valid litres amount";
    if (!form.odomAfter || isNaN(+form.odomAfter)) e.odomAfter = "Odometer reading is mandatory";
    // Odometer sanity check
    const v = VEHICLES.find(v => v.plate === form.vehicle);
    if (v && form.odomAfter && +form.odomAfter < v.odometer) e.odomAfter = `Odometer cannot be less than current reading (${v.odometer.toLocaleString()} km)`;
    // Tank capacity check
    const maxL = form.vehicle === "ABJ 456 YB" ? 100 : form.vehicle === "ABJ 789 ZC" ? 90 : form.vehicle === "ABJ 321 WD" ? 150 : 65;
    if (form.litres && +form.litres > maxL) e.litres = `Exceeds tank capacity (${maxL}L)`;
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); setShowForm(false); setForm(EMPTY_FORM); add({ type:"success", title:"Fuel entry recorded" }); }, 1000);
  };

  return (
    <div>
      <PageHeader title="Fuel Log" sub="All fuel entries — consumption, validation, anomaly flags, and variance by vehicle and driver"
        actions={
          <div className="flex gap-2">
            <ExportBtn add={add} label="Fuel Log" />
            <BtnP label="Record Fuel" icon={Plus} onClick={() => setShowForm(!showForm)} />
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Entries (Aug)"   value="22"         sub="All vehicles"    icon={Fuel}          accent={PRIMARY} />
        <StatCard label="Total Litres"    value="1,248 L"    sub="Aug to date"     icon={Activity}      accent={TEAL}    />
        <StatCard label="Total Cost"      value="₦1.40M"     sub="Aug to date"     icon={TrendingUp}    accent={ORANGE}  />
        <StatCard label="Anomalies"       value="2"          sub="Exceed threshold" icon={AlertTriangle} accent={ERROR}   />
      </div>

      {/* New entry form */}
      {showForm && (
        <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:PRIMARY, boxShadow:`0 0 0 2px ${PRIMARY}20` }}>
          <div className="text-sm font-bold mb-4" style={{ color:TEXT }}>Record Fuel Entry</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Vehicle *</div>
              <select value={form.vehicle} onChange={e=>setForm(f=>({...f,vehicle:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:errors.vehicle?ERROR:BORDER }}>
                <option value="">Select vehicle…</option>
                {VEHICLES.map(v=><option key={v.id}>{v.plate}</option>)}
              </select>
              {errors.vehicle && <div className="text-xs mt-0.5" style={{ color:ERROR }}>{errors.vehicle}</div>}
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Driver *</div>
              <select value={form.driver} onChange={e=>setForm(f=>({...f,driver:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:errors.driver?ERROR:BORDER }}>
                <option value="">Select driver…</option>
                <option>Uche Obi</option><option>Emeka Eze</option><option>Musa Danladi</option><option>Blessing Okafor</option>
              </select>
              {errors.driver && <div className="text-xs mt-0.5" style={{ color:ERROR }}>{errors.driver}</div>}
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Entry Type</div>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                <option value="fill">Fill</option><option value="drain">Drain</option><option value="transfer">Transfer</option><option value="adjustment">Adjustment</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Litres *</div>
              <input type="number" placeholder="e.g. 45" value={form.litres} onChange={e=>setForm(f=>({...f,litres:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:errors.litres?ERROR:BORDER }} />
              {errors.litres && <div className="text-xs mt-0.5" style={{ color:ERROR }}>{errors.litres}</div>}
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Unit Price (₦/L)</div>
              <input type="number" value={form.unitPrice} onChange={e=>setForm(f=>({...f,unitPrice:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Total: <strong style={{ fontFamily:mono }}>₦{form.litres&&form.unitPrice?(+form.litres*+form.unitPrice).toLocaleString():"—"}</strong></div>
              <div className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor:"#F9FAFB", color:MUTED }}>Auto-computed</div>
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Odometer at Fill * <span className="font-normal" style={{ color:ERROR }}>(mandatory)</span></div>
              <input type="number" placeholder={form.vehicle ? `Current: ${VEHICLES.find(v=>v.plate===form.vehicle)?.odometer.toLocaleString() ?? "—"} km` : "Select vehicle first"} value={form.odomAfter} onChange={e=>setForm(f=>({...f,odomAfter:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:errors.odomAfter?ERROR:BORDER }} />
              {errors.odomAfter && <div className="text-xs mt-0.5" style={{ color:ERROR }}>{errors.odomAfter}</div>}
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Station</div>
              <input placeholder="e.g. MRS Wuse II" value={form.station} onChange={e=>setForm(f=>({...f,station:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Payment Method</div>
              <select value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                <option>Corporate Card</option><option>Cash</option><option>Bank Transfer</option><option>Internal</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Receipt Reference</div>
              <input placeholder="e.g. MRS-20250820-041" value={form.receiptRef} onChange={e=>setForm(f=>({...f,receiptRef:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>{saving?"Saving…":"Save Entry"}</button>
            <button onClick={()=>{setShowForm(false);setErrors({});setForm(EMPTY_FORM);}} className="px-4 py-2 rounded-xl text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Bulk tank panel */}
      <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fuel size={15} style={{ color:ORANGE }} />
            <div className="text-sm font-bold" style={{ color:TEXT }}>Hotel Bulk Diesel Tank</div>
          </div>
          <button onClick={() => add({ type:"info", title:"Bulk tank refill logged" })} className="px-3 py-1.5 rounded-xl text-xs font-semibold border" style={{ borderColor:BORDER, color:MUTED }}>Log Refill</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          {[
            { label:"Tank Capacity", value:"5,000 L", sub:"Main diesel store" },
            { label:"Current Level", value:"2,100 L", sub:"42% — 14.2 days left", warn:false },
            { label:"Avg Daily Burn", value:"148 L/day", sub:"All generators combined" },
            { label:"Last Refill", value:"15 Aug", sub:"3,000 L · Emadeb Energy" },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor:"#FFFBEB", border:`1px solid #FDE68A` }}>
              <div className="text-xs" style={{ color:"#92400E" }}>{item.label}</div>
              <div className="text-base font-bold mt-0.5" style={{ color:"#713F12", fontFamily:mono }}>{item.value}</div>
              <div className="text-xs" style={{ color:"#A16207" }}>{item.sub}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color:MUTED }}>
            <span>Tank level</span>
            <span className="font-bold" style={{ color:ORANGE }}>2,100 L / 5,000 L (42%)</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
            <div className="h-full rounded-full transition-all" style={{ width:"42%", backgroundColor: ORANGE }} />
          </div>
          <div className="text-xs mt-1" style={{ color:MUTED }}>Alert threshold: 20% (1,000 L) · Next recommended refill: <strong style={{ color:TEXT }}>Sep 02</strong></div>
        </div>
      </div>

      {/* Per-vehicle consumption chart */}
      <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Fuel Consumption by Vehicle — August (L/100km)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={[
            { vehicle:"ABJ 123 XA", consumption:8.4, baseline:8.5 },
            { vehicle:"ABJ 456 YB", consumption:14.2, baseline:12.0 },
            { vehicle:"ABJ 789 ZC", consumption:11.8, baseline:12.0 },
          ]} margin={{ left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
            <XAxis dataKey="vehicle" tick={{ fontSize:10, fill:MUTED }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} domain={[0,18]} />
            <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={(v:number)=>[`${v} L/100km`]} />
            <ReferenceLine y={12} stroke={WARNING} strokeDasharray="4 4" label={{ value:"Threshold 12.0", fill:WARNING, fontSize:10 }} />
            <Bar dataKey="consumption" name="L/100km" radius={[4,4,0,0]} barSize={36}
              fill={TEAL}
              label={{ position:"top", fontSize:10, fill:TEXT, fontWeight:700, formatter:(v:number) => v > 12 ? `${v}⚠` : `${v}` }}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-xs mt-1" style={{ color:MUTED }}>ABJ 456 YB (HiAce) exceeds fleet threshold — driving pattern review recommended.</div>
      </div>

      {/* Variance panel by driver */}
      <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Consumption Variance by Driver — August</div>
        <div className="grid grid-cols-3 gap-4">
          {DRIVER_VARIANCE.map(d => (
            <div key={d.driver} className="p-3 rounded-xl" style={{ backgroundColor:d.status==="high"?"#FEF3C7":"#F0FDF4", border:`1px solid ${d.status==="high"?"#FDE68A":"#BBFCCB"}` }}>
              <div className="text-xs font-bold mb-1" style={{ color:TEXT }}>{d.driver}</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-xl font-bold" style={{ color:d.status==="high"?ERROR:SUCCESS, fontFamily:mono }}>{d.avgConsumption}</span>
                <span className="text-xs mb-0.5" style={{ color:MUTED }}>L/100km</span>
              </div>
              <div className="text-xs" style={{ color:MUTED }}>Baseline: {d.baseline} · Variance: <strong style={{ color:d.variance>0?ERROR:SUCCESS }}>{d.variance>0?"+":""}{d.variance}</strong></div>
              <div className="text-xs mt-0.5" style={{ color:MUTED }}>{d.entries} entries this month</div>
              {d.status==="high" && <div className="text-xs mt-1.5 font-semibold" style={{ color:ERROR }}>⚠ Above threshold — review driving pattern</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main log table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead><TH cols={["Entry","Date / Time","Vehicle","Driver","Type","Litres","₦/L","Total","Odometer","Consumption","Station","Payment","Receipt","Recorded By","Anomaly"]} /></thead>
          <tbody>
            {FUEL_LOG.map(e => {
              const intKm = e.odomAfter - e.odomBefore;
              const lper100 = intKm > 0 ? +((e.litres/intKm)*100).toFixed(1) : null;
              return (
                <tr key={e.id} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER, backgroundColor:e.anomaly?"#FFFBEB":"white" }}>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{e.id}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.date}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:TEXT, fontFamily:mono }}>{e.vehicle}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.driver}</td>
                  <td className="px-3 py-2.5 text-xs capitalize" style={{ color:MUTED }}>{e.type}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{e.litres}L</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>₦{e.unitPrice}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>₦{e.total.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{e.odomAfter.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:lper100&&lper100>12?ERROR:TEXT, fontFamily:mono }}>{lper100 ? `${lper100}` : "—"}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.station}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.paymentMethod}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{e.receiptRef}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.recordedBy}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:ERROR }}>{e.anomaly ? <span title={e.anomaly}>⚠</span> : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 4. GeneratorDieselLog ────────────────────────────────────────────────────

interface DieselEntry {
  id: string; date: string; generator: string; litres: number;
  unitPrice: number; total: number; runtimeHoursAtFill: number;
  lph?: number; anomaly?: string; supplier: string; recordedBy: string;
}

const DIESEL_LOG: DieselEntry[] = [
  { id:"DL-0041", date:"20 Aug 06:00", generator:"Main Generator",  litres:200, unitPrice:1180, total:236000, runtimeHoursAtFill:14280, lph:3.8, supplier:"Emadeb Energy",    recordedBy:"Isaac Sule"    },
  { id:"DL-0040", date:"17 Aug 18:00", generator:"Block B Backup",  litres:80,  unitPrice:1180, total:94400,  runtimeHoursAtFill:8940,  lph:4.2, supplier:"Ardova Direct",    recordedBy:"Isaac Sule",   anomaly:"Consumption 4.2 L/hr exceeds baseline (3.5) — check load or fuel tap" },
  { id:"DL-0039", date:"15 Aug 09:30", generator:"Pool Area Small", litres:35,  unitPrice:1180, total:41300,  runtimeHoursAtFill:2310,  lph:1.8, supplier:"Emadeb Energy",    recordedBy:"Chinedu Eze"   },
  { id:"DL-0038", date:"13 Aug 06:00", generator:"Main Generator",  litres:180, unitPrice:1180, total:212400, runtimeHoursAtFill:14220, lph:3.6, supplier:"Emadeb Energy",    recordedBy:"Isaac Sule"    },
  { id:"DL-0037", date:"10 Aug 18:00", generator:"Block B Backup",  litres:75,  unitPrice:1180, total:88500,  runtimeHoursAtFill:8890,  lph:3.5, supplier:"Ardova Direct",    recordedBy:"Isaac Sule"    },
];

const GEN_TREND = [
  { week:"W31", cost:428700, hrs:112, lph:3.8 },
  { week:"W32", cost:518800, hrs:136, lph:3.9 },
  { week:"W33", cost:566500, hrs:148, lph:3.8 },
  { week:"W34", cost:436300, hrs:114, lph:3.8 },
  { week:"W35", cost:672400, hrs:176, lph:3.9 },
];

// ─── Diesel requisition types ─────────────────────────────────────────────────
interface DieselRequisition {
  id: string; date: string; generator: string;
  estimatedLitres: number; urgency: "normal" | "urgent" | "critical";
  reason: string; requestedBy: string;
  status: "pending" | "approved" | "ordered" | "delivered" | "rejected";
  procNote?: string; approvedBy?: string;
}
interface NewReqForm { generator: string; estimatedLitres: string; urgency: string; reason: string; }
const EMPTY_REQ: NewReqForm = { generator:"", estimatedLitres:"", urgency:"normal", reason:"" };

const DIESEL_REQUISITIONS: DieselRequisition[] = [
  { id:"REQ-003", date:"20 Aug 16:45", generator:"Main Generator",  estimatedLitres:200, urgency:"urgent",  reason:"Tank approaching 3-day reserve threshold — approx. 30% remaining",  requestedBy:"Isaac Sule",  status:"pending"   },
  { id:"REQ-002", date:"17 Aug 09:00", generator:"Block B Backup",  estimatedLitres:80,  urgency:"normal",  reason:"Monthly scheduled top-up — runtime consistent, no anomaly",          requestedBy:"Isaac Sule",  status:"delivered", approvedBy:"Tunde Adeyemi", procNote:"Delivered 80L · ₦1,180/L · Ardova Direct · DL-0040" },
  { id:"REQ-001", date:"12 Aug 11:30", generator:"Main Generator",  estimatedLitres:180, urgency:"normal",  reason:"Fortnightly scheduled refill per PM calendar",                       requestedBy:"Chinedu Eze", status:"delivered", approvedBy:"Tunde Adeyemi", procNote:"Delivered 180L · ₦1,180/L · Emadeb Energy · DL-0038" },
];

export function GeneratorDieselLog({ add, role }: { add: (t: Omit<Toast,"id">) => void; role?: Role }) {
  const isMX = role === "MX";
  const [activeGen, setActiveGen] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqForm, setReqForm] = useState<NewReqForm>(EMPTY_REQ);
  const [requisitions, setRequisitions] = useState<DieselRequisition[]>(DIESEL_REQUISITIONS);

  const dieselCostDay  = 112420;
  const approxKwhCost  = 1.42;
  const costPerOccRoom = 1406;
  const genHrsVsGrid   = 68;

  const pending = requisitions.filter(r => r.status === "pending");

  const approveReq = (id: string) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status:"approved" as const, approvedBy:"Procurement" } : r));
    add({ type:"success", title:"Requisition approved — ordering from supplier", body:id });
  };
  const rejectReq = (id: string) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status:"rejected" as const } : r));
    add({ type:"warning", title:"Requisition rejected", body:id });
  };
  const submitReq = () => {
    if (!reqForm.generator || !reqForm.estimatedLitres || !reqForm.reason) {
      add({ type:"error", title:"Fill in all required fields" }); return;
    }
    const newReq: DieselRequisition = {
      id: `REQ-${String(requisitions.length + 4).padStart(3,"0")}`,
      date: new Date().toLocaleDateString("en-GB",{ day:"2-digit", month:"short" }) + " " + new Date().toLocaleTimeString("en-GB",{ hour:"2-digit", minute:"2-digit" }),
      generator: reqForm.generator, estimatedLitres: +reqForm.estimatedLitres,
      urgency: reqForm.urgency as "normal"|"urgent"|"critical",
      reason: reqForm.reason, requestedBy:"Isaac Sule", status:"pending",
    };
    setRequisitions(prev => [newReq, ...prev]);
    add({ type:"success", title:"Requisition submitted to Procurement", body:`${newReq.id} · ${newReq.generator} · ${newReq.estimatedLitres}L` });
    setShowReqForm(false); setReqForm(EMPTY_REQ);
  };

  const urgSc = (u: string) => u==="critical"?{bg:"#FEE2E2",text:"#991B1B"}:u==="urgent"?{bg:"#FEF3C7",text:"#92400E"}:{bg:"#F1F5F9",text:"#475569"};
  const reqStSc = (s: string) => s==="pending"?{bg:"#DBEAFE",text:"#1E40AF"}:s==="approved"||s==="ordered"?{bg:"#FEF9C3",text:"#713F12"}:s==="delivered"?{bg:"#DCFCE7",text:"#166534"}:{bg:"#FEE2E2",text:"#991B1B"};

  const GenCards = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
      {GENERATORS.map(g => {
        const svcDue = g.nextServiceHrs - g.runtimeHours;
        return (
          <div key={g.id} className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-bold" style={{ color:TEXT }}>{g.name}</div>
                <div className="text-xs" style={{ color:MUTED }}>{g.location} · {g.kva} kVA</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:g.status==="running"?"#DCFCE7":g.status==="standby"?"#EFF6FF":"#FEF3C7", color:g.status==="running"?"#166534":g.status==="standby"?PRIMARY:"#92400E" }}>{g.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><div className="text-xs" style={{ color:MUTED }}>Runtime Hrs</div><div className="text-lg font-bold" style={{ color:TEXT, fontFamily:mono }}>{g.runtimeHours.toLocaleString()}</div></div>
              <div><div className="text-xs" style={{ color:MUTED }}>Tank Cap.</div><div className="text-lg font-bold" style={{ color:TEXT, fontFamily:mono }}>{g.tankCapacityL}L</div></div>
            </div>
            <div className="text-xs" style={{ color:svcDue<=100?WARNING:MUTED }}>Service in {svcDue > 0 ? `${svcDue} hrs` : "OVERDUE"}</div>
          </div>
        );
      })}
    </div>
  );

  const ServiceTracker = () => (
    <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Wrench size={15} style={{ color:PRIMARY }} />
        <div className="text-sm font-bold" style={{ color:TEXT }}>Generator Service Tracker</div>
      </div>
      <div className="space-y-3">
        {GENERATORS.map(g => {
          const svcDue = g.nextServiceHrs - g.runtimeHours;
          const pct = Math.max(0, Math.min(100, (g.runtimeHours / g.nextServiceHrs) * 100));
          const isOverdue = svcDue <= 0;
          const isCritical = svcDue > 0 && svcDue <= 100;
          const barColor = isOverdue ? ERROR : isCritical ? WARNING : SUCCESS;
          return (
            <div key={g.id} className="p-3 rounded-xl border" style={{ borderColor:isOverdue?ERROR:isCritical?WARNING:BORDER, backgroundColor:isOverdue?"#FEF2F2":isCritical?"#FFFBEB":"#F0FDF4" }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-bold" style={{ color:TEXT }}>{g.name}</div>
                  <div className="text-xs" style={{ color:MUTED }}>{g.location} · {g.kva} kVA · Runtime: <span className="font-bold" style={{ fontFamily:mono, color:TEXT }}>{g.runtimeHours.toLocaleString()} hrs</span></div>
                </div>
                <div className="text-right">
                  {isOverdue ? <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor:ERROR, color:"white" }}>OVERDUE</span>
                    : isCritical ? <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor:WARNING, color:"white" }}>{svcDue} hrs left</span>
                    : <span className="text-xs font-semibold" style={{ color:SUCCESS }}>{svcDue} hrs to service</span>}
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor:"rgba(0,0,0,0.08)" }}>
                <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, backgroundColor:barColor }} />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color:MUTED }}>
                <span>Last service: 0 hrs</span><span>Next: {g.nextServiceHrs.toLocaleString()} hrs</span>
              </div>
              {(isOverdue || isCritical) && (
                <button onClick={() => add({ type:"info", title:`Service request raised — ${g.name}` })} className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor:isOverdue?ERROR:WARNING, color:"white" }}>
                  Raise Service Request
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── Maintenance (MX) view ─────────────────────────────────────────────────
  if (isMX) return (
    <div>
      <PageHeader title="Generator Diesel" sub="Monitor generator runtime, raise diesel requisitions to Procurement for ordering and delivery"
        actions={<BtnP label="Raise Requisition" icon={Plus} onClick={() => setShowReqForm(!showReqForm)} />}
      />

      {showReqForm && (
        <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:PRIMARY, boxShadow:`0 0 0 2px ${PRIMARY}20` }}>
          <div className="text-sm font-bold mb-1" style={{ color:TEXT }}>Raise Diesel Requisition</div>
          <div className="text-xs mb-3 p-3 rounded-xl" style={{ backgroundColor:"#EFF6FF", color:"#1E40AF" }}>
            Your requisition is sent to Procurement for approval and supplier ordering. Urgent requests are processed within 4 hours; Critical within 1 hour.
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Generator *</div>
              <select value={reqForm.generator} onChange={e=>setReqForm(f=>({...f,generator:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                <option value="">Select generator…</option>
                {GENERATORS.map(g=><option key={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Estimated Litres Needed *</div>
              <input type="number" placeholder="e.g. 200" value={reqForm.estimatedLitres} onChange={e=>setReqForm(f=>({...f,estimatedLitres:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Urgency</div>
              <select value={reqForm.urgency} onChange={e=>setReqForm(f=>({...f,urgency:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>
                <option value="normal">Normal — next scheduled delivery</option>
                <option value="urgent">Urgent — within 4 hours</option>
                <option value="critical">Critical — immediate dispatch</option>
              </select>
            </div>
            <div className="col-span-2 lg:col-span-3">
              <div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Observations &amp; Reason *</div>
              <textarea rows={2} placeholder="Describe current fuel level condition, runtime hours since last fill, and reason for request…" value={reqForm.reason} onChange={e=>setReqForm(f=>({...f,reason:e.target.value}))} className="w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none" style={{ borderColor:BORDER }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={submitReq} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Submit to Procurement</button>
            <button onClick={()=>{setShowReqForm(false);setReqForm(EMPTY_REQ);}} className="px-4 py-2 rounded-xl text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
          </div>
        </div>
      )}

      <GenCards />
      <ServiceTracker />

      {/* My Requisitions */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
          <div className="text-sm font-semibold" style={{ color:TEXT }}>My Diesel Requisitions</div>
          {pending.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor:"#DBEAFE", color:"#1E40AF" }}>{pending.length} pending</span>}
        </div>
        <table className="w-full">
          <thead><TH cols={["REQ ID","Date","Generator","Est. Litres","Urgency","Status","Procurement Note"]} /></thead>
          <tbody>
            {requisitions.map(r => {
              const us = urgSc(r.urgency);
              const ss = reqStSc(r.status);
              return (
                <tr key={r.id} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{r.id}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.date}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:TEXT }}>{r.generator}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{r.estimatedLitres}L</td>
                  <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:us.bg, color:us.text }}>{r.urgency}</span></td>
                  <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:ss.bg, color:ss.text }}>{r.status}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.procNote ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Procurement / full management view ────────────────────────────────────
  return (
    <div>
      <PageHeader title="Generator & Diesel Log" sub="Diesel procurement, delivery records, generator cost analysis and consumption monitoring"
        actions={
          <div className="flex gap-2">
            <ExportBtn add={add} label="Generator Diesel Log" />
            <BtnP label="Record Delivery" icon={Plus} onClick={() => setShowForm(!showForm)} />
          </div>
        }
      />

      {/* Pending requisitions from Maintenance */}
      {pending.length > 0 && (
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor:"#FEF3C7", border:"1px solid #FDE68A" }}>
          <div className="text-xs font-bold mb-3" style={{ color:"#92400E" }}>
            Pending Diesel Requisitions from Maintenance — {pending.length} awaiting action
          </div>
          <div className="space-y-2">
            {pending.map(r => {
              const us = urgSc(r.urgency);
              return (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-white border" style={{ borderColor:"#FDE68A" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{r.id}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold capitalize" style={{ backgroundColor:us.bg, color:us.text }}>{r.urgency}</span>
                      <span className="text-xs" style={{ color:MUTED }}>{r.date}</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ color:TEXT }}>{r.generator} — {r.estimatedLitres}L estimated · Raised by {r.requestedBy}</div>
                    <div className="text-xs mt-0.5" style={{ color:MUTED }}>{r.reason}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approveReq(r.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor:SUCCESS }}>Approve & Order</button>
                    <button onClick={() => rejectReq(r.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor:"#FEE2E2", color:"#991B1B" }}>Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <GenCards />

      {/* The differentiator — Cost Analysis */}
      <div className="bg-white rounded-xl border p-4 mb-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} style={{ color:WARNING }} />
          <div className="text-sm font-bold" style={{ color:TEXT }}>Generator Cost Analysis — This Week</div>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:"#FEF3C7", color:"#92400E" }}>Live figures</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor:"#FEF9C3" }}>
            <div className="text-xs font-semibold mb-1" style={{ color:"#713F12" }}>Diesel Cost / Day</div>
            <div className="text-2xl font-bold" style={{ color:"#713F12", fontFamily:mono }}>₦{dieselCostDay.toLocaleString()}</div>
            <div className="text-xs" style={{ color:"#A16207" }}>All generators combined</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor:"#FEF3C7" }}>
            <div className="text-xs font-semibold mb-1" style={{ color:"#92400E" }}>Cost / kWh-equivalent</div>
            <div className="text-2xl font-bold" style={{ color:"#92400E", fontFamily:mono }}>₦{approxKwhCost.toFixed(2)}</div>
            <div className="text-xs" style={{ color:"#A16207" }}>vs AEDC grid tariff ₦68</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor:"#FFF7ED" }}>
            <div className="text-xs font-semibold mb-1" style={{ color:"#9A3412" }}>Diesel Cost / Occupied Room / Day</div>
            <div className="text-2xl font-bold" style={{ color:"#9A3412", fontFamily:mono }}>₦{costPerOccRoom.toLocaleString()}</div>
            <div className="text-xs" style={{ color:"#C2410C" }}>80 rooms occupied (avg)</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor:"#F0F9FF" }}>
            <div className="text-xs font-semibold mb-1" style={{ color:"#0369A1" }}>Generator vs Grid Hours</div>
            <div className="text-2xl font-bold" style={{ color:"#0369A1", fontFamily:mono }}>{genHrsVsGrid}%</div>
            <div className="text-xs" style={{ color:"#0369A1" }}>On generator this week</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color:MUTED }}>Weekly Diesel Cost & Runtime Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={GEN_TREND} margin={{ left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="week" tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} tickFormatter={v=>`₦${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} formatter={(v:number)=>[`₦${v.toLocaleString()}`]} />
              <Bar dataKey="cost" name="Diesel Cost" fill={WARNING} radius={[3,3,0,0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New diesel entry form */}
      {showForm && (
        <div className="bg-white rounded-xl border mb-4 p-4" style={{ borderColor:PRIMARY, boxShadow:`0 0 0 2px ${PRIMARY}20` }}>
          <div className="text-sm font-bold mb-3" style={{ color:TEXT }}>Record Diesel Delivery</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Generator</div>
              <select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}>{GENERATORS.map(g=><option key={g.id}>{g.name}</option>)}</select></div>
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Date & Time</div><input type="datetime-local" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Litres</div><input type="number" placeholder="e.g. 200" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Unit Price (₦/L)</div><input type="number" defaultValue="1180" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Runtime Hours at Fill *</div><input type="number" placeholder="e.g. 14280" className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }} /></div>
            <div><div className="text-xs font-medium mb-1" style={{ color:MUTED }}>Supplier</div><select className="w-full px-3 py-2 border rounded-xl text-xs outline-none" style={{ borderColor:BORDER }}><option>Emadeb Energy</option><option>Ardova Direct</option><option>NNPCL</option><option>Other</option></select></div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>{setShowForm(false);add({type:"success",title:"Diesel entry recorded"});}} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor:PRIMARY }}>Save Entry</button>
            <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-xl text-xs" style={{ backgroundColor:"#F1F5F9", color:MUTED }}>Cancel</button>
          </div>
        </div>
      )}

      <ServiceTracker />

      {/* Requisitions history — all statuses */}
      <div className="bg-white rounded-xl border overflow-hidden mb-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
          <div className="text-sm font-semibold" style={{ color:TEXT }}>Diesel Requisition History</div>
          {pending.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor:"#FEF3C7", color:"#92400E" }}>{pending.length} pending action</span>}
        </div>
        <table className="w-full">
          <thead><TH cols={["REQ ID","Date","Generator","Est. Litres","Urgency","Raised By","Status","Note"]} /></thead>
          <tbody>
            {requisitions.map(r => {
              const us = urgSc(r.urgency); const ss = reqStSc(r.status);
              return (
                <tr key={r.id} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER }}>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{r.id}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.date}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:TEXT }}>{r.generator}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{r.estimatedLitres}L</td>
                  <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:us.bg, color:us.text }}>{r.urgency}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.requestedBy}</td>
                  <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor:ss.bg, color:ss.text }}>{r.status}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{r.procNote ?? (r.approvedBy ? `Approved by ${r.approvedBy}` : "—")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delivery log table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
        <table className="w-full">
          <thead><TH cols={["Entry","Date","Generator","Litres","₦/L","Total","Runtime Hrs","L/Hr","Supplier","Recorded By","Anomaly"]} /></thead>
          <tbody>
            {DIESEL_LOG.map(e=>(
              <tr key={e.id} className="border-t hover:bg-slate-50" style={{ borderColor:BORDER, backgroundColor:e.anomaly?"#FFFBEB":"white" }}>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color:PRIMARY, fontFamily:mono }}>{e.id}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.date}</td>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:TEXT }}>{e.generator}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>{e.litres}L</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>₦{e.unitPrice}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color:TEXT, fontFamily:mono }}>₦{e.total.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{e.runtimeHoursAtFill.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color:e.lph&&e.lph>4?ERROR:TEXT, fontFamily:mono }}>{e.lph ?? "—"}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.supplier}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{e.recordedBy}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color:ERROR }} title={e.anomaly}>{e.anomaly ? "⚠" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
