export type FieldTask = {
  id: string;
  room: string;
  floor: number;
  type: "Departure Clean" | "Stayover Service" | "Inspection";
  status: "Assigned" | "In Progress" | "Ready";
  priority: "Urgent" | "High" | "Normal";
  guestState: "Departure" | "Stayover" | "Vacant";
  estimate: number;
  checklist: string[];
};

export const FIELD_IDENTITY = {
  name: "Fatima Musa",
  role: "Housekeeping Attendant",
  device: "HK-LAG-014",
  branch: "Grand Palms Ikoyi, Lagos",
};

export const DRIVER_FIELD_IDENTITY = {
  name: "Uche Obi",
  role: "Hotel Driver",
  device: "DRV-ABJ-006",
  branch: "Grand Palms Maitama, Abuja",
};

export const FIELD_TASKS: FieldTask[] = [
  { id: "HK-4102", room: "501", floor: 5, type: "Departure Clean", status: "Assigned", priority: "Urgent", guestState: "Departure", estimate: 35, checklist: ["Strip and remake bed", "Sanitise bathroom", "Restock minibar", "Vacuum and mop", "Final room check"] },
  { id: "HK-4107", room: "304", floor: 3, type: "Stayover Service", status: "Assigned", priority: "High", guestState: "Stayover", estimate: 20, checklist: ["Make bed", "Replace used towels", "Empty bins", "Restock water"] },
  { id: "HK-4110", room: "203", floor: 2, type: "Inspection", status: "In Progress", priority: "High", guestState: "Vacant", estimate: 10, checklist: ["Check linen", "Check bathroom", "Check amenities", "Release room"] },
  { id: "HK-4114", room: "108", floor: 1, type: "Departure Clean", status: "Assigned", priority: "Normal", guestState: "Departure", estimate: 30, checklist: ["Strip and remake bed", "Sanitise bathroom", "Restock minibar", "Vacuum and mop"] },
  { id: "HK-4117", room: "212", floor: 2, type: "Stayover Service", status: "Assigned", priority: "Normal", guestState: "Stayover", estimate: 18, checklist: ["Make bed", "Replace towels", "Empty bins"] },
  { id: "HK-4120", room: "406", floor: 4, type: "Inspection", status: "Ready", priority: "Normal", guestState: "Vacant", estimate: 8, checklist: ["Check linen", "Check bathroom", "Release room"] },
  { id: "HK-4122", room: "307", floor: 3, type: "Departure Clean", status: "Assigned", priority: "Normal", guestState: "Departure", estimate: 32, checklist: ["Strip bed", "Bathroom", "Amenities", "Floors"] },
  { id: "HK-4124", room: "102", floor: 1, type: "Stayover Service", status: "Assigned", priority: "Normal", guestState: "Stayover", estimate: 17, checklist: ["Make bed", "Towels", "Water"] },
  { id: "HK-4128", room: "408", floor: 4, type: "Departure Clean", status: "Assigned", priority: "Normal", guestState: "Departure", estimate: 30, checklist: ["Strip bed", "Bathroom", "Amenities", "Floors"] },
  { id: "HK-4131", room: "205", floor: 2, type: "Inspection", status: "Assigned", priority: "Normal", guestState: "Vacant", estimate: 10, checklist: ["Check linen", "Check bathroom", "Release room"] },
  { id: "HK-4135", room: "110", floor: 1, type: "Stayover Service", status: "Assigned", priority: "Normal", guestState: "Stayover", estimate: 18, checklist: ["Make bed", "Towels", "Water"] },
];

export const ISSUE_CATEGORIES = ["Maintenance", "Damage", "Missing Item", "Safety", "Pest", "Other"];

export const SUPPLY_ITEMS = [
  { id: "towels", name: "Bath Towels", unit: "pieces" },
  { id: "linen", name: "King Linen Set", unit: "sets" },
  { id: "water", name: "Bottled Water", unit: "bottles" },
  { id: "soap", name: "Guest Soap", unit: "pieces" },
  { id: "tissue", name: "Toilet Tissue", unit: "rolls" },
  { id: "bags", name: "Laundry Bags", unit: "pieces" },
];

export const FIELD_MESSAGES = [
  { id: "MSG-91", from: "Grace Mensah", title: "Priority rooms before noon", body: "Rooms 501 and 304 must be ready before the 12:00 arrivals.", time: "08:12", unread: true, announcement: true },
  { id: "MSG-92", from: "Housekeeping Team", title: "Linen delivery", body: "Fresh linen is available at the Floor 3 pantry.", time: "08:34", unread: true, announcement: false },
  { id: "MSG-88", from: "John Abubakar", title: "Room 203 inspection", body: "Please message Front Desk once the inspection is complete.", time: "Yesterday", unread: false, announcement: false },
];

export const DRIVER_TRIPS = [
  { id: "TRP-0318", pickupTime: "10:30", guest: "Chukwuemeka Okafor", pickup: "Grand Palms Maitama", dropoff: "Nnamdi Azikiwe Airport", passengers: 3, flight: "P4 712", status: "Assigned" },
  { id: "TRP-0321", pickupTime: "14:15", guest: "Amina Bello", pickup: "Murtala Muhammed Airport", dropoff: "Grand Palms Ikoyi", passengers: 2, flight: "Q9 301", status: "Scheduled" },
];

export const SHIFT_SUMMARY = {
  today: "07:00–16:00",
  hoursThisWeek: "31h 24m",
  nextShift: "Tomorrow · 07:00–16:00",
};
