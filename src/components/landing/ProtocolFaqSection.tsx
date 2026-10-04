"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Is there a lockup, a waiting period, or an exit fee?",
    answer:
      "No. You can deposit and withdraw at any time. The contract has no unbonding period and charges no deposit or withdrawal fee; you only pay the network fee in ETH.",
  },
  {
    question: "How are my rewards worked out?",
    answer:
      "The contract keeps a running reward-per-token figure. When a block lands, ARGL is credited to every depositor in proportion to their share of the kiln, without looping over accounts, so the cost to you does not grow as the kiln grows.",
  },
  {
    question: "When can I collect my ARGL?",
    answer:
      "Whenever you like. Claiming sends your accrued ARGL to your wallet and leaves your USDG in the kiln, still earning. Exiting does both at once.",
  },
  {
    question: "Why Robinhood Chain?",
    answer:
      "It is where USDG lives, and its low network fees make it reasonable to claim small amounts or adjust your deposit often.",
  },
];

export const ProtocolFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section data-recede className="relative w-full bg-ink-3/75 text-paper py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div data-reveal="band" className="band-wave absolute top-0 inset-x-0 text-terra/30" aria-hidden="true" />
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-6">
            <h2 data-reveal="lines" className="font-display font-extrabold text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[0.98] text-balance">
              Before you fire.
            </h2>
            <p className="text-lg leading-relaxed text-paper-dim max-w-[28rem]">
              The short version of what the contract does with your money.
            </p>
            <Link href="/docs" className="btn btn-line">
              Read the documentation
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div data-reveal="rows" className="lg:col-span-8 border-t border-terra/40">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-terra/20">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group w-full py-7 sm:py-8 flex items-start justify-between gap-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display font-bold text-xl sm:text-2xl leading-snug transition-colors duration-300 ${
                      isOpen ? "text-terra-hi" : "text-paper group-hover:text-terra-hi"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`mt-1 w-9 h-9 shrink-0 grid place-items-center rounded-full border transition-colors duration-300 ${
                      isOpen ? "border-terra-hi text-terra-hi" : "border-paper/30 text-paper group-hover:border-terra-hi"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                      animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                      exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pr-14 text-lg leading-relaxed text-paper-dim max-w-[62ch]">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProtocolFaqSection;
