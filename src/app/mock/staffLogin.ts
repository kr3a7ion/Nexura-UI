export type LoginDestination = "hms" | "admin-console" | "org-portal";
export type LoginKind = "staff" | "cloud";
export type LoginAccount = {
  username: string;
  password: string;
  name: string;
  role: string;
  roleName: string;
  destination: LoginDestination;
  branches: number;
  kind: LoginKind;
};

// Mock only. Staff accounts live on the hotel server; cloud accounts (owner, platform) need internet.
export const LOGIN_ACCOUNTS: LoginAccount[] = [
  { username: "chioma.nwosu", password: "demo123", name: "Chioma Nwosu", role: "FD", roleName: "Front Desk", destination: "hms", branches: 1, kind: "staff" },
  { username: "fatima.musa", password: "demo123", name: "Fatima Musa", role: "HK", roleName: "Housekeeping", destination: "hms", branches: 1, kind: "staff" },
  { username: "emeka.obi", password: "demo123", name: "Emeka Obi", role: "MX", roleName: "Maintenance", destination: "hms", branches: 1, kind: "staff" },
  { username: "biodun.adeyemi", password: "demo123", name: "Biodun Adeyemi", role: "RT", roleName: "Restaurant", destination: "hms", branches: 1, kind: "staff" },
  { username: "amina.yusuf", password: "demo123", name: "Amina Yusuf", role: "RSV", roleName: "Reservations", destination: "hms", branches: 1, kind: "staff" },
  { username: "adaeze.okonkwo", password: "demo123", name: "Adaeze Okonkwo", role: "MGT", roleName: "Hotel Manager", destination: "hms", branches: 2, kind: "staff" },
  { username: "ngozi.eze", password: "demo123", name: "Ngozi Eze", role: "FIN", roleName: "Finance", destination: "hms", branches: 2, kind: "staff" },
  { username: "tunde.afolabi", password: "demo123", name: "Tunde Afolabi", role: "IT", roleName: "IT Administrator", destination: "hms", branches: 3, kind: "staff" },
  { username: "musa.ibrahim", password: "demo123", name: "Alhaji Musa Ibrahim", role: "ORG", roleName: "Owner", destination: "org-portal", branches: 4, kind: "cloud" },
  { username: "ops.admin", password: "demo123", name: "System Admin", role: "PLT", roleName: "Platform Admin", destination: "admin-console", branches: 5, kind: "cloud" },
];
