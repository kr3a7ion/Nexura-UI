export type RestaurantQueueItem = {
  id: string;
  branch: "Abuja" | "Lagos";
  outlet: string;
  table: string;
  guest: string;
  order: string;
  server: string;
  elapsed: string;
  total: number;
  status: "New" | "Preparing" | "Ready" | "Payment due";
};

export type RestaurantException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "kitchen-display" | "room-charges" | "menu-management" | "cash-drawer";
  screenLabel: string;
};

export const RESTAURANT_KPIS = [
  { label: "Sales today", value: "₦1.84m", sub: "₦1.26m settled", delta: "+12.4%", deltaPositive: true },
  { label: "Open tables", value: "3", sub: "12 of 15 tables available", delta: "20% seated", deltaPositive: true },
  { label: "Average ticket", value: "₦27,650", sub: "Across 67 orders today", delta: "+₦2,400", deltaPositive: true },
  { label: "Room charges pending", value: "₦118,500", sub: "3 charges awaiting posting", delta: "1 overdue", deltaPositive: false },
] as const;

export const RESTAURANT_QUEUE: RestaurantQueueItem[] = [
  { id: "ORD-0842", branch: "Abuja", outlet: "Palm Restaurant", table: "T04", guest: "Chinedu Okafor", order: "Jollof rice, grilled chicken, zobo", server: "Biodun Adeyemi", elapsed: "08 min", total: 28500, status: "Preparing" },
  { id: "ORD-0845", branch: "Abuja", outlet: "Palm Restaurant", table: "T09", guest: "Aisha Bello", order: "Pepper soup, malt", server: "Esther James", elapsed: "14 min", total: 16200, status: "Ready" },
  { id: "ORD-0848", branch: "Abuja", outlet: "Room service", table: "R304", guest: "Ngozi Eze", order: "Club sandwich, fresh juice", server: "Samuel Musa", elapsed: "27 min", total: 24500, status: "Preparing" },
  { id: "ORD-0851", branch: "Lagos", outlet: "Lagoon Bar", table: "B07", guest: "Tunde Afolabi", order: "Suya platter, Chapman", server: "Kemi Balogun", elapsed: "03 min", total: 31800, status: "New" },
  { id: "ORD-0854", branch: "Abuja", outlet: "Palm Restaurant", table: "T02", guest: "Musa Ibrahim", order: "Egusi soup, pounded yam", server: "Biodun Adeyemi", elapsed: "36 min", total: 22000, status: "Payment due" },
  { id: "ORD-0858", branch: "Lagos", outlet: "Room service", table: "R507", guest: "Yetunde Balogun", order: "Breakfast tray, coffee", server: "Kemi Balogun", elapsed: "05 min", total: 19500, status: "New" },
];

export const RESTAURANT_EXCEPTIONS: RestaurantException[] = [
  { id: "FB-01", title: "Ticket over 20 minutes in kitchen", detail: "Order ORD-0848 for Room 304 has been in preparation for 27 minutes.", severity: "Critical", screen: "kitchen-display", screenLabel: "Kitchen Display" },
  { id: "FB-02", title: "Unposted room charge", detail: "₦24,500 charge for Room 304 is waiting for guest verification.", severity: "Warning", screen: "room-charges", screenLabel: "Guest Room Charges" },
  { id: "FB-03", title: "Cash drawer variance", detail: "Palm Restaurant till is ₦8,500 short at the 10:30 count.", severity: "Warning", screen: "cash-drawer", screenLabel: "Cash Drawer" },
  { id: "FB-04", title: "Item out of stock", detail: "Abuja kitchen has sold out of grilled croaker; Lagos has 12 portions.", severity: "Info", screen: "menu-management", screenLabel: "Menu Management" },
];
