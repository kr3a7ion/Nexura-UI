export type RosterItem = {
  id: string;
  name: string;
  branch: "Abuja" | "Lagos";
  department: string;
  role: string;
  shift: string;
  clockIn: string;
  status: "On time" | "Late" | "Absent" | "Not started";
};

export type HrException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "attendance" | "shift-scheduler" | "staff-directory" | "payroll";
  screenLabel: string;
};

export const HR_KPIS = [
  { label: "Staff on shift now", value: "68", sub: "Abuja 42 · Lagos 26", delta: "91% staffed", deltaPositive: true },
  { label: "Absent today", value: "4", sub: "2 notified · 2 no-show", delta: "+1 vs avg", deltaPositive: false },
  { label: "Pending leave requests", value: "7", sub: "3 require action today", delta: "2 urgent", deltaPositive: false },
  { label: "Payroll cycle status", value: "Review", sub: "August payroll · 84% complete", delta: "5 days left", deltaPositive: true },
] as const;

export const TODAY_ROSTER: RosterItem[] = [
  { id: "STF-014", name: "Chioma Nwosu", branch: "Abuja", department: "Front Office", role: "Front Desk Agent", shift: "07:00–15:00", clockIn: "06:52", status: "On time" },
  { id: "STF-022", name: "Fatima Musa", branch: "Abuja", department: "Housekeeping", role: "Room Attendant", shift: "07:00–15:00", clockIn: "07:18", status: "Late" },
  { id: "STF-008", name: "Emeka Obi", branch: "Abuja", department: "Maintenance", role: "Engineer", shift: "08:00–16:00", clockIn: "07:56", status: "On time" },
  { id: "STF-019", name: "Biodun Adeyemi", branch: "Abuja", department: "Restaurant", role: "Waiter", shift: "10:00–18:00", clockIn: "09:48", status: "On time" },
  { id: "STF-031", name: "Kemi Balogun", branch: "Lagos", department: "Restaurant", role: "Outlet Supervisor", shift: "10:00–18:00", clockIn: "—", status: "Absent" },
  { id: "STF-027", name: "Ifeoma Nwankwo", branch: "Lagos", department: "Housekeeping", role: "Floor Supervisor", shift: "15:00–23:00", clockIn: "—", status: "Not started" },
  { id: "STF-011", name: "Ngozi Eze", branch: "Abuja", department: "Finance", role: "Accountant", shift: "08:00–17:00", clockIn: "08:03", status: "On time" },
];

export const HR_EXCEPTIONS: HrException[] = [
  { id: "HRX-01", title: "Late clock-ins", detail: "Four Abuja staff arrived more than 15 minutes after shift start.", severity: "Warning", screen: "attendance", screenLabel: "Attendance" },
  { id: "HRX-02", title: "Unfilled shift", detail: "Lagos night auditor shift from 23:00 has no assigned staff member.", severity: "Critical", screen: "shift-scheduler", screenLabel: "Shift Scheduler" },
  { id: "HRX-03", title: "Expiring contract", detail: "Chuka Nwosu’s engineering contract expires in 12 days.", severity: "Info", screen: "staff-directory", screenLabel: "Staff Directory" },
  { id: "HRX-04", title: "Overtime above limit", detail: "Restaurant team is 18 hours above limit; estimated overtime is ₦82,500.", severity: "Warning", screen: "payroll", screenLabel: "Payroll Summary" },
];
