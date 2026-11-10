export type HousekeepingQueueItem = {
  room: string;
  branch: "Abuja" | "Lagos";
  roomType: string;
  status: "Dirty" | "In progress" | "Clean" | "Inspection due" | "DND";
  attendant: string;
  due: string;
  priority: "Urgent" | "High" | "Normal";
  arrival?: string;
  nextGuest?: string;
};

export type HousekeepingException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "dnd-log" | "lost-found" | "linen-supplies";
  screenLabel: string;
};

export const HOUSEKEEPING_KPIS = [
  { label: "Dirty rooms", value: "14", sub: "6 priority turnovers", delta: "-5 since 08:00", deltaPositive: true },
  { label: "In progress", value: "8", sub: "7 attendants on floor", delta: "42 min avg", deltaPositive: true },
  { label: "Awaiting inspection", value: "6", sub: "2 early-arrival rooms", delta: "1 overdue", deltaPositive: false },
  { label: "Ready", value: "26", sub: "Inspected and released", delta: "+11 today", deltaPositive: true },
] as const;

export const HOUSEKEEPING_QUEUE: HousekeepingQueueItem[] = [
  { room: "304", branch: "Abuja", roomType: "Executive King", status: "Dirty", attendant: "Unassigned", due: "11:00", priority: "Urgent", arrival: "Early arrival · 12:30", nextGuest: "Chinedu Okafor" },
  { room: "218", branch: "Abuja", roomType: "Deluxe Queen", status: "Dirty", attendant: "Unassigned", due: "11:30", priority: "Urgent", arrival: "Early arrival · 13:15", nextGuest: "Aisha Bello" },
  { room: "412", branch: "Abuja", roomType: "Executive Suite", status: "In progress", attendant: "Ifeoma Nwankwo", due: "12:45", priority: "High", arrival: "Arrival · 15:20", nextGuest: "Ngozi Eze" },
  { room: "126", branch: "Abuja", roomType: "Deluxe Twin", status: "Dirty", attendant: "Unassigned", due: "13:00", priority: "High", arrival: "Arrival · 16:10", nextGuest: "Musa Ibrahim" },
  { room: "205", branch: "Lagos", roomType: "Deluxe Queen", status: "Inspection due", attendant: "Grace Eze", due: "14:20", priority: "Normal", arrival: "Arrival · 17:30", nextGuest: "Yetunde Balogun" },
  { room: "507", branch: "Lagos", roomType: "Presidential Suite", status: "DND", attendant: "Bisi Ajayi", due: "15:00", priority: "Normal" },
];

export const HOUSEKEEPING_EXCEPTIONS: HousekeepingException[] = [
  { id: "HKX-01", title: "DND over 4 hours", detail: "Room 507 has shown Do Not Disturb for 4 hours 36 minutes; welfare check due.", severity: "Critical", screen: "dnd-log", screenLabel: "Do Not Disturb Log" },
  { id: "HKX-02", title: "Unclaimed lost-and-found items", detail: "Seven items from Abuja and Lagos have been unclaimed for more than 30 days.", severity: "Info", screen: "lost-found", screenLabel: "Lost & Found" },
  { id: "HKX-03", title: "Low linen stock", detail: "Abuja has 18 clean king sets against par of 30. Lagos transfer costs ₦185,000.", severity: "Warning", screen: "linen-supplies", screenLabel: "Linen & Supplies" },
];
