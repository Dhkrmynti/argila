"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ArrowDownRight, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";
import { Layer5Emblem } from "../Brand/Layer5Emblem";

export const Scene01Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-6 sm:px-12 pt-32 pb-16 overflow-hidden text-center select-none"
    >
      {/* Sterling Gate Ambient Background Reactive Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#c8f53c]/[0.08] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-12 right-12 w-[450px] h-[350px] bg-indigo-500/[0.06] blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Sterling Gate Ambient Reactive SVG Shapes Behind Hero */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-40 overflow-hidden">
        <svg className="absolute w-[600px] h-[600px] -top-20 -left-20" viewBox="0 0 400 400" fill="none">
          <circle cx="90" cy="110" r="85" fill="rgba(200,245,60,0.06)" />
          <circle cx="310" cy="190" r="120" fill="rgba(99,102,241,0.05)" />
        </svg>
        <svg className="absolute w-[800px] h-[800px] -bottom-40 -right-40" viewBox="0 0 400 400" fill="none">
          <line x1="0" y1="90" x2="310" y2="400" stroke="rgba(200,245,60,0.08)" strokeWidth="32" />
          <line x1="90" y1="0" x2="390" y2="300" stroke="rgba(99,102,241,0.06)" strokeWidth="24" />
        </svg>
      </div>

      {/* Monumental Central Editorial Typography */}
      <div className="max-w-6xl mx-auto space-y-8 my-auto py-12">
        {/* Hero Title with Sterling Gate Giant Editorial Syne Type */}
        <div className="space-y-4">

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.9]"
          >
            FLOW CAPITAL.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c8f53c] to-white">
              STREAM YIELD.
            </span>
          </motion.h1>
        </div>

        {/* Subtitle with Cursive Callout Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto space-y-3"
        >
          <p className="text-sm sm:text-base md:text-lg font-light text-[#a3abb8] leading-relaxed font-sans">
            Deposit USDG to continuously stream cryptographic Argila (ARGL) yield per block.
            Zero lockup epochs. Sub-second Robinhood Chain finality. Complete non-custodial sovereignty.
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="font-cursive text-xl sm:text-2xl text-[#c8f53c] rotate-[-2deg]">
              ~ autonomous reward accumulation ~
            </span>
          </div>
        </motion.div>

        {/* Action Triggers with Kinetic Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 pt-3"
        >
          <LiquidButton
            size="xl"
            variant="kawa"
            href="/stake"
            className="px-9 font-mono text-xs tracking-[0.2em] uppercase font-bold shadow-2xl shadow-[#c8f53c]/30 group"
          >
            <span className="flex items-center gap-3">
              <span className="sg-roll-up">
                <span className="sg-roll-up-text">START STAKING</span>
              </span>
              <ArrowDownRight className="w-4 h-4 text-[#c8f53c] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </span>
          </LiquidButton>

          <LiquidButton
            size="xl"
            variant="default"
            href="/position"
            className="px-9 font-mono text-xs tracking-[0.18em] uppercase text-neutral-300 hover:text-white"
          >
            <span>VIEW POSITION</span>
          </LiquidButton>
        </motion.div>
      </div>

      {/* Bottom Minimal Specs Telemetry Ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/[0.08] text-left font-mono"
      >
        <div className="space-y-1 p-3 rounded-2xl liquid-glass-subcard border border-white/5">
          <span className="text-[10px] text-[#8e95a2] uppercase tracking-wider block flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#c8f53c]" /> 01 // ENGINE
          </span>
          <span className="text-white text-xs font-semibold">Synthetix O(1)</span>
        </div>

        <div className="space-y-1 p-3 rounded-2xl liquid-glass-subcard border border-white/5">
          <span className="text-[10px] text-[#8e95a2] uppercase tracking-wider block flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#c8f53c]" /> 02 // LOCKUP
          </span>
          <span className="text-white text-xs font-semibold">0 Sec (Instant)</span>
        </div>

        <div className="space-y-1 p-3 rounded-2xl liquid-glass-subcard border border-white/5">
          <span className="text-[10px] text-[#8e95a2] uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#c8f53c]" /> 03 // SECURITY
          </span>
          <span className="text-[#c8f53c] text-xs font-semibold">Audited Non-Custodial</span>
        </div>

        <div className="space-y-1 p-3 rounded-2xl liquid-glass-subcard border border-white/5">
          <span className="text-[10px] text-[#8e95a2] uppercase tracking-wider block">
            04 // SETTLEMENT
          </span>
          <span className="text-white text-xs font-semibold">&lt; $0.0001 Gas</span>
        </div>
      </motion.div>
    </section>
  );
};
export default Scene01Hero;
