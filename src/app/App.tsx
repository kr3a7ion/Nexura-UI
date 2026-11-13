// Lean shell: sidebar, header, notification panel, Router, App root.
// All screen components live in Screens.tsx. All data/constants in constants.ts.
import { useState, useCallback, useEffect, useMemo } from "react";
import { lazy, Suspense } from "react";
import {
  SquaresFour, CalendarDots, Key, Bed, Wrench,
  ForkKnife, Chat, CurrencyDollar, Package, Users,
  Buildings, ChartBar, GearSix, CaretLeft, CaretRight,
  Bell, SignOut, User, CaretDown, Warning, Plus,
  DotsThree, ArrowRight, House, Stack, XCircle, Lock, Globe,
  ClipboardText, CalendarCheck, Star, WarningCircle, FileText, CreditCard, Truck,
  Shield, Cpu, Pulse, ArrowClockwise, Hash, Phone, PencilSimple, Eye, Trash,
  DownloadSimple, PaperPlaneRight, List as MenuIcon, Question, CheckCircle, MagnifyingGlass, WifiSlash, Clock,
  TrendUp, TrendDown, UserCheck, Car, Flag,
} from "@phosphor-icons/react";

// ─── Shared data & types ─────────────────────────────────────────────────────
import {
  type Role, type Screen, type Toast, type ToastType,
  uid, fmtN,
  mono, sans, display, NAV_BG, PRIMARY, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  NOTIFS, BRANCHES,
} from "./constants";
import { LoginScreen, ForceChangePasswordScreen, LockScreen, ChooseHotelScreen } from "./AuthScreens";
import type { LoginAccount } from "./mock/staffLogin";
import AdminConsole from "./PlatformAdminConsole";
import OrgPortal from "./OrgPortalScreens";
import { PrintTemplates } from "./PrintTemplates";
import { FieldApp } from "./FieldApp";
import { GuestPortal } from "./GuestPortal";
import { BrandLockup } from "./brand/Brand";
import FrontOfficeHome from "./suite/home/front-officeHome";
import AccessSecurityHome from "./suite/home/access-securityHome";
import HousekeepingHome from "./suite/home/housekeepingHome";
import MaintenanceHome from "./suite/home/maintenanceHome";
import RestaurantPosHome from "./suite/home/restaurant-posHome";
import FinanceHome from "./suite/home/financeHome";
import InventoryHome from "./suite/home/inventoryHome";
import HrHome from "./suite/home/hrHome";
const CommunicationsHome = lazy(() => import("./suite/home/communicationsHome"));
const FleetHome = lazy(() => import("./suite/home/fleetHome"));
import { SuiteHome, DepartmentHome } from "./suite/SuiteHome";
import {
  DEPARTMENTS, departmentForScreen, departmentsForRole,
  type Department, type DepartmentId,
} from "./suite/departments";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "./components/ui/command";

type AuthState = "login" | "field-app" | "choose-hotel" | "guest-access" | "hms" | "admin-console" | "org-portal" | "force-change-password";

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
  DispatchBoard, TripDetail, NewTripRequest, DriverRoster, FleetCosting, DriverAccessLog,
  VehicleRegister, VehicleDetail, FuelLog, GeneratorDieselLog,
} from "./Screens";

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
type NavFn = (s: Screen, label: string, param?: string) => void;

// ─── Router ───────────────────────────────────────────────────────────────────
function Router({ screen, add, role, nav, staffName, navParam }: { screen: Screen; add: (t: Omit<Toast, "id">) => void; role: Role; nav: NavFn; staffName: string; navParam: string }) {
  if ((screen as string) === "dept-front-office") return <FrontOfficeHome nav={nav} />;
  if ((screen as string) === "dept-access-security") return <AccessSecurityHome nav={nav} />;
  if ((screen as string) === "dept-housekeeping") return <HousekeepingHome nav={nav} />;
  if ((screen as string) === "dept-maintenance") return <MaintenanceHome nav={nav} />;
  if ((screen as string) === "dept-restaurant-pos") return <RestaurantPosHome nav={nav} />;
  if ((screen as string) === "dept-finance") return <FinanceHome nav={nav} />;
  if ((screen as string) === "dept-inventory") return <InventoryHome nav={nav} />;
  if ((screen as string) === "dept-hr") return <HrHome nav={nav} />;
  if ((screen as string) === "dept-communications") return <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-white" />}><CommunicationsHome nav={nav} /></Suspense>;
  if ((screen as string) === "dept-fleet") return <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-white" />}><FleetHome nav={nav} /></Suspense>;
  // Dashboard — MGT sees full hotel overview; every other role sees their own focused view
  if (screen === "dashboard-mgmt" || screen === "dashboard-role") {
    if (role === "MGT") return <DashboardMgmt add={add} nav={nav} />;
    return <DashboardRole role={role} nav={nav} />;
  }
  // Reservations
  if (screen === "reservation-grid") return <ReservationGrid add={add} nav={nav} />;
  if (screen === "new-reservation") return <NewReservation add={add} nav={nav} initialGuestName={navParam} />;
  if (screen === "reservation-search") return <ReservationSearch add={add} nav={nav} />;
  if (screen === "reservation-detail") return <ReservationDetail add={add} nav={nav} resId={navParam} />;
  if (screen === "group-bookings") return <GroupBookings add={add} />;
  if (screen === "waitlist") return <Waitlist add={add} />;
  if (screen === "rate-management") return <RateManagement add={add} />;
  if (screen === "cancellation") return <CancellationRefund add={add} />;
  if (screen === "room-types") return <RoomTypeManagement add={add} />;
  if (screen === "rate-calendar") return <RateCalendar add={add} />;
  if (screen === "availability-board") return <AvailabilityBoard add={add} nav={nav} />;
  // Front Desk
  if (screen === "check-in") return <CheckInWizard add={add} initialReservationId={navParam} />;
  if (screen === "check-out") return <CheckOut add={add} initialReservationId={navParam} />;
  if (screen === "in-house-guests") return <InHouseGuests add={add} nav={nav} />;
  if (screen === "guest-profiles") return <GuestProfiles add={add} nav={nav} />;
  if (screen === "guest-profile-detail") return <GuestProfileDetail add={add} nav={nav} guestId={navParam} />;
  if (screen === "folio") return <FolioScreen add={add} nav={nav} />;
  if (screen === "finance-folio") return <FinanceFolioManagement add={add} nav={nav} />;
  if (screen === "arrivals") return <ArrivalsScreen add={add} nav={nav} />;
  if (screen === "departures") return <DeparturesScreen add={add} nav={nav} />;
  if (screen === "room-assignment") return <RoomAssignmentBoard add={add} nav={nav} />;
  if (screen === "walk-in") return <WalkInReg add={add} nav={nav} />;
  if (screen === "key-card") return <KeyCardMgmt add={add} />;
  if (screen === "room-access") return <RoomAccessMgmt add={add} nav={nav} />;
  if (screen === "key-card-log") return <KeyCardLog add={add} />;
  if (screen === "pin-management") return <PINManagement add={add} nav={nav} />;
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
  if ((screen as string) === "print-templates") return <PrintTemplates />;
  // Fleet
  if (screen === "dispatch-board") return <DispatchBoard add={add} nav={nav} />;
  if (screen === "trip-detail") return <TripDetail add={add} />;
  if (screen === "new-trip") return <NewTripRequest add={add} nav={nav} deptRole={role} />;
  if (screen === "driver-roster") return <DriverRoster add={add} />;
  if (screen === "driver-access-log") return <DriverAccessLog add={add} driverName={role === "DRV" ? staffName : undefined} role={role} />;
  if (screen === "fleet-costing") return <FleetCosting add={add} />;
  // Fleet Assets & Fuel
  if (screen === "vehicle-register") return <VehicleRegister add={add} nav={nav} />;
  if (screen === "vehicle-detail") return <VehicleDetail add={add} />;
  if (screen === "fuel-log") return <FuelLog add={add} />;
  if (screen === "generator-diesel") return <GeneratorDieselLog add={add} role={role} />;

  return <PlaceholderScreen title="Screen" desc="This screen is coming soon." icon={SquaresFour} />;
}

// ─── App Root ─────────────────────────────────────────────────────────────────
const IDLE_LOCK_MS = 15 * 60 * 1000;

// ─── App Root — manages auth layer routing ────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState<AuthState>(window.location.hash.startsWith("#guest-access") ? "guest-access" : "login");
  const [loggedRole, setLoggedRole] = useState<Role>("MGT");
  const [staffName, setStaffName]   = useState("Adaeze Okonkwo");
  const [firstLoginDone, setFirstLoginDone] = useState(false);
  const [account, setAccount] = useState<LoginAccount | null>(null);
  const [locked, setLocked] = useState(false);
  // Owners and platform admins sign in at #/owner or #/platform; everyone else uses the hotel terminal login.
  const isCloudHash = () => /^#\/(owner|platform)/.test(window.location.hash);
  const [cloudLogin, setCloudLogin] = useState(isCloudHash);
  useEffect(() => {
    const onHash = () => setCloudLogin(isCloudHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleLogin = (next: LoginAccount) => {
    setAccount(next);
    setLoggedRole(next.role as Role);
    setStaffName(next.name);
    if (next.role === "ORG") { setAuthState(next.branches > 1 ? "choose-hotel" : "org-portal"); return; }
    if (next.destination !== "hms") { setAuthState(next.destination); return; }
    if (next.role === "FD" && !firstLoginDone) { setFirstLoginDone(true); setAuthState("force-change-password"); return; }
    setAuthState("hms");
  };

  const handleLogout = () => { setLocked(false); setAccount(null); setAuthState("login"); };

  // Shared terminals: lock the suite after 15 minutes without a key press or pointer move.
  const signedIn = authState === "hms" || authState === "admin-console" || authState === "org-portal";
  useEffect(() => {
    if (!signedIn || locked) return;
    let timer = window.setTimeout(() => setLocked(true), IDLE_LOCK_MS);
    const reset = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setLocked(true), IDLE_LOCK_MS); };
    const events = ["pointerdown", "pointermove", "keydown", "wheel"] as const;
    events.forEach(name => window.addEventListener(name, reset, { passive: true }));
    return () => { window.clearTimeout(timer); events.forEach(name => window.removeEventListener(name, reset)); };
  }, [signedIn, locked]);
  const lock = locked && account ? <LockScreen account={account} onUnlock={() => setLocked(false)} onSignOut={handleLogout} /> : null;

  if (authState === "login") return <LoginScreen key={cloudLogin ? "cloud" : "staff"} kind={cloudLogin ? "cloud" : "staff"} onLogin={handleLogin} onOpenFieldApp={cloudLogin ? undefined : () => setAuthState("field-app")} />;
  if (authState === "field-app") return <FieldApp onExit={() => setAuthState("login")} />;
  if (authState === "choose-hotel" && account) return <ChooseHotelScreen account={account} onContinue={() => setAuthState("org-portal")} onSignOut={handleLogout} />;
  if (authState === "guest-access") return <GuestPortal qrLanding={window.location.hash.includes("/qr")} onExit={() => { window.location.hash = ""; setAuthState("login"); }} />;
  if (authState === "admin-console") return <>{lock}<AdminConsole onLogout={handleLogout} /></>;
  if (authState === "org-portal") return <>{lock}<OrgPortal onLogout={handleLogout} /></>;
  if (authState === "force-change-password") return <ForceChangePasswordScreen temporaryPassword={account?.password ?? ""} onComplete={() => setAuthState("hms")} />;

  return <>{lock}<HMSApp initialRole={loggedRole} staffName={staffName} onLogout={handleLogout} onOpenPortal={portal => setAuthState(portal)} /></>;
}

// ─── HMS App Shell ────────────────────────────────────────────────────────────
// ─── Session Expired Modal (HMS_Auth Part 7.1) ────────────────────────────────
function SessionExpiredModal({ offline, onStay, onSignOut }: { offline: boolean; onStay: () => void; onSignOut: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(9,26,21,0.6)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ border: "1px solid #E4E4E7" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: "#FEF3C7" }}>
          <Clock size={22} style={{ color: "#D97706" }} weight="bold" />
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
          <Shield size={22} style={{ color: PRIMARY }} weight="bold" />
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

// ─── Department suite shell ───────────────────────────────────────────────────
type SuiteScreen = Screen | "suite-home" | Department["home"];
type SuitePortal = "field-app" | "guest-access" | "org-portal" | "admin-console";

function HMSApp({ initialRole, staffName, onLogout, onOpenPortal }: {
  initialRole: Role;
  staffName: string;
  onLogout: () => void;
  onOpenPortal: (portal: SuitePortal) => void;
}) {
  const initialDepartments = departmentsForRole(initialRole);
  const [collapsed, setCollapsed] = useState(false);
  const [screen, setScreen] = useState<SuiteScreen>("suite-home");
  const [activeLabel, setActiveLabel] = useState("Suite Home");
  const [navParam, setNavParam] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [currentDepartmentId, setCurrentDepartmentId] = useState<DepartmentId>(initialDepartments[0]?.id ?? "front-office");
  const [pinned, setPinned] = useState<DepartmentId[]>(initialDepartments.slice(0, 2).map(department => department.id));
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("All");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [offline, setOffline] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showPermsChanged, setShowPermsChanged] = useState(false);

  const allowedDepartments = useMemo(() => departmentsForRole(role), [role]);
  const currentDepartment = allowedDepartments.find(department => department.id === currentDepartmentId) ?? allowedDepartments[0];
  const searchableScreens = useMemo(() => {
    const seen = new Set<string>();
    return allowedDepartments.flatMap(department => department.screens.flatMap(group => group.items.map(item => ({ ...item, department })))).filter(item => {
      if (seen.has(item.screen)) return false;
      seen.add(item.screen);
      return true;
    });
  }, [allowedDepartments]);

  useEffect(() => {
    const openCommand = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(previous => !previous);
      }
    };
    window.addEventListener("keydown", openCommand);
    return () => window.removeEventListener("keydown", openCommand);
  }, []);

  const add = useCallback((toast: Omit<Toast, "id">) => {
    const id = uid();
    setToasts(previous => [...previous, { ...toast, id }]);
    setTimeout(() => setToasts(previous => previous.filter(item => item.id !== id)), 4500);
  }, []);
  const dismiss = useCallback((id: string) => setToasts(previous => previous.filter(toast => toast.id !== id)), []);

  const nav = (nextScreen: SuiteScreen, label: string, param = "") => {
    const department = departmentForScreen(nextScreen);
    if (department && (role === "MGT" || department.roles.includes(role))) setCurrentDepartmentId(department.id);
    setScreen(nextScreen);
    setActiveLabel(label);
    setNavParam(param);
    setNotifOpen(false);
    setUserMenuOpen(false);
    setAppSwitcherOpen(false);
    setCommandOpen(false);
  };

  const openDepartment = (department: Department) => {
    setCurrentDepartmentId(department.id);
    nav(department.home, department.name);
  };

  const togglePin = (id: DepartmentId) => {
    setPinned(previous => previous.includes(id) ? previous.filter(item => item !== id) : previous.length < 6 ? [...previous, id] : previous);
  };

  const switchRole = (nextRole: Role) => {
    const nextDepartments = departmentsForRole(nextRole);
    setRole(nextRole);
    setCurrentDepartmentId(nextDepartments[0]?.id ?? "front-office");
    setScreen("suite-home");
    setActiveLabel("Suite Home");
    setPinned(previous => previous.filter(id => nextDepartments.some(department => department.id === id)));
  };

  const initials = staffName.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
  const unread = NOTIFS.filter(notification => notification.unread).length;
  const filteredNotifications = notifFilter === "All" ? NOTIFS
    : notifFilter === "Urgent" ? NOTIFS.filter(notification => notification.category === "Emergency")
    : notifFilter === "Door Lock" ? NOTIFS.filter(notification => notification.category === "Door Lock")
    : notifFilter === "System" ? NOTIFS.filter(notification => ["System", "Chat"].includes(notification.category))
    : NOTIFS.filter(notification => ["Reservation", "Housekeeping", "Maintenance", "Finance", "Restaurant"].includes(notification.category));
  const roleLabels: Record<Role, string> = { MGT: "Manager", FLT: "Fleet Supervisor", FD: "Front Desk", HK: "Housekeeping", MX: "Maintenance", FIN: "Finance", RT: "Restaurant", RSV: "Reservations", IT: "IT Admin", DRV: "Driver" };
  const currentFlow = currentDepartment?.flow ?? [];
  const activeFlowIndex = currentFlow.findIndex(step => step.screen === screen);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: sans, backgroundColor: BG, WebkitFontSmoothing: "antialiased" }}>
      <aside className="relative z-20 flex h-full flex-shrink-0 flex-col overflow-hidden transition-all duration-200" style={{ width: collapsed ? 64 : 256, backgroundColor: NAV_BG, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/10 px-4">
          <div className="min-w-0 flex-1 overflow-hidden"><BrandLockup size={32} tone="dark" /></div>
          {!collapsed && <button onClick={() => setCollapsed(true)} className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/10"><CaretLeft size={13} weight="bold" /></button>}
        </div>

        <nav className="flex-1 overflow-y-auto py-3" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => nav("suite-home", "Suite Home")} className="group relative flex min-h-10 w-full items-center gap-3 px-[18px] text-left" style={{ backgroundColor: screen === "suite-home" ? "rgba(255,255,255,0.08)" : "transparent", borderLeft: screen === "suite-home" ? `3px solid ${TEAL}` : "3px solid transparent" }} title={collapsed ? "Suite Home" : undefined}>
            <SquaresFour size={18} style={{ color: screen === "suite-home" ? "white" : "rgba(255,255,255,.48)" }} />
            {!collapsed && <span className="text-xs font-semibold" style={{ color: screen === "suite-home" ? "white" : "rgba(255,255,255,.58)" }}>Suite Home</span>}
          </button>

          {currentDepartment && (
            <div className="mt-3">
              <button onClick={() => openDepartment(currentDepartment)} className="flex min-h-11 w-full items-center gap-3 px-[18px] text-left" style={{ backgroundColor: screen === currentDepartment.home ? `${currentDepartment.accent}24` : "transparent", borderLeft: screen === currentDepartment.home ? `3px solid ${currentDepartment.accent}` : "3px solid transparent" }} title={collapsed ? currentDepartment.name : undefined}>
                <currentDepartment.icon size={18} style={{ color: currentDepartment.accent }} />
                {!collapsed && <div className="min-w-0"><div className="truncate text-xs font-bold text-white">{currentDepartment.name}</div><div className="mt-0.5 text-[9px] uppercase tracking-widest text-white/30">Department</div></div>}
              </button>
              {currentDepartment.screens.map(group => (
                <div key={group.label} className="mt-3">
                  {!collapsed && <div className="px-5 pb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/25">{group.label}</div>}
                  {group.items.map(item => {
                    const isActive = screen === item.screen;
                    return <button key={`${group.label}-${item.screen}`} onClick={() => nav(item.screen, item.label)} className="group relative flex min-h-9 w-full items-center gap-3 px-[18px] text-left" style={{ backgroundColor: isActive ? `${currentDepartment.accent}1c` : "transparent", borderLeft: isActive ? `3px solid ${currentDepartment.accent}` : "3px solid transparent" }} title={collapsed ? item.label : undefined}>
                      <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ backgroundColor: isActive ? currentDepartment.accent : "rgba(255,255,255,.25)" }} />
                      {!collapsed && <span className="truncate text-xs" style={{ color: isActive ? "white" : "rgba(255,255,255,.48)", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>}
                      {collapsed && <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs text-white opacity-0 shadow-xl group-hover:opacity-100" style={{ backgroundColor: PRIMARY }}>{item.label}</span>}
                    </button>;
                  })}
                </div>
              ))}
            </div>
          )}
        </nav>

        <div className="flex-shrink-0 border-t border-white/10 p-3">
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="flex w-full justify-center rounded-lg py-2 hover:bg-white/10"><div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: PRIMARY, border: "1px solid rgba(255,255,255,.16)" }}>{initials}</div></button>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[.05] p-3">
              <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: PRIMARY, border: "1px solid rgba(255,255,255,.16)" }}>{initials}</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{staffName}</div><div className="truncate text-xs text-white/35">{roleLabels[role]}</div></div><button onClick={onLogout} className="flex h-7 w-7 items-center justify-center rounded-md text-white/35 hover:bg-white/10" title="Sign out"><SignOut size={13} /></button></div>
              <select value={role} onChange={event => switchRole(event.target.value as Role)} className="mt-3 w-full cursor-pointer rounded-lg border-0 bg-white/[.07] px-2 py-2 text-xs text-white/55 outline-none" title="Switch role (demo)">{(["MGT", "FLT", "FD", "HK", "MX", "FIN", "RT", "RSV", "IT", "DRV"] as Role[]).map(item => <option key={item} value={item}>{item} · {roleLabels[item]}</option>)}</select>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex-shrink-0 bg-white" style={{ borderBottom: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(13,27,46,.05)" }}>
          <div className="flex h-[60px] items-center gap-3 px-4 lg:px-5">
            {collapsed && <button onClick={() => setCollapsed(false)} className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: MUTED }}><MenuIcon size={17} /></button>}
            <div className="relative">
              <button onClick={() => { setAppSwitcherOpen(previous => !previous); setUserMenuOpen(false); }} className="flex h-9 w-9 items-center justify-center rounded-xl border bg-white" style={{ borderColor: BORDER, color: PRIMARY }} title="Open app switcher"><SquaresFour size={18} weight="fill" /></button>
              {appSwitcherOpen && <div className="absolute left-0 top-full mt-2 w-[340px] rounded-2xl border bg-white p-3 shadow-2xl" style={{ borderColor: BORDER }}><div className="mb-2 px-1 text-xs font-bold" style={{ color: TEXT }}>Department suite</div><div className="grid grid-cols-3 gap-2">{allowedDepartments.map(department => { const Icon = department.icon; return <button key={department.id} onClick={() => openDepartment(department)} className="rounded-xl border p-2.5 text-left hover:shadow-sm" style={{ borderColor: currentDepartment?.id === department.id ? department.accent : BORDER, backgroundColor: currentDepartment?.id === department.id ? `${department.accent}08` : "white" }}><div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${department.accent}14`, color: department.accent }}><Icon size={16} /></div><div className="line-clamp-2 text-[11px] font-semibold leading-tight" style={{ color: TEXT }}>{department.name}</div></button>; })}</div></div>}
            </div>

            <div className="hidden min-w-0 sm:block">
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: TEXT }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: screen === "suite-home" ? TEAL : currentDepartment?.accent ?? TEAL }} />{screen === "suite-home" ? "Nexura Suite" : currentDepartment?.name}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px]" style={{ color: SUBTLE }}><button onClick={() => nav("suite-home", "Suite Home")}>Suite Home</button>{screen !== "suite-home" && <><CaretRight size={9} /><span className="truncate">{activeLabel}</span></>}</div>
            </div>

            <div className="mx-auto flex max-w-xl flex-1 justify-center px-2">
              <button onClick={() => setCommandOpen(true)} className="flex h-9 w-full max-w-md items-center gap-2 rounded-xl border px-3 text-left text-sm" style={{ backgroundColor: BG, borderColor: BORDER, color: MUTED }}><MagnifyingGlass size={15} /><span className="truncate">Search or jump to a screen…</span><span className="ml-auto hidden rounded-md border bg-white px-1.5 py-0.5 text-[10px] sm:inline" style={{ borderColor: BORDER, color: SUBTLE }}>⌘ K</span></button>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={() => { setOffline(previous => !previous); add({ type: offline ? "success" : "warning", title: offline ? "Back online — syncing…" : "Simulating offline mode" }); }} className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold sm:flex" style={{ backgroundColor: offline ? "#FEF3C7" : "#ECFDF5", borderColor: offline ? "#FDE68A" : "#A7F3D0", color: offline ? "#92400E" : "#047857" }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: offline ? WARNING : SUCCESS }} />{offline ? "Offline" : "Synced"}</button>
              <button onClick={() => { setNotifOpen(previous => !previous); setUserMenuOpen(false); }} className="relative flex h-9 w-9 items-center justify-center rounded-xl border" style={{ borderColor: BORDER }}><Bell size={16} style={{ color: MUTED }} weight="bold" />{unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: ERROR }}>{unread}</span>}</button>
              <div className="relative"><button onClick={() => { setUserMenuOpen(previous => !previous); setNotifOpen(false); setAppSwitcherOpen(false); }} className="flex items-center gap-2 rounded-xl border px-2 py-1" style={{ borderColor: BORDER }}><div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{initials}</div><CaretDown size={11} style={{ color: SUBTLE }} /></button>{userMenuOpen && <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-xl" style={{ borderColor: BORDER }}><div className="border-b px-4 py-3" style={{ borderColor: BORDER }}><div className="text-xs font-semibold" style={{ color: TEXT }}>{staffName}</div><div className="mt-0.5 text-xs" style={{ color: MUTED }}>{roleLabels[role]}</div></div><button onClick={() => nav("my-preferences", "My Preferences")} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs" style={{ color: TEXT }}><User size={13} />My Profile</button><button onClick={() => setShowSessionExpired(true)} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs" style={{ color: TEXT }}><Lock size={13} />Auth demo</button><button onClick={onLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs" style={{ color: ERROR }}><SignOut size={13} />Sign Out</button></div>}</div>
            </div>
          </div>
        </header>

        {currentFlow.length > 0 && (
          <div className="flex flex-shrink-0 items-center gap-2 overflow-x-auto border-b bg-white px-6 py-2" style={{ borderColor: BORDER }}><span className="mr-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: SUBTLE }}>Flow</span>{currentFlow.map((step, index) => { const active = index === activeFlowIndex; const complete = activeFlowIndex > index; return <button key={`${step.screen}-${index}`} onClick={() => nav(step.screen, step.label)} className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold" style={{ color: active ? currentDepartment?.accent : complete ? SUCCESS : MUTED }}><span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px]" style={{ backgroundColor: active ? `${currentDepartment?.accent}18` : complete ? "#ECFDF5" : BG }}>{complete ? <CheckCircle size={13} weight="fill" /> : index + 1}</span>{step.label}{index < currentFlow.length - 1 && <CaretRight size={11} style={{ color: BORDER }} />}</button>; })}</div>
        )}

        <main className="flex-1 overflow-y-auto p-4 pb-8 md:p-6" style={{ scrollbarWidth: "none", backgroundColor: BG }}>
          <div className="mx-auto max-w-screen-2xl">
            {offline && <div className="mb-5 flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium" style={{ backgroundColor: "#FEF3C7", color: "#92400E", borderColor: "#FDE68A" }}><WifiSlash size={15} weight="bold" /><span>Offline — showing last synced data. Changes will sync automatically when reconnected.</span><button onClick={() => setOffline(false)} className="ml-auto rounded-lg px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: WARNING }}>Go Online</button></div>}
            {screen === "suite-home" ? (
              <SuiteHome staffName={staffName} role={role} departments={allowedDepartments} offline={offline} pinned={pinned.filter(id => allowedDepartments.some(department => department.id === id))} onTogglePin={togglePin} onOpenDepartment={openDepartment} onOpenScreen={(nextScreen, label) => nav(nextScreen, label)} onOpenPortal={onOpenPortal} />
            ) : (screen as string).startsWith("dept-") && !["dept-front-office", "dept-access-security", "dept-housekeeping", "dept-maintenance", "dept-restaurant-pos", "dept-finance", "dept-inventory", "dept-hr", "dept-communications", "dept-fleet"].includes(screen as string) && currentDepartment ? (
              <DepartmentHome department={currentDepartment} />
            ) : (
              <Router screen={screen as Screen} add={add} role={role} nav={(nextScreen, label, param) => nav(nextScreen, label, param)} staffName={staffName} navParam={navParam} />
            )}
          </div>
        </main>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search departments and screens…" />
        <CommandList><CommandEmpty>No matching screen.</CommandEmpty><CommandGroup heading="Departments">{allowedDepartments.map(department => { const Icon = department.icon; return <CommandItem key={department.id} value={`${department.name} department`} onSelect={() => openDepartment(department)}><Icon style={{ color: department.accent }} />{department.name}</CommandItem>; })}</CommandGroup><CommandGroup heading="Screens">{searchableScreens.map(item => <CommandItem key={item.screen} value={`${item.label} ${item.department.name}`} onSelect={() => nav(item.screen, item.label)}><item.department.icon style={{ color: item.department.accent }} /><span>{item.label}</span><span className="ml-auto text-xs" style={{ color: SUBTLE }}>{item.department.name}</span></CommandItem>)}</CommandGroup></CommandList>
      </CommandDialog>

      {notifOpen && <><div className="fixed inset-0 z-30 bg-black/40" onClick={() => setNotifOpen(false)} /><div className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl" style={{ borderLeft: `1px solid ${BORDER}` }}><div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}><h2 className="text-sm font-semibold" style={{ color: TEXT, fontFamily: display }}>Notifications</h2><button onClick={() => setNotifOpen(false)} className="flex h-8 w-8 items-center justify-center" style={{ color: SUBTLE }}><XCircle size={16} /></button></div><div className="flex border-b" style={{ borderColor: BORDER }}>{["All", "Urgent", "Operational", "System", "Door Lock"].map(tab => <button key={tab} onClick={() => setNotifFilter(tab)} className="flex-1 py-2.5 text-xs font-medium" style={{ color: notifFilter === tab ? PRIMARY : MUTED, borderBottom: notifFilter === tab ? `2px solid ${PRIMARY}` : "2px solid transparent" }}>{tab}</button>)}</div><div className="flex-1 overflow-y-auto">{filteredNotifications.length === 0 && <EmptyState icon={Bell} message="No notifications in this category." />}{filteredNotifications.map(notification => { const Icon = notification.icon; return <div key={notification.id} className="flex gap-3 border-b px-5 py-4" style={{ borderBottomColor: BORDER, borderLeft: `3px solid ${notification.color}` }}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-full" style={{ backgroundColor: `${notification.color}18` }}><Icon size={16} style={{ color: notification.color }} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><span className="text-xs font-semibold" style={{ color: TEXT }}>{notification.title}</span>{notification.unread && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}</div><p className="mt-0.5 line-clamp-2 text-xs" style={{ color: MUTED }}>{notification.body}</p><span className="mt-1 inline-block text-xs" style={{ color: SUBTLE }}>{notification.time} ago</span></div></div>; })}</div></div></>}

      <ToastC toasts={toasts} dismiss={dismiss} />
      {showSessionExpired && <SessionExpiredModal offline={offline} onStay={() => { setShowSessionExpired(false); add({ type: "success", title: "Session extended", body: "Token refreshed — 12 hours remaining" }); }} onSignOut={() => { setShowSessionExpired(false); onLogout(); }} />}
      {showPermsChanged && <PermissionsChangedDialog onReLogin={() => { setShowPermsChanged(false); onLogout(); }} />}
    </div>
  );
}
