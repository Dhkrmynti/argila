"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Coins, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

export const Scene03HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "usdg",
      title: "USDG DEPOSIT",
      stage: "STAGE 01",
      icon: "/usdg-icon.png",
      tagline: "Native Stablecoin Principal",
      description:
        "Commit USDG into the non-custodial smart contract via standard ERC-20 approval. Your principal remains 100% backed and immune to market volatility.",
      metrics: [
        { label: "ASSET", value: "USDG (Stable)" },
        { label: "LOCKUP", value: "0 Seconds" },
        { label: "FEES", value: "< $0.0001 Gas" },
      ],
    },
    {
      id: "flow",
      title: "ALGORITHMIC STREAM",
      stage: "STAGE 02",
      iconLucide: RefreshCw,
      tagline: "Synthetix Constant-Time O(1)",
      description:
        "Your stake immediately captures an on-chain global index snapshot. The algorithm computes continuous reward allocations per second without looping across user tables.",
      metrics: [
        { label: "COMPLEXITY", value: "O(1) Constant" },
        { label: "EMISSION", value: "Dynamic Stream" },
        { label: "SLASHING", value: "0.00% Protected" },
      ],
    },
    {
      id: "grow",
      title: "RESONANCE & GROWTH",
      stage: "STAGE 03",
      iconLucide: TrendingUp,
      tagline: "Dynamic Living State",
      description:
        "As your staked duration advances through epochs, your position transitions from Dormant to Activated, Growing, Mature, and Awakened, maximizing protocol equilibrium.",
      metrics: [
        { label: "DURATION", value: "Block-by-Block" },
        { label: "COMPOUNDING", value: "Continuous" },
        { label: "SECURITY", value: "Non-reentrant" },
      ],
    },
    {
      id: "reward",
      title: "ARGL HARVEST",
      stage: "STAGE 04",
      iconLucide: Coins,
      tagline: "Instantaneous Non-Custodial Yield",
      description:
        "Harvest accumulated Argila (ARGL) rewards directly into your wallet whenever you desire. Or withdraw your full USDG principal at any moment with single-slot finality.",
      metrics: [
        { label: "REWARD ASSET", value: "Argila (ARGL) Token" },
        { label: "FINALITY", value: "< 1000ms" },
        { label: "SETTLEMENT", value: "Instant Exit" },
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 overflow-hidden border-t border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c8f53c] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-cursive text-[#c8f53c] text-base lowercase tracking-normal">
              ~ 4-step stream ~
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.9]">
            THE CAPITAL <span className="text-[#c8f53c]">PIPELINE</span>
          </h2>

          <p className="text-sm sm:text-base font-light text-[#8e95a2] font-sans">
            Explore the 4-phase non-custodial capital stream from deposit to harvest. Click each stage to inspect mechanics.
          </p>
        </div>

        {/* Step Selector Pipeline Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-2xl p-4 text-left transition-all duration-300 font-mono ${
                  isActive
                    ? "bg-[#181c28] border border-[#c8f53c]/50 text-white shadow-lg shadow-[#c8f53c]/10"
                    : "bg-[#0e1017] border border-white/8 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="text-[10px] tracking-widest text-[#8e95a2] block mb-1">
                  {step.stage}
                </div>
                <div className={`text-xs sm:text-sm font-bold ${isActive ? "text-[#c8f53c]" : "text-white"}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail in 3-Tier Layered Container */}
        <div className="sg-tier-container">
          <div className="sg-tier-underlay-1" />
          <div className="sg-tier-underlay-2" />
          <div className="sg-tier-main p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[activeStep].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c8f53c]">
                    <span>{steps[activeStep].stage}</span>
                    <span>•</span>
                    <span>{steps[activeStep].tagline}</span>
                  </div>

                  <h3 className="font-editorial text-3xl sm:text-5xl font-extrabold uppercase text-white">
                    {steps[activeStep].title}
                  </h3>

                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="lg:col-span-4 space-y-3 font-mono">
                  {steps[activeStep].metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3.5 rounded-xl bg-[#141722] border border-white/6 flex items-center justify-between text-xs"
                    >
                      <span className="text-[#8e95a2]">{m.label}</span>
                      <span className="text-[#c8f53c] font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Scene03HowItWorks;
