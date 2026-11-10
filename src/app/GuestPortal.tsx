import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Bed, Bell, Broom, CalendarCheck, Camera, Car, ChatCircle, Check,
  CheckCircle, Clock, CreditCard, DeviceMobile, DeviceTablet, ForkKnife, House,
  MagnifyingGlass, MapPin, Minus, PaperPlaneRight, Phone, Plus, Question, Receipt,
  User, Warning, Wrench, X,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnO, BtnP, EmptyState, Inp, Sel } from "./UIKit";
import {
  ACTIVE_ORDER, ACTIVE_REQUESTS, ACTIVE_TRIP, BILL_CHARGES, BILL_SUMMARY, CHAT_MESSAGES,
  GUEST_FAQS, GUEST_STAY, HOTEL_DIRECTORY, RESTAURANT_SLOTS, ROOM_SERVICE_MENU, TRANSPORT_HISTORY,
} from "./mock/guestPortal";

type GuestScreen = "welcome" | "home" | "room-service" | "tracking" | "housekeeping" | "maintenance" | "chat" | "transport" | "restaurant" | "bill" | "help";
type LayoutMode = "T2" | "T3";
type LoadState = "loading" | "ready" | "error";

const money = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

function GuestShell({ mode, setMode, screen, onBack, onExit, children, onNavigate }: {
  mode: LayoutMode; setMode: (mode: LayoutMode) => void; screen: GuestScreen; onBack?: () => void;
  onExit: () => void; children: React.ReactNode; onNavigate: (screen: GuestScreen) => void;
}) {
  const tablet = mode === "T3";
  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-5" style={{ backgroundColor: BG, fontFamily: sans }}>
      <style>{`@media (max-width: 479px) { .guest-device { width: 100vw !important; height: 100dvh !important; border-radius: 0 !important; border: 0 !important; } }`}</style>
      <div className="guest-device relative bg-white border overflow-hidden flex flex-col transition-all" style={{ borderColor: BORDER, width: tablet ? 1024 : 390, height: tablet ? 720 : 844, maxWidth: "100vw", maxHeight: "100dvh", borderRadius: tablet ? 30 : 36 }}>
        <header className="flex items-center gap-3 px-5 py-4 border-b bg-white z-20" style={{ borderColor: BORDER }}>
          {onBack ? <button onClick={onBack} className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT }}><ArrowLeft size={22} /></button> : <button onClick={onExit} className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT }}><X size={20} /></button>}
          <div className="flex-1"><div className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Grand Palms</div><div className="text-xs" style={{ color: MUTED }}>{GUEST_STAY.location}</div></div>
          <div className="flex rounded-2xl border p-1" style={{ borderColor: BORDER }}>
            <button onClick={() => setMode("T2")} className="w-11 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: mode === "T2" ? BG : "white", color: mode === "T2" ? PRIMARY : MUTED }} title="T2 phone"><DeviceMobile size={19} /></button>
            <button onClick={() => setMode("T3")} className="w-11 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: mode === "T3" ? BG : "white", color: mode === "T3" ? PRIMARY : MUTED }} title="T3 tablet"><DeviceTablet size={20} /></button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "white" }}>{children}</main>
        {screen !== "welcome" && <nav className="h-20 border-t bg-white grid grid-cols-4 flex-shrink-0" style={{ borderColor: BORDER }}>
          {[
            { screen: "home" as const, label: "Home", icon: House },
            { screen: "room-service" as const, label: "Services", icon: Bell },
            { screen: "chat" as const, label: "Chat", icon: ChatCircle },
            { screen: "bill" as const, label: "My Bill", icon: Receipt },
          ].map(item => { const Icon = item.icon; const active = screen === item.screen; return <button key={item.screen} onClick={() => onNavigate(item.screen)} className="flex flex-col items-center justify-center gap-1 text-xs font-semibold" style={{ color: active ? PRIMARY : MUTED }}><Icon size={23} weight={active ? "fill" : "regular"} />{item.label}</button>; })}
        </nav>}
      </div>
    </div>
  );
}

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-7"><h1 className="text-3xl font-bold tracking-tight" style={{ color: TEXT, fontFamily: display }}>{title}</h1>{subtitle && <p className="text-base mt-2 leading-relaxed" style={{ color: MUTED }}>{subtitle}</p>}</div>;
}

function PrimaryAction({ label, onClick, disabled, icon: Icon = CheckCircle }: { label: string; onClick: () => void; disabled?: boolean; icon?: React.ElementType }) {
  return <button onClick={onClick} disabled={disabled} className="w-full min-h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40" style={{ backgroundColor: PRIMARY }}><Icon size={20} />{label}</button>;
}

function DataState({ state, empty, retry, children }: { state: LoadState; empty: boolean; retry: () => void; children: React.ReactNode }) {
  if (state === "loading") return <div className="space-y-4">{[1, 2, 3].map(item => <div key={item} className="h-28 rounded-3xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>;
  if (state === "error") return <EmptyState icon={Warning} message="We couldn’t load this information right now." cta="Try again" onCta={retry} />;
  if (empty) return <EmptyState icon={Bell} message="Nothing to show here yet." />;
  return <>{children}</>;
}

function WelcomeAccess({ qrLanding, onContinue, tablet }: { qrLanding: boolean; onContinue: () => void; tablet: boolean }) {
  const [code, setCode] = useState(qrLanding ? GUEST_STAY.reservation : "");
  const [surname, setSurname] = useState(qrLanding ? GUEST_STAY.surname : "");
  const [error, setError] = useState("");
  const access = () => {
    if (code.trim().toUpperCase() !== GUEST_STAY.reservation || surname.trim().toLowerCase() !== GUEST_STAY.surname.toLowerCase()) { setError("We couldn’t match those details. Check your reservation code and surname."); return; }
    onContinue();
  };
  return <div className={`p-7 ${tablet ? "max-w-2xl mx-auto py-14" : "pt-10"}`}><div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-8" style={{ backgroundColor: BG, color: TEAL }}><Bed size={30} weight="fill" /></div><PageTitle title={qrLanding ? "Welcome, Mr Okafor" : "Welcome to Grand Palms"} subtitle="Access your stay, request hotel services and keep track of your bill." />{error && <div className="p-4 rounded-2xl border text-sm mb-5" style={{ borderColor: ERROR, color: ERROR, backgroundColor: BG }}>{error}</div>}<div className="space-y-5"><Inp label="Reservation code" value={code} onChange={event => { setCode(event.target.value.toUpperCase()); setError(""); }} placeholder="BK-2860" mono /><Inp label="Surname" value={surname} onChange={event => { setSurname(event.target.value); setError(""); }} placeholder="Okafor" /><PrimaryAction label="Access My Stay" onClick={access} icon={CreditCard} /><p className="text-sm text-center" style={{ color: SUBTLE }}>Your reservation details are encrypted and private.</p></div></div>;
}

function HomeScreen({ tablet, navigate }: { tablet: boolean; navigate: (screen: GuestScreen) => void }) {
  const services = [
    { screen: "room-service" as const, label: "Room Service", icon: ForkKnife },
    { screen: "housekeeping" as const, label: "Housekeeping", icon: Broom },
    { screen: "maintenance" as const, label: "Report a Problem", icon: Wrench },
    { screen: "transport" as const, label: "Transport", icon: Car },
    { screen: "restaurant" as const, label: "Book a Table", icon: CalendarCheck },
    { screen: "help" as const, label: "Help & Support", icon: Question },
  ];
  return <div className="p-6 sm:p-8"><PageTitle title="Good evening, Chukwuemeka" subtitle="Everything you need for a comfortable stay." /><div className={`rounded-3xl border p-6 mb-8 ${tablet ? "flex items-center justify-between" : ""}`} style={{ borderColor: BORDER, backgroundColor: BG }}><div><div className="text-sm" style={{ color: MUTED }}>Your room</div><div className="text-5xl font-black mt-1" style={{ color: TEXT, fontFamily: mono }}>{GUEST_STAY.room}</div><div className="text-base mt-1" style={{ color: MUTED }}>{GUEST_STAY.roomType}</div></div><div className={tablet ? "text-right" : "mt-5 pt-5 border-t"} style={{ borderColor: BORDER }}><div className="text-2xl font-bold" style={{ color: TEXT }}>{GUEST_STAY.nightsLeft} nights left</div><div className="text-sm mt-1" style={{ color: MUTED }}>Check-out · {GUEST_STAY.checkOut}</div></div></div><div className={`grid gap-4 ${tablet ? "grid-cols-3" : "grid-cols-2"}`}>{services.map(service => { const Icon = service.icon; return <button key={service.screen} onClick={() => navigate(service.screen)} className="min-h-32 rounded-3xl border p-5 text-left" style={{ borderColor: BORDER, backgroundColor: "white" }}><div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: BG, color: PRIMARY }}><Icon size={24} /></div><div className="text-base font-bold" style={{ color: TEXT }}>{service.label}</div></button>; })}</div><button onClick={() => navigate("tracking")} className="w-full mt-8 p-5 rounded-3xl border text-left" style={{ borderColor: TEAL, backgroundColor: BG }}><div className="flex items-center justify-between"><div><div className="text-sm font-semibold" style={{ color: TEAL }}>Active requests</div><div className="text-lg font-bold mt-1" style={{ color: TEXT }}>{ACTIVE_REQUESTS.length} services in progress</div></div><Bell size={26} style={{ color: TEAL }} /></div><div className="text-sm mt-3" style={{ color: MUTED }}>{ACTIVE_REQUESTS.map(request => `${request.type}: ${request.status}`).join(" · ")}</div></button></div>;
}

function RoomServiceScreen({ tablet, navigate }: { tablet: boolean; navigate: (screen: GuestScreen) => void }) {
  const [state, setState] = useState<LoadState>("loading");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 350); return () => window.clearTimeout(timer); }, []);
  const items = ROOM_SERVICE_MENU.filter(item => category === "All" || item.category === category);
  const subtotal = ROOM_SERVICE_MENU.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;
  return <div className="p-6 sm:p-8"><PageTitle title="Room Service" subtitle="Freshly prepared and delivered to your room." /><div className="flex gap-2 overflow-x-auto pb-3 mb-5">{["All", "Breakfast", "Mains", "Drinks"].map(item => <button key={item} onClick={() => setCategory(item)} className="px-5 min-h-12 rounded-full border whitespace-nowrap text-sm font-semibold" style={{ borderColor: category === item ? PRIMARY : BORDER, backgroundColor: "white", color: category === item ? PRIMARY : MUTED }}>{item}</button>)}</div><DataState state={state} empty={items.length === 0} retry={() => setState("ready")}><div className={`grid gap-4 ${tablet ? "grid-cols-2" : "grid-cols-1"}`}>{items.map(item => { const quantity = cart[item.id] ?? 0; return <div key={item.id} className="rounded-3xl border p-5" style={{ borderColor: BORDER, opacity: item.available ? 1 : 0.55 }}><div className="flex gap-4"><div className="flex-1"><div className="text-lg font-bold" style={{ color: TEXT }}>{item.name}</div><div className="text-sm mt-2 leading-relaxed" style={{ color: MUTED }}>{item.description}</div><div className="text-base font-bold mt-3" style={{ color: TEXT, fontFamily: mono }}>{money(item.price)}</div></div>{item.available ? <div className="flex items-center gap-2"><button onClick={() => setCart(current => ({ ...current, [item.id]: Math.max(0, quantity - 1) }))} className="w-11 h-11 rounded-xl border flex items-center justify-center" style={{ borderColor: BORDER }}><Minus size={17} /></button><span className="w-6 text-center font-bold" style={{ fontFamily: mono }}>{quantity}</span><button onClick={() => setCart(current => ({ ...current, [item.id]: quantity + 1 }))} className="w-11 h-11 rounded-xl border flex items-center justify-center" style={{ borderColor: BORDER }}><Plus size={17} /></button></div> : <Badge label="Unavailable" colors={{ bg: BG, text: MUTED }} />}</div></div>; })}</div></DataState>{subtotal > 0 && <div className="sticky bottom-0 mt-6 p-5 rounded-3xl border bg-white" style={{ borderColor: BORDER }}><div className="flex justify-between text-sm mb-2" style={{ color: MUTED }}><span>Subtotal</span><span style={{ fontFamily: mono }}>{money(subtotal)}</span></div><div className="flex justify-between text-sm mb-3" style={{ color: MUTED }}><span>VAT 7.5%</span><span style={{ fontFamily: mono }}>{money(vat)}</span></div><div className="flex justify-between text-xl font-bold mb-4" style={{ color: TEXT }}><span>Total</span><span style={{ fontFamily: mono }}>{money(total)}</span></div><p className="text-sm mb-4" style={{ color: MUTED }}>This order will be added to your room bill.</p><PrimaryAction label="Place Room Service Order" onClick={() => navigate("tracking")} icon={ForkKnife} /></div>}</div>;
}

function OrderTrackingScreen({ tablet }: { tablet: boolean }) {
  return <div className={`p-6 sm:p-8 ${tablet ? "max-w-3xl mx-auto" : ""}`}><PageTitle title="Order Tracking" subtitle={`${ACTIVE_ORDER.id} · Placed at ${ACTIVE_ORDER.placed}`} /><div className="rounded-3xl border p-6" style={{ borderColor: BORDER }}><div className="text-2xl font-bold" style={{ color: TEXT }}>Preparing your order</div><div className="text-base mt-2" style={{ color: MUTED }}>Estimated delivery: {ACTIVE_ORDER.estimate}</div><div className="mt-8 space-y-0">{ACTIVE_ORDER.steps.map((step, index) => { const done = index <= ACTIVE_ORDER.statusIndex; return <div key={step} className="flex gap-4 min-h-20"><div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: done ? SUCCESS : BORDER, backgroundColor: done ? SUCCESS : "white" }}>{done && <Check size={20} color="white" />}</div>{index < ACTIVE_ORDER.steps.length - 1 && <div className="w-0.5 flex-1" style={{ backgroundColor: index < ACTIVE_ORDER.statusIndex ? SUCCESS : BORDER }} />}</div><div className="pt-2 text-base font-semibold" style={{ color: done ? TEXT : MUTED }}>{step}</div></div>; })}</div><div className="border-t pt-5 mt-2" style={{ borderColor: BORDER }}>{ACTIVE_ORDER.items.map(item => <div key={item} className="text-base mb-2" style={{ color: TEXT }}>{item}</div>)}<div className="flex justify-between text-lg font-bold mt-4"><span>Total</span><span style={{ fontFamily: mono }}>{money(ACTIVE_ORDER.total)}</span></div></div></div></div>;
}

function HousekeepingScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [items, setItems] = useState<string[]>([]);
  const [time, setTime] = useState("As soon as possible");
  const options = ["Fresh towels", "Room cleaning", "Bedding change", "Water refill", "Toiletries", "Laundry pickup"];
  return <div className={`p-6 sm:p-8 ${tablet ? "max-w-4xl mx-auto" : ""}`}><PageTitle title="Housekeeping Request" subtitle="Choose what you need and when you would like us to visit." /><div className={`grid gap-4 ${tablet ? "grid-cols-3" : "grid-cols-2"}`}>{options.map(item => { const selected = items.includes(item); return <button key={item} onClick={() => setItems(current => selected ? current.filter(value => value !== item) : [...current, item])} className="min-h-28 rounded-3xl border p-4 text-left text-base font-bold" style={{ borderColor: selected ? TEAL : BORDER, color: TEXT, backgroundColor: selected ? BG : "white" }}>{selected && <CheckCircle size={22} style={{ color: TEAL }} className="mb-2" />}{item}</button>; })}</div><div className="mt-6"><Sel label="Preferred time" value={time} onChange={event => setTime(event.target.value)} options={["As soon as possible", "Within 30 minutes", "10:00", "12:00", "14:00", "18:00"]} /></div><div className="mt-6"><PrimaryAction label="Send Housekeeping Request" onClick={() => done(`${items.join(", ")} requested for ${time}.`)} disabled={items.length === 0} icon={Broom} /></div></div>;
}

function MaintenanceScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(false);
  return <div className={`p-6 sm:p-8 ${tablet ? "max-w-4xl mx-auto" : ""}`}><PageTitle title="Report a Room Problem" subtitle="Tell us what is wrong and our maintenance team will respond." /><div className={`grid gap-4 ${tablet ? "grid-cols-4" : "grid-cols-2"}`}>{["Air conditioning", "Plumbing", "Electricity", "TV / Wi-Fi", "Furniture", "Other"].map(item => <button key={item} onClick={() => setCategory(item)} className="min-h-24 rounded-3xl border p-4 text-base font-bold" style={{ borderColor: category === item ? ORANGE : BORDER, color: TEXT, backgroundColor: category === item ? BG : "white" }}>{item}</button>)}</div><textarea value={description} onChange={event => setDescription(event.target.value)} rows={4} placeholder="Please describe the problem…" className="w-full mt-6 p-5 rounded-3xl border text-base outline-none resize-none" style={{ borderColor: BORDER, color: TEXT }} /><button onClick={() => setPhoto(true)} className="w-full min-h-14 mt-4 rounded-2xl border text-base font-bold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: photo ? SUCCESS : TEXT }}><Camera size={21} />{photo ? "Photo attached" : "Add a photo"}</button><div className="mt-6"><PrimaryAction label="Send Maintenance Report" onClick={() => done(`${category} issue reported to Maintenance.`)} disabled={!category || !description.trim()} icon={Wrench} /></div></div>;
}

function ChatScreen({ tablet }: { tablet: boolean }) {
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [text, setText] = useState("");
  const send = (body = text) => { if (!body.trim()) return; setMessages(current => [...current, { id: `MSG-${current.length + 1}`, sender: "Guest", body, time: "Now" }]); setText(""); };
  return <div className={`h-full flex flex-col ${tablet ? "max-w-4xl mx-auto" : ""}`}><div className="p-6 pb-2"><PageTitle title="Front Desk Chat" subtitle="Usually replies within a few minutes." /></div><div className="flex-1 px-6 overflow-y-auto space-y-4">{messages.map(message => <div key={message.id} className={`max-w-[82%] p-4 rounded-3xl ${message.sender === "Guest" ? "ml-auto" : ""}`} style={{ backgroundColor: BG, color: TEXT }}><div className="text-sm font-semibold mb-1">{message.sender}</div><div className="text-base leading-relaxed">{message.body}</div><div className="text-xs mt-2" style={{ color: SUBTLE }}>{message.time}</div></div>)}</div><div className="p-5 border-t" style={{ borderColor: BORDER }}><div className="flex gap-2 overflow-x-auto mb-3">{["Late checkout", "Need towels", "Call me please", "Thank you"].map(reply => <button key={reply} onClick={() => send(reply)} className="min-h-10 px-4 rounded-full border text-sm whitespace-nowrap" style={{ borderColor: BORDER, color: TEXT }}>{reply}</button>)}</div><div className="flex gap-2"><input value={text} onChange={event => setText(event.target.value)} onKeyDown={event => event.key === "Enter" && send()} placeholder="Message Front Desk…" className="flex-1 min-w-0 px-4 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} /><button onClick={() => send()} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: PRIMARY }}><PaperPlaneRight size={22} /></button></div></div></div>;
}

function TransportScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [state, setState] = useState<LoadState>("loading");
  const [form, setForm] = useState({ pickup: GUEST_STAY.property, dropoff: "", date: "2026-08-06", time: "09:30", passengers: "1" });
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 350); return () => window.clearTimeout(timer); }, []);
  return <div className="p-6 sm:p-8"><PageTitle title="Transport" subtitle="Request a hotel ride or check your active trip." /><div className={`grid gap-6 ${tablet ? "grid-cols-2" : "grid-cols-1"}`}><div className="rounded-3xl border p-6" style={{ borderColor: TEAL, backgroundColor: BG }}><div className="flex items-center justify-between"><div><div className="text-sm font-semibold" style={{ color: TEAL }}>Active trip</div><div className="text-xl font-bold mt-1" style={{ color: TEXT }}>{ACTIVE_TRIP.pickupTime}</div></div><Car size={30} style={{ color: TEAL }} /></div><div className="text-base mt-5" style={{ color: TEXT }}>{ACTIVE_TRIP.pickup} → {ACTIVE_TRIP.dropoff}</div><div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}><div className="text-base font-bold" style={{ color: TEXT }}>{ACTIVE_TRIP.driver}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{ACTIVE_TRIP.vehicle}</div><button onClick={() => { window.location.href = `tel:${ACTIVE_TRIP.phone.replace(/\s/g, "")}`; }} className="mt-4 min-h-12 px-5 rounded-2xl border inline-flex items-center gap-2 text-sm font-bold" style={{ borderColor: BORDER, color: TEXT }}><Phone size={18} />Call driver</button></div></div><div className="rounded-3xl border p-6" style={{ borderColor: BORDER }}><div className="text-xl font-bold mb-5" style={{ color: TEXT }}>Request a ride</div><div className="space-y-4"><Inp label="Pickup" value={form.pickup} onChange={event => setForm(current => ({ ...current, pickup: event.target.value }))} /><Inp label="Drop-off" value={form.dropoff} onChange={event => setForm(current => ({ ...current, dropoff: event.target.value }))} placeholder="Airport, office or address" /><div className="grid grid-cols-2 gap-3"><Inp label="Date" type="date" value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /><Inp label="Time" type="time" value={form.time} onChange={event => setForm(current => ({ ...current, time: event.target.value }))} /></div><Inp label="Passengers" type="number" value={form.passengers} onChange={event => setForm(current => ({ ...current, passengers: event.target.value }))} /><PrimaryAction label="Request Ride" onClick={() => done(`Ride requested to ${form.dropoff}.`)} disabled={!form.dropoff.trim()} icon={Car} /></div></div></div><div className="mt-8"><div className="text-xl font-bold mb-4" style={{ color: TEXT }}>Trip history</div><DataState state={state} empty={TRANSPORT_HISTORY.length === 0} retry={() => setState("ready")}><div className="space-y-3">{TRANSPORT_HISTORY.map(trip => <div key={trip.id} className="p-5 rounded-3xl border flex items-start gap-4" style={{ borderColor: BORDER }}><MapPin size={22} style={{ color: MUTED }} /><div className="flex-1"><div className="text-base font-bold" style={{ color: TEXT }}>{trip.route}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{trip.date} · {trip.status}</div></div><div className="font-bold" style={{ color: TEXT, fontFamily: mono }}>{money(trip.amount)}</div></div>)}</div></DataState></div></div>;
}

function RestaurantScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [form, setForm] = useState({ date: "2026-08-06", time: RESTAURANT_SLOTS[2], party: "2", occasion: "Dinner", requests: "" });
  return <div className={`p-6 sm:p-8 ${tablet ? "max-w-4xl mx-auto" : ""}`}><PageTitle title="Book a Table" subtitle="Reserve a table at Palm Restaurant." /><div className={`grid gap-6 ${tablet ? "grid-cols-2" : "grid-cols-1"}`}><div className="rounded-3xl border p-6" style={{ borderColor: BORDER }}><Inp label="Date" type="date" value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /><div className="mt-5"><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Available times</div><div className="grid grid-cols-3 gap-2">{RESTAURANT_SLOTS.map(time => <button key={time} onClick={() => setForm(current => ({ ...current, time }))} className="min-h-12 rounded-xl border text-sm font-bold" style={{ borderColor: form.time === time ? PRIMARY : BORDER, color: TEXT, fontFamily: mono }}>{time}</button>)}</div></div></div><div className="rounded-3xl border p-6 space-y-5" style={{ borderColor: BORDER }}><Inp label="Party size" type="number" value={form.party} onChange={event => setForm(current => ({ ...current, party: event.target.value }))} /><Sel label="Occasion" value={form.occasion} onChange={event => setForm(current => ({ ...current, occasion: event.target.value }))} options={["Dinner", "Business meal", "Birthday", "Anniversary", "Other"]} /><Inp label="Special requests" value={form.requests} onChange={event => setForm(current => ({ ...current, requests: event.target.value }))} placeholder="Allergies, high chair, celebration…" /><PrimaryAction label="Confirm Table" onClick={() => done(`Table booked for ${form.party} at ${form.time}.`)} icon={CalendarCheck} /></div></div></div>;
}

function BillScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [state, setState] = useState<LoadState>("loading");
  const [charges, setCharges] = useState(BILL_CHARGES);
  const [checkout, setCheckout] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 350); return () => window.clearTimeout(timer); }, []);
  const dispute = (id: string) => { setCharges(current => current.map(charge => charge.id === id ? { ...charge, disputed: true } : charge)); done("Charge dispute sent to Front Desk."); };
  return <div className="p-6 sm:p-8"><PageTitle title="My Bill" subtitle="Review your current charges before check-out." /><div className={`grid gap-6 ${tablet ? "grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1"}`}><DataState state={state} empty={charges.length === 0} retry={() => setState("ready")}><div className="space-y-3">{charges.map(charge => <div key={charge.id} className="p-5 rounded-3xl border" style={{ borderColor: charge.disputed ? WARNING : BORDER }}><div className="flex items-start gap-4"><div className="flex-1"><div className="text-base font-bold" style={{ color: TEXT }}>{charge.description}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{charge.date} · {charge.category}</div>{charge.disputed && <div className="text-sm font-semibold mt-2" style={{ color: WARNING }}>Dispute under review</div>}</div><div className="text-base font-bold" style={{ color: TEXT, fontFamily: mono }}>{money(charge.amount)}</div></div>{!charge.disputed && <button onClick={() => dispute(charge.id)} className="mt-4 text-sm font-semibold" style={{ color: ERROR }}>Dispute this charge</button>}</div>)}</div></DataState><aside className="rounded-3xl border p-6 h-fit" style={{ borderColor: BORDER, backgroundColor: BG }}><div className="text-xl font-bold mb-5" style={{ color: TEXT }}>Balance summary</div>{[["Subtotal", BILL_SUMMARY.subtotal], ["VAT 7.5%", BILL_SUMMARY.vat], ["Tourism levy 2%", BILL_SUMMARY.tourismLevy], ["Total", BILL_SUMMARY.total], ["Payments", -BILL_SUMMARY.payments]].map(([label, amount]) => <div key={String(label)} className="flex justify-between text-base mb-3" style={{ color: MUTED }}><span>{label}</span><span style={{ fontFamily: mono }}>{Number(amount) < 0 ? `(${money(Math.abs(Number(amount)))})` : money(Number(amount))}</span></div>)}<div className="flex justify-between text-2xl font-black border-t pt-4 mt-4" style={{ borderColor: BORDER, color: TEXT }}><span>Balance</span><span style={{ fontFamily: mono }}>{money(BILL_SUMMARY.balance)}</span></div><label className="flex items-start gap-3 mt-6 text-sm" style={{ color: TEXT }}><input type="checkbox" checked={checkout} onChange={event => setCheckout(event.target.checked)} className="mt-1" style={{ accentColor: PRIMARY }} />I confirm that I have reviewed my bill and want to check out.</label><div className="mt-5"><PrimaryAction label="Express Checkout" onClick={() => done("Express checkout request sent. Front Desk will confirm shortly.")} disabled={!checkout || charges.some(charge => charge.disputed)} icon={CreditCard} /></div>{charges.some(charge => charge.disputed) && <p className="text-sm mt-3" style={{ color: WARNING }}>Express checkout is available after disputed charges are reviewed.</p>}</aside></div></div>;
}

function HelpScreen({ tablet, done }: { tablet: boolean; done: (message: string) => void }) {
  const [faq, setFaq] = useState<string | null>(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaint, setComplaint] = useState({ severity: "Needs attention", subject: "", details: "" });
  return <div className="p-6 sm:p-8"><PageTitle title="Help & Support" subtitle="Find the right team or tell us how we can make things right." /><div className={`grid gap-8 ${tablet ? "grid-cols-2" : "grid-cols-1"}`}><section><div className="text-xl font-bold mb-4" style={{ color: TEXT }}>Hotel directory</div><div className="space-y-3">{HOTEL_DIRECTORY.map(item => <div key={item.name} className="p-5 rounded-3xl border flex items-center gap-4" style={{ borderColor: BORDER }}><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: BG, color: PRIMARY }}><Phone size={21} /></div><div className="flex-1"><div className="text-base font-bold" style={{ color: TEXT }}>{item.name}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{item.description}</div></div><div className="text-lg font-bold" style={{ color: TEXT, fontFamily: mono }}>Ext. {item.extension}</div></div>)}</div></section><section><div className="text-xl font-bold mb-4" style={{ color: TEXT }}>Frequently asked questions</div><div className="space-y-3">{GUEST_FAQS.map(item => <button key={item.question} onClick={() => setFaq(faq === item.question ? null : item.question)} className="w-full p-5 rounded-3xl border text-left" style={{ borderColor: BORDER }}><div className="text-base font-bold" style={{ color: TEXT }}>{item.question}</div>{faq === item.question && <div className="text-base mt-3 leading-relaxed" style={{ color: MUTED }}>{item.answer}</div>}</button>)}</div></section></div><button onClick={() => setShowComplaint(true)} className="w-full min-h-16 rounded-3xl border mt-8 text-base font-bold flex items-center justify-center gap-2" style={{ borderColor: ERROR, color: ERROR }}><Warning size={21} />Raise a complaint</button>{showComplaint && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(12,26,54,0.55)" }} onMouseDown={() => setShowComplaint(false)}><div className="w-full max-w-lg bg-white rounded-3xl border p-6" style={{ borderColor: BORDER }} onMouseDown={event => event.stopPropagation()}><div className="flex items-center justify-between"><div><div className="text-2xl font-bold" style={{ color: TEXT }}>Tell us what happened</div><div className="text-sm mt-1" style={{ color: MUTED }}>A manager will review and respond.</div></div><button onClick={() => setShowComplaint(false)}><X size={21} /></button></div><div className="mt-6 space-y-5"><Sel label="How serious is this?" value={complaint.severity} onChange={event => setComplaint(current => ({ ...current, severity: event.target.value }))} options={["Needs attention", "Affects my stay", "Urgent safety concern"]} /><Inp label="What is this about?" value={complaint.subject} onChange={event => setComplaint(current => ({ ...current, subject: event.target.value }))} placeholder="A short summary" /><textarea value={complaint.details} onChange={event => setComplaint(current => ({ ...current, details: event.target.value }))} rows={4} placeholder="Please share the details in your own words…" className="w-full p-4 rounded-2xl border text-base resize-none outline-none" style={{ borderColor: BORDER }} /><PrimaryAction label="Send Complaint" onClick={() => { done("Your complaint has been sent to the duty manager."); setShowComplaint(false); }} disabled={!complaint.subject.trim() || !complaint.details.trim()} icon={PaperPlaneRight} /></div></div></div>}</div>;
}

export function GuestPortal({ onExit, qrLanding = false }: { onExit: () => void; qrLanding?: boolean }) {
  const [mode, setMode] = useState<LayoutMode>("T2");
  const [screen, setScreen] = useState<GuestScreen>("welcome");
  const [notice, setNotice] = useState("");
  const tablet = mode === "T3";
  const goBack = () => setScreen(screen === "home" ? "welcome" : "home");
  const done = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 4000); };
  return (
    <GuestShell mode={mode} setMode={setMode} screen={screen} onBack={screen === "welcome" ? undefined : goBack} onExit={onExit} onNavigate={setScreen}>
      {notice && <div className="sticky top-0 z-30 mx-5 mt-4 p-4 rounded-2xl border flex items-start gap-3" style={{ borderColor: SUCCESS, backgroundColor: BG, color: TEXT }}><CheckCircle size={20} style={{ color: SUCCESS }} /><div className="flex-1 text-sm font-semibold">{notice}</div><button onClick={() => setNotice("")}><X size={16} /></button></div>}
      {screen === "welcome" && <WelcomeAccess qrLanding={qrLanding} tablet={tablet} onContinue={() => setScreen("home")} />}
      {screen === "home" && <HomeScreen tablet={tablet} navigate={setScreen} />}
      {screen === "room-service" && <RoomServiceScreen tablet={tablet} navigate={setScreen} />}
      {screen === "tracking" && <OrderTrackingScreen tablet={tablet} />}
      {screen === "housekeeping" && <HousekeepingScreen tablet={tablet} done={done} />}
      {screen === "maintenance" && <MaintenanceScreen tablet={tablet} done={done} />}
      {screen === "chat" && <ChatScreen tablet={tablet} />}
      {screen === "transport" && <TransportScreen tablet={tablet} done={done} />}
      {screen === "restaurant" && <RestaurantScreen tablet={tablet} done={done} />}
      {screen === "bill" && <BillScreen tablet={tablet} done={done} />}
      {screen === "help" && <HelpScreen tablet={tablet} done={done} />}
    </GuestShell>
  );
}
