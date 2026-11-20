// Requests waiting for this person to approve, on the manager's home and the department's home.
import { useState } from "react";
import type { Role } from "../constants";
import { BORDER, MUTED, TEXT, display } from "../constants";
import { Badge, BtnO, BtnP } from "../UIKit";
import { Dialog, Field, controlClass, controlStyle } from "../ui";
import { waitingFor, decide } from "../mock/approvals";

export function ApprovalsCard({ role, staffName, dept }: { role: Role; staffName: string; dept?: string }) {
  const [, refresh] = useState(0);
  const [declining, setDeclining] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const list = waitingFor(role).filter(a => !dept || a.dept === dept);
  if (!list.length && !message) return null;

  const act = (id: string, approve: boolean, why = "") => {
    const refused = decide(id, approve, staffName, role, why);
    setMessage(refused ?? `${approve ? "Approved" : "Declined"}. The person who asked can see it now.`);
    setDeclining(null); setNote(""); refresh(n => n + 1);
  };

  return (
    <section className="mt-6" aria-label="Waiting for your approval">
      <h2 className="mb-3 text-sm font-bold" style={{ color: TEXT, fontFamily: display }}>Waiting for your approval</h2>
      {message && <p role="status" className="mb-2 text-sm" style={{ color: MUTED }}>{message}</p>}
      {list.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          {list.map((a, i) => (
            <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center" style={{ borderTop: i ? `1px solid ${BORDER}` : undefined }}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><Badge label={a.kind} colors={{ bg: "#F1F5F9", text: "#475569" }} /><span className="text-sm font-semibold" style={{ color: TEXT }}>{a.title}</span></div>
                <p className="mt-1 text-sm" style={{ color: TEXT }}>{a.detail}</p>
                <p className="mt-0.5 text-sm" style={{ color: MUTED }}>{a.reason}. Asked by {a.requestedBy} at {a.at}, {a.dept}.</p>
              </div>
              {a.requestedBy === staffName
                ? <p className="text-sm" style={{ color: MUTED }}>Your own request: someone else approves it.</p>
                : <div className="flex flex-none gap-2"><BtnO label="Decline" onClick={() => setDeclining(a.id)} /><BtnP label="Approve" onClick={() => act(a.id, true)} /></div>}
            </div>
          ))}
        </div>
      )}
      {declining && (
        <Dialog title="Decline this request" onClose={() => setDeclining(null)}
          footer={<><BtnO label="Back" onClick={() => setDeclining(null)} /><BtnP label="Decline request" onClick={() => note.trim() && act(declining, false, note.trim())} /></>}>
          <Field label="Why decline it" htmlFor="apr-why" required hint="The person who asked sees this.">
            <input id="apr-why" value={note} onChange={e => setNote(e.target.value)} className={controlClass} style={controlStyle(!note.trim())} />
          </Field>
        </Dialog>
      )}
    </section>
  );
}
