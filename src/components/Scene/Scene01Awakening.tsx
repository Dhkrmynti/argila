"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Layer5Emblem } from "../Brand/Layer5Emblem";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Layers,
  Clock
} from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatApy } from "@/lib/utils/formatters";

export const Scene01Awakening: React.FC = () => {
  const { calculatedApy } = useLayer5Staking();
  const [calcAmount, setCalcAmount] = useState<number>(0);

  // Simulated live on-chain events
  const [events, setEvents] = useState<Array<{ id: number; type: string; user: string; amount: string; time: string }>>([]);

  // Quick yield math based on live APY
  const dailyKawa = calcAmount > 0 && calculatedApy ? ((calcAmount * (calculatedApy / 100)) / 365).toFixed(2) : "0.00";
  const monthlyKawa = calcAmount > 0 && calculatedApy ? ((calcAmount * (calculatedApy / 100)) / 12).toFixed(2) : "0.00";

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-12 px-4 sm:px-8 overflow-hidden">
      {/* 1. Live Protocol Marquee / Telemetry Ribbon */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="liquid-glass-pill rounded-full py-2 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono overflow-x-auto gap-6 whitespace-nowrap scrollbar-none shadow-lg">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] shadow-[0_0_8px_#c8f53c] animate-pulse" />
            <span className="text-[#8e95a2] uppercase">ROBINHOOD CHAIN MAINNET</span>
            <span className="text-neutral-400">•</span>
            <span className="text-white font-medium">SINGLE-SLOT FINALITY &lt;1s</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#8e95a2] uppercase">TVL:</span>
              <span className="text-[#c8f53c] font-semibold">$0.00 USDG</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8e95a2] uppercase">REWARD RATE:</span>
              <span className="text-white font-semibold">0.00% APY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8e95a2] uppercase">TOTAL DISTRIBUTED:</span>
              <span className="text-white font-semibold">0.00 ARGL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8e95a2] uppercase">GAS:</span>
              <span className="text-[#c8f53c] font-semibold">&lt;0.0001 ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Bento Hero Grid */}
      <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Core Value Proposition & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 liquid-glass-pill px-3.5 py-1 rounded-full text-[11px] font-mono tracking-[0.2em] text-[#c8f53c] uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> SYNTHETIX-GRADE O(1) STREAMING YIELD
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-light tracking-[0.04em] text-white uppercase font-sans leading-[1.08]">
              FLOW CAPITAL. <br />
              <span className="text-[#c8f53c] font-normal">STREAM YIELD.</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-xl">
              Deposit USDG to continuously accrue Argila (ARGL) token rewards every block on Robinhood Chain. 
              Zero lockup restrictions, instant liquidity withdrawal, and micro-cent gas fees.
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/stake">
              <LiquidButton size="xl" className="font-mono text-xs tracking-[0.2em] uppercase text-white shadow-2xl shadow-black/60 font-semibold px-8">
                <span className="flex items-center gap-2.5">
                  <span>ENTER STAKING APP</span>
                  <ArrowRight className="w-4 h-4 text-[#c8f53c]" />
                </span>
              </LiquidButton>
            </Link>
            <Link href="/protocol">
              <LiquidButton size="xl" className="font-mono text-xs tracking-[0.15em] uppercase text-neutral-200 hover:text-white shadow-xl shadow-black/40 px-6">
                <span>READ ARCHITECTURE</span>
              </LiquidButton>
            </Link>
          </div>

          {/* 4 Feature Badges in Liquid Glass */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
            <div className="liquid-glass-subcard p-3 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#8e95a2] uppercase block">ANNUAL YIELD</span>
              <span className="text-[#c8f53c] font-semibold text-sm">
                {calculatedApy && calculatedApy > 0 ? formatApy(calculatedApy) : "0.00% APY"}
              </span>
            </div>
            <div className="liquid-glass-subcard p-3 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#8e95a2] uppercase block">LOCKUP TIME</span>
              <span className="text-white font-medium text-sm">0 Seconds</span>
            </div>
            <div className="liquid-glass-subcard p-3 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#8e95a2] uppercase block">TRANSACTION GAS</span>
              <span className="text-white font-medium text-sm">&lt; $0.01 ETH</span>
            </div>
            <div className="liquid-glass-subcard p-3 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#8e95a2] uppercase block">SECURITY</span>
              <span className="text-[#c8f53c] font-semibold text-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Audited
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Quick Calculator & Live Activity Radar (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Yield Calculator Card */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#c8f53c]" />
                <span className="text-xs font-mono tracking-[0.2em] text-white uppercase font-semibold">
                  ESTIMATE YOUR YIELD
                </span>
              </div>
              <span className="liquid-glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#c8f53c]">
                {calculatedApy && calculatedApy > 0 ? formatApy(calculatedApy) : "0.00% APY"}
              </span>
            </div>

            {/* Amount input with preset buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8e95a2]">
                <span>DEPOSIT CAPITAL (USDG)</span>
                <span>BALANCE: 0.00</span>
              </div>
              <div className="liquid-glass-subcard rounded-2xl p-3 flex items-center justify-between border border-white/10">
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent font-mono text-2xl text-white outline-none font-bold"
                />
                <span className="font-mono text-xs text-[#c8f53c] px-3 py-1 rounded-full bg-[#c8f53c]/10 border border-[#c8f53c]/30 font-bold shrink-0">
                  USDG
                </span>
              </div>
            </div>

            {/* Projected returns grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="liquid-glass-subcard p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-[#8e95a2] uppercase block">DAILY ARGL</span>
                <span className="text-base font-semibold text-[#c8f53c]">+{dailyKawa}</span>
              </div>
              <div className="liquid-glass-subcard p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-[#8e95a2] uppercase block">MONTHLY ARGL</span>
                <span className="text-base font-semibold text-white">+{monthlyKawa}</span>
              </div>
            </div>

            <Link href="/stake" className="block w-full">
              <LiquidButton variant="kawa" size="lg" className="w-full font-mono text-xs uppercase tracking-[0.2em] font-semibold">
                <span className="flex items-center gap-2">
                  START STAKING NOW <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </LiquidButton>
            </Link>
          </div>

          {/* Live Activity Feed Radar */}
          <div className="liquid-glass-card rounded-3xl p-5 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#c8f53c]" />
                <span className="tracking-[0.15em] text-white uppercase font-medium text-[11px]">
                  ON-CHAIN PROTOCOL ACTIVITY
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">ROBINHOOD CHAIN</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {events.length > 0 ? (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2 rounded-xl liquid-glass-subcard text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#c8f53c]/20 text-[#c8f53c]">
                        {ev.type}
                      </span>
                      <span className="text-neutral-300">{ev.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{ev.amount}</span>
                      <span className="text-[#8e95a2] text-[10px]">{ev.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-neutral-500 text-[11px]">
                  No recent on-chain transactions detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quiet Scroll Prompt */}
      <div className="w-full max-w-7xl mx-auto pt-8 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
        <span>IMMUTABLE ARCHITECTURE • AUDITED CONTRACTS</span>
        <div className="flex items-center gap-2">
          <span>SCROLL FOR MECHANICS</span>
          <span className="text-[#c8f53c]">&darr;</span>
        </div>
      </div>
    </section>
  );
};

