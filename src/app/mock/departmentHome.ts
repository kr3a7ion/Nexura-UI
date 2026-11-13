import type { DepartmentId } from "../suite/departments";

// Mock figures for department homes that have no dedicated home screen yet.
export const DEPARTMENT_HOME: Partial<Record<DepartmentId, { sub: string; stats: Array<{ label: string; value: string; sub: string }> }>> = {
  reports: {
    sub: "Occupancy, revenue and department reports for this hotel.",
    stats: [
      { label: "Occupancy this month", value: "71%", sub: "Up 4 points on October" },
      { label: "Revenue this month", value: "₦96.4m", sub: "13 days in" },
      { label: "Average room rate", value: "₦82,500", sub: "Per occupied room" },
      { label: "Reports exported", value: "14", sub: "This month" },
    ],
  },
  "it-system": {
    sub: "Users, devices, backups and the health of this hotel's server.",
    stats: [
      { label: "Terminals online", value: "11 of 12", sub: "Bar terminal is off" },
      { label: "Last backup", value: "02:00", sub: "Today, completed" },
      { label: "Changes waiting to sync", value: "36", sub: "Will send when online" },
      { label: "Active users", value: "22", sub: "Signed in now" },
    ],
  },
  "properties-settings": {
    sub: "Branches, hotel details, sync and print settings.",
    stats: [
      { label: "Branches", value: "3", sub: "Abuja, Lagos, Port Harcourt" },
      { label: "Rooms", value: "123", sub: "Across 6 room types" },
      { label: "VAT", value: "7.5%", sub: "Applied to every bill" },
      { label: "Print templates", value: "6", sub: "Receipts, folios, tickets" },
    ],
  },
};
