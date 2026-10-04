"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { protocolConfig } from "@/lib/blockchain/config";
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";

export const Scene07Security: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string | undefined, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const securityInvariants = [
    {
      title: "NON-REENTRANT GUARD",
      engine: "OpenZeppelin Standard",
      description: "All deposit, withdraw, and reward distribution functions enforce strict mutex locks, preventing reentrancy vectors.",
    },
    {
      title: "NON-CUSTODIAL SOLVENCY",
      engine: "Direct Vault Accounting",
      description: "USDG principal is held directly in the smart contract. Zero lending, zero re-hypothecation, zero algorithmic debt.",
    },
    {
      title: "ZERO SLASHING RISKS",
      engine: "Pure Staking Model",
      description: "Staking USDG does not delegate to validator slashable hardware. Capital remains 100% protected against validator downtime.",
    },
    {
      title: "INSTANT SETTLEMENT",
      engine: "Zero Cooldown Unbonding",
      description: "Withdrawals execute on-chain in the same block. No 7-day or 21-day unbonding lockup penalties.",
    },
  ];

  const contracts = [
    {
      label: "STAKING VAULT CONTRACT",
      address: protocolConfig.stakingContractAddress || "TBA (Announced at Mainnet Launch)",
      id: "vault",
    },
    {
      label: "STAKE ASSET (USDG)",
      address: protocolConfig.stakeTokenAddress || "TBA (Announced at Mainnet Launch)",
      id: "usdg",
    },
    {
      label: "REWARD ASSET",
      address: protocolConfig.rewardTokenAddress || "TBA (Announced at Mainnet Launch)",
      id: "reward",
    },
  ];

  return (
    <section
      id="security"
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[500px] bg-[#c8f53c]/[0.03] blur-[180px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c8f53c] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-cursive text-[#c8f53c] text-base lowercase tracking-normal">
              ~ immutable smart contracts ~
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.02em] text-white uppercase leading-[0.9]">
            PROVABLE <span className="text-[#c8f53c]">SOLVENCY</span>
          </h2>

          <p className="text-sm sm:text-base font-light text-[#8e95a2] font-sans">
            Argila contracts are non-upgradable and strictly non-custodial. Every invariant is enforced mathematically on Robinhood Chain.
          </p>
        </div>

        {/* 4 Invariant Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityInvariants.map((item) => (
            <div key={item.title} className="sg-tier-container">
              <div className="sg-tier-underlay-1" />
              <div className="sg-tier-underlay-2" />
              <div className="sg-tier-main p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#c8f53c] font-semibold">{item.engine}</span>
                  <ShieldCheck className="w-5 h-5 text-[#c8f53c]" />
                </div>
                <h3 className="font-editorial text-2xl font-bold uppercase text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contract Registry */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="text-xs font-mono text-[#8e95a2] uppercase tracking-wider block">
            VERIFIED ON-CHAIN CONTRACTS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {contracts.map((c) => (
              <div key={c.id} className="p-4 rounded-xl liquid-glass-subcard border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[#8e95a2]">
                  <span>{c.label}</span>
                  <button onClick={() => copyToClipboard(c.address, c.id)} className="hover:text-white">
                    {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-[#c8f53c]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-white font-semibold truncate">{c.address}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Scene07Security;
