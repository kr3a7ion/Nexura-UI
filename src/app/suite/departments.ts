import type { ElementType } from "react";
import {
  Bed, Buildings, ChartBar, Chat, CurrencyDollar, ForkKnife, GearSix, Key,
  Package, Shield, Users, Wrench, Car,
} from "@phosphor-icons/react";
import type { Role, Screen } from "../constants";

export type DepartmentId =
  | "front-office"
  | "access-security"
  | "housekeeping"
  | "maintenance"
  | "restaurant-pos"
  | "finance"
  | "inventory"
  | "hr"
  | "communications"
  | "fleet"
  | "reports"
  | "it-system"
  | "properties-settings";

export type DepartmentScreen = { label: string; screen: Screen };
export type DepartmentGroup = { label: string; items: DepartmentScreen[] };
export type DepartmentFlowStep = { label: string; screen: Screen };

export type Department = {
  id: DepartmentId;
  name: string;
  icon: ElementType;
  accent: string;
  roles: Role[];
  home: `dept-${DepartmentId}`;
  screens: DepartmentGroup[];
  flow: DepartmentFlowStep[];
};

const group = (label: string, items: Array<[string, Screen]>): DepartmentGroup => ({
  label,
  items: items.map(([itemLabel, screen]) => ({ label: itemLabel, screen })),
});

export const DEPARTMENTS: Department[] = [
  {
    id: "front-office", name: "Front Office", icon: Buildings, accent: "#0F8F83",
    roles: ["MGT", "FD", "RSV"], home: "dept-front-office", flow: [
      { label: "Reserve", screen: "new-reservation" },
      { label: "Assign room", screen: "room-assignment" },
      { label: "Check-in", screen: "check-in" },
      { label: "Folio", screen: "folio" },
      { label: "Check-out", screen: "check-out" },
    ],
    screens: [
      group("Overview", [["Management Overview", "dashboard-mgmt"]]),
      group("Reservations", [["Reservation Grid", "reservation-grid"], ["New Reservation", "new-reservation"], ["Group Bookings", "group-bookings"], ["Waitlist", "waitlist"], ["Rate Management", "rate-management"], ["Reservation Lookup", "reservation-search"], ["Cancellation & Refund", "cancellation"], ["Room Types", "room-types"], ["Rate Calendar", "rate-calendar"], ["Availability Board", "availability-board"]]),
      group("Guest Journey", [["Check-In", "check-in"], ["Check-Out", "check-out"], ["In-House Guests", "in-house-guests"], ["Arrivals List", "arrivals"], ["Departures List", "departures"], ["Guest Profiles", "guest-profiles"], ["Room Assignment", "room-assignment"], ["Walk-In Registration", "walk-in"], ["Folio Management", "folio"]]),
    ],
  },
  {
    id: "access-security", name: "Access & Security", icon: Key, accent: "#4F46E5",
    roles: ["MGT", "FD", "IT"], home: "dept-access-security", flow: [
      { label: "Check-in", screen: "check-in" },
      { label: "Encode key", screen: "key-card" },
      { label: "Generate PIN", screen: "pin-management" },
      { label: "Monitor", screen: "key-card-log" },
      { label: "Revoke at check-out", screen: "room-access" },
    ],
    screens: [group("Guest Access", [["Key Card Management", "key-card"], ["Room Access Mgmt", "room-access"], ["Key Card Log", "key-card-log"], ["PIN Management", "pin-management"]]), group("Configuration", [["Door Lock Settings", "door-lock-settings"]])],
  },
  {
    id: "housekeeping", name: "Housekeeping", icon: Bed, accent: "#7C3AED",
    roles: ["MGT", "HK"], home: "dept-housekeeping", flow: [
      { label: "Dirty", screen: "hk-board" },
      { label: "Assigned", screen: "hk-tasks" },
      { label: "Cleaning", screen: "hk-tasks" },
      { label: "Inspect", screen: "hk-inspection" },
      { label: "Ready", screen: "hk-board" },
    ],
    screens: [group("Rooms", [["Housekeeping Board", "hk-board"], ["My Tasks", "hk-tasks"], ["Schedule", "hk-schedule"], ["Inspection Log", "hk-inspection"]]), group("Logs & Supplies", [["Lost & Found", "lost-found"], ["Linen & Supplies", "linen-supplies"], ["Do Not Disturb Log", "dnd-log"]])],
  },
  {
    id: "maintenance", name: "Maintenance", icon: Wrench, accent: "#EA580C",
    roles: ["MGT", "MX"], home: "dept-maintenance", flow: [
      { label: "Report", screen: "work-orders" },
      { label: "Triage", screen: "work-order-detail" },
      { label: "Assign", screen: "work-orders" },
      { label: "Fix", screen: "work-order-detail" },
      { label: "Verify", screen: "work-order-detail" },
      { label: "Close", screen: "work-orders" },
    ],
    screens: [group("Engineering", [["Work Orders", "work-orders"], ["Asset Register", "asset-register"], ["Preventive Schedule", "preventive-schedule"], ["Vendor Contacts", "vendor-contacts"], ["Generator Diesel", "generator-diesel"]])],
  },
  {
    id: "restaurant-pos", name: "Restaurant & POS", icon: ForkKnife, accent: "#C2410C",
    roles: ["MGT", "RT"], home: "dept-restaurant-pos", flow: [
      { label: "Seat", screen: "table-management" },
      { label: "Order", screen: "pos-terminal" },
      { label: "Kitchen", screen: "kitchen-display" },
      { label: "Serve", screen: "room-service" },
      { label: "Pay or charge to room", screen: "room-charges" },
    ],
    screens: [group("Service", [["POS Terminal", "pos-terminal"], ["Kitchen Display", "kitchen-display"], ["Table Management", "table-management"], ["Dining Reservations", "dining-reservations"], ["Room Service Orders", "room-service"]]), group("Management", [["Menu Management", "menu-management"], ["Guest Room Charges", "room-charges"], ["Cash Drawer", "cash-drawer"]])],
  },
  {
    id: "finance", name: "Finance", icon: CurrencyDollar, accent: "#047857",
    roles: ["MGT", "FIN"], home: "dept-finance", flow: [
      { label: "Post charges", screen: "folio" },
      { label: "Settle folio", screen: "finance-folio" },
      { label: "Night audit", screen: "night-audit" },
      { label: "Daily summary", screen: "daily-summary" },
      { label: "Accounting export", screen: "accounting-export" },
    ],
    screens: [group("Daily Control", [["Night Audit", "night-audit"], ["Daily Summary", "daily-summary"], ["Folio Management", "finance-folio"], ["Invoice & Receipts", "invoices"], ["Credit Notes", "credit-notes"], ["Refund Processing", "refund-processing"], ["Folio Void & Reversal", "folio-void"]]), group("Accounting", [["Tax Configuration", "tax-config"], ["Accounts Payable", "accounts-payable"], ["Accounting Export", "accounting-export"], ["Revenue Reports", "revenue-reports"]])],
  },
  {
    id: "inventory", name: "Inventory", icon: Package, accent: "#B45309",
    roles: ["MGT", "FIN", "RT", "HK", "MX"], home: "dept-inventory", flow: [
      { label: "Low stock", screen: "stock-dashboard" },
      { label: "Purchase order", screen: "purchase-orders" },
      { label: "Receive", screen: "purchase-orders" },
      { label: "Stock in", screen: "stock-transactions" },
      { label: "Issue to department", screen: "stock-transactions" },
    ],
    screens: [group("Stock & Procurement", [["Stock Dashboard", "stock-dashboard"], ["Products", "products"], ["Suppliers", "suppliers"], ["Stock Transactions", "stock-transactions"], ["Purchase Orders", "purchase-orders"], ["Generator & Diesel", "generator-diesel"]])],
  },
  {
    id: "hr", name: "HR & Staff", icon: Users, accent: "#BE185D",
    roles: ["MGT"], home: "dept-hr", flow: [
      { label: "Onboard", screen: "staff-directory" },
      { label: "Assign role", screen: "roles-permissions" },
      { label: "Schedule", screen: "shift-scheduler" },
      { label: "Attendance", screen: "attendance" },
      { label: "Payroll", screen: "payroll" },
    ],
    screens: [group("People", [["Staff Directory", "staff-directory"], ["Roles & Permissions", "roles-permissions"], ["Attendance", "attendance"], ["Shift Scheduler", "shift-scheduler"], ["Leave Management", "leave-management"], ["Payroll Summary", "payroll"]])],
  },
  {
    id: "communications", name: "Communications", icon: Chat, accent: "#2563EB",
    roles: ["MGT", "FD", "HK", "MX", "FIN", "RT", "RSV", "IT", "DRV", "FLT"], home: "dept-communications", flow: [
      { label: "Guest message", screen: "guest-messaging" },
      { label: "Complaint arrives", screen: "complaint-management" },
      { label: "Assign", screen: "complaint-management" },
      { label: "Resolve", screen: "complaint-management" },
      { label: "Close", screen: "complaint-dashboard" },
      { label: "Shift handover", screen: "shift-handover" },
    ],
    screens: [group("Team & Guests", [["Internal Chat", "internal-chat"], ["Guest Messaging", "guest-messaging"], ["Announcements", "announcements"], ["Shift Handover", "shift-handover"]]), group("Service Recovery", [["Complaint Management", "complaint-management"], ["Complaint Dashboard", "complaint-dashboard"]])],
  },
  {
    id: "fleet", name: "Fleet", icon: Car, accent: "#0E7490",
    roles: ["MGT", "FLT", "DRV"], home: "dept-fleet", flow: [
      { label: "Request", screen: "new-trip" },
      { label: "Dispatch", screen: "dispatch-board" },
      { label: "Odometer start", screen: "trip-detail" },
      { label: "Complete", screen: "trip-detail" },
      { label: "Cost", screen: "fleet-costing" },
    ],
    screens: [group("Dispatch", [["Dispatch Board", "dispatch-board"], ["New Trip Request", "new-trip"], ["Trip Detail", "trip-detail"], ["Driver Roster", "driver-roster"], ["Driver Access Log", "driver-access-log"]]), group("Assets & Cost", [["Fleet Costing", "fleet-costing"], ["Vehicle Register", "vehicle-register"], ["Fuel Log", "fuel-log"]])],
  },
  {
    id: "reports", name: "Reports & Insights", icon: ChartBar, accent: "#6D28D9",
    roles: ["MGT", "FIN"], home: "dept-reports", flow: [],
    screens: [group("Hotel Intelligence", [["Occupancy Reports", "rp-occupancy"], ["Revenue Reports", "rp-revenue"], ["Department Reports", "rp-department"], ["Guest Analytics", "rp-guest"], ["Inventory Reports", "rp-inventory"], ["Staff Reports", "rp-staff"]])],
  },
  {
    id: "it-system", name: "IT & System", icon: Shield, accent: "#334155",
    roles: ["MGT", "IT"], home: "dept-it-system", flow: [],
    screens: [group("Administration", [["User Management", "user-management"], ["System Health", "system-health"], ["Schema & App Updates", "schema-update"], ["Device Management", "device-management"], ["Backup & Restore", "backup-restore"], ["Audit Log", "audit-log"], ["Error Log", "error-log"]])],
  },
  {
    id: "properties-settings", name: "Properties & Settings", icon: GearSix, accent: "#475569",
    roles: ["MGT", "IT"], home: "dept-properties-settings", flow: [],
    screens: [group("Multi-Branch", [["Branch Overview", "branch-overview"], ["Branch Comparison", "branch-comparison"], ["Central Sync Status", "sync-status"]]), group("Configuration", [["Hotel Configuration", "hotel-config"], ["Sync Settings", "settings-sync"], ["Print Settings", "print-settings"], ["Print Templates", "print-templates" as Screen], ["My Preferences", "my-preferences"]])],
  },
];

export const departmentForScreen = (screen: string) =>
  DEPARTMENTS.find(department => department.home === screen || department.screens.some(section => section.items.some(item => item.screen === screen)));

export const departmentsForRole = (role: Role) =>
  role === "MGT" ? DEPARTMENTS : DEPARTMENTS.filter(department => department.roles.includes(role));
