export type AccessibleBranch = {
  id: string;
  name: string;
  city: "Lagos" | "Abuja";
  role: string;
  online: boolean;
  lastSync: string;
  unavailableReason?: string;
};

export const ACCESSIBLE_BRANCHES: AccessibleBranch[] = [
  { id: "lagos-ikoyi", name: "Grand Palms Ikoyi", city: "Lagos", role: "Hotel Manager", online: true, lastSync: "Just now" },
  { id: "abuja-maitama", name: "Grand Palms Maitama", city: "Abuja", role: "Regional Manager", online: true, lastSync: "2 minutes ago" },
  { id: "lagos-lekki", name: "Grand Palms Lekki", city: "Lagos", role: "Relief Manager", online: false, lastSync: "18 minutes ago", unavailableReason: "Branch server is unreachable. Contact the Lekki IT administrator." },
];

export const AUTHENTICATOR_SECRET = "NXRA J4KM 7QPA 2D8V";

export const MFA_BACKUP_CODES = [
  "NG4P-K82M",
  "LP7A-X3QF",
  "T9RW-6VCE",
  "J2HM-P8YK",
  "Q5DN-4AZL",
  "W7BX-N9TR",
  "C3KF-2MVP",
  "R8YA-5GQJ",
];

export const GUEST_QR_RESERVATION = {
  code: "BK-2860",
  surname: "Okafor",
  guest: "Chukwuemeka Okafor",
  property: "Grand Palms Ikoyi",
  stay: "4–5 Aug 2026",
};
