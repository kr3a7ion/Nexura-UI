// Department team: each person's job title, level (staff, supervisor, manager) and which screens of their menus they can open.
// HR and hotel managers change anyone's; a department's manager changes staff and supervisors in their own department;
// nobody changes their own (mock/staff.ts whyNotManage). Supervisors and managers sign off their department's requests.
import React, { useState } from "react";
import type { Toast, Role } from "./constants";
import { BORDER, TEXT, MUTED } from "./constants";
import { PageHeader, BtnO, BtnP } from "./UIKit";
import { Card, Dialog, controlClass, controlStyle } from "./ui";
import { staffAll, staffRecord, setLevel, setJobTitle, setBlocked, whyNotManage, whyNotSetLevel, LEVELS, type Level, type StaffRecord } from "./mock/staff";
import { LOGIN_ACCOUNTS } from "./mock/staffLogin";
import { departmentsForRole } from "./suite/departments";

const td = "px-3 py-2.5 text-sm align-middle";
const signInRole = (name: string) => LOGIN_ACCOUNTS.find(a => a.name === name && a.kind === "staff")?.role as Role | undefined;

/** HR and hotel managers see every department; a department's manager sees their own. */
export const levelDepartments = (role: Role | string, me: string) => {
  const all = [...new Set(staffAll().filter(s => s.status !== "Left").map(s => s.dept))].sort();
  const mine = staffRecord(me);
  if (role === "MGT" || mine?.dept === "HR") return all;
  return mine?.level === "Manager" ? [mine.dept] : [];
};

export function DepartmentLevels({ add, role, staffName }: { add: (t: Omit<Toast, "id">) => void; role: Role; staffName: string }) {
  const [, redraw] = useState(0);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [access, setAccess] = useState<{ s: StaffRecord; blocked: string[] } | null>(null);
  const depts = levelDepartments(role, staffName);
  const result = (why: string | null, ok: string) => { add(why ? { type: "error", title: why } : { type: "success", title: ok }); redraw(n => n + 1); return !why; };
  const saveTitle = (s: StaffRecord) => {
    const t = titles[s.id]; if (t === undefined || t.trim() === s.role) return;
    if (result(setJobTitle(staffName, role, s.name, t), `${s.name}'s job title is now ${t.trim()}`)) setTitles(({ [s.id]: _, ...rest }) => rest);
  };
  const opens = access ? signInRole(access.s.name) : undefined;

  return <div>
    <PageHeader title="Department Team" sub="Job titles, levels and what each person can open. Supervisors and managers sign off their department's requests. HR changes anyone; a department's manager changes staff and supervisors in their own department. Nobody changes their own." />
    {!depts.length && <p className="text-sm" style={{ color: MUTED }}>Only HR or a department's manager can change these.</p>}
    <div className="space-y-5">
      {depts.map(d => <Card key={d} title={d} flush>
        <table className="w-full">
          <thead><tr className="text-left text-xs" style={{ color: MUTED }}><th className={td}>Name</th><th className={td}>Job title</th><th className={td}>Level</th><th className={td}>Can open</th><th className={td}>Level set by</th></tr></thead>
          <tbody>{staffAll().filter(s => s.dept === d && s.status !== "Left").map(s => {
            const locked = !!whyNotManage(staffName, role, s.name), r = signInRole(s.name);
            return <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
              <td className={td} style={{ color: TEXT }}>{s.name}{s.status !== "Active" && <div className="text-xs" style={{ color: MUTED }}>{s.status}: cannot sign off</div>}</td>
              <td className={td}><div className="w-56">
                <input aria-label={`Job title for ${s.name}`} value={titles[s.id] ?? s.role} disabled={locked} onChange={e => setTitles(t => ({ ...t, [s.id]: e.target.value }))}
                  onBlur={() => saveTitle(s)} onKeyDown={e => { if (e.key === "Enter") saveTitle(s); }} className={`${controlClass} py-1.5 rounded-lg disabled:opacity-60`} style={controlStyle()} />
              </div></td>
              <td className={td}><div className="w-36">
                <select aria-label={`Level for ${s.name}`} value={s.level} disabled={locked} onChange={e => result(setLevel(staffName, role, s.name, e.target.value as Level), `${s.name} is now ${e.target.value === "Staff" ? "staff" : `a ${e.target.value.toLowerCase()}`}`)}
                  className={`${controlClass} py-1.5 rounded-lg disabled:opacity-60`} style={controlStyle()}>
                  {LEVELS.map(l => <option key={l} disabled={l !== s.level && !!whyNotSetLevel(staffName, role, s.name, l)}>{l}</option>)}
                </select>
              </div></td>
              <td className={td} style={{ color: TEXT }}>
                {!r ? <span style={{ color: MUTED }}>No sign-in</span> : r === "MGT" ? <span style={{ color: MUTED }}>Everything (hotel manager)</span>
                  : <button disabled={locked} onClick={() => setAccess({ s, blocked: s.blocked ?? [] })} aria-label={`Choose what ${s.name} can open`} className="text-sm font-semibold underline disabled:no-underline disabled:opacity-60">
                    {s.blocked?.length ? `All but ${s.blocked.length} screen${s.blocked.length === 1 ? "" : "s"}` : "Everything in their menus"}</button>}
              </td>
              <td className={td} style={{ color: MUTED }}>{s.levelSetBy ?? "From the job title"}</td>
            </tr>; })}</tbody>
        </table>
      </Card>)}
    </div>
    {access && opens && <Dialog title={`What ${access.s.name} can open`} sub="Untick a screen to close it for this person. Their sign-in opens these departments." onClose={() => setAccess(null)}
      footer={<><BtnO label="Back" onClick={() => setAccess(null)} /><BtnP label="Save what they can open" onClick={() => {
        if (result(setBlocked(staffName, role, access.s.name, access.blocked), `Saved what ${access.s.name} can open`)) setAccess(null); }} /></>}>
      <div className="max-h-[55vh] space-y-4 overflow-y-auto">
        {departmentsForRole(opens).map(dep => <div key={dep.id}>
          <p className="mb-1.5 text-sm font-bold" style={{ color: TEXT }}>{dep.name}</p>
          {dep.screens.flatMap(g => g.items).map(it => {
            const on = !access.blocked.includes(it.screen);
            return <label key={it.screen} className="flex items-center gap-2 py-1 text-sm" style={{ color: TEXT }}>
              <input type="checkbox" checked={on} onChange={() => setAccess(a => a && ({ ...a, blocked: on ? [...a.blocked, it.screen] : a.blocked.filter(x => x !== it.screen) }))} />{it.label}
            </label>; })}
        </div>)}
      </div>
    </Dialog>}
  </div>;
}
