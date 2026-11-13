import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Buildings, ChartBar, CreditCard, CurrencyDollar, ArrowsClockwise, Users } from "@phosphor-icons/react";
import { PRIMARY, TEAL, WARNING, ERROR, SUCCESS, BORDER, TEXT, MUTED, SUBTLE, BG, sans, display } from "./constants";
import { BRAND, BrandMark } from "./brand/Brand";
import { DEPARTMENTS } from "./suite/departments";
import { LOGIN_ACCOUNTS, type LoginAccount, type LoginKind } from "./mock/staffLogin";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const REMEMBER_KEY = "nexura.username";
const HOTEL_NAME = "Grand Palms Hotel, Abuja";

// One short line per department for the sign-in panel. No hotel or user data is shown before sign-in.
const DEPARTMENT_LINES: Record<string, string> = {
  "front-office": "Bookings, check-in, check-out",
  "access-security": "Key cards and door locks",
  housekeeping: "Room cleaning and inspection",
  maintenance: "Repairs and work orders",
  "restaurant-pos": "Orders, tables, kitchen",
  finance: "Bills, night audit, tax",
  inventory: "Stock and purchasing",
  hr: "Shifts, attendance, payroll",
  communications: "Chat, handover, complaints",
  fleet: "Vehicles, drivers, trips",
  reports: "Occupancy and revenue",
  "it-system": "Users, backups, devices",
};

const OWNER_TILES = [
  { name: "All your hotels", line: "Every branch in one view.", color: TEAL, icon: Buildings },
  { name: "Revenue and occupancy", line: "Today's figures and how they compare.", color: "#047857", icon: CurrencyDollar },
  { name: "Reports", line: "Daily, monthly and yearly exports.", color: "#6D28D9", icon: ChartBar },
  { name: "Sync status", line: "Which hotel servers are up to date.", color: WARNING, icon: ArrowsClockwise },
  { name: "People and roles", line: "Who can sign in and open what.", color: "#BE185D", icon: Users },
  { name: "Plan and billing", line: "Subscription, invoices and licences.", color: "#334155", icon: CreditCard },
];

const PANEL = {
  staff: { title: BRAND.tagline, body: "Front desk, housekeeping, restaurant, finance and more. Everything your shift needs is one sign-in away." },
  cloud: { title: "Every hotel you own, on one screen.", body: "See today's revenue, occupancy and anything that needs your attention, across all your branches." },
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
const writeRemembered = (value: string) => { try { localStorage.setItem(REMEMBER_KEY, value); } catch { /* ignore */ } };

function ShowcasePanel({ kind }: { kind: LoginKind }) {
  const copy = PANEL[kind];
  const tiles = kind === "staff"
    ? DEPARTMENTS.filter(d => DEPARTMENT_LINES[d.id]).map(d => ({ name: d.name, line: DEPARTMENT_LINES[d.id], color: d.accent, icon: d.icon }))
    : OWNER_TILES;
  return (
    <aside className="m-6 ml-0 hidden w-[760px] max-w-[52vw] shrink-0 overflow-hidden rounded-[32px] p-14 lg:block" style={{ background: `linear-gradient(160deg, #CCFBF1 0%, ${BG} 100%)` }}>
      <h2 className="max-w-[600px] text-[44px] font-extrabold leading-[1.14] tracking-[-0.03em]" style={{ color: TEXT, fontFamily: display }}>{copy.title}</h2>
      <p className="mt-3 max-w-[600px] text-[17px] leading-relaxed" style={{ color: MUTED }}>{copy.body}</p>
      <ul className={`mt-10 grid gap-3 ${kind === "staff" ? "grid-cols-3" : "grid-cols-2"}`}>
        {tiles.map(tile => {
          const Icon = tile.icon;
          return (
            <li key={tile.name} className={`rounded-2xl border bg-white ${kind === "staff" ? "p-3.5" : "p-6"}`} style={{ borderColor: BORDER }}>
              <span className={`flex items-center justify-center text-white ${kind === "staff" ? "h-7 w-7 rounded-lg" : "h-9 w-9 rounded-[10px]"}`} style={{ backgroundColor: tile.color }}><Icon size={kind === "staff" ? 15 : 19} weight="bold" /></span>
              <div className={`font-semibold ${kind === "staff" ? "mt-2 text-sm" : "mt-3 text-base"}`} style={{ color: TEXT }}>{tile.name}</div>
              <div className={kind === "staff" ? "mt-1 text-xs" : "mt-1.5 text-sm"} style={{ color: MUTED }}>{tile.line}</div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function AuthLayout({ kind, title, sub, children, extra }: { kind: LoginKind; title: string; sub: string; children: ReactNode; extra?: ReactNode }) {
  const online = useOnline();
  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: sans }}>
      <main className="relative flex flex-1 items-center px-6 pb-28 pt-14 sm:px-12 lg:px-[140px]">
        <div className="w-full max-w-[360px]">
          <div className="flex items-center gap-3">
            <BrandMark size={40} />
            <span className="text-2xl font-extrabold tracking-[-0.04em]" style={{ color: TEXT, fontFamily: display }}>{BRAND.name}</span>
          </div>
          <h1 className="mt-7 text-[32px] font-extrabold leading-tight tracking-[-0.03em]" style={{ color: TEXT, fontFamily: display }}>{title}</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: MUTED }}>{sub}</p>
          <div className="mt-7">{children}</div>
        </div>
        <div className="absolute bottom-12 left-6 flex items-center gap-4 sm:left-12 lg:left-[140px]">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium" style={online ? { backgroundColor: BG, color: MUTED } : { backgroundColor: "#FEF3C7", color: "#92400E" }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: online ? TEAL : WARNING }} />
            {online ? "Online" : "Working offline. Changes will sync later."}
          </span>
          {extra}
        </div>
      </main>
      <ShowcasePanel kind={kind} />
    </div>
  );
}

function PasswordField({ id, label, value, onChange, invalid, autoFocus, autoComplete = "current-password" }: { id: string; label: string; value: string; onChange: (value: string) => void; invalid?: boolean; autoFocus?: boolean; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium" style={{ color: TEXT }}>{label}</label>
      <div className={`flex h-12 items-center gap-2 rounded-[10px] border bg-white px-3.5 focus-within:ring-1 ${invalid ? "border-[#D32F2F] focus-within:ring-[#D32F2F]" : "border-[#E2E8F0] focus-within:border-[#1BA39C] focus-within:ring-[#1BA39C]"}`}>
        <input id={id} type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete} autoFocus={autoFocus} aria-invalid={invalid} className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" style={{ color: TEXT }} />
        <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? "Hide password" : "Show password"} className="text-[13px] font-medium" style={{ color: "#0F766E" }}>{show ? "Hide" : "Show"}</button>
      </div>
    </div>
  );
}

function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return <button type="submit" disabled={disabled} className="h-[50px] w-full rounded-[10px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BA39C] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] disabled:hover:opacity-100" style={disabled ? undefined : { backgroundColor: PRIMARY }}>{children}</button>;
}

const Note = ({ children }: { children: ReactNode }) => <p className="text-[13px]" style={{ color: MUTED }}>{children}</p>;
const ErrorText = ({ children }: { children: ReactNode }) => <p role="alert" className="text-sm font-medium leading-relaxed" style={{ color: ERROR }}>{children}</p>;
const clock = (ms: number) => new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

type Attempts = Record<string, { fails: number; until: number }>;

export function LoginScreen({ kind, onLogin, onOpenFieldApp }: { kind: LoginKind; onLogin: (account: LoginAccount) => void; onOpenFieldApp?: () => void }) {
  const [username, setUsername] = useState(readRemembered);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState<Attempts>({});
  const key = username.trim().toLowerCase();
  const lockedUntil = attempts[key]?.until ?? 0;
  const locked = lockedUntil > Date.now();
  const helper = kind === "staff" ? "ask your manager to reset your password" : "contact Nexura support";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (busy || locked) return;
    if (!key || !password) { setError("Enter your username and password."); return; }
    const account = LOGIN_ACCOUNTS.find(a => a.kind === kind && a.username === key && a.password === password);
    if (!account) {
      const fails = (attempts[key]?.fails ?? 0) + 1;
      const left = MAX_ATTEMPTS - fails;
      setAttempts({ ...attempts, [key]: left <= 0 ? { fails: 0, until: Date.now() + LOCK_MS } : { fails, until: 0 } });
      setError(left <= 0 ? "" : `Wrong username or password. ${left} ${left === 1 ? "try" : "tries"} left.`);
      setPassword("");
      return;
    }
    writeRemembered(key);
    setBusy(true);
    // Brief pause so the "Signing in…" state is visible; the real server call replaces this.
    window.setTimeout(() => onLogin(account), 500);
  };

  return (
    <AuthLayout kind={kind} title="Welcome back" sub={kind === "staff" ? HOTEL_NAME : "For hotel owners and Nexura platform admins"}
      extra={onOpenFieldApp && <button type="button" onClick={onOpenFieldApp} className="text-[13px] font-medium underline-offset-4 hover:underline" style={{ color: MUTED }}>Field app</button>}>
      <form onSubmit={submit} noValidate className="space-y-[18px]">
        <div>
          <label htmlFor="login-username" className="mb-2 block text-[13px] font-medium" style={{ color: TEXT }}>Username</label>
          <input id="login-username" value={username} onChange={e => { setUsername(e.target.value); setError(""); }} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus className="h-12 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-[15px] outline-none focus:border-[#1BA39C] focus:ring-1 focus:ring-[#1BA39C]" style={{ color: TEXT }} />
        </div>
        <PasswordField id="login-password" label="Password" value={password} onChange={v => { setPassword(v); setError(""); }} invalid={!!error && !!key} />
        {locked
          ? <ErrorText>Too many wrong tries. This username is locked for 15 minutes. Try again at {clock(lockedUntil)}, or {helper}.</ErrorText>
          : error && <ErrorText>{error}</ErrorText>}
        <SubmitButton disabled={locked || busy}>{busy ? "Signing in…" : "Sign in"}</SubmitButton>
        <Note>Forgot your password? {kind === "staff" ? "Ask your manager." : "Contact Nexura support."}</Note>
      </form>
    </AuthLayout>
  );
}

export function ForceChangePasswordScreen({ kind = "staff", temporaryPassword, onComplete }: { kind?: LoginKind; temporaryPassword: string; onComplete: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const requirements = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Has a number", ok: /\d/.test(password) },
    { label: "Different from the temporary password", ok: password.length > 0 && password !== temporaryPassword },
    { label: "Both passwords match", ok: password.length > 0 && password === confirm },
  ];
  const ready = requirements.every(item => item.ok);
  return (
    <AuthLayout kind={kind} title="Choose your own password" sub="Your manager gave you a temporary password. Replace it with one only you know.">
      <form onSubmit={e => { e.preventDefault(); if (ready) onComplete(); }} noValidate className="space-y-[18px]">
        <PasswordField id="new-password" label="New password" value={password} onChange={setPassword} autoFocus autoComplete="new-password" />
        <PasswordField id="confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <ul className="space-y-2">
          {requirements.map(item => (
            <li key={item.label} className="flex items-center gap-2 text-[13px]" style={{ color: item.ok ? TEXT : MUTED }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.ok ? SUCCESS : SUBTLE }} />
              {item.label}<span className="sr-only">{item.ok ? " (done)" : " (not yet)"}</span>
            </li>
          ))}
        </ul>
        <SubmitButton disabled={!ready}>Save password and continue</SubmitButton>
        <Note>You will use this password from now on.</Note>
      </form>
    </AuthLayout>
  );
}

// Covers the app after 15 minutes without activity. The app stays mounted underneath, so work in progress is kept.
export function LockScreen({ account, onUnlock, onSignOut }: { account: LoginAccount; onUnlock: () => void; onSignOut: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (password === account.password) onUnlock();
    else { setError("Wrong password. Try again, or sign out."); setPassword(""); }
  };
  return (
    <div className="fixed inset-0 z-[100] overflow-auto bg-white">
      <AuthLayout kind={account.kind} title="Screen locked" sub={`${account.name}, ${account.roleName}. Enter your password to carry on where you stopped.`}>
        <form onSubmit={submit} noValidate className="space-y-[18px]">
          <PasswordField id="unlock-password" label="Password" value={password} onChange={v => { setPassword(v); setError(""); }} invalid={!!error} autoFocus />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton>Unlock</SubmitButton>
          <Note>Not you? <button type="button" onClick={onSignOut} className="font-medium underline underline-offset-4" style={{ color: "#0F766E" }}>Sign out</button> to let someone else in.</Note>
        </form>
      </AuthLayout>
    </div>
  );
}

const HOTELS = [["All hotels", "Portfolio overview"], ["Grand Palms Hotel", "Abuja"], ["Grand Palms Ikoyi", "Lagos"], ["Grand Palms GRA", "Port Harcourt"]];

export function ChooseHotelScreen({ account, onContinue, onSignOut }: { account: LoginAccount; onContinue: (hotel: string) => void; onSignOut: () => void }) {
  const [hotel, setHotel] = useState(HOTELS[0][0]);
  return (
    <AuthLayout kind="cloud" title="Choose a hotel" sub="You own more than one. Figures for other hotels are as of their last sync.">
      <form onSubmit={e => { e.preventDefault(); onContinue(hotel); }} className="space-y-[18px]">
        <fieldset className="space-y-2.5">
          <legend className="sr-only">Hotel</legend>
          {HOTELS.map(([name, place]) => (
            <label key={name} className="flex cursor-pointer flex-col rounded-[10px] border bg-white px-4 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1BA39C]" style={hotel === name ? { borderColor: TEAL, boxShadow: `0 0 0 1px ${TEAL}` } : { borderColor: BORDER }}>
              <input type="radio" name="hotel" value={name} checked={hotel === name} onChange={() => setHotel(name)} className="sr-only" />
              <span className="text-[15px] font-semibold" style={{ color: TEXT }}>{name}</span>
              <span className="text-[13px]" style={{ color: MUTED }}>{place}</span>
            </label>
          ))}
        </fieldset>
        <SubmitButton>Continue</SubmitButton>
        <Note>Signed in as {account.username}. Not you? <button type="button" onClick={onSignOut} className="font-medium underline underline-offset-4" style={{ color: "#0F766E" }}>Sign out</button>.</Note>
      </form>
    </AuthLayout>
  );
}
