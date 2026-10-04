import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import { Reveal } from "@/components/kiln/Reveal";
import { RollingNumber } from "@/components/kiln/RollingNumber";
import { CopyAddress } from "@/components/kiln/CopyAddress";

interface LiveKilnProps {
  apy: string;
  inKiln: string;
  stakers: string;
}

/* Every figure here is read from the staking contract as the page loads. */
export const LiveKiln: React.FC<LiveKilnProps> = ({ apy, inKiln, stakers }) => (
  <section className="relative mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <Reveal>
        <p className="eyebrow flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />
          Read live · chain {protocolConfig.chainId}
        </p>
        <h2 className="mt-4 font-display font-bold text-[2.6rem] sm:text-6xl tracking-[-0.04em] leading-[0.95]">The kiln, right now.</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <Link href="/stats" className="btn btn-ghost">
          All stats <ArrowUpRight className="w-4 h-4" />
        </Link>
      </Reveal>
    </div>

    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { k: "In the kiln", v: inKiln, u: "USDG", roll: true, note: "Total USDG staked by everyone" },
        { k: "Estimated APY", v: apy, hot: true, note: "From the reward rate and total staked" },
        { k: "Stakers", v: stakers, roll: stakers !== "—", note: "Unique addresses with a position" },
      ].map((m, i) => (
        <Reveal key={m.k} delay={i * 0.08} className="surface p-7 sm:p-8">
          <p className="eyebrow">{m.k}</p>
          <p className={`mt-4 font-display font-bold text-5xl sm:text-[3.4rem] tracking-[-0.04em] leading-none tnum break-words ${m.hot ? "text-heat" : ""}`}>
            {m.roll ? <RollingNumber value={m.v} /> : m.v}
            {m.u && <span className="ml-2 font-mono font-normal text-sm text-bone-3 tracking-normal">{m.u}</span>}
          </p>
          <p className="mt-4 text-[14px] text-bone-3">{m.v === "—" ? "Waiting for a read from the chain" : m.note}</p>
        </Reveal>
      ))}
    </div>

    <Reveal delay={0.1} className="mt-4 surface px-6 sm:px-8 divide-y divide-line">
      <CopyAddress label="Staking contract" address={protocolConfig.stakingContractAddress} />
      <CopyAddress label="USDG" note="Stake asset · 6 decimals" address={protocolConfig.stakeTokenAddress} />
      <CopyAddress label="ARGL" note="Reward asset · 18 decimals" address={protocolConfig.rewardTokenAddress} />
    </Reveal>
  </section>
);

export default LiveKiln;
