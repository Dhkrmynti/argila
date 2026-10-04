"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { useBlockNumber } from "wagmi";
import { formatTokenAmount, formatApy } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { Copy, Check, ExternalLink } from "lucide-react";
import { RollingNumber } from "@/components/vault/RollingNumber";
import { MicrMark } from "@/components/vault/Guilloche";

interface ApiStatsResponse {
  tvlUsd: string | null;
  totalStaked: string;
  totalRewardsDistributed: string;
  totalStakers: number;
  currentApy: number | null;
}

const ease = [0.16, 1, 0.3, 1] as const;

export const StatsViewer: React.FC = () => {
  const { totalStaked, totalStakers, calculatedApy, stakeDecimals } = useLayer5Staking();
  const { data: blockNumberData } = useBlockNumber({ watch: true });
  const liveBlock = blockNumberData ? Number(blockNumberData) : 0;
  const [apiStats, setApiStats] = useState<ApiStatsResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"24H" | "7D" | "30D" | "ALL">("24H");

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setApiStats(data);
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string | undefined, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const stakedFormatted =
    totalStaked > 0n
      ? `${formatTokenAmount(totalStaked, stakeDecimals, 2)} USDG`
      : apiStats?.totalStaked
      ? `${apiStats.totalStaked} USDG`
      : "0.00 USDG";

  const rewardsDistributedFormatted =
    apiStats?.totalRewardsDistributed && apiStats.totalRewardsDistributed !== "0.00"
      ? `${apiStats.totalRewardsDistributed} ARGL`
      : "0.00 ARGL";

  const stakersCount =
    totalStakers > 0
      ? totalStakers.toLocaleString()
      : apiStats?.totalStakers
      ? apiStats.totalStakers.toLocaleString()
      : "0";

  const apyRaw = calculatedApy ?? (apiStats?.currentApy ?? 0);
  // An unread or unset rate is shown as unknown, never as a 0% figure
  const apyDisplay = apyRaw > 0 ? formatApy(apyRaw) : "—";

  // Timeframe live data
  const timeframeMetrics = {
    "24H": { volume: "$0.00 USDG", rewards: "0.00 ARGL", txCount: "0", avgGas: "< 0.0001 ETH" },
    "7D": { volume: "$0.00 USDG", rewards: "0.00 ARGL", txCount: "0", avgGas: "< 0.0001 ETH" },
    "30D": { volume: "$0.00 USDG", rewards: "0.00 ARGL", txCount: "0", avgGas: "< 0.0001 ETH" },
    "ALL": { volume: stakedFormatted, rewards: rewardsDistributedFormatted, txCount: "0", avgGas: "< 0.0001 ETH" },
  }[timeframe];

  const split = (s: string) => {
    const i = s.lastIndexOf(" ");
    return i > 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, ""];
  };

  const headline = [
    { k: "In the kiln", v: stakedFormatted, roll: true },
    { k: "Estimated APY", v: apyDisplay },
    { k: "ARGL paid out", v: rewardsDistributedFormatted, roll: true },
    { k: "Account holders", v: stakersCount, roll: true },
  ];

  return (
    <div className="w-full text-left text-paper">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-10 border-b border-terra/25">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-7 font-display font-extrabold text-[2.6rem] sm:text-6xl lg:text-[4.6rem] leading-[0.95]"
        >
          Kiln report.
        </motion.h1>
        <p className="lg:col-span-5 text-lg leading-relaxed text-paper-dim">
          What the kiln holds and has paid, read from the staking contract and the indexer as you watch.
        </p>
      </div>

      {/* Headline figures, printed as the kiln's statement */}
      <motion.section
        initial={{ opacity: 0, y: 40, rotate: -0.8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1, ease, delay: 0.12 }}
        className="mt-12 paper tint on-paper"
      >
        <div className="perf-x mx-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
        <div className="px-5 sm:px-10 pt-6 pb-8">
          <div className="flex items-start justify-between gap-6 pb-4 border-b-2 border-ink">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-none">Kiln report</h2>
              <p className="mt-2 font-mono text-[11px] text-ink/60 tnum">
                Robinhood Chain · block #{liveBlock.toLocaleString()}
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-ink/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt-deep tick-dot" aria-hidden="true" />
              read live
            </span>
          </div>
          <dl className="ledger [--rule:rgba(18,14,11,0.16)]">
            {headline.map((m) => {
              const [num, unit] = split(m.v);
              return (
                <div key={m.k} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 items-baseline py-5 sm:py-6">
                  <dt className="sm:col-span-5 flex items-center gap-2 font-display font-bold text-[17px]">
                    <MicrMark className="text-ink/50" kind="transit" />
                    {m.k}
                  </dt>
                  <dd className="sm:col-span-7 sm:text-right font-display font-extrabold leading-none text-4xl sm:text-5xl break-words">
                    {m.roll ? <RollingNumber value={num} /> : m.v}
                    {m.roll && unit && <span className="ml-2 font-mono font-normal text-sm text-ink/55 align-middle">{unit}</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </motion.section>

      {/* Period ledger */}
      <section className="mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 data-reveal="lines" className="font-display font-bold text-2xl sm:text-3xl">By period</h2>
          <div className="relative inline-flex border border-terra/40 p-1 self-start" role="tablist" aria-label="Period">
            {(["24H", "7D", "30D", "ALL"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={timeframe === t}
                onClick={() => setTimeframe(t)}
                className={`relative px-4 h-9 font-mono text-[12px] transition-colors cursor-pointer ${
                  timeframe === t ? "text-ink" : "text-paper-dim hover:text-paper"
                }`}
              >
                {timeframe === t && (
                  <motion.span
                    layoutId="period"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-0 bg-paper"
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 border-y border-terra/25">
          {[
            ["Volume", timeframeMetrics.volume, false],
            ["Rewards generated", timeframeMetrics.rewards, true],
            ["Transactions", timeframeMetrics.txCount, false],
            ["Average gas", timeframeMetrics.avgGas, false],
          ].map(([k, v, hi], i) => (
            <div
              key={k as string}
              className={`py-6 min-w-0 ${i % 2 === 1 ? "pl-5 border-l border-terra/20" : ""} ${
                i >= 2 ? "border-t lg:border-t-0 border-terra/20" : ""
              } ${i === 2 ? "lg:pl-5 lg:border-l" : ""}`}
            >
              <dt className="font-mono text-[11px] text-paper-faint">{k}</dt>
              <dd className={`mt-2 font-mono text-base sm:text-lg truncate tnum ${hi ? "text-terra-hi" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Registered contracts, on paper */}
      <section data-reveal="paper" className="mt-16 paper tint on-paper">
        <div className="perf-x mx-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
        <div className="px-5 sm:px-9 pt-5 pb-8">
          <div className="pb-4 border-b-2 border-ink">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-none">Registered contracts</h2>
            <p className="mt-2 text-[15px] text-ink/70">
              The contracts behind the kiln. Copy an address or inspect its source on the explorer.
            </p>
          </div>
          <ul className="ledger [--rule:rgba(18,14,11,0.16)]">
            {[
              { id: "stake", label: "Staking contract", addr: protocolConfig.stakingContractAddress, note: "Holds deposits, pays rewards" },
              { id: "usdg", label: "USDG token", addr: protocolConfig.stakeTokenAddress, note: "ERC-20 principal" },
            ].map((row) => (
              <li key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center py-5">
                <div className="md:col-span-3">
                  <p className="font-display font-bold">{row.label}</p>
                  <p className="text-[13px] text-ink/60">{row.note}</p>
                </div>
                <p className="md:col-span-7 font-mono text-[12px] sm:text-[13px] break-all">{row.addr || "Pending deployment"}</p>
                <div className="md:col-span-2 flex md:justify-end gap-2">
                  <button
                    onClick={() => copyToClipboard(row.addr, row.id)}
                    className="grid place-items-center w-9 h-9 border border-ink/30 hover:border-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                    aria-label={`Copy ${row.label} address`}
                  >
                    {copied === row.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {row.addr && (
                    <a
                      href={`${protocolConfig.explorerUrl}/address/${row.addr}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid place-items-center w-9 h-9 border border-ink/30 hover:border-ink hover:bg-ink hover:text-paper transition-colors"
                      aria-label={`View ${row.label} on explorer`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
export default StatsViewer;
