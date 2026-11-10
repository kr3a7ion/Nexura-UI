export type FleetTrip = {
  id: string;
  branch: "Abuja" | "Lagos";
  guest: string;
  route: string;
  departure: string;
  vehicle: string;
  driver: string;
  status: "Requested" | "Dispatched" | "In transit" | "Completed";
};

export type FleetException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "vehicle-register" | "driver-roster" | "trip-detail" | "fuel-log";
  screenLabel: string;
};

export const FLEET_KPIS = [
  { label: "Trips today", value: "18", sub: "7 completed · 11 active", delta: "+4 vs avg", deltaPositive: true },
  { label: "Vehicles available", value: "9/12", sub: "2 in service · 1 dispatched", delta: "75% ready", deltaPositive: true },
  { label: "Drivers on duty", value: "8", sub: "6 assigned · 2 available", delta: "1 on break", deltaPositive: true },
  { label: "Fuel cost this week", value: "₦1.28m", sub: "1,146 litres logged", delta: "+8.4%", deltaPositive: false },
] as const;

export const FLEET_TRIPS: FleetTrip[] = [
  { id: "TRP-2608-061", branch: "Abuja", guest: "Chinedu Okafor", route: "Nnamdi Azikiwe Airport → Hotel", departure: "11:40", vehicle: "Toyota Hiace · ABJ-482-KN", driver: "Usman Bala", status: "In transit" },
  { id: "TRP-2608-064", branch: "Abuja", guest: "Aisha Bello", route: "Hotel → Transcorp Hilton", departure: "12:15", vehicle: "Toyota Camry · ABJ-116-LX", driver: "David Okon", status: "Dispatched" },
  { id: "TRP-2608-067", branch: "Lagos", guest: "Tunde Afolabi", route: "Murtala Muhammed Airport → Hotel", departure: "13:00", vehicle: "Toyota Hiace · LSR-804-YK", driver: "Kunle Adebayo", status: "Requested" },
  { id: "TRP-2608-069", branch: "Abuja", guest: "Ngozi Eze", route: "Hotel → Jabi Lake Mall", departure: "14:20", vehicle: "Honda Accord · ABJ-922-RM", driver: "Samuel Musa", status: "Dispatched" },
  { id: "TRP-2608-054", branch: "Lagos", guest: "Yetunde Balogun", route: "Hotel → Victoria Island", departure: "09:30", vehicle: "Toyota Corolla · LSR-441-GT", driver: "Femi Adeyemi", status: "Completed" },
  { id: "TRP-2608-072", branch: "Abuja", guest: "Musa Ibrahim", route: "Hotel → Abuja National Mosque", departure: "15:00", vehicle: "Unassigned", driver: "Unassigned", status: "Requested" },
];

export const FLEET_EXCEPTIONS: FleetException[] = [
  { id: "FLT-01", title: "Vehicle service due", detail: "Toyota Hiace ABJ-482-KN is 420 km beyond its service interval.", severity: "Warning", screen: "vehicle-register", screenLabel: "Vehicle Register" },
  { id: "FLT-02", title: "Driver licence expiring", detail: "Kunle Adebayo’s licence expires in 14 days; renewal is not recorded.", severity: "Warning", screen: "driver-roster", screenLabel: "Driver Roster" },
  { id: "FLT-03", title: "Trip without odometer end", detail: "TRP-2608-049 was completed 2 hours ago without a closing reading.", severity: "Critical", screen: "trip-detail", screenLabel: "Trip Detail" },
  { id: "FLT-04", title: "Fuel anomaly", detail: "Honda Accord ABJ-922-RM used ₦42,500 fuel, 31% above route baseline.", severity: "Critical", screen: "fuel-log", screenLabel: "Fuel Log" },
];
