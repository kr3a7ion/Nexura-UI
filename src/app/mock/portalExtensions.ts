export const ORG_BRANCH_DIRECTORY = [
  { id: "BR-ABJ-01", name: "Grand Palms Maitama", location: "Maitama, Abuja", rooms: 100, status: "Active", connection: "Online", lastSync: "2 min ago", schema: "2026.08.4", app: "v2.6.1", occupancy: 88, revenue: 1250000 },
  { id: "BR-LAG-01", name: "Grand Palms Ikoyi", location: "Ikoyi, Lagos", rooms: 75, status: "Active", connection: "Online", lastSync: "6 min ago", schema: "2026.08.4", app: "v2.6.1", occupancy: 76, revenue: 1085000 },
  { id: "BR-LAG-02", name: "Grand Palms Lekki", location: "Lekki Phase 1, Lagos", rooms: 52, status: "Active", connection: "Degraded", lastSync: "38 min ago", schema: "2026.08.3", app: "v2.6.0", occupancy: 64, revenue: 684000 },
  { id: "BR-ABJ-02", name: "Grand Palms Gwarinpa", location: "Gwarinpa, Abuja", rooms: 40, status: "Opening", connection: "Offline", lastSync: "Never", schema: "2026.08.4", app: "v2.6.1", occupancy: 0, revenue: 0 },
];

export const ORG_BRANCH_NAMES = ORG_BRANCH_DIRECTORY.map(branch => branch.name);

export const ORG_LEVEL_USERS = [
  { id: "USR-001", name: "Alhaji Musa Ibrahim", email: "owner@grandpalms.ng", role: "Organisation Owner", status: "Active", branches: ORG_BRANCH_NAMES },
  { id: "USR-014", name: "Adaeze Okonkwo", email: "adaeze.okonkwo@grandpalms.ng", role: "Regional Manager", status: "Active", branches: [ORG_BRANCH_NAMES[0], ORG_BRANCH_NAMES[1], ORG_BRANCH_NAMES[2]] },
  { id: "USR-022", name: "Ngozi Eze", email: "ngozi.eze@grandpalms.ng", role: "Finance Controller", status: "Active", branches: [ORG_BRANCH_NAMES[0], ORG_BRANCH_NAMES[1]] },
  { id: "USR-031", name: "Tunde Afolabi", email: "tunde.afolabi@grandpalms.ng", role: "Auditor", status: "Invited", branches: [ORG_BRANCH_NAMES[1]] },
];

export const PLATFORM_ORGANISATIONS = ["Grand Palms Group", "Ibis Suites Ltd", "Oasis Hotels Nigeria"];

export const PROVISIONING_CHECKLIST = [
  "Organisation and subscription entitlement verified",
  "Branch identity and Lagos/Abuja location recorded",
  "Encrypted sync key generated and copied",
  "Initial administrator invitation prepared",
  "Deployment image and signature verified",
  "First heartbeat and schema migration confirmed",
];

export const FLEET_PROPERTIES = [
  { id: "FLT-001", property: "Grand Palms Maitama", location: "Abuja", app: "v2.6.1", schema: "2026.08.4", digest: "sha256:8f21…b19a", signature: "Verified", heartbeat: "42 sec ago", disk: "68 GB", backup: "Today · 02:10", ring: "Canary", health: "Healthy" },
  { id: "FLT-002", property: "Grand Palms Ikoyi", location: "Lagos", app: "v2.6.1", schema: "2026.08.4", digest: "sha256:8f21…b19a", signature: "Verified", heartbeat: "1 min ago", disk: "91 GB", backup: "Today · 02:18", ring: "10%", health: "Healthy" },
  { id: "FLT-003", property: "Ibis Suites Victoria Island", location: "Lagos", app: "v2.6.0", schema: "2026.08.3", digest: "sha256:442c…9d10", signature: "Verified", heartbeat: "4 min ago", disk: "24 GB", backup: "Yesterday · 23:45", ring: "All", health: "Warning" },
  { id: "FLT-004", property: "Oasis Hotel Wuse", location: "Abuja", app: "v2.5.9", schema: "2026.07.8", digest: "sha256:10aa…c281", signature: "Expired", heartbeat: "2 hr ago", disk: "9 GB", backup: "3 days ago", ring: "Paused", health: "Critical" },
];

export const RELEASE_HEALTH_CHECKS = [
  { name: "API and database migrations", status: "Passed", detail: "42/42 checks" },
  { name: "Authentication and MFA", status: "Passed", detail: "18/18 checks" },
  { name: "Offline sync replay", status: "Passed", detail: "12/12 checks" },
  { name: "Receipt and report rendering", status: "Warning", detail: "1 font fallback" },
];

export const SUPPORT_DIAGNOSTICS = [
  { id: "SUP-001", property: "Grand Palms Maitama", location: "Abuja", state: "Healthy", latency: "84 ms", pending: 0, errors: 2, sessions: 21, lastDiagnostic: "1 min ago" },
  { id: "SUP-002", property: "Grand Palms Ikoyi", location: "Lagos", state: "Healthy", latency: "112 ms", pending: 3, errors: 5, sessions: 18, lastDiagnostic: "3 min ago" },
  { id: "SUP-003", property: "Ibis Suites Victoria Island", location: "Lagos", state: "Warning", latency: "428 ms", pending: 47, errors: 19, sessions: 12, lastDiagnostic: "8 min ago" },
  { id: "SUP-004", property: "Oasis Hotel Wuse", location: "Abuja", state: "Offline", latency: "—", pending: 126, errors: 31, sessions: 0, lastDiagnostic: "2 hr ago" },
];

export const SUPPORT_ERRORS = [
  { time: "10:42:18", code: "SYNC_RETRY_EXHAUSTED", message: "47 inventory writes remain queued.", severity: "Warning" },
  { time: "09:18:04", code: "LOCK_PROVIDER_TIMEOUT", message: "TTLock request exceeded 8 seconds.", severity: "Error" },
  { time: "08:51:22", code: "PRINT_FALLBACK", message: "Thermal printer used system font fallback.", severity: "Info" },
];

export const SUPPORT_SESSIONS = [
  { user: "Adaeze Okonkwo", role: "MGT", device: "Chrome · Windows", ip: "102.89.42.18", age: "2h 18m", mfa: true },
  { user: "Chioma Nwosu", role: "FD", device: "Nexura Desk 02", ip: "10.0.0.24", age: "54m", mfa: true },
  { user: "Fatima Musa", role: "HK", device: "HK-LAG-014", ip: "Offline token", age: "31m", mfa: false },
];
