"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layer5Emblem } from "../Brand/Layer5Emblem";

export const Scene05TheEnd: React.FC = () => {
  return (
    <section
      id="the-end"
      className="relative w-full min-h-screen flex flex-col items-center justify-between px-6 pt-24 pb-12 text-center overflow-hidden"
    >
      <div />

      {/* Main Cinematic Ending Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-8"
      >
        <div className="py-4">
          <Layer5Emblem size={96} variant="white" animate={false} />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-light tracking-[0.25em] text-white uppercase font-sans">
            LAYER5
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#8e95a2] uppercase leading-relaxed max-w-md mx-auto">
            THE RIVER DOES NOT RUSH TO THE SEA;
            <br />
            <span className="text-[#c8f53c] font-medium">IT IS ALREADY THERE.</span>
          </p>
        </div>

        <div className="w-16 h-[1px] bg-white/20 my-4" />

        <div className="space-y-2 text-[11px] font-mono tracking-[0.2em] text-[#8e95a2] uppercase">
          <p>STAKING ON ROBINHOOD CHAIN</p>
          <p className="text-[10px] text-neutral-500">ACCESS FULL PROTOCOL ACTIONS IN THE TOP NAVIGATION</p>
        </div>
      </motion.div>

      {/* Minimal Editorial Colophon */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase gap-4">
        <span>&copy; 2026 ARGL PROTOCOL</span>
        <a
          href="https://x.com/argilaxyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-neutral-400 hover:text-[#c8f53c] transition lowercase font-mono text-xs tracking-wider"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>@argilaxyz</span>
        </a>
        <span>ROBINHOOD CHAIN MAINNET</span>
        <span className="text-[#c8f53c]">IMMUTABLE • VERIFIED</span>
      </footer>
    </section>
  );
};
