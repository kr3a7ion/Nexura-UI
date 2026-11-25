// Maintenance roster, as FacilityFlow keeps it: people and teams, shift patterns, a week of days
// per person that is drafted, published, then marked present or absent on the day.
// The roster answers one question for the job board: who is on the floor right now.
// Availability only: no clock-in, late minutes, overtime or leave (HR feeds attendance in Phase 3).
import { BUSINESS_DATE } from "../constants";
import { staffAll, isEmployed } from "./staff";

export type StaffRole = "Technician" | "Team lead" | "Supervisor" | "Head of department";
export type Staff = { name: string; trade: string; role: StaffRole; team?: string };
export type Team = { name: string; trade: string; lead: string; supervisor: string };
export type ShiftPattern = { id: string; name: string; start: string; end: string };
export type DayStatus = "Scheduled" | "Off" | "Present" | "Absent";
export const ABSENCE_REASONS = ["Sick", "Day off", "Permission", "Training", "Unexplained", "Other"] as const;
export type AbsenceReason = typeof ABSENCE_REASONS[number];
export type RosterDay = { staff: string; date: string; shift: string | null; status: DayStatus; published: boolean;
  reason?: string; note?: string; markedBy?: string; source?: "Maintenance" | "HR" };

// Dates are local YYYY-MM-DD keys, the way the hotel reads them.
const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDay = (k: string) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (k: string, n: number) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
export const weekStart = (k: string) => addDays(k, -((parseDay(k).getDay() + 6) % 7)); // Monday
export const weekOf = (from: string) => Array.from({ length: 7 }, (_, i) => addDays(from, i));
export const TODAY = dayKey(BUSINESS_DATE);

const TEAMS: Team[] = [
  { name: "Electrical and HVAC", trade: "Electrical", lead: "Bola Adewale", supervisor: "Yusuf Garba" },
  { name: "Plumbing and building", trade: "Plumbing", lead: "Bola Adewale", supervisor: "Yusuf Garba" },
];
// People come from HR (mock/staff.ts). Maintenance keeps only what it adds: trade, team and maintenance role.
// Anyone in HR's Maintenance department is on the roster; someone outside it is, once Maintenance gives them a role.
const PROFILE: Record<string, Omit<Staff, "name">> = {
  "Adaeze Okonkwo": { trade: "Management", role: "Head of department" },
  "Bola Adewale": { trade: "Electrical", role: "Team lead", team: "Electrical and HVAC" },
  "Chidi Ike": { trade: "Plumbing", role: "Technician", team: "Plumbing and building" },
  "Emeka Obi": { trade: "Electrical", role: "Technician", team: "Electrical and HVAC" },
  "Musa Danladi": { trade: "HVAC", role: "Technician", team: "Electrical and HVAC" },
  "Yusuf Garba": { trade: "Mechanical", role: "Supervisor" },
};
/** Maintenance's people as HR has them now: someone who left drops out, a new hire in Maintenance appears. */
const STAFF = () => staffAll().filter(s => isEmployed(s.name) && (s.dept === "Maintenance" || PROFILE[s.name]))
  .map(s => ({ name: s.name, ...(PROFILE[s.name] ?? { trade: "General", role: "Technician" as StaffRole }) }));
// Any number of patterns, any times. Nothing about morning or night is built into the screens.
const PATTERNS: ShiftPattern[] = [
  { id: "SP-1", name: "Morning", start: "07:00", end: "15:00" },
  { id: "SP-2", name: "Afternoon", start: "15:00", end: "23:00" },
  { id: "SP-3", name: "Night", start: "23:00", end: "07:00" },
];

export const staffList = () => STAFF();
export const teams = () => TEAMS;
export const patterns = () => PATTERNS;
export const staff = (name: string) => STAFF().find(s => s.name === name);
export const team = (name: string) => TEAMS.find(t => t.name === name);
export const teamMembers = (name: string) => STAFF().filter(s => s.team === name).map(s => s.name);
export const holdersOf = (role: StaffRole) => STAFF().filter(s => s.role === role).map(s => s.name);
export const patternName = (id: string | null) => PATTERNS.find(p => p.id === id)?.name ?? "Off";

// One row per person per day; the key alone stops double booking.
const DAYS = new Map<string, RosterDay>();
const key = (s: string, d: string) => `${s}|${d}`;
export const rosterDay = (s: string, d: string) => DAYS.get(key(s, d));
export const daysBetween = (from: string, to: string) => [...DAYS.values()].filter(x => x.date >= from && x.date <= to);

// This week is published. Days before today were marked present; today Musa is off sick; next week is empty, to fill.
const SEED: Record<string, (string | null)[]> = { // Monday to Sunday
  "Adaeze Okonkwo": ["SP-1", "SP-1", "SP-1", "SP-1", "SP-1", null, null],
  "Bola Adewale":   ["SP-1", "SP-1", "SP-1", "SP-1", null, null, "SP-1"],
  "Chidi Ike":      ["SP-1", "SP-1", "SP-1", null, null, "SP-1", "SP-1"],
  "Emeka Obi":      [null, "SP-1", "SP-1", "SP-1", "SP-1", "SP-1", null],
  "Musa Danladi":   ["SP-2", "SP-2", "SP-2", "SP-2", null, null, "SP-2"],
  "Yusuf Garba":    ["SP-1", "SP-1", "SP-1", "SP-1", "SP-1", null, null],
};
weekOf(weekStart(TODAY)).forEach((date, i) => {
  for (const [name, row] of Object.entries(SEED)) {
    const shift = row[i];
    const status: DayStatus = !shift ? "Off" : date < TODAY ? "Present" : date === TODAY ? (name === "Musa Danladi" ? "Absent" : "Present") : "Scheduled";
    DAYS.set(key(name, date), { staff: name, date, shift, status, published: true, ...(status === "Absent" ? { reason: "Sick", markedBy: "Yusuf Garba", source: "Maintenance" as const } : {}) });
  }
});

/** Draft one day: a shift, or off. A day already marked present or absent is not repainted. */
export const paintDay = (s: string, date: string, shift: string | null): string | null => {
  const cur = rosterDay(s, date);
  if (cur?.source === "HR") return `${s} is on ${cur.reason?.toLowerCase()} recorded by HR that day. HR changes it, not the roster.`;
  if (cur && (cur.status === "Present" || cur.status === "Absent")) return `${s} is already marked ${cur.status.toLowerCase()} on that day.`;
  DAYS.set(key(s, date), { staff: s, date, shift, status: shift ? "Scheduled" : "Off", published: false });
  return null;
};

/** Fill a pattern over a range: everyone on one shift, or rotating weekly through several so each person starts on a different one. */
export const fillPattern = (f: { from: string; to: string; people: string[]; restDays: number[]; shifts: string[] }): { written: number; refused: string | null } => {
  if (!f.people.length) return { written: 0, refused: "Choose who to roster." };
  if (!f.shifts.length) return { written: 0, refused: "Choose a shift." };
  if (f.to < f.from) return { written: 0, refused: "The end date is before the start date." };
  if (parseDay(f.to).getTime() - parseDay(f.from).getTime() > 13 * 86400000) return { written: 0, refused: "Fill two weeks at a time at most." };
  let written = 0;
  for (let d = f.from, i = 0; d <= f.to; d = addDays(d, 1), i++) {
    const rest = f.restDays.includes((parseDay(d).getDay() + 6) % 7);
    f.people.forEach((p, n) => {
      const shift = rest ? null : f.shifts[(n + Math.floor((i + (parseDay(f.from).getDay() + 6) % 7) / 7)) % f.shifts.length];
      if (!paintDay(p, d, shift)) written++;
    });
  }
  return { written, refused: null };
};

/** Publishing releases exactly the week on screen; a drafted week is a plan nobody can be assigned from. */
export const publish = (from: string, to: string) => {
  const drafts = daysBetween(from, to).filter(x => !x.published);
  drafts.forEach(x => { x.published = true; });
  return drafts.length;
};

/** Present or absent on the day. Absent needs a reason, and that is the availability record. */
export const markDay = (s: string, date: string, status: "Present" | "Absent", by: string, reason?: AbsenceReason, note?: string): string | null => {
  const d = rosterDay(s, date);
  if (!d) return `${s} is not on the roster that day.`;
  if (d.status === "Off") return `${s} is off duty that day.`;
  if (!d.published) return "This week is not published yet. Publish it first.";
  if (d.source === "HR") return `${s} is on ${d.reason?.toLowerCase()} recorded by HR. HR changes it, not the roster.`;
  if (status === "Absent" && !reason) return "Choose why they are absent.";
  Object.assign(d, { status, markedBy: by, source: status === "Absent" ? "Maintenance" : undefined, reason: status === "Absent" ? reason : undefined, note: status === "Absent" ? note?.trim() || undefined : undefined });
  return null;
};

/** The one question the job board asks: who is marked present today. */
export const presentToday = () => STAFF().filter(s => rosterDay(s.name, TODAY)?.status === "Present").map(s => s.name);
export const isPresentToday = (name: string) => rosterDay(name, TODAY)?.status === "Present";

// ── Maintenance setup ────────────────────────────────────────────────────────
export const ROLES: StaffRole[] = ["Technician", "Team lead", "Supervisor", "Head of department"];
/** Trade, team and maintenance role. The person's own record comes from HR (next PR). */
export const setPerson = (name: string, p: { trade: string; team?: string; role: StaffRole }): string | null => {
  if (!staff(name)) return "That person is not on the list.";
  if (p.team && !team(p.team)) return "There is no such team.";
  PROFILE[name] = { trade: p.trade, team: p.team || undefined, role: p.role };
  return null;
};
export const addTeam = (t: Team): string | null => {
  if (!t.name.trim()) return "Name the team.";
  if (TEAMS.some(x => x.name.toLowerCase() === t.name.trim().toLowerCase())) return "There is already a team with that name.";
  if (!staff(t.lead) || !staff(t.supervisor)) return "Choose a lead and a supervisor from the people list.";
  TEAMS.push({ ...t, name: t.name.trim() });
  return null;
};
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
export const addPattern = (p: Omit<ShiftPattern, "id">): string | null => {
  if (!p.name.trim()) return "Name the shift.";
  if (PATTERNS.some(x => x.name.toLowerCase() === p.name.trim().toLowerCase())) return "There is already a shift with that name.";
  if (!HHMM.test(p.start) || !HHMM.test(p.end)) return "Enter the start and end as 24-hour times, for example 07:00.";
  if (p.start === p.end) return "A shift cannot start and end at the same time.";
  PATTERNS.push({ ...p, name: p.name.trim(), id: `SP-${PATTERNS.length + 1}` });
  return null;
};

/** HR's approved leave lands on the roster: every day in the range is absent with HR's reason, published, and cannot be repainted. */
export const applyLeave = (s: string, from: string, to: string, reason: string, by: string) => {
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const cur = rosterDay(s, d);
    DAYS.set(key(s, d), { staff: s, date: d, shift: cur?.shift ?? null, status: "Absent", published: true, reason, markedBy: by, source: "HR" });
  }
};
/** Leave cancelled by HR gives the days back to Maintenance to plan. */
export const clearLeave = (s: string, from: string, to: string) => {
  for (let d = from; d <= to; d = addDays(d, 1)) if (rosterDay(s, d)?.source === "HR") DAYS.delete(key(s, d));
};
/** Every absence on the roster, newest first, with who set it and from where: what HR's Attendance reads. */
export const absences = () => [...DAYS.values()].filter(d => d.status === "Absent").sort((a, b) => b.date.localeCompare(a.date) || a.staff.localeCompare(b.staff));

/** Maintenance Setup: managers, the head of department and supervisors, who plan shifts, set targets and deadline
 *  rules and keep the plant limits. FacilityFlow keeps all of it to administrators, which leaves supervisors unable to
 *  fix a target they live with every day. */
export const canSetUp = (name: string, role: string) => role === "MGT" || ["Head of department", "Supervisor"].includes(staff(name)?.role ?? "");
/** People's roles and the money settings (approval limits, labour rate) decide who may approve what, so a supervisor
 *  never changes them: nobody sets their own authority. Managers and the head of department only. */
export const canSetAuthority = (name: string, role: string) => role === "MGT" || staff(name)?.role === "Head of department";

/** Signing off a job (and confirming its materials) is a Maintenance supervisor's or the head of department's call. */
export const canVerify = (name: string) => ["Supervisor", "Head of department"].includes(staff(name)?.role ?? "");
