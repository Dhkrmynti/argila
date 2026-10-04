"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatTokenAmount, formatApy, formatDuration, formatAddress } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { TransactionModal } from "../Transaction/TransactionModal";
import { WalletConnectModal } from "../Wallet/WalletConnectModal";
import { GuillocheRosette } from "@/components/vault/Guilloche";
import { RollingNumber } from "@/components/vault/RollingNumber";
import { Stamp } from "@/components/vault/Stamp";
import { ArrowUpRight, Wallet } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export const PositionViewer: React.FC = () => {
  const {
    isConnected,
    address,
    stakeDecimals,
    stakedBalance,
    pendingRewards,
    stakingDuration,
    calculatedApy,
    kawaState,
    claim,
    unstake,
    txState,
    resetTxState,
  } = useLayer5Staking();

  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const hasStaked = isConnected && stakedBalance > 0n;
  const hasRewards = isConnected && pendingRewards > 0n;

  const handleUnstakeSubmit = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    await unstake(unstakeAmount);
    setUnstakeModalOpen(false);
    setUnstakeAmount("");
  };

  const getStateDescription = () => {
    if (!isConnected) return "Connect your wallet to open your firing log.";
    if (!hasStaked) return "This account holds no USDG in the kiln yet. Make a deposit to start earning ARGL.";
    if (kawaState === "awakened") return "A long-standing deposit. ARGL keeps accruing to it every block.";
    if (kawaState === "mature" || kawaState === "growing") return "Your deposit is earning ARGL with every Robinhood Chain block.";
    return "Deposit recorded by the contract. Rewards are accruing.";
  };

  const lines = [
    {
      k: "Principal in the kiln",
      v: isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00",
      u: "USDG",
      roll: true,
    },
    {
      k: "Rewards not yet claimed",
      v: isConnected ? formatTokenAmount(pendingRewards, 18, 4) : "0.0000",
      u: "ARGL",
      roll: true,
      hi: true,
    },
    {
      k: "Estimated APY",
      v: calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—",
      u: "",
    },
    {
      k: "Held for",
      v: isConnected && hasStaked ? formatDuration(stakingDuration) : "0 DAYS",
      u: "",
    },
  ];

  return (
    <div className="w-full text-left text-paper">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-10 border-b border-terra/25">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-7 font-display font-extrabold text-[2.6rem] sm:text-6xl lg:text-[4.6rem] leading-[0.95]"
        >
          Your firing log.
        </motion.h1>
        <div className="lg:col-span-5 space-y-3">
          <p className="text-lg leading-relaxed text-paper-dim">{getStateDescription()}</p>
          {isConnected && address && (
            <p className="inline-flex items-center gap-2 font-mono text-[12px] text-paper">
              <span className="w-1.5 h-1.5 rounded-full bg-terra-hi" aria-hidden="true" />
              Account {formatAddress(address)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* The open page */}
        <motion.article
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease, delay: 0.12 }}
          className="lg:col-span-8 paper tint on-paper relative flex"
        >
          <div className="perf-y shrink-0 my-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
          <div className="flex-1 min-w-0 px-5 sm:px-9 py-7 sm:py-9">
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-ink">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-none">Account summary</h2>
                <p className="mt-1.5 font-mono text-[11px] text-ink/60">
                  Contract {formatAddress(protocolConfig.stakingContractAddress)}
                </p>
              </div>
              {isConnected && (
                <Stamp tone={hasStaked ? "cobalt" : "ink"} tilt={-7} className="text-[13px] shrink-0">
                  {hasStaked ? "Firing" : "Cold"}
                </Stamp>
              )}
            </div>

            <dl className="ledger [--rule:rgba(18,14,11,0.16)]">
              {lines.map((l) => (
                <div key={l.k} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 items-baseline py-5 sm:py-6">
                  <dt className="sm:col-span-5 font-display font-bold text-[17px]">{l.k}</dt>
                  <dd
                    className="sm:col-span-7 sm:text-right font-display font-extrabold leading-none text-4xl sm:text-5xl break-words"
                  >
                    {l.roll ? <RollingNumber value={l.v} /> : l.v}
                    {l.u && <span className="ml-2 font-mono font-normal text-sm text-ink/55 align-middle">{l.u}</span>}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-6 border-t-2 border-ink">
              {isConnected ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={claim} disabled={!hasRewards} className="btn btn-ink sm:flex-1">
                    Claim rewards
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnstakeModalOpen(true)}
                    disabled={!hasStaked}
                    className="btn btn-outline-ink sm:flex-1"
                  >
                    Withdraw USDG
                  </button>
                  <Link href="/stake" className="btn btn-outline-ink">
                    Deposit more
                  </Link>
                </div>
              ) : (
                <button onClick={() => setWalletModalOpen(true)} className="btn btn-ink w-full !h-14">
                  <Wallet className="w-5 h-5" />
                  Connect a wallet to open your firing log
                </button>
              )}
            </div>
          </div>
        </motion.article>

        {/* Terms printed inside the back cover */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.24 }}
          className="lg:col-span-4 relative bg-ink-2 border border-terra/30 frame-double overflow-hidden"
        >
          <GuillocheRosette className="pointer-events-none absolute -right-24 -bottom-24 w-72 h-72 text-terra/20" />
          <div className="relative px-6 sm:px-8 py-8">
            <h2 className="font-display font-bold text-xl">Account terms</h2>
            <dl className="mt-5 ledger [--rule:rgba(210,105,60,0.18)]">
              {[
                ["Withdrawal", "Instant, any amount", "No lockup or notice period"],
                ["Fees", "None charged by the kiln", "Network fee paid in ETH"],
                ["Rewards", "Accrue every block", "Claim them whenever you like"],
              ].map(([k, v, d]) => (
                <div key={k} className="py-4">
                  <dt className="font-mono text-[11px] text-paper-faint">{k}</dt>
                  <dd className="mt-1 font-display font-bold text-[17px]">{v}</dd>
                  <dd className="text-[14px] text-paper-dim">{d}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`${protocolConfig.explorerUrl}/address/${protocolConfig.stakingContractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 wide text-[14px] text-terra-hi hover:text-paper transition-colors"
            >
              Inspect the contract <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.aside>
      </div>

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
              aria-labelledby="pos-unstake-title"
              initial={{ y: 40, opacity: 0, rotate: -1.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="w-full max-w-md paper tint on-paper"
            >
              <div className="perf-x mx-3 [--perf-hole:var(--ink-3)]" aria-hidden="true" />
              <div className="px-6 sm:px-8 pt-5 pb-8 space-y-5">
                <h3 id="pos-unstake-title" className="font-display font-extrabold text-3xl leading-none">Withdrawal slip</h3>
                <p className="font-mono text-[12px] text-ink/65 tnum">
                  Available {formatTokenAmount(stakedBalance, stakeDecimals, 2)} USDG
                </p>

                <div className="flex items-end gap-3 border-b-2 border-ink pb-2 focus-within:border-cobalt-deep transition-colors">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="tnum w-full min-w-0 bg-transparent font-display font-extrabold text-4xl text-ink outline-none placeholder:text-ink/25"
                    aria-label="Withdraw amount"
                  />
                  <button
                    type="button"
                    onClick={() => setUnstakeAmount(formatTokenAmount(stakedBalance, stakeDecimals, 6))}
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
                    Confirm withdrawal
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
export default PositionViewer;
