// Vehicle requests (mock/fleet.ts): any department asks Fleet for a vehicle. Its supervisor or manager signs it off,
// then Fleet approves it. One screen for everyone: what you asked for, what waits for you to sign off, what waits for Fleet.
import React, { useState } from "react";
import type { Toast, Role } from "./constants";
import { BORDER, TEXT, MUTED } from "./constants";
import { PageHeader, BtnO, BtnP } from "./UIKit";
import { Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { trips, canSignOff, canFleetApprove, signOff, fleetDecide, type Trip } from "./mock/fleet";

const td = "px-3 py-2.5 text-sm align-top";
const STATE: Record<string, string> = { "waiting-department": "Waiting for department sign-off", "waiting-fleet": "Waiting for Fleet", "turned-down": "Turned down",
  requested: "Approved, vehicle to be assigned", assigned: "Vehicle assigned", dispatched: "On its way", "en-route": "On its way", "in-transit": "On its way", completed: "Done", cancelled: "Cancelled" };

export function VehicleRequests({ add, nav, role, staffName }: { add: (t: Omit<Toast, "id">) => void; nav: (s: string, label: string) => void; role: Role; staffName: string }) {
  const [, redraw] = useState(0);
  const [turning, setTurning] = useState<{ t: Trip; step: "dept" | "fleet" } | null>(null);
  const [why, setWhy] = useState("");
  const all = trips();
  const toSign = all.filter(t => canSignOff(t, staffName, role));
  const toFleet = all.filter(t => canFleetApprove(t, staffName, role));
  const mine = all.filter(t => t.requestedBy === staffName);
  const done = (r: string | null, ok: string) => { add(r ? { type: "error", title: r } : { type: "success", title: ok }); redraw(n => n + 1); };

  const table = (list: Trip[], step?: "dept" | "fleet") => <table className="w-full">
    <thead><tr className="text-left text-xs" style={{ color: MUTED }}><th className={td}>Request</th><th className={td}>For</th><th className={td}>Trip</th><th className={td}>When</th><th className={td}>State</th>{step && <th className={td}><span className="sr-only">Actions</span></th>}</tr></thead>
    <tbody>{list.map(t => <tr key={t.id} style={{ borderTop: `1px solid ${BORDER}` }}>
      <td className={td} style={{ color: TEXT }}>{t.id}{t.priority !== "Normal" && <div className="text-xs font-semibold" style={{ color: "#B45309" }}>{t.priority}</div>}</td>
      <td className={td} style={{ color: TEXT }}>{t.guest ? `Guest: ${t.guest}` : `${t.dept}, ${t.requestedBy}`}{t.notes && <div className="text-xs" style={{ color: MUTED }}>{t.notes}</div>}</td>
      <td className={td} style={{ color: TEXT }}>{t.pickup} to {t.dropoff}<div className="text-xs" style={{ color: MUTED }}>{t.pax} passenger{t.pax === 1 ? "" : "s"}</div></td>
      <td className={td} style={{ color: TEXT }}>{t.scheduledTime}</td>
      <td className={td} style={{ color: TEXT }}>{STATE[t.status]}{t.turnDownReason && <div className="text-xs" style={{ color: MUTED }}>{t.turnedDownBy}: {t.turnDownReason}</div>}{t.signedOffBy && t.status !== "turned-down" && <div className="text-xs" style={{ color: MUTED }}>Signed off by {t.signedOffBy}</div>}</td>
      {step && <td className={td}><div className="flex justify-end gap-2">
        <BtnO label={`Turn down ${t.id}`} onClick={() => { setWhy(""); setTurning({ t, step }); }} />
        <BtnP label={step === "dept" ? `Sign off ${t.id}` : `Approve ${t.id}`} onClick={() => done(step === "dept" ? signOff(t.id, staffName, role, true) : fleetDecide(t.id, staffName, role, true), step === "dept" ? `${t.id} signed off and sent to Fleet` : `${t.id} approved; Fleet can assign a vehicle`)} />
      </div></td>}
    </tr>)}</tbody>
  </table>;

  return <div>
    <PageHeader title="Vehicle Requests" sub="Ask Fleet for a vehicle. Your department's supervisor or manager signs it off, then Fleet approves it. Guest trips go straight to Fleet."
      actions={<BtnP label="Request a vehicle" onClick={() => nav("new-trip", "New Trip Request")} />} />
    <div className="space-y-5">
      {toSign.length > 0 && <Card title="To sign off for your department" sub="Nobody signs off their own request." flush>{table(toSign, "dept")}</Card>}
      {toFleet.length > 0 && <Card title="Waiting for Fleet's approval" sub="Whoever signed it off for the department can't also approve it here." flush>{table(toFleet, "fleet")}</Card>}
      <Card title="Your requests" flush>{mine.length ? table(mine) : <p className="px-6 py-5 text-sm" style={{ color: MUTED }}>You have not asked for a vehicle yet.</p>}</Card>
    </div>
    {turning && <Dialog title={`Turn down ${turning.t.id}`} sub="The person who asked is told why." danger onClose={() => setTurning(null)}
      footer={<><BtnO label="Back" onClick={() => setTurning(null)} /><BtnP label="Turn it down" onClick={() => {
        const r = turning.step === "dept" ? signOff(turning.t.id, staffName, role, false, why) : fleetDecide(turning.t.id, staffName, role, false, why);
        done(r, `${turning.t.id} turned down`); if (!r) setTurning(null); }} /></>}>
      <Field label="Why" htmlFor="vr-why"><input id="vr-why" value={why} onChange={e => setWhy(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </Dialog>}
  </div>;
}
