"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Lock, Sparkles, Activity } from "lucide-react";

export const Scene02ProtocolIntro: React.FC = () => {
  const tenets = [
    {
      index: "01",
      icon: Lock,
      title: "ZERO LOCKUPS",
      subtitle: "Unrestricted Capital Mobility",
      desc: "Traditional staking traps liquidity in multi-week unbonding epochs. Argila eliminates cooldown periods: deposit or withdraw your USDG principal at any second.",
    },
    {
      index: "02",
      icon: Cpu,
      title: "O(1) ACCOUNTING",
      subtitle: "Synthetix Constant-Time Scale",
      desc: "Algorithmically tracks global reward indices rather than iterating over stakers. Gas fees remain constant regardless of whether 10 or 1,000,000 users are in the pool.",
    },
    {
      index: "03",
      icon: Activity,
      title: "BLOCK ACCRUAL",
      subtitle: "Streaming Yield Mechanics",
      desc: "Rewards do not wait for epoch boundaries. Every confirmed block on Robinhood Chain streams newly minted Argila (ARGL) tokens straight into your balance.",
    },
  ];

  return (
    <section
      id="protocol"
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#c8f53c]/[0.03] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c8f53c] uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-cursive text-[#c8f53c] text-base lowercase tracking-normal">
              ~ continuous liquid mechanics ~
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-editorial text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.9]"
          >
            CAPITAL THAT
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8f53c] to-white">KEEPS</span> MOVING.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg font-light text-[#8e95a2] max-w-2xl leading-relaxed font-sans"
          >
            In Japanese, <strong className="text-white font-normal">川 (Kawa)</strong> represents a river—an unbroken, continuous flow of energy.
            We replaced static lockups and friction with continuous algorithmic yield streams native to Robinhood Chain.
          </motion.p>
        </div>

        {/* 3 Editorial Architecture Pillars in 3-Tier Layered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {tenets.map((tenet, i) => {
            const IconComponent = tenet.icon;
            return (
              <motion.div
                key={tenet.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="sg-tier-container group"
              >
                <div className="sg-tier-underlay-1" />
                <div className="sg-tier-underlay-2" />
                <div className="sg-tier-main p-8 flex flex-col justify-between space-y-8 h-full">
                  {/* Top Badge & Index */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#c8f53c] font-bold tracking-widest">
                      {tenet.index}
                    </span>
                    <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#c8f53c]/40 transition duration-300">
                      <IconComponent className="w-5 h-5 text-[#c8f53c]" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3">
                    <h3 className="font-editorial text-2xl font-bold uppercase tracking-tight text-white group-hover:text-[#c8f53c] transition duration-300">
                      {tenet.title}
                    </h3>
                    <div className="text-[11px] font-mono tracking-wider text-[#8e95a2] uppercase">
                      {tenet.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm font-sans text-neutral-300 leading-relaxed pt-1">
                      {tenet.desc}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#8e95a2]">
                    <span>ROBINHOOD L2</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-[#c8f53c] transition" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Scene02ProtocolIntro;
