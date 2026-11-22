// Maintenance: shift handover. The system fills the facts; people write the judgement and the next shift signs for it.
import React, { useState } from "react";
import { Printer } from "lucide-react";
import type { Toast } from "./constants";
import { BORDER, TEXT, MUTED, TEAL_INK } from "./constants";
import { PageHeader, BtnP, BtnO, Badge } from "./UIKit";
import { Card, Field, controlClass, controlStyle } from "./ui";
import { WO_PRI_C } from "./WorkOrderScreens";
import { fmtWhen } from "./mock/maintenance";
import { draft, handovers, submitHandover, acknowledgeHandover } from "./mock/handover";

type Add = (t: Omit<Toast, "id">) => void;
type Nav = (s: string, label: string, param?: string) => void;

export function MaintenanceHandover({ add, nav, staffName }: { add: Add; nav?: Nav; staffName: string }) {
  const [notes, setNotes] = useState("");
  const [keys, setKeys] = useState("");
  const [tried, setTried] = useState(false);
  const [, redraw] = useState(0);
  const d = draft();
  const submit = () => {
    setTried(true);
    const r = submitHandover(staffName, notes, keys);
    if (typeof r === "string") { add({ type: "error", title: r }); return; }
    add({ type: "success", title: "Handover submitted", body: "The incoming shift has been told to read and acknowledge it." });
    setNotes(""); setKeys(""); setTried(false); redraw(n => n + 1);
  };
  const acknowledge = (id: string) => {
    const refused = acknowledgeHandover(id, staffName);
    if (refused) add({ type: "error", title: refused }); else { add({ type: "success", title: "Handover acknowledged" }); redraw(n => n + 1); }
  };

  return (
    <div>
      <PageHeader title="Shift Handover" sub="The system fills in the facts it already holds, so you only write what it cannot know."
        actions={<><BtnO label="Print the book" icon={Printer} onClick={() => window.print()} /><BtnP label="Submit handover" onClick={submit} /></>} />
      <div className="grid xl:grid-cols-3 gap-4 items-start">
        <div className="xl:col-span-2 space-y-4">
          <Card title="Plant state at handover" sub="Filled by the system.">
            {d.plant.length ? d.plant.map(p => (
              <div key={p.id} className="flex justify-between py-2 text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}>
                <span className="font-semibold">{p.name}</span><span style={{ color: MUTED }}>{p.status}{p.meter ? `, ${p.meter}` : ""}</span>
              </div>)) : <p className="text-sm" style={{ color: MUTED }}>No plant on the register.</p>}
          </Card>
          <Card title="Jobs carried into the next shift" sub={`${d.carried.length} open, most urgent first.`}>
            {d.carried.length ? d.carried.map(j => (
              <button key={j.id} type="button" onClick={() => nav?.("work-order-detail", j.id, j.id)} className="w-full text-left flex items-center gap-3 py-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                <Badge label={j.priority} colors={WO_PRI_C[j.priority]} />
                <span className="text-sm flex-1" style={{ color: TEXT }}><b>{j.id}</b> {j.title}</span>
                <span className="text-sm whitespace-nowrap" style={{ color: MUTED }}>{j.status}{j.holdReason ? ` (${j.holdReason.toLowerCase()})` : ""}{j.with ? `, ${j.with}` : ", nobody yet"}</span>
              </button>)) : <p className="text-sm" style={{ color: MUTED }}>Nothing carried over.</p>}
          </Card>
          <Card title="What the next shift must know">
            <Field label="Notes" htmlFor="ho-notes" required error={tried && notes.trim().length < 5 ? "Write what the next shift must know." : undefined}
              hint="Access restrictions, what you tried, what to watch overnight, anything the system cannot see.">
              <textarea id="ho-notes" rows={5} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3.5 py-2.5 text-sm outline-none resize-none" style={controlStyle(tried && notes.trim().length < 5)} />
            </Field>
            <Field label="Keys and permits held" htmlFor="ho-keys">
              <input id="ho-keys" value={keys} onChange={e => setKeys(e.target.value)} className={controlClass} style={controlStyle()} />
            </Field>
            <p className="text-sm mt-3" style={{ color: MUTED }}>A handover book fails in two ways: the outgoing shift writes too little, and the incoming shift never signs. Acknowledging here is how the next shift signs.</p>
            <div className="hidden print:grid grid-cols-2 gap-8 mt-10 text-sm" style={{ color: TEXT }}>
              <div style={{ borderTop: `1px solid ${TEXT}` }} className="pt-2">Handed over by: signature, name and time</div>
              <div style={{ borderTop: `1px solid ${TEXT}` }} className="pt-2">Taken over by: signature, name and time</div>
            </div>
          </Card>
        </div>
        <Card title="Recent handovers">
          {handovers().map(h => (
            <div key={h.id} className="py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>{fmtWhen(h.at)}, {h.shift} shift</div>
                  <div className="text-sm" style={{ color: MUTED }}>{h.from} → {h.acknowledgedBy ?? "next shift"}. {h.carried.length} job{h.carried.length === 1 ? "" : "s"} carried.</div>
                </div>
                {h.status === "Acknowledged" ? <Badge label="Acknowledged" colors={{ bg: "#DCFCE7", text: "#166534" }} />
                  : h.from === staffName ? <Badge label="Waiting" colors={{ bg: "#FEF3C7", text: "#92400E" }} />
                  : <BtnP label={`Acknowledge ${h.id}`} onClick={() => acknowledge(h.id)} />}
              </div>
              <p className="text-sm mt-1.5" style={{ color: TEXT }}>{h.notes}</p>
              {h.keys && <p className="text-sm mt-1" style={{ color: MUTED }}>Keys and permits: {h.keys}</p>}
              {h.acknowledgedAt && <p className="text-sm mt-1" style={{ color: TEAL_INK }}>Acknowledged by {h.acknowledgedBy}, {fmtWhen(h.acknowledgedAt)}</p>}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
