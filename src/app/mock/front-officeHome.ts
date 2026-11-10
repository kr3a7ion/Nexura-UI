export type FrontOfficeQueueItem = {
  id: string;
  guest: string;
  city: string;
  eta: string;
  roomType: string;
  depositStatus: "Paid" | "Partial" | "Unpaid";
  roomReady: "Ready" | "Cleaning" | "Not assigned" | "Inspection due";
  vip?: boolean;
};

export type FrontOfficeException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "room-assignment" | "reservation-detail" | "check-in" | "folio";
  screenLabel: string;
  navParam?: string;
};

export const FRONT_OFFICE_KPIS = [
  { label: "Arrivals today", value: "12", sub: "7 rooms already assigned", delta: "3 VIP", deltaPositive: true },
  { label: "Departures today", value: "9", sub: "4 check-outs completed", delta: "5 due", deltaPositive: true },
  { label: "In-house guests", value: "104", sub: "96 occupied rooms", delta: "+8 today", deltaPositive: true },
  { label: "Occupancy", value: "78%", sub: "96 of 123 rooms occupied", delta: "+4.2%", deltaPositive: true },
] as const;

export const FRONT_OFFICE_QUEUE: FrontOfficeQueueItem[] = [
  { id: "RES-2608-0142", guest: "Chinedu Okafor", city: "Lagos", eta: "12:30", roomType: "Executive King", depositStatus: "Paid", roomReady: "Cleaning", vip: true },
  { id: "RES-2608-0148", guest: "Aisha Bello", city: "Abuja", eta: "13:15", roomType: "Deluxe Queen", depositStatus: "Paid", roomReady: "Ready" },
  { id: "RES-2608-0151", guest: "Tobi Adeyemi", city: "Lagos", eta: "14:00", roomType: "Standard King", depositStatus: "Unpaid", roomReady: "Not assigned" },
  { id: "RES-2608-0155", guest: "Ngozi Eze", city: "Enugu", eta: "15:20", roomType: "Executive Suite", depositStatus: "Partial", roomReady: "Inspection due" },
  { id: "RES-2608-0159", guest: "Musa Ibrahim", city: "Kano", eta: "16:10", roomType: "Deluxe Twin", depositStatus: "Paid", roomReady: "Ready" },
  { id: "RES-2608-0162", guest: "Yetunde Balogun", city: "Lagos", eta: "17:30", roomType: "Deluxe Queen", depositStatus: "Paid", roomReady: "Ready" },
];

export const FRONT_OFFICE_EXCEPTIONS: FrontOfficeException[] = [
  { id: "EX-01", title: "VIP arrival · room not ready", detail: "Chinedu Okafor arrives at 12:30; Executive King is still being cleaned.", severity: "Critical", screen: "room-assignment", screenLabel: "Room Assignment" },
  { id: "EX-02", title: "Unpaid deposit", detail: "Tobi Adeyemi has no deposit against reservation RES-2608-0151.", severity: "Warning", screen: "reservation-detail", screenLabel: "Reservation Detail", navParam: "RES-2608-0151" },
  { id: "EX-03", title: "Overstay", detail: "Room 507 has not checked out 64 minutes after the scheduled departure.", severity: "Warning", screen: "folio", screenLabel: "Folio Management" },
  { id: "EX-04", title: "Double-booking risk", detail: "Two reservations are competing for the final Deluxe Queen tonight.", severity: "Critical", screen: "room-assignment", screenLabel: "Room Assignment" },
];
