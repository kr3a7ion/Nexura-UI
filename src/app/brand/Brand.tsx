import { useId } from "react";
import { NAV_BG, TEAL, TEXT, MUTED, display } from "../constants";

export const BRAND = {
  name: "Nexura",
  product: "Hotel Suite",
  tagline: "Your hotel never goes offline.",
} as const;

export function BrandMark({ size = 40 }: { size?: number }) {
  const radius = Math.round(size * 0.26);
  const gradientId = `nexura-mark-${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Nexura">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={TEAL} />
          <stop offset="1" stopColor={NAV_BG} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx={radius} fill={`url(#${gradientId})`} />
      <circle cx="22" cy="22" r="8.5" fill="none" stroke="white" strokeWidth="5" />
      <path d="M27.8 28.2 43 43.4V35h7v15H35v-7h7.2L27 27.8" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="49.5" cy="16" r="3.5" fill="white" />
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
          className="mt-1 uppercase leading-none"
          style={{ color: secondary, fontFamily: `'Plus Jakarta Sans', ${display}`, fontSize: Math.max(8, size * 0.22), letterSpacing: "0.18em", fontWeight: 700 }}
        >
          {BRAND.product}
        </div>
      </div>
    </div>
  );
}
