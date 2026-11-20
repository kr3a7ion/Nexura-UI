// Requests that need a manager or a department lead to say yes. The person asking keeps working;
// the request waits on the approver's dashboard, and the change happens only when it is approved.
// shortcut: kept in memory with the change to make as a function; the hotel server stores the request and replays the change.
import type { Role } from "../constants";

// Only decisions that give money away need a second person; check-in and check-out never wait.
export type ApprovalKind = "Rate override" | "Discount";
export type Approval = {
  id: string; kind: ApprovalKind; dept: string; ref: string; title: string; detail: string; reason: string;
  requestedBy: string; at: string; status: "Waiting" | "Approved" | "Declined"; decidedBy?: string; note?: string;
  apply: () => void;
};

// Who may approve each department's requests. Roles & Permissions changes this.
const APPROVERS: Record<string, Role[]> = { "Front Office": ["MGT"] };
export const approverRoles = (dept: string) => APPROVERS[dept] ?? ["MGT"];
export const setApproverRoles = (dept: string, roles: Role[]) => { APPROVERS[dept] = roles.includes("MGT") ? roles : ["MGT", ...roles]; };
export const canApprove = (role: Role, dept: string) => approverRoles(dept).includes(role);

const LIST: Approval[] = [];
let next = 1;
const time = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// One waiting request per kind and booking; asking again replaces the details of the waiting one.
export const requestApproval = (a: Omit<Approval, "id" | "at" | "status">) => {
  const waiting = LIST.find(x => x.kind === a.kind && x.ref === a.ref && x.status === "Waiting");
  if (waiting) { Object.assign(waiting, a, { at: time() }); return waiting; }
  const created: Approval = { ...a, id: `APR-${String(next++).padStart(3, "0")}`, at: time(), status: "Waiting" };
  LIST.unshift(created);
  return created;
};

export const approvals = () => LIST;
export const waitingFor = (role: Role) => LIST.filter(a => a.status === "Waiting" && canApprove(role, a.dept));
export const latestFor = (kind: ApprovalKind, ref: string) => LIST.find(a => a.kind === kind && a.ref === ref);

// Nobody approves their own request. Returns a reason when the decision is refused.
export const decide = (id: string, approve: boolean, by: string, role: Role, note = "") => {
  const a = LIST.find(x => x.id === id);
  if (!a || a.status !== "Waiting") return "This request has already been decided.";
  if (!canApprove(role, a.dept)) return "You cannot approve this department's requests.";
  if (a.requestedBy === by) return "Someone else must approve your own request.";
  Object.assign(a, { status: approve ? "Approved" : "Declined", decidedBy: by, note });
  if (approve) a.apply();
  return null;
};
