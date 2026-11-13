import { useEffect, useMemo, useState } from "react";
import {
  ArrowCounterClockwise, ArrowRight, Check, CheckCircle, ClipboardText, Copy, Database,
  HardDrive, Key, LockKey, MagnifyingGlass, Pulse, RocketLaunch, ShieldCheck, Terminal,
  UserPlus, Warning, WifiHigh, Wrench, X,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnO, BtnP, EmptyState, Inp, Sel, StatCard } from "./UIKit";
import {
  FLEET_PROPERTIES, PLATFORM_ORGANISATIONS, PROVISIONING_CHECKLIST, RELEASE_HEALTH_CHECKS,
  SUPPORT_DIAGNOSTICS, SUPPORT_ERRORS, SUPPORT_SESSIONS,
} from "./mock/portalExtensions";

type LoadState = "loading" | "ready" | "error";

function AuditNotice({ text, onClose }: { text: string; onClose: () => void }) {
  return <div className="mb-4 flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: TEAL, backgroundColor: BG, color: TEXT }}><ShieldCheck size={18} style={{ color: TEAL }} /><div className="flex-1 text-sm"><strong>Audited action recorded.</strong> {text}</div><button aria-label="Close" onClick={onClose}><X size={16} style={{ color: MUTED }} /></button></div>;
}

function LoadingRows() {
  return <div className="p-4 space-y-3">{[1, 2, 3, 4].map(item => <div key={item} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>;
}

export function BranchProvisioning() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ organisation: PLATFORM_ORGANISATIONS[0], name: "", location: "Lagos", address: "", adminName: "", adminEmail: "" });
  const [syncKey, setSyncKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const steps = ["Branch", "Sync Key", "Admin", "Deploy", "Verify"];
  const generateKey = () => setSyncKey(`nx_live_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`);
  const copyKey = async () => { await navigator.clipboard?.writeText(syncKey); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  const next = () => {
    if (step === 1 && (!form.name.trim() || !form.address.trim())) { setNotice("Branch name and full location are required."); return; }
    if (step === 2 && !syncKey) { setNotice("Generate the encrypted sync key before continuing."); return; }
    if (step === 3 && (!form.adminName.trim() || !form.adminEmail.trim())) { setNotice("Initial administrator details are required."); return; }
    if (step === 5) { setNotice("Provisioning request submitted. This audited action is queued for Platform Operations."); return; }
    setNotice(""); setStep(value => Math.min(5, value + 1));
  };
  return (
    <div style={{ fontFamily: sans }}>
      <div className="mb-5"><h2 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Branch Provisioning</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Create a signed branch deployment with an initial administrator.</p></div>
      {notice && <div className="mb-4 p-3 rounded-xl border text-sm" style={{ borderColor: notice.includes("submitted") ? SUCCESS : ERROR, color: notice.includes("submitted") ? SUCCESS : ERROR, backgroundColor: BG }}>{notice}</div>}
      <div className="grid grid-cols-5 gap-2 mb-5">{steps.map((label, index) => <button key={label} onClick={() => index + 1 < step && setStep(index + 1)} className="min-h-14 rounded-xl border px-2 text-xs font-semibold" style={{ borderColor: step === index + 1 ? PRIMARY : index + 1 < step ? SUCCESS : BORDER, color: step === index + 1 ? PRIMARY : MUTED }}>{index + 1 < step ? "✓ " : `${index + 1}. `}{label}</button>)}</div>
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        {step === 1 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Sel label="Organisation" value={form.organisation} onChange={event => setForm(current => ({ ...current, organisation: event.target.value }))} options={PLATFORM_ORGANISATIONS} /><Inp label="Branch name" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="e.g. Grand Palms Ikeja" /><Sel label="City" value={form.location} onChange={event => setForm(current => ({ ...current, location: event.target.value }))} options={["Lagos", "Abuja"]} /><Inp label="Full address" value={form.address} onChange={event => setForm(current => ({ ...current, address: event.target.value }))} placeholder="Street, district and state" /></div>}
        {step === 2 && <div><div className="text-sm font-semibold" style={{ color: TEXT }}>Encrypted branch sync key</div><p className="text-sm mt-1 mb-4" style={{ color: MUTED }}>This secret is shown once. Store it in the branch deployment environment.</p>{syncKey ? <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ borderColor: BORDER, backgroundColor: BG }}><code className="flex-1 break-all text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{syncKey}</code><button onClick={copyKey} className="w-10 h-10 rounded-lg border flex items-center justify-center" style={{ borderColor: BORDER, color: copied ? SUCCESS : MUTED }}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div> : <BtnP label="Generate Sync Key" icon={Key} onClick={generateKey} />}</div>}
        {step === 3 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Inp label="Initial admin name" value={form.adminName} onChange={event => setForm(current => ({ ...current, adminName: event.target.value }))} placeholder="e.g. Kemi Adeyemi" /><Inp label="Initial admin email" value={form.adminEmail} onChange={event => setForm(current => ({ ...current, adminEmail: event.target.value }))} placeholder="admin@property.ng" /><div className="md:col-span-2 p-3 rounded-xl border text-sm flex items-start gap-2" style={{ borderColor: TEAL, color: TEXT }}><LockKey size={18} style={{ color: TEAL }} />The administrator must enrol MFA and will be restricted by the organisation IP allowlist.</div></div>}
        {step === 4 && <div><div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Deployment instructions</div><ol className="space-y-3 text-sm" style={{ color: TEXT }}><li>1. Download the signed Nexura branch image from the release registry.</li><li>2. Set <code style={{ fontFamily: mono }}>NEXURA_BRANCH_SYNC_KEY</code> using the generated secret.</li><li>3. Start the branch service behind the hotel LAN firewall.</li><li>4. Allow outbound TLS to the Nexura sync endpoint; no inbound public port is required.</li><li>5. Sign in with the initial administrator and verify the first heartbeat.</li></ol></div>}
        {step === 5 && <div className="space-y-2">{PROVISIONING_CHECKLIST.map(item => { const checked = checks.includes(item); return <button key={item} onClick={() => setChecks(current => checked ? current.filter(value => value !== item) : [...current, item])} className="w-full min-h-12 px-3 rounded-xl border flex items-center gap-3 text-left text-sm" style={{ borderColor: checked ? SUCCESS : BORDER, color: TEXT }}><span className="w-6 h-6 rounded-md border flex items-center justify-center" style={{ borderColor: checked ? SUCCESS : BORDER, backgroundColor: checked ? SUCCESS : "white" }}>{checked && <Check size={15} color="white" />}</span>{item}</button>; })}</div>}
        <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: BORDER }}><BtnO label="Back" onClick={() => setStep(value => Math.max(1, value - 1))} /><BtnP label={step === 5 ? "Submit Provisioning" : "Continue"} icon={ArrowRight} onClick={next} /></div>
      </div>
    </div>
  );
}

export function FleetRelease() {
  const [state, setState] = useState<LoadState>("loading");
  const [ring, setRing] = useState<"Canary" | "10%" | "All">("Canary");
  const [progress, setProgress] = useState(18);
  const [notice, setNotice] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 450); return () => window.clearTimeout(timer); }, []);
  const audited = (message: string) => setNotice(message);
  const advance = () => { const next = ring === "Canary" ? "10%" : "All"; setRing(next); setProgress(ring === "Canary" ? 42 : 100); audited(`Release advanced to ${next}.`); };
  return (
    <div style={{ fontFamily: sans }}>
      <div className="flex items-start justify-between gap-4 mb-5"><div><h2 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Fleet & Release</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Signed application releases and property infrastructure health.</p></div><div className="flex gap-2"><BtnO label="Rollback" icon={ArrowCounterClockwise} onClick={() => audited("Rollback to v2.6.0 queued for the current release ring.")} /><BtnP label="Advance Ring" icon={RocketLaunch} onClick={advance} /></div></div>
      {notice && <AuditNotice text={notice} onClose={() => setNotice("")} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Current Release" value="v2.6.1" sub="Signed · published 4 Aug" icon={RocketLaunch} accent={PRIMARY} />
        <div className="bg-white rounded-xl border p-5 lg:col-span-2" style={{ borderColor: BORDER }}><div className="flex items-center justify-between"><div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Rollout ring</div><div className="text-xl font-bold mt-1" style={{ color: TEXT }}>{ring} · {progress}% deployed</div></div><Badge label={progress === 100 ? "Complete" : "In progress"} colors={{ bg: BG, text: progress === 100 ? SUCCESS : WARNING }} /></div><div className="h-2 rounded-full mt-4 overflow-hidden" style={{ backgroundColor: BG }}><div className="h-full" style={{ width: `${progress}%`, backgroundColor: TEAL }} /></div><div className="grid grid-cols-3 gap-2 mt-4">{["Canary", "10%", "All"].map(item => <div key={item} className="text-center text-xs font-semibold py-2 border-t-2" style={{ borderColor: item === ring ? PRIMARY : BORDER, color: item === ring ? PRIMARY : MUTED }}>{item}</div>)}</div></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden mb-5" style={{ borderColor: BORDER }}>
        {state === "loading" && <LoadingRows />}
        {state === "error" && <EmptyState icon={HardDrive} message="Property fleet data could not be loaded." cta="Try again" onCta={() => setState("ready")} />}
        {state === "ready" && FLEET_PROPERTIES.length === 0 && <EmptyState icon={HardDrive} message="No properties are enrolled in release management." />}
        {state === "ready" && FLEET_PROPERTIES.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[1260px]"><thead><tr style={{ backgroundColor: BG }}>{["Property", "App", "Schema", "Image Digest", "Signature", "Heartbeat", "Disk Free", "Last Backup", "Ring", "Health", "Actions"].map(label => <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead><tbody>{FLEET_PROPERTIES.map(property => <tr key={property.id} className="border-t" style={{ borderColor: BORDER }}><td className="px-4 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{property.property}</div><div className="text-xs" style={{ color: MUTED }}>{property.location}</div></td>{[property.app, property.schema, property.digest].map(value => <td key={value} className="px-4 py-3 text-xs" style={{ color: TEXT, fontFamily: mono }}>{value}</td>)}<td className="px-4 py-3"><Badge label={property.signature} colors={{ bg: BG, text: property.signature === "Verified" ? SUCCESS : ERROR }} /></td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{property.heartbeat}</td><td className="px-4 py-3 text-xs font-semibold" style={{ color: property.disk.startsWith("9") ? ERROR : TEXT, fontFamily: mono }}>{property.disk}</td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{property.backup}</td><td className="px-4 py-3 text-xs font-semibold" style={{ color: TEXT }}>{property.ring}</td><td className="px-4 py-3"><Badge label={property.health} colors={{ bg: BG, text: property.health === "Healthy" ? SUCCESS : property.health === "Warning" ? WARNING : ERROR }} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => audited(`Force update queued for ${property.property}.`)} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: BORDER, color: PRIMARY }}>Force update</button><button onClick={() => audited(`Rollback review opened for ${property.property}.`)} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: BORDER, color: ERROR }}>Rollback</button></div></td></tr>)}</tbody></table></div>}
      </div>
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}><h3 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>Release Health Checks</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{RELEASE_HEALTH_CHECKS.map(check => <div key={check.name} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: BORDER }}><CheckCircle size={19} style={{ color: check.status === "Passed" ? SUCCESS : WARNING }} /><div className="flex-1"><div className="text-sm font-semibold" style={{ color: TEXT }}>{check.name}</div><div className="text-xs" style={{ color: MUTED }}>{check.detail}</div></div><Badge label={check.status} colors={{ bg: BG, text: check.status === "Passed" ? SUCCESS : WARNING }} /></div>)}</div></div>
    </div>
  );
}

export function SupportTools() {
  const [state, setState] = useState<LoadState>("loading");
  const [selectedId, setSelectedId] = useState(SUPPORT_DIAGNOSTICS[0]?.id ?? "");
  const [panel, setPanel] = useState<"diagnostics" | "errors" | "sessions">("diagnostics");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 400); return () => window.clearTimeout(timer); }, []);
  const properties = useMemo(() => SUPPORT_DIAGNOSTICS.filter(property => !search.trim() || `${property.property} ${property.location}`.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const selected = SUPPORT_DIAGNOSTICS.find(property => property.id === selectedId);
  const audit = (message: string) => setNotice(message);
  return (
    <div style={{ fontFamily: sans }}>
      <div className="mb-5"><h2 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Support Tools</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Read-mostly property diagnostics. Every support action is audited.</p></div>
      {notice && <AuditNotice text={notice} onClose={() => setNotice("")} />}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5">
        <aside className="bg-white rounded-xl border overflow-hidden h-fit" style={{ borderColor: BORDER }}>
          <div className="p-3 border-b" style={{ borderColor: BORDER }}><div className="relative"><MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search properties…" aria-label="Search properties" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER }} /></div></div>
          {state === "loading" && <LoadingRows />}
          {state === "error" && <EmptyState icon={Wrench} message="Diagnostics could not be loaded." cta="Try again" onCta={() => setState("ready")} />}
          {state === "ready" && properties.length === 0 && <EmptyState icon={Wrench} message="No properties match your search." cta="Clear" onCta={() => setSearch("")} />}
          {state === "ready" && properties.map(property => <button key={property.id} onClick={() => setSelectedId(property.id)} className="w-full p-4 border-b text-left" style={{ borderColor: BORDER, backgroundColor: selectedId === property.id ? BG : "white" }}><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold" style={{ color: TEXT }}>{property.property}</span><span className="w-2 h-2 rounded-full" style={{ backgroundColor: property.state === "Healthy" ? SUCCESS : property.state === "Warning" ? WARNING : ERROR }} /></div><div className="text-xs mt-1" style={{ color: MUTED }}>{property.location} · {property.lastDiagnostic}</div></button>)}
        </aside>
        {selected ? <section className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}><div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: BORDER }}><div><div className="text-base font-bold" style={{ color: TEXT }}>{selected.property}</div><div className="text-xs mt-1" style={{ color: MUTED }}>{selected.location} · Read-only support session</div></div><Badge label={selected.state} colors={{ bg: BG, text: selected.state === "Healthy" ? SUCCESS : selected.state === "Warning" ? WARNING : ERROR }} /></div><div className="flex border-b overflow-x-auto" style={{ borderColor: BORDER }}>{(["diagnostics", "errors", "sessions"] as const).map(item => <button key={item} onClick={() => setPanel(item)} className="px-4 py-3 text-sm font-semibold capitalize" style={{ color: panel === item ? PRIMARY : MUTED, borderBottom: panel === item ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{item}</button>)}</div><div className="p-5">
          {panel === "diagnostics" && <><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[["Latency", selected.latency], ["Pending writes", String(selected.pending)], ["Recent errors", String(selected.errors)], ["Sessions", String(selected.sessions)]].map(([label, value]) => <div key={label} className="p-3 rounded-xl border" style={{ borderColor: BORDER }}><div className="text-xs" style={{ color: MUTED }}>{label}</div><div className="text-lg font-bold mt-1" style={{ color: TEXT, fontFamily: mono }}>{value}</div></div>)}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5"><button onClick={() => audit(`Remote sync requested for ${selected.property}.`)} className="min-h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: PRIMARY }}><WifiHigh size={17} />Trigger Remote Sync</button><button onClick={() => audit(`Fresh diagnostic bundle requested for ${selected.property}.`)} className="min-h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2" style={{ borderColor: BORDER, color: TEXT }}><Pulse size={17} />Run Diagnostics</button></div></>}
          {panel === "errors" && <div className="space-y-2">{SUPPORT_ERRORS.length ? SUPPORT_ERRORS.map(error => <div key={`${error.time}-${error.code}`} className="p-3 rounded-xl border" style={{ borderColor: BORDER }}><div className="flex items-center gap-2"><Badge label={error.severity} colors={{ bg: BG, text: error.severity === "Error" ? ERROR : error.severity === "Warning" ? WARNING : MUTED }} /><code className="text-xs font-bold" style={{ color: TEXT, fontFamily: mono }}>{error.code}</code><span className="ml-auto text-xs" style={{ color: SUBTLE, fontFamily: mono }}>{error.time}</span></div><div className="text-sm mt-2" style={{ color: MUTED }}>{error.message}</div></div>) : <EmptyState icon={Terminal} message="No errors recorded for this property." />}</div>}
          {panel === "sessions" && <div className="space-y-2">{SUPPORT_SESSIONS.length ? SUPPORT_SESSIONS.map(session => <div key={`${session.user}-${session.device}`} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: BORDER }}><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: BG, color: PRIMARY }}><Database size={17} /></div><div className="flex-1"><div className="text-sm font-semibold" style={{ color: TEXT }}>{session.user} · {session.role}</div><div className="text-xs mt-1" style={{ color: MUTED }}>{session.device} · {session.ip} · {session.age}</div></div><Badge label={session.mfa ? "MFA" : "Offline token"} colors={{ bg: BG, text: session.mfa ? SUCCESS : WARNING }} /></div>) : <EmptyState icon={Database} message="No active sessions for this property." />}</div>}
        </div></section> : <EmptyState icon={Wrench} message="Select a property to inspect diagnostics." />}
      </div>
    </div>
  );
}
