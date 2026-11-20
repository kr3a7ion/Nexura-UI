// Where each room stands right now, worked out from the department that owns each fact:
// Front Office owns guests, Maintenance owns out of order, Housekeeping owns clean.
// No screen stores a room state, so two screens can never disagree about a room.
import { STAYS, ARRIVALS } from "./frontOffice";
import { hkStatus } from "./housekeeping";
import { isOutOfOrder } from "./maintenance";
import { ROOMS } from "./property";

export const ROOM_STATES = ["Occupied", "Arriving today", "Out of order", "Being cleaned", "Ready"] as const;
export type RoomState = typeof ROOM_STATES[number];
export const ROOM_STATE_COLOR: Record<RoomState, string> = {
  Occupied: "#0F766E", "Arriving today": "#0369A1", "Out of order": "#DC2626", "Being cleaned": "#B45309", Ready: "#16A34A",
};

export const roomState = (id: string): RoomState => {
  if (STAYS.some(s => s.room === id)) return "Occupied";
  if (isOutOfOrder(id)) return "Out of order";
  if (ARRIVALS.some(a => a.room === id)) return "Arriving today";
  const hk = hkStatus(id);
  return hk === "Clean" || hk === "Inspected" ? "Ready" : "Being cleaned";
};

export const roomCounts = () => ROOM_STATES.map(state => ({ state, color: ROOM_STATE_COLOR[state], count: ROOMS.filter(r => roomState(r.id) === state).length }));
