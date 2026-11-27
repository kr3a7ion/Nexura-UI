// Front Office home: what today holds, counted from the hotel record (arrivals, stays, rooms), not written in.
import { ARRIVALS, STAYS, leavesToday, balanceOf, stayDates } from "./frontOffice";
import { roomState } from "./rooms";
import { ROOMS } from "./property";
import { now } from "./maintenance";
import { hkStatus } from "./housekeeping";

export type FrontOfficeException = {
  id: string; title: string; detail: string; severity: "Critical" | "Warning" | "Info";
  screen: "room-assignment" | "reservation-detail" | "check-in" | "check-out" | "folio"; screenLabel: string; navParam?: string;
};

export const leavingToday = () => STAYS.filter(leavesToday);
/** Past the check-out time and still in the room. */
export const overstaying = () => leavingToday().filter(s => { const d = stayDates(s).checkout, [h, m] = s.checkoutTime.split(":").map(Number); d.setHours(h, m); return now() > d; });

export const frontOfficeKpis = () => {
  const withRoom = ARRIVALS.filter(a => a.room).length, leaving = leavingToday(), owing = leaving.filter(s => balanceOf(s) > 0).length;
  const ready = ROOMS.filter(r => roomState(r.id) === "Ready").length;
  return [
    { label: "Arrivals today", value: String(ARRIVALS.length), sub: `${withRoom} have a room`, delta: `${ARRIVALS.filter(a => a.vip).length} VIP`, deltaPositive: true },
    { label: "Departures today", value: String(leaving.length), sub: owing ? `${owing} with a balance to pay` : "No balances due", delta: overstaying().length ? `${overstaying().length} past time` : "On time", deltaPositive: !overstaying().length },
    { label: "In house", value: String(STAYS.length), sub: `${Math.round((STAYS.length / ROOMS.length) * 100)}% of ${ROOMS.length} rooms`, delta: "", deltaPositive: true },
    { label: "Ready rooms", value: String(ready), sub: "Clean or inspected, free", delta: "", deltaPositive: true },
  ];
};

export const frontOfficeExceptions = (): FrontOfficeException[] => [
  ...ARRIVALS.filter(a => a.vip && a.room && !["Clean", "Inspected"].includes(hkStatus(a.room) ?? "")).map(a => ({ id: `VIP-${a.id}`, title: "VIP arrival, room not ready",
    detail: `${a.guest} arrives at ${a.eta}; room ${a.room} is not ready yet.`, severity: "Critical" as const, screen: "room-assignment" as const, screenLabel: "Room Assignment" })),
  ...ARRIVALS.filter(a => !a.room).map(a => ({ id: `ROOM-${a.id}`, title: "Arrival without a room", detail: `${a.guest}, ${a.type}, arrives at ${a.eta}.`,
    severity: "Warning" as const, screen: "room-assignment" as const, screenLabel: "Room Assignment" })),
  ...overstaying().map(s => ({ id: `OVER-${s.id}`, title: "Past check-out time", detail: `${s.guest}, room ${s.room}, was due out at ${s.checkoutTime}.`,
    severity: "Warning" as const, screen: "check-out" as const, screenLabel: "Check-Out", navParam: s.id })),
];
