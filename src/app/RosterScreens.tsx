// Maintenance roster (FacilityFlow's model): plan the week, publish it, then mark present or absent on the day.
// The assignment screen only offers people marked present today.
import React, { useState } from "react";
import { CheckCircle2, UserX, Clock, FileEdit } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, SUBTLE, TEAL_INK } from "./constants";
import { StatCard, PageHeader, BtnP, BtnO } from "./UIKit";
import { UI, Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { Select } from "./WorkOrderScreens";
import {
  staffList, teams, teamMembers, patterns, patternName, rosterDay, daysBetween, paintDay, fillPattern, publish, markDay,
  weekStart, weekOf, addDays, parseDay, TODAY, ABSENCE_REASONS, type AbsenceReason, type RosterDay,
} from "./mock/roster";

type Add = (t: Omit<Toast, "id">) => void;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayLabel = (k: string) => parseDay(k).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const CELL: Record<string, { bg: string; text: string }> = {
  Present: { bg: "#DCFCE7", text: "#166534" }, Absent: { bg: "#FEE2E2", text: "#991B1B" },
  Scheduled: { bg: "#F0FDFA", text: TEAL_INK }, Off: { bg: "#F8FAFC", text: SUBTLE },
};
const Toggle = ({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className="px-3 text-sm font-medium"
    style={{ height: 36, borderRadius: 10, border: `1px solid ${on ? UI.focus : "#CBD5E1"}`, backgroundColor: on ? UI.selectedBg : "white", color: on ? TEAL_INK : TEXT }}>{label}</button>
);

export function MaintenanceRoster({ add, staffName }: { add: Add; staffName: string }) {
  const [from, setFrom] = useState(weekStart(TODAY));
  const [editing, setEditing] = useState(false);
  const [brush, setBrush] = useState<string | null>(patterns()[0].id);
  const [marking, setMarking] = useState<RosterDay | null>(null);
  const [filling, setFilling] = useState(false);
  const [, redraw] = useState(0);
  const days = weekOf(from);
  const to = days[6];
  const people = staffList();
  const today = people.map(p => rosterDay(p.name, TODAY)).filter((d): d is RosterDay => !!d && d.status !== "Off");
  const present = today.filter(d => d.status === "Present"), absent = today.filter(d => d.status === "Absent");
  const unmarked = today.filter(d => d.status === "Scheduled");
  const drafts = daysBetween(from, to).filter(d => !d.published).length;
  const thisWeek = weekStart(TODAY);
  const label = from === thisWeek ? "This week" : from === addDays(thisWeek, 7) ? "Next week" : from === addDays(thisWeek, -7) ? "Last week" : `Week of ${dayLabel(from)}`;

  const paint = (name: string, date: string) => {
    const refused = paintDay(name, date, brush);
    if (refused) add({ type: "error", title: refused }); else redraw(n => n + 1);
  };
  const release = () => {
    const n = publish(from, to);
    add({ type: "success", title: n ? `${n} day${n === 1 ? "" : "s"} published` : "Everything in this week was already published", body: n ? "The team can see this week now." : undefined });
    setEditing(false); redraw(n2 => n2 + 1);
  };

  return (
    <div>
      <PageHeader title="Roster" sub="Who is on the floor. Plan the week, publish it, then mark present or absent each morning."
        actions={<div className="flex items-center gap-2 flex-wrap justify-end">
          <BtnO label="Previous week" onClick={() => setFrom(addDays(from, -7))} />
          <span className="text-sm font-semibold px-1 whitespace-nowrap" style={{ color: TEXT }}>{label}</span>
          <BtnO label="Next week" onClick={() => setFrom(addDays(from, 7))} />
          <BtnO label="Fill a pattern" onClick={() => setFilling(true)} />
          <BtnO label={editing ? "Done editing" : "Edit week"} onClick={() => setEditing(!editing)} />
          {drafts > 0 && <BtnP label={`Publish ${drafts} day${drafts === 1 ? "" : "s"}`} onClick={release} />}
        </div>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard label="Present today" value={String(present.length)} sub={present.length ? "Can be given work" : "Nobody can be assigned yet"} icon={CheckCircle2} accent={TEAL_INK} />
        <StatCard label="Absent today" value={String(absent.length)} sub={absent.map(d => `${d.staff.split(" ")[0]}: ${d.reason?.toLowerCase()}`).join(", ") || "Nobody"} icon={UserX} accent="#B91C1C" />
        <StatCard label="Not yet marked" value={String(unmarked.length)} sub={unmarked.length ? unmarked.map(d => d.staff.split(" ")[0]).join(", ") : "Everyone on today is marked"} icon={Clock} accent="#B45309" />
        <StatCard label="Unpublished" value={String(drafts)} sub={drafts ? "Days the team cannot see yet" : daysBetween(from, to).length ? "This week is published" : "Nothing rostered this week"} icon={FileEdit} accent={MUTED} />
      </div>

      {editing && (
        <div className="mb-7"><Card title="Painting shifts" sub="Choose a shift, then click days. Changes stay unpublished until you press Publish, so a half-built week is never visible to the team.">
          <div role="group" aria-label="Shift to paint" className="flex flex-wrap gap-2">
            {patterns().map(p => <Toggle key={p.id} on={brush === p.id} label={`${p.name} ${p.start}–${p.end}`} onClick={() => setBrush(p.id)} />)}
            <Toggle on={brush === null} label="Off" onClick={() => setBrush(null)} />
          </div>
        </Card></div>
      )}

      <div className="bg-white overflow-x-auto mb-7" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: UI.surface, borderBottom: `1px solid ${BORDER}` }}>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: MUTED }}>Person</th>
              {days.map(d => <th key={d} className="px-2 py-3 text-left text-sm font-medium whitespace-nowrap" style={{ color: d === TODAY ? TEAL_INK : MUTED }}>{dayLabel(d)}{d === TODAY ? " (today)" : ""}</th>)}
            </tr>
          </thead>
          <tbody>
            {people.map(p => (
              <tr key={p.name} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>{p.name}</div>
                  <div className="text-sm" style={{ color: MUTED }}>{p.role}{p.team ? `, ${p.team}` : ""}</div>
                </td>
                {days.map(date => {
                  const e = rosterDay(p.name, date);
                  const state = e?.status ?? "Off";
                  const canMark = !editing && date === TODAY && !!e && e.status !== "Off";
                  const text = !e ? "Not rostered" : e.status === "Off" ? "Off" : e.status === "Absent" ? `Absent: ${e.reason?.toLowerCase()}` : patternName(e.shift);
                  return (
                    <td key={date} className="px-2 py-2">
                      <button type="button" disabled={!editing && !canMark} onClick={() => editing ? paint(p.name, date) : e && setMarking(e)}
                        aria-label={`${p.name}, ${dayLabel(date)}: ${text}${e?.status === "Present" ? ", present" : ""}${e && !e.published ? ", draft" : ""}`}
                        className="w-full text-left px-2.5 py-1.5 text-sm whitespace-nowrap"
                        style={{ minWidth: 104, minHeight: 40, borderRadius: 8, backgroundColor: CELL[state].bg, color: CELL[state].text,
                          border: `1px ${e && !e.published ? "dashed" : "solid"} ${canMark || editing ? CELL[state].text : "transparent"}`, cursor: editing || canMark ? "pointer" : "default" }}>
                        {text}{e?.status === "Present" ? " ✓" : ""}{e && !e.published && e.status !== "Off" ? " · draft" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid xl:grid-cols-2 gap-4 mb-7">
        <Card title="Teams" sub="A job can go to a team; whoever on it accepts first takes it. Late jobs go to the team's lead, then its supervisor.">
          {teams().map(t => (
            <div key={t.name} className="py-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="text-sm font-semibold" style={{ color: TEXT }}>{t.name}</div>
              <div className="text-sm" style={{ color: MUTED }}>Lead {t.lead}, supervisor {t.supervisor}. Members: {teamMembers(t.name).join(", ") || "none"}.</div>
            </div>
          ))}
        </Card>
        <Card title="Shift patterns" sub="Set by the property. Nothing about shift names or times is fixed in the system.">
          {patterns().map(p => (
            <div key={p.id} className="flex justify-between py-2.5 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}>
              <span className="font-semibold">{p.name}</span><span style={{ color: MUTED }}>{p.start} to {p.end}</span>
            </div>
          ))}
        </Card>
      </div>
      <p className="text-sm" style={{ color: MUTED }}>A published roster is a plan. On the day, mark each person present or absent: only people marked present can be given work. This is availability only, not clock-in, overtime or leave.</p>

      {marking && <MarkDialog day={marking} by={staffName} onClose={() => setMarking(null)}
        onDone={(title, ok) => { add({ type: ok ? "success" : "error", title }); if (ok) { setMarking(null); redraw(n => n + 1); } }} />}
      {filling && <FillDialog from={from} onClose={() => setFilling(false)}
        onDone={title => { add({ type: "success", title, body: "Publish when the week is right." }); setFilling(false); setEditing(true); redraw(n => n + 1); }}
        onError={title => add({ type: "error", title })} />}
    </div>
  );
}

function MarkDialog({ day, by, onClose, onDone }: { day: RosterDay; by: string; onClose: () => void; onDone: (title: string, ok: boolean) => void }) {
  const [reason, setReason] = useState<AbsenceReason>(day.reason ?? "Sick");
  const [note, setNote] = useState(day.note ?? "");
  const mark = (status: "Present" | "Absent") => {
    const refused = markDay(day.staff, day.date, status, by, status === "Absent" ? reason : undefined, note);
    onDone(refused ?? `${day.staff} marked ${status.toLowerCase()}`, !refused);
  };
  return (
    <Dialog title={`${day.staff}, today`} sub={`${patternName(day.shift)} shift. Marking absent asks why; that is the availability record.`} onClose={onClose}
      footer={<><BtnO label="Cancel" onClick={onClose} /><BtnO label="Mark absent" onClick={() => mark("Absent")} /><BtnP label="Mark present" onClick={() => mark("Present")} /></>}>
      <Select id="ro-reason" label="If absent, why" value={reason} onChange={v => setReason(v as AbsenceReason)} options={[...ABSENCE_REASONS]} />
      <Field label="Note" htmlFor="ro-note" hint="Optional, for example when they expect to be back.">
        <input id="ro-note" value={note} onChange={e => setNote(e.target.value)} className={controlClass} style={controlStyle()} />
      </Field>
    </Dialog>
  );
}

function FillDialog({ from, onClose, onDone, onError }: { from: string; onClose: () => void; onDone: (t: string) => void; onError: (t: string) => void }) {
  const [weeks, setWeeks] = useState("1");
  const [who, setWho] = useState<string[]>(staffList().filter(s => s.role === "Technician" || s.role === "Team lead").map(s => s.name));
  const [rest, setRest] = useState<number[]>([5, 6]);
  const [mode, setMode] = useState("fixed");
  const [shift, setShift] = useState(patterns()[0].id);
  const [rotation, setRotation] = useState<string[]>(patterns().map(p => p.id));
  const flip = <T,>(list: T[], v: T) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
  const save = () => {
    const r = fillPattern({ from, to: addDays(from, Number(weeks) * 7 - 1), people: who, restDays: rest, shifts: mode === "fixed" ? [shift] : rotation });
    if (r.refused) onError(r.refused); else onDone(`${r.written} day${r.written === 1 ? "" : "s"} drafted`);
  };
  return (
    <Dialog title="Fill a pattern" sub={`From ${dayLabel(from)}. Days already marked present or absent are left as they are.`} wide onClose={onClose}
      footer={<><BtnO label="Cancel" onClick={onClose} /><BtnP label="Draft the days" onClick={save} /></>}>
      <Select id="fp-weeks" label="How long" value={weeks} onChange={setWeeks} options={[["1", "One week"], ["2", "Two weeks"]]} />
      <Field label="Who"><div role="group" aria-label="Who" className="flex flex-wrap gap-2">
        {staffList().map(s => <Toggle key={s.name} on={who.includes(s.name)} label={s.name} onClick={() => setWho(flip(who, s.name))} />)}
      </div></Field>
      <Field label="Rest days" hint="Left off: nobody is scheduled on these."><div role="group" aria-label="Rest days" className="flex flex-wrap gap-2">
        {WEEKDAYS.map((d, i) => <Toggle key={d} on={rest.includes(i)} label={d} onClick={() => setRest(flip(rest, i))} />)}
      </div></Field>
      <Select id="fp-mode" label="Pattern" value={mode} onChange={setMode} options={[["fixed", "Everyone on one shift"], ["rotate", "Rotate weekly through shifts"]]} />
      {mode === "fixed"
        ? <Select id="fp-shift" label="Which shift" value={shift} onChange={setShift} options={patterns().map(p => [p.id, `${p.name} ${p.start}–${p.end}`] as [string, string])} />
        : <Field label="Shifts in the rotation" hint="Each person starts on a different one."><div role="group" aria-label="Shifts in the rotation" className="flex flex-wrap gap-2">
            {patterns().map(p => <Toggle key={p.id} on={rotation.includes(p.id)} label={p.name} onClick={() => setRotation(flip(rotation, p.id))} />)}
          </div></Field>}
    </Dialog>
  );
}
