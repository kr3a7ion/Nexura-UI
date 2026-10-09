// Authentication screens: Login, Forgot Password, Force Change Password.
import { useState, useEffect } from "react";
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, Lock,
  WifiOff, ArrowLeft, Key, Shield, ChevronDown,
} from "lucide-react";

const PRIMARY = "#18181B";
const TEAL = "#0EA5E9";
const SUCCESS = "#059669";
const WARNING = "#D97706";
const ERROR = "#DC2626";
const BORDER = "#E4E4E7";
const TEXT = "#18181B";
const MUTED = "#71717A";
const SUBTLE = "#A1A1AA";
const mono = "'JetBrains Mono', monospace";
const sans = "'Inter', system-ui, sans-serif";

type LoginDestination = "hms" | "admin-console" | "org-portal";

const DEMO_ACCOUNTS: Record<string, { role: string; dest: LoginDestination; title: string; name: string }> = {
  "admin@platform.com":        { role: "PLT", dest: "admin-console", title: "Platform Owner",    name: "System Admin"     },
  "owner@grandpalms.ng":       { role: "ORG", dest: "org-portal",    title: "Org Super Admin",   name: "Grand Palms Owner"},
  "manager@grandpalms.ng":     { role: "MGT", dest: "hms",           title: "Hotel Manager",     name: "Adaeze Okonkwo"   },
  "frontdesk@grandpalms.ng":   { role: "FD",  dest: "hms",           title: "Front Desk",        name: "Chioma Nwosu"     },
  "housekeeper@grandpalms.ng": { role: "HK",  dest: "hms",           title: "Housekeeping",      name: "Fatima Musa"      },
  "maintenance@grandpalms.ng": { role: "MX",  dest: "hms",           title: "Maintenance",       name: "Emeka Obi"        },
  "finance@grandpalms.ng":     { role: "FIN", dest: "hms",           title: "Finance",           name: "Ngozi Eze"        },
  "restaurant@grandpalms.ng":  { role: "RT",  dest: "hms",           title: "Restaurant",        name: "Biodun Adeyemi"   },
  // Driver accounts — each driver logs in with their own credentials
  "uche.obi@grandpalms.ng":    { role: "DRV", dest: "hms",           title: "Driver",            name: "Uche Obi"         },
  "emeka.eze@grandpalms.ng":   { role: "DRV", dest: "hms",           title: "Driver",            name: "Emeka Eze"        },
  "musa.danladi@grandpalms.ng":{ role: "DRV", dest: "hms",           title: "Driver",            name: "Musa Danladi"     },
  "blessing.okafor@grandpalms.ng":{ role:"DRV",dest: "hms",          title: "Driver",            name: "Blessing Okafor"  },
};

const MAX = 5;

function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <span style={{ fontFamily: mono, color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
      {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())} &nbsp;·&nbsp; {t.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
    </span>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
export function LoginScreen({ onLogin }: { onLogin: (role: string, dest: LoginDestination, staffName: string) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [serverUrl, setServerUrl]     = useState("http://hms.local");
  const [showServer, setShowServer]   = useState(false);
  const [showForgot, setShowForgot]   = useState(false);
  const [showDemo, setShowDemo]       = useState(false);

  const isLocked = !!(lockedUntil && new Date() < lockedUntil);
  if (showForgot) return <ForgotPasswordScreen onBack={() => setShowForgot(false)} />;

  const handleLogin = async () => {
    if (isLocked) return;
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 800));
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    const wrongPw = password.length < 3;
    if (!account || wrongPw) {
      const n = attempts + 1; setAttempts(n); setLoading(false);
      if (n >= MAX) {
        const until = new Date(Date.now() + 15 * 60 * 1000);
        setLockedUntil(until);
        setError(`Too many failed attempts. Account locked until ${until.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}.`);
      } else if (n === MAX - 1) {
        setError(`Incorrect credentials. 1 attempt remaining before lockout.`);
      } else {
        setError(`Incorrect email or password.${n > 1 ? ` (${n}/${MAX} attempts)` : ""}`);
      }
      return;
    }
    setLoading(false);
    onLogin(account.role, account.dest, account.name);
  };

  const handleOffline = () => onLogin("MGT", "hms", "Adaeze Okonkwo");

  return (
    <div className="flex min-h-screen overflow-hidden relative" style={{ fontFamily: sans }}>

      {/* ── Full-bleed background image ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1758448656987-cfae6bf225e4?w=1800&h=1200&fit=crop&auto=format"
          alt="Grand Palms Hotel"
          className="w-full h-full object-cover"
          style={{ backgroundColor: "#0f0f0f" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(8,8,8,0.93) 0%, rgba(8,8,8,0.82) 42%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,0.35) 100%)" }} />
      </div>

      {/* ── Left: Atmospheric branding ──────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[54%] relative z-10 p-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold text-white leading-none" style={{ fontSize: "2.75rem", letterSpacing: "-0.04em" }}>Nexura</div>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <div className="text-[3.4rem] font-bold text-white leading-[1.08] tracking-tight mb-5">
            Manage every<br />guest moment<br />
            <span style={{ color: TEAL }}>seamlessly.</span>
          </div>
          <p className="text-base text-white/60 leading-relaxed max-w-[420px] mb-8">
            Your hotel's complete operations platform — reservations, check-ins, housekeeping, billing — all running offline-first from your hotel LAN.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["Offline First", "Role-Based Access", "Real-Time Sync", "Multi-Branch"].map(f => (
              <div key={f} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)" }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="space-y-1.5">
          <LiveClock />
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: mono }}>
            Serving from · {serverUrl} · HMS Platform v2.4.1
          </div>
        </div>
      </div>

      {/* ── Right: Login card ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center mb-7 justify-center">
            <span className="font-bold text-white" style={{ fontSize: "2rem", letterSpacing: "-0.04em" }}>Nexura</span>
          </div>

          {/* Main card */}
          <div className="rounded-2xl p-8 mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)" }}>

            <h1 className="text-xl font-bold mb-0.5" style={{ color: TEXT }}>Sign in to your account</h1>
            <p className="text-sm mb-6" style={{ color: MUTED }}>Sign in to continue to Nexura</p>

            {/* Lockout */}
            {isLocked && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                <Lock size={14} style={{ color: ERROR, marginTop: 1, flexShrink: 0 }} />
                <div className="text-sm" style={{ color: ERROR }}>{error}</div>
              </div>
            )}

            {/* Error */}
            {error && !isLocked && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                <AlertCircle size={14} style={{ color: ERROR, marginTop: 1, flexShrink: 0 }} />
                <div className="text-sm" style={{ color: ERROR }}>{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUTED }}>Email Address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="your-email@grandpalms.ng" disabled={isLocked}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                  style={{ borderColor: BORDER, color: TEXT, backgroundColor: "#FAFAFA" }}
                  onFocus={e => { e.target.style.borderColor = "#18181B"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.backgroundColor = "#FAFAFA"; }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUTED }}>Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••" disabled={isLocked}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none pr-12 disabled:opacity-50"
                    style={{ borderColor: BORDER, color: TEXT, backgroundColor: "#FAFAFA" }}
                    onFocus={e => { e.target.style.borderColor = "#18181B"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.backgroundColor = "#FAFAFA"; }} />
                  <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => setRemember(p => !p)}
                  className="w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ width: 18, height: 18, borderColor: remember ? PRIMARY : "#CBD5E1", backgroundColor: remember ? PRIMARY : "transparent" }}>
                  {remember && <CheckCircle2 size={10} color="white" />}
                </div>
                <span className="text-sm" style={{ color: TEXT }}>Remember this device for 30 days</span>
              </label>

              <button onClick={handleLogin} disabled={loading || isLocked}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 active:scale-[0.99]"
                style={{ backgroundColor: PRIMARY, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                  : "Sign In"}
              </button>

              <button onClick={handleOffline}
                className="w-full py-3 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-colors hover:bg-[#F9FAFB]"
                style={{ borderColor: BORDER, color: MUTED }}>
                <WifiOff size={14} />Continue Offline
              </button>
            </div>

            <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
              <button onClick={() => setShowForgot(true)} className="text-xs font-medium hover:underline" style={{ color: TEAL }}>
                Forgot Password?
              </button>
              <button onClick={() => setShowServer(p => !p)} className="text-xs" style={{ color: SUBTLE }}>
                {showServer ? "Hide server" : "Change Server (IT only)"}
              </button>
            </div>

            {showServer && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>Local Server URL</label>
                <div className="flex gap-2">
                  <input value={serverUrl} onChange={e => setServerUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, fontFamily: mono }} />
                  <button onClick={() => setShowServer(false)} className="px-3 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: PRIMARY }}>Save</button>
                </div>
                <div className="text-xs mt-1.5" style={{ color: SUBTLE }}>Default: http://hms.local or LAN IP e.g. http://192.168.1.10</div>
              </div>
            )}
          </div>

          {/* Demo credentials */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setShowDemo(p => !p)}
              className="w-full flex items-center justify-between px-5 py-3 text-left"
              style={{ color: "rgba(255,255,255,0.7)" }}>
              <span className="text-xs font-semibold uppercase tracking-wider">Demo Accounts — click to auto-fill</span>
              <ChevronDown size={14} style={{ transform: showDemo ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms", color: "rgba(255,255,255,0.4)" }} />
            </button>
            {showDemo && (
              <div className="border-t px-3 pb-3 space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {Object.entries(DEMO_ACCOUNTS).map(([email, acc]) => (
                  <button key={email} onClick={() => { setEmail(email); setPassword("demo123"); setError(""); setAttempts(0); setLockedUntil(null); setShowDemo(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: acc.dest === "admin-console" ? ERROR : acc.dest === "org-portal" ? "#7C3AED" : TEAL }}>
                      {acc.role.slice(0, 2)}
                    </div>
                    <span className="text-xs flex-1 truncate" style={{ fontFamily: mono }}>{email}</span>
                    <span className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{acc.title}</span>
                  </button>
                ))}
                <div className="px-3 pt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Any password ≥ 3 chars · {MAX} failures triggers 15-min lockout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Forgot Password Screen ────────────────────────────────────────────────────
export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false); setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: sans }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1758448656987-cfae6bf225e4?w=1800&h=1200&fit=crop&auto=format" alt="" className="w-full h-full object-cover" style={{ backgroundColor: "#0f0f0f" }} />
        <div className="absolute inset-0" style={{ background: "rgba(8,8,8,0.82)" }} />
      </div>
      <div className="w-full max-w-md relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-5 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
          <ArrowLeft size={15} />Back to sign in
        </button>
        <div className="rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>
          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "#EFF6FF" }}>
                <Key size={22} style={{ color: PRIMARY }} />
              </div>
              <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>Reset your password</h1>
              <p className="text-sm mb-5" style={{ color: MUTED }}>Enter your email. We'll send a reset link (1-hour expiry, LAN-only access).</p>
              <div className="p-4 rounded-xl mb-5 text-sm" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <div className="font-semibold mb-1" style={{ color: "#92400E" }}>Offline? No email access?</div>
                <div style={{ color: "#92400E" }}>Ask your Branch Manager or IT to issue a temporary password: HR → Staff Directory → Your Name → Reset Password</div>
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="your-email@grandpalms.ng"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4"
                style={{ borderColor: BORDER, color: TEXT, backgroundColor: "#FAFAFA" }}
                onFocus={e => { e.target.style.borderColor = "#18181B"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.backgroundColor = "#FAFAFA"; }} />
              <button onClick={handleSubmit} disabled={loading || !email}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: PRIMARY }}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</> : "Send Reset Link"}
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "#DCFCE7" }}>
                <CheckCircle2 size={22} style={{ color: SUCCESS }} />
              </div>
              <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>Check your email</h1>
              <p className="text-sm mb-5" style={{ color: MUTED }}>If <strong>{email}</strong> has an account, a reset link was sent. Open it on a LAN-connected device within 1 hour.</p>
              <button onClick={onBack} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>Back to Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Force Change Password ─────────────────────────────────────────────────────
export function ForceChangePasswordScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState("");
  const [pw1, setPw1]         = useState("");
  const [pw2, setPw2]         = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const reqs = [
    { label: "At least 8 characters", ok: pw1.length >= 8 },
    { label: "One uppercase letter",  ok: /[A-Z]/.test(pw1) },
    { label: "One lowercase letter",  ok: /[a-z]/.test(pw1) },
    { label: "One number",            ok: /[0-9]/.test(pw1) },
    { label: "Passwords match",       ok: pw1 === pw2 && pw1.length > 0 },
  ];
  const allOk = reqs.every(r => r.ok);

  const handleSubmit = async () => {
    if (!current) { setError("Enter your temporary password."); return; }
    if (!allOk) { setError("Please meet all password requirements."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: sans }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1758448656987-cfae6bf225e4?w=1800&h=1200&fit=crop&auto=format" alt="" className="w-full h-full object-cover" style={{ backgroundColor: "#0f0f0f" }} />
        <div className="absolute inset-0" style={{ background: "rgba(8,8,8,0.82)" }} />
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "#FEF3C7" }}>
            <Shield size={22} style={{ color: WARNING }} />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>Set your password</h1>
          <p className="text-sm mb-6" style={{ color: MUTED }}>Your account was set up with a temporary password. Choose a personal password to continue.</p>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm" style={{ backgroundColor: "#FEF2F2", color: ERROR }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div className="space-y-3 mb-5">
            {[
              { label: "Temporary password",    val: current, set: setCurrent, placeholder: "The password your manager gave you" },
              { label: "New password",           val: pw1,     set: setPw1,     placeholder: "Min 8 chars, uppercase + number" },
              { label: "Confirm new password",   val: pw2,     set: setPw2,     placeholder: "Type new password again" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: MUTED }}>{f.label}</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={f.val}
                    onChange={e => { f.set(e.target.value); setError(""); }}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: BORDER, color: TEXT, paddingRight: f.label === "New password" ? 48 : 16, backgroundColor: "#FAFAFA" }}
                    onFocus={e => { e.target.style.borderColor = "#18181B"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.backgroundColor = "#FAFAFA"; }} />
                  {f.label === "New password" && (
                    <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl mb-5 space-y-1.5" style={{ backgroundColor: "#F9FAFB" }}>
            {reqs.map(r => (
              <div key={r.label} className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: r.ok ? "#DCFCE7" : "#F1F5F9" }}>
                  {r.ok
                    ? <CheckCircle2 size={10} style={{ color: SUCCESS }} />
                    : <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SUBTLE }} />}
                </div>
                <span style={{ color: r.ok ? SUCCESS : MUTED }}>{r.label}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={loading || !allOk}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: PRIMARY }}>
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting password…</> : "Set Password & Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
