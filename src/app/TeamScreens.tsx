// Department levels: who is staff, supervisor or manager in each department (mock/staff.ts).
// Supervisors and managers sign off their department's requests, such as a vehicle from Fleet.
import React, { useState } from "react";
import type { Toast, Role } from "./constants";
import { BORDER, TEXT, MUTED } from "./constants";
import { PageHeader } from "./UIKit";
import { Card, controlClass, controlStyle } from "./ui";
import { staffAll, staffRecord, setLevel, whyNotSetLevel, LEVELS, type Level } from "./mock/staff";

const td = "px-3 py-2.5 text-sm align-middle";

/** HR and hotel managers see every department; a department's manager sees their own. */
export const levelDepartments = (role: Role | string, me: string) => {
  const all = [...new Set(staffAll().filter(s => s.status !== "Left").map(s => s.dept))].sort();
  const mine = staffRecord(me);
  if (role === "MGT" || mine?.dept === "HR") return all;
  return mine?.level === "Manager" ? [mine.dept] : [];
};

export function DepartmentLevels({ add, role, staffName }: { add: (t: Omit<Toast, "id">) => void; role: Role; staffName: string }) {
  const [, redraw] = useState(0);
  const depts = levelDepartments(role, staffName);
  const change = (name: string, level: Level) => {
    const why = setLevel(staffName, role, name, level);
    add(why ? { type: "error", title: why } : { type: "success", title: `${name} is now ${level === "Staff" ? "staff" : `a ${level.toLowerCase()}`}` });
    redraw(n => n + 1);
  };
  return <div>
    <PageHeader title="Department Levels" sub="Supervisors and managers sign off their department's requests. HR sets anyone's level; a department's manager sets staff and supervisors in their own department. Nobody sets their own." />
    {!depts.length && <p className="text-sm" style={{ color: MUTED }}>Only HR or a department's manager can set levels.</p>}
    <div className="space-y-5">
      {depts.map(d => <Card key={d} title={d} flush>
        <table className="w-full">
          <thead><tr className="text-left text-xs" style={{ color: MUTED }}><th className={td}>Name</th><th className={td}>Job title</th><th className={td}>Level</th><th className={td}>Set by</th></tr></thead>
          <tbody>{staffAll().filter(s => s.dept === d && s.status !== "Left").map(s => {
            const locked = LEVELS.every(l => l === s.level || !!whyNotSetLevel(staffName, role, s.name, l));
            return <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
              <td className={td} style={{ color: TEXT }}>{s.name}</td>
              <td className={td} style={{ color: MUTED }}>{s.role}</td>
              <td className={td}><div className="w-44">
                <select aria-label={`Level for ${s.name}`} value={s.level} disabled={locked} onChange={e => change(s.name, e.target.value as Level)}
                  className={`${controlClass} py-1.5 rounded-lg disabled:opacity-60`} style={controlStyle()}>
                  {LEVELS.map(l => <option key={l} disabled={l !== s.level && !!whyNotSetLevel(staffName, role, s.name, l)}>{l}</option>)}
                </select>
              </div></td>
              <td className={td} style={{ color: MUTED }}>{s.levelSetBy ?? "From the job title"}</td>
            </tr>; })}</tbody>
        </table>
      </Card>)}
    </div>
  </div>;
}
