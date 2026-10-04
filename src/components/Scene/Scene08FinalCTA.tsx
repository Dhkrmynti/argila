"use client";

import React from "react";
import { motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Layer5Emblem } from "../Brand/Layer5Emblem";
import { ArrowDownRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const Scene08FinalCTA: React.FC = () => {
  return (
    <section
      id="final-cta"
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-6 sm:px-12 lg:px-20 pt-32 pb-16 overflow-hidden text-center border-t border-white/[0.05]"
    >
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c8f53c]/[0.05] blur-[170px] rounded-full pointer-events-none -z-10" />

      <div />

      {/* Main Monumental CTA Block */}
      <div className="max-w-4xl mx-auto space-y-10 my-auto py-12">


        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-[#c8f53c] uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-cursive text-[#c8f53c] text-base lowercase tracking-normal">
              ~ launch session ~
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.95]"
          >
            READY TO PUT YOUR
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c8f53c] to-white">
              CAPITAL TO WORK?
            </span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base text-[#a3abb8] max-w-xl mx-auto leading-relaxed font-sans"
        >
          Deposit USDG and begin generating Argila (ARGL) yield on Robinhood Chain in under 60 seconds. Zero lockup restrictions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <LiquidButton
            size="xl"
            variant="kawa"
            href="/stake"
            className="px-9 font-mono text-xs tracking-[0.2em] uppercase font-bold shadow-2xl shadow-[#c8f53c]/25 group"
          >
            <span className="flex items-center gap-2.5">
              <span>ENTER STAKING TERMINAL</span>
              <ArrowDownRight className="w-4 h-4 text-[#08090c] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </span>
          </LiquidButton>

          <LiquidButton
            size="xl"
            variant="default"
            href="/stats"
            className="px-9 font-mono text-xs tracking-[0.18em] uppercase text-neutral-300 hover:text-white"
          >
            <span>VIEW PROTOCOL STATS</span>
          </LiquidButton>
        </motion.div>
      </div>

      {/* Colophon */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06] text-xs font-mono text-[#8e95a2]">
        <div className="flex items-center gap-2">
          <Layer5Emblem size={16} variant="white" animate={false} />
          <span className="text-white font-medium">LAYER5 PROTOCOL</span>
          <span>•</span>
          <span>ROBINHOOD CHAIN</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/stake" className="hover:text-[#c8f53c] transition">
            Stake
          </Link>
          <Link href="/position" className="hover:text-[#c8f53c] transition">
            Position
          </Link>
          <Link href="/stats" className="hover:text-[#c8f53c] transition">
            Stats
          </Link>
          <a
            href="https://x.com/argilaxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c8f53c] transition"
          >
            X (@argilaxyz)
          </a>
        </div>

        <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
          &copy; 2026 ARGILA • IMMUTABLE
        </div>
      </div>
    </section>
  );
};
export default Scene08FinalCTA;
