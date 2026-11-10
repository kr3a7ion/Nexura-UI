import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Buildings, Check, CheckCircle, ClipboardText, Copy, DownloadSimple,
  Key, LockKey, MapPin, Printer, QrCode, ShieldCheck, WifiHigh, WifiSlash,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnO, BtnP, EmptyState, Inp } from "./UIKit";
import { ACCESSIBLE_BRANCHES, AUTHENTICATOR_SECRET, GUEST_QR_RESERVATION, MFA_BACKUP_CODES } from "./mock/authFlow";

function AuthShell({ children, title, subtitle, warm = false }: { children: React.ReactNode; title: string; subtitle: string; warm?: boolean }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: warm ? BG : NAV_BG, fontFamily: sans }}>
      <section className="w-full max-w-md rounded-2xl border bg-white p-6 sm:p-8 shadow-xl" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: warm ? TEAL : PRIMARY }}>
            {warm ? <Key size={20} weight="bold" /> : <ShieldCheck size={21} weight="bold" />}
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: TEXT, fontFamily: display }}>Nexura</div>
            <div className="text-xs" style={{ color: MUTED }}>{warm ? "Guest access" : "Secure staff access"}</div>
          </div>
        </div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: display }}>{title}</h1>
        <p className="text-sm mt-1 mb-6 leading-relaxed" style={{ color: MUTED }}>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 text-xs font-semibold mb-5" style={{ color: MUTED }}><ArrowLeft size={14} />Back</button>;
}

function DigitCode({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: boolean }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");
  const setDigit = (index: number, next: string) => {
    const clean = next.replace(/\D/g, "").slice(-1);
    const values = [...digits];
    values[index] = clean;
    onChange(values.join(""));
    if (clean && index < 5) refs.current[index + 1]?.focus();
  };
  return (
    <div className="grid grid-cols-6 gap-2" onPaste={event => {
      const clean = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (clean) { event.preventDefault(); onChange(clean); refs.current[Math.min(clean.length, 6) - 1]?.focus(); }
    }}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={element => { refs.current[index] = element; }}
          aria-label={`Verification digit ${index + 1}`}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={event => setDigit(index, event.target.value)}
          onKeyDown={event => {
            if (event.key === "Backspace" && !digit && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
          }}
          className="h-12 min-w-0 rounded-xl border text-center text-lg font-bold outline-none"
          style={{ borderColor: error ? ERROR : BORDER, color: TEXT, fontFamily: mono }}
        />
      ))}
    </div>
  );
}

export function MFAChallengeScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [trust, setTrust] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [attempts, setAttempts] = useState(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(previous => previous <= 1 ? 30 : previous - 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const verify = async () => {
    if (attempts <= 0) return;
    setLoading(true); setError("");
    await new Promise(resolve => window.setTimeout(resolve, 450));
    const valid = useBackup ? MFA_BACKUP_CODES.includes(backupCode.trim().toUpperCase()) : code === "123456";
    setLoading(false);
    if (valid) { onComplete(); return; }
    const remaining = attempts - 1;
    setAttempts(remaining);
    setError(remaining > 0 ? `That code is incorrect. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` : "Too many incorrect attempts. Return to sign in and try again.");
    setCode(""); setBackupCode("");
  };
  const progress = `${(seconds / 30) * 360}deg`;
  return (
    <AuthShell title="Verify it’s you" subtitle="Enter the current code from your authenticator app to continue.">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full p-1 flex-shrink-0" style={{ background: `conic-gradient(${TEAL} ${progress}, ${BORDER} 0deg)` }}>
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-bold" style={{ color: seconds <= 8 ? WARNING : TEXT, fontFamily: mono }}>{seconds}</div>
        </div>
        <div><div className="text-sm font-semibold" style={{ color: TEXT }}>Code refreshes every 30 seconds</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>Demo code: 123456</div></div>
      </div>
      {useBackup
        ? <Inp label="Backup code" value={backupCode} onChange={event => { setBackupCode(event.target.value.toUpperCase()); setError(""); }} placeholder="XXXX-XXXX" mono />
        : <DigitCode value={code} onChange={value => { setCode(value); setError(""); }} error={Boolean(error)} />}
      {error && <div className="mt-3 p-3 rounded-xl text-xs" style={{ backgroundColor: BG, color: ERROR, border: `1px solid ${ERROR}` }}>{error}</div>}
      <button onClick={() => { setUseBackup(previous => !previous); setError(""); }} className="mt-4 text-xs font-semibold" style={{ color: TEAL }}>{useBackup ? "Use authenticator code" : "Use a backup code"}</button>
      <label className="flex items-center gap-3 mt-5 cursor-pointer">
        <input type="checkbox" checked={trust} onChange={event => setTrust(event.target.checked)} className="w-4 h-4" style={{ accentColor: PRIMARY }} />
        <span className="text-sm" style={{ color: TEXT }}>Trust this device for 30 days</span>
      </label>
      <button onClick={verify} disabled={loading || attempts <= 0 || (useBackup ? backupCode.length < 8 : code.length < 6)} className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>{loading ? "Verifying…" : "Verify and continue"}</button>
    </AuthShell>
  );
}

export function MFAEnrolmentScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copySecret = async () => { await navigator.clipboard?.writeText(AUTHENTICATOR_SECRET); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  const verify = () => { if (code !== "123456") { setError("The verification code is incorrect. Try the current code from your app."); return; } setVerified(true); setError(""); };
  const download = () => {
    const blob = new Blob([`Nexura MFA backup codes\n\n${MFA_BACKUP_CODES.join("\n")}\n`], { type: "text/plain" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "nexura-backup-codes.txt"; link.click(); URL.revokeObjectURL(link.href);
  };
  return (
    <AuthShell title="Secure your Platform Owner account" subtitle="Add Nexura to your authenticator app, verify setup, then save your recovery codes.">
      <BackButton onClick={onBack} />
      <div className="p-4 rounded-xl border mb-5" style={{ borderColor: BORDER, backgroundColor: BG }}>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Authenticator secret</div>
        <div className="flex items-center gap-3 mt-2"><code className="flex-1 text-sm font-bold break-all" style={{ color: TEXT, fontFamily: mono }}>{AUTHENTICATOR_SECRET}</code><button onClick={copySecret} className="p-2 rounded-lg border bg-white" style={{ borderColor: BORDER, color: copied ? SUCCESS : MUTED }}>{copied ? <Check size={16} /> : <Copy size={16} />}</button></div>
      </div>
      <div className="flex gap-3 items-end mb-5"><div className="flex-1"><DigitCode value={code} onChange={value => { setCode(value); setError(""); setVerified(false); }} error={Boolean(error)} /></div><button onClick={verify} disabled={code.length < 6} className="h-12 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: verified ? SUCCESS : PRIMARY }}>{verified ? "Verified" : "Verify"}</button></div>
      {error && <p className="text-xs mb-4" style={{ color: ERROR }}>{error}</p>}
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: BG }}><div><div className="text-sm font-semibold" style={{ color: TEXT }}>Backup codes</div><div className="text-xs" style={{ color: MUTED }}>Each code works once.</div></div><div className="flex gap-2"><BtnO label="Download" icon={DownloadSimple} onClick={download} /><BtnO label="Print" icon={Printer} onClick={() => window.print()} /></div></div>
        <div className="grid grid-cols-2 gap-2 p-4">{MFA_BACKUP_CODES.map(item => <code key={item} className="text-xs p-2 rounded-lg text-center" style={{ backgroundColor: BG, color: TEXT, fontFamily: mono }}>{item}</code>)}</div>
      </div>
      <label className="flex items-start gap-3 mt-5 cursor-pointer"><input type="checkbox" checked={saved} onChange={event => setSaved(event.target.checked)} className="w-4 h-4 mt-0.5" style={{ accentColor: PRIMARY }} /><span className="text-sm" style={{ color: TEXT }}>I have saved these backup codes in a secure place.</span></label>
      <button onClick={onComplete} disabled={!verified || !saved} className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: PRIMARY }}>Continue</button>
    </AuthShell>
  );
}

export function BranchSelectionScreen({ onSelect, onBack }: { onSelect: (branchId: string) => void; onBack: () => void }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => { const timer = window.setTimeout(() => setStatus("ready"), 500); return () => window.clearTimeout(timer); }, []);
  return (
    <AuthShell title="Choose a branch" subtitle="Select the property you want to manage for this session.">
      <BackButton onClick={onBack} />
      {status === "loading" && <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>}
      {status === "error" && <EmptyState icon={WifiSlash} message="We couldn’t load your accessible branches." cta="Try again" onCta={() => setStatus("ready")} />}
      {status === "ready" && ACCESSIBLE_BRANCHES.length === 0 && <EmptyState icon={Buildings} message="No branches are assigned to this account. Contact your administrator." />}
      {status === "ready" && ACCESSIBLE_BRANCHES.length > 0 && <div className="space-y-3">
        {ACCESSIBLE_BRANCHES.map(branch => (
          <button key={branch.id} disabled={!branch.online} onClick={() => onSelect(branch.id)} className="w-full text-left p-4 rounded-xl border transition-all enabled:hover:shadow-md disabled:opacity-55" style={{ borderColor: branch.online ? BORDER : ERROR, backgroundColor: "white" }}>
            <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BG, color: branch.online ? PRIMARY : MUTED }}><Buildings size={20} /></div><div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><span className="text-sm font-bold" style={{ color: TEXT }}>{branch.name}</span><Badge label={branch.online ? "Online" : "Offline"} colors={branch.online ? { bg: BG, text: SUCCESS } : { bg: BG, text: ERROR }} /></div><div className="flex items-center gap-1 mt-1 text-xs" style={{ color: MUTED }}><MapPin size={12} />{branch.city} · {branch.role}</div><div className="flex items-center gap-1 mt-2 text-xs" style={{ color: branch.online ? SUCCESS : ERROR }}>{branch.online ? <WifiHigh size={12} /> : <WifiSlash size={12} />}{branch.online ? `Last sync ${branch.lastSync}` : branch.unavailableReason}</div></div></div>
          </button>
        ))}
      </div>}
    </AuthShell>
  );
}

export function GuestAccessScreen({ qrLanding = false, onBack }: { qrLanding?: boolean; onBack: () => void }) {
  const [code, setCode] = useState(qrLanding ? GUEST_QR_RESERVATION.code : "");
  const [surname, setSurname] = useState(qrLanding ? GUEST_QR_RESERVATION.surname : "");
  const [state, setState] = useState<"form" | "loading" | "success" | "error">(qrLanding ? "success" : "form");
  const findStay = async () => {
    if (!code.trim() || !surname.trim()) { setState("error"); return; }
    setState("loading"); await new Promise(resolve => window.setTimeout(resolve, 500));
    setState(code.trim().toUpperCase() === GUEST_QR_RESERVATION.code && surname.trim().toLowerCase() === GUEST_QR_RESERVATION.surname.toLowerCase() ? "success" : "error");
  };
  return (
    <AuthShell title={qrLanding ? "Welcome to Grand Palms" : "Access your stay"} subtitle="View your reservation and guest services securely." warm>
      <BackButton onClick={onBack} />
      {state === "loading" && <div className="py-12 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: TEAL, borderTopColor: "transparent" }} /><p className="text-sm mt-3" style={{ color: MUTED }}>Finding your stay…</p></div>}
      {state === "success" && <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, backgroundColor: "white" }}><div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: BG, color: SUCCESS }}>{qrLanding ? <QrCode size={24} /> : <CheckCircle size={24} weight="fill" />}</div><div className="text-lg font-bold" style={{ color: TEXT }}>{GUEST_QR_RESERVATION.guest}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{GUEST_QR_RESERVATION.property} · {GUEST_QR_RESERVATION.stay}</div><div className="mt-4"><Badge label="Reservation verified" colors={{ bg: BG, text: SUCCESS }} /></div></div>}
      {(state === "form" || state === "error") && <div className="space-y-4">
        {state === "error" && <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: BG, color: ERROR, border: `1px solid ${ERROR}` }}>We couldn’t match those details. Check the reservation code and surname, then try again.</div>}
        <Inp label="Reservation code" value={code} onChange={event => { setCode(event.target.value.toUpperCase()); setState("form"); }} placeholder="BK-2860" mono />
        <Inp label="Surname" value={surname} onChange={event => { setSurname(event.target.value); setState("form"); }} placeholder="Okafor" />
        <button onClick={findStay} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>Find my stay</button>
        <div className="flex items-center gap-2 justify-center text-xs" style={{ color: SUBTLE }}><LockKey size={13} />Your booking details are encrypted and private.</div>
      </div>}
    </AuthShell>
  );
}
