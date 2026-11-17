import { Bed, Broom, ClipboardText, Sparkle, User } from "@phosphor-icons/react";
import type { Screen } from "../../constants";
import { BG, BORDER, ERROR, MUTED, TEXT, TEAL_INK } from "../../constants";
import { Badge, BtnO, BtnP, PageHeader, StatCard } from "../../UIKit";
import { hkRooms } from "../../mock/housekeeping";
import { DEPARTMENTS } from "../departments";

const accent = DEPARTMENTS.find(item => item.id === "housekeeping")!.accent;
type Nav = (screen: Screen, label: string, param?: string) => void;

const statusLabel = { Dirty: "Dirty", "In Progress": "In progress", Clean: "Awaiting inspection", Inspected: "Ready" } as const;
const statusColors = {
  Dirty: { bg: "#FEF3C7", text: "#92400E" },
  "In Progress": { bg: "#EFF6FF", text: "#1D4ED8" },
  Clean: { bg: "#EEF2FF", text: "#4338CA" },
  Inspected: { bg: "#F0FDF4", text: "#166534" },
};

// Everything on this page is counted from the same rooms the board shows.
export default function HousekeepingHome({ nav }: { nav: Nav }) {
  const rooms = hkRooms();
  const count = (s: keyof typeof statusLabel) => rooms.filter(r => r.hkSt === s).length;
  const toDo = rooms
    .filter(r => r.hkSt !== "Inspected")
    .sort((a, b) => Number(b.priority) - Number(a.priority) || Number(b.guestState === "Arrival") - Number(a.guestState === "Arrival") || a.id.localeCompare(b.id));
  const onFloor = new Set(rooms.filter(r => r.hkSt === "In Progress").map(r => r.attendant)).size;
  const attention = [
    ...rooms.filter(r => r.dnd).map(r => ({ id: `dnd-${r.id}`, text: `Room ${r.id} has asked not to be disturbed. Check whether a wellness check is due.`, screen: "dnd-log" as Screen, label: "Do Not Disturb Log" })),
    ...rooms.filter(r => !r.attendant).map(r => ({ id: `un-${r.id}`, text: `Room ${r.id} has no attendant${r.priority ? " and is a priority" : ""}.`, screen: "hk-schedule" as Screen, label: "Schedule" })),
    ...rooms.filter(r => r.note.startsWith("Re-clean")).map(r => ({ id: `re-${r.id}`, text: `Room ${r.id} failed inspection and is being cleaned again.`, screen: "hk-inspection" as Screen, label: "Inspection Log" })),
  ];
  const guestColor = (g: string) => g === "Departure" ? ERROR : g === "Arrival" ? TEAL_INK : MUTED;

  return (
    <div>
      <PageHeader title="Housekeeping" sub="Rooms to turn over today, counted from the board."
        actions={<><BtnO label="Open board" icon={Bed} onClick={() => nav("hk-board", "Housekeeping Board")} /><BtnP label="Assign rooms" icon={User} onClick={() => nav("hk-schedule", "Schedule")} /></>} />

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Dirty" value={String(count("Dirty"))} sub={`${rooms.filter(r => r.hkSt === "Dirty" && r.priority).length} priority`} icon={Broom} accent={accent} />
        <StatCard label="Being cleaned" value={String(count("In Progress"))} sub={`${onFloor} attendant${onFloor === 1 ? "" : "s"} on the floor`} icon={User} accent={accent} />
        <StatCard label="Awaiting inspection" value={String(count("Clean"))} sub="Clean, not yet checked" icon={ClipboardText} accent={accent} />
        <StatCard label="Ready" value={String(count("Inspected"))} sub="Inspected and released" icon={Sparkle} accent={accent} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <h2 className="text-base font-semibold" style={{ color: TEXT }}>Rooms still to turn over</h2>
            <p className="mt-0.5 text-sm" style={{ color: MUTED }}>Priority rooms and arrivals first.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr style={{ backgroundColor: BG }}>{["Room", "Guest", "Attendant", "Status"].map(h => <th key={h} className="px-4 py-2.5 text-xs font-semibold" style={{ color: MUTED }}>{h}</th>)}</tr></thead>
              <tbody>{toDo.map(r => (
                <tr key={r.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>Room {r.id}{r.priority && <span className="ml-2 text-xs font-normal" style={{ color: ERROR }}>Priority</span>}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{r.type} · Floor {r.floor}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm" style={{ color: guestColor(r.guestState) }}>{r.guestState}</div>
                    {r.note && <div className="text-xs max-w-[260px]" style={{ color: MUTED }}>{r.note}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: r.attendant ? TEXT : ERROR }}>{r.attendant ?? "Unassigned"}</td>
                  <td className="px-4 py-3"><Badge label={r.dnd ? "Do not disturb" : statusLabel[r.hkSt]} colors={r.dnd ? { bg: "#F1F5F9", text: TEXT } : statusColors[r.hkSt]} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <h2 className="text-base font-semibold" style={{ color: TEXT }}>Needs attention</h2>
          </div>
          {attention.length === 0 && <p className="p-5 text-sm" style={{ color: MUTED }}>Nothing is holding rooms up.</p>}
          {attention.map((a, i) => (
            <div key={a.id} className="p-4" style={{ borderTop: i ? `1px solid ${BORDER}` : undefined }}>
              <p className="text-sm" style={{ color: TEXT }}>{a.text}</p>
              <button onClick={() => nav(a.screen, a.label)} className="mt-1.5 text-sm font-medium" style={{ color: TEAL_INK }}>Open {a.label}</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
