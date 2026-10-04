"use client";

import React from "react";

interface KilnOrbProps {
  /** 0 (cold, barely lit) to 1 (white-hot) */
  heat?: number;
  className?: string;
  /** Skip the turbulence layer; reads cleaner at small sizes */
  simple?: boolean;
  children?: React.ReactNode;
}

/*
 * The mouth of the kiln: a disc of fire built from stacked radial gradients.
 * Heat sets how far the white-hot core spreads and how bright the halo is.
 * The flicker and drift are CSS animations, stopped under reduced motion.
 */
export const KilnOrb: React.FC<KilnOrbProps> = ({ heat = 1, className = "", simple = false, children }) => {
  const h = Math.min(1, Math.max(0, heat));
  const core = 8 + h * 26; // % radius of the white-hot centre
  const body = 34 + h * 22;

  return (
    <div className={`${className.includes("absolute") ? "" : "relative"} aspect-square ${className}`} aria-hidden={children ? undefined : true}>
      {/* Halo thrown onto the studio */}
      <div
        className="absolute -inset-[30%] rounded-full blur-3xl animate-drift"
        style={{
          background: `radial-gradient(closest-side, rgba(242,140,56,${0.1 + h * 0.32}), rgba(142,45,18,${0.05 + h * 0.18}) 55%, transparent 75%)`,
        }}
      />
      {/* Brick rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(closest-side, transparent 88%, rgba(255,226,196,0.10) 89%, rgba(255,226,196,0.02) 93%, transparent 94%)",
        }}
      />
      {/* Fire */}
      <div
        className="absolute inset-[6%] rounded-full animate-flicker"
        style={{
          background: `radial-gradient(circle at 50% 58%, #FFF6E2 0%, #FFE2A8 ${core * 0.6}%, #FFC56E ${core}%, #F28C38 ${body}%, #D9622B ${body + 14}%, #8E2D12 ${body + 28}%, #2A120A 88%, #140A06 100%)`,
          opacity: 0.6 + h * 0.4,
          // A cold kiln is banked embers: dim and dull, warming as heat rises
          filter: `brightness(${0.32 + h * 0.68}) saturate(${0.55 + h * 0.45})`,
          boxShadow: simple
            ? `0 0 ${12 + h * 30}px ${h * 4}px rgba(242,140,56,${0.2 + h * 0.3})`
            : `0 0 ${40 + h * 120}px ${h * 20}px rgba(242,140,56,${0.15 + h * 0.3}), inset 0 -30px 80px rgba(20,8,4,0.6)`,
        }}
      />
      {/* Slow turbulence across the face */}
      {!simple && (
      <div
        className="absolute inset-[10%] rounded-full mix-blend-screen opacity-60 animate-drift"
        style={{
          background:
            "radial-gradient(40% 30% at 35% 40%, rgba(255,240,212,0.35), transparent 70%), radial-gradient(35% 25% at 65% 65%, rgba(255,197,110,0.3), transparent 70%)",
          animationDuration: "9s",
        }}
      />
      )}
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
};

export default KilnOrb;
