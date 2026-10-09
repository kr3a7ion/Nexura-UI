// ─────────────────────────────────────────────────────────────────────────────
// FLEET DATA SPINE  —  src/app/fleetData.ts
//
// One Vehicle, one Driver, one Trip, one odometer, one status vocabulary.
// Replaces the duplicated types and seed arrays currently living inside
// FleetScreens.tsx and FleetAssetsScreens.tsx.
//
// This file is ADDITIVE. Nothing imports it yet, so pasting it changes
// nothing visually and cannot break the build. Screens migrate one at a
// time in batches F1–F5.
//
// Depends only on ./constants (which imports only lucide-react) — no cycle.
// ─────────────────────────────────────────────────────────────────────────────

import { useSyncExternalStore } from "react";
import { PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, MUTED } from "./constants";

// ═══════════════════════════════════════════════════════════════════════════
// 1 · STORE PRIMITIVE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Minimal external store. Same idea as ShiftProposalStore, but with a
 * subscription so screens re-render on write instead of re-seeding
 * useState on every mount.
 *
 * IMPORTANT: read() must return a STABLE reference between writes.
 * Never return a fresh copy here — useSyncExternalStore will loop forever.
 * Writes replace the array; reads hand back whatever the current one is.
 */
function createStore<T>(seed: T[]) {
  let items: T[] = seed;
  const listeners = new Set<() => void>();

  return {
    read: () => items,
    write: (next: T[]) => {
      items = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => { listeners.delete(l); };
    },
  };
}

/** Sequential ids that look like the seed data: nextId("TRP", 4) → "TRP-0042" */
const counters: Record<string, number> = {};
function nextId(prefix: string, pad: number, startAt: number): string {
  if (counters[prefix] === undefined) counters[prefix] = startAt;
  return `${prefix}-${String(counters[prefix]++).padStart(pad, "0")}`;
}

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const stamp = () => new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

// ═══════════════════════════════════════════════════════════════════════════
// 2 · VOCABULARIES  —  each status word is defined exactly once
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trip lifecycle. Two members the old code was missing:
 *   pending-approval — where a department request waits for its supervisor
 *   (the dept form already promises this; there was nowhere for it to go)
 *   cancelled        — was in the type, was counted in KPIs, was never settable
 */
export type TripStatus =
  | "pending-approval"
  | "requested"
  | "assigned"
  | "dispatched"
  | "en-route"
  | "in-transit"
  | "completed"
  | "cancelled";

/**
 * The forward path a trip takes. BOARD_COLUMNS is derived from it, so a
 * status can never exist in the flow but not on the board — that mismatch
 * is what made "in-transit" a trap that swallowed cards.
 */
export const TRIP_FLOW: readonly TripStatus[] = [
  "pending-approval", "requested", "assigned", "dispatched", "en-route", "in-transit", "completed",
] as const;

/** Every column the Dispatch Board renders. Cancelled lives in a filter, not a column. */
export const BOARD_COLUMNS: readonly TripStatus[] = TRIP_FLOW;

export function nextTripStatus(s: TripStatus): TripStatus | null {
  const i = TRIP_FLOW.indexOf(s);
  if (i < 0 || i >= TRIP_FLOW.length - 1) return null;
  return TRIP_FLOW[i + 1];
}

export type ServiceLine = "Airport Transfer" | "Charter" | "Hotel Transport" | "Staff & Logistics";
export type ChargeType = "folio" | "complimentary" | "cost-centre" | "cash";
export type Priority = "Normal" | "Urgent" | "Emergency";
export type CancelReason =
  | "Guest cancelled" | "Guest no-show" | "Flight changed"
  | "No vehicle available" | "No driver available"
  | "Vehicle breakdown" | "Duplicate request" | "Other";

/**
 * ONE vehicle status vocabulary, split into the two things the old code
 * was conflating:
 *   lifecycle    — stored. Set on the Vehicle Register. Is this vehicle in service?
 *   availability — DERIVED. Never stored. Can it take a trip right now?
 *
 * This is the fix for the register and the board disagreeing: the board no
 * longer holds its own opinion, it computes one.
 */
export type VehicleLifecycle = "active" | "maintenance" | "off-road" | "decommissioned";
export type VehicleAvailability = "available" | "on-trip" | "unavailable";
export type VehicleOwnership = "owned" | "leased" | "contractor";
export type VehicleType = "Saloon" | "SUV" | "Van" | "Bus" | "Pickup";
export type FuelType = "Petrol" | "Diesel" | "Hybrid";

export type DocStatus = "valid" | "expiring-soon" | "expired";
export type DriverStatus = "available" | "on-trip" | "off-duty" | "suspended";
export type HRShift = "Morning" | "Evening" | "Night" | "Off";
export type FuelEntryType = "fill" | "drain" | "transfer" | "adjustment";

// ═══════════════════════════════════════════════════════════════════════════
// 3 · PRESENTATION META  —  one map per vocabulary, replacing six pill
//     implementations spread across the two fleet files
// ═══════════════════════════════════════════════════════════════════════════

export interface Pill { bg: string; text: string; label: string }

export const TRIP_STATUS_META: Record<TripStatus, Pill> = {
  "pending-approval": { bg: "#EDE9FE", text: "#5B21B6", label: "Pending Approval" },
  requested:          { bg: "#EFF6FF", text: "#1D4ED8", label: "Requested"        },
  assigned:           { bg: "#FEF3C7", text: "#92400E", label: "Assigned"         },
  dispatched:         { bg: "#FEF9C3", text: "#713F12", label: "Dispatched"       },
  "en-route":         { bg: "#DCFCE7", text: "#166534", label: "En Route"         },
  "in-transit":       { bg: "#D1FAE5", text: "#065F46", label: "In Transit"       },
  completed:          { bg: "#F1F5F9", text: "#475569", label: "Completed"        },
  cancelled:          { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled"        },
};

export const VEHICLE_AVAILABILITY_META: Record<VehicleAvailability, Pill> = {
  available:   { bg: "#DCFCE7", text: "#166534", label: "Available"   },
  "on-trip":   { bg: "#FEF3C7", text: "#92400E", label: "On Trip"     },
  unavailable: { bg: "#FEE2E2", text: "#991B1B", label: "Unavailable" },
};

export const VEHICLE_LIFECYCLE_META: Record<VehicleLifecycle, Pill> = {
  active:         { bg: "#DCFCE7", text: "#166534", label: "Active"         },
  maintenance:    { bg: "#FEF3C7", text: "#92400E", label: "Maintenance"    },
  "off-road":     { bg: "#FEE2E2", text: "#991B1B", label: "Off Road"       },
  decommissioned: { bg: "#F1F5F9", text: "#475569", label: "Decommissioned" },
};

export const DRIVER_STATUS_META: Record<DriverStatus, Pill> = {
  available:  { bg: "#DCFCE7", text: "#166534", label: "Available" },
  "on-trip":  { bg: "#FEF3C7", text: "#92400E", label: "On Trip"   },
  "off-duty": { bg: "#F1F5F9", text: "#64748B", label: "Off Duty"  },
  suspended:  { bg: "#FEE2E2", text: "#991B1B", label: "Suspended" },
};

export const DOC_STATUS_META: Record<DocStatus, Pill> = {
  valid:            { bg: "#DCFCE7", text: "#166534", label: "Valid"    },
  "expiring-soon":  { bg: "#FEF3C7", text: "#92400E", label: "Expiring" },
  expired:          { bg: "#FEE2E2", text: "#991B1B", label: "Expired"  },
};

export const SHIFT_META: Record<HRShift, Pill> = {
  Morning: { bg: "#DCFCE7", text: "#166534", label: "Morning" },
  Evening: { bg: "#DBEAFE", text: "#1E40AF", label: "Evening" },
  Night:   { bg: "#EDE9FE", text: "#6D28D9", label: "Night"   },
  Off:     { bg: "#F3F4F6", text: "#71717A", label: "Off"     },
};

export const SERVICE_LINE_COLOR: Record<ServiceLine, string> = {
  "Airport Transfer":  PRIMARY,
  "Charter":           TEAL,
  "Hotel Transport":   ORANGE,
  "Staff & Logistics": SUCCESS,
};

export const PRIORITY_META: Record<Priority, { bg: string; border: string; text: string }> = {
  Normal:    { bg: "#F1F5F9", border: "#E2E8F0", text: MUTED  },
  Urgent:    { bg: "#FFF7ED", border: "#FED7AA", text: ORANGE },
  Emergency: { bg: "#FEF2F2", border: "#FECACA", text: ERROR  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 4 · ENTITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface VehicleDoc {
  type: "Vehicle Licence" | "Insurance" | "Roadworthiness" | "Hackney Permit" | "Proof of Ownership";
  ref: string;
  issuer: string;
  issued: string;
  expires: string;          // "N/A" for documents that don't expire
  daysLeft: number;         // 9999 = non-expiring
  hasAttachment: boolean;
  reminderDays?: number;    // renewal reminder lead time, set on Vehicle Detail
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  seats: number;
  ownership: VehicleOwnership;
  lifecycle: VehicleLifecycle;

  /** SINGLE source of truth for distance. Trips and fuel entries feed it, never fork it. */
  odometer: number;

  fuelType: FuelType;
  tankCapacityL: number;      // was a hardcoded plate→litres ternary in FuelLog
  baselineL100km: number;     // for consumption variance and anomaly flags
  nextServiceKm: number;
  nextServiceDate: string;    // "OVERDUE" when past due
  assignedDriverId?: string;
  utilPct: number;
  docs: VehicleDoc[];
  contractor?: string;        // set when ownership === "contractor"
}

export interface Driver {
  id: string;
  name: string;
  hrEmpId?: string;
  licNo: string;
  licClass: string;
  licExpiry: string;
  licDaysLeft: number;
  medExpiry: string;
  medDaysLeft: number;
  permitRef: string;
  vehicleId?: string;
  onDuty: boolean;
  shiftOverride?: boolean;
  hrShift: HRShift;
  status: DriverStatus;
  suspensionReason?: string;
  tripsToday: number;
  tripsMonth: number;
  totalKm: number;
  avgRating: number;
  incidents: number;
}

export interface TripStop {
  id: string;
  time: string;
  location: string;
  durationMin: number;
  purpose: string;
  leg: "outbound" | "return";
}

export interface Trip {
  id: string;
  serviceLine: ServiceLine;
  status: TripStatus;
  priority: Priority;

  // Requester — a guest OR a department, never both
  guest?: string;
  reservationRef?: string;
  dept?: string;
  requestedBy?: string;
  supervisor?: string;

  pickup: string;
  dropoff: string;
  scheduledTime: string;       // "14:30"
  scheduledDate: string;       // "20 Aug 2025"
  createdAt: string;           // display string
  createdAtMs: number;         // for queue ageing — the old createdAt string could never be compared

  vehicleId?: string;
  driverId?: string;
  pax: number;
  luggage?: number;
  flight?: string;
  terminal?: "International" | "Domestic";

  tripMode: "one-way" | "round-trip";
  odomStart?: number;
  odomEnd?: number;
  waitMinutes?: number;
  stops: TripStop[];

  chargeType: ChargeType;
  costCentre?: string;
  quotedFare: number;
  finalFare?: number;
  waitingSurcharge?: number;
  folioRef?: string;
  postedToFolio?: boolean;

  rating?: number;
  feedback?: string;
  notes?: string;
  cancelReason?: CancelReason;
  cancelNote?: string;
  events: TripEvent[];         // was a hardcoded array in TripDetail
}

export interface TripEvent {
  time: string;
  event: string;
  actor: string;
  note?: string;
}

export interface FuelEntry {
  id: string;
  date: string;
  vehicleId: string;
  driverId?: string;
  type: FuelEntryType;
  litres: number;
  unitPrice: number;
  total: number;
  odomBefore: number;          // reading at the PREVIOUS fill
  odomAfter: number;           // reading at THIS fill
  station: string;
  paymentMethod: "Corporate Card" | "Cash" | "Bank Transfer" | "Internal";
  receiptRef: string;
  recordedBy: string;
}

export interface Generator {
  id: string;
  name: string;
  kva: number;
  location: string;
  runtimeHours: number;
  tankCapacityL: number;
  status: "running" | "standby" | "maintenance";
  nextServiceHrs: number;
  baselineLPerHr: number;
  assetTag?: string;           // links to ASSETS in constants.ts — one generator, two registers
}

export interface DieselEntry {
  id: string;
  date: string;
  generatorId: string;
  litres: number;
  unitPrice: number;
  total: number;
  runtimeHoursAtFill: number;
  prevRuntimeHours: number;    // makes L/hr computable instead of pre-written
  supplier: string;
  recordedBy: string;
}

export interface TripLog {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
  purpose: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime?: string;
  odomStart: number;
  odomEnd?: number;
  distanceKm?: number;
  passengers: number;
  fuelFilled?: number;
  stops: TripStop[];
  notes: string;
  status: "active" | "completed";
  synced: boolean;
  tripMode: "one-way" | "round-trip";
  returnStarted: boolean;
  tripId?: string;             // ties a logbook entry to its dispatch trip
}

// ═══════════════════════════════════════════════════════════════════════════
// 5 · SEED DATA
// ═══════════════════════════════════════════════════════════════════════════

const DAY = 86_400_000;
const MINS_AGO = (m: number) => Date.now() - m * 60_000;

const VEHICLE_SEED: Vehicle[] = [
  {
    id: "ABJ-001E", plate: "ABJ 123 XA", make: "Toyota", model: "Camry", year: 2021,
    type: "Saloon", seats: 5, ownership: "owned", lifecycle: "active",
    odometer: 47_963, fuelType: "Petrol", tankCapacityL: 65, baselineL100km: 8.5,
    nextServiceKm: 50_000, nextServiceDate: "15 Nov 2025",
    assignedDriverId: "DRV-001", utilPct: 78,
    docs: [
      { type: "Vehicle Licence",    ref: "FCT/VL/2025/04821",  issuer: "FCTA",         issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  hasAttachment: true  },
      { type: "Insurance",          ref: "AIG/COM/2025/78431", issuer: "AIG Nigeria",  issued: "01 Mar 2025", expires: "28 Feb 2026", daysLeft: 192,  hasAttachment: true  },
      { type: "Roadworthiness",     ref: "NIG/RW/2025/10029",  issuer: "VIO",          issued: "10 Jan 2025", expires: "09 Jan 2026", daysLeft: 142,  hasAttachment: true  },
      { type: "Hackney Permit",     ref: "FCT/HP/2025/00912",  issuer: "FCTA",         issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  hasAttachment: false },
      { type: "Proof of Ownership", ref: "CMR/2021/09842",     issuer: "FRN",          issued: "15 May 2021", expires: "N/A",         daysLeft: 9999, hasAttachment: true  },
    ],
  },
  {
    id: "ABJ-002E", plate: "ABJ 456 YB", make: "Toyota", model: "HiAce", year: 2019,
    type: "Van", seats: 14, ownership: "owned", lifecycle: "active",
    odometer: 98_210, fuelType: "Diesel", tankCapacityL: 100, baselineL100km: 12.0,
    nextServiceKm: 100_000, nextServiceDate: "01 Oct 2025",
    assignedDriverId: "DRV-002", utilPct: 62,
    docs: [
      { type: "Vehicle Licence",    ref: "FCT/VL/2025/04822",  issuer: "FCTA",        issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  hasAttachment: true  },
      { type: "Insurance",          ref: "AIG/COM/2024/65201", issuer: "AIG Nigeria", issued: "01 Oct 2024", expires: "30 Sep 2025", daysLeft: 41,   hasAttachment: true  },
      { type: "Roadworthiness",     ref: "NIG/RW/2024/08801",  issuer: "VIO",         issued: "10 Sep 2024", expires: "09 Sep 2025", daysLeft: 20,   hasAttachment: true  },
      { type: "Hackney Permit",     ref: "FCT/HP/2025/00913",  issuer: "FCTA",        issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  hasAttachment: true  },
      { type: "Proof of Ownership", ref: "CMR/2019/04521",     issuer: "FRN",         issued: "03 Mar 2019", expires: "N/A",         daysLeft: 9999, hasAttachment: true  },
    ],
  },
  {
    id: "ABJ-003V", plate: "ABJ 789 ZC", make: "Toyota", model: "Land Cruiser", year: 2022,
    type: "SUV", seats: 7, ownership: "leased", lifecycle: "active",
    odometer: 31_480, fuelType: "Diesel", tankCapacityL: 90, baselineL100km: 12.0,
    nextServiceKm: 35_000, nextServiceDate: "20 Nov 2025",
    assignedDriverId: "DRV-003", utilPct: 55,
    docs: [
      { type: "Vehicle Licence",    ref: "FCT/VL/2025/04823",   issuer: "FCTA",    issued: "01 Jan 2025", expires: "31 Dec 2025", daysLeft: 133,  hasAttachment: true },
      { type: "Insurance",          ref: "AIICO/2025/44120",    issuer: "AIICO",   issued: "01 May 2025", expires: "30 Apr 2026", daysLeft: 252,  hasAttachment: true },
      { type: "Roadworthiness",     ref: "NIG/RW/2025/14100",   issuer: "VIO",     issued: "15 Mar 2025", expires: "14 Mar 2026", daysLeft: 206,  hasAttachment: true },
      { type: "Hackney Permit",     ref: "FCT/HP/2025/00914",   issuer: "FCTA",    issued: "01 Jun 2025", expires: "31 May 2026", daysLeft: 283,  hasAttachment: true },
      { type: "Proof of Ownership", ref: "LEASE/STANBIC/2022",  issuer: "Stanbic", issued: "01 Apr 2022", expires: "31 Mar 2027", daysLeft: 588,  hasAttachment: true },
    ],
  },
  {
    id: "ABJ-004V", plate: "ABJ 321 WD", make: "Mercedes", model: "Sprinter", year: 2018,
    type: "Bus", seats: 20, ownership: "owned", lifecycle: "maintenance",
    odometer: 214_850, fuelType: "Diesel", tankCapacityL: 150, baselineL100km: 16.0,
    nextServiceKm: 215_000, nextServiceDate: "OVERDUE",
    assignedDriverId: undefined, utilPct: 0,
    docs: [
      { type: "Vehicle Licence",    ref: "FCT/VL/2024/01821",  issuer: "FCTA",        issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, hasAttachment: true  },
      { type: "Insurance",          ref: "AIG/COM/2024/21009", issuer: "AIG Nigeria", issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, hasAttachment: true  },
      { type: "Roadworthiness",     ref: "NIG/RW/2024/00901",  issuer: "VIO",         issued: "10 Jan 2024", expires: "09 Jan 2025", daysLeft: -233, hasAttachment: true  },
      { type: "Hackney Permit",     ref: "FCT/HP/2024/00410",  issuer: "FCTA",        issued: "01 Jan 2024", expires: "31 Dec 2024", daysLeft: -133, hasAttachment: false },
      { type: "Proof of Ownership", ref: "CMR/2018/08811",     issuer: "FRN",         issued: "10 Oct 2018", expires: "N/A",         daysLeft: 9999, hasAttachment: true  },
    ],
  },
];

const DRIVER_SEED: Driver[] = [
  { id: "DRV-001", name: "Uche Obi",       hrEmpId: "EMP-020", licNo: "FCT/DL/2019/04821", licClass: "E", licExpiry: "15 Mar 2026", licDaysLeft: 162, medExpiry: "01 Jun 2025", medDaysLeft: -136, permitRef: "NIG/DP/22/4821", vehicleId: "ABJ-001E", onDuty: true,  hrShift: "Morning", status: "available", tripsToday: 2, tripsMonth: 48, totalKm: 14_820, avgRating: 4.9, incidents: 0 },
  { id: "DRV-002", name: "Emeka Eze",      hrEmpId: "EMP-021", licNo: "FCT/DL/2020/07114", licClass: "B", licExpiry: "03 Oct 2025", licDaysLeft: -11, medExpiry: "15 Apr 2026", medDaysLeft: 183,  permitRef: "NIG/DP/21/7114", vehicleId: "ABJ-002E", onDuty: true,  hrShift: "Morning", status: "on-trip",   tripsToday: 1, tripsMonth: 31, totalKm: 9_240,  avgRating: 4.7, incidents: 1 },
  { id: "DRV-003", name: "Musa Danladi",   hrEmpId: "EMP-022", licNo: "FCT/DL/2021/09302", licClass: "B", licExpiry: "20 Jul 2026", licDaysLeft: 289, medExpiry: "10 Jan 2026", medDaysLeft: 88,   permitRef: "NIG/DP/23/9302", vehicleId: "ABJ-003V", onDuty: true,  hrShift: "Evening", status: "on-trip",   tripsToday: 1, tripsMonth: 22, totalKm: 6_810,  avgRating: 4.6, incidents: 0 },
  { id: "DRV-004", name: "Blessing Okafor",hrEmpId: "EMP-023", licNo: "FCT/DL/2022/11540", licClass: "B", licExpiry: "18 Feb 2027", licDaysLeft: 497, medExpiry: "22 Mar 2026", medDaysLeft: 169,  permitRef: "NIG/DP/23/1154", vehicleId: undefined,  onDuty: false, hrShift: "Off",     status: "off-duty",  tripsToday: 0, tripsMonth: 14, totalKm: 4_120,  avgRating: 4.5, incidents: 0 },
];

const TRIP_SEED: Trip[] = [
  {
    id: "TRP-0041", serviceLine: "Airport Transfer", status: "requested", priority: "Normal",
    guest: "Dr. Chukwuemeka Bello", reservationRef: "BK-2849",
    pickup: "Grand Palms Abuja", dropoff: "Nnamdi Azikiwe Int'l Airport",
    scheduledTime: "14:30", scheduledDate: today(), createdAt: "Today 09:42", createdAtMs: MINS_AGO(48),
    pax: 2, luggage: 3, flight: "AA421", terminal: "International", tripMode: "one-way",
    stops: [], chargeType: "folio", quotedFare: 18_000, folioRef: "FOL-2019", events: [],
  },
  {
    id: "TRP-0040", serviceLine: "Airport Transfer", status: "assigned", priority: "Normal",
    guest: "Mrs. Ngozi Okonkwo", reservationRef: "BK-2850",
    pickup: "Nnamdi Azikiwe Int'l Airport", dropoff: "Grand Palms Abuja",
    scheduledTime: "12:15", scheduledDate: today(), createdAt: "Today 08:31", createdAtMs: MINS_AGO(119),
    vehicleId: "ABJ-001E", driverId: "DRV-001",
    pax: 1, luggage: 2, flight: "QR842", terminal: "International", tripMode: "one-way",
    stops: [], chargeType: "folio", quotedFare: 18_000, folioRef: "FOL-2014", events: [],
  },
  {
    id: "TRP-0039", serviceLine: "Charter", status: "dispatched", priority: "Urgent",
    guest: "Senator Adeyemi",
    pickup: "Grand Palms Abuja", dropoff: "Aso Rock (State House)",
    scheduledTime: "10:00", scheduledDate: today(), createdAt: "Today 07:55", createdAtMs: MINS_AGO(155),
    vehicleId: "ABJ-002E", driverId: "DRV-002",
    pax: 3, tripMode: "round-trip",
    stops: [], chargeType: "complimentary", quotedFare: 45_000, events: [],
  },
  {
    id: "TRP-0038", serviceLine: "Hotel Transport", status: "en-route", priority: "Normal",
    dept: "F&B", requestedBy: "Chukwudi Eze", supervisor: "Grace Mensah",
    pickup: "FreshMart Abuja", dropoff: "Grand Palms Abuja",
    scheduledTime: "09:30", scheduledDate: today(), createdAt: "Today 07:10", createdAtMs: MINS_AGO(200),
    vehicleId: "ABJ-003V", driverId: "DRV-003",
    pax: 1, tripMode: "round-trip", odomStart: 31_380,
    stops: [], chargeType: "cost-centre", costCentre: "FB-OPS-001", quotedFare: 8_500, events: [],
  },
  {
    id: "TRP-0037", serviceLine: "Airport Transfer", status: "completed", priority: "Normal",
    guest: "Adaeze Okonkwo-James", reservationRef: "BK-2847",
    pickup: "Nnamdi Azikiwe Int'l Airport", dropoff: "Grand Palms Abuja",
    scheduledTime: "07:00", scheduledDate: today(), createdAt: "Yesterday 22:10", createdAtMs: Date.now() - DAY,
    vehicleId: "ABJ-001E", driverId: "DRV-001",
    pax: 2, luggage: 2, flight: "ET902", terminal: "International", tripMode: "one-way",
    odomStart: 47_850, odomEnd: 47_963, waitMinutes: 25,
    stops: [{ id: "s1", time: "06:02", location: "Terminal 1 Arrival Hall", durationMin: 25, purpose: "Wait for flight ET902", leg: "outbound" }],
    chargeType: "folio", quotedFare: 18_000, finalFare: 20_500, waitingSurcharge: 2_500,
    folioRef: "FOL-2010", postedToFolio: true,
    rating: 4.8, feedback: "Excellent service, very punctual.",
    events: [
      { time: "22:10", event: "Trip created",             actor: "System",             note: "Auto-created from reservation BK-2847" },
      { time: "22:15", event: "Driver assigned",          actor: "Dispatch (Adaeze)",  note: "Uche Obi · ABJ 123 XA" },
      { time: "05:45", event: "Dispatched",               actor: "Uche Obi",           note: "En route to airport" },
      { time: "06:02", event: "Arrived at pickup",        actor: "Uche Obi",           note: "Wait started — flight ET902" },
      { time: "06:27", event: "Trip started",             actor: "Uche Obi",           note: "Odometer 47,850 km · Pax boarded" },
      { time: "07:11", event: "Completed",                actor: "Uche Obi",           note: "Odometer 47,963 km · Guests dropped off" },
      { time: "07:14", event: "Charge posted to folio",   actor: "System",             note: "₦20,500 → FOL-2010" },
    ],
  },
  {
    id: "TRP-0036", serviceLine: "Staff & Logistics", status: "pending-approval", priority: "Normal",
    dept: "Housekeeping", requestedBy: "Amaka Osei", supervisor: "Grace Mensah",
    pickup: "Lagos Linen Co.", dropoff: "Grand Palms Abuja",
    scheduledTime: "11:00", scheduledDate: today(), createdAt: "Today 09:58", createdAtMs: MINS_AGO(32),
    pax: 1, tripMode: "round-trip",
    stops: [], chargeType: "cost-centre", costCentre: "HK-OPS-001", quotedFare: 12_000,
    notes: "Linen pickup — 6 bundles. Loading bay access required.", events: [],
  },
];

// Fuel seed — odomBefore is the PREVIOUS fill's reading, so every interval
// computes. The old seed had odomBefore === odomAfter on every row, which is
// why the Consumption column could only ever render "—".
const FUEL_SEED: FuelEntry[] = [
  { id: "FL-0081", date: "20 Aug 09:14", vehicleId: "ABJ-001E", driverId: "DRV-001", type: "fill",  litres: 45, unitPrice: 1125, total: 50_625, odomBefore: 47_202, odomAfter: 47_730, station: "MRS Wuse II",    paymentMethod: "Corporate Card", receiptRef: "MRS-20250820-041", recordedBy: "Uche Obi"     },
  { id: "FL-0080", date: "19 Aug 07:30", vehicleId: "ABJ-002E", driverId: "DRV-002", type: "fill",  litres: 80, unitPrice: 1125, total: 90_000, odomBefore: 97_360, odomAfter: 97_800, station: "Ardova Garki",   paymentMethod: "Cash",           receiptRef: "AGA-20250819-098", recordedBy: "Emeka Eze"    },
  { id: "FL-0079", date: "18 Aug 14:22", vehicleId: "ABJ-003V", driverId: "DRV-003", type: "fill",  litres: 60, unitPrice: 1125, total: 67_500, odomBefore: 30_692, odomAfter: 31_200, station: "MRS Wuse II",    paymentMethod: "Corporate Card", receiptRef: "MRS-20250818-077", recordedBy: "Musa Danladi" },
  { id: "FL-0078", date: "17 Aug 11:05", vehicleId: "ABJ-001E", driverId: "DRV-001", type: "fill",  litres: 48, unitPrice: 1125, total: 54_000, odomBefore: 46_640, odomAfter: 47_202, station: "Conoil Maitama", paymentMethod: "Corporate Card", receiptRef: "CNL-20250817-031", recordedBy: "Uche Obi"     },
  { id: "FL-0077", date: "15 Aug 08:00", vehicleId: "ABJ-002E", driverId: "DRV-002", type: "drain", litres: 20, unitPrice: 1125, total: 0,      odomBefore: 97_360, odomAfter: 97_360, station: "Hotel Store",    paymentMethod: "Internal",       receiptRef: "INT-20250815-003", recordedBy: "Isaac Sule"   },
];

const GENERATOR_SEED: Generator[] = [
  { id: "GEN-001", name: "Main Generator",  kva: 500, location: "Generator House",    runtimeHours: 14_280, tankCapacityL: 1000, status: "standby", nextServiceHrs: 14_500, baselineLPerHr: 55.0, assetTag: "AST-005" },
  { id: "GEN-002", name: "Block B Backup",  kva: 200, location: "Block B Annex",      runtimeHours: 8_940,  tankCapacityL: 500,  status: "standby", nextServiceHrs: 9_000,  baselineLPerHr: 22.5, assetTag: "AST-006" },
  { id: "GEN-003", name: "Pool Area Small", kva: 50,  location: "Pool & Spa Building",runtimeHours: 2_310,  tankCapacityL: 200,  status: "running", nextServiceHrs: 2_500,  baselineLPerHr: 6.2,  assetTag: "AST-004" },
];

const DIESEL_SEED: DieselEntry[] = [
  { id: "DL-0033", date: "20 Aug 06:10", generatorId: "GEN-001", litres: 900, unitPrice: 1180, total: 1_062_000, runtimeHoursAtFill: 14_280, prevRuntimeHours: 14_264, supplier: "Emadeb Energy", recordedBy: "Isaac Sule"  },
  { id: "DL-0032", date: "19 Aug 07:20", generatorId: "GEN-002", litres: 420, unitPrice: 1180, total: 495_600,   runtimeHoursAtFill: 8_940,  prevRuntimeHours: 8_922,  supplier: "Ardova Direct", recordedBy: "Isaac Sule"  },
  { id: "DL-0031", date: "19 Aug 16:45", generatorId: "GEN-003", litres: 180, unitPrice: 1180, total: 212_400,   runtimeHoursAtFill: 2_310,  prevRuntimeHours: 2_281,  supplier: "Ardova Direct", recordedBy: "Emeka Nwosu" },
  { id: "DL-0030", date: "18 Aug 06:00", generatorId: "GEN-001", litres: 900, unitPrice: 1180, total: 1_062_000, runtimeHoursAtFill: 14_264, prevRuntimeHours: 14_247, supplier: "Emadeb Energy", recordedBy: "Isaac Sule"  },
  { id: "DL-0029", date: "16 Aug 15:30", generatorId: "GEN-003", litres: 180, unitPrice: 1180, total: 212_400,   runtimeHoursAtFill: 2_281,  prevRuntimeHours: 2_258,  supplier: "NNPCL",         recordedBy: "Emeka Nwosu" },
];

const LOGBOOK_SEED: TripLog[] = [
  {
    id: "TL-0008", driverId: "DRV-001", vehicleId: "ABJ-001E", date: "20 Aug 2025",
    purpose: "Airport Transfer — Guest pickup", from: "Grand Palms Abuja", to: "Nnamdi Azikiwe Int'l Airport",
    departureTime: "05:45", arrivalTime: "07:11", odomStart: 47_850, odomEnd: 47_963, distanceKm: 113,
    passengers: 1, fuelFilled: 45,
    stops: [{ id: "s1", time: "06:02", location: "Terminal 1 Arrival Hall", durationMin: 25, purpose: "Wait for flight ET902 — passenger boarding", leg: "outbound" }],
    notes: "Guest: Adaeze Okonkwo-James", status: "completed", synced: true,
    tripMode: "round-trip", returnStarted: true, tripId: "TRP-0037",
  },
  {
    id: "TL-0007", driverId: "DRV-002", vehicleId: "ABJ-002E", date: "20 Aug 2025",
    purpose: "Charter — Senator Adeyemi", from: "Grand Palms Abuja", to: "Aso Rock (State House)",
    departureTime: "10:00", arrivalTime: "10:32", odomStart: 97_800, odomEnd: 97_822, distanceKm: 22,
    passengers: 3, stops: [], notes: "VIP — no stops, direct", status: "completed", synced: true,
    tripMode: "one-way", returnStarted: false, tripId: "TRP-0039",
  },
  {
    id: "TL-0006", driverId: "DRV-003", vehicleId: "ABJ-003V", date: "19 Aug 2025",
    purpose: "F&B Procurement — FreshMart run", from: "Grand Palms Abuja", to: "FreshMart Wuse II",
    departureTime: "09:00", arrivalTime: "11:45", odomStart: 31_200, odomEnd: 31_300, distanceKm: 100,
    passengers: 1,
    stops: [
      { id: "s2", time: "09:40", location: "FreshMart Wuse II",     durationMin: 95, purpose: "Loading: fresh produce and dry goods for F&B", leg: "outbound" },
      { id: "s3", time: "11:20", location: "Ardova Filling Station", durationMin: 15, purpose: "Fuel — 60L diesel",                            leg: "return"   },
    ],
    notes: "Cost centre: FB-OPS-001", status: "completed", synced: true,
    tripMode: "round-trip", returnStarted: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 6 · STORES
// ═══════════════════════════════════════════════════════════════════════════

const _vehicles   = createStore<Vehicle>(VEHICLE_SEED);
const _drivers    = createStore<Driver>(DRIVER_SEED);
const _trips      = createStore<Trip>(TRIP_SEED);
const _fuel       = createStore<FuelEntry>(FUEL_SEED);
const _generators = createStore<Generator>(GENERATOR_SEED);
const _diesel     = createStore<DieselEntry>(DIESEL_SEED);
const _logbook    = createStore<TripLog>(LOGBOOK_SEED);

// ═══════════════════════════════════════════════════════════════════════════
// 7 · DERIVED STATE  —  computed, never stored, so nothing can drift
// ═══════════════════════════════════════════════════════════════════════════

export function docStatusOf(daysLeft: number): DocStatus {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "expiring-soon";
  return "valid";
}

export function worstDocStatus(v: Vehicle): DocStatus {
  if (v.docs.some((d) => docStatusOf(d.daysLeft) === "expired")) return "expired";
  if (v.docs.some((d) => docStatusOf(d.daysLeft) === "expiring-soon")) return "expiring-soon";
  return "valid";
}

export function expiringDocs(v: Vehicle, withinDays = 30): VehicleDoc[] {
  return v.docs.filter((d) => d.daysLeft <= withinDays);
}

export function serviceOverdue(v: Vehicle): boolean {
  return v.nextServiceDate === "OVERDUE" || v.nextServiceKm - v.odometer <= 0;
}

/** The trip a vehicle is currently on, if any. */
export function currentTripFor(vehicleId: string, trips = _trips.read()): Trip | undefined {
  return trips.find(
    (t) => t.vehicleId === vehicleId &&
      (t.status === "dispatched" || t.status === "en-route" || t.status === "in-transit"),
  );
}

/**
 * Availability is DERIVED. A vehicle the register marked off-road can no
 * longer read as "available" on the dispatch board — that disagreement was
 * only possible while the two screens each stored their own status.
 */
export function vehicleAvailability(v: Vehicle, trips = _trips.read()): VehicleAvailability {
  if (v.lifecycle !== "active") return "unavailable";
  return currentTripFor(v.id, trips) ? "on-trip" : "available";
}

export function driverStatusOf(d: Driver, trips = _trips.read()): DriverStatus {
  if (d.status === "suspended") return "suspended";
  if (trips.some((t) => t.driverId === d.id && (t.status === "dispatched" || t.status === "en-route" || t.status === "in-transit"))) return "on-trip";
  return d.onDuty ? "available" : "off-duty";
}

/** Minutes a trip has waited unassigned — for queue ageing on the board. */
export function tripAgeMinutes(t: Trip): number {
  return Math.max(0, Math.round((Date.now() - t.createdAtMs) / 60_000));
}

export function consumptionL100km(e: FuelEntry): number | null {
  if (e.type !== "fill") return null;
  const km = e.odomAfter - e.odomBefore;
  if (km <= 0) return null;
  return +((e.litres / km) * 100).toFixed(1);
}

export function litresPerHour(e: DieselEntry): number | null {
  const hrs = e.runtimeHoursAtFill - e.prevRuntimeHours;
  if (hrs <= 0) return null;
  return +(e.litres / hrs).toFixed(1);
}

/** Anomaly is computed against the vehicle's own baseline, not pre-written on the row. */
export function fuelAnomaly(e: FuelEntry, v?: Vehicle): string | null {
  const c = consumptionL100km(e);
  if (c === null) {
    if (e.type === "fill" && e.odomAfter <= e.odomBefore) return "Odometer unchanged or decreasing since last fill";
    return null;
  }
  const baseline = v?.baselineL100km;
  if (baseline && c > baseline * 1.15) return `Consumption ${c} L/100km — exceeds threshold (${baseline.toFixed(1)})`;
  if (v && e.litres > v.tankCapacityL) return `Litres exceed tank capacity (${v.tankCapacityL}L)`;
  return null;
}

export function dieselAnomaly(e: DieselEntry, g?: Generator): string | null {
  const lph = litresPerHour(e);
  if (lph === null) return "Runtime hours unchanged since last fill";
  if (g && lph > g.baselineLPerHr * 1.15) return `${lph} L/hr — exceeds baseline (${g.baselineLPerHr.toFixed(1)})`;
  return null;
}

/**
 * ONE assignment guard, reading real document expiry rather than a
 * hand-set docsOk boolean. The Dispatch Board's five conflict checks and
 * the "overlapping schedule" check the blueprint asked for both live here.
 */
export function canAssign(
  trip: Trip,
  vehicle: Vehicle | undefined,
  driver: Driver | undefined,
  trips = _trips.read(),
): { ok: boolean; reason?: string; title?: string } {
  if (!vehicle) return { ok: false, title: "No vehicle selected", reason: "Choose a vehicle for this trip." };
  if (!driver)  return { ok: false, title: "No driver selected",  reason: "Choose a driver for this trip." };

  if (vehicle.lifecycle !== "active")
    return { ok: false, title: "Vehicle unavailable", reason: `${vehicle.plate} is ${VEHICLE_LIFECYCLE_META[vehicle.lifecycle].label.toLowerCase()}.` };

  const badDocs = vehicle.docs.filter((d) => docStatusOf(d.daysLeft) === "expired");
  if (badDocs.length)
    return { ok: false, title: "Vehicle documents expired", reason: `${vehicle.plate}: ${badDocs.map((d) => d.type).join(", ")}.` };

  if (vehicle.seats < trip.pax)
    return { ok: false, title: "Not enough seats", reason: `${vehicle.plate} seats ${vehicle.seats}; trip carries ${trip.pax}.` };

  if (driver.status === "suspended")
    return { ok: false, title: "Driver suspended", reason: driver.suspensionReason ?? `${driver.name} is suspended.` };

  if (driver.licDaysLeft < 0)
    return { ok: false, title: "Licence expired", reason: `${driver.name}'s licence expired ${Math.abs(driver.licDaysLeft)} days ago.` };

  if (driver.medDaysLeft < 0)
    return { ok: false, title: "Medical expired", reason: `${driver.name}'s medical certificate expired ${Math.abs(driver.medDaysLeft)} days ago.` };

  if (!driver.onDuty)
    return { ok: false, title: "Driver off duty", reason: `${driver.name} is not on duty for this shift.` };

  const vehicleBusy = currentTripFor(vehicle.id, trips);
  if (vehicleBusy && vehicleBusy.id !== trip.id)
    return { ok: false, title: "Vehicle on a trip", reason: `${vehicle.plate} is running ${vehicleBusy.id}.` };

  const driverBusy = trips.find(
    (t) => t.driverId === driver.id && t.id !== trip.id &&
      (t.status === "dispatched" || t.status === "en-route" || t.status === "in-transit"),
  );
  if (driverBusy)
    return { ok: false, title: "Driver on a trip", reason: `${driver.name} is running ${driverBusy.id}.` };

  // Overlapping schedule — the one conflict check the blueprint asked for
  // and the board never had.
  const clash = trips.find(
    (t) => t.id !== trip.id && t.status !== "cancelled" && t.status !== "completed" &&
      t.scheduledDate === trip.scheduledDate &&
      t.scheduledTime === trip.scheduledTime &&
      (t.driverId === driver.id || t.vehicleId === vehicle.id),
  );
  if (clash)
    return { ok: false, title: "Schedule clash", reason: `${clash.id} is already booked at ${clash.scheduledTime} on this date.` };

  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════════
// 8 · PUBLIC STORE APIs
// ═══════════════════════════════════════════════════════════════════════════

export const VehicleStore = {
  all: () => _vehicles.read(),
  byId: (id?: string) => (id ? _vehicles.read().find((v) => v.id === id) : undefined),
  byPlate: (plate: string) => _vehicles.read().find((v) => v.plate === plate),
  subscribe: _vehicles.subscribe,

  create(input: Omit<Vehicle, "id">): string {
    const id = nextId("VEH", 3, 5);
    _vehicles.write([..._vehicles.read(), { ...input, id }]);
    return id;
  },
  update(id: string, patch: Partial<Vehicle>) {
    _vehicles.write(_vehicles.read().map((v) => (v.id === id ? { ...v, ...patch } : v)));
  },
  setLifecycle(id: string, lifecycle: VehicleLifecycle) {
    VehicleStore.update(id, { lifecycle });
  },
  /** Odometer only ever moves forward. Every reading in the app funnels through here. */
  recordOdometer(id: string, reading: number) {
    const v = VehicleStore.byId(id);
    if (!v || !Number.isFinite(reading) || reading <= v.odometer) return;
    VehicleStore.update(id, { odometer: reading });
  },
  renewDoc(id: string, type: VehicleDoc["type"], patch: Partial<VehicleDoc>) {
    const v = VehicleStore.byId(id);
    if (!v) return;
    VehicleStore.update(id, { docs: v.docs.map((d) => (d.type === type ? { ...d, ...patch } : d)) });
  },
};

export const DriverStore = {
  all: () => _drivers.read(),
  byId: (id?: string) => (id ? _drivers.read().find((d) => d.id === id) : undefined),
  byName: (name: string) => _drivers.read().find((d) => d.name === name),
  subscribe: _drivers.subscribe,

  create(input: Omit<Driver, "id">): string {
    const id = nextId("DRV", 3, 5);
    _drivers.write([..._drivers.read(), { ...input, id }]);
    return id;
  },
  update(id: string, patch: Partial<Driver>) {
    _drivers.write(_drivers.read().map((d) => (d.id === id ? { ...d, ...patch } : d)));
  },
  setDuty(id: string, onDuty: boolean, override = true) {
    DriverStore.update(id, { onDuty, shiftOverride: override, status: onDuty ? "available" : "off-duty" });
  },
  suspend(id: string, reason: string) {
    DriverStore.update(id, { status: "suspended", onDuty: false, suspensionReason: reason });
  },
  unsuspend(id: string) {
    const d = DriverStore.byId(id);
    if (!d) return;
    const onDuty = d.hrShift !== "Off";
    DriverStore.update(id, { status: onDuty ? "available" : "off-duty", onDuty, suspensionReason: undefined });
  },
  assignVehicle(driverId: string, vehicleId: string | undefined) {
    DriverStore.update(driverId, { vehicleId });
    if (vehicleId) VehicleStore.update(vehicleId, { assignedDriverId: driverId });
  },
};

export const TripStore = {
  all: () => _trips.read(),
  byId: (id?: string) => (id ? _trips.read().find((t) => t.id === id) : undefined),
  byStatus: (s: TripStatus) => _trips.read().filter((t) => t.status === s),
  forDriver: (driverId: string) => _trips.read().filter((t) => t.driverId === driverId),
  forVehicle: (vehicleId: string) => _trips.read().filter((t) => t.vehicleId === vehicleId),
  subscribe: _trips.subscribe,

  create(input: Omit<Trip, "id" | "createdAt" | "createdAtMs" | "events" | "stops"> & Partial<Pick<Trip, "events" | "stops">>): string {
    const id = nextId("TRP", 4, 42);
    const trip: Trip = {
      ...input,
      id,
      stops: input.stops ?? [],
      createdAt: `Today ${now()}`,
      createdAtMs: Date.now(),
      events: input.events ?? [{ time: now(), event: "Trip created", actor: input.requestedBy ?? "Dispatch" }],
    };
    _trips.write([trip, ..._trips.read()]);
    return id;
  },

  update(id: string, patch: Partial<Trip>) {
    _trips.write(_trips.read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
  },

  logEvent(id: string, event: string, actor: string, note?: string) {
    const t = TripStore.byId(id);
    if (!t) return;
    TripStore.update(id, { events: [...t.events, { time: now(), event, actor, note }] });
  },

  assign(id: string, vehicleId: string, driverId: string, actor = "Dispatch") {
    const trip = TripStore.byId(id);
    const vehicle = VehicleStore.byId(vehicleId);
    const driver = DriverStore.byId(driverId);
    if (!trip) return { ok: false, title: "Trip not found" };

    const check = canAssign(trip, vehicle, driver);
    if (!check.ok) return check;

    TripStore.update(id, { status: "assigned", vehicleId, driverId });
    TripStore.logEvent(id, "Driver assigned", actor, `${driver!.name} · ${vehicle!.plate}`);
    return { ok: true as const };
  },

  approve(id: string, approver: string) {
    TripStore.update(id, { status: "requested" });
    TripStore.logEvent(id, "Request approved", approver);
  },

  advance(id: string, actor = "Dispatch") {
    const t = TripStore.byId(id);
    if (!t) return;
    const next = nextTripStatus(t.status);
    if (!next) return;
    TripStore.update(id, { status: next });
    TripStore.logEvent(id, TRIP_STATUS_META[next].label, actor);
  },

  cancel(id: string, reason: CancelReason, note: string, actor: string) {
    TripStore.update(id, { status: "cancelled", cancelReason: reason, cancelNote: note });
    TripStore.logEvent(id, "Cancelled", actor, note ? `${reason} — ${note}` : reason);
  },

  complete(id: string, odomEnd: number, actor: string, finalFare?: number) {
    const t = TripStore.byId(id);
    if (!t) return;
    TripStore.update(id, { status: "completed", odomEnd, finalFare: finalFare ?? t.quotedFare });
    if (t.vehicleId) VehicleStore.recordOdometer(t.vehicleId, odomEnd);
    TripStore.logEvent(id, "Completed", actor, `Odometer ${odomEnd.toLocaleString()} km`);
  },
};

export const FuelStore = {
  all: () => _fuel.read(),
  forVehicle: (vehicleId: string) => _fuel.read().filter((e) => e.vehicleId === vehicleId),
  subscribe: _fuel.subscribe,

  /** Last recorded odometer for a vehicle, so a new entry's interval is real. */
  lastReading(vehicleId: string): number {
    const entries = _fuel.read().filter((e) => e.vehicleId === vehicleId);
    const v = VehicleStore.byId(vehicleId);
    return Math.max(v?.odometer ?? 0, ...entries.map((e) => e.odomAfter), 0);
  },

  create(input: Omit<FuelEntry, "id" | "odomBefore" | "total">): string {
    const id = nextId("FL", 4, 82);
    const entry: FuelEntry = {
      ...input,
      id,
      odomBefore: FuelStore.lastReading(input.vehicleId),
      total: input.type === "drain" ? 0 : Math.round(input.litres * input.unitPrice),
    };
    _fuel.write([entry, ..._fuel.read()]);
    VehicleStore.recordOdometer(input.vehicleId, input.odomAfter);
    return id;
  },
};

export const GeneratorStore = {
  all: () => _generators.read(),
  byId: (id?: string) => (id ? _generators.read().find((g) => g.id === id) : undefined),
  subscribe: _generators.subscribe,
  update(id: string, patch: Partial<Generator>) {
    _generators.write(_generators.read().map((g) => (g.id === id ? { ...g, ...patch } : g)));
  },
};

export const DieselStore = {
  all: () => _diesel.read(),
  forGenerator: (generatorId: string) => _diesel.read().filter((e) => e.generatorId === generatorId),
  subscribe: _diesel.subscribe,

  create(input: Omit<DieselEntry, "id" | "prevRuntimeHours" | "total">): string {
    const id = nextId("DL", 4, 34);
    const g = GeneratorStore.byId(input.generatorId);
    const entry: DieselEntry = {
      ...input,
      id,
      prevRuntimeHours: g?.runtimeHours ?? input.runtimeHoursAtFill,
      total: Math.round(input.litres * input.unitPrice),
    };
    _diesel.write([entry, ..._diesel.read()]);
    if (g && input.runtimeHoursAtFill > g.runtimeHours) {
      GeneratorStore.update(g.id, { runtimeHours: input.runtimeHoursAtFill });
    }
    return id;
  },
};

export const LogbookStore = {
  all: () => _logbook.read(),
  forDriver: (driverId: string) => _logbook.read().filter((l) => l.driverId === driverId),
  subscribe: _logbook.subscribe,

  start(input: Omit<TripLog, "id" | "date" | "departureTime" | "status" | "synced" | "stops" | "returnStarted">): string {
    const id = nextId("TL", 4, 9);
    _logbook.write([
      { ...input, id, date: today(), departureTime: now(), stops: [], status: "active", synced: false, returnStarted: false },
      ..._logbook.read(),
    ]);
    return id;
  },
  update(id: string, patch: Partial<TripLog>) {
    _logbook.write(_logbook.read().map((l) => (l.id === id ? { ...l, ...patch } : l)));
  },
  addStop(id: string, stop: Omit<TripStop, "id" | "time" | "leg">) {
    const l = _logbook.read().find((x) => x.id === id);
    if (!l) return;
    LogbookStore.update(id, {
      stops: [...l.stops, { ...stop, id: nextId("s", 2, 10), time: now(), leg: l.returnStarted ? "return" : "outbound" }],
    });
  },
  complete(id: string, odomEnd: number, online: boolean, patch: Partial<TripLog> = {}) {
    const l = _logbook.read().find((x) => x.id === id);
    if (!l) return;
    LogbookStore.update(id, {
      ...patch, status: "completed", arrivalTime: now(),
      odomEnd, distanceKm: odomEnd - l.odomStart, synced: online,
    });
    VehicleStore.recordOdometer(l.vehicleId, odomEnd);
    if (l.tripId) TripStore.complete(l.tripId, odomEnd, DriverStore.byId(l.driverId)?.name ?? "Driver");
  },
  syncAll() {
    _logbook.write(_logbook.read().map((l) => ({ ...l, synced: true })));
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 9 · HOOKS  —  screens read through these, so state survives navigation
//     (App.tsx remounts each screen on nav; module stores don't care)
// ═══════════════════════════════════════════════════════════════════════════

export const useVehicles   = () => useSyncExternalStore(_vehicles.subscribe,   _vehicles.read,   _vehicles.read);
export const useDrivers    = () => useSyncExternalStore(_drivers.subscribe,    _drivers.read,    _drivers.read);
export const useTrips      = () => useSyncExternalStore(_trips.subscribe,      _trips.read,      _trips.read);
export const useFuelLog    = () => useSyncExternalStore(_fuel.subscribe,       _fuel.read,       _fuel.read);
export const useGenerators = () => useSyncExternalStore(_generators.subscribe, _generators.read, _generators.read);
export const useDieselLog  = () => useSyncExternalStore(_diesel.subscribe,     _diesel.read,     _diesel.read);
export const useLogbook    = () => useSyncExternalStore(_logbook.subscribe,    _logbook.read,    _logbook.read);

// Convenience lookups that re-render with their store
export const useTrip    = (id?: string) => useTrips().find((t) => t.id === id);
export const useVehicle = (id?: string) => useVehicles().find((v) => v.id === id);
export const useDriver  = (id?: string) => useDrivers().find((d) => d.id === id);

// ═══════════════════════════════════════════════════════════════════════════
// 10 · SMALL SHARED FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export const naira = (n: number) => `₦${n.toLocaleString()}`;
export const km = (n: number) => `${n.toLocaleString()} km`;
export const ageLabel = (mins: number) =>
  mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${Math.floor(mins / 1440)}d`;

/** Escalation tier for an unassigned trip, for the board's queue colouring. */
export function queueEscalation(t: Trip): "fresh" | "ageing" | "late" {
  const m = tripAgeMinutes(t);
  if (m > 120) return "late";
  if (m > 45) return "ageing";
  return "fresh";
}

export const ESCALATION_COLOR: Record<"fresh" | "ageing" | "late", string> = {
  fresh:  MUTED,
  ageing: WARNING,
  late:   ERROR,
};
