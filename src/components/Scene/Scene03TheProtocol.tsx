"use client";

import React from "react";
import { motion } from "framer-motion";

export const Scene03TheProtocol: React.FC = () => {
  const points = [
    {
      num: "01",
      title: "STAKE USDG",
      description: "Users deposit USDG directly into the immutable Argila staking smart contract.",
    },
    {
      num: "02",
      title: "REMAIN IN FLOW",
      description: "The protocol algorithmically calculates Argila (ARGL) rewards per second using standard Synthetix-grade accounting.",
    },
    {
      num: "03",
      title: "CLAIM ARGL",
      description: "Yield compounds continuously every block. Harvest Argila (ARGL) rewards or exit USDG whenever you choose.",
    },
  ];

  return (
    <section id="the-protocol" className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-12"
      >
        {/* Title Header */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-light tracking-[0.1em] text-white uppercase font-sans">
            THE ARGL <span className="text-[#c8f53c] font-normal">PROTOCOL</span>
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-[0.05em] text-[#8e95a2] max-w-md mx-auto pt-1">
            Stake USDG. Remain in the flow. Earn Argila (ARGL) rewards over time.
          </p>
        </div>

        {/* Liquid Glass Protocol Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {points.map((point) => (
            <motion.div
              key={point.num}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="liquid-glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="liquid-glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#c8f53c] font-bold">
                  {point.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#c8f53c]/40 group-hover:bg-[#c8f53c] group-hover:shadow-[0_0_8px_#c8f53c] transition duration-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-mono font-medium tracking-[0.15em] text-white uppercase group-hover:text-[#c8f53c] transition duration-200">
                  {point.title}
                </h3>
                <p className="text-xs text-[#8e95a2] font-sans leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
