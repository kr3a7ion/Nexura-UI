import { useEffect, useState } from "react";
import { FileText, Printer, Receipt, IdentificationCard, CookingPot, Van, MoonStars } from "@phosphor-icons/react";
import {
  PRIMARY, NAV_BG, TEAL, ORANGE, SUCCESS, WARNING, ERROR, BORDER, TEXT, MUTED, SUBTLE, BG,
  mono, sans, display,
} from "./constants";
import { Badge, BtnP, EmptyState, PageHeader } from "./UIKit";
import {
  FOLIO_INVOICE, HOTEL_PRINT_DETAILS, KITCHEN_TICKET, NIGHT_AUDIT_REPORT, PAYMENT_RECEIPT,
  PRINT_TEMPLATE_OPTIONS, REGISTRATION_CARD, TRIP_SHEET, type PrintTemplateId,
} from "./mock/printTemplates";

const TEMPLATE_ICONS = {
  folio: FileText,
  receipt: Receipt,
  registration: IdentificationCard,
  kitchen: CookingPot,
  trip: Van,
  audit: MoonStars,
} satisfies Record<PrintTemplateId, React.ElementType>;

const money = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

function DocumentHeader({ title, reference }: { title: string; reference?: string }) {
  return (
    <header className="border-b border-black pb-4 mb-5">
      <div className="flex items-start justify-between gap-6">
        <div><div className="text-2xl font-black tracking-tight">{HOTEL_PRINT_DETAILS.hotel}</div><div className="text-xs mt-1">{HOTEL_PRINT_DETAILS.legalEntity}</div><div className="text-xs">{HOTEL_PRINT_DETAILS.address}</div><div className="text-xs">TIN: <span style={{ fontFamily: mono }}>{HOTEL_PRINT_DETAILS.tin}</span></div></div>
        <div className="text-right"><div className="text-xl font-bold uppercase">{title}</div>{reference && <div className="text-xs mt-1" style={{ fontFamily: mono }}>{reference}</div>}</div>
      </div>
    </header>
  );
}

function FolioInvoice() {
  return (
    <article>
      <DocumentHeader title="Guest Folio / Invoice" reference={FOLIO_INVOICE.invoiceNo} />
      <div className="grid grid-cols-2 gap-8 text-xs mb-5">
        <div><div className="font-bold uppercase mb-1">Bill to</div><div>{FOLIO_INVOICE.guest}</div><div>{FOLIO_INVOICE.company}</div><div>{FOLIO_INVOICE.address}</div></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1"><span>Invoice date</span><strong>{FOLIO_INVOICE.date}</strong><span>Reservation</span><strong style={{ fontFamily: mono }}>{FOLIO_INVOICE.reservation}</strong><span>Room</span><strong>{FOLIO_INVOICE.room}</strong><span>Stay</span><strong>{FOLIO_INVOICE.stay}</strong></div>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead><tr className="border-y border-black">{["Date", "Description", "Qty", "Unit price", "Amount"].map(label => <th key={label} className="py-2 text-left last:text-right">{label}</th>)}</tr></thead>
        <tbody>{FOLIO_INVOICE.lines.length ? FOLIO_INVOICE.lines.map(line => <tr key={`${line.date}-${line.description}`} className="border-b border-black"><td className="py-2">{line.date}</td><td>{line.description}</td><td style={{ fontFamily: mono }}>{line.quantity}</td><td style={{ fontFamily: mono }}>{money(line.unit)}</td><td className="text-right" style={{ fontFamily: mono }}>{money(line.amount)}</td></tr>) : <tr><td colSpan={5} className="py-8 text-center">No charges posted.</td></tr>}</tbody>
      </table>
      <div className="ml-auto w-72 mt-5 text-xs space-y-2">
        {[["Subtotal", FOLIO_INVOICE.subtotal], ["VAT 7.5%", FOLIO_INVOICE.vat], ["Tourism levy 2%", FOLIO_INVOICE.tourismLevy], ["Total", FOLIO_INVOICE.total], ["Payments received", -FOLIO_INVOICE.payments]].map(([label, value]) => <div key={String(label)} className="flex justify-between"><span>{label}</span><span style={{ fontFamily: mono }}>{Number(value) < 0 ? `(${money(Math.abs(Number(value)))})` : money(Number(value))}</span></div>)}
        <div className="flex justify-between border-y-2 border-black py-2 text-base font-black"><span>Balance due</span><span style={{ fontFamily: mono }}>{money(FOLIO_INVOICE.balance)}</span></div>
      </div>
      <footer className="mt-10 border-t border-black pt-4 text-xs"><div><strong>Payment terms:</strong> {FOLIO_INVOICE.terms}</div><div className="mt-2"><strong>Bank details:</strong> {HOTEL_PRINT_DETAILS.bank}</div><div className="mt-2">{HOTEL_PRINT_DETAILS.phone} · {HOTEL_PRINT_DETAILS.email}</div></footer>
    </article>
  );
}

function PaymentReceipt({ thermal }: { thermal: boolean }) {
  return (
    <article className={thermal ? "text-center" : ""}>
      <DocumentHeader title="Payment Receipt" reference={PAYMENT_RECEIPT.receiptNo} />
      <div className={`text-sm ${thermal ? "space-y-3" : "grid grid-cols-2 gap-x-8 gap-y-3"}`}>
        {[
          ["Date / time", `${PAYMENT_RECEIPT.date} · ${PAYMENT_RECEIPT.time}`],
          ["Guest", PAYMENT_RECEIPT.guest],
          ["Room", PAYMENT_RECEIPT.room],
          ["Amount", money(PAYMENT_RECEIPT.amount)],
          ["Method", PAYMENT_RECEIPT.method],
          ["Reference", PAYMENT_RECEIPT.reference],
          ["Cashier", PAYMENT_RECEIPT.cashier],
        ].map(([label, value]) => <div key={label} className={thermal ? "border-b border-black pb-2" : "flex justify-between border-b border-black pb-2"}><span className="text-xs">{label}</span><strong style={{ fontFamily: label === "Amount" || label === "Reference" ? mono : undefined }}>{value}</strong></div>)}
      </div>
      <footer className="mt-6 border-t border-black pt-3 text-xs">{HOTEL_PRINT_DETAILS.legalEntity}<br />{HOTEL_PRINT_DETAILS.address}<br />TIN {HOTEL_PRINT_DETAILS.tin}<br /><br />Thank you for your payment.</footer>
    </article>
  );
}

function RegistrationCard() {
  const rows = [
    ["Guest name", REGISTRATION_CARD.guest], ["Phone", REGISTRATION_CARD.phone], ["Email", REGISTRATION_CARD.email],
    ["Nationality", REGISTRATION_CARD.nationality], ["Address", REGISTRATION_CARD.address], ["ID captured", `${REGISTRATION_CARD.idType} · ${REGISTRATION_CARD.idNumber}`],
    ["Room", REGISTRATION_CARD.room], ["Arrival / departure", REGISTRATION_CARD.stay], ["Nightly rate", money(REGISTRATION_CARD.rate)], ["Vehicle registration", REGISTRATION_CARD.vehicle],
  ];
  return <article><DocumentHeader title="Registration Card" /><div className="grid grid-cols-2 gap-x-8">{rows.map(([label, value]) => <div key={label} className="border-b border-black py-3 text-xs"><div className="uppercase mb-1">{label}</div><strong style={{ fontFamily: label.includes("rate") || label.includes("ID") ? mono : undefined }}>{value}</strong></div>)}</div><div className="mt-6 text-xs"><strong>Guest declaration and terms</strong><p className="mt-2 leading-relaxed">{REGISTRATION_CARD.terms}</p></div><div className="grid grid-cols-3 gap-8 mt-12 text-xs"><div className="border-t border-black pt-2">Guest signature</div><div className="border-t border-black pt-2">Date / time</div><div className="h-28 border border-black flex items-center justify-center text-center">Guest portal QR<br />placeholder</div></div></article>;
}

function KitchenTicket() {
  return <article className="text-black"><div className="text-center border-b-2 border-black pb-3"><div className="text-2xl font-black">{KITCHEN_TICKET.priority}</div><div className="text-xl font-bold mt-1">{KITCHEN_TICKET.orderNo}</div><div className="text-lg">{KITCHEN_TICKET.location} · {KITCHEN_TICKET.time}</div></div><div className="py-3">{KITCHEN_TICKET.items.length ? KITCHEN_TICKET.items.map(item => <div key={item.name} className="border-b border-black py-4"><div className="text-xl font-black">{item.quantity} × {item.name}</div><div className="text-base mt-1">{item.modifier}</div></div>) : <div className="py-8 text-center">No ticket items.</div>}</div><div className="border-2 border-black p-3 text-base font-bold">{KITCHEN_TICKET.note}</div><div className="mt-4 text-sm">Server: {KITCHEN_TICKET.server}</div></article>;
}

function TripSheet() {
  const fields = [["Trip no.", TRIP_SHEET.tripNo], ["Date", TRIP_SHEET.date], ["Vehicle", TRIP_SHEET.vehicle], ["Driver", TRIP_SHEET.driver], ["Passengers", TRIP_SHEET.passengers], ["Pickup", TRIP_SHEET.pickup], ["Drop-off", TRIP_SHEET.dropoff], ["Odometer start", TRIP_SHEET.odometerStart], ["Odometer end", TRIP_SHEET.odometerEnd], ["Distance", TRIP_SHEET.distance], ["Fuel", TRIP_SHEET.fuel], ["Charge", money(TRIP_SHEET.charge)]];
  return <article><DocumentHeader title="Trip Sheet / Waybill" reference={TRIP_SHEET.tripNo} /><div className="grid grid-cols-2 gap-x-8">{fields.map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-black py-3 text-xs"><span>{label}</span><strong className="text-right" style={{ fontFamily: /no.|Odometer|Distance|Fuel|Charge/.test(label) ? mono : undefined }}>{value}</strong></div>)}</div><div className="grid grid-cols-2 gap-12 mt-20 text-xs"><div className="border-t border-black pt-2">Driver signature / date</div><div className="border-t border-black pt-2">Passenger signature / date</div></div></article>;
}

function NightAuditReport() {
  const revenueTotal = NIGHT_AUDIT_REPORT.revenue.reduce((sum, row) => sum + row.amount, 0);
  return <article><DocumentHeader title="Night Audit Report" reference={NIGHT_AUDIT_REPORT.businessDate} /><div className="grid grid-cols-3 gap-5 text-xs mb-6">{[["Occupancy", NIGHT_AUDIT_REPORT.occupancy], ["ADR", money(NIGHT_AUDIT_REPORT.adr)], ["RevPAR", money(NIGHT_AUDIT_REPORT.revpar)]].map(([label, value]) => <div key={label} className="border border-black p-3"><div className="uppercase">{label}</div><strong className="text-base mt-1 block" style={{ fontFamily: mono }}>{value}</strong></div>)}</div><div className="grid grid-cols-2 gap-8"><section><h2 className="font-bold text-sm border-b border-black pb-2">Revenue by category</h2>{NIGHT_AUDIT_REPORT.revenue.map(row => <div key={row.category} className="flex justify-between border-b border-black py-2 text-xs"><span>{row.category}</span><strong style={{ fontFamily: mono }}>{money(row.amount)}</strong></div>)}<div className="flex justify-between border-b-2 border-black py-2 text-xs font-black"><span>Total revenue</span><span style={{ fontFamily: mono }}>{money(revenueTotal)}</span></div></section><section><h2 className="font-bold text-sm border-b border-black pb-2">Taxes collected</h2>{NIGHT_AUDIT_REPORT.taxes.map(row => <div key={row.name} className="flex justify-between border-b border-black py-2 text-xs"><span>{row.name}</span><strong style={{ fontFamily: mono }}>{money(row.amount)}</strong></div>)}<h2 className="font-bold text-sm border-b border-black pb-2 mt-6">Guest movements</h2>{Object.entries(NIGHT_AUDIT_REPORT.movements).map(([label, value]) => <div key={label} className="flex justify-between border-b border-black py-2 text-xs capitalize"><span>{label}</span><strong style={{ fontFamily: mono }}>{value}</strong></div>)}</section></div><section className="mt-7"><h2 className="font-bold text-sm border-b border-black pb-2">Exceptions</h2>{NIGHT_AUDIT_REPORT.exceptions.length ? <ol className="list-decimal pl-5 mt-3 text-xs space-y-2">{NIGHT_AUDIT_REPORT.exceptions.map(item => <li key={item}>{item}</li>)}</ol> : <p className="text-xs py-4">No audit exceptions.</p>}</section><div className="grid grid-cols-2 gap-12 mt-16 text-xs"><div className="border-t border-black pt-2">Auditor: {NIGHT_AUDIT_REPORT.auditor}</div><div className="border-t border-black pt-2">Manager sign-off / date</div></div></article>;
}

export function PrintTemplates() {
  const [selected, setSelected] = useState<PrintTemplateId>("folio");
  const [receiptSize, setReceiptSize] = useState<"80mm" | "A4">("80mm");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => { const timer = window.setTimeout(() => setStatus("ready"), 350); return () => window.clearTimeout(timer); }, []);
  const option = PRINT_TEMPLATE_OPTIONS.find(item => item.id === selected)!;
  const thermal = selected === "kitchen" || (selected === "receipt" && receiptSize === "80mm");
  const preview = selected === "folio" ? <FolioInvoice /> : selected === "receipt" ? <PaymentReceipt thermal={thermal} /> : selected === "registration" ? <RegistrationCard /> : selected === "kitchen" ? <KitchenTicket /> : selected === "trip" ? <TripSheet /> : <NightAuditReport />;
  return (
    <div style={{ fontFamily: sans }}>
      <style>{`@media print { body * { visibility: hidden !important; } .print-preview-paper, .print-preview-paper * { visibility: visible !important; } .print-preview-paper { position: absolute !important; inset: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; border: 0 !important; } .no-print { display: none !important; } @page { margin: 12mm; } }`}</style>
      <div className="no-print"><PageHeader title="Print Preview" sub="Review operational templates before printing" actions={<BtnP label="Print" icon={Printer} onClick={() => window.print()} />} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
        <aside className="no-print bg-white rounded-xl border overflow-hidden h-fit" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Templates</div></div>
          {status === "loading" && <div className="p-3 space-y-2">{[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: BG }} />)}</div>}
          {status === "error" && <EmptyState icon={FileText} message="Print templates could not be loaded." cta="Try again" onCta={() => setStatus("ready")} />}
          {status === "ready" && PRINT_TEMPLATE_OPTIONS.length === 0 && <EmptyState icon={FileText} message="No print templates are configured." />}
          {status === "ready" && PRINT_TEMPLATE_OPTIONS.length > 0 && <div className="p-2 space-y-1">{PRINT_TEMPLATE_OPTIONS.map(item => {
            const Icon = TEMPLATE_ICONS[item.id];
            const active = selected === item.id;
            return <button key={item.id} onClick={() => setSelected(item.id)} className="w-full flex items-start gap-3 p-3 rounded-xl border text-left" style={{ borderColor: active ? TEXT : "transparent", backgroundColor: "white" }}><Icon size={18} style={{ color: active ? TEXT : MUTED }} /><div className="min-w-0 flex-1"><div className="text-sm font-semibold" style={{ color: TEXT }}>{item.name}</div><div className="text-xs mt-0.5" style={{ color: MUTED }}>{item.description}</div><div className="mt-1"><Badge label={item.paper} colors={{ bg: "white", text: TEXT }} /></div></div></button>;
          })}</div>}
        </aside>
        <section className="min-w-0">
          <div className="no-print flex items-center justify-between gap-3 mb-3"><div><div className="text-sm font-semibold" style={{ color: TEXT }}>{option.name}</div><div className="text-xs" style={{ color: MUTED }}>Paper size: {selected === "receipt" ? receiptSize : option.paper}</div></div>{selected === "receipt" && <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: BORDER }}>{(["80mm", "A4"] as const).map(size => <button key={size} onClick={() => setReceiptSize(size)} className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "white", color: receiptSize === size ? TEXT : MUTED, borderBottom: receiptSize === size ? `2px solid ${TEXT}` : "2px solid transparent" }}>{size}</button>)}</div>}</div>
          <div className="overflow-auto rounded-xl border p-4 sm:p-8" style={{ borderColor: BORDER, backgroundColor: BG }}>
            <div className="print-preview-paper mx-auto bg-white text-black border border-black p-6 sm:p-10" style={{ width: thermal ? "80mm" : "210mm", minHeight: thermal ? "120mm" : "297mm", maxWidth: "100%", fontFamily: sans, boxShadow: "none" }}>{preview}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
