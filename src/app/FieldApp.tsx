import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowClockwise, ArrowLeft, Bed, Bell, Camera, Car, Check, CheckCircle, Clock,
  Drop, GasPump as FuelPump, House, MapPin, Megaphone, Minus, Package, PaperPlaneRight, Plus,
  SignOut, Siren, SprayBottle, Timer, User, Warning, WifiHigh, WifiSlash,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, EmptyState } from "./UIKit";
import {
  DRIVER_FIELD_IDENTITY, DRIVER_TRIPS, FIELD_IDENTITY, FIELD_MESSAGES, FIELD_TASKS, ISSUE_CATEGORIES,
  SHIFT_SUMMARY, SUPPLY_ITEMS, type FieldTask,
} from "./mock/fieldApp";

type FieldScreen = "pairing" | "tasks" | "detail" | "issue" | "supply" | "shift" | "messages" | "driver";
type ListState = "loading" | "ready" | "error";

const priorityOrder = { Urgent: 0, High: 1, Normal: 2 };
const statusColor = { Assigned: PRIMARY, "In Progress": WARNING, Ready: SUCCESS };

function SyncBadge({ pending, online }: { pending: number; online: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-3 h-9 rounded-full border bg-white text-xs font-semibold" style={{ borderColor: BORDER, color: online ? SUCCESS : WARNING }}>
      {online ? <WifiHigh size={15} weight="bold" /> : <WifiSlash size={15} weight="bold" />}
      {online ? "Synced" : "Offline"}{pending > 0 ? ` · ${pending} pending` : ""}
    </div>
  );
}

function FieldHeader({ title, pending, online, onBack }: { title: string; pending: number; online: boolean; onBack?: () => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3" style={{ borderColor: BORDER }}>
      {onBack && <button onClick={onBack} aria-label="Back" className="w-14 h-14 rounded-xl border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT }}><ArrowLeft size={24} /></button>}
      <div className="flex-1 min-w-0"><div className="text-lg font-bold truncate" style={{ color: TEXT, fontFamily: display }}>{title}</div><div className="text-xs truncate" style={{ color: MUTED }}>{FIELD_IDENTITY.branch}</div></div>
      <SyncBadge pending={pending} online={online} />
    </header>
  );
}

function BottomAction({ label, onClick, disabled, color = PRIMARY, icon: Icon = CheckCircle }: { label: string; onClick: () => void; disabled?: boolean; color?: string; icon?: React.ElementType }) {
  return <div className="sticky bottom-0 p-4 bg-white border-t z-20" style={{ borderColor: BORDER }}><button onClick={onClick} disabled={disabled} className="w-full min-h-14 rounded-2xl text-white text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40" style={{ backgroundColor: color }}><Icon size={22} weight="bold" />{label}</button></div>;
}

function PinPad({ onSuccess, online, driver, onToggleRole }: { onSuccess: () => void; online: boolean; driver: boolean; onToggleRole: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const press = (value: string) => {
    if (value === "clear") { setPin(""); setError(""); return; }
    if (value === "back") { setPin(previous => previous.slice(0, -1)); return; }
    if (pin.length < 4) setPin(previous => previous + value);
  };
  const login = () => {
    if (pin === "1234") onSuccess();
    else { setError("Incorrect PIN. Try 1234 for this paired device."); setPin(""); }
  };
  const identity = driver ? DRIVER_FIELD_IDENTITY : FIELD_IDENTITY;
  return (
    <div className="min-h-full flex flex-col bg-white">
      <div className="absolute right-4 top-4"><SyncBadge pending={0} online={online} /></div>
      <div className="p-5 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: NAV_BG }}><SprayBottle size={30} /></div>
        <div className="text-2xl font-bold mt-4" style={{ color: TEXT, fontFamily: display }}>{identity.name}</div>
        <div className="text-base mt-1" style={{ color: MUTED }}>{identity.role}</div>
        <div className="mt-3"><Badge label={`${identity.device} · Paired`} colors={{ bg: BG, text: SUCCESS }} /></div>
        <button onClick={onToggleRole} className="min-h-14 mt-3 px-4 rounded-xl border text-base font-semibold" style={{ borderColor: BORDER, color: MUTED }}>{driver ? "Use housekeeping demo device" : "Use driver demo device"}</button>
      </div>
      <div className="px-6 flex-1">
        <div className="flex justify-center gap-3 mb-5">{[0, 1, 2, 3].map(index => <div key={index} className="w-4 h-4 rounded-full border-2" style={{ borderColor: PRIMARY, backgroundColor: pin.length > index ? PRIMARY : "white" }} />)}</div>
        {error && <div className="p-3 rounded-xl text-base mb-4" style={{ color: ERROR, backgroundColor: BG, border: `1px solid ${ERROR}` }}>{error}</div>}
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map(value => <button key={value} onClick={() => press(value)} className="min-h-16 rounded-2xl border text-xl font-bold active:scale-95" style={{ borderColor: BORDER, color: value === "clear" ? ERROR : TEXT, fontFamily: mono }}>{value === "clear" ? "Clear" : value === "back" ? "⌫" : value}</button>)}
        </div>
        <div className="flex items-center justify-center gap-2 mt-5 text-base" style={{ color: online ? SUCCESS : WARNING }}>{online ? <WifiHigh size={18} /> : <WifiSlash size={18} />}{online ? "Online authentication available" : "Offline login available on this paired device"}</div>
      </div>
      <BottomAction label={online ? "Start Shift" : "Continue Offline"} onClick={login} disabled={pin.length !== 4} icon={SignOut} />
    </div>
  );
}

function TaskList({ onOpen, pending, online }: { onOpen: (task: FieldTask) => void; pending: number; online: boolean }) {
  const [state, setState] = useState<ListState>("loading");
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 450); return () => window.clearTimeout(timer); }, []);
  const tasks = useMemo(() => [...FIELD_TASKS].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.floor - b.floor), []);
  const refresh = () => { setRefreshing(true); window.setTimeout(() => setRefreshing(false), 600); };
  return (
    <div className="min-h-full bg-white">
      <FieldHeader title="My Tasks" pending={pending} online={online} />
      <div className="p-4 pb-24">
        <button onClick={refresh} className="w-full min-h-14 rounded-xl border flex items-center justify-center gap-2 text-base font-semibold mb-4" style={{ borderColor: BORDER, color: MUTED }}><ArrowClockwise size={20} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing…" : "Pull to refresh"}</button>
        <div className="flex items-center gap-4 p-4 rounded-2xl border mb-4" style={{ borderColor: BORDER }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center border-8" style={{ borderColor: TEAL }}><div className="text-center"><div className="text-xl font-black" style={{ color: TEXT, fontFamily: mono }}>4</div><div className="text-xs" style={{ color: MUTED }}>of 11</div></div></div>
          <div><div className="text-lg font-bold" style={{ color: TEXT }}>Today’s progress</div><div className="text-base mt-1" style={{ color: MUTED }}>7 tasks remaining · 2h 28m estimated</div></div>
        </div>
        {state === "loading" && <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-36 rounded-2xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>}
        {state === "error" && <EmptyState icon={Warning} message="Tasks could not be loaded." cta="Try again" onCta={() => setState("ready")} />}
        {state === "ready" && tasks.length === 0 && <EmptyState icon={Bed} message="No tasks assigned. Pull to refresh or contact your supervisor." />}
        {state === "ready" && tasks.length > 0 && <div className="space-y-3">{tasks.map(task => <button key={task.id} onClick={() => onOpen(task)} className="w-full min-h-32 rounded-2xl border text-left overflow-hidden bg-white" style={{ borderColor: BORDER }}><div className="h-2" style={{ backgroundColor: statusColor[task.status] }} /><div className="p-4 flex items-center gap-4"><div className="text-5xl font-black" style={{ color: TEXT, fontFamily: mono }}>{task.room}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="text-base font-bold" style={{ color: TEXT }}>{task.type}</span>{task.priority !== "Normal" && <Badge label={task.priority} colors={{ bg: BG, text: task.priority === "Urgent" ? ERROR : WARNING }} />}</div><div className="text-base mt-2" style={{ color: MUTED }}>{task.guestState} · Floor {task.floor}</div><div className="flex items-center gap-1 text-base mt-1" style={{ color: TEXT }}><Clock size={17} />{task.estimate} min</div></div></div></button>)}</div>}
      </div>
    </div>
  );
}

function TaskDetail({ task, pending, online, onBack, onIssue, onSupply, onComplete }: { task: FieldTask; pending: number; online: boolean; onBack: () => void; onIssue: () => void; onSupply: () => void; onComplete: () => void }) {
  const [arrived, setArrived] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [photo, setPhoto] = useState(false);
  useEffect(() => { if (!arrived) return; const timer = window.setInterval(() => setElapsed(value => value + 1), 1000); return () => window.clearInterval(timer); }, [arrived]);
  return (
    <div className="min-h-full bg-white flex flex-col">
      <FieldHeader title={`Room ${task.room}`} pending={pending} online={online} onBack={onBack} />
      <main className="p-4 flex-1">
        <div className="text-center py-4"><div className="text-7xl font-black" style={{ color: TEXT, fontFamily: mono }}>{task.room}</div><div className="text-lg mt-2" style={{ color: MUTED }}>{task.type} · {task.guestState}</div><div className="flex items-center justify-center gap-2 mt-2 text-base" style={{ color: arrived ? SUCCESS : MUTED }}><Timer size={20} />{Math.floor(elapsed / 60).toString().padStart(2, "0")}:{(elapsed % 60).toString().padStart(2, "0")}</div></div>
        {!arrived && <button onClick={() => setArrived(true)} className="w-full min-h-16 rounded-2xl border-2 text-lg font-bold flex items-center justify-center gap-2 mb-4" style={{ borderColor: PRIMARY, color: PRIMARY }}><Camera size={24} />Scan to arrive</button>}
        {arrived && <div className="space-y-2">{task.checklist.map(item => { const checked = checks.includes(item); return <button key={item} onClick={() => setChecks(previous => checked ? previous.filter(value => value !== item) : [...previous, item])} className="w-full min-h-14 rounded-xl border flex items-center gap-3 px-4 text-left text-base" style={{ borderColor: checked ? SUCCESS : BORDER, color: TEXT }}><span className="w-8 h-8 rounded-lg border-2 flex items-center justify-center" style={{ borderColor: checked ? SUCCESS : BORDER, backgroundColor: checked ? SUCCESS : "white" }}>{checked && <Check size={20} color="white" weight="bold" />}</span>{item}</button>; })}</div>}
        <div className="grid grid-cols-2 gap-3 mt-4"><button onClick={() => setPhoto(true)} className="min-h-14 rounded-xl border text-base font-semibold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: photo ? SUCCESS : TEXT }}><Camera size={20} />{photo ? "Photo added" : "Add photo"}</button><button onClick={onSupply} className="min-h-14 rounded-xl border text-base font-semibold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: TEXT }}><Package size={20} />Supplies</button></div>
        <textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} placeholder="Add room notes…" className="w-full mt-3 p-4 rounded-xl border text-base outline-none resize-none" style={{ borderColor: BORDER, color: TEXT }} />
        <div className="grid grid-cols-2 gap-3 mt-3"><button onClick={onIssue} className="min-h-14 rounded-xl border text-base font-semibold flex items-center justify-center gap-2" style={{ borderColor: ERROR, color: ERROR }}><Warning size={20} />Report issue</button><button className="min-h-14 rounded-xl border text-base font-semibold" style={{ borderColor: BORDER, color: TEXT }}>Mark DND</button></div>
        <button className="w-full min-h-14 mt-3 rounded-xl border text-base font-semibold" style={{ borderColor: BORDER, color: TEXT }}>Request Inspection</button>
      </main>
      <BottomAction label={task.type === "Inspection" ? "Complete Inspection" : "Swipe → Mark Clean"} onClick={onComplete} disabled={!arrived} color={SUCCESS} />
    </div>
  );
}

function ReportIssue({ room, pending, online, onBack, onSubmit }: { room: string; pending: number; online: boolean; onBack: () => void; onSubmit: () => void }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [photo, setPhoto] = useState(false);
  return <div className="min-h-full bg-white flex flex-col"><FieldHeader title={`Issue · Room ${room}`} pending={pending} online={online} onBack={onBack} /><main className="p-4 flex-1"><div className="grid grid-cols-2 gap-3">{ISSUE_CATEGORIES.map(item => <button key={item} onClick={() => setCategory(item)} className="min-h-16 rounded-2xl border text-base font-bold" style={{ borderColor: category === item ? ERROR : BORDER, color: category === item ? ERROR : TEXT }}>{item}</button>)}</div><textarea value={description} onChange={event => setDescription(event.target.value)} rows={4} placeholder="Describe the issue…" className="w-full mt-4 p-4 rounded-xl border text-base outline-none resize-none" style={{ borderColor: BORDER, color: TEXT }} /><button onClick={() => setPhoto(true)} className="w-full min-h-14 mt-3 rounded-xl border text-base font-semibold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: photo ? SUCCESS : TEXT }}><Camera size={21} />{photo ? "Photo attached" : "Attach photo"}</button><div className="mt-4 text-base font-bold" style={{ color: TEXT }}>Urgency</div><div className="grid grid-cols-3 gap-2 mt-2">{["Normal", "High", "Emergency"].map(item => <button key={item} onClick={() => setUrgency(item)} className="min-h-14 rounded-xl border text-base font-semibold" style={{ borderColor: urgency === item ? (item === "Emergency" ? ERROR : WARNING) : BORDER, color: TEXT }}>{item}</button>)}</div></main><BottomAction label="Submit Issue" onClick={onSubmit} disabled={!category || !description.trim()} color={ERROR} icon={Siren} /></div>;
}

function SupplyRequest({ pending, online, onBack, onSubmit }: { pending: number; online: boolean; onBack: () => void; onSubmit: () => void }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const total = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  return <div className="min-h-full bg-white flex flex-col"><FieldHeader title="Supply Request" pending={pending} online={online} onBack={onBack} /><main className="p-4 flex-1">{submitted && <div className="p-4 rounded-2xl border mb-4 text-base" style={{ borderColor: SUCCESS, color: SUCCESS }}><CheckCircle size={22} className="inline mr-2" />Request submitted · Awaiting store approval</div>}<div className="space-y-3">{SUPPLY_ITEMS.length ? SUPPLY_ITEMS.map(item => { const quantity = quantities[item.id] ?? 0; return <div key={item.id} className="min-h-20 rounded-2xl border p-3 flex items-center gap-3" style={{ borderColor: BORDER }}><div className="flex-1"><div className="text-base font-bold" style={{ color: TEXT }}>{item.name}</div><div className="text-base" style={{ color: MUTED }}>{item.unit}</div></div><button onClick={() => setQuantities(previous => ({ ...previous, [item.id]: Math.max(0, quantity - 1) }))} className="w-14 h-14 rounded-xl border flex items-center justify-center" style={{ borderColor: BORDER }}><Minus size={20} /></button><span className="w-8 text-center text-xl font-bold" style={{ fontFamily: mono }}>{quantity}</span><button onClick={() => setQuantities(previous => ({ ...previous, [item.id]: quantity + 1 }))} className="w-14 h-14 rounded-xl border flex items-center justify-center" style={{ borderColor: BORDER }}><Plus size={20} /></button></div>; }) : <EmptyState icon={Package} message="No supply items are available." />}</div></main><BottomAction label={submitted ? "Request Sent" : `Submit ${total} Item${total === 1 ? "" : "s"}`} onClick={() => { setSubmitted(true); onSubmit(); }} disabled={total === 0 || submitted} icon={Package} /></div>;
}

function ShiftScreen({ pending, online }: { pending: number; online: boolean }) {
  const [clockedIn, setClockedIn] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  const [elapsed, setElapsed] = useState(2 * 3600 + 18 * 60);
  useEffect(() => { if (!clockedIn || onBreak) return; const timer = window.setInterval(() => setElapsed(value => value + 1), 1000); return () => window.clearInterval(timer); }, [clockedIn, onBreak]);
  const time = `${Math.floor(elapsed / 3600).toString().padStart(2, "0")}:${Math.floor((elapsed % 3600) / 60).toString().padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`;
  return <div className="min-h-full bg-white flex flex-col"><FieldHeader title="My Shift" pending={pending} online={online} /><main className="p-4 flex-1 text-center"><div className="text-base mt-4" style={{ color: MUTED }}>Elapsed today</div><div className="text-5xl font-black mt-2" style={{ color: TEXT, fontFamily: mono }}>{time}</div><button onClick={() => setClockedIn(value => !value)} className="w-52 h-52 rounded-full mt-8 text-white text-2xl font-black border-8" style={{ backgroundColor: clockedIn ? ERROR : SUCCESS, borderColor: BG }}>{clockedIn ? "CLOCK OUT" : "CLOCK IN"}</button><button onClick={() => setOnBreak(value => !value)} disabled={!clockedIn} className="w-full min-h-14 rounded-2xl border mt-8 text-base font-bold disabled:opacity-40" style={{ borderColor: WARNING, color: WARNING }}>{onBreak ? "End Break" : "Start Break"}</button><div className="mt-6 rounded-2xl border text-left divide-y" style={{ borderColor: BORDER }}><div className="p-4 flex justify-between text-base"><span style={{ color: MUTED }}>Today’s shift</span><strong style={{ color: TEXT }}>{SHIFT_SUMMARY.today}</strong></div><div className="p-4 flex justify-between text-base"><span style={{ color: MUTED }}>Hours this week</span><strong style={{ color: TEXT, fontFamily: mono }}>{SHIFT_SUMMARY.hoursThisWeek}</strong></div><div className="p-4 flex justify-between text-base"><span style={{ color: MUTED }}>Next shift</span><strong className="text-right" style={{ color: TEXT }}>{SHIFT_SUMMARY.nextShift}</strong></div></div></main></div>;
}

function MessagesScreen({ pending, online }: { pending: number; online: boolean }) {
  const [state, setState] = useState<ListState>("loading");
  const [read, setRead] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 350); return () => window.clearTimeout(timer); }, []);
  const message = FIELD_MESSAGES.find(item => item.id === selected);
  if (message) return <div className="min-h-full bg-white flex flex-col"><FieldHeader title={message.from} pending={pending} online={online} onBack={() => setSelected(null)} /><main className="p-4 flex-1"><div className="text-lg font-bold" style={{ color: TEXT }}>{message.title}</div><div className="text-base mt-3 leading-relaxed" style={{ color: TEXT }}>{message.body}</div><div className="text-base mt-3" style={{ color: MUTED }}>{message.time}</div><div className="grid grid-cols-2 gap-3 mt-6">{["Understood", "On my way", "Task complete", "Need help"].map(item => <button key={item} onClick={() => setReply(item)} className="min-h-14 rounded-xl border text-base font-semibold" style={{ borderColor: reply === item ? PRIMARY : BORDER, color: TEXT }}>{item}</button>)}</div></main><BottomAction label={message.announcement ? "Acknowledge" : "Send Reply"} onClick={() => { setRead(previous => [...previous, message.id]); setSelected(null); }} disabled={!message.announcement && !reply} icon={PaperPlaneRight} /></div>;
  return <div className="min-h-full bg-white"><FieldHeader title="Messages" pending={pending} online={online} /><main className="p-4 pb-24">{state === "loading" && <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-28 rounded-2xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>}{state === "error" && <EmptyState icon={WifiSlash} message="Messages could not be loaded." cta="Try again" onCta={() => setState("ready")} />}{state === "ready" && FIELD_MESSAGES.length === 0 && <EmptyState icon={Bell} message="No messages or announcements." />}{state === "ready" && <div className="space-y-3">{FIELD_MESSAGES.map(item => { const unread = item.unread && !read.includes(item.id); return <button key={item.id} onClick={() => setSelected(item.id)} className="w-full min-h-28 p-4 rounded-2xl border text-left" style={{ borderColor: unread ? PRIMARY : BORDER }}><div className="flex items-center gap-2"><span className="text-base font-bold flex-1" style={{ color: TEXT }}>{item.from}</span>{unread && <Badge label="Unread" colors={{ bg: BG, text: PRIMARY }} />}</div><div className="text-base font-semibold mt-1" style={{ color: TEXT }}>{item.title}</div><div className="text-base mt-1 line-clamp-1" style={{ color: MUTED }}>{item.body}</div></button>; })}</div>}</main></div>;
}

function DriverMode({ pending, online }: { pending: number; online: boolean }) {
  const [state, setState] = useState<ListState>("loading");
  const [tripId, setTripId] = useState<string | null>(null);
  const [stage, setStage] = useState<"accept" | "odometer-start" | "arrived" | "start" | "odometer-end" | "complete" | "fuel">("accept");
  const [odometer, setOdometer] = useState("");
  const [fuel, setFuel] = useState({ litres: "", price: "", odometer: "", photo: false });
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 400); return () => window.clearTimeout(timer); }, []);
  const trip = DRIVER_TRIPS.find(item => item.id === tripId);
  if (!trip) return <div className="min-h-full bg-white"><FieldHeader title="Driver Mode" pending={pending} online={online} /><main className="p-4 pb-24">{state === "loading" && <div className="space-y-3">{[1, 2].map(item => <div key={item} className="h-44 rounded-2xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>}{state === "error" && <EmptyState icon={Car} message="Trips could not be loaded." cta="Try again" onCta={() => setState("ready")} />}{state === "ready" && DRIVER_TRIPS.length === 0 && <EmptyState icon={Car} message="No trips assigned for this shift." />}{state === "ready" && <div className="space-y-3">{DRIVER_TRIPS.map(item => <button key={item.id} onClick={() => { setTripId(item.id); setStage("accept"); }} className="w-full min-h-44 p-4 rounded-2xl border text-left" style={{ borderColor: BORDER }}><div className="flex items-center justify-between"><span className="text-3xl font-black" style={{ color: TEXT, fontFamily: mono }}>{item.pickupTime}</span><Badge label={item.status} colors={{ bg: BG, text: PRIMARY }} /></div><div className="text-lg font-bold mt-3" style={{ color: TEXT }}>{item.guest}</div><div className="text-base mt-2 flex items-center gap-2" style={{ color: MUTED }}><MapPin size={18} />{item.pickup} → {item.dropoff}</div><div className="text-base mt-2" style={{ color: TEXT }}>{item.passengers} passengers · Flight {item.flight}</div></button>)}</div>}</main></div>;
  if (stage === "fuel") return <div className="min-h-full bg-white flex flex-col"><FieldHeader title="Log Fuel" pending={pending} online={online} onBack={() => setStage("complete")} /><main className="p-4 flex-1 space-y-4">{[["Litres", "litres"], ["Price per litre (₦)", "price"], ["Odometer (km)", "odometer"]].map(([label, key]) => <label key={key} className="block text-base font-bold" style={{ color: TEXT }}>{label}<input inputMode="numeric" value={fuel[key as "litres" | "price" | "odometer"] as string} onChange={event => setFuel(previous => ({ ...previous, [key]: event.target.value }))} className="w-full min-h-14 mt-2 px-4 rounded-xl border text-xl" style={{ borderColor: BORDER, fontFamily: mono }} /></label>)}<button onClick={() => setFuel(previous => ({ ...previous, photo: true }))} className="w-full min-h-14 rounded-xl border text-base font-bold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: fuel.photo ? SUCCESS : TEXT }}><Camera size={21} />{fuel.photo ? "Receipt attached" : "Add receipt photo"}</button></main><BottomAction label="Save Fuel Log" onClick={() => { setTripId(null); setStage("accept"); }} disabled={!fuel.litres || !fuel.price || !fuel.odometer || !fuel.photo} icon={FuelPump} /></div>;
  const needsOdometer = stage === "odometer-start" || stage === "odometer-end";
  const primary = stage === "accept" ? "Accept Trip" : stage === "odometer-start" ? "Save Odometer Start" : stage === "arrived" ? "Mark Arrived" : stage === "start" ? "Start Trip" : stage === "odometer-end" ? "Save Odometer End" : "Complete Trip";
  const advance = () => { if (stage === "accept") setStage("odometer-start"); else if (stage === "odometer-start") { setStage("arrived"); setOdometer(""); } else if (stage === "arrived") setStage("start"); else if (stage === "start") setStage("odometer-end"); else if (stage === "odometer-end") { setStage("complete"); setOdometer(""); } else setTripId(null); };
  return <div className="min-h-full bg-white flex flex-col"><FieldHeader title={trip.id} pending={pending} online={online} onBack={() => setTripId(null)} /><main className="p-4 flex-1"><div className="text-5xl font-black" style={{ color: TEXT, fontFamily: mono }}>{trip.pickupTime}</div><div className="text-xl font-bold mt-3" style={{ color: TEXT }}>{trip.guest}</div><div className="mt-5 space-y-3 text-base"><div className="p-4 rounded-xl border" style={{ borderColor: BORDER }}><strong>Pickup</strong><div className="mt-1" style={{ color: MUTED }}>{trip.pickup}</div></div><div className="p-4 rounded-xl border" style={{ borderColor: BORDER }}><strong>Drop-off</strong><div className="mt-1" style={{ color: MUTED }}>{trip.dropoff}</div></div><div>{trip.passengers} passengers · Flight {trip.flight}</div></div>{needsOdometer && <div className="mt-8"><label className="text-base font-bold" style={{ color: TEXT }}>{stage === "odometer-start" ? "Odometer start (km)" : "Odometer end (km)"}</label><input autoFocus inputMode="numeric" value={odometer} onChange={event => setOdometer(event.target.value.replace(/\D/g, ""))} className="w-full min-h-20 mt-2 rounded-2xl border px-4 text-3xl text-center font-black" style={{ borderColor: PRIMARY, fontFamily: mono }} /></div>}{stage === "complete" && <button onClick={() => setStage("fuel")} className="w-full min-h-14 mt-6 rounded-xl border text-base font-bold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: TEXT }}><FuelPump size={21} />Log Fuel</button>}</main><BottomAction label={primary} onClick={advance} disabled={needsOdometer && odometer.length < 4} icon={Car} /></div>;
}

function FieldNav({ screen, onNavigate, driver }: { screen: FieldScreen; onNavigate: (screen: FieldScreen) => void; driver: boolean }) {
  const items: Array<{ screen: FieldScreen; label: string; icon: React.ElementType }> = driver
    ? [{ screen: "driver", label: "Trips", icon: Car }, { screen: "shift", label: "Shift", icon: Clock }, { screen: "messages", label: "Messages", icon: Bell }]
    : [{ screen: "tasks", label: "Tasks", icon: House }, { screen: "shift", label: "Shift", icon: Clock }, { screen: "messages", label: "Messages", icon: Bell }];
  return <nav className="absolute bottom-0 inset-x-0 z-30 h-20 bg-white border-t flex" style={{ borderColor: BORDER }}>{items.map(item => { const Icon = item.icon; const active = screen === item.screen; return <button key={item.screen} onClick={() => onNavigate(item.screen)} className="flex-1 min-h-14 flex flex-col items-center justify-center gap-1 text-xs font-semibold" style={{ color: active ? PRIMARY : MUTED }}><Icon size={24} weight={active ? "fill" : "regular"} />{item.label}</button>; })}</nav>;
}

export function FieldApp({ onExit, role = "HK" }: { onExit: () => void; role?: "HK" | "DRV" }) {
  const [screen, setScreen] = useState<FieldScreen>("pairing");
  const [selectedTask, setSelectedTask] = useState<FieldTask>(FIELD_TASKS[0]);
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [activeRole, setActiveRole] = useState<"HK" | "DRV">(role);
  useEffect(() => { const update = () => setOnline(navigator.onLine); window.addEventListener("online", update); window.addEventListener("offline", update); return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, []);
  const queueWrite = () => { if (!online) setPending(value => value + 1); };
  const primaryScreen = activeRole === "DRV" ? "driver" : "tasks";
  const showNav = ["tasks", "shift", "messages", "driver"].includes(screen);
  return (
    <div className="field-app-host min-h-screen flex items-center justify-center" style={{ backgroundColor: BG, fontFamily: sans }}>
      <style>{`@media (max-width: 479px) { .field-device { width: 100vw !important; height: 100dvh !important; border: 0 !important; border-radius: 0 !important; } }`}</style>
      <div className="field-device relative w-[390px] h-[844px] max-h-screen bg-white border overflow-hidden" style={{ borderColor: BORDER, borderRadius: 28 }}>
        <button onClick={onExit} aria-label="Exit Field App" className="absolute top-2 left-2 z-50 w-14 h-14 rounded-full flex items-center justify-center" style={{ color: SUBTLE }}><SignOut size={20} /></button>
        <div className="h-full overflow-y-auto pb-20">
          {screen === "pairing" && <PinPad online={online} driver={activeRole === "DRV"} onToggleRole={() => setActiveRole(value => value === "DRV" ? "HK" : "DRV")} onSuccess={() => setScreen(primaryScreen)} />}
          {screen === "tasks" && <TaskList pending={pending} online={online} onOpen={task => { setSelectedTask(task); setScreen("detail"); }} />}
          {screen === "detail" && <TaskDetail task={selectedTask} pending={pending} online={online} onBack={() => setScreen("tasks")} onIssue={() => setScreen("issue")} onSupply={() => setScreen("supply")} onComplete={() => { queueWrite(); setScreen("tasks"); }} />}
          {screen === "issue" && <ReportIssue room={selectedTask.room} pending={pending} online={online} onBack={() => setScreen("detail")} onSubmit={() => { queueWrite(); setScreen("detail"); }} />}
          {screen === "supply" && <SupplyRequest pending={pending} online={online} onBack={() => setScreen("detail")} onSubmit={queueWrite} />}
          {screen === "shift" && <ShiftScreen pending={pending} online={online} />}
          {screen === "messages" && <MessagesScreen pending={pending} online={online} />}
          {screen === "driver" && <DriverMode pending={pending} online={online} />}
        </div>
        {showNav && <FieldNav screen={screen} driver={activeRole === "DRV"} onNavigate={setScreen} />}
      </div>
    </div>
  );
}
