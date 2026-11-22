// Barrel — re-exports all screens by domain file
export { Badge, EmptyState, ScreenLoading, ScreenError, ToastC, LiveClock, SyncPill, StatCard, PageHeader, BtnP, BtnO, Inp, Sel, ReservationGrid, NewReservation, CheckOut, InHouseGuests, GuestProfiles, FolioScreen, FinanceFolioManagement } from "./UIKit";
export { DashboardMgmt, DashboardRole } from "./DashboardScreens";
export { HKBoard, InternalChat, POSTerminal, TableManagement, StaffDirectory, DailySummary, StockDashboard, RoomTypeManagement, RateCalendar, AvailabilityBoard } from "./OperationsScreens";
export { CheckInWizard, PlaceholderScreen, ArrivalsScreen, DeparturesScreen, RoomAccessMgmt, KeyCardLog, PINManagement, ShiftHandover, GuestMessaging, KitchenDisplay, MenuManagement, LostFound, DNDLog, InvoiceReceipts, AccountsPayable } from "./FrontDeskScreens";
export { RolesPermissions, AttendanceScreen, ShiftScheduler, ReservationSearch, ReservationDetail, RoomAssignmentBoard, GuestProfileDetail, CashDrawerReconciliation, NightAudit, TaxConfiguration, RefundProcessing, FolioVoidReversal, AccountingExport, CreditNotes, ComplaintManagement, ComplaintDashboard } from "./AdminScreens";
export { WalkInReg, InspectionLog, LinenSupplies, HousekeepingSchedule, DiningReservations, RoomServiceOrders, Announcements, StaffProfileDetail, PayrollSummary, GroupBookings, Waitlist, RateManagement, CancellationRefund, KeyCardMgmt, HKMyTasks, VendorContacts, GuestRoomCharges, ProductsScreen, SuppliersScreen, StockTransactions, PurchaseOrders } from "./PropertyScreens";
export { OccupancyReports, RevenueReports, DepartmentReports, GuestAnalytics, InventoryReports, StaffReports } from "./ReportsScreens";
export { UserManagement, SystemHealth, SchemaUpdateStatus, DeviceManagement, BackupRestore, AuditLog, ErrorLog } from "./ITAdminScreens";
export { BranchOverview, BranchComparison, CentralSyncStatus, HotelConfig, SyncSettings, DoorLockSettings, MyPreferences, PrintSettings } from "./MultibranchSettingsScreens";
export { DispatchBoard, TripDetail, NewTripRequest, DriverRoster, FleetCosting, DriverAccessLog, setDriverTab } from "./FleetScreens";
export { VehicleRegister, VehicleDetail, FuelLog, GeneratorDieselLog, setVehicleId } from "./FleetAssetsScreens";
export { GuestAccessScreen } from "./AuthFlowScreens";
export { PrintTemplates } from "./PrintTemplates";
export { FieldApp } from "./FieldApp";
export { GuestPortal } from "./GuestPortal";

export { WorkOrders, WorkOrderDetail } from "./WorkOrderScreens";
export { MaintenanceRoster } from "./RosterScreens";
export { AssetRegister, PlannedWork } from "./PlannedScreens";
export { MaintenanceHandover } from "./HandoverScreens";
export { Permits } from "./PermitScreens";
export { MaintenanceSetup } from "./SetupScreens";
export { LeaveManagement } from "./LeaveScreens";
