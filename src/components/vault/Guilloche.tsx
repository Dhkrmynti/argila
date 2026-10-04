import React from "react";

/*
 * Guilloché rosette, computed rather than drawn: every band is a family of
 * phase-shifted sinusoids around a circle, the way a rose engine cuts a note.
 * Coordinates are rounded so server and client markup match exactly.
 */

const C = 200;
const TAU = Math.PI * 2;

type Ring = {
  copies: number;
  steps: number;
  radius: (theta: number, phase: number) => number;
  opacity: number;
  width: number;
};

const ring = (r: Ring, j: number) => {
  const phase = (j / r.copies) * TAU;
  let d = "";
  for (let i = 0; i <= r.steps; i++) {
    const t = (i / r.steps) * TAU;
    const rad = r.radius(t, phase);
    const x = (C + rad * Math.cos(t)).toFixed(1);
    const y = (C + rad * Math.sin(t)).toFixed(1);
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
  }
  return d + "Z";
};

const RINGS: Ring[] = [
  {
    copies: 12,
    steps: 720,
    radius: (t, p) => 178 + 11 * Math.sin(36 * t + p) + 3 * Math.sin(6 * t - p),
    opacity: 0.55,
    width: 0.55,
  },
  {
    copies: 9,
    steps: 600,
    radius: (t, p) => 140 + 15 * Math.sin(24 * t + p) * Math.cos(3 * t),
    opacity: 0.7,
    width: 0.6,
  },
  {
    copies: 14,
    steps: 600,
    radius: (t, p) => 70 + 24 * (0.5 + 0.5 * Math.cos(9 * t + p)) + 4 * Math.cos(27 * t),
    opacity: 0.8,
    width: 0.6,
  },
];

const PATHS = RINGS.map((r) => Array.from({ length: r.copies }, (_, j) => ring(r, j)));

interface GuillocheRosetteProps {
  className?: string;
  /** Draw the line-work in on mount */
  engrave?: boolean;
  /** Counter-rotate the bands like a vault dial */
  spin?: boolean;
  /** Seconds before the engraving starts */
  delay?: number;
}

export const GuillocheRosette: React.FC<GuillocheRosetteProps> = ({
  className = "",
  engrave = false,
  spin = false,
  delay = 0,
}) => {
  const spinClass = (i: number) => (spin ? (i % 2 === 0 ? "spin-slow" : "spin-slow-rev") : "");

  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.5">
        {[198, 160, 120, 62].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} />
        ))}
      </g>
      {PATHS.map((paths, i) => (
        <g
          key={i}
          className={spinClass(i)}
          style={{ ["--spin-dur" as string]: `${180 + i * 70}s` }}
          stroke="currentColor"
          strokeWidth={RINGS[i].width}
          opacity={RINGS[i].opacity}
        >
          {paths.map((d, j) => (
            <path
              key={j}
              d={d}
              pathLength={1}
              className={engrave ? "engrave" : undefined}
              style={
                engrave
                  ? {
                      ["--engrave-delay" as string]: `${(delay + i * 0.22 + j * 0.035).toFixed(3)}s`,
                      ["--engrave-dur" as string]: "2.4s",
                    }
                  : undefined
              }
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

/* MICR line marks, authored after the E-13B transit, amount and on-us symbols */
export const MicrMark: React.FC<{ kind?: "transit" | "amount" | "onus"; className?: string }> = ({
  kind = "transit",
  className = "",
}) => (
  <svg viewBox="0 0 12 14" className={`inline-block w-[0.8em] h-[0.95em] ${className}`} fill="currentColor" aria-hidden="true">
    {kind === "transit" && (
      <>
        <rect x="1" y="1" width="2.4" height="12" />
        <rect x="6" y="1" width="5" height="3.2" />
        <rect x="6" y="9.8" width="5" height="3.2" />
      </>
    )}
    {kind === "amount" && (
      <>
        <rect x="1" y="1" width="2.4" height="7" />
        <rect x="4.8" y="4" width="2.4" height="6" />
        <rect x="8.6" y="6" width="2.4" height="7" />
      </>
    )}
    {kind === "onus" && (
      <>
        <rect x="1" y="1" width="2.4" height="9" />
        <rect x="5" y="1" width="2.4" height="9" />
        <rect x="8.6" y="10" width="2.4" height="3" />
      </>
    )}
  </svg>
);
