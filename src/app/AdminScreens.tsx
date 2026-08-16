import { useState, useCallback } from "react";
import {
  CalendarDays, KeyRound, ChevronLeft, ChevronRight,
  Bell, LogOut, User, ChevronDown, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Plus, Search, Filter,
  X, Lock,
  ClipboardList, CalendarCheck, AlertCircle, Clock,
  RefreshCw, Hash, FileText, CreditCard, Truck, Phone,
  Edit3, Eye, Trash2, Download, Send,
  Shield, Server, Activity,
  MinusCircle, PlusCircle, ShoppingCart, MapPin, Mail,
  UserCheck, BookOpen,
  ArrowDownToLine, ArrowUpFromLine, XCircle, Archive, Info,
  DollarSign, BedDouble,
} from "lucide-react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  type Role, type Toast, fmtN, uid,
  mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE,
  stC, roomStC,
  STAFF, BRANCHES, FOLIO_CHARGES,
  INVOICES_DATA, AP_DATA, DEPT_PERMS, ATTEND_DATA, REV_DATA,
  USERS_DATA, DEVICES, RATE_PLANS, PAYROLL_DATA,
} from "./constants";
import { Badge, EmptyState, StatCard, PageHeader, BtnP, BtnO, Inp } from "./UIKit";

function Av({ gender = "M", size = 36 }: { gender?: "M" | "F"; size?: number }) {
  const isFemale = gender === "F";
  const bg = isFemale ? "#FDF4FF" : "#EFF6FF";
  const fg = isFemale ? "#A855F7" : "#3B82F6";
  const border = isFemale ? "#E9D5FF" : "#BFDBFE";
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ width: size, height: size, backgroundColor: bg, border: `2px solid ${border}` }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 24 24" fill={fg}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        {isFemale && <path d="M8.5 6 C9 3.5 15 3.5 15.5 6" fill="none" stroke={fg} strokeWidth="1.5" strokeLinecap="round" />}
      </svg>
    </div>
  );
}

export function RolesPermissions({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const ROLES = [
    { code:"MGT", name:"Management",       seeded:true,  count:3  },
    { code:"ORG", name:"Organisation",     seeded:true,  count:1  },
    { code:"FD",  name:"Front Desk",       seeded:true,  count:8  },
    { code:"RSV", name:"Reservations",     seeded:true,  count:4  },
    { code:"HK",  name:"Housekeeping",     seeded:true,  count:12 },
    { code:"MX",  name:"Maintenance",      seeded:true,  count:5  },
    { code:"RT",  name:"Restaurant / POS", seeded:true,  count:6  },
    { code:"FIN", name:"Finance",          seeded:true,  count:3  },
    { code:"IT",  name:"IT Admin",         seeded:true,  count:2  },
    { code:"CS",  name:"Customer Service", seeded:true,  count:4  },
    { code:"RO",  name:"Read Only",        seeded:true,  count:1  },
    { code:"FLT", name:"Fleet",            seeded:false, count:2  },
    { code:"DRV", name:"Driver",           seeded:false, count:3  },
  ];

  const MODULES = [
    { key:"dashboard",    label:"Dashboard",               group:"Core"      },
    { key:"reservations", label:"Reservations",            group:"Core"      },
    { key:"front-desk",   label:"Front Desk / Check-in",   group:"Core"      },
    { key:"housekeeping", label:"Housekeeping",             group:"Operations"},
    { key:"maintenance",  label:"Maintenance",              group:"Operations"},
    { key:"restaurant",   label:"Restaurant & POS",         group:"Operations"},
    { key:"guest-msg",    label:"Guest Messaging",          group:"Comms"     },
    { key:"internal-chat",label:"Internal Chat",            group:"Comms"     },
    { key:"finance",      label:"Finance & Billing",        group:"Finance"   },
    { key:"reports",      label:"Reports & Analytics",      group:"Finance"   },
    { key:"inventory",    label:"Inventory",                group:"Operations"},
    { key:"hr",           label:"HR & Staff",               group:"HR"        },
    { key:"leave",        label:"Leave Management",         group:"HR"        },
    { key:"payroll",      label:"Payroll (View)",           group:"HR"        },
    { key:"payroll-edit", label:"Payroll (Edit)",           group:"HR"        },
    { key:"multi-branch", label:"Multi-Branch",             group:"IT Admin"  },
    { key:"it-admin",     label:"IT Admin",                 group:"IT Admin"  },
    { key:"audit-log",    label:"Audit Log",                group:"IT Admin"  },
    { key:"fleet",        label:"Fleet Operations",         group:"Fleet"     },
    { key:"settings",     label:"System Settings",          group:"IT Admin"  },
  ];

  // permission matrix: role code → set of module keys
  const MATRIX_INIT: Record<string, Set<string>> = {
    MGT: new Set(MODULES.map(m=>m.key)),
    ORG: new Set(["dashboard","reports","finance","hr","payroll","payroll-edit","multi-branch","settings"]),
    FD:  new Set(["dashboard","reservations","front-desk","guest-msg","internal-chat"]),
    RSV: new Set(["dashboard","reservations","front-desk","reports"]),
    HK:  new Set(["dashboard","housekeeping","internal-chat","inventory"]),
    MX:  new Set(["dashboard","maintenance","internal-chat","inventory"]),
    RT:  new Set(["dashboard","restaurant","internal-chat","inventory"]),
    FIN: new Set(["dashboard","finance","reports","audit-log"]),
    IT:  new Set(["dashboard","it-admin","audit-log","multi-branch","settings","hr"]),
    CS:  new Set(["dashboard","front-desk","guest-msg","internal-chat","reports"]),
    RO:  new Set(["dashboard","reports"]),
    FLT: new Set(["dashboard","fleet","internal-chat"]),
    DRV: new Set(["dashboard","fleet"]),
  };

  const [matrix, setMatrix] = useState(MATRIX_INIT);
  const [selectedRole, setSelectedRole] = useState("FD");
  const [previewUser, setPreviewUser]   = useState("Ada Okonkwo");
  const [unsavedRole, setUnsavedRole]   = useState<string|null>(null);

  const toggle = (role: string, mod: string) => {
    const roleData = ROLES.find(r=>r.code===role);
    if (roleData?.seeded && role==="RO") { add({ type:"error", title:"Read Only role cannot be modified" }); return; }
    setMatrix(prev => {
      const s = new Set(prev[role]);
      s.has(mod) ? s.delete(mod) : s.add(mod);
      return { ...prev, [role]: s };
    });
    setUnsavedRole(role);
  };

  const save = () => {
    add({ type:"success", title:`Permissions saved — ${ROLES.find(r=>r.code===selectedRole)?.name}` });
    setUnsavedRole(null);
  };

  const groups = Array.from(new Set(MODULES.map(m=>m.group)));
  const previewPerms = matrix[selectedRole] ?? new Set();

  return (
    <div>
      <PageHeader title="Roles & Permissions" sub="13 system roles · module-level permission matrix · effective-permission preview" actions={
        <div className="flex gap-2">
          {unsavedRole === selectedRole && <BtnP label="Save Changes" icon={CheckCircle2} onClick={save} />}
          <BtnO label="Create Role" icon={Plus} onClick={() => add({ type:"info", title:"Custom role creation" })} />
        </div>
      } />

      <div className="px-4 py-3 rounded-xl mb-5 text-xs" style={{ backgroundColor:"#FFFBEB", border:"1px solid #FDE68A", color:"#92400E" }}>
        <span className="font-semibold">Note:</span> Nav visibility is UX convenience only — permission enforcement happens server-side. Removing a module from a role here hides the nav item but the server independently validates every request.
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Roles Defined"   value={String(ROLES.length)}                      sub="3 custom, 10 system-seeded" icon={Shield}        accent={PRIMARY} />
        <StatCard label="Total Staff"     value={String(ROLES.reduce((s,r)=>s+r.count,0))}  sub="Across all roles"           icon={Users}         accent={TEAL}    />
        <StatCard label="Seeded Roles"    value={String(ROLES.filter(r=>r.seeded).length)}  sub="Cannot be deleted"          icon={Lock}          accent={ORANGE}  />
        <StatCard label="Custom Roles"    value={String(ROLES.filter(r=>!r.seeded).length)} sub="User-defined"                icon={Edit3}         accent={SUCCESS} />
      </div>

      <div className="flex gap-4">
        {/* Role list */}
        <div className="w-44 flex-shrink-0 bg-white rounded-xl border p-2" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 mb-1" style={{ color: SUBTLE }}>Roles</div>
          {ROLES.map(r => (
            <button key={r.code} onClick={()=>setSelectedRole(r.code)} className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-colors" style={{ backgroundColor: selectedRole===r.code?PRIMARY:"transparent" }}>
              <div className="text-xs font-semibold" style={{ color: selectedRole===r.code?"white":TEXT }}>{r.name}</div>
              <div className="text-xs" style={{ color: selectedRole===r.code?"rgba(255,255,255,0.7)":SUBTLE }}>{r.code} · {r.count} staff</div>
            </button>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: TEXT }}>{ROLES.find(r=>r.code===selectedRole)?.name} — Permission Matrix</h3>
              {ROLES.find(r=>r.code===selectedRole)?.seeded && <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>System-seeded role · core defaults protected</div>}
            </div>
            {unsavedRole===selectedRole && <button onClick={save} className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white" style={{ backgroundColor: PRIMARY }}>Save Changes</button>}
          </div>
          <div className="p-4">
            {groups.map(group => (
              <div key={group} className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-3" style={{ color: MUTED }}>{group}</div>
                <div className="space-y-1">
                  {MODULES.filter(m=>m.group===group).map(mod => {
                    const enabled = previewPerms.has(mod.key);
                    return (
                      <div key={mod.key} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC]">
                        <div>
                          <span className="text-sm" style={{ color: TEXT }}>{mod.label}</span>
                          <span className="ml-2 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{mod.key}</span>
                        </div>
                        <button onClick={() => toggle(selectedRole, mod.key)} className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0" style={{ backgroundColor: enabled?TEAL:"#CBD5E1" }}>
                          <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all shadow" style={{ left: enabled?22:2 }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Effective permissions preview */}
        <div className="w-56 flex-shrink-0 bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Effective Permissions</div>
          <div className="mb-3">
            <label className="text-xs block mb-1.5" style={{ color: MUTED }}>Preview for user</label>
            <select value={previewUser} onChange={e=>setPreviewUser(e.target.value)} className="w-full px-2 py-1.5 rounded-xl border text-xs outline-none bg-white" style={{ borderColor: BORDER }}>
              {["Ada Okonkwo","John Abubakar","Emeka Nwosu","Bello Musa"].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>{ROLES.find(r=>r.code===selectedRole)?.name}</div>
          <div className="space-y-1">
            {MODULES.map(m => {
              const has = previewPerms.has(m.key);
              return (
                <div key={m.key} className="flex items-center gap-2 text-xs py-0.5">
                  <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: has?"#DCFCE7":"#FEE2E2" }}>
                    <span style={{ color: has?SUCCESS:ERROR, fontSize:9 }}>{has?"✓":"✕"}</span>
                  </div>
                  <span className="truncate" style={{ color: has?TEXT:SUBTLE }}>{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttendanceScreen({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type AttStatus = "Present"|"Late"|"Absent"|"Leave"|"Off";

  const ATTENDANCE = [
    { id:"EMP-001", name:"John Abubakar",    dept:"Front Desk",  shift:"07:00–15:00", clockIn:"07:03", clockOut:"15:07", hours:8.1, lateMins:3,  overtime:0,  status:"Present" as AttStatus },
    { id:"EMP-002", name:"Amaka Osei",       dept:"Housekeeping",shift:"06:00–14:00", clockIn:"06:22", clockOut:"14:05", hours:7.7, lateMins:22, overtime:0,  status:"Late" as AttStatus    },
    { id:"EMP-003", name:"Emeka Nwosu",      dept:"Restaurant",  shift:"06:00–14:00", clockIn:"05:58", clockOut:"16:30", hours:10.5,lateMins:0,  overtime:2.5,status:"Present" as AttStatus },
    { id:"EMP-004", name:"Fatima Ibrahim",   dept:"Front Desk",  shift:"08:00–16:00", clockIn:"08:01", clockOut:"16:02", hours:8.0, lateMins:1,  overtime:0,  status:"Present" as AttStatus },
    { id:"EMP-005", name:"Chidi Eze",        dept:"Maintenance", shift:"08:00–16:00", clockIn:"",      clockOut:"",      hours:0,   lateMins:0,  overtime:0,  status:"Absent" as AttStatus  },
    { id:"EMP-006", name:"Ngozi Okonkwo",    dept:"Housekeeping",shift:"06:00–14:00", clockIn:"",      clockOut:"",      hours:0,   lateMins:0,  overtime:0,  status:"Leave" as AttStatus   },
    { id:"EMP-007", name:"Bello Musa",       dept:"Finance",     shift:"08:00–17:00", clockIn:"07:55", clockOut:"17:10", hours:9.25,lateMins:0,  overtime:0.25,status:"Present" as AttStatus},
    { id:"EMP-008", name:"Ada Okonkwo",      dept:"Front Desk",  shift:"15:00–23:00", clockIn:"14:58", clockOut:"",      hours:0,   lateMins:0,  overtime:0,  status:"Present" as AttStatus },
    { id:"EMP-009", name:"Tunde Adeyemi",    dept:"IT",          shift:"08:00–17:00", clockIn:"08:05", clockOut:"17:02", hours:9.0, lateMins:5,  overtime:0,  status:"Present" as AttStatus },
    { id:"EMP-010", name:"Grace Ojo",        dept:"Restaurant",  shift:"14:00–22:00", clockIn:"",      clockOut:"",      hours:0,   lateMins:0,  overtime:0,  status:"Off" as AttStatus     },
    { id:"EMP-011", name:"Samuel Okafor",    dept:"Security",    shift:"23:00–07:00", clockIn:"22:55", clockOut:"07:05", hours:8.2, lateMins:0,  overtime:0.2,status:"Present" as AttStatus },
  ];

  const stColor: Record<AttStatus,{bg:string;text:string}> = {
    Present: { bg:"#DCFCE7", text:"#166534" },
    Late:    { bg:"#FEF3C7", text:"#92400E" },
    Absent:  { bg:"#FEE2E2", text:"#991B1B" },
    Leave:   { bg:"#DBEAFE", text:"#1E40AF" },
    Off:     { bg:"#F3F4F6", text:"#374151" },
  };

  const WEEKLY_TREND = [
    { day:"Mon 07", present:9, late:1, absent:0 },
    { day:"Tue 08", present:8, late:2, absent:1 },
    { day:"Wed 09", present:10,late:0, absent:1 },
    { day:"Thu 10", present:9, late:1, absent:0 },
    { day:"Fri 11", present:8, late:1, absent:2 },
    { day:"Sat 12", present:7, late:0, absent:0 },
    { day:"Sun 13", present:5, late:0, absent:0 },
    { day:"Mon 14", present:9, late:2, absent:1 },
  ];

  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<AttStatus|"All">("All");
  const [showManual, setShowManual] = useState(false);
  const [manName, setManName]       = useState("");
  const [manReason, setManReason]   = useState("");
  const [manStatus, setManStatus]   = useState<AttStatus>("Present");
  const [manPin, setManPin]         = useState("");

  const depts = ["All", ...Array.from(new Set(ATTENDANCE.map(a=>a.dept)))];

  const filtered = ATTENDANCE.filter(a =>
    (deptFilter==="All"||a.dept===deptFilter) &&
    (statusFilter==="All"||a.status===statusFilter)
  );

  const DEPT_SUMMARY = Array.from(new Set(ATTENDANCE.map(a=>a.dept))).map(dept => ({
    dept,
    total:   ATTENDANCE.filter(a=>a.dept===dept).length,
    present: ATTENDANCE.filter(a=>a.dept===dept&&(a.status==="Present"||a.status==="Late")).length,
    absent:  ATTENDANCE.filter(a=>a.dept===dept&&a.status==="Absent").length,
  }));

  const submitManual = () => {
    if (manPin!=="1234") { add({ type:"error", title:"Invalid Manager PIN" }); return; }
    add({ type:"success", title:`Manual entry — ${manName}`, body:`Status: ${manStatus} · Reason: ${manReason}` });
    setShowManual(false); setManName(""); setManReason(""); setManPin("");
  };

  return (
    <div>
      <PageHeader title="Attendance" sub="14 Oct 2025 · Grand Palms Abuja · clock-in/out, lateness, overtime" actions={
        <div className="flex gap-2">
          <BtnO label="Export" icon={Download} onClick={()=>add({type:"info",title:"Exporting attendance report"})} />
          <BtnO label="Manual Entry" icon={Edit3} onClick={()=>setShowManual(true)} />
        </div>
      } />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard label="Present"   value={String(ATTENDANCE.filter(a=>a.status==="Present").length)} sub="On duty now"          icon={CheckCircle2}  accent={SUCCESS} />
        <StatCard label="Late"      value={String(ATTENDANCE.filter(a=>a.status==="Late").length)}    sub="Clocked in late"      icon={Clock}         accent={WARNING} />
        <StatCard label="Absent"    value={String(ATTENDANCE.filter(a=>a.status==="Absent").length)}  sub="Not reported"         icon={AlertTriangle} accent={ERROR}   />
        <StatCard label="On Leave"  value={String(ATTENDANCE.filter(a=>a.status==="Leave").length)}   sub="Approved"             icon={CalendarDays}  accent={TEAL}    />
        <StatCard label="Total OT"  value={`${ATTENDANCE.reduce((s,a)=>s+a.overtime,0).toFixed(1)}h`} sub="Overtime today"      icon={TrendingUp}    accent={ORANGE}  />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {depts.map(d=><button key={d} onClick={()=>setDeptFilter(d)} className="text-xs px-3 py-1.5 rounded-xl border" style={{ backgroundColor:deptFilter===d?PRIMARY:"white", color:deptFilter===d?"white":MUTED, borderColor:deptFilter===d?PRIMARY:BORDER }}>{d}</button>)}
        <div className="flex gap-1 ml-auto">
          {(["All","Present","Late","Absent","Leave","Off"] as (AttStatus|"All")[]).map(s=><button key={s} onClick={()=>setStatusFilter(s)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor:statusFilter===s?TEAL:"white", color:statusFilter===s?"white":MUTED, borderColor:statusFilter===s?TEAL:BORDER }}>{s}</button>)}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Staff","Dept","Scheduled Shift","Clock In","Clock Out","Hours","Late (min)","OT (h)","Status"].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                <td className="px-3 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{a.name}</div><div className="text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{a.id}</div></td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.dept}</td>
                <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.shift}</td>
                <td className="px-3 py-3 text-sm font-semibold" style={{ color: a.clockIn?TEXT:SUBTLE, fontFamily: mono }}>{a.clockIn||"—"}</td>
                <td className="px-3 py-3 text-sm" style={{ color: a.clockOut?TEXT:SUBTLE, fontFamily: mono }}>{a.clockOut||a.status==="Present"?"(on shift)":"—"}</td>
                <td className="px-3 py-3 text-sm font-bold" style={{ color: a.hours>0?TEXT:SUBTLE, fontFamily: mono }}>{a.hours>0?`${a.hours}h`:"—"}</td>
                <td className="px-3 py-3 text-sm font-semibold" style={{ color: a.lateMins>15?ERROR:a.lateMins>0?WARNING:SUBTLE, fontFamily: mono }}>{a.lateMins>0?`${a.lateMins}min`:"—"}</td>
                <td className="px-3 py-3 text-sm" style={{ color: a.overtime>0?TEAL:SUBTLE, fontFamily: mono }}>{a.overtime>0?`+${a.overtime}h`:"—"}</td>
                <td className="px-3 py-3"><Badge label={a.status} colors={stColor[a.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Dept summary */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>By Department</h3>
          {DEPT_SUMMARY.map(d => (
            <div key={d.dept} className="flex items-center gap-2 mb-2.5">
              <div className="flex-1 text-xs" style={{ color: TEXT }}>{d.dept}</div>
              <div className="text-xs" style={{ color: SUCCESS }}>{d.present}/{d.total} present</div>
              {d.absent>0&&<div className="text-xs font-semibold" style={{ color: ERROR }}>{d.absent} absent</div>}
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: MUTED }}>Attendance Trend — Oct 2025</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_TREND} margin={{ top:0, right:0, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="day" tick={{ fontSize:10, fill:SUBTLE }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:SUBTLE }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11 }} />
              <Bar dataKey="present" name="Present" fill={SUCCESS} stackId="a" />
              <Bar dataKey="late"    name="Late"    fill={WARNING} stackId="a" />
              <Bar dataKey="absent"  name="Absent"  fill={ERROR}   stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showManual && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={()=>setShowManual(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-96" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Manual Attendance Entry</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Staff Member</label><input value={manName} onChange={e=>setManName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Status</label>
                <div className="flex gap-2 flex-wrap">
                  {(["Present","Late","Absent","Leave"] as AttStatus[]).map(s=><button key={s} onClick={()=>setManStatus(s)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ backgroundColor:manStatus===s?PRIMARY:"white", color:manStatus===s?"white":MUTED, borderColor:manStatus===s?PRIMARY:BORDER }}>{s}</button>)}
                </div>
              </div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Reason / Approver Note</label><input value={manReason} onChange={e=>setManReason(e.target.value)} placeholder="State reason…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" maxLength={4} value={manPin} onChange={e=>setManPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={()=>setShowManual(false)} />
              <button onClick={submitManual} disabled={!manName||!manReason} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Save Entry</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ShiftScheduler({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type ShiftType = "Morning"|"Evening"|"Night"|"Off";

  const ROSTER = [
    { id:"EMP-001", name:"John Abubakar",  dept:"Front Desk",  req:5 },
    { id:"EMP-002", name:"Amaka Osei",     dept:"Housekeeping",req:5 },
    { id:"EMP-003", name:"Emeka Nwosu",    dept:"Restaurant",  req:6 },
    { id:"EMP-004", name:"Fatima Ibrahim", dept:"Front Desk",  req:5 },
    { id:"EMP-005", name:"Chidi Eze",      dept:"Maintenance", req:4 },
    { id:"EMP-006", name:"Ngozi Okonkwo",  dept:"Housekeeping",req:3 },
    { id:"EMP-007", name:"Bello Musa",     dept:"Finance",     req:5 },
    { id:"EMP-008", name:"Ada Okonkwo",    dept:"Front Desk",  req:5 },
  ];

  const DAYS = ["Mon 13","Tue 14","Wed 15","Thu 16","Fri 17","Sat 18","Sun 19"];

  const INIT_SCHEDULE: Record<string, Record<string, ShiftType>> = {
    "EMP-001": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Evening","Thu 16":"Morning","Fri 17":"Morning","Sat 18":"Off","Sun 19":"Off" },
    "EMP-002": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Morning","Thu 16":"Off",    "Fri 17":"Morning","Sat 18":"Morning","Sun 19":"Off" },
    "EMP-003": { "Mon 13":"Morning","Tue 14":"Night",  "Wed 15":"Off",    "Thu 16":"Off",    "Fri 17":"Morning","Sat 18":"Morning","Sun 19":"Morning" },
    "EMP-004": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Morning","Thu 16":"Morning","Fri 17":"Off",    "Sat 18":"Off","Sun 19":"Morning" },
    "EMP-005": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Off",    "Thu 16":"Morning","Fri 17":"Morning","Sat 18":"Off","Sun 19":"Off" },
    "EMP-006": { "Mon 13":"Off",    "Tue 14":"Morning","Wed 15":"Morning","Thu 16":"Morning","Fri 17":"Off",    "Sat 18":"Morning","Sun 19":"Morning" },
    "EMP-007": { "Mon 13":"Morning","Tue 14":"Morning","Wed 15":"Morning","Thu 16":"Morning","Fri 17":"Morning","Sat 18":"Off","Sun 19":"Off" },
    "EMP-008": { "Mon 13":"Evening","Tue 14":"Evening","Wed 15":"Evening","Thu 16":"Evening","Fri 17":"Evening","Sat 18":"Off","Sun 19":"Off" },
  };

  const DEPT_COVERAGE: Record<string, Record<string, number>> = {
    "Front Desk":  { Morning:2, Evening:1, Night:1 },
    "Housekeeping":{ Morning:3, Evening:1, Night:0 },
    "Restaurant":  { Morning:2, Evening:2, Night:0 },
    "Maintenance": { Morning:1, Evening:0, Night:0 },
    "Finance":     { Morning:1, Evening:0, Night:0 },
  };

  const SHIFT_TEMPLATES = [
    { name:"Standard Week",  desc:"Mon–Fri Morning, Sat–Sun Off" },
    { name:"Weekend Cover",  desc:"Tue–Sat Morning, Sun–Mon Off" },
    { name:"Evening Block",  desc:"Mon–Fri Evening, Sat–Sun Off" },
    { name:"Night Rotation", desc:"4 nights on, 3 off, rotating" },
  ];

  const shiftC: Record<ShiftType,{bg:string;text:string}> = {
    Morning: { bg:"#DCFCE7", text:"#166534" },
    Evening: { bg:"#DBEAFE", text:"#1E40AF" },
    Night:   { bg:"#EDE9FE", text:"#6D28D9" },
    Off:     { bg:"#F3F4F6", text:"#71717A" },
  };

  const [schedule, setSchedule] = useState(INIT_SCHEDULE);
  const [published, setPublished] = useState(false);
  const [selected, setSelected] = useState<{emp:string;day:string}|null>(null);
  const [swapReq, setSwapReq]   = useState<{from:string;day:string;to:string}|null>(null);
  const [swapTo, setSwapTo]     = useState("");

  const setShift = (empId: string, day: string, shift: ShiftType) => {
    setSchedule(prev => ({ ...prev, [empId]: { ...prev[empId], [day]: shift } }));
    setSelected(null);
    setPublished(false);
  };

  // Coverage analysis: count per dept per day for Morning shifts
  const coverage = DAYS.map(day => {
    const depts = Object.keys(DEPT_COVERAGE);
    return {
      day,
      warnings: depts.flatMap(dept => {
        const needed = DEPT_COVERAGE[dept]?.Morning||0;
        const have   = ROSTER.filter(r=>r.dept===dept && schedule[r.id]?.[day]==="Morning").length;
        return have < needed ? [`${dept}: need ${needed}, have ${have}`] : [];
      }),
    };
  });
  const totalWarnings = coverage.reduce((s,c)=>s+c.warnings.length,0);

  const publish = () => {
    setPublished(true);
    add({ type:"success", title:"Schedule published — Week of 13–19 Oct", body:"All staff notified via device" });
  };

  return (
    <div>
      <PageHeader title="Shift Scheduler" sub="Week of 13–19 Oct 2025 · click a cell to change shift · coverage warnings shown" actions={
        <div className="flex gap-2">
          <BtnO label="Clone Last Week" icon={RefreshCw} onClick={() => add({ type:"info", title:"Last week cloned" })} />
          <BtnO label="Templates" icon={Layers} onClick={() => add({ type:"info", title:"Shift templates" })} />
          <BtnP label={published?"Published ✓":"Publish Schedule"} icon={Send} onClick={publish} />
        </div>
      } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Staff on Roster"   value={String(ROSTER.length)}                          sub="This week"          icon={Users}         accent={PRIMARY} />
        <StatCard label="Shifts Assigned"   value={String(Object.values(schedule).flatMap(d=>Object.values(d)).filter(s=>s!=="Off").length)} sub="7-day period" icon={CalendarDays}  accent={TEAL}    />
        <StatCard label="Coverage Warnings" value={String(totalWarnings)}                           sub="Under-staffed slots" icon={AlertTriangle} accent={totalWarnings>0?WARNING:SUCCESS} />
        <StatCard label="Published"         value={published?"Yes":"Not yet"}                       sub={published?"Staff notified":"Pending publish"} icon={Send} accent={published?SUCCESS:ORANGE} />
      </div>

      {totalWarnings > 0 && (
        <div className="px-4 py-3 rounded-xl mb-4 text-xs" style={{ backgroundColor:"#FFFBEB", border:"1px solid #FDE68A" }}>
          <div className="font-semibold mb-1" style={{ color:"#92400E" }}>Coverage warnings — {totalWarnings} slots understaffed</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {coverage.filter(c=>c.warnings.length).map(c=>c.warnings.map((w,i)=><span key={`${c.day}-${i}`} style={{ color:"#B45309" }}>{c.day}: {w}</span>))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-auto mb-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
        {/* Header */}
        <div className="flex border-b" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
          <div className="w-44 flex-shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Staff</div>
          {DAYS.map(d => {
            const warn = coverage.find(c=>c.day===d)?.warnings.length||0;
            return (
              <div key={d} className="flex-1 text-center py-3 min-w-[90px]">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{d}</div>
                {warn>0&&<div className="text-xs font-bold" style={{ color: WARNING }}>⚠ {warn}</div>}
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {ROSTER.map(r => (
          <div key={r.id} className="flex items-center border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, minHeight:52 }}>
            <div className="w-44 flex-shrink-0 px-4 py-2">
              <div className="text-sm font-medium" style={{ color: TEXT }}>{r.name.split(" ")[0]} {r.name.split(" ")[1]?.[0]}.</div>
              <div className="text-xs" style={{ color: MUTED }}>{r.dept}</div>
            </div>
            {DAYS.map(day => {
              const shift = schedule[r.id]?.[day] ?? "Off";
              const c     = shiftC[shift];
              const isSel = selected?.emp===r.id && selected?.day===day;
              return (
                <div key={day} className="flex-1 flex justify-center py-2 min-w-[90px] relative">
                  <button onClick={() => setSelected(isSel?null:{emp:r.id,day})} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all" style={{ backgroundColor: isSel?"#EFF6FF":c.bg, color: isSel?PRIMARY:c.text, borderColor: isSel?PRIMARY:"transparent" }}>
                    {shift}
                  </button>
                  {isSel && (
                    <div className="absolute top-10 z-20 bg-white rounded-xl border shadow-lg p-2 flex flex-col gap-1 min-w-[100px]" style={{ borderColor: BORDER }}>
                      {(["Morning","Evening","Night","Off"] as ShiftType[]).map(s=>(
                        <button key={s} onClick={()=>setShift(r.id,day,s)} className="text-xs px-3 py-1.5 rounded-lg text-left font-semibold" style={{ backgroundColor: shiftC[s].bg, color: shiftC[s].text }}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div className="px-5 py-3 border-t flex gap-6 items-center" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
          {(Object.entries(shiftC) as [ShiftType,{bg:string;text:string}][]).map(([s,c])=>(
            <span key={s} className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
              <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: c.bg, border:`1px solid ${c.text}30` }} />{s}
            </span>
          ))}
          <span className="text-xs ml-auto" style={{ color: SUBTLE }}>Click a shift block to change</span>
        </div>
      </div>

      {/* Shift templates */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Shift Templates</h3>
          <div className="space-y-2">
            {SHIFT_TEMPLATES.map(t=>(
              <div key={t.name} className="flex items-center justify-between px-3 py-2.5 rounded-xl border hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER }}>
                <div><div className="text-sm font-medium" style={{ color: TEXT }}>{t.name}</div><div className="text-xs" style={{ color: MUTED }}>{t.desc}</div></div>
                <button onClick={()=>add({type:"info",title:`Template applied: ${t.name}`})} className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Apply</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Swap Requests</h3>
          <div className="space-y-2">
            {[
              { from:"Emeka Nwosu",   day:"Tue 14", shift:"Night",   to:"Grace Ojo", status:"Pending"  },
              { from:"Ngozi Okonkwo", day:"Mon 13", shift:"Morning", to:"Ada Okonkwo",status:"Approved" },
            ].map((req,i)=>(
              <div key={i} className="px-3 py-2.5 rounded-xl border" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold" style={{ color: TEXT }}>{req.from} → {req.to}</div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor:req.status==="Approved"?"#DCFCE7":"#FEF3C7", color:req.status==="Approved"?SUCCESS:WARNING }}>{req.status}</span>
                </div>
                <div className="text-xs" style={{ color: MUTED }}>{req.day} · {req.shift} shift</div>
                {req.status==="Pending" && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>add({type:"success",title:"Swap approved"})} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color:SUCCESS, borderColor:`${SUCCESS}30` }}>Approve</button>
                    <button onClick={()=>add({type:"error",title:"Swap rejected"})} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color:ERROR, borderColor:`${ERROR}30` }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// CentralSyncStatus → MultibranchSettingsScreens.tsx
export { CentralSyncStatus } from "./MultibranchSettingsScreens";

export function ReservationSearch({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [sourceF, setSourceF] = useState("All");
  const [ratePlanF, setRatePlanF] = useState("All");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const SAVED = [
    { label: "Today's Arrivals", q: "", status: "Confirmed" },
    { label: "All Checked In", q: "", status: "Checked In" },
    { label: "Cancellations", q: "", status: "Cancelled" },
  ];
  const filtered = ALL_RES.filter(r => {
    const ql = q.toLowerCase();
    const matchQ = !q || r.guest.toLowerCase().includes(ql) || r.id.toLowerCase().includes(ql) || r.room.toLowerCase().includes(ql);
    const matchSt = statusF === "All" || r.status === statusF;
    const matchSrc = sourceF === "All" || r.source === sourceF;
    return matchQ && matchSt && matchSrc;
  });
  return (
    <div>
      <PageHeader title="Reservation Search" sub={`${filtered.length} result${filtered.length !== 1 ? "s" : ""} · Search all reservations`} actions={<BtnP label="New Reservation" icon={Plus} onClick={() => nav && nav("new-reservation","New Reservation")} />} />
      {/* Saved searches */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Saved:</span>
        {SAVED.map(s => (
          <button key={s.label} onClick={() => { setQ(s.q); setStatusF(s.status); }}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
            style={{ borderColor: statusF === s.status && q === s.q ? PRIMARY : BORDER, backgroundColor: statusF === s.status && q === s.q ? "#EFF6FF" : "white", color: statusF === s.status && q === s.q ? PRIMARY : MUTED }}>
            {s.label}
          </button>
        ))}
        <button onClick={() => { setQ(""); setStatusF("All"); setSourceF("All"); setRatePlanF("All"); }} className="text-xs px-3 py-1.5 rounded-full border ml-auto" style={{ color: MUTED, borderColor: BORDER }}>Clear filters</button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        {/* Filter bar */}
        <div className="p-4 border-b" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
            <div className="lg:col-span-2 relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Guest name, reservation ID, room number, phone…" className="pl-9 pr-4 py-2.5 w-full border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }} /></div>
            <select value={statusF} onChange={e=>setStatusF(e.target.value)} className="px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: BORDER }}>
              {["All","Confirmed","Checked In","Checked Out","No Show","Cancelled"].map(s=><option key={s}>{s}</option>)}
            </select>
            <button onClick={()=>setShowAdvanced(!showAdvanced)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-lg text-sm" style={{ borderColor: showAdvanced ? PRIMARY : BORDER, color: showAdvanced ? PRIMARY : MUTED }}>
              <Filter size={13} />{showAdvanced ? "Hide" : "More Filters"}
            </button>
          </div>
          {showAdvanced && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div><label className="text-xs font-medium block mb-1" style={{ color: MUTED }}>Check-In From</label><input type="date" className="w-full px-3 py-2 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1" style={{ color: MUTED }}>Check-In To</label><input type="date" className="w-full px-3 py-2 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-medium block mb-1" style={{ color: MUTED }}>Source</label>
                <select value={sourceF} onChange={e=>setSourceF(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }}>
                  {["All","Phone","Email","Walk-In","Online","OTA"].map(s=><option key={s}>{s}</option>)}
                </select></div>
              <div><label className="text-xs font-medium block mb-1" style={{ color: MUTED }}>Rate Plan</label>
                <select value={ratePlanF} onChange={e=>setRatePlanF(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs outline-none" style={{ borderColor: BORDER }}>
                  {["All","Standard Rate","Corporate Rate","Weekend Special","Group Rate (10+)"].map(s=><option key={s}>{s}</option>)}
                </select></div>
            </div>
          )}
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>
            {["Reservation ID","Guest","Room","Source","Check-in","Check-out","Nights","Status",""].map((h,i)=>(
              <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{filtered.map(r => (
            <tr key={r.id} className="border-t hover:bg-[#F9FAFB] cursor-pointer" style={{ borderColor: "#F4F4F5" }} onClick={() => nav && nav("reservation-detail", r.id)}>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
              <td className="px-5 py-3"><div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{r.guest.split(" ").map((n:string) => n[0]).join("").slice(0,2)}</div>
                <span className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</span>
              </div></td>
              <td className="px-5 py-3 text-xs font-bold" style={{ color: PRIMARY }}>Rm {r.room}</td>
              <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{r.source}</span></td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{r.checkin}</td>
              <td className="px-5 py-3 text-xs" style={{ color: MUTED }}>{r.checkout}</td>
              <td className="px-5 py-3 text-sm" style={{ color: MUTED }}>{r.nights}n</td>
              <td className="px-5 py-3"><Badge label={r.status} colors={resStC[r.status] ?? { bg:"#F4F4F5",text:"#374151" }} /></td>
              <td className="px-5 py-3"><div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                <button onClick={() => nav && nav("reservation-detail", r.id)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>View</button>
                {r.status === "Confirmed" && <button onClick={() => nav ? nav("check-in","Check-In") : add({ type:"success",title:"Check-in started",body:r.guest })} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Check In</button>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={Search} message="No reservations match your search. Try different criteria." />}
        <div className="flex items-center justify-between px-5 py-3 border-t text-xs" style={{ borderColor: BORDER, color: MUTED }}>
          <span>{filtered.length} of {ALL_RES.length} reservations shown</span>
          <button onClick={() => add({ type:"info",title:"Exported to CSV",body:`${filtered.length} records` })} className="flex items-center gap-1" style={{ color: PRIMARY }}><Download size={12} />Export CSV</button>
        </div>
      </div>
    </div>
  );
}

// R-03 Reservation Detail
export function ReservationDetail({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Folio", "Guest", "Access", "Requests", "History"];
  const res = ALL_RES[0];
  const folioItems = [
    { date:"1 Aug 09:00", desc:"Room Charge — Night 1", dept:"Rooms", amount:55000 },
    { date:"1 Aug 07:45", desc:"Restaurant Breakfast × 2", dept:"F&B", amount:8500 },
    { date:"1 Aug 20:10", desc:"Room Service — Jollof Rice + Chapman", dept:"F&B", amount:6200 },
    { date:"2 Aug 09:00", desc:"Room Charge — Night 2", dept:"Rooms", amount:55000 },
    { date:"2 Aug 14:30", desc:"Laundry Service", dept:"Housekeeping", amount:3500 },
  ];
  const folioTotal = folioItems.reduce((s,f)=>s+f.amount,0);
  const folioVAT = Math.round(folioTotal*0.075);
  const folioGrand = folioTotal + folioVAT;
  const ACCESS_LIST = [
    { type:"Key Card", ref:"KC-0042", issued:"1 Aug 14:12", issuedBy:"John Abubakar", status:"Active" },
    { type:"Door PIN", ref:"PIN-6631", issued:"1 Aug 14:15", issuedBy:"System", status:"Active" },
  ];
  const REQUESTS_LIST = [
    { id:"REQ-01", category:"Amenity", detail:"Champagne + fruit basket on arrival", status:"Fulfilled", by:"Grace Achebe" },
    { id:"REQ-02", category:"Housekeeping", detail:"Extra pillows × 2", status:"Fulfilled", by:"Amaka Osei" },
    { id:"REQ-03", category:"Room Preference", detail:"High floor requested", status:"Assigned", by:"System" },
    { id:"REQ-04", category:"Restaurant", detail:"Table reservation 25 Aug 19:00 — 2 pax", status:"Pending", by:"–" },
  ];
  return (
    <div>
      <PageHeader title={`Reservation ${res.id}`} sub={`${res.guest} · Room ${res.room} · ${res.type}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <BtnO label="Extend Stay" icon={CalendarDays} onClick={()=>add({type:"info",title:"Extend Stay",body:"Select new check-out date"})} />
            <BtnO label="Change Rate" icon={DollarSign} onClick={()=>add({type:"info",title:"Rate change",body:"Select new rate plan"})} />
            <BtnO label="No-Show" onClick={()=>add({type:"warning",title:"Marked as No-Show",body:res.guest})} />
            <BtnO label="Cancel" onClick={()=>add({type:"warning",title:"Cancellation initiated",body:res.id})} />
            <BtnO label="Print Reg Card" icon={FileText} onClick={()=>add({type:"info",title:"Printing registration card…"})} />
            <BtnP label="Check In" icon={KeyRound} onClick={()=>nav ? nav("check-in","Check-In") : add({type:"success",title:"Check-in started",body:res.guest})} />
          </div>
        } />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        {/* Status banner */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-b" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <Badge label={res.status} colors={resStC[res.status] ?? { bg:"#F4F4F5",text:"#374151" }} />
          <span className="text-sm" style={{ color: SUCCESS }}>Arriving today at 14:00 · Suite 501 prepped and ready</span>
          <button className="ml-auto text-xs flex items-center gap-1 font-medium" style={{ color: SUCCESS }} onClick={()=>add({type:"success",title:"Message sent",body:res.guest})}><MessageSquare size={12}/>Message Guest</button>
        </div>
        {/* Tabs */}
        <div className="flex border-b overflow-x-auto" style={{ borderColor: BORDER }}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
              style={{ color: tab===t ? PRIMARY : MUTED, borderBottom: tab===t ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{t}</button>
          ))}
        </div>
        <div className="p-6">
          {tab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Booking Details</h3>
                <div className="space-y-2">
                  {[["Reservation ID",res.id],["Booking Type","Individual"],["Source",res.source],["Room Type",res.type],["Room Number",`Room ${res.room}`],["Check-in",`${res.checkin} 2026, 14:00`],["Check-out",`${res.checkout} 2026, 11:00`],["Nights",String(res.nights)],["Rate Plan","Standard Rate"],["Nightly Rate",`₦${res.rate.toLocaleString()}`],["Subtotal",`₦${(res.rate*res.nights).toLocaleString()}`],["VAT (7.5%)",`₦${Math.round(res.rate*res.nights*0.075).toLocaleString()}`],["Total",`₦${Math.round(res.rate*res.nights*1.075).toLocaleString()} incl. VAT`]].map(([k,v])=>(
                    <div key={k} className="flex gap-4 text-sm"><span className="w-36 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[{label:"Assign Room",icon:BedDouble},{label:"Post Charge",icon:DollarSign},{label:"Add Request",icon:Plus},{label:"Print Folio",icon:FileText}].map(a=>(
                    <button key={a.label} onClick={()=>add({type:"info",title:a.label})} className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium" style={{ borderColor: BORDER, color: TEXT }}>
                      <a.icon size={15} style={{ color: PRIMARY }} />{a.label}
                    </button>
                  ))}
                </div>
                <div className="p-3 rounded-xl mt-4" style={{ backgroundColor: "#F0F4F8" }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Folio Balance</div>
                  <div className="text-2xl font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{folioGrand.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: MUTED }}>Incl. VAT · Deposit: ₦27,500 paid</div>
                </div>
              </div>
            </div>
          )}
          {tab === "Folio" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Folio Charges</h3>
                <div className="flex gap-2"><BtnO label="Post Charge" icon={Plus} onClick={()=>add({type:"info",title:"Post charge form"})} /><BtnO label="Print Folio" icon={FileText} onClick={()=>add({type:"info",title:"Folio printed"})} /></div>
              </div>
              <table className="w-full mb-4">
                <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Date/Time","Description","Dept","Amount"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
                <tbody>{folioItems.map((f,i)=>(
                  <tr key={i} className="border-t" style={{ borderColor: "#F1F5F9" }}>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{f.date}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{f.desc}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{f.dept}</span></td>
                    <td className="px-4 py-3 text-sm font-semibold text-right" style={{ color: TEXT, fontFamily: mono }}>₦{f.amount.toLocaleString()}</td>
                  </tr>
                ))}</tbody>
              </table>
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#F0F4F8" }}>
                {[["Subtotal",`₦${folioTotal.toLocaleString()}`],["VAT (7.5%)",`₦${folioVAT.toLocaleString()}`]].map(([k,v])=>(
                  <div key={k} className="flex justify-between text-sm mb-1"><span style={{ color: MUTED }}>{k}</span><span style={{ fontFamily: mono }}>{v as string}</span></div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t" style={{ borderColor: BORDER }}>
                  <span style={{ color: TEXT }}>Total Due</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{folioGrand.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          {tab === "Guest" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 p-4 rounded-xl mb-4" style={{ backgroundColor: "#F0F4F8" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>CB</div>
                  <div><div className="flex items-center gap-2 mb-1"><span className="text-base font-bold" style={{ color: TEXT }}>{res.guest}</span><Star size={13} fill={ORANGE} style={{ color: ORANGE }} /></div>
                    <div className="text-xs" style={{ color: MUTED }}>VIP · 15 previous stays · Guest since 2019</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[["Phone","+234 803 555 6666"],["Email","c.bello@example.com"],["Nationality","Nigerian"],["ID Type","International Passport"],["ID Number","A12345678"],["Company","Bello & Associates Ltd"],["Loyalty Tier","Gold"]].map(([k,v])=>(
                    <div key={k} className="flex gap-4 text-sm"><span className="w-32 flex-shrink-0" style={{ color: MUTED }}>{k}</span><span className="font-medium" style={{ color: TEXT }}>{v as string}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Stay History</h3>
                <div className="space-y-2">
                  {[{id:"BK-2701",dates:"12–14 Mar 2026",room:"Suite 501",total:"₦177,375"},
                    {id:"BK-2544",dates:"25–27 Dec 2025",room:"Suite 501",total:"₦245,000"},
                    {id:"BK-2388",dates:"14–17 Aug 2025",room:"Deluxe 302",total:"₦138,750"}].map(h=>(
                    <div key={h.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}>
                      <div><div className="text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{h.id}</div><div className="text-xs" style={{ color: MUTED }}>{h.dates} · {h.room}</div></div>
                      <span className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{h.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "Access" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Room Access Credentials</h3>
                <BtnP label="Issue New Card" icon={Plus} onClick={()=>add({type:"success",title:"Key card issued",body:`Room ${res.room} — insert blank card`})} />
              </div>
              <div className="space-y-3 mb-6">
                {ACCESS_LIST.map(a=>(
                  <div key={a.ref} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: BORDER }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
                        {a.type === "Key Card" ? <CreditCard size={16} style={{ color: PRIMARY }} /> : <Lock size={16} style={{ color: PRIMARY }} />}
                      </div>
                      <div><div className="text-sm font-semibold" style={{ color: TEXT }}>{a.type}</div>
                        <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.ref} · Issued {a.issued} by {a.issuedBy}</div></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#CCFBF1", color: "#0F766E" }}>{a.status}</span>
                      <button onClick={()=>add({type:"warning",title:`${a.type} deactivated`,body:a.ref})} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>Deactivate</button>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Access Log</h3>
              <div className="space-y-2">
                {[["1 Aug 14:13","Door opened — Key Card KC-0042","Main Entrance"],["1 Aug 14:20","Door opened — Key Card KC-0042","Room 501"],["1 Aug 22:04","Door opened — PIN 6631","Room 501"],["2 Aug 07:30","Door opened — Key Card KC-0042","Room 501"]].map(([ts,event,loc],i)=>(
                  <div key={i} className="flex gap-3 text-xs items-center">
                    <span className="w-32 flex-shrink-0" style={{ color: SUBTLE, fontFamily: mono }}>{ts}</span>
                    <span className="flex-1" style={{ color: TEXT }}>{event}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F0F4F8", color: MUTED }}>{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "Requests" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Service & Special Requests</h3>
                <BtnP label="Add Request" icon={Plus} onClick={()=>add({type:"info",title:"Add request"})} />
              </div>
              <div className="space-y-3">
                {REQUESTS_LIST.map(r=>(
                  <div key={r.id} className="flex items-start justify-between p-4 rounded-xl border" style={{ borderColor: r.status==="Pending" ? `${ORANGE}40` : BORDER, backgroundColor: r.status==="Pending" ? "#FFFBEB" : "white" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{r.category}</span>
                        <span className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.id}</span>
                      </div>
                      <div className="text-sm font-medium" style={{ color: TEXT }}>{r.detail}</div>
                      {r.by !== "–" && <div className="text-xs mt-1" style={{ color: MUTED }}>Fulfilled by {r.by}</div>}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                        backgroundColor: r.status==="Fulfilled" ? "#CCFBF1" : r.status==="Pending" ? "#FEF3C7" : "#EFF6FF",
                        color: r.status==="Fulfilled" ? "#0F766E" : r.status==="Pending" ? "#D97706" : PRIMARY
                      }}>{r.status}</span>
                      {r.status === "Pending" && <button onClick={()=>add({type:"success",title:"Request marked fulfilled",body:r.detail})} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Fulfil</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "History" && (
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Audit Trail</h3>
              <div className="space-y-3">
                {[["1 Aug 09:15","Reservation created via phone","Fatima Al-Hassan","create"],
                  ["1 Aug 09:20","Room 501 pre-assigned by system","System","assign"],
                  ["1 Aug 09:22","Confirmation email sent to guest","System","notify"],
                  ["1 Aug 09:30","Champagne + fruit basket noted","Grace Mensah","request"],
                  ["1 Aug 10:05","Deposit ₦27,500 collected — POS","John Abubakar","payment"],
                  ["1 Aug 14:12","Guest checked in — key card issued","John Abubakar","checkin"]].map(([ts,action,by,type],i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: type==="checkin" ? "#CCFBF1" : type==="payment" ? "#EFF6FF" : type==="notify" ? "#F0F4F8" : "#F0FDF4" }}>
                      {type==="checkin" ? <CheckCircle2 size={12} style={{ color: SUCCESS }} /> : type==="payment" ? <DollarSign size={12} style={{ color: PRIMARY }} /> : <Clock size={12} style={{ color: MUTED }} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm" style={{ color: TEXT }}>{action}</div>
                      <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                        <span style={{ fontFamily: mono }}>{ts as string}</span> · by {by}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FD-03 Room Assignment Board
export function RoomAssignmentBoard({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const UNASSIGNED_ARRIVALS = [
    { id: "BK-2851", guest: "Emmanuel Adeyemi", av: "EA", type: "Standard", eta: "12:00", vip: false, nights: 1 },
    { id: "BK-2852", guest: "Fatima Al-Hassan", av: "FA", type: "Deluxe", eta: "16:00", vip: true, nights: 4 },
  ];
  const ALL_ROOMS = [
    { id: "101", type: "Standard", floor: 1, status: "Occupied", hkSt: "Occupied", guest: "Adaeze Okonkwo" },
    { id: "102", type: "Standard", floor: 1, status: "Available", hkSt: "Inspected", guest: null },
    { id: "103", type: "Deluxe", floor: 1, status: "Cleaning", hkSt: "In Progress", guest: null },
    { id: "104", type: "Standard", floor: 1, status: "Available", hkSt: "Clean", guest: null },
    { id: "201", type: "Deluxe", floor: 2, status: "Reserved", hkSt: "Inspected", guest: null },
    { id: "202", type: "Deluxe", floor: 2, status: "Occupied", hkSt: "Occupied", guest: "Emmanuel Adeyemi" },
    { id: "203", type: "Suite", floor: 2, status: "Occupied", hkSt: "Occupied", guest: "Fatima Musa" },
    { id: "204", type: "Standard", floor: 2, status: "Maintenance", hkSt: "Maintenance", guest: null },
    { id: "301", type: "Suite", floor: 3, status: "Available", hkSt: "Inspected", guest: null },
    { id: "302", type: "Deluxe", floor: 3, status: "Occupied", hkSt: "Occupied", guest: "Ibrahim Lawal" },
    { id: "304", type: "Standard", floor: 3, status: "Occupied", hkSt: "Occupied", guest: "Chukwuemeka Obi" },
    { id: "501", type: "Suite", floor: 5, status: "Available", hkSt: "Inspected", guest: null },
  ];
  const [selGuest, setSelGuest] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [floorFilter, setFloorFilter] = useState("All");
  const [conflictRoom, setConflictRoom] = useState<string | null>(null);
  const floors = ["All", "1", "2", "3", "5"];
  const hkDot: Record<string, string> = { Inspected: SUCCESS, Clean: "#22C55E", "In Progress": WARNING, Dirty: ORANGE, Maintenance: ERROR, Occupied: MUTED, DND: "#6B7280" };
  const doAssign = (guestId: string, roomId: string) => {
    const g = UNASSIGNED_ARRIVALS.find(a => a.id === guestId);
    setAssigned(prev => ({ ...prev, [roomId]: guestId }));
    add({ type: "success", title: "Room assigned", body: `${g?.guest} → Room ${roomId}` });
    setSelGuest(null);
  };
  const handleRoomClick = (r: typeof ALL_ROOMS[0]) => {
    if (!selGuest) return;
    const conflict = r.status === "Occupied" ? "Room is occupied" : r.status === "Maintenance" ? "Room under maintenance" : r.hkSt === "In Progress" ? "Room is being cleaned" : r.id in assigned ? "Already assigned" : null;
    if (conflict) { setConflictRoom(r.id); add({ type: "error", title: `Cannot assign — ${conflict}`, body: `Room ${r.id}` }); setTimeout(() => setConflictRoom(null), 2000); return; }
    doAssign(selGuest, r.id);
  };
  const visibleRooms = floorFilter === "All" ? ALL_ROOMS : ALL_ROOMS.filter(r => String(r.floor) === floorFilter);
  const grouped = floors.filter(f => f !== "All").reduce((acc, f) => { acc[f] = visibleRooms.filter(r => String(r.floor) === f); return acc; }, {} as Record<string, typeof ALL_ROOMS>);
  const totalAssigned = UNASSIGNED_ARRIVALS.length - UNASSIGNED_ARRIVALS.filter(a => !Object.values(assigned).includes(a.id)).length;
  return (
    <div>
      <PageHeader title="Room Assignment Board" sub="Click a guest to select, then click an available room to assign" actions={<BtnP label="Auto-Assign All" icon={Zap} onClick={() => { UNASSIGNED_ARRIVALS.forEach((a,i) => { const avail = ALL_ROOMS.filter(r => r.status === "Available" && !(r.id in assigned)); if (avail[i]) setAssigned(prev => ({ ...prev, [avail[i].id]: a.id })); }); add({ type: "success", title: "Auto-assigned all unassigned arrivals" }); }} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Unassigned" value={String(UNASSIGNED_ARRIVALS.filter(a => !Object.values(assigned).includes(a.id)).length)} sub="Need room" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Available Rooms" value={String(ALL_ROOMS.filter(r => r.status === "Available" && !(r.id in assigned)).length)} sub="Ready to assign" icon={BedDouble} accent={SUCCESS} />
        <StatCard label="Total Arrivals" value={String(UNASSIGNED_ARRIVALS.length + 3)} sub="Expected today" icon={CalendarCheck} accent={PRIMARY} />
        <StatCard label="Assigned Today" value={String(totalAssigned + 3)} sub="Ready for check-in" icon={CheckCircle2} accent={TEAL} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: unassigned arrivals */}
        <div className="lg:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Unassigned Arrivals — click to select</div>
          <div className="space-y-3">
            {UNASSIGNED_ARRIVALS.map(a => {
              const isAssigned = Object.values(assigned).includes(a.id);
              const isSel = selGuest === a.id;
              return (
                <div key={a.id} onClick={() => !isAssigned && setSelGuest(isSel ? null : a.id)}
                  className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: isSel ? PRIMARY : isAssigned ? SUCCESS : BORDER, borderWidth: isSel || isAssigned ? 2 : 1, opacity: isAssigned ? 0.55 : 1 }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: a.vip ? ORANGE : PRIMARY }}>{a.av}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5"><span className="text-sm font-semibold" style={{ color: TEXT }}>{a.guest}</span>{a.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{a.type} · ETA {a.eta} · {a.nights}n</div>
                    </div>
                    {isAssigned ? <CheckCircle2 size={16} style={{ color: SUCCESS }} /> : isSel ? <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: PRIMARY }}><div className="w-2 h-2 rounded-full bg-white" /></div> : <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: BORDER }} />}
                  </div>
                  {isSel && <div className="px-4 pb-3 text-xs font-semibold" style={{ color: PRIMARY }}>→ Now click an available room on the right to assign</div>}
                </div>
              );
            })}
            {UNASSIGNED_ARRIVALS.every(a => Object.values(assigned).includes(a.id)) && (
              <div className="py-8 text-center rounded-xl border" style={{ borderColor: BORDER }}><CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: SUCCESS }} /><p className="text-sm font-semibold" style={{ color: SUCCESS }}>All arrivals assigned</p></div>
            )}
          </div>
        </div>
        {/* Right: room grid by floor */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider flex-1" style={{ color: MUTED }}>Rooms by Floor{selGuest ? " — click available room to assign" : ""}</div>
            {floors.map(f => <button key={f} onClick={() => setFloorFilter(f)} className="text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all" style={{ backgroundColor: floorFilter===f ? PRIMARY : "white", color: floorFilter===f ? "white" : MUTED, borderColor: floorFilter===f ? PRIMARY : BORDER }}>Fl {f}</button>)}
          </div>
          {Object.entries(grouped).filter(([,rooms]) => rooms.length > 0).map(([floor, rooms]) => (
            <div key={floor} className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: MUTED }}>Floor {floor}</div>
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-2">
                {rooms.map(r => {
                  const isNewAssigned = r.id in assigned;
                  const assignedGuest = isNewAssigned ? UNASSIGNED_ARRIVALS.find(a => a.id === assigned[r.id])?.guest : null;
                  const isAvail = r.status === "Available" && !isNewAssigned;
                  const isConflict = conflictRoom === r.id;
                  const canClick = selGuest && !Object.values(assigned).includes(selGuest ?? "");
                  return (
                    <div key={r.id}
                      onClick={() => canClick && handleRoomClick(r)}
                      className="bg-white rounded-xl border overflow-hidden transition-all"
                      style={{ borderColor: isConflict ? ERROR : isNewAssigned ? SUCCESS : isAvail && selGuest ? PRIMARY : BORDER, borderWidth: isNewAssigned || (isAvail && selGuest) || isConflict ? 2 : 1, cursor: canClick ? "pointer" : "default" }}>
                      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: isConflict ? "#FEF2F2" : isNewAssigned ? "#D1FAE5" : isAvail ? "#EFF6FF" : roomStC[r.status]?.bg ?? "#F8FAFC" }}>
                        <span className="text-base font-black" style={{ color: isNewAssigned ? SUCCESS : isConflict ? ERROR : isAvail ? PRIMARY : roomStC[r.status]?.text ?? TEXT }}>{r.id}</span>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: hkDot[r.hkSt] ?? SUBTLE }} title={r.hkSt} />
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-xs font-medium" style={{ color: TEXT }}>{r.type}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{isNewAssigned ? assignedGuest?.split(" ")[0] : r.guest ? r.guest.split(" ")[0] : r.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t flex-wrap" style={{ borderColor: BORDER }}>
            {[["HK: Inspected", SUCCESS], ["HK: Clean", "#22C55E"], ["HK: In Progress", WARNING], ["HK: Maintenance", ERROR]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestProfileDetail({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [tab, setTab] = useState("Profile");
  const TABS = ["Profile", "Stay History", "Preferences", "Folio History", "Requests & Complaints", "Notes"];
  const STAYS = [
    { id: "BK-2849", dates: "24–27 Jun 2025", room: "Suite 501", nights: 3, total: 273375, status: "Confirmed" },
    { id: "BK-2741", dates: "15–18 May 2025", room: "Suite 501", nights: 3, total: 273375, status: "Checked Out" },
    { id: "BK-2630", dates: "8–10 Apr 2025", room: "Suite 502", nights: 2, total: 182250, status: "Checked Out" },
    { id: "BK-2511", dates: "10–12 Mar 2025", room: "Suite 501", nights: 2, total: 182250, status: "Checked Out" },
    { id: "BK-2390", dates: "12–13 Feb 2025", room: "Deluxe 302", nights: 1, total: 55000, status: "Checked Out" },
  ];
  const FOLIO_HIST = [
    { stay: "24–27 Jun 2025", charges: [{ cat: "Room", desc: "Suite 501 × 3 nights", amt: 273375 }, { cat: "Restaurant", desc: "Room Service × 2", amt: 17000 }, { cat: "Bar", desc: "Minibar charges", amt: 8200 }], total: 298575, settled: false },
    { stay: "15–18 May 2025", charges: [{ cat: "Room", desc: "Suite 501 × 3 nights", amt: 273375 }, { cat: "Laundry", desc: "Express laundry × 4", amt: 8000 }], total: 281375, settled: true },
  ];
  const NOTES = [
    { id: 1, author: "Grace Mensah", role: "Hotel Manager", ts: "24 Jun 2025 · 08:30", note: "VIP confirmed for arrival today. Champagne and fruit basket prepared and placed in room. Suite 501 upgraded per standing preference." },
    { id: 2, author: "John Abubakar", role: "Front Desk", ts: "18 May 2025 · 12:15", note: "Guest requested extra towels on check-in. Noted preference for firm pillows. Very pleasant interaction." },
    { id: 3, author: "Fatima Al-Hassan", role: "Reservations", ts: "10 Mar 2025 · 09:00", note: "Corporate account confirmed — monthly visits for board meetings. Invoice to be directed to Bello & Associates Ltd." },
  ];
  return (
    <div>
      <div className="flex items-start gap-4 mb-5 p-5 bg-white rounded-xl border" style={{ borderColor: BORDER }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>CB</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg font-bold" style={{ color: TEXT }}>Dr. Chukwuemeka Bello</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#F5F3FF", color: "#7C3AED" }}>Platinum</span>
            <Star size={14} fill={ORANGE} style={{ color: ORANGE }} />
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#CCFBF1", color: "#0F766E" }}>VIP Guest</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: MUTED }}>
            <span style={{ fontFamily: mono }}>G-002</span>
            <span>15 stays</span>
            <span>₦2,400,000 lifetime value</span>
            <span>Member since March 2020</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <BtnO label="Create Reservation" icon={Plus} />
          <BtnP label="Edit Profile" icon={Edit3} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Stats</div>
            {[["Total Stays", "15"], ["Nights Stayed", "38"], ["Avg Stay", "2.5 nights"], ["Lifetime Value", "₦2.4M"], ["Last Stay", "24 Jun 2025"]].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}><span className="text-xs" style={{ color: MUTED }}>{k}</span><span className="text-xs font-semibold" style={{ color: TEXT }}>{v}</span></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Flags</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between"><span className="text-xs" style={{ color: MUTED }}>VIP</span><Badge label="Platinum" colors={{ bg: "#F5F3FF", text: "#7C3AED" }} /></div>
              <div className="flex items-center justify-between"><span className="text-xs" style={{ color: MUTED }}>Blacklist</span><span className="text-xs font-semibold" style={{ color: SUCCESS }}>Clear</span></div>
              <div className="flex items-center justify-between"><span className="text-xs" style={{ color: MUTED }}>Allergy</span><span className="text-xs font-semibold" style={{ color: ORANGE }}>No shellfish</span></div>
              <div className="flex items-center justify-between"><span className="text-xs" style={{ color: MUTED }}>Marketing</span><span className="text-xs font-semibold" style={{ color: SUCCESS }}>Opted in</span></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex border-b overflow-x-auto" style={{ borderColor: BORDER }}>
            {TABS.map(t => <button key={t} onClick={() => setTab(t)} className="px-4 py-3 text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors" style={{ color: tab === t ? PRIMARY : MUTED, borderBottom: tab === t ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{t}</button>)}
          </div>
          <div className="p-5">
            {tab === "Profile" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[["Full Name", "Dr. Chukwuemeka Bello"], ["Phone", "+234 803 555 6666"], ["Email", "c.bello@example.com"], ["Nationality", "Nigerian"], ["Address", "12 Murtala Mohammed Way, Abuja"], ["Company", "Bello & Associates Ltd."]].map(([k,v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>ID Documents</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["ID Type", "International Passport"], ["ID Number", "A12345678"], ["Issue Date", "Jan 2020"], ["Expiry Date", "Jan 2030"]].map(([k,v]) => (
                      <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT, fontFamily: k === "ID Number" ? mono : undefined }}>{v}</div></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Consent & Marketing</div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: MUTED }}>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: SUCCESS }} />Data consent given (24 Mar 2020)</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: SUCCESS }} />Marketing emails opted in</span>
                  </div>
                </div>
              </div>
            )}
            {tab === "Stay History" && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>All stays — most recent first</div>
                <div className="space-y-2">
                  {STAYS.map(s => (
                    <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F9FAFB] transition-colors" style={{ backgroundColor: "#F9FAFB" }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: TEXT }}>{s.dates}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{s.room} · {s.nights} night{s.nights !== 1 ? "s" : ""} · <span style={{ fontFamily: mono }}>{s.id}</span></div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{s.total.toLocaleString()}</div>
                      <Badge label={s.status} colors={resStC[s.status] ?? { bg: "#F3F4F6", text: "#374151" }} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
                  <span className="text-xs" style={{ color: MUTED }}>Total across all stays</span>
                  <span className="text-base font-black" style={{ color: PRIMARY, fontFamily: mono }}>₦{STAYS.reduce((s,x)=>s+x.total,0).toLocaleString()}</span>
                </div>
              </div>
            )}
            {tab === "Preferences" && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Room & Floor</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["Room Type", "Suite — top floor preferred"], ["Floor", "5th floor or above"], ["Bed Type", "King — firm"], ["Smoking", "Non-smoking only"]].map(([k,v]) => (
                      <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Dietary & Amenities</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["Dietary", "No shellfish (allergy)"], ["Pillow", "Firm × 4"], ["Minibar", "Stocked with whisky"], ["Amenities", "Extra towels, bathrobe"], ["Wake-up Call", "07:30 daily"], ["Newspaper", "The Punch"]].map(([k,v]) => (
                      <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Language & Communication</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["Language", "English"], ["Communication", "Email preferred"], ["Temperature", "20°C room setting"]].map(([k,v]) => (
                      <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: "#F9FAFB" }}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === "Folio History" && (
              <div className="space-y-4">
                {FOLIO_HIST.map((f, fi) => (
                  <div key={fi} className="border rounded-xl overflow-hidden" style={{ borderColor: BORDER }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#F9FAFB" }}>
                      <span className="text-sm font-semibold" style={{ color: TEXT }}>{f.stay}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{f.total.toLocaleString()}</span>
                        <Badge label={f.settled ? "Settled" : "Open"} colors={f.settled ? { bg: "#DCFCE7", text: "#166534" } : { bg: "#FEF3C7", text: "#92400E" }} />
                      </div>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {f.charges.map((c,ci) => (
                          <tr key={ci} className="border-t" style={{ borderColor: BORDER }}>
                            <td className="px-4 py-2 text-xs font-semibold" style={{ color: MUTED }}>{c.cat}</td>
                            <td className="px-4 py-2 text-xs" style={{ color: TEXT }}>{c.desc}</td>
                            <td className="px-4 py-2 text-xs font-bold text-right" style={{ color: TEXT, fontFamily: mono }}>₦{c.amt.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
            {tab === "Requests & Complaints" && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Open Requests</div>
                <div className="space-y-2 mb-5">
                  <div className="p-3 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#EFF6FF" }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: PRIMARY }} />
                    <div className="flex-1"><div className="text-sm font-medium" style={{ color: TEXT }}>Champagne and fruit basket placed in room</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>Submitted: 24 Jun 2025 · Fulfilled by Housekeeping</div></div>
                    <Badge label="Fulfilled" colors={{ bg: "#DCFCE7", text: "#166534" }} />
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Complaints on Record</div>
                <EmptyState icon={CheckCircle2} message="No complaints on record. Excellent guest history." />
              </div>
            )}
            {tab === "Notes" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Internal Notes</div>
                  <button onClick={() => add({ type: "info", title: "Note editor opened" })} className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white hover:opacity-90" style={{ backgroundColor: PRIMARY }}>+ Add Note</button>
                </div>
                <div className="space-y-3">
                  {NOTES.map(n => (
                    <div key={n.id} className="p-4 rounded-xl border" style={{ backgroundColor: "#F9FAFB", borderColor: BORDER }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{n.author.split(" ").map(x=>x[0]).join("")}</div>
                          <div><div className="text-xs font-semibold" style={{ color: TEXT }}>{n.author}</div><div className="text-xs" style={{ color: MUTED }}>{n.role}</div></div>
                        </div>
                        <span className="text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{n.ts}</span>
                      </div>
                      <p className="text-sm" style={{ color: TEXT }}>{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// FD-11 Walk-In Registration

// RT-09 Cash Drawer Reconciliation
export function CashDrawerReconciliation({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const DENOMS = [
    { label: "₦1000", value: 1000 },
    { label: "₦500",  value: 500  },
    { label: "₦200",  value: 200  },
    { label: "₦100",  value: 100  },
    { label: "₦50",   value: 50   },
    { label: "₦20",   value: 20   },
    { label: "₦10",   value: 10   },
    { label: "₦5",    value: 5    },
  ];

  const HISTORY = [
    { id: "SH-2081", date: "13 Oct", operator: "Nkechi A.", float: 50000, sales: 287450, variance: 0,     status: "Balanced" },
    { id: "SH-2080", date: "12 Oct", operator: "Tunde B.", float: 50000, sales: 192300, variance: -2500, status: "Short"    },
    { id: "SH-2079", date: "12 Oct", operator: "Nkechi A.", float: 50000, sales: 341200, variance: 500,  status: "Over"     },
    { id: "SH-2078", date: "11 Oct", operator: "Grace M.", float: 50000, sales: 289900, variance: 0,     status: "Balanced" },
    { id: "SH-2077", date: "11 Oct", operator: "Tunde B.", float: 50000, sales: 156800, variance: -1000, status: "Short"    },
  ];

  const MOVEMENTS = [
    { id: "MV-001", time: "09:15", type: "Sale",    desc: "Table T03 — Jollof + Drinks",    amount: 12500, dir: 1 },
    { id: "MV-002", time: "09:40", type: "Sale",    desc: "Room charge RS-0039 (cash)",     amount: 5200,  dir: 1 },
    { id: "MV-003", time: "10:22", type: "Payout",  desc: "Market run — vegetables",         amount: 8000,  dir: -1 },
    { id: "MV-004", time: "11:05", type: "Sale",    desc: "Walk-in breakfast ×3",            amount: 9600,  dir: 1 },
    { id: "MV-005", time: "12:30", type: "Refund",  desc: "Overcharge correction — T07",    amount: 2000,  dir: -1 },
    { id: "MV-006", time: "13:00", type: "Sale",    desc: "Table T05 — Business lunch",     amount: 34000, dir: 1 },
  ];

  const PRIMARY_ = "#123A73";
  const [phase, setPhase] = useState<"open"|"active"|"close"|"done">("active");
  const [counts, setCounts] = useState<Record<number, string>>(Object.fromEntries(DENOMS.map(d=>[d.value,""])));
  const [varReason, setVarReason] = useState("");
  const [managerPin, setManagerPin] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const float = 50000;
  const expectedSales = MOVEMENTS.filter(m=>m.dir===1).reduce((s,m)=>s+m.amount,0) - MOVEMENTS.filter(m=>m.dir===-1).reduce((s,m)=>s+m.amount,0);
  const expectedTotal = float + expectedSales;

  const countedTotal = DENOMS.reduce((s,d) => s + (parseInt(counts[d.value]||"0",10)||0) * d.value, 0);
  const variance = countedTotal - expectedTotal;

  const confirmClose = () => {
    if (variance !== 0 && !varReason.trim()) { add({ type: "error", title: "Variance reason required" }); return; }
    if (managerPin !== "1234") { add({ type: "error", title: "Invalid manager PIN" }); return; }
    add({ type: "success", title: "Shift closed & reconciled", body: `Variance: ₦${variance.toLocaleString()}` });
    setPhase("done");
  };

  const histColors: Record<string,{bg:string;text:string}> = {
    Balanced: { bg: "#DCFCE7", text: "#166534" },
    Short:    { bg: "#FEE2E2", text: "#991B1B" },
    Over:     { bg: "#FEF3C7", text: "#92400E" },
  };

  return (
    <div>
      <PageHeader title="Cash Drawer Reconciliation" sub="Shift open/close, denomination count, variance, and manager sign-off" actions={
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(p=>!p)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ borderColor: BORDER, color: MUTED }}>{showHistory ? "Live View" : "Shift History"}</button>
          {phase === "done" && <BtnP label="Open New Shift" icon={Plus} onClick={() => { setPhase("active"); setCounts(Object.fromEntries(DENOMS.map(d=>[d.value,""]))); setVarReason(""); setManagerPin(""); }} />}
        </div>
      } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Opening Float" value={`₦${float.toLocaleString()}`} sub="Shift start amount" icon={DollarSign} accent={PRIMARY_} />
        <StatCard label="Net Sales" value={`₦${expectedSales.toLocaleString()}`} sub="Cash movements" icon={TrendingUp} accent={TEAL} />
        <StatCard label="Expected Total" value={`₦${expectedTotal.toLocaleString()}`} sub="Float + sales" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Variance" value={`₦${Math.abs(variance).toLocaleString()}`} sub={variance === 0 ? "Balanced" : variance > 0 ? `Over by ₦${variance.toLocaleString()}` : `Short by ₦${Math.abs(variance).toLocaleString()}`} icon={AlertTriangle} accent={variance === 0 ? SUCCESS : variance > 0 ? ORANGE : ERROR} />
      </div>

      {showHistory ? (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Recent Shift History</h3></div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Shift ID","Date","Operator","Float","Net Sales","Variance","Status"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {HISTORY.map(h => (
                <tr key={h.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{h.id}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{h.date}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{h.operator}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED, fontFamily: mono }}>₦{h.float.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: PRIMARY_, fontFamily: mono }}>₦{h.sales.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: h.variance === 0 ? SUCCESS : h.variance > 0 ? ORANGE : ERROR, fontFamily: mono }}>{h.variance === 0 ? "₦0" : h.variance > 0 ? `+₦${h.variance.toLocaleString()}` : `-₦${Math.abs(h.variance).toLocaleString()}`}</td>
                  <td className="px-4 py-3"><Badge label={h.status} colors={histColors[h.status] ?? { bg: "#F4F4F5", text: MUTED }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {/* Cash movements */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Cash Movements — Current Shift</h3><span className="text-xs" style={{ color: MUTED }}>Operator: Nkechi A.</span></div>
              <table className="w-full">
                <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Time","Type","Description","Amount"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
                <tbody>
                  {MOVEMENTS.map(m => (
                    <tr key={m.id} className="border-t" style={{ borderColor: BORDER }}>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{m.time}</td>
                      <td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: m.type==="Sale" ? "#DCFCE7" : m.type==="Payout" ? "#FEE2E2" : "#FEF3C7", color: m.type==="Sale" ? "#166534" : m.type==="Payout" ? "#991B1B" : "#92400E" }}>{m.type}</span></td>
                      <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{m.desc}</td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: m.dir === 1 ? SUCCESS : ERROR, fontFamily: mono }}>{m.dir === 1 ? "+" : "−"}₦{m.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
                    <td colSpan={3} className="px-4 py-3 text-sm font-bold" style={{ color: TEXT }}>Net Cash (excl. float)</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY_, fontFamily: mono }}>₦{expectedSales.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Denomination count + close */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Denomination Count</h3>
              <div className="space-y-2">
                {DENOMS.map(d => (
                  <div key={d.value} className="flex items-center gap-3">
                    <span className="w-16 text-sm font-semibold" style={{ color: TEXT }}>{d.label}</span>
                    <input type="number" min="0" placeholder="0" value={counts[d.value]} onChange={e=>setCounts(p=>({...p,[d.value]:e.target.value}))} className="flex-1 px-2.5 py-2 rounded-lg border text-sm outline-none text-center" style={{ borderColor: BORDER }} />
                    <span className="w-24 text-sm text-right font-semibold" style={{ color: MUTED, fontFamily: mono }}>= ₦{((parseInt(counts[d.value]||"0",10)||0)*d.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: BORDER }}>
                <div className="flex justify-between text-sm font-bold">
                  <span style={{ color: TEXT }}>Counted Total</span>
                  <span style={{ color: PRIMARY_, fontFamily: mono }}>₦{countedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span style={{ color: MUTED }}>Expected Total</span>
                  <span style={{ color: MUTED, fontFamily: mono }}>₦{expectedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t" style={{ borderColor: BORDER }}>
                  <span style={{ color: TEXT }}>Variance</span>
                  <span style={{ color: variance === 0 ? SUCCESS : variance > 0 ? ORANGE : ERROR, fontFamily: mono }}>{variance === 0 ? "₦0 — Balanced" : variance > 0 ? `+₦${variance.toLocaleString()} over` : `-₦${Math.abs(variance).toLocaleString()} short`}</span>
                </div>
              </div>
            </div>

            {/* Close shift */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Close Shift</h3>
              {variance !== 0 && (
                <div className="mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Variance Reason <span style={{ color: ERROR }}>*</span></label>
                  <textarea value={varReason} onChange={e=>setVarReason(e.target.value)} rows={2} placeholder="Explain the variance…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: variance !== 0 && !varReason.trim() ? ERROR : BORDER }} />
                </div>
              )}
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label>
                <input type="password" maxLength={4} value={managerPin} onChange={e=>setManagerPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} />
              </div>
              {phase === "done" ? (
                <div className="py-3 text-center text-sm font-semibold rounded-xl" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>Shift closed ✓</div>
              ) : (
                <button onClick={confirmClose} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY_ }}>Close & Reconcile Shift</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FIN-NA Night Audit
export function NightAudit({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type AuditStatus = "idle" | "running" | "done" | "error";
  type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

  const STEPS_DEF = [
    { id: "dept-charges",  label: "Post room charges + tax (in-house)",      records: 15 },
    { id: "no-shows",      label: "Process no-shows & post penalties",         records: 1  },
    { id: "pos-close",     label: "Close POS day & reconcile cash drawers",    records: 3  },
    { id: "freeze-rev",    label: "Freeze daily revenue figures",              records: 1  },
    { id: "roll-date",     label: "Roll business date → 15 Oct 2025",          records: 1  },
  ];

  const CHECKLIST_DEF = [
    { id: "deps", label: "All departures settled or rolled",  pass: true  },
    { id: "arrs", label: "All arrivals actioned / no-show",   pass: true  },
    { id: "pos",  label: "POS shifts closed",                 pass: false },
    { id: "chgs", label: "All charges posted to folios",      pass: true  },
    { id: "rooms","label": "No unassigned in-house rooms",     pass: true  },
  ];

  const EXCEPTIONS_DEF = [
    { id: "EX1", desc: "Room 304 — folio balance ₦22,500 unpaid at departure", recommended: "Post to credit card on file", severity: "error" as const },
    { id: "EX2", desc: "POS Terminal shift SH-2082 not closed — Nkechi A.", recommended: "Force-close shift (variance ₦0)", severity: "warning" as const },
    { id: "EX3", desc: "Group block GRP-081 — 2 of 5 rooms not checked in", recommended: "Mark as no-show, apply penalty per policy", severity: "warning" as const },
  ];

  const HISTORY = [
    { id: "NA-2025-10-13", date: "13 Oct 2025", by: "Grace M.", status: "Completed", rooms: 13, rev: 987200, dur: "4m 12s" },
    { id: "NA-2025-10-12", date: "12 Oct 2025", by: "Grace M.", status: "Completed", rooms: 12, rev: 921000, dur: "3m 58s" },
    { id: "NA-2025-10-11", date: "11 Oct 2025", by: "Nkechi A.", status: "Completed", rooms: 14, rev: 1043200, dur: "5m 01s" },
    { id: "NA-2025-10-10", date: "10 Oct 2025", by: "Grace M.", status: "Completed", rooms: 10, rev: 832600, dur: "3m 44s" },
  ];

  const [auditStatus, setAuditStatus] = useState<AuditStatus>("idle");
  const [stepStatuses, setStepStatuses] = useState<Record<string,StepStatus>>(Object.fromEntries(STEPS_DEF.map(s=>[s.id,"pending"])));
  const [exResolved, setExResolved] = useState<Record<string,boolean>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [showRollback, setShowRollback] = useState(false);
  const [rollbackReason, setRollbackReason] = useState("");
  const [rollbackPin, setRollbackPin] = useState("");

  const checklist = CHECKLIST_DEF;
  const allPass = checklist.every(c=>c.pass);

  const runAudit = () => {
    if (!allPass) { add({ type: "error", title: "Pre-audit checklist has failures — resolve before running" }); return; }
    setAuditStatus("running");
    setStepStatuses(Object.fromEntries(STEPS_DEF.map(s=>[s.id,"pending"])));
    STEPS_DEF.forEach((step, i) => {
      setTimeout(() => {
        setStepStatuses(prev => ({ ...prev, [step.id]: "running" }));
        setTimeout(() => {
          setStepStatuses(prev => ({ ...prev, [step.id]: "done" }));
          if (i === STEPS_DEF.length - 1) setAuditStatus("done");
        }, 900);
      }, i * 1500);
    });
  };

  const resolveEx = (id: string) => {
    setExResolved(p=>({...p,[id]:true}));
    add({ type: "success", title: `Exception ${id} resolved` });
  };

  const postRunSummary = { rooms: 15, roomRev: 825000, fbRev: 225000, otherRev: 197800, totalTax: 118698, adr: 55000, revpar: 41250, prevRev: 987200 };

  const stepIcon = (s: StepStatus) => {
    if (s === "done")    return <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: SUCCESS }}>✓</div>;
    if (s === "running") return <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: PRIMARY, borderTopColor: "transparent" }} />;
    if (s === "error")   return <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: ERROR }}>✕</div>;
    return <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: BORDER }} />;
  };

  return (
    <div>
      <PageHeader title="Night Audit" sub={`Business date: 14 Oct 2025 · Last successful run: 13 Oct 2025 23:58`} actions={
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(p=>!p)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ borderColor: BORDER, color: MUTED }}>{showHistory ? "Current Run" : "Audit History"}</button>
          {auditStatus === "done" && <button onClick={() => setShowRollback(true)} className="text-xs px-3 py-2 rounded-xl border font-medium" style={{ borderColor: `${ERROR}40`, color: ERROR }}>Rollback / Reopen</button>}
          {!showHistory && auditStatus !== "done" && <button onClick={runAudit} disabled={auditStatus==="running" || !allPass} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: PRIMARY }}>{auditStatus === "running" ? "Running…" : "Run Night Audit"}</button>}
        </div>
      } />

      {showHistory ? (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Night Audit History</h3></div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Audit ID","Date","Operator","Rooms","Revenue","Duration","Status",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {HISTORY.map(h=>(
                <tr key={h.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{h.id}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{h.date}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{h.by}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{h.rooms}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{h.rev.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{h.dur}</td>
                  <td className="px-4 py-3"><Badge label={h.status} colors={{ bg: "#DCFCE7", text: "#166534" }} /></td>
                  <td className="px-4 py-3"><button onClick={() => add({ type: "info", title: `Drill into ${h.id}` })} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {/* Left: checklist + steps */}
          <div className="col-span-2 space-y-4">
            {/* Pre-audit checklist */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Pre-audit Checklist</h3>
                {!allPass && <span className="text-xs px-2.5 py-1 rounded-xl font-semibold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>Action required</span>}
                {allPass && <span className="text-xs px-2.5 py-1 rounded-xl font-semibold" style={{ backgroundColor: "#DCFCE7", color: SUCCESS }}>All clear</span>}
              </div>
              <div className="space-y-2">
                {checklist.map(c => (
                  <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: c.pass ? "#F0FDF4" : "#FEF2F2" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: c.pass ? SUCCESS : ERROR }}>{c.pass ? "✓" : "!"}</div>
                    <span className="text-sm" style={{ color: c.pass ? "#166534" : "#991B1B" }}>{c.label}</span>
                    {!c.pass && <button onClick={() => add({ type: "info", title: `Navigate to POS Shifts` })} className="ml-auto text-xs px-2.5 py-1 rounded border font-semibold" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Resolve</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit steps */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Audit Steps</h3>
              <div className="space-y-3">
                {STEPS_DEF.map((step, i) => {
                  const s = stepStatuses[step.id];
                  return (
                    <div key={step.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border" style={{ borderColor: s === "done" ? "#BBF7D0" : s === "running" ? `${PRIMARY}40` : BORDER, backgroundColor: s === "done" ? "#F0FDF4" : s === "running" ? "#EFF6FF" : "white" }}>
                      {stepIcon(s)}
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: TEXT }}>Step {i+1} — {step.label}</div>
                        {s === "done" && <div className="text-xs mt-0.5" style={{ color: SUCCESS }}>{step.records} record{step.records !== 1 ? "s" : ""} processed</div>}
                        {s === "running" && <div className="text-xs mt-0.5" style={{ color: PRIMARY }}>Processing…</div>}
                      </div>
                      {s === "done" && <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>Done</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exceptions */}
            {(auditStatus === "running" || auditStatus === "done") && (
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Exceptions</h3>
                  <span className="text-xs" style={{ color: MUTED }}>{EXCEPTIONS_DEF.filter(e=>!exResolved[e.id]).length} unresolved</span>
                </div>
                <div className="space-y-3">
                  {EXCEPTIONS_DEF.map(ex => (
                    <div key={ex.id} className="px-4 py-3 rounded-xl border" style={{ borderColor: exResolved[ex.id] ? "#BBF7D0" : ex.severity === "error" ? `${ERROR}30` : `${ORANGE}30`, backgroundColor: exResolved[ex.id] ? "#F0FDF4" : ex.severity === "error" ? "#FEF2F2" : "#FFFBEB", opacity: exResolved[ex.id] ? 0.7 : 1 }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold mb-1" style={{ color: exResolved[ex.id] ? SUCCESS : ex.severity === "error" ? ERROR : ORANGE }}>{ex.id}</div>
                          <div className="text-sm" style={{ color: TEXT }}>{ex.desc}</div>
                          <div className="text-xs mt-1" style={{ color: MUTED }}>Recommended: {ex.recommended}</div>
                        </div>
                        {!exResolved[ex.id] && <button onClick={() => resolveEx(ex.id)} className="flex-shrink-0 text-xs px-3 py-1.5 rounded border font-semibold" style={{ color: ex.severity==="error"?ERROR:ORANGE, borderColor: ex.severity==="error"?`${ERROR}30`:`${ORANGE}30` }}>Resolve</button>}
                        {exResolved[ex.id] && <span className="text-xs font-semibold" style={{ color: SUCCESS }}>Resolved ✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: post-run summary */}
          <div className="space-y-4">
            {auditStatus === "done" ? (
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: SUCCESS }}>✓</div>
                  <h3 className="text-sm font-semibold" style={{ color: SUCCESS }}>Audit Complete</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  {[
                    ["Rooms occupied",   `${postRunSummary.rooms}`],
                    ["Room revenue",     `₦${postRunSummary.roomRev.toLocaleString()}`],
                    ["F&B revenue",      `₦${postRunSummary.fbRev.toLocaleString()}`],
                    ["Other revenue",    `₦${postRunSummary.otherRev.toLocaleString()}`],
                    ["Total tax",        `₦${postRunSummary.totalTax.toLocaleString()}`],
                    ["ADR",             `₦${postRunSummary.adr.toLocaleString()}`],
                    ["RevPAR",          `₦${postRunSummary.revpar.toLocaleString()}`],
                  ].map(([k,v])=>(
                    <div key={k} className="flex justify-between">
                      <span style={{ color: MUTED }}>{k}</span>
                      <span className="font-semibold" style={{ color: TEXT, fontFamily: mono }}>{v}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2.5 mt-1" style={{ borderColor: BORDER }}>
                    <div className="flex justify-between text-xs"><span style={{ color: MUTED }}>vs prior night</span><span style={{ color: postRunSummary.roomRev+postRunSummary.fbRev+postRunSummary.otherRev >= postRunSummary.prevRev ? SUCCESS : ERROR, fontFamily: mono }}>{((postRunSummary.roomRev+postRunSummary.fbRev+postRunSummary.otherRev-postRunSummary.prevRev)/postRunSummary.prevRev*100).toFixed(1)}%</span></div>
                  </div>
                </div>
                <div className="mt-4 px-3 py-2 rounded-xl text-xs text-center" style={{ backgroundColor: "#F0FDF4", color: "#166534" }}>Business date rolled → 15 Oct 2025</div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-5 text-center" style={{ borderColor: BORDER }}>
                <div className="text-sm font-semibold mb-1" style={{ color: MUTED }}>Post-run summary</div>
                <div className="text-xs" style={{ color: SUBTLE }}>Appears after successful audit run</div>
              </div>
            )}
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Quick Info</h3>
              <div className="space-y-2 text-xs">
                {[["Business date","14 Oct 2025"],["Last audit","13 Oct 23:58"],["Catch-up nights","0"],["Operator","Grace Mensah"]].map(([k,v])=>(
                  <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rollback modal */}
      {showRollback && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowRollback(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Rollback Night Audit</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>This will reverse the date roll and unfreeze revenue. This action is fully audited.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason <span style={{ color: ERROR }}>*</span></label><textarea value={rollbackReason} onChange={e=>setRollbackReason(e.target.value)} rows={2} placeholder="State the reason for rollback…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN <span style={{ color: ERROR }}>*</span></label><input type="password" maxLength={4} value={rollbackPin} onChange={e=>setRollbackPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowRollback(false)} /><button onClick={() => { if (rollbackPin !== "1234" || !rollbackReason.trim()) { add({ type: "error", title: "Invalid PIN or missing reason" }); return; } setAuditStatus("idle"); setStepStatuses(Object.fromEntries(STEPS_DEF.map(s=>[s.id,"pending"]))); setShowRollback(false); add({ type: "warning", title: "Night audit rolled back", body: rollbackReason }); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>Confirm Rollback</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// FIN-TAX Tax Configuration
export function TaxConfiguration({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const TAX_CODES = [
    { id: "VAT", name: "Value Added Tax",     rate: 7.5,  jurisdiction: "Federal", type: "VAT",             categories: ["Room","Restaurant","Events"], inclusive: false, compoundsOn: [], effective: "2020-01-01", active: true  },
    { id: "SVC", name: "Service Charge",      rate: 10,   jurisdiction: "Federal", type: "Service Charge",  categories: ["Room","Restaurant","Bar","Events"], inclusive: false, compoundsOn: [], effective: "2015-01-01", active: true  },
    { id: "CHT", name: "Consumption Tax",     rate: 5,    jurisdiction: "State",   type: "Consumption",     categories: ["Restaurant","Bar","Events"], inclusive: false, compoundsOn: ["SVC"], effective: "2022-06-01", active: false },
    { id: "WHT", name: "Withholding Tax",     rate: 5,    jurisdiction: "Federal", type: "WHT",             categories: ["Corporate Accounts"], inclusive: false, compoundsOn: [], effective: "2020-01-01", active: true  },
    { id: "TLV", name: "Tourism Levy",        rate: 2,    jurisdiction: "Local",   type: "Levy",            categories: ["Room"], inclusive: false, compoundsOn: [], effective: "2023-01-01", active: false },
  ];

  const EXEMPTIONS = [
    { rule: "Diplomatic / Embassy guests",    condition: "Guest type = Diplomatic", exempts: ["VAT","SVC"] },
    { rule: "Corporate account > ₦5M/year",  condition: "Corporate volume tier", exempts: ["CHT"] },
    { rule: "Long-stay > 28 nights",         condition: "LoS ≥ 28", exempts: ["VAT"] },
  ];

  const [activeCodes, setActiveCodes] = useState<Record<string,boolean>>(Object.fromEntries(TAX_CODES.map(t=>[t.id,t.active])));
  const [tab, setTab] = useState<"codes"|"stacking"|"exemptions"|"firs">("codes");
  const [showEdit, setShowEdit] = useState(false);

  const jColors: Record<string,{bg:string;text:string}> = {
    Federal: { bg: "#DBEAFE", text: "#1E40AF" },
    State:   { bg: "#DCFCE7", text: "#166534" },
    Local:   { bg: "#FEF3C7", text: "#92400E" },
  };

  const roomPrice = 50000;
  const svcRate = TAX_CODES.find(t=>t.id==="SVC")!.rate/100;
  const vatRate = TAX_CODES.find(t=>t.id==="VAT")!.rate/100;
  const svcAmt = roomPrice * svcRate;
  const vatBase = roomPrice + svcAmt;
  const vatAmt = vatBase * vatRate;
  const totalEx = roomPrice + svcAmt + vatAmt;

  return (
    <div>
      <PageHeader title="Tax Configuration" sub="Tax codes, computation sequence, exemptions, and FIRS e-invoicing" actions={<BtnP label="Add Tax Code" icon={Plus} onClick={() => setShowEdit(true)} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active Codes" value={String(Object.values(activeCodes).filter(Boolean).length)} sub="Applied to transactions" icon={Layers} accent={PRIMARY} />
        <StatCard label="VAT Rate" value="7.5%" sub="Federal — standard" icon={DollarSign} accent={TEAL} />
        <StatCard label="Service Charge" value="10%" sub="All F&B categories" icon={Activity} accent={ORANGE} />
        <StatCard label="FIRS Status" value="Active" sub="e-Invoicing connected" icon={CheckCircle2} accent={SUCCESS} />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-white border w-fit" style={{ borderColor: BORDER }}>
        {(["codes","stacking","exemptions","firs"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-xs font-semibold capitalize" style={{ backgroundColor: tab===t ? PRIMARY : "transparent", color: tab===t ? "white" : MUTED }}>
            {t === "codes" ? "Tax Codes" : t === "stacking" ? "Computation Sequence" : t === "exemptions" ? "Exemptions" : "FIRS e-Invoicing"}
          </button>
        ))}
      </div>

      {tab === "codes" && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Code","Name","Rate","Jurisdiction","Type","Categories","Inclusive","Compounds On","Effective","Active"].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {TAX_CODES.map(t => (
                <tr key={t.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, opacity: activeCodes[t.id] ? 1 : 0.55 }}>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{t.id}</td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{t.name}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT }}>{t.rate}%</td>
                  <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: jColors[t.jurisdiction].bg, color: jColors[t.jurisdiction].text }}>{t.jurisdiction}</span></td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{t.type}</td>
                  <td className="px-3 py-3 text-xs max-w-28" style={{ color: MUTED }}>{t.categories.join(", ")}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: t.inclusive ? SUCCESS : MUTED }}>{t.inclusive ? "Yes" : "No"}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: t.compoundsOn.length ? ORANGE : SUBTLE }}>{t.compoundsOn.length ? t.compoundsOn.join(", ") : "—"}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{t.effective}</td>
                  <td className="px-3 py-3"><button onClick={() => { setActiveCodes(p=>({...p,[t.id]:!p[t.id]})); add({ type: "info", title: `${t.name} ${activeCodes[t.id]?"deactivated":"activated"}` }); }} className="w-11 h-6 rounded-full relative flex-shrink-0" style={{ backgroundColor: activeCodes[t.id] ? TEAL : "#CBD5E1" }}><div className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow" style={{ left: activeCodes[t.id] ? 22 : 2 }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "stacking" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Computation Sequence</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Taxes apply in this order. Drag to reorder.</p>
            <div className="space-y-2">
              {[{ step: 1, code: "SVC", label: "Service Charge (10%)", base: "Base amount" },{ step: 2, code: "VAT", label: "VAT (7.5%)", base: "Base + Service Charge" }].map(s=>(
                <div key={s.step} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: BORDER }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{s.step}</div>
                  <div className="flex-1"><div className="text-sm font-semibold" style={{ color: TEXT }}>{s.label}</div><div className="text-xs" style={{ color: MUTED }}>Applied to: {s.base}</div></div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>{s.code}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Worked Example</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>₦50,000 room rate</p>
            <div className="space-y-2">
              {[
                { label: "Base room rate",    val: roomPrice,          note: "" },
                { label: "Service Charge 10%", val: svcAmt,            note: `₦${roomPrice.toLocaleString()} × 10%` },
                { label: "Subtotal (base + SVC)", val: vatBase,        note: "", bold: true },
                { label: "VAT 7.5%",          val: vatAmt,             note: `₦${vatBase.toLocaleString()} × 7.5%` },
                { label: "Total payable",     val: totalEx,            note: "", bold: true, accent: true },
              ].map((row,i)=>(
                <div key={i} className={`flex justify-between text-sm py-1.5 ${i < 4 ? "border-b" : ""}`} style={{ borderColor: BORDER }}>
                  <span style={{ color: row.bold ? TEXT : MUTED, fontWeight: row.bold ? 700 : 400 }}>{row.label}{row.note && <span className="text-xs font-normal ml-1.5" style={{ color: SUBTLE }}>({row.note})</span>}</span>
                  <span className="font-semibold" style={{ color: row.accent ? SUCCESS : row.bold ? TEXT : MUTED, fontFamily: mono }}>₦{row.val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "exemptions" && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold" style={{ color: TEXT }}>Exemption Rules</h3><BtnO label="Add Exemption" icon={Plus} onClick={() => add({ type: "info", title: "Add exemption rule" })} /></div>
          <div className="space-y-3">
            {EXEMPTIONS.map((ex,i)=>(
              <div key={i} className="flex items-start justify-between gap-4 px-4 py-4 rounded-xl border" style={{ borderColor: BORDER }}>
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{ex.rule}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{ex.condition}</div>
                  <div className="flex gap-1 mt-2">{ex.exempts.map(e=><span key={e} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>{e} exempt</span>)}</div>
                </div>
                <button onClick={() => add({ type: "info", title: `Edit exemption — ${ex.rule}` })} className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}><Edit3 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "firs" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>FIRS e-Invoicing Settings</h3>
            <div className="space-y-3">
              {[["TIN","1234567-0001"],["Business Name","Grand Palms Hotel Ltd"],["FIRS Endpoint","https://einvoice.firs.gov.ng/api"],["API Key","••••••••••••2D9F"],["Submission Mode","Real-time"]].map(([k,v])=>(
                <div key={k}><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: MUTED }}>{k}</label>
                <div className="px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: BORDER, color: TEXT, fontFamily: k==="API Key"||k==="TIN"?mono:undefined }}>{v}</div></div>
              ))}
              <button onClick={() => add({ type: "success", title: "FIRS connection tested — OK" })} className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Test Connection</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Submission Queue</h3>
            <div className="space-y-2">
              {[{ inv: "INV-2025-0814", status: "Submitted", irn: "IRN-5A2F9C", ts: "14 Oct 11:02" },{ inv: "INV-2025-0815", status: "Submitted", irn: "IRN-6B3D0E", ts: "14 Oct 13:45" },{ inv: "INV-2025-0816", status: "Pending",   irn: "—",          ts: "14 Oct 14:22" },{ inv: "INV-2025-0817", status: "Failed",   irn: "—",          ts: "14 Oct 15:01" }].map(r=>(
                <div key={r.inv} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border" style={{ borderColor: BORDER }}>
                  <div className="flex-1"><div className="text-xs font-semibold" style={{ color: TEXT, fontFamily: mono }}>{r.inv}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{r.ts} · {r.irn}</div></div>
                  <Badge label={r.status} colors={r.status==="Submitted"?{bg:"#DCFCE7",text:"#166534"}:r.status==="Pending"?{bg:"#F1F5F9",text:MUTED}:{bg:"#FEE2E2",text:"#991B1B"}} />
                  {r.status === "Failed" && <button onClick={() => add({ type: "info", title: `Retrying ${r.inv}` })} className="text-xs px-2.5 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Retry</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FIN-RF Refund Processing
export function RefundProcessing({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type RefundStatus = "Requested" | "Approved" | "Processing" | "Completed" | "Failed" | "Rejected";

  const REFUNDS_INIT = [
    { id: "RF-0041", orig: "RES-2031", guest: "Ngozi Dike", room: "303", amount: 85000, penalty: 21250, unpaid: 0, refundable: 63750, method: "Bank Transfer", reason: "Early departure (guest emergency)", status: "Completed" as RefundStatus, approver: "Grace Mensah", gwRef: "GT-PAY-8821X", raisedAt: "12 Oct 14:20", completedAt: "13 Oct 09:00" },
    { id: "RF-0042", orig: "RES-2044", guest: "Emeka Nwosu", room: "507", amount: 120000, penalty: 0, unpaid: 15000, refundable: 105000, method: "Credit Card", reason: "Hotel error — overcharge", status: "Approved" as RefundStatus, approver: "Tunde A.", gwRef: "", raisedAt: "14 Oct 10:15", completedAt: "" },
    { id: "RF-0043", orig: "RES-2048", guest: "Fatima Ibrahim", room: "418", amount: 55000, penalty: 27500, unpaid: 0, refundable: 27500, method: "Bank Transfer", reason: "Cancellation within 24h", status: "Processing" as RefundStatus, approver: "Grace Mensah", gwRef: "GT-PAY-9932A", raisedAt: "14 Oct 11:00", completedAt: "" },
    { id: "RF-0044", orig: "RES-2029", guest: "Bello Abubakar", room: "201", amount: 60000, penalty: 0, unpaid: 8500, refundable: 51500, method: "POS Terminal", reason: "Room quality complaint", status: "Requested" as RefundStatus, approver: "", gwRef: "", raisedAt: "14 Oct 13:40", completedAt: "" },
    { id: "RF-0045", orig: "POS-8821", guest: "Walk-in", room: "—", amount: 12500, penalty: 0, unpaid: 0, refundable: 12500, method: "Cash", reason: "Voided restaurant order", status: "Rejected" as RefundStatus, approver: "Grace Mensah", gwRef: "", raisedAt: "14 Oct 09:30", completedAt: "14 Oct 09:45" },
  ];

  const statusColors: Record<RefundStatus,{bg:string;text:string}> = {
    Requested:  { bg: "#F1F5F9", text: "#475569" },
    Approved:   { bg: "#DBEAFE", text: "#1E40AF" },
    Processing: { bg: "#FEF3C7", text: "#92400E" },
    Completed:  { bg: "#DCFCE7", text: "#166534" },
    Failed:     { bg: "#FEE2E2", text: "#991B1B" },
    Rejected:   { bg: "#F3E8FF", text: "#6B21A8" },
  };

  const [refunds, setRefunds] = useState(REFUNDS_INIT);
  const [selected, setSelected] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState<RefundStatus|"All">("All");
  const [showApprove, setShowApprove] = useState(false);
  const [approverPin, setApproverPin] = useState("");
  const [showNew, setShowNew] = useState(false);

  const approve = (id: string) => {
    if (approverPin !== "1234") { add({ type: "error", title: "Invalid PIN" }); return; }
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: "Approved", approver: "Grace Mensah" } : r));
    add({ type: "success", title: `Refund ${id} approved` });
    setShowApprove(false); setApproverPin("");
  };

  const filtered = statusFilter === "All" ? refunds : refunds.filter(r=>r.status===statusFilter);
  const sel = refunds.find(r=>r.id===selected);
  const totalRefunded = refunds.filter(r=>r.status==="Completed").reduce((s,r)=>s+r.refundable,0);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Refund Processing" sub="Guest refunds — original lookup, penalty deduction, approval gate, and gateway status" actions={<BtnP label="New Refund Request" icon={Plus} onClick={() => setShowNew(true)} />} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Refunded Today" value={`₦${totalRefunded.toLocaleString()}`} sub="Completed" icon={ArrowDownToLine} accent={PRIMARY} />
          <StatCard label="Pending Approval" value={String(refunds.filter(r=>r.status==="Requested").length)} sub="Awaiting sign-off" icon={AlertTriangle} accent={ORANGE} />
          <StatCard label="Processing" value={String(refunds.filter(r=>r.status==="Processing").length)} sub="With payment gateway" icon={Clock} accent={TEAL} />
          <StatCard label="Failed" value={String(refunds.filter(r=>r.status==="Failed").length)} sub="Require retry" icon={AlertTriangle} accent={ERROR} />
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["All","Requested","Approved","Processing","Completed","Failed","Rejected"] as (RefundStatus|"All")[]).map(s=>(
            <button key={s} onClick={() => setStatusFilter(s)} className="text-xs px-3 py-1.5 rounded-xl border font-medium" style={{ backgroundColor: statusFilter===s?PRIMARY:"white", color: statusFilter===s?"white":MUTED, borderColor: statusFilter===s?PRIMARY:BORDER }}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["ID","Original","Guest","Paid","Penalty","Unpaid","Refundable","Method","Status","Approver",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(r=>(
                <tr key={r.id} onClick={() => setSelected(r.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selected===r.id?"#EFF6FF":undefined }}>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{r.orig}</td>
                  <td className="px-3 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</div><div className="text-xs" style={{ color: SUBTLE }}>Rm {r.room}</div></td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: MUTED, fontFamily: mono }}>₦{r.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: r.penalty>0?ERROR:SUBTLE, fontFamily: mono }}>{r.penalty>0?`−₦${r.penalty.toLocaleString()}`:"—"}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: r.unpaid>0?ORANGE:SUBTLE, fontFamily: mono }}>{r.unpaid>0?`−₦${r.unpaid.toLocaleString()}`:"—"}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{r.refundable.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{r.method}</td>
                  <td className="px-3 py-3"><Badge label={r.status} colors={statusColors[r.status]} /></td>
                  <td className="px-3 py-3 text-xs" style={{ color: r.approver?TEXT:SUBTLE }}>{r.approver||"—"}</td>
                  <td className="px-3 py-3" onClick={e=>e.stopPropagation()}>
                    {r.status === "Requested" && <button onClick={() => { setSelected(r.id); setShowApprove(true); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Approve</button>}
                    {r.status === "Failed" && <button onClick={() => { setRefunds(prev=>prev.map(x=>x.id===r.id?{...x,status:"Processing"}:x)); add({ type:"info", title:`Retrying ${r.id}` }); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Retry</button>}
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
          <div className="flex items-start justify-between mb-4"><div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</div><div className="text-xs mt-0.5" style={{ color: TEAL }}>{sel.orig}</div></div><button onClick={() => setSelected(null)} style={{ color: MUTED }}>✕</button></div>
          <div className="space-y-2 text-sm mb-4">
            {[["Guest", sel.guest],["Room", sel.room],["Original paid", `₦${sel.amount.toLocaleString()}`],["Cancellation penalty", sel.penalty>0?`−₦${sel.penalty.toLocaleString()}`:"₦0"],["Unpaid charges", sel.unpaid>0?`−₦${sel.unpaid.toLocaleString()}`:"₦0"],["Refundable", `₦${sel.refundable.toLocaleString()}`],["Method", sel.method],["Reason", sel.reason],["Raised", sel.raisedAt]].map(([k,v])=>(
              <div key={String(k)} className="flex justify-between gap-2"><span style={{ color: MUTED, flexShrink: 0 }}>{k}</span><span className="text-right font-semibold" style={{ color: TEXT, fontFamily: ["Original paid","Cancellation penalty","Unpaid charges","Refundable"].includes(String(k))?mono:undefined }}>{v}</span></div>
            ))}
            <div className="flex justify-between items-center"><span style={{ color: MUTED }}>Status</span><Badge label={sel.status} colors={statusColors[sel.status]} /></div>
            {sel.gwRef && <div className="flex justify-between"><span style={{ color: MUTED }}>GW Ref</span><span className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{sel.gwRef}</span></div>}
          </div>
          {/* Audit trail */}
          <div className="border-t pt-3 mt-2" style={{ borderColor: BORDER }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Audit Trail</div>
            <div className="space-y-1.5 text-xs" style={{ color: MUTED }}>
              <div><span style={{ fontFamily: mono }}>{sel.raisedAt}</span> — Request raised</div>
              {sel.approver && <div><span style={{ fontFamily: mono }}>{sel.completedAt||"Pending"}</span> — {sel.status === "Completed" ? "Processed" : `Approved by ${sel.approver}`}</div>}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {sel.status === "Requested" && <button onClick={() => setShowApprove(true)} className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Approve Refund</button>}
            {sel.status === "Requested" && <button onClick={() => { setRefunds(prev=>prev.map(r=>r.id===sel.id?{...r,status:"Rejected",approver:"Grace Mensah"}:r)); setSelected(null); add({ type:"warning", title:`Refund ${sel.id} rejected` }); }} className="w-full py-2 rounded-xl text-sm font-semibold border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Reject</button>}
          </div>
        </div>
      )}

      {/* Approve modal */}
      {showApprove && selected && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowApprove(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Approve Refund {selected}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Refundable: ₦{refunds.find(r=>r.id===selected)?.refundable.toLocaleString()}. Manager PIN required.</p>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" maxLength={4} value={approverPin} onChange={e=>setApproverPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowApprove(false)} /><button onClick={() => approve(selected)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Approve</button></div>
          </div>
        </>
      )}
    </div>
  );
}

// FIN-VR Folio Void & Reversal
export function FolioVoidReversal({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const VOID_REASONS = ["Data entry error","Double posting","Guest request","System error","Manager override","Fraud investigation","Test transaction"];

  const REVERSAL_HISTORY = [
    { id: "VR-1041", date: "14 Oct 14:22", type: "Partial Reversal", operator: "Grace M.", charge: "CH-5042", folio: "FO-2848", orig: 3600, reversed: 1800, reason: "Minibar — quantity correction", auth: "Grace M.", pin: "••••" },
    { id: "VR-1040", date: "14 Oct 11:05", type: "Full Void",         operator: "Nkechi A.", charge: "CH-5047", folio: "FO-2848", orig: 4500, reversed: 4500, reason: "Double-posted in error", auth: "Grace M.", pin: "••••" },
    { id: "VR-1039", date: "13 Oct 22:40", type: "Full Void",         operator: "Tunde B.", charge: "CH-4998", folio: "FO-2831", orig: 8000, reversed: 8000, reason: "Guest request — disputed", auth: "Grace M.", pin: "••••" },
    { id: "VR-1038", date: "13 Oct 19:15", type: "Partial Reversal",  operator: "Grace M.", charge: "CH-4991", folio: "FO-2820", orig: 22500, reversed: 10000, reason: "Rate negotiation — manager agreed discount", auth: "Grace M.", pin: "••••" },
    { id: "VR-1037", date: "12 Oct 08:30", type: "Full Void",         operator: "Grace M.", charge: "CH-4950", folio: "FO-2801", orig: 6800, reversed: 6800, reason: "Test transaction", auth: "Grace M.", pin: "••••" },
  ];

  const SAMPLE_CHARGES = [
    { id: "CH-5041", folio: "FO-2848", room: "202", guest: "Emmanuel Adeyemi", cat: "Restaurant", desc: "Room Service RS-0041", amount: 8500, status: "Posted" },
    { id: "CH-5043", folio: "FO-2849", room: "501", guest: "Dr. Chukwuemeka Bello", cat: "Restaurant", desc: "Welcome champagne", amount: 15000, status: "Posted" },
    { id: "CH-5046", folio: "FO-2852", room: "311", guest: "Bello Abubakar", cat: "Spa", desc: "Spa session — 60 min massage", amount: 18000, status: "Pending" },
  ];

  const [tab, setTab] = useState<"void"|"history">("void");
  const [selectedCharge, setSelectedCharge] = useState(SAMPLE_CHARGES[0]);
  const [voidType, setVoidType] = useState<"full"|"partial">("full");
  const [partialAmt, setPartialAmt] = useState("");
  const [reason, setReason] = useState("");
  const [reasonFree, setReasonFree] = useState("");
  const [ackText, setAckText] = useState("");
  const [managerPin, setManagerPin] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reversalAmount = voidType === "full" ? selectedCharge.amount : (parseFloat(partialAmt)||0);
  const resultingBalance = selectedCharge.amount - reversalAmount;
  const ackRequired = `VOID ${selectedCharge.id}`;
  const canSubmit = reason && (reasonFree || reason !== "Manager override") && ackText === ackRequired && managerPin === "1234";

  const submit = () => {
    if (!canSubmit) return;
    add({ type: "success", title: `${voidType === "full" ? "Void" : "Reversal"} applied — ${selectedCharge.id}`, body: `₦${reversalAmount.toLocaleString()} reversed · ${reason}` });
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader title="Folio Void & Reversal" sub="Void or partially reverse posted charges. All actions are audited." />
      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-white border w-fit" style={{ borderColor: BORDER }}>
        {(["void","history"] as const).map(t=>(
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-xs font-semibold capitalize" style={{ backgroundColor: tab===t?PRIMARY:"transparent", color: tab===t?"white":MUTED }}>
            {t === "void" ? "New Void / Reversal" : "Reversal History"}
          </button>
        ))}
      </div>

      {tab === "history" ? (
        <div>
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: `1px solid #FDE68A` }}>
            <AlertTriangle size={15} style={{ color: ORANGE }} />
            <span className="text-xs" style={{ color: "#92400E" }}>This is the fraud-detection view. All reversals are immutable and cannot be deleted.</span>
          </div>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Reversal ID","Date/Time","Type","Charge","Folio","Original","Reversed","Reason","Operator","Auth. By"].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {REVERSAL_HISTORY.map(r=>(
                  <tr key={r.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>{r.id}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.date}</td>
                    <td className="px-3 py-3"><Badge label={r.type} colors={r.type==="Full Void"?{bg:"#FEE2E2",text:"#991B1B"}:{bg:"#FEF3C7",text:"#92400E"}} /></td>
                    <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{r.charge}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.folio}</td>
                    <td className="px-3 py-3 text-sm" style={{ color: MUTED, fontFamily: mono, textDecoration: "line-through" }}>₦{r.orig.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: ERROR, fontFamily: mono }}>₦{r.reversed.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs max-w-40 truncate" style={{ color: MUTED }}>{r.reason}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: TEXT }}>{r.operator}</td>
                    <td className="px-3 py-3 text-xs font-semibold" style={{ color: TEXT }}>{r.auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {/* Left: charge selector */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>Select Charge</h3>
              <div className="space-y-2">
                {SAMPLE_CHARGES.map(c=>(
                  <div key={c.id} onClick={() => { setSelectedCharge(c); setSubmitted(false); setAckText(""); setManagerPin(""); }} className="px-4 py-3 rounded-xl border cursor-pointer transition-colors" style={{ borderColor: selectedCharge.id===c.id?PRIMARY:BORDER, backgroundColor: selectedCharge.id===c.id?"#EFF6FF":"white" }}>
                    <div className="flex items-center justify-between"><span className="text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{c.id}</span><span className="text-xs" style={{ color: TEAL }}>{c.folio}</span></div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{c.desc}</div>
                    <div className="flex items-center justify-between mt-1"><span className="text-xs" style={{ color: MUTED }}>Rm {c.room} — {c.guest}</span><span className="text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{c.amount.toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charge detail */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Charge Detail — {selectedCharge.id}</h3>
              <div className="space-y-1.5 text-sm">
                {[["Description",selectedCharge.desc],["Category",selectedCharge.cat],["Room / Guest",`${selectedCharge.room} — ${selectedCharge.guest}`],["Folio",selectedCharge.folio],["Amount",`₦${selectedCharge.amount.toLocaleString()}`],["Status",selectedCharge.status]].map(([k,v])=>(
                  <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT, fontFamily: k==="Amount"||k==="Folio"?mono:undefined }}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: void form */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3" style={{ backgroundColor: SUCCESS }}>✓</div>
                <div className="text-sm font-bold mb-1" style={{ color: TEXT }}>Reversal applied</div>
                <div className="text-xs" style={{ color: MUTED }}>₦{reversalAmount.toLocaleString()} reversed from {selectedCharge.id}</div>
                <button onClick={() => { setSubmitted(false); setAckText(""); setManagerPin(""); setReason(""); setReasonFree(""); setVoidType("full"); }} className="mt-4 text-xs px-4 py-2 rounded-xl border" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>New Void / Reversal</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Void / Reversal Form</h3>

                {/* Type */}
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: MUTED }}>Reversal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["full","partial"] as const).map(t=>(
                    <button key={t} onClick={() => setVoidType(t)} className="py-2.5 rounded-xl border text-sm font-semibold" style={{ backgroundColor: voidType===t?PRIMARY:"white", color: voidType===t?"white":MUTED, borderColor: voidType===t?PRIMARY:BORDER }}>
                      {t === "full" ? "Full Void" : "Partial Reversal"}
                    </button>
                  ))}
                </div></div>

                {/* Partial amount */}
                {voidType === "partial" && (
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reversal Amount (₦)</label>
                  <input type="number" max={selectedCharge.amount} value={partialAmt} onChange={e=>setPartialAmt(e.target.value)} placeholder={`Max ₦${selectedCharge.amount.toLocaleString()}`} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                )}

                {/* Reason */}
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reason</label>
                <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none mb-2" style={{ borderColor: BORDER }}>
                  <option value="">Select reason…</option>
                  {VOID_REASONS.map(r=><option key={r}>{r}</option>)}
                </select>
                <input value={reasonFree} onChange={e=>setReasonFree(e.target.value)} placeholder="Additional notes…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>

                {/* Balance preview */}
                <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Balance Preview</div>
                  <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Original</span><span style={{ fontFamily: mono }}>₦{selectedCharge.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Reversal</span><span style={{ color: ERROR, fontFamily: mono }}>−₦{reversalAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm font-bold border-t mt-1.5 pt-1.5" style={{ borderColor: BORDER }}><span style={{ color: TEXT }}>Result</span><span style={{ color: resultingBalance===0?SUCCESS:PRIMARY, fontFamily: mono }}>₦{resultingBalance.toLocaleString()}</span></div>
                </div>

                {/* Typed acknowledgement */}
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Type to confirm: <span style={{ fontFamily: mono }}>{ackRequired}</span></label>
                <input value={ackText} onChange={e=>setAckText(e.target.value)} placeholder={ackRequired} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: ackText && ackText !== ackRequired ? ERROR : BORDER, fontFamily: mono }} /></div>

                {/* Manager PIN */}
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label>
                <input type="password" maxLength={4} value={managerPin} onChange={e=>setManagerPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>

                <button onClick={submit} disabled={!canSubmit} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Apply {voidType === "full" ? "Full Void" : "Partial Reversal"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AccountingExport({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const GL_MAPPING = [
    { code:"4001", name:"Room Revenue",          glAcc:"410-001", dept:"Rooms", costCenter:"RMS",  active:true  },
    { code:"4002", name:"Restaurant Revenue",    glAcc:"410-002", dept:"F&B",   costCenter:"FBR",  active:true  },
    { code:"4003", name:"Bar Revenue",           glAcc:"410-003", dept:"F&B",   costCenter:"FBR",  active:true  },
    { code:"4004", name:"Events Revenue",        glAcc:"410-004", dept:"Banq",  costCenter:"EVT",  active:true  },
    { code:"4005", name:"Spa Revenue",           glAcc:"410-005", dept:"Spa",   costCenter:"SPA",  active:true  },
    { code:"2001", name:"Accounts Receivable",   glAcc:"120-001", dept:"Fin",   costCenter:"FIN",  active:true  },
    { code:"2002", name:"Accounts Payable",      glAcc:"200-001", dept:"Fin",   costCenter:"FIN",  active:true  },
    { code:"2003", name:"VAT Payable",           glAcc:"231-001", dept:"Fin",   costCenter:"FIN",  active:true  },
    { code:"2004", name:"Service Charge Payable",glAcc:"232-001", dept:"Fin",   costCenter:"FIN",  active:false },
    { code:"3001", name:"Discount Expense",      glAcc:"620-001", dept:"Mktg",  costCenter:"MKT",  active:true  },
  ];

  const JOURNAL_PREVIEW = [
    { date:"14 Oct", ref:"JNL-20251014-001", desc:"Room Revenue — Check-out FO-2848", account:"410-001", dr:456800, cr:0       },
    { date:"14 Oct", ref:"JNL-20251014-001", desc:"Room Revenue — Check-out FO-2848", account:"120-001", dr:0,      cr:456800  },
    { date:"14 Oct", ref:"JNL-20251014-002", desc:"VAT on FO-2848",                   account:"120-001", dr:80370,  cr:0       },
    { date:"14 Oct", ref:"JNL-20251014-002", desc:"VAT on FO-2848",                   account:"231-001", dr:0,      cr:80370   },
    { date:"14 Oct", ref:"JNL-20251014-003", desc:"Cash Receipt — RCT-0381",          account:"110-001", dr:537170, cr:0       },
    { date:"14 Oct", ref:"JNL-20251014-003", desc:"Cash Receipt — RCT-0381",          account:"120-001", dr:0,      cr:537170  },
  ];

  const EXPORT_HISTORY = [
    { id:"EXP-0041", date:"13 Oct 23:58", period:"13 Oct 2025", format:"Sage 50", entries:128, user:"Emeka Obi",    status:"Success" },
    { id:"EXP-0040", date:"12 Oct 23:59", period:"12 Oct 2025", format:"Sage 50", entries:115, user:"Emeka Obi",    status:"Success" },
    { id:"EXP-0039", date:"11 Oct 22:01", period:"11 Oct 2025", format:"CSV",     entries:98,  user:"Night Audit",  status:"Success" },
    { id:"EXP-0038", date:"10 Oct 23:59", period:"10 Oct 2025", format:"Sage 50", entries:131, user:"Emeka Obi",    status:"Failed"  },
  ];

  const VALIDATION = [
    { type:"ok",      msg:"Night Audit completed for 14 Oct" },
    { type:"ok",      msg:"Journal entries balanced — ₦0 variance" },
    { type:"warning", msg:"2 AP invoices pending approval — may be excluded" },
    { type:"ok",      msg:"All GL codes mapped" },
  ];

  const [tab, setTab]       = useState<"export"|"mapping"|"history">("export");
  const [format, setFormat] = useState("Sage 50");
  const [period, setPeriod] = useState("14 Oct 2025");
  const [mapping, setMapping] = useState(GL_MAPPING);
  const [exporting, setExporting] = useState(false);

  const totalDr = JOURNAL_PREVIEW.reduce((s,j)=>s+j.dr,0);
  const totalCr = JOURNAL_PREVIEW.reduce((s,j)=>s+j.cr,0);
  const balanced = totalDr === totalCr;

  const runExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      add({ type:"success", title:`Export complete — ${format}`, body:`${JOURNAL_PREVIEW.length} journal entries for ${period}` });
    }, 1800);
  };

  return (
    <div>
      <PageHeader title="Accounting Export" sub="GL mapping · journal preview · balanced-entry check · export history" actions={
        <div className="flex gap-2">
          <BtnO label="Download Template" icon={Download} onClick={() => add({ type:"info", title:"GL template downloading" })} />
        </div>
      } />

      <div className="flex items-center gap-1 p-1 rounded-xl bg-white border w-fit mb-5" style={{ borderColor: BORDER }}>
        {(["export","mapping","history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-xl text-xs font-semibold capitalize" style={{ backgroundColor: tab===t?PRIMARY:"transparent", color: tab===t?"white":MUTED }}>
            {t==="export"?"Export & Preview":t==="mapping"?"GL Mapping":"Export History"}
          </button>
        ))}
      </div>

      {tab === "export" && (
        <div className="grid grid-cols-3 gap-5">
          {/* Config & validation */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: MUTED }}>Export Settings</h3>
              <div className="space-y-3">
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Period</label>
                  <input value={period} onChange={e=>setPeriod(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} />
                </div>
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Export Format</label>
                  <select value={format} onChange={e=>setFormat(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: BORDER }}>
                    {["Sage 50","QuickBooks IIF","CSV (Generic)","Excel","IFRS XML"].map(f=><option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Validation</h3>
              <div className="space-y-2">
                {VALIDATION.map((v,i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span style={{ color: v.type==="ok"?SUCCESS:v.type==="warning"?WARNING:ERROR }}>{v.type==="ok"?"✓":"⚠"}</span>
                    <span style={{ color: v.type==="warning"?WARNING:TEXT }}>{v.msg}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2`} style={{ backgroundColor: balanced?"#F0FDF4":"#FEF2F2", color: balanced?SUCCESS:ERROR }}>
                {balanced ? "✓ Journal balanced — safe to export" : "✗ Journal out of balance — cannot export"}
              </div>
            </div>
            <button onClick={runExport} disabled={!balanced||exporting} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>
              {exporting ? "Exporting…" : `Export to ${format}`}
            </button>
          </div>

          {/* Journal preview */}
          <div className="col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Journal Preview — {period}</h3>
              <span className="text-xs px-2.5 py-1 rounded-xl font-semibold" style={{ backgroundColor: balanced?"#DCFCE7":"#FEE2E2", color: balanced?SUCCESS:ERROR }}>
                {balanced?"Balanced":"Out of Balance"}
              </span>
            </div>
            <table className="w-full">
              <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Date","Reference","Description","Account","Debit","Credit"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {JOURNAL_PREVIEW.map((j,i) => (
                  <tr key={i} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-2.5 text-xs" style={{ color: MUTED }}>{j.date}</td>
                    <td className="px-4 py-2.5 text-xs font-bold" style={{ color: TEAL, fontFamily: mono }}>{j.ref}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: TEXT }}>{j.desc}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: PRIMARY, fontFamily: mono }}>{j.account}</td>
                    <td className="px-4 py-2.5 text-sm" style={{ color: j.dr>0?TEXT:SUBTLE, fontFamily: mono }}>{j.dr>0?`₦${j.dr.toLocaleString()}`:"—"}</td>
                    <td className="px-4 py-2.5 text-sm" style={{ color: j.cr>0?TEXT:SUBTLE, fontFamily: mono }}>{j.cr>0?`₦${j.cr.toLocaleString()}`:"—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: BORDER, backgroundColor:"#F9FAFB" }}>
                  <td colSpan={4} className="px-4 py-3 text-xs font-bold" style={{ color: TEXT }}>Totals</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{totalDr.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{totalCr.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {tab === "mapping" && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>GL Account Mapping</h3>
            <BtnO label="Save Mapping" icon={Download} onClick={() => add({ type:"success", title:"GL mapping saved" })} />
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Income Code","Description","GL Account","Dept","Cost Center","Active"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {mapping.map((m,i) => (
                <tr key={i} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{m.code}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{m.name}</td>
                  <td className="px-4 py-3"><input value={m.glAcc} onChange={e=>setMapping(prev=>prev.map((x,j)=>j===i?{...x,glAcc:e.target.value}:x))} className="px-2 py-1 rounded-lg border text-xs outline-none w-24" style={{ borderColor: BORDER, fontFamily: mono }} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{m.dept}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: TEAL, fontFamily: mono }}>{m.costCenter}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setMapping(prev=>prev.map((x,j)=>j===i?{...x,active:!x.active}:x))} className="text-xs px-2.5 py-1 rounded-xl font-semibold" style={{ backgroundColor: m.active?"#DCFCE7":"#F1F5F9", color: m.active?SUCCESS:MUTED }}>{m.active?"Active":"Inactive"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "history" && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold" style={{ color: TEXT }}>Export History</h3>
          </div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["Export ID","Date","Period","Format","Entries","Exported By","Status",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {EXPORT_HISTORY.map(h => (
                <tr key={h.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{h.id}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{h.date}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{h.period}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{h.format}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{h.entries}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: TEXT }}>{h.user}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: h.status==="Success"?"#DCFCE7":"#FEE2E2", color: h.status==="Success"?SUCCESS:ERROR }}>{h.status}</span></td>
                  <td className="px-4 py-3"><button onClick={() => add({ type:"info", title:`Re-downloading ${h.id}` })} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>{h.status==="Failed"?"Retry":"Download"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CreditNotes({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type CNStatus = "Draft"|"Pending Approval"|"Approved"|"Issued"|"Applied"|"Void";

  const CN_INIT = [
    { id:"CN-2025-0024", num:24, invRef:"INV-2025-0810", guest:"Adaeze Nwosu",    type:"Partial" as "Full"|"Partial", amount:45000,  reason:"Early Departure Adjustment", approver:"", status:"Issued" as CNStatus,           issuedDate:"10 Oct", applied:"10 Oct", notes:"Guest checked out 1 night early" },
    { id:"CN-2025-0023", num:23, invRef:"INV-2025-0805", guest:"Corp — MTN Ltd",  type:"Full" as "Full"|"Partial",    amount:186000, reason:"Billing Error — Rate Mismatch", approver:"", status:"Approved" as CNStatus,         issuedDate:"08 Oct", applied:"",       notes:"Corporate rate not applied at check-in" },
    { id:"CN-2025-0022", num:22, invRef:"INV-2025-0798", guest:"Kingsley Okafor", type:"Partial" as "Full"|"Partial", amount:25000,  reason:"Service Complaint Compensation", approver:"", status:"Pending Approval" as CNStatus, issuedDate:"06 Oct", applied:"",       notes:"AC malfunction room 312 — 2 nights" },
  ];

  const stColors: Record<CNStatus,{bg:string;text:string}> = {
    "Draft":            { bg:"#F1F5F9", text:"#475569" },
    "Pending Approval": { bg:"#DBEAFE", text:"#1E40AF" },
    "Approved":         { bg:"#DCFCE7", text:"#166534" },
    "Issued":           { bg:"#EDE9FE", text:"#5B21B6" },
    "Applied":          { bg:"#F0FDF4", text:"#166534" },
    "Void":             { bg:"#F3F4F6", text:"#6B7280" },
  };

  const REASONS = ["Early Departure Adjustment","Billing Error — Rate Mismatch","Service Complaint Compensation","Overbilling","Duplicate Charge","Management Goodwill","Rate Correction","Other"];

  const [cns, setCns]           = useState(CN_INIT);
  const [selected, setSelected] = useState<string|null>(null);
  const [showNew, setShowNew]   = useState(false);
  const [showApprove, setShowApprove] = useState<string|null>(null);
  const [approvePin, setApprovePin]   = useState("");

  // New CN form state
  const [newInvRef, setNewInvRef]   = useState("");
  const [newGuest, setNewGuest]     = useState("");
  const [newType, setNewType]       = useState<"Full"|"Partial">("Partial");
  const [newAmt, setNewAmt]         = useState("");
  const [newReason, setNewReason]   = useState(REASONS[0]);
  const [newNotes, setNewNotes]     = useState("");

  const nextNum = Math.max(...cns.map(c=>c.num)) + 1;

  const issueCN = () => {
    const id = `CN-2025-${String(nextNum).padStart(4,"0")}`;
    setCns(prev => [{
      id, num:nextNum, invRef:newInvRef, guest:newGuest, type:newType,
      amount:parseFloat(newAmt)||0, reason:newReason, approver:"",
      status:"Pending Approval" as CNStatus, issuedDate:"14 Oct", applied:"", notes:newNotes
    }, ...prev]);
    add({ type:"success", title:`Credit Note ${id} created`, body:`Pending approval for ₦${parseFloat(newAmt||"0").toLocaleString()}` });
    setShowNew(false); setNewInvRef(""); setNewGuest(""); setNewAmt(""); setNewNotes("");
  };

  const approveCN = (id: string) => {
    if (approvePin !== "1234") { add({ type:"error", title:"Invalid PIN" }); return; }
    setCns(prev => prev.map(c => c.id===id ? { ...c, status:"Approved" as CNStatus, approver:"Mgr. Adeyemi" } : c));
    add({ type:"success", title:`${id} approved` });
    setShowApprove(null); setApprovePin("");
  };

  const sel = cns.find(c=>c.id===selected);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Credit Notes" sub="Gapless CN numbering · approval workflow · apply to invoice" actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting credit notes" })} />
            <BtnP label="Issue Credit Note" icon={Plus} onClick={() => setShowNew(true)} />
          </div>
        } />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total CNs Issued"  value={`${cns.length}`}                                           sub="All time"             icon={FileText}    accent={PRIMARY} />
          <StatCard label="Total CN Value"     value={`₦${cns.reduce((s,c)=>s+c.amount,0).toLocaleString()}`}  sub="All CNs"              icon={TrendingDown} accent={ERROR}   />
          <StatCard label="Pending Approval"   value={`${cns.filter(c=>c.status==="Pending Approval").length}`} sub="Awaiting manager"     icon={AlertCircle}  accent={WARNING} />
          <StatCard label="Next CN #"          value={`CN-2025-${String(nextNum).padStart(4,"0")}`}             sub="Gapless sequence"     icon={Hash}         accent={TEAL}    />
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["CN #","Invoice Ref","Guest","Type","Amount","Reason","Issued","Status",""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {cns.map(cn => (
                <tr key={cn.id} onClick={() => setSelected(cn.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer" style={{ borderColor: BORDER, backgroundColor: selected===cn.id?"#EFF6FF":undefined }}>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{cn.id}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{cn.invRef}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: TEXT }}>{cn.guest}</td>
                  <td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: cn.type==="Full"?"#FEE2E2":"#DBEAFE", color: cn.type==="Full"?ERROR:"#1E40AF" }}>{cn.type}</span></td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: ERROR, fontFamily: mono }}>−₦{cn.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs max-w-[160px] truncate" style={{ color: MUTED }}>{cn.reason}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{cn.issuedDate}</td>
                  <td className="px-4 py-3"><Badge label={cn.status} colors={stColors[cn.status]} /></td>
                  <td className="px-4 py-3" onClick={e=>e.stopPropagation()}>
                    <div className="flex gap-1">
                      {cn.status==="Pending Approval" && <button onClick={() => setShowApprove(cn.id)} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>Approve</button>}
                      {cn.status==="Approved" && <button onClick={() => { setCns(prev=>prev.map(c=>c.id===cn.id?{...c,status:"Issued" as CNStatus}:c)); add({ type:"success", title:`${cn.id} issued` }); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Issue</button>}
                      {cn.status==="Issued" && <button onClick={() => { setCns(prev=>prev.map(c=>c.id===cn.id?{...c,status:"Applied" as CNStatus,applied:"14 Oct"}:c)); add({ type:"success", title:`${cn.id} applied to ${cn.invRef}` }); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Apply</button>}
                      <button onClick={() => add({ type:"info", title:`Print ${cn.id}` })} className="text-xs px-2 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Print</button>
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
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</div><div className="text-xs mt-0.5" style={{ color: ERROR }}>−₦{sel.amount.toLocaleString()}</div></div>
            <button onClick={() => setSelected(null)} style={{ color: MUTED }}>✕</button>
          </div>
          <div className="space-y-2 text-sm mb-4">
            {([["Invoice",sel.invRef],["Guest",sel.guest],["Type",sel.type],["Reason",sel.reason],["Issued",sel.issuedDate],sel.applied?["Applied",sel.applied]:null,sel.approver?["Approver",sel.approver]:null,["Notes",sel.notes]] as ([string,string]|null)[]).filter(Boolean).map(([k,v]) => (
              <div key={k}><div className="text-xs" style={{ color: MUTED }}>{k}</div><div className="text-sm font-medium mt-0.5" style={{ color: TEXT }}>{v}</div></div>
            ))}
          </div>
          <Badge label={sel.status} colors={stColors[sel.status]} />
        </div>
      )}

      {/* New CN modal */}
      {showNew && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={() => setShowNew(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Issue Credit Note — {`CN-2025-${String(nextNum).padStart(4,"0")}`}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Invoice Reference</label><input value={newInvRef} onChange={e=>setNewInvRef(e.target.value)} placeholder="INV-2025-XXXX" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Guest / Company</label><input value={newGuest} onChange={e=>setNewGuest(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Type</label>
                  <div className="flex gap-2">
                    {(["Full","Partial"] as const).map(t => <button key={t} onClick={() => setNewType(t)} className="flex-1 py-2 rounded-xl border text-xs font-semibold" style={{ backgroundColor: newType===t?PRIMARY:"white", color: newType===t?"white":MUTED, borderColor: newType===t?PRIMARY:BORDER }}>{t}</button>)}
                  </div>
                </div>
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Amount (₦)</label><input type="number" value={newAmt} onChange={e=>setNewAmt(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
              </div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Reason</label>
                <select value={newReason} onChange={e=>setNewReason(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: BORDER }}>
                  {REASONS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>Notes</label><textarea value={newNotes} onChange={e=>setNewNotes(e.target.value)} rows={2} placeholder="Additional context…" className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <BtnO label="Cancel" onClick={() => setShowNew(false)} />
              <button onClick={issueCN} disabled={!newInvRef||!newGuest||!newAmt} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Create Credit Note</button>
            </div>
          </div>
        </>
      )}

      {/* Approve CN modal */}
      {showApprove && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={() => { setShowApprove(null); setApprovePin(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Approve {showApprove}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Manager PIN required to approve credit notes.</p>
            <input type="password" maxLength={4} value={approvePin} onChange={e=>setApprovePin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest mb-4" style={{ borderColor: BORDER, fontFamily: mono }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={() => { setShowApprove(null); setApprovePin(""); }} />
              <button onClick={() => approveCN(showApprove)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Approve</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared Complaint Data ────────────────────────────────────────────────────
// Defined once; both ComplaintManagement and ComplaintDashboard reference it
type CmpSeverity = "Low" | "Medium" | "High" | "Critical";
type CmpStatus   = "Open" | "In Progress" | "Resolved" | "Closed" | "Escalated";
type CmpCategory = "Room Maintenance" | "Food & Beverage" | "Service Quality" | "Noise" | "Billing" | "Staff Conduct" | "Other";

const COMPLAINTS = [
  { id:"CMP-001", guest:"Adaeze Okonkwo",       room:"101", category:"Room Maintenance" as CmpCategory, severity:"High" as CmpSeverity,     channel:"Guest Portal", raised:"14 Oct 09:00", owner:"Tunde Bakare",    dept:"Maintenance",  slaDue:"14 Oct 13:00", slaRemMins:0,    status:"In Progress" as CmpStatus, escalated:false, description:"AC unit has been making loud noise since last night. Room temperature is also not reaching the set level.", compensation:0,   repeat:false },
  { id:"CMP-002", guest:"Emmanuel Adeyemi",      room:"202", category:"Billing" as CmpCategory,          severity:"Medium" as CmpSeverity,   channel:"Front Desk",   raised:"13 Oct 14:20", owner:"Grace Mensah",    dept:"Finance",      slaDue:"14 Oct 14:20", slaRemMins:80,   status:"Open" as CmpStatus,        escalated:false, description:"Guest disputes a minibar charge of ₦3,500 from 12 Oct. States he did not use the minibar.", compensation:0,   repeat:true  },
  { id:"CMP-003", guest:"Dr. Chukwuemeka Bello", room:"501", category:"Service Quality" as CmpCategory,  severity:"Critical" as CmpSeverity, channel:"WhatsApp",     raised:"14 Oct 07:45", owner:"Fatima Ibrahim",  dept:"Front Desk",   slaDue:"14 Oct 09:45", slaRemMins:-120, status:"Escalated" as CmpStatus,   escalated:true,  description:"VIP guest waited 45 minutes for the welcome basket that was confirmed at reservation. Champagne arrived warm.", compensation:15000, repeat:false },
  { id:"CMP-004", guest:"Ngozi Adichie",         room:"306", category:"Noise" as CmpCategory,             severity:"Medium" as CmpSeverity,   channel:"Front Desk",   raised:"13 Oct 22:10", owner:"Kemi Adeyemi",    dept:"Front Desk",   slaDue:"13 Oct 23:10", slaRemMins:-800, status:"Resolved" as CmpStatus,    escalated:false, description:"Noise from guests in Room 307 kept guest awake until midnight. Room was moved.", compensation:5000, repeat:false },
  { id:"CMP-005", guest:"Tunde Bakare",           room:"411", category:"Room Maintenance" as CmpCategory, severity:"High" as CmpSeverity,     channel:"In-App",       raised:"12 Oct 11:00", owner:"Chukwuemeka Obi", dept:"Maintenance",  slaDue:"12 Oct 15:00", slaRemMins:-2000,status:"Closed" as CmpStatus,      escalated:false, description:"Shower drain blocked. Third report of same issue. Maintenance finally resolved after escalation.", compensation:0,   repeat:true  },
  { id:"CMP-006", guest:"Kemi Adeyemi",           room:"210", category:"Food & Beverage" as CmpCategory,  severity:"Low" as CmpSeverity,      channel:"Guest Portal", raised:"14 Oct 12:30", owner:"Ngozi Eze",       dept:"F&B",          slaDue:"14 Oct 16:30", slaRemMins:240,  status:"Open" as CmpStatus,        escalated:false, description:"Room service order arrived 40 minutes late and was cold. Guest requested a refund for the delivery surcharge.", compensation:0,   repeat:false },
];

// ─── ComplaintManagement ──────────────────────────────────────────────────────
export function ComplaintManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const SEV_COLORS: Record<CmpSeverity, {bg:string;text:string}> = {
    Low:      { bg:"#F1F5F9", text:"#475569" },
    Medium:   { bg:"#FEF3C7", text:"#92400E" },
    High:     { bg:"#FEE2E2", text:"#991B1B" },
    Critical: { bg:"#7F1D1D", text:"#FFFFFF" },
  };
  const ST_COLORS: Record<CmpStatus, {bg:string;text:string}> = {
    Open:        { bg:"#EFF6FF", text:PRIMARY   },
    "In Progress":{ bg:"#FEF3C7", text:"#92400E" },
    Resolved:    { bg:"#DCFCE7", text:"#166534" },
    Closed:      { bg:"#F1F5F9", text:"#475569" },
    Escalated:   { bg:"#FEE2E2", text:"#991B1B" },
  };

  const [sevF, setSevF]     = useState<"All"|CmpSeverity>("All");
  const [stF, setStF]       = useState<"All"|CmpStatus>("All");
  const [selected, setSelected] = useState<typeof COMPLAINTS[number]|null>(null);
  const [noteText, setNoteText] = useState("");
  const [compAmt, setCompAmt]   = useState("");
  const [showComp, setShowComp] = useState(false);

  const filtered = COMPLAINTS.filter(c =>
    (sevF==="All" || c.severity===sevF) && (stF==="All" || c.status===stF)
  );

  const slaLabel = (m: number) => {
    if (m > 0) return <span className="text-xs font-semibold" style={{ color:m<60?WARNING:SUCCESS }}>{m}m remaining</span>;
    return <span className="text-xs font-semibold" style={{ color:ERROR }}>SLA BREACHED {Math.abs(m)}m ago</span>;
  };

  // Row background escalates based on SLA and severity
  const rowBg = (c: typeof COMPLAINTS[number]) => {
    if (c.severity==="Critical") return "#FFF1F2";
    if (c.slaRemMins < 0 && c.status !== "Resolved" && c.status !== "Closed") return "#FEF9C3";
    return "transparent";
  };

  return (
    <div>
      <PageHeader title="Complaint Management" sub="CS-owned · SLA tracking · Compensation recording"
        actions={<BtnP label="New Complaint" icon={Plus} onClick={()=>add({type:"info",title:"Complaint log opened"})} />}
      />
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label:"Open",       val:COMPLAINTS.filter(c=>c.status==="Open"||c.status==="In Progress").length, color:PRIMARY },
          { label:"SLA Breached",val:COMPLAINTS.filter(c=>c.slaRemMins<0&&c.status!=="Resolved"&&c.status!=="Closed").length, color:ERROR   },
          { label:"Escalated",  val:COMPLAINTS.filter(c=>c.escalated).length,                                 color:WARNING },
          { label:"Resolved Today",val:COMPLAINTS.filter(c=>c.status==="Resolved").length,                   color:SUCCESS },
        ].map(k=>(
          <div key={k.label} className="bg-white rounded-xl border px-4 py-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
            <div className="text-xs mb-1" style={{ color:MUTED }}>{k.label}</div>
            <div className="text-2xl font-bold" style={{ color:k.color, fontFamily:mono }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          {/* Filters */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <div className="flex gap-1">
              {(["All","Low","Medium","High","Critical"] as const).map(s=>(
                <button key={s} onClick={()=>setSevF(s)} className="px-3 py-1.5 rounded-xl text-xs font-medium border" style={{ backgroundColor:sevF===s?PRIMARY:"white", color:sevF===s?"white":MUTED, borderColor:sevF===s?PRIMARY:BORDER }}>{s}</button>
              ))}
            </div>
            <select value={stF} onChange={e=>setStF(e.target.value as "All"|CmpStatus)} className="px-3 py-1.5 rounded-xl border text-xs outline-none" style={{ borderColor:BORDER, color:TEXT }}>
              {["All","Open","In Progress","Resolved","Closed","Escalated"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          <table className="w-full">
            <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["ID","Guest","Category","Severity","Raised","Owner","SLA","Status",""].map((h,i)=><th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color:MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} className="border-t cursor-pointer" style={{ borderColor:BORDER, backgroundColor:rowBg(c) }} onClick={()=>setSelected(c)}>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color:PRIMARY, fontFamily:mono }}>{c.id}</td>
                  <td className="px-3 py-2.5 text-xs font-medium" style={{ color:TEXT }}>
                    {c.guest}
                    {c.repeat && <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor:"#FEE2E2", color:"#991B1B" }}>Repeat</span>}
                  </td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED }}>{c.category}</td>
                  <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={SEV_COLORS[c.severity]}>{c.severity}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:MUTED, fontFamily:mono }}>{c.raised}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color:TEXT }}>{c.owner}</td>
                  <td className="px-3 py-2.5">{slaLabel(c.slaRemMins)}</td>
                  <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={ST_COLORS[c.status]}>{c.status}</span></td>
                  <td className="px-3 py-2.5"><ChevronRight size={14} style={{ color:SUBTLE }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 bg-white rounded-xl border p-4 shrink-0 self-start sticky top-4 space-y-4" style={{ borderColor:BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.08)" }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-bold" style={{ color:TEXT }}>{selected.id}</div>
                <div className="text-xs" style={{ color:MUTED }}>{selected.guest} · Room {selected.room}</div>
              </div>
              <button onClick={()=>setSelected(null)}><X size={15} style={{ color:SUBTLE }} /></button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={SEV_COLORS[selected.severity]}>{selected.severity}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={ST_COLORS[selected.status]}>{selected.status}</span>
              {selected.escalated && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor:"#FEE2E2", color:"#991B1B" }}>Escalated</span>}
            </div>

            <div className="text-xs leading-relaxed p-3 rounded-xl" style={{ backgroundColor:"#F9FAFB", color:TEXT }}>{selected.description}</div>

            <div className="space-y-1.5 text-xs">
              {([["Category",selected.category],["Channel",selected.channel],["Owner",selected.owner],["Dept",selected.dept],["Raised",selected.raised],["SLA Due",selected.slaDue]] as [string,string][]).map(([k,v])=>(
                <div key={k} className="flex justify-between border-b py-1" style={{ borderColor:"#F4F4F5" }}>
                  <span style={{ color:MUTED }}>{k}</span><span className="font-medium" style={{ color:TEXT }}>{v}</span>
                </div>
              ))}
              {selected.compensation > 0 && (
                <div className="flex justify-between border-b py-1" style={{ borderColor:"#F4F4F5" }}>
                  <span style={{ color:MUTED }}>Compensation</span>
                  <span className="font-bold" style={{ color:SUCCESS }}>₦{selected.compensation.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Internal note */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Internal Note</label>
              <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={2} placeholder="Add note visible only to staff…" className="w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none" style={{ borderColor:BORDER, color:TEXT }} />
              <button onClick={()=>{ add({type:"info",title:"Note added"}); setNoteText(""); }} className="mt-1 text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ color:PRIMARY, borderColor:`${PRIMARY}30` }}>Save Note</button>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={()=>setShowComp(true)} className="w-full py-2.5 rounded-xl text-xs font-semibold border" style={{ color:TEAL, borderColor:`${TEAL}30` }}>Post Compensation to Folio</button>
              <button onClick={()=>add({type:"warning",title:`${selected.id} escalated to management`})} className="w-full py-2.5 rounded-xl text-xs font-semibold border" style={{ color:ERROR, borderColor:`${ERROR}30` }}>Escalate</button>
              <button onClick={()=>add({type:"success",title:`${selected.id} resolved`})} className="w-full py-2.5 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor:SUCCESS }}>Mark Resolved</button>
            </div>
          </div>
        )}
      </div>

      {/* Compensation modal */}
      {showComp && selected && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.45)" }} onClick={()=>setShowComp(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-1" style={{ color:TEXT }}>Post Compensation</h3>
            <p className="text-xs mb-4" style={{ color:MUTED }}>Amount will be posted as a credit to Room {selected.room} folio and deducted from the guest's bill.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Compensation Type</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                  {["Room Rate Discount","F&B Credit","Service Waiver","Full Night Comp","Other Credit"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Amount (₦)</label>
                <input type="number" value={compAmt} onChange={e=>setCompAmt(e.target.value)} placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT, fontFamily:mono }} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setShowComp(false)} className="flex-1 py-2.5 rounded-xl text-sm border font-semibold" style={{ color:MUTED, borderColor:BORDER }}>Cancel</button>
              <button onClick={()=>{ add({type:"success",title:`₦${Number(compAmt).toLocaleString()} compensation posted to folio`}); setShowComp(false); setCompAmt(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:TEAL }}>Post Credit</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── ComplaintDashboard ───────────────────────────────────────────────────────
export function ComplaintDashboard() {
  const byCat = ["Room Maintenance","Food & Beverage","Service Quality","Noise","Billing","Other"].map(cat=>({
    cat, count: COMPLAINTS.filter(c=>c.category===cat||cat==="Other"&&!["Room Maintenance","Food & Beverage","Service Quality","Noise","Billing"].includes(c.category)).length
  })).filter(x=>x.count>0);

  const byDept = ["Maintenance","Front Desk","F&B","Finance","Security"].map(dept=>({
    dept, open: COMPLAINTS.filter(c=>c.dept===dept&&(c.status==="Open"||c.status==="In Progress")).length,
    resolved: COMPLAINTS.filter(c=>c.dept===dept&&(c.status==="Resolved"||c.status==="Closed")).length,
  }));

  const TREND = [
    { month:"Jul", Low:3, Medium:5, High:2, Critical:0 },
    { month:"Aug", Low:4, Medium:6, High:3, Critical:1 },
    { month:"Sep", Low:2, Medium:4, High:4, Critical:0 },
    { month:"Oct", Low:2, Medium:3, High:2, Critical:1 },
  ];

  const REPEAT_GUESTS = COMPLAINTS.filter(c=>c.repeat).map(c=>({ name:c.guest, room:c.room, count:2 }));

  const totalComp = COMPLAINTS.reduce((s,c)=>s+c.compensation,0);
  const openCount = COMPLAINTS.filter(c=>c.status==="Open"||c.status==="In Progress").length;
  const slaBreached = COMPLAINTS.filter(c=>c.slaRemMins<0&&c.status!=="Resolved"&&c.status!=="Closed").length;
  const avgResolution = 3.4;

  return (
    <div>
      <PageHeader title="Complaint Dashboard" sub="CS manager overview · October 2025" />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label:"Open Complaints",  val:openCount,                           color:PRIMARY, suffix:"" },
          { label:"SLA At Risk / Breached",val:slaBreached,                   color:ERROR,   suffix:"" },
          { label:"Avg. Resolution",  val:avgResolution,                       color:TEAL,    suffix:"h" },
          { label:"Compensation (Oct)",val:`₦${(totalComp/1000).toFixed(0)}K`,color:WARNING, suffix:"" },
        ].map(k=>(
          <div key={k.label} className="bg-white rounded-xl border px-4 py-3" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
            <div className="text-xs mb-1" style={{ color:MUTED }}>{k.label}</div>
            <div className="text-2xl font-bold" style={{ color:k.color, fontFamily:mono }}>{k.val}{k.suffix}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Trend by severity */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Complaints by Month & Severity</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TREND} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize:12 }} />
              <Bar dataKey="Low"      stackId="a" fill="#94A3B8" radius={[0,0,0,0]} />
              <Bar dataKey="Medium"   stackId="a" fill={WARNING}  radius={[0,0,0,0]} />
              <Bar dataKey="High"     stackId="a" fill={ORANGE}   radius={[0,0,0,0]} />
              <Bar dataKey="Critical" stackId="a" fill={ERROR}    radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By category */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>By Category</div>
          <div className="space-y-2">
            {byCat.map(b=>(
              <div key={b.cat} className="flex items-center gap-3">
                <div className="text-xs w-36 truncate" style={{ color:TEXT }}>{b.cat}</div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor:"#F4F4F5" }}>
                  <div className="h-full rounded-full" style={{ width:`${Math.round((b.count/COMPLAINTS.length)*100)}%`, backgroundColor:PRIMARY }} />
                </div>
                <div className="text-xs font-bold w-4 text-right" style={{ color:TEXT }}>{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By department */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Open vs Resolved by Department</div>
          <div className="space-y-2">
            {byDept.filter(d=>d.open+d.resolved>0).map(d=>(
              <div key={d.dept} className="flex items-center justify-between text-xs py-1.5 border-b" style={{ borderColor:"#F4F4F5" }}>
                <span className="font-medium" style={{ color:TEXT }}>{d.dept}</span>
                <div className="flex items-center gap-3">
                  <span style={{ color:ERROR }}>{d.open} open</span>
                  <span style={{ color:SUCCESS }}>{d.resolved} resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repeat guests */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor:BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.07)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color:TEXT }}>Repeat-Complaint Guests</div>
          {REPEAT_GUESTS.length === 0
            ? <div className="text-xs text-center mt-6" style={{ color:SUBTLE }}>No repeat complaint guests this period.</div>
            : REPEAT_GUESTS.map((g,i)=>(
              <div key={i} className="flex items-center justify-between py-2.5 border-b text-sm" style={{ borderColor:"#F4F4F5" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor:ERROR }}>
                    {g.name.split(" ").map((n:string)=>n[0]).join("").slice(0,2)}
                  </div>
                  <div><div className="font-medium text-xs" style={{ color:TEXT }}>{g.name}</div><div className="text-xs" style={{ color:MUTED }}>Room {g.room}</div></div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor:"#FEE2E2", color:"#991B1B" }}>{g.count} complaints</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
