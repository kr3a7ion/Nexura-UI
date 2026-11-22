// Permits to work, as FacilityFlow issues them (routes/safety.ts, pages/Safety.tsx): the person who asks is
// never the person who issues, a live permit is a lock on plant, and no permit closes while a lock is still on.
import { now, workOrder } from "./maintenance";
import { notify } from "./notify";
import { holdersOf } from "./roster";
import { BUSINESS_DATE } from "../constants";

export const PERMIT_TYPES = { hotWork: "Hot work", electrical: "Electrical isolation", height: "Working at height", confined: "Confined space", excavation: "Excavation" } as const;
export type PermitType = keyof typeof PERMIT_TYPES;
/** Standard precautions per type: a starting point, not a substitute for judgement. */
export const PRECAUTIONS: Record<PermitType, string[]> = {
  hotWork: ["Fire extinguisher within reach", "Combustibles removed or covered", "Fire watch posted for 30 minutes after work", "Smoke detector isolated and logged"],
  electrical: ["Circuit proved dead at the point of work", "Locks and tags fitted", "Keys held by the issuing officer", "Test lamp proved before and after"],
  height: ["Anchor point inspected", "Harness and lanyard within test date", "Area below barricaded", "Second person at ground level"],
  confined: ["Atmosphere tested before entry", "Continuous gas monitoring", "Standby person at the entrance", "Rescue plan agreed"],
  excavation: ["Underground services traced", "Edges shored or battered", "Barricades and lighting in place", "Spoil kept back from the edge"],
};
export type IsolationPoint = { id: string; desc: string; lockTag?: string; isolatedAt?: Date; isolatedBy?: string; restoredAt?: Date; restoredBy?: string };
export type Permit = { id: string; type: PermitType; woId?: string; requestedBy: string; issuedBy?: string; validFrom: Date; validTo: Date;
  precautions: string[]; points: IsolationPoint[]; status: "Requested" | "Issued" | "Closed"; closedBy?: string; closedAt?: Date };

// Seeds use the business date directly: mock/maintenance.ts imports this file, so it is not loaded yet here.
const h = (hours: number) => new Date(BUSINESS_DATE.getFullYear(), BUSINESS_DATE.getMonth(), BUSINESS_DATE.getDate(), 10, 15 + hours * 60);
const LIST: Permit[] = [
  { id: "PTW-0001", type: "electrical", woId: "WO-0092", requestedBy: "Emeka Obi", issuedBy: "Yusuf Garba", validFrom: h(-2), validTo: h(6), status: "Issued",
    precautions: PRECAUTIONS.electrical, points: [{ id: "i1", desc: "Room 309 sub-board, breaker 4", lockTag: "LT-12", isolatedAt: h(-1.5), isolatedBy: "Yusuf Garba" }] },
];
let next = 2;
export const permits = () => LIST;
export const permit = (id: string) => LIST.find(p => p.id === id);
export const permitsFor = (woId: string) => LIST.filter(p => p.woId === woId);
export const livePermits = () => LIST.filter(p => p.status === "Issued");
export const lockedPoints = (p: Permit) => p.points.filter(i => i.isolatedAt && !i.restoredAt);
export const isExpired = (p: Permit) => p.status === "Issued" && p.validTo < now();

export const requestPermit = (r: { type: PermitType; woId?: string; validFrom: Date; validTo: Date; precautions: string[]; points: { desc: string; lockTag?: string }[] }, by: string): Permit | string => {
  if (!(r.validTo > r.validFrom)) return "The permit must end after it starts.";
  if (r.woId && !workOrder(r.woId)) return "There is no such work order.";
  if (r.type === "electrical" && !r.points.some(p => p.desc.trim())) return "List at least one point to isolate.";
  const p: Permit = { id: `PTW-${String(next++).padStart(4, "0")}`, type: r.type, woId: r.woId, requestedBy: by, validFrom: r.validFrom, validTo: r.validTo,
    precautions: r.precautions.filter(x => x.trim()), status: "Requested",
    points: r.points.filter(x => x.desc.trim()).map((x, i) => ({ id: `p${next}-${i}`, desc: x.desc.trim(), lockTag: x.lockTag?.trim() || undefined })) };
  LIST.unshift(p);
  notify("permit.requested", { title: `${p.id}: ${PERMIT_TYPES[p.type].toLowerCase()} permit to issue`, body: `Requested by ${by}${p.woId ? ` for ${p.woId}` : ""}.`, people: holdersOf("Supervisor"), link: { screen: "mx-permits", label: "Permits" } });
  return p;
};

/** The person who asks for a permit is not the person who issues it. */
export const issuePermit = (id: string, by: string): string | null => {
  const p = permit(id); if (!p) return "That permit does not exist.";
  if (p.requestedBy === by) return "You requested this permit, so someone else has to issue it.";
  if (p.status !== "Requested") return `That permit is already ${p.status.toLowerCase()}.`;
  Object.assign(p, { status: "Issued", issuedBy: by });
  notify("permit.issued", { title: `${p.id} issued: you can start`, body: `${PERMIT_TYPES[p.type]}, valid to ${p.validTo.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}. Issued by ${by}.`, people: [p.requestedBy], link: { screen: "mx-permits", label: "Permits" } });
  return null;
};

/** Lock out a point, or restore it. Only on an issued permit, and in that order. */
export const isolatePoint = (id: string, pointId: string, by: string, action: "isolate" | "restore"): string | null => {
  const p = permit(id); const pt = p?.points.find(x => x.id === pointId);
  if (!p || !pt) return "That isolation point does not exist.";
  if (p.status !== "Issued") return "Points are isolated and restored only on an issued permit.";
  if (action === "isolate") { if (pt.isolatedAt) return "That point is already isolated."; Object.assign(pt, { isolatedAt: now(), isolatedBy: by }); }
  else { if (!pt.isolatedAt || pt.restoredAt) return "That point is not isolated."; Object.assign(pt, { restoredAt: now(), restoredBy: by }); }
  return null;
};

/** No permit closes while a lock is still on. */
export const closePermit = (id: string, by: string): string | null => {
  const p = permit(id); if (!p) return "That permit does not exist.";
  if (p.status !== "Issued") return "Only an issued permit can be closed.";
  const locked = lockedPoints(p).length;
  if (locked) return `${locked} isolation point${locked === 1 ? " is" : "s are"} still locked out. Restore ${locked === 1 ? "it" : "them"} before closing the permit.`;
  Object.assign(p, { status: "Closed", closedBy: by, closedAt: now() });
  return null;
};
