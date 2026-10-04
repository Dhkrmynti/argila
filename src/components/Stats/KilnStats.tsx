"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBlockNumber } from "wagmi";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatApy, formatTokenAmount } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { RollingNumber } from "@/components/kiln/RollingNumber";
import { CopyAddress } from "@/components/kiln/CopyAddress";
import { KilnOrb } from "@/components/kiln/KilnOrb";

interface ApiStatsResponse {
  tvlUsd: string | null;
  totalStaked: string;
  totalRewardsDistributed: string;
  totalStakers: number;
  currentApy: number | null;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* Live figures from the staking contract, with the indexer API as a fallback. */
export const KilnStats: React.FC = () => {
  const { totalStaked, totalStakers, calculatedApy, stakeDecimals, rewardRate } = useLayer5Staking();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [api, setApi] = useState<ApiStatsResponse | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setApi(d))
      .catch(() => {});
  }, []);

  const staked = totalStaked > 0n ? formatTokenAmount(totalStaked, stakeDecimals, 2) : api?.totalStaked ?? "0.00";
  const stakers = totalStakers > 0 ? totalStakers.toLocaleString() : api?.totalStakers ? api.totalStakers.toLocaleString() : "0";
  const apyRaw = calculatedApy ?? api?.currentApy ?? 0;
  const apy = apyRaw > 0 ? formatApy(apyRaw) : "—";
  const perDay = rewardRate > 0n ? (Number(rewardRate) / 1e18) * 86400 : 0;
  const emission = perDay > 0 ? perDay.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
  const block = blockNumber ? Number(blockNumber).toLocaleString() : "—";

  return (
    <div className="w-full mx-auto max-w-6xl px-5 sm:px-8 pt-28 sm:pt-36 pb-12">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />
            Read live · chain {protocolConfig.chainId}
          </p>
          <h1 className="mt-3 font-display font-bold text-[3rem] sm:text-7xl tracking-[-0.045em] leading-[0.9]">
            Kiln <span className="text-heat">stats.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 h-12 pl-2 pr-5 rounded-full border border-line bg-bone/[0.02]">
          <KilnOrb heat={0.8} simple className="w-8" />
          <span className="font-mono text-[12.5px] text-bone-2">
            Block <span className="text-bone tnum">#{block}</span>
          </span>
        </div>
      </motion.header>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Headline figure */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="md:col-span-4 surface-hot p-7 sm:p-10 flex flex-col justify-between min-h-[16rem]"
        >
          <p className="eyebrow">In the kiln</p>
          <div>
            <p className="font-display font-bold text-6xl sm:text-8xl tracking-[-0.05em] leading-none tnum break-words">
              <RollingNumber value={staked} />
            </p>
            <p className="mt-3 font-mono text-[13px] text-bone-3">USDG staked across every position</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.14 }}
          className="md:col-span-2 surface p-7 sm:p-8 flex flex-col justify-between min-h-[16rem]"
        >
          <p className="eyebrow">Estimated APY</p>
          <div>
            <p className="font-display font-bold text-6xl tracking-[-0.05em] leading-none text-heat">{apy}</p>
            <p className="mt-3 text-[13px] text-bone-3">
              {apy === "—" ? "Waiting for a reward rate and deposits" : "From the reward rate and total staked; moves as deposits change"}
            </p>
          </div>
        </motion.div>

        {[
          { k: "Stakers", v: stakers, note: "Unique addresses with a position", roll: true },
          { k: "Lockup · fees", v: "None · 0%", note: "Withdraw any time; only network gas", roll: false },
          { k: "ARGL fired per day", v: emission, note: "Contract reward rate × 86,400 s", roll: false },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 + i * 0.06 }}
            className="md:col-span-2 surface p-7"
          >
            <p className="eyebrow">{m.k}</p>
            <p className="mt-4 font-display font-bold text-4xl sm:text-5xl tracking-[-0.04em] leading-none tnum truncate">
              {m.roll ? <RollingNumber value={m.v} /> : m.v}
            </p>
            <p className="mt-3 text-[13px] text-bone-3">{m.note}</p>
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.03em]">Contracts</h2>
        <p className="mt-2 text-bone-2">Everything behind the kiln, verified on {protocolConfig.chainName}.</p>
        <div className="mt-6 surface px-6 sm:px-8 divide-y divide-line">
          <CopyAddress label="Staking contract" address={protocolConfig.stakingContractAddress} />
          <CopyAddress label="USDG" note="Stake asset · 6 decimals" address={protocolConfig.stakeTokenAddress} />
          <CopyAddress label="ARGL" note="Reward asset · 18 decimals" address={protocolConfig.rewardTokenAddress} />
        </div>
      </motion.section>
    </div>
  );
};

export default KilnStats;
