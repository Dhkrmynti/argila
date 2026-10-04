"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { GuillocheRosette } from "@/components/vault/Guilloche";

/*
 * The two materials, pressed as tiles. Each one tilts under the pointer
 * like paper held up to the light, and its rosette turns with the tilt.
 */

const NOTES = [
  {
    name: "USDG",
    role: "The clay you set",
    body: "The dollar-pegged stablecoin on Robinhood Chain. It is the principal you set in the kiln and the exact amount you take back out.",
    facts: ["Principal returned 1:1", "No deposit or withdrawal fee", "6 decimals"],
    tone: "paper" as const,
    serial: "USDG 4663 000001",
  },
  {
    name: "ARGL",
    role: "What the fire yields",
    body: "The reward token the kiln pays to every depositor, in proportion to their share, with every block. Claim it to your wallet at any time.",
    facts: ["Accrues per block", "No vesting, no lockup", "18 decimals"],
    tone: "ink" as const,
    serial: "ARGL 4663 000002",
  },
];

const Note: React.FC<(typeof NOTES)[number] & { index: number }> = ({ name, role, body, facts, tone, serial, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const dial = useTransform(sx, [0, 1], [-25, 25]);
  const sheenX = useTransform(sx, [0, 1], ["-30%", "130%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const isPaper = tone === "paper";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 60, rotate: index === 0 ? -3 : 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      style={{ perspective: 1200 }}
    >
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative overflow-hidden frame-double ${
          isPaper ? "paper tint on-paper" : "bg-ink-2 text-paper tint [--tint-color:var(--terra)] border border-terra/30 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
        }`}
      >
        <motion.div
          style={{ rotate: dial }}
          className={`pointer-events-none absolute -right-24 -bottom-24 w-80 h-80 ${isPaper ? "text-ink/35" : "text-terra/45"}`}
          aria-hidden="true"
        >
          <GuillocheRosette className="w-full h-full" />
        </motion.div>
        {/* Light raking across the paper */}
        <motion.div
          style={{ left: sheenX }}
          className="pointer-events-none absolute -top-1/2 h-[200%] w-24 -translate-x-1/2 rotate-12 bg-white/10 blur-2xl mix-blend-overlay"
          aria-hidden="true"
        />

        <div className="relative p-7 sm:p-10 min-h-[22rem] flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <p className={`font-mono text-[11px] ${isPaper ? "text-ink/60" : "text-paper-faint"}`}>{role}</p>
            <p className={`font-mono text-[11px] tnum ${isPaper ? "text-cobalt-deep" : "text-cobalt-hi"}`}>{serial}</p>
          </div>
          <h3 className="mt-6 font-display font-extrabold text-6xl sm:text-7xl leading-none">{name}</h3>
          <p className={`mt-5 text-[17px] leading-relaxed max-w-[30rem] ${isPaper ? "text-ink/75" : "text-paper-dim"}`}>{body}</p>
          <ul className={`mt-auto pt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] wide font-medium ${isPaper ? "text-ink" : "text-paper"}`}>
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${isPaper ? "bg-cobalt-deep" : "bg-terra-hi"}`} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </motion.div>
  );
};

export const NotesSection: React.FC = () => (
  <section data-recede className="relative bg-ink-3/75 text-paper py-24 sm:py-32 lg:py-40 overflow-hidden">
    <div data-reveal="band" className="band-wave absolute top-0 inset-x-0 text-terra/30" aria-hidden="true" />
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <h2 data-reveal="lines" className="lg:col-span-7 font-display font-extrabold text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[0.98] text-balance">
          Clay in, fire out.
        </h2>
        <p className="lg:col-span-4 lg:col-start-9 text-lg leading-relaxed text-paper-dim">
          You set USDG in the kiln and draw ARGL from it. That is the whole arrangement.
        </p>
      </div>
      <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {NOTES.map((n, i) => (
          <Note key={n.name} {...n} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default NotesSection;
