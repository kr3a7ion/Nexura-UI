// The one staff list. HR owns it (Staff Directory); every department reads its people from here.
// Maintenance adds trade, team and role on top (mock/roster.ts); HR's leave lands on the roster (mock/leave.ts).
export type StaffStatus = "Active" | "On Leave" | "Inactive" | "Left";
export type Level = "Staff" | "Supervisor" | "Manager";
export const LEVELS: Level[] = ["Staff", "Supervisor", "Manager"];
// level: what the person may sign off in their own department. HR sets it; see setLevel below.
export type StaffRecord = { id: string; name: string; role: string; dept: string; phone: string; email: string; empType: string; hireDate: string; status: StaffStatus; shift: string; gender: "M" | "F"; level?: Level; levelSetBy?: string; blocked?: string[] };
const STAFF: StaffRecord[] = [
  { id:"EMP-001", name:"John Abubakar",    role:"Front Desk Officer",  dept:"Front Desk",  phone:"0803-001-1001", email:"j.abubakar@grandpalms.ng",   empType:"Full-time",  hireDate:"3 Jan 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-002", name:"Amaka Osei",       role:"Housekeeping Attendant",dept:"Housekeeping",phone:"0802-002-2002",email:"a.osei@grandpalms.ng",       empType:"Full-time",  hireDate:"15 Mar 2021", status:"Active",   shift:"Morning 06:00–14:00", gender:"F" },
  { id:"EMP-003", name:"Emeka Obi",        role:"Electrical Technician", dept:"Maintenance", phone:"0801-003-3003", email:"e.obi@grandpalms.ng",       empType:"Full-time",  hireDate:"1 Jun 2020", status:"Active",   shift:"Morning 06:00–14:00", gender:"M" },
  { id:"EMP-004", name:"Fatima Ibrahim",   role:"Reservations Manager", dept:"Front Desk",  phone:"0805-004-4004", email:"f.ibrahim@grandpalms.ng",     empType:"Full-time",  hireDate:"20 Sep 2023", status:"Active",   shift:"Morning 08:00–16:00", gender:"F" },
  { id:"EMP-005", name:"Chidi Ike",        role:"Plumber",              dept:"Maintenance", phone:"0806-005-5005", email:"c.ike@grandpalms.ng",         empType:"Full-time",  hireDate:"10 Apr 2019", status:"Active",   shift:"Rotating",            gender:"M" },
  { id:"EMP-006", name:"Ngozi Okonkwo",    role:"HK Supervisor",       dept:"Housekeeping",phone:"0807-006-6006", email:"n.okonkwo@grandpalms.ng",     empType:"Full-time",  hireDate:"1 Feb 2022", status:"On Leave", shift:"Morning 06:00–14:00", gender:"F" },
  { id:"EMP-007", name:"Bello Musa",       role:"Finance Officer",      dept:"Finance",     phone:"0808-007-7007", email:"b.musa@grandpalms.ng",        empType:"Full-time",  hireDate:"14 Jul 2023", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" },
  { id:"EMP-008", name:"Ada Okonkwo",      role:"Guest Relations",      dept:"Front Desk",  phone:"0809-008-8008", email:"a.okonkwo@grandpalms.ng",     empType:"Contract",   hireDate:"1 Jan 2025", status:"Active",   shift:"Evening 15:00–23:00", gender:"F" },
  { id:"EMP-009", name:"Tunde Adeyemi",    role:"IT Administrator",     dept:"IT",          phone:"0810-009-9009", email:"t.adeyemi@grandpalms.ng",     empType:"Full-time",  hireDate:"5 May 2021", status:"Active",   shift:"Morning 08:00–17:00", gender:"M" },
  { id:"EMP-010", name:"Grace Ojo",        role:"Restaurant Supervisor",dept:"Restaurant",  phone:"0811-010-1010", email:"g.ojo@grandpalms.ng",         empType:"Full-time",  hireDate:"22 Oct 2022", status:"Active",   shift:"Evening 14:00–22:00", gender:"F" },
  { id:"EMP-011", name:"Samuel Okafor",    role:"Security Officer",     dept:"Security",    phone:"0812-011-1011", email:"s.okafor@grandpalms.ng",      empType:"Contract",   hireDate:"1 Mar 2024", status:"Active",   shift:"Night 23:00–07:00",   gender:"M" },
  { id:"EMP-012", name:"Chidinma Eze",     role:"Spa Therapist",        dept:"Spa",         phone:"0813-012-1012", email:"c.eze2@grandpalms.ng",        empType:"Part-time",  hireDate:"15 Aug 2023", status:"Inactive", shift:"Morning 09:00–15:00", gender:"F" },
  { id:"EMP-013", name:"Adaeze Okonkwo",   role:"General Manager",       dept:"Management",  phone:"0814-013-1013", email:"a.okonkwo2@grandpalms.ng", empType:"Full-time",  hireDate:"2 Jan 2019", status:"Active",   shift:"Morning 08:00–17:00", gender:"F" },
  { id:"EMP-014", name:"Bola Adewale",     role:"Maintenance Team Lead", dept:"Maintenance", phone:"0815-014-1014", email:"b.adewale@grandpalms.ng",  empType:"Full-time",  hireDate:"8 Aug 2020", status:"Active",   shift:"Rotating",            gender:"M" },
  { id:"EMP-015", name:"Musa Danladi",     role:"HVAC Technician",       dept:"Maintenance", phone:"0816-015-1015", email:"m.danladi@grandpalms.ng",  empType:"Full-time",  hireDate:"3 Mar 2023", status:"Active",   shift:"Rotating",            gender:"M" },
  { id:"EMP-016", name:"Yusuf Garba",      role:"Maintenance Supervisor",dept:"Maintenance", phone:"0817-016-1016", email:"y.garba@grandpalms.ng",    empType:"Full-time",  hireDate:"11 Nov 2018", status:"Active",  shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-017", name:"Chioma Nwosu",     role:"Front Desk Officer",    dept:"Front Desk",  phone:"0818-017-1017", email:"c.nwosu@grandpalms.ng",    empType:"Full-time",  hireDate:"4 Apr 2023", status:"Active",   shift:"Morning 07:00–15:00", gender:"F" },
  { id:"EMP-018", name:"Fatima Musa",      role:"Housekeeping Attendant",dept:"Housekeeping",phone:"0819-018-1018", email:"f.musa@grandpalms.ng",     empType:"Full-time",  hireDate:"9 Sep 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"F" },
  { id:"EMP-019", name:"Biodun Adeyemi",   role:"Waiter",                dept:"Restaurant",  phone:"0820-019-1019", email:"b.adeyemi@grandpalms.ng",  empType:"Full-time",  hireDate:"1 Jun 2024", status:"Active",   shift:"Afternoon 15:00–23:00", gender:"M" },
  { id:"EMP-020", name:"Amina Yusuf",      role:"Reservations Officer",  dept:"Front Desk",  phone:"0821-020-1020", email:"a.yusuf@grandpalms.ng",    empType:"Full-time",  hireDate:"12 Feb 2024", status:"Active",   shift:"Morning 07:00–15:00", gender:"F" },
  { id:"EMP-021", name:"Ngozi Eze",        role:"Accountant",            dept:"Finance",     phone:"0822-021-1021", email:"n.eze@grandpalms.ng",      empType:"Full-time",  hireDate:"6 Jan 2021", status:"Active",   shift:"Morning 07:00–15:00", gender:"F" },
  { id:"EMP-022", name:"Tunde Afolabi",    role:"IT Support Officer",    dept:"IT",          phone:"0823-022-1022", email:"t.afolabi@grandpalms.ng",  empType:"Full-time",  hireDate:"3 Mar 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-023", name:"Kunle Bello",      role:"Fleet Manager",         dept:"Fleet",       phone:"0824-023-1023", email:"k.bello@grandpalms.ng",    empType:"Full-time",  hireDate:"7 Jul 2020", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-026", name:"Halima Bako",      role:"Store House Manager",   dept:"Store house", phone:"0827-026-1026", email:"h.bako@grandpalms.ng",     empType:"Full-time",  hireDate:"10 Oct 2019", status:"Active",   shift:"Morning 07:00–15:00", gender:"F" },
  { id:"EMP-027", name:"Musa Idris",       role:"Procurement Officer",   dept:"Store house", phone:"0828-027-1027", email:"m.idris@grandpalms.ng",    empType:"Full-time",  hireDate:"3 Feb 2022", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-025", name:"Ibrahim Danladi",  role:"Security Supervisor",   dept:"Security",    phone:"0826-025-1025", email:"i.danladi@grandpalms.ng",  empType:"Full-time",  hireDate:"5 Aug 2021", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
  { id:"EMP-024", name:"Sani Abdullahi",   role:"Driver",                dept:"Fleet",       phone:"0825-024-1024", email:"s.abdullahi@grandpalms.ng",empType:"Full-time",  hireDate:"2 May 2021", status:"Active",   shift:"Morning 07:00–15:00", gender:"M" },
];export const staffAll = () => STAFF;
export const staffRecord = (name: string) => STAFF.find(s => s.name === name);
/** At work today: not on leave, inactive or gone. Only they sign off or approve. */
export const atWork = (name: string) => staffRecord(name)?.status === "Active";
export const isEmployed = (name: string) => { const s = staffRecord(name); return !!s && s.status !== "Left"; };

// Starting levels are read once from today's job titles; from then on the level is what counts, not the title.
for (const s of STAFF) s.level ??= /manager/i.test(s.role) ? "Manager" : /supervisor|team lead/i.test(s.role) ? "Supervisor" : "Staff";
export const levelOf = (name: string): Level => staffRecord(name)?.level ?? "Staff";
/** Supervisors and managers of a department who are at work: they sign off its requests. */
export const leadsOf = (dept: string) => STAFF.filter(s => s.dept === dept && s.status === "Active" && s.level !== "Staff").map(s => s.name);
/** Who may change a person's level, job title or what they can open: HR and hotel managers for anyone; a department's
 *  manager for staff and supervisors in their own department; nobody for themselves. Returns why not, or null. */
export const whyNotManage = (by: string, byRole: string, target: string): string | null => {
  const t = staffRecord(target), me = staffRecord(by);
  if (!t || t.status === "Left") return "That person is not on the staff list.";
  if (by === target) return "Nobody changes their own level, title or access.";
  if (byRole === "MGT" || me?.dept === "HR") return null;
  if (me?.level === "Manager" && me.dept === t.dept) return t.level === "Manager" ? "Only HR changes a manager." : null;
  return "Only HR or this department's manager can change this.";
};
export const whyNotSetLevel = (by: string, byRole: string, target: string, level: Level): string | null =>
  whyNotManage(by, byRole, target) ?? (level === "Manager" && byRole !== "MGT" && staffRecord(by)?.dept !== "HR" ? "Only HR makes someone a manager." : null);
export const setJobTitle = (by: string, byRole: string, target: string, title: string) => {
  const why = whyNotManage(by, byRole, target); if (why) return why;
  const t = title.trim(); if (t.length < 2 || t.length > 60) return "Write a job title of 2 to 60 characters.";
  staffRecord(target)!.role = t; return null;
};
/** Screens in their own menus this person may not open. Hotel managers open everything. */
export const setBlocked = (by: string, byRole: string, target: string, screens: string[]) => {
  const why = whyNotManage(by, byRole, target); if (why) return why;
  staffRecord(target)!.blocked = [...new Set(screens)]; return null;
};
// shortcut: only the web app checks this; the backend must refuse a closed screen's data the same way (build plan, "Backend").
export const canOpen = (name: string, role: string, screen: string) => role === "MGT" || !staffRecord(name)?.blocked?.includes(screen);
export const setLevel = (by: string, byRole: string, target: string, level: Level) => {
  const why = whyNotSetLevel(by, byRole, target, level); if (why) return why;
  Object.assign(staffRecord(target)!, { level, levelSetBy: by }); return null;
};
