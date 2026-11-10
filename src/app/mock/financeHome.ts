export type FinanceQueueItem = {
  id: string;
  branch: "Abuja" | "Lagos";
  guest: string;
  room: string;
  departure: string;
  balance: number;
  age: string;
  status: "Departed" | "Departing" | "Overdue";
};

export type FinanceException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "night-audit" | "folio-void" | "refund-processing" | "cash-drawer";
  screenLabel: string;
};

export const FINANCE_KPIS = [
  { label: "Revenue today", value: "₦8.42m", sub: "Rooms ₦6.18m · F&B ₦1.84m", delta: "+9.6%", deltaPositive: true },
  { label: "Outstanding balances", value: "₦1.26m", sub: "14 departed or departing folios", delta: "3 overdue", deltaPositive: false },
  { label: "Night audit status", value: "Not started", sub: "Cutoff 23:00 · 4 blockers", delta: "12h 06m", deltaPositive: false },
  { label: "Payment split", value: "₦2.1m / ₦3.0m / ₦3.3m", sub: "Cash / transfer / POS", delta: "₦8.42m total", deltaPositive: true },
] as const;

export const FINANCE_QUEUE: FinanceQueueItem[] = [
  { id: "FOL-2608-091", branch: "Abuja", guest: "Chinedu Okafor", room: "304", departure: "Today · 11:00", balance: 185000, age: "42 min", status: "Departed" },
  { id: "FOL-2608-094", branch: "Abuja", guest: "Aisha Bello", room: "218", departure: "Today · 12:00", balance: 92000, age: "18 min", status: "Departing" },
  { id: "FOL-2608-097", branch: "Lagos", guest: "Tunde Afolabi", room: "508", departure: "Today · 10:00", balance: 485000, age: "1h 24m", status: "Overdue" },
  { id: "FOL-2608-101", branch: "Abuja", guest: "Ngozi Eze", room: "412", departure: "Today · 13:00", balance: 268000, age: "12 min", status: "Departing" },
  { id: "FOL-2608-104", branch: "Lagos", guest: "Yetunde Balogun", room: "507", departure: "Yesterday · 11:00", balance: 186500, age: "23h", status: "Overdue" },
  { id: "FOL-2608-108", branch: "Abuja", guest: "Musa Ibrahim", room: "126", departure: "Today · 14:00", balance: 43500, age: "8 min", status: "Departing" },
];

export const FINANCE_EXCEPTIONS: FinanceException[] = [
  { id: "FNX-01", title: "Night audit not started after cutoff", detail: "The Abuja audit has not started 16 minutes after the configured cutoff.", severity: "Critical", screen: "night-audit", screenLabel: "Night Audit" },
  { id: "FNX-02", title: "Folio void awaiting approval", detail: "₦74,500 Room 507 charge reversal is waiting for manager approval.", severity: "Warning", screen: "folio-void", screenLabel: "Folio Void & Reversal" },
  { id: "FNX-03", title: "Refund pending", detail: "Lagos refund RF-2608-018 for ₦186,500 has waited 27 hours.", severity: "Warning", screen: "refund-processing", screenLabel: "Refund Processing" },
  { id: "FNX-04", title: "Unreconciled cash drawer", detail: "Palm Restaurant till is ₦8,500 short against the POS close.", severity: "Critical", screen: "cash-drawer", screenLabel: "Cash Drawer" },
];
