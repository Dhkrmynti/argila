"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Wallet } from "lucide-react";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatAddress, formatApy, formatDuration, formatTokenAmount } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { TransactionModal } from "@/components/Transaction/TransactionModal";
import { WrongNetworkBanner } from "@/components/Wallet/WrongNetworkBanner";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";
import { KilnOrb } from "@/components/kiln/KilnOrb";
import { Embers } from "@/components/kiln/Embers";
import { HeatBar } from "@/components/kiln/HeatBar";
import { stageFor, stageIndex } from "@/components/kiln/stages";
import { useLiveRewards } from "@/components/kiln/useLiveRewards";

const ease = [0.22, 1, 0.36, 1] as const;

export const MyFiring: React.FC = () => {
  const {
    isConnected,
    isWrongNetwork,
    switchToRobinhood,
    address,
    stakeDecimals,
    stakedBalance,
    pendingRewards,
    totalStaked,
    rewardRate,
    stakingDuration,
    calculatedApy,
    argilaState,
    claim,
    txState,
    resetTxState,
  } = useLayer5Staking();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const live = useLiveRewards(pendingRewards, rewardRate, stakedBalance, totalStaked);
  const key = isConnected ? argilaState : "dormant";
  const stage = stageFor(key);
  const hasStaked = isConnected && stakedBalance > 0n;
  const hasRewards = isConnected && pendingRewards > 0n;
  const share = hasStaked && totalStaked > 0n ? `${((Number(stakedBalance) / Number(totalStaked)) * 100).toFixed(2)}%` : "0.00%";

  return (
    <div className="w-full mx-auto max-w-6xl px-5 sm:px-8 pt-28 sm:pt-36 pb-12">
      {isWrongNetwork && (
        <div className="mb-8">
          <WrongNetworkBanner onSwitch={switchToRobinhood} />
        </div>
      )}

      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
        <p className="eyebrow">{isConnected && address ? formatAddress(address) : "Not connected"}</p>
        <h1 className="mt-3 font-display font-bold text-[3rem] sm:text-7xl tracking-[-0.045em] leading-[0.9]">
          Your <span className="text-heat">firing.</span>
        </h1>
      </motion.header>

      {/* The piece in the kiln */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
        className="mt-10 surface-hot overflow-hidden p-6 sm:p-10 lg:p-12"
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative flex justify-center">
            <Embers className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)]" density={6} heat={stage.heat} />
            <KilnOrb heat={stage.heat} className="w-[72%] sm:w-[55%] lg:w-[88%]" />
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">Current stage</p>
            <p className="mt-2 font-display font-bold text-6xl sm:text-8xl tracking-[-0.05em] leading-none">{stage.name}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="h-8 px-3.5 inline-flex items-center rounded-full bg-bone/[0.06] border border-line text-[13px]">
                {hasStaked ? `Firing for ${formatDuration(stakingDuration).toLowerCase()}` : "Not firing"}
              </span>
              <span className="h-8 px-3.5 inline-flex items-center rounded-full bg-bone/[0.06] border border-line text-[13px] text-glow tnum">
                like a kiln at {stage.temp}
              </span>
            </div>
            <p className="mt-5 text-lg text-bone-2 leading-relaxed max-w-lg">{stage.line}</p>

            <HeatBar current={stageIndex(key)} className="mt-10" />
            <p className="mt-5 text-[13px] text-bone-3">Stages track time staked. They don&apos;t change your reward rate.</p>
          </div>
        </div>
      </motion.section>

      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="mt-4 surface p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="font-display font-semibold text-2xl tracking-tight">Connect to see your piece</p>
            <p className="mt-1 text-bone-2">Your stake, rewards and stage are read straight from the contract.</p>
          </div>
          <button type="button" onClick={() => setWalletModalOpen(true)} className="btn btn-hot !h-[3.25rem] shrink-0">
            <Wallet className="w-[18px] h-[18px]" /> Connect wallet
          </button>
        </motion.div>
      ) : (
        <>
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { k: "Principal", v: formatTokenAmount(stakedBalance, stakeDecimals, 2), u: "USDG" },
              { k: "ARGL to claim", v: live.toFixed(4), hot: true },
              { k: "Share of the kiln", v: share },
              { k: "Est. APY", v: calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—" },
            ].map((m) => (
              <div key={m.k} className="surface p-5 sm:p-7 min-w-0">
                <dt className="eyebrow">{m.k}</dt>
                <dd className={`mt-3 font-display font-bold text-3xl sm:text-4xl tracking-[-0.04em] tnum truncate ${m.hot ? "text-heat" : ""}`}>
                  {m.v}
                  {m.u && <span className="ml-1.5 font-mono font-normal text-[11px] text-bone-3 tracking-normal">{m.u}</span>}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.28 }}
            className="mt-4 surface p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <a
              href={`${protocolConfig.explorerUrl}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[12.5px] text-bone-2 hover:text-bone break-all"
            >
              {address} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={claim} disabled={!hasRewards || isWrongNetwork} className="btn btn-hot">
                Claim ARGL
              </button>
              <Link href="/stake" className="btn btn-ghost group">
                {hasStaked ? "Add or withdraw" : "Start firing"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </>
      )}

      <TransactionModal state={txState} onClose={resetTxState} />
      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  );
};

export default MyFiring;
