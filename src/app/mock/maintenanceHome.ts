export type MaintenanceException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "work-orders" | "asset-register" | "preventive-schedule" | "generator-diesel";
  screenLabel: string;
};

export const MAINTENANCE_EXCEPTIONS: MaintenanceException[] = [
  { id: "MX-01", title: "Overdue preventive maintenance", detail: "The central air conditioning service was due on 12 Jun.", severity: "Critical", screen: "preventive-schedule", screenLabel: "Planned Work" },
  { id: "MX-02", title: "Diesel below reserve", detail: "The main generator tank is at about 30%. A request for 200 L is waiting for approval.", severity: "Critical", screen: "generator-diesel", screenLabel: "Generator Diesel" },
  { id: "MX-03", title: "Vendor visit today", detail: "Otis Nigeria engineer arrives at 14:00 for the lift service.", severity: "Info", screen: "preventive-schedule", screenLabel: "Planned Work" },
  { id: "MX-04", title: "Repeat fault on same asset", detail: "The room 316 air conditioner has failed three times in 60 days.", severity: "Warning", screen: "asset-register", screenLabel: "Asset Register" },
];

export const MAINTENANCE_POWER = {
  runtimeToday: "6h 42m",
  dieselRemaining: "About 300 L (30%)",
  reserveDays: "About 3 days",
  lastGridOutage: "Today · 08:17–09:46",
};
