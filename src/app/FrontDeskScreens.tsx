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
  ArrowDownToLine, ArrowUpFromLine, XCircle, Archive, Info,
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

// Local gender-coded avatar (mirrors ScreensA Av)
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
export function CheckInWizard({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [step, setStep] = useState(1);
  const [selRes, setSelRes] = useState<string | null>(null);
  const [idType, setIdType] = useState("International Passport");
  const [idNum, setIdNum] = useState("");
  const [idExp, setIdExp] = useState("");
  const [nationality, setNationality] = useState("Nigerian");
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [vehicleReg, setVehicleReg] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");
  const [cashReceived, setCashReceived] = useState("");
  const [payRef, setPayRef] = useState("");
  const [credType, setCredType] = useState<"card" | "pin" | "both">("both");
  const [cardCount, setCardCount] = useState(1);
  const [encoded, setEncoded] = useState(false);
  const [pinGen, setPinGen] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(true);
  const STEPS = ["Select Reservation", "Verify Guest", "Assign Room", "Registration", "Payment", "Access Credentials", "Receipt & Documents"];
  const ARRIVALS = [
    { id: "BK-2849", guest: "Dr. Chukwuemeka Bello", av: "CB", room: "501", type: "Suite", eta: "14:00", nights: 3, rate: 91125, vip: true, deposit: 91125, requests: "Champagne + fruit basket" },
    { id: "BK-2850", guest: "Adaeze Okonkwo", av: "AO", room: "303", type: "Deluxe", eta: "15:30", nights: 2, rate: 55000, vip: false, deposit: 55000, requests: "High floor preferred" },
    { id: "BK-2851", guest: "Emmanuel Adeyemi", av: "EA", room: "", type: "Standard", eta: "12:00", nights: 1, rate: 35000, vip: false, deposit: 35000, requests: "" },
  ];
  const AVAIL_ROOMS = [
    { id: "102", type: "Standard", floor: 1, hkSt: "Inspected" }, { id: "104", type: "Standard", floor: 1, hkSt: "Clean" },
    { id: "201", type: "Deluxe", floor: 2, hkSt: "Inspected" }, { id: "301", type: "Suite", floor: 3, hkSt: "Inspected" },
    { id: "501", type: "Suite", floor: 5, hkSt: "Inspected" },
  ];
  const selData = ARRIVALS.find(a => a.id === selRes);
  const roomData = AVAIL_ROOMS.find(r => r.id === selRoom);
  const subtotal = selData ? selData.rate * selData.nights : 0;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  const change = payMethod === "Cash" && cashReceived ? Math.max(0, parseInt(cashReceived.replace(/,/g, "")) - selData!.deposit) : 0;
  const canNext = step === 1 ? !!selRes : step === 4 ? termsAccepted : true;
  return (
    <div>
      <PageHeader title="Guest Check-In" sub="24 Jun 2025 · 7-step check-in wizard" />
      {/* Step progress */}
      <div className="bg-white rounded-xl border p-4 mb-4 overflow-x-auto" style={{ borderColor: BORDER }}>
        <div className="flex items-center min-w-max">
          {STEPS.map((s, i) => { const n = i + 1; const done = n < step; const active = n === step; return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: done ? SUCCESS : active ? PRIMARY : BORDER, color: done || active ? "white" : MUTED }}>{done ? <CheckCircle2 size={13} /> : n}</div>
                <span className="text-xs mt-1 text-center w-20" style={{ color: active ? PRIMARY : done ? SUCCESS : SUBTLE, fontWeight: active ? 700 : 400 }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-10 h-0.5 mx-1 mb-4 flex-shrink-0" style={{ backgroundColor: done ? SUCCESS : BORDER }} />}
            </div>
          ); })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main step content */}
        <div className="lg:col-span-3 bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
          {step === 1 && (
            <div>
              <h2 className="text-base font-bold mb-1" style={{ color: TEXT }}>Select Reservation</h2>
              <p className="text-sm mb-4" style={{ color: MUTED }}>Search or select from today's arrivals.</p>
              <div className="relative mb-4"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input placeholder="Search guest name or reservation ID…" className="pl-9 pr-4 py-2.5 w-full border rounded-xl text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div className="space-y-2">
                {ARRIVALS.map(a => (
                  <div key={a.id} onClick={() => setSelRes(a.id)} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" style={{ borderColor: selRes === a.id ? PRIMARY : BORDER, backgroundColor: selRes === a.id ? "#EFF6FF" : "white" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: a.vip ? ORANGE : PRIMARY }}>{a.av}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold" style={{ color: TEXT }}>{a.guest}</span>{a.vip && <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}><Star size={9} fill={ORANGE} />VIP</span>}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: MUTED }}><span style={{ fontFamily: mono }}>{a.id}</span><span>·</span><span>{a.type} {a.room ? `Room ${a.room}` : "(unassigned)"}</span><span>·</span><span>ETA {a.eta}</span><span>·</span><span>{a.nights}n</span></div>
                      {a.requests && <div className="text-xs mt-0.5 italic" style={{ color: MUTED }}>{a.requests}</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{(a.rate * a.nights).toLocaleString()}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{a.nights}n total</div>
                    </div>
                    {selRes === a.id && <CheckCircle2 size={20} style={{ color: PRIMARY }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 2 && selData && (
            <div>
              <h2 className="text-base font-bold mb-4" style={{ color: TEXT }}>Verify Guest Identity</h2>
              {selData.vip && <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ backgroundColor: "#FEF3C7", border: "1px solid #FDE68A" }}><Star size={14} fill={ORANGE} style={{ color: ORANGE }} /><span className="text-sm font-medium" style={{ color: "#92400E" }}>VIP Guest — Ensure room is fully prepared. {selData.requests}</span></div>}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Inp label="Full Name (from ID)" defaultValue={selData.guest} />
                <Sel label="Nationality" options={["Nigerian", "Ghanaian", "Kenyan", "South African", "British", "American", "Other"]} />
                <Sel label="ID Document Type" options={["International Passport", "National ID Card", "Driver's License", "Voter's Card"]} />
                <Inp label="ID Number" placeholder="A12345678" value={idNum} onChange={e => setIdNum(e.target.value)} />
                <Inp label="ID Issue Date" type="date" />
                <Inp label="ID Expiry Date" type="date" />
              </div>
              <div className="border-2 border-dashed rounded-xl p-6 text-center mb-4" style={{ borderColor: BORDER }}>
                <FileText size={24} className="mx-auto mb-2" style={{ color: SUBTLE }} />
                <p className="text-sm font-medium" style={{ color: MUTED }}>Upload or scan ID document photo</p>
                <p className="text-xs mb-3" style={{ color: SUBTLE }}>JPG, PNG or PDF · Max 5 MB</p>
                <button className="px-4 py-2 rounded-lg text-xs font-semibold border" style={{ color: PRIMARY, borderColor: PRIMARY }}>Choose File or Scan</button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}><AlertCircle size={12} />Document capture is required. Reservation cannot proceed without verified ID.</div>
            </div>
          )}
          {step === 3 && selData && (
            <div>
              <h2 className="text-base font-bold mb-2" style={{ color: TEXT }}>Assign Room</h2>
              <p className="text-sm mb-4" style={{ color: MUTED }}>Select from available rooms of the booked type. Upgrade option available with rate implication.</p>
              {selData.type !== "Suite" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs" style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE", color: "#7C3AED" }}>
                  <Star size={12} />Upgrade available — Suite available for +₦{(91125 - selData.rate).toLocaleString()}/night extra. Requires manager authorisation.
                </div>
              )}
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {AVAIL_ROOMS.map(r => {
                  const isUpgrade = r.type !== selData.type && (r.type === "Suite" || (r.type === "Deluxe" && selData.type === "Standard"));
                  const rateMap: Record<string, number> = { Standard: 35000, Deluxe: 55000, Suite: 91125 };
                  const rateDiff = (rateMap[r.type] ?? selData.rate) - selData.rate;
                  return (
                    <div key={r.id} onClick={() => setSelRoom(r.id)} className="rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md" style={{ borderColor: selRoom === r.id ? PRIMARY : BORDER, backgroundColor: selRoom === r.id ? "#EFF6FF" : "white" }}>
                      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: selRoom === r.id ? "#EFF6FF" : "#F9FAFB" }}>
                        <span className="text-xl font-black" style={{ color: selRoom === r.id ? PRIMARY : TEXT }}>{r.id}</span>
                        {selRoom === r.id && <CheckCircle2 size={16} style={{ color: PRIMARY }} />}
                      </div>
                      <div className="px-4 pb-3 pt-1">
                        <div className="text-xs font-semibold mb-1" style={{ color: TEXT }}>{r.type} · Floor {r.floor}</div>
                        <Badge label={r.hkSt} colors={hkC[r.hkSt] ?? { bg: "#F3F4F6", text: "#374151" }} />
                        {isUpgrade && rateDiff > 0 && <div className="text-xs mt-1 font-semibold" style={{ color: "#7C3AED" }}>+₦{rateDiff.toLocaleString()}/n upgrade</div>}
                        {r.type === selData.type && <div className="text-xs mt-1" style={{ color: SUCCESS }}>Matching type</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {step === 4 && selData && (
            <div>
              <h2 className="text-base font-bold mb-4" style={{ color: TEXT }}>Registration</h2>
              <div className="space-y-4">
                <div className="rounded-xl border p-4" style={{ borderColor: BORDER }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Terms & Conditions Acknowledgement</div>
                  <div className="text-xs mb-3 p-3 rounded-lg max-h-32 overflow-y-auto" style={{ backgroundColor: "#F9FAFB", color: MUTED, lineHeight: 1.6 }}>
                    Grand Palms Hotel, Abuja. By checking in, the guest agrees to: (1) abide by hotel policies including quiet hours 22:00–07:00; (2) accept responsibility for any damages caused to hotel property during the stay; (3) authorise the hotel to charge the card on file for any outstanding charges upon departure; (4) acknowledge that the hotel is not responsible for valuables left in rooms.
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer" style={{ borderColor: termsAccepted ? PRIMARY : BORDER, backgroundColor: termsAccepted ? PRIMARY : "white" }} onClick={() => setTermsAccepted(!termsAccepted)}>
                      {termsAccepted && <CheckCircle2 size={13} color="white" />}
                    </div>
                    <span className="text-sm" style={{ color: TEXT }}>Guest has read and accepts the hotel terms and conditions</span>
                  </label>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: BORDER }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Vehicle Registration (optional)</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Inp label="Vehicle Plate Number" placeholder="ABJ-123-XY" value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} />
                    <Sel label="Parking Bay" options={["Not required", "Bay A1", "Bay A2", "Bay B1", "Bay B2", "Bay B3"]} />
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: BORDER }}>
                  <div className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Signature Capture</div>
                  <div className="h-28 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
                    <span className="text-xs" style={{ color: SUBTLE }}>Signature pad — tap to sign or use stylus</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 5 && selData && (
            <div>
              <h2 className="text-base font-bold mb-4" style={{ color: TEXT }}>Payment & Deposit</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}` }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Deposit Policy</div>
                    <div className="text-sm" style={{ color: TEXT }}>1-night deposit required at check-in.</div>
                    <div className="mt-2 space-y-1.5 text-sm">
                      <div className="flex justify-between"><span style={{ color: MUTED }}>Room × {selData.nights}n</span><span style={{ fontFamily: mono }}>₦{subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span style={{ color: MUTED }}>VAT (7.5%)</span><span style={{ fontFamily: mono }}>₦{vat.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold pt-1.5 border-t" style={{ borderColor: BORDER, color: TEXT }}><span>Total</span><span style={{ fontFamily: mono }}>₦{total.toLocaleString()}</span></div>
                      <div className="flex justify-between text-base font-black pt-1" style={{ color: PRIMARY }}><span>Deposit Due</span><span style={{ fontFamily: mono }}>₦{selData.deposit.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Payment Method</div>
                  <div className="space-y-2 mb-4">
                    {["Cash", "POS / Card", "Bank Transfer", "Corporate Account"].map(m => (
                      <label key={m} className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all" style={{ borderColor: payMethod === m ? PRIMARY : BORDER, backgroundColor: payMethod === m ? "#EFF6FF" : "white" }}>
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: payMethod === m ? PRIMARY : "#CBD5E1" }}>{payMethod === m && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY }} />}</div>
                        <input type="radio" className="hidden" checked={payMethod === m} onChange={() => setPayMethod(m)} />
                        <span className="text-sm font-medium" style={{ color: TEXT }}>{m}</span>
                      </label>
                    ))}
                  </div>
                  {payMethod === "Cash" && (
                    <div className="space-y-2">
                      <Inp label="Cash Received (₦)" placeholder={selData.deposit.toLocaleString()} value={cashReceived} onChange={e => setCashReceived(e.target.value)} />
                      {cashReceived && <div className="px-3 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: "#F0FDF4", color: SUCCESS }}>Change due: ₦{change.toLocaleString()}</div>}
                    </div>
                  )}
                  {(payMethod === "POS / Card" || payMethod === "Bank Transfer") && <Inp label="Transaction Reference" placeholder="TRN-2024-XXXX" value={payRef} onChange={e => setPayRef(e.target.value)} />}
                  {payMethod === "Corporate Account" && <div className="space-y-2"><Sel label="Corporate Account" options={["Bello & Associates Ltd.", "Lagos Corp Group", "Federal Ministry of Works"]} /><Inp label="Purchase Order #" placeholder="PO-2024-001" /></div>}
                </div>
              </div>
            </div>
          )}
          {step === 6 && selData && (
            <div>
              <h2 className="text-base font-bold mb-1" style={{ color: TEXT }}>Access Credentials</h2>
              <p className="text-sm mb-4" style={{ color: MUTED }}>Issue room key card and/or PIN for Room {selRoom ?? selData.room}.</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-sm" style={{ backgroundColor: "#D1FAE5", border: "1px solid #A7F3D0", color: "#065F46" }}><Wifi size={13} />Connected — TTLock API reachable · Encoder: USB active</div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {(["card", "pin", "both"] as const).map(ct => (
                  <button key={ct} onClick={() => setCredType(ct)} className="p-4 rounded-xl border-2 text-center transition-all" style={{ borderColor: credType === ct ? PRIMARY : BORDER, backgroundColor: credType === ct ? "#EFF6FF" : "white" }}>
                    <div className="text-xs font-bold mb-1" style={{ color: credType === ct ? PRIMARY : MUTED }}>{ct === "card" ? "Key Card Only" : ct === "pin" ? "PIN Only" : "Card + PIN"}</div>
                    <div className="text-xs" style={{ color: SUBTLE }}>{ct === "card" ? "Physical card" : ct === "pin" ? "Digital code" : "Recommended"}</div>
                  </button>
                ))}
              </div>
              {(credType === "card" || credType === "both") && (
                <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><CreditCard size={15} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>Key Card Encoding</span></div>
                    <div className="flex items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>Cards:</span>
                      <button onClick={() => setCardCount(c => Math.max(1, c - 1))} className="w-6 h-6 rounded-lg border flex items-center justify-center text-xs" style={{ borderColor: BORDER }}>−</button>
                      <span className="text-sm font-bold w-6 text-center" style={{ color: TEXT }}>{cardCount}</span>
                      <button onClick={() => setCardCount(c => Math.min(4, c + 1))} className="w-6 h-6 rounded-lg border flex items-center justify-center text-xs" style={{ borderColor: BORDER }}>+</button>
                    </div>
                  </div>
                  <div className="text-xs mb-3" style={{ color: MUTED }}>Valid window: Check-in today → Check-out {selData.nights === 3 ? "27 Jun" : "25 Jun"} 11:00</div>
                  {!encoded ? (
                    <button onClick={() => { setEncoded(true); add({ type: "success", title: `${cardCount} card${cardCount > 1 ? "s" : ""} encoded`, body: `Room ${selRoom ?? selData.room} · Valid until check-out` }); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Encode {cardCount} Card{cardCount > 1 ? "s" : ""}</button>
                  ) : (
                    <div className="space-y-1">
                      {Array.from({ length: cardCount }).map((_, i) => <div key={i} className="flex items-center gap-2 text-sm" style={{ color: SUCCESS }}><CheckCircle2 size={13} />Card {i + 1} encoded · Serial {`XXXX-000${i + 1}`}</div>)}
                    </div>
                  )}
                </div>
              )}
              {(credType === "pin" || credType === "both") && (
                <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2 mb-3"><Hash size={15} style={{ color: PRIMARY }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>PIN Code</span></div>
                  {!pinGen ? (
                    <button onClick={() => { setPinGen(true); add({ type: "success", title: "PIN generated — show to guest now" }); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Generate PIN</button>
                  ) : (
                    <div>
                      <div className="rounded-xl p-4 mb-3 text-center" style={{ backgroundColor: NAV_BG }}>{pinRevealed ? <div className="text-3xl font-bold tracking-[0.3em] text-white" style={{ fontFamily: mono }}>743812</div> : <div className="text-3xl font-bold tracking-[0.3em] text-white" style={{ fontFamily: mono }}>74**12</div>}<div className="text-xs mt-1" style={{ color: SUBTLE }}>Valid until check-out · {pinRevealed ? "Will be masked on leaving screen" : "Masked — cannot retrieve"}</div></div>
                      <div className="flex items-center gap-2 mb-2"><AlertCircle size={11} style={{ color: ERROR }} /><span className="text-xs font-semibold" style={{ color: ERROR }}>Cannot be retrieved after this screen. Show to guest now.</span></div>
                      <div className="flex gap-2"><BtnO label="Copy" icon={ClipboardList} /><BtnO label="Print Slip" icon={FileText} /><button onClick={() => setPinRevealed(false)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: MUTED, borderColor: BORDER }}>Mask PIN</button></div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mt-4" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}><AlertTriangle size={11} />If offline, credentials are queued and will sync when connection is restored. Physical cards still work immediately.</div>
            </div>
          )}
          {step === 7 && selData && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D1FAE5" }}><CheckCircle2 size={32} style={{ color: SUCCESS }} /></div>
              <h2 className="text-base font-bold mb-1" style={{ color: TEXT }}>Check-In Complete</h2>
              <p className="text-sm mb-1" style={{ color: MUTED }}>{selData.guest} · Room {selRoom ?? selData.room} · {selData.nights} nights</p>
              <p className="text-sm mb-6" style={{ color: TEAL }}>Folio opened · Access credentials active</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
                {[["Print Registration Card", FileText], ["Print Deposit Receipt", FileText], ["Email Confirmation", Mail], ["Guest Portal QR Code", Globe]].map(([l, Ic]) => (
                  <button key={l as string} onClick={() => add({ type: "success", title: l as string })} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:shadow-md transition-all" style={{ borderColor: BORDER }}>
                    <Ic size={20} style={{ color: PRIMARY }} />
                    <span className="text-xs font-semibold text-center" style={{ color: TEXT }}>{l as string}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => { setStep(1); setSelRes(null); setSelRoom(null); setEncoded(false); setPinGen(false); setTermsAccepted(false); setPinRevealed(true); }} className="text-sm px-5 py-2 rounded-xl font-semibold" style={{ color: PRIMARY, border: `1px solid ${PRIMARY}` }}>New Check-In</button>
            </div>
          )}
          <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: BORDER }}>
            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border disabled:opacity-40" style={{ borderColor: BORDER, color: MUTED }}><ChevronLeft size={14} />Back</button>
            {step < 7 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 hover:opacity-90 transition-all" style={{ backgroundColor: PRIMARY }}>
                {step === 6 ? "Proceed to Receipt" : "Continue"}<ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={() => add({ type: "success", title: "Check-in complete!", body: `${selData?.guest ?? "Guest"} · Room ${selRoom ?? selData?.room}` })} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: SUCCESS }}><CheckCircle2 size={14} />Finish</button>
            )}
          </div>
        </div>
        {/* Summary panel */}
        <div className="bg-white rounded-xl border p-5 h-fit" style={{ borderColor: BORDER }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: MUTED }}>Booking Summary</div>
          {selData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: selData.vip ? ORANGE : PRIMARY }}>{selData.av}</div>
                <div><div className="text-sm font-bold" style={{ color: TEXT }}>{selData.guest}</div>{selData.vip && <div className="text-xs" style={{ color: ORANGE }}>VIP Guest</div>}</div>
              </div>
              <div className="border-t pt-3 space-y-2 text-xs" style={{ borderColor: BORDER }}>
                {[["Reservation", selData.id], ["Room Type", selData.type], ["Assigned Room", selRoom ?? (selData.room || "—")], ["Check-in", "24 Jun 2025"], ["Check-out", selData.nights === 3 ? "27 Jun 2025" : "25 Jun 2025"], ["Nights", String(selData.nights)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span className="font-semibold" style={{ color: TEXT, fontFamily: k === "Reservation" || k === "Assigned Room" ? mono : undefined }}>{v}</span></div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1 text-xs" style={{ borderColor: BORDER }}>
                {[["Subtotal", `₦${subtotal.toLocaleString()}`], ["VAT (7.5%)", `₦${vat.toLocaleString()}`], ["Total", `₦${total.toLocaleString()}`], ["Deposit Due", `₦${selData.deposit.toLocaleString()}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between" style={{ fontWeight: k === "Total" || k === "Deposit Due" ? 700 : 400 }}>
                    <span style={{ color: MUTED }}>{k}</span>
                    <span style={{ color: k === "Deposit Due" ? PRIMARY : TEXT, fontFamily: mono }}>{v}</span>
                  </div>
                ))}
              </div>
              {step >= 3 && encoded && <div className="px-2 py-1.5 rounded-lg text-xs flex items-center gap-1.5" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}><CheckCircle2 size={11} />{cardCount} card{cardCount > 1 ? "s" : ""} encoded</div>}
              {step >= 3 && pinGen && <div className="px-2 py-1.5 rounded-lg text-xs flex items-center gap-1.5" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}><CheckCircle2 size={11} />PIN activated</div>}
            </div>
          ) : (
            <div className="text-xs text-center py-6" style={{ color: SUBTLE }}>Select a reservation to begin</div>
          )}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Progress</div>
            <div className="space-y-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: i + 1 < step ? SUCCESS : i + 1 === step ? PRIMARY : BORDER }}>
                    {i + 1 < step ? <CheckCircle2 size={10} color="white" /> : <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i + 1 === step ? "white" : MUTED }} />}
                  </div>
                  <span style={{ color: i + 1 < step ? SUCCESS : i + 1 === step ? PRIMARY : SUBTLE, fontWeight: i + 1 === step ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// BackupRestore → ITAdminScreens.tsx
export { BackupRestore } from "./ITAdminScreens";

// AuditLog → ITAdminScreens.tsx
export { AuditLog } from "./ITAdminScreens";

export function PlaceholderScreen({ title, desc, icon: Icon }: { title: string; desc: string; icon: React.ElementType }) {
  return <div><PageHeader title={title} /><div className="bg-white rounded-xl border" style={{ borderColor: BORDER }}><EmptyState icon={Icon} message={desc} cta={`Open ${title}`} /></div></div>;
}

// ─── Router ──────────────────────────────────────────────────────────────────
// ─── NEW SCREENS ─────────────────────────────────────────────────────────────


const DEPARTURES_DATA = [
  { room: "101", guest: "Adaeze Okonkwo", checkout: "11:00", balance: 0, lateFlag: false, nights: 3, av: "AO" },
  { room: "202", guest: "Emmanuel Adeyemi", checkout: "11:00", balance: 45000, lateFlag: false, nights: 2, av: "EA" },
  { room: "203", guest: "Fatima Musa", checkout: "12:00", balance: 0, lateFlag: true, nights: 3, av: "FM" },
  { room: "118", guest: "Tunde Lawal", checkout: "10:00", balance: 18500, lateFlag: false, nights: 1, av: "TL" },
];











const MENU_ALL = [
  { id: 1, name: "Jollof Rice + Chicken", price: 4500, cat: "Mains", avail: true },
  { id: 2, name: "Egusi Soup + Pounded Yam", price: 5200, cat: "Mains", avail: true },
  { id: 3, name: "Grilled Fish", price: 6800, cat: "Mains", avail: true },
  { id: 4, name: "Fried Plantain", price: 1500, cat: "Sides", avail: true },
  { id: 5, name: "Moi Moi", price: 1200, cat: "Sides", avail: false },
  { id: 6, name: "Chapman", price: 2000, cat: "Drinks", avail: true },
  { id: 7, name: "Zobo", price: 1000, cat: "Drinks", avail: true },
  { id: 8, name: "Chocolate Cake", price: 3500, cat: "Desserts", avail: true },
  { id: 9, name: "Suya", price: 3000, cat: "Starters", avail: true },
  { id: 10, name: "Spring Rolls (6pc)", price: 2800, cat: "Starters", avail: true },
];




export function ArrivalsScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [arSearch, setArSearch] = useState("");
  const [arTab, setArTab] = useState("All");
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const AR = [
    { id: "BK-2849", guest: "Dr. Chukwuemeka Bello", av: "CB", type: "Suite", room: "501", nights: 3, eta: "14:00", rate: 91125, balance: 0, vip: true, assigned: true, group: false, requests: "Champagne + fruit basket on arrival", status: "Confirmed" },
    { id: "BK-2850", guest: "Adaeze Okonkwo", av: "AO", type: "Deluxe", room: "303", nights: 2, eta: "15:30", rate: 55000, balance: 27500, vip: false, assigned: true, group: false, requests: "High floor preferred", status: "Confirmed" },
    { id: "BK-2851", guest: "Emmanuel Adeyemi", av: "EA", type: "Standard", room: "", nights: 1, eta: "12:00", rate: 35000, balance: 35000, vip: false, assigned: false, group: false, requests: "", status: "Confirmed" },
    { id: "BK-2852", guest: "Fatima Al-Hassan", av: "FA", type: "Deluxe", room: "", nights: 4, eta: "16:00", rate: 55000, balance: 0, vip: true, assigned: false, group: false, requests: "Extra pillows, no smoking floor", status: "Pending" },
    { id: "BK-2853", guest: "Lagos Corp Group (8 pax)", av: "LC", type: "Standard", room: "108–115", nights: 2, eta: "13:00", rate: 35000, balance: 0, vip: false, assigned: true, group: true, requests: "Meeting room required", status: "Confirmed" },
  ];
  const filtered = AR.filter(a => {
    const ms = !arSearch || a.guest.toLowerCase().includes(arSearch.toLowerCase()) || a.id.includes(arSearch);
    const mt = arTab === "All" ? true : arTab === "VIP" ? a.vip : arTab === "Unassigned" ? !a.assigned : arTab === "Groups" ? a.group : arTab === "No-show Risk" ? a.balance > 0 && !a.assigned : true;
    return ms && mt;
  });
  const arrived = checkedIn.length;
  const pending = AR.filter(a => !checkedIn.includes(a.id)).length;
  return (
    <div>
      <PageHeader title="Today's Arrivals" sub="24 Jun 2025 · Business date" actions={<><BtnO label="Print Manifest" icon={FileText} /><BtnP label="Quick Check-In" icon={KeyRound} onClick={() => nav && nav("check-in", "Check-In")} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Expected" value={String(AR.length)} sub="Total today's arrivals" icon={CalendarCheck} accent={PRIMARY} />
        <StatCard label="Arrived" value={String(arrived)} sub="Checked in" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Pending" value={String(pending)} sub="Yet to arrive" icon={Clock} accent={WARNING} />
        <StatCard label="Unassigned" value={String(AR.filter(a => !a.assigned && !checkedIn.includes(a.id)).length)} sub="No room assigned" icon={AlertTriangle} accent={ERROR} />
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={arSearch} onChange={e => setArSearch(e.target.value)} placeholder="Search guest or reservation…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
        {["All", "VIP", "Unassigned", "Groups", "No-show Risk"].map(f => <button key={f} onClick={() => setArTab(f)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all" style={{ backgroundColor: arTab === f ? PRIMARY : "white", color: arTab === f ? "white" : MUTED, borderColor: arTab === f ? PRIMARY : BORDER }}>{f}</button>)}
        <span className="ml-auto text-xs font-medium" style={{ color: SUBTLE }}>{filtered.length} results</span>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["ETA / Res#", "Guest", "Room Type / Room", "Nights", "Rate / Night", "Balance", "Special Requests", "Status", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(a => {
              const done = checkedIn.includes(a.id);
              return (
                <tr key={a.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: done ? 0.55 : 1 }}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{a.eta}</div>
                    <div className="text-xs" style={{ color: PRIMARY, fontFamily: mono }}>{a.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: a.vip ? ORANGE : PRIMARY }}>{a.av}</div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-sm font-semibold" style={{ color: TEXT }}>{a.guest}</span>{a.vip && <Star size={10} fill={ORANGE} style={{ color: ORANGE }} />}{a.group && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Group</span>}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm" style={{ color: TEXT }}>{a.type}</div>
                    {a.assigned ? <div className="text-xs font-semibold" style={{ color: SUCCESS }}>Room {a.room}</div> : <div className="text-xs font-semibold" style={{ color: ERROR }}>Unassigned</div>}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{a.nights}n</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: SUCCESS, fontFamily: mono }}>₦{a.rate.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {a.balance > 0 ? <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{a.balance.toLocaleString()}</span> : <span className="text-xs font-semibold" style={{ color: SUCCESS }}>Settled</span>}
                  </td>
                  <td className="px-4 py-3 max-w-36">
                    {a.requests ? <span className="text-xs italic" style={{ color: MUTED }}>{a.requests}</span> : <span className="text-xs" style={{ color: SUBTLE }}>—</span>}
                  </td>
                  <td className="px-4 py-3"><Badge label={done ? "Checked In" : a.status} colors={done ? { bg: "#DCFCE7", text: "#166534" } : resStC[a.status] ?? { bg: "#F3F4F6", text: "#374151" }} /></td>
                  <td className="px-4 py-3">
                    {!done && (
                      <button onClick={() => { setCheckedIn(p => [...p, a.id]); add({ type: "success", title: "Check-in started", body: a.guest }); nav && nav("check-in", "Check-In"); }} className="text-xs px-3 py-1.5 rounded-xl font-bold text-white hover:opacity-90 transition-all whitespace-nowrap" style={{ backgroundColor: PRIMARY }}>Check In</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center"><CalendarCheck size={28} className="mx-auto mb-3" style={{ color: SUBTLE }} /><p className="text-sm" style={{ color: MUTED }}>No arrivals match your filters</p></div>}
      </div>
    </div>
  );
}

export function DeparturesScreen({ add, nav }: { add: (t: Omit<Toast, "id">) => void; nav?: (s: string, label: string) => void }) {
  const [checkedOut, setCheckedOut] = useState<string[]>([]);
  const DEP = [
    { room: "101", guest: "Adaeze Okonkwo", av: "AO", checkout: "11:00", nights: 3, balance: 0, method: "Card", hkSt: "Dirty", lateFlag: false, overstay: false },
    { room: "202", guest: "Emmanuel Adeyemi", av: "EA", checkout: "11:00", nights: 4, balance: 82100, method: "Cash", hkSt: "Occupied", lateFlag: false, overstay: false },
    { room: "304", guest: "Chukwuemeka Obi", av: "CO", checkout: "14:00", nights: 2, balance: 0, method: "Transfer", hkSt: "Occupied", lateFlag: true, overstay: false },
    { room: "501", guest: "Dr. Chukwuemeka Bello", av: "CB", checkout: "11:00", nights: 1, balance: 0, method: "Card", hkSt: "Occupied", lateFlag: false, overstay: false },
    { room: "410", guest: "Fatima Al-Hassan", av: "FA", checkout: "10:00", nights: 5, balance: 35200, method: "Card", hkSt: "Occupied", lateFlag: false, overstay: true },
  ];
  const departed = checkedOut.length;
  return (
    <div>
      <PageHeader title="Today's Departures" sub="24 Jun 2025 · Check-out deadline 11:00" actions={<><BtnO label="Print List" icon={FileText} /><BtnP label="Bulk Check-Out" icon={ArrowRight} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Expected" value={String(DEP.length)} sub="Departures today" icon={ArrowRight} accent={PRIMARY} />
        <StatCard label="Departed" value={String(departed)} sub="Checked out" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Pending" value={String(DEP.length - departed)} sub="Still in-house" icon={Clock} accent={WARNING} />
        <StatCard label="Overstay" value={String(DEP.filter(d => d.overstay && !checkedOut.includes(d.room)).length)} sub="Past checkout time" icon={AlertTriangle} accent={ERROR} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F8FAFC" }}>{["Room", "Guest", "Checkout Time", "Balance", "Payment on File", "HK Status", "Late CO", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {DEP.map(d => {
              const done = checkedOut.includes(d.room);
              const rowBg = d.overstay && !done ? "#FFF7ED" : done ? "#F0FDF4" : "transparent";
              return (
                <tr key={d.room} className="border-t transition-colors" style={{ borderColor: BORDER, backgroundColor: rowBg, opacity: done ? 0.6 : 1 }}>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ backgroundColor: d.overstay && !done ? ERROR : PRIMARY }}>{d.room}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>{d.av}</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: TEXT }}>{d.guest}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{d.nights} night{d.nights !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold" style={{ color: d.overstay && !done ? ERROR : TEXT, fontFamily: mono }}>{d.checkout}</div>
                    {d.overstay && !done && <div className="text-xs font-semibold" style={{ color: ERROR }}>Overstay</div>}
                  </td>
                  <td className="px-4 py-3">
                    {d.balance > 0 ? <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>₦{d.balance.toLocaleString()}</span> : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: SUCCESS }}><CheckCircle2 size={11} />Settled</span>}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{d.method}</td>
                  <td className="px-4 py-3"><Badge label={d.hkSt} colors={hkC[d.hkSt] ?? { bg: "#F3F4F6", text: "#374151" }} /></td>
                  <td className="px-4 py-3">{d.lateFlag && <Badge label="Late CO" colors={{ bg: "#FEF3C7", text: "#92400E" }} />}</td>
                  <td className="px-4 py-3">
                    {!done && (
                      <div className="flex gap-1.5">
                        <button onClick={() => { setCheckedOut(p => [...p, d.room]); add({ type: "info", title: "Check-out initiated", body: `Room ${d.room} · ${d.guest}` }); nav && nav("check-out", "Check-Out"); }} className="text-xs px-3 py-1.5 rounded-xl font-bold text-white hover:opacity-90 transition-all whitespace-nowrap" style={{ backgroundColor: TEAL }}>Check Out</button>
                        <button onClick={() => add({ type: "info", title: `Late checkout extended — Room ${d.room}` })} className="text-xs px-2.5 py-1.5 rounded-xl border font-semibold hover:bg-[#F4F4F5] transition-all" style={{ color: MUTED, borderColor: BORDER }}>Extend</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RoomAccessMgmt({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [revokeRoom, setRevokeRoom] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [unlockRoom, setUnlockRoom] = useState<string | null>(null);
  const [unlockPin, setUnlockPin] = useState("");
  const LOCKS = [
    { room: "101", lock: "SALTO L-101", provider: "SALTO KS", ref: "ks-lock-c8a3", battery: 78, lastSeen: "Today 09:41", firmware: "3.12.4", cards: 1, pins: 1, status: "Online" },
    { room: "202", lock: "SALTO L-202", provider: "SALTO KS", ref: "ks-lock-d5f7", battery: 55, lastSeen: "Today 09:40", firmware: "3.12.4", cards: 2, pins: 0, status: "Online" },
    { room: "203", lock: "SALTO L-203", provider: "SALTO KS", ref: "ks-lock-a2c1", battery: 12, lastSeen: "Today 09:38", firmware: "3.12.3", status: "Low Battery", cards: 1, pins: 1 },
    { room: "304", lock: "SALTO L-304", provider: "SALTO KS", ref: "ks-lock-b9e4", battery: 91, lastSeen: "Today 09:42", firmware: "3.12.4", cards: 1, pins: 0, status: "Online" },
    { room: "302", lock: "OSDP-302", provider: "OSDP", ref: "osdp-8801-E", battery: null, lastSeen: "Today 08:12", firmware: "1.4.0", cards: 1, pins: 0, status: "Online" },
    { room: "501", lock: "SALTO L-501", provider: "SALTO KS", ref: "ks-lock-e1d9", battery: 64, lastSeen: "Today 09:39", firmware: "3.12.4", cards: 1, pins: 1, status: "Online" },
  ];
  const PROVIDER_CAPS = { "SALTO KS": { cards: true, pin: true, mobileKey: false, offlineIssuance: true, remoteUnlock: true, auditReadback: true, immediateRevoke: false, gatewayRequired: true }, "OSDP": { cards: true, pin: false, mobileKey: false, offlineIssuance: false, remoteUnlock: false, auditReadback: false, immediateRevoke: true, gatewayRequired: false } };
  const battC = (b: number | null) => b === null ? SUBTLE : b < 20 ? ERROR : b < 40 ? WARNING : SUCCESS;
  const stC = (s: string) => s === "Online" ? { bg: "#DCFCE7", text: "#166534" } : s === "Low Battery" ? { bg: "#FEF3C7", text: "#92400E" } : { bg: "#FEE2E2", text: "#991B1B" };
  const caps = PROVIDER_CAPS["SALTO KS"];
  return (
    <div>
      <PageHeader title="Room Access Management" sub="Room × lock mapping, provider status, and remote actions"
        actions={<BtnO label="Key Card Log" icon={ClipboardList} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Locks Online" value={String(LOCKS.filter(l=>l.status==="Online").length)} sub="Responsive" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Low Battery" value={String(LOCKS.filter(l=>l.status==="Low Battery").length)} sub="Replace soon" icon={AlertTriangle} accent={WARNING} />
        <StatCard label="Active Credentials" value={String(LOCKS.reduce((s,l)=>s+l.cards+l.pins,0))} sub="Cards + PINs" icon={CreditCard} accent={PRIMARY} />
        <StatCard label="Provider" value="SALTO KS" sub="Primary lock system" icon={Shield} accent={TEAL} />
      </div>
      {/* Provider capability panel */}
      <div className="bg-white rounded-xl border p-5 mb-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Provider Capability Matrix</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(caps) as [string, boolean][]).map(([cap, supported]) => (
            <div key={cap} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ backgroundColor: supported ? "#F0FDF4" : "#F9FAFB", border: `1px solid ${supported ? "#BBF7D0" : BORDER}` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: supported ? SUCCESS : "#E2E8F0" }}>
                {supported ? <CheckCircle2 size={11} color="white" /> : <span style={{ fontSize: 10, color: MUTED }}>✕</span>}
              </div>
              <span className="text-xs font-medium" style={{ color: supported ? TEXT : MUTED }}>{cap.replace(/([A-Z])/g, " $1").trim()}</span>
            </div>
          ))}
        </div>
        {!caps.immediateRevoke && <p className="text-xs mt-3 p-2.5 rounded-lg" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>SALTO KS: revocations apply on next lock sync (typically under 30 s when gateway is reachable).</p>}
      </div>
      {/* Lock table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Lock × Room Mapping</span>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{LOCKS.length} locks</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Lock", "Provider", "Provider Ref", "Battery", "Last Seen", "Firmware", "Credentials", "Status", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {LOCKS.map(l => (
              <tr key={l.room} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 text-base font-bold" style={{ color: PRIMARY }}>{l.room}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{l.lock}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.provider}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.ref}</td>
                <td className="px-4 py-3">
                  {l.battery === null ? <span className="text-xs" style={{ color: SUBTLE }}>N/A</span> : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }}><div className="h-2 rounded-full" style={{ width: `${l.battery}%`, backgroundColor: battC(l.battery) }} /></div>
                      <span className="text-xs font-semibold" style={{ color: battC(l.battery), fontFamily: mono }}>{l.battery}%</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{l.lastSeen}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.firmware}</td>
                <td className="px-4 py-3 text-xs"><span style={{ color: TEXT }}>{l.cards} card{l.cards !== 1 ? "s" : ""}</span><span style={{ color: MUTED }}>{l.pins > 0 ? `, ${l.pins} PIN` : ""}</span></td>
                <td className="px-4 py-3"><Badge label={l.status} colors={stC(l.status)} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => add({ type: "info", title: `Connection test — Room ${l.room}`, body: "Lock responded in 340 ms" })} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Test</button>
                    {caps.remoteUnlock && <button onClick={() => { setUnlockRoom(l.room); setUnlockPin(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: PRIMARY, borderColor: `${PRIMARY}30` }}>Unlock</button>}
                    <button onClick={() => { setRevokeRoom(l.room); setRevokeReason(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Revoke All</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Emergency revoke modal */}
      {revokeRoom && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onClick={() => setRevokeRoom(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h2 className="text-base font-bold mb-1" style={{ color: ERROR }}>Emergency Revoke — Room {revokeRoom}</h2>
            <p className="text-sm mb-4" style={{ color: MUTED }}>All active key cards and PINs for Room {revokeRoom} will be deactivated. This action is audited.</p>
            <div className="space-y-2 mb-4">{["Security concern / suspected theft","Guest dispute","Incorrect room assigned","Other"].map(r => <label key={r} className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer" style={{ borderColor: revokeReason===r ? ERROR : BORDER, backgroundColor: revokeReason===r ? "#FEF2F2" : "white" }}><div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: revokeReason===r ? ERROR : "#CBD5E1", backgroundColor: revokeReason===r ? ERROR : "transparent" }} /><input type="radio" className="hidden" onChange={() => setRevokeReason(r)} /><span className="text-sm" style={{ color: TEXT }}>{r}</span></label>)}</div>
            <p className="text-xs mb-4 p-2.5 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>Revocations apply on next lock sync. Staff at the door are alerted immediately via the gateway.</p>
            <div className="flex gap-3"><button onClick={() => setRevokeRoom(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button><button disabled={!revokeReason} onClick={() => { add({ type: "error", title: `Emergency revoke — Room ${revokeRoom}`, body: "All credentials queued for revocation. Staff notified." }); setRevokeRoom(null); setRevokeReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Confirm</button></div>
          </div>
        </>
      )}

      {/* Remote unlock modal (permission-gated) */}
      {unlockRoom && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setUnlockRoom(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Remote Unlock — Room {unlockRoom}</h3>
            <p className="text-xs mb-4 p-2.5 rounded-lg" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>This action is audited. Enter your Manager PIN to authorise.</p>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" value={unlockPin} onChange={e => setUnlockPin(e.target.value)} placeholder="••••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none tracking-widest" style={{ borderColor: BORDER, fontFamily: mono }} /></div>
            <div className="flex gap-3 mt-4"><button onClick={() => setUnlockRoom(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button><button disabled={unlockPin.length < 4} onClick={() => { add({ type: "success", title: `Remote unlock — Room ${unlockRoom}`, body: "Lock opened for 10 s. Event recorded in audit log." }); setUnlockRoom(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Unlock Now</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function KeyCardLog() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("");
  const [search, setSearch] = useState("");
  const EVT_COLORS: Record<string, { bg: string; text: string }> = {
    "Issued": { bg: "#CCFBF1", text: "#0F766E" },
    "Duplicate Issued": { bg: "#DBEAFE", text: "#1E40AF" },
    "Replacement Issued": { bg: "#EEF2FF", text: "#4338CA" },
    "Revoked": { bg: "#FEE2E2", text: "#991B1B" },
    "Emergency Revoked": { bg: "#FEE2E2", text: "#7F1D1D" },
    "Encode Failed": { bg: "#FEE2E2", text: "#991B1B" },
    "API Failed": { bg: "#FEE2E2", text: "#991B1B" },
    "Queued Offline": { bg: "#FEF3C7", text: "#92400E" },
    "Sync Success": { bg: "#DCFCE7", text: "#166534" },
    "Sync Failed": { bg: "#FEE2E2", text: "#991B1B" },
    "PIN Issued": { bg: "#CCFBF1", text: "#0F766E" },
    "PIN Revoked": { bg: "#FEF3C7", text: "#92400E" },
  };
  const LOG = [
    { ts: "24 Jun 14:35", type: "Duplicate Issued", room: "202", guest: "Emmanuel Adeyemi", cred: "Key Card", ref: "KC-003", by: "Grace M.", ip: "192.168.1.12", detail: "Duplicate card requested by guest — original intact" },
    { ts: "24 Jun 14:10", type: "Issued", room: "501", guest: "Dr. Chukwuemeka Bello", cred: "Key Card", ref: "KC-005", by: "Grace M.", ip: "192.168.1.12", detail: "New check-in credential issued" },
    { ts: "24 Jun 10:00", type: "Issued", room: "304", guest: "Chukwuemeka Obi", cred: "Key Card", ref: "KC-004", by: "John A.", ip: "192.168.1.11", detail: "New check-in credential issued" },
    { ts: "23 Jun 16:00", type: "Revoked", room: "101", guest: "Adaeze Okonkwo", cred: "Key Card", ref: "KC-006", by: "John A.", ip: "192.168.1.11", detail: "Lost card reported by guest" },
    { ts: "23 Jun 14:35", type: "Sync Success", room: "202", guest: "Emmanuel Adeyemi", cred: "Key Card", ref: "KC-002", by: "System", ip: "—", detail: "Queued credential confirmed active by lock provider" },
    { ts: "23 Jun 14:12", type: "Issued", room: "202", guest: "Emmanuel Adeyemi", cred: "Key Card", ref: "KC-002", by: "John A.", ip: "192.168.1.11", detail: "Check-in credential issued" },
    { ts: "23 Jun 14:10", type: "Queued Offline", room: "202", guest: "Emmanuel Adeyemi", cred: "Key Card", ref: "KC-002", by: "John A.", ip: "192.168.1.11", detail: "Encoder offline — credential queued for sync" },
    { ts: "23 Jun 09:15", type: "PIN Issued", room: "101", guest: "Adaeze Okonkwo", cred: "PIN", ref: "PIN-101", by: "John A.", ip: "192.168.1.11", detail: "PIN generated for check-in" },
    { ts: "22 Jun 16:00", type: "Encode Failed", room: "304", guest: "Chukwuemeka Obi", cred: "Key Card", ref: "ERR-044", by: "Grace M.", ip: "192.168.1.12", detail: "Card encoder returned hardware fault — retried with new card" },
    { ts: "22 Jun 14:03", type: "Issued", room: "101", guest: "Adaeze Okonkwo", cred: "Key Card", ref: "KC-001", by: "John A.", ip: "192.168.1.11", detail: "New check-in credential issued" },
  ];
  const EVENT_TYPES = ["All", "Issued", "Duplicate Issued", "Replacement Issued", "Revoked", "Emergency Revoked", "Encode Failed", "API Failed", "Queued Offline", "Sync Success", "Sync Failed", "PIN Issued", "PIN Revoked"];
  const filtered = LOG.filter(l => {
    const ts = typeFilter === "All" || l.type === typeFilter;
    const rs = !roomFilter || l.room === roomFilter;
    const ss = !search || l.guest.toLowerCase().includes(search.toLowerCase()) || l.ref.toLowerCase().includes(search.toLowerCase()) || l.room.includes(search);
    return ts && rs && ss;
  });
  return (
    <div>
      <PageHeader title="Key Card Log" sub="Append-only event log · No delete affordance — retention per policy"
        actions={<><BtnO label="Export CSV" icon={Download} /><BtnO label="Export PDF" icon={FileText} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Events Today" value="7" sub="All credential events" icon={ClipboardList} accent={PRIMARY} />
        <StatCard label="Issued" value="4" sub="New credentials" icon={CreditCard} accent={SUCCESS} />
        <StatCard label="Revoked" value="1" sub="Access removed" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Failed / Queued" value="2" sub="Errors or offline" icon={AlertCircle} accent={WARNING} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest, ref, room…" className="pl-7 pr-3 py-1.5 text-xs rounded-xl border bg-white outline-none w-48" style={{ borderColor: BORDER }} /></div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-xl border bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-xl border bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}>
            <option value="">All Rooms</option>
            {["101","202","203","302","304","501"].map(r => <option key={r}>{r}</option>)}
          </select>
          <span className="ml-auto text-xs" style={{ color: SUBTLE }}>{filtered.length} events · Read-only</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Timestamp", "Event Type", "Room", "Guest", "Credential", "Ref", "Performed By", "IP", "Detail"].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED, fontFamily: mono }}>{l.ts}</td>
                <td className="px-4 py-3 whitespace-nowrap"><Badge label={l.type} colors={EVT_COLORS[l.type] ?? { bg: "#F3F4F6", text: "#374151" }} /></td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{l.room}</td>
                <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{l.guest}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.cred}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{l.ref}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{l.by}</td>
                <td className="px-4 py-3 text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{l.ip}</td>
                <td className="px-4 py-3 text-xs max-w-48" style={{ color: MUTED }}>{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={ClipboardList} message="No events match your filters." />}
        <div className="px-5 py-3 border-t text-xs" style={{ borderColor: BORDER, color: SUBTLE, backgroundColor: "#F9FAFB" }}>
          Retention policy: 2 years per data policy. No deletion affordance. Export for compliance use.
        </div>
      </div>
    </div>
  );
}

export function PINManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [showGenerate, setShowGenerate] = useState(false);
  const [genRes, setGenRes] = useState("BK-2848");
  const [genRoom, setGenRoom] = useState("202");
  const [genHrs, setGenHrs] = useState("48");
  const [generatedPIN, setGeneratedPIN] = useState<string | null>(null);
  const [pinAcknowledged, setPinAcknowledged] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const PIN_SUPPORTED = true; // Would be false if provider is OSDP-only
  const pinStC: Record<string, { bg: string; text: string }> = {
    "Active": { bg: "#DCFCE7", text: "#166534" },
    "Expiring": { bg: "#FEF3C7", text: "#92400E" },
    "Expired": { bg: "#F3F4F6", text: "#374151" },
    "Revoked": { bg: "#FEE2E2", text: "#991B1B" },
  };
  const [pins, setPins] = useState([
    { id: "PIN-101", room: "101", res: "BK-2845", guest: "Adaeze Okonkwo", hint: "73**19", validFrom: "22 Jun 14:03", validTo: "25 Jun 12:00", status: "Active", by: "John A." },
    { id: "PIN-501", room: "501", res: "BK-2854", guest: "Dr. Chukwuemeka Bello", hint: "44**83", validFrom: "24 Jun 14:10", validTo: "27 Jun 12:00", status: "Active", by: "Grace M." },
    { id: "PIN-202X", room: "202", res: "BK-2847", guest: "Previous Guest", hint: "91**54", validFrom: "21 Jun 12:00", validTo: "23 Jun 12:00", status: "Expired", by: "John A." },
  ]);
  const generateRandom6 = () => String(Math.floor(100000 + Math.random() * 900000));
  const handleGenerate = () => {
    const pin = generateRandom6();
    setGeneratedPIN(pin);
    setPinAcknowledged(false);
  };
  const savePIN = () => {
    if (!pinAcknowledged || !generatedPIN) return;
    const masked = generatedPIN.slice(0,2) + "**" + generatedPIN.slice(-2);
    setPins(prev => [...prev, { id: `PIN-${genRoom}-${Date.now()}`, room: genRoom, res: genRes, guest: "Emmanuel Adeyemi", hint: masked, validFrom: "24 Jun " + new Date().getHours() + ":00", validTo: "25 Jun 12:00", status: "Active", by: "Grace M." }]);
    add({ type: "success", title: `PIN generated — Room ${genRoom}`, body: "Shown once only — now masked." });
    setShowGenerate(false); setGeneratedPIN(null); setPinAcknowledged(false);
  };
  if (!PIN_SUPPORTED) return (
    <div>
      <PageHeader title="PIN Management" sub="PIN access not supported by configured lock provider" />
      <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BORDER }}>
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: "#F3F4F6" }}><Hash size={24} style={{ color: MUTED }} /></div>
        <h3 className="text-base font-semibold mb-1" style={{ color: TEXT }}>PIN Not Supported</h3>
        <p className="text-sm" style={{ color: MUTED }}>The configured lock provider (OSDP) does not support PIN codes. Configure a compatible provider to enable this feature.</p>
      </div>
    </div>
  );
  return (
    <div>
      <PageHeader title="PIN Management" sub="All active door PINs across the property · SALTO KS"
        actions={<><BtnO label="Key Card Log" icon={ClipboardList} /><BtnP label="Generate PIN" icon={Plus} onClick={() => { setShowGenerate(true); setGeneratedPIN(null); }} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active PINs" value={String(pins.filter(p=>p.status==="Active").length)} sub="Currently valid" icon={Hash} accent={SUCCESS} />
        <StatCard label="Generated Today" value="2" sub="New PINs" icon={Plus} accent={PRIMARY} />
        <StatCard label="Expired" value={String(pins.filter(p=>p.status==="Expired").length)} sub="Lapsed" icon={Clock} accent={MUTED} />
        <StatCard label="Revoked" value={String(pins.filter(p=>p.status==="Revoked").length)} sub="Deactivated" icon={AlertTriangle} accent={ERROR} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>Active PINs</span>
          <div className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>PINs are shown once at generation — masked permanently thereafter</div>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest / Res", "PIN Reference", "Valid From", "Valid To", "Status", "Issued By", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {pins.map(p => (
              <tr key={p.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: ["Expired","Revoked"].includes(p.status) ? 0.55 : 1 }}>
                <td className="px-4 py-3 text-base font-bold" style={{ color: PRIMARY }}>{p.room}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>{p.guest}</div>
                  <div className="text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.res}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tracking-widest" style={{ fontFamily: mono, color: TEXT, letterSpacing: "0.2em" }}>{p.hint}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F3F4F6", color: MUTED }}>masked</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.validFrom}</td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{p.validTo}</td>
                <td className="px-4 py-3"><Badge label={p.status} colors={pinStC[p.status] ?? { bg: "#F3F4F6", text: "#374151" }} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{p.by}</td>
                <td className="px-4 py-3">
                  {p.status === "Active" && <button onClick={() => setRevokeId(p.id)} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Revoke</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate PIN modal */}
      {showGenerate && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ backgroundColor: "rgba(13,27,46,0.55)" }} onClick={() => { if (!generatedPIN) setShowGenerate(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ border: `1px solid ${BORDER}` }}>
            {!generatedPIN ? (
              <>
                <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Generate PIN</h3>
                <div className="space-y-3">
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Reservation</label><select value={genRes} onChange={e => setGenRes(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option>BK-2845 — Adaeze Okonkwo · Room 101</option><option>BK-2848 — Emmanuel Adeyemi · Room 202</option><option>BK-2852 — Chukwuemeka Obi · Room 304</option><option>BK-2854 — Dr. Chukwuemeka Bello · Room 501</option></select></div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Room</label><input value={genRoom} onChange={e => setGenRoom(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                  <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Validity</label><select value={genHrs} onChange={e => setGenHrs(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}><option value="24">24 hours</option><option value="48">48 hours</option><option value="72">72 hours</option></select></div>
                </div>
                <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowGenerate(false)} /><button onClick={handleGenerate} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Generate</button></div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: "#FEF3C7" }}><Hash size={22} style={{ color: ORANGE }} /></div>
                  <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>PIN Generated — Show Once</h3>
                  <p className="text-xs" style={{ color: MUTED }}>This PIN cannot be retrieved again after this dialog closes. It will be masked permanently.</p>
                </div>
                <div className="p-5 rounded-2xl text-center mb-4" style={{ backgroundColor: "#0F2044", border: "2px solid #1BA39C" }}>
                  <div className="text-5xl font-black tracking-[0.35em] text-white" style={{ fontFamily: mono }}>{generatedPIN}</div>
                  <div className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>Room {genRoom} · Valid {genHrs}h · SALTO KS</div>
                </div>
                <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer mb-4" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <input type="checkbox" checked={pinAcknowledged} onChange={e => setPinAcknowledged(e.target.checked)} className="mt-0.5 flex-shrink-0 w-4 h-4" />
                  <span className="text-xs font-semibold" style={{ color: "#92400E" }}>I have noted this PIN and understand it cannot be retrieved again once this dialog is closed.</span>
                </label>
                <div className="flex gap-3"><button onClick={() => { setGeneratedPIN(null); setShowGenerate(false); }} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ color: MUTED, borderColor: BORDER }}>Discard</button><button disabled={!pinAcknowledged} onClick={savePIN} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Save &amp; Close</button></div>
              </>
            )}
          </div>
        </>
      )}

      {/* Revoke modal */}
      {revokeId && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setRevokeId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: ERROR }}>Revoke PIN</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>PIN {pins.find(p=>p.id===revokeId)?.hint} for Room {pins.find(p=>p.id===revokeId)?.room} will be deactivated. This action is audited.</p>
            <p className="text-xs mb-4 p-2.5 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>SALTO KS: revocation applies on next lock sync (~30 s).</p>
            <div className="flex gap-3"><button onClick={() => setRevokeId(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button><button onClick={() => { setPins(ps => ps.map(p => p.id === revokeId ? {...p, status: "Revoked"} : p)); add({ type: "warning", title: `PIN revoked — Room ${pins.find(p=>p.id===revokeId)?.room}` }); setRevokeId(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: ERROR }}>Confirm Revoke</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function ShiftHandover({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type HSection = { key: string; label: string; placeholder: string };
  const SECTIONS: HSection[] = [
    { key:"tasks",      label:"Outstanding Tasks",            placeholder:"e.g. Room 304 late checkout approved until 14:00." },
    { key:"vip",        label:"VIP Guests In-House",          placeholder:"e.g. Dr. Bello (Suite 501) — VIP arrival 18:30. Setup confirmed." },
    { key:"maintenance",label:"Maintenance Issues Open",      placeholder:"e.g. WO-0090 — AC in Room 316. SLA breached, escalate if unresolved." },
    { key:"complaints", label:"Complaints & Guest Issues",    placeholder:"e.g. Room 310 noise complaint. Both parties spoken to." },
    { key:"payments",   label:"Pending Payments",             placeholder:"e.g. Emmanuel Adeyemi (202) — ₦45,000 outstanding." },
    { key:"notes",      label:"General Notes",                placeholder:"e.g. Housekeeping short-staffed — Chidi on leave. ~30 min delay." },
  ];
  const PRIOR = [
    { label:"14 Oct 15:00", lead:"Grace Mensah",  dept:"Morning → Evening", acked:true  },
    { label:"13 Oct 23:00", lead:"David Okafor",  dept:"Evening → Night",   acked:true  },
    { label:"13 Oct 07:00", lead:"Tobi Okeke",    dept:"Night → Morning",   acked:true  },
  ];
  const DEPTS = ["All Departments","Front Desk","Housekeeping","Maintenance","F&B","Security"];

  const [dept, setDept]           = useState("All Departments");
  const [notes, setNotes]         = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [acked, setAcked]         = useState(false);
  const [viewPrior, setViewPrior] = useState<typeof PRIOR[number]|null>(null);
  const [search, setSearch]       = useState("");

  const filteredPrior = PRIOR.filter(p => p.label.toLowerCase().includes(search.toLowerCase()) || p.lead.toLowerCase().includes(search.toLowerCase()));

  if (submitted && !acked) return (
    <div>
      <PageHeader title="Shift Handover" sub="Submitted · Awaiting acknowledgement" />
      <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BORDER }}>
        <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: SUCCESS }} />
        <h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Handover Submitted</h2>
        <p className="text-sm mb-5" style={{ color: MUTED }}>David Okafor (Evening Lead) has been notified and must acknowledge before taking over.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: "#FFFBEB", border:`1px solid #FDE68A` }}>
          <Clock size={14} style={{ color: WARNING }} />
          <span className="text-sm font-medium" style={{ color:"#92400E" }}>Pending acknowledgement from Evening Lead</span>
        </div>
        <br />
        <button onClick={() => { setAcked(true); add({ type:"success", title:"Handover acknowledged — Evening shift active" }); }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          Simulate: Acknowledge as Incoming Lead
        </button>
      </div>
    </div>
  );

  if (acked) return (
    <div>
      <PageHeader title="Shift Handover" sub="Acknowledged · Evening shift active" actions={<button onClick={() => { setSubmitted(false); setAcked(false); setNotes({}); }} className="text-xs px-3 py-2 rounded-xl border font-semibold" style={{ color:MUTED, borderColor:BORDER }}>New Handover</button>} />
      <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: BORDER }}>
        <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: SUCCESS }} />
        <h2 className="text-base font-semibold mb-1" style={{ color: TEXT }}>Handover Complete</h2>
        <p className="text-sm" style={{ color: MUTED }}>Acknowledged by David Okafor · 14 Oct 2025 at 15:03</p>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Shift Handover" sub="Morning Shift → Evening Shift · 14 Oct 2025"
        actions={
          <select value={dept} onChange={e=>setDept(e.target.value)} className="px-3 py-2 text-sm rounded-xl border outline-none" style={{ borderColor:BORDER, color:TEXT }}>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {SECTIONS.map(s => (
            <div key={s.key} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: TEXT }}>{s.label}</h3>
              <textarea value={notes[s.key]??""} onChange={e=>setNotes(n=>({...n,[s.key]:e.target.value}))}
                placeholder={s.placeholder}
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none" rows={3}
                style={{ borderColor: BORDER, color: TEXT, backgroundColor:"#FAFAFA" }} />
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => add({ type:"info", title:"Draft saved" })} className="px-4 py-2.5 rounded-xl text-sm font-semibold border" style={{ color:MUTED, borderColor:BORDER }}>Save Draft</button>
            <button onClick={() => { setSubmitted(true); add({ type:"success", title:"Shift handover submitted", body:"Evening lead notified" }); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <CheckCircle2 size={15} /> Submit Handover
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4 sticky top-4" style={{ borderColor: BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Shift Details</h3>
            {([["Outgoing Shift","Morning · 07:00–15:00"],["Outgoing Lead","Grace Mensah"],["Incoming Shift","Evening · 15:00–23:00"],["Incoming Lead","David Okafor"],["Date","14 Oct 2025"],["Department",dept]] as [string,string][]).map(([k,v]) => (
              <div key={k} className="flex justify-between text-xs mb-2"><span style={{ color:MUTED }}>{k}</span><span className="font-medium" style={{ color:TEXT }}>{v}</span></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER, boxShadow:"0 1px 3px rgba(13,27,46,0.06)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: TEXT }}>Prior Handovers</h3>
            <div className="relative mb-3">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color:SUBTLE }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search handovers…" className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none" style={{ borderColor:BORDER }} />
            </div>
            {filteredPrior.map((p,i) => (
              <button key={i} onClick={()=>setViewPrior(p)} className="w-full flex items-center justify-between py-2 text-xs border-b" style={{ borderColor:"#F4F4F5" }}>
                <div>
                  <div className="font-medium text-left" style={{ color:TEXT }}>{p.label}</div>
                  <div style={{ color:MUTED }}>{p.lead} · {p.dept}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.acked && <CheckCircle2 size={12} style={{ color:SUCCESS }} />}
                  <Eye size={12} style={{ color:SUBTLE }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewPrior && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.4)" }} onClick={()=>setViewPrior(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-96" style={{ border:`1px solid ${BORDER}` }}>
            <div className="flex justify-between items-start mb-4">
              <div><div className="text-sm font-bold" style={{ color:TEXT }}>{viewPrior.label}</div><div className="text-xs" style={{ color:MUTED }}>{viewPrior.lead} · {viewPrior.dept}</div></div>
              <button onClick={()=>setViewPrior(null)}><X size={16} style={{ color:SUBTLE }} /></button>
            </div>
            {SECTIONS.map(s=>(
              <div key={s.key} className="mb-3">
                <div className="text-xs font-semibold mb-1" style={{ color:MUTED }}>{s.label}</div>
                <div className="text-sm p-2.5 rounded-lg" style={{ backgroundColor:"#F9FAFB", color:TEXT }}>
                  {s.placeholder.replace("e.g. ","")}
                </div>
              </div>
            ))}
            {viewPrior.acked && <div className="flex items-center gap-1.5 text-xs mt-3" style={{ color:SUCCESS }}><CheckCircle2 size={12} />Acknowledged by incoming lead</div>}
          </div>
        </>
      )}
    </div>
  );
}

export function GuestMessaging({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type Thread = { name:string; room:string; dept:string; channel:"WhatsApp"|"SMS"|"In-App"; unread:number; slaMinutes:number; status:"Open"|"Resolved"|"Escalated"; lastMsg:string; msgs:Array<{text:string;from:string;time:string}> };
  const THREADS: Thread[] = [
    { name:"Adaeze Okonkwo",     room:"101", dept:"Housekeeping", channel:"WhatsApp", unread:1, slaMinutes:8,  status:"Open",
      lastMsg:"Thank you so much!",
      msgs:[{text:"Hello, could I get extra towels in my room please?",from:"guest",time:"09:12"},{text:"Of course! I'll have housekeeping bring them up right away.",from:"staff",time:"09:14"},{text:"Thank you so much!",from:"guest",time:"09:15"}] },
    { name:"Emmanuel Adeyemi",    room:"202", dept:"F&B",          channel:"In-App",  unread:0, slaMinutes:25, status:"Open",
      lastMsg:"Would you like a reservation?",
      msgs:[{text:"What time does the restaurant open for dinner?",from:"guest",time:"08:45"},{text:"The restaurant opens at 18:00. Would you like a reservation?",from:"staff",time:"08:47"}] },
    { name:"Dr. Chukwuemeka Bello",room:"501",dept:"Front Desk",   channel:"WhatsApp",unread:0, slaMinutes:60, status:"Resolved",
      lastMsg:"Suite 501 is fully prepared.",
      msgs:[{text:"I'll be arriving at approximately 18:30. Please ensure the champagne is ready.",from:"guest",time:"11:00"},{text:"Absolutely, Doctor. Suite 501 is fully prepared. We look forward to welcoming you!",from:"staff",time:"11:03"}] },
    { name:"Ngozi Adichie",       room:"306", dept:"Front Desk",   channel:"SMS",     unread:2, slaMinutes:3,  status:"Open",
      lastMsg:"The wifi is not working in my room.",
      msgs:[{text:"The wifi is not working in my room. Can someone assist?",from:"guest",time:"13:55"}] },
    { name:"Tunde Bakare",        room:"411", dept:"Maintenance",  channel:"In-App",  unread:0, slaMinutes:45, status:"Escalated",
      lastMsg:"This is the third time I am reporting this.",
      msgs:[{text:"The air conditioning in my room is still not fixed.",from:"guest",time:"12:10"},{text:"Our technician is on the way, sir. Apologies for the delay.",from:"staff",time:"12:15"},{text:"This is the third time I am reporting this.",from:"guest",time:"12:30"}] },
  ];
  const CANNED = [
    "Thank you for reaching out. Our team will attend to this right away.",
    "Apologies for the inconvenience. We are working on this immediately.",
    "Our housekeeping team will be at your room within 15 minutes.",
    "Your request has been noted. A staff member will assist you shortly.",
    "The issue has been escalated to our maintenance team.",
  ];
  const slaColor = (m: number) => m <= 5 ? ERROR : m <= 15 ? WARNING : m <= 30 ? ORANGE : SUCCESS;

  const [active, setActive]     = useState(THREADS[0].name);
  const [msg, setMsg]           = useState("");
  const [deptF, setDeptF]       = useState("All");
  const [showCanned, setShowCanned] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [active]);

  const cur = THREADS.find(t => t.name === active) ?? THREADS[0];
  const depts = ["All", ...Array.from(new Set(THREADS.map(t => t.dept)))];
  const filtered = THREADS.filter(t => deptF === "All" || t.dept === deptF);

  const sendMsg = () => { if (!msg.trim()) return; add({ type:"success", title:"Message sent", body:`→ ${cur.name} · ${cur.channel}` }); setMsg(""); };

  return (
    <div>
      <PageHeader title="Guest Messaging" sub="In-house guest communications with SLA tracking"
        actions={
          <select value={deptF} onChange={e=>setDeptF(e.target.value)} className="px-3 py-2 text-sm rounded-xl border outline-none" style={{ borderColor:BORDER, color:TEXT }}>
            {depts.map(d=><option key={d}>{d}</option>)}
          </select>
        }
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Open Threads"    value={String(THREADS.filter(t=>t.status==="Open").length)}    sub="Awaiting reply"  icon={MessageSquare} accent={PRIMARY} />
        <StatCard label="Unread"          value={String(THREADS.reduce((s,t)=>s+t.unread,0))}           sub="Need attention"  icon={AlertCircle}   accent={ERROR}   />
        <StatCard label="Resolved Today"  value="8"                                                      sub="Closed threads"  icon={CheckCircle2}  accent={SUCCESS} />
      </div>

      <div className="bg-white rounded-xl border flex overflow-hidden" style={{ borderColor:BORDER, height:560 }}>
        {/* Thread list */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ borderColor:BORDER }}>
          <div className="p-2 border-b" style={{ borderColor:BORDER }}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border" style={{ borderColor:BORDER, backgroundColor:"#F9FAFB" }}>
              <Search size={11} style={{ color:SUBTLE }} />
              <input placeholder="Search guests…" className="flex-1 text-xs outline-none bg-transparent" style={{ color:TEXT }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
            {filtered.map(t => (
              <button key={t.name} onClick={()=>setActive(t.name)}
                className="w-full flex items-start gap-3 px-3 py-3 text-left border-b"
                style={{ borderColor:"#F9FAFB", backgroundColor:active===t.name?"#EFF6FF":"transparent", borderLeft:`3px solid ${active===t.name?PRIMARY:"transparent"}` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor:PRIMARY }}>
                  {t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="text-xs font-semibold truncate" style={{ color:TEXT }}>{t.name}</div>
                    {t.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor:ERROR, fontSize:9 }}>{t.unread}</span>}
                  </div>
                  <div className="text-xs truncate mb-1" style={{ color:MUTED }}>{t.lastMsg}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color:SUBTLE }}>Rm {t.room} · {t.channel}</span>
                    {t.status==="Open" && <span className="text-xs font-semibold" style={{ color:slaColor(t.slaMinutes) }}>SLA {t.slaMinutes}m</span>}
                    {t.status==="Resolved" && <span className="text-xs" style={{ color:SUCCESS }}>Resolved</span>}
                    {t.status==="Escalated" && <span className="text-xs font-semibold" style={{ color:ERROR }}>Escalated</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread detail */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:BORDER, backgroundColor:"#F9FAFB" }}>
            <div>
              <div className="text-sm font-semibold" style={{ color:TEXT }}>{cur.name}</div>
              <div className="text-xs" style={{ color:MUTED }}>Room {cur.room} · {cur.dept} · via {cur.channel}</div>
            </div>
            <div className="flex items-center gap-2">
              {cur.status==="Open" && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor:`${slaColor(cur.slaMinutes)}15`, color:slaColor(cur.slaMinutes) }}>
                  <Clock size={11} />SLA {cur.slaMinutes}m remaining
                </div>
              )}
              <button onClick={()=>setShowEscalate(true)} className="text-xs px-3 py-1.5 rounded-xl border font-semibold" style={{ color:ERROR, borderColor:`${ERROR}30` }}>
                Escalate
              </button>
              <button onClick={()=>add({type:"success",title:`Thread resolved — ${cur.name}`})} className="text-xs px-3 py-1.5 rounded-xl text-white font-semibold" style={{ backgroundColor:SUCCESS }}>
                Resolve
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth:"none" }}>
            {cur.msgs.map((m,i) => (
              <div key={i} className={`flex ${m.from==="staff"?"justify-end":"justify-start"}`}>
                <div className="max-w-sm">
                  <div className="px-3 py-2 rounded-xl text-sm leading-relaxed" style={{ backgroundColor:m.from==="staff"?PRIMARY:"#F4F4F5", color:m.from==="staff"?"white":TEXT }}>{m.text}</div>
                  <div className="text-xs mt-1" style={{ color:SUBTLE, textAlign:m.from==="staff"?"right":"left", fontFamily:mono }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="px-5 py-3 border-t" style={{ borderColor:BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <select value={cur.channel} className="text-xs px-2 py-1 rounded border outline-none" style={{ borderColor:BORDER, color:MUTED }}>
                {["WhatsApp","SMS","In-App"].map(c=><option key={c}>{c}</option>)}
              </select>
              <button onClick={()=>setShowCanned(c=>!c)} className="text-xs px-2 py-1 rounded border" style={{ color:MUTED, borderColor:BORDER }}>Canned Responses</button>
            </div>
            {showCanned && (
              <div className="mb-2 border rounded-xl overflow-hidden" style={{ borderColor:BORDER }}>
                {CANNED.map((r,i) => (
                  <button key={i} onClick={()=>{ setMsg(r); setShowCanned(false); }} className="w-full text-left px-3 py-2 text-xs border-b hover:bg-slate-50" style={{ borderColor:"#F4F4F5", color:TEXT }}>{r}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                placeholder="Type a reply…" className="flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }} />
              <button onClick={sendMsg} className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor:PRIMARY }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEscalate && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.45)" }} onClick={()=>setShowEscalate(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-96" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-1" style={{ color:TEXT }}>Escalate to Complaint</h3>
            <p className="text-xs mb-3" style={{ color:MUTED }}>This will create a complaint record and notify the CS team.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Category</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                  {["Room Maintenance","Food & Beverage","Service Quality","Noise / Disturbance","Billing Issue","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Severity</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor:BORDER, color:TEXT }}>
                  {["Low","Medium","High","Critical"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-semibold mb-1 block" style={{ color:MUTED }}>Notes for CS Team</label>
                <textarea rows={3} placeholder="Context for the complaint handler…" className="w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none" style={{ borderColor:BORDER, color:TEXT }} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <BtnO label="Cancel" onClick={()=>setShowEscalate(false)} />
              <button onClick={()=>{ add({type:"warning",title:`Complaint created for ${cur.name}`}); setShowEscalate(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor:ERROR }}>Escalate</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function KitchenDisplay() {
  type KDSStatus = "New" | "Preparing" | "Ready" | "Served";
  type KDSOrder = { id: string; table: string; items: Array<{ name: string; mod: string }>; elapsed: number; status: KDSStatus; priority?: boolean };

  const INITIAL: KDSOrder[] = [
    { id: "ORD-041", table: "T02", items: [{ name: "Jollof Rice + Chicken", mod: "Extra spicy" }, { name: "Chapman", mod: "" }], elapsed: 4, status: "New", priority: false },
    { id: "ORD-040", table: "T06", items: [{ name: "Egusi Soup + Pounded Yam", mod: "" }, { name: "Grilled Fish", mod: "No pepper" }], elapsed: 12, status: "Preparing", priority: false },
    { id: "ORD-039", table: "Room 304", items: [{ name: "Suya", mod: "Extra spice" }, { name: "Bottled Water ×2", mod: "" }], elapsed: 21, status: "Preparing", priority: true },
    { id: "ORD-038", table: "T09", items: [{ name: "Spring Rolls (6pc)", mod: "" }, { name: "Chapman", mod: "" }], elapsed: 6, status: "New", priority: false },
    { id: "ORD-037", table: "T12", items: [{ name: "Pepper Soup", mod: "Extra pepper" }, { name: "Zobo", mod: "" }], elapsed: 18, status: "Ready", priority: false },
    { id: "ORD-036", table: "T03", items: [{ name: "Fruit Salad", mod: "" }], elapsed: 9, status: "Ready", priority: false },
  ];

  const [orders, setOrders] = useState<KDSOrder[]>(INITIAL);
  const [recalled, setRecalled] = useState<KDSOrder[]>([]);
  const [elapsed, setElapsed] = useState<Record<string, number>>(Object.fromEntries(INITIAL.map(o => [o.id, o.elapsed])));
  const [newAlert, setNewAlert] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setElapsed(p => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v + 1]))), 60000);
    return () => clearInterval(id);
  }, []);

  // Simulate new order alert
  useEffect(() => {
    const id = setTimeout(() => setNewAlert(true), 3000);
    return () => clearTimeout(id);
  }, []);

  const advance = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const next: Record<KDSStatus, KDSStatus | "done"> = { New: "Preparing", Preparing: "Ready", Ready: "Served", Served: "done" };
      const n = next[o.status];
      if (n === "done") { setRecalled(r => [{ ...o, status: "Served" }, ...r.slice(0, 4)]); return o; }
      return { ...o, status: n as KDSStatus };
    }).filter(o => o.status !== "Served" || orders.find(x=>x.id===orderId)?.status !== "Ready"));
  };

  const bumpAndServe = (orderId: string) => {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    setRecalled(r => [{ ...o, status: "Served" }, ...r.slice(0, 4)]);
    setOrders(prev => prev.filter(x => x.id !== orderId));
  };

  const STATUSES: KDSStatus[] = ["New","Preparing","Ready"];
  const colCfg: Record<KDSStatus, { bg: string; header: string; btnLabel: string; btnColor: string }> = {
    New:       { bg: "#EFF6FF", header: PRIMARY,  btnLabel: "START →",   btnColor: PRIMARY },
    Preparing: { bg: "#FEF9EC", header: ORANGE,   btnLabel: "READY →",   btnColor: ORANGE },
    Ready:     { bg: "#F0FDF4", header: SUCCESS,  btnLabel: "SERVED ✓",  btnColor: SUCCESS },
    Served:    { bg: "#F9FAFB", header: MUTED,    btnLabel: "Recalled",  btnColor: MUTED },
  };

  const ageColor = (e: number) => e > 20 ? ERROR : e > 12 ? ORANGE : e > 8 ? WARNING : TEXT;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xl font-bold" style={{ color: TEXT }}>Kitchen Display</div>
          <div className="text-xs" style={{ color: MUTED }}>Live order queue · Status advances on BUMP</div>
        </div>
        <div className="flex items-center gap-3">
          {newAlert && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl animate-pulse" style={{ backgroundColor: "#FEE2E2", border: `1px solid ${ERROR}` }}>
              <Bell size={14} style={{ color: ERROR }} />
              <span className="text-xs font-bold" style={{ color: ERROR }}>NEW ORDER</span>
              <button onClick={() => setNewAlert(false)} style={{ color: ERROR }}><X size={12} /></button>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}><span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: SUCCESS }} />Live</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4" style={{ fontSize: 12 }}>
        {STATUSES.map(s => ({ s, count: orders.filter(o=>o.status===s).length })).concat([{s:"Served" as KDSStatus, count: recalled.length}]).map(({s, count}) => (
          <div key={s} className="rounded-xl p-3 text-center border" style={{ backgroundColor: colCfg[s].bg, borderColor: `${colCfg[s].header}20` }}>
            <div className="text-2xl font-black" style={{ color: colCfg[s].header, fontFamily: mono }}>{count}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: colCfg[s].header }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-3 gap-4">
        {STATUSES.map(status => {
          const col = colCfg[status];
          const colOrders = orders.filter(o => o.status === status).sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0) || (elapsed[b.id] ?? b.elapsed) - (elapsed[a.id] ?? a.elapsed));
          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-sm font-bold uppercase tracking-wide" style={{ color: col.header }}>{status}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${col.header}15`, color: col.header }}>{colOrders.length}</span>
              </div>
              <div className="space-y-3">
                {colOrders.map(o => {
                  const liveE = elapsed[o.id] ?? o.elapsed;
                  return (
                    <div key={o.id} className="rounded-xl border-2 p-4 flex flex-col" style={{ backgroundColor: col.bg, borderColor: o.priority ? ERROR : `${col.header}30` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-black" style={{ color: TEXT }}>{o.table}</span>
                            {o.priority && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: "#FEE2E2", color: ERROR }}>PRIORITY</span>}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{o.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black" style={{ color: ageColor(liveE), fontFamily: mono }}>{liveE}m</div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 mb-3">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: col.header }} />
                            <div>
                              <div className="text-sm font-semibold leading-tight" style={{ color: TEXT }}>{item.name}</div>
                              {item.mod && <div className="text-xs italic mt-0.5" style={{ color: MUTED }}>{item.mod}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => status === "Ready" ? bumpAndServe(o.id) : advance(o.id)} className="w-full py-3 rounded-xl text-sm font-black text-white tracking-wide" style={{ backgroundColor: col.btnColor }}>
                        {col.btnLabel}
                      </button>
                    </div>
                  );
                })}
                {colOrders.length === 0 && <div className="rounded-xl border-2 border-dashed p-8 flex items-center justify-center text-sm" style={{ borderColor: `${col.header}20`, color: SUBTLE }}>Empty</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recalled served orders */}
      {recalled.length > 0 && (
        <div className="mt-4 bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Recently Served — Recall</div>
          <div className="flex gap-3 flex-wrap">
            {recalled.map(o => (
              <div key={o.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border" style={{ borderColor: BORDER }}>
                <span className="font-bold" style={{ color: TEXT }}>{o.table}</span>
                <span style={{ color: SUBTLE }}>{o.id}</span>
                <button onClick={() => { setRecalled(r => r.filter(x=>x.id!==o.id)); setOrders(p => [...p, { ...o, status: "Preparing" as KDSStatus }]); }} className="text-xs px-2 py-0.5 rounded" style={{ color: ORANGE, backgroundColor: "#FEF3C7" }}>Recall</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MenuManagement({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const [activeCat, setActiveCat] = useState("Mains");
  const [dayPart, setDayPart] = useState("All");
  const [showBulkPrice, setShowBulkPrice] = useState(false);
  const [bulkPct, setBulkPct] = useState("10");
  const [bulkOp, setBulkOp] = useState("increase");

  const FULL_MENU_MGT = [
    { id: 1, name: "Jollof Rice + Chicken", cat: "Mains", dayParts: ["Lunch","Dinner"], price: 4500, cost: 1800, prep: 25, avail: true, allergens: ["Gluten"], dietary: ["Halal"], mods: ["Extra spicy","No pepper"], desc: "Smoky party jollof with grilled chicken thigh" },
    { id: 2, name: "Egusi Soup + Pounded Yam", cat: "Mains", dayParts: ["Lunch","Dinner"], price: 5200, cost: 2100, prep: 30, avail: true, allergens: ["Nuts"], dietary: [], mods: ["Extra soup","Half portion"], desc: "Traditional melon seed soup with pounded yam" },
    { id: 3, name: "Grilled Fish (Tilapia)", cat: "Mains", dayParts: ["Lunch","Dinner","Room Service"], price: 6800, cost: 2800, prep: 20, avail: true, allergens: ["Fish"], dietary: ["Gluten-free"], mods: ["No pepper","Extra lemon"], desc: "Whole tilapia grilled with peppers and herbs" },
    { id: 13, name: "Pepper Soup (Goat)", cat: "Mains", dayParts: ["Dinner","Room Service"], price: 5500, cost: 2200, prep: 35, avail: false, allergens: [], dietary: ["Gluten-free"], mods: [], desc: "Spiced goat meat in aromatic broth" },
    { id: 11, name: "Suya", cat: "Starters", dayParts: ["All Day"], price: 3000, cost: 1100, prep: 10, avail: true, allergens: ["Nuts"], dietary: ["Halal"], mods: ["Extra suya spice","Less spice"], desc: "Hausa-style seasoned skewered beef" },
    { id: 12, name: "Spring Rolls (6pc)", cat: "Starters", dayParts: ["Lunch","Dinner"], price: 2800, cost: 900, prep: 15, avail: true, allergens: ["Gluten","Egg"], dietary: [], mods: [], desc: "Crispy rolls with vegetable filling" },
    { id: 14, name: "Garden Salad", cat: "Starters", dayParts: ["All Day"], price: 2200, cost: 600, prep: 5, avail: true, allergens: [], dietary: ["Vegan","Gluten-free"], mods: ["No onion","Extra dressing"], desc: "Fresh seasonal vegetables with house dressing" },
    { id: 4, name: "Fried Plantain", cat: "Sides", dayParts: ["All Day"], price: 1500, cost: 400, prep: 8, avail: true, allergens: [], dietary: ["Vegan","Gluten-free"], mods: [], desc: "Sweet ripe plantain, deep fried" },
    { id: 5, name: "Moi Moi", cat: "Sides", dayParts: ["Breakfast","Lunch"], price: 1200, cost: 450, prep: 40, avail: false, allergens: ["Egg"], dietary: [], mods: [], desc: "Steamed bean pudding with egg and fish" },
    { id: 6, name: "Chapman", cat: "Drinks", dayParts: ["All Day"], price: 2000, cost: 400, prep: 3, avail: true, allergens: [], dietary: ["Vegan"], mods: [], desc: "Nigerian mocktail with grenadine and Ribena" },
    { id: 7, name: "Zobo", cat: "Drinks", dayParts: ["All Day"], price: 1000, cost: 200, prep: 2, avail: true, allergens: [], dietary: ["Vegan"], mods: [], desc: "Hibiscus flower drink with ginger" },
    { id: 8, name: "Bottled Water (50cl)", cat: "Drinks", dayParts: ["All Day"], price: 500, cost: 100, prep: 1, avail: true, allergens: [], dietary: ["Vegan"], mods: [], desc: "" },
    { id: 9, name: "Chocolate Cake (slice)", cat: "Desserts", dayParts: ["All Day","Room Service"], price: 3500, cost: 1200, prep: 2, avail: true, allergens: ["Gluten","Dairy","Egg"], dietary: [], mods: [], desc: "Rich Belgian chocolate layer cake" },
    { id: 10, name: "Fruit Salad", cat: "Desserts", dayParts: ["All Day","Room Service"], price: 2500, cost: 700, prep: 5, avail: true, allergens: [], dietary: ["Vegan","Gluten-free"], mods: [], desc: "Seasonal tropical fruits" },
  ];

  const CATS = ["Mains","Starters","Sides","Drinks","Desserts"];
  const DAY_PARTS = ["All","Breakfast","Lunch","Dinner","Room Service","All Day"];

  const [itemAvail, setItemAvail] = useState<Record<number,boolean>>(Object.fromEntries(FULL_MENU_MGT.map(i=>[i.id,i.avail])));
  const toggleAvail = (id: number) => { setItemAvail(p=>({...p,[id]:!p[id]})); add({ type: "info", title: `${FULL_MENU_MGT.find(i=>i.id===id)?.name} — availability toggled` }); };

  const catItems = FULL_MENU_MGT.filter(i => i.cat === activeCat && (dayPart === "All" || i.dayParts.includes(dayPart)));
  const margin = (item: typeof FULL_MENU_MGT[0]) => Math.round(((item.price - item.cost) / item.price) * 100);

  return (
    <div>
      <PageHeader title="Menu Management" sub="Items, pricing, availability, and day-part configuration" actions={<><BtnO label="Bulk Price Update" icon={Edit3} onClick={() => setShowBulkPrice(true)} /><BtnP label="Add Item" icon={Plus} onClick={() => add({ type: "info", title: "Add menu item" })} /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Items" value={String(FULL_MENU_MGT.length)} sub="All categories" icon={UtensilsCrossed} accent={PRIMARY} />
        <StatCard label="Available" value={String(Object.values(itemAvail).filter(Boolean).length)} sub="On today's menu" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="86'd" value={String(Object.values(itemAvail).filter(v=>!v).length)} sub="Out of service" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Categories" value={String(CATS.length)} sub="Menu sections" icon={Layers} accent={TEAL} />
      </div>
      {/* Day-part filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Day-part:</span>
        {DAY_PARTS.map(d => <button key={d} onClick={() => setDayPart(d)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor: dayPart===d ? PRIMARY : "white", color: dayPart===d ? "white" : MUTED, borderColor: dayPart===d ? PRIMARY : BORDER }}>{d}</button>)}
      </div>
      <div className="flex gap-4">
        {/* Category sidebar */}
        <div className="w-44 flex-shrink-0 bg-white rounded-xl border p-2" style={{ borderColor: BORDER }}>
          {CATS.map(c => {
            const n = FULL_MENU_MGT.filter(i => i.cat === c).length;
            const off = FULL_MENU_MGT.filter(i => i.cat === c && !itemAvail[i.id]).length;
            return (
              <button key={c} onClick={() => setActiveCat(c)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 flex items-center justify-between" style={{ backgroundColor: activeCat === c ? PRIMARY : "transparent", color: activeCat === c ? "white" : MUTED }}>
                <span>{c}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs opacity-70">{n}</span>
                  {off > 0 && <span className="text-xs px-1 rounded" style={{ backgroundColor: activeCat===c ? "rgba(255,255,255,0.2)" : "#FEE2E2", color: activeCat===c ? "white" : ERROR }}>{off} off</span>}
                </div>
              </button>
            );
          })}
        </div>
        {/* Items table */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold" style={{ color: TEXT }}>{activeCat} · {dayPart !== "All" ? dayPart : "All Day-parts"}</h3><span className="text-xs" style={{ color: SUBTLE }}>{catItems.length} items</span></div>
          <table className="w-full">
            <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Name","Price","Cost","Margin","Prep","Allergens","Dietary","Modifiers","Day-parts","Avail",""].map((h,i)=><th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
            <tbody>
              {catItems.map(item => {
                const avail = itemAvail[item.id] ?? item.avail;
                const m = margin(item);
                return (
                  <tr key={item.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER, opacity: avail ? 1 : 0.6 }}>
                    <td className="px-3 py-3">
                      <div className="text-sm font-semibold" style={{ color: TEXT }}>{item.name}</div>
                      {item.desc && <div className="text-xs mt-0.5 max-w-40 truncate" style={{ color: SUBTLE }}>{item.desc}</div>}
                    </td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{item.price.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>₦{item.cost.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${m}%`, backgroundColor: m >= 60 ? SUCCESS : m >= 40 ? ORANGE : ERROR }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: m >= 60 ? SUCCESS : m >= 40 ? ORANGE : ERROR }}>{m}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{item.prep}m</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map(a => <span key={a} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>{a}</span>)}
                        {item.allergens.length === 0 && <span className="text-xs" style={{ color: SUBTLE }}>None</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.dietary.map(d => <span key={d} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>{d}</span>)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{item.mods.length > 0 ? `${item.mods.length} opts` : "—"}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{item.dayParts.join(", ")}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleAvail(item.id)} className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0" style={{ backgroundColor: avail ? TEAL : "#CBD5E1" }}>
                        <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow transition-all" style={{ left: avail ? 22 : 2 }} />
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => add({ type: "info", title: `Edit: ${item.name}` })} className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#F4F4F5]" style={{ color: MUTED }}><Edit3 size={13} /></button>
                        <button onClick={() => toggleAvail(item.id)} className="text-xs px-2 py-1 rounded border" style={{ color: ERROR, borderColor: `${ERROR}20` }}>86'd</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk price modal */}
      {showBulkPrice && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowBulkPrice(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-sm" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>Bulk Price Update — {activeCat}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Operation</label>
                <select value={bulkOp} onChange={e=>setBulkOp(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }}>
                  <option value="increase">Increase</option><option value="decrease">Decrease</option>
                </select></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Percentage (%)</label>
                <input type="number" min="1" max="100" value={bulkPct} onChange={e=>setBulkPct(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
              <div className="px-3 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#F0F9FF", color: PRIMARY }}>
                This will {bulkOp} prices for all {catItems.length} items in {activeCat} by {bulkPct}%.
              </div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowBulkPrice(false)} /><button onClick={() => { add({ type: "success", title: `Prices updated — ${activeCat}`, body: `${bulkOp === "increase" ? "+" : "-"}${bulkPct}% applied to ${catItems.length} items` }); setShowBulkPrice(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Apply Update</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function LostFound({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const stC: Record<string, { bg: string; text: string }> = { Held: { bg: "#FEF3C7", text: "#92400E" }, Claimed: { bg: "#DCFCE7", text: "#166534" }, Shipped: { bg: "#EEF2FF", text: "#4338CA" }, Disposed: { bg: "#F3F4F6", text: "#374151" } };
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [showClaim, setShowClaim] = useState<string | null>(null);
  const [showShip, setShowShip] = useState<string | null>(null);
  const [claimant, setClaimant] = useState({ name: "", id: "", phone: "" });
  const [shipAddr, setShipAddr] = useState("");
  const LF = [
    { id: "LF-0041", desc: "iPhone 14 Pro (Black)", cat: "Electronics", storage: "Front Desk Safe B-2", room: "204", guestRes: "R-1024", guest: "Mrs. Adeola Bello", date: "22 Jun 2025", loggedBy: "Grace Achebe", claimedBy: "", status: "Held" },
    { id: "LF-0040", desc: "Gold Bracelet", cat: "Jewellery", storage: "Safe Box 1", room: "315", guestRes: "R-1018", guest: "Dr. Emeka Chukwu", date: "20 Jun 2025", loggedBy: "Ngozi Ike", claimedBy: "Dr. Emeka Chukwu", status: "Claimed" },
    { id: "LF-0039", desc: "Blue Patagonia Jacket", cat: "Clothing", storage: "HK Store Room A", room: "108", guestRes: "R-1015", guest: "Ms. Sarah Okafor", date: "18 Jun 2025", loggedBy: "Amaka Osei", claimedBy: "", status: "Held" },
    { id: "LF-0038", desc: "Laptop Charger (Dell)", cat: "Electronics", storage: "Front Desk Shelf", room: "221", guestRes: "R-1010", guest: "Mr. Tunde Adeyemi", date: "15 Jun 2025", loggedBy: "Grace Achebe", claimedBy: "Mr. Tunde Adeyemi", status: "Shipped" },
    { id: "LF-0037", desc: "Prescription Glasses", cat: "Personal", storage: "Front Desk Safe B-1", room: "401", guestRes: "R-1002", guest: "Mrs. Ngozi Eze", date: "10 Jun 2025", loggedBy: "Ngozi Ike", claimedBy: "", status: "Held" },
    { id: "LF-0036", desc: "Children's Stuffed Bear", cat: "Clothing", storage: "Disposed — 30-day expired", room: "103", guestRes: "R-0999", guest: "Mr. Femi Adesanya", date: "01 Jun 2025", loggedBy: "Amaka Osei", claimedBy: "", status: "Disposed" },
  ];
  const items = LF.map(i => ({ ...i, status: statuses[i.id] ?? i.status }));
  const visible = items.filter(i => (filter === "All" || i.status === filter) && (!search || i.desc.toLowerCase().includes(search.toLowerCase()) || i.room.includes(search) || i.guest.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <PageHeader title="Lost & Found" sub={`${items.length} items logged · ${items.filter(i=>i.status==="Held").length} currently held`} actions={<BtnP label="Log New Item" icon={Plus} onClick={() => add({ type: "info", title: "Lost item logging" })} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Items Held" value={String(items.filter(i=>i.status==="Held").length)} sub="In safe keeping" icon={Package} accent={WARNING} />
        <StatCard label="Claimed" value={String(items.filter(i=>i.status==="Claimed").length)} sub="Collected in person" icon={CheckCircle2} accent={SUCCESS} />
        <StatCard label="Shipped" value={String(items.filter(i=>i.status==="Shipped").length)} sub="Dispatched to guest" icon={Send} accent={TEAL} />
        <StatCard label="Disposed" value={String(items.filter(i=>i.status==="Disposed").length)} sub="30-day rule applied" icon={Archive} accent={MUTED} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-wrap" style={{ backgroundColor: "#F8FAFC", borderColor: BORDER }}>
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search item, guest, room…" className="pl-7 pr-3 py-1.5 text-xs rounded-lg border bg-white outline-none w-52" style={{ borderColor: BORDER }} /></div>
          <div className="flex gap-1.5">{["All","Held","Claimed","Shipped","Disposed"].map(f => <button key={f} onClick={() => setFilter(f)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ borderColor: filter===f ? PRIMARY : BORDER, backgroundColor: filter===f ? PRIMARY : "white", color: filter===f ? "white" : MUTED }}>{f}</button>)}</div>
        </div>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Item ID", "Description / Category", "Storage Location", "Room", "Guest (Res)", "Found", "Logged By", "Status", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>{visible.map(item => (
            <tr key={item.id} className="border-t hover:bg-[#F8FAFC] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{item.id}</td>
              <td className="px-4 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{item.desc}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE }}>{item.cat}</div></td>
              <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.storage}</td>
              <td className="px-4 py-3 font-bold" style={{ color: PRIMARY }}>{item.room}</td>
              <td className="px-4 py-3"><div className="text-xs font-medium" style={{ color: TEXT }}>{item.guest}</div><div className="text-xs" style={{ color: SUBTLE }}>{item.guestRes}</div></td>
              <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.date}</td>
              <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{item.loggedBy}</td>
              <td className="px-4 py-3"><Badge label={item.status} colors={stC[item.status] ?? { bg: "#F4F4F5", text: "#374151" }} /></td>
              <td className="px-4 py-3">
                {item.status === "Held" && (
                  <div className="flex gap-1">
                    <button onClick={() => { setShowClaim(item.id); setClaimant({ name: "", id: "", phone: "" }); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: SUCCESS, borderColor: `${SUCCESS}30` }}>Claim</button>
                    <button onClick={() => { setShowShip(item.id); setShipAddr(""); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Ship</button>
                    <button onClick={() => { setStatuses(p=>({...p,[item.id]:"Disposed"})); add({ type: "info", title: `${item.id} disposed` }); }} className="text-xs px-2 py-1.5 rounded border whitespace-nowrap" style={{ color: MUTED, borderColor: BORDER }}>Dispose</button>
                  </div>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {/* Claim modal */}
      {showClaim && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowClaim(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Record Claim — {showClaim}</h3><button onClick={() => setShowClaim(null)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Claimant Name</label><input value={claimant.name} onChange={e => setClaimant(p=>({...p,name:e.target.value}))} placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>ID / NIN</label><input value={claimant.id} onChange={e => setClaimant(p=>({...p,id:e.target.value}))} placeholder="Gov ID number" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Phone</label><input value={claimant.phone} onChange={e => setClaimant(p=>({...p,phone:e.target.value}))} placeholder="+234…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowClaim(null)} /><button disabled={!claimant.name || !claimant.id} onClick={() => { setStatuses(p=>({...p,[showClaim!]:"Claimed"})); add({ type: "success", title: `${showClaim} claimed by ${claimant.name}` }); setShowClaim(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: SUCCESS }}>Confirm Claim</button></div>
          </div>
        </>
      )}
      {/* Ship modal */}
      {showShip && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowShip(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold" style={{ color: TEXT }}>Ship to Guest — {showShip}</h3><button onClick={() => setShowShip(null)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Delivery Address</label><textarea value={shipAddr} onChange={e => setShipAddr(e.target.value)} placeholder="Street, City, State, Postal Code" rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
            <div className="mt-3 px-3 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}>Shipping cost will be charged to guest folio. Ensure item is properly packaged and labelled with {showShip} before handover to courier.</div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowShip(null)} /><button disabled={!shipAddr.trim()} onClick={() => { setStatuses(p=>({...p,[showShip!]:"Shipped"})); add({ type: "success", title: `${showShip} marked for shipping` }); setShowShip(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: TEAL }}>Confirm Shipment</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function DNDLog({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  const THRESHOLD_WARN = 8;
  const THRESHOLD_CRITICAL = 12;
  const INITIAL = [
    { room: "315", guest: "Mrs. Adaeze Okeke", res: "R-1031", dndStart: "24 Jun 07:12", hours: 14.3, checkout: "25 Jun", overridden: false, wellness: [{ time: "24 Jun 15:20", by: "Grace Achebe", outcome: "No response — knocked twice" }] },
    { room: "410", guest: "Mr. Bolu Adeyemi", res: "R-1028", dndStart: "24 Jun 09:00", hours: 12.5, checkout: "24 Jun", overridden: false, wellness: [] },
    { room: "204", guest: "Dr. Chinyere Obi", res: "R-1025", dndStart: "24 Jun 14:30", hours: 7.0, checkout: "26 Jun", overridden: false, wellness: [] },
    { room: "108", guest: "Mr. Folarin Ojo", res: "R-1022", dndStart: "23 Jun 22:00", hours: 4.5, checkout: "24 Jun", overridden: true, wellness: [{ time: "24 Jun 06:00", by: "Night Manager", outcome: "Checked — guest responded, requested late sleep" }] },
    { room: "301", guest: "Mrs. Kemi Lawal", res: "R-1019", dndStart: "24 Jun 11:00", hours: 3.2, checkout: "25 Jun", overridden: false, wellness: [] },
  ];
  type Row = typeof INITIAL[0];
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [showOverride, setShowOverride] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [managerPin, setManagerPin] = useState("");

  const logCheck = (room: string) => {
    const now = new Date();
    const ts = `${now.getDate()} Jun ${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    setRows(p => p.map(r => r.room === room ? { ...r, wellness: [...r.wellness, { time: ts, by: "Current User", outcome: "Wellness check logged — awaiting response" }] } : r));
    add({ type: "info", title: `Wellness check recorded — Room ${room}`, body: `${ts} · This record is audited for liability` });
  };

  const confirmOverride = () => {
    if (managerPin !== "1234") { add({ type: "error", title: "Incorrect manager PIN" }); return; }
    if (!overrideReason.trim()) { add({ type: "error", title: "Override reason is required" }); return; }
    setRows(p => p.map(r => r.room === showOverride ? { ...r, overridden: true } : r));
    add({ type: "warning", title: `DND overridden — Room ${showOverride}`, body: overrideReason });
    setShowOverride(null); setOverrideReason(""); setManagerPin("");
  };

  const escalated = rows.filter(r => r.hours >= THRESHOLD_CRITICAL && !r.overridden);
  const warned = rows.filter(r => r.hours >= THRESHOLD_WARN && r.hours < THRESHOLD_CRITICAL && !r.overridden);

  const rowBg = (r: Row) => {
    if (r.hours >= THRESHOLD_CRITICAL && !r.overridden) return "#FFF5F5";
    if (r.hours >= THRESHOLD_WARN && !r.overridden) return "#FFFBEB";
    return "white";
  };
  const durationColor = (r: Row) => r.hours >= THRESHOLD_CRITICAL && !r.overridden ? ERROR : r.hours >= THRESHOLD_WARN && !r.overridden ? ORANGE : TEXT;

  return (
    <div>
      <PageHeader title="Do Not Disturb Log" sub="Wellness check as liability record · Override requires manager PIN + reason" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Active DND" value={String(rows.filter(r=>!r.overridden).length)} sub="Do Not Disturb now" icon={AlertCircle} accent={ERROR} />
        <StatCard label="Escalated (12h+)" value={String(escalated.length)} sub="Wellness check required" icon={AlertTriangle} accent={ERROR} />
        <StatCard label="Warning (8–12h)" value={String(warned.length)} sub="Monitor closely" icon={Clock} accent={ORANGE} />
        <StatCard label="Overridden" value={String(rows.filter(r=>r.overridden).length)} sub="Manager-authorized entry" icon={CheckCircle2} accent={SUCCESS} />
      </div>
      {escalated.length > 0 && (
        <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: `1px solid #FECACA` }}>
          <AlertTriangle size={16} style={{ color: ERROR, marginTop: 1, flexShrink: 0 }} />
          <div><div className="text-sm font-semibold" style={{ color: ERROR }}>{escalated.length} room{escalated.length>1?"s":""} flagged — DND exceeds {THRESHOLD_CRITICAL} hours</div><div className="text-xs mt-0.5" style={{ color: "#991B1B" }}>Rooms {escalated.map(r=>r.room).join(", ")} require immediate wellness check. Log check results for liability documentation.</div></div>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Room", "Guest (Res)", "DND Since", "Duration", "Checkout", "Wellness Checks", ""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.room} className="border-t" style={{ borderColor: BORDER, backgroundColor: rowBg(r) }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black" style={{ color: r.hours >= THRESHOLD_CRITICAL && !r.overridden ? ERROR : PRIMARY }}>{r.room}</span>
                    {r.hours >= THRESHOLD_CRITICAL && !r.overridden && <AlertTriangle size={14} style={{ color: ERROR }} />}
                    {r.overridden && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>OVERRIDE</span>}
                  </div>
                </td>
                <td className="px-4 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{r.guest}</div><div className="text-xs" style={{ color: SUBTLE }}>{r.res}</div></td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.dndStart}</td>
                <td className="px-4 py-3"><span className="text-sm font-black" style={{ color: durationColor(r), fontFamily: mono }}>{r.hours.toFixed(1)}h</span></td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{r.checkout}</td>
                <td className="px-4 py-3">
                  {r.wellness.length === 0 ? <span className="text-xs" style={{ color: SUBTLE }}>None recorded</span> : (
                    <div className="space-y-1">
                      {r.wellness.map((w, i) => (
                        <div key={i} className="text-xs" style={{ color: MUTED }}>
                          <span style={{ fontFamily: mono }}>{w.time}</span> — <span style={{ color: TEXT }}>{w.outcome}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 flex-col">
                    <button onClick={() => logCheck(r.room)} className="text-xs px-2.5 py-1.5 rounded border font-medium whitespace-nowrap" style={{ color: TEAL, borderColor: `${TEAL}30` }}>Log Check</button>
                    {!r.overridden && <button onClick={() => { setShowOverride(r.room); setOverrideReason(""); setManagerPin(""); }} className="text-xs px-2.5 py-1.5 rounded border whitespace-nowrap" style={{ color: ERROR, borderColor: `${ERROR}30` }}>Override DND</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: BORDER, backgroundColor: "#F8FAFC" }}>
          <Info size={13} style={{ color: SUBTLE, flexShrink: 0 }} />
          <span className="text-xs" style={{ color: SUBTLE }}>All wellness check entries are timestamped, attributed, and immutable for liability documentation. Override requires manager PIN and documented reason.</span>
        </div>
      </div>
      {/* Override modal */}
      {showOverride && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(13,27,46,0.5)" }} onClick={() => setShowOverride(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-1"><h3 className="text-base font-bold" style={{ color: ERROR }}>Override DND — Room {showOverride}</h3><button onClick={() => setShowOverride(null)} style={{ color: SUBTLE }}><X size={18} /></button></div>
            <p className="text-xs mb-4" style={{ color: MUTED }}>This action is audited. Provide a documented reason and authenticate with your manager PIN.</p>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Override Reason</label><textarea value={overrideReason} onChange={e => setOverrideReason(e.target.value)} placeholder="e.g. Guest has not responded after 2 wellness checks. GM authorized entry for welfare check." rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: BORDER }} /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Manager PIN</label><input type="password" value={managerPin} onChange={e => setManagerPin(e.target.value)} placeholder="Enter PIN" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div>
            </div>
            <div className="flex gap-3 mt-4"><BtnO label="Cancel" onClick={() => setShowOverride(null)} /><button disabled={!overrideReason.trim() || !managerPin} onClick={confirmOverride} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: ERROR }}>Authorize Override</button></div>
          </div>
        </>
      )}
    </div>
  );
}

export function InvoiceReceipts({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type InvStatus = "Draft" | "Issued" | "Paid" | "Partially Paid" | "Overdue" | "Void" | "Credit Noted";
  type InvType   = "Guest" | "Corporate" | "Group" | "Proforma";

  const INVOICES_FULL = [
    { id: "INV-2025-0814", num: 814, type: "Guest" as InvType,     folio: "FO-2848", billTo: "Emmanuel Adeyemi",     tin: "",              date: "14 Oct", due: "14 Oct", terms: "Due on checkout", subtotal: 456800, tax: 80370,  total: 537170, paid: 537170, status: "Paid" as InvStatus,           lines: [{ desc: "Room 202 — 4 nights Deluxe", qty: 4, unit: 95000, tax: 17812 }, { desc: "Restaurant & bar charges", qty: 1, unit: 76800, tax: 14400 }] },
    { id: "INV-2025-0815", num: 815, type: "Corporate" as InvType, folio: "FO-2849", billTo: "Meridian Oil & Gas Ltd", tin: "1234567-0012",   date: "14 Oct", due: "28 Oct", terms: "Net 14",          subtotal: 820000, tax: 143500, total: 963500, paid: 0,      status: "Issued" as InvStatus,         lines: [{ desc: "Suite 501 — 5 nights", qty: 5, unit: 135000, tax: 25313 }, { desc: "Spa & wellness", qty: 1, unit: 95000, tax: 17813 }] },
    { id: "INV-2025-0816", num: 816, type: "Guest" as InvType,     folio: "FO-2851", billTo: "Fatima Ibrahim",       tin: "",              date: "14 Oct", due: "14 Oct", terms: "Due on checkout", subtotal: 218400, tax: 38220,  total: 256620, paid: 100000, status: "Partially Paid" as InvStatus, lines: [{ desc: "Room 418 — 2 nights Standard", qty: 2, unit: 62000, tax: 11625 }, { desc: "Minibar, laundry, room service", qty: 1, unit: 94400, tax: 14970 }] },
    { id: "INV-2025-0813", num: 813, type: "Group" as InvType,     folio: "FO-2831", billTo: "Bello Wedding Group",  tin: "",              date: "11 Oct", due: "11 Oct", terms: "Due on checkout", subtotal: 1240000,tax: 217000, total: 1457000,paid: 1457000,status: "Paid" as InvStatus,           lines: [{ desc: "10 rooms × 3 nights", qty: 30, unit: 38000, tax: 7125 }, { desc: "Events — hall hire & catering", qty: 1, unit: 100000, tax: 18750 }] },
    { id: "INV-2025-0812", num: 812, type: "Guest" as InvType,     folio: "FO-2820", billTo: "Chukwuemeka Obi",     tin: "",              date: "10 Oct", due: "10 Oct", terms: "Due on checkout", subtotal: 175000, tax: 30625,  total: 205625, paid: 205625, status: "Void" as InvStatus,           lines: [] },
  ];

  const RECEIPTS_DATA = [
    { id: "RCT-2025-0381", invRef: "INV-2025-0814", guest: "Emmanuel Adeyemi",  method: "Card",          amount: 537170, date: "14 Oct 14:32" },
    { id: "RCT-2025-0380", invRef: "INV-2025-0816", guest: "Fatima Ibrahim",    method: "Cash",          amount: 100000, date: "14 Oct 11:00" },
    { id: "RCT-2025-0379", invRef: "INV-2025-0813", guest: "Bello Wedding Group",method:"Bank Transfer",  amount: 1457000,date: "11 Oct 09:30" },
  ];

  const stColors: Record<InvStatus,{bg:string;text:string}> = {
    "Draft":          { bg: "#F1F5F9", text: "#475569" },
    "Issued":         { bg: "#DBEAFE", text: "#1E40AF" },
    "Paid":           { bg: "#DCFCE7", text: "#166534" },
    "Partially Paid": { bg: "#FEF3C7", text: "#92400E" },
    "Overdue":        { bg: "#FEE2E2", text: "#991B1B" },
    "Void":           { bg: "#F3F4F6", text: "#6B7280" },
    "Credit Noted":   { bg: "#F3E8FF", text: "#6B21A8" },
  };
  const typeColors: Record<InvType,{bg:string;text:string}> = {
    Guest:     { bg: "#EFF6FF", text: PRIMARY },
    Corporate: { bg: "#DCFCE7", text: "#166534" },
    Group:     { bg: "#FEF3C7", text: "#92400E" },
    Proforma:  { bg: "#F3E8FF", text: "#6B21A8" },
  };

  const [tab, setTab]               = useState<"invoices"|"receipts">("invoices");
  const [statusFilter, setStatusFilter] = useState<InvStatus|"All">("All");
  const [selected, setSelected]     = useState<string|null>(null);
  const [invoices, setInvoices]     = useState(INVOICES_FULL);
  const [showPayment, setShowPayment] = useState<string|null>(null);
  const [payAmt, setPayAmt]         = useState("");
  const [payMethod, setPayMethod]   = useState("Cash");

  const recordPayment = (id: string) => {
    const amt = parseFloat(payAmt) || 0;
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const newPaid = inv.paid + amt;
      return { ...inv, paid: newPaid, status: newPaid >= inv.total ? "Paid" : "Partially Paid" };
    }));
    add({ type: "success", title: `Payment recorded — ${id}`, body: `₦${amt.toLocaleString()} via ${payMethod}` });
    setShowPayment(null); setPayAmt("");
  };

  const filtered  = statusFilter === "All" ? invoices : invoices.filter(i => i.status === statusFilter);
  const sel       = invoices.find(i => i.id === selected);
  const outstanding = invoices.filter(i => !["Paid","Void","Credit Noted"].includes(i.status)).reduce((s,i) => s + i.total - i.paid, 0);
  const nextNum   = Math.max(...invoices.map(i => i.num)) + 1;

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <PageHeader title="Invoice & Receipts" sub="Gapless numbering · TIN · line-item tax · payment recording · receipts" actions={
          <div className="flex gap-2">
            <BtnO label="Export" icon={Download} onClick={() => add({ type: "info", title: "Exporting invoices" })} />
            <BtnP label="Create Invoice" icon={Plus} onClick={() => add({ type: "info", title: "New invoice form" })} />
          </div>
        } />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Invoiced"  value={`₦${invoices.reduce((s,i)=>s+i.total,0).toLocaleString()}`}  sub="All statuses"             icon={FileText}    accent={PRIMARY} />
          <StatCard label="Collected"       value={`₦${invoices.reduce((s,i)=>s+i.paid,0).toLocaleString()}`}   sub="Receipts issued"          icon={CheckCircle2} accent={SUCCESS} />
          <StatCard label="Outstanding"     value={`₦${outstanding.toLocaleString()}`}                           sub={`${invoices.filter(i=>i.status==="Overdue").length} overdue`} icon={AlertCircle} accent={ERROR} />
          <StatCard label="Next Invoice #"  value={`INV-2025-${String(nextNum).padStart(4,"0")}`}                sub="Gapless sequence"         icon={Hash}        accent={TEAL} />
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-white border w-fit" style={{ borderColor: BORDER }}>
            {(["invoices","receipts"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-xl text-xs font-semibold capitalize" style={{ backgroundColor: tab===t?PRIMARY:"transparent", color: tab===t?"white":MUTED }}>
                {t === "invoices" ? "Invoices" : "Receipts"}
              </button>
            ))}
          </div>
          {tab === "invoices" && (
            <div className="flex gap-1.5 flex-wrap">
              {(["All","Issued","Paid","Partially Paid","Overdue","Draft","Void"] as (InvStatus|"All")[]).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="text-xs px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor: statusFilter===s?PRIMARY:"white", color: statusFilter===s?"white":MUTED, borderColor: statusFilter===s?PRIMARY:BORDER }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {tab === "invoices" ? (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Invoice #","Type","Bill-To","Folio","Date","Due","Total","Paid","Balance","Status",""].map((h,i) => <th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(inv => {
                  const bal = inv.total - inv.paid;
                  return (
                    <tr key={inv.id} onClick={() => setSelected(inv.id)} className="border-t hover:bg-[#F8FAFC] cursor-pointer transition-colors" style={{ borderColor: BORDER, backgroundColor: selected===inv.id?"#EFF6FF":undefined, opacity: inv.status==="Void"?0.55:1 }}>
                      <td className="px-3 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{inv.id}</td>
                      <td className="px-3 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: typeColors[inv.type].bg, color: typeColors[inv.type].text }}>{inv.type}</span></td>
                      <td className="px-3 py-3"><div className="text-sm font-medium" style={{ color: TEXT }}>{inv.billTo}</div>{inv.tin && <div className="text-xs" style={{ color: SUBTLE }}>TIN: {inv.tin}</div>}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{inv.folio}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{inv.date}</td>
                      <td className="px-3 py-3 text-xs font-semibold" style={{ color: inv.status==="Overdue"?ERROR:MUTED }}>{inv.due}</td>
                      <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{inv.total.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm" style={{ color: SUCCESS, fontFamily: mono }}>₦{inv.paid.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm font-semibold" style={{ color: bal>0?ERROR:SUBTLE, fontFamily: mono }}>{bal>0?`₦${bal.toLocaleString()}`:"—"}</td>
                      <td className="px-3 py-3"><Badge label={inv.status} colors={stColors[inv.status]} /></td>
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button onClick={() => add({ type:"info", title:`Print ${inv.id}` })} className="text-xs px-2 py-1 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Print</button>
                          <button onClick={() => add({ type:"success", title:`${inv.id} emailed` })} className="text-xs px-2 py-1 rounded border" style={{ color: TEAL, borderColor:`${TEAL}30` }}>Email</button>
                          {(inv.status==="Issued"||inv.status==="Partially Paid"||inv.status==="Overdue") && (
                            <button onClick={() => { setShowPayment(inv.id); setSelected(inv.id); }} className="text-xs px-2 py-1 rounded border font-semibold" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>Pay</button>
                          )}
                          {inv.status==="Paid" && (
                            <button onClick={() => add({ type:"info", title:`Credit note for ${inv.id}` })} className="text-xs px-2 py-1 rounded border" style={{ color:"#6B21A8", borderColor:"#E9D5FF" }}>CN</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F9FAFB" }}>{["Receipt #","Invoice Ref","Guest","Method","Amount","Date",""].map((h,i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>
                {RECEIPTS_DATA.map(r => (
                  <tr key={r.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: PRIMARY, fontFamily: mono }}>{r.id}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: TEAL, fontFamily: mono }}>{r.invRef}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: TEXT }}>{r.guest}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{r.method}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: SUCCESS, fontFamily: mono }}>₦{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{r.date}</td>
                    <td className="px-4 py-3"><button onClick={() => add({ type:"info", title:`Print ${r.id}` })} className="text-xs px-2.5 py-1.5 rounded border" style={{ color: MUTED, borderColor: BORDER }}>Print</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border p-5" style={{ borderColor: BORDER, boxShadow: "0 1px 4px rgba(13,27,46,0.07)" }}>
          <div className="flex items-start justify-between mb-4">
            <div><div className="text-sm font-bold" style={{ color: TEXT }}>{sel.id}</div><div className="text-xs mt-0.5" style={{ color: TEAL }}>{sel.folio}</div></div>
            <button onClick={() => setSelected(null)} style={{ color: MUTED }}>✕</button>
          </div>
          <div className="space-y-1.5 text-sm mb-4">
            {([["Type",sel.type],["Bill-to",sel.billTo],sel.tin?["TIN",sel.tin]:null,["Date",sel.date],["Due",sel.due],["Terms",sel.terms]] as ([string,string]|null)[]).filter(Boolean).map(([k,v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: MUTED }}>{k}</span><span style={{ color: TEXT }}>{v}</span></div>
            ))}
          </div>
          {sel.lines.length > 0 && (
            <div className="border rounded-xl overflow-hidden mb-4" style={{ borderColor: BORDER }}>
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "#F9FAFB", color: MUTED }}>Line Items</div>
              {sel.lines.map((l, i) => (
                <div key={i} className="px-3 py-2.5 border-t text-xs" style={{ borderColor: BORDER }}>
                  <div className="font-medium mb-1" style={{ color: TEXT }}>{l.desc}</div>
                  <div className="flex justify-between" style={{ color: MUTED }}>
                    <span>{l.qty} × ₦{l.unit.toLocaleString()}</span>
                    <span>Tax ₦{l.tax.toLocaleString()}</span>
                    <span className="font-semibold" style={{ color: PRIMARY }}>₦{(l.qty*l.unit).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2.5 border-t space-y-1" style={{ borderColor: BORDER, backgroundColor: "#F9FAFB" }}>
                <div className="flex justify-between text-xs"><span style={{ color: MUTED }}>Subtotal</span><span style={{ fontFamily: mono }}>₦{sel.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span style={{ color: MUTED }}>Tax (SVC + VAT)</span><span style={{ fontFamily: mono }}>₦{sel.tax.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-bold"><span style={{ color: TEXT }}>Total</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{sel.total.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span style={{ color: MUTED }}>Paid</span><span style={{ color: SUCCESS, fontFamily: mono }}>₦{sel.paid.toLocaleString()}</span></div>
                {sel.total-sel.paid > 0 && <div className="flex justify-between text-xs font-bold"><span style={{ color: ERROR }}>Balance</span><span style={{ color: ERROR, fontFamily: mono }}>₦{(sel.total-sel.paid).toLocaleString()}</span></div>}
              </div>
            </div>
          )}
          {showPayment === sel.id && (
            <div className="space-y-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#F0FDF4", border:"1px solid #BBF7D0" }}>
              <div className="text-xs font-semibold" style={{ color: "#166534" }}>Record Payment</div>
              <input type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder={`Max ₦${(sel.total-sel.paid).toLocaleString()}`} className="w-full px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: "#BBF7D0" }} />
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: "#BBF7D0" }}>
                {["Cash","Card","Bank Transfer","POS Terminal"].map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowPayment(null)} className="flex-1 py-2 rounded-lg text-xs border" style={{ color: MUTED, borderColor: BORDER }}>Cancel</button>
                <button onClick={() => recordPayment(sel.id)} className="flex-1 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Record</button>
              </div>
            </div>
          )}
          <Badge label={sel.status} colors={stColors[sel.status]} />
        </div>
      )}
    </div>
  );
}

export function AccountsPayable({ add }: { add: (t: Omit<Toast, "id">) => void }) {
  type APStatus = "Draft"|"Pending Approval"|"Approved"|"Scheduled"|"Paid"|"Overdue"|"Disputed";

  const AP_INV = [
    { id:"API-0081", vendor:"Lagos Linen Co.",    po:"PO-0441", invDate:"01 Oct", dueDate:"31 Oct", amount:185000, taxWH:9250,  paid:0,      status:"Approved" as APStatus,         aging:30, category:"Laundry Supplies" },
    { id:"API-0082", vendor:"Jumia Business",     po:"PO-0449", invDate:"05 Oct", dueDate:"19 Oct", amount:78000,  taxWH:3900,  paid:0,      status:"Overdue" as APStatus,          aging:25, category:"Consumables" },
    { id:"API-0083", vendor:"EKEDC (Electric)",   po:"",        invDate:"01 Oct", dueDate:"14 Oct", amount:342000, taxWH:0,     paid:342000, status:"Paid" as APStatus,             aging:0,  category:"Utilities" },
    { id:"API-0084", vendor:"Abuja Fresh Farms",  po:"PO-0451", invDate:"10 Oct", dueDate:"24 Oct", amount:95400,  taxWH:4770,  paid:0,      status:"Pending Approval" as APStatus, aging:4,  category:"F&B Supplies" },
    { id:"API-0085", vendor:"GP Maintenance Ltd", po:"PO-0438", invDate:"28 Sep", dueDate:"12 Oct", amount:220000, taxWH:11000, paid:0,      status:"Overdue" as APStatus,          aging:32, category:"Maintenance" },
    { id:"API-0086", vendor:"TechCare IT Ltd",    po:"PO-0455", invDate:"12 Oct", dueDate:"26 Oct", amount:135000, taxWH:6750,  paid:0,      status:"Draft" as APStatus,            aging:2,  category:"IT Services" },
    { id:"API-0087", vendor:"Beachfront Laundry", po:"",        invDate:"08 Oct", dueDate:"22 Oct", amount:48500,  taxWH:2425,  paid:0,      status:"Disputed" as APStatus,         aging:6,  category:"Laundry" },
  ];

  const stColors: Record<APStatus,{bg:string;text:string}> = {
    "Draft":            { bg:"#F1F5F9", text:"#475569" },
    "Pending Approval": { bg:"#DBEAFE", text:"#1E40AF" },
    "Approved":         { bg:"#DCFCE7", text:"#166534" },
    "Scheduled":        { bg:"#FEF3C7", text:"#92400E" },
    "Paid":             { bg:"#F0FDF4", text:"#166534" },
    "Overdue":          { bg:"#FEE2E2", text:"#991B1B" },
    "Disputed":         { bg:"#FEF3C7", text:"#92400E" },
  };

  const [invoices, setInvoices]     = useState(AP_INV);
  const [statusFilter, setFilter]   = useState<APStatus|"All">("All");
  const [showPayRun, setShowPayRun] = useState(false);
  const [payRunSel, setPayRunSel]   = useState<Set<string>>(new Set());
  const [approvePin, setApprovePin] = useState("");
  const [showApprove, setShowApprove] = useState<string|null>(null);

  const AGING_BUCKETS = [
    { label: "Current (0–30d)", amount: invoices.filter(a=>a.aging<=30&&a.status!=="Paid").reduce((s,a)=>s+a.amount-a.paid,0) },
    { label: "31–60 days",      amount: invoices.filter(a=>a.aging>30&&a.aging<=60&&a.status!=="Paid").reduce((s,a)=>s+a.amount-a.paid,0) },
    { label: "61–90 days",      amount: 0 },
    { label: "90+ days",        amount: 0 },
  ];

  const approve = (id: string) => {
    if (approvePin !== "1234") { add({ type:"error", title:"Invalid PIN" }); return; }
    setInvoices(prev => prev.map(a => a.id===id ? { ...a, status:"Approved" } : a));
    add({ type:"success", title:`${id} approved for payment` });
    setShowApprove(null); setApprovePin("");
  };

  const filtered     = statusFilter==="All" ? invoices : invoices.filter(a => a.status===statusFilter);
  const outstanding  = invoices.filter(a=>a.status!=="Paid").reduce((s,a)=>s+a.amount-a.paid,0);
  const overdue      = invoices.filter(a=>a.status==="Overdue").reduce((s,a)=>s+a.amount-a.paid,0);
  const payRunTotal  = Array.from(payRunSel).reduce((s,id) => { const a=invoices.find(i=>i.id===id); return s+(a?a.amount-a.paid:0); }, 0);

  return (
    <div>
      <PageHeader title="Accounts Payable" sub="Supplier invoices · aging buckets · approval workflow · payment run" actions={
        <div className="flex gap-2">
          <BtnO label="Payment Run" icon={Send} onClick={() => setShowPayRun(true)} />
          <BtnO label="Export" icon={Download} onClick={() => add({ type:"info", title:"Exporting AP report" })} />
          <BtnP label="Add Invoice" icon={Plus} onClick={() => add({ type:"info", title:"Add supplier invoice" })} />
        </div>
      } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Outstanding"    value={`₦${outstanding.toLocaleString()}`}  sub={`${invoices.filter(a=>a.status!=="Paid").length} invoices`} icon={AlertCircle}  accent={ERROR}   />
        <StatCard label="Overdue"        value={`₦${overdue.toLocaleString()}`}      sub="Past due — act now"                                         icon={AlertTriangle} accent={ERROR}   />
        <StatCard label="Due This Week"  value="₦227,000"                            sub="Next 7 days"                                                icon={CalendarDays}  accent={WARNING} />
        <StatCard label="WHT Deducted"   value={`₦${invoices.reduce((s,a)=>s+a.taxWH,0).toLocaleString()}`} sub="Withheld this period"               icon={DollarSign}    accent={TEAL}    />
      </div>

      {/* Aging summary */}
      <div className="bg-white rounded-xl border p-4 mb-5" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Aging Summary</h3>
        <div className="grid grid-cols-4 gap-3">
          {AGING_BUCKETS.map(b => (
            <div key={b.label} className="text-center px-3 py-2.5 rounded-xl" style={{ backgroundColor:"#F8FAFC" }}>
              <div className="text-xs" style={{ color: MUTED }}>{b.label}</div>
              <div className="text-sm font-bold mt-1" style={{ color: b.amount>0?(b.label.includes("31")?ORANGE:b.label.includes("61")||b.label.includes("90+")?ERROR:PRIMARY):SUBTLE }}>₦{b.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(["All","Draft","Pending Approval","Approved","Scheduled","Paid","Overdue","Disputed"] as (APStatus|"All")[]).map(s => (
          <button key={s} onClick={() => setFilter(s)} className="text-xs px-3 py-1.5 rounded-xl border" style={{ backgroundColor: statusFilter===s?PRIMARY:"white", color: statusFilter===s?"white":MUTED, borderColor: statusFilter===s?PRIMARY:BORDER }}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER, boxShadow:"0 1px 4px rgba(13,27,46,0.07)" }}>
        <table className="w-full">
          <thead><tr style={{ backgroundColor:"#F9FAFB" }}>{["","Vendor","Category","PO Ref","Inv Date","Due Date","Amount","WHT","Balance","Aging","Status",""].map((h,i) => <th key={i} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(a => {
              const balance  = a.amount - a.paid;
              const isOverdue = a.status==="Overdue";
              return (
                <tr key={a.id} className="border-t hover:bg-[#F8FAFC]" style={{ borderColor: BORDER, backgroundColor: isOverdue?"#FFF8F8":undefined }}>
                  <td className="pl-3 py-3">
                    {showPayRun && a.status==="Approved" && (
                      <input type="checkbox" checked={payRunSel.has(a.id)} onChange={e => { const s=new Set(payRunSel); e.target.checked?s.add(a.id):s.delete(a.id); setPayRunSel(s); }} className="w-4 h-4 rounded" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: TEXT }}>{a.vendor}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.category}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: a.po?TEAL:SUBTLE, fontFamily: mono }}>{a.po||"—"}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED }}>{a.invDate}</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: isOverdue?ERROR:MUTED }}>{a.dueDate}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>₦{a.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: MUTED, fontFamily: mono }}>{a.taxWH>0?`₦${a.taxWH.toLocaleString()}`:"—"}</td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: balance>0?PRIMARY:SUBTLE, fontFamily: mono }}>₦{balance.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: a.aging>30?ERROR:a.aging>14?ORANGE:MUTED }}>{a.aging}d</td>
                  <td className="px-3 py-3"><Badge label={a.status} colors={stColors[a.status]} /></td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {(a.status==="Pending Approval"||a.status==="Overdue") && <button onClick={() => setShowApprove(a.id)} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: SUCCESS, borderColor:`${SUCCESS}30` }}>Approve</button>}
                      {a.status==="Approved" && <button onClick={() => { setInvoices(prev=>prev.map(x=>x.id===a.id?{...x,status:"Paid",paid:x.amount}:x)); add({ type:"success", title:`${a.vendor} — paid` }); }} className="text-xs px-2.5 py-1.5 rounded border font-semibold" style={{ color: PRIMARY, borderColor:`${PRIMARY}30` }}>Pay</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment run modal */}
      {showPayRun && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={() => setShowPayRun(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-full max-w-md" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Payment Run</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Select approved invoices for this batch.</p>
            <div className="space-y-2 max-h-48 overflow-auto mb-4">
              {invoices.filter(a=>a.status==="Approved").map(a => (
                <label key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer" style={{ borderColor: payRunSel.has(a.id)?PRIMARY:BORDER }}>
                  <input type="checkbox" checked={payRunSel.has(a.id)} onChange={e => { const s=new Set(payRunSel); e.target.checked?s.add(a.id):s.delete(a.id); setPayRunSel(s); }} className="w-4 h-4 rounded" />
                  <div className="flex-1 text-sm" style={{ color: TEXT }}>{a.vendor}</div>
                  <span className="text-sm font-bold" style={{ color: PRIMARY, fontFamily: mono }}>₦{(a.amount-a.paid).toLocaleString()}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-sm font-bold px-1 mb-4"><span style={{ color: TEXT }}>Total</span><span style={{ color: PRIMARY, fontFamily: mono }}>₦{payRunTotal.toLocaleString()}</span></div>
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={() => { setShowPayRun(false); setPayRunSel(new Set()); }} />
              <button onClick={() => { payRunSel.forEach(id=>setInvoices(prev=>prev.map(a=>a.id===id?{...a,status:"Paid",paid:a.amount}:a))); add({ type:"success", title:`Payment run — ${payRunSel.size} invoices`, body:`₦${payRunTotal.toLocaleString()}` }); setShowPayRun(false); setPayRunSel(new Set()); }} disabled={payRunSel.size===0} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Process Payment Run</button>
            </div>
          </div>
        </>
      )}

      {/* Approve modal */}
      {showApprove && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(13,27,46,0.5)" }} onClick={() => { setShowApprove(null); setApprovePin(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80" style={{ border:`1px solid ${BORDER}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: TEXT }}>Approve {showApprove}</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Manager PIN required for invoices above ₦100,000.</p>
            <input type="password" maxLength={4} value={approvePin} onChange={e=>setApprovePin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-center tracking-widest mb-4" style={{ borderColor: BORDER, fontFamily: mono }} />
            <div className="flex gap-3">
              <BtnO label="Cancel" onClick={() => { setShowApprove(null); setApprovePin(""); }} />
              <button onClick={() => approve(showApprove)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: SUCCESS }}>Approve</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// RevenueReports → ReportsScreens.tsx
export { RevenueReports } from "./ReportsScreens";

