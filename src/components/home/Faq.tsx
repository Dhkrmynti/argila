"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Reveal } from "@/components/kiln/Reveal";

const FAQS = [
  {
    q: "Is there a lockup, waiting period or exit fee?",
    a: "No. Deposit and withdraw whenever you like. The contract has no unbonding period and charges no deposit or withdrawal fee; you only pay Robinhood Chain gas in ETH.",
  },
  {
    q: "How are rewards worked out?",
    a: "The contract keeps a running reward-per-token figure. Each block, ARGL is credited to every staker in proportion to their share of the kiln, without looping over accounts, so your cost doesn't grow as the kiln grows.",
  },
  {
    q: "Do the firing stages earn more?",
    a: "No. Stages (Cold, Kindling, Bisque, Glaze, Porcelain) show how long your position has been staked. Everyone earns at the same rate per USDG; a longer stay simply means more blocks of rewards.",
  },
  {
    q: "When can I collect my ARGL?",
    a: "Any time. Claiming sends accrued ARGL to your wallet and leaves your USDG in the kiln, still earning. Withdrawing USDG doesn't claim for you, so your unclaimed ARGL waits until you do.",
  },
  {
    q: "Why Robinhood Chain?",
    a: "It's where USDG lives, and low network fees make it sensible to claim small amounts or adjust your stake often.",
  },
];

export const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32 grid lg:grid-cols-12 gap-12">
      <Reveal className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-4 font-display font-bold text-[2.6rem] sm:text-5xl tracking-[-0.04em] leading-[0.98]">Before you fire.</h2>
          <Link href="/docs" className="mt-8 btn btn-ghost">
            Read the docs <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

      <div className="lg:col-span-8 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className={`rounded-3xl border transition-colors duration-300 ${isOpen ? "border-glow/30 bg-flame/[0.05]" : "border-line bg-bone/[0.015] hover:border-line-strong"}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 text-left px-6 sm:px-7 py-5 sm:py-6 cursor-pointer"
                >
                  <span className="font-display font-semibold text-lg sm:text-xl tracking-tight">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`shrink-0 w-9 h-9 grid place-items-center rounded-full ${isOpen ? "bg-heat text-coal" : "bg-bone/[0.06] text-bone"}`}
                    aria-hidden="true"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 sm:px-7 pb-6 pr-16 text-bone-2 leading-relaxed text-[16px]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
