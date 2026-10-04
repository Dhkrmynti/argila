"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatTokenAmount, formatApy } from "@/lib/utils/formatters";
import { TransactionModal } from "../Transaction/TransactionModal";
import { WrongNetworkBanner } from "../Wallet/WrongNetworkBanner";
import { WalletConnectModal } from "../Wallet/WalletConnectModal";
import { GuillocheRosette, MicrMark } from "@/components/vault/Guilloche";
import { RollingNumber } from "@/components/vault/RollingNumber";
import { ArrowRight, ExternalLink, Wallet } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export const StakingDashboard: React.FC = () => {
  const {
    isConnected,
    isWrongNetwork,
    address,
    switchToRobinhood,
    stakeDecimals,
    stakedBalance,
    pendingRewards,
    tokenBalance,
    totalStaked,
    calculatedApy,
    isContractConfigured,
    txState,
    resetTxState,
    stake,
    unstake,
    claim,
  } = useLayer5Staking();

  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [unstakeModalOpen, setUnstakeModalOpen] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

  // Live ticking reward simulator to visually demonstrate per-block continuous stream
  const [liveRewardTicker, setLiveRewardTicker] = useState<number>(0);
  useEffect(() => {
    if (!isConnected || stakedBalance === 0n) return;
    const interval = setInterval(() => {
      setLiveRewardTicker((prev) => prev + 0.000035);
    }, 200);
    return () => clearInterval(interval);
  }, [isConnected, stakedBalance]);

  const hasStaked = isConnected && stakedBalance > 0n;
  const hasRewards = isConnected && pendingRewards > 0n;

  const handlePercentage = (pct: number) => {
    const balance = activeTab === "deposit" ? tokenBalance : stakedBalance;
    if (balance === 0n) {
      setInputAmount("0.00");
      return;
    }
    const formatted = parseFloat(formatTokenAmount(balance, stakeDecimals, 6));
    const calculated = ((formatted * pct) / 100).toFixed(4);
    setInputAmount(calculated);
  };

  const handleMax = () => {
    const balance = activeTab === "deposit" ? tokenBalance : stakedBalance;
    setInputAmount(formatTokenAmount(balance, stakeDecimals, 6));
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(formatTokenAmount(stakedBalance, stakeDecimals, 6));
  };

  const handleMainSubmit = async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return;
    if (activeTab === "deposit") {
      await stake(inputAmount);
    } else {
      await unstake(inputAmount);
    }
    setInputAmount("");
  };

  const handleUnstakeSubmit = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    await unstake(unstakeAmount);
    setUnstakeModalOpen(false);
    setUnstakeAmount("");
  };

  const displayPendingRewards = isConnected
    ? (parseFloat(formatTokenAmount(pendingRewards, 18, 5)) + liveRewardTicker).toFixed(5)
    : "0.00000";

  const apyLabel = calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—";
  const wrap = "max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10";
  const balanceShown =
    activeTab === "deposit"
      ? isConnected ? formatTokenAmount(tokenBalance, stakeDecimals, 2) : "0.00"
      : isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00";
  const poolShare =
    isConnected && stakedBalance > 0n && totalStaked > 0n
      ? `${((Number(stakedBalance) / Number(totalStaked)) * 100).toFixed(2)}%`
      : "0.00%";

  return (
    <div className="w-full text-left text-paper">
      {isWrongNetwork && (
        <div className={`${wrap} pt-6`}>
          <WrongNetworkBanner onSwitch={switchToRobinhood} />
        </div>
      )}

      {/* Counter header */}
      <section className="relative overflow-hidden">
        <GuillocheRosette
          engrave
          spin
          className="pointer-events-none absolute -right-48 -top-40 w-[40rem] h-[40rem] text-terra/30 hidden md:block"
        />
        <div className={`${wrap} relative pt-14 sm:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end`}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-7 font-display font-extrabold text-[2.6rem] sm:text-6xl lg:text-[4.6rem] leading-[0.95] text-balance"
          >
            The kiln floor.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="lg:col-span-5 text-lg leading-relaxed text-paper-dim"
          >
            Fill in the firing ticket to deposit or withdraw USDG. Rewards in ARGL accrue to your firing log every block, and you can collect
            them or leave at any time.
          </motion.p>
        </div>

        {/* The kiln gauge: live figures */}
        <div className="relative border-y border-terra/25 bg-ink-3/60">
          <dl className={`${wrap} grid grid-cols-2 lg:grid-cols-4`}>
            {[
              { k: "In the kiln", v: totalStaked > 0n ? `${formatTokenAmount(totalStaked, stakeDecimals, 2)}` : "0.00", u: "USDG", roll: true },
              { k: "Estimated APY", v: apyLabel, u: "", hi: true },
              { k: "Lockup", v: "None", u: "" },
              { k: "Deposit / exit fee", v: "0.00%", u: "" },
            ].map((m, i) => (
              <div
                key={m.k}
                className={`min-w-0 py-5 sm:py-6 ${i % 2 === 1 ? "pl-5 sm:pl-8 border-l border-terra/20" : ""} ${
                  i >= 2 ? "border-t lg:border-t-0 border-terra/20" : ""
                } ${i === 2 ? "lg:pl-8 lg:border-l" : ""}`}
              >
                <dt className="flex items-center gap-2 font-mono text-[11px] text-paper-faint">
                  <MicrMark className="text-terra" kind={i === 0 ? "amount" : "transit"} />
                  {m.k}
                </dt>
                <dd className={`pt-2 font-display font-bold text-2xl sm:text-3xl truncate ${m.hi ? "text-terra-hi" : ""}`}>
                  {m.roll ? <RollingNumber value={m.v} /> : m.v}
                  {m.u && <span className="ml-2 font-mono font-normal text-xs text-paper-faint">{m.u}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The ticket and the firing log */}
      <section id="stake" className="scroll-mt-24">
        <div className={`${wrap} py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start`}>
          {/* Firing ticket */}
          <motion.article
            initial={{ opacity: 0, y: 40, rotate: -1.2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease, delay: 0.15 }}
            className="lg:col-span-7 paper tint on-paper relative"
          >
            <div className="perf-x mx-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
            <div className="px-5 sm:px-9 pt-5 pb-8 sm:pb-10">
              <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-ink">
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-none">
                    {activeTab === "deposit" ? "Firing ticket" : "Unloading ticket"}
                  </h2>
                  <p className="mt-1.5 font-mono text-[11px] text-ink/60">Argila · USDG · Robinhood Chain</p>
                </div>
                <p className="font-mono text-[11px] text-cobalt-deep text-right tnum">
                  {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "no account"}
                </p>
              </div>

              {/* Slip type */}
              <div className="mt-6 grid grid-cols-2 border border-ink/40 relative" role="tablist" aria-label="Action">
                {(["deposit", "withdraw"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setInputAmount("");
                    }}
                    className={`relative h-12 wide text-[15px] font-semibold transition-colors duration-300 cursor-pointer ${
                      activeTab === tab ? "text-paper" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.span
                        layoutId="slip-tab"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className="absolute inset-0 bg-ink"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{tab === "deposit" ? "Deposit USDG" : "Withdraw USDG"}</span>
                  </button>
                ))}
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="stake-amount" className="font-mono text-[11px] text-ink/65">
                    {activeTab === "deposit" ? "Amount to deposit" : "Amount to withdraw"}
                  </label>
                  <div className="flex items-center gap-3 text-[14px] text-ink/70">
                    <span className="tnum font-mono text-[12px]">Available {balanceShown}</span>
                    <button
                      type="button"
                      onClick={handleMax}
                      className="px-3 h-8 border border-ink/40 font-mono text-[11px] font-medium text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* The amount line, written in large figures */}
                <div className="flex items-end gap-3 border-b-2 border-ink pb-2 focus-within:border-cobalt-deep transition-colors duration-300">
                  <input
                    id="stake-amount"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="tnum w-full min-w-0 bg-transparent font-display font-extrabold text-[2.75rem] sm:text-6xl leading-none text-ink outline-none placeholder:text-ink/25"
                  />
                  <span className="flex items-center gap-2 shrink-0 pb-1.5 font-mono text-[13px] font-medium text-ink">
                    <Image src="/usdg-icon.png" alt="" width={20} height={20} />
                    USDG
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentage(pct)}
                      className="h-10 border border-ink/30 font-mono text-[12px] text-ink/80 hover:border-ink hover:text-ink transition-colors cursor-pointer tnum"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                {!isConnected ? (
                  <button type="button" onClick={() => setWalletModalOpen(true)} className="btn btn-ink w-full !h-14 !text-[16px]">
                    <Wallet className="w-5 h-5" />
                    Connect a wallet to deposit
                  </button>
                ) : !isContractConfigured ? (
                  <div className="w-full h-14 grid place-items-center border border-ink/30 font-mono text-[12px] text-ink/70">
                    Contract pending deployment
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMainSubmit}
                    disabled={!inputAmount || parseFloat(inputAmount) <= 0}
                    className="btn btn-ink group w-full !h-14 !text-[16px]"
                  >
                    {activeTab === "deposit" ? "Sign and deposit USDG" : "Sign and withdraw USDG"}
                    <ArrowRight className="w-5 h-5 transition-transform duration-500 ease-vault group-hover:translate-x-1" />
                  </button>
                )}
              </div>

              <dl className="mt-8 ledger [--rule:rgba(18,14,11,0.16)] border-t border-ink/25 text-[15px]">
                {[
                  ["Your USDG balance", isConnected ? `${formatTokenAmount(tokenBalance, stakeDecimals, 2)} USDG` : "Not connected", false],
                  ["Your USDG in the kiln", isConnected ? `${formatTokenAmount(stakedBalance, stakeDecimals, 2)} USDG` : "Not connected", false],
                  ["Deposit / exit fee", "0.00% / 0.00%", true],
                  ["Lockup", "None, withdraw any time", false],
                ].map(([k, v, hi]) => (
                  <div key={k as string} className="flex items-center justify-between gap-3 py-3">
                    <dt className="text-ink/65">{k}</dt>
                    <dd className={`tnum font-mono text-[13px] truncate ${hi ? "font-semibold" : "font-medium"}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.article>

          {/* Firing log summary */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.28 }}
            className="lg:col-span-5 relative bg-ink-2 border border-terra/30 frame-double text-paper"
          >
            <div className="px-5 sm:px-8 py-7 sm:py-9">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-none">Your firing log</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-paper-dim">
                Rewards accrue to your share of the kiln every block. Collect them whenever you like.
              </p>

              <div className="mt-8 grid grid-cols-2 border-y border-terra/25">
                <div className="py-5 pr-4 min-w-0">
                  <p className="font-mono text-[11px] text-paper-faint">In the kiln</p>
                  <p className="pt-2 font-display font-extrabold text-[1.6rem] sm:text-4xl leading-none truncate">
                    <RollingNumber value={isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00"} />
                  </p>
                  <p className="pt-1.5 font-mono text-[11px] text-paper-faint">USDG</p>
                </div>
                <div className="py-5 pl-5 border-l border-terra/25 min-w-0">
                  <p className="flex items-center gap-2 font-mono text-[11px] text-paper-faint">
                    Accruing
                    <span className="w-1.5 h-1.5 rounded-full bg-terra-hi tick-dot" aria-hidden="true" />
                  </p>
                  <p className="pt-2 font-display font-extrabold text-[1.6rem] sm:text-4xl leading-none truncate text-terra-hi tnum">
                    {displayPendingRewards}
                  </p>
                  <p className="pt-1.5 font-mono text-[11px] text-terra">ARGL</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={claim} disabled={!hasRewards} className="btn btn-paper !h-13">
                  Claim rewards
                </button>
                <button type="button" onClick={() => setUnstakeModalOpen(true)} disabled={!hasStaked} className="btn btn-line !h-13">
                  Unload the kiln
                </button>
              </div>

              <dl className="mt-8 ledger [--rule:rgba(210,105,60,0.16)] text-[15px]">
                {[
                  ["In the kiln", totalStaked > 0n ? `${formatTokenAmount(totalStaked, stakeDecimals, 2)} USDG` : "—", false],
                  ["Your share", poolShare, false],
                  ["Reward method", "Per token, per block", false],
                  ["ARGL claimable", isConnected ? `${displayPendingRewards} ARGL` : "—", true],
                ].map(([k, v, hi]) => (
                  <div key={k as string} className="flex items-center justify-between gap-3 py-3">
                    <dt className="text-paper-dim shrink-0">{k}</dt>
                    <dd className={`tnum font-mono text-[13px] truncate ${hi ? "text-terra-hi" : ""}`}>{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 pt-5 border-t border-terra/40">
                <p className="font-display font-bold">Estimated APY · {apyLabel}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-paper-dim">
                  An estimate recomputed from the contract&apos;s reward rate and the USDG currently in the kiln. It moves as
                  deposits come and go.
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* How it settles */}
      <section className="bg-ink-3/75 border-t border-terra/20">
        <div className={`${wrap} py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10`}>
          <h2 data-reveal="lines" className="lg:col-span-4 font-display font-extrabold text-4xl sm:text-5xl leading-[0.98] text-balance">
            One dollar in, one dollar out.
          </h2>
          <ol className="lg:col-span-7 lg:col-start-6 ledger [--rule:rgba(210,105,60,0.18)] border-y border-terra/20">
            {[
              ["Deposit without a fee", "Approve USDG once, then deposit from your wallet. You pay only the network fee in ETH."],
              ["Rewards every block", "ARGL accrues to your share of the kiln as each block lands, using a reward-per-token accumulator."],
              ["Collect or leave any time", "Claim ARGL to your wallet, or withdraw your USDG in part or in full. There is no lockup."],
            ].map(([t, d], i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-7"
              >
                <h3 className="md:col-span-5 font-display font-bold text-xl">{t}</h3>
                <p className="md:col-span-7 text-[17px] leading-relaxed text-paper-dim">{d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
        <div className={`${wrap} pb-20 flex flex-col sm:flex-row sm:items-center justify-between gap-6`}>
          <p className="text-lg text-paper-dim max-w-xl">Want the arithmetic? The documentation walks through the contract line by line.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#stake" className="btn btn-paper">
              Back to the slip <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/docs" className="btn btn-line">
              Documentation <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <TransactionModal state={txState} onClose={resetTxState} />

      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />

      <AnimatePresence>
        {unstakeModalOpen && (
          <motion.div
            key="unstake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-3/80 backdrop-blur-[3px]"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="unstake-title"
              initial={{ y: 40, opacity: 0, rotate: -1.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="w-full max-w-md paper tint on-paper"
            >
              <div className="perf-x mx-3 [--perf-hole:var(--ink-3)]" aria-hidden="true" />
              <div className="px-6 sm:px-8 pt-5 pb-8 space-y-5">
                <h3 id="unstake-title" className="font-display font-extrabold text-3xl leading-none">Withdrawal slip</h3>
                <p className="text-[15px] text-ink/70">
                  Enter the USDG to withdraw from the kiln back into your wallet.
                </p>

                <div className="flex items-end gap-3 border-b-2 border-ink pb-2 focus-within:border-cobalt-deep transition-colors">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="tnum w-full min-w-0 bg-transparent font-display font-extrabold text-4xl text-ink outline-none placeholder:text-ink/25"
                    aria-label="Withdraw amount"
                  />
                  <button
                    type="button"
                    onClick={handleMaxUnstake}
                    className="shrink-0 px-3 h-8 mb-1 border border-ink/40 font-mono text-[11px] hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button type="button" onClick={() => setUnstakeModalOpen(false)} className="btn btn-outline-ink">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUnstakeSubmit}
                    disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                    className="btn btn-ink"
                  >
                    Confirm exit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StakingDashboard;
