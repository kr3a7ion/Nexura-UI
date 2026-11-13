import { TEAL, TEXT, MUTED, display } from "../constants";

export const BRAND = {
  name: "Nexura",
  product: "Hotel Suite",
  tagline: "One suite for the whole hotel.",
} as const;

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Nexura">
      <rect width="64" height="64" rx="17" fill={TEAL} />
      <path d="M21 45V19l22 26V19" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandLockup({ size = 40, tone = "light" }: { size?: number; tone?: "light" | "dark" }) {
  const foreground = tone === "dark" ? "white" : TEXT;
  const secondary = tone === "dark" ? "rgba(255,255,255,0.56)" : MUTED;
  return (
    <div className="flex items-center gap-3 min-w-max">
      <BrandMark size={size} />
      <div>
        <div
          className="font-extrabold leading-none"
          style={{ color: foreground, fontFamily: `'Plus Jakarta Sans', ${display}`, fontSize: size * 0.55, letterSpacing: "-0.045em", fontWeight: 800 }}
        >
          {BRAND.name}
        </div>
        <div
          className="mt-1 leading-none"
          style={{ color: secondary, fontFamily: `'Plus Jakarta Sans', ${display}`, fontSize: Math.max(10, size * 0.3), fontWeight: 500 }}
        >
          {BRAND.product}
        </div>
      </div>
    </div>
  );
}
