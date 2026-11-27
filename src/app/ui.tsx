// Global UI values. Every form, card, stepper and choice in the suite uses these,
// so screens look and behave the same. Change a value here, not on a screen.
import React from "react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { BORDER, ERROR, MUTED, PRIMARY, SUBTLE, TEXT, TEAL_INK, display } from "./constants";

export const UI = {
  controlHeight: 44,      // inputs, selects, main buttons
  radius: { control: 10, card: 16 },
  pad: { card: 24 },      // inside cards
  gap: { section: 28, field: 16 },
  focus: "#0F766E",       // focus ring and selected outline (TEAL_INK)
  selectedBg: "#F0FDFA",  // selected choice fill
  surface: "#F8FAFC",     // quiet panels inside cards
} as const;

// Inputs and selects share one look.
export const controlClass = "w-full px-3.5 text-sm outline-none bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]";
export const controlStyle = (error?: boolean): React.CSSProperties => ({
  height: UI.controlHeight, borderRadius: UI.radius.control, color: TEXT,
  border: `1px solid ${error ? ERROR : "#CBD5E1"}`,
});

export function Field({ label, htmlFor, hint, error, required, children }: {
  label: string; htmlFor?: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5" style={{ color: TEXT }}>
        {label}{required && <span style={{ color: ERROR }} aria-hidden> *</span>}
      </label>
      {children}
      {error ? <p role="alert" className="mt-1.5 text-sm" style={{ color: ERROR }}>{error}</p>
        : hint ? <p className="mt-1.5 text-sm" style={{ color: MUTED }}>{hint}</p> : null}
    </div>
  );
}

export function Card({ title, sub, actions, children, footer, flush }: {
  title?: string; sub?: string; actions?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; flush?: boolean;
}) {
  return (
    <section className="bg-white overflow-hidden" style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4" style={{ borderBottom: flush ? `1px solid ${BORDER}` : undefined }}>
          <div>
            {title && <h2 className="text-base font-semibold" style={{ color: TEXT, fontFamily: display }}>{title}</h2>}
            {sub && <p className="text-sm mt-0.5" style={{ color: MUTED }}>{sub}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={flush ? "" : "px-6 pb-6"}>{children}</div>
      {footer && <footer className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: UI.surface }}>{footer}</footer>}
    </section>
  );
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold" style={{ color: TEXT }}>{children}</h3>
      {sub && <p className="text-sm" style={{ color: MUTED }}>{sub}</p>}
    </div>
  );
}

// Numbered steps joined by a line. Finished steps can be reopened.
export function Stepper({ steps, current, onStep }: { steps: string[]; current: number; onStep?: (n: number) => void }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const n = i + 1, done = n < current, active = n === current;
        return (
          <li key={label} className="flex items-center gap-2 flex-1 min-w-0 last:flex-none">
            <button type="button" disabled={!done} onClick={() => done && onStep?.(n)} aria-current={active ? "step" : undefined}
              aria-label={done ? `${label}, done. Go back to this step` : label}
              className="flex items-center gap-2 min-w-0 rounded-lg disabled:cursor-default">
              <span className="flex items-center justify-center rounded-full text-sm font-semibold flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: active ? PRIMARY : done ? "#CCFBF1" : "white", color: active ? "white" : done ? TEAL_INK : MUTED, border: active || done ? "none" : `1px solid #CBD5E1` }}>
                {done ? "✓" : n}
              </span>
              <span className="text-sm whitespace-nowrap truncate" style={{ color: active ? TEXT : done ? TEXT : MUTED, fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
            {n < steps.length && <span className="flex-1 h-px min-w-4" style={{ backgroundColor: done ? "#5EEAD4" : BORDER }} />}
          </li>
        );
      })}
    </ol>
  );
}

// A selectable card used like a radio button.
export function Choice({ selected, onSelect, title, sub, aside, badge, name }: {
  selected: boolean; onSelect: () => void; title: string; sub?: string; aside?: React.ReactNode; badge?: React.ReactNode; name: string;
}) {
  return (
    <label className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
      style={{ borderRadius: UI.radius.control + 2, border: `${selected ? 2 : 1}px solid ${selected ? UI.focus : "#CBD5E1"}`, backgroundColor: selected ? UI.selectedBg : "white", margin: selected ? 0 : 1 }}>
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span className="flex-shrink-0 rounded-full flex items-center justify-center" aria-hidden
        style={{ width: 18, height: 18, border: `2px solid ${selected ? UI.focus : SUBTLE}` }}>
        {selected && <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: UI.focus }} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold" style={{ color: TEXT }}>{title}</span>{badge}</span>
        {sub && <span className="block text-sm mt-0.5" style={{ color: MUTED }}>{sub}</span>}
      </span>
      {aside && <span className="text-right flex-shrink-0">{aside}</span>}
    </label>
  );
}

// A row of options where exactly one is on (filters, small choices).
export function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex p-1 rounded-[10px]" style={{ backgroundColor: "#F1F5F9" }}>
      {options.map(o => (
        <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
          className="px-3 rounded-lg text-sm transition-colors whitespace-nowrap"
          style={{ height: 32, backgroundColor: value === o ? "white" : "transparent", color: value === o ? TEXT : MUTED, fontWeight: value === o ? 600 : 400, boxShadow: value === o ? "0 1px 2px rgba(15,23,42,0.08)" : undefined }}>
          {o}
        </button>
      ))}
    </div>
  );
}

// Label on the left, value on the right; used in summaries and detail panels.
export function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-sm" style={{ color: MUTED }}>{label}</span>
      <span className={`text-right ${strong ? "text-base font-semibold" : "text-sm"}`} style={{ color: TEXT }}>{value}</span>
    </div>
  );
}

// One dialog look: white header with a plain title, body, and a footer for the buttons.
export function Dialog({ title, sub, onClose, children, footer, danger, wide }: {
  title: string; sub?: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; danger?: boolean; wide?: boolean;
}) {
  React.useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(15,23,42,0.45)" }} onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-[calc(100%-32px)] ${wide ? "max-w-xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        style={{ border: `1px solid ${BORDER}`, borderRadius: UI.radius.card }}>
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: danger ? ERROR : TEXT, fontFamily: display }}>{title}</h2>
            {sub && <p className="text-sm mt-0.5" style={{ color: MUTED }}>{sub}</p>}
          </div>
          <button aria-label="Close" onClick={onClose} className="w-8 h-8 -mr-2 rounded-lg flex items-center justify-center hover:bg-slate-100" style={{ color: SUBTLE }}>✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        {footer && <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: UI.surface }}>{footer}</div>}
      </div>
    </>
  );
}

// Saves rows as a CSV file the user can open in Excel.
export const downloadCsv = (name: string, rows: (string | number)[][]) => {
  const cell = (v: string | number) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.map(r => r.map(cell).join(",")).join("\n")], { type: "text/csv" }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
};

// ── Moving things (the "UI alive" pieces) ────────────────────────────────────────────
// A drag or a swipe is a shortcut for a button: every drop calls the same data function the button calls, and a refused
// drop gives the reason. Mouse, touch and keyboard (Space to pick up, arrows to move, Space to drop) all work.
// Motion is light: 150–200 ms transform and opacity transitions only; reduced motion turns them off (styles/index.css).

/** How far (px) the mouse moves with the button down before a drag starts. 10 is the usual desktop value; raise it
 *  here, once, if staff start drags by accident. Touch uses a short press instead. */
export const DRAG_START_PX = 10;
/** Wraps an area with draggable cards and drop zones. `onDrop` returns why not (shown by the caller) or nothing. */
export function DragArea({ onDrop, children }: { onDrop: (item: string, target: string) => void; children: React.ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_START_PX } }), // a click, or a hand that shakes a little, stays a click
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }), // a scroll stays a scroll
    useSensor(KeyboardSensor),
  );
  return <DndContext sensors={sensors} onDragEnd={(e: DragEndEvent) => { if (e.over) onDrop(String(e.active.id), String(e.over.id)); }}>{children}</DndContext>;
}

/** A card that can be picked up. `label` is read out to screen readers, e.g. "Peter Okafor, Standard". */
export function DragCard({ id, label, children, className = "", style }: { id: string; label: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return <div ref={setNodeRef} {...listeners} {...attributes} aria-roledescription="draggable card" aria-label={label}
    className={`touch-manipulation ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
    style={{ ...style, transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, zIndex: isDragging ? 40 : undefined,
      boxShadow: isDragging ? "0 12px 28px rgba(15,23,42,0.18)" : style?.boxShadow, transition: isDragging ? "box-shadow 150ms" : "transform 180ms ease-out, box-shadow 150ms" }}>
    {children}</div>;
}

/** Somewhere a card can be dropped. Outlined in teal while a card is over it. */
export function DropZone({ id, children, className = "", style, onClick }: { id: string; children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} onClick={onClick} className={className} style={{ ...style, ...(isOver ? { outline: `3px solid ${UI.focus}`, outlineOffset: 2 } : {}) }}>{children}</div>;
}

export type SwipeAction = { label: string; icon?: React.ElementType; color: string; run: () => void };
/** Swipe a card right for `left`, left for `right` (touch and mouse). On a screen with a mouse the same actions
 *  also show as buttons, and they are always reachable by keyboard. */
export function SwipeRow({ left, right, children, className = "", style, onClick }: {
  left?: SwipeAction; right?: SwipeAction; children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  const REVEAL = 110, card = React.useRef<HTMLDivElement>(null), hintL = React.useRef<HTMLDivElement>(null), hintR = React.useRef<HTMLDivElement>(null);
  const d = React.useRef({ on: false, x0: 0, last: 0, t: 0, v: 0, moved: false });
  const move = (x: number) => {
    const el = card.current; if (!el) return;
    const lim = (n: number, has?: SwipeAction) => (has ? n : 0);
    const raw = x > 0 ? lim(x, left) : lim(x, right);
    const soft = Math.abs(raw) > REVEAL ? Math.sign(raw) * (REVEAL + Math.pow(Math.abs(raw) - REVEAL, 0.65)) : raw;
    el.style.transform = `translateX(${soft}px)`;
    if (hintL.current) hintL.current.style.opacity = raw > 0 ? String(Math.min(1, raw / REVEAL)) : "0";
    if (hintR.current) hintR.current.style.opacity = raw < 0 ? String(Math.min(1, -raw / REVEAL)) : "0";
  };
  const settle = () => { const el = card.current; if (!el) return; el.style.transition = "transform 180ms ease-out"; move(0); setTimeout(() => { el.style.transition = ""; }, 200); };
  const hint = (a: SwipeAction, side: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
    const Icon = a.icon;
    return <div ref={ref} aria-hidden className={`absolute inset-y-0 ${side}-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none`} style={{ width: REVEAL, backgroundColor: `${a.color}14`, opacity: 0 }}>
      {Icon && <Icon size={19} style={{ color: a.color }} />}<span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span></div>;
  };
  return <div className={`relative overflow-hidden select-none ${className}`} style={style} onClick={() => { if (!d.current.moved) onClick?.(); }}>
    {left && hint(left, "left", hintL)}{right && hint(right, "right", hintR)}
    <div ref={card} className="relative bg-white" style={{ touchAction: "pan-y", zIndex: 2 }}
      onPointerDown={e => { d.current = { on: true, x0: e.clientX, last: e.clientX, t: performance.now(), v: 0, moved: false }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={e => { const s = d.current; if (!s.on) return; const now = performance.now(); if (now > s.t) s.v = (e.clientX - s.last) / (now - s.t); s.last = e.clientX; s.t = now;
        if (Math.abs(e.clientX - s.x0) > 6) s.moved = true; move(e.clientX - s.x0); }}
      onPointerUp={e => { const s = d.current; if (!s.on) return; s.on = false; const dx = e.clientX - s.x0, go = (dir: number) => s.v * dir > 0.45 || (Math.abs(s.v) < 0.35 && dx * dir > REVEAL * 0.45);
        settle(); if (left && go(1)) setTimeout(left.run, 180); else if (right && go(-1)) setTimeout(right.run, 180); setTimeout(() => { s.moved = false; }, 0); }}
      onPointerCancel={() => { d.current.on = false; settle(); }}>
      {children}
      {/* The button twin: shown where there is a mouse, always in the keyboard order. */}
      {(left || right) && <div className="absolute right-2 top-2 flex gap-1 opacity-0 focus-within:opacity-100 hover:opacity-100 [@media(hover:hover)]:opacity-60">
        {[left, right].filter(Boolean).map(a => { const Icon = a!.icon; return <button key={a!.label} type="button" aria-label={a!.label} title={a!.label}
          onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); a!.run(); }}
          className="rounded-lg p-1.5 bg-white border" style={{ borderColor: BORDER, color: a!.color }}>{Icon ? <Icon size={14} /> : a!.label}</button>; })}
      </div>}
    </div>
  </div>;
}

/** A row of cards that scrolls sideways: swipe on touch, scroll or Shift+wheel with a mouse, Tab through by keyboard.
 *  Native scroll with snap points, so it costs nothing on slow machines. */
export function CardRail({ title, count, empty, children, more }: { title: string; count: number; empty: string; children: React.ReactNode; more?: { label: string; run: () => void } }) {
  return <div className="mb-4 last:mb-0">
    <div className="mb-2 flex items-center gap-2"><h3 className="text-xs font-semibold" style={{ color: MUTED }}>{title}</h3>
      <span className="rounded-full px-2 text-xs font-semibold" style={{ backgroundColor: "#F1F5F9", color: TEXT }}>{count}</span>
      {more && <button onClick={more.run} className="ml-auto text-xs font-semibold" style={{ color: PRIMARY }}>{more.label}</button>}</div>
    {React.Children.count(children) ? <div role="list" aria-label={title} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">{React.Children.map(children, c => <div role="listitem" className="contents">{c}</div>)}</div>
      : <p className="text-xs" style={{ color: MUTED }}>{empty}</p>}
  </div>;
}
