// Vehicle requests and trips. Any department asks Fleet for a vehicle; a supervisor or manager of that department
// signs it off; Fleet's approvers then approve it, and only then is a vehicle and driver assigned. A guest trip skips the
// department step but still needs Fleet's approval. Nobody signs off or approves their own request, and the person who
// signed it off for the department is not the one who approves it for Fleet.
// shortcut: kept in memory; the hotel server stores trips and the Android app shows them to drivers.
import type { Role } from "../constants";
import { notify } from "./notify";
import { canApprove } from "./approvals";
import { staffRecord, leadsOf, staffAll } from "./staff";

export type TripStatus = "waiting-department" | "waiting-fleet" | "turned-down" | "requested" | "assigned" | "dispatched" | "en-route" | "in-transit" | "completed" | "cancelled";
export type ServiceLine = "Airport Transfer" | "Charter" | "Hotel Transport" | "Staff & Logistics";
export type ChargeType = "folio" | "complimentary" | "cost-centre" | "cash";
export type TripPriority = "Normal" | "Urgent" | "Emergency";
export type CancelReason = "Guest cancelled" | "Guest no-show" | "Flight changed" | "No vehicle available" | "No driver available" | "Vehicle breakdown" | "Duplicate request" | "Other";
export interface TripEvent { time: string; event: string; actor: string; note?: string; }

export interface Trip {
  id: string;
  serviceL: ServiceLine;
  status: TripStatus;
  priority: TripPriority;
  // guest trip
  guest?: string;
  reservationRef?: string;
  // dept trip
  dept?: string;
  requestedBy?: string;
  signedOffBy?: string;
  approvedBy?: string;
  turnedDownBy?: string;
  turnDownReason?: string;
  costCentre?: string;
  pickup: string;
  dropoff: string;
  scheduledTime: string;
  vehicle?: string;
  driver?: string;
  pax: number;
  flight?: string;
  terminal?: "International" | "Domestic";
  tripMode: "one-way" | "round-trip";
  odomStart?: number;
  odomEnd?: number;
  chargeType: ChargeType;
  quotedFare: number;
  finalFare?: number;
  waitingSurcharge?: number;
  folioRef?: string;
  postedToFolio?: boolean;
  waitMinutes?: number;
  rating?: number;
  feedback?: string;
  notes?: string;
  cancelReason?: CancelReason;
  cancelNote?: string;
  createdAt: string;
  createdAtMs: number;
  events: TripEvent[];
}

const _minsAgo = (m: number) => Date.now() - m * 60_000;
export const nowStr = () => new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });

const TRIPS: Trip[] = [
  {
    id:"TRP-0041", serviceL:"Airport Transfer", status:"requested", priority:"Normal",
    guest:"Dr. Chukwuemeka Bello", reservationRef:"BK-2849",
    pickup:"Grand Palms Abuja", dropoff:"Nnamdi Azikiwe Int'l Airport",
    scheduledTime:"14:30", pax:2, flight:"AA421", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, folioRef:"FOL-2019",
    createdAt:"Today 09:42", createdAtMs:_minsAgo(48),
    events:[{ time:"09:42", event:"Trip created", actor:"Front Desk", note:"From reservation BK-2849" }],
  },
  {
    id:"TRP-0040", serviceL:"Airport Transfer", status:"assigned", priority:"Normal",
    guest:"Mrs. Ngozi Okonkwo", reservationRef:"BK-2850",
    pickup:"Nnamdi Azikiwe Int'l Airport", dropoff:"Grand Palms Abuja",
    scheduledTime:"12:15", pax:1, flight:"QR842", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, folioRef:"FOL-2014",
    vehicle:"ABJ-001E", driver:"Uche Obi",
    createdAt:"Today 08:31", createdAtMs:_minsAgo(119),
    events:[
      { time:"08:31", event:"Trip created", actor:"Front Desk" },
      { time:"08:35", event:"Driver assigned", actor:"Dispatch", note:"Uche Obi · ABJ 123 XA" },
    ],
  },
  {
    id:"TRP-0039", serviceL:"Charter", status:"dispatched", priority:"Urgent",
    guest:"Senator Adeyemi",
    pickup:"Grand Palms Abuja", dropoff:"Aso Rock (State House)",
    scheduledTime:"10:00", pax:3,
    tripMode:"round-trip", chargeType:"complimentary", quotedFare:45000,
    vehicle:"ABJ-002E", driver:"Emeka Eze",
    createdAt:"Today 07:55", createdAtMs:_minsAgo(155),
    events:[
      { time:"07:55", event:"Trip created", actor:"Management" },
      { time:"07:58", event:"Driver assigned", actor:"Dispatch", note:"Emeka Eze · ABJ 456 YB" },
      { time:"09:52", event:"Dispatched", actor:"Emeka Eze" },
    ],
  },
  {
    id:"TRP-0038", serviceL:"Hotel Transport", status:"en-route", priority:"Normal",
    dept:"Restaurant", requestedBy:"Biodun Adeyemi", signedOffBy:"Grace Ojo", costCentre:"FB-OPS-001",
    pickup:"FreshMart Wuse II", dropoff:"Grand Palms Abuja",
    scheduledTime:"09:30", pax:1,
    tripMode:"round-trip", chargeType:"cost-centre", quotedFare:8500,
    vehicle:"ABJ-003V", driver:"Musa Danladi", odomStart:31380,
    createdAt:"Today 07:10", createdAtMs:_minsAgo(200),
    events:[
      { time:"07:10", event:"Trip created", actor:"Biodun Adeyemi" },
      { time:"07:12", event:"Signed off", actor:"Grace Ojo" },
      { time:"07:15", event:"Driver assigned", actor:"Dispatch", note:"Musa Danladi · ABJ 789 ZC" },
      { time:"09:28", event:"Dispatched", actor:"Musa Danladi" },
      { time:"09:31", event:"En Route", actor:"Musa Danladi" },
    ],
  },
  {
    id:"TRP-0037", serviceL:"Airport Transfer", status:"completed", priority:"Normal",
    guest:"Adaeze Okonkwo-James", reservationRef:"BK-2847",
    pickup:"Nnamdi Azikiwe Int'l Airport", dropoff:"Grand Palms Abuja",
    scheduledTime:"07:00", pax:2, flight:"ET902", terminal:"International",
    tripMode:"one-way", chargeType:"folio", quotedFare:18000, finalFare:20500, waitingSurcharge:2500,
    vehicle:"ABJ-001E", driver:"Uche Obi",
    odomStart:47850, odomEnd:47963, waitMinutes:25, rating:4.8,
    feedback:"Excellent service, very punctual.",
    folioRef:"FOL-2010", postedToFolio:true,
    createdAt:"Yesterday 22:10", createdAtMs:_minsAgo(1440),
    events:[
      { time:"22:10", event:"Trip created", actor:"System", note:"Auto from reservation BK-2847" },
      { time:"22:15", event:"Driver assigned", actor:"Dispatch (Adaeze)", note:"Uche Obi · ABJ 123 XA" },
      { time:"05:45", event:"Dispatched", actor:"Uche Obi", note:"En route to airport" },
      { time:"06:02", event:"Arrived at pickup", actor:"Uche Obi", note:"Wait started — flight ET902" },
      { time:"06:27", event:"Trip started", actor:"Uche Obi", note:"Odometer 47,850 km · Pax boarded" },
      { time:"07:11", event:"Completed", actor:"Uche Obi", note:"Odometer 47,963 km · Guests dropped off" },
      { time:"07:14", event:"Charge posted to folio", actor:"System", note:"₦20,500 → FOL-2010" },
    ],
  },
  {
    id:"TRP-0036", serviceL:"Staff & Logistics", status:"waiting-department", priority:"Normal",
    dept:"Housekeeping", requestedBy:"Amaka Osei", costCentre:"HK-OPS-001",
    pickup:"Lagos Linen Co.", dropoff:"Grand Palms Abuja",
    scheduledTime:"11:00", pax:1,
    tripMode:"round-trip", chargeType:"cost-centre", quotedFare:12000,
    notes:"Linen pickup — 6 bundles. Loading bay access required.",
    createdAt:"Today 09:58", createdAtMs:_minsAgo(32),
    events:[{ time:"09:58", event:"Request submitted", actor:"Amaka Osei", note:"Waiting for a Housekeeping supervisor" }],
  },
  {
    id:"TRP-0035", serviceL:"Hotel Transport", status:"waiting-fleet", priority:"Urgent",
    dept:"Maintenance", requestedBy:"Chidi Ike", signedOffBy:"Yusuf Garba", costCentre:"MX-OPS-002",
    pickup:"Grand Palms Abuja", dropoff:"Techno Tools Market, Wuse",
    scheduledTime:"10:30", pax:2,
    tripMode:"one-way", chargeType:"cost-centre", quotedFare:6000,
    notes:"Emergency parts run — HVAC compressor needed for Block C repair.",
    createdAt:"Today 10:01", createdAtMs:_minsAgo(9),
    events:[{ time:"10:01", event:"Request submitted", actor:"Chidi Ike" }, { time:"10:04", event:"Signed off", actor:"Yusuf Garba" }],
  },
];

export const trips = () => TRIPS;
/** For screens that still edit a copy: write the whole list back. */
export const saveTrips = (list: Trip[]) => { TRIPS.splice(0, TRIPS.length, ...list); };
export const trip = (id: string) => TRIPS.find(t => t.id === id);

const isLead = (name: string, dept: string) => leadsOf(dept).includes(name);
const fleetManagers = () => staffAll().filter(s => s.dept === "Fleet" && s.status === "Active" && s.level === "Manager").map(s => s.name);
const stamp = (t: Trip, event: string, actor: string, note?: string) => t.events.push({ time: nowStr(), event, actor, note });

export const canSignOff = (t: Trip, by: string, role: Role | string) =>
  t.status === "waiting-department" && by !== t.requestedBy && (role === "MGT" || isLead(by, t.dept ?? ""));
export const canFleetApprove = (t: Trip, by: string, role: Role | string) =>
  t.status === "waiting-fleet" && by !== t.requestedBy && by !== t.signedOffBy &&
  (canApprove(role as Role, "Fleet", by) || fleetManagers().includes(by));

let seq = Math.max(...TRIPS.map(t => Number(t.id.slice(4))));
/** A department trip from `by`'s own department, or a guest trip. A supervisor or manager asking skips their own sign-off. */
export const requestTrip = (t: Omit<Trip, "id" | "status" | "createdAt" | "createdAtMs" | "events" | "requestedBy" | "dept">, by: string, role: Role | string): Trip => {
  const guestTrip = !!t.guest;
  const dept = guestTrip ? undefined : staffRecord(by)?.dept ?? "Management";
  const skip = guestTrip || role === "MGT" || isLead(by, dept!);
  const n: Trip = { ...t, id: `TRP-${String(++seq).padStart(4, "0")}`, dept, requestedBy: by, status: skip ? "waiting-fleet" : "waiting-department",
    createdAt: `Today ${nowStr()}`, createdAtMs: Date.now(), events: [] };
  if (!guestTrip && skip) n.signedOffBy = by;
  stamp(n, "Request submitted", by, skip && !guestTrip ? `Raised by a ${dept} lead, so no separate sign-off` : undefined);
  TRIPS.unshift(n);
  if (n.status === "waiting-department") {
    // Nobody from the department at work to sign it off: the hotel managers are asked instead, so it never sits unseen.
    const leads = leadsOf(dept!), people = leads.length ? leads : staffAll().filter(x => x.dept === "Management" && x.status === "Active").map(x => x.name);
    notify("trip.toSignOff", { title: `Vehicle request to sign off: ${n.id}`, body: `${by}, ${dept}. ${n.pickup} to ${n.dropoff} at ${n.scheduledTime}.${leads.length ? "" : ` No ${dept} supervisor or manager is at work, so a hotel manager signs it off.`}`, people, link: { screen: "vehicle-requests", label: "Vehicle Requests" } });
  }
  else toFleet(n);
  return n;
};
const toFleet = (t: Trip) => notify("trip.toFleet", { title: `Vehicle request for Fleet: ${t.id}`, body: `${t.guest ?? `${t.requestedBy}, ${t.dept}`}. ${t.pickup} to ${t.dropoff} at ${t.scheduledTime}.`,
  people: fleetManagers().filter(x => x !== t.requestedBy), link: { screen: "vehicle-requests", label: "Vehicle Requests" } });
const turnDown = (t: Trip, by: string, reason: string) => {
  Object.assign(t, { status: "turned-down", turnedDownBy: by, turnDownReason: reason }); stamp(t, "Turned down", by, reason);
  notify("trip.decided", { title: `Vehicle request ${t.id} turned down`, body: `${by}: ${reason}`, people: [t.requestedBy ?? ""], link: { screen: "vehicle-requests", label: "Vehicle Requests" } });
};

/** The department's step: a supervisor or manager of the requester's department (or a hotel manager). Returns why not, or null. */
export const signOff = (id: string, by: string, role: Role | string, ok: boolean, reason = ""): string | null => {
  const t = trip(id); if (!t) return "There is no such request.";
  if (!canSignOff(t, by, role)) return t.status !== "waiting-department" ? "This request is not waiting for its department." : by === t.requestedBy ? "Someone else must sign off your own request." : `Only a ${t.dept} supervisor or manager at work today can sign this off.`;
  if (!ok) { if (reason.trim().length < 3) return "Say why it is turned down."; turnDown(t, by, reason.trim()); return null; }
  Object.assign(t, { status: "waiting-fleet", signedOffBy: by }); stamp(t, "Signed off", by); toFleet(t); return null;
};
/** Fleet's step: Fleet's named approvers, Fleet managers or hotel managers; never the requester or whoever signed it off. */
export const fleetDecide = (id: string, by: string, role: Role | string, ok: boolean, reason = ""): string | null => {
  const t = trip(id); if (!t) return "There is no such request.";
  if (!canFleetApprove(t, by, role)) return t.status !== "waiting-fleet" ? "This request is not waiting for Fleet." : by === t.requestedBy ? "Someone else must approve your own request." : by === t.signedOffBy ? "You signed this off for the department; someone in Fleet must approve it." : "Only Fleet's approvers or a manager can approve this.";
  if (!ok) { if (reason.trim().length < 3) return "Say why it is turned down."; turnDown(t, by, reason.trim()); return null; }
  Object.assign(t, { status: "requested", approvedBy: by }); stamp(t, "Approved by Fleet", by);
  notify("trip.decided", { title: `Vehicle request ${t.id} approved`, body: `${by} approved it. A vehicle and driver will be assigned.`, people: [t.requestedBy ?? ""], link: { screen: "vehicle-requests", label: "Vehicle Requests" } });
  return null;
};
