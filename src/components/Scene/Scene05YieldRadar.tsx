"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatTokenAmount, formatApy } from "@/lib/utils/formatters";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import {
  Sparkles,
  TrendingUp,
  Coins,
  Activity,
  Zap,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export const Scene05YieldRadar: React.FC = () => {
  const {
    isConnected,
    stakedBalance,
    pendingRewards,
    calculatedApy,
    stakeDecimals,
    claim,
    txState,
  } = useLayer5Staking();

  const [tickerOffset, setTickerOffset] = useState(0);

  // Micro continuous ticking animation for pending rewards
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setTickerOffset((prev) => prev + 0.00010);
    }, 200);
    return () => clearInterval(interval);
  }, [isConnected]);

  const rawPendingNum = parseFloat(formatTokenAmount(pendingRewards, 18, 5));
  const liveRewardsFormatted = isConnected
    ? (rawPendingNum + tickerOffset).toFixed(5)
    : "0.00000";

  const stakedFormatted = isConnected
    ? `${formatTokenAmount(stakedBalance, stakeDecimals, 2)} USDG`
    : "0.00 USDG";

  const apyNumber = calculatedApy ?? 0;
  const apyDisplay = formatApy(apyNumber);

  // Projected rewards based on staked principal
  const stakedNum = parseFloat(formatTokenAmount(stakedBalance, stakeDecimals, 2)) || 0;
  const apyFraction = apyNumber / 100;
  const dailyReturn = ((stakedNum * apyFraction) / 365).toFixed(2);
  const monthlyReturn = ((stakedNum * apyFraction) / 12).toFixed(1);
  const yearlyReturn = (stakedNum * apyFraction).toFixed(0);

  const isBusy = txState.step === "CONFIRMING" || txState.step === "PENDING";

  return (
    <section
      id="yield"
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 overflow-hidden border-t border-white/[0.05]"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12">
        {/* Title */}
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.95]">
            DYNAMIC <span className="text-[#c8f53c]">REWARD STREAM</span>
          </h2>
          <p className="text-sm sm:text-base text-[#a3abb8] max-w-xl font-sans leading-relaxed">
            Real-time telemetry of your streaming position on Robinhood Chain. Compound or exit at any moment.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Big Telemetry Tile (7 cols) */}
          <div className="lg:col-span-7">
            <div className="sg-tier-container h-full">
              <div className="sg-tier-underlay-1" />
              <div className="sg-tier-underlay-2" />
              <div className="sg-tier-main p-8 sm:p-10 space-y-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
                  <span className="text-[#8e95a2] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#c8f53c]" /> CURRENT EMISSION APY
                  </span>
                  <span className="text-[#c8f53c] px-3 py-1 rounded-full bg-[#c8f53c]/10 border border-[#c8f53c]/30 font-bold">
                    SYNTHETIX O(1)
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#c8f53c] tracking-tight leading-none">
                    {apyDisplay}
                  </div>
                  <div className="text-sm font-mono text-neutral-300 flex items-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-ping" />
                    <span>Streaming rewards per block on Robinhood Chain</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 font-mono text-xs">
                  <div className="p-3.5 rounded-xl liquid-glass-subcard border border-white/5">
                    <span className="text-[10px] text-[#8e95a2] uppercase block">DAILY EST.</span>
                    <span className="text-white font-bold text-sm">+{dailyReturn} ARGL</span>
                  </div>
                  <div className="p-3.5 rounded-xl liquid-glass-subcard border border-white/5">
                    <span className="text-[10px] text-[#8e95a2] uppercase block">MONTHLY</span>
                    <span className="text-white font-bold text-sm">+{monthlyReturn} ARGL</span>
                  </div>
                  <div className="p-3.5 rounded-xl liquid-glass-subcard border border-white/5">
                    <span className="text-[10px] text-[#8e95a2] uppercase block">1 YEAR</span>
                    <span className="text-[#c8f53c] font-bold text-sm">+{yearlyReturn} ARGL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Position Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="liquid-glass-card rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                <span className="text-[#8e95a2] uppercase tracking-wider">YOUR STREAMING REWARDS</span>
                <span className="text-[#c8f53c] font-mono">{isConnected ? "ACTIVE" : "DISCONNECTED"}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8e95a2] block">
                  PENDING HARVEST
                </span>
                <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#c8f53c] tracking-tight">
                  {liveRewardsFormatted}
                </div>
                <span className="text-xs font-mono text-neutral-400 block pt-1">
                  ARGL accrued continuously
                </span>
              </div>

              <div className="p-4 rounded-xl liquid-glass-subcard border border-white/5 text-xs font-mono space-y-1">
                <span className="text-[#8e95a2] uppercase text-[10px] block">PRINCIPAL DEPOSIT</span>
                <span className="text-white font-bold text-base">{stakedFormatted}</span>
              </div>

              <div className="pt-2">
                <LiquidButton
                  size="xl"
                  variant="kawa"
                  href="/stake"
                  className="w-full font-mono text-xs uppercase tracking-widest font-bold"
                >
                  <span>GO TO STAKING TERMINAL</span>
                </LiquidButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Scene05YieldRadar;
