"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { GuillocheRosette } from "./Guilloche";

/*
 * The studio behind every page: a round kiln seen from above, drawn in terra
 * hairline and fixed to the viewport. Scrolling turns the potter's wheel at
 * its heart and draws the flames inward, so the site reads as the firing
 * slowly building as you go down.
 */

const C = 400;
const BRICKS = 36;
const FLAMES = 12;

const brick = (i: number, r: number, offset: number) => {
  const deg = ((i + offset) * 360) / BRICKS;
  return (
    <rect
      key={`${r}-${i}`}
      x={C - 29}
      y={C - r - 18}
      width="58"
      height="36"
      strokeWidth="0.7"
      transform={`rotate(${deg} ${C} ${C})`}
    />
  );
};

const KilnArt: React.FC<{ wheel: any; flame: any }> = ({ wheel, flame }) => (
  <svg viewBox="0 0 800 800" fill="none" stroke="currentColor" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Kiln body: a faint fill so it reads as an object, not a diagram */}
    <circle cx={C} cy={C} r={394} fill="rgba(27,22,18,0.55)" stroke="none" />
    <circle cx={C} cy={C} r={282} fill="rgba(11,8,6,0.45)" stroke="none" />
    <circle cx={C} cy={C} r={394} strokeWidth="1.2" />
    <circle cx={C} cy={C} r={282} strokeWidth="1" />
    {/* Two courses of firebrick, the inner one laid half a brick over */}
    {Array.from({ length: BRICKS }, (_, i) => brick(i, 368, 0))}
    {Array.from({ length: BRICKS }, (_, i) => brick(i, 324, 0.5))}
    {/* Flames: they reach inward as the page is read */}
    {Array.from({ length: FLAMES }, (_, i) => (
      <g key={i} transform={`rotate(${(i * 360) / FLAMES + 15} ${C} ${C})`}>
        <motion.g style={{ y: flame }}>
          <path d={`M${C - 13} ${C - 278}Q${C - 16} ${C - 246} ${C} ${C - 214}Q${C + 16} ${C - 246} ${C + 13} ${C - 278}`} strokeWidth="0.9" />
          <path d={`M${C - 5} ${C - 278}Q${C - 6} ${C - 256} ${C} ${C - 236}Q${C + 6} ${C - 256} ${C + 5} ${C - 278}`} strokeWidth="0.5" />
        </motion.g>
      </g>
    ))}
    {/* The potter's wheel: head, throwing rings, bat pins */}
    <motion.g style={{ rotate: wheel, transformOrigin: "400px 400px", transformBox: "view-box" } as any}>
      <circle cx={C} cy={C} r={168} strokeWidth="0.8" />
      <circle cx={C} cy={C} r={156} strokeWidth="0.5" />
      {[136, 112, 88, 64].map((r, i) => (
        <circle key={r} cx={C} cy={C} r={r} strokeWidth="0.45" strokeDasharray={`${60 + i * 18} ${14 + i * 6}`} />
      ))}
      {[90, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} ${C} ${C})`}>
          <circle cx={C} cy={C - 146} r="7" strokeWidth="0.8" />
        </g>
      ))}
      <circle cx={C} cy={C} r={40} strokeWidth="1" />
      <circle cx={C} cy={C} r={26} strokeWidth="0.6" />
      <circle cx={C} cy={C} r={8} strokeWidth="0.8" />
    </motion.g>
  </svg>
);

export const VaultBackdrop: React.FC = () => {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 22, restDelta: 0.0005 });

  const wheel = useTransform(progress, [0, 1], [0, 300]);
  const flame = useTransform(progress, [0, 1], [0, 30]);
  const drift = useTransform(progress, [0, 1], ["0%", "-8%"]);
  const dial = useTransform(progress, [0, 1], [0, -90]);

  // On the home page the hero carries its own wheel; the kiln joins once the hero has gone
  const isHall = pathname === "/";
  const hallOpacity = useTransform(scrollY, [0, 700], [0, 1]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Security tint across the whole studio */}
      <div className="tint absolute inset-0 [--tint-color:var(--paper)] [--tint-a-opacity:0.03] [--tint-b-opacity:0.025]" />

      {/* Kiln glow from the right, and the studio's corners in shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_45%,rgba(210,105,60,0.09),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(3,3,3,0.7))]" />

      <motion.div style={{ opacity: isHall ? hallOpacity : 1 }} className="absolute inset-0">
        <motion.div
          style={reduce ? undefined : { y: drift }}
          className="absolute top-1/2 -translate-y-1/2 right-[-45vw] sm:right-[-26vw] lg:right-[-10vw] w-[120vw] sm:w-[88vw] lg:w-[min(62vw,60rem)] aspect-square text-terra/[0.26]"
        >
          <motion.div style={reduce ? undefined : { rotate: dial }} className="absolute inset-[24%]">
            <GuillocheRosette className="w-full h-full" />
          </motion.div>
          <KilnArt wheel={reduce ? 0 : wheel} flame={reduce ? 0 : flame} />
        </motion.div>
      </motion.div>

      {/* Fine grain, so the ink reads as printed rather than flat */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay vault-grain" />
    </div>
  );
};

export default VaultBackdrop;
