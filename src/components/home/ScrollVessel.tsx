"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";
import { VESSEL } from "@/components/kiln/Logo";
import { STAGES } from "@/components/kiln/stages";
import { HeatTitle } from "@/components/kiln/HeatTitle";
import { Stages } from "./Stages";

/*
 * Pinned scroll moment: one vessel, five stages. Scroll progress 0..1 is split
 * into five equal segments (one per stage) and drives the vessel's finish from
 * raw clay to porcelain. Under reduced motion the static stage scale is shown.
 */

const STAGE_COUNT = STAGES.length;

export const ScrollVessel: React.FC = () => {
  const reduce = useReducedMotionSafe();
  const sectionRef = React.useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress: raw } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(raw, { stiffness: 140, damping: 32, mass: 0.4 });

  useMotionValueEvent(raw, "change", (v) => {
    setActive(Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(v * STAGE_COUNT))));
  });

  const bodyFill = useTransform(p, [0, 0.2, 0.4, 0.6, 1], ["#6B5E55", "#7A6154", "#C98F68", "#D9A27A", "#D9A27A"]);
  const grainOpacity = useTransform(p, [0.15, 0.5], [0.35, 0.05]);
  const fireGlow = useTransform(p, [0.1, 0.3, 0.85, 1], [0, 0.9, 0.9, 0.35]);
  const glazeOpacity = useTransform(p, [0.5, 0.72, 0.8, 0.95], [0, 1, 1, 0.55]);
  const porcelainOpacity = useTransform(p, [0.7, 0.95], [0, 1]);
  const sheenX = useTransform(p, [0.5, 0.9], [-60, 90]);
  const sheenOpacity = useTransform(p, [0.5, 0.6, 0.8, 0.92], [0, 0.6, 0.6, 0.2]);
  const barScale = p;

  if (reduce) return <Stages />;

  return (
    <section ref={sectionRef} className="relative h-[180svh] sm:h-[250svh]" aria-label="Firing stages">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto max-w-6xl h-full px-5 sm:px-8 pt-24 pb-8 grid lg:grid-cols-12 gap-4 lg:gap-12 items-center grid-rows-[minmax(0,1fr)_auto] lg:grid-rows-1">
          <div className="lg:col-span-6 relative flex items-center justify-center h-full min-h-0">
            <motion.div
              style={{ opacity: fireGlow }}
              className="absolute inset-x-[5%] bottom-[2%] h-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(242,140,56,0.55),rgba(142,45,18,0.2)_60%,transparent)]"
              aria-hidden="true"
            />
            <svg viewBox="0 0 100 100" className="relative h-full max-h-[70svh] w-auto" role="img" aria-label="A vessel being fired from clay to porcelain">
              <defs>
                <clipPath id="sv-clip">
                  <path d={VESSEL} />
                </clipPath>
                <linearGradient id="sv-glaze" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F28C38" />
                  <stop offset="0.5" stopColor="#D9622B" />
                  <stop offset="1" stopColor="#8E2D12" />
                </linearGradient>
                <linearGradient id="sv-porcelain" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#D9622B" />
                  <stop offset="0.6" stopColor="#F28C38" />
                  <stop offset="1" stopColor="#FFC56E" />
                </linearGradient>
                <mask id="sv-bands">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="10" y="50" width="80" height="4.5" fill="#000" />
                  <rect x="10" y="62" width="80" height="4.5" fill="#000" />
                </mask>
                <linearGradient id="sv-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <filter id="sv-grain" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
                  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.35" result="speckle" />
                  <feComposite in="speckle" in2="SourceGraphic" operator="in" />
                </filter>
              </defs>

              <motion.path d={VESSEL} style={{ fill: bodyFill }} />
              <motion.path d={VESSEL} fill="#000" filter="url(#sv-grain)" style={{ opacity: grainOpacity }} />
              <motion.path d={VESSEL} fill="url(#sv-glaze)" style={{ opacity: glazeOpacity }} />
              <motion.path d={VESSEL} fill="url(#sv-porcelain)" mask="url(#sv-bands)" style={{ opacity: porcelainOpacity }} />
              <g clipPath="url(#sv-clip)">
                <g transform="skewX(-14)">
                  <motion.rect x={0} y={0} width={28} height={100} fill="url(#sv-sheen)" style={{ x: sheenX, opacity: sheenOpacity }} />
                </g>
              </g>
            </svg>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow">Firing stages</p>
            <HeatTitle className="mt-3 font-display font-bold text-[2rem] sm:text-5xl tracking-[-0.04em] leading-[0.98] text-balance">
              The longer it fires, the hotter it glows.
            </HeatTitle>

            <ol className="mt-5 lg:mt-8 grid grid-cols-5 lg:grid-cols-1 gap-1.5 lg:gap-2">
              {STAGES.map((st, k) => (
                <li
                  key={st.key}
                  aria-current={k === active ? "step" : undefined}
                  className={`rounded-2xl lg:rounded-full px-2 lg:px-5 py-2 lg:py-3 transition-colors duration-300 ${
                    k === active ? "bg-coal-3 text-bone" : "text-bone-3"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-0.5">
                    <span className="font-display font-semibold text-[12px] sm:text-[14px] lg:text-xl text-center lg:text-left">{st.name}</span>
                    <span className="hidden lg:block eyebrow">{st.window}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 lg:mt-6 relative h-[4.5rem] lg:h-20" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={STAGES[active].key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 text-bone-2 text-[14px] lg:text-[16px] leading-relaxed"
                >
                  <span className="eyebrow mr-2">{STAGES[active].window}</span>
                  {STAGES[active].line}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-5 lg:mt-8 h-1 rounded-full bg-coal-4 overflow-hidden" aria-hidden="true">
              <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-heat" />
            </div>

            <p className="mt-4 text-[12.5px] lg:text-[13.5px] text-bone-3 leading-relaxed">
              Stages are a record of time, not a bonus. Every staker earns ARGL at the same rate per USDG, whatever the stage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollVessel;
