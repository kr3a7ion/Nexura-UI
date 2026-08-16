// Batch 16 — Reports (6 screens)
// All screens share ReportShell for DRY date-range + export chrome.
import { useState } from "react";
import {
  Download, FileText, Filter, Search,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Users, Calendar, DollarSign, Package, Star, Activity,
  CalendarDays, UserCheck, Building2, Clock, Layers,
  ChevronDown, X, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import {
  type Toast,
  mono, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE,
  fmtN,
  occData, STAFF_RPT, GUEST_ANALYTICS_DATA, NATIONALITY_DATA, INV_CONS, REV_DATA,
} from "./constants";
import { Badge, StatCard, PageHeader, BtnO, BtnP } from "./UIKit";

// ─── Shared primitives ────────────────────────────────────────────────────────

const CHART_COLORS = [PRIMARY, TEAL, ORANGE, SUCCESS, WARNING];

type Preset = "Today" | "This Week" | "This Month" | "Last Month" | "This Quarter" | "YTD" | "Custom";
const PRESETS: Preset[] = ["Today", "This Week", "This Month", "Last Month", "This Quarter", "YTD"];

function ExportState({ state, onDownload }: { state: "idle" | "generating" | "ready"; onDownload: () => void }) {
  if (state === "idle") return null;
  if (state === "generating") return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>
      <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: `${PRIMARY}40`, borderTopColor: PRIMARY }} />
      Generating…
    </div>
  );
  return (
    <button onClick={onDownload} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
      <Download size={12} /> Download Ready
    </button>
  );
}

// Shared report chrome: presets, date range, comparison toggle, export
function ReportShell({
  title, sub, children, add,
  filterSlot,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  add: (t: Omit<Toast, "id">) => void;
  filterSlot?: React.ReactNode;
}) {
  const [preset, setPreset] = useState<Preset>("This Month");
  const [compare, setCompare] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "generating" | "ready">("idle");
  const [exportFmt, setExportFmt] = useState<"PDF" | "Excel" | "CSV">("Excel");

  const triggerExport = () => {
    setExportState("generating");
    setTimeout(() => setExportState("ready"), 1600);
  };

  return (
    <div>
      <PageHeader title={title} sub={sub}
        actions={
          <div className="flex items-center gap-2">
            <ExportState state={exportState} onDownload={() => { add({ type: "success", title: `${title} exported as ${exportFmt}` }); setExportState("idle"); }} />
            <select value={exportFmt} onChange={e => setExportFmt(e.target.value as typeof exportFmt)} className="px-2 py-2 rounded-xl border text-xs outline-none" style={{ borderColor: BORDER, color: MUTED }}>
              {["PDF", "Excel", "CSV"].map(f => <option key={f}>{f}</option>)}
            </select>
            <BtnO label="Export" icon={Download} onClick={triggerExport} />
          </div>
        }
      />

      {/* Date controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
          {PRESETS.map(p => (
            <button key={p} onClick={() => setPreset(p)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: preset === p ? "white" : "transparent", color: preset === p ? TEXT : MUTED, boxShadow: preset === p ? "0 1px 2px rgba(13,27,46,0.08)" : "none" }}>{p}</button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer ml-2" style={{ color: MUTED }}>
          <input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)} className="w-3.5 h-3.5 rounded" />
          Compare to prior period
        </label>
        {filterSlot}
      </div>

      {compare && (
        <div className="mb-4 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#FFFBEB", border: `1px solid #FDE68A`, color: "#92400E" }}>
          Comparison: <strong>Previous {preset}</strong> — values in grey show prior period.
        </div>
      )}

      {children}
    </div>
  );
}

// Reusable drillable table row
function DrillRow({ cols, onClick }: { cols: (string | React.ReactNode)[]; onClick?: () => void }) {
  return (
    <tr className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={onClick}>
      {cols.map((c, i) => (
        <td key={i} className="px-3 py-2.5 text-xs" style={{ color: i === 0 ? TEXT : MUTED }}>{c}</td>
      ))}
    </tr>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <tr style={{ backgroundColor: "#F9FAFB" }}>
      {cols.map((c, i) => (
        <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c}</th>
      ))}
    </tr>
  );
}

function Delta({ val, positive }: { val: string; positive?: boolean }) {
  const Icon = positive === undefined ? null : positive ? ArrowUpRight : ArrowDownRight;
  const color = positive === undefined ? MUTED : positive ? SUCCESS : ERROR;
  return (
    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color }}>
      {Icon && <Icon size={11} />}{val}
    </span>
  );
}

// ─── RP-01 OccupancyReports ───────────────────────────────────────────────────
export function OccupancyReports({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [drillType, setDrillType] = useState<string | null>(null);

  const MONTHLY = [
    { month: "May", occ: 79, adr: 52000, revpar: 41080, arrivals: 180, dep: 172 },
    { month: "Jun", occ: 88, adr: 55000, revpar: 48400, arrivals: 212, dep: 198 },
    { month: "Jul", occ: 92, adr: 57500, revpar: 52900, arrivals: 231, dep: 220 },
    { month: "Aug", occ: 90, adr: 56000, revpar: 50400, arrivals: 224, dep: 215 },
    { month: "Sep", occ: 85, adr: 54000, revpar: 45900, arrivals: 205, dep: 198 },
    { month: "Oct", occ: 88, adr: 55417, revpar: 48767, arrivals: 218, dep: 207 },
  ];

  const BY_TYPE = [
    { type: "Suite",    rooms: 8,  occ: 94, adr: 95000, revpar: 89300, los: 3.4 },
    { type: "Deluxe",  rooms: 20, occ: 88, adr: 58000, revpar: 51040, los: 2.7 },
    { type: "Standard",rooms: 30, occ: 84, adr: 42000, revpar: 35280, los: 2.4 },
    { type: "Executive",rooms:10, occ: 91, adr: 72000, revpar: 65520, los: 3.1 },
  ];

  const SOURCE_MIX = [
    { name: "Direct / Walk-in", value: 38, color: PRIMARY },
    { name: "Online (OTA)",     value: 29, color: TEAL    },
    { name: "Corporate",        value: 22, color: ORANGE  },
    { name: "Group",            value: 11, color: SUCCESS },
  ];

  const LOS_DIST = [
    { nights: "1", pct: 18 }, { nights: "2", pct: 32 }, { nights: "3", pct: 27 },
    { nights: "4", pct: 13 }, { nights: "5+", pct: 10 },
  ];

  return (
    <ReportShell title="Occupancy Reports" sub="Occupancy, ADR, RevPAR by date / type / segment" add={add}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Occupancy (Oct)" value="88.0%" sub="vs 85.3% Sep" icon={Building2} accent={PRIMARY} delta="+2.7pp" deltaPositive />
        <StatCard label="ADR (Oct)"       value="₦55,417" sub="vs ₦54,000 Sep" icon={DollarSign} accent={TEAL} delta="+2.6%" deltaPositive />
        <StatCard label="RevPAR (Oct)"    value="₦48,767" sub="vs ₦45,900 Sep" icon={TrendingUp} accent={SUCCESS} delta="+6.2%" deltaPositive />
        <StatCard label="No-Show Rate"    value="3.2%"    sub="−0.4pp vs Sep" icon={AlertTriangle} accent={WARNING} delta="−0.4pp" deltaPositive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Monthly trend */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Monthly Occupancy & RevPAR</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => `₦${Math.round(v / 1000)}K`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number, name: string) => [name === "occ" ? `${v}%` : `₦${v.toLocaleString()}`, name === "occ" ? "Occupancy" : "RevPAR"]} />
              <Bar yAxisId="l" dataKey="occ" name="occ" fill={PRIMARY} radius={[3, 3, 0, 0]} barSize={14} />
              <Bar yAxisId="r" dataKey="revpar" name="revpar" fill={TEAL} radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source mix */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Source Mix (Oct)</div>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={SOURCE_MIX} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                  {SOURCE_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {SOURCE_MIX.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />{s.name}</div>
                  <span className="font-bold" style={{ color: TEXT }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOS distribution */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Length of Stay Distribution (Oct)</div>
        <div className="flex items-end gap-4">
          {LOS_DIST.map(l => (
            <div key={l.nights} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: PRIMARY }}>{l.pct}%</span>
              <div className="w-full rounded-t-md" style={{ height: l.pct * 2, backgroundColor: PRIMARY, opacity: 0.7 + l.pct * 0.003 }} />
              <span className="text-xs" style={{ color: MUTED }}>{l.nights}n</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drillable table by room type */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>By Room Type</div>
          <span className="text-xs" style={{ color: MUTED }}>Click row to drill down</span>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={["Room Type", "Rooms", "Occupancy", "ADR", "RevPAR", "AvgLOS", ""]} /></thead>
          <tbody>
            {BY_TYPE.map(r => (
              <tr key={r.type} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setDrillType(drillType === r.type ? null : r.type)}>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{r.type}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{r.rooms}</td>
                <td className="px-3 py-2.5"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}><div className="h-full rounded-full" style={{ width: `${r.occ}%`, backgroundColor: r.occ >= 90 ? SUCCESS : r.occ >= 80 ? PRIMARY : WARNING }} /></div><span className="text-xs font-bold" style={{ color: TEXT }}>{r.occ}%</span></div></td>
                <td className="px-3 py-2.5 text-xs" style={{ color: TEXT, fontFamily: mono }}>₦{r.adr.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: TEXT, fontFamily: mono }}>₦{r.revpar.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{r.los}n</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{drillType === r.type ? "▲" : "▼"}</td>
              </tr>
            ))}
            {drillType && (
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <td colSpan={7} className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                  <strong style={{ color: TEXT }}>{drillType}</strong> — Reservations this month: 48 arrivals, 3 no-shows, 2 cancellations. Avg booking lead time: 8.3 days.
                  <button onClick={() => setDrillType(null)} className="ml-3 text-xs" style={{ color: PRIMARY }}>Close</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ReportShell>
  );
}

// ─── RP-02 RevenueReports (full standalone) ───────────────────────────────────
export function RevenueReports({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [dim, setDim] = useState<"Category" | "Room Type" | "Rate Plan" | "Source">("Category");
  const [drill, setDrill] = useState<string | null>(null);

  const REV_CAT = [
    { cat: "Room Revenue",    oct: 4820000, sep: 4510000, ytd: 38400000 },
    { cat: "Food & Beverage", oct: 1240000, sep: 1180000, ytd: 9920000  },
    { cat: "Service Charges", oct:  482000, sep:  451000, ytd: 3840000  },
    { cat: "Minibar & Extras",oct:  186000, sep:  175000, ytd: 1490000  },
    { cat: "Laundry",         oct:   94000, sep:   88000, ytd:  752000  },
    { cat: "Transport",       oct:   72000, sep:   65000, ytd:  576000  },
  ];

  const TAX = [
    { name: "VAT (7.5%)",          amt: 576150 },
    { name: "Consumption Tax (5%)", amt: 384100 },
    { name: "Service Charge (10%)", amt: 768200 },
  ];

  const PAYMENT_MIX = [
    { name: "Cash",       value: 31, color: PRIMARY },
    { name: "Card/POS",   value: 42, color: TEAL    },
    { name: "Transfer",   value: 18, color: ORANGE  },
    { name: "Corporate",  value:  9, color: SUCCESS },
  ];

  const monthlyChart = REV_DATA;

  const dimData: Record<typeof dim, { name: string; oct: number; sep: number }[]> = {
    "Category":  REV_CAT.map(r => ({ name: r.cat,     oct: r.oct, sep: r.sep })),
    "Room Type": [{ name:"Suite",     oct:1820000, sep:1700000 },{ name:"Deluxe", oct:1630000, sep:1520000 },{ name:"Standard", oct:1050000, sep:980000 },{ name:"Executive",oct:320000,sep:310000 }],
    "Rate Plan": [{ name:"Rack Rate",  oct:2200000, sep:2100000 },{ name:"Corporate",oct:1400000,sep:1300000 },{ name:"OTA",oct:900000,sep:840000 },{ name:"Package",oct:320000,sep:270000 }],
    "Source":    [{ name:"Direct",     oct:1830000, sep:1710000 },{ name:"OTA",oct:1390000,sep:1310000 },{ name:"Corporate",oct:1060000,sep:970000 },{ name:"Group",oct:540000,sep:520000 }],
  };

  const totalOct = REV_CAT.reduce((s, r) => s + r.oct, 0);
  const totalSep = REV_CAT.reduce((s, r) => s + r.sep, 0);
  const totalYTD = REV_CAT.reduce((s, r) => s + r.ytd, 0);

  return (
    <ReportShell title="Revenue Reports" sub="Revenue by category, room type, rate plan, and source" add={add}
      filterSlot={
        <div className="flex gap-1 ml-2">
          {(["Category", "Room Type", "Rate Plan", "Source"] as const).map(d => (
            <button key={d} onClick={() => setDim(d)} className="px-3 py-1.5 rounded-xl text-xs font-medium border" style={{ backgroundColor: dim === d ? PRIMARY : "white", color: dim === d ? "white" : MUTED, borderColor: dim === d ? PRIMARY : BORDER }}>{d}</button>
          ))}
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Revenue (Oct)"  value={`₦${(totalOct / 1000000).toFixed(2)}M`} sub={`vs ₦${(totalSep / 1000000).toFixed(2)}M Sep`} icon={DollarSign} accent={PRIMARY} delta={`+${(((totalOct - totalSep) / totalSep) * 100).toFixed(1)}%`} deltaPositive />
        <StatCard label="YTD Revenue"           value={`₦${(totalYTD / 1000000).toFixed(1)}M`} sub="Jan–Oct 2025" icon={TrendingUp} accent={TEAL} delta="+11.4% vs 2024" deltaPositive />
        <StatCard label="Tax Collected (Oct)"   value={`₦${((TAX.reduce((s,t)=>s+t.amt,0))/1000).toFixed(0)}K`} sub="VAT + Consumption + Service" icon={FileText} accent={WARNING} />
        <StatCard label="Discounts & Comps"     value="₦94,000" sub="4 approvals this month" icon={AlertTriangle} accent={ERROR} delta="+12% vs Sep" deltaPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Monthly trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Monthly Revenue Trend (₦M)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyChart} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`₦${(v / 1000000).toFixed(2)}M`]} />
              <Area type="monotone" dataKey="rev" stroke={PRIMARY} strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment mix */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Payment Mix</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={PAYMENT_MIX} cx="50%" cy="50%" outerRadius={55} paddingAngle={3} dataKey="value" stroke="none">
                {PAYMENT_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {PAYMENT_MIX.map(p => (
              <div key={p.name} className="flex justify-between text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />{p.name}</div>
                <span className="font-bold" style={{ color: TEXT }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax summary */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Tax Collected (Oct 2025)</div>
        <div className="flex gap-6 flex-wrap">
          {TAX.map(t => (
            <div key={t.name}>
              <div className="text-xs" style={{ color: MUTED }}>{t.name}</div>
              <div className="text-xl font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{t.amt.toLocaleString()}</div>
            </div>
          ))}
          <div><div className="text-xs" style={{ color: MUTED }}>Total Tax</div><div className="text-xl font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{TAX.reduce((s, t) => s + t.amt, 0).toLocaleString()}</div></div>
        </div>
      </div>

      {/* Drillable dimension table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Revenue by {dim}</div>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={[dim, "Oct 2025", "Sep 2025", "Change", "% of Total", ""]} /></thead>
          <tbody>
            {dimData[dim].map((r, i) => {
              const change = ((r.oct - r.sep) / r.sep) * 100;
              const pct = (r.oct / dimData[dim].reduce((s, x) => s + x.oct, 0)) * 100;
              return (
                <tr key={r.name} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setDrill(drill === r.name ? null : r.name)}>
                  <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{r.name}</td>
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{r.oct.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{r.sep.toLocaleString()}</td>
                  <td className="px-3 py-2.5"><Delta val={`${change >= 0 ? "+" : ""}${change.toFixed(1)}%`} positive={change >= 0} /></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{pct.toFixed(1)}%</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{drill === r.name ? "▲" : "▼"}</td>
                </tr>
              );
            })}
            {drill && (
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <td colSpan={6} className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                  <strong style={{ color: TEXT }}>{drill}</strong> — Daily average: ₦{Math.round(dimData[dim].find(r => r.name === drill)!.oct / 31).toLocaleString()} · Peak day: 14 Oct.
                  <button onClick={() => setDrill(null)} className="ml-3 text-xs" style={{ color: PRIMARY }}>Close</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ReportShell>
  );
}

// ─── RP-03 DepartmentReports ──────────────────────────────────────────────────
export function DepartmentReports({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const DEPTS = ["Front Desk", "Housekeeping", "Maintenance", "F&B", "Finance", "HR"];
  const [dept, setDept] = useState("Front Desk");

  const DEPT_DATA: Record<string, {
    kpis: { label: string; val: string; delta?: string; pos?: boolean }[];
    trend: { day: string; a: number; b?: number }[];
    aLabel: string; bLabel?: string;
    incidents: { date: string; type: string; status: string; note: string }[];
  }> = {
    "Front Desk":  {
      kpis: [{ label:"Check-ins (Oct)", val:"218", delta:"+8 vs Sep", pos:true },{ label:"Avg Processing", val:"3.8 min", delta:"−0.4 vs Sep", pos:true },{ label:"Walk-ins", val:"24", delta:"+3", pos:true },{ label:"Guest Rating", val:"4.7/5" }],
      trend: [{ day:"Mon",a:38 },{ day:"Tue",a:42 },{ day:"Wed",a:35 },{ day:"Thu",a:44 },{ day:"Fri",a:51 },{ day:"Sat",a:58 },{ day:"Sun",a:48 }],
      aLabel:"Check-ins",
      incidents:[{ date:"14 Oct",type:"Late Check-in",status:"Resolved",note:"Guest arrived 03:30, key issued without issue." },{ date:"11 Oct",type:"Overbooking",status:"Resolved",note:"1 room oversold. Guest upgraded to Suite, comp breakfast." }],
    },
    "Housekeeping": {
      kpis: [{ label:"Rooms Cleaned (Oct)",val:"674",delta:"+12 vs Sep",pos:true },{ label:"Avg Turnaround",val:"41 min",delta:"−3 min",pos:true },{ label:"Inspection Pass",val:"92%",delta:"+4pp",pos:true },{ label:"DND Overrides",val:"3" }],
      trend: [{ day:"Mon",a:88,b:81 },{ day:"Tue",a:95,b:87 },{ day:"Wed",a:91,b:84 },{ day:"Thu",a:98,b:90 },{ day:"Fri",a:104,b:96 },{ day:"Sat",a:112,b:103 },{ day:"Sun",a:86,b:80 }],
      aLabel:"Cleaned", bLabel:"Inspected",
      incidents:[{ date:"12 Oct",type:"DND Wellness Check",status:"Completed",note:"Room 407 — 28hrs DND. Checked, guest resting, declined service." }],
    },
    "Maintenance": {
      kpis:[{ label:"WOs Created (Oct)",val:"31",delta:"+5 vs Sep",pos:false },{ label:"WOs Closed",val:"28",delta:"+8 vs Sep",pos:true },{ label:"Avg Resolution",val:"5.8h",delta:"−1.2h",pos:true },{ label:"Overdue",val:"3" }],
      trend:[{ day:"Mon",a:4,b:5 },{ day:"Tue",a:6,b:4 },{ day:"Wed",a:3,b:6 },{ day:"Thu",a:7,b:3 },{ day:"Fri",a:5,b:7 },{ day:"Sat",a:4,b:4 },{ day:"Sun",a:2,b:4 }],
      aLabel:"Created", bLabel:"Closed",
      incidents:[{ date:"14 Oct",type:"SLA Breach",status:"Open",note:"WO-0090 — AC Room 316 exceeded 8h SLA." }],
    },
    "F&B":       { kpis:[{ label:"Covers (Oct)",val:"1,842" },{ label:"Avg Cover Value",val:"₦6,240" },{ label:"Room Charges Posted",val:"₦284K" },{ label:"Wastage",val:"₦18K" }], trend:[{ day:"Mon",a:240 },{ day:"Tue",a:265 },{ day:"Wed",a:258 },{ day:"Thu",a:272 },{ day:"Fri",a:290 },{ day:"Sat",a:318 },{ day:"Sun",a:199 }], aLabel:"Covers", incidents:[] },
    "Finance":   { kpis:[{ label:"Revenue Today",val:"₦1.25M" },{ label:"Outstanding AR",val:"₦380K" },{ label:"AP Due This Week",val:"₦240K" },{ label:"Day-Close Status",val:"Open" }], trend:[{ day:"Mon",a:1050 },{ day:"Tue",a:1180 },{ day:"Wed",a:920 },{ day:"Thu",a:1340 },{ day:"Fri",a:1250 },{ day:"Sat",a:1420 },{ day:"Sun",a:980 }], aLabel:"Revenue (₦K)", incidents:[] },
    "HR":        { kpis:[{ label:"Headcount",val:"47" },{ label:"Attendance Rate",val:"94.1%",delta:"+0.8pp",pos:true },{ label:"Overtime Hours",val:"89h",delta:"+12h",pos:false },{ label:"Open Leave Requests",val:"4" }], trend:[{ day:"Mon",a:44 },{ day:"Tue",a:46 },{ day:"Wed",a:45 },{ day:"Thu",a:47 },{ day:"Fri",a:43 },{ day:"Sat",a:38 },{ day:"Sun",a:22 }], aLabel:"Staff On Duty", incidents:[] },
  };

  const d = DEPT_DATA[dept] ?? DEPT_DATA["Front Desk"];

  return (
    <ReportShell title="Department Reports" sub="Per-department KPIs, productivity, and incidents" add={add}
      filterSlot={
        <select value={dept} onChange={e => setDept(e.target.value)} className="ml-2 px-3 py-1.5 rounded-xl border text-xs outline-none" style={{ borderColor: BORDER, color: TEXT }}>
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {d.kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border px-4 py-3" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
            <div className="text-xs mb-1" style={{ color: MUTED }}>{k.label}</div>
            <div className="text-xl font-bold" style={{ color: TEXT, fontFamily: mono }}>{k.val}</div>
            {k.delta && <div className="text-xs mt-0.5" style={{ color: k.pos ? SUCCESS : ERROR }}>{k.delta}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Weekly Activity — {dept}</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.trend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="a" name={d.aLabel} fill={PRIMARY} radius={[3, 3, 0, 0]} barSize={12} />
              {d.bLabel && <Bar dataKey="b" name={d.bLabel} fill={TEAL} radius={[3, 3, 0, 0]} barSize={12} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Incidents & Flags</div>
          {d.incidents.length === 0
            ? <div className="text-xs text-center mt-8" style={{ color: SUBTLE }}>No incidents this period.</div>
            : d.incidents.map((inc, i) => (
              <div key={i} className="mb-3 px-3 py-2.5 rounded-xl border" style={{ borderColor: BORDER }}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold" style={{ color: TEXT }}>{inc.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: inc.status === "Resolved" || inc.status === "Completed" ? "#DCFCE7" : "#FEE2E2", color: inc.status === "Resolved" || inc.status === "Completed" ? "#166534" : "#991B1B" }}>{inc.status}</span>
                </div>
                <div className="text-xs" style={{ color: MUTED }}>{inc.date} · {inc.note}</div>
              </div>
            ))
          }
        </div>
      </div>
    </ReportShell>
  );
}

// ─── RP-04 GuestAnalytics ─────────────────────────────────────────────────────
export function GuestAnalytics({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [drill, setDrill] = useState<string | null>(null);

  const VIP_TABLE = [
    { name:"Dr. Chukwuemeka Bello",  stays:18, ltv:4820000, lastStay:"14 Oct", rating:5.0, tier:"Platinum" },
    { name:"Senator Adeyemi",         stays:12, ltv:2950000, lastStay:"02 Oct", rating:4.8, tier:"Gold"     },
    { name:"Mrs. Ngozi Okonkwo-Iweala",stays:9, ltv:1840000, lastStay:"28 Sep", rating:4.9, tier:"Gold"    },
    { name:"Engr. Musa Abdullahi",    stays:7,  ltv:1260000, lastStay:"15 Sep", rating:4.6, tier:"Silver"   },
    { name:"Adaeze Okonkwo",          stays:6,  ltv:980000,  lastStay:"14 Oct", rating:4.7, tier:"Silver"   },
  ];

  const TIER_COLORS: Record<string, string> = { Platinum: "#7C3AED", Gold: "#D97706", Silver: "#64748B" };

  const SATISFACTION = [
    { month: "May", score: 4.3 }, { month: "Jun", score: 4.5 },
    { month: "Jul", score: 4.4 }, { month: "Aug", score: 4.6 },
    { month: "Sep", score: 4.5 }, { month: "Oct", score: 4.7 },
  ];

  return (
    <ReportShell title="Guest Analytics" sub="Repeat rate, nationality mix, lifetime value, satisfaction" add={add}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Repeat Guest Rate" value="42.1%" sub="+7pp vs May" icon={Users} accent={PRIMARY} delta="+7pp" deltaPositive />
        <StatCard label="New Guests (Oct)"  value="127"   sub="First-time arrivals" icon={UserCheck} accent={TEAL} />
        <StatCard label="Avg Lifetime Value" value="₦1.23M" sub="All active guests" icon={DollarSign} accent={SUCCESS} delta="+8.4% vs last yr" deltaPositive />
        <StatCard label="Guest Satisfaction" value="4.7/5" sub="34 reviews this month" icon={Star} accent={WARNING} delta="+0.2 vs Sep" deltaPositive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Repeat vs new trend */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Repeat vs New Guests — Monthly</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GUEST_ANALYTICS_DATA} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="repeat" name="Repeat %" stackId="g" fill={PRIMARY} />
              <Bar dataKey="new"    name="New %"    stackId="g" fill={TEAL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nationality */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Nationality Mix</div>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={NATIONALITY_DATA} cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={3} dataKey="value" stroke="none">
                  {NATIONALITY_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {NATIONALITY_DATA.map(n => (
                <div key={n.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: n.color }} />{n.name}</div>
                  <span className="font-bold" style={{ color: TEXT }}>{n.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction trend */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Guest Satisfaction Score Trend</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={SATISFACTION} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis domain={[4, 5]} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v.toFixed(1), "Score"]} />
            <Line type="monotone" dataKey="score" stroke={SUCCESS} strokeWidth={2.5} dot={{ fill: SUCCESS, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* VIP table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Top Guests by Lifetime Value</div>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={["Guest", "Tier", "Stays", "Lifetime Value", "Last Stay", "Satisfaction", ""]} /></thead>
          <tbody>
            {VIP_TABLE.map((g, i) => (
              <tr key={i} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setDrill(drill === g.name ? null : g.name)}>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{g.name}</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: TIER_COLORS[g.tier] }}>{g.tier}</span></td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT }}>{g.stays}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{g.ltv.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{g.lastStay}</td>
                <td className="px-3 py-2.5 text-xs"><span className="flex items-center gap-1"><Star size={11} style={{ color: WARNING }} />{g.rating}</span></td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{drill === g.name ? "▲" : "▼"}</td>
              </tr>
            ))}
            {drill && (
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <td colSpan={7} className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                  <strong style={{ color: TEXT }}>{drill}</strong> — Preferred room: Suite 501. Dietary: No pork. Language: English. Source: Direct booking.
                  <button onClick={() => setDrill(null)} className="ml-3 text-xs" style={{ color: PRIMARY }}>Close</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ReportShell>
  );
}

// ─── RP-05 InventoryReports ───────────────────────────────────────────────────
export function InventoryReports({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [drill, setDrill] = useState<string | null>(null);

  const CATS = [
    { cat:"Linen",      consumed:128000, wastage:4800,  stockTurn:2.4, topSupplier:"Lagos Linen Co.",    spend:185000 },
    { cat:"Toiletries", consumed:94000,  wastage:2100,  stockTurn:3.8, topSupplier:"HygieniCare NG",     spend:140000 },
    { cat:"F&B",        consumed:312000, wastage:18600, stockTurn:5.2, topSupplier:"FreshMart Abuja",    spend:380000 },
    { cat:"Cleaning",   consumed:68000,  wastage:1200,  stockTurn:2.1, topSupplier:"CleanPro Supplies",  spend:82000  },
    { cat:"Kitchen",    consumed:48000,  wastage:800,   stockTurn:1.6, topSupplier:"Lagos Gas & Energy", spend:62000  },
  ];

  const SUPPLIER_PERF = [
    { supplier:"FreshMart Abuja",    onTime:94, quality:4.6, orders:18, avgLead:2.1 },
    { supplier:"Lagos Linen Co.",    onTime:88, quality:4.4, orders:6,  avgLead:4.2 },
    { supplier:"HygieniCare NG",     onTime:96, quality:4.7, orders:11, avgLead:1.8 },
    { supplier:"CleanPro Supplies",  onTime:82, quality:4.2, orders:8,  avgLead:3.5 },
  ];

  return (
    <ReportShell title="Inventory Reports" sub="Consumption, wastage, stock turn, and supplier performance" add={add}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Stock Value"   value="₦1.84M" sub="Current inventory"      icon={Package}      accent={PRIMARY} />
        <StatCard label="F&B Consumption"     value="₦312K"  sub="October"                icon={TrendingUp}   accent={TEAL}    delta="+5.2% vs Sep" deltaPositive />
        <StatCard label="Wastage (Oct)"        value="₦27.5K" sub="1.4% of consumption"   icon={AlertTriangle} accent={WARNING} delta="−0.3pp vs Sep" deltaPositive />
        <StatCard label="Critical Stock Items" value="2"      sub="Reorder immediately"   icon={AlertTriangle} accent={ERROR}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* F&B consumption trend */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>F&B Consumption Trend (₦K)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={INV_CONS} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TEAL} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}K`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`₦${v}K`]} />
              <Area type="monotone" dataKey="val" stroke={TEAL} strokeWidth={2} fill="url(#invGrad)" name="F&B Spend" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Wastage by category */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Wastage by Category (Oct)</div>
          {CATS.map(c => (
            <div key={c.cat} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span style={{ color: TEXT }}>{c.cat}</span><span className="font-bold" style={{ color: c.wastage > 10000 ? ERROR : MUTED }}>₦{c.wastage.toLocaleString()}</span></div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min((c.wastage / 20000) * 100, 100)}%`, backgroundColor: c.wastage > 10000 ? ERROR : WARNING }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category table */}
      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Consumption by Category</div>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={["Category", "Consumed (Oct)", "Wastage", "Wastage %", "Stock Turn", "Top Supplier", ""]} /></thead>
          <tbody>
            {CATS.map(c => (
              <tr key={c.cat} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setDrill(drill === c.cat ? null : c.cat)}>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{c.cat}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{c.consumed.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: c.wastage > 10000 ? ERROR : TEXT, fontFamily: mono }}>₦{c.wastage.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{((c.wastage / c.consumed) * 100).toFixed(1)}%</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{c.stockTurn}x</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{c.topSupplier}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{drill === c.cat ? "▲" : "▼"}</td>
              </tr>
            ))}
            {drill && (
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <td colSpan={7} className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                  <strong style={{ color: TEXT }}>{drill}</strong> — Monthly spend ₦{CATS.find(c => c.cat === drill)!.spend.toLocaleString()}.
                  Top 3 consumed items: click Export for full breakdown.
                  <button onClick={() => setDrill(null)} className="ml-3 text-xs" style={{ color: PRIMARY }}>Close</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier performance */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Supplier Performance</div>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={["Supplier", "On-Time %", "Quality Rating", "Orders (Oct)", "Avg Lead (days)"]} /></thead>
          <tbody>
            {SUPPLIER_PERF.map(s => (
              <tr key={s.supplier} className="border-t" style={{ borderColor: BORDER }}>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{s.supplier}</td>
                <td className="px-3 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.onTime}%`, backgroundColor: s.onTime >= 90 ? SUCCESS : s.onTime >= 80 ? WARNING : ERROR }} />
                    </div>
                    <span className="font-bold" style={{ color: TEXT }}>{s.onTime}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs"><span className="flex items-center gap-1"><Star size={11} style={{ color: WARNING }} />{s.quality}</span></td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT }}>{s.orders}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{s.avgLead} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  );
}

// ─── RP-06 StaffReports ───────────────────────────────────────────────────────
export function StaffReports({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [drill, setDrill] = useState<string | null>(null);

  const ATTENDANCE_TABLE = [
    { dept:"Front Desk",  headcount:12, present:11, late:2, absent:0, ot:8,  rate:91.7, leave:1 },
    { dept:"Housekeeping",headcount:14, present:13, late:1, absent:1, ot:4,  rate:92.9, leave:0 },
    { dept:"Maintenance", headcount:8,  present:8,  late:0, absent:0, ot:12, rate:100,  leave:0 },
    { dept:"F&B",         headcount:10, present:9,  late:3, absent:1, ot:16, rate:90.0, leave:0 },
    { dept:"Security",    headcount:6,  present:6,  late:0, absent:0, ot:6,  rate:100,  leave:0 },
    { dept:"Finance",     headcount:4,  present:4,  late:0, absent:0, ot:2,  rate:100,  leave:0 },
  ];

  const PRODUCTIVITY = [
    { metric:"Rooms cleaned / attendant-hr",    dept:"Housekeeping", val:"1.8",  benchmark:"2.0",  status:"Below" },
    { metric:"WOs closed / technician-day",     dept:"Maintenance",  val:"3.5",  benchmark:"3.0",  status:"Above" },
    { metric:"Check-ins processed / FD-hr",     dept:"Front Desk",   val:"4.2",  benchmark:"4.0",  status:"Above" },
    { metric:"Covers served / F&B-hr",          dept:"F&B",          val:"11.4", benchmark:"12.0", status:"Below" },
  ];

  const LEAVE_USE = [
    { type:"Annual",      allocated:21, used:8.2, pct:39 },
    { type:"Sick",        allocated:10, used:1.4, pct:14 },
    { type:"Casual",      allocated:5,  used:0.8, pct:16 },
    { type:"Maternity",   allocated:90, used:90,  pct:100 },
  ];

  const weeklyHours = STAFF_RPT;

  return (
    <ReportShell title="Staff Reports" sub="Attendance, overtime, productivity, leave utilisation" add={add}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Overall Attendance"  value="94.1%" sub="All departments"     icon={UserCheck}    accent={PRIMARY} delta="+0.8pp vs Sep" deltaPositive />
        <StatCard label="Total Hours Worked"  value="1,642h" sub="October 2025"       icon={Clock}        accent={TEAL}    />
        <StatCard label="Overtime (Oct)"      value="48h"    sub="5 departments"      icon={TrendingUp}   accent={WARNING} delta="+12h vs Sep" deltaPositive={false} />
        <StatCard label="Leave Requests Open" value="4"      sub="Pending approval"   icon={Calendar}     accent={MUTED}   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Hours by dept */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Hours Worked by Department (Oct)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyHours} layout="vertical" margin={{ right: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis type="number" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`${v}h`]} />
              <Bar dataKey="hours" fill={PRIMARY} radius={[0, 3, 3, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave utilisation */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Leave Utilisation (Avg per Staff)</div>
          {LEAVE_USE.map(l => (
            <div key={l.type} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: TEXT }}>{l.type}</span>
                <span className="font-bold" style={{ color: TEXT }}>{l.used}d <span style={{ color: MUTED }}>of {l.allocated}</span></span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
                <div className="h-full rounded-full" style={{ width: `${l.pct}%`, backgroundColor: l.pct >= 90 ? ERROR : l.pct >= 60 ? WARNING : TEAL }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity metrics */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Productivity vs Benchmark</div>
        <table className="w-full">
          <thead><TableHeader cols={["Metric", "Dept", "Actual", "Benchmark", "Status"]} /></thead>
          <tbody>
            {PRODUCTIVITY.map((p, i) => (
              <tr key={i} className="border-t" style={{ borderColor: BORDER }}>
                <td className="px-3 py-2.5 text-xs" style={{ color: TEXT }}>{p.metric}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{p.dept}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>{p.val}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{p.benchmark}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: p.status === "Above" ? "#DCFCE7" : "#FEF3C7", color: p.status === "Above" ? "#166534" : "#92400E" }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance by dept */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 3px rgba(13,27,46,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="text-sm font-semibold" style={{ color: TEXT }}>Attendance Detail by Department</div>
        </div>
        <table className="w-full">
          <thead><TableHeader cols={["Dept", "Headcount", "Present", "Late", "Absent", "On Leave", "Overtime", "Rate", ""]} /></thead>
          <tbody>
            {ATTENDANCE_TABLE.map(r => (
              <tr key={r.dept} className="border-t cursor-pointer hover:bg-slate-50" style={{ borderColor: BORDER }} onClick={() => setDrill(drill === r.dept ? null : r.dept)}>
                <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: PRIMARY }}>{r.dept}</td>
                <td className="px-3 py-2.5 text-xs font-bold" style={{ color: TEXT }}>{r.headcount}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUCCESS }}>{r.present}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: WARNING }}>{r.late}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: ERROR }}>{r.absent}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: MUTED }}>{r.leave}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: r.ot > 10 ? ORANGE : MUTED }}>{r.ot}h</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F4F4F5" }}>
                      <div className="h-full rounded-full" style={{ width: `${r.rate}%`, backgroundColor: r.rate >= 95 ? SUCCESS : r.rate >= 90 ? WARNING : ERROR }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: TEXT }}>{r.rate}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs" style={{ color: SUBTLE }}>{drill === r.dept ? "▲" : "▼"}</td>
              </tr>
            ))}
            {drill && (
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <td colSpan={9} className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                  <strong style={{ color: TEXT }}>{drill}</strong> — Lateness trend: improving. Most common reason: transport delays.
                  <button onClick={() => setDrill(null)} className="ml-3 text-xs" style={{ color: PRIMARY }}>Close</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ReportShell>
  );
}
