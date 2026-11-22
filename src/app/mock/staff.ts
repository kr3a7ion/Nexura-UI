// The one staff list. HR owns it (Staff Directory); every department reads its people from here.
// Maintenance adds trade, team and role on top (mock/roster.ts); HR's leave lands on the roster (mock/leave.ts).
export type StaffStatus = "Active" | "On Leave" | "Inactive" | "Left";
export type StaffRecord = { id: string; name: string; role: string; dept: string; phone: string; email: string; empType: string; hireDate: string; status: StaffStatus; shift: string; gender: "M" | "F" };
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
];
export const staffAll = () => STAFF;
export const staffRecord = (name: string) => STAFF.find(s => s.name === name);
export const isEmployed = (name: string) => { const s = staffRecord(name); return !!s && s.status !== "Left"; };
