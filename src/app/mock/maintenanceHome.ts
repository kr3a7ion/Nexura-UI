export type MaintenanceQueueItem = {
  id: string;
  branch: "Abuja" | "Lagos";
  room: string;
  asset: string;
  issue: string;
  assignee: string;
  age: string;
  priority: "Critical" | "High" | "Medium";
  status: "Reported" | "Assigned" | "In progress" | "Awaiting parts";
};

export type MaintenanceException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "work-orders" | "asset-register" | "preventive-schedule" | "generator-diesel";
  screenLabel: string;
};

export const MAINTENANCE_KPIS = [
  { label: "Open work orders", value: "18", sub: "9 guest rooms · 9 common areas", delta: "-4 today", deltaPositive: true },
  { label: "Overdue", value: "4", sub: "2 critical · 2 high priority", delta: "+1 today", deltaPositive: false },
  { label: "Rooms out of order", value: "2", sub: "Rooms 219 and 508", delta: "₦184k risk", deltaPositive: false },
  { label: "Generator diesel level", value: "22%", sub: "1,860 L · 2.4 days reserve", delta: "Below reserve", deltaPositive: false },
] as const;

export const MAINTENANCE_QUEUE: MaintenanceQueueItem[] = [
  { id: "WO-2608-0418", branch: "Abuja", room: "Room 219", asset: "Shower mixer · PL-219-02", issue: "Leaking into vanity", assignee: "Emeka Obi", age: "2h 18m", priority: "Critical", status: "In progress" },
  { id: "WO-2608-0424", branch: "Lagos", room: "Room 508", asset: "Split AC · HVAC-508", issue: "Compressor trips after ten minutes", assignee: "Segun Adewale", age: "1h 46m", priority: "Critical", status: "Awaiting parts" },
  { id: "WO-2608-0426", branch: "Abuja", room: "Generator house", asset: "Generator B · GEN-02", issue: "Coolant temperature alert", assignee: "Emeka Obi", age: "58m", priority: "High", status: "In progress" },
  { id: "WO-2608-0421", branch: "Abuja", room: "Main lobby", asset: "Downlight circuit · EL-LBY-04", issue: "Two ceiling lights flickering", assignee: "Ibrahim Sani", age: "44m", priority: "High", status: "Assigned" },
  { id: "WO-2608-0429", branch: "Abuja", room: "Room 412", asset: "Wardrobe · FF-412-01", issue: "Hinge loose before arrival", assignee: "Chuka Nwosu", age: "31m", priority: "Medium", status: "Assigned" },
  { id: "WO-2608-0432", branch: "Lagos", room: "Restaurant", asset: "Handwash basin · PL-RST-03", issue: "Drain runs slowly", assignee: "Unassigned", age: "19m", priority: "Medium", status: "Reported" },
];

export const MAINTENANCE_EXCEPTIONS: MaintenanceException[] = [
  { id: "MX-01", title: "Overdue preventive maintenance", detail: "Passenger Lift 2 quarterly service was due yesterday.", severity: "Critical", screen: "preventive-schedule", screenLabel: "Preventive Schedule" },
  { id: "MX-02", title: "Diesel below reserve", detail: "Abuja tank is at 22%; 2,500 L replenishment estimated at ₦3,275,000.", severity: "Critical", screen: "generator-diesel", screenLabel: "Generator Diesel" },
  { id: "MX-03", title: "Vendor visit today", detail: "CoolAir Lagos technician arrives at 14:00 for Room 508 compressor.", severity: "Info", screen: "work-orders", screenLabel: "Work Orders" },
  { id: "MX-04", title: "Repeat fault on same asset", detail: "Room 219 shower mixer has failed three times in 60 days.", severity: "Warning", screen: "asset-register", screenLabel: "Asset Register" },
];

export const MAINTENANCE_POWER = {
  runtimeToday: "6h 42m",
  dieselRemaining: "1,860 L",
  reserveDays: "2.4 days",
  lastGridOutage: "Today · 08:17–09:46",
};
