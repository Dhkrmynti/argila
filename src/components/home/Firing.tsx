"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";
import { KilnOrb } from "@/components/kiln/KilnOrb";
import { Reveal } from "@/components/kiln/Reveal";
import { HeatTitle } from "@/components/kiln/HeatTitle";

const STEPS = [
  {
    verb: "Set",
    title: "Put USDG in the kiln",
    body: "Approve once, then deposit any amount. The staking contract records it against your address.",
    heat: 0.4,
  },
  {
    verb: "Fire",
    title: "Earn every block",
    body: "ARGL accrues to your share of the kiln as each block lands. Nothing to restake, nothing to wait for.",
    heat: 0.7,
  },
  {
    verb: "Draw",
    title: "Claim when you like",
    body: "Send your accrued ARGL to your wallet at any moment. Your USDG stays in and keeps earning.",
    heat: 1,
  },
  {
    verb: "Unload",
    title: "Take it all back",
    body: "No lockup and no notice period. Withdraw part or all of your USDG; any unclaimed ARGL stays yours to claim.",
    heat: 0.55,
  },
];

/* How a firing works: four moves along the heat ramp, which fills as you scroll past. */
export const Firing: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="firing" ref={ref} className="relative scroll-mt-24 mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-12 gap-6 items-end">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow">How it works</p>
          <HeatTitle className="mt-4 font-display font-bold text-[2.6rem] sm:text-6xl tracking-[-0.04em] leading-[0.95] text-balance">
            One firing, <span className="text-heat">four moves.</span>
          </HeatTitle>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <p className="text-lg text-bone-2 leading-relaxed text-pretty">
            That&apos;s the whole protocol. No tiers, no vesting, no tricks: a contract that holds your USDG and pays ARGL for
            the time it spends inside.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-16">
        {/* The ramp the four moves sit on, filling as you scroll past */}
        <div className="h-1 rounded-full bg-coal-3 overflow-hidden mb-6">
          <motion.div style={{ width: reduce ? "100%" : fill }} className="h-full bg-heat rounded-full" />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.verb} delay={i * 0.08} className="surface p-6 sm:p-7 flex flex-col">
              <div className="flex items-center justify-between lg:justify-center lg:flex-col lg:gap-5">
                <KilnOrb heat={s.heat} simple className="w-[4.5rem]" />
                <span className="font-mono text-[12px] text-bone-3 lg:hidden">0{i + 1}</span>
              </div>
              <p className="mt-6 font-mono text-[12px] text-bone-3 hidden lg:block">0{i + 1}</p>
              <p className="mt-1 font-display font-bold text-3xl tracking-tight text-heat">{s.verb}</p>
              <p className="mt-2 font-medium text-bone">{s.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-bone-2">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Firing;
