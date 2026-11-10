import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Backspace, Bell, Broom, Buildings, CheckCircle, CircleNotch,
  Cloud, CloudSlash, CurrencyNgn, Eye, EyeSlash, ForkKnife, GearSix,
  IdentificationBadge, Key, Lock, ShieldCheck, Wrench, X,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED,
  SUBTLE, BG, mono, sans, display,
} from "./constants";
import { BRAND, BrandLockup, BrandMark } from "./brand/Brand";
import { OWNER_LOGIN_ACCOUNTS, STAFF_LOGIN_ACCOUNTS, type LoginDestination } from "./mock/staffLogin";

const MAX_ATTEMPTS = 5;
const canvasBackground = `radial-gradient(circle at 70% 42%, ${TEAL}1f 0, transparent 30%), radial-gradient(circle at 8% 92%, ${ORANGE}12 0, transparent 34%), linear-gradient(135deg, #fbfdfc 0%, #f0f8f6 52%, #f8f5ef 100%)`;

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="text-xs font-semibold" style={{ color: MUTED, fontFamily: mono }}>
      {time.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false })} · {time.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })}
    </span>
  );
}

const suiteTiles = [
  { label: "Front Office", live: "12 arrivals", icon: Bell, color: TEAL },
  { label: "Housekeeping", live: "8 rooms ready", icon: Broom, color: SUCCESS },
  { label: "Restaurant", live: "3 open tables", icon: ForkKnife, color: ORANGE },
  { label: "Finance", live: "Night audit due", icon: CurrencyNgn, color: WARNING },
  { label: "Access", live: "42 locks online", icon: Key, color: TEAL },
  { label: "Maintenance", live: "2 urgent", icon: Wrench, color: ERROR },
];

function SuitePreview() {
  return (
    <div className="relative mx-auto w-[92%] max-w-[620px] pb-5 pt-3">
      <div className="absolute inset-x-10 inset-y-5 rotate-[5deg] rounded-[26px] border bg-white/70 shadow-lg" style={{ borderColor: `${TEAL}20` }} />
      <div className="absolute inset-x-6 inset-y-3 -rotate-[3deg] rounded-[26px] border bg-white/80 shadow-lg" style={{ borderColor: `${PRIMARY}18` }} />
      <div className="relative rounded-[26px] border border-white/[0.16] p-4 shadow-2xl" style={{ background: `linear-gradient(145deg, ${NAV_BG}, #10274b)` }}>
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Buildings size={17} color="white" /></div>
            <div><div className="text-xs font-bold text-white">Grand Palms Ikoyi</div><div className="text-[10px] text-white/45">Live operations</div></div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />All systems live</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {suiteTiles.map(({ label, live, icon: Icon, color }) => (
            <div key={label} className="min-w-0 rounded-xl border border-white/[0.09] bg-[#07162d]/45 p-2.5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}22`, color }}><Icon size={15} weight="duotone" /></div>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
              <div className="truncate text-[11px] font-bold text-white">{label}</div>
              <div className="mt-1.5 inline-flex max-w-full rounded-full bg-white/[0.07] px-1.5 py-0.5 text-[8px] font-semibold leading-tight text-white/55">{live}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusStrip({ internetOnline }: { internetOnline: boolean }) {
  const pills = [
    { label: "Local server", detail: "12 ms", color: SUCCESS },
    { label: "Database", detail: "Healthy", color: SUCCESS },
    { label: "Door locks", detail: "42", color: SUCCESS },
    { label: "Internet", detail: internetOnline ? "Cloud connected" : "Offline: branch fully operational", color: internetOnline ? SUCCESS : WARNING },
  ];
  return (
    <div>
      <div className="mb-2 flex justify-end"><LiveClock /></div>
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {pills.map(pill => (
          <div key={pill.label} className="flex min-h-11 items-center gap-2 rounded-full border bg-white/80 px-3 shadow-sm" style={{ borderColor: `${TEAL}20` }}>
            <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: pill.color, boxShadow: `0 0 10px ${pill.color}` }} />
            <span className="min-w-0 text-[10px] leading-tight" style={{ color: MUTED }}><strong className="block font-bold" style={{ color: TEXT }}>{pill.label}</strong><span className="block">{pill.detail}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return <div className="flex items-start gap-2.5 rounded-xl border p-3 text-sm" style={{ backgroundColor: BG, borderColor: ERROR, color: ERROR }}><Lock size={16} className="mt-0.5 flex-none" />{message}</div>;
}

function DigitDots({ value, length, label }: { value: string; length: number; label: string }) {
  return (
    <div>
      <div className="mb-1 text-center text-xs font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>{label}</div>
      <div className="my-3 flex items-center justify-center gap-3" aria-label={`${value.length} of ${length} digits entered`}>
        {Array.from({ length }, (_, index) => (
          <span key={index} className={`rounded-full border-2 transition-all ${length === 4 ? "h-5 w-5" : "h-3.5 w-3.5"}`} style={{ borderColor: value.length > index ? PRIMARY : BORDER, backgroundColor: value.length > index ? PRIMARY : "white", boxShadow: value.length > index ? `0 0 0 3px ${TEAL}15` : "none" }} />
        ))}
      </div>
    </div>
  );
}

function NumberPad({ value, maxLength, onChange, disabled }: { value: string; maxLength: number; onChange: (value: string) => void; disabled?: boolean }) {
  const press = (key: string) => {
    if (disabled) return;
    if (key === "clear") onChange("");
    else if (key === "back") onChange(value.slice(0, -1));
    else if (value.length < maxLength) onChange(value + key);
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map(key => (
        <button type="button" key={key} onClick={() => press(key)} disabled={disabled} className="min-h-14 rounded-xl border text-lg font-bold transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-40" style={{ borderColor: BORDER, color: key === "clear" ? ERROR : TEXT, fontFamily: key.length === 1 ? mono : sans, backgroundColor: key.length === 1 ? "white" : BG }}>
          {key === "clear" ? <span className="text-xs">Clear</span> : key === "back" ? <Backspace size={20} className="mx-auto" /> : key}
        </button>
      ))}
    </div>
  );
}

function StepProgress({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      {[1, 2].map(item => <span key={item} className="h-1.5 rounded-full transition-all" style={{ width: item === step ? 34 : 16, backgroundColor: item <= step ? TEAL : BORDER }} />)}
      <span className="ml-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Step {step} of 2</span>
    </div>
  );
}

type LoginScreenProps = {
  onLogin: (role: string, dest: LoginDestination, staffName: string) => void;
  onOpenFieldApp?: () => void;
};

export function LoginScreen({ onLogin, onOpenFieldApp }: LoginScreenProps) {
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
  const account = useMemo(() => STAFF_LOGIN_ACCOUNTS.find(item => item.staffId === staffId), [staffId]);
  const isLocked = Boolean(lockedUntil && new Date() < lockedUntil);
  const staffStep: 1 | 2 = account ? 2 : 1;

  useEffect(() => {
    const update = () => setInternetOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  useEffect(() => {
    if (!lockedUntil) return;
    const remaining = lockedUntil.getTime() - Date.now();
    if (remaining <= 0) {
      setLockedUntil(null);
      setAttempts(0);
      setError("");
      return;
    }
    const timer = window.setTimeout(() => {
      setLockedUntil(null);
      setAttempts(0);
      setError("");
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [lockedUntil]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (tab !== "staff" || showDemo || showGear || showForgot || loading || isLocked) return;
      if (event.key === "Backspace") {
        if (!account) setStaffId(value => value.slice(0, -1));
        else if (account.auth === "pin") setPin(value => value.slice(0, -1));
        return;
      }
      if (!/^\d$/.test(event.key)) return;
      if (!account) setStaffId(value => value.length < 4 ? value + event.key : value);
      else if (account.auth === "pin") setPin(value => value.length < 6 ? value + event.key : value);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [account, isLocked, loading, showDemo, showForgot, showGear, tab]);

  useEffect(() => {
    if (staffId.length === 4 && !account) setError("Staff number not recognised. Check the four digits and try again.");
    else if (account) setError("");
  }, [account, staffId]);

  const fail = (label: string) => {
    const next = attempts + 1;
    setAttempts(next);
    setLoading(false);
    if (next >= MAX_ATTEMPTS) {
      const until = new Date(Date.now() + 15 * 60 * 1000);
      setLockedUntil(until);
      setError(`Too many failed attempts. Sign-in is locked until ${until.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}.`);
    } else {
      setError(`${label} ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? "" : "s"} remaining.`);
    }
  };

  const signInStaff = async (credential?: string) => {
    if (!account || isLocked || loading) return;
    const secret = credential ?? (account.auth === "pin" ? pin : password);
    if (!secret) { setError(`Enter your ${account.auth === "pin" ? "6-digit PIN" : "password"}.`); return; }
    setLoading(true);
    setError("");
    await new Promise(resolve => window.setTimeout(resolve, 450));
    if (secret !== account.secret) { fail(`Incorrect ${account.auth}.`); setPin(""); return; }
    setLoading(false);
    onLogin(account.role, account.destination, account.name);
  };

  useEffect(() => {
    if (account?.auth === "pin" && pin.length === 6) {
      const timer = window.setTimeout(() => signInStaff(pin), 80);
      return () => window.clearTimeout(timer);
    }
  // signInStaff intentionally runs only when a complete PIN is entered.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const resetStaff = () => {
    setStaffId("");
    setPin("");
    setPassword("");
    setError("");
    setBadgeMessage("");
  };

  const signInOwner = async () => {
    if (!internetOnline || isLocked || loading) return;
    setLoading(true);
    setError("");
    await new Promise(resolve => window.setTimeout(resolve, 500));
    const owner = OWNER_LOGIN_ACCOUNTS.find(item => item.email === email.trim().toLowerCase());
    if (!owner || owner.password !== ownerPassword) { fail("Incorrect email or password."); return; }
    setLoading(false);
    onLogin(owner.role, owner.destination, owner.name);
  };

  if (showForgot) return <ForgotPasswordScreen onBack={() => setShowForgot(false)} />;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ fontFamily: sans, background: canvasBackground }}>
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${TEAL}12` }} />
      <div className="pointer-events-none absolute -bottom-28 right-[30%] h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: `${ORANGE}0d` }} />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_500px]">
        <section className="hidden min-h-screen flex-col px-10 py-9 lg:flex xl:px-16 xl:py-11">
          <div className="flex-none"><BrandLockup size={42} tone="light" /></div>
          <div className="flex flex-1 flex-col justify-center py-7">
            <div className="max-w-2xl">
              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.06] tracking-[-0.04em]" style={{ color: TEXT, fontFamily: display }}>{BRAND.tagline}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: MUTED }}>Run every department, payment and guest moment from one dependable system built for Nigerian hotels.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Works with zero internet", "Smart-lock ready", "Naira + VAT built in", "Syncs when connected"].map(item => <span key={item} className="rounded-full border bg-white/70 px-3 py-1.5 text-xs font-semibold shadow-sm" style={{ borderColor: `${TEAL}20`, color: PRIMARY }}>{item}</span>)}
              </div>
            </div>
          </div>
          <div className="flex-none">
            <SuitePreview />
            <StatusStrip internetOnline={internetOnline} />
          </div>
        </section>

        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-7 sm:px-7">
          <div className="mb-6 flex justify-center lg:hidden"><BrandLockup size={40} tone="light" /></div>
          <div className="w-full max-w-[440px] rounded-3xl bg-white p-5 shadow-[0_0_0_1px_rgba(47,191,174,0.18),0_0_70px_rgba(47,191,174,0.16),0_30px_80px_rgba(0,0,0,0.28)] sm:p-7">
            <div className="relative text-center">
              <button type="button" onClick={() => setShowGear(value => !value)} aria-label="Server settings" className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl border" style={{ borderColor: BORDER, color: MUTED }}><GearSix size={19} /></button>
              <BrandMark size={56} />
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight" style={{ color: TEXT, fontFamily: display }}>Welcome back</h2>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: BG, color: MUTED }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: SUCCESS }} />Grand Palms Ikoyi <span style={{ color: SUBTLE }}>·</span> Local server</div>
              {showGear && (
                <div className="absolute right-0 top-12 z-30 w-[min(18rem,calc(100vw-4rem))] rounded-2xl border bg-white p-4 text-left shadow-xl" style={{ borderColor: BORDER }}>
                  <div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold" style={{ color: TEXT }}>Server settings</span><button type="button" onClick={() => setShowGear(false)} className="flex h-10 w-10 items-center justify-center"><X size={16} /></button></div>
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Local server URL</label>
                  <input value={serverUrl} onChange={event => setServerUrl(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border px-3 text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} />
                  <p className="mt-2 text-xs" style={{ color: SUBTLE }}>IT only · Default http://hms.local</p>
                </div>
              )}
            </div>

            <div className="my-5 grid grid-cols-2 rounded-xl p-1" style={{ backgroundColor: BG }}>
              <button type="button" onClick={() => { setTab("staff"); setError(""); }} className="min-h-12 rounded-lg text-sm font-bold shadow-sm" style={{ backgroundColor: tab === "staff" ? "white" : "transparent", color: tab === "staff" ? TEXT : MUTED }}>Staff</button>
              <button type="button" onClick={() => { setTab("owner"); setError(""); }} className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 text-xs font-bold sm:text-sm" style={{ backgroundColor: tab === "owner" ? "white" : "transparent", color: tab === "owner" ? TEXT : MUTED }}>
                <span className="whitespace-nowrap">Owner / Platform</span>
                <span className="hidden whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] min-[480px]:inline" style={{ backgroundColor: BORDER, color: MUTED }}>Needs internet</span>
                <span className="min-[480px]:hidden">{internetOnline ? <Cloud size={15} /> : <CloudSlash size={15} />}</span>
              </button>
            </div>

            {error && <div className="mb-4"><ErrorNotice message={error} /></div>}
            {badgeMessage && <div className="mb-4 rounded-xl border p-3 text-sm" style={{ borderColor: TEAL, color: PRIMARY, backgroundColor: BG }}>{badgeMessage}</div>}

            {tab === "staff" ? (
              <div>
                <StepProgress step={staffStep} />
                {!account ? (
                  <>
                    <DigitDots value={staffId} length={4} label="Staff number" />
                    <NumberPad value={staffId} maxLength={4} onChange={value => { setStaffId(value); setError(""); }} disabled={isLocked || loading} />
                  </>
                ) : (
                  <>
                    <div className="mb-3 flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: BORDER, backgroundColor: BG }}>
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full text-sm font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${TEAL}, ${PRIMARY})` }}>{account.name.split(" ").map(name => name[0]).join("").slice(0, 2)}</div>
                      <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold" style={{ color: TEXT }}>{account.name}</div><div className="mt-0.5 text-xs" style={{ color: MUTED }}>{account.roleName}</div></div>
                      <button type="button" onClick={resetStaff} className="min-h-10 px-2 text-xs font-bold" style={{ color: TEAL }}>Not you?</button>
                    </div>
                    {account.auth === "pin" ? (
                      <>
                        <DigitDots value={pin} length={6} label="Enter your PIN" />
                        <NumberPad value={pin} maxLength={6} onChange={value => { setPin(value); setError(""); }} disabled={isLocked || loading} />
                        {loading && <div className="mt-3 flex items-center justify-center gap-2 text-sm" style={{ color: MUTED }}><CircleNotch size={17} className="animate-spin" />Checking PIN…</div>}
                      </>
                    ) : (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Password</label>
                        <div className="relative mt-2">
                          <input autoFocus type={showPassword ? "text" : "password"} value={password} onChange={event => { setPassword(event.target.value); setError(""); }} onKeyDown={event => event.key === "Enter" && signInStaff()} placeholder="Enter your password" className="min-h-14 w-full rounded-xl border px-4 pr-12 text-base outline-none" style={{ borderColor: BORDER }} />
                          <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center" style={{ color: MUTED }}>{showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}</button>
                        </div>
                        <button type="button" onClick={() => signInStaff()} disabled={loading || isLocked || !password} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{loading ? <><CircleNotch size={18} className="animate-spin" />Signing in…</> : "Sign in"}</button>
                      </div>
                    )}
                  </>
                )}
                <button type="button" onClick={() => setBadgeMessage("Badge reader is ready. Hold your staff badge near the reader.")} className="mx-auto mt-3 flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-bold" style={{ color: TEAL }}><IdentificationBadge size={19} />Tap badge instead</button>
                <label className="flex min-h-12 cursor-pointer items-center justify-center gap-3"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} className="h-5 w-5" style={{ accentColor: PRIMARY }} /><span className="text-sm" style={{ color: TEXT }}>Remember this device for this shift</span></label>
                {account?.auth === "pin" && <p className="text-center text-xs" style={{ color: MUTED }}>Forgot your PIN? Ask your manager or IT for a temporary PIN.</p>}
              </div>
            ) : (
              <div>
                {!internetOnline ? (
                  <div className="rounded-2xl border p-6 text-center" style={{ borderColor: BORDER, backgroundColor: BG }}><CloudSlash size={32} className="mx-auto" style={{ color: WARNING }} /><div className="mt-3 text-base font-bold" style={{ color: TEXT }}>Internet connection required</div><p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Owner and Platform sign-in uses cloud MFA. Staff can continue working on the local branch.</p></div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Email address<input type="email" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} placeholder="owner@grandpalms.ng" className="mt-2 min-h-14 w-full rounded-xl border px-4 text-base font-normal normal-case tracking-normal outline-none" style={{ borderColor: BORDER }} /></label>
                    <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Password<input type="password" value={ownerPassword} onChange={event => { setOwnerPassword(event.target.value); setError(""); }} onKeyDown={event => event.key === "Enter" && signInOwner()} placeholder="Enter your password" className="mt-2 min-h-14 w-full rounded-xl border px-4 text-base font-normal normal-case tracking-normal outline-none" style={{ borderColor: BORDER }} /></label>
                    <button type="button" onClick={signInOwner} disabled={loading || isLocked || !email || !ownerPassword} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{loading ? <><CircleNotch size={18} className="animate-spin" />Connecting…</> : "Continue to secure verification"}</button>
                    <button type="button" onClick={() => setShowForgot(true)} className="min-h-12 w-full text-sm font-semibold" style={{ color: TEAL }}>Reset owner or platform password</button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4 text-xs font-semibold" style={{ borderColor: BORDER, color: MUTED }}>
              <button type="button" onClick={onOpenFieldApp} disabled={!onOpenFieldApp} className="min-h-10 px-1 disabled:opacity-40">Field app</button>
              <button type="button" onClick={() => setShowDemo(true)} className="min-h-10 px-1">Demo mode</button>
              <span className="flex min-h-10 items-center gap-1.5 whitespace-nowrap"><Lock size={13} />Secured by Nexura</span>
            </div>
          </div>
        </section>
      </div>

      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(3,12,28,0.82)" }} onMouseDown={() => setShowDemo(false)}>
          <div className="max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5" style={{ borderColor: BORDER }}><div><div className="text-lg font-bold" style={{ color: TEXT }}>Demo mode</div><div className="mt-1 text-sm" style={{ color: MUTED }}>Choose a staff number or owner account.</div></div><button type="button" onClick={() => setShowDemo(false)} className="flex h-12 w-12 items-center justify-center"><X size={20} /></button></div>
            <div className="p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Staff accounts</div>
              {STAFF_LOGIN_ACCOUNTS.map(item => <button type="button" key={item.staffId} onClick={() => { setTab("staff"); setStaffId(item.staffId); setPin(""); setPassword(""); setShowDemo(false); }} className="flex min-h-14 w-full items-center gap-3 border-b px-3 text-left" style={{ borderColor: BORDER }}><span className="w-14 font-bold" style={{ color: TEXT, fontFamily: mono }}>{item.staffId}</span><span className="min-w-0 flex-1 text-sm" style={{ color: TEXT }}>{item.name} · {item.roleName}</span><span className="text-xs" style={{ color: MUTED }}>{item.hint}</span></button>)}
              <div className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Owner / Platform</div>
              {OWNER_LOGIN_ACCOUNTS.map(item => <button type="button" key={item.email} onClick={() => { setTab("owner"); setEmail(item.email); setOwnerPassword(""); setShowDemo(false); }} className="flex min-h-14 w-full items-center gap-3 border-b px-3 text-left" style={{ borderColor: BORDER }}><span className="min-w-0 flex-1 text-sm font-semibold" style={{ color: TEXT }}>{item.email}</span><span className="text-xs" style={{ color: MUTED }}>{item.hint}</span></button>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-7" style={{ fontFamily: sans, background: canvasBackground }}>
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${TEAL}12` }} />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: `${ORANGE}0d` }} />
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-6 flex justify-center"><BrandLockup size={40} tone="light" /></div>
        <div className="rounded-3xl bg-white p-6 shadow-[0_0_0_1px_rgba(47,191,174,0.18),0_0_70px_rgba(47,191,174,0.16),0_30px_80px_rgba(0,0,0,0.28)] sm:p-8">{children}</div>
      </div>
    </div>
  );
}

export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(resolve => window.setTimeout(resolve, 700));
    setLoading(false);
    setSent(true);
  };
  return (
    <AuthPageShell>
      <button type="button" onClick={onBack} className="mb-4 flex min-h-12 items-center gap-2 text-sm font-semibold" style={{ color: MUTED }}><ArrowLeft size={17} />Back to sign in</button>
      {!sent ? (
        <>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: BG, color: PRIMARY }}><Key size={22} /></div>
          <h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Reset cloud password</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Owner and Platform accounts can receive a password reset by email. Staff PINs are reset locally by a manager or IT.</p>
          <input type="email" value={email} onChange={event => setEmail(event.target.value)} onKeyDown={event => event.key === "Enter" && submit()} placeholder="owner@grandpalms.ng" className="min-h-14 w-full rounded-xl border px-4 text-base outline-none" style={{ borderColor: BORDER }} />
          <button type="button" onClick={submit} disabled={!email || loading} className="mt-4 min-h-14 w-full rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{loading ? "Sending…" : "Send reset link"}</button>
        </>
      ) : (
        <>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: BG, color: SUCCESS }}><CheckCircle size={23} /></div>
          <h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Check your email</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>If {email} has an Owner or Platform account, a secure reset link has been sent.</p>
          <button type="button" onClick={onBack} className="min-h-14 w-full rounded-xl text-sm font-bold text-white" style={{ backgroundColor: PRIMARY }}>Back to sign in</button>
        </>
      )}
    </AuthPageShell>
  );
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
  const fields = [
    { label: "Temporary password", value: current, setter: setCurrent },
    { label: "New password", value: password, setter: setPassword },
    { label: "Confirm new password", value: confirm, setter: setConfirm },
  ];
  const submit = () => {
    if (!ready) { setError("Complete every password requirement."); return; }
    onComplete();
  };
  return (
    <AuthPageShell>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: BG, color: WARNING }}><ShieldCheck size={23} /></div>
      <h1 className="text-2xl font-bold" style={{ color: TEXT, fontFamily: display }}>Choose a personal password</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Your temporary Front Desk password must be replaced before opening the workspace.</p>
      {error && <div className="mb-4"><ErrorNotice message={error} /></div>}
      <div className="space-y-4">
        {fields.map(field => (
          <label key={field.label} className="block text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>
            {field.label}
            <div className="relative mt-2">
              <input type={show ? "text" : "password"} value={field.value} onChange={event => { field.setter(event.target.value); setError(""); }} className="min-h-14 w-full rounded-xl border px-4 pr-12 text-base outline-none" style={{ borderColor: BORDER }} />
              {field.label === "New password" && <button type="button" onClick={() => setShow(value => !value)} className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center" style={{ color: MUTED }}>{show ? <EyeSlash size={18} /> : <Eye size={18} />}</button>}
            </div>
          </label>
        ))}
      </div>
      <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: BG }}>
        {requirements.map(item => <div key={item.label} className="flex items-center gap-2 py-1 text-sm" style={{ color: item.ok ? SUCCESS : MUTED }}>{item.ok ? <CheckCircle size={16} weight="fill" /> : <span className="h-4 w-4 rounded-full border" style={{ borderColor: BORDER }} />}{item.label}</div>)}
      </div>
      <button type="button" onClick={submit} disabled={!ready} className="mt-5 min-h-14 w-full rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Set password & sign in</button>
    </AuthPageShell>
  );
}
