export type AccessQueueItem = {
  id: string;
  holder: string;
  branch: "Abuja" | "Lagos";
  room: string;
  credential: "Key card" | "Mobile key" | "Guest PIN" | "Staff card";
  departure: string;
  revokeAt: string;
  status: "Due" | "Scheduled" | "Overdue";
};

export type AccessException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "room-access" | "key-card-log" | "door-lock-settings";
  screenLabel: string;
};

export const ACCESS_SECURITY_KPIS = [
  { label: "Active keys", value: "86", sub: "71 guest · 15 staff credentials", delta: "+9 today", deltaPositive: true },
  { label: "PINs expiring today", value: "12", sub: "9 guest · 3 service PINs", delta: "4 by noon", deltaPositive: false },
  { label: "Locks with low battery", value: "3", sub: "Rooms 218, 412 and 507", delta: "Below 15%", deltaPositive: false },
  { label: "Locks offline", value: "1", sub: "Lagos staff entrance", delta: "1h 14m", deltaPositive: false },
] as const;

export const ACCESS_QUEUE: AccessQueueItem[] = [
  { id: "ACC-2608-0841", holder: "Chinedu Okafor", branch: "Abuja", room: "304", credential: "Mobile key", departure: "Today · 11:00", revokeAt: "11:15", status: "Due" },
  { id: "ACC-2608-0838", holder: "Aisha Bello", branch: "Abuja", room: "218", credential: "Key card", departure: "Today · 11:30", revokeAt: "11:45", status: "Scheduled" },
  { id: "ACC-2608-0829", holder: "Ngozi Eze", branch: "Abuja", room: "412", credential: "Guest PIN", departure: "Today · 11:00", revokeAt: "11:00", status: "Overdue" },
  { id: "ACC-2608-0824", holder: "Musa Ibrahim", branch: "Abuja", room: "126", credential: "Key card", departure: "Today · 13:00", revokeAt: "13:15", status: "Scheduled" },
  { id: "ACC-2608-0816", holder: "Kemi Balogun", branch: "Lagos", room: "507", credential: "Key card", departure: "Today · 10:00", revokeAt: "10:15", status: "Overdue" },
  { id: "ACC-2608-0812", holder: "Tunde Afolabi", branch: "Lagos", room: "205", credential: "Guest PIN", departure: "Today · 14:00", revokeAt: "14:00", status: "Scheduled" },
];

export const ACCESS_EXCEPTIONS: AccessException[] = [
  { id: "SEC-01", title: "Failed access attempts", detail: "Three denied attempts at the Abuja staff entrance by card STF-019.", severity: "Warning", screen: "key-card-log", screenLabel: "Key Card Log" },
  { id: "SEC-02", title: "Lock offline longer than 1 hour", detail: "Lagos staff entrance has been offline for 1 hour 14 minutes.", severity: "Critical", screen: "door-lock-settings", screenLabel: "Door Lock Settings" },
  { id: "SEC-03", title: "Master key used", detail: "Master key MK-02 opened Room 412 at 09:38; security review required.", severity: "Info", screen: "key-card-log", screenLabel: "Key Card Log" },
  { id: "SEC-04", title: "Lost key card", detail: "Room 507 reported a lost card; ₦5,000 replacement fee is pending.", severity: "Warning", screen: "room-access", screenLabel: "Room Access Mgmt" },
];

export const ACCESS_GATEWAY = {
  status: "Connected",
  address: "lock-gateway.local",
  latency: "18 ms",
  lastSync: "9 seconds ago",
};
