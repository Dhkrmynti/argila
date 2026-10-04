import React from "react";

// Same vessel as scripts/generate-argila-assets.cjs, inline so it can take the heat ramp.
export const VESSEL =
  "M35 10H65V15Q59.5 16 59.5 21.5V26C59.5 31 83 38.5 83 59C83 75 71.5 84.5 64 89H36C28.5 84.5 17 75 17 59C17 38.5 40.5 31 40.5 26V21.5Q40.5 16 35 15Z";

export const VesselMark: React.FC<{ className?: string; id?: string }> = ({ className = "w-7 h-7", id = "vm" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#D9622B" />
        <stop offset="0.6" stopColor="#F28C38" />
        <stop offset="1" stopColor="#FFC56E" />
      </linearGradient>
      <mask id={`${id}-m`}>
        <rect width="100" height="100" fill="#fff" />
        <rect x="10" y="50" width="80" height="4.5" fill="#000" />
        <rect x="10" y="62" width="80" height="4.5" fill="#000" />
      </mask>
    </defs>
    <path d={VESSEL} fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
  </svg>
);

export const Wordmark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <VesselMark className="w-7 h-7" />
    <span className="font-display font-bold text-[19px] tracking-[-0.02em] lowercase">argila</span>
  </span>
);
