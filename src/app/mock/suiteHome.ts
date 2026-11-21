import { ROOMS, type Role, type Screen } from "../constants";
import { STAYS, ARRIVALS, departures } from "./frontOffice";
import { hkRooms, FOUND_ITEMS } from "./housekeeping";
import { roomState } from "./rooms";
import { workOrders, isOpen, isUrgent } from "./maintenance";

export type HomeStat = { label: string; value: string; sub: string; screen: Screen; screenLabel: string };
export type HomeAlert = { text: string; from: string; since: string; tone: "error" | "warning"; screen: Screen; screenLabel: string };

const stat = (label: string, value: string, sub: string, screen: Screen, screenLabel: string): HomeStat => ({ label, value, sub, screen, screenLabel });
const alert = (text: string, from: string, since: string, tone: HomeAlert["tone"], screen: Screen, screenLabel: string): HomeAlert => ({ text, from, since, tone, screen, screenLabel });

// Room and guest figures are counted from the Front Office and Housekeeping data, so Suite Home agrees with every screen.
const occ = () => `${Math.round(STAYS.length / ROOMS.length * 100)}%`;
const frontDesk = (): HomeStat[] => {
  const rooms = hkRooms(), vacant = rooms.filter(r => r.guestState === "Vacant");
  const ready = vacant.filter(r => r.hkSt === "Clean" || r.hkSt === "Inspected").length;
  return [
    stat("Arrivals left", String(ARRIVALS.length), `${ARRIVALS.filter(a => !a.room).length} still need a room`, "arrivals", "Arrivals List"),
    stat("Departures left", String(departures().length), "Leaving today", "departures", "Departures List"),
    stat("Rooms ready", String(ready), `${vacant.length - ready} more being cleaned`, "room-assignment", "Room Assignment"),
    stat("In house", String(STAYS.length), `${occ()} of ${ROOMS.length} rooms`, "in-house-guests", "In-House Guests"),
  ];
};
const LATE_ARRIVAL = alert("Ngozi Adeyemi (VIP) arrives 16:00 and has no room yet", "Front Office", "10:42", "error", "room-assignment", "Room Assignment");

// Mock figures. What each role sees first on Suite Home: the four numbers that drive their shift, and what is waiting on them.
export const homeToday = (): Record<Role, { stats: HomeStat[]; alerts: HomeAlert[] }> => ({
  MGT: {
    stats: [
      stat("Occupancy tonight", occ(), `${STAYS.length} of ${ROOMS.length} rooms`, "dashboard-mgmt", "Management Overview"),
      stat("Revenue today", "₦4,200,000", "Up ₦310,000 on yesterday", "daily-summary", "Daily Summary"),
      stat("Arrivals left", String(ARRIVALS.length), `${ARRIVALS.filter(a => !a.room).length} still need a room`, "arrivals", "Arrivals List"),
      stat("Open complaints", "2", "1 older than a day", "complaint-dashboard", "Complaint Dashboard"),
    ],
    alerts: [
      LATE_ARRIVAL,
      alert("Air conditioner fault in room 316 is overdue", "Maintenance", "Yesterday", "error", "work-orders", "Work Orders"),
      alert("Diesel is below 25%", "Inventory", "09:10", "warning", "generator-diesel", "Generator & Diesel"),
    ],
  },
  FD: { stats: frontDesk(), alerts: [LATE_ARRIVAL, alert("Tobi Adeyemi has no deposit on his reservation", "Front Office", "09:55", "warning", "arrivals", "Arrivals List")] },
  RSV: {
    stats: [
      stat("New bookings today", "9", "4 by phone, 5 at the desk", "reservation-grid", "Reservation Grid"),
      stat("On the waitlist", "3", "2 for this weekend", "waitlist", "Waitlist"),
      stat("Free rooms tonight", String(ROOMS.filter(r => ["Ready", "Being cleaned"].includes(roomState(r.id))).length), "After today's arrivals with rooms", "availability-board", "Availability Board"),
      stat("Cancellations", "1", "Refund waiting", "cancellation", "Cancellation & Refund"),
    ],
    alerts: [alert("Suites are sold out on Saturday", "Front Office", "Today", "warning", "availability-board", "Availability Board")],
  },
  HK: {
    stats: [
      stat("Rooms to clean", String(hkRooms().filter(r => r.hkSt === "Dirty").length), `${hkRooms().filter(r => r.hkSt === "Dirty" && r.guestState === "Departure").length} are departures`, "hk-board", "Housekeeping Board"),
      stat("Being cleaned", String(hkRooms().filter(r => r.hkSt === "In Progress").length), [...new Set(hkRooms().filter(r => r.hkSt === "In Progress").map(r => r.attendant).filter(Boolean))].join(" and ") || "Nobody yet", "hk-board", "Housekeeping Board"),
      stat("To inspect", String(hkRooms().filter(r => r.awaitingInspection).length), "Cleaned, not yet checked", "hk-inspection", "Inspection Log"),
      stat("Lost and found", String(FOUND_ITEMS.filter(i => i.status === "Held").length), "Waiting to be claimed", "lost-found", "Lost & Found"),
    ],
    alerts: [alert("Room 202 is a priority departure with nobody assigned", "Housekeeping", "08:00", "error", "hk-board", "Housekeeping Board")],
  },
  MX: {
    stats: [
      stat("Open work orders", String(workOrders().filter(isOpen).length), `${workOrders().filter(w => isOpen(w) && isUrgent(w)).length} P1 or P2`, "work-orders", "Work Orders"),
      stat("Due today", "3", "Preventive tasks", "preventive-schedule", "Preventive Schedule"),
      stat("Diesel level", "24%", "About 9 hours left", "generator-diesel", "Generator & Diesel"),
      stat("Rooms out of order", String(ROOMS.filter(r => roomState(r.id) === "Out of order").length), ROOMS.filter(r => roomState(r.id) === "Out of order").map(r => r.id).join(", ") || "All rooms in service", "work-orders", "Work Orders"),
    ],
    alerts: [alert("Air conditioner fault in room 316 is overdue", "Maintenance", "Yesterday", "error", "work-orders", "Work Orders")],
  },
  RT: {
    stats: [
      stat("Open tables", "3", "11 guests seated", "table-management", "Table Management"),
      stat("Kitchen tickets", "5", "Oldest 14 minutes", "kitchen-display", "Kitchen Display"),
      stat("Room service", "2", "On the way", "room-service", "Room Service Orders"),
      stat("Sales today", "₦386,500", "42 orders", "cash-drawer", "Cash Drawer"),
    ],
    alerts: [alert("A kitchen ticket has waited 14 minutes", "Restaurant", "13:51", "warning", "kitchen-display", "Kitchen Display")],
  },
  FIN: {
    stats: [
      stat("Revenue today", "₦4,200,000", "Up ₦310,000 on yesterday", "daily-summary", "Daily Summary"),
      stat("Unpaid balances", "₦612,400", "5 folios", "finance-folio", "Folio Management"),
      stat("Refunds waiting", "1", "₦85,000", "refund-processing", "Refund Processing"),
      stat("Night audit", "23:00", "Not started", "night-audit", "Night Audit"),
    ],
    alerts: [alert("A departed guest still owes ₦102,637.50", "Finance", "Yesterday", "error", "finance-folio", "Folio Management")],
  },
  IT: {
    stats: [
      stat("Terminals online", "11 of 12", "Bar terminal is off", "device-management", "Device Management"),
      stat("Last backup", "02:00", "Today, completed", "backup-restore", "Backup & Restore"),
      stat("Changes waiting to sync", "36", "Will send when online", "sync-status", "Central Sync Status"),
      stat("Errors today", "2", "Both resolved", "error-log", "Error Log"),
    ],
    alerts: [alert("Bar terminal has been off since 11:20", "IT & System", "11:20", "warning", "device-management", "Device Management")],
  },
  FLT: {
    stats: [
      stat("Trips today", "8", "5 done, 3 active", "dispatch-board", "Dispatch Board"),
      stat("Waiting for a driver", "1", "Airport pickup, 15:00", "dispatch-board", "Dispatch Board"),
      stat("Vehicles available", "4 of 6", "1 in service", "vehicle-register", "Vehicle Register"),
      stat("Fuel this week", "₦148,000", "212 litres", "fuel-log", "Fuel Log"),
    ],
    alerts: [alert("The 15:00 airport pickup has no driver", "Fleet", "13:30", "error", "dispatch-board", "Dispatch Board")],
  },
  DRV: {
    stats: [
      stat("My trips today", "3", "1 done, 2 to go", "dispatch-board", "Dispatch Board"),
      stat("Next trip", "15:00", "Airport pickup", "dispatch-board", "Dispatch Board"),
      stat("Distance today", "46 km", "1 trip", "fuel-log", "Fuel Log"),
      stat("Fuel", "Half tank", "Last filled Tuesday", "fuel-log", "Fuel Log"),
    ],
    alerts: [],
  },
});
