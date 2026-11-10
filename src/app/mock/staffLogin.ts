export type LoginDestination = "hms" | "admin-console" | "org-portal";
export type StaffCredential = {
  staffId: string;
  name: string;
  role: string;
  roleName: string;
  auth: "pin" | "password";
  hint: string;
  secret: string;
  destination: LoginDestination;
  branches: number;
};

export const STAFF_LOGIN_ACCOUNTS: StaffCredential[] = [
  { staffId: "1014", name: "Chioma Nwosu", role: "FD", roleName: "Front Desk", auth: "pin", hint: "PIN 123456", secret: "123456", destination: "hms", branches: 1 },
  { staffId: "1022", name: "Fatima Musa", role: "HK", roleName: "Housekeeping", auth: "pin", hint: "PIN 123456", secret: "123456", destination: "hms", branches: 1 },
  { staffId: "1008", name: "Emeka Obi", role: "MX", roleName: "Maintenance", auth: "pin", hint: "PIN 123456", secret: "123456", destination: "hms", branches: 1 },
  { staffId: "1019", name: "Biodun Adeyemi", role: "RT", roleName: "Restaurant", auth: "pin", hint: "PIN 123456", secret: "123456", destination: "hms", branches: 1 },
  { staffId: "1006", name: "Amina Yusuf", role: "RSV", roleName: "Reservations", auth: "pin", hint: "PIN 123456", secret: "123456", destination: "hms", branches: 1 },
  { staffId: "1003", name: "Adaeze Okonkwo", role: "MGT", roleName: "Hotel Manager", auth: "password", hint: "Password demo123", secret: "demo123", destination: "hms", branches: 2 },
  { staffId: "1011", name: "Ngozi Eze", role: "FIN", roleName: "Finance", auth: "password", hint: "Password demo123", secret: "demo123", destination: "hms", branches: 2 },
  { staffId: "1002", name: "Tunde Afolabi", role: "IT", roleName: "IT Administrator", auth: "password", hint: "Password demo123", secret: "demo123", destination: "hms", branches: 3 },
];

export const OWNER_LOGIN_ACCOUNTS = [
  { email: "admin@platform.com", password: "demo123", name: "System Admin", role: "PLT", destination: "admin-console" as const, branches: 5, hint: "Password demo123" },
  { email: "owner@grandpalms.ng", password: "demo123", name: "Alhaji Musa Ibrahim", role: "ORG", destination: "org-portal" as const, branches: 4, hint: "Password demo123" },
];
