import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CaretDown, Check, CheckCircle, CircleNotch, Copy, Eye, EyeSlash,
  GearSix, IdentificationBadge, Key, Lock, ShieldCheck, WifiHigh, WifiSlash, X,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { BRAND, BrandLockup, BrandMark } from "./brand/Brand";
import { OWNER_LOGIN_ACCOUNTS, STAFF_LOGIN_ACCOUNTS, type LoginDestination } from "./mock/staffLogin";

const MAX_ATTEMPTS = 5;

function HotelIllustration() {
  const windows = Array.from({ length: 28 }, (_, index) => ({
    x: 88 + (index % 7) * 48,
    y: 116 + Math.floor(index / 7) * 52,
    lit: [0, 2, 5, 8, 9, 13, 16, 19, 21, 24, 27].includes(index),
  }));
  return (
    <svg viewBox="0 0 520 390" className="w-full max-w-[560px]" aria-label="Abstract connected hotel">
      <defs>
        <radialGradient id="hotel-glow" cx="50%" cy="44%" r="54%">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.27" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hotel-face" x1="84" y1="70" x2="428" y2="352" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.13" />
          <stop offset="1" stopColor="white" stopOpacity="0.035" />
        </linearGradient>
        <pattern id="hotel-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="white" strokeOpacity="0.055" />
        </pattern>
      </defs>
      <rect width="520" height="390" fill="url(#hotel-grid)" />
      <ellipse cx="260" cy="196" rx="238" ry="180" fill="url(#hotel-glow)" />
      <path d="M66 350V92l194-54 194 54v258Z" fill="url(#hotel-face)" stroke="white" strokeOpacity="0.18" strokeWidth="2" />
      <path d="M260 38v312M66 92l194 54 194-54" fill="none" stroke="white" strokeOpacity="0.1" />
      {windows.map((window, index) => (
        <g key={index}>
          <rect x={window.x} y={window.y} width="24" height="22" rx="4" fill={window.lit ? TEAL : "white"} fillOpacity={window.lit ? 0.86 : 0.1} />
          {window.lit && <rect x={window.x + 4} y={window.y + 4} width="16" height="14" rx="2" fill="white" fillOpacity="0.28" />}
        </g>
      ))}
      <path d="M224 350v-68h72v68" fill="none" stroke="white" strokeOpacity="0.34" strokeWidth="2" />
      <circle cx="260" cy="67" r="8" fill={TEAL} />
      <circle cx="260" cy="67" r="17" fill="none" stroke={TEAL} strokeOpacity="0.34" />
      <path d="M260 84v35M243 101h34" stroke={TEAL} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => setTime(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  return <span style={{ fontFamily: mono }}>{time.toLocaleTimeString("en-NG", { hour12: false })} · {time.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })}</span>;
}

function StatusCard({ internetOnline }: { internetOnline: boolean }) {
  const rows = [
    { label: "Local server", detail: "Connected · 12 ms", good: true },
    { label: "Database", detail: "Healthy · encrypted", good: true },
    { label: "Door-lock gateway", detail: "Connected · 42 locks", good: true },
    { label: "Internet", detail: internetOnline ? "Connected · cloud available" : "Offline · branch fully operational", good: true, offline: !internetOnline },
    { label: "Last cloud sync", detail: internetOnline ? "Just now" : "18 min ago", good: internetOnline },
  ];
  return (
    <div className="rounded-3xl p-5 border" style={{ backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}>
      <div className="flex items-center justify-between mb-3"><span className="text-sm font-bold text-white">Branch status</span><LiveClock /></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6">
        {rows.map(row => <div key={row.label} className="flex items-center gap-3 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.offline ? WARNING : row.good ? SUCCESS : ERROR }} /><span className="text-sm text-white/70 flex-1">{row.label}</span><span className="text-xs text-white/45">{row.detail}</span></div>)}
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return <div className="p-3.5 rounded-2xl border text-sm flex items-start gap-2.5" style={{ backgroundColor: BG, borderColor: ERROR, color: ERROR }}><Lock size={17} className="mt-0.5 flex-shrink-0" />{message}</div>;
}

function PinPad({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const press = (key: string) => {
    if (disabled) return;
    if (key === "clear") { onChange(""); return; }
    if (key === "back") { onChange(value.slice(0, -1)); return; }
    if (value.length < 6) onChange(value + key);
  };
  return (
    <div>
      <div className="flex items-center justify-center gap-3 my-4">
        {Array.from({ length: 6 }, (_, index) => <span key={index} className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: PRIMARY, backgroundColor: value.length > index ? PRIMARY : "white" }} />)}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map(key => <button key={key} onClick={() => press(key)} disabled={disabled} className="min-h-12 rounded-2xl border text-lg font-bold disabled:opacity-40 active:scale-95" style={{ borderColor: BORDER, color: key === "clear" ? ERROR : TEXT, fontFamily: key.length === 1 ? mono : sans }}>{key === "clear" ? "Clear" : key === "back" ? "⌫" : key}</button>)}
      </div>
    </div>
  );
}

export function LoginScreen({ onLogin }: { onLogin: (role: string, dest: LoginDestination, staffName: string) => void }) {
  const [tab, setTab] = useState<"staff" | "owner">("staff");
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [internetOnline, setInternetOnline] = useState(navigator.onLine);
  const [serverUrl, setServerUrl] = useState("http://hms.local");
  const [showGear, setShowGear] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState("");
  const account = useMemo(() => STAFF_LOGIN_ACCOUNTS.find(item => item.staffId === staffId.trim().toUpperCase()), [staffId]);
  const isLocked = Boolean(lockedUntil && new Date() < lockedUntil);

  useEffect(() => {
    const update = () => setInternetOnline(navigator.onLine);
    window.addEventListener("online", update); window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  const fail = (label: string) => {
    const next = attempts + 1; setAttempts(next); setLoading(false);
    if (next >= MAX_ATTEMPTS) {
      const until = new Date(Date.now() + 15 * 60 * 1000);
      setLockedUntil(until);
      setError(`Too many failed attempts. Sign-in is locked until ${until.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}.`);
    } else setError(`${label} ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? "" : "s"} remaining.`);
  };

  const signInStaff = async (credential?: string) => {
    if (isLocked || loading) return;
    if (!account) { setError("Enter a recognised staff ID."); return; }
    const secret = credential ?? (account.auth === "pin" ? pin : password);
    if (!secret) { setError(`Enter your ${account.auth === "pin" ? "6-digit PIN" : "password"}.`); return; }
    setLoading(true); setError("");
    await new Promise(resolve => window.setTimeout(resolve, 450));
    if (secret !== account.secret) { fail(`Incorrect ${account.auth}.`); setPin(""); return; }
    setLoading(false); onLogin(account.role, account.destination, account.name);
  };

  const updatePin = (next: string) => {
    setPin(next); setError("");
    if (next.length === 6) window.setTimeout(() => signInStaff(next), 80);
  };

  const signInOwner = async () => {
    if (!internetOnline || isLocked || loading) return;
    setLoading(true); setError("");
    await new Promise(resolve => window.setTimeout(resolve, 500));
    const owner = OWNER_LOGIN_ACCOUNTS.find(item => item.email === email.trim().toLowerCase());
    if (!owner || owner.password !== ownerPassword) { fail("Incorrect email or password."); return; }
    setLoading(false); onLogin(owner.role, owner.destination, owner.name);
  };

  if (showForgot) return <ForgotPasswordScreen onBack={() => setShowForgot(false)} />;

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)]" style={{ fontFamily: sans, backgroundColor: NAV_BG }}>
      <section className="hidden lg:flex relative overflow-hidden p-10 xl:p-14 flex-col justify-between" style={{ background: `radial-gradient(circle at 55% 35%, ${TEAL}26, transparent 34%), linear-gradient(145deg, ${NAV_BG}, ${PRIMARY})` }}>
        <div className="absolute inset-0 pointer-events-none opacity-60"><HotelIllustration /></div>
        <div className="relative z-10"><BrandLockup size={44} tone="dark" /></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.02] tracking-tight text-white" style={{ fontFamily: display }}>{BRAND.tagline}</h1>
          <p className="text-lg leading-relaxed text-white/60 mt-6 max-w-xl">Reservations, billing, housekeeping and door locks keep running through NEPA and network outages, and sync to the cloud when it returns.</p>
          <div className="flex flex-wrap gap-2.5 mt-7">{["Works with zero internet", "Smart-lock ready", "Naira and 7.5% VAT built in", "Syncs when connected"].map(item => <span key={item} className="px-3.5 py-2 rounded-full border text-sm font-semibold text-white/80" style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)" }}>{item}</span>)}</div>
        </div>
        <div className="relative z-10"><StatusCard internetOnline={internetOnline} /></div>
        <button onClick={() => setShowDemo(value => !value)} className="absolute bottom-4 left-5 z-20 min-h-12 px-4 rounded-2xl border text-sm font-semibold text-white/70" style={{ borderColor: "rgba(255,255,255,0.16)", backgroundColor: "rgba(255,255,255,0.06)" }}>Demo mode</button>
      </section>

      <section className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
        <div className="lg:hidden p-5 border-b bg-white" style={{ borderColor: BORDER }}><BrandLockup size={38} tone="light" /></div>
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[480px]">
            <div className="rounded-[28px] bg-white border p-6 sm:p-8" style={{ borderColor: BORDER }}>
              <div className="flex items-start justify-between gap-3 mb-6">
                <div><h2 className="text-2xl font-extrabold" style={{ color: TEXT, fontFamily: display }}>Sign in to Nexura</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Grand Palms Ikoyi · Local branch</p></div>
                <div className="relative"><button onClick={() => setShowGear(value => !value)} className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ borderColor: BORDER, color: MUTED }}><GearSix size={20} /></button>{showGear && <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border p-4 z-30" style={{ borderColor: BORDER }}><div className="flex items-center justify-between mb-3"><span className="text-sm font-bold" style={{ color: TEXT }}>Server settings</span><button onClick={() => setShowGear(false)}><X size={16} /></button></div><label className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Local server URL</label><input value={serverUrl} onChange={event => setServerUrl(event.target.value)} className="w-full min-h-12 mt-2 px-3 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} /><p className="text-xs mt-2" style={{ color: SUBTLE }}>IT only · Default http://hms.local</p></div>}</div>
              </div>

              <div className="grid grid-cols-2 p-1 rounded-2xl mb-6" style={{ backgroundColor: BG }}>
                <button onClick={() => { setTab("staff"); setError(""); }} className="min-h-12 rounded-xl text-sm font-bold" style={{ backgroundColor: tab === "staff" ? "white" : "transparent", color: tab === "staff" ? TEXT : MUTED }}>Staff</button>
                <button onClick={() => { setTab("owner"); setError(""); }} className="min-h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: tab === "owner" ? "white" : "transparent", color: tab === "owner" ? TEXT : MUTED }}>Owner / Platform<span className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: internetOnline ? BG : BORDER, color: internetOnline ? TEAL : MUTED }}>Needs internet</span></button>
              </div>

              {error && <div className="mb-5"><ErrorNotice message={error} /></div>}
              {badgeMessage && <div className="mb-5 p-3 rounded-2xl border text-sm" style={{ borderColor: TEAL, color: PRIMARY, backgroundColor: BG }}>{badgeMessage}</div>}

              {tab === "staff" ? <div className="space-y-4">
                <div><label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Staff ID</label><input autoFocus value={staffId} onChange={event => { setStaffId(event.target.value.toUpperCase()); setPin(""); setPassword(""); setError(""); }} placeholder="e.g. FD-014" className="w-full min-h-12 mt-2 px-4 rounded-2xl border text-base font-bold outline-none" style={{ borderColor: BORDER, color: TEXT, fontFamily: mono }} /></div>
                {account && <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ borderColor: BORDER, backgroundColor: BG }}><div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: PRIMARY }}>{account.role}</div><div><div className="text-sm font-bold" style={{ color: TEXT }}>{account.name}</div><div className="text-xs mt-1" style={{ color: MUTED }}>{account.roleName} · {account.auth === "pin" ? "PIN sign-in" : "Password sign-in"}</div></div></div>}
                {account?.auth === "pin" && <PinPad value={pin} onChange={updatePin} disabled={isLocked || loading} />}
                {account?.auth === "password" && <div><label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Password</label><div className="relative mt-2"><input type={showPassword ? "text" : "password"} value={password} onChange={event => { setPassword(event.target.value); setError(""); }} onKeyDown={event => event.key === "Enter" && signInStaff()} placeholder="Enter your password" className="w-full min-h-12 px-4 pr-12 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} /><button onClick={() => setShowPassword(value => !value)} className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center" style={{ color: MUTED }}>{showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}</button></div></div>}
                <button onClick={() => setBadgeMessage("Badge reader is ready. Hold your staff badge near the reader.")} className="w-full min-h-12 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: TEXT }}><IdentificationBadge size={20} />Tap badge</button>
                <label className="min-h-12 flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} className="w-5 h-5" style={{ accentColor: PRIMARY }} /><span className="text-sm" style={{ color: TEXT }}>Remember this device for this shift</span></label>
                {account?.auth === "password" && <button onClick={() => signInStaff()} disabled={loading || isLocked || !password} className="w-full min-h-12 rounded-2xl text-sm font-bold text-white disabled:opacity-40 flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY }}>{loading ? <><CircleNotch size={18} className="animate-spin" />Signing in…</> : "Sign in"}</button>}
                {account?.auth === "pin" && loading && <div className="flex items-center justify-center gap-2 text-sm" style={{ color: MUTED }}><CircleNotch size={18} className="animate-spin" />Checking PIN…</div>}
                <p className="text-sm text-center" style={{ color: MUTED }}>Forgot your PIN? Ask your manager or IT for a temporary PIN.</p>
              </div> : <div>
                {!internetOnline ? <div className="p-6 rounded-3xl border text-center" style={{ borderColor: BORDER, backgroundColor: BG }}><WifiSlash size={34} className="mx-auto" style={{ color: WARNING }} /><div className="text-lg font-bold mt-4" style={{ color: TEXT }}>Internet connection required</div><p className="text-sm mt-2 leading-relaxed" style={{ color: MUTED }}>Owner and Platform sign-in uses cloud MFA. Staff can continue working normally on the local branch.</p></div> : <div className="space-y-4"><div><label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Email address</label><input type="email" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} placeholder="owner@grandpalms.ng" className="w-full min-h-12 mt-2 px-4 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} /></div><div><label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Password</label><input type="password" value={ownerPassword} onChange={event => { setOwnerPassword(event.target.value); setError(""); }} onKeyDown={event => event.key === "Enter" && signInOwner()} placeholder="Enter your password" className="w-full min-h-12 mt-2 px-4 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} /></div><button onClick={signInOwner} disabled={loading || isLocked || !email || !ownerPassword} className="w-full min-h-12 rounded-2xl text-sm font-bold text-white disabled:opacity-40 flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY }}>{loading ? <><CircleNotch size={18} className="animate-spin" />Connecting…</> : "Continue to secure verification"}</button><button onClick={() => setShowForgot(true)} className="w-full min-h-12 text-sm font-semibold" style={{ color: TEAL }}>Reset owner or platform password</button></div>}
              </div>}

              <div className="lg:hidden mt-6 pt-5 border-t" style={{ borderColor: BORDER }}><button onClick={() => setShowDemo(value => !value)} className="min-h-12 text-sm font-bold" style={{ color: MUTED }}>Demo mode</button></div>
            </div>
          </div>
        </div>
      </section>

      {showDemo && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(12,26,54,0.72)" }} onMouseDown={() => setShowDemo(false)}><div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-white border" style={{ borderColor: BORDER }} onMouseDown={event => event.stopPropagation()}><div className="p-5 border-b flex items-center justify-between" style={{ borderColor: BORDER }}><div><div className="text-lg font-bold" style={{ color: TEXT }}>Demo mode</div><div className="text-sm mt-1" style={{ color: MUTED }}>Select a staff ID or use an owner email.</div></div><button onClick={() => setShowDemo(false)} className="w-12 h-12 flex items-center justify-center"><X size={20} /></button></div><div className="p-4"><div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Staff accounts</div>{STAFF_LOGIN_ACCOUNTS.map(item => <button key={item.staffId} onClick={() => { setTab("staff"); setStaffId(item.staffId); setPin(""); setPassword(""); setShowDemo(false); }} className="w-full min-h-14 px-3 border-b flex items-center gap-3 text-left" style={{ borderColor: BORDER }}><span className="w-20 font-bold" style={{ color: TEXT, fontFamily: mono }}>{item.staffId}</span><span className="flex-1 text-sm" style={{ color: TEXT }}>{item.name} · {item.roleName}</span><span className="text-xs" style={{ color: MUTED }}>{item.hint}</span></button>)}<div className="text-xs font-bold uppercase tracking-wider mt-5 mb-2" style={{ color: MUTED }}>Owner / Platform</div>{OWNER_LOGIN_ACCOUNTS.map(item => <button key={item.email} onClick={() => { setTab("owner"); setEmail(item.email); setOwnerPassword(""); setShowDemo(false); }} className="w-full min-h-14 px-3 border-b flex items-center gap-3 text-left" style={{ borderColor: BORDER }}><span className="flex-1 text-sm font-semibold" style={{ color: TEXT }}>{item.email}</span><span className="text-xs" style={{ color: MUTED }}>{item.hint}</span></button>)}</div></div></div>}
    </div>
  );
}

function AuthPageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={{ fontFamily: sans, background: `radial-gradient(circle at 20% 20%, ${TEAL}25, transparent 28%), linear-gradient(145deg, ${NAV_BG}, ${PRIMARY})` }}><div className="absolute inset-0 opacity-30"><HotelIllustration /></div><div className="w-full max-w-md relative z-10"><div className="flex justify-center mb-7"><BrandLockup size={42} tone="dark" /></div><div className="rounded-3xl bg-white border p-7 sm:p-8" style={{ borderColor: BORDER }}>{children}</div></div></div>;
}

export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => { if (!email.trim()) return; setLoading(true); await new Promise(resolve => window.setTimeout(resolve, 700)); setLoading(false); setSent(true); };
  return <AuthPageShell><button onClick={onBack} className="min-h-12 flex items-center gap-2 text-sm font-semibold mb-4" style={{ color: MUTED }}><ArrowLeft size={17} />Back to sign in</button>{!sent ? <><div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: BG, color: PRIMARY }}><Key size={22} /></div><h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Reset cloud password</h1><p className="text-sm mt-2 mb-6 leading-relaxed" style={{ color: MUTED }}>Owner and Platform accounts can receive a password reset by email. Staff PINs are reset locally by a manager or IT.</p><input type="email" value={email} onChange={event => setEmail(event.target.value)} onKeyDown={event => event.key === "Enter" && submit()} placeholder="owner@grandpalms.ng" className="w-full min-h-12 px-4 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} /><button onClick={submit} disabled={!email || loading} className="w-full min-h-12 mt-4 rounded-2xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{loading ? "Sending…" : "Send Reset Link"}</button></> : <><div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: BG, color: SUCCESS }}><CheckCircle size={23} /></div><h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Check your email</h1><p className="text-sm mt-2 mb-6 leading-relaxed" style={{ color: MUTED }}>If {email} has an Owner or Platform account, a secure reset link has been sent.</p><button onClick={onBack} className="w-full min-h-12 rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Back to Sign In</button></>}</AuthPageShell>;
}

export function ForceChangePasswordScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const requirements = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
    { label: "One number", ok: /\d/.test(password) },
    { label: "Passwords match", ok: password.length > 0 && password === confirm },
  ];
  const ready = requirements.every(item => item.ok) && current.length > 0;
  const submit = () => { if (!ready) { setError("Complete every password requirement."); return; } onComplete(); };
  return <AuthPageShell><div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: BG, color: WARNING }}><ShieldCheck size={23} /></div><h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Choose a personal password</h1><p className="text-sm mt-2 mb-6 leading-relaxed" style={{ color: MUTED }}>Your temporary Front Desk password must be replaced before opening the workspace.</p>{error && <div className="mb-4"><ErrorNotice message={error} /></div>}<div className="space-y-4">{[["Temporary password", current, setCurrent], ["New password", password, setPassword], ["Confirm new password", confirm, setConfirm]].map(([label, value, setter]) => <label key={label as string} className="block text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label as string}<div className="relative mt-2"><input type={show ? "text" : "password"} value={value as string} onChange={event => { (setter as (value: string) => void)(event.target.value); setError(""); }} className="w-full min-h-12 px-4 pr-12 rounded-2xl border text-base outline-none" style={{ borderColor: BORDER }} />{label === "New password" && <button onClick={() => setShow(value => !value)} className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center" style={{ color: MUTED }}>{show ? <EyeSlash size={18} /> : <Eye size={18} />}</button>}</div></label>)}</div><div className="mt-5 p-4 rounded-2xl" style={{ backgroundColor: BG }}>{requirements.map(item => <div key={item.label} className="flex items-center gap-2 py-1 text-sm" style={{ color: item.ok ? SUCCESS : MUTED }}>{item.ok ? <CheckCircle size={16} weight="fill" /> : <span className="w-4 h-4 rounded-full border" style={{ borderColor: BORDER }} />}{item.label}</div>)}</div><button onClick={submit} disabled={!ready} className="w-full min-h-12 mt-5 rounded-2xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Set Password & Sign In</button></AuthPageShell>;
}
