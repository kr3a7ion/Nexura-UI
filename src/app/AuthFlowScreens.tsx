import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Buildings, Check, CheckCircle, ClipboardText, Copy, DownloadSimple,
  Key, LockKey, MapPin, Printer, QrCode, ShieldCheck, WifiHigh, WifiSlash,
} from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnO, BtnP, EmptyState, Inp } from "./UIKit";
import { ACCESSIBLE_BRANCHES, AUTHENTICATOR_SECRET, GUEST_QR_RESERVATION, MFA_BACKUP_CODES } from "./mock/authFlow";

function AuthShell({ children, title, subtitle, warm = false }: { children: React.ReactNode; title: string; subtitle: string; warm?: boolean }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: warm ? BG : NAV_BG, fontFamily: sans }}>
      <section className="w-full max-w-md rounded-2xl border bg-white p-6 sm:p-8 shadow-xl" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: warm ? TEAL : PRIMARY }}>
            {warm ? <Key size={20} weight="bold" /> : <ShieldCheck size={21} weight="bold" />}
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: TEXT, fontFamily: display }}>Nexura</div>
            <div className="text-xs" style={{ color: MUTED }}>{warm ? "Guest access" : "Secure staff access"}</div>
          </div>
        </div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: display }}>{title}</h1>
        <p className="text-sm mt-1 mb-6 leading-relaxed" style={{ color: MUTED }}>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 text-xs font-semibold mb-5" style={{ color: MUTED }}><ArrowLeft size={14} />Back</button>;
}

export function GuestAccessScreen({ qrLanding = false, onBack }: { qrLanding?: boolean; onBack: () => void }) {
  const [code, setCode] = useState(qrLanding ? GUEST_QR_RESERVATION.code : "");
  const [surname, setSurname] = useState(qrLanding ? GUEST_QR_RESERVATION.surname : "");
  const [state, setState] = useState<"form" | "loading" | "success" | "error">(qrLanding ? "success" : "form");
  const findStay = async () => {
    if (!code.trim() || !surname.trim()) { setState("error"); return; }
    setState("loading"); await new Promise(resolve => window.setTimeout(resolve, 500));
    setState(code.trim().toUpperCase() === GUEST_QR_RESERVATION.code && surname.trim().toLowerCase() === GUEST_QR_RESERVATION.surname.toLowerCase() ? "success" : "error");
  };
  return (
    <AuthShell title={qrLanding ? "Welcome to Grand Palms" : "Access your stay"} subtitle="View your reservation and guest services securely." warm>
      <BackButton onClick={onBack} />
      {state === "loading" && <div className="py-12 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: TEAL, borderTopColor: "transparent" }} /><p className="text-sm mt-3" style={{ color: MUTED }}>Finding your stay…</p></div>}
      {state === "success" && <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, backgroundColor: "white" }}><div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: BG, color: SUCCESS }}>{qrLanding ? <QrCode size={24} /> : <CheckCircle size={24} weight="fill" />}</div><div className="text-lg font-bold" style={{ color: TEXT }}>{GUEST_QR_RESERVATION.guest}</div><div className="text-sm mt-1" style={{ color: MUTED }}>{GUEST_QR_RESERVATION.property} · {GUEST_QR_RESERVATION.stay}</div><div className="mt-4"><Badge label="Reservation verified" colors={{ bg: BG, text: SUCCESS }} /></div></div>}
      {(state === "form" || state === "error") && <div className="space-y-4">
        {state === "error" && <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: BG, color: ERROR, border: `1px solid ${ERROR}` }}>We couldn’t match those details. Check the reservation code and surname, then try again.</div>}
        <Inp label="Reservation code" value={code} onChange={event => { setCode(event.target.value.toUpperCase()); setState("form"); }} placeholder="BK-2860" mono />
        <Inp label="Surname" value={surname} onChange={event => { setSurname(event.target.value); setState("form"); }} placeholder="Okafor" />
        <button onClick={findStay} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>Find my stay</button>
        <div className="flex items-center gap-2 justify-center text-xs" style={{ color: SUBTLE }}><LockKey size={13} />Your booking details are encrypted and private.</div>
      </div>}
    </AuthShell>
  );
}
