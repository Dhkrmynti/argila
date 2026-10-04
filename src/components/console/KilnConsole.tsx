"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { parseUnits } from "viem";
import { ArrowRight, Info, Wallet } from "lucide-react";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatApy, formatDuration, formatTokenAmount } from "@/lib/utils/formatters";
import { TransactionModal } from "@/components/Transaction/TransactionModal";
import { WrongNetworkBanner } from "@/components/Wallet/WrongNetworkBanner";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";
import { KilnOrb } from "@/components/kiln/KilnOrb";
import { EmberBurst, EmberFlight } from "@/components/kiln/EmberBurst";
import { RollingNumber } from "@/components/kiln/RollingNumber";
import { stageFor } from "@/components/kiln/stages";
import { useLiveRewards } from "@/components/kiln/useLiveRewards";

type Mode = "deposit" | "withdraw";
const ease = [0.22, 1, 0.36, 1] as const;

export const KilnConsole: React.FC = () => {
  const {
    isConnected,
    isWrongNetwork,
    switchToRobinhood,
    stakeDecimals,
    stakedBalance,
    pendingRewards,
    tokenBalance,
    totalStaked,
    rewardRate,
    calculatedApy,
    stakingDuration,
    argilaState,
    txState,
    resetTxState,
    stake,
    unstake,
    claim,
  } = useLayer5Staking();

  const [mode, setMode] = useState<Mode>("deposit");
  const [amount, setAmount] = useState("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [flightKey, setFlightKey] = useState(0);
  const pendingAction = useRef<{ kind: "stake"; before: bigint } | { kind: "claim" } | null>(null);
  const rewardsRef = useRef<HTMLParagraphElement>(null);

  const live = useLiveRewards(pendingRewards, rewardRate, stakedBalance, totalStaked);
  const stage = stageFor(isConnected ? argilaState : "dormant");
  const hasStaked = isConnected && stakedBalance > 0n;
  const hasRewards = isConnected && pendingRewards > 0n;

  const source = mode === "deposit" ? tokenBalance : stakedBalance;
  const sourceLabel = mode === "deposit" ? "In your wallet" : "In the kiln";
  const sourceShown = isConnected ? formatTokenAmount(source, stakeDecimals, 2) : "0.00";
  const parsed = parseFloat(amount);
  const valid = Boolean(amount) && parsed > 0;

  const previewInput = useMemo(() => {
    if (mode !== "deposit" || !valid) return 0n;
    try {
      return parseUnits(amount, stakeDecimals);
    } catch {
      return 0n;
    }
  }, [mode, valid, amount, stakeDecimals]);
  const previewing = isConnected && previewInput > 0n;
  const previewShare = previewing ? Number(stakedBalance + previewInput) / Number(totalStaked + previewInput) : 0;
  const orbHeat = previewing ? Math.max(stage.heat, Math.min(1, 0.3 + 0.7 * Math.sqrt(previewShare))) : stage.heat;

  useEffect(() => {
    const action = pendingAction.current;
    if (action?.kind === "stake" && stakedBalance > action.before) {
      pendingAction.current = null;
      setBurstKey((k) => k + 1);
    }
  }, [stakedBalance]);

  useEffect(() => {
    const action = pendingAction.current;
    if (!action) return;
    if (txState.step === "FAILED") {
      pendingAction.current = null;
      return;
    }
    if (action.kind === "claim" && txState.step === "SUCCESS") {
      pendingAction.current = null;
      setFlightKey((k) => k + 1);
    }
  }, [txState.step]);

  const setPct = (pct: number) => {
    if (source === 0n) return setAmount("");
    if (pct === 100) return setAmount(formatTokenAmount(source, stakeDecimals, 6));
    const whole = parseFloat(formatTokenAmount(source, stakeDecimals, 6));
    setAmount(((whole * pct) / 100).toFixed(4));
  };

  const submit = async () => {
    if (!valid) return;
    if (mode === "deposit") {
      pendingAction.current = { kind: "stake", before: stakedBalance };
      await stake(amount);
    } else {
      await unstake(amount);
    }
    setAmount("");
  };

  const claimRewards = async () => {
    pendingAction.current = { kind: "claim" };
    await claim();
  };

  const withdrawAll = () => {
    setMode("withdraw");
    setAmount(formatTokenAmount(stakedBalance, stakeDecimals, 6));
    document.getElementById("console")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const apy = calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—";
  const share =
    hasStaked && totalStaked > 0n ? `${((Number(stakedBalance) / Number(totalStaked)) * 100).toFixed(2)}%` : "0.00%";

  return (
    <div className="w-full mx-auto max-w-6xl px-5 sm:px-8 pt-28 sm:pt-36 pb-12">
      {isWrongNetwork && (
        <div className="mb-8">
          <WrongNetworkBanner onSwitch={switchToRobinhood} />
        </div>
      )}

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
      >
        <div>
          <p className="eyebrow">Stake USDG · earn ARGL</p>
          <h1 className="mt-3 font-display font-bold text-[3rem] sm:text-7xl tracking-[-0.045em] leading-[0.9]">
            The <span className="text-heat">kiln.</span>
          </h1>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">
          {[
            { k: "In the kiln", v: totalStaked > 0n ? formatTokenAmount(totalStaked, stakeDecimals, 2) : "0.00", u: "USDG", roll: true },
            { k: "Est. APY", v: apy, hot: true },
            { k: "Lockup", v: "None" },
            { k: "Fees", v: "0%" },
          ].map((m) => (
            <div key={m.k} className="min-w-0">
              <dt className="eyebrow">{m.k}</dt>
              <dd className={`mt-1 font-display font-semibold text-2xl tracking-tight tnum truncate ${m.hot ? "text-glow" : ""}`}>
                {m.roll ? <RollingNumber value={m.v} /> : m.v}
                {m.u && <span className="ml-1 font-mono font-normal text-[11px] text-bone-3">{m.u}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </motion.header>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* The console */}
        <motion.section
          id="console"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="lg:col-span-7 surface-raised p-5 sm:p-8"
        >
          <div role="tablist" aria-label="Deposit or withdraw" className="grid grid-cols-2 p-1.5 rounded-full bg-coal border border-line">
            {(["deposit", "withdraw"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setAmount("");
                }}
                className={`relative h-11 rounded-full font-semibold text-[15px] transition-colors cursor-pointer ${mode === m ? "text-coal" : "text-bone-2 hover:text-bone"}`}
              >
                {mode === m && (
                  <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
                )}
                <span className="relative">{m === "deposit" ? "Deposit" : "Withdraw"}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <label htmlFor="amount" className="eyebrow">
                {mode === "deposit" ? "Set in the kiln" : "Take out of the kiln"}
              </label>
              <button
                type="button"
                onClick={() => setPct(100)}
                className="font-mono text-[12px] text-bone-2 hover:text-glow transition-colors cursor-pointer"
              >
                {sourceLabel}: <span className="text-bone tnum">{sourceShown}</span> USDG
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-3xl bg-coal border border-line focus-within:border-glow/50 transition-colors px-5 sm:px-6 py-4">
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 min-w-0 bg-transparent font-display font-semibold text-4xl sm:text-5xl tracking-tight tnum text-bone placeholder:text-bone-3/60 focus:outline-none"
              />
              <span className="inline-flex items-center gap-2 h-10 pl-1.5 pr-3.5 rounded-full bg-bone/[0.06] shrink-0">
                <img src="/usdg-icon.png" alt="" className="w-7 h-7 rounded-full" />
                <span className="font-semibold">USDG</span>
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPct(p)}
                  disabled={!isConnected}
                  className="h-10 rounded-full border border-line text-[13px] font-medium text-bone-2 hover:text-bone hover:border-glow/40 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {p === 100 ? "Max" : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {!isConnected ? (
              <button type="button" onClick={() => setWalletModalOpen(true)} className="btn btn-hot w-full !h-14 !text-[16px]">
                <Wallet className="w-5 h-5" />
                Connect wallet
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!valid || isWrongNetwork}
                className={`btn w-full !h-14 !text-[16px] group ${mode === "deposit" ? "btn-hot" : "btn-bone"}`}
              >
                {mode === "deposit" ? "Set it firing" : "Withdraw USDG"}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          <p className="mt-5 flex items-start gap-2 text-[13px] text-bone-3 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            {mode === "deposit"
              ? "Your first deposit asks for two signatures: one to approve USDG, one to deposit. You pay only Robinhood Chain gas."
              : "Withdrawing doesn't claim your ARGL. Unclaimed rewards stay yours; claim them any time."}
          </p>
        </motion.section>

        {/* Your firing */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.18 }}
          className="lg:col-span-5 surface-hot p-5 sm:p-8 flex flex-col"
        >
          <div className="flex items-center justify-between">
            <p className="eyebrow">Your firing</p>
            <Link href="/position" className="text-[13px] text-bone-2 hover:text-glow transition-colors">
              Details →
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-5">
            <div className="relative w-24 shrink-0">
              <motion.div animate={{ scale: previewing ? 0.9 + orbHeat * 0.2 : 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                <KilnOrb heat={orbHeat} simple className="w-24" />
              </motion.div>
              <EmberBurst burstKey={burstKey} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-3xl tracking-tight">{stage.name}</p>
              <p className="text-[14px] text-bone-2">
                {previewing
                  ? `Preview: ${(previewShare * 100).toFixed(2)}% of the kiln after this deposit`
                  : hasStaked
                    ? `Firing for ${formatDuration(stakingDuration).toLowerCase()}`
                    : "Nothing in the kiln yet"}
              </p>
            </div>
          </div>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            <div className="flex items-baseline justify-between py-4">
              <dt className="text-bone-2">Your USDG in the kiln</dt>
              <dd className="font-display font-semibold text-xl tnum">
                {isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between py-4">
              <dt className="text-bone-2">Share of the kiln</dt>
              <dd className="font-display font-semibold text-xl tnum">{share}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="eyebrow flex items-center gap-2">
              {hasStaked && <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />}
              ARGL ready to claim
            </p>
            <p ref={rewardsRef} className="mt-2 font-display font-bold text-5xl tracking-[-0.04em] tnum text-heat break-all">
              {isConnected ? live.toFixed(5) : "0.00000"}
            </p>
            {hasStaked && <p className="mt-1 text-[12px] text-bone-3">Estimated between blocks from the reward rate; settles to the chain value on each read.</p>}
          </div>

          <div className="mt-auto pt-8 grid grid-cols-2 gap-2">
            <button type="button" onClick={claimRewards} disabled={!hasRewards || isWrongNetwork} className="btn btn-hot">
              Claim ARGL
            </button>
            <button type="button" onClick={withdrawAll} disabled={!hasStaked} className="btn btn-ghost">
              Withdraw all
            </button>
          </div>
        </motion.aside>
      </div>

      <TransactionModal state={txState} onClose={resetTxState} />
      <EmberFlight flightKey={flightKey} fromRef={rewardsRef} targetSelector="[data-wallet-button]" />
      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  );
};

export default KilnConsole;
