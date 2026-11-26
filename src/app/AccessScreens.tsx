// Access & Security: guest keys (cards and door passcodes) that follow the stay, and the key log (mock/access.ts);
// locks, door alarms, remote unlock and door history (mock/doors.ts).
import React, { useState } from "react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, ERROR, WARNING_INK } from "./constants";
import { PageHeader, BtnO, BtnP, Badge } from "./UIKit";
import { Card, Field, Dialog, controlClass, controlStyle } from "./ui";
import { fmtWhen } from "./mock/maintenance";
import { STAYS } from "./mock/frontOffice";
import { locks, doorEvents, openAlarms, recordDoorEvent, clearAlarm, remoteUnlock, askRemoteUnlock, canUnlockDirectly, LOW_BATTERY, ALARMS, type DoorEvent, type DoorEventKind } from "./mock/doors";
import { keysFor, keyState, validUntil, keyLog, addCard, reportLost, replacePasscode, cancelKey, CARDS_PER_STAY, type GuestKey } from "./mock/access";

type Add = (t: Omit<Toast, "id">) => void;
const td = "px-3 py-2.5 text-sm align-top";
const tone = { Active: { bg: "#DCFCE7", text: "#166534" }, Expired: { bg: "#FEF3C7", text: "#92400E" }, Cancelled: { bg: "#F1F5F9", text: "#334155" }, Lost: { bg: "#FEE2E2", text: "#991B1B" } };
const search = (q: string, ...fields: string[]) => !q.trim() || fields.some(f => f.toLowerCase().includes(q.trim().toLowerCase()));

/** Every guest in house with their keys; extra card, lost card, new passcode, cancel. */
export function GuestKeys({ add, staffName }: { add: Add; staffName: string }) {
  const [q, setQ] = useState("");
  const [cancelling, setCancelling] = useState<GuestKey | null>(null);
  const [why, setWhy] = useState("");
  const [, redraw] = useState(0);
  const done = (r: unknown, ok: (k: GuestKey) => string) => { if (typeof r === "string") add({ type: "error", title: r }); else { add({ type: "success", title: ok(r as GuestKey) }); redraw(n => n + 1); } };
  const stays = STAYS.filter(s => search(q, s.room, s.guest)).sort((a, b) => a.room.localeCompare(b.room));
  return <div>
    <PageHeader title="Guest Keys" sub={`Each guest's cards and door passcode. Issued at check-in, valid until check-out, stopped at check-out. Up to ${CARDS_PER_STAY} cards per stay.`} />
    <Card title={`${stays.length} guests in house`} actions={<input aria-label="Search room or guest" placeholder="Search room or guest" value={q} onChange={e => setQ(e.target.value)} className={controlClass} style={{ ...controlStyle(), maxWidth: 240 }} />}>
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Room", "Guest", "Valid until", "Keys", "Change"].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
        <tbody>{stays.map(s => { const ks = keysFor(s.id).filter(k => keyState(k) !== "Cancelled" && keyState(k) !== "Lost"), until = ks[0] && validUntil(ks[0]);
          return <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
            <td className={td} style={{ color: TEXT }}><b>{s.room}</b></td>
            <td className={td} style={{ color: TEXT }}>{s.guest}<span className="block" style={{ color: MUTED }}>{s.id}</span></td>
            <td className={`${td} whitespace-nowrap`} style={{ color: TEXT }}>{until ? fmtWhen(until) : "No keys"}{s.lateCheckout && <span className="block" style={{ color: WARNING_INK }}>Late check-out</span>}</td>
            <td className={td}>{ks.map(k => <div key={k.id} className="flex items-center gap-2 py-0.5" style={{ color: TEXT }}>
              <span>{k.kind === "Card" ? `Card ${k.serial}` : "Passcode"}</span><Badge label={keyState(k)} colors={tone[keyState(k)]} />
              {k.kind === "Card" && keyState(k) === "Active" && <><BtnO label={`Card ${k.serial} lost`} onClick={() => done(reportLost(k.id, staffName), n => `${k.serial} stopped; ${n.serial} encoded`)} />
                <BtnO label={`Cancel ${k.serial}`} onClick={() => { setWhy(""); setCancelling(k); }} /></>}
            </div>)}</td>
            <td className={td}><div className="flex flex-col items-start gap-2">
              <BtnO label={`Encode another card for room ${s.room}`} onClick={() => done(addCard(s.id, staffName), n => `${n.serial} encoded for room ${s.room}`)} />
              <BtnO label={`New passcode for room ${s.room}`} onClick={() => done(replacePasscode(s.id, staffName), n => `New passcode for room ${s.room}: ${n.code}. The old one has stopped.`)} />
            </div></td>
          </tr>; })}</tbody>
      </table></div>
    </Card>
    {cancelling && <Dialog title={`Cancel ${cancelling.serial}`} sub="The card stops working at once." danger onClose={() => setCancelling(null)}
      footer={<><BtnO label="Back" onClick={() => setCancelling(null)} /><BtnP label="Cancel the card" onClick={() => { const r = cancelKey(cancelling.id, staffName, why); if (r) add({ type: "error", title: r }); else { add({ type: "success", title: `${cancelling.serial} cancelled` }); setCancelling(null); } }} /></>}>
      <Field label="Why" htmlFor="kc-why"><input id="kc-why" value={why} onChange={e => setWhy(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </Dialog>}
  </div>;
}

/** Door passcodes now active, room by room. Codes stay hidden until shown, as the guest's code opens their door. */
export function DoorPasscodes({ add, staffName }: { add: Add; staffName: string }) {
  const [shown, setShown] = useState<string | null>(null);
  const [, redraw] = useState(0);
  const rows = STAYS.flatMap(s => keysFor(s.id).filter(k => k.kind === "Passcode" && keyState(k) === "Active").map(k => ({ s, k }))).sort((a, b) => a.s.room.localeCompare(b.s.room));
  return <div>
    <PageHeader title="Door Passcodes" sub="The code each guest types on their door lock. Valid until check-out; a new code stops the old one." />
    <Card title={`${rows.length} active passcodes`}>
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Room", "Guest", "Passcode", "Valid until", "Change"].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map(({ s, k }) => <tr key={k.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={td} style={{ color: TEXT }}><b>{s.room}</b></td>
          <td className={td} style={{ color: TEXT }}>{s.guest}</td>
          <td className={td} style={{ color: TEXT }}>{shown === k.id ? k.code : "••••••"} <button className="ml-2 underline" style={{ color: MUTED }} aria-label={`${shown === k.id ? "Hide" : "Show"} the passcode for room ${s.room}`} onClick={() => setShown(shown === k.id ? null : k.id)}>{shown === k.id ? "Hide" : "Show"}</button></td>
          <td className={`${td} whitespace-nowrap`} style={{ color: TEXT }}>{fmtWhen(validUntil(k)!)}</td>
          <td className={td}><BtnO label={`New passcode for room ${s.room}`} onClick={() => { const r = replacePasscode(s.id, staffName); if (typeof r === "string") add({ type: "error", title: r }); else { add({ type: "success", title: `New passcode for room ${s.room}: ${r.code}` }); setShown(r.id); redraw(n => n + 1); } }} /></td>
        </tr>)}</tbody>
      </table></div>
    </Card>
  </div>;
}

/** Every key ever issued, cancelled or lost, newest first. Lines are only ever added. */
export function KeyLog() {
  const [q, setQ] = useState("");
  const lines = keyLog().filter(l => search(q, l.room, l.guest, l.by));
  return <div>
    <PageHeader title="Key Log" sub="Every guest key issued, cancelled or reported lost, and who did it. Nothing here is ever changed." />
    <Card title={`${lines.length} entries`} actions={<input aria-label="Search room, guest or staff" placeholder="Search room, guest or staff" value={q} onChange={e => setQ(e.target.value)} className={controlClass} style={{ ...controlStyle(), maxWidth: 260 }} />}>
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["When", "Room", "Guest", "Key", "What happened", "By"].map(h => <th key={h} className="px-3 py-2.5 text-left text-sm font-medium" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
        <tbody>{lines.slice(0, 100).map(l => <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={`${td} whitespace-nowrap`} style={{ color: TEXT }}>{fmtWhen(l.at)}</td>
          <td className={td} style={{ color: TEXT }}>{l.room}</td>
          <td className={td} style={{ color: TEXT }}>{l.guest}</td>
          <td className={td} style={{ color: MUTED }}>{l.kind}</td>
          <td className={td} style={{ color: l.event === "Reported lost" ? ERROR : TEXT }}>{l.event}{l.note ? `. ${l.note}` : ""}</td>
          <td className={td} style={{ color: MUTED }}>{l.by}</td>
        </tr>)}</tbody>
      </table></div>
    </Card>
  </div>;
}

/** Every room's lock: open alarms first, then battery and connection, and opening a door remotely. */
export function LocksAndDoors({ add, role, staffName }: { add: Add; role: string; staffName: string }) {
  const [, redraw] = useState(0);
  const [clearing, setClearing] = useState<DoorEvent | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [why, setWhy] = useState("");
  const [q, setQ] = useState("");
  const [test, setTest] = useState({ room: locks()[0]?.room ?? "", kind: "Forced" as DoorEventKind, battery: "15" });
  const direct = canUnlockDirectly(role);
  const alarms = openAlarms();
  const shown = locks().filter(l => search(q, l.room));
  const done = (r: string | null, ok: string) => { add(r ? { type: "error", title: r } : { type: "success", title: ok }); if (!r) { setClearing(null); setOpening(null); setWhy(""); } redraw(n => n + 1); };
  const lastEvent = (room: string) => doorEvents(room)[0];

  return <div>
    <PageHeader title="Locks & Doors" sub={direct ? "Door alarms, lock batteries and connection, and opening a door remotely. Every remote unlock is logged with who and why."
      : "Lock batteries and connection. To open a door remotely, ask: Security or a manager approves, then it opens."} />
    {alarms.length > 0 && <div className="mb-5"><Card title={`${alarms.length} door alarm${alarms.length === 1 ? "" : "s"} open`} sub="Go to the room, then clear the alarm with what you found." flush>
      <table className="w-full"><tbody>{alarms.map(e => <tr key={e.id} style={{ borderTop: `1px solid ${BORDER}` }}>
        <td className={td} style={{ color: ERROR }}>Room {e.room}: door {e.kind.toLowerCase()}</td>
        <td className={td} style={{ color: MUTED }}>{fmtWhen(e.at)}</td>
        <td className={`${td} text-right`}>{direct && <BtnP label={`Clear the room ${e.room} alarm`} onClick={() => { setWhy(""); setClearing(e); }} />}</td>
      </tr>)}</tbody></table>
    </Card></div>}
    <Card title={`${shown.length} locks`} actions={<input aria-label="Search room" placeholder="Search room" value={q} onChange={e => setQ(e.target.value)} className={controlClass} style={controlStyle()} />} flush>
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="text-left text-sm" style={{ color: MUTED }}>{["Room", "Lock", "Battery", "Last at the door", ""].map((h, i) => <th key={i} className="px-3 py-2.5 font-medium">{h}</th>)}</tr></thead>
        <tbody>{shown.map(l => { const e = lastEvent(l.room); return <tr key={l.room} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={td} style={{ color: TEXT }}>{l.room}</td>
          <td className={td}><Badge label={l.online ? "Online" : "Offline"} colors={l.online ? { bg: "#DCFCE7", text: "#166534" } : { bg: "#FEE2E2", text: "#991B1B" }} /></td>
          <td className={td} style={{ color: l.battery < LOW_BATTERY ? ERROR : TEXT }}>{l.battery}%{l.battery < LOW_BATTERY ? ", change it" : ""}</td>
          <td className={td} style={{ color: MUTED }}>{e ? `${e.kind}, ${fmtWhen(e.at)}` : "Nothing today"}</td>
          <td className={`${td} text-right`}>{l.online ? <BtnO label={direct ? `Open room ${l.room} now` : `Ask to open room ${l.room}`} onClick={() => { setWhy(""); setOpening(l.room); }} /> : <span className="text-sm" style={{ color: MUTED }}>Can't open while offline</span>}</td>
        </tr>; })}</tbody>
      </table></div>
    </Card>
    {role === "MGT" && <div className="mt-5"><Card title="Test a lock event (demo)" sub="Until the lock system is connected, this stands in for what a lock reports.">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Room" htmlFor="te-room"><select id="te-room" value={test.room} onChange={e => setTest(t => ({ ...t, room: e.target.value }))} className={controlClass} style={controlStyle()}>{locks().map(l => <option key={l.room}>{l.room}</option>)}</select></Field>
        <Field label="What the lock reports" htmlFor="te-kind"><select id="te-kind" value={test.kind} onChange={e => setTest(t => ({ ...t, kind: e.target.value as DoorEventKind }))} className={controlClass} style={controlStyle()}>
          {(["Forced", "Held open", "Tampered", "Low battery", "Offline", "Back online"] as DoorEventKind[]).map(k => <option key={k}>{k}</option>)}</select></Field>
        {test.kind === "Low battery" && <Field label="Battery (%)" htmlFor="te-bat"><input id="te-bat" value={test.battery} onChange={e => setTest(t => ({ ...t, battery: e.target.value }))} className={controlClass} style={controlStyle()} /></Field>}
        <BtnP label="Send the lock event" onClick={() => { recordDoorEvent(test.room, test.kind, test.kind === "Low battery" ? test.battery : undefined); add({ type: "info", title: `Room ${test.room}: ${test.kind.toLowerCase()} recorded` }); redraw(n => n + 1); }} />
      </div>
    </Card></div>}
    {clearing && <Dialog title={`Clear the room ${clearing.room} alarm`} sub={`Door ${clearing.kind.toLowerCase()} at ${fmtWhen(clearing.at)}.`} onClose={() => setClearing(null)}
      footer={<><BtnO label="Back" onClick={() => setClearing(null)} /><BtnP label="Clear the alarm" onClick={() => done(clearAlarm(clearing.id, staffName, role, why), `Room ${clearing.room} alarm cleared`)} /></>}>
      <Field label="What you found" htmlFor="da-note"><input id="da-note" value={why} onChange={e => setWhy(e.target.value)} className={controlClass} style={controlStyle()} /></Field>
    </Dialog>}
    {opening && <Dialog title={direct ? `Open room ${opening} now` : `Ask to open room ${opening}`} sub={direct ? "The door opens at once. The reason is kept in the door history." : "Security or a manager approves it from their dashboard; the door opens then."} onClose={() => setOpening(null)}
      footer={<><BtnO label="Back" onClick={() => setOpening(null)} /><BtnP label={direct ? "Open the door" : "Send the request"} onClick={() =>
        direct ? done(remoteUnlock(opening, staffName, role, why), `Room ${opening} opened`) : done(askRemoteUnlock(opening, staffName, why), `Request to open room ${opening} sent`)} /></>}>
      <Field label="Why" htmlFor="ru-why"><input id="ru-why" value={why} onChange={e => setWhy(e.target.value)} placeholder="Guest locked out, ID checked" className={controlClass} style={controlStyle()} /></Field>
    </Dialog>}
  </div>;
}

/** What happened at each door. Security and managers only. */
export function DoorHistory() {
  const [room, setRoom] = useState("");
  const lines = doorEvents(room || undefined);
  return <div>
    <PageHeader title="Door History" sub="Every opening, alarm and remote unlock at each door, and who did it. Security and managers only." />
    <Card title={`${lines.length} entries`} actions={<select aria-label="Room" value={room} onChange={e => setRoom(e.target.value)} className={controlClass} style={controlStyle()}>
      <option value="">Every room</option>{locks().map(l => <option key={l.room}>{l.room}</option>)}</select>} flush>
      {lines.length === 0 ? <p className="px-6 py-5 text-sm" style={{ color: MUTED }}>Nothing at this door yet.</p> :
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="text-left text-sm" style={{ color: MUTED }}>{["When", "Room", "What happened", "By", "Cleared"].map(h => <th key={h} className="px-3 py-2.5 font-medium">{h}</th>)}</tr></thead>
        <tbody>{lines.slice(0, 200).map(e => <tr key={e.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <td className={`${td} whitespace-nowrap`} style={{ color: TEXT }}>{fmtWhen(e.at)}</td>
          <td className={td} style={{ color: TEXT }}>{e.room}</td>
          <td className={td} style={{ color: ALARMS.includes(e.kind) ? ERROR : TEXT }}>{e.kind}{e.note ? `. ${e.note}` : ""}</td>
          <td className={td} style={{ color: MUTED }}>{e.by ?? "The lock"}</td>
          <td className={td} style={{ color: MUTED }}>{e.clearedBy ? `${e.clearedBy}: ${e.clearNote}` : ALARMS.includes(e.kind) ? "Not yet" : ""}</td>
        </tr>)}</tbody>
      </table></div>}
    </Card>
  </div>;
}
