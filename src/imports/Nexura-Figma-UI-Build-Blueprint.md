# Nexura — Figma Make UI Build Blueprint

**Purpose:** batched, prompt-ready schematics for building the complete Nexura UI in Figma AI Make, designed so each batch is one focused session and you can track what's finished.

**Companion:** `Nexura-Backend-Build-Blueprint.md` (Claude Code, batched). Both use the same batch numbering per module so you can pair them.

---

## How to use this document

1. **One batch = one Figma Make session.** Don't combine batches; the output quality drops sharply as scope grows.
2. **Always paste §A (Foundation Preamble) at the top of every prompt.** Figma Make sessions don't reliably carry design context between prompts. This is the single most important habit — it's what stops the palette drifting again.
3. Then paste the batch's screen specs.
4. Mark the batch in §B when the screens are visually complete and reviewed.
5. Batch 0 must be first. After that, follow the recommended order but reorder freely if a module becomes urgent.

**One caution worth stating once:** Figma Make will produce monolithic files with mock data, in whatever structure it chooses. Adoption into Nexura is real work — extracting into `screens/<module>/`, replacing mocks with `lib/api` calls, applying `SCREEN_ROLE_MAP`. Budget for it, and adopt module by module rather than all at once. The token preamble is what keeps that adoption cheap.

---

## §A — Foundation Preamble

> **Paste this block at the start of every Figma Make prompt.**

```
DESIGN SYSTEM — NEXURA (hospitality management platform, Nigeria)

TYPOGRAPHY
  Display/headings: 'Plus Jakarta Sans', weights 400/500/600/700/800
  Body:             'Inter', weights 400/500/600/700
  Numeric/mono:     'JetBrains Mono', weights 400/500
                    (use mono for IDs, amounts, timestamps, reference codes)
  Base font size:   14px

COLOUR — BRAND
  Nav background      #0F2044   (deep navy, sidebar + top bar)
  Primary             #123A73   (navy — primary buttons, links, active nav)
  Primary foreground  #FFFFFF
  Secondary/Accent    #1BA39C   (teal — secondary actions, highlights)
  Accent foreground   #FFFFFF

COLOUR — SEMANTIC
  Success  #2E7D32     Warning  #FFA000     Error/Destructive  #D32F2F
  Orange   #F57C00     (attention, "due soon")

COLOUR — SURFACES & TEXT
  App background   #F0F4F8      Card / popover   #FFFFFF
  Foreground       #0D1B2E      Card foreground  #0F172A
  Text             #0F172A      Muted text       #64748B
  Subtle text      #94A3B8      Border           #E2E8F0
  Input background #F8FAFC      Switch off       #94A3B8

CHART SERIES (in order)
  #123A73, #1BA39C, #F57C00, #2E7D32, #FFA000

RADIUS
  Base 0.875rem (14px). Cards 14–16px. Buttons 10–12px. Badges/pills full.

SHADOWS (navy-tinted, never neutral grey)
  xs  0 1px 2px rgba(13,27,46,0.06)
  sm  0 2px 8px rgba(13,27,46,0.08), 0 1px 2px rgba(13,27,46,0.04)
  md  0 4px 16px rgba(13,27,46,0.10), 0 2px 4px rgba(13,27,46,0.06)
  lg  0 8px 32px rgba(13,27,46,0.12), 0 4px 8px rgba(13,27,46,0.06)

STATUS BADGE COLOURS (background / text)
  Reservation:  Confirmed #CCFBF1/#0F766E · Checked In #DCFCE7/#166534
                Checked Out #F3F4F6/#374151 · Cancelled #FEE2E2/#991B1B
                No Show #FEF2F2/#991B1B · Pending #FEF3C7/#92400E
  Housekeeping: Dirty #FEF3C7/#92400E · In Progress #DBEAFE/#1E40AF
                Clean #D1FAE5/#065F46 · Inspected #DCFCE7/#166534
                DND #F3F4F6/#374151 · Occupied #FEF3C7/#B45309
                Maintenance #FEE2E2/#991B1B
  Work order:   Reported #EEF2FF/#4338CA · Assigned #CCFBF1/#0F766E
                In Progress #FEF3C7/#92400E · Completed #DCFCE7/#166534
                Overdue #FEE2E2/#991B1B
  Room:         Available #DCFCE7/#166534 · Occupied #FEF3C7/#92400E
                Cleaning #FEF9C3/#713F12 · Reserved #CCFBF1/#0F766E
                Maintenance #FEE2E2/#991B1B · Out of Service #F3F4F6/#374151

CONVENTIONS
  Currency: Nigerian Naira, symbol ₦, thousands separators, no decimals in
    lists (₦42,000); two decimals only on folio/invoice lines.
    Compact in KPI tiles: ₦1.24M, ₦840K.
  Dates: DD MMM YYYY (14 Mar 2026). Times: 24-hour (14:30).
  IDs and reference codes: mono, uppercase.
  Every list view has: search, filter, and an explicit empty state.
  Every screen shows a sync/connection pill in the header (this is an
    offline-first product — connection state is always visible).

DEVICE TIER (state which tier this batch targets)
  T1 Wearable  360–420px   arm-strapped 5" Android, one-handed, gloved
  T2 Handheld  390–430px   phone — guest portal, staff self-service
  T3 Tablet    800–1280px  10" Android — in-room guest, supervisor, POS, KDS
  T4 Desktop   ≥1280px     manager, finance, front desk, IT

TONE
  Dense but calm. Operational software used all shift by non-technical staff
  in a hotel. Clarity over decoration. No gradients on functional surfaces.
  No emoji in UI copy.
```

---

## §B — Progress tracker

| # | Batch | Tier | Screens | Status |
|---|---|---|---|---|
| 0 | Foundation & component library | all | 30 components | ☐ |
| 1 | App shells & navigation | T4/T3 | 4 shells | ☐ |
| 2 | Dashboards | T4 | 2 | ☐ |
| 3 | Reservations core | T4 | 8 | ☐ |
| 4 | Rates, room types & availability | T4 | 3 | ☐ |
| 5 | Front desk — day flow | T4 | 7 | ☐ |
| 6 | Front desk — transactions | T4 | 4 | ☐ |
| 7 | Access control & locks | T4 | 4 | ☐ |
| 8 | Housekeeping | T4/T3 | 7 | ☐ |
| 9 | Maintenance & asset register | T4 | 5 | ☐ |
| 10 | Restaurant & POS | T3 | 8 | ☐ |
| 11 | Finance — night audit & tax | T4 | 5 | ☐ |
| 12 | Finance — invoicing & AP | T4 | 5 | ☐ |
| 13 | Inventory | T4 | 5 | ☐ |
| 14 | HR | T4 | 6 | ☐ |
| 15 | Communications & complaints | T4 | 6 | ☐ |
| 16 | Reports | T4 | 6 | ☐ |
| 17 | IT admin & devices | T4 | 7 | ☐ |
| 18 | Multi-branch & settings | T4 | 8 | ☐ |
| 19 | Fleet — operations | T4 | 5 | ☐ |
| 20 | Fleet — assets & fuel | T4 | 4 | ☐ |
| 21 | Guest portal | T2/T3 | 11 | ☐ |
| 22 | Staff field app | T1 | 8 | ☐ |
| 23 | Auth & onboarding | T4/T2 | 6 | ☐ |
| 24 | Org Portal | T4 | 6 | ☐ |
| 25 | Admin Console | T4 | 6 | ☐ |
| 26 | Print templates | print | 6 | ☐ |

**~158 screens + 30 components.** Batches 0–1 are prerequisites. 3, 5, 6, 11, 12 are the pilot-critical path.

---

## Batch 0 — Foundation & component library

**Tier:** all · **Prompt framing:** "Build a component library sheet, each component shown in all its states."

| Component | States / variants | Notes |
|---|---|---|
| `Button` | primary, secondary, outline, ghost, destructive × default/hover/active/disabled/loading | Primary navy, secondary teal |
| `IconButton` | same | 40px T4, 56px T1 |
| `Input` | default, focus, error, disabled, with-prefix (₦), with-suffix | bg `#F8FAFC` |
| `Select` / `Combobox` | closed, open, searching, multi | |
| `DatePicker` / `DateRangePicker` | single, range, with presets (today, tomorrow, this week) | |
| `Badge` | all status maps from §A | pill, 11px, 600 |
| `StatCard` | value + label + delta up/down/flat + optional sparkline | mono value |
| `PageHeader` | title, subtitle, breadcrumb, action slot, sync pill | |
| `DataTable` | header, sortable, row hover, row select, pagination, sticky header, loading skeleton, empty | T4 only |
| `DataCards` | card list equivalent of DataTable | T1–T3 |
| `EmptyState` | icon, headline, body, optional action | |
| `AsyncBoundary` | skeleton, error + retry, offline | |
| `OfflineBanner` | offline, reconnecting, pending-writes count, synced | persistent, top of shell |
| `SyncPill` | synced / syncing / offline / error + relative timestamp | header, every screen |
| `Toast` | success, error, warning, info, with undo | |
| `Modal` / `Sheet` / `Drawer` | sm/md/lg; sheet from right (T4), bottom (T1–T3) | |
| `ConfirmDestructive` | reason textarea + typed confirmation + permission note | voids, revocations, overrides |
| `Tabs` | underline, pill; scrollable overflow | |
| `Stepper` | horizontal T4, vertical/compact T1–T3; done/current/upcoming/error | check-in wizard |
| `MoneyText` | ₦ display, compact, negative (credit) in red, zero muted | |
| `MoneyInput` | ₦ prefix, thousands grouping, integer-minor-unit aware | |
| `AuditTrail` | vertical timeline: actor, action, timestamp, detail, expandable | reused everywhere |
| `StatusPill` + `PriorityDot` | | |
| `Avatar` / `AvatarGroup` | initials fallback, role tint | |
| `SearchBar` | with scope selector and recent searches | |
| `FilterBar` | chip filters, active count, clear all, saved views | |
| `KPIStrip` | 3–6 StatCards, responsive wrap | dashboard headers |
| `ScanInput` | idle / camera active / NFC waiting / success / error | T1/T2 — room and asset identification |
| `RoleGate` | visual: hidden vs disabled-with-tooltip | |
| `Calendar` / `Timeline` grid | month, week, day; room × date matrix | reservation grid, rate calendar |
| `ChartCard` | line, area, bar, donut, stacked; legend, tooltip, empty | series colours from §A |

Also produce: **spacing scale** (4/8/12/16/24/32/48), **type scale** (11/12/14/16/20/24/32 with weights), and **elevation examples**.

---

## Batch 1 — App shells & navigation

**Tier:** T4 + T3 · 4 shells

| Shell | Contents |
|---|---|
| **AppShell** (staff T4) | Collapsible left sidebar on `#0F2044`: logo, branch switcher, grouped nav (Dashboard, Reservations, Front Desk, Housekeeping, Maintenance, Restaurant, Fleet, Finance, Inventory, HR, Communications, Reports, Settings, IT Admin), each with icon + label + optional count badge; collapsed = icons with tooltips. Top bar: breadcrumb, global search, sync pill, live clock, notification bell with panel, user menu (name, role badge, branch, preferences, logout). Content area on `#F0F4F8`. OfflineBanner above top bar. |
| **AppShell-T3** (supervisor tablet) | Same nav collapsed to icon rail by default; larger touch targets; bottom-sheet detail instead of side panels; portrait-primary. |
| **GuestShell** (T2/T3) | No sidebar. Top: hotel name, room number, guest name. Bottom tab bar: Home, Services, Orders, Bill, Help. Warm, spacious, large type — deliberately *not* the staff density. T3 in-room variant: larger hero, always-on welcome. |
| **FieldShell** (T1) | No nav chrome. Top: 32px status strip (room/task context, sync badge, battery). Content full-bleed. Bottom: one full-width primary action. Back = swipe or a single top-left arrow. Max 2 levels deep. |

Also: **nav visibility matrix** — a reference sheet showing which of the 9+ roles (MGT, ORG, FD, RSV, HK, MX, RT, FIN, IT, CS, RO, FLT, DRV) sees which nav group.

---

## Batch 2 — Dashboards

**Tier:** T4 · 2 screens

**`DashboardMgmt`** (MGT, ORG) — KPI strip: Occupancy %, ADR, RevPAR, Revenue Today, Arrivals, Departures, In House, Complaints Open. Occupancy trend area chart (30 days). Revenue by category donut. Room status panel (counts by status with colour bar). Department KPI grid. Recent activity feed (check-in/out/reservation/maintenance/no-show, colour-coded). Alerts panel: overdue work orders, low stock, expiring vehicle documents, SLA breaches, backup age, sync lag. Night audit status card — last run, business date, "Run now" if pending.

**`DashboardRole`** (all operational roles) — same shell, contents switch by role. Show all variants:
- FD: today's arrivals/departures counts, in-house, rooms ready, walk-in button, messages
- HK: rooms assigned, dirty/clean/inspected counts, DND list, my attendants
- MX: open work orders by priority, overdue, PM due, my assignments
- RT: covers today, open tables, KDS queue depth, top items
- FIN: revenue today, outstanding balances, AP due, unposted charges, day-close status
- RSV: bookings today, pipeline, waitlist, group blocks
- FLT: trips today, vehicles available, drivers on duty, fuel anomalies, documents expiring
- CS: open complaints by severity, SLA at risk, guest requests pending
- RO: night audit status, in-house, arrivals pending, exceptions
- IT: system health, device status, backup age, sync status, update available

---

## Batch 3 — Reservations core

**Tier:** T4 · 8 screens

**`ReservationGrid`** — room × date matrix, horizontal scroll, 14–30 day window. Rows = rooms grouped by type; columns = dates. Bars span nights, coloured by status, labelled with guest surname. Drag to move/extend. Click = detail. Sidebar filters: room type, status, floor. Legend. Today marker. Occupancy % footer per date.

**`NewReservation`** — stepped form: (1) dates + guests + room type, showing live availability count per type; (2) rate plan selection with per-night breakdown and total incl. tax; (3) guest — search existing or create, ID capture, contact; (4) extras (transfer request, special requests, arrival flight); (5) deposit/payment; (6) confirm with full summary. Availability warning if none. Overbooking prompt if permitted.

**`ReservationDetail`** — header: reservation number (mono), guest name, status badge, room/type, dates, nights, total. Tabs: **Overview** (all fields, editable inline with permission), **Folio** (charges, payments, balance, post-charge action), **Guest** (profile summary, stay history link), **Access** (credentials issued, status, revoke), **Requests** (transfers, room service, HK/MX requests), **History** (AuditTrail). Actions: check in, check out, assign room, extend stay, change rate, cancel, no-show, print reg card, message guest.

**`ReservationSearch`** — multi-criteria: name, reservation number, phone, email, room, date range, status, source, rate plan. Results table with quick actions. Saved searches.

**`Waitlist`** — table: guest, requested dates, room type, party size, priority, added, contact attempts. Actions: promote to reservation (opens NewReservation prefilled), contact (logs attempt), remove (reason required). "Availability opened" highlight when a matching room frees.

**`GroupBookings`** — block list: group name, organiser, dates, rooms blocked/picked-up/released, rate, cut-off date, group folio balance. Detail: rooming list (assign names to rooms, import), block adjust, pick-up progress bar, group folio, cut-off warning.

**`CancellationRefund`** — cancellation request: reservation lookup, policy display (rule that applies, penalty computed and shown before confirming), reason, waive-penalty (permission-gated, reason required). Refund section: original payments, refundable amount, method, approver, reference. Full audit trail.

**`RateManagement`** — rate plan list: name, code, type (base/derived/corporate/OTA/package), base rate, derivation rule, applicable room types, date range, cancellation policy, min/max stay, active. Detail with a per-room-type rate table.

---

## Batch 4 — Rates, room types & availability

**Tier:** T4 · 3 screens

**`RoomTypeManagement`** — types: code, name, inventory count, max occupancy, bed config, size, amenities, base rate, photos, description, display order. Room assignment panel showing which physical rooms belong to each type.

**`RateCalendar`** — grid: room type (rows) × date (columns, 30–90 days). Cell = rate + availability count. Colour by demand. Bulk edit by drag-select: set rate, apply %, stop-sell, min-stay, close-to-arrival. Rate plan selector. Copy-forward. Seasonality band above the grid.

**`AvailabilityBoard`** — by room type × date: total inventory, sold, available, overbooking limit, stop-sell flag. Occupancy % heat row. Group blocks shown as a distinct layer. Drill to the reservations making up a cell.

---

## Batch 5 — Front desk day flow

**Tier:** T4 · 7 screens

**`ArrivalsScreen`** — today's expected arrivals (business date, shown prominently). Table: time, guest, reservation no., room type, room assigned, nights, rate, balance, special requests, VIP flag, status. Row action: check in (opens wizard prefilled). Filters: unassigned, VIP, groups, no-show candidates. Counts header: expected / arrived / pending / no-show.

**`DeparturesScreen`** — today's departures. Table: room, guest, checkout time, balance due, payment method on file, late-checkout flag, HK status. Row action: check out. Counts: expected / departed / pending / overstay. Overstay highlighted.

**`InHouseGuests`** — all `checked_in`. Table: room, guest, arrival, departure, nights remaining, balance, VIP, DND, open requests, complaints. Actions: view folio, message, post charge, extend, move room, check out.

**`RoomAssignmentBoard`** — floor plan or grid by floor. Each room tile: number, type, room status colour, HK status dot, guest name if occupied, arrival badge if assigned today. Unassigned arrivals panel on the right — drag onto a room to assign. Conflict warnings (not clean, maintenance, already assigned). Filter by floor/type/status.

**`WalkInReg`** — single-flow: available rooms now (by type, with rate), guest capture (name, phone, email, ID type/number, nationality, address), nights, rate override with permission, payment/deposit, then create-guest + create-reservation + check-in as one action. Confirmation with room, key issue, and receipt.

**`GuestProfiles`** — searchable list: name, phone, email, nationality, total stays, last stay, lifetime value, VIP tier, flags (blacklist, allergy, preference). Actions: view, new reservation, merge duplicates.

**`GuestProfileDetail`** — header with VIP tier and flags. Tabs: **Profile** (all fields, ID documents, consent status, marketing opt-in), **Stay History** (past and upcoming reservations, nights, spend), **Preferences** (room, floor, pillow, dietary, language — free-form plus structured), **Folio History** (charges across stays), **Requests & Complaints**, **Notes** (staff notes, internal only, with author and timestamp).

---

## Batch 6 — Front desk transactions

**Tier:** T4 · 4 screens

**`CheckInWizard`** — 7 steps, all functional (no placeholders): (1) select reservation — search or pick from arrivals; (2) verify guest — ID capture with document type, number, expiry, photo/scan, nationality; (3) assign room — available rooms of the booked type, HK status shown, upgrade option with rate implication; (4) registration — signature capture, terms acknowledgement, vehicle registration if driving; (5) **payment/deposit — real**: amount due, deposit policy, method (cash/card/transfer/POS terminal/corporate account), reference capture, change calculation for cash; (6) **access credentials** — issue card and/or PIN, count, validity window, lock provider capability shown (hide PIN if unsupported), queue-if-offline notice; (7) **receipt & documents** — print registration card, print deposit receipt, email confirmation, guest portal QR code. Summary panel persists on the right throughout.

**`CheckOut`** — folio review: all charges grouped by category with tax lines visible, payments, balance. Actions: post late charges, apply discount (permission + reason), void a charge (ConfirmDestructive + reason), split folio, transfer charge to another folio/company. Settlement: method, amount, change, multi-payment. Then: revoke access credentials (explicit, with confirmation of provider revocation semantics — immediate vs on-next-sync), release room to housekeeping, print/email invoice, guest feedback prompt. Express-checkout variant for a zero balance.

**`FolioScreen`** — reservation folio: header (guest, room, dates, balance). Charge lines: date, description, category, quantity, unit price, amount, tax lines nested beneath the parent, posted-by, reversal indicator. Payment lines distinct. Running balance. Actions: post charge (category picker, amount, quantity, description, tax auto-computed and previewed), post payment, void with reason, transfer, split, print. Filters by category and date. Never allow in-place editing of a posted line — reversal only.

**`FinanceFolioManagement`** — all open folios across the property: room, guest, charges, payments, balance, days open, last activity. Flags: high balance, no payment on file, credit limit exceeded, unposted room charges. Bulk actions and drill-through.

---

## Batch 7 — Access control & locks

**Tier:** T4 · 4 screens

**`KeyCardMgmt`** — issue card: reservation lookup, room, card count (max from config), validity window, encoder status (connected/absent/error), read-card-serial step, register with provider, result. Active cards table: guest, room, serial, issued, valid to, status, duplicate flag. Actions: issue duplicate, replace lost card (revokes original), revoke. Offline notice when queued.

**`PINManagement`** — generate PIN: reservation, room, validity, PIN shown **once** with an explicit "cannot be retrieved again" warning, then masked (`74**12`) forever. Active PINs table: guest, room, masked reference, valid window, status. Revoke action. Hidden entirely when the lock provider lacks PIN capability.

**`RoomAccessMgmt`** — room × lock mapping: room, lock name, provider, provider reference, battery level if available, last seen, firmware. Actions: test connection, remote unlock (permission-gated, audited), re-map, emergency revoke-all-for-room. Provider capability panel showing what this provider supports.

**`KeyCardLog`** — append-only event log: timestamp, event type (issued, duplicate, replacement, revoked, encode failed, API failed, queued offline, sync success, sync failed, emergency revoked), credential, guest, room, performed by, IP, detail. Filters by type/room/date/guest. Export. No delete affordance anywhere.

---

## Batch 8 — Housekeeping

**Tier:** T4 primary, T3 supervisor · 7 screens

**`HKBoard`** — room grid by floor. Tile: room number, HK status colour, occupancy state, assigned attendant avatar, priority flag, DND indicator, inspection flag, time in current status. Filters: floor, status, attendant, priority. Bulk status change. Counts strip. Departure/arrival overlay so attendants prioritise rooms needed today.

**`HKMyTasks`** (T3) — assigned rooms as large cards: room, type, status, priority, guest state (departure/stayover/vacant), notes. Actions: start, complete, request inspection, report issue, mark DND. Progress bar. Designed for a walking supervisor.

**`HousekeepingSchedule`** — attendant × room assignment grid, persisted. Rows = rooms, columns = attendants, cell = assignment toggle. Auto-assign by section/floor with load balancing. Workload count per attendant. Shift selector. Publish action that notifies field devices.

**`InspectionLog`** — inspections: room, attendant, inspector, timestamp, score, checklist results (pass/fail per item), photos, re-clean required flag, notes. Filters. Attendant score trend.

**`LinenSupplies`** — par levels and current stock by item and floor. Issue to attendant, return, soiled count, loss. Links to inventory transactions.

**`LostFound`** — items: found date, location/room, description, category, photo, finder, status (stored/claimed/disposed/returned), storage location, guest match if linked to a reservation. Actions: log, claim (with claimant identity), dispose after retention period, ship to guest.

**`DNDLog`** — rooms on DND: room, guest, DND since, hours elapsed, scheduled checkout, wellness-check status. Escalation colour after threshold. Actions: **log wellness check** (recorded with performer and timestamp — this is a liability record, must be a real write), **override DND** (permission-gated, reason required, audited). Both feed AuditTrail.

---

## Batch 9 — Maintenance & general asset register

**Tier:** T4 · 5 screens

**`WorkOrders`** — list: number, title, asset/room, category, priority, status, reported by, assigned to, reported at, SLA due, age. Filters and grouping. Bulk assign. Overdue highlighted.

**`WorkOrderDetail`** — full record, photos, event timeline (AuditTrail), parts consumed (links to stock transactions), labour time, cost, resolution notes, guest impact flag, follow-up PM creation. Status actions with required fields per transition.

**`AssetRegister`** — **general, not hotel-equipment-only** (vehicles and generators are assets). Columns: asset tag, name, category (room equipment, HVAC, kitchen, laundry, **generator**, **vehicle**, IT, furniture), location, criticality, purchase date, cost, warranty expiry, supplier, last service, next service, status, downtime YTD. Detail: full record, document attachments, service history, work orders, cost of ownership, runtime hours or odometer where applicable, depreciation.

**`PreventiveSchedule`** — PM tasks: asset, task, frequency (by time and/or by usage — km, runtime hours), last done, next due, assigned technician, status (ok/due soon/overdue), estimated duration. Calendar and list views. Actions: mark done (opens completion form with readings), generate work order, reschedule, skip with reason.

**`VendorContacts`** — vendors: company, category, contact, phone, email, address, services, rate card, SLA terms, contract expiry, rating, jobs completed, average response time. Actions: create work order assigned to vendor, log call, view job history.

---

## Batch 10 — Restaurant & POS

**Tier:** T3 landscape primary · 8 screens

**`POSTerminal`** — left: category tabs + item grid with prices and availability (unavailable items visibly disabled). Centre: order lines with quantity steppers, modifiers, notes, void line. Right: totals (subtotal, service charge, each tax line separately, total), table/room selector, guest lookup for room charge, payment panel (cash with change calc, card, POS terminal, room charge, complimentary with reason, split payment). Order actions: send to kitchen, hold, transfer table, split bill by item or evenly, merge.

**`KitchenDisplay`** — order tickets as columns by status (new / preparing / ready / served). Each ticket: order number, table or room, items with modifiers, elapsed timer colour-escalating, priority. Touch to advance status. Sound/visual alert on new. Recall completed. Large type, high contrast — read across a hot kitchen.

**`TableManagement`** — floor plan: tables with shape, seats, status colour (available/occupied/reserved/dirty), current order value, seated time, server. Actions: seat, move, merge, split, mark dirty/clean, assign server.

**`MenuManagement`** — items: name, category, price, cost, margin, description, allergens, dietary tags, prep time, availability toggle, stock link, image, modifiers/options, display order. Category management. Bulk price update. Day-part menus (breakfast/lunch/dinner/room service) with service hours.

**`DiningReservations`** — table bookings: date/time picker with availability by party size and time slot, guest (in-house lookup or external), party size, table preference, occasion, dietary notes, status (booked/seated/completed/no-show/cancelled). Day view timeline by table. Cover forecast.

**`RoomServiceOrders`** — order intake: room lookup (validates an in-house reservation exists), guest name auto-filled, menu with room-service day-part pricing and delivery surcharge, tray/cutlery notes, requested delivery time. Order board by status (received / preparing / ready / en route / delivered), delivery runner assignment, delivery confirmation, charge posted to folio (shown explicitly). Guest-initiated orders appear here flagged as such.

**`GuestRoomCharges`** — F&B charges routed to room folios: order, room, guest, amount, tax, posted at, posted by, folio reference, status (pending/posted/failed/disputed). Retry failed postings. Dispute flow.

**`CashDrawerReconciliation`** — **new**: shift open (opening float, counted, operator), during-shift cash movements (sales, refunds, paid-outs, drops to safe), shift close (declared count by denomination, expected total, variance highlighted, reason required if over threshold), manager sign-off. History with variance trend by operator.

---

## Batch 11 — Finance: night audit & tax

**Tier:** T4 · 5 screens

**`NightAudit`** — **the most important new screen.** Header: current business date, last successful run, pending nights count (if the server was off, show catch-up needed). Pre-audit checklist with live pass/fail: all departures settled or rolled, all arrivals actioned or marked no-show, all POS shifts closed, all charges posted, unassigned in-house rooms. Run panel: step list executing sequentially with per-step status and record counts — post room charges + tax for in-house, process no-shows, post no-show penalties, close POS day, freeze daily revenue, roll business date. Exceptions panel requiring operator decision (each with a recommended action). Post-run summary: rooms occupied, revenue by category, ADR, RevPAR, taxes collected, comparison to prior day. Run history with drill-down. Rollback/reopen action, permission-gated, reason required, audited.

**`TaxConfiguration`** — tax codes: name, rate, jurisdiction (federal/state/local), type (VAT, consumption, service charge), applies to which charge categories, inclusive or exclusive, compounds on which other taxes, effective date range, active. Ordering panel showing computation sequence with a worked example (₦50,000 room → service charge → consumption tax → VAT → total) so the stacking is verifiable at a glance. Exemption rules: guest type, corporate account, long-stay threshold. FIRS e-invoicing settings block: TIN, submission status, retry queue.

**`RefundProcessing`** — refund requests: original payment lookup, refundable amount with deductions itemised (cancellation penalty, damages, unpaid charges), reason, method (must match original where required), approver (permission-gated, above threshold requires manager), gateway reference, status (requested/approved/processing/completed/failed/rejected). Audit trail.

**`FolioVoidReversal`** — void/reverse a posted charge or payment: original line detail, reversal amount (full or partial), reason from a controlled list plus free text, permission requirement shown, resulting balance preview, confirmation requiring typed acknowledgement. Reversal history report showing who reverses what, by operator — this is the fraud-detection view.

**`DailySummary`** — business-date summary: revenue by category with tax breakdown, payments by method, occupancy stats, ADR/RevPAR, arrivals/departures/no-shows, complimentary and discounts with reasons, variance vs prior day and same day last week. Status: open / closed / reopened (with who and why). Actions: close day, reopen (permission-gated, audited), export.

---

## Batch 12 — Finance: invoicing & AP

**Tier:** T4 · 5 screens

**`InvoiceReceipts`** — issue invoice: folio selection, invoice type (guest/corporate/group/proforma), gapless invoice number displayed, bill-to (guest or company with TIN), line items with tax lines, totals, payment terms, due date. Issued invoices list: number, date, bill-to, amount, tax, paid, balance, status (draft/issued/paid/partially paid/overdue/void/credit-noted). Actions: preview, print, email, record payment, void (audited), issue credit note. Receipt issuance for payments with its own gapless sequence.

**`AccountsPayable`** — supplier invoices: supplier, invoice number, PO reference, date, due date, amount, tax withheld, paid, balance, status, aging bucket. Actions: enter invoice, match to PO and goods received, approve (workflow with threshold), schedule payment, record payment, dispute. Aging summary. Payment run: select approved invoices, batch, generate payment schedule.

**`RevenueReports`** — revenue by date/category/room type/rate plan/source/branch. Charts plus drillable table. Comparison periods. Tax collected summary. Export.

**`AccountingExport`** — **new**: journal export for QuickBooks/Sage/CSV. Period selection, account mapping configuration (revenue categories → GL accounts, tax → liability accounts, payments → bank accounts), preview of the journal, validation errors, export history.

**`CreditNotes`** — **new**: credit note against an issued invoice, gapless numbering, reason, line-level or full, approver, resulting balance, print/email.

---

## Batch 13 — Inventory

**Tier:** T4 · 5 screens

**`StockDashboard`** — KPI strip (total value, items below reorder, out of stock, expiring, pending POs). Low-stock table with reorder suggestions. Recent movements. Value by category chart. Fast/slow movers.

**`ProductsScreen`** — items: SKU, name, category, unit of measure, current stock by location, reorder point, reorder quantity, unit cost, last cost, average cost, supplier(s), perishable flag, expiry tracking, barcode. Detail with movement history and cost trend.

**`SuppliersScreen`** — suppliers: name, category, contact, payment terms, lead time, rating, total spend, on-time %, active POs, outstanding balance. Detail with price list, order history, performance.

**`StockTransactions`** — movements: date, type (receipt, issue, transfer, adjustment, wastage, return, count), item, quantity, from/to location, reference (PO/work order/department), unit cost, value, performed by, reason. Filters. Adjustment requires reason and permission. Stock-count session with variance report.

**`PurchaseOrders`** — POs: number, supplier, raised by, date, expected, status (draft/pending approval/approved/sent/partially received/received/cancelled), total, received %. Detail: lines with ordered/received/outstanding, approval trail, goods-received entry (partial supported, updates stock and product quantity in one transaction), invoice match.

---

## Batch 14 — HR

**Tier:** T4 · 6 screens

**`StaffDirectory`** — staff: photo, name, employee number, role, department, phone, email, employment type, hire date, status, shift pattern. Filters. Actions: view, invite user account, deactivate.

**`StaffProfileDetail`** — tabs: Overview (personal, contact, next of kin, bank details masked), Employment (role, department, reporting line, contract, salary band — permission-gated), Documents (ID, certificates, contract, expiry tracking), Attendance (history, lateness, absence), Leave (balance, history, requests), Performance (reviews, notes), Access (system role, permissions, last login, devices).

**`RolesPermissions`** — role list with the full permission matrix: permission key × role grid, editable with permission. Show which roles are system-seeded and non-editable. Include all 13 roles (MGT, ORG, FD, RSV, HK, MX, RT, FIN, IT, **CS**, **RO**, **FLT**, **DRV**). Effective-permissions preview for a selected user. Warning that nav visibility is UX and the server enforces the boundary.

**`AttendanceScreen`** — daily attendance: staff, scheduled shift, clock in, clock out, hours, lateness, overtime, status (present/late/absent/leave/off). Filters by date/department. Manual entry with reason and approver. Summary by department. Trend chart.

**`ShiftScheduler`** — week grid: staff (rows) × day (columns), shift blocks (drag to assign, resize for duration). Shift templates. Coverage requirement per department per shift with under-staffed warnings. Publish action notifying staff devices. Swap requests.

**`LeaveManagement`** — **new** (replaces the removed inline "Approve Leave"): requests with type, dates, days, balance before/after, reason, coverage arrangement, status, approver chain. Approve/reject with comment. Leave calendar showing team coverage. Balance accrual by staff.

---

## Batch 15 — Communications & complaints

**Tier:** T4 primary · 6 screens

**`InternalChat`** — channel list (department channels, direct messages), message thread with sender avatar/role, timestamp, read receipts, attachments, mentions. Presence. Search. Pinned messages.

**`GuestMessaging`** — thread list by guest/room with unread counts, last message preview, SLA indicator. Thread: guest messages and staff replies, department attribution, canned responses, attachment, translate hint, escalate to complaint action. Filter by department and status. Assignment to a CS agent.

**`Announcements`** — announcement list: title, body, audience (all/department/role/branch), priority, publish window, read count, acknowledgement required flag. Compose with audience picker and preview. Read/acknowledgement tracking table.

**`ShiftHandover`** — handover notes by department and shift: outgoing staff, incoming staff, timestamp, structured sections (pending tasks, VIP guests, issues, room notes, follow-ups), acknowledgement by incoming staff. Prior handovers searchable.

**`ComplaintManagement`** — **new, CS-owned.** List: complaint number, guest, room, category, severity, channel, raised, owner, SLA due with countdown, status, escalation flag. Colour-escalating as SLA approaches and breaches. Detail: description, guest and reservation context, event timeline, owner assignment, severity change with reason, internal notes, resolution notes, **compensation** (type, amount, posts as folio credit — shows the resulting folio line), guest satisfaction capture, escalation with reason and target. Filters: severity, SLA state, category, owner, department.

**`ComplaintDashboard`** — **new**: open by severity, SLA at risk / breached, average resolution time, by category trend, by department, repeat-complaint guests, compensation total by period, satisfaction rate. Manager oversight view.

---

## Batch 16 — Reports

**Tier:** T4 · 6 screens

All six share a frame: date-range picker with presets, comparison period toggle, filter bar, chart region, drillable table, and a **working export** (PDF, Excel, CSV) with a generation state and a download result. Never render an export button that does nothing.

| Screen | Contents |
|---|---|
| `OccupancyReports` | Occupancy %, ADR, RevPAR by date/type/segment; forecast vs actual; pick-up; length of stay distribution; source mix |
| `RevenueReports` | Revenue by category, room type, rate plan, source; tax collected; discounts and comps with reasons; payment mix |
| `DepartmentReports` | Per-department KPIs, cost vs revenue, productivity, incidents |
| `GuestAnalytics` | New vs repeat, nationality mix, lifetime value distribution, satisfaction, complaint rate, VIP activity, source of business |
| `InventoryReports` | Consumption by category and department, wastage, stock turn, cost variance, supplier performance |
| `StaffReports` | Attendance and lateness, overtime, productivity (rooms cleaned per attendant-hour, work orders per technician), leave utilisation, turnover |

---

## Batch 17 — IT admin & devices

**Tier:** T4 · 7 screens

**`UserManagement`** — users: name, email, role, department, branch, status, MFA enabled, last login, failed attempts, locked. Actions: invite, edit role, force password change, reset MFA, unlock, deactivate. Bulk role change.

**`SystemHealth`** — server status, uptime, CPU/memory/disk (disk free prominent — WAL plus snapshots on a small SSD is a real failure mode), database size, WAL size, connection count, error rate, request latency, last error log entries. Service checks: database writable, lock provider reachable, central reachable, printer reachable.

**`SchemaUpdateStatus`** — **new**: current schema version, applied migrations list, pending migrations, last migration result, pre-migration snapshot reference. Application: current image digest, signature verification status, available update, rollout ring, update history with rollback actions, last health-check result.

**`DeviceManagement`** — devices: name, class (A–H), type, assigned to (staff or room), branch, enrolment date, last heartbeat, app version, battery, OS version, status (active/idle/offline/lost/retired). Actions: enrol (QR/code pairing), assign/unassign, bind to room (Class E), remote lock, remote wipe, revoke session, mark lost, retire. Class E panel: kiosk state, checkout-reset confirmation. Class G panel: staff assignment and hand-back log, charging cradle status.

**`BackupRestore`** — backups: timestamp, size, type (scheduled/manual/pre-migration), encryption status, checksum verified, location (local/offsite), retention expiry, **last restore-test result**. Actions: back up now, verify, download, restore (with the boot-marker explanation and confirmation), configure schedule and retention, configure offsite target.

**`AuditLog`** — append-only: timestamp, actor, role, action, entity type, entity ID, IP, device, detail (PII-redacted). Filters by actor/action/entity/date. Export. Retention notice. No delete affordance.

**`ErrorLog`** — **new**: errors with timestamp, severity, module, message, stack (collapsible), request ID, user, resolved flag. Group by signature with occurrence counts.

---

## Batch 18 — Multi-branch & settings

**Tier:** T4 · 8 screens

**`BranchOverview`** — branch cards: name, location, rooms, occupancy, revenue today, staff on duty, last sync, alerts. Aggregate KPI strip.

**`BranchComparison`** — side-by-side KPIs across branches with a "as of last sync" timestamp per branch made explicit. Ranking. Variance highlighting. **Working export.**

**`CentralSyncStatus`** — per-branch: last successful sync, pending snapshots, queue depth, clock drift, schema version, app version, connection state, error history. Manual sync trigger. Retention/rollup status.

**`HotelConfig`** — property identity (name, legal entity, TIN, address, contact, logo, timezone), operational settings (business-date roll time, check-in/out times, currency, date format), policies (cancellation defaults, deposit, credit limit, late checkout, no-show), room and floor configuration, service charge, and a link to Tax Configuration (Batch 11) rather than a single tax-rate field.

**`SyncSettings`** — central URL (HTTPS enforced, reject plain HTTP with an explanation), branch ID, sync key with rotation action, interval, what syncs (KPI scope stated explicitly), retry policy, last result.

**`DoorLockSettings`** — provider selection with **capability matrix per provider** (cards, PIN, mobile key, offline issuance, remote unlock, audit readback, immediate revocation, gateway required, max codes). Credentials form that changes shape per provider. Behaviour: auto-revoke on checkout, queue when offline, notify management on offline revoke, max cards per check-in, queue expiry buffer. Test connection with lock count result. Lock discovery and room mapping.

**`MyPreferences`** — language, timezone, date/time format, default landing screen, notification preferences by channel and event, density (comfortable/compact), theme, password change, MFA enrolment, active sessions with revoke.

**`PrintSettings`** — **new**: printer configuration by purpose (folio/invoice, receipt thermal, kitchen ticket, registration card), network address, paper size, test print, template selection, copies, auto-print triggers.

---

## Batch 19 — Fleet operations

**Tier:** T4 · 5 screens

**`DispatchBoard`** — the operational heart. Columns by trip status (requested / assigned / dispatched / en route / in transit / completed). Trip cards: trip number, service line icon, guest or department, pickup → dropoff, scheduled time with countdown, vehicle, driver, passenger count, flight number if a transfer. Unassigned queue prominent with age escalation. Right rail: vehicle availability strip (each vehicle with status, current trip, next free time) and driver on-duty list. Drag a trip onto a vehicle to assign. Conflict warnings: driver already on trip, vehicle in maintenance, document expired, driver licence expired, overlapping schedule. Day timeline view toggle.

**`TripDetail`** — header: trip number (mono), service line, status, guest/requester. Sections: route (pickup, dropoff, map placeholder, distance), schedule (requested, scheduled, dispatched, arrived, completed with durations), vehicle and driver, passengers, **odometer start/end with distance computed**, charge (type: folio/complimentary/cost centre/cash; quoted vs final; folio charge reference), flight details, waiting time and surcharge, guest rating and feedback, event timeline (AuditTrail). Actions per status with required fields.

**`NewTripRequest`** — service line selector. For transfers: reservation lookup (pulls guest, arrival date, flight if captured), direction (arrival pickup / departure dropoff), flight number with arrival time, terminal, passenger count and names, luggage. For charter: guest, duration basis (hourly/daily), start, estimated end. For staff/logistics: department, cost centre, purpose. Then: vehicle type, rate lookup showing the quote with breakdown (base, per-km, waiting, after-hours surcharge), charge type, special instructions. Confirm creates the trip in `requested`.

**`DriverRoster`** — drivers: name, licence number and class, **licence expiry with warning band**, medical certificate expiry, driver permit reference, assigned vehicle, on-duty status, trips today, trips this month, total km, average rating, incidents. Actions: assign vehicle, set on/off duty, view trip history, suspend with reason.

**`FleetCosting`** — cost per km and cost per trip by vehicle, revenue vs cost by service line, fuel cost trend, maintenance cost, utilisation % per vehicle, idle time, revenue per vehicle. Comparison across periods. Drill to trips or fuel entries. **Working export.**

---

## Batch 20 — Fleet assets & fuel

**Tier:** T4 · 4 screens

**`VehicleRegister`** — vehicles: registration number (mono, prominent), make/model/year, type, seating capacity, ownership (owned/leased/contractor), status, current odometer, fuel type, **document status summary column with expiry warning badges**, next service due (km and date), assigned driver, utilisation %. Filters by type/status/ownership/document state. Alert strip: documents expiring within 30 days, services overdue.

**`VehicleDetail`** — header: registration, make/model, status, odometer. Tabs: **Documents** (type, reference, issuer, issued, expires, days remaining with colour band, reminder setting, attachment, renew action) — covering insurance, vehicle licence, roadworthiness, hackney permit, proof of ownership; **Service** (schedule by km and by date, history, work orders, parts, downtime, cost); **Fuel** (entries, litres, cost, odometer, computed L/100km per interval, consumption trend chart with baseline band, anomaly flags); **Trips** (history, km, revenue); **Costs** (acquisition, depreciation, total cost of ownership, cost per km); **Telematics** (placeholder — GPS device binding, last position, disabled until configured).

**`FuelLog`** — entries: date/time, vehicle, driver, type (fill/drain/transfer/adjustment), litres, unit price per litre, total, odometer, **computed consumption for the interval**, station, payment method, receipt reference, recorded by, anomaly flag with reason. **Odometer is mandatory** — the form cannot submit without it. Validation warnings surfaced inline: litres exceed tank capacity, odometer unchanged or decreasing, timestamp outside driver shift, consumption deviates beyond threshold. Variance panel: by vehicle (L/100km vs baseline) and **by driver** — the view that changes behaviour. Weekly variance report with export.

**`GeneratorDieselLog`** — **the differentiator screen.** Generators as assets: name, capacity kVA, location, **runtime hours** (in place of odometer), fuel tank capacity, status. Diesel entries: date, generator, litres, unit price, total, runtime hours at fill, computed litres-per-hour for the interval, anomaly flag, supplier, recorded by. Consumption trend with baseline. Service schedule by runtime hours. **Cost analysis panel: diesel cost per day, per kWh-equivalent, per occupied room per day, and generator-hours vs grid-hours split** — the figure a Nigerian hotel GM has never been able to see and will immediately understand.

---

## Batch 21 — Guest portal

**Tier:** T2 (own phone) and T3 (in-room tablet) · 11 screens
**Tone note for this batch:** deliberately *not* staff density. Warm, spacious, large type, generous whitespace, hospitality-grade. Show both T2 and T3 layouts for each screen.

| Screen | Contents |
|---|---|
| **Welcome / Access** | T3: hotel branding, room number, "Tap to begin". T2: QR-scan landing or code entry (reservation code + surname). Language selector. |
| **Home** | Greeting with guest name, room number, stay dates and nights remaining. Service tiles: Room Service, Housekeeping, Front Desk, Transport, Restaurant, Maintenance, My Bill, Help. Active requests strip with status. Hotel notice/promo card. |
| **Room Service** | Day-part menu with categories, item cards (image, name, description, price, allergens, dietary tags, prep time), unavailable items visibly disabled. Cart with quantity, modifiers, notes. Delivery time selector. Tray/cutlery options. Confirm showing total incl. tax and delivery charge, and an explicit "will be added to your room bill". |
| **Order Tracking** | Active orders with status stepper (received → preparing → ready → on the way → delivered), estimated time, order contents, cancel window. Past orders with reorder. |
| **Housekeeping Request** | Request types as large tiles: clean my room now, turn-down service, extra towels, extra pillows/bedding, toiletries, DND on/off, laundry pickup. Quantity where relevant. Preferred time. Notes. Submitted requests with status. |
| **Maintenance Report** | Category tiles (AC, plumbing, electrical, TV/wifi, furniture, door/lock, other), description, **photo capture**, urgency, preferred visit time. Submitted reports with status. |
| **Front Desk Chat** | Message thread with staff, department attribution, timestamps, read state, attachments, quick-reply chips (late checkout, extra key, taxi, wake-up call, luggage assistance). Typing/response-time indicator. |
| **Transport** | Request a ride: airport transfer or local trip. Pickup time, destination, passengers, luggage, vehicle type with fare estimate. Active trip: driver name, vehicle and registration, ETA, status, contact driver, (placeholder for live tracking). Trip history with rating. |
| **Restaurant Booking** | Date, time slot availability, party size, table preference, occasion, dietary notes. Confirmation. My bookings with modify/cancel. |
| **My Bill** | Charges grouped by category and date, **tax lines visible**, running balance, payments received. Express checkout: balance, payment method, confirm. Request itemised invoice by email. Dispute a charge (opens a complaint). |
| **Help & Complaint** | Hotel directory (dining hours, facilities, wifi, emergency), FAQ, and **raise a complaint**: category, severity in plain language ("minor / affecting my stay / urgent"), description, photo, preferred contact method. Submitted complaints with status and expected response time. |

---

## Batch 22 — Staff field app (T1)

**Tier:** T1, 360–420px, arm-strapped 5" Android · 8 screens
**Interaction rules for this batch — state them in the prompt:** one task per screen; tap targets ≥ 56px; primary action full-width at the bottom, thumb-reachable; scan or pick rather than type; swipe to advance status; max 2 navigation levels; every screen readable at arm's length (body ≥ 16px, high contrast); persistent sync badge with pending-writes count; any task completable in ≤ 3 taps from app open.

| Screen | Contents |
|---|---|
| **Login / Device Pairing** | Large PIN pad or badge scan. Device shows its assigned identity. Offline login supported. |
| **My Tasks** | Assigned rooms or work orders as large cards: room number very large, type, status colour band, priority flag, guest state (departure / stayover / vacant), estimated time. Progress ring at top ("4 of 11"). Sorted by priority then floor. Pull to refresh. Offline badge with pending count. |
| **Room / Task Detail** | Room number huge at top. **Scan-to-arrive** (NFC tag on door frame or QR) confirming the right room — replaces typing. Checklist with large checkboxes. Photo capture. Notes with voice-to-text. Timer showing elapsed. Bottom full-width primary: "Mark Clean" / "Complete", advancing on swipe. Secondary: Report Issue, Mark DND, Request Inspection. |
| **Report Issue** | Category tiles (large icons), description with voice input, photo, urgency selector. Creates a work order. Confirmation. |
| **Supply Request** | Item tiles with quantity steppers (towels, linen, toiletries, cleaning supplies). Submit to store. Request status. |
| **My Shift** | Clock in / clock out as one large button with current state and elapsed time. Today's shift times, break tracking, hours this week, next shift. Offline-capable, queues. |
| **Messages & Announcements** | Announcement list with unread badge and acknowledge action. Direct messages, compact thread, quick replies. Optional push-to-talk button. |
| **Driver Mode** (same app, DRV role) | My trips list. Trip card: pickup time, guest name, pickup → dropoff, passengers, flight. Accept. **Odometer entry at start** (large numeric pad, mandatory). Navigate (hands off to maps). Arrived at pickup. Start trip. Complete with **odometer end** (mandatory). Log fuel: litres, price per litre, odometer, receipt photo. |

---

## Batch 23 — Auth & onboarding

**Tier:** T4 + T2 · 6 screens

| Screen | Contents |
|---|---|
| **Login** | Email + password, branch selector if multi-branch, remember device, forgot password. Failed-attempt counter with remaining attempts, lockout state with time remaining. Offline-login notice when central is unreachable. Connection indicator. Entry points to Org Portal / Admin Console. |
| **MFA Challenge** | 6-digit TOTP input, remaining time ring, use-backup-code link, trust-this-device option. |
| **MFA Enrolment** | QR code, manual secret, verification input, backup codes with download/print and an explicit acknowledgement. |
| **Force Password Change** | Current, new, confirm, live strength and policy checklist. Reason for the forced change stated. |
| **Branch Selection** | Card per accessible branch: name, location, role at that branch, connection state, last sync. |
| **Guest Access** (T2) | Reservation code + surname, or QR landing. Clear, friendly, minimal — not the staff login. |

---

## Batch 24 — Org Portal

**Tier:** T4 · 6 screens · Central-server authenticated, distinct visual identity from the property app (slightly darker chrome to signal "you are above a property").

| Screen | Contents |
|---|---|
| **Org Dashboard** | Portfolio KPIs: total rooms, aggregate occupancy, revenue, ADR/RevPAR by branch, best/worst performers, alerts across the estate |
| **Branch Directory** | All branches: name, location, rooms, status, connection state, last sync, schema version, app version, occupancy, revenue |
| **Estate Comparison** | Multi-branch KPI comparison with ranking, variance, trend; "as of last sync" per branch; export |
| **Consolidated Reports** | Revenue, occupancy, department, guest analytics across the estate; per-branch drill-down |
| **Org Users** | Org-level users and their branch access grid; invite; role assignment |
| **Org Settings** | Organisation identity, legal entities, branch onboarding, sync policy, retention policy, branding |

---

## Batch 25 — Admin Console

**Tier:** T4 · 6 screens · Platform-owner surface. MFA + IP allowlist enforced — reflect that in the UI.

| Screen | Contents |
|---|---|
| **Platform Dashboard** | Organisations, branches, total properties, active devices, sync health, error rates, version distribution across the fleet |
| **Organisation Management** | Organisations: name, plan, branches, users, status, created, billing state. Provision new organisation. Suspend. |
| **Branch Provisioning** | New branch: organisation, name, location, sync key generation, initial admin, deployment instructions, provisioning checklist |
| **Fleet & Release Management** | Every property's app version, schema version, image digest, signature status, last heartbeat, disk free, last backup. Release rings (canary → 10% → all), rollout progress, force update, rollback. Health-check results. |
| **Platform Audit** | Cross-organisation audit log, admin actions, access history, IP allowlist management |
| **Support Tools** | Per-property diagnostic view, error log access, remote sync trigger, session inspection. Read-mostly, every action audited. |

---

## Batch 26 — Print templates

**Tier:** print · 6 templates · A4 and 80mm thermal as marked.

| Template | Size | Contents |
|---|---|---|
| **Guest Folio / Invoice** | A4 | Hotel letterhead, legal entity, TIN, invoice number, date, bill-to, reservation details, charge lines with tax lines itemised, subtotal, each tax named and shown, total, payments, balance, payment terms, footer with bank details |
| **Payment Receipt** | 80mm + A4 | Receipt number, date/time, guest, room, amount, method, reference, cashier, hotel details |
| **Registration Card** | A4 | Guest details, ID captured, room, dates, rate, vehicle registration, terms and conditions, signature block, **guest portal QR code** |
| **Kitchen Ticket** | 80mm | Order number, table or room, time, items with modifiers and notes, server, priority marker — large type, minimal ink |
| **Trip Sheet / Waybill** | A4 | Trip number, date, vehicle registration, driver, passengers, pickup/dropoff, odometer start/end, distance, fuel, charge, signature blocks for driver and passenger |
| **Night Audit Report** | A4 | Business date, occupancy, revenue by category, taxes collected, ADR/RevPAR, arrivals/departures/no-shows, exceptions, auditor, sign-off block |

---

## Batch order recommendation

**Pilot-critical (do first):** 0 → 1 → 3 → 5 → 6 → 11 → 12 → 4 → 26
**Operational (second):** 2 → 8 → 10 → 13 → 9 → 7 → 14
**Expansion (third):** 19 → 20 → 15 → 21 → 22
**Platform (last):** 16 → 17 → 18 → 23 → 24 → 25

Rationale: batches 3, 5, 6, 11, 12 plus print templates are exactly what a hotel needs to take money and close a day. Everything else, however visible, is secondary to that.
