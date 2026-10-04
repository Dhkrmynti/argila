"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KilnOrb } from "@/components/kiln/KilnOrb";
import { Reveal } from "@/components/kiln/Reveal";
import { STAGES } from "@/components/kiln/stages";

/*
 * The five firing stages, as an interactive scale. Picking a stage turns the
 * kiln up to match. The note under it says plainly that stages are a record
 * of time, not a multiplier.
 */
export const Stages: React.FC = () => {
  const [i, setI] = useState(2);
  const s = STAGES[i];

  return (
    <section className="relative mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="surface-hot overflow-hidden p-6 sm:p-12 lg:p-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow">Firing stages</p>
              <h2 className="mt-4 font-display font-bold text-[2.4rem] sm:text-5xl tracking-[-0.04em] leading-[0.98] text-balance">
                The longer it fires, the hotter it glows.
              </h2>
              <p className="mt-5 text-bone-2 text-lg leading-relaxed text-pretty">
                Your position moves through five stages as it stays in the kiln, read from the contract&apos;s staking
                duration. Watch it climb on your firing page.
              </p>
            </Reveal>

            <div role="tablist" aria-label="Firing stages" className="mt-9 grid grid-cols-5 gap-1.5 p-1.5 rounded-full bg-coal/70 border border-line">
              {STAGES.map((st, k) => (
                <button
                  key={st.key}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setI(k)}
                  className={`relative h-10 sm:h-11 rounded-full text-[12px] sm:text-[14px] font-medium transition-colors cursor-pointer ${
                    k === i ? "text-coal" : "text-bone-2 hover:text-bone"
                  }`}
                >
                  {k === i && (
                    <motion.span layoutId="stage-pill" className="absolute inset-0 rounded-full bg-heat" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
                  )}
                  <span className="relative">{st.name}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-7 grid grid-cols-2 gap-4"
              >
                <div>
                  <p className="eyebrow">Time in the kiln</p>
                  <p className="mt-1.5 font-display text-2xl font-semibold">{s.window}</p>
                </div>
                <div>
                  <p className="eyebrow">Like a kiln at</p>
                  <p className="mt-1.5 font-display text-2xl font-semibold text-glow tnum">{s.temp}</p>
                </div>
                <p className="col-span-2 text-bone-2 leading-relaxed">{s.line}</p>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 pt-6 border-t border-line text-[13.5px] text-bone-3 leading-relaxed">
              Stages are a record of time, not a bonus. Every staker earns ARGL at the same rate per USDG, whatever the stage.
            </p>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <div className="relative w-[78%] sm:w-[60%] lg:w-[88%]">
              <motion.div animate={{ scale: 0.8 + s.heat * 0.2 }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
                <KilnOrb heat={s.heat} />
              </motion.div>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={s.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                    className={`font-display font-bold tracking-tight text-3xl sm:text-5xl ${s.heat > 0.5 ? "text-coal/85" : "text-bone"}`}
                  >
                    {s.name}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stages;
