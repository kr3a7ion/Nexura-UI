// Requests that need a manager or a department lead to say yes. The person asking keeps working;
// the request waits on the approver's dashboard, and the change happens only when it is approved.
// shortcut: kept in memory with the change to make as a function; the hotel server stores the request and replays the change.
import type { Role } from "../constants";
import { notify } from "./notify";

// Only decisions that give money away need a second person; check-in and check-out never wait.
// Purchase: something bought outside the store for a maintenance job, above the supervisor's limit.
export type ApprovalKind = "Rate override" | "Discount" | "Purchase";
export type Approval = {
  id: string; kind: ApprovalKind; dept: string; ref: string; title: string; detail: string; reason: string;
  requestedBy: string; at: string; status: "Waiting" | "Approved" | "Declined"; decidedBy?: string; note?: string;
  apply: () => boolean; // false when the change can no longer be made, for example the guest has left
};

// Who may approve each department's requests. Roles & Permissions changes this.
const APPROVERS: Record<string, Role[]> = { "Front Office": ["MGT"] };
export const approverRoles = (dept: string) => APPROVERS[dept] ?? ["MGT"];
export const setApproverRoles = (dept: string, roles: Role[]) => { APPROVERS[dept] = roles.includes("MGT") ? roles : ["MGT", ...roles]; };
// A department can also name people who approve its requests, for when a role is too wide: the Maintenance role covers
// technicians, but only its head of department approves its purchases.
const PEOPLE: Record<string, () => string[]> = {};
export const setApproverPeople = (dept: string, who: () => string[]) => { PEOPLE[dept] = who; };
export const approverPeople = (dept: string) => PEOPLE[dept]?.() ?? [];
/** Name a department's approvers from the staff list (Admin, Roles & Permissions). Managers can always approve as well. */
export const setApproverNames = (dept: string, names: string[]) => { const list = [...new Set(names)]; PEOPLE[dept] = () => list; };
export const canApprove = (role: Role, dept: string, name?: string) => approverRoles(dept).includes(role) || (!!name && approverPeople(dept).includes(name));

const LIST: Approval[] = [];
let next = 1;
const time = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// One waiting request per kind and booking; asking again replaces the details of the waiting one.
export const requestApproval = (a: Omit<Approval, "id" | "at" | "status">) => {
  const waiting = LIST.find(x => x.kind === a.kind && x.ref === a.ref && x.status === "Waiting");
  if (waiting) { Object.assign(waiting, a, { at: time() }); return waiting; }
  const created: Approval = { ...a, id: `APR-${String(next++).padStart(3, "0")}`, at: time(), status: "Waiting" };
  LIST.unshift(created);
  notify("approval.requested", { title: `${a.kind} to approve: ${a.title}`, body: `${a.detail}. ${a.reason}.`, roles: approverRoles(a.dept), people: approverPeople(a.dept), link: { screen: "suite-home", label: "Suite Home" } });
  return created;
};

export const waitingFor = (role: Role, name?: string) => LIST.filter(a => a.status === "Waiting" && canApprove(role, a.dept, name));

// Nobody approves their own request. Returns a reason when the decision is refused.
export const decide = (id: string, approve: boolean, by: string, role: Role, note = "") => {
  const a = LIST.find(x => x.id === id);
  if (!a || a.status !== "Waiting") return "This request has already been decided.";
  if (!canApprove(role, a.dept, by)) return "You cannot approve this department's requests.";
  if (a.requestedBy === by) return "Someone else must approve your own request.";
  // Approving after the guest has checked out would change a closed bill, so it is declined instead.
  const tooLate = approve && !a.apply();
  if (tooLate) { approve = false; note = "The guest checked out before this was approved; settle it at Finance."; }
  Object.assign(a, { status: approve ? "Approved" : "Declined", decidedBy: by, note });
  notify("approval.decided", { title: `${a.kind} ${approve ? "approved" : "declined"}: ${a.title}`, body: approve ? `${by} approved ${a.detail}.` : `${by}: ${note}`, people: [a.requestedBy] });
  return tooLate ? note : null;
};
