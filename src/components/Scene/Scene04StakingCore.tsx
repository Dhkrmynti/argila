"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatTokenAmount, formatApy } from "@/lib/utils/formatters";
import { parseUnits } from "viem";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { TransactionModal } from "@/components/Transaction/TransactionModal";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";
import { WrongNetworkBanner } from "@/components/Wallet/WrongNetworkBanner";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";

export const Scene04StakingCore: React.FC = () => {
  const {
    isConnected,
    isWrongNetwork,
    switchToRobinhood,
    txState,
    resetTxState,
    stakeDecimals,
    stakedBalance,
    tokenBalance,
    allowance,
    calculatedApy,
    stake,
    unstake,
  } = useLayer5Staking();

  const [activeMode, setActiveMode] = useState<"stake" | "unstake">("stake");
  const [amount, setAmount] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Maximum balances
  const maxBalance = activeMode === "stake" ? tokenBalance : stakedBalance;
  const maxBalanceFormatted = formatTokenAmount(maxBalance, stakeDecimals, 4);

  const handlePercentage = (pct: number) => {
    if (!maxBalance || maxBalance <= 0n) {
      setAmount("0");
      return;
    }
    if (pct === 100) {
      setAmount(formatTokenAmount(maxBalance, stakeDecimals, 4));
      return;
    }
    const val = (Number(formatTokenAmount(maxBalance, stakeDecimals, 6)) * pct) / 100;
    setAmount(val.toFixed(2));
  };

  // Real reward calculations
  const parsedAmount = parseFloat(amount) || 0;
  const apyRate = (calculatedApy ?? 0) / 100;
  const estDaily = ((parsedAmount * apyRate) / 365).toFixed(2);
  const estMonthly = ((parsedAmount * apyRate) / 12).toFixed(1);
  const estYearly = (parsedAmount * apyRate).toFixed(0);

  // Check if allowance is needed for display label
  let needsApproval = false;
  if (activeMode === "stake" && isConnected && parsedAmount > 0) {
    try {
      const amountWei = parseUnits(amount, stakeDecimals);
      const currentAllowance = allowance ? BigInt(allowance.toString()) : 0n;
      needsApproval = currentAllowance < amountWei;
    } catch {
      needsApproval = false;
    }
  }

  const handleAction = async () => {
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }
    if (parsedAmount <= 0) return;

    if (activeMode === "stake") {
      await stake(amount);
    } else {
      await unstake(amount);
    }
  };

  const isTxBusy = txState.step === "CONFIRMING" || txState.step === "PENDING";

  return (
    <>
      <section
        id="stake"
        className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 overflow-hidden border-t border-white/[0.05]"
      >
        {/* Ambient Backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#c8f53c]/[0.05] blur-[180px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto w-full space-y-12">
          {/* Wrong Network Banner */}
          {isWrongNetwork && (
            <div className="mb-4">
              <WrongNetworkBanner onSwitch={switchToRobinhood} />
            </div>
          )}

          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full liquid-glass-pill text-[10px] font-mono tracking-widest text-[#c8f53c] uppercase border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SCENE 04 • STAKING CORE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.01em] text-white uppercase font-sans">
              DEPLOY <span className="text-[#c8f53c]">USDG CAPITAL</span>
            </h2>

            <p className="text-sm sm:text-base font-light text-[#8e95a2] max-w-xl mx-auto font-sans">
              Connect your wallet, enter your USDG allocation, and initiate real-time continuous block-by-block yield streaming.
            </p>
          </div>

          {/* Main Staking Terminal Bento Container */}
          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden border border-white/15">
            {/* Top Bar: Mode Selector + Balance Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 font-mono text-xs">
              {/* Liquid Mode Tabs */}
              <div className="inline-flex items-center gap-2 p-1.5 rounded-full liquid-glass-pill border border-white/15">
                <LiquidButton
                  size="default"
                  variant={activeMode === "stake" ? "kawa" : "default"}
                  onClick={() => {
                    setActiveMode("stake");
                    setAmount("");
                  }}
                  className={`px-6 py-2 min-h-[44px] font-bold text-xs sm:text-sm tracking-wider uppercase ${
                    activeMode === "stake"
                      ? "text-[#c8f53c] font-bold border border-[#c8f53c]/50 bg-[#c8f53c]/15"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  DEPOSIT USDG
                </LiquidButton>

                <LiquidButton
                  size="default"
                  variant={activeMode === "unstake" ? "kawa" : "default"}
                  onClick={() => {
                    setActiveMode("unstake");
                    setAmount("");
                  }}
                  className={`px-6 py-2 min-h-[44px] font-bold text-xs sm:text-sm tracking-wider uppercase ${
                    activeMode === "unstake"
                      ? "text-[#c8f53c] font-bold border border-[#c8f53c]/50 bg-[#c8f53c]/15"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  WITHDRAW USDG
                </LiquidButton>
              </div>

              {/* Balance Readout */}
              <div className="flex items-center gap-2 text-[#8e95a2]">
                <Wallet className="w-4 h-4 text-[#c8f53c]" />
                <span>
                  {activeMode === "stake" ? "WALLET AVAIL:" : "STAKED PRINCIPAL:"}{" "}
                  <strong className="text-white font-medium">
                    {isConnected ? maxBalanceFormatted : "0.00"} USDG
                  </strong>
                </span>
              </div>
            </div>

            {/* Monumental Central Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#8e95a2]">
                <span className="uppercase tracking-widest text-[11px] font-semibold">
                  {activeMode === "stake" ? "STAKE USDG AMOUNT" : "WITHDRAW USDG AMOUNT"}
                </span>

                {/* Percentage Quick-Selection Pills */}
                <div className="flex items-center gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <LiquidButton
                      key={pct}
                      size="sm"
                      onClick={() => handlePercentage(pct)}
                      className="px-3 py-1 min-h-[34px] text-xs font-mono font-bold text-neutral-300 hover:text-[#c8f53c]"
                    >
                      {pct === 100 ? "MAX" : `${pct}%`}
                    </LiquidButton>
                  ))}
                </div>
              </div>

              {/* Large Input Field */}
              <div className="liquid-glass-input rounded-2xl p-4 sm:p-6 flex items-center justify-between focus-within:border-[#c8f53c]/60 transition duration-300">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isTxBusy}
                  className="w-full bg-transparent font-mono text-4xl sm:text-6xl text-white outline-none placeholder:text-neutral-700 font-light"
                />

                <div className="flex items-center gap-2.5 shrink-0 ml-4 liquid-glass-pill px-4 py-2 rounded-xl border border-white/10">
                  <Image
                    src="/usdg-icon.png"
                    alt="USDG"
                    width={22}
                    height={22}
                    className="rounded-full shrink-0"
                  />
                  <span className="font-mono text-sm font-semibold text-white tracking-wider">
                    USDG
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Dynamic Yield Projection Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono border-y border-white/5 py-4 text-xs">
              <div className="liquid-glass-subcard rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] text-[#8e95a2] uppercase block">PROJECTED DAILY YIELD</span>
                <span className="text-base font-semibold text-white">~{estDaily} ARGL</span>
                <span className="text-[10px] text-[#8e95a2] block">Continuous Block Emission</span>
              </div>

              <div className="liquid-glass-subcard rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] text-[#8e95a2] uppercase block">PROJECTED MONTHLY</span>
                <span className="text-base font-semibold text-[#c8f53c]">~{estMonthly} ARGL</span>
                <span className="text-[10px] text-[#8e95a2] block">No Lockup Restrictions</span>
              </div>

              <div className="liquid-glass-subcard rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] text-[#8e95a2] uppercase block">ANNUAL ESTIMATE ({formatApy(calculatedApy)})</span>
                <span className="text-base font-semibold text-emerald-400">~{estYearly} ARGL</span>
                <span className="text-[10px] text-[#8e95a2] block">Compounded Yield Rate</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div>
              <LiquidButton
                size="xxl"
                variant="kawa"
                onClick={handleAction}
                disabled={isTxBusy || (isConnected && parsedAmount <= 0)}
                className="w-full min-h-[58px] py-4.5 px-8 text-sm sm:text-base font-mono tracking-[0.16em] uppercase font-bold text-[#090a0c] shadow-2xl shadow-[#c8f53c]/30"
              >
                <div className="flex items-center justify-center gap-3">
                  {!isConnected ? (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>CONNECT WALLET TO STAKE</span>
                    </>
                  ) : isTxBusy ? (
                    <span>PROCESSING ON-CHAIN...</span>
                  ) : activeMode === "stake" ? (
                    needsApproval ? (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>APPROVE USDG SPENDING</span>
                      </>
                    ) : (
                      <>
                        <span>STAKE {parsedAmount > 0 ? `${amount} USDG` : "USDG"}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )
                  ) : (
                    <>
                      <span>WITHDRAW {parsedAmount > 0 ? `${amount} USDG` : "USDG"}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </LiquidButton>
            </div>

            {/* Invariant Safeguard Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#8e95a2] pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c8f53c]" /> Non-Custodial Smart Contract
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#c8f53c]" /> Instant Unbonding Finality
              </span>
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#c8f53c]" /> Robinhood Chain Native
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Transaction Modal */}
      <TransactionModal state={txState} onClose={resetTxState} />

      {/* Real Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
};
