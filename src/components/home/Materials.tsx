import React from "react";
import { Reveal } from "@/components/kiln/Reveal";
import { HeatTitle } from "@/components/kiln/HeatTitle";
import { VesselMark } from "@/components/kiln/Logo";

/* Clay and fire: what goes in and what comes out, laid out as a bento of fired tiles. */
export const Materials: React.FC = () => (
  <section className="relative mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32">
    <Reveal className="max-w-2xl">
      <p className="eyebrow">Two materials</p>
      <HeatTitle className="mt-4 font-display font-bold text-[2.6rem] sm:text-6xl tracking-[-0.04em] leading-[0.95] text-balance">
        Clay in. <span className="text-heat">Fire out.</span>
      </HeatTitle>
    </Reveal>

    <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* The clay: a light, unfired tile */}
      <Reveal className="md:col-span-3 md:row-span-2 rounded-[1.75rem] bg-bone text-coal p-7 sm:p-10 flex flex-col min-h-[22rem] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11.5px] tracking-[0.08em] uppercase text-coal/55">What you put in</p>
          <img src="/usdg-icon.png" alt="" width={36} height={36} className="w-9 h-9 rounded-full" />
        </div>
        <p className="mt-auto pt-16 font-display font-bold text-7xl sm:text-8xl tracking-[-0.05em] leading-none">USDG</p>
        <p className="mt-5 text-[17px] leading-relaxed text-coal/70 max-w-sm">
          The dollar-pegged stablecoin on Robinhood Chain. It&apos;s your principal, and it comes back out exactly as it went in.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-[13px] font-medium">
          {["Returned 1:1", "6 decimals", "Never burned"].map((f) => (
            <li key={f} className="px-3 h-8 inline-flex items-center rounded-full bg-coal/[0.07]">{f}</li>
          ))}
        </ul>
      </Reveal>

      {/* The fire: a hot tile */}
      <Reveal delay={0.08} className="md:col-span-3 md:row-span-2 surface-hot p-7 sm:p-10 flex flex-col min-h-[22rem] overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="eyebrow">What comes out</p>
          <VesselMark className="w-9 h-9" id="mat" />
        </div>
        <p className="mt-auto pt-16 font-display font-bold text-7xl sm:text-8xl tracking-[-0.05em] leading-none text-heat">ARGL</p>
        <p className="mt-5 text-[17px] leading-relaxed text-bone-2 max-w-sm">
          The reward token the kiln fires for every staker, in proportion to their share, with every block.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-[13px] font-medium text-bone">
          {["Accrues per block", "No vesting", "18 decimals"].map((f) => (
            <li key={f} className="px-3 h-8 inline-flex items-center rounded-full bg-bone/[0.07] border border-line">{f}</li>
          ))}
        </ul>
      </Reveal>

      {[
        { k: "Lockup", v: "None", d: "Withdraw any time, in full or in part." },
        { k: "Fees", v: "0%", d: "No deposit or withdrawal fee. Only network gas." },
        { k: "Custody", v: "Yours", d: "Funds sit in an open, verified contract, not with us." },
      ].map((t, i) => (
        <Reveal key={t.k} delay={0.12 + i * 0.06} className="md:col-span-2 surface p-7">
          <p className="eyebrow">{t.k}</p>
          <p className="mt-3 font-display font-bold text-5xl tracking-[-0.04em]">{t.v}</p>
          <p className="mt-3 text-[15px] text-bone-2 leading-relaxed">{t.d}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Materials;
