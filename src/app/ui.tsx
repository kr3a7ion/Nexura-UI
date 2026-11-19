// Global UI values. Every form, card, stepper and choice in the suite uses these,
// so screens look and behave the same. Change a value here, not on a screen.
import React from "react";
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
