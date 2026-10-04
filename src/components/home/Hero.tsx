"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useBlockNumber } from "wagmi";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";
import { ArrowRight } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import { FireCanvas } from "@/components/kiln/FireCanvas";
import { Embers } from "@/components/kiln/Embers";

const ease = [0.22, 1, 0.36, 1] as const;

const PULSE_INTERVAL_MS = 1500;
const CHIP_VISIBLE_MS = 2500;

/* One screen: a short headline at the top and the kiln's fire rising across the floor below it. */
export const Hero: React.FC = () => {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const kilnY = useTransform(scrollY, [0, 700], [0, 80]);
  const textY = useTransform(scrollY, [0, 700], [0, -50]);
  const textFade = useTransform(scrollY, [0, 450], [1, 0]);

  const { data: block } = useBlockNumber({ watch: true });
  const [pulseKey, setPulseKey] = useState(0);
  const [firedBlock, setFiredBlock] = useState<bigint | null>(null);
  const seenFirst = useRef(false);
  const lastPulseAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (block === undefined) return;
    if (!seenFirst.current) {
      seenFirst.current = true;
      return;
    }
    const now = performance.now();
    if (now - lastPulseAt.current < PULSE_INTERVAL_MS) return;
    lastPulseAt.current = now;
    setPulseKey((k) => k + 1);
    setFiredBlock(block);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setFiredBlock(null), CHIP_VISIBLE_MS);
  }, [block]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const rise = (i: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease, delay: 0.15 + i * 0.1 } };

  return (
    <section className="relative h-[100svh] min-h-[600px] max-h-[1100px] overflow-hidden">
      <Embers className="absolute inset-0 w-full h-full" density={4} />

      {/* The kiln's fire, spread across the floor: a soft static glow, with the living flames over it */}
      <motion.div
        style={reduce ? undefined : { y: kilnY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease, delay: 0.1 }}
        className="absolute inset-x-0 bottom-0 h-[64%]"
      >
        <div className="absolute inset-x-[-10%] bottom-[-30%] h-[110%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(242,140,56,0.35),rgba(142,45,18,0.15)_55%,transparent)]" />
        <FireCanvas className="absolute inset-0 w-full h-full" pulseKey={pulseKey} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {firedBlock !== null && (
            <motion.p
              key={firedBlock.toString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full bg-coal/60 backdrop-blur font-mono text-[11px] sm:text-[11.5px] tracking-[0.06em] text-bone-2 tnum"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-glow" aria-hidden="true" />
              Block #{firedBlock.toLocaleString("en-US")} fired
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textFade }}
        className="relative z-10 h-full flex flex-col items-center text-center px-5 pt-28 sm:pt-36"
      >
        <motion.p
          {...rise(0)}
          className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full border border-line-strong bg-coal/50 backdrop-blur font-mono text-[11px] sm:text-[11.5px] tracking-[0.06em] text-bone-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />
          LIVE ON ROBINHOOD CHAIN · {protocolConfig.chainId}
        </motion.p>

        <motion.h1
          {...rise(1)}
          className="mt-6 font-display font-bold tracking-[-0.045em] leading-[0.92] text-[3rem] min-[420px]:text-[3.5rem] sm:text-[5.25rem] lg:text-[6.25rem] text-balance"
        >
          Patience, <span className="text-heat">fired</span> into value.
        </motion.h1>

        <motion.p {...rise(2)} className="mt-5 text-[17px] sm:text-xl text-bone-2">
          Stake USDG. Earn ARGL every block.
        </motion.p>

        <motion.div {...rise(3)} className="mt-8 flex flex-col min-[420px]:flex-row gap-3">
          <Link href="/stake" className="btn btn-hot !h-14 !px-8 !text-[16px] group">
            Start firing
            <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="#firing" className="btn btn-ghost !h-14 !px-8 !text-[16px] bg-coal/40 backdrop-blur">
            How it works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
