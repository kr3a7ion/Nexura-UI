import { useRef, useState, type InputHTMLAttributes } from "react";
import { fmtDate } from "./constants";

// A date field that always reads "24 Jun 2026", whatever the browser's language.
// The visible field is plain text; the browser's own calendar opens from a hidden date input.
export function DateInput({ value, defaultValue, onChange, className, style, placeholder, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  const picker = useRef<HTMLInputElement>(null);
  const [own, setOwn] = useState(String(defaultValue ?? ""));
  const current = String(value ?? own);
  const open = () => { try { picker.current?.showPicker(); } catch { picker.current?.focus(); } };
  const shown = /^\d{4}-\d{2}-\d{2}$/.test(current) ? fmtDate(current) : "";
  return (
    <span className="relative block">
      <input
        {...rest}
        type="text"
        readOnly
        value={shown}
        placeholder={placeholder ?? "Choose a date"}
        className={className}
        style={{ ...style, cursor: rest.disabled ? "default" : "pointer", paddingRight: 36 }}
        onClick={open}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); } }}
      />
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="1.8" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
      <input
        ref={picker}
        type="date"
        tabIndex={-1}
        aria-hidden
        value={current}
        min={rest.min}
        max={rest.max}
        onChange={e => { setOwn(e.target.value); onChange?.(e); }}
        className="absolute left-0 bottom-0 w-full h-px opacity-0 pointer-events-none"
      />
    </span>
  );
}

// For field wrappers that take a `type` prop: dates get DateInput, everything else a plain input.
export function TextOrDate(props: InputHTMLAttributes<HTMLInputElement>) {
  return props.type === "date" ? <DateInput {...props} /> : <input {...props} />;
}
