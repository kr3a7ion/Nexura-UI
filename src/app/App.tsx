// Lean shell: sidebar, header, notification panel, Router, App root.
// All screen components live in Screens.tsx. All data/constants in constants.ts.
import { useState, useCallback } from "react";
import {
  LayoutDashboard, CalendarDays, KeyRound, BedDouble, Wrench,
  UtensilsCrossed, MessageSquare, DollarSign, Package, Users,
  Building2, BarChart3, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, User, ChevronDown, AlertTriangle, Plus,
  MoreHorizontal, ArrowRight, Home, Layers, X, Lock, Globe,
  ClipboardList, CalendarCheck, Star, AlertCircle, FileText, CreditCard, Truck,
  Shield, Cpu, Activity, RefreshCw, Hash, Phone, Edit3, Eye, Trash2,
  Download, Send, Menu as MenuIcon, HelpCircle, CheckCircle2, Search, WifiOff, Clock,
  TrendingUp, TrendingDown, UserCheck, Car,
} from "lucide-react";

// ─── Shared data & types ─────────────────────────────────────────────────────
import {
  type Role, type Screen, type Toast, type ToastType,
  uid, fmtN,
  mono, sans, display, NAV_BG, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  NOTIFS, BRANCHES,
} from "./constants";
import { LoginScreen, ForgotPasswordScreen, ForceChangePasswordScreen } from "./AuthScreens";
import AdminConsole from "./PlatformAdminConsole";
import OrgPortal from "./OrgPortalScreens";

type AuthState = "login" | "hms" | "admin-console" | "org-portal" | "force-change-password";

// ─── Screen components & primitives ──────────────────────────────────────────
import {
  // Primitives used in the shell
  EmptyState, ToastC, LiveClock, SyncPill,
  // All screen components
  DashboardMgmt, DashboardRole,
  ReservationGrid, NewReservation, ReservationSearch, ReservationDetail,
  GroupBookings, Waitlist, RateManagement, CancellationRefund,
  RoomTypeManagement, RateCalendar, AvailabilityBoard,
  CheckInWizard, CheckOut, InHouseGuests, GuestProfiles, GuestProfileDetail,
  ArrivalsScreen, DeparturesScreen, FolioScreen, FinanceFolioManagement, WalkInReg, RoomAssignmentBoard,
  KeyCardMgmt, RoomAccessMgmt, KeyCardLog, PINManagement,
  HKBoard, HKMyTasks, InspectionLog, LinenSupplies, HousekeepingSchedule,
  LostFound, DNDLog,
  WorkOrders, WorkOrderDetail, AssetRegister, PreventiveSchedule, VendorContacts,
  POSTerminal, KitchenDisplay, TableManagement, MenuManagement,
  DiningReservations, RoomServiceOrders, GuestRoomCharges, CashDrawerReconciliation,
  InternalChat, GuestMessaging, Announcements, ShiftHandover,
  InvoiceReceipts, AccountsPayable, DailySummary, RevenueReports, NightAudit, TaxConfiguration, RefundProcessing, FolioVoidReversal, AccountingExport, CreditNotes,
  ComplaintManagement, ComplaintDashboard,
  StockDashboard, ProductsScreen, SuppliersScreen, StockTransactions, PurchaseOrders,
  StaffDirectory, StaffProfileDetail, RolesPermissions, AttendanceScreen,
  ShiftScheduler, PayrollSummary, LeaveManagement,
  BranchOverview, BranchComparison, CentralSyncStatus, PrintSettings,
  OccupancyReports, DepartmentReports, GuestAnalytics, InventoryReports, StaffReports,
  SystemHealth, UserManagement, SchemaUpdateStatus, DeviceManagement, BackupRestore, AuditLog, ErrorLog,
  HotelConfig, DoorLockSettings, MyPreferences, SyncSettings,
  DispatchBoard, TripDetail, NewTripRequest, DriverRoster, FleetCosting,
} from "./Screens";

// ─── Sidebar nav config ───────────────────────────────────────────────────────
const NAV: Array<{ icon: React.ElementType; label: string; screen?: Screen; badge?: number; children?: { label: string; screen: Screen }[] }> = [
  { icon: LayoutDashboard, label: "Dashboard", screen: "dashboard-mgmt" },
  { icon: CalendarDays, label: "Reservations", badge: 3, children: [{ label: "Reservation Grid", screen: "reservation-grid" }, { label: "New Reservation", screen: "new-reservation" }, { label: "Group Bookings", screen: "group-bookings" }, { label: "Waitlist", screen: "waitlist" }, { label: "Rate Management", screen: "rate-management" }, { label: "Reservation Search", screen: "reservation-search" }, { label: "Cancellation & Refund", screen: "cancellation" }, { label: "Room Types", screen: "room-types" }, { label: "Rate Calendar", screen: "rate-calendar" }, { label: "Availability Board", screen: "availability-board" }] },
  { icon: KeyRound, label: "Front Desk", badge: 2, children: [{ label: "Check-In", screen: "check-in" }, { label: "Check-Out", screen: "check-out" }, { label: "In-House Guests", screen: "in-house-guests" }, { label: "Arrivals List", screen: "arrivals" }, { label: "Departures List", screen: "departures" }, { label: "Guest Profiles", screen: "guest-profiles" }, { label: "Room Assignment", screen: "room-assignment" }, { label: "Walk-In Registration", screen: "walk-in" }, { label: "Folio Management", screen: "folio" }, { label: "Key Card Management", screen: "key-card" }, { label: "Room Access Mgmt", screen: "room-access" }, { label: "Key Card Log", screen: "key-card-log" }, { label: "PIN Management", screen: "pin-management" }] },
  { icon: BedDouble, label: "Housekeeping", children: [{ label: "Housekeeping Board", screen: "hk-board" }, { label: "My Tasks", screen: "hk-tasks" }, { label: "Schedule", screen: "hk-schedule" }, { label: "Inspection Log", screen: "hk-inspection" }, { label: "Lost & Found", screen: "lost-found" }, { label: "Linen & Supplies", screen: "linen-supplies" }, { label: "Do Not Disturb Log", screen: "dnd-log" }] },
  { icon: Wrench, label: "Maintenance", badge: 2, children: [{ label: "Work Orders", screen: "work-orders" }, { label: "Asset Register", screen: "asset-register" }, { label: "Preventive Schedule", screen: "preventive-schedule" }, { label: "Vendor Contacts", screen: "vendor-contacts" }] },
  { icon: UtensilsCrossed, label: "Restaurant / POS", children: [{ label: "POS Terminal", screen: "pos-terminal" }, { label: "Kitchen Display", screen: "kitchen-display" }, { label: "Table Management", screen: "table-management" }, { label: "Menu Management", screen: "menu-management" }, { label: "Dining Reservations", screen: "dining-reservations" }, { label: "Room Service Orders", screen: "room-service" }, { label: "Guest Room Charges", screen: "room-charges" }, { label: "Cash Drawer", screen: "cash-drawer" }] },
  { icon: MessageSquare, label: "Communications", badge: 5, children: [{ label: "Internal Chat", screen: "internal-chat" }, { label: "Guest Messaging", screen: "guest-messaging" }, { label: "Announcements", screen: "announcements" }, { label: "Shift Handover", screen: "shift-handover" }, { label: "Complaint Management", screen: "complaint-management" }, { label: "Complaint Dashboard", screen: "complaint-dashboard" }] },
  { icon: DollarSign, label: "Finance & Billing", badge: 1, children: [{ label: "Night Audit", screen: "night-audit" }, { label: "Daily Summary", screen: "daily-summary" }, { label: "Folio Management", screen: "finance-folio" }, { label: "Invoice & Receipts", screen: "invoices" }, { label: "Credit Notes", screen: "credit-notes" }, { label: "Refund Processing", screen: "refund-processing" }, { label: "Folio Void & Reversal", screen: "folio-void" }, { label: "Tax Configuration", screen: "tax-config" }, { label: "Accounts Payable", screen: "accounts-payable" }, { label: "Accounting Export", screen: "accounting-export" }, { label: "Revenue Reports", screen: "revenue-reports" }] },
  { icon: Package, label: "Inventory", children: [{ label: "Stock Dashboard", screen: "stock-dashboard" }, { label: "Products", screen: "products" }, { label: "Suppliers", screen: "suppliers" }, { label: "Stock Transactions", screen: "stock-transactions" }, { label: "Purchase Orders", screen: "purchase-orders" }] },
  { icon: Users, label: "HR & Staff", children: [{ label: "Staff Directory", screen: "staff-directory" }, { label: "Roles & Permissions", screen: "roles-permissions" }, { label: "Attendance", screen: "attendance" }, { label: "Shift Scheduler", screen: "shift-scheduler" }, { label: "Leave Management", screen: "leave-management" }, { label: "Payroll Summary", screen: "payroll" }] },
  { icon: Building2, label: "Multi-Branch", children: [{ label: "Branch Overview", screen: "branch-overview" }, { label: "Branch Comparison", screen: "branch-comparison" }, { label: "Central Sync Status", screen: "sync-status" }] },
  { icon: BarChart3, label: "Reports", children: [{ label: "Occupancy Reports", screen: "rp-occupancy" }, { label: "Revenue Reports", screen: "rp-revenue" }, { label: "Department Reports", screen: "rp-department" }, { label: "Guest Analytics", screen: "rp-guest" }, { label: "Inventory Reports", screen: "rp-inventory" }, { label: "Staff Reports", screen: "rp-staff" }] },
  { icon: Shield, label: "IT Admin", children: [{ label: "User Management", screen: "user-management" }, { label: "System Health", screen: "system-health" }, { label: "Schema & App Updates", screen: "schema-update" }, { label: "Device Management", screen: "device-management" }, { label: "Backup & Restore", screen: "backup-restore" }, { label: "Audit Log", screen: "audit-log" }, { label: "Error Log", screen: "error-log" }] },
  { icon: Settings, label: "Settings", children: [{ label: "Hotel Configuration", screen: "hotel-config" }, { label: "Sync Settings", screen: "settings-sync" }, { label: "Door Lock Settings", screen: "door-lock-settings" }, { label: "Print Settings", screen: "print-settings" }, { label: "My Preferences", screen: "my-preferences" }] },
  { icon: Car, label: "Fleet", children: [{ label: "Dispatch Board", screen: "dispatch-board" }, { label: "New Trip Request", screen: "new-trip" }, { label: "Driver Roster", screen: "driver-roster" }, { label: "Fleet Costing", screen: "fleet-costing" }] },
];

// ─── Placeholder for unbuilt screens ─────────────────────────────────────────
function PlaceholderScreen({ title, desc, icon: Icon }: { title: string; desc: string; icon: React.ElementType }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold" style={{ color: TEXT }}>{title}</h1></div></div>
      <div className="bg-white rounded-xl border" style={{ borderColor: BORDER }}>
        <EmptyState icon={Icon} message={desc} cta={`Open ${title}`} />
      </div>
    </div>
  );
}

// ─── Nav type ─────────────────────────────────────────────────────────────────
type NavFn = (s: Screen, label: string) => void;

// ─── Router ───────────────────────────────────────────────────────────────────
function Router({ screen, add, role, nav }: { screen: Screen; add: (t: Omit<Toast, "id">) => void; role: Role; nav: NavFn }) {
  // Dashboard
  if (screen === "dashboard-mgmt") return <DashboardMgmt add={add} nav={nav} />;
  if (screen === "dashboard-role") return <DashboardRole role={role} nav={nav} />;
  // Reservations
  if (screen === "reservation-grid") return <ReservationGrid add={add} nav={nav} />;
  if (screen === "new-reservation") return <NewReservation add={add} />;
  if (screen === "reservation-search") return <ReservationSearch add={add} nav={nav} />;
  if (screen === "reservation-detail") return <ReservationDetail add={add} />;
  if (screen === "group-bookings") return <GroupBookings add={add} />;
  if (screen === "waitlist") return <Waitlist add={add} />;
  if (screen === "rate-management") return <RateManagement add={add} />;
  if (screen === "cancellation") return <CancellationRefund add={add} />;
  if (screen === "room-types") return <RoomTypeManagement add={add} />;
  if (screen === "rate-calendar") return <RateCalendar add={add} />;
  if (screen === "availability-board") return <AvailabilityBoard add={add} nav={nav} />;
  // Front Desk
  if (screen === "check-in") return <CheckInWizard add={add} />;
  if (screen === "check-out") return <CheckOut add={add} />;
  if (screen === "in-house-guests") return <InHouseGuests add={add} nav={nav} />;
  if (screen === "guest-profiles") return <GuestProfiles add={add} nav={nav} />;
  if (screen === "guest-profile-detail") return <GuestProfileDetail add={add} />;
  if (screen === "folio") return <FolioScreen add={add} nav={nav} />;
  if (screen === "finance-folio") return <FinanceFolioManagement add={add} nav={nav} />;
  if (screen === "arrivals") return <ArrivalsScreen add={add} nav={nav} />;
  if (screen === "departures") return <DeparturesScreen add={add} nav={nav} />;
  if (screen === "room-assignment") return <RoomAssignmentBoard add={add} nav={nav} />;
  if (screen === "walk-in") return <WalkInReg add={add} />;
  if (screen === "key-card") return <KeyCardMgmt add={add} />;
  if (screen === "room-access") return <RoomAccessMgmt add={add} />;
  if (screen === "key-card-log") return <KeyCardLog />;
  if (screen === "pin-management") return <PINManagement add={add} />;
  // Housekeeping
  if (screen === "hk-board") return <HKBoard add={add} nav={nav} />;
  if (screen === "hk-tasks") return <HKMyTasks add={add} />;
  if (screen === "hk-inspection") return <InspectionLog add={add} />;
  if (screen === "linen-supplies") return <LinenSupplies add={add} />;
  if (screen === "hk-schedule") return <HousekeepingSchedule add={add} />;
  if (screen === "lost-found") return <LostFound add={add} />;
  if (screen === "dnd-log") return <DNDLog add={add} />;
  // Maintenance
  if (screen === "work-orders") return <WorkOrders add={add} nav={nav} />;
  if (screen === "work-order-detail") return <WorkOrderDetail add={add} />;
  if (screen === "asset-register") return <AssetRegister add={add} />;
  if (screen === "preventive-schedule") return <PreventiveSchedule add={add} />;
  if (screen === "vendor-contacts") return <VendorContacts add={add} />;
  // Restaurant
  if (screen === "pos-terminal") return <POSTerminal add={add} nav={nav} />;
  if (screen === "kitchen-display") return <KitchenDisplay />;
  if (screen === "table-management") return <TableManagement add={add} nav={nav} />;
  if (screen === "menu-management") return <MenuManagement add={add} />;
  if (screen === "dining-reservations") return <DiningReservations add={add} />;
  if (screen === "room-service") return <RoomServiceOrders add={add} />;
  if (screen === "room-charges") return <GuestRoomCharges add={add} />;
  if (screen === "cash-drawer") return <CashDrawerReconciliation add={add} />;
  // Communications
  if (screen === "internal-chat") return <InternalChat add={add} />;
  if (screen === "guest-messaging") return <GuestMessaging add={add} />;
  if (screen === "announcements") return <Announcements add={add} />;
  if (screen === "shift-handover") return <ShiftHandover add={add} />;
  if (screen === "complaint-management") return <ComplaintManagement add={add} />;
  if (screen === "complaint-dashboard") return <ComplaintDashboard />;
  // Finance — Batch 11
  if (screen === "night-audit") return <NightAudit add={add} />;
  if (screen === "tax-config") return <TaxConfiguration add={add} />;
  if (screen === "refund-processing") return <RefundProcessing add={add} />;
  if (screen === "folio-void") return <FolioVoidReversal add={add} />;
  // Finance
  if (screen === "invoices") return <InvoiceReceipts add={add} />;
  if (screen === "accounts-payable") return <AccountsPayable add={add} />;
  if (screen === "daily-summary") return <DailySummary add={add} />;
  if (screen === "rp-revenue" || screen === "revenue-reports") return <RevenueReports add={add} />;
  if (screen === "accounting-export") return <AccountingExport add={add} />;
  if (screen === "credit-notes") return <CreditNotes add={add} />;
  // Inventory
  if (screen === "stock-dashboard") return <StockDashboard add={add} />;
  if (screen === "products") return <ProductsScreen add={add} />;
  if (screen === "suppliers") return <SuppliersScreen add={add} />;
  if (screen === "stock-transactions") return <StockTransactions add={add} />;
  if (screen === "purchase-orders") return <PurchaseOrders add={add} />;
  // HR
  if (screen === "staff-directory") return <StaffDirectory add={add} nav={nav} />;
  if (screen === "staff-profile") return <StaffProfileDetail add={add} />;
  if (screen === "roles-permissions") return <RolesPermissions add={add} />;
  if (screen === "attendance") return <AttendanceScreen add={add} />;
  if (screen === "leave-management") return <LeaveManagement add={add} />;
  if (screen === "shift-scheduler") return <ShiftScheduler add={add} />;
  if (screen === "payroll") return <PayrollSummary add={add} />;
  // Multi-Branch
  if (screen === "branch-overview") return <BranchOverview add={add} nav={nav} />;
  if (screen === "branch-comparison") return <BranchComparison add={add} />;
  if (screen === "sync-status") return <CentralSyncStatus add={add} />;
  // Reports
  if (screen === "rp-occupancy") return <OccupancyReports add={add} />;
  if (screen === "rp-department") return <DepartmentReports add={add} />;
  if (screen === "rp-guest") return <GuestAnalytics add={add} />;
  if (screen === "rp-inventory") return <InventoryReports add={add} />;
  if (screen === "rp-staff") return <StaffReports add={add} />;
  // IT Admin
  if (screen === "system-health") return <SystemHealth add={add} />;
  if (screen === "user-management") return <UserManagement add={add} />;
  if (screen === "schema-update") return <SchemaUpdateStatus add={add} />;
  if (screen === "device-management") return <DeviceManagement add={add} />;
  if (screen === "backup-restore") return <BackupRestore add={add} />;
  if (screen === "audit-log") return <AuditLog add={add} />;
  if (screen === "error-log") return <ErrorLog add={add} />;
  // Settings
  if (screen === "hotel-config") return <HotelConfig add={add} />;
  if (screen === "door-lock-settings") return <DoorLockSettings add={add} />;
  if (screen === "my-preferences") return <MyPreferences add={add} />;
  if (screen === "settings-sync") return <SyncSettings add={add} />;
  if (screen === "print-settings") return <PrintSettings add={add} />;
  // Fleet
  if (screen === "dispatch-board") return <DispatchBoard add={add} nav={nav} />;
  if (screen === "trip-detail") return <TripDetail add={add} />;
  if (screen === "new-trip") return <NewTripRequest add={add} nav={nav} />;
  if (screen === "driver-roster") return <DriverRoster add={add} />;
  if (screen === "fleet-costing") return <FleetCosting add={add} />;

  return <PlaceholderScreen title="Screen" desc="This screen is coming soon." icon={LayoutDashboard} />;
}

// ─── App Root ─────────────────────────────────────────────────────────────────
// ─── App Root — manages auth layer routing ────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [loggedRole, setLoggedRole] = useState<Role>("MGT");
  const [firstLoginDone, setFirstLoginDone] = useState(false);

  const handleLogin = (role: string, dest: "hms" | "admin-console" | "org-portal") => {
    setLoggedRole(role as Role);
    if (dest === "admin-console") { setAuthState("admin-console"); return; }
    if (dest === "org-portal") { setAuthState("org-portal"); return; }
    // FD first login → force password change (demonstrates that flow)
    if (role === "FD" && !firstLoginDone) { setFirstLoginDone(true); setAuthState("force-change-password"); return; }
    setAuthState("hms");
  };

  const handleLogout = () => setAuthState("login");

  if (authState === "login") return <LoginScreen onLogin={handleLogin} />;
  if (authState === "admin-console") return <AdminConsole onLogout={handleLogout} />;
  if (authState === "org-portal") return <OrgPortal onLogout={handleLogout} />;
  if (authState === "force-change-password") return <ForceChangePasswordScreen onComplete={() => setAuthState("hms")} />;

  return <HMSApp initialRole={loggedRole} onLogout={handleLogout} />;
}

// ─── HMS App Shell ────────────────────────────────────────────────────────────
// ─── Session Expired Modal (HMS_Auth Part 7.1) ────────────────────────────────
function SessionExpiredModal({ offline, onStay, onSignOut }: { offline: boolean; onStay: () => void; onSignOut: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(9,26,21,0.6)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: "1px solid #E4E4E7" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: "#FEF3C7" }}>
          <Clock size={22} style={{ color: "#D97706" }} />
        </div>
        <h3 className="text-base font-bold text-center mb-1" style={{ color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
          {offline ? "Session Extended (Offline)" : "Session About to Expire"}
        </h3>
        <p className="text-sm text-center mb-5 leading-relaxed" style={{ color: "#71717A" }}>
          {offline
            ? "Your session token expired while offline. An 8-hour grace period extension has been issued automatically (HMS_Auth §7.1). Please re-authenticate when connectivity returns."
            : "Your 12-hour session will expire in 5 minutes. Stay signed in or you'll be redirected to the login screen."}
        </p>
        <div className="flex gap-3">
          <button onClick={onSignOut} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[#F9FAFB]" style={{ color: "#71717A", borderColor: "#E4E4E7" }}>
            Sign Out
          </button>
          <button onClick={onStay} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md" style={{ backgroundColor: PRIMARY }}>
            {offline ? "Continue Offline" : "Stay Signed In"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Permissions Changed Dialog (HMS_Auth Part 6.3) ───────────────────────────
function PermissionsChangedDialog({ onReLogin }: { onReLogin: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(9,26,21,0.6)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: "1px solid #E4E4E7" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: "#EEF2FF" }}>
          <Shield size={22} style={{ color: PRIMARY }} />
        </div>
        <h3 className="text-base font-bold text-center mb-1" style={{ color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
          Account Permissions Updated
        </h3>
        <p className="text-sm text-center mb-2 leading-relaxed" style={{ color: "#71717A" }}>
          Your role permissions were changed by a manager while you were logged in. Your current session has been invalidated (HMS_Auth §6.3).
        </p>
        <p className="text-xs text-center mb-5" style={{ color: "#A1A1AA" }}>Please sign in again to receive your updated permissions.</p>
        <button onClick={onReLogin} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
          Sign In Again
        </button>
      </div>
    </>
  );
}

// ─── Sidebar section groups ───────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Front Office",
    items: ["Dashboard", "Reservations", "Front Desk"],
  },
  {
    label: "Operations",
    items: ["Housekeeping", "Maintenance", "Restaurant / POS", "Communications"],
  },
  {
    label: "Management",
    items: ["Finance & Billing", "Inventory", "HR & Staff", "Multi-Branch"],
  },
  {
    label: "Intelligence",
    items: ["Reports", "IT Admin"],
  },
];

function HMSApp({ initialRole, onLogout }: { initialRole: Role; onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("Front Desk");
  const [screen, setScreen] = useState<Screen>("dashboard-mgmt");
  const [activeLabel, setActiveLabel] = useState("Dashboard");
  const [role, setRole] = useState<Role>(initialRole);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("All");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [offline, setOffline] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showPermsChanged, setShowPermsChanged] = useState(false);

  const add = useCallback((t: Omit<Toast, "id">) => {
    const id = uid();
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4500);
  }, []);
  const dismiss = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);

  const nav = (s: Screen, label: string) => {
    setScreen(s); setActiveLabel(label);
    setNotifOpen(false); setUserMenuOpen(false); setBranchMenuOpen(false);
  };

  const unread = NOTIFS.filter(n => n.unread).length;
  const parent = NAV.find(n => n.children?.some(c => c.screen === screen));
  const filteredN = notifFilter === "All" ? NOTIFS
    : notifFilter === "Urgent" ? NOTIFS.filter(n => n.category === "Emergency")
    : notifFilter === "Door Lock" ? NOTIFS.filter(n => n.category === "Door Lock")
    : notifFilter === "System" ? NOTIFS.filter(n => ["System", "Chat"].includes(n.category))
    : NOTIFS.filter(n => ["Reservation", "Housekeeping", "Maintenance", "Finance", "Restaurant"].includes(n.category));

  const ROLE_LABELS: Record<string, string> = { MGT: "Manager", FD: "Front Desk", HK: "Housekeeping", MX: "Maintenance", FIN: "Finance", RT: "Restaurant", RSV: "Reservations", IT: "IT Admin", PLT: "Platform", ORG: "Owner" };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: sans, backgroundColor: BG, WebkitFontSmoothing: "antialiased" }}>

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="flex flex-col h-full flex-shrink-0 transition-all duration-200 z-20 relative"
        style={{ width: collapsed ? 64 : 256, backgroundColor: NAV_BG, borderRight: "1px solid rgba(255,255,255,0.07)", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>

        {/* Brand area */}
        <div className="flex items-center gap-3 px-4 flex-shrink-0" style={{ height: 64, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center relative"
            style={{ backgroundColor: TEAL, boxShadow: "0 4px 12px rgba(27,163,156,0.35)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M4 21V8l8-5 8 5v13M9 21v-6h6v6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white leading-none truncate" style={{ fontFamily: display }}>Grand Palms</div>
              <div className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>Abuja Branch</div>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)") }
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent") }>
              <ChevronLeft size={13} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {NAV_SECTIONS.map(section => {
            const sectionItems = NAV.filter(n => section.items.includes(n.label));
            return (
              <div key={section.label} className="mb-1">
                {!collapsed && (
                  <div className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", fontFamily: display }}>
                    {section.label}
                  </div>
                )}
                {sectionItems.map(item => {
                  const Icon = item.icon;
                  const isActive = screen === item.screen || item.children?.some(c => c.screen === screen);
                  const isExp = expanded === item.label;
                  const hasChild = !!item.children?.length;
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          if (item.screen) nav(item.screen, item.label);
                          if (hasChild) {
                            if (collapsed) { setCollapsed(false); setExpanded(item.label); }
                            else setExpanded(p => p === item.label ? null : item.label);
                          }
                        }}
                        className="w-full flex items-center gap-2.5 text-left transition-all relative group"
                        style={{
                          padding: collapsed ? "9px 18px" : "8px 14px",
                          backgroundColor: isActive ? "rgba(27,163,156,0.14)" : "transparent",
                          borderLeft: isActive ? `2.5px solid ${TEAL}` : "2.5px solid transparent",
                          minHeight: 38,
                        }}
                        title={collapsed ? item.label : undefined}>
                        <div className="relative flex-shrink-0">
                          <Icon size={16} color={isActive ? "#FFFFFF" : "rgba(255,255,255,0.45)"} />
                          {!!item.badge && item.badge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: ERROR, fontSize: 8, color: "white", fontWeight: 700 }}>{item.badge}</span>
                          )}
                        </div>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-xs truncate" style={{ color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                            {hasChild && <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.28)", flexShrink: 0, transform: isExp ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms" }} />}
                          </>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 font-medium"
                            style={{ backgroundColor: PRIMARY, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 16px rgba(13,27,46,0.4)" }}>
                            {item.label}
                          </div>
                        )}
                      </button>
                      {!collapsed && hasChild && isExp && (
                        <div className="mb-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", marginLeft: 28 }}>
                          {item.children!.map(c => (
                            <button key={c.label} onClick={() => nav(c.screen, c.label)}
                              className="w-full text-left px-3 py-1.5 text-xs truncate transition-colors"
                              style={{ color: screen === c.screen ? TEAL : "rgba(255,255,255,0.38)", fontWeight: screen === c.screen ? 600 : 400, minHeight: 28 }}
                              onMouseEnter={e => { if (screen !== c.screen) e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                              onMouseLeave={e => { if (screen !== c.screen) e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}>
                              {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Quick actions */}
          {!collapsed && (
            <div className="mt-2 mx-3">
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)", fontFamily: display }}>Quick Actions</div>
                {[
                  { icon: Plus, label: "New Reservation", s: "new-reservation" as Screen, color: TEAL },
                  { icon: KeyRound, label: "Check-In", s: "check-in" as Screen, color: "#22C55E" },
                  { icon: ArrowRight, label: "Check-Out", s: "check-out" as Screen, color: ORANGE },
                ].map(qa => {
                  const Icon = qa.icon;
                  return (
                    <button key={qa.label} onClick={() => nav(qa.s, qa.label)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-white/5" style={{ minHeight: 32 }}>
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${qa.color}20` }}>
                        <Icon size={11} style={{ color: qa.color }} />
                      </div>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{qa.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User profile card at bottom */}
        <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: PRIMARY, border: "1px solid rgba(255,255,255,0.15)" }}>GM</div>
            </button>
          ) : (
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: PRIMARY, border: "1px solid rgba(255,255,255,0.15)" }}>GM</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">Grace Mensah</div>
                  <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.38)" }}>{ROLE_LABELS[role] ?? role}</div>
                </div>
                <button onClick={onLogout} className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.38)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  title="Sign out">
                  <LogOut size={12} />
                </button>
              </div>
              <div className="flex gap-2 mt-2.5">
                <button onClick={() => nav("my-preferences", "My Preferences")}
                  className="flex-1 text-xs py-1.5 rounded-lg text-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  Preferences
                </button>
                <select value={role} onChange={e => setRole(e.target.value as Role)}
                  className="flex-1 text-xs py-1.5 rounded-lg text-center outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "none" }}
                  title="Switch role (demo)">
                  {(["MGT", "FD", "HK", "MX", "FIN", "RT", "RSV", "IT"] as Role[]).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main column ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="flex-shrink-0 bg-white relative"
          style={{ borderBottom: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(13,27,46,0.06)" }}>

          <div className="flex items-center px-5 gap-4" style={{ height: 60 }}>
            {/* Left: hotel brand + page context */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {collapsed && (
                <button onClick={() => setCollapsed(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: MUTED }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <MenuIcon size={17} />
                </button>
              )}
              <div className="flex items-center gap-2.5">
                <div className="hidden md:block">
                  <div className="text-sm font-bold leading-none" style={{ color: TEXT, fontFamily: display }}>Grand Palms</div>
                  <div className="text-xs mt-0.5" style={{ color: SUBTLE }}>
                    {parent ? `${parent.label} · ${activeLabel}` : activeLabel}
                  </div>
                </div>
              </div>
              {/* Separator */}
              <div className="hidden lg:block w-px h-6 mx-1" style={{ backgroundColor: BORDER }} />
              {/* Date + time */}
              <div className="hidden lg:block">
                <LiveClock />
              </div>
            </div>

          {/* Center: search */}
          <div className="flex-1 flex items-center justify-center px-4 max-w-lg mx-auto">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SUBTLE }} />
              <input
                placeholder="Search guests, rooms, reservations…"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: searchFocused ? "#fff" : BG,
                  border: `1.5px solid ${searchFocused ? PRIMARY : BORDER}`,
                  color: TEXT,
                }}
              />
            </div>
          </div>

          {/* Right rail */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Shift pill */}
            <button onClick={() => nav("shift-handover", "Shift Handover")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{ color: MUTED, border: `1px solid ${BORDER}` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
              <span style={{ color: TEXT }}>Morning</span>
              <span>07:00–15:00</span>
            </button>

            {/* Sync pill */}
            <button
              onClick={() => {
                setOffline(p => !p);
                add({ type: offline ? "success" : "warning", title: offline ? "Back online — syncing…" : "Simulating offline mode", body: offline ? "5 pending items pushed" : "Changes will queue until reconnected" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: offline ? "#FEF3C7" : "#CCFBF1", color: offline ? "#92400E" : "#0F766E", border: `1px solid ${offline ? "#FDE68A" : "#99F6E4"}` }}
              title={offline ? "Click to go online" : "Click to simulate offline"}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: offline ? "#FFA000" : "#22C55E" }} />
              {offline ? "Offline" : "Synced"}
            </button>

            {/* Auth demo */}
            <div className="relative hidden xl:block group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{ color: MUTED, border: `1px solid ${BORDER}` }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Shield size={12} style={{ color: PRIMARY }} />Auth Demo
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-lg border overflow-hidden z-50 hidden group-hover:block" style={{ backgroundColor: "white", borderColor: BORDER, boxShadow: "0 8px 32px rgba(13,27,46,0.12)" }}>
                <div className="px-3 py-2 border-b text-xs font-semibold" style={{ color: MUTED, borderColor: BG }}>Auth Event Demos</div>
                <button onClick={() => setShowSessionExpired(true)} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left" style={{ color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Clock size={12} style={{ color: WARNING }} />Session Expired (§7.1)
                </button>
                <button onClick={() => setShowPermsChanged(true)} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left" style={{ color: TEXT }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Shield size={12} style={{ color: PRIMARY }} />Permissions Changed (§6.3)
                </button>
              </div>
            </div>

            {/* Branch switcher */}
            <div className="relative hidden md:block">
              <button onClick={() => { setBranchMenuOpen(p => !p); setUserMenuOpen(false); setNotifOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{ color: MUTED, border: `1px solid ${BORDER}` }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Globe size={12} /><span style={{ color: TEXT }}>Abuja</span><ChevronDown size={11} style={{ color: SUBTLE }} />
              </button>
              {branchMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl z-50 border overflow-hidden" style={{ backgroundColor: "white", borderColor: BORDER, boxShadow: "0 8px 32px rgba(13,27,46,0.12)" }}>
                  {BRANCHES.map(b => (
                    <button key={b.id} onClick={() => { setBranchMenuOpen(false); add({ type: "info", title: `Switched to ${b.name}` }); }}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-xs" style={{ color: TEXT }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <span>{b.name}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.status === "synced" ? SUCCESS : WARNING }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button onClick={() => { setNotifOpen(p => !p); setUserMenuOpen(false); setBranchMenuOpen(false); }}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ border: `1px solid ${BORDER}` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Bell size={16} style={{ color: MUTED }} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ fontSize: 9, backgroundColor: ERROR }}>{unread}</span>
              )}
            </button>

            {/* User avatar */}
            <div className="relative">
              <button onClick={() => { setUserMenuOpen(p => !p); setNotifOpen(false); setBranchMenuOpen(false); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors"
                style={{ border: `1px solid ${BORDER}` }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>GM</div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-none" style={{ color: TEXT }}>Grace Mensah</div>
                  <div className="text-xs mt-0.5 uppercase tracking-wider" style={{ color: SUBTLE, fontSize: 9 }}>{role}</div>
                </div>
                <ChevronDown size={11} style={{ color: SUBTLE }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl z-50 border overflow-hidden" style={{ backgroundColor: "white", borderColor: BORDER, boxShadow: "0 8px 32px rgba(13,27,46,0.12)" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: BG }}>
                    <div className="text-xs font-semibold" style={{ color: TEXT }}>Grace Mensah</div>
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>manager@grandpalms.ng · {role}</div>
                  </div>
                  {[
                    { icon: User, label: "My Profile", fn: () => { setUserMenuOpen(false); nav("my-preferences", "My Preferences"); } },
                    { icon: KeyRound, label: "Change Password", fn: () => { setUserMenuOpen(false); add({ type: "info", title: "Change Password", body: "Go to My Preferences → Security" }); } },
                    { icon: Layers, label: "Switch Role (Demo)", fn: () => setUserMenuOpen(false) },
                    { icon: LogOut, label: "Sign Out", fn: () => { setUserMenuOpen(false); onLogout(); }, danger: true },
                  ].map(({ icon: Icon, label, fn, danger }) => (
                    <button key={label} onClick={fn}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs transition-colors"
                      style={{ color: danger ? ERROR : TEXT }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <Icon size={13} style={{ color: danger ? ERROR : MUTED }} />{label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>{/* closes flex items-center row */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-8" style={{ scrollbarWidth: "none", backgroundColor: BG }}>
          <div className="max-w-screen-2xl mx-auto">
            {offline && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-5 text-sm font-medium"
                style={{ backgroundColor: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>
                <WifiOff size={15} />
                <span>Offline — showing last synced data. Changes will sync automatically when reconnected.</span>
                <button onClick={() => { setOffline(false); add({ type: "success", title: "Back online — syncing…" }); }}
                  className="ml-auto text-xs px-2.5 py-1 rounded-lg font-medium hover:opacity-80"
                  style={{ backgroundColor: WARNING, color: "white" }}>
                  Go Online
                </button>
              </div>
            )}
            <Router screen={screen} add={add} role={role} nav={nav} />
          </div>
        </main>
      </div>

      {/* ── Notification panel ───────────────────────────────────────────── */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-30" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setNotifOpen(false)} />
          <div className="fixed right-0 top-0 h-full z-40 flex flex-col shadow-2xl" style={{ width: 400, backgroundColor: "white", borderLeft: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <h2 className="text-sm font-semibold" style={{ color: TEXT, fontFamily: display }}>Notifications</h2>
              <div className="flex items-center gap-2">
                <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>Mark all read</button>
                <button onClick={() => setNotifOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: SUBTLE }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex border-b" style={{ borderColor: BORDER }}>
              {["All", "Urgent", "Operational", "System", "Door Lock"].map(tab => (
                <button key={tab} onClick={() => setNotifFilter(tab)} className="flex-1 text-xs font-medium py-2.5"
                  style={{ color: notifFilter === tab ? PRIMARY : MUTED, borderBottom: notifFilter === tab ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {filteredN.length === 0 && <EmptyState icon={Bell} message="No notifications in this category." />}
              {filteredN.map(n => {
                const NIcon = n.icon;
                return (
                  <div key={n.id} className="flex gap-3 px-5 py-4 border-b cursor-pointer group transition-colors"
                    style={{ borderLeft: `3px solid ${n.color}`, minHeight: 68, borderBottomColor: BORDER }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${n.color}18` }}>
                      <NIcon size={16} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold" style={{ color: TEXT }}>{n.title}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {n.unread && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3B82F6" }} />}
                          <button className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center" style={{ color: SUBTLE }}><X size={12} /></button>
                        </div>
                      </div>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: MUTED }}>{n.body}</p>
                      <span className="text-xs mt-1 inline-block" style={{ color: SUBTLE }}>{n.time} ago</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
              <button className="w-full py-2 text-xs font-medium rounded-lg transition-colors" style={{ color: TEAL }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#CCFBF1")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}

      <ToastC toasts={toasts} dismiss={dismiss} />

      {/* HMS_Auth §7.1 — Session Expired */}
      {showSessionExpired && (
        <SessionExpiredModal
          offline={offline}
          onStay={() => { setShowSessionExpired(false); add({ type: "success", title: "Session extended", body: "Token refreshed — 12 hours remaining" }); }}
          onSignOut={() => { setShowSessionExpired(false); onLogout(); }}
        />
      )}

      {/* HMS_Auth §6.3 — Permissions Changed */}
      {showPermsChanged && (
        <PermissionsChangedDialog onReLogin={() => { setShowPermsChanged(false); onLogout(); }} />
      )}
    </div>
  );
}
