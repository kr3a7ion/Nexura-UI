import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { CheckCircle, Eye, EyeSlash, Lock, ShieldCheck, User } from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED,
  SUBTLE, BG, sans, display,
} from "./constants";
import { BRAND, BrandLockup, BrandMark } from "./brand/Brand";
import { LOGIN_ACCOUNTS, type LoginAccount, type LoginKind } from "./mock/staffLogin";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const REMEMBER_KEY = "nexura.username";
const canvasBackground = `radial-gradient(circle at 70% 42%, ${TEAL}1f 0, transparent 30%), radial-gradient(circle at 8% 92%, ${ORANGE}12 0, transparent 34%), linear-gradient(135deg, #fbfdfc 0%, #f0f8f6 52%, #f8f5ef 100%)`;

const COPY = {
  staff: {
    sub: "Grand Palms Hotel, Abuja. Use the username and password your manager gave you.",
    forgot: "Forgot your password? Ask your manager to reset it.",
    online: "Online", offline: "Working offline. Changes will sync later.",
    kicker: "Nexura Hotel Suite", title: BRAND.tagline,
    body: "Check guests in, take orders and open rooms on the hotel's own server, with or without internet.",
    card: "Everything you do today is saved here first.", cardBody: "When the internet comes back, Nexura syncs it to the cloud on its own.",
  },
  cloud: {
    sub: "For hotel owners and Nexura platform admins.",
    forgot: "Forgot your password? Contact Nexura support.",
    online: "Connected to Nexura cloud", offline: "No internet",
    kicker: "Nexura for owners", title: "All your hotels, one sign-in.",
    body: "Occupancy, revenue and sync status for every branch, from wherever you are.",
    card: "Each branch keeps running on its own server.", cardBody: "You see the full picture as soon as each one syncs.",
  },
} as const;

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return online;
}

// localStorage can throw (private mode, locked-down kiosk); remembering the username is optional.
const readRemembered = () => { try { return localStorage.getItem(REMEMBER_KEY) ?? ""; } catch { return ""; } };
const writeRemembered = (value: string | null) => { try { value ? localStorage.setItem(REMEMBER_KEY, value) : localStorage.removeItem(REMEMBER_KEY); } catch { /* ignore */ } };

function Field({ id, label, icon, children }: { id: string; label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium" style={{ color: TEXT }}>{label}</label>
      <div className="flex h-12 items-center gap-2.5 rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 focus-within:border-[#1BA39C] focus-within:ring-1 focus-within:ring-[#1BA39C]">
        <span style={{ color: SUBTLE }}>{icon}</span>
        {children}
      </div>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: "ok" | "warn" | "error"; label: string }) {
  const color = tone === "ok" ? TEAL : tone === "warn" ? WARNING : ERROR;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium" style={{ backgroundColor: tone === "warn" ? "#FEF3C7" : "white", borderColor: tone === "warn" ? "transparent" : BORDER, color: tone === "warn" ? "#92400E" : MUTED }}>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{label}
    </span>
  );
}

function ShowcasePanel({ kicker, title, body, card, cardBody, notch, notchColor }: { kicker: string; title: string; body: string; card: string; cardBody: string; notch: string; notchColor: string }) {
  return (
    <aside className="relative m-6 ml-0 hidden w-[700px] max-w-[48vw] shrink-0 overflow-hidden rounded-[32px] lg:block" style={{ backgroundColor: NAV_BG }}>
      <div className="pointer-events-none absolute -left-8 -top-[380px] h-[760px] w-[760px] rounded-full blur-[110px]" style={{ backgroundColor: `${TEAL}33` }} />
      <svg className="pointer-events-none absolute right-0 top-0" width="420" height="520" viewBox="0 0 420 520" aria-hidden="true">
        <defs><linearGradient id="nx-streak" x1="420" y1="0" x2="0" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor={TEAL} stopOpacity="0.9" /><stop offset="0.6" stopColor="#fff" stopOpacity="0.12" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
        <path d="M420 0 0 520" stroke="url(#nx-streak)" strokeWidth="10" />
        <path d="M420 60 60 520" stroke="url(#nx-streak)" strokeWidth="3" />
        <path d="M420 130 130 520" stroke="url(#nx-streak)" strokeWidth="1.5" opacity="0.6" />
      </svg>
      <svg className="pointer-events-none absolute left-[150px] top-[10px]" width="400" height="400" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="nx-glyph" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse"><stop stopColor="#5B5B62" /><stop offset="0.5" stopColor="#2C2C30" /><stop offset="1" stopColor={PRIMARY} /></linearGradient>
          <linearGradient id="nx-shine" x1="14" y1="12" x2="30" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor={TEAL} /><stop offset="1" stopColor={TEAL} stopOpacity="0" /></linearGradient>
        </defs>
        <g transform="translate(1.2 1.2)" opacity="0.6"><circle cx="22" cy="22" r="8.5" stroke="#000" strokeWidth="5" fill="none" /><path d="M27.8 28.2 43 43.4V35h7v15H35v-7h7.2L27 27.8" /></g>
        <circle cx="22" cy="22" r="8.5" stroke="url(#nx-glyph)" strokeWidth="5" fill="none" />
        <path d="M27.8 28.2 43 43.4V35h7v15H35v-7h7.2L27 27.8" fill="url(#nx-glyph)" />
        <path d="M15 18.5a8.5 8.5 0 0 1 10-5.6" stroke="url(#nx-shine)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="49.5" cy="16" r="1.8" fill={WARNING} />
      </svg>
      <div className="absolute inset-x-14 bottom-14">
        <p className="text-sm font-medium text-white/60">{kicker}</p>
        <h2 className="mt-3 max-w-[500px] text-[38px] font-extrabold leading-[1.15] tracking-[-0.035em] text-white" style={{ fontFamily: display }}>{title}</h2>
        <p className="mt-3 max-w-[500px] text-[15px] leading-relaxed text-white/60">{body}</p>
        <div className="relative mt-10 h-[172px] w-[560px] max-w-full">
          <svg className="absolute inset-0" width="560" height="172" viewBox="0 0 560 172" aria-hidden="true"><path d="M24 0H372C390 0 400 10 400 28C400 40 408 48 420 48H536C549 48 560 59 560 72V148C560 161 549 172 536 172H24C11 172 0 161 0 148V24C0 11 11 0 24 0Z" fill="#232326" /></svg>
          <div className="absolute left-6 top-6 max-w-[320px]">
            <p className="text-xl font-bold leading-snug text-white" style={{ fontFamily: display }}>{card}</p>
            <p className="mt-2.5 text-sm leading-relaxed text-white/60">{cardBody}</p>
          </div>
          <span className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-full bg-[#232326] px-3.5 py-2 text-[13px] font-medium text-white/85">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: notchColor }} />{notch}
          </span>
        </div>
      </div>
    </aside>
  );
}

type Attempts = Record<string, { fails: number; until: number }>;

export function LoginScreen({ kind, onLogin, onOpenFieldApp }: { kind: LoginKind; onLogin: (account: LoginAccount) => void; onOpenFieldApp?: () => void }) {
  const copy = COPY[kind];
  const online = useOnline();
  const [username, setUsername] = useState(readRemembered);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => readRemembered() !== "");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<Attempts>({});

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const key = username.trim().toLowerCase();
    if (!key || !password) { setError("Enter your username and password."); return; }
    if (kind === "cloud" && !online) { setError("You're offline. Connect to the internet to sign in."); return; }
    const now = Date.now();
    const prior = attempts[key];
    if (prior && prior.until > now) { setError(`Too many tries. Try again in ${Math.ceil((prior.until - now) / 60000)} min.`); return; }
    const account = LOGIN_ACCOUNTS.find(a => a.kind === kind && a.username === key && a.password === password);
    if (!account) {
      const fails = (prior?.fails ?? 0) + 1;
      const left = MAX_ATTEMPTS - fails;
      setAttempts({ ...attempts, [key]: left <= 0 ? { fails: 0, until: now + LOCK_MS } : { fails, until: 0 } });
      setError(left <= 0 ? "Too many tries. This username is locked for 15 minutes." : `Wrong username or password. ${left} ${left === 1 ? "try" : "tries"} left.`);
      setPassword("");
      return;
    }
    writeRemembered(remember ? key : null);
    onLogin(account);
  };

  const status = kind === "staff"
    ? online ? { tone: "ok" as const, label: copy.online } : { tone: "warn" as const, label: copy.offline }
    : online ? { tone: "ok" as const, label: copy.online } : { tone: "error" as const, label: copy.offline };
  const notch = kind === "staff"
    ? online ? { label: "All changes synced", color: TEAL } : { label: "36 changes waiting", color: WARNING }
    : { label: "All branches synced", color: TEAL };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BG, fontFamily: sans }}>
      <main className="relative flex flex-1 items-center px-6 pb-28 pt-16 sm:px-12 lg:px-[150px]">
        <form onSubmit={submit} noValidate className="w-full max-w-[360px]">
          <BrandMark size={40} />
          <div className="mt-2.5 text-[15px] font-bold" style={{ color: TEXT, fontFamily: display }}>{BRAND.name}</div>
          <h1 className="mt-7 text-[34px] font-extrabold leading-tight tracking-[-0.03em]" style={{ color: TEXT, fontFamily: display }}>Sign in</h1>
          <p className="mt-1.5 text-[15px]" style={{ color: MUTED }}>{copy.sub}</p>

          <div className="mt-7 space-y-[18px]">
            <Field id="login-username" label="Username" icon={<User size={18} />}>
              <input id="login-username" value={username} onChange={e => { setUsername(e.target.value); setError(""); }} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" style={{ color: TEXT }} />
            </Field>
            <Field id="login-password" label="Password" icon={<Lock size={18} />}>
              <input id="login-password" type={show ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" style={{ color: TEXT }} />
              <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? "Hide password" : "Show password"} className="text-[13px] font-medium" style={{ color: "#0F766E" }}>{show ? "Hide" : "Show"}</button>
            </Field>
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm" style={{ color: TEXT }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 accent-[#1BA39C]" />
              Remember my username
            </label>
            {error && <p role="alert" className="text-sm font-medium" style={{ color: ERROR }}>{error}</p>}
            <button type="submit" className="h-[50px] w-full rounded-[10px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BA39C]" style={{ backgroundColor: PRIMARY }}>Sign in</button>
            <p className="text-[13px]" style={{ color: MUTED }}>{copy.forgot}</p>
          </div>
        </form>

        <div className="absolute bottom-12 left-6 flex items-center gap-4 sm:left-12 lg:left-[150px]">
          <StatusPill tone={status.tone} label={status.label} />
          {onOpenFieldApp && <button type="button" onClick={onOpenFieldApp} className="text-[13px] font-medium underline-offset-4 hover:underline" style={{ color: MUTED }}>Field app</button>}
        </div>
      </main>
      <ShowcasePanel kicker={copy.kicker} title={copy.title} body={copy.body} card={copy.card} cardBody={copy.cardBody} notch={notch.label} notchColor={notch.color} />
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return <div className="flex items-start gap-2.5 rounded-xl border p-3 text-sm" style={{ backgroundColor: BG, borderColor: ERROR, color: ERROR }}><Lock size={16} className="mt-0.5 flex-none" />{message}</div>;
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
