import { useEffect, useMemo, useState } from "react";
import { Buildings, Check, MagnifyingGlass, MapPin, Plus, UserPlus, Users, WifiHigh, WifiSlash, X } from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnO, BtnP, EmptyState, Inp, Sel } from "./UIKit";
import { ORG_BRANCH_DIRECTORY, ORG_BRANCH_NAMES, ORG_LEVEL_USERS } from "./mock/portalExtensions";

type LoadState = "loading" | "ready" | "error";

const money = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

function LoadRows({ count = 4 }: { count?: number }) {
  return <div className="p-4 space-y-3">{Array.from({ length: count }, (_, index) => <div key={index} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>;
}

export function OrgBranchDirectory() {
  const [state, setState] = useState<LoadState>("loading");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 400); return () => window.clearTimeout(timer); }, []);
  const rows = useMemo(() => ORG_BRANCH_DIRECTORY.filter(branch =>
    (status === "All" || branch.status === status || branch.connection === status) &&
    (!search.trim() || `${branch.name} ${branch.location} ${branch.id}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [search, status]);
  return (
    <div style={{ fontFamily: sans }}>
      <div className="mb-5"><h2 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Branch Directory</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Operational and connection status across Grand Palms Group.</p></div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="px-5 py-4 border-b flex items-center gap-3 flex-wrap" style={{ borderColor: BORDER }}>
          <div className="relative flex-1 min-w-64"><MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBTLE }} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search branch, city or ID…" aria-label="Search branch, city or ID" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} /></div>
          <select value={status} onChange={event => setStatus(event.target.value)} className="px-3 py-2 rounded-xl border text-sm bg-white outline-none" style={{ borderColor: BORDER, color: TEXT }}><option>All</option><option>Active</option><option>Opening</option><option>Online</option><option>Degraded</option><option>Offline</option></select>
        </div>
        {state === "loading" && <LoadRows />}
        {state === "error" && <EmptyState icon={WifiSlash} message="Branch directory could not be loaded." cta="Try again" onCta={() => setState("ready")} />}
        {state === "ready" && rows.length === 0 && <EmptyState icon={Buildings} message="No branches match the current search and status filter." cta="Clear filters" onCta={() => { setSearch(""); setStatus("All"); }} />}
        {state === "ready" && rows.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[1180px]"><thead><tr style={{ backgroundColor: BG }}>{["Branch", "Location", "Rooms", "Status", "Connection", "Last Sync", "Schema", "App", "Occupancy", "Revenue Today"].map(label => <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{label}</th>)}</tr></thead><tbody>{rows.map(branch => <tr key={branch.id} className="border-t" style={{ borderColor: BORDER }}><td className="px-4 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{branch.name}</div><div className="text-xs mt-0.5" style={{ color: SUBTLE, fontFamily: mono }}>{branch.id}</div></td><td className="px-4 py-3 text-sm" style={{ color: MUTED }}><span className="inline-flex items-center gap-1"><MapPin size={13} />{branch.location}</span></td><td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT, fontFamily: mono }}>{branch.rooms}</td><td className="px-4 py-3"><Badge label={branch.status} colors={{ bg: BG, text: branch.status === "Active" ? SUCCESS : WARNING }} /></td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: branch.connection === "Online" ? SUCCESS : branch.connection === "Degraded" ? WARNING : ERROR }}>{branch.connection === "Online" ? <WifiHigh size={14} /> : <WifiSlash size={14} />}{branch.connection}</span></td><td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{branch.lastSync}</td><td className="px-4 py-3 text-xs" style={{ color: TEXT, fontFamily: mono }}>{branch.schema}</td><td className="px-4 py-3 text-xs" style={{ color: TEXT, fontFamily: mono }}>{branch.app}</td><td className="px-4 py-3 text-sm font-bold" style={{ color: branch.occupancy > 80 ? SUCCESS : TEXT, fontFamily: mono }}>{branch.occupancy}%</td><td className="px-4 py-3 text-sm font-bold" style={{ color: TEXT, fontFamily: mono }}>{money(branch.revenue)}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}

export function OrgUsers() {
  const [state, setState] = useState<LoadState>("loading");
  const [users, setUsers] = useState(ORG_LEVEL_USERS);
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "Regional Manager", branches: [] as string[] });
  const [notice, setNotice] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setState("ready"), 400); return () => window.clearTimeout(timer); }, []);
  const toggleAccess = (userId: string, branch: string) => setUsers(current => current.map(user => user.id === userId ? { ...user, branches: user.branches.includes(branch) ? user.branches.filter(item => item !== branch) : [...user.branches, branch] } : user));
  const inviteUser = () => {
    if (!invite.name.trim() || !invite.email.trim() || invite.branches.length === 0) { setNotice("Enter the user’s name, email and at least one branch."); return; }
    setUsers(current => [...current, { id: `USR-${String(current.length + 40).padStart(3, "0")}`, name: invite.name.trim(), email: invite.email.trim(), role: invite.role, status: "Invited", branches: invite.branches }]);
    setInvite({ name: "", email: "", role: "Regional Manager", branches: [] }); setShowInvite(false); setNotice("Invitation sent and branch access recorded.");
  };
  return (
    <div style={{ fontFamily: sans }}>
      <div className="flex items-start justify-between gap-4 mb-5"><div><h2 className="text-lg font-bold" style={{ color: TEXT, fontFamily: display }}>Org Users</h2><p className="text-sm mt-1" style={{ color: MUTED }}>Assign organisation roles and property-level access.</p></div><BtnP label="Invite User" icon={UserPlus} onClick={() => setShowInvite(true)} /></div>
      {notice && <div className="mb-4 p-3 rounded-xl border text-sm" style={{ borderColor: TEAL, color: PRIMARY, backgroundColor: BG }}>{notice}</div>}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        {state === "loading" && <LoadRows />}
        {state === "error" && <EmptyState icon={Users} message="Organisation users could not be loaded." cta="Try again" onCta={() => setState("ready")} />}
        {state === "ready" && users.length === 0 && <EmptyState icon={Users} message="No organisation users have been invited." cta="Invite User" onCta={() => setShowInvite(true)} />}
        {state === "ready" && users.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[980px]"><thead><tr style={{ backgroundColor: BG }}><th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>User / Role</th>{ORG_BRANCH_NAMES.map(branch => <th key={branch} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{branch.replace("Grand Palms ", "")}</th>)}<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Status</th></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-t" style={{ borderColor: BORDER }}><td className="px-4 py-3"><div className="text-sm font-semibold" style={{ color: TEXT }}>{user.name}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{user.email}</div><select value={user.role} onChange={event => setUsers(current => current.map(item => item.id === user.id ? { ...item, role: event.target.value } : item))} className="mt-2 px-2 py-1 rounded-lg border text-xs bg-white" style={{ borderColor: BORDER, color: TEXT }}><option>Organisation Owner</option><option>Regional Manager</option><option>Finance Controller</option><option>Auditor</option></select></td>{ORG_BRANCH_NAMES.map(branch => { const allowed = user.branches.includes(branch); return <td key={branch} className="px-3 py-3 text-center"><button onClick={() => toggleAccess(user.id, branch)} className="w-8 h-8 rounded-lg border inline-flex items-center justify-center" style={{ borderColor: allowed ? SUCCESS : BORDER, backgroundColor: allowed ? SUCCESS : "white", color: allowed ? "white" : SUBTLE }}>{allowed && <Check size={16} weight="bold" />}</button></td>; })}<td className="px-4 py-3"><Badge label={user.status} colors={{ bg: BG, text: user.status === "Active" ? SUCCESS : WARNING }} /></td></tr>)}</tbody></table></div>}
      </div>
      {showInvite && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(12,26,54,0.62)" }} onMouseDown={() => setShowInvite(false)}><div className="w-full max-w-lg bg-white rounded-2xl border" style={{ borderColor: BORDER }} onMouseDown={event => event.stopPropagation()}><div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}><div><h3 className="font-bold" style={{ color: TEXT }}>Invite Organisation User</h3><p className="text-xs mt-1" style={{ color: MUTED }}>The invitation will require MFA enrolment.</p></div><button aria-label="Close" onClick={() => setShowInvite(false)}><X size={20} style={{ color: MUTED }} /></button></div><div className="p-5 space-y-4"><Inp label="Full name" value={invite.name} onChange={event => setInvite(current => ({ ...current, name: event.target.value }))} placeholder="e.g. Kemi Adeyemi" /><Inp label="Work email" value={invite.email} onChange={event => setInvite(current => ({ ...current, email: event.target.value }))} placeholder="name@grandpalms.ng" /><Sel label="Organisation role" value={invite.role} onChange={event => setInvite(current => ({ ...current, role: event.target.value }))} options={["Regional Manager", "Finance Controller", "Auditor", "Organisation Owner"]} /><div><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Branch access</div><div className="grid grid-cols-2 gap-2">{ORG_BRANCH_NAMES.map(branch => { const checked = invite.branches.includes(branch); return <button key={branch} onClick={() => setInvite(current => ({ ...current, branches: checked ? current.branches.filter(item => item !== branch) : [...current.branches, branch] }))} className="min-h-12 px-3 rounded-xl border text-left text-xs font-semibold" style={{ borderColor: checked ? PRIMARY : BORDER, color: TEXT }}>{checked ? "✓ " : ""}{branch}</button>; })}</div></div>{notice && <div className="text-xs" style={{ color: ERROR }}>{notice}</div>}</div><div className="px-5 py-4 border-t flex justify-end gap-2" style={{ borderColor: BORDER }}><BtnO label="Cancel" onClick={() => setShowInvite(false)} /><BtnP label="Send Invitation" icon={Plus} onClick={inviteUser} /></div></div></div>}
    </div>
  );
}
