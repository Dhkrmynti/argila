"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatApy, formatTokenAmount } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { ArrowUpRight, Check, Copy, ExternalLink } from "lucide-react";
import { RollingNumber } from "@/components/vault/RollingNumber";
import { Stamp } from "@/components/vault/Stamp";

interface LiveMetricsProps {
  totalStaked?: bigint;
  calculatedApy?: number;
  totalStakers?: number;
  stakeDecimals?: number;
}

export const LiveMetricsSection: React.FC<LiveMetricsProps> = ({
  totalStaked,
  calculatedApy,
  totalStakers,
  stakeDecimals = 6,
}) => {
  const [copiedContract, setCopiedContract] = useState(false);

  const copyContractAddress = () => {
    if (protocolConfig.stakingContractAddress) {
      navigator.clipboard.writeText(protocolConfig.stakingContractAddress);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  const lines = [
    {
      label: "In the kiln",
      note: "USDG deposited across all accounts",
      value: totalStaked ? formatTokenAmount(totalStaked, stakeDecimals, 2) : "0.00",
      unit: "USDG",
      roll: true,
    },
    {
      label: "Estimated APY",
      note: "From the contract's reward rate and total deposits",
      value: calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—",
      unit: "",
      roll: false,
      hi: true,
    },
    {
      label: "Account holders",
      note: "Unique depositing addresses",
      value: totalStakers !== undefined ? totalStakers.toString() : "—",
      unit: "",
      roll: totalStakers !== undefined,
    },
    {
      label: "Lockup",
      note: "Time before a withdrawal can settle",
      value: "None",
      unit: "",
      roll: false,
    },
  ];

  const registry = [
    {
      label: "Staking contract",
      address: protocolConfig.stakingContractAddress || "0x50B0...8323",
      note: null as string | null,
      copy: true,
    },
    {
      label: "Stake asset · USDG",
      address: protocolConfig.stakeTokenAddress || "0x5fc5...1d168",
      note: "6 decimals",
      copy: false,
    },
    {
      label: "Reward asset · ARGL",
      address: protocolConfig.rewardTokenAddress || "0x4000...e8e7",
      note: "18 decimals",
      copy: false,
    },
  ];

  return (
    <section data-recede className="relative w-full text-paper py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-6">
            <h2 data-reveal="lines" className="font-display font-extrabold text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[0.98] text-balance">
              What the kiln holds.
            </h2>
            <p className="text-lg leading-relaxed text-paper-dim max-w-[30rem]">
              Every figure here is read directly from the staking contract on Robinhood Chain as the page loads.
            </p>
            <p className="flex items-center gap-2.5 font-mono text-[12px] text-paper-dim">
              <span className="w-1.5 h-1.5 rounded-full bg-terra-hi tick-dot" aria-hidden="true" />
              Chain ID {protocolConfig.chainId} · read live
            </p>
          </div>
        </div>

        {/* The statement sheet */}
        <div className="lg:col-span-8">
          <div data-reveal="paper" className="paper tint on-paper relative">
            <div className="perf-x mx-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
            <div className="px-5 sm:px-10 pt-6 pb-10">
              <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-ink">
                <div>
                  <p className="font-display font-extrabold text-2xl sm:text-3xl leading-none">Kiln report</p>
                  <p className="mt-2 font-mono text-[11px] text-ink/60">Argila · USDG deposits · ARGL rewards</p>
                </div>
                <Stamp tone="cobalt" tilt={-8} className="hidden sm:inline-flex text-[15px] shrink-0" sub={`chain ${protocolConfig.chainId}`}>
                  On-chain
                </Stamp>
              </div>

              <dl className="ledger [--rule:rgba(18,14,11,0.16)]">
                {lines.map((line) => (
                  <div key={line.label} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 items-baseline py-6 sm:py-7">
                    <dt className="sm:col-span-5">
                      <span className="block font-display font-bold text-lg">{line.label}</span>
                      <span className="block text-[14px] text-ink/60 mt-0.5">
                        {line.value === "—" ? "Awaiting a read from the chain" : line.note}
                      </span>
                    </dt>
                    <dd className="sm:col-span-7 sm:text-right font-display font-extrabold leading-none text-[2.4rem] sm:text-5xl lg:text-[3.4rem] break-words">
                      {line.roll ? <RollingNumber value={line.value} /> : line.value}
                      {line.unit && <span className="ml-2 font-mono font-normal text-base text-ink/55 align-middle">{line.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Registered contracts */}
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-terra/30">
              <h3 className="font-display font-bold text-2xl sm:text-3xl leading-none">Registered contracts</h3>
              <span className="font-mono text-[12px] text-paper-faint tnum">Robinhood Chain · {protocolConfig.chainId}</span>
            </div>
            <ul data-reveal="rows" className="ledger [--rule:rgba(210,105,60,0.18)]">
              {registry.map((row) => (
                <li key={row.label} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-6 items-center py-5">
                  <span className="md:col-span-3 wide text-[15px] font-medium text-paper-dim">{row.label}</span>
                  <span className="md:col-span-7 font-mono text-[12px] sm:text-[13px] text-paper break-all">{row.address}</span>
                  <span className="md:col-span-2 md:text-right font-mono text-[12px] text-terra-hi">
                    {row.copy ? (
                      <button
                        type="button"
                        onClick={copyContractAddress}
                        className="inline-flex items-center gap-1.5 hover:text-paper transition-colors cursor-pointer"
                        title="Copy staking contract address"
                      >
                        {copiedContract ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedContract ? "Copied" : "Copy"}
                      </button>
                    ) : (
                      row.note
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 wide text-[15px]">
              <a
                href={`${protocolConfig.explorerUrl}/address/${protocolConfig.stakingContractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-paper-dim hover:text-paper transition-colors"
              >
                Inspect the contract on the explorer
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link href="/stats" className="inline-flex items-center gap-2 font-medium text-terra-hi hover:text-paper transition-colors">
                Full kiln report
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMetricsSection;
